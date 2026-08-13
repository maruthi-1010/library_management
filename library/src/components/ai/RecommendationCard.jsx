import React from 'react';
import { Sparkles, BookOpen, CheckCircle, XCircle, ArrowRight, ArrowRightLeft } from 'lucide-react';

const RecommendationCard = ({ recommendation, onView, onReserve, onBorrow }) => {
  const { book, score, matchReasons, available } = recommendation;

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 transition-all shadow-lg hover:shadow-indigo-500/10 flex flex-col justify-between group">
      <div>
        {/* Match Score Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-xl text-indigo-300 font-bold text-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{score}% Match</span>
          </div>

          {available ? (
            <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Available
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-rose-400 flex items-center gap-1">
              <XCircle className="w-3 h-3" /> Reserved/Busy
            </span>
          )}
        </div>

        {/* Book Title & Category */}
        <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider block mb-1">
          {book.category}
        </span>
        <h3
          onClick={() => onView(book)}
          className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2 cursor-pointer mb-2"
        >
          {book.title}
        </h3>
        <p className="text-xs text-slate-400 mb-3">by {book.author}</p>

        {/* Match Explanation bullet points */}
        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1 mb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Why recommended:
          </span>
          {matchReasons.map((reason, idx) => (
            <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
              <span className="text-indigo-400 font-bold">•</span>
              <span>{reason}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
        <button
          onClick={() => onView(book)}
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
        >
          View Details <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {available ? (
          <button
            onClick={() => onBorrow(book)}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1 shadow-md shadow-indigo-600/20"
          >
            <ArrowRightLeft className="w-3 h-3" /> Borrow Options
          </button>
        ) : (
          <button
            onClick={() => onReserve(book.id)}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all"
          >
            Reserve Book
          </button>
        )}
      </div>
    </div>
  );
};

export default RecommendationCard;
