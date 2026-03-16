import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain,
  Zap, 
  Lightbulb, 
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Clock,
  HardDrive,
  Code2,
  RefreshCw,
  Download,
  Share2,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { aiService, AIAnalysisResult } from "@/lib/aiService";

interface AnalysisPanelProps {
  code?: string;
  language?: string;
  mode?: "simplified" | "technical";
}

export const AnalysisPanel = ({ 
  code = "", 
  language = "python", 
  mode = "simplified" 
}: AnalysisPanelProps) => {
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [analysisHistory, setAnalysisHistory] = useState<Array<{
    timestamp: Date;
    code: string;
    language: string;
    mode: string;
  }>>([]);

  // Auto-analyze when code changes
  useEffect(() => {
    if (code.trim()) {
      analyzeCode();
      addToHistory();
    }
  }, [code, language, mode]);

  const analyzeCode = async () => {
    if (!code.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const result = await aiService.analyzeCode(code, language, mode);
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addToHistory = () => {
    const newEntry = {
      timestamp: new Date(),
      code: code.substring(0, 100) + (code.length > 100 ? '...' : ''),
      language,
      mode
    };
    
    setAnalysisHistory(prev => [newEntry, ...prev.slice(0, 9)]); // Keep last 10
  };

  const exportAnalysis = () => {
    if (!analysis) return;
    
    const data = {
      code,
      language,
      mode,
      analysis,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code-analysis-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareAnalysis = async () => {
    if (!analysis) return;
    
    try {
      const shareData = {
        title: 'Code Analysis Results',
        text: `AI analysis of ${language} code in ${mode} mode`,
        url: window.location.href
      };
      
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        // You could add a toast notification here
      }
    } catch (error) {
      console.error('Sharing failed:', error);
    }
  };

  const getComplexityColor = (complexity: string) => {
    if (complexity.includes('O(1)')) return 'text-green-600';
    if (complexity.includes('O(n)')) return 'text-blue-600';
    if (complexity.includes('O(n²)')) return 'text-orange-600';
    if (complexity.includes('O(2^n)')) return 'text-red-600';
    return 'text-gray-600';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold">AI Code Analysis</h2>
          <Badge variant="outline">{language.toUpperCase()}</Badge>
          <Badge variant="secondary">{mode}</Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={analyzeCode}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
          
          <Button 
            variant="outline"
            size="sm" 
            onClick={exportAnalysis}
            disabled={!analysis}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button 
            variant="outline"
            size="sm" 
            onClick={shareAnalysis}
            disabled={!analysis}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Analysis Status */}
      {isAnalyzing && (
        <Card className="glass border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-sm text-blue-700">
                AI is analyzing your code... This may take a few moments.
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Analysis Content */}
      {analysis ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="complexity" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Complexity
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Suggestions
            </TabsTrigger>
            <TabsTrigger value="flowchart" className="flex items-center gap-2">
              <Code2 className="h-4 w-4" />
              Flowchart
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* AI Explanation */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    AI Explanation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {analysis.explanation}
                  </p>
                </CardContent>
              </Card>

              {/* Quick Stats */}
      <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-600" />
                    Quick Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className={cn("text-2xl font-bold", getComplexityColor(analysis.complexity.time))}>
                        {analysis.complexity.time}
                      </div>
                      <div className="text-xs text-muted-foreground">Time</div>
                    </div>
                    <div className="text-center">
                      <div className={cn("text-2xl font-bold", getComplexityColor(analysis.complexity.space))}>
                        {analysis.complexity.space}
                      </div>
                      <div className="text-xs text-muted-foreground">Space</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Code Quality</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="complexity" className="space-y-4">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Detailed Complexity Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Time Complexity */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <h4 className="font-medium">Time Complexity</h4>
                    <Badge variant="outline" className={getComplexityColor(analysis.complexity.time)}>
                      {analysis.complexity.time}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {analysis.complexity.explanation}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {analysis.complexity.details.map((detail, index) => (
                      <div key={index} className="text-xs bg-muted p-2 rounded">
                        {detail}
                      </div>
                    ))}
                  </div>
          </div>

                {/* Space Complexity */}
                <div className="space-y-3">
                                  <div className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5 text-green-600" />
                  <h4 className="font-medium">Space Complexity</h4>
                  <Badge variant="outline" className={getComplexityColor(analysis.complexity.space)}>
                    {analysis.complexity.space}
                  </Badge>
                </div>
              <p className="text-sm text-muted-foreground">
                    Memory usage analysis and optimization opportunities
              </p>
            </div>

                {/* Complexity Chart */}
                <div className="space-y-3">
                  <h4 className="font-medium">Complexity Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Algorithm Efficiency</span>
                      <span className="text-green-600 font-medium">Good</span>
              </div>
                    <Progress value={75} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-4">
      <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  AI-Powered Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
                {analysis.suggestions.length > 0 ? (
                  <div className="space-y-4">
                    {analysis.suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="border border-border/20 rounded-lg p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-yellow-600" />
                            <span className="font-medium">{suggestion.title}</span>
                          </div>
                          <Badge className={getImpactColor(suggestion.impact)}>
                            {suggestion.impact}
                          </Badge>
              </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {suggestion.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {suggestion.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {suggestion.type}
                          </Badge>
                        </div>
                        {suggestion.code && (
                          <code className="block mt-2 p-2 bg-muted rounded text-xs font-mono">
                            {suggestion.code}
                          </code>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
                    <p>Great job! No suggestions at this time.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="flowchart" className="space-y-4">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code2 className="h-5 w-5" />
                  Code Flowchart
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-sm font-mono text-muted-foreground">
                    {analysis.visualization.flowchart}
              </div>
            </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Data Structures</h4>
                    {analysis.visualization.dataStructures.map((ds, index) => (
                      <div key={index} className="text-xs bg-muted p-2 rounded">
                        <strong>{ds.type}:</strong> {ds.data.name}
                      </div>
                    ))}
              </div>
                  
              <div className="space-y-2">
                    <h4 className="font-medium text-sm">Execution Steps</h4>
                    <div className="text-xs text-muted-foreground">
                      {analysis.visualization.executionSteps.length} steps identified
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
      <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Analysis History
          </CardTitle>
        </CardHeader>
              <CardContent>
                {analysisHistory.length > 0 ? (
                  <div className="space-y-3">
                    {analysisHistory.map((entry, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="space-y-1">
                          <div className="text-sm font-medium">
                            {entry.language.toUpperCase()} - {entry.mode}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {entry.code}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {entry.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No analysis history yet</p>
                </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card className="glass">
          <CardContent className="flex items-center justify-center p-12 text-muted-foreground">
            <div className="text-center">
              <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Enter some code to get AI-powered analysis</p>
            </div>
        </CardContent>
      </Card>
      )}
    </div>
  );
};