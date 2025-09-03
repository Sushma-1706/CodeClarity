import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "./Header";
import { CodeEditor } from "../features/CodeEditor";
import { CodeVisualizer } from "../features/CodeVisualizer";
import { VisualizationPanel } from "../features/VisualizationPanel";
import { AnalysisPanel } from "../features/AnalysisPanel";
import { ToolsPanel } from "../features/ToolsPanel";
import { 
  Code, 
  Eye, 
  Brain, 
  Wrench,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Play,
  Zap,
  TrendingUp,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import heroImage from "@/assets/hero-bg.jpg";

const tabs = [
  { id: "editor", name: "Code Editor", icon: Code, component: CodeEditor },
  { id: "visualizer", name: "Code Visualizer", icon: Play, component: CodeVisualizer },
  { id: "visualize", name: "Visualization", icon: Eye, component: VisualizationPanel },
  { id: "analyze", name: "AI Analysis", icon: Brain, component: AnalysisPanel },
  { id: "tools", name: "Tools", icon: Wrench, component: ToolsPanel },
];

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("editor");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Shared state for all components
  const [sharedCode, setSharedCode] = useState(`# Python Hello World Program
def greet(name="World"):
    print(f"Hello, {name}!")

# Call the function
greet()
greet("Developer")`);
  const [sharedLanguage, setSharedLanguage] = useState("python");
  const [sharedMode, setSharedMode] = useState<"simplified" | "technical">("simplified");
  const [codeStats, setCodeStats] = useState({
    lines: 0,
    functions: 0,
    classes: 0,
    controlFlow: 0
  });

  // Handle hash-based navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash === 'visualizer') {
        setActiveTab('visualizer');
      } else if (hash === 'visualization') {
        setActiveTab('visualize');
      } else if (hash === 'analysis') {
        setActiveTab('analyze');
      } else if (hash === 'tools') {
        setActiveTab('tools');
      }
    };

    // Handle initial hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update code stats when code changes
  useEffect(() => {
    const lines = sharedCode.split('\n').length;
    const functions = (sharedCode.match(/function|def |void /g) || []).length;
    const classes = (sharedCode.match(/class /g) || []).length;
    const controlFlow = (sharedCode.match(/if |while |for |elif /g) || []).length;
    
    setCodeStats({ lines, functions, classes, controlFlow });
  }, [sharedCode]);

  const handleCodeChange = (code: string, language: string) => {
    setSharedCode(code);
    setSharedLanguage(language);
  };

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || CodeEditor;

  // Render the active component with shared props
  const renderActiveComponent = () => {
    switch (activeTab) {
      case "editor":
        return (
          <CodeEditor
            code={sharedCode}
            setCode={setSharedCode}
            selectedLanguage={sharedLanguage}
            setSelectedLanguage={setSharedLanguage}
            selectedMode={sharedMode}
            setSelectedMode={setSharedMode}
            onCodeChange={handleCodeChange}
          />
        );
      case "visualizer":
        return (
          <CodeVisualizer
            code={sharedCode}
            language={sharedLanguage}
            mode={sharedMode}
            onCodeChange={handleCodeChange}
          />
        );
      case "visualize":
        return (
          <VisualizationPanel
            code={sharedCode}
            language={sharedLanguage}
            mode={sharedMode}
          />
        );
      case "analyze":
        return (
          <AnalysisPanel
            code={sharedCode}
            language={sharedLanguage}
            mode={sharedMode}
          />
        );
      case "tools":
        return (
          <ToolsPanel
            code={sharedCode}
            language={sharedLanguage}
            mode={sharedMode}
            onCodeChange={handleCodeChange}
          />
        );
      default:
        return <CodeEditor />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <div className="relative h-32 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/90" />
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gradient">
              AI-Powered Code Visualization
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Transform complex code into interactive visualizations and explanations
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
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

                {/* Code Statistics */}
                {!sidebarCollapsed && (
                  <div className="mt-6 pt-4 border-t border-border/20">
                    <div className="space-y-3">
                      <div className="text-xs font-medium text-muted-foreground">Code Statistics</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <Code className="h-3 w-3 text-blue-600" />
                          <span>{codeStats.lines}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="h-3 w-3 text-green-600" />
                          <span>{codeStats.functions}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-purple-600" />
                          <span>{codeStats.classes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Activity className="h-3 w-3 text-orange-600" />
                          <span>{codeStats.controlFlow}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Status Indicators */}
                {!sidebarCollapsed && (
                  <div className="mt-4 pt-4 border-t border-border/20">
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <Badge variant="secondary" className="text-xs">Ready</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">AI Engine</span>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                          <span className="text-success">Online</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Language</span>
                        <Badge variant="outline" className="text-xs capitalize">
                          {sharedLanguage}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Mode</span>
                        <Badge 
                          variant={sharedMode === 'simplified' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {sharedMode === 'simplified' ? '🎓 Simplified' : '⚡ Technical'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </aside>

          {/* Main Content Area */}
          <main className={cn(
            "flex-1 transition-all duration-300",
            isFullscreen && "fixed inset-0 z-50 bg-background p-6"
          )}>
            {/* Content Header */}
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
              
              <div className="flex items-center gap-3">
                {/* Quick Actions */}
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {sharedLanguage.toUpperCase()}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {sharedMode}
                  </Badge>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="ml-auto"
                >
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Dynamic Content */}
            <div className="animate-fade-in">
              {renderActiveComponent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};