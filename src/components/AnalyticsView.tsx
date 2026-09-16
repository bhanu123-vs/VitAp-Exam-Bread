import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Layers,
  GitBranch,
  Calendar,
  Sparkles,
  Info,
  ArrowRight,
  X,
} from 'lucide-react';
import { Paper, Question, QuestionFamily } from '../types.js';

interface AnalyticsViewProps {
  topicFrequency: { name: string; frequency: number; totalMarks: number; difficulty: string }[];
  yearlyTrends: any[];
  marksDistribution: { name: string; marks: number; averageMarksPerYear: number }[];
  heatmap: {
    topic: string;
    totalFrequency: number;
    totalMarks: number;
    years: {
      year: number;
      count: number;
      marks: number;
      questions: any[];
      intensity: number;
    }[];
  }[];
  questionFamilies: QuestionFamily[];
  onNavigateToTopic: (topicName: string) => void;
  userPapers?: Paper[];
  userQuestions?: Question[];
  initialCourseCode?: string;
  onNavigateToUpload?: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  topicFrequency,
  yearlyTrends,
  marksDistribution,
  heatmap,
  questionFamilies,
  onNavigateToTopic,
  userPapers,
  userQuestions,
  initialCourseCode,
  onNavigateToUpload,
}) => {
  const [selectedHeatmapCell, setSelectedHeatmapCell] = useState<{
    topic: string;
    year: number;
    questions: any[];
  } | null>(null);

  const years = [2021, 2022, 2023, 2024, 2025];

  return (
    <div id="analytics-view" className="space-y-8 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <span>Deterministic Exam Analytics & Patterns</span>
          </h1>
          <p className="text-sm text-stone-400 mt-1">
            Ground-truth mathematical charts calculated across all evaluated previous-year question papers.
          </p>
        </div>

        {onNavigateToUpload && (
          <button
            type="button"
            onClick={onNavigateToUpload}
            className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95 shrink-0 self-start sm:self-auto"
          >
            <Sparkles className="w-4 h-4" />
            <span>Upload Question Paper</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* TOPIC FREQUENCY BAR CHART */}
      <div className="rounded-3xl bg-stone-900 border border-stone-800 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-400" />
              <span>Topic Frequency Distribution</span>
            </h2>
            <p className="text-xs text-stone-400">
              Total number of questions asked per topic across 5 exam cycles (2021-2025)
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 self-start">
            [ACTUAL DATA]
          </span>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topicFrequency}
              margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#a8a29e"
                fontSize={11}
                tickLine={false}
                interval={0}
                angle={-20}
                textAnchor="end"
              />
              <YAxis stroke="#a8a29e" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1c1917',
                  borderColor: '#44403c',
                  borderRadius: '12px',
                  color: '#f5f5f4',
                  fontSize: '12px',
                }}
                formatter={(value: any, name: any) => [
                  `${value} questions`,
                  'Exam Frequency',
                ]}
              />
              <Bar dataKey="frequency" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5-YEAR EXAM HEATMAP (Topic × Year) */}
      <div className="rounded-3xl bg-stone-900 border border-stone-800 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>5-Year Exam Heatmap (Topic &times; Year)</span>
            </h2>
            <p className="text-xs text-stone-400">
              Click on any cell to reveal the exact historical questions asked in that exam paper session.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-stone-400">
            <span>Low</span>
            <div className="flex gap-1">
              <span className="w-3 h-3 rounded bg-stone-800" />
              <span className="w-3 h-3 rounded bg-amber-900/60" />
              <span className="w-3 h-3 rounded bg-amber-600/70" />
              <span className="w-3 h-3 rounded bg-amber-500" />
            </div>
            <span>High Intensity</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-800 text-stone-400">
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Topic</th>
                {years.map((y) => (
                  <th key={y} className="py-3 px-3 font-bold text-center font-mono">
                    {y}
                  </th>
                ))}
                <th className="py-3 px-3 font-bold text-center">Total Qs</th>
                <th className="py-3 px-3 font-bold text-center">Total Marks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80">
              {heatmap.map((row) => (
                <tr key={row.topic} className="hover:bg-stone-800/30 transition-colors">
                  <td className="py-3 px-4 font-semibold text-stone-200">
                    <span
                      onClick={() => onNavigateToTopic(row.topic)}
                      className="cursor-pointer hover:text-amber-400 transition-colors"
                    >
                      {row.topic}
                    </span>
                  </td>
                  {row.years.map((cell) => {
                    // Color mapping based on count
                    let bgClass = 'bg-stone-950 text-stone-400 border-stone-800';
                    if (cell.count >= 4) {
                      bgClass = 'bg-amber-500 text-stone-950 font-bold border-amber-400 shadow-sm';
                    } else if (cell.count === 3) {
                      bgClass = 'bg-amber-600/80 text-white font-bold border-amber-500';
                    } else if (cell.count === 2) {
                      bgClass = 'bg-amber-800/60 text-amber-200 border-amber-700/60';
                    } else if (cell.count === 1) {
                      bgClass = 'bg-stone-800/90 text-stone-300 border-stone-700';
                    }

                    return (
                      <td key={cell.year} className="py-2.5 px-2 text-center">
                        <button
                          onClick={() =>
                            setSelectedHeatmapCell({
                              topic: row.topic,
                              year: cell.year,
                              questions: cell.questions,
                            })
                          }
                          className={`w-10 h-8 rounded-lg border text-xs mx-auto flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${bgClass}`}
                        >
                          {cell.count}
                        </button>
                      </td>
                    );
                  })}
                  <td className="py-3 px-3 text-center font-bold text-amber-300 font-mono">
                    {row.totalFrequency}
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-stone-300 font-mono">
                    {row.totalMarks} M
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CELL DRILLDOWN MODAL */}
      {selectedHeatmapCell && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-700 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div>
                <h3 className="text-base font-bold text-white">
                  {selectedHeatmapCell.topic} &bull; {selectedHeatmapCell.year} Paper
                </h3>
                <p className="text-xs text-stone-400">
                  {selectedHeatmapCell.questions.length} questions asked in this specific exam session
                </p>
              </div>
              <button
                onClick={() => setSelectedHeatmapCell(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto">
              {selectedHeatmapCell.questions.length === 0 ? (
                <p className="text-xs text-stone-400 py-4 text-center">
                  No questions asked for this topic in {selectedHeatmapCell.year}.
                </p>
              ) : (
                selectedHeatmapCell.questions.map((q: any) => (
                  <div
                    key={q.id}
                    className="p-3 rounded-xl bg-stone-950 border border-stone-800 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-amber-400 font-mono font-bold">
                      <span>{q.questionNumber}</span>
                      <span>{q.marks} Marks</span>
                    </div>
                    <p className="text-stone-200 leading-relaxed font-sans">
                      {q.questionText}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* YEARLY TRENDS LINE CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trends */}
        <div className="rounded-3xl bg-stone-900 border border-stone-800 p-6 space-y-4">
          <div className="pb-2 border-b border-stone-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span>Year-over-Year Trajectory (2021-2025)</span>
            </h2>
            <p className="text-xs text-stone-400">
              Tracking rising vs steady topics across successive cycles
            </p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yearlyTrends} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
                <XAxis dataKey="year" stroke="#a8a29e" fontSize={11} />
                <YAxis stroke="#a8a29e" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1c1917',
                    borderColor: '#44403c',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="Deadlocks" stroke="#f59e0b" strokeWidth={2.5} />
                <Line type="monotone" dataKey="CPU Scheduling" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="Process Synchronization" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="Virtual Memory" stroke="#a855f7" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Historical Marks Distribution */}
        <div className="rounded-3xl bg-stone-900 border border-stone-800 p-6 space-y-4">
          <div className="pb-2 border-b border-stone-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Historical Marks Yield per Topic</span>
            </h2>
            <p className="text-xs text-stone-400">
              Cumulative marks allocated by examiners across all 5 years
            </p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={marksDistribution.slice(0, 6)} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#292524" horizontal={false} />
                <XAxis type="number" stroke="#a8a29e" fontSize={11} />
                <YAxis type="category" dataKey="name" stroke="#a8a29e" fontSize={10} width={110} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1c1917',
                    borderColor: '#44403c',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                  formatter={(v: any) => [`${v} total marks`, 'Marks']}
                />
                <Bar dataKey="marks" fill="#10b981" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* QUESTION FAMILIES / SEMANTIC DUPLICATES SECTION */}
      <div className="rounded-3xl bg-stone-900 border border-stone-800 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-amber-400" />
              <span>Recurring Question Families (Semantic Similarity)</span>
            </h2>
            <p className="text-xs text-stone-400">
              Questions that repeat across years with altered numbers or phrases, identified via NLP matching
            </p>
          </div>
          <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 self-start">
            [AI SEMANTIC ENGINE]
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {questionFamilies.map((fam) => (
            <div
              key={fam.id}
              className="rounded-2xl bg-stone-950/80 border border-stone-800 p-4 space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    {fam.topic}
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {fam.similarityScore}% Match
                  </span>
                </div>
                <h3 className="font-bold text-stone-100 text-sm mb-1">
                  {fam.underlyingConcept}
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed mb-2">
                  Repeated across <strong className="text-white">{fam.years.join(', ')}</strong> ({fam.occurrenceCount} occurrences, {fam.totalMarks} Marks total).
                </p>
                <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-[11px] text-stone-300 italic">
                  "{fam.canonicalQuestion.substring(0, 110)}..."
                </div>
              </div>

              <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between text-xs text-amber-400">
                <span>{fam.variations.length} variations</span>
                <span className="font-semibold cursor-pointer hover:underline">
                  View Variations &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
