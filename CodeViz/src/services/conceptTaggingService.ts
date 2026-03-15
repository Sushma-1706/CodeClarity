// Concept Tagging Service
// Automatically tags and categorizes code concepts

export interface ConceptTag {
  id: string;
  name: string;
  category: "control-flow" | "data-structure" | "algorithm" | "pattern" | "optimization";
  confidence: number;
  lines: number[];
  description: string;
}

export interface TaggedCode {
  code: string;
  language: string;
  tags: ConceptTag[];
  summary: string;
}

class ConceptTaggingService {
  public tagCode(code: string, language: string): TaggedCode {
    const tags: ConceptTag[] = [];

    // Detect loops
    const loopTags = this.detectLoops(code);
    tags.push(...loopTags);

    // Detect recursion
    const recursionTags = this.detectRecursion(code);
    tags.push(...recursionTags);

    // Detect arrays
    const arrayTags = this.detectArrays(code);
    tags.push(...arrayTags);

    // Detect conditions
    const conditionTags = this.detectConditions(code);
    tags.push(...conditionTags);

    // Detect algorithms
    const algorithmTags = this.detectAlgorithms(code);
    tags.push(...algorithmTags);

    // Detect patterns
    const patternTags = this.detectPatterns(code);
    tags.push(...patternTags);

    // Detect optimizations
    const optimizationTags = this.detectOptimizations(code);
    tags.push(...optimizationTags);

    const summary = this.generateSummary(tags);

    return {
      code,
      language,
      tags,
      summary,
    };
  }

  private detectLoops(code: string): ConceptTag[] {
    const tags: ConceptTag[] = [];
    const lines = code.split("\n");

    lines.forEach((line, index) => {
      if (line.includes("for") && line.includes("(")) {
        tags.push({
          id: `loop-for-${index}`,
          name: "For Loop",
          category: "control-flow",
          confidence: 0.95,
          lines: [index + 1],
          description: "Iterative loop that executes a block of code a specific number of times",
        });
      }

      if (line.includes("while") && line.includes("(")) {
        tags.push({
          id: `loop-while-${index}`,
          name: "While Loop",
          category: "control-flow",
          confidence: 0.95,
          lines: [index + 1],
          description: "Iterative loop that executes while a condition is true",
        });
      }

      if (line.includes("do") && line.includes("{")) {
        tags.push({
          id: `loop-do-${index}`,
          name: "Do-While Loop",
          category: "control-flow",
          confidence: 0.9,
          lines: [index + 1],
          description: "Loop that executes at least once, then checks condition",
        });
      }
    });

    return tags;
  }

  private detectRecursion(code: string): ConceptTag[] {
    const tags: ConceptTag[] = [];
    const functionMatches = code.match(/function\s+(\w+)|def\s+(\w+)/g) || [];
    const lines = code.split("\n");

    functionMatches.forEach((fn) => {
      const name = fn.split(/\s+/)[1];
      if (code.includes(`${name}(`)) {
        const functionLine = lines.findIndex((line) => line.includes(fn));
        tags.push({
          id: `recursion-${name}`,
          name: "Recursion",
          category: "control-flow",
          confidence: 0.9,
          lines: functionLine >= 0 ? [functionLine + 1] : [],
          description: "Function that calls itself to solve a problem",
        });
      }
    });

    return tags;
  }

  private detectArrays(code: string): ConceptTag[] {
    const tags: ConceptTag[] = [];
    const lines = code.split("\n");

    lines.forEach((line, index) => {
      if (line.includes("[") && line.includes("]")) {
        tags.push({
          id: `array-${index}`,
          name: "Array",
          category: "data-structure",
          confidence: 0.85,
          lines: [index + 1],
          description: "Data structure that stores elements in indexed positions",
        });
      }
    });

    return tags;
  }

  private detectConditions(code: string): ConceptTag[] {
    const tags: ConceptTag[] = [];
    const lines = code.split("\n");

    lines.forEach((line, index) => {
      if (line.includes("if") && line.includes("(")) {
        tags.push({
          id: `condition-if-${index}`,
          name: "If Statement",
          category: "control-flow",
          confidence: 0.95,
          lines: [index + 1],
          description: "Conditional statement that executes code based on a condition",
        });
      }

      if (line.includes("else")) {
        tags.push({
          id: `condition-else-${index}`,
          name: "Else Clause",
          category: "control-flow",
          confidence: 0.9,
          lines: [index + 1],
          description: "Alternative code path when condition is false",
        });
      }

      if (line.includes("switch") || line.includes("case")) {
        tags.push({
          id: `condition-switch-${index}`,
          name: "Switch Statement",
          category: "control-flow",
          confidence: 0.9,
          lines: [index + 1],
          description: "Multi-way branching based on a value",
        });
      }
    });

    return tags;
  }

  private detectAlgorithms(code: string): ConceptTag[] {
    const tags: ConceptTag[] = [];
    const codeLower = code.toLowerCase();

    if (codeLower.includes("fibonacci") || codeLower.includes("fib")) {
      tags.push({
        id: "algorithm-fibonacci",
        name: "Fibonacci Sequence",
        category: "algorithm",
        confidence: 0.95,
        lines: [],
        description: "Mathematical sequence where each number is the sum of the two preceding ones",
      });
    }

    if (codeLower.includes("binary") && codeLower.includes("search")) {
      tags.push({
        id: "algorithm-binary-search",
        name: "Binary Search",
        category: "algorithm",
        confidence: 0.9,
        lines: [],
        description: "Search algorithm that finds an element in a sorted array",
      });
    }

    if (codeLower.includes("sort")) {
      tags.push({
        id: "algorithm-sort",
        name: "Sorting Algorithm",
        category: "algorithm",
        confidence: 0.85,
        lines: [],
        description: "Algorithm that arranges elements in a specific order",
      });
    }

    return tags;
  }

  private detectPatterns(code: string): ConceptTag[] {
    const tags: ConceptTag[] = [];

    if (code.includes("memo") || code.includes("cache")) {
      tags.push({
        id: "pattern-memoization",
        name: "Memoization",
        category: "pattern",
        confidence: 0.9,
        lines: [],
        description: "Optimization technique that stores computed results",
      });
    }

    if (code.match(/function\s+\w+|def\s+\w+/g)?.length) {
      const funcCount = code.match(/function\s+\w+|def\s+\w+/g)?.length || 0;
      if (funcCount > 1) {
        tags.push({
          id: "pattern-modular",
          name: "Modular Design",
          category: "pattern",
          confidence: 0.8,
          lines: [],
          description: "Code organized into reusable functions",
        });
      }
    }

    return tags;
  }

  private detectOptimizations(code: string): ConceptTag[] {
    const tags: ConceptTag[] = [];

    if (code.includes("memo") || code.includes("cache")) {
      tags.push({
        id: "optimization-memoization",
        name: "Performance Optimization",
        category: "optimization",
        confidence: 0.9,
        lines: [],
        description: "Code uses memoization to improve performance",
      });
    }

    return tags;
  }

  private generateSummary(tags: ConceptTag[]): string {
    if (tags.length === 0) {
      return "No specific concepts detected in the code.";
    }

    const categories = tags.reduce((acc, tag) => {
      acc[tag.category] = (acc[tag.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categoryNames = Object.entries(categories)
      .map(([cat, count]) => `${count} ${cat.replace("-", " ")}`)
      .join(", ");

    return `Detected ${tags.length} concept(s): ${categoryNames}.`;
  }
}

export const conceptTaggingService = new ConceptTaggingService();

