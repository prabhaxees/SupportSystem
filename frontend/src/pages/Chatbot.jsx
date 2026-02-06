import { useEffect, useRef, useState } from "react";
import { apiRequest } from "../api/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

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
    <div style={styles.container}>
      <h2>Support Chatbot 🤖</h2>

      <div style={styles.chatBox}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              background: msg.role === "user" ? "#4a00f7" : "#363636"
            }}
          >
            {msg.text}
          </div>
        ))}

        {loading && (
          <div style={{ ...styles.message, background: "#363636" }}>
            Bot is typing…
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div style={styles.inputBox}>
        <input
          style={styles.input}
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} disabled={loading}>
          Send
        </button>
      </div>
    </div>
    </>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "20px auto",
    display: "flex",
    flexDirection: "column",
    height: "80vh"
  },
  chatBox: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "10px",
    border: "1px solid #919191",
    borderRadius: "8px",
    overflowY: "auto"
  },
  message: {
    padding: "10px",
    borderRadius: "8px",
    maxWidth: "70%"
  },
  inputBox: {
    display: "flex",
    gap: "10px",
    marginTop: "10px"
  },
  input: {
    flex: 1,
    padding: "10px"
  }
};
