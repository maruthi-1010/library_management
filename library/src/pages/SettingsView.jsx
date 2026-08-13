import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Shield, Clock, IndianRupee, Save, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

const SettingsView = () => {
  const { theme, toggleTheme } = useApp();
  const [fineRate, setFineRate] = useState(10);
  const [maxLoanDays, setMaxLoanDays] = useState(14);
  const [maxBorrowLimit, setMaxBorrowLimit] = useState(5);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    toast.success('Library system settings updated successfully!');
  };

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-600 dark:text-sky-400" />
          Library System Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Configure circulation policies, loan limits, fine rates, and portal theme preferences.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Circulation Policies */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <Clock className="w-5 h-5 text-blue-600 dark:text-sky-400" />
            Circulation & Overdue Policies
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Standard Loan Term (Days)
              </label>
              <input
                type="number"
                value={maxLoanDays}
                onChange={(e) => setMaxLoanDays(Number(e.target.value))}
                min="1"
                max="90"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Overdue Fine Rate (₹ / Day)
              </label>
              <input
                type="number"
                value={fineRate}
                onChange={(e) => setFineRate(Number(e.target.value))}
                min="0"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Max Student Borrow Limit
              </label>
              <input
                type="number"
                value={maxBorrowLimit}
                onChange={(e) => setMaxBorrowLimit(Number(e.target.value))}
                min="1"
                max="20"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Display & Appearance Preferences */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <Shield className="w-5 h-5 text-blue-600 dark:text-sky-400" />
            Portal Appearance Mode
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold">Midnight Knowledge Dark Theme</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Toggle between slate light and dark dashboard modes</p>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
            >
              Current: {theme.toUpperCase()} MODE
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 active:scale-95"
          >
            <Save className="w-4 h-4" /> Save Policy Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsView;
