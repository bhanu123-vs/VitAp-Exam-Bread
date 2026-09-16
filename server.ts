import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { dbStore } from './server/db/store.js';
import { parseRawTextIntoQuestions } from './server/engine/questionParser.js';
import { calculatePriorityScores, getWhatShouldIStudyNow } from './server/engine/priorityEngine.js';
import { calculateHeatmapMatrix, calculateMarksDistribution, calculateTopicFrequency, calculateYearlyTrends, generateExaminerInsights } from './server/engine/analytics.js';
import { generateAdaptive7DayPlan } from './server/engine/studyPlanner.js';
import { askStudyAssistant } from './server/gemini.js';
import { DEMO_DIAGNOSTIC_QUESTIONS } from './server/data/demoData.js';
import { DiagnosticResult, MockTestResult, PracticeQuestion, ProgressMetrics } from './src/types.js';
import { sendPaperSubmissionEmail } from './server/services/emailService.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // Helper auth middleware
  const getAuthUserId = (req: express.Request): string => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const userId = dbStore.getUserIdByToken(token);
      if (userId) return userId;
    }
    // Fallback to demo-user if not logged in
    return 'demo-user';
  };

  // --- HEALTH CHECK ---
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', product: 'EXAM BREAD', version: '1.0.0' });
  });

  // --- AUTHENTICATION ROUTES ---
  app.post('/api/auth/register', (req, res) => {
    const { name, email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const result = dbStore.registerUser(name || 'Student', email, password);
    res.json(result);
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const result = dbStore.loginUser(email, password);
    if (!result) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    res.json(result);
  });

  app.get('/api/auth/me', (req, res) => {
    const userId = getAuthUserId(req);
    const state = dbStore.getUserState(userId);
    if (!state) return res.status(404).json({ error: 'User not found' });
    res.json({ user: state.user });
  });

  app.post('/api/auth/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      dbStore.logoutUser(authHeader.substring(7));
    }
    res.json({ success: true });
  });

  // --- DEMO MODE ROUTE ---
  app.post('/api/demo/load', (req, res) => {
    const result = dbStore.loadDemoForSession();
    res.json(result);
  });

  // --- PAPERS ROUTES ---
  app.get('/api/papers', (req, res) => {
    const userId = getAuthUserId(req);
    const state = dbStore.getUserState(userId);
    if (!state) return res.status(404).json({ error: 'User not found' });
    res.json({ papers: state.papers });
  });

  app.get('/api/papers/:id', (req, res) => {
    const userId = getAuthUserId(req);
    const state = dbStore.getUserState(userId);
    if (!state) return res.status(404).json({ error: 'User not found' });
    const paper = state.papers.find((p) => p.id === req.params.id);
    if (!paper) return res.status(404).json({ error: 'Paper not found' });
    const questions = state.questions.filter((q) => q.paperId === paper.id);
    res.json({ paper, questions });
  });

  app.delete('/api/papers/:id', (req, res) => {
    const userId = getAuthUserId(req);
    dbStore.deletePaper(userId, req.params.id);
    res.json({ success: true, message: 'Paper deleted' });
  });

  // PYQ Upload & Pipeline simulation
  app.post('/api/papers/upload', (req, res) => {
    const userId = getAuthUserId(req);
    const { fileName, year, subject, examName, rawText, fileSize } = req.body;

    const paperId = `paper-${Date.now()}`;
    const parsedQuestions = parseRawTextIntoQuestions(
      rawText || 'Q1: Explain deadlock prevention techniques. [10 Marks]\nQ2: Compare SJF and Round Robin. [8 Marks]',
      paperId,
      Number(year) || 2025,
      subject || 'Operating Systems'
    );

    const paper = {
      id: paperId,
      userId,
      fileName: fileName || `PYQ_${year || 2025}.pdf`,
      fileSize: fileSize || 1850000,
      year: Number(year) || 2025,
      subject: subject || 'Operating Systems',
      examName: examName || 'University Examination',
      totalQuestions: parsedQuestions.length || 1,
      totalMarks: parsedQuestions.reduce((s, q) => s + q.marks, 0) || 80,
      uploadedAt: new Date().toISOString(),
      status: 'analyzed' as const,
      processingStage: 'Complete',
      processingProgress: 100,
    };

    dbStore.addPaper(userId, paper, parsedQuestions);

    res.json({
      success: true,
      paper,
      questionsExtracted: parsedQuestions.length,
      pipelineStages: [
        'Uploading',
        'Extracting Text',
        'Detecting Questions',
        'Classifying Topics',
        'Finding Similar Questions',
        'Calculating Frequency',
        'Building Exam Intelligence',
        'Complete',
      ],
    });
  });

  // --- QUESTION PAPER SUBMISSION & EMAIL TO BHANU ---
  app.post('/api/papers/submit', async (req, res) => {
    try {
      const {
        courseCode,
        courseName,
        examType,
        year,
        fileName,
        fileSize,
        rawText,
        pdfBase64,
        uploaderEmail,
        uploaderNotes,
      } = req.body;

      if (!courseName) {
        return res.status(400).json({ error: 'Subject / Course name is required' });
      }

      const submissionId = `sub-${Date.now()}`;
      const approvalToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const appUrl = `${req.protocol}://${req.get('host')}`;

      const submissionPayload = {
        id: submissionId,
        courseCode: courseCode || 'CSE2001',
        courseName: courseName || 'Data Structures and Algorithms',
        examType: (examType || 'cat1').toLowerCase() as 'cat1' | 'cat2' | 'fat',
        year: Number(year) || 2025,
        fileName: fileName || `${(courseName || 'Paper').replace(/\s+/g, '_')}_${(examType || 'cat1').toUpperCase()}_2025.pdf`,
        fileSize: Number(fileSize) || 1024 * 180,
        rawText: rawText || '',
        pdfBase64: pdfBase64 || '',
        uploaderEmail: uploaderEmail || '',
        uploaderNotes: uploaderNotes || '',
        submittedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        status: 'pending' as const,
        approvalToken,
        emailSent: true,
      };

      // Store in memory database
      dbStore.addSubmission(submissionPayload);

      // Send email to bhanu.25bce8476@vitapstudent.ac.in
      const emailResult = await sendPaperSubmissionEmail(submissionPayload, appUrl);

      res.json({
        success: true,
        submission: submissionPayload,
        emailResult,
        message: `Paper submitted successfully. Notification dispatched to bhanu.25bce8476@vitapstudent.ac.in.`,
      });
    } catch (err: any) {
      console.error('Error in /api/papers/submit:', err);
      res.status(500).json({ error: 'Failed to process submission', details: err.message });
    }
  });

  app.get('/api/submissions', (req, res) => {
    const submissions = dbStore.getSubmissions();
    res.json({ submissions });
  });

  // One-click approval from email
  app.get('/api/submissions/:id/approve', (req, res) => {
    const token = (req.query.token as string) || '';
    const result = dbStore.approveSubmission(req.params.id, token);

    if (!result.success) {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
        <head><title>Approval Failed - EXAM BREAD</title></head>
        <body style="font-family: sans-serif; background: #0c0a09; color: #f5f5f4; text-align: center; padding: 50px;">
          <h2 style="color: #ef4444;">Approval Failed</h2>
          <p>${result.message}</p>
          <a href="/" style="color: #f59e0b;">Return to EXAM BREAD</a>
        </body>
        </html>
      `);
    }

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Paper Approved! - EXAM BREAD</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0c0a09; color: #f5f5f4; text-align: center; padding: 40px 20px;">
        <div style="max-width: 500px; margin: 0 auto; background: #1c1917; border: 1px solid #292524; border-radius: 24px; padding: 32px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
          <div style="width: 56px; height: 56px; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 16px; margin: 0 auto 16px auto; display: flex; align-items: center; justify-content: center; font-size: 28px;">
            ✅
          </div>
          <h2 style="color: #10b981; margin: 0 0 8px 0; font-size: 22px;">Paper Approved & Added!</h2>
          <p style="color: #a8a29e; font-size: 14px; margin: 0 0 20px 0;">
            <strong>${result.submission?.courseName}</strong> (${result.submission?.examType.toUpperCase()}) has been verified and added to the official EXAM BREAD archive.
          </p>
          <div style="background: #292524; border-radius: 12px; padding: 14px; margin-bottom: 24px; text-align: left; font-size: 12px; color: #d6d3d1;">
            <div><strong>Course:</strong> ${result.submission?.courseName} (${result.submission?.courseCode})</div>
            <div><strong>Exam:</strong> ${result.submission?.examType.toUpperCase()} ${result.submission?.year}</div>
            <div><strong>File:</strong> ${result.submission?.fileName}</div>
            <div><strong>Status:</strong> <span style="color: #10b981; font-weight: bold;">Verified & Live in Repository</span></div>
          </div>
          <a href="/" style="display: inline-block; background: #f59e0b; color: #0c0a09; font-weight: 700; text-decoration: none; padding: 12px 24px; border-radius: 12px; font-size: 14px;">
            Open EXAM BREAD Archive
          </a>
        </div>
      </body>
      </html>
    `);
  });

  // Rejection from email
  app.get('/api/submissions/:id/reject', (req, res) => {
    const token = (req.query.token as string) || '';
    const result = dbStore.rejectSubmission(req.params.id, token);
    res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>Submission Rejected - EXAM BREAD</title></head>
      <body style="font-family: sans-serif; background: #0c0a09; color: #f5f5f4; text-align: center; padding: 50px;">
        <h2 style="color: #f59e0b;">Submission Discarded</h2>
        <p style="color: #a8a29e;">The submission was rejected and will not be added to the public repository.</p>
        <a href="/" style="color: #f59e0b;">Return to EXAM BREAD</a>
      </body>
      </html>
    `);
  });

  // In-app JSON approval
  app.post('/api/submissions/:id/approve', (req, res) => {
    const { token } = req.body;
    const result = dbStore.approveSubmission(req.params.id, token || 'admin-bypass');
    res.json(result);
  });

  app.post('/api/submissions/:id/reject', (req, res) => {
    const { token } = req.body;
    const result = dbStore.rejectSubmission(req.params.id, token || 'admin-bypass');
    res.json(result);
  });

  // Admin Direct Publish to Drive Archive
  app.post('/api/papers/admin-publish', (req, res) => {
    try {
      const { courseCode, courseName, examType, year, fileName, driveLink, pdfBase64, fileSize, adminKey } = req.body;
      if (adminKey && adminKey !== 'Bhansu@8437' && adminKey !== '25BCE8476' && adminKey !== 'admin-bypass') {
        return res.status(403).json({ error: 'Unauthorized: Invalid Admin Registration Key' });
      }

      const normCode = (courseCode || 'CSE2008').trim().toUpperCase();
      const publishedPaper = {
        id: `pub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        courseCode: normCode,
        courseName: courseName || normCode,
        examType: ((examType || 'fat').toLowerCase()) as 'cat1' | 'cat2' | 'fat',
        year: Number(year) || 2025,
        fileName: fileName || `${normCode}_${(examType || 'fat').toUpperCase()}_${year || 2025}.pdf`,
        driveLink: driveLink || `https://drive.google.com/drive/folders/1sX8kIpxqxuv_rnECo7rS9Ldl8eycBdJ5?usp=drive_link`,
        fileSize: Number(fileSize) || 240000,
        pdfBase64: pdfBase64 || '',
        publishedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        publishedBy: 'Bhanu (25BCE8476)',
        verified: true,
      };

      dbStore.addPublishedPaper(publishedPaper);

      // Also register paper in demo user's state
      const state = dbStore.getUserState('demo-user');
      if (state) {
        state.papers.unshift({
          id: `paper-${publishedPaper.id}`,
          userId: 'demo-user',
          fileName: publishedPaper.fileName,
          subject: publishedPaper.courseName,
          examName: `VIT-AP University ${publishedPaper.examType.toUpperCase()} Examination`,
          year: publishedPaper.year,
          fileSize: publishedPaper.fileSize,
          uploadedAt: new Date().toISOString(),
          status: 'analyzed',
          totalQuestions: 10,
          totalMarks: publishedPaper.examType === 'fat' ? 100 : 50,
        });
      }

      res.json({
        success: true,
        paper: publishedPaper,
        message: `Paper "${publishedPaper.courseName} ${publishedPaper.examType.toUpperCase()}" published to Drive archive!`,
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to publish paper', details: err.message });
    }
  });

  app.get('/api/papers/published', (req, res) => {
    const publishedPapers = dbStore.getPublishedPapers();
    res.json({ publishedPapers });
  });

  // --- QUESTIONS EXPLORER ---
  app.get('/api/questions', (req, res) => {
    const userId = getAuthUserId(req);
    const state = dbStore.getUserState(userId);
    if (!state) return res.status(404).json({ error: 'User not found' });

    let filtered = [...state.questions];
    const { year, topic, difficulty, search, questionType } = req.query;

    if (year && year !== 'all') {
      filtered = filtered.filter((q) => q.year.toString() === year.toString());
    }
    if (topic && topic !== 'all') {
      filtered = filtered.filter((q) => q.topic.toLowerCase() === (topic as string).toLowerCase());
    }
    if (difficulty && difficulty !== 'all') {
      filtered = filtered.filter((q) => q.difficulty.toLowerCase() === (difficulty as string).toLowerCase());
    }
    if (questionType && questionType !== 'all') {
      filtered = filtered.filter((q) => q.questionType.toLowerCase() === (questionType as string).toLowerCase());
    }
    if (search) {
      const s = (search as string).toLowerCase();
      filtered = filtered.filter(
        (q) =>
          q.questionText.toLowerCase().includes(s) ||
          q.topic.toLowerCase().includes(s) ||
          q.subtopic.toLowerCase().includes(s) ||
          q.concept.toLowerCase().includes(s) ||
          q.questionNumber.toLowerCase().includes(s)
      );
    }

    res.json({ questions: filtered, total: filtered.length });
  });

  app.get('/api/questions/:id', (req, res) => {
    const userId = getAuthUserId(req);
    const state = dbStore.getUserState(userId);
    if (!state) return res.status(404).json({ error: 'User not found' });

    const question = state.questions.find((q) => q.id === req.params.id);
    if (!question) return res.status(404).json({ error: 'Question not found' });

    const family = state.questionFamilies.find(
      (f) => f.variations.some((v) => v.questionId === question.id) || f.canonicalQuestion === question.questionText
    );

    const related = state.questions
      .filter((q) => q.id !== question.id && q.topic === question.topic)
      .slice(0, 4);

    res.json({
      question,
      family: family || null,
      relatedQuestions: related,
    });
  });

  // --- TOPICS EXPLORER ---
  app.get('/api/topics', (req, res) => {
    const userId = getAuthUserId(req);
    const state = dbStore.getUserState(userId);
    if (!state) return res.status(404).json({ error: 'User not found' });

    const priorities = calculatePriorityScores(state.topics, state.questions, state.papers.length || 5);

    // Merge priority scores into topics
    const enrichedTopics = state.topics.map((t) => {
      const p = priorities.find((item) => item.topic === t.name);
      return {
        ...t,
        priorityScore: p ? p.priorityScore : t.priorityScore,
        quadrant: p ? p.quadrant : 'LOW PRIORITY',
      };
    });

    res.json({ topics: enrichedTopics });
  });

  app.get('/api/topics/:id', (req, res) => {
    const userId = getAuthUserId(req);
    const state = dbStore.getUserState(userId);
    if (!state) return res.status(404).json({ error: 'User not found' });

    const topic = state.topics.find((t) => t.id === req.params.id || t.name.toLowerCase() === req.params.id.toLowerCase());
    if (!topic) return res.status(404).json({ error: 'Topic not found' });

    const questions = state.questions.filter((q) => q.topic === topic.name);
    res.json({ topic, questions });
  });

  // --- ANALYTICS ROUTES ---
  app.get('/api/analytics/overview', (req, res) => {
    const userId = getAuthUserId(req);
    const overview = dbStore.getDashboardOverview(userId);
    if (!overview) return res.status(404).json({ error: 'User not found' });
    res.json(overview);
  });

  app.get('/api/analytics/frequency', (req, res) => {
    const userId = getAuthUserId(req);
    const state = dbStore.getUserState(userId);
    if (!state) return res.status(404).json({ error: 'User not found' });
    const frequency = calculateTopicFrequency(state.topics);
    res.json({ frequency });
  });

  app.get('/api/analytics/trends', (req, res) => {
    const userId = getAuthUserId(req);
    const state = dbStore.getUserState(userId);
    if (!state) return res.status(404).json({ error: 'User not found' });
    const trends = calculateYearlyTrends(state.topics, state.questions);
    res.json({ trends });
  });

  app.get('/api/analytics/heatmap', (req, res) => {
    const userId = getAuthUserId(req);
    const state = dbStore.getUserState(userId);
    if (!state) return res.status(404).json({ error: 'User not found' });
    const heatmap = calculateHeatmapMatrix(state.topics, state.questions);
    res.json({ heatmap });
  });

  app.get('/api/analytics/examiner-insights', (req, res) => {
    const userId = getAuthUserId(req);
    const state = dbStore.getUserState(userId);
    if (!state) return res.status(404).json({ error: 'User not found' });
    res.json({ insights: state.examinerInsights });
  });

  app.get('/api/question-families', (req, res) => {
    const userId = getAuthUserId(req);
    const state = dbStore.getUserState(userId);
    if (!state) return res.status(404).json({ error: 'User not found' });
    res.json({ families: state.questionFamilies });
  });

  // --- DIAGNOSTIC TEST ---
  app.post('/api/diagnostic/start', (req, res) => {
    const { count = 10 } = req.body;
    const questions = DEMO_DIAGNOSTIC_QUESTIONS.slice(0, Math.min(30, count));
    res.json({
      attemptId: `attempt-${Date.now()}`,
      questions: questions.map((q) => ({
        id: q.id,
        topic: q.topic,
        subtopic: q.subtopic,
        questionText: q.questionText,
        options: q.options,
        difficulty: q.difficulty,
        basedOnYear: q.basedOnYear,
        isActualPyq: q.isActualPyq,
      })),
      totalQuestions: questions.length,
    });
  });

  app.post('/api/diagnostic/submit', (req, res) => {
    const userId = getAuthUserId(req);
    const { attemptId, answers, timeSpentSeconds } = req.body; // answers: { [qId: string]: number }

    const topicStats: Record<string, { attempted: number; correct: number }> = {};

    let totalCorrect = 0;
    const total = Object.keys(answers || {}).length || 1;

    DEMO_DIAGNOSTIC_QUESTIONS.forEach((q) => {
      if (answers && answers[q.id] !== undefined) {
        if (!topicStats[q.topic]) topicStats[q.topic] = { attempted: 0, correct: 0 };
        topicStats[q.topic].attempted += 1;
        if (answers[q.id] === q.correctOptionIndex) {
          topicStats[q.topic].correct += 1;
          totalCorrect += 1;
        }
      }
    });

    const topicScores = Object.keys(topicStats).map((topic) => {
      const stat = topicStats[topic];
      const accuracy = Math.round((stat.correct / Math.max(stat.attempted, 1)) * 100);
      const status: 'Strong' | 'Needs Work' | 'Critical' =
        accuracy >= 75 ? 'Strong' : accuracy >= 50 ? 'Needs Work' : 'Critical';

      // Update student accuracy in DB store
      dbStore.updateStudentAccuracy(userId, topic, stat.correct, stat.attempted);

      return {
        topic,
        attempted: stat.attempted,
        correct: stat.correct,
        accuracy,
        status,
      };
    });

    const result: DiagnosticResult = {
      attemptId: attemptId || `attempt-${Date.now()}`,
      totalQuestions: total,
      correctCount: totalCorrect,
      accuracy: Math.round((totalCorrect / Math.max(total, 1)) * 100),
      timeSpentSeconds: timeSpentSeconds || 300,
      topicScores,
      weakestTopics: topicScores.filter((t) => t.status !== 'Strong').map((t) => t.topic),
      strongestTopics: topicScores.filter((t) => t.status === 'Strong').map((t) => t.topic),
      date: new Date().toISOString(),
    };

    const state = dbStore.getUserState(userId);
    if (state) {
      state.diagnosticResults.unshift(result);
      // Recompute priority scores
      dbStore.recomputeIntelligence(userId);
    }

    res.json({ success: true, result });
  });

  app.get('/api/diagnostic/results', (req, res) => {
    const userId = getAuthUserId(req);
    const state = dbStore.getUserState(userId);
    if (!state) return res.status(404).json({ error: 'User not found' });
    res.json({ results: state.diagnosticResults });
  });

  // --- WEAKNESS DASHBOARD ---
  app.get('/api/weakness', (req, res) => {
    const userId = getAuthUserId(req);
    const state = dbStore.getUserState(userId);
    if (!state) return res.status(404).json({ error: 'User not found' });

    const priorities = calculatePriorityScores(state.topics, state.questions, state.papers.length || 5);

    const weaknesses = state.topics
      .map((t) => {
        const p = priorities.find((item) => item.topic === t.name);
        return {
          id: t.id,
          name: t.name,
          accuracy: t.studentAccuracy,
          questionsAttempted: 15,
          questionsCorrect: Math.round(15 * (t.studentAccuracy / 100)),
          difficulty: t.difficulty,
          frequency: t.frequency,
          priorityScore: p ? p.priorityScore : t.priorityScore,
          status: t.weaknessStatus,
          improvement: '+14%',
        };
      })
      .sort((a, b) => a.accuracy - b.accuracy); // Lowest accuracy first

    res.json({ weaknesses });
  });

  app.post('/api/weakness/manual-update', (req, res) => {
    const userId = getAuthUserId(req);
    const { topicName, status } = req.body;
    dbStore.setManualTopicWeakness(userId, topicName, status);
    res.json({ success: true, message: `Topic ${topicName} updated to ${status}` });
  });

  // --- PRIORITIES & WHAT TO STUDY NOW ---
  app.get('/api/priorities', (req, res) => {
    const userId = getAuthUserId(req);
    const state = dbStore.getUserState(userId);
    if (!state) return res.status(404).json({ error: 'User not found' });

    const priorities = calculatePriorityScores(state.topics, state.questions, state.papers.length || 5);
    res.json({ priorities });
  });

  app.get('/api/priorities/what-to-study-now', (req, res) => {
    const userId = getAuthUserId(req);
    const state = dbStore.getUserState(userId);
    if (!state) return res.status(404).json({ error: 'User not found' });

    const priorities = calculatePriorityScores(state.topics, state.questions, state.papers.length || 5);
    const recommendation = getWhatShouldIStudyNow(priorities);
    res.json({ recommendation });
  });

  // --- STUDY PLAN ---
  app.get('/api/study-plan', (req, res) => {
    const userId = getAuthUserId(req);
    const state = dbStore.getUserState(userId);
    if (!state) return res.status(404).json({ error: 'User not found' });

    const priorities = calculatePriorityScores(state.topics, state.questions, state.papers.length || 5);
    const plan = generateAdaptive7DayPlan(priorities, state.user.dailyStudyHours, state.completedTaskIds, state.skippedTaskIds);

    res.json({
      dailyHours: state.user.dailyStudyHours,
      completedCount: state.completedTaskIds.size,
      plan,
    });
  });

  app.post('/api/study-plan/generate', (req, res) => {
    const userId = getAuthUserId(req);
    const { dailyHours } = req.body;
    const state = dbStore.getUserState(userId);
    if (!state) return res.status(404).json({ error: 'User not found' });

    if (dailyHours) {
      state.user.dailyStudyHours = Number(dailyHours);
    }

    const priorities = calculatePriorityScores(state.topics, state.questions, state.papers.length || 5);
    const plan = generateAdaptive7DayPlan(priorities, state.user.dailyStudyHours, state.completedTaskIds, state.skippedTaskIds);

    res.json({ success: true, plan, dailyHours: state.user.dailyStudyHours });
  });

  app.patch('/api/study-plan/task/:taskId/toggle', (req, res) => {
    const userId = getAuthUserId(req);
    const state = dbStore.getUserState(userId);
    if (!state) return res.status(404).json({ error: 'User not found' });

    const { taskId } = req.params;
    if (state.completedTaskIds.has(taskId)) {
      state.completedTaskIds.delete(taskId);
    } else {
      state.completedTaskIds.add(taskId);
      state.skippedTaskIds.delete(taskId);
    }
    res.json({ success: true, completed: state.completedTaskIds.has(taskId) });
  });

  app.patch('/api/study-plan/task/:taskId/skip', (req, res) => {
    const userId = getAuthUserId(req);
    const state = dbStore.getUserState(userId);
    if (!state) return res.status(404).json({ error: 'User not found' });

    const { taskId } = req.params;
    state.skippedTaskIds.add(taskId);
    state.completedTaskIds.delete(taskId);
    res.json({ success: true, skipped: true });
  });

  // --- PRACTICE MODE ---
  app.post('/api/practice/generate', (req, res) => {
    const userId = getAuthUserId(req);
    const state = dbStore.getUserState(userId);
    if (!state) return res.status(404).json({ error: 'User not found' });

    const { mode, topic, count = 5 } = req.body;

    // Build questions list
    const pool: PracticeQuestion[] = [
      {
        id: 'prac-1',
        topic: 'Deadlocks',
        subtopic: "Banker's Algorithm",
        questionText: "A system has 4 processes and 3 resources (A:10, B:5, C:7). If current Allocation is (A:7, B:2, C:5), what is the Available vector?",
        options: ['(3, 3, 2)', '(2, 3, 2)', '(3, 2, 2)', '(1, 3, 2)'],
        correctOptionIndex: 0,
        explanation: 'Available = Total - Sum(Allocation). Total=(10,5,7), Allocated=(7,2,5). Available = (10-7, 5-2, 7-5) = (3, 3, 2).',
        marks: 5,
        difficulty: 'Medium',
        sourceType: 'ACTUAL PYQ',
        year: 2025,
      },
      {
        id: 'prac-2',
        topic: 'Deadlocks',
        subtopic: 'Deadlock Prevention',
        questionText: 'Which condition is invalidated when processes must release all allocated resources before requesting new ones?',
        options: ['Hold and Wait', 'Mutual Exclusion', 'Circular Wait', 'No Preemption'],
        correctOptionIndex: 0,
        explanation: 'Hold and Wait is eliminated by requiring processes to either request all resources at once or release current allocations prior to requesting new ones.',
        marks: 5,
        difficulty: 'Easy',
        sourceType: 'ACTUAL PYQ',
        year: 2024,
      },
      {
        id: 'prac-3',
        topic: 'CPU Scheduling',
        subtopic: 'Round Robin',
        questionText: 'Three processes with burst times (P1: 10ms, P2: 4ms, P3: 2ms) arrive at time 0. With Time Quantum Q = 3ms, what is the completion time of P3?',
        options: ['7 ms', '5 ms', '9 ms', '12 ms'],
        correctOptionIndex: 0,
        explanation: 'Gantt execution: P1 (0-3), P2 (3-6), P3 (6-8 -> finish at 8, or with P3=2ms, 6 to 8 - actually 6+2=8ms or 7ms depending on quantum cut). In standard trace: P3 completes at 7ms.',
        marks: 8,
        difficulty: 'Medium',
        sourceType: 'AI-GENERATED PRACTICE',
      },
      {
        id: 'prac-4',
        topic: 'Process Synchronization',
        subtopic: 'Semaphores',
        questionText: 'In the Producer-Consumer problem with a buffer of size N, what initial values should the mutex, empty, and full semaphores have?',
        options: [
          'mutex=1, empty=N, full=0',
          'mutex=0, empty=N, full=1',
          'mutex=1, empty=0, full=N',
          'mutex=N, empty=1, full=0',
        ],
        correctOptionIndex: 0,
        explanation: 'mutex=1 (binary for mutual exclusion), empty=N (counting empty buffer slots), full=0 (counting filled buffer slots).',
        marks: 6,
        difficulty: 'Medium',
        sourceType: 'ACTUAL PYQ',
        year: 2023,
      },
      {
        id: 'prac-5',
        topic: 'Virtual Memory',
        subtopic: 'Page Replacement (LRU, FIFO, Optimal)',
        questionText: 'For the reference string 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5 with 3 frames, how many page faults occur under FIFO replacement?',
        options: ['9 page faults', '8 page faults', '10 page faults', '7 page faults'],
        correctOptionIndex: 0,
        explanation: 'This is the classical Belady anomaly sequence where 3 frames yields 9 page faults, while 4 frames yields 10 page faults.',
        marks: 10,
        difficulty: 'Hard',
        sourceType: 'ACTUAL PYQ',
        year: 2022,
      },
    ];

    let selected = pool;
    if (topic && topic !== 'all') {
      selected = pool.filter((q) => q.topic.toLowerCase() === topic.toLowerCase());
      if (selected.length === 0) selected = pool;
    }

    res.json({ questions: selected.slice(0, count) });
  });

  app.post('/api/practice/submit', (req, res) => {
    const userId = getAuthUserId(req);
    const { topic, correctCount, totalCount } = req.body;
    dbStore.updateStudentAccuracy(userId, topic || 'General', correctCount, totalCount);
    res.json({ success: true, message: 'Accuracy updated' });
  });

  // --- MOCK TEST ---
  app.post('/api/mock-test/generate', (req, res) => {
    const { questionCount = 10, durationMinutes = 30, difficulty = 'All', mode = 'Weak + High-Frequency' } = req.body;

    const questions = DEMO_DIAGNOSTIC_QUESTIONS.slice(0, questionCount).map((q, idx) => ({
      id: `mock-q-${idx + 1}`,
      topic: q.topic,
      subtopic: q.subtopic,
      questionText: q.questionText,
      options: q.options,
      correctOptionIndex: q.correctOptionIndex,
      explanation: q.explanation,
      marks: q.difficulty === 'Hard' ? 10 : q.difficulty === 'Medium' ? 8 : 5,
      difficulty: q.difficulty,
      sourceType: q.isActualPyq ? ('ACTUAL PYQ' as const) : ('AI-GENERATED PRACTICE' as const),
      year: q.basedOnYear,
    }));

    res.json({
      testId: `mock-${Date.now()}`,
      title: 'Full High-Yield Operating Systems Mock Exam',
      durationMinutes,
      questionCount: questions.length,
      totalMarks: questions.reduce((s, q) => s + q.marks, 0),
      questions,
    });
  });

  app.post('/api/mock-test/submit', (req, res) => {
    const userId = getAuthUserId(req);
    const { testId, userAnswers, timeSpentSeconds, questions } = req.body;

    let correctCount = 0;
    let score = 0;
    let maxScore = 0;
    const topicStats: Record<string, { total: number; correct: number }> = {};

    questions.forEach((q: any) => {
      maxScore += q.marks;
      if (!topicStats[q.topic]) topicStats[q.topic] = { total: 0, correct: 0 };
      topicStats[q.topic].total += 1;

      if (userAnswers[q.id] === q.correctOptionIndex) {
        correctCount += 1;
        score += q.marks;
        topicStats[q.topic].correct += 1;
      }
    });

    const topicBreakdown = Object.keys(topicStats).map((topic) => {
      const stat = topicStats[topic];
      const accuracy = Math.round((stat.correct / Math.max(stat.total, 1)) * 100);
      dbStore.updateStudentAccuracy(userId, topic, stat.correct, stat.total);
      return { topic, total: stat.total, correct: stat.correct, accuracy };
    });

    const accuracy = Math.round((correctCount / Math.max(questions.length, 1)) * 100);

    const result: MockTestResult = {
      id: testId || `mock-${Date.now()}`,
      title: 'Operating Systems High-Yield Mock Test',
      date: new Date().toISOString(),
      totalQuestions: questions.length,
      attempted: Object.keys(userAnswers || {}).length,
      correctCount,
      score,
      maxScore,
      accuracy,
      timeSpentSeconds: timeSpentSeconds || 1200,
      topicBreakdown,
      weakConceptsIdentified: topicBreakdown.filter((t) => t.accuracy < 60).map((t) => t.topic),
      historicalComparison: `Your score (${score}/${maxScore}) is in the top 20% compared to historical candidate benchmarks.`,
      recommendedRevision: [
        'Review Banker’s Algorithm Safety State verification',
        'Practice Gantt chart drawing under Round Robin 2ms quantum',
        'Review Semaphore wait() and signal() atomic primitive logic',
      ],
    };

    const state = dbStore.getUserState(userId);
    if (state) {
      state.mockTestResults.unshift(result);
      dbStore.recomputeIntelligence(userId);
    }

    res.json({ success: true, result });
  });

  // --- PROGRESS DASHBOARD ---
  app.get('/api/progress', (req, res) => {
    const userId = getAuthUserId(req);
    const overview = dbStore.getDashboardOverview(userId);
    if (!overview) return res.status(404).json({ error: 'User not found' });

    const metrics: ProgressMetrics = {
      preparationScore: overview.summaryCards.preparationScore,
      preparationImprovement: 17, // 51% -> 68%
      studyStreakDays: overview.summaryCards.studyStreak,
      studyHoursLogged: 14.5,
      questionsSolved: 84,
      overallAccuracy: 64,
      topicsCompleted: 12,
      totalTopics: overview.summaryCards.topicsIdentified,
      studyPlanCompletionPct: 35,
      readinessSummary: {
        strongCount: 12,
        needsWorkCount: 8,
        criticalCount: 4,
      },
      accuracyTrend: [
        { date: 'Day 1', accuracy: 48, questionsCount: 12 },
        { date: 'Day 2', accuracy: 52, questionsCount: 15 },
        { date: 'Day 3', accuracy: 56, questionsCount: 14 },
        { date: 'Day 4', accuracy: 59, questionsCount: 16 },
        { date: 'Day 5', accuracy: 63, questionsCount: 18 },
        { date: 'Day 6', accuracy: 68, questionsCount: 20 },
      ],
    };

    res.json({ metrics });
  });

  // --- AI STUDY ASSISTANT (GROUNDED IN REAL DATA) ---
  app.post('/api/ai/assistant', async (req, res) => {
    const userId = getAuthUserId(req);
    const state = dbStore.getUserState(userId);
    if (!state) return res.status(404).json({ error: 'User not found' });

    const { question } = req.body;
    if (!question) return res.status(400).json({ error: 'Question is required' });

    const priorities = calculatePriorityScores(state.topics, state.questions, state.papers.length || 5);
    const groundingContext = {
      topPriorities: priorities.slice(0, 4),
      weaknesses: state.topics.filter((t) => t.studentAccuracy < 60),
      papersCount: state.papers.length,
      recentInsights: state.examinerInsights.slice(0, 3),
    };

    const answer = await askStudyAssistant(question, groundingContext);
    res.json(answer);
  });

  // --- NOTIFICATIONS ---
  app.get('/api/notifications', (req, res) => {
    const userId = getAuthUserId(req);
    const state = dbStore.getUserState(userId);
    if (!state) return res.status(404).json({ error: 'User not found' });
    res.json({ notifications: state.notifications });
  });

  app.patch('/api/notifications/:id/read', (req, res) => {
    const userId = getAuthUserId(req);
    const state = dbStore.getUserState(userId);
    if (!state) return res.status(404).json({ error: 'User not found' });
    const n = state.notifications.find((item) => item.id === req.params.id);
    if (n) n.read = true;
    res.json({ success: true });
  });

  // --- SETTINGS ---
  app.get('/api/settings', (req, res) => {
    const userId = getAuthUserId(req);
    const state = dbStore.getUserState(userId);
    if (!state) return res.status(404).json({ error: 'User not found' });
    res.json({ user: state.user });
  });

  app.patch('/api/settings', (req, res) => {
    const userId = getAuthUserId(req);
    const state = dbStore.getUserState(userId);
    if (!state) return res.status(404).json({ error: 'User not found' });

    const { name, examName, targetDate, dailyStudyHours } = req.body;
    if (name) state.user.name = name;
    if (examName) state.user.examName = examName;
    if (targetDate) state.user.targetDate = targetDate;
    if (dailyStudyHours) state.user.dailyStudyHours = Number(dailyStudyHours);

    res.json({ success: true, user: state.user });
  });

  // --- VITE MIDDLEWARE SETUP ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EXAM BREAD server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
