import { SaleApiProperty } from './api/saleApi';
import { SaleProperty } from './types';
import { Property } from '@/entities/property';

export const apiToSaleProperty = (apiProperty: SaleApiProperty): SaleProperty => {
  console.log('🔄 Mapping API property:', {
    _id: apiProperty._id,
    title: apiProperty.title,
    isActive: apiProperty.isActive,
    location: apiProperty.location,
    price: apiProperty.price,
    currency: apiProperty.currency
  });

  const mapped: SaleProperty = {
    id: apiProperty._id,
    title: apiProperty.title,
    description: apiProperty.description,
    price: apiProperty.price,
    currency: apiProperty.currency,
    type: 'sale' as const, // toate sunt pentru vânzare
    status: apiProperty.isActive ? 'active' : 'sold',
    location: {
      address: apiProperty.location.address,
      city: apiProperty.location.city,
      county: apiProperty.location.county,
      zone: apiProperty.location.zone, // zona există în datele noi
    },
    bathrooms: apiProperty.bathrooms,
    rooms: apiProperty.rooms,
    area: apiProperty.area,
    areaUnit: 'mp', // toate sunt în metri pătrați
    floor: apiProperty.floor,
    totalFloors: apiProperty.totalFloors,
    yearBuilt: apiProperty.yearBuilt,
    images: apiProperty.images,
    features: apiProperty.features,
    contactInfo: apiProperty.contactInfo,
    createdAt: new Date(apiProperty.createdAt),
    updatedAt: new Date(apiProperty.updatedAt),
  };

  console.log('🔄 Mapped SaleProperty location:', mapped.location);
  console.log('🔄 Final mapped property:', {
    id: mapped.id,
    title: mapped.title,
    status: mapped.status,
    location: mapped.location
  });

  return mapped;
};

// Mapper pentru a converti SaleProperty în Property (pentru PropertyDetailsEnhanced)
export const salePropertyToProperty = (saleProperty: SaleProperty): Property => {
  // Convertim contactInfo în agent dacă există
  const agent = saleProperty.contactInfo ? {
    id: saleProperty.id, // folosim ID-ul proprietății ca ID agent temporar
    name: saleProperty.contactInfo.name,
    phone: saleProperty.contactInfo.phone,
    email: saleProperty.contactInfo.email,
    avatar: saleProperty.contactInfo.avatar || '',
    bio: saleProperty.contactInfo.role, // folosim role ca bio
    rating: undefined,
    reviewCount: undefined,
    propertiesSold: undefined,
    yearsExperience: undefined,
    specialties: undefined,
    languages: undefined,
    verified: undefined,
  } : undefined;

  return {
    id: saleProperty.id,
    title: saleProperty.title,
    description: saleProperty.description,
    price: saleProperty.price,
    currency: saleProperty.currency,
    type: saleProperty.type,
    status: saleProperty.status,
    location: {
      address: saleProperty.location.address,
      city: saleProperty.location.city,
      state: saleProperty.location.county,
      country: 'Romania',
      zipCode: undefined,
      coordinates: undefined,
      neighborhood: saleProperty.location.zone,
    },
    bedrooms: saleProperty.rooms || 0,
    bathrooms: saleProperty.bathrooms || 0,
    area: saleProperty.area,
    areaUnit: saleProperty.areaUnit as 'sqft' | 'sqm' | 'acre',
    yearBuilt: saleProperty.yearBuilt,
    lotSize: undefined,
    lotSizeUnit: undefined,
    parking: saleProperty.floor ? 1 : 0,
    floors: saleProperty.totalFloors,
    images: saleProperty.images,
    amenities: saleProperty.features,
    features: saleProperty.features,
    propertyTax: undefined,
    hoa: undefined,
    utilities: [],
    availableDate: undefined,
    petPolicy: 'not_allowed' as const,
    furnished: false,
    featured: false,
    userId: '',
    agentId: undefined,
    views: 0,
    favorites: 0,
    createdAt: saleProperty.createdAt,
    updatedAt: saleProperty.updatedAt,
    rating: undefined,
    reviews: [],
    priceHistory: [],
    nearbyPlaces: [],
    agent,
    virtualTour: false,
    parkingSpaces: saleProperty.floor ? 1 : 0,
    listedDate: undefined,
    isFeatured: false,
    isNew: false,
  };
};