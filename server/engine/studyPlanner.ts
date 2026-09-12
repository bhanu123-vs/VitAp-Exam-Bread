import { PriorityItem, StudyPlanDay, StudyTask, Topic } from '../../src/types.js';

export function generateAdaptive7DayPlan(
  priorities: PriorityItem[],
  dailyHours: number = 2,
  completedTaskIds: Set<string> = new Set(),
  skippedTaskIds: Set<string> = new Set()
): StudyPlanDay[] {
  const totalDailyMinutes = Math.max(60, dailyHours * 60);

  // Take top topics by priority score
  const sortedTopics = [...priorities].sort((a, b) => b.priorityScore - a.priorityScore);

  const days: StudyPlanDay[] = [];
  const today = new Date();

  // Curate 7 days prioritizing the highest-priority topics
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(today);
    dayDate.setDate(today.getDate() + i);
    const dateStr = dayDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    // Select topic for this day
    const topicItem = sortedTopics[i % sortedTopics.length] || sortedTopics[0];
    const dayNumber = i + 1;

    // Distribute daily minutes across task types
    // Concept Review (35%), PYQ Solving (30%), Practice Drill (20%), Revision/Mini-test (15%)
    const conceptMins = Math.round(totalDailyMinutes * 0.35);
    const pyqMins = Math.round(totalDailyMinutes * 0.30);
    const practiceMins = Math.round(totalDailyMinutes * 0.20);
    const testMins = totalDailyMinutes - (conceptMins + pyqMins + practiceMins);

    const task1Id = `task-d${dayNumber}-1`;
    const task2Id = `task-d${dayNumber}-2`;
    const task3Id = `task-d${dayNumber}-3`;
    const task4Id = `task-d${dayNumber}-4`;

    const tasks: StudyTask[] = [
      {
        id: task1Id,
        title: `${topicItem.topic} Core Concepts & Theory`,
        topic: topicItem.topic,
        concept: `${topicItem.topic} Fundamentals & Architectures`,
        durationMinutes: conceptMins,
        type: 'Concept Review',
        completed: completedTaskIds.has(task1Id),
        skipped: skippedTaskIds.has(task1Id),
        priorityScore: topicItem.priorityScore,
        reason: `High exam frequency (${topicItem.yearsAppeared}) and low accuracy (${topicItem.studentAccuracy}%)`,
      },
      {
        id: task2Id,
        title: `Solve 5 High-Yield PYQs from 2021-2025`,
        topic: topicItem.topic,
        concept: `Historical Exam Numericals & Proofs`,
        durationMinutes: pyqMins,
        type: 'PYQ Solving',
        completed: completedTaskIds.has(task2Id),
        skipped: skippedTaskIds.has(task2Id),
        priorityScore: topicItem.priorityScore,
        reason: `Targeting recurring questions with ${topicItem.historicalMarks} historical marks`,
      },
      {
        id: task3Id,
        title: `Adaptive Practice Drill (Weak Subtopics)`,
        topic: topicItem.topic,
        concept: `Targeted practice on edge-cases`,
        durationMinutes: practiceMins,
        type: 'Practice Drill',
        completed: completedTaskIds.has(task3Id),
        skipped: skippedTaskIds.has(task3Id),
        priorityScore: topicItem.priorityScore,
        reason: `Strengthen accuracy from current ${topicItem.studentAccuracy}%`,
      },
      {
        id: task4Id,
        title: `10-Minute Timed Mini-Test & Reflection`,
        topic: topicItem.topic,
        concept: `Exam simulation under time constraints`,
        durationMinutes: testMins,
        type: 'Mini-test',
        completed: completedTaskIds.has(task4Id),
        skipped: skippedTaskIds.has(task4Id),
        priorityScore: topicItem.priorityScore,
        reason: `Verify retention of ${topicItem.topic}`,
      },
    ];

    days.push({
      dayNumber,
      dateStr,
      theme: `Day ${dayNumber}: ${topicItem.topic} Mastery`,
      totalMinutes: totalDailyMinutes,
      priorityScore: topicItem.priorityScore,
      reason: topicItem.whyReasons[0] + ' • ' + topicItem.whyReasons[3],
      tasks,
    });
  }

  return days;
}
