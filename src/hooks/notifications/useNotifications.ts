import { useState, useEffect } from 'react';
import { NotificationService, NotificationsResponse, Notification, NotificationPreferences } from '@/services/notification.service';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);

  // Fetch notifications
  const fetchNotifications = async (pageNum = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      const response: NotificationsResponse = await NotificationService.getNotifications(pageNum, limit);
      
      if (pageNum === 1) {
        setNotifications(response.notifications);
      } else {
        setNotifications(prev => [...prev, ...response.notifications]);
      }
      
      setUnreadCount(response.unreadCount);
      setTotal(response.total);
      setHasMore(response.hasMore);
      setPage(response.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const result = await NotificationService.markAsRead(notificationId);
      if (result.success) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, isRead: true, readAt: new Date() }
              : notif
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark notification as read');
      throw err;
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const result = await NotificationService.markAllAsRead();
      if (result.success) {
        setNotifications(prev => 
          prev.map(notif => ({ 
            ...notif, 
            isRead: true, 
            readAt: notif.readAt || new Date() 
          }))
        );
        setUnreadCount(0);
      }
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark all notifications as read');
      throw err;
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId: string) => {
    try {
      const result = await NotificationService.deleteNotification(notificationId);
      if (result.success) {
        const wasUnread = notifications.find(n => n.id === notificationId && !n.isRead);
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
        if (wasUnread) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
        setTotal(prev => Math.max(0, prev - 1));
      }
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete notification');
      throw err;
    }
  };

  // Get unread count
  const fetchUnreadCount = async () => {
    try {
      const result = await NotificationService.getUnreadCount();
      setUnreadCount(result.count);
      return result.count;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get unread count');
      return 0;
    }
  };

  // Get preferences
  const fetchPreferences = async () => {
    try {
      const result = await NotificationService.getPreferences();
      setPreferences(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get notification preferences');
      throw err;
    }
  };

  // Update preferences
  const updatePreferences = async (newPreferences: NotificationPreferences) => {
    try {
      const result = await NotificationService.updatePreferences(newPreferences);
      if (result.success) {
        setPreferences(result.preferences);
      }
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update notification preferences');
      throw err;
    }
  };

  // Load more notifications
  const loadMore = () => {
    if (!loading && hasMore) {
      fetchNotifications(page + 1, 10);
    }
  };

  // Refresh notifications
  const refresh = () => {
    setPage(1);
    fetchNotifications(1, 10);
  };

  // Add new notification (for real-time updates)
  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
    if (!notification.isRead) {
      setUnreadCount(prev => prev + 1);
    }
    setTotal(prev => prev + 1);
  };

  // Mark notification as read and navigate to related content
  const markAsReadAndNavigate = async (notificationId: string, navigationData?: {
    url?: string;
    type?: string;
    propertyId?: string;
    userId?: string;
    messageId?: string;
  }) => {
    await markAsRead(notificationId);
    
    // Handle navigation based on notification type and data
    if (navigationData) {
      // This would typically integrate with your router
      // window.location.href = navigationData.url;
      // or use your navigation hook
    }
  };

  // Get notifications by type
  const getNotificationsByType = (type: Notification['type']) => {
    return notifications.filter(notif => notif.type === type);
  };

  // Get recent notifications (last 24 hours)
  const getRecentNotifications = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return notifications.filter(notif => new Date(notif.createdAt) > yesterday);
  };

  return {
    notifications,
    unreadCount,
    loading,
    error,
    total,
    hasMore,
    page,
    preferences,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    fetchUnreadCount,
    fetchPreferences,
    updatePreferences,
    loadMore,
    refresh,
    addNotification,
    markAsReadAndNavigate,
    getNotificationsByType,
    getRecentNotifications
  };
}