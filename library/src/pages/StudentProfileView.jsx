import React from 'react';
import { useApp } from '../context/AppContext';
import { UserCheck, Mail, Phone, GraduationCap, Calendar, Shield, ArrowRightLeft, CheckCircle, IndianRupee } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

import ProfileCardTestimonialCarousel from '../components/ui/profile-card-testimonial-carousel';

const StudentProfileView = () => {
  const { currentUser, members, transactions, reservations } = useApp();

  const member = members.find(m => m.memberId === currentUser?.memberId) || {
    name: currentUser?.name || 'Student',
    memberId: currentUser?.memberId || 'S001',
    email: currentUser?.email || 'student@lms.com',
    phone: currentUser?.phone || '+91 98765 43210',
    department: currentUser?.department || 'Computer Science',
    joinDate: '2024-08-15',
    status: 'active'
  };

  const studentTxns = transactions.filter(t => t.memberId === member.memberId);
  const currentlyBorrowed = studentTxns.filter(t => t.status === 'issued').length;
  const totalReturned = studentTxns.filter(t => t.status === 'returned').length;
  const currentFine = studentTxns.reduce((sum, t) => sum + (t.fine || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-indigo-400" />
          My Student Library Profile
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Your personal academic library account overview, membership status, and transaction metrics.
        </p>
      </div>

      {/* Logged-In Student Profile & Library Items Carousel */}
      <ProfileCardTestimonialCarousel
        member={member}
        transactions={studentTxns}
        reservations={reservations.filter(r => r.memberId === member.memberId)}
      />

      {/* Main Profile Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        
        {/* User Banner */}
        <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-800">
          <div className="w-20 h-20 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center text-white text-3xl font-extrabold shadow-lg shadow-indigo-600/30">
            {member.name.charAt(0)}
          </div>
          <div className="text-center sm:text-left space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-extrabold text-white">{member.name}</h2>
              <span className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                member.status === 'active'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
                {member.status} Account
              </span>
            </div>
            <p className="text-sm font-mono text-indigo-400 font-bold">Student ID: {member.memberId}</p>
            <p className="text-xs text-slate-400 font-medium">{member.department} Department</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 flex items-center gap-3">
            <Mail className="w-5 h-5 text-indigo-400 shrink-0" />
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Email Address</span>
              <span className="font-semibold text-slate-200 font-mono text-xs">{member.email}</span>
            </div>
          </div>

          <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 flex items-center gap-3">
            <Phone className="w-5 h-5 text-indigo-400 shrink-0" />
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Phone Number</span>
              <span className="font-semibold text-slate-200">{member.phone}</span>
            </div>
          </div>

          <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 flex items-center gap-3">
            <GraduationCap className="w-5 h-5 text-indigo-400 shrink-0" />
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Academic Dept</span>
              <span className="font-semibold text-slate-200">{member.department}</span>
            </div>
          </div>

          <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 flex items-center gap-3">
            <Calendar className="w-5 h-5 text-indigo-400 shrink-0" />
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Member Since</span>
              <span className="font-semibold text-slate-200">{formatDate(member.joinDate)}</span>
            </div>
          </div>

          <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 flex items-center gap-3">
            <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Borrowing Privilege</span>
              <span className="font-semibold text-emerald-400 text-xs">Standard (Max 5 Books)</span>
            </div>
          </div>
        </div>

        {/* Borrowing Statistics Highlight */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-5 bg-gradient-to-br from-indigo-900/30 to-slate-900 border border-indigo-500/20 rounded-2xl text-center space-y-1">
            <ArrowRightLeft className="w-5 h-5 text-indigo-400 mx-auto" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Books Borrowed</span>
            <div className="text-2xl font-extrabold text-indigo-400">{currentlyBorrowed} / 5</div>
            <span className="text-[10px] text-slate-500">Currently checked out</span>
          </div>

          <div className="p-5 bg-gradient-to-br from-emerald-900/30 to-slate-900 border border-emerald-500/20 rounded-2xl text-center space-y-1">
            <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Books Returned</span>
            <div className="text-2xl font-extrabold text-emerald-400">{totalReturned}</div>
            <span className="text-[10px] text-slate-500">Completed returns</span>
          </div>

          <div className="p-5 bg-gradient-to-br from-amber-900/30 to-slate-900 border border-amber-500/20 rounded-2xl text-center space-y-1">
            <IndianRupee className="w-5 h-5 text-amber-400 mx-auto" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Current Fine</span>
            <div className={`text-2xl font-extrabold ${currentFine > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              ₹{currentFine}
            </div>
            <span className="text-[10px] text-slate-500">Overdue fees</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentProfileView;
