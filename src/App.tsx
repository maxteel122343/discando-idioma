import { useState, useEffect, useRef } from 'react';
import FloatingWordCanvas from './components/FloatingWordCanvas';
import Sidebar from './components/Sidebar';
import EbookReaderPanel from './components/EbookReaderPanel';
import { MusicPlayerPanel } from './components/MusicPlayerPanel';
import { PoetryPlayerPanel } from './components/PoetryPlayerPanel';
import InstructionsModal from './components/InstructionsModal';
import AIVoiceAssistantCard from './components/AIVoiceAssistantCard';
import MusicVitrine from './components/MusicVitrine';
import CelebrationToast from './components/CelebrationToast';

import LyricsStrip from './components/LyricsStrip';
import WordRainOverlay from './components/WordRainOverlay';
import { SENTENCES } from './data/sentences';
import { LANGUAGES, LanguageConfig } from './data/languages';
import { PRESET_SONGS, SongTrack } from './data/musicPlaylist';
import { PRESET_POEMS, PoemTrack } from './data/poetryPlaylist';
import { Sentence, joinSentence } from './types';
import { playFanfare, playTick, speakLanguageText } from './utils/audio';
import { 
  speakTutorSequence, 
  buildWordGuidanceSequence, 
  buildSentenceCompletionSequence,
  stopTutorSpeech 
} from './utils/aiTutorEngine';
import { 
  BookOpen, 
  Music,
  Feather,
  HelpCircle, 
  Sparkles, 
  Trophy, 
  Menu, 
  X, 
  Compass, 
  ChevronRight,
  Info,
  RefreshCw,
  Settings,
  Volume2,
  SlidersHorizontal,
  FolderOpen,
  Globe,
  Palette,
  Lightbulb,
  Play,
  Pause,
  SkipForward,
  Hand,
  CheckCircle,
  AlertTriangle,
  Expand,
  Shrink
} from 'lucide-react';

const PRELOADED_BOOKS: Record<string, { name: string; sentences: Sentence[] }> = {
  prince: {
    name: "O Pequeno Príncipe (小王子)",
    sentences: [
      // Page 1
      {
        id: "prince-1",
        characters: ["我", "的", "生活", "很", "单调"],
        pinyin: "Wǒ de shēnghuó hěn dāndiào.",
        translation: "Minha vida é muito monótona.",
        category: "Ebook",
        difficulty: "Fácil",
        explanation: "我的 (minha) + 生活 (vida) + 很 (muito) + 单调 (monótona)."
      },
      {
        id: "prince-2",
        characters: ["如果", "你", "驯养", "了", "我"],
        pinyin: "Rúguǒ nǐ xùnyǎng le wǒ.",
        translation: "Se você me cativar.",
        category: "Ebook",
        difficulty: "Fácil",
        explanation: "如果 (se) + 你 (você) + 驯养 (cativar) + 了 (completado) + 我 (mim)."
      },
      // Page 2
      {
        id: "prince-3",
        characters: ["我", "的", "生活", "就会", "充满", "阳光"],
        pinyin: "Wǒ de shēnghuó jiù huì chōngmǎn yángguāng.",
        translation: "Minha vida ficará cheia de sol.",
        category: "Ebook",
        difficulty: "Médio",
        explanation: "就会 (então vai) + 充满 (ficar cheia de) + 阳光 (luz do sol)."
      },
      {
        id: "prince-4",
        characters: ["我", "会", "辨认出", "一种", "与众不同", "的", "脚步声"],
        pinyin: "Wǒ huì biànrèn chū yī zhǒng yǔzhòngbùtóng de jiǎobù shēng.",
        translation: "Eu reconhecerei um som de passos diferente de todos os outros.",
        category: "Ebook",
        difficulty: "Difícil",
        explanation: "与众不同 é um Chengyu tradicional que significa 'único/diferente de todos'."
      },
      // Page 3
      {
        id: "prince-5",
        characters: ["眼睛", "是", "什么", "也", "看不见", "的"],
        pinyin: "Yǎnjing shì shénme yě kàn bù jiàn de.",
        translation: "Os olhos são cegos.",
        category: "Ebook",
        difficulty: "Médio",
        explanation: "眼睛 (olhos) + 看不见 (não conseguem ver)."
      },
      {
        id: "prince-6",
        characters: ["用", "心", "去", "看", "才能", "看", "清楚"],
        pinyin: "Yòng xīn qù kàn cáinéng kàn qīngchu.",
        translation: "Só se vê bem com o coração.",
        category: "Ebook",
        difficulty: "Médio",
        explanation: "用 (usar) + 心 (coração) + 去看 (para ver) + 才能看清楚 (só assim se vê claro)."
      },
      // Page 4
      {
        id: "prince-7",
        characters: ["本质", "的", "东西", "用", "眼睛", "是", "看不见", "的"],
        pinyin: "Běnzhì de dōngxi yòng yǎnjing shì kàn bu jiàn de.",
        translation: "O essencial é invisível aos olhos.",
        category: "Ebook",
        difficulty: "Médio",
        explanation: "本质 (essência) + 的 (de) + 东西 (coisas) + 看不见 (invisível)."
      },
      {
        id: "prince-8",
        characters: ["正是", "你", "为", "玫瑰", "浪费", "的", "时间"],
        pinyin: "Zhèngshì nǐ wèi méigui làngfèi de shíjiān.",
        translation: "Foi o tempo que dedicaste à tua rosa.",
        category: "Ebook",
        difficulty: "Médio",
        explanation: "正是 (é exatamente) + 玫瑰 (rosa) + 时间 (tempo)."
      },
      // Page 5
      {
        id: "prince-9",
        characters: ["使", "你", "的", "玫瑰", "变得", "如此", "重要"],
        pinyin: "Shǐ nǐ de méigui biànde rúcǐ zhòngyào.",
        translation: "Que a fez tão importante.",
        category: "Ebook",
        difficulty: "Médio",
        explanation: "使 (faz/torna) + 变得 (tornar-se) + 如此 (tão) + 重要 (importante)."
      },
      {
        id: "prince-10",
        characters: ["审判", "自己", "比", "审判", "别人", "难"],
        pinyin: "Shěnpàn zìjǐ bǐ shěnpàn biérén nán.",
        translation: "É muito mais difícil julgar a si mesmo do que aos outros.",
        category: "Ebook",
        difficulty: "Difícil",
        explanation: "审判 (julgar) + 自己 (si mesmo) + 比 (comparado a) + 别人 (outros)."
      },
      // Page 6
      {
        id: "prince-11",
        characters: ["所有", "的", "大人", "都", "曾经", "是", "小孩"],
        pinyin: "Suǒyǒu de dàren dōu céngjīng shì xiǎohái.",
        translation: "Todos os adultos já foram crianças.",
        category: "Ebook",
        difficulty: "Fácil",
        explanation: "所有 (todos) + 大人 (adultos) + 曾经 (já foram) + 小孩 (crianças)."
      },
      {
        id: "prince-12",
        characters: ["虽然", "他们", "中", "很少", "有人", "记得"],
        pinyin: "Suīrán tāmen zhōng hěn shǎo yǒurén jìde.",
        translation: "Embora poucos deles se lembrem.",
        category: "Ebook",
        difficulty: "Médio",
        explanation: "虽然 (embora) + 很少 (raramente/poucos) + 记得 (lembrar)."
      },
      // Page 7
      {
        id: "prince-13",
        characters: ["人们", "已经", "忘记", "了", "这个", "真理"],
        pinyin: "Rénmen yǐjīng wàngjì le zhège zhēnlǐ.",
        translation: "Os homens esqueceram essa verdade.",
        category: "Ebook",
        difficulty: "Médio",
        explanation: "人们 (as pessoas) + 已经 (já) + 忘记 (esquecer) + 真理 (verdade)."
      },
      {
        id: "prince-14",
        characters: ["但", "你", "不", "应该", "忘记", "它"],
        pinyin: "Dàn nǐ bù yīnggāi wàngjì tā.",
        translation: "Mas tu não deves esquecê-la.",
        category: "Ebook",
        difficulty: "Fácil",
        explanation: "但 (mas) + 不应该 (não deve) + 忘记 (esquecer) + 它 (ela)."
      },
      // Page 8
      {
        id: "prince-15",
        characters: ["你", "要", "对", "你", "驯养", "的", "东西", "负责"],
        pinyin: "Nǐ yào duì nǐ xùnyǎng de dōngxi fùzé.",
        translation: "Tu te tornas responsável por aquilo que cativas.",
        category: "Ebook",
        difficulty: "Médio",
        explanation: "对...负责 (ser responsável por) + 驯养 (cativado)."
      },
      {
        id: "prince-16",
        characters: ["你", "要", "对", "你", "的", "玫瑰", "负责"],
        pinyin: "Nǐ yào duì nǐ de méigui fùzé.",
        translation: "Tu és responsável pela tua rosa.",
        category: "Ebook",
        difficulty: "Fácil",
        explanation: "玫瑰 (rosa) + 负责 (ser responsável)."
      },
      // Page 9
      {
        id: "prince-17",
        characters: ["沙漠", "之所以", "美丽", "是因为", "藏着", "水井"],
        pinyin: "Shāmò zhīsuǒyǐ měilì shì yīnwèi cángzhe shuǐjǐng.",
        translation: "O deserto é belo porque esconde um poço de água.",
        category: "Ebook",
        difficulty: "Difícil",
        explanation: "沙漠 (deserto) + 美丽 (belo) + 藏着 (esconde) + 水井 (poço)."
      },
      {
        id: "prince-18",
        characters: ["使", "屋子", "美丽", "的", "是", "隐秘", "的", "宝藏"],
        pinyin: "Shǐ wūzi měilì de shì yǐnmì de bǎozàng.",
        translation: "O que atrai na casa é que ela esconde um tesouro.",
        category: "Ebook",
        difficulty: "Difícil",
        explanation: "屋子 (casa) + 美丽 (bela) + 隐秘 (escondido) + 宝藏 (tesouro)."
      },
      // Page 10
      {
        id: "prince-19",
        characters: ["星星", "发光", "是为了", "让", "每个人", "找到", "自己的", "星"],
        pinyin: "Xīngxing fāguāng shì wèile ràng měi gèrén zhǎodào zìjǐ de xīng.",
        translation: "As estrelas brilham para que cada um encontre a sua.",
        category: "Ebook",
        difficulty: "Difícil",
        explanation: "星星 (estrelas) + 发光 (brilhar) + 找到 (encontrar) + 星 (estrela)."
      },
      {
        id: "prince-20",
        characters: ["只要", "用心", "倾听", "就能", "听到", "花开"],
        pinyin: "Zhǐyào yòngxīn qīngtīng jiù néng tīngdào huākāi.",
        translation: "Basta escutar com o coração para ouvir as flores desabrocharem.",
        category: "Ebook",
        difficulty: "Médio",
        explanation: "用心 (com coração) + 倾听 (escutar) + 听到 (ouvir) + 花开 (flores desabrocharem)."
      }
    ]
  },
  idioms: {
    name: "História dos Provérbios (成语故事)",
    sentences: [
      {
        id: "idioms-1",
        characters: ["守", "株", "待", "兔"],
        pinyin: "Shǒuzhūdàitù.",
        translation: "Esperar por um coelho ao lado de um tronco (Esperar de braços cruzados).",
        category: "Ebook",
        difficulty: "Fácil",
        explanation: "守 (guardar) + 株 (tronco) + 待 (esperar) + 兔 (coelho). Significa esperar que a sorte venha sem esforço."
      },
      {
        id: "idioms-2",
        characters: ["从前", "有一个", "农民", "在", "耕田"],
        pinyin: "Cóngqián, yǒu yī gè nóngmín zài gēngtián.",
        translation: "Era uma vez, um camponês que estava arando o campo.",
        category: "Ebook",
        difficulty: "Fácil",
        explanation: "从前 (no passado/era uma vez) + 有 (tinha) + 一个农民 (um camponês) + 在耕田 (arando campo)."
      },
      {
        id: "idioms-3",
        characters: ["突然", "一只", "兔子", "飞奔", "过来"],
        pinyin: "Tūrán, yī zhī tùzi fēibēn guòlái.",
        translation: "De repente, um coelho veio correndo em disparada.",
        category: "Ebook",
        difficulty: "Médio",
        explanation: "突然 (de repente). 只 (zhī) é o classificador para animais de pequeno porte."
      },
      {
        id: "idioms-4",
        characters: ["撞", "在", "树桩", "上", "折", "颈", "而", "死"],
        pinyin: "Zhuàng zài shùzhuāng shàng zhé jǐng ér sǐ.",
        translation: "Ele bateu contra o tronco, quebrou o pescoço e morreu.",
        category: "Ebook",
        difficulty: "Difícil",
        explanation: "撞在...上 (colidir sobre) + 树桩 (tronco) + 折颈 (quebrar pescoço) + 而死 (e consequentemente morreu)."
      },
      {
        id: "idioms-5",
        characters: ["他", "天天", "守", "在", "树桩", "旁", "希望", "再", "得到", "兔子"],
        pinyin: "Tā tiāntiān shǒu zài shùzhuāng páng, xīwàng zài dédào tùzi.",
        translation: "Ele esperava todos os dias ao lado do tronco, desejando ganhar outro coelho.",
        category: "Ebook",
        difficulty: "Difícil",
        explanation: "天天 (todo dia) + 守在...旁 (esperar ao lado de) + 希望 (esperar) + 再得到 (obter novamente) + 兔子 (coelho)."
      }
    ]
  },
  dialogs: {
    name: "Diálogos de Viagem (旅行汉语)",
    sentences: [
      {
        id: "dialogs-1",
        characters: ["你好", "请问", "地铁站", "在", "哪里"],
        pinyin: "Nǐ hǎo! Qǐngwèn dìtiězhàn zài nǎlǐ?",
        translation: "Olá! Com licença, onde fica a estação de metrô?",
        category: "Ebook",
        difficulty: "Fácil",
        explanation: "请问 (com licença, posso perguntar) + 地铁站 (estação de metrô) + 在哪里 (onde fica)."
      },
      {
        id: "dialogs-2",
        characters: ["我", "想", "买", "一张", "去", "北京", "的", "高铁", "票"],
        pinyin: "Wǒ xiǎng mǎi yī zhāng qù Běijīng de gāotiě piào.",
        translation: "Eu quero comprar uma passagem de trem de alta velocidade para Pequim.",
        category: "Ebook",
        difficulty: "Médio",
        explanation: "张 (zhāng) é o classificador de passagens/papéis. 高铁 (trem bala) + 票 (bilhete)."
      },
      {
        id: "dialogs-3",
        characters: ["谢谢", "你", "你", "太", "好", "了"],
        pinyin: "Xièxiè nǐ, nǐ tài hǎo le!",
        translation: "Obrigado(a), você é amável demais!",
        category: "Ebook",
        difficulty: "Fácil",
        explanation: "太...了 (tài...le) é um intensificador extremamente popular."
      },
      {
        id: "dialogs-4",
        characters: ["请问", "这", "附近", "有", "便宜", "的", "餐馆", "吗"],
        pinyin: "Qǐngwèn zhè fùjìn yǒu piányi de cānguǎn ma?",
        translation: "Com licença, há algum restaurante barato aqui por perto?",
        category: "Ebook",
        difficulty: "Médio",
        explanation: "这附近 (aqui perto) + 有 (tem) + 便宜 de (barato) + 餐馆 (restaurante) + ma (pergunta)."
      },
      {
        id: "dialogs-5",
        characters: ["祝", "你", "今天", "过", "得", "愉快"],
        pinyin: "Zhù nǐ jīntiān guò de yúkuài!",
        translation: "Desejo que você tenha um ótimo dia!",
        category: "Ebook",
        difficulty: "Médio",
        explanation: "祝 (desejar) + 你 (você) + 今天 (hoje) + 过得愉快 (passar com alegria)."
      }
    ]
  }
};

const getLanguageIdFromSong = (songLanguage: string): string => {
  const lang = songLanguage.toLowerCase();
  if (lang.includes('inglês') || lang.includes('english')) return 'en';
  if (lang.includes('chinês') || lang.includes('mandarim') || lang.includes('chinese')) return 'zh';
  if (lang.includes('espanhol') || lang.includes('spanish')) return 'es';
  if (lang.includes('italiano') || lang.includes('italian')) return 'it';
  if (lang.includes('francês') || lang.includes('français') || lang.includes('french')) return 'fr';
  return 'en'; // default fallback
};

export default function App() {
  // Selected Target Learning Language
  const [selectedLanguageId, setSelectedLanguageId] = useState<string>(() => {
    return localStorage.getItem('hanzi_dial_language_id') || 'zh';
  });

  const currentLanguage = LANGUAGES.find(l => l.id === selectedLanguageId) || LANGUAGES[0];
  const activeSentences = currentLanguage.sentences;

  // Saved states loaded from localStorage
  const [completedSentenceIds, setCompletedSentenceIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('hanzi_dial_completed_ids');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentCategory, setCurrentCategory] = useState<string>(() => {
    return localStorage.getItem('hanzi_dial_category') || 'Todos';
  });

  const [selectedDifficulty, setSelectedDifficulty] = useState<'Todos' | 'Fácil' | 'Médio' | 'Difícil'>(() => {
    return (localStorage.getItem('hanzi_dial_difficulty') as any) || 'Todos';
  });

  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem('hanzi_dial_user_name') || 'Aventureiro do Chinês';
  });

  // Card movement states
  const [cardSpeed, setCardSpeed] = useState<number>(() => {
    const saved = localStorage.getItem('hanzi_dial_card_speed');
    return saved !== null ? parseFloat(saved) : 1.0;
  });

  const [cardMovementType, setCardMovementType] = useState<'drift' | 'orbit'>(() => {
    return (localStorage.getItem('hanzi_dial_card_movement_type') as any) || 'drift';
  });

  // TTS Speech Rate state
  const [speechRate, setSpeechRate] = useState<number>(() => {
    const saved = localStorage.getItem('hanzi_dial_speech_rate');
    return saved !== null ? parseFloat(saved) : 0.85;
  });

  // Settings popup visibility
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [googleTtsKey, setGoogleTtsKey] = useState<string>(() => {
    return localStorage.getItem('hanzi_dial_google_tts_key') || '';
  });

  // Ebook states (defaulting to Ebook mode active by default)
  const [isEbookMode, setIsEbookMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('hanzi_dial_is_ebook_mode');
    return saved === null ? false : saved === 'true';
  });

  // Tips / Hints active by default
  const [isHintEnabled, setIsHintEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('hanzi_dial_hint_enabled');
    return saved === null ? true : saved === 'true';
  });

  // Black & White Minimalist Theme for Dialer
  const [isMonochrome, setIsMonochrome] = useState<boolean>(() => {
    return localStorage.getItem('hanzi_dial_monochrome') === 'true';
  });

  const [ebookName, setEbookName] = useState<string>(() => {
    return localStorage.getItem('hanzi_dial_ebook_name') || '';
  });

  const [ebookSentences, setEbookSentences] = useState<Sentence[]>(() => {
    const saved = localStorage.getItem('hanzi_dial_ebook_sentences');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeEbookIndex, setActiveEbookIndex] = useState<number>(() => {
    const saved = localStorage.getItem('hanzi_dial_active_ebook_index');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [completedEbookIndices, setCompletedEbookIndices] = useState<number[]>(() => {
    const saved = localStorage.getItem('hanzi_dial_completed_ebook_indices');
    return saved ? JSON.parse(saved) : [];
  });

  const [isParsingEbook, setIsParsingEbook] = useState<boolean>(false);

  // Music Mode states
  const [isMusicMode, setIsMusicMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('hanzi_dial_is_music_mode');
    return saved === null ? true : saved === 'true';
  });

  const [musicSongs, setMusicSongs] = useState<SongTrack[]>(() => {
    const customSaved = localStorage.getItem('hanzi_dial_custom_songs');
    const customSongs: SongTrack[] = customSaved ? JSON.parse(customSaved) : [];
    return [...PRESET_SONGS, ...customSongs];
  });

  const [activeSongId, setActiveSongId] = useState<string>(() => {
    return localStorage.getItem('hanzi_dial_active_song_id') || 'song-someone-like-you';
  });

  const [activeMusicSentenceIndex, setActiveMusicSentenceIndex] = useState<number>(() => {
    const saved = localStorage.getItem('hanzi_dial_active_music_index');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [completedMusicSentenceIndices, setCompletedMusicSentenceIndices] = useState<number[]>(() => {
    const activeId = localStorage.getItem('hanzi_dial_active_song_id') || 'song-someone-like-you';
    const saved = localStorage.getItem(`hanzi_dial_completed_music_indices_${activeId}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);

  // isExpandedCanvas: expands the dialer canvas section + shows lyrics strip below
  const [isExpandedCanvas, setIsExpandedCanvas] = useState(true);
  const [wordRainTrigger, setWordRainTrigger] = useState(0);

  // Sync initial song language on mount when in music mode
  useEffect(() => {
    if (isMusicMode) {
      const activeTrack = musicSongs.find(s => s.id === activeSongId) || musicSongs[0];
      if (activeTrack) {
        const targetLangId = getLanguageIdFromSong(activeTrack.language);
        setSelectedLanguageId(targetLangId);
      }
    }
  }, [isMusicMode, activeSongId, musicSongs]);

  // Auto-advance lyrics timer — fires every 30s when music is playing
  const autoAdvanceRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (autoAdvanceRef.current) clearInterval(autoAdvanceRef.current);
    if (!isMusicPlaying || !isMusicMode) return;
    autoAdvanceRef.current = setInterval(() => {
      setActiveMusicSentenceIndex(prev => {
        const song = musicSongs.find(s => s.id === activeSongId) || musicSongs[0];
        const next = Math.min(prev + 1, (song?.sentences.length ?? 1) - 1);
        if (next !== prev) setWordRainTrigger(t => t + 1);
        return next;
      });
    }, 30000);
    return () => { if (autoAdvanceRef.current) clearInterval(autoAdvanceRef.current); };
  }, [isMusicPlaying, isMusicMode, activeSongId, musicSongs]);

  // Trigger word rain whenever active sentence changes in music mode
  const prevMusicIdxRef = useRef(activeMusicSentenceIndex);
  useEffect(() => {
    if (isMusicMode && activeMusicSentenceIndex !== prevMusicIdxRef.current) {
      setWordRainTrigger(t => t + 1);
      prevMusicIdxRef.current = activeMusicSentenceIndex;
    }
  }, [activeMusicSentenceIndex, isMusicMode]);
  // ─────────────────────────────────────────────────────────────────────────────
  const [dialErrorsCount, setDialErrorsCount] = useState<number>(() => {
    const saved = localStorage.getItem('hanzi_dial_dial_errors_count');
    return saved ? parseInt(saved, 10) : 0;
  });

  const handleDialError = () => {
    setDialErrorsCount(prev => {
      const next = prev + 1;
      localStorage.setItem('hanzi_dial_dial_errors_count', next.toString());
      return next;
    });
  };

  const [isMusicPlayerMinimized, setIsMusicPlayerMinimized] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024; // Minimize on mobile by default to keep screen clean
    }
    return false;
  });

  // Ephemeral states
  const [activeSequence, setActiveSequence] = useState<string[]>([]);
  const [activeWordIds, setActiveWordIds] = useState<string[]>([]);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebratedSentence, setCelebratedSentence] = useState<Sentence | null>(null);
  const [levelUpInfo, setLevelUpInfo] = useState<{ newLevel: number } | null>(null);

  // Review Mode states
  const [isReviewMode, setIsReviewMode] = useState<boolean>(() => {
    return localStorage.getItem('hanzi_dial_is_review_mode') === 'true';
  });

  const [reviewSentenceId, setReviewSentenceId] = useState<string | null>(() => {
    return localStorage.getItem('hanzi_dial_review_id');
  });

  const [reviewXp, setReviewXp] = useState<number>(() => {
    const saved = localStorage.getItem('hanzi_dial_review_xp');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [totalXp, setTotalXp] = useState<number>(() => {
    const saved = localStorage.getItem('hanzi_dial_total_xp');
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem('hanzi_dial_total_xp', String(totalXp));
  }, [totalXp]);

  // AI Voice Assistant states
  const [isVoiceAssistantEnabled, setIsVoiceAssistantEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('hanzi_dial_assistant_enabled');
    return saved === null ? true : saved === 'true';
  });

  const [nativeLanguageCode, setNativeLanguageCode] = useState<string>(() => {
    return localStorage.getItem('hanzi_dial_native_lang') || 'pt-BR';
  });

  const [currentSpeechText, setCurrentSpeechText] = useState<string>('');
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('hanzi_dial_assistant_enabled', String(isVoiceAssistantEnabled));
  }, [isVoiceAssistantEnabled]);

  useEffect(() => {
    localStorage.setItem('hanzi_dial_native_lang', nativeLanguageCode);
  }, [nativeLanguageCode]);

  // Trigger AI Voice Assistant guidance for the active target word or completed sentence
  const triggerTutorGuidance = (overrideSentence?: Sentence, customSeqLen?: number) => {
    if (!isVoiceAssistantEnabled) return;

    let targetSentence: Sentence | null = null;

    if (overrideSentence) {
      targetSentence = overrideSentence;
    } else if (isMusicMode) {
      const activeTrack = musicSongs.find(s => s.id === activeSongId) || musicSongs[0];
      targetSentence = activeTrack?.sentences[activeMusicSentenceIndex] || null;
    } else if (isEbookMode && ebookSentences.length > 0) {
      targetSentence = ebookSentences[activeEbookIndex] || null;
    } else if (isReviewMode && reviewSentenceId) {
      targetSentence = currentLanguage.sentences.find(s => s.id === reviewSentenceId) || null;
    } else if (currentLanguage.sentences.length > 0) {
      targetSentence = currentLanguage.sentences.find(s => !completedSentenceIds.includes(s.id)) || currentLanguage.sentences[0];
    }

    if (!targetSentence) return;

    const seqLen = customSeqLen !== undefined ? customSeqLen : activeSequence.length;

    // Check if sentence is completed
    if (seqLen >= targetSentence.characters.length) {
      const items = buildSentenceCompletionSequence(
        joinSentence(targetSentence.characters),
        targetSentence.translation,
        currentLanguage.ttsCode,
        nativeLanguageCode
      );

      setIsAssistantSpeaking(true);
      speakTutorSequence(
        items,
        (text) => setCurrentSpeechText(text),
        () => setIsAssistantSpeaking(false)
      );
      return;
    }

    // Identify next target word
    const nextChar = targetSentence.characters[seqLen];
    const breakdown = targetSentence.literalBreakdown?.find(b => b.char === nextChar) || {
      char: nextChar,
      pinyin: targetSentence.pinyin || nextChar,
      translation: targetSentence.translation || nextChar
    };

    const items = buildWordGuidanceSequence(
      nextChar,
      breakdown.pinyin,
      breakdown.translation,
      targetSentence.explanation || '',
      currentLanguage.ttsCode,
      nativeLanguageCode,
      seqLen > 0
    );

    setIsAssistantSpeaking(true);
    speakTutorSequence(
      items,
      (text) => setCurrentSpeechText(text),
      () => setIsAssistantSpeaking(false)
    );
  };

  // Helper to determine current target word details for AI Voice Assistant & hints
  const getActiveTargetDetails = () => {
    let targetSentence: Sentence | null = null;
    if (isMusicMode) {
      const activeTrack = musicSongs.find(s => s.id === activeSongId) || musicSongs[0];
      targetSentence = activeTrack?.sentences[activeMusicSentenceIndex] || null;
    } else if (isEbookMode && ebookSentences.length > 0) {
      targetSentence = ebookSentences[activeEbookIndex] || null;
    } else if (isReviewMode && reviewSentenceId) {
      targetSentence = currentLanguage.sentences.find(s => s.id === reviewSentenceId) || null;
    } else if (currentLanguage.sentences.length > 0) {
      targetSentence = currentLanguage.sentences.find(s => !completedSentenceIds.includes(s.id)) || currentLanguage.sentences[0];
    }

    if (!targetSentence) return { char: '', translation: '', pinyin: '' };

    const seqLen = activeSequence.length;
    if (seqLen >= targetSentence.characters.length) return { char: '', translation: '', pinyin: '' };

    const nextChar = targetSentence.characters[seqLen];
    const breakdown = targetSentence.literalBreakdown?.find(b => b.char === nextChar) || {
      char: nextChar,
      pinyin: targetSentence.pinyin || nextChar,
      translation: targetSentence.translation || nextChar
    };

    return {
      char: nextChar,
      translation: breakdown.translation,
      pinyin: breakdown.pinyin
    };
  };

  const activeTargetDetails = getActiveTargetDetails();

  // Auto-trigger voice assistant when step changes
  useEffect(() => {
    if (isVoiceAssistantEnabled) {
      const timer = setTimeout(() => {
        triggerTutorGuidance();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [
    activeSequence.length,
    activeEbookIndex,
    reviewSentenceId,
    selectedLanguageId,
    isVoiceAssistantEnabled,
    isMusicMode,
    activeSongId,
    activeMusicSentenceIndex,
    isEbookMode,
    nativeLanguageCode
  ]);
  const handleSelectLanguage = (langId: string) => {
    playTick();
    setSelectedLanguageId(langId);
    const lang = LANGUAGES.find(l => l.id === langId) || LANGUAGES[0];
    const defaultBook = lang.preloadedBooks?.prince;
    if (defaultBook) {
      setEbookName(defaultBook.name);
      setEbookSentences(defaultBook.sentences);
    } else if (lang.sentences && lang.sentences.length > 0) {
      setEbookName(`Coleção: ${lang.name}`);
      setEbookSentences(lang.sentences);
    }
    setActiveEbookIndex(0);
    setCompletedEbookIndices([]);
    setActiveSequence([]);
    setActiveWordIds([]);

    // AI Voice Assistant greeting in Portuguese announcing new language
    if (isVoiceAssistantEnabled) {
      const greetingItems = [
        { text: `Excelente escolha! Vamos estudar ${lang.name}. Escolha a primeira palavra no discador!`, langCode: nativeLanguageCode }
      ];
      setIsAssistantSpeaking(true);
      speakTutorSequence(
        greetingItems,
        (text) => setCurrentSpeechText(text),
        () => setIsAssistantSpeaking(false)
      );
    }
  };

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('hanzi_dial_language_id', selectedLanguageId);
  }, [selectedLanguageId]);

  // Ensure ebookSentences is populated with current language default if empty
  useEffect(() => {
    if (!ebookSentences || ebookSentences.length === 0) {
      const defaultBook = currentLanguage.preloadedBooks?.prince;
      if (defaultBook) {
        setEbookName(defaultBook.name);
        setEbookSentences(defaultBook.sentences);
      } else if (currentLanguage.sentences) {
        setEbookName(`Coleção: ${currentLanguage.name}`);
        setEbookSentences(currentLanguage.sentences);
      }
    }
  }, [currentLanguage]);

  useEffect(() => {
    localStorage.setItem('hanzi_dial_completed_ids', JSON.stringify(completedSentenceIds));
  }, [completedSentenceIds]);

  useEffect(() => {
    localStorage.setItem('hanzi_dial_category', currentCategory);
  }, [currentCategory]);

  useEffect(() => {
    localStorage.setItem('hanzi_dial_difficulty', selectedDifficulty);
  }, [selectedDifficulty]);

  useEffect(() => {
    localStorage.setItem('hanzi_dial_user_name', userName);
  }, [userName]);

  useEffect(() => {
    localStorage.setItem('hanzi_dial_is_review_mode', String(isReviewMode));
  }, [isReviewMode]);

  useEffect(() => {
    if (reviewSentenceId) {
      localStorage.setItem('hanzi_dial_review_id', reviewSentenceId);
    } else {
      localStorage.removeItem('hanzi_dial_review_id');
    }
  }, [reviewSentenceId]);

  useEffect(() => {
    localStorage.setItem('hanzi_dial_review_xp', String(reviewXp));
  }, [reviewXp]);

  // Sync config states
  useEffect(() => {
    localStorage.setItem('hanzi_dial_card_speed', String(cardSpeed));
  }, [cardSpeed]);

  useEffect(() => {
    localStorage.setItem('hanzi_dial_card_movement_type', cardMovementType);
  }, [cardMovementType]);

  useEffect(() => {
    localStorage.setItem('hanzi_dial_speech_rate', String(speechRate));
  }, [speechRate]);

  // Sync ebook states
  useEffect(() => {
    localStorage.setItem('hanzi_dial_is_ebook_mode', String(isEbookMode));
  }, [isEbookMode]);

  useEffect(() => {
    localStorage.setItem('hanzi_dial_hint_enabled', String(isHintEnabled));
  }, [isHintEnabled]);

  useEffect(() => {
    localStorage.setItem('hanzi_dial_monochrome', String(isMonochrome));
  }, [isMonochrome]);

  useEffect(() => {
    localStorage.setItem('hanzi_dial_ebook_name', ebookName);
  }, [ebookName]);

  useEffect(() => {
    localStorage.setItem('hanzi_dial_ebook_sentences', JSON.stringify(ebookSentences));
  }, [ebookSentences]);

  useEffect(() => {
    localStorage.setItem('hanzi_dial_active_ebook_index', String(activeEbookIndex));
  }, [activeEbookIndex]);

  useEffect(() => {
    localStorage.setItem('hanzi_dial_completed_ebook_indices', JSON.stringify(completedEbookIndices));
  }, [completedEbookIndices]);

  // Open instructions modal on first-ever load
  useEffect(() => {
    const isFirstVisit = localStorage.getItem('hanzi_dial_visited') !== 'true';
    if (isFirstVisit) {
      setIsInstructionsOpen(true);
      localStorage.setItem('hanzi_dial_visited', 'true');
    }
  }, []);

  // Review Mode action handlers
  const handleStartReview = (sentenceId?: string) => {
    playTick();
    setIsReviewMode(true);
    setIsEbookMode(false); // disable ebook mode
    
    if (sentenceId) {
      setReviewSentenceId(sentenceId);
    } else {
      if (completedSentenceIds.length > 0) {
        const randomIndex = Math.floor(Math.random() * completedSentenceIds.length);
        setReviewSentenceId(completedSentenceIds[randomIndex]);
      }
    }
  };

  const handleNextReviewSentence = () => {
    playTick();
    if (completedSentenceIds.length === 0) {
      setIsReviewMode(false);
      setReviewSentenceId(null);
      return;
    }

    if (completedSentenceIds.length === 1) {
      setReviewSentenceId(completedSentenceIds[0]);
      return;
    }

    const availableIds = completedSentenceIds.filter(id => id !== reviewSentenceId);
    const pool = availableIds.length > 0 ? availableIds : completedSentenceIds;
    const randomIndex = Math.floor(Math.random() * pool.length);
    setReviewSentenceId(pool[randomIndex]);
  };

  const handleExitReview = () => {
    playTick();
    setIsReviewMode(false);
    setReviewSentenceId(null);
  };

  // Ebook action handlers
  const handleSelectPreloadedEbook = (key: string) => {
    playTick();
    const book = PRELOADED_BOOKS[key];
    if (book) {
      setEbookName(book.name);
      setEbookSentences(book.sentences);
      setActiveEbookIndex(0);
      setCompletedEbookIndices([]);
      setIsEbookMode(true);
      setIsReviewMode(false); // disable review mode
      handleClearSequence();
    }
  };

  const handleUploadEbook = async (name: string, content: string) => {
    setIsParsingEbook(true);
    playTick();
    try {
      const response = await fetch('/api/parse-ebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: content, targetLanguage: currentLanguage.name }),
      });
      const data = await response.json();
      if (data.sentences && data.sentences.length > 0) {
        setEbookName(name);
        setEbookSentences(data.sentences);
        setActiveEbookIndex(0);
        setCompletedEbookIndices([]);
        setIsEbookMode(true);
        setIsReviewMode(false);
        handleClearSequence();
      } else {
        throw new Error(data.error || 'Nenhuma frase extraída.');
      }
    } catch (err) {
      console.warn('Erro ao processar via IA. Ativando analisador local...', err);
      // Fallback local robust parser
      const lines = content.split(/[。！？\n]/).map(l => l.trim()).filter(l => l.length >= 3 && l.length <= 15).slice(0, 8);
      if (lines.length > 0) {
        const fallbacks: Sentence[] = lines.map((text, idx) => {
          const cleanText = text.replace(/[，、]/g, '');
          const chars = cleanText.split('');
          return {
            id: `ebook-fallback-${idx}-${Date.now()}`,
            characters: chars,
            pinyin: "Pronúncia local (Configure a chave de API no AI Studio para pinyin real)",
            translation: "Frase do Livro: " + text,
            category: "Ebook",
            difficulty: "Médio",
            explanation: "Para análise morfossintática e tradução detalhada em português, o aplicativo se conecta ao Gemini 1.5 Flash na nuvem. Verifique suas chaves de API.",
            literalBreakdown: chars.map(c => ({ char: c, pinyin: "", translation: "" }))
          };
        });
        setEbookName(name + " (Local)");
        setEbookSentences(fallbacks);
        setActiveEbookIndex(0);
        setCompletedEbookIndices([]);
        setIsEbookMode(true);
        setIsReviewMode(false);
        handleClearSequence();
      } else {
        alert("Não foi possível detectar frases em chinês neste arquivo .txt. Certifique-se de que há ideogramas chineses.");
      }
    } finally {
      setIsParsingEbook(false);
    }
  };

  const handleExitEbookMode = () => {
    playTick();
    setIsEbookMode(false);
    handleClearSequence();
  };

  const handleSpeakText = (text: string) => {
    speakLanguageText(text, currentLanguage.ttsCode, speechRate);
  };

  // Sentence completed handler
  const handleSentenceCompleted = (sentence: Sentence) => {
    // Trigger AI Voice Assistant sentence completion speech (repeats whole sentence & praises user)
    triggerTutorGuidance(sentence, sentence.characters.length);

    const prevLevel = Math.floor(totalXp / 100) + 1;
    let currentXp = totalXp + 15; // +15 XP por frase completada

    if (isMusicMode) {
      const activeTrack = musicSongs.find(s => s.id === activeSongId) || musicSongs[0];
      let updatedMusicIndices = completedMusicSentenceIndices;
      if (!completedMusicSentenceIndices.includes(activeMusicSentenceIndex)) {
        updatedMusicIndices = [...completedMusicSentenceIndices, activeMusicSentenceIndex];
        setCompletedMusicSentenceIndices(updatedMusicIndices);
      }

      // Se concluiu a última frase da música
      const isLastSentence = activeMusicSentenceIndex === (activeTrack ? activeTrack.sentences.length - 1 : -1);
      if (isLastSentence && activeTrack) {
        currentXp += 100; // Bônus significativo por completar a música toda!
        
        // Song finished! Unlock next song
        const currentIndex = musicSongs.findIndex(s => s.id === activeSongId);
        if (currentIndex !== -1 && currentIndex + 1 < musicSongs.length) {
          const nextSong = musicSongs[currentIndex + 1];
          if (nextSong.isLocked) {
            const updatedSongs = musicSongs.map((s, idx) => idx === currentIndex + 1 ? { ...s, isLocked: false } : s);
            setMusicSongs(updatedSongs);
          }
        }

        setTimeout(() => {
          alert(`🎉 INCRÍVEL! Você completou toda a música "${activeTrack.title}" do ${activeTrack.artist} e ganhou +100 XP de Bônus!`);
        }, 1000);
      }

      setTotalXp(currentXp);
      const newLevel = Math.floor(currentXp / 100) + 1;

      if (newLevel > prevLevel) {
        setLevelUpInfo({ newLevel });
        playFanfare();
      } else {
        playFanfare();
      }

      setCelebratedSentence(sentence);
      setShowCelebration(true);

      setTimeout(() => {
        setShowCelebration(false);
        const nextIndex = activeMusicSentenceIndex + 1;
        if (activeTrack && nextIndex < activeTrack.sentences.length) {
          setActiveMusicSentenceIndex(nextIndex);
          handleClearSequence();
        }
      }, 4000);
      return;
    }

    if (isEbookMode) {
      let updatedEbookIndices = completedEbookIndices;
      if (!completedEbookIndices.includes(activeEbookIndex)) {
        updatedEbookIndices = [...completedEbookIndices, activeEbookIndex];
        setCompletedEbookIndices(updatedEbookIndices);
      }

      // Se concluiu o Ebook inteiro (última página)
      const isLastPage = activeEbookIndex === (ebookSentences.length - 1);
      if (isLastPage) {
        currentXp += 100; // Bônus por livro todo lido!
        setTimeout(() => {
          alert(`📖 LEITOR DE ELITE! Você completou a leitura do livro "${ebookName}" e ganhou +100 XP Extra!`);
        }, 1000);
      }

      setTotalXp(currentXp);
      const newLevel = Math.floor(currentXp / 100) + 1;

      if (newLevel > prevLevel) {
        setLevelUpInfo({ newLevel });
        playFanfare();
      } else {
        playFanfare();
      }

      setCelebratedSentence(sentence);
      setShowCelebration(true);

      setTimeout(() => {
        setShowCelebration(false);
        const nextIndex = activeEbookIndex + 1;
        if (nextIndex < ebookSentences.length) {
          setActiveEbookIndex(nextIndex);
          handleClearSequence();
        }
      }, 4500);
      return;
    }

    if (isReviewMode) {
      setTotalXp(currentXp);
      const newLevel = Math.floor(currentXp / 100) + 1;

      if (newLevel > prevLevel) {
        setLevelUpInfo({ newLevel });
        playFanfare();
      } else {
        playFanfare();
      }

      setCelebratedSentence(sentence);
      setShowCelebration(true);

      setTimeout(() => {
        setShowCelebration(false);
        handleNextReviewSentence();
      }, 4500);
      return;
    }

    if (!completedSentenceIds.includes(sentence.id)) {
      const updated = [...completedSentenceIds, sentence.id];
      setCompletedSentenceIds(updated);
    }
    
    setTotalXp(currentXp);
    const newLevel = Math.floor(currentXp / 100) + 1;

    if (newLevel > prevLevel) {
      setLevelUpInfo({ newLevel });
      playFanfare();
    } else {
      playFanfare();
    }

    setCelebratedSentence(sentence);
    setShowCelebration(true);

    setTimeout(() => {
      setShowCelebration(false);
    }, 4500);
  };

  // Reset progress handler
  const handleResetProgress = () => {
    if (window.confirm('Deseja resetar todo o seu progresso de aprendizado e revisão?')) {
      setCompletedSentenceIds([]);
      setActiveSequence([]);
      setActiveWordIds([]);
      setIsReviewMode(false);
      setReviewSentenceId(null);
      setReviewXp(0);
      setTotalXp(0);
      setIsEbookMode(false);
      setEbookName('');
      setEbookSentences([]);
      setActiveEbookIndex(0);
      setCompletedEbookIndices([]);
      playTick();
    }
  };

  // State handlers passed to canvas
  const handleSequenceUpdate = (seq: string[], wordIds: string[]) => {
    if (seq.length > activeSequence.length) {
      const added = seq.length - activeSequence.length;
      setTotalXp((prev) => prev + added * 2);
    }
    setActiveSequence(seq);
    setActiveWordIds(wordIds);
  };

  const handleClearSequence = () => {
    setActiveSequence([]);
    setActiveWordIds([]);
    playTick();
  };

  return (
    <div id="app-root" className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans flex flex-col antialiased">
      
      {/* Header Bar */}
      <header className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 sticky top-0 z-30 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 via-pink-500 to-indigo-600 flex items-center justify-center text-white shadow-md select-none font-black text-lg">
              中
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
                Discador de Ideogramas
              </h1>
              <p className="text-[10px] font-mono font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
                Hanzi Rotary Dialer
              </p>
            </div>
          </div>

          {/* Controls & Badges */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Level XP badge hidden per user request */}

            {/* Music Mode Switcher Button - Desktop only, mobile uses bottom nav */}
            <button
              onClick={() => {
                playTick();
                if (isMusicMode) {
                  setIsMusicMode(false);
                } else {
                  setIsMusicMode(true);
                  setIsEbookMode(false);
                  setIsReviewMode(false);
                  handleClearSequence();
                }
              }}
              className={`hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black transition-all shadow-sm active:scale-95 cursor-pointer ${
                isMusicMode
                  ? 'bg-rose-600 text-white hover:bg-rose-700 border border-rose-500'
                  : 'bg-rose-50 text-rose-750 hover:bg-rose-100 border border-rose-250 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/40'
              }`}
            >
              <Music size={13} />
              <span>{isMusicMode ? 'Música: ON' : 'Modo Música 🎵'}</span>
            </button>

            {/* Book Mode Switcher Button - Desktop only, mobile uses bottom nav */}
            <button
              onClick={() => {
                playTick();
                if (isEbookMode) {
                  setIsEbookMode(false);
                } else {
                  setIsEbookMode(true);
                  setIsMusicMode(false);
                  setIsReviewMode(false);
                  if (ebookSentences.length === 0) {
                    // pre-load Prince by default so it isn't empty!
                    handleSelectPreloadedEbook("prince");
                  }
                }
              }}
              className={`hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black transition-all shadow-sm active:scale-95 cursor-pointer ${
                isEbookMode
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 border border-emerald-500'
                  : 'bg-emerald-50 text-emerald-750 hover:bg-emerald-100 border border-emerald-250 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/40'
              }`}
            >
              <BookOpen size={13} />
              <span>{isEbookMode ? 'Ler Livro: ON' : 'Modo Livro 📖'}</span>
            </button>

            {/* Quick Review Mode Switcher Button - Desktop only */}
            {!isEbookMode && (
              <button
                onClick={() => {
                  if (completedSentenceIds.length === 0) {
                    alert("Você precisa completar pelo menos 1 frase para poder revisar! Complete frases jogando primeiro.");
                    return;
                  }
                  if (isReviewMode) {
                    handleExitReview();
                  } else {
                    handleStartReview();
                  }
                }}
                className={`hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black transition-all shadow-sm active:scale-95 cursor-pointer ${
                  isReviewMode
                    ? 'bg-violet-600 text-white hover:bg-violet-700 border border-violet-500'
                    : completedSentenceIds.length > 0
                    ? 'bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-250 dark:bg-violet-950/40 dark:text-violet-400 dark:border-violet-900/50'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 dark:bg-slate-900 dark:border-slate-800'
                }`}
              >
                <RefreshCw size={13} className={isReviewMode ? 'animate-spin-slow' : ''} />
                <span>{isReviewMode ? 'Sair da Revisão' : `Revisar (${completedSentenceIds.length})`}</span>
              </button>
            )}

            {/* Expanded Canvas toggle — visible in music mode */}
            {isMusicMode && (
              <button
                onClick={() => { playTick(); setIsExpandedCanvas(prev => !prev); }}
                className="flex items-center justify-center p-2 rounded-full bg-slate-50 dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-95 cursor-pointer"
                title={isExpandedCanvas ? 'Recolher discador' : 'Expandir discador + letras'}
              >
                {isExpandedCanvas ? <Shrink size={15} /> : <Expand size={15} />}
              </button>
            )}

            {/* Config Gear Button - Desktop only, mobile uses bottom nav */}
            <button
              onClick={() => { playTick(); setIsSettingsOpen(true); }}
              className="hidden lg:flex p-2 rounded-full bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 transition-all active:scale-95 cursor-pointer"
              title="Configurações de Movimento e Voz"
            >
              <Settings size={15} />
            </button>

            {/* How to play button */}
            <button
              onClick={() => { playTick(); setIsInstructionsOpen(true); }}
              className="flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white border border-indigo-100 dark:bg-slate-900 dark:border-indigo-950 text-indigo-650 dark:text-indigo-450 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <HelpCircle size={14} className="text-indigo-600 dark:text-indigo-400" />
              <span className="hidden xs:inline">Como Jogar</span>
            </button>

            {/* Mobile Sidebar Toggle (Only if not in ebook or music mode) */}
            {!isEbookMode && !isMusicMode && (
              <button
                onClick={() => { playTick(); setIsSidebarOpenMobile(!isSidebarOpenMobile); }}
                className="lg:hidden flex items-center justify-center p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 active:scale-95 transition-all cursor-pointer"
                title="Ver Lista de Frases"
              >
                {isSidebarOpenMobile ? <X size={18} /> : <Menu size={18} />}
              </button>
            )}

          </div>
        </div>
      </header>

      {/* Bottom Mobile Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 shadow-2xl">
        <div className="flex items-stretch h-16">
          {/* Home Tab */}
          <button
            onClick={() => {
              playTick();
              setIsMusicMode(false);
              setIsEbookMode(false);
              setIsReviewMode(false);
              setIsSidebarOpenMobile(false);
            }}
            className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
              !isMusicMode && !isEbookMode
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${
              !isMusicMode && !isEbookMode
                ? 'bg-indigo-100 dark:bg-indigo-950/60'
                : ''
            }`}>
              <Compass size={20} />
            </div>
            <span className="text-[10px] font-bold">Home</span>
          </button>

          {/* Music Tab */}
          <button
            onClick={() => {
              playTick();
              setIsMusicMode(true);
              setIsMusicPlayerMinimized(false);
              setIsEbookMode(false);
              setIsReviewMode(false);
              setIsSidebarOpenMobile(false);
              setIsMusicPlaying(true);
              handleClearSequence();
            }}
            className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
              isMusicMode
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${
              isMusicMode
                ? 'bg-rose-100 dark:bg-rose-950/60'
                : ''
            }`}>
              <Music size={20} />
            </div>
            <span className="text-[10px] font-bold">Música</span>
          </button>

          {/* Ebook Tab */}
          <button
            onClick={() => {
              playTick();
              if (!isEbookMode) {
                setIsEbookMode(true);
                setIsMusicMode(false);
                setIsReviewMode(false);
                if (ebookSentences.length === 0) {
                  handleSelectPreloadedEbook('prince');
                }
              } else {
                setIsEbookMode(false);
              }
              setIsSidebarOpenMobile(false);
            }}
            className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
              isEbookMode
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${
              isEbookMode
                ? 'bg-emerald-100 dark:bg-emerald-950/60'
                : ''
            }`}>
              <BookOpen size={20} />
            </div>
            <span className="text-[10px] font-bold">Livro</span>
          </button>

          {/* Settings Tab */}
          <button
            onClick={() => { playTick(); setIsSettingsOpen(true); }}
            className="flex-1 flex flex-col items-center justify-center gap-1 text-slate-400 dark:text-slate-500 hover:text-slate-600 transition-all cursor-pointer"
          >
            <div className="p-1.5 rounded-xl">
              <Settings size={20} />
            </div>
            <span className="text-[10px] font-bold">Config</span>
          </button>
        </div>
      </nav>

      {/* Main Content Layout */}
      <main className="flex-1 w-full mx-auto p-2 sm:p-4 pb-20 lg:pb-6 flex flex-col lg:flex-row gap-4 items-stretch overflow-hidden">
        
        {/* Left Side: Game Canvas & Quick Level selector */}
        <div className="flex-1 flex flex-col gap-4">
          


          {isReviewMode && (
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg border border-violet-500">
              <div className="flex items-start gap-2.5">
                <span className="text-xl">🔁</span>
                <div>
                  <h4 className="text-xs font-black text-amber-300">MODO REVISÃO ATIVO!</h4>
                  <p className="text-[11px] text-violet-100 mt-0.5 leading-relaxed font-semibold">
                    Praticando frases já montadas. Monte a frase chinesa que significa: <strong className="text-white underline font-extrabold">"{SENTENCES.find(s => s.id === reviewSentenceId)?.translation || 'Carregando...'}"</strong>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={handleNextReviewSentence}
                  className="bg-white/10 hover:bg-white/25 text-white px-3 py-1.5 rounded-xl text-xs font-bold border border-white/10 transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw size={13} />
                  Pular
                </button>
                <button
                  onClick={handleExitReview}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer"
                >
                  Sair do Modo
                </button>
              </div>
            </div>
          )}

          {/* AI Voice Assistant Guidance Bar (Home/Review) vs Level Badge (Music Mode) & Minimized Playlist Button */}
          <div className="flex items-center justify-between gap-3 w-full">
            {/* AI Voice Assistant - Hidden, kept for logic only */}
            {false && (
              <AIVoiceAssistantCard
                isEnabled={isVoiceAssistantEnabled}
                onToggleEnabled={() => {
                  playTick();
                  if (isVoiceAssistantEnabled) stopTutorSpeech();
                  setIsVoiceAssistantEnabled(!isVoiceAssistantEnabled);
                }}
                nativeLanguageCode={nativeLanguageCode}
                onChangeNativeLanguage={(code) => {
                  playTick();
                  setNativeLanguageCode(code);
                }}
                currentSpeechText={currentSpeechText}
                isSpeaking={isAssistantSpeaking}
                onReplayGuidance={() => triggerTutorGuidance()}
                targetWord={activeTargetDetails.char}
                targetTranslation={activeTargetDetails.translation}
                targetPhonetic={activeTargetDetails.pinyin}
                targetLanguageName={currentLanguage.name}
              />
            )}
            {/* Music minimize button removed — vitrine always visible above dial */}
          </div>

          {/* MusicVitrine — compact horizontal strip above dialer */}
          {isMusicMode && (
            <MusicVitrine
              songs={musicSongs}
              activeSongId={activeSongId}
              onSelectSong={(songId) => {
                playTick();
                setActiveSongId(songId);
                setActiveMusicSentenceIndex(0);
                handleClearSequence();
                const selectedSong = musicSongs.find(s => s.id === songId);
                if (selectedSong) {
                  const targetLangId = getLanguageIdFromSong(selectedSong.language);
                  handleSelectLanguage(targetLangId);
                }
              }}
              onAddSong={() => {
                // Trigger the upload modal inside the desktop MusicPlayerPanel via a flag
                setIsMusicPlayerMinimized(false);
              }}
            />
          )}

          {/* Conditional Rendering: Home Dashboard vs Interactive Canvas */}
          {!isMusicMode && !isEbookMode && !isReviewMode ? (
            /* Home Dashboard Summary */
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl space-y-6 w-full flex-1 flex flex-col justify-center animate-fade-in">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 w-full">
                {/* Level / XP */}
                <div className="bg-slate-50 dark:bg-slate-950/50 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-3.5 space-y-1.5 shadow-sm text-center">
                  <Trophy size={20} className="mx-auto text-amber-500" />
                  <div className="text-[10px] font-mono font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Nível Atual</div>
                  <div className="text-lg font-black text-slate-800 dark:text-slate-200">Level {Math.floor(totalXp / 100) + 1}</div>
                  <div className="text-[9px] font-mono text-slate-500 dark:text-slate-450">{totalXp % 100}/100 XP</div>
                </div>
                {/* Frases */}
                <div className="bg-slate-50 dark:bg-slate-950/50 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-3.5 space-y-1.5 shadow-sm text-center">
                  <CheckCircle size={20} className="mx-auto text-emerald-500" />
                  <div className="text-[10px] font-mono font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Frases Concluídas</div>
                  <div className="text-lg font-black text-slate-800 dark:text-slate-200">{completedSentenceIds.length} Frases</div>
                  <div className="text-[9px] font-mono text-slate-500 dark:text-slate-450">Treinos Gerais</div>
                </div>
                {/* Músicas */}
                <div className="bg-slate-50 dark:bg-slate-950/50 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-3.5 space-y-1.5 shadow-sm text-center">
                  <Music size={20} className="mx-auto text-indigo-500" />
                  <div className="text-[10px] font-mono font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Músicas Concluídas</div>
                  <div className="text-lg font-black text-slate-800 dark:text-slate-200">
                    {(() => {
                      const completedSongs = musicSongs.filter(song => {
                        const saved = localStorage.getItem(`hanzi_dial_completed_music_indices_${song.id}`);
                        const completedIdxs: number[] = saved ? JSON.parse(saved) : [];
                        return song.sentences.length > 0 && completedIdxs.length === song.sentences.length;
                      });
                      return completedSongs.length;
                    })()} Músicas
                  </div>
                  <div className="text-[9px] font-mono text-slate-500 dark:text-slate-450">Playlist Completa</div>
                </div>
                {/* Erros */}
                <div className="bg-slate-50 dark:bg-slate-950/50 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-3.5 space-y-1.5 shadow-sm text-center">
                  <AlertTriangle size={20} className="mx-auto text-red-500" />
                  <div className="text-[10px] font-mono font-black text-red-400 dark:text-red-500 uppercase tracking-widest">Erros de Discagem</div>
                  <div className="text-lg font-black text-red-600 dark:text-red-450">{dialErrorsCount} Erros</div>
                  <div className="text-[9px] font-mono text-slate-500 dark:text-slate-450">Erros Detectados</div>
                </div>
              </div>

              {/* Mode Selectors Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:max-w-xl sm:mx-auto w-full pt-2">
                {/* Mode 1: Music Player */}
                <button
                  onClick={() => {
                    playTick();
                    setIsMusicMode(true);
                    setIsMusicPlaying(true);
                    setIsEbookMode(false);
                    setIsReviewMode(false);
                  }}
                  className="group relative flex flex-col items-start p-5 rounded-2xl bg-gradient-to-br from-rose-500 via-pink-600 to-indigo-600 hover:brightness-105 active:scale-98 transition-all text-white text-left shadow-lg border border-pink-400/20 cursor-pointer overflow-hidden"
                >
                  <div className="absolute right-3 top-3 opacity-20 group-hover:scale-110 transition-transform duration-300">
                    <Music size={48} />
                  </div>
                  <span className="p-2 rounded-xl bg-white/20 text-white mb-3 text-sm">🎵</span>
                  <h3 className="text-sm font-black tracking-tight uppercase">Modo Música & Playlist</h3>
                  <p className="text-[10.5px] text-white/80 font-medium mt-1 leading-snug">
                    Aprenda escutando e discando as letras das suas músicas favoritas.
                  </p>
                </button>

                {/* Mode 2: Ebook Reader */}
                <button
                  onClick={() => {
                    playTick();
                    setIsEbookMode(true);
                    setIsMusicMode(false);
                    setIsReviewMode(false);
                  }}
                  className="group relative flex flex-col items-start p-5 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-teal-500 hover:brightness-105 active:scale-98 transition-all text-white text-left shadow-lg border border-blue-400/20 cursor-pointer overflow-hidden"
                >
                  <div className="absolute right-3 top-3 opacity-20 group-hover:scale-110 transition-transform duration-300">
                    <BookOpen size={48} />
                  </div>
                  <span className="p-2 rounded-xl bg-white/20 text-white mb-3 text-sm">📖</span>
                  <h3 className="text-sm font-black tracking-tight uppercase">Modo Leitor Ebook</h3>
                  <p className="text-[10.5px] text-white/80 font-medium mt-1 leading-snug">
                    Importe ou leia clássicos da literatura discando frase por frase.
                  </p>
                </button>
              </div>
            </div>
          ) : (
            /* Canvas wrapper — always overflow:hidden so WordRain stays clipped inside */
            <div className={`relative w-full flex flex-col transition-all duration-500 rounded-2xl overflow-hidden ${
              isExpandedCanvas && isMusicMode ? 'ring-2 ring-indigo-500/30 shadow-2xl shadow-indigo-500/10' : ''
            }`}>
              <FloatingWordCanvas
                sentences={activeSentences}
                completedSentenceIds={completedSentenceIds}
                activeSequence={activeSequence}
                activeWordIds={activeWordIds}
                currentCategory={currentCategory}
                selectedDifficulty={selectedDifficulty}
                onSentenceCompleted={handleSentenceCompleted}
                onSequenceUpdate={handleSequenceUpdate}
                onClearSequence={handleClearSequence}
                onDialError={handleDialError}
                isReviewMode={isReviewMode}
                reviewSentenceId={reviewSentenceId}
                onExitReview={handleExitReview}
                onNextReviewSentence={handleNextReviewSentence}
                cardSpeed={cardSpeed}
                cardMovementType={cardMovementType}
                isEbookMode={isEbookMode}
                activeEbookSentence={ebookSentences[activeEbookIndex] || null}
                ebookSentences={ebookSentences}
                isMusicMode={isMusicMode}
                activeMusicSentence={(musicSongs.find(s => s.id === activeSongId) || musicSongs[0])?.sentences[activeMusicSentenceIndex] || null}
                phoneticLabel={currentLanguage.phoneticLabel}
                isHintEnabled={isHintEnabled}
                onToggleHint={() => setIsHintEnabled(prev => !prev)}
                isMonochrome={isMonochrome}
                onToggleMonochrome={() => setIsMonochrome(prev => !prev)}
                currentLanguage={currentLanguage}
                allLanguages={LANGUAGES}
                onSelectLanguage={(id) => handleSelectLanguage(id)}
                onTriggerVoiceGuidance={() => triggerTutorGuidance()}
              />

              {/* WordRainOverlay — INSIDE the canvas so overflow:hidden clips it */}
              {isMusicMode && (() => {
                const activeSong = musicSongs.find(s => s.id === activeSongId) || musicSongs[0];
                const activeSentence = activeSong?.sentences[activeMusicSentenceIndex] || null;
                return (
                  <WordRainOverlay
                    sentence={activeSentence}
                    trigger={wordRainTrigger}
                    isActive={isMusicMode && isMusicPlaying}
                  />
                );
              })()}

              {/* LyricsStrip — Spotify-style, shown below dialer in expanded music mode */}
              {isExpandedCanvas && isMusicMode && (() => {
                const song = musicSongs.find(s => s.id === activeSongId) || musicSongs[0];
                const sentences = song?.sentences || [];
                return (
                  <LyricsStrip
                    sentences={sentences}
                    activeIndex={activeMusicSentenceIndex}
                    onSelectIndex={(idx) => {
                      setActiveMusicSentenceIndex(idx);
                      setWordRainTrigger(t => t + 1);
                    }}
                    completedIndices={completedMusicSentenceIndices}
                  />
                );
              })()}
            </div>
          )}

          {isMusicMode && (() => {
            const currentSong = musicSongs.find((s) => s.id === activeSongId) || musicSongs[0];
            const sentences = currentSong?.sentences || [];
            return (
              <div className="relative w-full transition-all duration-500 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-4 shadow-lg space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200/40 dark:border-slate-800/40 pb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🎵</span>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs font-black text-slate-850 dark:text-slate-100 uppercase tracking-tight">
                          {currentSong.title}
                        </h4>
                        <span className="bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded-full border border-indigo-400/30">
                          {currentSong.language}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-450 dark:text-slate-400 font-medium">
                        {currentSong.artist} • {completedMusicSentenceIndices.length} de {sentences.length} concluídas
                      </p>
                    </div>
                  </div>
                  
                  {/* Play & Next control icons inside lyrics header */}
                  <div className="flex items-center gap-1.5 pointer-events-auto">
                    <button
                      onClick={() => {
                        playTick();
                        setIsMusicPlaying(!isMusicPlaying);
                      }}
                      className="p-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-indigo-400 active:scale-95 transition-all shadow-sm border border-indigo-100/40 cursor-pointer"
                      title={isMusicPlaying ? "Pausar música" : "Tocar música"}
                    >
                      {isMusicPlaying ? <Pause size={13} className="fill-indigo-600 dark:fill-indigo-400" /> : <Play size={13} className="fill-indigo-600 dark:fill-indigo-400" />}
                    </button>
                    
                    <button
                      onClick={() => {
                        playTick();
                        const nextIdx = (activeMusicSentenceIndex + 1) % sentences.length;
                        setActiveMusicSentenceIndex(nextIdx);
                        handleClearSequence();
                      }}
                      className="p-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-indigo-400 active:scale-95 transition-all shadow-sm border border-indigo-100/40 cursor-pointer"
                      title="Próxima frase"
                    >
                      <SkipForward size={13} />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                  {sentences.map((sentence, idx) => {
                    const isActive = activeMusicSentenceIndex === idx;
                    const isCompleted = completedMusicSentenceIndices.includes(idx);

                    return (
                      <div
                        key={sentence.id}
                        onClick={() => {
                          playTick();
                          setActiveMusicSentenceIndex(idx);
                          handleClearSequence();
                        }}
                        className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isActive
                            ? "bg-amber-500/10 border-amber-400 shadow-md ring-2 ring-amber-400/20"
                            : isCompleted
                            ? "bg-emerald-500/5 border-emerald-400/40"
                            : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:bg-slate-100"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-6.5 h-6.5 rounded-lg flex items-center justify-center text-xs font-mono font-black ${
                              isActive
                                ? "bg-amber-500 text-slate-950"
                                : isCompleted
                                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                                : "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                            }`}
                          >
                            {isCompleted ? "✓" : idx + 1}
                          </span>

                          <div className="text-left">
                            <div className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-wide">
                              {joinSentence(sentence.characters)}
                            </div>
                            <div className="text-[10px] text-indigo-650 dark:text-indigo-400 font-semibold">
                              {sentence.pinyin}
                            </div>
                            <div className="text-[9px] text-slate-500 dark:text-slate-450 italic">
                              "{sentence.translation}"
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playTick();
                            handleSpeakText(joinSentence(sentence.characters));
                          }}
                          className="p-1.5 rounded-lg bg-white dark:bg-slate-900 text-slate-655 dark:text-slate-350 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 active:scale-90 transition-all shrink-0"
                          title="Ouvir pronúncia da linha"
                        >
                          <Volume2 size={12} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

        </div>

        {/* Right Side: Persistent Library Sidebar (Desktop) or Sliding Drawer (Mobile) / Ebook / Music Panel */}
        {isMusicMode && (
          <div className={`hidden lg:block w-[400px] flex-shrink-0 z-30 ${isMusicPlayerMinimized ? 'hidden' : 'block'}`}>
            <MusicPlayerPanel
              songs={musicSongs}
              activeSongId={activeSongId}
              activeSentenceIndex={activeMusicSentenceIndex}
              completedSentenceIndices={completedMusicSentenceIndices}
              isPlaying={isMusicPlaying}
              onTogglePlay={() => setIsMusicPlaying(!isMusicPlaying)}
              onSelectSong={(songId) => {
                playTick();
                setActiveSongId(songId);
                setActiveMusicSentenceIndex(0);
                handleClearSequence();
                const selectedSong = musicSongs.find(s => s.id === songId);
                if (selectedSong) {
                  const targetLangId = getLanguageIdFromSong(selectedSong.language);
                  handleSelectLanguage(targetLangId);
                }
              }}
              onSelectSentence={(idx) => {
                playTick();
                setActiveMusicSentenceIndex(idx);
                handleClearSequence();
              }}
              onAddCustomSong={(newSong) => {
                playTick();
                const updated = [...musicSongs, newSong];
                setMusicSongs(updated);
                const customOnly = updated.filter(s => s.id.startsWith('song-custom-'));
                localStorage.setItem('hanzi_dial_custom_songs', JSON.stringify(customOnly));
                setActiveSongId(newSong.id);
                setActiveMusicSentenceIndex(0);
                handleClearSequence();
              }}
              onExitMusic={() => {
                playTick();
                setIsMusicMode(false);
                handleClearSequence();
              }}
              onMinimizeMusic={() => {
                playTick();
                setIsMusicPlayerMinimized(true);
              }}
              onSpeakSentence={(text) => {
                handleSpeakText(text);
              }}
            />
          </div>
        )}
        {!isMusicMode && isEbookMode && (
          <EbookReaderPanel
            ebookName={ebookName}
            sentences={ebookSentences}
            activeIndex={activeEbookIndex}
            completedIndices={completedEbookIndices}
            onSelectSentence={(idx) => {
              setActiveEbookIndex(idx);
              handleClearSequence();
            }}
            onUploadEbook={handleUploadEbook}
            onSelectPreloaded={handleSelectPreloadedEbook}
            onExitEbook={handleExitEbookMode}
            onSpeak={handleSpeakText}
            isParsing={isParsingEbook}
            activeSequence={activeSequence}
            isHintEnabled={isHintEnabled}
            isMonochrome={isMonochrome}
          />
        )}

        {!isMusicMode && !isEbookMode && (
          <div 
            className={`
              lg:block flex-shrink-0 z-40
              ${isSidebarOpenMobile ? 'fixed inset-0 top-16 bg-black/30 backdrop-blur-sm' : 'hidden'}
              lg:relative lg:top-0 lg:bg-transparent lg:backdrop-blur-none
            `}
            onClick={() => setIsSidebarOpenMobile(false)}
          >
            <div 
              className="h-full w-full max-w-sm ml-auto lg:max-w-none"
              onClick={(e) => e.stopPropagation()} // stop close on sidebar content click
            >
              <Sidebar
                sentences={activeSentences}
                completedSentenceIds={completedSentenceIds}
                activeCategory={currentCategory}
                onSelectCategory={setCurrentCategory}
                activeDifficulty={selectedDifficulty}
                onSelectDifficulty={setSelectedDifficulty}
                onResetProgress={handleResetProgress}
                userName={userName}
                onUpdateUserName={setUserName}
                isReviewMode={isReviewMode}
                reviewSentenceId={reviewSentenceId}
                onStartReview={handleStartReview}
                onExitReview={handleExitReview}
                onNextReviewSentence={handleNextReviewSentence}
                reviewXp={reviewXp}
                ttsCode={currentLanguage.ttsCode}
              />
            </div>
          </div>
        )}

      </main>


      {/* Celebration Toast - rendered via React Portal to avoid parent transform clipping */}
      <CelebrationToast
        show={showCelebration}
        sentence={celebratedSentence}
        isReviewMode={isReviewMode}
        joinSentence={joinSentence}
      />

      {/* Help / Instructions Modal */}
      <InstructionsModal
        isOpen={isInstructionsOpen}
        onClose={() => setIsInstructionsOpen(false)}
      />

      {/* Level Up Modal */}
      {levelUpInfo && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-950 border-2 border-amber-400/80 p-6 sm:p-8 rounded-3xl max-w-sm w-full text-center space-y-4 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
            
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center text-4xl shadow-xl ring-4 ring-amber-300/50 animate-bounce">
              🏆
            </div>

            <div className="space-y-1">
              <p className="text-xs font-mono font-black text-amber-400 uppercase tracking-widest">
                Sua Leitura Evoluiu!
              </p>
              <h2 className="text-2xl font-black text-white tracking-tight">
                NÍVEL {levelUpInfo.newLevel} DESBLOQUEADO!
              </h2>
              <p className="text-xs text-indigo-200 font-medium leading-relaxed pt-1">
                Você completou frases no discador, acumulou pontos de XP e subiu de nível com sucesso!
              </p>
            </div>

            <div className="bg-white/10 dark:bg-black/30 border border-white/10 p-3 rounded-2xl text-xs font-mono font-bold text-amber-300 flex items-center justify-center gap-2">
              <Sparkles size={16} className="text-amber-400 animate-spin-slow" />
              <span>XP Total: {totalXp} XP</span>
            </div>

            <button
              onClick={() => {
                playTick();
                setLevelUpInfo(null);
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              Continuar Lendo e Discando 🚀
            </button>
          </div>
        </div>
      )}

      {/* Settings Overlay Dialog */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl relative space-y-5">
            
            <button
              onClick={() => { playTick(); setIsSettingsOpen(false); }}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-all cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
              <SlidersHorizontal className="text-indigo-600 dark:text-indigo-400" size={20} />
              <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Configurações do Aprendizado
              </h3>
            </div>

            {/* Visual Theme & Tips Quick Toggles */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {/* Theme Selector */}
              <button
                onClick={() => { playTick(); setIsMonochrome(prev => !prev); }}
                className={`p-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-2.5 ${
                  isMonochrome
                    ? "bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100 font-extrabold shadow-md"
                    : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                <Palette size={16} />
                <div className="text-left leading-tight">
                  <p className="font-black text-[11px]">{isMonochrome ? "P&B Minimalista" : "Tema Colorido"}</p>
                  <p className="text-[9px] opacity-70">Clique para alternar</p>
                </div>
              </button>

              {/* Hints Toggle */}
              <button
                onClick={() => { playTick(); setIsHintEnabled(prev => !prev); }}
                className={`p-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-2.5 ${
                  isHintEnabled
                    ? "bg-amber-400 text-slate-950 border-amber-500 font-black shadow-md"
                    : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500"
                }`}
              >
                <Lightbulb size={16} />
                <div className="text-left leading-tight">
                  <p className="font-black text-[11px]">Dicas Guiadas</p>
                  <p className="text-[9px] opacity-80">{isHintEnabled ? "Ativadas (Piscando)" : "Desativadas"}</p>
                </div>
              </button>
            </div>

            {/* Language Selection Grid */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Globe size={14} className="text-indigo-600 dark:text-indigo-400" />
                  Idioma que deseja Aprender
                </span>
                <span className="font-mono font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full text-[10px]">
                  {currentLanguage.flag} {currentLanguage.name}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-48 overflow-y-auto pr-1">
                {LANGUAGES.map((lang) => {
                  const isSelected = lang.id === selectedLanguageId;
                  return (
                    <button
                      key={lang.id}
                      onClick={() => handleSelectLanguage(lang.id)}
                      className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex items-center gap-2 ${
                        isSelected
                          ? "bg-indigo-600 text-white border-indigo-500 shadow-md ring-2 ring-indigo-400/30 scale-[0.98]"
                          : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <div className="min-w-0">
                        <p className="font-extrabold text-[11px] truncate leading-tight">{lang.name}</p>
                        <p className={`text-[8px] font-mono uppercase ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                          {lang.phoneticLabel}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Velocity Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">Velocidade das Palavras</span>
                <span className="font-mono font-black text-indigo-650 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full text-[10px]">
                  {cardSpeed === 0 ? "Pausado (0x)" : cardSpeed === 0.5 ? "Lento (0.5x)" : cardSpeed === 1.5 ? "Rápido (1.5x)" : cardSpeed === 2 ? "Frenético (2x)" : "Padrão (1x)"}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {[0, 0.5, 1.0, 1.5, 2.0].map((val) => (
                  <button
                    key={val}
                    onClick={() => { playTick(); setCardSpeed(val); }}
                    className={`py-1.5 px-1 rounded-xl text-[11px] font-black transition-all border cursor-pointer ${
                      cardSpeed === val
                        ? "bg-indigo-600 text-white border-indigo-500 shadow-md scale-95"
                        : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {val}x
                  </button>
                ))}
              </div>
            </div>

            {/* Movement Type */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Estilo de Movimentação</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { playTick(); setCardMovementType('drift'); }}
                  className={`p-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    cardMovementType === 'drift'
                      ? "bg-orange-500/10 border-orange-400 text-orange-700 dark:text-orange-450 font-extrabold"
                      : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  <span className="text-lg">☁️</span>
                  <div className="text-center">
                    <p className="font-black text-[11px]">Flutuação Livre</p>
                    <p className="text-[9px] opacity-70 mt-0.5 font-medium">Bate nas bordas e dialer</p>
                  </div>
                </button>

                <button
                  onClick={() => { playTick(); setCardMovementType('orbit'); }}
                  className={`p-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    cardMovementType === 'orbit'
                      ? "bg-indigo-500/10 border-indigo-400 text-indigo-700 dark:text-indigo-400 font-extrabold"
                      : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  <span className="text-lg">🪐</span>
                  <div className="text-center">
                    <p className="font-black text-[11px]">Órbita em Anéis</p>
                    <p className="text-[9px] opacity-70 mt-0.5 font-medium">Gira e desvia do centro</p>
                  </div>
                </button>
              </div>
            </div>

            {/* TTS Speech Rate (Vocal Speed) */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">Velocidade da Leitura por Voz</span>
                <span className="font-mono font-black text-indigo-650 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full text-[10px]">
                  {speechRate === 0.6 ? "Lenta (0.6x)" : speechRate === 1.0 ? "Nativa (1x)" : speechRate === 1.2 ? "Rápida (1.2x)" : "Estudo (0.85x)"}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { val: 0.6, label: "0.6x" },
                  { val: 0.85, label: "0.85x" },
                  { val: 1.0, label: "1.0x" },
                  { val: 1.2, label: "1.2x" }
                ].map((item) => (
                  <button
                    key={item.val}
                    onClick={() => { playTick(); setSpeechRate(item.val); }}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      speechRate === item.val
                        ? "bg-indigo-600 text-white border-indigo-500 shadow-md scale-95"
                        : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Google TTS API Key */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs">
                <Volume2 size={14} className="text-indigo-600 dark:text-indigo-400" />
                <span className="font-bold text-slate-700 dark:text-slate-300">Voz Neural Google TTS (opcional)</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={googleTtsKey}
                  onChange={(e) => setGoogleTtsKey(e.target.value)}
                  placeholder="Cole sua API Key do Google TTS aqui"
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <button
                  onClick={() => {
                    localStorage.setItem('hanzi_dial_google_tts_key', googleTtsKey);
                    // inject into window for immediate use
                    (window as any).__GOOGLE_TTS_KEY__ = googleTtsKey;
                    playTick();
                  }}
                  className="px-3 py-2 rounded-xl bg-indigo-600 text-white text-xs font-black hover:bg-indigo-500 transition-all cursor-pointer"
                >
                  Salvar
                </button>
              </div>
              <p className="text-[9px] text-slate-400 dark:text-slate-500 font-mono">
                Ativa vozes Neural2/Wavenet. Obtenha em console.cloud.google.com &gt; Text-to-Speech API
              </p>
            </div>

            <div className="bg-indigo-50/40 dark:bg-indigo-950/10 border border-indigo-100/50 dark:border-indigo-900/30 p-3 rounded-2xl text-[10px] leading-relaxed text-indigo-900/80 dark:text-indigo-300/80 font-medium">
              💡 <strong>Dica de Prática:</strong> A órbita em anéis mantém as palavras em órbitas elípticas que nunca entram no centro da tela, deixando a zona de montagem de frases totalmente livre e limpa!
            </div>

            <button
              onClick={() => { playTick(); setIsSettingsOpen(false); }}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 text-xs font-black tracking-wider uppercase transition-all shadow-md cursor-pointer"
            >
              Confirmar Ajustes
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
