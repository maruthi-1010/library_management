import React from 'react';
import { Search, X, Filter } from 'lucide-react';

const SearchBar = ({
  searchTerm,
  onSearchChange,
  placeholder = "Search...",
  filterValue,
  onFilterChange,
  filterOptions = [],
  filterLabel = "All Categories",
  sortValue,
  onSortChange,
  sortOptions = []
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full mb-6">
      {/* Search Input Box */}
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm transition-all shadow-sm font-medium"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-black dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Dropdown */}
      {filterOptions.length > 0 && (
        <div className="relative min-w-[160px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
            <Filter className="w-4 h-4" />
          </div>
          <select
            value={filterValue}
            onChange={(e) => onFilterChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-800 dark:text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white cursor-pointer appearance-none shadow-sm font-medium"
          >
            <option value="ALL">{filterLabel}</option>
            {filterOptions.map((opt) => (
              <option key={opt.value || opt} value={opt.value || opt}>
                {opt.label || opt}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Sort Dropdown */}
      {sortOptions.length > 0 && (
        <div className="relative min-w-[150px]">
          <select
            value={sortValue}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-800 dark:text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white cursor-pointer appearance-none shadow-sm font-medium"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                Sort: {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
