import { useState } from 'react';
import { X, Heart, MapPin, Bed, Bath, Maximize, Calendar, Share2, ChevronLeft, ChevronRight, Phone, MessageSquare, Star, TrendingUp, Navigation, School, ShoppingBag, Video, Car } from 'lucide-react';
import { Property } from '@/entities/property';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { ContactForm } from '@/components/forms/ContactForm';
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
    if (property.status === 'rented' || property.type === 'rent') {
      return `$${price.toLocaleString('en-US')} / month`;
    }
    return `$${price.toLocaleString('en-US')}`;
  };

  const nextImage = () => {
    const newIndex = (currentImageIndex + 1) % property.images.length;
    setCurrentImageIndex(newIndex);
    updateThumbnailOffset(newIndex);
  };

  const prevImage = () => {
    const newIndex = (currentImageIndex - 1 + property.images.length) % property.images.length;
    setCurrentImageIndex(newIndex);
    updateThumbnailOffset(newIndex);
  };

  const updateThumbnailOffset = (newIndex: number) => {
    const totalImages = property.images.length;
    let newOffset = thumbnailOffset;

    if (newIndex < thumbnailOffset) {
      newOffset = Math.max(0, Math.floor(newIndex / 6) * 6);
    } else if (newIndex >= thumbnailOffset + 6) {
      const maxOffset = Math.max(0, totalImages - 6);
      newOffset = Math.min(maxOffset, Math.floor(newIndex / 6) * 6);
    }

    setThumbnailOffset(newOffset);
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
    updateThumbnailOffset(index);
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
              aria-label="Close property details"
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
                property.type === 'rent'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              }`}>
                {property.type === 'rent' ? 'For Rent' : 'For Sale'}
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
            {/* Image Gallery */}
            <div className="bg-card rounded-xl p-2 border">
              {/* Main Image */}
              <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden mb-4">
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
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors cursor-pointer"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                      {property.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => handleThumbnailClick(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            currentImageIndex === index ? 'bg-white' : 'bg-white/50'
                          }`}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={`px-3 py-1.5 rounded-full text-sm backdrop-blur-md ${
                    property.type === 'rent'
                      ? 'bg-amber-500/90 text-primary-foreground'
                      : 'bg-blue-900/90 text-primary-foreground'
                  }`}>
                    {property.type === 'rent' ? 'For Rent' : 'For Sale'}
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
                    aria-label="Share property"
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
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Thumbnail Grid */}
              {property.images.length > 1 && (
                <div>
                  {/* Thumbnails Grid - Always shows 6 thumbnails horizontally */}
                  <div className="grid grid-cols-6 gap-2">
                    {Array.from({ length: 6 }, (_, i) => {
                      const imageIndex = thumbnailOffset + i;
                      const image = property.images[imageIndex];

                      if (!image) return null;

                      return (
                        <button
                          key={`${thumbnailOffset}-${i}`}
                          onClick={() => handleThumbnailClick(imageIndex)}
                          className={`aspect-video overflow-hidden rounded-lg border-2 transition-all duration-200 relative ${
                            currentImageIndex === imageIndex
                              ? 'border-primary ring-2 ring-primary/20'
                              : 'border-transparent hover:border-primary/50'
                          }`}
                          aria-label={`Thumbnail image ${imageIndex + 1}`}
                        >
                          <ImageWithFallback
                            src={image}
                            alt={`${property.title} ${imageIndex + 1}`}
                            width={200}
                            height={150}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                          />
                          {currentImageIndex === imageIndex && (
                            <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

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
                  { label: 'Property Type', value: property.type.charAt(0).toUpperCase() + property.type.slice(1) },
                  { label: 'Year Built', value: property.yearBuilt || 'N/A' },
                  { label: 'Area', value: `${property.area.toLocaleString()} sqft` },
                  { label: 'Lot Size', value: property.lotSize ? `${property.lotSize.toLocaleString()} sqft` : 'N/A' },
                  { label: 'Parking', value: `${property.parkingSpaces || 0} spaces` },
                  { label: 'Pet Policy', value: property.petPolicy === 'allowed' ? 'Pet Friendly' : property.petPolicy === 'conditional' ? 'Conditional' : 'No Pets' },
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
            {property.agent ? (
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
                  {property.agent?.phone && (
                    <button
                      onClick={() => {
                        if (property.agent?.phone) {
                          window.location.href = `tel:${property.agent.phone}`;
                        }
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                      Call
                    </button>
                  )}
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
            ) : (
              <div className="bg-card rounded-xl p-6 border sticky top-35">
                <h2 className="text-xl font-bold text-foreground mb-6">Contact Us</h2>
                <p className="text-muted-foreground mb-4">Get in touch with our team for more information about this property.</p>
                <button
                  onClick={() => setShowContactForm(true)}
                  className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  <MessageSquare className="w-5 h-5 inline mr-2" />
                  Contact Us
                </button>
                <button
                  onClick={handleScheduleTour}
                  className="w-full px-4 py-3 mt-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/80 transition-colors border border-border"
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
            )}
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
