import { Building2 } from 'lucide-react';

export function Loader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <Building2 className="w-8 h-8 text-primary" />
          </div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Loading Properties...
        </h2>
        <p className="text-muted-foreground">
          Please wait while we fetch the latest real estate listings
        </p>
      </div>
    </div>
  );
}