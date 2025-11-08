// API pentru secțiunea sale - independent
declare const process: {
  env: {
    NEXT_PUBLIC_API_URL?: string;
  };
};
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface SaleApiFilters {
  q?: string;
  city?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  rooms?: number;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface SaleApiProperty {
  _id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  propertyType: string;
  rooms: number;
  bathrooms: number;
  area: number;
  floor?: number;
  totalFloors?: number;
  yearBuilt?: number;
  location: {
    city: string;
    county: string;
    address: string;
    zone?: string; // adăugat zone
  };
  features: string[];
  images: string[];
  contactInfo: {
    name: string;
    phone: string;
    email: string;
    showPhone: boolean;
    avatar?: string;
    role?: string;
  };
  userId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SaleApiResponse {
  properties: SaleApiProperty[];
  total: number;
  page: number;
  totalPages: number;
}

export class SaleApi {
  static async searchProperties(filters: SaleApiFilters = {}): Promise<SaleApiResponse> {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const url = `${API_BASE_URL}/sale/api/properties?${queryParams}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Failed to search properties: ${response.status}`);
    }

    return response.json();
  }
}