import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { scramble } from '../fx/pointer.js';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Counts 000 → 100 while assets load, then lifts the curtain.
 * Resolves as soon as the curtain starts moving so the hero intro overlaps it.
 */
export function runPreloader(ready, { reduced = false } = {}) {
  const el = document.querySelector('.preloader');
  if (!el) return Promise.resolve();
  const count = el.querySelector('[data-preload-count]');
  const bar = el.querySelector('.preloader__bar i');
  const state = { p: 0 };
  const render = () => {
    count.textContent = String(Math.round(state.p)).padStart(3, '0');
    bar.style.transform = `scaleX(${state.p / 100})`;
  };

  if (reduced) {
    return Promise.race([ready, wait(1500)]).then(() => el.remove());
  }

  gsap.to(state, { p: 82, duration: 1.6, ease: 'power2.out', onUpdate: render });

  return new Promise((resolve) => {
    Promise.all([Promise.race([ready, wait(4500)]), wait(1300)]).then(() => {
      gsap
        .timeline()
        .to(state, { p: 100, duration: 0.55, ease: 'power2.inOut', onUpdate: render, overwrite: true })
        .to(el.querySelector('.preloader__inner'), { opacity: 0, y: -30, duration: 0.5, ease: 'power2.in' }, '+=0.1')
        .to(el, { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.inOut', onStart: resolve }, '-=0.15')
        .add(() => el.remove());
    });
  });
}

/** Hero entrance: character cascade, blur-in of the key word, media + chips fade. */
export function heroIntro({ particles, reduced = false }) {
  const hero = document.querySelector('.hero');
  const title = hero.querySelector('[data-hero-title]');
  const video = hero.querySelector('.hero__video');
  const fades = hero.querySelectorAll('[data-hero-fade]');
  const chips = hero.querySelectorAll('.chip');
  const eyebrow = hero.querySelector('[data-hero-eyebrow]');
  const eyebrowText = hero.querySelector('[data-scramble-text]');

  particles?.intro(0.1);

  if (reduced) {
    gsap.set(video, { opacity: 1 });
    gsap.set(chips, { opacity: 1 });
    return;
  }

  // The gradient word is ignored by SplitText so background-clip:text keeps working; it animates as one unit.
  const split = SplitText.create(title.querySelectorAll('.hero__line'), { type: 'chars', charsClass: 'char', ignore: '.grad-text' });
  const word = title.querySelector('.grad-text');
  word.style.display = 'inline-block';

  const units = [...title.querySelectorAll('.char, .grad-text')];
  const tl = gsap.timeline({
    onComplete: () => {
      split.revert();
      word.style.display = '';
    },
  });

  tl.fromTo(video, { opacity: 0, scale: 1.18 }, { opacity: 1, scale: 1, duration: 3.2, ease: 'expo.out' }, 0)
    .from(eyebrow, { opacity: 0, y: 16, duration: 1, ease: 'expo.out', onStart: () => scramble(eyebrowText, { duration: 1.1, from: 'blank' }) }, 0.15)
    .from(
      units.filter((u) => u !== word),
      { yPercent: 115, rotate: 6, duration: 1.4, ease: 'expo.out', stagger: 0.022 },
      0.2,
    )
    .from(word, { yPercent: 60, opacity: 0, filter: 'blur(18px)', scale: 0.92, duration: 1.8, ease: 'expo.out' }, 0.55)
    .from(fades, { opacity: 0, y: 24, duration: 1.2, ease: 'expo.out', stagger: 0.1 }, 0.9)
    .to(chips, { opacity: 1, duration: 1.4, stagger: 0.12, ease: 'power2.out' }, 1.2);
}

/** Pointer parallax for the floating chips + live clock. */
export function initHeroDetails() {
  const clock = document.querySelector('[data-clock]');
  if (clock) {
    const fmt = new Intl.DateTimeFormat('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const update = () => (clock.textContent = fmt.format(new Date()));
    update();
    setInterval(update, 1000);
  }

  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const chips = [...document.querySelectorAll('.chip')].map((el, i) => ({
    depth: 14 + i * 9,
    x: gsap.quickTo(el, 'x', { duration: 1.4, ease: 'power3.out' }),
    y: gsap.quickTo(el, 'y', { duration: 1.4, ease: 'power3.out' }),
  }));
  addEventListener('pointermove', (e) => {
    const nx = e.clientX / innerWidth - 0.5;
    const ny = e.clientY / innerHeight - 0.5;
    chips.forEach((c) => {
      c.x(-nx * c.depth);
      c.y(-ny * c.depth);
    });
  });
}
