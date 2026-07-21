// 硅基流动 SenseVoice 语音识别 API
// 国内直连，免费额度，支持中英文

// TODO: 在 https://siliconflow.cn 注册后获取 API Key 填入这里
const SILICONFLOW_API_KEY = 'sk-dhxpgcruymrljkttpftodjjqqctzeiqmoggbhaynkhgeiprf';
const STT_API = 'https://api.siliconflow.cn/v1/audio/transcriptions';
const STT_MODEL = 'FunAudioLLM/SenseVoiceSmall';

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
  return '';
}

// 使用 MediaRecorder 录制音频
export function startRecording(): Promise<{ stop: () => Promise<Blob>; mimeType: string }> {
  return navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    const mimeType = getSupportedMimeType();
    const options: MediaRecorderOptions = {};
    if (mimeType) options.mimeType = mimeType;

    const mediaRecorder = new MediaRecorder(stream, options);
    const chunks: Blob[] = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    mediaRecorder.start();

    const actualMimeType = mediaRecorder.mimeType || mimeType || 'audio/webm';

    const stop = (): Promise<Blob> => {
      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          console.warn('[录音] onstop 超时，使用已有数据');
          stream.getTracks().forEach((t) => t.stop());
          const blob = new Blob(chunks, { type: actualMimeType });
          resolve(blob);
        }, 3000);

        mediaRecorder.onstop = () => {
          clearTimeout(timeout);
          stream.getTracks().forEach((t) => t.stop());
          const blob = new Blob(chunks, { type: actualMimeType });
          resolve(blob);
        };

        if (mediaRecorder.state === 'recording') {
          mediaRecorder.requestData();
          setTimeout(() => {
            if (mediaRecorder.state === 'recording') {
              mediaRecorder.stop();
            } else {
              stream.getTracks().forEach((t) => t.stop());
              const blob = new Blob(chunks, { type: actualMimeType });
              resolve(blob);
            }
          }, 150);
        } else {
          stream.getTracks().forEach((t) => t.stop());
          const blob = new Blob(chunks, { type: actualMimeType });
          resolve(blob);
        }
      });
    };

    return { stop, mimeType: actualMimeType };
  });
}

// 发送音频到硅基流动 SenseVoice API 进行识别
export async function transcribeAudio(audioBlob: Blob): Promise<{ text: string; success: boolean; error?: string }> {
  if (!SILICONFLOW_API_KEY) {
    return { text: '', success: false, error: 'API Key 未配置，请在代码中填入硅基流动 API Key' };
  }

  const formData = new FormData();
  const mimeType = audioBlob.type;
  const ext = mimeType.includes('mp4') ? 'm4a'
    : mimeType.includes('ogg') ? 'ogg'
    : mimeType.includes('wav') ? 'wav'
    : 'webm';
  formData.append('file', audioBlob, `audio.${ext}`);
  formData.append('model', STT_MODEL);

  console.log('[SenseVoice] 发送音频:', { size: audioBlob.size, mimeType, ext });

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(STT_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SILICONFLOW_API_KEY}`,
      },
      body: formData,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    console.log('[SenseVoice] 响应状态:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[SenseVoice] 服务器错误:', errorText);
      let errorMsg = `服务器错误 (${response.status})`;
      try {
        const errorData = JSON.parse(errorText);
        errorMsg = errorData.message || errorData.error || errorMsg;
      } catch {}
      return { text: '', success: false, error: errorMsg };
    }

    const data = await response.json();
    console.log('[SenseVoice] 识别结果:', data);
    return { text: data.text || '', success: true };
  } catch (err) {
    console.error('[SenseVoice] 网络错误:', err);
    if (err instanceof DOMException && err.name === 'AbortError') {
      return { text: '', success: false, error: '识别超时，请检查网络后重试' };
    }
    return {
      text: '',
      success: false,
      error: err instanceof Error ? err.message : '网络连接失败',
    };
  }
}

// 检测是否支持 MediaRecorder
export function isMediaRecorderSupported(): boolean {
  return !!(typeof navigator !== 'undefined' && 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices && typeof window.MediaRecorder !== 'undefined');
}
