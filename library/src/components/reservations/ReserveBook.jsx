import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bookmark, AlertCircle } from 'lucide-react';

const ReserveBook = ({ book, onConfirm, onCancel }) => {
  const { currentUser } = useApp();

  if (!book) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-300 text-sm">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <p>
          All copies of <strong>"{book.title}"</strong> are currently borrowed. Placing a reservation queues your request for the next available return.
        </p>
      </div>

      <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-300">
        <div className="flex justify-between">
          <span className="text-slate-400">Book Title:</span>
          <span className="font-semibold text-white">{book.title}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Author:</span>
          <span>{book.author}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Student ID:</span>
          <span className="font-mono text-indigo-400">{currentUser?.memberId}</span>
        </div>
      </div>

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
          onClick={() => onConfirm(book.id)}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20 active:scale-95 flex items-center gap-2"
        >
          <Bookmark className="w-4 h-4" /> Place Reservation
        </button>
      </div>
    </div>
  );
};

export default ReserveBook;
