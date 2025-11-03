import { Building2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <Building2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Loading Properties...
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please wait while we fetch the latest real estate listings
        </p>
      </div>
    </div>
  )
}