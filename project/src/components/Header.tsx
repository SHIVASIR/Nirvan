import React, { useState } from 'react';
import { Menu, X, Globe, User, ChevronDown, Trophy } from 'lucide-react';
import { User as UserType } from '../types';
import { translations } from '../utils/translations';
import PointsDisplay from './PointsDisplay';

type Language = 'en' | 'hi' | 'mr';
type Page = 'landing' | 'dashboard' | 'search' | 'profile';

interface HeaderProps {
  user: UserType | null;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogin: () => void;
  onLogout: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const Header: React.FC<HeaderProps> = ({
  user,
  currentPage,
  onNavigate,
  onLogin,
  onLogout,
  language,
  onLanguageChange
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);

  const t = translations[language];

  const languages = [
    { code: 'en' as Language, name: 'English', flag: '🇬🇧' },
    { code: 'hi' as Language, name: 'हिंदी', flag: '🇮🇳' },
    { code: 'mr' as Language, name: 'मराठी', flag: '🇮🇳' }
  ];

  const currentLang = languages.find(lang => lang.code === language);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => onNavigate(user ? 'dashboard' : 'landing')}
          >
            <div className="bg-gradient-to-r from-orange-500 via-white to-green-600 p-2 rounded-lg mr-3">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">PM</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900">NIRMAAN</h1>
              <p className="text-xs text-gray-600">NIRMAAN – Turn Dreams into Direction</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {!user ? (
              <>
                <button
                  onClick={() => onNavigate('landing')}
                  className={`text-sm font-medium ${
                    currentPage === 'landing' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                  } transition-colors`}
                >
                  {t.about}
                </button>
                <button
                  onClick={() => onNavigate('landing')}
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  {t.howItWorks}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className={`text-sm font-medium ${
                    currentPage === 'dashboard' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                  } transition-colors`}
                >
                  {t.dashboard}
                </button>
                <button
                  onClick={() => {
                    onNavigate('search');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-sm font-medium ${
                    currentPage === 'search' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                  } transition-colors`}
                >
                  {t.searchInternships}
                </button>
              </>
            )}

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>{currentLang?.flag}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {isLanguageMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onLanguageChange(lang.code);
                        setIsLanguageMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2 ${
                        language === lang.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Menu or Find Internship Button */}
            {user ? (
              <div className="flex items-center space-x-4">
                {/* Points Display in Header */}
                <div className="hidden lg:block">
                  <div className="flex items-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg px-3 py-2 border border-blue-100">
                    <Trophy className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-gray-700">{user.points}</span>
                    <span className="text-xs text-gray-500 ml-1">pts</span>
                  </div>
                </div>
                
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>{user.name.split(' ')[0]}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1">
                      <button
                        onClick={() => {
                          onNavigate('profile');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        {t.profile}
                      </button>
                      <button
                        onClick={() => {
                          onLogout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        {t.logout}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                {t.findInternship}
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              {!user ? (
                <>
                  <button
                    onClick={() => {
                      onNavigate('landing');
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left text-gray-700 hover:text-blue-600 py-2"
                  >
                    {t.about}
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('landing');
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left text-gray-700 hover:text-blue-600 py-2"
                  >
                    {t.howItWorks}
                  </button>
                  <button
                    onClick={() => {
                      onLogin();
                      setIsMobileMenuOpen(false);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors text-center"
                  >
                    {t.findInternship}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      onNavigate('dashboard');
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left text-gray-700 hover:text-blue-600 py-2"
                  >
                    {t.dashboard}
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('profile');
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left text-gray-700 hover:text-blue-600 py-2"
                  >
                    {t.profile}
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left text-gray-700 hover:text-blue-600 py-2"
                  >
                    {t.logout}
                  </button>
                  
                  {/* Mobile Points Display */}
                  <div className="border-t pt-4">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 border border-blue-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Trophy className="w-4 h-4 text-blue-600 mr-2" />
                          <span className="text-sm font-medium text-gray-700">Your Points</span>
                        </div>
                        <span className="text-lg font-bold text-blue-600">{user.points}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              {/* Mobile Language Selector */}
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-500 mb-2">Language / भाषा</p>
                <div className="space-y-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onLanguageChange(lang.code);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-2 py-1 rounded flex items-center space-x-2 ${
                        language === lang.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;