import { X, MapPin, Check, Minus } from 'lucide-react';
import { Property } from '@/entities/property';
import { ImageIcon } from 'lucide-react';

interface PropertyComparisonProps {
  properties: Property[];
  onClose: () => void;
  onViewDetails: (id: string) => void;
}

export function PropertyComparison({ properties, onClose, onViewDetails }: PropertyComparisonProps) {
  const formatPrice = (price: number, type: string) => {
    if (type === 'rent') {
      return `$${price.toLocaleString('en-US')}/mo`;
    }
    return `$${price.toLocaleString('en-US')}`;
  };

  const comparisonRows = [
    { label: 'Price', key: 'price', format: (p: Property) => formatPrice(p.price, p.type) },
    { label: 'Type', key: 'type', format: (p: Property) => p.type },
    { label: 'Bedrooms', key: 'bedrooms', format: (p: Property) => p.bedrooms },
    { label: 'Bathrooms', key: 'bathrooms', format: (p: Property) => p.bathrooms },
    { label: 'Area', key: 'area', format: (p: Property) => `${p.area.toLocaleString('en-US')} sqft` },
    { label: 'Year Built', key: 'yearBuilt', format: (p: Property) => p.yearBuilt },
    { label: 'Parking', key: 'parkingSpaces', format: (p: Property) => p.parkingSpaces || 0 },
    { label: 'Pet Friendly', key: 'petPolicy', format: (p: Property) => p.petPolicy === 'allowed' },
    { label: 'Furnished', key: 'furnished', format: (p: Property) => p.furnished },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="absolute inset-0 overflow-y-auto">
        <div className="min-h-full flex items-start justify-center p-4 py-8">
          <div className="relative bg-card rounded-3xl shadow-2xl max-w-6xl w-full my-8 animate-in zoom-in-95 slide-in-from-bottom-8 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-gray-900">Compare Properties</h2>
                <p className="text-gray-600 text-sm mt-1">Side-by-side comparison of {properties.length} properties</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close comparison dialog"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="sticky left-0 bg-card z-10 p-4 text-left w-48">
                      <div className="text-sm text-gray-600">Features</div>
                    </th>
                    {properties.map((property) => (
                      <th key={property.id} className="p-4 min-w-[280px]">
                        <div className="bg-background rounded-xl overflow-hidden">
                          <div className="aspect-4/3 relative">
                            <ImageIcon className="h-48 w-full text-gray-300" />
                          </div>
                          <div className="p-4">
                            <h3 className="text-gray-900 text-sm mb-2 line-clamp-2">{property.title}</h3>
                            <div className="flex items-center gap-1 text-xs text-gray-600 mb-3">
                              <MapPin className="w-3 h-3" />
                              <span>{property.location.city}</span>
                            </div>
                            <button
                              onClick={() => onViewDetails(property.id)}
                              className="w-full py-2 bg-blue-900 hover:bg-blue-800 text-primary-foreground text-sm rounded-lg transition-colors"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-background' : 'bg-card'}>
                      <td className="sticky left-0 bg-inherit z-10 p-4 text-sm text-gray-700">
                        {row.label}
                      </td>
                      {properties.map((property) => (
                        <td key={property.id} className="p-4 text-center">
                          <div className="text-gray-900">
                            {typeof row.format(property) === 'boolean' ? (
                              row.format(property) ? (
                                <div className="inline-flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded-full">
                                  <Check className="w-5 h-5" aria-label="Yes" />
                                </div>
                              ) : (
                                <div className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-400 rounded-full">
                                  <Minus className="w-5 h-5" aria-label="No" />
                                </div>
                              )
                            ) : (
                              row.format(property)
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}

                  {/* Features Comparison */}
                  <tr className="bg-card">
                    <td className="sticky left-0 bg-card z-10 p-4 text-sm text-gray-700 align-top">
                      Features
                    </td>
                    {properties.map((property) => (
                      <td key={property.id} className="p-4 align-top">
                        <div className="space-y-1">
                          {property.features.slice(0, 6).map((feature, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                              <div className="w-1.5 h-1.5 bg-blue-900 rounded-full" />
                              <span>{feature}</span>
                            </div>
                          ))}
                          {property.features.length > 6 && (
                            <div className="text-xs text-blue-900">
                              +{property.features.length - 6} more
                            </div>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
