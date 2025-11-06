'use client'

import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Sign In</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Please sign in to your account
          </p>
        </div>
        
        <div className="bg-card rounded-2xl shadow-md p-6">
          <p className="text-muted-foreground">Sign in page coming soon...</p>
        </div>
      </div>
    </div>
  );
}