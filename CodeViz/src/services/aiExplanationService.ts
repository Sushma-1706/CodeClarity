// AI-Powered Code Explanation Service
// Generates multi-level explanations with real-world analogies

export interface CodeExplanation {
  simplified: string; // For 10-year-olds
  technical: string; // For 20-year-olds
  analogy: string; // Real-world analogy
  keyConcepts: string[];
  lineByLine: Array<{
    lineNumber: number;
    code: string;
    simplified: string;
    technical: string;
  }>;
}

export interface WhyModeExplanation {
  lineNumber: number;
  code: string;
  explanation: string;
  reasoning: string;
  relatedConcepts: string[];
}

interface GrokChatResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

const GROK_API_URL = "https://api.x.ai/v1/chat/completions";
const DEFAULT_GROK_MODEL = "grok-2-latest";

class AIExplanationService {
  public async generateExplanation(
    code: string,
    language: string,
    mode: "simplified" | "technical"
  ): Promise<CodeExplanation> {
    const localExplanation = this.generateLocalExplanation(code, language, mode);
    const apiKey = import.meta.env.VITE_GROK_API_KEY?.trim();

    if (!apiKey) {
      return localExplanation;
    }

    try {
      const model = import.meta.env.VITE_GROK_MODEL?.trim() || DEFAULT_GROK_MODEL;
      const lineByLineLimit = 12;
      const prompt = `You are an expert programming tutor. Return ONLY valid JSON (no markdown) with this exact shape: {"simplified":string,"technical":string,"analogy":string,"keyConcepts":string[],"lineByLine":[{"lineNumber":number,"code":string,"simplified":string,"technical":string}]}.\nLanguage: ${language}\nPreferred mode: ${mode}\nCode:\n${code}\n\nRules:\n- Keep simplified explanation beginner friendly.\n- Keep technical explanation concise and accurate.\n- Include realistic analogy.\n- Include 3-8 key concepts.\n- lineByLine must include at most ${lineByLineLimit} meaningful non-empty lines.`;

      const content = await this.callGrok(apiKey, model, prompt);
      const parsed = this.parseJson<CodeExplanation>(content);
      if (!parsed) {
        return localExplanation;
      }

      return {
        simplified: parsed.simplified || localExplanation.simplified,
        technical: parsed.technical || localExplanation.technical,
        analogy: parsed.analogy || localExplanation.analogy,
        keyConcepts:
          Array.isArray(parsed.keyConcepts) && parsed.keyConcepts.length > 0
            ? parsed.keyConcepts
            : localExplanation.keyConcepts,
        lineByLine:
          Array.isArray(parsed.lineByLine) && parsed.lineByLine.length > 0
            ? parsed.lineByLine
            : localExplanation.lineByLine,
      };
    } catch (error) {
      console.warn("Grok explanation failed, using local fallback:", error);
      return localExplanation;
    }
  }

  public async generateWhyModeExplanation(
    code: string,
    language: string,
    lineNumber: number
  ): Promise<WhyModeExplanation | null> {
    const localWhyExplanation = this.generateLocalWhyModeExplanation(
      code,
      language,
      lineNumber
    );
    const apiKey = import.meta.env.VITE_GROK_API_KEY?.trim();

    if (!apiKey || !localWhyExplanation) {
      return localWhyExplanation;
    }

    try {
      const model = import.meta.env.VITE_GROK_MODEL?.trim() || DEFAULT_GROK_MODEL;
      const prompt = `You are an expert programming tutor. Return ONLY valid JSON (no markdown) with shape: {"explanation":string,"reasoning":string,"relatedConcepts":string[]}.\nLanguage: ${language}\nLine number: ${lineNumber}\nLine code: ${localWhyExplanation.code}\nFull code:\n${code}`;

      const content = await this.callGrok(apiKey, model, prompt);
      const parsed = this.parseJson<Pick<WhyModeExplanation, "explanation" | "reasoning" | "relatedConcepts">>(content);
      if (!parsed) {
        return localWhyExplanation;
      }

      return {
        ...localWhyExplanation,
        explanation: parsed.explanation || localWhyExplanation.explanation,
        reasoning: parsed.reasoning || localWhyExplanation.reasoning,
        relatedConcepts:
          Array.isArray(parsed.relatedConcepts) && parsed.relatedConcepts.length > 0
            ? parsed.relatedConcepts
            : localWhyExplanation.relatedConcepts,
      };
    } catch (error) {
      console.warn("Grok why-mode failed, using local fallback:", error);
      return localWhyExplanation;
    }
  }

  private async callGrok(
    apiKey: string,
    model: string,
    prompt: string
  ): Promise<string> {
    const response = await fetch(GROK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content:
              "You explain code clearly for learners and always return strict JSON when asked.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Grok API error ${response.status}: ${errorText}`);
    }

    const data = (await response.json()) as GrokChatResponse;
    return data.choices?.[0]?.message?.content?.trim() || "";
  }

  private parseJson<T>(raw: string): T | null {
    if (!raw) return null;

    try {
      return JSON.parse(raw) as T;
    } catch {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return null;
      }

      try {
        return JSON.parse(jsonMatch[0]) as T;
      } catch {
        return null;
      }
    }
  }

  private generateLocalExplanation(
    code: string,
    language: string,
    mode: "simplified" | "technical"
  ): CodeExplanation {
    const lines = code.split("\n").filter((line) => line.trim());
    
    // Detect code patterns
    const hasRecursion = this.detectRecursion(code);
    const hasLoops = this.detectLoops(code);
    const hasConditions = this.detectConditions(code);
    const hasArrays = this.detectArrays(code);

    // Generate simplified explanation
    const simplified = this.generateSimplifiedExplanation(
      code,
      language,
      hasRecursion,
      hasLoops,
      hasConditions,
      hasArrays
    );

    // Generate technical explanation
    const technical = this.generateTechnicalExplanation(
      code,
      language,
      hasRecursion,
      hasLoops,
      hasConditions,
      hasArrays
    );

    // Generate analogy
    const analogy = this.generateAnalogy(code, hasRecursion, hasLoops, hasArrays);

    // Extract key concepts
    const keyConcepts = this.extractKeyConcepts(
      code,
      hasRecursion,
      hasLoops,
      hasConditions,
      hasArrays
    );

    // Generate line-by-line explanations
    const lineByLine = lines.map((line, index) => ({
      lineNumber: index + 1,
      code: line.trim(),
      simplified: this.explainLineSimplified(line, language),
      technical: this.explainLineTechnical(line, language),
    }));

    return {
      simplified,
      technical,
      analogy,
      keyConcepts,
      lineByLine,
    };
  }

  private generateLocalWhyModeExplanation(
    code: string,
    language: string,
    lineNumber: number
  ): WhyModeExplanation | null {
    const lines = code.split("\n");
    if (lineNumber < 1 || lineNumber > lines.length) return null;

    const line = lines[lineNumber - 1].trim();
    if (!line || line.startsWith("//") || line.startsWith("#")) return null;

    const explanation = this.explainLineTechnical(line, language);
    const reasoning = this.generateReasoning(line, language);
    const relatedConcepts = this.extractRelatedConcepts(line, language);

    return {
      lineNumber,
      code: line,
      explanation,
      reasoning,
      relatedConcepts,
    };
  }

  private detectRecursion(code: string): boolean {
    const functionMatches = code.match(/function\s+(\w+)|def\s+(\w+)/g) || [];
    return functionMatches.some((fn) => {
      const name = fn.split(/\s+/)[1];
      return code.includes(`${name}(`);
    });
  }

  private detectLoops(code: string): boolean {
    return /for\s*\(|while\s*\(|do\s*\{/.test(code);
  }

  private detectConditions(code: string): boolean {
    return /\bif\s*\(|\belse\b|\bswitch\s*\(/.test(code);
  }

  private detectArrays(code: string): boolean {
    return /\[.*\]|array|Array/.test(code);
  }

  private generateSimplifiedExplanation(
    code: string,
    language: string,
    hasRecursion: boolean,
    hasLoops: boolean,
    hasConditions: boolean,
    hasArrays: boolean
  ): string {
    const parts: string[] = [];

    if (hasRecursion) {
      parts.push(
        "This code uses recursion, which is like asking a question that leads to smaller versions of the same question until you reach a simple answer!"
      );
    }

    if (hasLoops) {
      parts.push(
        "It has loops that repeat actions, like counting from 1 to 10 or checking every item in a list."
      );
    }

    if (hasConditions) {
      parts.push(
        "The code makes decisions using 'if' statements, like choosing what to wear based on the weather."
      );
    }

    if (hasArrays) {
      parts.push(
        "It works with lists of items (arrays), like a shopping list or a row of numbered boxes."
      );
    }

    if (code.includes("fibonacci") || code.includes("fib")) {
      return (
        "This code calculates Fibonacci numbers - a special sequence where each number is the sum of the two numbers before it (like 1, 1, 2, 3, 5, 8...). " +
        "It's like a mathematical recipe that calls itself to break down big problems into smaller pieces, " +
        "just like asking 'What's 5+3?' by first figuring out what 5 is and what 3 is."
      );
    }

    return (
      parts.join(" ") ||
      "This code performs calculations and operations step by step, like following a recipe to bake a cake!"
    );
  }

  private generateTechnicalExplanation(
    code: string,
    language: string,
    hasRecursion: boolean,
    hasLoops: boolean,
    hasConditions: boolean,
    hasArrays: boolean
  ): string {
    const parts: string[] = [];

    if (hasRecursion) {
      parts.push(
        "The implementation employs recursive function calls, where a function invokes itself with modified parameters until reaching a base case."
      );
    }

    if (hasLoops) {
      parts.push(
        "Iterative constructs (loops) enable repeated execution of code blocks, facilitating traversal and transformation of data structures."
      );
    }

    if (hasConditions) {
      parts.push(
        "Conditional branching logic implements decision-making through boolean evaluations, enabling different execution paths."
      );
    }

    if (hasArrays) {
      parts.push(
        "Array data structures provide indexed access to collections of elements, supporting efficient data manipulation."
      );
    }

    if (code.includes("fibonacci") || code.includes("fib")) {
      return (
        "This recursive Fibonacci implementation demonstrates classic divide-and-conquer recursion. " +
        "The function calls itself twice per invocation (fib(n-1) and fib(n-2)), creating a binary recursion tree. " +
        "The base case (n <= 1) terminates the recursion. " +
        "Time complexity is O(2^n) due to exponential recursive calls, while space complexity is O(n) for the call stack depth."
      );
    }

    return (
      parts.join(" ") ||
      "The code implements algorithmic logic through structured control flow and data manipulation operations."
    );
  }

  private generateAnalogy(
    code: string,
    hasRecursion: boolean,
    hasLoops: boolean,
    hasArrays: boolean
  ): string {
    if (code.includes("fibonacci") || code.includes("fib")) {
      return (
        "Think of this like a family tree! To find out how many rabbit pairs you'll have after n months, " +
        "you need to know how many you had in the previous two months. Each generation depends on the ones before it, " +
        "creating a branching pattern where earlier values are needed to calculate later ones."
      );
    }

    if (hasRecursion) {
      return (
        "Recursion is like Russian nesting dolls - each doll contains a smaller version of itself. " +
        "You keep opening dolls until you reach the smallest one (base case), then work your way back up."
      );
    }

    if (hasLoops && hasArrays) {
      return (
        "Loops with arrays are like checking every item in a shopping cart. " +
        "You go through each item one by one, perform an action (like checking the price), and move to the next."
      );
    }

    return (
      "Code execution is like following a recipe - you read each instruction, perform the action, " +
      "and move to the next step until you've completed the entire process."
    );
  }

  private extractKeyConcepts(
    code: string,
    hasRecursion: boolean,
    hasLoops: boolean,
    hasConditions: boolean,
    hasArrays: boolean
  ): string[] {
    const concepts: string[] = [];

    if (hasRecursion) concepts.push("Recursion");
    if (hasLoops) concepts.push("Loops");
    if (hasConditions) concepts.push("Conditionals");
    if (hasArrays) concepts.push("Arrays");
    if (code.includes("function") || code.includes("def")) concepts.push("Functions");
    if (code.includes("return")) concepts.push("Return Statements");
    if (code.includes("if") && code.includes("else")) concepts.push("Branching");

    return concepts;
  }

  private explainLineSimplified(line: string, language: string): string {
    const trimmed = line.trim();

    if (trimmed.startsWith("function") || trimmed.startsWith("def")) {
      return "This line creates a new function - a reusable piece of code with a name, like a recipe with a title!";
    }

    if (trimmed.includes("if")) {
      return "This checks a condition - if something is true, do one thing; otherwise, do something else!";
    }

    if (trimmed.includes("return")) {
      return "This gives back a result, like answering a question with a number or value!";
    }

    if (trimmed.includes("for") || trimmed.includes("while")) {
      return "This starts a loop - it repeats actions multiple times, like counting from 1 to 10!";
    }

    if (trimmed.includes("=")) {
      return "This stores a value in a variable, like putting a number in a labeled box!";
    }

    return "This line performs an operation or calculation.";
  }

  private explainLineTechnical(line: string, language: string): string {
    const trimmed = line.trim();

    if (trimmed.startsWith("function") || trimmed.startsWith("def")) {
      return "Function declaration defines a named, reusable code block with optional parameters and return type.";
    }

    if (trimmed.includes("if")) {
      return "Conditional statement evaluates a boolean expression and executes code block if condition is true.";
    }

    if (trimmed.includes("return")) {
      return "Return statement terminates function execution and optionally returns a value to the caller.";
    }

    if (trimmed.includes("for") || trimmed.includes("while")) {
      return "Loop construct enables iterative execution with initialization, condition check, and increment/decrement.";
    }

    if (trimmed.includes("=")) {
      return "Assignment operator stores a value in a variable, binding an identifier to a memory location.";
    }

    return "Statement performs computation or side effect.";
  }

  private generateReasoning(line: string, language: string): string {
    if (line.includes("if") && line.includes("<=")) {
      return "The comparison operator checks if a value is less than or equal to another, enabling base case detection in recursive algorithms.";
    }

    if (line.includes("return") && line.includes("+")) {
      return "Returning the sum of recursive calls combines subproblem solutions, implementing the recursive relation.";
    }

    if (line.includes("function") || line.includes("def")) {
      return "Function definition encapsulates logic, enabling code reuse and modular design principles.";
    }

    return "This line contributes to the overall algorithm's logic and control flow.";
  }

  private extractRelatedConcepts(line: string, language: string): string[] {
    const concepts: string[] = [];

    if (line.includes("function") || line.includes("def")) concepts.push("Function Definition");
    if (line.includes("if")) concepts.push("Conditional Logic");
    if (line.includes("return")) concepts.push("Return Values");
    if (line.includes("for") || line.includes("while")) concepts.push("Iteration");
    if (line.includes("=")) concepts.push("Variable Assignment");
    if (line.includes("+") || line.includes("-") || line.includes("*")) concepts.push("Arithmetic Operations");

    return concepts;
  }
}

export const aiExplanationService = new AIExplanationService();

