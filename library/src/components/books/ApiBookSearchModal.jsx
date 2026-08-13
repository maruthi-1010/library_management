import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { searchBooksApi } from '../../services/bookApiService';
import { Search, BookOpen, Download, Check, Loader2, Sparkles, AlertCircle, Building2, Calendar, Hash } from 'lucide-react';
import toast from 'react-hot-toast';

const QUICK_SEARCHES = [
  'JavaScript',
  'Python Data Science',
  'Artificial Intelligence',
  'Software Architecture',
  'Cyber Security',
  'Database Systems'
];

const ApiBookSearchModal = ({ isOpen, onClose, onImportBook, existingBooks = [] }) => {
  const [query, setQuery] = useState('Computer Science');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [copiesMap, setCopiesMap] = useState({});
  const [startIndex, setStartIndex] = useState(0);

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);
    setStartIndex(0);
    try {
      const data = await searchBooksApi(searchQuery, 24, 0);
      setResults(data);
      if (data.length === 0) {
        setError('No books found matching your query. Try another keyword or ISBN.');
      }
    } catch (err) {
      setError('Failed to fetch books from Google Books API. Check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    const nextIndex = startIndex + 24;
    setLoadingMore(true);
    try {
      const moreData = await searchBooksApi(query, 24, nextIndex);
      if (moreData.length > 0) {
        setResults(prev => [...prev, ...moreData]);
        setStartIndex(nextIndex);
      } else {
        toast.error('No more results available from API.');
      }
    } catch (err) {
      toast.error('Failed to load more results.');
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (isOpen && results.length === 0) {
      handleSearch('Computer Science');
    }
  }, [isOpen]);

  const handleCopyChange = (bookId, copies) => {
    const val = parseInt(copies, 10) || 1;
    setCopiesMap(prev => ({ ...prev, [bookId]: Math.max(1, val) }));
  };

  const isBookImported = (book) => {
    return existingBooks.some(b => 
      (b.isbn && book.isbn && b.isbn.replace(/-/g, '') === book.isbn.replace(/-/g, '')) ||
      b.title.toLowerCase() === book.title.toLowerCase()
    );
  };

  const handleImport = (book) => {
    const totalCopies = copiesMap[book.id] || 5;
    const bookToAdd = {
      ...book,
      totalCopies,
      availableCopies: totalCopies
    };
    onImportBook(bookToAdd);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Import Books via Google Books API" maxWidth="max-w-4xl">
      <div className="space-y-5">
        {/* Search Header */}
        <div className="space-y-3">
          <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Google Books by Title, Author, Topic, or ISBN..."
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-white hover:bg-zinc-200 text-black font-bold text-sm rounded-xl transition-all flex items-center gap-2 disabled:opacity-50 shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Search API
            </button>
          </form>

          {/* Quick Search Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="text-zinc-400 font-semibold flex items-center gap-1 shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-zinc-300" /> Quick Topics:
            </span>
            {QUICK_SEARCHES.map(topic => (
              <button
                key={topic}
                type="button"
                onClick={() => { setQuery(topic); handleSearch(topic); }}
                className="px-3 py-1 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg border border-zinc-700/60 shrink-0 transition-colors font-medium"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Results Container */}
        <div className="min-h-[350px] max-h-[500px] overflow-y-auto pr-1 space-y-3">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-3 text-zinc-400">
              <Loader2 className="w-8 h-8 animate-spin text-white" />
              <p className="text-sm font-medium">Fetching real volume details from Google Books API...</p>
            </div>
          ) : error ? (
            <div className="py-16 flex flex-col items-center justify-center text-center p-6 bg-zinc-900/60 border border-zinc-800 rounded-2xl">
              <AlertCircle className="w-8 h-8 text-zinc-400 mb-2" />
              <p className="text-sm text-zinc-300 font-medium">{error}</p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center p-6 bg-zinc-900/60 border border-zinc-800 rounded-2xl">
              <BookOpen className="w-8 h-8 text-zinc-500 mb-2" />
              <p className="text-sm text-zinc-400 font-medium">Enter a title, author, or ISBN to discover books live from Google API.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.map((book) => {
                  const imported = isBookImported(book);
                  const copies = copiesMap[book.id] || 5;

                  return (
                    <div
                      key={book.id}
                      className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col justify-between space-y-3 hover:border-zinc-700 transition-all"
                    >
                      <div className="flex gap-3">
                        {/* Book Thumbnail */}
                        <div className="w-20 h-28 shrink-0 bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800 flex items-center justify-center">
                          {book.coverImage ? (
                            <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                          ) : (
                            <BookOpen className="w-6 h-6 text-zinc-600" />
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <span className="inline-block px-2 py-0.5 bg-zinc-800 text-zinc-300 text-[10px] font-bold rounded uppercase">
                            {book.category}
                          </span>
                          <h4 className="text-sm font-bold text-white line-clamp-1 leading-snug" title={book.title}>
                            {book.title}
                          </h4>
                          <p className="text-xs text-zinc-400 truncate">By {book.author}</p>
                          <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed mt-1">
                            {book.description}
                          </p>
                        </div>
                      </div>

                      {/* Footer Info & Import Control */}
                      <div className="pt-3 border-t border-zinc-800 flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-3 text-zinc-400 text-[11px]">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-zinc-500" /> {book.year}
                          </span>
                          <span className="flex items-center gap-1 truncate max-w-[100px]">
                            <Hash className="w-3 h-3 text-zinc-500" /> {book.isbn.substring(0, 10)}...
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {!imported && (
                            <div className="flex items-center gap-1 bg-zinc-950 px-2 py-1 rounded-lg border border-zinc-800">
                              <span className="text-[10px] text-zinc-400 font-bold uppercase">Copies:</span>
                              <input
                                type="number"
                                min="1"
                                max="50"
                                value={copies}
                                onChange={(e) => handleCopyChange(book.id, e.target.value)}
                                className="w-10 bg-transparent text-center font-bold text-white text-xs focus:outline-none"
                              />
                            </div>
                          )}

                          <button
                            onClick={() => handleImport(book)}
                            disabled={imported}
                            className={`px-3 py-1.5 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all ${
                              imported
                                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50'
                                : 'bg-white text-black hover:bg-zinc-200 active:scale-95 shadow'
                            }`}
                          >
                            {imported ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" /> In Catalog
                              </>
                            ) : (
                              <>
                                <Download className="w-3.5 h-3.5" /> Import
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Load More Button */}
              <div className="pt-3 text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl border border-zinc-700 transition-all inline-flex items-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {loadingMore ? <Loader2 className="w-4 h-4 animate-spin text-purple-400" /> : <Search className="w-4 h-4" />}
                  Load More Results from Google API
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ApiBookSearchModal;
