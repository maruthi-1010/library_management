import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import toast from 'react-hot-toast';

const IssueBookForm = ({ onSubmit, onCancel, preselectedMemberId, preselectedBookId }) => {
  const { members, books, transactions } = useApp();

  // Filter members (active members only)
  const activeMembers = members.filter(m => m.status === 'active');

  // Filter books with availableCopies > 0
  const availableBooks = books.filter(b => b.availableCopies > 0);

  const todayStr = new Date().toISOString().split('T')[0];
  const defaultDueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    memberId: preselectedMemberId || (activeMembers.length > 0 ? activeMembers[0].memberId : ''),
    bookId: preselectedBookId || (availableBooks.length > 0 ? availableBooks[0].id : ''),
    issueDate: todayStr,
    dueDate: defaultDueDate
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.memberId) {
      toast.error('Please select a member');
      return;
    }
    if (!formData.bookId) {
      toast.error('Please select a book');
      return;
    }
    if (!formData.issueDate || !formData.dueDate) {
      toast.error('Issue date and Due date are required');
      return;
    }

    onSubmit(formData);
  };

  // Compute selected member's current active loan count
  const selectedMemberTxns = transactions.filter(
    t => t.memberId === formData.memberId && t.status === 'issued'
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Select Member */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
          Select Student Member *
        </label>
        {activeMembers.length === 0 ? (
          <p className="text-xs text-rose-400">No active members found.</p>
        ) : (
          <select
            name="memberId"
            value={formData.memberId}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            required
          >
            {activeMembers.map(m => (
              <option key={m.memberId} value={m.memberId}>
                {m.name} ({m.memberId}) — {m.department}
              </option>
            ))}
          </select>
        )}
        {formData.memberId && (
          <p className="text-[11px] text-slate-400 mt-1">
            Current active loans: <span className="font-semibold text-indigo-400">{selectedMemberTxns.length} / 5</span>
          </p>
        )}
      </div>

      {/* Select Book */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
          Select Book to Issue *
        </label>
        {availableBooks.length === 0 ? (
          <p className="text-xs text-rose-400">No books currently available for issue.</p>
        ) : (
          <select
            name="bookId"
            value={formData.bookId}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            required
          >
            {availableBooks.map(b => (
              <option key={b.id} value={b.id}>
                {b.title} (Available: {b.availableCopies}/{b.totalCopies})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Issue Date & Due Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Issue Date *
          </label>
          <input
            type="date"
            name="issueDate"
            value={formData.issueDate}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Due Date (Default: 14 Days) *
          </label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            required
          />
        </div>
      </div>

      {/* Info Callout */}
      <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-indigo-300 space-y-1">
        <p className="font-semibold">Transaction Rule Summary:</p>
        <ul className="list-disc pl-4 space-y-0.5 text-slate-300">
          <li>Standard loan duration is 14 days. Overdue fine is ₹10 per day.</li>
          <li>Student limit: Maximum 5 active books simultaneously.</li>
        </ul>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={activeMembers.length === 0 || availableBooks.length === 0}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
        >
          Confirm Issue Book
        </button>
      </div>
    </form>
  );
};

export default IssueBookForm;
