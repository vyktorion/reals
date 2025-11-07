// Integrare cu baza de date pentru secțiunea sale

import { SaleApi } from './api/saleApi';
import { apiToSaleProperty } from './mappers';
import { SaleProperty } from './types';

// Funcție pentru încărcarea proprietăților din baza de date
export const getSaleProperties = async (): Promise<SaleProperty[]> => {
  console.log('🏠 getSaleProperties: Called');
  try {
    const result = await SaleApi.searchProperties({ isActive: true });
    console.log('🏠 getSaleProperties: API returned', result.properties?.length || 0, 'properties');
    const mapped = result.properties.map(apiToSaleProperty);
    console.log('🏠 getSaleProperties: Mapped to', mapped.length, 'SaleProperty objects');
    return mapped;
  } catch (error) {
    console.error('❌ getSaleProperties: Error loading properties:', error);
    // Returnăm array gol în caz de eroare
    return [];
  }
};

// Funcție pentru obținerea unei proprietăți după ID
export const getSalePropertyById = async (id: string): Promise<SaleProperty | null> => {
  console.log('🏠 getSalePropertyById: Called with id:', id);
  try {
    // Deoarece API-ul nu are endpoint pentru o singură proprietate,
    // facem căutare după ID folosind MongoDB ObjectId
    const result = await SaleApi.searchProperties({ isActive: true });
    console.log('🏠 getSalePropertyById: API returned', result.properties?.length || 0, 'properties');

    const apiProperty = result.properties.find(p => p._id === id);
    if (!apiProperty) {
      console.log('🏠 getSalePropertyById: Property not found for id:', id);
      return null;
    }

    const mapped = apiToSaleProperty(apiProperty);
    console.log('🏠 getSalePropertyById: Mapped property:', {
      id: mapped.id,
      title: mapped.title,
      status: mapped.status
    });

    return mapped;
  } catch (error) {
    console.error('❌ getSalePropertyById: Error loading property:', error);
    return null;
  }
};

// Alte funcții pentru gestionarea proprietăților vor fi adăugate ulterior