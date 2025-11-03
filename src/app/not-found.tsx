'use client'

import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Home className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            404 - Page Not Found
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
            Sorry, we couldn&apos;t find the property or page you&apos;re looking for. It may have been moved or no longer exists.
          </p>
        </div>

        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg transition-colors shadow-md"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
          
          <div className="block">
            <button 
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </div>

        <div className="mt-12 text-sm text-muted-foreground">
          <p>Looking for a specific property? Try using our search page.</p>
          <Link 
            href="/search" 
            className="text-primary hover:underline"
          >
            Search Properties
          </Link>
        </div>
      </div>
    </div>
  )
}