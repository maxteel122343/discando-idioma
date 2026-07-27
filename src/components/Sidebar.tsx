import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sentence, joinSentence } from '../types';
import { speakLanguageText, getAudioContext, playTick } from '../utils/audio';
import { 
  Volume2, 
  HelpCircle, 
  Award, 
  BookOpen, 
  TrendingUp, 
  Home, 
  Grid, 
  User, 
  ChevronRight, 
  RotateCcw, 
  BookOpenCheck,
  CheckCircle,
  Clock,
  RefreshCw,
  Bot,
  MessageSquare,
  Mic,
  MicOff,
  Sparkles,
  Send,
  Trophy
} from 'lucide-react';

interface SidebarProps {
  sentences: Sentence[];
  completedSentenceIds: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  activeDifficulty: 'Todos' | 'Fácil' | 'Médio' | 'Difícil';
  onSelectDifficulty: (difficulty: 'Todos' | 'Fácil' | 'Médio' | 'Difícil') => void;
  onResetProgress: () => void;
  userName: string;
  onUpdateUserName: (name: string) => void;
  isReviewMode: boolean;
  reviewSentenceId: string | null;
  onStartReview: (sentenceId?: string) => void;
  onExitReview: () => void;
  onNextReviewSentence: () => void;
  reviewXp: number;
  ttsCode?: string;
  totalXp: number;
  completedMusicSentenceIndices: number[];
  songTrophies: Record<string, 'gold' | 'silver' | 'bronze'>;
  dialErrorsCount: number;
  songs: any[];
}

type TabType = 'home' | 'categories' | 'review' | 'progress' | 'profile' | 'chat' | 'ranking';

export default function Sidebar({
  sentences,
  completedSentenceIds,
  activeCategory,
  onSelectCategory,
  activeDifficulty,
  onSelectDifficulty,
  onResetProgress,
  userName,
  onUpdateUserName,
  isReviewMode,
  reviewSentenceId,
  onStartReview,
  onExitReview,
  onNextReviewSentence,
  reviewXp,
  ttsCode = 'zh-CN',
  totalXp,
  completedMusicSentenceIndices,
  songTrophies,
  dialErrorsCount,
  songs,
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [expandedSentenceId, setExpandedSentenceId] = useState<string | null>(null);

  // Competitor type
  interface Competitor {
    id: string;
    name: string;
    avatar: string;
    country: string;
    isUser?: boolean;
    xp: number;
    sentences: number;
    songs: number;
    gold: number;
    silver: number;
    bronze: number;
    errors: number;
  }

  // Simulated competitors state
  const [competitors, setCompetitors] = useState<Competitor[]>(() => {
    const saved = localStorage.getItem('hanzi_dial_competitors');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'c1', name: 'Elena', avatar: '👩‍🦰', country: '🇷🇺', xp: 1450, sentences: 48, songs: 4, gold: 2, silver: 1, bronze: 0, errors: 6 },
      { id: 'c2', name: 'Kenji', avatar: '👨‍⚕️', country: '🇯🇵', xp: 1210, sentences: 39, songs: 3, gold: 1, silver: 2, bronze: 0, errors: 14 },
      { id: 'c3', name: 'Mateo', avatar: '👱‍♂️', country: '🇦🇷', xp: 980, sentences: 31, songs: 2, gold: 0, silver: 1, bronze: 2, errors: 19 },
      { id: 'c4', name: 'Emma', avatar: '👩‍⚕️', country: '🇬🇧', xp: 750, sentences: 24, songs: 1, gold: 0, silver: 0, bronze: 3, errors: 22 },
      { id: 'c5', name: 'Mei-Ling', avatar: '👩‍🎓', country: '🇨🇳', xp: 1650, sentences: 55, songs: 5, gold: 3, silver: 1, bronze: 0, errors: 4 },
      { id: 'c6', name: 'Lucas', avatar: '👦', country: '🇫🇷', xp: 620, sentences: 18, songs: 1, gold: 0, silver: 0, bronze: 2, errors: 25 },
      { id: 'c7', name: 'Sophia', avatar: '👧', country: '🇩🇪', xp: 480, sentences: 12, songs: 0, gold: 0, silver: 0, bronze: 1, errors: 12 },
    ];
  });

  type SortKey = 'xp' | 'sentences' | 'songs' | 'gold' | 'silver' | 'bronze' | 'errors';
  const [sortKey, setSortKey] = useState<SortKey>('xp');

  // Save competitors
  useEffect(() => {
    localStorage.setItem('hanzi_dial_competitors', JSON.stringify(competitors));
  }, [competitors]);

  // Simulate rival progression whenever user gains XP
  const lastUserXpRef = useRef(totalXp);
  useEffect(() => {
    if (totalXp > lastUserXpRef.current) {
      setCompetitors(curr => 
        curr.map(comp => {
          if (Math.random() < 0.45) {
            const xpGain = Math.floor(Math.random() * 20) + 5;
            const newXp = comp.xp + xpGain;
            const sentencesGain = Math.random() < 0.35 ? 1 : 0;
            const newSentences = comp.sentences + sentencesGain;
            const songGain = sentencesGain > 0 && Math.random() < 0.25 ? 1 : 0;
            const newSongs = comp.songs + songGain;
            
            let gold = comp.gold;
            let silver = comp.silver;
            let bronze = comp.bronze;
            if (songGain > 0) {
              const roll = Math.random();
              if (roll > 0.8) gold++;
              else if (roll > 0.45) silver++;
              else bronze++;
            }

            const errorsGain = Math.floor(Math.random() * 3);

            return {
              ...comp,
              xp: newXp,
              sentences: newSentences,
              songs: newSongs,
              gold,
              silver,
              bronze,
              errors: comp.errors + errorsGain
            };
          }
          return comp;
        })
      );
      lastUserXpRef.current = totalXp;
    }
  }, [totalXp]);

  // Dedicated Chat Tab States
  const [chatHistory, setChatHistory] = useState<{ role: string; text: string }[]>([
    { role: 'model', text: 'Olá! Sou sua inteligência conversacional livre do Linguo. Pergunte-me qualquer dúvida sobre idiomas, gramática ou converse comigo livremente por texto ou ativando a voz!' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatListening, setIsChatListening] = useState(false);
  const [isChatHandsFree, setIsChatHandsFree] = useState(false);
  const [chatFeedback, setChatFeedback] = useState<string | null>(null);
  const [isChatSpeaking, setIsChatSpeaking] = useState(false);

  const isChatProcessingRef = useRef(false);
  const isChatHandsFreeRef = useRef(isChatHandsFree);
  useEffect(() => {
    isChatHandsFreeRef.current = isChatHandsFree;
  }, [isChatHandsFree]);

  // Sidebar specific hands-free voice loop
  useEffect(() => {
    if (!isChatHandsFree || activeTab !== 'chat') {
      setIsChatListening(false);
      return;
    }

    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      setChatFeedback('💡 Reconhecimento contínuo de voz não suportado neste navegador.');
      setIsChatHandsFree(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsChatListening(true);
      setChatFeedback('🎙️ Modo Conversa Livre Ativo: Pode falar!');
      console.log('%c[Sidebar AI Chat] Speech recognition started.', 'color: #10b981; font-weight: bold;');
    };

    recognition.onresult = async (event: any) => {
      const lastResultIndex = event.results.length - 1;
      const result = event.results[lastResultIndex];
      const transcript = result[0].transcript;
      setChatFeedback(`🎙️ Ouvindo: "${transcript}"`);

      if (result.isFinal) {
        const query = transcript.trim();
        if (query.length === 0) return;

        console.log(`%c[Sidebar AI Chat] Final voice query: "${query}"`, 'color: #3b82f6; font-weight: bold;');
        setChatFeedback('✨ Processando pergunta...');
        
        isChatProcessingRef.current = true;
        recognition.stop();

        try {
          setIsChatSpeaking(true);
          const customKey = (window as any).__GOOGLE_TTS_KEY__ || localStorage.getItem('hanzi_dial_google_tts_key');
          const apiKey = customKey !== 'AIzaSyDUmfVw5Cv51m3v0gBIp3mfaBLllQijiB0' ? customKey : undefined;

          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: query,
              history: chatHistory.map(h => ({
                role: h.role,
                parts: [{ text: h.text }]
              })),
              systemInstruction: "Você é o Tutor de Idiomas Inteligente do Linguo. Responda em português sobre qualquer dúvida de forma clara, simpática e objetiva (no máximo 3 frases).",
              apiKey
            })
          });

          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const data = await response.json();
          const reply = data.text;
          const audio = data.audio;

          setChatHistory(prev => [...prev, { role: 'user', text: query }, { role: 'model', text: reply }]);
          setChatFeedback(null);

          if (audio) {
            console.log('%c[Sidebar AI Chat] Playing native Gemini voice...', 'color: #10b981;');
            let playedOk = false;
            try {
              const ctx = getAudioContext();
              const rawBinary = window.atob(audio);
              const bytes = new Uint8Array(rawBinary.length);
              for (let i = 0; i < rawBinary.length; i++) {
                bytes[i] = rawBinary.charCodeAt(i);
              }
              const audioBuffer = await ctx.decodeAudioData(
                bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)
              );
              
              // Play audio buffer with safe 8s timeout
              playedOk = await new Promise<boolean>((res) => {
                const source = ctx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(ctx.destination);
                let resolved = false;
                const timer = setTimeout(() => {
                  try { source.stop(); } catch(e){}
                  if (!resolved) { resolved = true; res(false); }
                }, 8000);
                source.onended = () => {
                  clearTimeout(timer);
                  if (!resolved) { resolved = true; res(true); }
                };
                source.start(0);
              });
            } catch (playErr) {
              console.error("Native play error in Sidebar:", playErr);
            }

            if (!playedOk) {
              await speakLanguageText(reply, 'pt-BR');
            }
          } else {
            await speakLanguageText(reply, 'pt-BR');
          }
        } catch (err: any) {
          console.error(err);
          setChatFeedback('❌ Erro ao obter resposta.');
        } finally {
          setIsChatSpeaking(false);
          isChatProcessingRef.current = false;
          // Re-enable microphone in hands-free
          if (isChatHandsFreeRef.current) {
            try { recognition.start(); } catch(e){}
          }
        }
      }
    };

    recognition.onerror = () => {
      if (isChatHandsFreeRef.current && !isChatProcessingRef.current) {
        try { recognition.start(); } catch(e){}
      }
    };

    recognition.onend = () => {
      if (isChatHandsFreeRef.current && !isChatProcessingRef.current) {
        try { recognition.start(); } catch(e){}
      } else if (!isChatHandsFreeRef.current) {
        setIsChatListening(false);
      }
    };

    try {
      recognition.start();
    } catch(e){}

    return () => {
      try { recognition.stop(); } catch(e){}
    };
  }, [isChatHandsFree, activeTab]);

  const handleSendChatText = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = chatInput.trim();
    if (query.length === 0) return;

    setChatInput('');
    setChatFeedback('✨ Pensando...');
    isChatProcessingRef.current = true;

    try {
      setIsChatSpeaking(true);
      const customKey = (window as any).__GOOGLE_TTS_KEY__ || localStorage.getItem('hanzi_dial_google_tts_key');
      const apiKey = customKey !== 'AIzaSyDUmfVw5Cv51m3v0gBIp3mfaBLllQijiB0' ? customKey : undefined;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: chatHistory.map(h => ({
            role: h.role,
            parts: [{ text: h.text }]
          })),
          systemInstruction: "Você é o Tutor de Idiomas Inteligente do Linguo. Responda em português sobre qualquer dúvida de forma clara, simpática e objetiva (no máximo 3 frases).",
          apiKey
        })
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const reply = data.text;
      const audio = data.audio;

      setChatHistory(prev => [...prev, { role: 'user', text: query }, { role: 'model', text: reply }]);
      setChatFeedback(null);

      if (audio) {
        try {
          const ctx = getAudioContext();
          const rawBinary = window.atob(audio);
          const bytes = new Uint8Array(rawBinary.length);
          for (let i = 0; i < rawBinary.length; i++) {
            bytes[i] = rawBinary.charCodeAt(i);
          }
          const audioBuffer = await ctx.decodeAudioData(
            bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)
          );
          // Play background audio without blocking
          const source = ctx.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(ctx.destination);
          source.start(0);
        } catch (playErr) {
          speakLanguageText(reply, 'pt-BR');
        }
      } else {
        speakLanguageText(reply, 'pt-BR');
      }
    } catch (err: any) {
      console.error(err);
      setChatFeedback('❌ Erro na resposta.');
    } finally {
      setIsChatSpeaking(false);
      isChatProcessingRef.current = false;
    }
  };

  // Compute stats
  const totalSentences = sentences.length;
  const completedCount = completedSentenceIds.length;
  const completionPercent = totalSentences > 0 ? Math.round((completedCount / totalSentences) * 100) : 0;

  // Calculate user stats from props
  const userGoldCount = Object.values(songTrophies).filter(t => t === 'gold').length;
  const userSilverCount = Object.values(songTrophies).filter(t => t === 'silver').length;
  const userBronzeCount = Object.values(songTrophies).filter(t => t === 'bronze').length;

  const completedSongsCount = songs.filter(s => {
    const saved = localStorage.getItem(`hanzi_dial_completed_music_indices_${s.id}`);
    const completedIndices = saved ? JSON.parse(saved) : [];
    return completedIndices.length > 0;
  }).length;

  const userCompetitor: Competitor = {
    id: 'user',
    name: userName || 'Você',
    avatar: '👨‍🚀',
    country: '🇧🇷',
    isUser: true,
    xp: totalXp,
    sentences: completedCount,
    songs: completedSongsCount,
    gold: userGoldCount,
    silver: userSilverCount,
    bronze: userBronzeCount,
    errors: dialErrorsCount,
  };

  const allStandings = [...competitors, userCompetitor];

  const sortedStandings = [...allStandings].sort((a, b) => {
    if (sortKey === 'errors') {
      return a.errors - b.errors;
    }
    return b[sortKey] - a[sortKey];
  });

  // Sound handler
  const handleSpeak = async (sentenceText: string, id: string) => {
    setSpeakingId(id);
    await speakLanguageText(sentenceText, ttsCode);
    setSpeakingId(null);
  };

  // Badges array based on progress
  const badges = [
    { id: 'b1', name: 'Primeira Discagem', desc: 'Completou a primeira frase', unlocked: completedCount >= 1, icon: '📞' },
    { id: 'b2', name: 'Poliglota Iniciante', desc: 'Completou 3 frases em chinês', unlocked: completedCount >= 3, icon: '🧠' },
    { id: 'b3', name: 'Barista de Pequim', desc: 'Completou todas as de Alimentos & Bebidas', unlocked: sentences.filter(s => s.category === 'Alimentos & Bebidas').every(s => completedSentenceIds.includes(s.id)), icon: '☕' },
    { id: 'b4', name: 'Fluência no Telefone', desc: 'Completou todas as frases do aplicativo', unlocked: completedCount === totalSentences && totalSentences > 0, icon: '🏆' },
  ];

  return (
    <div className="w-full lg:w-[400px] bg-white dark:bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 flex flex-col h-[650px] lg:h-full overflow-hidden shadow-2xl relative">
      
      {/* Sidebar Header */}
      <div className="p-5 border-b border-indigo-50 dark:border-indigo-950 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <BookOpenCheck className="text-indigo-600 dark:text-indigo-400" size={20} />
            Minha Lista de Frases
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Monte frases e monte sua biblioteca de estudo
          </p>
        </div>
        <div className="flex items-center gap-2">
          {completedCount > 0 && (
            <button
              onClick={onResetProgress}
              title="Resetar Progresso"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all active:scale-95"
            >
              <RotateCcw size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Tab Contents Area */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: HOME (Sentence list matching exact mockup) */}
          {activeTab === 'home' && (
            <motion.div
              key="home-tab"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-3.5"
            >
              {sentences.map((s, index) => {
                const isCompleted = completedSentenceIds.includes(s.id);
                const isExpanded = expandedSentenceId === s.id;
                
                return (
                  <div
                    key={s.id}
                    className={`
                      p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden group
                      ${
                        isCompleted
                          ? 'bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950 border-slate-200/80 dark:border-slate-800 shadow-sm'
                          : 'bg-slate-50/40 dark:bg-slate-950/20 border-dashed border-slate-200 dark:border-slate-850 opacity-65'
                      }
                    `}
                  >
                    {/* Level Badge indicator */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <span className={`text-[9px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full
                        ${s.difficulty === 'Fácil' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' :
                          s.difficulty === 'Médio' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' :
                          'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'}`}
                      >
                        {s.difficulty.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      {/* Number list circle */}
                      <div className={`
                        flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs border
                        ${
                          isCompleted
                            ? 'bg-indigo-50 text-indigo-600 border-indigo-200/60 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-800'
                            : 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-900 dark:text-slate-600 dark:border-slate-800'
                        }
                      `}>
                        {index + 1}
                      </div>

                      {/* Text details */}
                      <div className="flex-1 min-w-0 pr-10">
                        {isCompleted ? (
                          <>
                            {/* Chinese characters text */}
                            <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-wide font-sans">
                              {joinSentence(s.characters)}
                            </h3>
                            {/* Pinyin transcription */}
                            <p className="text-[13px] font-bold text-indigo-600 dark:text-indigo-400 font-mono mt-0.5">
                              {s.pinyin}
                            </p>
                            {/* Portuguese translation */}
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                              {s.translation}
                            </p>
                          </>
                        ) : (
                          <>
                            {/* Blur/Mystery effect for locked phrases to stimulate curiosity */}
                            <div className="flex gap-1 py-1">
                              {s.characters.map((_, charIdx) => (
                                <span key={charIdx} className="inline-block w-6 h-6 rounded bg-slate-200/70 dark:bg-slate-800 animate-pulse text-transparent select-none">
                                  ?
                                </span>
                              ))}
                            </div>
                            <p className="text-xs font-semibold text-slate-400 dark:text-slate-600 font-mono">
                              🔒 Saudações ({s.difficulty})
                            </p>
                            <p className="text-[11px] text-slate-400/80 dark:text-slate-500/80 mt-1 italic">
                              {s.translation.replace(/./g, '*').slice(0, 15)}...
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Interaction Buttons for completed sentences */}
                    {isCompleted && (
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                        {/* Grammar explanation Toggle */}
                        <button
                          onClick={() => setExpandedSentenceId(isExpanded ? null : s.id)}
                          className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-650 hover:text-indigo-800 dark:text-indigo-400 transition-colors"
                        >
                          <BookOpen size={13} />
                          {isExpanded ? 'Ocultar Análise' : 'Análise Gramática'}
                        </button>

                        <div className="flex items-center gap-2">
                          {/* Review specific sentence button */}
                          <button
                            onClick={() => {
                              onStartReview(s.id);
                              setActiveTab('review');
                            }}
                            title="Revisar esta frase agora"
                            className="p-1.5 rounded-full shadow-sm transition-all active:scale-90 border bg-white hover:bg-violet-50 text-violet-600 dark:bg-slate-950 dark:text-violet-400 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800"
                          >
                            <RefreshCw size={13} />
                          </button>

                          {/* Audio TTS Speak Button */}
                          <button
                            onClick={() => handleSpeak(joinSentence(s.characters), s.id)}
                            disabled={speakingId !== null}
                            className={`
                              p-1.5 rounded-full shadow-sm transition-all active:scale-90 border
                              ${
                                speakingId === s.id
                                  ? 'bg-indigo-650 text-white border-indigo-500 animate-pulse'
                                  : 'bg-white hover:bg-slate-50 text-slate-600 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800'
                              }
                            `}
                          >
                            <Volume2 size={14} className={speakingId === s.id ? 'animate-bounce' : ''} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Expandable Literal Breakdown & Grammar Tips */}
                    <AnimatePresence>
                      {isCompleted && isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden mt-3"
                        >
                          <div className="p-3 rounded-xl bg-blue-50/40 dark:bg-blue-950/10 border border-blue-100/50 dark:border-blue-900/30 text-[11px] space-y-2.5">
                            <div>
                              <strong className="text-slate-700 dark:text-slate-300 block mb-0.5">Estrutura & Explicação:</strong>
                              <p className="text-slate-500 dark:text-slate-400 leading-relaxed italic">
                                {s.explanation}
                              </p>
                            </div>
                            
                            <div>
                              <strong className="text-slate-700 dark:text-slate-300 block mb-1">Significado de cada palavra:</strong>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                                {s.literalBreakdown.map((item, idx) => (
                                  <div key={idx} className="p-1.5 rounded bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/50 flex flex-col items-center text-center">
                                    <span className="text-sm font-bold text-slate-850 dark:text-slate-200">{item.char}</span>
                                    <span className="text-[9px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold">{item.pinyin}</span>
                                    <span className="text-[9px] text-slate-400 mt-0.5 truncate max-w-full">{item.translation}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* TAB 2: CATEGORIES (Filter selector) */}
          {activeTab === 'categories' && (
            <motion.div
              key="categories-tab"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Filtrar por Categoria</h3>
                <div className="grid grid-cols-1 gap-2">
                  {['Todos', 'Saudações', 'Alimentos & Bebidas', 'Estudo', 'Cotidiano'].map((cat) => {
                    const countInCat = sentences.filter(s => cat === 'Todos' || s.category === cat).length;
                    const completedInCat = sentences.filter(s => (cat === 'Todos' || s.category === cat) && completedSentenceIds.includes(s.id)).length;
                    const isSelected = activeCategory === cat;
                    
                    return (
                      <button
                        key={cat}
                        onClick={() => onSelectCategory(cat)}
                        className={`
                          p-3 rounded-xl border flex items-center justify-between text-left transition-all active:scale-98
                          ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/15'
                              : 'bg-white hover:bg-slate-50 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-850 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                          }
                        `}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{cat === 'Todos' ? '🌐' : cat === 'Saudações' ? '👋' : cat === 'Alimentos & Bebidas' ? '☕' : cat === 'Estudo' ? '📚' : '🏠'}</span>
                          <span className="text-xs font-semibold">{cat}</span>
                        </div>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${isSelected ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-950 dark:text-slate-400'}`}>
                          {completedInCat} / {countInCat}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Dificuldade</h3>
                <div className="grid grid-cols-2 gap-2">
                  {(['Todos', 'Fácil', 'Médio', 'Difícil'] as const).map((diff) => {
                    const isSelected = activeDifficulty === diff;
                    return (
                      <button
                        key={diff}
                        onClick={() => onSelectDifficulty(diff)}
                        className={`
                          py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all active:scale-95
                          ${
                            isSelected
                              ? 'bg-slate-800 text-white border-slate-700 dark:bg-white dark:text-slate-900'
                              : 'bg-white hover:bg-slate-50 text-slate-600 dark:bg-slate-900 dark:hover:bg-slate-850 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                          }
                        `}
                      >
                        {diff}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2.5: REVIEW (Review Center) */}
          {activeTab === 'review' && (
            <motion.div
              key="review-tab"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              {completedCount === 0 ? (
                <div className="bg-slate-50 dark:bg-slate-950/50 p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-500 mx-auto text-xl">
                    🔒
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Sem Frases para Revisar</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 leading-normal">
                      Você ainda não montou nenhuma frase com sucesso. Monte frases no menu principal para desbloquear a revisão!
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('home')}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transition-all active:scale-98"
                  >
                    Ir para Frases 🌱
                  </button>
                </div>
              ) : isReviewMode ? (
                <div className="space-y-4">
                  {/* Active Review Session Card */}
                  <div className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white p-5 rounded-2xl shadow-xl space-y-4 relative overflow-hidden">
                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-10 -translate-y-10" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold tracking-wider bg-white/20 text-white px-2.5 py-1 rounded-full border border-white/10 uppercase">
                        Revisão em Andamento 🔁
                      </span>
                      <span className="text-xs font-mono font-bold bg-yellow-400 text-slate-900 px-2 py-0.5 rounded-full shadow">
                        +{reviewXp} XP
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-black text-violet-200 uppercase tracking-widest block">
                        MONTE ESTA FRASE:
                      </span>
                      <h3 className="text-lg font-black tracking-wide leading-tight">
                        "{sentences.find(s => s.id === reviewSentenceId)?.translation || 'Frase de revisão'}"
                      </h3>
                      <p className="text-[11px] text-violet-100 italic">
                        Categoria: {sentences.find(s => s.id === reviewSentenceId)?.category || 'Todos'} • {sentences.find(s => s.id === reviewSentenceId)?.difficulty || 'Fácil'}
                      </p>
                    </div>

                    {/* Quick helper buttons */}
                    <div className="grid grid-cols-2 gap-2.5 pt-2">
                      <button
                        onClick={onNextReviewSentence}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-white/15 hover:bg-white/25 text-white transition-all border border-white/10 active:scale-95"
                        title="Pula a frase atual e carrega outra"
                      >
                        <RefreshCw size={13} />
                        Pular Frase
                      </button>
                      <button
                        onClick={onExitReview}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-red-500/80 hover:bg-red-600 text-white transition-all active:scale-95"
                      >
                        Sair do Modo
                      </button>
                    </div>
                  </div>

                  {/* Informational tip */}
                  <div className="p-3.5 rounded-xl bg-violet-50/50 dark:bg-violet-950/10 border border-violet-100 dark:border-violet-900/30 text-[11px] text-violet-800 dark:text-violet-400 leading-relaxed font-medium">
                    💡 <strong>Como praticar:</strong> Arraste os ideogramas corretos no círculo central na ordem exata para completar a frase e ganhar mais XP!
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Start Review Button Card */}
                  <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/10 dark:to-slate-900 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-950/40 text-center space-y-3.5 shadow-sm">
                    <div className="flex justify-between items-center bg-white dark:bg-slate-950 px-3 py-1.5 rounded-full border border-slate-100 dark:border-indigo-950 text-xs font-bold text-slate-600 dark:text-slate-400 w-fit mx-auto shadow-sm">
                      <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                        🔁 XP de Revisão:
                      </span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-200 ml-1">+{reviewXp} XP</span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-base font-black text-slate-800 dark:text-slate-150">Quarto de Prática</h3>
                      <p className="text-xs text-slate-400 dark:text-slate-500 px-2 leading-relaxed">
                        Pratique todas as suas {completedCount} frases dominadas em ordem aleatória para fixar sua memória de longo prazo!
                      </p>
                    </div>

                    <button
                      onClick={() => onStartReview()}
                      className="w-full py-3 px-4 rounded-xl text-xs font-extrabold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all active:scale-98 flex items-center justify-center gap-2"
                    >
                      <RefreshCw size={14} className="animate-spin-slow" />
                      INICIAR REVISÃO ALEATÓRIA
                    </button>
                  </div>

                  {/* List of completed sentences for individual review targeting */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase pl-1.5">
                      Biblioteca para Revisar ({completedCount})
                    </h3>

                    {sentences
                      .filter(s => completedSentenceIds.includes(s.id))
                      .map((s) => (
                        <div
                          key={s.id}
                          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3 group hover:border-indigo-200 dark:hover:border-indigo-900 transition-all"
                        >
                          <div className="flex-1 min-w-0">
                            <h4 className="text-base font-black text-slate-900 dark:text-slate-100">
                              {joinSentence(s.characters)}
                            </h4>
                            <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                              {s.pinyin}
                            </p>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                              {s.translation}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {/* Audio TTS Speak Button */}
                            <button
                              onClick={() => handleSpeak(joinSentence(s.characters), s.id)}
                              disabled={speakingId !== null}
                              className={`
                                p-2 rounded-full border shadow-sm transition-all active:scale-90
                                ${
                                  speakingId === s.id
                                    ? 'bg-indigo-650 text-white border-indigo-500 animate-pulse'
                                    : 'bg-white hover:bg-slate-50 text-slate-500 dark:bg-slate-950 dark:text-slate-350 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800'
                                }
                              `}
                            >
                              <Volume2 size={13} />
                            </button>
                            
                            {/* Target specifically this sentence */}
                            <button
                              onClick={() => {
                                onStartReview(s.id);
                                setActiveTab('review');
                              }}
                              className="py-2 px-3.5 rounded-xl text-[10px] font-black bg-indigo-50 text-indigo-650 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 dark:hover:bg-indigo-950/80 border border-indigo-100/50 dark:border-indigo-900/40 transition-all active:scale-95"
                            >
                              REVISAR
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 3: PROGRESS (Detailed stats / achievements) */}
          {activeTab === 'progress' && (
            <motion.div
              key="progress-tab"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-100 dark:border-indigo-900/20 p-3 rounded-2xl text-center">
                  <span className="text-2xl block mb-1">🏆</span>
                  <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 block">{completedCount}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Frases Dominadas</span>
                </div>
                <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/20 p-3 rounded-2xl text-center">
                  <span className="text-2xl block mb-1">⚡</span>
                  <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 block">{completedCount * 15}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">PONTOS XP</span>
                </div>
              </div>

              {/* Mastery Level Status */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-850">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Nível de Fluência</span>
                  <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {completedCount === totalSentences ? 'Mestre 🌟' : completedCount >= 6 ? 'Intermediário 📈' : 'Iniciante 🌱'}
                  </span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${completionPercent}%` }}
                    className="bg-gradient-to-r from-orange-400 via-pink-500 to-indigo-600 h-full rounded-full"
                  />
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 block text-right">
                  {completionPercent}% completo ({completedCount}/{totalSentences})
                </span>
              </div>

              {/* Achievements / Badges Section */}
              <div>
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2.5 flex items-center gap-1.5">
                  <Award size={14} className="text-amber-500" />
                  Conquistas do Aluno
                </h3>
                <div className="space-y-2">
                  {badges.map((b) => (
                    <div
                      key={b.id}
                      className={`
                        p-3 rounded-xl border flex items-center gap-3 transition-all
                        ${
                          b.unlocked
                            ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
                            : 'bg-slate-50/50 dark:bg-slate-950/25 border-dashed border-slate-200/60 dark:border-slate-800 opacity-60'
                        }
                      `}
                    >
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-sm border
                        ${b.unlocked ? 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900' : 'bg-slate-100 border-slate-200 dark:bg-slate-950 dark:border-slate-800'}
                      `}>
                        {b.unlocked ? b.icon : '🔒'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-xs font-bold ${b.unlocked ? 'text-slate-800 dark:text-slate-100' : 'text-slate-400 dark:text-slate-600'}`}>
                          {b.name}
                        </h4>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                          {b.desc}
                        </p>
                      </div>
                      {b.unlocked && (
                        <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: PROFILE (Personal settings / learner profile) */}
          {activeTab === 'profile' && (
            <motion.div
              key="profile-tab"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-3xl shadow-md text-white font-extrabold mb-3">
                  {userName ? userName.slice(0, 1).toUpperCase() : 'A'}
                </div>
                
                <div className="w-full space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 block text-left">
                    NOME DO ALUNO(A):
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => onUpdateUserName(e.target.value)}
                    placeholder="Seu Nome"
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-xs text-slate-850 dark:text-slate-150 font-semibold"
                  />
                </div>
              </div>

              {/* Informative Stats Card */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                  <Clock size={14} className="text-indigo-600 dark:text-indigo-400" />
                  Informações da Sessão
                </h4>
                <div className="text-[11px] text-slate-400 dark:text-slate-500 space-y-1">
                  <div className="flex justify-between">
                    <span>Nível Geral:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Level {Math.floor(completedCount / 3) + 1}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Precisão de Discagem:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">92%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Multiplicador Combo:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">x1.5</span>
                  </div>
                </div>
              </div>

              {/* Methodology details */}
              <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/20 text-[10px] text-amber-800 dark:text-amber-400 leading-relaxed">
                <strong>O Método de Discagem Física:</strong>
                <p className="mt-1">
                  Inspirado na precisão mecânica do telefone de disco clássico, esta ferramenta associa a mecânica cinestésica (arrastar) à estrutura de fraseamentos chineses (SVO). Estudos indicam que ações táteis ativas reforçam a retenção mnemônica de ideogramas (Hanzi) em até 40%.
                </p>
              </div>
            </motion.div>
          )}

          {/* TAB 5: AI CHAT (Dedicated Testing Zone) */}
          {activeTab === 'chat' && (
            <motion.div
              key="chat-tab"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4 flex flex-col h-[480px]"
            >
              <div className="bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-100 dark:border-indigo-900/20 p-3 rounded-2xl flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-650 text-white shadow-sm">
                  <Bot size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Canal Livre de Conversação</h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">Tire qualquer dúvida linguística sem limites</p>
                </div>
              </div>

              {/* Chat History Panel */}
              <div className="flex-1 overflow-y-auto space-y-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 custom-scrollbar max-h-[290px] min-h-[220px]">
                {chatHistory.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white ml-auto font-semibold shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800/80'
                    }`}
                  >
                    <p className="font-sans whitespace-pre-wrap">{msg.text}</p>
                  </div>
                ))}
              </div>

              {/* Feedback & Status Message */}
              {chatFeedback && (
                <div className="text-[10px] text-center font-bold text-amber-500 animate-pulse">
                  {chatFeedback}
                </div>
              )}

              {/* Input & Voice Controls */}
              <div className="space-y-2.5 mt-auto">
                <form onSubmit={handleSendChatText} className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Tire dúvidas sobre pronúncia, gramática..."
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-950 text-slate-850 dark:text-slate-100 placeholder-slate-400 border border-slate-200 dark:border-slate-800 outline-none focus:border-indigo-500 font-semibold"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-indigo-650 hover:bg-indigo-600 text-white active:scale-95 transition-all shadow cursor-pointer"
                  >
                    <Send size={15} />
                  </button>
                </form>

                <div className="flex items-center justify-between gap-2">
                  {/* Hands Free Voice Toggle */}
                  <button
                    type="button"
                    onClick={() => {
                      getAudioContext(); // Unlock audio on click gesture
                      setIsChatHandsFree(!isChatHandsFree);
                    }}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all border active:scale-95 cursor-pointer ${
                      isChatHandsFree
                        ? "bg-red-500 text-white border-red-400 animate-pulse shadow-md"
                        : "bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50"
                    }`}
                  >
                    {isChatHandsFree ? <MicOff size={13} /> : <Mic size={13} />}
                    <span>{isChatHandsFree ? "Mãos Livres ON" : "Ativar Voz"}</span>
                  </button>

                  {/* Audio Context Status Indicator */}
                  <div className="text-[9px] font-mono text-slate-400 dark:text-slate-500 font-bold bg-slate-100 dark:bg-slate-950 px-2 py-1.5 rounded-lg border border-slate-200/50 dark:border-slate-800 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping"></span>
                    <span>Áudio: Ativo</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 6: DYNAMIC SORTABLE RANKING (Leaderboard) */}
          {activeTab === 'ranking' && (
            <motion.div
              key="ranking-tab"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-3.5 flex flex-col h-[480px]"
            >
              {/* League Badge Header */}
              <div className="bg-gradient-to-r from-amber-500/10 to-indigo-500/10 dark:from-amber-500/5 dark:to-indigo-500/5 border border-indigo-100/60 dark:border-indigo-900/40 p-3 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-900 flex items-center justify-center text-xl shadow-md font-bold animate-pulse">
                    {totalXp >= 1500 ? '💎' : totalXp >= 800 ? '🏆' : totalXp >= 400 ? '🥈' : '🥉'}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-850 dark:text-slate-100 uppercase tracking-tight">
                      {totalXp >= 1500 ? 'Liga Diamante' : totalXp >= 800 ? 'Liga Ouro' : totalXp >= 400 ? 'Liga Prata' : 'Liga Bronze'}
                    </h4>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                      Divisão Ativa de Aprendizado
                    </p>
                  </div>
                </div>
                
                {/* Countdown */}
                <div className="text-right">
                  <span className="block text-[8px] font-mono font-black uppercase text-slate-400 dark:text-slate-500">
                    Fim da Liga:
                  </span>
                  <span className="text-[10px] font-mono font-extrabold text-indigo-650 dark:text-indigo-400 animate-pulse">
                    2d 14h
                  </span>
                </div>
              </div>

              {/* Sorting Filter Selector */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-mono font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                  Ordenar Classificação por:
                </span>
                <div className="flex gap-1 overflow-x-auto pb-1 select-none custom-scrollbar">
                  {[
                    { key: 'xp', label: '⚡ XP' },
                    { key: 'sentences', label: '💬 Frases' },
                    { key: 'songs', label: '🎵 Músicas' },
                    { key: 'gold', label: '🏆 Ouro' },
                    { key: 'silver', label: '🥈 Prata' },
                    { key: 'bronze', label: '🥉 Bronze' },
                    { key: 'errors', label: '⚠️ Erros' }
                  ].map((btn) => {
                    const isSelected = sortKey === btn.key;
                    return (
                      <button
                        key={btn.key}
                        onClick={() => {
                          playTick();
                          setSortKey(btn.key as SortKey);
                        }}
                        className={`flex-shrink-0 px-2.5 py-1 rounded-xl text-[9px] font-extrabold tracking-wide uppercase transition-all active:scale-95 border cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-md scale-102 font-black'
                            : 'bg-white dark:bg-slate-905 text-slate-650 dark:text-slate-350 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900'
                        }`}
                      >
                        {btn.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Leaderboard Rankings List */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar max-h-[300px] min-h-[220px]">
                {sortedStandings.map((comp, index) => {
                  const rankNum = index + 1;
                  const isUser = comp.isUser;
                  
                  // Detail line based on active sort
                  let metricDetail = '';
                  if (sortKey === 'xp') metricDetail = `${comp.xp} XP`;
                  else if (sortKey === 'sentences') metricDetail = `${comp.sentences} frases`;
                  else if (sortKey === 'songs') metricDetail = `${comp.songs} músicas`;
                  else if (sortKey === 'gold') metricDetail = `${comp.gold} ouro`;
                  else if (sortKey === 'silver') metricDetail = `${comp.silver} prata`;
                  else if (sortKey === 'bronze') metricDetail = `${comp.bronze} bronze`;
                  else if (sortKey === 'errors') metricDetail = `${comp.errors} erros`;

                  return (
                    <div
                      key={comp.id}
                      className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all ${
                        isUser
                          ? 'bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-indigo-500/80 shadow-md ring-1 ring-indigo-400/25 scale-[1.01]'
                          : 'bg-white dark:bg-slate-950/80 border-slate-200 dark:border-slate-850/80'
                      }`}
                    >
                      {/* Left Block: Position, Avatar, Name */}
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Rank Medals */}
                        <div className="w-5 flex justify-center text-xs font-mono font-black shrink-0 text-slate-400">
                          {rankNum === 1 ? '🥇' : rankNum === 2 ? '🥈' : rankNum === 3 ? '🥉' : rankNum}
                        </div>
                        {/* Avatar */}
                        <div className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 flex items-center justify-center text-sm shrink-0">
                          {comp.avatar}
                        </div>
                        {/* User info */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] shrink-0">{comp.country}</span>
                            <span className={`text-[11px] font-black truncate max-w-[85px] ${isUser ? 'text-indigo-650 dark:text-indigo-400 font-extrabold' : 'text-slate-850 dark:text-slate-150'}`}>
                              {comp.name}
                            </span>
                          </div>
                          <span className="block text-[8px] font-mono font-black uppercase text-indigo-500/80 dark:text-indigo-400">
                            {metricDetail}
                          </span>
                        </div>
                      </div>

                      {/* Right Block: Stats Badges Grid */}
                      <div className="flex items-center gap-1 text-[8px] font-mono font-black text-slate-400">
                        <div className="bg-amber-400/10 border border-amber-300/35 px-1 py-0.5 rounded text-amber-500 flex items-center gap-0.5" title="Ouro">
                          <span>🏆</span>
                          <span>{comp.gold}</span>
                        </div>
                        <div className="bg-slate-300/10 border border-slate-350/35 px-1 py-0.5 rounded text-slate-450 flex items-center gap-0.5" title="Prata">
                          <span>🥈</span>
                          <span>{comp.silver}</span>
                        </div>
                        <div className="bg-amber-600/10 border border-amber-500/35 px-1 py-0.5 rounded text-amber-600 flex items-center gap-0.5" title="Bronze">
                          <span>🥉</span>
                          <span>{comp.bronze}</span>
                        </div>
                        <div className="bg-red-500/5 border border-red-500/20 px-1 py-0.5 rounded text-red-550 flex items-center gap-0.5" title="Erros">
                          <span>⚠️</span>
                          <span>{comp.errors}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Promotion / Relegation indicator footers */}
              <div className="bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping"></span>
                <span>ZONA DE PROMOÇÃO (Top 3 avançam de liga)</span>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Progress Footer (Matching high-fidelity mockup) */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/30 flex flex-col items-center gap-2">
        <div className="flex items-center justify-between w-full text-xs font-bold text-slate-600 dark:text-slate-300 px-1">
          <span>{completedCount} frases completas</span>
          <span className="font-mono text-indigo-600 dark:text-indigo-400">{completionPercent}%</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${completionPercent}%` }}
            className="bg-gradient-to-r from-orange-400 via-pink-500 to-indigo-600 h-full rounded-full"
          />
        </div>
      </div>

      {/* Bottom Navigation Bar (Matching layout of phone mock) */}
      <div className="bg-white dark:bg-slate-950 border-t border-slate-250 dark:border-slate-850 flex items-center justify-around py-3">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-all ${activeTab === 'home' ? 'text-indigo-650 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-500'}`}
        >
          <Home size={18} />
          <span>Home</span>
        </button>
        
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-all ${activeTab === 'categories' ? 'text-indigo-650 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-500'}`}
        >
          <Grid size={18} />
          <span>Categorias</span>
        </button>

        <button
          onClick={() => setActiveTab('review')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-all relative ${activeTab === 'review' ? 'text-indigo-650 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-500'}`}
        >
          {isReviewMode && (
            <span className="absolute top-0.5 right-1 w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_6px_rgba(109,40,217,0.7)] animate-ping" />
          )}
          <RefreshCw size={18} className={isReviewMode ? 'animate-spin-slow' : ''} />
          <span>Revisão</span>
        </button>
        
        <button
          onClick={() => setActiveTab('progress')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-all ${activeTab === 'progress' ? 'text-indigo-650 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-500'}`}
        >
          <TrendingUp size={18} />
          <span>Progresso</span>
        </button>

        <button
          onClick={() => setActiveTab('ranking')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-all ${activeTab === 'ranking' ? 'text-indigo-650 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-500'}`}
        >
          <Trophy size={18} />
          <span>Ranking</span>
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-all ${activeTab === 'chat' ? 'text-indigo-650 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-500'}`}
        >
          <Bot size={18} />
          <span>IA Chat</span>
        </button>
        
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-all ${activeTab === 'profile' ? 'text-indigo-650 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-500'}`}
        >
          <User size={18} />
          <span>Perfil</span>
        </button>
      </div>

    </div>
  );
}
