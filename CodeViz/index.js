import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// --------------------------------------
// ✅ API 1: AI Analysis (Mock or OpenAI Ready)
// --------------------------------------
app.post("/analyze", async (req, res) => {
  try {
    const { code, language, mode } = req.body;

    // Mock AI response for now
    const mockAnalysis = {
      language,
      mode,
      summary: `Your ${language} code was analyzed successfully.`,
      explanation: `In ${mode} mode, this code executes step by step. It looks clean and correct.`,
      steps: [
        "Read the code",
        "Analyze syntax and flow",
        "Explain it in simple words"
      ]
    };

    return res.json(mockAnalysis);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return res.status(500).json({ error: "AI analysis failed" });
  }
});

// --------------------------------------
// ✅ API 2: Run Code (Using Piston API)
// --------------------------------------
app.post("/run", async (req, res) => {
  try {
    const { code, language } = req.body;

    const runtimes = {
      javascript: "javascript",
      python: "python3",
      java: "java",
      cpp: "cpp",
      c: "c"
    };

    const pistonRes = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: runtimes[language] || "python3",
        version: "*",
        files: [{ content: code }]
      })
    });

    const result = await pistonRes.json();

    res.json({
      stdout: result.run?.stdout || "",
      stderr: result.run?.stderr || "",
      exitCode: result.run?.code ?? 0,
      durationMs: result.run?.time ?? 0
    });
  } catch (error) {
    console.error("Run Code Error:", error);
    return res.status(500).json({
      stdout: "",
      stderr: error.message,
      exitCode: 1
    });
  }
});

// --------------------------------------
// ✅ API 3: Visualization (POST Request) ✅
// --------------------------------------
app.post("/visualize", (req, res) => {
  try {
    const { code, language } = req.body;

    // Temporary static Mermaid diagram
    const diagram = `
      graph TD;
        A[Start] --> B[Read ${language} Code];
        B --> C[Analyze Code];
        C --> D[Generate Flowchart];
        D --> E[End];
    `;

    return res.json({ success: true, visualization: diagram });
  } catch (error) {
    console.error("Visualization API Error:", error);
    return res.status(500).json({ error: "Failed to generate visualization" });
  }
});

// --------------------------------------
// ✅ Start Server
// --------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

