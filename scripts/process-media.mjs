/**
 * Converts the raw Higgsfield renders in media-src/ into web-ready assets in public/media/.
 *
 *   npm run media
 *
 * - loops  → H.264 MP4 (no audio, faststart) + JPG poster
 * - warp   → WebP frame sequence for scroll-scrubbing on <canvas> + manifest.json
 * - og.jpg → social preview image
 */
import ffmpegPath from 'ffmpeg-static';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'media-src', 'video');
const OUT = path.join(ROOT, 'public', 'media');

const LOOPS = [
  { name: 'hero', width: 1920, crf: 23 },
  { name: 'hero-mobile', from: 'hero', width: 960, crf: 25 },
  { name: 'software', width: 1280, crf: 24 },
  { name: 'automation', width: 1280, crf: 25 },
  { name: 'ai', width: 1280, crf: 25 },
  { name: 'portal', width: 1600, crf: 24 },
];
const WARP = { name: 'warp', width: 1280, quality: 68 };

const ff = (args) => execFileSync(ffmpegPath, ['-y', '-loglevel', 'error', ...args], { stdio: 'inherit' });
const kb = (file) => `${Math.round(fs.statSync(file).size / 1024)} KB`;

fs.mkdirSync(OUT, { recursive: true });

for (const { name, from = name, width, crf } of LOOPS) {
  const input = path.join(SRC, `${from}.mp4`);
  if (!fs.existsSync(input)) {
    console.warn(`skip ${name}: ${input} not found`);
    continue;
  }
  const mp4 = path.join(OUT, `${name}.mp4`);
  ff([
    '-i', input,
    '-an',
    '-vf', `scale=${width}:-2:flags=lanczos`,
    '-c:v', 'libx264', '-preset', 'slow', '-crf', String(crf),
    '-profile:v', 'high', '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    mp4,
  ]);
  console.log(`✓ ${name}.mp4  ${kb(mp4)}`);

  if (from === name) {
    const poster = path.join(OUT, `${name}.jpg`);
    ff(['-i', input, '-vf', 'scale=1280:-2:flags=lanczos', '-frames:v', '1', '-q:v', '4', poster]);
    console.log(`✓ ${name}.jpg  ${kb(poster)}`);
  }
}

// Social preview (1200×630) from the hero's first frame
const heroSrc = path.join(SRC, 'hero.mp4');
if (fs.existsSync(heroSrc)) {
  const og = path.join(OUT, 'og.jpg');
  ff(['-i', heroSrc, '-vf', 'scale=1200:-2,crop=1200:630', '-frames:v', '1', '-q:v', '3', og]);
  console.log(`✓ og.jpg  ${kb(og)}`);
}

// Warp → frame sequence
const warpSrc = path.join(SRC, `${WARP.name}.mp4`);
if (fs.existsSync(warpSrc)) {
  const dir = path.join(OUT, WARP.name);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  ff([
    '-i', warpSrc,
    '-vf', `scale=${WARP.width}:-2:flags=lanczos`,
    '-c:v', 'libwebp', '-quality', String(WARP.quality), '-compression_level', '5',
    '-start_number', '0',
    path.join(dir, '%03d.webp'),
  ]);
  const frames = fs.readdirSync(dir).filter((f) => f.endsWith('.webp'));
  const total = frames.reduce((s, f) => s + fs.statSync(path.join(dir, f)).size, 0);
  fs.writeFileSync(
    path.join(dir, 'manifest.json'),
    JSON.stringify({ count: frames.length, ext: 'webp', width: WARP.width, height: Math.round((WARP.width * 1076) / 1928 / 2) * 2 }),
  );
  console.log(`✓ warp/  ${frames.length} frames, ${Math.round(total / 1024)} KB`);
}
