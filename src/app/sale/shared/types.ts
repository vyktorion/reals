// Tipuri comune pentru secțiunea sale

export interface SaleProperty {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  type: 'sale' | 'rent' | 'hotel';
  status: 'active' | 'sold' | 'rented';
  location: {
    address: string;
    city: string;
    county: string;
    zone?: string;
  };
  bathrooms?: number;
  rooms?: number;
  area: number;
  areaUnit: string;
  floor?: number;
  totalFloors?: number;
  yearBuilt?: number;
  images: string[];
  features: string[];
  contactInfo?: {
    name: string;
    phone: string;
    email: string;
    showPhone: boolean;
    avatar?: string;
    role?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface SaleFilters {
  priceRange: [number, number];
  propertyType: string[];
  status: string[];
  bedrooms: number | null;
  bathrooms: number | null;
  minArea: number | null;
  maxArea: number | null;
  location: string;
}

export type ViewMode = 'grid' | 'list' | 'map';