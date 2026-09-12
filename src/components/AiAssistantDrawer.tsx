import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Send,
  HelpCircle,
  Wheat,
  Bot,
  User as UserIcon,
  BookOpen,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { api } from '../services/api.js';

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = [
  "Which high-frequency topic has highest 80/20 yield?",
  "What are the top 10-mark recurring questions in this course?",
  "Show me step-by-step solutions for recent FAT questions",
  "How should I pace my time across Part A and Part B?",
];

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hello! I am **Bread AI**, your exam intelligence copilot. I am grounded directly in your 5 years of Previous Year Question Papers (2021-2025). Ask me anything about recurring patterns, high-frequency topics, or step-by-step solutions!",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const newMsgs: Message[] = [...messages, { role: 'user', content: query }];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);

    try {
      const res = await api.askAssistant(query);
      setMessages([...newMsgs, { role: 'assistant', content: res.reply }]);
    } catch (e: any) {
      setMessages([
        ...newMsgs,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error connecting to the exam intelligence engine. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-md w-full bg-stone-900 border-l border-stone-800 shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Top bar */}
        <div className="p-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Bread AI Exam Assistant</span>
              </h3>
              <span className="text-[10px] text-emerald-400 font-mono">
                [Grounded in 5-Year PYQs]
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 text-xs leading-relaxed ${
                m.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.role === 'assistant' && (
                <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`p-3.5 rounded-2xl max-w-[85%] ${
                  m.role === 'user'
                    ? 'bg-amber-500 text-stone-950 font-medium'
                    : 'bg-stone-950 border border-stone-800 text-stone-200'
                }`}
              >
                <div className="prose prose-invert prose-xs">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              </div>

              {m.role === 'user' && (
                <div className="w-6 h-6 rounded-lg bg-stone-800 flex items-center justify-center text-stone-300 shrink-0 mt-0.5">
                  <UserIcon className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-2 items-center text-xs text-stone-400 p-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>Analyzing historical questions and crafting answer...</span>
            </div>
          )}
        </div>

        {/* Suggested Chips */}
        <div className="p-3 border-t border-stone-800 bg-stone-950/50 space-y-2">
          <div className="text-[10px] uppercase font-bold text-stone-400">
            Suggested Prompts
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTIONS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(s)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-stone-900 border border-stone-800 hover:border-amber-500/50 text-stone-300 text-left transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-stone-800 bg-stone-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about the exam..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 disabled:opacity-40 transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
