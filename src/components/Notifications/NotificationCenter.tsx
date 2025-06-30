import React, { useState, useEffect } from 'react';
import { Bell, X, Check, Clock, AlertCircle, Heart, Pill, UtensilsCrossed, Activity, Calendar, Settings, Trash2, Filter, BookMarked as MarkAsRead, Volume2, VolumeX, CheckCircle, Info, AlertTriangle, Zap } from 'lucide-react';
import Card from '../UI/Card';
import Button from '../UI/Button';

interface Notification {
  id: string;
  type: 'medication' | 'meal' | 'exercise' | 'appointment' | 'system' | 'achievement' | 'reminder';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionRequired?: boolean;
  relatedId?: string;
  category: string;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'medication' | 'meal' | 'exercise' | 'system'>('all');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Sample notifications data
  useEffect(() => {
    const sampleNotifications: Notification[] = [
      {
        id: '1',
        type: 'medication',
        title: 'Medication Reminder',
        message: 'Time to take your Ibuprofen (400mg). Take with food to avoid stomach irritation.',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        read: false,
        priority: 'high',
        actionRequired: true,
        relatedId: 'med-1',
        category: 'Health'
      },
      {
        id: '2',
        type: 'meal',
        title: 'Meal Planning',
        message: 'Your lunch is scheduled in 30 minutes. Healing Vegetable Soup is ready to prepare.',
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        read: false,
        priority: 'medium',
        actionRequired: false,
        relatedId: 'meal-2',
        category: 'Nutrition'
      },
      {
        id: '3',
        type: 'achievement',
        title: 'Recovery Milestone!',
        message: 'Congratulations! You\'ve maintained 95% medication adherence for 7 days straight.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: false,
        priority: 'medium',
        actionRequired: false,
        category: 'Achievement'
      },
      {
        id: '4',
        type: 'appointment',
        title: 'Upcoming Appointment',
        message: 'Reminder: Follow-up appointment with Dr. Smith tomorrow at 2:00 PM.',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        read: true,
        priority: 'high',
        actionRequired: true,
        category: 'Healthcare'
      },
      {
        id: '5',
        type: 'exercise',
        title: 'Physical Therapy',
        message: 'Time for your afternoon mobility exercises. Remember to start slowly.',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        read: true,
        priority: 'medium',
        actionRequired: false,
        relatedId: 'exercise-1',
        category: 'Recovery'
      },
      {
        id: '6',
        type: 'system',
        title: 'Data Backup Complete',
        message: 'Your health data has been successfully backed up to secure cloud storage.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        read: true,
        priority: 'low',
        actionRequired: false,
        category: 'System'
      },
      {
        id: '7',
        type: 'reminder',
        title: 'Hydration Check',
        message: 'You haven\'t logged water intake in 3 hours. Stay hydrated for better recovery!',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        read: false,
        priority: 'medium',
        actionRequired: true,
        category: 'Wellness'
      }
    ];
    setNotifications(sampleNotifications);
  }, []);

  const getNotificationIcon = (type: string, priority: string) => {
    const iconClass = priority === 'urgent' ? 'text-red-600' : 
                     priority === 'high' ? 'text-orange-600' : 
                     priority === 'medium' ? 'text-blue-600' : 'text-gray-600';
    
    switch (type) {
      case 'medication': return <Pill className={`h-5 w-5 ${iconClass}`} />;
      case 'meal': return <UtensilsCrossed className={`h-5 w-5 ${iconClass}`} />;
      case 'exercise': return <Activity className={`h-5 w-5 ${iconClass}`} />;
      case 'appointment': return <Calendar className={`h-5 w-5 ${iconClass}`} />;
      case 'achievement': return <CheckCircle className={`h-5 w-5 text-green-600`} />;
      case 'reminder': return <Clock className={`h-5 w-5 ${iconClass}`} />;
      default: return <Bell className={`h-5 w-5 ${iconClass}`} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500 bg-red-50';
      case 'high': return 'border-l-orange-500 bg-orange-50';
      case 'medium': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    return notif.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-end p-4 z-50">
      <Card className="w-full max-w-md h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <Bell className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
              <p className="text-sm text-gray-600">{unreadCount} unread</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Controls */}
        <div className="p-4 border-b border-gray-200 space-y-4">
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All', icon: Bell },
              { id: 'unread', label: 'Unread', icon: AlertCircle },
              { id: 'medication', label: 'Meds', icon: Pill },
              { id: 'meal', label: 'Meals', icon: UtensilsCrossed },
              { id: 'exercise', label: 'Exercise', icon: Activity },
              { id: 'system', label: 'System', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id as any)}
                  className={`flex items-center space-x-1 px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                    filter === tab.id
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="text-xs"
              >
                <MarkAsRead className="h-3 w-3 mr-1" />
                Mark All Read
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllNotifications}
                disabled={notifications.length === 0}
                className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-lg transition-colors ${
                soundEnabled 
                  ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' 
                  : 'text-gray-400 bg-gray-50 hover:bg-gray-100'
              }`}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <Bell className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-600">You're all caught up! Check back later for updates.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors border-l-4 ${
                    !notification.read ? getPriorityColor(notification.priority) : 'border-l-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type, notification.priority)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            )}
                            {notification.actionRequired && (
                              <div className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-medium">
                                Action Required
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 text-xs text-gray-500">
                              <span>{formatTimestamp(notification.timestamp)}</span>
                              <span>•</span>
                              <span className="bg-gray-100 px-2 py-0.5 rounded-full">{notification.category}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 ml-2">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                              title="Mark as read"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete notification"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      {notification.actionRequired && (
                        <div className="mt-3 flex space-x-2">
                          <Button variant="primary" size="sm" className="text-xs">
                            Take Action
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs">
                            Remind Later
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
            <button className="text-emerald-600 hover:text-emerald-700 font-medium">
              Notification Settings
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NotificationCenter;