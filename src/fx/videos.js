const isMobile = () => matchMedia('(max-width: 860px)').matches;

/** Assigns the source of a lazy video (data-src / data-src-mobile) once. */
export function loadVideo(video) {
  if (!video || video.src) return;
  video.src = (isMobile() && video.dataset.srcMobile) || video.dataset.src;
  video.load();
}

/** Resolves once the video can play (or failed / timed out, so nothing ever blocks on media). */
export function canPlay(video, timeout = 3500) {
  return new Promise((resolve) => {
    if (!video || video.readyState >= 3) return resolve();
    const done = () => resolve();
    video.addEventListener('canplay', done, { once: true });
    video.addEventListener('error', done, { once: true });
    setTimeout(done, timeout);
  });
}

/** Loads videos shortly before they scroll into view and pauses them when off-screen. */
export function initVideos({ reduced = false } = {}) {
  const videos = [...document.querySelectorAll('video[data-src]')];
  if (reduced) return; // posters only

  const io = new IntersectionObserver(
    (entries) => {
      for (const { target: video, isIntersecting } of entries) {
        if (isIntersecting) {
          loadVideo(video);
          video.play().catch(() => {});
        } else if (!video.paused) {
          video.pause();
        }
      }
    },
    { rootMargin: '30% 0px' },
  );
  videos.forEach((v) => io.observe(v));
}
