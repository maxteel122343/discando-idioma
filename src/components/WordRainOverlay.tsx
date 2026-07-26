import { useEffect, useRef, useState } from 'react';
import { Sentence } from '../types';

interface LeafWord {
  id: string;
  text: string;
  x: number; // % of container width
  y: number; // % of container height
  delay: number;
  duration: number;
  size: number;
  opacity: number;
  fadeEarly: boolean; // some words vanish sooner to reduce visual noise
}

interface WordRainOverlayProps {
  sentence: Sentence | null;
  trigger: number;
  isActive: boolean;
}

/**
 * Peripheral leaf-fall words — positioned BEHIND orbit cards, never in center.
 * Parent must have position:relative and overflow:hidden.
 * z-index:1 keeps words behind the interactive orbit cards (z-index ~10+).
 */
export default function WordRainOverlay({ sentence, trigger, isActive }: WordRainOverlayProps) {
  const [leaves, setLeaves] = useState<LeafWord[]>([]);
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!isActive || !sentence || sentence.characters.length === 0) return;

    timeoutRefs.current.forEach(t => clearTimeout(t));

    // Peripheral zones — 6 safe areas around the orbit, never in center
    // Center exclusion: roughly 30-70% x, 25-75% y
    const zones = [
      { xMin: 2,  xMax: 22, yMin: 5,  yMax: 45  }, // left-top
      { xMin: 2,  xMax: 22, yMin: 50, yMax: 90  }, // left-bottom
      { xMin: 75, xMax: 96, yMin: 5,  yMax: 45  }, // right-top
      { xMin: 75, xMax: 96, yMin: 50, yMax: 90  }, // right-bottom
      { xMin: 25, xMax: 65, yMin: 4,  yMax: 22  }, // top-center
      { xMin: 25, xMax: 65, yMin: 78, yMax: 95  }, // bottom-center
    ];

    // Pick max 3 words (reduce visual noise)
    const chars = [...sentence.characters];
    const count = Math.min(chars.length, 3);
    const picked = chars.sort(() => Math.random() - 0.5).slice(0, count);

    const newLeaves: LeafWord[] = picked.map((char, i) => {
      const zone = zones[Math.floor(Math.random() * zones.length)];
      return {
        id: `${trigger}-${i}-${char}`,
        text: char,
        x: zone.xMin + Math.random() * (zone.xMax - zone.xMin),
        y: zone.yMin + Math.random() * (zone.yMax - zone.yMin),
        delay: i * 0.22 + Math.random() * 0.3,
        duration: 1.4 + Math.random() * 0.9,
        size: 13 + Math.floor(Math.random() * 9),
        opacity: 0.35 + Math.random() * 0.25,
        fadeEarly: Math.random() > 0.5, // 50% of words fade quicker
      };
    });

    setLeaves(prev => [...prev, ...newLeaves]);

    // Clean up after the longest animation
    const maxMs = Math.max(...newLeaves.map(l => (l.delay + l.duration) * 1000)) + 300;
    const cleanup = setTimeout(() => {
      setLeaves(prev => prev.filter(l => !newLeaves.some(nl => nl.id === l.id)));
    }, maxMs);
    timeoutRefs.current.push(cleanup);

    return () => { timeoutRefs.current.forEach(t => clearTimeout(t)); };
  }, [trigger, isActive]);

  if (!isActive || leaves.length === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        // z-index 1: behind orbit cards (they are ~z-10+) but above canvas bg
        zIndex: 1,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {leaves.map(leaf => (
        <div
          key={leaf.id}
          style={{
            position: 'absolute',
            left: `${leaf.x}%`,
            top: `${leaf.y}%`,
            fontSize: `${leaf.size}px`,
            fontWeight: 800,
            color: `rgba(129, 140, 248, ${leaf.opacity})`,
            textShadow: '0 0 8px rgba(99,102,241,0.4)',
            // fadeEarly words use a shorter animation to reduce visual clutter
            animation: `leaf-fall ${leaf.fadeEarly ? leaf.duration * 0.7 : leaf.duration}s cubic-bezier(0.25,0.46,0.45,0.94) ${leaf.delay}s both`,
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
