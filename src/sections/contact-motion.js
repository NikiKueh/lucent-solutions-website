import gsap from 'gsap';
import '../styles/contact-motion.css';

// Each illustration stays readable at rest; selecting a service brings it to life.
const scenes = {
  website: `<rect class="scene-frame" x="10" y="6" width="116" height="64" rx="6"/><path class="scene-muted" d="M10 21h116"/><g class="scene-dots"><circle cx="18" cy="14" r="1"/><circle cx="24" cy="14" r="1"/><circle cx="30" cy="14" r="1"/></g><rect class="web-piece scene-fill" x="19" y="29" width="44" height="30" rx="3"/><path class="web-piece" d="M73 32h35M73 40h25M73 52h15"/><path class="web-pointer" d="m105 47 1 18 5-5 6 5 3-3-6-6 7-3Z"/>`,
  automation: `<path class="flow-track scene-muted" d="M28 38h79"/><path class="flow-run" d="M28 38h79" pathLength="1"/><g class="flow-node"><rect x="7" y="20" width="34" height="36" rx="8"/><path d="m17 38 5 5 10-11"/></g><g class="flow-node"><rect x="53" y="20" width="34" height="36" rx="8"/><path d="m65 29-5 10h9l-3 8 12-13h-10l3-5"/></g><g class="flow-node"><rect x="99" y="20" width="34" height="36" rx="8"/><path d="m109 38 5 5 10-11"/></g><circle class="flow-pulse scene-solid" cx="28" cy="38" r="3"/>`,
  ai: `<g class="neural-links scene-muted"><path d="m22 16 48 22-48 22M22 16l48 44M22 60l48-44M70 16l48 22-48 22M70 38h48"/></g><g class="neural-signal"><path d="m22 16 48 22 48 0M22 60l48-44 48 22" pathLength="1"/></g><g class="neural-nodes"><circle cx="22" cy="16" r="5"/><circle cx="22" cy="60" r="5"/><circle cx="70" cy="16" r="5"/><circle cx="70" cy="38" r="7"/><circle cx="70" cy="60" r="5"/><circle cx="118" cy="38" r="8"/></g><circle class="neural-ring" cx="118" cy="38" r="12"/>`,
  software: `<rect class="scene-frame" x="10" y="6" width="116" height="64" rx="6"/><path class="scene-muted" d="M10 21h116"/><g class="scene-dots"><circle cx="18" cy="14" r="1"/><circle cx="24" cy="14" r="1"/><circle cx="30" cy="14" r="1"/></g><path class="code-bracket" d="m28 33-8 7 8 7M106 33l8 7-8 7"/><g class="code-lines"><path d="M40 32h28"/><path d="M46 41h40"/><path d="M40 50h18M64 50h13"/></g><path class="code-caret" d="M85 47v8"/>`,
};

const rocket = `<svg class="launch-rocket" viewBox="0 0 100 140" fill="none" aria-hidden="true"><g class="rocket-exhaust"><path class="rocket-flame" d="M40 91Q32 113 50 136Q68 113 60 91Z" fill="#8d7dff"/><path class="rocket-flame-core" d="M44 92Q42 108 50 121Q58 108 56 92Z" fill="#6cf0ff"/></g><path d="M36 64 23 83v18l17-9M64 64l13 19v18l-17-9" fill="#8d7dff" stroke="#c3baff" stroke-width="1.5"/><path d="M50 8C34 24 32 42 33 63l6 29h22l6-29C68 42 66 24 50 8Z" fill="#f3f5ff" stroke="#c3baff" stroke-width="1.5"/><path d="M50 8c-6 6-10 13-13 20h26C60 21 56 14 50 8Z" fill="#8d7dff"/><circle cx="50" cy="49" r="10" fill="#0b1223" stroke="#8d7dff" stroke-width="3"/><path d="m45 49 4 3 6-7" stroke="#6cf0ff" stroke-width="2"/><path d="M40 92h20" stroke="#8d7dff" stroke-width="4"/></svg>`;

const services = {
  website: ['Website', 'Vom ersten Entwurf bis zur fertigen Website.'],
  automation: ['Automatisierung', 'Aus einzelnen Arbeitsschritten wird ein durchgängiger Ablauf.'],
  ai: ['KI-Projekte', 'Unternehmenswissen verbinden und für Ihr Team nutzbar machen.'],
  software: ['Software', 'Einzelne Funktionen. Eine Anwendung, die zusammenpasst.'],
};

function createFilm(service, className) {
  const video = document.createElement('video');
  video.className = className;
  video.muted = true;
  video.playsInline = true;
  video.preload = 'none';
  video.dataset.contactFilm = service;
  video.setAttribute('aria-hidden', 'true');
  // Return to the composed still instead of holding a potentially dark final frame.
  video.addEventListener('ended', () => video.parentElement?.classList.remove('is-playing'));
  video.addEventListener('error', () => video.parentElement?.classList.remove('is-playing'));
  return video;
}

export function initContactMotion(form) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const cards = new Map();
  const timelines = new Map();
  const films = [];
  let activeService = 'website';
  let previewTween;

  const preview = document.createElement('figure');
  preview.className = 'contact-preview';
  preview.innerHTML = `<div class="contact-preview__screen" aria-hidden="true"><span class="contact-preview__wash"></span></div><figcaption><span class="contact-preview__eyebrow">Ihr Vorhaben</span><strong data-preview-title></strong><p data-preview-description></p></figcaption>`;
  document.querySelector('.contact-intro .contact-note').replaceWith(preview);
  const previewScreen = preview.querySelector('.contact-preview__screen');
  const previewFilms = new Map();

  function load(video) {
    if (video.hasAttribute('src')) return;
    video.src = `/media/contact/${video.dataset.contactFilm}.mp4`;
    video.load();
  }

  function play(video) {
    if (reduced.matches) return;
    load(video);
    video.currentTime = 0;
    video.playbackRate = video.dataset.contactFilm === 'rocket' ? 1.35 : 1.5;
    video.play().catch(() => {});
  }

  function stop(video) {
    video.pause();
    video.parentElement?.classList.remove('is-playing');
  }

  function showPreview(service, animate = true) {
    activeService = service;
    preview.querySelector('[data-preview-title]').textContent = services[service][0];
    preview.querySelector('[data-preview-description]').textContent = services[service][1];
    for (const [key, media] of previewFilms) {
      media.classList.toggle('is-active', key === service);
      stop(media.querySelector('video'));
    }
    const media = previewFilms.get(service);
    if (!animate || reduced.matches) return;
    play(media.querySelector('video'));
    previewTween?.revert();
    previewTween = gsap.timeline()
      .fromTo(media, { scale: 0.92, filter: 'blur(10px)' }, { scale: 1, filter: 'blur(0px)', duration: 0.65, ease: 'power3.out' })
      .fromTo(preview.querySelector('figcaption'), { y: 8, opacity: 0.4 }, { y: 0, opacity: 1, duration: 0.35 }, 0);
  }

  for (const input of form.querySelectorAll('[name="services"]')) {
    const card = input.closest('.service-option');
    const scene = document.createElement('span');
    scene.className = 'service-scene';
    scene.setAttribute('aria-hidden', 'true');
    scene.innerHTML = `<img src="/media/contact/${input.value}.jpg" alt="" loading="lazy" decoding="async"/><svg class="service-scene__fallback" viewBox="0 0 140 76" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${scenes[input.value]}</svg><span class="service-scene__burst"></span>`;
    const video = createFilm(input.value, 'service-scene__film');
    scene.prepend(video);
    films.push(video);
    video.addEventListener('playing', () => { if (!video.paused) scene.classList.add('is-playing'); });
    scene.querySelector('img').addEventListener('load', () => scene.classList.add('has-poster'));
    card.querySelector('.service-option__content > svg').replaceWith(scene);
    cards.set(input.value, { card, scene, video });

    const media = document.createElement('span');
    media.className = 'contact-preview__media';
    media.innerHTML = `<img src="/media/contact/${input.value}.jpg" alt="" loading="lazy" decoding="async"/>`;
    const previewVideo = createFilm(input.value, 'contact-preview__film');
    previewVideo.addEventListener('playing', () => { if (!previewVideo.paused) media.classList.add('is-playing'); });
    media.append(previewVideo);
    films.push(previewVideo);
    previewScreen.append(media);
    previewFilms.set(input.value, media);

    let bounds;
    card.addEventListener('pointerenter', () => { bounds = card.getBoundingClientRect(); });
    card.addEventListener('pointermove', (event) => {
      if (reduced.matches || event.pointerType !== 'mouse' || !bounds) return;
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      card.style.setProperty('--tilt-x', `${(0.5 - y) * 7}deg`);
      card.style.setProperty('--tilt-y', `${(x - 0.5) * 9}deg`);
      card.style.setProperty('--light-x', `${x * 100}%`);
      card.style.setProperty('--light-y', `${y * 100}%`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.removeProperty('--tilt-x');
      card.style.removeProperty('--tilt-y');
    });
  }
  showPreview('website', false);

  function select(service, selected = true) {
    const entry = cards.get(service);
    if (!entry) return;
    const { scene, video } = entry;
    timelines.get(service)?.revert();
    timelines.delete(service);
    if (!selected) {
      stop(video);
      if (service === activeService) {
        const next = form.querySelector('[name="services"]:checked')?.value || 'website';
        showPreview(next);
      }
      return;
    }
    showPreview(service);
    for (const [key, item] of cards) if (key !== service) stop(item.video);
    if (reduced.matches) return;
    play(video);
    const find = (selector) => scene.querySelectorAll(selector);
    const tl = gsap.timeline();
    timelines.set(service, tl);
    tl.fromTo(scene.querySelector('.service-scene__burst'), { scale: 0.1, opacity: 0.8 }, { scale: 2.5, opacity: 0, duration: 0.65, ease: 'power2.out' }, 0)
      .fromTo(scene.querySelector('img'), { scale: 1.14 }, { scale: 1, duration: 0.75, ease: 'power3.out' }, 0);
    if (service === 'website') {
      tl.fromTo(find('.scene-frame'), { scaleY: 0.7, opacity: 0.3, transformOrigin: '50% 50%' }, { scaleY: 1, opacity: 1, duration: 0.28, ease: 'back.out(1.6)' }, 0)
        .fromTo(find('.web-piece'), { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, stagger: 0.09, ease: 'power3.out' }, 0.12)
        .fromTo(find('.web-pointer'), { x: 15, y: 12, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' }, 0.3)
        .to(find('.web-pointer'), { scale: 0.8, transformOrigin: '105px 47px', duration: 0.1, repeat: 1, yoyo: true }, 0.65);
    } else if (service === 'automation') {
      tl.fromTo(find('.flow-run'), { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.6, ease: 'none' }, 0)
        .fromTo(find('.flow-pulse'), { x: 0, opacity: 1 }, { x: 79, duration: 0.65, ease: 'power1.inOut' }, 0)
        .to(find('.flow-pulse'), { opacity: 0, duration: 0.15 }, 0.65)
        .fromTo(find('.flow-node'), { scale: 0.85, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.3, stagger: 0.18, ease: 'back.out(2.5)' }, 0);
    } else if (service === 'ai') {
      tl.fromTo(find('.neural-signal path'), { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.6, stagger: 0.1, ease: 'power1.inOut' }, 0)
        .fromTo(find('.neural-nodes circle'), { scale: 0.4, transformOrigin: '50% 50%', opacity: 0.3 }, { scale: 1, opacity: 1, duration: 0.35, stagger: 0.07, ease: 'back.out(2)' }, 0)
        .fromTo(find('.neural-ring'), { scale: 0.65, opacity: 0.9, transformOrigin: '50% 50%' }, { scale: 2.2, opacity: 0, duration: 0.6 }, 0.35);
    } else {
      tl.fromTo(find('.code-bracket'), { scaleX: 0.6, transformOrigin: '50% 50%', opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.5)' }, 0)
        .fromTo(find('.code-lines path'), { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 0.25, stagger: 0.14, ease: 'steps(5)' }, 0.15)
        .fromTo(find('.code-caret'), { opacity: 0 }, { opacity: 1, duration: 0.12, repeat: 3, yoyo: true }, 0.4);
    }
  }

  form.addEventListener('change', (event) => {
    if (event.target.matches('[name="services"]')) select(event.target.value, event.target.checked);
  });

  const stage = document.createElement('span');
  stage.className = 'launch-stage';
  stage.setAttribute('aria-hidden', 'true');
  stage.innerHTML = `<span class="launch-aura"></span><span class="launch-smoke">${'<i></i>'.repeat(5)}</span>${rocket}`;
  const launchVideo = createFilm('rocket', 'launch-film');
  stage.prepend(launchVideo);
  films.push(launchVideo);
  form.querySelector('.inquiry__submit').append(stage);
  let launchTimeline;

  function launch() {
    launchTimeline?.revert();
    stage.classList.remove('has-film');
    if (reduced.matches) return;
    if (launchVideo.readyState >= 2) {
      stage.classList.add('has-film');
      play(launchVideo);
      launchTimeline = gsap.timeline()
        .set(stage, { visibility: 'visible' })
        .fromTo(launchVideo, { opacity: 0 }, { opacity: 1, duration: 0.12 })
        .fromTo(stage.querySelector('.launch-aura'), { scale: 0.1, opacity: 0.7 }, { scale: 2.6, opacity: 0, duration: 0.9 }, 0)
        .to(launchVideo, { opacity: 0, duration: 0.35 }, 2.65)
        .set(stage, { visibility: 'hidden' })
        .call(() => launchVideo.pause());
      return;
    }
    const craft = stage.querySelector('.launch-rocket');
    const flame = stage.querySelector('.rocket-exhaust');
    const smoke = stage.querySelectorAll('.launch-smoke i');
    launchTimeline = gsap.timeline();
    launchTimeline
      .set(stage, { visibility: 'visible' })
      .fromTo(craft, { x: 0, y: 0, rotation: 0, opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.12 })
      .fromTo(flame, { scaleY: 0.3, transformOrigin: '50% 0%' }, { scaleY: 1, duration: 0.07, yoyo: true, repeat: 7 }, 0.08)
      .fromTo(craft, { x: -1 }, { x: 1, duration: 0.04, repeat: 5, yoyo: true }, 0.12)
      .fromTo(smoke, { x: 0, y: 0, scale: 0.2, opacity: 0.65 }, { x: (i) => (i - 2) * 24, y: (i) => -10 - (i % 2) * 14, scale: 1.8, opacity: 0, duration: 0.65, stagger: 0.035 }, 0.2)
      .to(craft, { x: -100, y: -330, rotation: -18, duration: 0.85, ease: 'power3.in' }, 0.32)
      .to(craft, { opacity: 0, duration: 0.16 }, 1.01)
      .set(stage, { visibility: 'hidden' });
  }

  // A preference change stops motion that is already in progress as well.
  reduced.addEventListener('change', () => {
    if (!reduced.matches) return;
    timelines.forEach((tl) => tl.revert());
    timelines.clear();
    launchTimeline?.revert();
    previewTween?.revert();
    films.forEach(stop);
    preview.querySelectorAll('.is-playing').forEach((media) => media.classList.remove('is-playing'));
    for (const { scene } of cards.values()) scene.classList.remove('is-playing');
  });

  // Prepare short clips only when the form approaches the viewport.
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) {
      films.forEach(stop);
      return;
    }
    if (reduced.matches) return;
    for (const { video } of cards.values()) { video.preload = 'auto'; load(video); }
    launchVideo.preload = 'auto';
    load(launchVideo);
  }, { rootMargin: '500px 0px' });
  observer.observe(form);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) films.forEach(stop);
  });
  return { select, launch };
}
