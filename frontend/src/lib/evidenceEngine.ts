
import type { UploadedPDF } from "../components/IntakeDropzone";

export interface EvidenceMatch {
  documentId: string;
  filename: string;
  category: UploadedPDF["category"];
  page: number;
  quote: string;
  relevanceScore: number;
  qualitySignals: string[];
  reviewFlags: string[];
}

export interface EvidenceSearchResult {
  criterionId: string;
  criterion: string;
  reviewStatus: "POTENTIAL_MATCH_FOUND" | "NO_MATCH_FOUND";
  matches: EvidenceMatch[];
}

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "of", "to", "in", "on",
  "for", "with", "within", "from", "by", "is", "are", "was",
  "were", "be", "been", "being", "that", "this", "as", "at",
  "it", "if", "their", "its", "demonstrate", "demonstrates",
  "document", "documentation", "required", "requirement",
]);

const NEGATION_TERMS = [
  "not",
  "no evidence",
  "denies",
  "denied",
  "without",
  "negative for",
  "failed to",
  "does not",
  "did not",
  "unable to",
];

const LIMITATION_TERMS = [
  "incomplete",
  "pending",
  "unavailable",
  "not available",
  "missing",
  "insufficient",
  "unable to assess",
  "limited",
  "could not",
];

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getKeywords(text: string): string[] {
  return normalizeText(text)
    .split(" ")
    .filter(
      (word) => word.length > 2 && !STOP_WORDS.has(word)
    );
}

function findTerms(text: string, terms: string[]): string[] {
  const normalized = normalizeText(text);

  return terms.filter((term) =>
    normalized.includes(normalizeText(term))
  );
}

function createExcerpt(
  pageText: string,
  keywords: string[]
): string {
  const text = pageText.replace(/\s+/g, " ").trim();

  if (!text) return "";

  const normalized = normalizeText(text);

  const positions = keywords
    .map((keyword) => normalized.indexOf(keyword))
    .filter((position) => position >= 0);

  if (positions.length === 0) {
    return text.slice(0, 450);
  }

  const position = Math.min(...positions);
  const start = Math.max(0, position - 100);
  const end = Math.min(text.length, position + 350);

  return text.slice(start, end);
}

function analyzeContext(
  pageText: string,
  matchedKeywords: string[]
): {
  qualitySignals: string[];
  reviewFlags: string[];
} {
  const qualitySignals: string[] = [];
  const reviewFlags: string[] = [];

  const negations = findTerms(pageText, NEGATION_TERMS);
  const limitations = findTerms(pageText, LIMITATION_TERMS);

  if (negations.length > 0) {
    reviewFlags.push(
      "Negation or negative wording detected — review context"
    );
  }

  if (limitations.length > 0) {
    reviewFlags.push(
      "Possible documentation limitation detected"
    );
  }

  if (matchedKeywords.length <= 1) {
    qualitySignals.push(
      "Limited keyword overlap — relevance needs manual review"
    );
  } else {
    qualitySignals.push(
      "Multiple criterion-related terms detected"
    );
  }

  if (pageText.trim().length < 80) {
    qualitySignals.push(
      "Short extracted passage — context may be limited"
    );
  }

  qualitySignals.push(
    "Keyword matching does not establish whether a requirement is fulfilled"
  );

  return {
    qualitySignals,
    reviewFlags,
  };
}

export function searchEvidence(
  criterionId: string,
  criterion: string,
  documents: UploadedPDF[]
): EvidenceSearchResult {
  const keywords = [...new Set(getKeywords(criterion))];

  const matches: EvidenceMatch[] = [];

  if (keywords.length === 0) {
    return {
      criterionId,
      criterion,
      reviewStatus: "NO_MATCH_FOUND",
      matches: [],
    };
  }

  for (const document of documents) {
    if (document.extractionStatus !== "COMPLETED") {
      continue;
    }

    for (const page of document.extractedPages) {
      const normalizedPage = normalizeText(page.text);

      if (!normalizedPage) continue;

      const matchedKeywords = keywords.filter((keyword) =>
        normalizedPage.includes(keyword)
      );

      const relevanceScore =
        matchedKeywords.length / keywords.length;

      // Retrieval heuristic only, not a medical or coverage decision.
      if (relevanceScore < 0.25) continue;

      const context = analyzeContext(
        page.text,
        matchedKeywords
      );

      matches.push({
        documentId: document.id,
        filename: document.filename,
        category: document.category,
        page: page.pageNumber,
        quote: createExcerpt(
          page.text,
          matchedKeywords
        ),
        relevanceScore,
        qualitySignals: context.qualitySignals,
        reviewFlags: context.reviewFlags,
      });
    }
  }

  matches.sort(
    (a, b) => b.relevanceScore - a.relevanceScore
  );

  return {
    criterionId,
    criterion,
    reviewStatus:
      matches.length > 0
        ? "POTENTIAL_MATCH_FOUND"
        : "NO_MATCH_FOUND",
    matches: matches.slice(0, 5),
  };
}
