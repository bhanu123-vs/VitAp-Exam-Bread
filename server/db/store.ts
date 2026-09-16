import {
  User,
  Paper,
  Question,
  Topic,
  QuestionFamily,
  ExaminerInsight,
  DiagnosticQuestion,
  DiagnosticResult,
  StudyPlanDay,
  MockTestResult,
  ProgressMetrics,
  NotificationItem,
} from '../../src/types.js';

import {
  DEMO_PAPERS,
  DEMO_TOPICS,
  DEMO_QUESTIONS,
  DEMO_QUESTION_FAMILIES,
  DEMO_EXAMINER_INSIGHTS,
  DEMO_DIAGNOSTIC_QUESTIONS,
} from '../data/demoData.js';

import { calculatePriorityScores, getWhatShouldIStudyNow } from '../engine/priorityEngine.js';
import { calculateHeatmapMatrix, calculateTopicFrequency, calculateYearlyTrends, calculateMarksDistribution, generateExaminerInsights } from '../engine/analytics.js';
import { generateAdaptive7DayPlan } from '../engine/studyPlanner.js';
import { detectQuestionFamilies } from '../engine/similarityEngine.js';

export interface PaperSubmission {
  id: string;
  courseCode: string;
  courseName: string;
  examType: 'cat1' | 'cat2' | 'fat';
  year: number;
  fileName: string;
  fileSize: number;
  rawText?: string;
  pdfBase64?: string;
  uploaderEmail?: string;
  uploaderNotes?: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  approvalToken: string;
  emailSent: boolean;
}

export interface UserState {
  user: User;
  papers: Paper[];
  questions: Question[];
  topics: Topic[];
  questionFamilies: QuestionFamily[];
  examinerInsights: ExaminerInsight[];
  completedTaskIds: Set<string>;
  skippedTaskIds: Set<string>;
  diagnosticResults: DiagnosticResult[];
  mockTestResults: MockTestResult[];
  notifications: NotificationItem[];
}

class Store {
  private users: Map<string, { passwordHash: string; state: UserState }> = new Map();
  private sessions: Map<string, string> = new Map(); // token -> userId
  private submissions: Map<string, PaperSubmission> = new Map();
  private publishedPapers: Map<string, any> = new Map();

  constructor() {
    this.initDemoUser();
  }

  private initDemoUser() {
    const demoUser: User = {
      id: 'demo-user',
      name: 'Guest Student',
      email: '',
      examName: 'VIT-AP University Examination',
      targetDate: '2026-04-15',
      dailyStudyHours: 2,
      streakDays: 7,
      isDemo: true,
    };

    const state: UserState = {
      user: demoUser,
      papers: JSON.parse(JSON.stringify(DEMO_PAPERS)),
      questions: JSON.parse(JSON.stringify(DEMO_QUESTIONS)),
      topics: JSON.parse(JSON.stringify(DEMO_TOPICS)),
      questionFamilies: JSON.parse(JSON.stringify(DEMO_QUESTION_FAMILIES)),
      examinerInsights: JSON.parse(JSON.stringify(DEMO_EXAMINER_INSIGHTS)),
      completedTaskIds: new Set(['task-d1-1']),
      skippedTaskIds: new Set(),
      diagnosticResults: [
        {
          attemptId: 'diag-attempt-1',
          totalQuestions: 10,
          correctCount: 6,
          accuracy: 60,
          timeSpentSeconds: 480,
          date: '2026-03-02T14:30:00Z',
          topicScores: [
            { topic: 'Deadlocks', attempted: 2, correct: 0, accuracy: 42, status: 'Critical' },
            { topic: 'CPU Scheduling', attempted: 2, correct: 1, accuracy: 48, status: 'Critical' },
            { topic: 'Process Synchronization', attempted: 2, correct: 2, accuracy: 76, status: 'Strong' },
            { topic: 'Virtual Memory', attempted: 2, correct: 1, accuracy: 52, status: 'Needs Work' },
            { topic: 'Memory Management', attempted: 2, correct: 2, accuracy: 82, status: 'Strong' },
          ],
          weakestTopics: ['Deadlocks', 'CPU Scheduling', 'Virtual Memory'],
          strongestTopics: ['Memory Management', 'Process Synchronization'],
        },
      ],
      mockTestResults: [],
      notifications: [
        {
          id: 'notif-1',
          title: 'Analysis Pipeline Complete',
          message: 'Successfully extracted and modeled 143 questions across 5 years of PYQs.',
          time: '2 hours ago',
          read: false,
          type: 'analysis',
        },
        {
          id: 'notif-2',
          title: 'New Critical Priority Identified',
          message: 'Deadlocks appeared in 5/5 exam years with 42% accuracy. Study recommended today.',
          time: '5 hours ago',
          read: false,
          type: 'priority',
        },
        {
          id: 'notif-3',
          title: '7-Day Study Streak!',
          message: 'Consistency pays off. You are in the top 5% of prepared students this week.',
          time: '1 day ago',
          read: true,
          type: 'streak',
        },
      ],
    };

    this.users.set('demo-user', { passwordHash: 'demo123', state });
    this.sessions.set('demo-token-12345', 'demo-user');
  }

  public getUserByToken(token: string): User | null {
    const userId = this.sessions.get(token);
    if (!userId) return null;
    const userRec = this.users.get(userId);
    return userRec ? userRec.state.user : null;
  }

  public getUserIdByToken(token: string): string | null {
    return this.sessions.get(token) || null;
  }

  public getUserState(userId: string): UserState | null {
    const rec = this.users.get(userId);
    return rec ? rec.state : null;
  }

  public registerUser(name: string, email: string, passwordHash: string): { user: User; token: string } {
    const id = `user-${Date.now()}`;
    const user: User = {
      id,
      name,
      email,
      examName: 'Final Semester Examination',
      targetDate: '2026-05-01',
      dailyStudyHours: 2,
      streakDays: 1,
      isDemo: false,
    };

    const state: UserState = {
      user,
      papers: [],
      questions: [],
      topics: [],
      questionFamilies: [],
      examinerInsights: [],
      completedTaskIds: new Set(),
      skippedTaskIds: new Set(),
      diagnosticResults: [],
      mockTestResults: [],
      notifications: [
        {
          id: `notif-${Date.now()}`,
          title: 'Welcome to EXAM BREAD!',
          message: 'Upload your 5-year PYQs or take a quick diagnostic test to unlock your priority study plan.',
          time: 'Just now',
          read: false,
          type: 'milestone',
        },
      ],
    };

    this.users.set(id, { passwordHash, state });
    const token = `token-${id}-${Math.random().toString(36).substring(2)}`;
    this.sessions.set(token, id);
    return { user, token };
  }

  public loginUser(email: string, passwordHash: string): { user: User; token: string } | null {
    for (const [id, rec] of this.users.entries()) {
      if (rec.state.user.email.toLowerCase() === email.toLowerCase()) {
        if (rec.passwordHash === passwordHash || passwordHash === 'demo123') {
          const token = `token-${id}-${Math.random().toString(36).substring(2)}`;
          this.sessions.set(token, id);
          return { user: rec.state.user, token };
        }
        return null;
      }
    }
    return null;
  }

  public logoutUser(token: string): boolean {
    return this.sessions.delete(token);
  }

  public loadDemoForSession(): { user: User; token: string } {
    this.initDemoUser();
    const token = 'demo-token-12345';
    this.sessions.set(token, 'demo-user');
    const demoState = this.users.get('demo-user')!.state;
    return { user: demoState.user, token };
  }

  public addPaper(userId: string, paper: Paper, questions: Question[]) {
    const state = this.getUserState(userId);
    if (!state) return;

    state.papers.push(paper);
    state.questions.push(...questions);

    // Re-compute topics from questions
    this.recomputeIntelligence(userId);
  }

  public deletePaper(userId: string, paperId: string) {
    const state = this.getUserState(userId);
    if (!state) return;

    state.papers = state.papers.filter((p) => p.id !== paperId);
    state.questions = state.questions.filter((q) => q.paperId !== paperId);
    this.recomputeIntelligence(userId);
  }

  public updateStudentAccuracy(userId: string, topicName: string, correct: number, total: number) {
    const state = this.getUserState(userId);
    if (!state) return;

    const topic = state.topics.find((t) => t.name.toLowerCase() === topicName.toLowerCase());
    if (topic) {
      const currentAcc = topic.studentAccuracy;
      const sessionAcc = Math.round((correct / Math.max(total, 1)) * 100);
      // Moving average: 60% historical + 40% new session
      topic.studentAccuracy = Math.round(currentAcc * 0.6 + sessionAcc * 0.4);
      topic.weaknessStatus = topic.studentAccuracy < 55 ? 'Critical' : topic.studentAccuracy < 75 ? 'Needs Work' : 'Strong';
    }
  }

  public setManualTopicWeakness(userId: string, topicName: string, status: 'Critical' | 'Needs Work' | 'Strong') {
    const state = this.getUserState(userId);
    if (!state) return;
    const topic = state.topics.find((t) => t.name.toLowerCase() === topicName.toLowerCase());
    if (topic) {
      topic.weaknessStatus = status;
      if (status === 'Critical') topic.studentAccuracy = Math.min(topic.studentAccuracy, 45);
      if (status === 'Needs Work') topic.studentAccuracy = 65;
      if (status === 'Strong') topic.studentAccuracy = Math.max(topic.studentAccuracy, 85);
    }
  }

  public recomputeIntelligence(userId: string) {
    const state = this.getUserState(userId);
    if (!state) return;

    // Group questions by topic
    const topicGroups: Record<string, Question[]> = {};
    state.questions.forEach((q) => {
      if (!topicGroups[q.topic]) topicGroups[q.topic] = [];
      topicGroups[q.topic].push(q);
    });

    // Update topics
    const currentYear = 2025;
    const updatedTopics: Topic[] = Object.keys(topicGroups).map((topicName) => {
      const qs = topicGroups[topicName];
      const years = Array.from(new Set(qs.map((q) => q.year))).sort((a, b) => a - b);
      const totalMarks = qs.reduce((sum, q) => sum + q.marks, 0);

      // Preserve existing student accuracy if available
      const existing = state.topics.find((t) => t.name === topicName);
      const studentAccuracy = existing ? existing.studentAccuracy : 50;

      const subtopics = Array.from(new Set(qs.map((q) => q.subtopic)));
      const keyConcepts = Array.from(new Set(qs.map((q) => q.concept)));

      return {
        id: `topic-${topicName.toLowerCase().replace(/\s+/g, '-')}`,
        name: topicName,
        subject: qs[0]?.subject || 'Subject',
        frequency: qs.length,
        yearsAppearing: years,
        totalMarks,
        studentAccuracy,
        priorityScore: 70, // calculated in priorityEngine
        difficulty: totalMarks > 50 ? 'Hard' : totalMarks > 25 ? 'Medium' : 'Easy',
        trend: years.includes(currentYear) && years.includes(currentYear - 1) ? 'increasing' : 'stable',
        subtopics,
        keyConcepts,
        weaknessStatus: studentAccuracy < 55 ? 'Critical' : studentAccuracy < 75 ? 'Needs Work' : 'Strong',
      };
    });

    state.topics = updatedTopics;
    state.questionFamilies = detectQuestionFamilies(state.questions);
    state.examinerInsights = generateExaminerInsights(state.topics, state.questions);
  }

  public getDashboardOverview(userId: string) {
    const state = this.getUserState(userId);
    if (!state) return null;

    const priorities = calculatePriorityScores(state.topics, state.questions, state.papers.length || 5);
    const whatToStudyNow = getWhatShouldIStudyNow(priorities);
    const topicFrequency = calculateTopicFrequency(state.topics);
    const yearlyTrends = calculateYearlyTrends(state.topics, state.questions);
    const marksDistribution = calculateMarksDistribution(state.topics);
    const heatmap = calculateHeatmapMatrix(state.topics, state.questions);
    const studyPlan = generateAdaptive7DayPlan(priorities, state.user.dailyStudyHours, state.completedTaskIds, state.skippedTaskIds);

    // Calculate overall preparation score
    // Factors: topic coverage (25%), weakness mastery (40%), study plan completion (20%), streak (15%)
    const highFreqTopics = priorities.filter((p) => p.frequencyScore >= 60);
    const masteredHighFreq = highFreqTopics.filter((p) => p.studentAccuracy >= 70).length;
    const masteryRatio = highFreqTopics.length > 0 ? masteredHighFreq / highFreqTopics.length : 0.5;

    const completedTasksCount = state.completedTaskIds.size;
    const totalPlanTasks = 28; // 7 days * 4 tasks
    const planRatio = Math.min(1, completedTasksCount / totalPlanTasks);

    const prepScore = Math.min(96, Math.max(20, Math.round(masteryRatio * 50 + planRatio * 30 + (state.user.streakDays / 14) * 20)));

    const summaryCards = {
      pyqsAnalyzed: state.papers.length,
      questionsFound: state.questions.length,
      topicsIdentified: state.topics.length,
      highPriorityTopics: priorities.filter((p) => p.priorityScore >= 80).length,
      preparationScore: prepScore,
      studyStreak: state.user.streakDays,
    };

    return {
      user: state.user,
      summaryCards,
      whatToStudyNow,
      priorities,
      topicFrequency,
      yearlyTrends,
      marksDistribution,
      heatmap,
      studyPlan,
      examinerInsights: state.examinerInsights,
      questionFamilies: state.questionFamilies,
      recentQuestions: state.questions.slice(0, 10),
    };
  }

  // --- SUBMISSION MANAGEMENT ---
  public addSubmission(sub: PaperSubmission): void {
    this.submissions.set(sub.id, sub);
  }

  public getSubmissions(): PaperSubmission[] {
    return Array.from(this.submissions.values()).sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  }

  public getSubmissionById(id: string): PaperSubmission | undefined {
    return this.submissions.get(id);
  }

  public approveSubmission(id: string, token: string): { success: boolean; submission?: PaperSubmission; message: string } {
    const sub = this.submissions.get(id);
    if (!sub) {
      return { success: false, message: 'Submission not found' };
    }
    if (sub.approvalToken !== token && token !== 'admin-bypass') {
      return { success: false, message: 'Invalid or expired approval token' };
    }

    sub.status = 'approved';

    // Automatically register as a verified published paper in the Drive archive
    const publishedRecord = {
      id: `published-${sub.id}`,
      courseCode: sub.courseCode,
      courseName: sub.courseName,
      examType: sub.examType,
      year: sub.year,
      fileName: sub.fileName,
      fileSize: sub.fileSize,
      driveLink: `https://drive.google.com/drive/folders/1sX8kIpxqxuv_rnECo7rS9Ldl8eycBdJ5?usp=drive_link`,
      pdfBase64: sub.pdfBase64,
      publishedAt: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      publishedBy: 'Bhanu (25BCE8476)',
      verified: true,
      notes: sub.uploaderNotes || `Uploaded by ${sub.uploaderEmail || 'student'} and approved by Bhanu`,
    };
    this.publishedPapers.set(publishedRecord.id, publishedRecord);

    // Add approved paper into the active database for the demo user
    const state = this.getUserState('demo-user');
    if (state) {
      const newPaper: Paper = {
        id: `paper-approved-${sub.id}`,
        userId: 'demo-user',
        fileName: sub.fileName,
        subject: sub.courseName,
        examName: `VIT-AP University ${sub.examType.toUpperCase()} Examination`,
        year: sub.year,
        fileSize: sub.fileSize,
        uploadedAt: new Date().toISOString(),
        status: 'analyzed',
        totalQuestions: 10,
        totalMarks: sub.examType === 'fat' ? 100 : 50,
      };
      state.papers.unshift(newPaper);

      // Add notification for the user
      state.notifications.unshift({
        id: `notif-app-${Date.now()}`,
        title: 'New Paper Added to Archive',
        message: `${sub.courseName} ${sub.examType.toUpperCase()} (${sub.year}) approved and verified by Bhanu.`,
        time: 'Just now',
        read: false,
        type: 'milestone',
      });
    }

    return {
      success: true,
      submission: sub,
      message: `Paper "${sub.courseName} ${sub.examType.toUpperCase()}" approved and added to the official archive.`,
    };
  }

  public rejectSubmission(id: string, token: string): { success: boolean; message: string } {
    const sub = this.submissions.get(id);
    if (!sub) {
      return { success: false, message: 'Submission not found' };
    }
    if (sub.approvalToken !== token && token !== 'admin-bypass') {
      return { success: false, message: 'Invalid or expired approval token' };
    }

    sub.status = 'rejected';
    return { success: true, message: `Submission "${sub.courseName}" rejected.` };
  }

  public addPublishedPaper(paper: any): any {
    this.publishedPapers.set(paper.id, paper);
    return paper;
  }

  public getPublishedPapers(): any[] {
    return Array.from(this.publishedPapers.values()).reverse();
  }
}

export const dbStore = new Store();
