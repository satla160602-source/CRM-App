// Defines the environment bindings available to the worker
interface Env {
  DB: any; // Cloudflare D1 binding placeholder (replace 'any' if you have a real type)
}

// Add global types for console, fetch, etc.
// (some bundlers strip DOM lib types for workers)
declare const console: Console;
