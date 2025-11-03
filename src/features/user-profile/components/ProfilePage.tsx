import { useState } from 'react';
import Image from 'next/image';
import {
  Mail,
  Phone,
  MapPin,
  Settings,
  Bell,
  Shield,
  Heart,
  Search,
  Home as HomeIcon,
  LogOut,
  Edit2,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import { ImageWithFallback } from '../../../components/figma/ImageWithFallback';
import { toast } from 'sonner';
import { properties } from '../../../shared/data/properties';
import { Property } from '../../../types';
import { EditProperty } from '../../../components/EditProperty';

interface ProfilePageProps {
  favoriteCount: number;
  onNavigateToSavedSearches: () => void;
  onNavigateToNotifications: () => void;
}

export function ProfilePage({ favoriteCount, onNavigateToSavedSearches, onNavigateToNotifications }: ProfilePageProps) {
  // Mock user listings — assume John Anderson added properties with id 1 and 5
  const [listings, setListings] = useState<Property[]>(() => {
    const pick = properties.filter((p) => p.id === '1' || p.id === '5');
    return pick.map((p) => ({ ...p }));
  });

  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  const handleSavePreferences = () => {
    toast.success('Preferences saved successfully!');
  };

  const handleLogout = () => {
    toast.success('Logged out successfully');
  };

  const handleEditListing = (property: Property) => {
    setEditingProperty(property);
  };

  const handlePropertyUpdated = (updated: Property) => {
    setListings((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    toast.success('Listing updated');
  };

  const handleDeleteListing = (id: string) => {
    if (typeof window !== 'undefined' && !window.confirm('Are you sure you want to delete this listing?')) return;
    setListings((prev) => prev.filter((p) => p.id !== id));
    toast.success('Listing deleted');
  };

  const handleTogglePublish = (id: string) => {
    setListings((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const newStatus: Property['status'] = p.status === 'For Sale' ? 'Sold' : 'For Sale';
        return { ...p, status: newStatus, lastUpdated: new Date().toISOString().split('T')[0] };
      })
    );
    toast.success('Listing status updated');
  };

  const handlePromoteListing = () => {
    // Mock promotion feature - to be implemented in the future
    toast('Promotion feature coming soon!', {
      description: 'Boost your listing visibility with premium placement'
    });
  };

  const stats = [
    { icon: Heart, label: 'Saved Properties', value: favoriteCount, color: 'bg-red-100 text-red-900' },
    { icon: Search, label: 'Saved Searches', value: 5, color: 'bg-blue-100 text-blue-900' },
    { icon: HomeIcon, label: 'Viewed Properties', value: 24, color: 'bg-green-100 text-green-900' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-linear-to-br from-blue-900 to-blue-800 dark:from-blue-800 dark:to-gray-900 rounded-3xl p-8 mb-8 text-primary-foreground relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }} />
          </div>

          <div className="relative flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover ring-4 ring-white/20 shadow-xl"
              />
              <button className="absolute bottom-0 right-0 p-2 bg-card text-blue-900 rounded-full shadow-lg hover:bg-gray-100 transition-colors">
                <Edit2 className="w-4 h-4" />
              </button>
            </div>

            {/* Info */}
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-primary-foreground mb-2">John Anderson</h1>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-blue-100 justify-center sm:justify-start">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">john.anderson@example.com</span>
                </div>
                <div className="flex items-center gap-2 text-blue-100 justify-center sm:justify-start">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">+1 (555) 987-6543</span>
                </div>
                <div className="flex items-center gap-2 text-blue-100 justify-center sm:justify-start">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Los Angeles, CA</span>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <button className="px-6 py-2.5 bg-card text-primary rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-lg flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-card rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 ${stat.color} rounded-xl flex items-center justify-center shadow-sm`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="text-foreground">{stat.value}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Preferences */}
            <div className="bg-card rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-foreground">Search Preferences</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm text-foreground mb-2">Preferred Property Type</label>
                  <div className="flex flex-wrap gap-2">
                    {['House', 'Apartment', 'Villa', 'Condo'].map((type) => (
                      <button
                        key={type}
                        className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-blue-800 dark:hover:bg-blue-700 transition-colors"
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-foreground mb-2">Price Range</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      placeholder="Min Price"
                      className="px-4 py-2.5 border border-border bg-background text-foreground placeholder:text-muted-foreground rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                    <input
                      type="number"
                      placeholder="Max Price"
                      className="px-4 py-2.5 border border-border bg-background text-foreground placeholder:text-muted-foreground rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-foreground mb-2">Preferred Locations</label>
                  <input
                    type="text"
                    placeholder="Los Angeles, New York, Miami..."
                    className="w-full px-4 py-2.5 border border-border bg-background text-foreground placeholder:text-muted-foreground rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>

                <button
                  onClick={handleSavePreferences}
                  className="w-full sm:w-auto px-6 py-2.5 bg-primary hover:bg-blue-800 dark:hover:bg-blue-700 text-primary-foreground rounded-lg transition-colors shadow-md hover:shadow-lg"
                >
                  Save Preferences
                </button>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-card rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-foreground">Notifications</h2>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { label: 'New property alerts', description: 'Get notified when new properties match your preferences' },
                  { label: 'Price drop alerts', description: 'Receive alerts when properties you like drop in price' },
                  { label: 'Newsletter', description: 'Stay updated with market trends and tips' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <div>
                      <div className="text-foreground">{item.label}</div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-900 dark:peer-focus:ring-blue-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-card after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-900 dark:peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Your Listings */}
            <div className="bg-card rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <h2 className="text-foreground">Your Listings</h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">{listings.length} active</span>
              </div>
              <div className="p-6 space-y-4">
                {listings.map((listing) => (
                  <div key={listing.id} className="flex items-center gap-4">
                    <div className="w-20 h-14 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 shrink-0">
                      <Image
                        src={listing.images[0]}
                        alt={listing.title}
                        width={80}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h3 className="text-sm font-medium text-foreground line-clamp-1">{listing.title}</h3>
                        <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">${listing.price.toLocaleString()}</span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{listing.location.city}, {listing.location.state}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTogglePublish(listing.id)}
                        className="px-3 py-1 text-sm rounded-lg border bg-card text-gray-700 dark:text-gray-200 border-border hover:bg-background dark:hover:bg-gray-600 transition-colors"
                      >
                        {listing.status === 'For Sale' ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        onClick={() => handlePromoteListing()}
                        className="px-3 py-1 text-sm rounded-lg bg-amber-500 dark:bg-amber-600 text-primary-foreground hover:bg-amber-600 dark:hover:bg-amber-700 transition-colors flex items-center gap-1"
                      >
                        <TrendingUp className="w-3 h-3" />
                        Promote
                      </button>
                      <button
                        onClick={() => handleEditListing(listing)}
                        className="px-3 py-1 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-blue-800 dark:hover:bg-blue-700 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteListing(listing.id)}
                        className="p-2 rounded-full bg-card border border-gray-200 dark:border-gray-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                        aria-label={`Delete ${listing.title}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {listings.length === 0 && (
                  <div className="text-sm text-muted-foreground">You dont have any active listings yet.</div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden sticky top-24">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-foreground">Quick Actions</h3>
              </div>
              <div className="p-4">
                <nav className="space-y-2">
                  <button 
                    onClick={onNavigateToNotifications}
                    className="w-full px-4 py-3 text-left text-foreground hover:bg-background dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-3"
                  >
                    <Bell className="w-5 h-5" />
                    <span>Notifications</span>
                    <span className="ml-auto bg-red-500 text-primary-foreground text-xs px-2 py-0.5 rounded-full">3</span>
                  </button>
                  <button 
                    onClick={onNavigateToSavedSearches}
                    className="w-full px-4 py-3 text-left text-foreground hover:bg-background dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-3"
                  >
                    <Search className="w-5 h-5" />
                    <span>Saved Searches</span>
                  </button>
                  <button className="w-full px-4 py-3 text-left text-foreground hover:bg-background dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-3">
                    <Shield className="w-5 h-5" />
                    <span>Privacy & Security</span>
                  </button>
                  <button className="w-full px-4 py-3 text-left text-foreground hover:bg-background dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-3">
                    <Settings className="w-5 h-5" />
                    <span>Account Settings</span>
                  </button>
                  <div className="border-t border-gray-100 dark:border-gray-700 my-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-3"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Property Modal */}
      {editingProperty && (
        <EditProperty
          property={editingProperty}
          onClose={() => setEditingProperty(null)}
          onPropertyUpdated={handlePropertyUpdated}
        />
      )}
    </div>
  );
}
