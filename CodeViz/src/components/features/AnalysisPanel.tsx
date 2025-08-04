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
import { useState } from "react";

const complexityData = {
  time: { value: "O(2^n)", level: "exponential", color: "destructive" },
  space: { value: "O(n)", level: "linear", color: "warning" },
};

const issuesFound = [
  { 
    id: 1, 
    type: "performance", 
    severity: "high", 
    line: 3, 
    message: "Exponential time complexity - consider using memoization",
    suggestion: "Use dynamic programming or memoization to optimize"
  },
  { 
    id: 2, 
    type: "style", 
    severity: "low", 
    line: 5, 
    message: "Missing semicolon",
    suggestion: "Add semicolon for consistency"
  }
];

export const AnalysisPanel = () => {
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [whyModeActive, setWhyModeActive] = useState(false);

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
            onClick={() => setVoiceEnabled(!voiceEnabled)}
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
          <div className="p-4 bg-surface-muted rounded-lg border border-border/20">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-accent" />
              Simplified Explanation (10-year-old level)
            </h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
              This code is like a mathematical recipe! It calculates Fibonacci numbers - a special sequence where each number is the sum of the two numbers before it (1, 1, 2, 3, 5, 8...). The function calls itself to break down the problem into smaller pieces, just like asking "What's 5+3?" by first figuring out what 5 is and what 3 is.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Real-world Analogy */}
            <div className="p-4 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-lg border border-secondary/20">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Target className="h-4 w-4 text-secondary" />
                Real-world Analogy
              </h4>
              <p className="text-sm text-muted-foreground">
                Think of this like a family tree! To find out how many rabbit pairs you'll have after n months, you need to know how many you had in the previous two months. Each generation depends on the ones before it.
              </p>
            </div>

            {/* Key Concepts */}
            <div className="p-4 bg-gradient-to-br from-accent/10 to-success/10 rounded-lg border border-accent/20">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Brain className="h-4 w-4 text-accent" />
                Key Concepts
              </h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Recursion</Badge>
                <Badge variant="outline">Base Case</Badge>
                <Badge variant="outline">Function Calls</Badge>
                <Badge variant="outline">Mathematical Sequence</Badge>
              </div>
            </div>
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
          {issuesFound.map((issue) => (
            <div 
              key={issue.id}
              className={cn(
                "p-4 rounded-lg border-l-4 bg-surface-muted",
                issue.severity === "high" ? "border-l-destructive" : "border-l-warning"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge 
                      variant={issue.severity === "high" ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      Line {issue.line}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {issue.type}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium mb-1">{issue.message}</p>
                  <p className="text-xs text-muted-foreground">{issue.suggestion}</p>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Fix
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Export Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="outline" size="lg" className="gap-2 flex-1">
          <Download className="h-5 w-5" />
          Export Analysis
        </Button>
        <Button variant="secondary" size="lg" className="gap-2 flex-1">
          <Share className="h-5 w-5" />
          Share Explanation
        </Button>
      </div>
    </div>
  );
};