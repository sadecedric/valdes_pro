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
        placeholder="Écrivez votre message..."
        disabled={disabled}
        className="flex-1 bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white placeholder-gray-400 rounded-2xl px-4 py-3 text-sm border border-gray-200 dark:border-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        autoComplete="off"
      />
      <button
        type="submit"
        disabled={!value.trim() || disabled}
        className="flex-shrink-0 w-11 h-11 bg-emerald-600 hover:bg-emerald-500 active:scale-95 disabled:bg-gray-400 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-emerald-600/20"
        aria-label="Envoyer"
      >
        <SendIcon />
      </button>
    </form>
  );
}
