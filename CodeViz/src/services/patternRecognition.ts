// Direct code pattern recognition engine
// Detects patterns from code features at runtime (no static pattern dataset)

import { visualizationEngine } from "@/services/visualizationEngine";

export interface CodePattern {
  id: string;
  name: string;
  type: "algorithm" | "data-structure" | "design-pattern" | "anti-pattern";
  confidence: number;
  description: string;
  explanation: {
    simplified: string;
    technical: string;
  };
  visualization: {
    type: "flowchart" | "tree" | "graph" | "sequence";
    data: any;
  };
  examples: string[];
  optimizations?: string[];
  complexity: {
    time: string;
    space: string;
  };
  tags: string[];
}

export interface PatternAnalysisResult {
  patterns: CodePattern[];
  mainPattern: CodePattern | null;
  codeStructure: {
    functions: number;
    loops: number;
    conditionals: number;
    recursion: boolean;
  };
  suggestions: string[];
}

type InternalPattern = {
  key: string;
  name: string;
  type: CodePattern["type"];
  confidence: number;
  description: string;
  simplified: string;
  technical: string;
  complexity: { time: string; space: string };
  tags: string[];
  examples: string[];
  optimizations?: string[];
  canonicalVisualizationId?: string;
};

class PatternRecognitionEngine {
  private latestPatterns: Map<string, CodePattern> = new Map();

  public analyzeCode(code: string, language: string): PatternAnalysisResult {
    if (!code.trim()) {
      this.latestPatterns.clear();
      return {
        patterns: [],
        mainPattern: null,
        codeStructure: {
          functions: 0,
          loops: 0,
          conditionals: 0,
          recursion: false,
        },
        suggestions: [],
      };
    }

    const structure = this.analyzeCodeStructure(code, language);
    const candidates = this.detectPatterns(code, language, structure)
      .map((candidate) => this.toCodePattern(candidate, structure))
      .sort((a, b) => b.confidence - a.confidence);

    const patterns = candidates.length > 0 ? candidates : [this.buildFallbackPattern(code, structure)];
    const mainPattern = patterns[0] || null;

    this.latestPatterns = new Map(patterns.map((pattern) => [pattern.id, pattern]));

    return {
      patterns,
      mainPattern,
      codeStructure: structure,
      suggestions: this.generateSuggestions(patterns, structure),
    };
  }

  public getPatternVisualization(patternId: string): any {
    return this.latestPatterns.get(patternId)?.visualization || null;
  }

  public getPatternExplanation(patternId: string, level: "simplified" | "technical"): string {
    return this.latestPatterns.get(patternId)?.explanation[level] || "";
  }

  private toCodePattern(candidate: InternalPattern, structure: PatternAnalysisResult["codeStructure"]): CodePattern {
    return {
      id: candidate.key,
      name: candidate.name,
      type: candidate.type,
      confidence: this.clampConfidence(candidate.confidence),
      description: candidate.description,
      explanation: {
        simplified: candidate.simplified,
        technical: candidate.technical,
      },
      visualization: this.buildVisualization(candidate, structure),
      examples: candidate.examples,
      optimizations: candidate.optimizations,
      complexity: candidate.complexity,
      tags: candidate.tags,
    };
  }

  private buildVisualization(
    candidate: InternalPattern,
    structure: PatternAnalysisResult["codeStructure"]
  ): CodePattern["visualization"] {
    if (candidate.canonicalVisualizationId) {
      const generated = visualizationEngine.generatePatternVisualization(candidate.canonicalVisualizationId);
      if (generated?.type && generated?.data) {
        return generated;
      }
    }

    if (candidate.type === "data-structure") {
      return {
        type: "graph",
        data: {
          nodes: [
            { id: "n1", label: "Node", data: "head" },
            { id: "n2", label: "Node", data: "next" },
            { id: "n3", label: "Node", data: "tail" },
          ],
          operations: ["Insert", "Traverse", "Delete"],
        },
      };
    }

    if (structure.recursion) {
      return {
        type: "tree",
        data: visualizationEngine.generateFibonacciTree(4),
      };
    }

    return {
      type: "flowchart",
      data: this.buildGenericFlow(structure),
    };
  }

  private buildGenericFlow(structure: PatternAnalysisResult["codeStructure"]) {
    const nodes: Array<any> = [
      {
        id: "start",
        label: "Start",
        type: "function",
        metadata: { description: "Program entry" },
      },
    ];

    let previous = "start";
    const connections: Array<{ from: string; to: string; label?: string }> = [];

    if (structure.conditionals > 0) {
      nodes.push({
        id: "condition",
        label: "Evaluate conditions",
        type: "condition",
        metadata: { description: `Condition blocks: ${structure.conditionals}` },
      });
      connections.push({ from: previous, to: "condition" });
      previous = "condition";
    }

    if (structure.loops > 0) {
      nodes.push({
        id: "loop",
        label: "Iterate loop body",
        type: "loop",
        metadata: { description: `Loops detected: ${structure.loops}` },
      });
      connections.push({ from: previous, to: "loop" });
      previous = "loop";
    }

    if (structure.functions > 0) {
      nodes.push({
        id: "function",
        label: "Execute function logic",
        type: "function",
        metadata: { description: `Functions/methods: ${structure.functions}` },
      });
      connections.push({ from: previous, to: "function" });
      previous = "function";
    }

    nodes.push({
      id: "end",
      label: "Return output",
      type: "return",
      metadata: { description: "Program completion" },
    });
    connections.push({ from: previous, to: "end" });

    return { nodes, connections };
  }

  private detectPatterns(
    code: string,
    language: string,
    structure: PatternAnalysisResult["codeStructure"]
  ): InternalPattern[] {
    const normalized = code.toLowerCase();
    const patterns: InternalPattern[] = [];

    const has = (token: string) => normalized.includes(token);
    const hasRegex = (pattern: RegExp) => pattern.test(normalized);

    const fibonacciScore =
      (hasRegex(/\b(fibonacci|fib)\b/) ? 0.35 : 0) +
      (hasRegex(/\(\s*n\s*-\s*1\s*\)/) && hasRegex(/\(\s*n\s*-\s*2\s*\)/) ? 0.45 : 0) +
      (hasRegex(/n\s*(<=|<)\s*(1|2)/) ? 0.2 : 0);

    if (fibonacciScore >= 0.35) {
      patterns.push({
        key: "fibonacci-recursive",
        name: "Recursive Fibonacci Pattern",
        type: "algorithm",
        confidence: fibonacciScore,
        description: "Recursive decomposition where each call branches into smaller subproblems.",
        simplified: "This keeps solving smaller versions of the same problem until it reaches a simple answer.",
        technical:
          "A recursive recurrence f(n)=f(n-1)+f(n-2) with overlapping subproblems and exponential branching unless optimized.",
        complexity: { time: "O(2^n)", space: "O(n)" },
        tags: ["recursion", "divide-and-conquer", "sequence"],
        examples: ["fib(n)", "fibonacci(n)"],
        optimizations: ["Use memoization to avoid repeated calls", "Use iterative dynamic programming"],
        canonicalVisualizationId: "fibonacci-recursive",
      });
    }

    const binarySearchScore =
      ((has("left") || has("low")) && (has("right") || has("high")) ? 0.3 : 0) +
      (hasRegex(/\b(mid|middle)\b/) ? 0.2 : 0) +
      (hasRegex(/\[\s*mid\s*\]/) ? 0.2 : 0) +
      ((has("target") || has("key")) && (has("left = mid + 1") || has("right = mid - 1")) ? 0.3 : 0);

    if (binarySearchScore >= 0.4) {
      patterns.push({
        key: "binary-search",
        name: "Binary Search Pattern",
        type: "algorithm",
        confidence: binarySearchScore,
        description: "Shrinks a sorted search range by comparing against the middle element.",
        simplified: "It checks the middle, then throws away half the list each step.",
        technical:
          "A divide-and-conquer search strategy over sorted data with logarithmic search depth.",
        complexity: { time: "O(log n)", space: "O(1)" },
        tags: ["search", "sorted-data", "divide-and-conquer"],
        examples: ["binary search", "mid/left/right pointer search"],
        canonicalVisualizationId: "binary-search",
      });
    }

    const bubbleSortScore =
      (hasRegex(/for\s*\([\s\S]*for\s*\(/) ? 0.4 : 0) +
      (hasRegex(/\[\s*j\s*\]\s*>\s*\w+\s*\[\s*j\s*\+\s*1\s*\]/) ? 0.35 : 0) +
      (has("swap") || has("temp") || has("swapped") ? 0.25 : 0);

    if (bubbleSortScore >= 0.35) {
      patterns.push({
        key: "bubble-sort",
        name: "Exchange-Based Sorting Pattern",
        type: "algorithm",
        confidence: bubbleSortScore,
        description: "Repeated adjacent comparisons and swaps across passes.",
        simplified: "Big values keep moving to the end by swapping neighbors.",
        technical:
          "Nested iteration with pairwise comparison and conditional swapping; typical bubble-sort style behavior.",
        complexity: { time: "O(n^2)", space: "O(1)" },
        tags: ["sorting", "nested-loops", "in-place"],
        examples: ["adjacent swap loops", "double for sort"],
        optimizations: ["Early-exit when no swaps occur", "Prefer O(n log n) sort for large data"],
        canonicalVisualizationId: "bubble-sort",
      });
    }

    const linkedListScore =
      ((has("node") || has("listnode")) ? 0.35 : 0) +
      ((has("next") || has(".next") || has("->next")) ? 0.35 : 0) +
      ((has("head") || has("tail")) ? 0.3 : 0);

    if (linkedListScore >= 0.4) {
      patterns.push({
        key: "linked-list",
        name: "Linked Structure Pattern",
        type: "data-structure",
        confidence: linkedListScore,
        description: "Node chain managed through references between elements.",
        simplified: "Each item points to the next item, like a treasure hunt clue chain.",
        technical:
          "Pointer/reference-linked nodes with sequential traversal and reference rewiring for updates.",
        complexity: { time: "O(n) traversal, O(1) head insert", space: "O(n)" },
        tags: ["nodes", "references", "sequential-traversal"],
        examples: ["Node.next", "head pointer"],
        canonicalVisualizationId: "linked-list",
      });
    }

    const singletonScore =
      (has("class") ? 0.15 : 0) +
      ((has("static") && has("instance")) ? 0.35 : 0) +
      (has("getinstance") ? 0.35 : 0) +
      ((has("private") && has("constructor")) || hasRegex(/constructor\s*\(/) ? 0.15 : 0);

    if (singletonScore >= 0.4) {
      patterns.push({
        key: "singleton",
        name: "Singleton-Like Instance Control",
        type: "design-pattern",
        confidence: singletonScore,
        description: "Restricts instance creation and exposes a single shared accessor.",
        simplified: "No matter how many times you ask, you get the same object.",
        technical:
          "Global access to a lazily/eagerly initialized shared instance with controlled constructor visibility.",
        complexity: { time: "O(1)", space: "O(1)" },
        tags: ["design-pattern", "instance-control", "static-access"],
        examples: ["getInstance()", "private constructor"],
        canonicalVisualizationId: "singleton",
      });
    }

    const palindromeScore =
      (has("palindrome") ? 0.4 : 0) +
      ((has("original") && (has("rev") || has("reverse"))) ? 0.25 : 0) +
      ((hasRegex(/original\s*==\s*(rev|reverse|reversed)/) || hasRegex(/(rev|reverse|reversed)\s*==\s*original/)) ? 0.3 : 0) +
      (hasRegex(/while\s*\(\s*\w+\s*!=\s*0\s*\)/) ? 0.2 : 0) +
      ((hasRegex(/%\s*10/) && hasRegex(/\/\s*10/)) ? 0.2 : 0);

    if (palindromeScore >= 0.35) {
      patterns.push({
        key: "palindrome-check",
        name: "Palindrome Validation Pattern",
        type: "algorithm",
        confidence: palindromeScore,
        description: "Compares mirrored values from an original and reversed representation.",
        simplified:
          "This logic takes a value, builds its reverse step by step, and then compares both. If both are equal, the value reads the same from both ends, so it is a palindrome.",
        technical:
          "Detected reverse-reconstruction palindrome check: extract trailing digits (mod 10), rebuild reversed number, then compare with the original for symmetry validation.",
        complexity: { time: "O(n)", space: "O(1) to O(n)" },
        tags: ["string", "number", "comparison"],
        examples: ["reverse-and-compare", "two pointers"],
        canonicalVisualizationId: "palindrome-check",
      });
    }

    const dpScore =
      (has("dp") ? 0.25 : 0) +
      (hasRegex(/\b(memo|memoization|cache)\b/) ? 0.25 : 0) +
      (hasRegex(/\b(max|min)\s*\(/) && structure.loops > 0 ? 0.2 : 0) +
      (hasRegex(/\[\s*i\s*\]\[\s*j\s*\]/) ? 0.3 : 0);

    if (dpScore >= 0.35) {
      patterns.push({
        key: "dynamic-programming",
        name: "Dynamic Programming Pattern",
        type: "algorithm",
        confidence: dpScore,
        description: "Builds optimal/subproblem results incrementally in memo/table form.",
        simplified: "It remembers old answers so it does not repeat the same work.",
        technical:
          "Tabulation or memoization over overlapping subproblems with recurrence-based state transitions.",
        complexity: { time: "Varies by state space", space: "Varies by table size" },
        tags: ["memoization", "tabulation", "optimization"],
        examples: ["dp[][]", "memo object"],
      });
    }

    const graphTraversalScore =
      (has("visited") ? 0.25 : 0) +
      ((has("queue") || has("stack")) ? 0.25 : 0) +
      ((has("neighbor") || has("adj") || has("graph")) ? 0.25 : 0) +
      (hasRegex(/for\s*\([^)]*of[^)]*\)/) ? 0.25 : 0);

    if (graphTraversalScore >= 0.4) {
      patterns.push({
        key: "graph-traversal",
        name: "Graph Traversal Pattern",
        type: "algorithm",
        confidence: graphTraversalScore,
        description: "Visits connected nodes with a visited-set and frontier structure.",
        simplified: "It explores connected points one by one, tracking what is already seen.",
        technical:
          "Typical DFS/BFS traversal over adjacency representation with revisitation guard.",
        complexity: { time: "O(V + E)", space: "O(V)" },
        tags: ["graph", "dfs", "bfs", "visited-set"],
        examples: ["dfs(graph, start)", "queue-based bfs"],
      });
    }

    return patterns.map((p) => ({ ...p, confidence: this.clampConfidence(p.confidence) }));
  }

  private buildFallbackPattern(
    code: string,
    structure: PatternAnalysisResult["codeStructure"]
  ): CodePattern {
    const confidence = Math.min(0.45 + structure.loops * 0.08 + structure.conditionals * 0.06, 0.82);

    return {
      id: "detected-control-flow",
      name: "Detected Control-Flow Pattern",
      type: "algorithm",
      confidence,
      description: "General code flow detected from loops, conditionals, and function structure.",
      explanation: {
        simplified: "This code follows a set of steps with decisions and repeated actions.",
        technical:
          "Pattern inferred from structural signals rather than a canonical named template.",
      },
      visualization: {
        type: "flowchart",
        data: this.buildGenericFlow(structure),
      },
      examples: ["custom logic", "application code"],
      complexity: {
        time: structure.loops > 1 ? "Likely O(n^2) or nested-iteration dependent" : "Input-dependent",
        space: "Input-dependent",
      },
      tags: ["control-flow", "custom", "runtime-detected"],
    };
  }

  private analyzeCodeStructure(code: string, language: string) {
    const normalized = code.toLowerCase();
    const functions = (
      code.match(
        /function\s+\w+|def\s+\w+|public\s+(?:static\s+)?\w+[\[\]]*\s+\w+\s*\(|\w+[\[\]]*\s+\w+\s*\([^)]*\)\s*\{/g
      ) || []
    ).length;

    const loops = (code.match(/for\s*\(|while\s*\(|for\s+\w+\s+in\s+/g) || []).length;
    const conditionals = (code.match(/if\s*\(|else\s*if|switch\s*\(/g) || []).length;

    const recursion =
      functions > 0 &&
      (/return[\s\S]*\w+\s*\(/.test(code) || /def\s+(\w+)[\s\S]*\1\s*\(/.test(normalized));

    return {
      functions,
      loops,
      conditionals,
      recursion: Boolean(recursion),
    };
  }

  private generateSuggestions(
    patterns: CodePattern[],
    structure: PatternAnalysisResult["codeStructure"]
  ): string[] {
    const suggestions: string[] = [];

    if (patterns.length === 0) {
      suggestions.push("No strong named pattern found. Add helper methods and clearer naming to improve recognizability.");
    }

    const main = patterns[0];
    if (main) {
      if (main.confidence >= 0.8) {
        suggestions.push(`Strong match for ${main.name}. Keep this structure for readability.`);
      } else if (main.confidence >= 0.5) {
        suggestions.push(`Detected ${main.name}, but structure can be clarified with better naming and decomposition.`);
      } else {
        suggestions.push(`Possible ${main.name} detected with low confidence. Consider simplifying control flow.`);
      }

      if (main.optimizations && main.optimizations.length > 0) {
        suggestions.push(...main.optimizations);
      }
    }

    if (structure.recursion) {
      suggestions.push("Recursion detected. Validate base cases and consider memoization if repeated states occur.");
    }

    if (structure.loops > 2) {
      suggestions.push("Multiple loops detected. Check for avoidable nested iteration to improve scalability.");
    }

    if (structure.conditionals > 4) {
      suggestions.push("High branch count detected. Refactor into smaller guard/helper functions for clarity.");
    }

    return Array.from(new Set(suggestions));
  }

  private clampConfidence(value: number): number {
    return Math.max(0, Math.min(1, Math.round(value * 100) / 100));
  }
}

export const patternRecognitionEngine = new PatternRecognitionEngine();
