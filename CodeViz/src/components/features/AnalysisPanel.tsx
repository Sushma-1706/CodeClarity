import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Brain,
  MessageCircle,
  AlertTriangle,
  HelpCircle,
  Volume2,
  VolumeX,
  Download,
  Share,
  Clock
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AnalysisPanelProps {
  result: any;
}

export const AnalysisPanel = ({ result }: AnalysisPanelProps) => {
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [whyModeActive, setWhyModeActive] = useState(false);

  // Voice synthesis for suggestions
  useEffect(() => {
    if (voiceEnabled && result?.result?.suggestions?.length > 0) {
      const textToSpeak = result.result.suggestions.join(". ");
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      speechSynthesis.speak(utterance);
    } else {
      speechSynthesis.cancel();
    }
  }, [voiceEnabled, result]);

  if (!result) {
    return (
      <div className="text-muted-foreground text-center py-10">
        Run an analysis to see results here.
      </div>
    );
  }

  if (result.error) {
    return (
      <div className="text-destructive text-center py-10">
        {result.error}
      </div>
    );
  }

  const metrics = result.result?.metrics;
  const suggestions = result.result?.suggestions || [];
  const language = result.result?.language || "Unknown";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-7 w-7 text-secondary" />
            <span className="text-gradient">AI Analysis</span>
          </h2>
          <p className="text-muted-foreground">
            Smart code explanation and insights ({language})
          </p>
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

      {/* Metrics */}
      {metrics && (
        <Card className="glass">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-warning" />
              Metrics & Complexity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-3 rounded-lg border bg-surface-muted">
                <div className="text-xs text-muted-foreground">Total Lines</div>
                <div className="text-lg font-bold">{metrics.totalLines}</div>
              </div>
              <div className="p-3 rounded-lg border bg-surface-muted">
                <div className="text-xs text-muted-foreground">Non-empty Lines</div>
                <div className="text-lg font-bold">{metrics.nonEmpty}</div>
              </div>
              <div className="p-3 rounded-lg border bg-surface-muted">
                <div className="text-xs text-muted-foreground">Functions</div>
                <div className="text-lg font-bold">
                  {metrics.functions.length > 0 ? metrics.functions.join(", ") : "None"}
                </div>
              </div>
              <div className="p-3 rounded-lg border bg-surface-muted">
                <div className="text-xs text-muted-foreground">Unused Vars</div>
                <div className="text-lg font-bold">
                  {metrics.unusedVars.length > 0 ? metrics.unusedVars.join(", ") : "None"}
                </div>
              </div>
              <div className="p-3 rounded-lg border bg-surface-muted">
                <div className="text-xs text-muted-foreground">Time Complexity</div>
                <div className="text-lg font-bold">{metrics.timeComplexity}</div>
              </div>
              <div className="p-3 rounded-lg border bg-surface-muted">
                <div className="text-xs text-muted-foreground">Cyclomatic Complexity</div>
                <div className="text-lg font-bold">{metrics.cyclomatic}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <Card className="glass">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {suggestions.map((s: string, i: number) => (
              <div
                key={i}
                className={cn("p-3 rounded-lg border-l-4 bg-surface-muted border-l-warning")}
              >
                <p className="text-sm">{s}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

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
