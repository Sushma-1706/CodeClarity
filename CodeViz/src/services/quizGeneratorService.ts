// Quiz Generator Service
// Generates practice questions from code context

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  relatedConcept: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
  codeContext: string;
  language: string;
}

class QuizGeneratorService {
  public generateQuiz(code: string, language: string): Quiz {
    const questions: QuizQuestion[] = [];

    // Detect concepts and generate questions
    if (this.hasRecursion(code)) {
      questions.push(...this.generateRecursionQuestions(code));
    }

    if (this.hasLoops(code)) {
      questions.push(...this.generateLoopQuestions(code));
    }

    if (this.hasConditions(code)) {
      questions.push(...this.generateConditionalQuestions(code));
    }

    if (this.hasArrays(code)) {
      questions.push(...this.generateArrayQuestions(code));
    }

    // Add complexity questions
    questions.push(...this.generateComplexityQuestions(code));

    return {
      id: `quiz-${Date.now()}`,
      title: "Code Comprehension Quiz",
      questions: questions.slice(0, 10), // Limit to 10 questions
      codeContext: code,
      language,
    };
  }

  private hasRecursion(code: string): boolean {
    const functionMatches = code.match(/function\s+(\w+)|def\s+(\w+)/g) || [];
    return functionMatches.some((fn) => {
      const name = fn.split(/\s+/)[1];
      return code.includes(`${name}(`);
    });
  }

  private hasLoops(code: string): boolean {
    return /for\s*\(|while\s*\(/.test(code);
  }

  private hasConditions(code: string): boolean {
    return /\bif\s*\(/.test(code);
  }

  private hasArrays(code: string): boolean {
    return /\[.*\]/.test(code);
  }

  private generateRecursionQuestions(code: string): QuizQuestion[] {
    return [
      {
        id: "recursion-1",
        question: "What is the base case in recursion?",
        options: [
          "A condition to stop recursion",
          "A loop counter",
          "A cache variable",
          "An infinite call",
        ],
        correctAnswer: 0,
        explanation:
          "The base case is a condition that stops the recursive calls and returns a value without further recursion.",
        relatedConcept: "Recursion",
      },
      {
        id: "recursion-2",
        question: "Which technique avoids recomputation in recursion?",
        options: ["Iteration", "Brute Force", "Memoization", "Randomization"],
        correctAnswer: 2,
        explanation:
          "Memoization stores previously computed results to avoid recalculating the same values.",
        relatedConcept: "Recursion",
      },
      {
        id: "recursion-3",
        question: "What happens if a recursive function lacks a base case?",
        options: [
          "It runs faster",
          "It causes infinite recursion",
          "It returns undefined",
          "It uses less memory",
        ],
        correctAnswer: 1,
        explanation:
          "Without a base case, the function will call itself indefinitely, leading to a stack overflow.",
        relatedConcept: "Recursion",
      },
    ];
  }

  private generateLoopQuestions(code: string): QuizQuestion[] {
    return [
      {
        id: "loop-1",
        question: "What is the time complexity of a nested loop?",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(1)"],
        correctAnswer: 2,
        explanation:
          "Nested loops typically result in O(n²) time complexity, as each iteration of the outer loop runs the inner loop n times.",
        relatedConcept: "Loops",
      },
    ];
  }

  private generateConditionalQuestions(code: string): QuizQuestion[] {
    return [
      {
        id: "conditional-1",
        question: "What does an 'if' statement do?",
        options: [
          "Loops through code",
          "Makes a decision based on a condition",
          "Defines a function",
          "Declares a variable",
        ],
        correctAnswer: 1,
        explanation:
          "An 'if' statement evaluates a condition and executes code only if the condition is true.",
        relatedConcept: "Conditionals",
      },
    ];
  }

  private generateArrayQuestions(code: string): QuizQuestion[] {
    return [
      {
        id: "array-1",
        question: "What is the time complexity of accessing an array element by index?",
        options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
        correctAnswer: 2,
        explanation:
          "Array access by index is O(1) because arrays provide direct memory access using the index.",
        relatedConcept: "Arrays",
      },
    ];
  }

  private generateComplexityQuestions(code: string): QuizQuestion[] {
    return [
      {
        id: "complexity-1",
        question: "What does O(n) time complexity mean?",
        options: [
          "Constant time",
          "Linear time - grows proportionally with input",
          "Quadratic time",
          "Exponential time",
        ],
        correctAnswer: 1,
        explanation:
          "O(n) means the algorithm's execution time grows linearly with the input size.",
        relatedConcept: "Complexity",
      },
      {
        id: "complexity-2",
        question: "Which is more efficient: O(n) or O(n²)?",
        options: ["O(n)", "O(n²)", "They're the same", "Depends on input"],
        correctAnswer: 0,
        explanation:
          "O(n) is more efficient than O(n²) because it grows slower as input size increases.",
        relatedConcept: "Complexity",
      },
    ];
  }
}

export const quizGeneratorService = new QuizGeneratorService();

