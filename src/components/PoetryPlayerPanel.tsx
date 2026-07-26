import React, { useState } from 'react';
import { PoemTrack } from '../data/poetryPlaylist';
import { joinSentence } from '../types';
import { 
  Feather, 
  BookOpen, 
  CheckCircle2, 
  Volume2, 
  Sparkles, 
  Plus, 
  ChevronRight, 
  User, 
  Info,
  X,
  PlayCircle
} from 'lucide-react';

interface PoetryPlayerPanelProps {
  poems: PoemTrack[];
  activePoemId: string;
  activeSentenceIndex: number;
  completedSentenceIndices: number[];
  onSelectPoem: (poemId: string) => void;
  onSelectSentence: (index: number) => void;
  onAddCustomPoem: (newPoem: PoemTrack) => void;
  onExitPoetry: () => void;
  onSpeakSentence: (text: string) => void;
  onSpeakAuthorBio: (author: string, bio: string, context: string) => void;
}

export function PoetryPlayerPanel({
  poems,
  activePoemId,
  activeSentenceIndex,
  completedSentenceIndices,
  onSelectPoem,
  onSelectSentence,
  onAddCustomPoem,
  onExitPoetry,
  onSpeakSentence,
  onSpeakAuthorBio
}: PoetryPlayerPanelProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customAuthor, setCustomAuthor] = useState('');
  const [customBio, setCustomBio] = useState('');
  const [customContext, setCustomContext] = useState('');
  const [customVerses, setCustomVerses] = useState('');

  const activePoem = poems.find((p) => p.id === activePoemId) || poems[0];

  const handleAddCustomPoemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim() || !customVerses.trim()) return;

    const rawLines = customVerses.split('\n').filter((l) => l.trim().length > 0);
    const sentences = rawLines.map((line, idx) => {
      const words = line.trim().split(/\s+/);
      return {
        id: `custom-p-sent-${Date.now()}-${idx}`,
        characters: words,
        pinyin: line,
        translation: line,
        category: 'Poesia',
        difficulty: 'Médio' as const,
        explanation: 'Verso personalizado.'
      };
    });

    const newPoem: PoemTrack = {
      id: `poem-custom-${Date.now()}`,
      title: customTitle.trim(),
      titlePt: customTitle.trim(),
      author: customAuthor.trim() || 'Autor Desconhecido',
      authorBio: customBio.trim() || 'Poeta inspirado.',
      poemContext: customContext.trim() || 'Poema adicionado pelo usuário.',
      coverEmoji: '✍️',
      coverGradient: 'from-amber-600 to-rose-700',
      language: 'Português',
      sentences,
      isCustom: true
    };

    onAddCustomPoem(newPoem);

    setCustomTitle('');
    setCustomAuthor('');
    setCustomBio('');
    setCustomContext('');
    setCustomVerses('');
    setShowAddModal(false);
  };

  return (
    <div className="w-full lg:w-96 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-l border-amber-100 dark:border-amber-950/40 flex flex-col h-full shadow-2xl z-30 transition-all">
      {/* Header */}
      <div className="p-4 border-b border-amber-100 dark:border-amber-950/40 flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/20">
            <Feather size={20} />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-850 dark:text-slate-100 flex items-center gap-1.5">
              <span>Sarau de Poesia</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-extrabold dark:bg-amber-950 dark:text-amber-300">
                Poetas Reais
              </span>
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Explore obras clássicas e curiosidades dos autores
            </p>
          </div>
        </div>

        <button
          onClick={onExitPoetry}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          title="Sair do Modo Poesia"
        >
          <X size={18} />
        </button>
      </div>

      {/* Poem List Selector */}
      <div className="p-3 bg-slate-50/80 dark:bg-slate-950/50 border-b border-amber-100 dark:border-amber-950/30 overflow-x-auto scrollbar-none flex gap-2">
        {poems.map((poem) => {
          const isActive = poem.id === activePoem.id;
          return (
            <button
              key={poem.id}
              onClick={() => onSelectPoem(poem.id)}
              className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer active:scale-95 ${
                isActive
                  ? 'bg-amber-600 text-white border-amber-500 shadow-md shadow-amber-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-amber-50 dark:hover:bg-slate-800'
              }`}
            >
              <span className="text-sm">{poem.coverEmoji}</span>
              <div className="text-left">
                <p className="line-clamp-1 font-extrabold">{poem.title}</p>
                <p className={`text-[10px] ${isActive ? 'text-amber-100' : 'text-slate-400'}`}>
                  {poem.author}
                </p>
              </div>
            </button>
          );
        })}

        <button
          onClick={() => setShowAddModal(true)}
          className="shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50 cursor-pointer"
        >
          <Plus size={14} />
          <span>Nova Poesia</span>
        </button>
      </div>

      {/* Active Poem Card & Author Curiosity Section */}
      <div className="p-4 overflow-y-auto flex-1 space-y-4">
        {/* Poem Banner */}
        <div className={`p-4 rounded-2xl bg-gradient-to-br ${activePoem.coverGradient} text-white shadow-lg relative overflow-hidden`}>
          <div className="absolute top-2 right-2 text-4xl opacity-20 select-none">
            {activePoem.coverEmoji}
          </div>
          <div className="relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
              {activePoem.language}
            </span>
            <h3 className="text-lg font-black mt-2 leading-tight">{activePoem.title}</h3>
            <p className="text-xs font-semibold opacity-90">{activePoem.titlePt}</p>
            <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-amber-100">
              <User size={14} />
              <span>{activePoem.author}</span>
            </div>
          </div>
        </div>

        {/* AI Tutor Curiosity Box */}
        <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-900 dark:text-amber-300">
              <Sparkles size={15} className="text-amber-600 dark:text-amber-400" />
              <span>IA Explica: Sobre o Autor & Poesia</span>
            </div>
            <button
              onClick={() => onSpeakAuthorBio(activePoem.author, activePoem.authorBio, activePoem.poemContext)}
              className="flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-xl bg-amber-600 text-white hover:bg-amber-700 shadow-sm transition-all cursor-pointer active:scale-95"
              title="Ouvir a IA explicando sobre o autor e a poesia"
            >
              <Volume2 size={13} />
              <span>Ouvir Voz</span>
            </button>
          </div>

          <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-amber-100 dark:border-amber-900/20">
              <p className="font-bold text-amber-800 dark:text-amber-400 text-[11px] mb-0.5 flex items-center gap-1">
                <User size={12} />
                <span>Biografia & Curiosidade:</span>
              </p>
              <p>{activePoem.authorBio}</p>
            </div>

            <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-amber-100 dark:border-amber-900/20">
              <p className="font-bold text-rose-800 dark:text-rose-400 text-[11px] mb-0.5 flex items-center gap-1">
                <Info size={12} />
                <span>Significado do Poema:</span>
              </p>
              <p>{activePoem.poemContext}</p>
            </div>
          </div>
        </div>

        {/* Verses List */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Versos & Estrofes ({activePoem.sentences.length})
            </h4>
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
              {completedSentenceIndices.length}/{activePoem.sentences.length} Completos
            </span>
          </div>

          <div className="space-y-2">
            {activePoem.sentences.map((sent, index) => {
              const isSelected = index === activeSentenceIndex;
              const isDone = completedSentenceIndices.includes(index);

              return (
                <div
                  key={sent.id}
                  onClick={() => onSelectSentence(index)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-400/50'
                      : isDone
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 text-slate-800 dark:text-slate-200'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700'
                  }`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                        isSelected 
                          ? 'bg-white/20 text-white' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        Verso {index + 1}
                      </span>
                      {isDone && !isSelected && (
                        <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold flex items-center gap-0.5">
                          <CheckCircle2 size={12} /> Concluído
                        </span>
                      )}
                    </div>

                    <p className={`text-sm font-bold leading-snug ${isSelected ? 'text-white' : 'text-slate-850 dark:text-slate-100'}`}>
                      {joinSentence(sent.characters)}
                    </p>

                    <p className={`text-xs italic ${isSelected ? 'text-amber-100' : 'text-slate-500 dark:text-slate-400'}`}>
                      "{sent.translation}"
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSpeakSentence(joinSentence(sent.characters));
                    }}
                    className={`p-1.5 rounded-lg transition-all ${
                      isSelected 
                        ? 'hover:bg-white/20 text-white' 
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-amber-600'
                    }`}
                    title="Ouvir Pronúncia"
                  >
                    <Volume2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Custom Poem Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Feather size={18} className="text-amber-600" />
                <span>Adicionar Poesia Personalizada</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddCustomPoemSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Título da Poesia *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Canção do Exílio"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nome do Autor / Poetisa
                </label>
                <input
                  type="text"
                  placeholder="Ex: Gonçalves Dias"
                  value={customAuthor}
                  onChange={(e) => setCustomAuthor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Biografia ou Curiosidade sobre o Autor (IA irá ler)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Poeta romântico brasileiro famoso por exaltar a pátria..."
                  value={customBio}
                  onChange={(e) => setCustomBio(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Contexto / Significado do Poema
                </label>
                <input
                  type="text"
                  placeholder="Ex: Escrito na Europa, expressa a saudade profunda do Brasil..."
                  value={customContext}
                  onChange={(e) => setCustomContext(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Versos da Poesia (Um verso por linha) *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder={'Minha terra tem palmeiras\nOnde canta o Sabiá\nAs aves que aqui gorjeiam\nNão gorjeiam como lá'}
                  value={customVerses}
                  onChange={(e) => setCustomVerses(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-md cursor-pointer"
                >
                  Salvar Poesia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
