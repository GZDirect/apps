/* GENERÁLT FÁJL – ne szerkeszd. Forrás: js/detail.js, szótár: tools/i18n/en.json, eszköz: tools/i18n/build-en.js */
/* PHILORA – Bélyegadatlap (teljes képernyő). A fotó a fő elem; vízjel, gumizás, fogazat csak ellenőrzött jelöléssel jelenik meg biztosként. */
(() => {
  const B = window.BS;
  const D = {id:null, tab:"adatok", side:"front"};
  const TIPUS = {gyujtemeny:"Collection copy", duplikatum:"Duplicate", csere:"Swap copy"};
  /* i18n-skip-start: tárolt értékek */ const GUM = ["postatiszta, eredeti gumizás", "falcnyom", "falcmaradvány", "gumi nélkül", "pecsételt (nem értelmezhető)"]; /* i18n-skip-end */
  const GUM_L = {"postatiszta, eredeti gumizás": "mint, original gum", "falcnyom": "hinge mark", "falcmaradvány": "hinge remnant", "gumi nélkül": "no gum", "pecsételt (nem értelmezhető)": "used (not applicable)"};
  const VER = [["fogazat","Perforation"],["vizjel","Watermark"],["gumizas","Gum"]];
  const el = () => document.getElementById("v-detail");

  function verified(i, k){ return i.ellenorzott?.[k]; }
  function tabAdatok(A, i){
    const r = i.result || {}, p = i.peldany || {}, alb = A.S.albums.find(a => a.id === p.album);
    const jl = (r.jeloltek || []).filter(j => A.catText(j.katalogus) || j.nev);
    return `${A.idCardHTML(r, {interactive:false, confirmed: !!i.azonositas?.megerositve})}
      <button class="btn ghost small" data-act="d-editid" style="margin:-4px 0 8px">${A.ic("edit", 16)} Correct identification</button>
      ${jl.length > 1 ? `<div class="card"><h3 class="sec-t">Possible catalogue matches</h3>${jl.map((j, n) => `<div class="ph"><span>${n + 1}. ${A.esc(j.nev || r.nev || "")}${j.kiadas_eve ? " · " + A.esc(j.kiadas_eve) : ""}<br><small class="muted">${A.esc(A.catText(j.katalogus) || "catalogue no. unknown")}</small></span><span class="chip ${A.confLevel(j.bizonyossag)[0]}">${j.bizonyossag}%</span></div>`).join("")}<div class="disc" style="padding:6px 0 0">AI suggestions – check them in a catalogue.</div></div>` : ""}
      <div class="card"><h3 class="sec-t">Physical copy</h3><dl class="facts">
        <dt>ID</dt><dd><b>${A.esc(p.kod || "–")}</b></dd>
        <dt>Type</dt><dd>${A.esc(TIPUS[p.tipus || "gyujtemeny"])}</dd>
        <dt>Virtual album</dt><dd>${alb ? A.esc(alb.name) : '<span class="unk">none</span>'}</dd>
        <dt>Album location</dt><dd>${A.valOr(p.hely)}</dd>
        <dt>Note</dt><dd>${A.valOr(p.megjegyzes)}</dd>
        <dt>Portfolio</dt><dd>${A.esc(A.pfName(i.pf))}</dd></dl>
        <button class="btn ghost small" data-act="d-editinst" style="margin-top:10px">${A.ic("edit", 16)} Edit copy details</button></div>`;
  }
  function tabAllapot(A, i){
    const r = i.result || {}, a = r.allapot || {};
    return `<div class="card"><h3 class="sec-t">Condition assessment <span class="st st-ai">AI suggestion</span></h3>
      <div class="cond-big"><b>${A.esc(A.condL(i.cond))}</b><span>${A.esc(A.gradeL(i.grade))} · ${A.esc(a.pontszam ?? "–")}/10</span></div>
      <div class="meter"><i style="width:${Math.max(5, Math.min(100, (+a.pontszam || 0) * 10))}%"></i></div>
      <dl class="facts">${a.centrirozas ? `<dt>Centring</dt><dd>${A.esc(a.centrirozas)}</dd>` : ""}${a.fogazat_allapot ? `<dt>Perforation condition</dt><dd>${A.esc(a.fogazat_allapot)}</dd>` : ""}${a.szin_allapot ? `<dt>Colour</dt><dd>${A.esc(a.szin_allapot)}</dd>` : ""}${a.pecset ? `<dt>Cancellation</dt><dd>${A.esc(a.pecset)}</dd>` : ""}</dl>
      ${(a.hibak || []).filter(Boolean).length ? `<div style="margin-top:10px;font-size:0.875rem"><b>Faults found</b>${A.list(a.hibak)}</div>` : ""}
      ${a.megjegyzes ? `<p class="muted" style="font-size:0.84rem;margin:10px 0 0">${A.esc(a.megjegyzes)}</p>` : ""}</div>
      <div class="card"><h3 class="sec-t">Details that cannot be verified from a photo</h3>
      <p class="muted" style="font-size:0.84rem;margin:2px 0 8px">The exact perforation gauge, the watermark and the gum can only be determined with the stamp in hand (perforation gauge, watermark detector, back).</p>
      <dl class="facts">${VER.map(([k, l]) => { const v = verified(i, k), ai = k === "gumizas" ? "" : r[k]; return `<dt>${l}</dt><dd>${v ? `${A.esc(k === "gumizas" ? (GUM_L[v] || v) : v)}<span class="st st-megerositett">verified</span>` : ai ? `<span class="unk">${A.esc(ai)}</span><span class="st st-ai">AI suggestion, not verified</span>` : `<span class="unk">not verified</span>`}</dd>`; }).join("")}</dl>
      <button class="btn ghost small" data-act="d-verify" style="margin-top:10px">${A.ic("shield", 16)} Record your own check</button></div>`;
  }
  function tabErtek(A, i){
    const r = i.result || {}, aiMid = A.mid(A.estimate(r, i.cond, i.grade)), f = aiMid ? A.mid(i) / aiMid : 1;
    const evs = i.ertekelesek?.length ? i.ertekelesek : (i.priceHistory || []).map(h => ({...h, modszer:"ai-1.0"})), last = evs[evs.length - 1] || {};
    const b = i.peldany?.beszerzes, rate = A.rate();
    const gain = b?.ar ? A.mid(i) * rate - b.ar : null;
    const rows = A.COND.map(c => { const x = r.arak?.[c.k] || {}; return `<tr class="${c.k === i.cond ? "hl" : ""}"><td>${A.esc(c.l)}</td><td>${(+x.max || 0) > 0 ? A.rng((+x.min || 0) * f, (+x.max || 0) * f, r) : '<span class="unk">no estimate</span>'}</td></tr>`; }).join("");
    return `<div class="value"><span class="est-tag">Preliminary AI estimate</span><div class="lbl" style="margin-top:8px">${A.esc(A.condL(i.cond))}, ${A.esc(A.gradeL(i.grade))}</div>
      <div class="big">${(+i.max || 0) > 0 ? A.rng(i.min, i.max, r) : "No estimate"}</div><div class="sub">${(+i.max || 0) > 0 ? A.fmtAlt(i.min, i.max, r) : ""}</div>
      <div class="why">Method: ${A.esc(A.METHOD_L[last.modszer] || "AI estimate")} · ${A.esc(last.t ? A.today(last.t) : "")} · source: no live market data${r.ar_alap ? `<br>Basis: ${A.esc(r.ar_alap)}` : ""}</div></div>
      <div class="card"><h3 class="sec-t">Price band by condition</h3><div class="muted" style="font-size:0.8rem">Preliminary AI estimate${f !== 1 ? ", adjusted by the latest price update" : ""}</div><table class="pr">${rows}</table></div>
      <div class="card"><h3 class="sec-t">Purchase</h3>${b?.ar ? `<dl class="facts"><dt>Purchase price</dt><dd>${A.hufFmt(b.ar)}</dd>${b.datum ? `<dt>Date</dt><dd>${A.esc(b.datum)}</dd>` : ""}${b.forras ? `<dt>Source</dt><dd>${A.esc(b.forras)}</dd>` : ""}<dt>Difference from estimate</dt><dd style="color:${gain >= 0 ? "var(--c-ok)" : "var(--c-danger)"};font-weight:600">${gain >= 0 ? "+" : "−"}${A.hufFmt(Math.abs(gain))} <span class="st st-ai">based on AI estimate</span></dd></dl>` : `<p class="muted" style="font-size:0.84rem;margin:4px 0 0">No purchase price entered.</p>`}<button class="btn ghost small" data-act="d-editinst" style="margin-top:10px">${A.ic("edit", 16)} Enter purchase</button></div>
      <div class="card"><h3 class="sec-t">Valuation log</h3>${evs.slice().reverse().map(h => `<div class="ph"><span class="muted">${new Date(h.t).toLocaleDateString(window.BS.LOC)} · ${A.esc(A.METHOD_L[h.modszer] || "AI estimate")}${h.indok ? `<br><small>${A.esc(h.indok)}</small>` : ""}</span><b>${A.rng(h.min, h.max, r)}</b></div>`).join("")}</div>
      <div class="card"><h3 class="sec-t">Portfolio</h3><div class="seg">${A.pfList().map(p => `<button data-act="move" data-id="${A.esc(i.id)}" data-pf="${A.esc(p.id)}" class="${p.id === i.pf ? "on" : ""}">${A.esc(p.name)}</button>`).join("")}</div></div>`;
  }
  function tabTortenet(A, i){
    const r = i.result || {}, s = A.S.series[i.seriesKey];
    return `<div class="card"><h3 class="sec-t">Historical background <span class="st st-ai">Written by AI, unverified</span></h3>
      <p style="font-size:0.94rem;line-height:1.55;margin:6px 0 0">${A.esc(r.leiras || "No description.")}</p>
      <dl class="facts" style="margin-top:12px">${r.sorozat ? `<dt>Series</dt><dd>${A.esc(r.sorozat)}</dd>` : ""}${r.tema ? `<dt>Topic</dt><dd>${A.esc(r.tema)}</dd>` : ""}<dt>Printing</dt><dd>${A.valOr(r.nyomtatas)}</dd></dl>
      ${(r.valtozatok || []).filter(Boolean).length ? `<h3 class="sec-t" style="margin-top:12px">Varieties that affect the price</h3>${A.list(r.valtozatok)}` : ""}
      ${(r.ellenorzes || []).filter(Boolean).length ? `<h3 class="sec-t" style="margin-top:12px">How to check</h3>${A.list(r.ellenorzes)}` : ""}
      ${r.hamisitas_kockazat ? `<h3 class="sec-t" style="margin-top:12px">Forgery risk</h3><p style="font-size:0.875rem;margin:4px 0 0">${A.esc(r.hamisitas_kockazat)}</p>` : ""}</div>
      ${s && (s.tagok || []).length && s.allapot !== "elutasitva" ? A.seriesCardHTML(i.seriesKey, s, A.ownedMap(i.seriesKey, A.S.items, s.tagok.length)) : ""}
      <div class="card"><h3 class="sec-t">Collection log</h3><div class="ph"><span class="muted">Added</span><b>${A.today(i.createdAt)}</b></div><div class="ph"><span class="muted">Last valuation</span><b>${A.today(i.lastPriced || i.createdAt)}</b></div></div>`;
  }
  function render(){
    const A = B.app, i = A?.S.items.find(x => x.id === D.id), host = el(); if (!host) return;
    if (!i) { closeDetail(true); return; }
    const r = i.result || {}, hasBack = !!i.backPhoto, img = D.side === "back" && hasBack ? i.backPhoto : (i.photo || i.thumb);
    const conf = Math.max(0, Math.min(100, +r.bizonyossag || +i.azonositas?.bizonyossag || 0)), [cc, cl] = A.confLevel(conf);
    host.innerHTML = `<div class="ov-bar"><button class="iconbtn" data-act="d-back" aria-label="Back">${A.ic("back", 22)}</button><span class="ov-t">Stamp details<small>${A.esc(i.peldany?.kod || "")}</small></span><button class="iconbtn" data-act="d-more" aria-label="More">${A.ic("more", 20)}</button></div>
      <div class="ov-body"><div class="wrap">
        <div class="photo-hero">
          <button class="ph-img" data-act="d-zoom" aria-label="Enlarge photo"><div class="stamp xl">${A.thumbHTML(img)}</div><span class="ph-zoom">${A.ic("zoom", 16)} Zoom</span></button>
          ${hasBack ? `<div class="seg ph-side"><button data-act="d-side" data-s="front" class="${D.side !== "back" ? "on" : ""}">Front</button><button data-act="d-side" data-s="back" class="${D.side === "back" ? "on" : ""}">Back</button></div>` : `<div class="muted ph-noback">No back photo</div>`}
        </div>
        ${r.orszag || r.kiadas_eve ? `<div class="d-eyebrow">${A.esc([r.orszag, r.kiadas_eve].filter(Boolean).join(" – "))}</div>` : ""}<h2 class="d-title">${A.esc(r.nev || "Stamp")}</h2>
        <div class="muted d-sub">${A.esc([r.sorozat, r.nevertek].filter(Boolean).join(" · ")) || (r.orszag || r.kiadas_eve ? "" : "other details unknown")}</div>
        <div class="chips"><span class="chip ${cc}">Identification: ${conf}% · ${cl}</span>${i.azonositas?.megerositve ? `<span class="chip g">✓ confirmed</span>` : `<span class="chip">not confirmed</span>`}${A.catText(r.katalogus) ? A.catText(r.katalogus).split(" · ").map(c => `<span class="chip cat">${A.esc(c)}${r.mezo_forras?.katalogus === "megerositett" ? "" : `<i class="cat-ai"> · AI suggestion</i>`}</span>`).join("") : ""}${(+i.max || 0) > 0 ? `<span class="chip gold">${A.fmt(A.mid(i), r)} · AI estimate</span>` : ""}</div>
        <div class="dsheet"><div class="dtabs" role="tablist">${[["adatok","Details"],["allapot","Condition"],["ertek","Value"],["tortenet","History"]].map(([k, l]) => `<button role="tab" aria-selected="${D.tab === k}" class="${D.tab === k ? "on" : ""}" data-act="d-tab" data-t="${k}">${l}</button>`).join("")}</div>
        <div class="dpanel">${D.tab === "adatok" ? tabAdatok(A, i) : D.tab === "allapot" ? tabAllapot(A, i) : D.tab === "ertek" ? tabErtek(A, i) : tabTortenet(A, i)}</div></div>
        <button class="btn danger" data-act="del" data-id="${A.esc(i.id)}" style="margin-top:16px">${A.ic("trash", 18)} Delete copy</button>
        <div class="disc">All unconfirmed details are AI suggestions; prices are preliminary AI estimates without live market data.</div>
      </div></div>`;
  }
  function openDetail(id){ D.id = id; D.tab = "adatok"; D.side = "front"; const h = el(); h.hidden = false; document.body.classList.add("ov-open"); render(); h.querySelector(".ov-body").scrollTop = 0; requestAnimationFrame(() => h.classList.add("on")); try { h.querySelector("[data-act=d-back]").focus({preventScroll:true}); } catch(e){} }
  function closeDetail(silent){ const h = el(); if (!h || h.hidden) return; h.classList.remove("on"); h.hidden = true; document.body.classList.remove("ov-open"); D.id = null; if (!silent) B.app?.refreshViews(); }
  function zoom(){
    const A = B.app, i = A.S.items.find(x => x.id === D.id); if (!i) return;
    const src = D.side === "back" && i.backPhoto ? i.backPhoto : (i.photo || i.thumb); if (!src) return;
    const z = document.getElementById("zoomer"); z.hidden = false;
    z.innerHTML = `<button class="iconbtn zclose" data-act="z-close" aria-label="Close">${A.ic("close", 22)}</button><div class="zstage"><img src="${A.esc(src)}" alt="Enlarged stamp photo" id="zimg" draggable="false"></div><div class="zhint">Pinch or double-tap to zoom</div>`;
    const img = document.getElementById("zimg"); let sc = 1, tx = 0, ty = 0; const pts = new Map(); let base = null;
    const apply = () => { img.style.transform = `translate(${tx}px,${ty}px) scale(${sc})`; };
    img.addEventListener("dblclick", () => { sc = sc > 1 ? 1 : 2.5; tx = ty = 0; apply(); });
    img.addEventListener("wheel", e => { e.preventDefault(); sc = Math.max(1, Math.min(6, sc * (e.deltaY < 0 ? 1.15 : .87))); if (sc === 1) tx = ty = 0; apply(); }, {passive:false});
    img.addEventListener("pointerdown", e => { img.setPointerCapture(e.pointerId); pts.set(e.pointerId, [e.clientX, e.clientY]); base = {sc, tx, ty, pts:new Map(pts)}; });
    img.addEventListener("pointermove", e => {
      if (!pts.has(e.pointerId)) return; pts.set(e.pointerId, [e.clientX, e.clientY]);
      const P = [...pts.values()], Q = [...base.pts.values()];
      if (P.length >= 2 && Q.length >= 2) { const d1 = Math.hypot(P[0][0] - P[1][0], P[0][1] - P[1][1]), d0 = Math.hypot(Q[0][0] - Q[1][0], Q[0][1] - Q[1][1]) || 1; sc = Math.max(1, Math.min(6, base.sc * d1 / d0)); }
      else if (P.length === 1 && Q.length >= 1 && sc > 1) { tx = base.tx + P[0][0] - Q[0][0]; ty = base.ty + P[0][1] - Q[0][1]; }
      apply();
    });
    const up = e => { pts.delete(e.pointerId); base = {sc, tx, ty, pts:new Map(pts)}; };
    img.addEventListener("pointerup", up); img.addEventListener("pointercancel", up);
  }
  function instForm(A, i){
    const p = i.peldany || {}, b = p.beszerzes || {};
    A.openModal(`<h2 style="margin:8px 0 4px">Copy details</h2><form class="form" id="instForm">
      <label for="in-t">Type</label><select class="field" id="in-t" name="tipus">${Object.entries(TIPUS).map(([k, l]) => `<option value="${k}" ${(p.tipus || "gyujtemeny") === k ? "selected" : ""}>${l}</option>`).join("")}</select>
      <label for="in-a">Virtual album</label><select class="field" id="in-a" name="album"><option value="">None</option>${A.S.albums.map(a => `<option value="${A.esc(a.id)}" ${p.album === a.id ? "selected" : ""}>${A.esc(a.name)}</option>`).join("")}</select>
      <label for="in-h">Physical location</label><input class="field" id="in-h" name="hely" value="${A.esc(p.hely || "")}" placeholder="e.g. Blue stockbook, page 3, row 2">
      <label for="in-m">Note</label><input class="field" id="in-m" name="megjegyzes" value="${A.esc(p.megjegyzes || "")}">
      <label for="in-ar">Purchase price (Ft)</label><input class="field" id="in-ar" name="ar" inputmode="numeric" value="${b.ar || ""}">
      <label for="in-d">Purchase date</label><input class="field" id="in-d" name="datum" type="date" value="${A.esc(b.datum || "")}">
      <label for="in-f">Purchase source</label><input class="field" id="in-f" name="forras" value="${A.esc(b.forras || "")}" placeholder="e.g. stamp fair, auction, estate"></form>
      <div class="row" style="margin-top:14px"><button class="btn ghost" data-act="close">Cancel</button><button class="btn primary" data-act="d-saveinst">Save</button></div>`);
  }
  function idForm(A, i){
    const r = i.result || {};
    A.openModal(`<h2 style="margin:8px 0 4px">Correct identification</h2><p class="muted" style="font-size:0.84rem;margin:0">Saved details show as confirmed. Leave blank what you don’t know.</p><form class="form" id="didForm">
      ${A.EDIT_FIELDS.map(([k, l]) => `<label for="di-${k}">${l}</label><input class="field" id="di-${k}" name="${k}" value="${A.esc(r[k] || "")}">`).join("")}
      ${A.CAT_FIELDS.map(([k, l]) => `<label for="dc-${k}">${l}</label><input class="field" id="dc-${k}" name="cat_${k}" value="${A.esc(r.katalogus?.[k] || "")}">`).join("")}</form>
      <div class="row" style="margin-top:14px"><button class="btn ghost" data-act="close">Cancel</button><button class="btn primary" data-act="d-saveid">Save and confirm</button></div>`);
  }
  function verifyForm(A, i){
    const v = i.ellenorzott || {};
    A.openModal(`<h2 style="margin:8px 0 4px">Your own check</h2><p class="muted" style="font-size:0.84rem;margin:0">Only record what you checked yourself on the stamp in hand (perforation gauge, watermark detector, back).</p><form class="form" id="verForm">
      <label for="v-f">Perforation (e.g. 12 or 11½ × 12)</label><input class="field" id="v-f" name="fogazat" value="${A.esc(v.fogazat || "")}">
      <label for="v-v">Watermark</label><input class="field" id="v-v" name="vizjel" value="${A.esc(v.vizjel || "")}">
      <label for="v-g">Gum</label><select class="field" id="v-g" name="gumizas"><option value="">not verified</option>${GUM.map(x => `<option value="${A.esc(x)}" ${v.gumizas === x ? "selected" : ""}>${GUM_L[x]}</option>`).join("")}</select></form>
      <div class="row" style="margin-top:14px"><button class="btn ghost" data-act="close">Cancel</button><button class="btn primary" data-act="d-saveverify">Save</button></div>`);
  }
  document.addEventListener("click", async e => {
    const a = e.target.closest("[data-act]"); if (!a) return;
    const A = B.app, act = a.dataset.act; if (!A) return;
    const i = A.S.items.find(x => x.id === D.id);
    if (act === "z-close") { const z = document.getElementById("zoomer"); z.hidden = true; z.innerHTML = ""; return; }
    if (!act.startsWith("d-") || !i) return;
    if (act === "d-back") return closeDetail();
    if (act === "d-tab") { D.tab = a.dataset.t; render(); return; }
    if (act === "d-side") { D.side = a.dataset.s; render(); return; }
    if (act === "d-zoom") return zoom();
    if (act === "d-more") { A.openModal(`<h2 style="margin:8px 0 10px">${A.esc(i.result?.nev || "Stamp")}</h2><button class="btn ghost" data-act="d-editinst">${A.ic("edit", 18)} Copy details</button><button class="btn ghost" data-act="d-editid" style="margin-top:10px">${A.ic("edit", 18)} Correct identification</button><button class="btn danger" data-act="del" data-id="${A.esc(i.id)}" style="margin-top:10px">${A.ic("trash", 18)} Delete</button><button class="btn ghost" data-act="close" style="margin-top:10px">Close</button>`); return; }
    if (act === "d-editinst") return instForm(A, i);
    if (act === "d-editid") return idForm(A, i);
    if (act === "d-verify") return verifyForm(A, i);
    const save = async (upd, msg) => { try { await A.store.put(i.id, upd); A.closeModal(); A.toast(msg); A.haptic(10); render(); } catch(err){ A.toast("Could not save."); } };
    if (act === "d-saveinst") {
      const fd = new FormData(document.getElementById("instForm")), ar = parseInt(String(fd.get("ar") || "").replace(/\D/g, ""), 10);
      const besz = ar || fd.get("datum") || fd.get("forras") ? {ar: ar || null, datum: String(fd.get("datum") || ""), forras: String(fd.get("forras") || "")} : null;
      await save({...i, peldany:{...(i.peldany || {}), tipus:fd.get("tipus"), album:fd.get("album") || "", hely:String(fd.get("hely") || ""), megjegyzes:String(fd.get("megjegyzes") || ""), beszerzes:besz}}, "Copy details saved");
    }
    if (act === "d-saveid") {
      const fd = new FormData(document.getElementById("didForm")), r = {...(i.result || {})}, mf = {...(r.mezo_forras || {})}; r.katalogus = {...(r.katalogus || {})};
      for (const [k] of A.EDIT_FIELDS) { r[k] = String(fd.get(k) || "").trim(); mf[k] = r[k] ? "megerositett" : A.UNK; }
      for (const [k] of A.CAT_FIELDS) r.katalogus[k] = String(fd.get("cat_" + k) || "").trim();
      mf.katalogus = A.catText(r.katalogus) ? "megerositett" : A.UNK; r.mezo_forras = mf;
      await save({...i, result:r, azonositas:{...(i.azonositas || {}), megerositve:true, mezoForras:mf}}, "Identification saved and confirmed");
    }
    if (act === "d-saveverify") {
      const fd = new FormData(document.getElementById("verForm")), v = {}; for (const k of ["fogazat","vizjel","gumizas"]) { const x = String(fd.get(k) || "").trim(); if (x) v[k] = x; }
      await save({...i, ellenorzott: Object.keys(v).length ? v : null}, "Check recorded");
    }
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") { const z = document.getElementById("zoomer"); if (z && !z.hidden) { z.hidden = true; z.innerHTML = ""; } else if (!document.querySelector("#modal.on")) closeDetail(); } });
  B.openDetail = openDetail; B.closeDetail = closeDetail; B.refreshDetail = () => { if (D.id && !el().hidden) render(); };
})();
