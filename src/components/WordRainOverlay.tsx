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
  fadeEarly: boolean;
}

interface WordRainOverlayProps {
  sentence: Sentence | null;
  trigger: number;
  isActive: boolean;
}

/**
 * Peripheral leaf-fall words.
 * Kept entirely ABOVE y=75% so they never collide or overlap with the LyricsStrip area.
 * Keeps z-index:1 to render behind the active cards.
 */
export default function WordRainOverlay({ sentence, trigger, isActive }: WordRainOverlayProps) {
  const [leaves, setLeaves] = useState<LeafWord[]>([]);
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!isActive || !sentence || sentence.characters.length === 0) return;

    timeoutRefs.current.forEach(t => clearTimeout(t));

    // Limit yMax to 68% in all zones to ensure words NEVER float or fall into the LyricsStrip (y >= 75%)
    const zones = [
      { xMin: 2,  xMax: 22, yMin: 5,  yMax: 42  }, // left-top
      { xMin: 2,  xMax: 22, yMin: 45, yMax: 68  }, // left-middle
      { xMin: 75, xMax: 96, yMin: 5,  yMax: 42  }, // right-top
      { xMin: 75, xMax: 96, yMin: 45, yMax: 68  }, // right-middle
      { xMin: 25, xMax: 65, yMin: 4,  yMax: 20  }, // top-center
    ];

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
        delay: i * 0.2 + Math.random() * 0.25,
        duration: 1.3 + Math.random() * 0.8,
        size: 13 + Math.floor(Math.random() * 8),
        opacity: 0.32 + Math.random() * 0.23,
        fadeEarly: Math.random() > 0.4, 
      };
    });

    setLeaves(prev => [...prev, ...newLeaves]);

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
        top: 0,
        left: 0,
        right: 0,
        bottom: '26%', // Stop container 26% from bottom so words are clipped before reaching lyrics
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
            fontWeight: 850,
            color: `rgba(129, 140, 248, ${leaf.opacity})`,
            textShadow: '0 0 8px rgba(99,102,241,0.4)',
            // Clip lower falling translation in leaf-fall keyframes to avoid falling too deep
            animation: `leaf-fall ${leaf.fadeEarly ? leaf.duration * 0.65 : leaf.duration}s cubic-bezier(0.25,0.46,0.45,0.94) ${leaf.delay}s both`,
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
