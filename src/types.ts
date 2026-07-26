export interface FloatingWord {
  id: string;
  text: string;
  phonetic?: string;
  translation?: string;
  x: number;          // Position x (percentage 0-100)
  y: number;          // Position y (percentage 0-100)
  vx: number;         // Velocity x
  vy: number;         // Velocity y
  size: number;       // Visual scale factor
  isPlaced: boolean;  // Has it been added to the center?
  zIndex?: number;    // Stacking order
}

export interface GameState {
  score: number;
  level: number;
  completedSentences: string[];
}

export interface Sentence {
  id: string;
  characters: string[]; // Characters or words in correct order
  pinyin: string;       // Phonetic guide or pronunciation
  translation: string;  // Translation
  category: string;     // Difficulty or category tag
  difficulty?: 'Fácil' | 'Médio' | 'Avançado';
  explanation?: string; // Grammar/usage tip
}

export function joinSentence(characters: string[]): string {
  if (!characters) return '';
  const hasChinese = characters.some(c => /[\u4e00-\u9fa5]/.test(c));
  return hasChinese ? characters.join('') : characters.join(' ');
}

