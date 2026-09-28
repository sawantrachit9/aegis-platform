/**
 * AEGIS Platform Production Server
 * Native Node.js HTTP server with REST APIs and static asset streaming.
 * Zero external npm dependencies required.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const BASE_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

// In-memory state for runtime updates
let customSOSIncidents = [];

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = parsedUrl.pathname;

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // REST API Endpoints
  if (pathname === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: "ONLINE",
      system: "AEGIS Climate Defense Platform",
      version: "2.4.0-PROD",
      time: new Date().toISOString(),
      sensorsOnline: 4892,
      satelliteConstellation: "INSAT-3DR / GOES-16 / SENTINEL-1C"
    }));
    return;
  }

  if (pathname === '/api/sos' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        data.id = `SOS-NET-${Date.now()}`;
        data.timestamp = new Date().toISOString();
        customSOSIncidents.push(data);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, incident: data }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Invalid JSON payload" }));
      }
    });
    return;
  }

  if (pathname === '/api/incidents') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ customIncidents: customSOSIncidents }));
    return;
  }

  // Static File Serving
  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  }

  const filePath = path.join(BASE_DIR, pathname);

  // Security check: ensure path is inside BASE_DIR
  if (!filePath.startsWith(BASE_DIR)) {
    res.writeHead(403);
    res.end('Access denied');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Cache-Control': 'no-cache'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` AEGIS — Smart Disaster & Climate Response Platform`);
  console.log(` Running on: http://localhost:${PORT}`);
  console.log(` Production Ready • Zero external dependencies`);
  console.log(`=======================================================`);
});
