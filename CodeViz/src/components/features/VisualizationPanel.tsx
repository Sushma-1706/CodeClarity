import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  Download,
  Maximize,
  Settings,
  Zap,
  GitBranch,
  Layers,
  Activity,
  Cpu,
  Timer
} from "lucide-react";
import { cn } from "@/lib/utils";
import { visualizationEngine } from "@/services/visualizationEngine";
import { patternRecognitionEngine } from "@/services/patternRecognition";
import { mlPatternEngine } from "@/services/mlPatternEngine";

const visualizationTypes = [
  { id: "flowchart", name: "Flowchart", icon: GitBranch, description: "Control flow visualization" },
  { id: "execution", name: "Execution", icon: Activity, description: "Step-by-step execution" },
  { id: "data-structure", name: "Data Structure", icon: Layers, description: "3D data visualization" },
  { id: "complexity", name: "Complexity", icon: Timer, description: "Time & space analysis" },
];

interface VisualizationPanelProps {
  code?: string;
  language?: string;
}

export const VisualizationPanel = ({ code = "", language = "javascript" }: VisualizationPanelProps) => {
  const [selectedType, setSelectedType] = useState("flowchart");
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(1);
  const [maxSteps, setMaxSteps] = useState(8);
  const [visualizationData, setVisualizationData] = useState<any>(null);
  const [detectedPatterns, setDetectedPatterns] = useState<any[]>([]);
  const [complexityAnalysis, setComplexityAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Analyze code when it changes
  useEffect(() => {
    if (code.trim()) {
      analyzeCode();
    } else {
      // Clear data when no code
      setDetectedPatterns([]);
      setComplexityAnalysis(null);
      setVisualizationData(null);
    }
  }, [code, language]);

  // Update visualization when type changes or analysis completes
  useEffect(() => {
    if (code.trim()) {
      generateVisualization();
    }
  }, [selectedType, code, detectedPatterns, complexityAnalysis]);

  const analyzeCode = async () => {
    setIsAnalyzing(true);
    try {
      // Detect patterns
      const patternAnalysis = patternRecognitionEngine.analyzeCode(code, language);
      setDetectedPatterns(patternAnalysis.patterns);
      console.log("Detected patterns:", patternAnalysis.patterns);

      // Get ML features
      const mlFeatures = mlPatternEngine.extractFeatures(code, language);
      
      // Calculate complexity
      const complexity = {
        time: calculateTimeComplexity(code, mlFeatures),
        space: calculateSpaceComplexity(code, mlFeatures),
        cyclomatic: mlFeatures.cyclomaticComplexity,
        structural: mlFeatures.structuralComplexity
      };
      setComplexityAnalysis(complexity);
      console.log("Complexity analysis:", complexity);
    } catch (error) {
      console.error("Error analyzing code:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const calculateTimeComplexity = (code: string, features: any): string => {
    // Simple heuristic-based complexity calculation
    if (features.cyclomaticComplexity > 8) return "O(2^n)";
    if (features.cyclomaticComplexity > 5) return "O(n²)";
    if (features.cyclomaticComplexity > 3) return "O(n log n)";
    if (features.cyclomaticComplexity > 1) return "O(n)";
    return "O(1)";
  };

  const calculateSpaceComplexity = (code: string, features: any): string => {
    // Simple heuristic-based space complexity
    if (code.includes('fibonacci') && code.includes('return') && code.includes('(n-1)')) {
      return "O(n)"; // Recursive call stack
    }
    if (features.structuralComplexity > 5) return "O(n)";
    return "O(1)";
  };

  const generateVisualization = () => {
    if (!code.trim()) {
      setVisualizationData(null);
      setMaxSteps(0);
      setStep(1);
      return;
    }

    try {
      let data = null;
      let steps = 0;

      switch (selectedType) {
        case "flowchart":
          data = generateFlowchartVisualization();
          steps = data?.data?.nodes?.length || 0;
          break;
        case "execution":
          data = generateExecutionVisualization();
          steps = data?.data?.steps?.length || 0;
          break;
        case "data-structure":
          data = generateDataStructureVisualization();
          steps = data?.data?.nodes?.length || 0;
          break;
        case "complexity":
          data = generateComplexityVisualization();
          steps = 1;
          break;
        default:
          console.warn("Unknown visualization type:", selectedType);
          data = null;
          steps = 0;
      }

      if (data) {
        setVisualizationData(data);
        setMaxSteps(Math.max(steps, 1));
        setStep(1);
        console.log("Generated " + selectedType + " visualization:", data);
      } else {
        console.warn("No data generated for visualization type:", selectedType);
        setVisualizationData(null);
        setMaxSteps(0);
        setStep(1);
      }
    } catch (error) {
      console.error("Error generating visualization:", error);
      setVisualizationData(null);
      setMaxSteps(0);
      setStep(1);
    }
  };

  const generateFlowchartVisualization = () => {
    // Use detected patterns to generate appropriate flowchart
    if (detectedPatterns.length > 0) {
      const mainPattern = detectedPatterns[0];
      const patternViz = visualizationEngine.generatePatternVisualization(mainPattern.id);
      
      // Convert pattern visualization to flowchart format if needed
      if (patternViz.type === 'flowchart') {
        return patternViz;
      } else if (patternViz.type === 'tree') {
        // Convert tree to flowchart for better visualization
        return {
          type: 'flowchart',
          data: {
            nodes: [
              { id: 'start', label: 'Start', type: 'function' },
              { id: 'base_case', label: 'Base Case Check', type: 'condition' },
              { id: 'return_base', label: 'Return Base Value', type: 'return' },
              { id: 'recursive_calls', label: 'Recursive Calls', type: 'variable' },
              { id: 'combine', label: 'Combine Results', type: 'variable' },
              { id: 'end', label: 'End', type: 'return' }
            ],
            connections: [
              { from: 'start', to: 'base_case' },
              { from: 'base_case', to: 'return_base', label: 'Yes' },
              { from: 'base_case', to: 'recursive_calls', label: 'No' },
              { from: 'recursive_calls', to: 'combine' },
              { from: 'combine', to: 'end' },
              { from: 'return_base', to: 'end' }
            ]
          }
        };
      }
    }

    // Fallback to generic flowchart based on code structure
    return {
      type: 'flowchart',
      data: {
        nodes: [
          { id: 'start', label: 'Start', type: 'function' },
          { id: 'process', label: 'Process Code', type: 'variable' },
          { id: 'end', label: 'End', type: 'return' }
        ],
        connections: [
          { from: 'start', to: 'process' },
          { from: 'process', to: 'end' }
        ]
      }
    };
  };

  const generateExecutionVisualization = () => {
    const lines = code.split('\n').filter(line => line.trim());
    const steps = lines.map((line, index) => ({
      id: `step-${index}`,
      line: line.trim(),
      lineNumber: index + 1,
      type: getLineType(line)
    }));

    return {
      type: 'execution',
      data: { steps }
    };
  };

  const getLineType = (line: string): string => {
    if (line.includes('function') || line.includes('def')) return 'function';
    if (line.includes('if') || line.includes('while') || line.includes('for')) return 'condition';
    if (line.includes('return')) return 'return';
    if (line.includes('=') || line.includes('let') || line.includes('const')) return 'variable';
    return 'statement';
  };

  const generateDataStructureVisualization = () => {
    // Generate data structure visualization based on detected patterns
    if (detectedPatterns.some(p => p.id === 'linked-list')) {
      return {
        type: 'graph',
        data: visualizationEngine.generateLinkedListVisualization()
      };
    }

    // Check for array patterns in code
    if (code.includes('[') && code.includes(']')) {
      return {
        type: 'array',
        data: {
          nodes: Array.from({ length: 5 }, (_, i) => ({
            id: `item-${i}`,
            value: `Item ${i + 1}`,
            index: i
          }))
        }
      };
    }

    // Default array visualization
    return {
      type: 'array',
      data: {
        nodes: Array.from({ length: 5 }, (_, i) => ({
          id: `item-${i}`,
          value: `Item ${i + 1}`,
          index: i
        }))
      }
    };
  };

  const generateComplexityVisualization = () => {
    // Ensure we have valid complexity analysis data
    const safeComplexity = complexityAnalysis || {
      time: 'O(1)',
      space: 'O(1)',
      cyclomatic: 1,
      structural: 1
    };

    return {
      type: 'complexity',
      data: {
        time: safeComplexity.time,
        space: safeComplexity.space,
        cyclomatic: safeComplexity.cyclomatic,
        structural: safeComplexity.structural,
        features: {
          lines: code.split('\n').length,
          functions: (code.match(/function\s+\w+|def\s+\w+/g) || []).length,
          loops: (code.match(/for\s*\(|while\s*\(/g) || []).length,
          conditionals: (code.match(/if\s*\(/g) || []).length
        }
      }
    };
  };

  const renderVisualizationContent = () => {
    if (isAnalyzing) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mb-4"></div>
          <p className="text-muted-foreground text-lg">Analyzing code...</p>
          <p className="text-muted-foreground text-sm">Please wait while we process your code</p>
        </div>
      );
    }

    if (!visualizationData) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <Eye className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-lg">No visualization available</p>
          <p className="text-muted-foreground text-sm">Enter some code to see visualizations</p>
        </div>
      );
    }

    switch (selectedType) {
      case "flowchart":
        return renderFlowchartContent();
      case "execution":
        return renderExecutionContent();
      case "data-structure":
        return renderDataStructureContent();
      case "complexity":
        return renderComplexityContent();
      default:
        return <div>Unknown visualization type</div>;
    }
  };

  const renderFlowchartContent = () => {
    if (!visualizationData?.data?.nodes) {
      return <div className="text-center text-muted-foreground">No flowchart data available</div>;
    }

    return (
      <div className="space-y-4">
        {visualizationData.data.nodes.map((node: any, index: number) => {
          const isActive = step > index;
          const getNodeColor = (type: string) => {
            switch (type) {
              case 'function': return 'border-secondary bg-secondary/10';
              case 'condition': return 'border-warning bg-warning/10';
              case 'loop': return 'border-accent bg-accent/10';
              case 'return': return 'border-success bg-success/10';
              case 'variable': return 'border-muted bg-muted/10';
              default: return 'border-border bg-background';
            }
          };

          return (
            <div
              key={node.id}
              className={cn(
                "p-4 rounded-lg border-2 transition-all duration-500",
                getNodeColor(node.type),
                isActive && "ring-2 ring-primary scale-105"
              )}
            >
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-xs">
                  {node.type}
                </Badge>
                <span className="font-medium">{node.label}</span>
              </div>
              {node.metadata?.description && (
                <p className="text-sm text-muted-foreground mt-2">
                  {node.metadata.description}
                </p>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderExecutionContent = () => {
    if (!visualizationData?.data?.steps) {
      return <div className="text-center text-muted-foreground">No execution data available</div>;
    }

    return (
      <div className="space-y-3">
        {visualizationData.data.steps.map((stepData: any, index: number) => {
          const isActive = step > index;
          const getLineColor = (type: string) => {
            switch (type) {
              case 'function': return 'border-blue-500 bg-blue-50';
              case 'condition': return 'border-yellow-500 bg-yellow-50';
              case 'return': return 'border-green-500 bg-green-50';
              case 'variable': return 'border-purple-500 bg-purple-50';
              default: return 'border-gray-500 bg-gray-50';
            }
          };

          return (
            <div
              key={stepData.id}
              className={cn(
                "p-3 rounded-lg border-2 transition-all duration-500",
                getLineColor(stepData.type),
                isActive && "ring-2 ring-primary scale-105"
              )}
            >
              <div className="flex items-center gap-3">
                <Badge variant={isActive ? "default" : "outline"}>
                  {stepData.lineNumber}
                </Badge>
                <code className="font-mono text-sm">{stepData.line}</code>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDataStructureContent = () => {
    if (!visualizationData?.data?.nodes) {
      return <div className="text-center text-muted-foreground">No data structure data available</div>;
    }

    if (visualizationData.type === 'graph') {
      // Linked list visualization
      return (
        <div className="flex items-center gap-4">
          {visualizationData.data.nodes.map((node: any, index: number) => (
            <div key={node.id} className="flex items-center">
              <div className="px-4 py-2 bg-secondary/10 border border-secondary rounded-lg">
                <div className="text-sm font-medium">{node.label}</div>
                <div className="text-xs text-muted-foreground">{node.data}</div>
              </div>
              {node.next && (
                <div className="flex items-center mx-2">
                  <div className="w-8 h-px bg-border" />
                  <div className="w-2 h-2 bg-border rotate-45 transform translate-x-1" />
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    // Array visualization
    return (
      <div className="grid grid-cols-5 gap-2">
        {visualizationData.data.nodes.map((node: any, index: number) => (
          <div
            key={node.id}
            className={cn(
              "p-3 rounded-lg border-2 text-center transition-all duration-500",
              step > index ? "border-primary bg-primary/10" : "border-border bg-muted/20"
            )}
          >
            <div className="text-sm font-medium">{node.value}</div>
            <div className="text-xs text-muted-foreground">[{node.index}]</div>
          </div>
        ))}
      </div>
    );
  };

  const renderComplexityContent = () => {
    if (!visualizationData?.data) {
      return <div className="text-center text-muted-foreground">No complexity data available</div>;
    }

    const { time, space, cyclomatic, structural, features } = visualizationData.data;
    
    // Debug logging
    console.log("Rendering complexity content:", { time, space, cyclomatic, structural, features });

    // Fallback values if data is missing
    const safeTime = time || 'O(1)';
    const safeSpace = space || 'O(1)';
    const safeCyclomatic = cyclomatic || 1;
    const safeStructural = structural || 1;
    const safeFeatures = features || {
      lines: code.split('\n').length,
      functions: 0,
      loops: 0,
      conditionals: 0
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Complexity Metrics */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Complexity Analysis</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded-lg border">
              <span className="font-medium">Time Complexity</span>
              <Badge variant="secondary">{safeTime}</Badge>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg border">
              <span className="font-medium">Space Complexity</span>
              <Badge variant="secondary">{safeSpace}</Badge>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg border">
              <span className="font-medium">Cyclomatic Complexity</span>
              <Badge variant="outline">{safeCyclomatic}</Badge>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg border">
              <span className="font-medium">Structural Complexity</span>
              <Badge variant="outline">{safeStructural}</Badge>
            </div>
          </div>
        </div>

        {/* Code Features */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Code Features</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded-lg border">
              <span className="font-medium">Lines of Code</span>
              <Badge variant="outline">{safeFeatures.lines}</Badge>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg border">
              <span className="font-medium">Functions</span>
              <Badge variant="outline">{safeFeatures.functions}</Badge>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg border">
              <span className="font-medium">Loops</span>
              <Badge variant="outline">{safeFeatures.loops}</Badge>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg border">
              <span className="font-medium">Conditionals</span>
              <Badge variant="outline">{safeFeatures.conditionals}</Badge>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gradient-secondary">Interactive Visualization</h2>
          <p className="text-muted-foreground">Watch your code come to life</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Maximize className="h-4 w-4" />
            Fullscreen
          </Button>
        </div>
      </div>

      {/* Visualization Type Selection */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Eye className="h-5 w-5 text-accent" />
            Visualization Mode
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {visualizationTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={cn(
                    "p-4 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-md",
                    selectedType === type.id
                      ? "border-accent bg-accent/10 shadow-accent"
                      : "border-border hover:border-border/60"
                  )}
                >
                  <div className="space-y-2">
                    <Icon className={cn(
                      "h-6 w-6",
                      selectedType === type.id ? "text-accent" : "text-muted-foreground"
                    )} />
                    <div>
                      <div className="font-medium text-sm">{type.name}</div>
                      <div className="text-xs text-muted-foreground">{type.description}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Visualization Area */}
      <Card className="glass">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg">
              {selectedType === 'flowchart' && 'Control Flow Diagram'}
              {selectedType === 'execution' && 'Code Execution Trace'}
              {selectedType === 'data-structure' && 'Data Structure Visualization'}
              {selectedType === 'complexity' && 'Complexity Analysis'}
            </CardTitle>
            {complexityAnalysis && (
              <Badge variant="secondary" className="gap-1">
                <Cpu className="h-3 w-3" />
                {complexityAnalysis.time} Time
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="icon-sm">
            <Settings className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {/* Visualization Canvas */}
          <div className="relative bg-gradient-to-br from-surface-muted to-background border border-border/20 rounded-lg p-8 min-h-[400px]">
            {renderVisualizationContent()}
            
            {/* Floating Animation Elements */}
            <div className="absolute top-4 right-4">
              <Zap className="h-6 w-6 text-accent animate-float" />
            </div>
            <div className="absolute bottom-4 left-4">
              <Activity className="h-5 w-5 text-secondary animate-pulse-glow" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Animation Controls */}
      <Card className="glass">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Playback Controls */}
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon-sm"
                onClick={() => setStep(Math.max(1, step - 1))}
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              
              <Button
                variant={isPlaying ? "destructive" : "secondary"}
                size="icon"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              <Button 
                variant="outline" 
                size="icon-sm"
                onClick={() => setStep(Math.min(maxSteps, step + 1))}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            {/* Progress Indicator */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Step</span>
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div 
                    className="bg-gradient-secondary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(step / maxSteps) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{step}/{maxSteps}</span>
              </div>
            </div>

            {/* Speed Control */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Speed:</span>
              <Button variant="outline" size="sm">1x</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};