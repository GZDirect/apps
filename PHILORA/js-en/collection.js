/* GENERÁLT FÁJL – ne szerkeszd. Forrás: js/collection.js, szótár: tools/i18n/en.json, eszköz: tools/i18n/build-en.js */
/* PHILORA – Gyűjtemény: virtuális album, rács, lista, keresés, szűrés, rendezés, albumok, kívánságlista, duplikátumok. */
(() => {
  const B = window.BS;
  const C = {tab:"stamps", view:"grid", q:"", f:{}, sort:"new", page:0};
  const COLORS = {forest:["#10382F","Forest green"], wine:["#6B2533","Burgundy"], navy:["#1F3A5F","Navy"], sage:["#3F5546","Sage"], umber:["#6B4A2B","Umber"], graphite:["#2B312D","Graphite"], classic:["#E8D9B8","Classic"]};
  const LIGHT = new Set(["classic"]);   // világos borító: sötét feliratok
  const EMBLEMS = ["stamp","globe","crown","star","heart","copy","book","shield"];
  const TIPUS = {gyujtemeny:"Collection", duplikatum:"Duplicate", csere:"Swap copy"};
  const decade = y => { const n = parseInt(y, 10); return n ? `${Math.floor(n / 10) * 10}s` : ""; };
  const norm = s => (B.app.strip(s || ""));

  function filtered(A){
    let L = A.S.items.slice();
    const q = norm(C.q).trim(), f = C.f;
    if (q) L = L.filter(i => { const r = i.result || {}; return norm([r.nev, r.orszag, r.sorozat, r.tema, r.kiadas_eve, r.nevertek, i.peldany?.kod, A.catText(r.katalogus), i.peldany?.megjegyzes].join(" ")).includes(q); });
    if (f.orszag) L = L.filter(i => i.result?.orszag === f.orszag);
    if (f.kibocsato && B.atlasData) L = L.filter(i => B.atlasData.issuerOf(i).id === f.kibocsato);
    if (f.evtized) L = L.filter(i => decade(i.result?.kiadas_eve) === f.evtized);
    if (f.sorozat) L = L.filter(i => i.seriesKey === f.sorozat);
    if (f.allapot) L = L.filter(i => i.cond === f.allapot);
    if (f.tema) L = L.filter(i => (i.result?.tema || "") === f.tema);
    if (f.album) L = L.filter(i => (i.peldany?.album || "") === f.album);
    if (f.tipus) L = L.filter(i => (i.peldany?.tipus || "gyujtemeny") === f.tipus);
    const by = {
      new: (a, b) => (b.createdAt || 0) - (a.createdAt || 0),
      value: (a, b) => A.mid(b) - A.mid(a),
      country: (a, b) => (a.result?.orszag || "").localeCompare(b.result?.orszag || "", "hu"),
      year: (a, b) => (parseInt(a.result?.kiadas_eve) || 9999) - (parseInt(b.result?.kiadas_eve) || 9999),
      name: (a, b) => (a.result?.nev || "").localeCompare(b.result?.nev || "", "hu"),
      series: (a, b) => (a.seriesKey || "~").localeCompare(b.seriesKey || "~") || a.memberIdx - b.memberIdx,
      cond: (a, b) => A.COND.findIndex(c => c.k === a.cond) - A.COND.findIndex(c => c.k === b.cond)
    };
    return L.sort(by[C.sort] || by.new);
  }
  const SORTS = [["new","Newest"],["value","Value"],["country","Country"],["year","Year of issue"],["series","Series"],["cond","Condition"],["name","Name"]];
  const FLAB = {kibocsato:"Issuer", orszag:"Country", evtized:"Decade", sorozat:"Series", allapot:"Condition", tema:"Topic", album:"Album", tipus:"Copy type"};
  function fVal(A, k, v){ if (k === "kibocsato") return B.atlasData?.issuer(v)?.name || v; if (k === "sorozat") return A.S.series[v]?.cim || v; if (k === "allapot") return A.condL(v); if (k === "album") return A.S.albums.find(a => a.id === v)?.name || "no album"; if (k === "tipus") return TIPUS[v] || v; return v; }

  function tile(A, i){
    const r = i.result || {}, t = i.peldany?.tipus;
    return `<button class="ctile" data-act="item" data-id="${A.esc(i.id)}"><div class="cph"><div class="stamp">${A.thumbHTML(i.photo || i.thumb)}</div>${t && t !== "gyujtemeny" ? `<span class="ctag">${A.esc(TIPUS[t])}</span>` : ""}${!i.azonositas?.megerositve ? `<span class="cdot" title="Unconfirmed identification"></span>` : ""}</div>
      <div class="cn">${A.esc(r.nev || "Stamp")}</div><div class="cs">${A.esc([r.orszag, r.kiadas_eve].filter(Boolean).join(" · "))}</div><div class="cv">${(+i.max || 0) > 0 ? A.fmt(A.mid(i), r) : "no estimate"}</div></button>`;
  }
  function row(A, i){
    const r = i.result || {}, t = i.peldany?.tipus;
    return `<button class="item" data-act="item" data-id="${A.esc(i.id)}"><div class="stamp sm">${A.thumbHTML(i.thumb || i.photo)}</div><div style="min-width:0;text-align:left"><div class="t">${A.esc(r.nev || "Stamp")}</div><div class="s">${A.esc([r.orszag, r.kiadas_eve, r.nevertek].filter(Boolean).join(" · "))}</div><div class="s">${A.esc(A.condL(i.cond))} · ${A.esc(A.gradeL(i.grade))} · ${A.esc(i.peldany?.kod || "")}${t && t !== "gyujtemeny" ? " · " + A.esc(TIPUS[t]) : ""}</div></div><div class="v">${(+i.max || 0) > 0 ? A.fmt(A.mid(i), r) : "–"}</div></button>`;
  }
  function albumPages(A, L){
    const per = 8, pages = Math.max(1, Math.ceil(L.length / per)); C.page = Math.min(C.page, pages - 1);
    const cur = L.slice(C.page * per, C.page * per + per), strips = [0, 1, 2, 3].map(s => cur.slice(s * 2, s * 2 + 2));
    const alb = A.S.albums.find(a => a.id === C.f.album), col = COLORS[alb?.color]?.[0] || "#10382F";
    return `<div class="valbum${LIGHT.has(alb?.color) ? " light" : ""}" style="--alb:${col}">
      <div class="va-head"><span>${A.esc(alb?.name || "Whole collection")}</span><span>${C.page + 1} / ${pages}</span></div>
      <div class="va-page">${strips.map(st => `<div class="va-strip">${st.map(i => `<button class="va-slot" data-act="item" data-id="${A.esc(i.id)}" aria-label="${A.esc(i.result?.nev || "Stamp")}"><div class="stamp">${A.thumbHTML(i.photo || i.thumb)}</div><span>${A.esc(i.result?.nev || "")}</span></button>`).join("")}</div>`).join("")}</div>
      <div class="row va-nav"><button class="btn ghost small" data-act="c-page" data-d="-1" ${C.page ? "" : "disabled"}>${A.ic("back", 16)} Previous</button><button class="btn ghost small" data-act="c-page" data-d="1" ${C.page < pages - 1 ? "" : "disabled"}>Next ${A.ic("chevron", 16)}</button></div>
    </div>`;
  }
  function stampsTab(A){
    const L = filtered(A), chips = Object.entries(C.f).filter(([, v]) => v !== undefined && v !== null && v !== "");
    const albChips = `<div class="pfchips"><button class="${!C.f.album ? "on" : ""}" data-act="c-alb" data-id="">All</button>${A.S.albums.map(a => `<button class="${C.f.album === a.id ? "on" : ""}" data-act="c-alb" data-id="${A.esc(a.id)}">${A.esc(a.name)}</button>`).join("")}</div>`;
    return `
      <div class="searchbar">${A.ic("search", 18)}<input id="collQ" type="search" placeholder="Search: name, country, series, topic, code…" value="${A.esc(C.q)}" aria-label="Search the collection"></div>
      <div class="toolbar">
        <div class="vswitch" role="radiogroup" aria-label="View">${[["album","album","Album"],["grid","grid","Grid"],["list","list","List"]].map(([k, icn, l]) => `<button data-act="c-view" data-v="${k}" class="${C.view === k ? "on" : ""}" role="radio" aria-checked="${C.view === k}" aria-label="${l}">${A.ic(icn, 18)}<span>${l}</span></button>`).join("")}</div>
        <button class="btn ghost small" data-act="c-filter">${A.ic("filter", 16)} Filter${chips.length ? ` (${chips.length})` : ""}</button>
      </div>
      ${chips.length ? `<div class="chips fchips">${chips.map(([k, v]) => `<button class="chip" data-act="c-unf" data-k="${k}">${FLAB[k]}: ${A.esc(fVal(A, k, v))} ${A.ic("close", 12)}</button>`).join("")}<button class="linkbtn" data-act="c-clear">Clear all</button></div>` : ""}
      ${C.view === "album" ? albChips : ""}
      <div class="muted cnt">${L.length} items · sorted by: ${SORTS.find(s => s[0] === C.sort)[1]}</div>
      ${!L.length ? `<div class="empty-state">${A.ic("search", 30)}<b>No results</b><span>Try another search term or clear the filters.</span></div>`
        : C.view === "grid" ? `<div class="cgrid">${L.map(i => tile(A, i)).join("")}</div>` : C.view === "list" ? L.map(i => row(A, i)).join("") : albumPages(A, L)}`;
  }
  function albumsTab(A){
    const cnt = id => A.S.items.filter(i => (i.peldany?.album || "") === id).length;
    return `<div class="covers">${A.S.albums.map(a => {
      const color = a.color || "forest", pk = B.albumCover ? B.albumCover(color, a.name, {glyph: false}) : null, lt = LIGHT.has(color) ? " light" : "";
      /* Csomagbeli borító (PHILORA Premium Grafikai Csomag): a felirat az album neve; az embléma a borító körébe kerül. */
      if (pk) return `<div class="cover pk${lt}"><button class="cover-main" data-act="c-openalb" data-id="${A.esc(a.id)}" aria-label="${A.esc(a.name)}, ${cnt(a.id)} stamp(s)"><span class="cv-art"><img class="cover-img" src="${pk}" alt="" width="360" height="500"><span class="cv-ov" aria-hidden="true">${A.ic(a.emblem || "stamp", 34)}</span></span><small class="cv-cnt">${cnt(a.id)} stamp(s)</small></button><button class="cover-more" data-act="c-albmenu" data-id="${A.esc(a.id)}" aria-label="Edit album">${A.ic("more", 18)}</button></div>`;
      return `<div class="cover${lt}" style="--alb:${COLORS[color]?.[0] || "#10382F"}"><button class="cover-main" data-act="c-openalb" data-id="${A.esc(a.id)}"><span class="cv-em">${A.ic(a.emblem || "stamp", 30)}</span><b>${A.esc(a.name)}</b><small>${cnt(a.id)} stamp(s)</small></button><button class="cover-more" data-act="c-albmenu" data-id="${A.esc(a.id)}" aria-label="Edit album">${A.ic("more", 18)}</button></div>`;
    }).join("")}
      <button class="cover add" data-act="c-newalb"><span class="cv-em">${A.ic("plus", 30)}</span><b>New album</b><small>With your own cover</small></button></div>
      <div class="disc">Albums are virtual: a stamp can be in one album, and you can record its physical place (page, row) on its details page.${cnt("") ? ` ${cnt("")} stamp(s) not in an album yet.` : ""}</div>`;
  }
  function wishTab(A){
    const W = A.S.wishes;
    return `<button class="btn ghost" data-act="c-newwish" style="margin-bottom:10px">${A.ic("plus", 18)} New wishlist item</button>
      ${!W.length ? `<div class="empty-state">${A.ic("heart", 30)}<b>Your wishlist is empty</b><span>Add a wanted stamp from a locked series slot, or here by hand.</span></div>`
      : W.map(w => `<div class="wish"><span class="wi">${A.ic("heart", 18)}</span><div style="min-width:0;flex:1"><b>${A.esc(w.cim)}</b><div class="s">${A.esc([w.orszag, w.ev, w.nevertek].filter(Boolean).join(" · "))}${w.maxAr ? ` · max. ${A.hufFmt(w.maxAr)}` : ""}</div>${w.megjegyzes ? `<div class="s">${A.esc(w.megjegyzes)}</div>` : ""}</div><div class="wa"><button class="btn small primary" data-act="goscan-single" aria-label="Got it – scan">${A.ic("camera", 16)}</button><button class="btn small ghost" data-act="c-delwish" data-id="${A.esc(w.id)}" aria-label="Delete">${A.ic("trash", 16)}</button></div></div>`).join("")}`;
  }
  function dupsTab(A){
    const groups = {};
    for (const i of A.S.items) { const k = A.dupKey(i.result, i.seriesKey, i.memberIdx); if (k) (groups[k] = groups[k] || []).push(i); }
    const G = Object.values(groups).filter(g => g.length > 1).sort((a, b) => b.length - a.length);
    if (!G.length) return `<div class="empty-state">${A.ic("copy", 30)}<b>No duplicates</b><span>If you have several copies of a stamp, manage them here and mark the swap copies.</span></div>`;
    return G.map(g => `<div class="card dupg"><div class="dg-h"><b>${A.esc(g[0].result?.nev || "Stamp")}</b><span class="badge">${g.length} copies</span></div>
      ${g.map(i => `<div class="dg-row"><button class="stamp sm" data-act="item" data-id="${A.esc(i.id)}" aria-label="Details">${A.thumbHTML(i.thumb || i.photo)}</button><div style="flex:1;min-width:0"><div class="s"><b>${A.esc(i.peldany?.kod || "")}</b> · ${A.esc(A.condL(i.cond))} · ${A.esc(A.gradeL(i.grade))}</div><div class="seg">${Object.entries(TIPUS).map(([k, l]) => `<button data-act="c-tipus" data-id="${A.esc(i.id)}" data-t="${k}" class="${(i.peldany?.tipus || "gyujtemeny") === k ? "on" : ""}">${l}</button>`).join("")}</div></div></div>`).join("")}</div>`).join("");
  }
  document.addEventListener("bs-brand-assets", () => { if (B.app?.S?.view === "coll") B.renderCollection(); });
  /* Atlaszból: a gyűjtemény szűrése kibocsátóra */
  B.collFilterIssuer = id => { C.tab = "stamps"; C.view = "grid"; C.f = {kibocsato: id}; C.q = ""; C.page = 0; B.app.show("coll"); B.renderCollection(); };
  B.renderCollection = () => {
    const A = B.app, el = document.getElementById("collWrap"); if (!A || !el) return;
    const n = A.S.items.length, foc = document.activeElement?.id === "collQ", pos = foc ? document.activeElement.selectionStart : 0;
    el.innerHTML = `<h2 class="page-title">Collection <span class="pt-n">${n}</span></h2>
      <div class="tabs4" role="tablist">${[["stamps","Stamps"],["albums","Albums"],["wish","Wishlist"],["dups","Duplicates"]].map(([k, l]) => `<button role="tab" aria-selected="${C.tab === k}" class="${C.tab === k ? "on" : ""}" data-act="c-tab" data-t="${k}">${l}</button>`).join("")}</div>
      ${!n && C.tab !== "wish" && C.tab !== "albums" ? `<div class="welcome small">${B.brandImg("empty.collection", B.art.empty())}<h2>Your collection is empty</h2><p>Scan your first stamp and it appears here – with photo, details and value.</p><button class="btn primary" data-act="goscan-single">${A.ic("camera", 20)} Scan</button></div>`
        : C.tab === "stamps" ? stampsTab(A) : C.tab === "albums" ? albumsTab(A) : C.tab === "wish" ? wishTab(A) : dupsTab(A)}`;
    if (foc) { const q = document.getElementById("collQ"); q.focus(); try { q.setSelectionRange(pos, pos); } catch(e){} }
  };
  function filterSheet(A){
    const I = A.S.items, uniq = f => [...new Set(I.map(f).filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b), "hu"));
    const opts = {orszag: uniq(i => i.result?.orszag), evtized: uniq(i => decade(i.result?.kiadas_eve)), sorozat: uniq(i => i.seriesKey).filter(k => A.S.series[k]), allapot: A.COND.map(c => c.k), tema: uniq(i => i.result?.tema), album: A.S.albums.map(a => a.id), tipus: Object.keys(TIPUS)};
    A.openModal(`<h2 style="margin:8px 0 10px">Filter and sort</h2><form id="fForm" class="form">
      ${Object.entries(opts).map(([k, list]) => `<label for="ff-${k}">${FLAB[k]}</label><select class="field" id="ff-${k}" name="${k}"><option value="">All</option>${list.map(v => `<option value="${A.esc(v)}" ${C.f[k] === v ? "selected" : ""}>${A.esc(fVal(A, k, v))}</option>`).join("")}</select>`).join("")}
      <label for="ff-sort">Sort by</label><select class="field" id="ff-sort" name="sort">${SORTS.map(([k, l]) => `<option value="${k}" ${C.sort === k ? "selected" : ""}>${l}</option>`).join("")}</select></form>
      <div class="row" style="margin-top:14px"><button class="btn ghost" data-act="c-clear">Reset</button><button class="btn primary" data-act="c-apply">Apply</button></div>`);
  }
  function albumForm(A, a){
    A.openModal(`<h2 style="margin:8px 0 4px">${a ? "Edit album" : "New virtual album"}</h2>
      <form class="form" id="albForm"><label for="alb-n">Name</label><input class="field" id="alb-n" name="name" maxlength="40" value="${A.esc(a?.name || "")}" placeholder="e.g. Hungary 1950s">
      <label>Cover colour</label><div class="swpick">${Object.entries(COLORS).map(([k, [h, l]]) => `<label><input type="radio" name="color" value="${k}" ${((a?.color) || "forest") === k ? "checked" : ""}><span style="background:${h}" title="${l}"></span><em class="sr-only">${l}</em></label>`).join("")}</div>
      <label>Emblem</label><div class="empick">${EMBLEMS.map(e => `<label><input type="radio" name="emblem" value="${e}" ${((a?.emblem) || "stamp") === e ? "checked" : ""}><span>${A.ic(e, 22)}</span></label>`).join("")}</div></form>
      <div class="row" style="margin-top:14px">${a ? `<button class="btn danger" data-act="c-delalb" data-id="${A.esc(a.id)}">Delete</button>` : `<button class="btn ghost" data-act="close">Cancel</button>`}<button class="btn primary" data-act="c-savealb" data-id="${A.esc(a?.id || "")}">Save</button></div>`);
  }
  function wishForm(A){
    A.openModal(`<h2 style="margin:8px 0 4px">Wanted stamp</h2><form class="form" id="wForm">
      ${[["cim","Name","e.g. Chain Bridge 60 f"],["orszag","Country",""],["ev","Year of issue",""],["nevertek","Face value",""],["maxAr","Maximum I would pay (Ft)",""],["megjegyzes","Note",""]].map(([k, l, ph]) => `<label for="w-${k}">${l}</label><input class="field" id="w-${k}" name="${k}" ${k === "maxAr" ? 'inputmode="numeric"' : ""} placeholder="${ph}">`).join("")}</form>
      <div class="row" style="margin-top:14px"><button class="btn ghost" data-act="close">Cancel</button><button class="btn primary" data-act="c-savewish">Save</button></div>`);
  }
  document.addEventListener("input", e => { if (e.target.id === "collQ") { C.q = e.target.value; C.page = 0; B.renderCollection(); } });
  document.addEventListener("click", async e => {
    const a = e.target.closest("[data-act]"); if (!a) return;
    const A = B.app, act = a.dataset.act; if (!A) return;
    if (act === "goview" && a.dataset.series) { C.tab = "stamps"; C.f = {sorozat: a.dataset.series}; C.view = "grid"; B.renderCollection(); return; }
    if (!act.startsWith("c-")) return;
    const put = A.store.put.bind(A.store);
    if (act === "c-tab") { C.tab = a.dataset.t; }
    else if (act === "c-view") { C.view = a.dataset.v; C.page = 0; }
    else if (act === "c-page") { C.page = Math.max(0, C.page + +a.dataset.d); }
    else if (act === "c-alb") { C.f.album = a.dataset.id || undefined; if (!a.dataset.id) delete C.f.album; C.page = 0; }
    else if (act === "c-filter") { filterSheet(A); return; }
    else if (act === "c-apply") { const fd = new FormData(document.getElementById("fForm")); const keep = C.f.kibocsato; C.f = {}; if (keep) C.f.kibocsato = keep; for (const k of Object.keys(FLAB)) { const v = fd.get(k); if (v) C.f[k] = v; } C.sort = fd.get("sort") || "new"; C.page = 0; A.closeModal(); }
    else if (act === "c-clear") { C.f = {}; C.sort = "new"; C.q = ""; A.closeModal(); }
    else if (act === "c-unf") { delete C.f[a.dataset.k]; }
    else if (act === "c-openalb") { C.tab = "stamps"; C.view = "album"; C.f = {album: a.dataset.id}; C.page = 0; }
    else if (act === "c-newalb") { albumForm(A, null); return; }
    else if (act === "c-albmenu") { albumForm(A, A.S.albums.find(x => x.id === a.dataset.id)); return; }
    else if (act === "c-savealb") {
      const fd = new FormData(document.getElementById("albForm")), name = String(fd.get("name") || "").trim(); if (!name) return A.toast("Give the album a name.");
      const id = a.dataset.id || A.uidGen("al_"), old = A.S.albums.find(x => x.id === id);
      try { await put(id, {kind:"album", schema:2, name, color:fd.get("color") || "forest", emblem:fd.get("emblem") || "stamp", createdAt: old?.createdAt || Date.now()}); A.closeModal(); A.toast(old ? "Album saved" : "Album created"); A.haptic(10); } catch(err){ A.toast("Could not save."); }
    }
    else if (act === "c-delalb") {
      if (!a.dataset.confirm) { a.dataset.confirm = "1"; a.textContent = "Delete for sure?"; return; }
      const id = a.dataset.id;
      try { for (const i of A.S.items.filter(x => x.peldany?.album === id)) await put(i.id, {...i, peldany:{...i.peldany, album:""}}); await A.store.del(id); if (C.f.album === id) delete C.f.album; A.closeModal(); A.toast("Album deleted – the stamps were kept"); } catch(err){ A.toast("Could not delete."); }
    }
    else if (act === "c-newwish") { wishForm(A); return; }
    else if (act === "c-savewish") {
      const fd = new FormData(document.getElementById("wForm")), cim = String(fd.get("cim") || "").trim(); if (!cim) return A.toast("Enter the stamp’s name.");
      const mx = parseInt(String(fd.get("maxAr") || "").replace(/\D/g, ""), 10);
      try { await put(A.uidGen("wi_"), {kind:"wish", schema:2, cim, orszag:String(fd.get("orszag") || ""), ev:String(fd.get("ev") || ""), nevertek:String(fd.get("nevertek") || ""), seriesKey:"", memberIdx:-1, maxAr: mx || null, megjegyzes:String(fd.get("megjegyzes") || ""), createdAt:Date.now()}); A.closeModal(); A.toast("Added to wishlist"); } catch(err){ A.toast("Could not save."); }
    }
    else if (act === "c-delwish") { try { await A.store.del(a.dataset.id); A.toast("Removed from wishlist"); } catch(err){ A.toast("Could not delete."); } }
    else if (act === "c-tipus") { const i = A.S.items.find(x => x.id === a.dataset.id); if (i) try { await put(i.id, {...i, peldany:{...(i.peldany || {}), tipus:a.dataset.t}}); A.haptic(8); } catch(err){ A.toast("Could not save."); } }
    B.renderCollection();
  });
})();
