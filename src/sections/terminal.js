/**
 * Illustrative agent run, typed out when the terminal scrolls into view, then looped.
 */
const LINES = [
  { cls: 't-cmd', text: 'lucent agent run rechnungseingang --quelle=postfach', prompt: true },
  { cls: 't-info', text: '◇ Verbinde mit Postfach …              verbunden' },
  { cls: 't-info', text: '◇ 1.284 neue Dokumente gefunden' },
  { progress: 'klassifiziere Dokumente' },
  { cls: 't-ok', text: '✓ Rechnungsdaten extrahiert           Ø 0,8 s / Dok.' },
  { cls: 't-ok', text: '✓ Plausibilitätsprüfung               12 Abweichungen' },
  { cls: 't-ok', text: '✓ Buchungen im ERP angelegt           1.272 / 1.284' },
  { cls: 't-warn', text: '→ 12 Fälle zur Freigabe an die Buchhaltung' },
  { cls: 't-res', text: '\n◆ Ergebnis: ~37 h manuelle Arbeit pro Woche eingespart' },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function initTerminal({ reduced = false } = {}) {
  const term = document.querySelector('[data-terminal]');
  if (!term) return;
  const body = term.querySelector('.terminal__body');
  let running = false;
  let visible = false;

  const span = (cls, text = '') => {
    const s = document.createElement('span');
    s.className = cls;
    s.textContent = text;
    return s;
  };

  const caret = span('caret');

  const renderStatic = () => {
    body.textContent = '';
    for (const l of LINES) {
      if (l.progress) body.append(span('t-bar', `[████████████████████] 100%  ${l.progress}\n`));
      else {
        if (l.prompt) body.append(span('t-prompt', '$ '));
        body.append(span(l.cls, `${l.text}\n`));
      }
    }
  };

  if (reduced) {
    renderStatic();
    return;
  }

  async function run() {
    running = true;
    while (visible) {
      body.textContent = '';
      body.append(caret);
      for (const l of LINES) {
        if (!visible) break;
        if (l.progress) {
          const el = span('t-bar');
          body.insertBefore(el, caret);
          for (let p = 0; p <= 20; p++) {
            el.textContent = `[${'█'.repeat(p)}${'░'.repeat(20 - p)}] ${String(p * 5).padStart(3)}%  ${l.progress}\n`;
            await sleep(55);
          }
          continue;
        }
        if (l.prompt) {
          body.insertBefore(span('t-prompt', '$ '), caret);
          const el = span(l.cls);
          body.insertBefore(el, caret);
          for (const ch of l.text) {
            el.textContent += ch;
            await sleep(22 + Math.random() * 30);
          }
          el.textContent += '\n';
          await sleep(420);
        } else {
          body.insertBefore(span(l.cls, `${l.text}\n`), caret);
          await sleep(l.cls === 't-ok' ? 520 : 340);
        }
      }
      body.insertBefore(span('t-prompt', '$ '), caret);
      await sleep(5200);
    }
    running = false;
  }

  new IntersectionObserver(
    ([e]) => {
      visible = e.isIntersecting;
      if (visible && !running) run();
    },
    { threshold: 0.35 },
  ).observe(term);
}
