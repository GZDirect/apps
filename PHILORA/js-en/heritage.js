/* GENERÁLT FÁJL – ne szerkeszd. Forrás: js/heritage.js, szótár: tools/i18n/en.json, eszköz: tools/i18n/build-en.js */
/* PHILORA Örökség – leltár és eredet (proveniencia). A portfólióból nyílik.
   Adat: a tétel példányadatai bővülnek egy opcionális „eredet” mezővel (előző tulajdonos, attest, megjegyzés);
   a dokumentumfotók külön „irat” típusú dokumentumok (a tétel dokumentumának mérete így nem nő);
   az örökösöknek szóló üzenet a beállítások (prefs) dokumentumban él. Meglévő mező nem változik.
   Minden érték előzetes AI-becslés – ez a leltár nem hivatalos értékbecslés. */
(() => {
  const B = window.BS;
  const H = {limit: 30};
  const ov = () => document.getElementById("v-heritage");
  const docsOf = (A, id) => A.S.raw.filter(d => d.kind === "irat" && d.itemId === id).sort((a, b) => (a.t || 0) - (b.t || 0));
  const has = v => v != null && String(v).trim() !== "";
  function money(A, lo, hi){ const u = A.groupUnit((lo + hi) / 2, lo, hi); return `${A.fmtU(lo, u)} – ${A.fmtU(hi, u)}`; }

  function render(){
    const A = B.app, h = ov(); if (!A || !h || h.hidden) return;
    const I = A.S.items, esc = A.esc, demo = A.store.mode === "demo", n = I.length;
    const pricedL = I.filter(i => (+i.max || 0) > 0), lo = pricedL.reduce((s, i) => s + (+i.min || 0), 0), hi = pricedL.reduce((s, i) => s + (+i.max || 0), 0);
    const conf = I.filter(i => i.azonositas?.megerositve).length;
    const byAlb = new Map(); for (const i of I) { const k = i.peldany?.album || ""; const x = byAlb.get(k) || {n: 0, lo: 0, hi: 0}; x.n++; x.lo += +i.min || 0; x.hi += +i.max || 0; byAlb.set(k, x); }
    const noPlace = I.filter(i => !has(i.peldany?.album) && !has(i.peldany?.hely)).length;
    const cnt = {besz: I.filter(i => i.peldany?.beszerzes && (has(i.peldany.beszerzes.forras) || i.peldany.beszerzes.ar)).length, elozo: I.filter(i => has(i.peldany?.eredet?.elozo)).length,
      attest: I.filter(i => has(i.peldany?.eredet?.attest?.szam) || has(i.peldany?.eredet?.attest?.szakerto)).length, docs: I.filter(i => docsOf(A, i.id).length).length};
    const bar = (l, x) => `<div class="hr-p"><div class="cov-top"><b>${l}</b><span>${x}/${n}</span></div><div class="prog" role="progressbar" aria-label="${l}" aria-valuenow="${n ? Math.round(x / n * 100) : 0}" aria-valuemin="0" aria-valuemax="100"><i style="width:${n ? Math.round(x / n * 100) : 0}%"></i></div></div>`;
    const L = [...I].sort((a, b) => A.mid(b) - A.mid(a)), shown = L.slice(0, H.limit), og = A.S.prefs?.orokseg || {};
    h.innerHTML = `<div class="ov-bar"><button class="iconbtn" data-act="hr-close" aria-label="Back">${A.ic("back", 22)}</button><span class="ov-t">Heritage<small>Inventory and provenance</small></span><span style="width:44px"></span></div>
      <div class="ov-body"><div class="wrap heritage">
        <p class="atl-lead">Long-term documentation of your collection – for insurance, inheritance, selling or an expert.</p>
        ${n ? `
        <div class="card"><h3 class="sec-t">${A.ic("book", 18)} Inventory</h3>
          <dl class="facts"><dt>Items (physical copies)</dt><dd>${n}</dd><dt>Estimated value</dt><dd>${pricedL.length ? money(A, lo, hi) : "no data"} <span class="st st-ai">AI estimate</span></dd>
          <dt>Priced</dt><dd>${pricedL.length}/${n}</dd><dt>Confirmed identification</dt><dd>${conf}/${n}</dd><dt>Items without location</dt><dd>${noPlace}</dd></dl>
          <table class="pr hr-alb"><tr><th>Album</th><th>pcs</th><th>Value</th></tr>${[...byAlb.entries()].map(([k, x]) => `<tr><td>${esc(k ? (A.S.albums.find(a => a.id === k)?.name || "–") : "No album")}</td><td>${x.n}</td><td>${x.hi > 0 ? money(A, x.lo, x.hi) : "–"}</td></tr>`).join("")}</table>
        </div>
        <div class="card"><h3 class="sec-t">${A.ic("shield", 18)} Provenance documentation</h3>
          ${bar("Acquisition (source or price)", cnt.besz)}${bar("Previous owner", cnt.elozo)}${bar("Expert certificate", cnt.attest)}${bar("Document photo", cnt.docs)}</div>
        <div class="sec-h"><h3>Item provenance</h3><span class="muted">${n} items · by value</span></div>
        ${shown.map(i => { const e = i.peldany?.eredet || {}, dn = docsOf(A, i.id).length; return `<button class="item" data-act="hr-edit" data-id="${esc(i.id)}"><div class="stamp sm">${A.thumbHTML(i.thumb || i.photo)}</div><div style="min-width:0;text-align:left"><div class="t">${esc(i.result?.nev || "Stamp")}</div><div class="s">${esc(i.peldany?.kod || "")}${has(e.elozo) ? " · " + esc(e.elozo) : ""}</div><div class="hr-bd">${has(e.attest?.szam) || has(e.attest?.szakerto) ? `<span class="chip g">✓ attest</span>` : ""}${dn ? `<span class="chip">${dn} document(s)</span>` : ""}${i.peldany?.beszerzes?.forras ? `<span class="chip">${esc(i.peldany.beszerzes.forras)}</span>` : ""}</div></div>${A.ic("edit", 18)}</button>`; }).join("")}
        ${L.length > shown.length ? `<button class="btn ghost small" data-act="hr-more">More (${L.length - shown.length})</button>` : ""}
        <div class="card" style="margin-top:14px"><h3 class="sec-t">${A.ic("heart", 18)} Message to heirs</h3>
          <form id="hrMsg" class="form"><label for="hr-u">What should they do with the collection? (e.g. whom to show it to, what not to soak off)</label><textarea class="field" id="hr-u" name="uzenet" rows="4">${esc(og.uzenet || "")}</textarea>
          <label for="hr-k">Whom should they contact? (expert, club, dealer)</label><input class="field" id="hr-k" name="kapcsolat" value="${esc(og.kapcsolat || "")}" autocomplete="off">
          <button type="button" class="btn ghost" data-act="hr-savemsg" style="margin-top:8px">${A.ic("check", 18)} Save</button>${og.t ? `<p class="muted" style="font-size:.75rem">Last saved: ${A.today(og.t)}</p>` : ""}</form></div>
        <div class="card"><h3 class="sec-t">${A.ic("download", 18)} Export</h3>
          <div class="row"><button class="btn primary" data-act="hr-report">${A.ic("download", 18)} Estate inventory (printable)</button><button class="btn ghost" data-act="export">${A.ic("download", 18)} Full backup (JSON)</button></div>
          <p class="disc">The inventory is an HTML file; your browser’s “Print → Save as PDF” turns it into a PDF. The JSON backup also contains the document photos and fully restores the collection.${demo ? " Export is not available in demo mode." : ""}</p></div>`
        : `<div class="empty-state">${A.ic("book", 30)}<b>Nothing to inventory yet</b><span>Scan a stamp and record its provenance here.</span><button class="btn primary small" data-act="goscan-single">${A.ic("camera", 16)} Scan</button></div>`}
        <div class="disc">Values are preliminary AI estimates without live market data; this inventory is not an official valuation. For insurance or probate, ask for an expert valuation.</div>
      </div></div>`;
  }

  function editModal(A, i){
    const e = i.peldany?.eredet || {}, b = i.peldany?.beszerzes || {}, esc = A.esc, D = docsOf(A, i.id);
    A.openModal(`<h2 style="margin:8px 0 4px">Provenance</h2><p class="muted" style="margin:0 0 10px">${esc(i.result?.nev || "Stamp")} · ${esc(i.peldany?.kod || "")}</p>
      <form id="hrForm" class="form">
        <label for="hr-e">Previous owner / collection</label><input class="field" id="hr-e" name="elozo" value="${esc(e.elozo || "")}" placeholder="e.g. grandpa’s collection, estate of X. Y." autocomplete="off">
        <label for="hr-bf">Purchase source</label><input class="field" id="hr-bf" name="forras" value="${esc(b.forras || "")}" placeholder="e.g. stamp fair, auction, estate" autocomplete="off">
        <div class="row"><div style="flex:1"><label for="hr-bd">Date</label><input class="field" id="hr-bd" name="datum" type="date" value="${esc(b.datum || "")}"></div><div style="flex:1"><label for="hr-ba">Price (Ft)</label><input class="field" id="hr-ba" name="ar" inputmode="numeric" value="${b.ar || ""}"></div></div>
        <h3 class="sec-t" style="margin-top:12px">Expert certificate</h3>
        <label for="hr-as">Expert</label><input class="field" id="hr-as" name="szakerto" value="${esc(e.attest?.szakerto || "")}" autocomplete="off">
        <div class="row"><div style="flex:1"><label for="hr-an">Certificate number</label><input class="field" id="hr-an" name="szam" value="${esc(e.attest?.szam || "")}" autocomplete="off"></div><div style="flex:1"><label for="hr-ad">Date</label><input class="field" id="hr-ad" name="adatum" type="date" value="${esc(e.attest?.datum || "")}"></div></div>
        <label for="hr-m">Note on provenance</label><textarea class="field" id="hr-m" name="megjegyzes" rows="3">${esc(e.megjegyzes || "")}</textarea>
      </form>
      <h3 class="sec-t" style="margin-top:12px">Document photos</h3><p class="muted" style="font-size:.8125rem;margin:0 0 6px">Photo of an invoice, auction sheet or certificate. Stored compressed, up to about 200 kB.</p>
      <div class="hr-docs">${D.map(d => `<figure><img src="${d.kep}" alt="${esc(d.cim || "Document")}"><figcaption>${esc(d.cim || "Document")} · ${A.today(d.t)}</figcaption><button class="linkbtn" data-act="hr-deldoc" data-doc="${esc(d.id)}" data-id="${esc(i.id)}" aria-label="Delete document: ${esc(d.cim || "Document")}">${A.ic("trash", 16)} Delete</button></figure>`).join("") || `<p class="muted" style="font-size:.8125rem">No documents yet.</p>`}</div>
      <label class="btn ghost small" style="margin-top:6px">${A.ic("image", 16)} Add document<input type="file" accept="image/*" data-hrdoc="${esc(i.id)}" hidden></label>
      <div class="row" style="margin-top:14px"><button class="btn ghost" data-act="close">Cancel</button><button class="btn primary" data-act="hr-save" data-id="${esc(i.id)}">Save</button></div>`);
  }
  async function compressDoc(A, file){
    const {im: img, url: obj} = await A.loadImg(file); let max = 1400, q = 0.8, url = "";
    for (let k = 0; k < 6; k++) { const c = A.toCanvas(img, max); url = c.toDataURL("image/jpeg", q); if (url.length * .75 <= 200000) break; max = Math.round(max * .8); q = Math.max(.5, q - .08); }
    try { URL.revokeObjectURL(obj); } catch(e){}
    return url;
  }
  async function report(A){
    if (A.store.mode === "demo") return A.toast("No export in demo mode – demo data cannot go into a live file.");
    let dl = null; try { dl = window.claude?.use ? await window.claude.use("downloads") : null; } catch(e){}
    if (!dl) return A.toast("Saving files is not available in this view – open the app on claude.ai.");
    const I = [...A.S.items].sort((a, b) => A.mid(b) - A.mid(a)), esc = A.esc, d = new Date().toISOString().slice(0, 10), og = A.S.prefs?.orokseg || {};
    const pr = I.filter(i => (+i.max || 0) > 0), lo = pr.reduce((s, i) => s + (+i.min || 0), 0), hi = pr.reduce((s, i) => s + (+i.max || 0), 0);
    const rows = I.map(i => { const r = i.result || {}, e = i.peldany?.eredet || {}, b = i.peldany?.beszerzes || {}, ev = (i.ertekelesek || []).slice(-1)[0] || {}, alb = A.S.albums.find(a => a.id === i.peldany?.album);
      return `<tr><td>${i.thumb ? `<img src="${i.thumb}" alt="">` : ""}</td><td><b>${esc(r.nev || "Stamp")}</b><br>${esc(i.peldany?.kod || "")}<br>${esc([r.orszag, r.kiadas_eve, r.nevertek].filter(Boolean).join(" · "))}${A.catText(r.katalogus) ? `<br>${esc(A.catText(r.katalogus))}` : ""}</td>
        <td>${esc(A.condL(i.cond))}, ${esc(A.gradeL(i.grade))}${i.azonositas?.megerositve ? "<br>identification confirmed" : "<br>identification: AI suggestion"}</td>
        <td class="n">${(+i.max || 0) > 0 ? esc(A.rng(i.min, i.max, r)) : "–"}<br><small>${ev.t ? new Date(ev.t).toISOString().slice(0, 10) : ""}</small></td>
        <td>${esc([alb?.name, i.peldany?.hely].filter(Boolean).join(", "))}</td>
        <td>${esc([b.forras, b.datum, b.ar ? A.hufFmt(b.ar) : ""].filter(Boolean).join(" · "))}${has(e.elozo) ? `<br>Previous: ${esc(e.elozo)}` : ""}${has(e.attest?.szam) || has(e.attest?.szakerto) ? `<br>Certificate: ${esc([e.attest.szakerto, e.attest.szam, e.attest.datum].filter(Boolean).join(", "))}` : ""}${has(e.megjegyzes) ? `<br>${esc(e.megjegyzes)}` : ""}${docsOf(A, i.id).length ? `<br>${docsOf(A, i.id).length} document photo(s) (in the JSON backup)` : ""}</td></tr>`; }).join("");
    const html = `<!DOCTYPE html><html lang="${B.lang}"><head><meta charset="utf-8"><title>${esc(B.BRAND.name)} – estate inventory ${d}</title><style>body{font:12px/1.45 Arial,sans-serif;color:#242A27;margin:24px}h1{font:600 24px Georgia,serif;color:#10382F;margin:0}h2{font:600 16px Georgia,serif;color:#10382F;margin:18px 0 6px}table{border-collapse:collapse;width:100%}th,td{border-bottom:1px solid #ddd;padding:5px 6px;text-align:left;vertical-align:top}th{background:#F5F0E5}td img{width:48px}.n{text-align:right}.box{border:1px solid #C5A46D;padding:10px;border-radius:6px;background:#FBF8F1}.note{font-size:11px;color:#5A665D}</style></head><body>
      <h1>${esc(B.BRAND.name)} – estate inventory</h1><p>Created: ${d} · ${I.length} items · estimated value: ${pr.length ? esc(money(A, lo, hi)) : "no data"} (${pr.length}/${I.length} priced) · €1 ≈ ${Math.round(A.rate())} Ft</p>
      <p class="box"><b>Important:</b> values are preliminary AI estimates from photos, without live market or auction data. This inventory is not an official valuation; insurance or probate requires an expert valuation.</p>
      ${has(og.uzenet) || has(og.kapcsolat) ? `<h2>Message to heirs</h2><div class="box">${esc(og.uzenet || "").replace(/\n/g, "<br>")}${has(og.kapcsolat) ? `<p><b>Whom to contact:</b> ${esc(og.kapcsolat)}</p>` : ""}</div>` : ""}
      <h2>Items</h2><table><tr><th></th><th>Name</th><th>Condition</th><th class="n">Estimate</th><th>Location</th><th>Provenance</th></tr>${rows}</table>
      <p class="note">Made with the ${esc(B.BRAND.name)} app. The full data (photos, documents) is in the JSON backup.</p></body></html>`;
    try { await dl.save({filename: `${B.BRAND.filePrefix}-hagyateki-leltar-${d}.html`, data: new Blob([html], {type: "text/html"})}); A.toast("File saved"); }
    catch(e){ A.toast(e?.code === "declined" ? "Saving cancelled." : "Saving failed."); }
  }

  function openHeritage(){ const A = B.app, h = ov(); if (!A || !h) return; H.limit = 30; h.hidden = false; document.body.classList.add("ov-open"); requestAnimationFrame(() => h.classList.add("on")); render(); try { h.querySelector("[data-act=hr-close]").focus({preventScroll: true}); } catch(e){} }
  function closeHeritage(){ const h = ov(); if (!h || h.hidden) return; h.classList.remove("on"); h.hidden = true; if (!document.querySelector(".overlay:not([hidden])")) document.body.classList.remove("ov-open"); }

  document.addEventListener("change", async e => {
    const inp = e.target.closest?.("[data-hrdoc]"); if (!inp || !inp.files[0]) return; const A = B.app, id = inp.dataset.hrdoc, it = A.S.items.find(x => x.id === id); if (!it) return;
    try { const kep = await compressDoc(A, inp.files[0]); const t = Date.now(); await A.store.put(`irat_${id}_${t}`, {kind: "irat", itemId: id, t, cim: (inp.files[0].name || "Document").replace(/\.[a-z0-9]+$/i, "").slice(0, 60), kep}); A.toast("Document added"); setTimeout(() => { const i2 = A.S.items.find(x => x.id === id); if (i2) editModal(A, i2); }, 150); }
    catch(err){ A.toast("The document could not be saved."); }
    inp.value = "";
  });
  document.addEventListener("click", async e => {
    const a = e.target.closest("[data-act]"); if (!a) return; const A = B.app, act = a.dataset.act; if (!A) return;
    if ((act === "goscan-single" || act === "goscan-page") && !ov()?.hidden) { closeHeritage(); return; }
    if (!act.startsWith("hr-")) return;
    if (act === "hr-open") openHeritage();
    else if (act === "hr-close") closeHeritage();
    else if (act === "hr-more") { H.limit += 30; render(); }
    else if (act === "hr-edit") { const i = A.S.items.find(x => x.id === a.dataset.id); if (i) editModal(A, i); }
    else if (act === "hr-save") {
      const i = A.S.items.find(x => x.id === a.dataset.id); if (!i) return; const fd = new FormData(document.getElementById("hrForm")), s = k => String(fd.get(k) || "").trim();
      const ar = parseInt(s("ar").replace(/\D/g, ""), 10) || null, old = i.peldany?.beszerzes || {};
      const besz = ar || s("datum") || s("forras") ? {...old, ar, datum: s("datum"), forras: s("forras")} : null;
      const att = s("szakerto") || s("szam") || s("adatum") ? {szakerto: s("szakerto"), szam: s("szam"), datum: s("adatum")} : null;
      const eredet = s("elozo") || att || s("megjegyzes") ? {elozo: s("elozo"), attest: att, megjegyzes: s("megjegyzes"), t: Date.now()} : null;
      try { await A.store.put(i.id, {...i, peldany: {...(i.peldany || {}), beszerzes: besz, eredet}}); A.closeModal(); A.toast("Provenance saved"); A.haptic?.(10); render(); } catch(err){ A.toast("Could not save."); }
    }
    else if (act === "hr-deldoc") { if (!confirm("Delete the document for sure?")) return; try { await A.store.del(a.dataset.doc); A.toast("Document deleted"); const i = A.S.items.find(x => x.id === a.dataset.id); if (i) setTimeout(() => editModal(A, i), 100); } catch(err){ A.toast("Could not delete."); } }
    else if (act === "hr-savemsg") {
      const fd = new FormData(document.getElementById("hrMsg")), p = A.S.prefs || {};
      try { await A.store.put("prefs", {...p, kind: "prefs", orokseg: {uzenet: String(fd.get("uzenet") || ""), kapcsolat: String(fd.get("kapcsolat") || ""), t: Date.now()}}); A.toast("Message saved"); render(); } catch(err){ A.toast("Could not save."); }
    }
    else if (act === "hr-report") report(A);
  });
  B.refreshHeritage = () => { if (!ov()?.hidden) render(); };
  B.openHeritage = openHeritage; B.closeHeritage = closeHeritage;
})();
