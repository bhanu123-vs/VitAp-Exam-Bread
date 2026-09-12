import { Question } from '../../src/types.js';

export interface ParsedQuestionDraft {
  questionNumber: string;
  section: string;
  questionText: string;
  marks: number;
  pageNumber: number;
  questionType: Question['questionType'];
  difficulty: Question['difficulty'];
  topic: string;
  subtopic: string;
  concept: string;
  confidence: number;
}

const TOPIC_TAXONOMY: {
  topic: string;
  subtopics: { name: string; keywords: string[] }[];
}[] = [
  {
    topic: 'Deadlocks',
    subtopics: [
      { name: "Banker's Algorithm", keywords: ["banker's", 'safe state', 'safety algorithm', 'allocation matrix', 'need matrix', 'available vector'] },
      { name: 'Deadlock Prevention', keywords: ['prevention', 'circular wait', 'hold and wait', 'mutual exclusion', 'preemption'] },
      { name: 'Resource Allocation Graph', keywords: ['rag', 'resource allocation graph', 'cycle in graph', 'request edge', 'assignment edge'] },
      { name: 'Deadlock Detection', keywords: ['detection', 'wait-for graph', 'recovery from deadlock'] },
    ],
  },
  {
    topic: 'CPU Scheduling',
    subtopics: [
      { name: 'Round Robin', keywords: ['round robin', 'quantum', 'time quantum', 'slice'] },
      { name: 'SJF Preemptive / Non-preemptive', keywords: ['sjf', 'shortest job first', 'srtf', 'remaining time first'] },
      { name: 'Priority Scheduling', keywords: ['priority scheduling', 'aging', 'starvation'] },
      { name: 'Multilevel Feedback Queue', keywords: ['multilevel', 'feedback queue', 'mlfq'] },
    ],
  },
  {
    topic: 'Process Synchronization',
    subtopics: [
      { name: 'Semaphores', keywords: ['semaphore', 'wait()', 'signal()', 'counting semaphore', 'binary semaphore'] },
      { name: "Peterson's Algorithm", keywords: ["peterson's", 'critical section', 'turn variable', 'flag array'] },
      { name: 'Dining Philosophers', keywords: ['dining philosophers', 'chopsticks', 'philosophers'] },
      { name: 'Producer-Consumer Problem', keywords: ['producer consumer', 'bounded buffer', 'empty full mutex'] },
    ],
  },
  {
    topic: 'Virtual Memory',
    subtopics: [
      { name: 'Page Replacement (LRU, FIFO, Optimal)', keywords: ['page replacement', 'lru', 'fifo', 'belady', 'page fault', 'reference string'] },
      { name: 'Thrashing', keywords: ['thrashing', 'working set', 'page fault frequency'] },
      { name: 'Demand Paging', keywords: ['demand paging', 'page fault handler', 'swap space'] },
    ],
  },
  {
    topic: 'Memory Management',
    subtopics: [
      { name: 'TLB Architecture', keywords: ['tlb', 'translation lookaside', 'effective memory access', 'emat', 'hit ratio'] },
      { name: 'Fragmentation', keywords: ['internal fragmentation', 'external fragmentation', 'compaction'] },
      { name: 'Paging & Segmentation', keywords: ['page table', 'segment table', 'base register', 'limit register'] },
    ],
  },
  {
    topic: 'File Systems',
    subtopics: [
      { name: 'Inode Structure', keywords: ['inode', 'direct pointer', 'indirect pointer', 'double indirect'] },
      { name: 'File Allocation Methods', keywords: ['contiguous allocation', 'linked allocation', 'indexed allocation'] },
      { name: 'Directory Structures', keywords: ['two-level directory', 'tree structured', 'acyclic graph'] },
    ],
  },
  {
    topic: 'Disk Scheduling',
    subtopics: [
      { name: 'SCAN & C-SCAN', keywords: ['scan', 'c-scan', 'elevator algorithm', 'head movement', 'cylinder'] },
      { name: 'SSTF & LOOK', keywords: ['sstf', 'shortest seek', 'look', 'c-look'] },
    ],
  },
];

export function classifyQuestion(text: string): {
  topic: string;
  subtopic: string;
  concept: string;
  confidence: number;
} {
  const lower = text.toLowerCase();
  let bestTopic = 'Operating Systems Overview';
  let bestSubtopic = 'General Concepts';
  let bestConcept = 'OS Fundamentals';
  let maxScore = 0;

  for (const t of TOPIC_TAXONOMY) {
    for (const sub of t.subtopics) {
      let score = 0;
      for (const kw of sub.keywords) {
        if (lower.includes(kw)) {
          score += kw.split(' ').length * 2;
        }
      }
      if (score > maxScore) {
        maxScore = score;
        bestTopic = t.topic;
        bestSubtopic = sub.name;
        bestConcept = sub.keywords[0];
      }
    }
  }

  const confidence = maxScore > 0 ? Math.min(0.98, 0.75 + maxScore * 0.05) : 0.65;

  return {
    topic: bestTopic,
    subtopic: bestSubtopic,
    concept: bestConcept,
    confidence: Number(confidence.toFixed(2)),
  };
}

export function parseRawTextIntoQuestions(
  rawText: string,
  paperId: string,
  year: number,
  subject: string
): Question[] {
  const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);
  const questions: Question[] = [];

  let currentSection = 'Section A';
  let currentQNum = '';
  let currentTextLines: string[] = [];
  let currentMarks = 8;
  let pageNumber = 1;

  // Pattern for Question start:
  // e.g., "Q1", "Q1(a)", "1.", "1(a)", "1. (a)", "Question 1:"
  const qStartRegex = /^(?:Q(?:uestion)?\s*(\d+[a-zA-Z\(\)]*)|(\d+)[\.\)]\s*(?:\(([a-zA-Z0-9]+)\))?)/i;
  // Pattern for marks: e.g. [5 Marks], (10M), [7M], [10 marks]
  const marksRegex = /\[?\s*(\d+)\s*(?:marks?|m)\s*\]?/i;
  // Section headers: e.g. "Section A", "Part B"
  const sectionRegex = /^(?:Section|Part)\s+([A-Z])/i;

  const flushQuestion = () => {
    if (currentTextLines.length > 0 && currentQNum) {
      const fullText = currentTextLines.join(' ').trim();
      if (fullText.length > 15) {
        const classified = classifyQuestion(fullText);

        let qType: Question['questionType'] = 'Conceptual';
        const lower = fullText.toLowerCase();
        if (lower.includes('calculate') || lower.includes('compute') || lower.includes('given') && lower.includes('matrix')) {
          qType = 'Numerical';
        } else if (lower.includes('algorithm') || lower.includes('gantt') || lower.includes('code') || lower.includes('wait(')) {
          qType = 'Algorithmic';
        } else if (lower.includes('compare') || lower.includes('differentiate') || lower.includes('versus') || lower.includes('vs')) {
          qType = 'Comparative';
        }

        const difficulty: Question['difficulty'] =
          currentMarks >= 10 || fullText.length > 200 ? 'Hard' : currentMarks >= 7 ? 'Medium' : 'Easy';

        questions.push({
          id: `q-${year}-${questions.length + 1}`,
          paperId,
          year,
          subject,
          questionNumber: currentQNum,
          section: currentSection,
          questionText: fullText,
          normalizedText: fullText.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' '),
          marks: currentMarks,
          pageNumber,
          questionType: qType,
          difficulty,
          topic: classified.topic,
          subtopic: classified.subtopic,
          concept: classified.concept,
          confidence: classified.confidence,
          isActualPyq: true,
        });
      }
    }
    currentTextLines = [];
  };

  for (const line of lines) {
    if (line.toLowerCase().includes('page ') || line.match(/---\s*page\s*\d+\s*---/i)) {
      pageNumber++;
      continue;
    }

    const secMatch = line.match(sectionRegex);
    if (secMatch) {
      flushQuestion();
      currentSection = `Section ${secMatch[1]}`;
      continue;
    }

    const qMatch = line.match(qStartRegex);
    if (qMatch) {
      flushQuestion();
      currentQNum = qMatch[1] || (qMatch[3] ? `${qMatch[2]}(${qMatch[3]})` : `Q${qMatch[2]}`);
      let rest = line.substring(qMatch[0].length).trim();

      const mMatch = rest.match(marksRegex);
      if (mMatch) {
        currentMarks = parseInt(mMatch[1], 10);
        rest = rest.replace(marksRegex, '').trim();
      } else {
        currentMarks = 8;
      }

      currentTextLines.push(rest);
    } else {
      const mMatch = line.match(marksRegex);
      if (mMatch) {
        currentMarks = parseInt(mMatch[1], 10);
      }
      currentTextLines.push(line);
    }
  }

  flushQuestion();

  return questions;
}
