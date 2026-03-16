import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Database, 
  Link, 
  List, 
  GitBranch, 
  Network,
  Layers,
  ArrowRight,
  Circle,
  Square,
  Triangle
} from "lucide-react";
import { CodeExecutionStep } from "@/lib/aiService";
import { cn } from "@/lib/utils";

interface DataStructureVisualizerProps {
  dataStructures: any[];
  stepNumber: number;
  totalSteps: number;
}

const getStructureIcon = (type: string) => {
  switch (type) {
    case 'linkedlist': return <Link className="h-5 w-5" />;
    case 'array': return <List className="h-5 w-5" />;
    case 'tree': return <GitBranch className="h-5 w-5" />;
    case 'graph': return <Network className="h-5 w-5" />;
    case 'stack': return <Layers className="h-5 w-5" />;
    case 'queue': return <Layers className="h-5 w-5" />;
    default: return <Database className="h-5 w-5" />;
  }
};

const getStructureColor = (type: string): string => {
  const colors: Record<string, string> = {
    'linkedlist': 'text-blue-600',
    'array': 'text-green-600',
    'tree': 'text-purple-600',
    'graph': 'text-orange-600',
    'stack': 'text-indigo-600',
    'queue': 'text-pink-600'
  };
  return colors[type] || 'text-gray-600';
};

const renderLinkedList = (data: any) => {
  if (!data.head) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Circle className="h-16 w-16 mx-auto mb-2 opacity-50" />
        <p>Empty Linked List</p>
      </div>
    );
  }

  const nodes: any[] = [];
  let current = data.head;
  let index = 0;

  while (current && index < 20) { // Prevent infinite loops
    nodes.push(current);
    current = current.next;
    index++;
  }

  return (
    <div className="flex items-center justify-center py-6 overflow-x-auto">
      <div className="flex items-center gap-2">
        {nodes.map((node, i) => (
          <div key={i} className="flex items-center">
            {/* Node */}
            <div className="relative">
              <div className="w-12 h-12 bg-blue-100 border-2 border-blue-300 rounded-lg flex items-center justify-center font-mono text-sm font-bold text-blue-700">
                {node.data}
              </div>
              {/* Node label */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground">
                Node {i}
              </div>
            </div>
            
            {/* Arrow to next node */}
            {i < nodes.length - 1 && (
              <div className="flex items-center gap-1 mx-2">
                <ArrowRight className="h-4 w-4 text-blue-400" />
              </div>
            )}
          </div>
        ))}
        
        {/* End marker */}
        <div className="flex items-center gap-2 ml-2">
          <ArrowRight className="h-4 w-4 text-blue-400" />
          <div className="w-8 h-8 bg-gray-100 border-2 border-gray-300 rounded-lg flex items-center justify-center text-xs text-gray-500">
            null
          </div>
        </div>
      </div>
    </div>
  );
};

const renderArray = (data: any) => {
  if (!Array.isArray(data)) return null;
  
  return (
    <div className="flex items-center justify-center py-6 overflow-x-auto">
      <div className="flex items-center gap-1">
        {data.map((item: any, index: number) => (
          <div key={index} className="relative">
            <div className="w-12 h-12 bg-green-100 border-2 border-green-300 rounded-lg flex items-center justify-center font-mono text-sm font-bold text-green-700">
              {item}
            </div>
            {/* Index label */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground">
              [{index}]
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const renderTree = (data: any) => {
  if (!data.root) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <GitBranch className="h-16 w-16 mx-auto mb-2 opacity-50" />
        <p>Empty Tree</p>
      </div>
    );
  }

  // Simple tree visualization for demo
  return (
    <div className="flex items-center justify-center py-6">
      <div className="text-center">
        {/* Root */}
        <div className="w-12 h-12 bg-purple-100 border-2 border-purple-300 rounded-lg flex items-center justify-center font-mono text-sm font-bold text-purple-700 mx-auto mb-4">
          {data.root.value || data.root.data || 'R'}
        </div>
        
        {/* Children */}
        <div className="flex items-center justify-center gap-8">
          {data.root.left && (
            <div className="text-center">
              <div className="w-10 h-10 bg-purple-100 border-2 border-purple-300 rounded-lg flex items-center justify-center font-mono text-xs font-bold text-purple-700 mb-2">
                {data.root.left.value || data.root.left.data || 'L'}
              </div>
              <div className="text-xs text-muted-foreground">Left</div>
            </div>
          )}
          
          {data.root.right && (
            <div className="text-center">
              <div className="w-10 h-10 bg-purple-100 border-2 border-purple-300 rounded-lg flex items-center justify-center font-mono text-xs font-bold text-purple-700 mb-2">
                {data.root.right.value || data.root.right.data || 'R'}
              </div>
              <div className="text-xs text-muted-foreground">Right</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const renderStack = (data: any) => {
  if (!data.items || !Array.isArray(data.items)) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Layers className="h-16 w-16 mx-auto mb-2 opacity-50" />
        <p>Empty Stack</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-6">
      <div className="flex flex-col-reverse items-center gap-1">
        {data.items.map((item: any, index: number) => (
          <div key={index} className="w-16 h-8 bg-indigo-100 border-2 border-indigo-300 rounded-lg flex items-center justify-center font-mono text-sm font-bold text-indigo-700">
            {item}
          </div>
        ))}
        {data.items.length === 0 && (
          <div className="w-16 h-8 bg-gray-100 border-2 border-gray-300 rounded-lg flex items-center justify-center text-xs text-gray-500">
            Empty
          </div>
        )}
      </div>
    </div>
  );
};

const renderQueue = (data: any) => {
  if (!data.items || !Array.isArray(data.items)) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Layers className="h-16 w-16 mx-auto mb-2 opacity-50" />
        <p>Empty Queue</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-6">
      <div className="flex items-center gap-1">
        {data.items.map((item: any, index: number) => (
          <div key={index} className="relative">
            <div className="w-12 h-8 bg-pink-100 border-2 border-pink-300 rounded-lg flex items-center justify-center font-mono text-sm font-bold text-pink-700">
              {item}
            </div>
            {/* Position label */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground">
              {index === 0 ? 'Front' : index === data.items.length - 1 ? 'Back' : index}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const renderDataStructure = (structure: any) => {
  switch (structure.type) {
    case 'linkedlist':
      return renderLinkedList(structure.data);
    case 'array':
      return renderArray(structure.data);
    case 'tree':
      return renderTree(structure.data);
    case 'stack':
      return renderStack(structure.data);
    case 'queue':
      return renderQueue(structure.data);
    default:
      return (
        <div className="text-center py-8 text-muted-foreground">
          <Database className="h-16 w-16 mx-auto mb-2 opacity-50" />
          <p>Unsupported data structure type: {structure.type}</p>
        </div>
      );
  }
};

export const DataStructureVisualizer = ({ dataStructures, stepNumber }: DataStructureVisualizerProps) => {
  if (dataStructures.length === 0) {
    return (
      <Card className="glass">
        <CardContent className="p-6 text-center">
          <div className="space-y-3">
            <Database className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-medium">No Data Structures</h3>
            <p className="text-sm text-muted-foreground">
              No data structures to visualize in current step
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
            <Database className="h-5 w-5 text-secondary" />
            Data Structure Visualization
            <Badge variant="outline" className="ml-auto">
              Step {stepNumber}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Visual representation of data structures and their current state
          </p>
        </CardContent>
      </Card>

      {/* Structures List */}
      <div className="space-y-4">
        {dataStructures.map((structure, index) => (
          <Card key={index} className="glass">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                {getStructureIcon(structure.type)}
                <span className="font-semibold capitalize">
                  {structure.type.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <Badge variant="secondary" className="ml-auto">
                  {structure.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {renderDataStructure(structure)}
              
              {/* Metadata */}
              {structure.metadata && (
                <div className="mt-4 pt-4 border-t border-border/20">
                  <div className="text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span>Size:</span>
                      <Badge variant="outline" className="text-xs">
                        {structure.metadata.size || 'Unknown'}
                      </Badge>
                    </div>
                    {structure.metadata.complexity && (
                      <div className="flex items-center gap-2 mt-1">
                        <span>Complexity:</span>
                        <Badge variant="outline" className="text-xs">
                          {structure.metadata.complexity}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <Card className="glass">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Structures:</span>
            <Badge variant="outline">{dataStructures.length}</Badge>
          </div>
          
          {/* Type Distribution */}
          <div className="mt-3 space-y-2">
            <span className="text-sm text-muted-foreground">Structure Types:</span>
            <div className="flex flex-wrap gap-2">
              {Object.entries(
                dataStructures.reduce((acc, structure) => {
                  acc[structure.type] = (acc[structure.type] || 0) + 1;
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
