import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsDir = path.join(__dirname, "src", "assets");

function createArchitectSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800" style="background:#090b12; font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',Roboto,sans-serif;">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#080a10" />
      <stop offset="100%" stop-color="#101524" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="16" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <rect width="1200" height="800" fill="url(#bgGrad)" />

  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1" />
  </pattern>
  <rect width="1200" height="800" fill="url(#grid)" />

  <!-- Ambient Glow -->
  <circle cx="300" cy="200" r="300" fill="#00dcff" opacity="0.12" filter="url(#glow)" />
  <circle cx="900" cy="600" r="300" fill="#00dcff" opacity="0.08" filter="url(#glow)" />

  <!-- Top Badge -->
  <rect x="60" y="50" width="1080" height="50" rx="12" fill="rgba(20,24,40,0.8)" stroke="rgba(255,255,255,0.08)" />
  <circle cx="90" cy="75" r="6" fill="#ff5f56" />
  <circle cx="112" cy="75" r="6" fill="#ffbd2e" />
  <circle cx="134" cy="75" r="6" fill="#27c93f" />
  <text x="165" y="81" fill="#00dcff" font-size="14" font-weight="800" letter-spacing="2">01 // ARCHITECT &amp; DATA SYSTEM SCHEMA</text>
  <rect x="950" y="63" width="160" height="24" rx="12" fill="#00dcff" opacity="0.2" />
  <text x="1030" y="79" fill="#00dcff" font-size="11" font-weight="800" text-anchor="middle">MODELED &amp; TYPED</text>

  <!-- Database ERD Diagram Cards -->
  <!-- Table 1: USERS -->
  <rect x="80" y="150" width="310" height="420" rx="16" fill="rgba(16,20,34,0.9)" stroke="#00dcff" stroke-width="2" filter="url(#glow)" />
  <rect x="80" y="150" width="310" height="50" rx="16" fill="#00dcff" opacity="0.2" />
  <text x="105" y="182" fill="#ffffff" font-size="16" font-weight="800">TBL_USERS (MYSQL)</text>
  ${["id (UUID PK)", "email (VARCHAR)", "password_hash", "role_enum (RBAC)", "created_at (TIMESTAMP)", "updated_at (TIMESTAMP)"].map((f, i) => `
    <rect x="100" y="${220 + i * 52}" width="270" height="40" rx="8" fill="rgba(255,255,255,0.03)" />
    <text x="120" y="${245 + i * 52}" fill="${i === 0 ? "#00dcff" : "rgba(255,255,255,0.8)"}" font-size="13" font-weight="${i === 0 ? "800" : "500"}">${f}</text>
  `).join("")}

  <!-- Connecting Relationship Line 1 -> 2 -->
  <path d="M 390 240 Q 450 240 510 300" fill="none" stroke="#00dcff" stroke-width="3" stroke-dasharray="8 6" filter="url(#glow)" />

  <!-- Table 2: ORDERS / BOOKINGS -->
  <rect x="510" y="200" width="320" height="480" rx="16" fill="rgba(16,20,34,0.9)" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" />
  <rect x="510" y="200" width="320" height="50" rx="16" fill="rgba(255,255,255,0.08)" />
  <text x="535" y="232" fill="#ffffff" font-size="16" font-weight="800">TBL_BOOKINGS &amp; SEATS</text>
  ${["id (UUID PK)", "user_id (FK -> USERS)", "court_slot_id (FK)", "payment_status (ENUM)", "websocket_token", "total_amount (DECIMAL)", "expires_at (TIMESTAMP)"].map((f, i) => `
    <rect x="530" y="${270 + i * 50}" width="280" height="38" rx="8" fill="rgba(255,255,255,0.03)" />
    <text x="550" y="${294 + i * 50}" fill="${i === 1 ? "#00dcff" : "rgba(255,255,255,0.8)"}" font-size="13" font-weight="${i === 1 ? "800" : "500"}">${f}</text>
  `).join("")}

  <!-- Table 3: TELEMETRY LOGS -->
  <rect x="870" y="150" width="270" height="530" rx="16" fill="rgba(16,20,34,0.9)" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" />
  <rect x="870" y="150" width="270" height="50" rx="16" fill="rgba(255,255,255,0.08)" />
  <text x="895" y="182" fill="#ffffff" font-size="16" font-weight="800">REDIS &amp; CACHE</text>
  <rect x="890" y="220" width="230" height="90" rx="10" fill="rgba(0,220,255,0.1)" stroke="#00dcff" stroke-width="1" />
  <text x="905" y="250" fill="#00dcff" font-size="12" font-weight="800">REDIS IN-MEMORY</text>
  <text x="905" y="280" fill="#ffffff" font-size="20" font-weight="900">12ms Latency</text>

  <!-- Bottom Architecture Metrics -->
  <rect x="80" y="600" width="750" height="80" rx="14" fill="rgba(16,20,34,0.9)" stroke="rgba(255,255,255,0.1)" />
  <text x="110" y="646" fill="#00dcff" font-size="22" font-weight="900">ZERO DATA LOSS</text>
  <text x="360" y="646" fill="rgba(255,255,255,0.7)" font-size="14">Strict FK constraints &amp; transactional boundaries</text>
</svg>`;
}

function createBuildSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800" style="background:#090b12; font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',Roboto,sans-serif;">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#080a10" />
      <stop offset="100%" stop-color="#141829" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="16" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <rect width="1200" height="800" fill="url(#bgGrad)" />

  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1" />
  </pattern>
  <rect width="1200" height="800" fill="url(#grid)" />

  <!-- Ambient Glow -->
  <circle cx="300" cy="200" r="300" fill="#a3e635" opacity="0.14" filter="url(#glow)" />
  <circle cx="900" cy="600" r="300" fill="#a3e635" opacity="0.08" filter="url(#glow)" />

  <!-- Top Badge -->
  <rect x="60" y="50" width="1080" height="50" rx="12" fill="rgba(20,24,40,0.8)" stroke="rgba(255,255,255,0.08)" />
  <circle cx="90" cy="75" r="6" fill="#ff5f56" />
  <circle cx="112" cy="75" r="6" fill="#ffbd2e" />
  <circle cx="134" cy="75" r="6" fill="#27c93f" />
  <text x="165" y="81" fill="#a3e635" font-size="14" font-weight="800" letter-spacing="2">02 // BUILD FULL STACK REACT &amp; LARAVEL CODE</text>
  <rect x="950" y="63" width="160" height="24" rx="12" fill="#a3e635" opacity="0.2" />
  <text x="1030" y="79" fill="#a3e635" font-size="11" font-weight="800" text-anchor="middle">TYPED END-TO-END</text>

  <!-- Left Code Editor Box -->
  <rect x="60" y="130" width="680" height="580" rx="16" fill="rgba(12,14,24,0.95)" stroke="rgba(255,255,255,0.12)" stroke-width="1.5" />
  <rect x="60" y="130" width="680" height="42" rx="16" fill="rgba(22,26,42,0.9)" />
  <text x="90" y="156" fill="rgba(255,255,255,0.6)" font-size="12" font-weight="700">src/controllers/BookingController.ts</text>

  <!-- Code Snippet lines -->
  <text x="90" y="210" fill="#ff79c6" font-size="14" font-weight="700">import <tspan fill="#f1fa8c">{ React, useState, useEffect }</tspan> from <tspan fill="#f1fa8c">'react'</tspan>;</text>
  <text x="90" y="245" fill="#ff79c6" font-size="14" font-weight="700">import <tspan fill="#f1fa8c">{ Inertia }</tspan> from <tspan fill="#f1fa8c">'@inertiajs/inertia'</tspan>;</text>

  <text x="90" y="295" fill="#8be9fd" font-size="14" font-weight="700">export async function <tspan fill="#50fa7b">processRealtimeBooking</tspan>(req, res) {</text>
  <text x="120" y="330" fill="#f8f8f2" font-size="14">const { userId, slotId, paymentToken } = req.body;</text>
  <text x="120" y="365" fill="#6272a4" font-size="13">// 1. Lock slot in Redis &amp; verify WebSocket token</text>
  <text x="120" y="400" fill="#ff79c6" font-size="14">await <tspan fill="#bd93f9">Redis.setlock</tspan>(slotKey, userId, 30);</text>
  <text x="120" y="435" fill="#6272a4" font-size="13">// 2. Execute Razorpay/Stripe checkout API</text>
  <text x="120" y="470" fill="#ff79c6" font-size="14">const payment = await <tspan fill="#50fa7b">Stripe.charge</tspan>({ amount: 29900 });</text>
  <text x="120" y="505" fill="#6272a4" font-size="13">// 3. Dispatch WebSocket live notification broadcast</text>
  <text x="120" y="540" fill="#a3e635" font-size="14" font-weight="800">WebSocketServer.broadcast('SLOT_RESERVED', { slotId, userId });</text>
  <text x="120" y="575" fill="#ff79c6" font-size="14">return <tspan fill="#bd93f9">res.json</tspan>({ status: <tspan fill="#f1fa8c">'SUCCESS'</tspan> });</text>
  <text x="90" y="610" fill="#8be9fd" font-size="14" font-weight="700">}</text>

  <!-- Right Component Tree Box -->
  <rect x="770" y="130" width="370" height="580" rx="16" fill="rgba(16,20,34,0.9)" stroke="#a3e635" stroke-width="1.5" filter="url(#glow)" />
  <rect x="770" y="130" width="370" height="42" rx="16" fill="rgba(22,26,42,0.9)" />
  <text x="800" y="156" fill="#a3e635" font-size="13" font-weight="800">REACT 19 COMPONENT TREE</text>

  <rect x="800" y="200" width="310" height="54" rx="10" fill="rgba(163,230,53,0.15)" stroke="#a3e635" stroke-width="1" />
  <text x="820" y="232" fill="#ffffff" font-size="14" font-weight="800">&lt;AppProvider /&gt;</text>

  <rect x="830" y="275" width="280" height="54" rx="10" fill="rgba(255,255,255,0.05)" />
  <text x="850" y="307" fill="#ffffff" font-size="14" font-weight="700">├── &lt;NavigationLayout /&gt;</text>

  <rect x="860" y="350" width="250" height="54" rx="10" fill="rgba(255,255,255,0.05)" />
  <text x="880" y="382" fill="#a3e635" font-size="14" font-weight="700">│   ├── &lt;BookingCanvas /&gt;</text>

  <rect x="860" y="425" width="250" height="54" rx="10" fill="rgba(255,255,255,0.05)" />
  <text x="880" y="457" fill="#ffffff" font-size="14" font-weight="700">│   └── &lt;LiveScoreBoard /&gt;</text>

  <rect x="800" y="510" width="310" height="170" rx="12" fill="rgba(0,0,0,0.4)" stroke="rgba(255,255,255,0.08)" />
  <text x="820" y="545" fill="rgba(255,255,255,0.6)" font-size="12" font-weight="700">TEST COVERAGE &amp; SPEED</text>
  <text x="820" y="590" fill="#a3e635" font-size="36" font-weight="900">100% Pass</text>
  <text x="820" y="630" fill="#ffffff" font-size="13">60 FPS Smooth Render &amp; Zero Lag</text>
</svg>`;
}

function createAutomateSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800" style="background:#090b12; font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',Roboto,sans-serif;">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#080a10" />
      <stop offset="100%" stop-color="#1d120a" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="16" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <rect width="1200" height="800" fill="url(#bgGrad)" />

  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1" />
  </pattern>
  <rect width="1200" height="800" fill="url(#grid)" />

  <!-- Ambient Glow -->
  <circle cx="300" cy="200" r="300" fill="#f97316" opacity="0.14" filter="url(#glow)" />
  <circle cx="900" cy="600" r="300" fill="#f97316" opacity="0.08" filter="url(#glow)" />

  <!-- Top Badge -->
  <rect x="60" y="50" width="1080" height="50" rx="12" fill="rgba(20,24,40,0.8)" stroke="rgba(255,255,255,0.08)" />
  <circle cx="90" cy="75" r="6" fill="#ff5f56" />
  <circle cx="112" cy="75" r="6" fill="#ffbd2e" />
  <circle cx="134" cy="75" r="6" fill="#27c93f" />
  <text x="165" y="81" fill="#f97316" font-size="14" font-weight="800" letter-spacing="2">03 // AUTOMATE WORKFLOW QUEUES &amp; DEPLOYMENT</text>
  <rect x="950" y="63" width="160" height="24" rx="12" fill="#f97316" opacity="0.2" />
  <text x="1030" y="79" fill="#f97316" font-size="11" font-weight="800" text-anchor="middle">24/7 AUTONOMOUS</text>

  <!-- Left Queue Pipeline -->
  <rect x="60" y="130" width="520" height="580" rx="16" fill="rgba(16,20,34,0.9)" stroke="#f97316" stroke-width="1.5" filter="url(#glow)" />
  <rect x="60" y="130" width="520" height="42" rx="16" fill="rgba(28,20,16,0.9)" />
  <text x="90" y="156" fill="#f97316" font-size="13" font-weight="800">LARAVEL QUEUE &amp; CRON RUNNERS</text>

  ${[1, 2, 3, 4].map((q) => `
    <rect x="90" y="${185 + (q - 1) * 115}" width="460" height="85" rx="12" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" />
    <circle cx="120" cy="${225 + (q - 1) * 115}" r="14" fill="#f97316" opacity="0.3" />
    <text x="150" y="${220 + (q - 1) * 115}" fill="#ffffff" font-size="14" font-weight="700">Job #${q}048: SendInvoiceReceipt</text>
    <text x="150" y="${242 + (q - 1) * 115}" fill="rgba(255,255,255,0.5)" font-size="12">Executed at 03:00:00 AM · 14.8ms processing</text>
    <rect x="440" y="${210 + (q - 1) * 115}" width="90" height="26" rx="13" fill="#f97316" opacity="0.2" />
    <text x="485" y="${227 + (q - 1) * 115}" fill="#f97316" font-size="10" font-weight="900" text-anchor="middle">PASSED</text>
  `).join("")}

  <!-- Right SSH & VPS Deployment Box -->
  <rect x="610" y="130" width="530" height="580" rx="16" fill="rgba(16,20,34,0.9)" stroke="rgba(255,255,255,0.12)" stroke-width="1.5" />
  <rect x="610" y="130" width="530" height="42" rx="16" fill="rgba(22,26,42,0.9)" />
  <text x="640" y="156" fill="#ffffff" font-size="13" font-weight="800">SSH &amp; HOSTINGER VPS DEPLOYMENT</text>

  <!-- Terminal Output Lines -->
  <rect x="640" y="195" width="470" height="340" rx="12" fill="#040508" stroke="rgba(255,255,255,0.1)" />
  <text x="660" y="230" fill="#f97316" font-size="13" font-weight="700">$ git pull origin main</text>
  <text x="660" y="260" fill="rgba(255,255,255,0.6)" font-size="13">Updating 4f8a1e..9b2c3d</text>
  <text x="660" y="295" fill="#f97316" font-size="13" font-weight="700">$ composer install --no-dev --optimize-autoloader</text>
  <text x="660" y="325" fill="rgba(255,255,255,0.6)" font-size="13">Generating optimized autoload files</text>
  <text x="660" y="360" fill="#f97316" font-size="13" font-weight="700">$ php artisan config:cache &amp;&amp; php artisan route:cache</text>
  <text x="660" y="390" fill="#27c93f" font-size="13" font-weight="700">Configuration cached successfully!</text>
  <text x="660" y="425" fill="#f97316" font-size="13" font-weight="700">$ npm run build</text>
  <text x="660" y="455" fill="#27c93f" font-size="13" font-weight="700">✓ Built production bundle in 420ms</text>

  <rect x="640" y="555" width="470" height="125" rx="14" fill="rgba(249,115,22,0.15)" stroke="#f97316" stroke-width="1" />
  <text x="660" y="595" fill="#ffffff" font-size="16" font-weight="800">AUTOMATED CI/CD HEALTH</text>
  <text x="660" y="635" fill="#f97316" font-size="28" font-weight="900">Zero Downtime Deploy</text>
</svg>`;
}

console.log("Generating Approach SVG & PNG images...");

const svg1 = createArchitectSVG();
const svg2 = createBuildSVG();
const svg3 = createAutomateSVG();

const p1Svg = path.join(assetsDir, "approach_architect.svg");
const p1Png = path.join(assetsDir, "approach_architect.png");

const p2Svg = path.join(assetsDir, "approach_build.svg");
const p2Png = path.join(assetsDir, "approach_build.png");

const p3Svg = path.join(assetsDir, "approach_automate.svg");
const p3Png = path.join(assetsDir, "approach_automate.png");

fs.writeFileSync(p1Svg, svg1, "utf8");
fs.writeFileSync(p2Svg, svg2, "utf8");
fs.writeFileSync(p3Svg, svg3, "utf8");

try {
  execSync(`sips -s format png "${p1Svg}" --out "${p1Png}"`);
  execSync(`sips -s format png "${p2Svg}" --out "${p2Png}"`);
  execSync(`sips -s format png "${p3Svg}" --out "${p3Png}"`);
  console.log("SUCCESS! Created approach_architect.png, approach_build.png, approach_automate.png!");
} catch (err) {
  console.error("PNG conversion error:", err.message);
}
