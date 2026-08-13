import React from 'react';
import { useApp } from '../context/AppContext';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Printer, ShieldCheck, GraduationCap, Mail, Phone, BookOpen } from 'lucide-react';

const StudentCardView = () => {
  const { currentUser, members } = useApp();
  const member = members.find(m => m.memberId === currentUser?.memberId) || {
    name: currentUser?.name || 'Student Member',
    memberId: currentUser?.memberId || 'S001',
    email: currentUser?.email || 'student@lms.com',
    department: currentUser?.department || 'Computer Science',
    status: 'active'
  };

  const qrValue = `LIBRARY-MEMBER-${member.memberId}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <QrCode className="w-6 h-6 text-indigo-400" />
            Digital Library Pass Card
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Official digital identity card with scannable QR verification code for desk checkout.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-xl border border-slate-700 transition-all flex items-center gap-2 shrink-0 active:scale-95"
        >
          <Printer className="w-4 h-4" /> Print / Save Pass Card
        </button>
      </div>

      {/* Digital Library Card Box */}
      <div className="flex justify-center py-6">
        <div id="digital-library-card" className="w-full max-w-md bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/80 border-2 border-indigo-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden text-slate-100">
          
          {/* Card Top Decorative Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-md">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base tracking-tight">SMART LIBRARY</h3>
                <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider block">
                  Official Member Pass
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-lg flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified
            </span>
          </div>

          {/* Member Card Details & QR Layout */}
          <div className="py-6 flex flex-col sm:flex-row items-center gap-6">
            
            {/* Member Details Left */}
            <div className="flex-1 space-y-3 text-center sm:text-left">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Student Name</span>
                <h2 className="text-xl font-bold text-white tracking-tight">{member.name}</h2>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Member ID</span>
                <div className="text-sm font-extrabold font-mono text-indigo-400">{member.memberId}</div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Department</span>
                <div className="text-xs font-semibold text-slate-300 flex items-center justify-center sm:justify-start gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                  {member.department}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Email</span>
                <div className="text-xs text-slate-400 font-mono truncate">{member.email}</div>
              </div>
            </div>

            {/* QR Code SVG Box */}
            <div className="p-3 bg-white rounded-2xl shadow-xl flex flex-col items-center shrink-0">
              <QRCodeSVG
                value={qrValue}
                size={120}
                bgColor="#ffffff"
                fgColor="#0f172a"
                level="H"
              />
              <span className="text-[9px] font-mono text-slate-700 mt-2 font-bold tracking-widest uppercase">
                {member.memberId}
              </span>
            </div>

          </div>

          {/* Card Footer Bar */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
            <span>Scan at circulation desk for automated checkouts</span>
            <span className="font-semibold text-slate-400">AGY LMS 2.0</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentCardView;
