import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  BookOpen,
  Layers,
  Award,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { Question, Topic, ExaminerInsight } from '../types.js';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  topics: Topic[];
  insights: ExaminerInsight[];
  onSelectResult: (type: 'question' | 'topic' | 'insight', data: any) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  questions,
  topics,
  insights,
  onSelectResult,
}) => {
  const [query, setQuery] = useState('');

  // Keyboard shortcut Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const matchedQuestions = q
    ? questions.filter(
        (item) =>
          item.questionText.toLowerCase().includes(q) ||
          item.concept.toLowerCase().includes(q)
      ).slice(0, 5)
    : [];

  const matchedTopics = q
    ? topics.filter((item) => item.name.toLowerCase().includes(q)).slice(0, 4)
    : [];

  const matchedInsights = q
    ? insights.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.observation.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-start justify-center pt-20 p-4">
      <div className="bg-stone-900 border border-stone-700 rounded-3xl max-w-2xl w-full p-4 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Search Input */}
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-amber-400 absolute left-4" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across questions, topics, concepts, insights..."
            className="w-full pl-12 pr-10 py-3 rounded-2xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-amber-500"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 text-stone-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto space-y-4 p-2">
          {!query ? (
            <div className="text-center py-8 text-xs text-stone-400 space-y-1">
              <p>Type keywords like "Banker's", "LRU", "SJF", "Deadlock", or "Semaphore"</p>
              <p className="text-stone-400">Press ESC to exit</p>
            </div>
          ) : (
            <>
              {/* Matched Topics */}
              {matchedTopics.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider px-2">
                    Topics
                  </div>
                  {matchedTopics.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => {
                        onSelectResult('topic', t.name);
                        onClose();
                      }}
                      className="p-2.5 rounded-xl bg-stone-950 hover:bg-stone-800/60 border border-stone-800/80 cursor-pointer flex items-center justify-between text-xs text-stone-200"
                    >
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-amber-400" />
                        <span className="font-semibold">{t.name}</span>
                      </div>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {t.frequency} Qs &bull; Priority {t.priorityScore}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Matched Questions */}
              {matchedQuestions.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider px-2">
                    Historical Questions
                  </div>
                  {matchedQuestions.map((qItem) => (
                    <div
                      key={qItem.id}
                      onClick={() => {
                        onSelectResult('question', qItem);
                        onClose();
                      }}
                      className="p-3 rounded-xl bg-stone-950 hover:bg-stone-800/60 border border-stone-800/80 cursor-pointer text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono text-amber-400 font-bold">
                          {qItem.year} Paper &bull; {qItem.questionNumber}
                        </span>
                        <span className="text-stone-400">{qItem.topic} ({qItem.marks}M)</span>
                      </div>
                      <p className="text-stone-300 line-clamp-1">
                        {qItem.questionText}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Matched Insights */}
              {matchedInsights.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider px-2">
                    Examiner Patterns
                  </div>
                  {matchedInsights.map((ins) => (
                    <div
                      key={ins.id}
                      onClick={() => {
                        onSelectResult('insight', ins);
                        onClose();
                      }}
                      className="p-2.5 rounded-xl bg-stone-950 hover:bg-stone-800/60 border border-stone-800/80 cursor-pointer flex items-center justify-between text-xs text-stone-200"
                    >
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-emerald-400" />
                        <span className="font-semibold">{ins.title}</span>
                      </div>
                      <span className="text-[10px] text-amber-300 font-mono">
                        {ins.statBadge}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {matchedTopics.length === 0 &&
                matchedQuestions.length === 0 &&
                matchedInsights.length === 0 && (
                  <div className="text-center py-8 text-xs text-stone-400">
                    No results found for "{query}".
                  </div>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
