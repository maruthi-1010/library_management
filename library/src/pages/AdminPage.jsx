import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import BookList from '../components/books/BookList';
import MemberList from '../components/members/MemberList';
import TransactionList from '../components/transactions/TransactionList';
import ReservationList from '../components/reservations/ReservationList';
import AnalyticsView from './AnalyticsView';
import ActivityLogView from './ActivityLogView';
import NotificationsView from './NotificationsView';
import SettingsView from './SettingsView';
import FloatingNavbar from '../components/common/FloatingNavbar';
import StatsCards from '../components/analytics/StatsCards';
import { useApp } from '../context/AppContext';
import { formatDate } from '../utils/dateUtils';
import { BookOpen, ArrowRightLeft, History, Users, ArrowRight, Shield, Plus, Globe, Sparkles, TrendingUp, UserCheck, CheckCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const CIRCULATION_TREND_DATA = [
  { month: 'Jan', Checkouts: 120, Returns: 110, Reservations: 35 },
  { month: 'Feb', Checkouts: 145, Returns: 130, Reservations: 42 },
  { month: 'Mar', Checkouts: 190, Returns: 175, Reservations: 58 },
  { month: 'Apr', Checkouts: 210, Returns: 195, Reservations: 64 },
  { month: 'May', Checkouts: 260, Returns: 240, Reservations: 80 },
  { month: 'Jun', Checkouts: 310, Returns: 290, Reservations: 95 }
];

const CATEGORY_PIE_DATA = [
  { name: 'Programming', value: 35, color: '#6366f1' },
  { name: 'AI & ML', value: 28, color: '#a855f7' },
  { name: 'Data Science', value: 18, color: '#10b981' },
  { name: 'Cyber Security', value: 12, color: '#f43f5e' },
  { name: 'Web Dev', value: 15, color: '#0ea5e9' }
];

// Admin Main Executive Dashboard
const AdminDashboardOverview = () => {
  const { books, members, transactions, reservations, activityLogs } = useApp();

  const totalBooks = books.length;
  const totalCopies = books.reduce((sum, b) => sum + (b.totalCopies || 5), 0);
  const availableBooks = books.reduce((sum, b) => sum + (b.availableCopies || 5), 0);

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

  const recentTransactions = transactions.slice(0, 5);
  const recentLogs = activityLogs.slice(0, 5);
  const topMembers = members.slice(0, 5);

  return (
    <div className="space-y-6 text-zinc-950 dark:text-zinc-50">
      {/* Executive Welcome & Control Center */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 text-white relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-200 font-bold text-xs">
              <Shield className="w-3.5 h-3.5 text-white" /> Institutional Control Center
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-950/80 text-purple-300 border border-purple-800/80 rounded-xl font-bold text-xs">
              <Globe className="w-3.5 h-3.5 text-purple-400" /> Google Books API Live
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Institutional Library Operations & Analytics
          </h1>
          <p className="text-zinc-400 text-sm max-w-2xl font-medium">
            Real-time monitoring of circulation velocity, student/faculty memberships, Google Books API catalog synchronization, and automated fine calculations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 z-10">
          <Link
            to="/admin/transactions"
            className="px-4 py-2.5 bg-white text-black font-extrabold text-sm rounded-xl transition-all shadow-md flex items-center gap-2 active:scale-95 hover:bg-zinc-200"
          >
            <Plus className="w-4 h-4" /> Issue Book
          </Link>
          <Link
            to="/admin/books"
            className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-sm rounded-xl border border-zinc-700 transition-all flex items-center gap-2 active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-purple-400" /> Import via API
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <StatsCards stats={stats} />

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Circulation Trend Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  Monthly Circulation & Loan Velocity
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Comparing checkouts, returns, and reservation volume</p>
              </div>
              <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-lg">
                +18.4% Growth
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CIRCULATION_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCheckouts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorReturns" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.5} />
                  <XAxis dataKey="month" stroke="#a1a1aa" fontSize={11} />
                  <YAxis stroke="#a1a1aa" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="Checkouts" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorCheckouts)" />
                  <Area type="monotone" dataKey="Returns" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorReturns)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Category Distribution Donut Chart (1 Col) */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-zinc-900 dark:text-white mb-1 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-400" />
              Category Inventory Share
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">Distribution by primary domain</p>

            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={CATEGORY_PIE_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                    {CATEGORY_PIE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
              {CATEGORY_PIE_DATA.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-zinc-400 truncate">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Real Customers / Active Members Datatable */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-purple-400" />
              Registered Library Members & Patrons
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Active student accounts, faculty scholars, and borrowing privileges.
            </p>
          </div>
          <Link
            to="/admin/members"
            className="text-xs font-bold text-zinc-900 dark:text-white hover:underline flex items-center gap-1 shrink-0"
          >
            View All {members.length} Members <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-950/80 text-zinc-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">
                <th className="py-3.5 px-4">Member Info</th>
                <th className="py-3.5 px-4">Member ID</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4 text-center">Membership Type</th>
                <th className="py-3.5 px-4 text-center">Active Loans</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80 text-zinc-800 dark:text-zinc-300 text-xs">
              {topMembers.map((member) => {
                const activeLoansCount = transactions.filter(t => t.memberId === member.memberId && t.status === 'issued').length;
                return (
                  <tr key={member.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                          alt={member.name}
                          className="w-9 h-9 rounded-full object-cover border border-zinc-300 dark:border-zinc-700 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-zinc-900 dark:text-white">{member.name}</div>
                          <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-purple-600 dark:text-purple-400">{member.memberId}</td>
                    <td className="py-3.5 px-4">{member.department}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-lg font-bold text-[10px]">
                        {member.type || 'Student'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold font-mono">
                      {activeLoansCount} book(s)
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle className="w-3 h-3" /> {member.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                      {member.phone}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid: Recent Transactions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Transactions Box */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-purple-400" />
                Recent Transactions
              </h3>
              <Link to="/admin/transactions" className="text-xs font-bold text-zinc-900 dark:text-white hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
              {recentTransactions.map(txn => {
                const book = books.find(b => b.id === txn.bookId);
                const member = members.find(m => m.memberId === txn.memberId);
                return (
                  <div key={txn.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-zinc-900 dark:text-white">{txn.bookTitle || (book ? book.title : txn.bookId)}</div>
                      <div className="text-zinc-500 dark:text-zinc-400">{member ? member.name : txn.memberId} ({txn.memberId})</div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        txn.status === 'returned'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                      }`}>
                        {txn.status}
                      </span>
                      <div className="text-[10px] text-zinc-400 mt-0.5">{formatDate(txn.issueDate)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Activity Logs Box */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                <History className="w-4 h-4 text-purple-400" />
                Recent Activity Logs
              </h3>
              <Link to="/admin/activity" className="text-xs font-bold text-zinc-900 dark:text-white hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
              {recentLogs.map(log => (
                <div key={log.id} className="py-3 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">{log.action}</span>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400 font-medium">{log.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const AdminPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-950 dark:text-zinc-50 flex flex-col transition-colors">
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex flex-1">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 w-full transition-all pb-24">
          <Routes>
            <Route path="/" element={<AdminDashboardOverview />} />
            <Route path="/books" element={<BookList isAdmin={true} />} />
            <Route path="/members" element={<MemberList />} />
            <Route path="/transactions" element={<TransactionList />} />
            <Route path="/reservations" element={<ReservationList />} />
            <Route path="/analytics" element={<AnalyticsView />} />
            <Route path="/activity" element={<ActivityLogView />} />
            <Route path="/notifications" element={<NotificationsView />} />
            <Route path="/settings" element={<SettingsView />} />
          </Routes>
        </main>
      </div>

      <FloatingNavbar />
    </div>
  );
};

export default AdminPage;
