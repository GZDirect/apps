/* PHILORA Atlasz – interaktív filatéliai világtérkép (Térkép / Lista / Történelmi) és kibocsátói adatlap.
   Rétegek: háttér (óceán, fokhálózat, díszítés) és külön kattintható földrajzi réteg (valós Natural Earth vektorok).
   Csak valós, mentett adatból számol; demó módban a szimulált adatot mutatja és semmit nem ír. */
(() => {
  const B = window.BS;
  const AT = {tab: "map", pf: null, sel: null, status: "all", period: "all", labels: false, grat: true, view: null, era: null};
  const ERAS = [["e1", "1900 előtt (klasszikus kor)", -Infinity, 1900], ["e2", "1901–1945", 1901, 1945], ["e3", "1946–1990", 1946, 1990], ["e4", "1991–napjainkig", 1991, Infinity]];
  const PERIODS = [["all", "Minden korszak", -Infinity, Infinity], ["p1", "1918 előtt", -Infinity, 1918], ["p2", "1918–1945", 1918, 1945], ["p3", "1945–1991", 1945, 1991], ["p4", "1991 után", 1991, Infinity]];
  const ov = () => document.getElementById("v-atlas");
  const G = () => B.ATLAS_GEO, D = () => B.atlasData;
  const STATUS = {have: ["Gyűjteményben van", "✓"], partial: ["Van, de nem megerősített", "?"], none: ["Nincs még a gyűjteményben", "–"]};
  const statusOf = a => !a ? "none" : a.confirmed > 0 ? "have" : "partial";

  function items(A){ return A.pfItems(AT.pf || "all"); }
  function money(A, lo, hi){ const u = A.groupUnit((lo + hi) / 2, lo, hi); return lo === hi ? A.fmtU(lo, u) : `${A.fmtU(lo, u)} – ${A.fmtU(hi, u)}`; }
  /* Átváltási forrás: a legutóbbi becslés AI által megadott árfolyama – nem élő árfolyam. */
  function rateNote(A){
    const it = A.S.items.filter(i => +i.result?.eur_huf > 0).sort((a, b) => (b.lastPriced || b.createdAt || 0) - (a.lastPriced || a.createdAt || 0))[0];
    return it ? `Átváltás: 1 € ≈ ${Math.round(A.rate())} Ft – a legutóbbi becslés árfolyama (${A.today(it.lastPriced || it.createdAt)}), nem élő árfolyam.` : "";
  }
  function totals(A, agg){
    let lo = 0, hi = 0, priced = 0, modern = 0, hist = 0;
    for (const a of agg.by.values()) { lo += a.lo; hi += a.hi; priced += a.priced; a.issuer?.historical ? hist++ : modern++; }
    return {lo, hi, priced, modern, hist};
  }

  /* ---------- Térkép ---------- */
  function vb(){ const g = G(), v = AT.view || {cx: g.w / 2, cy: g.h / 2, k: 1}; const w = g.w / v.k, h = g.h / v.k; return [v.cx - w / 2, v.cy - h / 2, w, h]; }
  function clampView(v){ const g = G(), k = Math.max(1, Math.min(14, v.k)), w = g.w / k, h = g.h / k; return {k, cx: Math.max(w / 2, Math.min(g.w - w / 2, v.cx)), cy: Math.max(h / 2, Math.min(g.h - h / 2, v.cy))}; }
  function mapSVG(A, agg){
    const g = G(), esc = A.esc, k = (AT.view || {k: 1}).k;
    const paths = g.countries.map(c => {
      const a = c.a2 ? agg.by.get(c.a2) : null, st = statusOf(a), show = AT.status === "all" || (AT.status === "have" ? st === "have" : AT.status === "partial" ? st === "partial" : true);
      const cls = `ct ${show ? st : "none dim"}`;
      if (!a) return `<path class="${cls}" d="${c.d}" data-cid="${esc(c.a2 || "")}"><title>${esc(B.lang === "en" ? c.en : c.hu)}</title></path>`;
      const lbl = `${B.lang === "en" ? c.en : c.hu}: ${a.count} bélyeg – ${STATUS[st][0]}`;
      return `<path class="${cls}" d="${c.d}" data-cid="${esc(c.a2)}" tabindex="0" role="button" aria-label="${esc(lbl)}"><title>${esc(lbl)}</title></path>`;
    }).join("");
    /* kis területű, gyűjteményben szereplő országok: jól eltalálható jelölő */
    const marks = g.countries.filter(c => c.a2 && agg.by.get(c.a2) && c.ar < 60).map(c => `<circle class="mk ${statusOf(agg.by.get(c.a2))}" cx="${c.c[0]}" cy="${c.c[1]}" r="${(7 / Math.sqrt(k)).toFixed(2)}" data-cid="${esc(c.a2)}" aria-hidden="true"/>`).join("");
    const labels = AT.labels ? g.countries.filter(c => c.a2 && agg.by.get(c.a2)).map(c => `<text class="lbl" x="${c.c[0]}" y="${c.c[1]}" font-size="${(11 / k).toFixed(2)}" text-anchor="middle">${esc(B.lang === "en" ? c.en : c.hu)}</text>`).join("") : "";
    return `<svg class="atlas-svg" viewBox="${vb().join(" ")}" role="group" aria-label="Világtérkép a gyűjtemény kibocsátóival">
      <g class="layer-bg" aria-hidden="true"><rect class="ocean" x="-500" y="-500" width="${g.w + 1000}" height="${g.h + 1000}"/>${AT.grat ? `<path class="grat" d="${g.grat}"/>` : ""}</g>
      <g class="layer-geo">${paths}${marks}</g><g class="layer-lbl" aria-hidden="true">${labels}</g></svg>`;
  }
  const compass = `<svg class="compass" viewBox="0 0 60 60" aria-hidden="true"><circle cx="30" cy="30" r="22" fill="none" stroke="currentColor" stroke-width=".8" opacity=".6"/><path d="M30 4 34 30 30 56 26 30Z" fill="currentColor" opacity=".9"/><path d="M4 30 30 26 56 30 30 34Z" fill="currentColor" opacity=".55"/><text x="30" y="3.5" text-anchor="middle" font-size="6" fill="currentColor">N</text></svg>`;

  function legendHTML(){ return `<ul class="atl-legend" aria-label="Jelmagyarázat">${Object.entries(STATUS).map(([k, [l, s]]) => `<li><span class="atl-sw ${k}" aria-hidden="true">${s}</span>${l}</li>`).join("")}</ul>`; }
  function summaryHTML(A, agg){
    const t = totals(A, agg), n = agg.total;
    return `<div class="atl-sum" role="group" aria-label="Összesítés">
      <div><span>${A.ic("globe", 20)}</span><b>${t.modern}</b><small>ország</small></div>
      <div><span>${A.ic("stamp", 20)}</span><b>${n}</b><small>bélyeg</small></div>
      <div><span>${A.ic("chart", 20)}</span><b>${t.priced ? money(A, t.lo, t.hi) : "nincs adat"}</b><small>${t.priced ? `becsült érték · ${t.priced}/${n} árazott` : "becsült érték"}</small></div></div>
      ${t.priced ? `<div class="disc atl-note"><span class="est-tag">Előzetes AI-becslés</span> Csak a mentett, árazott tételekből; ahol nincs ár, nem számolunk becslést. ${A.esc(rateNote(A))}</div>` : ""}`;
  }
  function mapTab(A, agg){
    const t = totals(A, agg);
    return `<div class="atlas-map" id="atlasMap">
        ${mapSVG(A, agg)}${compass}
        <div class="atl-ctrl" role="toolbar" aria-label="Térkép vezérlők">
          <button data-act="at-zoom" data-z="1.6" aria-label="Nagyítás">${A.ic("plus", 20)}</button>
          <button data-act="at-zoom" data-z="0.625" aria-label="Kicsinyítés"><svg class="ic" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button>
          <button data-act="at-reset" aria-label="Alaphelyzet">${A.ic("crop", 20)}</button>
        </div>
      </div>
      <div class="atl-tools" role="toolbar" aria-label="Térkép rétegek és szűrő">
        <button data-act="at-layers" aria-pressed="${AT.labels}">${A.ic("layers", 18)} Országnevek</button>
        <button data-act="at-filter" class="${AT.status !== "all" ? "on" : ""}">${A.ic("filter", 18)} ${AT.status === "all" ? "Minden ország" : AT.status === "have" ? "Csak megerősített" : "Csak nem megerősített"}</button>
        <button data-act="at-info">${A.ic("info", 18)} Források</button>
      </div>
      ${legendHTML()}
      <p class="atl-hint">Húzással mozgatható, két ujjal vagy a gombokkal nagyítható. Koppints egy kiemelt országra. Billentyűzettel a kiemelt országok Tab-bal elérhetők; a Lista fül ugyanezt szövegesen mutatja.</p>
      ${t.hist ? `<button class="atl-link" data-act="at-tab" data-t="hist">${A.ic("clock", 16)} ${t.hist} történelmi kibocsátó – a térképen nem jelenik meg, a Történelmi fülön látod</button>` : ""}
      ${agg.review.length ? `<button class="atl-link" data-act="at-review">${A.ic("alert", 16)} ${agg.review.length} tétel kibocsátója felülvizsgálandó</button>` : ""}`;
  }
  /* ---------- Lista ---------- */
  function rowHTML(A, a){
    const st = statusOf(a);
    return `<button class="atl-row" data-act="at-sel" data-id="${A.esc(a.issuerId)}"><span class="atl-sw ${st}" aria-hidden="true">${STATUS[st][1]}</span><span class="atl-rn"><b>${A.esc(a.issuer.name)}</b><small>${a.count} bélyeg · ${a.seriesCount} sorozat · ${STATUS[st][0]}${a.review ? ` · ${a.review} felülvizsgálandó` : ""}</small></span><span class="atl-rv">${a.priced ? money(A, a.lo, a.hi) : "nincs ár"}</span>${A.ic("chevron", 16)}</button>`;
  }
  function listTab(A, agg){
    const L = [...agg.by.values()].filter(a => !a.issuer.historical).sort((a, b) => b.count - a.count || a.issuer.name.localeCompare(b.issuer.name, B.LOC));
    return `${legendHTML()}<div class="atl-list">${L.length ? L.map(a => rowHTML(A, a)).join("") : `<p class="muted">Nincs még mai kibocsátóhoz rendelhető bélyeg.</p>`}</div>
      ${agg.review.length ? `<button class="atl-link" data-act="at-review">${A.ic("alert", 16)} ${agg.review.length} tétel kibocsátója felülvizsgálandó</button>` : ""}`;
  }
  /* ---------- Történelmi ---------- */
  function histTab(A, agg){
    const [, , pf, pt] = PERIODS.find(p => p[0] === AT.period) || PERIODS[0];
    const inP = h => h.from <= pt && h.to >= pf;
    const have = D().HISTORICAL.filter(h => agg.by.get(h.id) && inP(h)), other = D().HISTORICAL.filter(h => !agg.by.get(h.id) && inP(h));
    return `<div class="pfchips" role="radiogroup" aria-label="Időszak">${PERIODS.map(([k, l]) => `<button role="radio" aria-checked="${AT.period === k}" class="${AT.period === k ? "on" : ""}" data-act="at-period" data-p="${k}">${l}</button>`).join("")}</div>
      <div class="infobox">${A.ic("info", 16)} A történelmi kibocsátók határait nem rajzoljuk ki: nincs ellenőrzött, licencelt időmetszet-adatforrásunk. A mai érintett országok csak tájékoztatásul, szövegként szerepelnek.</div>
      <div class="atl-list">${have.length ? have.map(h => rowHTML(A, agg.by.get(h.id))).join("") : `<p class="muted">Ebben az időszakban nincs történelmi kibocsátótól származó bélyeg a gyűjteményben.</p>`}</div>
      ${other.length ? `<details class="acc"><summary><span class="acc-ic">${A.ic("book", 18)}</span><span class="acc-t">További ismert történelmi kibocsátók (${other.length})</span><span class="acc-ch" aria-hidden="true">${A.ic("chevron", 16)}</span></summary><div class="acc-b">${other.map(h => `<div class="ph"><span>${A.esc(B.lang === "en" ? h.en : h.hu)}</span><b class="muted">${h.from}–${h.to} · 0 bélyeg</b></div>`).join("")}</div></details>` : ""}`;
  }
  /* ---------- Kibocsátói adatlap ---------- */
  function sheetHTML(A, agg){
    const id = AT.sel, a = agg.by.get(id), iss = a?.issuer || D().issuer(id), esc = A.esc; if (!iss) return "";
    const L = a ? a.items : [], h = iss.historical ? D().historical(id) : null, c = !iss.historical ? D().country(id) : null;
    const eras = ERAS.map(([k, l, f, t]) => { const E = L.filter(i => { const y = parseInt(i.result?.kiadas_eve, 10); return Number.isFinite(y) && y >= f && y <= t; }); return {k, l, n: E.length, s: new Set(E.map(i => i.seriesKey).filter(Boolean)).size}; });
    const noYear = L.filter(i => !Number.isFinite(parseInt(i.result?.kiadas_eve, 10))).length;
    const themes = Object.entries(L.reduce((m, i) => { const t = (i.result?.tema || "").trim(); if (t) m[t] = (m[t] || 0) + 1; return m; }, {})).sort((x, y) => y[1] - x[1]).slice(0, 4);
    const unconf = L.filter(i => !i.azonositas?.megerositve || D().issuerOf(i).review);
    const shown = AT.era ? L.filter(i => { const e = ERAS.find(x => x[0] === AT.era), y = parseInt(i.result?.kiadas_eve, 10); return e && Number.isFinite(y) && y >= e[2] && y <= e[3]; }) : L;
    const present = (iss.present || []).map(p => D().country(p)).filter(Boolean).map(x => B.lang === "en" ? x.en : x.hu);
    return `<div class="atl-sheet">
      <div class="atl-sh-head">${c ? `<svg class="atl-mini" viewBox="0 0 10 10" data-fit="1" aria-hidden="true"><path d="${c.d}"/></svg>` : `<span class="atl-mini hist" aria-hidden="true">${A.ic("clock", 28)}</span>`}
        <div><h2>${esc(iss.name)}</h2>${h ? `<p class="muted">${h.from}–${h.to} · történelmi kibocsátó</p>` : `<p class="muted">${a ? STATUS[statusOf(a)][0] : STATUS.none[0]}</p>`}</div></div>
      <div class="atl-sum in-sheet">
        <div><span>${A.ic("stamp", 20)}</span><b>${a ? a.count : 0}</b><small>bélyeg</small></div>
        <div><span>${A.ic("layers", 20)}</span><b>${a ? a.seriesCount : 0}</b><small>sorozat</small></div>
        <div><span>${A.ic("chart", 20)}</span><b>${a && a.priced ? money(A, a.lo, a.hi) : "nincs adat"}</b><small>${a && a.priced ? `becsült érték · ${a.priced}/${a.count} árazott` : "becsült érték"}</small></div></div>
      ${a && a.priced ? `<p class="disc"><span class="est-tag">Előzetes AI-becslés</span> ${esc(rateNote(A))}</p>` : ""}
      ${h ? `<div class="infobox">${A.ic("info", 16)} Mai érintett országok (tájékoztató, nem határ): ${esc(present.join(", "))}.</div>` : ""}
      ${a ? `<h3 class="sec-t">Időszakok</h3><div class="atl-eras">${eras.map(e => `<button class="atl-era ${AT.era === e.k ? "on" : ""}" data-act="at-era" data-e="${e.k}" aria-pressed="${AT.era === e.k}" ${e.n ? "" : "disabled"}><b>${e.l}</b><small>${e.s} sorozat · ${e.n} bélyeg</small>${A.ic("chevron", 16)}</button>`).join("")}${noYear ? `<p class="muted" style="font-size:.8125rem">${noYear} tételnél ismeretlen a kiadás éve.</p>` : ""}</div>
      ${themes.length ? `<h3 class="sec-t">Legfontosabb témák</h3><div class="chips">${themes.map(([t, n]) => `<span class="chip">${esc(t)} · ${n}</span>`).join("")}</div>` : ""}
      ${unconf.length ? `<h3 class="sec-t">Azonosítatlan vagy felülvizsgálandó tételek</h3><p class="muted" style="font-size:.8125rem;margin:0 0 6px">Nem megerősített azonosítás, vagy a kibocsátó nem egyértelmű.</p>${unconf.map(i => `<button class="item" data-act="item" data-id="${esc(i.id)}"><div class="stamp sm">${A.thumbHTML(i.thumb || i.photo)}</div><div style="min-width:0;text-align:left"><div class="t">${esc(i.result?.nev || "Bélyeg")}</div><div class="s">${esc(D().issuerOf(i).why || "nem megerősített azonosítás")}</div></div></button>`).join("")}` : ""}
      <h3 class="sec-t">Bélyegek${AT.era ? ` · ${esc(ERAS.find(e => e[0] === AT.era)[1])}` : ""} (${shown.length})</h3>
      <div class="atl-stamps">${shown.map(i => `<button class="topc" data-act="item" data-id="${esc(i.id)}"><div class="stamp">${A.thumbHTML(i.photo || i.thumb)}</div><div class="n">${esc(i.result?.nev || "Bélyeg")}</div><div class="p">${(+i.max || 0) > 0 ? A.fmt(A.mid(i), i.result) : "nincs becslés"}</div></button>`).join("")}</div>
      <button class="btn primary" data-act="at-coll" data-id="${esc(id)}" style="margin-top:14px">${A.ic("stamp", 18)} Bélyegek megtekintése a gyűjteményben</button>`
      : `<div class="empty-state">${A.ic("stamp", 30)}<b>Ebből az országból még nincs bélyeged</b><span>Szkennelj be egyet, és itt jelenik meg.</span><button class="btn primary small" data-act="goscan-single">${A.ic("camera", 16)} Szkennelés</button></div>`}
    </div>`;
  }
  function reviewHTML(A, agg){
    return `<div class="atl-sheet"><h2>Felülvizsgálandó kibocsátók</h2><p class="muted">Ezeknél a tételeknél a kibocsátó nem rendelhető egyértelműen országhoz. Javítsd az „Ország” mezőt az adatlapon (Adatok → Adatok javítása).</p>
      ${agg.review.map(i => `<button class="item" data-act="item" data-id="${A.esc(i.id)}"><div class="stamp sm">${A.thumbHTML(i.thumb || i.photo)}</div><div style="min-width:0;text-align:left"><div class="t">${A.esc(i.result?.nev || "Bélyeg")}</div><div class="s">${A.esc(i.result?.orszag || "–")} · ${A.esc(D().issuerOf(i).why)}</div></div></button>`).join("")}</div>`;
  }

  function render(){
    const A = B.app, h = ov(); if (!A || !h || h.hidden) return;
    if (AT.pf && AT.pf !== "all" && !A.pfList().some(p => p.id === AT.pf)) AT.pf = "all";
    const agg = D().aggregate(items(A)), empty = !A.S.items.length, sub = AT.sel || AT.tab === "review";
    const title = AT.sel ? "Kibocsátó" : AT.tab === "review" ? "Felülvizsgálat" : "Világatlasz";
    h.innerHTML = `<div class="ov-bar"><button class="iconbtn" data-act="at-back" aria-label="Vissza">${A.ic("back", 22)}</button><span class="ov-t">${title}<small>${B.BRAND.name} Atlas</small></span><button class="iconbtn" data-act="at-info" aria-label="Jelmagyarázat és források">${A.ic("info", 20)}</button></div>
      <div class="ov-body"><div class="wrap atlas">
      ${sub ? (AT.sel ? sheetHTML(A, agg) : reviewHTML(A, agg)) : `
        <p class="atl-lead">Bélyegek kibocsátók szerint</p>
        <div class="pfchips" role="radiogroup" aria-label="Portfólió">${[{id: "all", name: "Összes"}, ...A.pfList()].map(p => `<button role="radio" aria-checked="${(AT.pf || "all") === p.id}" class="${(AT.pf || "all") === p.id ? "on" : ""}" data-act="at-pf" data-pf="${A.esc(p.id)}">${A.esc(p.name)} <span class="n">${A.pfItems(p.id).length}</span></button>`).join("")}</div>
        <div class="mode atl-tabs" role="tablist" aria-label="Atlasz nézet">${[["map", "Térkép"], ["list", "Lista"], ["hist", "Történelmi"]].map(([k, l]) => `<button role="tab" aria-selected="${AT.tab === k}" class="${AT.tab === k ? "on" : ""}" data-act="at-tab" data-t="${k}">${l}</button>`).join("")}</div>
        ${empty ? `<div class="infobox">${A.ic("info", 16)} Még nincs bélyeg a gyűjteményben – szkennelj be egyet, és a térképen megjelenik a kibocsátó országa.</div>` : ""}
        ${AT.tab === "map" ? mapTab(A, agg) : AT.tab === "list" ? listTab(A, agg) : histTab(A, agg)}
        ${summaryHTML(A, agg)}
        ${empty ? `<button class="btn primary" data-act="goscan-single" style="margin-top:12px">${A.ic("camera", 18)} Első bélyeg szkennelése</button>` : ""}`}
      </div></div>`;
    h.querySelectorAll("svg[data-fit]").forEach(s => { try { const b = s.querySelector("path").getBBox(), p = Math.max(b.width, b.height) * .08; s.setAttribute("viewBox", `${b.x - p} ${b.y - p} ${b.width + 2 * p} ${b.height + 2 * p}`); } catch(e){} });
    bindMap();
  }
  /* ---------- nagyítás, mozgatás, érintés ---------- */
  /* Kezdő nézet: a gyűjteményben szereplő mai kibocsátókra illesztve (ha nincs ilyen, az egész világ). Az „Alaphelyzet” az egész világ. */
  function fitView(A){
    const agg = D().aggregate(items(A)), pts = G().countries.filter(c => c.a2 && agg.by.get(c.a2)).map(c => c.c); if (!pts.length) return null;
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), m = 60, x0 = Math.min(...xs) - m, x1 = Math.max(...xs) + m, y0 = Math.min(...ys) - m, y1 = Math.max(...ys) + m;
    const k = Math.min(6, G().w / (x1 - x0), G().h / (y1 - y0)); return clampView({cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, k: Math.max(1, k)});
  }
  function setView(v){ AT.view = clampView(v); const s = document.querySelector("#atlasMap .atlas-svg"); if (s) s.setAttribute("viewBox", vb().join(" ")); }
  function bindMap(){
    const box = document.getElementById("atlasMap"); if (!box) return; const svg = box.querySelector(".atlas-svg");
    const P = new Map(); let start = null, moved = false;
    const toVB = (x, y) => { const r = svg.getBoundingClientRect(), [vx, vy, vw, vh] = vb(); return [vx + (x - r.left) / r.width * vw, vy + (y - r.top) / r.height * vh]; };
    svg.addEventListener("pointerdown", e => { P.set(e.pointerId, {x: e.clientX, y: e.clientY}); moved = false; start = {pts: new Map(P), view: {...(AT.view || clampView({cx: G().w / 2, cy: G().h / 2, k: 1}))}}; try { svg.setPointerCapture(e.pointerId); } catch(_){} });
    svg.addEventListener("pointermove", e => {
      if (!P.has(e.pointerId) || !start) return; P.set(e.pointerId, {x: e.clientX, y: e.clientY});
      const r = svg.getBoundingClientRect(), [, , vw] = vb();
      if (P.size === 1 && start.pts.size === 1) {
        const s0 = [...start.pts.values()][0], dx = e.clientX - s0.x, dy = e.clientY - s0.y; if (Math.hypot(dx, dy) > 6) moved = true; if (!moved) return;
        const sc = (G().w / start.view.k) / r.width; setView({...start.view, cx: start.view.cx - dx * sc, cy: start.view.cy - dy * sc});
      } else if (P.size === 2 && start.pts.size === 2) {
        const [a0, b0] = [...start.pts.values()], [a1, b1] = [...P.values()], d0 = Math.hypot(a0.x - b0.x, a0.y - b0.y), d1 = Math.hypot(a1.x - b1.x, a1.y - b1.y); moved = true;
        if (d0 > 10) setView({...start.view, k: start.view.k * d1 / d0});
      }
    });
    const end = e => { P.delete(e.pointerId); if (!P.size) { if (moved) { start = null; render(); } start = null; } };
    svg.addEventListener("pointerup", e => {
      const tgt = e.target.closest?.("[data-cid]"), wasMoved = moved; end(e);
      if (!wasMoved && tgt && tgt.dataset.cid && D().aggregate(items(B.app)).by.get(tgt.dataset.cid)) select(tgt.dataset.cid);
    });
    svg.addEventListener("pointercancel", end);
    svg.addEventListener("wheel", e => { e.preventDefault(); const [x, y] = toVB(e.clientX, e.clientY), v = AT.view || clampView({cx: G().w / 2, cy: G().h / 2, k: 1}), k = v.k * (e.deltaY < 0 ? 1.25 : 0.8); setView({k, cx: x + (v.cx - x) * v.k / k, cy: y + (v.cy - y) * v.k / k}); clearTimeout(bindMap.t); bindMap.t = setTimeout(render, 250); }, {passive: false});
    svg.addEventListener("keydown", e => { const t = e.target.closest?.("[data-cid]"); if (t && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); select(t.dataset.cid); } });
  }
  function select(id){ AT.sel = id; AT.era = null; render(); B.app?.haptic?.(8); const b = ov().querySelector(".ov-body"); if (b) b.scrollTop = 0; }

  function openAtlas(opts = {}){
    const A = B.app, h = ov(); if (!A || !h) return;
    AT.pf = opts.pf || A.S.activePf || "all"; AT.sel = opts.sel || null; AT.tab = opts.tab || "map"; AT.era = null;
    AT.view = fitView(A);
    h.hidden = false; document.body.classList.add("ov-open"); requestAnimationFrame(() => h.classList.add("on")); render();
    try { h.querySelector("[data-act=at-back]").focus({preventScroll: true}); } catch(e){}
  }
  function closeAtlas(){ const h = ov(); if (!h || h.hidden) return; h.classList.remove("on"); h.hidden = true; if (!document.querySelector(".overlay:not([hidden])")) document.body.classList.remove("ov-open"); }
  function infoModal(A){
    A.openModal(`<h2 style="margin:8px 0 10px">Jelmagyarázat és források</h2>${legendHTML()}
      <p style="font-size:.875rem">A színek mellett jel (✓, ?, –) és szöveg is mutatja az állapotot. „Gyűjteményben van”: legalább egy megerősített azonosítású bélyeg. „Van, de nem megerősített”: csak AI-javaslattal azonosított tétel.</p>
      <h3 class="sec-t">Hozzárendelés</h3><p style="font-size:.875rem">A bélyeg a kibocsátó szerint kerül országhoz (filatéliai logika), nem a mai határok szerint. A történelmi kibocsátók (pl. Osztrák–Magyar Monarchia, Szovjetunió) külön, a Történelmi fülön szerepelnek, határ nélkül.</p>
      <h3 class="sec-t">Adatforrások és licencek</h3><ul class="srcs" style="font-size:.8125rem;padding-left:18px">
      <li>Országhatárok: Natural Earth 1:110m, a kisebb államok 1:50m (Admin 0 – Countries, v4.1.0) – közkincs (public domain), naturalearthdata.com</li>
      <li>TopoJSON-terjesztés: world-atlas 2.0.2 – ISC licenc</li><li>Vetítés: d3-geo, Natural Earth I – ISC licenc</li><li>Országnevek: i18n-iso-countries – MIT licenc</li>
      <li>A térkép a mai, de facto határokat mutatja; vitatott területeknél nem foglal állást.</li></ul>
      <button class="btn ghost" data-act="close" style="margin-top:10px">Bezárás</button>`);
  }
  document.addEventListener("click", e => {
    const a = e.target.closest("[data-act]"); if (!a) return; const A = B.app, act = a.dataset.act; if (!A) return;
    if ((act === "goscan-single" || act === "goscan-page") && !ov()?.hidden) { closeAtlas(); return; }
    if (!act.startsWith("at-")) return;
    if (act === "at-back") { if (AT.sel || AT.tab === "review") { AT.sel = null; if (AT.tab === "review") AT.tab = "map"; render(); } else closeAtlas(); }
    else if (act === "at-open") openAtlas({sel: a.dataset.sel || null, tab: a.dataset.t || "map"});
    else if (act === "at-tab") { AT.tab = a.dataset.t; AT.sel = null; render(); }
    else if (act === "at-pf") { AT.pf = a.dataset.pf; render(); }
    else if (act === "at-sel") select(a.dataset.id);
    else if (act === "at-era") { AT.era = AT.era === a.dataset.e ? null : a.dataset.e; render(); }
    else if (act === "at-period") { AT.period = a.dataset.p; render(); }
    else if (act === "at-zoom") { const v = AT.view || clampView({cx: G().w / 2, cy: G().h / 2, k: 1}); setView({...v, k: v.k * +a.dataset.z}); render(); }
    else if (act === "at-reset") { AT.view = null; render(); }
    else if (act === "at-layers") { AT.labels = !AT.labels; render(); }
    else if (act === "at-filter") { AT.status = AT.status === "all" ? "have" : AT.status === "have" ? "partial" : "all"; render(); A.toast(AT.status === "all" ? "Szűrő: minden ország" : AT.status === "have" ? "Szűrő: csak megerősített" : "Szűrő: csak nem megerősített"); }
    else if (act === "at-info") infoModal(A);
    else if (act === "at-review") { AT.tab = "review"; AT.sel = null; render(); }
    else if (act === "at-coll") { closeAtlas(); B.collFilterIssuer?.(a.dataset.id); }
  });
  /* az adatlapról visszatérve frissít (pl. javított ország mező) */
  B.refreshAtlas = () => { if (!ov()?.hidden) render(); };
  B.openAtlas = openAtlas; B.closeAtlas = closeAtlas; B.atlasState = AT;
})();
