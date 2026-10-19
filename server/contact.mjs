import { createServer } from 'node:http';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import nodemailer from 'nodemailer';
import { SERVICES, inquiryText, validateInquiry } from '../src/contact/inquiry.js';

export function createContactHandler({ deliver, origin, trustProxy = false, now = Date.now, logger = console } = {}) {
  const attempts = new Map();
  const submissions = new Map();
  const windowMs = 10 * 60 * 1000;
  let lastPrune = 0;

  return async (req, res) => {
    const respond = (status, body) => {
      res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
      res.end(JSON.stringify(body));
    };
    if (req.url !== '/api/contact') return respond(404, { ok: false });
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return respond(405, { ok: false });
    }
    const allowedOrigins = Array.isArray(origin) ? origin : [origin || `http://${req.headers.host}`];
    if (req.headers.origin && !allowedOrigins.includes(req.headers.origin)) return respond(403, { ok: false });
    if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] || '')) return respond(415, { ok: false });
    if (Number(req.headers['content-length']) > 16384) {
      req.resume();
      return respond(413, { ok: false });
    }

    const time = now();
    if (time - lastPrune >= 60000) {
      for (const [key, value] of attempts) if (value.until <= time) attempts.delete(key);
      for (const [key, value] of submissions) if (value.until <= time && value.done) submissions.delete(key);
      lastPrune = time;
    }
    const peer = req.socket.remoteAddress;
    const local = ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(peer);
    const ip = trustProxy && local ? req.headers['x-real-ip'] || peer : peer;
    const bucket = attempts.get(ip) || { count: 0, until: time + windowMs };
    if (bucket.until <= time) { bucket.count = 0; bucket.until = time + windowMs; }
    if (bucket.count >= 5 || attempts.size > 10000 || submissions.size > 10000) {
      res.setHeader('Retry-After', String(Math.max(1, Math.ceil((bucket.until - time) / 1000))));
      return respond(429, { ok: false });
    }
    bucket.count++;
    attempts.set(ip, bucket);

    let input;
    try {
      let size = 0;
      const chunks = [];
      for await (const chunk of req) {
        size += chunk.length;
        if (size > 16384) return respond(413, { ok: false });
        chunks.push(chunk);
      }
      input = JSON.parse(Buffer.concat(chunks).toString('utf8'));
      if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('invalid');
    } catch {
      return respond(400, { ok: false });
    }
    if (typeof input.url === 'string' && input.url.trim()) return respond(200, { ok: true });
    const { data, errors, valid } = validateInquiry(input);
    if (!valid) return respond(422, { ok: false, errors });
    if (!/^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i.test(input.submissionId || '')) return respond(400, { ok: false });
    if (!deliver) return respond(503, { ok: false });

    const hash = createHash('sha256').update(JSON.stringify(data)).digest('hex');
    let entry = submissions.get(input.submissionId);
    if (entry && entry.hash !== hash) return respond(409, { ok: false });
    if (!entry) {
      entry = { hash, until: time + windowMs, done: false };
      submissions.set(input.submissionId, entry);
      entry.result = Promise.resolve().then(() => deliver(data)).then(() => {
        entry.done = true;
        return true;
      }).catch((error) => {
        submissions.delete(input.submissionId);
        logger.error('Contact delivery failed:', error.code || 'DELIVERY_ERROR');
        return false;
      });
    }
    const sent = await entry.result;
    return respond(sent ? 200 : 502, { ok: sent });
  };
}

export function smtpDelivery(env = process.env) {
  const required = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'CONTACT_FROM', 'CONTACT_TO'];
  if (required.some((key) => !env[key])) return null;
  const address = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
  if (!address.test(env.CONTACT_FROM) || !address.test(env.CONTACT_TO)) throw new Error('CONTACT_FROM and CONTACT_TO must each contain one email address.');
  const port = Number(env.SMTP_PORT || 587);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid SMTP_PORT');
  const transport = nodemailer.createTransport({
    host: env.SMTP_HOST, port, secure: port === 465, requireTLS: port !== 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    connectionTimeout: 8000, greetingTimeout: 8000, socketTimeout: 10000, dnsTimeout: 5000,
    disableFileAccess: true, disableUrlAccess: true,
  });
  return async (data) => {
    const info = await transport.sendMail({
      from: { name: 'Lucent Solutions', address: env.CONTACT_FROM }, to: env.CONTACT_TO,
      replyTo: { name: data.name, address: data.email },
      subject: `Projektanfrage: ${data.services.map((key) => SERVICES[key]).join(', ')}`,
      text: inquiryText(data),
    });
    if (!info.accepted?.length) throw new Error('Recipient not accepted');
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (existsSync('.env')) process.loadEnvFile('.env');
  const deliver = smtpDelivery();
  const origin = process.env.PUBLIC_ORIGIN || ['http://127.0.0.1:5173', 'http://localhost:5173', 'http://127.0.0.1:4173', 'http://localhost:4173'];
  const port = Number(process.env.CONTACT_PORT || 8787);
  const server = createServer({ requestTimeout: 15000, headersTimeout: 10000 }, createContactHandler({ deliver, origin, trustProxy: process.env.TRUST_PROXY === '1' }));
  server.listen(port, '127.0.0.1', () => {
    console.log(`Contact API: http://127.0.0.1:${port}`);
    if (!deliver) console.log('SMTP is not configured. Submissions return 503 until configuration is complete.');
  });
}
