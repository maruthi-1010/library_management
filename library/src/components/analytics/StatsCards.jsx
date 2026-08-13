import React from 'react';
import { BookOpen, Users, ArrowRightLeft, CheckCircle, AlertTriangle, IndianRupee, Bookmark, Clock } from 'lucide-react';

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: "Total Books",
      value: stats.totalBooks,
      subtext: `${stats.totalCopies} total copies`,
      icon: BookOpen,
      color: "from-blue-600 to-blue-700"
    },
    {
      title: "Total Members",
      value: stats.totalMembers,
      subtext: `${stats.activeMembers} active students`,
      icon: Users,
      color: "from-sky-500 to-blue-600"
    },
    {
      title: "Currently Issued",
      value: stats.currentlyIssued,
      subtext: "Active loans",
      icon: ArrowRightLeft,
      color: "from-indigo-500 to-blue-600"
    },
    {
      title: "Available Copies",
      value: stats.availableBooks,
      subtext: "Ready for checkout",
      icon: CheckCircle,
      color: "from-emerald-600 to-teal-600"
    },
    {
      title: "Overdue Loans",
      value: stats.overdueBooks,
      subtext: "Incurring daily fines",
      icon: AlertTriangle,
      color: "from-red-600 to-rose-700"
    },
    {
      title: "Total Fines",
      value: `₹${stats.totalFines}`,
      subtext: "Collected & pending",
      icon: IndianRupee,
      color: "from-amber-500 to-orange-600"
    },
    {
      title: "Pending Holds",
      value: stats.pendingReservations,
      subtext: "Book reservations",
      icon: Bookmark,
      color: "from-orange-600 to-amber-600"
    },
    {
      title: "Total Transactions",
      value: stats.totalTransactions,
      subtext: "All-time checkout history",
      icon: Clock,
      color: "from-blue-700 to-indigo-700"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-3xl p-5 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-between group"
          >
            <div>
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block mb-1">
                {card.title}
              </span>
              <div className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">{card.value}</div>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium mt-0.5 block">{card.subtext}</span>
            </div>
            <div className={`p-3.5 bg-gradient-to-br ${card.color} text-white rounded-2xl shadow-md shrink-0 group-hover:scale-105 transition-transform`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
