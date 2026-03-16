import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Variable, 
  Type, 
  Hash,
  Code2,
  Database,
  List,
  Link
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VariableTrackerProps {
  variables: Record<string, any>;
  stepNumber: number;
}

const getVariableIcon = (value: any) => {
  if (Array.isArray(value)) return <List className="h-4 w-4" />;
  if (typeof value === 'object' && value !== null) {
    if (value.type === 'LinkedList' || value.type === 'Node') return <Link className="h-4 w-4" />;
    if (value.type === 'Stack' || value.type === 'Queue') return <Database className="h-4 w-4" />;
    return <Database className="h-4 w-4" />;
  }
  if (typeof value === 'string') return <Hash className="h-4 w-4" />;
  if (typeof value === 'number') return <Hash className="h-4 w-4" />;
  if (typeof value === 'boolean') return <Type className="h-4 w-4" />;
  return <Variable className="h-4 w-4" />;
};

const getVariableType = (value: any): string => {
  if (Array.isArray(value)) return 'Array';
  if (typeof value === 'object' && value !== null) {
    if (value.type) return value.type;
    return 'Object';
  }
  return typeof value;
};

const formatVariableValue = (value: any): string => {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  
  if (typeof value === 'object' && value !== null) {
    if (value.type === 'LinkedList') {
      if (!value.head) return 'LinkedList { head: null }';
      return `LinkedList { head: Node(${value.head.data}) }`;
    }
    if (value.type === 'Node') {
      return `Node(${value.data})`;
    }
    if (Array.isArray(value)) {
      return `[${value.slice(0, 3).join(', ')}${value.length > 3 ? '...' : ''}]`;
    }
    return JSON.stringify(value, null, 2).substring(0, 100);
  }
  
  if (typeof value === 'string') return `"${value}"`;
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'boolean') return value.toString();
  
  return String(value);
};

const getVariableColor = (type: string): string => {
  const colors: Record<string, string> = {
    'string': 'text-green-600',
    'number': 'text-blue-600',
    'boolean': 'text-purple-600',
    'Array': 'text-orange-600',
    'LinkedList': 'text-indigo-600',
    'Node': 'text-indigo-500',
    'Object': 'text-gray-600',
    'null': 'text-red-600',
    'undefined': 'text-gray-500'
  };
  return colors[type] || 'text-gray-600';
};

export const VariableTracker = ({ variables, stepNumber }: VariableTrackerProps) => {
  const variableEntries = Object.entries(variables);

  if (variableEntries.length === 0) {
    return (
      <Card className="glass">
        <CardContent className="p-6 text-center">
          <div className="space-y-3">
            <Variable className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-medium">No Variables</h3>
            <p className="text-sm text-muted-foreground">
              No variables defined in current step
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Variable className="h-5 w-5 text-secondary" />
            Variable State
            <Badge variant="outline" className="ml-auto">
              Step {stepNumber}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Current variable values and their types at this execution step
          </p>
        </CardContent>
      </Card>

      {/* Variables List */}
      <Card className="glass">
        <CardContent className="p-0">
          <ScrollArea className="h-64">
            <div className="p-4 space-y-3">
              {variableEntries.map(([name, value]) => {
                const type = getVariableType(value);
                const formattedValue = formatVariableValue(value);
                const color = getVariableColor(type);
                
                return (
                  <div
                    key={name}
                    className="border border-border/20 rounded-lg p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      {/* Variable Name and Icon */}
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {getVariableIcon(value)}
                        <span className="font-mono font-semibold text-foreground">
                          {name}
                        </span>
                      </div>
                      
                      {/* Type Badge */}
                      <Badge variant="secondary" className="text-xs flex-shrink-0">
                        {type}
                      </Badge>
                    </div>
                    
                    {/* Variable Value */}
                    <div className="mt-2">
                      <div className={cn("font-mono text-sm break-all", color)}>
                        {formattedValue}
                      </div>
                    </div>
                    
                    {/* Additional Info for Complex Types */}
                    {typeof value === 'object' && value !== null && !Array.isArray(value) && (
                      <div className="mt-2 pt-2 border-t border-border/20">
                        <div className="text-xs text-muted-foreground">
                          {value.type === 'LinkedList' && value.head && (
                            <div className="flex items-center gap-1">
                              <span>Length:</span>
                              <span className="font-mono">
                                {value.head ? 1 + (value.head.next ? 1 : 0) + (value.head.next?.next ? 1 : 0) : 0}
                              </span>
                            </div>
                          )}
                          {value.type === 'Node' && (
                            <div className="flex items-center gap-1">
                              <span>Next:</span>
                              <span className="font-mono">
                                {value.next ? '→ Node' : 'null'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="glass">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Variables:</span>
            <Badge variant="outline">{variableEntries.length}</Badge>
          </div>
          
          {/* Type Distribution */}
          <div className="mt-3 space-y-2">
            <span className="text-sm text-muted-foreground">Type Distribution:</span>
            <div className="flex flex-wrap gap-2">
              {Object.entries(
                variableEntries.reduce((acc, [_, value]) => {
                  const type = getVariableType(value);
                  acc[type] = (acc[type] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([type, count]) => (
                <Badge key={type} variant="secondary" className="text-xs">
                  {type}: {count}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
