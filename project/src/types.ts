export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  education: string;
  skills: string[];
  preferredLanguage: 'en' | 'hi' | 'mr';
  preferences: {
    workFromHome: boolean;
    partTime: boolean;
    localOnly: boolean;
    minStipend: number;
  };
  profileComplete: boolean;
  points: number;
  pointsHistory: PointsTransaction[];
  badges: Badge[];
  loginStreak: number;
  lastLoginDate: string;
}

export interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  stipend: number;
  duration: string;
  postedDays: number;
  type: 'full-time' | 'part-time';
  remote: boolean;
  description: string;
  requirements: string[];
  category: string;
  applicationDeadline: string;
  startDate: string;
  supportedLanguages: ('en' | 'hi' | 'mr')[];
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface PointsTransaction {
  id: string;
  action: 'profile_complete' | 'internship_apply' | 'friend_referral' | 'login_streak' | 'daily_login';
  points: number;
  timestamp: Date;
  description: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  pointsRequired: number;
  earnedAt: Date;
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  badge: string;
  color: string;
}