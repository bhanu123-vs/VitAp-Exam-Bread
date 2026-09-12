import React, { useState } from 'react';
import {
  Search,
  Filter,
  Layers,
  HelpCircle,
  Tag,
  ExternalLink,
  BookOpen,
  Sparkles,
  X,
  ArrowRight,
  GitBranch,
} from 'lucide-react';
import { Question, QuestionFamily } from '../types.js';

interface QuestionsViewProps {
  questions: Question[];
  families: QuestionFamily[];
  onStartPracticeTopic: (topic: string) => void;
}

export const QuestionsView: React.FC<QuestionsViewProps> = ({
  questions,
  families,
  onStartPracticeTopic,
}) => {
  const [search, setSearch] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  // Derive unique topics
  const topics = Array.from(new Set(questions.map((q) => q.topic))).sort();

  // Filter questions
  const filtered = questions.filter((q) => {
    if (selectedYear !== 'all' && q.year.toString() !== selectedYear) return false;
    if (selectedTopic !== 'all' && q.topic !== selectedTopic) return false;
    if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;
    if (selectedType !== 'all' && q.questionType !== selectedType) return false;

    if (search.trim()) {
      const s = search.toLowerCase();
      return (
        q.questionText.toLowerCase().includes(s) ||
        q.topic.toLowerCase().includes(s) ||
        q.subtopic.toLowerCase().includes(s) ||
        q.concept.toLowerCase().includes(s) ||
        q.questionNumber.toLowerCase().includes(s)
      );
    }
    return true;
  });

  // Find family for selected question if modal open
  const currentFamily = selectedQuestion
    ? families.find(
        (f) =>
          f.canonicalQuestion === selectedQuestion.questionText ||
          f.variations.some((v) => v.questionId === selectedQuestion.id)
      )
    : null;

  return (
    <div id="questions-view" className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <span>Historical Question Explorer</span>
          </h1>
          <p className="text-sm text-stone-400 mt-1">
            Browse, search, and inspect all {questions.length} questions extracted across 5 years of exam papers.
          </p>
        </div>
        <div className="text-xs font-mono text-stone-400 bg-stone-900 border border-stone-800 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          Showing {filtered.length} of {questions.length} Questions
        </div>
      </div>

      {/* Filter & Search Bar Card */}
      <div className="rounded-3xl bg-stone-900 border border-stone-800 p-4 sm:p-5 space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search question text, concepts, Banker's algorithm, semaphores, paging..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 text-sm focus:outline-none focus:border-amber-500 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Multi-Filter Controls */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Year Filter */}
          <div>
            <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">
              Exam Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Years (2021-2025)</option>
              <option value="2025">2025 Paper</option>
              <option value="2024">2024 Paper</option>
              <option value="2023">2023 Paper</option>
              <option value="2022">2022 Paper</option>
              <option value="2021">2021 Paper</option>
            </select>
          </div>

          {/* Topic Filter */}
          <div>
            <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">
              Topic
            </label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Topics ({topics.length})</option>
              {topics.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">
              Difficulty
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Question Type */}
          <div>
            <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">
              Question Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Question Types</option>
              <option value="Numerical">Numerical / Calculations</option>
              <option value="Conceptual">Conceptual / Theory</option>
              <option value="Algorithmic">Algorithmic / Code</option>
              <option value="Comparative">Comparative / Differences</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-3xl bg-stone-900 border border-stone-800 p-12 text-center text-stone-400">
            <HelpCircle className="w-10 h-10 mx-auto text-stone-400 mb-3" />
            <p className="text-base font-semibold text-stone-300">
              No questions matched your search filters.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedYear('all');
                setSelectedTopic('all');
                setSelectedDifficulty('all');
                setSelectedType('all');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-stone-800 text-amber-300 text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filtered.map((q) => (
            <div
              key={q.id}
              onClick={() => setSelectedQuestion(q)}
              className="rounded-2xl bg-stone-900 border border-stone-800 p-4 sm:p-5 hover:border-amber-500/40 cursor-pointer transition-all space-y-3 group"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-mono font-bold text-amber-400 bg-stone-950 px-2.5 py-1 rounded-lg border border-stone-800">
                    {q.year} &bull; {q.questionNumber}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    ACTUAL PYQ
                  </span>
                  <span className="font-bold text-stone-200">{q.topic}</span>
                  <span className="text-stone-400">&bull;</span>
                  <span className="text-stone-400">{q.subtopic}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-300 bg-stone-950 px-2.5 py-1 rounded-lg border border-stone-800">
                    {q.marks} Marks
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                      q.difficulty === 'Hard'
                        ? 'bg-red-500/15 text-red-300 border border-red-500/20'
                        : q.difficulty === 'Medium'
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
                        : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
                    }`}
                  >
                    {q.difficulty}
                  </span>
                  <span className="text-[11px] text-stone-400 px-2 py-0.5 rounded bg-stone-950 border border-stone-800">
                    {q.questionType}
                  </span>
                </div>
              </div>

              <p className="text-sm sm:text-base text-stone-200 leading-relaxed font-sans">
                {q.questionText}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-stone-800/80 text-xs text-stone-400">
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  <span>Concept: <strong className="text-stone-300">{q.concept}</strong></span>
                </div>
                <div className="text-amber-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>Inspect Details & Similar Questions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* QUESTION DETAIL MODAL */}
      {selectedQuestion && (
        <div
          id="question-detail-modal"
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="bg-stone-900 border border-stone-700 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono font-bold text-amber-400 bg-stone-950 px-2.5 py-1 rounded-lg border border-stone-800">
                  {selectedQuestion.year} Paper &bull; {selectedQuestion.questionNumber}
                </span>
                <span className="font-bold text-stone-300">
                  {selectedQuestion.marks} Marks
                </span>
              </div>
              <button
                onClick={() => setSelectedQuestion(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Question Text */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Exact Historical Question Text
              </div>
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 text-stone-100 text-base leading-relaxed font-sans">
                {selectedQuestion.questionText}
              </div>
            </div>

            {/* Taxonomy Metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800">
                <span className="text-stone-400 block text-[10px] uppercase">Topic</span>
                <strong className="text-stone-200">{selectedQuestion.topic}</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800">
                <span className="text-stone-400 block text-[10px] uppercase">Subtopic</span>
                <strong className="text-stone-200">{selectedQuestion.subtopic}</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800">
                <span className="text-stone-400 block text-[10px] uppercase">Difficulty</span>
                <strong className="text-amber-300">{selectedQuestion.difficulty}</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800">
                <span className="text-stone-400 block text-[10px] uppercase">Exam Type</span>
                <strong className="text-stone-200">{selectedQuestion.questionType}</strong>
              </div>
            </div>

            {/* Question Family / Semantic Similar Questions */}
            {currentFamily && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-amber-300">
                      Recurring Question Family Detected
                    </span>
                  </div>
                  <span className="text-xs font-mono text-amber-400">
                    {currentFamily.similarityScore}% Semantic Match
                  </span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  The examiner repeats this underlying concept (<strong>{currentFamily.underlyingConcept}</strong>) across multiple years with slight rewording.
                </p>

                <div className="space-y-2 pt-1">
                  {currentFamily.variations.map((v) => (
                    <div
                      key={v.questionId}
                      className="p-2.5 rounded-xl bg-stone-950/80 border border-stone-800 text-xs text-stone-300 flex items-start justify-between gap-3"
                    >
                      <div>
                        <span className="font-mono font-bold text-amber-400 mr-2">
                          [{v.year}]
                        </span>
                        <span>{v.questionText}</span>
                      </div>
                      <span className="text-[10px] text-stone-400 shrink-0">
                        {v.marks}M
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  const topicToPractice = selectedQuestion.topic;
                  setSelectedQuestion(null);
                  onStartPracticeTopic(topicToPractice);
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <span>Practice Questions for {selectedQuestion.topic}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
