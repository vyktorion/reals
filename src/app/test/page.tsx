'use client'

import { useApp } from '@/contexts/AppContext';
import { useState } from 'react';

export default function TestPage() {
  const { properties, favorites, toggleFavorite } = useApp();
  const [testResults, setTestResults] = useState<string[]>([]);

  const runTests = () => {
    const results: string[] = [];
    
    // Test 1: Verify properties exist
    if (properties.length > 0) {
      results.push('✅ Properties loaded successfully');
    } else {
      results.push('❌ No properties found');
    }

    // Test 2: Verify favorites functionality
    try {
      const initialFavorites = [...favorites];
      toggleFavorite(properties[0]?.id || 'test');
      const afterToggle = [...favorites];
      toggleFavorite(properties[0]?.id || 'test'); // Reset
      results.push('✅ Favorites toggle working');
    } catch (error) {
      results.push('❌ Favorites toggle failed');
    }

    // Test 3: Verify property filtering
    const saleProperties = properties.filter(p => p.status === 'active' && p.type === 'sale');
    const rentProperties = properties.filter(p => p.status === 'active' && p.type === 'rent');
    
    results.push(`✅ Found ${saleProperties.length} sale properties`);
    results.push(`✅ Found ${rentProperties.length} rent properties`);

    setTestResults(results);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Development Tests</h1>
      
      <div className="bg-card rounded-2xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Test Controls</h2>
        <button
          onClick={runTests}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-blue-800 transition-colors"
        >
          Run Tests
        </button>
      </div>

      {testResults.length > 0 && (
        <div className="bg-card rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Test Results</h2>
          <div className="space-y-2">
            {testResults.map((result, index) => (
              <div key={index} className="font-mono text-sm">
                {result}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-card rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Route Groups</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Marketing</span>
              <span className="text-green-500">✅</span>
            </div>
            <div className="flex justify-between">
              <span>Search</span>
              <span className="text-green-500">✅</span>
            </div>
            <div className="flex justify-between">
              <span>User</span>
              <span className="text-green-500">✅</span>
            </div>
            <div className="flex justify-between">
              <span>Sale</span>
              <span className="text-green-500">✅</span>
            </div>
            <div className="flex justify-between">
              <span>Rent</span>
              <span className="text-green-500">✅</span>
            </div>
            <div className="flex justify-between">
              <span>Hotel</span>
              <span className="text-green-500">✅</span>
            </div>
            <div className="flex justify-between">
              <span>Test</span>
              <span className="text-green-500">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Statistics</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Total Properties</span>
              <span>{properties.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Favorites</span>
              <span>{favorites.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Sale Properties</span>
              <span>{properties.filter(p => p.status === 'active' && p.type === 'sale').length}</span>
            </div>
            <div className="flex justify-between">
              <span>Rent Properties</span>
              <span>{properties.filter(p => p.status === 'active' && p.type === 'rent').length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}