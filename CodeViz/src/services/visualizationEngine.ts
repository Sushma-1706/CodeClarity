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

      case 'singleton':
        return {
          type: 'flowchart',
          data: {
            nodes: [
              {
                id: 'check_instance',
                label: 'instance exists?',
                type: 'condition',
                metadata: { description: 'Check static instance reference' }
              },
              {
                id: 'create_instance',
                label: 'Create singleton instance',
                type: 'variable',
                metadata: { description: 'Initialize only once' }
              },
              {
                id: 'return_instance',
                label: 'Return instance',
                type: 'return',
                metadata: { description: 'Always return same object' }
              }
            ],
            connections: [
              { from: 'check_instance', to: 'create_instance', label: 'No' },
              { from: 'check_instance', to: 'return_instance', label: 'Yes' },
              { from: 'create_instance', to: 'return_instance' }
            ]
          }
        };

      case 'palindrome-check':
        return {
          type: 'flowchart',
          data: {
            nodes: [
              {
                id: 'read_input',
                label: 'Read input value',
                type: 'function',
                metadata: { description: 'Store original value' }
              },
              {
                id: 'reverse_value',
                label: 'Reverse value',
                type: 'loop',
                metadata: { description: 'Build reversed representation' }
              },
              {
                id: 'compare',
                label: 'original == reversed?',
                type: 'condition',
                metadata: { description: 'Check palindrome condition' }
              },
              {
                id: 'return_true',
                label: 'Return Palindrome',
                type: 'return',
                metadata: { description: 'Input is symmetric' }
              },
              {
                id: 'return_false',
                label: 'Return Not Palindrome',
                type: 'return',
                metadata: { description: 'Input is not symmetric' }
              }
            ],
            connections: [
              { from: 'read_input', to: 'reverse_value' },
              { from: 'reverse_value', to: 'compare' },
              { from: 'compare', to: 'return_true', label: 'Yes' },
              { from: 'compare', to: 'return_false', label: 'No' }
            ]
          }
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