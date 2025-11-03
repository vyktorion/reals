import { Bell, TrendingDown, Home, MessageCircle, Calendar, X, Check } from 'lucide-react';
import { Notification } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';

interface NotificationsCenterProps {
  onViewProperty?: (id: string) => void;
}

export function NotificationsCenter({ onViewProperty }: NotificationsCenterProps) {
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'price_drop',
      title: 'Price Drop Alert',
      message: 'Modern Luxury Villa price reduced by $100,000',
      date: '2024-11-02T10:30:00',
      read: false,
      propertyId: '1',
      image: 'https://images.unsplash.com/photo-1640109229792-a26a0ee366ff?w=150'
    },
    {
      id: '2',
      type: 'new_listing',
      title: 'New Listing Match',
      message: 'A new property matching "Downtown Condos" is available',
      date: '2024-11-02T09:15:00',
      read: false,
      propertyId: '4',
      image: 'https://images.unsplash.com/photo-1639663742190-1b3dba2eebcf?w=150'
    },
    {
      id: '3',
      type: 'appointment',
      title: 'Tour Confirmation',
      message: 'Your property tour is scheduled for tomorrow at 2:00 PM',
      date: '2024-11-01T16:45:00',
      read: false,
      propertyId: '2'
    },
    {
      id: '4',
      type: 'message',
      title: 'New Message',
      message: 'Sarah Johnson replied to your inquiry about the villa',
      date: '2024-11-01T14:20:00',
      read: true
    },
    {
      id: '5',
      type: 'new_listing',
      title: 'New Listing Match',
      message: '3 new properties matching your saved searches',
      date: '2024-11-01T08:00:00',
      read: true
    }
  ];

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'price_drop':
        return TrendingDown;
      case 'new_listing':
        return Home;
      case 'message':
        return MessageCircle;
      case 'appointment':
        return Calendar;
      case 'saved_search':
        return Bell;
      default:
        return Bell;
    }
  };

  const getIconColor = (type: Notification['type']) => {
    switch (type) {
      case 'price_drop':
        return 'bg-green-100 text-green-600';
      case 'new_listing':
        return 'bg-blue-100 text-blue-600';
      case 'message':
        return 'bg-purple-100 text-purple-600';
      case 'appointment':
        return 'bg-amber-100 text-amber-600';
      case 'saved_search':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const handleMarkAsRead = () => {
    toast.success('Notification marked as read');
  };

  const handleDelete = () => {
    toast.success('Notification deleted');
  };

  const handleMarkAllAsRead = () => {
    toast.success('All notifications marked as read');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-gray-900 mb-2">Notifications</h1>
            <p className="text-gray-600">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span className="hidden sm:inline">Mark all as read</span>
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-2">
          {notifications.map((notification, index) => {
            const Icon = getIcon(notification.type);
            const iconColor = getIconColor(notification.type);

            return (
              <div
                key={notification.id}
                className={`bg-card rounded-2xl border overflow-hidden transition-all hover:shadow-md animate-in fade-in slide-in-from-bottom-4 duration-300 ${
                  notification.read ? 'border-gray-100' : 'border-blue-200 shadow-sm'
                }`}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="p-4">
                  <div className="flex gap-4">
                    {/* Icon or Image */}
                    {notification.image ? (
                      <div className="shrink-0">
                        <ImageWithFallback
                          src={notification.image}
                          alt="Property"
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                      </div>
                    ) : (
                      <div className={`w-12 h-12 ${iconColor} rounded-xl flex items-center justify-center shrink-0`}>
                        <Icon className="w-6 h-6" />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-gray-900 text-sm">{notification.title}</h3>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full" />
                          )}
                        </div>
                        <span className="text-xs text-gray-500 shrink-0">
                          {formatTime(notification.date)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{notification.message}</p>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {notification.propertyId && (
                          <button
                            onClick={() => onViewProperty?.(notification.propertyId!)}
                            className="px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-primary-foreground text-xs rounded-lg transition-colors"
                          >
                            View Property
                          </button>
                        )}
                        {!notification.read && (
                          <button
                            onClick={handleMarkAsRead}
                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-lg transition-colors"
                          >
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={handleDelete}
                          className="ml-auto p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {notifications.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-600">
              We&apos;ll notify you when there&apos;s something new
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
