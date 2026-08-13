import React from 'react';
import { useApp } from '../../context/AppContext';
import { calculateFine } from '../../utils/fineCalculator';
import { formatDate } from '../../utils/dateUtils';
import { CheckCircle, AlertTriangle, ArrowRightLeft } from 'lucide-react';

const ReturnBook = ({ transaction, onConfirm, onCancel }) => {
  const { books, members } = useApp();

  if (!transaction) return null;

  const book = books.find(b => b.id === transaction.bookId);
  const member = members.find(m => m.memberId === transaction.memberId);
  const returnDateStr = new Date().toISOString().split('T')[0];
  const fineInfo = calculateFine(transaction.dueDate, returnDateStr);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
        <ArrowRightLeft className="w-5 h-5 text-indigo-400 shrink-0" />
        <div>
          <div className="text-xs text-slate-400 font-medium">Transaction ID</div>
          <div className="text-sm font-bold text-white font-mono">{transaction.id}</div>
        </div>
      </div>

      {/* Book & Member Info */}
      <div className="space-y-2 text-sm bg-slate-950/60 p-4 rounded-xl border border-slate-800">
        <div className="flex justify-between py-1 border-b border-slate-800/60">
          <span className="text-slate-400">Book Title:</span>
          <span className="font-semibold text-white text-right">{book ? book.title : transaction.bookId}</span>
        </div>
        <div className="flex justify-between py-1 border-b border-slate-800/60">
          <span className="text-slate-400">Member:</span>
          <span className="font-semibold text-slate-200">{member ? member.name : transaction.memberId} ({transaction.memberId})</span>
        </div>
        <div className="flex justify-between py-1 border-b border-slate-800/60">
          <span className="text-slate-400">Issue Date:</span>
          <span className="text-slate-300">{formatDate(transaction.issueDate)}</span>
        </div>
        <div className="flex justify-between py-1 border-b border-slate-800/60">
          <span className="text-slate-400">Due Date:</span>
          <span className="text-slate-300">{formatDate(transaction.dueDate)}</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-slate-400">Return Date (Today):</span>
          <span className="text-slate-200 font-medium">{formatDate(returnDateStr)}</span>
        </div>
      </div>

      {/* Fine Summary Box */}
      {fineInfo.isOverdue ? (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl space-y-2 text-rose-300">
          <div className="flex items-center gap-2 font-bold text-base text-rose-400">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>Overdue Notice ({fineInfo.overdueDays} days late)</span>
          </div>
          <p className="text-xs leading-relaxed">
            This book is overdue by {fineInfo.overdueDays} day(s). Fine charged at ₹10 per overdue day.
          </p>
          <div className="flex items-center justify-between pt-2 border-t border-rose-500/20 text-sm">
            <span>Calculated Fine:</span>
            <span className="text-lg font-extrabold text-rose-400 font-mono">₹{fineInfo.fine}</span>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between text-emerald-300">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span>Returned On-Time</span>
          </div>
          <span className="text-lg font-bold text-emerald-400 font-mono">₹0 Fine</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onConfirm(transaction.id)}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
        >
          Confirm Return & Process Fine
        </button>
      </div>
    </div>
  );
};

export default ReturnBook;
