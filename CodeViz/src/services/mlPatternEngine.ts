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