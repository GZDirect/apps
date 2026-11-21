/* GENERÁLT FÁJL – ne szerkeszd. Forrás: js/portfolio.js, szótár: tools/i18n/en.json, eszköz: tools/i18n/build-en.js */
/* PHILORA – Portfólió: pénzügyi áttekintő. Értékgörbe csak valós (vagy demó módban jelölt szimulált) történeti pontokból. */
(() => {
  const B = window.BS;
  const P = {range:"all"};
  const RANGES = [["1m","1 mo",30],["3m","3 mo",91],["1y","1 yr",365],["all","All",0]];
  const DAY = 864e5;
  function events(A, items){
    const ev = [], byDay = {};
    for (const i of items) {
      const d = new Date(i.createdAt || 0).toISOString().slice(0, 10);
      (byDay[d] = byDay[d] || {t:i.createdAt, n:0, v:0}); byDay[d].n++; byDay[d].v += i.first ?? A.mid(i);
      const E = i.ertekelesek || [];
      for (let k = 1; k < E.length; k++) { const dv = A.mid(E[k]) - A.mid(E[k - 1]); if (Math.abs(dv) > 1e-6) ev.push({t:E[k].t, type:"reval", v:dv, name:i.result?.nev || "Stamp", why:E[k].indok || "", id:i.id}); }
    }
    for (const x of Object.values(byDay)) ev.push({t:x.t, type:"grow", v:x.v, n:x.n});
    return ev.sort((a, b) => b.t - a.t).slice(0, 16);
  }
  function chart(A, pf){
    const r = RANGES.find(x => x[0] === P.range), since = r[2] ? Date.now() - r[2] * DAY : 0;
    const pts = (A.S.hist.points || []).filter(p => p.t >= since).map(p => ({t:p.t, v: pf === "all" ? p.all : (p.pf?.[pf] || 0)}));
    const sel = `<div class="rsel" role="radiogroup" aria-label="Period">${RANGES.map(([k, l]) => `<button data-act="p-range" data-r="${k}" class="${P.range === k ? "on" : ""}" role="radio" aria-checked="${P.range === k}">${l}</button>`).join("")}</div>`;
    if (pts.length < 2) return `${sel}<div class="note">The value curve is drawn from real data points after saves and price updates${pts.length ? " – there is only 1 point in this period so far" : ""}.</div>`;
    return `${sel}${chartHTML(A, pts)}<div class="ax"><span>${new Date(pts[0].t).toLocaleDateString(window.BS.LOC)}</span><span>${pts.length} data points · touch the curve</span><span>${new Date(pts[pts.length - 1].t).toLocaleDateString(window.BS.LOC)}</span></div>`;
  }
  /* Érintésre / billentyűre dátumot és pontos értéket mutató görbe. */
  function chartHTML(A, pts){
    const w = 320, h = 72, vs = pts.map(p => p.v), mn = Math.min(...vs), mx = Math.max(...vs), sp = (mx - mn) || 1, n = pts.length;
    const P = pts.map((p, i) => [i / (n - 1) * w, h - 8 - (p.v - mn) / sp * (h - 18)]);
    const line = P.map((q, i) => (i ? "L" : "M") + q[0].toFixed(1) + " " + q[1].toFixed(1)).join(" ");
    const last = pts[n - 1];
    return `<div class="chart" tabindex="0" role="group" aria-label="Value curve, ${n} data points. Touch it, or step between points with the arrow keys." data-pts='${JSON.stringify(pts.map((p, i) => [p.t, +p.v.toFixed(4), +(P[i][1] / h * 100).toFixed(2)]))}'>
      <svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="pfg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C5A46D" stop-opacity=".38"/><stop offset="1" stop-color="#C5A46D" stop-opacity="0"/></linearGradient></defs><path d="${line} L${w} ${h} L0 ${h}Z" fill="url(#pfg)"/><path d="${line}" fill="none" style="stroke:var(--hero-accent)" stroke-width="2.2" vector-effect="non-scaling-stroke" stroke-linejoin="round"/><line class="cx" x1="${w}" x2="${w}" y1="0" y2="${h}" vector-effect="non-scaling-stroke"/></svg>
      <span class="cdot" style="left:100%;top:${(P[n - 1][1] / h * 100).toFixed(2)}%"></span>
      <div class="ctip" aria-live="polite"><b>${A.fmt(last.v)}</b><span>${new Date(last.t).toLocaleDateString(window.BS.LOC)}</span></div></div>`;
  }
  function chartAt(el, i){
    const A = B.app, d = JSON.parse(el.dataset.pts), n = d.length; i = Math.max(0, Math.min(n - 1, i)); el.dataset.i = i;
    const x = n > 1 ? i / (n - 1) * 100 : 100, [t, v, y] = d[i];
    el.querySelector(".cx").setAttribute("x1", x * 3.2); el.querySelector(".cx").setAttribute("x2", x * 3.2);
    const dot = el.querySelector(".cdot"); dot.style.left = x + "%"; dot.style.top = y + "%";
    const tip = el.querySelector(".ctip"); tip.innerHTML = `<b>${A.fmt(v)}</b><span>${new Date(t).toLocaleDateString(window.BS.LOC, {year:"numeric", month:"long", day:"numeric"})}</span>`;
    /* a buborék mindig a grafikonon belül marad (keskeny kijelzőn és nagy betűnél is) */
    const cw = el.clientWidth, tw = tip.offsetWidth; tip.style.right = "auto"; tip.style.left = Math.max(0, Math.min(cw - tw, x / 100 * cw - tw / 2)) + "px";
  }
  const chartEv = e => { const el = e.target.closest?.(".chart"); if (!el) return; const r = el.getBoundingClientRect(), n = JSON.parse(el.dataset.pts).length; chartAt(el, Math.round((e.clientX - r.left) / r.width * (n - 1))); };
  document.addEventListener("pointerdown", chartEv); document.addEventListener("pointermove", e => { if (e.buttons || e.pointerType === "mouse") chartEv(e); });
  document.addEventListener("keydown", e => { const el = e.target.closest?.(".chart"); if (!el || !["ArrowLeft","ArrowRight","Home","End"].includes(e.key)) return; e.preventDefault(); const n = JSON.parse(el.dataset.pts).length, i = el.dataset.i != null ? +el.dataset.i : n - 1; chartAt(el, e.key === "Home" ? 0 : e.key === "End" ? n - 1 : i + (e.key === "ArrowLeft" ? -1 : 1)); });
  /* Országmegoszlás: egész százalékok a legnagyobb maradék módszerével – az összeg mindig pontosan 100%. */
  function countries(A, items, tot, u){
    const m = {}; for (const i of items) { const c = (i.result?.orszag || "unknown").trim(); m[c] = (m[c] || 0) + A.mid(i); }
    let L = Object.entries(m).sort((a, b) => b[1] - a[1]); if (L.length > 6) { const rest = L.slice(5).reduce((s, x) => s + x[1], 0); L = [...L.slice(0, 5), ["other", rest]]; }
    const raw = L.map(([, v]) => tot ? v / tot * 100 : 0), fl = raw.map(Math.floor); let left = tot ? 100 - fl.reduce((a, b) => a + b, 0) : 0;
    raw.map((r, i) => [r - fl[i], i]).sort((a, b) => b[0] - a[0]).forEach(([, i]) => { if (left > 0) { fl[i]++; left--; } });
    return L.map(([c, v], i) => `<div class="bar" data-pct="${fl[i]}"><div class="bar-l"><span>${A.esc(c)}</span><span>${A.fmtU(v, u)} · ${fl[i]}%</span></div><div class="bar-t"><i style="width:${Math.max(2, raw[i])}%"></i></div></div>`).join("");
  }
  B.renderPortfolio = () => {
    const A = B.app, el = document.getElementById("pfWrap"); if (!A || !el) return;
    const S = A.S, pf = S.activePf, items = A.pfItems(pf), R = A.gRate(), ic = A.ic, esc = A.esc;
    const lo = items.reduce((s, i) => s + (+i.min || 0), 0), hi = items.reduce((s, i) => s + (+i.max || 0), 0), tot = items.reduce((s, i) => s + A.mid(i), 0);
    const grow = items.reduce((s, i) => s + (i.first ?? A.mid(i)), 0);
    /* közös kerekítési egység; az átértékelés a kerekített összérték és bővülés különbsége, így a kijelzett számok összeadhatók */
    const u = A.groupUnit(tot, lo, hi, grow), totD = A.roundDisp(tot, u), growD = A.roundDisp(grow, u), revalD = +(totD - growD).toFixed(2), reval = revalD, pct = growD ? revalD / growD * 100 : 0;
    const priced = items.filter(i => (+i.max || 0) > 0).length, cov = items.length ? Math.round(priced / items.length * 100) : 0;
    const lastRef = S.hist.lastRefresh || 0, stale = items.length && Date.now() - lastRef > 7 * DAY;
    const chips = `<div class="pfchips">${[{id:"all", name:"All"}, ...A.pfList()].map(p => `<button data-act="pf" data-pf="${esc(p.id)}" class="${p.id === pf ? "on" : ""}">${esc(p.name)} <span class="n">${A.pfItems(p.id).length}</span></button>`).join("")}<button class="add" data-act="newpf">+ New portfolio</button></div>`;
    const hero = `<div class="hero">
      <div class="top"><span class="nm">${esc(A.pfName(pf))}</span>${!["all","default"].includes(pf) ? `<button class="iconbtn" data-act="pfmenu" aria-label="Portfolio settings">${ic("more", 20)}</button>` : ""}</div>
      <div style="margin-top:6px"><span class="est-tag">Preliminary AI estimate</span><span class="cov">${priced}/${items.length} items priced</span></div>
      <div class="tot" data-v="${totD}">${items.length ? A.fmtDisp(totD, u) : "–"}</div>
      ${items.length ? `<div class="rng">Value range: ${A.fmtU(lo, u)} – ${A.fmtU(hi, u)}</div>
      <div class="split"><div><small>Growth</small><b data-v="${growD}">${A.fmtDisp(growD, u)}</b><span>${items.length} items, value when added</span></div><div><small>Revaluation</small><b class="${reval >= 0 ? "up" : "down"}" data-v="${revalD}">${A.fmtSigned(revalD, u)}</b><span>${Math.abs(pct) < .05 ? "no change" : A.pctFmt(pct, true)} from AI re-estimates</span></div></div>` : `<div class="chg">No stamps in this portfolio yet</div>`}
      ${items.length ? chart(A, pf) : ""}
      <div class="meta"><span>Price update: ${A.daysAgo(lastRef)}${stale ? " · due" : ""}</span><button class="btn small light" data-act="refresh" ${S.refreshing || !items.length ? "disabled" : ""}>${S.refreshing ? `<span class="spin sm"></span> Updating…` : ic("refresh", 16) + " Update prices"}</button></div>
    </div>`;
    if (!items.length) { el.innerHTML = `<h2 class="page-title">Portfolio</h2>` + chips + hero + (S.note ? `<div class="disc">${esc(S.note)}</div>` : "") + `<div class="empty-state">${ic("chart", 30)}<b>Empty portfolio</b><span>Scan a stamp, or move items here from your collection.</span><button class="btn primary small" data-act="goscan-single">${ic("camera", 16)} Scan</button></div>`; return; }
    const keys = [...new Set(items.filter(i => i.seriesKey && (S.series[i.seriesKey]?.tagok || []).length && S.series[i.seriesKey].allapot !== "elutasitva").map(i => i.seriesKey))];
    const sInfo = keys.map(k => { const s = S.series[k], n = s.tagok.length, own = A.ownedMap(k, items, n); return {k, s, n, own, ratio: own.size / n}; }).sort((a, b) => (b.ratio === 1) - (a.ratio === 1) || b.ratio - a.ratio);
    const done = sInfo.filter(x => x.ratio === 1).length, nC = new Set(items.map(i => (i.result?.orszag || "").trim()).filter(Boolean)).size;
    const top = [...items].sort((a, b) => A.mid(b) - A.mid(a)).slice(0, 6);
    const bought = items.filter(i => i.peldany?.beszerzes?.ar), paid = bought.reduce((s, i) => s + +i.peldany.beszerzes.ar, 0), bVal = bought.reduce((s, i) => s + A.mid(i) * A.rate(), 0);
    const EV = events(A, items);
    el.innerHTML = `<h2 class="page-title">Portfolio</h2>` + chips + hero + (S.note ? `<div class="disc">${esc(S.note)}</div>` : "") + `
      <div class="stats">
        <div class="stat"><b>${items.length}</b><span>stamps</span></div>
        <div class="stat"><b>${cov}%</b><span>priced</span></div>
        <div class="stat"><b>${nC}</b><span>countries</span></div>
        <div class="stat"><b>${done}/${sInfo.length}</b><span>complete sets</span></div>
      </div>
      <div class="card"><h3 class="sec-t">Purchase price</h3>${bought.length ? `<dl class="facts"><dt>Purchased items</dt><dd>${bought.length} pcs</dd><dt>Spent</dt><dd>${A.hufFmt(paid)}</dd><dt>Estimated value now</dt><dd>${A.hufFmt(Math.round(bVal / 10) * 10)} <span class="st st-ai">AI estimate</span></dd><dt>Difference</dt><dd style="font-weight:700;color:${bVal - paid >= 0 ? "var(--c-ok)" : "var(--c-danger)"}">${bVal - paid >= 0 ? "+" : "−"}${A.hufFmt(Math.abs(Math.round(bVal / 10) * 10 - paid))}</dd></dl>` : `<p class="muted" style="font-size:0.84rem;margin:4px 0 0">No item has a purchase price yet. Record one with “Enter purchase” on the details page.</p>`}</div>
      <details class="acc" data-acc="top" ${PFO.has("top") ? "open" : ""}><summary><span class="acc-ic">${ic("trophy", 18)}</span><span class="acc-t">Most valuable items (Top ${top.length})</span><span class="acc-ch" aria-hidden="true">${ic("chevron", 16)}</span></summary><div class="acc-b">
      <div class="hscroll">${top.map((i, n) => `<button class="topc" data-act="item" data-id="${esc(i.id)}"><div class="rank">#${n + 1}</div><div class="stamp">${A.thumbHTML(i.photo || i.thumb)}</div><div class="n">${esc(i.result?.nev || "Stamp")}</div><div class="p">${A.fmt(A.mid(i), i.result)}</div></button>`).join("")}</div>
      </div></details>
      <details class="acc" data-acc="countries" ${PFO.has("countries") ? "open" : ""}><summary><span class="acc-ic">${ic("globe", 18)}</span><span class="acc-t">Breakdown by country</span><span class="acc-ch" aria-hidden="true">${ic("chevron", 16)}</span></summary><div class="acc-b"><div class="card">${countries(A, items, tot, u)}</div><button class="btn ghost small" data-act="at-open" style="margin-top:10px">${ic("globe", 16)} Open in world atlas</button></div></details>
      ${sInfo.length ? `<div class="sec-h"><h3>Series</h3><span class="muted">${done}/${sInfo.length} complete</span></div>${sInfo.map(x => A.seriesCardHTML(x.k, x.s, x.own)).join("")}` : ""}
      <details class="acc" data-acc="log" ${PFO.has("log") ? "open" : ""}><summary><span class="acc-ic">${ic("clock", 18)}</span><span class="acc-t">Value log</span><span class="acc-ch" aria-hidden="true">${ic("chevron", 16)}</span></summary><div class="acc-b"><div class="card">${EV.map(e => e.type === "grow"
        ? `<div class="log"><span class="li g">${ic("plus", 14)}</span><div><b>Growth</b><small>${new Date(e.t).toLocaleDateString(window.BS.LOC)} · ${e.n} item(s) added</small></div><span class="lv">+${A.fmt(e.v, R)}</span></div>`
        : `<button class="log" data-act="item" data-id="${esc(e.id)}"><span class="li ${e.v >= 0 ? "g" : "r"}">${ic("refresh", 14)}</span><div><b>Revaluation – ${esc(e.name)}</b><small>${new Date(e.t).toLocaleDateString(window.BS.LOC)}${e.why ? " · " + esc(e.why) : ""}</small></div><span class="lv ${e.v >= 0 ? "up2" : "down2"}">${e.v >= 0 ? "+" : "−"}${A.fmt(Math.abs(e.v), R)}</span></button>`).join("")}</div></div></details>
      <div class="sec-h"><h3>Items</h3><button class="linkbtn" data-act="goview" data-v="coll">In collection ${ic("chevron", 14)}</button></div>
      ${[...items].sort((a, b) => A.mid(b) - A.mid(a)).slice(0, 12).map(i => `<button class="item" data-act="item" data-id="${esc(i.id)}"><div class="stamp sm">${A.thumbHTML(i.thumb || i.photo)}</div><div style="min-width:0;text-align:left"><div class="t">${esc(i.result?.nev || "Stamp")}</div><div class="s">${esc([i.result?.orszag, i.result?.kiadas_eve].filter(Boolean).join(" · "))}</div><div class="s">${esc(A.condL(i.cond))} · ${esc(A.gradeL(i.grade))}</div></div><div class="v">${A.fmt(A.mid(i), i.result)}</div></button>`).join("")}
      <details class="acc" data-acc="export" ${PFO.has("export") ? "open" : ""}><summary><span class="acc-ic">${ic("download", 18)}</span><span class="acc-t">Export (CSV / printable report)</span><span class="acc-ch" aria-hidden="true">${ic("chevron", 16)}</span></summary><div class="acc-b">
      <div class="row"><button class="btn ghost" data-act="p-csv">${ic("download", 18)} CSV (Excel)</button><button class="btn ghost" data-act="p-report">${ic("download", 18)} Printable report</button></div>
      <div class="disc">The report is an HTML file: save it as PDF with your browser’s “Print → Save as PDF”. Every value is a preliminary AI estimate without live market data.</div></div></details>
      <button class="acc acc-link" data-act="hr-open"><span class="acc-ic">${ic("book", 18)}</span><span class="acc-t">Heritage – inventory and provenance<small>Estate inventory, certificates, documents, message to heirs</small></span><span class="acc-ch" aria-hidden="true">${ic("chevron", 16)}</span></button>`;
  };
  /* A nyitható sorok állapota a munkamenetben megmarad (újrarajzoláskor nem csukódnak össze). */
  const PFO = new Set(["top"]);
  document.addEventListener("toggle", e => { const d = e.target; if (d.matches?.("details.acc[data-acc]")) d.open ? PFO.add(d.dataset.acc) : PFO.delete(d.dataset.acc); }, true);
  const csvCell = v => { const s = String(v ?? ""); return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  function rows(A, items){
    return items.map(i => { const r = i.result || {}, rt = A.rate(), ev = (i.ertekelesek || []).slice(-1)[0] || {}, alb = A.S.albums.find(a => a.id === i.peldany?.album);
      return [i.peldany?.kod, r.nev, r.orszag, r.kiadas_eve, r.nevertek, r.sorozat, A.condL(i.cond), i.grade, Math.round(i.min * rt), Math.round(i.max * rt), "Preliminary AI estimate – " + (A.METHOD_L[ev.modszer] || "AI"), ev.t ? new Date(ev.t).toISOString().slice(0, 10) : "", i.azonositas?.megerositve ? "yes" : "no", r.katalogus?.mbk, r.katalogus?.michel, i.peldany?.beszerzes?.ar || "", i.peldany?.beszerzes?.datum || "", alb?.name || "", i.peldany?.hely || "", A.pfName(i.pf), i.peldany?.tipus || "gyujtemeny"]; });
  }
  const HEAD = ["Code","Name","Country","Year of issue","Face value","Series","Condition","Grade","Estimate min (Ft)","Estimate max (Ft)","Estimate method","Last valuation","Confirmed","MBK","Michel","Purchase price (Ft)","Purchase date","Album","Album location","Portfolio","Copy type"];
  async function save(A, name, data){
    if (A.store.mode === "demo") return A.toast("No export in demo mode – demo data cannot go into a live file.");
    let dl = null; try { dl = window.claude?.use ? await window.claude.use("downloads") : null; } catch(e){}
    if (!dl) return A.toast("Saving files is not available in this view – open the app on claude.ai.");
    try { await dl.save({filename:name, data}); A.toast("File saved"); } catch(e){ A.toast(e?.code === "declined" ? "Saving cancelled." : "Saving failed."); }
  }
  document.addEventListener("click", async e => {
    const a = e.target.closest("[data-act]"); if (!a) return; const A = B.app, act = a.dataset.act; if (!A) return;
    if (act === "p-range") { P.range = a.dataset.r; B.renderPortfolio(); }
    else if (act === "p-csv" || act === "p-report") {
      const items = A.pfItems(A.S.activePf), d = new Date().toISOString().slice(0, 10), R = rows(A, items);
      if (act === "p-csv") return save(A, `${B.BRAND.filePrefix}-portfolio-${d}.csv`, new Blob(["﻿" + [HEAD, ...R].map(r => r.map(csvCell).join(";")).join("\r\n")], {type:"text/csv"}));
      const tot = items.reduce((s, i) => s + A.mid(i), 0), R0 = A.gRate();
      const html = `<!DOCTYPE html><html lang="${window.BS.lang}"><head><meta charset="utf-8"><title>${B.BRAND.name} portfolio report ${d}</title><style>body{font:12px/1.4 Arial,sans-serif;color:#242A27;margin:24px}h1{font:700 22px Georgia,serif;color:#10382F;margin:0}table{border-collapse:collapse;width:100%;margin-top:14px}th,td{border-bottom:1px solid #ddd;padding:5px 6px;text-align:left}th{background:#F5F0E5}.n{text-align:right}.tag{display:inline-block;border:1px solid #C5A46D;color:#7A5E2A;padding:1px 6px;border-radius:8px;font-size:10px;font-weight:700}</style></head><body>
        <h1>${B.BRAND.name} – portfolio report</h1><p>${A.esc(A.pfName(A.S.activePf))} · ${d} · ${items.length} items · estimated value: <b>${A.fmt(tot, R0)}</b> <span class="tag">PRELIMINARY AI ESTIMATE</span></p>
        <table><thead><tr>${["Code","Name","Country","Year","Condition","Estimate (Ft)","Confirmed","Purchase (Ft)"].map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${R.map(r => `<tr><td>${A.esc(r[0])}</td><td>${A.esc(r[1])}</td><td>${A.esc(r[2])}</td><td>${A.esc(r[3])}</td><td>${A.esc(r[6])} ${A.esc(r[7])}</td><td class="n">${Number(r[8]).toLocaleString(window.BS.LOC)} – ${Number(r[9]).toLocaleString(window.BS.LOC)}</td><td>${r[12]}</td><td class="n">${r[15] ? Number(r[15]).toLocaleString(window.BS.LOC) : ""}</td></tr>`).join("")}</tbody></table>
        <p style="margin-top:16px;color:#5A665D">Every value is a preliminary AI estimate from the photos, without a live market or auction source. For valuable items, ask an expert.</p></body></html>`;
      return save(A, `${B.BRAND.filePrefix}-jelentes-${d}.html`, new Blob([html], {type:"text/html"}));
    }
  });
})();
