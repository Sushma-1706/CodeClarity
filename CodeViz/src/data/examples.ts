/**
 * Collection of code examples for the Load Example feature
 * Each example has a name, language, and code content
 */

export interface CodeExample {
  id: string;
  name: string;
  language: string;
  code: string;
}

export const codeExamples: CodeExample[] = [
  {
    id: "js-fibonacci",
    name: "JavaScript Fibonacci",
    language: "javascript",
    code: `// Recursive Fibonacci implementation
function fibonacci(n) {
  // Base cases for the recursion
  if (n <= 1) return n;
  
  // Recursive case: fib(n) = fib(n-1) + fib(n-2)
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Test the function with a value
console.log(fibonacci(10)); // Output: 55
`,
  },
  {
    id: "py-quicksort",
    name: "Python Quicksort",
    language: "python",
    code: `# Quicksort implementation in Python

def quicksort(arr):
    """
    Sorts an array using the quicksort algorithm
    
    Args:
        arr: List of comparable elements
        
    Returns:
        Sorted list
    """
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return quicksort(left) + middle + quicksort(right)

# Test the function
numbers = [3, 6, 8, 10, 1, 2, 1]
print(quicksort(numbers))  # Output: [1, 1, 2, 3, 6, 8, 10]
`,
  },
  {
    id: "java-binary-search",
    name: "Java Binary Search",
    language: "java",
    code: `/**
 * Binary search implementation in Java
 */
public class BinarySearch {
    // Returns index of target if found, otherwise -1
    public static int binarySearch(int[] arr, int target) {
        int left = 0;
        int right = arr.length - 1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            
            // Check if target is present at mid
            if (arr[mid] == target)
                return mid;
            
            // If target greater, ignore left half
            if (arr[mid] < target)
                left = mid + 1;
            
            // If target smaller, ignore right half
            else
                right = mid - 1;
        }
        
        // Target not found
        return -1;
    }
    
    public static void main(String[] args) {
        int[] arr = { 2, 3, 4, 10, 40 };
        int target = 10;
        int result = binarySearch(arr, target);
        
        if (result == -1)
            System.out.println("Element not present");
        else
            System.out.println("Element found at index " + result);
    }
}
`,
  },
  {
    id: "cpp-linked-list",
    name: "C++ Linked List",
    language: "cpp",
    code: `// Simple linked list implementation in C++
#include <iostream>
using namespace std;

// Node class
class Node {
public:
    int data;
    Node* next;
    
    // Constructor
    Node(int val) {
        data = val;
        next = nullptr;
    }
};

// Linked list class
class LinkedList {
private:
    Node* head;
    
public:
    // Constructor
    LinkedList() {
        head = nullptr;
    }
    
    // Insert at beginning
    void insertAtBeginning(int val) {
        Node* newNode = new Node(val);
        newNode->next = head;
        head = newNode;
    }
    
    // Print the list
    void printList() {
        Node* temp = head;
        while(temp != nullptr) {
            cout << temp->data << " -> ";
            temp = temp->next;
        }
        cout << "nullptr" << endl;
    }
};

// Main function
int main() {
    LinkedList list;
    
    // Insert some values
    list.insertAtBeginning(5);
    list.insertAtBeginning(10);
    list.insertAtBeginning(15);
    
    // Print the list
    cout << "Linked List: ";
    list.printList();
    
    return 0;
}
`,
  },
  {
    id: "js-queue",
    name: "JavaScript Queue",
    language: "javascript",
    code: `// Queue implementation using array
class Queue {
  constructor() {
    this.items = [];
    this.front = 0;
    this.rear = -1;
  }
  
  // Add element to the rear of queue
  enqueue(element) {
    this.rear++;
    this.items[this.rear] = element;
  }
  
  // Remove element from the front of queue
  dequeue() {
    if (this.isEmpty()) {
      return "Queue is empty";
    }
    const element = this.items[this.front];
    this.front++;
    return element;
  }
  
  // View the front element without removing it
  peek() {
    if (this.isEmpty()) {
      return "Queue is empty";
    }
    return this.items[this.front];
  }
  
  // Check if queue is empty
  isEmpty() {
    return this.front > this.rear;
  }
  
  // Get queue size
  size() {
    return this.rear - this.front + 1;
  }
}

// Test the queue
const queue = new Queue();
queue.enqueue(10);
queue.enqueue(20);
queue.enqueue(30);
console.log("Front element:", queue.peek());
console.log("Dequeued:", queue.dequeue());
console.log("Queue size:", queue.size());
`,
  },
  {
    id: "js-stack",
    name: "JavaScript Stack",
    language: "javascript",
    code: `// Stack implementation using array
class Stack {
  constructor() {
    this.items = [];
    this.top = -1;
  }
  
  // Add element to the top of stack
  push(element) {
    this.top++;
    this.items[this.top] = element;
  }
  
  // Remove element from the top of stack
  pop() {
    if (this.isEmpty()) {
      return "Stack is empty";
    }
    const element = this.items[this.top];
    this.top--;
    return element;
  }
  
  // View the top element without removing it
  peek() {
    if (this.isEmpty()) {
      return "Stack is empty";
    }
    return this.items[this.top];
  }
  
  // Check if stack is empty
  isEmpty() {
    return this.top === -1;
  }
  
  // Get stack size
  size() {
    return this.top + 1;
  }
}

// Test the stack
const stack = new Stack();
stack.push(10);
stack.push(20);
stack.push(30);
console.log("Top element:", stack.peek());
console.log("Popped:", stack.pop());
console.log("Stack size:", stack.size());
`,
  },
  {
    id: "js-binary-tree",
    name: "JavaScript Binary Tree",
    language: "javascript",
    code: `// Binary Tree Node
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

// Binary Tree class
class BinaryTree {
  constructor() {
    this.root = null;
  }
  
  // Insert a new node
  insert(value) {
    const newNode = new TreeNode(value);
    
    if (!this.root) {
      this.root = newNode;
      return;
    }
    
    this.insertNode(this.root, newNode);
  }
  
  insertNode(node, newNode) {
    if (newNode.value < node.value) {
      if (!node.left) {
        node.left = newNode;
      } else {
        this.insertNode(node.left, newNode);
      }
    } else {
      if (!node.right) {
        node.right = newNode;
      } else {
        this.insertNode(node.right, newNode);
      }
    }
  }
  
  // Inorder traversal (Left, Root, Right)
  inorder(node = this.root) {
    if (node) {
      this.inorder(node.left);
      console.log(node.value);
      this.inorder(node.right);
    }
  }
  
  // Preorder traversal (Root, Left, Right)
  preorder(node = this.root) {
    if (node) {
      console.log(node.value);
      this.preorder(node.left);
      this.preorder(node.right);
    }
  }
  
  // Postorder traversal (Left, Right, Root)
  postorder(node = this.root) {
    if (node) {
      this.postorder(node.left);
      this.postorder(node.right);
      console.log(node.value);
    }
  }
}

// Test the binary tree
const tree = new BinaryTree();
tree.insert(10);
tree.insert(5);
tree.insert(15);
tree.insert(3);
tree.insert(7);
tree.insert(12);
tree.insert(18);

console.log("Inorder traversal:");
tree.inorder();
`,
  },
  {
    id: "js-graph-dfs",
    name: "JavaScript Graph DFS",
    language: "javascript",
    code: `// Graph implementation using adjacency list
class Graph {
  constructor() {
    this.vertices = new Map();
  }
  
  // Add a vertex
  addVertex(vertex) {
    this.vertices.set(vertex, []);
  }
  
  // Add an edge between two vertices
  addEdge(vertex1, vertex2) {
    this.vertices.get(vertex1).push(vertex2);
    this.vertices.get(vertex2).push(vertex1); // For undirected graph
  }
  
  // Depth-First Search (DFS)
  dfs(startVertex, visited = new Set()) {
    visited.add(startVertex);
    console.log(startVertex);
    
    const neighbors = this.vertices.get(startVertex);
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        this.dfs(neighbor, visited);
      }
    }
  }
  
  // Breadth-First Search (BFS)
  bfs(startVertex) {
    const queue = [startVertex];
    const visited = new Set([startVertex]);
    
    while (queue.length > 0) {
      const vertex = queue.shift();
      console.log(vertex);
      
      const neighbors = this.vertices.get(vertex);
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
  }
}

// Test the graph
const graph = new Graph();
graph.addVertex('A');
graph.addVertex('B');
graph.addVertex('C');
graph.addVertex('D');
graph.addVertex('E');

graph.addEdge('A', 'B');
graph.addEdge('A', 'C');
graph.addEdge('B', 'D');
graph.addEdge('C', 'E');

console.log("DFS traversal starting from A:");
graph.dfs('A');

console.log("\\nBFS traversal starting from A:");
graph.bfs('A');
`,
  },
  {
    id: "js-merge-sort",
    name: "JavaScript Merge Sort",
    language: "javascript",
    code: `// Merge Sort implementation
function mergeSort(arr) {
  // Base case: array with 0 or 1 element is already sorted
  if (arr.length <= 1) {
    return arr;
  }
  
  // Divide: split array into two halves
  const mid = Math.floor(arr.length / 2);
  const leftHalf = arr.slice(0, mid);
  const rightHalf = arr.slice(mid);
  
  // Conquer: recursively sort both halves
  const sortedLeft = mergeSort(leftHalf);
  const sortedRight = mergeSort(rightHalf);
  
  // Combine: merge the sorted halves
  return merge(sortedLeft, sortedRight);
}

// Merge two sorted arrays
function merge(left, right) {
  const result = [];
  let leftIndex = 0;
  let rightIndex = 0;
  
  // Compare elements from both arrays and add smaller one to result
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] <= right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }
  
  // Add remaining elements from left array
  while (leftIndex < left.length) {
    result.push(left[leftIndex]);
    leftIndex++;
  }
  
  // Add remaining elements from right array
  while (rightIndex < right.length) {
    result.push(right[rightIndex]);
    rightIndex++;
  }
  
  return result;
}

// Test the merge sort
const numbers = [64, 34, 25, 12, 22, 11, 90];
console.log("Original array:", numbers);
const sorted = mergeSort(numbers);
console.log("Sorted array:", sorted);
`,
  },
  {
    id: "js-heap-sort",
    name: "JavaScript Heap Sort",
    language: "javascript",
    code: `// Heap Sort implementation
function heapSort(arr) {
  const n = arr.length;
  
  // Build max heap (rearrange array)
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  
  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    // Move current root to end
    [arr[0], arr[i]] = [arr[i], arr[0]];
    
    // Call heapify on the reduced heap
    heapify(arr, i, 0);
  }
  
  return arr;
}

// To heapify a subtree rooted with node i
function heapify(arr, n, i) {
  let largest = i; // Initialize largest as root
  const left = 2 * i + 1; // Left child
  const right = 2 * i + 2; // Right child
  
  // If left child is larger than root
  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }
  
  // If right child is larger than largest so far
  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }
  
  // If largest is not root
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    
    // Recursively heapify the affected sub-tree
    heapify(arr, n, largest);
  }
}

// Test the heap sort
const numbers = [12, 11, 13, 5, 6, 7];
console.log("Original array:", numbers);
const sorted = heapSort([...numbers]); // Create a copy to preserve original
console.log("Sorted array:", sorted);
`,
  },
];
