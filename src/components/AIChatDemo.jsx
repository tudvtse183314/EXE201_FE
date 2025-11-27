import React, { useState } from "react";
import { generateContent } from "../services/gemini";
import ReactMarkdown from "react-markdown";

export default function AIChatDemo() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    setLoading(true);

    try {
      const botRes = await generateContent(input);
      setMessages(prev => [...prev, { user: input, bot: botRes }]);
      setInput("");
    } catch (err) {
      console.error("AIChat error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>Gemini AI Chat Test</h3>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ padding: 8, width: "70%", marginRight: 10 }}
        placeholder="Nhập gì đó để hỏi AI..."
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSend();
          }
        }}
      />
      <button onClick={handleSend} disabled={loading}>
        {loading ? "Đang gửi..." : "Send"}
      </button>

      {loading && <p>Đang xử lý...</p>}

      {messages.map((msg, i) => (
        <div key={i} style={{ marginTop: 20, padding: 10, border: "1px solid #ddd", borderRadius: 8 }}>
          <p><b>Bạn:</b> {msg.user}</p>
          <p><b>AI:</b></p>
          <div style={{ marginLeft: 20 }}>
            <ReactMarkdown>{msg.bot}</ReactMarkdown>
          </div>
        </div>
      ))}
    </div>
  );
}

