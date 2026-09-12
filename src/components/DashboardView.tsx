import React from 'react';
import {
  HelpCircle,
  Layers,
  Award,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Flame,
  ArrowRight,
  Clock,
  CheckCircle2,
  Sparkles,
  Zap,
  BarChart3,
  BookOpen,
  Wheat,
} from 'lucide-react';
import { User, PriorityItem, ExaminerInsight, StudyTask, Question } from '../types.js';

interface DashboardViewProps {
  user: User | null;
  summaryCards: {
    pyqsAnalyzed: number;
    questionsFound: number;
    topicsIdentified: number;
    highPriorityTopics: number;
    preparationScore: number;
    studyStreak: number;
  };
  whatToStudyNow: any;
  topPriorities: PriorityItem[];
  examinerInsights: ExaminerInsight[];
  todayTasks: StudyTask[];
  recentQuestions: Question[];
  onNavigate: (tab: string) => void;
  onStartStudy: (topicName: string) => void;
  onToggleTask: (taskId: string) => void;
  onOpenDiagnostic: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  summaryCards,
  whatToStudyNow,
  topPriorities,
  examinerInsights,
  todayTasks,
  recentQuestions,
  onNavigate,
  onStartStudy,
  onToggleTask,
  onOpenDiagnostic,
}) => {
  return (
    <div id="dashboard-view" className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Greeting & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <span>Good day, {user?.name || 'Student'}</span>
            <span className="text-xl">👋</span>
          </h1>
          <p className="text-sm text-stone-400 mt-1">
            Here's what matters for your {user?.examName || 'Operating Systems'} exam.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="dash-btn-run-diagnostic"
            onClick={onOpenDiagnostic}
            className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-amber-300 font-semibold text-xs border border-amber-500/30 flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Retake Diagnostic Drill</span>
          </button>
          <button
            id="dash-btn-upload-pyq"
            onClick={() => onNavigate('upload')}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <span>+ Add PYQ Paper</span>
          </button>
        </div>
      </div>

      {/* 6 Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* PYQs Analyzed */}
        <div
          id="metric-pyqs-analyzed"
          onClick={() => onNavigate('upload')}
          className="rounded-2xl bg-stone-900 border border-stone-800 p-4 hover:border-amber-500/40 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
            <span>PYQs Analyzed</span>
            <BookOpen className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {summaryCards.pyqsAnalyzed}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            2021 – 2025 Papers
          </div>
        </div>

        {/* Questions Found */}
        <div
          id="metric-questions-found"
          onClick={() => onNavigate('questions')}
          className="rounded-2xl bg-stone-900 border border-stone-800 p-4 hover:border-amber-500/40 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
            <span>Questions</span>
            <HelpCircle className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {summaryCards.questionsFound}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            Fully classified
          </div>
        </div>

        {/* Topics Identified */}
        <div
          id="metric-topics-identified"
          onClick={() => onNavigate('topics')}
          className="rounded-2xl bg-stone-900 border border-stone-800 p-4 hover:border-amber-500/40 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
            <span>Topics Identified</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {summaryCards.topicsIdentified}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            Across 5 exam units
          </div>
        </div>

        {/* High Priority Topics */}
        <div
          id="metric-high-priority"
          onClick={() => onNavigate('priority-matrix')}
          className="rounded-2xl bg-stone-900 border border-stone-800 p-4 hover:border-red-500/40 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
            <span>High Priority</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-extrabold text-red-400">
            {summaryCards.highPriorityTopics}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            Study First quadrant
          </div>
        </div>

        {/* Exam Readiness Score */}
        <div
          id="metric-readiness-score"
          onClick={() => onNavigate('progress')}
          className="rounded-2xl bg-stone-900 border border-stone-800 p-4 hover:border-amber-500/40 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
            <span>Exam Readiness</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400">
            {summaryCards.preparationScore}%
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            +17% from baseline
          </div>
        </div>

        {/* Study Streak */}
        <div
          id="metric-study-streak"
          onClick={() => onNavigate('progress')}
          className="rounded-2xl bg-stone-900 border border-stone-800 p-4 hover:border-orange-500/40 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
            <span>Study Streak</span>
            <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
          </div>
          <div className="text-2xl font-extrabold text-orange-400">
            {summaryCards.studyStreak} Days
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            Top 5% consistency
          </div>
        </div>
      </div>

      {/* HERO RECOMMENDATION CARD: "WHAT SHOULD I STUDY NOW?" */}
      {whatToStudyNow && (
        <div
          id="hero-what-to-study-now"
          className="rounded-3xl bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950/40 border border-amber-500/40 p-6 sm:p-7 relative overflow-hidden shadow-xl"
        >
          {/* Subtle decorative glow */}
          <div className="absolute right-0 top-0 w-80 h-full bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-amber-500 text-stone-950">
                  🔥 WHAT SHOULD I STUDY NOW?
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-red-500/20 text-red-300 border border-red-500/30">
                  QUADRANT: {whatToStudyNow.quadrant}
                </span>
                <span className="text-xs font-mono text-stone-400">
                  Calculated Priority: <strong className="text-white">{whatToStudyNow.priorityScore}/100</strong>
                </span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {whatToStudyNow.topic}
                </h2>
                <p className="text-sm sm:text-base text-stone-300 mt-1 leading-relaxed">
                  {whatToStudyNow.reason}
                </p>
              </div>

              {/* Evidence details list */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <span className="text-xs text-stone-300 bg-stone-800/80 px-3 py-1 rounded-lg border border-stone-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Est. Time: {whatToStudyNow.estimatedTime}</span>
                </span>
                <span className="text-xs text-stone-300 bg-stone-800/80 px-3 py-1 rounded-lg border border-stone-700">
                  Historical Marks: <strong className="text-amber-300">{whatToStudyNow.historicalMarks} M</strong>
                </span>
                <span className="text-xs text-stone-300 bg-stone-800/80 px-3 py-1 rounded-lg border border-stone-700">
                  PYQ Frequency: <strong className="text-amber-300">{whatToStudyNow.frequencyCount} questions</strong>
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
              <button
                id="btn-start-studying-hero"
                onClick={() => onStartStudy(whatToStudyNow.topic)}
                className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 transform active:scale-95"
              >
                <span>Start Studying This Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                id="btn-view-priority-matrix"
                onClick={() => onNavigate('priority-matrix')}
                className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white font-medium text-xs border border-stone-750 transition-all text-center"
              >
                View Full 2D Priority Matrix
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Two-Column Layout: Priority Ranking & Today's Study Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Top Priority Topics List */}
        <div className="lg:col-span-7 rounded-3xl bg-stone-900 border border-stone-800 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Top Exam Priorities</span>
                <span className="text-xs font-normal text-stone-400">
                  (Deterministic Formula)
                </span>
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Formula: Frequency (25%) + Weakness (35%) + Marks (15%) + Recency (15%) + Recurrence (10%)
              </p>
            </div>
            <button
              onClick={() => onNavigate('priority-matrix')}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>Explore Matrix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {topPriorities.slice(0, 5).map((item, idx) => (
              <div
                key={item.topic}
                className="rounded-2xl bg-stone-950/80 border border-stone-800/80 p-3.5 hover:border-stone-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-xs font-mono font-bold text-amber-400 shrink-0 mt-0.5">
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-stone-100 text-sm">
                        {item.topic}
                      </h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.quadrant === 'STUDY FIRST'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : item.quadrant === 'MAINTAIN'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-stone-800 text-stone-400 border border-stone-700'
                        }`}
                      >
                        {item.quadrant}
                      </span>
                    </div>
                    <div className="text-xs text-stone-400 mt-1 flex flex-wrap items-center gap-3">
                      <span>Appeared: <strong className="text-stone-300">{item.yearsAppeared}</strong></span>
                      <span>Marks: <strong className="text-stone-300">{item.historicalMarks}M</strong></span>
                      <span>
                        Your Accuracy:{' '}
                        <strong
                          className={
                            item.studentAccuracy < 50
                              ? 'text-red-400'
                              : item.studentAccuracy < 75
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }
                        >
                          {item.studentAccuracy}%
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <div className="text-right">
                    <div className="text-base font-extrabold text-amber-400">
                      {item.priorityScore}
                    </div>
                    <div className="text-[10px] text-stone-400 uppercase">
                      Priority
                    </div>
                  </div>
                  <button
                    onClick={() => onStartStudy(item.topic)}
                    className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-stone-200 text-xs font-semibold border border-stone-700 transition-all"
                  >
                    Practice
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 cols: Today's 7-Day Plan Tasks */}
        <div className="lg:col-span-5 rounded-3xl bg-stone-900 border border-stone-800 p-5 sm:p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>Today's Study Plan</span>
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Day 1: Deadlocks Mastery (2 Hours Target)
                </p>
              </div>
              <button
                onClick={() => onNavigate('study-plan')}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <span>Full 7 Days</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {todayTasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  onClick={() => onToggleTask(task.id)}
                  className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    task.completed
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-stone-400'
                      : 'bg-stone-950/80 border-stone-800 hover:border-stone-700 text-stone-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                        task.completed
                          ? 'bg-emerald-500 border-emerald-400 text-stone-950'
                          : 'border-stone-700 bg-stone-900'
                      }`}
                    >
                      {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <div className="min-w-0">
                      <div
                        className={`font-semibold truncate ${
                          task.completed ? 'line-through text-stone-400' : 'text-stone-100'
                        }`}
                      >
                        {task.title}
                      </div>
                      <div className="text-[11px] text-stone-400 flex items-center gap-2 mt-0.5">
                        <span className="text-amber-400">{task.type}</span>
                        <span>&bull;</span>
                        <span>{task.durationMinutes} mins</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-stone-900 text-stone-400 border border-stone-800 shrink-0">
                    Score: {task.priorityScore}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-stone-800/80 mt-2">
            <button
              onClick={() => onNavigate('study-plan')}
              className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 text-xs font-semibold border border-stone-700 transition-all flex items-center justify-center gap-2"
            >
              <span>Customize Study Hours & Schedule</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Examiner Insights & Perennial Pillars */}
      <div className="rounded-3xl bg-stone-900 border border-stone-800 p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Examiner Pattern Insights</span>
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Verified behavioral anomalies derived across all 5 evaluated exam papers
            </p>
          </div>
          <button
            onClick={() => onNavigate('examiner-insights')}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <span>View All Insights</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {examinerInsights.slice(0, 4).map((ins) => (
            <div
              key={ins.id}
              className="rounded-2xl bg-stone-950/80 border border-stone-800 p-4 flex flex-col justify-between hover:border-amber-500/30 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    {ins.category}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    [{ins.evidenceType.toUpperCase()}]
                  </span>
                </div>
                <h4 className="font-bold text-stone-100 text-sm mb-1">
                  {ins.title}
                </h4>
                <p className="text-xs text-stone-400 leading-relaxed mb-3">
                  {ins.observation}
                </p>
              </div>
              <div className="pt-2 border-t border-stone-800/80 text-[11px] text-stone-400 flex items-center justify-between">
                <span>{ins.statBadge}</span>
                <span className="text-amber-400 font-semibold">{ins.impact} Impact</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Questions Preview */}
      <div className="rounded-3xl bg-stone-900 border border-stone-800 p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-400" />
              <span>Extracted PYQ Questions</span>
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Targeted sample of 143 questions parsed from 2021-2025 papers
            </p>
          </div>
          <button
            onClick={() => onNavigate('questions')}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <span>Open Question Explorer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-stone-800">
          {recentQuestions.slice(0, 4).map((q) => (
            <div key={q.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-mono font-bold text-amber-400 bg-stone-950 px-2 py-0.5 rounded border border-stone-800">
                    {q.year} &bull; {q.questionNumber}
                  </span>
                  <span className="font-semibold text-stone-300">{q.topic}</span>
                  <span className="text-stone-400">&bull;</span>
                  <span className="text-stone-400">{q.subtopic}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    ACTUAL PYQ
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
                  {q.questionText}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <span className="text-xs font-bold text-amber-300 bg-stone-950 px-2.5 py-1 rounded-lg border border-stone-800">
                  {q.marks} Marks
                </span>
                <span className="text-xs text-stone-400 px-2 py-1 rounded bg-stone-800/80">
                  {q.difficulty}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
