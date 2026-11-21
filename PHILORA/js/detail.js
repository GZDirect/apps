/* PHILORA – Bélyegadatlap (teljes képernyő). A fotó a fő elem; vízjel, gumizás, fogazat csak ellenőrzött jelöléssel jelenik meg biztosként. */
(() => {
  const B = window.BS;
  const D = {id:null, tab:"adatok", side:"front"};
  const TIPUS = {gyujtemeny:"Gyűjteményi példány", duplikatum:"Duplikátum", csere:"Cserepéldány"};
  /* i18n-skip-start: tárolt értékek */ const GUM = ["postatiszta, eredeti gumizás", "falcnyom", "falcmaradvány", "gumi nélkül", "pecsételt (nem értelmezhető)"]; /* i18n-skip-end */
  const GUM_L = {"postatiszta, eredeti gumizás": "postatiszta, eredeti gumizás", "falcnyom": "falcnyom", "falcmaradvány": "falcmaradvány", "gumi nélkül": "gumi nélkül", "pecsételt (nem értelmezhető)": "pecsételt (nem értelmezhető)"};
  const VER = [["fogazat","Fogazat"],["vizjel","Vízjel"],["gumizas","Gumizás"]];
  const el = () => document.getElementById("v-detail");

  function verified(i, k){ return i.ellenorzott?.[k]; }
  function tabAdatok(A, i){
    const r = i.result || {}, p = i.peldany || {}, alb = A.S.albums.find(a => a.id === p.album);
    const jl = (r.jeloltek || []).filter(j => A.catText(j.katalogus) || j.nev);
    return `${A.idCardHTML(r, {interactive:false, confirmed: !!i.azonositas?.megerositve})}
      <button class="btn ghost small" data-act="d-editid" style="margin:-4px 0 8px">${A.ic("edit", 16)} Azonosítás javítása</button>
      ${jl.length > 1 ? `<div class="card"><h3 class="sec-t">Lehetséges katalógustalálatok</h3>${jl.map((j, n) => `<div class="ph"><span>${n + 1}. ${A.esc(j.nev || r.nev || "")}${j.kiadas_eve ? " · " + A.esc(j.kiadas_eve) : ""}<br><small class="muted">${A.esc(A.catText(j.katalogus) || "katalógusszám ismeretlen")}</small></span><span class="chip ${A.confLevel(j.bizonyossag)[0]}">${j.bizonyossag}%</span></div>`).join("")}<div class="disc" style="padding:6px 0 0">AI-javaslatok – katalógusban ellenőrizd.</div></div>` : ""}
      <div class="card"><h3 class="sec-t">Fizikai példány</h3><dl class="facts">
        <dt>Azonosító</dt><dd><b>${A.esc(p.kod || "–")}</b></dd>
        <dt>Típus</dt><dd>${A.esc(TIPUS[p.tipus || "gyujtemeny"])}</dd>
        <dt>Virtuális album</dt><dd>${alb ? A.esc(alb.name) : '<span class="unk">nincs</span>'}</dd>
        <dt>Albumhely</dt><dd>${A.valOr(p.hely)}</dd>
        <dt>Megjegyzés</dt><dd>${A.valOr(p.megjegyzes)}</dd>
        <dt>Portfólió</dt><dd>${A.esc(A.pfName(i.pf))}</dd></dl>
        <button class="btn ghost small" data-act="d-editinst" style="margin-top:10px">${A.ic("edit", 16)} Példányadatok szerkesztése</button></div>`;
  }
  function tabAllapot(A, i){
    const r = i.result || {}, a = r.allapot || {};
    return `<div class="card"><h3 class="sec-t">Állapotértékelés <span class="st st-ai">AI-javaslat</span></h3>
      <div class="cond-big"><b>${A.esc(A.condL(i.cond))}</b><span>${A.esc(A.gradeL(i.grade))} · ${A.esc(a.pontszam ?? "–")}/10</span></div>
      <div class="meter"><i style="width:${Math.max(5, Math.min(100, (+a.pontszam || 0) * 10))}%"></i></div>
      <dl class="facts">${a.centrirozas ? `<dt>Centrírozás</dt><dd>${A.esc(a.centrirozas)}</dd>` : ""}${a.fogazat_allapot ? `<dt>Fogak</dt><dd>${A.esc(a.fogazat_allapot)}</dd>` : ""}${a.szin_allapot ? `<dt>Szín</dt><dd>${A.esc(a.szin_allapot)}</dd>` : ""}${a.pecset ? `<dt>Bélyegzés</dt><dd>${A.esc(a.pecset)}</dd>` : ""}</dl>
      ${(a.hibak || []).filter(Boolean).length ? `<div style="margin-top:10px;font-size:0.875rem"><b>Észlelt hibák</b>${A.list(a.hibak)}</div>` : ""}
      ${a.megjegyzes ? `<p class="muted" style="font-size:0.84rem;margin:10px 0 0">${A.esc(a.megjegyzes)}</p>` : ""}</div>
      <div class="card"><h3 class="sec-t">Fotóról nem ellenőrizhető adatok</h3>
      <p class="muted" style="font-size:0.84rem;margin:2px 0 8px">A fogazat pontos mérete, a vízjel és a gumizás csak a bélyeg kézbevételével (fogazatmérő, vízjelkereső, hátoldal) dönthető el.</p>
      <dl class="facts">${VER.map(([k, l]) => { const v = verified(i, k), ai = k === "gumizas" ? "" : r[k]; return `<dt>${l}</dt><dd>${v ? `${A.esc(k === "gumizas" ? (GUM_L[v] || v) : v)}<span class="st st-megerositett">ellenőrizve</span>` : ai ? `<span class="unk">${A.esc(ai)}</span><span class="st st-ai">AI-javaslat, nem ellenőrzött</span>` : `<span class="unk">nem ellenőrzött</span>`}</dd>`; }).join("")}</dl>
      <button class="btn ghost small" data-act="d-verify" style="margin-top:10px">${A.ic("shield", 16)} Saját ellenőrzés rögzítése</button></div>`;
  }
  function tabErtek(A, i){
    const r = i.result || {}, aiMid = A.mid(A.estimate(r, i.cond, i.grade)), f = aiMid ? A.mid(i) / aiMid : 1;
    const evs = i.ertekelesek?.length ? i.ertekelesek : (i.priceHistory || []).map(h => ({...h, modszer:"ai-1.0"})), last = evs[evs.length - 1] || {};
    const b = i.peldany?.beszerzes, rate = A.rate();
    const gain = b?.ar ? A.mid(i) * rate - b.ar : null;
    const rows = A.COND.map(c => { const x = r.arak?.[c.k] || {}; return `<tr class="${c.k === i.cond ? "hl" : ""}"><td>${A.esc(c.l)}</td><td>${(+x.max || 0) > 0 ? A.rng((+x.min || 0) * f, (+x.max || 0) * f, r) : '<span class="unk">nincs becslés</span>'}</td></tr>`; }).join("");
    return `<div class="value"><span class="est-tag">Előzetes AI-becslés</span><div class="lbl" style="margin-top:8px">${A.esc(A.condL(i.cond))}, ${A.esc(A.gradeL(i.grade))}</div>
      <div class="big">${(+i.max || 0) > 0 ? A.rng(i.min, i.max, r) : "Nincs becslés"}</div><div class="sub">${(+i.max || 0) > 0 ? A.fmtAlt(i.min, i.max, r) : ""}</div>
      <div class="why">Módszer: ${A.esc(A.METHOD_L[last.modszer] || "AI-becslés")} · ${A.esc(last.t ? A.today(last.t) : "")} · forrás: nincs élő piaci adat${r.ar_alap ? `<br>Alap: ${A.esc(r.ar_alap)}` : ""}</div></div>
      <div class="card"><h3 class="sec-t">Állapot szerinti ársáv</h3><div class="muted" style="font-size:0.8rem">Előzetes AI-becslés${f !== 1 ? ", a legutóbbi árfrissítéssel korrigálva" : ""}</div><table class="pr">${rows}</table></div>
      <div class="card"><h3 class="sec-t">Beszerzés</h3>${b?.ar ? `<dl class="facts"><dt>Beszerzési ár</dt><dd>${A.hufFmt(b.ar)}</dd>${b.datum ? `<dt>Dátum</dt><dd>${A.esc(b.datum)}</dd>` : ""}${b.forras ? `<dt>Forrás</dt><dd>${A.esc(b.forras)}</dd>` : ""}<dt>Eltérés a becsléstől</dt><dd style="color:${gain >= 0 ? "var(--c-ok)" : "var(--c-danger)"};font-weight:600">${gain >= 0 ? "+" : "−"}${A.hufFmt(Math.abs(gain))} <span class="st st-ai">AI-becslés alapján</span></dd></dl>` : `<p class="muted" style="font-size:0.84rem;margin:4px 0 0">Nincs megadva beszerzési ár.</p>`}<button class="btn ghost small" data-act="d-editinst" style="margin-top:10px">${A.ic("edit", 16)} Beszerzés megadása</button></div>
      <div class="card"><h3 class="sec-t">Értékelési napló</h3>${evs.slice().reverse().map(h => `<div class="ph"><span class="muted">${new Date(h.t).toLocaleDateString(window.BS.LOC)} · ${A.esc(A.METHOD_L[h.modszer] || "AI-becslés")}${h.indok ? `<br><small>${A.esc(h.indok)}</small>` : ""}</span><b>${A.rng(h.min, h.max, r)}</b></div>`).join("")}</div>
      <div class="card"><h3 class="sec-t">Portfólió</h3><div class="seg">${A.pfList().map(p => `<button data-act="move" data-id="${A.esc(i.id)}" data-pf="${A.esc(p.id)}" class="${p.id === i.pf ? "on" : ""}">${A.esc(p.name)}</button>`).join("")}</div></div>`;
  }
  function tabTortenet(A, i){
    const r = i.result || {}, s = A.S.series[i.seriesKey];
    return `<div class="card"><h3 class="sec-t">Történelmi háttér <span class="st st-ai">AI által írt, ellenőrizetlen</span></h3>
      <p style="font-size:0.94rem;line-height:1.55;margin:6px 0 0">${A.esc(r.leiras || "Nincs leírás.")}</p>
      <dl class="facts" style="margin-top:12px">${r.sorozat ? `<dt>Sorozat</dt><dd>${A.esc(r.sorozat)}</dd>` : ""}${r.tema ? `<dt>Téma</dt><dd>${A.esc(r.tema)}</dd>` : ""}<dt>Nyomtatás</dt><dd>${A.valOr(r.nyomtatas)}</dd></dl>
      ${(r.valtozatok || []).filter(Boolean).length ? `<h3 class="sec-t" style="margin-top:12px">Árat módosító változatok</h3>${A.list(r.valtozatok)}` : ""}
      ${(r.ellenorzes || []).filter(Boolean).length ? `<h3 class="sec-t" style="margin-top:12px">Így ellenőrizd</h3>${A.list(r.ellenorzes)}` : ""}
      ${r.hamisitas_kockazat ? `<h3 class="sec-t" style="margin-top:12px">Hamisítási kockázat</h3><p style="font-size:0.875rem;margin:4px 0 0">${A.esc(r.hamisitas_kockazat)}</p>` : ""}</div>
      ${s && (s.tagok || []).length && s.allapot !== "elutasitva" ? A.seriesCardHTML(i.seriesKey, s, A.ownedMap(i.seriesKey, A.S.items, s.tagok.length)) : ""}
      <div class="card"><h3 class="sec-t">Gyűjteményi napló</h3><div class="ph"><span class="muted">Felvéve</span><b>${A.today(i.createdAt)}</b></div><div class="ph"><span class="muted">Utolsó értékelés</span><b>${A.today(i.lastPriced || i.createdAt)}</b></div></div>`;
  }
  function render(){
    const A = B.app, i = A?.S.items.find(x => x.id === D.id), host = el(); if (!host) return;
    if (!i) { closeDetail(true); return; }
    const r = i.result || {}, hasBack = !!i.backPhoto, img = D.side === "back" && hasBack ? i.backPhoto : (i.photo || i.thumb);
    const conf = Math.max(0, Math.min(100, +r.bizonyossag || +i.azonositas?.bizonyossag || 0)), [cc, cl] = A.confLevel(conf);
    host.innerHTML = `<div class="ov-bar"><button class="iconbtn" data-act="d-back" aria-label="Vissza">${A.ic("back", 22)}</button><span class="ov-t">Bélyegadatlap<small>${A.esc(i.peldany?.kod || "")}</small></span><button class="iconbtn" data-act="d-more" aria-label="Továbbiak">${A.ic("more", 20)}</button></div>
      <div class="ov-body"><div class="wrap">
        <div class="photo-hero">
          <button class="ph-img" data-act="d-zoom" aria-label="Fotó nagyítása"><div class="stamp xl">${A.thumbHTML(img)}</div><span class="ph-zoom">${A.ic("zoom", 16)} Nagyítás</span></button>
          ${hasBack ? `<div class="seg ph-side"><button data-act="d-side" data-s="front" class="${D.side !== "back" ? "on" : ""}">Előoldal</button><button data-act="d-side" data-s="back" class="${D.side === "back" ? "on" : ""}">Hátoldal</button></div>` : `<div class="muted ph-noback">Hátoldali fotó nincs</div>`}
        </div>
        ${r.orszag || r.kiadas_eve ? `<div class="d-eyebrow">${A.esc([r.orszag, r.kiadas_eve].filter(Boolean).join(" – "))}</div>` : ""}<h2 class="d-title">${A.esc(r.nev || "Bélyeg")}</h2>
        <div class="muted d-sub">${A.esc([r.sorozat, r.nevertek].filter(Boolean).join(" · ")) || (r.orszag || r.kiadas_eve ? "" : "további adatok ismeretlenek")}</div>
        <div class="chips"><span class="chip ${cc}">Azonosítás: ${conf}% · ${cl}</span>${i.azonositas?.megerositve ? `<span class="chip g">✓ megerősítve</span>` : `<span class="chip">nem megerősített</span>`}${A.catText(r.katalogus) ? A.catText(r.katalogus).split(" · ").map(c => `<span class="chip cat">${A.esc(c)}${r.mezo_forras?.katalogus === "megerositett" ? "" : `<i class="cat-ai"> · AI-javaslat</i>`}</span>`).join("") : ""}${(+i.max || 0) > 0 ? `<span class="chip gold">${A.fmt(A.mid(i), r)} · AI-becslés</span>` : ""}</div>
        <div class="dsheet"><div class="dtabs" role="tablist">${[["adatok","Adatok"],["allapot","Állapot"],["ertek","Érték"],["tortenet","Történet"]].map(([k, l]) => `<button role="tab" aria-selected="${D.tab === k}" class="${D.tab === k ? "on" : ""}" data-act="d-tab" data-t="${k}">${l}</button>`).join("")}</div>
        <div class="dpanel">${D.tab === "adatok" ? tabAdatok(A, i) : D.tab === "allapot" ? tabAllapot(A, i) : D.tab === "ertek" ? tabErtek(A, i) : tabTortenet(A, i)}</div></div>
        <button class="btn danger" data-act="del" data-id="${A.esc(i.id)}" style="margin-top:16px">${A.ic("trash", 18)} Példány törlése</button>
        <div class="disc">Minden nem megerősített adat AI-javaslat; az árak előzetes AI-becslések, élő piaci adat nélkül.</div>
      </div></div>`;
  }
  function openDetail(id){ D.id = id; D.tab = "adatok"; D.side = "front"; const h = el(); h.hidden = false; document.body.classList.add("ov-open"); render(); h.querySelector(".ov-body").scrollTop = 0; requestAnimationFrame(() => h.classList.add("on")); try { h.querySelector("[data-act=d-back]").focus({preventScroll:true}); } catch(e){} }
  function closeDetail(silent){ const h = el(); if (!h || h.hidden) return; h.classList.remove("on"); h.hidden = true; document.body.classList.remove("ov-open"); D.id = null; if (!silent) B.app?.refreshViews(); }
  function zoom(){
    const A = B.app, i = A.S.items.find(x => x.id === D.id); if (!i) return;
    const src = D.side === "back" && i.backPhoto ? i.backPhoto : (i.photo || i.thumb); if (!src) return;
    const z = document.getElementById("zoomer"); z.hidden = false;
    z.innerHTML = `<button class="iconbtn zclose" data-act="z-close" aria-label="Bezárás">${A.ic("close", 22)}</button><div class="zstage"><img src="${A.esc(src)}" alt="Nagyított bélyegfotó" id="zimg" draggable="false"></div><div class="zhint">Csípd össze vagy koppints duplán a nagyításhoz</div>`;
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
    A.openModal(`<h2 style="margin:8px 0 4px">Példányadatok</h2><form class="form" id="instForm">
      <label for="in-t">Típus</label><select class="field" id="in-t" name="tipus">${Object.entries(TIPUS).map(([k, l]) => `<option value="${k}" ${(p.tipus || "gyujtemeny") === k ? "selected" : ""}>${l}</option>`).join("")}</select>
      <label for="in-a">Virtuális album</label><select class="field" id="in-a" name="album"><option value="">Nincs</option>${A.S.albums.map(a => `<option value="${A.esc(a.id)}" ${p.album === a.id ? "selected" : ""}>${A.esc(a.name)}</option>`).join("")}</select>
      <label for="in-h">Fizikai albumhely</label><input class="field" id="in-h" name="hely" value="${A.esc(p.hely || "")}" placeholder="pl. Kék berakó, 3. oldal, 2. sor">
      <label for="in-m">Megjegyzés</label><input class="field" id="in-m" name="megjegyzes" value="${A.esc(p.megjegyzes || "")}">
      <label for="in-ar">Beszerzési ár (Ft)</label><input class="field" id="in-ar" name="ar" inputmode="numeric" value="${b.ar || ""}">
      <label for="in-d">Beszerzés dátuma</label><input class="field" id="in-d" name="datum" type="date" value="${A.esc(b.datum || "")}">
      <label for="in-f">Beszerzés forrása</label><input class="field" id="in-f" name="forras" value="${A.esc(b.forras || "")}" placeholder="pl. börze, aukció, hagyaték"></form>
      <div class="row" style="margin-top:14px"><button class="btn ghost" data-act="close">Mégse</button><button class="btn primary" data-act="d-saveinst">Mentés</button></div>`);
  }
  function idForm(A, i){
    const r = i.result || {};
    A.openModal(`<h2 style="margin:8px 0 4px">Azonosítás javítása</h2><p class="muted" style="font-size:0.84rem;margin:0">A mentett adatok megerősítettként jelennek meg. Amit nem tudsz, hagyd üresen.</p><form class="form" id="didForm">
      ${A.EDIT_FIELDS.map(([k, l]) => `<label for="di-${k}">${l}</label><input class="field" id="di-${k}" name="${k}" value="${A.esc(r[k] || "")}">`).join("")}
      ${A.CAT_FIELDS.map(([k, l]) => `<label for="dc-${k}">${l}</label><input class="field" id="dc-${k}" name="cat_${k}" value="${A.esc(r.katalogus?.[k] || "")}">`).join("")}</form>
      <div class="row" style="margin-top:14px"><button class="btn ghost" data-act="close">Mégse</button><button class="btn primary" data-act="d-saveid">Mentés és megerősítés</button></div>`);
  }
  function verifyForm(A, i){
    const v = i.ellenorzott || {};
    A.openModal(`<h2 style="margin:8px 0 4px">Saját ellenőrzés</h2><p class="muted" style="font-size:0.84rem;margin:0">Csak azt rögzítsd, amit kézbe vett példányon magad ellenőriztél (fogazatmérő, vízjelkereső, hátoldal).</p><form class="form" id="verForm">
      <label for="v-f">Fogazat (pl. 12 vagy 11½ × 12)</label><input class="field" id="v-f" name="fogazat" value="${A.esc(v.fogazat || "")}">
      <label for="v-v">Vízjel</label><input class="field" id="v-v" name="vizjel" value="${A.esc(v.vizjel || "")}">
      <label for="v-g">Gumizás</label><select class="field" id="v-g" name="gumizas"><option value="">nem ellenőrzött</option>${GUM.map(x => `<option value="${A.esc(x)}" ${v.gumizas === x ? "selected" : ""}>${GUM_L[x]}</option>`).join("")}</select></form>
      <div class="row" style="margin-top:14px"><button class="btn ghost" data-act="close">Mégse</button><button class="btn primary" data-act="d-saveverify">Mentés</button></div>`);
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
    if (act === "d-more") { A.openModal(`<h2 style="margin:8px 0 10px">${A.esc(i.result?.nev || "Bélyeg")}</h2><button class="btn ghost" data-act="d-editinst">${A.ic("edit", 18)} Példányadatok</button><button class="btn ghost" data-act="d-editid" style="margin-top:10px">${A.ic("edit", 18)} Azonosítás javítása</button><button class="btn danger" data-act="del" data-id="${A.esc(i.id)}" style="margin-top:10px">${A.ic("trash", 18)} Törlés</button><button class="btn ghost" data-act="close" style="margin-top:10px">Bezárás</button>`); return; }
    if (act === "d-editinst") return instForm(A, i);
    if (act === "d-editid") return idForm(A, i);
    if (act === "d-verify") return verifyForm(A, i);
    const save = async (upd, msg) => { try { await A.store.put(i.id, upd); A.closeModal(); A.toast(msg); A.haptic(10); render(); } catch(err){ A.toast("Nem sikerült menteni."); } };
    if (act === "d-saveinst") {
      const fd = new FormData(document.getElementById("instForm")), ar = parseInt(String(fd.get("ar") || "").replace(/\D/g, ""), 10);
      const besz = ar || fd.get("datum") || fd.get("forras") ? {ar: ar || null, datum: String(fd.get("datum") || ""), forras: String(fd.get("forras") || "")} : null;
      await save({...i, peldany:{...(i.peldany || {}), tipus:fd.get("tipus"), album:fd.get("album") || "", hely:String(fd.get("hely") || ""), megjegyzes:String(fd.get("megjegyzes") || ""), beszerzes:besz}}, "Példányadatok mentve");
    }
    if (act === "d-saveid") {
      const fd = new FormData(document.getElementById("didForm")), r = {...(i.result || {})}, mf = {...(r.mezo_forras || {})}; r.katalogus = {...(r.katalogus || {})};
      for (const [k] of A.EDIT_FIELDS) { r[k] = String(fd.get(k) || "").trim(); mf[k] = r[k] ? "megerositett" : A.UNK; }
      for (const [k] of A.CAT_FIELDS) r.katalogus[k] = String(fd.get("cat_" + k) || "").trim();
      mf.katalogus = A.catText(r.katalogus) ? "megerositett" : A.UNK; r.mezo_forras = mf;
      await save({...i, result:r, azonositas:{...(i.azonositas || {}), megerositve:true, mezoForras:mf}}, "Azonosítás mentve és megerősítve");
    }
    if (act === "d-saveverify") {
      const fd = new FormData(document.getElementById("verForm")), v = {}; for (const k of ["fogazat","vizjel","gumizas"]) { const x = String(fd.get(k) || "").trim(); if (x) v[k] = x; }
      await save({...i, ellenorzott: Object.keys(v).length ? v : null}, "Ellenőrzés rögzítve");
    }
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") { const z = document.getElementById("zoomer"); if (z && !z.hidden) { z.hidden = true; z.innerHTML = ""; } else if (!document.querySelector("#modal.on")) closeDetail(); } });
  B.openDetail = openDetail; B.closeDetail = closeDetail; B.refreshDetail = () => { if (D.id && !el().hidden) render(); };
})();
