import React, { useState, useEffect } from 'react';
import {
  NavTab,
  User,
  Paper,
  Question,
  Topic,
  QuestionFamily,
  PriorityItem,
  StudyPlanDay,
  ExaminerInsight,
  ProgressMetrics,
  NotificationItem,
} from './types.js';
import { api } from './services/api.js';

// Layout components
import { Navigation } from './components/Navigation.js';
import { Header } from './components/Header.js';

// Views
import { LandingPage } from './components/LandingPage.js';
import { DashboardView } from './components/DashboardView.js';
import { UploadPyqView } from './components/UploadPyqView.js';
import { QuestionsView } from './components/QuestionsView.js';
import { AnalyticsView } from './components/AnalyticsView.js';
import { PriorityMatrixView } from './components/PriorityMatrixView.js';
import { StudyPlanView } from './components/StudyPlanView.js';
import { PracticeView } from './components/PracticeView.js';
import { MockTestView } from './components/MockTestView.js';
import { WeaknessView } from './components/WeaknessView.js';
import { ExaminerInsightsView } from './components/ExaminerInsightsView.js';
import { TopicsView } from './components/TopicsView.js';
import { ProgressView } from './components/ProgressView.js';
import { SettingsView } from './components/SettingsView.js';

// Modals & Drawers
import { DiagnosticModal } from './components/DiagnosticModal.js';
import { AiAssistantDrawer } from './components/AiAssistantDrawer.js';
import { GlobalSearchModal } from './components/GlobalSearchModal.js';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<NavTab>('landing');
  const [loading, setLoading] = useState<boolean>(true);

  // State data
  const [papers, setPapers] = useState<Paper[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [questionFamilies, setQuestionFamilies] = useState<QuestionFamily[]>([]);
  const [priorities, setPriorities] = useState<PriorityItem[]>([]);
  const [studyPlan, setStudyPlan] = useState<StudyPlanDay[]>([]);
  const [completedTaskCount, setCompletedTaskCount] = useState<number>(14);
  const [insights, setInsights] = useState<ExaminerInsight[]>([]);
  const [progressMetrics, setProgressMetrics] = useState<ProgressMetrics | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [summaryStats, setSummaryStats] = useState<any>({
    totalPapers: 5,
    totalQuestions: 143,
    totalTopics: 31,
    preparationScore: 68,
    criticalWeaknessesCount: 2,
    highYieldTopicsCount: 8,
    daysToExam: 34,
  });

  // Analytics view data
  const [topicFrequency, setTopicFrequency] = useState<any[]>([]);
  const [yearlyTrends, setYearlyTrends] = useState<any[]>([]);
  const [marksDistribution, setMarksDistribution] = useState<any[]>([]);
  const [heatmap, setHeatmap] = useState<any[]>([]);

  // Weakness data
  const [weaknesses, setWeaknesses] = useState<any[]>([]);

  // Modals & interactive flows
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState<boolean>(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [practiceTopic, setPracticeTopic] = useState<string | undefined>(undefined);

  // Initialize application data
  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    try {
      setLoading(true);
      const summary = await api.getSummary();
      setUser(summary.user);
      setSummaryStats(summary.stats);
      setPriorities(summary.topPriorities || []);
      setInsights(summary.examinerInsights || []);
      setStudyPlan(summary.studyPlanDays || []);

      if (summary.user) {
        await refreshAllData();
      }
    } catch (e) {
      console.error('Error initializing app:', e);
    } finally {
      setLoading(false);
    }
  };

  const refreshAllData = async () => {
    try {
      const [
        papersRes,
        questionsRes,
        topicsRes,
        analyticsRes,
        matrixRes,
        planRes,
        weaknessesRes,
        progressRes,
        notifsRes,
      ] = await Promise.all([
        api.getPapers(),
        api.getQuestions(),
        api.getTopics(),
        api.getAnalytics(),
        api.getPriorityMatrix(),
        api.getStudyPlan(),
        api.getWeaknesses(),
        api.getProgress(),
        api.getNotifications(),
      ]);

      setPapers(papersRes.papers || []);
      setQuestions(questionsRes.questions || []);
      setTopics(topicsRes.topics || []);
      setTopicFrequency(analyticsRes.topicFrequency || []);
      setYearlyTrends(analyticsRes.yearlyTrends || []);
      setMarksDistribution(analyticsRes.marksDistribution || []);
      setHeatmap(analyticsRes.heatmap || []);
      setQuestionFamilies(analyticsRes.questionFamilies || []);
      setPriorities(matrixRes.priorities || []);
      setStudyPlan(planRes.plan || []);
      setCompletedTaskCount(planRes.completedTasksCount || 14);
      setWeaknesses(weaknessesRes.weaknesses || []);
      setProgressMetrics(progressRes.metrics || null);
      setNotifications(notifsRes.notifications || []);
    } catch (err) {
      console.error('Error refreshing intelligence data:', err);
    }
  };

  const handleLaunchDemo = async () => {
    setLoading(true);
    try {
      const res = await api.loadDemo();
      setUser(res.user);
      await refreshAllData();
      setActiveTab('dashboard');
    } catch (e) {
      console.error('Error loading demo:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleStartPracticeTopic = (topicName: string) => {
    setPracticeTopic(topicName);
    setActiveTab('practice');
  };

  const handleToggleTask = async (taskId: string) => {
    try {
      const res = await api.toggleTask(taskId);
      setStudyPlan(res.plan);
      setCompletedTaskCount(res.completedTasksCount);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSkipTask = async (taskId: string) => {
    try {
      const res = await api.skipTask(taskId);
      setStudyPlan(res.plan);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateDailyHours = async (hours: number) => {
    try {
      const res = await api.updateDailyHours(hours);
      setStudyPlan(res.plan);
      if (user) setUser({ ...user, dailyStudyHours: hours });
    } catch (e) {
      console.error(e);
    }
  };

  const handleRegeneratePlan = async () => {
    try {
      const res = await api.regenerateStudyPlan();
      setStudyPlan(res.plan);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateWeaknessStatus = async (
    topicName: string,
    status: 'Critical' | 'Needs Work' | 'Strong'
  ) => {
    try {
      const res = await api.updateWeaknessStatus(topicName, status);
      setWeaknesses(res.weaknesses);
      await refreshAllData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateSettings = async (payload: any) => {
    try {
      const res = await api.updateSettings(payload);
      setUser(res.user);
      await refreshAllData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectSearchResult = (type: 'question' | 'topic' | 'insight', data: any) => {
    if (type === 'topic') {
      handleStartPracticeTopic(data);
    } else if (type === 'question') {
      setActiveTab('questions');
    } else if (type === 'insight') {
      setActiveTab('examiner-insights');
    }
  };

  // Render Landing Page if activeTab === 'landing'
  if (activeTab === 'landing') {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans antialiased selection:bg-amber-500 selection:text-stone-950 transition-colors duration-200">
        <LandingPage
          onGetStarted={() => {
            if (!user) handleLaunchDemo();
            setActiveTab('upload');
          }}
          onTryDemo={handleLaunchDemo}
          onUploadPyps={() => {
            if (!user) handleLaunchDemo();
            setActiveTab('upload');
          }}
          onAnalyzePaper={async (paper) => {
            if (!user) await handleLaunchDemo();
            const questionsText = paper.sampleQuestions
              .map((q) => `Q${q.number}: ${q.text} [${q.marks} Marks]`)
              .join('\n');
            await api.uploadPaper({
              fileName: paper.fileName,
              year: paper.year,
              subject: paper.courseName,
              examName: `${paper.courseName} ${paper.examType === 'mid_term' ? 'Mid-Term' : 'End-Term'} Exam`,
              rawText: questionsText,
              fileSize: 2200000,
            });
            await refreshAllData();
            setActiveTab('questions');
          }}
          onDirectUpload={async (payload) => {
            if (!user) await handleLaunchDemo();
            await api.uploadPaper({
              fileName: payload.fileName,
              year: payload.year,
              subject: payload.courseName,
              examName: `${payload.courseName} ${payload.examType === 'mid_term' ? 'Mid-Term' : 'End-Term'} Exam`,
              rawText: payload.rawText,
              fileSize: 2000000,
            });
            await refreshAllData();
            setActiveTab('upload');
          }}
        />
        {/* Global Search Modal */}
        <GlobalSearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          questions={questions}
          topics={topics}
          insights={insights}
          onSelectResult={handleSelectSearchResult}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans antialiased flex flex-col selection:bg-amber-500 selection:text-stone-950 transition-colors duration-200">
      {/* Top Header */}
      <Header
        user={user}
        onOpenSearch={() => setIsSearchOpen(true)}
        onToggleAi={() => setIsAiAssistantOpen(true)}
        onLoadDemo={handleLaunchDemo}
        notifications={notifications}
        onMarkNotificationRead={async (id) => {
          await api.markNotificationRead(id);
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
          );
        }}
        activeExamTitle={user?.examName || 'Operating Systems (CS301)'}
        onNavigateHome={() => setActiveTab('landing')}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <Navigation
          currentTab={activeTab}
          onSelectTab={(tab: any) => {
            if (tab === 'practice') setPracticeTopic(undefined);
            setActiveTab(tab);
          }}
          user={user}
          onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 pb-24 md:pb-8">
          {activeTab === 'dashboard' && (
            <DashboardView
              user={user}
              summaryCards={{
                pyqsAnalyzed: summaryStats.totalPapers,
                questionsFound: summaryStats.totalQuestions,
                topicsIdentified: summaryStats.totalTopics,
                highPriorityTopics: summaryStats.highYieldTopicsCount,
                preparationScore: summaryStats.preparationScore,
                studyStreak: user?.streakDays || 5,
              }}
              whatToStudyNow={{
                topic: priorities[0]?.topic || 'Deadlocks',
                reason: 'High Exam Frequency (18 Questions) + 42% Student Weakness',
                priorityScore: priorities[0]?.priorityScore || 92,
                estimatedMinutes: 45,
              }}
              topPriorities={priorities}
              examinerInsights={insights}
              todayTasks={studyPlan[0]?.tasks || []}
              recentQuestions={questions.slice(0, 5)}
              onNavigate={(tab: any) => setActiveTab(tab)}
              onStartStudy={handleStartPracticeTopic}
              onToggleTask={handleToggleTask}
              onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
            />
          )}

          {activeTab === 'upload' && (
            <UploadPyqView
              papers={papers}
              onUpload={async (payload) => {
                await api.uploadPaper(payload);
                await refreshAllData();
              }}
              onDeletePaper={async (id) => {
                await api.deletePaper(id);
                await refreshAllData();
              }}
              onNavigate={(tab: any) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'questions' && (
            <QuestionsView
              questions={questions}
              families={questionFamilies}
              onStartPracticeTopic={handleStartPracticeTopic}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              topicFrequency={topicFrequency}
              yearlyTrends={yearlyTrends}
              marksDistribution={marksDistribution}
              heatmap={heatmap}
              questionFamilies={questionFamilies}
              onNavigateToTopic={handleStartPracticeTopic}
            />
          )}

          {activeTab === 'priority-matrix' && (
            <PriorityMatrixView
              priorities={priorities}
              onStartStudy={handleStartPracticeTopic}
            />
          )}

          {activeTab === 'study-plan' && (
            <StudyPlanView
              plan={studyPlan}
              dailyHours={user?.dailyStudyHours || 2}
              completedCount={completedTaskCount}
              onUpdateDailyHours={handleUpdateDailyHours}
              onToggleTask={handleToggleTask}
              onSkipTask={handleSkipTask}
              onRegeneratePlan={handleRegeneratePlan}
              onStartPracticeTopic={handleStartPracticeTopic}
            />
          )}

          {activeTab === 'practice' && (
            <PracticeView
              initialTopic={practiceTopic}
              onRefreshAccuracy={async () => {
                await refreshAllData();
              }}
            />
          )}

          {activeTab === 'mock-test' && (
            <MockTestView
              onTestCompleted={async () => {
                await refreshAllData();
              }}
            />
          )}

          {activeTab === 'weakness' && (
            <WeaknessView
              weaknesses={weaknesses}
              onUpdateStatus={handleUpdateWeaknessStatus}
              onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
              onStartPractice={handleStartPracticeTopic}
            />
          )}

          {activeTab === 'examiner-insights' && (
            <ExaminerInsightsView
              insights={insights}
              onStartStudyTopic={handleStartPracticeTopic}
            />
          )}

          {activeTab === 'topics' && (
            <TopicsView
              topics={topics}
              onSelectTopic={(tName) => {
                setActiveTab('questions');
              }}
              onPracticeTopic={handleStartPracticeTopic}
            />
          )}

          {activeTab === 'progress' && (
            <ProgressView
              metrics={
                progressMetrics || {
                  overallAccuracy: 68,
                  preparationScore: 68,
                  preparationImprovement: 20,
                  questionsSolved: 64,
                  studyHoursLogged: 12.5,
                  studyStreakDays: 5,
                  topicsCompleted: 6,
                  totalTopics: 31,
                  studyPlanCompletionPct: 50,
                  accuracyTrend: [
                    { date: 'Day 1', accuracy: 48, questionsCount: 10 },
                    { date: 'Day 2', accuracy: 52, questionsCount: 15 },
                    { date: 'Day 3', accuracy: 58, questionsCount: 12 },
                    { date: 'Day 4', accuracy: 63, questionsCount: 18 },
                    { date: 'Day 5', accuracy: 68, questionsCount: 9 },
                  ],
                  readinessSummary: {
                    strongCount: 3,
                    needsWorkCount: 2,
                    criticalCount: 2,
                  },
                }
              }
              onNavigateToPlan={() => setActiveTab('study-plan')}
              onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              user={user}
              onUpdateSettings={handleUpdateSettings}
              onLoadDemo={handleLaunchDemo}
            />
          )}

          {/* Safe Tab Fallback if tab is unrecognized or resets */}
          {!['dashboard', 'upload', 'questions', 'topics', 'analytics', 'examiner-insights', 'weakness', 'priority-matrix', 'study-plan', 'practice', 'mock-test', 'progress', 'settings'].includes(activeTab) && (
            <DashboardView
              user={user}
              summaryCards={{
                pyqsAnalyzed: summaryStats.totalPapers,
                questionsFound: summaryStats.totalQuestions,
                topicsIdentified: summaryStats.totalTopics,
                highPriorityTopics: summaryStats.highYieldTopicsCount,
                preparationScore: summaryStats.preparationScore,
                studyStreak: user?.streakDays || 5,
              }}
              whatToStudyNow={{
                topic: priorities[0]?.topic || 'Deadlocks',
                reason: 'High Exam Frequency (18 Questions) + 42% Student Weakness',
                priorityScore: priorities[0]?.priorityScore || 92,
                estimatedMinutes: 45,
              }}
              topPriorities={priorities}
              examinerInsights={insights}
              todayTasks={studyPlan[0]?.tasks || []}
              recentQuestions={questions.slice(0, 5)}
              onNavigate={(tab: any) => setActiveTab(tab)}
              onStartStudy={handleStartPracticeTopic}
              onToggleTask={handleToggleTask}
              onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Interactive Global Modals & Drawers */}
      <DiagnosticModal
        isOpen={isDiagnosticOpen}
        onClose={() => setIsDiagnosticOpen(false)}
        onCompleted={async () => {
          await refreshAllData();
        }}
      />

      <AiAssistantDrawer
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
      />

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        questions={questions}
        topics={topics}
        insights={insights}
        onSelectResult={handleSelectSearchResult}
      />
    </div>
  );
}
