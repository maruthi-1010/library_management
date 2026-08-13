import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { searchBooksApi } from '../../services/bookApiService';
import { Sparkles, Search, Loader2 } from 'lucide-react';

const CATEGORIES = [
  "Programming",
  "Web Development",
  "Database",
  "Artificial Intelligence",
  "Machine Learning",
  "Data Science",
  "Computer Networks",
  "Cyber Security",
  "Software Engineering",
  "General"
];

const BookForm = ({ book, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: CATEGORIES[0],
    description: '',
    publisher: '',
    year: new Date().getFullYear(),
    totalCopies: 1,
    coverImage: ''
  });

  const [apiSearchQuery, setApiSearchQuery] = useState('');
  const [isFetchingApi, setIsFetchingApi] = useState(false);

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        isbn: book.isbn || '',
        category: book.category || CATEGORIES[0],
        description: book.description || '',
        publisher: book.publisher || '',
        year: book.year || new Date().getFullYear(),
        totalCopies: book.totalCopies || 1,
        coverImage: book.coverImage || ''
      });
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAutofillFromApi = async (e) => {
    e.preventDefault();
    if (!apiSearchQuery.trim()) {
      toast.error('Enter a title or ISBN to search Google Books API');
      return;
    }
    setIsFetchingApi(true);
    try {
      const results = await searchBooksApi(apiSearchQuery, 1);
      if (results && results.length > 0) {
        const fetched = results[0];
        setFormData(prev => ({
          ...prev,
          title: fetched.title || prev.title,
          author: fetched.author || prev.author,
          isbn: fetched.isbn || prev.isbn,
          category: CATEGORIES.includes(fetched.category) ? fetched.category : CATEGORIES[0],
          description: fetched.description || prev.description,
          publisher: fetched.publisher || prev.publisher,
          year: fetched.year || prev.year,
          coverImage: fetched.coverImage || prev.coverImage
        }));
        toast.success(`Autofilled details for '${fetched.title}' from API!`);
      } else {
        toast.error('No book details found on Google Books API for this query.');
      }
    } catch (err) {
      toast.error('Failed to query Google Books API.');
    } finally {
      setIsFetchingApi(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Book Title is required');
      return;
    }
    if (!formData.author.trim()) {
      toast.error('Author is required');
      return;
    }
    if (!formData.isbn.trim()) {
      toast.error('ISBN is required');
      return;
    }
    if (!formData.category) {
      toast.error('Category is required');
      return;
    }
    const yearNum = parseInt(formData.year, 10);
    if (isNaN(yearNum) || yearNum < 1800 || yearNum > new Date().getFullYear() + 1) {
      toast.error('Please enter a valid publication year');
      return;
    }
    const copiesNum = parseInt(formData.totalCopies, 10);
    if (isNaN(copiesNum) || copiesNum < 1) {
      toast.error('Total copies must be at least 1');
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="space-y-4">
      {/* Quick API Autofill Header */}
      {!book && (
        <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-300 font-bold">
            <span className="flex items-center gap-1.5 text-white">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Auto-fill from Google Books API
            </span>
            <span className="text-[10px] text-zinc-500 font-normal">Enter title or ISBN</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={apiSearchQuery}
              onChange={(e) => setApiSearchQuery(e.target.value)}
              placeholder="e.g. 978-0132350884 or Clean Code"
              className="flex-1 px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400"
            />
            <button
              type="button"
              onClick={handleAutofillFromApi}
              disabled={isFetchingApi}
              className="px-3 py-1.5 bg-white text-black hover:bg-zinc-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-50 shrink-0"
            >
              {isFetchingApi ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              Autofill Form
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
            Book Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Clean Code"
            className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
            required
          />
        </div>

        {/* Author & ISBN */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
              Author *
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="e.g. Robert C. Martin"
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
              ISBN *
            </label>
            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              placeholder="e.g. 978-0132350884"
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
              required
            />
          </div>
        </div>

        {/* Category & Publisher */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 cursor-pointer"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
              Publisher
            </label>
            <input
              type="text"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
              placeholder="e.g. O'Reilly Media"
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
            />
          </div>
        </div>

        {/* Publication Year & Total Copies */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
              Publication Year *
            </label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              min="1800"
              max={new Date().getFullYear() + 1}
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
              Total Copies *
            </label>
            <input
              type="number"
              name="totalCopies"
              value={formData.totalCopies}
              onChange={handleChange}
              min="1"
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            placeholder="Brief summary or description of the book..."
            className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 custom-scrollbar"
          />
        </div>

        {/* Cover Image URL */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
            Cover Image URL (Optional)
          </label>
          <input
            type="url"
            name="coverImage"
            value={formData.coverImage}
            onChange={handleChange}
            placeholder="https://books.google.com/..."
            className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-white text-black hover:bg-zinc-200 rounded-xl text-sm font-bold transition-all shadow active:scale-95"
          >
            {book ? 'Update Book' : 'Add Book'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookForm;
