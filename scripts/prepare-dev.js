#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const serverDir = path.join(__dirname, "..", ".next", "server");
const manifestPath = path.join(serverDir, "middleware-manifest.json");

fs.mkdirSync(serverDir, { recursive: true });

fs.writeFileSync(
  manifestPath,
  JSON.stringify({ version: 2, middleware: {}, functions: {}, sortedMiddleware: [] }, null, 2)
);

console.log("✓ middleware-manifest.json pre-created");
