import { useEffect, useRef, useState } from 'react';
import { Sentence } from '../types';

interface LeafWord {
  id: string;
  text: string;
  startX: number; // % of container width (right side: 60-100%)
  startY: number; // % of container height
  delay: number;
  duration: number;
  size: number;
  opacity: number;
}

interface WordRainOverlayProps {
  sentence: Sentence | null;
  trigger: number; // increment to trigger a new rain burst
  isActive: boolean;
}

/**
 * Renders falling-leaf word particles INSIDE the canvas container (no portal).
 * Parent must have position:relative and overflow:hidden.
 * Words drift across the canvas area only — they cannot escape outside.
 */
export default function WordRainOverlay({ sentence, trigger, isActive }: WordRainOverlayProps) {
  const [leaves, setLeaves] = useState<LeafWord[]>([]);
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!isActive || !sentence || sentence.characters.length === 0) return;

    timeoutRefs.current.forEach(t => clearTimeout(t));
    timeoutRefs.current = [];

    // Spawn particles for each character — start from right half of canvas
    const newLeaves: LeafWord[] = sentence.characters.map((char, i) => ({
      id: `${trigger}-${i}-${char}`,
      text: char,
      // Start from right portion of canvas (55-95% of container width)
      startX: 55 + Math.random() * 38,
      // Spread vertically across canvas (5-70% height)
      startY: 5 + Math.random() * 65,
      delay: i * 0.18 + Math.random() * 0.25,
      duration: 1.2 + Math.random() * 0.8,
      size: 14 + Math.floor(Math.random() * 12),
      opacity: 0.5 + Math.random() * 0.35,
    }));

    setLeaves(prev => [...prev, ...newLeaves]);

    const maxDuration = Math.max(...newLeaves.map(l => (l.delay + l.duration) * 1000)) + 300;
    const cleanup = setTimeout(() => {
      setLeaves(prev => prev.filter(l => !newLeaves.some(nl => nl.id === l.id)));
    }, maxDuration);
    timeoutRefs.current.push(cleanup);

    return () => {
      timeoutRefs.current.forEach(t => clearTimeout(t));
    };
  }, [trigger, isActive]);

  if (!isActive || leaves.length === 0) return null;

  return (
    // Absolutely positioned inside the canvas wrapper — overflow:hidden clips them
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 20,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {leaves.map(leaf => (
        <div
          key={leaf.id}
          style={{
            position: 'absolute',
            left: `${leaf.startX}%`,
            top: `${leaf.startY}%`,
            fontSize: `${leaf.size}px`,
            fontWeight: 900,
            color: `rgba(129, 140, 248, ${leaf.opacity})`,
            textShadow: '0 0 12px rgba(99,102,241,0.6)',
            animation: `leaf-fall ${leaf.duration}s cubic-bezier(0.25,0.46,0.45,0.94) ${leaf.delay}s both`,
            userSelect: 'none',
            willChange: 'transform, opacity',
          }}
        >
          {leaf.text}
        </div>
      ))}
    </div>
  );
}
