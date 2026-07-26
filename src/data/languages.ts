import { Sentence } from '../types';

export interface LanguageConfig {
  id: string;
  name: string;
  flag: string;
  ttsCode: string;
  phoneticLabel: string;
  description: string;
  sentences: Sentence[];
  preloadedBooks: Record<string, { name: string; sentences: Sentence[] }>;
}

export const LANGUAGES: LanguageConfig[] = [
  {
    id: 'zh',
    name: 'Mandarim (Chinês)',
    flag: '🇨🇳',
    ttsCode: 'zh-CN',
    phoneticLabel: 'PINYIN',
    description: 'Aprenda caracteres chineses (Hanzi) e pinyin.',
    sentences: [
      {
        id: 'zh-1',
        characters: ['你', '好', '吗'],
        pinyin: 'Nǐ hǎo ma?',
        translation: 'Como você está?',
        category: 'Saudações',
        difficulty: 'Fácil',
        explanation: 'A frase de saudação mais comum em chinês. 你 (você) + 好 (bem) + 吗 (partícula de pergunta).',
        literalBreakdown: [
          { char: '你', pinyin: 'nǐ', translation: 'Você' },
          { char: '好', pinyin: 'hǎo', translation: 'Bem / Bom' },
          { char: '吗', pinyin: 'ma', translation: 'Partícula de pergunta' }
        ]
      },
      {
        id: 'zh-2',
        characters: ['我', '学习', '中文'],
        pinyin: 'Wǒ xuéxí zhōngwén.',
        translation: 'Eu estudo chinês.',
        category: 'Estudo',
        difficulty: 'Médio',
        explanation: 'Estrutura básica: Sujeito (我) + Verbo (学习) + Objeto (中文).',
        literalBreakdown: [
          { char: '我', pinyin: 'wǒ', translation: 'Eu' },
          { char: '学习', pinyin: 'xuéxí', translation: 'Estudar' },
          { char: '中文', pinyin: 'zhōngwén', translation: 'Língua Chinesa' }
        ]
      },
      {
        id: 'zh-3',
        characters: ['他', '去', '喝', '咖啡'],
        pinyin: 'Tā qù hē kāfēi.',
        translation: 'Ele vai beber café.',
        category: 'Alimentos & Bebidas',
        difficulty: 'Médio',
        explanation: 'Verbos consecutivos sem conectivos: Ele vai (去) e bebe (喝) café (咖啡).',
        literalBreakdown: [
          { char: '他', pinyin: 'tā', translation: 'Ele' },
          { char: '去', pinyin: 'qù', translation: 'Ir' },
          { char: '喝', pinyin: 'hē', translation: 'Beber' },
          { char: '咖啡', pinyin: 'kāfēi', translation: 'Café' }
        ]
      }
    ],
    preloadedBooks: {
      prince: {
        name: "O Pequeno Príncipe (小王子)",
        sentences: [
          {
            id: "prince-zh-1",
            characters: ["我", "的", "生活", "很", "单调"],
            pinyin: "Wǒ de shēnghuó hěn dāndiào.",
            translation: "Minha vida é muito monótona.",
            category: "Ebook",
            difficulty: "Fácil",
            explanation: "我的 (minha) + 生活 (vida) + 很 (muito) + 单调 (monótona).",
            literalBreakdown: [
              { char: '我', pinyin: 'wǒ', translation: 'Eu' },
              { char: '的', pinyin: 'de', translation: 'De (possessivo)' },
              { char: '生活', pinyin: 'shēnghuó', translation: 'Vida' },
              { char: '很', pinyin: 'hěn', translation: 'Muito' },
              { char: '单调', pinyin: 'dāndiào', translation: 'Monótona' }
            ]
          },
          {
            id: "prince-zh-2",
            characters: ["用", "心", "去", "看", "才能", "看", "清楚"],
            pinyin: "Yòng xīn qù kàn cáinéng kàn qīngchu.",
            translation: "Só se vê bem com o coração.",
            category: "Ebook",
            difficulty: "Médio",
            explanation: "用 (usar) + 心 (coração) + 去看 (para ver) + 才能 (só assim) + 看清楚 (ver claramente).",
            literalBreakdown: [
              { char: '用', pinyin: 'yòng', translation: 'Usar' },
              { char: '心', pinyin: 'xīn', translation: 'Coração' },
              { char: '去', pinyin: 'qù', translation: 'Para' },
              { char: '看', pinyin: 'kàn', translation: 'Ver' },
              { char: '才能', pinyin: 'cáinéng', translation: 'Apenas assim' },
              { char: '看', pinyin: 'kàn', translation: 'Ver' },
              { char: '清楚', pinyin: 'qīngchu', translation: 'Claramente' }
            ]
          },
          {
            id: "prince-zh-3",
            characters: ["本质", "的", "东西", "用", "眼睛", "是", "看", "不", "见", "的"],
            pinyin: "Běnzhì de dōngxi yòng yǎnjing shì kàn bu jiàn de.",
            translation: "O essencial é invisível aos olhos.",
            category: "Ebook",
            difficulty: "Médio",
            explanation: "本质 (essência/essencial) + 东西 (coisas) + 看不见 (invisível/não se pode ver).",
            literalBreakdown: [
              { char: '本质', pinyin: 'běnzhì', translation: 'Essência' },
              { char: '的', pinyin: 'de', translation: 'De' },
              { char: '东西', pinyin: 'dōngxi', translation: 'Coisas' },
              { char: '用', pinyin: 'yòng', translation: 'Com' },
              { char: '眼睛', pinyin: 'yǎnjing', translation: 'Olhos' },
              { char: '是', pinyin: 'shì', translation: 'É' },
              { char: '看不见', pinyin: 'kàn bu jiàn', translation: 'Invisível' }
            ]
          },
          {
            id: "prince-zh-4",
            characters: ["正是", "你", "为", "玫瑰", "浪费", "的", "时间"],
            pinyin: "Zhèngshì nǐ wèi méigui làngfèi de shíjiān.",
            translation: "Foi o tempo que dedicaste à tua rosa que a fez importante.",
            category: "Ebook",
            difficulty: "Médio",
            explanation: "正是 (é exatamente) + 你 (você) + 为 (para) + 玫瑰 (rosa) + 时间 (tempo).",
            literalBreakdown: [
              { char: '正是', pinyin: 'zhèngshì', translation: 'É exatamente' },
              { char: '你', pinyin: 'nǐ', translation: 'Você' },
              { char: '为', pinyin: 'wèi', translation: 'Por / Para' },
              { char: '玫瑰', pinyin: 'méigui', translation: 'Rosa' },
              { char: '浪费', pinyin: 'làngfèi', translation: 'Dedicou / Perdeu' },
              { char: '时间', pinyin: 'shíjiān', translation: 'Tempo' }
            ]
          },
          {
            id: "prince-zh-5",
            characters: ["审判", "自己", "比", "审判", "别人", "难"],
            pinyin: "Shěnpàn zìjǐ bǐ shěnpàn biérén nán.",
            translation: "É muito mais difícil julgar a si mesmo do que aos outros.",
            category: "Ebook",
            difficulty: "Difícil",
            explanation: "审判 (julgar) + 自己 (si mesmo) + 比 (do que) + 别人 (outros).",
            literalBreakdown: [
              { char: '审判', pinyin: 'shěnpàn', translation: 'Julgar' },
              { char: '自己', pinyin: 'zìjǐ', translation: 'Si mesmo' },
              { char: '比', pinyin: 'bǐ', translation: 'Comparado a' },
              { char: '别人', pinyin: 'biérén', translation: 'Outras pessoas' },
              { char: '难', pinyin: 'nán', translation: 'Difícil' }
            ]
          },
          {
            id: "prince-zh-6",
            characters: ["如果你", "驯养", "了", "我", "生活", "充满", "阳光"],
            pinyin: "Rúguǒ nǐ xùnyǎng le wǒ, shēnghuó chōngmǎn yángguāng.",
            translation: "Se você me cativar, minha vida ficará cheia de sol.",
            category: "Ebook",
            difficulty: "Médio",
            explanation: "如果你 (se você) + 驯养 (cativar) + 生活 (vida) + 阳光 (luz do sol).",
            literalBreakdown: [
              { char: '如果你', pinyin: 'rúguǒ nǐ', translation: 'Se você' },
              { char: '驯养', pinyin: 'xùnyǎng', translation: 'Cativar / Domesticar' },
              { char: '我', pinyin: 'wǒ', translation: 'Mim' },
              { char: '生活', pinyin: 'shēnghuó', translation: 'Vida' },
              { char: '充满', pinyin: 'chōngmǎn', translation: 'Cheia de' },
              { char: '阳光', pinyin: 'yángguāng', translation: 'Luz do Sol' }
            ]
          },
          {
            id: "prince-zh-7",
            characters: ["所有", "的", "大人", "都", "曾经", "是", "小孩"],
            pinyin: "Suǒyǒu de dàren dōu céngjīng shì xiǎohái.",
            translation: "Todos os adultos já foram crianças.",
            category: "Ebook",
            difficulty: "Fácil",
            explanation: "所有 (todos) + 大人 (adultos) + 曾经 (uma vez / no passado) + 小孩 (criança).",
            literalBreakdown: [
              { char: '所有', pinyin: 'suǒyǒu', translation: 'Todos' },
              { char: '大人', pinyin: 'dàren', translation: 'Adultos' },
              { char: '曾经', pinyin: 'céngjīng', translation: 'Já foram / No passado' },
              { char: '是', pinyin: 'shì', translation: 'Eram' },
              { char: '小孩', pinyin: 'xiǎohái', translation: 'Crianças' }
            ]
          },
          {
            id: "prince-zh-8",
            characters: ["人们", "已经", "忘记", "了", "这个", "真理"],
            pinyin: "Rénmen yǐjīng wàngjì le zhège zhēnlǐ.",
            translation: "Os homens esqueceram essa verdade.",
            category: "Ebook",
            difficulty: "Médio",
            explanation: "人们 (as pessoas) + 已经 (já) + 忘记 (esquecer) + 真理 (verdade).",
            literalBreakdown: [
              { char: '人们', pinyin: 'rénmen', translation: 'As pessoas / Homens' },
              { char: '已经', pinyin: 'yǐjīng', translation: 'Já' },
              { char: '忘记', pinyin: 'wàngjì', translation: 'Esquecer' },
              { char: '真理', pinyin: 'zhēnlǐ', translation: 'Verdade' }
            ]
          },
          {
            id: "prince-zh-9",
            characters: ["你", "要", "对", "你", "驯养", "的", "负责"],
            pinyin: "Nǐ yào duì nǐ xùnyǎng de fùzé.",
            translation: "Tu te tornas responsável por aquilo que cativas.",
            category: "Ebook",
            difficulty: "Médio",
            explanation: "你 (você) + 驯养 (cativar) + 负责 (ser responsável).",
            literalBreakdown: [
              { char: '你', pinyin: 'nǐ', translation: 'Você' },
              { char: '要', pinyin: 'yào', translation: 'Deve' },
              { char: '对', pinyin: 'duì', translation: 'Para com' },
              { char: '驯养', pinyin: 'xùnyǎng', translation: 'Cativou' },
              { char: '负责', pinyin: 'fùzé', translation: 'Ser responsável' }
            ]
          },
          {
            id: "prince-zh-10",
            characters: ["沙漠", "之所以", "美丽", "是因为", "藏着", "水井"],
            pinyin: "Shāmò zhīsuǒyǐ měilì shì yīnwèi cángzhe shuǐjǐng.",
            translation: "O deserto é belo porque esconde um poço de água.",
            category: "Ebook",
            difficulty: "Difícil",
            explanation: "沙漠 (deserto) + 美丽 (belo) + 藏着 (esconde) + 水井 (poço).",
            literalBreakdown: [
              { char: '沙漠', pinyin: 'shāmò', translation: 'Deserto' },
              { char: '美丽', pinyin: 'měilì', translation: 'Belo' },
              { char: '是因为', pinyin: 'shì yīnwèi', translation: 'É porque' },
              { char: '藏着', pinyin: 'cángzhe', translation: 'Esconde' },
              { char: '水井', pinyin: 'shuǐjǐng', translation: 'Poço de água' }
            ]
          }
        ]
      }
    }
  },
  {
    id: 'en',
    name: 'Inglês',
    flag: '🇺🇸',
    ttsCode: 'en-US',
    phoneticLabel: 'PRONÚNCIA',
    description: 'Aprenda vocabulário e estrutura de frases em inglês.',
    sentences: [
      {
        id: 'en-1',
        characters: ['How', 'are', 'you', 'today'],
        pinyin: 'háu ár iú tudéi',
        translation: 'Como você está hoje?',
        category: 'Saudações',
        difficulty: 'Fácil',
        explanation: 'Pergunta clássica de saudação. How (como) + are (está) + you (você) + today (hoje).',
        literalBreakdown: [
          { char: 'How', pinyin: 'háu', translation: 'Como' },
          { char: 'are', pinyin: 'ár', translation: 'Está' },
          { char: 'you', pinyin: 'iú', translation: 'Você' },
          { char: 'today', pinyin: 'tudéi', translation: 'Hoje' }
        ]
      }
    ],
    preloadedBooks: {
      prince: {
        name: "The Little Prince (O Pequeno Príncipe)",
        sentences: [
          {
            id: "prince-en-1",
            characters: ["It", "is", "only", "with", "the", "heart", "that", "one", "can", "see", "rightly"],
            pinyin: "it iz óunli uíd dâ hárt dêt uán kên sí ráitli",
            translation: "Só se vê bem com o coração.",
            category: "Ebook",
            difficulty: "Médio",
            explanation: "Frase célebre de Antoine de Saint-Exupéry em inglês.",
            literalBreakdown: [
              { char: 'It is', pinyin: 'it iz', translation: 'É' },
              { char: 'only with', pinyin: 'óunli uíd', translation: 'Somente com' },
              { char: 'the heart', pinyin: 'dâ hárt', translation: 'O coração' },
              { char: 'can see', pinyin: 'kên sí', translation: 'Pode ver' },
              { char: 'rightly', pinyin: 'ráitli', translation: 'Corretamente / Bem' }
            ]
          },
          {
            id: "prince-en-2",
            characters: ["What", "is", "essential", "is", "invisible", "to", "the", "eye"],
            pinyin: "uót iz essénshul iz invízibl tu dâ ái",
            translation: "O essencial é invisível aos olhos.",
            category: "Ebook",
            difficulty: "Médio",
            explanation: "Essential (essencial) + invisible (invisível) + to the eye (aos olhos).",
            literalBreakdown: [
              { char: 'What is', pinyin: 'uót iz', translation: 'O que é' },
              { char: 'essential', pinyin: 'essénshul', translation: 'Essencial' },
              { char: 'is invisible', pinyin: 'iz invízibl', translation: 'É invisível' },
              { char: 'to the eye', pinyin: 'tu dâ ái', translation: 'Aos olhos' }
            ]
          },
          {
            id: "prince-en-3",
            characters: ["It", "is", "the", "time", "you", "wasted", "for", "your", "rose"],
            pinyin: "it iz dâ táim iú uéistid fór iór róuz",
            translation: "Foi o tempo que você dedicou à sua rosa.",
            category: "Ebook",
            difficulty: "Médio",
            explanation: "Time (tempo) + wasted/spent (dedicou/gastou) + rose (rosa).",
            literalBreakdown: [
              { char: 'It is', pinyin: 'it iz', translation: 'Foi / É' },
              { char: 'the time', pinyin: 'dâ táim', translation: 'O tempo' },
              { char: 'you wasted', pinyin: 'iú uéistid', translation: 'Que você dedicou' },
              { char: 'for your rose', pinyin: 'fór iór róuz', translation: 'Pela sua rosa' }
            ]
          },
          {
            id: "prince-en-4",
            characters: ["You", "become", "responsible", "forever", "for", "what", "you", "have", "tamed"],
            pinyin: "iú bicám rispónsibl forévêr fór uót iú hév téimd",
            translation: "Você se torna responsável para sempre pelo que cativou.",
            category: "Ebook",
            difficulty: "Difícil",
            explanation: "Responsible (responsável) + forever (para sempre) + tamed (cativou).",
            literalBreakdown: [
              { char: 'You become', pinyin: 'iú bicám', translation: 'Você se torna' },
              { char: 'responsible', pinyin: 'rispónsibl', translation: 'Responsável' },
              { char: 'forever', pinyin: 'forévêr', translation: 'Para sempre' },
              { char: 'what you tamed', pinyin: 'uót iú téimd', translation: 'Pelo que cativou' }
            ]
          },
          {
            id: "prince-en-5",
            characters: ["All", "grown-ups", "were", "once", "children"],
            pinyin: "ól gróun-áps uér uáns tchíldren",
            translation: "Todos os adultos já foram crianças.",
            category: "Ebook",
            difficulty: "Fácil",
            explanation: "Grown-ups (adultos) + were once (já foram) + children (crianças).",
            literalBreakdown: [
              { char: 'All', pinyin: 'ól', translation: 'Todos' },
              { char: 'grown-ups', pinyin: 'gróun-áps', translation: 'Adultos' },
              { char: 'were once', pinyin: 'uér uáns', translation: 'Foram uma vez' },
              { char: 'children', pinyin: 'tchíldren', translation: 'Crianças' }
            ]
          },
          {
            id: "prince-en-6",
            characters: ["It", "is", "much", "more", "difficult", "to", "judge", "oneself"],
            pinyin: "it iz mátch mór díficult tu djádj uánsélf",
            translation: "É muito mais difícil julgar a si mesmo.",
            category: "Ebook",
            difficulty: "Médio",
            explanation: "More difficult (mais difícil) + judge (julgar) + oneself (si mesmo).",
            literalBreakdown: [
              { char: 'It is', pinyin: 'it iz', translation: 'É' },
              { char: 'much more', pinyin: 'mátch mór', translation: 'Muito mais' },
              { char: 'difficult', pinyin: 'díficult', translation: 'Difícil' },
              { char: 'to judge', pinyin: 'tu djádj', translation: 'Julgar' },
              { char: 'oneself', pinyin: 'uánsélf', translation: 'A si mesmo' }
            ]
          },
          {
            id: "prince-en-7",
            characters: ["If", "you", "tame", "me", "we", "shall", "need", "each", "other"],
            pinyin: "if iú téim mí uí shél níd ítch ádêr",
            translation: "Se você me cativar, precisaremos um do outro.",
            category: "Ebook",
            difficulty: "Médio",
            explanation: "If (se) + tame (cativar) + need each other (precisar um do outro).",
            literalBreakdown: [
              { char: 'If you', pinyin: 'if iú', translation: 'Se você' },
              { char: 'tame me', pinyin: 'téim mí', translation: 'Me cativar' },
              { char: 'we shall need', pinyin: 'uí shél níd', translation: 'Nós precisaremos' },
              { char: 'each other', pinyin: 'ítch ádêr', translation: 'Um do outro' }
            ]
          },
          {
            id: "prince-en-8",
            characters: ["The", "stars", "are", "beautiful", "because", "of", "a", "flower"],
            pinyin: "dâ stárs ár biútiful bicóz óv á fláuer",
            translation: "As estrelas são belas por causa de uma flor.",
            category: "Ebook",
            difficulty: "Fácil",
            explanation: "Stars (estrelas) + beautiful (belas) + flower (flor).",
            literalBreakdown: [
              { char: 'The stars', pinyin: 'dâ stárs', translation: 'As estrelas' },
              { char: 'are beautiful', pinyin: 'ár biútiful', translation: 'São belas' },
              { char: 'because of', pinyin: 'bicóz óv', translation: 'Por causa de' },
              { char: 'a flower', pinyin: 'á fláuer', translation: 'Uma flor' }
            ]
          },
          {
            id: "prince-en-9",
            characters: ["One", "runs", "the", "risk", "of", "weeping", "a", "little"],
            pinyin: "uán ránz dâ rísk óv uípiŋ á lítl",
            translation: "Corre-se o risco de chorar um pouco.",
            category: "Ebook",
            difficulty: "Difícil",
            explanation: "Runs the risk (corre o risco) + weeping (chorar).",
            literalBreakdown: [
              { char: 'One runs', pinyin: 'uán ránz', translation: 'A gente corre' },
              { char: 'the risk', pinyin: 'dâ rísk', translation: 'O risco' },
              { char: 'of weeping', pinyin: 'óv uípiŋ', translation: 'De chorar' },
              { char: 'a little', pinyin: 'á lítl', translation: 'Um pouco' }
            ]
          },
          {
            id: "prince-en-10",
            characters: ["The", "desert", "is", "beautiful", "because", "it", "hides", "a", "well"],
            pinyin: "dâ dézert iz biútiful bicóz it háidz á uél",
            translation: "O deserto é belo porque esconde um poço.",
            category: "Ebook",
            difficulty: "Médio",
            explanation: "Desert (deserto) + hides (esconde) + well (poço de água).",
            literalBreakdown: [
              { char: 'The desert', pinyin: 'dâ dézert', translation: 'O deserto' },
              { char: 'is beautiful', pinyin: 'iz biútiful', translation: 'É belo' },
              { char: 'because it hides', pinyin: 'bicóz it háidz', translation: 'Porque esconde' },
              { char: 'a well', pinyin: 'á uél', translation: 'Um poço' }
            ]
          }
        ]
      }
    }
  },
  {
    id: 'es',
    name: 'Espanhol',
    flag: '🇪🇸',
    ttsCode: 'es-ES',
    phoneticLabel: 'PRONÚNCIA',
    description: 'Aprenda vocabulário e expressões em espanhol.',
    sentences: [
      {
        id: 'es-1',
        characters: ['¡Hola!', '¿Cómo', 'estás', 'hoy?'],
        pinyin: 'óla, cómo estás ói',
        translation: 'Olá! Como você está hoje?',
        category: 'Saudações',
        difficulty: 'Fácil',
        explanation: 'Lembre-se de usar o sinal de interrogação invertido (¿) ao iniciar perguntas em espanhol.',
        literalBreakdown: [
          { char: '¡Hola!', pinyin: 'óla', translation: 'Olá!' },
          { char: '¿Cómo', pinyin: 'cómo', translation: 'Como' },
          { char: 'estás', pinyin: 'estás', translation: 'Você está' },
          { char: 'hoy?', pinyin: 'ói', translation: 'Hoje?' }
        ]
      }
    ],
    preloadedBooks: {
      prince: {
        name: "El Principito (O Pequeno Príncipe)",
        sentences: [
          {
            id: "prince-es-1",
            characters: ["Solo", "con", "el", "corazón", "se", "puede", "ver", "bien"],
            pinyin: "sólo con el corasón se puéde ver bien",
            translation: "Só se vê bem com o coração.",
            category: "Ebook",
            difficulty: "Médio",
            explanation: "Versão clássica em espanhol do capítulo 21.",
            literalBreakdown: [
              { char: 'Solo con', pinyin: 'sólo con', translation: 'Apenas com' },
              { char: 'el corazón', pinyin: 'el corasón', translation: 'O coração' },
              { char: 'se puede ver', pinyin: 'se puéde ver', translation: 'Se pode ver' },
              { char: 'bien', pinyin: 'bien', translation: 'Bem' }
            ]
          },
          {
            id: "prince-es-2",
            characters: ["Lo", "esencial", "es", "invisible", "a", "los", "ojos"],
            pinyin: "lo esensiál es invisíble a los ójos",
            translation: "O essencial é invisível aos olhos.",
            category: "Ebook",
            difficulty: "Médio",
            explanation: "Lo esencial (o essencial) + es invisible (é invisível) + a los ojos (aos olhos).",
            literalBreakdown: [
              { char: 'Lo esencial', pinyin: 'lo esensiál', translation: 'O essencial' },
              { char: 'es invisible', pinyin: 'es invisíble', translation: 'É invisível' },
              { char: 'a los ojos', pinyin: 'a los ójos', translation: 'Aos olhos' }
            ]
          },
          {
            id: "prince-es-3",
            characters: ["Fue", "el", "tiempo", "que", "pasaste", "con", "tu", "rosa"],
            pinyin: "fué el tiémpo ke pasáste con tu rósa",
            translation: "Foi o tempo que você passou com a sua rosa.",
            category: "Ebook",
            difficulty: "Fácil",
            explanation: "Tiempo (tempo) + pasaste (passou/dedicou) + rosa (rosa).",
            literalBreakdown: [
              { char: 'Fue el tiempo', pinyin: 'fué el tiémpo', translation: 'Foi o tempo' },
              { char: 'que pasaste', pinyin: 'ke pasáste', translation: 'Que você passou' },
              { char: 'con tu rosa', pinyin: 'con tu rósa', translation: 'Com a sua rosa' }
            ]
          },
          {
            id: "prince-es-4",
            characters: ["Eres", "responsable", "para", "siempre", "de", "tu", "rosa"],
            pinyin: "éres responsáble pára siémpre de tu rósa",
            translation: "Tu te tornas responsável para sempre pela tua rosa.",
            category: "Ebook",
            difficulty: "Médio",
            explanation: "Eres responsable (és responsável) + para siempre (para sempre).",
            literalBreakdown: [
              { char: 'Eres', pinyin: 'éres', translation: 'Tu és' },
              { char: 'responsable', pinyin: 'responsáble', translation: 'Responsável' },
              { char: 'para siempre', pinyin: 'pára siémpre', translation: 'Para sempre' },
              { char: 'de tu rosa', pinyin: 'de tu rósa', translation: 'Pela tua rosa' }
            ]
          },
          {
            id: "prince-es-5",
            characters: ["Todas", "las", "personas", "mayores", "fueron", "niños"],
            pinyin: "tódas las persónas maióres fuéron níños",
            translation: "Todas as pessoas grandes foram crianças.",
            category: "Ebook",
            difficulty: "Fácil",
            explanation: "Personas mayores (adultos/pessoas grandes) + fueron niños (foram crianças).",
            literalBreakdown: [
              { char: 'Todas las', pinyin: 'tódas las', translation: 'Todas as' },
              { char: 'personas mayores', pinyin: 'persónas maióres', translation: 'Pessoas grandes' },
              { char: 'fueron niños', pinyin: 'fuéron níños', translation: 'Foram crianças' }
            ]
          },
          {
            id: "prince-es-6",
            characters: ["Es", "mucho", "más", "difícil", "juzgarse", "a", "uno", "mismo"],
            pinyin: "es múcho más difísil jusgárse a úno mísmo",
            translation: "É muito mais difícil julgar a si mesmo.",
            category: "Ebook",
            difficulty: "Médio",
            explanation: "Más difícil (mais difícil) + juzgarse (julgar-se) + a uno mismo (a si próprio).",
            literalBreakdown: [
              { char: 'Es mucho más', pinyin: 'es múcho más', translation: 'É muito mais' },
              { char: 'difícil', pinyin: 'difísil', translation: 'Difícil' },
              { char: 'juzgarse', pinyin: 'jusgárse', translation: 'Julgar a si' },
              { char: 'a uno mismo', pinyin: 'a úno mísmo', translation: 'Próprio' }
            ]
          },
          {
            id: "prince-es-7",
            characters: ["Si", "me", "domesticas", "tendremos", "necesidad", "el", "uno", "del", "otro"],
            pinyin: "si me domésticas tendrémos nesesidád el úno del ótro",
            translation: "Se me cativares, teremos necessidade um do outro.",
            category: "Ebook",
            difficulty: "Difícil",
            explanation: "Domesticas (cativas) + tendremos necesidad (teremos necessidade).",
            literalBreakdown: [
              { char: 'Si me domesticas', pinyin: 'si me domésticas', translation: 'Se me cativares' },
              { char: 'tendremos necesidad', pinyin: 'tendrémos nesesidád', translation: 'Teremos necessidade' },
              { char: 'el uno del otro', pinyin: 'el úno del ótro', translation: 'Um do outro' }
            ]
          },
          {
            id: "prince-es-8",
            characters: ["Las", "estrellas", "son", "bellas", "por", "una", "flor"],
            pinyin: "las estréllas son béllas por úna flor",
            translation: "As estrelas são belas por causa de uma flor.",
            category: "Ebook",
            difficulty: "Fácil",
            explanation: "Estrellas (estrelas) + bellas (belas) + flor (flor).",
            literalBreakdown: [
              { char: 'Las estrellas', pinyin: 'las estréllas', translation: 'As estrelas' },
              { char: 'son bellas', pinyin: 'son béllas', translation: 'São belas' },
              { char: 'por una flor', pinyin: 'por úna flor', translation: 'Por uma flor' }
            ]
          },
          {
            id: "prince-es-9",
            characters: ["Caminando", "en", "línea", "recta", "no", "se", "llega", "lejos"],
            pinyin: "kaminándo en línea rékta no se iéga léjos",
            translation: "Caminhando em linha reta não se pode ir muito longe.",
            category: "Ebook",
            difficulty: "Médio",
            explanation: "Línea recta (linha reta) + no se llega lejos (não se chega longe).",
            literalBreakdown: [
              { char: 'Caminando', pinyin: 'kaminándo', translation: 'Caminhando' },
              { char: 'en línea recta', pinyin: 'en línea rékta', translation: 'Em linha reta' },
              { char: 'no se llega lejos', pinyin: 'no se iéga léjos', translation: 'Não se chega longe' }
            ]
          },
          {
            id: "prince-es-10",
            characters: ["El", "desierto", "es", "bello", "porque", "esconde", "un", "pozo"],
            pinyin: "el desiérto es béllo pórke eskónde un póso",
            translation: "O deserto é belo porque esconde um poço de água.",
            category: "Ebook",
            difficulty: "Médio",
            explanation: "Desierto (deserto) + esconde (esconde) + pozo (poço).",
            literalBreakdown: [
              { char: 'El desierto', pinyin: 'el desiérto', translation: 'O deserto' },
              { char: 'es bello', pinyin: 'es béllo', translation: 'É belo' },
              { char: 'porque esconde', pinyin: 'pórke eskónde', translation: 'Porque esconde' },
              { char: 'un pozo', pinyin: 'un póso', translation: 'Um poço' }
            ]
          }
        ]
      }
    }
  },
  {
    id: 'it',
    name: 'Italiano',
    flag: '🇮🇹',
    ttsCode: 'it-IT',
    phoneticLabel: 'PRONÚNCIA',
    description: 'Aprenda a sonoridade e o charme do idioma italiano.',
    sentences: [
      {
        id: 'it-1',
        characters: ['Ciao,', 'come', 'stai', 'oggi', '?'],
        pinyin: 'tcháo, cóme stái ódji',
        translation: 'Olá, como você está hoje?',
        category: 'Saudações',
        difficulty: 'Fácil',
        explanation: 'Ciao serve tanto para "olá" quanto para "tchau" informal.',
        literalBreakdown: [
          { char: 'Ciao', pinyin: 'tcháo', translation: 'Olá' },
          { char: 'come', pinyin: 'cóme', translation: 'Como' },
          { char: 'stai', pinyin: 'stái', translation: 'Você está' },
          { char: 'oggi', pinyin: 'ódji', translation: 'Hoje' }
        ]
      }
    ],
    preloadedBooks: {
      prince: {
        name: "Il Piccolo Principe (O Pequeno Príncipe)",
        sentences: [
          {
            id: "prince-it-1",
            characters: ["Non", "si", "vede", "bene", "che", "col", "cuore"],
            pinyin: "non si véde béne ke col kuóre",
            translation: "Só se vê bem com o coração.",
            category: "Ebook",
            difficulty: "Médio",
            explanation: "A frase mais bonita em italiano do livro.",
            literalBreakdown: [
              { char: 'Non si vede', pinyin: 'non si véde', translation: 'Não se vê' },
              { char: 'bene', pinyin: 'béne', translation: 'Bem' },
              { char: 'che col cuore', pinyin: 'ke col kuóre', translation: 'A não ser com o coração' }
            ]
          },
          {
            id: "prince-it-2",
            characters: ["L'essenziale", "è", "invisibile", "agli", "occhi"],
            pinyin: "lessensiále è invisíbile ályi óki",
            translation: "O essencial é invisível aos olhos.",
            category: "Ebook",
            difficulty: "Médio",
            explanation: "L'essenziale (o essencial) + invisibile (invisível) + agli occhi (aos olhos).",
            literalBreakdown: [
              { char: "L'essenziale", pinyin: "lessensiále", translation: 'O essencial' },
              { char: 'è invisibile', pinyin: 'è invisíbile', translation: 'É invisível' },
              { char: 'agli occhi', pinyin: 'ályi óki', translation: 'Aos olhos' }
            ]
          },
          {
            id: "prince-it-3",
            characters: ["È", "il", "tempo", "che", "hai", "perduto", "per", "la", "tua", "rosa"],
            pinyin: "è il témpo ke ái perdúto per la túa rósa",
            translation: "Foi o tempo que você perdeu com a sua rosa.",
            category: "Ebook",
            difficulty: "Médio",
            explanation: "Tempo (tempo) + hai perduto (dedicou/perdeu) + rosa (rosa).",
            literalBreakdown: [
              { char: 'È il tempo', pinyin: 'è il témpo', translation: 'Foi o tempo' },
              { char: 'che hai perduto', pinyin: 'ke ái perdúto', translation: 'Que você dedicou' },
              { char: 'per la tua rosa', pinyin: 'per la túa rósa', translation: 'Pela sua rosa' }
            ]
          },
          {
            id: "prince-it-4",
            characters: ["Tu", "sei", "responsabile", "per", "sempre", "della", "tua", "rosa"],
            pinyin: "tu séi responsábile per sémpre délla túa rósa",
            translation: "Tu és responsável para sempre pela tua rosa.",
            category: "Ebook",
            difficulty: "Médio",
            explanation: "Sei responsabile (és responsável) + per sempre (para sempre).",
            literalBreakdown: [
              { char: 'Tu sei', pinyin: 'tu séi', translation: 'Tu és' },
              { char: 'responsabile', pinyin: 'responsábile', translation: 'Responsável' },
              { char: 'per sempre', pinyin: 'per sémpre', translation: 'Para sempre' },
              { char: 'della tua rosa', pinyin: 'délla túa rósa', translation: 'Da tua rosa' }
            ]
          },
          {
            id: "prince-it-5",
            characters: ["Tutti", "i", "grandi", "sono", "stati", "bambini"],
            pinyin: "tútti i grándi sóno státi bambíni",
            translation: "Todos os grandes foram crianças uma vez.",
            category: "Ebook",
            difficulty: "Fácil",
            explanation: "Tutti i grandi (todos os adultos) + sono stati bambini (foram crianças).",
            literalBreakdown: [
              { char: 'Tutti i grandi', pinyin: 'tútti i grándi', translation: 'Todos os adultos' },
              { char: 'sono stati', pinyin: 'sóno státi', translation: 'Foram' },
              { char: 'bambini', pinyin: 'bambíni', translation: 'Crianças' }
            ]
          },
          {
            id: "prince-it-6",
            characters: ["È", "molto", "più", "difficile", "giudicare", "se", "stessi"],
            pinyin: "è mólto più diffítchile djiudikáre se stéssi",
            translation: "É muito mais difícil julgar a si mesmo.",
            category: "Ebook",
            difficulty: "Médio",
            explanation: "Più difficile (mais difícil) + giudicare se stessi (julgar a si mesmo).",
            literalBreakdown: [
              { char: 'È molto più', pinyin: 'è mólto più', translation: 'É muito mais' },
              { char: 'difficile', pinyin: 'diffítchile', translation: 'Difícil' },
              { char: 'giudicare', pinyin: 'djiudikáre', translation: 'Julgar' },
              { char: 'se stessi', pinyin: 'se stéssi', translation: 'A si mesmo' }
            ]
          },
          {
            id: "prince-it-7",
            characters: ["Se", "tu", "mi", "addomestichi", "avremo", "bisogno", "l'uno", "dell'altro"],
            pinyin: "se tu mi addoméstiki avrémo bizónyo lúno delláltro",
            translation: "Se tu me cativares, teremos necessidade um do outro.",
            category: "Ebook",
            difficulty: "Difícil",
            explanation: "Addomestichi (cativas) + avremo bisogno (teremos necessidade).",
            literalBreakdown: [
              { char: 'Se tu mi', pinyin: 'se tu mi', translation: 'Se tu me' },
              { char: 'addomestichi', pinyin: 'addoméstiki', translation: 'Cativares' },
              { char: 'avremo bisogno', pinyin: 'avrémo bizónyo', translation: 'Teremos necessidade' },
              { char: "l'uno dell'altro", pinyin: "lúno delláltro", translation: 'Um do outro' }
            ]
          },
          {
            id: "prince-it-8",
            characters: ["Le", "stelle", "sono", "belle", "per", "un", "fiore"],
            pinyin: "le stélle sóno bélle per un fióre",
            translation: "As estrelas são belas por causa de uma flor.",
            category: "Ebook",
            difficulty: "Fácil",
            explanation: "Stelle (estrelas) + belle (belas) + fiore (flor).",
            literalBreakdown: [
              { char: 'Le stelle', pinyin: 'le stélle', translation: 'As estrelas' },
              { char: 'sono belle', pinyin: 'sóno bélle', translation: 'São belas' },
              { char: 'per un fiore', pinyin: 'per un fióre', translation: 'Por uma flor' }
            ]
          },
          {
            id: "prince-it-9",
            characters: ["Si", "corre", "il", "rischio", "di", "piangere", "un", "po'"],
            pinyin: "si kórre il rískio di piándjere un po",
            translation: "Corre-se o risco de chorar um pouco.",
            category: "Ebook",
            difficulty: "Médio",
            explanation: "Corre il rischio (corre o risco) + piangere (chorar).",
            literalBreakdown: [
              { char: 'Si corre', pinyin: 'si kórre', translation: 'Corre-se' },
              { char: 'il rischio', pinyin: 'il rískio', translation: 'O risco' },
              { char: 'di piangere', pinyin: 'di piándjere', translation: 'De chorar' },
              { char: "un po'", pinyin: 'un po', translation: 'Um pouco' }
            ]
          },
          {
            id: "prince-it-10",
            characters: ["Il", "deserto", "è", "bello", "perché", "nasconde", "un", "pozzo"],
            pinyin: "il desérto è béllo perké naskónde un pótzo",
            translation: "O deserto é belo porque esconde um poço.",
            category: "Ebook",
            difficulty: "Médio",
            explanation: "Deserto (deserto) + nasconde (esconde) + pozzo (poço).",
            literalBreakdown: [
              { char: 'Il deserto', pinyin: 'il desérto', translation: 'O deserto' },
              { char: 'è bello', pinyin: 'è béllo', translation: 'É belo' },
              { char: 'perché nasconde', pinyin: 'perké naskónde', translation: 'Porque esconde' },
              { char: 'un pozzo', pinyin: 'un pótzo', translation: 'Um poço' }
            ]
          }
        ]
      }
    }
  },
  {
    id: 'fr',
    name: 'Francês',
    flag: '🇫🇷',
    ttsCode: 'fr-FR',
    phoneticLabel: 'PRONÚNCIA',
    description: 'Aprenda vocabulário e a elegante pronúncia do francês.',
    sentences: [
      {
        id: 'fr-1',
        characters: ['Bonjour,', 'comment', 'allez-vous', '?'],
        pinyin: 'bonjúr, comán alé-vú',
        translation: 'Bom dia, como você vai?',
        category: 'Saudações',
        difficulty: 'Fácil',
        explanation: 'Bonjour é a saudação formal mais tradicional na França.',
        literalBreakdown: [
          { char: 'Bonjour', pinyin: 'bonjúr', translation: 'Bom dia / Olá' },
          { char: 'comment', pinyin: 'comán', translation: 'Como' },
          { char: 'allez-vous', pinyin: 'alé-vú', translation: 'Você vai (formal)' }
        ]
      }
    ],
    preloadedBooks: {
      prince: {
        name: "Le Petit Prince (O Pequeno Príncipe)",
        sentences: [
          {
            id: "prince-fr-1",
            characters: ["On", "ne", "voit", "bien", "qu'avec", "le", "cœur"],
            pinyin: "on nê vuá biên cavéc lê cœr",
            translation: "Só se vê bem com o coração.",
            category: "Ebook",
            difficulty: "Médio",
            explanation: "Texto original do autor francês Antoine de Saint-Exupéry.",
            literalBreakdown: [
              { char: 'On ne voit bien', pinyin: 'on nê vuá biên', translation: 'A gente só vê bem' },
              { char: "qu'avec", pinyin: 'cavéc', translation: 'Com' },
              { char: 'le cœur', pinyin: 'lê cœr', translation: 'O coração' }
            ]
          },
          {
            id: "prince-fr-2",
            characters: ["L'essentiel", "est", "invisible", "pour", "les", "yeux"],
            pinyin: "lessansiél ê tinvisíbl púr lê iœ",
            translation: "O essencial é invisível aos olhos.",
            category: "Ebook",
            difficulty: "Médio",
            explanation: "Essentiel (essencial) + invisible (invisível) + yeux (olhos).",
            literalBreakdown: [
              { char: "L'essentiel", pinyin: "lessansiél", translation: 'O essencial' },
              { char: 'est invisible', pinyin: 'ê tinvisíbl', translation: 'É invisível' },
              { char: 'pour les yeux', pinyin: 'púr lê iœ', translation: 'Para os olhos' }
            ]
          },
          {
            id: "prince-fr-3",
            characters: ["C'est", "le", "temps", "que", "tu", "as", "perdu", "pour", "ta", "rose"],
            pinyin: "sê lê tán kê tu a perdú púr ta róz",
            translation: "Foi o tempo que você perdeu para a sua rosa.",
            category: "Ebook",
            difficulty: "Médio",
            explanation: "Temps (tempo) + perdu (dedicou/perdeu) + rose (rosa).",
            literalBreakdown: [
              { char: "C'est le temps", pinyin: "sê lê tán", translation: 'É o tempo' },
              { char: 'que tu as perdu', pinyin: 'kê tu a perdú', translation: 'Que você dedicou' },
              { char: 'pour ta rose', pinyin: 'púr ta róz', translation: 'Pela tua rosa' }
            ]
          },
          {
            id: "prince-fr-4",
            characters: ["Tu", "deviens", "responsable", "pour", "toujours", "de", "ta", "rose"],
            pinyin: "tu deviên responsábl púr tujúr dês ta róz",
            translation: "Tu te tornas eternamente responsável pela tua rosa.",
            category: "Ebook",
            difficulty: "Difícil",
            explanation: "Deviens (te tornas) + responsable (responsável) + toujours (sempre).",
            literalBreakdown: [
              { char: 'Tu deviens', pinyin: 'tu deviên', translation: 'Tu te tornas' },
              { char: 'responsable', pinyin: 'responsábl', translation: 'Responsável' },
              { char: 'pour toujours', pinyin: 'púr tujúr', translation: 'Para sempre' },
              { char: 'de ta rose', pinyin: 'dês ta róz', translation: 'Da tua rosa' }
            ]
          },
          {
            id: "prince-fr-5",
            characters: ["Toutes", "les", "grandes", "personnes", "ont", "été", "des", "enfants"],
            pinyin: "tút lê gránd pèrsón on têtê dê zânfán",
            translation: "Todas as pessoas grandes foram primeiro crianças.",
            category: "Ebook",
            difficulty: "Fácil",
            explanation: "Grandes personnes (adultos) + enfants (crianças).",
            literalBreakdown: [
              { char: 'Toutes les', pinyin: 'tút lê', translation: 'Todas as' },
              { char: 'grandes personnes', pinyin: 'gránd pèrsón', translation: 'Pessoas grandes' },
              { char: 'ont été enfants', pinyin: 'on têtê zânfán', translation: 'Foram crianças' }
            ]
          },
          {
            id: "prince-fr-6",
            characters: ["Il", "est", "bien", "plus", "difficile", "de", "se", "juger", "soi-même"],
            pinyin: "il ê biên plú difisíl dês sês jujê suá-mêm",
            translation: "É muito mais difícil julgar a si mesmo.",
            category: "Ebook",
            difficulty: "Médio",
            explanation: "Plus difficile (mais difícil) + juger soi-même (julgar a si mesmo).",
            literalBreakdown: [
              { char: 'Il est bien plus', pinyin: 'il ê biên plú', translation: 'É muito mais' },
              { char: 'difficile', pinyin: 'difisíl', translation: 'Difícil' },
              { char: 'de se juger', pinyin: 'dês sês jujê', translation: 'De julgar-se' },
              { char: 'soi-même', pinyin: 'suá-mêm', translation: 'A si mesmo' }
            ]
          },
          {
            id: "prince-fr-7",
            characters: ["Si", "tu", "m'apprivoises", "nous", "aurons", "besoin", "l'un", "de", "l'autre"],
            pinyin: "si tu maprivuáz nú zorón bêzuên lân dês lótr",
            translation: "Se tu me cativares, teremos necessidade um do outro.",
            category: "Ebook",
            difficulty: "Difícil",
            explanation: "Apprivoises (cativas) + besoin (necessidade).",
            literalBreakdown: [
              { char: 'Si tu m\'apprivoises', pinyin: 'si tu maprivuáz', translation: 'Se tu me cativares' },
              { char: 'nous aurons besoin', pinyin: 'nú zorón bêzuên', translation: 'Nós teremos necessidade' },
              { char: 'l\'un de l\'autre', pinyin: 'lân dês lótr', translation: 'Um do outro' }
            ]
          },
          {
            id: "prince-fr-8",
            characters: ["Les", "étoiles", "sont", "belles", "à", "cause", "d'une", "fleur"],
            pinyin: "lê zêtuál son bèl a kóz dún flœr",
            translation: "As estrelas são belas por causa de uma flor.",
            category: "Ebook",
            difficulty: "Fácil",
            explanation: "Étoiles (estrelas) + belles (belas) + fleur (flor).",
            literalBreakdown: [
              { char: 'Les étoiles', pinyin: 'lê zêtuál', translation: 'As estrelas' },
              { char: 'sont belles', pinyin: 'son bèl', translation: 'São belas' },
              { char: 'à cause d\'une fleur', pinyin: 'a kóz dún flœr', translation: 'Por causa de uma flor' }
            ]
          },
          {
            id: "prince-fr-9",
            characters: ["On", "court", "le", "risque", "de", "pleurer", "un", "peu"],
            pinyin: "on kúr lê rísk dês plœrê ân pœ",
            translation: "Corre-se o risco de chorar um pouco.",
            category: "Ebook",
            difficulty: "Médio",
            explanation: "Court le risque (corre o risco) + pleurer (chorar).",
            literalBreakdown: [
              { char: 'On court', pinyin: 'on kúr', translation: 'A gente corre' },
              { char: 'le risque', pinyin: 'lê rísk', translation: 'O risco' },
              { char: 'de pleurer', pinyin: 'dês plœrê', translation: 'De chorar' },
              { char: 'un peu', pinyin: 'ân pœ', translation: 'Um pouco' }
            ]
          },
          {
            id: "prince-fr-10",
            characters: ["Le", "désert", "est", "beau", "car", "il", "cache", "un", "puits"],
            pinyin: "lê dêzêr ê bó kar il kash ân puí",
            translation: "O deserto é belo porque esconde um poço.",
            category: "Ebook",
            difficulty: "Médio",
            explanation: "Désert (deserto) + cache (esconde) + puits (poço).",
            literalBreakdown: [
              { char: 'Le désert', pinyin: 'lê dêzêr', translation: 'O deserto' },
              { char: 'est beau', pinyin: 'ê bó', translation: 'É belo' },
              { char: 'car il cache', pinyin: 'kar il kash', translation: 'Porque esconde' },
              { char: 'un puits', pinyin: 'ân puí', translation: 'Um poço' }
            ]
          }
        ]
      }
    }
  }
];

export const DEFAULT_LANGUAGE = LANGUAGES[0];
