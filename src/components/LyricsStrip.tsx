import { useEffect, useRef } from 'react';
import { Sentence } from '../types';

interface LyricsStripProps {
  sentences: Sentence[];
  activeIndex: number;
  onSelectIndex: (idx: number) => void;
  completedIndices: number[];
}

/**
 * Spotify-style horizontal lyrics strip.
 * Shows prev / current / next lines.
 * Current line is bright & large, others are faded.
 */
export default function LyricsStrip({
  sentences,
  activeIndex,
  onSelectIndex,
  completedIndices,
}: LyricsStripProps) {
  const prevSentence = activeIndex > 0 ? sentences[activeIndex - 1] : null;
  const currentSentence = sentences[activeIndex] ?? null;
  const nextSentence = activeIndex < sentences.length - 1 ? sentences[activeIndex + 1] : null;

  const currentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    currentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [activeIndex]);

  return (
    <div className="w-full bg-gradient-to-t from-indigo-950/70 via-slate-900/50 to-transparent backdrop-blur-sm px-4 py-4 space-y-1 select-none border-t border-white/5 rounded-b-2xl">
      
      {/* Previous line */}
      {prevSentence && (
        <button
          onClick={() => onSelectIndex(activeIndex - 1)}
          className="w-full text-center transition-all duration-500 cursor-pointer group"
        >
          <p className="text-sm text-white/30 font-bold group-hover:text-white/50 transition-colors leading-snug">
            {prevSentence.characters.join(' ')}
          </p>
        </button>
      )}

      {/* Current line — highlighted */}
      {currentSentence && (
        <div ref={currentRef} className="w-full text-center py-1">
          <p className="text-lg sm:text-xl font-black text-white leading-snug tracking-wide animate-lyric-glow">
            {currentSentence.characters.join(' ')}
          </p>
          {currentSentence.translation && (
            <p className="text-xs text-amber-300/70 font-medium mt-0.5 animate-float-in">
              {currentSentence.translation}
            </p>
          )}
          {currentSentence.pinyin && (
            <p className="text-[10px] text-indigo-300/60 font-mono mt-0.5 animate-float-in" style={{ animationDelay: '0.1s' }}>
              {currentSentence.pinyin}
            </p>
          )}
        </div>
      )}

      {/* Next line */}
      {nextSentence && (
        <button
          onClick={() => onSelectIndex(activeIndex + 1)}
          className="w-full text-center transition-all duration-500 cursor-pointer group"
        >
          <p className="text-sm text-white/25 font-bold group-hover:text-white/45 transition-colors leading-snug">
            {nextSentence.characters.join(' ')}
          </p>
        </button>
      )}

      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-1 pt-1">
        {sentences.slice(Math.max(0, activeIndex - 3), Math.min(sentences.length, activeIndex + 4)).map((_, i) => {
          const absIdx = Math.max(0, activeIndex - 3) + i;
          const isActive = absIdx === activeIndex;
          const isDone = completedIndices.includes(absIdx);
          return (
            <button
              key={absIdx}
              onClick={() => onSelectIndex(absIdx)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'w-4 h-1.5 bg-indigo-400'
                  : isDone
                  ? 'w-1.5 h-1.5 bg-emerald-400/60'
                  : 'w-1.5 h-1.5 bg-white/20'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
