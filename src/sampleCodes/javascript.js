/**
 * JavaScript Sample Code
 * Demonstrates various syntax features and token types
 */

// Constants and variables
const PI = 3.14159265359;
const MAX_SIZE = 0xff;
const SCIENTIFIC = 1.5e10;
let counter = 0;
var globalFlag = true;

// Regular expression
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const urlPattern = /https?:\/\/[\w\-]+(\.[\w\-]+)+/gi;

// Template literal and string
const name = "Alice";
const greeting = `Hello, ${name}! Today is ${new Date().toLocaleDateString()}`;
const multiLine = `
  This is a
  multi-line string
`;

// Array and object literals
const numbers = [1, 2, 3, 4, 5];
const config = {
  host: "localhost",
  port: 8080,
  secure: false,
  tags: ["api", "v2"],
};

// Destructuring
const { host, port, ...rest } = config;
const [first, second, ...remaining] = numbers;

// Arrow functions and callbacks
const double = (x) => x * 2;
const add = (a, b) => {
  const sum = a + b;
  return sum;
};

// Higher-order functions
const processed = numbers
  .filter((n) => n > 2)
  .map((n) => n * 2)
  .reduce((acc, n) => acc + n, 0);

// Class definition
class EventEmitter {
  #listeners = new Map();
  static instanceCount = 0;

  constructor(name) {
    this.name = name;
    EventEmitter.instanceCount++;
  }

  on(event, callback) {
    if (!this.#listeners.has(event)) {
      this.#listeners.set(event, []);
    }
    this.#listeners.get(event).push(callback);
    return this;
  }

  emit(event, ...args) {
    const callbacks = this.#listeners.get(event) ?? [];
    callbacks.forEach((cb) => cb(...args));
  }

  get listenerCount() {
    let count = 0;
    this.#listeners.forEach((arr) => (count += arr.length));
    return count;
  }
}

// Async/await and Promises
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch failed:", error.message);
    return null;
  } finally {
    console.log("Fetch attempt completed");
  }
}

// Generator function
function* fibonacci(limit) {
  let [a, b] = [0, 1];
  while (a < limit) {
    yield a;
    [a, b] = [b, a + b];
  }
}

// Symbol and iterator
const mySymbol = Symbol("unique");
const iterable = {
  [Symbol.iterator]() {
    let step = 0;
    return {
      next() {
        step++;
        return step <= 3 ? { value: step, done: false } : { done: true };
      },
    };
  },
};

// Proxy and Reflect
const handler = {
  get(target, prop) {
    console.log(`Getting ${prop}`);
    return Reflect.get(target, prop);
  },
  set(target, prop, value) {
    console.log(`Setting ${prop} to ${value}`);
    return Reflect.set(target, prop, value);
  },
};

const proxy = new Proxy({ count: 0 }, handler);

// Control flow
for (let i = 0; i < 10; i++) {
  if (i % 2 === 0) continue;
  console.log(i);
}

while (counter < 5) {
  counter++;
}

switch (config.port) {
  case 80:
    console.log("HTTP");
    break;
  case 443:
    console.log("HTTPS");
    break;
  default:
    console.log("Custom port");
}

// Nullish coalescing and optional chaining
const value = config.missing ?? "default";
const nested = config?.nested?.deep?.value;

// Export
export { EventEmitter, fetchData, fibonacci };
export default config;
