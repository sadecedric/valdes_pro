'use client';

import { useState, useRef, useEffect } from 'react';

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  );
}

function formatTime(sec) {
  if (!Number.isFinite(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

const SPEEDS = [1, 1.5, 2];
const WAVE_HEIGHTS = [8, 14, 22, 12, 28, 36, 20, 12, 24, 32, 18, 10, 26, 38, 30, 16, 24, 12, 34, 22, 14, 28, 36, 18, 10, 24, 16, 30, 20, 12];

export default function VoiceNote({ src }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [speedIndex, setSpeedIndex] = useState(0);
  const [error, setError] = useState('');
  const speed = SPEEDS[speedIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    const onPlay = () => { setIsPlaying(true); setError(''); };
    const onPause = () => setIsPlaying(false);
    const onEnded = () => { audio.currentTime = 0; setIsPlaying(false); setCurrentTime(0); };
    const onError = () => { setIsPlaying(false); setError('Impossible de lire le message vocal. Réessaie.'); };

    onLoadedMetadata();
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('durationchange', onLoadedMetadata);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('durationchange', onLoadedMetadata);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) {
      audio.pause();
    } else {
      setError('');
      audio.play().catch(() => {
        setIsPlaying(false);
        setError('Impossible de lire le message vocal. Réessaie.');
      });
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    audio.currentTime = Number(e.target.value);
    setCurrentTime(audio.currentTime);
  };

  const cycleSpeed = () => {
    const nextIndex = (speedIndex + 1) % SPEEDS.length;
    setSpeedIndex(nextIndex);
    if (audioRef.current) audioRef.current.playbackRate = SPEEDS[nextIndex];
  };

  const progressPct = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-60 max-w-full py-1" role="group" aria-label="Message vocal de bienvenue">
      <p className="mb-3 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5">
          <rect x="9" y="2" width="6" height="12" rx="3" />
          <path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8" />
        </svg>
        Un mot de bienvenue
      </p>
      <div className="flex items-center gap-3">
        <audio ref={audioRef} src={src} preload="metadata" aria-label="Message vocal de bienvenue" />
        <button
          type="button"
          onClick={togglePlay}
          className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-white bg-emerald-600 shadow-md shadow-emerald-600/20 hover:bg-emerald-500 active:scale-95 transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-500"
          aria-label={isPlaying ? 'Pause' : 'Lecture'}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="relative h-10 rounded-md focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-200 dark:focus-within:ring-offset-gray-800">
            <svg aria-hidden="true" viewBox="0 0 150 40" preserveAspectRatio="none" className="h-full w-full text-gray-400/50 dark:text-gray-500/60">
              {WAVE_HEIGHTS.map((height, index) => (
                <rect
                  key={index}
                  x={index * 5 + 1}
                  y={(40 - height) / 2}
                  width="3"
                  height={height}
                  rx="1.5"
                  className={index / WAVE_HEIGHTS.length * 100 < progressPct ? 'fill-emerald-600 dark:fill-emerald-400' : 'fill-current'}
                />
              ))}
            </svg>
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            disabled={!duration}
            aria-label="Position de lecture"
            aria-valuetext={`${formatTime(currentTime)} sur ${formatTime(duration)}`}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-default"
          />
          </div>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between pl-14">
        <p className="text-[10px] tabular-nums text-gray-500 dark:text-gray-400">
          <span className={isPlaying ? 'text-emerald-700 dark:text-emerald-400' : ''}>{formatTime(currentTime)}</span>
          <span className="mx-1 opacity-50">/</span>{formatTime(duration)}
        </p>
        <button
          type="button"
          onClick={cycleSpeed}
          className="min-w-11 rounded-full bg-emerald-600/10 px-2 py-1 text-[11px] font-bold text-emerald-700 transition-colors hover:bg-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-400 dark:hover:bg-emerald-400/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
          aria-label={`Vitesse de lecture : ${String(speed).replace('.', ',')} fois. Changer la vitesse`}
          title="Vitesse de lecture"
        >
          {String(speed).replace('.', ',')}×
        </button>
      </div>
      {error && <p role="alert" className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
