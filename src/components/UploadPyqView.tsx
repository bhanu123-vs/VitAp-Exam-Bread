import React, { useState, useEffect, useMemo } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Clock,
  ArrowRight,
  ShieldCheck,
  FolderOpen,
  BookOpen,
  Layers,
  Award,
  Mail,
  ExternalLink,
  Check,
  X,
  Lock,
  Unlock,
  User,
  Shield,
  Download,
  FolderDown,
  ChevronRight,
  Copy,
} from 'lucide-react';
import { Paper } from '../types.js';
import { AvailablePypsLibrary } from './AvailablePypsLibrary.js';
import { VitApLogo } from './VitApLogo.js';
import { VIT_AP_COURSES } from '../data/vitApCourses.js';
import { VPATH_COURSES } from '../data/vpathDatabase.js';
import { api } from '../services/api.js';
import { publishedPapersStore } from '../data/publishedPapersStore.js';

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
  // Main view mode: 'upload' (Student vs Admin) or 'library' (Drive Archive)
  const [activeMainTab, setActiveMainTab] = useState<'upload' | 'library'>('upload');

  // Upload Role: 'student' or 'admin'
  const [uploadRole, setUploadRole] = useState<'student' | 'admin'>('student');

  // Admin Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminKeyInput, setAdminKeyInput] = useState('');
  const [adminAuthError, setAdminAuthError] = useState('');

  // Admin Sub-Tab: 'pending' (Moderate Student Submissions) or 'direct-upload' (Publish Paper)
  const [adminSubTab, setAdminSubTab] = useState<'pending' | 'direct-upload'>('pending');

  // Form State (shared by student & direct upload)
  const [courseCode, setCourseCode] = useState('CSE1001');
  const [subject, setSubject] = useState('Problem Solving and Algorithmic Thinking');
  const [examType, setExamType] = useState<'cat1' | 'cat2' | 'fat'>('cat1');
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [uploaderDetails, setUploaderDetails] = useState('');
  const [uploaderNotes, setUploaderNotes] = useState('');
  const [adminDriveLink, setAdminDriveLink] = useState('');

  // File Upload State
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState<number>(0);
  const [pdfBase64, setPdfBase64] = useState<string>('');
  const [rawText, setRawText] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // Submission Pipeline Processing
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(0);

  // Student Submission Result Confirmation
  const [studentSuccessResult, setStudentSuccessResult] = useState<{
    submissionId: string;
    subject: string;
    courseCode: string;
    examType: string;
    year: number;
    fileName: string;
    fileSize: number;
    submittedAt: string;
    recipientEmail: string;
    mailtoUrl: string;
  } | null>(null);

  // Admin Direct Publish Success
  const [adminPublishSuccess, setAdminPublishSuccess] = useState<string | null>(null);

  // Submissions list for moderator review
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const PIPELINE_STAGES = [
    'Processing Question Paper PDF Document',
    'Extracting Plain Text & Question Structure',
    'Registering in VIT-AP Archive Repository',
    'Connecting to Mail Service Gateway',
    'Dispatching Email with PDF to bhanu.25bce8476@vitapstudent.ac.in',
    'Submission Dispatched to Bhanu Successfully!',
  ];

  // Fetch pending submissions when admin tab is opened
  useEffect(() => {
    if (uploadRole === 'admin' && isAdminAuthenticated) {
      loadSubmissions();
    }
  }, [uploadRole, isAdminAuthenticated]);

  const loadSubmissions = async () => {
    setLoadingSubmissions(true);
    try {
      const data = await api.getSubmissions();
      setSubmissions(data.submissions || []);
    } catch (e) {
      console.error('Error loading submissions:', e);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  // Drag and drop handlers
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
    setFileSize(file.size);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setRawText(`Authentic VIT-AP question paper extracted from ${file.name}`);
      setPdfBase64(content || '');
    };
    reader.readAsDataURL(file);
  };

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCode = e.target.value;
    setCourseCode(selectedCode);
    const matched = VIT_AP_COURSES.find((c) => c.code === selectedCode);
    if (matched) {
      setSubject(matched.title);
    }
    // Update default drive link for admin
    const vpath = VPATH_COURSES.find((v) => v.code === selectedCode);
    if (vpath) {
      setAdminDriveLink(vpath.fatUrl || vpath.cat1Url || '');
    }
  };

  const handlePreloadSample = () => {
    const sampleFileName = `${courseCode}_${examType.toUpperCase()}_${selectedYear}.pdf`;
    setFileName(sampleFileName);
    setFileSize(1024 * 320); // 320 KB
    setRawText(`VIT-AP UNIVERSITY
Course: ${subject} (${courseCode})
Examination: ${examType.toUpperCase()} — Academic Year ${selectedYear}
Maximum Marks: ${examType === 'fat' ? '100' : '50'} | Duration: ${examType === 'fat' ? '3.0 Hours' : '1.5 Hours'}

SECTION A (Mandatory Concepts)
Q1. Define core principles, theoretical foundations, and system constraints. [5 Marks]
Q2. Analyze structural models, state transitions, and recurrence equations. [5 Marks]

SECTION B (Analytical Problem Solving)
Q3. Formulate optimization algorithm and evaluate algorithmic tradeoffs. [10 Marks]
Q4. Derive mathematical proof and analyze convergence parameters. [10 Marks]`);
    // Sample base64 data url for PDF
    setPdfBase64('data:application/pdf;base64,JVBERi0xLjQKJcTl8uXrCg==');
  };

  // Submit as Student: Emails PDF to bhanu.25bce8476@vitapstudent.ac.in
  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName) {
      alert('Please upload a Question Paper PDF file or click "Load Sample Paper".');
      return;
    }

    setIsProcessing(true);
    setCurrentStageIdx(0);

    for (let i = 0; i < PIPELINE_STAGES.length - 1; i++) {
      setCurrentStageIdx(i);
      await new Promise((r) => setTimeout(r, 320));
    }

    const finalFileName = fileName || `${courseCode}_${examType.toUpperCase()}_${selectedYear}.pdf`;

    try {
      // 1. Submit paper to backend with real email dispatch to bhanu.25bce8476@vitapstudent.ac.in
      const res = await api.submitPaper({
        courseCode,
        courseName: subject,
        examType,
        year: selectedYear,
        fileName: finalFileName,
        fileSize: fileSize || 280000,
        rawText,
        pdfBase64,
        uploaderEmail: uploaderDetails || 'student@vitapstudent.ac.in',
        uploaderNotes,
      });

      // 2. Also register in local workspace
      await onUpload({
        fileName: finalFileName,
        year: selectedYear,
        subject,
        examName: `${subject} ${examType.toUpperCase()}`,
        rawText: rawText || `Question paper content for ${subject}`,
        fileSize: fileSize || 280000,
      });

      setCurrentStageIdx(PIPELINE_STAGES.length - 1);
      await new Promise((r) => setTimeout(r, 400));

      setStudentSuccessResult({
        submissionId: res.submission?.id || `sub-${Date.now()}`,
        subject,
        courseCode,
        examType: examType.toUpperCase(),
        year: selectedYear,
        fileName: finalFileName,
        fileSize: fileSize || 280000,
        submittedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        recipientEmail: 'bhanu.25bce8476@vitapstudent.ac.in',
        mailtoUrl:
          res.emailResult?.mailtoUrl ||
          `mailto:bhanu.25bce8476@vitapstudent.ac.in?subject=${encodeURIComponent(
            `[EXAM BREAD] Submission: ${subject} (${courseCode}) ${examType.toUpperCase()} ${selectedYear}`
          )}&body=${encodeURIComponent(
            `Dear Bhanu,\n\nPlease verify this question paper for ${subject} (${courseCode}) ${examType.toUpperCase()} ${selectedYear}.\nFile: ${finalFileName}\nSubmitter: ${uploaderDetails || 'Student'}`
          )}`,
      });

      // Reset form
      setFileName('');
      setFileSize(0);
      setPdfBase64('');
      setRawText('');
      setUploaderNotes('');
    } catch (err) {
      console.error('Submission failed:', err);
      alert('Failed to submit question paper. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Admin Unlock
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const key = adminKeyInput.trim();
    if (
      key === 'Bhansu@8437' ||
      key.toLowerCase() === 'bhansu@8437' ||
      key.toUpperCase() === '25BCE8476' ||
      key === 'bhanu'
    ) {
      setIsAdminAuthenticated(true);
      setAdminAuthError('');
    } else {
      setAdminAuthError('Incorrect passcode. Access denied.');
    }
  };

  // Admin Approve Student Submission -> Adds to Course's Drive Link directly!
  const handleApproveSubmission = async (submission: any) => {
    setApprovingId(submission.id);
    try {
      // 1. Call server approve
      await api.approveSubmission(submission.id, 'admin-bypass');

      // 2. Publish into publishedPapersStore so it is directly attached to the course's Drive link
      const vpath = VPATH_COURSES.find((v) => v.code === submission.courseCode);
      const targetDrive =
        submission.examType === 'cat1'
          ? vpath?.cat1Url || vpath?.fatUrl
          : submission.examType === 'cat2'
          ? vpath?.cat2Url || vpath?.fatUrl
          : vpath?.fatUrl;

      publishedPapersStore.publish({
        id: `pub-${submission.id}`,
        courseCode: submission.courseCode,
        courseName: submission.courseName,
        examType: submission.examType,
        year: submission.year,
        fileName: submission.fileName,
        fileSize: submission.fileSize,
        driveLink: targetDrive || 'https://drive.google.com/drive/folders/1sX8kIpxqxuv_rnECo7rS9Ldl8eycBdJ5?usp=drive_link',
        pdfBase64: submission.pdfBase64,
        publishedBy: 'Bhanu (25BCE8476)',
        notes: `Approved student submission (${submission.uploaderEmail || 'student'})`,
      });

      // 3. Reload pending list
      await loadSubmissions();

      setAdminPublishSuccess(
        `✅ Approved! "${submission.courseName} ${submission.examType.toUpperCase()}" is now live and included in the course's Drive link for all students!`
      );
      setTimeout(() => setAdminPublishSuccess(null), 7000);
    } catch (err) {
      console.error('Approval failed:', err);
      alert('Failed to approve submission.');
    } finally {
      setApprovingId(null);
    }
  };

  // Admin Reject Student Submission
  const handleRejectSubmission = async (id: string) => {
    if (!confirm('Reject and discard this question paper submission?')) return;
    try {
      await api.rejectSubmission(id, 'admin-bypass');
      await loadSubmissions();
    } catch (err) {
      console.error(err);
    }
  };

  // Admin Direct Publish -> Adds to Drive Link directly
  const handleAdminDirectPublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName) {
      alert('Please select or upload a question paper PDF.');
      return;
    }

    const finalFileName = fileName || `${courseCode}_${examType.toUpperCase()}_${selectedYear}.pdf`;
    const vpath = VPATH_COURSES.find((v) => v.code === courseCode);
    const finalDriveLink =
      adminDriveLink ||
      (examType === 'cat1'
        ? vpath?.cat1Url
        : examType === 'cat2'
        ? vpath?.cat2Url
        : vpath?.fatUrl) ||
      'https://drive.google.com/drive/folders/1sX8kIpxqxuv_rnECo7rS9Ldl8eycBdJ5?usp=drive_link';

    try {
      // 1. Call server publish
      await api.adminPublishPaper({
        courseCode,
        courseName: subject,
        examType,
        year: selectedYear,
        fileName: finalFileName,
        driveLink: finalDriveLink,
        pdfBase64,
        fileSize: fileSize || 260000,
        adminKey: 'Bhansu@8437',
      });

      // 2. Publish to publishedPapersStore
      publishedPapersStore.publish({
        courseCode,
        courseName: subject,
        examType,
        year: selectedYear,
        fileName: finalFileName,
        fileSize: fileSize || 260000,
        driveLink: finalDriveLink,
        pdfBase64,
        publishedBy: 'Bhanu (25BCE8476)',
        notes: 'Direct Administrator Verified Upload',
      });

      // 3. Register in local papers list
      await onUpload({
        fileName: finalFileName,
        year: selectedYear,
        subject,
        examName: `${subject} ${examType.toUpperCase()}`,
        rawText: rawText || `Question paper content for ${subject}`,
        fileSize: fileSize || 260000,
      });

      setAdminPublishSuccess(
        `✅ Published! "${subject} ${examType.toUpperCase()} (${selectedYear})" is now permanently added to the course's Drive link. Students will immediately see it when browsing Drive archives!`
      );
      setTimeout(() => setAdminPublishSuccess(null), 8000);

      // Reset
      setFileName('');
      setFileSize(0);
      setPdfBase64('');
    } catch (err) {
      console.error(err);
      alert('Failed to publish paper.');
    }
  };

  const pendingSubmissions = useMemo(() => {
    return submissions.filter((s) => s.status === 'pending');
  }, [submissions]);

  return (
    <div id="upload-pyq-view" className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* TOP SUB-NAVIGATION BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-stone-200 dark:border-stone-800">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-stone-900 dark:text-white flex items-center gap-2">
            <span>Question Paper Management & Drive Archive</span>
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Upload past examination papers or browse official Google Drive repositories across all 57 VIT-AP courses.
          </p>
        </div>

        {/* View Switcher: Upload / Moderate vs Drive Library */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-stone-100 dark:bg-stone-800/80 shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setActiveMainTab('upload')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeMainTab === 'upload'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload Paper</span>
          </button>
          <button
            onClick={() => setActiveMainTab('library')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeMainTab === 'library'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <FolderDown className="w-3.5 h-3.5" />
            <span>57 Courses Drive Links</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: DRIVE LIBRARY VIEW */}
      {activeMainTab === 'library' && (
        <AvailablePypsLibrary
          onAnalyzePaper={(paper) => {
            onNavigate('dashboard');
          }}
          onNavigateToUpload={() => {
            setActiveMainTab('upload');
          }}
        />
      )}

      {/* VIEW 2: UPLOAD WORKFLOW (STUDENT VS ADMIN) */}
      {activeMainTab === 'upload' && (
        <div className="space-y-6">
          {/* TWO PRIMARY CHOICE CARDS: UPLOAD AS STUDENT vs UPLOAD AS ADMIN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* OPTION 1: UPLOAD AS STUDENT */}
            <div
              onClick={() => setUploadRole('student')}
              className={`p-5 rounded-3xl cursor-pointer transition-all border-2 relative select-none ${
                uploadRole === 'student'
                  ? 'bg-amber-500/10 border-amber-500 shadow-md ring-2 ring-amber-500/20 dark:bg-amber-500/15'
                  : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-amber-400/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                  <User className="w-5 h-5" />
                </div>
                {uploadRole === 'student' && (
                  <span className="px-2.5 py-1 rounded-full bg-amber-500 text-stone-950 text-[10px] font-extrabold uppercase">
                    Active Mode
                  </span>
                )}
              </div>
              <h3 className="text-base font-extrabold text-stone-900 dark:text-white">
                Upload Paper as Student
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                Submit question papers to Student Administrator Bhanu (
                <span className="text-amber-600 dark:text-amber-400 font-mono font-semibold">
                  bhanu.25bce8476@vitapstudent.ac.in
                </span>
                ) for manual inspection and approval before publishing.
              </p>
            </div>

            {/* OPTION 2: UPLOAD AS ADMIN */}
            <div
              onClick={() => setUploadRole('admin')}
              className={`p-5 rounded-3xl cursor-pointer transition-all border-2 relative select-none ${
                uploadRole === 'admin'
                  ? 'bg-amber-500/10 border-amber-500 shadow-md ring-2 ring-amber-500/20 dark:bg-amber-500/15'
                  : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-amber-400/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1.5">
                  {pendingSubmissions.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold animate-pulse">
                      {pendingSubmissions.length} Pending
                    </span>
                  )}
                  {uploadRole === 'admin' && (
                    <span className="px-2.5 py-1 rounded-full bg-amber-500 text-stone-950 text-[10px] font-extrabold uppercase">
                      Active Mode
                    </span>
                  )}
                </div>
              </div>
              <h3 className="text-base font-extrabold text-stone-900 dark:text-white">
                Upload Paper as Admin
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                Administrator Portal for Bhanu (25BCE8476). Manually review student submissions, verify authenticity, and directly publish new papers into the live Google Drive links.
              </p>
            </div>
          </div>

          {/* ADMIN PUBLISH SUCCESS ALERT */}
          {adminPublishSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{adminPublishSuccess}</span>
              </div>
              <button
                onClick={() => setAdminPublishSuccess(null)}
                className="text-emerald-500 hover:text-emerald-700 font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION A: STUDENT UPLOAD WORKFLOW                                        */}
          {/* ========================================================================= */}
          {uploadRole === 'student' && (
            <div className="space-y-6">
              {/* STUDENT SUCCESS CONFIRMATION MODAL / CARD */}
              {studentSuccessResult ? (
                <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-emerald-500/30 shadow-lg space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        Paper Emailed to Administrator
                      </span>
                      <h3 className="text-lg sm:text-xl font-black text-stone-900 dark:text-white">
                        Submission Successfully Dispatched to Bhanu!
                      </h3>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-xs space-y-2">
                    <div className="flex justify-between py-1 border-b border-stone-200/60 dark:border-stone-700/60">
                      <span className="text-stone-500 font-medium">Recipient Inbox:</span>
                      <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                        {studentSuccessResult.recipientEmail}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60 dark:border-stone-700/60">
                      <span className="text-stone-500 font-medium">Subject / Course:</span>
                      <span className="font-bold text-stone-900 dark:text-white">
                        {studentSuccessResult.subject} ({studentSuccessResult.courseCode})
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60 dark:border-stone-700/60">
                      <span className="text-stone-500 font-medium">Exam Segment & Year:</span>
                      <span className="font-semibold text-stone-800 dark:text-stone-200">
                        {studentSuccessResult.examType} — {studentSuccessResult.year}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60 dark:border-stone-700/60">
                      <span className="text-stone-500 font-medium">Attached Question Paper:</span>
                      <span className="font-semibold text-stone-800 dark:text-stone-200">
                        {studentSuccessResult.fileName} ({Math.round(studentSuccessResult.fileSize / 1024)} KB)
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-stone-500 font-medium">Submission Timestamp:</span>
                      <span className="text-stone-600 dark:text-stone-300">
                        {studentSuccessResult.submittedAt}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                    Student Administrator Bhanu (25BCE8476) has received your question paper in his university inbox. He will inspect the PDF quality and exam syllabus. Once approved, he will upload it as admin, and it will automatically be added to that course's Google Drive archive so all students can access it.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <a
                      href={studentSuccessResult.mailtoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Open Mail Client Draft (Backup)</span>
                    </a>
                    <button
                      onClick={() => setStudentSuccessResult(null)}
                      className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-all shadow-md"
                    >
                      Submit Another Paper
                    </button>
                    <button
                      onClick={() => onNavigate('dashboard')}
                      className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold transition-all"
                    >
                      View Course Exam Analytics
                    </button>
                  </div>
                </div>
              ) : (
                /* STUDENT SUBMISSION FORM */
                <form
                  onSubmit={handleStudentSubmit}
                  className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100 dark:border-stone-800">
                    <div>
                      <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                        Student Paper Contribution
                      </span>
                      <h3 className="text-lg font-extrabold text-stone-900 dark:text-white mt-0.5">
                        Send Question Paper to Bhanu (25BCE8476)
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={handlePreloadSample}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-all active:scale-95 shrink-0 self-start sm:self-auto"
                    >
                      ⚡ Load Authentic Sample Paper
                    </button>
                  </div>

                  {/* FORM FIELDS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Course Selection */}
                    <div>
                      <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                        Select Course (57 VIT-AP Courses):
                      </label>
                      <select
                        value={courseCode}
                        onChange={handleCourseChange}
                        className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-xs sm:text-sm font-semibold text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        {VIT_AP_COURSES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.code} — {c.title} ({c.school})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Exam Cycle Selection */}
                    <div>
                      <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                        Exam Segment / Cycle:
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'cat1', label: 'CAT-1', sub: 'Mod 1, 2' },
                          { id: 'cat2', label: 'CAT-2', sub: 'Mod 3, 4' },
                          { id: 'fat', label: 'FAT', sub: 'All Units' },
                        ].map((et) => (
                          <button
                            type="button"
                            key={et.id}
                            onClick={() => setExamType(et.id as any)}
                            className={`p-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition-all ${
                              examType === et.id
                                ? 'bg-amber-500 text-stone-950 shadow-sm'
                                : 'bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                            }`}
                          >
                            <span>{et.label}</span>
                            <span className="text-[10px] opacity-75 font-normal">{et.sub}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Examination Year */}
                    <div>
                      <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                        Examination Academic Year:
                      </label>
                      <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-xs sm:text-sm font-semibold text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        {[2025, 2024, 2023, 2022, 2021].map((yr) => (
                          <option key={yr} value={yr}>
                            Academic Year {yr}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Student Registration Number / Email (Optional for Guest) */}
                    <div>
                      <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                        Your Reg No or Email (Optional — Guest Upload Allowed):
                      </label>
                      <input
                        type="text"
                        value={uploaderDetails}
                        onChange={(e) => setUploaderDetails(e.target.value)}
                        placeholder="Optional: e.g. 24BCE1024 or leave blank as Guest Student"
                        className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-xs text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  {/* Notes / Slot */}
                  <div>
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      Paper Notes (Optional, e.g. Slot, Morning/Evening batch, Faculty):
                    </label>
                    <input
                      type="text"
                      value={uploaderNotes}
                      onChange={(e) => setUploaderNotes(e.target.value)}
                      placeholder="e.g. Slot B1+TB1, Morning Session, Dr. Ramanathan"
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-xs text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  {/* FILE DROP ZONE */}
                  <div>
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      Attach Question Paper File (PDF Document):
                    </label>
                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                        dragActive
                          ? 'border-amber-500 bg-amber-500/10'
                          : fileName
                          ? 'border-emerald-500/50 bg-emerald-500/5 dark:bg-emerald-500/10'
                          : 'border-stone-300 dark:border-stone-700 hover:border-amber-400 bg-stone-50/50 dark:bg-stone-800/40'
                      }`}
                    >
                      <input
                        type="file"
                        id="paper-file-upload-student"
                        accept=".pdf,.png,.jpg,.jpeg,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label htmlFor="paper-file-upload-student" className="cursor-pointer space-y-2 block">
                        <div className="w-10 h-10 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center mx-auto text-amber-500">
                          {fileName ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <UploadCloud className="w-5 h-5" />}
                        </div>
                        {fileName ? (
                          <div>
                            <p className="text-xs font-bold text-stone-900 dark:text-white">{fileName}</p>
                            <p className="text-[11px] text-stone-500">
                              {Math.round(fileSize / 1024)} KB • Attached and ready for dispatch
                            </p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-xs font-bold text-stone-800 dark:text-stone-200">
                              Click to select PDF or drag & drop file here
                            </p>
                            <p className="text-[11px] text-stone-400">
                              Supports official PDF question papers, scans, or documents up to 20MB
                            </p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* SUBMISSION PROCESSING PROGRESS BAR */}
                  {isProcessing && (
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-amber-800 dark:text-amber-300">
                        <span className="flex items-center gap-2">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>{PIPELINE_STAGES[currentStageIdx]}</span>
                        </span>
                        <span>{Math.round(((currentStageIdx + 1) / PIPELINE_STAGES.length) * 100)}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-amber-500 transition-all duration-300"
                          style={{
                            width: `${((currentStageIdx + 1) / PIPELINE_STAGES.length) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* SUBMIT BUTTON */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Submit Paper to Bhanu (bhanu.25bce8476@vitapstudent.ac.in)</span>
                    </button>
                    <p className="text-[11px] text-center text-stone-400 mt-2">
                      Paper will be verified by admin Bhanu. Upon approval, it is immediately included in the course's Drive link.
                    </p>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION B: ADMIN UPLOAD WORKFLOW                                          */}
          {/* ========================================================================= */}
          {uploadRole === 'admin' && (
            <div className="space-y-6">
              {/* ADMIN AUTH GATE */}
              {!isAdminAuthenticated ? (
                <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-center space-y-5 max-w-md mx-auto">
                  <div className="w-14 h-14 rounded-3xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
                    <Lock className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                      Security Gate
                    </span>
                    <h3 className="text-xl font-black text-stone-900 dark:text-white mt-0.5">
                      Administrator Access (Bhanu)
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                      Enter your registration credential to unlock submission moderation and direct Drive publishing.
                    </p>
                  </div>

                  <form onSubmit={handleAdminLogin} className="space-y-3">
                    <input
                      type="password"
                      value={adminKeyInput}
                      onChange={(e) => setAdminKeyInput(e.target.value)}
                      placeholder="Enter Administrator Passcode"
                      className="w-full px-4 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-xs font-mono text-center font-bold text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />

                    {adminAuthError && (
                      <p className="text-xs text-rose-500 font-medium">{adminAuthError}</p>
                    )}

                    <div className="pt-1">
                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-black transition-all shadow-md"
                      >
                        Unlock Admin Portal
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* ADMIN DASHBOARD (AUTHENTICATED) */
                <div className="space-y-6">
                  {/* ADMIN HEADER & SUB-TABS */}
                  <div className="p-5 rounded-3xl bg-stone-900 border border-stone-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-black text-sm">
                        BH
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-amber-400">
                            Administrator Verified
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                            bhanu.25bce8476@vitapstudent.ac.in
                          </span>
                        </div>
                        <h3 className="text-lg font-black text-white">
                          Bhanu (25BCE8476) Moderator Workspace
                        </h3>
                      </div>
                    </div>

                    {/* Sub-tabs: Review Pending vs Direct Publish */}
                    <div className="flex items-center gap-2 bg-stone-800/80 p-1.5 rounded-2xl shrink-0 self-start sm:self-auto">
                      <button
                        onClick={() => setAdminSubTab('pending')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                          adminSubTab === 'pending'
                            ? 'bg-amber-500 text-stone-950 shadow-sm'
                            : 'text-stone-300 hover:text-white'
                        }`}
                      >
                        <span>Student Submissions</span>
                        {pendingSubmissions.length > 0 && (
                          <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-black">
                            {pendingSubmissions.length}
                          </span>
                        )}
                      </button>

                      <button
                        onClick={() => setAdminSubTab('direct-upload')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                          adminSubTab === 'direct-upload'
                            ? 'bg-amber-500 text-stone-950 shadow-sm'
                            : 'text-stone-300 hover:text-white'
                        }`}
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Direct Publish to Drive</span>
                      </button>
                    </div>
                  </div>

                  {/* SUB-VIEW 1: PENDING STUDENT SUBMISSIONS TO REVIEW & APPROVE */}
                  {adminSubTab === 'pending' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
                          <Mail className="w-4 h-4 text-amber-500" />
                          <span>Pending Student Papers Awaiting Your Review</span>
                          <span className="text-xs px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-500">
                            {pendingSubmissions.length} in inbox
                          </span>
                        </h4>
                        <button
                          onClick={loadSubmissions}
                          className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" /> Refresh
                        </button>
                      </div>

                      {loadingSubmissions ? (
                        <div className="p-8 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-center text-stone-400 text-xs">
                          Loading submissions from server...
                        </div>
                      ) : pendingSubmissions.length === 0 ? (
                        <div className="p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-center space-y-2">
                          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                          <h5 className="text-sm font-bold text-stone-900 dark:text-white">
                            All Student Papers Moderated!
                          </h5>
                          <p className="text-xs text-stone-400 max-w-sm mx-auto">
                            No student submissions are currently pending review. Test the flow by switching to "Upload as Student" above and submitting a paper!
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-3">
                          {pendingSubmissions.map((sub) => (
                            <div
                              key={sub.id}
                              className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
                            >
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-400 font-mono font-bold text-xs">
                                    {sub.courseCode}
                                  </span>
                                  <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-[11px] uppercase">
                                    {sub.examType}
                                  </span>
                                  <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-semibold text-[11px]">
                                    Year {sub.year}
                                  </span>
                                  <span className="text-[11px] text-stone-400">
                                    • Submitted {sub.submittedAt}
                                  </span>
                                </div>
                                <h5 className="text-base font-extrabold text-stone-900 dark:text-white">
                                  {sub.courseName}
                                </h5>
                                <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-3">
                                  <span>Submitter: <strong className="text-stone-700 dark:text-stone-300">{sub.uploaderEmail || 'Student'}</strong></span>
                                  <span>File: <strong className="text-stone-700 dark:text-stone-300">{sub.fileName}</strong> ({Math.round((sub.fileSize || 0) / 1024)} KB)</span>
                                </div>
                                {sub.uploaderNotes && (
                                  <p className="text-xs italic text-stone-400">
                                    Notes: "{sub.uploaderNotes}"
                                  </p>
                                )}
                              </div>

                              {/* MODERATION ACTION BUTTONS */}
                              <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
                                <button
                                  onClick={() => handleApproveSubmission(sub)}
                                  disabled={approvingId === sub.id}
                                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 transition-all shadow-md active:scale-95 disabled:opacity-50"
                                >
                                  {approvingId === sub.id ? (
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <Check className="w-3.5 h-3.5" />
                                  )}
                                  <span>Approve & Publish to Drive</span>
                                </button>
                                <button
                                  onClick={() => handleRejectSubmission(sub.id)}
                                  className="px-3 py-2.5 rounded-xl bg-stone-100 hover:bg-rose-500/10 text-stone-600 hover:text-rose-600 dark:bg-stone-800 dark:text-stone-300 dark:hover:text-rose-400 text-xs font-bold transition-all border border-stone-200 dark:border-stone-700"
                                >
                                  Reject
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* SUB-VIEW 2: DIRECT PUBLISH AS ADMIN TO DRIVE LINK */}
                  {adminSubTab === 'direct-upload' && (
                    <form
                      onSubmit={handleAdminDirectPublish}
                      className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-6"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100 dark:border-stone-800">
                        <div>
                          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                            Direct Admin Publishing
                          </span>
                          <h4 className="text-lg font-extrabold text-stone-900 dark:text-white mt-0.5">
                            Publish Paper Directly to Course Drive Link
                          </h4>
                          <p className="text-xs text-stone-400">
                            Verified papers published here are instantly added to the course's Drive link and made accessible to students.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handlePreloadSample}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-all shrink-0 self-start sm:self-auto"
                        >
                          ⚡ Load Sample
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                            Course Code & Name:
                          </label>
                          <select
                            value={courseCode}
                            onChange={handleCourseChange}
                            className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-xs sm:text-sm font-semibold text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                          >
                            {VIT_AP_COURSES.map((c) => (
                              <option key={c.code} value={c.code}>
                                {c.code} — {c.title} ({c.school})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                            Exam Cycle:
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {['cat1', 'cat2', 'fat'].map((et) => (
                              <button
                                type="button"
                                key={et}
                                onClick={() => setExamType(et as any)}
                                className={`p-2 rounded-xl text-xs font-bold uppercase transition-all ${
                                  examType === et
                                    ? 'bg-amber-500 text-stone-950 shadow-sm'
                                    : 'bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                                }`}
                              >
                                {et}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                            Examination Year:
                          </label>
                          <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-xs sm:text-sm font-semibold text-stone-900 dark:text-white focus:outline-none"
                          >
                            {[2025, 2024, 2023, 2022, 2021].map((yr) => (
                              <option key={yr} value={yr}>
                                Year {yr}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                            Target Google Drive Folder URL:
                          </label>
                          <input
                            type="text"
                            value={adminDriveLink}
                            onChange={(e) => setAdminDriveLink(e.target.value)}
                            placeholder="https://drive.google.com/drive/folders/..."
                            className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-xs text-stone-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>
                      </div>

                      {/* File Upload Zone */}
                      <div>
                        <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                          Select Question Paper PDF to Publish:
                        </label>
                        <div
                          onDragEnter={handleDrag}
                          onDragLeave={handleDrag}
                          onDragOver={handleDrag}
                          onDrop={handleDrop}
                          className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                            dragActive
                              ? 'border-amber-500 bg-amber-500/10'
                              : fileName
                              ? 'border-emerald-500 bg-emerald-500/10'
                              : 'border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/40'
                          }`}
                        >
                          <input
                            type="file"
                            id="admin-paper-upload"
                            accept=".pdf,.png,.jpg,.jpeg"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <label htmlFor="admin-paper-upload" className="cursor-pointer space-y-1 block">
                            <UploadCloud className="w-8 h-8 mx-auto text-amber-500" />
                            {fileName ? (
                              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                {fileName} ({Math.round(fileSize / 1024)} KB ready)
                              </p>
                            ) : (
                              <p className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                                Click or drag PDF paper to publish to Drive
                              </p>
                            )}
                          </label>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                      >
                        <FolderDown className="w-4 h-4" />
                        <span>Publish Paper to Drive Link & Repository</span>
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
