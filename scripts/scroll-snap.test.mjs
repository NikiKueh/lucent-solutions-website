import test from 'node:test';
import assert from 'node:assert/strict';
import { collectStops, createScrollGuide } from '../src/sections/snap.js';

function gestureHarness(position = 0) {
  let time = 0;
  let target = position;
  const moves = [];
  const guide = createScrollGuide({
    getStops: () => [0, 600, 1100, 1600],
    getPosition: () => position,
    getTarget: () => target,
    now: () => time,
  });
  return {
    moves,
    input: (delta) => {
      const adjusted = guide.input(delta);
      target += adjusted;
      if (adjusted) moves.push(target);
      return target;
    },
    advance: (ms) => { time += ms; },
    setPosition: (value) => { position = value; },
    settle: (radius = 96) => guide.settleTarget(radius),
    reset: guide.reset,
  };
}

test('a large wheel gesture advances exactly one element', () => {
  const h = gestureHarness();
  h.input(8000);
  assert.deepEqual(h.moves, [600]);
});

test('small scroll inputs move proportionally instead of launching a whole section', () => {
  const h = gestureHarness();
  h.input(40);
  assert.ok(h.moves[0] <= 40, `40px input launched a ${h.moves[0]}px transition`);
});

test('momentum cannot skip elements, even after the animation completes', () => {
  const h = gestureHarness();
  h.input(8000);
  h.setPosition(600);
  for (let n = 0; n < 30; n++) {
    h.advance(80);
    h.input(100 - n * 3);
  }
  assert.deepEqual(h.moves, [600]);
  h.advance(250);
  h.input(100);
  assert.deepEqual(h.moves, [600, 700]);
});

test('a new upward gesture returns to the previous stop', () => {
  const h = gestureHarness(1100);
  h.input(-5000);
  assert.deepEqual(h.moves, [600]);
});

test('continuous input remains responsive throughout the movement', () => {
  const h = gestureHarness();
  for (const delta of [12, 8, 15, 100]) {
    h.advance(16);
    h.input(delta);
  }
  assert.deepEqual(h.moves, [12, 20, 35, 135]);
});

test('reversing during an animation responds from the visible position immediately', () => {
  const h = gestureHarness();
  h.input(500);
  h.setPosition(200);
  h.advance(16);
  assert.equal(h.input(-20), 180);
});

test('scrollbar and anchor positions continue to their adjacent stop', () => {
  const h = gestureHarness(820);
  h.input(20);
  assert.deepEqual(h.moves, [840]);
});

test('new input does not have to wait for an animation or cooldown', () => {
  const h = gestureHarness();
  h.input(100);
  h.advance(30);
  h.input(100);
  assert.deepEqual(h.moves, [100, 200]);
});

test('page boundaries do not wrap or lock future gestures', () => {
  const h = gestureHarness();
  h.input(-100);
  assert.deepEqual(h.moves, []);
  h.advance(300);
  h.input(100);
  assert.deepEqual(h.moves, [100]);
});

test('settling only attracts a nearby stop in the current direction', () => {
  const h = gestureHarness();
  h.input(40);
  assert.equal(h.settle(), null);
  h.input(510);
  assert.equal(h.settle(), 600);
});

test('a little downward scroll never snaps backwards to the previous section', () => {
  const h = gestureHarness(600);
  h.input(30);
  assert.equal(h.settle(), null);
});

test('manual navigation cancels any pending magnetic finish', () => {
  const h = gestureHarness();
  h.input(550);
  assert.equal(h.settle(), 600);
  h.reset();
  assert.equal(h.settle(), null);
});

test('cards that fit the viewport each get one stop, without halfway or trailing stops', (t) => {
  const section = {
    offsetTop: 4000,
    offsetHeight: 2134,
    matches: () => false,
    querySelectorAll: () => cards,
  };
  const cards = [385, 947, 1509].map((top) => ({ offsetTop: top, offsetParent: section }));
  const originalStyle = globalThis.getComputedStyle;
  globalThis.getComputedStyle = () => ({ position: 'relative' });
  const originalDocument = globalThis.document;
  globalThis.document = {
    documentElement: { clientHeight: 660, scrollHeight: 10000 },
    querySelectorAll: () => [section],
  };
  t.after(() => {
    globalThis.document = originalDocument;
    globalThis.getComputedStyle = originalStyle;
  });
  assert.deepEqual(collectStops().filter((y) => y >= 4000 && y < 6200), [4000, 4281, 4843, 5405]);
});
