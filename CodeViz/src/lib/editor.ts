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
