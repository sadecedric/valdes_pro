'use client';

import { useState } from 'react';

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  );
}

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 px-3 py-3.5">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Écris ta question..."
        disabled={disabled}
        className="flex-1 bg-violet-50 dark:bg-slate-800 text-gray-900 dark:text-white placeholder-violet-400/80 dark:placeholder-slate-500 rounded-full px-5 py-3.5 text-[15px] border border-violet-200/80 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        autoComplete="off"
      />
      <button
        type="submit"
        disabled={!value.trim() || disabled}
        className="flex-shrink-0 w-12 h-12 bg-[#7c3aed] hover:bg-[#6d28d9] active:scale-95 disabled:bg-violet-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-all shadow-lg shadow-violet-600/25"
        aria-label="Envoyer"
      >
        <SendIcon />
      </button>
    </form>
  );
}
