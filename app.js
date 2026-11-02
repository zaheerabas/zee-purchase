(() => {
"use strict";
/* ================= helpers ================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const n = v => { const x = parseFloat(String(v ?? "").replace(/,/g, "")); return isFinite(x) ? x : 0; };
const rs = v => (n(v) < 0 ? "− " : "") + "Rs " + Math.round(Math.abs(n(v))).toLocaleString("en-PK");
const num = v => (Math.round(n(v) * 100) / 100).toLocaleString("en-PK", { maximumFractionDigits: 2 });
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const today = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); };
const thisMonth = () => today().slice(0, 7);
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_L = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const fmtDate = d => { if (!d) return ""; const [y, m, dd] = d.split("-"); return `${+dd} ${MONTHS[+m - 1]} ${y}`; };
const fmtMonth = (m, long) => { const [y, mm] = m.split("-"); return `${(long ? MONTHS_L : MONTHS)[+mm - 1]} ${y}`; };
const ago = t => { if (!t) return "never"; const s = (Date.now() - t) / 1000; if (s < 60) return "just now"; if (s < 3600) return Math.floor(s / 60) + " min ago"; if (s < 86400) return Math.floor(s / 3600) + " h ago"; return new Date(t).toLocaleString(); };
const DEFAULT_CATS = ["Abaya", "Hijab", "Scarf", "Niqab", "Cap", "Gown", "Fabric", "Accessories", "Other"];
const METHODS = ["Cash", "Bank transfer", "JazzCash", "Easypaisa", "Cheque", "Through cargo agent"];
const AV = [["var(--brand-soft)", "var(--brand)"], ["var(--gold-soft)", "var(--gold)"], ["var(--green-soft)", "var(--green)"], ["var(--red-soft)", "var(--red)"]];
const initials = s => (s || "?").split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase();
const avatar = (id, name, big) => { let h = 0; for (const c of id || "") h = (h * 31 + c.charCodeAt(0)) >>> 0; const [b, f] = AV[h % AV.length]; return `<span class="av${big ? " big" : ""}" style="background:${b};color:${f}">${esc(initials(name))}</span>`; };
const ls = { get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } } };
const I = {
  bill: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/></svg>',
  cam: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
  pay: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/></svg>',
  shop: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9 5 4h14l2 5"/><path d="M4 9v11h16V9"/><path d="M3 9h18"/></svg>',
  chart: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 20V11M10 20V5M16 20v-6M21 20H3"/></svg>',
  search: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  x: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  trash: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
  edit: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg>',
  dl: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>',
  spark: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/></svg>',
  mic: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',
  stop: '<svg class="i" viewBox="0 0 24 24" fill="currentColor"><rect x="7" y="7" width="10" height="10" rx="2"/></svg>',
  sun: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"/></svg>',
  moon: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>',
  auto: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/></svg>',
  cloud: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 18a5 5 0 1 1 1-9.9A6 6 0 0 1 19.5 10 4 4 0 0 1 18 18z"/></svg>',
};

function toast(msg) {
  const r = $("#toastRoot"); r.innerHTML = `<div class="toast" role="status">${esc(msg)}</div>`;
  clearTimeout(toast.t); toast.t = setTimeout(() => r.innerHTML = "", 3000);
}
function ask(title, msg, ok = "Delete", danger = true) {
  return new Promise(res => {
    const root = $("#dlgRoot");
    root.innerHTML = `<div class="dlg-bg"><div class="dlg" role="alertdialog" aria-modal="true" aria-labelledby="dlgT"><h3 id="dlgT">${esc(title)}</h3><p>${esc(msg)}</p>
      <div class="row"><button class="btn" data-d="0">Keep</button><button class="btn ${danger ? "danger" : "pri"}" data-d="1">${esc(ok)}</button></div></div></div>`;
    const done = v => { root.innerHTML = ""; document.removeEventListener("keydown", key, true); res(v); };
    const key = e => { if (e.key === "Escape") { e.stopPropagation(); done(false); } };
    document.addEventListener("keydown", key, true);
    root.querySelector(".dlg-bg").addEventListener("click", e => { const b = e.target.closest("[data-d]"); if (b) done(b.dataset.d === "1"); else if (e.target.classList.contains("dlg-bg")) done(false); });
    root.querySelector("[data-d='1']").focus();
  });
}

/* ================= tiny IndexedDB store for photos ================= */
const idb = (() => {
  let dbp;
  const open = () => dbp || (dbp = new Promise((res, rej) => { const r = indexedDB.open("zee", 1); r.onupgradeneeded = () => r.result.createObjectStore("kv"); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }));
  const run = (mode, fn) => open().then(db => new Promise((res, rej) => { const t = db.transaction("kv", mode); const req = fn(t.objectStore("kv")); t.oncomplete = () => res(req && req.result); t.onerror = () => rej(t.error); }));
  return { get: k => run("readonly", s => s.get(k)).catch(() => null), set: (k, v) => run("readwrite", s => s.put(v, k)), del: k => run("readwrite", s => s.delete(k)).catch(() => null) };
})();

/* ================= theme ================= */
const THEMES = ["auto", "light", "dark"];
let theme = ls.get("zee-theme", "auto");
function applyTheme() {
  if (theme === "auto") document.documentElement.removeAttribute("data-theme"); else document.documentElement.setAttribute("data-theme", theme);
  $$(".th-ic").forEach(e => e.innerHTML = I[theme === "auto" ? "auto" : theme === "light" ? "sun" : "moon"]);
  $$(".th-lbl").forEach(e => e.textContent = theme === "auto" ? "Theme: follows device" : theme === "light" ? "Theme: light" : "Theme: dark");
  const dark = theme === "dark" || (theme === "auto" && matchMedia("(prefers-color-scheme: dark)").matches);
  $("meta[name=theme-color]").setAttribute("content", dark ? "#1e1721" : "#5e2750");
}
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyTheme);

/* ================= config, cache, outbox, sync ================= */
let cfg = ls.get("zee-config", null); // {mode:'cloud'|'local', url, pin, voiceLang}
const state = { suppliers: {}, bills: {}, payments: {}, outbox: [], lastSync: 0, syncing: false, netErr: false, authErr: false, ai: null };
function loadCache() { const c = ls.get("zee-cache", {}); ["suppliers", "bills", "payments"].forEach(k => state[k] = c[k] || {}); state.outbox = ls.get("zee-outbox", []); state.lastSync = c.lastSync || 0; state.ai = c.ai ?? null; }
function saveCache() {
  const ok = ls.set("zee-cache", { suppliers: state.suppliers, bills: state.bills, payments: state.payments, lastSync: state.lastSync, ai: state.ai }) && ls.set("zee-outbox", state.outbox);
  if (!ok) toast("Phone storage is full. Connect to the internet so changes can sync.");
}

async function api(action, payload = {}, timeout = 45000) {
  if (!cfg || cfg.mode !== "cloud") { const e = new Error("Not connected to the online backend."); e.code = "local"; throw e; }
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), timeout);
  try {
    const res = await fetch(cfg.url, { method: "POST", body: JSON.stringify({ ...payload, action, pin: cfg.pin }), signal: ctl.signal, redirect: "follow" });
    let d; try { d = await res.json(); } catch { const e = new Error("The backend link did not answer properly. Check the Web app URL."); e.code = "bad_url"; throw e; }
    if (!d.ok) { const e = new Error(d.message || d.error); e.code = d.error; throw e; }
    return d.data;
  } catch (e) { if (!e.code) { e.code = "network"; e.message = "No connection to the backend."; } throw e; }
  finally { clearTimeout(t); }
}

function applyLocal(op) { if (op.kind === "save") state[op.col][op.obj.id] = op.obj; else delete state[op.col][op.docId]; }
function commit(op) {
  op.opId = uid(); applyLocal(op);
  if (cfg.mode === "cloud") state.outbox.push(op);
  saveCache(); updateSync();
  if (cfg.mode === "cloud") flush();
}
let flushing = null;
function flush() {
  if (flushing || !cfg || cfg.mode !== "cloud") return flushing;
  const run = async () => {
    {
      while (state.outbox.length) {
        const op = state.outbox[0];
        try {
          if (op.kind === "save" && op.col === "bills" && op.obj.localPhoto) {
            const data = await idb.get(op.obj.localPhoto);
            if (data) {
              const r = await api("uploadPhoto", { data, name: `bill-${op.obj.date || ""}-${op.obj.id}.jpg` }, 90000);
              await idb.set("photo:" + r.id, data); await idb.del(op.obj.localPhoto);
              const key = op.obj.localPhoto;
              state.outbox.forEach(o => { if (o.obj && o.obj.localPhoto === key) { o.obj.photoId = r.id; delete o.obj.localPhoto; } });
              const cur = state.bills[op.obj.id]; if (cur && cur.localPhoto === key) { cur.photoId = r.id; delete cur.localPhoto; }
            } else delete op.obj.localPhoto;
            saveCache();
          }
          if (op.kind === "save") await api("save", { col: op.col, obj: op.obj }); else await api("delete", { col: op.col, id: op.docId });
          state.outbox.shift(); state.netErr = false; saveCache(); updateSync();
        } catch (e) {
          if (["network", "busy", "bad_url"].includes(e.code)) { state.netErr = true; break; }
          if (["bad_pin", "locked", "not_setup"].includes(e.code)) { state.authErr = e.message; break; }
          toast("One change couldn't be saved online: " + e.message);
          state.outbox.shift(); saveCache();
        }
      }
    }
  };
  flushing = run().finally(() => { flushing = null; updateSync(); });
  updateSync();
  return flushing;
}
async function sync(manual) {
  if (!cfg || cfg.mode !== "cloud" || state.syncing) return;
  state.syncing = true; updateSync();
  try {
    await flush();
    if (state.outbox.length) { const e = new Error(state.authErr || "offline"); e.code = state.authErr ? "bad_pin" : "network"; throw e; }
    const d = await api("all", {}, 60000);
    ["suppliers", "bills", "payments"].forEach(c => { const m = {}; (d[c] || []).forEach(o => { m[o.id] = o; }); state[c] = m; });
    state.lastSync = Date.now(); state.netErr = false; state.authErr = false; saveCache();
    render(); refreshSheet();
    if (manual) toast("Everything is up to date");
  } catch (e) {
    if (["bad_pin", "locked", "not_setup"].includes(e.code)) { state.authErr = e.message; toast(e.message + " Check Settings."); }
    else { state.netErr = true; if (manual) toast("No connection. Your changes are safe on this device and will sync later."); }
  } finally { state.syncing = false; updateSync(); }
}
function updateSync() {
  const p = $("#syncPill"); if (!p) return;
  let cls = "", txt = "Synced";
  if (!cfg) { p.classList.add("hidden"); return; }
  p.classList.remove("hidden");
  if (cfg.mode === "local") { cls = "off"; txt = "This device only"; }
  else if (state.authErr) { cls = "err"; txt = "PIN problem"; }
  else if (state.syncing || flushing) { cls = "busy wait"; txt = "Syncing…"; }
  else if (state.outbox.length) { cls = "wait"; txt = `${state.outbox.length} waiting`; }
  else if (state.netErr || !navigator.onLine) { cls = "off"; txt = "Offline"; }
  p.className = "syncpill " + cls; p.innerHTML = `<i></i>${txt}`;
}

/* ================= photos ================= */
async function compress(file, max = 1400, q = .7) {
  const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = URL.createObjectURL(file); });
  const s = Math.min(1, max / Math.max(img.width, img.height));
  const c = document.createElement("canvas"); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
  c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
  return c.toDataURL("image/jpeg", q);
}
async function photoSrc(bill) {
  if (bill.localPhoto) return await idb.get(bill.localPhoto);
  if (!bill.photoId) return null;
  const cached = await idb.get("photo:" + bill.photoId); if (cached) return cached;
  try { const r = await api("getPhoto", { id: bill.photoId }, 60000); await idb.set("photo:" + bill.photoId, r.data); return r.data; } catch { return null; }
}

/* ================= derived numbers ================= */
const billSub = b => (b.items || []).reduce((t, i) => t + n(i.qty) * n(i.rate), 0);
const billNet = b => billSub(b) - n(b.discount);
const billPcs = b => (b.items || []).reduce((t, i) => t + n(i.qty), 0);
const sup = id => state.suppliers[id] || { id: "", name: "Unknown supplier", city: "" };
const billsArr = () => Object.values(state.bills).sort((a, b) => (b.date || "").localeCompare(a.date || "") || (b.createdAt || 0) - (a.createdAt || 0));
function supplierBalance(id) {
  const s = state.suppliers[id]; let bal = n(s && s.opening);
  Object.values(state.bills).forEach(b => { if (b.supplierId === id) bal += billNet(b) - n(b.paid); });
  Object.values(state.payments).forEach(p => { if (p.supplierId === id) bal -= n(p.amount); });
  return bal;
}
function supplierLedger(id) {
  const s = state.suppliers[id]; const rows = [];
  Object.values(state.bills).filter(b => b.supplierId === id).forEach(b => {
    rows.push({ date: b.date, kind: "bill", ref: b, text: `Bill${b.invoiceNo ? " #" + b.invoiceNo : ""}`, sub: `${num(billPcs(b))} pcs`, debit: billNet(b), credit: 0, t: b.createdAt || 0 });
    if (n(b.paid) > 0) rows.push({ date: b.date, kind: "billpay", ref: b, text: "Paid with bill", sub: b.payMethod || "Cash", debit: 0, credit: n(b.paid), t: (b.createdAt || 0) + 1 });
  });
  Object.values(state.payments).filter(p => p.supplierId === id).forEach(p =>
    rows.push({ date: p.date, kind: "payment", ref: p, text: "Payment", sub: (p.method || "Cash") + (p.note ? " · " + p.note : ""), debit: 0, credit: n(p.amount), t: p.createdAt || 0 }));
  rows.sort((a, b) => (a.date || "").localeCompare(b.date || "") || a.t - b.t);
  let bal = n(s && s.opening); rows.forEach(r => { bal += r.debit - r.credit; r.bal = bal; });
  return rows;
}
const allCats = () => [...new Set([...DEFAULT_CATS, ...Object.values(state.bills).flatMap(b => (b.items || []).map(i => i.category).filter(Boolean))])];
const allItems = () => [...new Set(Object.values(state.bills).flatMap(b => (b.items || []).map(i => (i.name || "").trim()).filter(Boolean)))].sort();
const allCities = () => [...new Set(["Lahore", "Gujranwala", "Faisalabad", "Karachi", "Sialkot", ...Object.values(state.suppliers).map(s => s.city).filter(Boolean)])];
const lastRate = name => { const k = (name || "").trim().toLowerCase(); if (!k) return null; for (const b of billsArr()) for (const i of b.items || []) if ((i.name || "").trim().toLowerCase() === k) return { rate: i.rate, category: i.category, name: i.name }; return null; };
// learn from saved bills: match a read/spoken item to a known item name
function matchItem(name) {
  const k = (name || "").trim().toLowerCase(); if (!k) return null;
  const items = allItems(); const exact = items.find(i => i.toLowerCase() === k); if (exact) return exact;
  const code = k.match(/^[a-z]?\d{2,}/); if (code) { const c = items.find(i => i.toLowerCase().startsWith(code[0] + " ") || i.toLowerCase() === code[0]); if (c) return c; }
  return items.find(i => i.toLowerCase().includes(k) || k.includes(i.toLowerCase())) || null;
}
function matchSupplier(name, id) {
  if (id && state.suppliers[id]) return state.suppliers[id];
  const low = (name || "").trim().toLowerCase(); if (!low) return null;
  return Object.values(state.suppliers).find(s => { const sn = s.name.toLowerCase(); return sn === low || low.includes(sn) || sn.includes(low); }) || null;
}

/* ================= routing & render ================= */
const TABS = ["home", "bills", "suppliers", "reports", "settings"];
const ui = { billQ: "", billMonth: "", repMonth: thisMonth(), repMode: "month", rateQ: "", supQ: "", supFilter: "all" };
const tab = () => { const h = location.hash.replace("#", ""); return TABS.includes(h) ? h : "home"; };
window.addEventListener("hashchange", () => { render(); window.scrollTo(0, 0); });

function render() {
  const t = tab();
  $$("[data-tab]").forEach(a => { a.classList.toggle("on", a.dataset.tab === t); if (a.dataset.tab === t) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
  document.body.classList.toggle("nocfg", !cfg);
  $$(".needcfg").forEach(e => e.classList.toggle("hidden", !cfg));
  const ae = document.activeElement, focusId = ae && ae.id, pos = ae && ae.selectionStart;
  $("#app").innerHTML = !cfg ? viewSetup() : ({ home: viewHome, bills: viewBills, suppliers: viewSuppliers, reports: viewReports, settings: viewSettings }[t])();
  if (focusId && !$("#sheetRoot").innerHTML) { const el = document.getElementById(focusId); if (el) { el.focus(); try { el.setSelectionRange(pos, pos); } catch { } } }
  updateSync();
}

/* ================= views ================= */
const emptyBox = (icon, title, text, btn) => `<div class="empty"><div class="ei">${I[icon]}</div><b>${title}</b>${text}${btn || ""}</div>`;
const newBillBtn = label => `<br><button class="btn pri" data-act="new-bill">${label || "Add first bill"}</button>`;

function viewSetup() {
  const saved = ls.get("zee-config-draft", {});
  return `<div class="setup">
    <span class="mark">Z</span>
    <h1>Zee Collection</h1>
    <p class="muted" style="margin:0">Purchase book for bills from Lahore, Gujranwala and every other market.</p>
    <div class="card pad">
      <h2 style="margin-bottom:4px">Connect to the shop's Google account</h2>
      <p class="muted small" style="margin:0 0 14px">Paste the Web app link from the setup guide and the shop PIN. Bills then sync between every phone and laptop.</p>
      <div class="stack">
        <label class="field"><span>Web app link</span><input type="url" id="cfgUrl" value="${esc(saved.url || "")}" placeholder="https://script.google.com/macros/s/…/exec" autocomplete="off"></label>
        <label class="field"><span>PIN</span><input type="password" id="cfgPin" inputmode="numeric" value="" placeholder="••••" autocomplete="current-password"></label>
        <button class="btn pri block" data-act="connect">${I.cloud}Connect</button>
      </div>
      <div class="or">or</div>
      <button class="btn block" data-act="local-mode">Try it on this device only</button>
      <p class="muted small" style="margin:10px 0 0">Device-only mode keeps bills in this browser. You can connect later and upload them.</p>
    </div>
  </div>`;
}

function billRow(b) {
  const s = sup(b.supplierId), due = billNet(b) - n(b.paid);
  return `<button class="li" data-act="open-bill" data-id="${esc(b.id)}">${avatar(s.id, s.name)}
    <div class="main"><div class="t">${esc(s.name)}</div>
    <div class="s">${fmtDate(b.date)}${s.city ? " · " + esc(s.city) : ""} · ${num(billPcs(b))} pcs</div></div>
    <div class="amt">${rs(billNet(b))}${due > 0.5 ? `<small style="color:var(--red)">${rs(due)} due</small>` : `<small style="color:var(--green)">Paid</small>`}</div></button>`;
}

function viewHome() {
  const m = thisMonth(); const mb = billsArr().filter(b => (b.date || "").startsWith(m));
  const total = mb.reduce((t, b) => t + billNet(b), 0), pcs = mb.reduce((t, b) => t + billPcs(b), 0);
  const prevM = (() => { const [y, mm] = m.split("-").map(Number); const d = new Date(y, mm - 2, 1); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; })();
  const prev = billsArr().filter(b => (b.date || "").startsWith(prevM)).reduce((t, b) => t + billNet(b), 0);
  const payable = Object.keys(state.suppliers).reduce((t, id) => t + Math.max(0, supplierBalance(id)), 0);
  const recent = billsArr().slice(0, 6);
  const owing = Object.values(state.suppliers).map(s => ({ s, bal: supplierBalance(s.id) })).filter(x => x.bal > 0.5).sort((a, b) => b.bal - a.bal).slice(0, 5);
  return `${installPrompt && !ls.get("zee-install-dismissed", false) ? `<div class="installbar"><span class="qi" style="color:var(--gold)">${I.dl}</span><div class="t"><b>Install the app</b><br>Open it from your home screen, even without internet.</div><button class="btn sm pri" data-act="install">Install</button><button class="iconbtn" style="border:0;width:32px;height:32px" data-act="install-dismiss" aria-label="Not now">${I.x}</button></div>` : ""}
  <div class="ph"><div class="grow"><h1>${fmtMonth(m, true)}</h1><p>Everything bought for the shop this month.</p></div></div>
  <div class="figs">
    <div class="fig hero"><div class="l">Bought this month</div><div class="v num">${rs(total)}</div><div class="sub">${prev ? `${rs(prev)} in ${fmtMonth(prevM, true)}` : `${mb.length} bill${mb.length === 1 ? "" : "s"} so far`}</div></div>
    <div class="fig"><div class="l">Pieces</div><div class="v num">${num(pcs)}</div></div>
    <div class="fig due"><div class="l">Owed to suppliers</div><div class="v num">${rs(payable)}</div></div>
  </div>
  <div class="quick">
    <button data-act="new-bill"><span class="qi">${I.bill}</span>New bill</button>
    <button data-act="new-bill" data-scan="1"><span class="qi">${I.cam}</span>Photo bill</button>
    <button data-act="voice"><span class="qi">${I.mic}</span>Speak</button>
  </div>
  <div class="grid2 sec">
    <section><div class="sec-h"><h2>Latest bills</h2>${recent.length ? `<a class="link" href="#bills">See all</a>` : ""}</div>
      <div class="list">${recent.length ? recent.map(billRow).join("") : emptyBox("bill", "No bills yet", "Enter a paper bill, photograph it, or just speak it.", newBillBtn())}</div></section>
    <section><div class="sec-h"><h2>Who we owe</h2>${owing.length ? `<button class="btn ghost sm" style="margin-left:auto" data-act="new-payment">Record payment</button>` : ""}</div>
      <div class="list">${owing.length ? owing.map(({ s, bal }) => `<button class="li" data-act="open-supplier" data-id="${esc(s.id)}">${avatar(s.id, s.name)}<div class="main"><div class="t">${esc(s.name)}</div><div class="s">${esc(s.city || "City not set")}</div></div><div class="amt" style="color:var(--red)">${rs(bal)}</div></button>`).join("")
        : emptyBox("pay", "Nothing owed", "Unpaid amounts from bills show up here.")}</div></section>
  </div>`;
}

function viewBills() {
  const q = ui.billQ.trim().toLowerCase();
  const list = billsArr().filter(b => {
    if (ui.billMonth && !(b.date || "").startsWith(ui.billMonth)) return false;
    if (!q) return true; const s = sup(b.supplierId);
    return [s.name, s.city, b.invoiceNo, b.cargoAgent, b.notes, ...(b.items || []).map(i => i.name + " " + (i.category || ""))].join(" ").toLowerCase().includes(q);
  });
  const groups = new Map(); list.forEach(b => { const k = (b.date || "").slice(0, 7); if (!groups.has(k)) groups.set(k, []); groups.get(k).push(b); });
  const total = list.reduce((t, b) => t + billNet(b), 0);
  return `<div class="ph"><div class="grow"><h1>Bills</h1><p>${list.length} bill${list.length === 1 ? "" : "s"} · ${rs(total)}</p></div></div>
  <div class="filters">
    <label class="search"><span class="sr">Search bills</span>${I.search}<input class="inp" type="search" id="billQ" value="${esc(ui.billQ)}" placeholder="Supplier, item, invoice no."></label>
    <label><span class="sr">Month</span><input class="inp" type="month" id="billMonth" value="${esc(ui.billMonth)}"></label>
  </div>
  <div class="list">${list.length ? [...groups].map(([k, bs]) => `<div class="grp"><span>${k ? fmtMonth(k, true) : "No date"}</span><span class="num">${rs(bs.reduce((t, b) => t + billNet(b), 0))}</span></div>${bs.map(billRow).join("")}`).join("")
    : Object.keys(state.bills).length ? emptyBox("search", "No bills match", "Try another name, item or month.", `<br><button class="btn" data-act="clear-bill-filter">Clear search</button>`) : emptyBox("bill", "No bills yet", "Every bill you enter is kept here, newest first.", newBillBtn())}</div>`;
}

function viewSuppliers() {
  const q = ui.supQ.trim().toLowerCase();
  let list = Object.values(state.suppliers).filter(s => !q || [s.name, s.city, s.phone].join(" ").toLowerCase().includes(q))
    .map(s => ({ s, bal: supplierBalance(s.id), bought: Object.values(state.bills).filter(b => b.supplierId === s.id).reduce((t, b) => t + billNet(b), 0) }));
  if (ui.supFilter === "owe") list = list.filter(x => x.bal > 0.5);
  list.sort((a, b) => b.bal - a.bal || a.s.name.localeCompare(b.s.name));
  const totalOwe = Object.keys(state.suppliers).reduce((t, id) => t + Math.max(0, supplierBalance(id)), 0);
  return `<div class="ph"><div class="grow"><h1>Suppliers</h1><p>${Object.keys(state.suppliers).length} wholesalers · ${rs(totalOwe)} owed</p></div>
    <button class="btn" data-act="new-payment">${I.pay}Payment</button><button class="btn pri" data-act="new-supplier">+ Supplier</button></div>
  <div class="filters" style="grid-template-columns:minmax(0,1fr) auto">
    <label class="search"><span class="sr">Search suppliers</span>${I.search}<input class="inp" type="search" id="supQ" value="${esc(ui.supQ)}" placeholder="Name, city or phone"></label>
    <div class="seg"><button data-act="sup-filter" data-v="all" class="${ui.supFilter === "all" ? "on" : ""}">All</button><button data-act="sup-filter" data-v="owe" class="${ui.supFilter === "owe" ? "on" : ""}">We owe</button></div>
  </div>
  <div class="list">${list.length ? list.map(({ s, bal, bought }) => `<button class="li" data-act="open-supplier" data-id="${esc(s.id)}">${avatar(s.id, s.name)}
    <div class="main"><div class="t">${esc(s.name)}</div><div class="s">${esc(s.city || "City not set")} · bought ${rs(bought)}</div></div>
    <div class="amt">${bal > 0.5 ? `<span style="color:var(--red)">${rs(bal)}</span><small class="muted">we owe</small>` : bal < -0.5 ? `<span style="color:var(--green)">${rs(-bal)}</span><small class="muted">advance</small>` : `<span class="chip green">Clear</span>`}</div></button>`).join("")
    : emptyBox("shop", q || ui.supFilter === "owe" ? "No suppliers here" : "No suppliers yet", q || ui.supFilter === "owe" ? "Try another search or show all." : "Suppliers are added automatically when you enter a bill.")}</div>`;
}

const inPeriod = d => ui.repMode === "year" ? (d || "").startsWith(ui.repMonth.slice(0, 4)) : (d || "").startsWith(ui.repMonth);
function breakdown(title, rows, opts = {}) {
  if (!rows.length) return "";
  const max = Math.max(...rows.map(r => r.total), 1), sum = rows.reduce((t, r) => t + r.total, 0);
  const shown = rows.slice(0, opts.limit || 999);
  return `<section class="sec"><div class="sec-h"><h2>${title}</h2><span class="muted small" style="margin-left:auto">${rows.length}</span></div>
  <div class="list brk">${shown.map(r => `<div class="li">${opts.avatar ? avatar(r.id || r.key, r.key) : ""}<div class="main"><div class="t">${esc(r.key)}</div>
    <div class="s">${num(r.pcs)} pcs${opts.rate && r.pcs ? ` · avg rate ${num(r.total / r.pcs)}` : ""}${r.bills ? ` · ${r.bills.size} bill${r.bills.size === 1 ? "" : "s"}` : ""}${r.sub ? " · " + esc(r.sub) : ""}</div></div>
    <div class="amt">${rs(r.total)}<small class="muted">${(r.total / (sum || 1) * 100).toFixed(0)}%</small></div><div class="track"><i style="width:${(r.total / max * 100).toFixed(1)}%"></i></div></div>`).join("")}
    ${rows.length > shown.length ? `<div class="grp"><span>+ ${rows.length - shown.length} more in the CSV download</span></div>` : ""}
    <div class="brk-foot"><span>Total</span><span class="num">${rs(sum)}</span></div></div></section>`;
}
function viewReports() {
  const bills = billsArr().filter(b => inPeriod(b.date));
  const by = (keyFn, idFn, subFn) => { const m = new Map(); bills.forEach(b => { const k = keyFn(b); const r = m.get(k) || { key: k, id: idFn ? idFn(b) : k, sub: subFn ? subFn(b) : "", total: 0, pcs: 0, bills: new Set() }; r.total += billNet(b); r.pcs += billPcs(b); r.bills.add(b.id); m.set(k, r); }); return [...m.values()].sort((a, b) => b.total - a.total); };
  const byItem = keyFn => { const m = new Map(); bills.forEach(b => (b.items || []).forEach(i => { const k = keyFn(i); if (!k) return; const r = m.get(k) || { key: k, total: 0, pcs: 0, bills: new Set() }; r.total += n(i.qty) * n(i.rate); r.pcs += n(i.qty); r.bills.add(b.id); m.set(k, r); })); return [...m.values()].sort((a, b) => b.total - a.total); };
  const total = bills.reduce((t, b) => t + billNet(b), 0), paid = bills.reduce((t, b) => t + n(b.paid), 0), freight = bills.reduce((t, b) => t + n(b.freight), 0), disc = bills.reduce((t, b) => t + n(b.discount), 0);
  const label = ui.repMode === "year" ? ui.repMonth.slice(0, 4) : fmtMonth(ui.repMonth, true);
  const years = [...new Set([thisMonth().slice(0, 4), ...Object.values(state.bills).map(b => (b.date || "").slice(0, 4)).filter(Boolean)])].sort().reverse();
  let monthly = "";
  if (ui.repMode === "year") {
    const y = ui.repMonth.slice(0, 4);
    const rows = MONTHS_L.map((nm, i) => { const k = `${y}-${String(i + 1).padStart(2, "0")}`; const bs = billsArr().filter(b => (b.date || "").startsWith(k)); return { key: nm, total: bs.reduce((t, b) => t + billNet(b), 0), pcs: bs.reduce((t, b) => t + billPcs(b), 0), bills: new Set(bs.map(b => b.id)) }; }).filter(r => r.total);
    monthly = breakdown("Month by month", rows);
  }
  const rq = ui.rateQ.trim().toLowerCase();
  const rateRows = rq ? billsArr().flatMap(b => (b.items || []).filter(i => (i.name || "").toLowerCase().includes(rq)).map(i => ({ b, i }))).slice(0, 60) : [];
  const rates = rateRows.map(r => n(r.i.rate)).filter(Boolean);
  return `<div class="ph"><div class="grow"><h1>Reports</h1><p>${esc(label)}</p></div>
    <button class="btn" data-act="export" ${bills.length ? "" : "disabled"}>${I.dl}CSV</button></div>
  <div class="filters" style="grid-template-columns:auto minmax(0,220px)">
    <div class="seg"><button data-act="rep-mode" data-v="month" class="${ui.repMode === "month" ? "on" : ""}">Month</button><button data-act="rep-mode" data-v="year" class="${ui.repMode === "year" ? "on" : ""}">Year</button></div>
    ${ui.repMode === "month" ? `<label><span class="sr">Month</span><input class="inp" type="month" id="repMonth" value="${esc(ui.repMonth)}"></label>`
      : `<label><span class="sr">Year</span><select class="inp" id="repYear">${years.map(y => `<option ${y === ui.repMonth.slice(0, 4) ? "selected" : ""}>${y}</option>`).join("")}</select></label>`}
  </div>
  <div class="figs">
    <div class="fig hero"><div class="l">Purchases</div><div class="v num">${rs(total)}</div><div class="sub">${num(bills.reduce((t, b) => t + billPcs(b), 0))} pieces in ${bills.length} bill${bills.length === 1 ? "" : "s"}${disc ? ` · ${rs(disc)} discount` : ""}</div></div>
    <div class="fig"><div class="l">Cargo / freight</div><div class="v num">${rs(freight)}</div></div>
    <div class="fig due"><div class="l">Unpaid on these bills</div><div class="v num">${rs(total - paid)}</div></div>
  </div>
  ${!bills.length ? `<div class="list sec">${emptyBox("chart", `No bills in ${esc(label)}`, `Pick another ${ui.repMode}, or add bills to see the breakdown.`)}</div>` : ""}
  ${monthly}
  <div class="grid2" style="gap:0 22px">
    <div>${breakdown("By supplier", by(b => sup(b.supplierId).name, b => b.supplierId, b => sup(b.supplierId).city), { avatar: true })}</div>
    <div>${breakdown("By city / market", by(b => sup(b.supplierId).city || "City not set"))}${breakdown("By category", byItem(i => i.category || "No category"), { rate: true })}</div>
  </div>
  ${breakdown("By item", byItem(i => (i.name || "").trim()), { rate: true, limit: 25 })}
  <section class="sec card pad"><h2>Rate check</h2>
    <p class="muted small" style="margin:4px 0 12px">Every rate paid for an item, newest first. Spot price changes and the cheapest supplier.</p>
    <label class="search"><span class="sr">Item</span>${I.search}<input class="inp" type="search" id="rateQ" list="itemList" value="${esc(ui.rateQ)}" placeholder="Type an item, e.g. Jarjet"></label>
    <datalist id="itemList">${allItems().map(i => `<option value="${esc(i)}">`).join("")}</datalist>
    ${rq ? (rateRows.length ? `<div style="display:flex;gap:8px;flex-wrap:wrap;margin:12px 0"><span class="chip green">Lowest ${num(Math.min(...rates))}</span><span class="chip red">Highest ${num(Math.max(...rates))}</span><span class="chip">Latest ${num(rateRows[0].i.rate)}</span></div>
      <div class="tbl"><table><thead><tr><th>Date</th><th>Item · supplier</th><th class="r">Qty</th><th class="r">Rate</th></tr></thead><tbody>${rateRows.map(({ b, i }) => `<tr><td style="white-space:nowrap">${fmtDate(b.date)}</td><td>${esc(i.name)}<div class="muted small">${esc(sup(b.supplierId).name)}</div></td><td class="r">${num(i.qty)}</td><td class="r">${num(i.rate)}</td></tr>`).join("")}</tbody></table></div>`
      : `<p class="muted" style="margin:12px 0 0">No item matches “${esc(ui.rateQ)}”.</p>`) : ""}
  </section>`;
}

function viewSettings() {
  const cloud = cfg.mode === "cloud";
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone;
  const srOk = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  return `<div class="ph"><div class="grow"><h1>Settings</h1><p>${cloud ? "Connected to the shop's Google account" : "Bills are kept on this device only"}</p></div></div>
  <section><div class="sec-h"><h2>Sync</h2></div>
  <div class="list setlist">
    <div class="li"><div class="main"><div class="t">Status</div><div class="s">${cloud ? (state.authErr ? esc(state.authErr) : state.outbox.length ? `${state.outbox.length} change(s) waiting to upload` : state.netErr ? "Offline — changes are kept on this device" : "All changes uploaded") : "Not connected"}</div></div>${cloud ? `<button class="btn sm" data-act="sync">Sync now</button>` : ""}</div>
    ${cloud ? `<div class="li"><div class="main"><div class="t">Last sync</div><div class="s">${ago(state.lastSync)}</div></div></div>
    <div class="li"><div class="main"><div class="t">Backend link</div><div class="s kv">${esc(cfg.url)}</div></div></div>
    <div class="li"><div class="main"><div class="t">Bill and voice reading</div><div class="s">${state.ai === false ? "Not set up — add the free Gemini key in the backend (see guide)" : state.ai ? "Ready" : "Unknown until the next sync"}</div></div></div>` : ""}
  </div></section>
  ${cloud ? "" : `<section class="sec card pad"><h2>Connect to Google</h2><p class="muted small" style="margin:4px 0 12px">Sync between phone and laptop, keep photos in Drive and turn on bill and voice reading. Bills on this device are uploaded when you connect.</p>
    <div class="stack"><label class="field"><span>Web app link</span><input type="url" id="cfgUrl" placeholder="https://script.google.com/macros/s/…/exec"></label>
    <label class="field"><span>PIN</span><input type="password" id="cfgPin" inputmode="numeric"></label>
    <button class="btn pri" data-act="connect">${I.cloud}Connect and upload</button></div></section>`}
  <section class="sec"><div class="sec-h"><h2>App</h2></div>
  <div class="list setlist">
    <div class="li"><div class="main"><div class="t">Theme</div><div class="s th-lbl"></div></div><button class="iconbtn" data-act="theme" aria-label="Change theme"><span class="th-ic"></span></button></div>
    <div class="li"><div class="main"><div class="t">Voice language</div><div class="s">${srOk ? "Used by the microphone button" : "This browser can't listen. Use the mic on your keyboard instead."}</div></div>
      <select class="inp" id="voiceLang" style="width:auto;min-height:40px"><option value="ur-PK" ${cfg.voiceLang !== "en-IN" ? "selected" : ""}>اردو Urdu</option><option value="en-IN" ${cfg.voiceLang === "en-IN" ? "selected" : ""}>English</option></select></div>
    <div class="li"><div class="main"><div class="t">Install on this device</div><div class="s">${standalone ? "Installed — you're using the app" : installPrompt ? "Adds an icon to your home screen or desktop" : ios ? "In Safari tap Share, then “Add to Home Screen”" : "Use your browser menu: “Install app” or “Add to Home screen”"}</div></div>${!standalone && installPrompt ? `<button class="btn sm pri" data-act="install">Install</button>` : ""}</div>
    <div class="li"><div class="main"><div class="t">Download all bills</div><div class="s">Every item line as a CSV file for Excel</div></div><button class="btn sm" data-act="export-all">${I.dl}CSV</button></div>
  </div></section>
  <section class="sec"><div class="list setlist"><div class="li"><div class="main"><div class="t">${cloud ? "Disconnect this device" : "Clear this device"}</div><div class="s">${cloud ? "Removes the link, PIN and the copy of data on this device. The Google Sheet keeps everything." : "Deletes every bill stored in this browser."}</div></div><button class="btn sm danger" data-act="disconnect">${cloud ? "Disconnect" : "Clear"}</button></div></div></section>`;
}

/* ================= sheets ================= */
let sheet = null;
function openSheet(s, html, size = "") {
  const keepScroll = sheet && sheet.type === s.type && sheet.id === s.id ? ($(".sh-body") || {}).scrollTop : 0;
  sheet = s;
  $("#sheetRoot").innerHTML = `<div class="sheet-bg" data-act="bg"><div class="sheet ${size}" role="dialog" aria-modal="true">${html}</div></div>`;
  document.body.style.overflow = "hidden";
  if (keepScroll) $(".sh-body").scrollTop = keepScroll;
  const f = $("#sheetRoot [autofocus]"); if (f && matchMedia("(min-width:700px)").matches) f.focus();
}
function closeSheet() { sheet = null; draft = null; $("#sheetRoot").innerHTML = ""; document.body.style.overflow = ""; }
async function tryClose() {
  if (sheet && sheet.dirty && !(await ask("Discard changes?", "What you typed in this form will be lost.", "Discard"))) return;
  closeSheet();
}
function refreshSheet() {
  if (!sheet) return;
  if (sheet.type === "bill") state.bills[sheet.id] ? showBill(sheet.id) : closeSheet();
  if (sheet.type === "supplier") state.suppliers[sheet.id] ? showSupplier(sheet.id) : closeSheet();
}
const head = (title, extra = "") => `<div class="sh-head"><button class="iconbtn" style="border:0" data-act="close" aria-label="Close">${I.x}</button><h2>${title}</h2>${extra}</div>`;

async function showBill(id) {
  const b = state.bills[id]; const s = sup(b.supplierId); const due = billNet(b) - n(b.paid);
  const hasPhoto = b.photoId || b.localPhoto;
  openSheet({ type: "bill", id }, head(esc(s.name), `<button class="btn sm" data-act="edit-bill" data-id="${esc(id)}">${I.edit}Edit</button>`) + `<div class="sh-body stack">
    <div class="dhead"><div class="meta"><div class="big num">${rs(billNet(b))}</div><div class="muted">${fmtDate(b.date)}${b.invoiceNo ? " · Invoice #" + esc(b.invoiceNo) : ""}</div></div>
      ${due > 0.5 ? `<span class="chip red">${rs(due)} due</span>` : `<span class="chip green">Paid in full</span>`}</div>
    <div class="dl">
      <div><span>Supplier</span><b>${esc(s.name)}</b></div>
      <div><span>City / market</span><b>${esc(s.city || "—")}</b></div>
      <div><span>Cargo agent</span><b>${esc(b.cargoAgent || "—")}</b></div>
      <div><span>Freight</span><b>${n(b.freight) ? rs(b.freight) : "—"}</b></div>
    </div>
    <div class="twocol">
      <div class="stack">
        <div class="tbl"><table><thead><tr><th>Item</th><th class="r">Qty</th><th class="r">Rate</th><th class="r">Amount</th></tr></thead>
        <tbody>${(b.items || []).map(i => `<tr><td>${esc(i.name)}${i.category ? `<div class="muted small">${esc(i.category)}</div>` : ""}</td><td class="r">${num(i.qty)}</td><td class="r">${num(i.rate)}</td><td class="r">${num(n(i.qty) * n(i.rate))}</td></tr>`).join("")}</tbody>
        <tfoot><tr><td>${num(billPcs(b))} pcs</td><td></td><td></td><td class="r">${num(billSub(b))}</td></tr></tfoot></table></div>
        ${b.notes ? `<div class="card pad small" style="white-space:pre-wrap">${esc(b.notes)}</div>` : ""}
      </div>
      <div class="stack">
        <div class="sum">
          <div class="tr"><span>Subtotal</span><span class="num">${num(billSub(b))}</span></div>
          ${n(b.discount) ? `<div class="tr"><span>Discount</span><span class="num">− ${num(b.discount)}</span></div>` : ""}
          <div class="tr big"><span>Net</span><span class="num">${rs(billNet(b))}</span></div>
          <div class="tr"><span>Paid${n(b.paid) ? ` · ${esc(b.payMethod || "Cash")}` : ""}</span><span class="num" style="color:var(--green)">${rs(b.paid)}</span></div>
          <div class="tr ${due > 0.5 ? "due" : ""}"><span>Added to balance</span><span class="num">${rs(due)}</span></div>
        </div>
        <div id="billPhoto">${hasPhoto ? `<div class="card pad muted small">Loading bill photo…</div>` : ""}</div>
      </div>
    </div>
  </div>
  <div class="sh-foot"><button class="btn" data-act="open-supplier" data-id="${esc(b.supplierId)}">Supplier ledger</button><span style="flex:1"></span><button class="btn danger" data-act="del-bill" data-id="${esc(id)}" aria-label="Delete bill">${I.trash}<span>Delete</span></button></div>`, "wide");
  if (hasPhoto) { const src = await photoSrc(b); const el = $("#billPhoto"); if (el && sheet && sheet.id === id) el.innerHTML = src ? `<a href="${esc(src)}" target="_blank" rel="noopener" aria-label="Open bill photo full size"><img class="photo" src="${esc(src)}" alt="Photo of the paper bill"></a>` : `<div class="card pad muted small">The photo will show when you're online.</div>`; }
}

function showSupplier(id) {
  const s = state.suppliers[id]; const rows = supplierLedger(id).slice().reverse(); const bal = supplierBalance(id);
  const bought = rows.reduce((t, r) => t + r.debit, 0), paid = rows.reduce((t, r) => t + r.credit, 0);
  openSheet({ type: "supplier", id }, head(esc(s.name), `<button class="btn sm" data-act="edit-supplier" data-id="${esc(id)}">${I.edit}Edit</button>`) + `<div class="sh-body stack">
    <div class="dhead">${avatar(s.id, s.name, true)}
      <div class="meta"><div style="font-weight:700;font-size:18px">${esc(s.name)}</div><div class="muted">${esc(s.city || "City not set")}${s.phone ? ` · <a href="tel:${esc(s.phone)}">${esc(s.phone)}</a>` : ""}</div></div></div>
    <div class="figs f2">
      <div class="fig ${bal > 0.5 ? "due" : ""}" style="grid-column:1/-1"><div class="l">${bal > 0.5 ? "We owe" : bal < -0.5 ? "Advance with supplier" : "Balance"}</div><div class="v num" ${bal < -0.5 ? 'style="color:var(--green)"' : ""}>${bal > 0.5 || bal < -0.5 ? rs(Math.abs(bal)) : "Clear"}</div></div>
      <div class="fig"><div class="l">Total bought</div><div class="v num">${rs(bought)}</div></div>
      <div class="fig"><div class="l">Total paid</div><div class="v num" style="color:var(--green)">${rs(paid)}</div></div>
    </div>
    <div class="sec-h" style="margin:22px 0 10px"><h2>Ledger (khata)</h2><span class="muted small" style="margin-left:auto">newest first</span></div>
    <div class="list lg">${rows.map(r => { const [y, m, d] = (r.date || "--").split("-"); return `<div class="li" ${r.kind !== "payment" ? `role="button" tabindex="0" data-act="open-bill" data-id="${esc(r.ref.id)}" style="cursor:pointer"` : ""}>
      <div class="dt"><b>${+d || ""}</b><span>${MONTHS[+m - 1] || ""} ${y ? y.slice(2) : ""}</span></div>
      <div class="main"><div class="t">${esc(r.text)}</div><div class="s">${esc(r.sub)}</div></div>
      <div class="amt">${r.debit ? `<span>+ ${num(r.debit)}</span>` : `<span style="color:var(--green)">− ${num(r.credit)}</span>`}<small class="bal">bal ${num(r.bal)}</small></div>
      ${r.kind === "payment" ? `<button class="iconbtn" style="width:34px;height:34px;border:0" data-act="del-payment" data-id="${esc(r.ref.id)}" aria-label="Delete payment">${I.trash}</button>` : ""}</div>`; }).join("")
      + (n(s.opening) ? `<div class="li"><div class="dt"><b>—</b></div><div class="main"><div class="t">Opening balance</div></div><div class="amt">${num(s.opening)}</div></div>` : "")
      || emptyBox("bill", "No entries yet", "Bills and payments for this supplier appear here.")}</div>
    ${s.notes ? `<div class="card pad small" style="white-space:pre-wrap">${esc(s.notes)}</div>` : ""}
  </div>
  <div class="sh-foot"><button class="btn danger" data-act="del-supplier" data-id="${esc(id)}" aria-label="Delete supplier">${I.trash}</button><span style="flex:1"></span><button class="btn pri" data-act="new-payment" data-id="${esc(id)}">${I.pay}Record payment</button></div>`);
}

function supplierForm(id) {
  const s = id ? state.suppliers[id] : {};
  openSheet({ type: "supform", form: true }, head(id ? "Edit supplier" : "New supplier") + `<div class="sh-body"><div class="fgrid st">
    <label class="field full"><span>Name</span><input type="text" id="sName" value="${esc(s.name)}" autofocus placeholder="e.g. Asal Din Hijab Fashion" autocomplete="off"></label>
    <label class="field"><span>City / market</span><input type="text" id="sCity" list="cityList" value="${esc(s.city)}" placeholder="Lahore"></label>
    <label class="field"><span>Phone</span><input type="tel" id="sPhone" value="${esc(s.phone)}" placeholder="03xx-xxxxxxx"></label>
    <label class="field full"><span>Opening balance we already owe (Rs)</span><input type="number" inputmode="decimal" id="sOpen" value="${esc(s.opening || "")}" placeholder="0"></label>
    <label class="field full"><span>Notes</span><textarea id="sNotes" placeholder="Shop address, contact person, terms…">${esc(s.notes)}</textarea></label>
    <datalist id="cityList">${allCities().map(c => `<option value="${esc(c)}">`).join("")}</datalist>
  </div></div><div class="sh-foot"><span style="flex:1"></span><button class="btn" data-act="close">Cancel</button><button class="btn pri" data-act="save-supplier" data-id="${esc(id || "")}">Save supplier</button></div>`, "narrow");
}
function saveSupplier(id) {
  const name = $("#sName").value.trim(); if (!name) { toast("Enter the supplier name."); $("#sName").focus(); return; }
  const old = id ? state.suppliers[id] : null;
  const s = { ...(old || {}), id: id || uid(), name, city: $("#sCity").value.trim(), phone: $("#sPhone").value.trim(), opening: n($("#sOpen").value), notes: $("#sNotes").value.trim(), createdAt: old ? old.createdAt : Date.now() };
  commit({ kind: "save", col: "suppliers", obj: s }); toast("Supplier saved"); sheet = null; showSupplier(s.id); render();
}

function paymentForm(supplierId, pre = {}) {
  const sups = Object.values(state.suppliers).sort((a, b) => a.name.localeCompare(b.name));
  if (!sups.length) { toast("Add a bill or supplier first."); return; }
  const sel = supplierId || (sups.find(s => supplierBalance(s.id) > 0.5) || sups[0]).id;
  openSheet({ type: "payform", form: true }, head("Record payment") + `<div class="sh-body"><div class="fgrid st">
    <label class="field full"><span>Paid to</span><select id="pSup">${sups.map(s => `<option value="${esc(s.id)}" ${s.id === sel ? "selected" : ""}>${esc(s.name)}${s.city ? " — " + esc(s.city) : ""}</option>`).join("")}</select></label>
    <div class="full muted small" id="pOwe"></div>
    <label class="field"><span>Amount (Rs)</span><input type="number" inputmode="decimal" id="pAmt" autofocus placeholder="0" value="${esc(pre.amount || "")}"></label>
    <label class="field"><span>Date</span><input type="date" id="pDate" value="${esc(pre.date || today())}"></label>
    <label class="field"><span>Paid by</span><select id="pMethod">${METHODS.map(m => `<option ${m === pre.method ? "selected" : ""}>${m}</option>`).join("")}</select></label>
    <label class="field"><span>Note</span><input type="text" id="pNote" placeholder="Slip or transaction no." value="${esc(pre.note || "")}"></label>
  </div></div><div class="sh-foot"><span style="flex:1"></span><button class="btn" data-act="close">Cancel</button><button class="btn pri" data-act="save-payment">Save payment</button></div>`, "narrow");
  if (pre.amount) sheet.dirty = true;
  showOwe();
}
function showOwe() { const el = $("#pOwe"); if (!el) return; const b = supplierBalance($("#pSup").value); el.innerHTML = b > 0.5 ? `Currently owed: <b style="color:var(--red)">${rs(b)}</b> <button class="btn ghost sm" data-act="pay-full">Pay full</button>` : b < -0.5 ? `Supplier already holds an advance of ${rs(-b)}.` : "Nothing owed right now."; }
function savePayment() {
  const amt = n($("#pAmt").value); if (amt <= 0) { toast("Enter the amount paid."); $("#pAmt").focus(); return; }
  const p = { id: uid(), supplierId: $("#pSup").value, amount: amt, date: $("#pDate").value || today(), method: $("#pMethod").value, note: $("#pNote").value.trim(), createdAt: Date.now() };
  commit({ kind: "save", col: "payments", obj: p }); toast("Payment saved"); sheet = null; showSupplier(p.supplierId); render();
}

/* ================= bill form ================= */
let draft = null;
function billForm(id, autoScan) {
  const b = id ? JSON.parse(JSON.stringify(state.bills[id])) : { date: today(), items: [{}, {}], discount: "", paid: "", freight: "", payMethod: "Cash" };
  draft = { id, photo: null, hadPhoto: !!(id && (b.photoId || b.localPhoto)) };
  const sups = Object.values(state.suppliers).sort((a, c) => a.name.localeCompare(c.name));
  openSheet({ type: "billform", form: true }, head(id ? "Edit bill" : "New bill", `<button class="btn sm gold" data-act="voice" aria-label="Speak">${I.mic}<span>Speak</span></button>`) + `<div class="sh-body">
  <div class="bf">
    <div class="stack">
      <div class="scan" id="scanBox">
        <div class="ic" id="thumbBox">${I.cam}</div>
        <div class="txt"><b>${draft.hadPhoto ? "Bill photo attached" : "Photo of the paper bill"}</b><div class="small muted" id="scanMsg">Snap the bill, then tap Read bill to fill in the lines. Always check them against the paper.</div></div>
        <div class="btns"><label class="btn gold sm" style="cursor:pointer">${I.cam}<span id="photoLbl">${draft.hadPhoto ? "Replace" : "Add photo"}</span><input type="file" id="photoIn" accept="image/*" capture="environment" class="hidden"></label>
        <button class="btn pri sm" id="scanBtn" data-act="scan" disabled>${I.spark}Read bill</button></div>
      </div>
      <div class="fgrid">
        <label class="field full"><span>Supplier</span><select id="bSup"><option value="">Choose supplier…</option>${sups.map(s => `<option value="${esc(s.id)}" ${s.id === b.supplierId ? "selected" : ""}>${esc(s.name)}${s.city ? " — " + esc(s.city) : ""}</option>`).join("")}<option value="__new">+ New supplier</option></select></label>
        <div class="full newsup ${sups.length ? "hidden" : ""}" id="newSup"><div class="fgrid st">
          <label class="field full"><span>New supplier name</span><input type="text" id="nsName" autocomplete="off" placeholder="As written on the bill"></label>
          <label class="field"><span>City / market</span><input type="text" id="nsCity" list="cityList2" placeholder="Lahore"></label>
          <label class="field"><span>Phone</span><input type="tel" id="nsPhone"></label>
          <datalist id="cityList2">${allCities().map(c => `<option value="${esc(c)}">`).join("")}</datalist>
        </div></div>
        <label class="field"><span>Bill date</span><input type="date" id="bDate" value="${esc(b.date)}"></label>
        <label class="field"><span>Invoice no.</span><input type="text" id="bInv" value="${esc(b.invoiceNo)}" placeholder="Optional"></label>
        <label class="field full"><span>Cargo agent (pandi / adda)</span><input type="text" id="bCargo" value="${esc(b.cargoAgent)}" list="cargoList" placeholder="Optional"></label>
        <datalist id="cargoList">${[...new Set(Object.values(state.bills).map(x => x.cargoAgent).filter(Boolean))].map(c => `<option value="${esc(c)}">`).join("")}</datalist>
      </div>
      <div>
        <div class="sec-h"><h2>Items</h2><span class="muted small" style="margin-left:auto" id="lineCount"></span></div>
        <div class="lhead"><span>Item / article code</span><span>Qty</span><span>Rate</span><span style="text-align:right">Amount</span><span></span></div>
        <div class="lines" id="lines">${b.items.map(lineHtml).join("")}</div>
        <button class="addline" data-act="add-line">+ Add item line</button>
        <datalist id="catList">${allCats().map(c => `<option value="${esc(c)}">`).join("")}</datalist>
        <datalist id="itemList2">${allItems().map(c => `<option value="${esc(c)}">`).join("")}</datalist>
      </div>
      <label class="field"><span>Notes</span><textarea id="bNotes" placeholder="Anything else written on the bill">${esc(b.notes)}</textarea></label>
    </div>
    <div class="sum">
      <div class="tr"><span>Subtotal · <span id="tPcs">0</span> pcs</span><span class="num" id="tSub">0</span></div>
      <div class="tr"><label for="bDisc">Discount</label><input type="number" inputmode="decimal" id="bDisc" value="${esc(b.discount)}" placeholder="0"></div>
      <div class="tr big"><span>Net</span><span class="num" id="tNet">Rs 0</span></div>
      <div class="tr"><label for="bPaid">Paid now</label><input type="number" inputmode="decimal" id="bPaid" value="${esc(b.paid)}" placeholder="0"></div>
      <div class="tr"><label for="bMethod">Paid by</label><select id="bMethod">${METHODS.map(m => `<option ${m === b.payMethod ? "selected" : ""}>${m}</option>`).join("")}</select></div>
      <div class="tr due"><span>To supplier balance</span><span class="num" id="tDue">Rs 0</span></div>
      <div class="tr" style="padding-top:8px;border-top:1px solid var(--line)"><label for="bFreight">Cargo / freight</label><input type="number" inputmode="decimal" id="bFreight" value="${esc(b.freight)}" placeholder="0"></div>
      <div class="note">Freight is paid to the cargo agent, so it's counted in reports but not in the supplier's balance.</div>
    </div>
  </div></div>
  <div class="sh-foot"><div class="net"><span>Net amount</span><b id="fNet">Rs 0</b></div><button class="btn" data-act="close">Cancel</button><button class="btn pri" data-act="save-bill">Save bill</button></div>`, "wide");
  if (!sups.length) $("#bSup").value = "__new";
  if (draft.hadPhoto) photoSrc(b).then(src => { if (src && $("#thumbBox")) $("#thumbBox").innerHTML = `<img src="${esc(src)}" alt="">`; });
  recalc();
  if (autoScan) setTimeout(() => $("#photoIn") && $("#photoIn").click(), 60);
}
function lineHtml(i = {}) {
  return `<div class="line"><div class="nm"><input type="text" class="it" list="itemList2" placeholder="Item name / article code" value="${esc(i.name)}" aria-label="Item"><input type="text" class="cat" list="catList" placeholder="Category (optional)" value="${esc(i.category)}" aria-label="Category"></div>
  <div class="qw"><span class="lab">Qty</span><input type="number" inputmode="decimal" class="q" placeholder="0" value="${esc(i.qty)}" aria-label="Quantity"></div>
  <div class="rw"><span class="lab">Rate</span><input type="number" inputmode="decimal" class="rt" placeholder="0" value="${esc(i.rate)}" aria-label="Rate"></div>
  <div class="amt">0</div><button class="x" data-act="rm-line" aria-label="Remove line">${I.trash}</button></div>`;
}
function readLines() {
  return $$("#lines .line").map(l => ({ name: $(".it", l).value.trim(), category: $(".cat", l).value.trim(), qty: n($(".q", l).value), rate: n($(".rt", l).value) }))
    .filter(i => i.name || i.qty || i.rate);
}
function setLines(items) { $("#lines").innerHTML = ""; (items.length ? items : [{}]).forEach(i => $("#lines").insertAdjacentHTML("beforeend", lineHtml(i))); recalc(); }
function recalc() {
  if (!$("#lines")) return;
  let sub = 0, pcs = 0, cnt = 0;
  $$("#lines .line").forEach(l => { const a = n($(".q", l).value) * n($(".rt", l).value); sub += a; pcs += n($(".q", l).value); if (a) cnt++; $(".amt", l).textContent = num(a); });
  const net = sub - n($("#bDisc").value);
  $("#tSub").textContent = num(sub); $("#tPcs").textContent = num(pcs); $("#tNet").textContent = rs(net); $("#fNet").textContent = rs(net);
  $("#tDue").textContent = rs(net - n($("#bPaid").value)); $("#lineCount").textContent = cnt ? `${cnt} line${cnt === 1 ? "" : "s"}` : "";
}
async function saveBill() {
  let supplierId = $("#bSup").value;
  if (supplierId === "__new") {
    const name = $("#nsName").value.trim(); if (!name) { toast("Enter the new supplier's name."); $("#nsName").focus(); return; }
    const existing = matchSupplier(name);
    if (existing && existing.name.toLowerCase() === name.toLowerCase()) supplierId = existing.id;
    else { const s = { id: uid(), name, city: $("#nsCity").value.trim(), phone: $("#nsPhone").value.trim(), opening: 0, notes: "", createdAt: Date.now() }; commit({ kind: "save", col: "suppliers", obj: s }); supplierId = s.id; }
  }
  if (!supplierId) { toast("Choose the supplier."); $("#bSup").focus(); return; }
  const items = readLines();
  if (!items.length) { toast("Add at least one item line."); $(".line .it").focus(); return; }
  const bad = $$("#lines .line").find(l => !$(".it", l).value.trim() && (n($(".q", l).value) || n($(".rt", l).value)));
  if (bad) { toast("Every line needs an item name or code."); $(".it", bad).focus(); return; }
  const old = draft.id ? state.bills[draft.id] : null;
  const b = { ...(old || {}), id: draft.id || uid(), supplierId, date: $("#bDate").value || today(), invoiceNo: $("#bInv").value.trim(), cargoAgent: $("#bCargo").value.trim(),
    items, discount: n($("#bDisc").value), paid: n($("#bPaid").value), payMethod: $("#bMethod").value, freight: n($("#bFreight").value), notes: $("#bNotes").value.trim(), createdAt: old ? old.createdAt : Date.now(), updatedAt: Date.now() };
  if (draft.photo) {
    const key = "pending:" + uid(); await idb.set(key, draft.photo);
    if (old && old.localPhoto) idb.del(old.localPhoto);
    delete b.photoId; b.localPhoto = key;
  }
  commit({ kind: "save", col: "bills", obj: JSON.parse(JSON.stringify(b)) });
  toast(cfg.mode === "cloud" && !navigator.onLine ? "Bill saved on this device — it will sync when online" : "Bill saved");
  sheet = null; showBill(b.id); render();
}

/* ================= reading a bill photo (free Gemini via backend) ================= */
async function scanBill() {
  if (!draft || !draft.photo) return;
  const btn = $("#scanBtn"), msg = $("#scanMsg"), box = $("#scanBox");
  if (cfg.mode !== "cloud") { msg.textContent = "Reading bills needs the online connection. Connect in Settings, or enter the lines by hand."; return; }
  if (!navigator.onLine) { msg.textContent = "You're offline. The photo is kept with the bill; enter the lines by hand or read it later."; return; }
  btn.disabled = true; box.classList.add("busy"); msg.textContent = "Reading the bill… this can take up to a minute.";
  try {
    const r = await api("readBill", { data: draft.photo, known: Object.values(state.suppliers).map(s => s.name).slice(0, 80).join("; "), items: allItems().slice(0, 250).join("; ") }, 120000);
    state.ai = true;
    fillBill(r || {}); sheet.dirty = true;
    const sum = (r.items || []).reduce((t, i) => t + n(i.qty) * n(i.rate), 0);
    msg.innerHTML = `Filled ${(r.items || []).length} lines. ${r.total ? (Math.abs(sum - n(r.discount) - n(r.total)) < 1 ? `<b style="color:var(--green)">Lines match the bill total.</b>` : `<b style="color:var(--red)">Lines add to ${num(sum)}, bill says ${num(r.total)}. Check them.</b>`) : "Check every line against the paper."}`;
  } catch (e) {
    if (e.code === "no_ai") state.ai = false;
    msg.textContent = e.code === "network" ? "No connection. Try again when online, or enter the lines by hand." : e.message;
  } finally { btn.disabled = false; box.classList.remove("busy"); }
}
// fill the open bill form from a photo read or a spoken bill; learns names from saved bills
function fillBill(r, append) {
  if (r.date && /^\d{4}-\d{2}-\d{2}$/.test(r.date)) $("#bDate").value = r.date;
  if (r.invoiceNo) $("#bInv").value = r.invoiceNo;
  if (r.cargoAgent) $("#bCargo").value = r.cargoAgent;
  if (r.discount) $("#bDisc").value = n(r.discount);
  if (r.paid) $("#bPaid").value = n(r.paid);
  if (r.freight) $("#bFreight").value = n(r.freight);
  if (r.payMethod && METHODS.includes(r.payMethod)) $("#bMethod").value = r.payMethod;
  const supName = r.supplier || r.supplierName;
  if ((supName || r.supplierId) && (!$("#bSup").value || $("#bSup").value === "__new")) {
    const m = matchSupplier(supName, r.supplierId);
    if (m) { $("#bSup").value = m.id; $("#newSup").classList.add("hidden"); }
    else if (supName) { $("#bSup").value = "__new"; $("#newSup").classList.remove("hidden"); $("#nsName").value = supName; $("#nsCity").value = r.city || ""; $("#nsPhone").value = r.phone || ""; }
  }
  if (Array.isArray(r.items) && r.items.length) {
    const fresh = r.items.map(i => { const known = matchItem(i.name); const lr = lastRate(known || i.name); return { name: known || i.name || "", qty: i.qty ?? "", rate: i.rate ?? (lr ? lr.rate : ""), category: i.category || (lr && lr.category) || "" }; });
    setLines([...readLines(), ...fresh]);
  }
  recalc();
}

/* ================= voice ================= */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let rec = null, listening = false, voiceBase = "";
function openVoice() {
  const root = $("#voiceRoot");
  const formOpen = sheet && sheet.type === "billform";
  root.innerHTML = `<div class="voice-bg" data-act="voice-bg"><div class="voice" role="dialog" aria-modal="true" aria-labelledby="vT">
    <div class="vtop"><h2 id="vT">${formOpen ? "Speak to fill this bill" : "Speak a bill, payment or question"}</h2><button class="iconbtn" style="border:0" data-act="voice-close" aria-label="Close">${I.x}</button></div>
    ${SR ? `<button class="mic" id="micBtn" data-act="mic" aria-label="Start listening">${I.mic}</button><div class="vhint" id="vHint">Tap the mic and speak in Urdu or English</div>`
      : `<div class="vhint" style="margin-top:8px">This browser can't listen directly. Tap the box below and use the <b>mic on your keyboard</b>.</div>`}
    <label class="field"><span>What you said (you can fix it)</span><textarea id="vText" rows="3" placeholder="Asal Din se 24 cap 45 rupay, 29 jarjet 300 wali, 5000 cash diye"></textarea></label>
    <div class="examples">
      <button data-act="vex">Kapra Leera se 16 abaya 3200 ki</button>
      <button data-act="vex">Asal Din ko 10 hazar JazzCash kiya</button>
      <button data-act="vex">Asal Din ka kitna dena hai?</button>
    </div>
    <div style="display:flex;gap:10px;margin-top:14px"><button class="btn" data-act="voice-close" style="flex:1">Cancel</button><button class="btn pri" data-act="understand" style="flex:2">${I.spark}Understand</button></div>
    <div id="vOut"></div>
  </div></div>`;
  if (!SR) $("#vText").focus();
}
function closeVoice() { stopListening(); $("#voiceRoot").innerHTML = ""; }
function startListening() {
  if (!SR) return;
  rec = new SR(); rec.lang = cfg.voiceLang || "ur-PK"; rec.interimResults = true; rec.continuous = true;
  voiceBase = $("#vText").value.trim(); if (voiceBase) voiceBase += " ";
  rec.onresult = e => { let txt = ""; for (let i = 0; i < e.results.length; i++) txt += e.results[i][0].transcript; $("#vText").value = voiceBase + txt; };
  rec.onerror = e => { const h = $("#vHint"); if (h) h.textContent = e.error === "not-allowed" ? "Microphone blocked. Allow it in the browser settings, or use the keyboard mic." : e.error === "no-speech" ? "Didn't hear anything. Tap the mic and try again." : "Listening stopped (" + e.error + ")."; };
  rec.onend = () => { listening = false; const b = $("#micBtn"); if (b) { b.classList.remove("on"); b.innerHTML = I.mic; } const h = $("#vHint"); if (h && h.textContent.startsWith("Listening")) h.textContent = "Tap Understand, or the mic to add more"; };
  try { rec.start(); listening = true; $("#micBtn").classList.add("on"); $("#micBtn").innerHTML = I.stop; $("#vHint").textContent = "Listening… tap to stop"; } catch { }
}
function stopListening() { if (rec && listening) { try { rec.stop(); } catch { } } listening = false; }
function voiceOut(html, err) { const o = $("#vOut"); if (o) { o.className = "vout" + (err ? " err" : ""); o.innerHTML = html; } }

async function understand() {
  stopListening();
  const text = ($("#vText").value || "").trim();
  if (!text) { voiceOut("Say or type something first.", true); return; }
  if (cfg.mode !== "cloud") { voiceOut("Voice understanding needs the online connection. Connect in Settings.", true); return; }
  if (!navigator.onLine) { voiceOut("You're offline. Voice needs internet; you can still type the bill.", true); return; }
  const btn = $("[data-act=understand]"); btn.disabled = true; voiceOut("Understanding…");
  const formOpen = sheet && sheet.type === "billform";
  const context = {
    today: today(), formOpen,
    suppliers: Object.values(state.suppliers).map(s => ({ id: s.id, name: s.name, city: s.city })),
    items: allItems().slice(0, 250),
    recentBills: billsArr().slice(0, 15).map(b => ({ id: b.id, date: b.date, supplier: sup(b.supplierId).name, invoiceNo: b.invoiceNo, items: (b.items || []).map(i => [i.name, i.qty, i.rate]) })),
  };
  try {
    const r = await api("parseVoice", { text, context }, 90000);
    state.ai = true;
    handleVoice(r || {}, formOpen);
  } catch (e) {
    if (e.code === "no_ai") state.ai = false;
    voiceOut(esc(e.code === "network" ? "No connection. Try again when online." : e.message), true);
  } finally { if (btn) btn.disabled = false; }
}
function handleVoice(r, formOpen) {
  const say = r.message ? `<div class="small muted" style="margin-top:4px">${esc(r.message)}</div>` : "";
  if (r.action === "query") {
    const q = r.query || {};
    const s = matchSupplier(q.supplierName || r.supplierName, q.supplierId || r.supplierId);
    if (q.type === "balance") {
      if (!s) { voiceOut("Which supplier? I couldn't match the name." + say, true); return; }
      const b = supplierBalance(s.id);
      voiceOut(`<b>${esc(s.name)}</b>: ${b > 0.5 ? `we owe <b style="color:var(--red)">${rs(b)}</b>` : b < -0.5 ? `they hold an advance of <b>${rs(-b)}</b>` : "balance is clear"}.`);
      return;
    }
    const m = q.month || thisMonth();
    const bills = billsArr().filter(b => (b.date || "").startsWith(m) && (!s || b.supplierId === s.id));
    let total = 0, pcs = 0;
    if (q.item) { const k = q.item.toLowerCase(); bills.forEach(b => (b.items || []).forEach(i => { if ((i.name || "").toLowerCase().includes(k)) { total += n(i.qty) * n(i.rate); pcs += n(i.qty); } })); }
    else bills.forEach(b => { total += billNet(b); pcs += billPcs(b); });
    voiceOut(`${fmtMonth(m, true)}${s ? ` · ${esc(s.name)}` : ""}${q.item ? ` · ${esc(q.item)}` : ""}: <b>${rs(total)}</b> for ${num(pcs)} pcs.`);
    return;
  }
  if (r.action === "payment") {
    const s = matchSupplier(r.supplierName, r.supplierId);
    if (!s) { voiceOut("I couldn't match the supplier for this payment." + say, true); return; }
    closeVoice(); sheet = null;
    const method = METHODS.find(m => m.toLowerCase() === String(r.method || r.payMethod || "").toLowerCase());
    paymentForm(s.id, { amount: r.amount, method, note: r.note, date: r.date });
    toast("Check the payment and tap Save");
    return;
  }
  if (r.action === "edit_bill") {
    const b = state.bills[r.billId];
    if (!b) { voiceOut("I couldn't tell which bill to change. Open the bill and use Speak there." + say, true); return; }
    closeVoice(); sheet = null; billForm(b.id);
    const c = r.changes || {};
    ["date", "invoiceNo"].forEach(k => { if (c[k]) $(k === "date" ? "#bDate" : "#bInv").value = c[k]; });
    if (c.discount != null) $("#bDisc").value = n(c.discount);
    if (c.paid != null) $("#bPaid").value = n(c.paid);
    if (c.freight != null) $("#bFreight").value = n(c.freight);
    if (Array.isArray(c.items)) {
      let lines = readLines();
      c.items.forEach(ch => {
        const k = (ch.name || "").toLowerCase(); const idx = lines.findIndex(l => l.name.toLowerCase() === k || l.name.toLowerCase().includes(k) || k.includes(l.name.toLowerCase()));
        if (ch.remove) { if (idx >= 0) lines.splice(idx, 1); return; }
        if (idx >= 0) { if (ch.qty != null) lines[idx].qty = ch.qty; if (ch.rate != null) lines[idx].rate = ch.rate; }
        else lines.push({ name: matchItem(ch.name) || ch.name, qty: ch.qty ?? "", rate: ch.rate ?? "", category: "" });
      });
      setLines(lines);
    }
    recalc(); sheet.dirty = true; toast("Changes filled in — check and tap Save");
    return;
  }
  if (r.action === "new_bill" || r.action === "add_lines") {
    closeVoice();
    if (!(formOpen && sheet && sheet.type === "billform")) { sheet = null; billForm(null); }
    fillBill(r); sheet.dirty = true;
    toast("Bill filled from your voice — check and tap Save");
    return;
  }
  voiceOut("I didn't understand that as a bill, payment or question." + say, true);
}

/* ================= CSV ================= */
function downloadCsv(bills, label) {
  const q = v => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [["Date", "Supplier", "City", "Invoice", "Item", "Category", "Qty", "Rate", "Amount", "Bill discount", "Bill paid", "Freight", "Cargo agent"].join(",")];
  bills.slice().reverse().forEach(b => { const s = sup(b.supplierId); (b.items || []).forEach((i, k) => lines.push([b.date, s.name, s.city, b.invoiceNo, i.name, i.category, i.qty, i.rate, n(i.qty) * n(i.rate), k ? "" : n(b.discount), k ? "" : n(b.paid), k ? "" : n(b.freight), b.cargoAgent].map(q).join(","))); });
  const blob = new Blob(["\ufeff" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `zee-purchases-${label}.csv`; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

/* ================= connect / install ================= */
async function connect() {
  const url = ($("#cfgUrl").value || "").trim(), pin = ($("#cfgPin").value || "").trim();
  if (!/^https:\/\/script\.google(usercontent)?\.com\//.test(url)) { toast("Paste the Web app link that starts with https://script.google.com/"); $("#cfgUrl").focus(); return; }
  if (!pin) { toast("Enter the PIN."); $("#cfgPin").focus(); return; }
  ls.set("zee-config-draft", { url });
  const btn = $("[data-act=connect]"); btn.disabled = true; btn.textContent = "Connecting…";
  const wasLocal = cfg && cfg.mode === "local";
  const prev = cfg; cfg = { ...(cfg || {}), mode: "cloud", url, pin, voiceLang: (cfg && cfg.voiceLang) || "ur-PK" };
  try {
    const r = await api("ping", {}, 30000);
    state.ai = !!r.ai; ls.set("zee-config", cfg); state.authErr = false;
    if (wasLocal) {
      // upload everything entered in device-only mode
      Object.values(state.suppliers).forEach(o => state.outbox.push({ opId: uid(), kind: "save", col: "suppliers", obj: o }));
      Object.values(state.bills).forEach(o => state.outbox.push({ opId: uid(), kind: "save", col: "bills", obj: o }));
      Object.values(state.payments).forEach(o => state.outbox.push({ opId: uid(), kind: "save", col: "payments", obj: o }));
      saveCache();
    }
    toast("Connected"); location.hash = "#home"; render(); sync();
  } catch (e) {
    cfg = prev;
    toast(e.code === "bad_pin" ? "Wrong PIN." : e.code === "network" ? "Couldn't reach that link. Check the link and the internet." : e.message);
    btn.disabled = false; btn.innerHTML = I.cloud + "Connect";
  }
}
let installPrompt = null;
window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); installPrompt = e; if (cfg) render(); });
window.addEventListener("appinstalled", () => { installPrompt = null; toast("App installed"); render(); });

/* ================= events ================= */
document.addEventListener("click", async e => {
  const t = e.target.closest("[data-act]"); if (!t) return;
  const act = t.dataset.act, id = t.dataset.id;
  if (act === "bg") { if (e.target === t) tryClose(); return; }
  if (act === "close") return tryClose();
  if (act === "theme") { theme = THEMES[(THEMES.indexOf(theme) + 1) % 3]; ls.set("zee-theme", theme); applyTheme(); return; }
  if (act === "connect") return connect();
  if (act === "local-mode") { cfg = { mode: "local", voiceLang: "ur-PK" }; ls.set("zee-config", cfg); render(); return; }
  if (act === "sync") return sync(true);
  if (act === "install") { if (installPrompt) { installPrompt.prompt(); await installPrompt.userChoice; installPrompt = null; render(); } return; }
  if (act === "install-dismiss") { ls.set("zee-install-dismissed", true); render(); return; }
  if (act === "disconnect") {
    const cloud = cfg.mode === "cloud";
    if (cloud && state.outbox.length && !(await ask("Changes not uploaded yet", `${state.outbox.length} change(s) haven't reached Google yet and will be lost.`, "Disconnect anyway"))) return;
    if (!(await ask(cloud ? "Disconnect this device?" : "Delete all bills on this device?", cloud ? "The Google Sheet keeps all data. You can connect again with the link and PIN." : "This can't be undone.", cloud ? "Disconnect" : "Delete all"))) return;
    ["zee-config", "zee-cache", "zee-outbox"].forEach(k => localStorage.removeItem(k));
    cfg = null; loadCache(); render(); return;
  }
  if (!cfg) return;
  if (act === "voice") return openVoice();
  if (act === "voice-close") return closeVoice();
  if (act === "voice-bg") { if (e.target === t) closeVoice(); return; }
  if (act === "mic") { listening ? stopListening() : startListening(); return; }
  if (act === "vex") { $("#vText").value = t.textContent; return; }
  if (act === "understand") return understand();
  if (act === "new-bill") { sheet = null; billForm(null, t.dataset.scan === "1"); return; }
  if (act === "edit-bill") { sheet = null; return billForm(id); }
  if (act === "open-bill") { if (e.target.closest("[data-act=del-payment]")) return; sheet = null; return showBill(id); }
  if (act === "open-supplier") { sheet = null; return showSupplier(id); }
  if (act === "new-supplier") return supplierForm();
  if (act === "edit-supplier") { sheet = null; return supplierForm(id); }
  if (act === "save-supplier") return saveSupplier(id);
  if (act === "new-payment") { sheet = null; return paymentForm(id); }
  if (act === "save-payment") return savePayment();
  if (act === "pay-full") { $("#pAmt").value = Math.round(supplierBalance($("#pSup").value)); sheet.dirty = true; return; }
  if (act === "save-bill") return saveBill();
  if (act === "scan") return scanBill();
  if (act === "export") return downloadCsv(billsArr().filter(b => inPeriod(b.date)), ui.repMode === "year" ? ui.repMonth.slice(0, 4) : ui.repMonth);
  if (act === "export-all") return downloadCsv(billsArr(), "all");
  if (act === "rep-mode") { ui.repMode = t.dataset.v; return render(); }
  if (act === "sup-filter") { ui.supFilter = t.dataset.v; return render(); }
  if (act === "clear-bill-filter") { ui.billQ = ""; ui.billMonth = ""; return render(); }
  if (act === "add-line") { $("#lines").insertAdjacentHTML("beforeend", lineHtml()); const it = $$("#lines .line .it").pop(); it.focus(); it.scrollIntoView({ block: "center", behavior: "smooth" }); return; }
  if (act === "rm-line") { t.closest(".line").remove(); if (!$$("#lines .line").length) $("#lines").insertAdjacentHTML("beforeend", lineHtml()); recalc(); sheet.dirty = true; return; }
  if (act === "del-bill") { if (!(await ask("Delete this bill?", "Its amount comes off the supplier's balance. This can't be undone."))) return; const b = state.bills[id]; if (b && b.localPhoto) idb.del(b.localPhoto); commit({ kind: "delete", col: "bills", docId: id }); closeSheet(); render(); toast("Bill deleted"); return; }
  if (act === "del-payment") { e.stopPropagation(); if (!(await ask("Delete this payment?", "The supplier's balance goes back up by this amount."))) return; commit({ kind: "delete", col: "payments", docId: id }); render(); refreshSheet(); toast("Payment deleted"); return; }
  if (act === "del-supplier") {
    const used = Object.values(state.bills).some(b => b.supplierId === id) || Object.values(state.payments).some(p => p.supplierId === id);
    if (used) { toast("This supplier has bills or payments. Delete those first."); return; }
    if (!(await ask("Delete this supplier?", "This can't be undone."))) return; commit({ kind: "delete", col: "suppliers", docId: id }); closeSheet(); render(); toast("Supplier deleted"); return;
  }
});
document.addEventListener("input", e => {
  const id = e.target.id;
  if (sheet && sheet.form && e.target.closest(".sheet")) sheet.dirty = true;
  if (id === "billQ") { ui.billQ = e.target.value; render(); }
  else if (id === "supQ") { ui.supQ = e.target.value; render(); }
  else if (id === "rateQ") { ui.rateQ = e.target.value; render(); }
  else if (e.target.closest("#lines") || ["bDisc", "bPaid"].includes(id)) recalc();
});
document.addEventListener("change", async e => {
  const id = e.target.id;
  if (id === "billMonth") { ui.billMonth = e.target.value; render(); }
  else if (id === "repMonth") { if (e.target.value) ui.repMonth = e.target.value; render(); }
  else if (id === "repYear") { ui.repMonth = e.target.value + "-01"; render(); }
  else if (id === "voiceLang") { cfg.voiceLang = e.target.value; ls.set("zee-config", cfg); toast("Voice language saved"); }
  else if (id === "pSup") showOwe();
  else if (id === "bSup") { $("#newSup").classList.toggle("hidden", e.target.value !== "__new"); if (e.target.value === "__new") $("#nsName").focus(); }
  else if (e.target.classList.contains("it")) {
    const line = e.target.closest(".line"), lr = lastRate(e.target.value);
    if (lr) { if (!$(".rt", line).value) $(".rt", line).value = lr.rate; if (!$(".cat", line).value && lr.category) $(".cat", line).value = lr.category; recalc(); }
  }
  else if (id === "photoIn") {
    const f = e.target.files && e.target.files[0]; if (!f) return;
    try { draft.photo = await compress(f); } catch { toast("That file isn't a photo the app can read."); return; }
    sheet.dirty = true;
    $("#thumbBox").innerHTML = `<img src="${draft.photo}" alt="">`; $("#photoLbl").textContent = "Replace";
    $("#scanBox .txt b").textContent = "Bill photo attached";
    $("#scanBtn").disabled = false; $("#scanMsg").textContent = "Tap Read bill to fill in the lines from the photo.";
  }
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") { if ($("#voiceRoot").innerHTML) { closeVoice(); return; } if (sheet && !$("#dlgRoot").innerHTML) tryClose(); }
  if (e.key === "Enter" && e.target.matches && e.target.matches("[role=button][data-act]")) e.target.click();
  if (e.key === "Enter" && e.target.classList && e.target.classList.contains("rt")) {
    e.preventDefault(); const line = e.target.closest(".line"), lines = $$("#lines .line");
    if (line === lines[lines.length - 1]) $("#lines").insertAdjacentHTML("beforeend", lineHtml());
    $(".it", line.nextElementSibling).focus();
  }
});
window.addEventListener("online", () => { state.netErr = false; updateSync(); sync(); });
window.addEventListener("offline", updateSync);
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") sync(); });
setInterval(() => { if (document.visibilityState === "visible") sync(); }, 90000);

/* ================= start ================= */
if ("serviceWorker" in navigator && location.protocol === "https:") {
  navigator.serviceWorker.register("./sw.js").catch(() => { });
  let reloaded = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => { if (!reloaded && !sheet) { reloaded = true; toast("App updated"); } });
}
applyTheme(); loadCache(); render(); sync();
})();
