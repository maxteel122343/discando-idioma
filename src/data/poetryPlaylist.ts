import { Sentence } from '../types';

export interface PoemTrack {
  id: string;
  title: string;
  titlePt: string;
  author: string;
  authorBio: string;
  poemContext: string;
  coverEmoji: string;
  coverGradient: string;
  language: string;
  sentences: Sentence[];
  isLocked?: boolean;
  isCustom?: boolean;
}

export const PRESET_POEMS: PoemTrack[] = [
  {
    id: 'poem-frost-road',
    title: 'The Road Not Taken',
    titlePt: 'O Caminho Não Trilhado',
    author: 'Robert Frost',
    authorBio: 'Robert Frost (1874–1963) foi um renomado poeta norte-americano, vencedor de 4 Prêmios Pulitzer. Famoso por contemplar as escolhas humanas e a beleza simples da natureza.',
    poemContext: 'Inspirado em suas caminhadas pelos bosques da Inglaterra, este poema explora o dilema das decisões inevitáveis que moldam nosso destino.',
    coverEmoji: '🌲',
    coverGradient: 'from-emerald-500 to-teal-700',
    language: 'Inglês',
    sentences: [
      {
        id: 'rf-1',
        characters: ['Two', 'roads', 'diverged', 'in', 'a', 'yellow', 'wood'],
        pinyin: 'Tu roudz daivərdʒd in e iælou wud',
        translation: 'Dois caminhos se bifurcavam em uma floresta amarela.',
        category: 'Poesia',
        difficulty: 'Médio',
        explanation: 'Two (dois) + roads (caminhos) + diverged (se bifurcavam) + in a yellow wood (em uma floresta de outono amarela).'
      },
      {
        id: 'rf-2',
        characters: ['And', 'sorry', 'I', 'could', 'not', 'travel', 'both'],
        pinyin: 'Ænd sɔri ai kud nat trævəl bouθ',
        translation: 'E lamento não poder percorrer ambos.',
        category: 'Poesia',
        difficulty: 'Fácil',
        explanation: 'sorry (lamento/sinto muito) + could not travel both (não podia viajar por ambos).'
      },
      {
        id: 'rf-3',
        characters: ['And', 'be', 'one', 'traveler', 'long', 'I', 'stood'],
        pinyin: 'Ænd bi wʌn trævələr lɔŋ ai stud',
        translation: 'E sendo um único viajante, por muito tempo permaneci de pé.',
        category: 'Poesia',
        difficulty: 'Médio',
        explanation: 'one traveler (um só viajante) + long I stood (por muito tempo fiquei parado pensando).'
      },
      {
        id: 'rf-4',
        characters: ['And', 'took', 'the', 'other', 'as', 'just', 'as', 'fair'],
        pinyin: 'Ænd tuk ðə ʌðər æz dʒʌst æz fɛr',
        translation: 'E escolhi o outro caminho, igualmente belo.',
        category: 'Poesia',
        difficulty: 'Médio',
        explanation: 'took the other (peguei o outro) + as just as fair (tão justo e belo quanto).'
      },
      {
        id: 'rf-5',
        characters: ['And', 'that', 'has', 'made', 'all', 'the', 'difference'],
        pinyin: 'Ænd ðæt hæz meid ɔl ðə difərəns',
        translation: 'E isso fez toda a diferença.',
        category: 'Poesia',
        difficulty: 'Fácil',
        explanation: 'that has made (isso fez) + all the difference (toda a diferença).'
      }
    ]
  },
  {
    id: 'poem-emily-hope',
    title: 'Hope is the Thing with Feathers',
    titlePt: 'A Esperança é a Coisa com Penas',
    author: 'Emily Dickinson',
    authorBio: 'Emily Dickinson (1830–1886) viveu de forma reservada na sua casa em Massachusetts, escrevendo em segredo cerca de 1.800 poemas geniais repletos de metáforas vivas.',
    poemContext: 'Dickinson personifica a esperança como um pequeno passarinho pousado na alma humana, que canta sem parar, mesmo durante as piores tempestades da vida.',
    coverEmoji: '🕊️',
    coverGradient: 'from-amber-400 to-amber-600',
    language: 'Inglês',
    sentences: [
      {
        id: 'ed-1',
        characters: ['Hope', 'is', 'the', 'thing', 'with', 'feathers'],
        pinyin: 'Houp iz ðə θiŋ wið feðərz',
        translation: 'A esperança é a coisa com penas.',
        category: 'Poesia',
        difficulty: 'Fácil',
        explanation: 'Hope (esperança) + is the thing (é a coisa) + with feathers (com penas/penas de ave).'
      },
      {
        id: 'ed-2',
        characters: ['That', 'perches', 'in', 'the', 'soul'],
        pinyin: 'Ðæt pɜrtʃəz in ðə soul',
        translation: 'Que se abriga e pousa na alma.',
        category: 'Poesia',
        difficulty: 'Médio',
        explanation: 'That perches (que se empena/pousa) + in the soul (dentro da alma).'
      },
      {
        id: 'ed-3',
        characters: ['And', 'sings', 'the', 'tune', 'without', 'the', 'words'],
        pinyin: 'Ænd siŋz ðə tiun wiðaut ðə wɜrdz',
        translation: 'E canta a melodia sem palavras.',
        category: 'Poesia',
        difficulty: 'Fácil',
        explanation: 'sings the tune (canta a canção) + without the words (sem precisar de palavras).'
      },
      {
        id: 'ed-4',
        characters: ['And', 'never', 'stops', 'at', 'all'],
        pinyin: 'Ænd nevər staps æt ɔl',
        translation: 'E nunca para de cantar, jamais.',
        category: 'Poesia',
        difficulty: 'Fácil',
        explanation: 'never stops (nunca para) + at all (de modo algum).'
      }
    ]
  },
  {
    id: 'poem-shakespeare-18',
    title: 'Sonnet 18: Shall I Compare Thee',
    titlePt: 'Soneto 18: Devo Comparar-te',
    author: 'William Shakespeare',
    authorBio: 'William Shakespeare (1564–1616), lendário dramaturgo inglês, autor de Hamlet e Romeu e Julieta. Escreveu 154 sonetos imortais sobre o amor e a condição humana.',
    poemContext: 'Shakespeare compara a beleza da pessoa amada a um dia de Verão. Ele afirma que o Verão passa, mas a beleza dela continuará viva eternamente nesta poesia.',
    coverEmoji: '🌹',
    coverGradient: 'from-rose-500 to-purple-700',
    language: 'Inglês',
    sentences: [
      {
        id: 'ws-1',
        characters: ['Shall', 'I', 'compare', 'thee', 'to', 'a', 'summer\'s', 'day'],
        pinyin: 'ʃæl ai kəmper ði tu e sʌmərz dei',
        translation: 'Devo eu comparar-te a um dia de verão?',
        category: 'Poesia',
        difficulty: 'Avançado',
        explanation: 'Shall I compare thee (devo eu comparar você) + to a summer\'s day (a um dia estival de verão).'
      },
      {
        id: 'ws-2',
        characters: ['Thou', 'art', 'more', 'lovely', 'and', 'more', 'temperate'],
        pinyin: 'Ðau art mɔr lʌvli ænd mɔr tempərət',
        translation: 'Tu és mais adorável e mais sereno.',
        category: 'Poesia',
        difficulty: 'Avançado',
        explanation: 'Thou art (tu és em inglês arcaico) + more lovely (mais encantadora) + temperate (suave e equilibrada).'
      },
      {
        id: 'ws-3',
        characters: ['So', 'long', 'as', 'men', 'can', 'breathe', 'or', 'eyes', 'can', 'see'],
        pinyin: 'Sou lɔŋ æz men kæn brið ɔr aiz kæn si',
        translation: 'Enquanto os homens puderem respirar ou os olhos verem.',
        category: 'Poesia',
        difficulty: 'Médio',
        explanation: 'So long as (enquanto) + men can breathe (homens respirarem) + or eyes can see (ou olhos puderem ver).'
      },
      {
        id: 'ws-4',
        characters: ['So', 'long', 'lives', 'this', 'and', 'this', 'gives', 'life', 'to', 'thee'],
        pinyin: 'Sou lɔŋ livz ðis ænd ðis givz laif tu ði',
        translation: 'Tanto tempo viverá este poema, e ele te dará vida.',
        category: 'Poesia',
        difficulty: 'Médio',
        explanation: 'So long lives this (assim viverá este soneto) + gives life to thee (dará vida imortal a ti).'
      }
    ]
  },
  {
    id: 'poem-poe-raven',
    title: 'The Raven',
    titlePt: 'O Corvo',
    author: 'Edgar Allan Poe',
    authorBio: 'Edgar Allan Poe (1809–1849) foi o mestre americano da poesia gótica e precursor da ficção policial. Criava ritmos hipnóticos e atmosferas de puro mistério.',
    poemContext: 'Um jovem lamenta a perda de sua amada Lenore quando um corvo misterioso pousa sobre o busto de Pallas em seu quarto, repetindo incessantemente a palavra "Nevermore".',
    coverEmoji: '🦅',
    coverGradient: 'from-slate-800 to-indigo-950',
    language: 'Inglês',
    sentences: [
      {
        id: 'eap-1',
        characters: ['Once', 'upon', 'a', 'midnight', 'dreary', 'while', 'I', 'pondered'],
        pinyin: 'Wʌns əpɑn e midnait driri wail ai pandərd',
        translation: 'Certa vez, em uma meia-noite sombria, enquanto eu meditava.',
        category: 'Poesia',
        difficulty: 'Avançado',
        explanation: 'Once upon a midnight dreary (certa meia-noite melancólica) + while I pondered (enquanto eu refletia cansado).'
      },
      {
        id: 'eap-2',
        characters: ['Quoth', 'the', 'Raven', 'Nevermore'],
        pinyin: 'Kwouθ ðə reivən nevərmɔr',
        translation: 'Disse o Corvo: Nunca mais.',
        category: 'Poesia',
        difficulty: 'Fácil',
        explanation: 'Quoth (disse/declarou) + the Raven (o corvo) + Nevermore (nunca mais).'
      }
    ]
  },
  {
    id: 'poem-pessoa-tabacaria',
    title: 'Não Sou Nada (Tabacaria)',
    titlePt: 'Não Sou Nada',
    author: 'Fernando Pessoa',
    authorBio: 'Fernando Pessoa (1888–1935) foi um dos maiores poetas de Portugal. Ficou célebre por criar heterônimos — poetas fictícios com estilos e identidades próprias como Álvaro de Campos.',
    poemContext: 'Escrito sob a persona do engenheiro futurista Álvaro de Campos, o poema reflete sobre a existência, o nada e o desejo infinito de sonhar da janela de uma casa.',
    coverEmoji: '📜',
    coverGradient: 'from-stone-600 to-zinc-800',
    language: 'Português',
    sentences: [
      {
        id: 'fp-1',
        characters: ['Não', 'sou', 'nada', 'Nunca', 'serei', 'nada'],
        pinyin: 'Não sou na-da. Nun-ca se-rei na-da.',
        translation: 'Não sou nada. Nunca serei nada.',
        category: 'Poesia',
        difficulty: 'Fácil',
        explanation: 'A célebre abertura existencialista do poema Tabacaria.'
      },
      {
        id: 'fp-2',
        characters: ['Não', 'posso', 'querer', 'ser', 'nada'],
        pinyin: 'Não pos-so que-rer ser na-da.',
        translation: 'Não posso querer ser nada.',
        category: 'Poesia',
        difficulty: 'Fácil',
        explanation: 'Aceitação da própria insignificância diante do universo.'
      },
      {
        id: 'fp-3',
        characters: ['À parte', 'isso', 'tenho', 'em mim', 'todos os sonhos', 'do mundo'],
        pinyin: 'À par-te is-so ten-ho em mim to-dos os so-nhos do mun-do.',
        translation: 'À parte isso, tenho em mim todos os sonhos do mundo.',
        category: 'Poesia',
        difficulty: 'Médio',
        explanation: 'O contraste sublime entre a limitação física e a imaginação infinita.'
      }
    ]
  }
];
