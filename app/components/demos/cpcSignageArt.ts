/* SVG drawings for the large-format signage demo (CpcSignage.tsx):
   01 Planning (graph paper, zones, dimensions) and 02 Design files (blueprint sheet).
   Built as strings and rendered with dangerouslySetInnerHTML. Scale: tower 40 px = 1 ft. */

export const SG = "/work/graphic-design/signage";

const T = { fx: 440, fy: 230, fw: 120, fh: 240, sidePoly: "380,248 440,230 440,470 380,462" };
const DEFS = `<defs><clipPath id="sideClip"><polygon points="${T.sidePoly}"/></clipPath><clipPath id="frontClip"><rect x="${T.fx}" y="${T.fy}" width="${T.fw}" height="${T.fh}"/></clipPath>
  <clipPath id="banClip"><rect x="80" y="250" width="840" height="112"/></clipPath>
  <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="8" stroke="#c9c6bd" stroke-width="1.2"/></pattern></defs>`;
function pin(n: number, x: number, y: number) { return `<g class="pin" data-k="${n}"><circle cx="${x}" cy="${y}" r="15" fill="#2f5bea"/><text x="${x}" y="${y + 5}" text-anchor="middle" font-family="Inter Tight, sans-serif" font-weight="600" font-size="14" fill="#fff">${n}</text></g>`; }
function figureOutline(x: number, g: number, h: number, label: string) {
  const r = h * 0.068;
  return `<g fill="none" stroke="#8e8b83" stroke-width="1.4" stroke-dasharray="4 3"><circle cx="${x}" cy="${g - h + r}" r="${r}"/><rect x="${x - h * 0.115}" y="${g - h + 2 * r + 3}" width="${h * 0.23}" height="${h * 0.42}" rx="${h * 0.06}"/><line x1="${x - h * 0.06}" y1="${g - h * 0.45}" x2="${x - h * 0.06}" y2="${g}"/><line x1="${x + h * 0.06}" y1="${g - h * 0.45}" x2="${x + h * 0.06}" y2="${g}"/></g>
    <text x="${x}" y="${g + 22}" text-anchor="middle" font-family="Inter Tight, sans-serif" font-size="12" fill="#6b6b6b">${label}</text>`;
}
function grid(bg: string, minor: string, major: string) {
  let s = `<rect width="1000" height="562" fill="${bg}"/>`;
  for (let x = 0; x <= 1000; x += 20) s += `<line x1="${x}" y1="0" x2="${x}" y2="562" stroke="${x % 100 ? minor : major}"/>`;
  for (let y = 0; y <= 562; y += 20) s += `<line x1="0" y1="${y}" x2="1000" y2="${y}" stroke="${y % 100 ? minor : major}"/>`;
  return s;
}
const F = 'font-family="Inter Tight, sans-serif"';
function dimH(x0: number, x1: number, y: number, label: string, col: string, bg: string) {
  const m = (x0 + x1) / 2, w = label.length * 7.4 + 14;
  return `<g stroke="${col}" stroke-width="1.2"><line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}"/><line x1="${x0}" y1="${y - 7}" x2="${x0}" y2="${y + 7}"/><line x1="${x1}" y1="${y - 7}" x2="${x1}" y2="${y + 7}"/></g>
    <rect x="${m - w / 2}" y="${y - 11}" width="${w}" height="22" fill="${bg}"/><text x="${m}" y="${y + 5}" text-anchor="middle" ${F} font-size="13" font-weight="600" fill="${col}">${label}</text>`;
}
function dimVv(x: number, y0: number, y1: number, label: string, col: string, bg: string) {
  const m = (y0 + y1) / 2, w = label.length * 7.4 + 14;
  return `<g stroke="${col}" stroke-width="1.2"><line x1="${x}" y1="${y0}" x2="${x}" y2="${y1}"/><line x1="${x - 7}" y1="${y0}" x2="${x + 7}" y2="${y0}"/><line x1="${x - 7}" y1="${y1}" x2="${x + 7}" y2="${y1}"/></g>
    <rect x="${x - w / 2}" y="${m - 11}" width="${w}" height="22" fill="${bg}"/><text x="${x}" y="${m + 5}" text-anchor="middle" ${F} font-size="13" font-weight="600" fill="${col}">${label}</text>`;
}
function crops(x: number, y: number, w: number, h: number, col: string) {
  const L = 12, o = 6;
  return `<g stroke="${col}" stroke-width="1">` + [[x, y, -1, -1], [x + w, y, 1, -1], [x, y + h, -1, 1], [x + w, y + h, 1, 1]].map(([cx, cy, sx, sy]) =>
    `<line x1="${cx + sx * o}" y1="${cy}" x2="${cx + sx * (o + L)}" y2="${cy}"/><line x1="${cx}" y1="${cy + sy * o}" x2="${cx}" y2="${cy + sy * (o + L)}"/>`).join("") + `</g>`;
}
const PAPERBG = "#f2f1ec", BLUE = "#17375e", BL = "#e6eefa", BLM = "#a9c0de";
const title = (t: string, sub: string, col: string, subcol: string) => `<text x="40" y="44" ${F} font-size="13" font-weight="600" letter-spacing="1" fill="${col}">${t}</text><text x="40" y="64" ${F} font-size="12" fill="${subcol}">${sub}</text>`;

/* ---------- 01 Planning: tower (40 px = 1 ft) ---------- */
export function towerWire() {
  const { fx, fy, fw, fh } = T;
  let s = `<svg viewBox="0 0 1000 562" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Planning drawing of the photo tower: a 3 by 6 foot panel with numbered content zones">${DEFS}`;
  s += grid(PAPERBG, "#e7e5de", "#dcd9d0");
  s += `<rect x="60" y="470" width="880" height="14" fill="url(#hatch)"/><line x1="60" y1="470" x2="940" y2="470" stroke="#1b1b1b" stroke-width="1.5"/>`;
  s += `<g class="z z5"><polygon points="${T.sidePoly}" fill="#e9e7e0" stroke="#1b1b1b" stroke-width="1.5"/>`;
  s += `<g clip-path="url(#sideClip)"><g transform="matrix(0.5,-0.15,0,0.93,380,248)">`;
  for (let i = 0; i < 4; i++) s += `<rect x="18" y="${100 + i * 28}" width="${[84, 64, 58, 80][i]}" height="16" rx="3" fill="#2b2b2b"/>`;
  for (let i = 0; i < 8; i++) if (i < 3 || i > 6) s += `<rect x="6" y="${i * 28 + 8}" width="108" height="8" rx="3" fill="#c9c6bd"/>`;
  s += `</g></g></g>`;
  s += `<rect x="${fx}" y="${fy}" width="${fw}" height="${fh}" fill="#fff" stroke="#1b1b1b" stroke-width="1.5"/>`;
  s += `<g class="z z1"><rect x="${fx + 14}" y="${fy + 14}" width="92" height="14" rx="3" fill="#2b2b2b"/><rect x="${fx + 14}" y="${fy + 32}" width="92" height="10" rx="3" fill="#8e8b83"/><rect x="${fx + 14}" y="${fy + 46}" width="92" height="13" rx="3" fill="#2b2b2b"/></g>`;
  s += `<g class="z z2"><rect x="${fx + 26}" y="${fy + 66}" width="68" height="6" rx="3" fill="#8e8b83"/></g>`;
  s += `<g class="z z3" clip-path="url(#frontClip)"><circle cx="${fx + 62}" cy="${fy + 160}" r="66" fill="#dedcd5" stroke="#9a978f"/><line x1="${fx}" y1="${fy + 94}" x2="${fx + fw}" y2="${fy + 226}" stroke="#b8b5ac"/><line x1="${fx + fw}" y1="${fy + 94}" x2="${fx}" y2="${fy + 226}" stroke="#b8b5ac"/></g>`;
  s += `<g class="z z4" clip-path="url(#frontClip)"><circle cx="${fx + 10}" cy="${fy + 104}" r="18" fill="none" stroke="#1b1b1b" stroke-width="3"/><circle cx="${fx + 112}" cy="${fy + 228}" r="22" fill="#1b1b1b" opacity=".75"/></g>`;
  s += dimVv(610, fy, 470, "6 ft", "#1b1b1b", PAPERBG);
  s += dimH(fx, fx + fw, 505, "3 ft", "#1b1b1b", PAPERBG);
  s += figureOutline(220, 470, 230, "5′9″ person, for scale");
  s += pin(1, fx + 136, fy + 22) + pin(2, fx + 136, fy + 69) + pin(3, fx + 62, fy + 160) + pin(4, fx + 8, fy + 104) + pin(5, 404, 380);
  s += title("PHOTO TOWER · FRONT + SIDE", "Each face a 3 × 6 ft panel · content zones, no artwork", "#1b1b1b", "#6b6b6b");
  return s + `</svg>`;
}

/* ---------- 01 Planning: banner, three 5 × 3 ft panels (56 px = 1 ft) ---------- */
export function bannerWire() {
  const x0 = 80, W = 840, y0 = 200, Hh = 168, P = W / 3;
  let s = `<svg viewBox="0 0 1000 562" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Planning drawing of the sponsor banner: three 5 by 3 foot panels with numbered content zones">
    <defs><clipPath id="bw"><rect x="${x0}" y="${y0}" width="${W}" height="${Hh}"/></clipPath></defs>`;
  s += grid(PAPERBG, "#e7e5de", "#dcd9d0");
  s += `<rect x="${x0}" y="${y0}" width="${W}" height="${Hh}" fill="#e9e7e0" stroke="#1b1b1b" stroke-width="1.5"/>`;
  s += `<g clip-path="url(#bw)">`;
  s += `<g class="z z3"><circle cx="${x0 + 92}" cy="${y0 + Hh / 2}" r="${Hh * 0.62}" fill="#dedcd5" stroke="#9a978f"/><line x1="${x0}" y1="${y0}" x2="${x0 + 190}" y2="${y0 + Hh}" stroke="#b8b5ac"/><line x1="${x0 + 190}" y1="${y0}" x2="${x0}" y2="${y0 + Hh}" stroke="#b8b5ac"/>
    <circle cx="${x0 + W - 92}" cy="${y0 + Hh / 2}" r="${Hh * 0.62}" fill="#dedcd5" stroke="#9a978f"/><line x1="${x0 + W - 190}" y1="${y0}" x2="${x0 + W}" y2="${y0 + Hh}" stroke="#b8b5ac"/><line x1="${x0 + W}" y1="${y0}" x2="${x0 + W - 190}" y2="${y0 + Hh}" stroke="#b8b5ac"/></g>`;
  const cx = x0 + W / 2, cy = y0 + Hh / 2;
  s += `<g class="z z1"><circle cx="${cx}" cy="${cy}" r="${Hh * 0.62}" fill="#fff" stroke="#1b1b1b"/><rect x="${cx - 80}" y="${cy - 46}" width="160" height="18" rx="3" fill="#2b2b2b"/><rect x="${cx - 80}" y="${cy - 22}" width="160" height="14" rx="3" fill="#8e8b83"/><rect x="${cx - 80}" y="${cy - 2}" width="160" height="18" rx="3" fill="#2b2b2b"/><rect x="${cx - 54}" y="${cy + 28}" width="108" height="8" rx="3" fill="#8e8b83"/></g>`;
  s += `<g class="z z2">`;
  for (let i = 0; i < 7; i++) s += `<rect x="${x0 + 200}" y="${y0 + 24 + i * 18}" width="${[60, 46, 66, 42, 34, 58, 54][i]}" height="9" rx="3" fill="#2b2b2b"/>`;
  for (let i = 0; i < 7; i++) { const w = [42, 40, 52, 66, 60, 28, 54][i]; s += `<rect x="${x0 + W - 200 - w}" y="${y0 + 24 + i * 18}" width="${w}" height="9" rx="3" fill="#2b2b2b"/>`; }
  s += `</g>`;
  s += `<g class="z z4"><circle cx="${x0 + 188}" cy="${y0 + 10}" r="22" fill="none" stroke="#1b1b1b" stroke-width="3"/><circle cx="${cx + 118}" cy="${y0 + 8}" r="18" fill="#1b1b1b" opacity=".75"/><circle cx="${cx + 70}" cy="${y0 + Hh - 2}" r="24" fill="none" stroke="#1b1b1b" stroke-width="3"/></g>`;
  s += `</g>`;
  s += `<g stroke="#2f5bea" stroke-width="1.5" stroke-dasharray="6 5"><line x1="${x0 + P}" y1="${y0 - 14}" x2="${x0 + P}" y2="${y0 + Hh + 14}"/><line x1="${x0 + 2 * P}" y1="${y0 - 14}" x2="${x0 + 2 * P}" y2="${y0 + Hh + 14}"/></g>`;
  s += dimH(x0, x0 + W, y0 - 38, "15 ft overall", "#1b1b1b", PAPERBG);
  [0, 1, 2].forEach((i) => { s += dimH(x0 + i * P + 4, x0 + (i + 1) * P - 4, y0 + Hh + 34, "5 ft", "#1b1b1b", PAPERBG); s += `<text x="${x0 + i * P + P / 2}" y="${y0 + Hh + 70}" text-anchor="middle" ${F} font-size="12" fill="#6b6b6b">Panel ${i + 1}</text>`; });
  s += dimVv(x0 + W + 34, y0, y0 + Hh, "3 ft", "#1b1b1b", PAPERBG);
  s += `<text x="${x0 + P + 8}" y="${y0 + Hh + 104}" ${F} font-size="12" fill="#2f5bea">- - -  panel seam</text>`;
  s += pin(1, cx, y0 - 2) + pin(2, x0 + 230, y0 + Hh + 2) + pin(3, x0 + 40, y0 + Hh + 2) + pin(4, x0 + 188, y0 + 44);
  s += title("BANDSHELL SPONSOR BANNER", "Three 5 × 3 ft panels · content zones, no artwork", "#1b1b1b", "#6b6b6b");
  return s + `</svg>`;
}

/* ---------- 02 Design files: blueprint sheets with the print artwork ---------- */
export function towerFiles() {
  let s = `<svg viewBox="0 0 1000 562" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The four print files for the photo tower panels, each 3 by 6 feet, laid out on a blueprint sheet">`;
  s += grid(BLUE, "#20456f", "#2c5585");
  const w = 140, h = 280, gap = 62, x0 = (1000 - (4 * w + 3 * gap)) / 2, y0 = 140;
  for (let i = 0; i < 4; i++) {
    const x = x0 + i * (w + gap);
    s += `<rect x="${x + 6}" y="${y0 + 8}" width="${w}" height="${h}" fill="#0c2340" opacity=".45"/>`;
    s += `<image href="${`${SG}/tower-${i + 1}.jpg`}" x="${x}" y="${y0}" width="${w}" height="${h}" preserveAspectRatio="none"/>`;
    s += crops(x, y0, w, h, BLM);
    s += `<text x="${x}" y="${y0 + h + 34}" ${F} font-size="12" font-weight="600" letter-spacing="1" fill="${BL}">PANEL ${"ABCD"[i]}</text><text x="${x}" y="${y0 + h + 52}" ${F} font-size="12" fill="${BLM}">36 × 72 in · full size</text>`;
  }
  s += dimH(x0, x0 + w, y0 - 30, "3 ft", BL, BLUE);
  s += dimVv(x0 - 34, y0, y0 + h, "6 ft", BL, BLUE);
  s += title("PHOTO TOWER PANELS · PRINT FILES", "4 panels · one participant each · built from the planning zones", BL, BLM);
  return s + `</svg>`;
}
export function bannerFiles(round: number) {
  const x0 = 80, W = 840, P = W / 3, Hh = 112, y0 = 230;
  let s = `<svg viewBox="0 0 1000 562" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The sponsor banner print file across three panels on a blueprint sheet">`;
  s += grid(BLUE, "#20456f", "#2c5585");
  s += `<rect x="${x0 + 6}" y="${y0 + 8}" width="${W}" height="${Hh}" fill="#0c2340" opacity=".45"/>`;
  s += `<image href="${`${SG}/banner-${round ? "final" : "round1"}.jpg`}" x="${x0}" y="${y0}" width="${W}" height="${Hh}" preserveAspectRatio="none"/>`;
  s += crops(x0, y0, W, Hh, BLM);
  s += `<g stroke="#ffffff" stroke-width="1.4" stroke-dasharray="6 5" opacity=".85"><line x1="${x0 + P}" y1="${y0 - 16}" x2="${x0 + P}" y2="${y0 + Hh + 16}"/><line x1="${x0 + 2 * P}" y1="${y0 - 16}" x2="${x0 + 2 * P}" y2="${y0 + Hh + 16}"/></g>`;
  s += dimH(x0, x0 + W, y0 - 42, "15 ft overall", BL, BLUE);
  [0, 1, 2].forEach((i) => { s += dimH(x0 + i * P + 4, x0 + (i + 1) * P - 4, y0 + Hh + 38, "5 ft", BL, BLUE); s += `<text x="${x0 + i * P + P / 2}" y="${y0 + Hh + 74}" text-anchor="middle" ${F} font-size="12" fill="${BLM}">Panel ${i + 1}</text>`; });
  s += dimVv(x0 + W + 34, y0, y0 + Hh, "3 ft", BL, BLUE);
  s += `<text x="${x0}" y="${y0 + Hh + 112}" ${F} font-size="12" font-weight="600" letter-spacing="1" fill="${BL}">${round ? "FINAL" : "ROUND 1"}</text><text x="${x0 + (round ? 52 : 70)}" y="${y0 + Hh + 112}" ${F} font-size="12" fill="${BLM}">${round ? "Participant photos added at both ends" : "Sponsor names and lockup only"}</text>`;
  s += title("BANDSHELL SPONSOR BANNER · PRINT FILE", "One artwork across three 5 × 3 ft panels", BL, BLM);
  return s + `</svg>`;
}


