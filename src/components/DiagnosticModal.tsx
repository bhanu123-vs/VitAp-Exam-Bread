import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RefreshCw,
  Award,
} from 'lucide-react';
import { api } from '../services/api.js';

interface DiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleted: () => void;
}

const DIAGNOSTIC_QUESTIONS = [
  {
    id: 'diag-1',
    topic: 'Algorithmic Optimization & Complexity',
    question: 'When analyzing recurrence relations using Master Theorem for T(n) = 2T(n/2) + O(n), what is the tight asymptotic bound?',
    options: [
      'Theta(n log n)',
      'Theta(n^2)',
      'Theta(log n)',
      'Theta(n)'
    ],
    correct: 0,
    explanation: 'Since log_b(a) = log_2(2) = 1, which equals the power of f(n) = n^1, Case 2 of Master Theorem applies, yielding Theta(n log n).'
  },
  {
    id: 'diag-2',
    topic: 'CPU Scheduling',
    question: 'Which scheduling algorithm is known to be provably optimal in terms of minimizing average waiting time, but suffers from starvation?',
    options: [
      'First-Come First-Served (FCFS)',
      'Preemptive Shortest Job First (SJF / SRTF)',
      'Round Robin with high time quantum',
      'Multilevel Feedback Queue'
    ],
    correct: 1,
    explanation: 'Shortest Job First is provably optimal with minimum average waiting time, but long processes may starve if short processes arrive continuously.'
  },
  {
    id: 'diag-3',
    topic: 'Process Synchronization',
    question: 'What is the primary role of a counting semaphore initialized to value N > 1?',
    options: [
      'Provide mutual exclusion for a single critical section',
      'Manage access to a finite pool of N identical resource instances',
      'Eliminate race conditions in user-level threads only',
      'Guarantee priority inheritance in real-time kernels'
    ],
    correct: 1,
    explanation: 'A counting semaphore with value N controls access to a finite resource pool of N instances.'
  },
  {
    id: 'diag-4',
    topic: 'Virtual Memory',
    question: 'Belady\'s Anomaly describes a phenomenon where increasing the number of page frames leads to:',
    options: [
      'Fewer page faults under LRU replacement',
      'More page faults under FIFO page replacement',
      'Immediate thrashing in optimal page replacement',
      'Higher TLB hit ratios'
    ],
    correct: 1,
    explanation: 'Belady\'s Anomaly occurs in FIFO replacement where adding more page frames can paradoxically increase page faults.'
  },
  {
    id: 'diag-5',
    topic: 'Memory Management',
    question: 'External fragmentation in contiguous memory allocation can be resolved by:',
    options: [
      'Increasing segment size',
      'Paging memory management scheme',
      'Using Best-Fit allocation instead of Worst-Fit',
      'Increasing physical RAM voltage'
    ],
    correct: 1,
    explanation: 'Non-contiguous allocation schemes such as Paging eliminate external fragmentation entirely.'
  }
];

export const DiagnosticModal: React.FC<DiagnosticModalProps> = ({
  isOpen,
  onClose,
  onCompleted,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [finished, setFinished] = useState(false);

  if (!isOpen) return null;

  const currentQ = DIAGNOSTIC_QUESTIONS[currentIdx];

  const handleSelect = (optIdx: number) => {
    setAnswers({ ...answers, [currentIdx]: optIdx });
  };

  const handleNext = async () => {
    if (currentIdx < DIAGNOSTIC_QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Calculate and submit results
      setIsSubmitting(true);
      try {
        let correct = 0;
        DIAGNOSTIC_QUESTIONS.forEach((q, idx) => {
          if (answers[idx] === q.correct) correct++;
        });

        // Submit to API
        const stringKeyedAnswers: Record<string, number> = {};
        Object.entries(answers).forEach(([k, v]) => {
          stringKeyedAnswers[k] = v;
        });

        await api.submitDiagnostic({
          attemptId: `diag-${Date.now()}`,
          answers: stringKeyedAnswers,
          timeSpentSeconds: 90,
        });
        setFinished(true);
        onCompleted();
      } catch (e) {
        console.error(e);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-700 rounded-3xl max-w-xl w-full p-6 sm:p-7 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Exam Bread Diagnostic Drill
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {finished ? (
          <div className="text-center py-6 space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white">
                Diagnostic Complete!
              </h3>
              <p className="text-xs text-stone-300 mt-1 max-w-sm mx-auto">
                Your personal topic accuracy scores and the 2D Priority Matrix have been updated in real time.
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs"
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-400">
                Question {currentIdx + 1} of {DIAGNOSTIC_QUESTIONS.length}
              </span>
              <span className="font-bold text-amber-400">
                {currentQ.topic}
              </span>
            </div>

            <p className="text-base text-stone-100 font-semibold leading-relaxed">
              {currentQ.question}
            </p>

            <div className="space-y-2.5">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = answers[currentIdx] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelect(optIdx)}
                    className={`w-full p-3.5 rounded-xl border text-left text-xs font-medium transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500 text-amber-200'
                        : 'bg-stone-950/80 border-stone-800 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${
                        isSelected
                          ? 'bg-amber-500 text-stone-950'
                          : 'bg-stone-900 text-stone-400'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-stone-800">
              <button
                onClick={handleNext}
                disabled={answers[currentIdx] === undefined || isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-40"
              >
                <span>{currentIdx === DIAGNOSTIC_QUESTIONS.length - 1 ? 'Submit & Recalculate' : 'Next Question'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
