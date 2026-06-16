export type Lang = "en" | "he";

export interface Dictionary {
  /** UI strings, flat keys */
  ui: Record<string, string>;
  /** Translated category display names, keyed by stable english id */
  categories: Record<string, string>;
  /** Translated questions, keyed by category id, index-aligned with english */
  questions: Record<string, string[]>;
  /** Translated follow-up pushback lines, index-aligned with english */
  followUps: string[];
}
