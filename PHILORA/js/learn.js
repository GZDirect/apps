/* PHILORA – Tudástár: magazin, keresés, kategóriák, mentett cikkek, olvasónézet. */
(() => {
  const B = window.BS;
  const L = {cat:"", q:"", saved:false, open:null};
  const ov = () => document.getElementById("v-article");
  const savedList = A => (A.S.prefs?.savedArticles || (() => { try { return JSON.parse(localStorage.getItem("bs_saved") || "[]"); } catch(e){ return []; } })());
  const isSaved = (A, id) => savedList(A).includes(id);
  const catL = k => (B.CATS.find(c => c.k === k) || {}).l || "";
  const text = a => B.app.strip([a.t, a.lead, ...a.body.map(b => Array.isArray(b[1]) ? b[1].join(" ") : b[1])].join(" "));
  function card(A, a, wide){
    return `<button class="art-card ${wide ? "wide" : ""}" data-act="article" data-id="${A.esc(a.id)}">${B.brandImg("articleCovers." + a.cat, B.art.cover(a.cat, wide ? 150 : 104), 'class="cover-img"')}<div class="ac-in"><span class="ac-cat">${A.esc(catL(a.cat))}</span><b>${A.esc(a.t)}</b>${wide ? `<small>${A.esc(a.lead)}</small>` : ""}<span class="ac-meta">${A.ic("clock", 13)} ${a.min} perc${isSaved(A, a.id) ? ` · ${A.ic("bookmark", 13)} mentve` : ""}</span></div></button>`;
  }
  B.renderLearn = () => {
    const A = B.app, el = document.getElementById("learnWrap"); if (!A || !el) return;
    const q = A.strip(L.q).trim(), saved = savedList(A);
    let list = B.ARTICLES.filter(a => (!L.cat || a.cat === L.cat) && (!L.saved || saved.includes(a.id)) && (!q || text(a).includes(q)));
    const feat = !q && !L.cat && !L.saved ? list[0] : null; if (feat) list = list.slice(1);
    const foc = document.activeElement?.id === "learnQ", pos = foc ? document.activeElement.selectionStart : 0;
    el.innerHTML = `<h2 class="page-title">Tudástár</h2>
      <div class="searchbar">${A.ic("search", 18)}<input id="learnQ" type="search" placeholder="Keresés a cikkekben…" value="${A.esc(L.q)}" aria-label="Keresés a tudástárban"></div>
      <div class="pfchips"><button class="${!L.cat && !L.saved ? "on" : ""}" data-act="l-cat" data-c="">Mind</button><button class="${L.saved ? "on" : ""}" data-act="l-saved">${A.ic("bookmark", 14)} Mentett <span class="n">${saved.length}</span></button>${B.CATS.map(c => `<button class="${L.cat === c.k ? "on" : ""}" data-act="l-cat" data-c="${c.k}">${A.esc(c.l)}</button>`).join("")}</div>
      ${feat ? card(A, feat, true) : ""}
      ${list.length ? `<div class="art-grid">${list.map(a => card(A, a, false)).join("")}</div>` : `<div class="empty-state">${A.ic(L.saved ? "bookmark" : "search", 30)}<b>${L.saved ? "Még nincs mentett cikk" : "Nincs találat"}</b><span>${L.saved ? "Olvasás közben a könyvjelző ikonnal mentheted a cikkeket." : "Próbálj más keresőszót."}</span></div>`}
      <div class="disc">A cikkek tényállításainak forrásai a cikkek végén szerepelnek. A Tudástár ismeretterjesztő, nem helyettesíti a szakkatalógust és a szakértői vizsgálatot.</div>`;
    if (foc) { const i = document.getElementById("learnQ"); i.focus(); try { i.setSelectionRange(pos, pos); } catch(e){} }
  };
  function renderArticle(){
    const A = B.app, a = B.ARTICLES.find(x => x.id === L.open), h = ov(); if (!a || !h) return;
    const body = a.body.map(([t, v]) => t === "p" ? `<p>${A.esc(v)}</p>` : t === "h" ? `<h3>${A.esc(v)}</h3>` : t === "ul" ? `<ul>${v.map(x => `<li>${A.esc(x)}</li>`).join("")}</ul>` : `<aside class="tipbox">${A.ic("info", 18)}<span>${A.esc(v)}</span></aside>`).join("");
    const rel = B.ARTICLES.filter(x => x.cat === a.cat && x.id !== a.id).slice(0, 2);
    h.innerHTML = `<div class="ov-bar"><button class="iconbtn" data-act="l-back" aria-label="Vissza">${A.ic("back", 22)}</button><span class="ov-t">${A.esc(catL(a.cat))}</span><button class="iconbtn ${isSaved(A, a.id) ? "saved" : ""}" data-act="l-save" aria-pressed="${isSaved(A, a.id)}" aria-label="${isSaved(A, a.id) ? "Mentés visszavonása" : "Cikk mentése"}">${A.ic("bookmark", 20)}</button></div>
      <div class="ov-body"><article class="reader">${B.brandImg("articleCovers." + a.cat, B.art.cover(a.cat, 200), 'class="cover-img"')}<div class="wrap">
        <span class="ac-cat">${A.esc(catL(a.cat))}</span><h1>${A.esc(a.t)}</h1><p class="lead">${A.esc(a.lead)}</p><div class="ac-meta">${A.ic("clock", 14)} ${a.min} perc olvasás</div>
        ${body}
        ${a.src ? `<div class="srcs"><b>Források</b><ul>${a.src.map(([t, u]) => `<li><a href="${A.esc(u)}" target="_blank" rel="noopener">${A.esc(t)}</a></li>`).join("")}</ul></div>` : ""}
        ${rel.length ? `<div class="sec-h"><h3>Kapcsolódó cikkek</h3></div><div class="art-grid">${rel.map(x => card(A, x, false)).join("")}</div>` : ""}
      </div></article></div>`;
  }
  function openArticle(id){ L.open = id; const h = ov(); h.hidden = false; document.body.classList.add("ov-open"); renderArticle(); h.querySelector(".ov-body").scrollTop = 0; requestAnimationFrame(() => h.classList.add("on")); }
  function closeArticle(){ const h = ov(); if (!h || h.hidden) return; h.classList.remove("on"); h.hidden = true; L.open = null; if (document.getElementById("v-detail").hidden) document.body.classList.remove("ov-open"); }
  document.addEventListener("input", e => { if (e.target.id === "learnQ") { L.q = e.target.value; B.renderLearn(); } });
  document.addEventListener("click", async e => {
    const a = e.target.closest("[data-act]"); if (!a) return; const A = B.app, act = a.dataset.act; if (!A) return;
    if (act === "article") { openArticle(a.dataset.id); return; }
    if (!act.startsWith("l-")) return;
    if (act === "l-back") return closeArticle();
    if (act === "l-cat") { L.cat = a.dataset.c; L.saved = false; }
    else if (act === "l-saved") { L.saved = !L.saved; L.cat = ""; }
    else if (act === "l-save") {
      const cur = savedList(A), id = L.open, next = cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id];
      try { await A.store.put("prefs", {...(A.S.prefs || {}), kind:"prefs", schema:2, savedArticles:next}); } catch(err){ try { localStorage.setItem("bs_saved", JSON.stringify(next)); } catch(e2){} }
      if (A.S.prefs) A.S.prefs.savedArticles = next; A.haptic(8); A.toast(next.includes(id) ? "Cikk mentve" : "Mentés visszavonva"); renderArticle(); B.renderLearn(); return;
    }
    B.renderLearn();
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && L.open && !document.querySelector("#modal.on")) closeArticle(); });
  B.closeArticle = closeArticle;
})();
