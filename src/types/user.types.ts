// User Types - Consolidated user management

export interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phone?: string;
  role: 'user' | 'agent' | 'admin' | 'owner';
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  verified: boolean;
  verificationDate?: Date;
  profile: UserProfile;
  preferences: UserPreferences;
  stats: UserStats;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

// User profile information
export interface UserProfile {
  bio?: string;
  website?: string;
  linkedIn?: string;
  twitter?: string;
  instagram?: string;
  languages: string[];
  about?: string;
  specializations?: string[];
  certifications?: string[];
  experience?: number;
  licenseNumber?: string;
  brokerage?: string;
  address?: UserAddress;
  interests?: string[];
  socialLinks?: { [key: string]: string };
}

// User address
export interface UserAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// User preferences
export interface UserPreferences {
  language: string;
  timezone: string;
  currency: string;
  theme: 'light' | 'dark' | 'auto';
  notifications: NotificationPreferences;
  privacy: PrivacySettings;
  search: SearchPreferences;
}

// Notification preferences
export interface NotificationPreferences {
  email: {
    propertyMatches: boolean;
    priceAlerts: boolean;
    newMessages: boolean;
    systemUpdates: boolean;
    marketing: boolean;
  };
  push: {
    propertyMatches: boolean;
    priceAlerts: boolean;
    newMessages: boolean;
    systemUpdates: boolean;
  };
  sms: {
    propertyMatches: boolean;
    priceAlerts: boolean;
    newMessages: boolean;
  };
}

// Privacy settings
export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'connections';
  showContactInfo: boolean;
  allowMessages: boolean;
  showOnlineStatus: boolean;
  shareAnalytics: boolean;
}

// Search preferences
export interface SearchPreferences {
  defaultLocation?: string;
  defaultPriceRange: {
    min: number;
    max: number;
  };
  defaultPropertyTypes: string[];
  defaultFilters: Record<string, string | number | boolean | string[]>;
  savedSearches: SavedSearch[];
}

// Saved search
export interface SavedSearch {
  id: string;
  name: string;
  filters: Record<string, string | number | boolean | string[]>;
  alertFrequency: 'immediate' | 'daily' | 'weekly' | 'never';
  active: boolean;
  createdAt: Date;
  lastSearchAt?: Date;
}

// User statistics
export interface UserStats {
  totalViews: number;
  totalFavorites: number;
  totalInquiries: number;
  totalPropertiesListed: number;
  totalPropertiesSold: number;
  totalPropertiesRented: number;
  averageRating: number;
  totalReviews: number;
  responseRate: number;
  responseTime: number; // in hours
}

// User registration
export interface UserRegistration {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'user' | 'agent';
  acceptTerms: boolean;
  marketingConsent: boolean;
}

// User update
export interface UserUpdate {
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  website?: string;
  avatar?: string;
  preferences?: Partial<UserPreferences>;
  address?: UserAddress;
}

// User connection (for agents/users networking)
export interface UserConnection {
  id: string;
  requesterId: string;
  recipientId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'blocked';
  message?: string;
  createdAt: Date;
  updatedAt: Date;
  acceptedAt?: Date;
}

// User activity
export interface UserActivity {
  id: string;
  userId: string;
  type: 'property_view' | 'property_favorite' | 'property_inquiry' | 'message_sent' | 'profile_update';
  data: Record<string, string | number | boolean | string[]>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}