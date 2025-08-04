import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  GitBranch,
  TestTube,
  Puzzle,
  RefreshCw,
  ArrowLeftRight,
  History,
  FileQuestion,
  Trophy,
  Github,
  Download,
  Share2,
  Bookmark,
  Tag
} from "lucide-react";
import { cn } from "@/lib/utils";

const tools = [
  { 
    id: "sandbox", 
    name: "Live Sandbox", 
    icon: TestTube, 
    description: "Execute code safely",
    status: "ready"
  },
  { 
    id: "version-compare", 
    name: "Version Compare", 
    icon: ArrowLeftRight, 
    description: "Track code changes",
    status: "active"
  },
  { 
    id: "refactor", 
    name: "Code Refactor", 
    icon: RefreshCw, 
    description: "Optimize performance",
    status: "ready"
  },
  { 
    id: "test-generator", 
    name: "Test Generator", 
    icon: Puzzle, 
    description: "Auto-generate tests",
    status: "ready"
  },
  { 
    id: "quiz", 
    name: "Quiz Generator", 
    icon: Trophy, 
    description: "Practice questions",
    status: "ready"
  },
  { 
    id: "git-integration", 
    name: "Git Integration", 
    icon: Github, 
    description: "Import from repository",
    status: "ready"
  }
];

const codeVersions = [
  { version: "v1.0", timestamp: "2 hours ago", changes: "Initial implementation" },
  { version: "v1.1", timestamp: "1 hour ago", changes: "Added error handling" },
  { version: "v1.2", timestamp: "30 min ago", changes: "Performance optimization" },
];

const tags = ["recursion", "fibonacci", "dynamic-programming", "algorithms", "optimization"];

export const ToolsPanel = () => {
  const [activeTab, setActiveTab] = useState("tools");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gradient">Developer Tools</h2>
          <p className="text-muted-foreground">Advanced features for code analysis</p>
        </div>
        
        <div className="flex items-center gap-2">
          {["tools", "history", "tags"].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab)}
              className="capitalize"
            >
              {tab === "tools" && <TestTube className="h-4 w-4 mr-2" />}
              {tab === "history" && <History className="h-4 w-4 mr-2" />}
              {tab === "tags" && <Tag className="h-4 w-4 mr-2" />}
              {tab}
            </Button>
          ))}
        </div>
      </div>

      {/* Tools Grid */}
      {activeTab === "tools" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Card key={tool.id} className="glass hover:shadow-lg transition-all duration-200 group">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Icon className="h-6 w-6 text-secondary group-hover:text-accent transition-colors" />
                    <Badge 
                      variant={tool.status === "active" ? "secondary" : "outline"}
                      className="text-xs"
                    >
                      {tool.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h3 className="font-medium">{tool.name}</h3>
                    <p className="text-sm text-muted-foreground">{tool.description}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors"
                  >
                    Launch Tool
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Version History */}
      {activeTab === "history" && (
        <Card className="glass">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <History className="h-5 w-5 text-accent" />
              Version History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {codeVersions.map((version, index) => (
              <div 
                key={version.version}
                className="flex items-center justify-between p-4 rounded-lg border border-border/20 bg-surface-muted hover:bg-surface-elevated transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-3 h-3 rounded-full",
                    index === 0 ? "bg-accent" : "bg-muted-foreground"
                  )} />
                  <div>
                    <div className="font-medium">{version.version}</div>
                    <div className="text-sm text-muted-foreground">{version.timestamp}</div>
                  </div>
                  <div className="text-sm">{version.changes}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon-sm">
                    <ArrowLeftRight className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon-sm">
                    <GitBranch className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Tags & Categories */}
      {activeTab === "tags" && (
        <Card className="glass">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Tag className="h-5 w-5 text-accent" />
              Code Concepts & Tags
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Button
                  key={tag}
                  variant="outline"
                  size="sm"
                  className="rounded-full hover:bg-secondary hover:text-secondary-foreground"
                >
                  #{tag}
                </Button>
              ))}
            </div>
            
            <div className="p-4 bg-surface-muted rounded-lg border border-border/20">
              <h4 className="font-medium mb-2">Quick Reference</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div><strong>Recursion:</strong> Function calling itself</div>
                <div><strong>Base Case:</strong> Stopping condition</div>
                <div><strong>Time Complexity:</strong> Algorithm efficiency</div>
                <div><strong>Memoization:</strong> Caching results</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="glass">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export Project
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share Link
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Bookmark className="h-4 w-4" />
              Save Session
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <FileQuestion className="h-4 w-4" />
              Generate Docs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};