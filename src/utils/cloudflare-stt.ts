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
  return ''; // 让浏览器自己选
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

    // 不传 timeslice，让 ondataavailable 在 stop() 时触发
    mediaRecorder.start();

    const actualMimeType = mediaRecorder.mimeType || mimeType || 'audio/webm';

    const stop = (): Promise<Blob> => {
      return new Promise((resolve) => {
        // 设置超时，防止 onstop 永远不触发
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

        // 先请求剩余数据，再停止
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.requestData();
          // 给 requestData 一点时间，然后 stop
          setTimeout(() => {
            if (mediaRecorder.state === 'recording') {
              mediaRecorder.stop();
            } else {
              // 已经停了，手动触发
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

// 发送音频到 Cloudflare Whisper API 进行识别
export async function transcribeAudio(audioBlob: Blob): Promise<{ text: string; success: boolean; error?: string }> {
  const formData = new FormData();
  const mimeType = audioBlob.type;
  const ext = mimeType.includes('mp4') ? 'm4a'
    : mimeType.includes('ogg') ? 'ogg'
    : mimeType.includes('wav') ? 'wav'
    : 'webm';
  formData.append('file', audioBlob, `audio.${ext}`);

  console.log('[Cloudflare STT] 发送音频:', { size: audioBlob.size, mimeType, ext });

  try {
    // 设置 15 秒超时（AbortController）
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(STT_API, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    console.log('[Cloudflare STT] 响应状态:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Cloudflare STT] 服务器错误:', errorText);
      let errorMsg = `服务器错误 (${response.status})`;
      try {
        const errorData = JSON.parse(errorText);
        errorMsg = errorData.error || errorMsg;
      } catch {}
      return { text: '', success: false, error: errorMsg };
    }

    const data = await response.json();
    console.log('[Cloudflare STT] 识别结果:', data);
    return { text: data.text || '', success: true };
  } catch (err) {
    console.error('[Cloudflare STT] 网络错误:', err);
    if (err instanceof DOMException && err.name === 'AbortError') {
      return { text: '', success: false, error: '识别超时，请检查网络后重试' };
    }
    return {
      text: '',
      success: false,
      error: err instanceof Error ? err.message : '网络连接失败，请检查网络后重试',
    };
  }
}

// 检测是否支持 MediaRecorder
export function isMediaRecorderSupported(): boolean {
  return !!(typeof navigator !== 'undefined' && 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices && typeof window.MediaRecorder !== 'undefined');
}
