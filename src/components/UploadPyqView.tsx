import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Trash2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Clock,
  ArrowRight,
  ShieldCheck,
  FolderOpen,
  Home,
  BookOpen,
  Layers,
  Award,
} from 'lucide-react';
import { Paper, AvailablePyqPaper } from '../types.js';
import { AvailablePypsLibrary } from './AvailablePypsLibrary.js';
import { COURSES_LIST } from '../data/availablePyps.js';
import { VitApLogo } from './VitApLogo.js';
import { VIT_AP_COURSES } from '../data/vitApCourses.js';

interface UploadPyqViewProps {
  papers: Paper[];
  onUpload: (payload: {
    fileName: string;
    year: number;
    subject: string;
    examName: string;
    rawText: string;
    fileSize: number;
  }) => Promise<void>;
  onDeletePaper: (id: string) => Promise<void>;
  onNavigate: (tab: string) => void;
}

export const UploadPyqView: React.FC<UploadPyqViewProps> = ({
  papers,
  onUpload,
  onDeletePaper,
  onNavigate,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'upload' | 'library'>('upload');
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState('');
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [subject, setSubject] = useState('Operating Systems');
  const [examType, setExamType] = useState<'mid_term' | 'end_term'>('end_term');
  const [examName, setExamName] = useState('University Examination');
  const [rawText, setRawText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(0);

  const PIPELINE_STAGES = [
    'Uploading Paper Document',
    'Extracting Plain Text & OCR',
    'Detecting Question Patterns (Q1, Marks, Sections)',
    'Classifying Topics via Taxonomy Engine',
    'Finding Semantic Similarities & Question Families',
    'Computing Deterministic Frequencies & Weights',
    'Building Exam Intelligence & Study Priorities',
    'Analysis Complete!',
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setRawText(
        content ||
          `Q1: Explain Banker's Algorithm with safe state calculation. [10 Marks]\nQ2: Compare SJF Preemptive and Round Robin scheduling. [8 Marks]\nQ3: Discuss Semaphores and solution to Critical Section problem. [10 Marks]`
      );
    };
    reader.readAsText(file);
  };

  const handlePreloadSample = () => {
    setFileName(`${subject.replace(/\s+/g, '_')}_${examType === 'mid_term' ? 'CAT' : 'FAT'}_2025.pdf`);
    setSelectedYear(2025);
    setRawText(`Section A (Compulsory)
Q1. (a) State and explain the fundamental principles and theoretical foundations governing ${subject}. [8 Marks]
Q1. (b) Solve analytical formulation problem. Formulate step-by-step mathematical model and define state boundaries. [10 Marks]
Q2. (a) Differentiate between primary architectural paradigms and computational models in modern applications. [10 Marks]
Q2. (b) Derive efficiency criteria and optimization conditions with verified equations. [6 Marks]
Section B (Analytical & Design)
Q3. (a) Design optimized algorithmic pipeline / structural circuit for the given university test scenario. [10 Marks]
Q3. (b) Analyze performance tradeoffs, convergence rates, and boundary error constraints. [10 Marks]
Q4. (a) Evaluate practical design implementation and real-world system constraints. [8 Marks]`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) {
      alert('Please select a question paper file or click "Load 2025 Sample Paper".');
      return;
    }

    setIsProcessing(true);
    setCurrentStageIdx(0);

    // Simulate animated pipeline progression
    for (let i = 0; i < PIPELINE_STAGES.length - 1; i++) {
      setCurrentStageIdx(i);
      await new Promise((r) => setTimeout(r, 400));
    }

    const resolvedExamName = `${subject} ${examType === 'mid_term' ? 'Mid-Term Exam' : 'End-Term Exam'}`;

    await onUpload({
      fileName: fileName || `${subject.replace(/\s+/g, '_')}_${examType}_${selectedYear}.pdf`,
      year: selectedYear,
      subject,
      examName: resolvedExamName,
      rawText,
      fileSize: 1940000,
    });

    setCurrentStageIdx(PIPELINE_STAGES.length - 1);
    await new Promise((r) => setTimeout(r, 500));

    setIsProcessing(false);
    setFileName('');
    setRawText('');
  };

  const handleAnalyzeAvailablePaper = async (paper: AvailablePyqPaper) => {
    setIsProcessing(true);
    setCurrentStageIdx(0);

    const questionsText = paper.sampleQuestions
      .map((q) => `Q${q.number}: ${q.text} [${q.marks} Marks]`)
      .join('\n');

    for (let i = 0; i < 4; i++) {
      setCurrentStageIdx(i);
      await new Promise((r) => setTimeout(r, 250));
    }

    await onUpload({
      fileName: paper.fileName,
      year: paper.year,
      subject: paper.courseName,
      examName: `${paper.courseName} ${paper.examType === 'mid_term' ? 'Mid-Term' : 'End-Term'} Exam`,
      rawText: questionsText,
      fileSize: 2200000,
    });

    setIsProcessing(false);
    onNavigate('dashboard');
  };

  return (
    <div id="upload-pyq-view" className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Navigation Breadcrumb & Back to Home */}
      <div className="flex items-center justify-between">
        <button
          id="btn-upload-back-home"
          onClick={() => onNavigate('landing')}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-850 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold text-xs border border-stone-300 dark:border-stone-750 transition-colors group"
        >
          <Home className="w-3.5 h-3.5 text-amber-500 group-hover:-translate-x-0.5 transition-transform" />
          <span>← Return to Home Screen</span>
        </button>

        {/* Tab switch between Upload & Available Library */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-100 dark:bg-stone-850 border border-stone-200 dark:border-stone-800">
          <button
            onClick={() => setActiveSubTab('upload')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'upload'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload & Attach Papers</span>
          </button>

          <button
            onClick={() => setActiveSubTab('library')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'library'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Available PYPs Library (PDFs)</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'library' ? (
        <AvailablePypsLibrary
          onAnalyzePaper={handleAnalyzeAvailablePaper}
          onNavigateToUpload={() => setActiveSubTab('upload')}
        />
      ) : (
        <>
          {/* Header Title with VIT-AP University Emblem */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <VitApLogo size="sm" showSubtitle={false} />
                <span className="text-xs font-bold text-stone-400">•</span>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                  VIT-AP University • All Schools & Branches
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-white flex items-center gap-2">
                <span>Upload & Attach Previous Year Question Papers (PYPs)</span>
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
                Select from all official VIT-AP courses, specify CAT (Mid-Term) or FAT (End-Term), and attach consecutive year question papers.
              </p>
            </div>
          </div>

          {/* Upload Form Card */}
          <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Metadata Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 1. Select Course Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                    1. Select Course Name
                  </label>
                  <select
                    id="upload-course-select"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:border-amber-500 font-medium"
                  >
                    <optgroup label="Programme Core (40 Credits)">
                      {VIT_AP_COURSES.filter((c) => c.category === 'Programme Core').map((c) => (
                        <option key={c.code} value={c.title}>
                          {c.code} — {c.title}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="University Core (80 Credits)">
                      {VIT_AP_COURSES.filter((c) => c.category === 'University Core').map((c) => (
                        <option key={c.code} value={c.title}>
                          {c.code} — {c.title}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Specialization Electives (20 Credits)">
                      {VIT_AP_COURSES.filter((c) => c.category === 'Specialization Elective').map((c) => (
                        <option key={c.code} value={c.title}>
                          {c.code} — {c.title}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="University Electives (20 Credits)">
                      {VIT_AP_COURSES.filter((c) => c.category === 'University Elective').map((c) => (
                        <option key={c.code} value={c.title}>
                          {c.code} — {c.title}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                {/* 2. Select Exam Type (Mid Term vs End Term) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                    2. Select Exam Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setExamType('mid_term')}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                        examType === 'mid_term'
                          ? 'bg-violet-500/20 border-violet-500 text-violet-700 dark:text-violet-300'
                          : 'bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Mid Term</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setExamType('end_term')}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                        examType === 'end_term'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-800 dark:text-amber-300'
                          : 'bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>End Term</span>
                    </button>
                  </div>
                </div>

                {/* 3. Exam Year */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                    3. Exam Year
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:border-amber-500 font-medium"
                  >
                    {[2025, 2024, 2023, 2022, 2021, 2020].map((yr) => (
                      <option key={yr} value={yr}>
                        {yr} Examination
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Drag and Drop Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
                  dragActive
                    ? 'border-amber-500 bg-amber-500/10'
                    : 'border-stone-300 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-950/60 hover:border-stone-400 dark:hover:border-stone-700'
                }`}
              >
                <input
                  type="file"
                  id="file-upload-input"
                  accept=".pdf,.txt,.doc,.docx"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
                    <UploadCloud className="w-7 h-7 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-stone-800 dark:text-stone-200">
                      {fileName ? (
                        <span className="text-amber-600 dark:text-amber-400 font-mono">{fileName}</span>
                      ) : (
                        'Click to attach or drag & drop question paper (PDF, DOCX, TXT)'
                      )}
                    </p>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                      Max file size: 25MB • Course: {subject} ({examType === 'mid_term' ? 'Mid Term' : 'End Term'})
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Preload Sample Banner */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs">
                <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Want to test without an external file? Load our official {selectedYear} question sample.</span>
                </div>
                <button
                  type="button"
                  id="btn-preload-sample"
                  onClick={handlePreloadSample}
                  className="px-3 py-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-amber-800 dark:text-amber-300 font-semibold border border-stone-300 dark:border-stone-700 shrink-0 transition-colors"
                >
                  Load 2025 Sample Paper
                </button>
              </div>

              {/* Optional Raw Text Preview / Edit */}
              {rawText && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                    <span className="font-semibold text-stone-700 dark:text-stone-300">
                      Extracted Text Preview:
                    </span>
                    <span>{rawText.split('\n').length} lines detected</span>
                  </div>
                  <textarea
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    rows={4}
                    className="w-full p-3 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-xs text-stone-800 dark:text-stone-300 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}

              {/* Processing Pipeline Modal / Indicator */}
              {isProcessing ? (
                <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-amber-500/40 space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-amber-500 animate-spin" />
                      <span className="text-sm font-bold text-amber-700 dark:text-amber-300">
                        Analysis Pipeline in Progress...
                      </span>
                    </div>
                    <span className="text-xs font-mono text-stone-500 dark:text-stone-400">
                      Stage {currentStageIdx + 1} of {PIPELINE_STAGES.length}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
                    <div
                      className="h-full bg-amber-500 transition-all duration-300"
                      style={{
                        width: `${((currentStageIdx + 1) / PIPELINE_STAGES.length) * 100}%`,
                      }}
                    />
                  </div>

                  {/* Stages Checklist */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {PIPELINE_STAGES.map((stage, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-2 p-2 rounded-lg ${
                          idx < currentStageIdx
                            ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10'
                            : idx === currentStageIdx
                            ? 'text-amber-800 dark:text-amber-300 font-semibold bg-amber-500/10'
                            : 'text-stone-400 dark:text-stone-500'
                        }`}
                      >
                        {idx < currentStageIdx ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-stone-300 dark:border-stone-700 flex items-center justify-center text-[9px]">
                            {idx + 1}
                          </div>
                        )}
                        <span>{stage}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveSubTab('library')}
                    className="px-4 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold transition-colors"
                  >
                    Browse Available PYPs Instead
                  </button>
                  <button
                    type="submit"
                    id="btn-submit-upload"
                    className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-md transition-all flex items-center gap-2 active:scale-95"
                  >
                    <UploadCloud className="w-4 h-4 text-stone-950" />
                    <span>Attach & Run Analysis Pipeline</span>
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Uploaded Papers List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <span>Ingested Examination Papers ({papers.length})</span>
              </h2>
              <span className="text-xs text-stone-500 dark:text-stone-400">
                {papers.length >= 5 ? '5-Year Corpus Complete' : `${papers.length} of 5 years ingested`}
              </span>
            </div>

            {papers.length === 0 ? (
              <div className="text-center py-10 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6">
                <FileText className="w-10 h-10 text-stone-400 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-semibold text-stone-700 dark:text-stone-300">
                  No question papers ingested yet.
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  Upload your question paper above or load a sample to start analysis.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {papers.map((paper) => (
                  <div
                    key={paper.id}
                    className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 flex flex-col justify-between shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                          {paper.year}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Analyzed</span>
                          </span>
                          <button
                            onClick={() => onDeletePaper(paper.id)}
                            className="p-1 rounded text-stone-400 hover:text-red-500 transition-colors"
                            title="Delete paper"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-sm font-bold text-stone-900 dark:text-white truncate">
                        {paper.fileName}
                      </h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                        {paper.subject} • {paper.examName}
                      </p>

                      <div className="mt-4 grid grid-cols-2 gap-2 text-xs py-2 px-3 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-850">
                        <div>
                          <div className="text-[10px] text-stone-400 uppercase font-semibold">
                            Questions
                          </div>
                          <div className="font-bold text-stone-800 dark:text-stone-200">
                            {paper.totalQuestions} Extracted
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-stone-400 uppercase font-semibold">
                            Total Marks
                          </div>
                          <div className="font-bold text-stone-800 dark:text-stone-200">
                            {paper.totalMarks} Marks
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                      <span className="text-stone-400">
                        {(paper.fileSize / (1024 * 1024)).toFixed(2)} MB
                      </span>
                      <button
                        onClick={() => onNavigate('questions')}
                        className="text-amber-600 dark:text-amber-400 font-bold hover:underline flex items-center gap-1"
                      >
                        <span>View Questions</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
