/* GENERÁLT FÁJL – ne szerkeszd. Forrás: js/app.js, szótár: tools/i18n/en.json, eszköz: tools/i18n/build-en.js */
(() => {
"use strict";
const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const uidGen = p => p + Date.now().toString(36) + Math.random().toString(36).slice(2,7);
const strip = s => String(s||"").normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
const slug = s => strip(s).replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,80);
const normDen = s => strip(s).replace(/filler|fill\.?/g,"f").replace(/forint/g,"ft").replace(/pengo/g,"p").replace(/korona/g,"k").replace(/krajcar/g,"kr").replace(/[^a-z0-9]/g,"");
const mid = i => ((+i.min||0)+(+i.max||0))/2;
const r2 = x => Math.round((+x||0)*100)/100;
const ic = (n, sz, c) => window.BS.ic(n, sz, c);
const LOCK = ic("lock", 16);

const COND = [ {k:"postatiszta", l:"Mint never hinged **"}, {k:"falcos", l:"Hinged *"}, {k:"pecsetelt", l:"Used ⊙"}, {k:"serult", l:"Damaged"} ];
const GRADES = [ {k:"Superb", p:1.0}, {k:"XF", p:.85}, {k:"VF", p:.65}, {k:"F", p:.45}, {k:"VG", p:.25}, {k:"Poor", p:.05} ];
/* Nyelvfüggő szöveg ott, ahol az angol szórend eltér (a generált angol változat ezt a sort nem fordítja). */
const T = (hu, en) => window.BS.lang === "en" ? en : hu;
const gradeL = k => k === "Gyenge" ? "Poor" : (k || "");
/* i18n-skip-start */ const LANGS = [["hu", "Magyar"], ["en", "English"]]; /* i18n-skip-end */
const condL = k => (COND.find(c=>c.k===k)||{}).l || "";
const haptic = (ms = 12) => { try { navigator.vibrate && navigator.vibrate(ms); } catch(e){} };

/* ---------- state ---------- */
const S = {
  mode:"single", front:null, page:null, frontURL:null, pageURL:null,
  frontCanvas:null, pageCanvas:null, thumb:null,
  scan:null, saved:false, savePf:"default", modalIdx:null,
  cur:"HUF", items:[], series:{}, portfolios:[], albums:[], wishes:[], prefs:{}, hist:{points:[]}, activePf:"all", refreshing:false,
  back:null, backURL:null, backCanvas:null, saveAlbum:"", view:"home"
};
try { const c = localStorage.getItem("bs_cur"); if (c === "EUR" || c === "HUF") S.cur = c; } catch(e){}

/* ---------- money ---------- */
/* Egységes pénznemformázás.
   - Minden összeg EGY megjelenítési árfolyammal számol (a legutóbb árazott tétel EUR/HUF árfolyama), így az összegek és részösszegek egymással konzisztensek.
   - Kerekítési egység: Ft-ban <1 000: 10 Ft, <100 000: 100 Ft, fölötte 1 000 Ft; €-ban <100: 0,01 €, <10 000: 1 €, fölötte 10 €.
   - Összefüggő számok (összérték, bővülés, átértékelés, tartomány) közös egységgel kerekítve, a különbség a kerekített értékekből számolva. */
const validRate = x => { x = Number(x); return x > 200 && x < 700 ? x : 0; };
function rate(r){ return S.dispRate || validRate(r?.eur_huf) || 395; }
function unitFor(eur){ const v = Math.abs(+eur || 0); if (S.cur === "EUR") return v < 100 ? .01 : v < 10000 ? 1 : 10; const h = v * rate(); return h < 1000 ? 10 : h < 100000 ? 100 : 1000; }
function groupUnit(...vals){ return unitFor(Math.max(0, ...vals.map(v => Math.abs(+v || 0)))); }
function roundDisp(eur, u){ const x = S.cur === "EUR" ? eur : eur * rate(); return Math.round(x / u) * u; }
function fmtDisp(x, u){ if (x == null || isNaN(x)) return "–"; const d = u < 1 ? 2 : 0; return (Object.is(x, -0) ? 0 : x).toLocaleString(window.BS.LOC, {minimumFractionDigits:d, maximumFractionDigits:d}) + (S.cur === "EUR" ? "\u00a0€" : "\u00a0Ft"); }
function fmtU(eur, u){ if (eur == null || isNaN(eur)) return "–"; u = u ?? unitFor(eur); return fmtDisp(roundDisp(eur, u), u); }
function fmt(eur){ return fmtU(eur); }
function fmtSigned(x, u){ return (x > 0 ? "+" : x < 0 ? "−" : "±\u00a0") + fmtDisp(Math.abs(x), u); }
function pctFmt(p, signed){ const s = (Math.abs(p) < .05 ? 0 : p).toLocaleString(window.BS.LOC, {minimumFractionDigits:1, maximumFractionDigits:1}); return (signed && p > 0.05 ? "+" : "") + s.replace("-", "−") + "%"; }
const hufFmt = n => Math.round(+n || 0).toLocaleString(window.BS.LOC) + "\u00a0Ft";
function rng(a,b){ const u = groupUnit(a, b); return (Math.abs(roundDisp(a,u) - roundDisp(b,u)) < 1e-9) ? fmtU(a,u) : fmtU(a,u) + " – " + fmtU(b,u); }
function fmtAlt(a, b, r){ const s = S.cur; S.cur = s === "HUF" ? "EUR" : "HUF"; const o = rng(a, b, r); S.cur = s; return "≈ " + o; }
const gRate = () => ({eur_huf: rate()});

/* ---------- images ---------- */
function loadImg(file){
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file); const im = new Image();
    im.onload = () => res({im, url}); im.onerror = () => rej(new Error("The image could not be read.")); im.src = url;
  });
}
function toCanvas(im, max){
  const s = Math.min(1, max / Math.max(im.naturalWidth || im.width, im.naturalHeight || im.height));
  const c = document.createElement("canvas");
  c.width = Math.round((im.naturalWidth || im.width)*s); c.height = Math.round((im.naturalHeight || im.height)*s);
  c.getContext("2d").drawImage(im, 0, 0, c.width, c.height); return c;
}
const toBlob = (c, q) => new Promise(r => c.toBlob(r, "image/jpeg", q));
function cropHi(c, b, max, q){
  if (!c || !Array.isArray(b)) return null;
  const [x0, y0, x1, y1] = b.map(Number), W = c.width, H = c.height;
  const px = (x1 - x0) * .03, py = (y1 - y0) * .03;
  const X0 = Math.max(0, (x0 - px) / 1000 * W), Y0 = Math.max(0, (y0 - py) / 1000 * H), X1 = Math.min(W, (x1 + px) / 1000 * W), Y1 = Math.min(H, (y1 + py) / 1000 * H);
  const w = X1 - X0, h = Y1 - Y0; if (w < 12 || h < 12) return null;
  const sc = Math.min(1, max / Math.max(w, h)), o = document.createElement("canvas"); o.width = Math.round(w * sc); o.height = Math.round(h * sc);
  o.getContext("2d").drawImage(c, X0, Y0, w, h, 0, 0, o.width, o.height); return o.toDataURL("image/jpeg", q);
}
function crop(c, b){
  if (!c || !Array.isArray(b) || b.length !== 4) return null;
  let [x0,y0,x1,y1] = b.map(Number); if ([x0,y0,x1,y1].some(v => isNaN(v))) return null;
  if (x1 < x0) [x0,x1] = [x1,x0]; if (y1 < y0) [y0,y1] = [y1,y0];
  const px = (x1-x0)*.04, py = (y1-y0)*.04, W = c.width, H = c.height;
  const X0 = Math.max(0, (x0-px)/1000*W), Y0 = Math.max(0, (y0-py)/1000*H);
  const X1 = Math.min(W, (x1+px)/1000*W), Y1 = Math.min(H, (y1+py)/1000*H);
  const w = X1-X0, h = Y1-Y0; if (w < 12 || h < 12) return null;
  const s = Math.min(1, 260/Math.max(w,h)); const o = document.createElement("canvas");
  o.width = Math.round(w*s); o.height = Math.round(h*s);
  o.getContext("2d").drawImage(c, X0, Y0, w, h, 0, 0, o.width, o.height);
  return o.toDataURL("image/jpeg", .75);
}
function quality(cv, im, which){
  const sc = Math.min(1, 512/Math.max(cv.width, cv.height)), w = Math.max(3, Math.round(cv.width*sc)), h = Math.max(3, Math.round(cv.height*sc));
  const c = document.createElement("canvas"); c.width = w; c.height = h; const x = c.getContext("2d"); x.drawImage(cv, 0, 0, w, h);
  const d = x.getImageData(0, 0, w, h).data, g = new Float32Array(w*h); let sum = 0, hi = 0;
  for (let i = 0, j = 0; i < d.length; i += 4, j++) { const v = .299*d[i] + .587*d[i+1] + .114*d[i+2]; g[j] = v; sum += v; if (d[i] > 250 && d[i+1] > 250 && d[i+2] > 250) hi++; }
  const mean = sum/(w*h), glare = hi/(w*h);
  let ls = 0, lq = 0, n = 0;
  for (let y = 1; y < h-1; y++) for (let xx = 1; xx < w-1; xx++) { const k = y*w + xx, L = 4*g[k] - g[k-1] - g[k+1] - g[k-w] - g[k+w]; ls += L; lq += L*L; n++; }
  const lap = n ? lq/n - (ls/n)**2 : 0, shortSide = Math.min(im.naturalWidth || im.width, im.naturalHeight || im.height), minRes = which === "page" ? 1500 : 600;
  return [
    {k:"res", ok: shortSide >= minRes, label: shortSide >= minRes ? "Resolution OK" : `Low resolution (${shortSide} px) – move closer or use the main camera`},
    {k:"sharp", ok: lap >= 60, label: lap >= 60 ? "Sharp image" : "The image looks blurry – hold steady and tap the stamp to focus"},
    {k:"light", ok: mean >= 55 && mean <= 225, label: mean < 55 ? "Too dark – find more light" : mean > 225 ? "Too bright / overexposed" : "Lighting OK"},
    {k:"glare", ok: glare <= .02, label: glare <= .02 ? "No disturbing glare" : "Glare visible – under foil, light it slightly from the side"}
  ];
}
async function setPhoto(which, file){
  if (!file) return;
  if (which === "main") which = S.mode === "single" ? "front" : "page";
  try {
    const {im, url} = await loadImg(file);
    const cv = toCanvas(im, which === "page" ? 2000 : 1400);
    const blob = await toBlob(cv, .85);
    if (which !== "back") { try { S[which+"Q"] = quality(cv, im, which); } catch(e) { S[which+"Q"] = null; } }
    if (which === "front") { S.frontCanvas = cv; S.thumb = toCanvas(im, 220).toDataURL("image/jpeg", .7); }
    if (which === "page") S.pageCanvas = cv;
    if (which === "back") S.backCanvas = cv;
    if (S[which+"URL"]) URL.revokeObjectURL(S[which+"URL"]);
    S[which] = blob; S[which+"URL"] = url; renderSlots(); haptic(8);
  } catch(e) { toast(e.message); }
}
function curKey(){ return S.mode === "single" ? "front" : "page"; }
function renderSlots(){
  const w = curKey(), url = S[w+"URL"], A = window.BS.art;
  const vf = $("#vf");
  if (vf) vf.innerHTML = url
    ? `<div class="vf-photo"><img src="${url}" alt="Selected ${w === "page" ? "album page" : "stamp"} photo"><button class="x" data-clear="${w}" aria-label="Delete photo"><span>${ic("close",16)}</span></button><span class="tag">${w === "page" ? "Album page" : "Stamp"}</span></div>`
    : `<div class="vf-empty ${S.mode}"><span class="vf-corners" aria-hidden="true"><i></i><i></i><i></i><i></i></span>${A.frame(S.mode)}<div class="vf-cap"><b>${S.mode === "page" ? "Fit the whole album page in the frame" : "Place the stamp inside the frame!"}</b><span>${S.mode === "page" ? "Straight on, good light, no glare." : "Good light, no glare."}</span></div></div>`;
  const br = $("#backRow");
  if (br) br.innerHTML = S.mode !== "single" ? "" : S.backURL
    ? `<div class="back-chip"><img src="${S.backURL}" alt="Back"><span>Back added</span><button class="linkbtn" data-clear="back" aria-label="Remove back photo">Remove</button></div>`
    : `<label class="linkbtn">${ic("flip",15)} Add back photo <span class="muted">(optional)</span><input type="file" accept="image/*" data-in="back"></label>`;
  const q = url && S[w+"Q"], bad = q ? q.filter(i => !i.ok) : [];
  const qm = $("#q-main");
  if (qm) qm.innerHTML = !q ? "" : bad.length ? bad.map(i => `<span class="warn">${ic("alert",15)} ${esc(i.label)}</span>`).join("") + `<span class="muted">A new photo is recommended, but you can analyse this one too.</span>` : `<span class="ok">${ic("check",15)} Image quality OK</span>`;
  const tp = $("#tips");
  if (tp && !tp.dataset.done) { tp.innerHTML = `<div class="sec-h" style="margin-top:16px"><h3>Photo tips</h3></div><div class="tip-grid">${A.tips.map(([l, svg]) => `<div class="tip">${svg}<span>${l}</span></div>`).join("")}</div>`; tp.dataset.done = 1; }
  const b = $("#btnAnalyze"); if (b) b.disabled = !S[w];
}
document.addEventListener("change", e => { const inp = e.target.closest("[data-in]"); if (!inp) return; setPhoto(inp.dataset.in, inp.files[0]); inp.value = ""; });
document.addEventListener("click", e => {
  const x = e.target.closest("[data-clear]"); if (!x) return;
  e.preventDefault(); e.stopPropagation();
  const w = x.dataset.clear;
  if (S[w+"URL"]) URL.revokeObjectURL(S[w+"URL"]);
  S[w] = null; S[w+"URL"] = null; S[w+"Q"] = null; if (w === "front") { S.thumb = null; S.frontCanvas = null; } if (w === "page") S.pageCanvas = null; if (w === "back") S.backCanvas = null;
  renderSlots();
}, true);

/* ---------- AI ---------- */
let samplePromise = null;
async function waitClaude(){ for (let i = 0; i < 30 && !window.claude?.use; i++) await new Promise(r => setTimeout(r, 100)); }
async function getSample(){ await waitClaude(); return samplePromise ||= (window.claude?.use ? window.claude.use("sample") : Promise.resolve(null)); }

/* i18n-skip-start: AI-promptok – nem fordítandók (a nyelvet a LANG_RULE állítja) */
const STAMP_SCHEMA = `{"felismerve":true,"bbox":[0,0,1000,1000],"kepminoseg":{"megfelelo":true,"problemak":[""]},"bizonyossag":0-100,"nev":"rövid megnevezés","orszag":"","kiadas_eve":"","sorozat":"","sorozat_kulcs":"","sorozat_tag_index":0,"nevertek":"","szin":"","tema":"a bélyeg témája 1-3 szóban","magyar":true,"mezo_forras":{"orszag":"kepen|ai|ismeretlen","kiadas_eve":"kepen|ai|ismeretlen","nevertek":"kepen|ai|ismeretlen","sorozat":"ai|ismeretlen","szin":"kepen|ai|ismeretlen"},"jeloltek":[{"nev":"","kiadas_eve":"","sorozat":"","katalogus":{"mbk":"","michel":"","scott":"","sg":""},"bizonyossag":0-100,"indok":"mi szól mellette, mi különbözteti meg"}],"fogazat":"","vizjel":"","nyomtatas":"","leiras":"","allapot":{"tipus":"postatiszta|falcos|pecsetelt|serult","fokozat":"Superb|XF|VF|F|VG|Gyenge","pontszam":1-10,"centrirozas":"","fogazat_allapot":"","szin_allapot":"","pecset":"","hibak":[""],"megjegyzes":""},"arak":{"postatiszta":{"min":0,"max":0},"falcos":{"min":0,"max":0},"pecsetelt":{"min":0,"max":0},"serult":{"min":0,"max":0}},"ar_alap":"mire alapozod a becslést, egy mondat","katalogusar_eur":"","magyar_piac":"","becsult_ertek":{"min":0,"max":0,"indoklas":""},"ritkasag":"gyakori|kevésbé gyakori|ritka|nagyon ritka|","valtozatok":[""],"ellenorzes":[""],"hamisitas_kockazat":"","ertekesites":""}`;
const SERIES_SCHEMA = `{"kulcs":"","cim":"","orszag":"","ev":"","tagok":[{"nevertek":"","szin":"","tema":"","mbk":"","michel":"","ar":{"postatiszta":{"min":0,"max":0},"pecsetelt":{"min":0,"max":0}}}],"teljes_sor":{"postatiszta":{"min":0,"max":0},"pecsetelt":{"min":0,"max":0}}}`;

const EN = (window.BS && BS.lang) === "en";
const LANG_RULE = EN ? "Minden szöveges mező (nev, leiras, indok, indoklas, ar_alap, magyar_piac, megjegyzes stb.) ANGOLUL legyen, angol nyelvű felhasználónak. A JSON-kulcsok és a felsorolt kódértékek (postatiszta, falcos, pecsetelt, serult, Superb…Gyenge, gyakori, kevésbé gyakori, ritka, nagyon ritka, kepen, ai, ismeretlen) maradjanak PONTOSAN így." : "Minden szöveges mező MAGYARUL legyen.";
const PROMPT_VERSION = "2026-11-19.v3" + (EN ? "-en" : "");
function buildPrompt(mode, hasBack){
  const intro = mode === "page"
    ? `A csatolt fotó egy bélyegalbum-oldalt, berakólapot vagy több bélyeget mutat. Azonosítsd az ÖSSZES (legalább nagyrészt látható) bélyeget külön-külön, legfeljebb 30-at, soronként balról jobbra, fentről lefelé haladva. Mindegyikhez adj "bbox"-ot: [x0,y0,x1,y1] a bélyeg befoglaló téglalapja a kép szélességéhez és magasságához viszonyítva, 0–1000 skálán (0,0 = bal felső sarok). Mivel sok bélyeg van, a szöveges mezők legyenek nagyon tömörek: "leiras", "ertekesites", "hamisitas_kockazat", "magyar_piac", "indoklas" legfeljebb 1 rövid mondat; "valtozatok", "ellenorzes", "hibak" legfeljebb 1 elem; a ritkán kitölthető mezőket hagyd üres stringként.`
    : `A csatolt fotó EGY postabélyeget mutat (${hasBack ? "1. kép: előoldal, 2. kép: hátoldal – a hátoldal alapján ítéld meg a gumizást, falcnyomot és vékonyodást" : "csak az előoldal; a bélyeg lehet albumba ragasztva vagy fólia alatt"}). A "belyegek" tömb pontosan 1 elemű legyen; a "bbox" a bélyeg befoglaló téglalapja a képen, 0–1000 skálán [x0,y0,x1,y1].`;
  return `Te egy tapasztalt filatelista és bélyegértékbecslő szakértő vagy.
${intro}
ALAPSZABÁLY: semmit ne találj ki. Ha egy adatot nem tudsz megalapozottan megadni, hagyd üres stringként – az app "ismeretlen"-ként jelzi. A pontatlan adat rosszabb, mint az ismeretlen.
Minden bélyegnél:
0) "kepminoseg": ha a fotó életlen, sötét, tükröződik vagy a bélyeg csak részben látszik, "megfelelo": false és sorold fel a problémákat.
1) Azonosítás. A "mezo_forras"-ban jelöld mezőnként: "kepen" = a bélyegen olvasható felirat (pl. ország neve, névérték, évszám); "ai" = a megjelenés alapján következtetsz; "ismeretlen" = nem tudod (ilyenkor a mező üres string). A "jeloltek" tömbben adj 1–3 lehetséges katalógustalálatot csökkenő valószínűség szerint (pl. hasonló kiadások, színváltozatok, újranyomások), mindegyikhez saját "bizonyossag"-ot és rövid "indok"-ot. Katalógusszámot (MBK, Michel, Scott, SG) csak akkor írj, ha tényleg ismered; egyébként üres string. MAGYAR bélyegnél (Magyarország, Magyar Királyi Posta, Magyar Posta, magyar vonatkozású helyi és megszállási kiadások) az MBK-szám a legfontosabb. A "bizonyossag" az első jelölt valószínűsége legyen.
2) Értékeld az állapotát a képről: postatiszta / falcos / pecsételt / sérült. ${hasBack ? "A 2. képen a hátoldal látható: ebből ítéld meg a gumizást, a falcnyomot és a vékonyodást, de jelezd, ha a fotó alapján bizonytalan." : "A hátoldal nem látható (a bélyegek gyakran albumba ragasztva vagy fóliázva vannak), ezért a gumizásról ne találgass: bélyegzés nélküli bélyegnél óvatosan a 'falcos' kategóriát add meg, és a 'megjegyzes'-ben jelezd, hogy a gumizás fotóról nem ellenőrizhető (a felhasználó átállíthatja)."} Ha fólia tükröződése vagy albumlap zavarja a megítélést, azt is írd le. Centrírozás, fogazat, szín, bélyegzés, hibák.
3) ÁR – ez mindig előzetes AI-becslés, élő piaci adat nélkül, és az app így is jelöli. Adj REÁLIS PIACI árat (amit egy gyűjtő ténylegesen fizetne aukción/kereskedőnél ma), NEM katalógusárat, EURÓBAN, mind a négy állapotra (min–max). MAGYAR bélyegnél a HAZAI piacot vedd alapul (magyar aukciósházak leütési árai, Vatera, hazai kereskedők, bélyegbörzék), az euróérték ilyenkor a forintár átszámítása legyen, és a "magyar_piac" mezőben írd le röviden, mennyit ér itthon és hol érdemes keresni; nem magyar bélyegnél ez üres string.
4) Becsüld meg az adott példány értéktartományát ("becsult_ertek") az állapota és fokozata alapján; az "ar_alap"-ban egy mondatban írd le, mire alapozod. Ha a bélyeg nem azonosítható elég biztosan, az árak legyenek 0-k. A "ritkasag" üres string, ha nem tudod megalapozni.
5) SOROZAT: ha a bélyeg egy ismert, kiadott sorozat tagja, a "sorozat_kulcs" legyen "orszag-ev-sorozatnev" alakú, kisbetűs, ékezet nélküli, kötőjeles azonosító (pl. "magyarorszag-1949-lanchid"), és "sorozat_tag_index" a bélyeg helye (0-tól) a sorozat "tagok" listájában. Ha a sorozat 30-nál több tagú, vagy nem ismered biztosan a TELJES összetételét, a "sorozat_kulcs" legyen üres string – hiányos vagy kitalált taglistát ne adj.
A "sorozatok" tömbben minden előforduló sorozat EGYSZER szerepeljen, a "kulcs" egyezzen a bélyegek "sorozat_kulcs"-ával, a "tagok" pedig a TELJES hivatalos sor összes címlete legyen katalógus-sorrendben (azok is, amelyek nincsenek a képen), tagonként reális piaci árral EUR-ban; "teljes_sor" a teljes sor ára egyben.
Ha valami nem bélyeg vagy nem azonosítható: "felismerve": false, és a "leiras"-ban mondd el, miért (egy bélyeges módban ilyenkor is 1 elemű a tömb).
Légy őszinte: a tömegbélyegek valódi piaci értéke gyakran csak néhány tíz-száz forint – ne becsüld túl.
${LANG_RULE} "eur_huf" az aktuális EUR/HUF árfolyam közelítése.
CSAK egy JSON objektummal válaszolj, semmi mással, ebben a szerkezetben:
{"eur_huf":395,"belyegek":[${STAMP_SCHEMA}],"sorozatok":[${SERIES_SCHEMA}]}`;
}

/* i18n-skip-end */
function salvage(t){
  const st = []; let inS = false, es = false, last = -1, snap = null;
  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    if (inS) { if (es) es = false; else if (ch === "\\") es = true; else if (ch === '"') inS = false; continue; }
    if (ch === '"') inS = true;
    else if (ch === "{" || ch === "[") st.push(ch);
    else if (ch === "}" || ch === "]") { st.pop(); if (st.length && st[st.length-1] === "[") { last = i+1; snap = st.slice(); } }
  }
  if (last < 0) throw new Error("truncated response");
  return t.slice(0, last) + snap.reverse().map(c => c === "[" ? "]" : "}").join("");
}
function parseJSON(t){
  t = String(t||"").trim().replace(/^```(?:json)?/i,"").replace(/```\s*$/,"").trim();
  const a = t.indexOf("{"); if (a < 0) throw new Error("The response could not be understood.");
  const b = t.lastIndexOf("}");
  try { return JSON.parse(t.slice(a, b+1)); } catch(e) { return JSON.parse(salvage(t.slice(a))); }
}
function normScan(raw){
  const rt = Number(raw.eur_huf) || 395;
  let stamps = Array.isArray(raw.belyegek) ? raw.belyegek : (raw.nev || raw.felismerve !== undefined ? [raw] : []);
  stamps = stamps.filter(s => s && typeof s === "object").slice(0, 30).map(s => {
    const st = {...s, eur_huf: rt};
    st._cond = COND.some(c => c.k === s.allapot?.tipus) ? s.allapot.tipus : "pecsetelt";
    st._grade = GRADES.some(g => g.k === s.allapot?.fokozat) ? s.allapot.fokozat : "F";
    st._incl = s.felismerve !== false;
    st._key = s.sorozat_kulcs && slug(s.sorozat_kulcs).length > 3 ? "se_" + slug(s.sorozat_kulcs) : "";
    let jl = Array.isArray(s.jeloltek) ? s.jeloltek.filter(j => j && typeof j === "object").slice(0, 3) : [];
    if (!jl.length) jl = [{nev:s.nev||"", kiadas_eve:s.kiadas_eve||"", sorozat:s.sorozat||"", katalogus:s.katalogus||{}, bizonyossag:+s.bizonyossag||0, indok:""}];
    st.jeloltek = jl.map(j => ({nev:j.nev||"", kiadas_eve:String(j.kiadas_eve||""), sorozat:j.sorozat||"", katalogus:j.katalogus||{}, bizonyossag:Math.max(0, Math.min(100, +j.bizonyossag||0)), indok:j.indok||""}));
    st.katalogus = {...(st.jeloltek[0].katalogus||{})};
    st.mezo_forras = {...(s.mezo_forras||{})};
    if (!RAR.includes(st.ritkasag)) st.ritkasag = "";
    st._cand = 0; st._confirmed = false;
    return st;
  });
  const series = {};
  for (const z of (Array.isArray(raw.sorozatok) ? raw.sorozatok : [])) {
    if (!z?.kulcs || !Array.isArray(z.tagok) || !z.tagok.length) continue;
    const k = "se_" + slug(z.kulcs); if (k.length < 7) continue;
    series[k] = {kind:"series", schema:2, allapot:"megerositesre_var", cim:z.cim||"", orszag:z.orszag||"", ev:String(z.ev||""), tagok:z.tagok.slice(0,30), teljes_sor:z.teljes_sor||null};
  }
  return {stamps, series, rate: rt};
}
function cleanStamp(st){ const o = {}; for (const k in st) if (k[0] !== "_" && k !== "bbox") o[k] = st[k]; return o; }

/* Feldolgozási lépések: csak ténylegesen végrehajtott lépések jelennek meg.
   Az AI-elemzés egyetlen hívás; az azonosítás / állapot / értékbecslés lépései a válasz folyamatos érkezését követik. */
const STEP_DEF = [["check","Checking image"],["detect","Detecting stamps"],["ident","Identification"],["cond","Assessing condition"],["value","Valuation"]];
function stepsHTML(st){
  return `<h3 class="sec-t">Processing</h3><ol class="steps">${STEP_DEF.map(([k, l]) => { const s = st[k] || {}; return `<li class="step ${s.state || "wait"}"><span class="dot">${s.state === "done" ? ic("check",14) : s.state === "act" ? '<span class="pulse"></span>' : ""}</span><div><b>${l}</b>${s.note ? `<small>${esc(s.note)}</small>` : ""}</div></li>`; }).join("")}</ol>
    <div class="muted" style="font-size:0.7812rem;margin-top:6px">Identification, condition assessment and valuation are done by a single AI analysis; the steps follow the response as it arrives.</div>`;
}
function countOf(t, k){ let n = 0, i = 0; while ((i = t.indexOf(k, i)) >= 0) { n++; i += k.length; } return n; }
async function analyze(){
  const sample = await getSample();
  if (!sample) return showErr("AI recognition is not available in this view. Open the app on claude.ai while signed in.");
  let lim = null; try { lim = await sample.limits(); } catch(e){}
  if (lim && !lim.images) return showErr("Image recognition is not enabled in this view.");
  const mode = S.mode, q = S[curKey()+"Q"] || [], bad = q.filter(i => !i.ok).length;
  $("#aiMissing").style.display = "none"; $("#scanForm").style.display = "none"; $("#result").innerHTML = ""; $("#cropEd").innerHTML = "";
  const st = {check:{state:"done", note: bad ? `${bad} warning(s)` : "OK"}, detect:{state:"act"}, ident:{}, cond:{}, value:{}};
  const L = $("#loading"); L.style.display = "block"; L.innerHTML = stepsHTML(st);
  const upd = t => {
    const nb = mode === "page" ? countOf(t, '"bbox"') : (t.includes('"felismerve"') ? 1 : 0);
    const ni = countOf(t, '"jeloltek"'), nc = countOf(t, '"allapot"'), nv = countOf(t, '"becsult_ertek"');
    if (nb) st.detect = {state: ni ? "done" : "act", note: mode === "page" ? `${nb} stamp(s) detected` : "stamp in the photo"};
    if (ni) st.ident = {state: nc ? "done" : "act", note: mode === "page" ? `${ni}/${nb}` : ""};
    if (nc) st.cond = {state: t.includes('"arak"') ? "done" : "act", note: mode === "page" ? `${nc}/${nb}` : ""};
    if (t.includes('"arak"')) st.value = {state: "act", note: mode === "page" ? `${nv}/${nb}` : ""};
    L.innerHTML = stepsHTML(st);
  };
  try {
    const images = mode === "single" ? [S.front, ...(S.back ? [S.back] : [])] : [S.page];
    const out = await sample(buildPrompt(mode, !!S.back), { images, modelTier: "complex", onText: ({text}) => { try { upd(text || ""); } catch(e){} } });
    const scan = normScan(parseJSON(out.text));
    const cv = mode === "single" ? S.frontCanvas : S.pageCanvas;
    scan.stamps.forEach(s => { s._thumb = crop(cv, s.bbox) || (mode === "single" ? S.thumb : ""); });
    if (!scan.stamps.length) throw new Error(mode === "page" ? "no stamp found in the photo" : "empty response");
    for (const k of ["detect","ident","cond","value"]) st[k] = {...st[k], state:"done"};
    L.innerHTML = stepsHTML(st);
    scan.mode = mode; scan.truncated = !!out.truncated;
    S.scan = scan; S.saved = false; S.savedIds = [];
    S.savePf = S.activePf === "all" ? "default" : S.activePf;
    haptic(15);
    await new Promise(r => setTimeout(r, 350));
    L.style.display = "none";
    if (mode === "page") openCropEditor(); else renderScanResult();
  } catch(e) {
    L.style.display = "none"; $("#scanForm").style.display = "block";
    const code = e?.code;
    showErr(code === "not_granted" ? "AI access is not enabled for this page."
      : code === "rate_limited" ? "Too many requests in a short time – wait a minute and try again."
      : "Analysis failed: " + (e?.message || "unknown error") + ". Try again with a sharper photo" + (mode === "page" ? ", or with fewer stamps per photo." : "."));
  }
}

/* ---------- albumoldal: kivágások ellenőrzése és javítása ---------- */
const CE = {sel:-1, drag:null};
function ceBoxes(){ return S.scan.stamps.map((s, i) => ({s, i})).filter(o => !o.s._deleted && Array.isArray(o.s.bbox)); }
function openCropEditor(){
  CE.sel = -1;
  $("#result").innerHTML = "";
  $("#cropEd").innerHTML = `<div class="card crop-ed">
    <h3 class="sec-t">Check the crops</h3>
    <p class="muted" style="font-size:0.8438rem;margin:2px 0 10px">Tap a crop to select it and drag its corner to adjust. You can delete false detections and add missed stamps.</p>
    <div class="ce-stage" id="ceStage"><img src="${S.pageURL}" alt="Album page" draggable="false"><svg id="ceSvg" viewBox="0 0 1000 1000" preserveAspectRatio="none"></svg></div>
    <div class="row" style="margin-top:10px"><button class="btn ghost" data-act="ce-add">${ic("plus",18)} New crop</button><button class="btn danger" data-act="ce-del" id="ceDel" disabled>${ic("trash",18)} Delete</button></div>
    <button class="btn primary" data-act="ce-ok" style="margin-top:10px">${ic("check",18)} Approve crops</button>
  </div>`;
  ceDraw(); ceBind();
}
function ceDraw(){
  const svg = $("#ceSvg"); if (!svg) return;
  svg.innerHTML = ceBoxes().map(({s, i}, n) => { const [x0, y0, x1, y1] = s.bbox, on = i === CE.sel, cls = s._new ? "new" : "";
    return `<g class="ce-box ${on ? "on" : ""} ${cls}" data-ce="${i}"><rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" vector-effect="non-scaling-stroke"/>${on ? [[x0,y0,"nw"],[x1,y0,"ne"],[x0,y1,"sw"],[x1,y1,"se"]].map(([x, y, h]) => `<rect class="h" data-h="${h}" x="${x - 18}" y="${y - 18}" width="36" height="36" vector-effect="non-scaling-stroke"/>`).join("") : ""}<text x="${x0 + 8}" y="${y0 + 34}">${n + 1}</text></g>`; }).join("");
  const d = $("#ceDel"); if (d) d.disabled = CE.sel < 0;
}
function cePt(e){ const r = $("#ceSvg").getBoundingClientRect(); return [Math.max(0, Math.min(1000, (e.clientX - r.left) / r.width * 1000)), Math.max(0, Math.min(1000, (e.clientY - r.top) / r.height * 1000))]; }
function ceBind(){
  const svg = $("#ceSvg"); if (!svg) return;
  svg.addEventListener("pointerdown", e => {
    const g = e.target.closest("[data-ce]"); const h = e.target.dataset?.h;
    if (!g) { CE.sel = -1; ceDraw(); return; }
    const i = +g.dataset.ce; CE.sel = i; const [px, py] = cePt(e);
    CE.drag = {i, h: h || "move", px, py, b: [...S.scan.stamps[i].bbox]};
    try { svg.setPointerCapture(e.pointerId); } catch(err){}
    ceDraw(); e.preventDefault();
  });
  svg.addEventListener("pointermove", e => {
    if (!CE.drag) return; const d = CE.drag, [px, py] = cePt(e), dx = px - d.px, dy = py - d.py, b = [...d.b];
    if (d.h === "move") { const w = b[2] - b[0], h = b[3] - b[1]; b[0] = Math.max(0, Math.min(1000 - w, b[0] + dx)); b[1] = Math.max(0, Math.min(1000 - h, b[1] + dy)); b[2] = b[0] + w; b[3] = b[1] + h; }
    else { if (d.h.includes("w")) b[0] = Math.min(b[2] - 30, b[0] + dx); if (d.h.includes("e")) b[2] = Math.max(b[0] + 30, b[2] + dx); if (d.h.includes("n")) b[1] = Math.min(b[3] - 30, b[1] + dy); if (d.h.includes("s")) b[3] = Math.max(b[1] + 30, b[3] + dy); }
    const st = S.scan.stamps[d.i]; st.bbox = b.map(v => Math.round(v)); st._moved = true; ceDraw();
  });
  const end = () => { CE.drag = null; };
  svg.addEventListener("pointerup", end); svg.addEventListener("pointercancel", end);
}
async function ceConfirm(btn){
  const cv = S.pageCanvas, fresh = [];
  for (const s of S.scan.stamps) {
    if (s._deleted) { s._incl = false; s.felismerve = false; s._removed = true; continue; }
    if (s._moved || s._new) s._thumb = crop(cv, s.bbox) || s._thumb;
    if (s._new) fresh.push(s);
  }
  if (fresh.length) {
    const sample = await getSample();
    if (!sample) { toast("Analysing new crops requires AI access."); }
    else {
      btn.disabled = true;
      for (let n = 0; n < fresh.length; n++) {
        const s = fresh[n]; btn.innerHTML = `<span class="spin sm"></span> Analysing new crop ${n + 1}/${fresh.length}…`;
        try {
          const c2 = document.createElement("canvas"); const [x0, y0, x1, y1] = s.bbox, W = cv.width, H = cv.height;
          c2.width = Math.max(10, Math.round((x1 - x0) / 1000 * W)); c2.height = Math.max(10, Math.round((y1 - y0) / 1000 * H));
          c2.getContext("2d").drawImage(cv, x0 / 1000 * W, y0 / 1000 * H, c2.width, c2.height, 0, 0, c2.width, c2.height);
          const out = await sample(buildPrompt("single", false), {images:[await toBlob(c2, .88)], modelTier:"complex"});
          const sc = normScan(parseJSON(out.text)), got = sc.stamps[0];
          if (got) { const keep = {bbox:s.bbox, _thumb:s._thumb}; Object.keys(s).forEach(k => delete s[k]); Object.assign(s, got, keep, {_new:false}); }
          Object.assign(S.scan.series, sc.series);
        } catch(e) { s.felismerve = false; s.leiras = "The new crop could not be analysed."; s._new = false; }
      }
    }
  }
  S.scan.stamps = S.scan.stamps.filter(s => !s._removed);
  $("#cropEd").innerHTML = ""; renderScanResult(); window.scrollTo(0, 0);
}
function showErr(m){ const el = $("#aiMissing"); el.textContent = m; el.style.display = "block"; }

/* ---------- estimate ---------- */
function estimate(r, cond, grade){
  const be = r?.becsult_ertek;
  if (cond === r?.allapot?.tipus && grade === r?.allapot?.fokozat && be && +be.max > 0) return {min:+be.min||0, max:+be.max, ai:true};
  const band = r?.arak?.[cond]; if (!band) return {min:0, max:0};
  const lo = +band.min || 0, hi = +band.max || lo, p = (GRADES.find(g => g.k === grade) || GRADES[3]).p, span = hi - lo;
  return { min: r2(lo + span*Math.max(0, p-.2)), max: r2(lo + span*Math.min(1, p+.1)), ai:false };
}

/* ---------- identification status ---------- */
/* i18n-skip-start */
const RAR = ["gyakori","kevésbé gyakori","ritka","nagyon ritka"];
/* i18n-skip-end */
const RAR_L = {"gyakori": "common", "kevésbé gyakori": "less common", "ritka": "rare", "nagyon ritka": "very rare"};
/* i18n-skip-start */ const UNK = "ismeretlen"; /* i18n-skip-end */   // mezőforrás-kód: nem felirat
const ST_L = {kepen:"read from stamp", ai:"AI suggestion", ismeretlen:"unknown", megerositett:"confirmed"};
function fieldSt(r, key, val){
  if (val == null || String(val).trim() === "") return UNK;
  const f = r.mezo_forras?.[key];
  return ST_L[f] && f !== "ismeretlen" ? f : "ai";
}
const stTag = st => st === "ismeretlen" ? "" : `<span class="st st-${st}">${ST_L[st]}</span>`;
const valOr = v => (v != null && String(v).trim() !== "") ? esc(v) : `<span class="unk">unknown</span>`;
function catText(k){ return [k?.mbk && "MBK " + k.mbk, k?.michel && "Michel " + k.michel, k?.scott && "Scott " + k.scott, k?.sg && "SG " + k.sg].filter(Boolean).join(" · "); }
function confLevel(c){ return c >= 80 ? ["g","high"] : c >= 50 ? ["y","medium"] : ["r","low"]; }
const today = t => new Date(t || Date.now()).toLocaleDateString(window.BS.LOC);
const METHOD_L = {"ai-foto":"AI estimate from photo", "ai-ujrabecsles":"AI re-estimate (price update)", "ai-1.0":"AI estimate (version 1.0)"};
function idCardHTML(r, o){
  const confirmed = !!o.confirmed, k = r.katalogus || {}, cat = catText(k);
  const rows = [["Name","nev",r.nev],["Country","orszag",r.orszag],["Year of issue","kiadas_eve",r.kiadas_eve],["Face value","nevertek",r.nevertek],["Series","sorozat",r.sorozat],["Colour","szin",r.szin]]
    .map(([l, key, v]) => `<dt>${l}</dt><dd>${valOr(v)}${stTag(fieldSt(r, key, v))}</dd>`).join("")
    + `<dt>Catalogue no.</dt><dd>${valOr(cat)}${stTag(cat ? (r.mezo_forras?.katalogus === "megerositett" ? "megerositett" : "ai") : UNK)}</dd>`
    + `<dt>Rarity</dt><dd>${valOr(RAR_L[r.ritkasag] || r.ritkasag)}${stTag(r.ritkasag ? "ai" : UNK)}</dd>`;
  const jl = r.jeloltek || [];
  const cands = o.interactive && !confirmed && jl.length > 1 ? `<div style="margin-top:12px"><b style="font-size:0.875rem">Possible matches</b><div class="muted" style="font-size:0.7812rem">Choose the one that matches your stamp.</div>${jl.map((j, i) => `<div class="cand ${i === (o.cand||0) ? "on" : ""}" data-cand="${i}" role="radio" aria-checked="${i === (o.cand||0)}" tabindex="0"><span class="rd"></span><div><b style="font-size:0.875rem">${esc(j.nev || r.nev || "Candidate " + (i+1))}</b><div class="muted" style="font-size:0.7812rem">${esc([j.kiadas_eve, j.sorozat, catText(j.katalogus)].filter(Boolean).join(" · ") || "catalogue no. unknown")}</div>${j.indok ? `<div style="font-size:0.7812rem;margin-top:2px">${esc(j.indok)}</div>` : ""}</div><span class="chip ${confLevel(j.bizonyossag)[0]}" style="margin-left:auto">${j.bizonyossag}%</span></div>`).join("")}</div>` : "";
  const actions = o.interactive ? (confirmed
      ? `<div class="okbox">${ic("check",16)} Identification confirmed</div><button class="btn ghost small" style="margin-top:8px" data-act="editid">Edit details</button>`
      : `<div class="row" style="margin-top:12px"><button class="btn primary" data-act="confirmid">Correct, I confirm</button><button class="btn ghost" data-act="editid">Correct it</button></div>`)
    : (confirmed ? `<div class="okbox">${ic("check",16)} Identification confirmed</div>` : `<div class="warnbox" style="margin-bottom:0">Identification not confirmed – the details are AI suggestions.</div>`);
  return `<div class="card"><h3 class="sec-t">Identification</h3><dl class="facts">${rows}</dl>${cands}${actions}</div>`;
}

/* ---------- stamp detail ---------- */
function list(arr){ arr = (arr||[]).filter(x => x && String(x).trim()); return arr.length ? `<ul class="tight">${arr.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>` : `<div class="muted">–</div>`; }
const thumbHTML = t => t ? `<img src="${esc(t)}" alt="">` : `<div class="noimg">${ic("stamp",26)}</div>`;

function resultHTML(r, o){
  const {thumb, cond, grade, interactive} = o; const f = o.factor || 1;
  if (r.felismerve === false) return `<div class="card"><h2 class="sec-t">Could not identify</h2><p>${esc(r.leiras || "No stamp can be clearly recognised in the photo.")}</p><p class="muted" style="font-size:0.875rem">Try again: closer, in sharp focus, in even light.</p></div>`;
  const a = r.allapot || {}, k = r.katalogus || {}, confirmed = !!o.confirmed;
  const est = o.est || estimate(r, cond, grade);
  const conf = Math.max(0, Math.min(100, +r.bizonyossag || 0)), [cc, cl] = confLevel(conf);
  const cat = catText(k), priced = (+est.max || 0) > 0;
  const qProb = r.kepminoseg && r.kepminoseg.megfelelo === false ? (r.kepminoseg.problemak || []).filter(Boolean) : [];
  const rows = COND.map(c => { const b = r.arak?.[c.k] || {}; return `<tr class="${c.k===cond?"hl":""}"><td>${esc(c.l)}${c.k===a.tipus?'<span class="sm">condition in photo</span>':""}</td><td>${(+b.max||0) > 0 ? rng((+b.min||0)*f, (+b.max||0)*f, r) : '<span class="unk">no estimate</span>'}</td></tr>`; }).join("");
  return `
  ${qProb.length ? `<div class="warnbox"><b>Image quality issue:</b> ${esc(qProb.join("; "))}. The result may be inaccurate – consider taking a new photo.</div>` : ""}
  ${!confirmed && conf < 50 ? `<div class="warnbox"><b>Uncertain identification (${conf}%).</b> Check the possible matches or correct the details before saving.</div>` : ""}
  <div class="card"><div class="res-head">
    <div class="stamp big">${thumbHTML(thumb)}</div>
    <div style="min-width:0">
      <h2>${esc(r.nev || "Unknown stamp")}</h2>
      <div class="muted" style="font-size:0.875rem;margin-top:3px">${esc([r.orszag, r.kiadas_eve, r.nevertek].filter(Boolean).join(" · ")) || "other details unknown"}</div>
      <div class="chips"><span class="chip ${cc}">Identification: ${conf}% · ${cl}</span>${confirmed ? `<span class="chip g">✓ confirmed</span>` : `<span class="chip">not confirmed</span>`}${cat ? `<span class="chip">${esc(cat)}${r.mezo_forras?.katalogus === "megerositett" ? "" : " · AI suggestion"}</span>` : ""}</div>
    </div></div></div>
  <div class="value">
    <span class="est-tag">Preliminary AI estimate</span>
    <div class="lbl" style="margin-top:8px">${o.valueLabel || `${esc(condL(cond))}, ${esc(gradeL(grade))}`}</div>
    <div class="big">${priced ? rng(est.min, est.max, r) : "No estimate"}</div>
    <div class="sub">${priced ? fmtAlt(est.min, est.max, r) : "The stamp cannot be identified reliably enough to price it."}</div>
    ${o.extraValue || ""}
    <div class="why">Method: ${esc(METHOD_L[o.method] || METHOD_L["ai-foto"])}, without a live market or auction source · ${esc(o.dateText || today())}${r.ar_alap ? `<br>Basis: ${esc(r.ar_alap)}` : ""}${est.ai && r.becsult_ertek?.indoklas ? `<br>${esc(r.becsult_ertek.indoklas)}` : ""}</div>
  </div>
  ${idCardHTML(r, {interactive, confirmed, cand:o.cand})}
  ${interactive ? `<div class="card">
    <h3 class="sec-t">Fine-tune condition</h3>
    <div class="muted" style="font-size:0.8125rem">If it looks different in hand, change it – the price updates instantly.</div>
    <div class="seg">${COND.map(c => `<button data-cond="${c.k}" class="${c.k===cond?"on":""}">${esc(c.l)}</button>`).join("")}</div>
    <div class="seg">${GRADES.map(g => `<button data-grade="${g.k}" class="${g.k===grade?"on":""}">${gradeL(g.k)}</button>`).join("")}</div>
  </div>` : ""}
  ${o.afterValue || ""}
  <div class="card">
    <h3 class="sec-t">Price bands by condition</h3>
    <div class="muted" style="font-size:0.8125rem">Preliminary AI estimate – not a catalogue price and not live market data${r.katalogusar_eur ? ` · catalogue price (AI suggestion): ${esc(r.katalogusar_eur)}${/€|eur/i.test(r.katalogusar_eur)?"":" €"}` : ""}${f !== 1 ? " · adjusted by the latest price update" : ""}</div>
    <table class="pr">${rows}</table>
    ${r.magyar_piac ? `<div class="note-box"><b>Hungarian market</b> <span class="st st-ai">AI estimate</span><div style="margin-top:3px">${esc(r.magyar_piac)}</div></div>` : ""}
  </div>
  <div class="card">
    <h3 class="sec-t">Condition assessment <span class="st st-ai">AI suggestion</span></h3>
    <div style="display:flex;justify-content:space-between;font-size:0.875rem;margin-top:4px"><span>Quality score</span><b>${esc(a.pontszam ?? "–")}/10 · ${esc(gradeL(a.fokozat))}</b></div>
    <div class="meter"><i style="width:${Math.max(5, Math.min(100, (+a.pontszam||0)*10))}%"></i></div>
    <dl class="facts">
      ${a.centrirozas ? `<dt>Centring</dt><dd>${esc(a.centrirozas)}</dd>` : ""}
      ${a.fogazat_allapot ? `<dt>Perforation</dt><dd>${esc(a.fogazat_allapot)}</dd>` : ""}
      ${a.szin_allapot ? `<dt>Colour</dt><dd>${esc(a.szin_allapot)}</dd>` : ""}
      ${a.pecset ? `<dt>Cancellation</dt><dd>${esc(a.pecset)}</dd>` : ""}
    </dl>
    ${(a.hibak||[]).filter(Boolean).length ? `<div style="margin-top:10px;font-size:0.875rem"><b>Faults found</b>${list(a.hibak)}</div>` : ""}
    ${a.megjegyzes ? `<p class="muted" style="font-size:0.8438rem;margin:10px 0 0">${esc(a.megjegyzes)}</p>` : ""}
  </div>
  <div class="card">
    <h3 class="sec-t">Description and technical data <span class="st st-ai">AI suggestion</span></h3>
    <p style="margin:4px 0 8px;font-size:0.875rem">${esc(r.leiras || "")}</p>
    <dl class="facts">
      <dt>Perforation</dt><dd>${valOr(r.fogazat)}</dd>
      <dt>Watermark</dt><dd>${valOr(r.vizjel)}</dd>
      <dt>Printing</dt><dd>${valOr(r.nyomtatas)}</dd>
    </dl>
  </div>
  <div class="card">
    <h3 class="sec-t">Varieties that affect the price <span class="st st-ai">AI suggestion</span></h3>${list(r.valtozatok)}
    <h3 class="sec-t" style="margin-top:12px">How to check</h3>${list(r.ellenorzes)}
    ${r.hamisitas_kockazat ? `<h3 class="sec-t" style="margin-top:12px">Forgery risk</h3><div style="font-size:0.875rem">${esc(r.hamisitas_kockazat)}</div>` : ""}
    ${r.ertekesites ? `<h3 class="sec-t" style="margin-top:12px">Selling / buying</h3><div style="font-size:0.875rem">${esc(r.ertekesites)}</div>` : ""}
  </div>
  <div class="disc">All details are AI-based suggestions until you confirm them; prices are preliminary AI estimates without live market data. Watermark, gum and perforation gauge cannot be determined reliably from a photo; for valuable items, ask an expert.</div>`;
}

/* ---------- confirm & edit identification ---------- */
const EDIT_FIELDS = [["nev","Name"],["orszag","Country"],["kiadas_eve","Year of issue"],["nevertek","Face value"],["sorozat","Series"],["szin","Colour"]];
const CAT_FIELDS = [["mbk","MBK no."],["michel","Michel"],["scott","Scott"],["sg","Stanley Gibbons"]];
function editStamp(){ return S.scan?.stamps?.[S.editIdx ?? 0]; }
function applyCand(st, i){
  const j = st.jeloltek?.[i]; if (!j) return;
  st._cand = i; st.katalogus = {...(j.katalogus||{})};
  if (j.nev) st.nev = j.nev; if (j.kiadas_eve) st.kiadas_eve = j.kiadas_eve; if (j.sorozat) st.sorozat = j.sorozat;
  st.bizonyossag = j.bizonyossag;
}
function confirmStamp(st){
  st._confirmed = true; st.mezo_forras = {...(st.mezo_forras||{})};
  for (const [k] of EDIT_FIELDS) if (String(st[k]||"").trim()) st.mezo_forras[k] = "megerositett";
  if (catText(st.katalogus)) st.mezo_forras.katalogus = "megerositett";
}
function openEditForm(){
  const st = editStamp(); if (!st) return;
  openModal(`<h2 style="margin:8px 0 4px">Correct details</h2><p class="muted" style="font-size:0.8438rem;margin:0">Leave blank what you don’t know – it will show as “unknown”.</p>
    <form class="form" id="idForm">${EDIT_FIELDS.map(([k, l]) => `<label for="f-${k}">${l}</label><input class="field" id="f-${k}" name="${k}" value="${esc(st[k]||"")}">`).join("")}
    <h3 class="sec-t" style="margin-top:16px">Catalogue numbers</h3>${CAT_FIELDS.map(([k, l]) => `<label for="c-${k}">${l}</label><input class="field" id="c-${k}" name="cat_${k}" value="${esc(st.katalogus?.[k]||"")}">`).join("")}</form>
    <div class="row" style="margin-top:14px"><button class="btn ghost" data-act="editcancel">Cancel</button><button class="btn primary" data-act="editsave">Save and confirm</button></div>`);
  const keepIdx = S.editIdx; S.modalIdx = null; S.editIdx = keepIdx;
}
function saveEditForm(){
  const st = editStamp(), fm = $("#idForm"); if (!st || !fm) return;
  const fd = new FormData(fm); st.katalogus = {...(st.katalogus||{})};
  for (const [k] of EDIT_FIELDS) st[k] = String(fd.get(k)||"").trim();
  for (const [k] of CAT_FIELDS) st.katalogus[k] = String(fd.get("cat_"+k)||"").trim();
  st.mezo_forras = {...(st.mezo_forras||{})};
  for (const [k] of EDIT_FIELDS) st.mezo_forras[k] = st[k] ? "megerositett" : UNK;
  st.mezo_forras.katalogus = catText(st.katalogus) ? "megerositett" : UNK;
  st._confirmed = true;
  afterIdChange();
}
function afterIdChange(){
  if (S.scan?.mode === "page" && S.editIdx != null) { openPageStamp(S.editIdx); renderScanResult(); }
  else { closeModal(); renderScanResult(); }
}

/* ---------- series ---------- */
function matchMember(sdoc, st, aiIdx, fromScan){
  const tagok = sdoc?.tagok || []; const d = normDen(st.nevertek);
  if (fromScan && Number.isInteger(+aiIdx) && +aiIdx >= 0 && +aiIdx < tagok.length) {
    const td = normDen(tagok[+aiIdx].nevertek); if (!d || !td || td === d) return +aiIdx;
  }
  if (!d) return -1;
  const cands = tagok.map((t,i) => [t,i]).filter(([t]) => normDen(t.nevertek) === d);
  if (cands.length === 1) return cands[0][1];
  if (cands.length > 1) {
    const c = strip(st.szin);
    const hit = cands.find(([t]) => { const tc = strip(t.szin); return c && tc && (c.includes(tc) || tc.includes(c)); });
    return (hit || cands[0])[1];
  }
  return -1;
}
function ownedMap(key, items, n){
  const m = new Map();
  for (const i of items) if (i.seriesKey === key && i.memberIdx >= 0 && i.memberIdx < n && !m.has(i.memberIdx)) m.set(i.memberIdx, i);
  return m;
}
function completedKeys(items, smap){
  const out = new Set();
  for (const key in smap) { if (smap[key].allapot === "elutasitva") continue; const n = (smap[key].tagok||[]).length; if (n && ownedMap(key, items, n).size === n) out.add(key); }
  return out;
}
function seriesCardHTML(key, sdoc, owned, opt = {}){
  const tagok = sdoc.tagok || [], n = tagok.length, have = owned.size, done = n > 0 && have === n, ok = sdoc.allapot === "megerositett";
  const conds = [...owned.values()].map(o => o.cond || o._cond);
  const pc = conds.filter(c => c === "postatiszta" || c === "falcos").length > conds.length/2 ? "postatiszta" : "pecsetelt";
  const R = opt.r || gRate();
  let missCost = 0;
  const slots = tagok.map((t, i) => {
    const o = owned.get(i);
    if (o) return `<div class="sl ${o._pending?"new":""}" ${o.id ? `data-act="item" data-id="${esc(o.id)}"` : ""}><div class="stamp sm">${thumbHTML(o.thumb || o._thumb)}</div><span>${o._pending ? "NEW" : esc(t.nevertek)}</span></div>`;
    const p = t.ar?.[pc] || t.ar?.pecsetelt || {}; if (ok) missCost += mid(p);
    return `<div class="sl" data-act="missing" data-key="${esc(key)}" data-i="${i}"><div class="lk">${LOCK}<b>${esc(t.nevertek || "?")}</b></div><span>${ok && mid(p) ? "~" + fmt(mid(p), R) : "locked"}</span></div>`;
  }).join("");
  const ts = sdoc.teljes_sor?.[pc];
  return `<div class="series ${done?"done":""}">
    <div class="sh"><div><div class="stt">${esc(sdoc.cim || "Series")}</div><div class="ss">${esc([sdoc.orszag, sdoc.ev].filter(Boolean).join(" · "))}</div></div>
      <span class="badge ${done?"gold":""}">${done ? ic("trophy",14) + " Complete set" : `${have}/${n}`}</span></div>
    <div class="prog"><i style="width:${n ? Math.round(have/n*100) : 0}%"></i></div>
    <div class="slots">${slots}</div>
    <div class="sf">${done
      ? `<span>You have every value!</span>${ok && ts && mid(ts) ? `<span>As a complete set (AI estimate): <b>${rng(+ts.min, +ts.max, R)}</b></span>` : ""}`
      : `<span>Missing: <b>${n-have}</b> pcs</span>${missCost ? `<span>To complete approx. (AI estimate): <b>${fmt(missCost, R)}</b></span>` : ""}`}</div>
    ${ok ? "" : `<div class="warnbox" style="margin:10px 0 0;display:flex;align-items:center;gap:10px;justify-content:space-between"><span>The set list is an AI suggestion – completion prices appear after you confirm it.</span>${S.series[key] && !opt.noConfirm ? `<button class="btn small primary" data-act="sconfirm" data-key="${esc(key)}">Check it</button>` : ""}</div>`}
  </div>`;
}

/* ---------- scan result render ---------- */
function pendingItemsFor(stamps){
  return stamps.filter(s => s._incl && s.felismerve !== false && s._key).map(s => {
    const fromScan = !!S.scan.series[s._key] && !(S.series[s._key]?.tagok||[]).length;
    const sdoc = fromScan ? S.scan.series[s._key] : S.series[s._key];
    return {_pending:true, _thumb:s._thumb, cond:s._cond, seriesKey:s._key, memberIdx: sdoc ? matchMember(sdoc, s, s.sorozat_tag_index, fromScan) : -1};
  });
}
function scanSeriesHTML(stamps){
  const keys = [...new Set(stamps.filter(s => s._incl && s._key).map(s => s._key))];
  const pend = pendingItemsFor(stamps);
  return keys.map(k => {
    const sdoc = (S.series[k]?.tagok||[]).length ? S.series[k] : S.scan.series[k]; if (!sdoc) return "";
    const n = sdoc.tagok.length;
    const own = ownedMap(k, S.items, n);
    for (const p of pend) if (p.seriesKey === k && p.memberIdx >= 0 && !own.has(p.memberIdx)) own.set(p.memberIdx, p);
    return seriesCardHTML(k, sdoc, own, {r: S.scan, noConfirm: true});
  }).join("");
}
function pfName(id){ return id === "all" ? "Whole collection" : id === "default" ? "My collection" : (S.portfolios.find(p => p.id === id)?.name || "Portfolio"); }
function pfList(){ return [{id:"default", name:"My collection"}, ...S.portfolios]; }
function dupKey(r, seriesKey, memberIdx){
  if (seriesKey && memberIdx >= 0) return seriesKey + "#" + memberIdx;
  return slug([r?.nev, r?.orszag, r?.kiadas_eve, r?.nevertek].filter(Boolean).join(" "));
}
function dupCountFor(st){
  const k = dupKey(st, "", -1), sd = st._key && S.series[st._key], idx = sd ? matchMember(sd, st, st.sorozat_tag_index, false) : -1;
  return S.items.filter(i => (k && dupKey(i.result, "", -1) === k) || (idx >= 0 && i.seriesKey === st._key && i.memberIdx === idx)).length;
}
function savePanelHTML(count){
  if (S.saved) return `<div class="row" style="margin-top:6px"><button class="btn primary" data-act="opencoll">Open collection</button><button class="btn ghost" data-act="new">New scan</button></div>`;
  if (!count) return `<div class="row" style="margin-top:6px"><button class="btn ghost" data-act="new">New scan</button></div>`;
  return `<div class="card"><h3 class="sec-t">Save to</h3>
    <div class="muted" style="font-size:0.7812rem;margin-top:6px">Portfolio</div>
    <div class="seg">${pfList().map(p => `<button data-act="savepf" data-pf="${esc(p.id)}" class="${p.id===S.savePf?"on":""}">${esc(p.name)}</button>`).join("")}<button data-act="newpf" data-from="save">+ New portfolio</button></div>
    ${S.albums.length ? `<div class="muted" style="font-size:0.7812rem;margin-top:10px">Virtual album</div><div class="seg"><button data-act="savealb" data-alb="" class="${!S.saveAlbum?"on":""}">None</button>${S.albums.map(a => `<button data-act="savealb" data-alb="${esc(a.id)}" class="${a.id===S.saveAlbum?"on":""}">${esc(a.name)}</button>`).join("")}</div>` : ""}</div>
    <div class="row"><button class="btn primary" data-act="save">${S.scan.mode === "page" ? /* i18n-skip-start: szórend */ T(`${count} bélyeg mentése`, `Save ${count} stamps`) /* i18n-skip-end */ : "Save to portfolio"}</button><button class="btn ghost" data-act="new">New scan</button></div>`;
}
function renderScanResult(){
  const sc = S.scan; if (!sc) return;
  const ok = sc.stamps.filter(s => s.felismerve !== false);
  const incl = ok.filter(s => s._incl);
  let html = "";
  if (sc.mode === "single") {
    const st = sc.stamps[0];
    const ser = st.felismerve !== false ? scanSeriesHTML([st]) : "";
    S.editIdx = 0;
    const dn = st.felismerve !== false && !S.saved ? dupCountFor(st) : 0;
    html = (dn ? `<div class="warnbox">${ic("copy",16)} <b>Duplicate?</b> You already have ${dn} of this stamp in the collection. It will be saved as a separate copy marked “duplicate”.</div>` : "") + resultHTML(st, {thumb:st._thumb, cond:st._cond, grade:st._grade, interactive:!S.saved, confirmed:st._confirmed, cand:st._cand,
      afterValue: ser ? `<div class="sec-h" style="margin-top:4px"><h3>Series</h3><span class="muted" style="font-size:0.7812rem">tap the locked slots</span></div>${ser}` : ""});
  } else {
    let lo = 0, hi = 0; incl.forEach(s => { const e = estimate(s, s._cond, s._grade); lo += e.min; hi += e.max; });
    const nConf = incl.filter(s => s._confirmed).length, nLow = incl.filter(s => !s._confirmed && (+s.bizonyossag||0) < 50).length;
    html = `<div class="value"><span class="est-tag">Preliminary AI estimate</span><div class="lbl" style="margin-top:8px">Album page – ${incl.length}/${ok.length} stamps selected</div>
      <div class="big">${rng(lo, hi, sc)}</div><div class="sub">${fmtAlt(lo, hi, sc)}</div>
      <div class="why">Confirmed: ${nConf}/${incl.length}${nLow ? ` · uncertain: ${nLow} (yellow mark)` : ""}. Tap a stamp to check its identification, refine its condition or exclude it.</div></div>
      ${!S.saved ? `<button class="btn ghost small" data-act="ce-open" style="margin:4px 0 0">${ic("crop",16)} Edit crops</button>` : ""}
      ${sc.truncated ? `<div class="err">The response was too long, so not every stamp was processed. Photograph the rest separately.</div>` : ""}
      <div class="pgrid">${sc.stamps.map((s, i) => {
        if (s.felismerve === false) return "";
        const e = estimate(s, s._cond, s._grade);
        return `<div class="pc ${s._incl?"":"off"}" data-act="pstamp" data-i="${i}"><span class="ck">${s._incl?"✓":"–"}</span>${!s._confirmed && (+s.bizonyossag||0) < 50 ? `<span class="lo" title="Uncertain identification">?</span>` : ""}<div class="stamp">${thumbHTML(s._thumb)}</div><div class="n">${esc(s.nev || "Stamp")}</div><div class="p">${(+e.max||0) > 0 ? fmt(mid(e), sc) : "no estimate"}</div><div class="s ${s._confirmed ? "ok" : ""}">${s._confirmed ? "✓ confirmed" : "not confirmed"}${dupCountFor(s) ? " · duplicate?" : ""}</div></div>`;
      }).join("")}</div>
      ${sc.stamps.some(s => s.felismerve === false) ? `<div class="disc">${sc.stamps.filter(s => s.felismerve === false).length} item(s) could not be identified as stamps.</div>` : ""}
      ${(() => { const h = scanSeriesHTML(sc.stamps); return h ? `<div class="sec-h"><h3>Series on this page</h3></div>${h}` : ""; })()}
      <div class="disc">Identifications and prices are AI suggestions until you confirm them; prices are preliminary AI estimates without live market data.</div>`;
  }
  $("#result").innerHTML = html + savePanelHTML(sc.mode === "single" ? (ok.length ? 1 : 0) : incl.length);
}
function openPageStamp(i){
  S.modalIdx = i; S.editIdx = i; const s = S.scan.stamps[i];
  openModal(resultHTML(s, {thumb:s._thumb, cond:s._cond, grade:s._grade, interactive:true, confirmed:s._confirmed, cand:s._cand})
    + `<div class="row"><button class="btn ${s._incl?"ghost":"primary"}" data-act="incl">${s._incl ? "Exclude from saving" : "Include in saving"}</button><button class="btn ghost" data-act="close">Done</button></div>`);
}
function resetScan(){
  for (const w of ["front","page","back"]) { if (S[w+"URL"]) URL.revokeObjectURL(S[w+"URL"]); S[w] = null; S[w+"URL"] = null; S[w+"Q"] = null; }
  S.thumb = null; S.frontCanvas = null; S.pageCanvas = null; S.backCanvas = null; S.scan = null; S.saved = false;
  $("#result").innerHTML = ""; $("#cropEd").innerHTML = ""; $("#loading").style.display = "none"; $("#scanForm").style.display = "block"; $("#aiMissing").style.display = "none";
  renderSlots(); window.scrollTo(0,0);
}
function setMode(m){
  S.mode = m;
  document.querySelectorAll("#modeSw button").forEach(b => { b.classList.toggle("on", b.dataset.m === m); b.setAttribute("aria-selected", b.dataset.m === m); });
  renderSlots();
}

/* ---------- storage ---------- */
const store = {
  mode:"pending", coll:null, local:{},
  async put(id, data){
    const clean = JSON.parse(JSON.stringify(data)); delete clean.id; if (clean.schema == null) clean.schema = 1;
    if (this.mode === "db") return this.coll.doc(id).set(clean);
    this.local[id] = clean; this.persist(); idb.put(id, clean); ingestLocal();
  },
  async del(id){
    if (this.mode === "db") return this.coll.doc(id).delete();
    delete this.local[id]; this.persist(); idb.del(id); ingestLocal();
  },
  persist(){
    if (this.lsOff) return;
    try { localStorage.setItem("bs_docs", JSON.stringify(this.local)); }
    catch(e){
      // A gyors tár (localStorage) megtelt: innentől csak az IndexedDB tárol, ami sokkal nagyobb.
      if (idb.ok) { this.lsOff = true; try { localStorage.removeItem("bs_docs"); localStorage.setItem("bs_idb_only", "1"); } catch(_){} }
      else toast("Device storage is full.");
    }
  }
};
/* Helyi tárolás IndexedDB-ben (a claude.ai-n kívül, pl. a telefonra kitett ikonról indítva). */
const idb = {
  ok:false, db:null,
  open(){
    return new Promise(res => {
      try {
        if (!window.indexedDB) return res(false);
        const r = indexedDB.open("philora", 2);
        r.onupgradeneeded = () => { if (!r.result.objectStoreNames.contains("docs")) r.result.createObjectStore("docs"); };
        r.onsuccess = () => { this.db = r.result; this.ok = true; res(true); };
        r.onerror = r.onblocked = () => res(false);
      } catch(e){ res(false); }
    });
  },
  tx(mode){ return this.db.transaction("docs", mode).objectStore("docs"); },
  all(){
    return new Promise(res => {
      try { const o = {}, st = this.tx("readonly"), c = st.openCursor();
        c.onsuccess = () => { const cur = c.result; if (cur) { o[cur.key] = cur.value; cur.continue(); } else res(o); };
        c.onerror = () => res(null);
      } catch(e){ res(null); }
    });
  },
  put(id, v){ if (!this.ok) return; try { this.tx("readwrite").put(v, id); } catch(e){ toast(T("Mentési hiba a helyi tárban.", "Couldn’t save to local storage.")); } },
  del(id){ if (!this.ok) return; try { this.tx("readwrite").delete(id); } catch(e){} },
  putAll(o){ if (!this.ok) return; try { const st = this.tx("readwrite"); for (const [k, v] of Object.entries(o)) st.put(v, k); } catch(e){} }
};
function normItem(d){ return {...d, kind:"item", pf:d.pf||"default", first: d.first ?? mid(d), seriesKey:d.seriesKey||"", memberIdx: Number.isInteger(d.memberIdx) ? d.memberIdx : -1, priceHistory:d.priceHistory||[]}; }
function ingest(list){
  const items = [], series = {}, pfs = [], albums = [], wishes = []; let hist = {points:[]}, prefs = {};
  for (const d of list) {
    const k = d.kind || (d.result ? "item" : "");
    if (k === "item") items.push(normItem(d));
    else if (k === "series") series[d.id] = d;
    else if (k === "portfolio") pfs.push(d);
    else if (k === "hist") hist = d;
    else if (k === "album") albums.push(d);
    else if (k === "wish") wishes.push(d);
    else if (k === "prefs") prefs = d;
  }
  albums.sort((a,b) => (a.createdAt||0) - (b.createdAt||0)); wishes.sort((a,b) => (b.createdAt||0) - (a.createdAt||0));
  items.sort((a,b) => (b.createdAt||0) - (a.createdAt||0));
  pfs.sort((a,b) => (a.createdAt||0) - (b.createdAt||0));
  Object.assign(S, {items, series, portfolios:pfs, hist, raw:list, albums, wishes, prefs});
  const newest = items.filter(i => validRate(i.result?.eur_huf)).sort((a,b) => (b.lastPriced||b.createdAt||0) - (a.lastPriced||a.createdAt||0))[0];
  S.dispRate = newest ? validRate(newest.result.eur_huf) : 0;
  if (!S.noMigrate) setTimeout(() => migrate(list), 0);
  if (!["all","default"].includes(S.activePf) && !pfs.some(p => p.id === S.activePf)) S.activePf = "all";
  renderPf(); refreshViews();
}
function refreshViews(){
  const B = window.BS;
  try { if (S.view === "home") B.renderHome?.(); if (S.view === "coll") B.renderCollection?.(); if (S.view === "learn") B.renderLearn?.(); B.refreshDetail?.(); B.refreshAtlas?.(); B.refreshHeritage?.(); } catch(e){ console.error(e); }
}
function ingestLocal(){ const l = Object.entries(store.local).map(([id, d]) => ({id, ...d})); S.realRaw = l; ingest(l); }
async function initStore(){
  await waitClaude();
  try {
    const db = window.claude?.use ? await window.claude.use("db") : null;
    const user = window.claude?.use ? await window.claude.use("user") : null;
    const uid = db && user ? await user.id() : null;
    if (db && uid) {
      store.coll = db.collection("data/users/" + uid); store.mode = "db"; store.db = db; store.uid = uid;
      S.note = "Loading…"; renderPf(); refreshViews();
      const t = setTimeout(() => { S.note = "The portfolio is not available right now – it may be out of date."; renderPf(); }, 10000);
      store.coll.onSnapshot(snap => {
        if (!snap.metadata.fromCache) { clearTimeout(t); S.note = ""; }
        const l = snap.docs.map(d => ({id:d.id, ...d.data()})); S.realRaw = l; ingest(l);
      }, () => { clearTimeout(t); S.note = "The portfolio could not be loaded."; renderPf(); });
      return;
    }
  } catch(e){}
  store.mode = "local";
  try { store.local = JSON.parse(localStorage.getItem("bs_docs") || "{}"); } catch(e){ store.local = {}; }
  try { const old = JSON.parse(localStorage.getItem("bs_items") || "[]"); for (const o of old) if (o.id && !store.local[o.id]) store.local[o.id] = {...o, kind:"item"}; } catch(e){}
  if (await idb.open()) {
    const fromIdb = await idb.all();
    if (fromIdb && Object.keys(fromIdb).length) store.local = fromIdb;   // az IndexedDB a mérvadó
    else if (Object.keys(store.local).length) idb.putAll(store.local);    // első indítás: átköltöztetés
    try { if (localStorage.getItem("bs_idb_only")) store.lsOff = true; } catch(e){}
    try { navigator.storage?.persist?.(); } catch(e){}
  }
  S.note = "The portfolio is stored on this device only for now.";
  ingestLocal();
}

/* ---------- history ---------- */
async function recordHist(items, lastRefresh){
  const pt = {t:Date.now(), all:r2(items.reduce((s,i) => s+mid(i), 0)), pf:{}};
  for (const i of items) pt.pf[i.pf] = r2((pt.pf[i.pf]||0) + mid(i));
  const pts = (S.hist.points||[]).slice();
  if (!lastRefresh && pts.length && pt.t - pts[pts.length-1].t < 60e3) pts[pts.length-1] = pt; else pts.push(pt);
  while (pts.length > 300) pts.shift();
  try { await store.put("hist", {kind:"hist", points:pts, lastRefresh: lastRefresh || S.hist.lastRefresh || 0}); } catch(e){}
}

/* ---------- save ---------- */
let saving = false;
async function saveScan(){
  if (saving || S.saved || !S.scan) return;
  const stamps = S.scan.stamps.filter(s => s.felismerve !== false && s._incl);
  if (!stamps.length) return toast("No stamp selected.");
  saving = true;
  const btn = document.querySelector('[data-act="save"]'); if (btn) { btn.disabled = true; btn.textContent = "Saving…"; }
  const now = Date.now(), pf = S.savePf, written = {}, newItems = [];
  const before = completedKeys(S.items, S.series);
  try {
    for (const st of stamps) {
      let key = st._key, sdoc = null, fromScan = false;
      if (key) {
        if (written[key]) { sdoc = written[key]; fromScan = true; }
        else {
          const sc = S.scan.series[key], ex = S.series[key];
          if (sc && (!ex || !(ex.tagok||[]).length)) { sdoc = {...sc, updatedAt:now}; await store.put(key, sdoc); written[key] = sdoc; fromScan = true; }
          else sdoc = ex || null;
        }
        if (!sdoc) key = "";
      }
      const memberIdx = sdoc ? matchMember(sdoc, st, st.sorozat_tag_index, fromScan) : -1;
      const e = estimate(st, st._cond, st._grade);
      const cv = S.scan.mode === "single" ? S.frontCanvas : S.pageCanvas;
      const photo = cropHi(cv, S.scan.mode === "single" && !Array.isArray(st.bbox) ? [0,0,1000,1000] : st.bbox, 800, .78) || st._thumb || "";
      const backPhoto = S.scan.mode === "single" && S.backCanvas ? toCanvas(S.backCanvas, 600).toDataURL("image/jpeg", .72) : "";
      const dk = dupKey(st, key, memberIdx), dupN = S.items.filter(i => dupKey(i.result, i.seriesKey, i.memberIdx) === dk).length + newItems.filter(i => dupKey(i.result, i.seriesKey, i.memberIdx) === dk).length;
      const id = uidGen("it_");
      const item = {kind:"item", createdAt: now + newItems.length, thumb: st._thumb || "", photo, backPhoto, cond: st._cond, grade: st._grade,
        peldany: {kod: window.BS.BRAND.codePrefix + "-" + id.slice(-6).toUpperCase(), tipus: dupN ? "duplikatum" : "gyujtemeny", album: S.saveAlbum || "", hely: "", megjegyzes: "", beszerzes: null},
        min: r2(e.min), max: r2(e.max), first: r2(mid(e)), result: cleanStamp(st), pf, seriesKey: key, memberIdx,
        priceHistory: [{t:now, min:r2(e.min), max:r2(e.max)}], lastPriced: now, schema: 2,
        azonositas: {megerositve: !!st._confirmed, jelolt: st._cand || 0, mezoForras: {...(st.mezo_forras||{})}, bizonyossag: +st.bizonyossag || 0},
        ertekelesek: [{t:now, min:r2(e.min), max:r2(e.max), modszer:"ai-foto", forras:null}]};
      await store.put(id, item);
      newItems.push({id, ...item});
    }
    const ids = new Set(newItems.map(i => i.id));
    const all = [...newItems, ...S.items.filter(i => !ids.has(i.id))];
    const smap = {...S.series, ...written};
    await recordHist(all);
    S.saved = true; renderScanResult(); haptic(20);
    const after = completedKeys(all, smap);
    const fresh = [...after].filter(k => !before.has(k));
    if (fresh.length) {
      const k = fresh[0], sdoc = smap[k];
      openModal(`<div class="trophy">${window.BS.brandImg("medals.seriesComplete", `<div class="ic-wrap">${ic("trophy",40)}</div>`, 'class="medal"')}<h2 style="margin-top:8px">Complete series!</h2><p class="muted">You have collected every value of <b>${esc(sdoc.cim)}</b> .</p></div>`
        + seriesCardHTML(k, sdoc, ownedMap(k, all, sdoc.tagok.length)) + `<button class="btn primary" data-act="close" style="margin-top:8px">Great!</button>`);
    } else {
      const k = newItems.find(i => i.seriesKey)?.seriesKey;
      const nd = newItems.filter(i => i.peldany?.tipus === "duplikatum").length;
      if (k && smap[k]) { const n = smap[k].tagok.length; toast(`${newItems.length} stamp(s) saved · ${smap[k].cim}: ${ownedMap(k, all, n).size}/${n}${nd ? ` · ${nd} duplicate(s)` : ""}`); }
      else toast(newItems.length + " stamp(s) saved" + (nd ? ` · ${nd} duplicate(s)` : ""));
    }
  } catch(e) {
    toast(e?.code === "quota_exceeded" ? "Storage is full – delete some items." : "Save error: " + (e?.message || "unknown"));
    if (btn) { btn.disabled = false; btn.textContent = "Save again"; }
  } finally { saving = false; }
}

/* ---------- price watch ---------- */
/* i18n-skip-start */
const REFRESH_PROMPT = `Bélyegpiaci szakértő vagy. Az alábbi bélyegekhez korábban becsült reális piaci értéktartomány tartozik EUR-ban (min, max), a megadott állapotban és minőségi fokozatban.
Add meg a MAI reális piaci értéktartományt. Csak akkor változtass, ha valódi piaci ok indokolja (pl. a téma vagy ország iránti kereslet változása, friss aukciós eredmények, gyűjtői trend, a forint árfolyamának változása magyar bélyegeknél). Ha nincs ilyen ok, add vissza PONTOSAN ugyanazokat az értékeket. Magyar bélyegeknél a hazai piacot vedd alapul. Ne adj véletlenszerű ingadozást.
${EN ? "Az \"indok\" mező ANGOLUL legyen. " : ""}CSAK JSON-nal válaszolj: {"eur_huf":395,"arak":[{"id":"","min":0,"max":0,"indok":"rövid, csak ha változott"}]}
Bélyegek: `;
/* i18n-skip-end */
async function refreshPrices(){
  if (S.refreshing) return;
  const sample = await getSample();
  if (!sample) return toast("AI is not available in this view.");
  const items = pfItems(S.activePf); if (!items.length) return;
  S.refreshing = true; renderPf();
  const beforeTotal = items.reduce((s,i) => s+mid(i), 0);
  const changes = [], updated = new Map(); let rt = null;
  try {
    for (let b = 0; b < items.length; b += 30) {
      const batch = items.slice(b, b+30).map(i => ({id:i.id, nev:i.result?.nev, orszag:i.result?.orszag, ev:i.result?.kiadas_eve, nevertek:i.result?.nevertek, mbk:i.result?.katalogus?.mbk||"", michel:i.result?.katalogus?.michel||"", allapot:i.cond, fokozat:i.grade, min:r2(i.min), max:r2(i.max)}));
      const out = await sample(REFRESH_PROMPT + JSON.stringify(batch), {modelTier:"default", cache:false});
      const res = parseJSON(out.text); if (+res.eur_huf > 200 && +res.eur_huf < 700) rt = +res.eur_huf;
      for (const p of (res.arak || [])) {
        const it = items.find(i => i.id === p.id); if (!it) continue;
        const mn = r2(p.min), mx = r2(Math.max(+p.min||0, +p.max||0)); if (!(mx > 0)) continue;
        const ch = Math.abs(mn - it.min) > Math.max(.005*it.min, .005) || Math.abs(mx - it.max) > Math.max(.005*it.max, .005);
        if (!ch) continue;
        const t = Date.now();
        const upd = {...it, min:mn, max:mx, lastPriced:t, priceHistory:[...(it.priceHistory||[]), {t, min:mn, max:mx}].slice(-50), ertekelesek:[...(it.ertekelesek||[]), {t, min:mn, max:mx, modszer:"ai-ujrabecsles", forras:null, indok:p.indok||""}].slice(-50)};
        if (rt) upd.result = {...it.result, eur_huf: rt};
        await store.put(it.id, upd); updated.set(it.id, upd);
        changes.push({it, upd, indok:p.indok});
      }
    }
    const all = S.items.map(i => updated.get(i.id) || i);
    await recordHist(all, Date.now());
    const afterTotal = pfItems(S.activePf, all).reduce((s,i) => s+mid(i), 0);
    const d = afterTotal - beforeTotal, pct = beforeTotal ? d/beforeTotal*100 : 0, R = gRate();
    openModal(`<h2 style="margin:8px 0 4px">Price update done</h2><div class="muted" style="font-size:0.8438rem">${esc(pfName(S.activePf))} · ${items.length} stamps checked</div>
      <div class="value" style="margin-top:12px"><div class="lbl">Total value</div><div class="big">${fmt(afterTotal, R)}</div>
      <div class="sub">${d === 0 ? "No change" : `${d > 0 ? "▲ +" : "▼ "}${fmt(Math.abs(d), R).replace(/^/, d < 0 ? "−" : "")} (${pct > 0 ? "+" : ""}${pct.toFixed(1).replace(".", window.BS.DEC)}%)`} · before ${fmt(beforeTotal, R)}</div></div>
      ${changes.length ? changes.map(c => { const up = mid(c.upd) >= mid(c.it); return `<div class="chg-row"><div><b>${esc(c.it.result?.nev || "Stamp")}</b><small>${esc(c.indok || "")}</small></div><div style="text-align:right;white-space:nowrap"><span class="${up?"":""}" style="color:${up?"var(--green2)":"var(--wine)"};font-weight:700">${up?"▲":"▼"} ${fmt(mid(c.upd), R)}</span><small>before ${fmt(mid(c.it), R)}</small></div></div>`; }).join("")
        : `<p class="muted">The stamp prices have not changed – the market is stable for these.</p>`}
      <div class="disc">AI-based re-estimate from current market knowledge, not live auction data.</div>
      <button class="btn primary" data-act="close" style="margin-top:8px">OK</button>`);
  } catch(e) {
    toast(e?.code === "rate_limited" ? "Too many requests – try later." : "The price update failed.");
  } finally { S.refreshing = false; renderPf(); }
}

/* ---------- portfolio view ---------- */
function pfItems(pf, items = S.items){ return pf === "all" ? items : items.filter(i => i.pf === pf); }
function sparkSVG(vals){
  const w = 320, h = 64, mn = Math.min(...vals), mx = Math.max(...vals), sp = (mx - mn) || 1;
  const pts = vals.map((v, i) => [i/(vals.length-1)*w, h - 6 - (v - mn)/sp*(h - 14)]);
  const line = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" role="img" aria-label="Value curve"><path d="${line} L${w} ${h} L0 ${h}Z" fill="rgba(255,255,255,.12)"/><path d="${line}" fill="none" style="stroke:var(--hero-accent)" stroke-width="2.2" vector-effect="non-scaling-stroke" stroke-linejoin="round"/><circle cx="${pts[pts.length-1][0]}" cy="${pts[pts.length-1][1]}" r="3.5" style="fill:var(--hero-accent)"/></svg>`;
}
function daysAgo(t){ if (!t) return "not yet"; const d = Math.floor((Date.now()-t)/864e5); return d <= 0 ? "today" : d === 1 ? "yesterday" : d + " days ago"; }
function itemRow(i){
  const r = i.result || {}, R = r, ch = mid(i) - (i.first||mid(i)), pct = i.first ? ch/i.first*100 : 0;
  return `<div class="item" data-act="item" data-id="${esc(i.id)}"><div class="stamp sm">${thumbHTML(i.thumb)}</div>
    <div style="min-width:0"><div class="t">${esc(r.nev || "Stamp")}</div><div class="s">${esc([r.orszag, r.kiadas_eve].filter(Boolean).join(" · "))}</div><div class="s">${esc(condL(i.cond))} · ${esc(gradeL(i.grade))}${i._dup ? " · duplicate" : ""}</div></div>
    <div class="v">${fmt(mid(i), R)}${Math.abs(pct) >= .5 ? `<small style="color:${ch>0?"var(--green2)":"var(--wine)"}">${ch>0?"▲":"▼"} ${Math.abs(pct).toFixed(0)}%</small>` : ""}</div></div>`;
}
function renderPf(){
  if (window.BS.renderPortfolio) return window.BS.renderPortfolio();
  const el = $("#pfWrap"); if (!el) return;
  const pf = S.activePf, items = pfItems(pf), R = gRate();
  const tot = items.reduce((s,i) => s+mid(i), 0), first = items.reduce((s,i) => s+(i.first ?? mid(i)), 0);
  const d = tot - first, pct = first ? d/first*100 : 0;
  const chips = `<div class="pfchips">${[{id:"all", name:"All"}, ...pfList()].map(p => `<button data-act="pf" data-pf="${esc(p.id)}" class="${p.id===pf?"on":""}">${esc(p.name)} <span style="opacity:.6">${pfItems(p.id).length}</span></button>`).join("")}<button class="add" data-act="newpf">+ New portfolio</button></div>`;
  const vals = (S.hist.points||[]).map(p => pf === "all" ? p.all : (p.pf?.[pf] || 0));
  const lastRef = S.hist.lastRefresh || 0, stale = items.length && Date.now() - lastRef > 7*864e5;
  const hero = `<div class="hero">
    <div class="top"><span class="nm">${esc(pfName(pf))}</span>${!["all","default"].includes(pf) ? `<button class="iconbtn" data-act="pfmenu" aria-label="Portfolio settings">${ic("more",20)}</button>` : ""}</div>
    <div style="margin-top:6px"><span class="est-tag">Preliminary AI estimate</span>${items.length ? ` <span style="font-size:0.75rem;opacity:.8">${items.filter(i => (+i.max||0) > 0).length}/${items.length} items priced · ${items.filter(i => i.azonositas?.megerositve).length} confirmed</span>` : ""}</div>
    <div class="tot">${items.length ? fmt(tot, R) : "–"}</div>
    <div class="chg ${d >= 0 ? "up" : "down"}">${items.length ? (Math.abs(d) < .005 ? "± 0 since saving" : `${d > 0 ? "▲ +" : "▼ −"}${fmt(Math.abs(d), R)} (${pct > 0 ? "+" : ""}${pct.toFixed(1).replace(".", window.BS.DEC)}%) since saving`) : "No stamps in this portfolio yet"}</div>
    ${vals.length >= 2 ? sparkSVG(vals) : `<div class="note">The value curve appears after saves and price updates.</div>`}
    <div class="meta"><span>Price update: ${daysAgo(lastRef)}${stale ? " · due" : ""}</span>
      <button class="btn small light" data-act="refresh" ${S.refreshing || !items.length ? "disabled" : ""}>${S.refreshing ? `<span class="spin sm"></span> Updating…` : ic("refresh",16) + " Update prices"}</button></div>
  </div>`;
  if (!items.length) {
    el.innerHTML = chips + hero + (S.note ? `<div class="disc">${esc(S.note)}</div>` : "") + `<div class="empty">No saved stamps yet ${pf === "all" ? "" : "in this portfolio"}.<br>Scan one, or a whole album page!<div style="margin-top:14px"><button class="btn primary small" style="margin:0 auto" data-act="goscan">Start scanning</button></div></div>`;
    return;
  }
  // series
  const keys = [...new Set(items.filter(i => i.seriesKey && (S.series[i.seriesKey]?.tagok||[]).length && S.series[i.seriesKey].allapot !== "elutasitva").map(i => i.seriesKey))];
  const inSeries = new Set();
  const sInfo = keys.map(k => { const s = S.series[k], n = s.tagok.length, own = ownedMap(k, items, n); own.forEach(i => inSeries.add(i.id)); return {k, s, n, own, ratio: own.size/n}; })
    .sort((a,b) => (b.ratio === 1) - (a.ratio === 1) || b.ratio - a.ratio);
  const done = sInfo.filter(x => x.ratio === 1).length;
  const singles = items.filter(i => !inSeries.has(i.id)).map(i => ({...i, _dup: !!(i.seriesKey && i.memberIdx >= 0 && keys.includes(i.seriesKey))}));
  const countries = new Set(items.map(i => (i.result?.orszag||"").trim()).filter(Boolean)).size;
  const top = [...items].sort((a,b) => mid(b) - mid(a)).slice(0, 6);
  el.innerHTML = chips + hero + (S.note ? `<div class="disc">${esc(S.note)}</div>` : "") + `
    <div class="stats">
      <div class="stat"><b>${items.length}</b><span>stamps</span></div>
      <div class="stat"><b>${sInfo.length}</b><span>series</span></div>
      <div class="stat"><b>${done}</b><span>complete sets</span></div>
      <div class="stat"><b>${countries}</b><span>countries</span></div>
    </div>
    <div class="sec-h"><h3>Most valuable</h3></div>
    <div class="hscroll">${top.map((i, n) => `<div class="topc" data-act="item" data-id="${esc(i.id)}"><div class="rank">#${n+1}</div><div class="stamp">${thumbHTML(i.thumb)}</div><div class="n">${esc(i.result?.nev || "Stamp")}</div><div class="p">${fmt(mid(i), i.result)}</div></div>`).join("")}</div>
    ${sInfo.length ? `<div class="sec-h"><h3>Series</h3><span class="muted" style="font-size:0.7812rem">${done}/${sInfo.length} complete</span></div>${sInfo.map(x => seriesCardHTML(x.k, x.s, x.own)).join("")}` : ""}
    ${singles.length ? `<div class="sec-h"><h3>${sInfo.length ? "Other stamps" : "Stamps"}</h3><span class="muted" style="font-size:0.7812rem">${singles.length} db</span></div>${singles.map(itemRow).join("")}` : ""}`;
}

/* ---------- item & missing modals ---------- */
function openItem(id){
  if (window.BS.openDetail) return window.BS.openDetail(id);
  const i = S.items.find(x => x.id === id); if (!i) return;
  const r = i.result || {}, aiMid = mid(estimate(r, i.cond, i.grade)), f = aiMid ? mid(i)/aiMid : 1;
  const ch = mid(i) - (i.first ?? mid(i)), pct = i.first ? ch/i.first*100 : 0;
  const evs = (i.ertekelesek && i.ertekelesek.length ? i.ertekelesek : (i.priceHistory || []).map(h => ({...h, modszer:"ai-1.0"}))), last = evs[evs.length-1] || {};
  const hist = evs.slice(-6).reverse();
  const extra = `<div class="why">When saved: ${fmt(i.first ?? mid(i), r)} → most: ${fmt(mid(i), r)}${Math.abs(pct) >= .5 ? ` (${ch > 0 ? "▲ +" : "▼ "}${pct.toFixed(1).replace(".", window.BS.DEC)}%)` : ""}</div>`;
  const histHTML = hist.length ? `<div class="card"><h3 class="sec-t">Valuation log</h3>${hist.map(h => `<div class="ph"><span class="muted">${new Date(h.t).toLocaleDateString(window.BS.LOC)} · ${esc(METHOD_L[h.modszer] || "AI estimate")}</span><b>${rng(h.min, h.max, r)}</b></div>`).join("")}<div class="disc" style="padding:6px 0 0">Source: no live market data – every value is a preliminary AI estimate.</div></div>` : "";
  const sdoc = S.series[i.seriesKey];
  const ser = sdoc && (sdoc.tagok||[]).length ? seriesCardHTML(i.seriesKey, sdoc, ownedMap(i.seriesKey, pfItems(S.activePf), sdoc.tagok.length)) : "";
  openModal(resultHTML(r, {thumb:i.thumb, cond:i.cond, grade:i.grade, interactive:false, est:{min:i.min, max:i.max}, factor: Math.abs(f-1) > .01 ? f : 1,
      confirmed: !!i.azonositas?.megerositve, method: last.modszer, dateText: last.t ? today(last.t) : "",
      valueLabel: `Current value – ${esc(condL(i.cond))}, ${esc(gradeL(i.grade))}`, extraValue: extra, afterValue: histHTML + ser})
    + `<div class="card"><h3 class="sec-t">Portfolio</h3><div class="seg">${pfList().map(p => `<button data-act="move" data-id="${esc(i.id)}" data-pf="${esc(p.id)}" class="${p.id===i.pf?"on":""}">${esc(p.name)}</button>`).join("")}</div></div>
    <div class="row"><button class="btn ghost" data-act="close">Close</button><button class="btn danger" data-act="del" data-id="${esc(i.id)}">Delete</button></div>`);
}
function openMissing(key, idx){
  const sdoc = (S.series[key]?.tagok||[]).length ? S.series[key] : S.scan?.series?.[key]; if (!sdoc) return;
  const t = sdoc.tagok[idx] || {}, R = S.scan || gRate();
  const nums = [t.mbk && "MBK " + t.mbk, t.michel && "Michel " + t.michel].filter(Boolean).join(" · ") + (t.mbk || t.michel ? " (AI suggestion)" : "");
  openModal(`<div class="trophy"><div class="lk" style="width:80px;height:96px">${LOCK}<b style="font-size:0.8125rem">${esc(t.nevertek || "?")}</b></div>
      <h2 style="margin-top:12px;font-size:1.25rem">Locked value</h2><p class="muted" style="margin:4px 0 0">${esc(sdoc.cim)} · ${idx+1} of ${sdoc.tagok.length}</p></div>
    <div class="card"><dl class="facts">
      ${t.nevertek ? `<dt>Value</dt><dd>${esc(t.nevertek)}</dd>` : ""}${t.szin ? `<dt>Colour</dt><dd>${esc(t.szin)}</dd>` : ""}${t.tema ? `<dt>Topic</dt><dd>${esc(t.tema)}</dd>` : ""}${nums ? `<dt>Catalogue</dt><dd>${esc(nums)}</dd>` : ""}
    </dl>
    ${sdoc.allapot === "megerositett" ? `<div class="muted" style="font-size:0.7812rem;margin-top:10px">Completion price – preliminary AI estimate</div><table class="pr">
      <tr><td>Mint never hinged **</td><td>${rng(+t.ar?.postatiszta?.min||0, +t.ar?.postatiszta?.max||0, R)}</td></tr>
      <tr><td>Used ⊙</td><td>${rng(+t.ar?.pecsetelt?.min||0, +t.ar?.pecsetelt?.max||0, R)}</td></tr>
    </table>` : `<div class="warnbox" style="margin-bottom:0">The series list is still an AI suggestion. The completion price appears after you confirm it.</div>`}</div>
    <p class="muted" style="font-size:0.8438rem;text-align:center">Got it? Scan it and its slot unlocks.</p>
    <button class="btn ghost" data-act="wish-add" data-key="${esc(key)}" data-i="${idx}" style="margin-bottom:10px">${ic("heart",18)} Add to wishlist</button>
    <div class="row"><button class="btn ghost" data-act="close">Close</button><button class="btn primary" data-act="goscan">Scan</button></div>`);
}
function openSeriesConfirm(key){
  const sdoc = S.series[key]; if (!sdoc) return;
  openModal(`<h2 style="margin:8px 0 4px">Check series</h2>
    <p class="muted" style="font-size:0.8438rem;margin:0">According to the AI, the series <b>${esc(sdoc.cim)}</b> (${esc([sdoc.orszag, sdoc.ev].filter(Boolean).join(", "))}) has ${(sdoc.tagok||[]).length} values. Check it in a catalogue or in your own album.</p>
    <div class="card">${(sdoc.tagok||[]).map((t, i) => `<div class="ph"><span>${i+1}. <b>${esc(t.nevertek || "?")}</b>${t.szin ? " · " + esc(t.szin) : ""}${t.tema ? " · " + esc(t.tema) : ""}</span><span class="muted">${esc([t.mbk && "MBK " + t.mbk, t.michel && "Mi " + t.michel].filter(Boolean).join(" · ") || "catalogue no. unknown")}</span></div>`).join("")}</div>
    <button class="btn primary" data-act="sok" data-key="${esc(key)}">Correct, I confirm</button>
    <button class="btn ghost" style="margin-top:10px" data-act="sno" data-key="${esc(key)}">Not correct – don’t treat as a series</button>
    <button class="btn ghost" style="margin-top:10px" data-act="close">Later</button>`);
}
async function setSeriesState(key, state){
  const sdoc = S.series[key]; if (!sdoc) return;
  const {id, ...rest} = sdoc;
  try { await store.put(key, {...rest, schema:2, allapot:state, allapotDatum:Date.now()}); closeModal(); toast(state === "megerositett" ? "Series confirmed" : "The stamps will show as individual items"); }
  catch(e){ toast("Could not save."); }
}
/* ---------- schema 2 migration ---------- */
const migrated = new Set(); let migrating = false;
function v2(d){
  const k = d.kind || (d.result ? "item" : "");
  if (k === "item") return {...d, kind:"item", schema:2,
    azonositas: d.azonositas || {megerositve:false, jelolt:0, mezoForras:{...(d.result?.mezo_forras||{})}},
    ertekelesek: d.ertekelesek || ((d.priceHistory && d.priceHistory.length ? d.priceHistory : [{t:d.createdAt||Date.now(), min:d.min, max:d.max}]).map(h => ({t:h.t, min:h.min, max:h.max, modszer:"ai-1.0", forras:null})))};
  if (k === "series") return {...d, schema:2, allapot: d.allapot || "megerositesre_var"};
  if (k === "portfolio") return {...d, schema:2};
  return null;
}
async function migrate(list){
  if (migrating) return;
  const todo = list.filter(d => !migrated.has(d.id) && (+d.schema||1) < 2 && v2(d));
  if (!todo.length) return;
  migrating = true;
  try { for (const d of todo) { migrated.add(d.id); const {id, ...data} = v2(d); await store.put(id, data); } }
  catch(e) { console.warn("migration interrupted", e); }
  finally { migrating = false; }
}
function pfModal(from){
  openModal(`<h2 style="margin:8px 0 4px">New portfolio</h2><p class="muted" style="font-size:0.8438rem;margin:0">E.g. “Hungary 1950s”, “For sale”, “Grandpa’s album”.</p>
    <input class="field" id="pfName" maxlength="40" placeholder="Portfolio name"><div class="row"><button class="btn ghost" data-act="close">Cancel</button><button class="btn primary" data-act="createpf" data-from="${from||""}">Create</button></div>`);
  setTimeout(() => $("#pfName")?.focus(), 50);
}
function pfMenu(){
  const p = S.portfolios.find(x => x.id === S.activePf); if (!p) return;
  openModal(`<h2 style="margin:8px 0 4px">Portfolio settings</h2>
    <input class="field" id="pfName" maxlength="40" value="${esc(p.name)}">
    <button class="btn primary" data-act="renamepf">Rename</button>
    <button class="btn danger" style="margin-top:10px" data-act="delpf">Delete portfolio</button>
    <div class="disc" style="text-align:center">When deleted, its stamps move to the “My collection” portfolio.</div>`);
}


/* ---------- backup: export / import ---------- */
const EXPORT_FORMAT = 1, KINDS = ["item","series","portfolio","hist","album","wish","prefs","irat"];   // irat: Örökség – eredetigazoló dokumentumfotó
const validId = id => typeof id === "string" && /^[A-Za-z0-9_\-.~:@+]{1,200}$/.test(id) && id !== "." && id !== "..";
let pendingImport = null;
function counts(docs){
  const c = {item:0, series:0, portfolio:0, hist:0, album:0, wish:0, prefs:0};
  for (const d of docs) { const k = d.kind || (d.result ? "item" : ""); if (k in c) c[k]++; }
  return c;
}
function lastExportText(){ try { const t = +localStorage.getItem("bs_lastExport"); return t ? new Date(t).toLocaleString(window.BS.LOC) : "not yet"; } catch(e){ return "unknown"; } }
function themePref(){ try { return localStorage.getItem("bs_theme") || "dark"; } catch(e){ return "dark"; } }
function applyTheme(pref){
  const t = pref === "system" ? (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark") : pref;
  document.documentElement.setAttribute("data-theme", t);
  try { localStorage.setItem("bs_theme", pref); } catch(e){}
}
function fscale(){ try { return +localStorage.getItem("bs_fscale") || 1; } catch(e){ return 1; } }
function applyFscale(v){ document.documentElement.style.fontSize = v > 1 ? (v * 100) + "%" : ""; document.documentElement.classList.toggle("fs-xl", v >= 1.6); try { localStorage.setItem("bs_fscale", String(v)); } catch(e){} }
function openSettings(){
  const c = counts(S.raw || []);
  openModal(`<h2 style="margin:8px 0 4px">Backup</h2>
    <p class="muted" style="font-size:0.8438rem;margin:0">Saves the whole collection (stamps with photos, series, portfolios, value history) to a single JSON file. You can restore from it at any time.</p>
    <div class="card"><dl class="facts">
      <dt>Stamps</dt><dd>${c.item}</dd><dt>Series</dt><dd>${c.series}</dd><dt>Portfolios</dt><dd>${c.portfolio} + My collection</dd>
      <dt>Storage</dt><dd>${store.mode === "db" ? "linked to your account (all devices)" : store.mode === "local" ? "this device only" : "loading…"}</dd>
      <dt>Last backup</dt><dd>${esc(lastExportText())}</dd></dl></div>
    <h3 class="sec-t" style="margin-top:14px">Language</h3>
    <div class="seg" role="radiogroup" aria-label="Language">${LANGS.map(([k, l]) => `<button data-act="lang" data-l="${k}" lang="${k}" role="radio" aria-checked="${window.BS.lang === k}" class="${window.BS.lang === k ? "on" : ""}">${l}</button>`).join("")}</div>
    <h3 class="sec-t" style="margin-top:14px">Appearance</h3>
    <div class="seg" role="radiogroup" aria-label="Theme">${[["dark","Dark"],["light","Light"],["system","System"]].map(([k, l]) => `<button data-act="theme" data-t="${k}" role="radio" aria-checked="${themePref() === k}" class="${themePref() === k ? "on" : ""}">${l}</button>`).join("")}</div>
    <h3 class="sec-t" style="margin-top:14px">Text size</h3>
    <div class="seg" role="radiogroup" aria-label="Text size">${[["1","Normal"],["1.15","Large"],["1.3","Extra large"]].map(([k, l]) => `<button data-act="fscale" data-s="${k}" role="radio" aria-checked="${fscale() === +k}" class="${fscale() === +k ? "on" : ""}">${l}</button>`).join("")}</div>
    <h3 class="sec-t" style="margin-top:14px">Data</h3>
    <button class="btn primary" data-act="export">${ic("download",18)} Export data (JSON)</button>
    <label class="btn ghost" style="margin-top:10px">${ic("upload",18)} Import data<input type="file" accept=".json,application/json" id="importFile"></label>
    <div id="importBox"></div>
    <div class="disc" style="text-align:center">Import only adds: it never overwrites or deletes existing items.</div>
    <button class="btn ghost" data-act="close">Close</button>`);
  $("#importFile").addEventListener("change", e => { readImport(e.target.files[0]); e.target.value = ""; });
}
async function exportData(btn){
  const docs = (S.raw || []).map(d => ({...d}));
  const payload = {app:window.BS.BRAND.exportId, format:EXPORT_FORMAT, exportedAt:new Date().toISOString(), source:store.mode, counts:counts(docs), docs};
  let dl = null; try { await waitClaude(); dl = window.claude?.use ? await window.claude.use("downloads") : null; } catch(e){}
  if (!dl) return toast("Saving files is not available in this view – open the app on claude.ai.");
  const d = new Date(), name = `${window.BS.BRAND.filePrefix}-mentes-${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}.json`;
  if (btn) btn.disabled = true;
  try {
    await dl.save({filename:name, data:new Blob([JSON.stringify(payload)], {type:"application/json"})});
    try { localStorage.setItem("bs_lastExport", String(Date.now())); } catch(e){}
    toast(`Saved: ${payload.counts.item} stamps, ${payload.counts.series} series`); openSettings();
  } catch(e) {
    toast(e?.code === "declined" ? "Saving cancelled." : e?.code === "rate_limited" ? "A save dialog is already open." : "Saving failed.");
  } finally { if (btn) btn.disabled = false; }
}
function validateImport(obj){
  if (!obj || !window.BS.BRAND.importIds.includes(obj.app) || !Array.isArray(obj.docs)) throw new Error(`This is not a ${window.BS.BRAND.name} backup file (earlier BélyegSnap backups are accepted too).`);
  if (+obj.format > EXPORT_FORMAT) throw new Error("The backup comes from a newer app version.");
  const ok = [], bad = [];
  for (const d of obj.docs) {
    const k = d && (d.kind || (d.result ? "item" : ""));
    if (d && validId(d.id) && KINDS.includes(k)) ok.push(d); else bad.push(d);
  }
  return {ok, bad};
}
async function readImport(file){
  if (!file) return;
  const box = $("#importBox");
  try {
    const {ok, bad} = validateImport(JSON.parse(await file.text()));
    const have = new Set((S.raw || []).map(d => d.id));
    const fresh = ok.filter(d => !have.has(d.id)), c = counts(fresh);
    pendingImport = fresh;
    box.innerHTML = `<div class="card"><b>${esc(file.name)}</b><dl class="facts">
      <dt>New stamps</dt><dd>${c.item}</dd><dt>New series</dt><dd>${c.series}</dd><dt>New portfolio</dt><dd>${c.portfolio}</dd>
      <dt>Already present</dt><dd>${ok.length - fresh.length} items (skipped)</dd>${bad.length ? `<dt>Invalid</dt><dd>${bad.length} items (skipped)</dd>` : ""}</dl>
      ${fresh.length ? `<button class="btn primary" style="margin-top:12px" data-act="doimport">${fresh.length} – restore items</button>` : `<p class="muted" style="margin:10px 0 0">No new items in the file.</p>`}</div>`;
  } catch(e) { pendingImport = null; box.innerHTML = `<div class="err">${esc(e.message || "The file could not be read.")}</div>`; }
}
async function doImport(btn){
  const docs = pendingImport; if (!docs?.length) return;
  btn.disabled = true; let n = 0;
  try {
    for (const d of docs) { const {id, ...data} = d; await store.put(id, data); n++; btn.textContent = `Restoring… ${n}/${docs.length}`; }
    pendingImport = null; closeModal(); toast(`${n} items restored`);
  } catch(e) {
    btn.disabled = false; btn.textContent = "Continue";
    pendingImport = docs.slice(n);
    toast(e?.code === "quota_exceeded" ? "Storage is full." : `Error after ${n} items – continuing will restore the rest.`);
  }
}

/* ---------- modal & events ---------- */
let lastFocus = null;
function openModal(html){
  if (!$("#modal").classList.contains("on")) lastFocus = document.activeElement;
  $("#modalBody").innerHTML = html; const m = $("#modal"); m.classList.add("on"); m.setAttribute("aria-hidden", "false");
  const sh = $("#modal .sheet"); sh.scrollTop = 0; try { sh.focus({preventScroll:true}); } catch(e){}
}
function closeModal(){
  const m = $("#modal"); m.classList.remove("on"); m.setAttribute("aria-hidden", "true"); S.modalIdx = null;
  if (lastFocus && document.contains(lastFocus)) try { lastFocus.focus({preventScroll:true}); } catch(e){}
}
document.addEventListener("keydown", e => { if (e.key === "Escape" && $("#modal").classList.contains("on")) closeModal(); });
$("#modal").addEventListener("click", e => { if (e.target.id === "modal") closeModal(); });

function show(v){
  S.view = v; window.BS.closeDetail?.(true); window.BS.closeArticle?.(true);
  if (v === "home") window.BS.renderHome?.();
  if (v === "coll") window.BS.renderCollection?.();
  if (v === "learn") window.BS.renderLearn?.();
  if (v === "pf") renderPf();
  if (v === "scan" && !S.scan) renderSlots();
  document.querySelectorAll(".view").forEach(s => s.classList.toggle("on", s.id === "v-"+v));
  document.querySelectorAll("nav.tabs button").forEach(b => { const on = b.dataset.v === v; b.classList.toggle("on", on); if (on) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current"); });
  window.scrollTo(0,0);
}
document.querySelectorAll("nav.tabs button").forEach(b => b.addEventListener("click", () => show(b.dataset.v)));

document.addEventListener("click", async e => {
  const inModal = !!e.target.closest("#modal");
  const c = e.target.closest("[data-cond]"), g = e.target.closest("[data-grade]");
  if (c || g) {
    if (inModal && S.modalIdx != null && S.scan) {
      const s = S.scan.stamps[S.modalIdx]; if (c) s._cond = c.dataset.cond; else s._grade = g.dataset.grade;
      const sc = $("#modal .sheet").scrollTop; openPageStamp(S.modalIdx); $("#modal .sheet").scrollTop = sc; renderScanResult();
    } else if (!inModal && S.scan?.mode === "single" && !S.saved) {
      const s = S.scan.stamps[0]; if (c) s._cond = c.dataset.cond; else s._grade = g.dataset.grade; renderScanResult();
    }
    return;
  }
  const cd = e.target.closest("[data-cand]");
  if (cd) { const st = editStamp(); if (st) { applyCand(st, +cd.dataset.cand); if (inModal) { const sc = $("#modal .sheet").scrollTop; openPageStamp(S.editIdx); $("#modal .sheet").scrollTop = sc; } renderScanResult(); } return; }
  const a = e.target.closest("[data-act]"); if (!a) return;
  const act = a.dataset.act;
  if (act === "confirmid") { const st = editStamp(); if (st) { confirmStamp(st); afterIdChange(); toast("Identification confirmed"); } return; }
  if (act === "editid") { openEditForm(); return; }
  if (act === "editsave") { saveEditForm(); toast("Details saved and confirmed"); return; }
  if (act === "editcancel") { if (S.scan?.mode === "page") openPageStamp(S.editIdx); else closeModal(); return; }
  if (act === "sconfirm") { openSeriesConfirm(a.dataset.key); return; }
  if (act === "sok") { setSeriesState(a.dataset.key, "megerositett"); return; }
  if (act === "sno") { setSeriesState(a.dataset.key, "elutasitva"); return; }
  if (act === "mode") setMode(a.dataset.m);
  else if (act === "analyze") analyze();
  else if (act === "pstamp") openPageStamp(+a.dataset.i);
  else if (act === "incl") { const s = S.scan.stamps[S.modalIdx]; s._incl = !s._incl; closeModal(); renderScanResult(); }
  else if (act === "savepf") { S.savePf = a.dataset.pf; renderScanResult(); }
  else if (act === "save") saveScan();
  else if (act === "new") resetScan();
  else if (act === "openpf") { S.activePf = S.savePf; renderPf(); show("pf"); }
  else if (act === "opencoll") { show("coll"); }
  else if (act === "goscan" || act === "goscan-single" || act === "goscan-page") { closeModal(); show("scan"); if (S.saved || act !== "goscan") resetScan(); if (act === "goscan-page") setMode("page"); if (act === "goscan-single") setMode("single"); }
  else if (act === "goview") { show(a.dataset.v); }
  else if (act === "savealb") { S.saveAlbum = a.dataset.alb; renderScanResult(); }
  else if (act === "ce-add") { const n = S.scan.stamps.length; S.scan.stamps.push({felismerve:true, bbox:[380,380,620,640], _new:true, _incl:true, _cond:"pecsetelt", _grade:"F", nev:"New crop", jeloltek:[], mezo_forras:{}}); CE.sel = n; ceDraw(); }
  else if (act === "ce-del") { if (CE.sel >= 0) { S.scan.stamps[CE.sel]._deleted = true; CE.sel = -1; ceDraw(); } }
  else if (act === "ce-ok") { ceConfirm(a); }
  else if (act === "ce-open") { openCropEditor(); window.scrollTo(0, 0); }
  else if (act === "lang") { if (a.dataset.l !== window.BS.lang) window.BS.setLang(a.dataset.l); }
  else if (act === "fscale") { applyFscale(+a.dataset.s); openSettings(); }
  else if (act === "wish-add") {
    const sdoc = S.series[a.dataset.key] || S.scan?.series?.[a.dataset.key], t = sdoc?.tagok?.[+a.dataset.i]; if (!t) return;
    try { await store.put(uidGen("wi_"), {kind:"wish", schema:2, cim:`${sdoc.cim} – ${t.nevertek || ""}`.trim(), orszag:sdoc.orszag||"", ev:sdoc.ev||"", nevertek:t.nevertek||"", seriesKey:a.dataset.key, memberIdx:+a.dataset.i, maxAr:null, megjegyzes:"", createdAt:Date.now()}); closeModal(); toast("Added to wishlist"); haptic(10); } catch(err){ toast("Could not save."); }
  }
  else if (act === "close") closeModal();
  else if (act === "pf") { S.activePf = a.dataset.pf; renderPf(); }
  else if (act === "newpf") pfModal(a.dataset.from);
  else if (act === "createpf") {
    const name = ($("#pfName")?.value || "").trim(); if (!name) return toast("Give the portfolio a name.");
    const id = uidGen("pf_"); a.disabled = true;
    try { await store.put(id, {kind:"portfolio", name, createdAt:Date.now()}); } catch(err){ a.disabled = false; return toast("Could not create it."); }
    if (!S.portfolios.some(p => p.id === id)) S.portfolios.push({id, kind:"portfolio", name, createdAt:Date.now()});
    if (a.dataset.from === "save") { S.savePf = id; renderScanResult(); } else { S.activePf = id; }
    closeModal(); renderPf(); toast("Portfolio created");
  }
  else if (act === "pfmenu") pfMenu();
  else if (act === "renamepf") {
    const p = S.portfolios.find(x => x.id === S.activePf), name = ($("#pfName")?.value || "").trim();
    if (p && name) { try { await store.put(p.id, {kind:"portfolio", name, createdAt:p.createdAt}); closeModal(); toast("Renamed"); } catch(err){ toast("That didn’t work."); } }
  }
  else if (act === "delpf") {
    if (!a.dataset.confirm) { a.dataset.confirm = "1"; a.textContent = "Delete for sure?"; return; }
    const id = S.activePf; a.disabled = true;
    try {
      for (const i of S.items.filter(x => x.pf === id)) await store.put(i.id, {...i, pf:"default"});
      await store.del(id); S.activePf = "all"; closeModal(); renderPf(); toast("Portfolio deleted");
    } catch(err){ toast("Could not delete."); }
  }
  else if (act === "refresh") refreshPrices();
  else if (act === "settings") openSettings();
  else if (act === "theme") { applyTheme(a.dataset.t); openSettings(); }
  else if (act === "export") exportData(a);
  else if (act === "doimport") doImport(a);
  else if (act === "item") openItem(a.dataset.id);
  else if (act === "missing") openMissing(a.dataset.key, +a.dataset.i);
  else if (act === "move") {
    const i = S.items.find(x => x.id === a.dataset.id); if (!i || i.pf === a.dataset.pf) return;
    try { await store.put(i.id, {...i, pf:a.dataset.pf}); await recordHist(S.items.map(x => x.id === i.id ? {...i, pf:a.dataset.pf} : x)); closeModal(); toast("Moved to: " + pfName(a.dataset.pf)); window.BS.refreshDetail?.(); } catch(err){ toast("Could not move."); }
  }
  else if (act === "del") {
    if (!a.dataset.confirm) { a.dataset.confirm = "1"; a.textContent = "Delete for sure?"; return; }
    const id = a.dataset.id;
    try { await store.del(id); await recordHist(S.items.filter(x => x.id !== id)); closeModal(); window.BS.closeDetail?.(); toast("Deleted"); } catch(err){ toast("Could not delete."); }
  }
});

$("#curSwitch").addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  S.cur = b.dataset.c; try { localStorage.setItem("bs_cur", S.cur); } catch(_){}
  syncCur(); if (S.scan) renderScanResult(); renderPf(); refreshViews();
});
function syncCur(){ document.querySelectorAll("#curSwitch button").forEach(b => b.classList.toggle("on", b.dataset.c === S.cur)); }
let tt; function toast(m){ const t = $("#toast"); t.textContent = m; t.classList.add("on"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("on"), 2600); }

window.BS.app = {S, store, fmt, fmtU, fmtDisp, fmtSigned, pctFmt, hufFmt, unitFor, groupUnit, roundDisp, rate, rng, renderBrand, PROMPT_VERSION, buildPrompt, normScan, parseJSON, getSample, loadImg, toCanvas, toBlob, quality, crop, cropHi, fmtAlt, mid, r2, gRate, thumbHTML, seriesCardHTML, resultHTML, idCardHTML, esc, toast, openModal, closeModal, show, ic, haptic,
  estimate, UNK, condL, gradeL, COND, GRADES, catText, confLevel, valOr, stTag, fieldSt, today, METHOD_L, ownedMap, completedKeys, pfItems, pfName, pfList, recordHist, refreshPrices,
  openMissing, openSeriesConfirm, uidGen, slug, strip, dupKey, list, daysAgo, sparkSVG, EDIT_FIELDS, CAT_FIELDS, refreshViews, openSettings};
function renderBrand(){
  const B = window.BS.BRAND;
  document.getElementById("brandMark").innerHTML = window.BS.monogram("hd") + window.BS.wordmark();
  document.getElementById("brandSlogan").textContent = window.BS.slogan();
  window.BS.applyBrandHead();
}
renderBrand();
(function splash(){
  const el = document.getElementById("splash"); if (!el) return;
  const B = window.BS.BRAND;
  /* Indítóképernyő a csomag szerint: monogram mély zöld alapon, név, szlogen, visszafogott díszítés. */
  el.innerHTML = window.BS.brandImg("splash", `<div class="sp-in">${window.BS.monogram("sp-mono")}<div class="sp-name">${esc(B.name)}</div><div class="sp-sl">${esc(window.BS.slogan())}</div><div class="sp-orn" aria-hidden="true"><span></span>◆<span></span></div></div>`, 'class="sp-img"');
  el.classList.add("on");
  const hide = () => { el.classList.remove("on"); setTimeout(() => el.remove(), 400); };
  const t0 = Date.now(); window.addEventListener("load", () => setTimeout(hide, Math.max(0, 700 - (Date.now() - t0)))); setTimeout(hide, 2500);
})();
/* A korábbi fejlesztői tesztlabor (Recognition Lab) helyi adatainak eltakarítása – a gyűjteményt nem érinti. */
try { for (const k of Object.keys(localStorage)) if (k === "lab_runs" || k === "lab_prices" || k.startsWith("lab_img_")) localStorage.removeItem(k); } catch(e){}

/* ---------- teljes képernyő és telefonos ikon (mint a LapTrezorban) ---------- */
const NOFS = "button,input,select,textarea,label,a,summary,details,[role=button],[role=tab],[data-act],[data-open],.atl-map,svg,canvas,img,.sheet,.modal,nav";
function toggleFullscreen(){
  const d = document, el = d.documentElement;
  if (d.fullscreenElement || d.webkitFullscreenElement) return (d.exitFullscreen || d.webkitExitFullscreen).call(d);
  const req = el.requestFullscreen || el.webkitRequestFullscreen;
  if (req) { const p = req.call(el, {navigationUI:"hide"}); p && p.catch && p.catch(fsHint); } else fsHint();
}
function fsHint(){
  toast(/iPhone|iPad/i.test(navigator.userAgent)
    ? T("iPhone-on: Safari → Megosztás → „Főképernyőhöz adás”, és az ikonról teljes képernyőn indul.", "On iPhone: Safari → Share → “Add to Home Screen”, then it opens full screen from the icon.")
    : T("A teljes képernyő itt nem támogatott – tedd ki az ikont a kezdőképernyőre.", "Full screen isn't supported here – add the icon to your home screen."));
}
let lastTap = 0, lastTouchFs = 0;
document.addEventListener("touchend", e => {
  if (e.touches.length || e.target.closest(NOFS)) { lastTap = 0; return; }
  const t = Date.now();
  if (t - lastTap < 320) { e.preventDefault(); lastTap = 0; lastTouchFs = t; toggleFullscreen(); } else lastTap = t;
}, {passive:false});
document.addEventListener("dblclick", e => { if (Date.now() - lastTouchFs < 800 || e.target.closest(NOFS)) return; toggleFullscreen(); });
(async () => {
  await waitClaude();
  if (!window.claude?.use && "serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("sw.js").catch(() => {});
  try {
    const app = matchMedia("(display-mode: standalone)").matches || matchMedia("(display-mode: fullscreen)").matches;
    if (!app && !localStorage.getItem("bs_fs_tip")) { setTimeout(() => toast(T("Tipp: dupla koppintás egy üres részen = teljes képernyő", "Tip: double-tap an empty area = full screen")), 1800); localStorage.setItem("bs_fs_tip", "1"); }
  } catch(e){}
})();

syncCur(); renderSlots(); renderPf(); initStore(); show("home");
document.addEventListener("DOMContentLoaded", () => show(S.view));
})();
