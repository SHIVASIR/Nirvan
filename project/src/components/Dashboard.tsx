import React from 'react';
import { Search, Briefcase, TrendingUp, Calendar, MapPin, Clock, ArrowRight, Star, Award, Users, Target, BookOpen, Bell, Filter, ChevronRight, Building2, DollarSign, Timer, CheckCircle, Gift } from 'lucide-react';
import { User } from '../types';
import { mockInternships } from '../data/mockData';
import { translations } from '../utils/translations';
import PointsDisplay from './PointsDisplay';
import ReferralModal from './ReferralModal';
import { awardPoints } from '../utils/pointsSystem';

type Language = 'en' | 'hi' | 'mr';

interface DashboardProps {
  user: User;
  onNavigateToSearch: () => void;
  language: Language;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigateToSearch, language }) => {
  const [showReferralModal, setShowReferralModal] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState(user);
  
  const t = translations[language];
  
  const recommendedInternships = mockInternships.slice(0, 3);
  const recentApplications = [
    { id: '1', title: 'Software Development Intern', company: 'TechCorp India', status: 'reviewing', appliedDays: 2 },
    { id: '2', title: 'UI/UX Design Intern', company: 'Creative Studio', status: 'shortlisted', appliedDays: 5 },
    { id: '3', title: 'Data Science Intern', company: 'AI Solutions Ltd', status: 'applied', appliedDays: 1 }
  ];

  const upcomingDeadlines = [
    { id: '1', title: 'Digital Marketing Intern', company: 'Growth Ventures', deadline: '2 days left', urgent: true },
    { id: '2', title: 'Business Development Intern', company: 'StartupHub', deadline: '5 days left', urgent: false },
    { id: '3', title: 'Content Writing Intern', company: 'Media House', deadline: '1 week left', urgent: false }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reviewing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'shortlisted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'applied':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'accepted':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      switch (language) {
        case 'hi': return 'सुप्रभात';
        case 'mr': return 'सुप्रभात';
        default: return 'Good morning';
      }
    } else if (hour < 17) {
      switch (language) {
        case 'hi': return 'नमस्ते';
        case 'mr': return 'नमस्कार';
        default: return 'Good afternoon';
      }
    } else {
      switch (language) {
        case 'hi': return 'शुभ संध्या';
        case 'mr': return 'शुभ संध्या';
        default: return 'Good evening';
      }
    }
  };

  const handleReferralComplete = () => {
    const { updatedUser } = awardPoints(currentUser, 'friend_referral');
    setCurrentUser(updatedUser);
    localStorage.setItem('pmInternshipUser', JSON.stringify(updatedUser));
    
    // Show success notification
    alert('🎉 Congratulations! You earned 200 points for referring a friend!');
  };

  // Update user when prop changes
  React.useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-3xl p-8 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24"></div>
            </div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <div className="bg-white bg-opacity-20 rounded-full p-3 mr-4">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                      {getGreeting()}, {user.name.split(' ')[0]}! 👋
                    </h1>
                    <p className="text-blue-100 text-lg">
                      Ready to discover amazing internship opportunities today?
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 mt-6">
                  <div className="flex items-center text-blue-100">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span className="text-sm">Profile {currentUser.profileComplete ? '100%' : '85%'} Complete</span>
                  </div>
                  <div className="flex items-center text-blue-100">
                    <Target className="w-5 h-5 mr-2" />
                    <span className="text-sm">3 New Matches</span>
                  </div>
                </div>
              </div>
              
              <div className="hidden lg:block">
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold mb-1">{currentUser.points}</div>
                  <div className="text-blue-100 text-sm">Total Points</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <button
            onClick={onNavigateToSearch}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-left group border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-3 group-hover:scale-110 transition-transform">
                <Search className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t.findPerfectInternship}
            </h3>
            <p className="text-gray-600 text-sm">
              Use AI-powered search to discover opportunities
            </p>
          </button>

          <button
            onClick={() => setShowReferralModal(true)}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-left group border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-3 group-hover:scale-110 transition-transform">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Refer Friends
            </h3>
            <p className="text-gray-600 text-sm">
              Earn 200 points for each successful referral
            </p>
          </button>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-3">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded-full">2</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Notifications
            </h3>
            <p className="text-gray-600 text-sm">
              New updates on your applications
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-3">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Learning Resources
            </h3>
            <p className="text-gray-600 text-sm">
              Skill development courses and guides
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Applications</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-green-600 text-xs font-medium">+3 this week</p>
              </div>
              <div className="bg-blue-100 rounded-xl p-3">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Interviews</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
                <p className="text-orange-600 text-xs font-medium">1 upcoming</p>
              </div>
              <div className="bg-orange-100 rounded-xl p-3">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">67%</p>
                <p className="text-green-600 text-xs font-medium">Above average</p>
              </div>
              <div className="bg-green-100 rounded-xl p-3">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Profile Views</p>
                <p className="text-2xl font-bold text-gray-900">89</p>
                <p className="text-purple-600 text-xs font-medium">+12 today</p>
              </div>
              <div className="bg-purple-100 rounded-xl p-3">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Recommended Internships */}
          <div className="xl:col-span-3 space-y-8">
            {/* Points Display */}
            <PointsDisplay user={currentUser} showDetails={true} />
          </div>

          {/* Right Sidebar */}
          <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Recent Applications */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentApplications.map((application) => (
                    <div key={application.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{application.title}</h4>
                        <p className="text-gray-600 text-xs">{application.company}</p>
                        <p className="text-gray-500 text-xs">{application.appliedDays} days ago</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
                        {formatStatus(application.status)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {upcomingDeadlines.map((deadline) => (
                    <div key={deadline.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{deadline.title}</h4>
                        <p className="text-gray-600 text-xs">{deadline.company}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs font-medium ${deadline.urgent ? 'text-red-600' : 'text-orange-600'}`}>
                          {deadline.deadline}
                        </span>
                        {deadline.urgent && (
                          <div className="w-2 h-2 bg-red-500 rounded-full ml-auto mt-1"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200 md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 rounded-full p-2 mr-3">
                  <Award className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Quick Tip</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                Complete your profile to increase your chances of getting noticed by recruiters. 
                Add more skills and update your preferences for better matches!
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Referral Modal */}
      {showReferralModal && (
        <ReferralModal
          user={currentUser}
          onClose={() => setShowReferralModal(false)}
          onReferralComplete={handleReferralComplete}
        />
      )}
    </div>
  );
};

export default Dashboard;