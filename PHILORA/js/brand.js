/* Központi márkakonfiguráció – PHILORA (munkanév).
   A végleges grafikai elemek a `assets` alatti helyekre kerülnek (relatív fájlútvonal, pl. "assets/brand/logo-dark.svg").
   Amíg egy hely értéke null, az alkalmazás semleges, IDEIGLENES helyettesítőt mutat (nem végleges arculati elem).
   Adatbiztonság: a tárolási kulcsok (bs_*), a dokumentum-útvonalak és a korábbi BS-… példánykódok szándékosan változatlanok. */
(() => {
  const BRAND = {
    name: "PHILORA",
    sloganEn: "Every stamp tells a story.",
    sloganHu: "Minden bélyeg egy történet.",
    tagline: "Filatéliai gyűjtemény és értékbecslés",
    taglineEn: "Stamp collection and valuation",
    legacyNames: ["BélyegSnap"],
    exportId: "PHILORA",
    importIds: ["PHILORA", "BelyegSnap"],   // a korábbi BélyegSnap-mentések továbbra is visszaállíthatók
    filePrefix: "philora",
    codePrefix: "PH",                        // csak az ÚJ példányok kódja; a meglévő BS-… kódok nem változnak
    themeColor: {dark: "#10382F", light: "#F5F0E5"},
    /* Grafikai elemek – PHILORA Premium Grafikai Csomag v1.0 (assets/brand/, változatlan eredeti SVG-k).
       Ahol egy slot értéke null, az alkalmazás saját, ideiglenes rajzot mutat. */
    assets: {
      monogram:    "assets/brand/monogram.svg",        // perforált arany bélyegkeret + P monogram (fejléc, indítóképernyő)
      logo:        {dark: null, light: null},          // teljes fejléc-logó; ha null: monogram + a név szövegként (így a név átírható)
      wordmark:    {src: "assets/brand/wordmark_horizontal.svg", baked: "PHILORA"},  // a nevet és a magyar szlogent tartalmazza – csak akkor használjuk, ha a név egyezik
      appIcon:     "assets/brand/app_icon.svg",
      splash:      {dark: null, light: null},
      homeHero:    {dark: null, light: null},
      empty:       {collection: null, search: null, wish: null, dups: null, portfolio: null},
      /* Albumborítók: a csomag SVG-je a minta; a borító címe és alsó sora futásidőben az album nevére és a márkanévre cserélődik,
         a rajzolat változatlan. A sage és graphite színhez a csomagban nincs borító – ott az ideiglenes rajz marad. */
      albumCovers: {forest: "assets/brand/album_01_magyarorszag.svg", wine: "assets/brand/album_02_europa.svg", navy: "assets/brand/album_03_vilag.svg",
                    umber: "assets/brand/album_04_tematika.svg", classic: "assets/brand/album_05_klasszikus.svg", sage: null, graphite: null},
      articleCovers: {tortenet: null, allapot: null, magyar: null, ritkasag: null, hamisitvany: null, kezikonyv: null},
      medals:      {seriesComplete: null}
    }
  };
  /* Az aktuális nyelv szlogenje (BS.lang: "hu" | "en", az i18n.js állítja be). */
  const slogan = () => (window.BS && window.BS.lang === "en") ? BRAND.sloganEn : BRAND.sloganHu;
  const theme = () => document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
  /* A slot aktuális (témától függő) fájlútvonala, vagy null. */
  const asset = (path) => {
    let v = path.split(".").reduce((o, k) => (o == null ? o : o[k]), BRAND.assets);
    if (v && typeof v === "object") v = v[theme()] || v.dark || v.light || null;
    return typeof v === "string" && v ? v : null;
  };
  /* Kép a slotból, vagy a megadott ideiglenes helyettesítő HTML. */
  const img = (path, fallbackHTML, attrs = "") => { const src = asset(path); return src ? `<img src="${src}" alt="" ${attrs} onerror="this.replaceWith(document.createRange().createContextualFragment(this.dataset.fb||''))" data-fb="${String(fallbackHTML).replace(/"/g, "&quot;")}">` : fallbackHTML; };
  /* Ideiglenes, tisztán tipográfiai szóvédjegy – nem végleges logó. */
  const wordmark = (cls = "") => asset("logo") ? `<img class="brand-logo ${cls}" src="${asset("logo")}" alt="${BRAND.name}">` : `<span class="wordmark ${cls}" aria-label="${BRAND.name}">${BRAND.name}</span>`;
  const applyHead = () => {
    document.title = `${BRAND.name} – ${slogan()}`;
    const tc = document.querySelector('meta[name="theme-color"]'); if (tc) tc.content = BRAND.themeColor[theme()];
    const ic = asset("appIcon");
    if (ic) for (const rel of ["icon", "apple-touch-icon"]) { let l = document.querySelector(`link[rel="${rel}"]`); if (!l) { l = document.createElement("link"); l.rel = rel; document.head.appendChild(l); } l.href = ic; if (rel === "icon") l.type = "image/svg+xml"; }
  };

  /* ---- Csomagbeli SVG-k előtöltése (szövegként, hogy a borítók felirata cserélhető legyen) ---- */
  const svgCache = {};
  const loadSvg = src => svgCache[src] || (svgCache[src] = fetch(src).then(r => r.ok ? r.text() : null).catch(() => null).then(t => (svgCache[src + "#t"] = t, t)));
  const svgText = src => svgCache[src + "#t"] || null;
  const xmlEsc = s => String(s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;"}[c]));
  /* Albumborító a csomag SVG-jéből: a cím (1. <text>) az album neve, az alsó sor „<MÁRKANÉV> COLLECTION”. Visszaad: data-URL vagy null. */
  const albumCover = (color, title, opts = {}) => {
    const src = BRAND.assets.albumCovers[color]; if (!src) return null;
    const t = svgText(src); if (!t) { loadSvg(src); return null; }
    const name = String(title || "").trim().toLocaleUpperCase(window.BS?.LOC || "hu-HU");
    const short = name.length > 22 ? name.slice(0, 21) + "…" : name;
    const fs = Math.max(14, Math.min(27, Math.floor(27 * 13 / Math.max(13, short.length))));
    let i = 0;
    const out = t.replace(/<text([^>]*)>([^<]*)<\/text>/g, (m, attrs, txt) => {
      i++;
      if (i === 1) return `<text${attrs.replace(/font-size="[^"]*"/, `font-size="${fs}"`)}>${xmlEsc(short)}</text>`;
      if (i === 2 && opts.glyph === false) return `<text${attrs}></text>`;   // a kör közepe az album saját emblémájának marad
      if (/COLLECTION/.test(txt)) return `<text${attrs}>${xmlEsc(BRAND.name.toUpperCase())} COLLECTION</text>`;
      return m;
    });
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(out);
  };
  const preload = () => Promise.all(Object.values(BRAND.assets.albumCovers).filter(Boolean).map(loadSvg))
    .then(() => document.dispatchEvent(new CustomEvent("bs-brand-assets")));
  /* Monogram (csomagbeli SVG) <img>-ként; dekoratív, ha mellette ott a név. */
  const monogram = (cls = "", alt = "") => BRAND.assets.monogram ? `<img class="monogram ${cls}" src="${BRAND.assets.monogram}" alt="${xmlEsc(alt)}" width="200" height="200" decoding="async">` : "";
  /* A csomag szóvédjegye csak akkor használható, ha a beégetett név egyezik a konfigurált névvel. */
  const wordmarkSvg = () => { const w = BRAND.assets.wordmark; return w && w.src && w.baked === BRAND.name ? w.src : null; };
  window.BS = window.BS || {};
  Object.assign(window.BS, {BRAND, slogan, asset, brandImg: img, wordmark, monogram, albumCover, wordmarkSvg, applyBrandHead: applyHead});
  preload();
  applyHead();
})();
