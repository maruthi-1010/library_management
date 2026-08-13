import React from 'react';
import { useApp } from '../context/AppContext';
import StatsCards from '../components/analytics/StatsCards';
import TransactionChart from '../components/analytics/TransactionChart';
import CategoryChart from '../components/analytics/CategoryChart';
import PopularBooksChart from '../components/analytics/PopularBooksChart';
import { BarChart3 } from 'lucide-react';

const AnalyticsView = () => {
  const { books, members, transactions, reservations } = useApp();

  const totalBooks = books.length;
  const totalCopies = books.reduce((sum, b) => sum + b.totalCopies, 0);
  const availableBooks = books.reduce((sum, b) => sum + b.availableCopies, 0);

  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.status === 'active').length;

  const totalTransactions = transactions.length;
  const currentlyIssued = transactions.filter(t => t.status === 'issued').length;

  const todayStr = new Date().toISOString().split('T')[0];
  const overdueBooks = transactions.filter(t => t.status === 'issued' && t.dueDate < todayStr).length;

  const totalFines = transactions.reduce((sum, t) => sum + (t.fine || 0), 0);
  const pendingReservations = reservations.filter(r => r.status === 'pending').length;

  const stats = {
    totalBooks,
    totalCopies,
    availableBooks,
    totalMembers,
    activeMembers,
    totalTransactions,
    currentlyIssued,
    overdueBooks,
    totalFines,
    pendingReservations
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-400" />
          Advanced Library Analytics & Insights
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Real-time metrics, transaction activity charts, category distribution, and book checkout statistics.
        </p>
      </div>

      {/* KPI Cards */}
      <StatsCards stats={stats} />

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TransactionChart transactions={transactions} />
        <CategoryChart books={books} />
      </div>

      <div className="w-full">
        <PopularBooksChart books={books} transactions={transactions} />
      </div>
    </div>
  );
};

export default AnalyticsView;
