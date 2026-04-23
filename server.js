const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");
const path = require("path");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const MANIFEST_PATH = path.join(__dirname, ".next", "server", "middleware-manifest.json");
const MANIFEST_CONTENT = JSON.stringify({
  version: 2,
  middleware: {},
  functions: {},
  sortedMiddleware: [],
});

function ensureManifest() {
  const dir = path.dirname(MANIFEST_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(MANIFEST_PATH)) {
    fs.writeFileSync(MANIFEST_PATH, MANIFEST_CONTENT);
  }
}

// Watch and recreate the manifest if it gets deleted during compilation
function watchManifest() {
  const dir = path.dirname(MANIFEST_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  fs.watch(dir, (event, filename) => {
    if (filename === "middleware-manifest.json" && !fs.existsSync(MANIFEST_PATH)) {
      fs.writeFileSync(MANIFEST_PATH, MANIFEST_CONTENT);
    }
  });
}

ensureManifest();
watchManifest();

app.prepare().then(() => {
  ensureManifest();

  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});
