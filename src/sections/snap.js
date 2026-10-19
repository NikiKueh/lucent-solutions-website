/* Follow every input; only trim momentum that would skip the next element. */
export function createScrollGuide({ getStops, getPosition, getTarget, now = () => performance.now() }) {
  let lastInput = -Infinity;
  let direction = 0;
  let boundary = null;

  function input(delta) {
    if (!delta) return 0;
    const time = now();
    const nextDirection = Math.sign(delta);
    const reversing = direction && nextDirection !== direction;
    const origin = reversing ? getPosition() : getTarget();

    if (boundary === null || reversing || time - lastInput > 220) {
      const stops = getStops();
      boundary = nextDirection > 0
        ? stops.find((stop) => stop > origin + 3) ?? stops.at(-1)
        : stops.findLast((stop) => stop < origin - 3) ?? stops[0];
    }
    lastInput = time;
    direction = nextDirection;
    const target = nextDirection > 0
      ? Math.min(origin + delta, boundary)
      : Math.max(origin + delta, boundary);
    return target - getTarget();
  }

  function settleTarget(radius) {
    const target = getTarget();
    const stop = direction > 0
      ? getStops().find((point) => point > target + 1)
      : getStops().findLast((point) => point < target - 1);
    return direction && stop !== undefined && Math.abs(stop - target) <= radius ? stop : null;
  }

  function reset() {
    lastInput = -Infinity;
    boundary = null;
    direction = 0;
  }

  return { input, settleTarget, reset };
}

// Use natural layout positions: sticky/animated rectangles move while scrolling.
function layoutTop(el) {
  let y = 0;
  for (let node = el; node; node = node.offsetParent) y += node.offsetTop;
  return y;
}

export function collectStops() {
  const height = document.documentElement.clientHeight;
  const max = Math.max(0, document.documentElement.scrollHeight - height);
  const stops = [0, max];
  const add = (y) => stops.push(Math.max(0, Math.min(max, y)));

  document.querySelectorAll('main > section, .footer').forEach((section) => {
    const start = layoutTop(section);
    const end = start + section.offsetHeight;
    add(start);

    if (section.matches('.warp') && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Hold each word at its legible point in the scrubbed timeline.
      const travel = section.offsetHeight - section.querySelector('.warp__sticky').offsetHeight;
      [0.23, 0.5, 0.77, 1].forEach((p) => add(start + travel * p));
      return;
    }

    const local = [start];
    section.querySelectorAll('.svc, .step, .bento__card, .stat').forEach((el) => {
      const marker = el.previousElementSibling;
      const sticky = getComputedStyle(el).position === 'sticky';
      const top = sticky ? parseFloat(getComputedStyle(el).top) || 104 : 104;
      const y = layoutTop(marker?.matches('.svc-marker') ? marker : el) - top;
      if (y > start + 80) local.push(y);
    });
    // Tall sections remain readable on short screens and at browser zoom.
    if (end - height > Math.max(...local) + height * 0.35) local.push(end - height);
    local.sort((a, b) => a - b);
    local.forEach((point, i) => {
      add(point);
      const next = local[i + 1];
      if (next === undefined) return;
      const parts = next - point > height ? Math.ceil((next - point) / (height * 0.85)) : 1;
      for (let n = 1; n < parts; n++) add(point + (next - point) * n / parts);
    });
  });

  return stops.sort((a, b) => a - b).filter((y, i, all) => i === 0 || y - all[i - 1] > 4);
}

export function initSnap({ lenis }) {
  // Touch and reduced-motion visitors keep the browser's native scrolling.
  if (!lenis) return { refresh() {}, virtualScroll: () => true };
  let stops = collectStops();
  let settleTimer;
  const guide = createScrollGuide({
    getStops: () => stops,
    getPosition: () => lenis.animatedScroll,
    getTarget: () => lenis.targetScroll,
  });

  const cancelSettle = () => clearTimeout(settleTimer);
  const reset = () => {
    cancelSettle();
    guide.reset();
  };
  const refresh = () => {
    stops = collectStops();
    reset();
  };

  function settle() {
    if (lenis.isStopped) return;
    // Let the input's own movement finish before adding a small magnetic finish.
    if (Math.abs(lenis.targetScroll - lenis.animatedScroll) > 3) {
      settleTimer = setTimeout(settle, 80);
      return;
    }
    const target = guide.settleTarget(Math.min(96, innerHeight * 0.12));
    if (target === null) return;
    lenis.scrollTo(target, {
      duration: 0.55,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });
  }

  const nested = (event, delta) => {
    if (event.target.closest?.('input, textarea, select, [contenteditable="true"], [data-scroll-free]')) return true;
    // Native scrolling inside a terminal/dialog keeps working until its boundary.
    for (let el = event.target; el && el !== document.body; el = el.parentElement) {
      if (el.scrollHeight > el.clientHeight + 1 && /auto|scroll/.test(getComputedStyle(el).overflowY)) {
        if ((delta > 0 && el.scrollTop + el.clientHeight < el.scrollHeight - 1) || (delta < 0 && el.scrollTop > 0)) return true;
      }
    }
    return false;
  };

  // Lenis already normalizes wheel/trackpad units. Keep its single animation loop.
  const virtualScroll = (data) => {
    const { event, deltaX, deltaY } = data;
    cancelSettle();
    if (event.type !== 'wheel') {
      guide.reset();
      return true;
    }
    if (event.ctrlKey || event.metaKey || event.shiftKey || Math.abs(deltaX) > Math.abs(deltaY) || !deltaY || lenis.isStopped) return true;
    if (nested(event, deltaY)) {
      guide.reset();
      return false;
    }
    if (!event.cancelable) return true;
    event.preventDefault();
    data.deltaY = guide.input(deltaY);
    settleTimer = setTimeout(settle, 180);
    return data.deltaY !== 0;
  };

  // These inputs interrupt settling without hijacking native keys or swipes.
  window.addEventListener('keydown', reset, { passive: true });
  window.addEventListener('pointerdown', reset, { passive: true });
  window.addEventListener('click', reset, { passive: true });

  const observer = new ResizeObserver(refresh);
  observer.observe(document.body);
  window.addEventListener('resize', refresh);
  return { refresh, virtualScroll };
}
