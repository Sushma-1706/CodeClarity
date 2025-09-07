import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { Header } from "./Header";
import { CodeEditor } from "../features/CodeEditor";
import { VisualizationPanel } from "../features/VisualizationPanel";
import { AnalysisPanel } from "../features/AnalysisPanel";
import { ToolsPanel } from "../features/ToolsPanel";
import { PatternRecognitionPanel } from "../features/PatternRecognitionPanel";
import { MLInsightsPanel } from "../features/MLInsightsPanel";
import { AIAnalysis } from "../features/AIAnalysis";
import {
  Code,
  Eye,
  Brain,
  Wrench,
  Sparkles,
  Cpu,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2
} from "lucide-react";

import { cn } from "@/lib/utils";

const tabs = [
  {
    id: "editor",
    name: "Code Editor",
    icon: Code,
    component: CodeEditor,
    description:
      "Write, edit, and manage your source code in a modern, multi-language editor with smart features and live syntax highlighting.",
  },
  {
    id: "patterns",
    name: "Pattern Recognition",
    icon: Sparkles,
    component: PatternRecognitionPanel,
    description:
      "Discover algorithms, design patterns, and anti-patterns in your code. Our AI engine highlights key structures and offers code insights.",
  },
  {
    id: "ml-insights",
    name: "ML Insights",
    icon: Cpu,
    component: MLInsightsPanel,
    description:
      "See advanced, machine learning–powered analysis of your code. Uncover subtle patterns, complexity, and metrics extracted through ML.",
  },
  {
    id: "visualize",
    name: "Visualization",
    icon: Eye,
    component: VisualizationPanel,
    description:
      "Transform your code into interactive diagrams, flowcharts, and visual aids to better understand structure and execution flow.",
  },
  {
    id: "analyze",
    name: "AI Analysis",
    icon: Brain,
    component: AnalysisPanel,
    description:
      "Let CodeViz AI explain your code step-by-step: get plain-English summaries, analogies, time and space complexity, and optimization tips.",
  },
  {
    id: "tools",
    name: "Tools",
    icon: Wrench,
    component: ToolsPanel,
    description:
      "Access developer tools: compare code versions, generate quizzes, view code history, and use other AI-assisted productivity features.",
  },
];

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("editor");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Code + language state
  const [currentCode, setCurrentCode] = useState<string>(`// Welcome to CodeViz AI!
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`);
  const [currentLanguage, setCurrentLanguage] = useState<string>("javascript");

  // API Results
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [runResult, setRunResult] = useState<any>(null);
  const [visualResult, setVisualResult] = useState<any>(null);


  // ML insights navigation listener

  useEffect(() => {
    const handleSwitchToMLInsights = () => setActiveTab("ml-insights");
    window.addEventListener("switchToMLInsights", handleSwitchToMLInsights);
    return () =>
      window.removeEventListener("switchToMLInsights", handleSwitchToMLInsights);
  }, []);

    const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || CodeEditor;

  const activeTabObj = tabs.find(tab => tab.id === activeTab);
  const ActiveComponent = activeTabObj?.component || CodeEditor;
 

  return (
    <div className="min-h-screen bg-background">
      {/* Top Header */}
      <Header />

      {/* Hero Section */}

      <div className="relative h-32 overflow-hidden">

      <div className="relative h-64 md:h-80 lg:h-[28rem] flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/src/assets/hero-bg.jpg')` }}
        />
        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background/90" />
        <div className="relative w-full flex flex-col items-center justify-end py-8 md:py-12 z-10">
          <div className="w-full max-w-5xl text-center px-4 space-y-20">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gradient mx-auto max-w-4xl leading-tight">
              AI-Powered Code Visualization
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Transform complex code into interactive visualizations and
              explanations
            <p className="text-muted-foreground text-lg md:text-xl max-w-5xl mx-auto font-medium">
              Transform complex code into interactive visualizations and intelligent explanations.<br />
              CodeViz AI accelerates your understanding, refactoring, analysis, and debugging – all powered by modern machine learning.<br />
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside
            className={cn(
              "transition-all duration-300 sticky top-24 self-start",
              sidebarCollapsed ? "w-16" : "w-64"
            )}
          >
            <Card className="glass">
              <CardContent className="p-3">
                {/* Collapse Toggle */}
                <div className="flex justify-end mb-4">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  >
                    {sidebarCollapsed ? (
                      <ChevronRight className="h-4 w-4" />
                    ) : (
                      <ChevronLeft className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* Navigation Tabs */}
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-left",
                          isActive
                            ? "bg-secondary text-secondary-foreground shadow-md"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        {!sidebarCollapsed && (
                          <span className="font-medium">{tab.name}</span>
                        )}
                        {!sidebarCollapsed && isActive && (
                          <Badge variant="outline" className="ml-auto">
                            Active
                          </Badge>
                        )}
                      </button>
                    );
                  })}
                </nav>

          {/* Sidebar Navigation */}
<aside className={cn(
  "transition-all duration-300 sticky top-24 self-start",
  sidebarCollapsed ? "w-16" : "w-64"
)}>
  <Card className="glass">
    <CardContent className="p-3">
      {/* Collapse Toggle */}
      <div className="flex justify-end mb-4">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation Tabs with Tooltips */}
      <nav className="space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;


          return (
            <div
              key={tab.id}
              className="relative group w-full"
              tabIndex={0}
            >
              <button
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-left focus:outline-none",
                  isActive
                    ? "bg-secondary text-secondary-foreground shadow-md"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
                aria-label={tab.name}
                onFocus={() => setActiveTab(tab.id)}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <div className="mt-6 pt-4 border-t border-border/20">
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <Badge variant="secondary" className="text-xs">
                          Ready
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">AI Engine</span>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                          <span className="text-success">Online</span>
                        </div>
                      </div>
                    </div>

                  <span className="font-medium">{tab.name}</span>
                )}
                {!sidebarCollapsed && isActive && (
                  <div className={cn(badgeVariants({ variant: "outline" }), "ml-auto")}>
                    Active
                  </div>
                )}
              </button>

              {/* Tooltip for sidebarCollapsed or always show on hover/focus */}
              {(sidebarCollapsed || true) && (
                <div
                  className={cn(
                    "pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto",
                    "absolute top-2 left-14 z-30 w-[220px] rounded-xl px-4 py-3 bg-gradient-to-br from-secondary/95 via-background/95 to-accent/90 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 shadow-xl border border-accent/30 transition-all duration-200 ease-out",
                    "scale-95 group-hover:scale-100 group-focus-within:scale-100"
                  )}
                  style={{
                    minWidth: "200px",
                    marginLeft: sidebarCollapsed ? "6px" : "0",
                  }}
                >
                  <div className="font-semibold text-secondary-foreground flex items-center gap-2 mb-1">
                    <Icon className="h-4 w-4 text-accent" />
                    {tab.name}
                  </div>
                  <p className="text-xs text-muted-foreground">{tab.description}</p>
                  <span
                    className="absolute -left-2 top-4 w-4 h-4 bg-gradient-to-br from-accent/80 to-background/90 rotate-45 z-0"
                    style={{ borderRadius: '0 0 0 8px' }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Status Indicators - unchanged */}
      {!sidebarCollapsed && (
        <div className="mt-6 pt-4 border-t border-border/20">
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <div className={cn(badgeVariants({ variant: "secondary" }), "text-xs")}>Ready</div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">AI Engine</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span className="text-success">Online</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </CardContent>
  </Card>
</aside>

          {/* Main Content */}
          <main
            className={cn(
              "flex-1 transition-all duration-300",
              isFullscreen && "fixed inset-0 z-50 bg-background p-6"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {tabs.map((tab) => {
                  if (tab.id === activeTab) {
                    const Icon = tab.icon;
                    return (
                      <div key={tab.id} className="flex items-center gap-2">
                        <Icon className="h-6 w-6 text-secondary" />
                        <h2 className="text-2xl font-bold">{tab.name}</h2>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>

              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="ml-auto"
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            </div>

          {/* Main Content Area */}
          <main className={cn(
            "flex-1 transition-all duration-300",
            isFullscreen && "fixed inset-0 z-50 bg-background p-6"
          )}>
            {/* Content Header */}
            {/* Removed duplicate white heading here */}

            {/* Dynamic Content */}
            <div className="animate-fade-in">
              {activeTab === "editor" ? (
                <CodeEditor
                  onCodeChange={setCurrentCode}
                  onLanguageChange={setCurrentLanguage}
                  initialCode={currentCode}
                  initialLanguage={currentLanguage}
                  onAnalysis={(res: any) => {
                    setAnalysisResult(res);
                    setActiveTab("analyze");
                  }}
                  onRun={(res: any) => {
                    setRunResult(res);
                    setActiveTab("analyze");
                  }}
                  onVisualize={(res: any) => {
                    setVisualResult(res);
                    setActiveTab("visualize");
                  }}
                />
              ) : activeTab === "patterns" ? (
                <PatternRecognitionPanel
                  code={currentCode}
                  language={currentLanguage}
                />
              ) : activeTab === "ml-insights" ? (
                <MLInsightsPanel code={currentCode} language={currentLanguage} />
              ) : activeTab === "visualize" ? (
                <VisualizationPanel result={visualResult} />
              ) : activeTab === "analyze" ? (
                <div className="space-y-6">
                  <AIAnalysis
                    analysisResult={analysisResult}
                    runResult={runResult}
                  />
                  <AnalysisPanel analysis={analysisResult} run={runResult} />
                </div>
              ) : (
                <ToolsPanel />
              ) : activeTab === "tools" ? (
                <ToolsPanel onExampleLoad={(code, language) => {
                  setCurrentCode(code);
                  setCurrentLanguage(language);
                  setActiveTab("editor"); // Switch to editor after loading example
                }} />
              ) : (
                <ActiveComponent code={currentCode} language={currentLanguage} />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
