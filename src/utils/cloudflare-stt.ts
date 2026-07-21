// Cloudflare Workers AI Whisper 语音识别
// 用于移动端（不支持 Web Speech API 时）

const STT_API = 'https://english-stt.liuqiming168.workers.dev';

// 获取浏览器支持的音频 MIME 类型
function getSupportedMimeType(): string {
  const types = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus',
    'audio/wav',
  ];
  for (const t of types) {
    if (MediaRecorder.isTypeSupported(t)) return t;
  }
  return 'audio/webm'; // 默认
}

// 使用 MediaRecorder 录制音频
export function startRecording(): Promise<{ stop: () => Promise<Blob> }> {
  return navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    const mimeType = getSupportedMimeType();
    const mediaRecorder = new MediaRecorder(stream, { mimeType });

    const chunks: Blob[] = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    // 每秒收集一次数据（确保及时获取音频数据）
    mediaRecorder.start(1000);

    const stop = (): Promise<Blob> => {
      return new Promise((resolve) => {
        mediaRecorder.onstop = () => {
          // 停止所有轨道
          stream.getTracks().forEach((t) => t.stop());
          const blob = new Blob(chunks, { type: mimeType });
          resolve(blob);
        };
        // 确保还有数据没写入
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.requestData();
          setTimeout(() => mediaRecorder.stop(), 100);
        } else {
          mediaRecorder.stop();
        }
      });
    };

    return { stop };
  });
}

// 发送音频到 Cloudflare Whisper API 进行识别
export async function transcribeAudio(audioBlob: Blob): Promise<{ text: string; success: boolean; error?: string }> {
  const formData = new FormData();
  // 根据 mimeType 设置合适的文件扩展名
  const mimeType = audioBlob.type;
  const ext = mimeType.includes('mp4') ? 'm4a'
    : mimeType.includes('ogg') ? 'ogg'
    : mimeType.includes('wav') ? 'wav'
    : 'webm';
  formData.append('file', audioBlob, `audio.${ext}`);

  try {
    const response = await fetch(STT_API, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { text: '', success: false, error: errorData.error || `服务器错误 (${response.status})` };
    }

    const data = await response.json();
    return { text: data.text || '', success: true };
  } catch (err) {
    return {
      text: '',
      success: false,
      error: err instanceof Error ? err.message : '网络连接失败',
    };
  }
}

// 检测是否支持 MediaRecorder（需要录音权限）
export function isMediaRecorderSupported(): boolean {
  return !!(typeof navigator !== 'undefined' && 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices && typeof window.MediaRecorder !== 'undefined');
}
