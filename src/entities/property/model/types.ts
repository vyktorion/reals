export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  type: 'sale' | 'rent' | 'hotel';
  status: 'active' | 'sold' | 'rented' | 'pending';
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    neighborhood?: string;
  };
  bedrooms: number;
  bathrooms: number;
  area: number;
  areaUnit: 'sqft' | 'sqm' | 'acre';
  yearBuilt?: number;
  lotSize?: number;
  lotSizeUnit?: 'sqft' | 'sqm' | 'acre';
  parking?: number;
  floors?: number;
  images: string[];
  amenities: string[];
  features: string[];
  propertyTax?: number;
  hoa?: number;
  utilities?: string[];
  availableDate?: Date;
  petPolicy?: 'allowed' | 'not_allowed' | 'conditional';
  furnished?: boolean;
  featured: boolean;
  userId: string;
  agentId?: string;
  views: number;
  favorites: number;
  createdAt: Date;
  updatedAt: Date;
  // Optional extended properties
  rating?: number;
  reviews?: Review[];
  priceHistory?: PriceHistory[];
  nearbyPlaces?: NearbyPlace[];
  agent?: Agent;
  virtualTour?: boolean;
  parkingSpaces?: number; // Alias for parking
  listedDate?: string;
  isFeatured?: boolean; // Alias for featured (legacy support)
  isNew?: boolean; // For new property flag
}

export interface Agent {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  bio?: string;
  rating?: number;
  reviewCount?: number;
  propertiesSold?: number;
  yearsExperience?: number;
  specialties?: string[];
  languages?: string[];
  verified?: boolean;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  helpful?: number;
}

export interface PriceHistory {
  date: string;
  price: number;
}

export interface NearbyPlace {
  name: string;
  type: 'school' | 'hospital' | 'shopping' | 'restaurant' | 'park' | 'transit';
  distance: number; // in miles
  rating?: number;
}

export interface FilterOptions {
  priceRange: [number, number];
  propertyType: string[];
  status: string[];
  bedrooms: number | null;
  bathrooms: number | null;
  minArea: number | null;
  maxArea: number | null;
  furnished?: boolean | null;
  petFriendly?: boolean | null;
  parkingSpaces?: number | null;
  yearBuiltRange?: [number, number];
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: FilterOptions;
  location: string;
  createdAt: string;
  alertsEnabled: boolean;
  newListings?: number;
}