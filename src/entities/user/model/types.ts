export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  hashedPassword?: string;
  avatar?: string;
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserRole = 'Proprietar' | 'Agent' | 'Agenție' | 'Dezvoltator';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  bio?: string;
  location?: string;
  memberSince: string;
  verified: boolean;
  preferences: {
    propertyTypes: string[];
    priceRange: [number, number];
    locations: string[];
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
      newListings: boolean;
      priceDrops: boolean;
      newsletter: boolean;
    };
  };
}

export interface Notification {
  id: string;
  type: 'price_drop' | 'new_listing' | 'saved_search' | 'message' | 'appointment';
  title: string;
  message: string;
  date: string;
  read: boolean;
  propertyId?: string;
  image?: string;
}

export interface Appointment {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  agentName: string;
  date: string;
  time: string;
  type: 'viewing' | 'video_call' | 'phone_call';
  status: 'scheduled' | 'completed' | 'cancelled';
}