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
    id: 'song-formidable',
    title: 'Formidable',
    artist: 'Stromae',
    coverEmoji: '🍷',
    coverGradient: 'from-amber-700 to-red-900',
    language: 'Francês',
    audioUrl: '/(melody.az) 225 - Formidable.mp3',
    sentences: [
      {
        id: 'for-1',
        characters: ['Tu', 'étais', 'formidable', 'j\'étais', 'fort', 'minable'],
        pinyin: 'tu etais formidable j\'etais fort minable',
        translation: 'Você era formidável, eu era muito lamentável.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Étais é o imperfeito do verbo être (ser/estar). Minable significa lamentável, insignificante ou miserável.'
      },
      {
        id: 'for-2',
        characters: ['Nous', 'étions', 'formidables'],
        pinyin: 'nous etions formidables',
        translation: 'Nós éramos formidáveis.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Étions é o imperfeito do verbo être na primeira pessoa do plural (nós éramos/estávamos).'
      },
      {
        id: 'for-3',
        characters: ['J\'vais', 'pas', 'vous', 'draguer', 'promis', 'juré'],
        pinyin: 'j\'vais pas vous draguer promis jure',
        translation: 'Eu não vou dar em cima de você, prometido e jurado.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Draguer é uma gíria francesa muito comum que significa paquerar ou xavecar.'
      },
      {
        id: 'for-4',
        characters: ['J\'suis', 'célibataire', 'depuis', 'hier'],
        pinyin: 'j\'suis celibataire depuis hier',
        translation: 'Estou solteiro desde ontem.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Célibataire significa solteiro(a). Depuis significa desde.'
      },
      {
        id: 'for-5',
        characters: ['Tu', 't\'es', 'regardé', 'tu', 't\'crois', 'beau'],
        pinyin: 'tu t\'es regarde tu t\'crois beau',
        translation: 'Você já se olhou? Você se acha bonito?',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'T\'crois é a contração de te crois (se acha/se acredita). Beau significa belo ou bonito.'
      },
      {
        id: 'for-6',
        characters: ['Elle', 'va', 't\'larguer', 'comme', 'elles', 'le', 'font'],
        pinyin: 'elle va t\'larguer comme elles le font',
        translation: 'Ela vai te largar como elas fazem.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Larguer é um verbo informal que significa abandonar ou dar um fora em alguém.'
      },
      {
        id: 'for-7',
        characters: ['Dans', 'la', 'vie', 'y\'a', 'ni', 'méchant', 'ni', 'gentil'],
        pinyin: 'dans la vie y\'a ni mechant ni gentil',
        translation: 'Na vida não há nem vilão nem bonzinho.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Y\'a é a contração falada de il y a (existe/há). Ni... ni significa nem... nem.'
      }
    ]
  },
  {
    id: 'song-lavieenrose',
    title: 'La Vie En Rose',
    artist: 'Édith Piaf',
    coverEmoji: '🌹',
    coverGradient: 'from-pink-500 via-rose-600 to-red-700',
    language: 'Francês',
    audioUrl: '/(melody.az) 878 - La Vie En Rose.mp3',
    sentences: [
      {
        id: 'lvr-1',
        characters: ['Quand', 'il', 'me', 'prend', 'dans', 'ses', 'bras'],
        pinyin: 'quand il me prend dans ses bras',
        translation: 'Quando ele me pega nos seus braços.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Quand significa quando. Prend é o verbo prendre (pegar/tomar) no presente.'
      },
      {
        id: 'lvr-2',
        characters: ['Qu\'il', 'me', 'parle', 'tout', 'bas'],
        pinyin: 'qu\'il me parle tout bas',
        translation: 'Quando ele me fala bem baixinho.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Tout bas é uma expressão adverbial que significa muito baixo ou num sussurro.'
      },
      {
        id: 'lvr-3',
        characters: ['Je', 'vois', 'la', 'vie', 'en', 'rose'],
        pinyin: 'je vois la vie en rose',
        translation: 'Eu vejo a vida em cor-de-rosa (com otimismo).',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Vois é do verbo voir (ver). La vie en rose significa figurativamente enxergar o lado bom de tudo.'
      },
      {
        id: 'lvr-4',
        characters: ['Il', 'me', 'dit', 'des', 'mots', 'd\'amour'],
        pinyin: 'il me dit des mots d\'amour',
        translation: 'Ele me diz palavras de amor.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Dit é do verbo dire (dizer). Mots significa palavras.'
      },
      {
        id: 'lvr-5',
        characters: ['Des', 'mots', 'de', 'tous', 'les', 'jours'],
        pinyin: 'des mots de tous les jours',
        translation: 'Palavras do cotidiano / de todos os dias.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Tous les jours significa diariamente ou todos os dias.'
      },
      {
        id: 'lvr-6',
        characters: ['Et', 'ça', 'me', 'fait', 'quelque', 'chose'],
        pinyin: 'et ca me fait quelque chose',
        translation: 'E isso mexe comigo / me faz sentir algo.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Fait quelque chose é uma expressão que indica comoção ou impacto emocional.'
      },
      {
        id: 'lvr-7',
        characters: ['C\'est', 'lui', 'pour', 'moi', 'moi', 'pour', 'lui', 'dans', 'la', 'vie'],
        pinyin: 'c\'est lui pour moi moi pour lui dans la vie',
        translation: 'É ele para mim, eu para ele na vida.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Moi pour lui (eu para ele). Dans la vie (na vida).'
      }
    ]
  },
  {
    id: 'song-smoothcriminal',
    title: 'Smooth Criminal',
    artist: 'Michael Jackson',
    coverEmoji: '🕴️',
    coverGradient: 'from-slate-750 via-slate-800 to-indigo-950',
    language: 'Inglês',
    audioUrl: '/(melody.az) 7515 - Smooth Criminal.mp3',
    sentences: [
      {
        id: 'sc-1',
        characters: ['As', 'he', 'came', 'into', 'the', 'window'],
        pinyin: 'as he came into the window',
        translation: 'Conforme ele entrava pela janela.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Came é o passado de come (vir/entrar). Into indica movimento para dentro.'
      },
      {
        id: 'sc-2',
        characters: ['Was', 'a', 'sound', 'of', 'a', 'crescendo'],
        pinyin: 'was a sound of a crescendo',
        translation: 'Houve um som de um crescendo (aumento gradual de volume).',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Crescendo refere-se ao aumento de intensidade sonora na música.'
      },
      {
        id: 'sc-3',
        characters: ['He', 'came', 'into', 'her', 'apartment'],
        pinyin: 'he came into her apartment',
        translation: 'Ele entrou no apartamento dela.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Her é o pronome possessivo feminino (dela).'
      },
      {
        id: 'sc-4',
        characters: ['He', 'left', 'the', 'bloodstains', 'on', 'the', 'carpet'],
        pinyin: 'he left the bloodstains on the carpet',
        translation: 'Ele deixou as manchas de sangue no tapete.',
        category: 'Música',
        difficulty: 'Difícil',
        explanation: 'Left é o passado de leave (deixar). Bloodstains (manchas de sangue). Carpet (tapete).'
      },
      {
        id: 'sc-5',
        characters: ['She', 'ran', 'underneath', 'the', 'table'],
        pinyin: 'she ran underneath the table',
        translation: 'Ela correu para debaixo da mesa.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Ran é o passado de run (correr). Underneath significa sob ou debaixo de.'
      },
      {
        id: 'sc-6',
        characters: ['Annie', 'are', 'you', 'okay'],
        pinyin: 'annie are you okay',
        translation: 'Annie, você está bem?',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Okay (abreviação de OK) significa bem ou certo.'
      },
      {
        id: 'sc-7',
        characters: ['You\'ve', 'been', 'hit', 'by', 'a', 'smooth', 'criminal'],
        pinyin: 'you\'ve been hit by a smooth criminal',
        translation: 'Você foi atingida por um criminoso sutil/sorrateiro.',
        category: 'Música',
        difficulty: 'Difícil',
        explanation: 'You\'ve been hit (você foi atingida). Smooth criminal refere-se a um criminoso elegante/sutil.'
      }
    ]
  },
  {
    id: 'song-theydontcare',
    title: "They Don't Care About Us",
    artist: 'Michael Jackson',
    coverEmoji: '🗣️',
    coverGradient: 'from-blue-600 to-slate-900',
    language: 'Inglês',
    audioUrl: "/Michel_Jackson_-_They_don_t_really_care_about_us_1995_(mp3.pm).mp3",
    sentences: [
      {
        id: 'tdc-1',
        characters: ['Everybody', 'gone', 'bad'],
        pinyin: 'everybody gone bad',
        translation: 'Todo mundo ficou mau.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Everybody (todo mundo). Gone bad é uma expressão para descrever que as coisas ou pessoas se deterioraram/ficaram ruins.'
      },
      {
        id: 'tdc-2',
        characters: ['All', 'I', 'wanna', 'say', 'is', 'that'],
        pinyin: 'all i wanna say is that',
        translation: 'Tudo o que eu quero dizer é que.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Wanna é a contração informal de want to (querer).'
      },
      {
        id: 'tdc-3',
        characters: ['They', 'don\'t', 'really', 'care', 'about', 'us'],
        pinyin: 'they don\'t really care about us',
        translation: 'Eles realmente não se importam conosco.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Care about significa importar-se com algo/alguém.'
      },
      {
        id: 'tdc-4',
        characters: ['Beat', 'me', 'hate', 'me', 'you', 'can', 'never', 'break', 'me'],
        pinyin: 'beat me hate me you can never break me',
        translation: 'Bata em mim, odeie-me, você nunca poderá me quebrar.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Beat (bater/derrotar). Break (quebrar/destruir).'
      },
      {
        id: 'tdc-5',
        characters: ['I', 'am', 'the', 'victim', 'of', 'police', 'brutality'],
        pinyin: 'i am the victim of police brutality',
        translation: 'Eu sou a vítima de brutalidade policial.',
        category: 'Música',
        difficulty: 'Difícil',
        explanation: 'Victim (vítima). Police brutality (brutalidade/violência policial).'
      },
      {
        id: 'tdc-6',
        characters: ['I\'m', 'tired', 'of', 'being', 'the', 'victim', 'of', 'hate'],
        pinyin: 'i\'m tired of being the victim of hate',
        translation: 'Estou cansado de ser a vítima do ódio.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Tired of being (cansado de ser). Hate (ódio).'
      }
    ]
  },
  {
    id: 'song-wakawaka',
    title: 'Waka Waka',
    artist: 'Shakira',
    coverEmoji: '⚽',
    coverGradient: 'from-yellow-400 via-orange-500 to-red-500',
    language: 'Inglês',
    audioUrl: '/(melody.az) 2955 - Waka Waka.mp3',
    sentences: [
      {
        id: 'ww-1',
        characters: ['You\'re', 'a', 'good', 'soldier', 'choosing', 'your', 'battles'],
        pinyin: 'you\'re a good soldier choosing your battles',
        translation: 'Você é um bom soldado escolhendo suas batalhas.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Soldier (soldado). Choosing é o gerúndio de choose (escolher). Battles (batalhas).'
      },
      {
        id: 'ww-2',
        characters: ['Pick', 'yourself', 'up', 'and', 'dust', 'yourself', 'off'],
        pinyin: 'pick yourself up and dust yourself off',
        translation: 'Levante-se e sacuda a poeira.',
        category: 'Música',
        difficulty: 'Difícil',
        explanation: 'Pick yourself up (levante-se / recupere-se). Dust yourself off (sacuda a poeira).'
      },
      {
        id: 'ww-3',
        characters: ['You\'re', 'on', 'the', 'front', 'line'],
        pinyin: 'you\'re on the front line',
        translation: 'Você está na linha de frente.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Front line refere-se à zona de combate ou linha de frente.'
      },
      {
        id: 'ww-4',
        characters: ['Everyone\'s', 'watching'],
        pinyin: 'everyone\'s watching',
        translation: 'Todo mundo está assistindo/olhando.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Everyone\'s é a contração de everyone is (todo mundo está). Watching (assistindo).'
      },
      {
        id: 'ww-5',
        characters: ['When', 'you', 'fall', 'get', 'up'],
        pinyin: 'when you fall get up',
        translation: 'Quando você cair, levante-se.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Fall (cair). Get up (levantar-se).'
      },
      {
        id: 'ww-6',
        characters: ['This', 'time', 'for', 'Africa'],
        pinyin: 'this time for africa',
        translation: 'Desta vez pela África.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'This time significa desta vez.'
      }
    ]
  },
  {
    id: 'song-latortura',
    title: 'La Tortura',
    artist: 'Shakira (feat. Alejandro Sanz)',
    coverEmoji: '🥀',
    coverGradient: 'from-amber-800 via-yellow-750 to-red-800',
    language: 'Espanhol',
    audioUrl: '/(melody.az) 2955 - La Tortura (feat Alejandro Sanz).mp3',
    sentences: [
      {
        id: 'lt-1',
        characters: ['Ay', 'panita', 'mía', 'guárdate', 'la', 'poesía'],
        pinyin: 'ay panita mia guardate la poesia',
        translation: 'Ai, minha amiguinha, guarde a poesia.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Panita é um termo afetuoso muito comum no espanhol latino (Venezuela/Colômbia) para amigo(a). Guárdate (guarde para si).'
      },
      {
        id: 'lt-2',
        characters: ['Guárdate', 'la', 'alegría', 'pa\'', 'ti'],
        pinyin: 'guardate la alegria pa\' ti',
        translation: 'Guarde a alegria para você.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Pa\' ti é a contração informal e falada de para ti (para você).'
      },
      {
        id: 'lt-3',
        characters: ['No', 'pido', 'que', 'todos', 'los', 'días', 'sean', 'de', 'Sol'],
        pinyin: 'no pido que todos los dias sean de sol',
        translation: 'Não peço que todos os dias sejam de Sol.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Pido é a primeira pessoa do singular do verbo pedir (yo pido - eu peço). Sol (sol).'
      },
      {
        id: 'lt-4',
        characters: ['No', 'solo', 'de', 'pan', 'vive', 'el', 'hombre'],
        pinyin: 'no solo de pan vive el hombre',
        translation: 'Não só de pão vive o homem.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Pan (pão). Vive (vive). Hombre (homem).'
      },
      {
        id: 'lt-5',
        characters: ['Ay', 'amor', 'fue', 'una', 'tortura', 'perderte'],
        pinyin: 'ay amor fue una tortura perderte',
        translation: 'Ai amor, foi uma tortura te perder.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Fue é o passado simples do verbo ser/ir. Perderte significa perder você.'
      },
      {
        id: 'lt-6',
        characters: ['Solo', 'de', 'errores', 'se', 'aprende'],
        pinyin: 'solo de errores se aprende',
        translation: 'Apenas com erros se aprende.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Solo (apenas/só). Errores (erros). Se aprende (aprende-se).'
      }
    ]
  },
  {
    id: 'song-saveme',
    title: 'Save Me',
    artist: 'Remy Zero',
    coverEmoji: '🦸',
    coverGradient: 'from-blue-650 via-indigo-700 to-slate-900',
    language: 'Inglês',
    audioUrl: '/Smallvile_Remy_Zero_-_Save_Me_(mp3.pm).mp3',
    sentences: [
      {
        id: 'sm-1',
        characters: ['I', 'feel', 'my', 'wings', 'have', 'broken', 'in', 'your', 'hands'],
        pinyin: 'i feel my wings have broken in your hands',
        translation: 'Sinto que minhas asas quebraram em suas mãos.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Gramática de música.'
      },
      {
        id: 'sm-2',
        characters: ['I', 'feel', 'the', 'words', 'unspoken', 'inside'],
        pinyin: 'i feel the words unspoken inside',
        translation: 'Sinto as palavras não ditas aqui dentro.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Gramática de música.'
      },
      {
        id: 'sm-3',
        characters: ['And', 'they', 'pull', 'you', 'under'],
        pinyin: 'and they pull you under',
        translation: 'E elas te puxam para baixo.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Gramática de música.'
      },
      {
        id: 'sm-4',
        characters: ['And', 'I', 'will', 'give', 'you', 'anything', 'you', 'want', 'you', 'know'],
        pinyin: 'and i will give you anything you want you know',
        translation: 'E eu te darei tudo o que você quiser, você sabe.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Gramática de música.'
      },
      {
        id: 'sm-5',
        characters: ['You', 'are', 'all', 'I', 'wanted'],
        pinyin: 'you are all i wanted',
        translation: 'Você é tudo o que eu queria.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Gramática de música.'
      },
      {
        id: 'sm-6',
        characters: ['All', 'my', 'dreams', 'are', 'falling', 'down'],
        pinyin: 'all my dreams are falling down',
        translation: 'Todos os meus sonhos estão desmoronando.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Gramática de música.'
      },
      {
        id: 'sm-7',
        characters: ['Crawling', 'around', 'around'],
        pinyin: 'crawling around around',
        translation: 'Rastejando ao redor, ao redor.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Gramática de música.'
      },
      {
        id: 'sm-8',
        characters: ['Somebody', 'save', 'me'],
        pinyin: 'somebody save me',
        translation: 'Alguém me salve.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Gramática de música.'
      },
      {
        id: 'sm-9',
        characters: ['Let', 'your', 'warm', 'hands', 'break', 'right', 'through'],
        pinyin: 'let your warm hands break right through',
        translation: 'Deixe suas mãos quentes atravessarem direto.',
        category: 'Música',
        difficulty: 'Difícil',
        explanation: 'Gramática de música.'
      },
      {
        id: 'sm-10',
        characters: ['Somebody', 'save', 'me'],
        pinyin: 'somebody save me',
        translation: 'Alguém me salve.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Gramática de música.'
      },
      {
        id: 'sm-11',
        characters: ['I', 'don\'t', 'care', 'how', 'you', 'do', 'it'],
        pinyin: 'i don\'t care how you do it',
        translation: 'Não me importo com como você faz isso.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Gramática de música.'
      },
      {
        id: 'sm-12',
        characters: ['Just', 'stay', 'stay', 'come', 'on'],
        pinyin: 'just stay stay come on',
        translation: 'Apenas fique, fique, vamos lá.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Gramática de música.'
      },
      {
        id: 'sm-13',
        characters: ['I\'ve', 'been', 'waiting', 'for', 'you'],
        pinyin: 'i\'ve been waiting for you',
        translation: 'Estive esperando por você.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Gramática de música.'
      },
      {
        id: 'sm-14',
        characters: ['I', 'see', 'the', 'world', 'has', 'folded', 'in', 'your', 'heart'],
        pinyin: 'i see the world has folded in your heart',
        translation: 'Vejo que o mundo se dobrou no seu coração.',
        category: 'Música',
        difficulty: 'Difícil',
        explanation: 'Gramática de música.'
      },
      {
        id: 'sm-15',
        characters: ['I', 'feel', 'the', 'waves', 'crash', 'down', 'inside'],
        pinyin: 'i feel the waves crash down inside',
        translation: 'Sinto as ondas quebrarem aqui dentro.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Gramática de música.'
      },
      {
        id: 'sm-16',
        characters: ['And', 'they', 'pull', 'me', 'under'],
        pinyin: 'and they pull me under',
        translation: 'E elas me puxam para baixo.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Gramática de música.'
      },
      {
        id: 'sm-17',
        characters: ['I', 'will', 'give', 'you', 'anything', 'you', 'want', 'you', 'know'],
        pinyin: 'i will give you anything you want you know',
        translation: 'Eu te darei tudo o que você quiser, você sabe.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Gramática de música.'
      },
      {
        id: 'sm-18',
        characters: ['You', 'are', 'all', 'I', 'wanted'],
        pinyin: 'you are all i wanted',
        translation: 'Você é tudo o que eu queria.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Gramática de música.'
      },
      {
        id: 'sm-19',
        characters: ['All', 'my', 'dreams', 'have', 'fallen', 'down'],
        pinyin: 'all my dreams have fallen down',
        translation: 'Todos os meus sonhos desmoronaram.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Gramática de música.'
      },
      {
        id: 'sm-20',
        characters: ['Crawling', 'around', 'around'],
        pinyin: 'crawling around around',
        translation: 'Rastejando ao redor, ao redor.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Gramática de música.'
      },
      {
        id: 'sm-21',
        characters: ['Somebody', 'save', 'me'],
        pinyin: 'somebody save me',
        translation: 'Alguém me salve.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Gramática de música.'
      },
      {
        id: 'sm-22',
        characters: ['Let', 'your', 'warm', 'hands', 'break', 'right', 'through'],
        pinyin: 'let your warm hands break right through',
        translation: 'Deixe suas mãos quentes atravessarem direto.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Gramática de música.'
      },
      {
        id: 'sm-23',
        characters: ['Somebody', 'save', 'me'],
        pinyin: 'somebody save me',
        translation: 'Alguém me salve.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Gramática de música.'
      },
      {
        id: 'sm-24',
        characters: ['I', 'don\'t', 'care', 'how', 'you', 'do', 'it'],
        pinyin: 'i don\'t care how you do it',
        translation: 'Não me importo com como você faz isso.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Gramática de música.'
      },
      {
        id: 'sm-25',
        characters: ['Just', 'stay', 'stay', 'come', 'on'],
        pinyin: 'just stay stay come on',
        translation: 'Apenas fique, fique, vamos lá.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Gramática de música.'
      },
      {
        id: 'sm-26',
        characters: ['I\'ve', 'been', 'waiting', 'for', 'you'],
        pinyin: 'i\'ve been waiting for you',
        translation: 'Estive esperando por você.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Gramática de música.'
      },
      {
        id: 'sm-27',
        characters: ['All', 'my', 'dreams', 'are', 'on', 'the', 'ground'],
        pinyin: 'all my dreams are on the ground',
        translation: 'Todos os meus sonhos estão no chão.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Gramática de música.'
      },
      {
        id: 'sm-28',
        characters: ['Crawling', 'around', 'around'],
        pinyin: 'crawling around around',
        translation: 'Rastejando ao redor, ao redor.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Gramática de música.'
      },
      {
        id: 'sm-29',
        characters: ['Somebody', 'save', 'me'],
        pinyin: 'somebody save me',
        translation: 'Alguém me salve.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Gramática de música.'
      },
      {
        id: 'sm-30',
        characters: ['Let', 'your', 'warm', 'hands', 'break', 'right', 'through'],
        pinyin: 'let your warm hands break right through',
        translation: 'Deixe suas mãos quentes atravessarem direto.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Gramática de música.'
      },
      {
        id: 'sm-31',
        characters: ['Somebody', 'save', 'me'],
        pinyin: 'somebody save me',
        translation: 'Alguém me salve.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Gramática de música.'
      },
      {
        id: 'sm-32',
        characters: ['I', 'don\'t', 'care', 'how', 'you', 'do', 'it'],
        pinyin: 'i don\'t care how you do it',
        translation: 'Não me importo com como você faz isso.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Gramática de música.'
      },
      {
        id: 'sm-33',
        characters: ['Just', 'stay', 'with', 'me'],
        pinyin: 'just stay with me',
        translation: 'Apenas fique comigo.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Gramática de música.'
      },
      {
        id: 'sm-36',
        characters: ['I\'m', 'still', 'waiting', 'for', 'you'],
        pinyin: 'i\'m still waiting for you',
        translation: 'Eu ainda continuo esperando por você.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Gramática de música.'
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
  },
  {
    id: 'song-thriller',
    title: 'Thriller',
    artist: 'Michael Jackson',
    coverEmoji: '🧟',
    coverGradient: 'from-red-650 via-red-900 to-black',
    language: 'Inglês',
    audioUrl: '/Thriller.mp3', // References the mp3 file in the public folder
    sentences: [
      {
        id: 'th-1',
        characters: ['It\'s', 'close', 'to', 'midnight'],
        pinyin: 'its clous tu midnait',
        translation: 'Está perto da meia-noite.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Close to (perto de) + Midnight (meia-noite).'
      },
      {
        id: 'th-2',
        characters: ['And', 'something', 'evil\'s', 'lurkin\'', 'in', 'the', 'dark'],
        pinyin: 'end samting ivils lârkin in de darc',
        translation: 'E algo maligno está espreitando no escuro.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Something (algo). Evil\'s lurkin\' (o mal está espreitando/rondando).'
      },
      {
        id: 'th-3',
        characters: ['Under', 'the', 'moonlight'],
        pinyin: 'ander de munlait',
        translation: 'Sob a luz do luar.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Under (sob/debaixo de) + Moonlight (luz da lua).'
      },
      {
        id: 'th-4',
        characters: ['You', 'see', 'a', 'sight', 'that', 'almost', 'stops', 'your', 'heart'],
        pinyin: 'iu si e sait det olmoust stops ior hart',
        translation: 'Você vê uma cena que quase para o seu coração.',
        category: 'Música',
        difficulty: 'Difícil',
        explanation: 'Sight (visão/cena) + Stops your heart (para seu coração).'
      },
      {
        id: 'th-5',
        characters: ['You', 'try', 'to', 'scream'],
        pinyin: 'iu trai tu iscrim',
        translation: 'Você tenta gritar.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Try to scream (tenta gritar).'
      },
      {
        id: 'th-6',
        characters: ['But', 'terror', 'takes', 'the', 'sound', 'before', 'you', 'make', 'it'],
        pinyin: 'bat terror teics de saund bifor iu meic it',
        translation: 'Mas o terror leva o som antes de você conseguir emiti-lo.',
        category: 'Música',
        difficulty: 'Difícil',
        explanation: 'Takes the sound (leva o som/voz) + Before you make it (antes de você fazer/conseguir).'
      },
      {
        id: 'th-7',
        characters: ['You', 'start', 'to', 'freeze'],
        pinyin: 'iu istart tu frizi',
        translation: 'Você começa a congelar (de medo).',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Start to freeze (começar a congelar/paralisar).'
      },
      {
        id: 'th-8',
        characters: ['As', 'horror', 'looks', 'you', 'right', 'between', 'the', 'eyes'],
        pinyin: 'ez horror lucs iu rait bituin de ais',
        translation: 'Enquanto o horror olha direto nos seus olhos.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: 'Right between the eyes (direto/bem no meio dos olhos).'
      },
      {
        id: 'th-9',
        characters: ['You\'re', 'paralyzed'],
        pinyin: 'iur paralaisd',
        translation: 'Você está paralisado.',
        category: 'Música',
        difficulty: 'Fácil',
        explanation: 'Paralyzed (paralisado).'
      },
      {
        id: 'th-10',
        characters: ['\'Cause', 'this', 'is', 'thriller', 'thriller', 'night'],
        pinyin: 'coz dis iz triler triler nait',
        translation: 'Porque esta é a noite do terror/thriller.',
        category: 'Música',
        difficulty: 'Médio',
        explanation: '\'Cause (abreviação de because) + Thriller night (noite emocionante/de terror).'
      }
    ]
  }
];
