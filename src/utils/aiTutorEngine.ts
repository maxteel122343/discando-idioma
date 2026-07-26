/**
 * AI Voice Assistant Engine ("Assistente Linguo")
 * Provides friendly, dynamic, conversational speech synthesis guiding language learners.
 * Uses Google Cloud TTS (Neural2) as primary voice, with Web Speech API as fallback.
 */

// ─── Google Cloud TTS (Neural2) ───────────────────────────────────────────────
const GOOGLE_TUTOR_VOICES: Record<string, { name: string; gender: string }> = {
  'pt': { name: 'pt-BR-Neural2-A', gender: 'FEMALE' },
  'en': { name: 'en-US-Neural2-F', gender: 'FEMALE' },
  'zh': { name: 'cmn-CN-Wavenet-A', gender: 'FEMALE' },
  'es': { name: 'es-ES-Neural2-A', gender: 'FEMALE' },
  'fr': { name: 'fr-FR-Neural2-A', gender: 'FEMALE' },
  'de': { name: 'de-DE-Neural2-A', gender: 'FEMALE' },
  'ja': { name: 'ja-JP-Neural2-B', gender: 'FEMALE' },
  'ko': { name: 'ko-KR-Neural2-A', gender: 'FEMALE' },
};

let _googleTtsAudio: HTMLAudioElement | null = null;

async function _speakGoogleTTS(text: string, langCode: string, rate: number): Promise<boolean> {
  // Check runtime key first (set via Settings UI), then build-time env var
  const apiKey: string =
    (window as any).__GOOGLE_TTS_KEY__ ||
    localStorage.getItem('hanzi_dial_google_tts_key') ||
    (import.meta as any).env?.VITE_GOOGLE_TTS_API_KEY ||
    '';
  if (!apiKey) return false;
  const prefix = langCode.split('-')[0].toLowerCase();
  const voice = GOOGLE_TUTOR_VOICES[prefix] || { name: `${langCode}-Wavenet-A`, gender: 'FEMALE' };
  try {
    const resp = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text },
          voice: { languageCode: langCode, name: voice.name, ssmlGender: voice.gender },
          audioConfig: { audioEncoding: 'MP3', speakingRate: rate },
        }),
      }
    );
    if (!resp.ok) return false;
    const data = await resp.json();
    if (!data.audioContent) return false;
    if (_googleTtsAudio) _googleTtsAudio.pause();
    _googleTtsAudio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
    await new Promise<void>((res) => {
      _googleTtsAudio!.onended = () => res();
      _googleTtsAudio!.onerror = () => res();
      _googleTtsAudio!.play().catch(() => res());
    });
    return true;
  } catch {
    return false;
  }
}
// ──────────────────────────────────────────────────────────────────────────────


export interface NativeLanguageOption {
  code: string;
  name: string;
  flag: string;
  phrases: {
    greeting: string;
    chooseWordPrompts: string[];
    hurryPrompts: string[];
    understandingQuestions: string[];
    means: string;
    repeatAloud: string;
    dragPrompts: string[];
    completedSentencePrompts: string[];
    translationPrefix: string;
    praises: string[];
  };
}

export const NATIVE_LANGUAGES: NativeLanguageOption[] = [
  {
    code: 'pt-BR',
    name: 'Português (Brasil)',
    flag: '🇧🇷',
    phrases: {
      greeting: 'Oi! Sou sua assistente Linguo. Vamos bater um papo e praticar juntos!',
      chooseWordPrompts: [
        'Pronto para o próximo passo? Procure a palavra:',
        'Entendeu o contexto? Agora encontre a palavra:',
        'Olha só a próxima palavra que precisamos:',
        'Manda ver! A próxima palavra é:',
        'Tudo certo até aqui? Agora disca:',
        'Seguindo a frase, selecione:',
      ],
      hurryPrompts: [
        'Bora lá, tô te esperando! Cadê a palavra:',
        'Bora acelerar! Disca rapidinho:',
        'Rápido, você consegue! Encontre:',
        'Vamos lá, sem enrolar! A palavra é:',
        'Consegue achar essa num segundo? Olhe:',
      ],
      understandingQuestions: [
        'Ficou claro o significado? A palavra é:',
        'Pegou a ideia? Agora procure:',
        'Entendeu essa parte? A próxima palavra é:',
        'Conseguiu pegar o sentido? Vamos com:',
      ],
      means: 'significa',
      repeatAloud: 'Repita comigo:',
      dragPrompts: [
        'Arraste pro disco central!',
        'Puxa ela pro centro!',
        'Disca ela no disco central!',
        'Solta ela no centro pra continuar!',
      ],
      completedSentencePrompts: [
        'Caramba, mandou muito bem! A frase inteira ficou assim:',
        'Show de bola! Frase completíssima! Ouça de novo:',
        'Sensacional! Você discou a frase perfeitamente:',
        'Olha aí, que leitura fluida! Escute a frase completa:',
        'Mandou bem demais! A frase certinha é:',
      ],
      translationPrefix: 'Em português fica:',
      praises: [
        'Entendeu bem essa frase? Que tal partirmos pra próxima?',
        'Sua pronúncia tá excelente! Ficou alguma dúvida?',
        'Mandou bem! Bora pra próxima palavra sem perder o ritmo?',
        'Tudo certo com essa frase? Vamos continuar!',
      ],
    }
  },
  {
    code: 'en-US',
    name: 'English (US)',
    flag: '🇺🇸',
    phrases: {
      greeting: "Hi there! I'm your Linguo voice guide. Let's chat and practice together!",
      chooseWordPrompts: [
        'Ready for the next step? Look for:',
        'Got the meaning? Now find the word:',
        'Here comes the next word we need:',
        'Awesome! The next word is:',
        'Doing great! Now dial:',
        'Moving along, select:',
      ],
      hurryPrompts: [
        "Come on, I'm waiting for you! Where is:",
        'Let\'s speed up! Quickly dial:',
        'Fast now, you got this! Find:',
        'Hurry up, let\'s keep going! The word is:',
      ],
      understandingQuestions: [
        'Does that make sense? The word is:',
        'Got it so far? Now look for:',
        'Understood that part? Next up is:',
      ],
      means: 'means',
      repeatAloud: 'Repeat with me:',
      dragPrompts: [
        'Drag it to the center ring!',
        'Pull it right to the dial!',
        'Drop it in the central dial!',
      ],
      completedSentencePrompts: [
        'Wow, awesome job! Here is the full sentence:',
        'Nailed it! Perfect sentence completion! Listen:',
        'Fantastic! You dialed the sentence smoothly:',
      ],
      translationPrefix: 'In English:',
      praises: [
        'Did you get the full meaning? Ready for the next one?',
        'Your accent sounds spot on! Everything clear?',
        'Great pace! Shall we jump to the next phrase?',
      ],
    }
  },
  {
    code: 'es-ES',
    name: 'Español',
    flag: '🇪🇸',
    phrases: {
      greeting: '¡Hola! Soy tu asistente Linguo. ¡Vamos a conversar y practicar juntos!',
      chooseWordPrompts: [
        '¿Listo para el siguiente paso? Busca la palabra:',
        '¿Entendiste el contexto? Ahora encuentra:',
        'Mira la siguiente palabra que necesitamos:',
        '¡Dale! La siguiente palabra es:',
        '¿Todo claro hasta aquí? Ahora marca:',
      ],
      hurryPrompts: [
        '¡Acelera, te estoy esperando! ¿Dónde está:',
        '¡Vamos rápido! Marca en el centro:',
        '¡Rápido, tú puedes! Encuentra:',
      ],
      understandingQuestions: [
        '¿Te quedó claro el significado? La palabra es:',
        '¿Captaste la idea? Ahora busca:',
        '¿Entendiste esa parte? La siguiente es:',
      ],
      means: 'significa',
      repeatAloud: 'Repite conmigo:',
      dragPrompts: [
        '¡Arrástrala al disco central!',
        '¡Suéltala en el centro!',
        '¡Márcala en el disco!',
      ],
      completedSentencePrompts: [
        '¡Genial, lo hiciste muy bien! La frase completa es:',
        '¡Espectacular! Frase completada con éxito. Escucha:',
        '¡Excelente lectura! Escucha el texto completo:',
      ],
      translationPrefix: 'En español:',
      praises: [
        '¿Comprendiste bien la frase? ¿Seguimos con la siguiente?',
        '¡Tu pronunciación está genial! ¿Alguna duda?',
        '¡Muy bien! ¿Continuamos sin perder el ritmo?',
      ],
    }
  },
  {
    code: 'fr-FR',
    name: 'Français',
    flag: '🇫🇷',
    phrases: {
      greeting: "Bonjour ! Je suis votre assistante Linguo. Parlons et pratiquons ensemble !",
      chooseWordPrompts: [
        'Prêt pour la suite ? Cherchez le mot :',
        'Vous avez compris le sens ? Trouvez :',
        'Voici le mot suivant :',
        'Super ! Le mot suivant est :',
      ],
      hurryPrompts: [
        'Allez, je vous attends ! Où est :',
        'On accélère ! Glissez vite :',
      ],
      understandingQuestions: [
        'C\'est clair pour vous ? Le mot est :',
        'Vous avez saisi le contexte ? Trouvez :',
      ],
      means: 'signifie',
      repeatAloud: 'Répétez avec moi :',
      dragPrompts: [
        'Glissez-le sur le cadran central !',
        'Déposez-le au centre !',
      ],
      completedSentencePrompts: [
        'Bravo, c\'est parfait ! Voici la phrase complète :',
        'Magnifique ! Phrase complétée avec succès ! Écoutez :',
      ],
      translationPrefix: 'En français :',
      praises: [
        'Avez-vous bien compris ? Prêt pour la suite ?',
        'Excellente prononciation ! On continue ?',
      ],
    }
  }
];

export interface SpeechSequenceItem {
  text: string;
  langCode: string;
  rate?: number;
  pitch?: number;
}

let currentCancelToken = 0;

/**
 * Cancel any ongoing speech
 */
export function stopTutorSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  currentCancelToken++;
}

/**
 * Speaks a list of sequence items sequentially and calls callbacks
 */
export function speakTutorSequence(
  items: SpeechSequenceItem[],
  onStartItem?: (text: string, isTargetLang: boolean) => void,
  onFinishedAll?: () => void
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onFinishedAll) onFinishedAll();
    return;
  }

  stopTutorSpeech();
  const token = currentCancelToken;

  let idx = 0;

  async function speakNext() {
    if (token !== currentCancelToken) return;

    if (idx >= items.length) {
      if (onFinishedAll) onFinishedAll();
      return;
    }

    const item = items[idx];
    const isTargetLang = !item.langCode.startsWith('pt') && !item.langCode.startsWith('es') && !item.langCode.startsWith('fr') && item.langCode !== 'en-US';

    if (onStartItem) {
      onStartItem(item.text, isTargetLang);
    }

    const rate = item.rate || 0.98;

    // Try Google Cloud TTS first
    const googleOk = await _speakGoogleTTS(item.text, item.langCode, rate);
    if (googleOk) {
      if (token === currentCancelToken) { idx++; speakNext(); }
      return;
    }

    // Fallback: Web Speech API
    const utterance = new SpeechSynthesisUtterance(item.text);
    utterance.lang = item.langCode;
    utterance.rate = rate;
    utterance.pitch = item.pitch || 1.05;

    try {
      const voices = window.speechSynthesis.getVoices();
      const prefix = item.langCode.split('-')[0].toLowerCase();
      const naturalVoice = voices.find(v =>
        v.lang.toLowerCase().startsWith(prefix) &&
        (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Premium'))
      ) || voices.find(v => v.lang.toLowerCase().startsWith(prefix));
      if (naturalVoice) utterance.voice = naturalVoice;
    } catch (e) {
      console.warn('Voice lookup failed', e);
    }

    utterance.onend = () => {
      if (token === currentCancelToken) { idx++; speakNext(); }
    };
    utterance.onerror = () => {
      if (token === currentCancelToken) { idx++; speakNext(); }
    };
    window.speechSynthesis.speak(utterance);
  }

  setTimeout(speakNext, 50);
}

// Track sentence step counts to dynamically alternate speech styles
let globalGuidanceStepCount = 0;

/**
 * Helper to generate word selection guidance speech with dynamic, natural, conversational phrasing
 */
export function buildWordGuidanceSequence(
  targetWord: string,
  targetPhonetic: string,
  targetTranslation: string,
  contextExplanation: string,
  targetTtsCode: string,
  nativeLangCode: string = 'pt-BR',
  isAfterCorrectWord: boolean = false
): SpeechSequenceItem[] {
  const nativeConfig = NATIVE_LANGUAGES.find(l => l.code === nativeLangCode) || NATIVE_LANGUAGES[0];
  const phrases = nativeConfig.phrases;

  const items: SpeechSequenceItem[] = [];

  // 1. If this step follows a correctly dialed word, start with praise!
  if (isAfterCorrectWord) {
    const praiseList = [
      'Muito bem!',
      'Parabéns!',
      'Excelente, palavra correta!',
      'Boa, mandou bem!',
      'Ótimo acerto!'
    ];
    const randomPraise = praiseList[Math.floor(Math.random() * praiseList.length)];
    items.push({ text: `${randomPraise} Próxima palavra: escolha`, langCode: nativeLangCode });
  } else {
    items.push({ text: 'Selecione a palavra:', langCode: nativeLangCode });
  }

  // 2. Target word in target language
  items.push({ text: targetWord, langCode: targetTtsCode, rate: 0.82, pitch: 1.08 });

  // 3. Repeat prompt in native language
  items.push({ text: `${phrases.repeatAloud || 'Repita comigo:'}`, langCode: nativeLangCode });

  // 4. Target word repeated in target language
  items.push({ text: targetWord, langCode: targetTtsCode, rate: 0.80, pitch: 1.08 });

  // 5. Phonetic pronunciation & translation & action prompt
  const dragPrompt = phrases.dragPrompts[Math.floor(Math.random() * phrases.dragPrompts.length)];
  let infoText = '';
  
  if (targetPhonetic && targetPhonetic !== targetWord) {
    infoText = `Pronuncie "${targetPhonetic}". Significando "${targetTranslation}". ${dragPrompt}`;
  } else {
    infoText = `Que significa "${targetTranslation}". ${dragPrompt}`;
  }

  items.push({ text: infoText, langCode: nativeLangCode });

  return items;
}

/**
 * Helper to generate sentence completion speech with dynamic praise & questions
 */
export function buildSentenceCompletionSequence(
  fullSentenceText: string,
  translation: string,
  targetTtsCode: string,
  nativeLangCode: string = 'pt-BR'
): SpeechSequenceItem[] {
  const nativeConfig = NATIVE_LANGUAGES.find(l => l.code === nativeLangCode) || NATIVE_LANGUAGES[0];
  const phrases = nativeConfig.phrases;

  const leadPrompt = phrases.completedSentencePrompts[Math.floor(Math.random() * phrases.completedSentencePrompts.length)];
  const praise = phrases.praises[Math.floor(Math.random() * phrases.praises.length)];

  const items: SpeechSequenceItem[] = [
    { text: leadPrompt, langCode: nativeLangCode },
    { text: fullSentenceText, langCode: targetTtsCode, rate: 0.85 },
    { text: `${phrases.translationPrefix} "${translation}". ${praise}`, langCode: nativeLangCode }
  ];

  return items;
}
