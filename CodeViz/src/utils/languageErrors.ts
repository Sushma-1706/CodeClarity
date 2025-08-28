export interface LanguageConfig {
  name: string;
  commonErrors: {
    pattern: RegExp;
    message: string;
    hint: string;
  }[];
}

export const languageConfigs: Record<string, LanguageConfig> = {
  javascript: {
    name: 'JavaScript',
    commonErrors: [
      {
        pattern: /undefined is not a function/i,
        message: 'Trying to call something that is not a function',
        hint: 'Make sure the variable you\'re trying to call is actually a function'
      },
      {
        pattern: /cannot read property .* of (undefined|null)/i,
        message: 'Trying to access a property of undefined or null',
        hint: 'Check if the object exists before accessing its properties'
      }
    ]
  },
  python: {
    name: 'Python',
    commonErrors: [
      {
        pattern: /indentation error/i,
        message: 'Incorrect indentation in code blocks',
        hint: 'Use consistent indentation (4 spaces or 1 tab) for code blocks'
      },
      {
        pattern: /name .* is not defined/i,
        message: 'Using an undefined variable',
        hint: 'Make sure to define the variable before using it'
      }
    ]
  }
};

export function getLanguageSpecificError(error: Error, language: string): string {
  const config = languageConfigs[language];
  if (!config) return error.message;

  for (const errorType of config.commonErrors) {
    if (errorType.pattern.test(error.message)) {
      return `${errorType.message}\n💡 Hint: ${errorType.hint}`;
    }
  }

  return error.message;
}
