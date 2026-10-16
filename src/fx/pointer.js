import gsap from 'gsap';

const finePointer = () => matchMedia('(hover: hover) and (pointer: fine)').matches;

/** Custom cursor: instant dot + trailing ring that reacts to interactive elements. */
export function initCursor() {
  if (!finePointer()) return;
  const root = document.documentElement;
  const dot = document.querySelector('.cursor__dot');
  const ring = document.querySelector('.cursor__ring');
  const label = document.querySelector('.cursor__label');
  if (!dot || !ring) return;

  root.classList.add('has-cursor');
  const pos = { x: innerWidth / 2, y: innerHeight / 2 };
  const trail = { ...pos };
  let visible = false;

  addEventListener('pointermove', (e) => {
    pos.x = e.clientX;
    pos.y = e.clientY;
    dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
    if (!visible) {
      visible = true;
      trail.x = pos.x;
      trail.y = pos.y;
      gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
    }
  });
  document.addEventListener('pointerleave', () => {
    visible = false;
    gsap.to([dot, ring], { opacity: 0, duration: 0.3 });
  });
  addEventListener('pointerdown', () => root.classList.add('cursor-down'));
  addEventListener('pointerup', () => root.classList.remove('cursor-down'));

  document.addEventListener('pointerover', (e) => {
    const target = e.target.closest('a, button, [data-cursor]');
    root.classList.toggle('cursor-hover', !!target && !target.dataset.cursor);
    root.classList.toggle('cursor-label', !!target?.dataset.cursor);
    label.textContent = target?.dataset.cursor || '';
  });

  gsap.ticker.add(() => {
    trail.x += (pos.x - trail.x) * 0.16;
    trail.y += (pos.y - trail.y) * 0.16;
    ring.style.transform = `translate3d(${trail.x}px, ${trail.y}px, 0)`;
  });
}

/** Buttons that lean towards the pointer. */
export function initMagnetic() {
  if (!finePointer()) return;
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'power3.out' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.32);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.42);
    });
    el.addEventListener('pointerleave', () => {
      xTo(0);
      yTo(0);
    });
  });
}

/** Pointer-following glow + border light on cards. */
export function initSpotlight() {
  const set = (el, e) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  document.querySelectorAll('[data-spotlight-group]').forEach((group) => {
    const cards = [...group.querySelectorAll('[data-spotlight]')];
    group.addEventListener('pointermove', (e) => cards.forEach((c) => set(c, e)));
  });
  document.querySelectorAll('[data-spotlight]').forEach((el) => {
    if (el.closest('[data-spotlight-group]')) return;
    el.addEventListener('pointermove', (e) => set(el, e));
  });
}

/* ---------- Text scramble ---------- */
const GLYPHS = '!<>-_\\/[]{}—=+*^?#░▒01';

export function scramble(el, { duration = 0.6, from = 'text' } = {}) {
  const text = (el.dataset.text ??= el.textContent);
  const frames = Math.max(1, Math.round(duration * 60));
  let frame = 0;
  cancelAnimationFrame(el._scramble);
  const step = () => {
    const p = frame / frames;
    let out = '';
    for (let i = 0; i < text.length; i++) {
      const at = (i / text.length) * 0.6;
      if (text[i] === ' ' || p >= at + 0.4) out += text[i];
      else if (p >= at) out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
      else out += from === 'blank' ? ' ' : text[i];
    }
    el.textContent = out;
    if (frame++ < frames) el._scramble = requestAnimationFrame(step);
    else el.textContent = text;
  };
  step();
}

export function initScrambleHover() {
  document.querySelectorAll('[data-scramble-hover]').forEach((el) => {
    el.addEventListener('pointerenter', () => {
      // lock width so neighbours do not jitter while glyphs change
      el.style.display = 'inline-block';
      el.style.minWidth = `${el.getBoundingClientRect().width}px`;
      scramble(el, { duration: 0.45 });
    });
  });
}
