import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Mic, MicOff, Sparkles, ChevronDown, RefreshCw, MessageSquare, Bot, Globe } from 'lucide-react';
import { NATIVE_LANGUAGES, stopTutorSpeech } from '../utils/aiTutorEngine';
import { speakLanguageText } from '../utils/audio';

interface AIVoiceAssistantCardProps {
  isEnabled: boolean;
  onToggleEnabled: () => void;
  nativeLanguageCode: string;
  onChangeNativeLanguage: (code: string) => void;
  currentSpeechText: string;
  isSpeaking: boolean;
  onReplayGuidance: () => void;
  targetWord?: string;
  targetTranslation?: string;
  targetPhonetic?: string;
  targetLanguageName?: string;
  onUpdateSpeechText?: (text: string) => void;
  onStartSpeaking?: (speaking: boolean) => void;
}

export default function AIVoiceAssistantCard({
  isEnabled,
  onToggleEnabled,
  nativeLanguageCode,
  onChangeNativeLanguage,
  currentSpeechText,
  isSpeaking,
  onReplayGuidance,
  targetWord,
  targetTranslation,
  targetPhonetic,
  targetLanguageName = 'Idioma',
  onUpdateSpeechText,
  onStartSpeaking
}: AIVoiceAssistantCardProps) {
  const [isExpanded, setIsExpanded] = useState(false); // Minimized by default as requested
  const [isIconOnly, setIsIconOnly] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024; // Default to icon-only on mobile/tablet
    }
    return false;
  }); // icon-only mode
  const [isListening, setIsListening] = useState(false);
  const [isHandsFree, setIsHandsFree] = useState(false);
  const [speechFeedback, setSpeechFeedback] = useState<string | null>(null);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  
  // Local conversational history
  const [chatHistory, setChatHistory] = useState<{ role: string; parts: { text: string }[] }[]>([]);

  const nativeLangConfig = NATIVE_LANGUAGES.find(l => l.code === nativeLanguageCode) || NATIVE_LANGUAGES[0];

  const isHandsFreeRef = useRef(isHandsFree);
  useEffect(() => {
    isHandsFreeRef.current = isHandsFree;
  }, [isHandsFree]);

  // Continuous hands-free recognition engine
  useEffect(() => {
    if (!isHandsFree) {
      setIsListening(false);
      return;
    }

    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      setSpeechFeedback('💡 Reconhecimento contínuo não suportado neste navegador.');
      setIsHandsFree(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      setSpeechFeedback('🎙️ Modo Mãos Livres Ativo: Fale livremente com a Linguo!');
    };

    recognition.onresult = async (event: any) => {
      const lastResultIndex = event.results.length - 1;
      const result = event.results[lastResultIndex];
      const transcript = result[0].transcript;
      
      setSpeechFeedback(`🎙️ Ouvindo: "${transcript}"`);

      if (result.isFinal) {
        const query = transcript.trim();
        if (query.length === 0) return;

        setSpeechFeedback(`✨ Processando: "${query}"...`);
        recognition.stop();

        try {
          if (onStartSpeaking) onStartSpeaking(true);
          
          const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: query,
              history: chatHistory,
            }),
          });

          if (!response.ok) throw new Error("Erro na rede");
          const data = await response.json();
          const reply = data.text;

          // Update local history
          setChatHistory(prev => [
            ...prev,
            { role: "user", parts: [{ text: query }] },
            { role: "model", parts: [{ text: reply }] }
          ]);

          if (onUpdateSpeechText) {
            onUpdateSpeechText(reply);
          }

          // Play response via TTS
          await speakLanguageText(reply, nativeLanguageCode);

        } catch (e: any) {
          console.error("Erro na conversação:", e);
          setSpeechFeedback("❌ Falha na resposta da assistente.");
          setTimeout(() => setSpeechFeedback(null), 3000);
        } finally {
          if (onStartSpeaking) onStartSpeaking(false);
          
          // Re-enable listening after speech ends if still in hands-free mode
          if (isHandsFreeRef.current) {
            try { recognition.start(); } catch(err){}
          }
        }
      }
    };

    recognition.onerror = () => {
      // Re-arm in hands-free mode
      if (isHandsFreeRef.current) {
        try { recognition.start(); } catch (e) {}
      }
    };

    recognition.onend = () => {
      if (isHandsFreeRef.current) {
        try { recognition.start(); } catch (e) {}
      } else {
        setIsListening(false);
      }
    };

    try {
      recognition.start();
    } catch (e) {
      console.warn("Hands free recognition start error", e);
    }

    return () => {
      try { recognition.stop(); } catch (e) {}
    };
  }, [isHandsFree]);

  // Helper to request microphone permission explicitly on user click
  const requestMicrophonePermission = async (): Promise<boolean> => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop()); // release mic immediately
        return true;
      } catch (err) {
        console.warn("Microphone access denied", err);
        setSpeechFeedback("❌ Permissão de microfone negada. Ative nas configurações do navegador.");
        setTimeout(() => setSpeechFeedback(null), 5000);
        return false;
      }
    }
    return true;
  };

  const handleToggleHandsFree = async () => {
    if (!isHandsFree) {
      const permitted = await requestMicrophonePermission();
      if (permitted) {
        setIsHandsFree(true);
      }
    } else {
      setIsHandsFree(false);
    }
  };

  // Voice recording test for pronunciation practice
  const handleStartPronunciationPractice = async () => {
    stopTutorSpeech();
    
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      setSpeechFeedback('💡 Dica: Fale em voz alta agora para praticar!');
      setTimeout(() => setSpeechFeedback(null), 3000);
      return;
    }

    const permitted = await requestMicrophonePermission();
    if (!permitted) return;

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'zh-CN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);
      setSpeechFeedback('🎙️ Ouvindo... Fale agora!');

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        setSpeechFeedback(`✨ Ouvi: "${transcript}"! Excelente esforço! 🎉`);
        setTimeout(() => setSpeechFeedback(null), 4000);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setSpeechFeedback('👍 Muito bem! Falar em voz alta fixa a memória!');
        setTimeout(() => setSpeechFeedback(null), 3000);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
      setSpeechFeedback('👍 Muito bem! Pratique a pronúncia!');
      setTimeout(() => setSpeechFeedback(null), 3000);
    }
  };

  // If icon-only, render just a floating bot pill
  if (isIconOnly) {
    return (
      <div className="flex items-center">
        <button
          onClick={() => setIsIconOnly(false)}
          className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 text-white shadow-xl border border-indigo-400/40 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          title="Abrir Assistente de Voz Linguo"
        >
          <Bot size={22} className="text-amber-300" />
          {isSpeaking && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping border-2 border-indigo-900" />
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-700 text-white rounded-3xl p-3 sm:p-4 shadow-xl border border-indigo-400/30 transition-all duration-300">
      
      {/* Top Bar Header */}
      <div className="flex items-center justify-between gap-2">
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2.5 cursor-pointer select-none flex-1"
        >
          {/* Bot icon — clicking it collapses to icon-only mode */}
          <button
            onClick={(e) => { e.stopPropagation(); setIsIconOnly(true); setIsExpanded(false); }}
            className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 shadow-inner shrink-0 hover:bg-white/25 transition-all cursor-pointer"
            title="Minimizar assistente"
          >
            <Bot size={22} className="text-amber-300 animate-pulse" />
            {isSpeaking && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping border-2 border-indigo-900" />
            )}
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-black text-xs sm:text-sm tracking-wide text-white truncate">
                Assistente de Voz Linguo
              </h3>
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-sm shrink-0">
                IA Guia
              </span>
            </div>
            {/* When minimized, show quick transcript preview */}
            {!isExpanded ? (
              <p className="text-[11px] text-indigo-100 font-medium truncate max-w-[280px] sm:max-w-xs">
                {currentSpeechText || nativeLangConfig.phrases.greeting}
              </p>
            ) : (
              <p className="text-[11px] text-indigo-100/90 font-medium">
                Orienta sua pronúncia e escolha de palavras
              </p>
            )}
          </div>
        </div>

        {/* Action Controls Header */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Replay Word Guidance Voice Button */}
          <button
            onClick={onReplayGuidance}
            className="px-2.5 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black text-[11px] shadow-sm hover:bg-amber-300 transition-all border border-amber-300 flex items-center gap-1 cursor-pointer active:scale-95"
            title="Ouvir orientações para a próxima palavra"
          >
            <Volume2 size={13} />
            <span>Ouvir Voz</span>
          </button>

          {/* Hands Free Voice Toggle */}
          <button
            onClick={handleToggleHandsFree}
            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold transition-all border flex items-center gap-1 cursor-pointer ${
              isHandsFree
                ? "bg-amber-400 text-slate-950 border-amber-300 shadow-md animate-pulse"
                : "bg-white/10 text-white/80 border-white/15 hover:bg-white/20"
            }`}
            title="Ativar conversa hands-free sem clicar no microfone"
          >
            <Mic size={13} />
            <span className="hidden sm:inline">{isHandsFree ? "Mãos Livres ON" : "Mãos Livres"}</span>
          </button>

          {/* Native Explanation Language Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-xs font-bold transition-all border border-white/15 cursor-pointer"
              title="Mudar Idioma da Explicação da Assistente"
            >
              <span>{nativeLangConfig.flag}</span>
              <span className="text-[10px] font-black">{nativeLangConfig.code.split('-')[0].toUpperCase()}</span>
              <ChevronDown size={12} className={`transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Language Selector Popover */}
            <AnimatePresence>
              {isLangMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute right-0 top-10 mt-1 w-48 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-1.5 z-50 space-y-1"
                >
                  <p className="text-[9px] font-mono text-slate-400 font-extrabold uppercase px-2 py-1">
                    Idioma Nativo da Assistente
                  </p>
                  {NATIVE_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onChangeNativeLanguage(lang.code);
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                        lang.code === nativeLanguageCode
                          ? "bg-indigo-600 text-white font-extrabold"
                          : "hover:bg-slate-800 text-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Toggle Voice On/Off Button */}
          <button
            onClick={onToggleEnabled}
            className={`p-2 rounded-2xl transition-all border shadow-sm cursor-pointer ${
              isEnabled
                ? "bg-emerald-500 text-slate-950 font-black border-emerald-400 hover:bg-emerald-400"
                : "bg-white/10 text-white/60 border-white/10 hover:bg-white/20"
            }`}
            title={isEnabled ? "Desativar Assistente de Voz" : "Ativar Assistente de Voz"}
          >
            {isEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* Expand/Collapse Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 transition-all cursor-pointer text-white"
          >
            <ChevronDown size={16} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Speech Bubble & Assistant Guidance Section */}
      <AnimatePresence>
        {isExpanded && isEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-white/15 space-y-3"
          >
            {/* Speech Transcript Bubble */}
            <div className="relative bg-black/25 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 shadow-inner flex items-start gap-3">
              <MessageSquare size={18} className="text-amber-300 mt-0.5 shrink-0" />
              <div className="flex-1 space-y-1">
                <p className="text-xs sm:text-sm font-medium leading-relaxed text-indigo-50 font-mono">
                  {currentSpeechText || nativeLangConfig.phrases.greeting}
                </p>

                {/* Target Word Highlight Chip if available */}
                {targetWord && (
                  <div className="pt-1.5 flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold text-indigo-200">Palavra Atual:</span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-amber-400 text-slate-950 font-black text-sm shadow-md">
                      {targetWord}
                    </span>
                    {targetPhonetic && (
                      <span className="text-[11px] font-mono text-amber-200 bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-400/30">
                        {targetPhonetic}
                      </span>
                    )}
                    {targetTranslation && (
                      <span className="text-xs italic text-indigo-100">
                        ({targetTranslation})
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Pronunciation Practice Feedback Badge */}
            {speechFeedback && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-400 text-slate-950 p-2.5 rounded-xl font-bold text-xs text-center shadow-lg animate-bounce"
              >
                {speechFeedback}
              </motion.div>
            )}

            {/* Replay & Microphone Practice Buttons */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                onClick={onReplayGuidance}
                className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/15 hover:bg-white/25 active:scale-95 transition-all text-xs font-bold border border-white/20 shadow-sm cursor-pointer"
              >
                <RefreshCw size={14} className={isSpeaking ? 'animate-spin' : ''} />
                <span>Ouvir Orientação Novamente</span>
              </button>

              <button
                onClick={handleStartPronunciationPractice}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black transition-all shadow-md active:scale-95 border cursor-pointer ${
                  isListening
                    ? "bg-red-500 text-white border-red-400 animate-pulse"
                    : "bg-amber-400 hover:bg-amber-300 text-slate-950 border-amber-300 shadow-amber-400/20"
                }`}
              >
                {isListening ? <MicOff size={14} /> : <Mic size={14} />}
                <span>{isListening ? 'Ouvindo Sua Voz...' : 'Repetir em Voz Alta'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
