'use client'

import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <Home className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            404 - Page Not Found
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Sorry, we couldn't find the property or page you're looking for. It may have been moved or no longer exists.
          </p>
        </div>

        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors shadow-md"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
          
          <div className="block">
            <button 
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </div>

        <div className="mt-12 text-sm text-gray-500 dark:text-gray-500">
          <p>Looking for a specific property? Try using our search page.</p>
          <Link 
            href="/search" 
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Search Properties
          </Link>
        </div>
      </div>
    </div>
  )
}