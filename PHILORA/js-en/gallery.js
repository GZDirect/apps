/* GENERÁLT FÁJL – ne szerkeszd. Forrás: js/gallery.js, szótár: tools/i18n/en.json, eszköz: tools/i18n/build-en.js */
/* PHILORA komponensgaléria – #komponensek. Minden adat MINTA, nem valós katalógus- vagy piaci adat. */
(() => {
  const PALETTE = [
    ["Forest green", "#10382F", "base (dark theme), emphasis", "#F5F0E5"],
    ["Antique gold", "#C5A46D", "primary button, border, award", "#242A27"],
    ["Ivory", "#F5F0E5", "cards, sheets", "#242A27"],
    ["Graphite", "#242A27", "text on light surfaces", "#F5F0E5"],
    ["Sage green", "#7F9B8E", "decoration, icon background", "#242A27"],
    ["Dark gold", "#7A5E2A", "gold text on light background", "#F5F0E5"],
    ["Forest green 800", "#16483B", "raised dark surface", "#F5F0E5"],
    ["Forest green 700", "#22584A", "secondary surface", "#F5F0E5"],
    ["Light gold", "#E0C48E", "gold text on dark background", "#10382F"],
    ["Paper", "#E9E0CE", "secondary card", "#242A27"],
    ["Success", "#4B9772", "icon, border (text: #2F6E50)", "#000000"],
    ["Warning", "#A46C24", "icon, border (text: #7A4E12)", "#000000"],
    ["Error", "#B54E4A", "icon, border (text: #963A36)", "#FFFFFF"]
  ];
  const PAIRS = [
    ["Text on background", "--on-bg", "--bg"], ["Muted text on background", "--on-bg-2", "--bg"], ["Gold text on background", "--on-bg-accent", "--bg"],
    ["Text on card", "--ink", "--surface"], ["Muted text on card", "--ink-2", "--surface"], ["Gold text on card", "--ink-accent", "--surface"],
    ["Text on hero card", "--hero-ink", "--hero"], ["Muted text on hero card", "--hero-ink-2", "--hero"], ["Gold text on hero card", "--hero-accent", "--hero"],
    ["Primary button", "--primary-ink", "--primary"], ["Navigation (inactive)", "--nav-ink", "--nav-bg"], ["Navigation (active)", "--nav-active", "--nav-bg"],
    ["Warning", "--c-warn", "--c-warn-bg"], ["Success", "--c-ok", "--c-ok-bg"], ["Error", "--c-danger", "--c-danger-bg"]
  ];
  const hexOf = v => { const c = document.createElement("canvas").getContext("2d"); c.fillStyle = v.trim(); return c.fillStyle; };
  const lum = h => { const n = h.replace("#", ""); return [0, 2, 4].map(i => parseInt(n.slice(i, i + 2), 16) / 255).map(c => c <= .03928 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4).reduce((a, c, i) => a + c * [.2126, .7152, .0722][i], 0); };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + .05) / (y + .05); };
  const cssVar = n => hexOf(getComputedStyle(document.documentElement).getPropertyValue(n));

  function render(){
    const A = window.BS.app, ic = window.BS.ic, el = document.getElementById("designWrap"); if (!A || !el) return;
    const R = {eur_huf: 395}, demoThumb = "";
    const demoSeries = {cim: "Sample series", orszag: "Sample country", ev: "1900", allapot: "megerositett",
      tagok: [{nevertek: "10 f", ar: {pecsetelt: {min: .5, max: 1}}}, {nevertek: "20 f", ar: {pecsetelt: {min: .5, max: 1}}}, {nevertek: "50 f", ar: {pecsetelt: {min: 1, max: 2}}}, {nevertek: "1 Ft", ar: {pecsetelt: {min: 2, max: 3}}}],
      teljes_sor: {pecsetelt: {min: 5, max: 8}}};
    const own = new Map([[0, {thumb: demoThumb, cond: "pecsetelt"}], [1, {thumb: demoThumb, cond: "pecsetelt"}]]);
    const full = new Map([0, 1, 2, 3].map(i => [i, {thumb: demoThumb, cond: "pecsetelt"}]));
    const theme = document.documentElement.getAttribute("data-theme");
    const rows = PAIRS.map(([l, f, b]) => { const bh = cssVar(b); const r = ratio(cssVar(f), bh); return `<tr><td>${l}</td><td><span style="display:inline-block;width:14px;height:14px;border-radius:3px;background:${bh};border:1px solid #0002;vertical-align:-2px"></span> <span style="color:${cssVar(f)};background:${bh};padding:1px 6px;border-radius:4px">Aa</span></td><td class="${r >= 4.5 ? "" : "bad"}">${r.toFixed(2)}:1 ${r >= 4.5 ? "✓" : "✗"}</td></tr>`; }).join("");
    el.innerHTML = `
      <h2 class="page-title">Design system</h2>
      <p class="muted" style="margin:-6px 2px 8px;font-size:0.8438rem">Heritage Luxury · ${window.BS.BRAND.name} · current theme: <b>${theme === "light" ? "light" : "dark"}</b>. Stamp details and prices in the samples are illustrations.</p>
      <div class="seg" style="margin-bottom:6px"><button data-act="theme-demo" data-t="dark" class="${theme !== "light" ? "on" : ""}">Dark theme</button><button data-act="theme-demo" data-t="light" class="${theme === "light" ? "on" : ""}">Light theme</button></div>

      <div class="sec-h"><h3>Colour palette</h3></div>
      <div class="swatches">${PALETTE.map(([n, h, u, t]) => `<div class="sw" style="background:${h};color:${t}"><b>${n}</b>${h}<br>${u}</div>`).join("")}</div>

      <div class="sec-h"><h3>Contrast (measured)</h3><span class="muted">WCAG AA: at least 4.5:1</span></div>
      <div class="card"><table class="pr" id="contrastTable"><tbody>${rows}</tbody></table></div>

      <div class="sec-h"><h3>Typography</h3></div>
      <div class="card">
        <div style="font:700 2.375rem/1.05 var(--font-display)">Cormorant Garamond 38</div>
        <div style="font:700 1.75rem/1.1 var(--font-display);margin-top:6px">Heading 28 · series name</div>
        <div style="font:700 1.1875rem/1.2 var(--font-display);margin-top:6px">Card title 19</div>
        <div style="font:400 0.9375rem/1.45 var(--font-ui);margin-top:10px">Inter 15 – interface, body text, buttons.</div>
        <div class="muted" style="font:400 0.8125rem var(--font-ui)">Inter 13 – secondary text, explanations.</div>
        <div style="font:600 0.7188rem var(--font-ui);letter-spacing:.06em;text-transform:uppercase;color:var(--ink-accent);margin-top:4px">Inter 11.5 – label</div>
      </div>

      <div class="sec-h"><h3>Buttons</h3><span class="muted">touch target ≥ 44 px</span></div>
      <div class="card">
        <button class="btn primary">${ic("camera", 18)} Primary button</button>
        <div class="row" style="margin-top:10px"><button class="btn ghost">Secondary</button><button class="btn danger">${ic("trash", 18)} Delete</button></div>
        <div class="row" style="margin-top:10px;align-items:center"><button class="btn primary small" style="flex:0 0 auto">Small</button><button class="btn ghost small" style="flex:0 0 auto">${ic("edit", 16)} Edit</button><button class="btn primary" disabled>Disabled</button></div>
      </div>

      <div class="sec-h"><h3>Selectors</h3></div>
      <div class="card">
        <div class="mode"><button class="on">Single stamp</button><button>Whole album page</button></div>
        <div class="seg"><button class="on">Mint never hinged **</button><button>Hinged *</button><button>Used ⊙</button></div>
        <div class="cand on" style="margin-top:10px"><span class="rd"></span><div><b style="font-size:0.875rem">Sample candidate</b><div class="muted" style="font-size:0.7812rem">1900 · catalogue no. unknown</div></div><span class="chip g" style="margin-left:auto">82%</span></div>
        <div class="cand"><span class="rd"></span><div><b style="font-size:0.875rem">Second candidate</b><div class="muted" style="font-size:0.7812rem">1902 · reprint</div></div><span class="chip r" style="margin-left:auto">12%</span></div>
      </div>

      <div class="sec-h"><h3>Chips and status labels</h3></div>
      <div class="card">
        <div class="chips"><span class="chip g">Identification: 86% · high</span><span class="chip y">medium</span><span class="chip r">low</span><span class="chip">not confirmed</span></div>
        <div style="margin-top:12px;font-size:0.875rem">Country: Sample<span class="st st-kepen">read from stamp</span></div>
        <div style="font-size:0.875rem;margin-top:4px">Year of issue: 1900<span class="st st-ai">AI suggestion</span></div>
        <div style="font-size:0.875rem;margin-top:4px">Name: Sample<span class="st st-megerositett">confirmed</span></div>
        <div style="font-size:0.875rem;margin-top:4px">Colour: <span class="unk">unknown</span></div>
        <div class="chips" style="margin-top:12px"><span class="badge">2/4</span><span class="badge gold">${ic("trophy", 14)} Complete set</span></div>
      </div>

      <div class="sec-h"><h3>Value card</h3></div>
      <div class="value"><span class="est-tag">Preliminary AI estimate</span><div class="lbl" style="margin-top:8px">Used ⊙, VF · sample</div><div class="big">${A.rng(1, 2, R)}</div><div class="sub">≈ 1 € – 2 €</div><div class="why">Method: AI estimate from photo, without a live market source.</div></div>

      <div class="sec-h"><h3>Series cards</h3></div>
      ${A.seriesCardHTML("se_demo", {...demoSeries, allapot: "megerositesre_var"}, own, {r: R, noConfirm: true})}
      ${A.seriesCardHTML("se_demo2", demoSeries, own, {r: R})}
      ${A.seriesCardHTML("se_demo3", demoSeries, full, {r: R})}

      <div class="sec-h"><h3>List item and statistics</h3></div>
      <div class="item"><div class="stamp sm">${A.thumbHTML("")}</div><div style="min-width:0"><div class="t">Sample stamp</div><div class="s">Sample country · 1900</div><div class="s">Used ⊙ · VF</div></div><div class="v">${A.fmt(1.5, R)}<small style="color:var(--c-ok)">▲ 4%</small></div></div>
      <div class="stats"><div class="stat"><b>128</b><span>stamps</span></div><div class="stat"><b>12</b><span>series</span></div><div class="stat"><b>3</b><span>complete sets</span></div><div class="stat"><b>9</b><span>countries</span></div></div>

      <div class="sec-h"><h3>Feedback</h3></div>
      <div class="card">
        <div class="warnbox" style="margin-top:0"><b>Uncertain identification.</b> Check the candidates.</div>
        <div class="okbox">${ic("check", 16)} Identification confirmed</div>
        <div class="err">Sample error message.</div>
        <button class="btn ghost" data-act="demo-toast">Try a notification (toast)</button>
      </div>

      <div class="sec-h"><h3>Form</h3></div>
      <div class="card form"><label for="demo-f">Name</label><input class="field" id="demo-f" placeholder="e.g. Chain Bridge 20 f"></div>

      <div class="sec-h"><h3>Icons</h3><span class="muted">${window.BS.ICONS.length} custom line icons</span></div>
      <div class="card"><div class="icgrid">${window.BS.ICONS.map(n => `<div>${ic(n, 24)}<span>${n}</span></div>`).join("")}</div></div>

      <div class="sec-h"><h3>Motion</h3></div>
      <div class="card">
        <p style="margin:0 0 10px;font-size:0.875rem">Transitions of 140–420 ms with an ease-out curve. If “Reduce motion” is on in the device settings, animations are turned off.</p>
        <button class="btn ghost" data-act="demo-trophy">${ic("trophy", 18)} Try the trophy animation</button>
      </div>
      <button class="btn ghost" data-act="close-gallery" style="margin-top:16px">Back to the app</button>`;
  }
  document.addEventListener("click", e => {
    const a = e.target.closest("[data-act]"); if (!a || !document.getElementById("v-design")?.classList.contains("on")) return;
    const A = window.BS.app, act = a.dataset.act;
    if (act === "theme-demo") { document.documentElement.setAttribute("data-theme", a.dataset.t); render(); }
    else if (act === "demo-toast") A.toast("This is a sample notification");
    else if (act === "demo-trophy") A.openModal(`<div class="trophy"><div class="ic-wrap">${window.BS.ic("trophy", 40)}</div><h2 style="margin-top:12px">Complete series!</h2><p class="muted">Sample – this is how a completed series looks.</p></div><button class="btn primary" data-act="close">Great!</button>`);
    else if (act === "close-gallery") { try { const t = localStorage.getItem("bs_theme") || "dark"; document.documentElement.setAttribute("data-theme", t === "system" ? (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark") : t); } catch(err){} location.hash = ""; A.show("scan"); }
  });
  window.BS.renderGallery = render;
})();
