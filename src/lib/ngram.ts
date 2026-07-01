/** Build word n-grams from normalized text (default trigrams). */
export function buildNgrams(text: string, n = 3): Set<string> {
  const normalized = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = normalized.split(" ").filter(Boolean);
  const grams = new Set<string>();
  for (let i = 0; i <= words.length - n; i++) {
    grams.add(words.slice(i, i + n).join(" "));
  }
  return grams;
}

/**
 * N-gram overlap vs reference texts — returns plagiarism similarity % (0–100).
 * Higher = more overlapping sequences with known sources.
 */
export function ngramPlagiarismPercent(text: string, references: string[], n = 3): number {
  const source = buildNgrams(text, n);
  if (source.size === 0) return 0;

  let maxRatio = 0;
  for (const ref of references) {
    const refGrams = buildNgrams(ref, n);
    if (refGrams.size === 0) continue;
    let intersection = 0;
    for (const g of source) {
      if (refGrams.has(g)) intersection++;
    }
    const ratio = intersection / source.size;
    maxRatio = Math.max(maxRatio, ratio);
  }

  return Math.min(100, Math.round(maxRatio * 100));
}

export interface ReferenceSource {
  source: string;
  text: string;
}

/** Reference database for N-gram comparison. */
export const REFERENCE_SOURCES: ReferenceSource[] = [
  {
    source: "Wikipedia - Machine Learning",
    text: "Machine learning is a subset of artificial intelligence that provides systems the ability to automatically learn and improve from experience.",
  },
  {
    source: "Stanford CS229 Notes",
    text: "The algorithm iterates through the dataset multiple times adjusting weights based on the error gradient.",
  },
  {
    source: "Deep Learning Book, Goodfellow et al.",
    text: "Neural networks consist of layers of interconnected nodes that process information using connectionist approaches.",
  },
  {
    source: "Academic Integrity Handbook",
    text: "Plagiarism is the representation of another author language thoughts ideas or expressions as one's own original work.",
  },
  {
    source: "University Policy",
    text: "Academic integrity requires students to submit work that reflects their own understanding and effort.",
  },
];

export const REFERENCE_CORPUS = REFERENCE_SOURCES.map((r) => r.text);

export interface NgramMatch {
  text: string;
  source: string;
  similarity: number;
}

/** Find sources with overlapping N-grams (for highlighted matches). */
export function findNgramMatches(
  text: string,
  references: ReferenceSource[] = REFERENCE_SOURCES,
  n = 3,
  minSimilarity = 5
): NgramMatch[] {
  const sourceGrams = buildNgrams(text, n);
  if (sourceGrams.size === 0) return [];

  const matches: NgramMatch[] = [];
  for (const ref of references) {
    const refGrams = buildNgrams(ref.text, n);
    if (refGrams.size === 0) continue;
    let intersection = 0;
    for (const g of sourceGrams) {
      if (refGrams.has(g)) intersection++;
    }
    const similarity = Math.min(100, Math.round((intersection / sourceGrams.size) * 100));
    if (similarity >= minSimilarity) {
      matches.push({ text: ref.text, source: ref.source, similarity });
    }
  }
  return matches.sort((a, b) => b.similarity - a.similarity);
}
