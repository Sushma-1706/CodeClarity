import { useState } from "react";
import { analyzeCode } from "@/services/analyze";

export default function AnalyzePage() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const data = await analyzeCode(code); // ✅ Local analysis, no API call
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="p-6 space-y-4">
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste your code here..."
        className="w-full h-48 p-3 border rounded"
      />

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? "Analyzing..." : "Run Analysis"}
      </button>

      {result && result.ok && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <h2 className="font-bold text-lg">AI Analysis (Local)</h2>
          <p><strong>Language:</strong> {result.result.language}</p>
          <p><strong>Total Lines:</strong> {result.result.metrics.totalLines}</p>
          <p><strong>Non-empty Lines:</strong> {result.result.metrics.nonEmpty}</p>
          <p><strong>Functions:</strong> {result.result.metrics.functions.join(", ") || "None"}</p>
          <p><strong>Unused Vars:</strong> {result.result.metrics.unusedVars.join(", ") || "None"}</p>
          <p><strong>Time Complexity:</strong> {result.result.metrics.timeComplexity}</p>
          <p><strong>Cyclomatic Complexity:</strong> {result.result.metrics.cyclomatic}</p>

          <h3 className="mt-3 font-bold">Suggestions</h3>
          <ul className="list-disc ml-6">
            {result.result.suggestions.map((s: string, i: number) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      {result && !result.ok && (
        <div className="mt-4 p-4 border rounded bg-red-100 text-red-700">
          <strong>Error:</strong> {result.error}
        </div>
      )}
    </div>
  );
}
