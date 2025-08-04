import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "./Header";
import { CodeEditor } from "../features/CodeEditor";
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
  Minimize2
} from "lucide-react";
import { cn } from "@/lib/utils";
import heroImage from "@/assets/hero-bg.jpg";

const tabs = [
  { id: "editor", name: "Code Editor", icon: Code, component: CodeEditor },
  { id: "visualize", name: "Visualization", icon: Eye, component: VisualizationPanel },
  { id: "analyze", name: "AI Analysis", icon: Brain, component: AnalysisPanel },
  { id: "tools", name: "Tools", icon: Wrench, component: ToolsPanel },
];

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("editor");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || CodeEditor;

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

                {/* Status Indicators */}
                {!sidebarCollapsed && (
                  <div className="mt-6 pt-4 border-t border-border/20">
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
              
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="ml-auto"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>

            {/* Dynamic Content */}
            <div className="animate-fade-in">
              <ActiveComponent />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};