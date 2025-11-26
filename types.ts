export enum Severity {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  INFO = 'info'
}

export enum IssueCategory {
  READABILITY = 'readability',
  MODULARITY = 'modularity',
  CODE_SMELL = 'code_smell',
  BUG = 'bug',
  BEST_PRACTICE = 'best_practice',
  SECURITY = 'security'
}

export interface Issue {
  category: IssueCategory;
  severity: Severity;
  line?: number;
  description: string;
  suggestion: string;
}

export interface CodeScores {
  readability: number;
  maintainability: number;
  security: number;
  performance: number;
}

export interface ReviewReport {
  id: string;
  fileName: string;
  timestamp: number;
  language: string;
  summary: string;
  scores: CodeScores;
  issues: Issue[];
  rawCode: string;
}

export interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  report: ReviewReport | null;
}