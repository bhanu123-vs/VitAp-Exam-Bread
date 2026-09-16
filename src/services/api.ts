// API client for EXAM BREAD

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('exam_bread_token') || 'demo-token-12345';
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export const api = {
  // Auth
  async register(name: string, email: string, password: string) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    return res.json();
  },

  async login(email: string, password: string) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  async getMe() {
    const res = await fetch('/api/auth/me', {
      headers: getAuthHeader(),
    });
    return res.json();
  },

  async logout() {
    const res = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: getAuthHeader(),
    });
    localStorage.removeItem('exam_bread_token');
    return res.json();
  },

  async loadDemo() {
    const res = await fetch('/api/demo/load', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('exam_bread_token', data.token);
    }
    return data;
  },

  // Dashboard & Analytics
  async getDashboardOverview() {
    const res = await fetch('/api/analytics/overview', {
      headers: getAuthHeader(),
    });
    return res.json();
  },

  async getFrequency() {
    const res = await fetch('/api/analytics/frequency', {
      headers: getAuthHeader(),
    });
    return res.json();
  },

  async getTrends() {
    const res = await fetch('/api/analytics/trends', {
      headers: getAuthHeader(),
    });
    return res.json();
  },

  async getHeatmap() {
    const res = await fetch('/api/analytics/heatmap', {
      headers: getAuthHeader(),
    });
    return res.json();
  },

  async getExaminerInsights() {
    const res = await fetch('/api/analytics/examiner-insights', {
      headers: getAuthHeader(),
    });
    return res.json();
  },

  async getQuestionFamilies() {
    const res = await fetch('/api/question-families', {
      headers: getAuthHeader(),
    });
    return res.json();
  },

  // Papers
  async getPapers() {
    const res = await fetch('/api/papers', {
      headers: getAuthHeader(),
    });
    return res.json();
  },

  async uploadPaper(payload: {
    fileName: string;
    year: number;
    subject: string;
    examName: string;
    rawText: string;
    fileSize: number;
  }) {
    const res = await fetch('/api/papers/upload', {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async deletePaper(paperId: string) {
    const res = await fetch(`/api/papers/${paperId}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return res.json();
  },

  // Questions
  async getQuestions(params?: {
    year?: string;
    topic?: string;
    difficulty?: string;
    questionType?: string;
    search?: string;
  }) {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v) query.append(k, v);
      });
    }
    const res = await fetch(`/api/questions?${query.toString()}`, {
      headers: getAuthHeader(),
    });
    return res.json();
  },

  async getQuestionDetail(id: string) {
    const res = await fetch(`/api/questions/${id}`, {
      headers: getAuthHeader(),
    });
    return res.json();
  },

  // Topics
  async getTopics() {
    const res = await fetch('/api/topics', {
      headers: getAuthHeader(),
    });
    return res.json();
  },

  // Weakness
  async getWeakness() {
    const res = await fetch('/api/weakness', {
      headers: getAuthHeader(),
    });
    return res.json();
  },

  async updateManualWeakness(topicName: string, status: 'Critical' | 'Needs Work' | 'Strong') {
    const res = await fetch('/api/weakness/manual-update', {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ topicName, status }),
    });
    return res.json();
  },

  // Priorities
  async getPriorities() {
    const res = await fetch('/api/priorities', {
      headers: getAuthHeader(),
    });
    return res.json();
  },

  async getWhatShouldIStudyNow() {
    const res = await fetch('/api/priorities/what-to-study-now', {
      headers: getAuthHeader(),
    });
    return res.json();
  },

  // Diagnostic
  async startDiagnostic(count: number = 10) {
    const res = await fetch('/api/diagnostic/start', {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ count }),
    });
    return res.json();
  },

  async submitDiagnostic(payload: {
    attemptId: string;
    answers: Record<string, number>;
    timeSpentSeconds: number;
  }) {
    const res = await fetch('/api/diagnostic/submit', {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  // Study Plan
  async getStudyPlan() {
    const res = await fetch('/api/study-plan', {
      headers: getAuthHeader(),
    });
    return res.json();
  },

  async generateStudyPlan(dailyHours: number) {
    const res = await fetch('/api/study-plan/generate', {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ dailyHours }),
    });
    return res.json();
  },

  async toggleTask(taskId: string) {
    const res = await fetch(`/api/study-plan/task/${taskId}/toggle`, {
      method: 'PATCH',
      headers: getAuthHeader(),
    });
    return res.json();
  },

  async skipTask(taskId: string) {
    const res = await fetch(`/api/study-plan/task/${taskId}/skip`, {
      method: 'PATCH',
      headers: getAuthHeader(),
    });
    return res.json();
  },

  // Practice
  async generatePractice(topic?: string, count: number = 5) {
    const res = await fetch('/api/practice/generate', {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ topic, count }),
    });
    return res.json();
  },

  async submitPractice(topic: string, correctCount: number, totalCount: number) {
    const res = await fetch('/api/practice/submit', {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ topic, correctCount, totalCount }),
    });
    return res.json();
  },

  // Mock Test
  async generateMockTest(config: {
    questionCount: number;
    durationMinutes: number;
    difficulty?: string;
  }) {
    const res = await fetch('/api/mock-test/generate', {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(config),
    });
    return res.json();
  },

  async submitMockTest(payload: any) {
    const res = await fetch('/api/mock-test/submit', {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  // Progress
  async getProgress() {
    const res = await fetch('/api/progress', {
      headers: getAuthHeader(),
    });
    return res.json();
  },

  // AI Assistant
  async askAssistant(question: string) {
    const res = await fetch('/api/ai/assistant', {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ question }),
    });
    return res.json();
  },

  // Notifications
  async getNotifications() {
    const res = await fetch('/api/notifications', {
      headers: getAuthHeader(),
    });
    return res.json();
  },

  async markNotificationRead(id: string) {
    const res = await fetch(`/api/notifications/${id}/read`, {
      method: 'PATCH',
      headers: getAuthHeader(),
    });
    return res.json();
  },

  // Settings
  async updateSettings(payload: any) {
    const res = await fetch('/api/settings', {
      method: 'PATCH',
      headers: getAuthHeader(),
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  // Convenience aliases for views
  async getSummary() {
    return this.getDashboardOverview();
  },

  async getAnalytics() {
    const [frequency, trends, heatmap, families] = await Promise.all([
      this.getFrequency(),
      this.getTrends(),
      this.getHeatmap(),
      this.getQuestionFamilies(),
    ]);
    return {
      topicFrequency: frequency.topicFrequency || [],
      yearlyTrends: trends.yearlyTrends || [],
      marksDistribution: frequency.marksDistribution || [],
      heatmap: heatmap.heatmap || [],
      questionFamilies: families.families || [],
    };
  },

  async getPriorityMatrix() {
    return this.getPriorities();
  },

  async getWeaknesses() {
    return this.getWeakness();
  },

  async updateDailyHours(dailyHours: number) {
    return this.generateStudyPlan(dailyHours);
  },

  async regenerateStudyPlan() {
    return this.generateStudyPlan(2);
  },

  async updateWeaknessStatus(topicName: string, status: 'Critical' | 'Needs Work' | 'Strong') {
    return this.updateManualWeakness(topicName, status);
  },

  // Paper Submissions & Email to Bhanu
  async submitPaper(payload: {
    courseCode?: string;
    courseName: string;
    examType: string;
    year: number;
    fileName: string;
    fileSize: number;
    rawText?: string;
    pdfBase64?: string;
    uploaderEmail?: string;
    uploaderNotes?: string;
  }) {
    const res = await fetch('/api/papers/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async getSubmissions() {
    const res = await fetch('/api/submissions');
    return res.json();
  },

  async approveSubmission(id: string, token?: string) {
    const res = await fetch(`/api/submissions/${id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    return res.json();
  },

  async rejectSubmission(id: string, token?: string) {
    const res = await fetch(`/api/submissions/${id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    return res.json();
  },

  async adminPublishPaper(payload: {
    courseCode: string;
    courseName?: string;
    examType: 'cat1' | 'cat2' | 'fat';
    year: number;
    fileName: string;
    driveLink?: string;
    pdfBase64?: string;
    fileSize?: number;
    adminKey?: string;
  }) {
    const res = await fetch('/api/papers/admin-publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async getPublishedPapers() {
    const res = await fetch('/api/papers/published');
    return res.json();
  },
};

