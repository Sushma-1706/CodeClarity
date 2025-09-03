import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Play, 
  Pause, 
  CheckCircle, 
  AlertTriangle, 
  Code2,
  Terminal,
  Clock,
  ArrowRight
} from "lucide-react";
import { CodeExecutionStep } from "@/lib/aiService";
import { cn } from "@/lib/utils";

interface ExecutionFlowProps {
  steps: CodeExecutionStep[];
  currentStep: number;
  onStepClick: (step: number) => void;
}

export const ExecutionFlow = ({ steps, currentStep, onStepClick }: ExecutionFlowProps) => {
  if (!steps || steps.length === 0) {
    return (
      <Card className="glass">
        <CardContent className="p-6 text-center">
          <div className="space-y-3">
            <Code2 className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-medium">No Execution Steps</h3>
            <p className="text-sm text-muted-foreground">
              Run the code to see step-by-step execution flow
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Execution Steps List */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Play className="h-5 w-5 text-secondary" />
            Execution Steps ({steps.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:bg-muted/50",
                    currentStep === index 
                      ? "border-primary bg-primary/10" 
                      : "border-border hover:border-border/60"
                  )}
                  onClick={() => onStepClick(index)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={currentStep === index ? "default" : "outline"}
                        className="text-xs"
                      >
                        Step {index + 1}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Line {step.lineNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(step.timestamp).toLocaleTimeString()}
                    </div>
                  </div>

                  {/* Code Being Executed */}
                  <div className="space-y-2">
                    <div className="bg-muted/50 rounded p-2 font-mono text-xs">
                      <span className="text-muted-foreground">Code:</span> {step.code}
                    </div>
                    
                    {/* Explanation */}
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium">Explanation:</span> {step.explanation}
                    </div>

                    {/* Variables */}
                    {Object.keys(step.variables).length > 0 && (
                      <div className="text-xs">
                        <span className="font-medium text-muted-foreground">Variables:</span>
                        <div className="mt-1 space-y-1">
                          {Object.entries(step.variables).map(([key, value]) => (
                            <div key={key} className="bg-muted/30 px-2 py-1 rounded text-xs">
                              <span className="font-mono">{key}</span>
                              <span className="text-muted-foreground"> = </span>
                              <span className="font-mono">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Output */}
                    {step.output && step.output.length > 0 && (
                      <div className="text-xs">
                        <span className="font-medium text-green-600">Output:</span>
                        <div className="mt-1 space-y-1">
                          {step.output.map((output, idx) => (
                            <div key={idx} className="bg-green-50 px-2 py-1 rounded text-xs font-mono">
                              {output}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Errors */}
                    {step.errors && step.errors.length > 0 && (
                      <div className="text-xs">
                        <span className="font-medium text-red-600">Errors:</span>
                        <div className="mt-1 space-y-1">
                          {step.errors.map((error, idx) => (
                            <div key={idx} className="bg-red-50 px-2 py-1 rounded text-xs">
                              {error}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Current Step Indicator */}
                  {currentStep === index && (
                    <div className="mt-2 flex items-center gap-2 text-primary text-xs">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      <span>Current Step</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Navigation Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Total Steps: {steps.length}</span>
        <span>Current: {currentStep + 1}</span>
        <span>Progress: {Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
      </div>
    </div>
  );
};
