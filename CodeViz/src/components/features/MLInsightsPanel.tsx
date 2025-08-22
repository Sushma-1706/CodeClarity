import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain,
  BarChart3,
  Zap,
  Target,
  TrendingUp,
  Activity,
  Cpu,
  Database,
  RefreshCw,
  Lightbulb
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mlPatternEngine, MLFeatures, MLPrediction } from "@/services/mlPatternEngine";

interface MLInsightsPanelProps {
  code: string;
  language: string;
}

export const MLInsightsPanel = ({ code, language }: MLInsightsPanelProps) => {
  const [features, setFeatures] = useState<MLFeatures | null>(null);
  const [predictions, setPredictions] = useState<MLPrediction[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState<MLPrediction | null>(null);

  useEffect(() => {
    if (code.trim()) {
      analyzeWithML();
    }
  }, [code, language]);

  const analyzeWithML = async () => {
    setIsAnalyzing(true);
    
    // Simulate ML processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const extractedFeatures = mlPatternEngine.extractFeatures(code, language);
    const mlPredictions = mlPatternEngine.predictPattern(code, language);
    
    setFeatures(extractedFeatures);
    setPredictions(mlPredictions);
    setSelectedPrediction(mlPredictions[0] || null);
    setIsAnalyzing(false);
  };

  const getComplexityColor = (value: number, type: 'low' | 'medium' | 'high') => {
    if (type === 'low') return value < 2 ? 'text-success' : value < 5 ? 'text-warning' : 'text-destructive';
    if (type === 'medium') return value < 5 ? 'text-success' : value < 10 ? 'text-warning' : 'text-destructive';
    return value < 10 ? 'text-success' : value < 20 ? 'text-warning' : 'text-destructive';
  };

  if (isAnalyzing) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <Cpu className="h-12 w-12 text-secondary animate-spin" />
          </div>
          <h3 className="text-xl font-semibold">ML Analysis in Progress</h3>
          <p className="text-muted-foreground">Running advanced pattern recognition algorithms...</p>
          <Progress value={65} className="w-full max-w-md mx-auto" />
        </div>
      </div>
    );
  }

  if (!features || predictions.length === 0) {
    return (
      <div className="text-center space-y-4">
        <Brain className="h-12 w-12 text-muted-foreground mx-auto" />
        <h3 className="text-xl font-semibold">No ML Analysis Available</h3>
        <p className="text-muted-foreground">Enter code to see machine learning insights</p>
        <Button onClick={analyzeWithML} variant="secondary" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Run ML Analysis
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-7 w-7 text-secondary" />
            <span className="text-gradient">ML Insights</span>
          </h2>
          <p className="text-muted-foreground">Advanced machine learning pattern analysis</p>
        </div>
        <Button onClick={analyzeWithML} variant="secondary" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Re-analyze
        </Button>
      </div>

      {/* Top Prediction */}
      {selectedPrediction && (
        <Card className="glass border-secondary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5 text-accent" />
              Top ML Prediction
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-xl font-semibold capitalize">
                  {selectedPrediction.patternId.replace('-', ' ')}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Machine learning confidence score
                </p>
              </div>
              <div className="text-right space-y-1">
                <div className="text-3xl font-bold text-secondary">
                  {Math.round(selectedPrediction.confidence * 100)}%
                </div>
                <div className="text-xs text-muted-foreground">ML Confidence</div>
              </div>
            </div>
            
            <Progress value={selectedPrediction.confidence * 100} className="h-3" />
            
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-accent" />
                ML Reasoning
              </h4>
              <div className="space-y-1">
                {selectedPrediction.reasoning.map((reason, index) => (
                  <div key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <div className="w-1 h-1 bg-accent rounded-full mt-2 flex-shrink-0" />
                    {reason}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="predictions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="predictions" className="gap-2">
            <Target className="h-4 w-4" />
            Predictions
          </TabsTrigger>
          <TabsTrigger value="features" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Features
          </TabsTrigger>
          <TabsTrigger value="complexity" className="gap-2">
            <Activity className="h-4 w-4" />
            Complexity
          </TabsTrigger>
          <TabsTrigger value="insights" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="space-y-4">
          <div className="grid gap-4">
            {predictions.map((prediction, index) => (
              <Card 
                key={prediction.patternId}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-md",
                  selectedPrediction?.patternId === prediction.patternId ? "ring-2 ring-secondary" : ""
                )}
                onClick={() => setSelectedPrediction(prediction)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">#{index + 1}</Badge>
                      <div>
                        <h4 className="font-medium capitalize">
                          {prediction.patternId.replace('-', ' ')}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          ML Pattern Recognition
                        </p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="font-semibold text-lg">
                        {Math.round(prediction.confidence * 100)}%
                      </div>
                      <Progress value={prediction.confidence * 100} className="w-20 h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="glass">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Database className="h-5 w-5 text-accent" />
                  Code Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Token Count</span>
                    <span className="font-semibold">{features.tokenCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Avg Line Length</span>
                    <span className="font-semibold">{features.avgLineLength.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Indentation Level</span>
                    <span className="font-semibold">{features.indentationLevel.toFixed(1)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-warning" />
                  Keyword Density
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(features.keywordDensity)
                  .filter(([_, density]) => density > 0)
                  .sort(([_, a], [__, b]) => b - a)
                  .slice(0, 5)
                  .map(([keyword, density]) => (
                    <div key={keyword} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{keyword}</span>
                        <span className="text-sm text-muted-foreground">
                          {(density * 100).toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={density * 100} className="h-1" />
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="complexity" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="glass">
              <CardContent className="p-6 text-center">
                <div className="space-y-2">
                  <Cpu className="h-8 w-8 mx-auto text-secondary" />
                  <div className="text-sm font-medium">Structural Complexity</div>
                  <div className={cn(
                    "text-3xl font-bold",
                    getComplexityColor(features.structuralComplexity, 'medium')
                  )}>
                    {features.structuralComplexity.toFixed(1)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Control structures and nesting
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardContent className="p-6 text-center">
                <div className="space-y-2">
                  <Activity className="h-8 w-8 mx-auto text-warning" />
                  <div className="text-sm font-medium">Cyclomatic Complexity</div>
                  <div className={cn(
                    "text-3xl font-bold",
                    getComplexityColor(features.cyclomaticComplexity, 'low')
                  )}>
                    {features.cyclomaticComplexity}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Decision points and branches
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="space-y-4">
            <Card className="glass">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-success" />
                  ML-Powered Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {features.cyclomaticComplexity <= 3 && (
                  <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                    <p className="text-sm text-success">
                      ✓ Low cyclomatic complexity indicates maintainable code
                    </p>
                  </div>
                )}
                
                {features.structuralComplexity > 5 && (
                  <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                    <p className="text-sm text-warning">
                      ⚠ High structural complexity may indicate need for refactoring
                    </p>
                  </div>
                )}
                
                {features.tokenCount < 100 && (
                  <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
                    <p className="text-sm text-accent">
                      💡 Concise implementation suggests efficient algorithm choice
                    </p>
                  </div>
                )}
                
                {Object.values(features.keywordDensity).some(d => d > 0.1) && (
                  <div className="p-3 bg-secondary/10 border border-secondary/20 rounded-lg">
                    <p className="text-sm text-secondary">
                      🎯 High keyword density indicates pattern-specific implementation
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};