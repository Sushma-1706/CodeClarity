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

  public generatePatternVisualization(patternId: string, data?: any): any {
    switch (patternId) {
      // Original patterns
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

      // Data Structures
      case 'queue':
        return {
          type: 'graph',
          data: this.generateQueueVisualization()
        };

      case 'stack':
        return {
          type: 'graph',
          data: this.generateStackVisualization()
        };

      case 'binary-tree':
        return {
          type: 'tree',
          data: this.generateBinaryTreeVisualization()
        };

      case 'binary-search-tree':
        return {
          type: 'tree',
          data: this.generateBSTVisualization()
        };

      case 'graph':
        return {
          type: 'graph',
          data: this.generateGraphVisualization()
        };

      case 'heap':
        return {
          type: 'tree',
          data: this.generateHeapVisualization()
        };

      // Sorting Algorithms
      case 'quick-sort':
        return {
          type: 'flowchart',
          data: this.generateQuickSortFlow()
        };

      case 'merge-sort':
        return {
          type: 'flowchart',
          data: this.generateMergeSortFlow()
        };

      case 'heap-sort':
        return {
          type: 'flowchart',
          data: this.generateHeapSortFlow()
        };

      // Search Algorithms
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

      // Dynamic Programming
      case 'memoization':
        return {
          type: 'flowchart',
          data: this.generateMemoizationFlow()
        };

      case 'tabulation':
        return {
          type: 'flowchart',
          data: this.generateTabulationFlow()
        };

      // Design Patterns
      case 'singleton':
        return {
          type: 'flowchart',
          data: this.generateSingletonFlow()
        };

      case 'observer':
        return {
          type: 'graph',
          data: this.generateObserverVisualization()
        };

      case 'factory':
        return {
          type: 'flowchart',
          data: this.generateFactoryFlow()
        };
      
      default:
        return {
          type: 'simple',
          data: { message: 'Visualization not available for this pattern' }
        };
    }
  }

  // Data Structure Visualizations
  public generateQueueVisualization(): any {
    return {
      nodes: [
        { id: 'front', label: 'Front', data: '1', next: 'item2' },
        { id: 'item2', label: 'Item 2', data: '2', next: 'item3' },
        { id: 'item3', label: 'Item 3', data: '3', next: 'rear' },
        { id: 'rear', label: 'Rear', data: '4', next: null }
      ],
      operations: [
        'Enqueue: Add to rear - O(1)',
        'Dequeue: Remove from front - O(1)',
        'Peek: View front element - O(1)',
        'IsEmpty: Check if empty - O(1)'
      ]
    };
  }

  public generateStackVisualization(): any {
    return {
      nodes: [
        { id: 'top', label: 'Top', data: '3', next: 'item2' },
        { id: 'item2', label: 'Item 2', data: '2', next: 'item1' },
        { id: 'item1', label: 'Item 1', data: '1', next: 'bottom' },
        { id: 'bottom', label: 'Bottom', data: 'Base', next: null }
      ],
      operations: [
        'Push: Add to top - O(1)',
        'Pop: Remove from top - O(1)',
        'Peek: View top element - O(1)',
        'IsEmpty: Check if empty - O(1)'
      ]
    };
  }

  public generateBinaryTreeVisualization(): TreeVisualization {
    return {
      name: 'Root (8)',
      children: [
        {
          name: 'Left (3)',
          children: [
            { name: 'Left (1)', value: 1 },
            { name: 'Right (6)', value: 6 }
          ]
        },
        {
          name: 'Right (10)',
          children: [
            { name: 'Left (9)', value: 9 },
            { name: 'Right (14)', value: 14 }
          ]
        }
      ]
    };
  }

  public generateBSTVisualization(): TreeVisualization {
    return {
      name: '8',
      children: [
        {
          name: '3',
          children: [
            { name: '1', value: 1 },
            { name: '6', value: 6 }
          ]
        },
        {
          name: '10',
          children: [
            { name: '9', value: 9 },
            { name: '14', value: 14 }
          ]
        }
      ]
    };
  }

  public generateGraphVisualization(): any {
    return {
      nodes: [
        { id: 'A', label: 'A', connections: ['B', 'D'] },
        { id: 'B', label: 'B', connections: ['A', 'C', 'E'] },
        { id: 'C', label: 'C', connections: ['B', 'F'] },
        { id: 'D', label: 'D', connections: ['A', 'E'] },
        { id: 'E', label: 'E', connections: ['B', 'D', 'F'] },
        { id: 'F', label: 'F', connections: ['C', 'E'] }
      ],
      operations: [
        'Add Vertex: O(1)',
        'Add Edge: O(1)',
        'Remove Vertex: O(V + E)',
        'Remove Edge: O(1)',
        'Traversal: O(V + E)'
      ]
    };
  }

  public generateHeapVisualization(): TreeVisualization {
    return {
      name: '9',
      children: [
        {
          name: '7',
          children: [
            { name: '4', value: 4 },
            { name: '2', value: 2 }
          ]
        },
        {
          name: '5',
          children: [
            { name: '1', value: 1 },
            { name: '3', value: 3 }
          ]
        }
      ]
    };
  }

  // Sorting Algorithm Visualizations
  public generateQuickSortFlow(): FlowchartData {
    const nodes: VisualizationNode[] = [
      {
        id: 'start',
        label: 'Start Quick Sort',
        type: 'function',
        metadata: { description: 'Initialize quick sort algorithm' }
      },
      {
        id: 'choose_pivot',
        label: 'Choose Pivot Element',
        type: 'variable',
        metadata: { description: 'Select pivot (first, last, or random element)' }
      },
      {
        id: 'partition',
        label: 'Partition Array',
        type: 'function',
        metadata: { description: 'Rearrange elements around pivot' }
      },
      {
        id: 'recursive_left',
        label: 'Quick Sort Left Subarray',
        type: 'function',
        metadata: { description: 'Recursively sort elements < pivot' }
      },
      {
        id: 'recursive_right',
        label: 'Quick Sort Right Subarray',
        type: 'function',
        metadata: { description: 'Recursively sort elements > pivot' }
      },
      {
        id: 'end',
        label: 'Array Sorted',
        type: 'return',
        metadata: { description: 'Sorting complete' }
      }
    ];

    const connections = [
      { from: 'start', to: 'choose_pivot' },
      { from: 'choose_pivot', to: 'partition' },
      { from: 'partition', to: 'recursive_left' },
      { from: 'recursive_left', to: 'recursive_right' },
      { from: 'recursive_right', to: 'end' }
    ];

    return { nodes, connections };
  }

  public generateMergeSortFlow(): FlowchartData {
    const nodes: VisualizationNode[] = [
      {
        id: 'start',
        label: 'Start Merge Sort',
        type: 'function',
        metadata: { description: 'Initialize merge sort algorithm' }
      },
      {
        id: 'divide',
        label: 'Divide Array',
        type: 'function',
        metadata: { description: 'Split array into two halves' }
      },
      {
        id: 'sort_left',
        label: 'Sort Left Half',
        type: 'function',
        metadata: { description: 'Recursively sort left subarray' }
      },
      {
        id: 'sort_right',
        label: 'Sort Right Half',
        type: 'function',
        metadata: { description: 'Recursively sort right subarray' }
      },
      {
        id: 'merge',
        label: 'Merge Sorted Halves',
        type: 'function',
        metadata: { description: 'Combine sorted halves into sorted array' }
      },
      {
        id: 'end',
        label: 'Array Sorted',
        type: 'return',
        metadata: { description: 'Sorting complete' }
      }
    ];

    const connections = [
      { from: 'start', to: 'divide' },
      { from: 'divide', to: 'sort_left' },
      { from: 'sort_left', to: 'sort_right' },
      { from: 'sort_right', to: 'merge' },
      { from: 'merge', to: 'end' }
    ];

    return { nodes, connections };
  }

  public generateHeapSortFlow(): FlowchartData {
    const nodes: VisualizationNode[] = [
      {
        id: 'start',
        label: 'Start Heap Sort',
        type: 'function',
        metadata: { description: 'Initialize heap sort algorithm' }
      },
      {
        id: 'build_heap',
        label: 'Build Max Heap',
        type: 'function',
        metadata: { description: 'Convert array to max heap' }
      },
      {
        id: 'extract_max',
        label: 'Extract Max Element',
        type: 'function',
        metadata: { description: 'Remove largest element from heap' }
      },
      {
        id: 'place_end',
        label: 'Place at End',
        type: 'variable',
        metadata: { description: 'Put max element at end of array' }
      },
      {
        id: 'heapify',
        label: 'Heapify Remaining',
        type: 'function',
        metadata: { description: 'Restore heap property' }
      },
      {
        id: 'repeat',
        label: 'Repeat Until Sorted',
        type: 'loop',
        metadata: { description: 'Continue until all elements sorted' }
      },
      {
        id: 'end',
        label: 'Array Sorted',
        type: 'return',
        metadata: { description: 'Sorting complete' }
      }
    ];

    const connections = [
      { from: 'start', to: 'build_heap' },
      { from: 'build_heap', to: 'extract_max' },
      { from: 'extract_max', to: 'place_end' },
      { from: 'place_end', to: 'heapify' },
      { from: 'heapify', to: 'repeat' },
      { from: 'repeat', to: 'extract_max', label: 'Continue' },
      { from: 'repeat', to: 'end', label: 'Complete' }
    ];

    return { nodes, connections };
  }

  // Search Algorithm Visualizations
  public generateDFSVisualization(): any {
    return {
      nodes: [
        { id: 'A', label: 'A', visited: true, connections: ['B', 'D'] },
        { id: 'B', label: 'B', visited: true, connections: ['A', 'C', 'E'] },
        { id: 'C', label: 'C', visited: false, connections: ['B', 'F'] },
        { id: 'D', label: 'D', visited: false, connections: ['A', 'E'] },
        { id: 'E', label: 'E', visited: false, connections: ['B', 'D', 'F'] },
        { id: 'F', label: 'F', visited: false, connections: ['C', 'E'] }
      ],
      operations: [
        'Start at vertex A',
        'Mark A as visited',
        'Visit unvisited neighbor B',
        'Mark B as visited',
        'Continue depth-first',
        'Backtrack when no unvisited neighbors'
      ]
    };
  }

  public generateBFSVisualization(): any {
    return {
      nodes: [
        { id: 'A', label: 'A', level: 0, connections: ['B', 'D'] },
        { id: 'B', label: 'B', level: 1, connections: ['A', 'C', 'E'] },
        { id: 'D', label: 'D', level: 1, connections: ['A', 'E'] },
        { id: 'C', label: 'C', level: 2, connections: ['B', 'F'] },
        { id: 'E', label: 'E', level: 2, connections: ['B', 'D', 'F'] },
        { id: 'F', label: 'F', level: 3, connections: ['C', 'E'] }
      ],
      operations: [
        'Start at vertex A (level 0)',
        'Add A to queue',
        'Process level 1: B, D',
        'Process level 2: C, E',
        'Process level 3: F',
        'Continue until queue empty'
      ]
    };
  }

  // Dynamic Programming Visualizations
  public generateMemoizationFlow(): FlowchartData {
    const nodes: VisualizationNode[] = [
      {
        id: 'start',
        label: 'Function Call',
        type: 'function',
        metadata: { description: 'Function called with parameters' }
      },
      {
        id: 'check_cache',
        label: 'Check Cache',
        type: 'condition',
        metadata: { description: 'Look for result in memoization cache' }
      },
      {
        id: 'return_cached',
        label: 'Return Cached Result',
        type: 'return',
        metadata: { description: 'Return previously computed result' }
      },
      {
        id: 'compute',
        label: 'Compute Result',
        type: 'function',
        metadata: { description: 'Calculate result recursively' }
      },
      {
        id: 'cache_result',
        label: 'Cache Result',
        type: 'variable',
        metadata: { description: 'Store result in cache for future use' }
      },
      {
        id: 'return_result',
        label: 'Return Result',
        type: 'return',
        metadata: { description: 'Return computed result' }
      }
    ];

    const connections = [
      { from: 'start', to: 'check_cache' },
      { from: 'check_cache', to: 'return_cached', label: 'Found' },
      { from: 'check_cache', to: 'compute', label: 'Not Found' },
      { from: 'compute', to: 'cache_result' },
      { from: 'cache_result', to: 'return_result' }
    ];

    return { nodes, connections };
  }

  public generateTabulationFlow(): FlowchartData {
    const nodes: VisualizationNode[] = [
      {
        id: 'start',
        label: 'Start DP',
        type: 'function',
        metadata: { description: 'Initialize dynamic programming' }
      },
      {
        id: 'init_base',
        label: 'Initialize Base Cases',
        type: 'variable',
        metadata: { description: 'Set up base case values in table' }
      },
      {
        id: 'fill_table',
        label: 'Fill DP Table',
        type: 'loop',
        metadata: { description: 'Iteratively fill table using previous results' }
      },
      {
        id: 'use_previous',
        label: 'Use Previous Results',
        type: 'function',
        metadata: { description: 'Combine previous table values' }
      },
      {
        id: 'return_final',
        label: 'Return Final Result',
        type: 'return',
        metadata: { description: 'Return value from last table position' }
      }
    ];

    const connections = [
      { from: 'start', to: 'init_base' },
      { from: 'init_base', to: 'fill_table' },
      { from: 'fill_table', to: 'use_previous' },
      { from: 'use_previous', to: 'fill_table', label: 'Continue' },
      { from: 'fill_table', to: 'return_final', label: 'Complete' }
    ];

    return { nodes, connections };
  }

  // Design Pattern Visualizations
  public generateSingletonFlow(): FlowchartData {
    const nodes: VisualizationNode[] = [
      {
        id: 'request',
        label: 'Request Instance',
        type: 'function',
        metadata: { description: 'Client requests singleton instance' }
      },
      {
        id: 'check_instance',
        label: 'Check if Instance Exists',
        type: 'condition',
        metadata: { description: 'Check if static instance is null' }
      },
      {
        id: 'create_instance',
        label: 'Create New Instance',
        type: 'function',
        metadata: { description: 'Instantiate singleton object' }
      },
      {
        id: 'return_instance',
        label: 'Return Instance',
        type: 'return',
        metadata: { description: 'Return singleton instance' }
      }
    ];

    const connections = [
      { from: 'request', to: 'check_instance' },
      { from: 'check_instance', to: 'create_instance', label: 'Null' },
      { from: 'check_instance', to: 'return_instance', label: 'Exists' },
      { from: 'create_instance', to: 'return_instance' }
    ];

    return { nodes, connections };
  }

  public generateObserverVisualization(): any {
    return {
      nodes: [
        { id: 'subject', label: 'Subject', connections: ['observer1', 'observer2', 'observer3'] },
        { id: 'observer1', label: 'Observer 1', connections: ['subject'] },
        { id: 'observer2', label: 'Observer 2', connections: ['subject'] },
        { id: 'observer3', label: 'Observer 3', connections: ['subject'] }
      ],
      operations: [
        'Subject maintains list of observers',
        'Observers subscribe to subject',
        'Subject notifies all observers on change',
        'Observers update their state accordingly'
      ]
    };
  }

  public generateFactoryFlow(): FlowchartData {
    const nodes: VisualizationNode[] = [
      {
        id: 'request',
        label: 'Request Object',
        type: 'function',
        metadata: { description: 'Client requests object creation' }
      },
      {
        id: 'determine_type',
        label: 'Determine Object Type',
        type: 'condition',
        metadata: { description: 'Factory decides which concrete class to instantiate' }
      },
      {
        id: 'create_car',
        label: 'Create Car',
        type: 'function',
        metadata: { description: 'Instantiate Car object' }
      },
      {
        id: 'create_truck',
        label: 'Create Truck',
        type: 'function',
        metadata: { description: 'Instantiate Truck object' }
      },
      {
        id: 'return_object',
        label: 'Return Object',
        type: 'return',
        metadata: { description: 'Return created object to client' }
      }
    ];

    const connections = [
      { from: 'request', to: 'determine_type' },
      { from: 'determine_type', to: 'create_car', label: 'Vehicle Type: Car' },
      { from: 'determine_type', to: 'create_truck', label: 'Vehicle Type: Truck' },
      { from: 'create_car', to: 'return_object' },
      { from: 'create_truck', to: 'return_object' }
    ];

    return { nodes, connections };
  }
}

export const visualizationEngine = new VisualizationEngine();