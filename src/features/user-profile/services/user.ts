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
  async getProfile(userId: string): Promise<User> {
    try {
      // In production: const response = await apiClient.get(`/users/${userId}`);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error('Failed to fetch user profile');
    }
  }

  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    try {
      // In production: const response = await apiClient.put(`/users/${userId}`, updates);
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...currentUser, ...updates };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      throw new Error('Failed to update profile');
    }
  }

  async getSavedSearches(userId: string): Promise<SavedSearch[]> {
    try {
      // In production: const response = await apiClient.get(`/users/${userId}/saved-searches`);
      const searches = JSON.parse(localStorage.getItem(`searches_${userId}`) || '[]');
      return searches;
    } catch (error) {
      throw new Error('Failed to fetch saved searches');
    }
  }

  async saveSearch(userId: string, searchData: Omit<SavedSearch, 'id' | 'createdAt'>): Promise<SavedSearch> {
    try {
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
    } catch (error) {
      throw new Error('Failed to save search');
    }
  }

  async deleteSavedSearch(userId: string, searchId: string): Promise<void> {
    try {
      // In production: await apiClient.delete(`/users/${userId}/saved-searches/${searchId}`);
      const searches = JSON.parse(localStorage.getItem(`searches_${userId}`) || '[]');
      const filteredSearches = searches.filter((s: SavedSearch) => s.id !== searchId);
      localStorage.setItem(`searches_${userId}`, JSON.stringify(filteredSearches));
    } catch (error) {
      throw new Error('Failed to delete saved search');
    }
  }

  async getNotifications(userId: string): Promise<Notification[]> {
    try {
      // In production: const response = await apiClient.get(`/users/${userId}/notifications`);
      const notifications = JSON.parse(localStorage.getItem(`notifications_${userId}`) || '[]');
      return notifications;
    } catch (error) {
      throw new Error('Failed to fetch notifications');
    }
  }

  async markNotificationAsRead(userId: string, notificationId: string): Promise<void> {
    try {
      // In production: await apiClient.put(`/users/${userId}/notifications/${notificationId}/read`);
      const notifications = JSON.parse(localStorage.getItem(`notifications_${userId}`) || '[]');
      const updatedNotifications = notifications.map((n: Notification) =>
        n.id === notificationId ? { ...n, read: true } : n
      );
      localStorage.setItem(`notifications_${userId}`, JSON.stringify(updatedNotifications));
    } catch (error) {
      throw new Error('Failed to mark notification as read');
    }
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    try {
      // In production: await apiClient.put(`/users/${userId}/notifications/mark-all-read`);
      const notifications = JSON.parse(localStorage.getItem(`notifications_${userId}`) || '[]');
      const updatedNotifications = notifications.map((n: Notification) => ({ ...n, read: true }));
      localStorage.setItem(`notifications_${userId}`, JSON.stringify(updatedNotifications));
    } catch (error) {
      throw new Error('Failed to mark all notifications as read');
    }
  }

  async getUserPreferences(userId: string): Promise<UserPreferences> {
    try {
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
    } catch (error) {
      throw new Error('Failed to fetch user preferences');
    }
  }

  async updateUserPreferences(userId: string, preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    try {
      // In production: const response = await apiClient.put(`/users/${userId}/preferences`, preferences);
      const currentPreferences = await this.getUserPreferences(userId);
      const updatedPreferences = { ...currentPreferences, ...preferences };
      localStorage.setItem(`preferences_${userId}`, JSON.stringify(updatedPreferences));
      return updatedPreferences;
    } catch (error) {
      throw new Error('Failed to update user preferences');
    }
  }

  async getFavorites(userId: string): Promise<string[]> {
    try {
      // In production: const response = await apiClient.get(`/users/${userId}/favorites`);
      const favorites = JSON.parse(localStorage.getItem(`favorites_${userId}`) || '[]');
      return favorites;
    } catch (error) {
      throw new Error('Failed to fetch favorites');
    }
  }

  async addToFavorites(userId: string, propertyId: string): Promise<void> {
    try {
      // In production: await apiClient.post(`/users/${userId}/favorites`, { propertyId });
      const favorites = await this.getFavorites(userId);
      if (!favorites.includes(propertyId)) {
        favorites.push(propertyId);
        localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites));
      }
    } catch (error) {
      throw new Error('Failed to add to favorites');
    }
  }

  async removeFromFavorites(userId: string, propertyId: string): Promise<void> {
    try {
      // In production: await apiClient.delete(`/users/${userId}/favorites/${propertyId}`);
      const favorites = await this.getFavorites(userId);
      const filteredFavorites = favorites.filter(id => id !== propertyId);
      localStorage.setItem(`favorites_${userId}`, JSON.stringify(filteredFavorites));
    } catch (error) {
      throw new Error('Failed to remove from favorites');
    }
  }

  async getUserProperties(userId: string): Promise<unknown[]> {
    try {
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
    } catch (error) {
      throw new Error('Failed to fetch user properties');
    }
  }

  async deleteUserProperty(userId: string, propertyId: string): Promise<void> {
    try {
      // In production: await apiClient.delete(`/users/${userId}/properties/${propertyId}`);
      // For demo, just log the action
      console.log(`Deleting property ${propertyId} for user ${userId}`);
    } catch (error) {
      throw new Error('Failed to delete property');
    }
  }
}

export const userService = new UserService();
export default userService;