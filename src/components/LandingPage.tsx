import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  ArrowRight,
  Sun,
  Moon,
  Download,
  BookOpen,
  CheckCircle2,
  FileText,
  Sparkles,
  BarChart3,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext.js';
import { AvailablePypsLibrary } from './AvailablePypsLibrary.js';
import { AvailablePyqPaper } from '../types.js';
import { VitApLogo } from './VitApLogo.js';
import { ExamBreadLogo } from './ExamBreadLogo.js';

interface LandingPageProps {
  onGetStarted: () => void;
  onUploadPyps: () => void;
  onTryDemo?: () => void;
  onAnalyzePaper?: (paper: AvailablePyqPaper) => void;
  onDirectUpload?: (payload: {
    fileName: string;
    courseName: string;
    examType: string;
    year: number;
    rawText: string;
  }) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onUploadPyps,
  onAnalyzePaper,
  onDirectUpload,
}) => {
  const { theme, toggleTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAttachedFile(file);
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        if (onDirectUpload) {
          onDirectUpload({
            fileName: file.name,
            courseName: file.name.replace(/\.[^/.]+$/, ''),
            examType: 'fat',
            year: 2025,
            rawText: text || `Question paper content for ${file.name}`,
          });
        } else {
          onUploadPyps();
        }
        setIsUploading(false);
      };
      reader.readAsText(file);
    }
  };

  const scrollToCourses = () => {
    const el = document.getElementById('section-courses');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      id="landing-page"
      className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 selection:bg-amber-500 selection:text-stone-950 transition-colors duration-200"
    >
      {/* Top Navbar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-stone-200 dark:border-stone-800/80 sticky top-0 bg-stone-50/90 dark:bg-stone-950/90 backdrop-blur-md z-30">
        {/* Left: EXAM BREAD Brand & VIT-AP Logo */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div
            id="landing-logo-btn"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 cursor-pointer group"
            title="EXAM BREAD Home"
          >
            <ExamBreadLogo size="sm" />
            <div>
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-stone-900 dark:text-white font-sans block leading-tight">
                EXAM BREAD
              </span>
              <p className="text-[10px] text-stone-500 dark:text-stone-400 tracking-tight hidden sm:block">
                Past. Pattern. Plan. Perform.
              </p>
            </div>
          </div>

          <div className="h-5 w-px bg-stone-300 dark:bg-stone-800 hidden sm:block" />

          {/* VIT-AP University Emblem in Navbar */}
          <div className="hidden sm:flex items-center">
            <VitApLogo size="sm" showSubtitle={false} />
          </div>
        </div>

        {/* Right Nav: Maintainer attribution in top right corner as requested + Theme + Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Maintained by Bhanu Pill on the top right corner */}
          <a
            href="mailto:bhanu.25bce8476@vitapstudent.ac.in"
            title="Creator & Maintainer: D.Bhanu.V.N (25BCE8476)"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-200/70 hover:bg-amber-500/10 dark:bg-stone-800/80 dark:hover:bg-amber-500/15 border border-stone-300 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors font-medium shrink-0"
          >
            <span>Maintained by Bhanu</span>
            <span className="font-mono text-[11px] text-amber-600 dark:text-amber-400 font-semibold">(25BCE8476)</span>
          </a>

          {/* Dark / Light Theme Toggle */}
          <button
            id="theme-toggle-landing"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 border border-stone-300 dark:border-stone-750 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-stone-700" />
            )}
          </button>

          {/* Upload Paper Action */}
          <button
            id="landing-btn-upload-pyps-top"
            onClick={onUploadPyps}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-300 bg-white hover:bg-stone-100 dark:bg-stone-900 dark:hover:bg-stone-800 border border-stone-300 dark:border-stone-700 transition-colors"
          >
            <UploadCloud className="w-3.5 h-3.5 text-amber-500" />
            <span>Upload Paper</span>
          </button>

          {/* Study Workspace */}
          <button
            id="landing-btn-start-top"
            onClick={onGetStarted}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
          >
            <span>Study Mode</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* Clean & Pure Hero Section */}
      <section className="pt-10 sm:pt-14 pb-10 px-4 sm:px-6 max-w-4xl mx-auto text-center">
        {/* Subtle University Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-medium text-stone-600 dark:text-stone-400 mb-5">
          <VitApLogo size="xs" showSubtitle={false} />
          <span>VIT-AP University</span>
          <span className="text-stone-300 dark:text-stone-700">•</span>
          <span className="text-stone-800 dark:text-stone-200 font-semibold">Official Exam Question Papers</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-stone-900 dark:text-white mb-4 leading-tight">
          VIT-AP Previous Year Question Papers
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto mb-8 leading-relaxed">
          Download verified CAT-1, CAT-2, and FAT exam papers with semester notes across all branches and programs.
        </p>

        {/* Quick Hero Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={scrollToCourses}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-md transition-all flex items-center gap-2 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Browse 57 Courses</span>
          </button>

          <button
            onClick={onUploadPyps}
            className="px-6 py-3 rounded-xl bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 font-semibold text-sm border border-stone-300 dark:border-stone-700 transition-all flex items-center gap-2 active:scale-95"
          >
            <UploadCloud className="w-4 h-4 text-amber-500" />
            <span>Upload Question Paper</span>
          </button>
        </div>
      </section>

      {/* Main Course Directory Section (What the student came for) */}
      <main id="section-courses" className="py-8 px-4 sm:px-6 max-w-6xl mx-auto">
        <AvailablePypsLibrary
          onAnalyzePaper={(paper) => {
            if (onAnalyzePaper) {
              onAnalyzePaper(paper);
            } else {
              onGetStarted();
            }
          }}
          onNavigateToUpload={onUploadPyps}
        />
      </main>

      {/* Simple "Have an unlisted paper?" section */}
      <section className="py-12 px-4 sm:px-6 max-w-2xl mx-auto text-center">
        <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <UploadCloud className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-stone-900 dark:text-white">
            Have an exam paper not listed here?
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mx-auto">
            Upload your CAT-1, CAT-2, or FAT question paper (PDF or scan) to help fellow VIT-AP students.
          </p>
          <div className="pt-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-sm transition-all inline-flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>{isUploading ? 'Uploading...' : 'Select Question Paper File'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Clean Minimalist Footer */}
      <footer className="border-t border-stone-200 dark:border-stone-800 py-6 px-6 text-xs text-stone-500 dark:text-stone-400 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <ExamBreadLogo size="xs" />
            <span className="font-bold text-stone-800 dark:text-stone-200">EXAM BREAD</span>
            <span>•</span>
            <span>VIT-AP University Exam Question Paper Archive</span>
          </div>
          <div className="flex items-center gap-2 text-stone-500">
            <span>CAT-1, CAT-2 & FAT Papers with Verified Solutions</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
