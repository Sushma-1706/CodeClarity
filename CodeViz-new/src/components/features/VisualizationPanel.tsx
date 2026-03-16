import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Eye, 
  BarChart3, 
  Network, 
  GitBranch,
  Code2,
  TrendingUp,
  Activity,
  Layers,
  RefreshCw,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VisualizationPanelProps {
  code?: string;
  language?: string;
  mode?: "simplified" | "technical";
}

export const VisualizationPanel = ({ 
  code = "", 
  language = "python", 
  mode = "simplified" 
}: VisualizationPanelProps) => {
  const [activeVisualization, setActiveVisualization] = useState("flowchart");
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1000);
  const [currentStep, setCurrentStep] = useState(0);
  const [visualizationData, setVisualizationData] = useState<any>(null);

  // Generate visualization data based on code
  useEffect(() => {
    if (code.trim()) {
      generateVisualizationData();
    }
  }, [code, language, mode]);

  const generateVisualizationData = () => {
    const lines = code.split('\n');
    const data = {
      flowchart: generateFlowchart(),
      structure: generateStructureDiagram(),
      complexity: generateComplexityChart(),
      execution: generateExecutionFlow()
    };
    setVisualizationData(data);
  };

  const generateFlowchart = () => {
    const lines = code.split('\n');
    const nodes = [];
    const edges = [];

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;

      if (trimmed.includes('def ') || trimmed.includes('function ')) {
        nodes.push({
          id: `node-${index}`,
          type: 'function',
          label: 'Function Definition',
          line: index + 1,
          color: 'bg-blue-500'
        });
      } else if (trimmed.includes('class ')) {
        nodes.push({
          id: `node-${index}`,
          type: 'class',
          label: 'Class Definition',
          line: index + 1,
          color: 'bg-purple-500'
        });
      } else if (trimmed.includes('if ') || trimmed.includes('while ') || trimmed.includes('for ')) {
        nodes.push({
          id: `node-${index}`,
          type: 'control',
          label: 'Control Flow',
          line: index + 1,
          color: 'bg-orange-500'
        });
      } else if (trimmed.includes('print(') || trimmed.includes('console.log(')) {
        nodes.push({
          id: `node-${index}`,
          type: 'output',
          label: 'Output',
          line: index + 1,
          color: 'bg-green-500'
        });
      } else if (trimmed.includes('=')) {
        nodes.push({
          id: `node-${index}`,
          type: 'assignment',
          label: 'Variable Assignment',
          line: index + 1,
          color: 'bg-gray-500'
        });
      }

      // Add edges between consecutive nodes
      if (nodes.length > 1) {
        edges.push({
          from: nodes[nodes.length - 2].id,
          to: nodes[nodes.length - 1].id,
          label: 'Next'
        });
      }
    });

    return { nodes, edges };
  };

  const generateStructureDiagram = () => {
    const structure = {
      functions: (code.match(/def |function |void /g) || []).length,
      classes: (code.match(/class /g) || []).length,
      variables: (code.match(/=/g) || []).length,
      loops: (code.match(/for |while /g) || []).length,
      conditionals: (code.match(/if |elif /g) || []).length
    };

    return structure;
  };

  const generateComplexityChart = () => {
    let timeComplexity = "O(1)";
    let spaceComplexity = "O(1)";
    let cyclomaticComplexity = 1;

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

    // Calculate cyclomatic complexity
    const lines = code.split('\n');
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.includes('if ') || trimmed.includes('elif ') || 
          trimmed.includes('while ') || trimmed.includes('for ') ||
          trimmed.includes('&&') || trimmed.includes('||')) {
        cyclomaticComplexity++;
      }
    });

    return { timeComplexity, spaceComplexity, cyclomaticComplexity };
  };

  const generateExecutionFlow = () => {
    const lines = code.split('\n');
    const steps = [];
    let variables: Record<string, any> = {};

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;

      if (trimmed.includes('=')) {
        const varName = trimmed.split('=')[0].trim();
        const value = trimmed.split('=')[1].trim().replace(/['"]/g, '');
        variables[varName] = value;
      }

      if (trimmed.includes('print(') || trimmed.includes('console.log(')) {
        steps.push({
          step: steps.length + 1,
          line: index + 1,
          action: 'Output',
          variables: { ...variables },
          output: trimmed.includes('"Hello') ? 'Hello, World!' : 'Hello, Developer!'
        });
      }
    });

    return steps;
  };

  const startAnimation = () => {
    setIsAnimating(true);
    setCurrentStep(0);
    
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= (visualizationData?.execution?.length || 0) - 1) {
          setIsAnimating(false);
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, animationSpeed);
  };

  const stopAnimation = () => {
    setIsAnimating(false);
    setCurrentStep(0);
  };

  const resetAnimation = () => {
    setCurrentStep(0);
    setIsAnimating(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Eye className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Code Visualization</h2>
          <Badge variant="outline">{language.toUpperCase()}</Badge>
          <Badge variant="secondary">{mode}</Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={generateVisualizationData}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Visualization Tabs */}
      <Tabs value={activeVisualization} onValueChange={setActiveVisualization} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="flowchart" className="flex items-center gap-2">
            <GitBranch className="h-4 w-4" />
            Flowchart
          </TabsTrigger>
          <TabsTrigger value="structure" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Structure
          </TabsTrigger>
          <TabsTrigger value="complexity" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Complexity
          </TabsTrigger>
          <TabsTrigger value="execution" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Execution
          </TabsTrigger>
        </TabsList>

        <TabsContent value="flowchart" className="space-y-4">
      <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Code Flowchart
          </CardTitle>
        </CardHeader>
        <CardContent>
              {visualizationData?.flowchart ? (
                <div className="space-y-4">
                  {/* Flowchart Visualization */}
                  <div className="flex flex-wrap gap-4 justify-center">
                    {visualizationData.flowchart.nodes.map((node: any, index: number) => (
                      <div
                        key={node.id}
                  className={cn(
                          "relative p-4 rounded-lg text-white text-center min-w-[120px] transition-all duration-300",
                          node.color,
                          currentStep === index && isAnimating && "ring-4 ring-yellow-400 scale-110"
                        )}
                      >
                        <div className="text-xs font-medium">{node.label}</div>
                        <div className="text-xs opacity-80">Line {node.line}</div>
                      </div>
                    ))}
                  </div>

                  {/* Flow Arrows */}
                  <div className="flex justify-center">
                    <div className="flex items-center gap-2">
                      {visualizationData.flowchart.edges.map((edge: any, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-8 h-0.5 bg-gray-300"></div>
                          <div className="text-xs text-muted-foreground">→</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No flowchart data available
          </div>
              )}
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="structure" className="space-y-4">
      <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Code Structure Analysis
              </CardTitle>
        </CardHeader>
        <CardContent>
              {visualizationData?.structure ? (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {visualizationData.structure.functions}
                    </div>
                    <div className="text-sm text-muted-foreground">Functions</div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {visualizationData.structure.classes}
                    </div>
                    <div className="text-sm text-muted-foreground">Classes</div>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {visualizationData.structure.variables}
                    </div>
                    <div className="text-sm text-muted-foreground">Variables</div>
              </div>
              
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {visualizationData.structure.loops}
                    </div>
                    <div className="text-sm text-muted-foreground">Loops</div>
              </div>
              
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {visualizationData.structure.conditionals}
                    </div>
                    <div className="text-sm text-muted-foreground">Conditions</div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No structure data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="complexity" className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Complexity Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {visualizationData?.complexity ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {visualizationData.complexity.timeComplexity}
                      </div>
                      <div className="text-sm text-muted-foreground">Time Complexity</div>
              </div>
              
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {visualizationData.complexity.spaceComplexity}
                      </div>
                      <div className="text-sm text-muted-foreground">Space Complexity</div>
                </div>
                    
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {visualizationData.complexity.cyclomaticComplexity}
                </div>
                      <div className="text-sm text-muted-foreground">Cyclomatic Complexity</div>
              </div>
            </div>
            
                  {/* Complexity Bar Chart */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Complexity Breakdown</div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs">Simple</span>
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, 100 - (visualizationData.complexity.cyclomaticComplexity - 1) * 20)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs">Complex</span>
                      </div>
            </div>
            </div>
          </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No complexity data available
                </div>
              )}
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="execution" className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Execution Flow
              </CardTitle>
            </CardHeader>
            <CardContent>
              {visualizationData?.execution ? (
                <div className="space-y-4">
      {/* Animation Controls */}
                  <div className="flex items-center gap-2 justify-center">
              <Button 
                      onClick={isAnimating ? stopAnimation : startAnimation}
                      disabled={visualizationData.execution.length === 0}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isAnimating ? (
                        <Pause className="h-4 w-4 mr-2" />
                      ) : (
                        <Play className="h-4 w-4 mr-2" />
                      )}
                      {isAnimating ? "Pause" : "Start"} Animation
              </Button>
              
              <Button
                      onClick={resetAnimation}
                variant="outline" 
              >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
              </Button>
            </div>

                  {/* Execution Steps */}
                  <div className="space-y-3">
                    {visualizationData.execution.map((step: any, index: number) => (
                      <div
                        key={index}
                        className={cn(
                          "p-3 rounded-lg border transition-all duration-300",
                          currentStep === index && isAnimating
                            ? "border-blue-500 bg-blue-50 scale-105"
                            : "border-border hover:border-border/60"
                        )}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">Step {step.step}</Badge>
                          <span className="text-xs text-muted-foreground">
                            Line {step.line}
                          </span>
            </div>

                        <div className="text-sm font-medium">{step.action}</div>
                        
                        {Object.keys(step.variables).length > 0 && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Variables: {Object.entries(step.variables).map(([k, v]) => `${k}=${v}`).join(', ')}
                          </div>
                        )}
                        
                        {step.output && (
                          <div className="text-xs bg-green-50 p-2 rounded mt-2 font-mono">
                            Output: {step.output}
                          </div>
                        )}
                      </div>
                    ))}
            </div>
          </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No execution data available
                </div>
              )}
        </CardContent>
      </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};