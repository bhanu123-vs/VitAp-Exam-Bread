import React, { useState, useMemo } from 'react';
import {
  FileText,
  Download,
  UploadCloud,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Award,
  BookOpen,
  ArrowRight,
  Plus,
  X,
  FileCheck,
  ExternalLink,
  GraduationCap,
  Layers,
  Copy,
  Check,
} from 'lucide-react';
import { AvailablePyqPaper, ExamType } from '../types.js';
import {
  COURSES_LIST,
  EXAM_TYPES,
  INITIAL_AVAILABLE_PYPS,
  getOrCreatePaperForCourse,
} from '../data/availablePyps.js';
import {
  VIT_AP_COURSES,
  VIT_AP_DEGREE_INFO,
  VitApCourse,
} from '../data/vitApCourses.js';
import { downloadPypPdf } from '../utils/pdfGenerator.js';
import { VitApLogo } from './VitApLogo.js';
import { AiPaperAnalysisModal } from './AiPaperAnalysisModal.js';
import { VPathCourseList } from './VPathCourseList.js';

interface AvailablePypsLibraryProps {
  onAnalyzePaper?: (paper: AvailablePyqPaper) => void;
  onNavigateToUpload?: () => void;
}

export const AvailablePypsLibrary: React.FC<AvailablePypsLibraryProps> = ({
  onAnalyzePaper,
  onNavigateToUpload,
}) => {
  const [papers, setPapers] = useState<AvailablePyqPaper[]>(INITIAL_AVAILABLE_PYPS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCourseCode, setSelectedCourseCode] = useState<string>('all');
  const [selectedExamType, setSelectedExamType] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedPaperId, setExpandedPaperId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [analyzingPaper, setAnalyzingPaper] = useState<AvailablePyqPaper | null>(null);
  const [viewMode, setViewMode] = useState<'vpath_courses' | 'papers'>('vpath_courses');

  // Upload modal state
  const [isAttachModalOpen, setIsAttachModalOpen] = useState<boolean>(false);
  const [attachCourseCode, setAttachCourseCode] = useState<string>('CSE2008');
  const [attachExamType, setAttachExamType] = useState<ExamType>('fat');
  const [attachYear, setAttachYear] = useState<number>(2025);
  const [attachFileName, setAttachFileName] = useState<string>('');
  const [attachSuccessMsg, setAttachSuccessMsg] = useState<string | null>(null);

  // Filter available courses according to selected category
  const filteredCourseOptions = useMemo(() => {
    if (selectedCategory === 'all') return VIT_AP_COURSES;
    return VIT_AP_COURSES.filter((c) => {
      if (selectedCategory === 'SAS' || selectedCategory === 'SCOPE' || selectedCategory === 'SENSE' || selectedCategory === 'VSB') {
        return c.school === selectedCategory;
      }
      return c.category === selectedCategory;
    });
  }, [selectedCategory]);

  // Selected course object
  const activeCourseObj = useMemo(() => {
    if (selectedCourseCode === 'all') return null;
    return VIT_AP_COURSES.find(
      (c) => c.code.toLowerCase() === selectedCourseCode.toLowerCase()
    ) || null;
  }, [selectedCourseCode]);

  // Combined papers: initial list + on-demand papers for activeCourseObj if not already present
  const allAvailablePapers = useMemo(() => {
    if (!activeCourseObj) return papers;

    // Ensure FAT 2025, CAT-1 2025, and CAT-2 2025 exist for the selected course
    const list = [...papers];
    const hasFat = list.some(
      (p) =>
        p.courseCode.toUpperCase() === activeCourseObj.code.toUpperCase() &&
        (p.examType === 'fat' || p.examType === 'end_term')
    );
    const hasCat1 = list.some(
      (p) =>
        p.courseCode.toUpperCase() === activeCourseObj.code.toUpperCase() &&
        (p.examType === 'cat1' || p.examType === 'mid_term')
    );
    const hasCat2 = list.some(
      (p) =>
        p.courseCode.toUpperCase() === activeCourseObj.code.toUpperCase() &&
        p.examType === 'cat2'
    );

    if (!hasFat) {
      list.push(getOrCreatePaperForCourse(activeCourseObj, 'fat', 2025));
    }
    if (!hasCat1) {
      list.push(getOrCreatePaperForCourse(activeCourseObj, 'cat1', 2025));
    }
    if (!hasCat2) {
      list.push(getOrCreatePaperForCourse(activeCourseObj, 'cat2', 2025));
    }
    return list;
  }, [papers, activeCourseObj]);

  // Filter papers based on user controls
  const filteredPapers = useMemo(() => {
    return allAvailablePapers.filter((paper) => {
      // Category / School filter
      if (selectedCategory !== 'all') {
        const found = VIT_AP_COURSES.find(
          (c) => c.code.toUpperCase() === paper.courseCode.toUpperCase()
        );
        if (found) {
          if (
            selectedCategory === 'SAS' ||
            selectedCategory === 'SCOPE' ||
            selectedCategory === 'SENSE' ||
            selectedCategory === 'VSB'
          ) {
            if (found.school !== selectedCategory) return false;
          } else if (found.category !== selectedCategory) {
            return false;
          }
        }
      }

      // Course filter
      if (selectedCourseCode !== 'all') {
        if (paper.courseCode.toLowerCase() !== selectedCourseCode.toLowerCase()) {
          return false;
        }
      }

      // Exam type filter (supporting cat1, cat2, fat and legacy aliases)
      if (selectedExamType !== 'all') {
        if (selectedExamType === 'cat1') {
          if (paper.examType !== 'cat1' && paper.examType !== 'mid_term') return false;
        } else if (selectedExamType === 'cat2') {
          if (paper.examType !== 'cat2') return false;
        } else if (selectedExamType === 'fat') {
          if (paper.examType !== 'fat' && paper.examType !== 'end_term') return false;
        } else if (paper.examType !== selectedExamType) {
          return false;
        }
      }

      // Year filter
      if (selectedYear !== 'all' && paper.year.toString() !== selectedYear) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inCourse = paper.courseName.toLowerCase().includes(q);
        const inCode = paper.courseCode.toLowerCase().includes(q);
        const inTopics = paper.topicsCovered.some((t) => t.toLowerCase().includes(q));
        const inQuestions = paper.sampleQuestions.some((sq) =>
          sq.text.toLowerCase().includes(q)
        );
        if (!inCourse && !inCode && !inTopics && !inQuestions) {
          return false;
        }
      }

      return true;
    });
  }, [
    allAvailablePapers,
    selectedCategory,
    selectedCourseCode,
    selectedExamType,
    selectedYear,
    searchQuery,
  ]);

  const handleDownload = (paper: AvailablePyqPaper) => {
    // If the paper has an authentic Google Drive URL from vpath.netlify.app, open it directly!
    if (paper.driveUrl) {
      window.open(paper.driveUrl, '_blank');
      return;
    }
    setDownloadingId(paper.id);
    try {
      downloadPypPdf(paper);
    } catch (e) {
      console.error('Error generating PDF:', e);
    } finally {
      setTimeout(() => {
        setDownloadingId(null);
      }, 700);
    }
  };

  const handleGeneratePrintablePdf = (paper: AvailablePyqPaper) => {
    setDownloadingId(paper.id);
    try {
      downloadPypPdf(paper);
    } catch (e) {
      console.error('Error generating PDF:', e);
    } finally {
      setTimeout(() => {
        setDownloadingId(null);
      }, 700);
    }
  };

  const handleDownloadAllCoursePdfs = () => {
    if (filteredPapers.length === 0) return;
    filteredPapers.forEach((paper, index) => {
      setTimeout(() => {
        downloadPypPdf(paper);
      }, index * 400);
    });
  };

  const handleAttachSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const course = VIT_AP_COURSES.find((c) => c.code === attachCourseCode);
    const courseTitle = course ? course.title : 'Selected Course';

    const newPaper: AvailablePyqPaper = {
      id: `pyp-custom-${Date.now()}`,
      courseName: courseTitle,
      courseCode: attachCourseCode,
      examType: attachExamType,
      year: attachYear,
      semester:
        attachExamType === 'mid_term'
          ? 'Continuous Assessment Test (CAT)'
          : 'Final Assessment Test (FAT)',
      totalQuestions: 18,
      totalMarks: attachExamType === 'mid_term' ? 50 : 100,
      timeDuration: attachExamType === 'mid_term' ? '1.5 Hours' : '3 Hours',
      fileSize: '1.9 MB',
      fileName:
        attachFileName ||
        `VIT_AP_${attachCourseCode}_${attachExamType === 'mid_term' ? 'CAT' : 'FAT'}_${attachYear}.pdf`,
      university: 'VIT-AP University (Student Uploaded Paper)',
      topicsCovered: [`${courseTitle} Exam Paper`, 'Student Verified'],
      isAvailableForDownload: true,
      sampleQuestions: [
        {
          number: '1.(a)',
          section: 'Part A',
          text: `Sample extracted examination question from ${attachCourseCode} paper.`,
          marks: 8,
        },
        {
          number: '2.(a)',
          section: 'Part A',
          text: `Analytical and conceptual university question.`,
          marks: 10,
        },
        {
          number: '3.(a)',
          section: 'Part B',
          text: `Design problem and algorithmic implementation.`,
          marks: 12,
        },
      ],
    };

    setPapers([newPaper, ...papers]);
    setAttachSuccessMsg(`"${newPaper.fileName}" attached successfully!`);
    setTimeout(() => {
      setAttachSuccessMsg(null);
      setIsAttachModalOpen(false);
      setAttachFileName('');
    }, 1200);
  };

  return (
    <div id="available-pyps-library" className="space-y-6">
      {/* Clean University Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-3.5">
          <VitApLogo size="md" showSubtitle={false} />
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-white">
              VIT-AP Exam Papers Repository
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
              Verified CAT-1, CAT-2, and FAT question papers with semester notes across all branches.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-banner-attach-pyp"
            onClick={() => setIsAttachModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Attach Question Paper</span>
          </button>
        </div>
      </div>

      {/* Main View Mode Selector */}
      <div className="flex items-center gap-2 p-1 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 max-w-md">
        <button
          onClick={() => setViewMode('vpath_courses')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            viewMode === 'vpath_courses'
              ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-sm'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-amber-500" />
          <span>57 Verified Courses</span>
        </button>

        <button
          onClick={() => setViewMode('papers')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            viewMode === 'papers'
              ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-sm'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-blue-500" />
          <span>Paper Files View</span>
        </button>
      </div>

      {viewMode === 'vpath_courses' ? (
        <VPathCourseList onOpenAiAnalysis={(paper) => setAnalyzingPaper(paper)} />
      ) : (
        <>
          {/* Academic Branches & Schools Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {VIT_AP_DEGREE_INFO.academicBranches.map((item) => {
              const isSelected = selectedCategory === item.badge;
              return (
                <button
                  key={item.badge}
                  onClick={() => {
                    setSelectedCategory(selectedCategory === item.badge ? 'all' : item.badge);
                    setSelectedCourseCode('all');
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500 dark:border-amber-500/80 shadow-sm'
                      : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-amber-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                      {item.badge}
                    </span>
                    <span className="text-xs font-bold font-mono text-amber-600 dark:text-amber-400">
                      Verified
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white mt-1 line-clamp-1">
                    {item.name}
                  </div>
                  <div className="text-[10.5px] text-stone-500 dark:text-stone-400 mt-0.5">
                    {item.badge === 'SAS'
                      ? 'Calculus, Physics, Chem, Stats'
                      : item.badge === 'SCOPE'
                      ? 'Python, Java, DSA, OS, DBMS, AI'
                      : item.badge === 'SENSE'
                      ? 'FEEE, DLD, Circuits, Signals'
                      : 'English, Ethics, Management'}
                  </div>
                </button>
              );
            })}
          </div>

      {/* Filter and Selection Controls */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
        {/* Branch / School Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="font-bold text-stone-600 dark:text-stone-400 uppercase text-[11px] shrink-0">
            School / Department:
          </span>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedCourseCode('all');
            }}
            className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            All Courses
          </button>
          <button
            onClick={() => {
              setSelectedCategory('SAS');
              setSelectedCourseCode('all');
            }}
            className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-colors ${
              selectedCategory === 'SAS'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            SAS (Sciences & Mathematics)
          </button>
          <button
            onClick={() => {
              setSelectedCategory('SCOPE');
              setSelectedCourseCode('all');
            }}
            className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-colors ${
              selectedCategory === 'SCOPE'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            SCOPE (Computing & Software)
          </button>
          <button
            onClick={() => {
              setSelectedCategory('SENSE');
              setSelectedCourseCode('all');
            }}
            className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-colors ${
              selectedCategory === 'SENSE'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            SENSE (Electronics & Circuits)
          </button>
          <button
            onClick={() => {
              setSelectedCategory('VSB');
              setSelectedCourseCode('all');
            }}
            className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-colors ${
              selectedCategory === 'VSB'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            VSB / SSH (Business & Humanities)
          </button>
        </div>

        {/* Dropdown Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. Select Course */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5">
              1. Select Course ({filteredCourseOptions.length} available)
            </label>
            <div className="relative">
              <select
                id="select-course-filter"
                value={selectedCourseCode}
                onChange={(e) => setSelectedCourseCode(e.target.value)}
                className="w-full pl-3 pr-8 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-stone-100 text-xs sm:text-sm font-medium focus:outline-none focus:border-amber-500 appearance-none transition-colors"
              >
                <option value="all">All Available Courses ({filteredCourseOptions.length})</option>
                {filteredCourseOptions.map((course) => (
                  <option key={course.code} value={course.code.toLowerCase()}>
                    {course.code} — {course.title} [{course.credits} Credits]
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 2. Select Exam Type (CAT-1, CAT-2, FAT) */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5">
              2. Exam Type (CAT-1, CAT-2, FAT)
            </label>
            <div className="relative">
              <select
                id="select-examtype-filter"
                value={selectedExamType}
                onChange={(e) => setSelectedExamType(e.target.value)}
                className="w-full pl-3 pr-8 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-stone-100 text-xs sm:text-sm font-medium focus:outline-none focus:border-amber-500 appearance-none transition-colors"
              >
                <option value="all">All Exams (CAT-1, CAT-2 & FAT)</option>
                <option value="cat1">CAT-1 (Continuous Assessment 1)</option>
                <option value="cat2">CAT-2 (Continuous Assessment 2)</option>
                <option value="fat">FAT (Final Assessment Test)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 3. Select Exam Year */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5">
              3. Exam Year
            </label>
            <div className="relative">
              <select
                id="select-year-filter"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full pl-3 pr-8 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-stone-100 text-xs sm:text-sm font-medium focus:outline-none focus:border-amber-500 appearance-none transition-colors"
              >
                <option value="all">All Years (2021 - 2025)</option>
                <option value="2025">2025 Academic Year</option>
                <option value="2024">2024 Academic Year</option>
                <option value="2023">2023 Academic Year</option>
                <option value="2022">2022 Academic Year</option>
                <option value="2021">2021 Academic Year</option>
              </select>
              <ChevronDown className="w-4 h-4 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 4. Search within Papers */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5">
              4. Search Papers & Questions
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics, keywords..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-stone-100 text-xs sm:text-sm placeholder:text-stone-400 focus:outline-none focus:border-amber-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Selected Course Information Card */}
        {activeCourseObj && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                {activeCourseObj.credits}C
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-stone-900 dark:text-white text-sm">
                    {activeCourseObj.code} — {activeCourseObj.title}
                  </span>
                  <span className="text-[10.5px] px-2 py-0.5 rounded font-bold bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                    {activeCourseObj.school}
                  </span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  {activeCourseObj.category} • Lecture: {activeCourseObj.lecture} hrs •
                  Practical/Tutorial: {activeCourseObj.tutorialOrPractical} hrs • Total: {activeCourseObj.credits} Credits
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadAllCoursePdfs}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download All ({filteredPapers.length}) PDFs</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action Bar: Total Results & Attach Modal Trigger */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Available Examination Papers:
          </span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
            {filteredPapers.length} Papers
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-attach-pyp-modal"
            onClick={() => setIsAttachModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Paper</span>
          </button>
        </div>
      </div>

      {/* Papers Grid */}
      {filteredPapers.length === 0 ? (
        <div className="text-center py-12 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-8">
          <BookOpen className="w-12 h-12 text-stone-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">
            No question papers found matching your criteria
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-sm mx-auto">
            Try resetting your course or exam filter, or click any course from the top dropdown to view its verified papers.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedCourseCode('all');
              setSelectedExamType('all');
              setSelectedYear('all');
              setSearchQuery('');
            }}
            className="mt-4 px-3.5 py-1.5 rounded-xl bg-stone-200 dark:bg-stone-800 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-300"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPapers.map((paper) => {
            const isFat = paper.examType === 'fat' || paper.examType === 'end_term';
            const isCat1 = paper.examType === 'cat1' || paper.examType === 'mid_term';
            const isCat2 = paper.examType === 'cat2';
            const isExpanded = expandedPaperId === paper.id;
            const isDownloading = downloadingId === paper.id;

            return (
              <div
                key={paper.id}
                className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 shadow-sm hover:border-amber-500/40 dark:hover:border-amber-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                          isFat
                            ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                            : isCat1
                            ? 'bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                            : 'bg-purple-50 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                        }`}
                      >
                        {isFat ? 'FAT (Term End)' : isCat1 ? 'CAT-1 (Continuous)' : 'CAT-2 (Continuous)'}
                      </span>
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                        {paper.year}
                      </span>
                      <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400">
                        {paper.courseCode}
                      </span>
                    </div>

                    <span className="text-[11px] font-medium text-stone-400 shrink-0">
                      {paper.fileSize}
                    </span>
                  </div>

                  {/* Course Title & University */}
                  <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
                    <span>{paper.courseName}</span>
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    {paper.university} • {paper.semester}
                  </p>

                  {/* Metrics Bar */}
                  <div className="grid grid-cols-3 gap-2 mt-3.5 py-2 px-3 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-850 text-xs">
                    <div>
                      <div className="text-[10px] text-stone-400 uppercase font-semibold">Questions</div>
                      <div className="font-bold text-stone-800 dark:text-stone-200">
                        {paper.totalQuestions} Questions
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-stone-400 uppercase font-semibold">Max Marks</div>
                      <div className="font-bold text-stone-800 dark:text-stone-200">
                        {paper.totalMarks} Marks
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-stone-400 uppercase font-semibold">Duration</div>
                      <div className="font-bold text-stone-800 dark:text-stone-200">
                        {paper.timeDuration}
                      </div>
                    </div>
                  </div>

                  {/* Topics Covered */}
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    {paper.topicsCovered.slice(0, 4).map((topic, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300"
                      >
                        {topic}
                      </span>
                    ))}
                    {paper.topicsCovered.length > 4 && (
                      <span className="text-[10px] text-stone-400">
                        +{paper.topicsCovered.length - 4} more
                      </span>
                    )}
                  </div>

                  {/* Expand Sample Questions Toggle */}
                  <div className="mt-3">
                    <button
                      onClick={() => setExpandedPaperId(isExpanded ? null : paper.id)}
                      className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <span>{isExpanded ? 'Hide Questions Preview' : 'Preview Paper Questions'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-2.5 p-3 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-2 animate-in fade-in duration-150">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                          Sample VIT-AP Examination Questions ({paper.sampleQuestions.length}):
                        </div>
                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                          {paper.sampleQuestions.map((sq, idx) => (
                            <div
                              key={idx}
                              className="text-xs text-stone-700 dark:text-stone-300 pb-1.5 border-b border-stone-100 dark:border-stone-850 last:border-0"
                            >
                              <div className="flex items-center justify-between font-semibold text-stone-900 dark:text-stone-200 text-[11px]">
                                <span>{sq.section} • {sq.number}</span>
                                <span className="text-amber-600 dark:text-amber-400">[{sq.marks} Marks]</span>
                              </div>
                              <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-snug mt-0.5">
                                {sq.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions: AI Priority Analysis & Download PDF */}
                <div className="mt-4 pt-3.5 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    <FileCheck className="w-4 h-4" />
                    <span className="hidden sm:inline">VIT-AP Verified</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* AI Priority Analysis Button */}
                    <button
                      onClick={() => setAnalyzingPaper(paper)}
                      className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                      title="Analyze top priority recommendations, high-yield questions, and 80/20 topics"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Top Priority</span>
                    </button>

                    {/* Direct Download Authentic Paper Button */}
                    <button
                      id={`btn-download-pdf-${paper.id}`}
                      onClick={() => handleDownload(paper)}
                      disabled={isDownloading}
                      className={`px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95 disabled:opacity-50 ${
                        paper.driveUrl
                          ? 'bg-amber-500 hover:bg-amber-400 text-stone-950'
                          : 'bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900'
                      }`}
                      title={
                        paper.driveUrl
                          ? 'Download authentic examination question paper PDFs from repository'
                          : 'Download printable examination paper PDF'
                      }
                    >
                      <Download className={`w-3.5 h-3.5 ${isDownloading ? 'animate-bounce' : ''}`} />
                      <span>{paper.driveUrl ? 'Download Papers' : isDownloading ? 'Generating...' : 'PDF'}</span>
                      {paper.driveUrl && <ExternalLink className="w-3 h-3 opacity-70" />}
                    </button>

                    {/* Short Notes button if available */}
                    {paper.shortNotesUrl && (
                      <button
                        onClick={() => window.open(paper.shortNotesUrl, '_blank')}
                        className="px-2.5 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center gap-1 transition-all active:scale-95"
                        title="Open verified course revision short notes"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                        <span className="hidden sm:inline">Notes</span>
                      </button>
                    )}

                    {/* Clean Printable PDF Sheet Generator */}
                    {paper.driveUrl && (
                      <button
                        onClick={() => handleGeneratePrintablePdf(paper)}
                        disabled={isDownloading}
                        className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-all active:scale-95"
                        title="Generate offline clean printable study sheet PDF"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Solve / Analyze Handler */}
                    {onAnalyzePaper && (
                      <button
                        onClick={() => onAnalyzePaper(paper)}
                        className="px-2.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs flex items-center gap-1 transition-all active:scale-95"
                        title="Open in practice workspace"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      </>
      )}

      {/* AI Paper Analysis Modal */}
      <AiPaperAnalysisModal
        paper={analyzingPaper}
        isOpen={!!analyzingPaper}
        onClose={() => setAnalyzingPaper(null)}
      />

      {/* Attach / Upload PYP Modal */}
      {isAttachModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2.5">
                <VitApLogo size="sm" showSubtitle={false} />
                <h3 className="text-base font-bold text-stone-900 dark:text-white">
                  Attach VIT-AP Question Paper
                </h3>
              </div>
              <button
                onClick={() => setIsAttachModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {attachSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{attachSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleAttachSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1">
                  1. Select VIT-AP Course
                </label>
                <select
                  value={attachCourseCode}
                  onChange={(e) => setAttachCourseCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-stone-100 font-medium focus:outline-none focus:border-amber-500"
                >
                  {VIT_AP_COURSES.map((course) => (
                    <option key={course.code} value={course.code}>
                      {course.code} — {course.title} ({course.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1">
                    2. Exam Type
                  </label>
                  <select
                    value={attachExamType}
                    onChange={(e) => setAttachExamType(e.target.value as ExamType)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-stone-100 font-medium focus:outline-none focus:border-amber-500"
                  >
                    <option value="cat1">CAT-1 (Continuous Assessment 1)</option>
                    <option value="cat2">CAT-2 (Continuous Assessment 2)</option>
                    <option value="fat">FAT (Final Assessment Test)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1">
                    3. Exam Year
                  </label>
                  <select
                    value={attachYear}
                    onChange={(e) => setAttachYear(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-stone-100 font-medium focus:outline-none focus:border-amber-500"
                  >
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1">
                  4. File Name (PDF / Scan)
                </label>
                <input
                  type="text"
                  value={attachFileName}
                  onChange={(e) => setAttachFileName(e.target.value)}
                  placeholder={`VIT_AP_${attachCourseCode}_${attachExamType.toUpperCase()}_${attachYear}.pdf`}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAttachModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold text-xs hover:bg-stone-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-all active:scale-95"
                >
                  Confirm & Attach Paper
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
