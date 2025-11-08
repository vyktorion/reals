import { MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Property } from '@/entities/property';
import { SaleProperty } from '@/app/sale/shared/types';

interface PropertyCardProps {
  property: Property | SaleProperty;
  currency?: string;
}

export function PropertyCard({ property, currency }: PropertyCardProps) {

  return (
    <div className="group bg-card rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-border hover:border-blue-200/50 dark:hover:border-blue-500/20 hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-video overflow-hidden bg-gray-50 dark:bg-gray-800">
        <Image
          src={property.images[0] || '/placeholder-property.jpg'}
          alt={property.title}
          width={400}
          height={350}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-3 left-3">
          <span className={`px-3 py-1 text-xs rounded-full text-primary-foreground font-medium ${
            property.type === 'rent'
              ? 'bg-blue-500/90'
              : 'bg-green-500/90'
          }`}>
            {property.type === 'rent' ? 'De Închiriat' : 'De Vânzare'}
          </span>
        </div>
        <Link
          href={`/sale/${property.id}`}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-white/90 dark:bg-gray-800/90 rounded-full text-sm font-medium text-gray-900 dark:text-white opacity-0 hover:opacity-100 transition-all duration-300 hover:bg-white dark:hover:bg-gray-800 flex items-center gap-2 shadow-md hover:shadow-lg"
          title="Vezi detalii"
        >
          Vezi detalii
        </Link>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Price & Type */}
        <div className="flex items-baseline justify-between mb-3">
          <div className="text-2xl font-serif text-blue-900 dark:text-blue-100 tracking-tight">
            {property.price}{currency ? ` ${currency}` : ('currency' in property ? ` ${property.currency}` : '')}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {'createdAt' in property ? new Date(property.createdAt).toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' }).replace(/\b\w/g, l => l.toUpperCase()) : 'sale'}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-serif text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
          {property.title}
        </h3>

        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
          <MapPin className="w-4 h-4 shrink-0 text-gray-400" />
          <span className="line-clamp-1">{property.location.city}, {'state' in property.location ? property.location.state : property.location.county}{('zone' in property.location && property.location.zone) ? `, ${property.location.zone}` : ''}</span>
        </div>
        <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="text-center">
            <div className="text-sm text-gray-700 dark:text-gray-300">• {'bedrooms' in property ? property.bedrooms : property.rooms || 0} camere</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-700 dark:text-gray-300">• {property.area} mp</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-700 dark:text-gray-300">• {'floor' in property && 'totalFloors' in property && property.floor && property.totalFloors ? `Etaj ${property.floor}/${property.totalFloors}` : 'Etaj N/A'}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-700 dark:text-gray-300">• {property.yearBuilt}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
