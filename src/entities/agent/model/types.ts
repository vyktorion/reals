export interface Agent {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  role?: string;
  bio?: string;
  rating?: number;
  reviewCount?: number;
  propertiesSold?: number;
  yearsExperience?: number;
  specialties?: string[];
  languages?: string[];
  verified?: boolean;
}