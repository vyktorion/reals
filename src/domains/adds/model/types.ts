export type PropertyLocation = {
  city: string;
  county?: string;
  zone?: string;
  address?: string;
};

export type BaseProperty = {
  id: string;
  title: string;
  description?: string;
  price: number;
  currency: string;
  images: string[];
  location: PropertyLocation;
  createdAt?: string;
  updatedAt?: string;
};

export type SaleProperty = BaseProperty & {
  type: string;
  status: 'active' | 'sold' | 'draft' | string;
  rooms?: number;
  bathrooms?: number;
  area?: number;
  floor?: number | null;
  totalFloors?: number | null;
  yearBuilt?: number | null;
};

export type RentProperty = BaseProperty & {
  // extensie ulterioară pentru chirii (per month, depozit etc)
};

export type HotelProperty = BaseProperty & {
  // extensie ulterioară pentru hotel/cazare
};

export type SaleFilters = {
  priceMin?: number;
  priceMax?: number;
  propertyTypes?: string[];
  status?: string[];
  bedrooms?: number | null;
  bathrooms?: number | null;
  minArea?: number | null;
  maxArea?: number | null;
};

export type AddsTab = 'sale' | 'rent' | 'hotel';