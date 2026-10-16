import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const BASE = '/media/warp/';

/**
 * Scroll-scrubbed flight through the portal: a WebP frame sequence drawn to <canvas>
 * (smoother than seeking a <video>), with three words flying past the camera.
 */
export async function initWarp({ reduced = false } = {}) {
  const section = document.querySelector('.warp');
  if (!section) return;
  const canvas = section.querySelector('.warp__canvas');
  const ctx = canvas.getContext('2d');
  const velocityEl = section.querySelector('[data-warp-velocity]');
  const frameEl = section.querySelector('[data-warp-frame]');

  let manifest;
  try {
    manifest = await (await fetch(`${BASE}manifest.json`)).json();
  } catch {
    section.classList.add('is-fallback');
  }

  const count = manifest?.count ?? 0;
  const frames = new Array(count);
  let current = 0;
  let target = 0;
  let drawn = -1;

  const resize = () => {
    const dpr = Math.min(devicePixelRatio, 1.5);
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
    drawn = -1;
  };

  const nearestLoaded = (i) => {
    for (let d = 0; d < count; d++) {
      const a = frames[i - d];
      if (a?.complete && a.naturalWidth) return a;
      const b = frames[i + d];
      if (b?.complete && b.naturalWidth) return b;
    }
    return null;
  };

  const draw = (i) => {
    const img = nearestLoaded(i);
    if (!img) return;
    const cw = canvas.width;
    const ch = canvas.height;
    const ir = img.naturalWidth / img.naturalHeight;
    let w = cw;
    let h = cw / ir;
    if (h < ch) {
      h = ch;
      w = ch * ir;
    }
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    drawn = i;
  };

  // Load frames shortly before the section is reached — first, middle-out, so scrubbing works early
  const load = () => {
    if (!count) return;
    const order = [0];
    for (let step = 8; step >= 1; step = Math.floor(step / 2)) {
      for (let i = 0; i < count; i += step) if (!order.includes(i)) order.push(i);
      if (step === 1) break;
    }
    order.forEach((i) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = `${BASE}${String(i).padStart(3, '0')}.${manifest.ext}`;
      img.onload = () => {
        if (Math.abs(i - Math.round(current)) < 3 || drawn < 0) draw(Math.round(current));
      };
      frames[i] = img;
    });
  };

  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        load();
        io.disconnect();
      }
    },
    { rootMargin: '150% 0px' },
  );
  io.observe(section);

  resize();
  addEventListener('resize', () => {
    resize();
    draw(Math.round(current));
  });

  if (reduced) {
    // static mid-flight frame
    current = target = Math.round(count * 0.7);
    return;
  }

  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      target = self.progress * (count - 1);
      const v = Math.pow(self.progress, 1.6) * 0.99;
      velocityEl.textContent = v.toFixed(2);
    },
  });

  gsap.ticker.add(() => {
    if (!count) return;
    current += (target - current) * 0.18;
    const i = Math.round(current);
    if (i !== drawn) {
      draw(i);
      frameEl.textContent = String(i).padStart(3, '0');
    }
  });

  // Words fly towards the camera
  const words = section.querySelectorAll('.warp__word');
  const tl = gsap.timeline({
    scrollTrigger: { trigger: section, start: 'top top', end: 'bottom bottom', scrub: 0.8 },
  });
  words.forEach((w, i) => {
    const at = 0.1 + i * 0.27;
    tl.fromTo(
      w,
      { opacity: 0, scale: 0.55, filter: 'blur(24px)' },
      { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.11, ease: 'power2.out' },
      at,
    );
    if (i < words.length - 1) {
      tl.to(w, { opacity: 0, scale: 2.2, filter: 'blur(18px)', duration: 0.1, ease: 'power2.in' }, at + 0.16);
    }
  });
  // the last word drifts closer, then flies past the camera before the section scrolls away
  const last = words[words.length - 1];
  tl.to(last, { scale: 1.12, duration: 0.16, ease: 'none' }, 0.72);
  tl.to(last, { opacity: 0, scale: 2.4, filter: 'blur(18px)', duration: 0.1, ease: 'power2.in' }, 0.89);
  tl.set({}, {}, 1);
}
