import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { 
  Play, 
  Plus,
  Minus,
  Upload, 
  Copy, 
  Settings,
  FileText,
  Save,
  Sun,
  Moon,
  Maximize2,
  X,
  Trash2,
  RotateCcw,
  Terminal
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getLanguageExtension, getLanguageBoilerplate } from "@/lib/editor";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";
import { sandboxExecutionService } from "@/services/sandboxExecutionService";

const languages = [
  { id: "javascript", name: "JavaScript", color: "bg-yellow-500" },
  { id: "python", name: "Python", color: "bg-blue-500" },
  { id: "java", name: "Java", color: "bg-orange-500" },
  { id: "cpp", name: "C++", color: "bg-purple-500" },
  { id: "c", name: "C", color: "bg-gray-500" },
];

const languageNameById: Record<string, string> = {
  javascript: "JavaScript",
  python: "Python",
  java: "Java",
  cpp: "C++",
  c: "C",
};

const MIN_OUTPUT_PANEL_HEIGHT = 96;
const MAX_OUTPUT_PANEL_HEIGHT = 360;
const OUTPUT_PANEL_STEP = 24;

interface CodeEditorProps {
  onCodeChange?: (code: string) => void;
  onLanguageChange?: (language: string) => void;
  onModeChange?: (mode: "simplified" | "technical") => void;
  onRunInSandbox?: (code: string, language: string) => void;
  onGenerateVisualization?: (code: string, language: string) => void;
  initialCode?: string;
  initialLanguage?: string;
} 

export const CodeEditor = ({
  onCodeChange, 
  onLanguageChange, 
  onModeChange,
  onRunInSandbox,
  onGenerateVisualization,
  initialCode = `// Welcome to CodeViz AI!
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`,
  initialLanguage = "javascript",
}: CodeEditorProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage);
  const [code, setCode] = useState(initialCode);
  const [darkMode, setDarkMode] = useState(true); // 🌙 Default Dark Theme
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [savedFilename, setSavedFilename] = useState("codeviz-snippet");
  const [isRunning, setIsRunning] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [runInput, setRunInput] = useState("");
  const [inputQueue, setInputQueue] = useState<string[]>([]);
  const [showOutputPanel, setShowOutputPanel] = useState(false);
  const [outputPanelHeight, setOutputPanelHeight] = useState(112);
  const editorCardRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    onModeChange?.("simplified");
  }, [onModeChange]);

  // Sync with browser fullscreen and toggle distraction-free mode
  useEffect(() => {
    const onFsChange = () => {
      const active = document.fullscreenElement === editorCardRef.current;
      setIsFullscreen(active);
      const root = document.documentElement;
      if (active) root.classList.add("no-notifications");
      else root.classList.remove("no-notifications");
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFsChange);
      document.documentElement.classList.remove("no-notifications");
    };
  }, []);

  const enterFullscreen = async () => {
    const el = editorCardRef.current as unknown as HTMLElement | null;
    if (el && el.requestFullscreen) {
      try { await el.requestFullscreen(); } catch {}
    }
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const detectLanguageFromFile = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const langMap: Record<string, string> = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'javascript',
      'tsx': 'javascript',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'cc': 'cpp',
      'cxx': 'cpp',
      'c': 'c',
      'h': 'c',
      'hpp': 'cpp',
    };
    return langMap[ext || ''] || selectedLanguage;
  };

  const detectLanguageFromCode = (source: string): string | null => {
    const text = source.trim();
    if (!text) return null;

    if (/^\s*#include\s*</m.test(text)) {
      if (/\b(std::|cout\s*<<|cin\s*>>|namespace\s+std)\b/m.test(text)) return "cpp";
      return "c";
    }

    if (/\bpublic\s+class\s+\w+\b/m.test(text) || /\bSystem\.out\.println\s*\(/m.test(text)) {
      return "java";
    }

    if (/^\s*def\s+\w+\s*\(/m.test(text) || /^\s*import\s+\w+/m.test(text)) {
      return "python";
    }

    if (/\bconsole\.log\s*\(/m.test(text) || /\b(function|const|let|var)\b/m.test(text)) {
      return "javascript";
    }

    return null;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const detectedLang = detectLanguageFromFile(file.name);
    if (detectedLang !== selectedLanguage) {
      setSelectedLanguage(detectedLang);
      onLanguageChange?.(detectedLang);
    }

    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      setCode(text);
      onCodeChange?.(text);
    };
    reader.readAsText(file);
    // reset so same file can be re-selected
    event.target.value = "";
  };

  const exitFullscreen = async () => {
    if (document.fullscreenElement) {
      try { await document.exitFullscreen(); } catch {}
    }
  };

  // Replace boilerplate only when the current editor content equals the
  // default boilerplate for the previous language. This avoids overwriting
  // user edits while still providing helpful templates for new users.
  const handleLanguageChange = (langId: string) => {
    const prevTemplate = getLanguageBoilerplate(selectedLanguage);
    const newTemplate = getLanguageBoilerplate(langId);

    // If the user hasn't modified the previous template, swap in the new one
    if (code.trim() === prevTemplate.trim()) {
      setCode(newTemplate);
      onCodeChange?.(newTemplate);
    }

    setSelectedLanguage(langId);
    onLanguageChange?.(langId);
  };

  const getFileExtension = (language: string) => {
    const map: Record<string, string> = {
      javascript: "js",
      python: "py",
      java: "java",
      cpp: "cpp",
      c: "c",
    };
    return map[language] || "txt";
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard");
    } catch {
      toast.error("Unable to copy code");
    }
  };

  const handleSaveCode = () => {
    const safeName = savedFilename.trim() || "codeviz-snippet";
    const extension = getFileExtension(selectedLanguage);
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${safeName}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Saved as ${safeName}.${extension}`);
  };

  const handleClearEditor = () => {
    setCode("");
    onCodeChange?.("");
    toast.success("Editor cleared");
  };

  const handleResetTemplate = () => {
    const template = getLanguageBoilerplate(selectedLanguage);
    setCode(template);
    onCodeChange?.(template);
    toast.success("Template restored");
  };

  const handleRunCode = async () => {
    if (!code.trim()) {
      toast.error("Editor is empty");
      return;
    }

    let executionLanguage = selectedLanguage;
    const detectedLanguage = detectLanguageFromCode(code);
    if (detectedLanguage && detectedLanguage !== selectedLanguage) {
      executionLanguage = detectedLanguage;
      setSelectedLanguage(detectedLanguage);
      onLanguageChange?.(detectedLanguage);
      toast.info(`Detected ${languageNameById[detectedLanguage]} code. Switched run language automatically.`);
    }

    setIsRunning(true);
    setShowOutputPanel(true);
    try {
      onRunInSandbox?.(code, executionLanguage);

      const queuedInputs = runInput.trim()
        ? [...inputQueue, runInput.trim()]
        : [...inputQueue];

      const result = await sandboxExecutionService.executeStepByStep(code, executionLanguage, queuedInputs);

      const outputLines = result.finalOutput
        ? result.finalOutput.split("\n")
        : ["(no output)"];

      const renderedInput = queuedInputs.map((entry) => `> ${entry}`);
      const finalLines = [
        ...renderedInput,
        ...outputLines,
        result.error ? `Error: ${result.error}` : `[Finished in ${result.executionTime}ms]`,
      ];

      setTerminalLines(finalLines);
      setRunInput("");
      setInputQueue([]);

      if (result.error) {
        toast.error(`Run failed: ${result.error}`);
      } else {
        toast.success("Run completed");
      }
    } catch {
      toast.error("Unable to run code");
    } finally {
      setIsRunning(false);
    }
  };

  const handleQueueInput = () => {
    const value = runInput.trim();
    if (!value) return;
    setInputQueue((prev) => [...prev, value]);
    setRunInput("");
  };

  const clearTerminal = () => {
    setTerminalLines([]);
    setInputQueue([]);
    setRunInput("");
    setShowOutputPanel(false);
  };

  const decreaseOutputPanelSize = () => {
    setOutputPanelHeight((current) => Math.max(MIN_OUTPUT_PANEL_HEIGHT, current - OUTPUT_PANEL_STEP));
  };

  const increaseOutputPanelSize = () => {
    setOutputPanelHeight((current) => Math.min(MAX_OUTPUT_PANEL_HEIGHT, current + OUTPUT_PANEL_STEP));
  };

  return (
    <div className="space-y-6">
      {/* Controls Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gradient">Code Editor</h2>
          <p className="text-muted-foreground">Write or paste your code here</p>
        </div>
        
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".txt,.js,.ts,.jsx,.tsx,.py,.java,.c,.cpp,.hpp,.h"
            onChange={handleFileChange}
          />
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleFileUploadClick}
          >
            <Upload className="h-4 w-4" />
            Upload File
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={handleSaveCode}>
            <Save className="h-4 w-4" />
            Save
          </Button>
          <Button variant="secondary" size="sm" className="gap-2" onClick={() => setSettingsOpen(true)}>
            <Settings className="h-4 w-4" />
            Settings
          </Button>

          {/* 🌙 / ☀️ Theme Toggle */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? (
              <>
                <Sun className="h-4 w-4 text-yellow-400" />
                Light Mode
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 text-blue-400" />
                Dark Mode
              </>
            )}
          </Button>
        </div>
      </div>

             {/* Code Editor */}
       <Card
         ref={editorCardRef}
         className={cn(
           "glass",
           isFullscreen && "fixed inset-0 z-50 m-0 rounded-none border-0 bg-background shadow-none flex flex-col"
         )}
       >
         <CardHeader
           className={cn(
             "flex flex-row items-center justify-between pb-3",
             isFullscreen && "p-6 pb-4 sticky top-0 z-20 bg-background border-b border-border/20"
           )}
         >
           <CardTitle className="text-lg flex items-center gap-2">
             <FileText className="h-5 w-5 text-accent" />
             Code Input
           </CardTitle>
           <div className="flex items-center gap-2">
             <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
               <SelectTrigger className="h-8 w-[140px]">
                 <SelectValue placeholder="Language" />
               </SelectTrigger>
               <SelectContent>
                 {languages.map((lang) => (
                   <SelectItem key={lang.id} value={lang.id}>
                     {lang.name}
                   </SelectItem>
                 ))}
               </SelectContent>
             </Select>
             <Button
               variant="secondary"
               size="sm"
               className="gap-2"
               onClick={handleRunCode}
               disabled={isRunning}
               title="Run code"
             >
               <Play className="h-4 w-4" />
               {isRunning ? "Running..." : "Run"}
             </Button>
             <Button 
               variant="ghost" 
               size="icon-sm"
               onClick={handleCopyCode}
               title="Copy code"
             >
               <Copy className="h-4 w-4" />
             </Button>
             {isFullscreen ? (
               <Button
                 variant="ghost"
                 size="icon-sm"
                 onClick={exitFullscreen}
                 title="Exit full screen (Esc)"
               >
                 <X className="h-4 w-4" />
               </Button>
             ) : (
               <Button
                 variant="ghost"
                 size="icon-sm"
                 onClick={enterFullscreen}
                 title="Full screen"
               >
                 <Maximize2 className="h-4 w-4" />
               </Button>
             )}
           </div>
         </CardHeader>
         <CardContent className={cn(isFullscreen && "flex-1 p-6 pt-4 flex flex-col min-h-0")}> 
           <div className={cn(
             "border border-border/20 rounded-lg overflow-hidden",
             isFullscreen ? "flex-1 min-h-0 bg-[#1e1e1e]" : ""
           )}>
             <CodeMirror
               value={code}
               height={isFullscreen ? "100%" : showOutputPanel ? "56vh" : "calc(100vh - 220px)"}
              extensions={getLanguageExtension(selectedLanguage)}
              onChange={(value) => {
                setCode(value);
                onCodeChange?.(value);
              }}
              theme={darkMode ? vscodeDark : vscodeLight} // 🌙/☀️ toggle
              basicSetup={{
                lineNumbers: true,
                foldGutter: true,
                dropCursor: true,
                allowMultipleSelections: true,
                indentOnInput: true,
                bracketMatching: true,
                closeBrackets: true,
                autocompletion: true,
                highlightSelectionMatches: true,
              }}
              placeholder="Paste your code here or start typing..."
            />
          </div>

          {showOutputPanel && (
          <div className="mt-4 rounded-lg border border-border/30 bg-[#0f1116] shrink-0">
            <div className="flex items-center justify-between border-b border-border/20 px-3 py-2">
              <div className="flex items-center gap-2 text-xs text-zinc-300">
                <Terminal className="h-3.5 w-3.5" />
                Output
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="h-7 w-7"
                  onClick={decreaseOutputPanelSize}
                  disabled={outputPanelHeight <= MIN_OUTPUT_PANEL_HEIGHT}
                  title="Decrease output panel size"
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="h-7 w-7"
                  onClick={increaseOutputPanelSize}
                  disabled={outputPanelHeight >= MAX_OUTPUT_PANEL_HEIGHT}
                  title="Increase output panel size"
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={clearTerminal}>
                  Clear
                </Button>
              </div>
            </div>

            <div
              className="overflow-auto px-3 py-2 font-mono text-xs text-zinc-200"
              style={{ height: `${outputPanelHeight}px` }}
            >
              {terminalLines.length > 0 ? (
                terminalLines.map((line, idx) => (
                  <div key={`${line}-${idx}`}>{line}</div>
                ))
              ) : (
                <div className="text-zinc-500">Run your code to see output...</div>
              )}
            </div>

            <div className="border-t border-border/20 px-3 py-2 flex items-center gap-2">
              <input
                value={runInput}
                onChange={(e) => setRunInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleQueueInput();
                  }
                }}
                className="h-8 flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-2 text-xs text-zinc-100"
                placeholder="Type runtime input and press Enter"
              />
              <Button variant="outline" size="sm" onClick={handleQueueInput}>Add Input</Button>
            </div>
          </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editor Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">File name for Save</label>
              <input
                value={savedFilename}
                onChange={(e) => setSavedFilename(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="codeviz-snippet"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 gap-2" onClick={handleResetTemplate}>
                <RotateCcw className="h-4 w-4" />
                Reset Template
              </Button>
              <Button variant="destructive" className="flex-1 gap-2" onClick={handleClearEditor}>
                <Trash2 className="h-4 w-4" />
                Clear Editor
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
