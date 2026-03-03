#!/usr/bin/env node
import { createRequire } from "module";
import { spawn } from "child_process";

const require = createRequire(import.meta.url);

// Get the CLI entry point
let cliPath;
try {
  cliPath = require.resolve("@mini-passy/cli/dist/index.js");
} catch {
  // Fallback to local dist during development
  cliPath = new URL("../dist/index.js", import.meta.url).pathname;
}

// For now, spawn the SDK server directly
const gatewayPath = require.resolve("@mini-passy/sdk/dist/index.js");

const proc = spawn("node", [gatewayPath], {
  stdio: "inherit",
  env: process.env,
});

proc.on("exit", (code) => {
  process.exit(code || 0);
});
