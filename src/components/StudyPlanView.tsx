import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Award,
  AlertCircle,
  SkipForward,
} from 'lucide-react';
import { StudyPlanDay, StudyTask } from '../types.js';

interface StudyPlanViewProps {
  plan: StudyPlanDay[];
  dailyHours: number;
  completedCount: number;
  onUpdateDailyHours: (hours: number) => Promise<void>;
  onToggleTask: (taskId: string) => Promise<void>;
  onSkipTask: (taskId: string) => Promise<void>;
  onRegeneratePlan: () => Promise<void>;
  onStartPracticeTopic: (topic: string) => void;
}

export const StudyPlanView: React.FC<StudyPlanViewProps> = ({
  plan,
  dailyHours,
  completedCount,
  onUpdateDailyHours,
  onToggleTask,
  onSkipTask,
  onRegeneratePlan,
  onStartPracticeTopic,
}) => {
  const [selectedDayNum, setSelectedDayNum] = useState<number>(1);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const totalTasks = plan.reduce((sum, d) => sum + d.tasks.length, 0) || 28;
  const progressPct = Math.min(100, Math.round((completedCount / totalTasks) * 100));

  const activeDay = plan.find((d) => d.dayNumber === selectedDayNum) || plan[0];

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    await onRegeneratePlan();
    setIsRegenerating(false);
  };

  return (
    <div id="study-plan-view" className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <span>Adaptive 7-Day Exam Study Plan</span>
          </h1>
          <p className="text-sm text-stone-400 mt-1">
            Prioritizes topics that combine high historical exam frequency with low student accuracy.
          </p>
        </div>

        <button
          id="btn-regenerate-study-plan"
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-amber-300 font-semibold text-xs border border-amber-500/30 flex items-center gap-2 transition-all shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isRegenerating ? 'animate-spin' : ''}`} />
          <span>Regenerate with Latest Accuracy</span>
        </button>
      </div>

      {/* Daily Study Hours & Overall Plan Progress Banner */}
      <div className="rounded-3xl bg-stone-900 border border-stone-800 p-5 sm:p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Daily Study Hours Selector */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
              How many hours can you study per day?
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {[1, 2, 3, 4].map((hrs) => (
                <button
                  key={hrs}
                  onClick={() => onUpdateDailyHours(hrs)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    dailyHours === hrs
                      ? 'bg-amber-500 text-stone-950 shadow-md scale-105'
                      : 'bg-stone-950 text-stone-300 border border-stone-800 hover:border-stone-700'
                  }`}
                >
                  {hrs === 4 ? '4+ Hours' : `${hrs} Hour${hrs > 1 ? 's' : ''}`}
                </button>
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="lg:w-80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-300">
                Plan Completion Progress
              </span>
              <span className="font-mono font-bold text-amber-400">
                {completedCount}/{totalTasks} Tasks ({progressPct}%)
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-stone-950 border border-stone-800 overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all duration-300 rounded-full"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* 7-Day Tabs Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 pt-2 border-t border-stone-800/80">
          {plan.map((day) => {
            const isSelected = selectedDayNum === day.dayNumber;
            const dayCompletedTasks = day.tasks.filter((t) => t.completed).length;
            const isAllCompleted = dayCompletedTasks === day.tasks.length;

            return (
              <button
                key={day.dayNumber}
                onClick={() => setSelectedDayNum(day.dayNumber)}
                className={`p-3 rounded-2xl border text-left transition-all relative ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 shadow-sm'
                    : 'bg-stone-950/80 border-stone-800 hover:border-stone-700 text-stone-300'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-bold">Day {day.dayNumber}</span>
                  {isAllCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <span className="text-[10px] text-stone-400 font-mono">
                      {dayCompletedTasks}/{day.tasks.length}
                    </span>
                  )}
                </div>
                <div className="text-[11px] font-semibold truncate text-stone-200">
                  {day.theme.split(':')[1]?.trim() || day.theme}
                </div>
                <div className="text-[10px] text-stone-400 mt-1">
                  {day.dateStr}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Day Detail Card */}
      {activeDay && (
        <div className="rounded-3xl bg-stone-900 border border-stone-800 p-6 sm:p-7 space-y-6">
          {/* Day Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-amber-500 text-stone-950">
                  Day {activeDay.dayNumber} Focus
                </span>
                <span className="text-xs font-mono text-stone-400">
                  {activeDay.totalMinutes} minutes allocated
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-white">
                {activeDay.theme}
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 mt-1">
                Priority: <strong className="text-amber-400">{activeDay.priorityScore}/100</strong> &bull; {activeDay.reason}
              </p>
            </div>

            <button
              onClick={() => onStartPracticeTopic(activeDay.tasks[0]?.topic || 'Deadlocks')}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
            >
              <span>Practice Today's Topic</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Daily Tasks List */}
          <div className="space-y-3">
            {activeDay.tasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border text-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  task.completed
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : task.skipped
                    ? 'bg-stone-950/50 border-stone-800 opacity-60'
                    : 'bg-stone-950 border-stone-800 hover:border-stone-700'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <button
                    onClick={() => onToggleTask(task.id)}
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      task.completed
                        ? 'bg-emerald-500 border-emerald-400 text-stone-950'
                        : 'border-stone-700 bg-stone-900 text-transparent hover:border-amber-400'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`font-bold ${
                          task.completed ? 'line-through text-stone-400' : 'text-stone-100'
                        }`}
                      >
                        {task.title}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {task.type}
                      </span>
                    </div>
                    <div className="text-xs text-stone-400">
                      {task.concept} &bull; {task.reason}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <span className="text-xs text-stone-300 bg-stone-900 px-2.5 py-1 rounded-lg border border-stone-800 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{task.durationMinutes} mins</span>
                  </span>

                  {!task.completed && !task.skipped && (
                    <button
                      onClick={() => onSkipTask(task.id)}
                      title="Skip task for later"
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 text-xs"
                    >
                      <SkipForward className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
