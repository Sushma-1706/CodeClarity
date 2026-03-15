import cors from "cors";
import express from "express";
import fs from "fs/promises";
import os from "os";
import path from "path";
import { spawn } from "child_process";

const app = express();
const PORT = Number(process.env.SANDBOX_PORT || 8787);
const EXECUTION_MODE = (process.env.SANDBOX_EXECUTION_MODE || "auto").toLowerCase();
const EXEC_TIMEOUT_MS = Number(process.env.SANDBOX_EXEC_TIMEOUT_MS || 12000);
const EXECUTOR_API =
  process.env.SANDBOX_EXECUTOR_API_URL ||
  process.env.PISTON_API_URL ||
  "https://emkc.org/api/v2/piston/execute";

app.use(cors({ origin: true }));
app.use(express.json({ limit: "200kb" }));

const LANGUAGE_CONFIG = {
  javascript: { language: "javascript", version: "18.15.0", fileName: "main.js" },
  python: { language: "python", version: "3.10.0", fileName: "main.py" },
  java: { language: "java", version: "15.0.2", fileName: "Main.java" },
  c: { language: "c", version: "10.2.0", fileName: "main.c" },
  cpp: { language: "cpp", version: "10.2.0", fileName: "main.cpp" },
};

function normalizeOutput(value) {
  if (!value) return "";
  return String(value).replace(/\r\n/g, "\n").trimEnd();
}

function buildExecutableName(baseName) {
  return process.platform === "win32" ? `${baseName}.exe` : baseName;
}

async function runCommand(command, args, options = {}) {
  const {
    cwd,
    stdin = "",
    timeoutMs = EXEC_TIMEOUT_MS,
  } = options;

  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: "pipe",
      windowsHide: true,
    });

    let stdout = "";
    let stderr = "";
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
    }, timeoutMs);

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });

    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({
        code,
        stdout: normalizeOutput(stdout),
        stderr: normalizeOutput(stderr),
        timedOut,
      });
    });

    if (stdin) {
      child.stdin.write(stdin);
    }
    child.stdin.end();
  });
}

async function runWithFallback(commands, options = {}) {
  let lastError = null;

  for (const [command, args] of commands) {
    try {
      return await runCommand(command, args, options);
    } catch (error) {
      lastError = error;
      if (error?.code !== "ENOENT") {
        throw error;
      }
    }
  }

  throw lastError || new Error("No runnable command found");
}

async function executeLocally({ language, code, stdin }) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "codeviz-"));
  const startTime = Date.now();

  try {
    if (language === "javascript") {
      const filePath = path.join(tempDir, "main.js");
      await fs.writeFile(filePath, code, "utf8");
      const run = await runCommand("node", [filePath], { stdin });

      return {
        compileOutput: "",
        stdout: run.stdout,
        stderr: run.stderr,
        error: run.timedOut ? `Execution timed out after ${EXEC_TIMEOUT_MS}ms` : undefined,
        executionTimeMs: Date.now() - startTime,
      };
    }

    if (language === "python") {
      const filePath = path.join(tempDir, "main.py");
      await fs.writeFile(filePath, code, "utf8");
      const run = await runWithFallback(
        [
          ["python", [filePath]],
          ["py", ["-3", filePath]],
        ],
        { stdin }
      );

      return {
        compileOutput: "",
        stdout: run.stdout,
        stderr: run.stderr,
        error: run.timedOut ? `Execution timed out after ${EXEC_TIMEOUT_MS}ms` : undefined,
        executionTimeMs: Date.now() - startTime,
      };
    }

    if (language === "java") {
      const filePath = path.join(tempDir, "Main.java");
      await fs.writeFile(filePath, code, "utf8");

      const compile = await runCommand("javac", [filePath], { cwd: tempDir });
      const compileOutput = [compile.stdout, compile.stderr].filter(Boolean).join("\n");

      if (compile.code !== 0 || compile.timedOut) {
        return {
          compileOutput,
          stdout: "",
          stderr: "",
          error: compile.timedOut
            ? `Compilation timed out after ${EXEC_TIMEOUT_MS}ms`
            : "Java compilation failed",
          executionTimeMs: Date.now() - startTime,
        };
      }

      const run = await runCommand("java", ["-cp", tempDir, "Main"], { stdin, cwd: tempDir });
      return {
        compileOutput,
        stdout: run.stdout,
        stderr: run.stderr,
        error: run.timedOut ? `Execution timed out after ${EXEC_TIMEOUT_MS}ms` : undefined,
        executionTimeMs: Date.now() - startTime,
      };
    }

    if (language === "c" || language === "cpp") {
      const sourceName = language === "c" ? "main.c" : "main.cpp";
      const compilerCandidates = language === "c"
        ? [["gcc", [sourceName, "-O2", "-o", buildExecutableName("main")]], ["clang", [sourceName, "-O2", "-o", buildExecutableName("main")]]]
        : [["g++", [sourceName, "-O2", "-std=c++17", "-o", buildExecutableName("main")]], ["clang++", [sourceName, "-O2", "-std=c++17", "-o", buildExecutableName("main")]]];

      const sourcePath = path.join(tempDir, sourceName);
      const binaryPath = path.join(tempDir, buildExecutableName("main"));
      await fs.writeFile(sourcePath, code, "utf8");

      const compile = await runWithFallback(compilerCandidates, { cwd: tempDir });
      const compileOutput = [compile.stdout, compile.stderr].filter(Boolean).join("\n");

      if (compile.code !== 0 || compile.timedOut) {
        return {
          compileOutput,
          stdout: "",
          stderr: "",
          error: compile.timedOut
            ? `Compilation timed out after ${EXEC_TIMEOUT_MS}ms`
            : `${language.toUpperCase()} compilation failed`,
          executionTimeMs: Date.now() - startTime,
        };
      }

      const run = await runCommand(binaryPath, [], { stdin, cwd: tempDir });
      return {
        compileOutput,
        stdout: run.stdout,
        stderr: run.stderr,
        error: run.timedOut ? `Execution timed out after ${EXEC_TIMEOUT_MS}ms` : undefined,
        executionTimeMs: Date.now() - startTime,
      };
    }

    throw new Error(`Unsupported language '${language}' for local execution`);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

function getProviderErrorMessage(rawMessage) {
  const message = normalizeOutput(rawMessage);
  if (!message) return "Runtime provider request failed";

  if (/whitelist only/i.test(message) && /piston/i.test(message)) {
    return [
      "Code execution provider rejected this request: public Piston is now whitelist-only.",
      "Set SANDBOX_EXECUTOR_API_URL to your own execution API (for example, a self-hosted Piston endpoint).",
    ].join(" ");
  }

  return message;
}

async function executeRemotely({ language, code, stdin, config }) {
  const response = await fetch(EXECUTOR_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language: config.language,
      version: config.version,
      files: [{ name: config.fileName, content: code }],
      stdin,
    }),
  });

  const rawBody = await response.text();
  let data = {};
  try {
    data = rawBody ? JSON.parse(rawBody) : {};
  } catch {
    data = { message: rawBody };
  }

  if (!response.ok) {
    const providerError = getProviderErrorMessage(data?.error || data?.message);
    const error = new Error(providerError || "Runtime provider request failed");
    error.providerStatus = response.status;
    throw error;
  }

  return {
    compileOutput: normalizeOutput(data?.compile?.output || data?.compile?.stderr || data?.compile?.stdout),
    stdout: normalizeOutput(data?.run?.stdout || data?.run?.output),
    stderr: normalizeOutput(data?.run?.stderr),
    error: normalizeOutput(data?.message || data?.run?.message) || undefined,
    executionTimeMs: Number(data?.run?.time ?? 0) * 1000 || undefined,
  };
}

app.get("/api/sandbox/health", (_req, res) => {
  res.json({ ok: true, service: "sandbox-backend" });
});

app.post("/api/sandbox/execute", async (req, res) => {
  const { code, language, stdin = "" } = req.body || {};

  if (!code || typeof code !== "string") {
    return res.status(400).json({ error: "Missing or invalid 'code'" });
  }

  const config = LANGUAGE_CONFIG[language];
  if (!config) {
    return res.status(400).json({
      error: `Unsupported language '${language}'. Supported: ${Object.keys(LANGUAGE_CONFIG).join(", ")}`,
    });
  }

  try {
    if (EXECUTION_MODE === "local") {
      const localResult = await executeLocally({ language, code, stdin });
      return res.json(localResult);
    }

    if (EXECUTION_MODE === "remote") {
      const remoteResult = await executeRemotely({ language, code, stdin, config });
      return res.json(remoteResult);
    }

    // auto mode: local first, remote fallback
    try {
      const localResult = await executeLocally({ language, code, stdin });
      return res.json(localResult);
    } catch (localError) {
      const hasCustomRemote = Boolean(process.env.SANDBOX_EXECUTOR_API_URL);
      if (localError?.code === "ENOENT" && !hasCustomRemote) {
        throw localError;
      }
      const remoteResult = await executeRemotely({ language, code, stdin, config });
      return res.json(remoteResult);
    }
  } catch (error) {
    const message = error?.message || "Unknown error";

    if (error?.code === "ENOENT") {
      return res.status(500).json({
        error:
          "Local runtime tool not found (compiler/interpreter missing). Install the language runtime (e.g., Java JDK, Python, Node, GCC) or set SANDBOX_EXECUTION_MODE=remote with a working SANDBOX_EXECUTOR_API_URL.",
      });
    }

    return res.status(500).json({
      error: `Sandbox backend failed: ${getProviderErrorMessage(message)}`,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Sandbox backend listening on http://localhost:${PORT}`);
});
