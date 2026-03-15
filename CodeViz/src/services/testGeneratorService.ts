// Test Case Generator Service
// Auto-generates test cases from code

export interface TestCase {
  id: string;
  name: string;
  input: Record<string, any>;
  expectedOutput: any;
  description: string;
  category: "unit" | "edge" | "integration";
}

export interface TestSuite {
  id: string;
  language: string;
  functionName?: string;
  testCases: TestCase[];
  code: string;
}

class TestGeneratorService {
  public generateTests(code: string, language: string): TestSuite {
    const functionName = this.extractFunctionName(code);
    const testCases: TestCase[] = [];

    // Generate edge cases
    testCases.push(...this.generateEdgeCases(code, language, functionName));

    // Generate normal cases
    testCases.push(...this.generateNormalCases(code, language, functionName));

    // Generate boundary cases
    testCases.push(...this.generateBoundaryCases(code, language, functionName));

    return {
      id: `test-${Date.now()}`,
      language,
      functionName,
      testCases,
      code,
    };
  }

  private extractFunctionName(code: string): string | undefined {
    const match = code.match(/function\s+(\w+)|def\s+(\w+)/);
    return match ? (match[1] || match[2]) : undefined;
  }

  private generateEdgeCases(
    code: string,
    language: string,
    functionName?: string
  ): TestCase[] {
    const cases: TestCase[] = [];

    if (code.includes("fibonacci") || code.includes("fib")) {
      cases.push({
        id: "edge-1",
        name: "Zero input",
        input: { n: 0 },
        expectedOutput: 0,
        description: "Test with input 0",
        category: "edge",
      });

      cases.push({
        id: "edge-2",
        name: "Negative input",
        input: { n: -1 },
        expectedOutput: -1,
        description: "Test with negative input",
        category: "edge",
      });

      cases.push({
        id: "edge-3",
        name: "Large input",
        input: { n: 20 },
        expectedOutput: 6765,
        description: "Test with larger input value",
        category: "edge",
      });
    }

    return cases;
  }

  private generateNormalCases(
    code: string,
    language: string,
    functionName?: string
  ): TestCase[] {
    const cases: TestCase[] = [];

    if (code.includes("fibonacci") || code.includes("fib")) {
      cases.push({
        id: "normal-1",
        name: "Small positive input",
        input: { n: 5 },
        expectedOutput: 5,
        description: "Test with small positive input",
        category: "unit",
      });

      cases.push({
        id: "normal-2",
        name: "Medium input",
        input: { n: 10 },
        expectedOutput: 55,
        description: "Test with medium input value",
        category: "unit",
      });
    }

    return cases;
  }

  private generateBoundaryCases(
    code: string,
    language: string,
    functionName?: string
  ): TestCase[] {
    const cases: TestCase[] = [];

    if (code.includes("fibonacci") || code.includes("fib")) {
      cases.push({
        id: "boundary-1",
        name: "Base case - input 1",
        input: { n: 1 },
        expectedOutput: 1,
        description: "Test base case with input 1",
        category: "edge",
      });

      cases.push({
        id: "boundary-2",
        name: "Base case - input 2",
        input: { n: 2 },
        expectedOutput: 1,
        description: "Test base case with input 2",
        category: "edge",
      });
    }

    return cases;
  }

  public generateTestCode(testSuite: TestSuite, framework: string = "jest"): string {
    if (testSuite.language === "javascript") {
      if (framework === "jest") {
        return this.generateJestTests(testSuite);
      }
    } else if (testSuite.language === "python") {
      return this.generatePythonTests(testSuite);
    }

    return `// Test cases for ${testSuite.functionName || "function"}\n` +
           testSuite.testCases.map(tc => 
             `// ${tc.name}: ${tc.description}\n` +
             `// Input: ${JSON.stringify(tc.input)}\n` +
             `// Expected: ${tc.expectedOutput}\n`
           ).join("\n");
  }

  private generateJestTests(testSuite: TestSuite): string {
    const functionName = testSuite.functionName || "functionUnderTest";
    
    return `describe('${functionName}', () => {\n` +
           testSuite.testCases.map(tc => 
             `  test('${tc.name}', () => {\n` +
             `    expect(${functionName}(${Object.values(tc.input).join(", ")})).toBe(${tc.expectedOutput});\n` +
             `  });`
           ).join("\n\n") +
           `\n});`;
  }

  private generatePythonTests(testSuite: TestSuite): string {
    const functionName = testSuite.functionName || "function_under_test";
    
    return `import unittest\n\n` +
           `class Test${functionName.charAt(0).toUpperCase() + functionName.slice(1)}(unittest.TestCase):\n` +
           testSuite.testCases.map(tc => 
             `    def test_${tc.name.toLowerCase().replace(/\s+/g, "_")}(self):\n` +
             `        self.assertEqual(${functionName}(${Object.values(tc.input).join(", ")}), ${tc.expectedOutput})`
           ).join("\n\n") +
           `\n\nif __name__ == '__main__':\n    unittest.main()`;
  }
}

export const testGeneratorService = new TestGeneratorService();

