import React, { useState } from 'react';
import {
  Layers,
  Search,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { Topic } from '../types.js';

interface TopicsViewProps {
  topics: Topic[];
  onSelectTopic: (topicName: string) => void;
  onPracticeTopic: (topicName: string) => void;
}

export const TopicsView: React.FC<TopicsViewProps> = ({
  topics,
  onSelectTopic,
  onPracticeTopic,
}) => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'frequency' | 'marks' | 'priority' | 'accuracy'>('priority');

  const filtered = topics
    .filter((t) => {
      if (!search.trim()) return true;
      const s = search.toLowerCase();
      return (
        t.name.toLowerCase().includes(s) ||
        t.subtopics.some((sub) => sub.toLowerCase().includes(s))
      );
    })
    .sort((a, b) => {
      if (sortBy === 'frequency') return b.frequency - a.frequency;
      if (sortBy === 'marks') return b.totalMarks - a.totalMarks;
      if (sortBy === 'priority') return b.priorityScore - a.priorityScore;
      if (sortBy === 'accuracy') return a.studentAccuracy - b.studentAccuracy; // lowest first
      return 0;
    });

  return (
    <div id="topics-view" className="space-y-8 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <span>Syllabus Topics ({topics.length})</span>
          </h1>
          <p className="text-sm text-stone-400 mt-1">
            Modeled from your 5-year PYQ dataset and mapped to student accuracy.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-200 font-semibold focus:outline-none focus:border-amber-500"
          >
            <option value="priority">Priority Score</option>
            <option value="frequency">Exam Frequency</option>
            <option value="marks">Historical Marks</option>
            <option value="accuracy">Lowest Accuracy</option>
          </select>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter topics by name or concept..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((t) => (
          <div
            key={t.id}
            className="rounded-3xl bg-stone-900 border border-stone-800 p-5 space-y-4 flex flex-col justify-between hover:border-amber-500/40 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400">
                  Priority {t.priorityScore}/100
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    t.weaknessStatus === 'Critical'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : t.weaknessStatus === 'Needs Work'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {t.weaknessStatus}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">
                  {t.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-stone-400 mt-1">
                  <span>{t.frequency} Questions</span>
                  <span>&bull;</span>
                  <span>{t.totalMarks} Historical Marks</span>
                </div>
              </div>

              {/* Subtopics chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {t.subtopics.slice(0, 3).map((sub) => (
                  <span
                    key={sub}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-stone-950 border border-stone-800 text-stone-300"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between text-xs">
              <button
                onClick={() => onSelectTopic(t.name)}
                className="text-stone-300 hover:text-white font-medium"
              >
                View Questions &rarr;
              </button>
              <button
                onClick={() => onPracticeTopic(t.name)}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-sm transition-all"
              >
                Practice
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
