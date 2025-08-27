// This file sets up a simple sandbox environment for code execution
import { CodeError } from '@/utils/errorHandler';

interface SandboxOptions {
  timeout?: number;
  memoryLimit?: number;
}

export class CodeSandbox {
  private readonly defaultTimeout = 5000; // 5 seconds
  private readonly defaultMemoryLimit = 50 * 1024 * 1024; // 50MB

  constructor(private options: SandboxOptions = {}) {
    this.options.timeout = options.timeout || this.defaultTimeout;
    this.options.memoryLimit = options.memoryLimit || this.defaultMemoryLimit;
  }

  async executeJavaScript(code: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        // Create a safe context for execution
        const context = {
          console: {
            log: (...args: any[]) => {
              console.log(...args);
              return args.join(' ');
            },
            error: (...args: any[]) => {
              console.error(...args);
              return args.join(' ');
            }
          },
          setTimeout,
          clearTimeout
        };

        // Wrap the code in a try-catch block
        const wrappedCode = `
          try {
            ${code}
          } catch (error) {
            throw error;
          }
        `;

        // Create a function from the code with access to the safe context
        const fn = new Function(...Object.keys(context), wrappedCode);

        // Set a timeout for execution
        const timeoutId = setTimeout(() => {
          reject(new Error('Execution timed out'));
        }, this.options.timeout);

        // Execute the code with the safe context
        const result = fn(...Object.values(context));
        clearTimeout(timeoutId);
        resolve(result);

      } catch (error: any) {
        reject(error);
      }
    });
  }

  async executePython(code: string): Promise<any> {
    // For now, we'll just do syntax checking since we don't have a Python runtime
    const lines = code.split('\n');
    let indentLevel = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();

      // Skip empty lines and comments
      if (!trimmedLine || trimmedLine.startsWith('#')) continue;

      // Check for basic Python syntax
      if (trimmedLine.match(/^(if|for|while|def|class)\s+.*[^\s:]$/)) {
        throw Object.assign(new SyntaxError('Missing colon after control statement'), { line: i + 1 });
      }

      // Check indentation
      const indent = line.match(/^\s*/)?.[0].length || 0;
      if (indent > 0 && indent !== indentLevel * 4) {
        throw Object.assign(new Error('Inconsistent indentation'), { line: i + 1 });
      }

      // Update indent level
      if (trimmedLine.endsWith(':')) {
        indentLevel++;
      } else if (i > 0 && indent === 0) {
        indentLevel = 0;
      }
    }

    return "Python code syntax check passed";
  }
}
