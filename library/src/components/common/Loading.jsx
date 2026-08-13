import React from 'react';
import BookDriftLoader from '../ui/jelly-fish';

const Loading = ({ message = "BOOKS • DISCOVERY • KNOWLEDGE • WISDOM", fullScreen = false }) => {
  if (fullScreen) {
    return <BookDriftLoader message={message} />;
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 text-zinc-400 space-y-4">
      <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-white shadow-md animate-bounce">
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
      <div className="text-center space-y-1">
        <h3 className="text-base font-bold text-white uppercase tracking-wider">
          {message}
        </h3>
        <p className="text-xs text-zinc-400 font-medium">Loading catalog data...</p>
      </div>
    </div>
  );
};

export default Loading;
