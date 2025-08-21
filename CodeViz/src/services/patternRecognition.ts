// Smart Code Pattern Recognition Engine
// ML-powered pattern detection and analysis service

export interface CodePattern {
  id: string;
  name: string;
  type: 'algorithm' | 'data-structure' | 'design-pattern' | 'anti-pattern';
  confidence: number;
  description: string;
  explanation: {
    simplified: string;
    technical: string;
  };
  visualization: {
    type: 'flowchart' | 'tree' | 'graph' | 'sequence';
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

class PatternRecognitionEngine {
  private patterns: Map<string, CodePattern> = new Map();

  constructor() {
    this.initializePatterns();
  }

  private initializePatterns() {
    // Algorithm Patterns
    this.patterns.set('fibonacci-recursive', {
      id: 'fibonacci-recursive',
      name: 'Fibonacci Sequence (Recursive)',
      type: 'algorithm',
      confidence: 0,
      description: 'Classic recursive implementation of Fibonacci sequence',
      explanation: {
        simplified: 'Like counting rabbits! Each month, the number of rabbit pairs equals the sum of pairs from the previous two months.',
        technical: 'Recursive implementation with exponential time complexity due to overlapping subproblems. Each call branches into two more calls.'
      },
      visualization: {
        type: 'tree',
        data: {
          name: 'fib(n)',
          children: [
            { name: 'fib(n-1)', children: [] },
            { name: 'fib(n-2)', children: [] }
          ]
        }
      },
      examples: ['fibonacci(n)', 'fib(n)', 'fibonacciSequence(n)'],
      optimizations: ['Use memoization', 'Convert to iterative approach', 'Use dynamic programming'],
      complexity: { time: 'O(2^n)', space: 'O(n)' },
      tags: ['recursion', 'mathematical', 'exponential', 'optimization-needed']
    });

    this.patterns.set('binary-search', {
      id: 'binary-search',
      name: 'Binary Search',
      type: 'algorithm',
      confidence: 0,
      description: 'Efficient search algorithm for sorted arrays',
      explanation: {
        simplified: 'Like finding a word in a dictionary! You open to the middle, see if your word comes before or after, then repeat with the correct half.',
        technical: 'Divide-and-conquer algorithm that repeatedly divides the search interval in half, achieving logarithmic time complexity.'
      },
      visualization: {
        type: 'sequence',
        data: { steps: ['Compare with middle', 'Choose left or right half', 'Repeat until found'] }
      },
      examples: ['binarySearch', 'bsearch', 'findInSorted'],
      complexity: { time: 'O(log n)', space: 'O(1)' },
      tags: ['divide-conquer', 'logarithmic', 'efficient', 'sorted-array']
    });

    this.patterns.set('bubble-sort', {
      id: 'bubble-sort',
      name: 'Bubble Sort',
      type: 'algorithm',
      confidence: 0,
      description: 'Simple but inefficient sorting algorithm',
      explanation: {
        simplified: 'Like bubbles rising to the surface! Bigger numbers "bubble up" to the end by swapping with smaller neighbors.',
        technical: 'Comparison-based sorting with nested loops. Adjacent elements are compared and swapped if in wrong order.'
      },
      visualization: {
        type: 'sequence',
        data: { steps: ['Compare adjacent elements', 'Swap if out of order', 'Repeat for all elements'] }
      },
      examples: ['bubbleSort', 'bubble_sort', 'simpleSort'],
      optimizations: ['Use more efficient sorting algorithms like quicksort or mergesort'],
      complexity: { time: 'O(n²)', space: 'O(1)' },
      tags: ['sorting', 'quadratic', 'inefficient', 'educational']
    });

    // Data Structure Patterns
    this.patterns.set('linked-list', {
      id: 'linked-list',
      name: 'Linked List',
      type: 'data-structure',
      confidence: 0,
      description: 'Linear data structure with nodes containing data and pointers',
      explanation: {
        simplified: 'Like a treasure hunt! Each clue (node) tells you where to find the next clue, forming a chain.',
        technical: 'Dynamic data structure where elements are stored in nodes, each containing data and a reference to the next node.'
      },
      visualization: {
        type: 'graph',
        data: { nodes: ['Node1 -> Node2 -> Node3 -> null'] }
      },
      examples: ['LinkedList', 'ListNode', 'Node'],
      complexity: { time: 'O(n) access, O(1) insertion', space: 'O(n)' },
      tags: ['linear', 'dynamic', 'pointer-based', 'sequential-access']
    });

    // Design Patterns
    this.patterns.set('singleton', {
      id: 'singleton',
      name: 'Singleton Pattern',
      type: 'design-pattern',
      confidence: 0,
      description: 'Ensures only one instance of a class exists',
      explanation: {
        simplified: 'Like having only one principal in a school! No matter how many times you ask for the principal, you always get the same person.',
        technical: 'Creational design pattern that restricts instantiation of a class to a single instance and provides global access to it.'
      },
      visualization: {
        type: 'flowchart',
        data: { steps: ['Check if instance exists', 'Create if not exists', 'Return existing instance'] }
      },
      examples: ['getInstance', 'Singleton', 'single instance'],
      complexity: { time: 'O(1)', space: 'O(1)' },
      tags: ['design-pattern', 'creational', 'global-access', 'single-instance']
    });
  }

  public analyzeCode(code: string, language: string): PatternAnalysisResult {
    const detectedPatterns: CodePattern[] = [];
    const codeStructure = this.analyzeCodeStructure(code);

    // Pattern detection logic
    for (const [patternId, pattern] of this.patterns) {
      const confidence = this.calculatePatternConfidence(code, pattern);
      if (confidence > 0.3) { // Threshold for pattern detection
        detectedPatterns.push({
          ...pattern,
          confidence: Math.round(confidence * 100) / 100
        });
      }
    }

    // Sort by confidence
    detectedPatterns.sort((a, b) => b.confidence - a.confidence);

    const mainPattern = detectedPatterns.length > 0 ? detectedPatterns[0] : null;
    const suggestions = this.generateSuggestions(detectedPatterns, codeStructure);

    return {
      patterns: detectedPatterns,
      mainPattern,
      codeStructure,
      suggestions
    };
  }

  private calculatePatternConfidence(code: string, pattern: CodePattern): number {
    let confidence = 0;
    const codeNormalized = code.toLowerCase().replace(/\s+/g, ' ');

    // Check for pattern-specific keywords and structures
    switch (pattern.id) {
      case 'fibonacci-recursive':
        if (codeNormalized.includes('fibonacci') || codeNormalized.includes('fib')) confidence += 0.4;
        if (codeNormalized.includes('return') && codeNormalized.includes('(n-1)') && codeNormalized.includes('(n-2)')) confidence += 0.5;
        if (codeNormalized.includes('if') && (codeNormalized.includes('n <= 1') || codeNormalized.includes('n < 2'))) confidence += 0.3;
        break;

      case 'binary-search':
        if (codeNormalized.includes('binary') || codeNormalized.includes('bsearch')) confidence += 0.4;
        if (codeNormalized.includes('middle') || codeNormalized.includes('mid')) confidence += 0.3;
        if (codeNormalized.includes('left') && codeNormalized.includes('right')) confidence += 0.3;
        if (codeNormalized.includes('while') && codeNormalized.includes('<=')) confidence += 0.2;
        break;

      case 'bubble-sort':
        if (codeNormalized.includes('bubble') || codeNormalized.includes('sort')) confidence += 0.3;
        if (codeNormalized.match(/for.*for/)) confidence += 0.4; // Nested loops
        if (codeNormalized.includes('swap') || codeNormalized.includes('temp')) confidence += 0.3;
        break;

      case 'linked-list':
        if (codeNormalized.includes('node') || codeNormalized.includes('next')) confidence += 0.4;
        if (codeNormalized.includes('head') || codeNormalized.includes('tail')) confidence += 0.3;
        if (codeNormalized.includes('->') || codeNormalized.includes('.next')) confidence += 0.3;
        break;

      case 'singleton':
        if (codeNormalized.includes('singleton') || codeNormalized.includes('getinstance')) confidence += 0.5;
        if (codeNormalized.includes('static') && codeNormalized.includes('instance')) confidence += 0.4;
        if (codeNormalized.includes('private') && codeNormalized.includes('constructor')) confidence += 0.3;
        break;
    }

    return Math.min(confidence, 1.0);
  }

  private analyzeCodeStructure(code: string) {
    const functions = (code.match(/function\s+\w+|def\s+\w+|public\s+\w+\s+\w+\(/g) || []).length;
    const loops = (code.match(/for\s*\(|while\s*\(|for\s+\w+\s+in/g) || []).length;
    const conditionals = (code.match(/if\s*\(|else\s*if|switch\s*\(/g) || []).length;
    const recursion = code.includes('return') && functions > 0 && 
      code.match(/(\w+)\s*\([^)]*\)[\s\S]*return[\s\S]*\1\s*\(/);

    return {
      functions,
      loops,
      conditionals,
      recursion: !!recursion
    };
  }

  private generateSuggestions(patterns: CodePattern[], structure: any): string[] {
    const suggestions: string[] = [];

    if (patterns.length === 0) {
      suggestions.push("No specific patterns detected. Consider using well-known algorithms and data structures.");
    }

    patterns.forEach(pattern => {
      if (pattern.optimizations) {
        suggestions.push(...pattern.optimizations);
      }

      if (pattern.confidence > 0.8) {
        suggestions.push(`Strong ${pattern.name} pattern detected! This is a classic implementation.`);
      } else if (pattern.confidence > 0.5) {
        suggestions.push(`Possible ${pattern.name} pattern. Consider refining the implementation.`);
      }
    });

    if (structure.recursion && !patterns.some(p => p.tags.includes('recursion'))) {
      suggestions.push("Recursion detected. Consider if iterative approach might be more efficient.");
    }

    if (structure.loops > 2) {
      suggestions.push("Multiple loops detected. Review for potential optimization opportunities.");
    }

    return [...new Set(suggestions)]; // Remove duplicates
  }

  public getPatternVisualization(patternId: string): any {
    const pattern = this.patterns.get(patternId);
    return pattern?.visualization || null;
  }

  public getPatternExplanation(patternId: string, level: 'simplified' | 'technical'): string {
    const pattern = this.patterns.get(patternId);
    return pattern?.explanation[level] || '';
  }
}

export const patternRecognitionEngine = new PatternRecognitionEngine();