// 语音相关工具函数

// 检查浏览器是否支持语音识别
export function isSpeechRecognitionSupported(): boolean {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

// 检查浏览器是否支持语音合成
export function isSpeechSynthesisSupported(): boolean {
  return !!window.speechSynthesis;
}

// 创建语音识别实例
export function createSpeechRecognition(): SpeechRecognition | null {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return null;

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 3;
  recognition.continuous = false;
  return recognition;
}

// 获取最佳英语女声
function getBestFemaleVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  const preferredVoices = [
    'Google US English',
    'Google UK English Female',
    'Microsoft Zira',
    'Samantha',
    'Karen',
    'Moira',
    'Fiona',
    'Veena',
    'Microsoft Susan',
    'Microsoft Hazel',
  ];

  for (const preferred of preferredVoices) {
    const match = voices.find(v =>
      v.name.includes(preferred) && v.lang.startsWith('en')
    );
    if (match) return match;
  }

  const usFemale = voices.find(v =>
    v.lang === 'en-US' && v.name.toLowerCase().includes('female')
  );
  if (usFemale) return usFemale;

  const enFemale = voices.find(v =>
    v.lang.startsWith('en') && v.name.toLowerCase().includes('female')
  );
  if (enFemale) return enFemale;

  const usAny = voices.find(v => v.lang === 'en-US');
  if (usAny) return usAny;

  return voices[0];
}

// 朗读单词或短句
export function speakWord(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!isSpeechSynthesisSupported()) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.75;
    utterance.pitch = 1.05;
    utterance.volume = 1;

    const voice = getBestFemaleVoice();
    if (voice) {
      utterance.voice = voice;
    }

    if (!voice && window.speechSynthesis.getVoices().length === 0) {
      const handleVoicesChanged = () => {
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
        const retryVoice = getBestFemaleVoice();
        if (retryVoice) {
          utterance.voice = retryVoice;
        }
        window.speechSynthesis.speak(utterance);
      };
      window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
    }

    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(e);

    window.speechSynthesis.speak(utterance);
  });
}

// 比对识别结果与目标单词
export function compareWords(recognized: string, target: string): boolean {
  if (!recognized || !target) return false;

  const r = recognized.trim().toLowerCase();
  const t = target.trim().toLowerCase();

  if (r === t) return true;

  const rClean = r.replace(/[.,!?;:'"]/g, '').trim();
  const tClean = t.replace(/[.,!?;:'"]/g, '').trim();
  if (rClean === tClean) return true;

  const targetWords = tClean.split(/\s+/);
  const recognizedWords = rClean.split(/\s+/);

  if (targetWords.length > 1) {
    const allMatch = targetWords.every(tw =>
      recognizedWords.some(rw => rw === tw)
    );
    if (allMatch) return true;
  }

  if (recognizedWords.includes(tClean)) return true;
  if (rClean.includes(tClean)) return true;

  return false;
}
