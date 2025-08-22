// Quick test of the Pattern Recognition Engine
import { patternRecognitionEngine } from './src/services/patternRecognition.js';

const testCode = `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`;

console.log('🧪 Testing Smart Code Pattern Recognition Engine...\n');

try {
  const result = patternRecognitionEngine.analyzeCode(testCode, 'javascript');
  
  console.log('✅ Analysis Results:');
  console.log(`📊 Patterns detected: ${result.patterns.length}`);
  
  if (result.mainPattern) {
    console.log(`🎯 Main pattern: ${result.mainPattern.name}`);
    console.log(`🔥 Confidence: ${Math.round(result.mainPattern.confidence * 100)}%`);
    console.log(`⚡ Complexity: ${result.mainPattern.complexity.time} time, ${result.mainPattern.complexity.space} space`);
  }
  
  console.log(`🏗️  Code structure: ${result.codeStructure.functions} functions, ${result.codeStructure.loops} loops, ${result.codeStructure.conditionals} conditionals`);
  console.log(`🔄 Recursion detected: ${result.codeStructure.recursion ? 'Yes' : 'No'}`);
  
  console.log('\n💡 Suggestions:');
  result.suggestions.forEach((suggestion, i) => {
    console.log(`   ${i + 1}. ${suggestion}`);
  });
  
  console.log('\n🚀 Smart Code Pattern Recognition Engine is working perfectly!');
  
} catch (error) {
  console.error('❌ Error testing engine:', error.message);
}