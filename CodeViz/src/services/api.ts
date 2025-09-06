// src/services/api.ts
const BASE_URL = "http://localhost:5000"; 

export const API = {
  analyze: async (code: string, language: string) => {
    const res = await fetch(`${BASE_URL}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, language }),
    });
    if (!res.ok) {
      throw new Error(`Failed to analyze: ${res.status} ${res.statusText}`);
    }
    return res.json();
  },

  visualize: async () => {
    const res = await fetch(`${BASE_URL}/visualize`);
    if (!res.ok) {
      throw new Error(`Failed to visualize: ${res.status} ${res.statusText}`);
    }
    return res.json();
  },

  execute: async (code: string, language: string) => {
    // Auto-detect Java class name
    const getFileName = () => {
      if (language === "java") {
        const match = code.match(/public\s+class\s+(\w+)/);
        return match ? `${match[1]}.java` : "Main.java";
      }
      switch (language) {
        case "c":
          return "code.c";
        case "cpp":
          return "code.cpp";
        case "python":
          return "code.py";
        case "javascript":
          return "code.js";
        default:
          return "code.txt";
      }
    };

    const res = await fetch(`${BASE_URL}/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, language, filename: getFileName() }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to execute: ${res.status} ${text}`);
    }

    return res.json();
  },
};


