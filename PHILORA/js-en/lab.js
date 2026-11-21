/* GENERÁLT FÁJL – ne szerkeszd. Forrás: js/lab.js, szótár: tools/i18n/en.json, eszköz: tools/i18n/build-en.js */
/* PHILORA – Recognition Lab (fejlesztői tesztmodul).
   - Külön tárolóban él: fiókhoz kötve `data/users/<id>/lab/runs` és `/lab/imgs` (a gyűjtemény `data/users/<id>` dokumentumai között NEM jelenik meg),
     helyi módban a `lab_runs` / `lab_img_*` kulcsokon. Soha nem kerül a gyűjteménybe, a gyűjtemény-exportba vagy a demó adatok közé.
   - A rögzített javítások mérési adatok; NEM jelentik a modell újratanítását.
   - A költség csak becslés: a tokenszámot közelítő képlet adja, az árat a felhasználó adja meg (alapértelmezésben nincs). */
(() => {
  const B = window.BS;
  const L = {tab:"new", mode:"single", file:null, fileURL:null, busy:false, open:null, sel:-1, page:null, drag:null};
  const LS = {ready:false, mode:"", runs:[], imgs:{}, coll:null, icoll:null};
  /* i18n-skip-start: tárolt kulcsok */
  const ERR = ["", "helyes", "rossz ország", "rossz kiadás / év", "rossz címlet", "rossz sorozat", "rossz katalógusszám", "kitalált katalógusszám", "állapottévedés", "irreális árbecslés", "képminőség", "nem felismert bélyeg", "nem bélyeg (téves)", "egyéb"];
  const VK = ["helyes", "rossz", "kitalált", "hiányzik", "helyes (üres)"];
  /* i18n-skip-end */
  /* Megjelenített feliratok – a tárolt kulcsok (ERR, VK) nyelvtől függetlenül magyarok maradnak. */
  const ERR_L = {"helyes": "correct", "rossz ország": "wrong country", "rossz kiadás / év": "wrong issue / year", "rossz címlet": "wrong value", "rossz sorozat": "wrong series", "rossz katalógusszám": "wrong catalogue no.", "kitalált katalógusszám": "invented catalogue no.", "állapottévedés": "condition error", "irreális árbecslés": "unrealistic price", "képminőség": "image quality", "nem felismert bélyeg": "stamp not recognised", "nem bélyeg (téves)": "not a stamp (false)", "egyéb": "other"};
  const VL = {"helyes": "correct", "rossz": "wrong", "kitalált": "invented", "hiányzik": "missing", "helyes (üres)": "correct (empty)"};
  const ov = () => document.getElementById("v-lab");
  const fnv = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(16).padStart(8, "0"); };
  const prices = () => { try { return JSON.parse(localStorage.getItem("lab_prices") || "{}"); } catch(e){ return {}; } };

  /* ---------- tároló ---------- */
  async function init(){
    if (LS.ready) return; const A = B.app;
    if (A.store.mode !== "local" && A.store.db && A.store.uid) {
      const base = A.store.db.doc(`data/users/${A.store.uid}/lab`);
      LS.coll = base.collection("runs"); LS.icoll = base.collection("imgs"); LS.mode = "db";
      try { const snap = await LS.coll.get(); LS.runs = snap.docs.map(d => ({id:d.id, ...d.data()})); } catch(e){ LS.runs = []; }
    } else { LS.mode = "local"; try { LS.runs = JSON.parse(localStorage.getItem("lab_runs") || "[]"); } catch(e){ LS.runs = []; } }
    LS.runs.sort((a, b) => b.createdAt - a.createdAt); LS.ready = true;
  }
  async function putRun(run){
    const clean = JSON.parse(JSON.stringify(run)); delete clean.id;
    const i = LS.runs.findIndex(r => r.id === run.id); if (i >= 0) LS.runs[i] = run; else LS.runs.unshift(run);
    if (LS.mode === "db") await LS.coll.doc(run.id).set(clean);
    else localStorage.setItem("lab_runs", JSON.stringify(LS.runs));
  }
  async function putImg(id, data){ LS.imgs[id] = data; if (LS.mode === "db") await LS.icoll.doc(id).set({kind:"labimg", data}); else try { localStorage.setItem("lab_img_" + id, data); } catch(e){ throw new Error("Device storage is full – the image cannot be saved."); } }
  async function getImg(id){
    if (LS.imgs[id]) return LS.imgs[id];
    if (LS.mode === "db") { try { const d = await LS.icoll.doc(id).get(); if (d.exists) LS.imgs[id] = d.data().data; } catch(e){} }
    else LS.imgs[id] = localStorage.getItem("lab_img_" + id) || "";
    return LS.imgs[id] || "";
  }
  async function delAll(){
    for (const r of LS.runs) { if (LS.mode === "db") { await LS.coll.doc(r.id).delete(); await LS.icoll.doc(r.imgId).delete(); } else localStorage.removeItem("lab_img_" + r.imgId); }
    LS.runs = []; LS.imgs = {}; if (LS.mode === "local") localStorage.removeItem("lab_runs");
  }
  /* kép a dokumentum-korlát alá (≤ 230 kB base64) */
  function fitImage(cv){
    for (const [mx, q] of [[1400, .8], [1200, .75], [1000, .7], [800, .65], [640, .6]]) { const d = B.app.toCanvas(cv, mx).toDataURL("image/jpeg", q); if (d.length < 230000) return d; }
    return B.app.toCanvas(cv, 480).toDataURL("image/jpeg", .55);
  }
  /* közelítő tokenbecslés: kép ≈ szélesség×magasság/750 (a hosszabb oldal max. 1568 px-re skálázva), szöveg ≈ 3,5 karakter/token */
  function estTokens(w, h, promptLen, outLen, nImg){
    const s = Math.min(1, 1568 / Math.max(w, h)), img = Math.round((w * s) * (h * s) / 750) * (nImg || 1);
    const inT = img + Math.round(promptLen / 3.5), outT = Math.round(outLen / 3.5), p = prices();
    const cost = (+p.in > 0 && +p.out > 0) ? (inT * +p.in + outT * +p.out) / 1e6 : null;
    return {image: img, input: inT, output: outT, costUsd: cost, method: "approximation (image: px²/750, text: 3.5 characters/token)"};
  }

  /* ---------- értékelés ---------- */
  const dec = (v, d = 2) => v == null ? "–" : Number(v).toLocaleString(window.BS.LOC, {minimumFractionDigits:d, maximumFractionDigits:d});
  const N = s => B.app.strip(String(s || "")).replace(/[^a-z0-9]/g, "");
  const toks = s => B.app.strip(String(s || "")).split(/[^a-z0-9]+/).filter(t => t.length > 1);
  function cmpField(k, ai, exp){
    if (!String(exp || "").trim()) return null;
    if (k === "kiadas_eve") return (String(ai).match(/\d{4}/) || [""])[0] === (String(exp).match(/\d{4}/) || ["?"])[0];
    if (k === "nev") { const a = toks(ai), e = toks(exp); if (!e.length) return null; return e.filter(t => a.includes(t)).length / e.length >= .5; }
    return N(ai) === N(exp);
  }
  /* i18n-skip-start */
  function catEval(aiCat, exp){
    const res = {};
    for (const k of ["mbk", "michel"]) {
      const e = String(exp[k] || "").trim(), a = String(aiCat?.[k] || "").trim();
      if (!e) { res[k] = null; continue; }
      if (/^(nincs|none|-|n\/a|ismeretlen|unknown)$/i.test(e)) res[k] = a ? "kitalált" : "helyes (üres)";
      else res[k] = !a ? "hiányzik" : N(a) === N(e) ? "helyes" : "rossz";
    }
    return res;
  }
  /* i18n-skip-end */
  function evaluate(run){
    const s = run.result?.[0], e = run.expected; if (!s || !e) return null;
    const f = {}; for (const k of ["nev", "orszag", "kiadas_eve", "nevertek"]) f[k] = cmpField(k, s[k], e[k]);
    if (e.cond) f.cond = s.cond === e.cond;
    const cat = catEval(s.katalogus, e), vals = Object.values(f).filter(v => v !== null);
    return {fields: f, catalog: cat, evaluated: vals.length, correct: vals.filter(Boolean).length, allCorrect: vals.length > 0 && vals.every(Boolean) && !Object.values(cat).some(v => v === "rossz" || v === "kitalált")};
  }
  const iou = (a, b) => { const x0 = Math.max(a[0], b[0]), y0 = Math.max(a[1], b[1]), x1 = Math.min(a[2], b[2]), y1 = Math.min(a[3], b[3]); const I = Math.max(0, x1 - x0) * Math.max(0, y1 - y0), U = (a[2] - a[0]) * (a[3] - a[1]) + (b[2] - b[0]) * (b[3] - b[1]) - I; return U > 0 ? I / U : 0; };
  function pageMetrics(pg){
    if (!pg) return null;
    const ok = pg.boxes.filter(b => b.state === "ok"), fp = pg.boxes.filter(b => b.state === "fp").length;
    const missed = Math.max(pg.missed.length, (+pg.truthCount || 0) - ok.length);
    const ious = ok.map(b => iou(b.ai, b.cur)); const meanIoU = ious.length ? ious.reduce((a, b) => a + b, 0) / ious.length : null;
    return {detected: pg.boxes.length, tp: ok.length, fp, missed, truth: +pg.truthCount || ok.length + pg.missed.length, meanIoU, recall: (+pg.truthCount || 0) ? ok.length / pg.truthCount : null};
  }

  /* ---------- futtatás ---------- */
  async function runTest(btn){
    const A = B.app; if (!L.file) return A.toast("Choose an image for the test.");
    const sample = await A.getSample(); if (!sample) return A.toast("AI is not available in this view.");
    L.busy = true; btn.disabled = true; btn.innerHTML = `<span class="spin sm"></span> Test running…`;
    try {
      const {im} = await A.loadImg(L.file), cv = A.toCanvas(im, L.mode === "page" ? 2000 : 1400), blob = await A.toBlob(cv, .85);
      const prompt = A.buildPrompt(L.mode, false), id = A.uidGen("lab_"), t0 = performance.now();
      let out = null, err = null, parsed = null, perr = null;
      try { out = await sample(prompt, {images:[blob], modelTier:"complex", cache:false}); } catch(e){ err = e; }
      const ms = Math.round(performance.now() - t0);
      if (out) { try { parsed = A.normScan(A.parseJSON(out.text)); } catch(e){ perr = e.message || String(e); } }
      const imgData = fitImage(cv);
      const run = {id, kind:"labrun", schema:1, createdAt:Date.now(), mode:L.mode, imgId:"img_" + id,
        fileName:L.file.name || "", origBytes:L.file.size || 0, origW:im.naturalWidth, origH:im.naturalHeight, sentW:cv.width, sentH:cv.height,
        promptVersion:A.PROMPT_VERSION, promptHash:fnv(prompt), modelTier:"complex", modelApplied: out?.modelApplied || out?.model || null,
        responseMs:ms, error: err ? (err.code || err.message || "error") : null, parseError:perr, truncated: !!out?.truncated,
        rawText: (out?.text || "").slice(0, 60000), rawLen: (out?.text || "").length,
        result: parsed ? parsed.stamps.map(s => ({felismerve: s.felismerve !== false, nev:s.nev || "", orszag:s.orszag || "", kiadas_eve:s.kiadas_eve || "", nevertek:s.nevertek || "", sorozat:s.sorozat || "", katalogus:s.katalogus || {}, bizonyossag:+s.bizonyossag || 0, cond:s._cond, grade:s._grade, becsult:s.becsult_ertek || null, bbox:s.bbox || null, jeloltek:(s.jeloltek || []).map(j => ({nev:j.nev, katalogus:j.katalogus, bizonyossag:j.bizonyossag}))})) : [],
        eurHuf: parsed?.rate || null,
        tokens: estTokens(cv.width, cv.height, prompt.length, (out?.text || "").length, 1),
        expected:null, evaluation:null, page:null, pageMetrics:null, errorCat:"", note:""};
      await putImg(run.imgId, imgData); await putRun(run);
      A.toast(err ? "The test ended with an error – recorded" : `Test recorded · ${ms} ms`); A.haptic(12);
      L.file = null; if (L.fileURL) URL.revokeObjectURL(L.fileURL); L.fileURL = null;
      openRun(run.id);
    } catch(e) { A.toast(e.message || "The test failed."); }
    finally { L.busy = false; }
  }

  /* ---------- nézetek ---------- */
  function shell(body){
    const A = B.app;
    ov().innerHTML = `<div class="ov-bar"><button class="iconbtn" data-act="lab-close" aria-label="Back">${A.ic("back", 22)}</button><span class="ov-t">RECOGNITION LAB</span><span style="width:44px"></span></div>
      <div class="ov-body"><div class="wrap">
      <div class="lab-note">Developer test module. Data recorded here is kept in separate storage (${LS.mode === "db" ? "linked to your account" : "on this device"}), never enters the collection, and corrections do not retrain the AI model.</div>
      <div class="tabs4" role="tablist">${[["new","New test"],["runs","Runs"],["stats","Statistics"],["cfg","Settings"]].map(([k, l]) => `<button role="tab" aria-selected="${L.tab === k}" class="${L.tab === k ? "on" : ""}" data-act="lab-tab" data-t="${k}">${l}${k === "runs" ? ` (${LS.runs.length})` : ""}</button>`).join("")}</div>
      ${body}</div></div>`;
  }
  function viewNew(){
    const A = B.app;
    return `<div class="card"><h3 class="sec-t">New test</h3>
      <div class="mode" role="tablist"><button data-act="lab-mode" data-m="single" class="${L.mode === "single" ? "on" : ""}">Single stamp</button><button data-act="lab-mode" data-m="page" class="${L.mode === "page" ? "on" : ""}">Album page</button></div>
      ${L.fileURL ? `<img class="lab-img" src="${L.fileURL}" alt="Test image">` : `<div class="empty-state" style="padding:18px">${A.ic("image", 28)}<span>A real stamp photo for measuring</span></div>`}
      <div class="row" style="margin-top:10px"><label class="btn ghost">${A.ic("camera", 18)} Camera<input type="file" accept="image/*" capture="environment" data-lab-in></label><label class="btn ghost">${A.ic("image", 18)} Gallery<input type="file" accept="image/*" data-lab-in></label></div>
      <button class="btn primary" data-act="lab-run" style="margin-top:10px" ${L.fileURL ? "" : "disabled"}>${A.ic("sparkle", 18)} Run test</button>
      <dl class="kv"><dt>Prompt version</dt><dd>${A.esc(A.PROMPT_VERSION)} · ${fnv(A.buildPrompt(L.mode, false))}</dd><dt>Model tier</dt><dd>complex (the AI interface returns the model actually used, if available)</dd><dt>Cost estimate</dt><dd>${+prices().in > 0 ? "with the prices you set" : "no price set – token estimate only"}</dd></dl></div>`;
  }
  function viewRuns(){
    const A = B.app;
    if (!LS.runs.length) return `<div class="empty-state">${A.ic("sparkle", 30)}<b>No test runs yet</b><span>Start one on the “New test” tab with a real stamp photo.</span></div>`;
    return LS.runs.map(r => { const s = r.result?.[0], ev = r.evaluation, pm = r.pageMetrics;
      const v = r.error ? `<span class="verdict bad">hiba</span>` : r.mode === "page" ? (pm ? `<span class="verdict ${pm.fp || pm.missed ? "bad" : "ok"}">${pm.tp}/${pm.truth} · IoU ${dec(pm.meanIoU)}</span>` : `<span class="verdict na">not evaluated</span>`) : ev ? `<span class="verdict ${ev.allCorrect ? "ok" : "bad"}">${ev.correct}/${ev.evaluated} fields</span>` : `<span class="verdict na">not evaluated</span>`;
      return `<button class="lab-run" data-act="lab-open" data-id="${A.esc(r.id)}"><img data-lab-thumb="${A.esc(r.imgId)}" alt=""><div style="flex:1;min-width:0"><div class="t">${A.esc(r.mode === "page" ? `Album page · ${r.result.length} detections` : (s?.nev || "not recognised"))}</div><div class="s">${new Date(r.createdAt).toLocaleString(window.BS.LOC)} · ${r.responseMs} ms · ${A.esc(r.promptVersion)}</div></div>${v}</button>`; }).join("");
  }
  function median(a){ if (!a.length) return null; const s = [...a].sort((x, y) => x - y), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; }
  function viewStats(){
    const A = B.app, R = LS.runs, single = R.filter(r => r.mode === "single" && r.evaluation), page = R.filter(r => r.mode === "page" && r.pageMetrics);
    const fld = k => { const v = single.map(r => r.evaluation.fields[k]).filter(x => x !== null && x !== undefined); return v.length ? `${Math.round(v.filter(Boolean).length / v.length * 100)}% (${v.filter(Boolean).length}/${v.length})` : "–"; };
    const cats = single.flatMap(r => Object.values(r.evaluation.catalog || {}).filter(Boolean));
    const confOk = single.filter(r => r.evaluation.allCorrect).map(r => r.result[0]?.bizonyossag || 0), confBad = single.filter(r => !r.evaluation.allCorrect).map(r => r.result[0]?.bizonyossag || 0);
    const avg = a => a.length ? Math.round(a.reduce((x, y) => x + y, 0) / a.length) : null;
    const pm = page.map(r => r.pageMetrics), sum = k => pm.reduce((s, m) => s + (m[k] || 0), 0), ious = pm.map(m => m.meanIoU).filter(v => v != null);
    const ec = {}; R.forEach(r => { if (r.errorCat) ec[r.errorCat] = (ec[r.errorCat] || 0) + 1; });
    const tIn = R.reduce((s, r) => s + (r.tokens?.input || 0), 0), tOut = R.reduce((s, r) => s + (r.tokens?.output || 0), 0), cost = R.reduce((s, r) => s + (r.tokens?.costUsd || 0), 0);
    const ms = R.filter(r => !r.error).map(r => r.responseMs);
    return `<div class="lab-stats">
        <div class="stat"><b>${R.length}</b><span>runs</span></div><div class="stat"><b>${single.length + page.length}</b><span>evaluated</span></div>
        <div class="stat"><b>${median(ms) != null ? Math.round(median(ms) / 100) / 10 + " s" : "–"}</b><span>median response time</span></div><div class="stat"><b>${R.filter(r => r.error || r.parseError).length}</b><span>bad responses</span></div></div>
      <div class="card"><h3 class="sec-t">Single stamps – identification</h3><dl class="kv">
        <dt>Name</dt><dd>${fld("nev")}</dd><dt>Country</dt><dd>${fld("orszag")}</dd><dt>Year of issue</dt><dd>${fld("kiadas_eve")}</dd><dt>Value</dt><dd>${fld("nevertek")}</dd><dt>Condition</dt><dd>${fld("cond")}</dd>
        <dt>Fully correct</dt><dd>${single.length ? `${single.filter(r => r.evaluation.allCorrect).length}/${single.length}` : "–"}</dd>
        <dt>Catalogue numbers</dt><dd>${cats.length ? VK.map(k => `${VL[k]}: ${cats.filter(c => c === k).length}`).join(" · ") : "–"}</dd>
        <dt>Average confidence</dt><dd>${avg(confOk) != null || avg(confBad) != null ? `correct: ${avg(confOk) ?? "–"}% · wrong: ${avg(confBad) ?? "–"}%` : "–"}</dd></dl></div>
      <div class="card"><h3 class="sec-t">Album pages – detection</h3><dl class="kv">
        <dt>Actual stamps</dt><dd>${page.length ? sum("truth") : "–"}</dd><dt>Correct detections</dt><dd>${page.length ? sum("tp") : "–"}</dd>
        <dt>Missed</dt><dd>${page.length ? sum("missed") : "–"}</dd><dt>False detections</dt><dd>${page.length ? sum("fp") : "–"}</dd>
        <dt>Recall</dt><dd>${page.length && sum("truth") ? Math.round(sum("tp") / sum("truth") * 100) + "%" : "–"}</dd>
        <dt>Crop accuracy</dt><dd>${ious.length ? "mean IoU " + dec(ious.reduce((a, b) => a + b, 0) / ious.length) : "–"}</dd></dl></div>
      <div class="card"><h3 class="sec-t">Error categories</h3>${Object.keys(ec).length ? Object.entries(ec).sort((a, b) => b[1] - a[1]).map(([k, v]) => `<div class="bar"><div class="bar-l"><span>${A.esc(ERR_L[k] || k)}</span><span>${v}</span></div><div class="bar-t"><i style="width:${v / R.length * 100}%"></i></div></div>`).join("") : `<p class="muted" style="margin:0">No categorised runs yet.</p>`}</div>
      <div class="card"><h3 class="sec-t">Resources (estimate)</h3><dl class="kv"><dt>Input tokens</dt><dd>≈ ${tIn.toLocaleString(window.BS.LOC)}</dd><dt>Output tokens</dt><dd>≈ ${tOut.toLocaleString(window.BS.LOC)}</dd><dt>Cost</dt><dd>${cost ? "≈ " + cost.toLocaleString(window.BS.LOC, {maximumFractionDigits:4}) + " USD (with the prices you set)" : "cannot be determined – you can set a token price on the Settings tab"}</dd></dl></div>
      <div class="row"><button class="btn ghost" data-act="lab-exp-json">${A.ic("download", 18)} JSON (with images)</button><button class="btn ghost" data-act="lab-exp-csv">${A.ic("download", 18)} CSV</button></div>`;
  }
  function viewCfg(){
    const A = B.app, p = prices();
    return `<div class="card form"><h3 class="sec-t">Cost estimate</h3><p class="muted" style="font-size:.8rem;margin:2px 0 6px">Enter the token price from the provider’s actual price list (USD / 1 million tokens). If left blank, only a token estimate is made.</p>
      <label for="lp-in">Input (USD / M tokens)</label><input class="field" id="lp-in" inputmode="decimal" value="${A.esc(p.in || "")}">
      <label for="lp-out">Output (USD / M tokens)</label><input class="field" id="lp-out" inputmode="decimal" value="${A.esc(p.out || "")}">
      <button class="btn primary" data-act="lab-save-price" style="margin-top:10px">Save</button></div>
      <div class="card"><h3 class="sec-t">Delete Lab data</h3><p class="muted" style="font-size:.8rem;margin:2px 0 8px">Deletes only the test runs and their images; the collection is not affected.</p><button class="btn danger" data-act="lab-clear">${A.ic("trash", 18)} Delete all test runs</button></div>`;
  }
  async function render(){
    await init();
    shell(L.tab === "new" ? viewNew() : L.tab === "runs" ? viewRuns() : L.tab === "stats" ? viewStats() : viewCfg());
    for (const im of ov().querySelectorAll("[data-lab-thumb]")) getImg(im.dataset.labThumb).then(d => { if (d) im.src = d; });
  }
  /* ---------- futás részletei ---------- */
  async function openRun(id){
    await init(); L.open = id; L.sel = -1; const A = B.app, r = LS.runs.find(x => x.id === id); if (!r) return;
    const img = await getImg(r.imgId), s = r.result?.[0] || {}, e = r.expected || {}, ev = r.evaluation;
    if (r.mode === "page") L.page = r.page ? JSON.parse(JSON.stringify(r.page)) : {truthCount: r.result.filter(x => x.felismerve).length, boxes: r.result.filter(x => Array.isArray(x.bbox)).map(x => ({ai:x.bbox, cur:[...x.bbox], state:"ok", nev:x.nev})), missed: []};
    const mark = v => v === null || v === undefined ? `<span class="verdict na">–</span>` : `<span class="verdict ${v === true || v === "helyes" || v === "helyes (üres)" ? "ok" : "bad"}">${v === true ? "matches" : v === false ? "differs" : A.esc(VL[v] || v)}</span>`;
    const single = r.mode === "single" ? `
      <div class="card"><h3 class="sec-t">AI result</h3>${r.result.length ? `<table class="cmp"><thead><tr><th>Field</th><th>AI</th><th>Verified</th><th></th></tr></thead><tbody>
        ${[["nev","Name"],["orszag","Country"],["kiadas_eve","Year"],["nevertek","Value"]].map(([k, l]) => `<tr><td>${l}</td><td>${A.esc(s[k] || "–")}</td><td>${A.esc(e[k] || "")}</td><td>${mark(ev?.fields?.[k])}</td></tr>`).join("")}
        <tr><td>MBK</td><td>${A.esc(s.katalogus?.mbk || "–")}</td><td>${A.esc(e.mbk || "")}</td><td>${mark(ev?.catalog?.mbk)}</td></tr>
        <tr><td>Michel</td><td>${A.esc(s.katalogus?.michel || "–")}</td><td>${A.esc(e.michel || "")}</td><td>${mark(ev?.catalog?.michel)}</td></tr>
        <tr><td>Condition</td><td>${A.esc(A.condL(s.cond))} ${A.esc(A.gradeL(s.grade))}</td><td>${A.esc(e.cond ? A.condL(e.cond) : "")}</td><td>${mark(ev?.fields?.cond)}</td></tr>
        <tr><td>Confidence</td><td>${s.bizonyossag}%</td><td></td><td></td></tr>
        <tr><td>Valuation</td><td>${s.becsult ? A.esc(`${s.becsult.min}–${s.becsult.max} EUR`) : "–"}</td><td></td><td></td></tr></tbody></table>` : `<p class="muted">No usable result.</p>`}</div>
      <div class="card form"><h3 class="sec-t">Verified result and correction</h3><p class="muted" style="font-size:.8rem;margin:2px 0 6px">Fill in only what you verified from a catalogue or the stamp. If a catalogue number does not exist, write “none”.</p>
        <form id="labExp">${[["nev","Name"],["orszag","Country"],["kiadas_eve","Year of issue"],["nevertek","Value"],["mbk","MBK no."],["michel","Michel no."]].map(([k, l]) => `<label for="le-${k}">${l}</label><input class="field" id="le-${k}" name="${k}" value="${A.esc(e[k] || "")}">`).join("")}
        <label for="le-cond">Condition</label><select class="field" id="le-cond" name="cond"><option value="">not verified</option>${A.COND.map(c => `<option value="${c.k}" ${e.cond === c.k ? "selected" : ""}>${A.esc(c.l)}</option>`).join("")}</select>
        ${common(r)}</form><button class="btn primary" data-act="lab-save-eval" style="margin-top:10px">Save evaluation</button></div>` : "";
    const page = r.mode === "page" ? `<div class="card"><h3 class="sec-t">Check detections</h3>
        <p class="muted" style="font-size:.8rem;margin:2px 0 8px">Tap a box, mark it correct or false, and drag its corner to the right crop. Add any missed stamp.</p>
        <div class="lab-stage" id="labStage"><img src="${img}" alt="Album page"><svg id="labSvg" viewBox="0 0 1000 1000" preserveAspectRatio="none"></svg></div>
        <div class="legend"><span><i style="background:#7FD1A6"></i>correct</span><span><i style="background:#F3B0A8"></i>false detection</span><span><i style="background:#C5A46D"></i>missed</span></div>
        <div class="row" style="margin-top:8px"><button class="btn ghost small" data-act="lab-b-ok">Correct</button><button class="btn ghost small" data-act="lab-b-fp">False</button><button class="btn ghost small" data-act="lab-b-miss">${A.ic("plus", 16)} Missed</button></div>
        <form id="labExp" class="form"><label for="le-truth">Actual number of stamps on the page</label><input class="field" id="le-truth" name="truth" inputmode="numeric" value="${A.esc(L.page.truthCount)}">${common(r)}</form>
        <div id="labPm" class="kv"></div>
        <button class="btn primary" data-act="lab-save-page" style="margin-top:10px">Save evaluation</button></div>` : "";
    shell(`<button class="linkbtn" data-act="lab-tab" data-t="runs">${A.ic("back", 14)} Back to runs</button>
      ${r.mode === "single" ? `<img class="lab-img" src="${img}" alt="Test image">` : ""}
      <div class="card"><h3 class="sec-t">Run details</h3><dl class="kv">
        <dt>Time</dt><dd>${new Date(r.createdAt).toLocaleString(window.BS.LOC)}</dd><dt>Mode</dt><dd>${r.mode === "page" ? "album page" : "single stamp"}</dd>
        <dt>Prompt</dt><dd>${A.esc(r.promptVersion)} · ${A.esc(r.promptHash)}</dd><dt>Model</dt><dd>${A.esc(r.modelApplied || ("tier: " + r.modelTier + " (the interface did not return the exact model)"))}</dd>
        <dt>Response time</dt><dd>${r.responseMs.toLocaleString(window.BS.LOC)} ms</dd><dt>Image</dt><dd>${r.origW}×${r.origH} px original → ${r.sentW}×${r.sentH} px sent · ${Math.round(r.origBytes / 1024)} kB · stored copy ≤ 230 kB</dd>
        <dt>Tokens</dt><dd>≈ ${r.tokens.input.toLocaleString(window.BS.LOC)} in / ${r.tokens.output.toLocaleString(window.BS.LOC)} out${r.tokens.costUsd != null ? ` · ≈ ${dec(r.tokens.costUsd, 4)} USD` : " · cost cannot be determined"}</dd>
        ${r.error ? `<dt>Error</dt><dd>${A.esc(r.error)}</dd>` : ""}${r.parseError ? `<dt>Parsing error</dt><dd>${A.esc(r.parseError)}</dd>` : ""}${r.truncated ? `<dt>Truncated response</dt><dd>yes</dd>` : ""}</dl></div>
      ${single}${page}
      <details class="card"><summary><b>Raw AI response</b> <span class="muted">(${r.rawLen.toLocaleString(window.BS.LOC)} characters)</span></summary><pre class="raw">${A.esc(r.rawText)}</pre></details>`);
    if (r.mode === "page") { drawBoxes(); bindBoxes(); showPm(); }
  }
  function common(r){
    const A = B.app;
    return `<label for="le-cat">Error category</label><select class="field" id="le-cat" name="errorCat">${ERR.map(c => `<option value="${A.esc(c)}" ${r.errorCat === c ? "selected" : ""}>${c ? (ERR_L[c] || c) : "– choose –"}</option>`).join("")}</select>
      <label for="le-note">Note</label><input class="field" id="le-note" name="note" value="${A.esc(r.note || "")}">`;
  }
  /* ---------- albumoldali keretek ---------- */
  const allBoxes = () => [...L.page.boxes.map((b, i) => ({b, i, kind: b.state === "fp" ? "fp" : "ok", r: b.cur})), ...L.page.missed.map((m, i) => ({b:null, i: 1000 + i, kind:"miss", r:m}))];
  function drawBoxes(){
    const svg = document.getElementById("labSvg"); if (!svg) return;
    svg.innerHTML = allBoxes().map(({i, kind, r}, n) => { const on = i === L.sel; return `<g class="lb ${kind} ${on ? "on" : ""}" data-lb="${i}"><rect class="b" x="${r[0]}" y="${r[1]}" width="${r[2] - r[0]}" height="${r[3] - r[1]}"/>${on ? [[r[0], r[1], "nw"], [r[2], r[1], "ne"], [r[0], r[3], "sw"], [r[2], r[3], "se"]].map(([x, y, h]) => `<rect class="h" data-h="${h}" x="${x - 18}" y="${y - 18}" width="36" height="36"/>`).join("") : ""}<text x="${r[0] + 8}" y="${r[1] + 34}">${n + 1}</text></g>`; }).join("");
  }
  const boxRef = i => i >= 1000 ? {get: () => L.page.missed[i - 1000], set: v => { L.page.missed[i - 1000] = v; }} : {get: () => L.page.boxes[i].cur, set: v => { L.page.boxes[i].cur = v; }};
  function pt(e){ const r = document.getElementById("labSvg").getBoundingClientRect(); return [Math.max(0, Math.min(1000, (e.clientX - r.left) / r.width * 1000)), Math.max(0, Math.min(1000, (e.clientY - r.top) / r.height * 1000))]; }
  function bindBoxes(){
    const svg = document.getElementById("labSvg"); if (!svg) return;
    svg.addEventListener("pointerdown", e => { const g = e.target.closest("[data-lb]"); if (!g) { L.sel = -1; drawBoxes(); return; } L.sel = +g.dataset.lb; const [px, py] = pt(e); L.drag = {h: e.target.dataset?.h || "move", px, py, b: [...boxRef(L.sel).get()]}; try { svg.setPointerCapture(e.pointerId); } catch(err){} drawBoxes(); e.preventDefault(); });
    svg.addEventListener("pointermove", e => { if (!L.drag) return; const d = L.drag, [px, py] = pt(e), dx = px - d.px, dy = py - d.py, b = [...d.b];
      if (d.h === "move") { const w = b[2] - b[0], h = b[3] - b[1]; b[0] = Math.max(0, Math.min(1000 - w, b[0] + dx)); b[1] = Math.max(0, Math.min(1000 - h, b[1] + dy)); b[2] = b[0] + w; b[3] = b[1] + h; }
      else { if (d.h.includes("w")) b[0] = Math.min(b[2] - 30, b[0] + dx); if (d.h.includes("e")) b[2] = Math.max(b[0] + 30, b[2] + dx); if (d.h.includes("n")) b[1] = Math.min(b[3] - 30, b[1] + dy); if (d.h.includes("s")) b[3] = Math.max(b[1] + 30, b[3] + dy); }
      boxRef(L.sel).set(b.map(Math.round)); drawBoxes(); showPm(); });
    const end = () => { L.drag = null; }; svg.addEventListener("pointerup", end); svg.addEventListener("pointercancel", end);
  }
  function showPm(){
    const el = document.getElementById("labPm"); if (!el) return; const t = document.getElementById("le-truth"); if (t) L.page.truthCount = +t.value || 0;
    const m = pageMetrics(L.page);
    el.innerHTML = `<dt>Detected boxes</dt><dd>${m.detected}</dd><dt>Correct / false</dt><dd>${m.tp} / ${m.fp}</dd><dt>Missed</dt><dd>${m.missed}</dd><dt>Mean IoU</dt><dd>${dec(m.meanIoU)} <span class="muted">(1.00 = the crop needed no correction)</span></dd>`;
  }

  /* ---------- export ---------- */
  async function exportLab(kind){
    const A = B.app; let dl = null; try { dl = window.claude?.use ? await window.claude.use("downloads") : null; } catch(e){}
    if (!dl) return A.toast("Saving files is not available in this view.");
    const d = new Date().toISOString().slice(0, 10), pre = B.BRAND.filePrefix;
    try {
      if (kind === "json") { const runs = []; for (const r of LS.runs) runs.push({...r, image: await getImg(r.imgId)}); await dl.save({filename:`${pre}-recognition-lab-${d}.json`, data:new Blob([JSON.stringify({app:B.BRAND.exportId, kind:"recognition-lab", note:"Measurement data – not collection data, not model retraining.", exportedAt:new Date().toISOString(), runs})], {type:"application/json"})}); }
      else {
        const H = ["id","time","mode","prompt","prompt-hash","model","response ms","AI name","AI country","AI year","AI value","AI MBK","AI Michel","confidence","verified name","verified country","verified year","verified value","verified MBK","verified Michel","correct fields","evaluated fields","actual count","correct detections","false","missed","mean IoU","error category","input tokens","output tokens","cost USD"];
        const cell = v => { const s = String(v ?? ""); return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
        const rows = LS.runs.map(r => { const s = r.result?.[0] || {}, e = r.expected || {}, ev = r.evaluation || {}, pm = r.pageMetrics || {};
          return [r.id, new Date(r.createdAt).toISOString(), r.mode, r.promptVersion, r.promptHash, r.modelApplied || r.modelTier, r.responseMs, s.nev, s.orszag, s.kiadas_eve, s.nevertek, s.katalogus?.mbk, s.katalogus?.michel, s.bizonyossag, e.nev, e.orszag, e.kiadas_eve, e.nevertek, e.mbk, e.michel, ev.correct, ev.evaluated, pm.truth, pm.tp, pm.fp, pm.missed, pm.meanIoU != null ? pm.meanIoU.toFixed(3) : "", r.errorCat, r.tokens?.input, r.tokens?.output, r.tokens?.costUsd ?? ""]; });
        await dl.save({filename:`${pre}-recognition-lab-${d}.csv`, data:new Blob(["﻿" + [H, ...rows].map(x => x.map(cell).join(";")).join("\r\n")], {type:"text/csv"})});
      }
      A.toast("Lab export saved");
    } catch(e){ A.toast(e?.code === "declined" ? "Saving cancelled." : "Export failed."); }
  }

  /* ---------- események ---------- */
  function openLab(){ const h = ov(); h.hidden = false; document.body.classList.add("ov-open"); requestAnimationFrame(() => h.classList.add("on")); L.tab = "new"; render(); }
  function closeLab(){ const h = ov(); if (!h || h.hidden) return; h.classList.remove("on"); h.hidden = true; if (document.getElementById("v-detail").hidden && document.getElementById("v-article").hidden) document.body.classList.remove("ov-open"); if (location.hash === "#recognition-lab") location.hash = ""; }
  document.addEventListener("change", e => { if (!e.target.matches("[data-lab-in]")) return; const f = e.target.files[0]; e.target.value = ""; if (!f) return; if (L.fileURL) URL.revokeObjectURL(L.fileURL); L.file = f; L.fileURL = URL.createObjectURL(f); render(); });
  document.addEventListener("input", e => { if (e.target.id === "le-truth") showPm(); });
  document.addEventListener("click", async e => {
    const a = e.target.closest("[data-act]"); if (!a) return; const A = B.app, act = a.dataset.act;
    if (act === "lab-open-lab") { A.closeModal(); openLab(); return; }
    if (!act.startsWith("lab-")) return;
    if (act === "lab-close") return closeLab();
    if (act === "lab-tab") { L.tab = a.dataset.t; L.open = null; return render(); }
    if (act === "lab-mode") { L.mode = a.dataset.m; return render(); }
    if (act === "lab-run") return runTest(a);
    if (act === "lab-open") return openRun(a.dataset.id);
    const r = LS.runs.find(x => x.id === L.open);
    if (act === "lab-save-eval" && r) {
      const fd = new FormData(document.getElementById("labExp")), exp = {}; for (const k of ["nev","orszag","kiadas_eve","nevertek","mbk","michel","cond"]) exp[k] = String(fd.get(k) || "").trim();
      r.expected = exp; r.evaluation = evaluate(r); r.errorCat = String(fd.get("errorCat") || ""); r.note = String(fd.get("note") || ""); r.evaluatedAt = Date.now();
      try { await putRun(r); A.toast("Evaluation saved"); A.haptic(10); openRun(r.id); } catch(err){ A.toast("Could not save."); }
    }
    if (act === "lab-save-page" && r) {
      const fd = new FormData(document.getElementById("labExp")); L.page.truthCount = +fd.get("truth") || 0;
      r.page = JSON.parse(JSON.stringify(L.page)); r.pageMetrics = pageMetrics(r.page); r.errorCat = String(fd.get("errorCat") || ""); r.note = String(fd.get("note") || ""); r.evaluatedAt = Date.now();
      try { await putRun(r); A.toast("Album page evaluation saved"); A.haptic(10); openRun(r.id); } catch(err){ A.toast("Could not save."); }
    }
    if ((act === "lab-b-ok" || act === "lab-b-fp") && L.page && L.sel >= 0 && L.sel < 1000) { L.page.boxes[L.sel].state = act === "lab-b-ok" ? "ok" : "fp"; drawBoxes(); showPm(); }
    if (act === "lab-b-miss" && L.page) { L.page.missed.push([400, 400, 600, 640]); L.sel = 1000 + L.page.missed.length - 1; drawBoxes(); showPm(); }
    if (act === "lab-save-price") { const p = {in: document.getElementById("lp-in").value.replace(",", "."), out: document.getElementById("lp-out").value.replace(",", ".")}; try { localStorage.setItem("lab_prices", JSON.stringify(p)); } catch(err){} A.toast("Token prices saved – they apply to new runs"); }
    if (act === "lab-clear") { if (!a.dataset.confirm) { a.dataset.confirm = "1"; a.textContent = "Delete all test runs for sure?"; return; } await delAll(); A.toast("Lab data deleted"); render(); }
    if (act === "lab-exp-json") exportLab("json");
    if (act === "lab-exp-csv") exportLab("csv");
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !ov().hidden && !document.querySelector("#modal.on")) closeLab(); });
  window.addEventListener("hashchange", () => { if (location.hash === "#recognition-lab") openLab(); });
  if (location.hash === "#recognition-lab") setTimeout(openLab, 50);
  Object.assign(B, {openLab, closeLab, labInternals: {LS, evaluate, pageMetrics, iou, estTokens}});
})();
