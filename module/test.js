// Define a function in the module
export function greet(name) {
  return `Hello, ${name}!`;
}

// Call the function and display the result in the HTML
import { greet } from './module.js';

document.getElementById('output').textContent = greet('John');
