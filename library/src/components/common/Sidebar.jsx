import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ArrowRightLeft,
  Bookmark,
  BarChart3,
  History,
  Bell,
  Sparkles,
  Bot,
  UserCheck,
  QrCode,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { currentUser, logout } = useApp();

  // Collapsed / Slid state saved in localStorage
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('lms_sidebar_collapsed') === 'true';
  });

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('lms_sidebar_collapsed', String(next));
      return next;
    });
  };

  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'admin';

  const adminNav = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Books', path: '/admin/books', icon: BookOpen },
    { label: 'Members', path: '/admin/members', icon: Users },
    { label: 'Transactions', path: '/admin/transactions', icon: ArrowRightLeft },
    { label: 'Reservations', path: '/admin/reservations', icon: Bookmark },
    { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Activity Logs', path: '/admin/activity', icon: History },
    { label: 'Notifications', path: '/admin/notifications', icon: Bell },
    { label: 'Settings', path: '/admin/settings', icon: Settings }
  ];

  const studentNav = [
    { label: 'Dashboard', path: '/student', icon: LayoutDashboard, exact: true },
    { label: 'Browse Books', path: '/student/books', icon: BookOpen },
    { label: 'My Books', path: '/student/my-books', icon: ArrowRightLeft },
    { label: 'Reservations', path: '/student/reservations', icon: Bookmark },
    { label: 'Recommendations', path: '/student/recommendations', icon: Sparkles },
    { label: 'Library Assistant', path: '/student/assistant', icon: Bot },
    { label: 'Profile', path: '/student/profile', icon: UserCheck },
    { label: 'Digital Library Card', path: '/student/card', icon: QrCode },
    { label: 'Notifications', path: '/student/notifications', icon: Bell }
  ];

  const navItems = isAdmin ? adminNav : studentNav;

  return (
    <>
      {/* Mobile Overlay Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container - Smooth Slid-able / Collapsible */}
      <aside
        className={`fixed lg:sticky top-0 bottom-0 left-0 z-50 lg:z-40 h-screen bg-zinc-950 text-zinc-100 border-r border-zinc-800/80 transition-all duration-300 ease-in-out flex flex-col shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-64'} w-72 lg:w-64`}
      >
        {/* Header for Mobile Drawer */}
        <div className="flex lg:hidden items-center justify-between px-4 py-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white text-black rounded-xl shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-white text-sm">Smart Library</h2>
              <p className="text-[10px] text-zinc-400 font-medium capitalize">
                {isAdmin ? 'University Admin' : 'Student Portal'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl transition-colors"
            aria-label="Close navigation sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Header for Desktop */}
        <div className="hidden lg:flex items-center justify-between px-4 py-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2.5 bg-white text-black rounded-2xl shadow-sm shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <h2 className="font-extrabold text-white tracking-tight text-sm truncate">Smart Library</h2>
                <p className="text-[10px] text-zinc-400 font-medium capitalize truncate">
                  {isAdmin ? 'University Admin' : 'Student Portal'}
                </p>
              </div>
            )}
          </div>

          {/* Desktop Slide / Collapse Toggle Button */}
          <button
            onClick={toggleCollapse}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl transition-colors shrink-0"
            title={isCollapsed ? "Expand Sidebar" : "Slide / Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-3 py-4 overflow-y-auto space-y-1 custom-scrollbar">
          {!isCollapsed && (
            <div className="px-3 pb-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider transition-opacity">
              Navigation Menu
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                onClick={onClose}
                title={isCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3.5'} py-2.5 rounded-2xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white text-black font-extrabold shadow-md'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </div>

        {/* Sidebar Footer Logout & Collapse Controls */}
        <div className="p-3 border-t border-zinc-800/80 bg-zinc-950 space-y-2">
          {/* Quick Slide Toggle Bar inside Footer */}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex w-full items-center justify-center gap-2 p-2 bg-zinc-900/60 hover:bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 rounded-xl text-xs font-semibold transition-colors"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-purple-400" />
            ) : (
              <>
                <PanelLeftClose className="w-4 h-4 text-purple-400" />
                <span className="text-[11px]">Slide Sidebar</span>
              </>
            )}
          </button>

          {/* Logout Button */}
          <button
            onClick={() => {
              onClose();
              logout();
            }}
            title={isCollapsed ? "Logout" : undefined}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-center gap-2 px-4'} py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 rounded-2xl text-sm font-bold transition-all`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
