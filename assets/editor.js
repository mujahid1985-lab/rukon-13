// Simple note editor (admin): 3 styles (big title / small title / paragraph), bold/italic/underline, align, lists.
// Whatever is pasted is cleaned: only structure stays, the font is always the site's font.
import { esc, simpleHtml, textToSimple } from './islamic.js';

const bt = (a, ic, lbl, cls = '') => `<button type="button" data-a="${a}" class="ed-tbb ${cls}" title="${esc(lbl)}"><i class="fa-solid fa-${ic}"></i><span>${lbl}</span></button>`;
const b = (a, ic, t, lbl = '') => `<button type="button" data-a="${a}" title="${esc(t)}" aria-label="${esc(t)}">${ic ? `<i class="fa-solid fa-${ic}"></i>` : ''}${lbl ? `<span>${lbl}</span>` : ''}</button>`;

export function createEditor(host, { placeholder = 'এখানে লেখা পেস্ট করুন বা লিখুন...', minHeight = 320, onSave = null, getSizes = null, saveSizes = null } = {}) {
  host.classList.add('ed');
  host.innerHTML = `<div class="ed-bar">
    <div class="ed-grp" data-grp="block">${b('h1', '', 'প্রধান শিরোনাম (সূচিপত্রে বড়)', 'বড় শিরোনাম')}${b('h2', '', 'উপ-শিরোনাম (সূচিপত্রে ছোট)', 'ছোট শিরোনাম')}${b('p', '', 'সাধারণ লেখা', 'প্যারাগ্রাফ')}</div>
    <div class="ed-grp">${b('bold', 'bold', 'বোল্ড')}${b('italic', 'italic', 'ইটালিক')}${b('underline', 'underline', 'আন্ডারলাইন')}</div>
    <div class="ed-grp">${b('justifyLeft', 'align-left', 'বামে')}${b('justifyCenter', 'align-center', 'মাঝে')}${b('justifyRight', 'align-right', 'ডানে')}${b('justifyFull', 'align-justify', 'দুই পাশে সমান')}</div>
    <div class="ed-grp">${b('insertUnorderedList', 'list-ul', 'বুলেট লিস্ট')}${b('insertOrderedList', 'list-ol', 'নম্বর লিস্ট')}</div>
    <div class="ed-grp"><label class="ed-f" title="নির্বাচিত লেখার সাইজ (১-২০)">সাইজ <input type="number" min="1" max="20" data-r="size" placeholder="—"></label><label class="ed-f" title="নির্বাচিত লেখার রং">রং <input type="color" data-r="color" value="#0c2b35"></label>${b('removeFormat', 'eraser', 'সাইজ, রং, বোল্ড ইত্যাদি মুছুন')}</div>
    <div class="ed-grp">${b('table', 'table-columns', 'টেবিল / কলাম', 'কলাম')}</div>
    <div class="ed-grp">${b('undo', 'rotate-left', 'আনডু')}${b('redo', 'rotate-right', 'রিডু')}</div>
    <div class="ed-grp">${b('sizes', 'sliders', 'ডিফল্ট সাইজ ঠিক করুন', 'ডিফল্ট সাইজ')}</div>
  </div>
  <div class="ed-pop" hidden><div class="ed-pop-t">কলাম ও সারি বেছে নিন: <b data-x="lbl">—</b></div><div class="ed-grid"></div></div>
  <div class="ed-tb" hidden>
    <div class="ed-tbg"><div class="ed-tbg-t">কলাম</div><div class="ed-tbg-b">${bt('colL', 'arrow-left', 'বামে যোগ')}${bt('colR', 'arrow-right', 'ডানে যোগ')}${bt('colDel', 'xmark', 'মুছুন', 'bad')}</div><div class="ed-tbg-b"><span class="ed-seg">${bt('alL', 'align-left', 'বাম')}${bt('alC', 'align-center', 'মাঝ')}${bt('alR', 'align-right', 'ডান')}</span><label class="ed-f" title="এই কলামের প্রস্থ (%)">প্রস্থ <input type="number" min="5" max="95" data-r="w" placeholder="%"></label></div></div>
    <div class="ed-tbg"><div class="ed-tbg-t">সারি</div><div class="ed-tbg-b">${bt('rowU', 'arrow-up', 'উপরে যোগ')}${bt('rowD', 'arrow-down', 'নিচে যোগ')}${bt('rowDel', 'xmark', 'মুছুন', 'bad')}</div></div>
    <div class="ed-tbg"><div class="ed-tbg-t">টেবিল</div><div class="ed-tbg-b">${bt('tbBd', 'border-all', 'বর্ডার চালু/বন্ধ')}${bt('tbDel', 'trash', 'টেবিল মুছুন', 'bad')}</div></div>
  </div>
  <div class="ed-sizes" hidden><span>স্বয়ংক্রিয় সাইজ (১-২০):</span><label>বড় শিরোনাম <input type="number" min="1" max="20" data-z="h1"></label><label>ছোট শিরোনাম <input type="number" min="1" max="20" data-z="h2"></label><label>প্যারাগ্রাফ <input type="number" min="1" max="20" data-z="p"></label><button type="button" class="ed-save" data-a="saveSizes"><i class="fa-solid fa-floppy-disk"></i> সেভ</button></div>
  <div class="ed-area is-empty" contenteditable="true" spellcheck="false" lang="bn" role="textbox" aria-multiline="true" data-ph="${esc(placeholder)}" style="min-height:${minHeight}px"></div>`;
  const area = host.querySelector('.ed-area'), bar = host.querySelector('.ed-bar');
  const sync = () => area.classList.toggle('is-empty', !area.textContent.trim() && !area.querySelector('ul,ol,table'));
  const norm = () => { document.execCommand('defaultParagraphSeparator', false, 'p'); };
  const refresh = () => {
    let blk = ''; try { blk = (document.queryCommandValue('formatBlock') || '').toLowerCase(); } catch (e) { /* ignore */ }
    const inside = area.contains(getSelection().anchorNode);
    bar.querySelectorAll('[data-grp=block] button').forEach(x => x.classList.toggle('on', inside && (x.dataset.a === blk || (x.dataset.a === 'p' && !/^h[12]$/.test(blk)))));
    ['bold', 'italic', 'underline', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'insertUnorderedList', 'insertOrderedList'].forEach(c => { const x = bar.querySelector(`[data-a=${c}]`); let on = false; try { on = inside && document.queryCommandState(c); } catch (e) { /* ignore */ } x.classList.toggle('on', !!on); });
  };
  bar.addEventListener('mousedown', (e) => { if (e.target.closest('button')) e.preventDefault(); });
  const szp = host.querySelector('.ed-sizes');
  [bar, szp].forEach(el => el.addEventListener('click', (e) => {
    const x = e.target.closest('button'); if (!x) return; area.focus({ preventScroll: true }); norm();
    const a = x.dataset.a;
    if (a === 'table') { pop.hidden = !pop.hidden; if (!pop.hidden) buildGrid(); return; }
    if (a === 'sizes') { const p = host.querySelector('.ed-sizes'); p.hidden = !p.hidden; const z = (getSizes && getSizes()) || {}; p.querySelectorAll('[data-z]').forEach(i => { i.value = z[i.dataset.z] || ''; }); return; }
    if (a === 'saveSizes') { const z = {}; host.querySelectorAll('.ed-sizes [data-z]').forEach(i => { const v = Math.round(+i.value); z[i.dataset.z] = v >= 1 && v <= 20 ? v : null; }); if (saveSizes) saveSizes(z); return; }
    if (a === 'removeFormat') { document.execCommand('removeFormat', false, null); const sel = getSelection(); area.querySelectorAll('span[data-sz],span[style]').forEach(sp => { if (sel.containsNode(sp, true)) { while (sp.firstChild) sp.parentNode.insertBefore(sp.firstChild, sp); sp.remove(); } }); sync(); refresh(); return; }
    if (a === 'h1' || a === 'h2' || a === 'p') document.execCommand('formatBlock', false, a.toUpperCase()); else document.execCommand(a, false, null);
    sync(); refresh();
  }));
  let rng = null;
  document.addEventListener('selectionchange', () => { const sl = getSelection(); if (sl.rangeCount && area.contains(sl.anchorNode)) rng = sl.getRangeAt(0).cloneRange(); });
  const restore = () => { area.focus({ preventScroll: true }); if (rng) { const sl = getSelection(); sl.removeAllRanges(); sl.addRange(rng); } };
  const applySize = (n) => {
    restore(); if (getSelection().isCollapsed) return; norm();
    document.execCommand('styleWithCSS', false, false); document.execCommand('fontSize', false, '7');
    area.querySelectorAll('font[size="7"]').forEach(f => { const sp = document.createElement('span'); sp.setAttribute('data-sz', String(n)); while (f.firstChild) sp.appendChild(f.firstChild); f.replaceWith(sp); });
    area.querySelectorAll('span[data-sz] span[data-sz]').forEach(inner => { const o = inner.parentNode; if (o.childNodes.length === 1) { o.setAttribute('data-sz', inner.getAttribute('data-sz')); while (inner.firstChild) o.insertBefore(inner.firstChild, inner); inner.remove(); } });
    sync();
  };
  const sizeIn = host.querySelector('[data-r=size]'), colIn = host.querySelector('[data-r=color]');
  sizeIn.addEventListener('change', () => { const n = Math.round(+sizeIn.value); if (n >= 1 && n <= 20) applySize(n); });
  colIn.addEventListener('input', () => { restore(); if (getSelection().isCollapsed) return; document.execCommand('styleWithCSS', false, true); document.execCommand('foreColor', false, colIn.value); sync(); });
  /* ---- table / columns ---- */
  const pop = host.querySelector('.ed-pop'), tbBar = host.querySelector('.ed-tb'), gridEl = pop.querySelector('.ed-grid'), lbl = pop.querySelector('[data-x=lbl]');
  const toBn = (n) => String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[d]);
  let cell = null;
  const cellOf = () => { const n = getSelection().anchorNode, el = n && (n.nodeType === 1 ? n : n.parentElement); const c = el && el.closest ? el.closest('td') : null; return c && area.contains(c) ? c : null; };
  const colIdx = (td) => [...td.parentElement.children].indexOf(td);
  const showTb = () => { const c = cellOf(); if (c) cell = c; tbBar.hidden = !c; if (c) { const w = tbBar.querySelector('[data-r=w]'), top = c.closest('table').rows[0].cells[colIdx(c)], m = /width\s*:\s*(\d+)/.exec((top && top.getAttribute('style')) || ''); w.value = m ? m[1] : ''; } };
  let gcols = 8; const GROWS = 6;
  const buildGrid = () => { const w = Math.max(160, pop.clientWidth - 28); gcols = Math.max(4, Math.min(24, Math.floor(w / 34))); gridEl.style.gridTemplateColumns = 'repeat(' + gcols + ', 1fr)'; gridEl.innerHTML = Array.from({ length: gcols * GROWS }, (_, i) => `<i data-c="${(i % gcols) + 1}" data-r="${Math.floor(i / gcols) + 1}"></i>`).join(''); lbl.textContent = '—'; };
  gridEl.addEventListener('mouseover', (e) => { const i = e.target.closest('i'); if (!i) return; const c = +i.dataset.c, r = +i.dataset.r; gridEl.querySelectorAll('i').forEach((x) => x.classList.toggle('on', +x.dataset.c <= c && +x.dataset.r <= r)); lbl.textContent = toBn(c) + ' কলাম × ' + toBn(r) + ' সারি'; });
  window.addEventListener('resize', () => { if (!pop.hidden) buildGrid(); });
  gridEl.addEventListener('mousedown', (e) => e.preventDefault());
  gridEl.addEventListener('click', (e) => {
    const i = e.target.closest('i'); if (!i) return; restore(); norm();
    const c = +i.dataset.c, r = +i.dataset.r, row = '<tr>' + '<td><br></td>'.repeat(c) + '</tr>';
    document.execCommand('insertHTML', false, '<table data-b="1" data-new="1"><tbody>' + row.repeat(r) + '</tbody></table><p><br></p>'); pop.hidden = true;
    const nt = area.querySelector('table[data-new]'); if (nt) { nt.removeAttribute('data-new'); const c0 = nt.rows[0].cells[0], rg = document.createRange(); rg.selectNodeContents(c0); rg.collapse(true); const sl = getSelection(); sl.removeAllRanges(); sl.addRange(rg); }
    sync(); showTb();
  });
  const tbAct = (a) => {
    const td = cell && area.contains(cell) ? cell : cellOf(); if (!td) return; const tb = td.closest('table'), ix = colIdx(td);
    const mkc = () => { const c = document.createElement('td'); c.innerHTML = '<br>'; return c; };
    if (a === 'colL' || a === 'colR') [...tb.rows].forEach((r) => r.insertBefore(mkc(), r.cells[ix + (a === 'colR' ? 1 : 0)] || null));
    else if (a === 'colDel') { if (tb.rows[0].cells.length <= 1) tb.remove(); else [...tb.rows].forEach((r) => r.cells[ix] && r.cells[ix].remove()); }
    else if (a === 'rowU' || a === 'rowD') { const r = document.createElement('tr'); for (let k = 0; k < td.parentElement.cells.length; k++) r.appendChild(mkc()); td.parentElement.insertAdjacentElement(a === 'rowU' ? 'beforebegin' : 'afterend', r); }
    else if (a === 'rowDel') { if (tb.rows.length <= 1) tb.remove(); else td.parentElement.remove(); }
    else if (a === 'alL' || a === 'alC' || a === 'alR') [...tb.rows].forEach((r) => { const c = r.cells[ix]; if (c) c.style.textAlign = a === 'alL' ? '' : a === 'alC' ? 'center' : 'right'; });
    else if (a === 'tbBd') tb.setAttribute('data-b', tb.getAttribute('data-b') === '0' ? '1' : '0');
    else if (a === 'tbDel') tb.remove();
    sync(); showTb();
  };
  tbBar.addEventListener('mousedown', (e) => { if (e.target.closest('button')) e.preventDefault(); });
  tbBar.addEventListener('click', (e) => { const x = e.target.closest('button'); if (x) tbAct(x.dataset.a); });
  tbBar.querySelector('[data-r=w]').addEventListener('change', (e) => { const td = cell; if (!td) return; const ix = colIdx(td), v = Math.round(+e.target.value); [...td.closest('table').rows].forEach((r) => { const c = r.cells[ix]; if (c) c.style.width = v >= 5 && v <= 95 ? v + '%' : ''; }); });
  document.addEventListener('selectionchange', () => { if (area.contains(getSelection().anchorNode)) showTb(); });
  area.addEventListener('input', sync);
  document.addEventListener('selectionchange', () => { if (area.contains(getSelection().anchorNode)) refresh(); });
  area.addEventListener('keydown', (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); if (onSave) onSave(); } });
  area.addEventListener('paste', (e) => {
    e.preventDefault(); norm();
    const cd = e.clipboardData, h = cd.getData('text/html'), t = cd.getData('text/plain');
    const clean = h ? simpleHtml(h, { paste: true }) : textToSimple(t);
    document.execCommand('insertHTML', false, clean || textToSimple(t)); sync();
  });
  area.addEventListener('drop', (e) => e.preventDefault());
  const cur = () => simpleHtml(area.innerHTML);
  return {
    getHtml() { return area.textContent.trim() || area.querySelector('ul,ol,table') ? cur() : ''; },
    getText() { return (area.innerText || area.textContent || '').trim(); },
    setHtml(h) { area.innerHTML = simpleHtml(h); sync(); },
    clear() { area.innerHTML = ''; sync(); },
    setKey() {}, markSaved() {}, focus() { area.focus(); }
  };
}
