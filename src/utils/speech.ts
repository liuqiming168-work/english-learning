// 语音相关工具函数

// 硅基流动 TTS API 配置
const TTS_API = 'https://api.siliconflow.cn/v1/audio/speech';
const TTS_KEY = 'sk-dhxpgcruymrljkttpftodjjqqctzeiqmoggbhaynkhgeiprf';
const TTS_MODEL = 'FunAudioLLM/CosyVoice2-0.5B';
const TTS_VOICE = 'FunAudioLLM/CosyVoice2-0.5B:anna'; // anna: 自然女声，英语效果好

// 检测是否为移动设备
export function isMobileDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent);
}

// 检查浏览器是否支持语音识别（且非移动端 — Android Chrome 有 bug）
export function isSpeechRecognitionSupported(): boolean {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

// 检查是否应使用 Web Speech API（桌面端且浏览器支持）
export function shouldUseWebSpeech(): boolean {
  return !isMobileDevice() && isSpeechRecognitionSupported();
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

// ========== TTS: CosyVoice2 API（优先）+ 浏览器降级 ==========

// 使用 CosyVoice2 API 生成自然语音
async function speakWithCosyVoice(text: string): Promise<void> {
  const response = await fetch(TTS_API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TTS_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: TTS_MODEL,
      input: text,
      voice: TTS_VOICE,
      response_format: 'mp3',
      speed: 0.85,  // 稍慢，适合跟读
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`TTS API error: ${response.status}`);
  }

  const audioBlob = await response.blob();
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);

  return new Promise((resolve, reject) => {
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
      resolve();
    };
    audio.onerror = () => {
      URL.revokeObjectURL(audioUrl);
      reject(new Error('播放失败'));
    };
    audio.play().catch(reject);
  });
}

// 浏览器内置 TTS 降级方案
function speakWithBrowser(text: string): Promise<void> {
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

    // 选择最佳女声
    const voices = window.speechSynthesis.getVoices();
    const preferred = [
      'Google US English', 'Google UK English Female',
      'Samantha', 'Karen', 'Microsoft Zira',
    ];
    for (const p of preferred) {
      const match = voices.find(v => v.name.includes(p) && v.lang.startsWith('en'));
      if (match) { utterance.voice = match; break; }
    }

    // 如果 voices 为空，等待加载
    if (voices.length === 0) {
      const handler = () => {
        window.speechSynthesis.removeEventListener('voiceschanged', handler);
        const retryVoices = window.speechSynthesis.getVoices();
        for (const p of preferred) {
          const match = retryVoices.find(v => v.name.includes(p) && v.lang.startsWith('en'));
          if (match) { utterance.voice = match; break; }
        }
        window.speechSynthesis.speak(utterance);
      };
      window.speechSynthesis.addEventListener('voiceschanged', handler);
    }

    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(e);

    window.speechSynthesis.speak(utterance);
  });
}

// 朗读单词或短句（优先 CosyVoice2，失败降级浏览器 TTS）
export async function speakWord(text: string): Promise<void> {
  try {
    await speakWithCosyVoice(text);
  } catch {
    // CosyVoice2 失败，降级到浏览器内置 TTS
    try {
      await speakWithBrowser(text);
    } catch {
      // 都失败了，忽略
      console.warn('TTS 播放失败:', text);
    }
  }
}

// ========== 单词比对 ==========

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
