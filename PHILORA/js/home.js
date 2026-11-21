/* PHILORA – Kezdőlap. Csak valós (vagy demó módban jelölt szimulált) adatot mutat; értékgörbét nem rajzol kitalált adatból. */
(() => {
  const B = window.BS;
  function greet(){ const h = new Date().getHours(); return h < 9 ? "Jó reggelt" : h < 18 ? "Jó napot" : "Jó estét"; }
  function seriesProgress(A){
    const out = [];
    for (const [k, s] of Object.entries(A.S.series)) {
      if (s.allapot === "elutasitva") continue; const n = (s.tagok || []).length; if (!n) continue;
      const own = A.ownedMap(k, A.S.items, n).size; if (own > 0 && own < n && own / n >= .5) out.push({k, s, n, own});
    }
    return out.sort((a, b) => b.own / b.n - a.own / a.n).slice(0, 3);
  }
  function articleOfDay(){ const a = B.ARTICLES || []; return a[(Math.floor(Date.now() / 864e5)) % a.length]; }
  B.renderHome = () => {
    const A = B.app, el = document.getElementById("homeWrap"); if (!A || !el) return;
    const S = A.S, items = S.items, R = A.gRate(), ic = A.ic, esc = A.esc;
    const demo = A.store.mode === "demo";
    if (!items.length) {
      el.innerHTML = `<div class="welcome">
        ${B.brandImg("empty.collection", B.art.empty())}
        <h2>Üdvözöl a ${esc(B.BRAND.name)}</h2><p class="slogan">${esc(B.slogan())}</p>
        <p>Fotózd le az első bélyegedet – a program felismeri, megbecsüli az állapotát és az értékét, és elindítja a digitális gyűjteményedet.</p>
        <button class="btn primary" data-act="goscan-single">${ic("camera", 20)} Első bélyeg szkennelése</button>
        <button class="btn ghost" data-act="goscan-page" style="margin-top:10px">${ic("album", 20)} Teljes albumoldal</button>
        <button class="linkbtn" data-act="demo-enter" style="margin-top:14px">Csak körülnéznék – demó mód kipróbálása</button>
        ${S.note && A.store.mode === "pending" ? `<div class="disc">${esc(S.note)}</div>` : ""}
      </div>`;
      return;
    }
    const lo = items.reduce((s, i) => s + (+i.min || 0), 0), hi = items.reduce((s, i) => s + (+i.max || 0), 0), midV = (lo + hi) / 2;
    const priced = items.filter(i => (+i.max || 0) > 0).length, conf = items.filter(i => i.azonositas?.megerositve).length;
    const countries = new Set(items.map(i => (i.result?.orszag || "").trim()).filter(Boolean)).size;
    const nSeries = Object.entries(S.series).filter(([k, s]) => s.allapot !== "elutasitva" && items.some(i => i.seriesKey === k)).length;
    const recent = items.slice(0, 8), near = seriesProgress(A), art = articleOfDay();
    const cov = items.length ? Math.round(priced / items.length * 100) : 0;
    /* Átértékelés a felvétel óta (valós adat: első becslés vs. jelenlegi) – csak ha van eltérés. */
    const firstSum = items.reduce((s, i) => s + (i.first ?? A.mid(i)), 0), uH = A.groupUnit(midV, lo, hi, firstSum);
    const totD = A.roundDisp(midV, uH), revD = +(totD - A.roundDisp(firstSum, uH)).toFixed(2), revPct = firstSum ? revD / A.roundDisp(firstSum, uH) * 100 : 0;
    el.innerHTML = `
      <p class="hc-greet">${greet()}${demo ? " · demó gyűjtemény" : ""}</p>
      <section class="hc" aria-labelledby="hcT">
        <div class="hc-top"><span class="hc-ic">${ic("album", 18)}</span><h2 id="hcT">Gyűjteményem</h2>${demo ? `<span class="hc-demo">DEMÓ</span>` : ""}</div>
        <div class="hc-lbl">Becsült érték</div>
        <div class="hc-row"><div class="hc-val">${A.fmtU(midV, uH)}</div>${Math.abs(revPct) >= 0.05 ? `<span class="hc-pill ${revD < 0 ? "neg" : ""}" title="Átértékelés a felvétel óta">${revD < 0 ? "▼" : "▲"} ${A.pctFmt(revPct, true)}</span>` : ""}</div>
        <div class="hc-rng">Tartomány: ${A.fmtU(lo, uH)} – ${A.fmtU(hi, uH)}</div>
        <span class="est-tag">Előzetes AI-becslés</span>
        <div class="hc-stats">
          <div><span>${ic("stamp", 20)}</span><b>${items.length}</b><small>bélyeg</small></div>
          <div><span>${ic("globe", 20)}</span><b>${countries}</b><small>ország</small></div>
          <div><span>${ic("layers", 20)}</span><b>${nSeries}</b><small>sorozat</small></div>
        </div>
      </section>
      <div class="hc-actions">
        <button class="hc-act gold" data-act="goscan-single"><span>${ic("camera", 26)}</span><b>Egy bélyeg szkennelése</b></button>
        <button class="hc-act green" data-act="goscan-page"><span>${ic("grid", 26)}</span><b>Albumoldal beolvasása</b></button>
      </div>
      <button class="atl-entry" data-act="at-open"><span class="atl-e-ic">${ic("globe", 26)}</span><span class="atl-e-t"><b>Világatlasz</b><small>${countries} ország · bélyegek kibocsátók szerint</small></span>${ic("chevron", 18)}</button>
      <div class="card cov-card">
        <div class="cov-top"><b>Értékelési lefedettség</b><span>${priced}/${items.length} példány árazott · ${conf} megerősített</span></div>
        <div class="prog" role="progressbar" aria-valuenow="${cov}" aria-valuemin="0" aria-valuemax="100" aria-label="Értékelési lefedettség"><i style="width:${cov}%"></i></div>
      </div>
      <div class="sec-h"><h3>Legutóbbi darabok</h3><button class="linkbtn" data-act="goview" data-v="coll">Összes ${ic("chevron", 14)}</button></div>
      <div class="hscroll">${recent.map(i => `<button class="topc" data-act="item" data-id="${esc(i.id)}"><div class="stamp">${A.thumbHTML(i.photo || i.thumb)}</div><div class="n">${esc(i.result?.nev || "Bélyeg")}</div><div class="p">${(+i.max || 0) > 0 ? A.fmt(A.mid(i), i.result) : "nincs becslés"}</div></button>`).join("")}</div>
      ${near.length ? `<div class="sec-h"><h3>Majdnem teljes sorozatok</h3></div>${near.map(x => `<button class="near" data-act="goview" data-v="coll" data-series="${esc(x.k)}"><div class="near-t"><b>${esc(x.s.cim)}</b><span>${x.own}/${x.n} · még ${x.n - x.own} hiányzik</span></div><div class="prog"><i style="width:${Math.round(x.own / x.n * 100)}%"></i></div></button>`).join("")}` : ""}
      ${art ? `<div class="sec-h"><h3>A Tudástárból</h3><button class="linkbtn" data-act="goview" data-v="learn">Tovább ${ic("chevron", 14)}</button></div>
      <button class="art-card wide" data-act="article" data-id="${esc(art.id)}">${B.brandImg("articleCovers." + art.cat, B.art.cover(art.cat, 130), 'class="cover-img"')}<div class="ac-in"><span class="ac-cat">${esc((B.CATS.find(c => c.k === art.cat) || {}).l || "")}</span><b>${esc(art.t)}</b><small>${esc(art.lead)}</small></div></button>` : ""}
      <div class="disc">Az értékek előzetes AI-becslések, élő piaci adat nélkül.${demo ? " Demó módban minden adat szimulált." : ""}</div>`;
  };
})();
