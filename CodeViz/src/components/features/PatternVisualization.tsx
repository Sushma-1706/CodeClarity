import { useEffect, useMemo, useRef, useState } from "react";
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
  visualizationData?: {
    type: "flowchart" | "tree" | "graph" | "sequence";
    data: any;
  } | null;
  className?: string;
}

export const PatternVisualization = ({ 
  patternId, 
  patternName, 
  visualizationData,
  className 
}: PatternVisualizationProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const visualizationRef = useRef<HTMLDivElement | null>(null);
  
  const visualization = useMemo(
    () => visualizationData || visualizationEngine.generatePatternVisualization(patternId),
    [patternId, visualizationData]
  );

  const flowNodes = useMemo(() => {
    if (visualization?.type !== "flowchart" || !Array.isArray(visualization.data?.nodes)) return [] as any[];
    return visualization.data.nodes;
  }, [visualization]);

  const flowConnections = useMemo(() => {
    if (visualization?.type !== "flowchart" || !Array.isArray(visualization.data?.connections)) {
      return [] as Array<{ from: string; to: string; label?: string }>;
    }
    return visualization.data.connections;
  }, [visualization]);

  const nodeById = useMemo(() => {
    const map = new Map<string, any>();
    flowNodes.forEach((node) => {
      if (node?.id) map.set(node.id, node);
    });
    return map;
  }, [flowNodes]);

  const stepItems = useMemo(() => {
    if (!visualization) return [] as Array<{ id: string; label: string; description?: string; type?: string }>;

    if (visualization.type === "flowchart" && Array.isArray(visualization.data?.nodes)) {
      return visualization.data.nodes.map((node: any, index: number) => {
        const outgoing = flowConnections
          .filter((connection) => connection.from === node.id)
          .map((connection) => {
            const targetLabel = nodeById.get(connection.to)?.label || connection.to;
            return connection.label ? `${connection.label} -> ${targetLabel}` : `next -> ${targetLabel}`;
          });

        return {
          id: node.id || `step-${index}`,
          label: node.label || `Step ${index + 1}`,
          description:
            node.metadata?.description ||
            (outgoing.length > 0
              ? `After this step: ${outgoing.join(" | ")}`
              : "Final step in this flow"),
          type: node.type,
        };
      });
    }

    if (visualization.type === "tree") {
      const items: Array<{ id: string; label: string; description?: string }> = [];
      const walk = (node: any, depth: number) => {
        if (!node) return;
        items.push({
          id: `${node.id || node.name || "node"}-${items.length}`,
          label: node.name || `Node ${items.length + 1}`,
          description: depth === 0 ? "Root call" : node.metadata?.isBase ? "Base case" : `Depth ${depth}`,
          type: node.metadata?.isBase ? "condition" : "function",
        });
        if (Array.isArray(node.children)) {
          node.children.forEach((child: any) => walk(child, depth + 1));
        }
      };
      walk(visualization.data, 0);
      return items;
    }

    if (visualization.type === "graph" && Array.isArray(visualization.data?.nodes)) {
      return visualization.data.nodes.map((node: any, index: number) => ({
        id: node.id || `node-${index}`,
        label: node.label || `Node ${index + 1}`,
        description: node.data,
        type: "variable",
      }));
    }

    return [];
  }, [visualization]);

  const codeFlowLines = useMemo(() => {
    if (!visualization) {
      return ["// No visualization data available"];
    }

    if (visualization.type === "flowchart") {
      const lines: string[] = [
        `// ${patternName} - understandable execution flow`,
        "start();",
      ];

      flowNodes.forEach((node: any) => {
        const outgoing = flowConnections.filter((connection) => connection.from === node.id);
        const label = node.label || "step";

        if (node.type === "condition") {
          const yesTarget = outgoing.find((connection) => /yes|true/i.test(connection.label || ""));
          const noTarget = outgoing.find((connection) => /no|false/i.test(connection.label || ""));
          lines.push(`if (${label}) {`);
          lines.push(`  // yes branch${yesTarget ? ` -> ${nodeById.get(yesTarget.to)?.label || yesTarget.to}` : ""}`);
          lines.push("} else {");
          lines.push(`  // no branch${noTarget ? ` -> ${nodeById.get(noTarget.to)?.label || noTarget.to}` : ""}`);
          lines.push("}");
          return;
        }

        if (node.type === "loop") {
          lines.push(`while (loop condition) {`);
          lines.push(`  ${label};`);
          lines.push("}");
          return;
        }

        if (node.type === "return") {
          lines.push(`return ${label};`);
          return;
        }

        lines.push(`${label};`);
      });

      lines.push("end();");
      return lines;
    }

    if (visualization.type === "tree") {
      const lines: string[] = [
        `// ${patternName} - recursive call flow`,
        "call root function",
      ];
      stepItems.forEach((item, index) => {
        lines.push(`${index + 1}. ${item.label} // ${item.description || "recursive step"}`);
      });
      lines.push("combine sub-results and return");
      return lines;
    }

    if (visualization.type === "graph") {
      const lines: string[] = [
        `// ${patternName} - pointer/reference traversal flow`,
        "current = head",
        "while (current != null) {",
        "  process(current)",
        "  current = current.next",
        "}",
      ];
      return lines;
    }

    return ["// Pattern-specific flow is unavailable for this visualization type"];
  }, [visualization, patternName, flowNodes, flowConnections, nodeById, stepItems]);

  const activeStepHint = useMemo(() => {
    if (stepItems.length === 0) return null;
    const current = stepItems[Math.min(currentStep, stepItems.length - 1)];
    return {
      title: current.label,
      detail: current.description || "This step runs as part of the detected pattern.",
      type: current.type || "step",
    };
  }, [stepItems, currentStep]);

  useEffect(() => {
    setCurrentStep(0);
    setIsAnimating(false);
  }, [patternId]);

  useEffect(() => {
    if (!isAnimating || stepItems.length === 0) return;

    const interval = window.setInterval(() => {
      setCurrentStep((prev) => {
        const next = prev + 1;
        if (next >= stepItems.length) {
          setIsAnimating(false);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isAnimating, stepItems.length]);

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
    if (stepItems.length === 0) return;
    setIsAnimating((prev) => !prev);
  };

  const toggleFullscreen = async () => {
    const el = visualizationRef.current;
    if (!el) return;

    if (document.fullscreenElement === el) {
      await document.exitFullscreen();
      return;
    }

    if (el.requestFullscreen) {
      await el.requestFullscreen();
    }
  };

  const handleDownload = () => {
    const blob = new Blob([
      JSON.stringify(
        {
          patternId,
          patternName,
          visualization,
        },
        null,
        2
      ),
    ], { type: "application/json;charset=utf-8" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${patternId || "pattern"}-visualization.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Card ref={visualizationRef} className={cn("glass", className)}>
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
            <Button variant="outline" size="sm" onClick={() => {
              setCurrentStep(0);
              setIsAnimating(false);
            }}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={toggleFullscreen}>
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {activeStepHint && (
          <div className="mb-4 rounded-lg border border-border/40 bg-muted/20 px-4 py-3">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Current Step</div>
            <div className="mt-1 text-sm font-medium">{activeStepHint.title}</div>
            <div className="text-xs text-muted-foreground mt-1">{activeStepHint.detail}</div>
          </div>
        )}

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
            <div className="mb-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <Badge variant="outline">function: entry/operation</Badge>
              <Badge variant="outline">condition: decision point</Badge>
              <Badge variant="outline">loop: repeated step</Badge>
              <Badge variant="outline">return: final output</Badge>
            </div>
            {renderVisualization()}
          </TabsContent>

          <TabsContent value="steps" className="min-h-[300px]">
            <div className="space-y-3">
              {stepItems.length > 0 ? stepItems.map((item, index) => (
                <div
                  key={item.id}
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
                    <span className="font-medium">{item.label}</span>
                    {item.type && (
                      <Badge variant="secondary" className="text-[10px] uppercase tracking-wide">
                        {item.type}
                      </Badge>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mt-2 ml-12">
                      {item.description}
                    </p>
                  )}
                </div>
              )) : (
                <p className="text-muted-foreground text-center py-8">
                  No step-by-step breakdown available
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="code" className="min-h-[300px]">
            <div className="bg-muted/20 rounded-lg p-4 font-mono text-sm">
              <div className="space-y-2">
                {codeFlowLines.map((line, index) => (
                  <div key={`${patternId}-flow-${index}`} className="whitespace-pre-wrap">
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};