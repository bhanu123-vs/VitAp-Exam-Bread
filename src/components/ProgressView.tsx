import React from 'react';
import {
  TrendingUp,
  Flame,
  Award,
  Clock,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { ProgressMetrics } from '../types.js';

interface ProgressViewProps {
  metrics: ProgressMetrics;
  onNavigateToPlan: () => void;
  onOpenDiagnostic: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  metrics,
  onNavigateToPlan,
  onOpenDiagnostic,
}) => {
  return (
    <div id="progress-view" className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <span>Exam Preparation & Velocity</span>
        </h1>
        <p className="text-sm text-stone-400 mt-1">
          Measurable readiness gains computed from your study plan tasks and test accuracy.
        </p>
      </div>

      {/* Top Velocity Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl bg-stone-900 border border-stone-800 p-6 space-y-1">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
            <span>Overall Readiness</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400 font-mono">
            {metrics.preparationScore}%
          </div>
          <div className="text-xs text-emerald-400 font-semibold">
            +{metrics.preparationImprovement}% improvement
          </div>
        </div>

        <div className="rounded-3xl bg-stone-900 border border-stone-800 p-6 space-y-1">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
            <span>Study Streak</span>
            <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
          </div>
          <div className="text-3xl font-extrabold text-orange-400 font-mono">
            {metrics.studyStreakDays} Days
          </div>
          <div className="text-xs text-stone-400">
            Top 5% student consistency
          </div>
        </div>

        <div className="rounded-3xl bg-stone-900 border border-stone-800 p-6 space-y-1">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
            <span>Questions Solved</span>
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">
            {metrics.questionsSolved}
          </div>
          <div className="text-xs text-stone-400">
            Average accuracy: {metrics.overallAccuracy}%
          </div>
        </div>

        <div className="rounded-3xl bg-stone-900 border border-stone-800 p-6 space-y-1">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
            <span>Study Hours Logged</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">
            {metrics.studyHoursLogged} hrs
          </div>
          <div className="text-xs text-stone-400">
            Across 7-day adaptive plan
          </div>
        </div>
      </div>

      {/* Accuracy Trajectory Chart */}
      <div className="rounded-3xl bg-stone-900 border border-stone-800 p-6 sm:p-7 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <div>
            <h3 className="text-base font-bold text-white">
              Accuracy Trajectory Over Time
            </h3>
            <p className="text-xs text-stone-400">
              Progression from Day 1 diagnostic baseline (48%) to current session (68%)
            </p>
          </div>
          <button
            onClick={onOpenDiagnostic}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300"
          >
            Retake Diagnostic Test &rarr;
          </button>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics.accuracyTrend} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
              <XAxis dataKey="date" stroke="#a8a29e" fontSize={11} />
              <YAxis domain={[30, 100]} stroke="#a8a29e" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1c1917',
                  borderColor: '#44403c',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
                formatter={(v: any) => [`${v}% accuracy`, 'Session Accuracy']}
              />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ fill: '#f59e0b', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Readiness Breakdown by Topic Health */}
      <div className="rounded-3xl bg-stone-900 border border-stone-800 p-6 sm:p-7 space-y-4">
        <h3 className="text-base font-bold text-white">
          Syllabus Topic Health Distribution
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
            <span className="text-xs font-bold text-emerald-400 uppercase">Strong Topics</span>
            <div className="text-2xl font-bold text-white">
              {metrics.readinessSummary.strongCount} Topics
            </div>
            <p className="text-[11px] text-stone-400">
              Memory Management, Process Sync, Disk Scheduling
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-1">
            <span className="text-xs font-bold text-amber-400 uppercase">Needs Work</span>
            <div className="text-2xl font-bold text-white">
              {metrics.readinessSummary.needsWorkCount} Topics
            </div>
            <p className="text-[11px] text-stone-400">
              Virtual Memory, UNIX Inode File Systems
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-1">
            <span className="text-xs font-bold text-red-400 uppercase">Critical Deficits</span>
            <div className="text-2xl font-bold text-white">
              {metrics.readinessSummary.criticalCount} Topics
            </div>
            <p className="text-[11px] text-stone-400">
              Deadlocks (Banker's Algorithm), Preemptive SJF
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
