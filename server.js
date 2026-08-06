/*
 * @license
 * Copyright 2026 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const ROUTE_MAP = {
  '/': 'index.html',
  '/index.html': 'index.html',
  '/ecommerce': 'ecommerce.html',
  '/ecommerce.html': 'ecommerce.html',
  '/actions': 'actions.html',
  '/actions.html': 'actions.html',
  '/passkey-button': 'passkey-button.html',
  '/passkey-button.html': 'passkey-button.html',
  '/reauth': 'reauth.html',
  '/reauth.html': 'reauth.html',
  '/community': 'community.html',
  '/community.html': 'community.html',
  '/gated': 'gated.html',
  '/gated.html': 'gated.html',
  '/switcher': 'switcher.html',
  '/switcher.html': 'switcher.html',
  '/register': 'register.html',
  '/register.html': 'register.html',
};

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // API endpoints for WebAuthn passkey registration & immediate authentication
  if (pathname === '/api/webauthn/challenge') {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(
      JSON.stringify({
        challenge: 'c2VzYW1lLWltbWVkaWF0ZS11aS1tb2RlLWNoYWxsZW5nZQ==',
        rpId: 'localhost',
      })
    );
    return;
  }

  if (pathname === '/api/webauthn/verify') {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(
      JSON.stringify({
        status: 'ok',
        user: {
          username: 'Elisa Beckett',
          email: 'elisa.beckett@demogmail.com',
          credentialType: 'passkey',
          provider: 'Google Password Manager',
        },
      })
    );
    return;
  }

  if (pathname === '/api/webauthn/register-challenge') {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(
      JSON.stringify({
        challenge: 'c2VzYW1lLXJlZ2lzdGVyLWNoYWxsZW5nZS1wYXNza2V5',
        rp: {
          name: 'Immediate UI Mode Showcase',
          id: 'localhost',
        },
        user: {
          id: 'dXNlci1pZC0xMjM0NQ==',
          name: 'elisa.beckett@demogmail.com',
          displayName: 'Elisa Beckett',
        },
      })
    );
    return;
  }

  if (pathname === '/api/webauthn/register-verify') {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(
      JSON.stringify({
        status: 'ok',
        message: 'Passkey registered successfully for localhost!',
      })
    );
    return;
  }

  // Determine file to serve
  let relPath = ROUTE_MAP[pathname];
  if (!relPath) {
    if (pathname.startsWith('/static/')) {
      relPath = pathname.slice(1);
    } else {
      // Check if raw html exists
      const cleanPath = pathname.replace(/^\//, '');
      if (fs.existsSync(path.join(PUBLIC_DIR, cleanPath))) {
        relPath = cleanPath;
      } else if (fs.existsSync(path.join(PUBLIC_DIR, cleanPath + '.html'))) {
        relPath = cleanPath + '.html';
      }
    }
  }

  if (!relPath) {
    res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(`
      <!DOCTYPE html>
      <html>
      <head><title>404 Not Found | Immediate UI Mode Showcase</title></head>
      <body style="font-family:sans-serif; text-align:center; padding:50px;">
        <h1>404 - Page Not Found</h1>
        <p>The requested URL <code>${pathname}</code> was not found on this demo server.</p>
        <a href="/">Return to Immediate UI Mode Hub</a>
      </body>
      </html>
    `);
    return;
  }

  const filePath = path.join(PUBLIC_DIR, relPath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      console.error(`[500] Error serving ${filePath}:`, err);
      res.writeHead(500, {'Content-Type': 'text/plain'});
      res.end('500 Internal Server Error');
      return;
    }
    res.writeHead(200, {'Content-Type': contentType});
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log('===============================================================');
  console.log('🚀 Immediate UI Mode Standalone Showcase Server Running!');
  console.log(`🌐 Open in your browser: http://localhost:${PORT}`);
  console.log('===============================================================');
});
