import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Eye,
  GitBranch,
  BarChart3,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";
import { visualizationEngine } from "@/services/visualizationEngine";

interface PatternVisualizationProps {
  patternId: string;
  patternName: string;
  className?: string;
}

export const PatternVisualization = ({ 
  patternId, 
  patternName, 
  className 
}: PatternVisualizationProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  const visualization = visualizationEngine.generatePatternVisualization(patternId);

  const renderTreeVisualization = (data: any) => {
    const TreeNode = ({ node, level = 0 }: { node: any; level?: number }) => (
      <div className="flex flex-col items-center">
        <div 
          className={cn(
            "px-3 py-2 rounded-lg border-2 bg-background text-sm font-medium transition-all duration-300",
            node.metadata?.isBase 
              ? "border-success bg-success/10 text-success" 
              : "border-secondary bg-secondary/10 text-secondary"
          )}
        >
          {node.name}
          {node.value !== undefined && (
            <div className="text-xs text-muted-foreground mt-1">
              = {node.value}
            </div>
          )}
        </div>
        
        {node.children && node.children.length > 0 && (
          <div className="mt-4">
            <div className="flex justify-center mb-2">
              <div className="w-px h-4 bg-border" />
            </div>
            <div className="flex gap-8">
              {node.children.map((child: any, index: number) => (
                <div key={index} className="relative">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div className="w-px h-4 bg-border" />
                  </div>
                  <TreeNode node={child} level={level + 1} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );

    return (
      <div className="p-6 overflow-auto">
        <TreeNode node={data} />
      </div>
    );
  };

  const renderFlowchartVisualization = (data: any) => {
    return (
      <div className="p-6 space-y-4">
        <div className="grid gap-4">
          {data.nodes.map((node: any, index: number) => {
            const isActive = currentStep === index;
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
                  "p-4 rounded-lg border-2 transition-all duration-300",
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
      </div>
    );
  };

  const renderGraphVisualization = (data: any) => {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          {data.nodes.map((node: any, index: number) => (
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
        
        <div className="space-y-2">
          <h4 className="font-medium">Operations:</h4>
          {data.operations.map((op: string, index: number) => (
            <div key={index} className="text-sm text-muted-foreground">
              • {op}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderVisualization = () => {
    if (!visualization) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No visualization available</p>
        </div>
      );
    }

    switch (visualization.type) {
      case 'tree':
        return renderTreeVisualization(visualization.data);
      case 'flowchart':
        return renderFlowchartVisualization(visualization.data);
      case 'graph':
        return renderGraphVisualization(visualization.data);
      default:
        return (
          <div className="text-center py-8">
            <p className="text-muted-foreground">{visualization.data.message}</p>
          </div>
        );
    }
  };

  const handlePlayPause = () => {
    setIsAnimating(!isAnimating);
    if (!isAnimating && visualization?.data?.nodes) {
      // Start animation
      const interval = setInterval(() => {
        setCurrentStep(prev => {
          const next = prev + 1;
          if (next >= visualization.data.nodes.length) {
            setIsAnimating(false);
            clearInterval(interval);
            return 0;
          }
          return next;
        });
      }, 1000);
    }
  };

  return (
    <Card className={cn("glass", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Eye className="h-5 w-5 text-accent" />
            {patternName} Visualization
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePlayPause}
              className="gap-2"
            >
              {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isAnimating ? 'Pause' : 'Animate'}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentStep(0)}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="visualization" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="visualization" className="gap-2">
              <GitBranch className="h-4 w-4" />
              Visual
            </TabsTrigger>
            <TabsTrigger value="steps" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Steps
            </TabsTrigger>
            <TabsTrigger value="code" className="gap-2">
              <Eye className="h-4 w-4" />
              Code Flow
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visualization" className="min-h-[300px]">
            {renderVisualization()}
          </TabsContent>

          <TabsContent value="steps" className="min-h-[300px]">
            <div className="space-y-3">
              {visualization?.data?.nodes?.map((node: any, index: number) => (
                <div
                  key={node.id}
                  className={cn(
                    "p-3 rounded-lg border transition-all duration-200",
                    currentStep === index 
                      ? "border-primary bg-primary/5" 
                      : "border-border bg-muted/20"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Badge variant={currentStep === index ? "default" : "outline"}>
                      {index + 1}
                    </Badge>
                    <span className="font-medium">{node.label}</span>
                  </div>
                  {node.metadata?.description && (
                    <p className="text-sm text-muted-foreground mt-2 ml-12">
                      {node.metadata.description}
                    </p>
                  )}
                </div>
              )) || (
                <p className="text-muted-foreground text-center py-8">
                  No step-by-step breakdown available
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="code" className="min-h-[300px]">
            <div className="bg-muted/20 rounded-lg p-4 font-mono text-sm">
              <div className="space-y-2">
                <div className="text-muted-foreground">// Code execution flow</div>
                {patternId === 'fibonacci-recursive' && (
                  <>
                    <div>function fibonacci(n) &#123;</div>
                    <div className="ml-4 text-warning">if (n &lt;= 1) return n; // Base case</div>
                    <div className="ml-4 text-accent">return fibonacci(n-1) + fibonacci(n-2); // Recursive calls</div>
                    <div>&#125;</div>
                  </>
                )}
                {patternId === 'binary-search' && (
                  <>
                    <div>while (left &lt;= right) &#123;</div>
                    <div className="ml-4 text-secondary">mid = (left + right) / 2;</div>
                    <div className="ml-4 text-warning">if (arr[mid] === target) return mid;</div>
                    <div className="ml-4 text-accent">else if (arr[mid] &lt; target) left = mid + 1;</div>
                    <div className="ml-4 text-accent">else right = mid - 1;</div>
                    <div>&#125;</div>
                  </>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};