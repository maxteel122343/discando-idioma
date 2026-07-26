import { Sentence } from '../types';

export interface SongTrack {
  id: string;
  title: string;
  artist: string;
  coverEmoji: string;
  coverGradient: string;
  language: string;
  sentences: Sentence[];
  audioUrl?: string; // Optional custom HTML5 audio or synth
  isCustom?: boolean;
  isHidden?: boolean; // When true, this song is hidden from the playlist UI (used to hide test/prototype songs)
}

export const PRESET_SONGS: SongTrack[] = [
  {
    id: 'song-someone-like-you',
    title: 'Someone Like You',
    artist: 'Adele',
    coverEmoji: '💔',
    coverGradient: 'from-gray-600 to-blue-900',
    language: 'Inglês',
    audioUrl: '/someone-like-you.mp3',
    sentences: [
      {
        id: 'sly-1',
        characters: ['I', 'heard', 'that', 'you\'re', 'settled', 'down'],
        pinyin: 'ái hérd dét iúr sételd dáun',
        translation: 'Ouvi dizer que você sossegou / se estabeleceu.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Heard é o passado de hear (ouvir). Settled down é um phrasal verb que significa se estabelecer ou sossegar na vida.'
      },
      {
        id: 'sly-2',
        characters: ['That', 'you', 'found', 'a', 'girl', 'and', 'you\'re', 'married', 'now'],
        pinyin: 'dét iú fáund e gârl énd iúr mérid náu',
        translation: 'Que você encontrou uma garota e agora está casado.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Found é o passado de find (encontrar). Married significa casado(a).'
      },
      {
        id: 'sly-3',
        characters: ['I', 'heard', 'that', 'your', 'dreams', 'came', 'true'],
        pinyin: 'ái hérd dét iór dríms kéim trú',
        translation: 'Ouvi dizer que os seus sonhos se realizaram.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Dreams came true vem da expressão come true (tornar-se realidade/realizar-se).'
      },
      {
        id: 'sly-4',
        characters: ['Guess', 'she', 'gave', 'you', 'things', 'I', 'didn\'t', 'give', 'to', 'you'],
        pinyin: 'ghés chí ghéiv iú tíngs ái dídnt ghív tu iú',
        translation: 'Acho que ela te deu coisas que eu não te dei.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Guess (adivinhar/achar). Didn\'t give é a negação no passado para dar (give).'
      },
      {
        id: 'sly-5',
        characters: ['Old', 'friend', 'why', 'are', 'you', 'so', 'shy'],
        pinyin: 'óuld frénd uái ár iú sóu chái',
        translation: 'Velho amigo, por que você está tão tímido?',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Old friend (velho amigo). Shy significa tímido ou envergonhado.'
      },
      {
        id: 'sly-6',
        characters: ['Ain\'t', 'like', 'you', 'to', 'hold', 'back', 'or', 'hide', 'from', 'the', 'light'],
        pinyin: 'éint láik iú tu hóuld bék ór háid fróm de láit',
        translation: 'Não é do seu feitio se conter ou se esconder da luz.',
        category: 'Música',
        difficulty: 'Difícil',
        explanation: 'Ain\'t é uma contração informal para isn\'t/aren\'t/am not. Hold back (conter-se). Hide (esconder).'
      },
      {
        id: 'sly-7',
        characters: ['I', 'hate', 'to', 'turn', 'up', 'out', 'of', 'the', 'blue', 'uninvited'],
        pinyin: 'ái héit tu târn áp áut óv de blú an-inváited',
        translation: 'Eu odeio aparecer do nada, sem ser convidada.',
        category: 'Música',
        difficulty: 'Difícil',
        explanation: 'Turn up significa aparecer. Out of the blue (do nada). Uninvited (sem convite/não convidada).'
      },
      {
        id: 'sly-8',
        characters: ['But', 'I', 'couldn\'t', 'stay', 'away', 'I', 'couldn\'t', 'fight', 'it'],
        pinyin: 'bât ái cúdnt stéi auéi ái cúdnt fáit it',
        translation: 'Mas eu não consegui ficar longe, eu não pude lutar contra isso.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Couldn\'t é a negação no passado de can (não poder/não conseguir). Stay away (ficar longe).'
      },
      {
        id: 'sly-9',
        characters: ['I', 'had', 'hoped', 'you\'d', 'see', 'my', 'face', 'and', 'that', 'you\'d', 'be', 'reminded'],
        pinyin: 'ái héd hóupt iúd sí mái féis énd dét iúd bí rimáinded',
        translation: 'Eu esperava que você visse meu rosto e que se lembrasse.',
        category: 'Música',
        difficulty: 'Difícil',
        explanation: 'Had hoped (tinha esperança). You\'d é a contração de you would. Reminded (lembrado).'
      },
      {
        id: 'sly-10',
        characters: ['That', 'for', 'me', 'it', 'isn\'t', 'over'],
        pinyin: 'dét fór mí it íznt óuver',
        translation: 'Que, para mim, não acabou.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Isn\'t over significa não acabou / não terminou.'
      },
      {
        id: 'sly-11',
        characters: ['Never', 'mind', 'I\'ll', 'find', 'someone', 'like', 'you'],
        pinyin: 'néver máind áil fáind sámuan láik iú',
        translation: 'Deixa para lá, eu vou encontrar alguém como você.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Never mind é uma expressão muito comum para dizer deixa para lá ou não importa. Someone like you (alguém como você).'
      },
      {
        id: 'sly-12',
        characters: ['I', 'wish', 'nothing', 'but', 'the', 'best', 'for', 'you', 'too'],
        pinyin: 'ái uích náting bât de bést fór iú tú',
        translation: 'Não desejo nada além do melhor para você também.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Wish (desejar). Nothing but significa nada além de / apenas. Too significa também.'
      },
      {
        id: 'sly-13',
        characters: ['Don\'t', 'forget', 'me', 'I', 'beg', 'I', 'remember', 'you', 'said'],
        pinyin: 'dōnt forghét mí ái bég ái rimémber iú séd',
        translation: 'Não se esqueça de mim, eu imploro, eu lembro que você disse.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Don\'t forget (não esqueça). Beg (implorar/pedir). Said é o passado de say (dizer).'
      },
      {
        id: 'sly-14',
        characters: ['Sometimes', 'it', 'lasts', 'in', 'love', 'but', 'sometimes', 'it', 'hurts', 'instead'],
        pinyin: 'sámtáims it lésts ín láv bât sámtáims it hârts ínstéd',
        translation: 'Às vezes dura no amor, mas às vezes machuca em vez disso.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Lasts (dura, do verbo to last). Hurts (machuca, do verbo to hurt). Instead significa em vez disso / ao invés.'
      },
      {
        id: 'sly-15',
        characters: ['You', 'know', 'how', 'the', 'time', 'flies'],
        pinyin: 'iú nóu háu de táim fláis',
        translation: 'Você sabe como o tempo voa.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'How the time flies é uma expressão idiomática que significa "como o tempo voa/passa rápido".'
      },
      {
        id: 'sly-16',
        characters: ['Only', 'yesterday', 'was', 'the', 'time', 'of', 'our', 'lives'],
        pinyin: 'ónli iésterdei uóz de táim óv áuar láivs',
        translation: 'Ainda ontem foi o melhor momento das nossas vidas.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Only yesterday (apenas ontem / ainda ontem). Time of our lives significa o melhor período de nossas vidas.'
      },
      {
        id: 'sly-17',
        characters: ['We', 'were', 'born', 'and', 'raised', 'in', 'a', 'summer', 'haze'],
        pinyin: 'uí uêr bórn énd réizd ín e sámer héiz',
        translation: 'Nós nascemos e fomos criados em uma névoa de verão.',
        category: 'Música',
        difficulty: 'Difícil',
        explanation: 'Born and raised (nascidos e criados). Haze (névoa/bruma).'
      },
      {
        id: 'sly-18',
        characters: ['Bound', 'by', 'the', 'surprise', 'of', 'our', 'glory', 'days'],
        pinyin: 'báund bái de sârprais óv áuar glóri déis',
        translation: 'Unidos pela surpresa dos nossos dias de glória.',
        category: 'Música',
        difficulty: 'Difícil',
        explanation: 'Bound (ligados/unidos). Glory days significa dias de glória / tempos dourados.'
      },
      {
        id: 'sly-19',
        characters: ['Nothing', 'compares', 'no', 'worries', 'or', 'cares'],
        pinyin: 'náting compérs nóu uâris ór kérs',
        translation: 'Nada se compara, sem preocupações ou cuidados.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Compares (compara). Worries (preocupações). Cares (cuidados/aflições).'
      },
      {
        id: 'sly-20',
        characters: ['Regrets', 'and', 'mistakes', 'they\'re', 'memories', 'made'],
        pinyin: 'rigréts énd mistéiks déir mémoris méid',
        translation: 'Arrependimentos e erros, eles são memórias feitas.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Regrets (arrependimentos). Mistakes (erros). They\'re é a contração de they are.'
      },
      {
        id: 'sly-21',
        characters: ['Who', 'would', 'have', 'known', 'how', 'bittersweet', 'this', 'would', 'taste'],
        pinyin: 'hú uúd hév nóun háu bítersuít dís uúd téist',
        translation: 'Quem saberia o quão agridoce seria esse gosto?',
        category: 'Música',
        difficulty: 'Difícil',
        explanation: 'Would have known (saberia / teria sabido). Bittersweet (agridoce). Taste (gosto/sabor).'
      },
      {
        id: 'sly-22',
        characters: ['Never', 'mind', 'I\'ll', 'find', 'someone', 'like', 'you'],
        pinyin: 'néver máind áil fáind sámuan láik iú',
        translation: 'Deixa para lá, eu vou encontrar alguém como você.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Never mind é uma expressão muito comum para dizer deixa para lá ou não importa. Someone like you (alguém como você).'
      },
      {
        id: 'sly-23',
        characters: ['I', 'wish', 'nothing', 'but', 'the', 'best', 'for', 'you'],
        pinyin: 'ái uích náting bât de bést fór iú',
        translation: 'Não desejo nada além do melhor para você.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Wish (desejar). Nothing but (nada além de / apenas).'
      },
      {
        id: 'sly-24',
        characters: ['Don\'t', 'forget', 'me', 'I', 'beg', 'I', 'remember', 'you', 'said'],
        pinyin: 'dōnt forghét mí ái bég ái rimémber iú séd',
        translation: 'Não se esqueça de mim, eu imploro, eu lembro que você disse.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Don\'t forget (não esqueça). Beg (implorar/pedir). Said é o passado de say (dizer).'
      },
      {
        id: 'sly-25',
        characters: ['Sometimes', 'it', 'lasts', 'in', 'love', 'but', 'sometimes', 'it', 'hurts', 'instead'],
        pinyin: 'sámtáims it lésts ín láv bât sámtáims it hârts ínstéd',
        translation: 'Às vezes dura no amor, mas às vezes machuca em vez disso.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Lasts (dura). Hurts (machuca). Instead (em vez disso).'
      },
      {
        id: 'sly-26',
        characters: ['Never', 'mind', 'I\'ll', 'find', 'someone', 'like', 'you'],
        pinyin: 'néver máind áil fáind sámuan láik iú',
        translation: 'Deixa para lá, eu vou encontrar alguém como você.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Never mind é uma expressão muito comum para dizer deixa para lá ou não importa. Someone like you (alguém como você).'
      },
      {
        id: 'sly-27',
        characters: ['I', 'wish', 'nothing', 'but', 'the', 'best', 'for', 'you', 'too'],
        pinyin: 'ái uích náting bât de bést fór iú tú',
        translation: 'Não desejo nada além do melhor para você também.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Wish (desejar). Nothing but (nada além de / apenas). Too (também).'
      },
      {
        id: 'sly-28',
        characters: ['Don\'t', 'forget', 'me', 'I', 'beg', 'I', 'remember', 'you', 'said'],
        pinyin: 'dōnt forghét mí ái bég ái rimémber iú séd',
        translation: 'Não se esqueça de mim, eu imploro, eu lembro que você disse.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Don\'t forget (não esqueça). Beg (implorar/pedir). Said é o passado de say (dizer).'
      },
      {
        id: 'sly-29',
        characters: ['Sometimes', 'it', 'lasts', 'in', 'love', 'but', 'sometimes', 'it', 'hurts', 'instead'],
        pinyin: 'sámtáims it lésts ín láv bât sámtáims it hârts ínstéd',
        translation: 'Às vezes dura no amor, mas às vezes machuca em vez disso.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Lasts (dura). Hurts (machuca). Instead (em vez disso).'
      },
      {
        id: 'sly-30',
        characters: ['Sometimes', 'it', 'lasts', 'in', 'love', 'but', 'sometimes', 'it', 'hurts', 'instead'],
        pinyin: 'sámtáims it lésts ín láv bât sámtáims it hârts ínstéd',
        translation: 'Às vezes dura no amor, mas às vezes machuca em vez disso.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Lasts (dura). Hurts (machuca). Instead (em vez disso).'
      }
    ]
  },
  {
    id: 'song-tian-mimi',
    title: '甜蜜蜜 (Tian Mi Mi)',
    artist: 'Teresa Teng (邓丽君)',
    coverEmoji: '🍯',
    coverGradient: 'from-amber-400 to-rose-400',
    language: 'Chinês Mandarim',
    isHidden: true, // Prototype/test song — hidden from UI
    sentences: [
      {
        id: 'tm-1',
        characters: ['甜蜜蜜', '你', '笑', '得', '甜蜜蜜'],
        pinyin: 'Tián mìmì nǐ xiào de tián mìmì.',
        translation: 'Doce como mel, você sorri tão docemente.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: '甜蜜蜜 (doce como mel) + 你 (você) + 笑得 (sorri de forma) + 甜蜜蜜 (muito doce).'
      },
      {
        id: 'tm-2',
        characters: ['好像', '花儿', '开', '在', '春风', '里'],
        pinyin: 'Hǎoxiàng huāer kāi zài chūnfēng lǐ.',
        translation: 'Parece uma flor desabrochando na brisa da primavera.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: '好像 (parece) + 花儿 (flor) + 开在 (desabrochar em) + 春风里 (na brisa da primavera).'
      },
      {
        id: 'tm-3',
        characters: ['在', '哪里', '在', '哪里', '见过', '你'],
        pinyin: 'Zài nǎlǐ zài nǎlǐ jiànguò nǐ.',
        translation: 'Onde foi, onde foi que eu já te vi?',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: '在哪里 (onde) + 见过 (já ter visto) + 你 (você).'
      },
      {
        id: 'tm-4',
        characters: ['你', '的', '笑容', '这样', '熟悉'],
        pinyin: 'Nǐ de xiàoróng zhèyàng shúxī.',
        translation: 'Seu sorriso é tão familiar.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: '你的 (seu) + 笑容 (sorriso) + 这样 (assim/tão) + 熟悉 (familiar).'
      },
      {
        id: 'tm-5',
        characters: ['我', '一时', '想', '不', '起'],
        pinyin: 'Wǒ yīshí xiǎng bù qǐ.',
        translation: 'Por um momento não consigo me lembrar.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: '我 (eu) + 一时 (por um momento) + 想不起 (não consigo lembrar).'
      },
      {
        id: 'tm-6',
        characters: ['啊', '在', '梦里'],
        pinyin: 'A, zài mèng lǐ.',
        translation: 'Ah, foi num sonho!',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: '在 (em) + 梦里 (no sonho).'
      },
      {
        id: 'tm-7',
        characters: ['梦里', '梦里', '见过', '你'],
        pinyin: 'Mèng lǐ mèng lǐ jiànguò nǐ.',
        translation: 'Num sonho, num sonho eu vi você.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: '梦里 (no sonho) + 见过你 (já vi você).'
      },
      {
        id: 'tm-8',
        characters: ['甜美', '的', '笑容', '这', '是', '你'],
        pinyin: 'Tiánměi de xiàoróng zhè shì nǐ.',
        translation: 'Aquele sorriso doce, era você!',
        category: 'Música',
        difficulty: 'Médio',
        explanation: '甜美的 (doce) + 笑容 (sorriso) + 这是你 (era você).'
      }
    ]
  },
  {
    id: 'song-moon-heart',
    title: '月亮代表我的心 (A Lua Representa Meu Coração)',
    artist: 'Teresa Teng (邓丽君)',
    coverEmoji: '🌙',
    coverGradient: 'from-indigo-500 to-purple-600',
    language: 'Chinês Mandarim',
    isHidden: true, // Prototype/test song — hidden from UI
    sentences: [
      {
        id: 'mh-1',
        characters: ['你', '问', '我', '爱', '你', '有', '多', '深'],
        pinyin: 'Nǐ wèn wǒ ài nǐ yǒu duō shēn.',
        translation: 'Você me pergunta o quanto eu te amo.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: '你问我 (você me pergunta) + 爱你 (te amo) + 有多深 (o quão profundo).'
      },
      {
        id: 'mh-2',
        characters: ['我', '爱', '你', '有', '几', '分'],
        pinyin: 'Wǒ ài nǐ yǒu jǐ fēn.',
        translation: 'O quanto é forte o meu amor por você.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: '我爱你 (eu te amo) + 有几分 (em qual medida/pontuação).'
      },
      {
        id: 'mh-3',
        characters: ['我', '的', '情', '不', '移'],
        pinyin: 'Wǒ de qíng bù yí.',
        translation: 'Meu afeto não muda.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: '我的 (meu) + 情 (afeto/sentimento) + 不移 (não se move/não muda).'
      },
      {
        id: 'mh-4',
        characters: ['我', '的', '爱', '不', '变'],
        pinyin: 'Wǒ de ài bù biàn.',
        translation: 'Meu amor nunca muda.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: '我的 (meu) + 爱 (amor) + 不变 (não muda).'
      },
      {
        id: 'mh-5',
        characters: ['月亮', '代表', '我', '的', '心'],
        pinyin: 'Yuèliang dàibiǎo wǒ de xīn.',
        translation: 'A lua representa o meu coração.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: '月亮 (lua) + 代表 (representa) + 我的心 (meu coração).'
      },
      {
        id: 'mh-6',
        characters: ['轻轻', '的', '一', '个', '吻'],
        pinyin: 'Qīngqīng de yī gè wěn.',
        translation: 'Um beijo bem suave.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: '轻轻的 (suavemente) + 一个吻 (um beijo).'
      },
      {
        id: 'mh-7',
        characters: ['已经', '打动', '我', '的', '心'],
        pinyin: 'Yǐjīng dǎdòng wǒ de xīn.',
        translation: 'Já tocou profundamente o meu coração.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: '已经 (já) + 打动 (emocionou/tocou) + 我的心 (meu coração).'
      }
    ]
  },
  {
    id: 'song-sunshine',
    title: 'You Are My Sunshine',
    artist: 'Johnny Cash / Standard',
    coverEmoji: '☀️',
    coverGradient: 'from-amber-300 to-orange-500',
    language: 'Inglês',
    isHidden: true, // Prototype/test song — hidden from UI
    sentences: [
      {
        id: 'sun-1',
        characters: ['You', 'are', 'my', 'sunshine', 'my', 'only', 'sunshine'],
        pinyin: 'iú ár mái sánsháin mái ónli sánsháin',
        translation: 'Você é meu raio de sol, meu único raio de sol.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Sunshine (raio de sol) + Only (único).'
      },
      {
        id: 'sun-2',
        characters: ['You', 'make', 'me', 'happy', 'when', 'skies', 'are', 'gray'],
        pinyin: 'iú méik mí hépi uén skáis ár gréi',
        translation: 'Você me faz feliz quando os céus estão cinzentos.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Make me happy (me faz feliz) + Skies are gray (céus cinzentos).'
      },
      {
        id: 'sun-3',
        characters: ['You\'ll', 'never', 'know', 'dear', 'how', 'much', 'I', 'love', 'you'],
        pinyin: 'iúl néver nóu dír háu mátch ái láv iú',
        translation: 'Você nunca saberá, querido(a), o quanto eu te amo.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Never know (nunca saberá) + How much (o quanto).'
      },
      {
        id: 'sun-4',
        characters: ['Please', 'don\'t', 'take', 'my', 'sunshine', 'away'],
        pinyin: 'plíz dōnt téik mái sánsháin auéi',
        translation: 'Por favor, não leve meu raio de sol embora.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Take away (levar embora).'
      }
    ]
  },
  {
    id: 'song-guantanamera',
    title: 'Guantanamera',
    artist: 'Joseíto Fernández',
    coverEmoji: '🌴',
    coverGradient: 'from-emerald-400 to-teal-600',
    language: 'Espanhol',
    isHidden: true, // Prototype/test song — hidden from UI
    sentences: [
      {
        id: 'gt-1',
        characters: ['Guantanamera', 'guajira', 'guantanamera'],
        pinyin: 'guantanamera guajira guantanamera',
        translation: 'Guantanamera, camponesa guantanamera.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Guajira (camponesa de Cuba).'
      },
      {
        id: 'gt-2',
        characters: ['Yo', 'soy', 'un', 'hombre', 'sincero'],
        pinyin: 'ió sói un ómbre sinséro',
        translation: 'Eu sou um homem sincero.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Hombre (homem) + Sincero (sincero).'
      },
      {
        id: 'gt-3',
        characters: ['De', 'donde', 'crece', 'la', 'palma'],
        pinyin: 'de dónde krése la pálma',
        translation: 'De onde cresce a palmeira.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Donde crece (onde cresce) + Palma (palmeira).'
      },
      {
        id: 'gt-4',
        characters: ['Y', 'antes', 'de', 'morirme', 'quiero'],
        pinyin: 'i ántes de morírme kiéro',
        translation: 'E antes de morrer eu quero.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Antes de morirme (antes de eu morrer) + Quiero (quero).'
      },
      {
        id: 'gt-5',
        characters: ['Echar', 'mis', 'versos', 'del', 'alma'],
        pinyin: 'etchár mis vérsos del álma',
        translation: 'Soltar meus versos da alma.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Echar (lançar/soltar) + Versos del alma (versos da alma).'
      }
    ]
  }
];
