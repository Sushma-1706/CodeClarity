import React from 'react';
import ErrorDisplay from './ErrorDisplay';

const ErrorDisplayTest: React.FC = () => {
  const testErrors = [
    {
      type: 'SyntaxError',
      message: 'Missing colon after for loop statement',
      line: 5,
      hint: 'Add a colon (:) after the control statement'
    },
    {
      type: 'TypeError',
      message: 'Cannot read property \'toLowerCase\' of undefined',
      line: 12,
      hint: 'Make sure the variable is defined before calling methods on it'
    },
    {
      type: 'NameError',
      message: 'undefined_variable is not defined',
      line: 8,
      hint: 'Define the variable before using it'
    },
    {
      type: 'IndentationError',
      message: 'Unexpected indent at line 15',
      line: 15,
      hint: 'Use consistent indentation (4 spaces or 1 tab)'
    },
    {
      type: 'UnsupportedFeature',
      message: 'This code uses a feature not yet supported by CodeClarity',
      hint: 'Try using a simpler or alternative approach'
    }
  ];

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-6">Error Display Test Cases</h2>
      {testErrors.map((error, index) => (
        <ErrorDisplay
          key={index}
          error={error}
          className="mb-4"
        />
      ))}
    </div>
  );
};

export default ErrorDisplayTest;
