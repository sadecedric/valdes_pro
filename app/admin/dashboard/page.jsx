'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

function StatCard({ label, value, sub }) {
  return (
    <div className="rounded-xl p-4 bg-gray-900 border border-gray-700">
      <p className="text-[10px] uppercase tracking-widest mb-1 text-green-600">{label}</p>
      <p className="text-2xl font-bold text-white">{value ?? '—'}</p>
      {sub && <p className="text-xs mt-0.5 text-gray-500">{sub}</p>}
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [dbError, setDbError] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [page, setPage] = useState(0);
  const PER_PAGE = 20;

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.status === 401) { router.push('/admin'); return; }
      const data = await res.json();
      if (data.error) { setDbError(data.error); return; }
      setStats(data);
    } catch (e) {
      setDbError(e.message);
    }
  };

  const fetchConversations = async (offset = 0) => {
    try {
      const res = await fetch(`/api/admin/conversations?limit=${PER_PAGE}&offset=${offset}`);
      if (res.status === 401) { router.push('/admin'); return; }
      const data = await res.json();
      if (data.error) return;
      setConversations(data.conversations ?? []);
      setTotal(data.total ?? 0);
    } catch { /* silent */ }
  };

  const openConversation = async (id) => {
    setSelected(id);
    setLoadingMsgs(true);
    const res = await fetch(`/api/admin/conversations/${id}`);
    const data = await res.json();
    setMessages(data.messages ?? []);
    setLoadingMsgs(false);
  };

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin');
  };

  useEffect(() => { fetchStats(); fetchConversations(0); }, []);

  const totalPages = Math.ceil(total / PER_PAGE);
  const goPage = (n) => { setPage(n); fetchConversations(n * PER_PAGE); setSelected(null); };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-700 shadow-md">
        <p className="font-bold text-base text-white">Florian_TC — Admin</p>
        <button
          onClick={logout}
          className="text-xs px-3 py-1.5 rounded-lg text-green-400 bg-gray-800 border border-gray-700 hover:border-green-700 transition-colors"
        >
          Déconnexion
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Conversations" value={stats?.totalSessions} />
          <StatCard label="Messages" value={stats?.totalMessages} />
          <StatCard label="Aujourd'hui" value={stats?.todaySessions} sub="conversations" />
          <StatCard label="Aujourd'hui" value={stats?.todayMessages} sub="messages" />
        </div>

        {dbError && (
          <div className="rounded-xl px-4 py-3 bg-red-950 border border-red-800 text-red-300 text-xs font-mono break-all">
            Erreur DB : {dbError}
          </div>
        )}

        <div className="flex gap-4" style={{ alignItems: 'flex-start' }}>
          <div className="flex-1 min-w-0 rounded-2xl overflow-hidden bg-gray-900 border border-gray-700">
            <div className="px-4 py-3 flex items-center justify-between border-b border-gray-700">
              <p className="text-[10px] font-bold uppercase tracking-widest text-green-600">Conversations récentes</p>
              <p className="text-xs text-gray-600">{total} total</p>
            </div>

            {conversations.length === 0 ? (
              <p className="text-sm text-center py-10 text-gray-600">Aucune conversation pour l'instant.</p>
            ) : conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => openConversation(c.id)}
                className="w-full text-left px-4 py-3 transition-colors border-b border-gray-800 last:border-b-0"
                style={{
                  background: selected === c.id ? 'rgba(22,163,74,0.08)' : 'transparent',
                  borderLeft: selected === c.id ? '2px solid #16a34a' : '2px solid transparent',
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono text-green-600">{c.id.slice(0, 8)}…</span>
                  <span className="text-[11px] text-gray-600">{formatDate(c.updated_at)}</span>
                </div>
                <p className="text-sm text-gray-300 truncate">{c.first_message ?? '(vide)'}</p>
                <p className="text-[11px] mt-0.5 text-gray-600">{c.message_count} messages</p>
              </button>
            ))}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 px-4 py-3 border-t border-gray-800">
                <button
                  onClick={() => goPage(page - 1)}
                  disabled={page === 0}
                  className="text-xs px-3 py-1 rounded-lg disabled:opacity-30 text-green-400 bg-gray-800"
                >
                  ← Préc.
                </button>
                <span className="text-xs text-gray-600">{page + 1} / {totalPages}</span>
                <button
                  onClick={() => goPage(page + 1)}
                  disabled={page >= totalPages - 1}
                  className="text-xs px-3 py-1 rounded-lg disabled:opacity-30 text-green-400 bg-gray-800"
                >
                  Suiv. →
                </button>
              </div>
            )}
          </div>

          {selected && (
            <div
              className="w-80 flex-shrink-0 rounded-2xl overflow-hidden bg-gray-900 border border-gray-700"
              style={{ maxHeight: '70vh', display: 'flex', flexDirection: 'column' }}
            >
              <div className="px-4 py-3 flex items-center justify-between flex-shrink-0 border-b border-gray-700">
                <p className="text-[10px] font-bold uppercase tracking-widest text-green-600">Conversation</p>
                <button onClick={() => setSelected(null)} className="text-gray-500 text-lg leading-none">×</button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {loadingMsgs ? (
                  <p className="text-sm text-center py-6 text-gray-600">Chargement…</p>
                ) : messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className="max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed"
                      style={m.role === 'user' ? {
                        background: 'rgba(22,163,74,0.15)',
                        border: '1px solid rgba(22,163,74,0.3)',
                        color: '#bbf7d0',
                      } : {
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        color: '#94a3b8',
                      }}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
