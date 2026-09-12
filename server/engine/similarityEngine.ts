import { Question, QuestionFamily } from '../../src/types.js';

// Clean text for similarity comparison
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'that', 'this', 'from', 'explain', 'describe', 'discuss',
  'what', 'how', 'which', 'given', 'using', 'calculate', 'compute', 'determine', 'system',
  'operating', 'process', 'following', 'consider', 'example', 'write', 'define'
]);

export function calculateTextSimilarity(text1: string, text2: string): number {
  const tokens1 = tokenize(text1);
  const tokens2 = tokenize(text2);
  if (tokens1.length === 0 || tokens2.length === 0) return 0;

  const set1 = new Set(tokens1);
  const set2 = new Set(tokens2);

  let intersection = 0;
  set1.forEach((token) => {
    if (set2.has(token)) intersection++;
  });

  const union = new Set([...tokens1, ...tokens2]).size;
  const jaccard = union === 0 ? 0 : intersection / union;

  // Keyword boost for core terms
  const coreKeywords = ["banker's", 'deadlock', 'scheduling', 'round robin', 'semaphore', 'paging', 'fragmentation', 'inode', 'belady', 'thrashing'];
  let keywordBonus = 0;
  coreKeywords.forEach((kw) => {
    if (text1.toLowerCase().includes(kw) && text2.toLowerCase().includes(kw)) {
      keywordBonus += 0.25;
    }
  });

  const score = Math.min(0.98, jaccard * 0.7 + keywordBonus);
  return Math.round(score * 100);
}

export function detectQuestionFamilies(questions: Question[]): QuestionFamily[] {
  const families: QuestionFamily[] = [];
  const visited = new Set<string>();

  // Sort questions so that the highest-mark questions act as canonical anchors
  const sorted = [...questions].sort((a, b) => b.marks - a.marks);

  for (const q of sorted) {
    if (visited.has(q.id)) continue;

    const similarQuestions: { q: Question; sim: number }[] = [];

    for (const other of questions) {
      if (other.id === q.id) continue;
      // Must be same topic or subtopic
      if (other.topic === q.topic) {
        const sim = calculateTextSimilarity(q.questionText, other.questionText);
        if (sim >= 70) {
          similarQuestions.push({ q: other, sim });
        }
      }
    }

    if (similarQuestions.length > 0) {
      visited.add(q.id);
      similarQuestions.forEach((item) => visited.add(item.q.id));

      const allMembers = [q, ...similarQuestions.map((s) => s.q)];
      const years = Array.from(new Set(allMembers.map((m) => m.year))).sort((a, b) => a - b);
      const avgSim = Math.round(
        similarQuestions.reduce((acc, curr) => acc + curr.sim, 0) / similarQuestions.length
      );

      families.push({
        id: `fam-${q.topic.toLowerCase().replace(/\s+/g, '-')}-${q.id}`,
        underlyingConcept: q.concept || `${q.topic} - ${q.subtopic}`,
        topic: q.topic,
        subtopic: q.subtopic,
        similarityScore: avgSim,
        occurrenceCount: allMembers.length,
        years,
        totalMarks: allMembers.reduce((sum, m) => sum + m.marks, 0),
        canonicalQuestion: q.questionText,
        variations: allMembers.map((m) => ({
          questionId: m.id,
          year: m.year,
          questionText: m.questionText,
          marks: m.marks,
          isActualPyq: m.isActualPyq,
          similarityToCanonical: m.id === q.id ? 100 : calculateTextSimilarity(q.questionText, m.questionText),
        })),
      });
    }
  }

  return families.sort((a, b) => b.occurrenceCount - a.occurrenceCount);
}
