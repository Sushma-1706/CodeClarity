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

class HeuristicAnalysisEngine {
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
    'palindrome-check': {
      keywords: ['palindrome', 'original', 'rev', 'reverse'],
      structures: ['reverse_rebuild', 'mirror_compare', 'digit_extraction'],
      complexity_indicators: ['linear_access', 'constant_space']
    },
    'singleton': {
      keywords: ['singleton', 'getinstance', 'static', 'instance'],
      structures: ['single_instance_guard', 'class_based_access'],
      complexity_indicators: ['constant_space']
    },
    'dynamic-programming': {
      keywords: ['dp', 'memo', 'cache', 'tabulation'],
      structures: ['dp_table', 'overlapping_subproblems', 'state_transition'],
      complexity_indicators: ['linear_access']
    },
    'graph-traversal': {
      keywords: ['graph', 'visited', 'queue', 'stack', 'neighbor'],
      structures: ['frontier_traversal', 'visited_set'],
      complexity_indicators: ['linear_access']
    }
  };

  public extractFeatures(code: string, language: string): MLFeatures {
    if (!code.trim()) {
      return {
        tokenCount: 0,
        avgLineLength: 0,
        indentationLevel: 0,
        keywordDensity: {},
        structuralComplexity: 0,
        cyclomaticComplexity: 1,
      };
    }

    const lines = code.split('\n').filter(line => line.trim());
    const tokens = code.split(/\s+/).filter(token => token.length > 0);
    
    // Calculate basic metrics
    const tokenCount = Math.max(tokens.length, 1);
    const avgLineLength = lines.length > 0
      ? lines.reduce((sum, line) => sum + line.length, 0) / lines.length
      : 0;
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
    if (!code.trim()) return [];

    const features = this.extractFeatures(code, language);
    const predictions: MLPrediction[] = [];

    // Analyze each pattern signature
    Object.entries(this.PATTERN_SIGNATURES).forEach(([patternId, signature]) => {
      const confidence = this.calculatePatternConfidence(code, features, signature);
      const reasoning = this.generateReasoning(code, features, signature);

      if (confidence > 0.2) { // Threshold for ML prediction
        predictions.push({
          patternId,
          confidence: Math.min(1, Math.max(0, Number(confidence.toFixed(2)))),
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
    const tokenCount = Math.max(features.tokenCount, 1);

    // Keyword matching with weighted scoring
    signature.keywords.forEach((keyword: string) => {
      const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`\\b${escaped}\\b`, "gi");
      const matches = codeNormalized.match(regex) || [];
      if (matches.length > 0) {
        confidence += 0.15; // Base keyword match
        
        // Bonus for keyword density
        const density = matches.length / tokenCount;
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

      case 'pointer_traversal':
        return /(current|node)\s*=\s*(current|node)\.(next|nextNode)|->next/.test(code) ? 1.0 : 0.0;

      case 'reverse_rebuild':
        return /(rev|reverse)\s*=\s*(rev|reverse)\s*\*\s*10\s*\+/.test(code) ? 1.0 : 0.0;

      case 'mirror_compare':
        return /(original|input|str)\s*==\s*(rev|reverse|reversed)|\bpalindrome\b/i.test(code) ? 1.0 : 0.0;

      case 'digit_extraction':
        return /%\s*10/.test(code) && /\/\s*10/.test(code) ? 1.0 : 0.0;

      case 'single_instance_guard':
        return /getinstance|singleton\.instance|if\s*\(\s*!?\w*instance/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'class_based_access':
        return /class\s+\w+/.test(code) && /static\s+\w+/.test(code) ? 1.0 : 0.0;

      case 'dp_table':
        return /\bdp\b\s*=|\bdp\s*\[/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'overlapping_subproblems':
        return /memo|cache|dp/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'state_transition':
        return /dp\s*\[\s*\w+\s*\]\s*\[\s*\w+\s*\]\s*=/.test(code) ? 1.0 : 0.0;

      case 'frontier_traversal':
        return /(queue|stack)\.(push|pop|shift)|while\s*\(\s*(queue|stack)\./.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'visited_set':
        return /visited/.test(code.toLowerCase()) ? 1.0 : 0.0;

      case 'dynamic_allocation':
      case 'sequential_access':
        return 0.6;

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

    const matchedStructures = signature.structures.filter((structure: string) =>
      this.detectStructuralPattern(code, structure) >= 0.8
    );
    if (matchedStructures.length > 0) {
      reasoning.push(`Detected structural markers: ${matchedStructures.slice(0, 3).join(', ')}`);
    }

    if (features.tokenCount < 50) {
      reasoning.push('Concise implementation suggests well-known algorithm pattern');
    }

    if (reasoning.length === 0) {
      reasoning.push('Prediction is based on control-flow and keyword distribution signals.');
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
      },
      'palindrome-check': {
        'reverse_rebuild': 0.35,
        'mirror_compare': 0.30,
        'digit_extraction': 0.20,
        'constant_space': 0.15
      },
      'singleton': {
        'single_instance_guard': 0.40,
        'class_based_access': 0.25,
        'static_instance': 0.20,
        'constructor_control': 0.15
      }
    };

    return importanceMap[patternId] || {};
  }
}

export const heuristicAnalysisEngine = new HeuristicAnalysisEngine();