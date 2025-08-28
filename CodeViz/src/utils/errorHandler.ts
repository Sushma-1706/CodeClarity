export interface CodeError {
  type: string;
  message: string;
  line?: number;
  hint?: string;
}

export class CodeErrorHandler {
  static handleSyntaxError(error: SyntaxError): CodeError {
    const errorMessage = error.message;
    const lineMatch = errorMessage.match(/line (\d+)/);
    const line = lineMatch ? parseInt(lineMatch[1]) : undefined;

    return {
      type: 'SyntaxError',
      message: this.formatErrorMessage(errorMessage),
      line,
      hint: this.getSyntaxErrorHint(errorMessage)
    };
  }

  static handleTypeError(error: TypeError): CodeError {
    return {
      type: 'TypeError',
      message: this.formatErrorMessage(error.message),
      hint: 'Check if you\'re using variables and functions correctly.'
    };
  }

  static handleNameError(error: Error): CodeError {
    return {
      type: 'NameError',
      message: this.formatErrorMessage(error.message),
      hint: 'Make sure all variables and functions are defined before use.'
    };
  }

  static handleIndentationError(error: Error): CodeError {
    return {
      type: 'IndentationError',
      message: this.formatErrorMessage(error.message),
      hint: 'Check your code indentation. Each code block should be indented consistently.'
    };
  }

  static handleUnsupportedFeature(): CodeError {
    return {
      type: 'UnsupportedFeature',
      message: '⚠️ This code uses a feature not yet supported by CodeClarity.',
      hint: 'Try using a simpler or alternative approach.'
    };
  }

  private static formatErrorMessage(message: string): string {
    // Remove technical details and make the message more user-friendly
    return message
      .replace(/^[^:]+: /, '')
      .replace(/\(.+?\)/, '')
      .trim();
  }

  private static getSyntaxErrorHint(errorMessage: string): string {
    const commonErrors: Record<string, string> = {
      'Missing colon': 'Add a colon (:) after the control statement. Example: if condition:',
      'Unexpected token': 'Check for missing or extra parentheses, brackets, or quotes. Common fixes:\n- Add missing closing brackets\n- Remove extra semicolons in Python\n- Check string quote marks',
      'Invalid syntax': 'Review your code syntax. Common issues:\n- Missing parentheses in function calls\n- Invalid operator usage\n- Incorrect function definition',
      'EOF while scanning': 'Check for unclosed quotes or parentheses. Make sure all opening brackets have matching closing brackets.',
      'expected indented block': 'Add proper indentation (4 spaces or 1 tab) after this line.',
      'undefined': 'Make sure the variable or function is defined before using it.',
      'toLowerCase': 'Check if you\'re calling a method on the correct type of value.',
      'inconsistent indentation': 'Use consistent indentation (either spaces or tabs, not both).'
    };

    for (const [pattern, hint] of Object.entries(commonErrors)) {
      if (errorMessage.includes(pattern)) {
        return hint;
      }
    }

    return 'Check your code syntax and try again.';
  }
}

import { getLanguageSpecificError } from './languageErrors';

export function parseCodeError(error: Error, language: string = 'javascript'): CodeError {
  // Get language-specific error message if available
  const errorMessage = getLanguageSpecificError(error, language);

  if (error.name === 'SyntaxError') {
    return CodeErrorHandler.handleSyntaxError(error as SyntaxError);
  } else if (error.name === 'TypeError') {
    return CodeErrorHandler.handleTypeError(error as TypeError);
  } else if (error.name === 'ReferenceError') {
    return CodeErrorHandler.handleNameError(error);
  } else if (error.message.includes('indentation')) {
    return CodeErrorHandler.handleIndentationError(error);
  } else if (error.message.includes('unsupported')) {
    return CodeErrorHandler.handleUnsupportedFeature();
  }

  return {
    type: 'Error',
    message: error.message,
    hint: 'Please check your code and try again.'
  };
}
