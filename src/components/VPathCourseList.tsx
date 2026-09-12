import React, { useState, useMemo } from 'react';
import {
  Download,
  ExternalLink,
  Sparkles,
  Search,
  BookOpen,
  CheckCircle2,
  FolderDown,
  BarChart3,
  User,
  Mail,
  GraduationCap,
  Layers,
  FileText,
  Clock,
} from 'lucide-react';
import { VPATH_COURSES, VPATH_PROGRAM_TABS, VPathCourse } from '../data/vpathRealPapers.js';
import { AvailablePyqPaper } from '../types.js';
import { getOrCreatePaperForCourse } from '../data/availablePyps.js';
import { VIT_AP_COURSES, VitApCourse } from '../data/vitApCourses.js';
import { VitApLogo } from './VitApLogo.js';

interface VPathCourseListProps {
  onOpenAiAnalysis: (paper: AvailablePyqPaper) => void;
}

export const VPathCourseList: React.FC<VPathCourseListProps> = ({ onOpenAiAnalysis }) => {
  const [activeProgramTab, setActiveProgramTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredCourses = useMemo(() => {
    return VPATH_COURSES.filter((course) => {
      // Program tab filter
      if (activeProgramTab !== 'all' && course.program !== activeProgramTab) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inCode = course.code.toLowerCase().includes(q);
        const inTitle = course.title.toLowerCase().includes(q);
        const inCategory = course.category.toLowerCase().includes(q);
        const inSchool = course.school.toLowerCase().includes(q);
        if (!inCode && !inTitle && !inCategory && !inSchool) {
          return false;
        }
      }

      return true;
    });
  }, [activeProgramTab, searchQuery]);

  const handleLaunchAnalysis = (course: VPathCourse, examType: 'cat1' | 'cat2' | 'fat') => {
    // Find VitApCourse matching this code
    const foundCourse = VIT_AP_COURSES.find(
      (c) => c.code.toUpperCase() === course.code.toUpperCase()
    );

    const vitApCourse: VitApCourse = foundCourse || {
      code: course.code,
      title: course.title,
      school: (course.school.includes('SCOPE')
        ? 'SCOPE'
        : course.school.includes('SENSE')
        ? 'SENSE'
        : course.school.includes('VSB')
        ? 'VSB'
        : 'SAS') as 'SCOPE' | 'SENSE' | 'VSB' | 'SAS',
      category: 'Programme Core',
      credits: 4,
      lecture: 3,
      tutorialOrPractical: 0,
      hasPyps: true,
      slug: course.code.toLowerCase(),
    };

    const paper = getOrCreatePaperForCourse(vitApCourse, examType, 2025);
    // Explicitly attach the real drive URL
    paper.driveUrl = examType === 'cat1' ? course.cat1 : examType === 'cat2' ? course.cat2 : course.fat;
    paper.shortNotesUrl = course.short;

    onOpenAiAnalysis(paper);
  };

  return (
    <div className="space-y-6">
      {/* Program Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {VPATH_PROGRAM_TABS.map((tab) => {
          const isSelected = activeProgramTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveProgramTab(tab.id)}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-amber-500 text-stone-950 shadow-md scale-100'
                  : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                  isSelected
                    ? 'bg-stone-950/20 text-stone-950'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400'
                }`}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search and Overview Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 57 courses by title or code (e.g. CSE2008, MAT1001)..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs sm:text-sm focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 shrink-0">
          <span>Showing <strong>{filteredCourses.length}</strong> of 57 verified university courses</span>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCourses.map((course) => (
          <div
            key={course.code}
            className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 shadow-sm hover:border-amber-500/50 dark:hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Course Code & Tags */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-black bg-stone-100 dark:bg-stone-800 text-amber-600 dark:text-amber-400 border border-stone-200 dark:border-stone-700">
                    {course.code}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                    {course.school}
                  </span>
                </div>

                <span className="text-[11px] font-medium text-stone-400">
                  {course.category}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-stone-900 dark:text-white leading-snug">
                {course.title}
              </h3>
            </div>

            {/* Direct Google Drive Download Buttons (CAT-1, CAT-2, FAT, Short) */}
            <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800/80">
              <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Official PDF Question Papers:
              </div>

              <div className="grid grid-cols-3 gap-2">
                {/* CAT-1 */}
                {course.cat1 ? (
                  <a
                    href={course.cat1}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/20 text-xs font-bold flex flex-col items-center justify-center gap-1 text-center transition-all group active:scale-95"
                    title="Download CAT-1 Official Papers (Google Drive)"
                  >
                    <div className="flex items-center gap-1">
                      <Download className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />
                      <span>CAT-1</span>
                    </div>
                    <span className="text-[10px] opacity-75 font-medium">Download PDF</span>
                  </a>
                ) : (
                  <div className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800/40 text-stone-400 text-xs font-medium flex flex-col items-center justify-center text-center">
                    <span>CAT-1</span>
                    <span className="text-[10px]">Soon</span>
                  </div>
                )}

                {/* CAT-2 */}
                {course.cat2 ? (
                  <a
                    href={course.cat2}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/20 text-xs font-bold flex flex-col items-center justify-center gap-1 text-center transition-all group active:scale-95"
                    title="Download CAT-2 Official Papers (Google Drive)"
                  >
                    <div className="flex items-center gap-1">
                      <Download className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />
                      <span>CAT-2</span>
                    </div>
                    <span className="text-[10px] opacity-75 font-medium">Download PDF</span>
                  </a>
                ) : (
                  <div className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800/40 text-stone-400 text-xs font-medium flex flex-col items-center justify-center text-center">
                    <span>CAT-2</span>
                    <span className="text-[10px]">Soon</span>
                  </div>
                )}

                {/* FAT */}
                {course.fat ? (
                  <a
                    href={course.fat}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 dark:text-amber-300 border border-amber-500/30 text-xs font-bold flex flex-col items-center justify-center gap-1 text-center transition-all group active:scale-95"
                    title="Download FAT Official Papers (Google Drive)"
                  >
                    <div className="flex items-center gap-1">
                      <Download className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />
                      <span>FAT</span>
                    </div>
                    <span className="text-[10px] opacity-75 font-medium">Download PDF</span>
                  </a>
                ) : (
                  <div className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800/40 text-stone-400 text-xs font-medium flex flex-col items-center justify-center text-center">
                    <span>FAT</span>
                    <span className="text-[10px]">Soon</span>
                  </div>
                )}
              </div>

              {/* Short Semester Notes Link (if present) */}
              {course.short && (
                <div className="pt-1">
                  <a
                    href={course.short}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-stone-500 hover:text-amber-600 dark:hover:text-amber-400 font-semibold flex items-center gap-1 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Open Short Semester Archive & Notes</span>
                  </a>
                </div>
              )}
            </div>

            {/* Analysis Trigger Button */}
            <div className="pt-2">
              <button
                onClick={() => handleLaunchAnalysis(course, 'fat')}
                className="w-full py-2 px-3 rounded-xl bg-stone-100 hover:bg-amber-500/15 dark:bg-stone-800 dark:hover:bg-amber-500/20 text-stone-700 dark:text-stone-300 hover:text-amber-700 dark:hover:text-amber-300 border border-stone-200 dark:border-stone-700 hover:border-amber-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <BarChart3 className="w-3.5 h-3.5 text-amber-500" />
                <span>Question Frequency & Marks Analysis</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
