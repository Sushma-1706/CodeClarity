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
];
