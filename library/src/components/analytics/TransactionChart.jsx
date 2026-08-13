import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useApp } from '@/context/AppContext';

const TransactionChart = ({ transactions }) => {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  const monthlyData = [
    { month: 'Mar', issued: 12, returned: 10 },
    { month: 'Apr', issued: 18, returned: 15 },
    { month: 'May', issued: 25, returned: 22 },
    { month: 'Jun', issued: 30, returned: 28 },
    { month: 'Jul', issued: 22, returned: 20 },
    { month: 'Aug', issued: transactions.filter(t => t.status === 'issued').length + 14, returned: transactions.filter(t => t.status === 'returned').length + 8 }
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-extrabold text-zinc-900 dark:text-white">Transaction Trends</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Issued vs Returned books volume over recent months</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
            <span className="text-zinc-800 dark:text-zinc-200">Issued</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
            <span className="text-zinc-800 dark:text-zinc-200">Returned</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIssued" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorReturned" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#27272a' : '#e4e4e7'} />
            <XAxis dataKey="month" stroke={isDark ? '#a1a1aa' : '#71717a'} tick={{ fontSize: 12 }} />
            <YAxis stroke={isDark ? '#a1a1aa' : '#71717a'} tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#09090b' : '#ffffff',
                borderColor: isDark ? '#27272a' : '#e4e4e7',
                borderRadius: '16px',
                color: isDark ? '#ffffff' : '#09090b',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
              itemStyle={{ fontSize: 12 }}
            />
            <Area type="monotone" dataKey="issued" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorIssued)" />
            <Area type="monotone" dataKey="returned" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorReturned)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TransactionChart;
