import { useState } from 'react';
import { X, Heart, MapPin, Bed, Bath, Maximize, Calendar, Share2, ChevronLeft, ChevronRight, Phone, MessageSquare, Star, TrendingUp, Navigation, School, ShoppingBag, Video, Car } from 'lucide-react';
import { Property } from '../entities/property';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ContactForm } from './ContactForm';
import { toast } from 'sonner';

interface PropertyDetailsEnhancedProps {
  property: Property;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClose: () => void;
}

export function PropertyDetailsEnhanced({ property, isFavorite, onToggleFavorite, onClose }: PropertyDetailsEnhancedProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'location' | 'reviews'>('overview');
  const [imageZoom, setImageZoom] = useState(false);
  const [thumbnailOffset, setThumbnailOffset] = useState(0);

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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={onClose}
              className="p-3 bg-card hover:bg-accent rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold text-foreground">{property.title}</h1>
              <p className="text-muted-foreground">{property.location.city}, {property.location.state}</p>
            </div>
          </div>

          {/* Price and Status */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-xl font-bold text-primary">{formatPrice(property.price)}</div>
            <div className="flex items-center gap-2">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                property.status === 'For Sale'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              }`}>
                {property.status}
              </span>
              {property.isFeatured && (
                <span className="px-4 py-2 rounded-full text-sm font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                  Featured
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images + Description */}
          <div className="lg:col-span-2 space-y-8">
            {/* Main Image */}
            <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden">
              <ImageWithFallback
                src={property.images[currentImageIndex]}
                alt={property.title}
                width={800}
                height={450}
                quality={85}
                className="w-full h-full object-cover"
              />

              {/* Navigation */}
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <div className="absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded-full transition-colors text-sm">
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
              </div>

              {/* Actions */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={handleShare}
                  className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors cursor-pointer"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onToggleFavorite(property.id)}
                  className={`p-2 rounded-full transition-colors cursor-pointer ${
                    isFavorite
                      ? 'bg-black/70 text-white'
                      : 'bg-black/50 hover:bg-black/70 text-white'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Thumbnail Grid */}
            {property.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {property.images.slice(0, 5).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative aspect-video rounded-lg overflow-hidden transition-all ${
                      index === currentImageIndex
                        ? 'ring-2 ring-blue-900 scale-105'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <ImageWithFallback
                      src={image}
                      alt={`View ${index + 1}`}
                      width={200}
                      height={120}
                      quality={70}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Description</h2>
              <p className="text-muted-foreground leading-relaxed">{property.description}</p>
            </div>

            {/* Features */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Features & Amenities</h2>
              <div className="grid grid-cols-2 gap-3">
                {property.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-card rounded-lg border">
                    <div className="w-2 h-2 bg-primary rounded-full shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Property Details */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Property Details</h2>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { label: 'Property Type', value: property.type },
                  { label: 'Year Built', value: property.yearBuilt },
                  { label: 'Area', value: `${property.area.toLocaleString()} sqft` },
                  { label: 'Lot Size', value: property.lotSize ? `${property.lotSize.toLocaleString()} sqft` : 'N/A' },
                  { label: 'Parking', value: `${property.parkingSpaces || 0} spaces` },
                  { label: 'Pet Policy', value: property.petFriendly ? 'Pet Friendly' : 'No Pets' },
                  { label: 'Furnished', value: property.furnished ? 'Yes' : 'No' }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between py-3 border-b border-border last:border-0">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="text-foreground font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Location</h2>
              <div className="bg-card rounded-xl p-6 border">
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-primary mt-1 shrink-0" />
                  <div>
                    <div className="text-foreground font-medium">{property.location.address}</div>
                    <div className="text-muted-foreground">{property.location.city}, {property.location.state} {property.location.zipCode}</div>
                    <div className="text-muted-foreground">{property.location.country}</div>
                  </div>
                </div>
              </div>

              {property.nearbyPlaces && property.nearbyPlaces.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Nearby Places</h3>
                  <div className="space-y-3">
                    {property.nearbyPlaces.map((place, index) => {
                      const PlaceIcon = iconMap[place.type] || Navigation;
                      return (
                        <div key={index} className="flex items-center justify-between p-4 bg-card rounded-lg border">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <PlaceIcon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <div className="text-foreground font-medium">{place.name}</div>
                              <div className="text-sm text-muted-foreground capitalize">{place.type}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-foreground font-medium">{place.distance} mi</div>
                            {place.rating && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
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

            {/* Reviews Section */}
            {property.reviews && property.reviews.length > 0 && (
              <div className="bg-card rounded-xl p-6 border">
                <h2 className="text-2xl font-bold text-foreground mb-6">Reviews</h2>
                <div className="space-y-4">
                  {property.reviews.slice(0, 3).map((review) => (
                    <div key={review.id} className="pb-4 border-b border-border last:border-0">
                      <div className="flex items-start gap-4">
                        <ImageWithFallback
                          src={review.userAvatar}
                          alt={review.userName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <div className="text-foreground font-medium">{review.userName}</div>
                              <div className="text-sm text-muted-foreground">{review.date}</div>
                            </div>
                            <div className="flex gap-0.5">{renderStars(review.rating)}</div>
                          </div>
                          <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Agent */}
          <div className="lg:col-span-1 space-y-6">
            {/* Agent Card - Right Side */}
            <div className="bg-card rounded-xl p-6 border sticky top-35">
              <h2 className="text-xl font-bold text-foreground mb-6">Contact Agent</h2>

              <div className="flex items-center gap-4 mb-6">
                <ImageWithFallback
                  src={property.agent.avatar}
                  alt={property.agent.name}
                  className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
                />
                <div className="flex-1">
                  <div className="text-foreground font-semibold text-lg">{property.agent.name}</div>
                  {property.agent.rating && (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex gap-0.5">{renderStars(property.agent.rating)}</div>
                      <span className="text-sm text-muted-foreground">{property.agent.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => window.location.href = `tel:${property.agent.phone}`}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  Call
                </button>
                <button
                  onClick={() => setShowContactForm(true)}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors border border-border"
                >
                  <MessageSquare className="w-5 h-5" />
                  Message
                </button>
              </div>

              <button
                onClick={handleScheduleTour}
                className="w-full px-4 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/80 transition-colors border border-border"
              >
                <Calendar className="w-5 h-5 inline mr-2" />
                Schedule Tour
              </button>

              {property.virtualTour && (
                <button className="w-full px-4 py-3 mt-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors border border-border">
                  <Video className="w-5 h-5 inline mr-2" />
                  Virtual Tour
                </button>
              )}
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
    </div>
  );
}
