import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, GraduationCap, Edit3, Save, X, Plus, Globe } from 'lucide-react';
import { User as UserType } from '../types';
import { translations } from '../utils/translations';
import PointsDisplay from './PointsDisplay';
import { awardPoints } from '../utils/pointsSystem';

type Language = 'en' | 'hi' | 'mr';

interface ProfilePageProps {
  user: UserType;
  onUpdateUser: (user: UserType) => void;
  language: Language;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdateUser, language }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UserType>(user);
  const [newSkill, setNewSkill] = useState('');
  const [currentUser, setCurrentUser] = useState(user);

  const t = translations[language];

  const languageOptions = [
    { code: 'en' as Language, name: 'English', nativeName: 'English' },
    { code: 'hi' as Language, name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'mr' as Language, name: 'Marathi', nativeName: 'मराठी' }
  ];
  const handleSave = () => {
    // Check if profile was completed for the first time
    const wasIncomplete = !currentUser.profileComplete;
    const isNowComplete = editedUser.name && editedUser.email && editedUser.phone && 
                          editedUser.location && editedUser.education && editedUser.skills.length > 0 &&
                          editedUser.preferredLanguage;
    
    let finalUser = editedUser;
    
    if (wasIncomplete && isNowComplete) {
      finalUser = { ...editedUser, profileComplete: true };
      const { updatedUser } = awardPoints(finalUser, 'profile_complete');
      finalUser = updatedUser;
      
      // Show congratulations
      setTimeout(() => {
        alert('🎉 Congratulations! Profile completed! You earned 100 points!');
      }, 500);
    }
    
    setCurrentUser(finalUser);
    onUpdateUser(editedUser);
    localStorage.setItem('pmInternshipUser', JSON.stringify(finalUser));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(currentUser);
    setIsEditing(false);
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !editedUser.skills.includes(newSkill.trim())) {
      setEditedUser({
        ...editedUser,
        skills: [...editedUser.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setEditedUser({
      ...editedUser,
      skills: editedUser.skills.filter(skill => skill !== skillToRemove)
    });
  };

  // Update user when prop changes
  React.useEffect(() => {
    setCurrentUser(user);
    setEditedUser(user);
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 pt-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-t-2xl px-8 py-12 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-6">
                  <User className="w-12 h-12 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">{currentUser.name}</h1>
                  <p className="text-blue-100 text-lg">{currentUser.education}</p>
                  <div className="flex items-center text-blue-100 mt-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    {currentUser.location}
                  </div>
                </div>
              </div>
              <button
                onClick={isEditing ? handleCancel : () => setIsEditing(true)}
                className="bg-white bg-opacity-20 text-white px-6 py-3 rounded-lg hover:bg-opacity-30 transition-colors flex items-center"
              >
                {isEditing ? (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    {t.cancel}
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4 mr-2" />
                    {t.edit}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Contact Information */}
          {/* Personal Information */}
          <div className="px-8 py-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedUser.name || ''}
                    onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{currentUser.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedUser.location || ''}
                    onChange={(e) => setEditedUser({...editedUser, location: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your location"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{currentUser.location}</p>
                )}
              </div>
            </div>
            
            <h4 className="text-md font-medium text-gray-800 mb-4">Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900">{currentUser.email}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedUser.phone || ''}
                      onChange={(e) => setEditedUser({...editedUser, phone: e.target.value})}
                      className="border border-gray-300 rounded-lg px-3 py-1 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-1"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <p className="text-gray-900">{currentUser.phone}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Education Background */}
          <div className="px-8 py-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Education Background</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  College/University Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedUser.education?.split(' - ')[0] || editedUser.education || ''}
                    onChange={(e) => {
                      const fieldOfStudy = editedUser.education?.split(' - ')[1] || '';
                      const graduationYear = editedUser.education?.split(' - ')[2] || '';
                      const newEducation = `${e.target.value}${fieldOfStudy ? ' - ' + fieldOfStudy : ''}${graduationYear ? ' - ' + graduationYear : ''}`;
                      setEditedUser({...editedUser, education: newEducation});
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., IIT Mumbai, Delhi University"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{currentUser.education?.split(' - ')[0] || currentUser.education}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Field of Study
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedUser.education?.split(' - ')[1] || ''}
                    onChange={(e) => {
                      const collegeName = editedUser.education?.split(' - ')[0] || '';
                      const graduationYear = editedUser.education?.split(' - ')[2] || '';
                      const newEducation = `${collegeName}${e.target.value ? ' - ' + e.target.value : ''}${graduationYear ? ' - ' + graduationYear : ''}`;
                      setEditedUser({...editedUser, education: newEducation});
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Computer Science, Electronics"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{currentUser.education?.split(' - ')[1] || 'Not specified'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Graduation Year
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    min="2020"
                    max="2030"
                    value={editedUser.education?.split(' - ')[2] || ''}
                    onChange={(e) => {
                      const collegeName = editedUser.education?.split(' - ')[0] || '';
                      const fieldOfStudy = editedUser.education?.split(' - ')[1] || '';
                      const newEducation = `${collegeName}${fieldOfStudy ? ' - ' + fieldOfStudy : ''}${e.target.value ? ' - ' + e.target.value : ''}`;
                      setEditedUser({...editedUser, education: newEducation});
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 2025"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{currentUser.education?.split(' - ')[2] || 'Not specified'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="px-8 py-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {(editedUser.skills || []).map((skill) => (
                <span
                  key={skill}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center"
                >
                  {skill}
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
            {isEditing && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add new skill"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                />
                <button
                  onClick={handleAddSkill}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Preferences */}
          <div className="px-8 py-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Internship Preferences</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Stipend (₹/month)
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedUser.preferences?.minStipend || 0}
                      onChange={(e) => setEditedUser({
                        ...editedUser,
                        preferences: {
                          ...(editedUser.preferences || {}),
                          minStipend: parseInt(e.target.value) || 0
                        }
                      })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">₹{currentUser.preferences?.minStipend?.toLocaleString() || 0}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Globe className="w-4 h-4 inline mr-1" />
                    {t.preferredLanguage}
                  </label>
                  {isEditing ? (
                    <select
                      value={editedUser.preferredLanguage || 'en'}
                      onChange={(e) => setEditedUser({...editedUser, preferredLanguage: e.target.value as Language})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm shadow-sm"
                    >
                      {languageOptions.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name} ({lang.nativeName})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-gray-900 py-2">
                      {languageOptions.find(lang => lang.code === currentUser.preferredLanguage)?.name || 'English'} 
                      ({languageOptions.find(lang => lang.code === currentUser.preferredLanguage)?.nativeName || 'English'})
                    </p>
                  )}
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Preferences</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editedUser.preferences?.workFromHome || false}
                      onChange={(e) => setEditedUser({
                        ...editedUser,
                        preferences: {
                          ...(editedUser.preferences || {}),
                          workFromHome: e.target.checked
                        }
                      })}
                      disabled={!isEditing}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                    />
                    <span className="ml-3 text-gray-700">Work from home</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editedUser.preferences?.partTime || false}
                      onChange={(e) => setEditedUser({
                        ...editedUser,
                        preferences: {
                          ...(editedUser.preferences || {}),
                          partTime: e.target.checked
                        }
                      })}
                      disabled={!isEditing}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                    />
                    <span className="ml-3 text-gray-700">Part-time opportunities</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editedUser.preferences?.localOnly || false}
                      onChange={(e) => setEditedUser({
                        ...editedUser,
                        preferences: {
                          ...(editedUser.preferences || {}),
                          localOnly: e.target.checked
                        }
                      })}
                      disabled={!isEditing}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                    />
                    <span className="ml-3 text-gray-700">Local opportunities only</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="px-8 py-6 bg-gray-50 rounded-b-2xl flex justify-end space-x-4">
              <button
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {t.save}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;