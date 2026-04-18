import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { ChatMessage } from '../types';
import { translations } from '../utils/translations';

type Language = 'en' | 'hi' | 'mr';

interface ChatbotProps {
  language: Language;
}

const Chatbot: React.FC<ChatbotProps> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const t = translations[language];

  // Rule-based responses
  const responses = {
    en: {
      greeting: "Hello! I'm your NIRMAAN assistant. How can I help you today?",
      profile_help: "To complete your profile: 1) Add your personal information, 2) Update your education details, 3) Add relevant skills, 4) Set your internship preferences. This will help us match you with better opportunities!",
      internship_details: "NIRMAAN offers government-certified internships across various sectors. You can earn stipends ranging from ₹10,000 to ₹50,000 per month. All internships are verified and provide valuable industry experience.",
      how_to_apply: "To apply for internships: 1) Complete your profile, 2) Use our AI-powered search to find matching opportunities, 3) Click 'Apply Now' on internships you're interested in, 4) Track your applications in the dashboard.",
      learning_resources: "We offer free learning resources including: 1) Skill development courses, 2) Interview preparation guides, 3) Resume building tips, 4) Industry insights. Check the 'Learning Resources' section in your dashboard.",
      points_system: "Earn points by: Completing profile (+100), Applying to internships (+20), Daily login (+5), Referring friends (+200), Login streaks (+20 weekly). Use points to unlock badges and achievements!",
      technical_support: "For technical issues: 1) Try refreshing the page, 2) Clear your browser cache, 3) Check your internet connection, 4) Contact our support team if the problem persists.",
      default: "I understand you're asking about NIRMAAN. Could you please be more specific? I can help with profile completion, internship applications, learning resources, or technical support."
    },
    hi: {
      greeting: "नमस्ते! मैं आपका NIRMAAN सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?",
      profile_help: "अपनी प्रोफ़ाइल पूरी करने के लिए: 1) अपनी व्यक्तिगत जानकारी जोड़ें, 2) अपनी शिक्षा का विवरण अपडेट करें, 3) प्रासंगिक कौशल जोड़ें, 4) अपनी इंटर्नशिप प्राथमिकताएं सेट करें। इससे हमें आपके लिए बेहतर अवसर खोजने में मदद मिलेगी!",
      internship_details: "NIRMAAN विभिन्न क्षेत्रों में सरकारी प्रमाणित इंटर्नशिप प्रदान करती है। आप प्रति माह ₹10,000 से ₹50,000 तक की वृत्ति कमा सकते हैं। सभी इंटर्नशिप सत्यापित हैं और मूल्यवान उद्योग अनुभव प्रदान करती हैं।",
      how_to_apply: "इंटर्नशिप के लिए आवेदन करने के लिए: 1) अपनी प्रोफ़ाइल पूरी करें, 2) मैचिंग अवसर खोजने के लिए हमारी AI-संचालित खोज का उपयोग करें, 3) जिन इंटर्नशिप में आप रुचि रखते हैं उन पर 'अभी आवेदन करें' पर क्लिक करें, 4) डैशबोर्ड में अपने आवेदनों को ट्रैक करें।",
      learning_resources: "हम मुफ्त शिक्षण संसाधन प्रदान करते हैं जिनमें शामिल हैं: 1) कौशल विकास पाठ्यक्रम, 2) साक्षात्कार तैयारी गाइड, 3) रिज्यूमे बनाने की युक्तियां, 4) उद्योग अंतर्दृष्टि। अपने डैशबोर्ड में 'शिक्षण संसाधन' अनुभाग देखें।",
      points_system: "अंक कमाएं: प्रोफ़ाइल पूरी करना (+100), इंटर्नशिप के लिए आवेदन (+20), दैनिक लॉगिन (+5), मित्रों को रेफर करना (+200), लॉगिन स्ट्रीक (+20 साप्ताहिक)। बैज और उपलब्धियां अनलॉक करने के लिए अंकों का उपयोग करें!",
      technical_support: "तकनीकी समस्याओं के लिए: 1) पेज को रिफ्रेश करने का प्रयास करें, 2) अपना ब्राउज़र कैश साफ़ करें, 3) अपना इंटरनेट कनेक्शन जांचें, 4) यदि समस्या बनी रहती है तो हमारी सहायता टीम से संपर्क करें।",
      default: "मैं समझता हूं कि आप NIRMAAN के बारे में पूछ रहे हैं। कृपया अधिक विशिष्ट हो सकते हैं? मैं प्रोफ़ाइल पूर्णता, इंटर्नशिप आवेदन, शिक्षण संसाधन, या तकनीकी सहायता में मदद कर सकता हूं।"
    },
    mr: {
      greeting: "नमस्कार! मी तुमचा NIRMAAN सहाय्यक आहे। आज मी तुमची कशी मदत करू शकतो?",
      profile_help: "तुमची प्रोफाइल पूर्ण करण्यासाठी: 1) तुमची वैयक्तिक माहिती जोडा, 2) तुमच्या शिक्षणाचे तपशील अपडेट करा, 3) संबंधित कौशल्ये जोडा, 4) तुमच्या इंटर्नशिप प्राधान्ये सेट करा. यामुळे आम्हाला तुमच्यासाठी चांगल्या संधी शोधण्यात मदत होईल!",
      internship_details: "NIRMAAN विविध क्षेत्रांमध्ये सरकारी प्रमाणित इंटर्नशिप प्रदान करते. तुम्ही दरमहा ₹10,000 ते ₹50,000 पर्यंत शिष्यवृत्ती मिळवू शकता. सर्व इंटर्नशिप सत्यापित आहेत आणि मौल्यवान उद्योग अनुभव प्रदान करतात.",
      how_to_apply: "इंटर्नशिपसाठी अर्ज करण्यासाठी: 1) तुमची प्रोफाइल पूर्ण करा, 2) जुळणाऱ्या संधी शोधण्यासाठी आमच्या AI-चालित शोधाचा वापर करा, 3) तुम्हाला स्वारस्य असलेल्या इंटर्नशिपवर 'आता अर्ज करा' वर क्लिक करा, 4) डॅशबोर्डमध्ये तुमच्या अर्जांचा मागोवा घ्या.",
      learning_resources: "आम्ही मोफत शिक्षण संसाधने प्रदान करतो ज्यात समाविष्ट आहे: 1) कौशल्य विकास अभ्यासक्रम, 2) मुलाखत तयारी मार्गदर्शक, 3) रिझ्यूमे तयार करण्याच्या टिप्स, 4) उद्योग अंतर्दृष्टी. तुमच्या डॅशबोर्डमधील 'शिक्षण संसाधने' विभाग पहा.",
      points_system: "गुण मिळवा: प्रोफाइल पूर्ण करणे (+100), इंटर्नशिपसाठी अर्ज (+20), दैनिक लॉगिन (+5), मित्रांना रेफर करणे (+200), लॉगिन स्ट्रीक (+20 साप्ताहिक). बॅज आणि उपलब्धी अनलॉक करण्यासाठी गुणांचा वापर करा!",
      technical_support: "तांत्रिक समस्यांसाठी: 1) पेज रिफ्रेश करण्याचा प्रयत्न करा, 2) तुमचा ब्राउझर कॅश साफ करा, 3) तुमचे इंटरनेट कनेक्शन तपासा, 4) समस्या कायम राहिल्यास आमच्या सपोर्ट टीमशी संपर्क साधा.",
      default: "मला समजते की तुम्ही NIRMAAN बद्दल विचारत आहात. कृपया अधिक विशिष्ट असू शकता? मी प्रोफाइल पूर्णता, इंटर्नशिप अर्ज, शिक्षण संसाधने किंवा तांत्रिक सहाय्यामध्ये मदत करू शकतो."
    }
  };

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [language]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial greeting when chatbot opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting: ChatMessage = {
        id: Date.now().toString(),
        text: responses[language].greeting,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages([greeting]);
      
      if (speechEnabled) {
        speakMessage(greeting.text);
      }
    }
  }, [isOpen, language, speechEnabled]);

  const speakMessage = (text: string) => {
    if (synthRef.current && speechEnabled) {
      synthRef.current.cancel(); // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      synthRef.current.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

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

  const getResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    const langResponses = responses[language];

    // Keywords for different categories
    if (lowerMessage.includes('profile') || lowerMessage.includes('complete') || lowerMessage.includes('प्रोफ़ाइल') || lowerMessage.includes('प्रोफाइल')) {
      return langResponses.profile_help;
    }
    
    if (lowerMessage.includes('internship') || lowerMessage.includes('scheme') || lowerMessage.includes('इंटर्नशिप') || lowerMessage.includes('योजना')) {
      return langResponses.internship_details;
    }
    
    if (lowerMessage.includes('apply') || lowerMessage.includes('application') || lowerMessage.includes('आवेदन') || lowerMessage.includes('अर्ज')) {
      return langResponses.how_to_apply;
    }
    
    if (lowerMessage.includes('learn') || lowerMessage.includes('resource') || lowerMessage.includes('course') || lowerMessage.includes('सीखना') || lowerMessage.includes('संसाधन') || lowerMessage.includes('शिक्षण')) {
      return langResponses.learning_resources;
    }
    
    if (lowerMessage.includes('point') || lowerMessage.includes('badge') || lowerMessage.includes('अंक') || lowerMessage.includes('गुण') || lowerMessage.includes('बैज')) {
      return langResponses.points_system;
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('problem') || lowerMessage.includes('मदद') || lowerMessage.includes('सहायता') || lowerMessage.includes('समस्या')) {
      return langResponses.technical_support;
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || lowerMessage.includes('नमस्ते') || lowerMessage.includes('नमस्कार')) {
      return langResponses.greeting;
    }

    return langResponses.default;
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    const botResponse: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: getResponse(inputMessage),
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, botResponse]);
    setInputMessage('');

    // Speak the bot response
    if (speechEnabled) {
      setTimeout(() => {
        speakMessage(botResponse.text);
      }, 500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { text: language === 'hi' ? 'प्रोफ़ाइल कैसे पूरी करें?' : language === 'mr' ? 'प्रोफाइल कशी पूर्ण करावी?' : 'How to complete profile?', key: 'profile' },
    { text: language === 'hi' ? 'इंटर्नशिप के लिए आवेदन कैसे करें?' : language === 'mr' ? 'इंटर्नशिपसाठी अर्ज कसा करावा?' : 'How to apply for internships?', key: 'apply' },
    { text: language === 'hi' ? 'अंक कैसे कमाएं?' : language === 'mr' ? 'गुण कसे मिळवावे?' : 'How to earn points?', key: 'points' },
    { text: language === 'hi' ? 'शिक्षण संसाधन' : language === 'mr' ? 'शिक्षण संसाधने' : 'Learning resources', key: 'learning' }
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110 z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col max-h-[600px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-white bg-opacity-20 rounded-full p-2 mr-3">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold">NIRMAAN Assistant</h3>
            <p className="text-xs text-blue-100">Always here to help</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSpeechEnabled(!speechEnabled)}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            title={speechEnabled ? 'Disable voice' : 'Enable voice'}
          >
            {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              title="Stop speaking"
            >
              <VolumeX className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 min-h-[300px] max-h-[400px]">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-md'
                  : 'bg-gray-100 text-gray-800 rounded-bl-md'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
              <p className={`text-xs mt-1 ${
                message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-500 mb-2">Quick actions:</p>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => (
              <button
                key={action.key}
                onClick={() => setInputMessage(action.text)}
                className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 p-2 rounded-lg transition-colors text-left"
              >
                {action.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={language === 'hi' ? 'अपना संदेश टाइप करें...' : language === 'mr' ? 'तुमचा संदेश टाइप करा...' : 'Type your message...'}
              className="w-full p-3 pr-12 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            {recognitionRef.current && (
              <button
                onClick={isListening ? stopListening : startListening}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors ${
                  isListening 
                    ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={isListening ? 'Stop listening' : 'Start voice input'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            )}
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        {isListening && (
          <p className="text-xs text-red-600 mt-2 flex items-center">
            <div className="w-2 h-2 bg-red-600 rounded-full mr-2 animate-pulse"></div>
            {language === 'hi' ? 'सुन रहा हूं...' : language === 'mr' ? 'ऐकत आहे...' : 'Listening...'}
          </p>
        )}
      </div>
    </div>
  );
};

export default Chatbot;