import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  HelpCircle,
} from 'lucide-react';

interface WeaknessViewProps {
  weaknesses: {
    id: string;
    name: string;
    accuracy: number;
    questionsAttempted: number;
    questionsCorrect: number;
    difficulty: string;
    frequency: number;
    priorityScore: number;
    status: 'Critical' | 'Needs Work' | 'Strong';
    improvement: string;
  }[];
  onUpdateStatus: (topicName: string, status: 'Critical' | 'Needs Work' | 'Strong') => Promise<void>;
  onOpenDiagnostic: () => void;
  onStartPractice: (topicName: string) => void;
}

export const WeaknessView: React.FC<WeaknessViewProps> = ({
  weaknesses,
  onUpdateStatus,
  onOpenDiagnostic,
  onStartPractice,
}) => {
  const [updatingTopic, setUpdatingTopic] = useState<string | null>(null);

  const handleStatusClick = async (topicName: string, newStatus: 'Critical' | 'Needs Work' | 'Strong') => {
    setUpdatingTopic(topicName);
    await onUpdateStatus(topicName, newStatus);
    setUpdatingTopic(null);
  };

  return (
    <div id="weakness-view" className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <span>Student Weakness Engine</span>
          </h1>
          <p className="text-sm text-stone-400 mt-1">
            Personal diagnostic accuracy ranked from lowest to highest.
          </p>
        </div>

        <button
          onClick={onOpenDiagnostic}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Launch 10-Question Diagnostic Drill</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-stone-900 border border-red-500/30 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400">
              Critical Deficits (&lt;55%)
            </span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {weaknesses.filter((w) => w.status === 'Critical').length} Topics
          </div>
          <div className="text-xs text-stone-400 mt-1">
            Deadlocks, CPU Scheduling
          </div>
        </div>

        <div className="rounded-2xl bg-stone-900 border border-amber-500/30 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Needs Work (55-75%)
            </span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {weaknesses.filter((w) => w.status === 'Needs Work').length} Topics
          </div>
          <div className="text-xs text-stone-400 mt-1">
            Virtual Memory, File Systems
          </div>
        </div>

        <div className="rounded-2xl bg-stone-900 border border-emerald-500/30 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Strong Topics (&gt;75%)
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {weaknesses.filter((w) => w.status === 'Strong').length} Topics
          </div>
          <div className="text-xs text-stone-400 mt-1">
            Memory Mgmt, Synchronization
          </div>
        </div>
      </div>

      {/* Weakness Ranking Table */}
      <div className="rounded-3xl bg-stone-900 border border-stone-800 p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <div>
            <h3 className="text-base font-bold text-white">
              Topic Mastery & Manual Override
            </h3>
            <p className="text-xs text-stone-400">
              You can manually adjust your comfort level if you recently reviewed a topic outside EXAM BREAD.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {weaknesses.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="space-y-1 max-w-md">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-stone-100 text-sm">
                    {item.name}
                  </h4>
                  <span className="text-[10px] font-mono text-stone-400">
                    Exam Frequency: {item.frequency} Qs
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-stone-400">
                  <span>Priority: <strong className="text-amber-400">{item.priorityScore}</strong></span>
                  <span>&bull;</span>
                  <span>Diagnostic Accuracy: <strong className={item.accuracy < 55 ? 'text-red-400' : 'text-amber-400'}>{item.accuracy}%</strong></span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="lg:w-48 space-y-1">
                <div className="flex justify-between text-[11px] text-stone-400">
                  <span>Mastery</span>
                  <span>{item.accuracy}%</span>
                </div>
                <div className="h-2 rounded-full bg-stone-900 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      item.accuracy < 55 ? 'bg-red-500' : item.accuracy < 75 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${item.accuracy}%` }}
                  />
                </div>
              </div>

              {/* Manual Override Buttons */}
              <div className="flex items-center gap-2 self-end lg:self-center">
                <span className="text-[10px] text-stone-400 uppercase mr-1">Override:</span>
                <button
                  onClick={() => handleStatusClick(item.name, 'Critical')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                    item.status === 'Critical'
                      ? 'bg-red-500/20 text-red-300 border-red-500/40'
                      : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200'
                  }`}
                >
                  Critical
                </button>
                <button
                  onClick={() => handleStatusClick(item.name, 'Needs Work')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                    item.status === 'Needs Work'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200'
                  }`}
                >
                  Medium
                </button>
                <button
                  onClick={() => handleStatusClick(item.name, 'Strong')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                    item.status === 'Strong'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200'
                  }`}
                >
                  Strong
                </button>

                <button
                  onClick={() => onStartPractice(item.name)}
                  className="ml-2 px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs"
                >
                  Practice
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
