import { useState } from 'react';
import { X, Heart, MapPin, Bed, Bath, Maximize, Calendar, Share2, ChevronLeft, ChevronRight, Phone, MessageSquare, Star, TrendingUp, Navigation, School, ShoppingBag, Video, Car } from 'lucide-react';
import { Property } from '../entities/property';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ContactForm } from './ContactForm';
import { toast } from 'sonner';

interface PropertyDetailsProps {
  property: Property;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClose: () => void;
}

export function PropertyDetails({ property, isFavorite, onToggleFavorite, onClose }: PropertyDetailsProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'location' | 'reviews'>('overview');
  const [imageZoom, setImageZoom] = useState(false);

  const formatPrice = (price: number) => {
    if (property.status === 'For Rent') {
      return `$${price.toLocaleString('en-US')} / month`;
    }
    return `$${price.toLocaleString('en-US')}`;
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const handleShare = () => {
    toast.success('Link copied to clipboard!');
  };

  const handleScheduleTour = () => {
    toast.success('Tour request sent! Agent will contact you soon.');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'fill-amber-400 text-amber-400'
            : i < rating
            ? 'fill-amber-200 text-amber-400'
            : 'fill-none text-gray-300'
        }`}
      />
    ));
  };

  const iconMap = {
    school: School,
    hospital: Navigation,
    shopping: ShoppingBag,
    restaurant: ShoppingBag,
    park: Navigation,
    transit: Navigation
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="absolute inset-0 overflow-y-auto">
        <div className="min-h-full flex items-start justify-center md:p-4 md:py-8">
          <div className="relative bg-card md:rounded-3xl shadow-2xl max-w-7xl w-full md:my-8 animate-in zoom-in-95 slide-in-from-bottom-8 duration-300 min-h-screen md:min-h-0">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="fixed md:absolute top-4 right-4 z-20 p-3 bg-card/95 backdrop-blur-md rounded-full hover:bg-card transition-all shadow-lg hover:scale-110"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>

            {/* Desktop Layout */}
            <div className="hidden md:grid md:grid-cols-2 gap-8 p-8">
              {/* Left: Images */}
              <div className="sticky top-8 h-fit">
                <div className="relative aspect-4/3 bg-gray-900 rounded-2xl overflow-hidden group">
                  <ImageWithFallback
                    src={property.images[currentImageIndex]}
                    alt={property.title}
                    className="w-full h-full object-cover cursor-zoom-in"
                    onClick={() => setImageZoom(!imageZoom)}
                  />

                  {/* Navigation */}
                  {property.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-card/95 backdrop-blur-md rounded-full hover:bg-card transition-all shadow-lg opacity-0 group-hover:opacity-100"
                      >
                        <ChevronLeft className="w-6 h-6 text-gray-700" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-card/95 backdrop-blur-md rounded-full hover:bg-card transition-all shadow-lg opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight className="w-6 h-6 text-gray-700" />
                      </button>

                      {/* Counter */}
                      <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/70 backdrop-blur-md text-primary-foreground text-sm rounded-full">
                        {currentImageIndex + 1} / {property.images.length}
                      </div>
                    </>
                  )}

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`px-3 py-1.5 rounded-full text-sm backdrop-blur-md ${
                      property.status === 'For Sale'
                        ? 'bg-blue-900/90 text-primary-foreground'
                        : 'bg-amber-500/90 text-primary-foreground'
                    }`}>
                      {property.status}
                    </span>
                    {property.isFeatured && (
                      <span className="px-3 py-1.5 rounded-full text-sm bg-amber-400/90 text-gray-900 backdrop-blur-md">
                        Featured
                      </span>
                    )}
                    {property.isNew && (
                      <span className="px-3 py-1.5 rounded-full text-sm bg-green-500/90 text-primary-foreground backdrop-blur-md">
                        New
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={handleShare}
                      className="p-2.5 bg-card/95 backdrop-blur-md rounded-full hover:bg-card transition-all shadow-lg hover:scale-110"
                    >
                      <Share2 className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                      onClick={() => onToggleFavorite(property.id)}
                      className={`p-2.5 backdrop-blur-md rounded-full transition-all shadow-lg hover:scale-110 ${
                        isFavorite
                          ? 'bg-red-500 text-primary-foreground'
                          : 'bg-card/95 text-gray-700 hover:bg-card'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Thumbnail Grid */}
                {property.images.length > 1 && (
                  <div className="grid grid-cols-6 gap-2 mt-4">
                    {property.images.slice(0, 6).map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative aspect-square rounded-lg overflow-hidden transition-all ${
                          index === currentImageIndex
                            ? 'ring-2 ring-blue-900 scale-105'
                            : 'opacity-70 hover:opacity-100'
                        }`}
                      >
                        <ImageWithFallback
                          src={image}
                          alt={`View ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  {property.virtualTour && (
                    <button className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors flex items-center justify-center gap-2">
                      <Video className="w-5 h-5 text-gray-700" />
                      <span className="text-gray-900">Virtual Tour</span>
                    </button>
                  )}
                  <button
                    onClick={handleScheduleTour}
                    className="px-4 py-3 bg-blue-900 hover:bg-blue-800 text-primary-foreground rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-5 h-5" />
                    <span>Schedule Tour</span>
                  </button>
                </div>
              </div>

              {/* Right: Content */}
              <div className="overflow-y-auto max-h-[calc(100vh-8rem)]">
                {/* Header */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h1 className="text-gray-900 mb-2 text-3xl">{property.title}</h1>
                      <div className="flex items-center gap-2 text-gray-600 mb-3">
                        <MapPin className="w-5 h-5 shrink-0" />
                        <span>{property.location.address}, {property.location.city}, {property.location.state}</span>
                      </div>
                      {property.rating && (
                        <div className="flex items-center gap-2">
                          <div className="flex gap-0.5">{renderStars(property.rating)}</div>
                          <span className="text-sm text-gray-600">
                            {property.rating.toFixed(1)} ({property.reviews?.length || 0} reviews)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <div className="text-3xl text-blue-900">{formatPrice(property.price)}</div>
                    {property.priceHistory && property.priceHistory.length > 1 && (
                      <div className="flex items-center gap-1 text-sm text-green-600">
                        <TrendingUp className="w-4 h-4" />
                        <span>Price reduced</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-6 border-b border-gray-200">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'details', label: 'Details' },
                    { id: 'location', label: 'Location' },
                    { id: 'reviews', label: 'Reviews' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as 'overview' | 'details' | 'location' | 'reviews')}
                      className={`px-4 py-2 transition-colors relative ${
                        activeTab === tab.id
                          ? 'text-blue-900'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab.label}
                      {activeTab === tab.id && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-900" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div>
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      {/* Key Stats */}
                      <div className="grid grid-cols-4 gap-4">
                        <div className="bg-background rounded-xl p-4">
                          <Bed className="w-5 h-5 text-gray-600 mb-2" />
                          <div className="text-gray-900">{property.bedrooms}</div>
                          <div className="text-xs text-gray-600">Bedrooms</div>
                        </div>
                        <div className="bg-background rounded-xl p-4">
                          <Bath className="w-5 h-5 text-gray-600 mb-2" />
                          <div className="text-gray-900">{property.bathrooms}</div>
                          <div className="text-xs text-gray-600">Bathrooms</div>
                        </div>
                        <div className="bg-background rounded-xl p-4">
                          <Maximize className="w-5 h-5 text-gray-600 mb-2" />
                          <div className="text-gray-900">{property.area.toLocaleString('en-US')}</div>
                          <div className="text-xs text-gray-600">Sqft</div>
                        </div>
                        <div className="bg-background rounded-xl p-4">
                          <Car className="w-5 h-5 text-gray-600 mb-2" />
                          <div className="text-gray-900">{property.parkingSpaces || 0}</div>
                          <div className="text-xs text-gray-600">Parking</div>
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <h3 className="text-gray-900 mb-3">Description</h3>
                        <p className="text-gray-600 leading-relaxed">{property.description}</p>
                      </div>

                      {/* Features */}
                      <div>
                        <h3 className="text-gray-900 mb-3">Features & Amenities</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {property.features.map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 text-gray-700 bg-background rounded-lg px-3 py-2"
                            >
                              <div className="w-2 h-2 bg-blue-900 rounded-full shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'details' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { label: 'Property Type', value: property.type },
                          { label: 'Year Built', value: property.yearBuilt },
                          { label: 'Area', value: `${property.area.toLocaleString('en-US')} sqft` },
                          { label: 'Lot Size', value: property.lotSize ? `${property.lotSize.toLocaleString('en-US')} sqft` : 'N/A' },
                          { label: 'Parking', value: `${property.parkingSpaces || 0} spaces` },
                          { label: 'Pet Policy', value: property.petFriendly ? 'Pet Friendly' : 'No Pets' },
                          { label: 'Furnished', value: property.furnished ? 'Yes' : 'No' },
                          { label: 'Listed', value: property.listedDate || 'N/A' },
                        ].map((item, index) => (
                          <div key={index} className="py-3 border-b border-gray-100">
                            <div className="text-sm text-gray-600 mb-1">{item.label}</div>
                            <div className="text-gray-900">{item.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'location' && (
                    <div className="space-y-6">
                      {/* Address */}
                      <div>
                        <h3 className="text-gray-900 mb-3">Address</h3>
                        <div className="bg-background rounded-xl p-4">
                          <div className="text-gray-900 mb-1">{property.location.address}</div>
                          <div className="text-gray-600">{property.location.city}, {property.location.state} {property.location.zipCode}</div>
                          <div className="text-gray-600">{property.location.country}</div>
                        </div>
                      </div>

                      {/* Nearby Places */}
                      {property.nearbyPlaces && property.nearbyPlaces.length > 0 && (
                        <div>
                          <h3 className="text-gray-900 mb-3">Nearby Places</h3>
                          <div className="space-y-2">
                            {property.nearbyPlaces.map((place, index) => {
                              const PlaceIcon = iconMap[place.type] || Navigation;
                              return (
                                <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-card rounded-full flex items-center justify-center">
                                      <PlaceIcon className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <div>
                                      <div className="text-gray-900 text-sm">{place.name}</div>
                                      <div className="text-xs text-gray-600 capitalize">{place.type}</div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm text-gray-900">{place.distance} mi</div>
                                    {place.rating && (
                                      <div className="flex items-center gap-1 text-xs text-gray-600">
                                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                        <span>{place.rating}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="space-y-6">
                      {property.reviews && property.reviews.length > 0 ? (
                        property.reviews.map((review) => (
                          <div key={review.id} className="pb-6 border-b border-gray-100 last:border-0">
                            <div className="flex items-start gap-4">
                              <ImageWithFallback
                                src={review.userAvatar}
                                alt={review.userName}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <div>
                                    <div className="text-gray-900">{review.userName}</div>
                                    <div className="text-sm text-gray-600">{review.date}</div>
                                  </div>
                                  <div className="flex gap-0.5">{renderStars(review.rating)}</div>
                                </div>
                                <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          No reviews yet
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Agent Card */}
                <div className="mt-8 bg-linear-to-br from-blue-50 to-gray-50 rounded-2xl p-6">
                  <h3 className="text-gray-900 mb-4">Contact Agent</h3>

                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                    <ImageWithFallback
                      src={property.agent.avatar}
                      alt={property.agent.name}
                      className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-md"
                    />
                    <div className="flex-1">
                      <div className="text-gray-900 mb-1">{property.agent.name}</div>
                      {property.agent.rating && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="flex gap-0.5">{renderStars(property.agent.rating)}</div>
                          <span>{property.agent.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => window.location.href = `tel:${property.agent.phone}`}
                      className="px-4 py-3 bg-card hover:bg-background text-gray-900 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 border border-gray-200"
                    >
                      <Phone className="w-5 h-5" />
                      <span>Call</span>
                    </button>
                    <button
                      onClick={() => setShowContactForm(true)}
                      className="px-4 py-3 bg-blue-900 hover:bg-blue-800 text-primary-foreground rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-5 h-5" />
                      <span>Message</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden">
              {/* Image Gallery */}
              <div className="relative aspect-square bg-gray-900">
                <ImageWithFallback
                  src={property.images[currentImageIndex]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />

                {/* Navigation */}
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-card/95 backdrop-blur-md rounded-full shadow-lg"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-card/95 backdrop-blur-md rounded-full shadow-lg"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-700" />
                    </button>
                    <div className="absolute bottom-4 right-4 px-2.5 py-1 bg-black/70 backdrop-blur-md text-primary-foreground text-xs rounded-full">
                      {currentImageIndex + 1} / {property.images.length}
                    </div>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs backdrop-blur-md ${
                    property.status === 'For Sale'
                      ? 'bg-blue-900/90 text-primary-foreground'
                      : 'bg-amber-500/90 text-primary-foreground'
                  }`}>
                    {property.status}
                  </span>
                  {property.isFeatured && (
                    <span className="px-2.5 py-1 rounded-full text-xs bg-amber-400/90 text-gray-900 backdrop-blur-md">
                      Featured
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="absolute top-16 right-4 flex flex-col gap-2">
                  <button
                    onClick={handleShare}
                    className="p-2 bg-card/95 backdrop-blur-md rounded-full shadow-lg"
                  >
                    <Share2 className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={() => onToggleFavorite(property.id)}
                    className={`p-2 backdrop-blur-md rounded-full shadow-lg ${
                      isFavorite
                        ? 'bg-red-500 text-primary-foreground'
                        : 'bg-card/95 text-gray-700'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 pb-32">
                <div className="mb-6">
                  <h1 className="text-gray-900 mb-2 text-2xl">{property.title}</h1>
                  <div className="flex items-center gap-2 text-gray-600 mb-3 text-sm">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span>{property.location.city}, {property.location.state}</span>
                  </div>
                  <div className="text-2xl text-blue-900">{formatPrice(property.price)}</div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                  <div className="text-center">
                    <Bed className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                    <div className="text-gray-900 text-sm">{property.bedrooms}</div>
                    <div className="text-xs text-gray-600">Beds</div>
                  </div>
                  <div className="text-center">
                    <Bath className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                    <div className="text-gray-900 text-sm">{property.bathrooms}</div>
                    <div className="text-xs text-gray-600">Baths</div>
                  </div>
                  <div className="text-center">
                    <Maximize className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                    <div className="text-gray-900 text-sm">{property.area.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">Sqft</div>
                  </div>
                  <div className="text-center">
                    <Car className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                    <div className="text-gray-900 text-sm">{property.parkingSpaces || 0}</div>
                    <div className="text-xs text-gray-600">Parking</div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-6 border-b border-gray-200 overflow-x-auto">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'details', label: 'Details' },
                    { id: 'location', label: 'Location' },
                    { id: 'reviews', label: 'Reviews' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as 'overview' | 'details' | 'location' | 'reviews')}
                      className={`px-4 py-2 whitespace-nowrap transition-colors relative text-sm ${
                        activeTab === tab.id
                          ? 'text-blue-900'
                          : 'text-gray-600'
                      }`}
                    >
                      {tab.label}
                      {activeTab === tab.id && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-900" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Mobile Tab Content (same as desktop but condensed) */}
                <div className="mb-6">
                  {activeTab === 'overview' && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-gray-900 mb-2">Description</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{property.description}</p>
                      </div>
                      <div>
                        <h3 className="text-gray-900 mb-2">Features</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {property.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 text-gray-700 text-sm">
                              <div className="w-1.5 h-1.5 bg-blue-900 rounded-full shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Add other tabs content similar to desktop but mobile optimized */}
                </div>

                {/* Agent Card */}
                <div className="bg-linear-to-br from-blue-50 to-gray-50 rounded-2xl p-4">
                  <h3 className="text-gray-900 mb-3">Contact Agent</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <ImageWithFallback
                      src={property.agent.avatar}
                      alt={property.agent.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-gray-900">{property.agent.name}</div>
                      <div className="text-xs text-gray-600">Real Estate Agent</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => window.location.href = `tel:${property.agent.phone}`}
                      className="px-3 py-2 bg-card text-gray-900 rounded-lg text-sm flex items-center justify-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call</span>
                    </button>
                    <button
                      onClick={() => setShowContactForm(true)}
                      className="px-3 py-2 bg-blue-900 text-primary-foreground rounded-lg text-sm flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Message</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Fixed Bottom CTA */}
              <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-gray-200 p-4 shadow-lg z-10">
                <button
                  onClick={handleScheduleTour}
                  className="w-full py-3 bg-blue-900 hover:bg-blue-800 text-primary-foreground rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Schedule Tour</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <ContactForm
          property={property}
          onClose={() => setShowContactForm(false)}
        />
      )}
    </div>
  );
}
