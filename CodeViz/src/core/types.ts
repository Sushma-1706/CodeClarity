export interface AnalysisResult {
  patterns: {
    id: string;
    confidence: number;
    explanation: string;
    lines: number[];
  }[];

  complexity: {
    time: string;
    space: string;
  };

  metrics: {
    cyclomatic: number;
    functions: number;
    loops: number;
  };
}
