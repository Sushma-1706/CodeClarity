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

    // Additional Data Structure Patterns
    this.patterns.set('queue', {
      id: 'queue',
      name: 'Queue',
      type: 'data-structure',
      confidence: 0,
      description: 'FIFO (First In, First Out) linear data structure',
      explanation: {
        simplified: 'Like a line at a store! The first person in line is the first to be served.',
        technical: 'Linear data structure where elements are added at the rear and removed from the front, following FIFO principle.'
      },
      visualization: {
        type: 'sequence',
        data: { operations: ['enqueue (add to rear)', 'dequeue (remove from front)', 'peek (view front)'] }
      },
      examples: ['Queue', 'enqueue', 'dequeue', 'front', 'rear'],
      complexity: { time: 'O(1) enqueue/dequeue', space: 'O(n)' },
      tags: ['fifo', 'linear', 'dynamic', 'sequential-access']
    });

    this.patterns.set('stack', {
      id: 'stack',
      name: 'Stack',
      type: 'data-structure',
      confidence: 0,
      description: 'LIFO (Last In, First Out) linear data structure',
      explanation: {
        simplified: 'Like a stack of plates! You can only add or remove plates from the top.',
        technical: 'Linear data structure where elements are added and removed from the same end (top), following LIFO principle.'
      },
      visualization: {
        type: 'sequence',
        data: { operations: ['push (add to top)', 'pop (remove from top)', 'peek (view top)'] }
      },
      examples: ['Stack', 'push', 'pop', 'peek', 'top'],
      complexity: { time: 'O(1) push/pop', space: 'O(n)' },
      tags: ['lifo', 'linear', 'dynamic', 'top-access']
    });

    this.patterns.set('binary-tree', {
      id: 'binary-tree',
      name: 'Binary Tree',
      type: 'data-structure',
      confidence: 0,
      description: 'Tree data structure where each node has at most two children',
      explanation: {
        simplified: 'Like a family tree, but each person can have at most two children!',
        technical: 'Hierarchical data structure where each node has at most two children, typically called left and right.'
      },
      visualization: {
        type: 'tree',
        data: { structure: 'Root -> Left Child, Right Child' }
      },
      examples: ['TreeNode', 'left', 'right', 'root', 'leaf'],
      complexity: { time: 'O(log n) average, O(n) worst', space: 'O(n)' },
      tags: ['hierarchical', 'recursive', 'two-children', 'tree-traversal']
    });

    this.patterns.set('graph', {
      id: 'graph',
      name: 'Graph',
      type: 'data-structure',
      confidence: 0,
      description: 'Collection of vertices connected by edges',
      explanation: {
        simplified: 'Like a social network! People (vertices) are connected by friendships (edges).',
        technical: 'Non-linear data structure consisting of vertices (nodes) and edges that connect pairs of vertices.'
      },
      visualization: {
        type: 'graph',
        data: { vertices: 'Nodes', edges: 'Connections between nodes' }
      },
      examples: ['Graph', 'Vertex', 'Edge', 'adjacency', 'neighbor'],
      complexity: { time: 'O(V + E) traversal', space: 'O(V + E)' },
      tags: ['non-linear', 'vertices-edges', 'traversal', 'connectivity']
    });

    // Additional Sorting Algorithms
    this.patterns.set('quick-sort', {
      id: 'quick-sort',
      name: 'Quick Sort',
      type: 'algorithm',
      confidence: 0,
      description: 'Efficient divide-and-conquer sorting algorithm',
      explanation: {
        simplified: 'Like organizing books! Pick a "pivot" book, put smaller books to its left, bigger ones to its right, then repeat for each side.',
        technical: 'Divide-and-conquer algorithm that picks a pivot element and partitions the array around the pivot, then recursively sorts the sub-arrays.'
      },
      visualization: {
        type: 'sequence',
        data: { steps: ['Choose pivot', 'Partition array', 'Recursively sort sub-arrays'] }
      },
      examples: ['quickSort', 'quicksort', 'partition', 'pivot'],
      complexity: { time: 'O(n log n) average, O(n²) worst', space: 'O(log n)' },
      tags: ['divide-conquer', 'efficient', 'in-place', 'recursive']
    });

    this.patterns.set('merge-sort', {
      id: 'merge-sort',
      name: 'Merge Sort',
      type: 'algorithm',
      confidence: 0,
      description: 'Stable divide-and-conquer sorting algorithm',
      explanation: {
        simplified: 'Like sorting two piles of cards! Split the deck in half, sort each half, then merge them back together.',
        technical: 'Divide-and-conquer algorithm that divides the array into two halves, sorts them recursively, then merges the sorted halves.'
      },
      visualization: {
        type: 'tree',
        data: { structure: 'Divide -> Sort -> Merge' }
      },
      examples: ['mergeSort', 'mergesort', 'merge', 'divide'],
      complexity: { time: 'O(n log n)', space: 'O(n)' },
      tags: ['divide-conquer', 'stable', 'guaranteed-performance', 'recursive']
    });

    this.patterns.set('heap-sort', {
      id: 'heap-sort',
      name: 'Heap Sort',
      type: 'algorithm',
      confidence: 0,
      description: 'Comparison-based sorting using heap data structure',
      explanation: {
        simplified: 'Like organizing a pyramid! Build a heap (max-heap), then repeatedly remove the largest element.',
        technical: 'Sorting algorithm that uses a binary heap to repeatedly extract the maximum element and place it at the end.'
      },
      visualization: {
        type: 'tree',
        data: { structure: 'Build Heap -> Extract Max -> Repeat' }
      },
      examples: ['heapSort', 'heapsort', 'heapify', 'extractMax'],
      complexity: { time: 'O(n log n)', space: 'O(1)' },
      tags: ['heap-based', 'in-place', 'guaranteed-performance', 'comparison-sort']
    });

    // Graph Traversal Algorithms
    this.patterns.set('depth-first-search', {
      id: 'depth-first-search',
      name: 'Depth-First Search (DFS)',
      type: 'algorithm',
      confidence: 0,
      description: 'Graph traversal algorithm that explores as far as possible along each branch',
      explanation: {
        simplified: 'Like exploring a maze! Go as far as you can down one path, then backtrack and try another.',
        technical: 'Graph traversal algorithm that starts at a vertex and explores as far as possible along each branch before backtracking.'
      },
      visualization: {
        type: 'graph',
        data: { traversal: 'Deep exploration before backtracking' }
      },
      examples: ['dfs', 'depthFirstSearch', 'explore', 'backtrack'],
      complexity: { time: 'O(V + E)', space: 'O(V)' },
      tags: ['graph-traversal', 'recursive', 'backtracking', 'exploration']
    });

    this.patterns.set('breadth-first-search', {
      id: 'breadth-first-search',
      name: 'Breadth-First Search (BFS)',
      type: 'algorithm',
      confidence: 0,
      description: 'Graph traversal algorithm that explores all neighbors before moving to next level',
      explanation: {
        simplified: 'Like ripples in a pond! Explore all neighbors at the current distance before moving further.',
        technical: 'Graph traversal algorithm that explores all vertices at the current depth level before moving to the next level.'
      },
      visualization: {
        type: 'graph',
        data: { traversal: 'Level-by-level exploration' }
      },
      examples: ['bfs', 'breadthFirstSearch', 'queue', 'level'],
      complexity: { time: 'O(V + E)', space: 'O(V)' },
      tags: ['graph-traversal', 'queue-based', 'level-order', 'shortest-path']
    });

    this.patterns.set('binary-search-tree', {
      id: 'binary-search-tree',
      name: 'Binary Search Tree Operations',
      type: 'algorithm',
      confidence: 0,
      description: 'Search, insert, and delete operations on BST',
      explanation: {
        simplified: 'Like a phone book! Left side has smaller numbers, right side has bigger numbers.',
        technical: 'Binary tree where for each node, all values in left subtree are smaller and all values in right subtree are larger.'
      },
      visualization: {
        type: 'tree',
        data: { property: 'Left < Node < Right' }
      },
      examples: ['insert', 'search', 'delete', 'inorder', 'preorder', 'postorder'],
      complexity: { time: 'O(log n) average, O(n) worst', space: 'O(log n)' },
      tags: ['tree-operations', 'search-optimized', 'recursive', 'ordered']
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

      // New Data Structure Patterns
      case 'queue':
        if (codeNormalized.includes('queue') || codeNormalized.includes('enqueue') || codeNormalized.includes('dequeue')) confidence += 0.5;
        if (codeNormalized.includes('front') && codeNormalized.includes('rear')) confidence += 0.3;
        if (codeNormalized.includes('fifo') || codeNormalized.includes('first in first out')) confidence += 0.4;
        break;

      case 'stack':
        if (codeNormalized.includes('stack') || codeNormalized.includes('push') || codeNormalized.includes('pop')) confidence += 0.5;
        if (codeNormalized.includes('peek') || codeNormalized.includes('top')) confidence += 0.3;
        if (codeNormalized.includes('lifo') || codeNormalized.includes('last in first out')) confidence += 0.4;
        break;

      case 'binary-tree':
        if (codeNormalized.includes('treenode') || codeNormalized.includes('tree')) confidence += 0.4;
        if (codeNormalized.includes('left') && codeNormalized.includes('right')) confidence += 0.3;
        if (codeNormalized.includes('root') || codeNormalized.includes('leaf')) confidence += 0.3;
        if (codeNormalized.includes('inorder') || codeNormalized.includes('preorder') || codeNormalized.includes('postorder')) confidence += 0.2;
        break;

      case 'graph':
        if (codeNormalized.includes('graph') || codeNormalized.includes('vertex') || codeNormalized.includes('edge')) confidence += 0.4;
        if (codeNormalized.includes('adjacency') || codeNormalized.includes('neighbor')) confidence += 0.3;
        if (codeNormalized.includes('vertices') && codeNormalized.includes('edges')) confidence += 0.3;
        break;

      // New Sorting Algorithms
      case 'quick-sort':
        if (codeNormalized.includes('quicksort') || codeNormalized.includes('quick sort')) confidence += 0.4;
        if (codeNormalized.includes('pivot') || codeNormalized.includes('partition')) confidence += 0.4;
        if (codeNormalized.includes('divide') && codeNormalized.includes('conquer')) confidence += 0.2;
        break;

      case 'merge-sort':
        if (codeNormalized.includes('mergesort') || codeNormalized.includes('merge sort')) confidence += 0.4;
        if (codeNormalized.includes('merge') && codeNormalized.includes('divide')) confidence += 0.4;
        if (codeNormalized.includes('stable') || codeNormalized.includes('guaranteed')) confidence += 0.2;
        break;

      case 'heap-sort':
        if (codeNormalized.includes('heapsort') || codeNormalized.includes('heap sort')) confidence += 0.4;
        if (codeNormalized.includes('heapify') || codeNormalized.includes('extractmax')) confidence += 0.4;
        if (codeNormalized.includes('max-heap') || codeNormalized.includes('min-heap')) confidence += 0.2;
        break;

      // Graph Traversal Algorithms
      case 'depth-first-search':
        if (codeNormalized.includes('dfs') || codeNormalized.includes('depth first')) confidence += 0.5;
        if (codeNormalized.includes('backtrack') || codeNormalized.includes('explore')) confidence += 0.3;
        if (codeNormalized.includes('recursive') && codeNormalized.includes('graph')) confidence += 0.2;
        break;

      case 'breadth-first-search':
        if (codeNormalized.includes('bfs') || codeNormalized.includes('breadth first')) confidence += 0.5;
        if (codeNormalized.includes('queue') && codeNormalized.includes('level')) confidence += 0.3;
        if (codeNormalized.includes('shortest') && codeNormalized.includes('path')) confidence += 0.2;
        break;

      case 'binary-search-tree':
        if (codeNormalized.includes('bst') || codeNormalized.includes('binary search tree')) confidence += 0.4;
        if (codeNormalized.includes('insert') && codeNormalized.includes('search') && codeNormalized.includes('delete')) confidence += 0.3;
        if (codeNormalized.includes('inorder') || codeNormalized.includes('preorder') || codeNormalized.includes('postorder')) confidence += 0.3;
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