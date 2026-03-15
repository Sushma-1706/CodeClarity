// Test Cases for Pattern Recognition Engine
// Comprehensive test suite for validating pattern detection accuracy

export const testCases = {
  fibonacci: {
    recursive: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`,
    iterative: `function fibonacci(n) {
  if (n <= 1) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    let temp = a + b;
    a = b;
    b = temp;
  }
  return b;
}`,
    memoized: `function fibonacci(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  return memo[n];
}`
  },

  binarySearch: {
    iterative: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1;
}`,
    recursive: `function binarySearch(arr, target, left = 0, right = arr.length - 1) {
  if (left > right) return -1;
  
  let mid = Math.floor((left + right) / 2);
  
  if (arr[mid] === target) return mid;
  if (arr[mid] < target) return binarySearch(arr, target, mid + 1, right);
  return binarySearch(arr, target, left, mid - 1);
}`
  },

  bubbleSort: {
    basic: `function bubbleSort(arr) {
  let n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  
  return arr;
}`,
    optimized: `function bubbleSort(arr) {
  let n = arr.length;
  let swapped;
  
  for (let i = 0; i < n - 1; i++) {
    swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  
  return arr;
}`
  },

  linkedList: {
    basic: `class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }
  
  insert(val) {
    const newNode = new ListNode(val);
    newNode.next = this.head;
    this.head = newNode;
  }
  
  search(val) {
    let current = this.head;
    while (current) {
      if (current.val === val) return true;
      current = current.next;
    }
    return false;
  }
}`,
    operations: `function reverseLinkedList(head) {
  let prev = null;
  let current = head;
  
  while (current) {
    let next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }
  
  return prev;
}`
  },

  quickSort: {
    basic: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    let pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  let pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`
  },

  binaryTree: {
    basic: `class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

class BinaryTree {
  constructor() {
    this.root = null;
  }
  
  insert(val) {
    this.root = this.insertRec(this.root, val);
  }
  
  insertRec(node, val) {
    if (!node) return new TreeNode(val);
    
    if (val < node.val) {
      node.left = this.insertRec(node.left, val);
    } else if (val > node.val) {
      node.right = this.insertRec(node.right, val);
    }
    
    return node;
  }
}`,
    traversal: `function inorderTraversal(root) {
  const result = [];
  
  function inorder(node) {
    if (node) {
      inorder(node.left);
      result.push(node.val);
      inorder(node.right);
    }
  }
  
  inorder(root);
  return result;
}`
  },

  designPatterns: {
    singleton: `class Singleton {
  constructor() {
    if (Singleton.instance) {
      return Singleton.instance;
    }
    
    this.data = {};
    Singleton.instance = this;
    return this;
  }
  
  static getInstance() {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }
}`,
    factory: `class ShapeFactory {
  static createShape(type) {
    switch (type.toLowerCase()) {
      case 'circle':
        return new Circle();
      case 'rectangle':
        return new Rectangle();
      case 'triangle':
        return new Triangle();
      default:
        throw new Error('Unknown shape type');
    }
  }
}

class Circle {
  draw() {
    console.log('Drawing a circle');
  }
}`,
    observer: `class Subject {
  constructor() {
    this.observers = [];
  }
  
  subscribe(observer) {
    this.observers.push(observer);
  }
  
  unsubscribe(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }
  
  notify(data) {
    this.observers.forEach(observer => observer.update(data));
  }
}

class Observer {
  update(data) {
    console.log('Observer received:', data);
  }
}`
  },

  dynamicProgramming: {
    knapsack: `function knapsack(capacity, weights, values, n) {
  const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));
  
  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(
          values[i - 1] + dp[i - 1][w - weights[i - 1]],
          dp[i - 1][w]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }
  
  return dp[n][capacity];
}`,
    longestCommonSubsequence: `function lcs(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  
  return dp[m][n];
}`
  },

  graphAlgorithms: {
    dfs: `function dfs(graph, start, visited = new Set()) {
  visited.add(start);
  console.log(start);
  
  for (let neighbor of graph[start] || []) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited);
    }
  }
  
  return visited;
}`,
    bfs: `function bfs(graph, start) {
  const visited = new Set();
  const queue = [start];
  visited.add(start);
  
  while (queue.length > 0) {
    const node = queue.shift();
    console.log(node);
    
    for (let neighbor of graph[node] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  
  return visited;
}`
  }
};

// Expected results for testing
export const expectedResults = {
  fibonacci: {
    recursive: {
      patternId: 'fibonacci-recursive',
      minConfidence: 0.8,
      complexity: { time: 'O(2^n)', space: 'O(n)' }
    }
  },
  binarySearch: {
    iterative: {
      patternId: 'binary-search',
      minConfidence: 0.7,
      complexity: { time: 'O(log n)', space: 'O(1)' }
    }
  },
  bubbleSort: {
    basic: {
      patternId: 'bubble-sort',
      minConfidence: 0.8,
      complexity: { time: 'O(n²)', space: 'O(1)' }
    }
  }
};

// Test runner utility
export class PatternTestRunner {
  constructor(patternEngine: any) {
    this.engine = patternEngine;
    this.results = [];
  }

  runAllTests() {
    console.log('🧪 Running Pattern Recognition Tests...\n');
    
    Object.entries(testCases).forEach(([category, tests]) => {
      console.log(`📂 Testing ${category}:`);
      
      Object.entries(tests).forEach(([testName, code]) => {
        const result = this.engine.analyzeCode(code, 'javascript');
        const testResult = this.validateResult(category, testName, result);
        
        console.log(`  ${testResult.passed ? '✅' : '❌'} ${testName}: ${testResult.message}`);
        this.results.push({ category, testName, ...testResult });
      });
      
      console.log('');
    });
    
    this.printSummary();
  }

  validateResult(category: string, testName: string, result: any) {
    const expected = expectedResults[category]?.[testName];
    
    if (!expected) {
      return { passed: true, message: 'No validation criteria defined' };
    }

    const mainPattern = result.mainPattern;
    
    if (!mainPattern) {
      return { passed: false, message: 'No pattern detected' };
    }

    if (mainPattern.id !== expected.patternId) {
      return { 
        passed: false, 
        message: `Expected ${expected.patternId}, got ${mainPattern.id}` 
      };
    }

    if (mainPattern.confidence < expected.minConfidence) {
      return { 
        passed: false, 
        message: `Low confidence: ${mainPattern.confidence} < ${expected.minConfidence}` 
      };
    }

    return { passed: true, message: `Confidence: ${mainPattern.confidence.toFixed(2)}` };
  }

  printSummary() {
    const total = this.results.length;
    const passed = this.results.filter(r => r.passed).length;
    const failed = total - passed;
    
    console.log('📊 Test Summary:');
    console.log(`  Total: ${total}`);
    console.log(`  ✅ Passed: ${passed}`);
    console.log(`  ❌ Failed: ${failed}`);
    console.log(`  Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
    
    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results
        .filter(r => !r.passed)
        .forEach(r => console.log(`  ${r.category}.${r.testName}: ${r.message}`));
    }
  }
}