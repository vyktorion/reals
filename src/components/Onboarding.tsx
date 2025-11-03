import { useState } from 'react';
import { ChevronRight, Home, Search, Bell, MapPin } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: Home,
      title: 'Find Your Dream Home',
      description: 'Browse thousands of premium properties tailored to your preferences and lifestyle.',
      image: 'https://images.unsplash.com/photo-1640109229792-a26a0ee366ff?w=800',
      gradient: 'from-blue-900 to-blue-700'
    },
    {
      icon: Search,
      title: 'Advanced Search Filters',
      description: 'Use our powerful search tools to find the perfect property that matches all your criteria.',
      image: 'https://images.unsplash.com/photo-1519662978799-2f05096d3636?w=800',
      gradient: 'from-purple-900 to-purple-700'
    },
    {
      icon: MapPin,
      title: 'Interactive Map View',
      description: 'Explore properties on an interactive map to find the perfect location and neighborhood.',
      image: 'https://images.unsplash.com/photo-1493134799591-2c9eed26201a?w=800',
      gradient: 'from-green-900 to-green-700'
    },
    {
      icon: Bell,
      title: 'Stay Updated',
      description: 'Get instant notifications about new listings, price drops, and properties matching your saved searches.',
      image: 'https://images.unsplash.com/photo-1581784878214-8d5596b98a01?w=800',
      gradient: 'from-amber-900 to-amber-700'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <div className="fixed inset-0 z-50 bg-card">
      {/* Skip Button */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-6 z-10 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        Skip
      </button>

      {/* Content */}
      <div className="h-full flex flex-col">
        {/* Image Section */}
        <div className="relative h-1/2 bg-linear-to-br overflow-hidden">
          <div className={`absolute inset-0 bg-linear-to-br ${step.gradient} opacity-90`} />
          <ImageWithFallback
            src={step.image}
            alt={step.title}
            className="w-full h-full object-cover mix-blend-overlay"
          />
          
          {/* Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-card/20 backdrop-blur-lg rounded-3xl flex items-center justify-center shadow-2xl animate-in zoom-in-50 duration-700">
              <Icon className="w-12 h-12 text-primary-foreground" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Text Section */}
        <div className="flex-1 flex flex-col justify-between p-8">
          <div className="text-center flex-1 flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-gray-900 mb-4">{step.title}</h2>
            <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed">
              {step.description}
            </p>
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center gap-2 mb-8">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'w-8 bg-blue-900'
                    : index < currentStep
                    ? 'w-2 bg-blue-300'
                    : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="w-full py-4 bg-blue-900 hover:bg-blue-800 text-primary-foreground rounded-2xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <span className="text-lg">
              {currentStep < steps.length - 1 ? 'Continue' : 'Get Started'}
            </span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
