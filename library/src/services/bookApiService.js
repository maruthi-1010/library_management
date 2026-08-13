/**
 * Book API Service using Google Books API with User API Key
 */

const GOOGLE_BOOKS_API_KEY = "AIzaSyBckYiAP6Nx3iRqlmTExRJ0bLnSZy6-k0o";
const BASE_URL = "https://www.googleapis.com/books/v1/volumes";

/**
 * Maps Google Books API volume object to standard LMS book structure
 */
export const mapGoogleBookToLms = (item) => {
  const info = item.volumeInfo || {};
  const isbns = info.industryIdentifiers || [];
  const isbnObj = isbns.find(i => i.type === 'ISBN_13') || isbns.find(i => i.type === 'ISBN_10') || isbns[0];
  const isbn = isbnObj ? isbnObj.identifier : `ISBN-${item.id}`;

  const authors = info.authors ? info.authors.join(', ') : 'Unknown Author';
  
  // Clean category mapping
  let category = 'General';
  if (info.categories && info.categories.length > 0) {
    const rawCat = info.categories[0];
    if (rawCat.toLowerCase().includes('computer') || rawCat.toLowerCase().includes('program')) {
      category = 'Programming';
    } else if (rawCat.toLowerCase().includes('web') || rawCat.toLowerCase().includes('internet')) {
      category = 'Web Development';
    } else if (rawCat.toLowerCase().includes('intelligence') || rawCat.toLowerCase().includes('ai')) {
      category = 'Artificial Intelligence';
    } else if (rawCat.toLowerCase().includes('data') || rawCat.toLowerCase().includes('machine')) {
      category = 'Data Science';
    } else if (rawCat.toLowerCase().includes('security') || rawCat.toLowerCase().includes('hack')) {
      category = 'Cyber Security';
    } else if (rawCat.toLowerCase().includes('database') || rawCat.toLowerCase().includes('sql')) {
      category = 'Database';
    } else if (rawCat.toLowerCase().includes('network') || rawCat.toLowerCase().includes('cloud')) {
      category = 'Computer Networks';
    } else {
      category = rawCat;
    }
  }

  const yearStr = info.publishedDate ? info.publishedDate.substring(0, 4) : '';
  const year = parseInt(yearStr, 10) || new Date().getFullYear();

  let coverImage = info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || null;
  if (coverImage && coverImage.startsWith('http:')) {
    coverImage = coverImage.replace('http:', 'https:');
  }

  return {
    id: `B-${item.id}`,
    title: info.title || 'Untitled Book',
    author: authors,
    isbn: isbn,
    category: category,
    description: info.description ? info.description.replace(/<[^>]*>?/gm, '') : 'No detailed description available for this volume.',
    publisher: info.publisher || 'Independent Publisher',
    year: year,
    coverImage: coverImage,
    totalCopies: 5,
    availableCopies: 5,
    pageCount: info.pageCount || null,
    rating: info.averageRating || null
  };
};

/**
 * Search books live via Google Books API with configurable maxResults and pagination
 */
export const searchBooksApi = async (query, maxResults = 24, startIndex = 0) => {
  if (!query || !query.trim()) return [];
  try {
    const url = `${BASE_URL}?q=${encodeURIComponent(query)}&maxResults=${maxResults}&startIndex=${startIndex}&key=${GOOGLE_BOOKS_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Google Books API HTTP ${response.status}`);
    }
    const data = await response.json();
    if (!data.items || !Array.isArray(data.items)) {
      return [];
    }
    return data.items.map(mapGoogleBookToLms);
  } catch (error) {
    console.error('Error fetching books from API:', error);
    throw error;
  }
};

/**
 * Fetch a massive initial catalog (40-50+ books) dynamically across diverse categories
 */
export const fetchInitialDefaultBooks = async () => {
  try {
    const topics = [
      'subject:computers',
      'subject:programming',
      'artificial intelligence machine learning',
      'database systems sql',
      'cyber security ethical hacking',
      'web development react javascript',
      'computer networks cloud computing',
      'data science python',
      'software engineering architecture',
      'algorithms data structures'
    ];
    
    const results = await Promise.all(
      topics.map(q => searchBooksApi(q, 6, 0).catch(() => []))
    );

    const allBooks = results.flat();
    const uniqueBooks = [];
    const seen = new Set();

    for (const book of allBooks) {
      const key = book.title.toLowerCase().trim();
      if (!seen.has(key) && book.title && book.author) {
        seen.add(key);
        uniqueBooks.push(book);
      }
    }

    return uniqueBooks;
  } catch (error) {
    console.error('Failed to fetch initial default books:', error);
    return [];
  }
};
