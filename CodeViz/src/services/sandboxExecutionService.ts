// Sandbox Execution Service
// Provides secure code execution with step-by-step tracking

export interface ExecutionStep {
  step: number;
  lineNumber: number;
  code: string;
  variables: Record<string, any>;
  callStack: string[];
  output?: string;
  error?: string;
}

export interface ExecutionResult {
  steps: ExecutionStep[];
  finalOutput: string;
  error?: string;
  executionTime: number;
  memoryUsage?: number;
}

interface SandboxApiResponse {
  stdout?: string;
  stderr?: string;
  compileOutput?: string;
  error?: string;
  executionTimeMs?: number;
}

class SandboxExecutionService {
  private readonly defaultApiUrl = "/api/sandbox/execute";

  public async executeStepByStep(
    code: string,
    language: string,
    runtimeInput: string[] = []
  ): Promise<ExecutionResult> {
    const steps = this.buildExecutionSteps(code);
    const startTime = Date.now();

    try {
      const response = await this.executeViaBackend(code, language, runtimeInput);
      const outputParts = [response.compileOutput, response.stdout]
        .filter((item) => item && item.trim().length > 0)
        .join("\n");

      return {
        steps,
        finalOutput: outputParts || "(no output)",
        error: response.error || response.stderr || undefined,
        executionTime: response.executionTimeMs ?? Date.now() - startTime,
      };
    } catch (error: any) {
      return {
        steps,
        finalOutput: "",
        error:
          error?.message ||
          "Sandbox backend unavailable. Start backend with `npm run sandbox:dev`.",
        executionTime: Date.now() - startTime,
      };
    }
  }

  private async executeViaBackend(
    code: string,
    language: string,
    runtimeInput: string[]
  ): Promise<SandboxApiResponse> {
    const envApiUrl = import.meta.env.VITE_SANDBOX_API_URL?.trim();
    const apiCandidates = this.getApiCandidates(envApiUrl);
    const stdin = runtimeInput.join("\n");
    let lastError: Error | null = null;

    for (const apiUrl of apiCandidates) {
      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code, language, stdin }),
        });

        const rawBody = await response.text();
        const data = this.parseApiResponse(rawBody);

        if (!response.ok) {
          throw new Error(data.error || `Sandbox API failed with status ${response.status}`);
        }

        return data;
      } catch (error: any) {
        lastError = error instanceof Error ? error : new Error(String(error));
      }
    }

    const fallbackHelp =
      "Unable to connect to sandbox backend. Start backend with `npm run sandbox:dev` or run both with `npm run dev:full`.";

    if (!lastError) {
      throw new Error(fallbackHelp);
    }

    if (/failed to fetch|networkerror|load failed/i.test(lastError.message)) {
      throw new Error(fallbackHelp);
    }

    throw lastError;
  }

  private getApiCandidates(envApiUrl?: string): string[] {
    const candidates = [envApiUrl, this.defaultApiUrl, "http://localhost:8787/api/sandbox/execute"]
      .map((value) => value?.trim())
      .filter((value): value is string => Boolean(value));

    return Array.from(new Set(candidates));
  }

  private parseApiResponse(rawBody: string): SandboxApiResponse {
    try {
      return (JSON.parse(rawBody) as SandboxApiResponse) || {};
    } catch {
      return {
        error: rawBody?.trim() || "Sandbox backend returned an invalid response.",
      };
    }
  }

  private buildExecutionSteps(code: string): ExecutionStep[] {
    const steps: ExecutionStep[] = [];
    const lines = code.split("\n");
    let variables: Record<string, any> = {};

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("#")) return;

      // Simulate variable tracking
      if (trimmed.includes("=")) {
        const varMatch = trimmed.match(/(\w+)\s*=/);
        if (varMatch) {
          variables[varMatch[1]] = "simulated_value";
        }
      }

      steps.push({
        step: steps.length + 1,
        lineNumber: index + 1,
        code: trimmed,
        variables: { ...variables },
        callStack: [],
      });
    });

    return steps;
  }
}

export const sandboxExecutionService = new SandboxExecutionService();

