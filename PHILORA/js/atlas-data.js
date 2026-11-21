/* PHILORA Atlasz – kibocsátók (Issuer) és összesítés (MapAggregation).
   A bélyeg a KIBOCSÁTÓ szerint kerül országhoz (filatéliai logika), nem a mai határok szerint.
   Történelmi kibocsátóhoz (pl. Osztrák–Magyar Monarchia, Szovjetunió) nem rajzolunk határt: nincs ellenőrzött,
   licencelt időmetszet-adatforrásunk. Ezek külön, listaként jelennek meg, a mai érintett országok csak szövegként.
   Ami nem rendelhető egyértelműen kibocsátóhoz, „felülvizsgálandó”. Csak valós, mentett adatból számol. */
(() => {
  const B = window.BS = window.BS || {};
  const norm = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

  /* Történelmi kibocsátók. A „present” a mai érintett országok ISO-kódjai – csak tájékoztató szöveg, nem térképi határ. */
  const HISTORICAL = [
    {id: "h-austrian-empire", hu: "Osztrák Császárság", en: "Austrian Empire", from: 1804, to: 1867, present: ["AT", "HU", "CZ", "SK", "SI", "HR", "IT", "PL", "UA", "RO"], al: ["osztrak csaszarsag", "austrian empire", "kaiserthum oesterreich"]},
    {id: "h-austria-hungary", hu: "Osztrák–Magyar Monarchia", en: "Austria-Hungary", from: 1867, to: 1918, present: ["AT", "HU", "CZ", "SK", "SI", "HR", "BA", "PL", "UA", "RO", "IT", "RS", "ME"], al: ["osztrak magyar monarchia", "osztrak magyar birodalom", "ausztria magyarorszag", "austria hungary", "austro hungarian empire", "k u k", "monarchia"]},
    {id: "h-german-reich", hu: "Német Birodalom", en: "German Reich", from: 1871, to: 1945, present: ["DE", "PL", "RU", "LT", "FR", "DK", "CZ", "BE"], al: ["nemet birodalom", "deutsches reich", "german reich", "german empire", "harmadik birodalom", "third reich"]},
    {id: "h-russian-empire", hu: "Orosz Birodalom", en: "Russian Empire", from: 1721, to: 1917, present: ["RU", "FI", "PL", "UA", "BY", "LT", "LV", "EE", "MD", "GE", "AM", "AZ", "KZ"], al: ["orosz birodalom", "orosz csaszarsag", "russian empire", "tsarist russia", "carizmus"]},
    {id: "h-ottoman", hu: "Oszmán Birodalom", en: "Ottoman Empire", from: 1299, to: 1922, present: ["TR", "GR", "BG", "RS", "BA", "AL", "MK", "EG", "SY", "LB", "IL", "JO", "IQ", "SA"], al: ["oszman birodalom", "torok birodalom", "ottoman empire", "turkish empire"]},
    {id: "h-ussr", hu: "Szovjetunió", en: "Soviet Union", from: 1922, to: 1991, present: ["RU", "UA", "BY", "MD", "EE", "LV", "LT", "GE", "AM", "AZ", "KZ", "UZ", "TM", "KG", "TJ"], al: ["szovjetunio", "szovjet unio", "soviet union", "ussr", "u s s r", "cccp", "sssr", "szszksz"]},
    {id: "h-czechoslovakia", hu: "Csehszlovákia", en: "Czechoslovakia", from: 1918, to: 1992, present: ["CZ", "SK"], al: ["csehszlovakia", "czechoslovakia", "cssr", "csszsk", "ceskoslovensko"]},
    {id: "h-bohemia-moravia", hu: "Cseh–Morva Protektorátus", en: "Protectorate of Bohemia and Moravia", from: 1939, to: 1945, present: ["CZ"], al: ["cseh morva protektoratus", "bohemia and moravia", "bohmen und mahren"]},
    {id: "h-yugoslavia", hu: "Jugoszlávia", en: "Yugoslavia", from: 1918, to: 2003, present: ["SI", "HR", "BA", "RS", "ME", "MK", "XK"], al: ["jugoszlavia", "yugoslavia", "jugoslavija", "szhsz kiralysag", "kingdom of serbs croats and slovenes"]},
    {id: "h-gdr", hu: "Német Demokratikus Köztársaság (NDK)", en: "German Democratic Republic (GDR)", from: 1949, to: 1990, present: ["DE"], al: ["ndk", "nemet demokratikus koztarsasag", "german democratic republic", "gdr", "ddr", "east germany", "kelet nemetorszag"]},
    {id: "h-danzig", hu: "Danzig Szabad Város", en: "Free City of Danzig", from: 1920, to: 1939, present: ["PL"], al: ["danzig", "danzig szabad varos", "free city of danzig", "freie stadt danzig"]}
  ];
  /* További, gyakori névváltozatok mai kibocsátókhoz (ISO alpha-2 → normalizált nevek). */
  const EXTRA_AL = {
    HU: ["magyar kiralysag", "kingdom of hungary", "magyar nepkoztarsasag", "magyar koztarsasag", "hungarian peoples republic", "magyar posta"],
    GB: ["nagy britannia", "anglia", "england", "britain", "brit", "egyesult kiralysag"],
    US: ["usa", "egyesult allamok", "amerika"], DE: ["nemet szovetsegi koztarsasag", "nszk", "bundesrepublik deutschland", "west germany", "nyugat nemetorszag", "brd"],
    AT: ["osztrak koztarsasag", "osterreich", "republik osterreich"], RU: ["oroszorszag", "orosz foderacio", "russia", "russian federation"],
    CZ: ["csehorszag", "cseh koztarsasag", "czech republic", "czechia"], VA: ["vatikan", "vatikanvaros", "vatican", "vatican city", "citta del vaticano"],
    NL: ["hollandia", "holland", "netherlands"], CH: ["svajc", "helvetia", "switzerland"], SK: ["szlovakia", "slovakia"], RO: ["romania"],
    PL: ["lengyelorszag", "polska", "poland"], IT: ["olaszorszag", "italia", "italy"], FR: ["franciaorszag", "republique francaise", "france"],
    KR: ["del korea", "south korea"], KP: ["eszak korea", "north korea"], CN: ["kina", "kinai nepkoztarsasag", "china"], TW: ["tajvan", "kinai koztarsasag tajvan"]
  };
  let INDEX = null;
  function index(){
    if (INDEX) return INDEX;
    INDEX = new Map(); const G = B.ATLAS_GEO;
    const add = (name, id) => { const k = norm(name); if (k && !INDEX.has(k)) INDEX.set(k, id); };
    for (const h of HISTORICAL) { add(h.hu, h.id); add(h.en, h.id); h.al.forEach(a => add(a, h.id)); }
    for (const c of G.countries) { if (!c.a2) continue; [c.hu, c.en, ...(c.al || []), ...(EXTRA_AL[c.a2] || [])].forEach(n => add(n, c.a2)); }
    return INDEX;
  }
  const country = a2 => B.ATLAS_GEO.countries.find(c => c.a2 === a2);
  const historical = id => HISTORICAL.find(h => h.id === id);
  const lang = () => B.lang === "en" ? "en" : "hu";
  /* Kibocsátó (Issuer) objektum: {id, name, historical, validFrom, validTo, present[], geo} */
  function issuer(id){
    if (!id) return null;
    const h = historical(id); if (h) return {id, name: h[lang()], historical: true, validFrom: h.from, validTo: h.to, present: h.present, geo: null};
    const c = country(id); if (c) return {id, name: c[lang()], historical: false, validFrom: null, validTo: null, present: [id], geo: c.id};
    return null;
  }
  /* Egy tétel kibocsátója. review: igaz, ha nem egyértelmű (ismeretlen név, ütköző jelölés vagy a kiadás éve a kibocsátó időszakán kívül esik). */
  const cache = new WeakMap();
  function issuerOf(item){
    if (cache.has(item)) return cache.get(item);
    const raw = String(item?.result?.orszag || "").trim(), I = index(); let id = null, review = false, why = "";
    if (!raw) { review = true; why = "nincs megadva"; }
    else {
      id = I.get(norm(raw)) || null;
      if (!id) {   // „Magyarország (Osztrák–Magyar Monarchia)” típusú alakok
        const outer = norm(raw.replace(/\([^)]*\)/g, " ")), inner = (raw.match(/\(([^)]*)\)/) || [])[1];
        const a = I.get(outer) || null, b = inner ? I.get(norm(inner)) || null : null;
        id = a || b; if (a && b && a !== b) { review = true; why = "ütköző kibocsátó"; }
      }
      if (!id) { review = true; why = "ismeretlen kibocsátó"; }
    }
    const iss = issuer(id), y = parseInt(item?.result?.kiadas_eve, 10);
    if (iss?.historical && Number.isFinite(y) && (y < iss.validFrom - 1 || y > iss.validTo + 1)) { review = true; why = "a kiadás éve kívül esik a kibocsátó időszakán"; }
    const r = {id, issuer: iss, review, why, raw}; cache.set(item, r); return r;
  }
  /* Összesítés kibocsátónként – memoizált (ugyanarra a tétellistára nem számol újra). Minden fizikai példány egyszer számít. */
  let memo = {key: null, val: null};
  function aggregate(items){
    const key = items.length + ":" + items.reduce((s, i) => s + (i.updatedAt || i.lastPriced || i.createdAt || 0), 0) + ":" + lang();
    if (memo.key === key && memo.items === items) return memo.val;
    const by = new Map(), review = [];
    for (const it of items) {
      const o = issuerOf(it);
      if (!o.id) { review.push(it); continue; }
      let a = by.get(o.id);
      if (!a) by.set(o.id, a = {issuerId: o.id, issuer: o.issuer, items: [], series: new Set(), lo: 0, hi: 0, priced: 0, confirmed: 0, review: 0});
      a.items.push(it); if (it.seriesKey) a.series.add(it.seriesKey);
      if ((+it.max || 0) > 0) { a.priced++; a.lo += +it.min || 0; a.hi += +it.max || 0; }
      if (it.azonositas?.megerositve) a.confirmed++;
      if (o.review) a.review++;
    }
    for (const a of by.values()) { a.count = a.items.length; a.seriesCount = a.series.size; a.priceCoverage = a.count ? a.priced / a.count : 0; a.confidence = a.count ? a.confirmed / a.count : 0; }
    const val = {by, review, total: items.length};
    memo = {key, items, val}; return val;
  }
  B.atlasData = {HISTORICAL, issuer, issuerOf, aggregate, norm, country, historical};
})();
