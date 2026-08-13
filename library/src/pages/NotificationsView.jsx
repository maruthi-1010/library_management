import React from 'react';
import { useApp } from '../context/AppContext';
import EmptyState from '../components/common/EmptyState';
import { Bell, Check, AlertTriangle, Clock, BookOpen, Info, Trash2 } from 'lucide-react';
import { formatDateTime } from '../utils/dateUtils';

const NotificationsView = () => {
  const { notifications, currentUser, markNotificationRead, markAllNotificationsRead } = useApp();

  const userNotifications = notifications.filter(
    n => currentUser && (n.userId === currentUser.id || currentUser.role === 'admin')
  );
  const unreadCount = userNotifications.filter(n => !n.read).length;

  const getIcon = (type) => {
    switch (type) {
      case 'overdue':
        return <AlertTriangle className="w-5 h-5 text-rose-400" />;
      case 'due':
        return <Clock className="w-5 h-5 text-amber-400" />;
      case 'reservation':
        return <BookOpen className="w-5 h-5 text-emerald-400" />;
      default:
        return <Info className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-indigo-400" />
            System Notifications & Alerts
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Important updates regarding due dates, overdue fines, book reservation availability, and system notices.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={() => markAllNotificationsRead(currentUser.id)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/25 flex items-center gap-2 shrink-0 active:scale-95"
          >
            <Check className="w-4 h-4" /> Mark All as Read
          </button>
        )}
      </div>

      {userNotifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You currently have no notifications."
        />
      ) : (
        <div className="space-y-3">
          {userNotifications.map(notif => (
            <div
              key={notif.id}
              onClick={() => markNotificationRead(notif.id)}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-4 cursor-pointer ${
                notif.read
                  ? 'bg-slate-900/60 border-slate-800/80 opacity-70'
                  : 'bg-slate-900 border-indigo-500/30 shadow-lg shadow-indigo-500/5 hover:border-indigo-500/50'
              }`}
            >
              <div className="p-2.5 bg-slate-800 rounded-xl shrink-0 mt-0.5 border border-slate-700/50">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 capitalize">
                    {notif.type} Alert
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {formatDateTime(notif.date)}
                  </span>
                </div>
                <p className="text-sm text-slate-100 font-normal leading-relaxed">{notif.message}</p>
              </div>

              {!notif.read && (
                <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full shrink-0 mt-2"></span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsView;
