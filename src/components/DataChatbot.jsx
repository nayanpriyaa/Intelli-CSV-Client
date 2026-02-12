import { useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";


export default function DataChatbot({ csvData }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
const ask = async () => {
  if (!input) return;

  const userMsg = { role: "user", text: input };
  setMessages((m) => [...m, userMsg]);
  setInput("");

  try {
    const res = await fetch("http://localhost:4000/api/chat/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: input,
        csvData: csvData || [],
      }),
    });

    const data = await res.json();

    setMessages((m) => [
      ...m,
      { role: "bot", text: data.reply || "No reply" },
    ]);
  } catch (err) {
    setMessages((m) => [
      ...m,
      { role: "bot", text: "Server error" },
    ]);
  }
};


  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-cyan-500 text-black px-4 py-3 rounded-full shadow-lg hover-lift"
      >
        Ask CSV
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-24 right-6 w-96 bg-[#0b0b0e] border border-white/10 rounded-xl shadow-xl p-4"
        >
          <div className="h-64 overflow-y-auto space-y-3 text-sm">
  {messages.map((m, i) => (
    <div
      key={i}
      className={`text-sm leading-relaxed ${
        m.role === "user" ? "text-cyan-400" : "text-white/90"
      }`}
    >
      <ReactMarkdown
        components={{
          p: ({node, ...props}) => <p className="mb-2" {...props} />,
          li: ({node, ...props}) => <li className="ml-4 list-disc" {...props} />,
          h1: ({node, ...props}) => <h1 className="text-lg font-bold mb-2" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-md font-semibold mb-2" {...props} />,
        }}
      >
        {m.text}
      </ReactMarkdown>
    </div>
  ))}
</div>


          <div className="flex gap-2 mt-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your data…"
              className="input-dark flex-1"
            />
            <button
              onClick={ask}
              className="bg-cyan-500 text-black px-3 rounded-lg"
            >
              →
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
}
