import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  UserPlus,
  MessageSquare,
  Calendar,
  Sparkles,
  Users,
  Check,
} from 'lucide-react';
import { api } from '../services/api';

const NotificationDropdown = ({ isOpen, setIsOpen }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fetchNotifs = async () => {
    try {
      const res = await api.notifications.getNotifications();
      if (res.success) {
        setNotifications(res.notifications || []);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (err) {
      console.warn('Error fetching notifications:', err.message);
    }
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 15000); // Polling update
    return () => clearInterval(interval);
  }, []);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsOpen]);

  const handleMarkAllRead = async () => {
    try {
      await api.notifications.markAllAsRead();
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotificationClick = async (notif) => {
    try {
      if (!notif.read) {
        await api.notifications.markAsRead(notif._id);
        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, read: true } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      }
      setIsOpen(false);
      if (notif.link) {
        navigate(notif.link);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'connection_request':
        return <UserPlus className="w-4 h-4 text-purple-600" />;
      case 'connection_accepted':
        return <Sparkles className="w-4 h-4 text-emerald-600" />;
      case 'new_message':
        return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case 'session_reminder':
        return <Calendar className="w-4 h-4 text-amber-600" />;
      case 'group_invite':
        return <Users className="w-4 h-4 text-indigo-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-navy-700 hover:text-brand-600 hover:bg-brand-50 transition-colors focus:outline-none"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-brand-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-4 pb-2.5 flex items-center justify-between border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-navy-900">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-[11px] font-bold bg-brand-100 text-brand-700 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-brand-600 hover:text-brand-800 font-medium flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[360px] overflow-y-auto divide-y divide-gray-50">
            {notifications.length === 0 ? (
              <div className="py-8 text-center px-4">
                <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-navy-800">No notifications yet</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  We will alert you when you get matches or session requests.
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif._id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-3 ${
                    !notif.read ? 'bg-purple-50/40' : ''
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {getNotifIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-bold text-navy-900 truncate">
                        {notif.title}
                      </p>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-brand-600 flex-shrink-0"></span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-0.5 leading-snug">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {new Date(notif.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
