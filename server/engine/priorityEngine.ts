import { Topic, PriorityItem, Question } from '../../src/types.js';

export function calculatePriorityScores(
  topics: Topic[],
  questions: Question[],
  totalExamYears: number = 5
): PriorityItem[] {
  // Find max frequency and max marks across topics for normalization
  const maxFreq = Math.max(...topics.map((t) => t.frequency), 1);
  const maxMarks = Math.max(...topics.map((t) => t.totalMarks), 1);
  const currentYear = 2025;

  return topics.map((t) => {
    // 1. Frequency score (0-100)
    const frequencyScore = Math.min(100, Math.round((t.frequency / maxFreq) * 100));

    // 2. Student Weakness score (0-100) - lower accuracy means higher weakness
    const weaknessScore = Math.max(0, Math.min(100, 100 - t.studentAccuracy));

    // 3. Marks Weight score (0-100)
    const marksScore = Math.min(100, Math.round((t.totalMarks / maxMarks) * 100));

    // 4. Recency score (0-100) - did it appear in the most recent years (2024, 2025)?
    const has2025 = t.yearsAppearing.includes(currentYear);
    const has2024 = t.yearsAppearing.includes(currentYear - 1);
    let recencyScore = 40;
    if (has2025 && has2024) recencyScore = 100;
    else if (has2025) recencyScore = 85;
    else if (has2024) recencyScore = 70;

    // 5. Recurrence score (0-100) - percentage of evaluated years it appeared in
    const recurrenceRate = t.yearsAppearing.length / Math.max(totalExamYears, 1);
    const recurrenceScore = Math.min(100, Math.round(recurrenceRate * 100));

    // Weighted Formula:
    // Priority Score = (Frequency * 0.25) + (Weakness * 0.35) + (Marks * 0.15) + (Recency * 0.15) + (Recurrence * 0.10)
    const rawPriority =
      frequencyScore * 0.25 +
      weaknessScore * 0.35 +
      marksScore * 0.15 +
      recencyScore * 0.15 +
      recurrenceScore * 0.10;

    const priorityScore = Math.min(100, Math.max(10, Math.round(rawPriority)));

    // Quadrant calculation for 2D Matrix
    // Thresholds: Frequency >= 50, Weakness >= 40
    let quadrant: PriorityItem['quadrant'] = 'LOW PRIORITY';
    if (frequencyScore >= 50 && weaknessScore >= 40) {
      quadrant = 'STUDY FIRST';
    } else if (frequencyScore >= 50 && weaknessScore < 40) {
      quadrant = 'MAINTAIN';
    } else if (frequencyScore < 50 && weaknessScore >= 40) {
      quadrant = 'SECONDARY';
    } else {
      quadrant = 'LOW PRIORITY';
    }

    // Evidence & Reasons
    const whyReasons: string[] = [
      `Appeared ${t.frequency} times in historical question papers`,
      `Appeared in ${t.yearsAppearing.length}/${totalExamYears} exam years (${t.yearsAppearing.join(', ')})`,
      `${t.totalMarks} total historical marks attributed`,
      `Current student accuracy: ${t.studentAccuracy}% (Weakness factor: ${weaknessScore}%)`,
    ];

    if (has2025) {
      whyReasons.push(`Tested by examiner in the most recent 2025 paper`);
    }

    let recommendation = 'Low priority review';
    if (priorityScore >= 85) {
      recommendation = 'CRITICAL — Study First';
    } else if (priorityScore >= 70) {
      recommendation = 'HIGH PRIORITY — Core Topic';
    } else if (priorityScore >= 50) {
      recommendation = 'MODERATE — Practice Key PYQs';
    }

    // Estimated study time based on weakness & difficulty
    let estimatedStudyTimeMinutes = 30;
    if (t.difficulty === 'Hard') estimatedStudyTimeMinutes = 45;
    if (weaknessScore > 50) estimatedStudyTimeMinutes += 15;

    return {
      topic: t.name,
      priorityScore,
      frequencyScore,
      weaknessScore,
      marksScore,
      recencyScore,
      recurrenceScore,
      frequencyCount: t.frequency,
      yearsAppeared: `${t.yearsAppearing.length}/${totalExamYears} years`,
      historicalMarks: t.totalMarks,
      studentAccuracy: t.studentAccuracy,
      recommendation,
      whyReasons,
      estimatedStudyTimeMinutes,
      quadrant,
    };
  }).sort((a, b) => b.priorityScore - a.priorityScore);
}

export function getWhatShouldIStudyNow(priorityItems: PriorityItem[]) {
  if (!priorityItems || priorityItems.length === 0) return null;
  const top = priorityItems[0];
  return {
    topic: top.topic,
    priorityScore: top.priorityScore,
    reason: `Appeared in ${top.yearsAppeared} and your current accuracy is only ${top.studentAccuracy}%.`,
    estimatedTime: `${top.estimatedStudyTimeMinutes} minutes`,
    quadrant: top.quadrant,
    recommendation: top.recommendation,
    whyReasons: top.whyReasons,
    frequencyCount: top.frequencyCount,
    historicalMarks: top.historicalMarks,
  };
}
