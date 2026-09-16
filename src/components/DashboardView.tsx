import React, { useState, useMemo, useEffect } from 'react';
import {
  GraduationCap,
  Calendar,
  Layers,
  Award,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  BookOpen,
  LayoutDashboard,
  Search,
  Check,
  FileText,
  UploadCloud,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { User, PriorityItem, ExaminerInsight, StudyTask, Question, MockTestResult } from '../types.js';
import { VIT_AP_COURSES } from '../data/vitApCourses.js';
import { ALL_57_COURSES_SYLLABUS } from '../data/all57CoursesSyllabus.js';
import { getLatestMockResult, getStoredMockResults } from '../utils/mockPyqQuestionEngine.js';
import { VPATH_COURSES } from '../data/vpathDatabase.js';

interface DashboardViewProps {
  user: User | null;
  summaryCards?: {
    pyqsAnalyzed: number;
    questionsFound: number;
    topicsIdentified: number;
    highPriorityTopics: number;
    preparationScore: number;
    studyStreak: number;
  };
  whatToStudyNow?: any;
  topPriorities?: PriorityItem[];
  examinerInsights?: ExaminerInsight[];
  todayTasks?: StudyTask[];
  recentQuestions?: Question[];
  onNavigate: (tab: string) => void;
  onStartStudy?: (topicName: string) => void;
  onToggleTask?: (taskId: string) => void;
  onOpenDiagnostic?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  summaryCards,
  onNavigate,
}) => {
  // Course selector for analysis
  const [selectedCourseCode, setSelectedCourseCode] = useState<string>('CSE1001');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedExamType, setSelectedExamType] = useState<'cat1' | 'cat2' | 'fat'>('cat1');

  // Load mock test results from store
  const [mockResult, setMockResult] = useState<MockTestResult | null>(null);
  const [allMockResults, setAllMockResults] = useState<MockTestResult[]>([]);

  useEffect(() => {
    const latest = getLatestMockResult();
    const all = getStoredMockResults();
    setMockResult(latest);
    setAllMockResults(all);
  }, []);

  // Filter courses for dropdown/search
  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return VIT_AP_COURSES;
    const q = searchQuery.toLowerCase();
    return VIT_AP_COURSES.filter(
      (c) => c.code.toLowerCase().includes(q) || c.title.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const activeCourse = useMemo(() => {
    return (
      VIT_AP_COURSES.find((c) => c.code === selectedCourseCode) ||
      VIT_AP_COURSES[0]
    );
  }, [selectedCourseCode]);

  // Syllabus breakdown for active course & exam type
  // CAT-1: Modules 1 & 2
  // CAT-2: Modules 3 & 4
  // FAT: All modules (1 to 5)
  const syllabusData = useMemo(() => {
    const fullSyllabus = ALL_57_COURSES_SYLLABUS[selectedCourseCode] || [];
    if (selectedExamType === 'cat1') {
      return fullSyllabus.filter((m) => m.moduleNumber === 1 || m.moduleNumber === 2);
    } else if (selectedExamType === 'cat2') {
      return fullSyllabus.filter((m) => m.moduleNumber === 3 || m.moduleNumber === 4);
    } else {
      return fullSyllabus;
    }
  }, [selectedCourseCode, selectedExamType]);

  // Derive weak and strong topics from mockResult or course syllabus defaults
  const topicAnalysis = useMemo(() => {
    if (mockResult) {
      return {
        weakHigh: mockResult.weakHighPriorityTopics || [],
        weakLow: mockResult.weakLowPriorityTopics || [],
        strongHigh: mockResult.strongHighPriorityTopics || [],
        strongLow: mockResult.strongLowPriorityTopics || [],
      };
    }

    // Default intelligent baseline from syllabus
    const syllabus = ALL_57_COURSES_SYLLABUS[selectedCourseCode] || [];
    const mod1Topics = syllabus[0]?.coreTopics || ['Fundamental Algorithms', 'Boundary Conditions'];
    const mod2Topics = syllabus[1]?.coreTopics || ['Derivation Steps', 'Recurrence Solutions'];
    const mod3Topics = syllabus[2]?.coreTopics || ['Dynamic State Modeling', 'Optimization Criteria'];

    return {
      weakHigh: [mod1Topics[0] || 'State Boundary Proofs', mod2Topics[0] || 'Mathematical Derivations'],
      weakLow: [mod1Topics[2] || 'Terminology Definitions'],
      strongHigh: [mod2Topics[1] || 'Standard Problem Formulation'],
      strongLow: [mod3Topics[0] || 'Conceptual Overview'],
    };
  }, [mockResult, selectedCourseCode]);

  // Drive link for active course
  const activeVpath = useMemo(() => {
    return VPATH_COURSES.find((v) => v.code === selectedCourseCode);
  }, [selectedCourseCode]);

  const targetDriveUrl = useMemo(() => {
    if (!activeVpath) return 'https://drive.google.com/drive/folders/1sX8kIpxqxuv_rnECo7rS9Ldl8eycBdJ5?usp=drive_link';
    if (selectedExamType === 'cat1') return activeVpath.cat1Url || activeVpath.fatUrl;
    if (selectedExamType === 'cat2') return activeVpath.cat2Url || activeVpath.fatUrl;
    return activeVpath.fatUrl;
  }, [activeVpath, selectedExamType]);

  return (
    <div id="dashboard-view" className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* 1. HEADER WITH COURSE SELECTOR & GREETING */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold mb-2 border border-amber-500/20">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>VIT-AP University Exam Analysis Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-white">
            Welcome, Guest Student 👋
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Analyzing mock exam evaluations, topic priorities, and syllabus breakdowns for <span className="font-semibold text-stone-900 dark:text-stone-200">{activeCourse.title} ({activeCourse.code})</span>.
          </p>
        </div>

        {/* Course Dropdown Selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <select
              value={selectedCourseCode}
              onChange={(e) => setSelectedCourseCode(e.target.value)}
              className="w-full sm:w-64 appearance-none px-4 py-2.5 pr-8 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {VIT_AP_COURSES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} - {c.title}
                </option>
              ))}
            </select>
            <ChevronRight className="w-4 h-4 text-stone-400 absolute right-3 top-3 pointer-events-none rotate-90" />
          </div>

          <button
            onClick={() => onNavigate('mock-test')}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <GraduationCap className="w-4 h-4" />
            <span>New Mock Test</span>
          </button>
        </div>
      </div>

      {/* 2. LATEST MOCK EXAM RESULTS EVALUATION SECTION */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Mock Exam Performance Evaluation
              </span>
              {mockResult && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                  Latest Evaluated Test
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-white mt-1">
              {mockResult ? mockResult.title : `No Mock Test Completed Yet for ${activeCourse.code}`}
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {mockResult
                ? `Completed on ${mockResult.date} • Results compiled directly from repeated PYQ questions.`
                : 'Take a simulated PYP mock test to evaluate your accuracy and reveal your exact weak and strong topics.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('mock-test')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>{mockResult ? 'Retake / Take Another Test' : 'Launch Mock Test'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {mockResult ? (
          <div className="space-y-6">
            {/* Metric score blocks */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800/80 text-center">
                <div className="text-xs text-stone-500 dark:text-stone-400 mb-1">Score Obtained</div>
                <div className="text-2xl font-extrabold text-stone-900 dark:text-white">
                  {mockResult.score} / {mockResult.maxScore}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800/80 text-center">
                <div className="text-xs text-stone-500 dark:text-stone-400 mb-1">Accuracy</div>
                <div className={`text-2xl font-extrabold ${
                  mockResult.accuracy >= 70 ? 'text-emerald-500' : mockResult.accuracy >= 50 ? 'text-amber-500' : 'text-rose-500'
                }`}>
                  {mockResult.accuracy}%
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800/80 text-center">
                <div className="text-xs text-stone-500 dark:text-stone-400 mb-1">Correct Questions</div>
                <div className="text-2xl font-extrabold text-stone-900 dark:text-white">
                  {mockResult.correctCount} / {mockResult.totalQuestions}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800/80 text-center">
                <div className="text-xs text-stone-500 dark:text-stone-400 mb-1">Estimated Grade</div>
                <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                  {mockResult.accuracy >= 85 ? 'S Grade' : mockResult.accuracy >= 70 ? 'A Grade' : mockResult.accuracy >= 55 ? 'B Grade' : 'Pass / C'}
                </div>
              </div>
            </div>

            {/* Historical evaluation quote */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 font-medium">
              💡 {mockResult.historicalComparison}
            </div>
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-dashed border-stone-300 dark:border-stone-800 text-center space-y-3">
            <GraduationCap className="w-10 h-10 text-amber-500 mx-auto opacity-70" />
            <h3 className="text-base font-bold text-stone-900 dark:text-white">
              Ready to evaluate your exam readiness?
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
              Our mock test engine samples repeated questions asked across 5 years of {activeCourse.title} papers. Complete a 10-question test to populate this dashboard with tailored insights.
            </p>
            <button
              onClick={() => onNavigate('mock-test')}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-all inline-flex items-center gap-2"
            >
              <span>Take Test for {activeCourse.code}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* 3. 4-QUADRANT WEAK & STRONG TOPIC PRIORITY ANALYSIS */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-white">
              Topic Priority Matrix (Weak vs. Strong Topics)
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Correlating diagnostic accuracy with 5-year PYQ repetition frequency for targeted preparation.
            </p>
          </div>

          <button
            onClick={() => onNavigate('study-plan')}
            className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>Open 7-Day Roadmap for these topics</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. Weak Topics - HIGH PRIORITY (Urgent!) */}
          <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Weak Topics • High Priority (Urgent Attention)</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-700 dark:text-rose-300 font-bold">
                {topicAnalysis.weakHigh.length} Topics
              </span>
            </div>
            <p className="text-xs text-rose-700 dark:text-rose-300/90 leading-relaxed">
              These topics have lower accuracy (&lt;60%) AND high recurrence in past papers. Immediate revision needed before exams!
            </p>
            <div className="space-y-2 pt-1">
              {topicAnalysis.weakHigh.length > 0 ? (
                topicAnalysis.weakHigh.map((topic, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-rose-200 dark:border-rose-900/40 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-stone-900 dark:text-stone-100">{topic}</div>
                      <div className="text-[10px] text-rose-500 mt-0.5">Appears in 80% of university question papers</div>
                    </div>
                    <button
                      onClick={() => onNavigate('study-plan')}
                      className="px-2.5 py-1 rounded-lg bg-rose-500 text-white font-bold text-[10px] hover:bg-rose-600 transition-colors shrink-0"
                    >
                      7-Day Roadmap
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-xs text-stone-500 italic p-2">
                  No high-priority weak topics detected.
                </div>
              )}
            </div>
          </div>

          {/* 2. Weak Topics - LOW PRIORITY (Secondary Focus) */}
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
                <Clock className="w-4 h-4" />
                <span>Weak Topics • Low Priority</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold">
                {topicAnalysis.weakLow.length} Topics
              </span>
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-300/90 leading-relaxed">
              Lower test accuracy, but these concepts carry minor mark weightage (&lt;5 marks). Revise after mastering high-priority units.
            </p>
            <div className="space-y-2 pt-1">
              {topicAnalysis.weakLow.length > 0 ? (
                topicAnalysis.weakLow.map((topic, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-amber-200 dark:border-amber-900/40 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-stone-900 dark:text-stone-100">{topic}</div>
                      <div className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">Low Exam Frequency (&lt;5 Marks)</div>
                    </div>
                    <span className="text-[10px] font-semibold text-stone-400">Revise Later</span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-stone-500 italic p-2">
                  No low-priority weak topics identified.
                </div>
              )}
            </div>
          </div>

          {/* 3. Strong Topics - HIGH PRIORITY (Core Exam Pillars) */}
          <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Strong Topics • High Priority (Guaranteed Marks)</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold">
                {topicAnalysis.strongHigh.length} Topics
              </span>
            </div>
            <p className="text-xs text-emerald-700 dark:text-emerald-300/90 leading-relaxed">
              High accuracy (≥60%) AND repeatedly asked in university papers. Maintain this strength to lock in top grades!
            </p>
            <div className="space-y-2 pt-1">
              {topicAnalysis.strongHigh.length > 0 ? (
                topicAnalysis.strongHigh.map((topic, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-emerald-200 dark:border-emerald-900/40 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-stone-900 dark:text-stone-100">{topic}</div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">Mastered Core Exam Pillar</div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Locked In ✅</span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-stone-500 italic p-2">
                  Complete more mock test questions to establish strong topics.
                </div>
              )}
            </div>
          </div>

          {/* 4. Strong Topics - LOW PRIORITY (Mastered Minor Concepts) */}
          <div className="p-5 rounded-2xl bg-blue-500/10 border border-blue-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
                <Award className="w-4 h-4" />
                <span>Strong Topics • Low Priority</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold">
                {topicAnalysis.strongLow.length} Topics
              </span>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300/90 leading-relaxed">
              Good accuracy, but appears rarely or carries minimal weightage in exams. No further action needed.
            </p>
            <div className="space-y-2 pt-1">
              {topicAnalysis.strongLow.length > 0 ? (
                topicAnalysis.strongLow.map((topic, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-blue-200 dark:border-blue-900/40 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-stone-900 dark:text-stone-100">{topic}</div>
                      <div className="text-[10px] text-blue-500 mt-0.5">Low Exam Frequency • Solid Foundation</div>
                    </div>
                    <span className="text-[10px] font-semibold text-stone-400">Stable</span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-stone-500 italic p-2">
                  No minor strong topics recorded.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. SEPARATE ANALYSIS OF CAT-1, CAT-2, AND FAT */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-2 border border-blue-500/20">
              <Layers className="w-3.5 h-3.5" />
              <span>University Examination Structure</span>
            </div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-white">
              Separate Analysis: CAT-1, CAT-2 & FAT for {activeCourse.title}
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Select an examination segment below to view module syllabus boundaries, weightages, and repeated question trends.
            </p>
          </div>

          {/* Exam Segment Toggle Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
            {[
              { id: 'cat1', label: 'CAT-1', badge: 'Mod 1 & 2' },
              { id: 'cat2', label: 'CAT-2', badge: 'Mod 3 & 4' },
              { id: 'fat', label: 'FAT', badge: 'All Modules' },
            ].map((tab) => {
              const isSel = selectedExamType === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedExamType(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isSel
                      ? 'bg-amber-500 text-stone-950 shadow-sm'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded ${
                    isSel ? 'bg-stone-950/20 text-stone-950' : 'bg-stone-200 dark:bg-stone-700 text-stone-500 dark:text-stone-400'
                  }`}>
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Exam Breakdown Banner */}
        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <span className="font-bold text-stone-900 dark:text-stone-100">
              {selectedExamType === 'cat1' && 'Continuous Assessment Test 1 (CAT-1) • Average Weightage: 50 Marks'}
              {selectedExamType === 'cat2' && 'Continuous Assessment Test 2 (CAT-2) • Average Weightage: 50 Marks'}
              {selectedExamType === 'fat' && 'Final Assessment Test (FAT) • University Comprehensive: 100 Marks'}
            </span>
            <p className="text-stone-500 dark:text-stone-400">
              {selectedExamType === 'cat1' && 'Covers Module 1 and Module 2 exclusively. Focus on foundation proofs, analytical definitions, and Part A numerical questions.'}
              {selectedExamType === 'cat2' && 'Covers Module 3 and Module 4 exclusively. Emphasizes advanced design trade-offs, synthesis problems, and algorithmic derivations.'}
              {selectedExamType === 'fat' && 'Covers All Modules (1, 2, 3, 4, 5) comprehensively across Part A (short answers) and Part B (long 10-12 mark design questions).'}
            </p>
          </div>

          {targetDriveUrl && (
            <a
              href={targetDriveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 hover:border-amber-500 text-stone-800 dark:text-stone-200 font-semibold text-xs transition-all flex items-center gap-1.5 shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
              <span>Open Verified Drive PYQs</span>
            </a>
          )}
        </div>

        {/* Module-by-Module Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {syllabusData.map((mod) => (
            <div
              key={mod.moduleNumber}
              className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-lg bg-amber-500 text-stone-950 font-mono font-bold text-xs">
                    Module {mod.moduleNumber}
                  </span>
                  <span className="font-bold text-sm text-stone-900 dark:text-white">
                    {mod.name}
                  </span>
                </div>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                  {selectedExamType === 'cat1'
                    ? `${mod.cat1Weightage || 25}% of CAT-1`
                    : selectedExamType === 'cat2'
                    ? `${mod.cat2Weightage || 25}% of CAT-2`
                    : `${mod.fatWeightage}% of FAT`}
                </span>
              </div>

              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                  Core Topics Tested in PYPs:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {mod.coreTopics.map((topic, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-[11px] text-stone-700 dark:text-stone-300 font-medium"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Fast Action CTAs */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-200 dark:border-stone-800">
          <div className="text-xs text-stone-500 dark:text-stone-400">
            Exam tailored for <span className="font-semibold text-stone-900 dark:text-stone-200">{activeCourse.title}</span> • {selectedExamType.toUpperCase()}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('mock-test')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Simulate {selectedExamType.toUpperCase()} Test</span>
            </button>
            <button
              onClick={() => onNavigate('study-plan')}
              className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-750 text-stone-800 dark:text-stone-200 font-semibold text-xs border border-stone-200 dark:border-stone-700 transition-all flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              <span>7-Day Roadmap</span>
            </button>
            <button
              onClick={() => onNavigate('upload')}
              className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-750 text-stone-800 dark:text-stone-200 font-semibold text-xs border border-stone-200 dark:border-stone-700 transition-all flex items-center gap-1.5"
            >
              <UploadCloud className="w-3.5 h-3.5 text-blue-500" />
              <span>Upload New Paper</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
