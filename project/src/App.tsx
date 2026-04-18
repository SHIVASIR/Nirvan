import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import AuthModal from './components/AuthModal';
import Dashboard from './components/Dashboard';
import SearchPage from './components/SearchPage';
import ProfilePage from './components/ProfilePage';
import Chatbot from './components/Chatbot';
import { updateLoginStreak } from './utils/pointsSystem';
import { User } from './types';

type Page = 'landing' | 'dashboard' | 'search' | 'profile';
type Language = 'en' | 'hi' | 'mr';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [intendedPage, setIntendedPage] = useState<Page | null>(null);

  // Simulate user session persistence
  useEffect(() => {
    const savedUser = localStorage.getItem('pmInternshipUser');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      // Initialize points system for existing users
      const userWithPoints = {
        ...parsedUser,
        preferredLanguage: parsedUser.preferredLanguage || 'en',
        points: parsedUser.points || 0,
        pointsHistory: parsedUser.pointsHistory || [],
        badges: parsedUser.badges || [],
        loginStreak: parsedUser.loginStreak || 0,
        lastLoginDate: parsedUser.lastLoginDate || new Date().toISOString()
      };
      
      // Update login streak
      const updatedUser = updateLoginStreak(userWithPoints);
      setUser(updatedUser);
      localStorage.setItem('pmInternshipUser', JSON.stringify(updatedUser));
      setCurrentPage('dashboard');
    }
  }, []);

  // Redirect to landing page if user is null but on a protected page
  useEffect(() => {
    if (!user && (currentPage === 'dashboard' || currentPage === 'search' || currentPage === 'profile')) {
      setCurrentPage('landing');
    }
  }, [user, currentPage]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('pmInternshipUser', JSON.stringify(userData));
    setShowAuthModal(false);
    // Navigate to intended page or default to dashboard
    setCurrentPage(intendedPage || 'dashboard');
    setIntendedPage(null);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('pmInternshipUser');
    setCurrentPage('landing');
  };

  const showLogin = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const showSignup = () => {
    setAuthMode('signup');
    setShowAuthModal(true);
  };

  const navigateToSearch = () => {
    if (user) {
      setCurrentPage('search');
    } else {
      setIntendedPage('search');
      showLogin();
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return (
          <LandingPage 
            onLogin={showLogin} 
            onSignup={showSignup}
            onFindInternship={navigateToSearch}
            language={language}
          />
        );
      case 'dashboard':
        return (
          <Dashboard 
            user={user as User}
            onNavigateToSearch={() => setCurrentPage('search')}
            language={language}
          />
        );
      case 'search':
        return (
          <SearchPage 
            user={user as User}
            language={language}
          />
        );
      case 'profile':
        return (
          <ProfilePage 
            user={user as User}
            onUpdateUser={setUser}
            language={language}
          />
        );
      default:
        return <LandingPage onLogin={showLogin} onSignup={showSignup} onFindInternship={navigateToSearch} language={language} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        user={user}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogin={showLogin}
        onLogout={handleLogout}
        language={language}
        onLanguageChange={setLanguage}
      />
      
      <main>
        {renderPage()}
      </main>

      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onLogin={handleLogin}
          onClose={() => setShowAuthModal(false)}
          onSwitchMode={(mode) => setAuthMode(mode)}
          language={language}
        />
      )}

      {user && <Chatbot language={language} />}
    </div>
  );
}

export default App;