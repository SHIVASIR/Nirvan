import React, { useState } from 'react';
import { Trophy, Star, Gift, TrendingUp, Award, ChevronRight, Clock, Zap } from 'lucide-react';
import { User, PointsTransaction } from '../types';
import { getCurrentMilestone, getNextMilestone, calculateProgress, MILESTONES } from '../utils/pointsSystem';

interface PointsDisplayProps {
  user: User;
  showDetails?: boolean;
}

const PointsDisplay: React.FC<PointsDisplayProps> = ({ user, showDetails = false }) => {
  const [showHistory, setShowHistory] = useState(false);
  const currentMilestone = getCurrentMilestone(user.points);
  const nextMilestone = getNextMilestone(user.points);
  const progress = calculateProgress(user.points);

  const getMilestoneColor = (color: string) => {
    const colors = {
      gray: 'from-gray-400 to-gray-600',
      blue: 'from-blue-400 to-blue-600',
      green: 'from-green-400 to-green-600',
      purple: 'from-purple-400 to-purple-600',
      yellow: 'from-yellow-400 to-yellow-600',
      red: 'from-red-400 to-red-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!showDetails) {
    // Compact version for header/sidebar
    return (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className={`bg-gradient-to-r ${getMilestoneColor(currentMilestone.color)} rounded-full p-2 mr-3 shadow-md`}>
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Your Points</p>
              <p className="text-xl font-bold text-gray-900">{user.points.toLocaleString()}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">{currentMilestone.name}</p>
            <div className="flex items-center">
              <span className="text-lg mr-1">{currentMilestone.badge}</span>
              <span className="text-xs text-gray-600">Level {MILESTONES.findIndex(m => m.id === currentMilestone.id) + 1}</span>
            </div>
          </div>
        </div>
        
        {nextMilestone && (
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progress to {nextMilestone.name}</span>
              <span>{progress.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 shadow-inner">
              <div 
                className={`bg-gradient-to-r ${getMilestoneColor(nextMilestone.color)} h-2 rounded-full transition-all duration-500 shadow-sm`}
                style={{width: `${progress.progress}%`}}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {nextMilestone.pointsRequired - user.points} points to go
            </p>
          </div>
        )}
      </div>
    );
  }

  // Detailed version for dashboard
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">Points & Achievements</h3>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
          >
            History
            <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${showHistory ? 'rotate-90' : ''}`} />
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Current Status */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 mb-6 border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className={`bg-gradient-to-r ${getMilestoneColor(currentMilestone.color)} rounded-full p-3 mr-4 shadow-lg`}>
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Points</p>
                <p className="text-3xl font-bold text-gray-900">{user.points.toLocaleString()}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end mb-2">
                <span className="text-2xl mr-2">{currentMilestone.badge}</span>
                <div>
                  <p className="font-semibold text-gray-900">{currentMilestone.name}</p>
                  <p className="text-xs text-gray-600">Level {MILESTONES.findIndex(m => m.id === currentMilestone.id) + 1}</p>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-gray-700 text-sm mb-4">{currentMilestone.description}</p>
          
          {nextMilestone && (
            <div>
              <div className="flex justify-between text-sm text-gray-700 mb-2">
                <span>Progress to <strong>{nextMilestone.name}</strong></span>
                <span className="font-medium">{progress.progress}%</span>
              </div>
              <div className="w-full bg-white bg-opacity-50 rounded-full h-3 shadow-inner mb-2">
                <div 
                  className={`bg-gradient-to-r ${getMilestoneColor(nextMilestone.color)} h-3 rounded-full transition-all duration-500 shadow-sm`}
                  style={{width: `${progress.progress}%`}}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>{user.points.toLocaleString()} points</span>
                <span>{nextMilestone.pointsRequired.toLocaleString()} points</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                <strong>{nextMilestone.pointsRequired - user.points}</strong> points needed for {nextMilestone.badge} {nextMilestone.name}
              </p>
            </div>
          )}
        </div>

        {/* Login Streak */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 mb-6 border border-orange-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-full p-2 mr-3 shadow-md">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Login Streak</p>
                <p className="text-lg font-bold text-gray-900">{user.loginStreak} days</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-600">Next bonus in</p>
              <p className="text-sm font-medium text-orange-600">
                {7 - (user.loginStreak % 7)} days
              </p>
            </div>
          </div>
        </div>

        {/* Earned Badges */}
        {user.badges.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Earned Badges</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {user.badges.map((badge) => (
                <div key={badge.id} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-200">
                  <div className="text-2xl mb-2">{badge.icon}</div>
                  <p className="font-medium text-gray-900 text-sm">{badge.name}</p>
                  <p className="text-xs text-gray-600">{formatDate(badge.earnedAt)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Points History */}
        {showHistory && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Recent Activity</h4>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {user.pointsHistory.slice(0, 10).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      {transaction.action === 'profile_complete' && <Star className="w-4 h-4 text-blue-600" />}
                      {transaction.action === 'internship_apply' && <TrendingUp className="w-4 h-4 text-blue-600" />}
                      {transaction.action === 'friend_referral' && <Gift className="w-4 h-4 text-blue-600" />}
                      {(transaction.action === 'login_streak' || transaction.action === 'daily_login') && <Clock className="w-4 h-4 text-blue-600" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{transaction.description}</p>
                      <p className="text-xs text-gray-600">{formatDate(transaction.timestamp)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">+{transaction.points}</p>
                  </div>
                </div>
              ))}
              {user.pointsHistory.length === 0 && (
                <p className="text-gray-500 text-center py-4">No activity yet. Start earning points!</p>
              )}
            </div>
          </div>
        )}

        {/* How to Earn Points */}
        <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
          <h4 className="font-semibold text-blue-900 mb-3">How to Earn Points</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-700">Complete your profile</span>
              <span className="font-medium text-blue-900">+100 points</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Apply for an internship</span>
              <span className="font-medium text-blue-900">+20 points</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Refer a friend</span>
              <span className="font-medium text-blue-900">+200 points</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Daily login</span>
              <span className="font-medium text-blue-900">+5 points</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Weekly login streak</span>
              <span className="font-medium text-blue-900">+20 points</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointsDisplay;