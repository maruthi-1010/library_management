/**
 * Static In-Memory Mock Data for Smart Library Management System
 */

export const initialUsers = [
  {
    id: 1,
    email: "admin@lms.com",
    password: "123456",
    role: "admin",
    name: "Library Administrator"
  },
  {
    id: 2,
    email: "student@lms.com",
    password: "123456",
    role: "student",
    name: "Aarav Sharma",
    memberId: "S001",
    department: "Computer Science",
    phone: "+91 98765 43210",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 3,
    email: "jessica@lms.com",
    password: "123456",
    role: "student",
    name: "Jessica Chen",
    memberId: "S002",
    department: "Data Science & AI",
    phone: "+91 98765 43211",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 4,
    email: "rahul@lms.com",
    password: "123456",
    role: "student",
    name: "Rahul Verma",
    memberId: "S003",
    department: "Information Technology",
    phone: "+91 98765 43212",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 5,
    email: "priya@lms.com",
    password: "123456",
    role: "student",
    name: "Priya Patel",
    memberId: "S004",
    department: "Artificial Intelligence",
    phone: "+91 98765 43213",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 6,
    email: "marcus@lms.com",
    password: "123456",
    role: "student",
    name: "Marcus Vance",
    memberId: "S005",
    department: "Cyber Security",
    phone: "+91 98765 43214",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 7,
    email: "ananya@lms.com",
    password: "123456",
    role: "student",
    name: "Ananya Roy",
    memberId: "S006",
    department: "Software Engineering",
    phone: "+91 98765 43215",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 8,
    email: "elizabeth@lms.com",
    password: "123456",
    role: "student",
    name: "Dr. Elizabeth Warren",
    memberId: "F101",
    department: "Computer Science Faculty",
    phone: "+91 98765 43216",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 9,
    email: "vikram@lms.com",
    password: "123456",
    role: "student",
    name: "Vikram Singh",
    memberId: "S007",
    department: "Cloud Computing",
    phone: "+91 98765 43217",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 10,
    email: "sophia@lms.com",
    password: "123456",
    role: "student",
    name: "Sophia Martinez",
    memberId: "S008",
    department: "Business Analytics",
    phone: "+91 98765 43218",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80"
  }
];

export const initialMembers = [
  {
    id: 101,
    memberId: "S001",
    name: "Aarav Sharma",
    email: "student@lms.com",
    phone: "+91 98765 43210",
    department: "Computer Science",
    joinDate: "2024-08-15",
    status: "active",
    type: "Student",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    totalBorrowed: 14
  },
  {
    id: 102,
    memberId: "S002",
    name: "Jessica Chen",
    email: "jessica@lms.com",
    phone: "+91 98765 43211",
    department: "Data Science & AI",
    joinDate: "2024-08-18",
    status: "active",
    type: "Graduate Scholar",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
    totalBorrowed: 22
  },
  {
    id: 103,
    memberId: "S003",
    name: "Rahul Verma",
    email: "rahul@lms.com",
    phone: "+91 98765 43212",
    department: "Information Technology",
    joinDate: "2024-08-20",
    status: "active",
    type: "Student",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    totalBorrowed: 9
  },
  {
    id: 104,
    memberId: "S004",
    name: "Priya Patel",
    email: "priya@lms.com",
    phone: "+91 98765 43213",
    department: "Artificial Intelligence",
    joinDate: "2024-09-01",
    status: "active",
    type: "Research Fellow",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    totalBorrowed: 31
  },
  {
    id: 105,
    memberId: "S005",
    name: "Marcus Vance",
    email: "marcus@lms.com",
    phone: "+91 98765 43214",
    department: "Cyber Security",
    joinDate: "2024-09-03",
    status: "active",
    type: "Student",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    totalBorrowed: 18
  },
  {
    id: 106,
    memberId: "S006",
    name: "Ananya Roy",
    email: "ananya@lms.com",
    phone: "+91 98765 43215",
    department: "Software Engineering",
    joinDate: "2024-09-05",
    status: "active",
    type: "Student",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80",
    totalBorrowed: 12
  },
  {
    id: 107,
    memberId: "F101",
    name: "Dr. Elizabeth Warren",
    email: "elizabeth@lms.com",
    phone: "+91 98765 43216",
    department: "Computer Science Faculty",
    joinDate: "2024-07-10",
    status: "active",
    type: "Professor",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    totalBorrowed: 45
  },
  {
    id: 108,
    memberId: "S007",
    name: "Vikram Singh",
    email: "vikram@lms.com",
    phone: "+91 98765 43217",
    department: "Cloud Computing",
    joinDate: "2024-09-10",
    status: "active",
    type: "Student",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
    totalBorrowed: 7
  },
  {
    id: 109,
    memberId: "S008",
    name: "Sophia Martinez",
    email: "sophia@lms.com",
    phone: "+91 98765 43218",
    department: "Business Analytics",
    joinDate: "2024-09-12",
    status: "active",
    type: "Student",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
    totalBorrowed: 15
  }
];

export const initialBooks = [];

const today = new Date();
const formatDateStr = (d) => d.toISOString().split('T')[0];

const dMinus20 = new Date(today); dMinus20.setDate(today.getDate() - 20);
const dMinus10 = new Date(today); dMinus10.setDate(today.getDate() - 10);
const dMinus6  = new Date(today); dMinus6.setDate(today.getDate() - 6);
const dMinus3  = new Date(today); dMinus3.setDate(today.getDate() - 3);
const dPlus4   = new Date(today); dPlus4.setDate(today.getDate() + 4);
const dPlus8   = new Date(today); dPlus8.setDate(today.getDate() + 8);
const dMinus18 = new Date(today); dMinus18.setDate(today.getDate() - 18);
const dMinus4  = new Date(today); dMinus4.setDate(today.getDate() - 4);

export const initialTransactions = [
  {
    id: "TXN1001",
    memberId: "S001",
    bookId: "B-001",
    bookTitle: "Clean Code: Handbook of Software Craftsmanship",
    issueDate: formatDateStr(dMinus18),
    dueDate: formatDateStr(dMinus4),
    returnDate: null,
    status: "issued",
    fine: 40
  },
  {
    id: "TXN1002",
    memberId: "S002",
    bookId: "B-003",
    bookTitle: "Hands-On Machine Learning with Scikit-Learn",
    issueDate: formatDateStr(dMinus10),
    dueDate: formatDateStr(dPlus4),
    returnDate: null,
    status: "issued",
    fine: 0
  },
  {
    id: "TXN1003",
    memberId: "S003",
    bookId: "B-007",
    bookTitle: "Learning React: Modern Web Development",
    issueDate: formatDateStr(dMinus6),
    dueDate: formatDateStr(dPlus8),
    returnDate: null,
    status: "issued",
    fine: 0
  },
  {
    id: "TXN1004",
    memberId: "S004",
    bookId: "B-009",
    bookTitle: "Python Crash Course",
    issueDate: formatDateStr(dMinus20),
    dueDate: formatDateStr(dMinus6),
    returnDate: formatDateStr(dMinus6),
    status: "returned",
    fine: 0
  },
  {
    id: "TXN1005",
    memberId: "S005",
    bookId: "B-004",
    bookTitle: "Artificial Intelligence: A Modern Approach",
    issueDate: formatDateStr(dMinus20),
    dueDate: formatDateStr(dMinus6),
    returnDate: formatDateStr(dMinus3),
    status: "returned",
    fine: 30
  },
  {
    id: "TXN1006",
    memberId: "S006",
    bookId: "B-002",
    bookTitle: "Design Patterns: Reusable Object-Oriented Software",
    issueDate: formatDateStr(dMinus3),
    dueDate: formatDateStr(dPlus8),
    returnDate: null,
    status: "issued",
    fine: 0
  }
];

export const initialReservations = [
  {
    id: "RES2001",
    memberId: "S001",
    bookId: "B-011",
    reservationDate: formatDateStr(dMinus3),
    status: "pending"
  },
  {
    id: "RES2002",
    memberId: "S002",
    bookId: "B-004",
    reservationDate: formatDateStr(dMinus6),
    status: "fulfilled"
  },
  {
    id: "RES2003",
    memberId: "S005",
    bookId: "B-011",
    reservationDate: formatDateStr(dMinus20),
    status: "cancelled"
  }
];

export const initialNotifications = [
  {
    id: "NOTIF-01",
    userId: 2,
    message: "ALERT: 'Clean Code' was due on " + formatDateStr(dMinus4) + ". Overdue fine accumulating (₹10/day).",
    type: "overdue",
    date: new Date().toISOString(),
    read: false
  },
  {
    id: "NOTIF-02",
    userId: 3,
    message: "REMINDER: 'Hands-On Machine Learning' is due in 4 days.",
    type: "due",
    date: new Date().toISOString(),
    read: false
  },
  {
    id: "NOTIF-03",
    userId: 4,
    message: "Your reservation for 'Artificial Intelligence: A Modern Approach' has been fulfilled.",
    type: "reservation",
    date: new Date().toISOString(),
    read: true
  },
  {
    id: "NOTIF-04",
    userId: 1,
    message: "System Alert: Student S001 has 1 overdue book incurring fines.",
    type: "system",
    date: new Date().toISOString(),
    read: false
  }
];

export const initialActivityLogs = [
  {
    id: "LOG-001",
    userId: 1,
    action: "Issued Book",
    description: "Issued 'Clean Code' to student Aarav Sharma (S001)",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  },
  {
    id: "LOG-002",
    userId: 3,
    action: "Created Reservation",
    description: "Jessica Chen (S002) reserved 'Hands-On Machine Learning'",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
  },
  {
    id: "LOG-003",
    userId: 1,
    action: "Returned Book",
    description: "Priya Patel (S004) returned 'Python Crash Course'",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
  },
  {
    id: "LOG-004",
    userId: 1,
    action: "Google API Sync",
    description: "Synced 42 volumes live from Google Books API into catalog",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  }
];
