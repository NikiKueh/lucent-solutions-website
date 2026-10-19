import ffmpegPath from 'ffmpeg-static';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const source = path.join(root, 'media-src/video/contact');
const output = path.join(root, 'public/media/contact');
fs.mkdirSync(output, { recursive: true });
const ff = (args) => execFileSync(ffmpegPath, ['-y', '-loglevel', 'error', ...args]);

for (const name of ['website', 'automation', 'ai', 'software', 'rocket']) {
  const input = path.join(source, `${name}.mp4`);
  const width = name === 'rocket' ? 720 : 960;
  const video = path.join(output, `${name}.mp4`);
  ff(['-i', input, '-an', '-vf', `scale=${width}:-2:flags=lanczos,fps=30`,
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '24', '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart', video]);
  if (name !== 'rocket') {
    ff(['-ss', '1.5', '-i', input, '-vf', 'scale=960:-2:flags=lanczos',
      '-frames:v', '1', '-q:v', '3', path.join(output, `${name}.jpg`)]);
  }
  console.log(`${name}: ${Math.round(fs.statSync(video).size / 1024)} KB`);
}
