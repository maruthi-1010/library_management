import React from 'react';
import { BookOpen, User, Tag, Calendar, Building, Hash, CheckCircle, AlertCircle, XCircle, Bookmark, ArrowRightLeft, Laptop } from 'lucide-react';

const BookDetails = ({ book, onReserve, onBorrow, onReadEBook, isAdmin = false, isReserved = false }) => {
  if (!book) return null;

  const issuedCopies = book.totalCopies - book.availableCopies;
  const isAvailable = book.availableCopies > 0;
  const isLimited = book.availableCopies > 0 && book.availableCopies <= 2;

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex gap-4">
          {book.coverImage && (
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-20 h-28 object-cover rounded-xl border border-slate-700 shadow-md shrink-0"
            />
          )}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold rounded-lg flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                {book.category}
              </span>
              <span className="text-xs text-slate-400 font-medium">ID: {book.id}</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight leading-snug">{book.title}</h2>
            <div className="flex items-center gap-2 text-slate-300 text-sm mt-1">
              <User className="w-4 h-4 text-indigo-400" />
              <span>{book.author}</span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="shrink-0">
          {isAvailable ? (
            <div className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 ${
              isLimited
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
            }`}>
              {isLimited ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
              <span>{isLimited ? 'Limited Availability' : 'Available'}</span>
            </div>
          ) : (
            <div className="px-4 py-2 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-xl text-sm font-semibold flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              <span>Unavailable</span>
            </div>
          )}
        </div>
      </div>

      {/* Copy Availability Metrics Grid */}
      <div className="grid grid-cols-3 gap-3 p-4 bg-slate-950/60 border border-slate-800 rounded-2xl text-center">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">Total Copies</span>
          <span className="text-xl font-bold text-white">{book.totalCopies}</span>
        </div>
        <div className="border-x border-slate-800">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">Available</span>
          <span className={`text-xl font-bold ${book.availableCopies > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {book.availableCopies}
          </span>
        </div>
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">Issued</span>
          <span className="text-xl font-bold text-indigo-400">{issuedCopies}</span>
        </div>
      </div>

      {/* Metadata Attributes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-xl border border-slate-800">
          <Hash className="w-4 h-4 text-indigo-400 shrink-0" />
          <div>
            <div className="text-[11px] text-slate-500 font-medium">ISBN Number</div>
            <div className="font-semibold text-slate-200">{book.isbn}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-xl border border-slate-800">
          <Building className="w-4 h-4 text-indigo-400 shrink-0" />
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Publisher</div>
            <div className="font-semibold text-slate-200">{book.publisher || 'N/A'}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-xl border border-slate-800">
          <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Publication Year</div>
            <div className="font-semibold text-slate-200">{book.year}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-xl border border-slate-800">
          <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Category</div>
            <div className="font-semibold text-slate-200">{book.category}</div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Book Description</h4>
        <p className="text-slate-300 text-sm leading-relaxed bg-slate-800/30 p-4 rounded-xl border border-slate-800/80">
          {book.description || 'No description provided for this book.'}
        </p>
      </div>

      {/* Student Actions Bar */}
      {!isAdmin && (
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          {isAvailable ? (
            <div className="flex items-center justify-between w-full flex-wrap gap-2">
              <div className="text-xs font-medium text-emerald-400 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Book is in stock for student checkout.</span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onReadEBook(book)}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <Laptop className="w-4 h-4" /> Read E-Book
                </button>
                <button
                  onClick={() => onBorrow(book)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                >
                  <ArrowRightLeft className="w-4 h-4" /> Borrow Options
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-rose-400 font-medium">
                All copies currently checked out.
              </span>
              <button
                onClick={() => onReserve(book.id)}
                disabled={isReserved}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  isReserved
                    ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 active:scale-95'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                {isReserved ? 'Reservation Placed' : 'Reserve Book'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookDetails;
