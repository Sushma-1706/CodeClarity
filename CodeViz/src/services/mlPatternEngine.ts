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
    // New Data Structure Patterns
    'queue': {
      keywords: ['queue', 'enqueue', 'dequeue', 'front', 'rear', 'fifo'],
      structures: ['fifo_operations', 'linear_structure', 'sequential_access'],
      complexity_indicators: ['constant_time_operations', 'linear_space']
    },
    'stack': {
      keywords: ['stack', 'push', 'pop', 'peek', 'top', 'lifo'],
      structures: ['lifo_operations', 'linear_structure', 'top_access'],
      complexity_indicators: ['constant_time_operations', 'linear_space']
    },
    'binary-tree': {
      keywords: ['treenode', 'tree', 'left', 'right', 'root', 'leaf'],
      structures: ['hierarchical_structure', 'recursive_traversal', 'two_children'],
      complexity_indicators: ['logarithmic_access', 'recursive_structure']
    },
    'graph': {
      keywords: ['graph', 'vertex', 'edge', 'adjacency', 'neighbor', 'vertices'],
      structures: ['non_linear_structure', 'edge_connections', 'traversal_operations'],
      complexity_indicators: ['polynomial_traversal', 'edge_density']
    },
    // New Sorting Algorithms
    'quick-sort': {
      keywords: ['quicksort', 'quick', 'pivot', 'partition', 'divide', 'conquer'],
      structures: ['divide_conquer', 'pivot_selection', 'partitioning'],
      complexity_indicators: ['log_n_average', 'quadratic_worst', 'in_place']
    },
    'merge-sort': {
      keywords: ['mergesort', 'merge', 'divide', 'conquer', 'stable', 'guaranteed'],
      structures: ['divide_conquer', 'merge_operation', 'recursive_division'],
      complexity_indicators: ['guaranteed_log_n', 'stable_sort', 'extra_space']
    },
    'heap-sort': {
      keywords: ['heapsort', 'heap', 'heapify', 'extractmax', 'max-heap', 'min-heap'],
      structures: ['heap_operations', 'extraction_loop', 'heap_property'],
      complexity_indicators: ['guaranteed_log_n', 'in_place', 'heap_based']
    },
    // Graph Traversal Algorithms
    'depth-first-search': {
      keywords: ['dfs', 'depth', 'first', 'backtrack', 'explore', 'recursive'],
      structures: ['recursive_traversal', 'backtracking', 'deep_exploration'],
      complexity_indicators: ['linear_traversal', 'stack_based', 'path_finding']
    },
    'breadth-first-search': {
      keywords: ['bfs', 'breadth', 'first', 'queue', 'level', 'shortest', 'path'],
      structures: ['queue_based', 'level_order', 'shortest_path'],
      complexity_indicators: ['linear_traversal', 'queue_based', 'shortest_path']
    },
    'binary-search-tree': {
      keywords: ['bst', 'binary', 'search', 'tree', 'insert', 'search', 'delete'],
      structures: ['tree_operations', 'search_optimization', 'ordered_structure'],
      complexity_indicators: ['log_n_operations', 'ordered_access', 'recursive_operations']
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

      // New structural patterns
      case 'fifo_operations':
        return /enqueue|dequeue/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'lifo_operations':
        return /push|pop/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'hierarchical_structure':
        return /left.*right|right.*left/.test(code.toLowerCase()) && 
               /treenode|tree/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'non_linear_structure':
        return /vertex|edge|adjacency/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'pivot_selection':
        return /pivot|partition/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'merge_operation':
        return /merge|divide/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'heap_operations':
        return /heapify|extractmax|heap/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'recursive_traversal':
        return /dfs|depth.*first/.test(code.toLowerCase()) && 
               /recursive|backtrack/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'queue_based':
        return /bfs|breadth.*first/.test(code.toLowerCase()) && 
               /queue|level/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'tree_operations':
        return /insert|search|delete/.test(code.toLowerCase()) && 
               /bst|binary.*search.*tree/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'backtracking':
        return /backtrack|explore/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'level_order':
        return /level|queue/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'search_optimization':
        return /binary.*search|bst/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'two_children':
        return /left.*right/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'edge_connections':
        return /edge|adjacency|neighbor/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'partitioning':
        return /partition|pivot/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'recursive_division':
        return /divide.*conquer|recursive/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'extraction_loop':
        return /extract|heapify/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'deep_exploration':
        return /depth.*first|dfs/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'shortest_path':
        return /shortest.*path|bfs/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'ordered_structure':
        return /inorder|preorder|postorder/.test(code.toLowerCase()) ? 1.0 : 0.0;

      default:
        return 0.0;
    }
  }

  private detectComplexityIndicator(features: MLFeatures, indicator: string): number {
    switch (indicator) {
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

      // New complexity indicators
      case 'constant_time_operations':
        return features.structuralComplexity < 3 ? 1.0 : 0.5;

      case 'linear_space':
        return features.structuralComplexity > 1 && features.structuralComplexity < 4 ? 1.0 : 0.5;

      case 'logarithmic_access':
        return features.structuralComplexity > 2 && features.structuralComplexity < 5 ? 1.0 : 0.5;

      case 'recursive_structure':
        return features.cyclomaticComplexity > 3 ? 1.0 : features.cyclomaticComplexity / 3;

      case 'polynomial_traversal':
        return features.structuralComplexity > 3 ? 1.0 : features.structuralComplexity / 3;

      case 'edge_density':
        return features.tokenCount > 50 ? 1.0 : features.tokenCount / 50;

      case 'log_n_average':
        return features.structuralComplexity > 2 && features.structuralComplexity < 5 ? 1.0 : 0.5;

      case 'quadratic_worst':
        return features.structuralComplexity > 4 ? 1.0 : features.structuralComplexity / 4;

      case 'in_place':
        return features.indentationLevel < 3 ? 1.0 : 0.5;

      case 'guaranteed_log_n':
        return features.structuralComplexity > 2 && features.structuralComplexity < 5 ? 1.0 : 0.5;

      case 'stable_sort':
        return features.structuralComplexity > 3 ? 1.0 : 0.5;

      case 'extra_space':
        return features.indentationLevel > 2 ? 1.0 : 0.5;

      case 'heap_based':
        return features.structuralComplexity > 3 ? 1.0 : 0.5;

      case 'linear_traversal':
        return features.structuralComplexity > 2 && features.structuralComplexity < 5 ? 1.0 : 0.5;

      case 'stack_based':
        return features.cyclomaticComplexity > 2 ? 1.0 : features.cyclomaticComplexity / 2;

      case 'path_finding':
        return features.structuralComplexity > 3 ? 1.0 : 0.5;

      case 'queue_based':
        return features.structuralComplexity > 2 ? 1.0 : 0.5;

      case 'shortest_path':
        return features.structuralComplexity > 3 ? 1.0 : 0.5;

      case 'log_n_operations':
        return features.structuralComplexity > 2 && features.structuralComplexity < 5 ? 1.0 : 0.5;

      case 'ordered_access':
        return features.structuralComplexity > 2 ? 1.0 : 0.5;

      case 'recursive_operations':
        return features.cyclomaticComplexity > 2 ? 1.0 : features.cyclomaticComplexity / 2;

      case 'dynamic_size':
        return features.structuralComplexity > 1 ? 1.0 : 0.5;

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