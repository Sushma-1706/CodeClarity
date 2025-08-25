import { useEffect, useState } from "react";

interface HistoryEntry {
  code: string;
  language: string;
  timestamp: string;
}

const HistoryPanel = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("analysisHistory") || "[]");
    setHistory(stored);
  }, []);

  return (
    <div className="p-4 space-y-3">
      <h2 className="text-xl font-bold">Analysis History</h2>
      {history.length === 0 ? (
        <p className="text-muted-foreground">No history yet.</p>
      ) : (
        history.map((entry, i) => (
          <div key={i} className="p-3 border rounded-lg">
            <p className="text-sm text-gray-500">{entry.timestamp} — {entry.language}</p>
            <pre className="mt-1 p-2 bg-muted rounded text-sm overflow-x-auto">
              {entry.code}
            </pre>
          </div>
        ))
      )}
    </div>
  );
};

export default HistoryPanel;
