import { User, PointsTransaction, Badge, Milestone } from '../types';

export const POINTS_CONFIG = {
  PROFILE_COMPLETE: 100,
  INTERNSHIP_APPLY: 20,
  FRIEND_REFERRAL: 200,
  LOGIN_STREAK: 10,
  DAILY_LOGIN: 5
};

export const MILESTONES: Milestone[] = [
  {
    id: 'newcomer',
    name: 'Newcomer',
    description: 'Welcome to PM Internship Scheme!',
    pointsRequired: 0,
    badge: '🌟',
    color: 'gray'
  },
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Getting started with your journey',
    pointsRequired: 100,
    badge: '🔍',
    color: 'blue'
  },
  {
    id: 'active_user',
    name: 'Active User',
    description: 'Actively engaging with opportunities',
    pointsRequired: 500,
    badge: '⚡',
    color: 'green'
  },
  {
    id: 'go_getter',
    name: 'Go-Getter',
    description: 'Consistently pursuing opportunities',
    pointsRequired: 1000,
    badge: '🚀',
    color: 'purple'
  },
  {
    id: 'superstar',
    name: 'Superstar',
    description: 'Top performer in the community',
    pointsRequired: 2000,
    badge: '⭐',
    color: 'yellow'
  },
  {
    id: 'legend',
    name: 'Legend',
    description: 'Elite member of PM Internship Scheme',
    pointsRequired: 5000,
    badge: '👑',
    color: 'red'
  }
];

export const getCurrentMilestone = (points: number): Milestone => {
  const sortedMilestones = [...MILESTONES].sort((a, b) => b.pointsRequired - a.pointsRequired);
  return sortedMilestones.find(milestone => points >= milestone.pointsRequired) || MILESTONES[0];
};

export const getNextMilestone = (points: number): Milestone | null => {
  const sortedMilestones = [...MILESTONES].sort((a, b) => a.pointsRequired - b.pointsRequired);
  return sortedMilestones.find(milestone => points < milestone.pointsRequired) || null;
};

export const calculateProgress = (points: number): { current: number; next: number; progress: number } => {
  const currentMilestone = getCurrentMilestone(points);
  const nextMilestone = getNextMilestone(points);
  
  if (!nextMilestone) {
    return { current: points, next: points, progress: 100 };
  }
  
  const progressPoints = points - currentMilestone.pointsRequired;
  const totalPointsNeeded = nextMilestone.pointsRequired - currentMilestone.pointsRequired;
  const progress = Math.min((progressPoints / totalPointsNeeded) * 100, 100);
  
  return {
    current: points,
    next: nextMilestone.pointsRequired,
    progress: Math.round(progress)
  };
};

export const awardPoints = (
  user: User,
  action: PointsTransaction['action'],
  customPoints?: number
): { updatedUser: User; transaction: PointsTransaction } => {
  const pointsMap = {
    profile_complete: POINTS_CONFIG.PROFILE_COMPLETE,
    internship_apply: POINTS_CONFIG.INTERNSHIP_APPLY,
    friend_referral: POINTS_CONFIG.FRIEND_REFERRAL,
    login_streak: POINTS_CONFIG.LOGIN_STREAK,
    daily_login: POINTS_CONFIG.DAILY_LOGIN
  };

  const points = customPoints || pointsMap[action];
  
  const actionDescriptions = {
    profile_complete: 'Profile completed successfully',
    internship_apply: 'Applied for an internship',
    friend_referral: 'Referred a friend to the platform',
    login_streak: 'Login streak bonus',
    daily_login: 'Daily login bonus'
  };

  const transaction: PointsTransaction = {
    id: Date.now().toString(),
    action,
    points,
    timestamp: new Date(),
    description: actionDescriptions[action]
  };

  const updatedUser: User = {
    ...user,
    points: user.points + points,
    pointsHistory: [transaction, ...user.pointsHistory]
  };

  // Check for new badges
  const currentMilestone = getCurrentMilestone(user.points);
  const newMilestone = getCurrentMilestone(updatedUser.points);
  
  if (newMilestone.pointsRequired > currentMilestone.pointsRequired) {
    const newBadge: Badge = {
      id: newMilestone.id,
      name: newMilestone.name,
      description: newMilestone.description,
      icon: newMilestone.badge,
      pointsRequired: newMilestone.pointsRequired,
      earnedAt: new Date()
    };
    
    updatedUser.badges = [...user.badges, newBadge];
  }

  return { updatedUser, transaction };
};

export const updateLoginStreak = (user: User): User => {
  const today = new Date().toDateString();
  const lastLogin = new Date(user.lastLoginDate).toDateString();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
  
  let updatedUser = { ...user, lastLoginDate: today };
  
  if (lastLogin === today) {
    // Already logged in today, no changes
    return updatedUser;
  }
  
  if (lastLogin === yesterday) {
    // Consecutive day, increment streak
    updatedUser.loginStreak = user.loginStreak + 1;
  } else {
    // Streak broken, reset to 1
    updatedUser.loginStreak = 1;
  }
  
  // Award points for daily login
  const dailyLoginResult = awardPoints(updatedUser, 'daily_login');
  updatedUser = dailyLoginResult.updatedUser;
  
  // Award bonus points for streak milestones (every 7 days)
  if (updatedUser.loginStreak % 7 === 0) {
    const streakResult = awardPoints(updatedUser, 'login_streak', POINTS_CONFIG.LOGIN_STREAK * 2);
    updatedUser = streakResult.updatedUser;
  }
  
  return updatedUser;
};