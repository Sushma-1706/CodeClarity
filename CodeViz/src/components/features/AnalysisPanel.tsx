import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain,
  MessageCircle,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Clock,
  Zap,
  Target,
  HelpCircle,
  Volume2,
  VolumeX,
  Download,
  Share
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { aiExplanationService } from "@/services/aiExplanationService";
import { errorDetectionService } from "@/services/errorDetectionService";
import { voiceExplanationService } from "@/services/voiceExplanationService";
import { exportService } from "@/services/exportService";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface AnalysisPanelProps {
  code?: string;
  language?: string;
  mode?: "simplified" | "technical";
}

export const AnalysisPanel = ({ code = "", language = "javascript", mode = "simplified" }: AnalysisPanelProps) => {
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [whyModeActive, setWhyModeActive] = useState(false);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [explanation, setExplanation] = useState<any>(null);
  const [errors, setErrors] = useState<any[]>([]);
  const [complexityData, setComplexityData] = useState({
    time: { value: "O(1)", level: "constant", color: "success" },
    space: { value: "O(1)", level: "constant", color: "success" },
  });

  useEffect(() => {
    let isActive = true;

    if (!code.trim()) {
      setExplanation(null);
      setErrors([]);
      return () => {
        isActive = false;
      };
    }

    (async () => {
      // Generate explanation
      const exp = await aiExplanationService.generateExplanation(code, language, mode);
      if (isActive) {
        setExplanation(exp);
      }

      // Detect errors
      const detectedErrors = errorDetectionService.detectErrors(code, language);
      if (isActive) {
        setErrors(detectedErrors);
      }

      // Calculate complexity (simplified)
      const functionName = code.match(/function\s+(\w+)/)?.[1];
      const hasRecursion = Boolean(
        functionName && code.includes("function") && code.includes(`${functionName}(`)
      );
      if (hasRecursion && !code.includes("memo")) {
        if (isActive) {
          setComplexityData({
            time: { value: "O(2^n)", level: "exponential", color: "destructive" },
            space: { value: "O(n)", level: "linear", color: "warning" },
          });
        }
      } else {
        if (isActive) {
          setComplexityData({
            time: { value: "O(n)", level: "linear", color: "warning" },
            space: { value: "O(1)", level: "constant", color: "success" },
          });
        }
      }
    })();

    return () => {
      isActive = false;
    };
  }, [code, language, mode]);

  const handleVoiceToggle = () => {
    if (voiceEnabled) {
      voiceExplanationService.stop();
    } else if (explanation) {
      voiceExplanationService.speakExplanation(
        mode === "simplified" ? explanation.simplified : explanation.technical,
        mode
      );
    }
    setVoiceEnabled(!voiceEnabled);
  };

  const handleWhyModeClick = async (lineNumber: number) => {
    if (whyModeActive) {
      const whyExplanation = await aiExplanationService.generateWhyModeExplanation(code, language, lineNumber);
      if (whyExplanation) {
        setSelectedLine(lineNumber);
        // Show popover or modal with explanation
      }
    }
  };

  const handleExport = () => {
    if (explanation) {
      const markdown = exportService.exportToMarkdown(
        code,
        mode === "simplified" ? explanation.simplified : explanation.technical,
        {
          time: complexityData.time.value,
          space: complexityData.space.value,
        }
      );
      exportService.downloadFile(markdown, "code-analysis.md", "text/markdown");
    }
  };

  const handleShare = () => {
    if (explanation) {
      const shareLink = exportService.generateShareLink(
        code,
        mode === "simplified" ? explanation.simplified : explanation.technical
      );
      navigator.clipboard.writeText(shareLink.url);
      alert(`Share link copied to clipboard: ${shareLink.url}`);
    }
  };

  const handleFixError = (errorId: string) => {
    const fix = errorDetectionService.fixCode(code, language, errors.filter(e => e.id === errorId));
    // In a real app, this would update the code in the editor
    alert(`Fixed code:\n\n${fix.fixedCode}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-7 w-7 text-secondary" />
            <span className="text-gradient">AI Analysis</span>
          </h2>
          <p className="text-muted-foreground">Smart code explanation and insights</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant={voiceEnabled ? "secondary" : "outline"} 
            size="sm" 
            className="gap-2"
            onClick={handleVoiceToggle}
          >
            {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            Voice
          </Button>
          <Button 
            variant={whyModeActive ? "accent" : "outline"} 
            size="sm" 
            className="gap-2"
            onClick={() => setWhyModeActive(!whyModeActive)}
          >
            <HelpCircle className="h-4 w-4" />
            Why Mode
          </Button>
        </div>
      </div>

      {/* Main Explanation */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-accent" />
            Code Explanation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {explanation ? (
            <>
              <div className="p-4 bg-surface-muted rounded-lg border border-border/20">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-accent" />
                  {mode === "simplified" ? "Simplified Explanation (10-year-old level)" : "Technical Explanation (20-year-old level)"}
                </h4>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {mode === "simplified" ? explanation.simplified : explanation.technical}
                </p>
              </div>
              
              {whyModeActive && (
                <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <p className="text-sm text-warning">
                    💡 Why Mode Active: Click on any line of code in the editor to get detailed explanations!
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="p-4 bg-surface-muted rounded-lg border border-border/20">
              <p className="text-sm text-muted-foreground">Enter code to see explanations</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Real-world Analogy */}
            {explanation?.analogy && (
              <div className="p-4 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-lg border border-secondary/20">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4 text-secondary" />
                  Real-world Analogy
                </h4>
                <p className="text-sm text-muted-foreground">
                  {explanation.analogy}
                </p>
              </div>
            )}

            {/* Key Concepts */}
            {explanation?.keyConcepts && explanation.keyConcepts.length > 0 && (
              <div className="p-4 bg-gradient-to-br from-accent/10 to-success/10 rounded-lg border border-accent/20">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Brain className="h-4 w-4 text-accent" />
                  Key Concepts
                </h4>
                <div className="flex flex-wrap gap-2">
                  {explanation.keyConcepts.map((concept: string, idx: number) => (
                    <Badge key={idx} variant={idx === 0 ? "secondary" : "outline"}>
                      {concept}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Complexity Analysis */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-warning" />
            Complexity Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-border/20 bg-surface-muted">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="h-5 w-5 text-destructive" />
                <span className="font-medium">Time Complexity</span>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-destructive">{complexityData.time.value}</div>
                <Badge variant="destructive">{complexityData.time.level}</Badge>
                <p className="text-xs text-muted-foreground">
                  Each function call creates two more calls, creating exponential growth
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border/20 bg-surface-muted">
              <div className="flex items-center gap-3 mb-2">
                <Target className="h-5 w-5 text-warning" />
                <span className="font-medium">Space Complexity</span>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-warning">{complexityData.space.value}</div>
                <Badge variant="secondary">{complexityData.space.level}</Badge>
                <p className="text-xs text-muted-foreground">
                  Maximum recursion depth equals input size
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Issues & Suggestions */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Issues & Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {errors.length > 0 ? (
            errors.map((error) => (
              <div 
                key={error.id}
                className={cn(
                  "p-4 rounded-lg border-l-4 bg-surface-muted",
                  error.severity === "error" ? "border-l-destructive" : 
                  error.severity === "warning" ? "border-l-warning" : "border-l-muted"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge 
                        variant={error.severity === "error" ? "destructive" : 
                                error.severity === "warning" ? "secondary" : "outline"}
                        className="text-xs"
                      >
                        Line {error.line}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {error.type}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium mb-1">{error.message}</p>
                    <p className="text-xs text-muted-foreground">{error.suggestion}</p>
                    {error.code && (
                      <code className="text-xs bg-muted p-1 rounded mt-1 block">{error.code}</code>
                    )}
                  </div>
                  {error.fixedCode && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => handleFixError(error.id)}
                    >
                      <CheckCircle className="h-4 w-4" />
                      Fix
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 rounded-lg border border-success/20 bg-success/10">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                <p className="text-sm text-success">No errors detected! Your code looks good.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="outline" size="lg" className="gap-2 flex-1" onClick={handleExport}>
          <Download className="h-5 w-5" />
          Export Analysis
        </Button>
        <Button variant="secondary" size="lg" className="gap-2 flex-1" onClick={handleShare}>
          <Share className="h-5 w-5" />
          Share Explanation
        </Button>
      </div>
    </div>
  );
};