import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import BookList from '../components/books/BookList';
import ReservationList from '../components/reservations/ReservationList';
import Recommendation from '../components/ai/Recommendation';
import LibraryAssistant from '../components/ai/LibraryAssistant';
import NotificationsView from './NotificationsView';
import StudentMyBooksView from './StudentMyBooksView';
import StudentProfileView from './StudentProfileView';
import StudentCardView from './StudentCardView';
import FloatingNavbar from '../components/common/FloatingNavbar';

import { useApp } from '../context/AppContext';
import { getBookRecommendations } from '../utils/recommendationEngine';
import { getDaysRemaining, formatDate } from '../utils/dateUtils';
import {
  BookOpen,
  ArrowRightLeft,
  Bookmark,
  IndianRupee,
  AlertTriangle,
  Sparkles,
  Bot,
  GraduationCap,
  Clock,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

// Student Main Dashboard Sub-component
const StudentDashboardOverview = () => {
  const { currentUser, transactions, books, reservations } = useApp();
  const studentMemberId = currentUser?.memberId;

  const myTransactions = transactions.filter(t => t.memberId === studentMemberId);
  const currentlyBorrowed = myTransactions.filter(t => t.status === 'issued');
  const booksReturned = myTransactions.filter(t => t.status === 'returned').length;
  const activeReservations = reservations.filter(r => r.memberId === studentMemberId && r.status === 'pending').length;

  const todayStr = new Date().toISOString().split('T')[0];
  const overdueCount = currentlyBorrowed.filter(t => t.dueDate < todayStr).length;
  const currentFine = myTransactions.reduce((sum, t) => sum + (t.fine || 0), 0);

  // Recommendations preview (Top 3)
  const topRecommendations = getBookRecommendations(studentMemberId, books, transactions).slice(0, 3);

  return (
    <div className="space-y-6 text-zinc-950 dark:text-zinc-50">
      {/* Welcome Banner */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-200 font-bold text-xs mb-3">
            <GraduationCap className="w-3.5 h-3.5 text-white" /> Student Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {currentUser?.name || 'Student'}!
          </h1>
          <p className="text-zinc-400 text-sm mt-1.5 max-w-xl font-medium">
            Track your active loans, search technical library titles, check overdue status, or chat with your Library Assistant.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Link
            to="/student/assistant"
            className="px-4 py-2.5 bg-white text-black font-extrabold text-sm rounded-xl transition-all shadow-md flex items-center gap-2 active:scale-95 hover:bg-zinc-200"
          >
            <Bot className="w-4 h-4" /> 🤖 Library Assistant
          </Link>
          <Link
            to="/student/books"
            className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-sm rounded-xl border border-zinc-700 transition-all flex items-center gap-2 active:scale-95"
          >
            <BookOpen className="w-4 h-4" /> Browse Catalog
          </Link>
        </div>
      </div>

      {/* Stats Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">Currently Borrowed</span>
            <div className="text-2xl font-extrabold text-zinc-900 dark:text-white">{currentlyBorrowed.length} / 5</div>
          </div>
          <div className="p-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-2xl">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">Books Returned</span>
            <div className="text-2xl font-extrabold text-zinc-900 dark:text-white">{booksReturned}</div>
          </div>
          <div className="p-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-2xl">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">Active Holds</span>
            <div className="text-2xl font-extrabold text-zinc-900 dark:text-white">{activeReservations}</div>
          </div>
          <div className="p-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-2xl">
            <Bookmark className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">Overdue Books</span>
            <div className={`text-2xl font-extrabold ${overdueCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-zinc-900 dark:text-white'}`}>
              {overdueCount}
            </div>
          </div>
          <div className="p-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-2xl">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">Current Fine</span>
            <div className={`text-2xl font-extrabold ${currentFine > 0 ? 'text-red-600 dark:text-red-400' : 'text-zinc-900 dark:text-white'}`}>
              ₹{currentFine}
            </div>
          </div>
          <div className="p-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-2xl">
            <IndianRupee className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Currently Borrowed Section */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
            Currently Borrowed Books ({currentlyBorrowed.length})
          </h3>
          <Link to="/student/my-books" className="text-xs font-bold text-zinc-900 dark:text-white hover:underline flex items-center gap-1">
            Manage My Books <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {currentlyBorrowed.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950 p-6 rounded-2xl text-center">
            You do not have any active book checkouts. Browse the catalog to borrow titles!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentlyBorrowed.map(t => {
              const book = books.find(b => b.id === t.bookId);
              const daysLeft = getDaysRemaining(t.dueDate);
              return (
                <div key={t.id} className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-zinc-900 dark:text-white text-sm line-clamp-1">{book ? book.title : t.bookId}</h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">by {book?.author}</p>
                    </div>

                    {daysLeft < 0 ? (
                      <span className="px-2.5 py-0.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black text-[10px] font-bold rounded-lg shrink-0">
                        Overdue ({Math.abs(daysLeft)}d)
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-[10px] font-bold rounded-lg shrink-0">
                        Due in {daysLeft} days
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                    <span>Issued: {formatDate(t.issueDate)}</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">Due: {formatDate(t.dueDate)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recommended For You Section Widget */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
            ✨ Recommended For You
          </h3>
          <Link to="/student/recommendations" className="text-xs font-bold text-zinc-900 dark:text-white hover:underline flex items-center gap-1">
            See All Recommendations <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {topRecommendations.map(rec => (
            <div key={rec.book.id} className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                    {rec.book.category}
                  </span>
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 bg-black dark:bg-white text-white dark:text-black rounded-full">
                    {rec.score}% Match
                  </span>
                </div>
                <h4 className="font-bold text-zinc-900 dark:text-white text-sm line-clamp-2">{rec.book.title}</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">by {rec.book.author}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                💡 {rec.matchReasons[0]}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

const StudentPage = () => {
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

        <main className="flex-1 min-w-0 p-3 sm:p-6 lg:p-8 w-full transition-all pb-12">
          <Routes>
            <Route path="/" element={<StudentDashboardOverview />} />
            <Route path="/books" element={<BookList isAdmin={false} />} />
            <Route path="/my-books" element={<StudentMyBooksView />} />
            <Route path="/reservations" element={<ReservationList isAdmin={false} />} />
            <Route path="/recommendations" element={<Recommendation />} />
            <Route path="/assistant" element={<LibraryAssistant />} />
            <Route path="/profile" element={<StudentProfileView />} />
            <Route path="/card" element={<StudentCardView />} />
            <Route path="/notifications" element={<NotificationsView />} />
          </Routes>
        </main>
      </div>
      <FloatingNavbar />
    </div>
  );
};

export default StudentPage;
