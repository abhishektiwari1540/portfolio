import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.resolve(__dirname, '../public/og-image.png');

const width = 1200;
const height = 630;

const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0a0c" />
      <stop offset="50%" stop-color="#121318" />
      <stop offset="100%" stop-color="#060608" />
    </linearGradient>
    <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6366f1" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#a855f7" stop-opacity="0.05" />
    </linearGradient>
    <linearGradient id="text-grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#e2e8f0" />
    </linearGradient>
    <linearGradient id="accent-grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#818cf8" />
      <stop offset="100%" stop-color="#c084fc" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#bg)" />

  <!-- Accent Circle Glow -->
  <circle cx="950" cy="150" r="350" fill="url(#glow)" filter="blur(40px)" />
  <circle cx="150" cy="500" r="250" fill="url(#glow)" filter="blur(60px)" />

  <!-- Border Card -->
  <rect x="40" y="40" width="1120" height="550" rx="24" fill="none" stroke="#ffffff" stroke-opacity="0.08" stroke-width="2" />

  <!-- Content -->
  <g transform="translate(90, 110)">
    <!-- Badge -->
    <rect x="0" y="0" width="280" height="42" rx="21" fill="#ffffff" fill-opacity="0.06" stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" />
    <circle cx="22" cy="21" r="6" fill="#10b981" />
    <text x="38" y="26" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" fill="#a1a1aa" letter-spacing="1.5">FULL-STACK &amp; AI ENGINEER</text>

    <!-- Name Heading -->
    <text x="0" y="130" font-family="system-ui, -apple-system, sans-serif" font-size="64" font-weight="800" fill="url(#text-grad)" letter-spacing="-1">Abhishek Tiwari</text>
    
    <!-- Subtitle -->
    <text x="0" y="195" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="600" fill="url(#accent-grad)" letter-spacing="-0.5">Full Stack &amp; AI Backend Engineer</text>

    <!-- Description Lines -->
    <text x="0" y="270" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="400" fill="#94a3b8" width="900">
      Specializing in Node.js, TypeScript, Laravel, and Gemini Multimodal AI systems.
    </text>
    <text x="0" y="305" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="400" fill="#94a3b8">
      Building scalable booking platforms, fintech consoles, identity workflows &amp; LLM pipelines.
    </text>

    <!-- Footer tags & URL -->
    <g transform="translate(0, 370)">
      <line x1="0" y1="0" x2="940" y2="0" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1" />
      <text x="0" y="42" font-family="system-ui, -apple-system, monospace" font-size="18" font-weight="600" fill="#818cf8" letter-spacing="1">abhishektiwari.online</text>
      <text x="940" y="42" text-anchor="end" font-family="system-ui, -apple-system, monospace" font-size="16" font-weight="500" fill="#64748b" letter-spacing="1">REACT • NODE • TS • LARAVEL • GEMINI AI</text>
    </g>
  </g>
</svg>
`;

async function generate() {
  await sharp(Buffer.from(svg))
    .png()
    .toFile(outputPath);
  console.log(`Generated OG Image at ${outputPath}`);
}

generate().catch(console.error);
