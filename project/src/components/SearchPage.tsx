import React, { useState, useRef } from 'react';
import { Search, MapPin, Calendar, DollarSign, Building, Mic, MicOff, Filter, GraduationCap, Globe, MessageSquare, Zap, X, Plus, Briefcase, Clock, Users, Star, ArrowRight, Award, Target, CheckCircle, AlertCircle, BookOpen, ExternalLink, TrendingUp, Sparkles, User, Mail } from 'lucide-react';
import { User as UserType, Internship } from '../types';
import { mockInternships } from '../data/mockData';
import { translations } from '../utils/translations';

type Language = 'en' | 'hi' | 'mr';

interface SearchPageProps {
  user: UserType;
  language: Language;
}

interface SkillGapData {
  internship: Internship;
  matchedSkills: string[];
  missingSkills: string[];
  suggestedResources: { skill: string; resource: string; url: string }[];
}

interface FormData {
  idealInternship: string;
  languageSupport: string[];
  preferredLocation: string;
  collegeName: string;
  fieldOfStudy: string;
  sectorInterest: string;
  graduationYear: string;
  skills: string[];
}

const SearchPage: React.FC<SearchPageProps> = ({ user, language }) => {
  const [formData, setFormData] = useState<FormData>({
    idealInternship: '',
    languageSupport: [],
    preferredLocation: user.location || '',
    collegeName: user.education?.split(' - ')[0] || '',
    fieldOfStudy: user.education?.split(' - ')[1] || '',
    sectorInterest: '',
    graduationYear: user.education?.split(' - ')[2] || '',
    skills: user.skills || [],
  });
  
  const [isListening, setIsListening] = useState(false);
  const [recommendations, setRecommendations] = useState<Internship[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSkillGapModal, setShowSkillGapModal] = useState(false);
  const [skillGapData, setSkillGapData] = useState<SkillGapData | null>(null);
  const [newSkill, setNewSkill] = useState('');
  
  const recognitionRef = useRef<any>(null);
  const t = translations[language];

  const languageOptions = [
    'English', 'Hindi', 'Marathi', 'Tamil', 'Telugu', 'Bengali'
  ];

  const fieldOfStudyOptions = [
    'Engineering', 'Arts', 'Commerce', 'Science', 'Medicine', 'Law', 'Management', 'Computer Applications', 'Architecture', 'Design'
  ];

  const sectorOptions = [
    'Technology', 'Finance', 'Healthcare', 'Education', 'Marketing', 'Design', 'Consulting', 'Media', 'Government', 'Non-Profit'
  ];

  const skillOptions = [
    'React', 'Python', 'Java', 'JavaScript', 'SQL', 'Machine Learning', 'UI/UX Design', 'Digital Marketing'
  ];

  const locationOptions = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Remote'
  ];

  const currentYear = new Date().getFullYear();
  const graduationYears = Array.from({ length: 10 }, (_, i) => (currentYear + 5 - i).toString());

  // Initialize speech recognition
  React.useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setFormData(prev => ({
          ...prev,
          idealInternship: prev.idealInternship + ' ' + transcript
        }));
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, [language]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.idealInternship.trim()) return;
    
    setIsSubmitting(true);

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Filter and rank internships based on description
    const filtered = mockInternships.filter(internship => {
      const description = formData.idealInternship.toLowerCase();
      
      // Check for matches in title, company, requirements, or category
      const matchesTitle = internship.title.toLowerCase().includes(description) ||
                          description.includes(internship.title.toLowerCase());
      const matchesCategory = internship.category.toLowerCase().includes(description) ||
                             description.includes(internship.category.toLowerCase());
      const matchesRequirements = internship.requirements.some(req => 
        req.toLowerCase().includes(description) || description.includes(req.toLowerCase())
      );
      const matchesLocation = internship.location.toLowerCase().includes(description) ||
                             description.includes(internship.location.toLowerCase());

      return matchesTitle || matchesCategory || matchesRequirements || matchesLocation;
    });

    // Sort by AI match score and take top 5
    const sortedResults = (filtered.length > 0 ? filtered : mockInternships)
      .map(internship => ({
        ...internship,
        matchScore: getAIMatchScore(internship)
      }))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);

    setRecommendations(sortedResults);
    setIsSubmitting(false);
  };

  const getAIMatchScore = (internship: Internship) => {
    let score = 60; // Base score
    
    const description = formData.idealInternship.toLowerCase();
    
    // Title match
    if (internship.title.toLowerCase().includes(description) || 
        description.includes(internship.title.toLowerCase())) {
      score += 20;
    }
    
    // Requirements match
    const skillMatches = internship.requirements.filter(req => 
      req.toLowerCase().includes(description) || description.includes(req.toLowerCase())
    ).length;
    score += Math.min(skillMatches * 5, 15);
    
    // Location match
    if (internship.location.toLowerCase().includes(description) || 
        description.includes(internship.location.toLowerCase())) {
      score += 5;
    }
    
    return Math.min(score, 100);
  };

  const analyzeSkillGap = (internship: Internship) => {
    const userSkills = formData.skills.map(skill => skill.toLowerCase());
    const requiredSkills = internship.requirements.map(skill => skill.toLowerCase());
    
    const matchedSkills = internship.requirements.filter(skill => 
      userSkills.includes(skill.toLowerCase())
    );
    
    const missingSkills = internship.requirements.filter(skill => 
      !userSkills.includes(skill.toLowerCase())
    );

    const suggestedResources = missingSkills.map(skill => ({
      skill,
      resource: getResourceForSkill(skill),
      url: getResourceUrl(skill)
    }));

    const skillGapData: SkillGapData = {
      internship,
      matchedSkills,
      missingSkills,
      suggestedResources
    };

    setSkillGapData(skillGapData);
    setShowSkillGapModal(true);
  };

  const getResourceForSkill = (skill: string): string => {
    const resources: { [key: string]: string } = {
      'docker': 'Docker Official Tutorial',
      'aws': 'AWS Free Tier Training',
      'kubernetes': 'Kubernetes Basics Course',
      'python': 'Python for Beginners',
      'machine learning': 'ML Crash Course by Google',
      'sql': 'SQL Fundamentals',
      'figma': 'Figma Design Basics',
      'adobe creative suite': 'Adobe Creative Cloud Tutorials',
      'seo': 'Google SEO Starter Guide',
      'analytics': 'Google Analytics Academy',
      'excel': 'Microsoft Excel Training',
      'presentation skills': 'Effective Presentation Skills Course'
    };
    
    return resources[skill.toLowerCase()] || `Learn ${skill} fundamentals`;
  };

  const getResourceUrl = (skill: string): string => {
    const urls: { [key: string]: string } = {
      'docker': 'https://docs.docker.com/get-started/',
      'aws': 'https://aws.amazon.com/training/',
      'kubernetes': 'https://kubernetes.io/docs/tutorials/',
      'python': 'https://www.python.org/about/gettingstarted/',
      'machine learning': 'https://developers.google.com/machine-learning/crash-course',
      'sql': 'https://www.w3schools.com/sql/',
      'figma': 'https://help.figma.com/hc/en-us/categories/360002051613',
      'adobe creative suite': 'https://helpx.adobe.com/creative-suite.html',
      'seo': 'https://developers.google.com/search/docs/beginner/seo-starter-guide',
      'analytics': 'https://analytics.google.com/analytics/academy/',
      'excel': 'https://support.microsoft.com/en-us/office/excel-help-center',
      'presentation skills': '#'
    };
    
    return urls[skill.toLowerCase()] || '#';
  };

  const handleMultiSelectChange = (field: keyof FormData, value: string) => {
    setFormData(prev => {
      const currentValues = prev[field] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [field]: newValues };
    });
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-6 py-3 rounded-full text-sm font-medium mb-6 border border-blue-200">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Internship Discovery
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Find Your Perfect Internship
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Describe your ideal opportunity and let our AI match you with the best internships
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Search Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sticky top-8 backdrop-blur-sm bg-white/95">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-3 mr-4">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Search Criteria</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Describe Your Ideal Internship */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                    Describe Your Ideal Internship
                  </h3>
                  
                  <div className="relative">
                    <textarea
                      value={formData.idealInternship}
                      onChange={(e) => setFormData(prev => ({ ...prev, idealInternship: e.target.value }))}
                      placeholder="Tell us about your ideal internship - what role, industry, skills you want to develop, company culture, location preferences, etc."
                      className="w-full h-32 px-4 py-3 pr-14 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 resize-none text-sm placeholder-gray-500 transition-all duration-200 shadow-sm hover:shadow-md"
                      required
                    />
                    <button
                      type="button"
                      onClick={isListening ? stopListening : startListening}
                      className={`absolute bottom-3 right-3 p-2 rounded-full transition-all duration-200 shadow-lg ${
                        isListening 
                          ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse' 
                          : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-110'
                      }`}
                      title={isListening ? 'Stop listening' : 'Start voice input'}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                  </div>
                  {isListening && (
                    <div className="mt-3 flex items-center text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-200">
                      <div className="w-3 h-3 bg-red-600 rounded-full mr-3 animate-pulse"></div>
                      <span className="text-sm font-medium">Listening for your voice...</span>
                    </div>
                  )}
                </div>

                {/* Language Support */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                    <Globe className="w-5 h-5 mr-2 text-blue-600" />
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Language Support 🌐
                    </span>
                  </h3>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border-2 border-blue-100 hover:border-blue-200 transition-all duration-200">
                    <p className="text-sm text-gray-600 mb-4 flex items-center">
                      🗣️ <span className="ml-2">Select languages you're comfortable working in:</span>
                    </p>
                    
                    {/* Language Selection Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {languageOptions.map(lang => {
                        const isSelected = formData.languageSupport.includes(lang);
                        const languageEmojis: { [key: string]: string } = {
                          'English': '🇬🇧',
                          'Hindi': '🇮🇳',
                          'Marathi': '🇮🇳',
                          'Tamil': '🇮🇳',
                          'Telugu': '🇮🇳',
                          'Bengali': '🇮🇳'
                        };
                        
                        return (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => handleMultiSelectChange('languageSupport', lang)}
                            className={`p-4 rounded-xl border-2 transition-all duration-200 text-left hover:scale-105 transform shadow-sm hover:shadow-md ${
                              isSelected
                                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-blue-500 shadow-lg'
                                : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <span className="text-lg mr-3">{languageEmojis[lang] || '🌍'}</span>
                                <span className="font-medium">{lang}</span>
                              </div>
                              {isSelected && (
                                <div className="bg-white bg-opacity-20 rounded-full p-1">
                                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    
                    {/* Selected Languages Summary */}
                    {formData.languageSupport.length > 0 && (
                      <div className="bg-white rounded-xl p-3 border border-blue-200">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          ✅ Selected Languages ({formData.languageSupport.length}):
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {formData.languageSupport.map(lang => (
                            <span key={lang} className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-200">
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {formData.languageSupport.length === 0 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                        <p className="text-sm text-yellow-700 flex items-center">
                          ⚠️ <span className="ml-2">Please select at least one language to improve your internship matches</span>
                        </p>
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-500 mt-3 flex items-center">
                      💡 <span className="ml-1">Tip: Select all languages you can work comfortably in to get more opportunities</span>
                    </p>
                  </div>
                </div>


                {/* Preferred Location */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                    <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                      Preferred Location 🌍
                    </span>
                  </h3>
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-4 border-2 border-green-100 hover:border-green-200 transition-all duration-200">
                    <p className="text-sm text-gray-600 mb-4">📍 Where would you like to work?</p>
                    <select
                      value={formData.preferredLocation}
                      onChange={(e) => setFormData(prev => ({ ...prev, preferredLocation: e.target.value }))}
                      className="w-full p-4 border-2 border-white rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-400 text-sm shadow-lg bg-white transition-all duration-200"
                    >
                      <option value="">🌍 Select your preferred location</option>
                      {locationOptions.map(location => (
                        <option key={location} value={location}>
                          {location === 'Remote' && '🏠 '}
                          {location === 'Mumbai' && '🏙️ '}
                          {location === 'Delhi' && '🏛️ '}
                          {location === 'Bangalore' && '💻 '}
                          {!['Remote', 'Mumbai', 'Delhi', 'Bangalore'].includes(location) && '📍 '}
                          {location}
                        </option>
                      ))}
                    </select>
                    {formData.preferredLocation && (
                      <div className="mt-3 p-3 bg-white rounded-xl border border-green-200">
                        <span className="text-green-700 font-medium">
                          ✅ Selected: {formData.preferredLocation}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sector Interest */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-blue-600" />
                    <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      Sector Interest 🎯
                    </span>
                  </h3>
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-4 border-2 border-orange-100 hover:border-orange-200 transition-all duration-200">
                    <p className="text-sm text-gray-600 mb-4">🎯 Which sector interests you the most?</p>
                    <select
                      value={formData.sectorInterest}
                      onChange={(e) => setFormData(prev => ({ ...prev, sectorInterest: e.target.value }))}
                      className="w-full p-4 border-2 border-white rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 text-sm shadow-lg bg-white transition-all duration-200"
                    >
                      <option value="">🏢 Select your sector of interest</option>
                      {sectorOptions.map(sector => (
                        <option key={sector} value={sector}>
                          {sector === 'Technology' && '💻 '}
                          {sector === 'Finance' && '💰 '}
                          {sector === 'Healthcare' && '🏥 '}
                          {sector === 'Education' && '📚 '}
                          {sector === 'Marketing' && '📈 '}
                          {sector === 'Design' && '🎨 '}
                          {sector === 'Consulting' && '💼 '}
                          {sector === 'Media' && '📺 '}
                          {sector === 'Government' && '🏛️ '}
                          {sector === 'Non-Profit' && '🤝 '}
                          {sector}
                        </option>
                      ))}
                    </select>
                    {formData.sectorInterest && (
                      <div className="mt-3 p-3 bg-white rounded-xl border border-orange-200">
                        <span className="text-orange-700 font-medium">
                          ✅ Selected: {formData.sectorInterest}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {/* Education Background */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Education Background 🎓
                    </span>
                  </h3>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border-2 border-purple-100 hover:border-purple-200 transition-all duration-200 space-y-4">
                    <input
                      type="text"
                      value={formData.collegeName}
                      onChange={(e) => setFormData(prev => ({ ...prev, collegeName: e.target.value }))}
                      placeholder="🏫 College / University Name (e.g., IIT Mumbai, Delhi University)"
                      className="w-full p-4 border-2 border-white rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 text-sm shadow-lg bg-white placeholder-gray-500 transition-all duration-200"
                    />
                    <select
                      value={formData.fieldOfStudy}
                      onChange={(e) => setFormData(prev => ({ ...prev, fieldOfStudy: e.target.value }))}
                      className="w-full p-4 border-2 border-white rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 text-sm shadow-lg bg-white transition-all duration-200"
                    >
                      <option value="">📚 Select Field of Study</option>
                      {fieldOfStudyOptions.map(field => (
                        <option key={field} value={field}>{field}</option>
                      ))}
                    </select>
                    <select
                      value={formData.graduationYear}
                      onChange={(e) => setFormData(prev => ({ ...prev, graduationYear: e.target.value }))}
                      className="w-full p-4 border-2 border-white rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 text-sm shadow-lg bg-white transition-all duration-200"
                    >
                      <option value="">🗓️ Expected Graduation Year</option>
                      {graduationYears.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Skills & Technologies */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-blue-600" />
                    <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                      Skills & Technologies ⚡
                    </span>
                  </h3>
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 border-2 border-yellow-100 hover:border-yellow-200 transition-all duration-200">
                    <p className="text-sm text-gray-600 mb-4">⚡ What technologies and skills do you know?</p>
                    
                    {/* Selected Skills */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {formData.skills.map(skill => (
                        <span key={skill} className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center shadow-lg">
                          ⚡ {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="ml-2 text-white hover:text-gray-200 bg-white bg-opacity-20 rounded-full p-1"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    
                    {/* Add Custom Skill */}
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="💡 Add your own skill (e.g., Python, Design Thinking)"
                        className="flex-1 p-3 border-2 border-white rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-yellow-400 text-sm shadow-lg bg-white placeholder-gray-500 transition-all duration-200"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      />
                      <button
                        type="button"
                        onClick={addSkill}
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-lg transform hover:scale-105"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Popular Skills */}
                    <div>
                      <p className="text-xs text-gray-500 mb-3">💫 Quick add popular skills:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {skillOptions.filter(skill => !formData.skills.includes(skill)).map(skill => (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, skills: [...prev.skills, skill] }))}
                            className="bg-white text-gray-700 px-4 py-3 rounded-xl text-sm hover:bg-yellow-100 hover:text-yellow-700 transition-all duration-200 border-2 border-gray-200 hover:border-yellow-300 shadow-sm hover:shadow-md transform hover:scale-105 font-medium"
                          >
                            + {skill}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>


                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.idealInternship.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-5 rounded-2xl text-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:transform-none border-2 border-transparent hover:border-white"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin mr-3" />
                      🤖 AI is Finding Perfect Matches...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Sparkles className="w-6 h-6 mr-3 animate-pulse" />
                      🚀 Find My Dream Internship
                    </div>
                  )}
                </button>
              </form>

              {/* Quick Stats */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 text-center">Search Statistics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl p-3">
                      <div className="text-2xl font-bold">{recommendations.length}</div>
                      <div className="text-xs opacity-90">Top Matches</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl p-3">
                      <div className="text-2xl font-bold">
                        {recommendations.length > 0 ? Math.max(...recommendations.map(r => r.matchScore || getAIMatchScore(r))) : 0}%
                      </div>
                      <div className="text-xs opacity-90">Best Match</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Top 5 Recommendations */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {recommendations.length > 0 && (
                <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-4 border border-green-200 mb-6">
                  <div className="flex items-center">
                    <Star className="w-6 h-6 text-green-600 mr-3" />
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Top 5 AI-Ranked Matches</h3>
                      <p className="text-sm text-gray-600">Showing the best internships based on your preferences</p>
                    </div>
                  </div>
                </div>
              )}
              
              {recommendations.map((internship, index) => {
                const matchScore = internship.matchScore || getAIMatchScore(internship);
                return (
                  <div key={internship.id} className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm bg-white/95">
                    {/* AI Match Score */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-3 shadow-lg">
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                            <span className="text-blue-600 text-sm font-bold">#{index + 1}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">AI MATCH SCORE</p>
                          <div className="flex items-center space-x-3">
                            <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                              {matchScore}/100
                            </span>
                            {index === 0 && matchScore >= 85 && (
                              <span className="bg-gradient-to-r from-green-400 to-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                                🏆 #1 Best Match
                              </span>
                            )}
                            {index === 0 && matchScore >= 75 && matchScore < 85 && (
                              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                ⭐ Top Pick
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-full transition-all duration-1000 shadow-sm"
                            style={{width: `${matchScore}%`}}
                          ></div>
                        </div>
                        <Star className="w-6 h-6 text-yellow-500 drop-shadow-sm" />
                      </div>
                    </div>

                    {/* Job Title & Company */}
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
                        {internship.title}
                      </h3>
                      <div className="flex items-center space-x-4 mb-2">
                        <p className="text-xl text-gray-700 font-semibold">{internship.company}</p>
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                          {internship.category}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-5 h-5 mr-2" />
                        <span className="text-lg">{internship.location}</span>
                        {internship.remote && (
                          <span className="ml-3 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                            Remote Available
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stipend */}
                    <div className="mb-6">
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-4 border border-green-200">
                        <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                          ₹{internship.stipend.toLocaleString()}
                        </span>
                        <span className="text-gray-600 ml-2 text-lg">per month</span>
                        <div className="flex items-center mt-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          {internship.duration} • 
                          <Calendar className="w-4 h-4 ml-2 mr-1" />
                          Starts {internship.startDate}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                      {internship.description}
                    </p>

                    {/* Language Support */}
                    <div className="mb-6">
                      <p className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                        <Globe className="w-4 h-4 mr-2" />
                        Language Support:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {internship.supportedLanguages.map((lang) => (
                          <span
                            key={lang}
                            className={`px-4 py-2 rounded-full text-sm font-medium flex items-center shadow-sm ${
                              lang === 'en' ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-gray-100 text-gray-700 border border-gray-300'
                            }`}
                          >
                            <Globe className="w-3 h-3 mr-2" />
                            {lang === 'en' ? 'English ✓' : lang === 'hi' ? 'हिंदी' : 'मराठी'}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Skills Tags */}
                    <div className="mb-6">
                      <p className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                        <Target className="w-4 h-4 mr-2" />
                        Required Skills:
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {internship.requirements.map((req) => {
                          const isMatched = formData.skills.some(skill => 
                            skill.toLowerCase() === req.toLowerCase()
                          );
                          return (
                            <span
                              key={req}
                              className={`px-4 py-2 rounded-full text-sm font-medium shadow-sm border transition-all duration-200 ${
                                isMatched
                                  ? 'bg-green-100 text-green-700 border-green-300'
                                  : 'bg-orange-100 text-orange-700 border-orange-300'
                              }`}
                            >
                              {isMatched ? '✓ ' : '• '}
                              {req}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Skill Gap Analysis Button */}
                    <div className="mb-6">
                      <button
                        onClick={() => analyzeSkillGap(internship)}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center"
                      >
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Check Skill Gaps
                      </button>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center bg-blue-50 px-3 py-2 rounded-lg">
                          <Clock className="w-4 h-4 mr-2 text-blue-600" />
                          <span className="font-medium">{internship.duration}</span>
                        </div>
                        <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
                          <Calendar className="w-4 h-4 mr-2 text-gray-600" />
                          <span>Posted {internship.postedDays} days ago</span>
                        </div>
                        <span className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wide">
                          {internship.type}
                        </span>
                      </div>
                      
                      <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:scale-105">
                        Apply Now
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {recommendations.length === 0 && !isSubmitting && (
                <div className="text-center py-12">
                  <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                    <Search className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Find Your Dream Internship?</h3>
                  <p className="text-gray-600">Fill out the form and let our AI find the perfect matches for you!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Skill Gap Analysis Modal */}
      {showSkillGapModal && skillGapData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-gray-200">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-3 mr-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Skill Gap Analysis</h2>
                  <p className="text-gray-600">{skillGapData.internship.title} at {skillGapData.internship.company}</p>
                </div>
              </div>
              <button
                onClick={() => setShowSkillGapModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8">
              {/* Matched Skills */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">Matched Skills ✅</h3>
                  <span className="ml-3 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    {skillGapData.matchedSkills.length} skills
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {skillGapData.matchedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium border border-green-300 shadow-sm"
                    >
                      ✅ {skill}
                    </span>
                  ))}
                  {skillGapData.matchedSkills.length === 0 && (
                    <p className="text-gray-500 italic">No matching skills found. Consider learning the required skills below.</p>
                  )}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <AlertCircle className="w-6 h-6 text-orange-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">Missing Skills ❌</h3>
                  <span className="ml-3 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                    {skillGapData.missingSkills.length} skills
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {skillGapData.missingSkills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium border border-orange-300 shadow-sm"
                    >
                      ❌ {skill}
                    </span>
                  ))}
                  {skillGapData.missingSkills.length === 0 && (
                    <p className="text-green-600 font-medium">🎉 Congratulations! You have all the required skills for this internship.</p>
                  )}
                </div>
              </div>

              {/* Suggested Resources */}
              {skillGapData.suggestedResources.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <BookOpen className="w-6 h-6 text-blue-600 mr-3" />
                    <h3 className="text-xl font-bold text-gray-900">Suggested Resources 📘</h3>
                  </div>
                  <div className="space-y-3">
                    {skillGapData.suggestedResources.map((resource) => (
                      <div
                        key={resource.skill}
                        className="bg-blue-50 border border-blue-200 rounded-xl p-4 hover:bg-blue-100 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">{resource.skill}</h4>
                            <p className="text-blue-700 text-sm">{resource.resource}</p>
                          </div>
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center shadow-sm"
                          >
                            Learn
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowSkillGapModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Close Analysis
                </button>
                <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-colors shadow-lg">
                  Apply Anyway
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;