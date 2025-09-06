import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Download,
  Maximize,
  GitBranch,
  Layers,
  Activity,
  Timer,
  Zap,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import mermaid from "mermaid";

interface VisualizationPanelProps {
  result?: {
    type: "mermaid";
    diagram: string;
  } | { error: string };
}

const visualizationTypes = [
  { id: "flowchart", name: "Flowchart", icon: GitBranch, description: "Control flow visualization" },
  { id: "execution", name: "Execution", icon: Activity, description: "Step-by-step execution" },
  { id: "data-structure", name: "Data Structure", icon: Layers, description: "3D data visualization" },
  { id: "complexity", name: "Complexity", icon: Timer, description: "Time & space analysis" },
];

export const VisualizationPanel = ({ result }: VisualizationPanelProps) => {
  const [selectedType, setSelectedType] = useState("flowchart");
  const chartRef = useRef<HTMLDivElement>(null);

  // ✅ Initialize Mermaid & Render Chart
  useEffect(() => {
    if (result && "diagram" in result && result.type === "mermaid") {
      try {
        mermaid.initialize({
          startOnLoad: false,
          theme: "default", // Can be "dark" | "forest" | "neutral"
          securityLevel: "loose",
        });

        // Render the diagram
        mermaid.render("mermaid-diagram", result.diagram).then(({ svg }) => {
          if (chartRef.current) {
            chartRef.current.innerHTML = svg;
          }
        }).catch((err) => {
          console.error("Mermaid Rendering Error:", err);
          if (chartRef.current) chartRef.current.innerHTML = `<p class="text-red-500">Failed to render diagram</p>`;
        });
      } catch (err) {
        console.error("Mermaid Init Error:", err);
      }
    } else if (chartRef.current) {
      chartRef.current.innerHTML = "";
    }
  }, [result]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gradient-secondary">
            Interactive Visualization
          </h2>
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

      {/* Visualization Mode Selector */}
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
                    <Icon
                      className={cn(
                        "h-6 w-6",
                        selectedType === type.id
                          ? "text-accent"
                          : "text-muted-foreground"
                      )}
                    />
                    <div>
                      <div className="font-medium text-sm">{type.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {type.description}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Visualization Output */}
      <Card className="glass">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg">Visualization Output</CardTitle>
            <Badge variant="secondary">Mermaid</Badge>
          </div>
          <Button variant="ghost" size="icon-sm">
            <Settings className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="relative bg-gradient-to-br from-surface-muted to-background border border-border/20 rounded-lg p-8 min-h-[400px]">
            {/* Flowchart Output */}
            {selectedType === "flowchart" && (
              <>
                {result && "error" in result ? (
                  <p className="text-red-500">{result.error}</p>
                ) : (
                  <div ref={chartRef} className="w-full overflow-x-auto" />
                )}
              </>
            )}

            {/* Floating Icons */}
            <div className="absolute top-4 right-4">
              <Zap className="h-6 w-6 text-accent animate-float" />
            </div>
            <div className="absolute bottom-4 left-4">
              <Activity className="h-5 w-5 text-secondary animate-pulse-glow" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

