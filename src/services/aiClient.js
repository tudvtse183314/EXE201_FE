import axiosInstance from "../api/axios";

// Non-stream chat: POST /api/ai/gemini/chat
export const geminiChat = async ({ message, history, contextData }) => {
  const { data } = await axiosInstance.post("/ai/gemini/chat", {
    message,
    history,
    stream: false,
    contextData,
  });
  return data?.text || "";
};

// Stream chat: POST /api/ai/gemini/chat-stream (SSE-like via fetch)
export const geminiChatStream = ({ message, history, contextData, onChunk, onDone, onError }) => {
  const ctrl = new AbortController();
  const baseURL = axiosInstance.defaults.baseURL?.replace(/\/$/, "") || "";
  fetch(`${baseURL}/ai/gemini/chat-stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history, stream: true, contextData }),
    signal: ctrl.signal,
  })
    .then((res) => {
      if (!res.body) throw new Error("No response body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      const pump = () => reader.read().then(({ done, value }) => {
        if (done) { onDone?.(); return; }
        const chunk = decoder.decode(value);
        if (chunk.includes("[[END]]")) { onDone?.(); return; }
        onChunk?.(chunk);
        return pump();
      });
      return pump();
    })
    .catch((err) => {
      onError?.(err);
    });
  return () => ctrl.abort();
};

export default {
  geminiChat,
  geminiChatStream,
};


