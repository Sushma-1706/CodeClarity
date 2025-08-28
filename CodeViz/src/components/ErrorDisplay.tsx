import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CodeError } from '@/utils/errorHandler';
import { AlertCircle, Terminal, Bug, AlertTriangle, Info } from 'lucide-react';
import { cn } from "@/lib/utils";

interface ErrorDisplayProps {
  error: CodeError;
  className?: string;
}

const errorTypeConfig: Record<string, { icon: React.ElementType; color: string }> = {
  SyntaxError: { icon: Terminal, color: 'text-red-500' },
  TypeError: { icon: Bug, color: 'text-orange-500' },
  NameError: { icon: AlertTriangle, color: 'text-yellow-500' },
  IndentationError: { icon: AlertCircle, color: 'text-blue-500' },
  UnsupportedFeature: { icon: Info, color: 'text-purple-500' },
  Error: { icon: AlertCircle, color: 'text-red-500' }, // fallback
};

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, className }) => {
  const { icon: ErrorIcon, color } = errorTypeConfig[error.type] || errorTypeConfig.Error;

  return (
    <Alert 
      variant="destructive" 
      className={cn(
        "border-l-4",
        {
          'border-l-red-500': error.type === 'SyntaxError',
          'border-l-orange-500': error.type === 'TypeError',
          'border-l-yellow-500': error.type === 'NameError',
          'border-l-blue-500': error.type === 'IndentationError',
          'border-l-purple-500': error.type === 'UnsupportedFeature',
        },
        className
      )}
    >
      <div className="flex items-start gap-3">
        <ErrorIcon className={cn("h-5 w-5", color)} />
        <div className="flex-1 space-y-2">
          <AlertTitle className="flex items-center gap-2 font-semibold">
            <span>{error.type}</span>
            {error.line && (
              <span className="text-sm font-normal opacity-75">
                at line {error.line}
              </span>
            )}
          </AlertTitle>
          <AlertDescription className="space-y-3">
            <div className="rounded-md bg-destructive/20 p-3 text-[0.92rem] leading-normal">
              {error.message}
            </div>
            {error.hint && (
              <div className="flex items-start gap-2 text-sm">
                <div className="mt-0.5">💡</div>
                <div className="flex-1 opacity-85">
                  {error.hint}
                </div>
              </div>
            )}
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
};

export default ErrorDisplay;
