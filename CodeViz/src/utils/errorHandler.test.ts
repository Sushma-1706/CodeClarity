import { parseCodeError } from './errorHandler';
import { getLanguageSpecificError } from './languageErrors';

describe('Error Handler Tests', () => {
  // JavaScript Error Scenarios
  describe('JavaScript Errors', () => {
    test('Syntax Error - Missing Parenthesis', () => {
      const error = new SyntaxError('Unexpected token }');
      const result = parseCodeError(error, 'javascript');
      expect(result.type).toBe('SyntaxError');
      expect(result.hint).toContain('Check for missing or extra parentheses');
    });

    test('Reference Error - Undefined Variable', () => {
      const error = new ReferenceError('undefinedVar is not defined');
      const result = parseCodeError(error, 'javascript');
      expect(result.type).toBe('NameError');
      expect(result.hint).toContain('Make sure all variables');
    });

    test('Type Error - Invalid Method Call', () => {
      const error = new TypeError('Cannot read property \'toLowerCase\' of undefined');
      const result = parseCodeError(error, 'javascript');
      expect(result.type).toBe('TypeError');
      expect(result.hint).toContain('Check if you\'re using variables');
    });
  });

  // Python Error Scenarios
  describe('Python Errors', () => {
    test('Syntax Error - Missing Colon', () => {
      const error = new SyntaxError('invalid syntax (missing colon)');
      const result = parseCodeError(error, 'python');
      expect(result.type).toBe('SyntaxError');
      expect(result.hint).toContain('Add a colon');
    });

    test('Indentation Error', () => {
      const error = new Error('inconsistent indentation');
      const result = parseCodeError(error, 'python');
      expect(result.type).toBe('IndentationError');
      expect(result.hint).toContain('indentation');
    });

    test('Name Error - Undefined Variable', () => {
      const error = new ReferenceError('name \'undefined_var\' is not defined');
      const result = parseCodeError(error, 'python');
      expect(result.type).toBe('NameError');
      expect(result.message).toContain('undefined_var');
    });
  });

  // Language Specific Error Tests
  describe('Language Specific Errors', () => {
    test('JavaScript undefined function call', () => {
      const error = new TypeError('undefined is not a function');
      const message = getLanguageSpecificError(error, 'javascript');
      expect(message).toContain('not a function');
    });

    test('Python indentation error', () => {
      const error = new Error('indentation error');
      const message = getLanguageSpecificError(error, 'python');
      expect(message).toContain('indentation');
    });
  });

  // Edge Cases
  describe('Edge Cases', () => {
    test('Unknown Language', () => {
      const error = new Error('test error');
      const result = parseCodeError(error, 'unknown');
      expect(result.type).toBe('Error');
      expect(result.message).toBeDefined();
    });

    test('Empty Error Message', () => {
      const error = new Error('');
      const result = parseCodeError(error, 'javascript');
      expect(result.message).toBeDefined();
      expect(result.hint).toBeDefined();
    });

    test('Null Error Message', () => {
      const error = new Error();
      const result = parseCodeError(error, 'javascript');
      expect(result.message).toBeDefined();
      expect(result.hint).toBeDefined();
    });
  });
});
