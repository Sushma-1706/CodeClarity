import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { CodeEditor } from "../features/CodeEditor";
import { VisualizationPanel } from "../features/VisualizationPanel";
import { AnalysisPanel } from "../features/AnalysisPanel";
import { ToolsPanel } from "../features/ToolsPanel";
import { PatternRecognitionPanel } from "../features/PatternRecognitionPanel";
import { AnalysisInsightsPanel } from "../features/AnalysisInsightsPanel";
import { Brain, Code, Cpu, Eye, Sparkles, UserRound, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";

const tabs = [
  {
    id: "editor",
    name: "Code Editor",
    icon: Code,
    component: CodeEditor,
    description: "Write, edit, and manage your source code in a modern, multi-language editor.",
  },
  {
    id: "patterns",
    name: "Pattern Recognition",
    icon: Sparkles,
    component: PatternRecognitionPanel,
    description: "Discover algorithms, patterns, and anti-patterns in your code.",
  },
  {
    id: "ml-insights",
    name: "ML Insights",
    icon: Cpu,
    component: AnalysisInsightsPanel,
    description: "See machine learning powered analysis and extracted metrics.",
  },
  {
    id: "visualize",
    name: "Visualization",
    icon: Eye,
    component: VisualizationPanel,
    description: "Convert code into visual diagrams and flow insights.",
  },
  {
    id: "analyze",
    name: "AI Analysis",
    icon: Brain,
    component: AnalysisPanel,
    description: "Get explanation, complexity, and optimization guidance.",
  },
  {
    id: "tools",
    name: "Tools",
    icon: Wrench,
    component: ToolsPanel,
    description: "Open productivity tools and code assistant utilities.",
  },
] as const;

const navItems = [
  ...tabs.map((tab) => ({ id: tab.id, name: tab.name, icon: tab.icon, description: tab.description })),
  {
    id: "profile",
    name: "Profile",
    icon: UserRound,
    description: "Account details and user preferences.",
  },
];

const ProfilePanel = () => {
  return (
    <Card className="glass max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserRound className="h-5 w-5 text-secondary" />
          Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-border/30 bg-muted/40 p-4">
          <p className="text-sm text-muted-foreground">Signed in as</p>
          <p className="text-lg font-semibold">CodeViz User</p>
          <Badge variant="secondary" className="mt-2">Active</Badge>
        </div>
        <p className="text-sm text-muted-foreground">User profile controls can be expanded here.</p>
      </CardContent>
    </Card>
  );
};

export const Dashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("editor");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentCode, setCurrentCode] = useState(`// Welcome to CodeViz AI!\nfunction fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\nconsole.log(fibonacci(10));`);
  const [currentLanguage, setCurrentLanguage] = useState("javascript");
  const [currentMode, setCurrentMode] = useState<"simplified" | "technical">("simplified");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const requestedTab = params.get("tab");
    if (requestedTab && navItems.some((item) => item.id === requestedTab)) {
      setActiveTab(requestedTab);
    }
  }, [location.search]);

  useEffect(() => {
    const handleSwitchToMLInsights = () => setActiveTab("ml-insights");
    window.addEventListener("switchToMLInsights", handleSwitchToMLInsights);
    return () => window.removeEventListener("switchToMLInsights", handleSwitchToMLInsights);
  }, []);

  const activeTabObj = tabs.find((tab) => tab.id === activeTab);
  const ActiveComponent = activeTabObj?.component || CodeEditor;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          <aside
            className={cn(
              "transition-all duration-300 sticky top-6 self-start",
              sidebarCollapsed ? "w-16" : "w-64"
            )}
          >
            <Card className="glass">
              <CardContent className="p-3">
                <div className="flex justify-end mb-4">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setSidebarCollapsed((prev) => !prev)}
                  >
                    {sidebarCollapsed ? ">" : "<"}
                  </Button>
                </div>

                <nav className="space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-left",
                          isActive
                            ? "bg-secondary text-secondary-foreground shadow-md"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        {!sidebarCollapsed && <span className="font-medium">{item.name}</span>}
                        {!sidebarCollapsed && isActive && (
                          <div className={cn(badgeVariants({ variant: "outline" }), "ml-auto")}>Active</div>
                        )}
                      </button>
                    );
                  })}
                </nav>

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

          <main className="flex-1 animate-fade-in">
            {activeTab === "profile" ? (
              <ProfilePanel />
            ) : activeTab === "editor" ? (
              <CodeEditor
                onCodeChange={setCurrentCode}
                onLanguageChange={setCurrentLanguage}
                onModeChange={setCurrentMode}
                initialCode={currentCode}
                initialLanguage={currentLanguage}
              />
            ) : activeTab === "patterns" ? (
              <PatternRecognitionPanel code={currentCode} language={currentLanguage} />
            ) : activeTab === "ml-insights" ? (
              <AnalysisInsightsPanel code={currentCode} language={currentLanguage} />
            ) : activeTab === "analyze" ? (
              <AnalysisPanel code={currentCode} language={currentLanguage} mode={currentMode} />
            ) : activeTab === "tools" ? (
              <ToolsPanel
                code={currentCode}
                language={currentLanguage}
                onExampleLoad={(code, language) => {
                  setCurrentCode(code);
                  setCurrentLanguage(language);
                  setActiveTab("editor");
                }}
              />
            ) : (
              <ActiveComponent code={currentCode} language={currentLanguage} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
