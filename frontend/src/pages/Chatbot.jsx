import { useEffect, useRef, useState } from "react";
import { apiRequest } from "../api/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "../styles/chatbot.css";

export default function Chatbot() {
  const { token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const data = await apiRequest(
        "/api/chatbot",
        "POST",
        { message: input },
        token
      );

      const botMessage = {
        role: "bot",
        text: data.reply || "No response"
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Error talking to chatbot." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="chatbot-page">
        <div className="chatbot-card">
          <h2 className="chatbot-title">Support Chatbot ??</h2>

          <div className="chatbot-box">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chatbot-message ${msg.role === "user" ? "user" : "bot"}`}
              >
                {msg.text}
              </div>
            ))}

            {loading && (
              <div className="chatbot-message bot typing">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="chatbot-input-row">
            <input
              className="chatbot-input"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button className="chatbot-send" onClick={sendMessage} disabled={loading}>
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
