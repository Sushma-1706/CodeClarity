import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wrench, 
  Code2, 
  Palette, 
  FileText, 
  Download,
  Upload,
  Settings,
  RefreshCw,
  Play,
  Stop,
  RotateCcw,
  Zap,
  Eye,
  Brain,
  GitBranch,
  Layers,
  TrendingUp,
  Activity,
  Clock,
  HardDrive,
  CheckCircle,
  AlertTriangle,
  Lightbulb
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolsPanelProps {
  code?: string;
  language?: string;
  mode?: "simplified" | "technical";
  onCodeChange?: (code: string, language: string) => void;
}

export const ToolsPanel = ({ 
  code = "", 
  language = "python", 
  mode = "simplified",
  onCodeChange 
}: ToolsPanelProps) => {
  const [activeTool, setActiveTool] = useState("formatter");
  const [isProcessing, setIsProcessing] = useState(false);
  const [formattedCode, setFormattedCode] = useState("");
  const [minifiedCode, setMinifiedCode] = useState("");
  const [convertedCode, setConvertedCode] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("javascript");
  const [codeMetrics, setCodeMetrics] = useState({
    lines: 0,
    characters: 0,
    words: 0,
    functions: 0,
    classes: 0,
    comments: 0
  });

  // Update metrics when code changes
  useEffect(() => {
    if (code.trim()) {
      updateCodeMetrics();
    }
  }, [code]);

  const updateCodeMetrics = () => {
    const lines = code.split('\n');
    const characters = code.length;
    const words = code.split(/\s+/).filter(word => word.length > 0).length;
    const functions = (code.match(/def |function |void /g) || []).length;
    const classes = (code.match(/class /g) || []).length;
    const comments = (code.match(/#|\/\/|\/\*/g) || []).length;

    setCodeMetrics({ lines, characters, words, functions, classes, comments });
  };

  const formatCode = async () => {
    if (!code.trim()) return;
    
    setIsProcessing(true);
    try {
      // Simulate formatting
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const formatted = code
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n');
      
      setFormattedCode(formatted);
    } finally {
      setIsProcessing(false);
    }
  };

  const minifyCode = async () => {
    if (!code.trim()) return;
    
    setIsProcessing(true);
    try {
      // Simulate minification
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const minified = code
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0 && !line.startsWith('#'))
        .join('; ');
      
      setMinifiedCode(minified);
    } finally {
      setIsProcessing(false);
    }
  };

  const convertLanguage = async () => {
    if (!code.trim()) return;
    
    setIsProcessing(true);
    try {
      // Simulate language conversion
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let converted = "";
      if (language === "python" && targetLanguage === "javascript") {
        converted = code
          .replace(/def /g, 'function ')
          .replace(/print\(/g, 'console.log(')
          .replace(/:/g, ' {')
          .replace(/\n(\s+)/g, '\n$1');
      } else if (language === "javascript" && targetLanguage === "python") {
        converted = code
          .replace(/function /g, 'def ')
          .replace(/console\.log\(/g, 'print(')
          .replace(/{/g, ':')
          .replace(/}/g, '');
      } else {
        converted = `// Converted from ${language} to ${targetLanguage}\n${code}`;
      }
      
      setConvertedCode(converted);
    } finally {
      setIsProcessing(false);
    }
  };

  const applyFormattedCode = () => {
    if (formattedCode && onCodeChange) {
      onCodeChange(formattedCode, language);
    }
  };

  const applyConvertedCode = () => {
    if (convertedCode && onCodeChange) {
      onCodeChange(convertedCode, targetLanguage);
    }
  };

  const downloadCode = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Wrench className="h-6 w-6 text-orange-600" />
          <h2 className="text-2xl font-bold">Code Tools</h2>
          <Badge variant="outline">{language.toUpperCase()}</Badge>
          <Badge variant="secondary">{mode}</Badge>
        </div>
      </div>

      {/* Code Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {codeMetrics.lines}
            </div>
            <div className="text-sm text-muted-foreground">Lines</div>
          </CardContent>
        </Card>
        
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {codeMetrics.characters}
            </div>
            <div className="text-sm text-muted-foreground">Characters</div>
          </CardContent>
        </Card>
        
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {codeMetrics.words}
            </div>
            <div className="text-sm text-muted-foreground">Words</div>
          </CardContent>
        </Card>
        
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {codeMetrics.functions}
            </div>
            <div className="text-sm text-muted-foreground">Functions</div>
          </CardContent>
        </Card>
        
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {codeMetrics.classes}
            </div>
            <div className="text-sm text-muted-foreground">Classes</div>
          </CardContent>
        </Card>
        
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {codeMetrics.comments}
            </div>
            <div className="text-sm text-muted-foreground">Comments</div>
          </CardContent>
        </Card>
      </div>

      {/* Tools Tabs */}
      <Tabs value={activeTool} onValueChange={setActiveTool} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="formatter" className="flex items-center gap-2">
            <Code2 className="h-4 w-4" />
            Formatter
          </TabsTrigger>
          <TabsTrigger value="minifier" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Minifier
          </TabsTrigger>
          <TabsTrigger value="converter" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Converter
          </TabsTrigger>
          <TabsTrigger value="analyzer" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analyzer
          </TabsTrigger>
        </TabsList>

        <TabsContent value="formatter" className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="h-5 w-5" />
                Code Formatter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
                <Button
                  onClick={formatCode}
                  disabled={isProcessing || !code.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isProcessing ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Code2 className="h-4 w-4 mr-2" />
                  )}
                  Format Code
                </Button>
                
                {formattedCode && (
                  <>
                    <Button
                      onClick={applyFormattedCode}
                      variant="outline"
                    >
                      Apply
                    </Button>
                    <Button
                      onClick={() => downloadCode(formattedCode, `formatted.${language === 'python' ? 'py' : 'js'}`)}
                      variant="outline"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
            <Button
                      onClick={() => copyToClipboard(formattedCode)}
                      variant="outline"
                    >
                      Copy
            </Button>
                  </>
                )}
              </div>

              {formattedCode && (
                <div className="space-y-2">
                  <Label>Formatted Code</Label>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm font-mono whitespace-pre-wrap">{formattedCode}</pre>
        </div>
      </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="minifier" className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Code Minifier
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Button
                  onClick={minifyCode}
                  disabled={isProcessing || !code.trim()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isProcessing ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Palette className="h-4 w-4 mr-2" />
                  )}
                  Minify Code
                </Button>
                
                {minifiedCode && (
                  <>
                    <Button
                      onClick={() => downloadCode(minifiedCode, `minified.${language === 'python' ? 'py' : 'js'}`)}
                      variant="outline"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      onClick={() => copyToClipboard(minifiedCode)}
                      variant="outline"
                    >
                      Copy
                    </Button>
                  </>
                )}
              </div>

              {minifiedCode && (
                <div className="space-y-2">
                  <Label>Minified Code</Label>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm font-mono">{minifiedCode}</pre>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Size reduction: {Math.round(((code.length - minifiedCode.length) / code.length) * 100)}%
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="converter" className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Language Converter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>From Language</Label>
                  <div className="p-3 bg-muted rounded-lg">
                    <Badge variant="outline" className="text-sm">
                      {language.toUpperCase()}
                    </Badge>
                  </div>
                  </div>
                
                <div className="space-y-2">
                  <Label>To Language</Label>
                  <select
                    value={targetLanguage}
                    onChange={(e) => setTargetLanguage(e.target.value)}
                    className="w-full p-3 bg-muted rounded-lg border border-border"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="c">C</option>
                  </select>
                </div>
        </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={convertLanguage}
                  disabled={isProcessing || !code.trim() || language === targetLanguage}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isProcessing ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4 mr-2" />
                  )}
                  Convert Code
                </Button>
                
                {convertedCode && (
                  <>
                    <Button
                      onClick={applyConvertedCode}
                      variant="outline"
                    >
                      Apply
                    </Button>
                    <Button
                      onClick={() => downloadCode(convertedCode, `converted.${targetLanguage === 'python' ? 'py' : 'js'}`)}
                      variant="outline"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                      <Button
                      onClick={() => copyToClipboard(convertedCode)}
                      variant="outline"
                    >
                      Copy
                      </Button>
                  </>
                )}
              </div>

              {convertedCode && (
                <div className="space-y-2">
                  <Label>Converted Code</Label>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm font-mono whitespace-pre-wrap">{convertedCode}</pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analyzer" className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Code Quality Analyzer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Code Structure */}
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Structure Analysis
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Functions</span>
                      <Badge variant={codeMetrics.functions > 0 ? "default" : "secondary"}>
                        {codeMetrics.functions}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Classes</span>
                      <Badge variant={codeMetrics.classes > 0 ? "default" : "secondary"}>
                        {codeMetrics.classes}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Comments</span>
                      <Badge variant={codeMetrics.comments > 0 ? "default" : "secondary"}>
                        {codeMetrics.comments}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Code Quality */}
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Quality Metrics
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Readability</span>
                      <Badge variant="outline">
                        {codeMetrics.comments > 0 ? "Good" : "Could Improve"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Structure</span>
                      <Badge variant="outline">
                        {codeMetrics.functions > 0 || codeMetrics.classes > 0 ? "Good" : "Basic"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Documentation</span>
                      <Badge variant="outline">
                        {codeMetrics.comments > 0 ? "Present" : "Missing"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Recommendations
                </h4>
                <div className="space-y-2">
                  {codeMetrics.comments === 0 && (
                    <div className="flex items-center gap-2 text-sm text-yellow-700 bg-yellow-50 p-2 rounded">
                      <AlertTriangle className="h-4 w-4" />
                      Add comments to improve code readability
                    </div>
                  )}
                  {codeMetrics.functions === 0 && (
                    <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 p-2 rounded">
                      <Code2 className="h-4 w-4" />
                      Consider breaking code into functions for better organization
                    </div>
                  )}
                  {codeMetrics.lines > 20 && (
                    <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-2 rounded">
                      <CheckCircle className="h-4 w-4" />
                      Good code length - not too short, not too long
                    </div>
                  )}
                </div>
          </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
