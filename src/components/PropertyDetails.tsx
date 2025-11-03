import { useState } from 'react';
import { X, Heart, MapPin, Bed, Bath, Maximize, Calendar, Share2, ChevronLeft, ChevronRight, Phone, Mail, MessageSquare } from 'lucide-react';
import { Property } from '../types';
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

  const formatPrice = (price: number) => {
    if (property.status === 'For Rent') {
      return `$${price.toLocaleString()} / month`;
    }
    return `$${price.toLocaleString()}`;
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

  const handleCall = () => {
    window.location.href = `tel:${property.agent.phone}`;
  };

  const handleEmail = () => {
    window.location.href = `mailto:${property.agent.email}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="absolute inset-0 overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-4">
          <div className="relative bg-card rounded-3xl shadow-2xl max-w-6xl w-full my-8 animate-in zoom-in-95 slide-in-from-bottom-8 duration-300">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-card/95 backdrop-blur-md rounded-full hover:bg-card transition-all shadow-lg hover:scale-110"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>

            {/* Image Gallery */}
            <div className="relative aspect-[21/9] bg-gray-900 rounded-t-3xl overflow-hidden">
              <ImageWithFallback
                src={property.images[currentImageIndex]}
                alt={property.title}
                className="w-full h-full object-cover"
              />

              {/* Image Navigation */}
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-card/95 backdrop-blur-md rounded-full hover:bg-card transition-all shadow-lg hover:scale-110"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-card/95 backdrop-blur-md rounded-full hover:bg-card transition-all shadow-lg hover:scale-110"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-700" />
                  </button>

                  {/* Image Indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {property.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`h-1.5 rounded-full transition-all ${
                          index === currentImageIndex
                            ? 'w-8 bg-card'
                            : 'w-1.5 bg-card/50 hover:bg-card/75'
                        }`}
                      />
                    ))}
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

              {/* Action Buttons */}
              <div className="absolute top-4 right-16 flex gap-2">
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

            {/* Content */}
            <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                  {/* Header */}
                  <div className="mb-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h2 className="text-gray-900 mb-2">{property.title}</h2>
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <MapPin className="w-5 h-5" />
                          <span>{property.location.address}, {property.location.city}, {property.location.state}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-blue-900">{formatPrice(property.price)}</div>
                  </div>

                  {/* Specs Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    <div className="bg-background rounded-xl p-4">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Bed className="w-5 h-5" />
                        <span className="text-sm">Bedrooms</span>
                      </div>
                      <div className="text-gray-900">{property.bedrooms}</div>
                    </div>
                    <div className="bg-background rounded-xl p-4">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Bath className="w-5 h-5" />
                        <span className="text-sm">Bathrooms</span>
                      </div>
                      <div className="text-gray-900">{property.bathrooms}</div>
                    </div>
                    <div className="bg-background rounded-xl p-4">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Maximize className="w-5 h-5" />
                        <span className="text-sm">Area</span>
                      </div>
                      <div className="text-gray-900">{property.area.toLocaleString()} sqft</div>
                    </div>
                    <div className="bg-background rounded-xl p-4">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Calendar className="w-5 h-5" />
                        <span className="text-sm">Built</span>
                      </div>
                      <div className="text-gray-900">{property.yearBuilt}</div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-8">
                    <h3 className="text-gray-900 mb-3">Description</h3>
                    <p className="text-gray-600 leading-relaxed">{property.description}</p>
                  </div>

                  {/* Features */}
                  <div>
                    <h3 className="text-gray-900 mb-3">Features & Amenities</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {property.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-gray-700 bg-background rounded-lg px-3 py-2"
                        >
                          <div className="w-2 h-2 bg-blue-900 rounded-full" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Agent Card */}
                <div className="lg:col-span-1">
                  <div className="bg-gradient-to-br from-blue-50 to-gray-50 rounded-2xl p-6 sticky top-6">
                    <h3 className="text-gray-900 mb-4">Contact Agent</h3>

                    {/* Agent Info */}
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                      <ImageWithFallback
                        src={property.agent.avatar}
                        alt={property.agent.name}
                        className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-md"
                      />
                      <div>
                        <div className="text-gray-900 mb-1">{property.agent.name}</div>
                        <div className="text-sm text-gray-600">Real Estate Agent</div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-3 mb-6">
                      <button
                        onClick={handleCall}
                        className="w-full px-4 py-3 bg-card hover:bg-background text-gray-900 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 border border-gray-200"
                      >
                        <Phone className="w-5 h-5" />
                        <span>Call Now</span>
                      </button>
                      <button
                        onClick={handleEmail}
                        className="w-full px-4 py-3 bg-card hover:bg-background text-gray-900 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 border border-gray-200"
                      >
                        <Mail className="w-5 h-5" />
                        <span>Email</span>
                      </button>
                      <button
                        onClick={() => setShowContactForm(true)}
                        className="w-full px-4 py-3 bg-blue-900 hover:bg-blue-800 text-primary-foreground rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        <MessageSquare className="w-5 h-5" />
                        <span>Send Message</span>
                      </button>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{property.agent.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{property.agent.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
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
