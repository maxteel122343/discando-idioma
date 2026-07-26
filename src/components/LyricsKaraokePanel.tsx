import { useEffect, useRef } from 'react';
import { Sentence, joinSentence } from '../types';

interface LyricsKaraokePanelProps {
  sentences: Sentence[];
  activeIndex: number;
  onSelectIndex: (idx: number) => void;
  songTitle: string;
  songArtist: string;
  completedIndices: number[];
}

/**
 * Transparent floating lyrics panel — shown on the right side in fullscreen music mode.
 * Letters float over the canvas without a solid background.
 * Active lyric line glows and is auto-scrolled to.
 */
export default function LyricsKaraokePanel({
  sentences,
  activeIndex,
  onSelectIndex,
  songTitle,
  songArtist,
  completedIndices,
}: LyricsKaraokePanelProps) {
  const activeRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to active lyric line
  useEffect(() => {
    if (activeRef.current && containerRef.current) {
      activeRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeIndex]);

  return (
    <div
      ref={containerRef}
      className="h-full overflow-y-auto pr-1 custom-scrollbar space-y-2 py-4"
      style={{ scrollbarWidth: 'thin' }}
    >
      {/* Song title at top */}
      <div className="px-2 pb-3 mb-2 border-b border-white/10 sticky top-0 bg-transparent backdrop-blur-none">
        <p className="text-[9px] font-mono font-black text-indigo-300/60 uppercase tracking-widest">
          {songArtist}
        </p>
        <h4 className="text-xs font-black text-white/70 truncate">{songTitle}</h4>
      </div>

      {sentences.map((sentence, idx) => {
        const isActive = idx === activeIndex;
        const isPast = idx < activeIndex;
        const isDone = completedIndices.includes(idx);

        return (
          <div
            key={sentence.id}
            ref={isActive ? activeRef : null}
            onClick={() => onSelectIndex(idx)}
            className="transition-all duration-700 cursor-pointer select-none px-2 py-1.5 rounded-xl"
            style={{
              opacity: isActive ? 1 : isPast ? 0.25 : 0.45,
              transform: isActive ? 'scale(1.02)' : 'scale(1)',
            }}
          >
            {/* Characters row */}
            <div
              className={`font-black leading-snug transition-all duration-500 ${
                isActive
                  ? 'text-white text-xl animate-lyric-glow'
                  : isDone
                  ? 'text-emerald-300/60 text-sm line-through'
                  : 'text-white/50 text-sm'
              }`}
            >
              {sentence.characters.join(' ')}
            </div>

            {/* Translation — only for active */}
            {isActive && sentence.translation && (
              <p
                className="text-xs text-amber-200/70 font-medium mt-0.5 animate-float-in"
                style={{ animationDelay: '0.15s' }}
              >
                {sentence.translation}
              </p>
            )}

            {/* Pinyin — only for active */}
            {isActive && sentence.pinyin && (
              <p
                className="text-[10px] text-indigo-200/60 font-mono mt-0.5 animate-float-in"
                style={{ animationDelay: '0.25s' }}
              >
                {sentence.pinyin}
              </p>
            )}
          </div>
        );
      })}

      {/* Spacer at bottom */}
      <div className="h-20" />
    </div>
  );
}
