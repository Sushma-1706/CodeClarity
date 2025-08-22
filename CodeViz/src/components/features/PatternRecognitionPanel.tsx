import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain,
  Zap,
  Target,
  TrendingUp,
  Lightbulb,
  Code2,
  GitBranch,
  Layers,
  Eye,
  BookOpen,
  Sparkles,
  ChevronRight,
  Clock,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { patternRecognitionEngine, CodePattern, PatternAnalysisResult } from "@/services/patternRecognition";
import { PatternVisualization } from "./PatternVisualization";

interface PatternRecognitionPanelProps {
  code: string;
  language: string;
}

export const PatternRecognitionPanel = ({ code, language }: PatternRecognitionPanelProps) => {
  const [analysis, setAnalysis] = useState<PatternAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState<CodePattern | null>(null);

  useEffect(() => {
    if (code.trim()) {
      analyzeCode();
    }
  }, [code, language]);

  const analyzeCode = async () => {
    setIsAnalyzing(true);
    // Simulate ML processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const result = patternRecognitionEngine.analyzeCode(code, language);
    setAnalysis(result);
    setSelectedPattern(result.mainPattern);
    setIsAnalyzing(false);
  };

  const getPatternTypeIcon = (type: string) => {
    switch (type) {
      case 'algorithm': return <Zap className="h-4 w-4" />;
      case 'data-structure': return <Layers className="h-4 w-4" />;
      case 'design-pattern': return <GitBranch className="h-4 w-4" />;
      case 'anti-pattern': return <Target className="h-4 w-4" />;
      default: return <Code2 className="h-4 w-4" />;
    }
  };

  const getPatternTypeColor = (type: string) => {
    switch (type) {
      case 'algorithm': return 'bg-blue-500';
      case 'data-structure': return 'bg-green-500';
      case 'design-pattern': return 'bg-purple-500';
      case 'anti-pattern': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (isAnalyzing) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <Brain className="h-12 w-12 text-secondary animate-pulse" />
          </div>
          <h3 className="text-xl font-semibold">AI Pattern Recognition in Progress</h3>
          <p className="text-muted-foreground">Analyzing code patterns and structures...</p>
          <Progress value={75} className="w-full max-w-md mx-auto" />
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="text-center space-y-4">
        <Brain className="h-12 w-12 text-muted-foreground mx-auto" />
        <h3 className="text-xl font-semibold">No Code to Analyze</h3>
        <p className="text-muted-foreground">Enter some code to see AI-powered pattern recognition</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-7 w-7 text-secondary" />
            <span className="text-gradient">Pattern Recognition</span>
          </h2>
          <p className="text-muted-foreground">AI-powered code pattern analysis</p>
        </div>
        <Button onClick={analyzeCode} variant="secondary" className="gap-2">
          <Brain className="h-4 w-4" />
          Re-analyze
        </Button>
      </div>

      {/* Main Pattern Card */}
      {analysis.mainPattern && (
        <Card className="glass border-secondary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className={cn("w-3 h-3 rounded-full", getPatternTypeColor(analysis.mainPattern.type))} />
              Primary Pattern Detected
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-xl font-semibold">{analysis.mainPattern.name}</h3>
                <p className="text-sm text-muted-foreground">{analysis.mainPattern.description}</p>
              </div>
              <div className="text-right space-y-1">
                <div className="text-2xl font-bold text-secondary">
                  {Math.round(analysis.mainPattern.confidence * 100)}%
                </div>
                <div className="text-xs text-muted-foreground">Confidence</div>
              </div>
            </div>
            
            <Progress value={analysis.mainPattern.confidence * 100} className="h-2" />
            
            <div className="flex flex-wrap gap-2">
              {analysis.mainPattern.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs for detailed analysis */}
      <Tabs defaultValue="patterns" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="patterns" className="gap-2">
            <Eye className="h-4 w-4" />
            Patterns
          </TabsTrigger>
          <TabsTrigger value="explanation" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Explanation
          </TabsTrigger>
          <TabsTrigger value="structure" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Structure
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="gap-2">
            <Lightbulb className="h-4 w-4" />
            Suggestions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="patterns" className="space-y-4">
          <div className="grid gap-4">
            {analysis.patterns.map((pattern) => (
              <Card 
                key={pattern.id} 
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-md",
                  selectedPattern?.id === pattern.id ? "ring-2 ring-secondary" : ""
                )}
                onClick={() => setSelectedPattern(pattern)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getPatternTypeIcon(pattern.type)}
                      <div>
                        <h4 className="font-medium">{pattern.name}</h4>
                        <p className="text-sm text-muted-foreground">{pattern.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-semibold">{Math.round(pattern.confidence * 100)}%</div>
                        <Progress value={pattern.confidence * 100} className="w-16 h-1" />
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="explanation" className="space-y-4">
          {selectedPattern ? (
            <div className="space-y-4">
              <Card className="glass">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-accent" />
                    Simplified Explanation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{selectedPattern.explanation.simplified}</p>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Brain className="h-5 w-5 text-secondary" />
                    Technical Explanation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{selectedPattern.explanation.technical}</p>
                </CardContent>
              </Card>

              <PatternVisualization 
                patternId={selectedPattern.id}
                patternName={selectedPattern.name}
                className="mb-4"
              />

              <Card className="glass">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5 text-warning" />
                    Complexity Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Time Complexity</div>
                      <div className="text-lg font-bold text-destructive">{selectedPattern.complexity.time}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Space Complexity</div>
                      <div className="text-lg font-bold text-warning">{selectedPattern.complexity.space}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Select a pattern to see detailed explanation</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="structure" className="space-y-4">
          <Card className="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-accent" />
                Code Structure Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-secondary">{analysis.codeStructure.functions}</div>
                  <div className="text-sm text-muted-foreground">Functions</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-accent">{analysis.codeStructure.loops}</div>
                  <div className="text-sm text-muted-foreground">Loops</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-warning">{analysis.codeStructure.conditionals}</div>
                  <div className="text-sm text-muted-foreground">Conditionals</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-success">
                    {analysis.codeStructure.recursion ? 'Yes' : 'No'}
                  </div>
                  <div className="text-sm text-muted-foreground">Recursion</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-4">
          <div className="space-y-3">
            {analysis.suggestions.map((suggestion, index) => (
              <Card key={index} className="glass">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-success mt-0.5" />
                    <p className="text-sm leading-relaxed">{suggestion}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* ML Insights Integration */}
          <Card className="glass border-accent/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="h-5 w-5 text-accent" />
                Advanced ML Analysis Available
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Get deeper insights with our machine learning pattern recognition engine.
              </p>
              <Button 
                variant="accent" 
                className="gap-2"
                onClick={() => window.dispatchEvent(new CustomEvent('switchToMLInsights'))}
              >
                <Sparkles className="h-4 w-4" />
                View ML Insights
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};