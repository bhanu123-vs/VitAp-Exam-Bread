import React, { useState } from 'react';
import {
  Crosshair,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Info,
  Layers,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { PriorityItem } from '../types.js';

interface PriorityMatrixViewProps {
  priorities: PriorityItem[];
  onStartStudy: (topicName: string) => void;
}

export const PriorityMatrixView: React.FC<PriorityMatrixViewProps> = ({
  priorities,
  onStartStudy,
}) => {
  const [selectedTopic, setSelectedTopic] = useState<PriorityItem>(priorities[0] || null);

  return (
    <div id="priority-matrix-view" className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <span>Deterministic Priority Matrix</span>
        </h1>
        <p className="text-sm text-stone-400 mt-1">
          A 2D mathematical coordinate map: Exam Frequency versus Personal Weakness. Focus your finite study hours where they yield the maximum exam marks.
        </p>
      </div>

      {/* Formula Transparency Callout */}
      <div className="p-4 sm:p-5 rounded-2xl bg-stone-900 border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-stone-200 uppercase tracking-wider mb-1">
              Priority Score Formula
            </div>
            <div className="text-stone-300 font-mono">
              Score = (Frequency &times; 0.25) + (Weakness &times; 0.35) + (Marks &times; 0.15) + (Recency &times; 0.15) + (Recurrence &times; 0.10)
            </div>
          </div>
        </div>
        <div className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 self-start sm:self-auto shrink-0">
          [DETERMINISTIC ENGINE]
        </div>
      </div>

      {/* Interactive 2D Matrix Canvas & Quadrants */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: The 2D Plot */}
        <div className="lg:col-span-7 rounded-3xl bg-stone-900 border border-stone-800 p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-amber-400" />
              <span>Exam Frequency vs. Personal Weakness</span>
            </h3>
            <span className="text-xs text-stone-400">Click any plotted node</span>
          </div>

          {/* Graph Stage */}
          <div className="relative w-full aspect-square max-h-[460px] bg-stone-950 rounded-2xl border border-stone-800 p-8 overflow-hidden select-none">
            {/* Axis Lines */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-stone-800 border-dashed border-r border-stone-700" />
            <div className="absolute top-1/2 left-0 right-0 h-px bg-stone-800 border-dashed border-b border-stone-700" />

            {/* Quadrant Watermarks */}
            {/* Top-Right: STUDY FIRST */}
            <div className="absolute top-4 right-4 text-right pointer-events-none">
              <div className="text-xs font-extrabold text-red-400 tracking-wider">
                🔥 STUDY FIRST
              </div>
              <div className="text-[10px] text-stone-400">
                High Frequency + High Weakness
              </div>
            </div>

            {/* Top-Left: MAINTAIN */}
            <div className="absolute top-4 left-4 text-left pointer-events-none">
              <div className="text-xs font-extrabold text-emerald-400 tracking-wider">
                ✓ MAINTAIN
              </div>
              <div className="text-[10px] text-stone-400">
                High Frequency + Strong Accuracy
              </div>
            </div>

            {/* Bottom-Right: SECONDARY */}
            <div className="absolute bottom-4 right-4 text-right pointer-events-none">
              <div className="text-xs font-extrabold text-amber-400 tracking-wider">
                ⚡ SECONDARY
              </div>
              <div className="text-[10px] text-stone-400">
                Low Frequency + High Weakness
              </div>
            </div>

            {/* Bottom-Left: LOW PRIORITY */}
            <div className="absolute bottom-4 left-4 text-left pointer-events-none">
              <div className="text-xs font-extrabold text-stone-400 tracking-wider">
                &bull; LOW PRIORITY
              </div>
              <div className="text-[10px] text-stone-400">
                Low Frequency + Strong Accuracy
              </div>
            </div>

            {/* Plotted Topics Nodes */}
            {priorities.map((item) => {
              // X: Weakness Score (0 to 100), Y: Frequency Score (0 to 100, where 100 is top)
              // Clamped to 10% - 90% inside canvas to prevent edge cutoff
              const leftPct = 10 + (item.weaknessScore / 100) * 80;
              const topPct = 90 - (item.frequencyScore / 100) * 80;
              const isSelected = selectedTopic?.topic === item.topic;

              let dotColor = 'bg-stone-400';
              if (item.quadrant === 'STUDY FIRST') dotColor = 'bg-red-500';
              else if (item.quadrant === 'MAINTAIN') dotColor = 'bg-emerald-500';
              else if (item.quadrant === 'SECONDARY') dotColor = 'bg-amber-500';

              return (
                <button
                  key={item.topic}
                  onClick={() => setSelectedTopic(item)}
                  style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-200 focus:outline-none z-10 ${
                    isSelected ? 'scale-125 z-20' : 'hover:scale-115'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full ${dotColor} flex items-center justify-center text-[10px] font-bold text-stone-950 shadow-md ${
                      isSelected ? 'ring-4 ring-amber-400/50' : 'hover:ring-2 ring-white/50'
                    }`}
                  >
                    {item.priorityScore}
                  </div>
                  <span className="hidden sm:block absolute left-1/2 -translate-x-1/2 top-6 text-[10px] font-semibold whitespace-nowrap px-1.5 py-0.5 rounded bg-stone-900/90 text-stone-200 border border-stone-800 shadow-sm pointer-events-none">
                    {item.topic}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-stone-400 px-2">
            <span>&larr; Strong Student Accuracy</span>
            <span className="font-semibold text-stone-300">Weak Student Accuracy &rarr;</span>
          </div>
        </div>

        {/* Right 5 cols: Selected Topic Transparency Breakdown */}
        {selectedTopic && (
          <div className="lg:col-span-5 rounded-3xl bg-stone-900 border border-stone-800 p-6 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                    selectedTopic.quadrant === 'STUDY FIRST'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : selectedTopic.quadrant === 'MAINTAIN'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-stone-800 text-stone-300 border border-stone-700'
                  }`}
                >
                  {selectedTopic.quadrant}
                </span>
                <div className="text-right">
                  <div className="text-2xl font-extrabold text-amber-400 font-mono">
                    {selectedTopic.priorityScore}/100
                  </div>
                  <div className="text-[10px] text-stone-400 uppercase tracking-wider">
                    Priority Score
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-white">
                  {selectedTopic.topic}
                </h3>
                <p className="text-xs text-amber-300 font-semibold mt-1">
                  {selectedTopic.recommendation}
                </p>
              </div>

              {/* Factors Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800">
                  <span className="text-stone-400 block text-[10px] uppercase">Exam Frequency</span>
                  <strong className="text-white text-sm">{selectedTopic.frequencyCount} Questions</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800">
                  <span className="text-stone-400 block text-[10px] uppercase">Paper Recurrence</span>
                  <strong className="text-white text-sm">{selectedTopic.yearsAppeared}</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800">
                  <span className="text-stone-400 block text-[10px] uppercase">Historical Marks</span>
                  <strong className="text-amber-300 text-sm">{selectedTopic.historicalMarks} Marks</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800">
                  <span className="text-stone-400 block text-[10px] uppercase">Your Accuracy</span>
                  <strong
                    className={`text-sm ${
                      selectedTopic.studentAccuracy < 50
                        ? 'text-red-400'
                        : selectedTopic.studentAccuracy < 75
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {selectedTopic.studentAccuracy}%
                  </strong>
                </div>
              </div>

              {/* Evidence & Why Reasons */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-stone-300">
                  Reasoning & Statistical Evidence:
                </div>
                <ul className="space-y-1.5 text-xs text-stone-300">
                  {selectedTopic.whyReasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 mt-0.5">&bull;</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action */}
            <div className="pt-4 border-t border-stone-800/80">
              <button
                onClick={() => onStartStudy(selectedTopic.topic)}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Start Practice Drill for {selectedTopic.topic}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
