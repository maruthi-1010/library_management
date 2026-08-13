import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, BookOpen, LogOut, Shield, GraduationCap, Clock, AlertTriangle, Info, Sun, Moon, Check, Menu, X } from 'lucide-react';

const Navbar = ({ onToggleSidebar, isSidebarOpen }) => {
  const { currentUser, logout, notifications, markNotificationRead, markAllNotificationsRead, theme, toggleTheme } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  // Filter notifications for current user
  const userNotifications = notifications.filter(
    n => currentUser && (n.userId === currentUser.id || currentUser.role === 'admin')
  );
  const unreadCount = userNotifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotifIcon = (type) => {
    switch (type) {
      case 'overdue':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'due':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'reservation':
        return <BookOpen className="w-4 h-4 text-emerald-500" />;
      default:
        return <Info className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 lg:px-6 py-3 transition-colors">
      <div className="flex items-center justify-between">
        
        {/* Left Side: Mobile Toggle & Branding */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-black dark:bg-white text-white dark:text-black rounded-xl shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-zinc-900 dark:text-white tracking-tight text-base sm:text-lg flex items-center gap-2">
                Smart Library
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 rounded-full uppercase">
                  Academic Platform
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Notifications & User Profile */}
        <div className="flex items-center gap-2.5">

          {/* Notifications Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl transition-colors focus:outline-none"
              title="Notifications"
            >
              <Bell className="w-4.5 h-4.5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-black dark:bg-white text-white dark:text-black text-[10px] font-extrabold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Menu */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in">
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-900 dark:text-white text-sm">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 text-xs bg-black dark:bg-white text-white dark:text-black font-bold rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => markAllNotificationsRead(currentUser.id)}
                      className="text-xs text-zinc-600 dark:text-zinc-300 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Check className="w-3.5 h-3.5" /> Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/60 custom-scrollbar">
                  {userNotifications.length === 0 ? (
                    <div className="p-6 text-center text-zinc-500 dark:text-zinc-400 text-xs font-medium">
                      No notifications at this time.
                    </div>
                  ) : (
                    userNotifications.map(notif => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationRead(notif.id)}
                        className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                          notif.read
                            ? 'bg-transparent opacity-60'
                            : 'bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-850'
                        }`}
                      >
                        <div className="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg shrink-0 mt-0.5">
                          {getNotifIcon(notif.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium">{notif.message}</p>
                          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 block">
                            {new Date(notif.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        {!notif.read && (
                          <span className="w-2 h-2 bg-black dark:bg-white rounded-full shrink-0 mt-1.5"></span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Details Badge */}
          {currentUser && (
            <div className="flex items-center gap-2 pl-2 border-l border-zinc-200 dark:border-zinc-800">
              <div className="p-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-700 dark:text-zinc-200 hidden sm:block">
                {currentUser.role === 'admin' ? (
                  <Shield className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
                ) : (
                  <GraduationCap className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
                )}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium capitalize flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100"></span>
                  {currentUser.role} {currentUser.memberId && `(${currentUser.memberId})`}
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-colors ml-1"
                title="Logout"
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
            </div>
          )}

        </div>
      </div>
    </header>
  );
};

export default Navbar;
