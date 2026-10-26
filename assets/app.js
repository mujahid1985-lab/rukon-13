// ============================================================
//  Premium UI components + user session / activity tracking
// ============================================================
import { esc, qs, toBn, cleanHtml, simpleHtml, textToHtml, autoDir, plainText } from './islamic.js';
import { db, doc, getDoc, getDocs, collection, setDoc } from './firebase.js';
import { T, setLabels } from './labels.js';
import { RI } from './icons.js';
export { esc, qs, toBn, cleanHtml, simpleHtml, textToHtml, autoDir, plainText, T, RI };

/* ---------------- icons (inline svg, no CDN) ---------------- */
const S = (p, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${p}</svg>`;
export const ICON = {
  home: S('<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/><path d="M10 19.5v-5h4v5"/>'),
  search: S('<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4-4"/>'),
  user: S('<circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20c.7-3.8 3.7-5.8 7.5-5.8s6.8 2 7.5 5.8"/>'),
  back: S('<path d="m14.5 5-7 7 7 7"/>'),
  next: S('<path d="m9.5 5 7 7-7 7"/>'),
  check: S('<path d="m5 12.5 4.5 4.5L19 7.5"/>'),
  out: S('<path d="M9 4.5H5.5v15H9"/><path d="M16 8l4 4-4 4"/><path d="M20 12H9.5"/>'),
  eye: S('<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="2.8"/>'),
  flame: S('<path d="M12 3c.5 3.2 4.5 5 4.5 9.5a4.5 4.5 0 0 1-9 0c0-1.8.8-3 1.8-4 .2 1.2.9 1.8 1.7 2C11 8.5 11 5.5 12 3Z"/>'),
  book: S('<path d="M4 5.5C6.5 4.5 9.5 4.5 12 6c2.5-1.5 5.5-1.5 8-.5v13c-2.5-1-5.5-1-8 .5-2.5-1.5-5.5-1.5-8-.5Z"/><path d="M12 6v13"/>'),
  clock: S('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
  cal: S('<rect x="4" y="5.5" width="16" height="14.5" rx="3"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/>'),
  edit: S('<path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-4-4L4 16v4Z"/>'),
  shield: S('<path d="M12 3.5 19 6v5.5c0 4.3-3 7.6-7 9-4-1.4-7-4.7-7-9V6l7-2.5Z"/><path d="m9 12 2.2 2.2L15.5 10"/>'),
  eyeoff: S('<path d="M3 3l18 18"/><path d="M10.6 6A9.5 9.5 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a16 16 0 0 1-3 3.8M6.5 7.5A16 16 0 0 0 2.5 12S6 18.5 12 18.5c1.4 0 2.6-.3 3.7-.8"/>'),
  mail: S('<rect x="3.5" y="5.5" width="17" height="13" rx="3"/><path d="m4.5 8 7.5 5.5L19.5 8"/>'),
  lock: S('<rect x="5" y="10.5" width="14" height="9.5" rx="3"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>'),
  plus: S('<path d="M12 5v14M5 12h14"/>'),
  minus: S('<path d="M5 12h14"/>'),
};
/* big line icons for the round badge of every button (brown line + tan fill) */
const BI = (p) => `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const F = 'fill="var(--c3)" fill-opacity=".45"';
export const BIG = {
  clip: BI(`<rect x="13" y="10" width="38" height="48" rx="5" ${F}/><rect x="23" y="5" width="18" height="10" rx="4" fill="var(--c4)"/><path d="M21 28h22M21 36h22M21 44h22"/><circle cx="18" cy="28" r=".5"/><circle cx="18" cy="36" r=".5"/><circle cx="18" cy="44" r=".5"/>`),
  note: BI(`<path d="M20 12 52 24 42 54 10 42Z" ${F}/><path d="M16 22l-4 12M21 24l-4 12M26 26l-4 12" stroke-width="3"/><path d="M9 18 15 52" stroke="none"/><path d="M8 40 22 56l3-10Z" fill="var(--c4)"/>`),
  ledger: BI(`<rect x="6" y="14" width="52" height="38" rx="4" ${F}/><path d="M32 14v38M12 24h14M12 31h14M12 38h14M38 24h14M38 31h14M38 38h14" stroke-width="2.6"/>`),
  book: BI(`<path d="M6 16c8-3 18-3 26 2 8-5 18-5 26-2v34c-8-3-18-3-26 2-8-5-18-5-26-2Z" ${F}/><path d="M32 18v34"/>`),
  list: BI(`<rect x="12" y="8" width="40" height="48" rx="6" ${F}/><path d="M22 22h20M22 32h20M22 42h12"/>`),
  file: BI(`<path d="M14 6h26l12 12v40H14Z" ${F}/><path d="M40 6v12h12"/><path d="M32 30v14m-7-6 7 7 7-7"/>`),
  notes: BI(`<path d="M12 8h40v34L38 56H12Z" ${F}/><path d="M38 56V42h14"/><path d="M20 20h24M20 29h24M20 38h10"/>`),
  audio: BI(`<path d="M12 40V32a20 20 0 0 1 40 0v8" /><rect x="8" y="36" width="10" height="16" rx="4" ${F}/><rect x="46" y="36" width="10" height="16" rx="4" ${F}/>`),
  video: BI(`<circle cx="32" cy="32" r="24" ${F}/><path d="M26 22v20l16-10Z" fill="currentColor"/>`)
};
const DIA = `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.5 21.5 12 12 21.5 2.5 12Z"/></svg>`;
export { DIA };

/* ---- colour palette: 4 colours [background, primary, accent, light]; set from admin, applied on every page ---- */
export function applyPalette(p) {
  if (!Array.isArray(p) || p.length !== 4 || !p.every(c => /^#[0-9a-f]{6}$/i.test(c))) return;
  const r = document.documentElement.style; ['--c1', '--c2', '--c3', '--c4'].forEach((k, i) => r.setProperty(k, p[i]));
  try { localStorage.setItem('p_pal3', JSON.stringify(p)); } catch (e) { /* ignore */ }
}
export const DEFAULT_PALETTES = [
  { id: 'p1', c: ['#DDDEDD', '#103C4A', '#8DB3BF', '#DDDEDD'] },
  { id: 'p2', c: ['#DEE2DD', '#17493A', '#9CC4B0', '#DEE2DD'] },
  { id: 'p3', c: ['#DDE0E6', '#1F3C6B', '#9DB4DA', '#DDE0E6'] },
  { id: 'p4', c: ['#E4DEDE', '#5B1F2E', '#D1A0AB', '#E4DEDE'] },
  { id: 'p5', c: ['#E0DDE6', '#3F2D6B', '#B7A6DB', '#E0DDE6'] }
];
/* auto mode: every 24h the next colour box of the saved list is used (computed from the saved start time, no server needed) */
export function autoPalette(s) {
  if (!s || s.paletteVer !== 3 || !s.paletteAuto || !Array.isArray(s.paletteBoxes) || !s.paletteBoxes.length) return null;
  const n = s.paletteBoxes.length, d = Math.max(0, Math.floor((Date.now() - (s.paletteAutoStart || Date.now())) / 86400000));
  const b = s.paletteBoxes[(((s.paletteAutoIdx || 0) + d) % n + n) % n];
  return b && b.c;
}
try { applyPalette(JSON.parse(localStorage.getItem('p_pal3') || 'null')); } catch (e) { /* ignore */ }


/* ---------------- tiny helpers: page header, bars, badges, buttons, group cards ---------------- */
export function titleBox({ title = '', sub = '' } = {}) { return `<section class="p-card p-soon"><h3 class="p-t">${esc(title)}</h3></section>`; }
export const plaqueHead = titleBox;
export const heroHtml = () => '';
export function mountBg() { /* flat design: nothing to draw */ }
export function mountNav() { /* no bottom bar */ }
export function mountClouds() { /* no decoration */ }

// header (back button + centred title) and an optional dark bar under it; both stay on screen while scrolling
export function topHtml({ title = '', back = 'index.html', bar = '', noBack = false } = {}) {
  return `<div class="p-stick" id="pStick"><header class="p-top"><div class="p-top-in">${noBack ? '' : `<a class="p-back" id="pBack" href="${esc(back)}" aria-label="পেছনে">${RI.back}</a>`}<h1 id="pTitle"><span class="tt">${esc(title)}</span></h1></div></header>${bar}</div>`;
}
export function setTop(title, sub, note) { const t = document.getElementById('pTitle'); if (!t || title == null) return; t.innerHTML = `<span class="tt">${esc(title)}</span>` + (sub ? `<span class="ts">${esc(sub)}</span>` : '') + (note ? `<span class="ts sn">${esc(note)}</span>` : ''); t.classList.toggle('two', !!(sub || note)); t.classList.toggle('three', !!(sub && note)); fitTitle(); }
// the page title never gets cut: it shrinks to fit on one line, and only if it is still too long it takes two lines
export function fitTitle() {
  const h = document.getElementById('pTitle'); if (!h) return;
  const run = () => {
    const cs = getComputedStyle(h), avail = h.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight); if (avail <= 0) return;
    const free = Math.max(0, h.clientHeight - parseFloat(cs.paddingTop));
    h.querySelectorAll('.tt,.ts').forEach((el) => {
      el.classList.remove('wrap'); el.style.fontSize = ''; el.style.lineHeight = '';
      const w = () => el.scrollWidth, two = el.classList.contains('ts') || h.classList.contains('two');
      if (w() <= avail + 0.5) return;
      const min = two ? 0.74 : 0.66;
      let sc = Math.max(min, avail / w() - 0.01); el.style.fontSize = (sc * (el.classList.contains('sn') ? 40 : el.classList.contains('ts') ? 58 : 100)).toFixed(1) + (el.classList.contains('ts') ? '%' : '%');
      if (w() <= avail + 0.5) return;
      el.classList.add('wrap'); let k = 0; const maxH = two ? free * 0.5 : free * 0.92;
      while (el.scrollHeight > maxH && k++ < 14) { sc *= 0.94; el.style.fontSize = (sc * (el.classList.contains('sn') ? 40 : el.classList.contains('ts') ? 58 : 100)).toFixed(1) + '%'; }
    });
  };
  run(); if (document.fonts && document.fonts.ready) document.fonts.ready.then(run); if (!window._fitRs) { window._fitRs = 1; addEventListener('resize', () => fitTitle()); }
}

export const n2 = (n) => toBn(String(n).padStart(2, '0'));
export const bd = (txt, id = '') => `<b class="p-bd"${id ? ` id="${id}"` : ''}><i>${esc(txt)}</i></b>`;
// change a badge's number with a smooth roll (new number slides in from the bottom when it grows, from the top when it shrinks)
export function rollNum(el, txt, dir = 1) {
  if (!el) return; const ch = [...String(txt)];
  const ok = el._sl && el._sl.length === ch.length && el.firstElementChild && el.firstElementChild.classList.contains('s');
  if (!ok) { el.innerHTML = ch.map(c => `<span class="s"><i>${esc(c)}</i></span>`).join(''); el._sl = [...el.children]; return; }
  ch.forEach((c, k) => {
    const slot = el._sl[k]; let cur = slot.lastElementChild; if (cur.textContent === c) return;
    if (!dir) { slot.innerHTML = `<i>${esc(c)}</i>`; return; }
    slot.getAnimations({ subtree: true }).forEach(a => a.finish());
    cur = slot.lastElementChild;
    const nw = document.createElement('i'); nw.textContent = c; slot.appendChild(nw);
    const o = { duration: 240, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'both' };
    cur.animate([{ transform: 'translateY(0)', opacity: 1 }, { transform: `translateY(${-dir * 110}%)`, opacity: 0 }], o).onfinish = () => cur.remove();
    nw.animate([{ transform: `translateY(${dir * 110}%)`, opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }], o);
  });
}
export const rollBadge = rollNum;

export const loaderHtml = (n = 4) => `<div class="p-skel">${'<i></i>'.repeat(n)}</div>`;
export const msgHtml = (text, err = false) => `<p class="p-msg${err ? ' err' : ''}">${esc(text)}</p>`;
export const emptyHtml = (icon, title, sub = '') => `<div class="p-empty"><h3>${esc(title)}</h3>${sub ? `<p>${esc(sub)}</p>` : ''}</div>`;
export const divider = () => '';
export const ICONKEY = { book: 'b0', file: 'b1', notes: 'b2', audio: 'b3', video: 'b4' };

// big button. With `icon` (book page) it is the slim icon button; without it the roomy centred button (home / syllabus list)
export function boxBtn({ label, sub = '', sub2 = '', href = '#', i = 0, anim = true, icon = '' }) {
  const ik = ICONKEY[icon];
  return `<a class="p-btn${ik ? ' ico' : ''}${anim ? ' rv' : ''}" href="${esc(href)}" style="--i:${Math.min(i, 10)}">${ik ? `<i class="ic">${RI[ik]}</i>` : ''}<span class="tx"><span class="p-t">${esc(label)}</span>${sub ? `<small>${esc(sub)}</small>` : ''}${sub2 ? `<small class="p-sy">${esc(sub2)}</small>` : ''}</span></a>`;
}
export const homeBtnHtml = boxBtn;
export const sectionBtnHtml = boxBtn;
// books are shown in groups (cards with a title band); a group = books sharing the same `grp` text, in order of first appearance
export function groupBooks(items) {
  const out = [], idx = {};
  items.forEach(b => { const k = (b.grp || '').trim(); if (!(k in idx)) { idx[k] = out.length; out.push({ title: k, items: [] }); } out[idx[k]].items.push(b); });
  return out;
}
export const topicMode = (t) => t.mode || (t.link ? 'doc' : 'text');   // text = plain row | page = info card + 5 buttons | doc = text directly | list = card of text rows | parts = card of book-like parts
export const BN_LETTERS = ['ক', 'খ', 'গ', 'ঘ', 'ঙ', 'চ', 'ছ', 'জ', 'ঝ', 'ঞ', 'ট', 'ঠ', 'ড', 'ঢ', 'ণ', 'ত', 'থ', 'দ', 'ধ', 'ন', 'প', 'ফ', 'ব', 'ভ', 'ম', 'য', 'র', 'ল', 'শ', 'ষ', 'স', 'হ'];
export const letterOf = (k) => (BN_LETTERS[k % BN_LETTERS.length] || '') + (k >= BN_LETTERS.length ? n2(Math.floor(k / BN_LETTERS.length) + 1) : '') + ')';
export const totalHtml = (n) => esc(T('bk_total')).replace('{n}', `<b class="p-bd">${n2(n)}</b>`);
export function groupCardHtml({ title = '', rows = [], i = 0, anim = true, tip = '' }) {
  return `<section class="p-gr${anim ? ' rv' : ''}" style="--i:${Math.min(i, 8)}"><h3 class="p-t"><span>${esc(title)}</span><span>${totalHtml(rows.length)}</span></h3>` +
    rows.map(r => { const inner = `<i class="n">${typeof r.n === 'number' ? n2(r.n) : esc(r.n)}</i><span class="tx"><span class="p-t">${esc(r.label)}</span>${r.sy ? `<small class="p-sy">${esc(r.sy)}</small>` : ''}</span>`;
      return `<div class="p-gr-row${r.done ? ' is-done' : ''}${r.href ? '' : ' plain'}" data-id="${esc(r.id)}">${r.href ? `<a class="p-lnk" href="${esc(r.href)}">${inner}</a>` : `<span class="p-lnk">${inner}</span>`}<button type="button" class="p-chk${r.done ? ' on' : ''}" data-chk="${esc(r.id)}" aria-pressed="${!!r.done}" title="${esc(tip)}" aria-label="${esc(tip)}">${RI.tick}</button></div>`; }).join('') + `</section>`;
}
// the book information card ("সংক্ষিপ্ত পরিচিতি"); rows = [[label, value], ...]
export function infoCardHtml(rows) {
  return `<section class="p-card p-info rv"><h3 class="p-t">${esc(T('b_info'))}</h3><div class="rows">${rows.map(([k, v]) => `<div><span>${esc(k)}</span><b><em>${esc(v || '')}</em></b></div>`).join('')}</div></section>`;
}
// rows of the information card for a book / topic page / part: the six fixed ones, then any extra ones the admin added
export function infoRows(b) {
  const base = [['b_name', b.name], ['b_author', b.author], ['b_trans', b.translator], ['b_pub', b.publisher], ['b_pages', b.pages ? toBn(b.pages) + ' ' + T('u_pages') : ''], ['b_price', b.price ? toBn(b.price) + ' ' + T('u_taka') : '']]
    .filter(([k, v], i) => i === 0 || String(v || '').trim()).map(([k, v]) => [T(k), v || '—']);
  const ex = (Array.isArray(b.extra) ? b.extra : []).filter(e => e && e.l && String(e.v || '').trim()).map(e => [e.l, e.v]);
  return base.concat(ex);
}
// small line under a name: "সিলেবাসের অন্তর্ভুক্ত" / "সিলেবাসের অন্তর্ভুক্ত নয়" (chosen by the admin when adding)
export const sylNote = (o) => { const v = o && typeof o.syl === 'string' ? o.syl.trim() : ''; return v === 'in' ? T('sy_in') : v === 'out' ? T('sy_out') : v; };
/* ---------------- site data (settings + home buttons) and editable texts ---------------- */
export const SITE_KEY = 'p_site_v3';
const readCache = () => { try { return JSON.parse(sessionStorage.getItem(SITE_KEY) || 'null'); } catch (e) { return null; } };
async function fetchSite() {
  const d = { s: {}, h: [] };
  try { const s = await getDoc(doc(db, 'settings', 'main')); if (s.exists()) { d.s = s.data(); const ap = autoPalette(d.s); if (ap || (d.s.paletteVer === 3 && d.s.palette)) applyPalette(ap || d.s.palette); } } catch (e) { /* ignore */ }
  try { sessionStorage.setItem(SITE_KEY, JSON.stringify({ t: Date.now(), d })); } catch (e) { /* ignore */ }
  return d;
}
export async function siteData() {
  const c = readCache();
  if (c) { if (Date.now() - c.t > 120000) fetchSite(); return c.d; }
  return fetchSite();
}
export function applyNoteSizes(z) { const r = document.documentElement.style; ['h1', 'h2', 'p'].forEach(k => { const v = z && +z[k]; if (v >= 1 && v <= 20) r.setProperty('--sz-' + k, String(v)); }); }
try { const d = await siteData(); setLabels(d.s && d.s.labels); const ap = autoPalette(d.s); if (ap) applyPalette(ap); applyNoteSizes(d.s && d.s.noteSizes); } catch (e) { /* defaults are used */ }

/* ---------------- links helpers (Drive / YouTube / direct files) ---------------- */
const driveIdOf = (u) => { const m = String(u || '').match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=\w+&)?id=)([\w-]+)/); return m ? m[1] : ''; };
export const driveDl = (u) => { const id = driveIdOf(u); return id ? 'https://drive.google.com/uc?export=download&id=' + id : u; };
const ytIdOf = (u) => { const m = String(u || '').match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/); return m ? m[1] : ''; };
export function mediaEmbed(url, kind) {
  const u = String(url || '').trim(); if (!/^https?:\/\//i.test(u)) return '';
  const e = esc(u), yt = ytIdOf(u), dr = driveIdOf(u);
  if (kind === 'pdf') return `<iframe class="pdf" src="${esc(dr ? 'https://drive.google.com/file/d/' + dr + '/preview' : u)}" title="PDF" loading="lazy"></iframe>`;
  if (kind === 'video') {
    if (yt) return `<iframe class="vid" src="https://www.youtube-nocookie.com/embed/${yt}" title="video" allow="accelerometer; encrypted-media; picture-in-picture; fullscreen" allowfullscreen loading="lazy"></iframe>`;
    if (dr) return `<iframe class="vid" src="https://drive.google.com/file/d/${dr}/preview" title="video" allow="autoplay; fullscreen" allowfullscreen loading="lazy"></iframe>`;
    return `<video controls playsinline preload="metadata" src="${e}"></video>`;
  }
  if (dr) return `<iframe style="height:90px" src="https://drive.google.com/file/d/${dr}/preview" title="audio" loading="lazy"></iframe>`;
  if (yt) return `<iframe class="vid" src="https://www.youtube-nocookie.com/embed/${yt}" title="audio" allow="encrypted-media" loading="lazy"></iframe>`;
  return `<audio controls preload="metadata" src="${e}"></audio>`;
}


/* ---------------- tiny press feedback only (the design has no page-change effects) ---------------- */


/* ---------------- session + activity ---------------- */
export const dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export function streakOf(days = []) {
  const set = new Set(days); let n = 0; const d = new Date();
  if (!set.has(dayKey(d))) d.setDate(d.getDate() - 1);
  while (set.has(dayKey(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
export function ago(ts) {
  if (!ts) return '';
  const s = Math.max(0, (Date.now() - ts) / 1000);
  if (s < 60) return T('ago_now');
  if (s < 3600) return T('ago_min', { n: toBn(Math.floor(s / 60)) });
  if (s < 86400) return T('ago_hr', { n: toBn(Math.floor(s / 3600)) });
  if (s < 86400 * 30) return T('ago_day', { n: toBn(Math.floor(s / 86400)) });
  return fmtDate(ts);
}
export function fmtDate(ts) {
  try { return new Date(ts).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', year: 'numeric' }); } catch (e) { return ''; }
}
export const nameOf = (u, p) => (p && p.name) || (u && (u.displayName || (u.email || '').split('@')[0])) || 'ভাই/বোন';

/* ---- own login system (data lives in Firestore `users`, Firebase Authentication NOT needed) ---- */
const SESSION_KEY = 'isl_uid';
const hex = (buf) => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
const need = () => { if (!(window.crypto && crypto.subtle)) throw Object.assign(new Error('https'), { code: 'no-crypto' }); };
export async function hashPw(pass, salt) {
  need();
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(pass), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: new TextEncoder().encode(salt), iterations: 100000, hash: 'SHA-256' }, key, 256);
  return hex(bits);
}
export async function uidOf(email) {
  need();
  return 'u_' + hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(email).trim().toLowerCase()))).slice(0, 32);
}
const publicUser = (d) => ({ uid: d.uid, email: d.email, displayName: d.name || '', photoURL: '' });
export async function signUp({ name, email, pass }) {
  email = email.trim().toLowerCase();
  const uid = await uidOf(email), ref = doc(db, 'users', uid);
  if ((await getDoc(ref)).exists()) throw Object.assign(new Error('exists'), { code: 'email-exists' });
  const salt = hex(crypto.getRandomValues(new Uint8Array(12))), now = Date.now();
  const d = { uid, name: name.trim(), email, salt, passHash: await hashPw(pass, salt), createdAt: now, lastLoginAt: now, activeDays: [dayKey()] };
  await setDoc(ref, d);
  localStorage.setItem(SESSION_KEY, uid);
  return publicUser(d);
}
export async function signIn(email, pass) {
  email = email.trim().toLowerCase();
  const uid = await uidOf(email), snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) throw Object.assign(new Error('nouser'), { code: 'no-user' });
  const d = snap.data();
  if ((await hashPw(pass, d.salt || '')) !== d.passHash) throw Object.assign(new Error('bad'), { code: 'bad-pass' });
  localStorage.setItem(SESSION_KEY, uid);
  return publicUser(d);
}

export async function requireUser() {
  let uid = null; try { uid = localStorage.getItem(SESSION_KEY); } catch (e) {}
  const goLogin = () => {
    const here = location.pathname.split('/').pop() || 'index.html';
    location.replace('login.html?next=' + encodeURIComponent(here + location.search));
    return new Promise(() => {});
  };
  if (!uid) return goLogin();
  const UK = 'p_user_' + uid;
  const verify = async () => {
    const snap = await getDoc(doc(db, 'users', uid));
    if (!snap.exists()) { try { localStorage.removeItem(SESSION_KEY); sessionStorage.removeItem(UK); } catch (e) {} return null; }
    profileCache = snap.data();
    try { sessionStorage.setItem(UK, JSON.stringify({ t: Date.now(), d: profileCache })); } catch (e) {}
    return profileCache;
  };
  try {
    const c = JSON.parse(sessionStorage.getItem(UK) || 'null');
    if (c && c.d && Date.now() - c.t < 15 * 60000) {           // fast path: no network wait
      profileCache = c.d;
      if (Date.now() - c.t > 60000) verify().then(d => { if (!d) goLogin(); }).catch(() => {});
      return publicUser(profileCache);
    }
  } catch (e) { /* fall through */ }
  try {
    const d = await verify();
    if (!d) return goLogin();
    return publicUser(d);
  } catch (e) { console.warn('session', e); return goLogin(); }
}

let profileCache = null;
export async function touchUser(u) {
  if (!u) return null;
  try {
    const TK = 'p_touch_' + u.uid + '_' + dayKey();
    if (sessionStorage.getItem(TK)) return profileCache;
    const ref = doc(db, 'users', u.uid), today = dayKey(), now = Date.now();
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const d = snap.data(), days = Array.isArray(d.activeDays) ? d.activeDays : [];
    let changed = false;
    if (!days.includes(today)) { days.push(today); d.activeDays = days.slice(-400); changed = true; }
    if (!sessionStorage.getItem('p_seen')) { d.lastLoginAt = now; changed = true; }
    if (changed) await setDoc(ref, { activeDays: d.activeDays, lastLoginAt: d.lastLoginAt }, { merge: true });
    try { sessionStorage.setItem('p_seen', '1'); sessionStorage.setItem(TK, '1'); } catch (e) {}
    profileCache = d;
  } catch (e) { console.warn('profile', e); }
  return profileCache;
}

export async function trackRead(u, note) {
  if (!u || !note) return;
  try {
    const id = u.uid + '_' + note.id, ref = doc(db, 'reads', id), now = Date.now();
    const snap = await getDoc(ref);
    const old = snap.exists() ? snap.data() : {};
    await setDoc(ref, { uid: u.uid, noteId: note.id, name: note.name || '', sectionId: note.sectionId || '', sectionName: note.sectionName || '',
      homeId: note.homeId || '', homeName: note.homeName || '', v: 3, count: (old.count || 0) + 1, firstAt: old.firstAt || now, lastAt: now });
    await setDoc(doc(db, 'users', u.uid), { lastRead: { id: note.id, name: note.name || '', sectionName: note.sectionName || '', at: now } }, { merge: true });
  } catch (e) { console.warn('track', e); }
}

export function logout() { try { localStorage.removeItem(SESSION_KEY); sessionStorage.removeItem('p_seen'); } catch (e) {} location.replace('login.html'); }
export const isLoggedIn = () => { try { return !!localStorage.getItem(SESSION_KEY); } catch (e) { return false; } };

export function avatarHtml(name, photo, cls = '') {
  const ch = esc((name || '?').trim().charAt(0).toUpperCase());
  return `<span class="p-avatar ${cls}">${photo ? `<img src="${esc(photo)}" alt="" referrerpolicy="no-referrer" onerror="this.remove()">` : ''}<em>${ch}</em></span>`;
}


/* ---------- long labels: show 2 lines + "আরো দেখুন" once the text runs past 2.5 lines ---------- */
export function clampAll(root = document) {
  const sel = '.p-btn .p-t';
  const run = () => root.querySelectorAll(sel).forEach((el) => {
    if (el.dataset.cl === 'open') return;
    el.classList.remove('clamp');
    const cs = getComputedStyle(el), lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.3;
    const lines = el.scrollHeight / lh;
    if (lines > 2.55) {
      el.classList.add('clamp'); el.style.setProperty('--lh', lh + 'px');
      if (!el.nextElementSibling || !el.nextElementSibling.classList.contains('p-more')) {
        const m = document.createElement('span'); m.className = 'p-more'; m.setAttribute('role', 'button'); m.tabIndex = 0; m.textContent = T('more');
        el.after(m);
      }
    } else if (el.nextElementSibling && el.nextElementSibling.classList.contains('p-more') && el.dataset.cl !== 'open') el.nextElementSibling.remove();
  });
  if (!root.__clampBound) {
    root.__clampBound = true;
    const toggle = (e) => {
      const m = e.target.closest && e.target.closest('.p-more'); if (!m) return;
      e.preventDefault(); e.stopPropagation();
      const t = m.previousElementSibling, open = t.dataset.cl !== 'open';
      t.dataset.cl = open ? 'open' : ''; t.classList.toggle('clamp', !open); m.textContent = T(open ? 'less' : 'more');
    };
    root.addEventListener('click', toggle, true);
    root.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') toggle(e); });
    let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(run, 150); });
  }
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(run); run();
}

/* ---------- floating "back to the top" button for long reading pages ---------- */
export function scrollTopBtn() {
  if (document.getElementById('pUp')) return;
  const b = document.createElement('button'); b.type = 'button'; b.id = 'pUp'; b.className = 'p-up'; b.setAttribute('aria-label', T('to_top')); b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5l-7.5 8 1.8 1.7L11 9.9V20h2V9.9l4.7 4.8 1.8-1.7z" fill="currentColor"/></svg>';
  b.onclick = () => scrollTo({ top: 0, behavior: 'smooth' });
  document.body.appendChild(b);
  let on = false; const upd = () => { const v = scrollY > 300; if (v !== on) { on = v; b.classList.toggle('show', v); } };
  addEventListener('scroll', upd, { passive: true }); upd();
}

// long one-line texts end with "…"; tapping the dots opens the whole text (tap again to close)
export function markTrunc(root = document) {
  root.querySelectorAll('.p-gr-row .tx, .p-gr > h3').forEach((box) => {
    const t = box.matches('h3') ? box.firstElementChild : box.querySelector('.p-t'); if (!t) return;
    const host = box.closest('.p-gr-row, h3') || box, open = host.classList.contains('open');
    const cut = open || t.scrollWidth > t.clientWidth + 1;
    let d = box.querySelector(':scope > .p-dots');
    if (cut && !d) { d = document.createElement('i'); d.className = 'p-dots'; d.setAttribute('role', 'button'); d.setAttribute('aria-label', T('more')); box.appendChild(d); }
    else if (!cut && d) d.remove();
    if (d) d.textContent = open ? '▲' : '';
  });
  if (!window._dotsOn) {
    window._dotsOn = true;
    document.addEventListener('click', (e) => {
      const d = e.target.closest && e.target.closest('.p-dots'); if (!d) return;
      e.preventDefault(); e.stopPropagation();
      const host = d.closest('.p-gr-row') || d.closest('h3'); host.classList.toggle('open'); markTrunc(host.closest('.p-gr') || document);
    }, true);
  }
}
