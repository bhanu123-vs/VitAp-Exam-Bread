import React, { useState, useEffect } from 'react';
import {
  PenTool,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RefreshCw,
  Sparkles,
  HelpCircle,
  Tag,
  AlertTriangle,
  Award,
} from 'lucide-react';
import { PracticeQuestion } from '../types.js';
import { api } from '../services/api.js';

interface PracticeViewProps {
  initialTopic?: string;
  onRefreshAccuracy: () => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  initialTopic,
  onRefreshAccuracy,
}) => {
  const [selectedTopic, setSelectedTopic] = useState(initialTopic || 'all');
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [drillCompleted, setDrillCompleted] = useState(false);

  useEffect(() => {
    loadPracticeDrill(selectedTopic);
  }, [selectedTopic]);

  const loadPracticeDrill = async (topic: string) => {
    setLoading(true);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setShowExplanation(false);
    setDrillCompleted(false);

    try {
      const data = await api.generatePractice(topic === 'all' ? undefined : topic, 5);
      setQuestions(data.questions || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const currentQ = questions[currentIndex];

  const handleSelectOption = (optIdx: number) => {
    if (selectedAnswers[currentQ.id] !== undefined) return;
    setSelectedAnswers({ ...selectedAnswers, [currentQ.id]: optIdx });
    setShowExplanation(true);
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowExplanation(false);
    } else {
      // Completed drill
      setDrillCompleted(true);
      let correct = 0;
      questions.forEach((q) => {
        if (selectedAnswers[q.id] === q.correctOptionIndex) correct++;
      });
      await api.submitPractice(selectedTopic === 'all' ? 'General' : selectedTopic, correct, questions.length);
      onRefreshAccuracy();
    }
  };

  return (
    <div id="practice-view" className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <span>High-Yield Practice Drill</span>
          </h1>
          <p className="text-sm text-stone-400 mt-1">
            Questions targeted at your high-frequency and weak exam topics.
          </p>
        </div>

        {/* Topic Selector */}
        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-200 text-xs font-semibold focus:outline-none focus:border-amber-500 self-start sm:self-auto"
        >
          <option value="all">All Topics (Adaptive)</option>
          <option value="Deadlocks">Deadlocks</option>
          <option value="CPU Scheduling">CPU Scheduling</option>
          <option value="Process Synchronization">Process Synchronization</option>
          <option value="Virtual Memory">Virtual Memory</option>
          <option value="Memory Management">Memory Management</option>
        </select>
      </div>

      {loading ? (
        <div className="rounded-3xl bg-stone-900 border border-stone-800 p-16 text-center text-stone-400 space-y-3">
          <RefreshCw className="w-8 h-8 mx-auto text-amber-400 animate-spin" />
          <p className="text-sm font-semibold text-stone-300">
            Curating high-yield exam practice questions...
          </p>
        </div>
      ) : drillCompleted ? (
        /* Completion Summary Card */
        <div className="rounded-3xl bg-stone-900 border border-amber-500/40 p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">
              Drill Completed!
            </h2>
            <p className="text-sm text-stone-300 mt-1">
              Your topic accuracy has been updated in the Deterministic Priority Matrix.
            </p>
          </div>

          <div className="inline-flex items-center gap-6 px-6 py-3 rounded-2xl bg-stone-950 border border-stone-800 text-sm">
            <div>
              <span className="text-stone-400 block text-xs">Score</span>
              <strong className="text-amber-400 text-lg">
                {questions.filter((q) => selectedAnswers[q.id] === q.correctOptionIndex).length} / {questions.length}
              </strong>
            </div>
            <div className="h-8 w-px bg-stone-800" />
            <div>
              <span className="text-stone-400 block text-xs">Accuracy</span>
              <strong className="text-emerald-400 text-lg">
                {Math.round(
                  (questions.filter((q) => selectedAnswers[q.id] === q.correctOptionIndex).length / questions.length) * 100
                )}%
              </strong>
            </div>
          </div>

          <div>
            <button
              onClick={() => loadPracticeDrill(selectedTopic)}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-all"
            >
              Start Another Practice Drill
            </button>
          </div>
        </div>
      ) : currentQ ? (
        /* Active Question Card */
        <div className="rounded-3xl bg-stone-900 border border-stone-800 p-6 sm:p-8 space-y-6 shadow-xl">
          {/* Top Question Info */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-800">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-mono font-bold text-stone-300 bg-stone-950 px-2.5 py-1 rounded-lg border border-stone-800">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  currentQ.sourceType === 'ACTUAL PYQ'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                }`}
              >
                [{currentQ.sourceType}]
              </span>
              {currentQ.year && (
                <span className="font-mono text-stone-400 text-xs">
                  {currentQ.year} Paper
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-300 bg-stone-950 px-2.5 py-1 rounded-lg border border-stone-800">
                {currentQ.marks} Marks
              </span>
              <span className="text-xs text-stone-400 px-2 py-0.5 rounded bg-stone-950 border border-stone-800">
                {currentQ.topic}
              </span>
            </div>
          </div>

          {/* Question Text */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-stone-100 leading-relaxed font-sans">
              {currentQ.questionText}
            </h3>
          </div>

          {/* Multiple Choice Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = selectedAnswers[currentQ.id] === optIdx;
              const hasAnswered = selectedAnswers[currentQ.id] !== undefined;
              const isCorrect = optIdx === currentQ.correctOptionIndex;

              let optionStyle = 'bg-stone-950/80 border-stone-800 hover:border-stone-700 text-stone-200';
              if (hasAnswered) {
                if (isCorrect) {
                  optionStyle = 'bg-emerald-950/30 border-emerald-500/60 text-emerald-200';
                } else if (isSelected && !isCorrect) {
                  optionStyle = 'bg-red-950/30 border-red-500/60 text-red-200';
                }
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={hasAnswered}
                  className={`w-full p-4 rounded-2xl border text-left text-sm font-medium transition-all flex items-center justify-between gap-3 ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-xs font-mono font-bold text-stone-400 shrink-0">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {hasAnswered && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {hasAnswered && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {showExplanation && (
            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Examiner Rationale & Solution</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Bottom Next Button */}
          {selectedAnswers[currentQ.id] !== undefined && (
            <div className="flex items-center justify-end pt-2">
              <button
                onClick={handleNext}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <span>{currentIndex === questions.length - 1 ? 'Finish & Save Accuracy' : 'Next Question'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
