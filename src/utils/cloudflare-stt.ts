// Cloudflare Workers AI Whisper 语音识别
// 用于移动端（不支持 Web Speech API 时）

const STT_API = 'https://english-stt.liuqiming168.workers.dev';

// 使用 MediaRecorder 录制音频
export function startRecording(): Promise<{ stop: () => Promise<Blob> }> {
  return navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm',
    });

    const chunks: Blob[] = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    mediaRecorder.start();

    const stop = (): Promise<Blob> => {
      return new Promise((resolve) => {
        mediaRecorder.onstop = () => {
          // 停止所有轨道
          stream.getTracks().forEach((t) => t.stop());
          const blob = new Blob(chunks, { type: mediaRecorder.mimeType });
          resolve(blob);
        };
        mediaRecorder.stop();
      });
    };

    return { stop };
  });
}

// 发送音频到 Cloudflare Whisper API 进行识别
export async function transcribeAudio(audioBlob: Blob): Promise<{ text: string; success: boolean; error?: string }> {
  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.webm');

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
