import React from 'react';
import { useApp } from '../../context/AppContext';
import EmptyState from '../common/EmptyState';
import { Bookmark, CheckCircle, Clock, XCircle, Trash2 } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

const ReservationList = ({ isAdmin = false }) => {
  const { reservations, books, members, currentUser, cancelReservation } = useApp();

  // Filter reservations based on role
  const displayReservations = isAdmin
    ? reservations
    : reservations.filter(r => currentUser && r.memberId === currentUser.memberId);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'fulfilled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="w-3 h-3" /> Ready / Fulfilled
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
            <XCircle className="w-3 h-3" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
            <Clock className="w-3 h-3" /> Pending Queue
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Bookmark className="w-6 h-6 text-indigo-400" />
          {isAdmin ? 'Library Reservation Queue' : 'My Book Reservations'}
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          {isAdmin
            ? 'Track student holds on checked-out books and notify when copies become available.'
            : 'View active holds on unavailable books. You will receive notifications when ready for pickup.'}
        </p>
      </div>

      {displayReservations.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No reservations found"
          description={
            isAdmin
              ? 'There are currently no active book holds or reservations.'
              : 'You have not reserved any books yet. Browse the catalog to hold unavailable titles.'
          }
        />
      ) : (
        <div className="overflow-hidden bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-800/80 text-slate-300 text-xs font-semibold uppercase tracking-wider border-b border-slate-700/60">
                  <th className="py-3.5 px-4">Reservation ID</th>
                  {isAdmin && <th className="py-3.5 px-4">Student Member</th>}
                  <th className="py-3.5 px-4">Book Title</th>
                  <th className="py-3.5 px-4">Reserved Date</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {displayReservations.map(res => {
                  const book = books.find(b => b.id === res.bookId);
                  const member = members.find(m => m.memberId === res.memberId);

                  return (
                    <tr key={res.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-xs font-bold text-indigo-400">{res.id}</td>
                      {isAdmin && (
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-white">{member ? member.name : res.memberId}</div>
                          <div className="text-xs text-slate-400 font-mono">{res.memberId}</div>
                        </td>
                      )}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-200">{book ? book.title : res.bookId}</div>
                        <div className="text-xs text-slate-400">{book?.category}</div>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-300">{formatDate(res.reservationDate)}</td>
                      <td className="py-3.5 px-4 text-center">{getStatusBadge(res.status)}</td>
                      <td className="py-3.5 px-4 text-right">
                        {res.status === 'pending' && (
                          <button
                            onClick={() => cancelReservation(res.id)}
                            className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ml-auto"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Cancel
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
      )}
    </div>
  );
};

export default ReservationList;
