// Refactoring Service
// Provides smart refactoring suggestions with side-by-side comparisons

export interface RefactoringSuggestion {
  id: string;
  type: "performance" | "readability" | "maintainability" | "memory";
  title: string;
  description: string;
  originalCode: string;
  refactoredCode: string;
  improvements: string[];
  complexityBefore: { time: string; space: string };
  complexityAfter: { time: string; space: string };
  lineNumbers: number[];
}

export interface RefactoringResult {
  suggestions: RefactoringSuggestion[];
  overallImprovement: string;
}

class RefactoringService {
  public analyzeRefactoring(
    code: string,
    language: string
  ): RefactoringResult {
    const suggestions: RefactoringSuggestion[] = [];

    // Check for recursive Fibonacci (can be memoized)
    if (this.isRecursiveFibonacci(code)) {
      suggestions.push(this.suggestMemoization(code, language));
    }

    // Check for nested loops
    if (this.hasNestedLoops(code)) {
      suggestions.push(this.suggestLoopOptimization(code, language));
    }

    // Check for repeated code
    if (this.hasRepeatedCode(code)) {
      suggestions.push(this.suggestExtractFunction(code, language));
    }

    // Check for inefficient array operations
    if (this.hasInefficientArrayOps(code)) {
      suggestions.push(this.suggestArrayOptimization(code, language));
    }

    const overallImprovement = this.generateOverallImprovement(suggestions);

    return {
      suggestions,
      overallImprovement,
    };
  }

  private isRecursiveFibonacci(code: string): boolean {
    return (
      code.includes("fibonacci") &&
      code.includes("return") &&
      code.includes("+") &&
      code.includes("(") &&
      !code.includes("memo") &&
      !code.includes("cache")
    );
  }

  private suggestMemoization(
    code: string,
    language: string
  ): RefactoringSuggestion {
    const lines = code.split("\n");
    const functionLine = lines.findIndex((line) =>
      line.includes("function") || line.includes("def")
    );

    let refactoredCode = code;
    if (language === "javascript") {
      refactoredCode = `const memo = {};\n${code.replace(
        /function\s+fibonacci\(n\)\s*\{/,
        `function fibonacci(n) {\n  if (n in memo) return memo[n];`
      ).replace(
        /return\s+fibonacci\(n\s*-\s*1\)\s*\+\s*fibonacci\(n\s*-\s*2\)/,
        `memo[n] = fibonacci(n - 1) + fibonacci(n - 2);\n  return memo[n]`
      )}`;
    } else if (language === "python") {
      refactoredCode = `memo = {}\n${code.replace(
        /def\s+fibonacci\(n\):/,
        `def fibonacci(n):\n    if n in memo:\n        return memo[n]`
      ).replace(
        /return\s+fibonacci\(n\s*-\s*1\)\s*\+\s*fibonacci\(n\s*-\s*2\)/,
        `memo[n] = fibonacci(n - 1) + fibonacci(n - 2)\n    return memo[n]`
      )}`;
    }

    return {
      id: "memoization",
      type: "performance",
      title: "Add Memoization",
      description:
        "This recursive function recalculates the same values multiple times. Memoization stores previously computed results.",
      originalCode: code,
      refactoredCode,
      improvements: [
        "Reduces time complexity from O(2^n) to O(n)",
        "Eliminates redundant recursive calls",
        "Significantly improves performance for larger inputs",
      ],
      complexityBefore: { time: "O(2^n)", space: "O(n)" },
      complexityAfter: { time: "O(n)", space: "O(n)" },
      lineNumbers: [functionLine + 1],
    };
  }

  private hasNestedLoops(code: string): boolean {
    const forLoops = code.match(/for\s*\(/g) || [];
    return forLoops.length >= 2;
  }

  private suggestLoopOptimization(
    code: string,
    language: string
  ): RefactoringSuggestion {
    return {
      id: "loop-optimization",
      type: "performance",
      title: "Optimize Nested Loops",
      description:
        "Consider early exit conditions or algorithm improvements to reduce nested loop complexity.",
      originalCode: code,
      refactoredCode: code + "\n// Consider: Can any loops be combined or eliminated?",
      improvements: [
        "Potential to reduce time complexity",
        "Consider using more efficient data structures",
        "Look for opportunities to cache intermediate results",
      ],
      complexityBefore: { time: "O(n²)", space: "O(1)" },
      complexityAfter: { time: "O(n log n)", space: "O(1)" },
      lineNumbers: [],
    };
  }

  private hasRepeatedCode(code: string): boolean {
    const lines = code.split("\n").filter((l) => l.trim());
    const uniqueLines = new Set(lines.map((l) => l.trim()));
    return lines.length - uniqueLines.size > 2;
  }

  private suggestExtractFunction(
    code: string,
    language: string
  ): RefactoringSuggestion {
    return {
      id: "extract-function",
      type: "maintainability",
      title: "Extract Repeated Code",
      description:
        "Repeated code blocks should be extracted into reusable functions.",
      originalCode: code,
      refactoredCode: code + "\n// Extract common logic into helper functions",
      improvements: [
        "Improves code maintainability",
        "Reduces duplication",
        "Makes code easier to test",
      ],
      complexityBefore: { time: "O(n)", space: "O(1)" },
      complexityAfter: { time: "O(n)", space: "O(1)" },
      lineNumbers: [],
    };
  }

  private hasInefficientArrayOps(code: string): boolean {
    return (
      code.includes(".shift()") ||
      code.includes(".unshift()") ||
      code.includes(".splice(0")
    );
  }

  private suggestArrayOptimization(
    code: string,
    language: string
  ): RefactoringSuggestion {
    return {
      id: "array-optimization",
      type: "performance",
      title: "Optimize Array Operations",
      description:
        "Array operations like shift() and unshift() are O(n). Consider using alternative approaches.",
      originalCode: code,
      refactoredCode: code.replace(
        /.shift\(\)/g,
        ".pop() // or use index-based access"
      ),
      improvements: [
        "Reduces time complexity for array operations",
        "Consider using index-based access",
        "May improve overall performance",
      ],
      complexityBefore: { time: "O(n)", space: "O(1)" },
      complexityAfter: { time: "O(1)", space: "O(1)" },
      lineNumbers: [],
    };
  }

  private generateOverallImprovement(
    suggestions: RefactoringSuggestion[]
  ): string {
    if (suggestions.length === 0) {
      return "No refactoring suggestions at this time. Your code looks good!";
    }

    const performanceCount = suggestions.filter(
      (s) => s.type === "performance"
    ).length;
    const maintainabilityCount = suggestions.filter(
      (s) => s.type === "maintainability"
    ).length;

    return `Found ${suggestions.length} refactoring suggestion(s): ${performanceCount} performance improvement(s) and ${maintainabilityCount} maintainability improvement(s).`;
  }
}

export const refactoringService = new RefactoringService();

