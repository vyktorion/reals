import type { SaleProperty as LegacySaleProperty } from '@/app/sale/shared/types';
import { getSaleProperties, getSalePropertyById } from '@/app/sale/shared/data';
import type { SaleProperty } from '../model/types';

/**
 * Service layer pentru anunțuri de vânzare în noul domain "adds".
 *
 * IMPORTANT:
 * - Păstrăm UI/UX existent.
 * - În această fază folosim încă implementarea legacy (`getSaleProperties`, `getSalePropertyById`),
 *   dar mapăm rezultatul în tipul nou din domains/adds.
 * - Când conectăm API/DB real, schimbăm doar această zonă, fără să atingem UI-ul.
 */

function mapLegacyToDomainSaleProperty(legacy: LegacySaleProperty): SaleProperty {
  const legacyAny = legacy as LegacySaleProperty & {
    createdAt?: string | number | Date;
    updatedAt?: string | number | Date;
  };

  const created =
    legacyAny.createdAt instanceof Date
      ? legacyAny.createdAt
      : legacyAny.createdAt
      ? new Date(legacyAny.createdAt)
      : null;

  const updated =
    legacyAny.updatedAt instanceof Date
      ? legacyAny.updatedAt
      : legacyAny.updatedAt
      ? new Date(legacyAny.updatedAt)
      : null;

  return {
    id: legacy.id,
    title: legacy.title,
    description: legacy.description,
    price: legacy.price,
    currency: legacy.currency,
    images: legacy.images,
    location: {
      city: legacy.location.city,
      county: legacy.location.county,
      zone: legacy.location.zone,
      address: legacy.location.address,
    },
    type: legacy.type,
    status: legacy.status,
    rooms: legacy.rooms,
    bathrooms: legacy.bathrooms,
    area: legacy.area,
    floor: legacy.floor ?? null,
    totalFloors: legacy.totalFloors ?? null,
    yearBuilt: legacy.yearBuilt ?? null,
    createdAt: created ? created.toISOString() : undefined,
    updatedAt: updated ? updated.toISOString() : undefined,
  };
}

export async function fetchSaleList(): Promise<SaleProperty[]> {
  const data = await getSaleProperties();
  return (data ?? []).map(mapLegacyToDomainSaleProperty);
}

export async function fetchSaleById(id: string): Promise<SaleProperty | null> {
  const legacy = await getSalePropertyById(id);
  if (!legacy) return null;
  return mapLegacyToDomainSaleProperty(legacy as LegacySaleProperty);
}