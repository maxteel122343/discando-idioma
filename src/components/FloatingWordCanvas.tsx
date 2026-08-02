import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FloatingWord, Sentence } from '../types';
import { LanguageConfig } from '../data/languages';
import { playTick, playDialRelease, playSuccess, playError } from '../utils/audio';
import { Sparkles, Trash2, HelpCircle, AlertCircle, RefreshCw, Globe, Palette, Lightbulb, ChevronDown, Check, LayoutGrid, Volume2, Mic, MicOff } from 'lucide-react';

interface FloatingWordCanvasProps {
  sentences: Sentence[];
  completedSentenceIds: string[];
  activeSequence: string[];
  activeWordIds: string[];
  currentCategory: string;
  selectedDifficulty: 'Todos' | 'Fácil' | 'Médio' | 'Difícil';
  onSentenceCompleted: (sentence: Sentence) => void;
  onSequenceUpdate: (seq: string[], wordIds: string[]) => void;
  onClearSequence: () => void;
  onDialError?: () => void;
  isReviewMode: boolean;
  reviewSentenceId: string | null;
  onExitReview: () => void;
  onNextReviewSentence: () => void;
  cardSpeed: number; // 0 (Parado), 0.5 (Lento), 1 (Normal), 1.5 (Rápido), 2 (Muito Rápido)
  cardMovementType: 'drift' | 'orbit';
  isEbookMode?: boolean;
  activeEbookSentence?: Sentence | null;
  ebookSentences?: Sentence[];
  isMusicMode?: boolean;
  activeMusicSentence?: Sentence | null;
  isPoetryMode?: boolean;
  activePoetrySentence?: Sentence | null;
  phoneticLabel?: string;
  isHintEnabled?: boolean;
  onToggleHint?: () => void;
  isMonochrome?: boolean;
  onToggleMonochrome?: () => void;
  currentLanguage?: LanguageConfig;
  allLanguages?: LanguageConfig[];
  onSelectLanguage?: (langId: string) => void;
  onTriggerVoiceGuidance?: () => void;
  musicTimer?: number;
  isMusicPlaying?: boolean;
}

export default function FloatingWordCanvas({
  sentences,
  completedSentenceIds,
  activeSequence,
  activeWordIds,
  currentCategory,
  selectedDifficulty,
  onSentenceCompleted,
  onSequenceUpdate,
  onClearSequence,
  onDialError,
  isReviewMode,
  reviewSentenceId,
  onExitReview,
  onNextReviewSentence,
  cardSpeed,
  cardMovementType,
  isEbookMode = false,
  activeEbookSentence = null,
  ebookSentences = [],
  isMusicMode = false,
  activeMusicSentence = null,
  isPoetryMode = false,
  activePoetrySentence = null,
  phoneticLabel = 'PRONÚNCIA',
  isHintEnabled = true,
  onToggleHint,
  isMonochrome = false,
  onToggleMonochrome,
  currentLanguage,
  allLanguages = [],
  onSelectLanguage,
  onTriggerVoiceGuidance,
  musicTimer,
  isMusicPlaying = false,
}: FloatingWordCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [words, setWords] = useState<FloatingWord[]>([]);
  const [glowState, setGlowState] = useState<'idle' | 'dragOver' | 'success' | 'error'>('idle');
  const [hintWordId, setHintWordId] = useState<string | null>(null);
  const [draggedWordId, setDraggedWordId] = useState<string | null>(null);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isVoiceDialActive, setIsVoiceDialActive] = useState(false);
  const [voiceDialFeedback, setVoiceDialFeedback] = useState<string | null>(null);
  const [listeningWordId, setListeningWordId] = useState<string | null>(null);

  const getFontSize = (text: string) => {
    if (text.length <= 1) return "text-sm sm:text-2xl";
    if (text.length <= 3) return "text-xs sm:text-xl";
    if (text.length <= 6) return "text-[10px] sm:text-lg";
    return "text-[8px] sm:text-sm";
  };

  const getPaddingClass = (text: string) => {
    if (text.length <= 1) return "px-2.5 py-1.5 sm:px-5 sm:py-3";
    if (text.length <= 3) return "px-2 py-1.5 sm:px-4 sm:py-2.5";
    return "px-1.5 py-1 sm:px-3 sm:py-2";
  };

  // Find the review sentence if we are in review mode
  const reviewSentence = isReviewMode && reviewSentenceId ? sentences.find(s => s.id === reviewSentenceId) : null;

  // Determine the list of target sentences for the current category/difficulty
  const filteredSentences = sentences.filter((s) => {
    const categoryMatch = currentCategory === 'Todos' || s.category === currentCategory;
    const difficultyMatch = selectedDifficulty === 'Todos' || s.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  // Keep track of sentences remaining to be completed in the filtered pool
  const remainingSentences = filteredSentences.filter(
    (s) => !completedSentenceIds.includes(s.id)
  );

  // If in poetry mode, music mode or ebook mode, target the active sentence line.
  const targetSentences = isPoetryMode && activePoetrySentence
    ? [activePoetrySentence]
    : isMusicMode && activeMusicSentence
    ? [activeMusicSentence]
    : isEbookMode && activeEbookSentence
    ? [activeEbookSentence]
    : (isReviewMode && reviewSentence)
    ? [reviewSentence]
    : (remainingSentences.length > 0 ? remainingSentences : filteredSentences);

  // Compile all characters/words needed for current target sentences + distractors
  useEffect(() => {
    if (targetSentences.length === 0) return;

    // Extract all correct words from targets
    const correctWords = targetSentences.flatMap((s) => s.characters);
    
    // Pull distractors from other sentences in the active dataset
    let distractors: string[] = [];
    if (isEbookMode && ebookSentences && ebookSentences.length > 0) {
      const otherSentences = ebookSentences.filter(s => s.id !== activeEbookSentence?.id);
      if (otherSentences.length > 0) {
        const ebookChars = otherSentences.flatMap(s => s.characters);
        const uniqueEbookChars = Array.from(new Set(ebookChars)).filter(c => !correctWords.includes(c));
        if (uniqueEbookChars.length > 0) {
          distractors = uniqueEbookChars.slice(0, 10);
        }
      }
    } else if (sentences && sentences.length > 0) {
      const otherSentences = sentences.filter(s => !targetSentences.some(ts => ts.id === s.id));
      const otherWords = (otherSentences.length > 0 ? otherSentences : sentences).flatMap(s => s.characters);
      distractors = Array.from(new Set(otherWords)).filter(c => !correctWords.includes(c)).slice(0, 8);
    }

    const uniquePool = Array.from(new Set([...correctWords, ...distractors]));

    // Generate FloatingWord objects with initial positions and slow, random drift velocities
    const newWords: FloatingWord[] = uniquePool.map((text, idx) => {
      // Avoid spawning directly in the center (50, 50). Push to perimeter.
      let x = 10 + Math.random() * 80;
      let y = 10 + Math.random() * 80;
      
      const dx = x - 50;
      const dy = y - 50;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const minCenterDist = 36;
      const maxCenterDist = 46;

      if (dist < minCenterDist || dist > maxCenterDist || cardMovementType === 'orbit') {
        const angle = Math.atan2(dy, dx) || (idx * 0.5);
        // Distribute nicely in tracks outside the central dial ring (36% to 46% radius)
        const desiredRadius = minCenterDist + 2 + ((idx % 3) * 3);
        x = 50 + Math.cos(angle) * desiredRadius;
        y = 50 + Math.sin(angle) * desiredRadius;
      }

      // Slow drift velocity
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.04 + Math.random() * 0.05; // extremely gentle drift

      return {
        id: `word-${idx}-${text}`,
        text,
        x: Math.max(5, Math.min(95, x)),
        y: Math.max(5, Math.min(95, y)),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: text.length > 1 ? 1.05 : 1, // slightly larger for multi-character words
        isPlaced: activeWordIds.includes(`word-${idx}-${text}`),
      };
    });

    setWords(newWords);
    onClearSequence();
    setHintWordId(null);
  }, [currentCategory, selectedDifficulty, sentences, isReviewMode, reviewSentenceId, isEbookMode, activeEbookSentence, ebookSentences, isMusicMode, activeMusicSentence, isPoetryMode, activePoetrySentence]);

  // Sync isPlaced flag with activeWordIds
  useEffect(() => {
    setWords((prev) =>
      prev.map((w) => ({
        ...w,
        isPlaced: activeWordIds.includes(w.id),
      }))
    );
  }, [activeWordIds]);

  // Physics loop: gentle floating and bouncing off boundaries and central zone
  useEffect(() => {
    let animationFrameId: number;

    const updatePhysics = () => {
      setWords((prevWords) =>
        prevWords.map((word, idx) => {
          // If placed or currently dragged, don't update its position with drifting physics
          if (word.isPlaced || word.id === draggedWordId) {
            return word;
          }

          // If paused, keep positions
          if (cardSpeed === 0) {
            return word;
          }

          const isMobile = typeof window !== 'undefined' ? window.innerWidth < 640 : false;
          let nextX = word.x;
          let nextY = word.y;
          let nextVx = word.vx;
          let nextVy = word.vy;

          if (cardMovementType === 'orbit') {
            // Orbital tracking around the center (50, 50)
            const dx = word.x - 50;
            const dy = word.y - 50;
            let radius = Math.sqrt(dx * dx + dy * dy);
            
            // Lock radius so cards NEVER enter the dialing zone or drift out of boundaries on narrow mobile screens
            const maxRadius = isMobile ? 42 : 47;
            if (radius < 36) radius = 36;
            if (radius > maxRadius) radius = maxRadius;

            const angle = Math.atan2(dy, dx);
            // Alternate clockwise and counter-clockwise direction based on index
            const direction = (idx % 2 === 0) ? 1 : -1;
            const angularVelocity = 0.004 * cardSpeed * direction;
            const nextAngle = angle + angularVelocity;

            nextX = 50 + Math.cos(nextAngle) * radius;
            nextY = 50 + Math.sin(nextAngle) * radius;
          } else {
            // Gentle random drift
            nextX = word.x + word.vx * cardSpeed;
            nextY = word.y + word.vy * cardSpeed;

            // Bounce off container boundaries with safer margins on mobile
            const minX = isMobile ? 12 : 6;
            const maxX = isMobile ? 88 : 94;
            const minY = isMobile ? 10 : 6;
            const maxY = isMobile ? 90 : 94;

            if (nextX < minX || nextX > maxX) {
              nextVx = -word.vx;
              nextX = Math.max(minX, Math.min(maxX, nextX));
            }
            if (nextY < minY || nextY > maxY) {
              nextVy = -word.vy;
              nextY = Math.max(minY, Math.min(maxY, nextY));
            }

            // Bounce off central dialing ring (strict clearance at radius 36)
            const dx = nextX - 50;
            const dy = nextY - 50;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const minCenterDist = 36;

            if (dist < minCenterDist) {
              // Calculate bounce vector away from center
              const angle = Math.atan2(dy, dx);
              nextVx = Math.cos(angle) * Math.abs(word.vx);
              nextVy = Math.sin(angle) * Math.abs(word.vy);
              // Push just outside the radius
              nextX = 50 + Math.cos(angle) * (minCenterDist + 0.5);
              nextY = 50 + Math.sin(angle) * (minCenterDist + 0.5);
            }
          }

          return {
            ...word,
            x: nextX,
            y: nextY,
            vx: nextVx,
            vy: nextVy,
          };
        })
      );

      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    animationFrameId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animationFrameId);
  }, [draggedWordId, cardSpeed, cardMovementType]);

  // Dynamic vibrant border colors matching the mockup
  const getVibrantColors = (index: number) => {
    const palette = [
      { border: 'border-orange-400 dark:border-orange-500', text: 'text-orange-600 dark:text-orange-400', bg: 'hover:bg-orange-50/60 dark:hover:bg-orange-950/20' },
      { border: 'border-teal-400 dark:border-teal-500', text: 'text-teal-600 dark:text-teal-400', bg: 'hover:bg-teal-50/60 dark:hover:bg-teal-950/20' },
      { border: 'border-pink-400 dark:border-pink-500', text: 'text-pink-600 dark:text-pink-400', bg: 'hover:bg-pink-50/60 dark:hover:bg-pink-950/20' },
      { border: 'border-blue-400 dark:border-blue-500', text: 'text-blue-600 dark:text-blue-400', bg: 'hover:bg-blue-50/60 dark:hover:bg-blue-950/20' },
      { border: 'border-indigo-400 dark:border-indigo-500', text: 'text-indigo-600 dark:text-indigo-400', bg: 'hover:bg-indigo-50/60 dark:hover:bg-indigo-950/20' },
    ];
    return palette[index % palette.length];
  };

  // Triggered when a word is successfully dragged and released over the central zone
  const handleWordDialed = (word: FloatingWord) => {
    if (activeWordIds.includes(word.id)) return;

    // Mark as placed locally right away to avoid lingering on canvas
    setWords((prev) =>
      prev.map((w) => (w.id === word.id ? { ...w, isPlaced: true } : w))
    );

    playTick();
    const newSeq = [...activeSequence, word.text];
    const newWordIds = [...activeWordIds, word.id];
    onSequenceUpdate(newSeq, newWordIds);

    // Glow the central dial zone temporarily
    setGlowState('dragOver');
    setTimeout(() => setGlowState('idle'), 300);

    // Validate the current sequence
    validateSequence(newSeq, newWordIds);
  };

  // Validate current dialed sequence
  const validateSequence = (sequence: string[], wordIds: string[]) => {
    const sequenceStr = sequence.join('');

    // Check if it matches any target sentence
    const matchedSentence = targetSentences.find(
      (s) => s.characters.join('') === sequenceStr
    );

    if (matchedSentence) {
      // Success match!
      setGlowState('success');
      playSuccess();
      
      setTimeout(() => {
        onSentenceCompleted(matchedSentence);
        onClearSequence();
        setGlowState('idle');
        setHintWordId(null);
      }, 700);
      return;
    }

    // Check if the current sequence is still a valid prefix for ANY target sentence
    const isPrefixOfAny = targetSentences.some((s) => {
      const fullStr = s.characters.join('');
      return fullStr.startsWith(sequenceStr);
    });

    if (!isPrefixOfAny && sequence.length > 0) {
      // Incorrect path, trigger failure feedback
      setGlowState('error');
      playError();
      if (onDialError) onDialError();
      
      // Auto-clear after a short delay so the user can try again
      setTimeout(() => {
        onClearSequence();
        setGlowState('idle');
      }, 1000);
    }
  };

  // Drag handlers using Framer Motion
  const [topZIndex, setTopZIndex] = useState<number>(30);

  // Organize unplaced words into a clean, un-overlapping ring around the center
  const handleOrganizeWords = () => {
    playTick();
    const unplaced = words.filter((w) => !w.isPlaced);
    if (unplaced.length === 0) return;

    const count = unplaced.length;
    const stepAngle = (2 * Math.PI) / count;
    const radius = 39; // percent distance from center (50, 50)

    setWords((prev) =>
      prev.map((w) => {
        if (w.isPlaced) return w;
        const indexInUnplaced = unplaced.findIndex((u) => u.id === w.id);
        if (indexInUnplaced === -1) return w;

        const angle = indexInUnplaced * stepAngle - Math.PI / 2;
        const newX = 50 + Math.cos(angle) * radius;
        const newY = 50 + Math.sin(angle) * radius;

        return {
          ...w,
          x: Math.max(8, Math.min(92, newX)),
          y: Math.max(8, Math.min(92, newY)),
          vx: 0,
          vy: 0,
        };
      })
    );
  };

  const handleDragStart = (wordId: string) => {
    playTick();
    setDraggedWordId(wordId);
    setHintWordId(null);
    setTopZIndex((prev) => {
      const nextZ = prev + 1;
      setWords((prevWords) =>
        prevWords.map((w) => (w.id === wordId ? { ...w, zIndex: nextZ } : w))
      );
      return nextZ;
    });
  };

  const handleDrag = (event: any, info: any) => {
    const centerEl = document.getElementById('central-dial-zone');
    if (centerEl) {
      const rect = centerEl.getBoundingClientRect();
      const pointerX = event?.clientX || info?.point?.x || 0;
      const pointerY = event?.clientY || info?.point?.y || 0;
      const distance = Math.sqrt(
        Math.pow(pointerX - (rect.left + rect.width / 2), 2) +
        Math.pow(pointerY - (rect.top + rect.height / 2), 2)
      );
      if (distance < rect.width / 2 + 50) {
        if (glowState !== 'dragOver') setGlowState('dragOver');
      } else {
        if (glowState === 'dragOver') setGlowState('idle');
      }
    }
  };

  const handleDragEnd = (event: any, info: any, word: FloatingWord) => {
    setDraggedWordId(null);
    const centerEl = document.getElementById('central-dial-zone');
    const containerEl = containerRef.current;

    const clientX =
      event?.clientX ||
      event?.changedTouches?.[0]?.clientX ||
      info?.point?.x ||
      0;
    const clientY =
      event?.clientY ||
      event?.changedTouches?.[0]?.clientY ||
      info?.point?.y ||
      0;

    let isDroppedInCenter = false;

    if (centerEl) {
      const rect = centerEl.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.sqrt(
        Math.pow(clientX - centerX, 2) + Math.pow(clientY - centerY, 2)
      );

      // 1. Check distance with generous buffer (+70px) so dropping near/over the disk works instantly
      if (distance < rect.width / 2 + 70) {
        isDroppedInCenter = true;
      }

      // 2. Check element directly under drop pointer
      if (!isDroppedInCenter && typeof document !== 'undefined') {
        const elemUnder = document.elementFromPoint(clientX, clientY);
        if (elemUnder && (centerEl.contains(elemUnder) || elemUnder.id === 'central-dial-zone')) {
          isDroppedInCenter = true;
        }
      }
    }

    if (isDroppedInCenter) {
      handleWordDialed(word);
    } else {
      playDialRelease();
      setGlowState('idle');

      // Update position so it STAYS EXACTLY WHERE THE USER DROPPED IT!
      if (containerEl && (clientX > 0 || clientY > 0)) {
        const containerRect = containerEl.getBoundingClientRect();
        const relativeX = clientX - containerRect.left;
        const relativeY = clientY - containerRect.top;

        const newXPercent = Math.max(6, Math.min(94, (relativeX / containerRect.width) * 100));
        const newYPercent = Math.max(6, Math.min(94, (relativeY / containerRect.height) * 100));

        setWords((prevWords) =>
          prevWords.map((w) =>
            w.id === word.id
              ? {
                  ...w,
                  x: newXPercent,
                  y: newYPercent,
                  vx: 0,
                  vy: 0,
                }
              : w
          )
        );
      }
    }
  };

  // Single click / tap to start focused pronunciation practice for the word card
  const handleWordCardClick = (word: FloatingWord) => {
    // Bring to top
    setTopZIndex((prev) => {
      const nextZ = prev + 1;
      setWords((prevWords) =>
        prevWords.map((w) => (w.id === word.id ? { ...w, zIndex: nextZ } : w))
      );
      return nextZ;
    });

    if (listeningWordId) return; // avoid double trigger

    // Fallback: If no mic support, just dial immediately
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      handleWordDialed(word);
      return;
    }

    playTick();
    setListeningWordId(word.id);

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = currentLanguage?.ttsCode || 'zh-CN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.trim();
      console.log(`[Focused Voice Dial] Heard: "${transcript}" (Expected: "${word.text}")`);

      const cleanTranscript = transcript.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,"").trim();
      const cleanExpected = word.text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,"").trim();

      if (cleanTranscript.includes(cleanExpected) || cleanExpected.includes(cleanTranscript)) {
        playSuccess();
        handleWordDialed(word);
      } else {
        playError();
        setGlowState('error');
        setTimeout(() => setGlowState('idle'), 1000);
      }
      setListeningWordId(null);
    };

    recognition.onerror = () => {
      setListeningWordId(null);
    };

    recognition.onend = () => {
      setListeningWordId(null);
    };

    try {
      recognition.start();
    } catch(e) {
      setListeningWordId(null);
    }
  };

  // Provide a hint: highlight the next required character
  const triggerHint = () => {
    if (targetSentences.length === 0) return;

    // Pick a sentence to help with (the first incomplete target)
    const targetSentence = targetSentences[0];
    const currentIndex = activeSequence.length;

    if (currentIndex < targetSentence.characters.length) {
      const nextCharNeeded = targetSentence.characters[currentIndex];
      // Find a floating word that matches this character and is not already placed
      const matchingWord = words.find(
        (w) => w.text === nextCharNeeded && !w.isPlaced
      );
      if (matchingWord) {
        setHintWordId(matchingWord.id);
        playTick();
        
        // Remove hint highlight after 3 seconds
        setTimeout(() => {
          setHintWordId((curr) => (curr === matchingWord.id ? null : curr));
        }, 3000);
      }
    } else {
      // If sequence is already complete but not triggered, show hint on the first word of another target
      const match = words.find((w) => !w.isPlaced);
      if (match) {
        setHintWordId(match.id);
      }
    }
  };

  // Compute the exact next character required by the active target sentence
  const activeTargetSentence = targetSentences[0];
  const nextRequiredChar = (activeTargetSentence && activeSequence.length < activeTargetSentence.characters.length)
    ? activeTargetSentence.characters[activeSequence.length]
    : null;

  // Speech Recognition loop for Voice Dialer
  const isVoiceDialActiveRef = useRef(isVoiceDialActive);
  const nextRequiredCharRef = useRef(nextRequiredChar);
  const wordsRef = useRef(words);

  useEffect(() => {
    isVoiceDialActiveRef.current = isVoiceDialActive;
  }, [isVoiceDialActive]);

  useEffect(() => {
    nextRequiredCharRef.current = nextRequiredChar;
  }, [nextRequiredChar]);

  useEffect(() => {
    wordsRef.current = words;
  }, [words]);

  useEffect(() => {
    if (!isVoiceDialActive) {
      setVoiceDialFeedback(null);
      return;
    }

    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      setVoiceDialFeedback('💡 Dica: Diga a palavra em voz alta!');
      setIsVoiceDialActive(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    // Configure recognition based on current study language
    recognition.lang = currentLanguage?.ttsCode || 'zh-CN';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setVoiceDialFeedback(`🎙️ Ouvindo... Diga: "${nextRequiredCharRef.current || ''}"`);
    };

    recognition.onresult = (event: any) => {
      if (!isVoiceDialActiveRef.current) return;
      const lastResultIndex = event.results.length - 1;
      const result = event.results[lastResultIndex];
      const transcript = result[0].transcript.trim();

      const expected = nextRequiredCharRef.current;
      if (!expected) return;

      setVoiceDialFeedback(`🎙️ Ouvindo... Diga: "${expected}"`);

      // Normalization for comparison (removes punctuation, lowercases)
      const cleanTranscript = transcript.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,"").trim();
      const cleanExpected = expected.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,"").trim();

      // Check if they match
      if (cleanTranscript.includes(cleanExpected) || cleanExpected.includes(cleanTranscript)) {
        const matchingWord = wordsRef.current.find(w => w.text === expected && !w.isPlaced);
        if (matchingWord) {
          // Stop mic temporarily to avoid capture of success bells/voice guide
          try { recognition.stop(); } catch(e){}
          setVoiceDialFeedback(`✨ Correto! Discando: "${expected}"...`);

          // Perform dial
          handleWordDialed(matchingWord);

          // Restart listening after brief delay
          setTimeout(() => {
            if (isVoiceDialActiveRef.current) {
              try { recognition.start(); } catch(e){}
            }
          }, 1500);
        }
      }
    };

    recognition.onerror = () => {
      if (isVoiceDialActiveRef.current) {
        try { recognition.start(); } catch(e){}
      }
    };

    recognition.onend = () => {
      if (isVoiceDialActiveRef.current) {
        try { recognition.start(); } catch(e){}
      }
    };

    try {
      recognition.start();
    } catch(e){}

    return () => {
      try { recognition.stop(); } catch(e){}
    };
  }, [isVoiceDialActive, currentLanguage]);

  return (
    <div 
      ref={containerRef}
      className={`relative flex-1 h-[440px] xs:h-[480px] sm:h-[550px] lg:h-full min-h-[420px] sm:min-h-[500px] w-full rounded-3xl overflow-hidden shadow-inner transition-colors duration-300 ${
        isMonochrome
          ? "bg-slate-100 dark:bg-zinc-950 border-2 border-zinc-900 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
          : "bg-[#F5F3FF] dark:bg-[#120E25] border border-indigo-150 dark:border-indigo-950"
      }`}
    >
      {/* Decorative Dial Telephone Lines Background */}
      <div className={`absolute inset-0 opacity-[0.06] dark:opacity-[0.08] pointer-events-none select-none ${isMonochrome ? "grayscale" : ""}`}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="grid" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={isMonochrome ? "#000000" : "#4F46E5"} stopOpacity="0.5" />
              <stop offset="100%" stopColor={isMonochrome ? "#000000" : "#4F46E5"} stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          {/* Concentric spider-web like dialing rings */}
          {[10, 20, 30, 40, 50, 60, 70, 80].map((radius) => (
            <circle
              key={radius}
              cx="50%"
              cy="50%"
              r={`${radius}%`}
              fill="none"
              stroke={isMonochrome ? "#000000" : "#4F46E5"}
              strokeWidth="0.75"
            />
          ))}
          {/* Radial division lines */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const x2 = 50 + Math.cos(rad) * 100;
            const y2 = 50 + Math.sin(rad) * 100;
            return (
              <line
                key={angle}
                x1="50%"
                y1="50%"
                x2={`${x2}%`}
                y2={`${y2}%`}
                stroke={isMonochrome ? "#000000" : "#4F46E5"}
                strokeWidth="0.75"
              />
            );
          })}
        </svg>
      </div>

      {/* Top Header Row with Language Selector & Controls (Directly on canvas arena) */}
      <div className="absolute top-2 left-2 right-2 md:top-4 md:left-4 md:right-4 z-30 flex items-center justify-between gap-1.5 pointer-events-none select-none">
        
        {/* Left Side: Game Mode Label & Language Selector */}
        <div className="flex flex-wrap items-center gap-1.5 pointer-events-auto relative">
          
          {/* Category / Game Mode Pill */}
          {isReviewMode ? (
            <div className="flex items-center gap-1 bg-violet-600 text-white dark:bg-violet-900 backdrop-blur-md px-2 py-1 rounded-full text-[9px] md:text-[11px] font-mono tracking-wider font-bold border border-violet-500 shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)] animate-pulse" />
              MODO REVISÃO
            </div>
          ) : (
            <div className={`flex items-center gap-1 backdrop-blur-md px-2 py-1 rounded-full text-[9px] md:text-[11px] font-mono tracking-wider font-bold border shadow-sm ${
              isMonochrome
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-900 dark:border-zinc-700"
                : "bg-white/80 dark:bg-slate-900/80 border-indigo-100 dark:border-indigo-900/50 text-indigo-650 dark:text-indigo-450"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isMonochrome ? "bg-zinc-900 dark:bg-zinc-100" : "bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.6)]"}`} />
              CAT: {currentCategory.toUpperCase()}
            </div>
          )}

          {/* Quick Language Selector Button in Arena Header */}
          {currentLanguage && onSelectLanguage && (
            <div className="relative pointer-events-auto">
              <button
                onClick={() => { playTick(); setIsLangMenuOpen(!isLangMenuOpen); }}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-[9px] md:text-[11px] font-black transition-all shadow-md active:scale-95 cursor-pointer border ${
                  isMonochrome
                    ? "bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100"
                    : "bg-indigo-600 text-white hover:bg-indigo-700 border-indigo-500 shadow-indigo-500/20"
                }`}
                title="Mudar Idioma Diretamente na Tela do Discador"
              >
                <span className="text-xs">{currentLanguage.flag}</span>
                <span className="font-extrabold tracking-wide">{currentLanguage.name}</span>
                <ChevronDown size={10} className={`transition-transform duration-200 ${isLangMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Language Selection Popover */}
              <AnimatePresence>
                {isLangMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-10 left-0 mt-1 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-1.5 z-50 space-y-0.5 max-h-64 overflow-y-auto custom-scrollbar"
                  >
                    <p className="text-[8px] font-mono font-black text-slate-400 uppercase tracking-wider px-2 py-0.5">
                      Idiomas Disponíveis
                    </p>
                    {allLanguages.map((lang) => {
                      const isSelected = lang.id === currentLanguage.id;
                      return (
                        <button
                          key={lang.id}
                          onClick={() => {
                            playTick();
                            onSelectLanguage(lang.id);
                            setIsLangMenuOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-xl text-[10px] font-bold transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-extrabold"
                              : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs">{lang.flag}</span>
                            <span>{lang.name}</span>
                          </div>
                          {isSelected && <Check size={12} className="text-indigo-600 dark:text-indigo-400" />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Theme Palette Toggle Button (Monochrome P&B vs Vibrant Colors) - Hidden on mobile */}
          {onToggleMonochrome && (
            <button
              onClick={() => { playTick(); onToggleMonochrome(); }}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all shadow-sm active:scale-95 border cursor-pointer ${
                isMonochrome
                  ? "bg-black text-white dark:bg-white dark:text-black border-zinc-800 dark:border-zinc-200 ring-2 ring-zinc-400/40"
                  : "bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 border-indigo-100 dark:border-indigo-900/50 hover:bg-slate-100"
              }`}
              title="Alternar Tema: Monocromático P&B ou Cores Vibrantes"
            >
              <Palette size={13} />
              <span>{isMonochrome ? "P&B Minimalista" : "Cores"}</span>
            </button>
          )}

          {/* Hint Toggle Button - Hidden on mobile */}
          {onToggleHint && (
            <button
              onClick={() => { playTick(); onToggleHint(); }}
              className={`hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all shadow-sm active:scale-95 border cursor-pointer ${
                isHintEnabled
                  ? "bg-amber-400 text-slate-950 border-amber-500 shadow-amber-500/20 font-black"
                  : "bg-white/80 dark:bg-slate-900/80 text-slate-400 border-slate-200 dark:border-slate-800 opacity-80"
              }`}
              title="Ativar/Desativar Dicas que mostram a próxima palavra"
            >
              <Lightbulb size={13} className={isHintEnabled ? "fill-slate-950" : ""} />
              <span>Dicas {isHintEnabled ? "ON" : "OFF"}</span>
            </button>
          )}

          {/* Always Active Voice Dialer Toggle */}
          <button
            onClick={() => { playTick(); setIsVoiceDialActive(!isVoiceDialActive); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all shadow-sm active:scale-95 border cursor-pointer ${
              isVoiceDialActive
                ? "bg-red-650 text-white border-red-700 shadow-md ring-2 ring-red-400/40 animate-pulse font-black"
                : "bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 border-indigo-100 dark:border-indigo-900/50 hover:bg-slate-100"
            }`}
            title="Discar por Voz: Fale a palavra correta para discá-la automaticamente"
          >
            {isVoiceDialActive ? <Mic size={13} className="text-white animate-bounce" /> : <MicOff size={13} />}
            <span>Voz {isVoiceDialActive ? "Ativa" : "Desativa"}</span>
          </button>

        </div>

        {/* Right Side Action Buttons */}
        <div className="flex items-center gap-1 md:gap-2 pointer-events-auto">
          <button
            onClick={handleOrganizeWords}
            title="Espalhar e Organizar Palavras Sem Sobrepor"
            className="flex items-center justify-center p-1.5 md:p-2.5 rounded-xl md:rounded-2xl bg-white hover:bg-indigo-50 dark:bg-slate-900 dark:hover:bg-indigo-950/20 shadow-md border border-indigo-100 dark:border-indigo-900 transition-all text-indigo-600 dark:text-indigo-400 active:scale-95 cursor-pointer"
          >
            <LayoutGrid className="w-3.5 h-3.5 md:w-4.5 md:h-4.5" />
          </button>
          {isReviewMode && (
            <button
              onClick={onNextReviewSentence}
              title="Pular / Próxima Frase"
              className="flex items-center justify-center p-1.5 md:p-2.5 rounded-xl md:rounded-2xl bg-white hover:bg-violet-50 dark:bg-slate-900 dark:hover:bg-violet-950/20 shadow-md border border-violet-100 dark:border-violet-900 transition-all text-violet-600 dark:text-violet-400 active:scale-95 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 md:w-4.5 md:h-4.5" />
            </button>
          )}
          <button
            onClick={triggerHint}
            title="Destacar Próxima Palavra"
            className="flex items-center justify-center p-1.5 md:p-2.5 rounded-xl md:rounded-2xl bg-white hover:bg-amber-50 dark:bg-slate-900 dark:hover:bg-amber-950/20 shadow-md border border-indigo-100 dark:border-indigo-900 transition-all text-amber-500 active:scale-95 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 md:w-4.5 md:h-4.5" />
          </button>
          <button
            onClick={onClearSequence}
            disabled={activeSequence.length === 0}
            title="Limpar Disco Central"
            className="flex items-center justify-center p-1.5 md:p-2.5 rounded-xl md:rounded-2xl bg-white hover:bg-red-50 hover:text-red-500 dark:bg-slate-900 dark:hover:bg-red-950/50 dark:hover:text-red-400 shadow-md border border-indigo-100 dark:border-indigo-900 transition-all text-slate-500 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-500 active:scale-95 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 md:w-4.5 md:h-4.5" />
          </button>
        </div>
      </div>

      {/* Floating Words Pool */}
      <div className="absolute inset-0 z-10">
        <AnimatePresence>
          {words.map((word, idx) => {
            if (word.isPlaced) return null; // hide if registered in the center

            const isNextTarget = isHintEnabled && nextRequiredChar !== null && word.text === nextRequiredChar;
            const isHinted = hintWordId === word.id || isNextTarget;
            const colors = getVibrantColors(idx);
            
            // Generate slight hand-crafted rotation effect based on index
            const rotationDegrees = (idx % 3) * 6 - 6;

            const isListeningThis = listeningWordId === word.id;

            return (
              <motion.div
                key={word.id}
                drag
                dragSnapToOrigin={false}
                dragMomentum={false}
                onDragStart={() => handleDragStart(word.id)}
                onDrag={handleDrag}
                onDragEnd={(e, info) => handleDragEnd(e, info, word)}
                onClick={() => handleWordCardClick(word)}
                style={{
                  left: `${word.x}%`,
                  top: `${word.y}%`,
                  touchAction: 'none',
                  zIndex: word.zIndex || 10,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing"
                whileHover={{ scale: 1.12, rotate: rotationDegrees + 3 }}
                whileTap={{ scale: 0.95 }}
                initial={{ scale: 0.9, rotate: rotationDegrees }}
                animate={{ scale: 1 }}
              >
                <div
                  className={`
                    relative flex flex-col items-center justify-center ${getPaddingClass(word.text)} rounded-2xl sm:rounded-3xl select-none transition-all border-2
                    ${
                      isListeningThis
                        ? 'bg-red-500 text-white border-red-600 ring-4 ring-red-400/80 scale-110 shadow-2xl animate-pulse'
                        : isMonochrome
                        ? isHinted
                          ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-4 border-zinc-900 dark:border-zinc-100 ring-4 ring-zinc-400/80 animate-bounce scale-110 shadow-2xl'
                          : 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-900 dark:border-zinc-100 shadow-md hover:bg-zinc-100 dark:hover:bg-zinc-800'
                        : isHinted
                          ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-slate-900 border-amber-300 ring-4 ring-amber-400/60 animate-bounce scale-110 shadow-2xl'
                          : `bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 ${colors.border} ${colors.bg} shadow-lg`
                    }
                  `}
                >
                  {isListeningThis && (
                    <div className="absolute inset-0 bg-red-650 rounded-2xl sm:rounded-3xl flex items-center justify-center text-white z-20 animate-pulse border-2 border-red-500">
                      <Mic size={16} className="animate-bounce" />
                    </div>
                  )}
                  <span className="block text-center font-black tracking-tight mb-0.5 max-w-[120px] sm:max-w-[200px] truncate leading-tight"><span className={getFontSize(word.text)}>{word.text}</span></span>
                  <span className={`block text-[7px] sm:text-[8px] font-black tracking-widest uppercase opacity-85 ${
                    isListeningThis
                      ? 'text-white'
                      : isHinted 
                      ? isMonochrome ? 'text-zinc-200 dark:text-zinc-800 font-extrabold' : 'text-amber-950 font-extrabold' 
                      : isMonochrome ? 'text-zinc-500 dark:text-zinc-400' : colors.text
                  }`}>
                    {isListeningThis ? 'Gravando' : isHinted ? '▶ PRÓXIMA' : `${phoneticLabel}`}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Central Dial Zone (The old-fashioned dialer ring matching mockup) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <div className="relative w-[280px] h-[280px] xs:w-[320px] xs:h-[320px] sm:w-[420px] sm:h-[420px] flex items-center justify-center pointer-events-none">
          
          {/* Concentric Decorative Rings from the mock */}
          <div className={`absolute inset-0 border-4 border-dashed rounded-full animate-pulse ${
            isMonochrome ? "border-zinc-400/60 dark:border-zinc-700/60" : "border-indigo-200/60 dark:border-indigo-800/40"
          }`} />
          <div className={`absolute inset-10 border-2 rounded-full ${
            isMonochrome ? "border-zinc-300/40 dark:border-zinc-800/40" : "border-indigo-150/40 dark:border-indigo-900/30"
          }`} />

          <div
            id="central-dial-zone"
            className={`
              relative flex flex-col items-center justify-center h-48 w-48 xs:h-56 xs:w-56 sm:h-72 sm:w-72 rounded-full border-4 pointer-events-auto transition-all duration-300 shadow-2xl
              ${
                isMonochrome
                  ? glowState === 'idle'
                    ? 'bg-white dark:bg-zinc-900 border-zinc-900 dark:border-zinc-100 shadow-zinc-900/20'
                    : glowState === 'dragOver'
                    ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-900 dark:border-zinc-100 ring-8 ring-zinc-400/30 scale-[1.03]'
                    : glowState === 'success'
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 ring-12 ring-zinc-400/40 scale-[1.05]'
                    : 'bg-zinc-200 dark:bg-zinc-800 border-red-600 ring-12 ring-red-500/20 animate-shake scale-[1.02]'
                  : glowState === 'idle'
                    ? 'bg-white dark:bg-slate-900 border-indigo-500 shadow-indigo-600/15'
                    : glowState === 'dragOver'
                    ? 'bg-indigo-50/70 dark:bg-indigo-950/20 border-indigo-600 shadow-[0_25px_60px_rgba(79,70,229,0.25)] ring-8 ring-indigo-400/20 scale-[1.03]'
                    : glowState === 'success'
                    ? 'bg-emerald-50/90 dark:bg-emerald-950/20 border-emerald-500 shadow-emerald-400/30 ring-12 ring-emerald-500/20 scale-[1.05]'
                    : 'bg-red-50/90 dark:bg-red-950/20 border-red-500 shadow-red-400/30 ring-12 ring-red-500/20 animate-shake scale-[1.02]'
              }
            `}
          >
            {/* Inner Decorative Telephone Circle */}
            <div className="absolute inset-2 rounded-full border border-dashed border-indigo-100 dark:border-indigo-950 pointer-events-none" />

            {/* Central content container */}
            <div className="z-10 flex flex-col items-center justify-center text-center p-6 w-full h-full">
              {isMusicMode && musicTimer !== undefined && (
                <div className={`absolute top-4 xs:top-6 sm:top-10 flex items-center gap-1.5 px-3 py-0.5 rounded-full border text-[10px] sm:text-xs font-mono font-black uppercase shadow-sm select-none transition-all duration-300 ${
                  isMusicPlaying
                    ? 'bg-red-500/10 text-red-650 dark:text-red-400 border-red-500/20 animate-pulse'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isMusicPlaying ? 'bg-red-500 animate-ping' : 'bg-slate-400 dark:bg-slate-600'}`} />
                  <span>{musicTimer}s</span>
                </div>
              )}

              {activeSequence.length === 0 ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-center text-indigo-500 animate-pulse shadow-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <p className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mt-1">
                    SOLTE AQUI
                  </p>
                  <p className="hidden xs:block text-[10px] text-slate-400 dark:text-slate-500 px-4 leading-normal font-medium">
                    Arraste os ideogramas para o centro para discar a frase
                  </p>
                  {onTriggerVoiceGuidance && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playTick();
                        onTriggerVoiceGuidance();
                      }}
                      className="mt-1 flex items-center gap-1 px-3 py-1 rounded-full bg-violet-600 hover:bg-violet-700 text-white text-[10px] font-extrabold shadow-sm active:scale-95 transition-all cursor-pointer z-20"
                      title="Ouvir Guia de Voz da Assistente"
                    >
                      <Volume2 size={12} />
                      <span>Ouvir Guia de Voz</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 w-full">
                  {/* Dialed Letters Slots */}
                  <div className="flex flex-wrap justify-center gap-1.5 max-w-full py-1">
                    <AnimatePresence mode="popLayout">
                      {activeSequence.map((char, index) => (
                        <motion.div
                          key={`${char}-${index}`}
                          initial={{ scale: 0, y: 15, opacity: 0 }}
                          animate={{ scale: 1, y: 0, opacity: 1 }}
                          exit={{ scale: 0, y: -15, opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                          className={`
                            flex items-center justify-center h-10 px-3 rounded-xl text-base font-bold shadow-sm border select-none
                            ${
                              glowState === 'success'
                                ? 'bg-emerald-500 text-white border-emerald-400 shadow-emerald-500/20'
                                : glowState === 'error'
                                ? 'bg-red-500 text-white border-red-400 shadow-red-500/20'
                                : 'bg-gradient-to-b from-indigo-500/10 to-indigo-600/15 text-indigo-650 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
                            }
                          `}
                        >
                          {char}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold">
                    {glowState === 'success' ? (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold animate-pulse">
                        <Sparkles size={12} /> Frase Correta!
                      </span>
                    ) : glowState === 'error' ? (
                      <span className="flex items-center gap-1 text-red-600 dark:text-red-400 font-bold">
                        <AlertCircle size={12} /> Frase Incorreta!
                      </span>
                    ) : (
                      <span className="text-indigo-505 dark:text-indigo-400 animate-pulse">
                        Discando frase...
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Central Target Circle Core Graphic */}
            <div className="absolute bottom-4 text-[9px] font-mono font-bold tracking-widest text-indigo-300 dark:text-indigo-700 select-none pointer-events-none">
              LINGUODIAL v2.4
            </div>
          </div>

        </div>
      </div>

      {/* Floating Tutorial Message at Bottom - Hidden */}
      <div className="hidden absolute bottom-5 left-1/2 -translate-x-1/2 z-10 bg-white dark:bg-slate-900 border-2 border-indigo-100 dark:border-indigo-950 px-4 py-1.5 rounded-full text-[11px] text-slate-500 dark:text-slate-400 shadow-md text-center max-w-[90%] select-none pointer-events-none font-medium">
        💡 Arraste e solte ideogramas no <strong className="text-indigo-600 dark:text-indigo-400 font-bold">disco central</strong> para discar
      </div>

      {/* Voice Dial Feedback Toast/Sub-header */}
      {isVoiceDialActive && voiceDialFeedback && (
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-2 bg-red-650 text-white px-4 py-2 rounded-full shadow-lg border border-red-500 text-xs font-bold animate-pulse">
          <Mic size={14} className="animate-ping text-white shrink-0" />
          <span>{voiceDialFeedback}</span>
        </div>
      )}
    </div>
  );
}
