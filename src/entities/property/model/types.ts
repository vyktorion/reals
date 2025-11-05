export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    neighborhood: string;
  };
  type: 'House' | 'Apartment' | 'Villa' | 'Penthouse' | 'Condo' | 'Townhouse' | 'Estate' | 'Studio' | 'Loft';
  status: 'For Sale' | 'For Rent' | 'Sold' | 'Pending';
  bedrooms: number;
  bathrooms: number;
  area: number; // in sqft
  lotSize?: number; // in sqft
  images: string[];
  features: string[];
  yearBuilt: number;
  parkingSpaces?: number;
  floorNumber?: number;
  totalFloors?: number;
  furnished?: boolean;
  petFriendly?: boolean;
  agent: Agent;
  isFeatured?: boolean;
  isNew?: boolean;
  rating?: number;
  reviews?: Review[];
  virtualTour?: string;
  video?: string;
  priceHistory?: PriceHistory[];
  nearbyPlaces?: NearbyPlace[];
  viewCount?: number;
  listedDate?: string;
  lastUpdated?: string;
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