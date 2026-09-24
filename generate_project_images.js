import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsDir = path.join(__dirname, "src", "assets");

function escapeXml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function createBaseSVG(projectName, themeColor, slideNum, title, subtitle, contentSvg) {
  const bgGradStart = "#08090e";
  const bgGradEnd = "#0f111a";

  const safeTitle = escapeXml(title);
  const safeSubtitle = escapeXml(subtitle);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900" style="background:#08090e; font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',Roboto,sans-serif;">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bgGradStart}" />
      <stop offset="100%" stop-color="${bgGradEnd}" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${themeColor}" stop-opacity="0.9" />
      <stop offset="100%" stop-color="${themeColor}" stop-opacity="0.3" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="16" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1600" height="900" fill="url(#bgGrad)" />

  <!-- Grid overlay -->
  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1" />
  </pattern>
  <rect width="1600" height="900" fill="url(#grid)" />

  <!-- Ambient Lights -->
  <circle cx="250" cy="150" r="320" fill="${themeColor}" opacity="0.14" filter="url(#glow)" />
  <circle cx="1380" cy="750" r="360" fill="${themeColor}" opacity="0.08" filter="url(#glow)" />

  <!-- Main Window Frame -->
  <rect x="50" y="40" width="1500" height="820" rx="20" fill="#0b0d14" stroke="rgba(255,255,255,0.12)" stroke-width="1.5" />

  <!-- Top Window Bar -->
  <rect x="50" y="40" width="1500" height="55" rx="20" fill="rgba(18,20,30,0.95)" />
  <circle cx="85" cy="67" r="6" fill="#ff5f56" />
  <circle cx="108" cy="67" r="6" fill="#ffbd2e" />
  <circle cx="131" cy="67" r="6" fill="#27c93f" />

  <text x="170" y="72" fill="#ffffff" font-size="16" font-weight="700" letter-spacing="1.5">${projectName.toUpperCase()} // SYSTEM MODULE 0${slideNum}</text>
  <rect x="1270" y="56" width="250" height="24" rx="12" fill="rgba(255,255,255,0.08)" />
  <text x="1395" y="72" fill="${themeColor}" font-size="11" font-weight="700" text-anchor="middle" letter-spacing="1">STATUS: ONLINE &amp; SECURE</text>

  <!-- Sidebar Nav -->
  <rect x="50" y="95" width="210" height="765" fill="rgba(10,11,18,0.85)" border-right="1px stroke rgba(255,255,255,0.05)" />
  <rect x="68" y="125" width="174" height="40" rx="10" fill="${themeColor}" opacity="0.2" stroke="${themeColor}" stroke-width="1" />
  <text x="88" y="150" fill="${themeColor}" font-size="13" font-weight="700">VIEW 0${slideNum} / 10</text>

  <text x="88" y="210" fill="rgba(255,255,255,0.6)" font-size="12" font-weight="600">DASHBOARD</text>
  <text x="88" y="255" fill="rgba(255,255,255,0.6)" font-size="12" font-weight="600">ANALYTICS</text>
  <text x="88" y="300" fill="rgba(255,255,255,0.6)" font-size="12" font-weight="600">DIRECTORY</text>
  <text x="88" y="345" fill="rgba(255,255,255,0.6)" font-size="12" font-weight="600">LOGISTICS</text>
  <text x="88" y="390" fill="rgba(255,255,255,0.6)" font-size="12" font-weight="600">SETTINGS</text>

  <!-- Slide Header Banner -->
  <rect x="285" y="115" width="1240" height="85" rx="14" fill="rgba(18,21,34,0.65)" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
  <rect x="305" y="132" width="90" height="26" rx="6" fill="${themeColor}" />
  <text x="350" y="149" fill="#000000" font-size="11" font-weight="900" text-anchor="middle">MODULE 0${slideNum}</text>

  <text x="415" y="152" fill="#ffffff" font-size="22" font-weight="800">${safeTitle}</text>
  <text x="415" y="178" fill="rgba(255,255,255,0.6)" font-size="13" font-weight="500">${safeSubtitle}</text>

  <!-- Dynamic Unique Content Layout -->
  ${contentSvg}
</svg>`;
}

function layout1_OverviewDashboard(color) {
  return `
  <g>
    <rect x="285" y="220" width="295" height="110" rx="14" fill="rgba(18,21,34,0.8)" stroke="rgba(255,255,255,0.08)" />
    <text x="310" y="250" fill="rgba(255,255,255,0.5)" font-size="12">TOTAL USERS / ACTIVE</text>
    <text x="310" y="290" fill="${color}" font-size="32" font-weight="900">128,450</text>
    <rect x="490" y="270" width="70" height="24" rx="12" fill="${color}" opacity="0.2" />
    <text x="525" y="286" fill="${color}" font-size="11" font-weight="800" text-anchor="middle">+18.4%</text>

    <rect x="600" y="220" width="295" height="110" rx="14" fill="rgba(18,21,34,0.8)" stroke="rgba(255,255,255,0.08)" />
    <text x="625" y="250" fill="rgba(255,255,255,0.5)" font-size="12">LIVE REVENUE / METRICS</text>
    <text x="625" y="290" fill="#ffffff" font-size="32" font-weight="900">$482,900</text>
    <rect x="805" y="270" width="70" height="24" rx="12" fill="#27c93f" opacity="0.2" />
    <text x="840" y="286" fill="#27c93f" font-size="11" font-weight="800" text-anchor="middle">+24.1%</text>

    <rect x="915" y="220" width="295" height="110" rx="14" fill="rgba(18,21,34,0.8)" stroke="rgba(255,255,255,0.08)" />
    <text x="940" y="250" fill="rgba(255,255,255,0.5)" font-size="12">SYSTEM CAPACITY</text>
    <text x="940" y="290" fill="${color}" font-size="32" font-weight="900">99.98%</text>
    <rect x="1120" y="270" width="70" height="24" rx="12" fill="${color}" opacity="0.2" />
    <text x="1155" y="286" fill="${color}" font-size="11" font-weight="800" text-anchor="middle">OPTIMAL</text>

    <rect x="1230" y="220" width="295" height="110" rx="14" fill="rgba(18,21,34,0.8)" stroke="rgba(255,255,255,0.08)" />
    <text x="1255" y="250" fill="rgba(255,255,255,0.5)" font-size="12">API LATENCY (MS)</text>
    <text x="1255" y="290" fill="#ffffff" font-size="32" font-weight="900">14.2 ms</text>
    <rect x="1435" y="270" width="70" height="24" rx="12" fill="#27c93f" opacity="0.2" />
    <text x="1470" y="286" fill="#27c93f" font-size="11" font-weight="800" text-anchor="middle">FAST</text>
  </g>

  <g>
    <rect x="285" y="350" width="800" height="490" rx="16" fill="rgba(18,21,34,0.8)" stroke="rgba(255,255,255,0.08)" />
    <text x="315" y="390" fill="#ffffff" font-size="16" font-weight="700">REALTIME TELEMETRY TRAFFIC</text>
    <path d="M 315 760 Q 450 500 600 620 T 900 480 L 1050 680" fill="none" stroke="${color}" stroke-width="4" filter="url(#glow)" />
    <path d="M 315 760 Q 450 500 600 620 T 900 480 L 1050 680 L 1050 800 L 315 800 Z" fill="${color}" opacity="0.1" />
  </g>

  <g>
    <rect x="1105" y="350" width="420" height="490" rx="16" fill="rgba(18,21,34,0.8)" stroke="rgba(255,255,255,0.08)" />
    <text x="1135" y="390" fill="#ffffff" font-size="16" font-weight="700">REGIONAL USAGE BREAKDOWN</text>
    <rect x="1135" y="440" width="240" height="28" rx="6" fill="${color}" opacity="0.8" />
    <text x="1390" y="460" fill="#ffffff" font-size="13" font-weight="700">78%</text>

    <rect x="1135" y="510" width="310" height="28" rx="6" fill="${color}" />
    <text x="1460" y="530" fill="#ffffff" font-size="13" font-weight="700">92%</text>

    <rect x="1135" y="580" width="180" height="28" rx="6" fill="${color}" opacity="0.6" />
    <text x="1330" y="600" fill="#ffffff" font-size="13" font-weight="700">58%</text>

    <rect x="1135" y="650" width="280" height="28" rx="6" fill="${color}" opacity="0.9" />
    <text x="1430" y="670" fill="#ffffff" font-size="13" font-weight="700">84%</text>
  </g>`;
}

function layout2_FullDataTable(color) {
  return `
  <rect x="285" y="220" width="1240" height="620" rx="16" fill="rgba(18,21,34,0.85)" stroke="rgba(255,255,255,0.08)" />
  <rect x="315" y="245" width="400" height="42" rx="10" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" />
  <text x="335" y="271" fill="rgba(255,255,255,0.4)" font-size="13">🔍 Search entries, users or logs...</text>
  <rect x="1385" y="245" width="110" height="42" rx="10" fill="${color}" />
  <text x="1440" y="271" fill="#000" font-size="12" font-weight="800" text-anchor="middle">+ EXPORT</text>

  <rect x="315" y="310" width="1180" height="45" rx="8" fill="rgba(255,255,255,0.06)" />
  <text x="340" y="337" fill="${color}" font-size="12" font-weight="800">ENTRY ID / RECORD</text>
  <text x="600" y="337" fill="rgba(255,255,255,0.7)" font-size="12" font-weight="800">CATEGORY &amp; REGION</text>
  <text x="900" y="337" fill="rgba(255,255,255,0.7)" font-size="12" font-weight="800">TELEMETRY STAMP</text>
  <text x="1180" y="337" fill="rgba(255,255,255,0.7)" font-size="12" font-weight="800">MATCH SCORE</text>
  <text x="1380" y="337" fill="${color}" font-size="12" font-weight="800">STATUS</text>

  ${[1, 2, 3, 4, 5, 6].map((i) => `
    <rect x="315" y="${365 + (i - 1) * 72}" width="1180" height="60" rx="10" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.04)" />
    <circle cx="340" cy="${395 + (i - 1) * 72}" r="14" fill="${color}" opacity="0.3" />
    <text x="370" y="${400 + (i - 1) * 72}" fill="#ffffff" font-size="14" font-weight="700">REF-#00${i}84 - Automated Log Node</text>
    <text x="600" y="${400 + (i - 1) * 72}" fill="rgba(255,255,255,0.6)" font-size="13">Enterprise Cluster / APAC</text>
    <text x="900" y="${400 + (i - 1) * 72}" fill="rgba(255,255,255,0.6)" font-size="13">2025-09-24 14:0${i}:12</text>
    <text x="1180" y="${400 + (i - 1) * 72}" fill="${color}" font-size="14" font-weight="800">99.${9 - i}%</text>
    <rect x="1375" y="${380 + (i - 1) * 72}" width="95" height="28" rx="14" fill="${color}" opacity="0.2" />
    <text x="1422" y="${398 + (i - 1) * 72}" fill="${color}" font-size="11" font-weight="800" text-anchor="middle">VERIFIED</text>
  `).join("")}`;
}

function layout3_KanbanBoard(color) {
  const cols = ["BACKLOG", "IN PROGRESS", "VERIFICATION", "COMPLETED"];
  return `
  <g>
    ${cols.map((colName, cIdx) => `
      <g transform="translate(${285 + cIdx * 315}, 220)">
        <rect width="295" height="620" rx="16" fill="rgba(18,21,34,0.85)" stroke="rgba(255,255,255,0.08)" />
        <rect x="15" y="15" width="265" height="40" rx="8" fill="rgba(255,255,255,0.05)" />
        <text x="30" y="40" fill="${cIdx === 1 ? color : "#ffffff"}" font-size="13" font-weight="800">${colName}</text>
        <circle cx="250" cy="35" r="10" fill="${color}" opacity="${0.4 + cIdx * 0.2}" />
        <text x="250" y="39" fill="#000" font-size="10" font-weight="900" text-anchor="middle">${cIdx + 3}</text>

        <rect x="15" y="70" width="265" height="150" rx="12" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.06)" />
        <rect x="30" y="85" width="80" height="20" rx="4" fill="${color}" opacity="0.3" />
        <text x="70" y="99" fill="${color}" font-size="10" font-weight="800" text-anchor="middle">PRIORITY HIGH</text>
        <text x="30" y="130" fill="#ffffff" font-size="14" font-weight="700">Module Task #${cIdx + 1}01</text>
        <text x="30" y="152" fill="rgba(255,255,255,0.5)" font-size="12">Pipeline processing &amp; queue</text>
        <rect x="30" y="180" width="100" height="8" rx="4" fill="${color}" opacity="0.6" />

        <rect x="15" y="235" width="265" height="150" rx="12" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.06)" />
        <rect x="30" y="250" width="80" height="20" rx="4" fill="rgba(255,255,255,0.1)" />
        <text x="70" y="264" fill="#ffffff" font-size="10" font-weight="800" text-anchor="middle">ROUTINE</text>
        <text x="30" y="295" fill="#ffffff" font-size="14" font-weight="700">Data Synchronization</text>
        <text x="30" y="317" fill="rgba(255,255,255,0.5)" font-size="12">Batch verification sequence</text>

        <rect x="15" y="400" width="265" height="150" rx="12" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.06)" />
        <text x="30" y="440" fill="#ffffff" font-size="14" font-weight="700">Security Audit Check</text>
        <text x="30" y="462" fill="rgba(255,255,255,0.5)" font-size="12">Automated compliance scan</text>
      </g>
    `).join("")}
  </g>`;
}

function layout4_GiantAnalyticsGraph(color) {
  return `
  <g>
    <rect x="285" y="220" width="1240" height="420" rx="16" fill="rgba(18,21,34,0.85)" stroke="rgba(255,255,255,0.08)" />
    <text x="315" y="260" fill="#ffffff" font-size="18" font-weight="800">ADVANCED TELEMETRY ANALYTICS WAVE</text>

    <path d="M 315 580 C 450 300, 600 600, 750 380 C 900 250, 1100 520, 1250 340 L 1500 480" fill="none" stroke="${color}" stroke-width="5" filter="url(#glow)" />
    <path d="M 315 580 C 450 300, 600 600, 750 380 C 900 250, 1100 520, 1250 340 L 1500 480 L 1500 610 L 315 610 Z" fill="${color}" opacity="0.15" />

    <rect x="285" y="660" width="390" height="180" rx="14" fill="rgba(18,21,34,0.85)" stroke="rgba(255,255,255,0.08)" />
    <text x="315" y="700" fill="rgba(255,255,255,0.5)" font-size="12">PEAK THROUGHPUT</text>
    <text x="315" y="745" fill="${color}" font-size="34" font-weight="900">4.8 GB/s</text>

    <rect x="710" y="660" width="390" height="180" rx="14" fill="rgba(18,21,34,0.85)" stroke="rgba(255,255,255,0.08)" />
    <text x="740" y="700" fill="rgba(255,255,255,0.5)" font-size="12">FAILOVER INDEX</text>
    <text x="740" y="745" fill="#ffffff" font-size="34" font-weight="900">0.0001%</text>

    <rect x="1135" y="660" width="390" height="180" rx="14" fill="rgba(18,21,34,0.85)" stroke="rgba(255,255,255,0.08)" />
    <text x="1165" y="700" fill="rgba(255,255,255,0.5)" font-size="12">CLOUD ENDPOINTS</text>
    <text x="1165" y="745" fill="${color}" font-size="34" font-weight="900">2,480 Active</text>
  </g>`;
}

function layout5_ModalVerificationForm(color) {
  return `
  <g>
    <rect x="285" y="220" width="480" height="620" rx="16" fill="rgba(18,21,34,0.85)" stroke="rgba(255,255,255,0.08)" />
    <circle cx="525" cy="450" r="140" fill="none" stroke="${color}" stroke-width="3" stroke-dasharray="10 6" filter="url(#glow)" />
    <circle cx="525" cy="450" r="100" fill="${color}" opacity="0.1" />
    <circle cx="525" cy="420" r="40" fill="${color}" opacity="0.4" />
    <path d="M 455 520 Q 525 470 595 520" fill="none" stroke="${color}" stroke-width="4" />
    <text x="525" y="640" fill="${color}" font-size="16" font-weight="800" text-anchor="middle">BIOMETRIC MATCH: 99.8%</text>

    <rect x="790" y="220" width="735" height="620" rx="16" fill="rgba(18,21,34,0.85)" stroke="rgba(255,255,255,0.08)" />
    <text x="825" y="270" fill="#ffffff" font-size="20" font-weight="800">AUTOMATED PROFILE VERIFICATION</text>

    <text x="825" y="330" fill="rgba(255,255,255,0.5)" font-size="12">FULL NAME / TITLE</text>
    <rect x="825" y="345" width="665" height="50" rx="10" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" />
    <text x="850" y="377" fill="#ffffff" font-size="14" font-weight="600">Sarah J. Chen (Verified Lead)</text>

    <text x="825" y="430" fill="rgba(255,255,255,0.5)" font-size="12">IDENTIFIER / REGISTRATION NO.</text>
    <rect x="825" y="445" width="665" height="50" rx="10" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" />
    <text x="850" y="477" fill="${color}" font-size="14" font-weight="700">ID-REG-2025-994182-AZ</text>

    <text x="825" y="530" fill="rgba(255,255,255,0.5)" font-size="12">AUTHORIZATION LEVEL</text>
    <rect x="825" y="545" width="665" height="50" rx="10" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" />
    <text x="850" y="577" fill="#ffffff" font-size="14" font-weight="600">Tier-1 Administrator &amp; System Auditor</text>

    <rect x="825" y="640" width="240" height="54" rx="27" fill="${color}" />
    <text x="945" y="674" fill="#000" font-size="14" font-weight="900" text-anchor="middle">APPROVE &amp; ISSUE PASS</text>
  </g>`;
}

function layout6_TacticalMapFloorplan(color) {
  return `
  <g>
    <rect x="285" y="220" width="900" height="620" rx="16" fill="rgba(14,16,26,0.9)" stroke="rgba(255,255,255,0.08)" />
    <rect x="335" y="270" width="800" height="520" rx="12" fill="none" stroke="${color}" stroke-width="2" stroke-dasharray="12 8" opacity="0.6" />
    <line x1="735" y1="270" x2="735" y2="790" stroke="${color}" stroke-width="2" />
    <circle cx="735" cy="530" r="80" fill="none" stroke="${color}" stroke-width="2" />

    <circle cx="480" cy="380" r="16" fill="${color}" filter="url(#glow)" />
    <text x="480" y="385" fill="#000" font-size="11" font-weight="900" text-anchor="middle">A1</text>

    <circle cx="980" cy="680" r="16" fill="${color}" filter="url(#glow)" />
    <text x="980" y="685" fill="#000" font-size="11" font-weight="900" text-anchor="middle">B4</text>

    <rect x="1215" y="220" width="310" height="620" rx="16" fill="rgba(18,21,34,0.85)" stroke="rgba(255,255,255,0.08)" />
    <text x="1245" y="260" fill="#ffffff" font-size="16" font-weight="800">SPATIAL TELEMETRY</text>
    <rect x="1245" y="300" width="250" height="80" rx="10" fill="rgba(255,255,255,0.04)" />
    <text x="1265" y="330" fill="rgba(255,255,255,0.5)" font-size="12">ACTIVE ZONES</text>
    <text x="1265" y="362" fill="${color}" font-size="22" font-weight="900">12 / 12 Online</text>
  </g>`;
}

function layout7_AudioVideoMediaHub(color) {
  return `
  <g>
    <rect x="285" y="220" width="850" height="620" rx="16" fill="rgba(18,21,34,0.85)" stroke="rgba(255,255,255,0.08)" />
    <rect x="325" y="260" width="770" height="380" rx="14" fill="#050609" stroke="rgba(255,255,255,0.1)" />

    ${[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map((b) => `
      <rect x="${370 + b * 42}" y="${520 - (b % 5) * 35}" width="22" height="${60 + (b % 5) * 35}" rx="6" fill="${color}" opacity="${0.4 + (b % 4) * 0.2}" />
    `).join("")}

    <circle cx="710" cy="700" r="32" fill="${color}" filter="url(#glow)" />
    <polygon points="705,688 722,700 705,712" fill="#000" />
    <rect x="325" y="770" width="770" height="8" rx="4" fill="rgba(255,255,255,0.1)" />
    <rect x="325" y="770" width="480" height="8" rx="4" fill="${color}" />

    <rect x="1165" y="220" width="360" height="620" rx="16" fill="rgba(18,21,34,0.85)" stroke="rgba(255,255,255,0.08)" />
    <text x="1195" y="260" fill="#ffffff" font-size="16" font-weight="800">MEDIA STREAM QUEUE</text>
    ${[1, 2, 3, 4, 5].map((p) => `
      <rect x="1195" y="${285 + p * 65}" width="300" height="52" rx="8" fill="rgba(255,255,255,0.03)" />
      <text x="1215" y="${317 + p * 65}" fill="#ffffff" font-size="13" font-weight="600">Track 0${p} - Positive Energy Stream</text>
    `).join("")}
  </g>`;
}

function layout8_MobileAppDualView(color) {
  return `
  <g>
    <g transform="translate(420, 210)">
      <rect width="320" height="630" rx="40" fill="#06070a" stroke="${color}" stroke-width="4" filter="url(#glow)" />
      <rect x="100" y="15" width="120" height="20" rx="10" fill="#151722" />
      <rect x="20" y="55" width="280" height="540" rx="24" fill="rgba(18,21,34,0.9)" />
      <text x="160" y="100" fill="${color}" font-size="16" font-weight="800" text-anchor="middle">MOBILE APP SYNC</text>
      <circle cx="160" cy="220" r="60" fill="${color}" opacity="0.2" />
      <rect x="50" y="320" width="220" height="40" rx="10" fill="${color}" />
      <text x="160" y="345" fill="#000" font-size="12" font-weight="900" text-anchor="middle">QUICK ACTION</text>
    </g>

    <g transform="translate(860, 210)">
      <rect width="320" height="630" rx="40" fill="#06070a" stroke="rgba(255,255,255,0.3)" stroke-width="3" />
      <rect x="100" y="15" width="120" height="20" rx="10" fill="#151722" />
      <rect x="20" y="55" width="280" height="540" rx="24" fill="rgba(18,21,34,0.9)" />
      <text x="160" y="100" fill="#ffffff" font-size="16" font-weight="800" text-anchor="middle">SCANNER &amp; PASS</text>
      <rect x="50" y="160" width="220" height="220" rx="16" fill="rgba(255,255,255,0.05)" stroke="${color}" stroke-width="2" stroke-dasharray="8 6" />
      <text x="160" y="275" fill="${color}" font-size="14" font-weight="800" text-anchor="middle">QR / BARCODE ACTIVE</text>
    </g>
  </g>`;
}

function layout9_CalendarScheduleGrid(color) {
  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  return `
  <g>
    <rect x="285" y="220" width="1240" height="620" rx="16" fill="rgba(18,21,34,0.85)" stroke="rgba(255,255,255,0.08)" />
    ${days.map((d, dIdx) => `
      <g transform="translate(${310 + dIdx * 172}, 245)">
        <rect width="160" height="40" rx="8" fill="rgba(255,255,255,0.06)" />
        <text x="80" y="25" fill="${dIdx === 2 ? color : "#ffffff"}" font-size="13" font-weight="800" text-anchor="middle">${d}</text>

        <rect y="55" width="160" height="90" rx="10" fill="${dIdx % 2 === 0 ? color : "rgba(255,255,255,0.04)"}" opacity="${dIdx % 2 === 0 ? 0.3 : 1}" />
        <text x="15" y="85" fill="#ffffff" font-size="12" font-weight="700">09:00 - Slot 01</text>
        <text x="15" y="110" fill="rgba(255,255,255,0.7)" font-size="11">Reserved Entry</text>

        <rect y="160" width="160" height="90" rx="10" fill="${dIdx === 2 ? color : "rgba(255,255,255,0.04)"}" />
        <text x="15" y="190" fill="${dIdx === 2 ? "#000" : "#ffffff"}" font-size="12" font-weight="700">14:00 - Slot 02</text>

        <rect y="265" width="160" height="90" rx="10" fill="rgba(255,255,255,0.04)" />
        <text x="15" y="295" fill="#ffffff" font-size="12" font-weight="700">18:00 - Slot 03</text>
      </g>
    `).join("")}
  </g>`;
}

function layout10_ECommerceProductCatalog(color) {
  return `
  <g>
    ${[1, 2, 3, 4, 5, 6].map((p) => {
      const row = p > 3 ? 1 : 0;
      const col = (p - 1) % 3;
      return `
        <g transform="translate(${285 + col * 420}, ${220 + row * 305})">
          <rect width="395" height="280" rx="14" fill="rgba(18,21,34,0.85)" stroke="rgba(255,255,255,0.08)" />
          <rect x="20" y="20" width="355" height="130" rx="10" fill="${color}" opacity="0.15" stroke="${color}" stroke-width="1" />
          <text x="197" y="90" fill="${color}" font-size="18" font-weight="800" text-anchor="middle">ITEM PACKAGE #${p}</text>
          <text x="20" y="180" fill="#ffffff" font-size="15" font-weight="700">Enterprise Access Pass / Ticket</text>
          <text x="20" y="205" fill="rgba(255,255,255,0.5)" font-size="12">Includes full digital access &amp; material sync</text>

          <text x="20" y="250" fill="${color}" font-size="20" font-weight="900">$299.00</text>
          <rect x="260" y="225" width="115" height="36" rx="18" fill="${color}" />
          <text x="317" y="248" fill="#000" font-size="11" font-weight="900" text-anchor="middle">PURCHASE</text>
        </g>
      `;
    }).join("")}
  </g>`;
}

function getLayoutSvgForSlide(slideNum, color) {
  switch (slideNum) {
    case 1: return layout1_OverviewDashboard(color);
    case 2: return layout2_FullDataTable(color);
    case 3: return layout3_KanbanBoard(color);
    case 4: return layout4_GiantAnalyticsGraph(color);
    case 5: return layout5_ModalVerificationForm(color);
    case 6: return layout6_TacticalMapFloorplan(color);
    case 7: return layout7_AudioVideoMediaHub(color);
    case 8: return layout8_MobileAppDualView(color);
    case 9: return layout9_CalendarScheduleGrid(color);
    case 10: return layout10_ECommerceProductCatalog(color);
    default: return layout1_OverviewDashboard(color);
  }
}

const projectsData = [
  {
    name: "tenniskhelo",
    title: "TennisKhelo",
    color: "#a3e635",
    views: [
      { title: "Court Availability Overview Dashboard", sub: "Real-time slot locking across Tennis, Badminton & Pickleball" },
      { title: "Player & Tournament Directory", sub: "National rankings, player roster & tournament registrations" },
      { title: "Match Fixture & Draw Pipeline", sub: "Knockout, Round-Robin & League match logistics" },
      { title: "Live WebSocket Match Analytics Wave", sub: "Real-time point-by-point tracking (40-30), serve speed & set timelines" },
      { title: "Player Profile & Biometric Pass", sub: "Sumit Nagal & player verification, membership badge & stats" },
      { title: "3D Interactive Court Arena Map", sub: "Hard court & Clay court reservation matrix and spatial layout" },
      { title: "Live Streaming & Match Audio Hub", sub: "Court commentary audio streams, broadcast channel & spectator queue" },
      { title: "TennisKhelo Mobile App Sync", sub: "QR check-in pass, mobile court reservations & digital membership card" },
      { title: "Weekly Court Booking Calendar Grid", sub: "Court allocation schedule, referee assignments & time matrix" },
      { title: "Coach & Tournament Pass Store", sub: "Rohan Bopanna Tennis Academy hourly packages & entry tickets" },
    ]
  },
  {
    name: "richestlife",
    title: "RichestLife",
    color: "#10b981",
    views: [
      { title: "Total Portfolio & Net Worth Dashboard", sub: "$2,458,920.80 total portfolio value & asset allocation ring" },
      { title: "Positive Energy & Virtue Ledger Table", sub: "Mind, Body & Spirit energy balance management log" },
      { title: "6 Happy Life Experiments Pipeline", sub: "Financial, Career, Health, Family, Romance & Spiritual progress" },
      { title: "Super Life Code Financial Analytics Wave", sub: "Real-time anomaly detection, dividend logs & AI insights" },
      { title: "User Spiritual Awakening Verification", sub: "Master Taiyang Shengde student registration & virtue score" },
      { title: "Global Study Group Branch Map", sub: "Singapore, Malaysia, Taiwan & USA study group regional branches" },
      { title: "Tian Yuan Music & Podcast Media Player", sub: "Positive Energy Music streams & 'Bliss to Your Home' podcasts" },
      { title: "Tian Yuan Walks the World Mobile App", sub: "Mobile app sync view, daily positive quotes & reflection tracker" },
      { title: "Weekly Co-Study Event Calendar", sub: "Global online co-study sessions, live broadcasts & seminar dates" },
      { title: "Multi-Currency E-Commerce Store", sub: "Super Life Code book catalog, digital audio & MYR/USD seminar tickets" },
    ]
  },
  {
    name: "idmitra",
    title: "IDMitra",
    color: "#06b6d4",
    views: [
      { title: "Bulk ID Card Processing Dashboard", sub: "Automated generation for schools, colleges & corporations (1,000+ cards)" },
      { title: "Institutional User Directory Table", sub: "Student/Employee roster, photo status & card issuance history" },
      { title: "ID Card Print Queue Kanban Pipeline", sub: "Batch PDF/PNG card export, print spooler & hardware status" },
      { title: "System Throughput & Print Telemetry", sub: "14,820 cards/hr print capacity & printer health analytics" },
      { title: "AI OCR Document & Facial Verification", sub: "Passport & Driver License field extraction + Biometric matching" },
      { title: "High-Speed Thermal Printer Matrix Map", sub: "Jaipur ABHIT INDUSTRIES print node spatial status & spooler map" },
      { title: "Operator Audit Stream & Log Hub", sub: "Real-time audit log archive, access logs & security status" },
      { title: "IDMitra Android App Sync Portal", sub: "Google Play app sync status, camera capture feed & cloud upload" },
      { title: "Institutional Batch Print Schedule Grid", sub: "School & Corporate printing calendar timeline & delivery dates" },
      { title: "Enterprise Software Subscription Catalog", sub: "Bulk card credit packages, ID templates & print hardware tiers" },
    ]
  },
  {
    name: "safegent",
    title: "SafeGent",
    color: "#f97316",
    views: [
      { title: "SOC Operational Command Dashboard", sub: "Tactical overview, threat response metrics (2.8s) & uptime score" },
      { title: "Critical Threat Incident Log Table", sub: "Perimeter infrared barrier logs, security alerts & event history" },
      { title: "Guard Shift & Dispatch Pipeline", sub: "Mon-Sun shift matrix, on-duty guard status & supervisor assignments" },
      { title: "Perimeter Sensor Telemetry Analytics Wave", sub: "Zone 4 Alpha barrier sensors, thermal camera telemetry & AI logs" },
      { title: "Guard Credentials & Verification Pass", sub: "42 On-Duty personnel health, biometric verification & equipment check" },
      { title: "Satellite Tactical Perimeter Grid Map", sub: "Global satellite tactical map with live threat pins & zone overlays" },
      { title: "SOC Voice & Video Command Channel", sub: "Live WebSocket messaging & audio dispatch between field and SOC" },
      { title: "Mobile Supervisor Field App", sub: "GPS guard location tracking, panic button alerts & field camera stream" },
      { title: "Guard Patrol Duty Schedule Calendar", sub: "24/7 security roster, checkpoint timetables & supervisor shifts" },
      { title: "Security SLA & Equipment Catalog", sub: "Security tier pricing plans, thermal cameras & subscription quote" },
    ]
  },
  {
    name: "ghpjaipur",
    title: "GHP Jaipur",
    color: "#14b8a6",
    views: [
      { title: "Group Corporate Heritage Dashboard", sub: "50-Year Real Estate, Healthcare, Education & Hospitality overview" },
      { title: "Realty & Township Property Table", sub: "Eden Garden (Sikar Road), Indralok, Swaran & Grandeur listings" },
      { title: "Hospital Department & Project Pipeline", sub: "Cardiology, Radiology, Real Estate & Educational project stages" },
      { title: "Patient ECG & Medical Telemetry Wave", sub: "Real-time ECG waveforms, SpO2 (98%) & BPM patient monitors" },
      { title: "Doctor Credentials & RERA Legal Portal", sub: "Key medical staff schedules & RERA approved property documents" },
      { title: "Township Masterplan & Spatial Site Map", sub: "40ft Gothic entrance township layout & amenity spatial map" },
      { title: "CSR Audio & Community Broadcast Hub", sub: "Smt. Durgadevi Sharma Trust welfare audio & event broadcasts" },
      { title: "GHP Jaipur Customer Mobile App Sync", sub: "Tenant portal, maintenance request app & property booking pass" },
      { title: "Doctor Appointment & Construction Calendar", sub: "Hospital appointment scheduling & property delivery timeline" },
      { title: "Luxury Suite & Villa Booking Catalog", sub: "Hospitality resort suites, room rates & luxury villa packages" },
    ]
  }
];

console.log("Generating 50 SVG images and converting them to PNG...");

for (const proj of projectsData) {
  for (let i = 0; i < proj.views.length; i++) {
    const slideNum = i + 1;
    const view = proj.views[i];
    const layoutContent = getLayoutSvgForSlide(slideNum, proj.color);
    const svgContent = createBaseSVG(proj.title, proj.color, slideNum, view.title, view.sub, layoutContent);

    const svgFileName = `${proj.name}_${slideNum}.svg`;
    const pngFileName = `${proj.name}_${slideNum}.png`;

    const svgPath = path.join(assetsDir, svgFileName);
    const pngPath = path.join(assetsDir, pngFileName);

    fs.writeFileSync(svgPath, svgContent, "utf8");

    try {
      execSync(`sips -s format png "${svgPath}" --out "${pngPath}"`);
    } catch (err) {
      console.error(`Error converting ${svgFileName} to PNG:`, err.message);
    }
  }
}

console.log("SUCCESS! All 50 PNG images generated and saved in src/assets!");
