import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import HistoryPanel from "./HistoryPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} 
from "@/components/ui/select";
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
  Tag,
  Code,
  FileCode
} from "lucide-react";
import { cn } from "@/lib/utils";
import { codeExamples } from "@/data/examples";
import { toast } from "@/components/ui/sonner";

// Tools
const tools = [
  { id: "examples", name: "Code Examples", icon: FileCode, description: "Load pre-built examples", status: "active" },
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

import { quizGeneratorService } from "@/services/quizGeneratorService";
import { testGeneratorService } from "@/services/testGeneratorService";
import { refactoringService } from "@/services/refactoringService";
import { versionComparisonService } from "@/services/versionComparisonService";
import { sandboxExecutionService } from "@/services/sandboxExecutionService";
import { conceptTaggingService } from "@/services/conceptTaggingService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ToolsPanelProps {
  code?: string;
  language?: string;
  onExampleLoad?: (code: string, language: string) => void;
}

export const ToolsPanel = ({ code = "", language = "javascript", onExampleLoad }: ToolsPanelProps = {}) => {
  const [activeTab, setActiveTab] = useState("tools");
  const [quizOpen, setQuizOpen] = useState(false);
  const [versionCompareOpen, setVersionCompareOpen] = useState(false);
  const [refactorOpen, setRefactorOpen] = useState(false);
  const [sandboxOpen, setSandboxOpen] = useState(false);
  const [testGenOpen, setTestGenOpen] = useState(false);
  const [gitImportOpen, setGitImportOpen] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number | null }>({});
  const [quiz, setQuiz] = useState<any>(null);
  const [testSuite, setTestSuite] = useState<any>(null);
  const [refactoringResult, setRefactoringResult] = useState<any>(null);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [versions, setVersions] = useState<any[]>([]);
  const [selectedVersions, setSelectedVersions] = useState<[string, string]>(["", ""]);
  const [gitRepoUrl, setGitRepoUrl] = useState("");
  const [gitFilePath, setGitFilePath] = useState("");

  const taggedCode = useMemo(() => {
    if (!code.trim()) return null;
    return conceptTaggingService.tagCode(code, language);
  }, [code, language]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gradient">Developer Tools</h2>
          <p className="text-muted-foreground">Advanced features for code analysis</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Load Example Dropdown - Allows users to select pre-written code examples */}
          <div className="w-[220px]">
            <Select
              onValueChange={(value) => {
                const example = codeExamples.find(ex => ex.id === value);
                if (example && onExampleLoad) {
                  onExampleLoad(example.code, example.language);
                }
              }}
            >
              <SelectTrigger className="w-full">
                <div className="flex items-center gap-2">
                  <FileCode className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Load Example" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {codeExamples.map((example) => (
                  <SelectItem key={example.id} value={example.id}>
                    {example.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                        if (code.trim()) {
                          const generatedQuiz = quizGeneratorService.generateQuiz(code, language);
                          setQuiz(generatedQuiz);
                          setQuizOpen(true);
                          if (!generatedQuiz.questions.length) {
                            toast.info("No quiz questions could be generated for this code.");
                          }
                        } else {
                          toast.error("Please enter some code first.");
                        }
                      } else if (tool.id === "examples") {
                        const defaultExample = codeExamples[0];
                        if (onExampleLoad && defaultExample) {
                          onExampleLoad(defaultExample.code, defaultExample.language);
                        }
                      } else if (tool.id === "version-compare") {
                        const allVersions = versionComparisonService.getVersions();
                        setVersions(allVersions);
                        setVersionCompareOpen(true);
                      } else if (tool.id === "refactor") {
                        if (code.trim()) {
                          const result = refactoringService.analyzeRefactoring(code, language);
                          setRefactoringResult(result);
                          setRefactorOpen(true);
                        } else {
                          toast.error("Please enter some code first.");
                        }
                      } else if (tool.id === "sandbox") {
                        if (code.trim()) {
                          sandboxExecutionService
                            .executeStepByStep(code, language)
                            .then(result => {
                              setExecutionResult(result);
                              setSandboxOpen(true);
                            })
                            .catch((err) => {
                              toast.error(`Sandbox failed: ${err?.message || "Unknown error"}`);
                            });
                        } else {
                          toast.error("Please enter some code first.");
                        }
                      } else if (tool.id === "test-generator") {
                        if (code.trim()) {
                          const suite = testGeneratorService.generateTests(code, language);
                          setTestSuite(suite);
                          setTestGenOpen(true);
                        } else {
                          toast.error("Please enter some code first.");
                        }
                      } else if (tool.id === "git-integration") {
                        setGitImportOpen(true);
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
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Version Comparison</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {versions.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Version 1</label>
                    <Select value={selectedVersions[0]} onValueChange={(val) => setSelectedVersions([val, selectedVersions[1]])}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select version" />
                      </SelectTrigger>
                      <SelectContent>
                        {versions.map((v) => (
                          <SelectItem key={v.id} value={v.id}>
                            {v.id} - {new Date(v.timestamp).toLocaleString()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Version 2</label>
                    <Select value={selectedVersions[1]} onValueChange={(val) => setSelectedVersions([selectedVersions[0], val])}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select version" />
                      </SelectTrigger>
                      <SelectContent>
                        {versions.map((v) => (
                          <SelectItem key={v.id} value={v.id}>
                            {v.id} - {new Date(v.timestamp).toLocaleString()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {selectedVersions[0] && selectedVersions[1] && (
                  <div className="mt-4">
                    <Button onClick={() => {
                      const v1 = versions.find(v => v.id === selectedVersions[0]);
                      const v2 = versions.find(v => v.id === selectedVersions[1]);
                      if (v1 && v2) {
                        const diff = versionComparisonService.compareVersions(v1, v2);
                        toast.success(`Diff ready: ${diff.added.length} added, ${diff.removed.length} removed, ${diff.modified.length} modified.`);
                      }
                    }}>Compare Versions</Button>
                  </div>
                )}
                <div className="space-y-2">
                  <h4 className="font-medium">Version History</h4>
                  {versions.slice(-10).reverse().map((ver) => (
                    <div key={ver.id} className="border rounded p-3 flex flex-col gap-1">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{ver.id}</span>
                        <span className="text-xs text-muted-foreground">{new Date(ver.timestamp).toLocaleString()}</span>
                      </div>
                      {ver.changes && ver.changes.length > 0 && (
                        <div className="text-sm">
                          {ver.changes.map((change: string, idx: number) => (
                            <Badge key={idx} variant="outline" className="mr-1">{change}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No version history yet. Save versions by analyzing code.</p>
                <Button className="mt-4" onClick={() => {
                  if (code.trim()) {
                    versionComparisonService.saveVersion(code, language, "Manual save");
                    const updated = versionComparisonService.getVersions();
                    setVersions(updated);
                    toast.success("Current version saved.");
                  }
                }}>Save Current Version</Button>
              </div>
            )}
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
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Quiz Generator</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {quiz?.questions.map((q: any, i: number) => (
              <div key={i} className="space-y-2">
                <p className="font-medium">{i + 1}. {q.question}</p>
                <div className="flex flex-col gap-1">
                  {q.options.map((opt: string, j: number) => {
                    const isSelected = selectedAnswers[i] === j;
                    const isCorrect = q.correctAnswer === j;
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
                {selectedAnswers[i] !== undefined && (
                  <div className="mt-2 p-2 bg-muted rounded text-sm">
                    <strong>Explanation:</strong> {q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setQuizOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Refactoring Modal */}
      <Dialog open={refactorOpen} onOpenChange={setRefactorOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Refactoring Suggestions</DialogTitle>
          </DialogHeader>
          {refactoringResult && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{refactoringResult.overallImprovement}</p>
              {refactoringResult.suggestions.map((suggestion: any) => (
                <Card key={suggestion.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="original">
                      <TabsList>
                        <TabsTrigger value="original">Original</TabsTrigger>
                        <TabsTrigger value="refactored">Refactored</TabsTrigger>
                        <TabsTrigger value="improvements">Improvements</TabsTrigger>
                      </TabsList>
                      <TabsContent value="original">
                        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
                          {suggestion.originalCode}
                        </pre>
                      </TabsContent>
                      <TabsContent value="refactored">
                        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
                          {suggestion.refactoredCode}
                        </pre>
                      </TabsContent>
                      <TabsContent value="improvements">
                        <ul className="list-disc list-inside space-y-1">
                          {suggestion.improvements.map((imp: string, idx: number) => (
                            <li key={idx} className="text-sm">{imp}</li>
                          ))}
                        </ul>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium">Before: {suggestion.complexityBefore.time} time, {suggestion.complexityBefore.space} space</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">After: {suggestion.complexityAfter.time} time, {suggestion.complexityAfter.space} space</p>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setRefactorOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sandbox Execution Modal */}
      <Dialog open={sandboxOpen} onOpenChange={setSandboxOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sandbox Execution</DialogTitle>
          </DialogHeader>
          {executionResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted rounded">
                  <p className="text-sm font-medium">Execution Time</p>
                  <p className="text-lg">{executionResult.executionTime}ms</p>
                </div>
                <div className="p-3 bg-muted rounded">
                  <p className="text-sm font-medium">Steps</p>
                  <p className="text-lg">{executionResult.steps.length}</p>
                </div>
              </div>
              {executionResult.error && (
                <div className="p-3 bg-destructive/10 border border-destructive rounded">
                  <p className="text-sm text-destructive">Error: {executionResult.error}</p>
                </div>
              )}
              {executionResult.finalOutput && (
                <div className="p-3 bg-success/10 border border-success rounded">
                  <p className="text-sm font-medium">Output:</p>
                  <pre className="text-sm mt-1">{executionResult.finalOutput}</pre>
                </div>
              )}
              <div className="space-y-2">
                <h4 className="font-medium">Execution Steps:</h4>
                {executionResult.steps.slice(0, 20).map((step: any) => (
                  <div key={step.step} className="p-2 bg-muted rounded text-sm">
                    <div className="flex items-center gap-2">
                      <Badge>Step {step.step}</Badge>
                      <span className="text-xs text-muted-foreground">Line {step.lineNumber}</span>
                    </div>
                    <code className="text-xs block mt-1">{step.code}</code>
                    {Object.keys(step.variables).length > 0 && (
                      <div className="mt-1 text-xs">
                        Variables: {JSON.stringify(step.variables)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setSandboxOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Test Generator Modal */}
      <Dialog open={testGenOpen} onOpenChange={setTestGenOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Test Case Generator</DialogTitle>
          </DialogHeader>
          {testSuite && (
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded">
                <p className="text-sm font-medium">Function: {testSuite.functionName || "N/A"}</p>
                <p className="text-sm text-muted-foreground">Language: {testSuite.language}</p>
              </div>
              <div className="space-y-2">
                {testSuite.testCases.map((testCase: any) => (
                  <Card key={testCase.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{testCase.name}</h4>
                        <Badge variant="outline">{testCase.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{testCase.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>Input:</strong> {JSON.stringify(testCase.input)}
                        </div>
                        <div>
                          <strong>Expected:</strong> {JSON.stringify(testCase.expectedOutput)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-4">
                <h4 className="font-medium mb-2">Generated Test Code:</h4>
                <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
                  {testGeneratorService.generateTestCode(testSuite)}
                </pre>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setTestGenOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Git Integration Modal */}
      <Dialog open={gitImportOpen} onOpenChange={setGitImportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Git Repository Import</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Repository URL</label>
              <input
                type="text"
                placeholder="https://github.com/username/repo"
                className="w-full mt-1 p-2 border rounded"
                value={gitRepoUrl}
                onChange={(e) => setGitRepoUrl(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">File Path</label>
              <input
                type="text"
                placeholder="src/main.js"
                className="w-full mt-1 p-2 border rounded"
                value={gitFilePath}
                onChange={(e) => setGitFilePath(e.target.value)}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Note: Git integration requires backend API. This is a placeholder for future implementation.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGitImportOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              if (!gitRepoUrl.trim()) {
                toast.error("Please enter a repository URL.");
                return;
              }
              toast.info("Git integration is a placeholder in this frontend-only build.");
              setGitImportOpen(false);
              setGitRepoUrl("");
              setGitFilePath("");
            }}>Import</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* History Tab */}
      {activeTab === "history" && (
        <HistoryPanel />
      )}

      {/* Tags Tab */}
      {activeTab === "tags" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Concept Tags</CardTitle>
            </CardHeader>
            <CardContent>
              {code.trim() ? (
                taggedCode ? (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">{taggedCode.summary}</p>
                      <div className="space-y-2">
                        {taggedCode.tags.map((tag) => (
                          <div key={tag.id} className="p-3 border rounded">
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="secondary">{tag.name}</Badge>
                              <Badge variant="outline">{tag.category}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">{tag.description}</p>
                            <p className="text-xs">Confidence: {Math.round(tag.confidence * 100)}%</p>
                            {tag.lines.length > 0 && (
                              <p className="text-xs mt-1">Lines: {tag.lines.join(", ")}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                ) : (
                  <p className="text-muted-foreground">Unable to tag this code snippet.</p>
                )
              ) : (
                <p className="text-muted-foreground">Enter code to see concept tags</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
      
    </div>
  );
};
