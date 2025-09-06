// aiAnalyzer.js

const readline = require("readline");

// Convert string to lowercase for easy matching
function toLowerCase(str) {
  return str.toLowerCase();
}

// Function to detect language and analyze code
function analyzeCode(code) {
  const lowerCode = toLowerCase(code);

  console.log("\n🤖 AI Analysis:");

  // ===== Language Detection =====
  if (lowerCode.includes("#include") && lowerCode.includes("printf")) {
    console.log("Language Detected: C");
  } else if (lowerCode.includes("#include") && lowerCode.includes("cout")) {
    console.log("Language Detected: C++");
  } else if (lowerCode.includes("public static void main")) {
    console.log("Language Detected: Java");
  } else if (lowerCode.includes("def ") && lowerCode.includes("print")) {
    console.log("Language Detected: Python");
  } else if (lowerCode.includes("console.log")) {
    console.log("Language Detected: JavaScript");
  } else if (lowerCode.includes("echo") && lowerCode.includes("<?php")) {
    console.log("Language Detected: PHP");
  } else {
    console.log("Language Detected: Unknown (Generic Code)");
  }

  console.log("--------------------------------------");

  // ===== AI-style Analysis =====
  if (
    lowerCode.includes("print") ||
    lowerCode.includes("printf") ||
    lowerCode.includes("console.log")
  ) {
    console.log("• This code prints output to the console.");
  }

  if (lowerCode.includes("if")) {
    console.log("• This code contains conditional statements.");
  }

  if (lowerCode.includes("for") || lowerCode.includes("while")) {
    console.log("• This code has loops for repeating tasks.");
  }

  if (lowerCode.includes("return")) {
    console.log("• This code returns a value from a function.");
  }

  if (lowerCode.includes("class")) {
    console.log("• This code uses Object-Oriented Programming concepts.");
  }

  console.log("• Overall, the code seems logically correct! ✅");
}

// ====== Take Input from User ======
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("===== AI Code Analyzer =====");
rl.question("Paste your code snippet:\n", (code) => {
  analyzeCode(code);
  rl.close();
});
