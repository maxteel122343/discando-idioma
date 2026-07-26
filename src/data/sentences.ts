import { Sentence } from '../types';

export const SENTENCES: Sentence[] = [
  {
    id: 's1',
    characters: ['你', '好', '吗'],
    pinyin: 'Nǐ hǎo ma?',
    translation: 'Como você está?',
    category: 'Saudações',
    difficulty: 'Fácil',
    explanation: 'A frase de saudação mais comum em chinês. É formada por 你 (você) + 好 (bem/bom) + 吗 (partícula de interrogação).',
    literalBreakdown: [
      { char: '你', pinyin: 'nǐ', translation: 'Você' },
      { char: '好', pinyin: 'hǎo', translation: 'Bem / Bom' },
      { char: '吗', pinyin: 'ma', translation: 'Partícula de pergunta' }
    ]
  },
  {
    id: 's2',
    characters: ['我', '学习', '中文'],
    pinyin: 'Wǒ xuéxí zhōngwén.',
    translation: 'Eu estudo chinês.',
    category: 'Estudo',
    difficulty: 'Médio',
    explanation: 'Mostra a estrutura básica de frase: Sujeito (我) + Verbo (学习) + Objeto (中文).',
    literalBreakdown: [
      { char: '我', pinyin: 'wǒ', translation: 'Eu' },
      { char: '学习', pinyin: 'xuéxí', translation: 'Estudar / Aprendizado' },
      { char: '中文', pinyin: 'zhōngwén', translation: 'Língua Chinesa (escrita)' }
    ]
  },
  {
    id: 's3',
    characters: ['他', '去', '喝', '咖啡'],
    pinyin: 'Tā qù hē kāfēi.',
    translation: 'Ele vai beber café.',
    category: 'Alimentos & Bebidas',
    difficulty: 'Médio',
    explanation: 'Uma frase de dupla ação: Ele vai (去) e bebe (喝) café (咖啡). Não precisa de conectivo entre verbos.',
    literalBreakdown: [
      { char: '他', pinyin: 'tā', translation: 'Ele' },
      { char: '去', pinyin: 'qù', translation: 'Ir' },
      { char: '喝', pinyin: 'hē', translation: 'Beber' },
      { char: '咖啡', pinyin: 'kāfēi', translation: 'Café' }
    ]
  },
  {
    id: 's4',
    characters: ['再见'],
    pinyin: 'Zàijiàn.',
    translation: 'Adeus / Até logo.',
    category: 'Saudações',
    difficulty: 'Fácil',
    explanation: 'Literalmente significa "Ver novamente". 再 (novamente) + 见 (ver/encontrar).',
    literalBreakdown: [
      { char: '再', pinyin: 'zài', translation: 'Novamente' },
      { char: '见', pinyin: 'jiàn', translation: 'Ver / Encontrar' }
    ]
  },
  {
    id: 's5',
    characters: ['早上好'],
    pinyin: 'Zǎoshang hǎo.',
    translation: 'Bom dia.',
    category: 'Saudações',
    difficulty: 'Fácil',
    explanation: 'Usado de manhã cedo. 早上 significa "manhã" e 好 significa "bom".',
    literalBreakdown: [
      { char: '早上', pinyin: 'zǎoshang', translation: 'Manhã' },
      { char: '好', pinyin: 'hǎo', translation: 'Bom / Bem' }
    ]
  },
  {
    id: 's6',
    characters: ['我', '不', '喝', '咖啡'],
    pinyin: 'Wǒ bù hē kāfēi.',
    translation: 'Eu não bebo café.',
    category: 'Alimentos & Bebidas',
    difficulty: 'Médio',
    explanation: 'Para negar um verbo no presente ou futuro, adicionamos 不 (bù) antes do verbo principal 喝 (hē).',
    literalBreakdown: [
      { char: '我', pinyin: 'wǒ', translation: 'Eu' },
      { char: '不', pinyin: 'bù', translation: 'Não' },
      { char: '喝', pinyin: 'hē', translation: 'Beber' },
      { char: '咖啡', pinyin: 'kāfēi', translation: 'Café' }
    ]
  },
  {
    id: 's7',
    characters: ['我', '去', '吃饭'],
    pinyin: 'Wǒ qù chīfàn.',
    translation: 'Eu vou comer / fazer uma refeição.',
    category: 'Alimentos & Bebidas',
    difficulty: 'Fácil',
    explanation: '吃饭 (chīfàn) é um verbo composto (verbo-objeto) muito comum que significa comer (吃) arroz/comida (饭).',
    literalBreakdown: [
      { char: '我', pinyin: 'wǒ', translation: 'Eu' },
      { char: '去', pinyin: 'qù', translation: 'Ir' },
      { char: '吃饭', pinyin: 'chīfàn', translation: 'Comer / Fazer refeição' }
    ]
  },
  {
    id: 's8',
    characters: ['中文', '不', '难'],
    pinyin: 'Zhōngwén bù nán.',
    translation: 'Chinês não é difícil.',
    category: 'Estudo',
    difficulty: 'Fácil',
    explanation: 'Em chinês, adjetivos (como 难 - difícil) funcionam como verbos estativos, não precisando do verbo "ser" (是).',
    literalBreakdown: [
      { char: '中文', pinyin: 'zhōngwén', translation: 'Língua Chinesa' },
      { char: '不', pinyin: 'bù', translation: 'Não' },
      { char: '难', pinyin: 'nán', translation: 'Difícil' }
    ]
  },
  {
    id: 's9',
    characters: ['谢谢', '你'],
    pinyin: 'Xièxie nǐ.',
    translation: 'Obrigado(a) a você.',
    category: 'Saudações',
    difficulty: 'Fácil',
    explanation: 'A forma clássica de agradecer. 谢谢 (agradecer) + 你 (você).',
    literalBreakdown: [
      { char: '谢谢', pinyin: 'xièxie', translation: 'Obrigado(a)' },
      { char: '你', pinyin: 'nǐ', translation: 'Você' }
    ]
  },
  {
    id: 's10',
    characters: ['他', '是', '我', '的', '老师'],
    pinyin: 'Tā shì wǒ de lǎoshī.',
    translation: 'Ele é meu professor.',
    category: 'Cotidiano',
    difficulty: 'Difícil',
    explanation: 'O conector 的 (de) indica posse, transformando 我 (eu) em "meu" (我的). 是 (shì) é o verbo ser.',
    literalBreakdown: [
      { char: '他', pinyin: 'tā', translation: 'Ele' },
      { char: '是', pinyin: 'shì', translation: 'Ser / É' },
      { char: '我', pinyin: 'wǒ', translation: 'Eu' },
      { char: '的', pinyin: 'de', translation: 'Partícula possessiva' },
      { char: '老师', pinyin: 'lǎoshī', translation: 'Professor' }
    ]
  },
  {
    id: 's11',
    characters: ['今天', '天气', '很', '好'],
    pinyin: 'Jīntiān tiānqì hěn hǎo.',
    translation: 'Hoje o tempo está muito bom.',
    category: 'Cotidiano',
    difficulty: 'Difícil',
    explanation: 'Dizemos "Hoje (今天) clima (天气) muito (很) bom (好)". O adjetivo "好" exige o intensificador "很" na frase afirmativa simples.',
    literalBreakdown: [
      { char: '今天', pinyin: 'jīntiān', translation: 'Hoje' },
      { char: '天气', pinyin: 'tiānqì', translation: 'Clima / Tempo' },
      { char: '很', pinyin: 'hěn', translation: 'Muito' },
      { char: '好', pinyin: 'hǎo', translation: 'Bom / Bem' }
    ]
  },
  {
    id: 's12',
    characters: ['苹果', '很', '好吃'],
    pinyin: 'Píngguǒ hěn hǎochī.',
    translation: 'A maçã é muito saborosa.',
    category: 'Alimentos & Bebidas',
    difficulty: 'Médio',
    explanation: '苹果 significa maçã. 好吃 significa saboroso (lit. bom para comer).',
    literalBreakdown: [
      { char: '苹果', pinyin: 'píngguǒ', translation: 'Maçã' },
      { char: '很', pinyin: 'hěn', translation: 'Muito' },
      { char: '好吃', pinyin: 'hǎochī', translation: 'Gostoso / Saboroso' }
    ]
  }
];

export const ALL_CATEGORIES = ['Todos', 'Saudações', 'Alimentos & Bebidas', 'Estudo', 'Cotidiano'];

// Extra words that can act as distractors or add variety
export const DISTRACTOR_WORDS = [
  '了', '的', '不', '吗', '上', '早', '学', '饭', '喝', '去', '我', '他', '是'
];
