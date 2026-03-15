import { useEffect, useState } from "react";
import { analyzeCode } from "@/core/analysis";
import { AnalysisResult } from "@/core/types";

export function useCodeAnalysis(code: string, language: string) {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!code.trim()) {
      setResult(null);
      return;
    }

    setLoading(true);
    Promise.resolve(analyzeCode(code, language))
      .then(setResult)
      .finally(() => setLoading(false));
  }, [code, language]);

  return { result, loading };
}
