import { useState, useEffect } from 'react';
import { ArrowLeft, Upload, MapPin, Bed, Bath, Maximize, DollarSign, Image as ImageIcon, Check, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { Property } from '../types';

interface EditPropertyProps {
  property: Property;
  onClose: () => void;
  onPropertyUpdated?: (property: Property) => void;
}

interface PropertyFormData {
  title: string;
  description: string;
  price: string;
  type: string;
  status: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  lotSize: string;
  yearBuilt: string;
  parkingSpaces: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  features: string[];
  images: string[];
}

export function EditProperty({ property, onClose, onPropertyUpdated }: EditPropertyProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PropertyFormData>({
    title: property.title,
    description: property.description,
    price: property.price.toString(),
    type: property.type,
    status: property.status,
    bedrooms: property.bedrooms.toString(),
    bathrooms: property.bathrooms.toString(),
    area: property.area.toString(),
    lotSize: property.lotSize?.toString() || '',
    yearBuilt: property.yearBuilt.toString(),
    parkingSpaces: property.parkingSpaces?.toString() || '',
    address: property.location.address,
    city: property.location.city,
    state: property.location.state,
    zipCode: property.location.zipCode,
    country: property.location.country,
    features: property.features || [],
    images: property.images || []
  });

  const propertyTypes = ['House', 'Apartment', 'Villa', 'Condo', 'Penthouse', 'Townhouse', 'Estate', 'Loft', 'Studio'];
  const propertyStatuses = ['For Sale', 'For Rent'];
  const availableFeatures = [
    'Swimming Pool', 'Gym', 'Parking', 'Garden', 'Balcony', 'Terrace', 'Fireplace', 'Air Conditioning',
    'Heating', 'Security System', 'Elevator', 'Pet Friendly', 'Furnished', 'Washing Machine', 'Dishwasher',
    'Internet', 'Cable TV', 'Water View', 'Mountain View', 'City View', 'Garden View', 'Smart Home'
  ];

  const handleInputChange = (field: keyof PropertyFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleImageUpload = () => {
    // Mock image upload - in real app would handle file upload
    const mockImages = [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800'
    ];
    setFormData(prev => ({ ...prev, images: [...prev.images, ...mockImages] }));
    toast.success('Images uploaded successfully!');
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        return formData.title && formData.description && formData.type && formData.status;
      case 2:
        return formData.price && formData.bedrooms && formData.bathrooms && formData.area;
      case 3:
        return formData.address && formData.city && formData.state && formData.zipCode;
      case 4:
        return formData.images.length > 0;
      default:
        return false;
    }
  };

  const handleSubmit = () => {
    // Mock property update - in real app would send to backend
    const updatedProperty: Property = {
      ...property,
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
      type: formData.type as Property['type'],
      status: formData.status as Property['status'],
      bedrooms: parseInt(formData.bedrooms),
      bathrooms: parseFloat(formData.bathrooms),
      area: parseInt(formData.area),
      lotSize: formData.lotSize ? parseInt(formData.lotSize) : undefined,
      yearBuilt: parseInt(formData.yearBuilt),
      parkingSpaces: parseInt(formData.parkingSpaces),
      location: {
        ...property.location,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        zipCode: formData.zipCode,
      },
      features: formData.features,
      images: formData.images,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    toast.success('Property updated successfully!', {
      description: 'Your changes have been saved.'
    });

    onPropertyUpdated?.(updatedProperty);
    onClose();
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step <= currentStep
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-600'
          }`}>
            {step < currentStep ? <Check className="w-4 h-4" /> : step}
          </div>
          {step < 4 && (
            <div className={`w-12 h-0.5 mx-2 ${
              step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="title" className="text-sm font-medium">Property Title</Label>
              <Input
                id="title"
                placeholder="e.g., Modern Luxury Villa with Ocean Views"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-sm font-medium">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your property in detail..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type" className="text-sm font-medium">Property Type</Label>
                <Select value={formData.type} onValueChange={(value: string) => handleInputChange('type', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status" className="text-sm font-medium">Status</Label>
                <Select value={formData.status} onValueChange={(value: string) => handleInputChange('status', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="For Sale/Rent" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyStatuses.map((status) => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price" className="text-sm font-medium flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  Price
                </Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="e.g., 500000"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="bedrooms" className="text-sm font-medium flex items-center gap-1">
                  <Bed className="w-4 h-4" />
                  Bedrooms
                </Label>
                <Input
                  id="bedrooms"
                  type="number"
                  placeholder="e.g., 3"
                  value={formData.bedrooms}
                  onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="bathrooms" className="text-sm font-medium flex items-center gap-1">
                  <Bath className="w-4 h-4" />
                  Bathrooms
                </Label>
                <Input
                  id="bathrooms"
                  type="number"
                  step="0.5"
                  placeholder="e.g., 2.5"
                  value={formData.bathrooms}
                  onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="area" className="text-sm font-medium flex items-center gap-1">
                  <Maximize className="w-4 h-4" />
                  Area (sq ft)
                </Label>
                <Input
                  id="area"
                  type="number"
                  placeholder="e.g., 2500"
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="lotSize" className="text-sm font-medium">Lot Size (sq ft)</Label>
                <Input
                  id="lotSize"
                  type="number"
                  placeholder="Optional"
                  value={formData.lotSize}
                  onChange={(e) => handleInputChange('lotSize', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="yearBuilt" className="text-sm font-medium">Year Built</Label>
                <Input
                  id="yearBuilt"
                  type="number"
                  placeholder="e.g., 2020"
                  value={formData.yearBuilt}
                  onChange={(e) => handleInputChange('yearBuilt', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="parkingSpaces" className="text-sm font-medium">Parking Spaces</Label>
                <Input
                  id="parkingSpaces"
                  type="number"
                  placeholder="e.g., 2"
                  value={formData.parkingSpaces}
                  onChange={(e) => handleInputChange('parkingSpaces', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="address" className="text-sm font-medium flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                Street Address
              </Label>
              <Input
                id="address"
                placeholder="e.g., 123 Main Street"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city" className="text-sm font-medium">City</Label>
                <Input
                  id="city"
                  placeholder="e.g., Los Angeles"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="state" className="text-sm font-medium">State</Label>
                <Input
                  id="state"
                  placeholder="e.g., CA"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="zipCode" className="text-sm font-medium">ZIP Code</Label>
                <Input
                  id="zipCode"
                  placeholder="e.g., 90210"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="country" className="text-sm font-medium">Country</Label>
                <Select value={formData.country} onValueChange={(value: string) => handleInputChange('country', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USA">United States</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Features & Amenities</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {availableFeatures.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature}
                      checked={formData.features.includes(feature)}
                      onCheckedChange={() => handleFeatureToggle(feature)}
                    />
                    <Label htmlFor={feature} className="text-sm">{feature}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium flex items-center gap-1">
                <ImageIcon className="w-4 h-4" />
                Property Images
              </Label>
              <div className="mt-4">
                <Button onClick={handleImageUpload} variant="outline" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload More Images
                </Button>
              </div>
              {formData.images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
                      <img src={image} alt={`Property ${index + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRemoveImage(index)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <h3 className="font-medium text-green-900 mb-2">Ready to Update!</h3>
                <p className="text-sm text-green-700">
                  Your property changes will be saved and the listing will be updated immediately.
                </p>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Basic Information';
      case 2: return 'Property Details';
      case 3: return 'Location & Features';
      case 4: return 'Images & Review';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={onClose}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-lg font-semibold text-gray-900">Edit Property</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderStepIndicator()}

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{getStepTitle()}</CardTitle>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!validateStep()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {currentStep === 4 ? 'Update Property' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}