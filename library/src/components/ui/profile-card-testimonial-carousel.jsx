import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  Calendar,
  Clock,
  Shield,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  CheckCircle,
  AlertCircle,
  GraduationCap,
  Award,
  Hash
} from "lucide-react";
import { cn } from "../../lib/utils";

export function ProfileCardTestimonialCarousel({ member, transactions = [], reservations = [], className }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Compute student metrics
  const activeTxns = transactions.filter(t => t.status === 'issued');
  const returnedTxns = transactions.filter(t => t.status === 'returned');
  const pendingRes = reservations.filter(r => r.status === 'pending');
  const totalFine = activeTxns.reduce((sum, t) => sum + (t.fine || 0), 0);

  // Default avatars / cover fallback images
  const defaultAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80";
  const bookCover1 = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80";
  const bookCover2 = "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80";

  // Build 3 library profile slides for logged-in user
  const slides = [
    {
      id: "active-loans",
      badge: "Active Circulation",
      name: member?.name || "Student Member",
      title: `${member?.department || "Academic"} Department • ID: ${member?.memberId || "S001"}`,
      description: activeTxns.length > 0
        ? `You currently have ${activeTxns.length} active book loan(s). Ensure items are returned on or before their due dates to prevent daily overdue fines.`
        : "No active book loans currently issued. Browse the catalog to borrow physical books or read digital E-Books.",
      imageUrl: activeTxns[0]?.bookCover || bookCover1,
      stats: [
        { label: "Active Borrowed", value: `${activeTxns.length} Books` },
        { label: "Pending Fines", value: `₹${totalFine}` },
        { label: "Account Status", value: member?.status || "Active" }
      ],
      itemsList: activeTxns.slice(0, 3).map(t => ({
        title: t.bookTitle || `Book ID: ${t.bookId}`,
        subtitle: `Due: ${t.dueDate} • Fine: ₹${t.fine || 0}`
      }))
    },
    {
      id: "reservations",
      badge: "Reserved Books Queue",
      name: "Pending Reservations & Holds",
      title: `Priority Queued Items for ${member?.name || "Member"}`,
      description: pendingRes.length > 0
        ? `You have ${pendingRes.length} book reservation(s) in queue. You will receive an automated notification as soon as the copy is returned.`
        : "No active reservations on hold. You can place reservations on currently checked-out books anytime.",
      imageUrl: bookCover2,
      stats: [
        { label: "Reserved Count", value: `${pendingRes.length} Books` },
        { label: "Queue Priority", value: "High" },
        { label: "Pickup Window", value: "48 Hours" }
      ],
      itemsList: pendingRes.slice(0, 3).map(r => ({
        title: `Reserved Book ID: ${r.bookId}`,
        subtitle: `Reserved on: ${r.reservationDate} • Status: Pending Hold`
      }))
    },
    {
      id: "reading-history",
      badge: "Reading Analytics",
      name: "Circulation History & Completed Reads",
      title: `Lifetime Library Record • Joined ${member?.joinDate || "2024"}`,
      description: `Great job! You have successfully returned ${returnedTxns.length} book(s) to the institutional library. Keep exploring new academic resources and digital volumes!`,
      imageUrl: defaultAvatar,
      stats: [
        { label: "Total Returned", value: `${returnedTxns.length} Books` },
        { label: "Borrow Limit", value: "5 Max" },
        { label: "Member Grade", value: "Verified Student" }
      ],
      itemsList: returnedTxns.slice(0, 3).map(t => ({
        title: t.bookTitle || `Returned Book ID: ${t.bookId}`,
        subtitle: `Issued: ${t.issueDate} • Returned: ${t.returnDate || 'Completed'}`
      }))
    }
  ];

  const currentSlide = slides[currentIndex];

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
  const handlePrevious = () => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className={cn("w-full max-w-5xl mx-auto px-2 sm:px-4 my-4", className)}>
      {/* Desktop Layout */}
      <div className="hidden md:flex relative items-center">
        {/* Cover / Avatar Image Container */}
        <div className="w-[440px] h-[440px] rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 flex-shrink-0 shadow-2xl relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.imageUrl}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full h-full relative"
            >
              <img
                src={currentSlide.imageUrl}
                alt={currentSlide.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
              
              {/* Badge overlay */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1.5 bg-black/80 text-white border border-zinc-700 text-xs font-extrabold rounded-xl uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                  {currentSlide.badge}
                </span>
              </div>

              {/* Bottom stats overlay on image */}
              <div className="absolute bottom-4 left-4 right-4 z-10 grid grid-cols-3 gap-2 p-3 bg-zinc-900/90 border border-zinc-800 rounded-2xl backdrop-blur-md text-center">
                {currentSlide.stats.map((s, idx) => (
                  <div key={idx}>
                    <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-wider block">{s.label}</span>
                    <span className="text-xs font-bold text-white">{s.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Card Content Overlay */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl p-8 ml-[-60px] z-10 max-w-xl flex-1 text-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="space-y-4"
            >
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-lg text-xs font-bold mb-2">
                  <GraduationCap className="w-3.5 h-3.5 text-purple-400" /> Logged-In Student Profile
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  {currentSlide.name}
                </h2>
                <p className="text-xs font-bold text-zinc-400 font-mono mt-0.5">
                  {currentSlide.title}
                </p>
              </div>

              <p className="text-zinc-300 text-sm leading-relaxed bg-zinc-950/60 p-4 rounded-2xl border border-zinc-800">
                {currentSlide.description}
              </p>

              {/* Items preview list */}
              {currentSlide.itemsList && currentSlide.itemsList.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider block">
                    Library Records Preview:
                  </span>
                  <div className="space-y-1.5">
                    {currentSlide.itemsList.map((item, idx) => (
                      <div key={idx} className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between text-xs">
                        <span className="font-bold text-white truncate max-w-[240px]">{item.title}</span>
                        <span className="text-[11px] text-zinc-400 font-mono">{item.subtitle}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden max-w-sm mx-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-xl text-white space-y-4">
        <div className="w-full aspect-square bg-zinc-950 rounded-2xl overflow-hidden relative border border-zinc-800">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.imageUrl}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full relative"
            >
              <img src={currentSlide.imageUrl} alt={currentSlide.name} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 bg-black/80 text-white text-[10px] font-bold rounded-lg uppercase">
                  {currentSlide.badge}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">{currentSlide.name}</h2>
          <p className="text-xs text-zinc-400 font-mono">{currentSlide.title}</p>
          <p className="text-zinc-300 text-xs mt-2 leading-relaxed bg-zinc-950 p-3 rounded-xl border border-zinc-800">
            {currentSlide.description}
          </p>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-center items-center gap-6 mt-6">
        <button
          onClick={handlePrevious}
          aria-label="Previous slide"
          className="w-11 h-11 rounded-full bg-zinc-900 border border-zinc-800 text-white shadow-md flex items-center justify-center hover:bg-zinc-800 transition-colors active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>

        {/* Indicator Dots */}
        <div className="flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "w-3 h-3 rounded-full transition-all cursor-pointer",
                idx === currentIndex ? "bg-white scale-110 shadow-glow" : "bg-zinc-700"
              )}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          aria-label="Next slide"
          className="w-11 h-11 rounded-full bg-zinc-900 border border-zinc-800 text-white shadow-md flex items-center justify-center hover:bg-zinc-800 transition-colors active:scale-95 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}

export default ProfileCardTestimonialCarousel;
