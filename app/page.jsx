'use client';

import { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import ChatBubble from '@/components/ChatBubble';
import VoiceNote from '@/components/VoiceNote';
import PlatformsCard from '@/components/PlatformsCard';
import ChatInput from '@/components/ChatInput';
import { WELCOME_MESSAGE } from '@/lib/config';
import { sendMessage } from '@/services/chatApi';

function getSessionId() {
  const key = 'dj_session_id';
  let id = sessionStorage.getItem(key);
  if (!id) { id = crypto.randomUUID(); sessionStorage.setItem(key, id); }
  return id;
}

export default function Page() {
  const [isDark, setIsDark] = useState(true);
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([
    { role: 'assistant', content: WELCOME_MESSAGE },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);
  const sessionIdRef = useRef(null);

  useEffect(() => {
    sessionIdRef.current = getSessionId();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (text) => {
    const currentHistory = history;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: 'user', text },
    ]);
    setIsLoading(true);

    try {
      const reply = await sendMessage(text, currentHistory.slice(-20), sessionIdRef.current);
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), sender: 'assistant', text: reply },
      ]);
      setHistory((prev) => [
        ...prev,
        { role: 'user', content: text },
        { role: 'assistant', content: reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: 'assistant',
          text: "Désolé, je n'ai pas pu répondre. Réessaie dans un instant.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="flex flex-col h-dvh max-w-md mx-auto bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white overflow-hidden">

        <Header isDark={isDark} onToggleTheme={() => setIsDark((d) => !d)} />

        <main className="flex-1 overflow-y-auto min-h-0 px-3 py-4 space-y-3">
          <ChatBubble sender="assistant" text={WELCOME_MESSAGE} />

          <ChatBubble sender="assistant">
            <VoiceNote src="/welcome.ogg" />
          </ChatBubble>

          {messages.map((msg) => (
            <ChatBubble key={msg.id} sender={msg.sender} text={msg.text} />
          ))}

          {isLoading && (
            <ChatBubble sender="assistant">
              <span className="flex gap-1 items-center py-0.5">
                <span className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce [animation-delay:300ms]" />
              </span>
            </ChatBubble>
          )}

          <div ref={bottomRef} />
        </main>

        <div className="flex-shrink-0 bg-gray-100 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
          <PlatformsCard />
          <ChatInput onSend={handleSend} disabled={isLoading} />
        </div>

      </div>
    </div>
  );
}
