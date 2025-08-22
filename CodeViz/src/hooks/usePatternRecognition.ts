import { useState, useCallback, useEffect } from 'react';
import { patternRecognitionEngine, PatternAnalysisResult, CodePattern } from '@/services/patternRecognition';

export interface UsePatternRecognitionReturn {
  analysis: PatternAnalysisResult | null;
  isAnalyzing: boolean;
  error: string | null;
  analyzeCode: (code: string, language: string) => Promise<void>;
  getPatternVisualization: (patternId: string) => any;
  getPatternExplanation: (patternId: string, level: 'simplified' | 'technical') => string;
  clearAnalysis: () => void;
}

export const usePatternRecognition = (): UsePatternRecognitionReturn => {
  const [analysis, setAnalysis] = useState<PatternAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeCode = useCallback(async (code: string, language: string) => {
    if (!code.trim()) {
      setAnalysis(null);
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Simulate ML processing time for realistic UX
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      
      const result = patternRecognitionEngine.analyzeCode(code, language);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
      setAnalysis(null);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const getPatternVisualization = useCallback((patternId: string) => {
    return patternRecognitionEngine.getPatternVisualization(patternId);
  }, []);

  const getPatternExplanation = useCallback((patternId: string, level: 'simplified' | 'technical') => {
    return patternRecognitionEngine.getPatternExplanation(patternId, level);
  }, []);

  const clearAnalysis = useCallback(() => {
    setAnalysis(null);
    setError(null);
  }, []);

  return {
    analysis,
    isAnalyzing,
    error,
    analyzeCode,
    getPatternVisualization,
    getPatternExplanation,
    clearAnalysis
  };
};