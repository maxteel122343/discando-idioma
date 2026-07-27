import React, { useRef, useState } from 'react';
import { Plus, Radio, Lock } from 'lucide-react';
import { SongTrack } from '../data/musicPlaylist';

interface MusicVitrineProps {
  songs: SongTrack[];
  activeSongId: string;
  onSelectSong: (songId: string) => void;
  onAddSong: () => void;
  songTrophies?: Record<string, 'gold' | 'silver' | 'bronze'>;
}

export default function MusicVitrine({
  songs,
  activeSongId,
  onSelectSong,
  onAddSong,
  songTrophies = {},
}: MusicVitrineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Only show non-hidden songs
  const visibleSongs = songs.filter(s => !s.isHidden);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };
  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current.offsetLeft || 0);
    scrollRef.current.scrollLeft = scrollLeft - (x - startX);
  };

  return (
    <div className="w-full px-0 py-1">
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`flex gap-2 overflow-x-auto pb-1 select-none cursor-grab active:cursor-grabbing`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {visibleSongs.map((song, idx) => {
          const isCurrent = song.id === activeSongId;
          const isUnlocked = idx === 0 || song.isCustom || true; // always unlock for now

          return (
            <button
              key={song.id}
              onClick={() => {
                if (!isDragging) onSelectSong(song.id);
              }}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-2xl border transition-all text-left
                ${isCurrent
                  ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-indigo-500 border-transparent text-white shadow-lg shadow-pink-500/20 scale-[1.02]'
                  : isUnlocked
                    ? 'bg-white/70 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 hover:shadow-sm text-slate-800 dark:text-slate-200'
                    : 'bg-slate-100/60 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/40 opacity-50 cursor-not-allowed text-slate-500'
                }`}
              title={song.title}
              disabled={!isUnlocked}
            >
              {/* Cover bubble */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0
                bg-gradient-to-br ${song.coverGradient || 'from-indigo-400 to-pink-400'}
                ${isCurrent ? 'ring-2 ring-white/40' : ''}`}>
                {song.coverEmoji}
              </div>

              {/* Info */}
              <div className="min-w-0">
                <div className={`text-[11px] font-black truncate max-w-[80px] ${isCurrent ? 'text-white' : ''}`}>
                  {song.title}
                </div>
                <div className={`text-[9px] font-mono truncate max-w-[80px] ${isCurrent ? 'text-white/70' : 'text-slate-400'}`}>
                  {song.artist}
                </div>
              </div>

              {/* Status icon */}
              {isCurrent ? (
                <Radio size={11} className="text-white/80 animate-pulse shrink-0" />
              ) : !isUnlocked ? (
                <Lock size={10} className="shrink-0 text-slate-400" />
              ) : songTrophies?.[song.id] ? (
                <span className="text-xs shrink-0 select-none">
                  {songTrophies[song.id] === 'gold' ? '🏆' : songTrophies[song.id] === 'silver' ? '🥈' : '🥉'}
                </span>
              ) : null}
            </button>
          );
        })}

        {/* Nova Música card */}
        <button
          onClick={onAddSong}
          className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-2xl border border-dashed border-indigo-300 dark:border-indigo-800/60 bg-indigo-50/40 dark:bg-indigo-950/20 hover:bg-indigo-100/50 dark:hover:bg-indigo-950/30 hover:border-indigo-400 transition-all text-indigo-600 dark:text-indigo-400 cursor-pointer"
          title="Adicionar nova música"
        >
          <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center shrink-0">
            <Plus size={16} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-wide whitespace-nowrap">
            Nova Música
          </span>
        </button>
      </div>
    </div>
  );
}
