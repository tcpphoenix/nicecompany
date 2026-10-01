// Generates the PNG favicons from public/favicon.svg (the blue "N" logo mark).
// Run with `npm run assets` after changing the logo. The share image (public/og.png)
// is designed separately and committed as-is.
import sharp from 'sharp';
import { readFileSync } from 'node:fs';

const svg = readFileSync('public/favicon.svg');
await sharp(svg, { density: 384 }).resize(48, 48).png().toFile('public/favicon.png');
await sharp(svg, { density: 600 }).resize(180, 180).png().toFile('public/apple-touch-icon.png');
await sharp(svg, { density: 1200 }).resize(512, 512).png().toFile('public/icon-512.png');
console.log('icons written');
