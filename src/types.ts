export type Role = 'student';
export type ThemeMode = 'dark' | 'light';

export type ExamType = 'cat1' | 'cat2' | 'fat' | 'mid_term' | 'end_term';

export interface PriorityTopicRecommendation {
  topic: string;
  subtopic?: string;
  priorityScore: number;
  historicalFrequency: string;
  totalHistoricalMarks: number;
  expectedQuestionTypes: string[];
  keyConceptsToMaster: string[];
  reason: string;
  recommendedTimeMinutes: number;
}

export interface PaperPriorityAnalysis {
  courseCode: string;
  courseName: string;
  examType: ExamType;
  year: number;
  overallStrategy: string;
  topPriorityTopics: PriorityTopicRecommendation[];
  highYield80_20Rules: string[];
  recurringPatterns: {
    patternName: string;
    description: string;
    marksWeight: string;
  }[];
  timingStrategy: {
    partA: string;
    partB: string;
    review: string;
  };
}

export interface AvailablePyqPaper {
  id: string;
  courseName: string;
  courseCode: string;
  examType: ExamType;
  year: number;
  semester: string;
  totalQuestions: number;
  totalMarks: number;
  timeDuration: string;
  fileSize: string;
  fileName: string;
  university: string;
  topicsCovered: string[];
  isAvailableForDownload: boolean;
  driveUrl?: string;
  shortNotesUrl?: string;
  sampleQuestions: {
    number: string;
    text: string;
    marks: number;
    section?: string;
  }[];
  priorityAnalysis?: PaperPriorityAnalysis;
}

export type NavTab =
  | 'landing'
  | 'dashboard'
  | 'upload'
  | 'questions'
  | 'topics'
  | 'analytics'
  | 'examiner-insights'
  | 'weakness'
  | 'priority-matrix'
  | 'study-plan'
  | 'practice'
  | 'mock-test'
  | 'progress'
  | 'settings';


export interface User {
  id: string;
  name: string;
  email: string;
  examName: string;
  targetDate: string;
  dailyStudyHours: number;
  streakDays: number;
  isDemo?: boolean;
}

export interface Paper {
  id: string;
  userId: string;
  fileName: string;
  fileSize: number;
  year: number;
  subject: string;
  examName: string;
  totalQuestions: number;
  totalMarks: number;
  uploadedAt: string;
  status: 'uploaded' | 'processing' | 'analyzed' | 'error';
  processingStage?: string;
  processingProgress?: number;
}

export interface Question {
  id: string;
  paperId: string;
  year: number;
  subject: string;
  questionNumber: string;
  section: string;
  questionText: string;
  normalizedText: string;
  marks: number;
  pageNumber: number;
  questionType: 'Conceptual' | 'Numerical' | 'Algorithmic' | 'Comparative' | 'Design';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  subtopic: string;
  concept: string;
  confidence: number;
  isActualPyq: boolean;
  frequencyRank?: number;
  familyId?: string;
}

export interface Topic {
  id: string;
  name: string;
  subject: string;
  frequency: number;
  yearsAppearing: number[];
  totalMarks: number;
  studentAccuracy: number;
  priorityScore: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  trend: 'increasing' | 'stable' | 'decreasing';
  subtopics: string[];
  keyConcepts: string[];
  weaknessStatus: 'Critical' | 'Needs Work' | 'Strong';
}

export interface QuestionFamily {
  id: string;
  underlyingConcept: string;
  topic: string;
  subtopic: string;
  similarityScore: number;
  occurrenceCount: number;
  years: number[];
  totalMarks: number;
  canonicalQuestion: string;
  variations: {
    questionId: string;
    year: number;
    questionText: string;
    marks: number;
    isActualPyq: boolean;
    similarityToCanonical: number;
  }[];
}

export interface ExaminerInsight {
  id: string;
  title: string;
  observation: string;
  evidence: string;
  evidenceType: 'actual_data' | 'calculated';
  impact: 'High' | 'Medium' | 'Low';
  category: 'Frequency' | 'Marks Weight' | 'Trend' | 'Pattern';
  statBadge: string;
}

export interface DiagnosticQuestion {
  id: string;
  topic: string;
  subtopic: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  basedOnYear?: number;
  isActualPyq: boolean;
}

export interface DiagnosticResult {
  attemptId: string;
  totalQuestions: number;
  correctCount: number;
  accuracy: number;
  timeSpentSeconds: number;
  topicScores: {
    topic: string;
    attempted: number;
    correct: number;
    accuracy: number;
    status: 'Strong' | 'Needs Work' | 'Critical';
  }[];
  weakestTopics: string[];
  strongestTopics: string[];
  date: string;
}

export interface PriorityItem {
  topic: string;
  priorityScore: number; // 0-100
  frequencyScore: number;
  weaknessScore: number;
  marksScore: number;
  recencyScore: number;
  recurrenceScore: number;
  frequencyCount: number;
  yearsAppeared: string;
  historicalMarks: number;
  studentAccuracy: number;
  recommendation: string;
  whyReasons: string[];
  estimatedStudyTimeMinutes: number;
  quadrant: 'STUDY FIRST' | 'MAINTAIN' | 'SECONDARY' | 'LOW PRIORITY';
}

export interface StudyTask {
  id: string;
  title: string;
  topic: string;
  concept: string;
  durationMinutes: number;
  type: 'Concept Review' | 'PYQ Solving' | 'Practice Drill' | 'Mini-test' | 'Quick Revision';
  completed: boolean;
  skipped: boolean;
  priorityScore: number;
  reason: string;
}

export interface StudyPlanDay {
  dayNumber: number;
  dateStr: string;
  theme: string;
  totalMinutes: number;
  priorityScore: number;
  reason: string;
  tasks: StudyTask[];
}

export interface PracticeQuestion {
  id: string;
  topic: string;
  subtopic: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  marks: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  sourceType: 'ACTUAL PYQ' | 'AI-GENERATED PRACTICE';
  year?: number;
}

export interface MockTestConfig {
  questionCount: number;
  durationMinutes: number;
  difficulty: 'All' | 'Easy' | 'Medium' | 'Hard';
  topics: string[];
  mode: 'Weak + High-Frequency' | 'Standard Full Syllabus' | 'Custom';
}

export interface MockTestQuestion extends PracticeQuestion {
  userSelectedOption?: number;
  isMarkedForReview?: boolean;
}

export interface MockTestResult {
  id: string;
  title: string;
  date: string;
  totalQuestions: number;
  attempted: number;
  correctCount: number;
  score: number;
  maxScore: number;
  accuracy: number;
  timeSpentSeconds: number;
  topicBreakdown: {
    topic: string;
    total: number;
    correct: number;
    accuracy: number;
  }[];
  weakConceptsIdentified: string[];
  historicalComparison: string;
  recommendedRevision: string[];
}

export interface ProgressMetrics {
  preparationScore: number;
  preparationImprovement: number;
  studyStreakDays: number;
  studyHoursLogged: number;
  questionsSolved: number;
  overallAccuracy: number;
  topicsCompleted: number;
  totalTopics: number;
  studyPlanCompletionPct: number;
  readinessSummary: {
    strongCount: number;
    needsWorkCount: number;
    criticalCount: number;
  };
  accuracyTrend: {
    date: string;
    accuracy: number;
    questionsCount: number;
  }[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'reminder' | 'analysis' | 'priority' | 'streak' | 'milestone';
}
