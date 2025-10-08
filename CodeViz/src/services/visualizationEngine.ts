// Enhanced Visualization Engine for Pattern Recognition
// Generates interactive visualizations for detected patterns

export interface VisualizationNode {
  id: string;
  label: string;
  type: 'function' | 'condition' | 'loop' | 'return' | 'variable';
  children?: VisualizationNode[];
  metadata?: {
    complexity?: string;
    description?: string;
    line?: number;
  };
}

export interface FlowchartData {
  nodes: VisualizationNode[];
  connections: Array<{ from: string; to: string; label?: string }>;
}

export interface TreeVisualization {
  name: string;
  children?: TreeVisualization[];
  value?: number;
  metadata?: any;
}

class VisualizationEngine {
  public generateFibonacciTree(n: number = 5): TreeVisualization {
    const generateNode = (value: number, depth: number = 0): TreeVisualization => {
      if (value <= 1 || depth > 4) {
        return {
          name: `fib(${value})`,
          value: value <= 1 ? value : 0,
          metadata: { isBase: value <= 1, depth }
        };
      }

      return {
        name: `fib(${value})`,
        children: [
          generateNode(value - 1, depth + 1),
          generateNode(value - 2, depth + 1)
        ],
        metadata: { depth }
      };
    };

    return generateNode(n);
  }

  public generateBinarySearchFlow(): FlowchartData {
    const nodes: VisualizationNode[] = [
      {
        id: 'start',
        label: 'Start',
        type: 'function',
        metadata: { description: 'Initialize left=0, right=array.length-1' }
      },
      {
        id: 'condition',
        label: 'left <= right?',
        type: 'condition',
        metadata: { description: 'Check if search space is valid' }
      },
      {
        id: 'calculate_mid',
        label: 'mid = (left + right) / 2',
        type: 'variable',
        metadata: { description: 'Find middle index' }
      },
      {
        id: 'compare',
        label: 'Compare arr[mid] with target',
        type: 'condition',
        metadata: { description: 'Three-way comparison' }
      },
      {
        id: 'found',
        label: 'Return mid',
        type: 'return',
        metadata: { description: 'Target found at middle' }
      },
      {
        id: 'go_left',
        label: 'right = mid - 1',
        type: 'variable',
        metadata: { description: 'Search left half' }
      },
      {
        id: 'go_right',
        label: 'left = mid + 1',
        type: 'variable',
        metadata: { description: 'Search right half' }
      },
      {
        id: 'not_found',
        label: 'Return -1',
        type: 'return',
        metadata: { description: 'Target not found' }
      }
    ];

    const connections = [
      { from: 'start', to: 'condition' },
      { from: 'condition', to: 'calculate_mid', label: 'Yes' },
      { from: 'condition', to: 'not_found', label: 'No' },
      { from: 'calculate_mid', to: 'compare' },
      { from: 'compare', to: 'found', label: 'Equal' },
      { from: 'compare', to: 'go_left', label: 'Target < arr[mid]' },
      { from: 'compare', to: 'go_right', label: 'Target > arr[mid]' },
      { from: 'go_left', to: 'condition' },
      { from: 'go_right', to: 'condition' }
    ];

    return { nodes, connections };
  }

  public generateSortingVisualization(algorithm: string): FlowchartData {
    if (algorithm === 'bubble-sort') {
      const nodes: VisualizationNode[] = [
        {
          id: 'start',
          label: 'Start',
          type: 'function',
          metadata: { description: 'Begin bubble sort' }
        },
        {
          id: 'outer_loop',
          label: 'for i = 0 to n-1',
          type: 'loop',
          metadata: { description: 'Outer loop for passes' }
        },
        {
          id: 'inner_loop',
          label: 'for j = 0 to n-i-1',
          type: 'loop',
          metadata: { description: 'Inner loop for comparisons' }
        },
        {
          id: 'compare',
          label: 'arr[j] > arr[j+1]?',
          type: 'condition',
          metadata: { description: 'Compare adjacent elements' }
        },
        {
          id: 'swap',
          label: 'Swap arr[j] and arr[j+1]',
          type: 'variable',
          metadata: { description: 'Exchange elements' }
        },
        {
          id: 'end',
          label: 'Array Sorted',
          type: 'return',
          metadata: { description: 'Sorting complete' }
        }
      ];

      const connections = [
        { from: 'start', to: 'outer_loop' },
        { from: 'outer_loop', to: 'inner_loop' },
        { from: 'inner_loop', to: 'compare' },
        { from: 'compare', to: 'swap', label: 'Yes' },
        { from: 'compare', to: 'inner_loop', label: 'No' },
        { from: 'swap', to: 'inner_loop' },
        { from: 'outer_loop', to: 'end', label: 'Complete' }
      ];

      return { nodes, connections };
    }

    return { nodes: [], connections: [] };
  }

  public generateLinkedListVisualization(): any {
    return {
      nodes: [
        { id: 'head', label: 'Head', data: 'A', next: 'node1' },
        { id: 'node1', label: 'Node 1', data: 'B', next: 'node2' },
        { id: 'node2', label: 'Node 2', data: 'C', next: 'node3' },
        { id: 'node3', label: 'Node 3', data: 'D', next: null }
      ],
      operations: [
        'Insert at beginning: O(1)',
        'Insert at end: O(n)',
        'Search: O(n)',
        'Delete: O(n)'
      ]
    };
  }

  public generateQueueVisualization(): any {
    return {
      operations: [
        { name: 'enqueue(1)', description: 'Add 1 to rear', position: 'rear' },
        { name: 'enqueue(2)', description: 'Add 2 to rear', position: 'rear' },
        { name: 'enqueue(3)', description: 'Add 3 to rear', position: 'rear' },
        { name: 'dequeue()', description: 'Remove from front (returns 1)', position: 'front' },
        { name: 'peek()', description: 'View front element (returns 2)', position: 'front' }
      ],
      properties: [
        'FIFO (First In, First Out)',
        'O(1) enqueue and dequeue operations',
        'Linear data structure',
        'Front and rear pointers'
      ]
    };
  }

  public generateStackVisualization(): any {
    return {
      operations: [
        { name: 'push(1)', description: 'Add 1 to top', position: 'top' },
        { name: 'push(2)', description: 'Add 2 to top', position: 'top' },
        { name: 'push(3)', description: 'Add 3 to top', position: 'top' },
        { name: 'pop()', description: 'Remove from top (returns 3)', position: 'top' },
        { name: 'peek()', description: 'View top element (returns 2)', position: 'top' }
      ],
      properties: [
        'LIFO (Last In, First Out)',
        'O(1) push and pop operations',
        'Linear data structure',
        'Single top pointer'
      ]
    };
  }

  public generateBinaryTreeVisualization(): TreeVisualization {
    return {
      name: 'Root (10)',
      children: [
        {
          name: 'Left (5)',
          children: [
            { name: 'Left (3)', value: 3 },
            { name: 'Right (7)', value: 7 }
          ]
        },
        {
          name: 'Right (15)',
          children: [
            { name: 'Left (12)', value: 12 },
            { name: 'Right (20)', value: 20 }
          ]
        }
      ],
      metadata: { 
        description: 'Binary Tree Structure',
        properties: ['At most 2 children per node', 'Hierarchical structure', 'Recursive traversal']
      }
    };
  }

  public generateGraphVisualization(): any {
    return {
      nodes: [
        { id: 'A', label: 'A', connections: ['B', 'C'] },
        { id: 'B', label: 'B', connections: ['A', 'D', 'E'] },
        { id: 'C', label: 'C', connections: ['A', 'F'] },
        { id: 'D', label: 'D', connections: ['B', 'E'] },
        { id: 'E', label: 'E', connections: ['B', 'D', 'F'] },
        { id: 'F', label: 'F', connections: ['C', 'E'] }
      ],
      edges: [
        { from: 'A', to: 'B', weight: 1 },
        { from: 'A', to: 'C', weight: 2 },
        { from: 'B', to: 'D', weight: 3 },
        { from: 'B', to: 'E', weight: 1 },
        { from: 'C', to: 'F', weight: 2 },
        { from: 'D', to: 'E', weight: 1 },
        { from: 'E', to: 'F', weight: 2 }
      ],
      properties: [
        'Vertices (nodes) and Edges (connections)',
        'Can be directed or undirected',
        'Can be weighted or unweighted',
        'Traversal: DFS, BFS'
      ]
    };
  }

  public generateQuickSortVisualization(): FlowchartData {
    const nodes: VisualizationNode[] = [
      {
        id: 'start',
        label: 'Start QuickSort',
        type: 'function',
        metadata: { description: 'Choose pivot element' }
      },
      {
        id: 'partition',
        label: 'Partition around pivot',
        type: 'function',
        metadata: { description: 'Rearrange elements: smaller left, larger right' }
      },
      {
        id: 'recursive_left',
        label: 'QuickSort left subarray',
        type: 'function',
        metadata: { description: 'Recursively sort elements < pivot' }
      },
      {
        id: 'recursive_right',
        label: 'QuickSort right subarray',
        type: 'function',
        metadata: { description: 'Recursively sort elements > pivot' }
      },
      {
        id: 'end',
        label: 'Array Sorted',
        type: 'return',
        metadata: { description: 'All subarrays sorted' }
      }
    ];

    const connections = [
      { from: 'start', to: 'partition' },
      { from: 'partition', to: 'recursive_left' },
      { from: 'recursive_left', to: 'recursive_right' },
      { from: 'recursive_right', to: 'end' }
    ];

    return { nodes, connections };
  }

  public generateMergeSortVisualization(): TreeVisualization {
    return {
      name: 'Original Array [8,3,1,6,4,7,2,5]',
      children: [
        {
          name: 'Left Half [8,3,1,6]',
          children: [
            { name: '[8,3]', children: [{ name: '[8]' }, { name: '[3]' }] },
            { name: '[1,6]', children: [{ name: '[1]' }, { name: '[6]' }] }
          ]
        },
        {
          name: 'Right Half [4,7,2,5]',
          children: [
            { name: '[4,7]', children: [{ name: '[4]' }, { name: '[7]' }] },
            { name: '[2,5]', children: [{ name: '[2]' }, { name: '[5]' }] }
          ]
        }
      ],
      metadata: { 
        description: 'Divide and Conquer Process',
        properties: ['Divide: Split array in half', 'Conquer: Sort each half', 'Merge: Combine sorted halves']
      }
    };
  }

  public generateHeapSortVisualization(): TreeVisualization {
    return {
      name: 'Max Heap (Initial)',
      children: [
        { name: '8', children: [{ name: '6' }, { name: '7' }] },
        { name: '6', children: [{ name: '4' }, { name: '5' }] },
        { name: '7', children: [{ name: '2' }, { name: '3' }] }
      ],
      metadata: { 
        description: 'Heap Sort Process',
        properties: [
          'Build max-heap from array',
          'Repeatedly extract maximum element',
          'Place at end of array',
          'Heapify remaining elements'
        ]
      }
    };
  }

  public generateDFSVisualization(): any {
    return {
      nodes: [
        { id: 'A', label: 'A', visited: true, order: 1 },
        { id: 'B', label: 'B', visited: true, order: 2 },
        { id: 'C', label: 'C', visited: true, order: 3 },
        { id: 'D', label: 'D', visited: true, order: 4 },
        { id: 'E', label: 'E', visited: false, order: null },
        { id: 'F', label: 'F', visited: false, order: null }
      ],
      edges: [
        { from: 'A', to: 'B', traversed: true },
        { from: 'B', to: 'C', traversed: true },
        { from: 'C', to: 'D', traversed: true },
        { from: 'A', to: 'E', traversed: false },
        { from: 'B', to: 'F', traversed: false }
      ],
      traversal: {
        type: 'DFS',
        order: ['A', 'B', 'C', 'D'],
        description: 'Deep exploration before backtracking'
      }
    };
  }

  public generateBFSVisualization(): any {
    return {
      nodes: [
        { id: 'A', label: 'A', visited: true, level: 0 },
        { id: 'B', label: 'B', visited: true, level: 1 },
        { id: 'C', label: 'C', visited: true, level: 1 },
        { id: 'D', label: 'D', visited: true, level: 2 },
        { id: 'E', label: 'E', visited: true, level: 2 },
        { id: 'F', label: 'F', visited: false, level: null }
      ],
      edges: [
        { from: 'A', to: 'B', traversed: true },
        { from: 'A', to: 'C', traversed: true },
        { from: 'B', to: 'D', traversed: true },
        { from: 'C', to: 'E', traversed: true },
        { from: 'D', to: 'F', traversed: false }
      ],
      traversal: {
        type: 'BFS',
        order: ['A', 'B', 'C', 'D', 'E'],
        description: 'Level-by-level exploration'
      }
    };
  }

  public generateBSTVisualization(): TreeVisualization {
    return {
      name: 'Root (10)',
      children: [
        {
          name: 'Left (5)',
          children: [
            { name: 'Left (3)', value: 3, metadata: { property: '3 < 5' } },
            { name: 'Right (7)', value: 7, metadata: { property: '7 > 5' } }
          ],
          metadata: { property: '5 < 10' }
        },
        {
          name: 'Right (15)',
          children: [
            { name: 'Left (12)', value: 12, metadata: { property: '12 > 10, 12 < 15' } },
            { name: 'Right (20)', value: 20, metadata: { property: '20 > 15' } }
          ],
          metadata: { property: '15 > 10' }
        }
      ],
      metadata: { 
        description: 'Binary Search Tree Property',
        property: 'Left < Node < Right',
        operations: ['Search: O(log n)', 'Insert: O(log n)', 'Delete: O(log n)']
      }
    };
  }

  public generatePatternVisualization(patternId: string, data?: any): any {
    switch (patternId) {
      case 'fibonacci-recursive':
        return {
          type: 'tree',
          data: this.generateFibonacciTree(data?.n || 5)
        };
      
      case 'binary-search':
        return {
          type: 'flowchart',
          data: this.generateBinarySearchFlow()
        };
      
      case 'bubble-sort':
        return {
          type: 'flowchart',
          data: this.generateSortingVisualization('bubble-sort')
        };
      
      case 'linked-list':
        return {
          type: 'graph',
          data: this.generateLinkedListVisualization()
        };

      // New Data Structure Visualizations
      case 'queue':
        return {
          type: 'sequence',
          data: this.generateQueueVisualization()
        };

      case 'stack':
        return {
          type: 'sequence',
          data: this.generateStackVisualization()
        };

      case 'binary-tree':
        return {
          type: 'tree',
          data: this.generateBinaryTreeVisualization()
        };

      case 'graph':
        return {
          type: 'graph',
          data: this.generateGraphVisualization()
        };

      // New Sorting Algorithm Visualizations
      case 'quick-sort':
        return {
          type: 'flowchart',
          data: this.generateQuickSortVisualization()
        };

      case 'merge-sort':
        return {
          type: 'tree',
          data: this.generateMergeSortVisualization()
        };

      case 'heap-sort':
        return {
          type: 'tree',
          data: this.generateHeapSortVisualization()
        };

      // Graph Traversal Visualizations
      case 'depth-first-search':
        return {
          type: 'graph',
          data: this.generateDFSVisualization()
        };

      case 'breadth-first-search':
        return {
          type: 'graph',
          data: this.generateBFSVisualization()
        };

      case 'binary-search-tree':
        return {
          type: 'tree',
          data: this.generateBSTVisualization()
        };
      
      default:
        return {
          type: 'simple',
          data: { message: 'Visualization not available for this pattern' }
        };
    }
  }
}

export const visualizationEngine = new VisualizationEngine();