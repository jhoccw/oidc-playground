
import React, { useState, useRef, useEffect } from 'react';
import { getOIDCHelp } from '../services/geminiService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const GeminiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am your OIDC expert assistant. Paste an error message, ask about claims, or describe an issue with your auth flow.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await getOIDCHelp(input);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error processing that request.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-250px)] bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <h2 className="font-bold text-zinc-200">AI OIDC Assistant</h2>
        </div>
        <span className="text-[10px] bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded uppercase font-bold tracking-widest">Powered by Gemini</span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none shadow-lg shadow-blue-900/10' 
                : 'bg-zinc-800 text-zinc-300 rounded-bl-none border border-zinc-700'
            }`}>
              <div className="whitespace-pre-wrap">
                {m.content}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-zinc-800 text-zinc-500 rounded-2xl px-4 py-3 border border-zinc-700 animate-pulse">
              Thinking...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-zinc-950/50 border-t border-zinc-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="e.g. Why am I getting 'invalid_grant' when exchanging code?"
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-sm font-bold transition-all"
          >
            Ask
          </button>
        </div>
      </div>
    </div>
  );
};
