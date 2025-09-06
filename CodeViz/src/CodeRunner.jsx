const runCode = async () => {
  try {
    const response = await fetch("http://localhost:5000/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language, code }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    setOutput(
      data.stdout || data.stderr || "⚠️ No output"
    );
  } catch (err) {
    console.error("Run Code Error:", err);
    setOutput(`❌ Error: ${err.message}`);
  }
};
