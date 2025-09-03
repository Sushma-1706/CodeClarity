import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Play, 
  Upload, 
  Copy, 
  Download, 
  Settings,
  FileText,
  Brain,
  Lightbulb,
  Zap,
  Code2,
  Palette,
  Save,
  Loader2,
  RefreshCw,
  Eye
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
  { id: "simplified", name: "Simplified", icon: Lightbulb, description: "For beginners" },
  { id: "technical", name: "Technical", icon: Brain, description: "For advanced users" },
];

// Default code templates for each language
const defaultCodeTemplates = {
  javascript: `// Simple Hello World Program
function greet(name = "World") {
  console.log(\`Hello, \${name}!\`);
}

// Call the function
greet();
greet("Developer");`,
  python: `# Simple Hello World Program
def greet(name="World"):
    print(f"Hello, {name}!")

# Call the function
greet()
greet("Developer")`,
  java: `// Simple Hello World Program
public class HelloWorld {
    public static void greet(String name) {
        System.out.println("Hello, " + name + "!");
    }
    
    public static void main(String[] args) {
        greet("World");
        greet("Developer");
    }
}`,
  cpp: `// Simple Hello World Program
#include <iostream>
#include <string>

void greet(const std::string& name = "World") {
    std::cout << "Hello, " << name << "!" << std::endl;
}

int main() {
    greet();
    greet("Developer");
    return 0;
}`,
  c: `// Simple Hello World Program
#include <stdio.h>
#include <string.h>

void greet(const char* name) {
    printf("Hello, %s!\\n", name);
}

int main() {
    greet("World");
    greet("Developer");
    return 0;
}`
};

interface CodeEditorProps {
  code?: string;
  setCode?: (code: string) => void;
  selectedLanguage?: string;
  setSelectedLanguage?: (language: string) => void;
  currentLine?: number;
  selectedMode?: string;
  setSelectedMode?: (mode: string) => void;
  onAnalyze?: () => void;
  onRun?: () => void;
  onVisualize?: () => void;
  onCodeChange?: (code: string, language: string) => void;
}

export const CodeEditor = ({ 
  code, 
  setCode, 
  selectedLanguage, 
  setSelectedLanguage, 
  currentLine, 
  selectedMode, 
  setSelectedMode, 
  onAnalyze, 
  onRun, 
  onVisualize,
  onCodeChange
}: CodeEditorProps) => {
  // Uncontrolled fallbacks so the component works standalone
  const [internalCode, setInternalCode] = useState<string>(code ?? defaultCodeTemplates.javascript);
  const [internalLanguage, setInternalLanguage] = useState<string>(selectedLanguage ?? "javascript");
  const [internalMode, setInternalMode] = useState<string>(selectedMode ?? "simplified");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());

  const effectiveCode = code ?? internalCode;
  const updateCode = setCode ?? setInternalCode;
  const effectiveLanguage = selectedLanguage ?? internalLanguage;
  const updateLanguage = setSelectedLanguage ?? setInternalLanguage;
  const effectiveMode = selectedMode ?? internalMode;
  const updateMode = setSelectedMode ?? setInternalMode;

  // Update internal state when props change
  useEffect(() => {
    if (code !== undefined) {
      setInternalCode(code);
    }
    if (selectedLanguage !== undefined) {
      setInternalLanguage(selectedLanguage);
    }
    if (selectedMode !== undefined) {
      setInternalMode(selectedMode);
    }
  }, [code, selectedLanguage, selectedMode]);

  // Notify parent of code changes
  useEffect(() => {
    if (onCodeChange) {
      onCodeChange(effectiveCode, effectiveLanguage);
    }
  }, [effectiveCode, effectiveLanguage, onCodeChange]);

  const handleLanguageChange = (language: string) => {
    updateLanguage(language);
    // Update code to match new language
    const newCode = defaultCodeTemplates[language as keyof typeof defaultCodeTemplates];
    updateCode(newCode);
    setLastSaved(new Date());
  };

  const handleCodeChange = (newCode: string) => {
    updateCode(newCode);
    setLastSaved(new Date());
  };

  const handleReset = () => {
    const newCode = defaultCodeTemplates[effectiveLanguage as keyof typeof defaultCodeTemplates];
    updateCode(newCode);
    setLastSaved(new Date());
  };

  const handleAnalyze = async () => {
    if (onAnalyze) {
      setIsAnalyzing(true);
      try {
        await onAnalyze();
      } finally {
        setIsAnalyzing(false);
      }
    } else {
      // Navigate to AI Analysis tab
      window.location.hash = '#analysis';
      // You could add a toast notification here
      console.log("Redirecting to AI Analysis");
    }
  };

  const handleRun = () => {
    if (onRun) {
      onRun();
    } else {
      // Navigate to Code Visualizer tab
      window.location.hash = '#visualizer';
      // You could add a toast notification here
      console.log("Redirecting to Code Visualizer");
    }
  };

  const handleVisualize = () => {
    if (onVisualize) {
      onVisualize();
    } else {
      // Navigate to Visualization Panel tab
      window.location.hash = '#visualization';
      // You could add a toast notification here
      console.log("Redirecting to Visualization Panel");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(effectiveCode);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleDownload = () => {
    const extension = effectiveLanguage === 'javascript' ? 'js' : 
                     effectiveLanguage === 'python' ? 'py' : 
                     effectiveLanguage === 'java' ? 'java' : 
                     effectiveLanguage === 'cpp' ? 'cpp' : 'c';
    
    const blob = new Blob([effectiveCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        updateCode(content);
        setLastSaved(new Date());
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Language and Mode Selection */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Language:</span>
          <div className="flex gap-2">
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => handleLanguageChange(lang.id)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium transition-all duration-200",
                  effectiveLanguage === lang.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", lang.color)} />
                  {lang.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Mode:</span>
          <div className="flex gap-2">
            {modes.map((mode) => {
              const Icon = mode.icon;
              return (
                <button
                  key={mode.id}
                  onClick={() => updateMode(mode.id)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-2",
                    effectiveMode === mode.id
                      ? "bg-secondary text-secondary-foreground shadow-md"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  <Icon className="w-3 h-3" />
                  {mode.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Code Editor */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Code2 className="h-5 w-5" />
              Code Editor
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="text-xs"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Reset
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="text-xs"
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="text-xs"
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".js,.py,.java,.cpp,.c,.txt"
                  onChange={handleUpload}
                  className="hidden"
                />
                <Button variant="outline" size="sm" className="text-xs">
                  <Upload className="h-4 w-4 mr-1" />
                  Upload
                </Button>
              </label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Textarea
              value={effectiveCode}
              onChange={(e) => handleCodeChange(e.target.value)}
              placeholder="Enter your code here..."
              className="min-h-[400px] font-mono text-sm resize-none border-0 focus:ring-2 focus:ring-primary/20"
              spellCheck={false}
            />
            {currentLine && (
              <div className="absolute top-0 right-4 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
                Line {currentLine}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          onClick={handleRun}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
          size="lg"
        >
          <Play className="h-4 w-4 mr-2" />
          Run Code
        </Button>
        
        <Button
          onClick={handleVisualize}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
          size="lg"
        >
          <Eye className="h-4 w-4 mr-2" />
          Visualize
        </Button>
        
        <Button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2"
          size="lg"
        >
          {isAnalyzing ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Brain className="h-4 w-4 mr-2" />
          )}
          {isAnalyzing ? "Analyzing..." : "AI Analysis"}
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {effectiveCode.split('\n').length}
            </div>
            <div className="text-sm text-muted-foreground">Lines of Code</div>
          </CardContent>
        </Card>
        
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {effectiveCode.split('function').length - 1 + effectiveCode.split('def ').length - 1 + effectiveCode.split('void ').length - 1}
            </div>
            <div className="text-sm text-muted-foreground">Functions</div>
          </CardContent>
        </Card>
        
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {effectiveCode.split('class ').length - 1}
            </div>
            <div className="text-sm text-muted-foreground">Classes</div>
          </CardContent>
        </Card>
        
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {effectiveCode.split('if ').length - 1 + effectiveCode.split('while ').length - 1 + effectiveCode.split('for ').length - 1}
            </div>
            <div className="text-sm text-muted-foreground">Control Flow</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};