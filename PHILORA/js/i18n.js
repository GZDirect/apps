/* PHILORA – nyelvválasztás (magyar / angol).
   A forráskód (js/) magyar. Az angol változat (js-en/) a tools/i18n/build-en.js szkripttel készül
   a tools/i18n/en.json szótárból – kézzel nem szerkesztendő.
   Ez a fájl a <head>-ben fut elsőként: beállítja a nyelvet, a számformátumot, lefordítja az index.html
   statikus szövegeit, és a megfelelő nyelvű modulokat tölti be. A tárolt adatok nyelvtől függetlenek. */
(() => {
  let lang = null, hasData = false;
  try {
    lang = localStorage.getItem("bs_lang");
    hasData = ["bs_docs", "bs_items", "bs_theme", "bs_cur", "bs_fscale", "bs_idb_only"].some(k => localStorage.getItem(k) != null);
  } catch (e) {}
  // Alapértelmezés: a meglévő (eddig magyar nyelvű) telepítések magyarul maradnak; új telepítésnél a készülék nyelve dönt.
  if (lang !== "hu" && lang !== "en") lang = hasData || /^hu\b/i.test(navigator.language || "") ? "hu" : "en";
  const EN = lang === "en";
  window.BS = window.BS || {};
  Object.assign(window.BS, {
    lang,
    LOC: EN ? "en-GB" : "hu-HU",
    DEC: EN ? "." : ",",
    setLang(l) { try { localStorage.setItem("bs_lang", l); } catch (e) {} location.reload(); }
  });
  document.documentElement.lang = lang;

  /* index.html statikus szövegei (a dinamikus felület szövegei a js-en/ modulokban vannak). */
  const STATIC = {
    "DEMÓ": "DEMO", "· szimulált adatok, nem élesek": "· simulated data, not live", "Kilépés": "Exit",
    "Beállítások és biztonsági mentés": "Settings and backup", "Pénznem": "Currency",
    "Szkennelés": "Scan", "Szkennelési mód": "Scan mode", "Egy bélyeg": "Single stamp", "Teljes albumoldal": "Whole album page",
    "Kamera": "Camera", "Galéria": "Gallery", "Felismerés indítása": "Start recognition",
    "Bélyeg adatlap": "Stamp details", "Cikk": "Article", "Fő navigáció": "Main navigation",
    "Kezdőlap": "Home", "Gyűjtemény": "Collection", "Portfólió": "Portfolio", "Tudástár": "Knowledge",
    "Részletek": "Details", "Világatlasz": "World atlas", "Örökség": "Heritage"
  };
  const tr = s => { const k = s.trim(); return k && STATIC[k] ? s.replace(k, STATIC[k]) : s; };
  window.BS.translateStatic = root => {
    if (!EN) return;
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let n; (n = w.nextNode());) { const t = tr(n.nodeValue); if (t !== n.nodeValue) n.nodeValue = t; }
    root.querySelectorAll("[aria-label],[title],[placeholder]").forEach(el => {
      for (const a of ["aria-label", "title", "placeholder"]) if (el.hasAttribute(a)) el.setAttribute(a, tr(el.getAttribute(a)));
    });
  };

  /* Modulok betöltése a nyelvnek megfelelő mappából, a megadott sorrendben (szinkron, mint a sima <script> tagek). */
  window.BS.loadModules = list => {
    window.BS.translateStatic(document.body);
    const dir = EN ? "js-en/" : "js/";
    for (const f of list) document.write(`<script src="${dir}${f}"><\/script>`);
  };
})();
