  import { User } from '@/entities/user';

export interface SavedSearch {
  id: string;
  name: string;
  filters: Record<string, unknown>;
  notificationEnabled: boolean;
  createdAt: string;
  lastExecuted?: string;
}

export interface Notification {
  id: string;
  type: 'property_alert' | 'price_drop' | 'saved_search' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface UserPreferences {
  emailNotifications: boolean;
  priceDropAlerts: boolean;
  newPropertyAlerts: boolean;
  newsletter: boolean;
  preferredPropertyTypes: string[];
  preferredLocations: string[];
  priceRange: [number, number];
}

class UserService {
  async getProfile(_userId: string): Promise<User> {
    // In production: const response = await apiClient.get(`/users/${userId}`);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) {
      throw new Error('User not found');
    }
    return user;
  }

  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    // In production: const response = await apiClient.put(`/users/${userId}`, updates);
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = { ...currentUser, ...updates };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
  }

  async getSavedSearches(userId: string): Promise<SavedSearch[]> {
    // In production: const response = await apiClient.get(`/users/${userId}/saved-searches`);
    const searches = JSON.parse(localStorage.getItem(`searches_${userId}`) || '[]');
    return searches;
  }

  async saveSearch(userId: string, searchData: Omit<SavedSearch, 'id' | 'createdAt'>): Promise<SavedSearch> {
    // In production: const response = await apiClient.post(`/users/${userId}/saved-searches`, searchData);
    const searches = JSON.parse(localStorage.getItem(`searches_${userId}`) || '[]');
    const newSearch: SavedSearch = {
      ...searchData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    searches.push(newSearch);
    localStorage.setItem(`searches_${userId}`, JSON.stringify(searches));
    return newSearch;
  }

  async deleteSavedSearch(userId: string, searchId: string): Promise<void> {
    // In production: await apiClient.delete(`/users/${userId}/saved-searches/${searchId}`);
    const searches = JSON.parse(localStorage.getItem(`searches_${userId}`) || '[]');
    const filteredSearches = searches.filter((s: SavedSearch) => s.id !== searchId);
    localStorage.setItem(`searches_${userId}`, JSON.stringify(filteredSearches));
  }

  async getNotifications(userId: string): Promise<Notification[]> {
    // In production: const response = await apiClient.get(`/users/${userId}/notifications`);
    const notifications = JSON.parse(localStorage.getItem(`notifications_${userId}`) || '[]');
    return notifications;
  }

  async markNotificationAsRead(userId: string, notificationId: string): Promise<void> {
    // In production: await apiClient.put(`/users/${userId}/notifications/${notificationId}/read`);
    const notifications = JSON.parse(localStorage.getItem(`notifications_${userId}`) || '[]');
    const updatedNotifications = notifications.map((n: Notification) =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    localStorage.setItem(`notifications_${userId}`, JSON.stringify(updatedNotifications));
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    // In production: await apiClient.put(`/users/${userId}/notifications/mark-all-read`);
    const notifications = JSON.parse(localStorage.getItem(`notifications_${userId}`) || '[]');
    const updatedNotifications = notifications.map((n: Notification) => ({ ...n, read: true }));
    localStorage.setItem(`notifications_${userId}`, JSON.stringify(updatedNotifications));
  }

  async getUserPreferences(userId: string): Promise<UserPreferences> {
    // In production: const response = await apiClient.get(`/users/${userId}/preferences`);
    const preferences = JSON.parse(localStorage.getItem(`preferences_${userId}`) || 'null');
    return preferences || {
      emailNotifications: true,
      priceDropAlerts: true,
      newPropertyAlerts: true,
      newsletter: false,
      preferredPropertyTypes: [],
      preferredLocations: [],
      priceRange: [0, 10000000],
    };
  }

  async updateUserPreferences(userId: string, preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    // In production: const response = await apiClient.put(`/users/${userId}/preferences`, preferences);
    const currentPreferences = await this.getUserPreferences(userId);
    const updatedPreferences = { ...currentPreferences, ...preferences };
    localStorage.setItem(`preferences_${userId}`, JSON.stringify(updatedPreferences));
    return updatedPreferences;
  }

  async getFavorites(userId: string): Promise<string[]> {
    // In production: const response = await apiClient.get(`/users/${userId}/favorites`);
    const favorites = JSON.parse(localStorage.getItem(`favorites_${userId}`) || '[]');
    return favorites;
  }

  async addToFavorites(userId: string, propertyId: string): Promise<void> {
    // In production: await apiClient.post(`/users/${userId}/favorites`, { propertyId });
    const favorites = await this.getFavorites(userId);
    if (!favorites.includes(propertyId)) {
      favorites.push(propertyId);
      localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites));
    }
  }

  async removeFromFavorites(userId: string, propertyId: string): Promise<void> {
    // In production: await apiClient.delete(`/users/${userId}/favorites/${propertyId}`);
    const favorites = await this.getFavorites(userId);
    const filteredFavorites = favorites.filter(id => id !== propertyId);
    localStorage.setItem(`favorites_${userId}`, JSON.stringify(filteredFavorites));
  }

  async getUserProperties(_userId: string): Promise<unknown[]> {
    // In production: const response = await apiClient.get(`/users/${userId}/properties`);
    // For demo, return mock properties that "belong" to this user
    return [
      {
        id: '1',
        title: 'Modern Downtown Apartment',
        status: 'For Sale',
        price: 450000,
        location: { city: 'Los Angeles', state: 'CA' },
        images: ['/api/placeholder/320/192'],
      },
      {
        id: '5',
        title: 'Luxury Beachfront Villa',
        status: 'For Sale',
        price: 1250000,
        location: { city: 'Miami', state: 'FL' },
        images: ['/api/placeholder/320/192'],
      },
    ];
  }

  async deleteUserProperty(_userId: string, _propertyId: string): Promise<void> {
    // In production: await apiClient.delete(`/users/${userId}/properties/${propertyId}`);
    // For demo, just log the action
    console.log(`Deleting property ${_propertyId} for user ${_userId}`);
  }
}

export const userService = new UserService();
export default userService;