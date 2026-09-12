import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Clock,
  Flag,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Award,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MockTestResult, PracticeQuestion } from '../types.js';
import { api } from '../services/api.js';

interface MockTestViewProps {
  onTestCompleted: () => void;
}

export const MockTestView: React.FC<MockTestViewProps> = ({ onTestCompleted }) => {
  const [testState, setTestState] = useState<'config' | 'in_progress' | 'results'>('config');
  const [questionCount, setQuestionCount] = useState(10);
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [loading, setLoading] = useState(false);

  // Active test state
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [flaggedQIds, setFlaggedQIds] = useState<Set<string>>(new Set());
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(25 * 60);
  const [testResult, setTestResult] = useState<MockTestResult | null>(null);

  // Timer loop
  useEffect(() => {
    let timer: any = null;
    if (testState === 'in_progress' && timeLeftSeconds > 0) {
      timer = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [testState, timeLeftSeconds]);

  const handleStartTest = async () => {
    setLoading(true);
    try {
      const data = await api.generateMockTest({
        questionCount,
        durationMinutes,
      });
      setQuestions(data.questions || []);
      setTimeLeftSeconds(durationMinutes * 60);
      setCurrentIdx(0);
      setUserAnswers({});
      setFlaggedQIds(new Set());
      setTestState('in_progress');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (optIdx: number) => {
    const q = questions[currentIdx];
    setUserAnswers({ ...userAnswers, [q.id]: optIdx });
  };

  const toggleFlag = (qId: string) => {
    const next = new Set(flaggedQIds);
    if (next.has(qId)) next.delete(qId);
    else next.add(qId);
    setFlaggedQIds(next);
  };

  const handleAutoSubmit = async () => {
    await handleSubmit();
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const timeSpent = durationMinutes * 60 - timeLeftSeconds;
      const res = await api.submitMockTest({
        testId: `mock-${Date.now()}`,
        userAnswers,
        timeSpentSeconds: Math.max(timeSpent, 60),
        questions,
      });

      setTestResult(res.result);
      setTestState('results');
      onTestCompleted();

      // Confetti celebratory burst
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div id="mock-test-view" className="space-y-8 max-w-5xl mx-auto pb-12">
      {testState === 'config' && (
        <div className="rounded-3xl bg-stone-900 border border-stone-800 p-8 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold mb-3 border border-amber-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Historical Exam Simulation</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">
              Operating Systems Mock Exam
            </h1>
            <p className="text-sm text-stone-400 mt-1 max-w-2xl">
              Dynamically synthesized from verified previous-year exam patterns and weighted according to your diagnosed weak spots.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-300 block">
                Number of Questions
              </label>
              <div className="flex gap-3">
                {[5, 10, 15].map((cnt) => (
                  <button
                    key={cnt}
                    onClick={() => setQuestionCount(cnt)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      questionCount === cnt
                        ? 'bg-amber-500 text-stone-950 shadow-md'
                        : 'bg-stone-900 text-stone-300 border border-stone-800'
                    }`}
                  >
                    {cnt} Questions
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-300 block">
                Time Limit
              </label>
              <div className="flex gap-3">
                {[15, 25, 45].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => setDurationMinutes(mins)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      durationMinutes === mins
                        ? 'bg-amber-500 text-stone-950 shadow-md'
                        : 'bg-stone-900 text-stone-300 border border-stone-800'
                    }`}
                  >
                    {mins} Minutes
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-stone-300 space-y-2">
            <div className="font-bold text-amber-300 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>Exam Mode Rules & Weighting</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-stone-400">
              <li>Contains high-frequency Deadlock, Scheduling, and Memory numerical questions.</li>
              <li>Questions tagged [ACTUAL PYQ] are drawn verbatim from 2021-2025 papers.</li>
              <li>Strict countdown timer simulates true exam hall pressure.</li>
            </ul>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleStartTest}
              disabled={loading}
              className="px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2"
            >
              <GraduationCap className="w-5 h-5" />
              <span>Begin Timed Mock Exam</span>
            </button>
          </div>
        </div>
      )}

      {testState === 'in_progress' && questions[currentIdx] && (
        <div className="space-y-6">
          {/* Top Exam Status Bar */}
          <div className="rounded-2xl bg-stone-900 border border-stone-800 p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                Mock Exam in Progress
              </span>
              <span className="text-xs font-mono text-amber-400 bg-stone-950 px-2 py-0.5 rounded border border-stone-800">
                Question {currentIdx + 1} of {questions.length}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold ${
                  timeLeftSeconds < 300
                    ? 'bg-red-500/20 border-red-500/40 text-red-300 animate-pulse'
                    : 'bg-stone-950 border-stone-800 text-amber-400'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeLeftSeconds)}</span>
              </div>

              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-all"
              >
                Submit Exam
              </button>
            </div>
          </div>

          {/* Main Layout: Question + Palette */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 8 cols: Question Card */}
            <div className="lg:col-span-8 rounded-3xl bg-stone-900 border border-stone-800 p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    [{questions[currentIdx].sourceType}]
                  </span>
                  <span className="font-semibold text-stone-300">
                    {questions[currentIdx].topic}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleFlag(questions[currentIdx].id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                      flaggedQIds.has(questions[currentIdx].id)
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
                    }`}
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>Flag</span>
                  </button>
                  <span className="text-xs font-bold text-amber-300 bg-stone-950 px-2.5 py-1 rounded-lg border border-stone-800">
                    {questions[currentIdx].marks} Marks
                  </span>
                </div>
              </div>

              <p className="text-base sm:text-lg text-stone-100 leading-relaxed font-sans">
                {questions[currentIdx].questionText}
              </p>

              {/* Options */}
              <div className="space-y-3">
                {questions[currentIdx].options.map((opt: string, optIdx: number) => {
                  const isSelected = userAnswers[questions[currentIdx].id] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full p-4 rounded-2xl border text-left text-sm font-medium transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500/60 text-amber-200 shadow-sm'
                          : 'bg-stone-950/80 border-stone-800 hover:border-stone-700 text-stone-200'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg border flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                          isSelected
                            ? 'bg-amber-500 text-stone-950 border-amber-400'
                            : 'bg-stone-900 border-stone-800 text-stone-400'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-800">
                <button
                  onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
                  disabled={currentIdx === 0}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-semibold disabled:opacity-40 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={() => setCurrentIdx(Math.min(questions.length - 1, currentIdx + 1))}
                  disabled={currentIdx === questions.length - 1}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-semibold disabled:opacity-40 flex items-center gap-1.5"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right 4 cols: Question Palette Grid */}
            <div className="lg:col-span-4 rounded-3xl bg-stone-900 border border-stone-800 p-5 space-y-4">
              <h3 className="text-xs font-bold text-stone-300 uppercase tracking-wider pb-2 border-b border-stone-800">
                Question Navigator
              </h3>

              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, idx) => {
                  const isAnswered = userAnswers[q.id] !== undefined;
                  const isFlagged = flaggedQIds.has(q.id);
                  const isCurrent = currentIdx === idx;

                  let bg = 'bg-stone-950 text-stone-400 border-stone-800';
                  if (isCurrent) bg = 'ring-2 ring-amber-400 bg-amber-500/20 text-amber-300 border-amber-500';
                  else if (isFlagged) bg = 'bg-amber-950/40 text-amber-300 border-amber-500/60';
                  else if (isAnswered) bg = 'bg-emerald-950/40 text-emerald-300 border-emerald-500/50 font-bold';

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIdx(idx)}
                      className={`h-9 rounded-xl border text-xs font-mono transition-all ${bg}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="pt-3 border-t border-stone-800/80 space-y-1.5 text-[11px] text-stone-400">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-emerald-500/40 border border-emerald-500/60" />
                  <span>Answered ({Object.keys(userAnswers).length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-amber-500/30 border border-amber-500/60" />
                  <span>Flagged ({flaggedQIds.size})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-stone-950 border border-stone-800" />
                  <span>Unanswered ({questions.length - Object.keys(userAnswers).length})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {testState === 'results' && testResult && (
        <div className="rounded-3xl bg-stone-900 border border-amber-500/40 p-6 sm:p-8 space-y-8 animate-in fade-in duration-200">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto">
              <Award className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-extrabold text-white">
              Mock Exam Results
            </h1>
            <p className="text-xs sm:text-sm text-stone-400">
              {testResult.historicalComparison}
            </p>
          </div>

          {/* Scores Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 text-center">
              <span className="text-xs text-stone-400 block uppercase">Total Score</span>
              <strong className="text-2xl font-extrabold text-amber-400 font-mono">
                {testResult.score} / {testResult.maxScore}
              </strong>
            </div>
            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 text-center">
              <span className="text-xs text-stone-400 block uppercase">Accuracy</span>
              <strong className="text-2xl font-extrabold text-emerald-400 font-mono">
                {testResult.accuracy}%
              </strong>
            </div>
            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 text-center">
              <span className="text-xs text-stone-400 block uppercase">Attempted</span>
              <strong className="text-2xl font-extrabold text-white font-mono">
                {testResult.attempted} / {testResult.totalQuestions}
              </strong>
            </div>
            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 text-center">
              <span className="text-xs text-stone-400 block uppercase">Time Spent</span>
              <strong className="text-2xl font-extrabold text-stone-300 font-mono">
                {formatTime(testResult.timeSpentSeconds)}
              </strong>
            </div>
          </div>

          {/* Topic Breakdown */}
          <div className="p-6 rounded-2xl bg-stone-950 border border-stone-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Topic-by-Topic Performance Breakdown
            </h3>
            <div className="space-y-3">
              {testResult.topicBreakdown.map((item) => (
                <div key={item.topic} className="flex items-center justify-between text-xs gap-4">
                  <span className="font-semibold text-stone-200 w-48 truncate">
                    {item.topic}
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-stone-900 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        item.accuracy >= 70
                          ? 'bg-emerald-500'
                          : item.accuracy >= 50
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${item.accuracy}%` }}
                    />
                  </div>
                  <span className="font-mono font-bold text-stone-300 w-16 text-right">
                    {item.correct}/{item.total} ({item.accuracy}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Revision Recommendations */}
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-2">
            <div className="font-bold text-amber-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Recommended Target Revision</span>
            </div>
            <ul className="space-y-1 text-stone-300">
              {testResult.recommendedRevision.map((rec, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-amber-400">&bull;</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setTestState('config')}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-all"
            >
              Take Another Mock Test
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
