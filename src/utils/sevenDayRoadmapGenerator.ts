import { StudyPlanDay, StudyTask } from '../types.js';
import { ALL_57_COURSES_SYLLABUS, CourseModuleDef } from '../data/all57CoursesSyllabus.js';

export interface SevenDayRoadmapConfig {
  courseCode: string;
  courseTitle: string;
  examType: 'cat1' | 'cat2' | 'fat';
  dailyHours: number;
  laggingTopics?: string[];
  masteredTopics?: string[];
  allCommonTopics?: string[];
  overallAccuracy?: number;
}

export function generateLaggingAware7DayRoadmap(config: SevenDayRoadmapConfig): StudyPlanDay[] {
  const {
    courseCode,
    courseTitle,
    examType,
    dailyHours,
    laggingTopics = [],
    masteredTopics = [],
    allCommonTopics = [],
    overallAccuracy = 70,
  } = config;

  const totalDailyMinutes = Math.max(60, dailyHours * 60);
  const examLabel = examType.toUpperCase();

  // Look up course syllabus in the verified database
  const normalizedCode = courseCode.toUpperCase().replace(/\s+/g, '');
  const courseModules: CourseModuleDef[] = ALL_57_COURSES_SYLLABUS[normalizedCode] || [
    {
      moduleNumber: 1,
      name: 'Foundation & Principles',
      coreTopics: ['Core Definitions & Theorems', 'Base Analytical Models', 'Fundamental Laws'],
      fatWeightage: 20,
      cat1Weightage: 25,
    },
    {
      moduleNumber: 2,
      name: 'Analytical Structures & Formulations',
      coreTopics: ['Mathematical Formulations', 'State Representations', 'Primary Algorithms'],
      fatWeightage: 20,
      cat1Weightage: 25,
    },
    {
      moduleNumber: 3,
      name: 'Advanced Dynamics & System Design',
      coreTopics: ['Complex Case Solutions', 'System Architectures', 'Optimizations'],
      fatWeightage: 20,
      cat2Weightage: 25,
    },
    {
      moduleNumber: 4,
      name: 'Synthesis & Trade-off Analysis',
      coreTopics: ['Trade-offs & Constraints', 'Synthesis Problems', 'Stability Criteria'],
      fatWeightage: 20,
      cat2Weightage: 25,
    },
    {
      moduleNumber: 5,
      name: 'Applications & University Case Studies',
      coreTopics: ['Real-World Implementations', 'Modern Variants', 'Comprehensive Proofs'],
      fatWeightage: 20,
    },
  ];

  // Filter modules according to the specific exam segment
  // CAT-1: Modules 1 and 2
  // CAT-2: Modules 3 and 4
  // FAT: Modules 1, 2, 3, 4, 5
  let activeModules: CourseModuleDef[] = [];
  if (examType === 'cat1') {
    activeModules = courseModules.filter((m) => m.moduleNumber === 1 || m.moduleNumber === 2);
  } else if (examType === 'cat2') {
    activeModules = courseModules.filter((m) => m.moduleNumber === 3 || m.moduleNumber === 4);
  } else {
    activeModules = courseModules;
  }

  // Extract candidate topics from active modules
  const candidateTopics: string[] = [];
  activeModules.forEach((m) => {
    m.coreTopics.forEach((t) => candidateTopics.push(t));
  });

  // Merge lagging topics if any
  const prioritizedTopics = [...new Set([...laggingTopics, ...candidateTopics, ...allCommonTopics])];

  const days: StudyPlanDay[] = [];
  const today = new Date();

  // Day schedules tailored strictly by exam type
  for (let i = 0; i < 7; i++) {
    const dayNumber = i + 1;
    const dayDate = new Date(today);
    dayDate.setDate(today.getDate() + i);
    const dateStr = dayDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    let theme = '';
    let reason = '';
    let primaryTopic = '';
    let isLaggingFocus = false;

    // Time budget allocation
    const mConcept = Math.round(totalDailyMinutes * 0.35);
    const mPyq = Math.round(totalDailyMinutes * 0.35);
    const mPractice = Math.round(totalDailyMinutes * 0.20);
    const mTest = totalDailyMinutes - (mConcept + mPyq + mPractice);

    if (examType === 'cat1') {
      const mod1 = activeModules.find((m) => m.moduleNumber === 1) || activeModules[0];
      const mod2 = activeModules.find((m) => m.moduleNumber === 2) || activeModules[1] || mod1;

      if (dayNumber === 1) {
        primaryTopic = mod1.coreTopics[0] || 'Module 1 Foundations';
        theme = `Day 1: CAT-1 Module 1 • Fundamentals & Core Proofs`;
        reason = `Covers 50% of CAT-1 syllabus. Master definitions, governing theorems, and baseline formulas from Module 1 (${mod1.name}).`;
      } else if (dayNumber === 2) {
        primaryTopic = mod1.coreTopics[1] || mod1.coreTopics[0] || 'Module 1 Numerical Problems';
        theme = `Day 2: CAT-1 Module 1 • Past Paper Numericals & Short Questions`;
        reason = `Practice 2-mark & 5-mark short questions and numerical problems frequently asked in previous CAT-1 papers.`;
      } else if (dayNumber === 3) {
        primaryTopic = mod2.coreTopics[0] || 'Module 2 Advanced Concepts';
        theme = `Day 3: CAT-1 Module 2 • Core Analytical Principles`;
        reason = `Transitions to Module 2 (${mod2.name}). Build conceptual clarity on core analytical frameworks.`;
      } else if (dayNumber === 4) {
        primaryTopic = mod2.coreTopics[1] || mod2.coreTopics[0] || 'Module 2 High-Yield Questions';
        theme = `Day 4: CAT-1 Module 2 • High-Weightage Design & Proofs`;
        reason = `Solve long-answer 10-mark questions from recent CAT-1 exams for Module 2.`;
      } else if (dayNumber === 5) {
        primaryTopic = `${mod1.name} + ${mod2.name}`;
        theme = `Day 5: CAT-1 Combined Synthesis • Recurring Question Families`;
        reason = `Identify patterns connecting Module 1 and Module 2. Revisit identified weak spots (${overallAccuracy}% pre-check accuracy).`;
      } else if (dayNumber === 6) {
        primaryTopic = `CAT-1 50-Mark University Paper Simulation`;
        theme = `Day 6: Timed CAT-1 Mock Exam (50 Marks, 90 Mins)`;
        reason = `Simulate actual examination conditions with genuine VIT-AP CAT-1 past questions under timed pressure.`;
      } else {
        primaryTopic = `CAT-1 Formula Compendium & High-Yield Summary`;
        theme = `Day 7: Final Formula Recall, Theorem Checklist & Rest`;
        reason = `Consolidate all equations, step-by-step mark schemes, and ensure full mental readiness for the CAT-1 examination.`;
      }
    } else if (examType === 'cat2') {
      const mod3 = activeModules.find((m) => m.moduleNumber === 3) || activeModules[0];
      const mod4 = activeModules.find((m) => m.moduleNumber === 4) || activeModules[1] || mod3;

      if (dayNumber === 1) {
        primaryTopic = mod3.coreTopics[0] || 'Module 3 Core Principles';
        theme = `Day 1: CAT-2 Module 3 • Core Principles & Architecture`;
        reason = `Covers 50% of CAT-2 syllabus. Deep dive into Module 3 (${mod3.name}) governing laws and core derivations.`;
      } else if (dayNumber === 2) {
        primaryTopic = mod3.coreTopics[1] || mod3.coreTopics[0] || 'Module 3 Complex Derivations';
        theme = `Day 2: CAT-2 Module 3 • Past PYQ Derivations & Numericals`;
        reason = `Solve recurring CAT-2 analytical problems and proofs from past university question papers.`;
      } else if (dayNumber === 3) {
        primaryTopic = mod4.coreTopics[0] || 'Module 4 Synthesis & Trade-offs';
        theme = `Day 3: CAT-2 Module 4 • System Synthesis & Trade-off Models`;
        reason = `Covers Module 4 (${mod4.name}). Master system trade-offs, constraints, and architecture models.`;
      } else if (dayNumber === 4) {
        primaryTopic = mod4.coreTopics[1] || mod4.coreTopics[0] || 'Module 4 10-Mark Design Problems';
        theme = `Day 4: CAT-2 Module 4 • 10-Mark Design & Case Problems`;
        reason = `Solve high-weightage 10-mark design questions frequently featured in CAT-2 examinations.`;
      } else if (dayNumber === 5) {
        primaryTopic = `${mod3.name} + ${mod4.name}`;
        theme = `Day 5: CAT-2 Cross-Module Review & Weak Spot Eradication`;
        reason = `Combined multi-unit problem solving covering the entire CAT-2 boundary.`;
      } else if (dayNumber === 6) {
        primaryTopic = `CAT-2 50-Mark Timed University Simulation`;
        theme = `Day 6: Full Timed CAT-2 Mock Test (50 Marks)`;
        reason = `Complete a simulated VIT-AP CAT-2 question paper under real exam timing conditions.`;
      } else {
        primaryTopic = `CAT-2 Master Formula Sheet & Final Theorem Walkthrough`;
        theme = `Day 7: Rapid Formula Recall & Exam Rehearsal`;
        reason = `Final revision day: memory anchors, formula cheat sheet, and step-mark strategy.`;
      }
    } else {
      // FAT (Final Assessment Test - Comprehensive 100 Marks across All 5 Modules)
      const mod1 = courseModules.find((m) => m.moduleNumber === 1) || courseModules[0];
      const mod2 = courseModules.find((m) => m.moduleNumber === 2) || courseModules[1] || mod1;
      const mod3 = courseModules.find((m) => m.moduleNumber === 3) || courseModules[2] || mod1;
      const mod4 = courseModules.find((m) => m.moduleNumber === 4) || courseModules[3] || mod1;
      const mod5 = courseModules.find((m) => m.moduleNumber === 5) || courseModules[4] || mod1;

      if (dayNumber === 1) {
        primaryTopic = mod1.coreTopics[0] || 'Module 1 Foundation';
        theme = `Day 1: FAT Module 1 • Foundation Proofs & 16-20% Weightage`;
        reason = `Build a rock-solid base with Module 1 (${mod1.name}). Covers recurring Part A & Part B university questions.`;
      } else if (dayNumber === 2) {
        primaryTopic = mod2.coreTopics[0] || 'Module 2 Analytical Structures';
        theme = `Day 2: FAT Module 2 • Analytical Formulations & Past Paper PYQs`;
        reason = `Focus on Module 2 (${mod2.name}). High marks weightage in FAT with frequent numerical problems.`;
      } else if (dayNumber === 3) {
        primaryTopic = mod3.coreTopics[0] || 'Module 3 Core Systems';
        theme = `Day 3: FAT Module 3 • Core Dynamics & System Derivations`;
        reason = `Master Module 3 (${mod3.name}). Crucial mid-syllabus topics carrying substantial Part B marks.`;
      } else if (dayNumber === 4) {
        primaryTopic = mod4.coreTopics[0] || 'Module 4 Complex Design';
        theme = `Day 4: FAT Module 4 • Advanced Synthesis & 10-Mark Question Families`;
        reason = `Tackle Module 4 (${mod4.name}). Long-answer design questions and critical step marks.`;
      } else if (dayNumber === 5) {
        primaryTopic = mod5.coreTopics[0] || 'Module 5 Applications';
        theme = `Day 5: FAT Module 5 • Real-World Applications & Modern Systems`;
        reason = `Complete syllabus with Module 5 (${mod5.name}). Review application questions and final module theorems.`;
      } else if (dayNumber === 6) {
        primaryTopic = `Comprehensive FAT 100-Mark University Paper (3 Hours)`;
        theme = `Day 6: Full FAT 100-Mark Timed Exam Simulation`;
        reason = `Simulate the full 3-hour university Final Assessment Test with both Part A (short answers) and Part B (long design).`;
      } else {
        primaryTopic = `${courseTitle} Master Formula Book & Theorem Checklist`;
        theme = `Day 7: 5-Module Master Review & Confidence Lock`;
        reason = `Consolidate formulas across all 5 modules, review common traps, and achieve peak mental clarity.`;
      }
    }

    // Check if day topic intersects with user's lagging topics
    if (laggingTopics.some((lt) => primaryTopic.toLowerCase().includes(lt.toLowerCase()))) {
      isLaggingFocus = true;
    }

    const task1Id = `road-${courseCode}-${examType}-d${dayNumber}-1`;
    const task2Id = `road-${courseCode}-${examType}-d${dayNumber}-2`;
    const task3Id = `road-${courseCode}-${examType}-d${dayNumber}-3`;
    const task4Id = `road-${courseCode}-${examType}-d${dayNumber}-4`;

    const tasks: StudyTask[] = [
      {
        id: task1Id,
        title: `Concept Mastery: ${primaryTopic}`,
        topic: primaryTopic,
        concept: `${primaryTopic} Core Principles & Equations`,
        durationMinutes: mConcept,
        type: 'Concept Review',
        completed: false,
        skipped: false,
        priorityScore: isLaggingFocus ? 96 : 85,
        reason: isLaggingFocus
          ? 'Diagnosed lagging topic. Rebuild fundamentals from ground up.'
          : `Core syllabus requirement for VIT-AP ${examLabel} examination.`,
      },
      {
        id: task2Id,
        title: `Solve 4 Verified ${examLabel} PYQ Problems on ${primaryTopic}`,
        topic: primaryTopic,
        concept: `${examLabel} Past Paper Question Patterns & Step Mark Scheme`,
        durationMinutes: mPyq,
        type: 'PYQ Solving',
        completed: false,
        skipped: false,
        priorityScore: 92,
        reason: `Repeated questions from previous 5-year VIT-AP ${examLabel} papers.`,
      },
      {
        id: task3Id,
        title: `Drill on Edge Cases, Calculation Accuracy & Design Variations`,
        topic: primaryTopic,
        concept: 'Step-by-step working and common examiner trap avoidance',
        durationMinutes: mPractice,
        type: 'Practice Drill',
        completed: false,
        skipped: false,
        priorityScore: 84,
        reason: 'Eliminates silly calculation mistakes to secure full marks.',
      },
      {
        id: task4Id,
        title: `15-Min Quick Quiz: Active Recall on ${primaryTopic}`,
        topic: primaryTopic,
        concept: 'Rapid memory consolidation and self-evaluation',
        durationMinutes: mTest,
        type: 'Mini-test',
        completed: false,
        skipped: false,
        priorityScore: 80,
        reason: 'Active recall drill to verify retention before moving forward.',
      },
    ];

    days.push({
      dayNumber,
      dateStr,
      theme,
      totalMinutes: totalDailyMinutes,
      priorityScore: 95 - (dayNumber * 2),
      reason,
      tasks,
    });
  }

  return days;
}

