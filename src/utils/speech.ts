// 语音相关工具函数

// 检测是否为微信浏览器
export function isWeChatBrowser(): boolean {
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes('micromessenger');
}

// 检测是否为移动端
export function isMobileDevice(): boolean {
  return /android|iphone|ipad|ipod|webos/i.test(navigator.userAgent.toLowerCase());
}

// 检查浏览器是否支持语音识别
export function isSpeechRecognitionSupported(): boolean {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

// 检查浏览器是否支持语音合成
export function isSpeechSynthesisSupported(): boolean {
  return !!window.speechSynthesis;
}

// 检查 TTS 是否实际可用（微信中可能 API 存在但无法出声）
export async function checkTtsActuallyWorks(): Promise<boolean> {
  if (!isSpeechSynthesisSupported()) return false;

  // 微信浏览器中 SpeechSynthesis 经常有 API 但无声
  if (isWeChatBrowser()) {
    // 尝试播放一个简短测试音
    return new Promise((resolve) => {
      try {
        const utterance = new SpeechSynthesisUtterance('test');
        utterance.volume = 0; // 静音测试
        utterance.rate = 2;   // 快速结束
        let resolved = false;
        
        const timeout = setTimeout(() => {
          if (!resolved) { resolved = true; resolve(false); }
        }, 3000);

        utterance.onstart = () => {
          // API 能启动，说明可能可用
          window.speechSynthesis.cancel();
          if (!resolved) { resolved = true; clearTimeout(timeout); resolve(true); }
        };
        utterance.onerror = () => {
          if (!resolved) { resolved = true; clearTimeout(timeout); resolve(false); }
        };
        utterance.onend = () => {
          if (!resolved) { resolved = true; clearTimeout(timeout); resolve(true); }
        };
        window.speechSynthesis.speak(utterance);
      } catch {
        resolve(false);
      }
    });
  }
  return true;
}

// 创建语音识别实例
export function createSpeechRecognition(): SpeechRecognition | null {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return null;

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = true;   // 开启中间结果，用于检测用户是否在说话
  recognition.maxAlternatives = 5;     // 更多备选结果
  recognition.continuous = false;      // 安卓兼容：continuous:true 在安卓上有 Chromium bug
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

    const synth = window.speechSynthesis;

    // 重要：先取消所有正在进行的语音，清除队列
    synth.cancel();

    // 微信浏览器中需要额外延迟确保 cancel 生效
    const startSpeaking = () => {
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

      let hasEnded = false;

      utterance.onstart = () => {
        // TTS 成功启动
      };

      utterance.onend = () => {
        if (!hasEnded) {
          hasEnded = true;
          resolve();
        }
      };

      utterance.onerror = (e) => {
        if (!hasEnded) {
          hasEnded = true;
          // 微信中常见 'canceled' 或 'interrupted' 错误
          // 如果是因为我们主动 cancel 导致的，忽略
          if (e.error === 'canceled' || e.error === 'interrupted') {
            // 尝试重新播放
            setTimeout(() => {
              const retryUtterance = new SpeechSynthesisUtterance(text);
              retryUtterance.lang = 'en-US';
              retryUtterance.rate = 0.75;
              retryUtterance.pitch = 1.05;
              retryUtterance.volume = 1;
              const retryVoice = getBestFemaleVoice();
              if (retryVoice) retryUtterance.voice = retryVoice;
              
              let retryResolved = false;
              retryUtterance.onend = () => {
                if (!retryResolved) { retryResolved = true; resolve(); }
              };
              retryUtterance.onerror = () => {
                if (!retryResolved) { retryResolved = true; reject(e); }
              };
              // 设置超时防止卡死
              setTimeout(() => {
                if (!retryResolved) { retryResolved = true; resolve(); }
              }, 10000);
              
              window.speechSynthesis.speak(retryUtterance);
            }, 200);
            return;
          }
          reject(e);
        }
      };

      // 设置超时防止卡死（微信中 TTS 可能永远不触发 onend）
      setTimeout(() => {
        if (!hasEnded) {
          hasEnded = true;
          resolve(); // 静默成功，不阻塞用户体验
        }
      }, 15000);

      synth.speak(utterance);
    };

    // voices 可能是异步加载的，如果首次加载为空则等待
    if (synth.getVoices().length === 0) {
      const handleVoicesChanged = () => {
        synth.removeEventListener('voiceschanged', handleVoicesChanged);
        startSpeaking();
      };
      synth.addEventListener('voiceschanged', handleVoicesChanged);
      
      // 如果 2 秒内 voices 还没加载，直接开始
      setTimeout(() => {
        synth.removeEventListener('voiceschanged', handleVoicesChanged);
        if (synth.getVoices().length === 0) {
          startSpeaking();
        }
      }, 2000);
    } else {
      // 微信浏览器中需要一个小延迟
      if (isWeChatBrowser()) {
        setTimeout(startSpeaking, 100);
      } else {
        startSpeaking();
      }
    }
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
