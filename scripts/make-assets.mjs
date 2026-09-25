// Generates favicons, the header emblem and the social share image from logo.jpeg.
// Run with `npm run assets` whenever the logo changes.
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const SRC = 'logo.jpeg';
const PAPER = '#F6F4EF';
// Flat background colour of the source JPEG; pixels near it become transparent.
const BG = [247, 251, 254];

async function cutout(region) {
  const { data, info } = await sharp(SRC).extract(region).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const d = Math.hypot(data[i] - BG[0], data[i + 1] - BG[1], data[i + 2] - BG[2]);
    data[i + 3] = Math.max(0, Math.min(255, Math.round(((d - 8) / 28) * 255)));
  }
  return sharp(data, { raw: info }).png().trim();
}

mkdirSync('public', { recursive: true });
mkdirSync('src/assets', { recursive: true });

// Emblem: the ring with flame, snowflake, drop and roof.
const emblem = await (await cutout({ left: 235, top: 190, width: 610, height: 435 })).toBuffer();
await sharp(emblem).resize({ width: 480 }).png().toFile('src/assets/emblem.png');

// Sharp applies one resize per pipeline, so fit the emblem first, then place it on the canvas.
async function square(size, background, file) {
  const inner = Math.round(size * 0.9);
  const fitted = await sharp(emblem).resize(inner, inner, { fit: 'inside' }).toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([{ input: fitted, gravity: 'center' }])
    .png()
    .toFile(file);
}

await square(48, { r: 0, g: 0, b: 0, alpha: 0 }, 'public/favicon.png');
await square(180, PAPER, 'public/apple-touch-icon.png');
await square(512, PAPER, 'public/icon-512.png');

// Share image: emblem + wordmark + tagline on paper, 1200x630.
const lockup = await (await cutout({ left: 90, top: 190, width: 900, height: 650 })).toBuffer();
const lockupFit = await sharp(lockup).resize({ height: 540, width: 1100, fit: 'inside' }).toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: PAPER } })
  .composite([{ input: lockupFit, gravity: 'center' }])
  .png()
  .toFile('public/og.png');

console.log('assets written');
