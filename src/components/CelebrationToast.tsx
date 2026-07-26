import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Sentence } from '../types';

interface CelebrationToastProps {
  show: boolean;
  sentence: Sentence | null;
  isReviewMode: boolean;
  joinSentence: (chars: string[]) => string;
}

/**
 * Renders the celebration toast via a React Portal directly into document.body
 * so that parent transforms/overflow don't clip the fixed overlay.
 */
export default function CelebrationToast({
  show,
  sentence,
  isReviewMode,
  joinSentence,
}: CelebrationToastProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!show || !sentence || !mounted) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        pointerEvents: 'none',
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // dark backdrop overlay
        backdropFilter: 'blur(3px)',
      }}
    >
      <div
        style={{ pointerEvents: 'auto' }}
        className="bg-[#120E25] text-white shadow-2xl border-2 border-indigo-500/80 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4 animate-slide-up w-full max-w-sm"
      >
        {/* Icon */}
        <div className="w-12 h-12 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0 shadow-inner border border-indigo-500/40 text-xl">
          {isReviewMode ? '🔁' : '🎉'}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <h5 className="text-xs font-mono font-bold tracking-widest text-orange-400 uppercase mb-0.5">
            {isReviewMode ? 'Frase Revisada! (+15 XP)' : 'Frase Desbloqueada! (+15 XP)'}
          </h5>
          <h3 className="text-xl font-black font-sans tracking-wide text-white leading-tight">
            {joinSentence(sentence.characters)}
          </h3>
          <p className="text-[12px] font-bold text-indigo-300 mt-0.5">
            {sentence.pinyin}
          </p>
          <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2">
            {sentence.translation}
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
