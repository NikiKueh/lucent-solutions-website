import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import 'lenis/dist/lenis.css';
import './styles/main.css';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

import { ParticleField } from './webgl/particles.js';
import { initCursor, initMagnetic, initSpotlight, initScrambleHover } from './fx/pointer.js';
import { initVideos, loadVideo, canPlay } from './fx/videos.js';
import { runPreloader, heroIntro, initHeroDetails } from './sections/intro.js';
import { initWarp } from './sections/warp.js';
import { initTerminal } from './sections/terminal.js';
import { initScroll } from './sections/scroll.js';
import { initNav, initCopy } from './sections/nav.js';

gsap.registerPlugin(ScrollTrigger, SplitText);

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
scrollTo(0, 0);

async function boot() {
  /* Smooth scroll, driven by GSAP's ticker so ScrollTrigger stays in sync */
  let lenis = null;
  if (!reduced) {
    lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }

  /* WebGL particle field (graceful no-op without WebGL) */
  let particles = null;
  try {
    particles = new ParticleField(document.querySelector('.gl'), { reduced });
  } catch (err) {
    console.warn('WebGL nicht verfügbar – Partikel deaktiviert.', err);
    document.querySelector('.gl')?.remove();
  }

  const heroVideo = document.querySelector('.hero__video');
  if (!reduced) loadVideo(heroVideo);

  initCursor();
  initMagnetic();
  initSpotlight();
  initScrambleHover();
  initHeroDetails();
  initCopy();

  await runPreloader(Promise.all([document.fonts.ready, reduced ? null : canPlay(heroVideo)]), { reduced });

  document.body.classList.remove('is-loading');
  lenis?.start();
  heroVideo.play?.().catch(() => {});

  heroIntro({ particles, reduced });
  initNav(lenis);
  initVideos({ reduced });
  initScroll({ lenis, particles, reduced });
  initTerminal({ reduced });
  await initWarp({ reduced });

  ScrollTrigger.refresh();
}

boot();
