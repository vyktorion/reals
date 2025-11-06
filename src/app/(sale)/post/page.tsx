'use client'

import { useRouter } from 'next/navigation';
import { PostProperty } from '@/components/PostProperty';

export default function SalePostPage() {
  const router = useRouter();

  const handlePropertyPosted = (propertyData: Partial<import('@/entities/property').Property>) => {
    // Redirect to the property details or sale list
    router.push('/(sale)');
  };

  const handleClose = () => {
    router.push('/(sale)');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Post Property for Sale</h1>
          <p className="text-muted-foreground mt-2">
            Create a new listing for properties you want to sell
          </p>
        </div>
        
        <PostProperty
          onClose={handleClose}
          onPropertyPosted={handlePropertyPosted}
        />
      </div>
    </div>
  );
}