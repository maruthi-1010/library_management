import React from 'react';

const BookFilters = ({
  categories,
  selectedCategory,
  onCategoryChange,
  availabilityFilter,
  onAvailabilityChange
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-slate-900/60 p-4 border border-slate-800 rounded-2xl">
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar w-full sm:w-auto">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1 shrink-0">Category:</span>
        <button
          onClick={() => onCategoryChange('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all ${
            selectedCategory === 'ALL'
              ? 'bg-indigo-600 text-white shadow'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Availability Filter Pills */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">Status:</span>
        <button
          onClick={() => onAvailabilityChange('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            availabilityFilter === 'ALL'
              ? 'bg-slate-700 text-white'
              : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800'
          }`}
        >
          All
        </button>
        <button
          onClick={() => onAvailabilityChange('AVAILABLE')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            availabilityFilter === 'AVAILABLE'
              ? 'bg-emerald-600 text-white shadow'
              : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800'
          }`}
        >
          Available
        </button>
        <button
          onClick={() => onAvailabilityChange('UNAVAILABLE')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            availabilityFilter === 'UNAVAILABLE'
              ? 'bg-rose-600 text-white shadow'
              : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800'
          }`}
        >
          Unavailable
        </button>
      </div>
    </div>
  );
};

export default BookFilters;
