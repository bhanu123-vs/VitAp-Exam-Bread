import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Target,
  Clock,
  Award,
  BookOpen,
  Download,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  FileText,
  Mail,
  User,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { AvailablePyqPaper, ExamType } from '../types.js';
import { generatePaperPriorityAnalysis } from '../utils/aiAnalysisGenerator.js';
import { downloadPypPdf } from '../utils/pdfGenerator.js';
import { VitApLogo } from './VitApLogo.js';
import { ExamBreadLogo } from './ExamBreadLogo.js';
import { AiPaperGraph } from './AiPaperGraph.js';
import { BarChart3 } from 'lucide-react';

interface AiPaperAnalysisModalProps {
  paper: AvailablePyqPaper | null;
  isOpen: boolean;
  onClose: () => void;
  onStartPractice?: (topicName: string) => void;
}

export const AiPaperAnalysisModal: React.FC<AiPaperAnalysisModalProps> = ({
  paper,
  isOpen,
  onClose,
  onStartPractice,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'priority' | 'graph' | 'patterns' | 'timing'>('graph');
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen || !paper) return null;

  const analysis = paper.priorityAnalysis || generatePaperPriorityAnalysis(paper);

  const getExamBadge = (examType: ExamType) => {
    switch (examType) {
      case 'cat1':
        return { label: 'CAT-1 (Continuous Assessment 1)', color: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30' };
      case 'cat2':
        return { label: 'CAT-2 (Continuous Assessment 2)', color: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30' };
      case 'fat':
      case 'end_term':
        return { label: 'FAT (Final Assessment Test)', color: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30' };
      default:
        return { label: 'CAT (Continuous Assessment)', color: 'bg-violet-500/15 text-violet-600 dark:text-violet-300 border-violet-500/30' };
    }
  };

  const examBadge = getExamBadge(paper.examType);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      if (paper.driveUrl) {
        window.open(paper.driveUrl, '_blank');
      } else {
        await downloadPypPdf(paper);
      }
    } finally {
      setTimeout(() => setIsDownloading(false), 600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-200 dark:border-stone-800 bg-gradient-to-r from-[#002147]/10 via-stone-100 dark:via-stone-800/40 to-amber-500/10 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <VitApLogo size="sm" showSubtitle={false} />
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${examBadge.color}`}>
                  {examBadge.label}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                  {paper.year}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Pattern Analyzed</span>
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white tracking-tight">
                {paper.courseName} <span className="text-amber-600 dark:text-amber-400">({paper.courseCode})</span>
              </h2>

              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-2xl leading-relaxed">
                {analysis.overallStrategy}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sub-Navigation Tabs */}
          <div className="flex items-center gap-1 mt-5 border-b border-stone-200/80 dark:border-stone-800/80 pt-1 overflow-x-auto">
            <button
              onClick={() => setActiveSubTab('graph')}
              className={`px-3.5 py-2 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors border-b-2 whitespace-nowrap ${
                activeSubTab === 'graph'
                  ? 'border-amber-500 text-amber-600 dark:text-amber-400 bg-white dark:bg-stone-900'
                  : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-amber-500" />
              <span>Visual Graphs & Pattern Analytics</span>
            </button>

            <button
              onClick={() => setActiveSubTab('priority')}
              className={`px-3.5 py-2 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors border-b-2 whitespace-nowrap ${
                activeSubTab === 'priority'
                  ? 'border-amber-500 text-amber-600 dark:text-amber-400 bg-white dark:bg-stone-900'
                  : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>Top Priority Topics ({analysis.topPriorityTopics.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('patterns')}
              className={`px-3.5 py-2 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors border-b-2 whitespace-nowrap ${
                activeSubTab === 'patterns'
                  ? 'border-amber-500 text-amber-600 dark:text-amber-400 bg-white dark:bg-stone-900'
                  : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>80/20 & Repeat Patterns</span>
            </button>

            <button
              onClick={() => setActiveSubTab('timing')}
              className={`px-3.5 py-2 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors border-b-2 whitespace-nowrap ${
                activeSubTab === 'timing'
                  ? 'border-amber-500 text-amber-600 dark:text-amber-400 bg-white dark:bg-stone-900'
                  : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Exam Timing & Pacing</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 0: VISUAL GRAPHS */}
          {activeSubTab === 'graph' && (
            <div className="space-y-4">
              <AiPaperGraph paper={paper} />
            </div>
          )}

          {/* TAB 1: TOP PRIORITY TOPICS */}
          {activeSubTab === 'priority' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Must-Do Topics Ranked by Exam Frequency & Marks</span>
                </h3>
                <span className="text-xs text-stone-500 font-medium">
                  {paper.courseCode} Examination Blueprint
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3.5">
                {analysis.topPriorityTopics.map((topic, index) => (
                  <div
                    key={index}
                    className="p-4 sm:p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/80 hover:border-amber-500/40 transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-black text-xs flex items-center justify-center">
                          #{index + 1}
                        </span>
                        <div>
                          <h4 className="text-base font-bold text-stone-900 dark:text-white">
                            {topic.topic}
                          </h4>
                          {topic.subtopic && (
                            <span className="text-xs text-stone-500 dark:text-stone-400">
                              {topic.subtopic}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-amber-500 text-stone-950 shadow-sm">
                          Priority {topic.priorityScore}/100
                        </span>
                        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                          {topic.historicalFrequency}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                          ~{topic.totalHistoricalMarks} Marks
                        </span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                      {topic.reason}
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-xs font-bold text-stone-500 mr-1">Core Concepts:</span>
                      {topic.keyConceptsToMaster.map((concept, cIdx) => (
                        <span
                          key={cIdx}
                          className="px-2 py-0.5 rounded-md text-xs font-medium bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800"
                        >
                          {concept}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 dark:border-stone-700/50 text-xs">
                      <span className="text-stone-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>Recommended Practice Time: <strong>{topic.recommendedTimeMinutes} mins</strong></span>
                      </span>

                      {onStartPractice && (
                        <button
                          onClick={() => {
                            onStartPractice(topic.topic);
                            onClose();
                          }}
                          className="px-3 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold flex items-center gap-1 transition-colors"
                        >
                          <span>Practice Topic</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: 80/20 & RECURRING PATTERNS */}
          {activeSubTab === 'patterns' && (
            <div className="space-y-6">
              {/* 80/20 High-Yield Strategy */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-stone-900 dark:text-white">
                    The 80/20 Exam Rule for {paper.courseName}
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-2.5">
                  {analysis.highYield80_20Rules.map((rule, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs sm:text-sm text-stone-800 dark:text-stone-200 flex items-start gap-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recurring Question Patterns */}
              <div className="space-y-3">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  Repeat Question Blueprints Across Exam Cycles
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {analysis.recurringPatterns.map((pat, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/80 space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                          {pat.patternName}
                        </h4>
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300">
                          {pat.marksWeight}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
                        {pat.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TIMING & PACING */}
          {activeSubTab === 'timing' && (
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Recommended Examination Hall Pacing Strategy ({paper.timeDuration})
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                      Phase 1: Part A
                    </span>
                    <Clock className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="text-sm font-bold text-stone-900 dark:text-white">
                    Compulsory Short Problems
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300">
                    {analysis.timingStrategy.partA}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                      Phase 2: Part B
                    </span>
                    <Target className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-sm font-bold text-stone-900 dark:text-white">
                    Long Analytical Problems
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300">
                    {analysis.timingStrategy.partB}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                      Phase 3: Final Review
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="text-sm font-bold text-stone-900 dark:text-white">
                    Units & Math Verification
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300">
                    {analysis.timingStrategy.review}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Action Buttons */}
        <div className="p-4 sm:p-5 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 shrink-0 flex items-center justify-between gap-3">
          <div className="text-xs text-stone-500 font-medium">
            VIT-AP Examination Intelligence
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
            >
              Close
            </button>

            {paper.driveUrl ? (
              <a
                href={paper.driveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Official PDFs (Google Drive)</span>
              </a>
            ) : (
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                <Download className={`w-3.5 h-3.5 ${isDownloading ? 'animate-bounce' : ''}`} />
                <span>{isDownloading ? 'Generating...' : 'Download Verified PDF'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
