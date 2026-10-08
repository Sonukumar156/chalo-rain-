// Apne computer par test karne ke liye. Chalane ka tareeka README mein hai.
import http from 'http';
import fs from 'fs';
import os from 'os';
import live from './api/live.js';
import pnr from './api/pnr.js';
import seats from './api/seats.js';
import between from './api/between.js';
import stations from './api/stations.js';
import classes from './api/classes.js';
import prediction from './api/prediction.js';

const handlers = {
  '/api/prediction': prediction,
  '/api/live': live, '/api/pnr': pnr, '/api/seats': seats,
  '/api/between': between, '/api/stations': stations, '/api/classes': classes,
};

try {
  process.env.RAILRADAR_API_KEY = fs.readFileSync('key.txt', 'utf8').trim();
} catch {
  console.log('key.txt file nahi mili! Isi folder mein key.txt banao aur usme apni RailRadar key daalo.');
  process.exit(1);
}

http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://localhost');
  const handler = handlers[u.pathname];
  if (handler) {
    const out = {
      code: 200,
      setHeader: (k, v) => res.setHeader(k, v),
      status(c) { this.code = c; return this; },
      json(o) { res.writeHead(this.code, { 'content-type': 'application/json' }); res.end(JSON.stringify(o)); },
    };
    return handler({ query: Object.fromEntries(u.searchParams) }, out);
  }
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  res.end(fs.readFileSync('index.html'));
}).listen(3001, '0.0.0.0', () => {
  console.log('Chalu ho gaya!');
  console.log('Isi computer par kholo:  http://localhost:3001');
  for (const list of Object.values(os.networkInterfaces())) {
    for (const a of list || []) {
      if (a.family === 'IPv4' && !a.internal) console.log('Phone par kholo (same Wi-Fi):  http://' + a.address + ':3001');
    }
  }
});
