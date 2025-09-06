// /pages/api/visualize.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { code, language } = req.body;

    // ✅ Validate request body
    if (!code || !language) {
      return res.status(400).json({ error: "Code and language are required." });
    }

    // ✅ Simple mermaid flowchart based on language
    const diagram = `
      graph TD
        A[Start] --> B[Read ${language} Code]
        B --> C[Analyze Syntax]
        C --> D[Generate Visualization]
        D --> E[End]
    `;

    // ✅ Respond with diagram
    return res.status(200).json({
      type: "mermaid",
      diagram,
    });
  } catch (error) {
    console.error("Visualization API Error:", error);
    return res.status(500).json({ error: "Failed to generate visualization" });
  }
}
