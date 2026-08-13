import React from 'react';
import FloatingDock from '@/components/ui/floating-dock';
import { useApp } from '@/context/AppContext';
import {
  IconHome,
  IconBook,
  IconUsers,
  IconArrowsExchange,
  IconChartBar,
  IconHistory,
  IconBell,
  IconSparkles,
  IconRobot,
  IconQrcode,
  IconUserCheck,
  IconBookmark
} from '@tabler/icons-react';

const FloatingNavbar = () => {
  const { currentUser } = useApp();

  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'admin';

  const adminLinks = [
    {
      title: "Dashboard",
      icon: <IconHome className="h-full w-full text-indigo-400" />,
      href: "/admin",
    },
    {
      title: "Book Catalog",
      icon: <IconBook className="h-full w-full text-indigo-400" />,
      href: "/admin/books",
    },
    {
      title: "Members",
      icon: <IconUsers className="h-full w-full text-indigo-400" />,
      href: "/admin/members",
    },
    {
      title: "Transactions",
      icon: <IconArrowsExchange className="h-full w-full text-indigo-400" />,
      href: "/admin/transactions",
    },
    {
      title: "Holds",
      icon: <IconBookmark className="h-full w-full text-indigo-400" />,
      href: "/admin/reservations",
    },
    {
      title: "Analytics",
      icon: <IconChartBar className="h-full w-full text-indigo-400" />,
      href: "/admin/analytics",
    },
    {
      title: "Activity Logs",
      icon: <IconHistory className="h-full w-full text-indigo-400" />,
      href: "/admin/activity",
    },
    {
      title: "Notifications",
      icon: <IconBell className="h-full w-full text-indigo-400" />,
      href: "/admin/notifications",
    },
  ];

  const studentLinks = [
    {
      title: "Dashboard",
      icon: <IconHome className="h-full w-full text-emerald-400" />,
      href: "/student",
    },
    {
      title: "Browse Catalog",
      icon: <IconBook className="h-full w-full text-emerald-400" />,
      href: "/student/books",
    },
    {
      title: "My Books",
      icon: <IconArrowsExchange className="h-full w-full text-emerald-400" />,
      href: "/student/my-books",
    },
    {
      title: "AI Recommendations",
      icon: <IconSparkles className="h-full w-full text-emerald-400" />,
      href: "/student/recommendations",
    },
    {
      title: "AI Assistant",
      icon: <IconRobot className="h-full w-full text-emerald-400" />,
      href: "/student/assistant",
    },
    {
      title: "Digital Pass Card",
      icon: <IconQrcode className="h-full w-full text-emerald-400" />,
      href: "/student/card",
    },
    {
      title: "Profile",
      icon: <IconUserCheck className="h-full w-full text-emerald-400" />,
      href: "/student/profile",
    },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <div className="hidden md:flex fixed bottom-6 inset-x-0 z-50 items-center justify-center pointer-events-none">
      <div className="pointer-events-auto shadow-2xl">
        <FloatingDock items={links} />
      </div>
    </div>
  );
};

export default FloatingNavbar;
