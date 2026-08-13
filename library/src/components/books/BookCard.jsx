import React from 'react';
import { BookOpen, User, Tag, CheckCircle, XCircle, AlertCircle, Eye, Bookmark, Edit, Trash2, ArrowRightLeft } from 'lucide-react';

// Book cover placeholder image mapping by category
const CATEGORY_COVERS = {
  "Programming": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=60",
  "Software Engineering": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop&q=60",
  "Machine Learning": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=60",
  "Artificial Intelligence": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60",
  "Database": "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=500&auto=format&fit=crop&q=60",
  "Computer Networks": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&auto=format&fit=crop&q=60",
  "Web Development": "https://images.unsplash.com/photo-1547658719-da2b51169166?w=500&auto=format&fit=crop&q=60",
  "Data Science": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop&q=60",
  "Cyber Security": "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&auto=format&fit=crop&q=60"
};

const DEFAULT_COVER = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60";

const CATEGORY_COLORS = {
  "Programming": "bg-indigo-600 text-white border-indigo-400",
  "Software Engineering": "bg-blue-600 text-white border-blue-400",
  "Machine Learning": "bg-purple-600 text-white border-purple-400",
  "Artificial Intelligence": "bg-fuchsia-600 text-white border-fuchsia-400",
  "Database": "bg-cyan-600 text-white border-cyan-400",
  "Computer Networks": "bg-teal-600 text-white border-teal-400",
  "Web Development": "bg-sky-600 text-white border-sky-400",
  "Data Science": "bg-emerald-600 text-white border-emerald-400",
  "Cyber Security": "bg-rose-600 text-white border-rose-400"
};

const BookCard = ({
  book,
  onView,
  onEdit,
  onDelete,
  onReserve,
  onBorrow,
  isAdmin = false,
  isReserved = false
}) => {
  const isAvailable = book.availableCopies > 0;
  const isLimited = book.availableCopies > 0 && book.availableCopies <= 2;
  const coverImage = book.coverImage || CATEGORY_COVERS[book.category] || DEFAULT_COVER;
  const categoryBadgeClass = CATEGORY_COLORS[book.category] || "bg-indigo-600 text-white border-indigo-400";

  return (
    <div className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 rounded-3xl overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 shadow-sm hover:shadow-2xl flex flex-col justify-between">
      {/* Book Cover Banner - FULL VIBRANT COLOR */}
      <div className="relative h-44 w-full overflow-hidden bg-zinc-950">
        <img
          src={coverImage}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

        {/* Top Badges overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
          <div className="flex items-center gap-1.5">
            <span className={`px-2.5 py-1 text-[10px] font-black rounded-lg uppercase tracking-wider border shadow-sm ${categoryBadgeClass}`}>
              {book.category}
            </span>
            {book.id && book.id.startsWith('B-') && (
              <span className="px-2 py-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white border border-purple-400 text-[9px] font-black rounded-md uppercase shadow-sm">
                Google API
              </span>
            )}
          </div>

          {/* Availability Status Badge */}
          {isAvailable ? (
            <span className={`px-2.5 py-1 text-[10px] font-black rounded-lg flex items-center gap-1 shadow-sm ${
              isLimited ? 'bg-amber-500 text-white border border-amber-400' : 'bg-emerald-600 text-white border border-emerald-400'
            }`}>
              <CheckCircle className="w-3 h-3" />
              {book.availableCopies} left
            </span>
          ) : (
            <span className="px-2.5 py-1 bg-rose-600 text-white border border-rose-400 text-[10px] font-black rounded-lg flex items-center gap-1 shadow-sm">
              <XCircle className="w-3 h-3" />
              Unavailable
            </span>
          )}
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-3 left-3 right-3 z-10">
          <h3
            onClick={() => onView(book)}
            className="text-base font-bold text-white group-hover:underline transition-all line-clamp-1 cursor-pointer tracking-tight"
          >
            {book.title}
          </h3>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 text-xs font-semibold mb-2">
            <User className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100 shrink-0" />
            <span className="truncate">{book.author}</span>
          </div>

          <p className="text-zinc-500 dark:text-zinc-400 text-xs line-clamp-2 leading-relaxed font-normal">
            {book.description}
          </p>
        </div>

        {/* Footer Info & Action Buttons */}
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2 mt-auto">
          <div className="text-[10px] text-zinc-400 font-mono">
            ISBN: <span className="font-semibold">{book.isbn.substring(0, 10)}...</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onView(book)}
              className="p-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl transition-all text-xs font-medium active:scale-90"
              title="View Book Details"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>

            {isAdmin ? (
              <>
                <button
                  onClick={() => onEdit(book)}
                  className="p-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 rounded-xl transition-all active:scale-90"
                  title="Edit Book"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDelete(book.id)}
                  className="p-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-red-500 hover:text-white text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 rounded-xl transition-all active:scale-90"
                  title="Delete Book"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              isAvailable ? (
                <button
                  onClick={() => onBorrow(book)}
                  className="px-3.5 py-1.5 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  Borrow Options
                </button>
              ) : (
                <button
                  onClick={() => onReserve(book.id)}
                  disabled={isReserved}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                    isReserved
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border border-zinc-200 dark:border-zinc-700 cursor-not-allowed'
                      : 'bg-black dark:bg-white text-white dark:text-black shadow-md active:scale-95'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  {isReserved ? 'Reserved' : 'Reserve'}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
