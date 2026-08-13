# Smart Library Management System with Intelligent Book Recommendation

A complete, responsive, full-featured **Smart Library Management System** built with React, Vite, and Tailwind CSS. Designed as a college-level demonstration project featuring role-based access control, local intelligent book recommendations, an interactive AI Library Assistant, comprehensive CRUD operations, fine calculation logic, reservations queue, digital library card, and real-time analytics.

---

## 🚀 Features

### 🔑 Authentication & Security
- **Role-Based Authorization**: Distinct access controls for **Admin (Librarian)** and **Student Members**.
- **Protected Routes**: Redirection and access guards preventing unauthorized page access.
- **Simulated Auth & Quick Login**: Auto-fill shortcuts for rapid demonstration.

### 👑 Admin Management Console
- **Admin Dashboard**: Real-time KPI statistics (Total Books, Active Loans, Overdue Books, Total Fines, Pending Holds).
- **Book Catalog CRUD**: Add, edit, delete books with automated copy availability calculations.
- **Member Management**: Register students, update profiles, view borrowing history and active loans.
- **Book Issue & Return**:
  - Validations (max 5 books per student, duplicate issue check, inactive user block).
  - Automated return processing with fine calculation (₹10/day overdue).
- **Reservation Queue**: Fulfill or cancel student holds on checked-out books.
- **Analytics & Recharts**: Monthly transaction trends, books by category pie chart, most borrowed books bar chart.
- **Activity Audit Logs**: Chronological log of all library system events.

### 🎓 Student Library Services
- **Student Dashboard**: Quick status cards for currently borrowed books, return dates, active holds, accumulated fines.
- **Browse & Search Catalog**: Filter by technical domain, search title/author/ISBN, check stock availability.
- **My Books Portal**: Tabbed view of active loans with due date countdown badges, borrowing history, and holds.
- **Intelligent Book Recommendation**:
  - Local scoring algorithm (0-100%) weighting category similarity, author affinity, global popularity, and availability.
  - Transparent match explanation breakdown for each suggestion.
- **Rule-Based Library Assistant**: Interactive AI-style chat assistant answering questions about available books, due dates, fines, reservations, and category searches.
- **Digital Library Card**: Professional student pass card with QR code (`qrcode.react`) and print/save functionality.
- **Interactive Borrow Options & E-Reader**: Select loan durations (7, 14, 30 days), fulfillment modes (pickup, digital preview, delivery), and built-in student E-Reader.
- **Notification Center**: Unread alert badges for due dates, overdue fines, and reservation fulfillments.

---

## 🛠️ Technology Stack

* **Core**: React 19, Vite, JavaScript (ES6+)
* **Routing**: React Router DOM v7
* **State Management**: React Context API (`AppContext.jsx`)
* **Styling**: Tailwind CSS v4, Lucide React & Tabler Icons
* **Data Visualization**: Recharts
* **Notifications**: React Hot Toast
* **QR Code Generation**: `qrcode.react`
* **Animations**: Motion

---

## ⚙️ Installation & Running Locally

1. **Clone or navigate to project directory**:
   ```bash
   cd Library
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. Open your browser at `http://localhost:5173` (or the local URL displayed in terminal).

---

## 🔐 Demo Login Credentials

### Admin (Librarian)
- **Email**: `admin@lms.com` | **Password**: `123456`

### Students
- **Student 1 (Aarav Sharma)**: `student@lms.com` | Password: `123456` (ID: `S001`)
- **Student 2 (Rahul Verma)**: `rahul@lms.com` | Password: `123456` (ID: `S002`)
- **Student 3 (Priya Patel)**: `priya@lms.com` | Password: `123456` (ID: `S003`)
- **Student 4 (Ananya Roy)**: `ananya@lms.com` | Password: `123456` (ID: `S004`)
- **Student 5 (Vikram Singh)**: `vikram@lms.com` | Password: `123456` (ID: `S005`)

---

## 🧠 Core Architecture & Explanations

### 💾 Static Data Architecture
- Initial mock seed data is stored in `src/data/mockData.js`.
- The application manages all entities (**Books, Members, Transactions, Reservations, Notifications, Activity Logs**) using **React Context API** (`AppContext.jsx`).
- No external databases (MongoDB, Firebase, Supabase, MySQL) or backend servers are used.
- Currently logged-in user state is synchronized with `localStorage` for session persistence across reloads.

### 🤖 Intelligent Book Recommendation Engine (`recommendationEngine.js`)
- Operates entirely offline without third-party AI APIs.
- Computes a dynamic recommendation match score (0–100%) for each candidate book based on:
  - **Category Similarity (40% Weight)**: Frequency of technical categories previously borrowed by the student.
  - **Author Similarity (25% Weight)**: Affinity toward authors read by the student.
  - **Global Book Popularity (25% Weight)**: Historical checkout count across all members.
  - **Novelty & Stock Availability (10% Weight)**: Excludes currently checked-out titles and prioritizes in-stock items.

### 💬 Rule-Based Library Assistant (`LibraryAssistant.jsx`)
- Interactive chat UI operating locally on React Context state.
- Employs natural language query matching to understand and answer:
  - *"Show available books"*
  - *"When are my books due?"*
  - *"Do I have any fine?"*
  - *"Show my reservations"*
  - *"Recommend books"*
  - *"Show AI / Programming / Database books"*

---

## 📁 Project Structure

```text
src/
│
├── components/
│   ├── common/         # Navbar, Sidebar, ProtectedRoute, Modal, SearchBar, Loading, EmptyState, FloatingNavbar
│   ├── books/          # BookList, BookCard, BookForm, BookDetails, BookFilters, BorrowOptionsModal, EBookReaderModal
│   ├── members/        # MemberList, MemberForm, MemberDetails
│   ├── transactions/   # TransactionList, IssueBookForm, ReturnBook
│   ├── reservations/   # ReservationList, ReserveBook
│   ├── analytics/      # StatsCards, TransactionChart, CategoryChart, PopularBooksChart
│   ├── ai/             # Recommendation, RecommendationCard, LibraryAssistant
│   └── ui/             # floating-dock, special-text, demo
│
├── pages/
│   ├── Login.jsx              # Authentication login screen
│   ├── AdminPage.jsx          # Admin layout and sub-routes
│   ├── StudentPage.jsx        # Student layout and sub-routes
│   ├── StudentMyBooksView.jsx # Student borrowed books & history
│   ├── StudentProfileView.jsx # Student profile metrics
│   ├── StudentCardView.jsx    # Digital library card with QR code
│   ├── AnalyticsView.jsx      # Admin analytics dashboard
│   ├── ActivityLogView.jsx    # System activity audit logs
│   ├── NotificationsView.jsx  # Notification alert center
│   └── NotFound.jsx           # 404 page
│
├── context/
│   └── AppContext.jsx  # Global React Context state & business logic
│
├── data/
│   └── mockData.js     # Initial static in-memory seed data
│
├── utils/
│   ├── fineCalculator.js         # Overdue fine logic (₹10/day)
│   ├── recommendationEngine.js   # Local intelligent recommendation algorithm
│   ├── notificationEngine.js     # Dynamic notification helper
│   └── dateUtils.js              # Date formatting & due date calculations
│
├── App.jsx
├── main.jsx
└── index.css
```

---

## ⚠️ Important Limitations

> **This project uses static in-memory data managed via React Context.**  
> It does not connect to a backend database, cloud authentication server, or external AI API.  
> All data mutations (book CRUD, member additions, checkout transactions, returns, reservations) persist during your active browser session. Refreshing the browser resets data back to initial seed state.
#   l i b r a r y  
 