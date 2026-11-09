/* Reviewwo launch film. Every frame is seek(t): pure function of time, no transitions/timers. */
(() => {
'use strict';
const Q = new URLSearchParams(location.search);
const W = +Q.get('w') || 1080, H = +Q.get('h') || 1920;
const LAND = W > H;
const BEAT = 0.39270, T0 = 0.028;
const B = (n) => T0 + n * BEAT;
const END = B(76) + 2.4;

// ---------- math ----------
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, k) => a + (b - a) * k;
function stepR(tau, { w, z }) {
  if (tau <= 0) return 0;
  if (z >= 1) { const x = w * tau; return 1 - Math.exp(-x) * (1 + x); }
  const wd = w * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w * tau) * (Math.cos(wd * tau) + (z * w / wd) * Math.sin(wd * tau));
}
class Track {
  constructor(v0) { this.v0 = v0; this.cur = v0; this.ev = []; }
  to(t, v, sp = UI) { if (v !== this.cur) { this.ev.push([t, v - this.cur, sp]); this.cur = v; } return this; }
  at(t) { let v = this.v0; for (const [ti, d, sp] of this.ev) v += d * stepR(t - ti, sp); return v; }
}
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
class CTrack { // colour as three tracks
  constructor(h) { const c = hex(h); this.c = c.map((v) => new Track(v)); }
  to(t, h, sp = UI) { hex(h).forEach((v, i) => this.c[i].to(t, v, sp)); return this; }
  at(t) { const [r, g, b] = this.c.map((x) => clamp(Math.round(x.at(t)), 0, 255)); return `rgb(${r},${g},${b})`; }
  rgb(t) { return this.c.map((x) => clamp(x.at(t), 0, 255)); }
}
const SNAP = { w: 30, z: 0.8 }, UI = { w: 22, z: 0.84 }, SOFT = { w: 13, z: 0.9 }, CAM = { w: 9.5, z: 1 }, TXT = { w: 26, z: 1 };
const LEAD = 0.16; // issue arrivals this early so they land on the beat

function vis(t, tin, tout, dOut = 0.12) {
  const e = stepR(t - tin, TXT);
  const x = tout == null ? 0 : clamp((t - tout) / dOut), xo = x * x;
  return { o: e * (1 - xo), b: (1 - e) * 10 + xo * 10, dy: (1 - e) * 16 - xo * 10, e, on: t >= tin && (tout == null || t < tout + dOut) };
}
function applyVis(el, v, extra = '') {
  el.style.opacity = v.o.toFixed(3);
  el.style.filter = v.b > 0.05 ? `blur(${v.b.toFixed(2)}px)` : 'none';
  el.style.transform = `translate(-50%,-50%) translateY(${v.dy.toFixed(2)}px) ${extra}`;
  el.style.visibility = v.o < 0.002 ? 'hidden' : 'visible';
}
const bump = (t, tc, a = 0.16, d = 0.06) => (t < tc - 0.2 ? 0 : a * Math.exp(-(((t - tc) / d) ** 2)));
const pop = (t, tc) => { // scale spring born at tc with tiny overshoot
  if (t < tc) return 0;
  return stepR(t - tc, { w: 24, z: 0.62 });
};

// ---------- DOM helpers ----------
const $ = (tag, cls, parent, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; if (parent) parent.appendChild(e); return e; };
const css = (e, o) => { for (const k in o) e.style[k] = typeof o[k] === 'number' && !/opacity|zIndex|fontWeight|lineHeight/.test(k) ? o[k] + 'px' : o[k]; return e; };
const STAR = 'M12 1.8l3.05 6.6 7.2.75-5.4 4.85 1.55 7.1L12 17.45 5.6 21.1l1.55-7.1L1.75 9.15l7.2-.75z';
const starSvg = (fill, stroke) => `<svg viewBox="0 0 24 24"><path d="${STAR}" fill="${fill}" stroke="${stroke}" stroke-width="1.4" stroke-linejoin="round"/></svg>`;

const stage = document.getElementById('stage');
css(stage, { width: W, height: H });
const bg = document.getElementById('bg');
const world = document.getElementById('world');
const hud = document.getElementById('hud');

// ---------- layout modes ----------
// split: action area + caption area. centered: whole frame.
const SPLIT = LAND
  ? { cx: W * 0.685, cy: H * 0.5, aw: W * 0.55, ah: H * 0.86 }
  : { cx: W * 0.5, cy: H * 0.6, aw: W * 0.9, ah: H * 0.66 };
const CENTER = { cx: W * 0.5, cy: H * 0.5, aw: W * 0.9, ah: H * 0.82 };
const U = Math.min(W, H) / 1080; // hud unit

// ---------- camera ----------
const camX = new Track(0), camY = new Track(-40), camZ = new Track(0), mode = new Track(1); // mode 1 = centered
const DRIFT = 0.016; // slow continuous push-in (log-zoom per second), never resets
function frame(t, cx, cy, bw, bh, centered = false, sp = CAM) {
  const M = centered ? CENTER : SPLIT;
  const z = Math.min(M.aw / bw, M.ah / bh);
  camX.to(t, cx, sp); camY.to(t, cy, sp); camZ.to(t, Math.log(z) - DRIFT * t, sp); mode.to(t, centered ? 1 : 0, sp);
}
function cam(t) {
  const m = mode.at(t);
  const sx = lerp(SPLIT.cx, CENTER.cx, m), sy = lerp(SPLIT.cy, CENTER.cy, m);
  return { z: Math.exp(camZ.at(t) + DRIFT * t), x: camX.at(t), y: camY.at(t), sx, sy };
}
const project = (c, x, y) => [c.sx + (x - c.x) * c.z, c.sy + (y - c.y) * c.z];

// ---------- cues (sound) ----------
const CUES = [];
const cue = (t, s, g = 1) => CUES.push({ t: +t.toFixed(4), s, g });

// =====================================================================
// THE SHAPE
// =====================================================================
const shape = $('div', '', world); shape.id = 'shape';
const S = { w: new Track(0), h: new Track(14), r: new Track(7), x: new Track(0), y: new Track(124), col: new CTrack('#14B8A6'), sh: new Track(0) };
function morph(t, w, h, r, col, sp = UI) { S.w.to(t, w, sp); S.h.to(t, h, sp); S.r.to(t, r, sp); if (col) S.col.to(t, col, sp); }

const layers = [];
function layer(w, h, tin, tout, dOut) { const el = $('div', 'layer', shape); css(el, { width: w, height: h }); const L = { el, tin, tout, dOut, w, h }; layers.push(L); return L; }
const rel = (el, L) => { // element centre relative to layer centre (layout coords, transform-free)
  let x = el.offsetWidth / 2, y = el.offsetHeight / 2, n = el;
  while (n && n !== L.el) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
  return [x - L.w / 2, y - L.h / 2];
};

// ---------- 0. HOOK (world text above the pill) ----------
const hook = $('div', 'abs', world);
const HOOK = [['Happy customers', 0], ['rarely leave', 2], ['a review.', 4]];
const hookLines = HOOK.map(([txt, b], i) => {
  const el = $('div', 'center disp', hook, txt);
  css(el, { fontSize: 112, whiteSpace: 'nowrap', top: -190 + i * 118, color: i === 2 ? 'var(--teal)' : 'var(--ink)' });
  return { el, b };
});
const HOOK_OUT = B(7.6);
cue(B(0), 'hit', 0.55); cue(B(2), 'hit', 0.55); cue(B(4), 'hit', 0.7);
// pill is born under "a review."
S.w.to(B(5.5), 230, SNAP);
cue(B(5.6), 'pop', 0.8);
S.w.to(B(6.5), 300, SNAP); // stretch on the beat
cue(B(6.5), 'tick', 0.6);
frame(0, 0, -50, 1080, 600, true);

// ---------- 1. QR STANDEE (B8–B15) ----------
const tQR = B(8) - LEAD;
morph(tQR, 400, 480, 40, '#FFFFFF', SNAP); S.y.to(tQR, 0, SNAP); S.sh.to(tQR, 1, SNAP);
frame(B(8) - 0.25, 0, 0, 560, 640);
cue(B(8), 'whoosh', 0.7);
const Lqr = layer(400, 480, B(8.2), B(15) - 0.22, 0.1);
const qrHead = $('div', 'abs', Lqr.el, '<div class="disp" style="font-size:30px;color:var(--teal)">Loved your visit?</div><div style="font-size:18px;color:var(--muted);margin-top:4px;font-weight:600">Scan to leave a review</div>');
css(qrHead, { left: 0, right: 0, top: 30, textAlign: 'center' });
const qrBox = $('div', 'abs', Lqr.el); css(qrBox, { left: 60, top: 120, width: 280, height: 280 });
// deterministic QR-like pattern (21x21) with finder squares
const N = 21, cell = 280 / N, mods = [];
let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const finder = (i, j) => { for (const [a, b] of [[0, 0], [0, 14], [14, 0]]) { const di = i - a, dj = j - b; if (di >= 0 && di < 7 && dj >= 0 && dj < 7) { const ring = Math.max(Math.abs(di - 3), Math.abs(dj - 3)); return ring === 3 || ring <= 1 ? 1 : 0; } if (di >= -1 && di <= 7 && dj >= -1 && dj <= 7) return 0; } return -1; };
for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
  const f = finder(i, j); const on = f === -1 ? rnd() < 0.5 : f === 1;
  if (!on) continue;
  const m = $('div', 'abs', qrBox); css(m, { left: j * cell, top: i * cell, width: cell + 0.6, height: cell + 0.6, background: 'var(--ink)', borderRadius: 2 });
  mods.push({ el: m, k: (i + j) / (2 * N - 2) });
}
const qrLogo = $('div', 'abs', qrBox); css(qrLogo, { left: 112, top: 112, width: 56, height: 56, borderRadius: 14, background: 'var(--teal)', border: '5px solid #fff' });
$('img', '', qrLogo).src = 'assets/icon-white.png'; css(qrLogo.firstChild, { width: 30, margin: '8px 0 0 8px' });
const QR_DRAW0 = B(8.5), QR_DRAW1 = B(10.5);
for (let k = 0; k < 5; k++) cue(B(8.5 + k * 0.5), 'tick', 0.45);
// scan brackets (screen-ish but in world around QR)
const brk = $('div', 'abs', world); const corners = [];
for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
  const c = $('div', 'abs', brk); css(c, { width: 54, height: 54, borderColor: 'var(--teal5)', borderStyle: 'solid', borderWidth: 0 });
  c.style[sy < 0 ? 'borderTopWidth' : 'borderBottomWidth'] = '8px'; c.style[sx < 0 ? 'borderLeftWidth' : 'borderRightWidth'] = '8px';
  c.style[`border${sy < 0 ? 'Top' : 'Bottom'}${sx < 0 ? 'Left' : 'Right'}Radius`] = '18px';
  corners.push({ el: c, sx, sy });
}
const scanLine = $('div', 'abs', world); css(scanLine, { height: 6, borderRadius: 3, background: 'var(--teal5)' });
const BRK_IN = B(11.5) - LEAD, SCAN0 = B(12), SCAN1 = B(13.6), SNAPSHOT = B(14);
frame(B(11.5) - 0.2, 0, 20, 520, 640);
cue(B(11.5), 'click', 0.8); cue(B(12), 'whoosh2', 0.35); cue(SNAPSHOT, 'blip', 0.9); cue(SNAPSHOT, 'shutter', 0.5);

// ---------- 2. REVIEW PAGE (B15–B32) ----------
const tPage = B(15) - LEAD;
morph(tPage, 540, 960, 46, '#FFFFFF', UI);
cue(B(15), 'whoosh', 0.8);
frame(B(15) - 0.3, 0, -250, 580, 600);
const Lp = layer(540, 960, B(15.15), B(32) - 0.02, 0.1);
const brandCol = new CTrack('#0B3D3B');
const pTop = $('div', 'abs', Lp.el); css(pTop, { left: 0, right: 0, top: 0, height: 12 });
const pLogo = $('div', 'abs disp', Lp.el, 'A'); css(pLogo, { left: 228, top: 46, width: 84, height: 84, borderRadius: 24, color: '#fff', fontSize: 46, display: 'flex', alignItems: 'center', justifyContent: 'center' });
const pName = $('div', 'abs disp', Lp.el, 'Asha’s Coffee House'); css(pName, { left: 0, right: 0, top: 150, textAlign: 'center', fontSize: 36 });
const pCity = $('div', 'abs muted', Lp.el, 'Pune'); css(pCity, { left: 0, right: 0, top: 198, textAlign: 'center', fontSize: 21, fontWeight: 600 });
const pQ = $('div', 'abs', Lp.el, 'How was your visit?'); css(pQ, { left: 0, right: 0, top: 262, textAlign: 'center', fontSize: 27, fontWeight: 600 });
const stars = [];
for (let k = 0; k < 5; k++) {
  const s = $('div', 'star', Lp.el); css(s, { left: 270 - 32 + (k - 2) * 82, top: 312 });
  s.innerHTML = starSvg('none', '#C9D3D1') + `<div class="abs" style="inset:0;overflow:hidden">${starSvg('#F2B705', '#F2B705')}</div>`;
  stars.push(s);
}
const pWord = $('div', 'abs muted', Lp.el, ''); css(pWord, { left: 0, right: 0, top: 392, textAlign: 'center', fontSize: 22, fontWeight: 600, height: 30 });
const pLike = $('div', 'abs label', Lp.el, 'What did you like?'); css(pLike, { left: 36, top: 446 });
const CHIPS = ['Great coffee', 'Friendly staff', 'Cosy place', 'Fresh croissants'];
const chipPos = [[36, 488], [222, 488], [400, 488], [36, 552], [222, 552], [442, 552]];
const chips = CHIPS.map((txt, i) => { const c = $('div', 'chip', Lp.el, `<span class="ck" style="display:inline-block;width:0;overflow:hidden">✓</span>${txt}`); css(c, { left: chipPos[i][0], top: chipPos[i][1], fontSize: 20 }); return c; });
function flowChips() { let x = 36, y = 486; for (const c of chips) { const w = c.offsetWidth + 22; if (x + w - 10 > 504) { x = 36; y += 62; } css(c, { left: x, top: y }); x += w - 12; } }
const pRev = $('div', 'abs label', Lp.el, 'Your review'); css(pRev, { left: 36, top: 640 });
const aiBtn = $('div', 'abs', Lp.el, '<span style="font-size:22px">✦</span> Use AI'); css(aiBtn, { right: 36, top: 628, height: 48, padding: '0 20px', borderRadius: 999, border: '2.5px solid', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 21 });
const pBox = $('div', 'abs', Lp.el); css(pBox, { left: 36, right: 36, top: 690, height: 170, borderRadius: 18, border: '2px solid var(--line)', padding: '18px 20px', fontSize: 22.5, lineHeight: 1.42, overflow: 'hidden' });
const pText = $('span', '', pBox); const pCaret = $('span', 'caret', pBox);
const pPost = $('div', 'btn', Lp.el, 'Copy and post review'); css(pPost, { left: 36, right: 36, top: 878, height: 62, fontSize: 23 });
const REVIEW = 'Best filter coffee in Pune! Asha’s Coffee House is a cosy little café, and the staff were so friendly. Coming back soon.';

// stars: drag across, one star per beat
const STAR_T = [17, 18, 19, 20, 21].map((b) => B(b));
const WORDS = ['', 'Poor', 'Not great', 'Okay', 'Good', 'Excellent'];
STAR_T.forEach((tt, k) => cue(tt, 'pop2', 0.45 + k * 0.1));
cue(B(21.5), 'chime', 0.6);
// chips pop on 8ths
const CHIP_T = CHIPS.map((_, i) => B(23 + i * 0.5));
CHIP_T.forEach((tt) => cue(tt, 'pop', 0.4));
frame(B(23) - 0.3, 0, 70, 580, 560);
const TAP1 = B(26), TAP2 = B(27), AI_T = B(28);
cue(TAP1, 'click2', 0.8); cue(TAP2, 'click2', 0.8); cue(AI_T, 'click', 0.9); cue(AI_T + 0.05, 'magic', 0.7);
const TYPE0 = B(28.6), TYPE1 = B(31.2);
frame(B(28.3) - 0.3, 0, 300, 580, 520);
for (let i = 0; i < 20; i++) cue(lerp(TYPE0, TYPE1, i / 19), 'key', 0.18);
const POST_T = B(32);
cue(POST_T, 'click', 1);

// ---------- 3. POSTED + WALL (B32–B40) ----------
const tPosted = B(32) + 0.02;
morph(tPosted, 600, 350, 30, '#FFFFFF', UI);
frame(B(32) - 0.15, 0, 0, 660, 420);
cue(B(32.5), 'ding', 0.8);
const Lpost = layer(600, 350, B(32.25), B(40) - 0.3, 0.12);
Lpost.el.innerHTML = `
  <div class="abs" style="left:36px;top:34px;display:flex;gap:16px;align-items:center">
    <div class="avatar" style="background:#7A5AF8">RM</div>
    <div><div style="font-weight:700;font-size:23px">Rohan M.</div><div class="muted" style="font-size:17px;font-weight:600">Local guide · just now</div></div>
  </div>
  <div class="abs post-stars" style="left:36px;top:112px;display:flex;gap:6px"></div>
  <div class="abs" style="left:36px;right:36px;top:162px;font-size:21px;line-height:1.42">${REVIEW}</div>
  <div class="abs post-badge" style="right:30px;top:36px;height:38px;padding:0 14px;border-radius:999px;background:#E7F6EE;color:#0F6B3E;font-weight:700;font-size:17px;display:flex;align-items:center;gap:6px">✓ Posted</div>`;
const postStars = [];
for (let k = 0; k < 5; k++) { const s = $('div', '', Lpost.el.querySelector('.post-stars'), starSvg('#F2B705', '#F2B705')); css(s, { width: 34, height: 34 }); postStars.push(s); }
const postBadge = Lpost.el.querySelector('.post-badge');

// wall
const wall = $('div', 'abs', world);
const SNIPS = [
  ['PK', '#E4572E', 'Priya K.', 'Lovely place to work from. Great coffee and fast wifi.'],
  ['AS', '#0F766E', 'Arjun S.', 'Croissants were fresh and warm. Friendly staff.'],
  ['NM', '#3F37C9', 'Neha M.', 'Cosy café, quick service. Will be back!'],
  ['VR', '#B45309', 'Vikram R.', 'Best cold brew in the area. Lovely team.'],
  ['SD', '#BE185D', 'Sana D.', 'Perfect spot for a quiet morning coffee.'],
  ['KJ', '#4D7C0F', 'Kabir J.', 'Good value and really friendly people.'],
];
const wallCards = [];
const GX = 640, GY = 410;
const WR = LAND ? 2 : 3, WC = LAND ? 3 : 1;
for (let r = -WR; r <= WR; r++) for (let c = -WC; c <= WC; c++) {
  if (!r && !c) continue;
  const d = Math.hypot(c * GX, r * GY);
  const sn = SNIPS[(r * 5 + c + 30) % SNIPS.length];
  const el = $('div', 'wcard', wall, `
    <div style="display:flex;gap:16px;align-items:center"><div class="avatar" style="background:${sn[1]}">${sn[0]}</div>
    <div style="font-weight:700;font-size:23px">${sn[2]}</div></div>
    <div style="display:flex;gap:6px;margin-top:20px">${Array.from({ length: 5 }, (_, k) => `<div style="width:34px;height:34px">${starSvg(k < ((r + c + 9) % 7 === 0 ? 4 : 5) ? '#F2B705' : '#E4E9E8', 'none')}</div>`).join('')}</div>
    <div style="font-size:21px;line-height:1.42;margin-top:18px">${sn[3]}</div>`);
  wallCards.push({ el, x: c * GX, y: r * GY, d });
}
wallCards.sort((a, b) => a.d - b.d);
const WALL0 = B(34), WALL1 = B(37.5);
wallCards.forEach((wc, i) => { wc.t = lerp(WALL0, WALL1, i / (wallCards.length - 1)); });
for (let i = 0; i < 8; i++) cue(lerp(WALL0, WALL1, i / 7), i % 2 ? 'pop2' : 'pop', 0.35);
frame(B(33.6) - 0.2, 0, -150, (2 * WC + 1) * GX + 120, (2 * WR + 1) * GY + 520, false, { w: 7, z: 1 });
cue(B(33.6), 'whoosh2', 0.6);
// rating badge above the wall
const badge = $('div', 'abs', world);
badge.innerHTML = `<div style="display:flex;align-items:center;gap:34px;background:#fff;border-radius:999px;padding:30px 64px 30px 44px">
  <div style="width:120px;height:120px">${starSvg('#F2B705', '#F2B705')}</div>
  <div class="disp" style="font-size:150px;line-height:1;display:flex">4.<span class="odo" style="display:inline-block;height:150px;overflow:hidden;position:relative;width:0.62em"><span class="strip" style="position:absolute;left:0;top:0;display:flex;flex-direction:column">${[...'0123456789'].map((d) => `<span style="height:150px;line-height:150px">${d}</span>`).join('')}</span></span></div>
  <div style="font-size:46px;font-weight:700;color:var(--muted);line-height:1.15">Asha’s<br>Coffee House</div></div>`;
const odoStrip = badge.querySelector('.strip');
const BADGE_IN = B(35), RATE0 = B(36), RATE1 = B(39);
cue(BADGE_IN, 'hit', 0.6);
for (let k = 0; k < 6; k++) cue(B(36 + k * 0.5), 'tick', 0.5);

// ---------- 4. FEEDBACK (B40–B47) ----------
const tFb = B(40) - LEAD;
morph(tFb, 540, 700, 44, '#FFFFFF', UI);
frame(B(40) - 0.25, 0, -110, 580, 560);
cue(B(40), 'whoosh', 0.8);
const Lfb = layer(540, 700, B(40.2), B(45) - 0.24, 0.1);
Lfb.el.innerHTML = `
  <div class="abs fb-top" style="left:0;right:0;top:0;height:12px"></div>
  <div class="abs" style="left:36px;top:44px;display:flex;align-items:center;gap:16px">
    <div class="disp fb-logo" style="width:60px;height:60px;border-radius:18px;color:#fff;font-size:32px;display:flex;align-items:center;justify-content:center">A</div>
    <div class="disp" style="font-size:30px">Asha’s Coffee House</div></div>
  <div class="abs" style="left:36px;top:138px;font-size:25px;font-weight:600">How was your visit?</div>`;
const fbStars = [];
for (let k = 0; k < 5; k++) {
  const s = $('div', 'star', Lfb.el); css(s, { left: 36 + k * 76, top: 184, width: 60, height: 60 });
  s.innerHTML = starSvg('none', '#C9D3D1') + `<div class="abs" style="inset:0;overflow:hidden">${starSvg('#F2B705', '#F2B705')}</div>`;
  fbStars.push(s);
}
const fbWord = $('div', 'abs muted', Lfb.el, 'Not great'); css(fbWord, { left: 432, top: 200, fontSize: 22, fontWeight: 600 });
const fbQ = $('div', 'abs disp', Lfb.el, 'What could we do better?'); css(fbQ, { left: 36, top: 288, fontSize: 31 });
const fbBox = $('div', 'abs', Lfb.el); css(fbBox, { left: 36, right: 36, top: 350, height: 170, borderRadius: 18, border: '2px solid var(--line)', padding: '18px 20px', fontSize: 25, lineHeight: 1.4 });
const fbText = $('span', '', fbBox); const fbCaret = $('span', 'caret', fbBox);
const fbSend = $('div', 'btn', Lfb.el, 'Send feedback'); css(fbSend, { left: 36, right: 36, top: 548, height: 64, fontSize: 24 });
const FB_TEXT = 'Coffee was cold today.';
const DRAIN_T = B(41), FBQ_IN = B(41.6), FT0 = B(42.4), FT1 = B(44.1), SEND_T = B(44.6);
cue(DRAIN_T, 'click2', 0.8); for (let k = 0; k < 3; k++) cue(DRAIN_T + 0.07 * (k + 1), 'tick', 0.35);
for (let i = 0; i < FB_TEXT.length; i++) if (FB_TEXT[i] !== ' ') cue(lerp(FT0, FT1, i / (FB_TEXT.length - 1)), i % 3 ? 'key' : 'key2', 0.35);
frame(B(42) - 0.25, 0, 70, 580, 560);
cue(SEND_T, 'click', 0.9);

// ---------- 5. WHATSAPP ALERT (B45–B48) ----------
const tToast = B(45) - 0.1;
morph(tToast, 640, 220, 34, '#13201F', UI); S.y.to(tToast, -10, UI);
frame(B(45) - 0.25, 0, -10, 690, 330);
cue(B(45), 'whoosh2', 0.6); cue(B(45.5), 'buzz', 0.7); cue(B(45.55), 'chime', 0.7);
const Lt = layer(640, 220, B(45.25), B(48) - 0.3, 0.1);
Lt.el.innerHTML = `
  <div class="abs" style="left:30px;top:28px;display:flex;align-items:center;gap:12px;color:#B9C7C5;font-size:20px;font-weight:600">
    <div style="width:30px;height:30px;border-radius:9px;background:#25D366;display:flex;align-items:center;justify-content:center"><svg width="18" height="18" viewBox="0 0 24 24"><path d="M4 20l1.3-3.9A8 8 0 1 1 8 18.8L4 20z" fill="none" stroke="#fff" stroke-width="2.2" stroke-linejoin="round"/></svg></div>
    WhatsApp · now</div>
  <div class="abs" style="left:30px;top:72px;color:#fff;font-size:29px;font-weight:700">New feedback · <span style="color:#F2B705">★★</span>☆☆☆</div>
  <div class="abs" style="left:30px;top:118px;color:#E7EEED;font-size:26px">“Coffee was cold today.” · Table 4</div>
  <div class="abs toast-btn" style="left:30px;top:164px;height:36px;padding:0 16px;border-radius:999px;background:#2A3A39;color:#fff;font-weight:700;font-size:17px;display:flex;align-items:center">Call back</div>`;
const toastBtn = Lt.el.querySelector('.toast-btn');
const OWNER_TAP = B(47);
cue(OWNER_TAP, 'click2', 0.9);

// ---------- 6. BRANDING (B48–B56) ----------
const tBr = B(48) - LEAD;
morph(tBr, 760, 600, 38, '#FFFFFF', UI); S.y.to(tBr, 0, UI);
frame(B(48) - 0.25, 0, 0, 800, 640);
cue(B(48), 'whoosh', 0.8);
const Lb = layer(760, 600, B(48.2), B(56) - 0.3, 0.1);
Lb.el.innerHTML = `
  <div class="abs disp" style="left:40px;top:40px;font-size:32px">Review page branding</div>
  <div class="abs label" style="left:40px;top:116px">Name</div>
  <div class="abs" style="left:40px;top:150px;width:360px;height:54px;border-radius:14px;border:2px solid var(--line);padding:0 16px;display:flex;align-items:center;font-size:21px">Asha’s Coffee House</div>
  <div class="abs label" style="left:40px;top:236px">Main colour</div>
  <div class="abs label" style="left:40px;top:392px">Logo</div>
  <div class="abs br-up" style="left:40px;top:428px;width:360px;height:120px;border-radius:18px;border:2px dashed #C9D3D1;display:flex;align-items:center;justify-content:center;gap:14px;font-size:20px;font-weight:600;color:var(--muted)"><span class="up-txt">Upload logo</span></div>
  <div class="abs br-prev" style="left:440px;top:40px;width:280px;height:520px;border-radius:30px;background:#F2F5F4;overflow:hidden">
    <div class="abs prev-top" style="left:0;right:0;top:0;height:9px"></div>
    <div class="abs prev-logo disp" style="left:105px;top:44px;width:70px;height:70px;border-radius:20px;color:#fff;font-size:38px;display:flex;align-items:center;justify-content:center;overflow:hidden"><span class="pl-a">A</span></div>
    <div class="abs disp" style="left:0;right:0;top:130px;text-align:center;font-size:21px">Asha’s Coffee House</div>
    <div class="abs prev-stars" style="left:0;right:0;top:182px;display:flex;justify-content:center;gap:6px"></div>
    <div class="abs" style="left:24px;right:24px;top:240px;height:150px;border-radius:14px;background:#fff"></div>
    <div class="abs prev-btn" style="left:24px;right:24px;top:410px;height:50px;border-radius:13px;color:#fff;font-weight:700;font-size:17px;display:flex;align-items:center;justify-content:center">Post review</div>
  </div>`;
const SW = ['#0B3D3B', '#D9534F', '#3F37C9', '#C2410C', '#6B3E26'];
const swatches = SW.map((c, i) => { const s = $('div', 'abs', Lb.el); css(s, { left: 40 + i * 72, top: 280, width: 56, height: 56, borderRadius: 999, background: c }); return s; });
const swRing = $('div', 'abs', Lb.el); css(swRing, { top: 272, height: 72, borderRadius: 999, border: '3.5px solid var(--ink)' });
const prevStars = Lb.el.querySelector('.prev-stars');
for (let k = 0; k < 5; k++) { const s = $('div', '', prevStars, starSvg('#F2B705', '#F2B705')); css(s, { width: 30, height: 30 }); }
const prevTop = Lb.el.querySelector('.prev-top'), prevLogo = Lb.el.querySelector('.prev-logo'), prevBtn = Lb.el.querySelector('.prev-btn'), plA = Lb.el.querySelector('.pl-a');
const upBox = Lb.el.querySelector('.br-up'), upTxt = Lb.el.querySelector('.up-txt');
const cup = $('div', 'abs', prevLogo, '<svg viewBox="0 0 24 24" width="40" height="40"><path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9z M16 10h1.5a2.5 2.5 0 0 1 0 5H16" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"/><path d="M8 3c0 1.5 1 1.5 1 3M12 3c0 1.5 1 1.5 1 3" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>');
css(cup, { inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' });
// swatch taps on beats; selection ring edges on different springs (stretch)
const SW_T = [49, 50, 51, 52].map((b) => B(b));
const ringL = new Track(40 - 8), ringR = new Track(40 + 56 + 8);
SW_T.forEach((tt, i) => {
  const L = 40 + (i + 1) * 72 - 8, R = L + 72;
  ringR.to(tt, R, { w: 34, z: 0.86 }); ringL.to(tt, L, { w: 19, z: 0.9 });
  brandCol.to(tt, SW[i + 1], UI);
  cue(tt, 'click2', 0.8);
});
const LOGO_T = B(53.5), LOGO_IN = B(54);
cue(LOGO_T, 'click', 0.8); cue(LOGO_IN, 'pop', 0.9); cue(LOGO_IN, 'hit', 0.4);

// ---------- 7. NFC CARD (B56–B64) ----------
const tNfc = B(56) - LEAD;
morph(tNfc, 600, 380, 32, '#6B3E26', UI);
frame(B(56) - 0.25, 0, 0, 660, 460);
cue(B(56), 'whoosh', 0.8);
const Ln = layer(600, 380, B(56.2), B(64) - 0.3, 0.1);
Ln.el.innerHTML = `
  <div class="abs" style="left:40px;top:40px;display:flex;align-items:center;gap:16px">
    <div style="width:64px;height:64px;border-radius:18px;background:rgba(255,255,255,.16);display:flex;align-items:center;justify-content:center"><svg viewBox="0 0 24 24" width="38" height="38"><path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9z M16 10h1.5a2.5 2.5 0 0 1 0 5H16" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"/><path d="M8 3c0 1.5 1 1.5 1 3M12 3c0 1.5 1 1.5 1 3" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg></div>
    <div class="disp" style="color:#fff;font-size:30px">Asha’s Coffee House</div></div>
  <svg class="abs nfc-waves" style="right:40px;top:44px" width="60" height="60" viewBox="0 0 24 24"><path d="M8.5 8.5a5 5 0 0 1 0 7M12 6a8.5 8.5 0 0 1 0 12M15.5 3.5a12 12 0 0 1 0 17" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>
  <div class="abs" style="left:40px;bottom:44px;color:#fff">
    <div class="disp" style="font-size:38px;line-height:1.05">Tap your phone<br>to leave a review</div>
    <div style="font-size:19px;opacity:.75;margin-top:10px;font-weight:600">or scan the code</div></div>
  <div class="abs" style="right:40px;bottom:40px;width:104px;height:104px;border-radius:14px;background:#fff;padding:10px"><div class="mini-qr" style="width:84px;height:84px;position:relative"></div></div>`;
const miniQr = Ln.el.querySelector('.mini-qr'); seed = 11;
for (let i = 0; i < 11; i++) for (let j = 0; j < 11; j++) { const fz = (i < 3 && j < 3) || (i < 3 && j > 7) || (i > 7 && j < 3); if (fz || rnd() < 0.45) { const m = $('div', 'abs', miniQr); css(m, { left: j * 7.64, top: i * 7.64, width: 8, height: 8, background: '#13201F' }); } }
const NFC_TAP = B(60);
const rings = [0, 1, 2].map(() => { const r = $('div', 'abs', world); css(r, { borderRadius: 40, border: '4px solid #6B3E26' }); return r; });
const RING_T = [B(60), B(60.5), B(61)];
frame(B(59.6) - 0.2, 0, 0, 860, 640);
cue(B(59.4), 'whoosh2', 0.5); cue(NFC_TAP, 'click', 0.9); cue(NFC_TAP + 0.02, 'blip', 0.8);
RING_T.forEach((tt, i) => cue(tt, 'pop2', 0.5 - i * 0.1));

// ---------- 8. END (B64–) ----------
const tMark = B(64) - LEAD;
morph(tMark, 250, 250, 66, '#0B3D3B', SNAP); S.y.to(tMark, -300, UI);
frame(B(64) - 0.3, 0, -300, 700, 700, true);
cue(B(64), 'whoosh', 0.9);
const Lm = layer(250, 250, B(64.2), null);
const markImg = $('img', 'abs', Lm.el); markImg.src = 'assets/icon-white.png'; css(markImg, { width: 150, left: 50, top: 61 });
const endG = $('div', 'abs', world);
const word = $('img', 'center', endG); word.src = 'assets/wordmark-dark.png'; css(word, { width: 760, top: -80 });
const E = [
  ['More 5★ Google reviews.', 68, 74, 'disp', 'var(--ink)'],
  ['Customers tap. AI writes. Done.', 70, 158, '', 'var(--muted)'],
  ['From ₹149/month', 72, 276, 'disp', 'var(--teal)'],
];
const endLines = E.map(([txt, b, y, cls, col]) => { const el = $('div', `center ${cls}`, endG, txt); css(el, { top: y, whiteSpace: 'nowrap', fontSize: cls ? 64 : 40, fontWeight: cls ? 800 : 600, color: col }); return { el, t: B(b) }; });
const url = $('div', 'center', endG, 'reviewwo.divergit.com'); css(url, { top: 398, height: 76, padding: '0 34px', borderRadius: 999, background: 'var(--teal)', color: '#fff', fontSize: 32, fontWeight: 700, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' });
const URL_T = B(74);
frame(B(66) - 0.3, 0, 0, 960, 940, true);
cue(B(66), 'boom', 0.9); cue(B(68), 'hit', 0.7); cue(B(70), 'hit', 0.55); cue(B(72), 'hit', 0.8); cue(URL_T, 'pop', 0.9); cue(B(76), 'boom', 0.8);

// =====================================================================
// CAPTIONS (hud)
// =====================================================================
const scrim = $('div', 'abs', hud);
if (LAND) css(scrim, { left: 0, top: 0, bottom: 0, width: W * 0.46, background: `linear-gradient(90deg, #F2F5F4 ${W * 0.41}px, rgba(242,245,244,0))` });
else css(scrim, { left: 0, right: 0, top: 0, height: H * 0.3, background: `linear-gradient(180deg, #F2F5F4 ${H * 0.25}px, rgba(242,245,244,0))` });
const capBox = $('div', '', hud); capBox.id = 'cap';
if (LAND) css(capBox, { left: W * 0.07, top: 0, width: W * 0.34, height: H });
else css(capBox, { left: 0, top: H * 0.055, width: W, height: H * 0.2 });
const CAPS = [
  [8, 15.5, 'For customers', 'Scan the QR.'],
  [15.5, 22.8, 'For customers', 'Tap the stars.'],
  [22.8, 27.8, 'For customers', 'Tap what they loved.'],
  [27.8, 31.8, 'For customers', 'AI writes the review.'],
  [31.8, 33.8, 'For customers', 'One tap. Posted.'],
  [33.8, 39.8, 'For you', 'Watch reviews pile up.'],
  [39.8, 44.6, 'For you', 'Not a great visit?'],
  [44.6, 47.8, 'For you', 'You hear it first, on WhatsApp.'],
  [47.8, 55.8, 'For you', 'Your name. Your logo. Your colours.'],
  [55.8, 63.6, 'For you', 'QR code or NFC tap card.'],
];
const caps = CAPS.map(([a, b, k, txt]) => {
  const el = $('div', 'abs', capBox);
  el.innerHTML = `<div class="kicker" style="font-size:${22 * U}px;margin-bottom:${14 * U}px">${k}</div><div class="capt" style="font-size:${(LAND ? 86 : 80) * U}px">${txt}</div>`;
  if (LAND) css(el, { left: 0, width: W * 0.34, top: H / 2, textAlign: 'left' });
  else css(el, { left: W * 0.5, width: W * 0.86, top: H * 0.1, textAlign: 'center' });
  return { el, a: B(a), b: B(b) };
});

// =====================================================================
// CURSOR (hud, follows world targets)
// =====================================================================
const cur = $('div', '', hud); cur.id = 'cursor';
cur.innerHTML = `<svg width="44" height="52" viewBox="0 0 22 26" style="position:absolute;left:-4px;top:-3px"><path d="M2 1.5l17 10.2-7.4 1.6 4.3 8.3-3.4 1.7-4.2-8.4L2.5 19z" fill="#13201F" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
const cpill = $('div', '', cur); cpill.id = 'cpill';
const pillTxt = [['Customer', B(15.5), B(44.9)], ['Owner', B(44.95), B(56.2)], ['Customer', B(56.45), B(66)]].map(([txt, a, b]) => { const s = $('span', 'abs', cpill, txt); css(s, { left: 18, top: 9 }); return { s, a, b, w: txt === 'Owner' ? 92 : 120 }; });
const pillW = new Track(120);
pillW.to(B(44.95), 92, UI).to(B(56.25), 120, UI);
const AX = new Track(330), AY = new Track(700);
const clicks = [];
const press = (t) => clicks.push(t);
const moveTo = (t, x, y, sp = { w: 16, z: 0.92 }) => { AX.to(t, x, sp); AY.to(t, y, sp); };
const CUR_WIN = [[B(15.8), B(33.1)], [B(40.1), B(62.8)]];
const cursorShow = (t) => { let v = 0; for (const [a, b] of CUR_WIN) { if (t < a) continue; v = Math.max(v, t < b ? pop(t, a) : Math.max(0, 1 - stepR(t - b, TXT))); } return v; };
// filled in after measurement (needs layout)
function choreograph() {
  // page coordinates: layer centre = shape centre = world (0,0)
  const starXY = (k) => [(k - 2) * 82, 312 + 32 - 480];
  moveTo(B(15.8) - 0.3, starXY(0)[0] - 40, starXY(0)[1] + 90);
  moveTo(B(16.6) - 0.25, starXY(0)[0] + 2, starXY(0)[1] + 6);
  press(B(16.8));
  STAR_T.forEach((tt, k) => moveTo(tt - 0.14, starXY(k)[0] + 6, starXY(k)[1] + 6, { w: 26, z: 0.9 }));
  press(B(21.5));
  const chipXY = (i) => { const [x, y] = rel(chips[i], Lp); return [x - 40, y + 4]; };
  moveTo(TAP1 - 0.3, ...chipXY(0)); press(TAP1);
  moveTo(TAP2 - 0.3, ...chipXY(3)); press(TAP2);
  const ai = rel(aiBtn, Lp); moveTo(AI_T - 0.3, ai[0], ai[1] + 2); press(AI_T);
  moveTo(B(29.5), ai[0] - 90, ai[1] + 160, SOFT);
  const post = rel(pPost, Lp); moveTo(POST_T - 0.32, post[0] + 60, post[1] + 4); press(POST_T);
  moveTo(B(33), 360, 300, SOFT);
  // feedback (shape 540x700 centred at 0,0 -> top -350)
  const fbStar = (k) => [-270 + 36 + k * 76 + 30, -350 + 184 + 30];
  moveTo(B(40.4), fbStar(1)[0] + 30, fbStar(1)[1] + 50, SOFT);
  moveTo(DRAIN_T - 0.28, fbStar(1)[0] + 4, fbStar(1)[1] + 4); press(DRAIN_T);
  moveTo(B(42.2), 150, -350 + 350 + 140, SOFT);
  const send = [0, -350 + 548 + 32]; moveTo(SEND_T - 0.3, send[0] + 40, send[1]); press(SEND_T);
  // toast centre at (0,-10), button at left 30 top 164 in 640x220 -> world
  const tb = [-320 + 30 + 52, -10 - 110 + 164 + 18];
  moveTo(B(46.2), tb[0] + 80, tb[1] + 90, SOFT);
  moveTo(OWNER_TAP - 0.3, tb[0], tb[1]); press(OWNER_TAP);
  // branding (760x600 at 0,0 -> left -380, top -300)
  SW_T.forEach((tt, i) => { moveTo(tt - 0.24, -380 + 40 + (i + 1) * 72 + 28, -300 + 280 + 28, { w: 22, z: 0.9 }); press(tt); });
  moveTo(LOGO_T - 0.3, -380 + 40 + 180, -300 + 428 + 60); press(LOGO_T);
  moveTo(B(55), 300, 330, SOFT);
  // NFC tap
  moveTo(B(58), 420, 120, SOFT);
  moveTo(NFC_TAP - 0.3, 236, -112, { w: 18, z: 0.95 }); press(NFC_TAP);
  moveTo(B(61.5), 380, 40, SOFT);
}
cue(B(16.8), 'click2', 0.5);

// =====================================================================
// BACKGROUND
// =====================================================================
css(bg, { background: `radial-gradient(${W * 0.7}px ${H * 0.45}px at ${W * 0.15}px ${H * 0.1}px, rgba(20,184,166,.10), transparent 70%), radial-gradient(${W * 0.6}px ${H * 0.4}px at ${W * 0.92}px ${H * 0.95}px, rgba(242,183,5,.10), transparent 70%), #F2F5F4` });

// =====================================================================
// SEEK
// =====================================================================
function seek(t) {
  const c = cam(t);
  world.style.transform = `translate(${c.sx}px,${c.sy}px) scale(${c.z}) translate(${-c.x}px,${-c.y}px)`;

  // hook text
  hookLines.forEach(({ el, b }) => {
    const v = vis(t, B(b) - 0.05, HOOK_OUT + (2 - (b / 2)) * 0.03, 0.14);
    applyVis(el, v, `scale(${(1 + 0.35 * (1 - v.e)).toFixed(4)})`);
  });

  // the shape
  const w = Math.max(0, S.w.at(t)), h = Math.max(0, S.h.at(t)), r = Math.max(0, S.r.at(t));
  const sx = S.x.at(t), sy = S.y.at(t);
  const pressBump = bump(t, POST_T, 0.05, 0.05) + bump(t, OWNER_TAP, 0.04, 0.05) + bump(t, NFC_TAP, 0.05, 0.06) + bump(t, SEND_T, 0.03, 0.05);
  css(shape, { left: sx - w / 2, top: sy - h / 2, width: w, height: h, borderRadius: Math.min(r, w / 2, h / 2) });
  shape.style.background = S.col.at(t);
  const shd = clamp(S.sh.at(t), 0, 1.2);
  shape.style.boxShadow = `0 ${40 * shd}px ${80 * shd}px -${36 * shd}px rgba(7,39,38,${0.42 * shd}), 0 ${2 * shd}px ${8 * shd}px rgba(7,39,38,${0.07 * shd})`;
  shape.style.transform = `scale(${1 - pressBump})`;
  shape.style.visibility = w < 0.5 ? 'hidden' : 'visible';

  for (const L of layers) { const v = vis(t, L.tin, L.tout, L.dOut); applyVis(L.el, v); }

  // QR draw-in + scan
  for (const m of mods) { const k = clamp((t - lerp(QR_DRAW0, QR_DRAW1, m.k)) / 0.12); m.el.style.transform = `scale(${k.toFixed(3)})`; }
  qrLogo.style.transform = `scale(${pop(t, B(10.5)).toFixed(3)})`;
  const bv = t < BRK_IN ? 0 : t < SNAPSHOT + 0.25 ? stepR(t - BRK_IN, SNAP) : 1 - clamp((t - SNAPSHOT - 0.25) / 0.15);
  const spread = 230 + 80 * (1 - stepR(t - BRK_IN, SNAP)) - 14 * bump(t, SNAPSHOT, 1, 0.06);
  corners.forEach(({ el, sx: a, sy: b }) => { css(el, { left: a * spread - 27 + a * -27 * 0, top: 20 + b * (spread + 10) - 27 }); el.style.opacity = bv.toFixed(3); });
  const sl = t > SCAN0 && t < SNAPSHOT + 0.1 ? 1 : 0;
  const sk = clamp((t - SCAN0) / (SCAN1 - SCAN0)); const skE = 0.5 - 0.5 * Math.cos(Math.PI * sk);
  css(scanLine, { left: -170, width: 340, top: -120 + 280 * skE });
  scanLine.style.opacity = (sl * (1 - clamp((t - SNAPSHOT) / 0.1))).toFixed(3);
  qrBox.style.filter = t > SNAPSHOT && t < SNAPSHOT + 0.12 ? 'brightness(1.6)' : 'none';

  // page brand colour + stars + chips + AI
  const bc = brandCol.at(t);
  pTop.style.background = bc; pLogo.style.background = bc; pPost.style.background = bc;
  stars.forEach((s, k) => {
    const f = stepR(t - STAR_T[k] + 0.02, SNAP);
    s.lastChild.style.width = `${(clamp(f) * 100).toFixed(1)}%`;
    s.style.transform = `scale(${(1 + 0.22 * bump(t, STAR_T[k] + 0.04, 1, 0.07)).toFixed(4)})`;
  });
  const nStars = STAR_T.filter((x) => t >= x).length;
  pWord.textContent = WORDS[nStars];
  pWord.style.opacity = nStars ? 1 : 0;
  pWord.style.color = nStars === 5 ? 'var(--ink)' : 'var(--muted)';
  const likeV = vis(t, B(22.6), null); pLike.style.opacity = likeV.o; pLike.style.filter = `blur(${likeV.b}px)`;
  chips.forEach((ch, i) => {
    const p = pop(t, CHIP_T[i]); const sel = i === 0 ? TAP1 : i === 3 ? TAP2 : null;
    const on = sel != null && t >= sel;
    ch.style.transform = `scale(${(p * (1 - bump(t, sel ?? -9, 0.08, 0.05))).toFixed(4)})`;
    ch.style.opacity = clamp(p * 1.5).toFixed(3);
    const k = on ? stepR(t - sel, SNAP) : 0;
    ch.style.background = k > 0.5 ? bc : '#fff';
    ch.style.color = k > 0.5 ? '#fff' : 'var(--ink)';
    ch.style.borderColor = k > 0.5 ? bc : 'var(--line)';
    ch.firstChild.style.width = `${(18 * clamp(k)).toFixed(2)}px`;
  });
  const revV = vis(t, B(25.6), null);
  [pRev, aiBtn, pBox, pPost].forEach((el) => { el.style.opacity = revV.o; el.style.filter = revV.b > 0.05 ? `blur(${revV.b}px)` : 'none'; });
  aiBtn.style.borderColor = bc; aiBtn.style.color = t >= AI_T ? '#fff' : bc; aiBtn.style.background = t >= AI_T ? bc : '#fff';
  aiBtn.style.transform = `scale(${(1 - bump(t, AI_T, 0.12, 0.05)).toFixed(4)})`;
  const n = Math.floor(clamp((t - TYPE0) / (TYPE1 - TYPE0)) * REVIEW.length);
  pText.textContent = REVIEW.slice(0, n);
  pText.style.color = 'var(--ink)';
  pCaret.style.background = bc;
  pCaret.style.opacity = t > TYPE0 - 0.1 && t < POST_T ? (n < REVIEW.length || Math.floor(t * 3) % 2 ? 1 : 0) : 0;
  pPost.style.transform = `scale(${(1 - bump(t, POST_T, 0.08, 0.05)).toFixed(4)})`;

  // posted card details
  postStars.forEach((s, k) => { s.style.transform = `scale(${pop(t, B(32.3) + k * 0.045).toFixed(3)})`; });
  postBadge.style.transform = `scale(${pop(t, B(32.5)).toFixed(3)})`;

  // wall
  const wallOut = B(40) - 0.1;
  for (const wc of wallCards) {
    const p = pop(t, wc.t); const out = clamp((t - wallOut) / 0.25);
    css(wc.el, { left: wc.x - 280, top: wc.y - 165 });
    wc.el.style.transform = `scale(${(p * (1 - 0.3 * out)).toFixed(4)})`;
    wc.el.style.opacity = (clamp(p * 1.4) * (1 - out)).toFixed(3);
    wc.el.style.filter = out > 0 ? `blur(${(out * 12).toFixed(1)}px)` : 'none';
    wc.el.style.visibility = p <= 0 || out >= 1 ? 'hidden' : 'visible';
    wc.el.style.boxShadow = '0 30px 60px -32px rgba(7,39,38,.35)';
  }
  const bvv = vis(t, BADGE_IN, wallOut, 0.2);
  css(badge, { left: 0, top: -WR * GY - (LAND ? 360 : 420) });
  applyVis(badge, bvv, `scale(${((0.9 + 0.1 * bvv.e) * (LAND ? 1.25 : 1.7)).toFixed(4)})`);
  const rv = 2 + 6 * (1 - (1 - clamp((t - RATE0) / (RATE1 - RATE0))) ** 2);
  odoStrip.style.transform = `translateY(${(-rv * 150).toFixed(2)}px)`;

  // feedback
  const fbc = brandCol.at(t);
  Lfb.el.querySelector('.fb-top').style.background = fbc; Lfb.el.querySelector('.fb-logo').style.background = fbc;
  fbStars.forEach((s, k) => {
    const f = k < 2 ? 1 : 1 - stepR(t - DRAIN_T - 0.06 * (k - 2), SNAP);
    s.lastChild.style.width = `${(clamp(f) * 100).toFixed(1)}%`;
    s.style.transform = `scale(${(1 + (k === 1 ? 0.2 * bump(t, DRAIN_T, 1, 0.07) : 0)).toFixed(4)})`;
  });
  const fwv = vis(t, DRAIN_T + 0.1, null); fbWord.style.opacity = fwv.o; fbWord.style.filter = `blur(${fwv.b}px)`;
  const fqv = vis(t, FBQ_IN, null);
  [fbQ, fbBox, fbSend].forEach((el, i) => { const v = vis(t, FBQ_IN + i * 0.06, null); el.style.opacity = v.o; el.style.filter = v.b > 0.05 ? `blur(${v.b}px)` : 'none'; el.style.transform = `translateY(${v.dy}px)`; });
  void fqv;
  const fn = Math.floor(clamp((t - FT0) / (FT1 - FT0)) * FB_TEXT.length + 0.001);
  fbText.textContent = FB_TEXT.slice(0, fn);
  fbCaret.style.background = fbc;
  fbCaret.style.opacity = t > FT0 - 0.15 && t < SEND_T ? (fn < FB_TEXT.length || Math.floor(t * 3) % 2 ? 1 : 0) : 0;
  fbSend.style.background = fbc;
  fbSend.style.transform += ` scale(${(1 - bump(t, SEND_T, 0.08, 0.05)).toFixed(4)})`;

  // toast
  toastBtn.style.transform = `scale(${(1 - bump(t, OWNER_TAP, 0.12, 0.05)).toFixed(4)})`;
  toastBtn.style.background = t >= OWNER_TAP ? '#14B8A6' : '#2A3A39';

  // branding
  const L = ringL.at(t), R = ringR.at(t);
  css(swRing, { left: L, width: R - L });
  swatches.forEach((s, i) => { const j = SW_T.indexOf(SW_T[i - 1]); s.style.transform = `scale(${(1 - (i > 0 ? bump(t, SW_T[i - 1], 0.14, 0.05) : 0)).toFixed(4)})`; void j; });
  const pc = brandCol.at(t);
  prevTop.style.background = pc; prevLogo.style.background = pc; prevBtn.style.background = pc;
  prevLogo.style.transform = `scale(${(1 + 0.18 * bump(t, LOGO_IN, 1, 0.08)).toFixed(4)})`;
  const lk = stepR(t - LOGO_IN, SNAP);
  plA.style.opacity = (1 - clamp(lk * 2)).toFixed(3);
  cup.style.opacity = clamp(lk).toFixed(3); cup.style.transform = `scale(${(0.4 + 0.6 * pop(t, LOGO_IN)).toFixed(3)})`;
  upBox.style.transform = `scale(${(1 - bump(t, LOGO_T, 0.05, 0.05)).toFixed(4)})`;
  upBox.style.borderColor = t >= LOGO_IN ? pc : '#C9D3D1';
  upTxt.textContent = t >= LOGO_IN ? 'asha-logo.png ✓' : 'Upload logo';
  upTxt.style.color = t >= LOGO_IN ? 'var(--ink)' : 'var(--muted)';

  // NFC ripples
  rings.forEach((rg, i) => {
    const k = clamp((t - RING_T[i]) / 0.7);
    const on = t >= RING_T[i] && k < 1;
    const s = 1 + 0.55 * (1 - (1 - k) ** 3);
    css(rg, { left: -300 * s, top: -190 * s, width: 600 * s, height: 380 * s, borderRadius: 32 * s });
    rg.style.opacity = on ? ((1 - k) * 0.9).toFixed(3) : 0;
    rg.style.borderColor = '#6B3E26';
  });

  // end
  Lm.el.style.transform += ` scale(${(1 + 0.06 * bump(t, B(76), 1, 0.08)).toFixed(4)})`;
  const wv = vis(t, B(66) - 0.04, null);
  applyVis(word, wv, `scale(${(1 + 0.25 * (1 - wv.e)).toFixed(4)})`);
  endLines.forEach(({ el, t: tt }) => { const v = vis(t, tt - 0.04, null); applyVis(el, v, `scale(${(1 + 0.2 * (1 - v.e)).toFixed(4)})`); });
  const uv = vis(t, URL_T - 0.04, null);
  applyVis(url, uv, `scale(${(pop(t, URL_T - 0.04) * (1 - bump(t, B(76), 0.04, 0.08))).toFixed(4)})`);

  // captions
  scrim.style.opacity = (1 - clamp(mode.at(t))).toFixed(3);
  caps.forEach(({ el, a, b }, i) => {
    const v = vis(t, a, b - 0.13, 0.11);
    applyVis(el, v, LAND ? 'translateX(50%)' : '');
    if (LAND) el.style.transform = `translate(0,-50%) translateY(${v.dy.toFixed(2)}px)`;
    void i;
  });

  // cursor
  const show = cursorShow(t);
  const wx = AX.at(t), wy = AY.at(t);
  const [px, py] = project(c, wx, wy);
  const vx = (AX.at(t + 0.008) - AX.at(t - 0.008)) / 0.016 * c.z;
  const lean = clamp(-vx * 0.0045, -14, 14);
  let pr = 0; for (const tc of clicks) pr += 0.16 * Math.exp(-(((t - tc) / 0.045) ** 2));
  const cs = U * 1.45;
  cur.style.transform = `translate(${px.toFixed(2)}px,${py.toFixed(2)}px) scale(${(show * cs * (1 - Math.min(0.2, pr))).toFixed(4)}) rotate(${lean.toFixed(2)}deg)`;
  cur.style.opacity = clamp(show * 1.4).toFixed(3);
  cur.style.visibility = show < 0.01 ? 'hidden' : 'visible';
  const lag = clamp(-vx * 0.012, -22, 22);
  cpill.style.transform = `translateX(${lag.toFixed(2)}px)`;
  cpill.style.width = `${pillW.at(t).toFixed(2)}px`;
  pillTxt.forEach(({ s, a, b }) => { const v = vis(t, a, b, 0.1); s.style.opacity = v.o; s.style.filter = v.b > 0.05 ? `blur(${v.b}px)` : 'none'; });
  // click ripples (hud)
  for (let i = 0; i < clicks.length; i++) {
    const rp = ripples[i]; const k = (t - clicks[i]) / 0.4;
    if (k < 0 || k > 1) { rp.style.visibility = 'hidden'; continue; }
    const [qx, qy] = [px, py];
    const rad = (10 + 34 * (1 - (1 - k) ** 2)) * U;
    rp.style.visibility = 'visible';
    css(rp, { left: qx - rad, top: qy - rad, width: rad * 2, height: rad * 2 });
    rp.style.opacity = ((1 - k) * 0.8).toFixed(3);
  }
}

let ripples = [];
async function build() {
  await document.fonts.ready;
  await Promise.all([...document.images].map((im) => (im.complete ? 0 : new Promise((r) => { im.onload = im.onerror = r; }))));
  flowChips();
  choreograph();
  ripples = clicks.map(() => { const r = $('div', 'ring', hud); return r; });
  CUES.sort((a, b) => a.t - b.t);
  seek(0);
  window.READY = true;
}
window.seek = seek;
window.FILM = { W, H, END, BEAT, T0, CUES, B };
build();
})();
