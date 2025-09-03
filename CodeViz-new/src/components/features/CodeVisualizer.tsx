import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  Pause, 
  StepForward, 
  RotateCcw, 
  Eye,
  Brain,
  Code2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Variable,
  Function,
  Database,
  Lightbulb,
  Zap,
  Loader2,
  RefreshCw,
  TrendingUp,
  Clock,
  HardDrive
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CodeEditor } from "./CodeEditor";
import { DataStructureVisualizer } from "./DataStructureVisualizer";
import { VariableTracker } from "./VariableTracker";
import { ExecutionFlow } from "./ExecutionFlow";
import { AIExplanation } from "./AIExplanation";
import { aiService, AIAnalysisResult, CodeExecutionStep } from "@/lib/aiService";

interface CodeVisualizerProps {
  code?: string;
  language?: string;
  mode?: "simplified" | "technical";
  onCodeChange?: (code: string, language: string) => void;
}

export const CodeVisualizer = ({ 
  code: externalCode, 
  language: externalLanguage, 
  mode: externalMode,
  onCodeChange 
}: CodeVisualizerProps) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [executionSteps, setExecutionSteps] = useState<CodeExecutionStep[]>([]);
  const [executionSpeed, setExecutionSpeed] = useState(1000);
  const [selectedLanguage, setSelectedLanguage] = useState(externalLanguage ?? "python");
  const [selectedMode, setSelectedMode] = useState<"simplified" | "technical">(externalMode ?? "simplified");
  const [code, setCode] = useState(externalCode ?? `# Python Hello World Program
def greet(name="World"):
    print(f"Hello, {name}!")

# Call the function
greet()
greet("Developer")`);

  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [complexityMetrics, setComplexityMetrics] = useState({
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    cyclomaticComplexity: 1,
    maintainabilityIndex: 100
  });

  const executionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sync with external props
  useEffect(() => {
    if (externalCode !== undefined) {
      setCode(externalCode);
    }
    if (externalLanguage !== undefined) {
      setSelectedLanguage(externalLanguage);
    }
    if (externalMode !== undefined) {
      setSelectedMode(externalMode);
    }
  }, [externalCode, externalLanguage, externalMode]);

  // Auto-analyze code when it changes or mode changes
  useEffect(() => {
    if (code.trim()) {
      analyzeCode();
      updateComplexityMetrics();
    }
  }, [code, selectedMode]);

  const updateComplexityMetrics = () => {
    // Calculate cyclomatic complexity
    let complexity = 1; // Base complexity
    const lines = code.split('\n');
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine.includes('if ') || trimmedLine.includes('elif ') || 
          trimmedLine.includes('while ') || trimmedLine.includes('for ') ||
          trimmedLine.includes('&&') || trimmedLine.includes('||')) {
        complexity++;
      }
    });

    // Estimate time and space complexity based on code structure
    let timeComplexity = "O(1)";
    let spaceComplexity = "O(1)";
    
    if (code.includes('for ') && code.includes('range(')) {
      timeComplexity = "O(n)";
      spaceComplexity = "O(1)";
    }
    if (code.includes('while ') && code.includes('n')) {
      timeComplexity = "O(log n)";
      spaceComplexity = "O(1)";
    }
    if (code.includes('recursion') || code.includes('fibonacci')) {
      timeComplexity = "O(2^n)";
      spaceComplexity = "O(n)";
    }

    setComplexityMetrics({
      timeComplexity,
      spaceComplexity,
      cyclomaticComplexity: complexity,
      maintainabilityIndex: Math.max(0, 100 - (complexity * 10))
    });
  };

  const analyzeCode = async () => {
    if (!code.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const analysis = await aiService.analyzeCode(code, selectedLanguage, selectedMode);
      setAiAnalysis(analysis);
      
      // Generate execution steps
      const steps = await aiService.executeCodeStepByStep(code, selectedLanguage, selectedMode);
      setExecutionSteps(steps);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startExecution = () => {
    if (executionSteps.length === 0) return;
    
    setIsExecuting(true);
    setIsPaused(false);
    setCurrentStep(0);
    
    executionIntervalRef.current = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= executionSteps.length - 1) {
          stopExecution();
          return prev;
        }
        return prev + 1;
      });
    }, executionSpeed);
  };

  const pauseExecution = () => {
    if (executionIntervalRef.current) {
      clearInterval(executionIntervalRef.current);
    }
    setIsPaused(true);
  };

  const resumeExecution = () => {
    setIsPaused(false);
    executionIntervalRef.current = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= executionSteps.length - 1) {
          stopExecution();
          return prev;
        }
        return prev + 1;
      });
    }, executionSpeed);
  };

  const stopExecution = () => {
    if (executionIntervalRef.current) {
      clearInterval(executionIntervalRef.current);
    }
    setIsExecuting(false);
    setIsPaused(false);
    setCurrentStep(0);
  };

  const stepForward = () => {
    if (currentStep < executionSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const stepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const resetExecution = () => {
    stopExecution();
    setCurrentStep(0);
  };

  const handleCodeChange = (newCode: string, newLanguage: string) => {
    setCode(newCode);
    setSelectedLanguage(newLanguage);
    if (onCodeChange) {
      onCodeChange(newCode, newLanguage);
    }
  };

  const currentExecutionStep = executionSteps[currentStep] || null;

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Play className="h-6 w-6 text-green-600" />
            <h2 className="text-2xl font-bold">Code Visualizer</h2>
          </div>
          <Badge variant="outline" className="text-xs">
            {selectedLanguage.toUpperCase()}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {selectedMode === 'simplified' ? 'Simplified' : 'Technical'} Mode
            </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={analyzeCode}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh Analysis
          </Button>
        </div>
      </div>

      {/* Complexity Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium">Time Complexity</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {complexityMetrics.timeComplexity}
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <HardDrive className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-sm font-medium">Space Complexity</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {complexityMetrics.spaceComplexity}
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-5 w-5 text-orange-600 mr-2" />
              <span className="text-sm font-medium">Cyclomatic</span>
              </div>
            <div className="text-2xl font-bold text-orange-600">
              {complexityMetrics.cyclomaticComplexity}
              </div>
          </CardContent>
        </Card>
        
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="h-5 w-5 text-purple-600 mr-2" />
              <span className="text-sm font-medium">Maintainability</span>
              </div>
            <div className="text-2xl font-bold text-purple-600">
              {complexityMetrics.maintainabilityIndex}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="editor" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="editor" className="flex items-center gap-2">
            <Code2 className="h-4 w-4" />
            Editor
          </TabsTrigger>
          <TabsTrigger value="execution" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            Execution
          </TabsTrigger>
          <TabsTrigger value="variables" className="flex items-center gap-2">
            <Variable className="h-4 w-4" />
            Variables
          </TabsTrigger>
          <TabsTrigger value="structures" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Structures
          </TabsTrigger>
          <TabsTrigger value="explanation" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Explanation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-4">
          <CodeEditor
            code={code}
            setCode={setCode}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            selectedMode={selectedMode}
            setSelectedMode={setSelectedMode}
            onCodeChange={handleCodeChange}
            onAnalyze={analyzeCode}
            onRun={startExecution}
            onVisualize={() => {}}
          />
        </TabsContent>

        <TabsContent value="execution" className="space-y-4">
      <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Code Execution Flow
          </CardTitle>
        </CardHeader>
            <CardContent className="space-y-4">
              {/* Execution Controls */}
              <div className="flex items-center gap-2 flex-wrap">
            <Button
                  onClick={isExecuting ? (isPaused ? resumeExecution : pauseExecution) : startExecution}
              disabled={executionSteps.length === 0}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isExecuting ? (isPaused ? <Play className="h-4 w-4 mr-2" /> : <Pause className="h-4 w-4 mr-2" />) : <Play className="h-4 w-4 mr-2" />}
                  {isExecuting ? (isPaused ? "Resume" : "Pause") : "Start"}
                </Button>
                
                <Button
                  onClick={stopExecution}
                  disabled={!isExecuting}
                  variant="outline"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Stop
            </Button>
            
            <Button
              onClick={stepBackward}
                  disabled={currentStep === 0}
              variant="outline"
            >
                  <StepForward className="h-4 w-4 mr-2 rotate-180" />
              Previous
            </Button>
            
            <Button
              onClick={stepForward}
                  disabled={currentStep >= executionSteps.length - 1}
              variant="outline"
            >
                  <StepForward className="h-4 w-4 mr-2" />
              Next
            </Button>
            
            <Button
              onClick={resetExecution}
              variant="outline"
            >
                  <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
          
          {/* Execution Progress */}
          {executionSteps.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                <span>Step {currentStep + 1} of {executionSteps.length}</span>
                <span>{Math.round(((currentStep + 1) / executionSteps.length) * 100)}%</span>
              </div>
                  <Progress value={((currentStep + 1) / executionSteps.length) * 100} />
            </div>
          )}

              {/* Current Step Display */}
              {currentExecutionStep && (
                <Card className="border-primary/20">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Step {currentExecutionStep.step}</Badge>
                        <span className="text-sm text-muted-foreground">
                          Line {currentExecutionStep.lineNumber}
                        </span>
        </div>

                      <div className="bg-muted p-3 rounded-lg">
                        <code className="text-sm">{currentExecutionStep.code}</code>
                      </div>
                      
                      <div className="text-sm">
                        <strong>Explanation:</strong> {currentExecutionStep.explanation}
                    </div>
                      
                      {currentExecutionStep.output.length > 0 && (
                        <div className="text-sm">
                          <strong>Output:</strong>
                          <div className="bg-green-50 p-2 rounded mt-1 font-mono text-xs">
                            {currentExecutionStep.output.join('\n')}
                        </div>
                      </div>
                      )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

              {/* Execution Steps List */}
              <ExecutionFlow
                steps={executionSteps}
                currentStep={currentStep}
                onStepClick={setCurrentStep}
              />
                  </CardContent>
                </Card>
            </TabsContent>

        <TabsContent value="variables" className="space-y-4">
          <VariableTracker
            variables={currentExecutionStep?.variables || {}}
            stepNumber={currentStep}
                totalSteps={executionSteps.length}
              />
            </TabsContent>

        <TabsContent value="structures" className="space-y-4">
          <DataStructureVisualizer
            dataStructures={currentExecutionStep?.dataStructures || []}
            stepNumber={currentStep}
            totalSteps={executionSteps.length}
              />
            </TabsContent>

        <TabsContent value="explanation" className="space-y-4">
          <AIExplanation
            analysis={aiAnalysis}
            code={code}
            language={selectedLanguage}
            mode={selectedMode}
            isAnalyzing={isAnalyzing}
              />
            </TabsContent>
          </Tabs>
    </div>
  );
};
