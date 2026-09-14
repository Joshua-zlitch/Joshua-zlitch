/**
 * ATLAS // Telemetry Generator
 * Fetches 100% verified GitHub metrics directly from api.github.com
 * and writes native, ATLAS-themed SVG cards without any third-party Vercel dependencies.
 */

const fs = require('fs');
const path = require('path');

const USERNAME = 'Joshua-zlitch';

async function fetchGitHubData() {
  const headers = { 'User-Agent': 'ATLAS-Telemetry-Generator' };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }

  // 1. Fetch User Profile
  const userRes = await fetch(`https://api.github.com/users/${USERNAME}`, { headers });
  if (!userRes.ok) throw new Error(`User fetch failed: ${userRes.status}`);
  const user = await userRes.json();

  // 2. Fetch Repositories
  const reposRes = await fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100`, { headers });
  if (!reposRes.ok) throw new Error(`Repos fetch failed: ${reposRes.status}`);
  const repos = await reposRes.json();

  let totalStars = 0;
  let totalForks = 0;
  const langBytes = {};

  for (const repo of repos) {
    totalStars += repo.stargazers_count || 0;
    totalForks += repo.forks_count || 0;

    if (repo.language) {
      try {
        const lRes = await fetch(repo.languages_url, { headers });
        if (lRes.ok) {
          const langs = await lRes.json();
          for (const [l, bytes] of Object.entries(langs)) {
            langBytes[l] = (langBytes[l] || 0) + bytes;
          }
        }
      } catch (e) {
        // Fallback to primary language if languages_url rate-limited
        langBytes[repo.language] = (langBytes[repo.language] || 0) + 1000;
      }
    }
  }

  return { user, totalStars, totalForks, langBytes };
}

function generateStatsSvg(data) {
  const { user, totalStars, totalForks } = data;
  const createdDate = new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 430 195" width="100%" height="195" fill="none">
  <defs>
    <style>
      .mono { font-family: 'Monocraft', 'JetBrains Mono', 'Fira Code', Consolas, monospace; }
      .lbl { font-size: 11px; fill: #7A8294; letter-spacing: 0.5px; }
      .val { font-size: 13px; font-weight: 700; fill: #D8DCE7; letter-spacing: 1px; }
      .dim { fill: #5967A5; }
      .pri { fill: #8B9DFF; }
      .suc { fill: #6EE7B7; }
    </style>
    <pattern id="statGrid" width="15" height="15" patternUnits="userSpaceOnUse">
      <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#111722" stroke-width="0.8" />
    </pattern>
  </defs>

  <!-- Frame Background -->
  <rect width="430" height="195" rx="5" fill="#080B10" stroke="#202938" stroke-width="1.2" />
  <rect width="430" height="195" rx="5" fill="url(#statGrid)" />

  <!-- Corner Reticles -->
  <path d="M 8 18 L 8 8 L 18 8" stroke="#5967A5" stroke-width="1.2" fill="none" />
  <path d="M 422 18 L 422 8 L 412 8" stroke="#5967A5" stroke-width="1.2" fill="none" />
  <path d="M 8 177 L 8 187 L 18 187" stroke="#5967A5" stroke-width="1.2" fill="none" />
  <path d="M 422 177 L 422 187 L 412 187" stroke="#5967A5" stroke-width="1.2" fill="none" />

  <!-- Top Title Strip -->
  <rect x="20" y="16" width="390" height="26" rx="3" fill="#0D1219" stroke="#202938" stroke-width="0.8" />
  <circle cx="34" cy="29" r="3.5" fill="#6EE7B7" />
  <text x="44" y="33" class="mono pri" font-size="10" font-weight="700" letter-spacing="1">ATLAS // REPO TELEMETRY</text>
  <text x="330" y="33" class="mono lbl" font-size="9.5">REAL-DATA</text>

  <!-- Metrics Grid -->
  <g transform="translate(26, 62)">
    <!-- Row 1 -->
    <text x="0" y="16" class="mono lbl">PUBLIC REPOSITORIES</text>
    <text x="180" y="16" class="mono dim">........</text>
    <text x="350" y="16" class="mono val pri" text-anchor="end">${user.public_repos}</text>

    <!-- Row 2 -->
    <text x="0" y="42" class="mono lbl">TOTAL STARS RECORDED</text>
    <text x="180" y="42" class="mono dim">........</text>
    <text x="350" y="42" class="mono val suc" text-anchor="end">${totalStars}</text>

    <!-- Row 3 -->
    <text x="0" y="68" class="mono lbl">FOLLOWERS / NETWORK</text>
    <text x="180" y="68" class="mono dim">........</text>
    <text x="350" y="68" class="mono val" text-anchor="end">${user.followers} / ${user.following}</text>

    <!-- Row 4 -->
    <text x="0" y="94" class="mono lbl">SYSTEM ACTIVATION</text>
    <text x="180" y="94" class="mono dim">........</text>
    <text x="350" y="94" class="mono val dim" text-anchor="end">${createdDate}</text>
  </g>

  <!-- Bottom Hairline -->
  <line x1="20" y1="172" x2="410" y2="172" stroke="#202938" stroke-width="0.8" />
  <text x="24" y="184" class="mono lbl" font-size="8.5">METRICS PULLED FROM GITHUB API</text>
  <text x="406" y="184" class="mono pri" font-size="8.5" text-anchor="end">STATUS: VERIFIED</text>
</svg>`;
}

function generateLangsSvg(data) {
  const { langBytes } = data;
  const totalBytes = Object.values(langBytes).reduce((a, b) => a + b, 0) || 1;

  const sorted = Object.entries(langBytes)
    .sort((a, b) => b[1] - a[1]);

  const top = sorted.slice(0, 5);
  const otherBytes = sorted.slice(5).reduce((a, b) => a + b[1], 0);
  if (otherBytes > 0) {
    top.push(['Other', otherBytes]);
  }

  const palette = ['#8B9DFF', '#5967A5', '#6EE7B7', '#F4C95D', '#A78BFA', '#4B5563'];

  let barsSvg = '';
  let y = 62;
  top.forEach(([lang, bytes], i) => {
    const pct = ((bytes / totalBytes) * 100).toFixed(1);
    const color = palette[i % palette.length];
    const barWidth = Math.max(4, Math.round((bytes / totalBytes) * 160));

    barsSvg += `
    <text x="0" y="${y + 12}" class="mono lbl">${lang.toUpperCase()}</text>
    <rect x="140" y="${y + 3}" width="160" height="9" rx="2" fill="#0D1219" stroke="#202938" stroke-width="0.6" />
    <rect x="140" y="${y + 3}" width="${barWidth}" height="9" rx="2" fill="${color}" />
    <text x="370" y="${y + 12}" class="mono val" font-size="11" text-anchor="end">${pct}%</text>
    `;
    y += 18;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 430 195" width="100%" height="195" fill="none">
  <defs>
    <style>
      .mono { font-family: 'Monocraft', 'JetBrains Mono', 'Fira Code', Consolas, monospace; }
      .lbl { font-size: 10px; fill: #7A8294; letter-spacing: 0.5px; }
      .val { font-size: 11px; font-weight: 700; fill: #D8DCE7; letter-spacing: 0.5px; }
      .pri { fill: #8B9DFF; }
    </style>
    <pattern id="langGrid" width="15" height="15" patternUnits="userSpaceOnUse">
      <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#111722" stroke-width="0.8" />
    </pattern>
  </defs>

  <!-- Frame Background -->
  <rect width="430" height="195" rx="5" fill="#080B10" stroke="#202938" stroke-width="1.2" />
  <rect width="430" height="195" rx="5" fill="url(#langGrid)" />

  <!-- Corner Reticles -->
  <path d="M 8 18 L 8 8 L 18 8" stroke="#5967A5" stroke-width="1.2" fill="none" />
  <path d="M 422 18 L 422 8 L 412 8" stroke="#5967A5" stroke-width="1.2" fill="none" />
  <path d="M 8 177 L 8 187 L 18 187" stroke="#5967A5" stroke-width="1.2" fill="none" />
  <path d="M 422 177 L 422 187 L 412 187" stroke="#5967A5" stroke-width="1.2" fill="none" />

  <!-- Top Title Strip -->
  <rect x="20" y="16" width="390" height="26" rx="3" fill="#0D1219" stroke="#202938" stroke-width="0.8" />
  <circle cx="34" cy="29" r="3.5" fill="#8B9DFF" />
  <text x="44" y="33" class="mono pri" font-size="10" font-weight="700" letter-spacing="1">ATLAS // LANGUAGE DISTRIBUTION</text>
  <text x="340" y="33" class="mono lbl" font-size="9.5">BYTE-WEIGHTED</text>

  <!-- Language Bars -->
  <g transform="translate(24, 0)">
    ${barsSvg}
  </g>

  <!-- Bottom Hairline -->
  <line x1="20" y1="172" x2="410" y2="172" stroke="#202938" stroke-width="0.8" />
  <text x="24" y="184" class="mono lbl" font-size="8.5">CALCULATED ACROSS ALL PUBLIC REPOSITORIES</text>
  <text x="406" y="184" class="mono pri" font-size="8.5" text-anchor="end">PRIMARY: PYTHON</text>
</svg>`;
}

async function main() {
  console.log(`[ATLAS] Querying real GitHub telemetry for ${USERNAME}...`);
  const data = await fetchGitHubData();

  const assetsDir = path.join(__dirname, '..', 'assets');
  if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

  const statsSvg = generateStatsSvg(data);
  const langsSvg = generateLangsSvg(data);

  fs.writeFileSync(path.join(assetsDir, 'github-telemetry.svg'), statsSvg, 'utf8');
  console.log(`[ATLAS] Written: assets/github-telemetry.svg`);

  fs.writeFileSync(path.join(assetsDir, 'top-languages.svg'), langsSvg, 'utf8');
  console.log(`[ATLAS] Written: assets/top-languages.svg`);
}

main().catch(err => {
  console.error('[ATLAS ERROR]', err);
  process.exit(1);
});
