const http = require("http");
const fs = require("fs");
const path = require("path");
const chatHandler = require("./api/chat");

const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 4173);
const root = path.resolve(__dirname, "dist");

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function createResponseAdapter(response) {
  return {
    status(code) {
      response.statusCode = code;
      return this;
    },
    json(payload) {
      response.setHeader("Content-Type", "application/json; charset=utf-8");
      response.end(JSON.stringify(payload));
    },
  };
}

const server = http.createServer((request, response) => {
  if (request.method === "POST" && request.url.split("?")[0] === "/api/chat") {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;
    });

    request.on("end", async () => {
      const responseAdapter = createResponseAdapter(response);

      try {
        request.body = body ? JSON.parse(body) : {};
      } catch (error) {
        responseAdapter.status(400).json({ message: "Invalid JSON body." });
        return;
      }

      try {
        await chatHandler(request, responseAdapter);
      } catch (error) {
        responseAdapter.status(500).json({
          message: error instanceof Error ? error.message : "Chat server error.",
        });
      }
    });

    return;
  }

  const requestedPath = decodeURIComponent(request.url.split("?")[0]);
  const relativePath = requestedPath === "/" ? "/index.html" : requestedPath;
  const filePath = path.normalize(path.join(root, relativePath));

  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "Content-Type":
        contentTypes[path.extname(filePath).toLowerCase()] ||
        "application/octet-stream",
    });
    response.end(content);
  });
});

server.listen(port, host, () => {
  console.log(`Malfit is running at http://${host}:${port}`);
});
