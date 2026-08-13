import React from 'react';
import { useApp } from '../context/AppContext';
import EmptyState from '../components/common/EmptyState';
import { History, Clock, User, Activity } from 'lucide-react';
import { formatDateTime } from '../utils/dateUtils';

const ActivityLogView = () => {
  const { activityLogs, users } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <History className="w-6 h-6 text-indigo-400" />
          System Activity & Audit Logs
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Chronological record of all administrator and student actions, book issues, returns, additions, and updates.
        </p>
      </div>

      {activityLogs.length === 0 ? (
        <EmptyState
          icon={History}
          title="No activity recorded"
          description="System actions will be logged here as users interact with the library portal."
        />
      ) : (
        <div className="overflow-hidden bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-800/80 text-slate-300 text-xs font-semibold uppercase border-b border-slate-700/60">
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Action</th>
                  <th className="py-3.5 px-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {activityLogs.map(log => {
                  const user = users.find(u => u.id === log.userId);
                  return (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 text-xs font-mono text-slate-400 shrink-0">
                        {formatDateTime(log.timestamp)}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{user ? user.name : `User #${log.userId}`}</div>
                        <div className="text-[11px] text-slate-500 font-mono capitalize">{user?.role || 'System'}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold rounded-lg inline-flex items-center gap-1">
                          <Activity className="w-3 h-3" />
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-300 leading-relaxed">
                        {log.description}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityLogView;
