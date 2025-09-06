// CodeViz/src/components/features/CodeEditor.tsx

import { useState, useEffect } from "react";
import mermaid from "mermaid";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Upload,
  Copy,
  Settings,
  FileText,
  Brain,
  Lightbulb,
  Zap,
  Code2,
  Palette,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";

const languages = [
  { id: "javascript", name: "JavaScript", color: "bg-yellow-500" },
  { id: "python", name: "Python", color: "bg-blue-500" },
  { id: "java", name: "Java", color: "bg-orange-500" },
  { id: "cpp", name: "C++", color: "bg-purple-500" },
  { id: "c", name: "C", color: "bg-gray-500" },
];

const modes = [
  { id: "simplified", name: "Simplified", icon: Lightbulb, description: "For 10-year-olds" },
  { id: "technical", name: "Technical", icon: Brain, description: "For 20-year-olds" },
];

interface CodeEditorProps {
  onAnalysis?: (result: any) => void;
  onRun?: (result: any) => void;
  onVisualize?: (result: any) => void;
  onCodeChange?: (code: string) => void;
  onLanguageChange?: (language: string) => void;
  initialCode?: string;
  initialLanguage?: string;
}

export const CodeEditor = ({
  onAnalysis,
  onRun,
  onVisualize,
  onCodeChange,
  onLanguageChange,
  initialCode = `// Welcome to CodeViz AI!
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`,
  initialLanguage = "javascript",
}: CodeEditorProps = {}) => {
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage);
  const [selectedMode, setSelectedMode] = useState("simplified");
  const [code, setCode] = useState(initialCode);
  const [visualization, setVisualization] = useState<string>("");

  // --- Analyze Code using backend API ---
  const handleAnalyze = async () => {
    try {
      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language: selectedLanguage,
          mode: selectedMode,
        }),
      });

      const data = await response.json();
      onAnalysis?.(data);
    } catch (error) {
      console.error("Analysis Error:", error);
      onAnalysis?.({ error: "Failed to fetch AI analysis" });
    }
  };

  // --- Run Code in Sandbox ---
  const handleRun = async () => {
    try {
      const res = await fetch("http://localhost:5000/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language: selectedLanguage }),
      });

      const data = await res.json();

      onRun?.({
        stdout: data.stdout ?? "",
        stderr: data.stderr ?? "",
        exitCode: data.exitCode ?? null,
      });
    } catch (err) {
      onRun?.({
        stdout: "",
        stderr: (err as Error).message,
        exitCode: 1,
      });
    }
  };

  // --- Generate Visualization ---
  
const handleVisualize = async () => {
  try {
    const response = await fetch("/api/visualize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, language: selectedLanguage }),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      onVisualize?.({ error: data.error || "Visualization failed" });
      return;
    }

    // ✅ Pass the mermaid diagram to visualization panel
    onVisualize?.({
      type: "mermaid",
      diagram: data.diagram,
    });
  } catch (error) {
    console.error("Visualization Error:", error);
    onVisualize?.({ error: "Failed to generate visualization" });
  }
};


  // --- Re-render Mermaid when visualization changes ---
  useEffect(() => {
    if (visualization) {
      try {
        mermaid.initialize({ startOnLoad: true });
        mermaid.contentLoaded();
      } catch (err) {
        console.error("Mermaid Render Error:", err);
      }
    }
  }, [visualization]);

  return (
    <div className="space-y-6">
      {/* Controls Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gradient">Code Editor</h2>
          <p className="text-muted-foreground">Write or paste your code here</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Upload className="h-4 w-4" />
            Upload File
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Save className="h-4 w-4" />
            Save
          </Button>
          <Button variant="secondary" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Language & Mode Selection */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Code2 className="h-5 w-5 text-secondary" />
            Language & Mode Selection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Language Pills */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Programming Language</label>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => {
                    setSelectedLanguage(lang.id);
                    onLanguageChange?.(lang.id);
                  }}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2",
                    selectedLanguage === lang.id
                      ? "bg-secondary text-secondary-foreground shadow-md transform scale-105"
                      : "bg-muted hover:bg-muted/80 text-muted-foreground"
                  )}
                >
                  <div className={cn("w-2 h-2 rounded-full", lang.color)} />
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          {/* Comprehension Modes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Comprehension Mode</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {modes.map((mode) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedMode(mode.id)}
                    className={cn(
                      "p-4 rounded-lg border-2 transition-all duration-200 text-left",
                      selectedMode === mode.id
                        ? "border-secondary bg-secondary/10 shadow-md"
                        : "border-border hover:border-border/60"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={cn(
                          "h-5 w-5",
                          selectedMode === mode.id ? "text-secondary" : "text-muted-foreground"
                        )}
                      />
                      <div>
                        <div className="font-medium">{mode.name}</div>
                        <div className="text-sm text-muted-foreground">{mode.description}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Code Editor Area */}
      <Card className="glass">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-accent" />
            Code Input
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Palette className="h-3 w-3" />
              Syntax Highlighting
            </Badge>
            <Button variant="ghost" size="icon-sm">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex w-full border border-border/20 rounded-lg overflow-auto max-h-[500px]">
            <div className="bg-muted/40 text-xs text-muted-foreground font-mono text-right pr-2 py-2 select-none sticky left-0 top-0 h-fit">
              {code.split("\n").map((_, i) => (
                <div key={i} className="leading-5">
                  {i + 1}
                </div>
              ))}
            </div>

            <textarea
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                onCodeChange?.(e.target.value);
              }}
              placeholder="Paste your code here or start typing..."
              className="min-h-[300px] w-full font-mono text-sm bg-editor-bg text-editor-foreground resize-none outline-none p-2"
              style={{
                background: "hsl(var(--editor-bg))",
                color: "hsl(var(--editor-foreground))",
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={handleAnalyze} variant="gradient" size="lg" className="gap-2 flex-1">
          <Zap className="h-5 w-5" />
          Analyze & Explain Code
        </Button>
        <Button onClick={handleRun} variant="secondary" size="lg" className="gap-2 flex-1">
          <Play className="h-5 w-5" />
          Run in Sandbox
        </Button>
        <Button onClick={handleVisualize} variant="accent" size="lg" className="gap-2 flex-1">
          <Brain className="h-5 w-5" />
          Generate Visualization
        </Button>
      </div>

{/* Visualization Section */}
{visualization && (
  <Card className="glass mt-6">
    <CardHeader>
      <CardTitle className="text-lg flex items-center gap-2">
        <Brain className="h-5 w-5 text-accent" />
        Code Visualization
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="mermaid">
        {visualization}
      </div>
    </CardContent>
  </Card>
)}

    </div>
  );
};
