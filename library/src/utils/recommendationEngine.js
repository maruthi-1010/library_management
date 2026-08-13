/**
 * Local Intelligent Recommendation Engine
 * Calculates book recommendation scores (0-100%) for a student based on:
 * - Borrowing history & preferred categories
 * - Preferred authors
 * - Global book popularity (total checkout count)
 * - Availability
 */

export const getBookRecommendations = (studentMemberId, books, transactions) => {
  if (!studentMemberId || !books || !transactions) return [];

  // 1. Get student's transactions
  const studentTransactions = transactions.filter(t => t.memberId === studentMemberId);
  const borrowedBookIds = new Set(studentTransactions.map(t => t.bookId));

  // Identify currently issued books for this student
  const currentlyIssuedBookIds = new Set(
    studentTransactions.filter(t => t.status === 'issued').map(t => t.bookId)
  );

  // 2. Extract student category and author preferences
  const categoryFreq = {};
  const authorFreq = {};

  studentTransactions.forEach(t => {
    const book = books.find(b => b.id === t.bookId);
    if (book) {
      categoryFreq[book.category] = (categoryFreq[book.category] || 0) + 1;
      authorFreq[book.author] = (authorFreq[book.author] || 0) + 1;
    }
  });

  const maxCategoryFreq = Math.max(1, ...Object.values(categoryFreq));
  const maxAuthorFreq = Math.max(1, ...Object.values(authorFreq));

  // 3. Compute global book popularity (borrow count across all users)
  const bookPopularity = {};
  transactions.forEach(t => {
    bookPopularity[t.bookId] = (bookPopularity[t.bookId] || 0) + 1;
  });
  const maxPopularity = Math.max(1, ...Object.values(bookPopularity));

  // 4. Candidate books filtering: exclude currently issued books
  const candidateBooks = books.filter(book => !currentlyIssuedBookIds.has(book.id));

  // 5. Score candidate books
  const scoredBooks = candidateBooks.map(book => {
    // Category match score (weight: 40%)
    const catCount = categoryFreq[book.category] || 0;
    const categoryScore = (catCount / maxCategoryFreq) * 40;

    // Author match score (weight: 25%)
    const authCount = authorFreq[book.author] || 0;
    const authorScore = (authCount / maxAuthorFreq) * 25;

    // Popularity score (weight: 25%)
    const popCount = bookPopularity[book.id] || 0;
    const popularityScore = (popCount / maxPopularity) * 25;

    // Novelty/Availability score (weight: 10%)
    const isNewToUser = !borrowedBookIds.has(book.id);
    const availabilityBonus = book.availableCopies > 0 ? 5 : 0;
    const noveltyScore = (isNewToUser ? 5 : 2) + availabilityBonus;

    // Calculate raw score (max ~ 100)
    let totalScore = Math.round(categoryScore + authorScore + popularityScore + noveltyScore);
    
    // Baseline boost if user has no borrowing history yet (cold start)
    if (studentTransactions.length === 0) {
      const basePopScore = Math.round((popCount / maxPopularity) * 60);
      const ratingBonus = 30; // default benchmark
      totalScore = Math.min(98, Math.max(65, basePopScore + ratingBonus));
    } else {
      totalScore = Math.min(99, Math.max(50, totalScore));
    }

    // Build match explanation string
    const matchReasons = [];
    if (catCount > 0) matchReasons.push(`Matches your interest in ${book.category}`);
    if (authCount > 0) matchReasons.push(`From your read author ${book.author}`);
    if (popCount > 1) matchReasons.push(`Popular among students (${popCount} checkouts)`);
    if (book.availableCopies > 0) matchReasons.push(`Available for immediate checkout`);
    if (matchReasons.length === 0) matchReasons.push(`Highly rated in ${book.category}`);

    return {
      book,
      score: totalScore,
      matchReasons,
      isBorrowedBefore: borrowedBookIds.has(book.id),
      available: book.availableCopies > 0
    };
  });

  // Sort by highest score, then availability
  return scoredBooks.sort((a, b) => b.score - a.score || (b.available ? 1 : -1));
};
