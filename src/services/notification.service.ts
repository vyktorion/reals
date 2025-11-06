import apiClient from './api';

export interface Notification {
  id: string;
  userId: string;
  type: 'property_match' | 'price_change' | 'message' | 'system' | 'property_view';
  title: string;
  message: string;
  isRead: boolean;
  data?: {
    propertyId?: string;
    conversationId?: string;
    newPrice?: number;
    oldPrice?: number;
  };
  createdAt: Date;
  readAt?: Date;
}

export interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  propertyMatch: boolean;
  priceChange: boolean;
  message: boolean;
  system: boolean;
}

export class NotificationService {
  // Get user's notifications
  static async getNotifications(page = 1, limit = 10): Promise<NotificationsResponse> {
    const response = await apiClient.get<NotificationsResponse>('/api/notifications', {
      params: { page: page.toString(), limit: limit.toString() }
    });
    return response.data;
  }

  // Mark notification as read
  static async markAsRead(notificationId: string): Promise<{ success: boolean }> {
    const response = await apiClient.patch<{ success: boolean }>(`/api/notifications/${notificationId}/read`);
    return response.data;
  }

  // Mark all notifications as read
  static async markAllAsRead(): Promise<{ success: boolean; updated: number }> {
    const response = await apiClient.patch<{ success: boolean; updated: number }>('/api/notifications/read-all');
    return response.data;
  }

  // Delete notification
  static async deleteNotification(notificationId: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete<{ success: boolean }>(`/api/notifications/${notificationId}`);
    return response.data;
  }

  // Get unread notifications count
  static async getUnreadCount(): Promise<{ count: number }> {
    const response = await apiClient.get<{ count: number }>('/api/notifications/unread-count');
    return response.data;
  }

  // Get notification preferences
  static async getPreferences(): Promise<NotificationPreferences> {
    const response = await apiClient.get<NotificationPreferences>('/api/notifications/preferences');
    return response.data;
  }

  // Update notification preferences
  static async updatePreferences(preferences: NotificationPreferences): Promise<{ success: boolean; preferences: NotificationPreferences }> {
    const response = await apiClient.put<{ success: boolean; preferences: NotificationPreferences }>('/api/notifications/preferences', preferences);
    return response.data;
  }

  // Create notification (for internal use)
  static async createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
    const response = await apiClient.post<Notification>('/api/notifications', notification);
    return response.data;
  }
}