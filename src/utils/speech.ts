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
// 按优先级排列：Google 女声 > 系统英语女声 > 默认英语声
function getBestFemaleVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  // 优先：Google US English 女声（Chrome 内置，最自然）
  const preferredVoices = [
    'Google US English',           // Chrome 美式女声
    'Google UK English Female',    // Chrome 英式女声
    'Microsoft Zira',              // Windows 美式女声
    'Samantha',                    // macOS 女声
    'Karen',                       // macOS 澳式女声
    'Moira',                       // macOS 爱尔兰女声
    'Fiona',                       // macOS 苏格兰女声
    'Veena',                       // macOS 印度女声
    'Microsoft Susan',             // Windows 英式女声
    'Microsoft Hazel',             // Windows 英式女声
  ];

  for (const preferred of preferredVoices) {
    const match = voices.find(v =>
      v.name.includes(preferred) && v.lang.startsWith('en')
    );
    if (match) return match;
  }

  // 退而求其次：任意 en-US 女声
  const usFemale = voices.find(v =>
    v.lang === 'en-US' && v.name.toLowerCase().includes('female')
  );
  if (usFemale) return usFemale;

  // 再退：任意英语女声
  const enFemale = voices.find(v =>
    v.lang.startsWith('en') && v.name.toLowerCase().includes('female')
  );
  if (enFemale) return enFemale;

  // 最后退：任意 en-US 声
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

    // 取消任何正在进行的语音
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.75;   // 比默认慢一点，适合跟读
    utterance.pitch = 1.05;  // 稍高音调，更像自然女声
    utterance.volume = 1;

    // 选择最佳女声
    const voice = getBestFemaleVoice();
    if (voice) {
      utterance.voice = voice;
    }

    // voices 可能是异步加载的，如果首次加载为空则重试
    if (!voice && window.speechSynthesis.getVoices().length === 0) {
      // 延迟获取 voices（Chrome 需要等 voiceschanged 事件）
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
// 使用模糊匹配策略
export function compareWords(recognized: string, target: string): boolean {
  if (!recognized || !target) return false;

  // 标准化：去除首尾空格、转小写
  const r = recognized.trim().toLowerCase();
  const t = target.trim().toLowerCase();

  // 完全匹配
  if (r === t) return true;

  // 去除标点符号后匹配
  const rClean = r.replace(/[.,!?;:'"]/g, '').trim();
  const tClean = t.replace(/[.,!?;:'"]/g, '').trim();
  if (rClean === tClean) return true;

  // 多词短语：检查是否所有目标词都在识别结果中
  const targetWords = tClean.split(/\s+/);
  const recognizedWords = rClean.split(/\s+/);

  if (targetWords.length > 1) {
    const allMatch = targetWords.every(tw =>
      recognizedWords.some(rw => rw === tw)
    );
    if (allMatch) return true;
  }

  // 对于单词本身就在识别结果中的情况
  if (recognizedWords.includes(tClean)) return true;

  // 识别结果包含目标词
  if (rClean.includes(tClean)) return true;

  return false;
}
