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
 * Speaks a text in any target language using SpeechSynthesis with custom BCP-47 code and speed rate
 */
export function speakLanguageText(text: string, ttsCode: string = 'zh-CN', rate?: number): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      if (!('speechSynthesis' in window)) {
        console.warn('TTS not supported');
        resolve(false);
        return;
      }
      
      // Stop current speaking
      window.speechSynthesis.cancel();
      
      // Filter out punctuation that might sound weird in standard speech synthesis
      const cleanText = text.replace(/[?？.。!！,，;；:：]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = ttsCode;
      utterance.rate = rate || 0.85; // custom rate, defaults to slightly slower for language learners

      // Try to find a matching voice for language prefix (e.g. 'es', 'fr', 'en', 'zh', etc.)
      const voices = window.speechSynthesis.getVoices();
      const prefix = ttsCode.split('-')[0].toLowerCase();
      const matchVoice = voices.find(v => v.lang.toLowerCase().startsWith(prefix));
      if (matchVoice) {
        utterance.voice = matchVoice;
      }
      
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
