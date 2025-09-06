// Advanced ML Pattern Recognition Engine
// Simulates machine learning capabilities for pattern detection

export interface MLFeatures {
  tokenCount: number;
  avgLineLength: number;
  indentationLevel: number;
  keywordDensity: { [key: string]: number };
  structuralComplexity: number;
  cyclomaticComplexity: number;
}

export interface MLPrediction {
  patternId: string;
  confidence: number;
  features: MLFeatures;
  reasoning: string[];
}

class MLPatternEngine {
  private readonly KEYWORDS = {
    javascript: ['function', 'return', 'if', 'else', 'for', 'while', 'const', 'let', 'var'],
    python: ['def', 'return', 'if', 'else', 'elif', 'for', 'while', 'class', 'import'],
    java: ['public', 'private', 'class', 'return', 'if', 'else', 'for', 'while', 'static'],
    cpp: ['int', 'return', 'if', 'else', 'for', 'while', 'class', 'public', 'private'],
    c: ['int', 'return', 'if', 'else', 'for', 'while', 'struct', 'void', 'char']
  };

  private readonly PATTERN_SIGNATURES = {
    // Original patterns
    'fibonacci-recursive': {
      keywords: ['fibonacci', 'fib', 'return', 'if'],
      structures: ['recursive_call', 'base_case', 'binary_recursion'],
      complexity_indicators: ['exponential_growth', 'overlapping_subproblems']
    },
    'binary-search': {
      keywords: ['binary', 'search', 'middle', 'mid', 'left', 'right'],
      structures: ['divide_conquer', 'logarithmic_reduction', 'sorted_array'],
      complexity_indicators: ['log_n_time', 'constant_space']
    },
    'bubble-sort': {
      keywords: ['bubble', 'sort', 'swap', 'temp'],
      structures: ['nested_loops', 'adjacent_comparison', 'in_place_sorting'],
      complexity_indicators: ['quadratic_time', 'constant_space']
    },
    'linked-list': {
      keywords: ['node', 'next', 'head', 'tail', 'link'],
      structures: ['pointer_traversal', 'dynamic_allocation', 'sequential_access'],
      complexity_indicators: ['linear_access', 'dynamic_size']
    },
    
    // Data Structures
    'queue': {
      keywords: ['queue', 'enqueue', 'dequeue', 'front', 'rear', 'fifo'],
      structures: ['fifo_operations', 'linear_structure', 'sequential_access'],
      complexity_indicators: ['constant_time_operations', 'linear_space']
    },
    'stack': {
      keywords: ['stack', 'push', 'pop', 'peek', 'top', 'lifo'],
      structures: ['lifo_operations', 'linear_structure', 'sequential_access'],
      complexity_indicators: ['constant_time_operations', 'linear_space']
    },
    'binary-tree': {
      keywords: ['treenode', 'tree', 'left', 'right', 'root', 'inorder', 'preorder', 'postorder'],
      structures: ['hierarchical_structure', 'recursive_traversal', 'binary_branching'],
      complexity_indicators: ['logarithmic_access', 'recursive_space']
    },
    'binary-search-tree': {
      keywords: ['bst', 'binary search tree', 'insert', 'search', 'delete', 'inorder', 'sorted'],
      structures: ['ordered_structure', 'recursive_operations', 'binary_branching'],
      complexity_indicators: ['logarithmic_access', 'recursive_space']
    },
    'graph': {
      keywords: ['graph', 'vertex', 'edge', 'adjacency', 'traversal', 'traverse', 'directed', 'undirected'],
      structures: ['non_linear_structure', 'vertex_edge_relationships', 'traversal_algorithms'],
      complexity_indicators: ['polynomial_time', 'linear_space']
    },
    'heap': {
      keywords: ['heap', 'max-heap', 'min-heap', 'heapify', 'extract', 'priority', 'parent', 'child'],
      structures: ['complete_binary_tree', 'heap_property', 'array_representation'],
      complexity_indicators: ['logarithmic_operations', 'linear_space']
    },
    
    // Sorting Algorithms
    'quick-sort': {
      keywords: ['quicksort', 'quick sort', 'partition', 'pivot', 'divide', 'conquer'],
      structures: ['divide_conquer', 'partitioning', 'recursive_sorting'],
      complexity_indicators: ['logarithmic_average', 'quadratic_worst']
    },
    'merge-sort': {
      keywords: ['mergesort', 'merge sort', 'merge', 'divide', 'halves', 'split', 'stable'],
      structures: ['divide_conquer', 'merging', 'recursive_sorting'],
      complexity_indicators: ['logarithmic_time', 'linear_space']
    },
    'heap-sort': {
      keywords: ['heapsort', 'heap sort', 'heapify', 'extract', 'max', 'heap', 'in-place'],
      structures: ['heap_operations', 'in_place_sorting', 'extraction_sorting'],
      complexity_indicators: ['logarithmic_time', 'constant_space']
    },
    
    // Search Algorithms
    'depth-first-search': {
      keywords: ['dfs', 'depth first search', 'visited', 'recursive', 'backtrack', 'backtracking'],
      structures: ['recursive_traversal', 'backtracking', 'stack_based'],
      complexity_indicators: ['linear_time', 'linear_space']
    },
    'breadth-first-search': {
      keywords: ['bfs', 'breadth first search', 'queue', 'level', 'visited', 'iterative', 'shortest', 'path'],
      structures: ['level_order_traversal', 'queue_based', 'iterative_traversal'],
      complexity_indicators: ['linear_time', 'linear_space']
    },
    
    // Dynamic Programming
    'memoization': {
      keywords: ['memo', 'memoization', 'memoize', 'cache', 'dp', 'optimization', 'top-down', 'dynamic'],
      structures: ['caching', 'recursive_optimization', 'top_down_approach'],
      complexity_indicators: ['linear_time', 'linear_space']
    },
    'tabulation': {
      keywords: ['tabulation', 'bottom-up', 'table', 'iterative', 'dp', 'array', 'base case', 'build'],
      structures: ['iterative_approach', 'table_filling', 'bottom_up_approach'],
      complexity_indicators: ['linear_time', 'linear_space']
    },
    
    // Design Patterns
    'singleton': {
      keywords: ['singleton', 'getinstance', 'static', 'instance', 'private', 'constructor'],
      structures: ['single_instance', 'static_access', 'private_constructor'],
      complexity_indicators: ['constant_time', 'constant_space']
    },
    'observer': {
      keywords: ['observer', 'subject', 'notify', 'subscribe', 'event', 'listener', 'publish', 'subscribe'],
      structures: ['notification_system', 'loose_coupling', 'event_driven'],
      complexity_indicators: ['linear_notification', 'linear_space']
    },
    'factory': {
      keywords: ['factory', 'create', 'make', 'build', 'interface', 'concrete', 'polymorphism', 'object'],
      structures: ['object_creation', 'polymorphic_instantiation', 'interface_based'],
      complexity_indicators: ['constant_creation', 'constant_space']
    }
  };

  public extractFeatures(code: string, language: string): MLFeatures {
    const lines = code.split('\n').filter(line => line.trim());
    const tokens = code.split(/\s+/).filter(token => token.length > 0);
    
    // Calculate basic metrics
    const tokenCount = tokens.length;
    const avgLineLength = lines.reduce((sum, line) => sum + line.length, 0) / lines.length;
    const indentationLevel = this.calculateIndentationComplexity(lines);
    
    // Keyword density analysis
    const keywords = this.KEYWORDS[language as keyof typeof this.KEYWORDS] || [];
    const keywordDensity: { [key: string]: number } = {};
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = code.match(regex) || [];
      keywordDensity[keyword] = matches.length / tokenCount;
    });

    // Structural complexity
    const structuralComplexity = this.calculateStructuralComplexity(code);
    const cyclomaticComplexity = this.calculateCyclomaticComplexity(code);

    return {
      tokenCount,
      avgLineLength,
      indentationLevel,
      keywordDensity,
      structuralComplexity,
      cyclomaticComplexity
    };
  }

  public predictPattern(code: string, language: string): MLPrediction[] {
    const features = this.extractFeatures(code, language);
    const predictions: MLPrediction[] = [];

    // Analyze each pattern signature
    Object.entries(this.PATTERN_SIGNATURES).forEach(([patternId, signature]) => {
      const confidence = this.calculatePatternConfidence(code, features, signature);
      const reasoning = this.generateReasoning(code, features, signature);

      if (confidence > 0.2) { // Threshold for ML prediction
        predictions.push({
          patternId,
          confidence,
          features,
          reasoning
        });
      }
    });

    return predictions.sort((a, b) => b.confidence - a.confidence);
  }

  private calculateIndentationComplexity(lines: string[]): number {
    let totalIndentation = 0;
    let maxIndentation = 0;

    lines.forEach(line => {
      const indentation = line.length - line.trimStart().length;
      totalIndentation += indentation;
      maxIndentation = Math.max(maxIndentation, indentation);
    });

    return lines.length > 0 ? (totalIndentation / lines.length) + (maxIndentation * 0.1) : 0;
  }

  private calculateStructuralComplexity(code: string): number {
    let complexity = 0;
    
    // Count control structures
    const controlStructures = [
      /\bif\s*\(/g,
      /\belse\s*if\s*\(/g,
      /\bwhile\s*\(/g,
      /\bfor\s*\(/g,
      /\bswitch\s*\(/g,
      /\btry\s*\{/g,
      /\bcatch\s*\(/g
    ];

    controlStructures.forEach(regex => {
      const matches = code.match(regex) || [];
      complexity += matches.length;
    });

    // Add function complexity
    const functions = code.match(/function\s+\w+|def\s+\w+|public\s+\w+\s+\w+\(/g) || [];
    complexity += functions.length * 0.5;

    return complexity;
  }

  private calculateCyclomaticComplexity(code: string): number {
    let complexity = 1; // Base complexity

    // Decision points
    const decisionPoints = [
      /\bif\s*\(/g,
      /\belse\s*if\s*\(/g,
      /\bwhile\s*\(/g,
      /\bfor\s*\(/g,
      /\bcase\s+/g,
      /\bcatch\s*\(/g,
      /\b&&\b/g,
      /\b\|\|\b/g,
      /\?\s*.*\s*:/g // Ternary operator
    ];

    decisionPoints.forEach(regex => {
      const matches = code.match(regex) || [];
      complexity += matches.length;
    });

    return complexity;
  }

  private calculatePatternConfidence(
    code: string, 
    features: MLFeatures, 
    signature: any
  ): number {
    let confidence = 0;
    const codeNormalized = code.toLowerCase();

    // Keyword matching with weighted scoring
    signature.keywords.forEach((keyword: string) => {
      if (codeNormalized.includes(keyword)) {
        confidence += 0.15; // Base keyword match
        
        // Bonus for keyword density
        const density = features.keywordDensity[keyword] || 0;
        confidence += Math.min(density * 2, 0.1);
      }
    });

    // Structural pattern matching
    signature.structures.forEach((structure: string) => {
      const structureConfidence = this.detectStructuralPattern(code, structure);
      confidence += structureConfidence * 0.2;
    });

    // Complexity indicators
    signature.complexity_indicators.forEach((indicator: string) => {
      const indicatorConfidence = this.detectComplexityIndicator(features, indicator);
      confidence += indicatorConfidence * 0.15;
    });

    // Normalize confidence to [0, 1]
    return Math.min(confidence, 1.0);
  }

  private detectStructuralPattern(code: string, pattern: string): number {
    switch (pattern) {
      // Original patterns
      case 'recursive_call':
        // Look for function calling itself
        const functionNames = code.match(/function\s+(\w+)|def\s+(\w+)/g) || [];
        return functionNames.some(fn => {
          const name = fn.split(/\s+/)[1];
          return code.includes(`${name}(`);
        }) ? 1.0 : 0.0;

      case 'base_case':
        return /if\s*\([^)]*<=?\s*[12]\s*\)/.test(code) ? 1.0 : 0.0;

      case 'binary_recursion':
        return /return.*\+.*\(.*-\s*1.*\).*\(.*-\s*2.*\)/.test(code) ? 1.0 : 0.0;

      case 'divide_conquer':
        return /middle|mid/.test(code.toLowerCase()) && 
               /left.*right|right.*left/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'nested_loops':
        const forLoops = code.match(/for\s*\(/g) || [];
        return forLoops.length >= 2 ? 1.0 : 0.5;

      case 'adjacent_comparison':
        return /\[\s*\w+\s*\]\s*[<>]=?\s*\[\s*\w+\s*\+\s*1\s*\]/.test(code) ? 1.0 : 0.0;

      // Data Structure patterns
      case 'fifo_operations':
        return /enqueue|dequeue|front|rear/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'lifo_operations':
        return /push|pop|peek|top/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'hierarchical_structure':
        return /left|right|root|parent|child/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'recursive_traversal':
        return /inorder|preorder|postorder|traverse/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'binary_branching':
        return /left.*right|right.*left/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'ordered_structure':
        return /insert|search|delete|sorted/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'non_linear_structure':
        return /vertex|edge|adjacency|graph/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'vertex_edge_relationships':
        return /adjacent|neighbor|connection/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'traversal_algorithms':
        return /dfs|bfs|traversal|traverse/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'complete_binary_tree':
        return /heap|parent|child|array/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'heap_property':
        return /max.*heap|min.*heap|heapify/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'array_representation':
        return /array|index|position/.test(code.toLowerCase()) ? 1.0 : 0.0;

      // Sorting patterns
      case 'partitioning':
        return /partition|pivot|divide/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'recursive_sorting':
        return /recursive.*sort|sort.*recursive/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'merging':
        return /merge|combine|join/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'in_place_sorting':
        return /in.place|swap|temp/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'extraction_sorting':
        return /extract|remove.*max|remove.*min/.test(code.toLowerCase()) ? 1.0 : 0.0;

      // Search patterns
      case 'backtracking':
        return /backtrack|undo|revert/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'stack_based':
        return /stack|push|pop/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'level_order_traversal':
        return /level|breadth|queue/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'queue_based':
        return /queue|enqueue|dequeue/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'iterative_traversal':
        return /while.*queue|for.*queue/.test(code.toLowerCase()) ? 1.0 : 0.0;

      // Dynamic Programming patterns
      case 'caching':
        return /cache|memo|store/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'recursive_optimization':
        return /memoize|optimize.*recursive/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'top_down_approach':
        return /top.down|recursive.*dp/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'iterative_approach':
        return /for.*dp|while.*dp|iterative.*dp/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'table_filling':
        return /table|array.*dp|dp.*array/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'bottom_up_approach':
        return /bottom.up|build.*up/.test(code.toLowerCase()) ? 1.0 : 0.0;

      // Design Pattern structures
      case 'single_instance':
        return /singleton|getinstance|static.*instance/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'static_access':
        return /static.*get|get.*static/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'private_constructor':
        return /private.*constructor|constructor.*private/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'notification_system':
        return /notify|subscribe|observer/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'loose_coupling':
        return /interface|abstract|implement/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'event_driven':
        return /event|listener|callback/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'object_creation':
        return /create|make|build|new/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'polymorphic_instantiation':
        return /interface.*create|abstract.*create/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'interface_based':
        return /interface|implements|extends/.test(code.toLowerCase()) ? 1.0 : 0.0;

      default:
        return 0.0;
    }
  }

  private detectComplexityIndicator(features: MLFeatures, indicator: string): number {
    switch (indicator) {
      // Original indicators
      case 'exponential_growth':
        return features.cyclomaticComplexity > 5 ? 1.0 : features.cyclomaticComplexity / 5;

      case 'log_n_time':
        return features.structuralComplexity < 3 ? 1.0 : 0.5;

      case 'quadratic_time':
        return features.structuralComplexity > 4 ? 1.0 : features.structuralComplexity / 4;

      case 'constant_space':
        return features.indentationLevel < 2 ? 1.0 : 0.5;

      case 'linear_access':
        return features.structuralComplexity > 2 && features.structuralComplexity < 5 ? 1.0 : 0.5;

      // New data structure indicators
      case 'constant_time_operations':
        return features.structuralComplexity < 2 ? 1.0 : 0.5;

      case 'linear_space':
        return features.structuralComplexity > 1 && features.structuralComplexity < 4 ? 1.0 : 0.5;

      case 'logarithmic_access':
        return features.structuralComplexity > 2 && features.structuralComplexity < 4 ? 1.0 : 0.5;

      case 'recursive_space':
        return features.cyclomaticComplexity > 3 ? 1.0 : features.cyclomaticComplexity / 3;

      case 'polynomial_time':
        return features.structuralComplexity > 3 ? 1.0 : features.structuralComplexity / 3;

      case 'logarithmic_operations':
        return features.structuralComplexity > 2 && features.structuralComplexity < 5 ? 1.0 : 0.5;

      // Sorting algorithm indicators
      case 'logarithmic_average':
        return features.structuralComplexity > 2 && features.structuralComplexity < 5 ? 1.0 : 0.5;

      case 'quadratic_worst':
        return features.structuralComplexity > 4 ? 1.0 : features.structuralComplexity / 4;

      case 'logarithmic_time':
        return features.structuralComplexity > 2 && features.structuralComplexity < 4 ? 1.0 : 0.5;

      // Search algorithm indicators
      case 'linear_time':
        return features.structuralComplexity > 1 && features.structuralComplexity < 4 ? 1.0 : 0.5;

      // Dynamic programming indicators
      case 'linear_notification':
        return features.structuralComplexity > 1 && features.structuralComplexity < 3 ? 1.0 : 0.5;

      // Design pattern indicators
      case 'constant_creation':
        return features.structuralComplexity < 2 ? 1.0 : 0.5;

      default:
        return 0.0;
    }
  }

  private generateReasoning(code: string, features: MLFeatures, signature: any): string[] {
    const reasoning: string[] = [];

    // Feature-based reasoning
    if (features.cyclomaticComplexity > 5) {
      reasoning.push(`High cyclomatic complexity (${features.cyclomaticComplexity}) suggests complex control flow`);
    }

    if (features.structuralComplexity > 3) {
      reasoning.push(`Multiple control structures detected (${features.structuralComplexity} complexity points)`);
    }

    // Keyword-based reasoning
    const detectedKeywords = signature.keywords.filter((keyword: string) => 
      code.toLowerCase().includes(keyword)
    );
    
    if (detectedKeywords.length > 0) {
      reasoning.push(`Pattern-specific keywords found: ${detectedKeywords.join(', ')}`);
    }

    // Structure-based reasoning
    if (code.includes('return') && /\w+\s*\([^)]*-\s*[12]\s*\)/.test(code)) {
      reasoning.push('Recursive pattern with decremental parameters detected');
    }

    if (features.tokenCount < 50) {
      reasoning.push('Concise implementation suggests well-known algorithm pattern');
    }

    return reasoning;
  }

  public getFeatureImportance(patternId: string): { [feature: string]: number } {
    // Simulated feature importance scores for different patterns
    const importanceMap: { [key: string]: { [feature: string]: number } } = {
      'fibonacci-recursive': {
        'recursive_calls': 0.35,
        'base_case': 0.25,
        'keyword_density': 0.20,
        'cyclomatic_complexity': 0.15,
        'token_count': 0.05
      },
      'binary-search': {
        'divide_conquer': 0.30,
        'logarithmic_structure': 0.25,
        'keyword_density': 0.20,
        'structural_complexity': 0.15,
        'indentation_level': 0.10
      },
      'bubble-sort': {
        'nested_loops': 0.40,
        'adjacent_comparison': 0.25,
        'swap_operations': 0.20,
        'quadratic_indicators': 0.15
      }
    };

    return importanceMap[patternId] || {};
  }
}

export const mlPatternEngine = new MLPatternEngine();