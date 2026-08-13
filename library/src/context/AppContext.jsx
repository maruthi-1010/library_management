import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  initialUsers,
  initialMembers,
  initialBooks,
  initialTransactions,
  initialReservations,
  initialNotifications,
  initialActivityLogs
} from '../data/mockData';
import { calculateFine } from '../utils/fineCalculator';
import { createNotification } from '../utils/notificationEngine';
import { fetchInitialDefaultBooks } from '../services/bookApiService';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Initialize state from mockData or localStorage for currentUser
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('lms_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return null;
  });

  const [users] = useState(initialUsers);
  const [members, setMembers] = useState(initialMembers);
  
  // Books state: initialize from localStorage or empty array
  const [books, setBooks] = useState(() => {
    const saved = localStorage.getItem('lms_books');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Check if cached books are old legacy static data (B001, B002 etc.)
        const isLegacyStatic = Array.isArray(parsed) && parsed.some(b => b.id === 'B001' || b.id === 'B002');
        if (!isLegacyStatic && Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) { console.error('Failed to parse saved books', e); }
    }
    return [];
  });
  const [loadingBooks, setLoadingBooks] = useState(false);

  const [transactions, setTransactions] = useState(initialTransactions);
  const [reservations, setReservations] = useState(initialReservations);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activityLogs, setActivityLogs] = useState(initialActivityLogs);

  // Sync books with localStorage
  useEffect(() => {
    localStorage.setItem('lms_books', JSON.stringify(books));
  }, [books]);

  // Function to force fetch fresh default books from Google Books API
  const refreshBooksFromApi = async () => {
    setLoadingBooks(true);
    const toastId = toast.loading('Connecting to Google Books API...');
    try {
      const apiBooks = await fetchInitialDefaultBooks();
      if (apiBooks && apiBooks.length > 0) {
        setBooks(apiBooks);
        localStorage.setItem('lms_books', JSON.stringify(apiBooks));
        toast.success(`Loaded ${apiBooks.length} books live from Google Books API!`, { id: toastId });
      } else {
        toast.error('Could not fetch books from Google Books API', { id: toastId });
      }
    } catch (err) {
      toast.error('API connection failed', { id: toastId });
    } finally {
      setLoadingBooks(false);
    }
  };

  // Fetch initial books dynamically from Google Books API if localStorage is empty, legacy, or small (<20)
  useEffect(() => {
    const initBooks = async () => {
      const saved = localStorage.getItem('lms_books');
      let existing = [];
      if (saved) {
        try { existing = JSON.parse(saved); } catch (e) {}
      }
      const isLegacyStatic = Array.isArray(existing) && existing.some(b => b.id === 'B001' || b.id === 'B002');
      if (!existing || existing.length < 20 || isLegacyStatic) {
        setLoadingBooks(true);
        const apiBooks = await fetchInitialDefaultBooks();
        if (apiBooks && apiBooks.length > 0) {
          setBooks(apiBooks);
          localStorage.setItem('lms_books', JSON.stringify(apiBooks));
          toast.success(`Connected to Google Books API! Loaded ${apiBooks.length} volumes.`);
        }
        setLoadingBooks(false);
      }
    };
    initBooks();
  }, []);

  // Theme mode: 'dark' or 'light'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('lms_theme') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('lms_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Sync currentUser with localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('lms_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('lms_user');
    }
  }, [currentUser]);

  // Recalculate fines on transactions dynamically
  const updatedTransactions = transactions.map(t => {
    if (t.status === 'issued') {
      const fineData = calculateFine(t.dueDate);
      return { ...t, fine: fineData.fine };
    }
    return t;
  });

  // -------------------------------------------------------------
  // AUTH OPERATIONS
  // -------------------------------------------------------------
  const login = (email, password) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (user) {
      setCurrentUser(user);
      addActivityLog(user.id, 'User Login', `${user.name} (${user.role}) logged into the system`);
      toast.success(`Welcome back, ${user.name}!`);
      return { success: true, role: user.role };
    } else {
      toast.error('Invalid email or password');
      return { success: false, error: 'Invalid email or password' };
    }
  };

  const logout = () => {
    if (currentUser) {
      addActivityLog(currentUser.id, 'User Logout', `${currentUser.name} logged out`);
    }
    setCurrentUser(null);
    toast.success('Logged out successfully');
  };

  // -------------------------------------------------------------
  // ACTIVITY LOG HELPER
  // -------------------------------------------------------------
  const addActivityLog = (userId, action, description) => {
    const newLog = {
      id: `LOG-${Date.now()}`,
      userId: userId || (currentUser ? currentUser.id : 1),
      action,
      description,
      timestamp: new Date().toISOString()
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  // -------------------------------------------------------------
  // NOTIFICATION HELPER
  // -------------------------------------------------------------
  const sendNotification = (userId, message, type = 'system') => {
    const newNotif = createNotification({ userId, message, type });
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (notificationId) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = (userId) => {
    setNotifications(prev => prev.map(n => n.userId === userId ? { ...n, read: true } : n));
  };

  // -------------------------------------------------------------
  // BOOK OPERATIONS (CRUD)
  // -------------------------------------------------------------
  const addBook = (bookData) => {
    // Generate new Book ID B0XX
    const maxNum = books.reduce((max, b) => {
      const num = parseInt(b.id.replace('B', ''), 10) || 0;
      return num > max ? num : max;
    }, 0);
    const newId = `B${String(maxNum + 1).padStart(3, '0')}`;

    const totalCopies = parseInt(bookData.totalCopies, 10) || 1;

    const newBook = {
      ...bookData,
      id: newId,
      totalCopies,
      availableCopies: totalCopies,
      year: parseInt(bookData.year, 10) || new Date().getFullYear()
    };

    setBooks(prev => [newBook, ...prev]);
    addActivityLog(currentUser?.id, 'Added Book', `Added new book '${newBook.title}' (${newBook.id})`);
    toast.success(`Book '${newBook.title}' added successfully!`);
    return newBook;
  };

  const updateBook = (bookId, updatedFields) => {
    setBooks(prevBooks => {
      return prevBooks.map(b => {
        if (b.id === bookId) {
          const totalCopies = parseInt(updatedFields.totalCopies, 10) || b.totalCopies;
          // Calculate active issued copies for this book
          const activeIssued = updatedTransactions.filter(t => t.bookId === bookId && t.status === 'issued').length;
          const availableCopies = Math.max(0, totalCopies - activeIssued);

          return {
            ...b,
            ...updatedFields,
            totalCopies,
            availableCopies
          };
        }
        return b;
      });
    });

    addActivityLog(currentUser?.id, 'Updated Book', `Updated details for book ID ${bookId}`);
    toast.success('Book details updated!');
  };

  const deleteBook = (bookId) => {
    // Check if there are active transactions for this book
    const activeTxns = updatedTransactions.filter(t => t.bookId === bookId && t.status === 'issued');
    if (activeTxns.length > 0) {
      toast.error(`Cannot delete book: ${activeTxns.length} copies are currently issued to members.`);
      return false;
    }

    const targetBook = books.find(b => b.id === bookId);
    setBooks(prev => prev.filter(b => b.id !== bookId));
    addActivityLog(currentUser?.id, 'Deleted Book', `Deleted book '${targetBook?.title || bookId}'`);
    toast.success('Book deleted successfully');
    return true;
  };

  // -------------------------------------------------------------
  // MEMBER OPERATIONS (CRUD)
  // -------------------------------------------------------------
  const addMember = (memberData) => {
    // Generate S00X Member ID
    const maxNum = members.reduce((max, m) => {
      const num = parseInt(m.memberId.replace('S', ''), 10) || 0;
      return num > max ? num : max;
    }, 0);
    const newMemberId = `S${String(maxNum + 1).padStart(3, '0')}`;

    const newMember = {
      ...memberData,
      id: Date.now(),
      memberId: newMemberId,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    setMembers(prev => [...prev, newMember]);
    addActivityLog(currentUser?.id, 'Added Member', `Registered new member ${newMember.name} (${newMember.memberId})`);
    toast.success(`Member ${newMember.name} registered with ID ${newMember.memberId}`);
    return newMember;
  };

  const updateMember = (memberId, updatedFields) => {
    setMembers(prev => prev.map(m => m.memberId === memberId ? { ...m, ...updatedFields } : m));
    addActivityLog(currentUser?.id, 'Updated Member', `Updated profile for member ${memberId}`);
    toast.success('Member details updated');
  };

  const deleteMember = (memberId) => {
    const activeTxns = updatedTransactions.filter(t => t.memberId === memberId && t.status === 'issued');
    if (activeTxns.length > 0) {
      toast.error(`Cannot delete member: Has ${activeTxns.length} currently issued books.`);
      return false;
    }

    const targetMember = members.find(m => m.memberId === memberId);
    setMembers(prev => prev.filter(m => m.memberId !== memberId));
    addActivityLog(currentUser?.id, 'Deleted Member', `Removed member ${targetMember?.name || memberId}`);
    toast.success('Member removed successfully');
    return true;
  };

  // -------------------------------------------------------------
  // TRANSACTION OPERATIONS (Issue / Return)
  // -------------------------------------------------------------
  const issueBook = ({ memberId, bookId, issueDate, dueDate }) => {
    const targetBook = books.find(b => b.id === bookId);
    const targetMember = members.find(m => m.memberId === memberId);

    // Business Rule Checks
    if (!targetMember) {
      toast.error('Member not found');
      return { success: false, error: 'Member not found' };
    }
    if (targetMember.status !== 'active') {
      toast.error('Member account is inactive');
      return { success: false, error: 'Member account is inactive' };
    }
    if (!targetBook) {
      toast.error('Book not found');
      return { success: false, error: 'Book not found' };
    }

    // Check availability
    if (targetBook.availableCopies <= 0) {
      toast.error(`'${targetBook.title}' has no copies available for issue`);
      return { success: false, error: 'Book unavailable' };
    }

    // Check maximum limit (5 active books per student)
    const activeStudentTxns = updatedTransactions.filter(t => t.memberId === memberId && t.status === 'issued');
    if (activeStudentTxns.length >= 5) {
      toast.error(`Member ${memberId} has reached maximum borrowing limit (5 books)`);
      return { success: false, error: 'Maximum borrowing limit reached (5 books)' };
    }

    // Check duplicate issue
    const alreadyIssued = activeStudentTxns.some(t => t.bookId === bookId);
    if (alreadyIssued) {
      toast.error(`Member ${memberId} already has an active issue of this book`);
      return { success: false, error: 'Book already issued to this member' };
    }

    // Create Transaction
    const newTxnId = `TXN${Date.now().toString().slice(-4)}`;
    const newTxn = {
      id: newTxnId,
      memberId,
      bookId,
      issueDate: issueDate || new Date().toISOString().split('T')[0],
      dueDate: dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      returnDate: null,
      status: 'issued',
      fine: 0
    };

    setTransactions(prev => [newTxn, ...prev]);

    // Decrease book available copies
    setBooks(prev => prev.map(b => b.id === bookId ? { ...b, availableCopies: Math.max(0, b.availableCopies - 1) } : b));

    // Find student user id for notification
    const studentUser = users.find(u => u.memberId === memberId);
    if (studentUser) {
      sendNotification(studentUser.id, `Book '${targetBook.title}' issued. Due date: ${newTxn.dueDate}`, 'system');
    }

    addActivityLog(currentUser?.id, 'Issued Book', `Issued '${targetBook.title}' to member ${targetMember.name} (${memberId})`);
    toast.success(`Book '${targetBook.title}' issued to ${targetMember.name}`);
    return { success: true, transaction: newTxn };
  };

  const returnBook = (transactionId) => {
    const txn = updatedTransactions.find(t => t.id === transactionId);
    if (!txn || txn.status === 'returned') {
      toast.error('Invalid or already returned transaction');
      return false;
    }

    const returnDateStr = new Date().toISOString().split('T')[0];
    const fineData = calculateFine(txn.dueDate, returnDateStr);
    const finalFine = fineData.fine;

    const targetBook = books.find(b => b.id === txn.bookId);
    const targetMember = members.find(m => m.memberId === txn.memberId);

    // Update Transaction
    setTransactions(prev => prev.map(t => {
      if (t.id === transactionId) {
        return {
          ...t,
          status: 'returned',
          returnDate: returnDateStr,
          fine: finalFine
        };
      }
      return t;
    }));

    // Increase Book available copies
    setBooks(prev => prev.map(b => {
      if (b.id === txn.bookId) {
        return {
          ...b,
          availableCopies: Math.min(b.totalCopies, b.availableCopies + 1)
        };
      }
      return b;
    }));

    // Check if there are pending reservations for this book
    const pendingRes = reservations.find(r => r.bookId === txn.bookId && r.status === 'pending');
    if (pendingRes) {
      // Fulfill oldest reservation
      setReservations(prev => prev.map(r => r.id === pendingRes.id ? { ...r, status: 'fulfilled' } : r));
      const resStudentUser = users.find(u => u.memberId === pendingRes.memberId);
      if (resStudentUser && targetBook) {
        sendNotification(
          resStudentUser.id,
          `Great news! Your reserved book '${targetBook.title}' is now available for pickup at the library desk.`,
          'reservation'
        );
      }
    }

    // Send notification to member
    const studentUser = users.find(u => u.memberId === txn.memberId);
    if (studentUser && targetBook) {
      const fineMsg = finalFine > 0 ? ` Overdue fine of ₹${finalFine} assessed.` : ' Thank you for returning on time!';
      sendNotification(studentUser.id, `Returned '${targetBook.title}'.${fineMsg}`, finalFine > 0 ? 'fine' : 'system');
    }

    addActivityLog(
      currentUser?.id,
      'Returned Book',
      `Returned '${targetBook?.title || txn.bookId}' from ${targetMember?.name || txn.memberId}. Fine: ₹${finalFine}`
    );

    if (finalFine > 0) {
      toast.success(`Book returned. Overdue fine calculated: ₹${finalFine}`);
    } else {
      toast.success('Book returned successfully with zero fine!');
    }
    return true;
  };

  // -------------------------------------------------------------
  // RESERVATION OPERATIONS
  // -------------------------------------------------------------
  const reserveBook = ({ memberId, bookId }) => {
    const targetBook = books.find(b => b.id === bookId);
    const targetMember = members.find(m => m.memberId === memberId);

    if (!targetBook) {
      toast.error('Book not found');
      return false;
    }

    // Check for active duplicate reservation
    const duplicate = reservations.some(r => r.memberId === memberId && r.bookId === bookId && r.status === 'pending');
    if (duplicate) {
      toast.error('You already have an active pending reservation for this book.');
      return false;
    }

    const newResId = `RES${Date.now().toString().slice(-4)}`;
    const newReservation = {
      id: newResId,
      memberId,
      bookId,
      reservationDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    setReservations(prev => [newReservation, ...prev]);

    const studentUser = users.find(u => u.memberId === memberId);
    if (studentUser) {
      sendNotification(
        studentUser.id,
        `Reservation placed for '${targetBook.title}'. You will be notified when it is available.`,
        'reservation'
      );
    }

    addActivityLog(currentUser?.id, 'Created Reservation', `Student ${targetMember?.name || memberId} reserved '${targetBook.title}'`);
    toast.success(`Reservation placed for '${targetBook.title}'!`);
    return true;
  };

  const cancelReservation = (reservationId) => {
    const res = reservations.find(r => r.id === reservationId);
    if (!res) return false;

    setReservations(prev => prev.map(r => r.id === reservationId ? { ...r, status: 'cancelled' } : r));
    const targetBook = books.find(b => b.id === res.bookId);

    addActivityLog(currentUser?.id, 'Cancelled Reservation', `Cancelled reservation ${reservationId} for '${targetBook?.title || res.bookId}'`);
    toast.success('Reservation cancelled.');
    return true;
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        members,
        books,
        loadingBooks,
        transactions: updatedTransactions,
        reservations,
        notifications,
        activityLogs,
        theme,
        toggleTheme,
        login,
        logout,
        addBook,
        refreshBooksFromApi,
        updateBook,
        deleteBook,
        addMember,
        updateMember,
        deleteMember,
        issueBook,
        returnBook,
        reserveBook,
        cancelReservation,
        markNotificationRead,
        markAllNotificationsRead,
        addActivityLog
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
