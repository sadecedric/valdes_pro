'use client';

import { useState } from 'react';
import { PLATFORMS, WHATSAPP_URL } from '@/lib/config';

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5 text-emerald-500">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function OneXBetLogo() {
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1a5ca8] text-[10px] font-black text-white">
      1X
    </span>
  );
}

export default function PlatformsCard() {
  const [copiedName, setCopiedName] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  const handleCopy = async (code, name) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedName(name);
      setTimeout(() => setCopiedName(null), 1500);
    } catch {
      // Clipboard non disponible
    }
  };

  return (
    <div className="px-4 pt-3 pb-1">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          Plateformes &amp; code promo
        </p>
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className="text-xs font-bold text-violet-600 hover:text-violet-500 dark:text-violet-400 transition-colors"
        >
          {collapsed ? 'Afficher' : 'Réduire'}
        </button>
      </div>

      {!collapsed && (
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          {PLATFORMS.map((p) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2.5 text-sm font-bold text-slate-800 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              title={`Rejoindre ${p.name}`}
            >
              <OneXBetLogo />
              {p.name}
            </a>
          ))}
        </div>
      )}

      <div className="mt-2 flex items-center gap-2">
        {PLATFORMS.slice(0, 1).map((p) => (
          <button
            key={p.code}
            type="button"
            onClick={() => handleCopy(p.code, p.name)}
            className="flex items-center gap-2 rounded-xl border-2 border-dashed border-violet-400 px-3 py-2.5 text-sm font-extrabold tracking-wide text-violet-700 transition-colors hover:bg-violet-50 dark:text-violet-300 dark:hover:bg-violet-500/10"
            title={`Copier le code ${p.code}`}
            aria-label={`Copier le code ${p.code}`}
          >
            {p.code}
            {copiedName === p.name ? <CheckIcon /> : <CopyIcon />}
          </button>
        ))}

        {WHATSAPP_URL && (
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25d366] px-4 py-3 text-sm font-bold text-white shadow-md shadow-emerald-500/20 transition-colors hover:bg-[#1fbe5a] active:scale-[0.99]"
          >
            <WhatsAppIcon />
            Mon WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}
