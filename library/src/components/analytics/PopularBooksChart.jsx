import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useApp } from '@/context/AppContext';

const PopularBooksChart = ({ books, transactions }) => {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  const checkoutMap = {};
  transactions.forEach(t => {
    checkoutMap[t.bookId] = (checkoutMap[t.bookId] || 0) + 1;
  });

  const popularData = books
    .map(b => ({
      name: b.title.length > 20 ? b.title.substring(0, 18) + '...' : b.title,
      fullTitle: b.title,
      checkouts: checkoutMap[b.id] || 0
    }))
    .sort((a, b) => b.checkouts - a.checkouts)
    .slice(0, 5);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-extrabold text-zinc-900 dark:text-white">Most Borrowed Books</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Top 5 books by total student checkouts</p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={popularData} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#27272a' : '#e4e4e7'} horizontal={false} />
            <XAxis type="number" stroke={isDark ? '#a1a1aa' : '#71717a'} tick={{ fontSize: 12 }} />
            <YAxis type="category" dataKey="name" stroke={isDark ? '#a1a1aa' : '#71717a'} tick={{ fontSize: 11 }} width={120} />
            <Tooltip
              formatter={(val) => [`${val} checkouts`, 'Total Loans']}
              labelFormatter={(label, payload) => payload[0]?.payload?.fullTitle || label}
              contentStyle={{
                backgroundColor: isDark ? '#09090b' : '#ffffff',
                borderColor: isDark ? '#27272a' : '#e4e4e7',
                borderRadius: '16px',
                color: isDark ? '#ffffff' : '#09090b'
              }}
              itemStyle={{ fontSize: 12 }}
            />
            <Bar dataKey="checkouts" fill="#2563eb" radius={[0, 8, 8, 0]} barSize={18} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PopularBooksChart;
