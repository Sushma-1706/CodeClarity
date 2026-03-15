// Error Detection and Code Fixing Service
// Detects syntax errors, logical errors, and provides fixes

export interface CodeError {
  id: string;
  type: "syntax" | "logical" | "performance" | "style";
  severity: "error" | "warning" | "info";
  line: number;
  column?: number;
  message: string;
  code: string;
  suggestion: string;
  fixedCode?: string;
}

export interface CodeFix {
  originalCode: string;
  fixedCode: string;
  errors: CodeError[];
  explanation: string;
  improvements: string[];
}

class ErrorDetectionService {
  public detectErrors(code: string, language: string): CodeError[] {
    const errors: CodeError[] = [];
    const lines = code.split("\n");

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmed = line.trim();

      // Skip empty lines and comments
      if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("#")) return;

      // Syntax error detection
      const syntaxErrors = this.detectSyntaxErrors(line, lineNum, language);
      errors.push(...syntaxErrors);

      // Logical error detection
      const logicalErrors = this.detectLogicalErrors(line, lineNum, language, code);
      errors.push(...logicalErrors);

      // Performance issues
      const performanceIssues = this.detectPerformanceIssues(line, lineNum, language, code);
      errors.push(...performanceIssues);

      // Style issues
      const styleIssues = this.detectStyleIssues(line, lineNum, language);
      errors.push(...styleIssues);
    });

    return errors;
  }

  public fixCode(code: string, language: string, errors: CodeError[]): CodeFix {
    let fixedCode = code;
    const improvements: string[] = [];

    // Sort errors by line number (descending) to fix from bottom to top
    const sortedErrors = [...errors].sort((a, b) => b.line - a.line);

    sortedErrors.forEach((error) => {
      if (error.fixedCode) {
        const lines = fixedCode.split("\n");
        lines[error.line - 1] = error.fixedCode;
        fixedCode = lines.join("\n");
        improvements.push(`Fixed ${error.type} error on line ${error.line}: ${error.message}`);
      }
    });

    // Apply general optimizations
    const optimized = this.applyOptimizations(fixedCode, language);
    if (optimized !== fixedCode) {
      improvements.push("Applied performance optimizations");
      fixedCode = optimized;
    }

    const explanation = this.generateFixExplanation(errors, improvements);

    return {
      originalCode: code,
      fixedCode,
      errors,
      explanation,
      improvements,
    };
  }

  private detectSyntaxErrors(
    line: string,
    lineNum: number,
    language: string
  ): CodeError[] {
    const errors: CodeError[] = [];

    // Missing semicolon (for languages that require it)
    if (
      (language === "javascript" || language === "java" || language === "cpp" || language === "c") &&
      line.trim() &&
      !line.trim().endsWith(";") &&
      !line.trim().endsWith("{") &&
      !line.trim().endsWith("}") &&
      !line.includes("if") &&
      !line.includes("for") &&
      !line.includes("while") &&
      !line.trim().startsWith("//")
    ) {
      // Check if it's actually a statement that needs semicolon
      if (
        line.includes("=") ||
        line.includes("return") ||
        line.includes("console.log") ||
        line.includes("print")
      ) {
        errors.push({
          id: `syntax-${lineNum}`,
          type: "syntax",
          severity: "warning",
          line: lineNum,
          message: "Missing semicolon",
          code: line,
          suggestion: "Add semicolon at the end of the statement",
          fixedCode: line.trim() + ";",
        });
      }
    }

    // Unclosed brackets
    const openBrackets = (line.match(/\{/g) || []).length;
    const closeBrackets = (line.match(/\}/g) || []).length;
    if (openBrackets !== closeBrackets) {
      errors.push({
        id: `syntax-bracket-${lineNum}`,
        type: "syntax",
        severity: "error",
        line: lineNum,
        message: "Unmatched brackets",
        code: line,
        suggestion: "Check for missing opening or closing brackets",
      });
    }

    // Unclosed parentheses
    const openParens = (line.match(/\(/g) || []).length;
    const closeParens = (line.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      errors.push({
        id: `syntax-paren-${lineNum}`,
        type: "syntax",
        severity: "error",
        line: lineNum,
        message: "Unmatched parentheses",
        code: line,
        suggestion: "Check for missing opening or closing parentheses",
      });
    }

    return errors;
  }

  private detectLogicalErrors(
    line: string,
    lineNum: number,
    language: string,
    fullCode: string
  ): CodeError[] {
    const errors: CodeError[] = [];

    // Infinite recursion detection
    if (
      line.includes("return") &&
      line.includes("(") &&
      fullCode.includes("function") &&
      !line.includes("if")
    ) {
      const functionName = this.extractFunctionName(fullCode);
      if (functionName && line.includes(functionName + "(")) {
        // Check if there's a base case
        const hasBaseCase = fullCode.includes("if") && fullCode.match(/if\s*\([^)]*<=?\s*[12]\s*\)/);
        if (!hasBaseCase) {
          errors.push({
            id: `logical-recursion-${lineNum}`,
            type: "logical",
            severity: "error",
            line: lineNum,
            message: "Potential infinite recursion - missing base case",
            code: line,
            suggestion: "Add a base case condition before recursive call",
          });
        }
      }
    }

    // Division by zero
    if (line.includes("/") && line.match(/\/\s*0\b|\/\s*[a-zA-Z_]\w*\s*\)/)) {
      errors.push({
        id: `logical-divzero-${lineNum}`,
        type: "logical",
        severity: "warning",
        line: lineNum,
        message: "Potential division by zero",
        code: line,
        suggestion: "Add a check to ensure divisor is not zero",
      });
    }

    // Array out of bounds (heuristic)
    if (line.includes("[") && line.includes("]")) {
      const arrayAccess = line.match(/\[\s*(\w+)\s*\]/);
      if (arrayAccess && !line.includes("length") && !line.includes("size")) {
        errors.push({
          id: `logical-array-${lineNum}`,
          type: "logical",
          severity: "info",
          line: lineNum,
          message: "Potential array index out of bounds",
          code: line,
          suggestion: "Verify array index is within valid range",
        });
      }
    }

    return errors;
  }

  private detectPerformanceIssues(
    line: string,
    lineNum: number,
    language: string,
    fullCode: string
  ): CodeError[] {
    const errors: CodeError[] = [];

    // Exponential recursion (Fibonacci without memoization)
    if (
      fullCode.includes("fibonacci") &&
      line.includes("return") &&
      line.includes("+") &&
      line.includes("(") &&
      !fullCode.includes("memo") &&
      !fullCode.includes("cache")
    ) {
      errors.push({
        id: `perf-recursion-${lineNum}`,
        type: "performance",
        severity: "warning",
        line: lineNum,
        message: "Exponential time complexity - consider memoization",
        code: line,
        suggestion: "Use dynamic programming or memoization to optimize",
        fixedCode: this.suggestMemoization(fullCode, language),
      });
    }

    // Nested loops without early exit
    if (line.includes("for") && fullCode.match(/for\s*\(.*\)\s*\{[\s\S]*for\s*\(/)) {
      errors.push({
        id: `perf-nested-${lineNum}`,
        type: "performance",
        severity: "info",
        line: lineNum,
        message: "Nested loops detected - consider optimization",
        code: line,
        suggestion: "Look for opportunities to reduce nested iterations",
      });
    }

    return errors;
  }

  private detectStyleIssues(line: string, lineNum: number, language: string): CodeError[] {
    const errors: CodeError[] = [];

    // Inconsistent indentation (heuristic)
    if (line.length > 0 && line[0] === " " && line.match(/^ {1,3}[^ ]/)) {
      errors.push({
        id: `style-indent-${lineNum}`,
        type: "style",
        severity: "info",
        line: lineNum,
        message: "Inconsistent indentation",
        code: line,
        suggestion: "Use consistent indentation (2 or 4 spaces)",
      });
    }

    // Long lines
    if (line.length > 100) {
      errors.push({
        id: `style-length-${lineNum}`,
        type: "style",
        severity: "info",
        line: lineNum,
        message: "Line exceeds recommended length (100 characters)",
        code: line,
        suggestion: "Consider breaking into multiple lines",
      });
    }

    return errors;
  }

  private extractFunctionName(code: string): string | null {
    const match = code.match(/function\s+(\w+)|def\s+(\w+)/);
    return match ? (match[1] || match[2]) : null;
  }

  private suggestMemoization(code: string, language: string): string {
    if (language === "javascript") {
      return `const memo = {};\nfunction fibonacci(n) {\n  if (n in memo) return memo[n];\n  if (n <= 1) return n;\n  memo[n] = fibonacci(n - 1) + fibonacci(n - 2);\n  return memo[n];\n}`;
    }
    if (language === "python") {
      return `memo = {}\ndef fibonacci(n):\n    if n in memo:\n        return memo[n]\n    if n <= 1:\n        return n\n    memo[n] = fibonacci(n - 1) + fibonacci(n - 2)\n    return memo[n]`;
    }
    return code;
  }

  private applyOptimizations(code: string, language: string): string {
    // Basic optimizations would go here
    // For now, return as-is
    return code;
  }

  private generateFixExplanation(errors: CodeError[], improvements: string[]): string {
    if (errors.length === 0) {
      return "No errors detected in the code.";
    }

    const errorCount = errors.filter((e) => e.severity === "error").length;
    const warningCount = errors.filter((e) => e.severity === "warning").length;

    return `Fixed ${errorCount} error(s) and ${warningCount} warning(s). ${improvements.join(". ")}`;
  }
}

export const errorDetectionService = new ErrorDetectionService();

