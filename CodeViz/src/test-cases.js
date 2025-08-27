// JavaScript Error Test Cases
const jsTestCases = {
  syntaxError: `
    // Missing parenthesis
    function test(a, b {
      return a + b;
    }
  `,
  
  referenceError: `
    // Undefined variable
    console.log(undefinedVariable);
  `,
  
  typeError: `
    // Invalid method call
    const num = 42;
    num.toLowerCase();
  `,
  
  indentationError: `
    function test() {
       const a = 1;
          const b = 2;
      return a + b;
    }
  `
};

// Python Error Test Cases
const pythonTestCases = {
  syntaxError: `
    # Missing colon after for loop
    for i in range(10)
        print(i)
  `,
  
  indentationError: `
    def calculate():
       result = 0
          for i in range(10):
       result += i
    return result
  `,
  
  nameError: `
    # Undefined variable
    print(undefined_variable)
  `,
  
  typeError: `
    # Invalid operation
    text = "Hello"
    result = text + 42
  `
};

// To test, copy and paste these into the CodeEditor component
// and observe the error messages and hints provided
