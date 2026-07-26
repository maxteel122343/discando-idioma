import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sentence, joinSentence } from "../types";
import { 
  Volume2, 
  Upload, 
  BookOpen, 
  CheckCircle, 
  RefreshCw, 
  ChevronRight, 
  X, 
  Sparkles, 
  Book, 
  Info,
  Loader2
} from "lucide-react";
import { playTick } from "../utils/audio";

interface EbookReaderPanelProps {
  ebookName: string;
  sentences: Sentence[];
  activeIndex: number;
  completedIndices: number[];
  onSelectSentence: (index: number) => void;
  onUploadEbook: (name: string, text: string) => Promise<void>;
  onSelectPreloaded: (key: string) => void;
  onExitEbook: () => void;
  onSpeak: (text: string) => void;
  isParsing: boolean;
  activeSequence?: string[];
  isHintEnabled?: boolean;
  isMonochrome?: boolean;
}

export default function EbookReaderPanel({
  ebookName,
  sentences,
  activeIndex,
  completedIndices,
  onSelectSentence,
  onUploadEbook,
  onSelectPreloaded,
  onExitEbook,
  onSpeak,
  isParsing,
  activeSequence = [],
  isHintEnabled = true,
  isMonochrome = false,
}: EbookReaderPanelProps) {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const processFile = async (file: File) => {
    playTick();
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      await onUploadEbook(file.name.replace(".txt", ""), text);
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.name.endsWith(".txt")) {
      await processFile(file);
    }
  };

  // Progress calculations
  const totalSentences = sentences.length;
  const completedCount = completedIndices.length;
  const progressPercent = totalSentences > 0 ? Math.round((completedCount / totalSentences) * 100) : 0;

  return (
    <div className="w-full lg:w-[420px] bg-white dark:bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 flex flex-col h-[650px] lg:h-full overflow-hidden shadow-2xl relative">
      
      {/* Header */}
      <div className="p-5 border-b border-indigo-50 dark:border-indigo-950/60 flex items-center justify-between bg-indigo-50/20 dark:bg-slate-950/20">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <BookOpen size={18} />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-1">
              Modo Leitura Ativo 📖
            </h2>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold truncate max-w-[200px]">
              {ebookName || "Carregue ou escolha um livro"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {sentences.length > 0 && (
            <button
              onClick={() => { playTick(); fileInputRef.current?.click(); }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-black bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:hover:bg-indigo-950/70 dark:text-indigo-400 transition-all active:scale-95 border border-indigo-100/50 dark:border-indigo-900/30 cursor-pointer"
              title="Fazer upload de outro livro (.txt)"
            >
              <Upload size={13} />
              <span className="hidden xs:inline">Mudar Livro</span>
            </button>
          )}

          <button
            onClick={() => { playTick(); onExitEbook(); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all active:scale-95 cursor-pointer"
            title="Sair do Modo Ebook"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
        {isParsing ? (
          <div className="flex flex-col items-center justify-center h-full py-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
              Analisando texto com Gemini AI...
            </p>
            <p className="text-[10px] text-slate-400 max-w-[220px]">
              Extraindo sentenças em chinês, gerando pronúncias em pinyin, traduções e decomposições gramaticais.
            </p>
          </div>
        ) : sentences.length === 0 ? (
          <div className="space-y-4">
            {/* Built-in Preloaded Books selection */}
            <div className="space-y-2.5">
              <h3 className="text-[11px] font-black tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                Escolha um Livro Pré-Carregado
              </h3>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => onSelectPreloaded("prince")}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-indigo-50 to-white dark:from-indigo-950/20 dark:to-slate-900 border border-indigo-100 dark:border-indigo-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🌹</span>
                    <div>
                      <h4 className="text-xs font-black text-slate-800 dark:text-slate-200">O Pequeno Príncipe (小王子)</h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Filosofia clássica e doçura em Mandarim</p>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-indigo-400" />
                </button>

                <button
                  onClick={() => onSelectPreloaded("idioms")}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-orange-50 to-white dark:from-orange-950/20 dark:to-slate-900 border border-orange-100 dark:border-orange-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🐇</span>
                    <div>
                      <h4 className="text-xs font-black text-slate-800 dark:text-slate-200">História dos Provérbios (成语故事)</h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Aprenda Chengyu tradicionais e belas fábulas</p>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-orange-400" />
                </button>

                <button
                  onClick={() => onSelectPreloaded("dialogs")}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-white dark:from-emerald-950/20 dark:to-slate-900 border border-emerald-100 dark:border-emerald-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🚇</span>
                    <div>
                      <h4 className="text-xs font-black text-slate-800 dark:text-slate-200">Diálogos de Viagem (旅行汉语)</h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Frases do dia a dia, aeroporto, hotel e metrô</p>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-emerald-400" />
                </button>
              </div>
            </div>

            {/* Custom File upload with Drag and Drop */}
            <div className="space-y-2">
              <h3 className="text-[11px] font-black tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                Ou Faça Upload de seu Próprio Livro (.txt)
              </h3>
              
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2.5 ${
                  dragOver
                    ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/25 scale-[1.01]"
                    : "border-slate-200 hover:border-indigo-400 dark:border-slate-800 dark:hover:border-indigo-900 bg-slate-50/50 dark:bg-slate-950/20"
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Upload size={18} />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-700 dark:text-slate-300">
                    Arraste seu arquivo .txt aqui
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                    Ou clique para navegar do computador
                  </p>
                </div>
              </div>

              {/* Gemini benefits info */}
              <div className="p-3 bg-indigo-50/40 dark:bg-indigo-950/10 border border-indigo-100/50 dark:border-indigo-900/30 rounded-2xl flex gap-2">
                <Info size={14} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                <p className="text-[10px] leading-relaxed text-indigo-900/80 dark:text-indigo-300/80 font-medium">
                  <strong>Análise por IA:</strong> Ao fazer upload de qualquer livro no idioma selecionado, a API do Gemini processará o texto, extrairá as frases principais, guia fonético e gerará traduções e explicações detalhadas em português em tempo real!
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Page Header & Navigation */}
              {(() => {
                const TOTAL_PAGES = 10;
                const sentencesPerPage = Math.max(1, Math.ceil(sentences.length / TOTAL_PAGES));
                const currentPage = Math.min(TOTAL_PAGES, Math.floor(activeIndex / sentencesPerPage) + 1);
                const startIdx = (currentPage - 1) * sentencesPerPage;
                const pageSentences = sentences.slice(startIdx, startIdx + sentencesPerPage);

                return (
                  <>
                    <div className="flex items-center justify-between bg-indigo-50/60 dark:bg-indigo-950/40 p-2.5 rounded-2xl border border-indigo-100/60 dark:border-indigo-900/40 shadow-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-black text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/60 px-2.5 py-1 rounded-xl">
                          📖 Página {currentPage} de {TOTAL_PAGES}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                          {completedCount} / {totalSentences} Concluídas
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          disabled={currentPage <= 1}
                          onClick={() => {
                            playTick();
                            const prevPageIdx = (currentPage - 2) * sentencesPerPage;
                            onSelectSentence(Math.max(0, prevPageIdx));
                          }}
                          className="px-2.5 py-1 rounded-xl text-xs font-black bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 cursor-pointer active:scale-95 transition-all shadow-2xs"
                          title="Página Anterior"
                        >
                          ◄ Anterior
                        </button>
                        <button
                          disabled={currentPage >= TOTAL_PAGES}
                          onClick={() => {
                            playTick();
                            const nextPageIdx = currentPage * sentencesPerPage;
                            onSelectSentence(Math.min(sentences.length - 1, nextPageIdx));
                          }}
                          className="px-2.5 py-1 rounded-xl text-xs font-black bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 cursor-pointer active:scale-95 transition-all shadow-2xs"
                          title="Próxima Página"
                        >
                          Próxima ►
                        </button>
                      </div>
                    </div>

                    {/* 10 Page Pills Navigation Bar */}
                    <div className="grid grid-cols-10 gap-1 my-1.5">
                      {Array.from({ length: TOTAL_PAGES }).map((_, pIdx) => {
                        const pageNum = pIdx + 1;
                        const pageStart = pIdx * sentencesPerPage;
                        const pageEnd = pageStart + sentencesPerPage;
                        const isCurrent = pageNum === currentPage;
                        const pageIndices = Array.from({ length: Math.min(sentencesPerPage, sentences.length - pageStart) }, (_, k) => pageStart + k);
                        const isPageComplete = pageIndices.length > 0 && pageIndices.every(idx => completedIndices.includes(idx));

                        return (
                          <button
                            key={`page-pill-${pageNum}`}
                            onClick={() => {
                              playTick();
                              onSelectSentence(pageStart);
                            }}
                            className={`py-1 rounded-lg text-[10px] font-black transition-all border cursor-pointer ${
                              isCurrent
                                ? "bg-amber-400 text-slate-950 border-amber-500 shadow-md ring-2 ring-amber-300/60 scale-105"
                                : isPageComplete
                                ? "bg-emerald-500 text-white border-emerald-600"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-750 hover:bg-slate-200"
                            }`}
                            title={`Ir para Página ${pageNum}`}
                          >
                            P{pageNum}
                          </button>
                        );
                      })}
                    </div>

                    {/* Sentence list for current page */}
                    <div className="space-y-2.5 max-h-[420px] lg:max-h-none overflow-y-auto pr-1">
                      {pageSentences.map((sentence) => {
                        const idx = sentences.findIndex(s => s.id === sentence.id);
                        const isActive = activeIndex === idx;
                        const isCompleted = completedIndices.includes(idx);

                        return (
                          <div
                            key={sentence.id}
                            onClick={() => { playTick(); onSelectSentence(idx); }}
                            className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative group flex flex-col gap-2 ${
                              isActive
                                ? "bg-amber-500/10 border-amber-400 shadow-md ring-2 ring-amber-400/20"
                                : isCompleted
                                ? "bg-emerald-500/5 border-emerald-400/40 opacity-90"
                                : "bg-slate-50/60 hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900 border-slate-200/60 dark:border-slate-800"
                            }`}
                          >
                            {/* Status ribbon/badge */}
                            <div className="flex items-center justify-between">
                              <span className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded-full ${
                                isActive 
                                  ? "bg-amber-500 text-slate-900"
                                  : isCompleted
                                  ? "bg-emerald-500 text-white"
                                  : "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                              }`}>
                                {isActive ? "Sua Prática Atual" : isCompleted ? "Frase Concluída (+25 XP) ✓" : `Frase ${idx + 1}`}
                              </span>

                              {/* Text-to-speech button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  playTick();
                                  onSpeak(joinSentence(sentence.characters));
                                }}
                                className={`p-1.5 rounded-full border transition-all active:scale-90 ${
                                  isActive
                                    ? "bg-amber-500/20 border-amber-400 text-amber-700 dark:text-amber-400"
                                    : "bg-white hover:bg-slate-100 dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800"
                                }`}
                                title="Ouvir pronúncia original do livro"
                              >
                                <Volume2 size={12} />
                              </button>
                            </div>

                            {/* Sentence Characters Display with Blinking Target Highlight */}
                            {isActive ? (
                              <div className="flex flex-wrap items-center gap-1.5 my-0.5">
                                {sentence.characters.map((char, charIdx) => {
                                  const isPlacedInSeq = charIdx < activeSequence.length;
                                  const isCurrentTarget = charIdx === activeSequence.length;

                                  return (
                                    <span
                                      key={`${sentence.id}-${charIdx}-${char}`}
                                      className={`px-2.5 py-1 rounded-xl font-bold text-lg sm:text-xl transition-all duration-300 flex items-center gap-1 relative ${
                                        isPlacedInSeq
                                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-400/40"
                                          : isCurrentTarget && isHintEnabled
                                          ? isMonochrome
                                            ? "bg-black text-white dark:bg-white dark:text-black font-black border-2 border-slate-900 dark:border-slate-100 ring-4 ring-slate-400/60 animate-bounce scale-110 shadow-lg"
                                            : "bg-amber-400 text-slate-950 font-black border-2 border-amber-500 shadow-xl ring-4 ring-amber-300/80 dark:ring-amber-400/60 animate-bounce scale-110"
                                          : isCurrentTarget
                                          ? "bg-indigo-600 text-white font-black border border-indigo-400 shadow-md scale-105"
                                          : "bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80"
                                      }`}
                                    >
                                      <span>{char}</span>
                                      {isPlacedInSeq && <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black">✓</span>}
                                      {isCurrentTarget && isHintEnabled && (
                                        <span className="w-2 h-2 rounded-full bg-amber-950 dark:bg-amber-900 animate-ping absolute -top-1 -right-1" />
                                      )}
                                    </span>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="text-xl font-bold tracking-wide text-slate-900 dark:text-slate-100">
                                {joinSentence(sentence.characters)}
                              </div>
                            )}

                            {/* Pronunciation & Translation (only visible if active or completed) */}
                            {(isActive || isCompleted) && (
                              <div className="text-[11px] font-medium space-y-1 bg-white/40 dark:bg-black/10 p-2.5 rounded-xl border border-slate-150/40 dark:border-slate-850/40">
                                <div className="text-indigo-600 dark:text-indigo-400 font-bold">
                                  {sentence.pinyin}
                                </div>
                                <div className="text-slate-500 dark:text-slate-400 italic font-semibold">
                                  "{sentence.translation}"
                                </div>
                                {isActive && sentence.explanation && (
                                  <div className="text-[9.5px] text-slate-400 dark:text-slate-500 leading-normal border-t border-slate-200/50 dark:border-slate-800/50 pt-1.5 mt-1.5">
                                    💡 {sentence.explanation}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                );
              })()}

              {/* Book completed message */}
              {completedCount === totalSentences && (
                <div className="p-4 bg-emerald-500/10 border-2 border-emerald-400 text-center rounded-3xl space-y-1.5 animate-bounce">
                  <span className="text-3xl">🏆</span>
                  <h4 className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                    Parabéns! Leitura Concluída!
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                    Você completou e "discou" com sucesso todas as frases do livro <strong>{ebookName}</strong>! Sua audição e pronúncia estão fantásticas.
                  </p>
                </div>
              )}
            </div>
          )}
      </div>

      {/* Progress Tracker (Vibrant color based progress) */}
      {sentences.length > 0 && (
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/30 flex flex-col gap-2">
          <div className="flex items-center justify-between w-full text-xs font-bold text-slate-600 dark:text-slate-300 px-1">
            <span>Leitura do Livro</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              className="bg-gradient-to-r from-emerald-400 via-teal-500 to-indigo-600 h-full rounded-full"
            />
          </div>
          <p className="text-[10px] text-slate-400 text-center font-medium mt-0.5">
            Acerte a frase atual no disco central para avançar no livro
          </p>
        </div>
      )}

      {/* Hidden file input always in DOM for upload capability */}
      <input
        type="file"
        accept=".txt"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

    </div>
  );
}
