import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal, Copy, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useState } from 'react';

interface OutputDisplayProps {
  output: string;
  className?: string;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ output, className }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className={className}>
      <CardContent className="p-4 relative">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Terminal className="h-4 w-4" />
            Output
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        <ScrollArea className="h-[200px] w-full rounded-md border bg-muted p-4">
          <pre className="font-mono text-sm">
            {output}
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default OutputDisplay;
