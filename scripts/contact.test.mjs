import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { createContactHandler, smtpDelivery } from '../server/contact.mjs';
import { validateInquiry, inquiryText } from '../src/contact/inquiry.js';

const inquiry = (extra = {}) => ({
  services: ['website', 'automation'], name: 'Test Person', email: 'test@example.invalid', company: 'Testfirma',
  message: 'Wir möchten unsere Website erneuern und die Anfragen automatisch zuordnen.',
  budget: '5to15', timing: 'quarter', submissionId: randomUUID(), ...extra,
});

async function api(t, options = {}) {
  const delivered = [];
  const server = createServer(createContactHandler({
    origin: 'https://lucent.example', deliver: async (data) => { delivered.push(data); },
    logger: { error() {} }, ...options,
  }));
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise((resolve) => { server.closeAllConnections(); server.close(resolve); }));
  const url = `http://127.0.0.1:${server.address().port}/api/contact`;
  const post = (body, headers = {}) => fetch(url, {
    method: 'POST', headers: { 'content-type': 'application/json', origin: 'https://lucent.example', ...headers }, body: JSON.stringify(body),
  });
  return { post, url, delivered };
}

test('all four service categories and combinations are delivered with readable labels', async (t) => {
  const { post, delivered } = await api(t);
  for (const services of [['website'], ['automation'], ['ai'], ['software'], ['website', 'ai']]) {
    const response = await post(inquiry({ services }));
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true });
  }
  assert.equal(delivered.length, 5);
  const text = inquiryText(delivered.at(-1));
  assert.match(text, /Bereiche: Website, KI-Projekte/);
  assert.match(text, /Budget: 5.000 bis 15.000 €/);
  assert.match(text, /Zeitpunkt: In den nächsten 3 Monaten/);
});

test('missing fields and invalid categories are rejected without sending', async (t) => {
  const { post, delivered } = await api(t);
  const response = await post(inquiry({ services: [], message: 'Kurz', email: 'falsch', name: '' }));
  assert.equal(response.status, 422);
  const { errors } = await response.json();
  assert.ok(errors.services && errors.message && errors.name && errors.email);
  assert.equal((await post(inquiry({ services: ['__proto__'] }))).status, 422);
  assert.equal((await post(inquiry({ services: [['website']] }))).status, 422);
  assert.equal(delivered.length, 0);
});

test('SMTP/header injection and oversized field values are rejected', () => {
  assert.equal(validateInquiry(inquiry({ email: 'a@b.de\r\nBcc: attacker@example.invalid' })).valid, false);
  assert.equal(validateInquiry(inquiry({ name: 'A\r\nBcc: attacker@example.invalid' })).valid, false);
  assert.equal(validateInquiry(inquiry({ message: 'x'.repeat(5001) })).valid, false);
  assert.equal(validateInquiry(inquiry({ budget: 'made-up', timing: 'made-up' })).valid, false);
});

test('duplicate retries send only one email, including concurrent retries', async (t) => {
  let sends = 0;
  const { post } = await api(t, { deliver: async () => { sends++; await new Promise((resolve) => setTimeout(resolve, 40)); } });
  const data = inquiry();
  const responses = await Promise.all([post(data), post(data)]);
  assert.deepEqual(responses.map((response) => response.status), [200, 200]);
  assert.equal((await post(data)).status, 200);
  assert.equal(sends, 1);
  assert.equal((await post({ ...data, message: `${data.message} Geändert.` })).status, 409);
});

test('unconfigured SMTP never returns a fake confirmation', async (t) => {
  const { post } = await api(t, { deliver: null });
  const response = await post(inquiry());
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { ok: false });
  assert.equal(smtpDelivery({}), null);
});

test('delivery failure allows retry with the same submission ID', async (t) => {
  let sends = 0;
  const { post } = await api(t, { deliver: async () => { if (++sends === 1) throw new Error('SMTP down'); } });
  const data = inquiry();
  assert.equal((await post(data)).status, 502);
  assert.equal((await post(data)).status, 200);
  assert.equal(sends, 2);
});

test('honeypot submissions are discarded', async (t) => {
  const { post, delivered } = await api(t);
  assert.equal((await post(inquiry({ url: 'https://spam.example' }))).status, 200);
  assert.equal(delivered.length, 0);
});

test('repeated submissions are limited and recover after the time window', async (t) => {
  let clock = 1000000;
  const { post } = await api(t, { now: () => clock });
  for (let n = 0; n < 5; n++) assert.equal((await post(inquiry())).status, 200);
  const limited = await post(inquiry());
  assert.equal(limited.status, 429);
  assert.ok(Number(limited.headers.get('retry-after')) > 0);
  clock += 600001;
  assert.equal((await post(inquiry())).status, 200);
});

test('foreign origins, wrong methods and malformed JSON cannot send mail', async (t) => {
  const { post, url, delivered } = await api(t);
  assert.equal((await post(inquiry(), { origin: 'https://foreign.example' })).status, 403);
  assert.equal((await fetch(url)).status, 405);
  assert.equal((await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{' })).status, 400);
  assert.equal((await post(inquiry(), { 'content-type': 'text/plain' })).status, 415);
  assert.equal(delivered.length, 0);
});

test('SMTP credentials and sender configuration stay on the server', () => {
  assert.throws(() => smtpDelivery({ SMTP_HOST: 'example.invalid', SMTP_USER: 'user', SMTP_PASS: 'password', CONTACT_FROM: 'invalid', CONTACT_TO: 'recipient@example.invalid' }), /email address/);
});

test('oversized request bodies are rejected before delivery', async (t) => {
  const { post, delivered } = await api(t);
  assert.equal((await post(inquiry({ message: 'x'.repeat(17000) }))).status, 413);
  assert.equal(delivered.length, 0);
});
