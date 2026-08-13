import React from 'react';
import { useApp } from '../../context/AppContext';
import { User, Mail, Phone, GraduationCap, Calendar, ShieldCheck, BookOpen, AlertCircle } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

const MemberDetails = ({ member }) => {
  const { transactions, books } = useApp();

  if (!member) return null;

  // Find all transactions for this member
  const memberTransactions = transactions.filter(t => t.memberId === member.memberId);
  const activeTransactions = memberTransactions.filter(t => t.status === 'issued');
  const totalFine = memberTransactions.reduce((acc, t) => acc + (t.fine || 0), 0);

  return (
    <div className="space-y-6">
      {/* Member Profile Header */}
      <div className="flex items-center gap-4 pb-5 border-b border-slate-800">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-500/20">
          {member.name.charAt(0)}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-white">{member.name}</h3>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
              member.status === 'active'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}>
              {member.status}
            </span>
          </div>
          <p className="text-sm font-mono text-indigo-400 font-semibold mt-0.5">ID: {member.memberId}</p>
        </div>
      </div>

      {/* Info Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-xl border border-slate-800">
          <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Email Address</div>
            <div className="font-semibold text-slate-200">{member.email}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-xl border border-slate-800">
          <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Phone</div>
            <div className="font-semibold text-slate-200">{member.phone || 'N/A'}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-xl border border-slate-800">
          <GraduationCap className="w-4 h-4 text-indigo-400 shrink-0" />
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Department</div>
            <div className="font-semibold text-slate-200">{member.department}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-xl border border-slate-800">
          <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Join Date</div>
            <div className="font-semibold text-slate-200">{formatDate(member.joinDate)}</div>
          </div>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-3 gap-3 p-4 bg-slate-950/60 border border-slate-800 rounded-2xl text-center">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">Active Loans</span>
          <span className="text-xl font-bold text-indigo-400">{activeTransactions.length} / 5</span>
        </div>
        <div className="border-x border-slate-800">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">Total Borrowed</span>
          <span className="text-xl font-bold text-white">{memberTransactions.length}</span>
        </div>
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">Total Fines</span>
          <span className={`text-xl font-bold ${totalFine > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
            ₹{totalFine}
          </span>
        </div>
      </div>

      {/* Borrowing History Table */}
      <div>
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          Borrowing History & Transactions
        </h4>

        {memberTransactions.length === 0 ? (
          <p className="text-sm text-slate-400 bg-slate-800/30 p-4 rounded-xl text-center">
            No transaction records for this member yet.
          </p>
        ) : (
          <div className="overflow-x-auto custom-scrollbar border border-slate-800 rounded-xl bg-slate-900/60">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-300 font-semibold uppercase">
                <tr>
                  <th className="p-3">Book Title</th>
                  <th className="p-3">Issue Date</th>
                  <th className="p-3">Due Date</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Fine</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {memberTransactions.map(t => {
                  const book = books.find(b => b.id === t.bookId);
                  return (
                    <tr key={t.id} className="hover:bg-slate-800/30">
                      <td className="p-3 font-semibold text-white">{book ? book.title : t.bookId}</td>
                      <td className="p-3">{formatDate(t.issueDate)}</td>
                      <td className="p-3">{formatDate(t.dueDate)}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                          t.status === 'issued'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono font-semibold text-amber-400">
                        {t.fine > 0 ? `₹${t.fine}` : '₹0'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberDetails;
