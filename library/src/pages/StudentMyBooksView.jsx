import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import EmptyState from '../components/common/EmptyState';
import { BookOpen, ArrowRightLeft, Clock, AlertTriangle, CheckCircle, Bookmark } from 'lucide-react';
import { formatDate, getDaysRemaining, isOverdue } from '../utils/dateUtils';

const StudentMyBooksView = () => {
  const { currentUser, transactions, books, reservations, cancelReservation } = useApp();
  const [activeTab, setActiveTab] = useState('currently_borrowed');

  const studentMemberId = currentUser?.memberId;

  // Student transactions
  const myTransactions = transactions.filter(t => t.memberId === studentMemberId);
  const currentlyBorrowed = myTransactions.filter(t => t.status === 'issued');
  const borrowingHistory = myTransactions.filter(t => t.status === 'returned');

  // Student reservations
  const myReservations = reservations.filter(r => r.memberId === studentMemberId);

  const getDueBadge = (dueDateStr) => {
    const days = getDaysRemaining(dueDateStr);
    if (days < 0) {
      return (
        <span className="px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold flex items-center gap-1 animate-pulse">
          <AlertTriangle className="w-3.5 h-3.5" /> OVERDUE ({Math.abs(days)} days late)
        </span>
      );
    } else if (days === 0) {
      return (
        <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" /> Due Today!
        </span>
      );
    } else if (days === 1) {
      return (
        <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" /> Due Tomorrow
        </span>
      );
    } else {
      return (
        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center gap-1">
          <CheckCircle className="w-3.5 h-3.5" /> Due in {days} days
        </span>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <ArrowRightLeft className="w-6 h-6 text-indigo-400" />
          My Borrowed Books & Holds
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage your active checked-out titles, track return due dates, view checkout history, and manage reservations.
        </p>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('currently_borrowed')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'currently_borrowed'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Clock className="w-4 h-4" />
          Currently Borrowed ({currentlyBorrowed.length})
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'history'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Borrowing History ({borrowingHistory.length})
        </button>

        <button
          onClick={() => setActiveTab('reservations')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'reservations'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          My Reservations ({myReservations.length})
        </button>
      </div>

      {/* TAB 1: CURRENTLY BORROWED */}
      {activeTab === 'currently_borrowed' && (
        currentlyBorrowed.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No active loans"
            description="You do not have any books currently checked out from the library."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentlyBorrowed.map(t => {
              const book = books.find(b => b.id === t.bookId);
              return (
                <div key={t.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="px-2.5 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold rounded-lg uppercase">
                        {book?.category}
                      </span>
                      <h3 className="text-base font-bold text-white mt-1.5 leading-snug">
                        {book ? book.title : t.bookId}
                      </h3>
                      <p className="text-xs text-slate-400">by {book?.author}</p>
                    </div>

                    {getDueBadge(t.dueDate)}
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-500 block">Issue Date</span>
                      <span className="font-semibold text-slate-200">{formatDate(t.issueDate)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Due Date</span>
                      <span className="font-semibold text-slate-200">{formatDate(t.dueDate)}</span>
                    </div>
                  </div>

                  {t.fine > 0 && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center justify-between text-xs text-rose-300">
                      <span className="font-semibold">Current Accumulated Fine:</span>
                      <span className="font-extrabold text-sm text-rose-400 font-mono">₹{t.fine}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      )}

      {/* TAB 2: BORROWING HISTORY */}
      {activeTab === 'history' && (
        borrowingHistory.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No past transactions"
            description="You have not returned any books yet."
          />
        ) : (
          <div className="overflow-hidden bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-800/80 text-slate-300 text-xs font-semibold uppercase border-b border-slate-700/60">
                    <th className="p-3.5">Book Title</th>
                    <th className="p-3.5">Issue Date</th>
                    <th className="p-3.5">Return Date</th>
                    <th className="p-3.5 text-center">Status</th>
                    <th className="p-3.5 text-right">Fine Assessed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {borrowingHistory.map(t => {
                    const book = books.find(b => b.id === t.bookId);
                    return (
                      <tr key={t.id} className="hover:bg-slate-800/40">
                        <td className="p-3.5 font-semibold text-white">{book ? book.title : t.bookId}</td>
                        <td className="p-3.5 text-xs text-slate-400">{formatDate(t.issueDate)}</td>
                        <td className="p-3.5 text-xs text-slate-400">{formatDate(t.returnDate)}</td>
                        <td className="p-3.5 text-center">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Returned
                          </span>
                        </td>
                        <td className="p-3.5 text-right font-mono font-bold text-amber-400">
                          ₹{t.fine || 0}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {/* TAB 3: RESERVATIONS */}
      {activeTab === 'reservations' && (
        myReservations.length === 0 ? (
          <EmptyState
            icon={Bookmark}
            title="No reservations"
            description="You have no pending or past book holds."
          />
        ) : (
          <div className="overflow-hidden bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-800/80 text-slate-300 text-xs font-semibold uppercase border-b border-slate-700/60">
                    <th className="p-3.5">Reservation ID</th>
                    <th className="p-3.5">Book Title</th>
                    <th className="p-3.5">Date Requested</th>
                    <th className="p-3.5 text-center">Status</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {myReservations.map(r => {
                    const book = books.find(b => b.id === r.bookId);
                    return (
                      <tr key={r.id} className="hover:bg-slate-800/40">
                        <td className="p-3.5 font-mono text-xs text-indigo-400 font-bold">{r.id}</td>
                        <td className="p-3.5 font-semibold text-white">{book ? book.title : r.bookId}</td>
                        <td className="p-3.5 text-xs text-slate-400">{formatDate(r.reservationDate)}</td>
                        <td className="p-3.5 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                            r.status === 'fulfilled'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : r.status === 'cancelled'
                              ? 'bg-slate-800 text-slate-400 border border-slate-700'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          {r.status === 'pending' && (
                            <button
                              onClick={() => cancelReservation(r.id)}
                              className="px-3 py-1 bg-rose-600/20 text-rose-400 border border-rose-500/30 rounded-lg text-xs hover:bg-rose-600 hover:text-white transition-all"
                            >
                              Cancel Hold
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

    </div>
  );
};

export default StudentMyBooksView;
