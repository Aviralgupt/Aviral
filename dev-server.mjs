import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.pdf': 'application/pdf',
};

// Load .env.local
try {
  const envContent = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim();
        if (!process.env[key]) process.env[key] = val;
      }
    }
  }
} catch {}

async function handleApiRequest(reqPath, req, res) {
  const apiFile = path.join(__dirname, reqPath + '.js');
  if (!fs.existsSync(apiFile)) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'API route not found' }));
    return;
  }
  try {
    const mod = await import(apiFile);
    const handler = mod.default;
    const fakeReq = req;
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      fakeReq.body = JSON.parse(Buffer.concat(chunks).toString() || '{}');
    }
    const fakeRes = {
      statusCode: 200,
      headers: {},
      setHeader(k, v) { this.headers[k] = v; },
      status(code) { this.statusCode = code; return this; },
      json(data) {
        res.writeHead(this.statusCode, { ...this.headers, 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
      },
      end(data) {
        res.writeHead(this.statusCode, this.headers);
        res.end(data);
      },
    };
    await handler(fakeReq, fakeRes);
  } catch (err) {
    console.error('API error:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  let reqPath = url.pathname;

  if (reqPath.startsWith('/api/')) {
    await handleApiRequest(reqPath, req, res);
    return;
  }

  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(__dirname, reqPath);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404);
    res.end('Not Found');
    return;
  }
  const ext = path.extname(filePath);
  const mime = MIME_TYPES[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': mime });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
  console.log(`Dev server running at http://localhost:${PORT}`);
});
