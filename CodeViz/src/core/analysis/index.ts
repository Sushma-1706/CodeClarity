import { patternRecognitionEngine } from '@/services/patternRecognition';
import { heuristicAnalysisEngine } from '@/services/heuristicAnalysisEngine';
import { AnalysisResult } from '@/core/types';

/**
 * High-level analysis entry point used by UI hooks.
 * Combines pattern recognition and heuristic metrics into a unified result shape.
 */
export function analyzeCode(code: string, language: string): AnalysisResult {
	const patternResult = patternRecognitionEngine.analyzeCode(code, language);
	const features = heuristicAnalysisEngine.extractFeatures(code, language);

	const patterns = patternResult.patterns.map(p => ({
		id: p.id,
		confidence: p.confidence,
		explanation: p.explanation.technical,
		// We don't yet track exact source lines for a detected pattern; leave empty for now
		lines: [] as number[]
	}));

	const complexity = {
		time: patternResult.mainPattern?.complexity.time ?? 'O(n)',
		space: patternResult.mainPattern?.complexity.space ?? 'O(1)'
	};

	const metrics = {
		cyclomatic: Math.round(features.cyclomaticComplexity),
		functions: patternResult.codeStructure.functions,
		loops: patternResult.codeStructure.loops
	};

	return {
		patterns,
		complexity,
		metrics
	};
}
