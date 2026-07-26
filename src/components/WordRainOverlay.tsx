import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Sentence, joinSentence } from '../types';

interface LeafWord {
  id: string;
  text: string;
  startX: number; // vw percentage
  startY: number; // vh percentage
  delay: number;
  duration: number;
  size: number;
  opacity: number;
  rotation: number;
}

interface WordRainOverlayProps {
  sentence: Sentence | null;
  trigger: number; // increment to trigger a new rain burst
  isActive: boolean;
}

/**
 * Renders falling-leaf word particles over the screen when lyrics advance.
 * Words drift from the right side of the screen toward the orbit area.
 * Rendered via Portal so it sits above everything.
 */
export default function WordRainOverlay({ sentence, trigger, isActive }: WordRainOverlayProps) {
  const [leaves, setLeaves] = useState<LeafWord[]>([]);
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!isActive || !sentence || sentence.characters.length === 0) return;

    // Clear old timeouts
    timeoutRefs.current.forEach(t => clearTimeout(t));
    timeoutRefs.current = [];

    // Spawn leaf particles for each word in the sentence
    const newLeaves: LeafWord[] = sentence.characters.map((char, i) => ({
      id: `${trigger}-${i}-${char}`,
      text: char,
      // Start from right side (70-100vw), drift across
      startX: 72 + Math.random() * 20,
      startY: 5 + Math.random() * 50,
      delay: i * 0.18 + Math.random() * 0.3,
      duration: 1.2 + Math.random() * 0.8,
      size: 14 + Math.floor(Math.random() * 12),
      opacity: 0.55 + Math.random() * 0.35,
      rotation: -20 + Math.random() * 40,
    }));

    setLeaves(prev => [...prev, ...newLeaves]);

    // Remove leaves after their animations complete
    const maxDuration = Math.max(...newLeaves.map(l => (l.delay + l.duration) * 1000)) + 200;
    const cleanup = setTimeout(() => {
      setLeaves(prev => prev.filter(l => !newLeaves.some(nl => nl.id === l.id)));
    }, maxDuration);
    timeoutRefs.current.push(cleanup);

    return () => {
      timeoutRefs.current.forEach(t => clearTimeout(t));
    };
  }, [trigger, isActive]);

  if (!isActive || leaves.length === 0) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 30,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {leaves.map(leaf => (
        <div
          key={leaf.id}
          style={{
            position: 'absolute',
            left: `${leaf.startX}vw`,
            top: `${leaf.startY}vh`,
            fontSize: `${leaf.size}px`,
            fontWeight: 900,
            color: 'rgba(129, 140, 248, ' + leaf.opacity + ')',
            textShadow: '0 0 12px rgba(99,102,241,0.6)',
            animation: `leaf-fall ${leaf.duration}s cubic-bezier(0.25,0.46,0.45,0.94) ${leaf.delay}s both`,
            userSelect: 'none',
            willChange: 'transform, opacity',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {leaf.text}
        </div>
      ))}
    </div>,
    document.body
  );
}
