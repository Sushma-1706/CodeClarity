import { useState } from "react";
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

const visualizationTypes = [
  { id: "flowchart", name: "Flowchart", icon: GitBranch, description: "Control flow visualization" },
  { id: "execution", name: "Execution", icon: Activity, description: "Step-by-step execution" },
  { id: "data-structure", name: "Data Structure", icon: Layers, description: "3D data visualization" },
  { id: "complexity", name: "Complexity", icon: Timer, description: "Time & space analysis" },
];

export const VisualizationPanel = () => {
  const [selectedType, setSelectedType] = useState("flowchart");
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(1);
  const maxSteps = 8;

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
            <CardTitle className="text-lg">Fibonacci Function Flow</CardTitle>
            <Badge variant="secondary" className="gap-1">
              <Cpu className="h-3 w-3" />
              O(2^n) Complexity
            </Badge>
          </div>
          <Button variant="ghost" size="icon-sm">
            <Settings className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {/* Visualization Canvas */}
          <div className="relative bg-gradient-to-br from-surface-muted to-background border border-border/20 rounded-lg p-8 min-h-[400px]">
            {/* Mock Flowchart */}
            <div className="flex flex-col items-center space-y-6">
              {/* Function Start */}
              <div className={cn(
                "px-6 py-3 rounded-xl border-2 transition-all duration-500",
                step >= 1 ? "bg-secondary text-secondary-foreground border-secondary shadow-glow" : "bg-muted text-muted-foreground border-border"
              )}>
                fibonacci(n)
              </div>
              
              {/* Condition Check */}
              <div className={cn(
                "px-6 py-3 rounded-xl border-2 transition-all duration-500",
                step >= 2 ? "bg-accent text-accent-foreground border-accent shadow-accent" : "bg-muted text-muted-foreground border-border"
              )}>
                n ≤ 1 ?
              </div>
              
              {/* Branches */}
              <div className="flex justify-between w-full max-w-md">
                <div className={cn(
                  "px-4 py-2 rounded-lg border-2 transition-all duration-500",
                  step >= 3 && step % 2 === 1 ? "bg-success text-success-foreground border-success" : "bg-muted text-muted-foreground border-border"
                )}>
                  return n
                </div>
                <div className={cn(
                  "px-4 py-2 rounded-lg border-2 transition-all duration-500",
                  step >= 4 && step % 2 === 0 ? "bg-warning text-warning-foreground border-warning" : "bg-muted text-muted-foreground border-border"
                )}>
                  fibonacci(n-1) + fibonacci(n-2)
                </div>
              </div>
              
              {/* Recursive Calls Visualization */}
              <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                <div className={cn(
                  "p-3 rounded-lg border text-center transition-all duration-500",
                  step >= 5 ? "bg-primary/10 border-primary text-primary" : "bg-muted/50 border-border text-muted-foreground"
                )}>
                  fib(n-1)
                </div>
                <div className={cn(
                  "p-3 rounded-lg border text-center transition-all duration-500",
                  step >= 6 ? "bg-primary/10 border-primary text-primary" : "bg-muted/50 border-border text-muted-foreground"
                )}>
                  fib(n-2)
                </div>
              </div>
            </div>
            
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