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
    <div className="w-55 max-w-full" role="group" aria-label="Message vocal de bienvenue">
      <div className="flex items-center gap-2.5">
        <audio ref={audioRef} src={src} preload="metadata" aria-label="Message vocal de bienvenue" />
        <button
          type="button"
          onClick={togglePlay}
          className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white bg-green-500 hover:bg-green-400 active:bg-green-600 transition-colors"
          aria-label={isPlaying ? 'Pause' : 'Lecture'}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>

        <div className="flex-1 min-w-0">
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
            className="audio-range block w-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-500"
            style={{ background: `linear-gradient(to right, #22c55e ${progressPct}%, #9ca3af ${progressPct}%)` }}
          />
          <p className="text-[11px] mt-1 text-gray-500 dark:text-gray-400">
            {formatTime(currentTime)} / {formatTime(duration)}
          </p>
        </div>

        <button
          type="button"
          onClick={cycleSpeed}
          className="shrink-0 px-2 py-1 rounded-full text-[11px] font-bold text-green-500 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
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
