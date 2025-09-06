import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { Extension } from '@codemirror/state';

/**
 * Maps language IDs to their corresponding CodeMirror language extensions
 * @param languageId - The language identifier (javascript, python, java, cpp, c)
 * @returns Array of CodeMirror extensions for the specified language
 */
export const getLanguageExtension = (languageId: string): Extension[] => {
  switch (languageId.toLowerCase()) {
    case 'javascript':
    case 'js':
      return [javascript({ jsx: true })];
    case 'python':
    case 'py':
      return [python()];
    case 'java':
      return [java()];
    case 'cpp':
    case 'c++':
      return [cpp()];
    case 'c':
      // C++ extension also supports C
      return [cpp()];
    default:
      // Return empty array for plaintext (no highlighting)
      return [];
  }
};

/**
 * Get a display name for the language based on syntax highlighting availability
 * @param languageId - The language identifier
 * @returns Object with language name and whether highlighting is supported
 */
export const getLanguageInfo = (languageId: string) => {
  const extensions = getLanguageExtension(languageId);
  const isSupported = extensions.length > 0;
  
  return {
    isSupported,
    displayName: isSupported ? languageId : `${languageId} (plain text)`,
  };
};

/**
 * Return a small, sensible boilerplate example for the given language.
 * Keep these snippets short and focused so they fit the editor preview.
 */
export const getLanguageBoilerplate = (languageId: string): string => {
  switch (languageId.toLowerCase()) {
    case 'javascript':
    case 'js':
      return `// Welcome to CodeViz AI!\nfunction fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\nconsole.log(fibonacci(10));`;
    case 'python':
    case 'py':
      return `# Welcome to CodeViz AI!\ndef fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n - 1) + fibonacci(n - 2)\n\nprint(fibonacci(10))`;
    case 'java':
      return `// Welcome to CodeViz AI!\npublic class Main {\n    public static int fibonacci(int n) {\n        if (n <= 1) return n;\n        return fibonacci(n - 1) + fibonacci(n - 2);\n    }\n\n    public static void main(String[] args) {\n        System.out.println(fibonacci(10));\n    }\n}`;
    case 'cpp':
    case 'c++':
      return `// Welcome to CodeViz AI!\n#include <iostream>\nusing namespace std;\n\nint fibonacci(int n) {\n    if (n <= 1) return n;\n    return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\nint main() {\n    cout << fibonacci(10) << endl;\n    return 0;\n}`;
    case 'c':
      return `// Welcome to CodeViz AI!\n#include <stdio.h>\n\nint fibonacci(int n) {\n    if (n <= 1) return n;\n    return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\nint main() {\n    printf("%d\\n", fibonacci(10));\n    return 0;\n}`;
    default:
      return `// Welcome to CodeViz AI!\n// Start typing your code here...`;
  }
};
