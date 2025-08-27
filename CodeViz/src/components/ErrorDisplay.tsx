import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CodeError } from '@/utils/errorHandler';
import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
  error: CodeError;
  className?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, className }) => {
  return (
    <Alert variant="destructive" className={className}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{error.type}</AlertTitle>
      <AlertDescription className="mt-2">
        <div className="space-y-2">
          <p>{error.message}</p>
          {error.line && (
            <p className="text-sm">
              Line {error.line}
            </p>
          )}
          {error.hint && (
            <p className="text-sm text-muted-foreground">
              💡 Hint: {error.hint}
            </p>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ErrorDisplay;
