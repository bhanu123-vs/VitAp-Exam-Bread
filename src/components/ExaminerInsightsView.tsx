import React from 'react';
import {
  Award,
  ShieldCheck,
  Zap,
  TrendingUp,
  BarChart2,
  ArrowRight,
  HelpCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ExaminerInsight } from '../types.js';

interface ExaminerInsightsViewProps {
  insights: ExaminerInsight[];
  onStartStudyTopic: (topicName: string) => void;
}

export const ExaminerInsightsView: React.FC<ExaminerInsightsViewProps> = ({
  insights,
  onStartStudyTopic,
}) => {
  return (
    <div id="examiner-insights-view" className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold mb-3 border border-amber-500/20">
          <Award className="w-3.5 h-3.5" />
          <span>Examiner Behavioral Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Examiner Patterns & Historical Biases
        </h1>
        <p className="text-sm text-stone-400 mt-1">
          Every university professor and examination board leaves subtle statistical fingerprints. EXAM BREAD surfaces them directly from 5-year paper cross-analysis.
        </p>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {insights.map((ins) => (
          <div
            key={ins.id}
            className="rounded-3xl bg-stone-900 border border-stone-800 p-6 space-y-4 flex flex-col justify-between hover:border-amber-500/40 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  {ins.category}
                </span>
                <span
                  className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                    ins.evidenceType === 'actual_data'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  }`}
                >
                  [{ins.evidenceType.toUpperCase()}]
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-1.5">
                  {ins.title}
                </h3>
                <p className="text-sm text-stone-200 leading-relaxed font-sans">
                  {ins.observation}
                </p>
              </div>

              {/* Evidence Callout */}
              <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 text-xs text-stone-400 space-y-1">
                <div className="font-semibold text-stone-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ground-Truth Verification:</span>
                </div>
                <p className="leading-relaxed">{ins.evidence}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-800/80 flex items-center justify-between text-xs">
              <span className="font-semibold text-amber-300">
                {ins.statBadge}
              </span>
              <button
                onClick={() => onStartStudyTopic('Deadlocks')}
                className="text-stone-300 hover:text-white font-semibold flex items-center gap-1 hover:translate-x-1 transition-all"
              >
                <span>Practice Relevant Questions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
