import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

export function initScroll({ lenis, particles, reduced = false }) {
  initParticleStates(particles);
  initProgress(lenis);
  initMarquee(lenis, reduced);
  initCounters(reduced);

  if (reduced) return;

  initHeadings();
  initReveals();
  initManifesto();
  initHeroExit();
  initServiceStack();
  initProcess();
  initFooter();
}

/* Each section announces which shape the particle field should take. */
function initParticleStates(particles) {
  if (!particles) return;
  document.querySelectorAll('[data-particles]').forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (self) => self.isActive && particles.setState(section.dataset.particles),
    });
  });
}

function initProgress(lenis) {
  const bar = document.querySelector('.progress i');
  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? Math.min(1, scrollY / max) : 0;
    bar.style.transform = `scaleX(${p})`;
  };
  lenis ? lenis.on('scroll', update) : addEventListener('scroll', update, { passive: true });
  update();
}

/* Line-by-line masked reveal for headings (emphasized words stay intact). */
function initHeadings() {
  document.querySelectorAll('[data-split]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line-inner',
      ignore: '.accent-text',
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 118,
          rotate: 2,
          duration: 1.4,
          ease: 'expo.out',
          stagger: 0.1,
          scrollTrigger: { trigger: el, start: 'top 86%', once: true },
        }),
    });
  });
}

function initReveals() {
  const items = gsap.utils.toArray('[data-reveal]');
  gsap.set(items, { y: 44, opacity: 0 });
  ScrollTrigger.batch(items, {
    start: 'top 90%',
    once: true,
    onEnter: (batch) => gsap.to(batch, { y: 0, opacity: 1, duration: 1.3, ease: 'expo.out', stagger: 0.12, overwrite: true }),
  });
}

/* Words light up as you read. */
function initManifesto() {
  const el = document.querySelector('[data-manifesto]');
  if (!el) return;
  const split = SplitText.create(el, { type: 'words', wordsClass: 'word' });
  gsap.to(split.words, {
    color: '#f3f5ff',
    stagger: 0.1,
    ease: 'none',
    scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 42%', scrub: 0.6 },
  });
}

function initHeroExit() {
  const hero = document.querySelector('.hero');
  const st = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true };
  gsap.to('.hero__inner', { yPercent: -18, opacity: 0, ease: 'none', scrollTrigger: st });
  gsap.to('.hero__media', { scale: 1.12, opacity: 0.25, ease: 'none', scrollTrigger: { ...st } });
  gsap.to('.hero__hud', { opacity: 0, ease: 'none', scrollTrigger: { ...st, end: '30% top' } });
}

/* Keep each card readable in full before the next one overlaps it. */
function initServiceStack() {
  const cards = gsap.utils.toArray('.svc');
  // Sticky elements report their stuck position, so zero-height markers stand in for each card's natural top.
  const markers = cards.map((card) => {
    const m = document.createElement('div');
    m.className = 'svc-marker';
    m.setAttribute('aria-hidden', 'true');
    card.before(m);
    return m;
  });

  const updateLayout = () => {
    const viewport = document.documentElement.clientHeight;
    cards.forEach((card) => {
      const top = parseFloat(getComputedStyle(card).scrollMarginTop) || 104;
      // A sticky card taller than the available space would hide its own footer.
      card.classList.toggle('svc--flow', card.offsetHeight + top + 32 > viewport);
    });
  };
  updateLayout();
  const observer = new ResizeObserver(updateLayout);
  cards.forEach((card) => observer.observe(card));
  addEventListener('resize', updateLayout);
  ScrollTrigger.addEventListener('refreshInit', updateLayout);

  cards.forEach((card, i) => {
    gsap.fromTo(
      card.querySelector('video'),
      { yPercent: -5 },
      { yPercent: 5, ease: 'none', scrollTrigger: { trigger: markers[i], start: 'top bottom', end: 'top top', scrub: true } },
    );
  });
}

function initProcess() {
  const steps = gsap.utils.toArray('.step');
  gsap.to('.steps__line i', {
    scaleY: 1,
    ease: 'none',
    scrollTrigger: { trigger: '.steps', start: 'top 62%', end: 'bottom 62%', scrub: 0.4 },
  });
  steps.forEach((step) => {
    ScrollTrigger.create({
      trigger: step,
      start: 'top 64%',
      onEnter: () => step.classList.add('is-active'),
      onLeaveBack: () => step.classList.remove('is-active'),
    });
  });
}

function initCounters(reduced) {
  document.querySelectorAll('[data-count]').forEach((el) => {
    const to = Number(el.dataset.count);
    if (reduced) {
      el.textContent = to;
      return;
    }
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () =>
        gsap.to(obj, {
          v: to,
          duration: 2.2,
          ease: 'power3.out',
          onUpdate: () => (el.textContent = Math.round(obj.v)),
        }),
    });
  });
}

function initFooter() {
  const mega = document.querySelector('[data-mega]');
  if (!mega) return;
  mega.dataset.text = mega.textContent;
  gsap.fromTo(
    mega,
    { '--fill': '0%', yPercent: 30 },
    {
      '--fill': '100%',
      yPercent: 0,
      ease: 'none',
      scrollTrigger: { trigger: '.footer__mega', start: 'top bottom', end: 'bottom bottom', scrub: true },
    },
  );
  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
}

/* Infinite marquee whose speed, direction and skew follow the scroll velocity. */
function initMarquee(lenis, reduced) {
  const rows = [...document.querySelectorAll('[data-marquee]')].map((row) => {
    const inner = row.querySelector('.marquee__inner');
    const width = inner.offsetWidth;
    const copies = Math.ceil((innerWidth * 2) / width) + 1;
    for (let i = 0; i < copies; i++) {
      const clone = inner.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      row.append(clone);
    }
    return { row, items: [...row.children], width, x: 0, dir: Number(row.dataset.marquee) };
  });
  if (reduced) return;

  addEventListener('resize', () => rows.forEach((r) => (r.width = r.items[0].offsetWidth)));

  let skew = 0;
  let direction = 1;
  gsap.ticker.add((_, dt) => {
    const v = lenis?.velocity ?? 0;
    if (Math.abs(v) > 0.5) direction = Math.sign(v);
    skew += (gsap.utils.clamp(-8, 8, -v * 0.35) - skew) * 0.1;
    const speed = (0.55 + Math.min(Math.abs(v), 60) * 0.12) * (dt / 16.67);
    rows.forEach((r) => {
      r.x = gsap.utils.wrap(-r.width, 0, r.x - speed * r.dir * direction);
      const t = `translate3d(${r.x}px,0,0) skewX(${skew.toFixed(2)}deg)`;
      r.items.forEach((el) => (el.style.transform = t));
    });
  });
}
