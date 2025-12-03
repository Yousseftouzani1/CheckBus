import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, CheckCheck, Trash2, Filter, X, Calendar, Clock, CreditCard, RefreshCw, DollarSign, Ticket, ChevronDown } from 'lucide-react';

// ============= JWT HELPER FUNCTIONS =============
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
};

const getUserIdFromToken = () => {
  const token = getCookie('jwt') || getCookie('token') || getCookie('authToken');
  if (!token) return null;
  const payload = parseJwt(token);
  if (!payload) return null;
  return payload.userId || payload.id || payload.sub || 35;
};

// ============= API FUNCTIONS =============
const fetchNotifications = async (userId, filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.page !== undefined) params.append('page', filters.page);
    if (filters.size !== undefined) params.append('size', filters.size);
    if (filters.seen !== undefined && filters.seen !== '') params.append('seen', filters.seen);
    if (filters.type) params.append('type', filters.type);
    if (filters.from) params.append('from', filters.from);
    if (filters.to) params.append('to', filters.to);

    const url = `http://localhost:8090/notification-service/api/notifications/user/${userId}${params.toString() ? '?' + params.toString() : ''}`;
    console.log('Fetching notifications from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });

    if (!response.ok) {
      console.error('Failed to fetch notifications:', response.status);
      throw new Error('Failed to fetch notifications');
    }

    const data = await response.json();
    console.log('Notifications response:', data);
    return data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return { content: [], totalElements: 0, totalPages: 0 };
  }
};

const fetchUnreadCount = async (userId) => {
  try {
    const response = await fetch(`http://localhost:8090/notification-service/api/notifications/user/${userId}/unread-count`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to fetch unread count');
    const count = await response.json();
    console.log('Unread count:', count);
    return count;
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return 0;
  }
};

const markAsSeen = async (notificationId) => {
  try {
    const response = await fetch(`http://localhost:8090/notification-service/api/notifications/${notificationId}/seen`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });
    return response.ok;
  } catch (error) {
    console.error('Error marking as seen:', error);
    return false;
  }
};

const markAllAsSeen = async (userId) => {
  try {
    const response = await fetch(`http://localhost:8090/notification-service/api/notifications/user/${userId}/mark-all-seen`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });
    return response.ok;
  } catch (error) {
    console.error('Error marking all as seen:', error);
    return false;
  }
};

const deleteNotification = async (notificationId) => {
  try {
    const response = await fetch(`http://localhost:8090/notification-service/api/notifications/${notificationId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });
    return response.ok;
  } catch (error) {
    console.error('Error deleting notification:', error);
    return false;
  }
};

// ============= NOTIFICATION CARD =============
function NotificationCard({ notification, onMarkSeen, onDelete }) {
  // Determine type from title or message content
  const getNotificationType = (notif) => {
    const text = (notif.title + ' ' + notif.message).toLowerCase();
    if (text.includes('payment') || text.includes('paid')) return 'PAYMENT';
    if (text.includes('refund') || text.includes('cancelled')) return 'REFUND';
    if (text.includes('subscription') || text.includes('pass')) return 'SUBSCRIPTION';
    return 'GENERAL';
  };

  const type = getNotificationType(notification);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'SUBSCRIPTION':
        return <Bell className="w-5 h-5" />;
      case 'PAYMENT':
        return <DollarSign className="w-5 h-5" />;
      case 'REFUND':
        return <RefreshCw className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getTypeGradient = (type) => {
    switch (type) {
      case 'SUBSCRIPTION':
        return 'from-blue-400 to-indigo-500';
      case 'PAYMENT':
        return 'from-green-400 to-emerald-500';
      case 'REFUND':
        return 'from-yellow-400 to-orange-500';
      default:
        return 'from-blue-400 to-indigo-500';
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-xl hover:bg-white/15 transition-all duration-300 group ${
      !notification.seen ? 'ring-2 ring-blue-400/50' : ''
    }`}>
      <div className="flex items-start space-x-4">
        {/* Icon */}
        <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${getTypeGradient(type)} rounded-xl flex items-center justify-center shadow-lg`}>
          {getTypeIcon(type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-white font-semibold text-lg">{notification.title}</h4>
            {!notification.seen && (
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse ml-2 mt-2"></div>
            )}
          </div>
          
          <p className="text-blue-100 text-sm mb-3 line-clamp-2">{notification.message}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-blue-200 text-xs">
              <Clock className="w-3 h-3" />
              <span>{formatDate(notification.createdAt)}</span>
            </div>

            <div className="flex items-center space-x-2">
              {!notification.seen && (
                <button
                  onClick={() => onMarkSeen(notification.id)}
                  className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 rounded-lg transition-all duration-300"
                  title="Mark as seen"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
              
              <button
                onClick={() => onDelete(notification.id)}
                className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============= FILTER PANEL =============
function FilterPanel({ filters, onFilterChange, onClose }) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApply = () => {
    onFilterChange(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      seen: '',
      type: '',
      from: '',
      to: ''
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8 max-w-md w-full animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl mb-4 shadow-lg">
            <Filter className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Filter Notifications</h3>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-blue-200 text-sm font-semibold mb-2">Status</label>
            <select
              value={localFilters.seen}
              onChange={(e) => setLocalFilters({ ...localFilters, seen: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">All</option>
              <option value="false">Unread</option>
              <option value="true">Read</option>
            </select>
          </div>

          <div>
            <label className="block text-blue-200 text-sm font-semibold mb-2">Type</label>
            <select
              value={localFilters.type}
              onChange={(e) => setLocalFilters({ ...localFilters, type: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">All Types</option>
              <option value="SUBSCRIPTION">🔔 Subscription</option>
              <option value="PAYMENT">💰 Payment</option>
              <option value="REFUND">↩️ Refund</option>
            </select>
          </div>

          <div>
            <label className="block text-blue-200 text-sm font-semibold mb-2">From Date</label>
            <input
              type="datetime-local"
              value={localFilters.from}
              onChange={(e) => setLocalFilters({ ...localFilters, from: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-blue-200 text-sm font-semibold mb-2">To Date</label>
            <input
              type="datetime-local"
              value={localFilters.to}
              onChange={(e) => setLocalFilters({ ...localFilters, to: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleReset}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-xl border border-white/20 transition-all duration-300"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

// ============= MAIN NOTIFICATIONS PAGE =============
export default function Notifications() {
  const [userId, setUserId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    seen: '',
    type: '',
    from: '',
    to: '',
    page: 0,
    size: 10
  });

  const sseRef = useRef(null);

  // Initialize user
  useEffect(() => {
    const id = getUserIdFromToken();
    console.log('User ID from token:', id);
    if (!id) {
      console.warn('No user ID found, using default');
      setUserId(35);
    } else {
      setUserId(id);
    }
  }, []);

  // Fetch notifications when filters or page change
  useEffect(() => {
    if (!userId) return;

    const loadNotifications = async () => {
      setLoading(true);
      const data = await fetchNotifications(userId, { ...filters, page });
      
      if (page === 0) {
        setNotifications(data.content || []);
      } else {
        setNotifications(prev => [...prev, ...(data.content || [])]);
      }
      
      setTotalPages(data.totalPages || 0);
      setLoading(false);
    };

    loadNotifications();
  }, [userId, filters, page]);

  // Fetch unread count
  useEffect(() => {
    if (!userId) return;

    const loadUnreadCount = async () => {
      const count = await fetchUnreadCount(userId);
      setUnreadCount(count);
    };

    loadUnreadCount();
    
    // Refresh unread count every 30 seconds
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  // Setup SSE for real-time notifications
  useEffect(() => {
    if (!userId) return;

    console.log('Setting up SSE connection for user:', userId);
    const sse = new EventSource(`http://localhost:8090/notification-service/api/notifications/stream/${userId}`);
    
    sse.addEventListener('notification', (event) => {
      console.log('New notification received:', event.data);
      try {
        const newNotif = JSON.parse(event.data);
        setNotifications(prev => [newNotif, ...prev]);
        setUnreadCount(prev => prev + 1);
      } catch (error) {
        console.error('Error parsing notification:', error);
      }
    });

    sse.onopen = () => {
      console.log('SSE connection opened');
    };

    sse.onerror = (error) => {
      console.error('SSE connection error:', error);
      sse.close();
    };

    sseRef.current = sse;

    return () => {
      console.log('Closing SSE connection');
      if (sseRef.current) {
        sseRef.current.close();
      }
    };
  }, [userId]);

  // Handlers
  const handleMarkSeen = async (notificationId) => {
    const success = await markAsSeen(notificationId);
    if (success) {
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, seen: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const handleMarkAllSeen = async () => {
    if (!userId) return;
    const success = await markAllAsSeen(userId);
    if (success) {
      setNotifications(prev => prev.map(n => ({ ...n, seen: true })));
      setUnreadCount(0);
    }
  };

  const handleDelete = async (notificationId) => {
    const success = await deleteNotification(notificationId);
    if (success) {
      const deletedNotif = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      if (deletedNotif && !deletedNotif.seen) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...newFilters, page: 0, size: 10 });
    setPage(0);
  };

  const handleLoadMore = () => {
    if (page < totalPages - 1) {
      setPage(prev => prev + 1);
    }
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <Bell className="w-16 h-16 text-white mx-auto mb-4 animate-pulse" />
          <div className="text-white text-xl">Loading notifications...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-3xl mb-4 shadow-2xl">
              <Bell className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Notification Center
            </h1>
            <p className="text-blue-100 text-lg">
              Stay updated with your latest activities
            </p>
          </div>

          {/* Action Bar */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-xl mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-white font-semibold">{notifications.length} notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-3 py-1 bg-blue-500 text-white text-sm font-bold rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowFilters(true)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-semibold transition-all duration-300 flex items-center space-x-2"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>

                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllSeen}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center space-x-2 shadow-lg"
                  >
                    <CheckCheck className="w-4 h-4" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Notifications List */}
          {notifications.length === 0 ? (
            <div className="text-center py-16 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
              <Bell className="w-20 h-20 text-blue-300 mx-auto mb-4 opacity-50" />
              <p className="text-white text-xl font-semibold mb-2">No notifications yet</p>
              <p className="text-blue-100">You're all caught up!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map(notification => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkSeen={handleMarkSeen}
                  onDelete={handleDelete}
                />
              ))}

              {/* Load More Button */}
              {page < totalPages - 1 && (
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <ChevronDown className="w-5 h-5" />
                  <span>{loading ? 'Loading...' : 'Load More'}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <FilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          onClose={() => setShowFilters(false)}
        />
      )}

      {/* Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}