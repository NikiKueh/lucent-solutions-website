import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initNav(lenis) {
  const root = document.documentElement;
  const nav = document.querySelector('.nav');
  const burger = document.querySelector('.nav__burger');
  const menu = document.getElementById('menu');

  /* Smooth anchor scrolling */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const target = id === '#top' ? 0 : document.querySelector(id);
      if (target === null) return;
      e.preventDefault();
      setMenu(false);
      if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.8 });
      else (target === 0 ? document.body : target).scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* Hide on scroll down, reveal on scroll up */
  let lastY = 0;
  const onScroll = () => {
    const y = scrollY;
    nav.classList.toggle('is-scrolled', y > 40);
    if (!root.classList.contains('menu-open')) nav.classList.toggle('is-hidden', y > 160 && y > lastY);
    lastY = y;
  };
  lenis ? lenis.on('scroll', onScroll) : addEventListener('scroll', onScroll, { passive: true });

  /* Active section highlight */
  const links = [...document.querySelectorAll('.nav__links a')];
  links.forEach((link) => {
    const section = document.querySelector(link.getAttribute('href'));
    if (!section) return;
    ScrollTrigger.create({
      trigger: section,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (self) => link.classList.toggle('is-active', self.isActive),
    });
  });

  /* Mobile menu */
  function setMenu(open) {
    root.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    menu.setAttribute('aria-hidden', String(!open));
    if (open) {
      nav.classList.remove('is-hidden');
      lenis?.stop();
    } else lenis?.start();
  }
  burger.addEventListener('click', () => setMenu(!root.classList.contains('menu-open')));
  addEventListener('keydown', (e) => e.key === 'Escape' && setMenu(false));
}

export function initCopy() {
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    const state = btn.querySelector('.copy__state');
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        btn.classList.add('is-copied');
        state.textContent = 'Kopiert ✓';
      } catch {
        location.href = `mailto:${btn.dataset.copy}`;
        return;
      }
      setTimeout(() => {
        btn.classList.remove('is-copied');
        state.textContent = state.dataset.label;
      }, 2200);
    });
  });
}
