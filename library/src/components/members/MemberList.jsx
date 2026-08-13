import React, { useState, useMemo } from 'react';
import SearchBar from '../common/SearchBar';
import MemberForm from './MemberForm';
import MemberDetails from './MemberDetails';
import Modal from '../common/Modal';
import EmptyState from '../common/EmptyState';
import { useApp } from '../../context/AppContext';
import { Users, Plus, Eye, Edit, Trash2, GraduationCap, Phone, Mail, BookOpen } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

const MemberList = () => {
  const { members, addMember, updateMember, deleteMember, transactions } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [viewingMember, setViewingMember] = useState(null);

  // Departments list for filter
  const departments = useMemo(() => {
    const set = new Set(members.map(m => m.department));
    return Array.from(set).sort();
  }, [members]);

  // Compute active borrowed count & fine per member
  const memberMetrics = useMemo(() => {
    const map = {};
    members.forEach(m => {
      const userTxns = transactions.filter(t => t.memberId === m.memberId);
      const activeCount = userTxns.filter(t => t.status === 'issued').length;
      const totalFine = userTxns.reduce((acc, t) => acc + (t.fine || 0), 0);
      map[m.memberId] = { activeCount, totalFine };
    });
    return map;
  }, [members, transactions]);

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        member.name.toLowerCase().includes(term) ||
        member.memberId.toLowerCase().includes(term) ||
        member.email.toLowerCase().includes(term);

      const matchesDept = departmentFilter === 'ALL' || member.department === departmentFilter;

      return matchesSearch && matchesDept;
    });
  }, [members, searchTerm, departmentFilter]);

  const handleAddMember = (formData) => {
    addMember(formData);
    setIsAddModalOpen(false);
  };

  const handleUpdateMember = (formData) => {
    if (editingMember) {
      updateMember(editingMember.memberId, formData);
      setEditingMember(null);
    }
  };

  const handleDeleteMember = (memberId) => {
    if (window.confirm(`Are you sure you want to delete member ${memberId}?`)) {
      deleteMember(memberId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" />
            Library Members Directory
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Register new students, update contact profiles, track borrowing history, and manage membership status.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/25 flex items-center gap-2 shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Register Member
        </button>
      </div>

      {/* Search & Filter */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search by Name, Member ID (S001), or Email..."
        filterValue={departmentFilter}
        onFilterChange={setDepartmentFilter}
        filterLabel="All Departments"
        filterOptions={departments}
      />

      {/* Members Content */}
      {filteredMembers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No members found"
          description="No registered student members match your search criteria."
          actionLabel="Register Member"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-hidden bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-800/80 text-slate-300 text-xs font-semibold uppercase tracking-wider border-b border-slate-700/60">
                    <th className="py-3.5 px-4">Member Info</th>
                    <th className="py-3.5 px-4">Department</th>
                    <th className="py-3.5 px-4">Join Date</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-center">Active Loans</th>
                    <th className="py-3.5 px-4 text-center">Current Fine</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredMembers.map(member => {
                    const metrics = memberMetrics[member.memberId] || { activeCount: 0, totalFine: 0 };
                    return (
                      <tr key={member.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            {member.avatar ? (
                              <img
                                src={member.avatar}
                                alt={member.name}
                                className="w-9 h-9 rounded-full object-cover border border-zinc-700 shrink-0"
                              />
                            ) : (
                              <div className="w-9 h-9 bg-indigo-600/20 text-indigo-400 rounded-full font-bold flex items-center justify-center border border-indigo-500/20 shrink-0">
                                {member.name.charAt(0)}
                              </div>
                            )}
                            <div>
                              <div
                                onClick={() => setViewingMember(member)}
                                className="font-semibold text-white hover:text-indigo-400 cursor-pointer"
                              >
                                {member.name}
                              </div>
                              <div className="text-xs text-slate-400 font-mono">ID: {member.memberId} | {member.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">{member.department}</td>
                        <td className="py-3.5 px-4 text-slate-400 text-xs">{formatDate(member.joinDate)}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                            member.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>
                            {member.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-semibold text-indigo-400">
                          {metrics.activeCount} / 5
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono">
                          <span className={metrics.totalFine > 0 ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                            ₹{metrics.totalFine}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-1">
                          <button
                            onClick={() => setViewingMember(member)}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                            title="View Profile & History"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingMember(member)}
                            className="p-1.5 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-600/20 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteMember(member.memberId)}
                            className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-600/20 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards View */}
          <div className="grid md:hidden grid-cols-1 gap-4">
            {filteredMembers.map(member => {
              const metrics = memberMetrics[member.memberId] || { activeCount: 0, totalFine: 0 };
              return (
                <div key={member.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 bg-indigo-600/20 text-indigo-400 rounded-xl font-bold flex items-center justify-center border border-indigo-500/20">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-base">{member.name}</h4>
                        <span className="text-xs text-indigo-400 font-mono">ID: {member.memberId}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                      member.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {member.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <span>{member.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                      <span>{member.department}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                    <div>
                      Loans: <span className="font-bold text-indigo-400">{metrics.activeCount}/5</span>
                    </div>
                    <div>
                      Fine: <span className="font-bold text-amber-400">₹{metrics.totalFine}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setViewingMember(member)}
                        className="p-1.5 bg-slate-800 text-slate-300 rounded-lg"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingMember(member)}
                        className="p-1.5 bg-indigo-600/20 text-indigo-400 rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteMember(member.memberId)}
                        className="p-1.5 bg-rose-600/20 text-rose-400 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Add Member Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Student Member"
      >
        <MemberForm
          onSubmit={handleAddMember}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* Edit Member Modal */}
      <Modal
        isOpen={!!editingMember}
        onClose={() => setEditingMember(null)}
        title="Update Member Profile"
      >
        <MemberForm
          member={editingMember}
          onSubmit={handleUpdateMember}
          onCancel={() => setEditingMember(null)}
        />
      </Modal>

      {/* View Member Details Modal */}
      <Modal
        isOpen={!!viewingMember}
        onClose={() => setViewingMember(null)}
        title="Member Profile & History"
      >
        <MemberDetails member={viewingMember} />
      </Modal>
    </div>
  );
};

export default MemberList;
