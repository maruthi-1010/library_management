import React, { useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, Bookmark, Search, ZoomIn, ZoomOut, CheckCircle, FileText, Lock } from 'lucide-react';

const EBookReaderModal = ({ book, onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [bookmarkedPages, setBookmarkedPages] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  if (!book) return null;

  const totalPages = 248;

  // Sample chapters content generator based on book category/title
  const chapters = [
    { title: "Chapter 1: Foundations & Architecture Principles", page: 1 },
    { title: "Chapter 2: Core Data Structures & Algorithms", page: 24 },
    { title: "Chapter 3: Industry Patterns & Clean Code Guidelines", page: 58 },
    { title: "Chapter 4: Advanced Implementation & Optimization", page: 112 },
    { title: "Chapter 5: Security Hardening & Performance Benchmarks", page: 184 }
  ];

  const toggleBookmark = (page) => {
    setBookmarkedPages(prev => {
      const next = new Set(prev);
      if (next.has(page)) next.delete(page);
      else next.add(page);
      return next;
    });
  };

  return (
    <div className="space-y-4 text-slate-100">
      {/* Reader Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-950 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-600/20 text-indigo-400 rounded-lg">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white truncate max-w-[200px] sm:max-w-xs">{book.title}</h4>
            <span className="text-[10px] text-slate-400">Digital Student E-Reader Access</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setZoomLevel(prev => Math.max(80, prev - 10))}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono text-slate-400 w-10 text-center">{zoomLevel}%</span>
          <button
            onClick={() => setZoomLevel(prev => Math.min(140, prev + 10))}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          <button
            onClick={() => toggleBookmark(currentPage)}
            className={`p-1.5 rounded-lg transition-colors ${
              bookmarkedPages.has(currentPage)
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
            title="Bookmark Page"
          >
            <Bookmark className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Reader Main Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 min-h-[420px]">
        {/* Table of Contents Sidebar */}
        <div className="hidden md:block p-3 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Table of Contents
          </span>
          <div className="space-y-1.5 text-xs">
            {chapters.map((ch, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(ch.page)}
                className={`w-full text-left p-2 rounded-xl text-[11px] transition-all line-clamp-2 ${
                  currentPage >= ch.page && (idx === chapters.length - 1 || currentPage < chapters[idx + 1].page)
                    ? 'bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {ch.title}
              </button>
            ))}
          </div>
        </div>

        {/* Simulated Page Content */}
        <div className="md:col-span-3 p-6 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col justify-between overflow-y-auto custom-scrollbar" style={{ fontSize: `${(zoomLevel / 100) * 14}px` }}>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-900 pb-2">
              <span>{book.title}</span>
              <span>Page {currentPage} of {totalPages}</span>
            </div>

            <h3 className="text-lg font-bold text-indigo-400">
              {chapters.find((ch, idx) => currentPage >= ch.page && (idx === chapters.length - 1 || currentPage < chapters[idx + 1].page))?.title || "Chapter Excerpt"}
            </h3>

            <p className="text-slate-300 leading-relaxed font-sans">
              {book.description}
            </p>

            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2 text-slate-300 text-sm">
              <h5 className="font-bold text-white text-xs uppercase tracking-wider">Key Takeaways & Technical Summary</h5>
              <ul className="list-disc pl-5 space-y-1 text-xs text-slate-400">
                <li>Comprehensive coverage of concepts in {book.category}.</li>
                <li>Practical design patterns written by {book.author}.</li>
                <li>Production code snippets optimized for scalability and clean architecture.</li>
              </ul>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>

          {/* Page Footer Controls */}
          <div className="flex items-center justify-between pt-4 mt-6 border-t border-slate-900 text-xs">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-xl text-slate-200 font-semibold flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            <span className="font-mono text-slate-400">
              Page {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 rounded-xl text-white font-semibold flex items-center gap-1"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EBookReaderModal;
