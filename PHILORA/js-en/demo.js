/* GENERÁLT FÁJL – ne szerkeszd. Forrás: js/demo.js, szótár: tools/i18n/en.json, eszköz: tools/i18n/build-en.js */
/* PHILORA DEMÓ MÓD – szimulált adatok. Csak a memóriában élnek (store.mode = "demo"), soha nem kerülnek az éles tárolóba.
   A nevek, árak és katalógusjelek kitaláltak; minden kép „DEMÓ” felirattal rajzolt illusztráció. */
(() => {
  const HUN = "Hungary";
  const DAY = 864e5;
  let rnd = 42; const R = () => (rnd = (rnd * 16807) % 2147483647) / 2147483647;
  const pick = a => a[Math.floor(R() * a.length)];
  const CONDS = ["postatiszta", "falcos", "pecsetelt", "pecsetelt", "pecsetelt", "serult"];
  const GR = ["Superb", "XF", "VF", "VF", "F", "F", "VG"];
  const SERIES = [
    {k:"se_demo-hidak", cim:"Bridges (demo series)", orszag:"Hungary", ev:"1949", tema:"architecture", dens:["20 f","30 f","40 f","60 f","1 Ft"], own:[0,1,2,3,4], ok:true},
    {k:"se_demo-madarak", cim:"Songbirds (demo)", orszag:"Hungary", ev:"1961", tema:"animals", dens:["10 f","20 f","30 f","40 f","60 f","1 Ft"], own:[0,1,2,3,5], ok:true},
    {k:"se_demo-viragok", cim:"Wild flowers (demo)", orszag:"Austria", ev:"1966", tema:"plants", dens:["1 S","1,50 S","2 S","3 S","4 S","5 S","6 S","8 S"], own:[0,1,2,4,5,6], ok:true},
    {k:"se_demo-sport", cim:"Summer Games (demo)", orszag:"Czechoslovakia", ev:"1972", tema:"sport", dens:["20 h","40 h","1 Kčs","2 Kčs"], own:[0,2], ok:false}
  ];
  const SINGLES = [
    ["Crowned post horn (demo)","Hungary","1871","5 kr","postal history"],["Parliament (demo)","Hungary","1953","1 Ft","architecture"],["Kossuth portrait (demo)","Hungary","1952","2 Ft","people"],
    ["Royal Palace (demo)","Austria","1934","24 g","architecture"],["Alpine landscape (demo)","Austria","1948","1 S","landscapes"],["Ship’s captain (demo)","Germany","1955","10 Pf","transport"],
    ["Carrier pigeon (demo)","Germany","1960","20 Pf","animals"],["Copernicus (demo)","Poland","1973","1 zł","science"],["Roman fountain (demo)","Italy","1959","25 L","architecture"],
    ["Marianne (demo)","France","1945","4 F","people"],["Monarch’s profile (demo)","United Kingdom","1967","4 d","people"],["Steam locomotive (demo)","Hungary","1966","60 f","transport"],
    ["Space research (demo)","Soviet Union","1961","6 kop","science"],["Folk costume (demo)","Romania","1958","55 b","folklore"],["Mountain monastery (demo)","Yugoslavia","1964","25 din","architecture"]
  ];
  function priceBands(base){ return {postatiszta:{min:+(base*1.6).toFixed(2),max:+(base*2.6).toFixed(2)}, falcos:{min:+(base*.8).toFixed(2),max:+(base*1.3).toFixed(2)}, pecsetelt:{min:+(base*.5).toFixed(2),max:+(base*.9).toFixed(2)}, serult:{min:+(base*.05).toFixed(2),max:+(base*.15).toFixed(2)}}; }
  function makeItem(docs, n, d){
    const now = Date.now(), cond = d.cond || pick(CONDS), grade = pick(GR), base = d.base || +(0.3 + R() * (R() < .15 ? 40 : 6)).toFixed(2);
    const arak = priceBands(base), b = arak[cond], first = +((b.min + b.max) / 2 * (.85 + R() * .2)).toFixed(2);
    const created = now - Math.round((20 + R() * 330) * DAY), reval = R() < .45;
    const img = window.BS.art.demoStamp(n * 7 + 3, d.orszag, d.nevertek, 420), th = window.BS.art.demoStamp(n * 7 + 3, d.orszag, d.nevertek, 160);
    const evs = [{t:created, min:b.min, max:b.max, modszer:"ai-foto", forras:null}];
    let min = b.min, max = b.max;
    if (reval) { const f = 1 + (R() - .35) * .3; min = +(min * f).toFixed(2); max = +(max * f).toFixed(2); evs.push({t: created + Math.round((now - created) * .7), min, max, modszer:"ai-ujrabecsles", forras:null, indok: f >= 1 ? "rising demand (simulated)" : "weaker demand (simulated)"}); }
    const id = "it_demo" + String(n).padStart(3, "0");
    docs[id] = {kind:"item", schema:2, demo:true, createdAt:created, thumb:th, photo:img, backPhoto: n % 9 === 0 ? th : "", cond, grade, min, max, first:+((evs[0].min + evs[0].max) / 2).toFixed(2),
      pf: d.pf || (n % 3 === 0 ? "pf_demo1" : n % 5 === 0 ? "pf_demo2" : "default"), seriesKey: d.seriesKey || "", memberIdx: d.memberIdx ?? -1,
      priceHistory: evs.map(e => ({t:e.t, min:e.min, max:e.max})), lastPriced: evs[evs.length - 1].t, ertekelesek: evs,
      peldany:{kod:"DEMO-" + String(n).padStart(3, "0"), tipus: d.tipus || "gyujtemeny", album: d.album || (d.orszag === HUN ? "al_demo1" : "al_demo2"), hely: `Stockbook, page ${1 + (n % 6)}, row ${1 + (n % 4)}`, megjegyzes: n % 4 === 0 ? "From grandpa’s album (simulated note)" : "", beszerzes: n % 3 === 0 ? {ar: Math.round(first * 395 * (.6 + R() * .6) / 10) * 10, datum: new Date(created).toISOString().slice(0, 10), forras: pick(["stamp fair","auction","csere","estate"])} : null},
      azonositas:{megerositve: R() < .6, jelolt:0, mezoForras:{orszag:"kepen", nevertek:"kepen"}, bizonyossag: Math.round(45 + R() * 50)},
      result:{felismerve:true, nev:d.nev, orszag:d.orszag, kiadas_eve:d.ev, sorozat:d.sorozat || "", nevertek:d.nevertek, szin:pick(["red","blue","green","brown","violet","olive green"]), tema:d.tema,
        bizonyossag: Math.round(45 + R() * 50), mezo_forras:{orszag:"kepen", nevertek:"kepen", kiadas_eve:"ai"}, katalogus:{mbk:"", michel:""},
        jeloltek:[{nev:d.nev, kiadas_eve:d.ev, sorozat:d.sorozat || "", katalogus:{}, bizonyossag:80, indok:"simulated candidate"}],
        allapot:{tipus:cond, fokozat:grade, pontszam: Math.round(3 + R() * 7), centrirozas:"simulated assessment", fogazat_allapot:"simulated", szin_allapot:"simulated", pecset: cond === "pecsetelt" ? "partial circular cancel (simulated)" : "", hibak:[], megjegyzes:"Demo data."},
        arak, becsult_ertek:{min:b.min, max:b.max, indoklas:"Simulated demo estimate."}, ar_alap:"Simulated demo data – not a real market estimate.",
        /* i18n-skip-start */ ritkasag: base > 10 ? "ritka" : base > 3 ? "kevésbé gyakori" : "gyakori" /* i18n-skip-end */, leiras:`Simulated demo stamp from the ${d.tema} topic. The description is illustrative, not real historical data.`,
        fogazat:"", vizjel:"", nyomtatas:"", valtozatok:[], ellenorzes:[], eur_huf:395}};
    return docs[id];
  }
  window.BS = window.BS || {};
  window.BS.demoDocs = () => {
    rnd = 42; const docs = {}, now = Date.now(); let n = 1;
    docs.pf_demo1 = {kind:"portfolio", schema:2, name:"Hungarian classics (demo)", createdAt: now - 300 * DAY};
    docs.pf_demo2 = {kind:"portfolio", schema:2, name:"For sale (demo)", createdAt: now - 200 * DAY};
    docs.al_demo1 = {kind:"album", schema:2, name:"Hungarian album", color:"forest", emblem:"stamp", createdAt: now - 320 * DAY};
    docs.al_demo2 = {kind:"album", schema:2, name:"Europe", color:"wine", emblem:"globe", createdAt: now - 310 * DAY};
    docs.al_demo3 = {kind:"album", schema:2, name:"Swap copies", color:"sage", emblem:"copy", createdAt: now - 100 * DAY};
    for (const se of SERIES) {
      docs[se.k] = {kind:"series", schema:2, demo:true, allapot: se.ok ? "megerositett" : "megerositesre_var", cim:se.cim, orszag:se.orszag, ev:se.ev,
        tagok: se.dens.map((d, i) => ({nevertek:d, szin:"", tema:se.tema, mbk:"", michel:"", ar:{postatiszta:{min:1 + i * .4, max:2 + i * .6}, pecsetelt:{min:.4 + i * .2, max:.9 + i * .3}}})),
        teljes_sor:{postatiszta:{min:9, max:15}, pecsetelt:{min:3, max:6}}};
      for (const m of se.own) makeItem(docs, n++, {nev:`${se.cim.replace(/ \(demó.*\)/, "")} ${se.dens[m]}`, orszag:se.orszag, ev:se.ev, nevertek:se.dens[m], tema:se.tema, sorozat:se.cim, seriesKey:se.k, memberIdx:m, base:.5 + m * .3});
    }
    for (const s of SINGLES) makeItem(docs, n++, {nev:s[0], orszag:s[1], ev:s[2], nevertek:s[3], tema:s[4], base: s[2] === "1871" ? 38 : undefined});
    // duplikátumok és cserepéldány
    makeItem(docs, n++, {nev:"Bridges 20 f", orszag:"Hungary", ev:"1949", nevertek:"20 f", tema:"architecture", sorozat:"Bridges (demo series)", seriesKey:"se_demo-hidak", memberIdx:0, tipus:"duplikatum", album:"al_demo3", base:.5});
    makeItem(docs, n++, {nev:"Bridges 20 f", orszag:"Hungary", ev:"1949", nevertek:"20 f", tema:"architecture", sorozat:"Bridges (demo series)", seriesKey:"se_demo-hidak", memberIdx:0, tipus:"csere", album:"al_demo3", base:.5});
    makeItem(docs, n++, {nev:"Parliament (demo)", orszag:"Hungary", ev:"1953", nevertek:"1 Ft", tema:"architecture", tipus:"duplikatum", album:"al_demo3"});
    // kívánságlista
    docs.wi_demo1 = {kind:"wish", schema:2, cim:"Songbirds (demo) – 60 f", orszag:"Hungary", ev:"1961", nevertek:"60 f", seriesKey:"se_demo-madarak", memberIdx:4, maxAr:1500, megjegyzes:"Looking for a mint copy", createdAt: now - 12 * DAY};
    docs.wi_demo2 = {kind:"wish", schema:2, cim:"Summer Games (demo) – 40 h", orszag:"Czechoslovakia", ev:"1972", nevertek:"40 h", seriesKey:"se_demo-sport", memberIdx:1, maxAr:null, megjegyzes:"", createdAt: now - 30 * DAY};
    docs.wi_demo3 = {kind:"wish", schema:2, cim:"Crowned post horn 10 kr (demo)", orszag:"Hungary", ev:"1871", nevertek:"10 kr", seriesKey:"", memberIdx:-1, maxAr:20000, megjegyzes:"Watch at stamp fairs", createdAt: now - 60 * DAY};
    // értéktörténet (szimulált, 12 hónap)
    const items = Object.values(docs).filter(d => d.kind === "item"), pts = [];
    for (let m = 12; m >= 0; m--) {
      const t = now - m * 30 * DAY, pf = {}; let all = 0;
      for (const it of items) { if (it.createdAt > t) continue; const ev = [...it.ertekelesek].reverse().find(e => e.t <= t) || it.ertekelesek[0], v = (ev.min + ev.max) / 2; all += v; pf[it.pf] = (pf[it.pf] || 0) + v; }
      pts.push({t, all:+all.toFixed(2), pf});
    }
    docs.hist = {kind:"hist", schema:2, points:pts, lastRefresh: now - 9 * DAY};
    docs.prefs = {kind:"prefs", schema:2, savedArticles:["magyar-kezdetek"]};
    return docs;
  };
})();
