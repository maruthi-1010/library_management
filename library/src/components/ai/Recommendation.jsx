import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getBookRecommendations } from '../../utils/recommendationEngine';
import RecommendationCard from './RecommendationCard';
import BookDetails from '../books/BookDetails';
import BorrowOptionsModal from '../books/BorrowOptionsModal';
import EBookReaderModal from '../books/EBookReaderModal';
import Modal from '../common/Modal';
import EmptyState from '../common/EmptyState';
import { Sparkles } from 'lucide-react';

const Recommendation = () => {
  const { books, transactions, currentUser, reserveBook, reservations } = useApp();

  const [viewingBook, setViewingBook] = useState(null);
  const [borrowingBook, setBorrowingBook] = useState(null);
  const [readingBook, setReadingBook] = useState(null);

  const studentMemberId = currentUser?.memberId;
  const recommendations = getBookRecommendations(studentMemberId, books, transactions);

  const userReservedBookIds = new Set(
    reservations
      .filter(r => r.memberId === studentMemberId && r.status === 'pending')
      .map(r => r.bookId)
  );

  const handleReserve = (bookId) => {
    if (studentMemberId) {
      reserveBook({ memberId: studentMemberId, bookId });
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-400" />
            Intelligent Book Recommendations
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Personalized reading suggestions powered by your borrowing history, technical category affinity, and library popularity.
          </p>
        </div>
      </div>

      {recommendations.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No recommendations available"
          description="Check back once you borrow books or check out our catalog."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recommendations.map(rec => (
            <RecommendationCard
              key={rec.book.id}
              recommendation={rec}
              onView={setViewingBook}
              onReserve={handleReserve}
              onBorrow={setBorrowingBook}
            />
          ))}
        </div>
      )}

      {/* Book Details Modal */}
      <Modal
        isOpen={!!viewingBook}
        onClose={() => setViewingBook(null)}
        title="Recommended Book Details"
      >
        <BookDetails
          book={viewingBook}
          onReserve={handleReserve}
          onBorrow={(b) => {
            setViewingBook(null);
            setBorrowingBook(b);
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

      {/* E-Book Reader Modal */}
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

export default Recommendation;
