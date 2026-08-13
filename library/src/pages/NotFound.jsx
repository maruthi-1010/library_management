import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { AlertTriangle, Home } from 'lucide-react';

const NotFound = () => {
  const { currentUser } = useApp();
  const homePath = currentUser?.role === 'admin' ? '/admin' : '/student';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="p-4 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-3xl mb-4 shadow-xl">
        <AlertTriangle className="w-12 h-12" />
      </div>
      <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">404 - Page Not Found</h1>
      <p className="text-slate-400 text-sm max-w-md mb-6">
        The requested library portal page does not exist or has been moved.
      </p>
      <Link
        to={homePath}
        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/25 flex items-center gap-2"
      >
        <Home className="w-4 h-4" /> Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
