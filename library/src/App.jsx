import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider, useApp } from './context/AppContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Loading from './components/common/Loading';
import Login from './pages/Login';
import AdminPage from './pages/AdminPage';
import StudentPage from './pages/StudentPage';
import NotFound from './pages/NotFound';

// Smart Index Redirect based on currentUser role
const IndexRedirect = () => {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  if (currentUser.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }
  return <Navigate to="/student" replace />;
};

function AppContent() {
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBooting(false);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  if (booting) {
    return <Loading fullScreen={true} message="WELCOME TO SMART LIBRARY MANAGEMENT" />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IndexRedirect />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Protected Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminPage />
            </ProtectedRoute>
          }
        />

        {/* Student Protected Routes */}
        <Route
          path="/student/*"
          element={
            <ProtectedRoute requiredRole="student">
              <StudentPage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AppProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0f172a',
            color: '#f8fafc',
            border: '1px solid #334155',
            borderRadius: '12px',
            fontSize: '13px'
          }
        }}
      />
      <AppContent />
    </AppProvider>
  );
}

export default App;
