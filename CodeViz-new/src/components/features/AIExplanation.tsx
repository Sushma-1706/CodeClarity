import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Brain, 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle, 
  Code2,
  Sparkles,
  BookOpen,
  Target,
  Zap,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

import { AIAnalysisResult } from "@/lib/aiService";

interface AIExplanationProps {
  analysis: AIAnalysisResult | null;
  code: string;
  language: string;
  mode: string;
  isAnalyzing: boolean;
}

const getExplanationType = (explanation: string): 'concept' | 'execution' | 'warning' | 'tip' => {
  if (explanation.includes('Defining') || explanation.includes('class') || explanation.includes('method')) {
    return 'concept';
  }
  if (explanation.includes('Executing') || explanation.includes('Creating') || explanation.includes('Setting')) {
    return 'execution';
  }
  if (explanation.includes('Warning') || explanation.includes('Potential')) {
    return 'warning';
  }
  return 'tip';
};

const getExplanationIcon = (type: string) => {
  switch (type) {
    case 'concept': return <BookOpen className="h-4 w-4" />;
    case 'execution': return <Code2 className="h-4 w-4" />;
    case 'warning': return <AlertTriangle className="h-4 w-4" />;
    case 'tip': return <Lightbulb className="h-4 w-4" />;
    default: return <Info className="h-4 w-4" />;
  }
};

const getExplanationColor = (type: string): string => {
  const colors: Record<string, string> = {
    'concept': 'text-blue-600',
    'execution': 'text-green-600',
    'warning': 'text-orange-600',
    'tip': 'text-purple-600'
  };
  return colors[type] || 'text-gray-600';
};

const getExplanationBgColor = (type: string): string => {
  const colors: Record<string, string> = {
    'concept': 'bg-blue-50 border-blue-200',
    'execution': 'bg-green-50 border-green-200',
    'warning': 'bg-orange-50 border-orange-200',
    'tip': 'bg-purple-50 border-purple-200'
  };
  return colors[type] || 'bg-gray-50 border-gray-200';
};

const generateAISuggestions = (code: string, errors: string[], mode: string = "simplified") => {
  const suggestions = [];
  
  // Analyze code patterns and suggest improvements
  if (code.includes('while') && code.includes('next')) {
    if (mode === "simplified") {
      suggestions.push({
        type: 'optimization',
        title: 'Make It Simpler',
        description: 'You could add a helper node at the beginning to make the code easier to understand and avoid special cases.',
        impact: 'Medium',
        category: 'Data Structure'
      });
    } else {
      suggestions.push({
        type: 'optimization',
        title: 'Linked List Traversal',
        description: 'Consider using a sentinel node to simplify edge cases in linked list operations.',
        impact: 'Medium',
        category: 'Data Structure'
      });
    }
  }
  
  if (code.includes('if') && code.includes('None')) {
    if (mode === "simplified") {
      suggestions.push({
        type: 'safety',
        title: 'Safety Check',
        description: 'Great job checking for empty values! This prevents crashes and makes your code more reliable.',
        impact: 'High',
        category: 'Best Practice'
      });
    } else {
      suggestions.push({
        type: 'safety',
        title: 'Null Check',
        description: 'Good defensive programming! Always check for null/None before accessing object properties.',
        impact: 'High',
        category: 'Best Practice'
      });
    }
  }
  
  if (code.includes('print') && code.includes('end=')) {
    if (mode === "simplified") {
      suggestions.push({
        type: 'style',
        title: 'Nice Formatting',
        description: 'Good use of the end="" parameter to make the output look clean! This shows attention to detail.',
        impact: 'Low',
        category: 'Code Style'
      });
    } else {
      suggestions.push({
        type: 'style',
        title: 'Output Formatting',
        description: 'Using end="" parameter for clean output formatting. Consider using join() for arrays.',
        impact: 'Low',
        category: 'Code Style'
      });
    }
  }
  
  // Add suggestions based on errors
  errors.forEach(error => {
    if (error.includes('null pointer')) {
      if (mode === "simplified") {
        suggestions.push({
          type: 'critical',
          title: 'Prevent Crashes',
          description: 'Add safety checks to make sure you\'re not trying to access empty objects. This will make your program more stable.',
          impact: 'Critical',
          category: 'Error Prevention'
        });
      } else {
        suggestions.push({
          type: 'critical',
          title: 'Null Pointer Safety',
          description: 'Add null checks before dereferencing pointers to prevent runtime errors.',
          impact: 'Critical',
          category: 'Error Prevention'
        });
      }
    }
  });
  
  return suggestions;
};

const generateComplexityAnalysis = (code: string, mode: string = "simplified") => {
  const analysis = {
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    explanation: '',
    details: []
  };
  
  if (mode === "simplified") {
    analysis.explanation = 'This code takes about the same amount of time as the number of items it processes. It only needs a small amount of extra space to work.';
    analysis.details = [
      'Adding items: takes longer as we add more items',
      'Looking through items: visits each item once',
      'Space needed: stays the same no matter how many items'
    ];
  } else {
    analysis.explanation = 'Linear time complexity due to single traversal of the linked list. Constant space complexity as we only use a few variables.';
    analysis.details = [
      'Insertion: O(n) - needs to traverse to end',
      'Traversal: O(n) - visits each node once',
      'Space: O(1) - only uses constant extra space'
    ];
  }
  
  if (code.includes('nested') || code.includes('for') && code.includes('while')) {
    if (mode === "simplified") {
      analysis.timeComplexity = 'O(n²)';
      analysis.explanation = 'This code gets much slower as we add more items because it has to do extra work for each item.';
    } else {
      analysis.timeComplexity = 'O(n²)';
      analysis.explanation = 'Quadratic time complexity due to nested loops or nested traversals.';
    }
  }
  
  return analysis;
};

export const AIExplanation = ({ analysis, code, language, mode, isAnalyzing }: AIExplanationProps) => {
  if (isAnalyzing) {
    return (
      <Card className="glass">
        <CardContent className="p-6 text-center">
          <div className="space-y-3">
            <Brain className="h-12 w-12 text-muted-foreground mx-auto animate-spin" />
            <h3 className="text-lg font-medium">AI is Analyzing...</h3>
            <p className="text-sm text-muted-foreground">
              Please wait while AI analyzes your code
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card className="glass">
        <CardContent className="p-6 text-center">
          <div className="space-y-3">
            <Brain className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-medium">No AI Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Run AI analysis to get explanations and insights
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const suggestions = analysis.suggestions || [];
  const complexityAnalysis = analysis.complexity;
  
  // Generate mode-appropriate explanations
  const getModeAppropriateExplanation = (text: string) => {
    if (mode === "simplified") {
      return text.replace(/complexity/g, "how long it takes")
                .replace(/algorithm/g, "step-by-step process")
                .replace(/optimization/g, "making it faster")
                .replace(/efficient/g, "quick and smart");
    }
    return text;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="h-5 w-5 text-secondary" />
            AI-Powered Explanation
            <Badge variant="outline" className="ml-auto">
              {language.toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Intelligent analysis and explanations powered by AI
          </p>
        </CardContent>
      </Card>

      {/* Main Explanation */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="h-5 w-5 text-secondary" />
            <span>AI Explanation</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
                     <div className={cn("p-4 rounded-lg border", "bg-blue-50 border-blue-200")}>
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <p className="text-sm leading-relaxed">{getModeAppropriateExplanation(analysis.explanation)}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Target className="h-3 w-3" />
                  <span>AI Analysis</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Code Analysis */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Code2 className="h-5 w-5 text-accent" />
            Code Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Complexity Analysis */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Complexity Analysis</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-xs text-muted-foreground">Time Complexity</div>
                <div className="font-mono font-bold text-lg">{complexityAnalysis.timeComplexity}</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-xs text-muted-foreground">Space Complexity</div>
                <div className="font-mono font-bold text-lg">{complexityAnalysis.spaceComplexity}</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{complexityAnalysis.explanation}</p>
            
            {/* Complexity Details */}
            <div className="space-y-2">
              {complexityAnalysis.details.map((detail, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-secondary rounded-full" />
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <Card className="glass">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-warning" />
              AI Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="border border-border/20 rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-warning" />
                      <span className="font-medium">{suggestion.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={suggestion.impact === 'Critical' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {suggestion.impact}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {suggestion.category}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

             {/* Error Analysis */}
       {analysis.errors && analysis.errors.length > 0 && (
        <Card className="glass border-warning/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-warning">
              <AlertTriangle className="h-5 w-5" />
              Error Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
                             {analysis.errors.map((error, index) => (
                <div
                  key={index}
                  className="bg-warning/10 border border-warning/20 rounded-lg p-3"
                >
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                    <div className="space-y-2">
                      <span className="text-warning-foreground text-sm">{error}</span>
                      <div className="text-xs text-muted-foreground">
                        <strong>AI Recommendation:</strong> Add defensive checks and validate data before processing.
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Learning Resources */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-info" />
            Learning Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-info rounded-full" />
              <span>Linked List Data Structure</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-info rounded-full" />
              <span>Python Classes and Objects</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-info rounded-full" />
              <span>Time and Space Complexity</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-info rounded-full" />
              <span>Defensive Programming</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
