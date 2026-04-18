import React, { useEffect, useState } from 'react';
import { ArrowRight, Brain, Shield, Building2, Users, TrendingUp, Star, Play } from 'lucide-react';
import { translations } from '../utils/translations';

type Language = 'en' | 'hi' | 'mr';

interface LandingPageProps {
  onLogin: () => void;
  onSignup: () => void;
  onFindInternship: () => void;
  language: Language;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onSignup, onFindInternship, language }) => {
  const [currentStats, setCurrentStats] = useState({
    opportunities: 0,
    companies: 0,
    interns: 0
  });

  const t = translations[language];
  
  const targetStats = {
    opportunities: 10000,
    companies: 500,
    interns: 1200
  };

  // Animated counter effect
  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      setCurrentStats({
        opportunities: Math.floor(targetStats.opportunities * easeOutQuart),
        companies: Math.floor(targetStats.companies * easeOutQuart),
        interns: Math.floor(targetStats.interns * easeOutQuart)
      });
      
      if (step >= steps) {
        clearInterval(timer);
        setCurrentStats(targetStats);
      }
    }, stepDuration);
    
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: <Brain className="w-12 h-12 text-blue-600" />,
      title: t.aiPowered,
      description: t.aiPoweredDesc
    },
    {
      icon: <Shield className="w-12 h-12 text-green-600" />,
      title: t.govCertified,
      description: t.govCertifiedDesc
    },
    {
      icon: <Building2 className="w-12 h-12 text-orange-600" />,
      title: t.diverseSectors,
      description: t.diverseSectorsDesc
    }
  ];

  const steps = [
    {
      number: '01',
      title: t.step1Title,
      description: t.step1Desc,
      icon: <Users className="w-8 h-8 text-blue-600" />
    },
    {
      number: '02',
      title: t.step2Title,
      description: t.step2Desc,
      icon: <Brain className="w-8 h-8 text-blue-600" />
    },
    {
      number: '03',
      title: t.step3Title,
      description: t.step3Desc,
      icon: <TrendingUp className="w-8 h-8 text-blue-600" />
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-orange-50 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center">
            <div className="mb-8">
              <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Star className="w-4 h-4 mr-2" />
                NIRMAAN – Turn Dreams into Direction
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {t.heroTitle}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              {t.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={onFindInternship}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center"
              >
                {t.findInternship}
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button
                onClick={onSignup}
                className="border border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                {t.getStarted}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-blue-600 mb-2">
                {currentStats.opportunities.toLocaleString()}+
              </div>
              <div className="text-lg text-gray-600 font-medium">{t.opportunities}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-green-600 mb-2">
                {currentStats.companies.toLocaleString()}+
              </div>
              <div className="text-lg text-gray-600 font-medium">{t.companies}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-orange-600 mb-2">
                {currentStats.interns.toLocaleString()}+
              </div>
              <div className="text-lg text-gray-600 font-medium">{t.successfulInterns}</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t.howItWorks}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple steps to find your perfect internship opportunity
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                  <div className="flex items-center mb-6">
                    <div className="bg-blue-100 rounded-full p-3 mr-4">
                      {step.icon}
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{step.number}</div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-blue-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose PM Internship Scheme?
            </h2>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose NIRMAAN?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the future of internship discovery with our AI-powered platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-8 text-center hover:bg-white hover:shadow-lg transition-all duration-300 group"
              >
                <div className="mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join thousands of students who have found their dream internships through our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onSignup}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              {t.signUp}
            </button>
            <button
              onClick={onFindInternship}
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              {t.findInternship}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-orange-500 via-white to-green-600 p-2 rounded-lg mr-3">
                  <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-sm">PM</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold">NIRMAAN</h3>
                  <p className="text-sm text-gray-400">NIRMAAN – Turn Dreams into Direction</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed mb-4">
                Empowering the next generation of professionals through AI-powered internship matching.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><button className="text-gray-400 hover:text-white transition-colors">About Us</button></li>
                <li><button className="text-gray-400 hover:text-white transition-colors">How It Works</button></li>
                <li><button className="text-gray-400 hover:text-white transition-colors">FAQ</button></li>
                <li><button className="text-gray-400 hover:text-white transition-colors">Contact</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><button className="text-gray-400 hover:text-white transition-colors">Help Center</button></li>
                <li><button className="text-gray-400 hover:text-white transition-colors">Privacy Policy</button></li>
                <li><button className="text-gray-400 hover:text-white transition-colors">Terms of Service</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 NIRMAAN. Built for NIRMAAN – Turn Dreams into Direction.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;