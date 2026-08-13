import React, { useState, useMemo } from 'react';
import SearchBar from '../common/SearchBar';
import IssueBookForm from './IssueBookForm';
import ReturnBook from './ReturnBook';
import Modal from '../common/Modal';
import EmptyState from '../common/EmptyState';
import { useApp } from '../../context/AppContext';
import { ArrowRightLeft, Plus, CheckCircle, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import { formatDate, isOverdue } from '../../utils/dateUtils';

const TransactionList = () => {
  const { transactions, books, members, issueBook, returnBook } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [returningTxn, setReturningTxn] = useState(null);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(txn => {
      const book = books.find(b => b.id === txn.bookId);
      const member = members.find(m => m.memberId === txn.memberId);

      const term = searchTerm.toLowerCase();
      const matchesSearch =
        txn.id.toLowerCase().includes(term) ||
        txn.memberId.toLowerCase().includes(term) ||
        (member && member.name.toLowerCase().includes(term)) ||
        (book && book.title.toLowerCase().includes(term)) ||
        (book && book.isbn.toLowerCase().includes(term));

      let matchesStatus = true;
      if (statusFilter === 'ISSUED') {
        matchesStatus = txn.status === 'issued';
      } else if (statusFilter === 'RETURNED') {
        matchesStatus = txn.status === 'returned';
      } else if (statusFilter === 'OVERDUE') {
        matchesStatus = txn.status === 'issued' && isOverdue(txn.dueDate);
      }

      return matchesSearch && matchesStatus;
    });
  }, [transactions, books, members, searchTerm, statusFilter]);

  const handleIssueSubmit = (formData) => {
    const result = issueBook(formData);
    if (result.success) {
      setIsIssueModalOpen(false);
    }
  };

  const handleReturnConfirm = (txnId) => {
    returnBook(txnId);
    setReturningTxn(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <ArrowRightLeft className="w-6 h-6 text-indigo-400" />
            Book Issue & Return Transactions
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Issue books to students, process book returns, calculate overdue fines, and track transaction logs.
          </p>
        </div>

        <button
          onClick={() => setIsIssueModalOpen(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/25 flex items-center gap-2 shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Issue New Book
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="space-y-4">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Search by Member Name, Member ID, Book Title, or ISBN..."
        />

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-900/60 p-2 border border-slate-800 rounded-2xl">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === 'ALL'
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All ({transactions.length})
          </button>
          <button
            onClick={() => setStatusFilter('ISSUED')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === 'ISSUED'
                ? 'bg-amber-600 text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Currently Issued ({transactions.filter(t => t.status === 'issued').length})
          </button>
          <button
            onClick={() => setStatusFilter('OVERDUE')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === 'OVERDUE'
                ? 'bg-rose-600 text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Overdue ({transactions.filter(t => t.status === 'issued' && isOverdue(t.dueDate)).length})
          </button>
          <button
            onClick={() => setStatusFilter('RETURNED')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === 'RETURNED'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Returned ({transactions.filter(t => t.status === 'returned').length})
          </button>
        </div>
      </div>

      {/* Transactions Table / List */}
      {filteredTransactions.length === 0 ? (
        <EmptyState
          icon={ArrowRightLeft}
          title="No transactions found"
          description="There are no transaction records matching your query."
          actionLabel="Issue Book"
          onAction={() => setIsIssueModalOpen(true)}
        />
      ) : (
        <div className="overflow-hidden bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-800/80 text-slate-300 text-xs font-semibold uppercase tracking-wider border-b border-slate-700/60">
                  <th className="py-3.5 px-4">Txn ID</th>
                  <th className="py-3.5 px-4">Member</th>
                  <th className="py-3.5 px-4">Book Title</th>
                  <th className="py-3.5 px-4">Issue Date</th>
                  <th className="py-3.5 px-4">Due Date</th>
                  <th className="py-3.5 px-4">Return Date</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Fine</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredTransactions.map(txn => {
                  const book = books.find(b => b.id === txn.bookId);
                  const member = members.find(m => m.memberId === txn.memberId);
                  const isLate = txn.status === 'issued' && isOverdue(txn.dueDate);

                  return (
                    <tr key={txn.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-xs font-bold text-indigo-400">{txn.id}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{member ? member.name : txn.memberId}</div>
                        <div className="text-xs text-slate-400 font-mono">{txn.memberId}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-200 line-clamp-1">{book ? book.title : txn.bookId}</div>
                        <div className="text-xs text-slate-500 font-mono">{book?.isbn}</div>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-300">{formatDate(txn.issueDate)}</td>
                      <td className="py-3.5 px-4 text-xs text-slate-300">{formatDate(txn.dueDate)}</td>
                      <td className="py-3.5 px-4 text-xs text-slate-400">
                        {txn.returnDate ? formatDate(txn.returnDate) : '-'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {txn.status === 'returned' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle className="w-3 h-3" /> Returned
                          </span>
                        ) : isLate ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse">
                            <AlertTriangle className="w-3 h-3" /> Overdue
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <Clock className="w-3 h-3" /> Issued
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold">
                        <span className={txn.fine > 0 ? 'text-rose-400' : 'text-slate-400'}>
                          ₹{txn.fine}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {txn.status === 'issued' && (
                          <button
                            onClick={() => setReturningTxn(txn)}
                            className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ml-auto"
                          >
                            <RefreshCw className="w-3.5 h-3.5" /> Return
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

      {/* Issue Book Modal */}
      <Modal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        title="Issue Book to Member"
      >
        <IssueBookForm
          onSubmit={handleIssueSubmit}
          onCancel={() => setIsIssueModalOpen(false)}
        />
      </Modal>

      {/* Return Book Modal */}
      <Modal
        isOpen={!!returningTxn}
        onClose={() => setReturningTxn(null)}
        title="Process Book Return"
      >
        <ReturnBook
          transaction={returningTxn}
          onConfirm={handleReturnConfirm}
          onCancel={() => setReturningTxn(null)}
        />
      </Modal>
    </div>
  );
};

export default TransactionList;
