import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  BookOpen,
  Calendar,
  Clock,
  CheckCircle,
  QrCode,
  Laptop,
  Truck,
  Building,
  ShieldCheck,
  ArrowRight,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

const BorrowOptionsModal = ({ book, onConfirmBorrow, onCancel }) => {
  const { currentUser, issueBook } = useApp();

  const [durationDays, setDurationDays] = useState(14);
  const [fulfillmentMode, setFulfillmentMode] = useState('pickup'); // 'pickup', 'ebook', 'delivery'
  const [claimReceipt, setClaimReceipt] = useState(null);

  if (!book) return null;

  const today = new Date();
  const dueDate = new Date(today.getTime() + durationDays * 24 * 60 * 60 * 1000);
  const dueDateStr = dueDate.toISOString().split('T')[0];

  const handleProcessBorrow = () => {
    if (!currentUser || !currentUser.memberId) {
      toast.error('Student member account required');
      return;
    }

    const result = issueBook({
      memberId: currentUser.memberId,
      bookId: book.id,
      issueDate: today.toISOString().split('T')[0],
      dueDate: dueDateStr
    });

    if (result.success) {
      const ticketId = `PASS-${Date.now().toString().slice(-6)}`;
      setClaimReceipt({
        ticketId,
        book,
        durationDays,
        dueDateStr,
        fulfillmentMode,
        transaction: result.transaction
      });
      if (onConfirmBorrow) onConfirmBorrow(result.transaction, fulfillmentMode);
    }
  };

  return (
    <div className="space-y-6">
      {!claimReceipt ? (
        <>
          {/* Header Summary */}
          <div className="flex items-start gap-4 p-4 bg-slate-950/80 border border-slate-800 rounded-2xl">
            <div className="w-12 h-12 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-xl flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                {book.category}
              </span>
              <h3 className="text-base font-bold text-white leading-snug">{book.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">by {book.author} (ISBN: {book.isbn})</p>
            </div>
          </div>

          {/* Option 1: Select Borrow Loan Duration */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-400" />
              1. Select Borrow Loan Duration
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setDurationDays(7)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  durationDays === 7
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-600/10'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="text-sm font-bold text-indigo-400">7 Days</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Express Loan</div>
                <div className="text-[10px] text-slate-500 mt-1">Quick exam reference</div>
              </button>

              <button
                type="button"
                onClick={() => setDurationDays(14)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  durationDays === 14
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-600/10'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                  14 Days <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-full font-normal">Default</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Standard Academic</div>
                <div className="text-[10px] text-slate-500 mt-1">Standard checkout</div>
              </button>

              <button
                type="button"
                onClick={() => setDurationDays(30)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  durationDays === 30
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-600/10'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="text-sm font-bold text-amber-400">30 Days</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Extended Project</div>
                <div className="text-[10px] text-slate-500 mt-1">Research & thesis</div>
              </button>
            </div>
          </div>

          {/* Option 2: Select Fulfillment / Reading Format */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Laptop className="w-4 h-4 text-indigo-400" />
              2. Select Reading / Fulfillment Option
            </label>
            <div className="space-y-2">
              {/* Option A: Counter Pickup */}
              <div
                onClick={() => setFulfillmentMode('pickup')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                  fulfillmentMode === 'pickup'
                    ? 'bg-slate-900 border-indigo-500 ring-1 ring-indigo-500/50'
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Physical Counter Pickup</h4>
                    <p className="text-xs text-slate-400">Instant Digital Claim Ticket generated for circulation desk pickup</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="fulfillment"
                  checked={fulfillmentMode === 'pickup'}
                  onChange={() => setFulfillmentMode('pickup')}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 bg-slate-800 border-slate-700"
                />
              </div>

              {/* Option B: Instant E-Book Access */}
              <div
                onClick={() => setFulfillmentMode('ebook')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                  fulfillmentMode === 'ebook'
                    ? 'bg-slate-900 border-indigo-500 ring-1 ring-indigo-500/50'
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-600/20 text-emerald-400 rounded-xl">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      Instant E-Book Reading Preview
                      <span className="px-2 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-400 rounded-full font-bold">
                        Digital E-Reader
                      </span>
                    </h4>
                    <p className="text-xs text-slate-400">Read chapters instantly online via embedded digital viewer</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="fulfillment"
                  checked={fulfillmentMode === 'ebook'}
                  onChange={() => setFulfillmentMode('ebook')}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 bg-slate-800 border-slate-700"
                />
              </div>

              {/* Option C: Campus Doorstep Delivery */}
              <div
                onClick={() => setFulfillmentMode('delivery')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                  fulfillmentMode === 'delivery'
                    ? 'bg-slate-900 border-indigo-500 ring-1 ring-indigo-500/50'
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-600/20 text-amber-400 rounded-xl">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Campus Hostel Desk Delivery</h4>
                    <p className="text-xs text-slate-400">Deliver to student hostel or department desk within 24 hours</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="fulfillment"
                  checked={fulfillmentMode === 'delivery'}
                  onChange={() => setFulfillmentMode('delivery')}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 bg-slate-800 border-slate-700"
                />
              </div>
            </div>
          </div>

          {/* Borrow Summary Callout */}
          <div className="p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl text-xs space-y-1.5">
            <div className="flex justify-between text-slate-300">
              <span>Issue Date:</span>
              <span className="font-semibold text-white">{today.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Return Due Date:</span>
              <span className="font-bold text-emerald-400">{dueDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })} ({durationDays} days)</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Overdue Policy:</span>
              <span className="text-amber-400">₹10 per overdue day</span>
            </div>
          </div>

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
              onClick={handleProcessBorrow}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 active:scale-95"
            >
              <CheckCircle className="w-4 h-4" /> Confirm & Issue Book
            </button>
          </div>
        </>
      ) : (
        /* Instant Digital Claim Ticket View */
        <div className="space-y-5 text-center py-2">
          <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-white">Borrow Checkout Confirmed!</h3>
            <p className="text-xs text-slate-400 mt-1">
              Your borrowing transaction has been logged and added to your active loans.
            </p>
          </div>

          {/* Ticket Receipt Box */}
          <div className="p-5 bg-slate-950 border-2 border-dashed border-indigo-500/40 rounded-3xl text-left space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Transaction Pass ID</span>
                <div className="text-base font-extrabold font-mono text-indigo-400">{claimReceipt.ticketId}</div>
              </div>
              <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-lg flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Active Loan
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Book Title:</span>
                <span className="font-bold text-white truncate max-w-[200px]">{book.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Member ID:</span>
                <span className="font-mono font-semibold text-slate-200">{currentUser?.memberId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Due Date:</span>
                <span className="font-bold text-emerald-400">{claimReceipt.dueDateStr} ({claimReceipt.durationDays} Days)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Fulfillment Mode:</span>
                <span className="font-semibold text-indigo-300 capitalize">{claimReceipt.fulfillmentMode}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-3">
            <button
              onClick={onCancel}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20"
            >
              Done & View My Loans
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowOptionsModal;
