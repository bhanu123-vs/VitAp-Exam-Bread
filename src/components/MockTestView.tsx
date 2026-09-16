import React, { useState, useEffect, useMemo } from 'react';
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
  LayoutDashboard,
  Calendar,
  Layers,
  Search,
  Check,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MockTestResult } from '../types.js';
import { VIT_AP_COURSES } from '../data/vitApCourses.js';
import {
  generatePyqMockQuestions,
  evaluateMockExam,
  PyqExamQuestion,
} from '../utils/mockPyqQuestionEngine.js';
import { api } from '../services/api.js';

interface MockTestViewProps {
  initialCourseCode?: string;
  onTestCompleted?: () => void;
  onNavigateToDashboard?: () => void;
  onNavigateToRoadmap?: () => void;
}

export const MockTestView: React.FC<MockTestViewProps> = ({
  initialCourseCode = 'CSE1001',
  onTestCompleted,
  onNavigateToDashboard,
  onNavigateToRoadmap,
}) => {
  const [testState, setTestState] = useState<'config' | 'in_progress' | 'results'>('config');
  
  // Configuration
  const [selectedCourseCode, setSelectedCourseCode] = useState<string>(initialCourseCode);
  const [searchCourseQuery, setSearchCourseQuery] = useState<string>('');
  const [selectedExamType, setSelectedExamType] = useState<'cat1' | 'cat2' | 'fat'>('cat1');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [durationMinutes, setDurationMinutes] = useState<number>(20);
  const [loading, setLoading] = useState<boolean>(false);

  // Active test state
  const [questions, setQuestions] = useState<PyqExamQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [flaggedQIds, setFlaggedQIds] = useState<Set<string>>(new Set());
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(20 * 60);
  const [testResult, setTestResult] = useState<MockTestResult | null>(null);

  // Filtered course list
  const filteredCourses = useMemo(() => {
    if (!searchCourseQuery.trim()) return VIT_AP_COURSES;
    const q = searchCourseQuery.toLowerCase();
    return VIT_AP_COURSES.filter(
      (c) => c.code.toLowerCase().includes(q) || c.title.toLowerCase().includes(q)
    );
  }, [searchCourseQuery]);

  const activeCourse = useMemo(() => {
    return (
      VIT_AP_COURSES.find((c) => c.code === selectedCourseCode) ||
      VIT_AP_COURSES[0]
    );
  }, [selectedCourseCode]);

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

  const handleStartTest = () => {
    setLoading(true);
    try {
      const generated = generatePyqMockQuestions(
        selectedCourseCode,
        selectedExamType,
        questionCount
      );
      setQuestions(generated);
      setTimeLeftSeconds(durationMinutes * 60);
      setCurrentIdx(0);
      setUserAnswers({});
      setFlaggedQIds(new Set());
      setTestState('in_progress');
    } catch (e) {
      console.error('Failed to generate mock test:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (optIdx: number) => {
    const q = questions[currentIdx];
    if (!q) return;
    setUserAnswers((prev) => ({ ...prev, [q.id]: optIdx }));
  };

  const toggleFlag = (qId: string) => {
    setFlaggedQIds((prev) => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  const handleAutoSubmit = () => {
    handleSubmit();
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const timeSpent = Math.max(durationMinutes * 60 - timeLeftSeconds, 45);
      // 1. Evaluate with accurate PYP priority quadrants
      const result = evaluateMockExam(questions, userAnswers, timeSpent);
      setTestResult(result);
      setTestState('results');

      // 2. Synchronize to backend if available
      try {
        await api.submitMockTest({
          testId: result.id,
          userAnswers,
          timeSpentSeconds: timeSpent,
          questions,
        });
      } catch (err) {
        console.log('Backend sync skipped or offline, client evaluation stored.');
      }

      if (onTestCompleted) {
        onTestCompleted();
      }

      // Celebratory confetti burst
      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch (e) {
      console.error('Submission evaluation failed:', e);
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
    <div id="mock-test-view" className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* 1. CONFIGURATION SCREEN */}
      {testState === 'config' && (
        <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-8 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold mb-3 border border-amber-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PYP Repeated Questions Generator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white">
              VIT-AP Mock Exam Simulator
            </h1>
            <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-2xl">
              Take simulated examination tests compiled directly from repeated question patterns across 5 years of PYPs. After completion, your performance will be evaluated into High & Low Priority Weak/Strong topics and sent to your Dashboard.
            </p>
          </div>

          {/* Select Course */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                1. Select Subject ({VIT_AP_COURSES.length} VIT-AP Courses Available)
              </label>
              <div className="relative w-48 sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Filter subjects..."
                  value={searchCourseQuery}
                  onChange={(e) => setSearchCourseQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-1 border border-stone-200 dark:border-stone-800 rounded-2xl">
              {filteredCourses.map((c) => {
                const isSelected = selectedCourseCode === c.code;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setSelectedCourseCode(c.code)}
                    className={`p-3 rounded-xl text-left transition-all border ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500 text-stone-900 dark:text-white font-semibold'
                        : 'bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800/80 text-stone-600 dark:text-stone-300 hover:border-stone-300 dark:hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                        {c.code}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-500" />}
                    </div>
                    <div className="text-xs truncate font-medium mt-0.5">{c.title}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Exam Segment Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 block">
              2. Select Examination Segment
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'cat1',
                  name: 'CAT-1 Mock Exam',
                  modules: 'Modules 1 & 2',
                  desc: 'Focuses strictly on Units 1-2 foundation derivations & repeated Part A/B questions.',
                },
                {
                  id: 'cat2',
                  name: 'CAT-2 Mock Exam',
                  modules: 'Modules 3 & 4',
                  desc: 'Focuses strictly on Units 3-4 advanced design problems & numerical analysis.',
                },
                {
                  id: 'fat',
                  name: 'FAT Mock Exam',
                  modules: 'All Modules (1 to 5)',
                  desc: 'Full university semester comprehensive pattern with all units represented.',
                },
              ].map((ex) => {
                const isSel = selectedExamType === ex.id;
                return (
                  <button
                    key={ex.id}
                    type="button"
                    onClick={() => setSelectedExamType(ex.id as any)}
                    className={`p-4 rounded-2xl text-left border transition-all ${
                      isSel
                        ? 'bg-amber-500/10 border-amber-500 text-stone-900 dark:text-white ring-1 ring-amber-500'
                        : 'bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold">{ex.name}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                        {ex.modules}
                      </span>
                    </div>
                    <p className="text-xs opacity-80 leading-relaxed">{ex.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Test Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 block">
                Number of Questions
              </label>
              <div className="flex gap-3">
                {[5, 10, 15].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setQuestionCount(cnt)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      questionCount === cnt
                        ? 'bg-amber-500 text-stone-950 shadow-sm'
                        : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:border-stone-300'
                    }`}
                  >
                    {cnt} Questions
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 block">
                Time Limit
              </label>
              <div className="flex gap-3">
                {[15, 20, 30].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDurationMinutes(mins)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      durationMinutes === mins
                        ? 'bg-amber-500 text-stone-950 shadow-sm'
                        : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:border-stone-300'
                    }`}
                  >
                    {mins} Minutes
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Start CTA */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-200 dark:border-stone-800">
            <div className="text-xs text-stone-500 dark:text-stone-400">
              Ready to test <span className="font-semibold text-stone-900 dark:text-stone-200">{activeCourse.title} ({activeCourse.code})</span> • {selectedExamType.toUpperCase()}
            </div>

            <button
              type="button"
              onClick={handleStartTest}
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Test...</span>
                </>
              ) : (
                <>
                  <span>Begin Exam Simulation</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* 2. IN-PROGRESS TEST SCREEN */}
      {testState === 'in_progress' && questions.length > 0 && (
        <div className="space-y-6">
          {/* Top Test Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                <span>{activeCourse.code}</span>
                <span>•</span>
                <span>{selectedExamType.toUpperCase()} MOCK TEST</span>
              </div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                {activeCourse.title}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 font-mono font-bold text-sm">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>{formatTime(timeLeftSeconds)}</span>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-all shadow-sm"
              >
                Submit & Evaluate
              </button>
            </div>
          </div>

          {/* Question Stepper Indicator */}
          <div className="flex gap-1.5 overflow-x-auto pb-2">
            {questions.map((q, idx) => {
              const isCurrent = currentIdx === idx;
              const isAnswered = userAnswers[q.id] !== undefined;
              const isFlagged = flaggedQIds.has(q.id);

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setCurrentIdx(idx)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold shrink-0 transition-all border flex items-center justify-center relative ${
                    isCurrent
                      ? 'border-amber-500 bg-amber-500 text-stone-950'
                      : isAnswered
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                      : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-500'
                  }`}
                >
                  {idx + 1}
                  {isFlagged && (
                    <span className="w-2 h-2 rounded-full bg-orange-500 absolute -top-1 -right-1" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Question Card */}
          {questions[currentIdx] && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-6">
              <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-bold">
                    Question {currentIdx + 1} of {questions.length}
                  </span>
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                    {questions[currentIdx].topic}
                  </span>
                  <span className="hidden sm:inline text-xs text-stone-400">
                    ({questions[currentIdx].repeatedFrequency})
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => toggleFlag(questions[currentIdx].id)}
                  className={`p-2 rounded-lg border transition-all ${
                    flaggedQIds.has(questions[currentIdx].id)
                      ? 'bg-orange-500/10 border-orange-500 text-orange-500'
                      : 'border-stone-200 dark:border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                  title="Flag for review"
                >
                  <Flag className="w-4 h-4" />
                </button>
              </div>

              {/* Question Text */}
              <div className="text-base sm:text-lg font-medium text-stone-900 dark:text-stone-100 leading-relaxed">
                {questions[currentIdx].question}
              </div>

              {/* Options */}
              <div className="space-y-3">
                {questions[currentIdx].options.map((opt, optIdx) => {
                  const isSelected = userAnswers[questions[currentIdx].id] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full p-4 rounded-2xl text-left transition-all border flex items-start gap-3.5 ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500 text-stone-900 dark:text-white font-medium ring-1 ring-amber-500'
                          : 'bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-300 dark:hover:border-stone-700'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-xs font-bold border transition-colors ${
                          isSelected
                            ? 'bg-amber-500 border-amber-500 text-stone-950'
                            : 'border-stone-300 dark:border-stone-700 text-stone-400'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </div>
                      <span className="text-sm leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
                  disabled={currentIdx === 0}
                  className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 disabled:opacity-30 flex items-center gap-1.5 text-xs font-semibold"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                {currentIdx < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1))}
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <span>Finish & Evaluate</span>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. EVALUATION RESULTS & PRIORITY QUADRANT SCREEN */}
      {testState === 'results' && testResult && (
        <div className="space-y-8 animate-fadeIn">
          {/* Top Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500/15 via-white dark:via-stone-900 to-transparent border border-amber-500/30 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Mock Examination Evaluation Complete
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white mt-1">
                  {testResult.title}
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Evaluated on {testResult.date} • {formatTime(testResult.timeSpentSeconds)} taken
                </p>
              </div>

              {/* Action Buttons: Send to Dashboard */}
              <div className="flex flex-wrap items-center gap-3">
                {onNavigateToDashboard && (
                  <button
                    type="button"
                    onClick={onNavigateToDashboard}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>View on Dashboard</span>
                  </button>
                )}
                {onNavigateToRoadmap && (
                  <button
                    type="button"
                    onClick={onNavigateToRoadmap}
                    className="px-4 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-750 text-stone-900 dark:text-stone-100 font-semibold text-xs border border-stone-200 dark:border-stone-700 flex items-center gap-1.5 transition-all"
                  >
                    <Calendar className="w-4 h-4 text-amber-500" />
                    <span>Generate 7-Day Roadmap</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setTestState('config')}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-semibold text-xs hover:bg-stone-100 dark:hover:bg-stone-800 transition-all flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Take Another Mock Test</span>
                </button>
              </div>
            </div>

            {/* Metric Score Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-center">
                <div className="text-xs text-stone-500 dark:text-stone-400 mb-1">Total Score</div>
                <div className="text-2xl font-extrabold text-stone-900 dark:text-white">
                  {testResult.score} / {testResult.maxScore}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-center">
                <div className="text-xs text-stone-500 dark:text-stone-400 mb-1">Overall Accuracy</div>
                <div className={`text-2xl font-extrabold ${
                  testResult.accuracy >= 70 ? 'text-emerald-500' : testResult.accuracy >= 50 ? 'text-amber-500' : 'text-rose-500'
                }`}>
                  {testResult.accuracy}%
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-center">
                <div className="text-xs text-stone-500 dark:text-stone-400 mb-1">Correct Answers</div>
                <div className="text-2xl font-extrabold text-stone-900 dark:text-white">
                  {testResult.correctCount} / {testResult.totalQuestions}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-center">
                <div className="text-xs text-stone-500 dark:text-stone-400 mb-1">Target Grade</div>
                <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                  {testResult.accuracy >= 85 ? 'S Grade' : testResult.accuracy >= 70 ? 'A Grade' : testResult.accuracy >= 55 ? 'B Grade' : 'Pass / C'}
                </div>
              </div>
            </div>

            {/* Historical Comparison */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 font-medium">
              💡 {testResult.historicalComparison}
            </div>
          </div>

          {/* 4-QUADRANT PRIORITY ANALYSIS (WEAK VS STRONG, HIGH VS LOW PRIORITY) */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                PYP Topic Priority Analysis (Weak vs. Strong Topics)
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Automatically categorized based on your test accuracy cross-referenced with 5-year exam recurrence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 1. Weak Topics - HIGH PRIORITY (Urgent!) */}
              <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Weak Topics • High Priority (Urgent)</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-700 dark:text-rose-300 font-bold">
                    {testResult.weakHighPriorityTopics?.length || 0}
                  </span>
                </div>
                <p className="text-xs text-rose-700 dark:text-rose-300/90 leading-relaxed">
                  Scored &lt;60% accuracy AND has high recurrence in previous papers. Must be revised first!
                </p>
                <div className="space-y-1.5 pt-1">
                  {testResult.weakHighPriorityTopics && testResult.weakHighPriorityTopics.length > 0 ? (
                    testResult.weakHighPriorityTopics.map((t, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-rose-200 dark:border-rose-900/40 flex items-center justify-between text-xs"
                      >
                        <span className="font-semibold text-stone-900 dark:text-stone-100 truncate mr-2">
                          {t}
                        </span>
                        <span className="text-[10px] font-bold text-rose-500 shrink-0">
                          Critical Priority
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-stone-500 italic p-2">
                      No high-priority weak spots detected! Great work!
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Weak Topics - LOW PRIORITY (Secondary) */}
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
                    <Clock className="w-4 h-4" />
                    <span>Weak Topics • Low Priority</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold">
                    {testResult.weakLowPriorityTopics?.length || 0}
                  </span>
                </div>
                <p className="text-xs text-amber-700 dark:text-amber-300/90 leading-relaxed">
                  Lower test accuracy, but these concepts historically carry smaller mark weightage (&lt;5 marks).
                </p>
                <div className="space-y-1.5 pt-1">
                  {testResult.weakLowPriorityTopics && testResult.weakLowPriorityTopics.length > 0 ? (
                    testResult.weakLowPriorityTopics.map((t, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-amber-200 dark:border-amber-900/40 flex items-center justify-between text-xs"
                      >
                        <span className="font-semibold text-stone-900 dark:text-stone-100 truncate mr-2">
                          {t}
                        </span>
                        <span className="text-[10px] font-semibold text-amber-500 shrink-0">
                          Revise Later
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-stone-500 italic p-2">
                      No low-priority weak topics identified.
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Strong Topics - HIGH PRIORITY (Key Pillars) */}
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Strong Topics • High Priority (Exam Pillars)</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold">
                    {testResult.strongHighPriorityTopics?.length || 0}
                  </span>
                </div>
                <p className="text-xs text-emerald-700 dark:text-emerald-300/90 leading-relaxed">
                  Mastered (≥60%) AND highly recurring in exams. These are your guaranteed marks!
                </p>
                <div className="space-y-1.5 pt-1">
                  {testResult.strongHighPriorityTopics && testResult.strongHighPriorityTopics.length > 0 ? (
                    testResult.strongHighPriorityTopics.map((t, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-emerald-200 dark:border-emerald-900/40 flex items-center justify-between text-xs"
                      >
                        <span className="font-semibold text-stone-900 dark:text-stone-100 truncate mr-2">
                          {t}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-500 shrink-0">
                          Lock In Marks
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-stone-500 italic p-2">
                      Take more questions to establish strong pillars.
                    </div>
                  )}
                </div>
              </div>

              {/* 4. Strong Topics - LOW PRIORITY (Mastered Minor Topics) */}
              <div className="p-5 rounded-2xl bg-blue-500/10 border border-blue-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
                    <Award className="w-4 h-4" />
                    <span>Strong Topics • Low Priority</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold">
                    {testResult.strongLowPriorityTopics?.length || 0}
                  </span>
                </div>
                <p className="text-xs text-blue-700 dark:text-blue-300/90 leading-relaxed">
                  Already mastered with solid accuracy, but appears less frequently in past papers.
                </p>
                <div className="space-y-1.5 pt-1">
                  {testResult.strongLowPriorityTopics && testResult.strongLowPriorityTopics.length > 0 ? (
                    testResult.strongLowPriorityTopics.map((t, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-blue-200 dark:border-blue-900/40 flex items-center justify-between text-xs"
                      >
                        <span className="font-semibold text-stone-900 dark:text-stone-100 truncate mr-2">
                          {t}
                        </span>
                        <span className="text-[10px] font-semibold text-blue-500 shrink-0">
                          Maintained
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-stone-500 italic p-2">
                      No low-priority topics recorded.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
            <h3 className="text-base font-bold text-stone-900 dark:text-white">
              Question-by-Question Review & Explanations
            </h3>

            <div className="space-y-4">
              {questions.map((q, idx) => {
                const userAns = userAnswers[q.id];
                const isCorrect = userAns === q.correctOptionIndex;
                const isSkipped = userAns === undefined;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-2xl border ${
                      isCorrect
                        ? 'bg-emerald-500/5 border-emerald-500/30'
                        : isSkipped
                        ? 'bg-stone-100 dark:bg-stone-800/40 border-stone-200 dark:border-stone-700'
                        : 'bg-rose-500/5 border-rose-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold mb-2">
                      <span className="text-stone-900 dark:text-stone-200">
                        Q{idx + 1}. {q.topic}
                      </span>
                      <span
                        className={`font-bold ${
                          isCorrect
                            ? 'text-emerald-500'
                            : isSkipped
                            ? 'text-stone-400'
                            : 'text-rose-500'
                        }`}
                      >
                        {isCorrect ? '✅ Correct (+5 Marks)' : isSkipped ? '⚪ Skipped (0 Marks)' : '❌ Incorrect (0 Marks)'}
                      </span>
                    </div>

                    <p className="text-sm font-medium text-stone-800 dark:text-stone-200 mb-3">
                      {q.question}
                    </p>

                    <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800/80 text-xs space-y-1">
                      <div>
                        <span className="text-stone-500">Correct Answer: </span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          Option {String.fromCharCode(65 + q.correctOptionIndex)}: {q.options[q.correctOptionIndex]}
                        </span>
                      </div>
                      <p className="text-stone-600 dark:text-stone-400 text-[11px] pt-1">
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
