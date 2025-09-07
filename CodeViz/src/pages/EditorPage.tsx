const handleRun = async () => {
  try {
    const res = await fetch("http://localhost:5000/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, language: selectedLanguage }),
    });

    if (!res.ok) throw new Error("Server returned " + res.status);

    const data = await res.json();
    setRunResult(data);
  } catch (err) {
    console.error("Run Error:", err);
    setRunResult({
      stdout: "",
      stderr: (err as Error).message,
      exitCode: 1,
      durationMs: 0,
    });
  }
};
