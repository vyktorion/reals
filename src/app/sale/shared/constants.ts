// Constante pentru secțiunea sale

export const PROPERTY_TYPES = [
  { value: 'house', label: 'Casă' },
  { value: 'apartment', label: 'Apartament' },
  { value: 'villa', label: 'Vilă' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'condo', label: 'Condo' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'estate', label: 'Proprietate' },
] as const;

export const STATUS_OPTIONS = [
  { value: 'active', label: 'Activ' },
  { value: 'sold', label: 'Vândut' },
] as const;

export const CURRENCY_OPTIONS = [
  { value: 'RON', label: 'RON' },
  { value: 'EUR', label: 'EUR' },
  { value: 'USD', label: 'USD' },
] as const;

export const AREA_UNITS = [
  { value: 'mp', label: 'mp' },
  { value: 'sqft', label: 'sqft' },
] as const;

export const BEDROOM_OPTIONS = [
  { value: 0, label: 'Studio' },
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5+' },
] as const;

export const BATHROOM_OPTIONS = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4+' },
] as const;

export const FEATURES_OPTIONS = [
  'Balcon',
  'Terasă',
  'Garaj',
  'Parcare',
  'Boxă',
  'Aer condiționat',
  'Încălizire centrală',
  'Internet',
  'Mobilat',
  'Uscător de rufe',
  'Mașină de spălat',
  'Cuptor cu microunde',
  'Frigider',
  'Aragaz',
  'Husă de ventilator',
  'Grătar',
  'Piscină',
  'Saună',
  'Jacuzzi',
  'Sală de fitness',
  'Portar',
  'Supraveghere video',
  'Alarma',
] as const;

export const PRICE_RANGES = [
  { min: 0, max: 50000, label: 'Sub 50.000 RON' },
  { min: 50000, max: 100000, label: '50.000 - 100.000 RON' },
  { min: 100000, max: 200000, label: '100.000 - 200.000 RON' },
  { min: 200000, max: 500000, label: '200.000 - 500.000 RON' },
  { min: 500000, max: 1000000, label: '500.000 - 1.000.000 RON' },
  { min: 1000000, max: 10000000, label: 'Peste 1.000.000 RON' },
] as const;

export const DEFAULT_FILTERS = {
  priceRange: [0, 10000000] as [number, number],
  propertyType: [] as string[],
  status: [] as string[],
  bedrooms: null,
  bathrooms: null,
  minArea: null,
  maxArea: null,
  location: ''
};