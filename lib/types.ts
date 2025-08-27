// Base girl profile type
export interface Girl {
  id: string;
  name: string;
  age: number;
  nationality: string;
  rating: number; // 5.0-10.0, 0.5 increments
  createdAt: Date;
  updatedAt: Date;
}

// Alias for backward compatibility
export interface GirlProfile extends Girl {}

export interface DataEntry {
  id: string;
  girlId: string;
  date: Date;
  amountSpent: number;
  durationMinutes: number;
  numberOfNuts: number;
  createdAt: Date;
  updatedAt: Date;
}

// Form data types (without generated fields)
export interface GirlFormData {
  name: string;
  age: string; // String for form input
  nationality: string;
  rating: number;
}

export interface DataEntryFormData {
  girlId: string;
  date: string; // String for form input
  amountSpent: string; // String for form input
  durationMinutes: string; // String for form input
  numberOfNuts: string; // String for form input
}

// Calculated metrics for a girl
export interface CalculatedMetrics {
  totalSpent: number;
  totalNuts: number;
  totalTime: number; // in minutes
  costPerNut: number;
  timePerNut: number; // in minutes
  costPerHour: number;
}

// Girl with calculated metrics
export interface GirlWithMetrics extends Girl {
  metrics: CalculatedMetrics;
  totalEntries: number;
}

// Global statistics
export interface GlobalStats {
  totalGirls: number;
  activeGirls: number;
  totalSpent: number;
  totalNuts: number;
  totalTime: number;
  averageRating: number;
}

// Legacy alias for backward compatibility
export interface AnalyticsMetrics extends CalculatedMetrics {
  averageCostPerNut: number;
  averageTimePerNut: number;
  averageCostPerHour: number;
}

// Leaderboard types
export interface LeaderboardGroup {
  id: string;
  name: string;
  createdBy: string; // user id
  createdAt: Date;
  updatedAt: Date;
  inviteToken: string; // for shareable links
  isPrivate: boolean; // always true for now
  memberCount: number;
}

export interface LeaderboardMember {
  id: string;
  groupId: string;
  userId: string;
  username: string; // display name (anonymous)
  joinedAt: Date;
  stats: LeaderboardStats;
}

export interface LeaderboardStats {
  totalSpent: number;
  totalNuts: number;
  costPerNut: number;
  totalTime: number; // in minutes
  totalGirls: number;
  efficiency: number; // calculated ranking metric
  lastUpdated: Date;
}

export interface LeaderboardRanking {
  rank: number;
  member: LeaderboardMember;
  change?: number; // rank change since last update
}

// Mock user for testing leaderboards
export interface MockUser {
  id: string;
  username: string;
  avatar?: string;
  joinedDate: Date;
  location: string;
  stats: LeaderboardStats;
}

// Form types
export interface CreateGroupFormData {
  name: string;
}

export interface JoinGroupData {
  inviteToken: string;
  username: string;
}
