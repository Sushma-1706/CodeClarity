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

    // Additional Data Structures
    this.patterns.set('queue', {
      id: 'queue',
      name: 'Queue',
      type: 'data-structure',
      confidence: 0,
      description: 'FIFO (First In, First Out) linear data structure',
      explanation: {
        simplified: 'Like a line at a ticket counter! The first person in line gets served first, and new people join at the back.',
        technical: 'Linear data structure that follows FIFO principle. Elements are added at the rear and removed from the front.'
      },
      visualization: {
        type: 'graph',
        data: { nodes: ['Front <- [1] <- [2] <- [3] <- Rear'] }
      },
      examples: ['Queue', 'enqueue', 'dequeue', 'front', 'rear'],
      complexity: { time: 'O(1) enqueue/dequeue', space: 'O(n)' },
      tags: ['fifo', 'linear', 'queue-operations', 'sequential']
    });

    this.patterns.set('stack', {
      id: 'stack',
      name: 'Stack',
      type: 'data-structure',
      confidence: 0,
      description: 'LIFO (Last In, First Out) linear data structure',
      explanation: {
        simplified: 'Like a stack of plates! You can only add or remove plates from the top of the stack.',
        technical: 'Linear data structure that follows LIFO principle. Elements are added and removed from the same end (top).'
      },
      visualization: {
        type: 'graph',
        data: { nodes: ['Top -> [3] -> [2] -> [1] -> Bottom'] }
      },
      examples: ['Stack', 'push', 'pop', 'peek', 'top'],
      complexity: { time: 'O(1) push/pop', space: 'O(n)' },
      tags: ['lifo', 'linear', 'stack-operations', 'sequential']
    });

    this.patterns.set('binary-tree', {
      id: 'binary-tree',
      name: 'Binary Tree',
      type: 'data-structure',
      confidence: 0,
      description: 'Tree data structure where each node has at most two children',
      explanation: {
        simplified: 'Like a family tree, but each person can have at most two children! Perfect for organizing data hierarchically.',
        technical: 'Tree data structure where each node has at most two children, typically called left and right child.'
      },
      visualization: {
        type: 'tree',
        data: {
          name: 'Root',
          children: [
            { name: 'Left Child', children: [] },
            { name: 'Right Child', children: [] }
          ]
        }
      },
      examples: ['TreeNode', 'left', 'right', 'root', 'binary tree'],
      complexity: { time: 'O(log n) average, O(n) worst', space: 'O(n)' },
      tags: ['tree', 'hierarchical', 'binary', 'recursive']
    });

    this.patterns.set('binary-search-tree', {
      id: 'binary-search-tree',
      name: 'Binary Search Tree (BST)',
      type: 'data-structure',
      confidence: 0,
      description: 'Binary tree with ordering property for efficient searching',
      explanation: {
        simplified: 'Like a phone book! All names starting with A-M go left, N-Z go right, making it super fast to find anyone.',
        technical: 'Binary tree where for each node, all values in left subtree are smaller and all values in right subtree are larger.'
      },
      visualization: {
        type: 'tree',
        data: {
          name: '8',
          children: [
            { name: '3', children: [{ name: '1' }, { name: '6' }] },
            { name: '10', children: [{ name: '9' }, { name: '14' }] }
          ]
        }
      },
      examples: ['BST', 'insert', 'search', 'delete', 'inorder'],
      complexity: { time: 'O(log n) average, O(n) worst', space: 'O(n)' },
      tags: ['tree', 'search', 'ordered', 'efficient']
    });

    this.patterns.set('graph', {
      id: 'graph',
      name: 'Graph',
      type: 'data-structure',
      confidence: 0,
      description: 'Collection of vertices connected by edges',
      explanation: {
        simplified: 'Like a social network! People (vertices) are connected by friendships (edges), and you can explore connections.',
        technical: 'Non-linear data structure consisting of vertices (nodes) and edges that connect pairs of vertices.'
      },
      visualization: {
        type: 'graph',
        data: { nodes: ['A -- B -- C', '|    |    |', 'D -- E -- F'] }
      },
      examples: ['Graph', 'vertex', 'edge', 'adjacency', 'traversal'],
      complexity: { time: 'O(V + E)', space: 'O(V + E)' },
      tags: ['non-linear', 'vertices', 'edges', 'traversal']
    });

    this.patterns.set('heap', {
      id: 'heap',
      name: 'Heap',
      type: 'data-structure',
      confidence: 0,
      description: 'Complete binary tree with heap property',
      explanation: {
        simplified: 'Like a pyramid of importance! The most important person (max) or least important (min) is always at the top.',
        technical: 'Complete binary tree where parent nodes are always greater than (max-heap) or less than (min-heap) their children.'
      },
      visualization: {
        type: 'tree',
        data: {
          name: '9',
          children: [
            { name: '7', children: [{ name: '4' }, { name: '2' }] },
            { name: '5', children: [{ name: '1' }, { name: '3' }] }
          ]
        }
      },
      examples: ['Heap', 'max-heap', 'min-heap', 'heapify', 'extract'],
      complexity: { time: 'O(log n) insert/extract', space: 'O(n)' },
      tags: ['tree', 'priority', 'heap-property', 'complete']
    });

    // Advanced Sorting Algorithms
    this.patterns.set('quick-sort', {
      id: 'quick-sort',
      name: 'Quick Sort',
      type: 'algorithm',
      confidence: 0,
      description: 'Efficient divide-and-conquer sorting algorithm',
      explanation: {
        simplified: 'Like organizing a messy room! Pick a "pivot" item, put smaller things to its left, bigger things to its right, then repeat for each side.',
        technical: 'Divide-and-conquer algorithm that picks a pivot element and partitions the array around it, then recursively sorts the sub-arrays.'
      },
      visualization: {
        type: 'flowchart',
        data: { steps: ['Choose pivot', 'Partition array', 'Recursively sort left and right'] }
      },
      examples: ['quickSort', 'quicksort', 'partition', 'pivot'],
      complexity: { time: 'O(n log n) average, O(n²) worst', space: 'O(log n)' },
      tags: ['sorting', 'divide-conquer', 'efficient', 'in-place']
    });

    this.patterns.set('merge-sort', {
      id: 'merge-sort',
      name: 'Merge Sort',
      type: 'algorithm',
      confidence: 0,
      description: 'Stable divide-and-conquer sorting algorithm',
      explanation: {
        simplified: 'Like organizing two sorted piles of cards! Take the smaller card from the top of each pile until both are empty.',
        technical: 'Divide-and-conquer algorithm that divides the array into halves, sorts them recursively, then merges the sorted halves.'
      },
      visualization: {
        type: 'flowchart',
        data: { steps: ['Divide into halves', 'Sort each half', 'Merge sorted halves'] }
      },
      examples: ['mergeSort', 'mergesort', 'merge', 'divide'],
      complexity: { time: 'O(n log n)', space: 'O(n)' },
      tags: ['sorting', 'stable', 'divide-conquer', 'guaranteed']
    });

    this.patterns.set('heap-sort', {
      id: 'heap-sort',
      name: 'Heap Sort',
      type: 'algorithm',
      confidence: 0,
      description: 'Comparison-based sorting using heap data structure',
      explanation: {
        simplified: 'Like a tournament! Build a heap (pyramid), take the winner (max), rebuild the heap, repeat until everyone is ranked.',
        technical: 'Sorting algorithm that uses a heap to find the maximum element and places it at the end, repeating until sorted.'
      },
      visualization: {
        type: 'flowchart',
        data: { steps: ['Build max heap', 'Extract max element', 'Place at end', 'Repeat'] }
      },
      examples: ['heapSort', 'heapsort', 'heapify', 'extractMax'],
      complexity: { time: 'O(n log n)', space: 'O(1)' },
      tags: ['sorting', 'heap-based', 'in-place', 'guaranteed']
    });

    // Search Algorithms
    this.patterns.set('depth-first-search', {
      id: 'depth-first-search',
      name: 'Depth-First Search (DFS)',
      type: 'algorithm',
      confidence: 0,
      description: 'Graph traversal algorithm that explores as far as possible',
      explanation: {
        simplified: 'Like exploring a maze! Go as far as you can down one path, then backtrack and try another path when you hit a dead end.',
        technical: 'Graph traversal algorithm that explores vertices by going as deep as possible along each branch before backtracking.'
      },
      visualization: {
        type: 'graph',
        data: { steps: ['Start at vertex', 'Mark as visited', 'Visit unvisited neighbors', 'Backtrack when stuck'] }
      },
      examples: ['dfs', 'depthFirstSearch', 'traverse', 'visited'],
      complexity: { time: 'O(V + E)', space: 'O(V)' },
      tags: ['graph', 'traversal', 'recursive', 'backtracking']
    });

    this.patterns.set('breadth-first-search', {
      id: 'breadth-first-search',
      name: 'Breadth-First Search (BFS)',
      type: 'algorithm',
      confidence: 0,
      description: 'Graph traversal algorithm that explores level by level',
      explanation: {
        simplified: 'Like ripples in a pond! Start from one point and explore all neighbors at the same distance before moving further.',
        technical: 'Graph traversal algorithm that explores vertices level by level, using a queue to keep track of vertices to visit.'
      },
      visualization: {
        type: 'graph',
        data: { steps: ['Start at vertex', 'Add to queue', 'Process queue level by level', 'Mark as visited'] }
      },
      examples: ['bfs', 'breadthFirstSearch', 'queue', 'level'],
      complexity: { time: 'O(V + E)', space: 'O(V)' },
      tags: ['graph', 'traversal', 'queue-based', 'level-order']
    });

    // Dynamic Programming Patterns
    this.patterns.set('memoization', {
      id: 'memoization',
      name: 'Memoization',
      type: 'algorithm',
      confidence: 0,
      description: 'Optimization technique that stores results of expensive function calls',
      explanation: {
        simplified: 'Like keeping a cheat sheet! Remember the answers to problems you\'ve solved before so you don\'t have to solve them again.',
        technical: 'Optimization technique that caches the results of expensive function calls and returns the cached result when the same inputs occur again.'
      },
      visualization: {
        type: 'flowchart',
        data: { steps: ['Check cache', 'If found, return cached result', 'If not, compute and cache', 'Return result'] }
      },
      examples: ['memo', 'cache', 'memoize', 'dp'],
      complexity: { time: 'O(n)', space: 'O(n)' },
      tags: ['optimization', 'caching', 'dynamic-programming', 'recursion']
    });

    this.patterns.set('tabulation', {
      id: 'tabulation',
      name: 'Tabulation (Bottom-Up DP)',
      type: 'algorithm',
      confidence: 0,
      description: 'Dynamic programming approach that builds solutions iteratively',
      explanation: {
        simplified: 'Like building a pyramid from the bottom up! Start with the smallest problems and build up to the solution you need.',
        technical: 'Dynamic programming technique that solves problems by building up solutions iteratively, starting from base cases.'
      },
      visualization: {
        type: 'flowchart',
        data: { steps: ['Initialize base cases', 'Fill table iteratively', 'Use previous results', 'Return final result'] }
      },
      examples: ['dp', 'table', 'bottom-up', 'iterative'],
      complexity: { time: 'O(n)', space: 'O(n)' },
      tags: ['dynamic-programming', 'iterative', 'bottom-up', 'optimization']
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

    this.patterns.set('observer', {
      id: 'observer',
      name: 'Observer Pattern',
      type: 'design-pattern',
      confidence: 0,
      description: 'One-to-many dependency between objects',
      explanation: {
        simplified: 'Like a newsletter subscription! When something important happens, all subscribers get notified automatically.',
        technical: 'Behavioral design pattern where an object (subject) maintains a list of dependents (observers) and notifies them of state changes.'
      },
      visualization: {
        type: 'graph',
        data: { nodes: ['Subject -> Observer1', 'Subject -> Observer2', 'Subject -> Observer3'] }
      },
      examples: ['Observer', 'Subject', 'notify', 'subscribe'],
      complexity: { time: 'O(n)', space: 'O(n)' },
      tags: ['design-pattern', 'behavioral', 'notification', 'loose-coupling']
    });

    this.patterns.set('factory', {
      id: 'factory',
      name: 'Factory Pattern',
      type: 'design-pattern',
      confidence: 0,
      description: 'Creates objects without specifying their exact class',
      explanation: {
        simplified: 'Like a car factory! You order a "vehicle" and the factory decides whether to make a car, truck, or motorcycle based on your needs.',
        technical: 'Creational design pattern that provides an interface for creating objects without specifying their concrete classes.'
      },
      visualization: {
        type: 'flowchart',
        data: { steps: ['Request object', 'Factory decides type', 'Create appropriate object', 'Return object'] }
      },
      examples: ['Factory', 'create', 'make', 'build'],
      complexity: { time: 'O(1)', space: 'O(1)' },
      tags: ['design-pattern', 'creational', 'object-creation', 'polymorphism']
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
      // Original patterns
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

      // Data Structures
      case 'queue':
        if (codeNormalized.includes('queue') || codeNormalized.includes('enqueue') || codeNormalized.includes('dequeue')) confidence += 0.5;
        if (codeNormalized.includes('front') && codeNormalized.includes('rear')) confidence += 0.4;
        if (codeNormalized.includes('fifo') || codeNormalized.includes('first in first out')) confidence += 0.3;
        if (codeNormalized.includes('shift') && codeNormalized.includes('push')) confidence += 0.2;
        break;

      case 'stack':
        if (codeNormalized.includes('stack') || codeNormalized.includes('push') || codeNormalized.includes('pop')) confidence += 0.5;
        if (codeNormalized.includes('peek') || codeNormalized.includes('top')) confidence += 0.3;
        if (codeNormalized.includes('lifo') || codeNormalized.includes('last in first out')) confidence += 0.3;
        if (codeNormalized.includes('peek') && codeNormalized.includes('empty')) confidence += 0.2;
        break;

      case 'binary-tree':
        if (codeNormalized.includes('treenode') || codeNormalized.includes('tree node')) confidence += 0.4;
        if (codeNormalized.includes('left') && codeNormalized.includes('right') && codeNormalized.includes('root')) confidence += 0.4;
        if (codeNormalized.includes('binary tree') || codeNormalized.includes('btree')) confidence += 0.3;
        if (codeNormalized.includes('inorder') || codeNormalized.includes('preorder') || codeNormalized.includes('postorder')) confidence += 0.2;
        break;

      case 'binary-search-tree':
        if (codeNormalized.includes('bst') || codeNormalized.includes('binary search tree')) confidence += 0.5;
        if (codeNormalized.includes('insert') && codeNormalized.includes('search') && codeNormalized.includes('delete')) confidence += 0.4;
        if (codeNormalized.includes('inorder') && codeNormalized.includes('sorted')) confidence += 0.3;
        if (codeNormalized.includes('left') && codeNormalized.includes('right') && codeNormalized.includes('<') && codeNormalized.includes('>')) confidence += 0.2;
        break;

      case 'graph':
        if (codeNormalized.includes('graph') || codeNormalized.includes('vertex') || codeNormalized.includes('edge')) confidence += 0.4;
        if (codeNormalized.includes('adjacency') || codeNormalized.includes('adjacent')) confidence += 0.3;
        if (codeNormalized.includes('traversal') || codeNormalized.includes('traverse')) confidence += 0.3;
        if (codeNormalized.includes('directed') || codeNormalized.includes('undirected')) confidence += 0.2;
        break;

      case 'heap':
        if (codeNormalized.includes('heap') || codeNormalized.includes('max-heap') || codeNormalized.includes('min-heap')) confidence += 0.5;
        if (codeNormalized.includes('heapify') || codeNormalized.includes('extract')) confidence += 0.4;
        if (codeNormalized.includes('parent') && codeNormalized.includes('child') && codeNormalized.includes('array')) confidence += 0.3;
        if (codeNormalized.includes('priority') || codeNormalized.includes('queue')) confidence += 0.2;
        break;

      // Sorting Algorithms
      case 'quick-sort':
        if (codeNormalized.includes('quicksort') || codeNormalized.includes('quick sort')) confidence += 0.5;
        if (codeNormalized.includes('partition') && codeNormalized.includes('pivot')) confidence += 0.4;
        if (codeNormalized.includes('divide') && codeNormalized.includes('conquer')) confidence += 0.3;
        if (codeNormalized.includes('recursive') && codeNormalized.includes('sort')) confidence += 0.2;
        break;

      case 'merge-sort':
        if (codeNormalized.includes('mergesort') || codeNormalized.includes('merge sort')) confidence += 0.5;
        if (codeNormalized.includes('merge') && codeNormalized.includes('divide')) confidence += 0.4;
        if (codeNormalized.includes('halves') || codeNormalized.includes('split')) confidence += 0.3;
        if (codeNormalized.includes('stable') && codeNormalized.includes('sort')) confidence += 0.2;
        break;

      case 'heap-sort':
        if (codeNormalized.includes('heapsort') || codeNormalized.includes('heap sort')) confidence += 0.5;
        if (codeNormalized.includes('heapify') && codeNormalized.includes('extract')) confidence += 0.4;
        if (codeNormalized.includes('max') && codeNormalized.includes('heap') && codeNormalized.includes('sort')) confidence += 0.3;
        if (codeNormalized.includes('in-place') && codeNormalized.includes('sort')) confidence += 0.2;
        break;

      // Search Algorithms
      case 'depth-first-search':
        if (codeNormalized.includes('dfs') || codeNormalized.includes('depth first search')) confidence += 0.5;
        if (codeNormalized.includes('visited') && codeNormalized.includes('recursive')) confidence += 0.4;
        if (codeNormalized.includes('backtrack') || codeNormalized.includes('backtracking')) confidence += 0.3;
        if (codeNormalized.includes('stack') && codeNormalized.includes('traversal')) confidence += 0.2;
        break;

      case 'breadth-first-search':
        if (codeNormalized.includes('bfs') || codeNormalized.includes('breadth first search')) confidence += 0.5;
        if (codeNormalized.includes('queue') && codeNormalized.includes('level')) confidence += 0.4;
        if (codeNormalized.includes('visited') && codeNormalized.includes('iterative')) confidence += 0.3;
        if (codeNormalized.includes('shortest') && codeNormalized.includes('path')) confidence += 0.2;
        break;

      // Dynamic Programming
      case 'memoization':
        if (codeNormalized.includes('memo') || codeNormalized.includes('memoization') || codeNormalized.includes('memoize')) confidence += 0.5;
        if (codeNormalized.includes('cache') && codeNormalized.includes('recursive')) confidence += 0.4;
        if (codeNormalized.includes('dp') && codeNormalized.includes('optimization')) confidence += 0.3;
        if (codeNormalized.includes('top-down') && codeNormalized.includes('dynamic')) confidence += 0.2;
        break;

      case 'tabulation':
        if (codeNormalized.includes('tabulation') || codeNormalized.includes('bottom-up')) confidence += 0.5;
        if (codeNormalized.includes('table') && codeNormalized.includes('iterative')) confidence += 0.4;
        if (codeNormalized.includes('dp') && codeNormalized.includes('array')) confidence += 0.3;
        if (codeNormalized.includes('base case') && codeNormalized.includes('build')) confidence += 0.2;
        break;

      // Design Patterns
      case 'singleton':
        if (codeNormalized.includes('singleton') || codeNormalized.includes('getinstance')) confidence += 0.5;
        if (codeNormalized.includes('static') && codeNormalized.includes('instance')) confidence += 0.4;
        if (codeNormalized.includes('private') && codeNormalized.includes('constructor')) confidence += 0.3;
        break;

      case 'observer':
        if (codeNormalized.includes('observer') || codeNormalized.includes('subject')) confidence += 0.5;
        if (codeNormalized.includes('notify') && codeNormalized.includes('subscribe')) confidence += 0.4;
        if (codeNormalized.includes('event') && codeNormalized.includes('listener')) confidence += 0.3;
        if (codeNormalized.includes('publish') && codeNormalized.includes('subscribe')) confidence += 0.2;
        break;

      case 'factory':
        if (codeNormalized.includes('factory') || codeNormalized.includes('create')) confidence += 0.5;
        if (codeNormalized.includes('make') && codeNormalized.includes('build')) confidence += 0.4;
        if (codeNormalized.includes('interface') && codeNormalized.includes('concrete')) confidence += 0.3;
        if (codeNormalized.includes('polymorphism') && codeNormalized.includes('object')) confidence += 0.2;
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