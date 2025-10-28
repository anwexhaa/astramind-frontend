"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setInput("");

    try {
      const res = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });

      const data = await res.json();
      const aiText =
        data?.answer ||
        data?.response ||
        data?.error ||
        "No response from AstraMind.";

      const aiMessage: ChatMessage = { role: "assistant", text: aiText };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Chat request failed." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-6"
      >
        <h1
          className="text-4xl font-extrabold bg-clip-text text-transparent 
          bg-gradient-to-r from-[#F8C8DC] via-[#FFE6A7] to-[#FFD6D6]
          border-none outline-none shadow-none drop-shadow-none"
          style={{ WebkitTextFillColor: "transparent" }}
        >
          AstraMind Chat
        </h1>
        <p className="text-zinc-400 mt-1 text-sm tracking-wide">
          Converse, analyze, and explore insights effortlessly
        </p>
      </motion.div>

      {/* Chat container */}
      <div className="flex-1 overflow-y-auto rounded-3xl p-6 bg-[#0a0a0a]/90 backdrop-blur-xl border border-zinc-800/50 shadow-[0_0_25px_rgba(255,255,255,0.05)] space-y-4 scroll-smooth">
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center text-zinc-500 text-sm italic">
            Start chatting with AstraMind...
          </div>
        )}

        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex items-start gap-2 max-w-[75%] ${
                m.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`p-2 rounded-full ${
                  m.role === "user"
                    ? "bg-gradient-to-br from-[#F8C8DC] to-[#FFE6A7]"
                    : "bg-[#111]"
                }`}
              >
                {m.role === "user" ? (
                  <User size={18} className="text-black" />
                ) : (
                  <Bot size={18} className="text-[#FFE6A7]" />
                )}
              </div>

              <div
                className={`px-4 py-2 rounded-2xl text-sm leading-relaxed backdrop-blur-md ${
                  m.role === "user"
                    ? "bg-gradient-to-r from-[#F8C8DC] to-[#FFE6A7] text-black shadow-md"
                    : "bg-[#0d0d0d]/80 text-gray-200 border border-zinc-800/40"
                }`}
              >
                {/* @ts-ignore */}
                <div className="prose prose-invert max-w-none">
  <ReactMarkdown>{m.text}</ReactMarkdown>
</div>
              </div>
            </div>
          </motion.div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-zinc-400 text-sm italic">
            <Loader2 className="animate-spin w-4 h-4" /> Thinking...
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={sendMessage}
        className="mt-5 flex items-center gap-3 bg-[#0b0b0b]/90 border border-zinc-800/50 rounded-full px-5 py-3 shadow-inner backdrop-blur-md"
      >
        <input
          type="text"
          placeholder="Ask about your reports..."
          className="flex-1 bg-transparent outline-none text-zinc-100 placeholder-zinc-500 text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="p-2.5 rounded-full bg-gradient-to-r from-[#F8C8DC] to-[#FFE6A7] hover:opacity-90 transition disabled:opacity-50 shadow-[0_0_15px_rgba(255,230,167,0.3)]"
        >
          <Send size={18} className="text-black" />
        </button>
      </form>
    </div>
  );
}
