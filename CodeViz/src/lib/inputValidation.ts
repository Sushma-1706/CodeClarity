// Input validation constants and utilities for user-provided code
// Enforces safe limits to prevent performance issues, UI freezes, and API abuse

export const INPUT_LIMITS = {
  MAX_CHARACTERS: 50_000,
  MAX_LINES: 1_000,
  WARN_CHARACTERS: 40_000, // Warn at 80% of max
  WARN_LINES: 800, // Warn at 80% of max
} as const;

export interface ValidationResult {
  isValid: boolean;
  charCount: number;
  lineCount: number;
  warnings: string[];
  errors: string[];
}

/**
 * Validates user-provided code against size limits.
 * Returns a result with warnings (approaching limits) and errors (limits exceeded).
 */
export function validateCodeInput(code: string): ValidationResult {
  const charCount = code.length;
  const lineCount = code.split("\n").length;
  const warnings: string[] = [];
  const errors: string[] = [];

  // Character limit checks
  if (charCount > INPUT_LIMITS.MAX_CHARACTERS) {
    errors.push(
      `Code exceeds the maximum of ${INPUT_LIMITS.MAX_CHARACTERS.toLocaleString()} characters (current: ${charCount.toLocaleString()}). Please reduce the input size.`
    );
  } else if (charCount > INPUT_LIMITS.WARN_CHARACTERS) {
    warnings.push(
      `Approaching character limit: ${charCount.toLocaleString()} / ${INPUT_LIMITS.MAX_CHARACTERS.toLocaleString()}`
    );
  }

  // Line limit checks
  if (lineCount > INPUT_LIMITS.MAX_LINES) {
    errors.push(
      `Code exceeds the maximum of ${INPUT_LIMITS.MAX_LINES.toLocaleString()} lines (current: ${lineCount.toLocaleString()}). Please reduce the input size.`
    );
  } else if (lineCount > INPUT_LIMITS.WARN_LINES) {
    warnings.push(
      `Approaching line limit: ${lineCount.toLocaleString()} / ${INPUT_LIMITS.MAX_LINES.toLocaleString()}`
    );
  }

  return {
    isValid: errors.length === 0,
    charCount,
    lineCount,
    warnings,
    errors,
  };
}
