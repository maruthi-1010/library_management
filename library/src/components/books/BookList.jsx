import React, { useState, useMemo, useEffect } from 'react';
import SearchBar from '../common/SearchBar';
import BookFilters from './BookFilters';
import BookCard from './BookCard';
import BookForm from './BookForm';
import BookDetails from './BookDetails';
import BorrowOptionsModal from './BorrowOptionsModal';
import EBookReaderModal from './EBookReaderModal';
import ApiBookSearchModal from './ApiBookSearchModal';
import Modal from '../common/Modal';
import EmptyState from '../common/EmptyState';
import { useApp } from '../../context/AppContext';
import { searchBooksApi } from '../../services/bookApiService';
import { Plus, Eye, Edit, Trash2, BookOpen, CheckCircle, XCircle, Globe, Sparkles, Loader2, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const BookList = ({ isAdmin = false }) => {
  const { books, loadingBooks, addBook, refreshBooksFromApi, updateBook, deleteBook, reserveBook, reservations, currentUser } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [availabilityFilter, setAvailabilityFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('title');

  // Live API Search State
  const [apiSearchResults, setApiSearchResults] = useState([]);
  const [isSearchingApi, setIsSearchingApi] = useState(false);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [viewingBook, setViewingBook] = useState(null);
  const [borrowingBook, setBorrowingBook] = useState(null);
  const [readingBook, setReadingBook] = useState(null);

  // Live Google Books API search when typing in search bar
  useEffect(() => {
    if (!searchTerm || searchTerm.trim().length < 2) {
      setApiSearchResults([]);
      setIsSearchingApi(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingApi(true);
      try {
        const results = await searchBooksApi(searchTerm, 16);
        setApiSearchResults(results);
      } catch (err) {
        console.error('API live search error:', err);
      } finally {
        setIsSearchingApi(false);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set(books.map(b => b.category));
    return Array.from(set).sort();
  }, [books]);

  // Reserved books set for current user
  const userReservedBookIds = useMemo(() => {
    if (!currentUser || !currentUser.memberId) return new Set();
    return new Set(
      reservations
        .filter(r => r.memberId === currentUser.memberId && r.status === 'pending')
        .map(r => r.bookId)
    );
  }, [reservations, currentUser]);

  // Filter local books
  const filteredLocalBooks = useMemo(() => {
    return books
      .filter(book => {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
          book.title.toLowerCase().includes(term) ||
          book.author.toLowerCase().includes(term) ||
          book.isbn.toLowerCase().includes(term);

        const matchesCategory = selectedCategory === 'ALL' || book.category === selectedCategory;

        let matchesAvailability = true;
        if (availabilityFilter === 'AVAILABLE') {
          matchesAvailability = book.availableCopies > 0;
        } else if (availabilityFilter === 'UNAVAILABLE') {
          matchesAvailability = book.availableCopies === 0;
        }

        return matchesSearch && matchesCategory && matchesAvailability;
      });
  }, [books, searchTerm, selectedCategory, availabilityFilter]);

  // Combine local books with live Google Books API search results
  const displayedBooks = useMemo(() => {
    const localMatches = [...filteredLocalBooks];
    if (!searchTerm.trim()) {
      return localMatches.sort((a, b) => {
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        if (sortBy === 'author') return a.author.localeCompare(b.author);
        if (sortBy === 'availableCopies') return b.availableCopies - a.availableCopies;
        return 0;
      });
    }

    // Filter out API books that are already present in local catalog
    const localTitles = new Set(localMatches.map(b => b.title.toLowerCase().trim()));
    const localIsbns = new Set(localMatches.map(b => b.isbn ? b.isbn.replace(/-/g, '') : ''));

    const uniqueApiResults = apiSearchResults.filter(apiBook => {
      const titleMatch = localTitles.has(apiBook.title.toLowerCase().trim());
      const isbnMatch = apiBook.isbn && localIsbns.has(apiBook.isbn.replace(/-/g, ''));
      return !titleMatch && !isbnMatch;
    });

    const combined = [...localMatches, ...uniqueApiResults];
    return combined.sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'author') return a.author.localeCompare(b.author);
      if (sortBy === 'availableCopies') return (b.availableCopies || 0) - (a.availableCopies || 0);
      return 0;
    });
  }, [filteredLocalBooks, apiSearchResults, searchTerm, sortBy]);

  // Helper to automatically add an API book to local catalog when interacted with
  const ensureBookInCatalog = (bookObj) => {
    if (!bookObj) return null;
    const exists = books.find(b => 
      b.id === bookObj.id || 
      (b.isbn && bookObj.isbn && b.isbn.replace(/-/g, '') === bookObj.isbn.replace(/-/g, '')) ||
      b.title.toLowerCase().trim() === bookObj.title.toLowerCase().trim()
    );

    if (exists) {
      return exists;
    }

    // Import API book into catalog automatically
    const imported = addBook(bookObj);
    toast.success(`Imported '${bookObj.title}' to library catalog!`);
    return imported || bookObj;
  };

  const handleAddBook = (formData) => {
    addBook(formData);
    setIsAddModalOpen(false);
  };

  const handleImportApiBook = (bookData) => {
    addBook(bookData);
  };

  const handleUpdateBook = (formData) => {
    if (editingBook) {
      updateBook(editingBook.id, formData);
      setEditingBook(null);
    }
  };

  const handleDeleteBook = (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      deleteBook(bookId);
    }
  };

  const handleViewBook = (bookObj) => {
    const catalogBook = ensureBookInCatalog(bookObj);
    setViewingBook(catalogBook);
  };

  const handleBorrowBook = (bookObj) => {
    const catalogBook = ensureBookInCatalog(bookObj);
    setBorrowingBook(catalogBook);
  };

  const handleReserve = (bookObjOrId) => {
    let bookId = bookObjOrId;
    if (typeof bookObjOrId === 'object') {
      const catalogBook = ensureBookInCatalog(bookObjOrId);
      bookId = catalogBook.id;
    }
    if (currentUser?.memberId) {
      reserveBook({ memberId: currentUser.memberId, bookId });
    }
  };

  const handleConfirmBorrow = (transaction, mode) => {
    if (mode === 'ebook' && borrowingBook) {
      const targetBook = borrowingBook;
      setBorrowingBook(null);
      setViewingBook(null);
      setReadingBook(targetBook);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-zinc-300" />
            {isAdmin ? 'Book Catalog & API Integration' : 'Browse Library Catalog'}
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            {isAdmin
              ? 'Fetch real volume data from Google Books API, edit, track availability, and manage all catalog records.'
              : 'Search titles live from Google Books API, filter by category, check availability, select borrow duration & options.'}
          </p>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={refreshBooksFromApi}
              disabled={loadingBooks}
              className="px-3.5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs rounded-xl border border-zinc-700 transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
              title="Fetch fresh books from Google Books API"
            >
              <Globe className={`w-3.5 h-3.5 ${loadingBooks ? 'animate-spin text-purple-400' : 'text-zinc-300'}`} />
              Sync API
            </button>
            <button
              onClick={() => setIsApiModalOpen(true)}
              className="px-4 py-2.5 bg-white text-black hover:bg-zinc-200 font-bold text-sm rounded-xl transition-all shadow flex items-center gap-2 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-zinc-900" />
              Import via API
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-sm rounded-xl border border-zinc-700 transition-all flex items-center gap-2 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Add Manually
            </button>
          </div>
        )}
      </div>

      {/* Search & Sort Controls */}
      <div className="space-y-2">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Type any book title, author, or ISBN to search Google Books API live..."
          sortValue={sortBy}
          onSortChange={setSortBy}
          sortOptions={[
            { value: 'title', label: 'Title (A-Z)' },
            { value: 'author', label: 'Author (A-Z)' },
            { value: 'availableCopies', label: 'Available Copies' }
          ]}
        />

        {/* Live Search Status Feedback */}
        {searchTerm.trim().length >= 2 && (
          <div className="flex items-center justify-between text-xs px-2 py-1 bg-zinc-900/60 border border-zinc-800 rounded-xl text-zinc-400">
            <span className="flex items-center gap-2">
              {isSearchingApi ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
                  <span className="text-purple-300 font-medium">Searching Google Books API for "{searchTerm}"...</span>
                </>
              ) : (
                <>
                  <Globe className="w-3.5 h-3.5 text-purple-400" />
                  <span>Showing results matching <strong>"{searchTerm}"</strong> (including live Google Books API matches).</span>
                </>
              )}
            </span>
            <span className="font-bold text-zinc-300">{displayedBooks.length} items found</span>
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <BookFilters
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        availabilityFilter={availabilityFilter}
        onAvailabilityChange={setAvailabilityFilter}
      />

      {/* Loading state for initial API fetch */}
      {loadingBooks ? (
        <div className="py-24 flex flex-col items-center justify-center text-center space-y-3 bg-zinc-900/40 border border-zinc-800 rounded-3xl">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
          <p className="text-sm font-semibold text-zinc-300">Fetching live catalog books from Google Books API...</p>
        </div>
      ) : displayedBooks.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No matching books found"
          description={`No books matching "${searchTerm}" found in catalog or Google Books API.`}
          actionLabel="Clear Search"
          onAction={() => {
            setSearchTerm('');
            setSelectedCategory('ALL');
            setAvailabilityFilter('ALL');
          }}
        />
      ) : (
        <>
          {/* Desktop Table View for Admin */}
          {isAdmin ? (
            <div className="hidden md:block overflow-hidden bg-zinc-900 border border-zinc-800 rounded-3xl shadow-xl">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-zinc-950/80 text-zinc-400 text-xs font-semibold uppercase tracking-wider border-b border-zinc-800">
                      <th className="py-3.5 px-4">Book Info</th>
                      <th className="py-3.5 px-4">Author</th>
                      <th className="py-3.5 px-4">ISBN</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4 text-center">Copies</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/70 text-zinc-300">
                    {displayedBooks.map(book => {
                      const isAvail = (book.availableCopies ?? 5) > 0;
                      return (
                        <tr key={book.id} className="hover:bg-zinc-800/40 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              {book.coverImage && (
                                <img src={book.coverImage} alt={book.title} className="w-8 h-11 object-cover rounded border border-zinc-800 shrink-0" />
                              )}
                              <div>
                                <div className="font-semibold text-white hover:underline cursor-pointer line-clamp-1 flex items-center gap-1.5" onClick={() => handleViewBook(book)}>
                                  {book.title}
                                  {book.id && book.id.startsWith('B-') && (
                                    <span className="px-1.5 py-0.5 bg-purple-950 text-purple-300 text-[9px] font-extrabold rounded border border-purple-800">
                                      API
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-zinc-500 font-mono">ID: {book.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-zinc-300">{book.author}</td>
                          <td className="py-3.5 px-4 font-mono text-xs text-zinc-400">{book.isbn}</td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-medium rounded-lg">
                              {book.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono">
                            <span className="font-bold text-white">{book.availableCopies ?? 5}</span> / {book.totalCopies ?? 5}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            {isAvail ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-100 text-black">
                                <CheckCircle className="w-3 h-3" /> Available
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-400 border border-zinc-700">
                                <XCircle className="w-3 h-3" /> Out of stock
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-1">
                            <button
                              onClick={() => handleViewBook(book)}
                              className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                const catalogBook = ensureBookInCatalog(book);
                                setEditingBook(catalogBook);
                              }}
                              className="p-1.5 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteBook(book.id)}
                              className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-zinc-800 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}

          {/* Grid View for Mobile or Student View */}
          <div className={`${isAdmin ? 'block md:hidden' : 'block'} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5`}>
            {displayedBooks.map(book => (
              <BookCard
                key={book.id}
                book={book}
                isAdmin={isAdmin}
                onView={handleViewBook}
                onEdit={(b) => {
                  const catalogBook = ensureBookInCatalog(b);
                  setEditingBook(catalogBook);
                }}
                onDelete={handleDeleteBook}
                onReserve={handleReserve}
                onBorrow={handleBorrowBook}
                isReserved={userReservedBookIds.has(book.id)}
              />
            ))}
          </div>
        </>
      )}

      {/* API Search & Import Modal */}
      <ApiBookSearchModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        onImportBook={handleImportApiBook}
        existingBooks={books}
      />

      {/* Add Book Manual Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Book to Library Catalog"
      >
        <BookForm
          onSubmit={handleAddBook}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* Edit Book Modal */}
      <Modal
        isOpen={!!editingBook}
        onClose={() => setEditingBook(null)}
        title="Edit Book Details"
      >
        <BookForm
          book={editingBook}
          onSubmit={handleUpdateBook}
          onCancel={() => setEditingBook(null)}
        />
      </Modal>

      {/* View Details Modal */}
      <Modal
        isOpen={!!viewingBook}
        onClose={() => setViewingBook(null)}
        title="Book Details Overview"
      >
        <BookDetails
          book={viewingBook}
          isAdmin={isAdmin}
          onReserve={(bId) => handleReserve(viewingBook || bId)}
          onBorrow={(b) => {
            setViewingBook(null);
            handleBorrowBook(b);
          }}
          onReadEBook={(b) => {
            setViewingBook(null);
            setReadingBook(b);
          }}
          isReserved={viewingBook ? userReservedBookIds.has(viewingBook.id) : false}
        />
      </Modal>

      {/* Borrow Options Modal */}
      <Modal
        isOpen={!!borrowingBook}
        onClose={() => setBorrowingBook(null)}
        title="Customize Book Borrow Options"
      >
        <BorrowOptionsModal
          book={borrowingBook}
          onConfirmBorrow={handleConfirmBorrow}
          onCancel={() => setBorrowingBook(null)}
        />
      </Modal>

      {/* E-Book Digital Reader Modal */}
      <Modal
        isOpen={!!readingBook}
        onClose={() => setReadingBook(null)}
        title="Interactive E-Book Student Reader"
        maxWidth="max-w-4xl"
      >
        <EBookReaderModal
          book={readingBook}
          onClose={() => setReadingBook(null)}
        />
      </Modal>
    </div>
  );
};

export default BookList;
