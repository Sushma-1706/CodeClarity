import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CodeSandbox } from '@/utils/sandbox';
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
  Sun,
  Moon,
  AlertCircle
} from "lucide-react";
import { parseCodeError, CodeError } from "@/utils/errorHandler";
import ErrorDisplay from "@/components/ErrorDisplay";
import ActionButtons from "./ActionButtons";
import OutputDisplay from "./OutputDisplay";
import { cn } from "@/lib/utils";
import { getLanguageExtension, getLanguageInfo, getLanguageBoilerplate } from "@/lib/editor";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";

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
  onCodeChange?: (code: string) => void;
  onLanguageChange?: (language: string) => void;
  initialCode?: string;
  initialLanguage?: string;
} 

interface CodeExecutionState {
  error?: CodeError;
  executing: boolean;
  output?: string;
}

export const CodeEditor = ({
  onCodeChange, 
  onLanguageChange, 
  initialCode = `// Test Cases for Error Handling
// 1. Syntax Error (Missing colon)
for i in range(10)
    print(i)

// 2. Reference Error (Undefined variable)
console.log(undefinedVariable)

// 3. Type Error
let num = 42
num.toLowerCase()`,
  initialLanguage = "javascript",
}: CodeEditorProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage);
  const [selectedMode, setSelectedMode] = useState("simplified");
  const [code, setCode] = useState(initialCode);
  const [darkMode, setDarkMode] = useState(true); // 🌙 Default Dark Theme
  const [executionState, setExecutionState] = useState<CodeExecutionState>({
    executing: false,
    error: undefined
  });

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



const sandbox = new CodeSandbox();

const executeCode = async (code: string, language: string) => {
  try {
    if (language === "javascript") {
      const result = await sandbox.executeJavaScript(code);
      return result;
    } else if (language === "python") {
      const result = await sandbox.executePython(code);
      return result;
    }
  } catch (error: any) {
    throw error;
  }
};

const handleAnalyze = async () => {
  const sandbox = new CodeSandbox();
  try {
    setExecutionState({ executing: true, error: undefined, output: undefined });
    
    let result;
    if (selectedLanguage === "javascript") {
      result = await sandbox.executeJavaScript(code);
    } else if (selectedLanguage === "python") {
      result = await sandbox.executePython(code);
    }
    
    setExecutionState(prev => ({ 
      ...prev, 
      executing: false,
      output: typeof result === 'string' ? result : JSON.stringify(result, null, 2)
    }));

    // Save current code to history
    let history = JSON.parse(localStorage.getItem("analysisHistory")) || [];
    history.push({
      code,
      language: selectedLanguage,
      timestamp: new Date().toLocaleString()
    });
    localStorage.setItem("analysisHistory", JSON.stringify(history));

    // Call backend/analysis logic here
    onCodeChange?.(code);
    setExecutionState({ executing: false, error: undefined });
  } catch (error: any) {
    const parsedError = parseCodeError(error, selectedLanguage);
    setExecutionState({
      executing: false,
      error: parsedError
    });
  }
};

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {executionState.error && (
        <div className="mb-4 animate-in fade-in-50 duration-300">
          <ErrorDisplay 
            error={executionState.error} 
            className="shadow-lg"
          />
        </div>
      )}
      
      {/* Output Display */}
      {executionState.output && (
        <div className="mb-4 animate-in fade-in-50 duration-300">
          <OutputDisplay 
            output={executionState.output}
            className="shadow-lg" 
          />
        </div>
      )}

      {/* Controls Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gradient">Code Editor</h2>
          <p className="text-muted-foreground">Write or paste your code here</p>
        </div>
        
        <ActionButtons 
          darkMode={darkMode}
          executing={executionState.executing}
          onAnalyze={handleAnalyze}
          onDarkModeToggle={() => setDarkMode(!darkMode)}
        />
      </div>

      {/* Language Selection */}
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
                  onClick={() => handleLanguageChange(lang.id)}
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

          {/* Comprehension Mode */}
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
                      <Icon className={cn(
                        "h-5 w-5",
                        selectedMode === mode.id ? "text-secondary" : "text-muted-foreground"
                      )} />
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

      {/* Code Editor */}
      <Card className="glass">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-accent" />
            Code Input
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Palette className="h-3 w-3" />
              {getLanguageInfo(selectedLanguage).displayName}
            </Badge>
            <Button variant="ghost" size="icon-sm">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border border-border/20 rounded-lg overflow-hidden">
            <CodeMirror
              value={code}
              height="300px"
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
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="gradient" size="lg" className="gap-2 flex-1" onClick={handleAnalyze}>
          <Zap className="h-5 w-5" />
          Analyze & Explain Code
        </Button>
        <Button variant="secondary" size="lg" className="gap-2 flex-1">
          <Play className="h-5 w-5" />
          Run in Sandbox
        </Button>
        <Button variant="accent" size="lg" className="gap-2 flex-1">
          <Brain className="h-5 w-5" />
          Generate Visualization
        </Button>
      </div>
    </div>
  );
};
