import React, { useState, useEffect, useRef } from 'react';
import { 
  Music, Play, Pause, Repeat, Volume2, VolumeX, Plus, Lock, 
  CheckCircle2, Radio, Sparkles, Upload, X, Headphones, RefreshCw, Zap
} from 'lucide-react';
import { SongTrack } from '../data/musicPlaylist';
import { Sentence, joinSentence } from '../types';
import { playTick, playSuccess } from '../utils/audio';

interface MusicPlayerPanelProps {
  songs: SongTrack[];
  activeSongId: string;
  activeSentenceIndex: number;
  completedSentenceIndices: number[];
  onSelectSong: (songId: string) => void;
  onSelectSentence: (index: number) => void;
  onSpeakSentence: (text: string) => void;
  onAddCustomSong: (newSong: SongTrack) => void;
  onExitMusic?: () => void;
  onMinimizeMusic?: () => void;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
}

export const MusicPlayerPanel: React.FC<MusicPlayerPanelProps> = ({
  songs,
  activeSongId,
  activeSentenceIndex,
  completedSentenceIndices,
  onSelectSong,
  onSelectSentence,
  onSpeakSentence,
  onAddCustomSong,
  onExitMusic,
  onMinimizeMusic,
  isPlaying: propIsPlaying,
  onTogglePlay: propOnTogglePlay,
}) => {
  const currentSong = songs.find((s) => s.id === activeSongId) || songs[0];
  const sentences = currentSong?.sentences || [];

  // Playback states
  const [localIsPlaying, setLocalIsPlaying] = useState<boolean>(false);
  const isPlaying = propIsPlaying !== undefined ? propIsPlaying : localIsPlaying;
  const [isLoopSentenceMode, setIsLoopSentenceMode] = useState<boolean>(false); // Music autoplay ON by default, sentence pronunciation repeat OFF
  const [volume, setVolume] = useState<number>(0.7);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  // Audio Synth / HTML5 Audio ref
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthLoopTimerRef = useRef<any>(null);

  // Form states for uploading custom song
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [newLanguage, setNewLanguage] = useState('Chinês Mandarim');
  const [newEmoji, setNewEmoji] = useState('🎵');
  const [newLyricsRaw, setNewLyricsRaw] = useState('');
  const [newAudioFile, setNewAudioFile] = useState<File | null>(null);
  const [newAudioUrl, setNewAudioUrl] = useState<string>('');

  // Autoplay on song change
  useEffect(() => {
    if (propOnTogglePlay) {
      if (!propIsPlaying) {
        propOnTogglePlay();
      }
    } else {
      setLocalIsPlaying(true);
    }
  }, [activeSongId]);

  // Handle HTML5 Audio element setup when audioUrl exists
  useEffect(() => {
    if (currentSong?.audioUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(currentSong.audioUrl);
      audio.volume = isMuted ? 0 : volume;
      audio.loop = !isLoopSentenceMode;
      audioRef.current = audio;
      
      // If we are already in playing state, trigger play instantly on new Audio instantiation
      if (isPlaying && !isLoopSentenceMode) {
        audio.play().catch((e) => console.log('Audio autoplay on load prevented', e));
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (synthLoopTimerRef.current) {
        clearInterval(synthLoopTimerRef.current);
      }
    };
  }, [currentSong?.id, currentSong?.audioUrl, isPlaying]);

  // Volume / Mute listener
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Sentence Loop Audio Reforço Handler
  useEffect(() => {
    if (synthLoopTimerRef.current) {
      clearInterval(synthLoopTimerRef.current);
    }

    if (isPlaying) {
      if (isLoopSentenceMode) {
        // Play sentence audio repeat loop every 3.8 seconds to enforce repetition
        const activeSentence = sentences[activeSentenceIndex];
        if (activeSentence) {
          const speakActive = () => {
            onSpeakSentence(joinSentence(activeSentence.characters));
          };
          speakActive(); // speak immediately
          synthLoopTimerRef.current = setInterval(speakActive, 4200);
        }
      } else if (currentSong?.audioUrl && audioRef.current) {
        audioRef.current.play().catch((e) => console.log('Audio autoplay prevented', e));
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }

    return () => {
      if (synthLoopTimerRef.current) {
        clearInterval(synthLoopTimerRef.current);
      }
    };
  }, [isPlaying, isLoopSentenceMode, activeSentenceIndex, currentSong?.id]);

  const togglePlay = () => {
    playTick();
    if (propOnTogglePlay) {
      propOnTogglePlay();
    } else {
      setLocalIsPlaying(!localIsPlaying);
    }
  };

  const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewAudioFile(file);
      const objectUrl = URL.createObjectURL(file);
      setNewAudioUrl(objectUrl);
    }
  };

  const handleSaveCustomSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newLyricsRaw.trim()) return;

    // Parse lyrics line by line
    const rawLines = newLyricsRaw
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const generatedSentences: Sentence[] = rawLines.map((line, idx) => {
      // Split into characters or words
      const isAsian = /[\u4e00-\u9fa5]/.test(line);
      const chars = isAsian ? line.split('') : line.split(/\s+/);

      return {
        id: `custom-song-${Date.now()}-${idx}`,
        characters: chars,
        pinyin: line,
        translation: `Linha ${idx + 1} da música ${newTitle}`,
        category: 'Música',
        difficulty: chars.length > 6 ? 'Médio' : 'Fácil',
        explanation: `Pratique os ideogramas/palavras da linha ${idx + 1}.`,
      };
    });

    const newTrack: SongTrack = {
      id: `custom-track-${Date.now()}`,
      title: newTitle,
      artist: newArtist || 'Artista Desconhecido',
      coverEmoji: newEmoji || '🎵',
      coverGradient: 'from-fuchsia-500 to-indigo-600',
      language: newLanguage,
      sentences: generatedSentences,
      audioUrl: newAudioUrl,
      isCustom: true,
    };

    onAddCustomSong(newTrack);
    playSuccess();

    // Reset form
    setNewTitle('');
    setNewArtist('');
    setNewLyricsRaw('');
    setNewAudioFile(null);
    setNewAudioUrl('');
    setIsUploadModalOpen(false);
  };

  const completedCount = completedSentenceIndices.length;
  const totalSentences = sentences.length;
  const isSongCompleted = totalSentences > 0 && completedCount === totalSentences;

  // Only show songs that are NOT hidden (isHidden !== true), plus always show custom user-added songs
  const visibleSongs = songs.filter(s => !s.isHidden || s.isCustom);

  // Drag to scroll logic for playlist container
  const playlistRef = useRef<HTMLDivElement | null>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!playlistRef.current) return;
    setIsMouseDown(true);
    setStartX(e.pageX - playlistRef.current.offsetLeft);
    setScrollLeftState(playlistRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsMouseDown(false);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMouseDown || !playlistRef.current) return;
    e.preventDefault();
    const x = e.pageX - playlistRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // scroll speed multiplier
    playlistRef.current.scrollLeft = scrollLeftState - walk;
  };

  return (
    <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4 max-w-xl mx-auto transition-all">
      {/* Header Banner */}
      <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white flex items-center justify-center shadow-md animate-pulse">
            <Music size={20} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 tracking-tight">
                MODO MÚSICA & PLAYLIST
              </h3>
              <span className="bg-pink-500/10 text-pink-600 dark:text-pink-400 text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded-full border border-pink-400/30">
                AUDIÇÃO ATIVA
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Aprenda o idioma discando as letras com ritmo e melodia!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(onMinimizeMusic || onExitMusic) && (
            <button
              onClick={() => { 
                playTick(); 
                if (onMinimizeMusic) {
                  onMinimizeMusic();
                } else if (onExitMusic) {
                  onExitMusic();
                }
              }}
              className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400 transition-all active:scale-95 cursor-pointer"
              title="Minimizar Playlist"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Playlist Horizontal Scroll Bar */}
      <div className="space-y-1.5 select-none">
        <div className="flex items-center justify-between text-[11px] font-mono font-black text-slate-400 uppercase tracking-wider px-1">
          <span>Playlist de Músicas</span>
        </div>

        <div
          ref={playlistRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`flex items-center gap-2.5 overflow-x-auto pb-2 custom-scrollbar pt-1 cursor-grab active:cursor-grabbing ${
            isMouseDown ? 'select-none' : ''
          }`}
        >
          {visibleSongs.map((song, sIdx) => {
            // Unlocking logic: Song 0 unlocked. Song N unlocked if Song N-1 complete or if it's custom.
            const prevSong = visibleSongs[sIdx - 1];
            const isUnlocked =
              sIdx === 0 ||
              song.isCustom ||
              (prevSong &&
                prevSong.sentences.every((_, idx) =>
                  // Check if prev song completed or unlocked
                  true
                ));

            const isCurrent = song.id === activeSongId;

            return (
              <div
                key={song.id}
                onClick={() => {
                  if (isUnlocked) {
                    playTick();
                    onSelectSong(song.id);
                  }
                }}
                className={`flex-shrink-0 w-36 sm:w-40 p-2.5 rounded-2xl border transition-all cursor-pointer relative group flex flex-col justify-between h-24 ${
                  isCurrent
                    ? "bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-indigo-500 shadow-lg ring-2 ring-indigo-400/30 scale-102"
                    : isUnlocked
                    ? "bg-slate-50 dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-90"
                    : "bg-slate-100/50 dark:bg-slate-900/30 border-slate-200/50 dark:border-slate-800/40 opacity-50 cursor-not-allowed"
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-2xl">{song.coverEmoji}</span>
                  {!isUnlocked ? (
                    <span className="p-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 text-xs">
                      <Lock size={12} />
                    </span>
                  ) : isCurrent ? (
                    <span className="p-1 rounded-full bg-indigo-600 text-white animate-bounce">
                      <Radio size={12} />
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono font-bold text-slate-400">
                      Mús. {sIdx + 1}
                    </span>
                  )}
                </div>

                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                    {song.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {song.artist}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Nova Música Custom Card inside playlist list */}
          <div
            onClick={() => {
              playTick();
              setIsUploadModalOpen(true);
            }}
            className="flex-shrink-0 w-36 sm:w-40 p-2.5 rounded-2xl border border-dashed border-indigo-400/60 dark:border-indigo-800/60 bg-indigo-50/10 dark:bg-indigo-950/10 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 hover:border-indigo-500 hover:bg-indigo-500/5 transition-all cursor-pointer flex flex-col justify-center items-center gap-1.5 h-24 shadow-sm text-center select-none"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-650 dark:text-indigo-400 font-black text-lg">
              +
            </div>
            <span className="text-[10px] font-black text-indigo-650 dark:text-indigo-400 uppercase tracking-wider">
              Nova Música
            </span>
          </div>
        </div>
      </div>

      {/* Active Music Player Control Box */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-4 shadow-xl border border-indigo-500/30 space-y-3 relative overflow-hidden">
        {/* Animated Background Pulse Wave */}
        {isPlaying && (
          <div className="absolute inset-0 bg-indigo-500/5 animate-pulse pointer-events-none" />
        )}

        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${currentSong.coverGradient} flex items-center justify-center text-2xl shadow-lg ring-2 ring-white/20`}>
              {currentSong.coverEmoji}
            </div>
            <div>
              <span className="text-[9.5px] font-mono font-black text-indigo-300 uppercase tracking-widest bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-400/30">
                {currentSong.language}
              </span>
              <h3 className="text-sm font-black text-white truncate max-w-[200px] sm:max-w-[280px]">
                {currentSong.title}
              </h3>
              <p className="text-xs text-indigo-200/80 font-medium truncate">
                {currentSong.artist}
              </p>
            </div>
          </div>

          {/* Main Play/Pause Button */}
          <button
            onClick={togglePlay}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-slate-950 font-black shadow-xl transition-all cursor-pointer active:scale-95 ${
              isPlaying
                ? "bg-amber-400 hover:bg-amber-300 ring-4 ring-amber-400/30"
                : "bg-white hover:bg-slate-100 ring-4 ring-white/20"
            }`}
            title={isPlaying ? "Pausar Áudio" : "Tocar Áudio no Fundo"}
          >
            {isPlaying ? <Pause size={22} className="fill-slate-950" /> : <Play size={22} className="fill-slate-950 ml-0.5" />}
          </button>
        </div>



        {/* Volume Bar & Sentence Counter */}
        <div className="flex items-center justify-between text-xs text-indigo-200 font-medium pt-1 border-t border-white/10">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-slate-300 hover:text-white transition-colors"
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20 h-1.5 bg-indigo-950 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-amber-300">
            <Sparkles size={12} />
            <span>
              {completedCount} de {totalSentences} Linhas Concluídas
            </span>
          </div>
        </div>
      </div>

      {/* Upload Custom Song Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl space-y-4 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                  <Upload size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">
                    ADICIONAR SUA MÚSICA & LETRA
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Insira o áudio e a letra sincronizada para praticar no discador!
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCustomSong} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Nome da Música *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Ni Hao Song / Despacito"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Artista / Cantor
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Teresa Teng / Bruno Mars"
                    value={newArtist}
                    onChange={(e) => setNewArtist(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Idioma
                  </label>
                  <select
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Chinês Mandarim">Chinês Mandarim</option>
                    <option value="Inglês">Inglês</option>
                    <option value="Espanhol">Espanhol</option>
                    <option value="Français">Français</option>
                    <option value="Italiano">Italiano</option>
                    <option value="Alemão">Alemão</option>
                    <option value="Japonês">Japonês</option>
                    <option value="Coreano">Coreano</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Emoji de Capa
                  </label>
                  <input
                    type="text"
                    maxLength={2}
                    value={newEmoji}
                    onChange={(e) => setNewEmoji(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Arquivo de Áudio da Música (MP3 / WAV / OGG)
                </label>
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 p-3 rounded-2xl text-center bg-slate-50/50 dark:bg-slate-950/50 hover:bg-slate-100 transition-colors">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleCustomFileUpload}
                    className="hidden"
                    id="music-file-upload"
                  />
                  <label
                    htmlFor="music-file-upload"
                    className="cursor-pointer flex flex-col items-center gap-1"
                  >
                    <Upload size={20} className="text-indigo-500" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {newAudioFile ? newAudioFile.name : "Clique para selecionar o áudio no computador"}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      (Opcional - caso não envie, o aplicativo usará a sintetização de voz)
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Letra da Música (uma linha por frase) *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Cole aqui as linhas da música, uma por linha...&#10;Exemplo:&#10;Ni hao ma&#10;Wo hen hao&#10;Xiexie ni"
                  value={newLyricsRaw}
                  onChange={(e) => setNewLyricsRaw(e.target.value)}
                  className="w-full p-3 rounded-2xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-black shadow-lg hover:brightness-110 active:scale-95 transition-all"
                >
                  Salvar Música na Playlist 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
