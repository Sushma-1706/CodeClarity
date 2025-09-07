export async function analyzeCode(code: string) {
  try {
    // ✅ Auto detect language
    let language = "Unknown";
    if (/#include\s+<.*?>/i.test(code)) language = "C/C++";
    else if (/import\s+\w+/i.test(code)) language = "Java";
    else if (/def\s+\w+\(/i.test(code)) language = "Python";
    else if (/function\s+\w+\(/i.test(code)) language = "JavaScript";

    // ✅ Count total & non-empty lines
    const lines = code.split("\n");
    const totalLines = lines.length;
    const nonEmpty = lines.filter((line) => line.trim() !== "").length;

    // ✅ Find function names
    const functionRegex = /\b(?:def|function|void|int|float|char|double|String)\s+(\w+)\s*\(/g;
    let match;
    const functions: string[] = [];
    while ((match = functionRegex.exec(code)) !== null) {
      functions.push(match[1]);
    }

    // ✅ Find variables & unused ones
    const varRegex = /\b(?:int|float|double|char|let|const|var|String)\s+(\w+)/g;
    const vars: string[] = [];
    while ((match = varRegex.exec(code)) !== null) {
      vars.push(match[1]);
    }
    const unusedVars = vars.filter((v) => !new RegExp(`\\b${v}\\b`, "g").test(code.split(v)[1]));

    // ✅ Guess time complexity (very basic)
    let timeComplexity = "O(1)";
    if (/\bfor\s*\(/g.test(code) || /\bwhile\s*\(/g.test(code)) timeComplexity = "O(n)";
    if (/for\s*\(.*for\s*\(/g.test(code)) timeComplexity = "O(n²)";

    // ✅ Cyclomatic complexity (basic)
    const conditions = (code.match(/\b(if|else if|for|while|case)\b/g) || []).length;
    const cyclomatic = conditions + 1;

    // ✅ Suggestions
    const suggestions: string[] = [];
    if (functions.length === 0) suggestions.push("Consider splitting code into functions for better readability.");
    if (unusedVars.length > 0) suggestions.push("Remove unused variables to improve performance.");
    if (timeComplexity === "O(n²)") suggestions.push("Consider optimizing nested loops.");
    if (lines.length > 50) suggestions.push("Break your code into smaller files for better maintainability.");

    // ✅ Return result
    return {
      ok: true,
      result: {
        language,
        metrics: {
          totalLines,
          nonEmpty,
          functions,
          unusedVars,
          timeComplexity,
          cyclomatic,
        },
        suggestions,
      },
    };
  } catch (error) {
    return { ok: false, error: "Local analysis failed" };
  }
}

