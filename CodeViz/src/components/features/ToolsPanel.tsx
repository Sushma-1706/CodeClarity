import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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

// Tools
const tools = [
  { id: "sandbox", name: "Live Sandbox", icon: TestTube, description: "Execute code safely", status: "ready" },
  { id: "version-compare", name: "Version Compare", icon: ArrowLeftRight, description: "Track code changes", status: "active" },
  { id: "refactor", name: "Code Refactor", icon: RefreshCw, description: "Optimize performance", status: "ready" },
  { id: "test-generator", name: "Test Generator", icon: Puzzle, description: "Auto-generate tests", status: "ready" },
  { id: "quiz", name: "Quiz Generator", icon: Trophy, description: "Practice questions", status: "ready" },
  { id: "git-integration", name: "Git Integration", icon: Github, description: "Import from repository", status: "ready" }
];

const codeVersions = [
  { version: "v1.0", timestamp: "2 hours ago", changes: "Initial implementation" },
  { version: "v1.1", timestamp: "1 hour ago", changes: "Added error handling" },
  { version: "v1.2", timestamp: "30 min ago", changes: "Performance optimization" },
];

const tags = ["recursion", "fibonacci", "dynamic-programming", "algorithms", "optimization"];

// Quiz Questions
const quizQuestions = [
  {
    q: "What is the base case in recursion?",
    options: ["A condition to stop recursion", "A loop counter", "A cache variable", "An infinite call"],
    answer: 0,
  },
  {
    q: "Which technique avoids recomputation in recursion?",
    options: ["Iteration", "Brute Force", "Memoization", "Randomization"],
    answer: 2,
  },
];

export const ToolsPanel = () => {
  const [activeTab, setActiveTab] = useState("tools");
  const [quizOpen, setQuizOpen] = useState(false);
  const [versionCompareOpen, setVersionCompareOpen] = useState(false); // NEW STATE
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number | null }>({});

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
                    onClick={() => {
                      if (tool.id === "quiz") {
                        setQuizOpen(true);
                      }
                      if (tool.id === "version-compare") {
                        setVersionCompareOpen(true);
                      }
                    }}
                  >
                    Launch Tool
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Version Compare Modal */}
      <Dialog
        open={versionCompareOpen}
        onOpenChange={(open) => setVersionCompareOpen(open)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Version Compare</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {codeVersions.map((ver, idx) => (
              <div key={ver.version} className="border rounded p-3 flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{ver.version}</span>
                  <span className="text-xs text-muted-foreground">{ver.timestamp}</span>
                </div>
                <span className="text-sm">{ver.changes}</span>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setVersionCompareOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quiz Modal */}
      <Dialog
        open={quizOpen}
        onOpenChange={(open) => {
          setQuizOpen(open);
          if (!open) setSelectedAnswers({});
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Quiz Generator</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {quizQuestions.map((q, i) => (
              <div key={i} className="space-y-2">
                <p className="font-medium">{i + 1}. {q.q}</p>
                <div className="flex flex-col gap-1">
                  {q.options.map((opt, j) => {
                    const isSelected = selectedAnswers[i] === j;
                    const isCorrect = q.answer === j;
                    const answered = selectedAnswers[i] !== undefined;

                    return (
                      <Button
                        key={j}
                        variant={isCorrect && answered ? "secondary" : isSelected ? "destructive" : "outline"}
                        size="sm"
                        className={`justify-start ${
                          answered
                            ? isCorrect
                              ? "border-green-500 text-green-600"
                              : isSelected
                              ? "border-red-500 text-red-600"
                              : ""
                            : ""
                        }`}
                        disabled={answered}
                        onClick={() => {
                          setSelectedAnswers((prev) => ({
                            ...prev,
                            [i]: j,
                          }));
                        }}
                      >
                        {opt}
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setQuizOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
