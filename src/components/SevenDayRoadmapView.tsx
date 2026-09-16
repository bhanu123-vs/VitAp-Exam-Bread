import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  BookOpen,
  RefreshCw,
  Award,
  Download,
  Check,
  ChevronRight,
  HelpCircle,
  BarChart2,
  FileText,
  Flame,
  Search,
} from 'lucide-react';
import { VPATH_COURSES } from '../data/vpathRealPapers.js';
import { getQuizForCourse, PyqQuizQuestion } from '../data/courseQuizzes.js';
import { generateLaggingAware7DayRoadmap } from '../utils/sevenDayRoadmapGenerator.js';
import { StudyPlanDay, StudyTask } from '../types.js';
import { jsPDF } from 'jspdf';

interface SevenDayRoadmapViewProps {
  initialCourseCode?: string;
  onNavigateToPaper?: (courseCode: string) => void;
}

export const SevenDayRoadmapView: React.FC<SevenDayRoadmapViewProps> = ({
  initialCourseCode = 'CSE2001',
}) => {
  // Course selection state
  const [selectedCourseCode, setSelectedCourseCode] = useState<string>(initialCourseCode);
  const [searchCourseQuery, setSearchCourseQuery] = useState<string>('');
  const [selectedExamType, setSelectedExamType] = useState<'cat1' | 'cat2' | 'fat'>('cat1');

  // Diagnostic Quiz state
  // 'selection' | 'quiz' | 'quiz_result' | 'roadmap'
  const [step, setStep] = useState<'selection' | 'quiz' | 'quiz_result' | 'roadmap'>('selection');
  const [currentQIdx, setCurrentQIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  // Diagnostic Results
  const [quizScore, setQuizScore] = useState<number>(0);
  const [laggingTopics, setLaggingTopics] = useState<string[]>([]);
  const [masteredTopics, setMasteredTopics] = useState<string[]>([]);

  // Roadmap state
  const [dailyHours, setDailyHours] = useState<number>(2);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [roadmapDays, setRoadmapDays] = useState<StudyPlanDay[]>([]);
  const [completedTaskIds, setCompletedTaskIds] = useState<Set<string>>(new Set());

  // Current active course object
  const currentCourse = useMemo(() => {
    return (
      VPATH_COURSES.find((c) => c.code.toLowerCase() === selectedCourseCode.toLowerCase()) ||
      VPATH_COURSES[0]
    );
  }, [selectedCourseCode]);

  // Filtered course list for selection
  const filteredCourses = useMemo(() => {
    if (!searchCourseQuery.trim()) return VPATH_COURSES.slice(0, 12);
    const q = searchCourseQuery.toLowerCase();
    return VPATH_COURSES.filter(
      (c) => c.title.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
    );
  }, [searchCourseQuery]);

  // Quiz questions for currently selected course
  const quizQuestions: PyqQuizQuestion[] = useMemo(() => {
    return getQuizForCourse(currentCourse.code, currentCourse.title);
  }, [currentCourse]);

  // Start the Diagnostic Quiz
  const handleStartQuiz = () => {
    setCurrentQIdx(0);
    setAnswers({});
    setSelectedOption(null);
    setShowExplanation(false);
    setStep('quiz');
  };

  // Generate 7-Day Roadmap Directly without taking quiz first
  const handleGenerateDirectRoadmap = (targetExam: 'cat1' | 'cat2' | 'fat' = selectedExamType) => {
    setSelectedExamType(targetExam);
    const allTopics = quizQuestions.map((q) => q.topic);
    const generated = generateLaggingAware7DayRoadmap({
      courseCode: currentCourse.code,
      courseTitle: currentCourse.title,
      examType: targetExam,
      dailyHours,
      laggingTopics: laggingTopics.length > 0 ? laggingTopics : allTopics.slice(0, 2),
      masteredTopics,
      allCommonTopics: allTopics,
      overallAccuracy: quizScore || 75,
    });
    setRoadmapDays(generated);
    setSelectedDayNumber(1);
    setStep('roadmap');
  };

  // Handle Option Selection in Quiz
  const handleSelectOption = (optIdx: number) => {
    setSelectedOption(optIdx);
    setAnswers((prev) => ({ ...prev, [currentQIdx]: optIdx }));
    setShowExplanation(true);
  };

  // Handle Next Question in Quiz
  const handleNextQuestion = () => {
    if (currentQIdx < quizQuestions.length - 1) {
      const nextIdx = currentQIdx + 1;
      setCurrentQIdx(nextIdx);
      setSelectedOption(answers[nextIdx] !== undefined ? answers[nextIdx] : null);
      setShowExplanation(answers[nextIdx] !== undefined);
    } else {
      // Evaluate Quiz
      finishQuiz();
    }
  };

  // Compute Quiz Results and Identify Lagging Topics
  const finishQuiz = () => {
    let totalCorrect = 0;
    const topicStats: Record<string, { total: number; correct: number }> = {};

    quizQuestions.forEach((q, idx) => {
      const userAns = answers[idx];
      const isCorrect = userAns === q.correct;
      if (isCorrect) totalCorrect++;

      if (!topicStats[q.topic]) {
        topicStats[q.topic] = { total: 0, correct: 0 };
      }
      topicStats[q.topic].total += 1;
      if (isCorrect) {
        topicStats[q.topic].correct += 1;
      }
    });

    const calculatedAccuracy = Math.round(
      (totalCorrect / Math.max(quizQuestions.length, 1)) * 100
    );
    setQuizScore(calculatedAccuracy);

    // Identify lagging topics (accuracy < 60% or questions missed)
    const lagging: string[] = [];
    const mastered: string[] = [];

    Object.entries(topicStats).forEach(([tName, stat]) => {
      const acc = (stat.correct / stat.total) * 100;
      if (acc < 60) {
        lagging.push(tName);
      } else {
        mastered.push(tName);
      }
    });

    // If all were answered correctly, select the most advanced topics as stretch targets
    const finalLagging =
      lagging.length > 0
        ? lagging
        : quizQuestions.slice(Math.max(0, quizQuestions.length - 2)).map((q) => q.topic);

    setLaggingTopics(finalLagging);
    setMasteredTopics(mastered);

    // Generate the 7-day roadmap based on lagging topics + all common topics
    const allTopics = quizQuestions.map((q) => q.topic);
    const generated = generateLaggingAware7DayRoadmap({
      courseCode: currentCourse.code,
      courseTitle: currentCourse.title,
      examType: selectedExamType,
      dailyHours,
      laggingTopics: finalLagging,
      masteredTopics: mastered,
      allCommonTopics: allTopics,
      overallAccuracy: calculatedAccuracy,
    });

    setRoadmapDays(generated);
    setStep('quiz_result');
  };

  // Toggle Task Completion
  const handleToggleTask = (taskId: string) => {
    setCompletedTaskIds((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  // Export 7-Day Roadmap to PDF
  const handleExportPdf = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const margin = 14;
    let y = 16;

    // Header
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('EXAM BREAD • 7-DAY PREPARATION ROADMAP', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(251, 191, 36);
    doc.text(
      `VIT-AP University • ${currentCourse.title} (${currentCourse.code}) • ${selectedExamType.toUpperCase()}`,
      margin,
      y + 7
    );

    y = 38;
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(`Diagnostic Accuracy: ${quizScore}%`, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(220, 38, 38);
    doc.text(`Identified Lagging Topics: ${laggingTopics.join(', ')}`, margin, y + 5);

    y += 14;

    roadmapDays.forEach((day) => {
      if (y > 260) {
        doc.addPage();
        y = 16;
      }

      doc.setFillColor(241, 245, 249);
      doc.rect(margin, y, 182, 7, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text(
        `Day ${day.dayNumber}: ${day.theme} (${day.totalMinutes} mins)`,
        margin + 2,
        y + 5
      );
      y += 10;

      day.tasks.forEach((task) => {
        if (y > 275) {
          doc.addPage();
          y = 16;
        }
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(51, 65, 85);
        doc.text(`[ ] ${task.title} (${task.durationMinutes} mins - ${task.type})`, margin + 4, y);
        y += 4;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text(`    Why: ${task.reason}`, margin + 4, y);
        y += 5.5;
      });

      y += 3;
    });

    doc.save(`EXAM_BREAD_7Day_Roadmap_${currentCourse.code}_${selectedExamType.toUpperCase()}.pdf`);
  };

  const activeDay =
    roadmapDays.find((d) => d.dayNumber === selectedDayNumber) || roadmapDays[0];

  const totalTasks = roadmapDays.reduce((sum, d) => sum + d.tasks.length, 0) || 28;
  const completedCount = completedTaskIds.size;
  const progressPct = Math.min(100, Math.round((completedCount / totalTasks) * 100));

  return (
    <div id="seven-day-roadmap-container" className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-700 dark:text-amber-300 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VIT-AP 7-Day Pre-Exam Roadmap Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            7-Day Topic Mastery Roadmap
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Conducts a quick PYQ diagnostic quiz first to identify your lagging topics, then builds a tailored 7-day revision schedule.
          </p>
        </div>

        {/* Step Indicator Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-xs self-start sm:self-auto font-medium">
          <button
            onClick={() => setStep('selection')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              step === 'selection'
                ? 'bg-amber-500 text-stone-950 font-bold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            1. Select Course
          </button>
          <button
            onClick={() => {
              if (roadmapDays.length > 0) setStep('roadmap');
              else handleStartQuiz();
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              step === 'quiz' || step === 'quiz_result'
                ? 'bg-amber-500 text-stone-950 font-bold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            2. Diagnostic Quiz
          </button>
          <button
            disabled={roadmapDays.length === 0}
            onClick={() => setStep('roadmap')}
            className={`px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40 ${
              step === 'roadmap'
                ? 'bg-amber-500 text-stone-950 font-bold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            3. 7-Day Roadmap
          </button>
        </div>
      </div>

      {/* STEP 1: COURSE & EXAM SELECTION */}
      {step === 'selection' && (
        <div className="space-y-6">
          <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-500" />
                  <span>Choose Course & Exam for 7-Day Roadmap</span>
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Select your university exam type below to generate an exact syllabus-aligned 7-day revision schedule.
                </p>
              </div>
            </div>

            {/* Exam Segment (CAT-1, CAT-2, FAT) - Distinct Cards */}
            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-2.5">
                Target University Examination Segment:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'cat1' as const,
                    title: 'CAT-1',
                    badge: 'Modules 1 & 2',
                    marks: '50 Marks • 1.5 Hours',
                    desc: 'Focuses on fundamental definitions, core theorems, and Part A/B numerical questions from Unit 1 & 2.',
                  },
                  {
                    id: 'cat2' as const,
                    title: 'CAT-2',
                    badge: 'Modules 3 & 4',
                    marks: '50 Marks • 1.5 Hours',
                    desc: 'Focuses on advanced design architectures, derivations, and high-weightage 10-mark problems from Unit 3 & 4.',
                  },
                  {
                    id: 'fat' as const,
                    title: 'FAT (Final Exam)',
                    badge: 'All Modules (1–5)',
                    marks: '100 Marks • 3.0 Hours',
                    desc: 'Comprehensive full-syllabus university evaluation across all 5 course modules with step marking.',
                  },
                ].map((ex) => {
                  const isSel = selectedExamType === ex.id;
                  return (
                    <div
                      key={ex.id}
                      onClick={() => setSelectedExamType(ex.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSel
                          ? 'bg-amber-500/15 border-amber-500 shadow-md ring-2 ring-amber-500/40'
                          : 'bg-stone-50 dark:bg-stone-800/50 border-stone-200 dark:border-stone-700 hover:border-amber-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-sm font-black ${isSel ? 'text-amber-600 dark:text-amber-400' : 'text-stone-900 dark:text-white'}`}>
                          {ex.title}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isSel ? 'bg-amber-500 text-stone-950' : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                        }`}>
                          {ex.badge}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono font-semibold text-stone-500 dark:text-stone-400 mb-1">
                        {ex.marks}
                      </div>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
                        {ex.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Course Search */}
            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-2">
                Select Course (57 Verified University Courses):
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by course name or code (e.g., Data Structures, CSE2001, Calculus, MAT1001)..."
                  value={searchCourseQuery}
                  onChange={(e) => setSearchCourseQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Course Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-1">
              {filteredCourses.map((course) => {
                const isSelected = course.code === currentCourse.code;
                return (
                  <div
                    key={course.code}
                    onClick={() => setSelectedCourseCode(course.code)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500 dark:border-amber-400 text-stone-900 dark:text-white shadow-sm'
                        : 'bg-stone-50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-400 dark:hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[11px] font-bold text-amber-600 dark:text-amber-400">
                        {course.code}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                      )}
                    </div>
                    <div className="text-xs font-semibold leading-snug line-clamp-2">
                      {course.title}
                    </div>
                    <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-1">
                      {course.school}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Action Bar */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-100 dark:border-stone-800">
              <div className="text-xs text-stone-500 dark:text-stone-400 text-center sm:text-left">
                Selected Course:{' '}
                <strong className="text-stone-900 dark:text-white">
                  {currentCourse.title} ({currentCourse.code})
                </strong>{' '}
                • Target:{' '}
                <strong className="text-amber-600 dark:text-amber-400 uppercase">
                  {selectedExamType === 'fat' ? 'FAT' : selectedExamType.toUpperCase()}
                </strong>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
                <button
                  onClick={() => handleGenerateDirectRoadmap(selectedExamType)}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate {selectedExamType.toUpperCase()} Roadmap Now</span>
                </button>

                <button
                  onClick={handleStartQuiz}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 font-semibold text-xs border border-stone-200 dark:border-stone-700 transition-all flex items-center justify-center gap-2"
                >
                  <HelpCircle className="w-4 h-4 text-amber-500" />
                  <span>Personalize via Diagnostic Quiz</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: DIAGNOSTIC PYQ QUIZ */}
      {step === 'quiz' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl space-y-6">
          {/* Quiz Header */}
          <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
            <div>
              <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                {currentCourse.code} • {currentCourse.title}
              </span>
              <h2 className="text-lg font-extrabold text-stone-900 dark:text-white mt-0.5">
                Pre-Roadmap Diagnostic Drill (Question {currentQIdx + 1} of{' '}
                {quizQuestions.length})
              </h2>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-[11px] font-semibold text-stone-600 dark:text-stone-300">
              {quizQuestions[currentQIdx].examSource}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-amber-500 h-1.5 transition-all duration-300"
              style={{
                width: `${((currentQIdx + 1) / quizQuestions.length) * 100}%`,
              }}
            />
          </div>

          {/* Topic Badge & Question */}
          <div className="space-y-3">
            <div className="inline-block px-2.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-[11px] font-bold text-stone-600 dark:text-stone-300">
              Tested Topic: {quizQuestions[currentQIdx].topic}
            </div>
            <p className="text-sm sm:text-base font-medium text-stone-900 dark:text-stone-100 leading-relaxed">
              {quizQuestions[currentQIdx].question}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {quizQuestions[currentQIdx].options.map((opt, optIdx) => {
              const isSelected = selectedOption === optIdx;
              const isCorrectOpt = optIdx === quizQuestions[currentQIdx].correct;

              let style =
                'bg-stone-50 dark:bg-stone-800/50 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:border-amber-500/50';

              if (showExplanation) {
                if (isCorrectOpt) {
                  style =
                    'bg-emerald-500/15 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-semibold';
                } else if (isSelected && !isCorrectOpt) {
                  style =
                    'bg-rose-500/15 border-rose-500 text-rose-800 dark:text-rose-200';
                }
              } else if (isSelected) {
                style = 'bg-amber-500/15 border-amber-500 text-amber-900 dark:text-amber-200';
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => !showExplanation && handleSelectOption(optIdx)}
                  disabled={showExplanation}
                  className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-start gap-3 ${style}`}
                >
                  <span
                    className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-amber-500 text-stone-950'
                        : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="flex-1">{opt}</span>
                  {showExplanation && isCorrectOpt && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box on Selection */}
          {showExplanation && (
            <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300 space-y-1">
              <strong className="block text-amber-600 dark:text-amber-400">
                Exam Insight & Derivation:
              </strong>
              <p>{quizQuestions[currentQIdx].explanation}</p>
            </div>
          )}

          {/* Next / Submit Button */}
          <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-800">
            <span className="text-xs text-stone-400">
              {showExplanation ? 'Answer recorded' : 'Select an option to proceed'}
            </span>

            <button
              onClick={handleNextQuestion}
              disabled={selectedOption === null}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-40 active:scale-95"
            >
              <span>
                {currentQIdx === quizQuestions.length - 1
                  ? 'Calculate Lagging Topics & Build Roadmap'
                  : 'Next Question'}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: QUIZ RESULT & LAGGING TOPICS SUMMARY */}
      {step === 'quiz_result' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white">
              Diagnostic Complete! Accuracy: {quizScore}%
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-md mx-auto">
              We identified your lagging topics and prioritized them directly into Days 1 to 4 of your custom 7-day preparation roadmap.
            </p>
          </div>

          {/* Topic Classification Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
            {/* Lagging Topics (Targeted First) */}
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-2">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wide">
                <AlertTriangle className="w-4 h-4" />
                <span>Lagging Topics (Roadmap Days 1–4)</span>
              </div>
              <p className="text-[11px] text-stone-600 dark:text-stone-400">
                These topics require immediate reinforcement to prevent losing marks in {selectedExamType.toUpperCase()}:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {laggingTopics.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-700 dark:text-rose-300 font-semibold text-xs"
                  >
                    • {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Common Topics (Covered on Days 5-7) */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wide">
                <CheckCircle2 className="w-4 h-4" />
                <span>Common High-Yield Topics (Days 5–7)</span>
              </div>
              <p className="text-[11px] text-stone-600 dark:text-stone-400">
                Recurring university exam pillars ensuring complete syllabus coverage and formula mastery:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {quizQuestions
                  .map((q) => q.topic)
                  .filter((t) => !laggingTopics.includes(t))
                  .slice(0, 3)
                  .map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold text-xs"
                    >
                      ✓ {t}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => setStep('roadmap')}
            className="px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-md transition-all inline-flex items-center gap-2 active:scale-95"
          >
            <span>Open Custom 7-Day Roadmap</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 4: INTERACTIVE 7-DAY ROADMAP VIEW */}
      {step === 'roadmap' && roadmapDays.length > 0 && (
        <div className="space-y-6">
          {/* Top Control Banner */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                    {currentCourse.code} • {currentCourse.title}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold text-[10px] uppercase">
                    {selectedExamType === 'cat1' ? 'CAT-1 (Modules 1 & 2)' : selectedExamType === 'cat2' ? 'CAT-2 (Modules 3 & 4)' : 'FAT (All Modules 1–5)'}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-white">
                  7-Day {selectedExamType.toUpperCase()} Preparation Roadmap
                </h2>
                <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                  <span>Target Exam: <strong>{selectedExamType === 'fat' ? 'FAT (100 Marks)' : `${selectedExamType.toUpperCase()} (50 Marks)`}</strong></span>
                  <span>•</span>
                  <span>Diagnostic Accuracy: <strong>{quizScore}%</strong></span>
                  {laggingTopics.length > 0 && (
                    <>
                      <span>•</span>
                      <span>Priority Weaknesses: <strong className="text-rose-600 dark:text-rose-400">{laggingTopics.slice(0, 3).join(', ')}</strong></span>
                    </>
                  )}
                </div>
              </div>

              {/* Exam Switcher & Actions */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Instant Exam Switcher */}
                <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold">
                  {[
                    { id: 'cat1' as const, label: 'CAT-1', sub: 'M1-2' },
                    { id: 'cat2' as const, label: 'CAT-2', sub: 'M3-4' },
                    { id: 'fat' as const, label: 'FAT', sub: 'All' },
                  ].map((tab) => {
                    const isCurrent = selectedExamType === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => handleGenerateDirectRoadmap(tab.id)}
                        className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                          isCurrent
                            ? 'bg-amber-500 text-stone-950 shadow-sm'
                            : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                        }`}
                      >
                        <span>{tab.label}</span>
                        <span className={`text-[9px] px-1 py-0.2 rounded ${
                          isCurrent ? 'bg-stone-950/20 text-stone-950' : 'bg-stone-200 dark:bg-stone-700 text-stone-500'
                        }`}>
                          {tab.sub}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={handleExportPdf}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 active:scale-95 shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export PDF</span>
                </button>

                <button
                  onClick={handleStartQuiz}
                  className="px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300 font-medium text-xs border border-stone-200 dark:border-stone-700 transition-colors flex items-center gap-1.5 shrink-0"
                  title="Retake diagnostic drill to calibrate topic weaknesses"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-amber-500" />
                  <span>Drill Quiz</span>
                </button>
              </div>
            </div>

            {/* Daily Hours & Progress Bar */}
            <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">Daily Hours:</span>
                {[1, 2, 3, 4].map((hrs) => (
                  <button
                    key={hrs}
                    onClick={() => {
                      setDailyHours(hrs);
                      const updated = generateLaggingAware7DayRoadmap({
                        courseCode: currentCourse.code,
                        courseTitle: currentCourse.title,
                        examType: selectedExamType,
                        dailyHours: hrs,
                        laggingTopics,
                        masteredTopics,
                        allCommonTopics: quizQuestions.map((q) => q.topic),
                        overallAccuracy: quizScore,
                      });
                      setRoadmapDays(updated);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      dailyHours === hrs
                        ? 'bg-amber-500 text-stone-950'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    {hrs}h
                  </button>
                ))}
              </div>

              {/* Overall Progress */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-stone-500 dark:text-stone-400">
                  Progress: <strong>{completedCount} of {totalTasks}</strong> tasks ({progressPct}%)
                </span>
                <div className="w-24 bg-stone-200 dark:bg-stone-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-amber-500 h-2 transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 7 Days Selector Buttons - Horizontally Scrollable on Mobile, Grid on Desktop */}
          <div className="flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-7 scrollbar-none">
            {roadmapDays.map((day) => {
              const isSelected = day.dayNumber === selectedDayNumber;
              const isLaggingDay = day.dayNumber <= 4;
              const dayCompletedTasks = day.tasks.filter((t) =>
                completedTaskIds.has(t.id)
              ).length;
              const allDayCompleted = dayCompletedTasks === day.tasks.length;

              return (
                <button
                  key={day.dayNumber}
                  onClick={() => setSelectedDayNumber(day.dayNumber)}
                  className={`min-w-[66px] sm:min-w-0 p-2.5 rounded-2xl border text-center transition-all shrink-0 sm:shrink ${
                    isSelected
                      ? 'bg-amber-500 text-stone-950 font-extrabold border-amber-500 shadow-md ring-2 ring-amber-500/30'
                      : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-400'
                  }`}
                >
                  <div className="text-[10px] uppercase font-bold opacity-80">
                    Day {day.dayNumber}
                  </div>
                  <div className="text-xs font-mono font-bold mt-0.5">
                    {dayCompletedTasks}/{day.tasks.length}
                  </div>
                  <div className="mt-1">
                    {allDayCompleted ? (
                      <Check className="w-3 h-3 mx-auto text-emerald-600 dark:text-emerald-400" />
                    ) : isLaggingDay ? (
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500" title="Lagging Topic Day" />
                    ) : (
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500" title="Core Topic Day" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Day Detail Card */}
          {activeDay && (
            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100 dark:border-stone-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-700 dark:text-amber-300">
                      Day {activeDay.dayNumber} • {activeDay.dateStr}
                    </span>
                    {activeDay.dayNumber <= 4 && (
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-700 dark:text-rose-300">
                        Lagging Topic Priority
                      </span>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-stone-900 dark:text-white mt-1">
                    {activeDay.theme}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    {activeDay.reason}
                  </p>
                </div>

                <div className="text-xs font-mono font-semibold text-stone-600 dark:text-stone-300 shrink-0">
                  {activeDay.totalMinutes} Minutes Allocated
                </div>
              </div>

              {/* Tasks List */}
              <div className="space-y-3">
                {activeDay.tasks.map((task) => {
                  const isDone = completedTaskIds.has(task.id);
                  return (
                    <div
                      key={task.id}
                      onClick={() => handleToggleTask(task.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                        isDone
                          ? 'bg-stone-50 dark:bg-stone-850/40 border-stone-200 dark:border-stone-800 opacity-60'
                          : 'bg-stone-50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-750 hover:border-amber-500/50'
                      }`}
                    >
                      <button
                        type="button"
                        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          isDone
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-stone-400 dark:border-stone-600 bg-white dark:bg-stone-900'
                        }`}
                      >
                        {isDone && <Check className="w-3.5 h-3.5" />}
                      </button>

                      <div className="flex-1 space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4
                            className={`text-xs sm:text-sm font-bold ${
                              isDone
                                ? 'line-through text-stone-400 dark:text-stone-500'
                                : 'text-stone-900 dark:text-white'
                            }`}
                          >
                            {task.title}
                          </h4>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                            {task.durationMinutes} mins • {task.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400">
                          {task.reason}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
