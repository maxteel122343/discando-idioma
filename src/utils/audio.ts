// Web Audio API Synthesizer for Retro tactile / mechanical sounds

let audioCtx: AudioContext | null = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Mechanical / typewriter click sound for tactile feedback
 */
export function playTick() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Create an oscillator
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.05);
    
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.06);
  } catch (e) {
    console.warn('Audio click failed', e);
  }
}

/**
 * Dial release click sound
 */
export function playDialRelease() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);
    
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.09);
  } catch (e) {
    console.warn('Audio click failed', e);
  }
}

/**
 * Successful word matching sound (harmonious major sweep)
 */
export function playSuccess() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.5);
    });
  } catch (e) {
    console.warn('Audio success failed', e);
  }
}

/**
 * Failure/Wrong sentence sound
 */
export function playError() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.linearRampToValueAtTime(90, now + 0.25);
    
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.26);
  } catch (e) {
    console.warn('Audio error failed', e);
  }
}

/**
 * Celebratory fanfare when all level sentences are completed
 */
export function playFanfare() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const root = 261.63; // C4
    const multipliers = [1, 1.25, 1.5, 1.875, 2]; // Major scale pitches
    
    multipliers.forEach((mult, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(root * mult, now + idx * 0.1);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.1, now + idx * 0.1 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.6);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.7);
    });
  } catch (e) {
    console.warn('Audio fanfare failed', e);
  }
}

/**
 * Google Cloud TTS voice map — Neural2/Wavenet voices per language code prefix
 */
const GOOGLE_TTS_VOICES: Record<string, { name: string; ssmlGender: string }> = {
  'zh': { name: 'cmn-CN-Wavenet-A', ssmlGender: 'FEMALE' },
  'en': { name: 'en-US-Neural2-F',  ssmlGender: 'FEMALE' },
  'pt': { name: 'pt-BR-Neural2-A',  ssmlGender: 'FEMALE' },
  'es': { name: 'es-ES-Neural2-A',  ssmlGender: 'FEMALE' },
  'fr': { name: 'fr-FR-Neural2-A',  ssmlGender: 'FEMALE' },
  'de': { name: 'de-DE-Neural2-A',  ssmlGender: 'FEMALE' },
  'ja': { name: 'ja-JP-Neural2-B',  ssmlGender: 'FEMALE' },
  'ko': { name: 'ko-KR-Neural2-A',  ssmlGender: 'FEMALE' },
};

let googleTtsAudio: HTMLAudioElement | null = null;

/**
 * Speaks text via Google Cloud TTS API (neural voices).
 * Returns true on success, false if unavailable or errored.
 */
async function speakWithGoogleTTS(text: string, ttsCode: string, rate: number): Promise<boolean> {
  const apiKey: string =
    (window as any).__GOOGLE_TTS_KEY__ ||
    localStorage.getItem('hanzi_dial_google_tts_key') ||
    (import.meta as any).env?.VITE_GOOGLE_TTS_API_KEY ||
    '';
  if (!apiKey) return false;

  const prefix = ttsCode.split('-')[0].toLowerCase();
  const voiceConfig = GOOGLE_TTS_VOICES[prefix] || { name: `${ttsCode}-Wavenet-A`, ssmlGender: 'FEMALE' };

  try {
    const resp = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text },
          voice: { languageCode: ttsCode, name: voiceConfig.name, ssmlGender: voiceConfig.ssmlGender },
          audioConfig: { audioEncoding: 'MP3', speakingRate: rate },
        }),
      }
    );
    if (!resp.ok) return false;
    const data = await resp.json();
    if (!data.audioContent) return false;

    // Play the returned base64 MP3
    if (googleTtsAudio) { googleTtsAudio.pause(); }
    googleTtsAudio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
    await googleTtsAudio.play();
    return true;
  } catch (e) {
    console.warn('Google TTS failed, falling back to Web Speech API', e);
    return false;
  }
}

/**
 * Speaks a text in any target language.
 * Tries Google Cloud TTS (neural) first, falls back to Web Speech API.
 */
export function speakLanguageText(text: string, ttsCode: string = 'zh-CN', rate?: number): Promise<boolean> {
  const effectiveRate = rate || 0.85;
  const cleanText = text.replace(/[?？.。!！,，;；:：]/g, '');

  return new Promise(async (resolve) => {
    // Try Google Cloud TTS first
    const googleOk = await speakWithGoogleTTS(cleanText, ttsCode, effectiveRate);
    if (googleOk) { resolve(true); return; }

    // Fallback: Web Speech API
    try {
      if (!('speechSynthesis' in window)) { resolve(false); return; }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = ttsCode;
      utterance.rate = effectiveRate;
      const voices = window.speechSynthesis.getVoices();
      const prefix = ttsCode.split('-')[0].toLowerCase();
      const matchVoice = voices.find(v => v.lang.toLowerCase().startsWith(prefix));
      if (matchVoice) utterance.voice = matchVoice;
      utterance.onend = () => resolve(true);
      utterance.onerror = () => resolve(false);
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('TTS speaking failed', e);
      resolve(false);
    }
  });
}

/**
 * Backwards compatible alias for Chinese
 */
export function speakChinese(text: string, rate?: number): Promise<boolean> {
  return speakLanguageText(text, 'zh-CN', rate);
}
