/* PHILORA komponensgaléria – #komponensek. Minden adat MINTA, nem valós katalógus- vagy piaci adat. */
(() => {
  const PALETTE = [
    ["Erdőzöld", "#10382F", "alap (sötét téma), kiemelés", "#F5F0E5"],
    ["Antik arany", "#C5A46D", "elsődleges gomb, keret, díj", "#242A27"],
    ["Elefántcsont", "#F5F0E5", "kártyák, lapok", "#242A27"],
    ["Grafit", "#242A27", "szöveg világos felületen", "#F5F0E5"],
    ["Zsályazöld", "#7F9B8E", "dekor, ikonháttér", "#242A27"],
    ["Sötét arany", "#7A5E2A", "arany szöveg világos alapon", "#F5F0E5"],
    ["Erdőzöld 800", "#16483B", "emelt sötét felület", "#F5F0E5"],
    ["Erdőzöld 700", "#22584A", "másodlagos felület", "#F5F0E5"],
    ["Világos arany", "#E0C48E", "arany szöveg sötét alapon", "#10382F"],
    ["Papír", "#E9E0CE", "másodlagos kártya", "#242A27"],
    ["Siker", "#4B9772", "ikon, keret (szövegnek #2F6E50)", "#000000"],
    ["Figyelmeztetés", "#A46C24", "ikon, keret (szövegnek #7A4E12)", "#000000"],
    ["Hiba", "#B54E4A", "ikon, keret (szövegnek #963A36)", "#FFFFFF"]
  ];
  const PAIRS = [
    ["Szöveg az alapon", "--on-bg", "--bg"], ["Halvány szöveg az alapon", "--on-bg-2", "--bg"], ["Arany szöveg az alapon", "--on-bg-accent", "--bg"],
    ["Szöveg kártyán", "--ink", "--surface"], ["Halvány szöveg kártyán", "--ink-2", "--surface"], ["Arany szöveg kártyán", "--ink-accent", "--surface"],
    ["Szöveg kiemelt kártyán", "--hero-ink", "--hero"], ["Halvány szöveg kiemelt kártyán", "--hero-ink-2", "--hero"], ["Arany szöveg kiemelt kártyán", "--hero-accent", "--hero"],
    ["Elsődleges gomb", "--primary-ink", "--primary"], ["Navigáció (inaktív)", "--nav-ink", "--nav-bg"], ["Navigáció (aktív)", "--nav-active", "--nav-bg"],
    ["Figyelmeztetés", "--c-warn", "--c-warn-bg"], ["Siker", "--c-ok", "--c-ok-bg"], ["Hiba", "--c-danger", "--c-danger-bg"]
  ];
  const hexOf = v => { const c = document.createElement("canvas").getContext("2d"); c.fillStyle = v.trim(); return c.fillStyle; };
  const lum = h => { const n = h.replace("#", ""); return [0, 2, 4].map(i => parseInt(n.slice(i, i + 2), 16) / 255).map(c => c <= .03928 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4).reduce((a, c, i) => a + c * [.2126, .7152, .0722][i], 0); };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + .05) / (y + .05); };
  const cssVar = n => hexOf(getComputedStyle(document.documentElement).getPropertyValue(n));

  function render(){
    const A = window.BS.app, ic = window.BS.ic, el = document.getElementById("designWrap"); if (!A || !el) return;
    const R = {eur_huf: 395}, demoThumb = "";
    const demoSeries = {cim: "Minta sorozat", orszag: "Minta ország", ev: "1900", allapot: "megerositett",
      tagok: [{nevertek: "10 f", ar: {pecsetelt: {min: .5, max: 1}}}, {nevertek: "20 f", ar: {pecsetelt: {min: .5, max: 1}}}, {nevertek: "50 f", ar: {pecsetelt: {min: 1, max: 2}}}, {nevertek: "1 Ft", ar: {pecsetelt: {min: 2, max: 3}}}],
      teljes_sor: {pecsetelt: {min: 5, max: 8}}};
    const own = new Map([[0, {thumb: demoThumb, cond: "pecsetelt"}], [1, {thumb: demoThumb, cond: "pecsetelt"}]]);
    const full = new Map([0, 1, 2, 3].map(i => [i, {thumb: demoThumb, cond: "pecsetelt"}]));
    const theme = document.documentElement.getAttribute("data-theme");
    const rows = PAIRS.map(([l, f, b]) => { const bh = cssVar(b); const r = ratio(cssVar(f), bh); return `<tr><td>${l}</td><td><span style="display:inline-block;width:14px;height:14px;border-radius:3px;background:${bh};border:1px solid #0002;vertical-align:-2px"></span> <span style="color:${cssVar(f)};background:${bh};padding:1px 6px;border-radius:4px">Aa</span></td><td class="${r >= 4.5 ? "" : "bad"}">${r.toFixed(2)}:1 ${r >= 4.5 ? "✓" : "✗"}</td></tr>`; }).join("");
    el.innerHTML = `
      <h2 class="page-title">Dizájnrendszer</h2>
      <p class="muted" style="margin:-6px 2px 8px;font-size:0.8438rem">Heritage Luxury · ${window.BS.BRAND.name} · aktuális téma: <b>${theme === "light" ? "világos" : "sötét"}</b>. A mintákban szereplő bélyegadatok és árak illusztrációk.</p>
      <div class="seg" style="margin-bottom:6px"><button data-act="theme-demo" data-t="dark" class="${theme !== "light" ? "on" : ""}">Sötét téma</button><button data-act="theme-demo" data-t="light" class="${theme === "light" ? "on" : ""}">Világos téma</button></div>

      <div class="sec-h"><h3>Színpaletta</h3></div>
      <div class="swatches">${PALETTE.map(([n, h, u, t]) => `<div class="sw" style="background:${h};color:${t}"><b>${n}</b>${h}<br>${u}</div>`).join("")}</div>

      <div class="sec-h"><h3>Kontraszt (mért)</h3><span class="muted">WCAG AA: legalább 4,5:1</span></div>
      <div class="card"><table class="pr" id="contrastTable"><tbody>${rows}</tbody></table></div>

      <div class="sec-h"><h3>Tipográfia</h3></div>
      <div class="card">
        <div style="font:700 2.375rem/1.05 var(--font-display)">Cormorant Garamond 38</div>
        <div style="font:700 1.75rem/1.1 var(--font-display);margin-top:6px">Címsor 28 · sorozatnév</div>
        <div style="font:700 1.1875rem/1.2 var(--font-display);margin-top:6px">Kártyacím 19</div>
        <div style="font:400 0.9375rem/1.45 var(--font-ui);margin-top:10px">Inter 15 – kezelőfelület, folyószöveg, gombok.</div>
        <div class="muted" style="font:400 0.8125rem var(--font-ui)">Inter 13 – másodlagos szöveg, magyarázat.</div>
        <div style="font:600 0.7188rem var(--font-ui);letter-spacing:.06em;text-transform:uppercase;color:var(--ink-accent);margin-top:4px">Inter 11,5 – címke</div>
      </div>

      <div class="sec-h"><h3>Gombok</h3><span class="muted">érintési felület ≥ 44 px</span></div>
      <div class="card">
        <button class="btn primary">${ic("camera", 18)} Elsődleges gomb</button>
        <div class="row" style="margin-top:10px"><button class="btn ghost">Másodlagos</button><button class="btn danger">${ic("trash", 18)} Törlés</button></div>
        <div class="row" style="margin-top:10px;align-items:center"><button class="btn primary small" style="flex:0 0 auto">Kicsi</button><button class="btn ghost small" style="flex:0 0 auto">${ic("edit", 16)} Szerkesztés</button><button class="btn primary" disabled>Letiltva</button></div>
      </div>

      <div class="sec-h"><h3>Választók</h3></div>
      <div class="card">
        <div class="mode"><button class="on">Egy bélyeg</button><button>Teljes albumoldal</button></div>
        <div class="seg"><button class="on">Postatiszta **</button><button>Falcos *</button><button>Pecsételt ⊙</button></div>
        <div class="cand on" style="margin-top:10px"><span class="rd"></span><div><b style="font-size:0.875rem">Minta jelölt</b><div class="muted" style="font-size:0.7812rem">1900 · katalógusszám ismeretlen</div></div><span class="chip g" style="margin-left:auto">82%</span></div>
        <div class="cand"><span class="rd"></span><div><b style="font-size:0.875rem">Második jelölt</b><div class="muted" style="font-size:0.7812rem">1902 · újranyomat</div></div><span class="chip r" style="margin-left:auto">12%</span></div>
      </div>

      <div class="sec-h"><h3>Chipek és státuszcímkék</h3></div>
      <div class="card">
        <div class="chips"><span class="chip g">Azonosítás: 86% · magas</span><span class="chip y">közepes</span><span class="chip r">alacsony</span><span class="chip">nem megerősített</span></div>
        <div style="margin-top:12px;font-size:0.875rem">Ország: Minta<span class="st st-kepen">képen olvasható</span></div>
        <div style="font-size:0.875rem;margin-top:4px">Kiadás éve: 1900<span class="st st-ai">AI-javaslat</span></div>
        <div style="font-size:0.875rem;margin-top:4px">Megnevezés: Minta<span class="st st-megerositett">megerősítve</span></div>
        <div style="font-size:0.875rem;margin-top:4px">Szín: <span class="unk">ismeretlen</span></div>
        <div class="chips" style="margin-top:12px"><span class="badge">2/4</span><span class="badge gold">${ic("trophy", 14)} Teljes sor</span></div>
      </div>

      <div class="sec-h"><h3>Értékkártya</h3></div>
      <div class="value"><span class="est-tag">Előzetes AI-becslés</span><div class="lbl" style="margin-top:8px">Pecsételt ⊙, VF · minta</div><div class="big">${A.rng(1, 2, R)}</div><div class="sub">≈ 1 € – 2 €</div><div class="why">Módszer: AI-becslés a fotó alapján, élő piaci forrás nélkül.</div></div>

      <div class="sec-h"><h3>Sorozatkártyák</h3></div>
      ${A.seriesCardHTML("se_demo", {...demoSeries, allapot: "megerositesre_var"}, own, {r: R, noConfirm: true})}
      ${A.seriesCardHTML("se_demo2", demoSeries, own, {r: R})}
      ${A.seriesCardHTML("se_demo3", demoSeries, full, {r: R})}

      <div class="sec-h"><h3>Listaelem és statisztika</h3></div>
      <div class="item"><div class="stamp sm">${A.thumbHTML("")}</div><div style="min-width:0"><div class="t">Minta bélyeg</div><div class="s">Minta ország · 1900</div><div class="s">Pecsételt ⊙ · VF</div></div><div class="v">${A.fmt(1.5, R)}<small style="color:var(--c-ok)">▲ 4%</small></div></div>
      <div class="stats"><div class="stat"><b>128</b><span>bélyeg</span></div><div class="stat"><b>12</b><span>sorozat</span></div><div class="stat"><b>3</b><span>teljes sor</span></div><div class="stat"><b>9</b><span>ország</span></div></div>

      <div class="sec-h"><h3>Visszajelzések</h3></div>
      <div class="card">
        <div class="warnbox" style="margin-top:0"><b>Bizonytalan azonosítás.</b> Ellenőrizd a jelölteket.</div>
        <div class="okbox">${ic("check", 16)} Azonosítás megerősítve</div>
        <div class="err">Hibaüzenet minta.</div>
        <button class="btn ghost" data-act="demo-toast">Értesítés (toast) kipróbálása</button>
      </div>

      <div class="sec-h"><h3>Űrlap</h3></div>
      <div class="card form"><label for="demo-f">Megnevezés</label><input class="field" id="demo-f" placeholder="pl. Lánchíd 20 f"></div>

      <div class="sec-h"><h3>Ikonok</h3><span class="muted">${window.BS.ICONS.length} saját vonalas ikon</span></div>
      <div class="card"><div class="icgrid">${window.BS.ICONS.map(n => `<div>${ic(n, 24)}<span>${n}</span></div>`).join("")}</div></div>

      <div class="sec-h"><h3>Mozgás</h3></div>
      <div class="card">
        <p style="margin:0 0 10px;font-size:0.875rem">Átmenetek 140–420 ms, lassuló görbével. Ha a készüléken be van kapcsolva a „Kevesebb mozgás”, az animációk kikapcsolnak.</p>
        <button class="btn ghost" data-act="demo-trophy">${ic("trophy", 18)} Trófea-animáció kipróbálása</button>
      </div>
      <button class="btn ghost" data-act="close-gallery" style="margin-top:16px">Vissza az alkalmazásba</button>`;
  }
  document.addEventListener("click", e => {
    const a = e.target.closest("[data-act]"); if (!a || !document.getElementById("v-design")?.classList.contains("on")) return;
    const A = window.BS.app, act = a.dataset.act;
    if (act === "theme-demo") { document.documentElement.setAttribute("data-theme", a.dataset.t); render(); }
    else if (act === "demo-toast") A.toast("Ez egy minta értesítés");
    else if (act === "demo-trophy") A.openModal(`<div class="trophy"><div class="ic-wrap">${window.BS.ic("trophy", 40)}</div><h2 style="margin-top:12px">Teljes sorozat!</h2><p class="muted">Minta – így jelenik meg egy teljesített sorozat.</p></div><button class="btn primary" data-act="close">Szuper!</button>`);
    else if (act === "close-gallery") { try { const t = localStorage.getItem("bs_theme") || "dark"; document.documentElement.setAttribute("data-theme", t === "system" ? (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark") : t); } catch(err){} location.hash = ""; A.show("scan"); }
  });
  window.BS.renderGallery = render;
})();
