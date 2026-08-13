import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { getBookRecommendations } from '../../utils/recommendationEngine';
import { calculateFine } from '../../utils/fineCalculator';
import { formatDate, getDaysRemaining } from '../../utils/dateUtils';
import { Bot, User, Send } from 'lucide-react';

const LibraryAssistant = () => {
  const { books, transactions, reservations, currentUser } = useApp();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `Hello ${currentUser?.name || 'Student'}! 👋 I am your Smart Library Assistant. I can help you search books, check your due dates, calculate active fines, or recommend your next technical read.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const quickPrompts = [
    "Show available books",
    "What books do I have?",
    "When are my books due?",
    "Do I have any fine?",
    "Show my reservations",
    "Recommend books",
    "Show AI books"
  ];

  const handleSend = (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const responseText = processQuery(query);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 400);
  };

  const processQuery = (query) => {
    const q = query.toLowerCase();
    const studentMemberId = currentUser?.memberId;

    if (q.includes('fine') || q.includes('due fee') || q.includes('penalty')) {
      if (!studentMemberId) return "You must be logged in as a student to check individual fines.";
      const myTxns = transactions.filter(t => t.memberId === studentMemberId && t.status === 'issued');
      let totalFine = 0;
      let overdueCount = 0;

      myTxns.forEach(t => {
        const fineData = calculateFine(t.dueDate);
        if (fineData.fine > 0) {
          totalFine += fineData.fine;
          overdueCount++;
        }
      });

      if (totalFine > 0) {
        return `⚠️ You currently have an active fine of ₹${totalFine} across ${overdueCount} overdue book(s). Please return them at the library desk as soon as possible.`;
      } else {
        return `✅ Good news! You currently have ₹0 in fines. All your active checkouts are within their due dates.`;
      }
    }

    if (q.includes('my book') || q.includes('what books do i have') || q.includes('due') || q.includes('when are my')) {
      if (!studentMemberId) return "Please log in to view your borrowed books.";
      const myIssued = transactions.filter(t => t.memberId === studentMemberId && t.status === 'issued');
      if (myIssued.length === 0) return "You currently have 0 books checked out.";

      let listStr = `You currently have ${myIssued.length} book(s) checked out:\n\n`;
      myIssued.forEach((t, i) => {
        const book = books.find(b => b.id === t.bookId);
        const daysLeft = getDaysRemaining(t.dueDate);
        const title = book ? book.title : t.bookId;
        const dueText = daysLeft < 0 ? `OVERDUE by ${Math.abs(daysLeft)} day(s)!` : `Due in ${daysLeft} day(s) (${formatDate(t.dueDate)})`;
        listStr += `${i + 1}. ${title}\n   📅 ${dueText}\n`;
      });
      return listStr;
    }

    if (q.includes('reservation') || q.includes('hold') || q.includes('reserved')) {
      if (!studentMemberId) return "Please log in as a student to check your book reservations.";
      const myRes = reservations.filter(r => r.memberId === studentMemberId);
      if (myRes.length === 0) return "You currently have no active or past book reservations.";

      let resp = `You have ${myRes.length} reservation record(s):\n\n`;
      myRes.forEach((r, i) => {
        const book = books.find(b => b.id === r.bookId);
        const title = book ? book.title : r.bookId;
        resp += `${i + 1}. ${title}\n   Status: ${r.status.toUpperCase()} (Requested on ${formatDate(r.reservationDate)})\n`;
      });
      return resp;
    }

    if (q.includes('available book') || q.includes('how many books are available') || q.includes('available')) {
      const avail = books.filter(b => b.availableCopies > 0);
      let resp = `There are currently ${avail.length} available title(s) in stock:\n\n`;
      avail.slice(0, 6).forEach((b, i) => {
        resp += `${i + 1}. ${b.title} (${b.category}) — ${b.availableCopies} copy left\n`;
      });
      return resp;
    }

    if (q.includes('recommend') || q.includes('suggest') || q.includes('what should i read')) {
      const recs = getBookRecommendations(studentMemberId, books, transactions).slice(0, 4);
      if (recs.length === 0) return "Explore our catalog to start building your reading preferences!";

      let resp = `✨ Top Intelligent Recommendations for you:\n\n`;
      recs.forEach((r, i) => {
        resp += `${i + 1}. ${r.book.title} (${r.score}% Match)\n   💡 ${r.matchReasons[0]}\n`;
      });
      return resp;
    }

    return `I can help you with questions about available books, your due dates, fines, reservations, or category searches. Try asking:\n• "Show available books"\n• "When are my books due?"\n• "Do I have any fine?"\n• "Show my reservations"`;
  };

  return (
    <div className="space-y-4 text-zinc-950 dark:text-zinc-50">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Bot className="w-6 h-6 text-zinc-900 dark:text-zinc-100" />
          Smart Library Assistant
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
          Interactive AI assistant for instant book discovery, due date checks, fine calculations, and recommendations.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xl overflow-hidden flex flex-col h-[600px]">
        <div className="px-5 py-3.5 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-black dark:bg-white text-white dark:text-black rounded-xl flex items-center justify-center font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white leading-tight">Library Assistant</h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Offline Rules Engine</p>
            </div>
          </div>
          <span className="px-2.5 py-1 text-[10px] font-bold bg-black dark:bg-white text-white dark:text-black rounded-full">
            Active
          </span>
        </div>

        <div className="flex-1 p-5 overflow-y-auto space-y-4 custom-scrollbar bg-zinc-50/40 dark:bg-black">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[85%] ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.sender === 'user' ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                msg.sender === 'user'
                  ? 'bg-black text-white dark:bg-white dark:text-black rounded-tr-none shadow-md font-medium'
                  : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-tl-none shadow-sm'
              }`}>
                {msg.text}
                <span className={`text-[10px] block mt-1.5 opacity-60 text-right ${msg.sender === 'user' ? 'text-zinc-300 dark:text-zinc-700' : 'text-zinc-500'}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-zinc-500 text-xs p-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 w-fit">
              <Bot className="w-4 h-4 animate-spin text-zinc-900 dark:text-zinc-100" />
              <span>Assistant is generating response...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-2.5 sm:p-3 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 overflow-x-auto flex items-center gap-2 custom-scrollbar">
          <span className="text-[10px] sm:text-[11px] font-bold text-zinc-400 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
            Prompts:
          </span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 bg-white dark:bg-zinc-800 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-800 dark:text-zinc-200 shrink-0 transition-all font-semibold"
            >
              {prompt}
            </button>
          ))}
        </div>

        <div className="p-3 sm:p-4 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask AI Assistant about books, due dates, fines..."
              className="flex-1 min-w-0 px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="p-2.5 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 disabled:opacity-40 text-white dark:text-black rounded-xl transition-all shadow-md active:scale-95 shrink-0 font-bold"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default LibraryAssistant;
