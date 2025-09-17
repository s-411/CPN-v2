// Demographic options for structured data
export type EthnicityOption = 
  | 'Asian'
  | 'Black'
  | 'Latina'
  | 'White'
  | 'Middle Eastern'
  | 'Indian'
  | 'Mixed'
  | 'Native American'
  | 'Pacific Islander'
  | 'Other';

export type HairColorOption =
  | 'Blonde'
  | 'Brunette' 
  | 'Black'
  | 'Red'
  | 'Auburn'
  | 'Gray/Silver'
  | 'Dyed/Colorful'
  | 'Other';

export interface LocationData {
  city?: string;
  country?: string;
}

// Base girl profile type
export interface Girl {
  id: string;
  name: string;
  age: number;
  nationality: string; // Keep existing field for backward compatibility
  rating: number; // 5.0-10.0, 0.5 increments
  // New optional structured demographic fields
  ethnicity?: EthnicityOption;
  hairColor?: HairColorOption;
  location?: LocationData;
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
  rating: number | string; // Allow both for validation errors
  // Optional structured demographic fields for forms
  ethnicity?: EthnicityOption;
  hairColor?: HairColorOption;
  location?: LocationData;
}

export interface DataEntryFormData {
  girlId: string;
  date: string; // String for form input
  amountSpent: string; // String for form input
  durationMinutes: string; // String for form input
  numberOfNuts: string; // String for form input
}

// Form data for data entry page with hours/minutes split
export interface FormData {
  date: string;
  amountSpent: string;
  hours: string;
  minutes: string;
  numberOfNuts: string;
}

// Sort configuration for tables
export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
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

// Data Vault demographic analytics types
export interface DemographicStats {
  ethnicity: {
    [key in EthnicityOption]: {
      averageCostPerNut: number;
      averageRating: number;
      totalSpending: number;
      userCount: number;
    }
  };
  hairColor: {
    [key in HairColorOption]: {
      averageCostPerNut: number;
      averageRating: number;
      totalSpending: number;
      userCount: number;
    }
  };
  ratingTiers: {
    [key: string]: { // "5.0-5.5", "6.0-6.5", etc.
      averageCostPerNut: number;
      totalSpending: number;
      popularityPercentage: number;
    }
  };
  locations: {
    [country: string]: {
      averageCostPerNut: number;
      popularity: number;
    }
  };
}

export interface UserDemographicComparison {
  ethnicityPreference: {
    userFavorite?: EthnicityOption;
    globalMostExpensive?: EthnicityOption;
    userVsGlobalSpending: number; // percentage difference
  };
  ratingPreference: {
    userAverageRating: number;
    globalAverageRating: number;
    userHighRatedPercentage: number; // % of 8+ rated girls
  };
  hairColorPreference: {
    userFavorite?: HairColorOption;
    globalMostExpensive?: HairColorOption;
    userVsGlobalSpending: number;
  };
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

// Overview page types
export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}
