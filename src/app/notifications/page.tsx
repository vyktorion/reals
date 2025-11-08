'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Bell } from 'lucide-react';

interface Notification {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export default function NotificationsPage() {
  const { status } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notifications');
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setNotifications(result.data.notifications || []);
          }
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchNotifications();
    } else {
      setLoading(false);
    }
  }, [status]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in to view notifications</h2>
          <p className="text-gray-600">You need to be signed in to access your notifications.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Bell className="w-8 h-8 text-gold-500" />
        <h1 className="text-3xl font-bold text-navy-900 dark:text-gold-100">Notifications</h1>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No notifications yet</h2>
          <p className="text-gray-600">You&#39;re all caught up! We&#39;ll notify you when there&#39;s something new.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-6 rounded-lg border transition-all duration-200 ${
                notification.isRead
                  ? 'bg-white border-gray-200'
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {notification.title}
                  </h3>
                  <p className="text-gray-700 mb-2">{notification.message}</p>
                  <span className="text-sm text-gray-500">
                    {new Date(notification.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                {!notification.isRead && (
                  <div className="w-3 h-3 bg-blue-500 rounded-full shrink-0 mt-2"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}