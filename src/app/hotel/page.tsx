'use client';

import { Tabs } from '@/components/navigation/Tabs';

export default function HotelPage() {
  return (
    <div className="min-h-screen bg-background">
      <Tabs />
      {/* TODO: înlocuiește cu layout-ul/listarea reală de hotel */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <h1 className="text-2xl font-semibold mb-4">Hotel & stays</h1>
      </div>
    </div>
  );
}