/* PHILORA Tudástár – cikkek. Tényállítások forrásai a cikkek végén; ahol nincs forrás, általános filatéliai ismeret. */
(() => {
  const CATS = [
    {k:"tortenet", l:"A bélyegek története"},
    {k:"allapot", l:"Állapot és minőség"},
    {k:"magyar", l:"Magyar filatélia"},
    {k:"ritkasag", l:"Ritkaságok és értékek"},
    {k:"hamisitvany", l:"Hamisítványok felismerése"},
    {k:"kezikonyv", l:"Gyűjtői kézikönyv"}
  ];
  const ART = [
    {id:"penny-black", cat:"tortenet", t:"Az első bélyeg: a Penny Black", lead:"1840-ben Nagy-Britanniában egy egyszerű ötlet megváltoztatta a levelezést: a postadíjat előre, a feladó fizeti meg.", min:4, body:[
      ["p","A bélyeg előtt a levél díját többnyire a címzett fizette, és a díj a távolságtól függött. Rowland Hill reformja két dolgot hozott: egységes, súly szerinti díjat az ország területén, és előre megfizetett díjat, amelyet egy felragasztható papírdarab igazolt."],
      ["p","Az első ilyen bélyeg az 1 pennys, fekete színű, Viktória királynő profilját ábrázoló Penny Black lett, amely 1840 májusában vált érvényessé. A brit bélyegeken ma sem szerepel az ország neve – ez a világ első bélyegkiadójának hagyománya."],
      ["h","Miért fontos ma is?"],
      ["p","A Penny Black nem ritka: nagy példányszámban nyomták, ezért jó állapotú, de egyszerű példányai elérhetők. Az értéket a szélek (a korai brit bélyegek fogazatlanok, ollóval vágták őket), a bélyegzés és a sarokbetűk kombinációja határozza meg."],
      ["tip","Fogazatlan bélyegnél a négy oldalon látható szabad margó az egyik legfontosabb értékmérő."]
    ]},
    {id:"magyar-kezdetek", cat:"tortenet", t:"Bélyegek Magyarországon 1850–1871", lead:"Az osztrák bélyegektől az első hazai gyártású kiadásig: így indult a magyar bélyegtörténet.", min:5, body:[
      ["p","Magyarországon az osztrák postaigazgatás 1850. június 1-jén bocsátott forgalomba bélyeget. Ezek a „császári és királyi” feliratú, krajcáros osztrák bélyegek a magyar gyűjteményeknek is részei, hiszen itt használták őket."],
      ["p","A kiegyezés után, 1867-ben önállóvá vált a magyar postaigazgatás, és ugyanebben az évben megjelent az első magyar bélyegkiadás. Than Mór festőművész már 1848-ban készített bélyegtervet, de a szabadságharc után ebből nem lett kiadás."],
      ["p","Az első, már Magyarországon gyártott postabélyegek 1871. május 1-jén kerültek forgalomba: hat értékből álló kőnyomatos sor, amelyet június közepétől fokozatosan az azonos rajzú réznyomatos változatok követtek."],
      ["tip","Az 1871-es kőnyomatos és réznyomatos változatok elkülönítése szakértelmet igényel – értékes példánynál kérj szakértői véleményt."]
    ], src:[["Magyar Posta – 150 éves a magyar bélyeggyártás (2021)","https://www.posta.hu/stamps/stamps/new-stamps/150-years-of-hungarian-stamp-production-2021"],["MEK – a magyar bélyegek motívumtörténete (1850. június 1.)","https://www.mek.oszk.hu/21100/21177/21177.pdf"],["Sipos Józsefné: Az 1867. évi első magyar bélyegkiadás (MEK)","https://www.mek.oszk.hu/18300/18336/18336.pdf"],["Magyar Kereskedelmi és Vendéglátóipari Múzeum – kártyanaptár, 1974","https://bu.hu.museum-digital.org/pdf/object/682256.pdf?lang=en"]]},
    {id:"allapot-alapok", cat:"allapot", t:"Postatiszta, falcos, pecsételt – mit jelentenek?", lead:"A bélyeg értékét az állapota legalább annyira meghatározza, mint a ritkasága.", min:4, body:[
      ["p","Postatiszta (**) az a bélyeg, amelynek eredeti gumizása sértetlen, és sosem ragasztották falccal albumba. Falcos (*) bélyegen a hátoldalon falcnyom vagy falcmaradvány látszik. Pecsételt (⊙) a postailag használt bélyeg."],
      ["p","A falcos és a postatiszta ár közötti különbség korszakonként nagyon eltér: modern bélyegeknél a falcnyom jelentősen rontja az értéket, klasszikus (19. századi) bélyegeknél a különbség kisebb lehet, mert eredeti gumizású példány eleve kevés maradt fenn."],
      ["h","Fotóról mi dönthető el?"],
      ["p","A gumizás és a falcnyom csak a hátoldalon látszik. Albumba ragasztott vagy fóliázott bélyegnél ezért az alkalmazás óvatosan becsül, és jelzi, hogy a gumizás nem ellenőrizhető."],
      ["tip","Az utólag „regumizott” bélyeg nem postatiszta – ennek kiszűrése szakértői feladat."]
    ]},
    {id:"centrirozas", cat:"allapot", t:"Centrírozás, fogazat, minőségi fokozatok", lead:"Mitől lesz egy példány „szép”? A kép helyzete, a fogak épsége és a szín frissessége a döntő.", min:4, body:[
      ["p","A centrírozás azt mutatja, mennyire középen van a nyomat a fogazott papírdarabon. Ha minden oldalon egyforma a margó, a példány kiváló; ha a fogazat belemar a képbe, az érték jelentősen csökken."],
      ["p","A fogazatnál hiányzó, rövid vagy tompa fog, a szín esetén fakulás vagy foltosság csökkenti az értéket. A vékonyodás (a papír hátoldali sérülése) gyakran csak ellenfényben látszik."],
      ["h","Az alkalmazás skálája"],
      ["p","Az app a nemzetközi gyakorlatban elterjedt angol rövidítéseket használja (Superb, XF, VF, F, VG), és mellé 1–10-es pontszámot ad. Ez az app saját, tájékoztató skálája, nem hivatalos minősítési rendszer."]
    ]},
    {id:"kőnyomat-réznyomat", cat:"magyar", t:"Az 1871-es kiadás: kőnyomat és réznyomat", lead:"A magyar bélyeggyártás első éve két nyomdatechnikát hozott – és máig izgalmas kérdéseket a gyűjtőknek.", min:3, body:[
      ["p","1871 tavaszán a hazai bélyeggyártás kőnyomtatással indult, majd hamarosan áttértek a réznyomtatásra. A két változat rajza azonos, ezért a megkülönböztetés a nyomat jellegén és apró részleteken múlik."],
      ["p","A kőnyomatos változatok általában értékesebbek. Mivel a különbség fotón nehezen látható, az alkalmazás ilyen esetben több lehetséges találatot ad, és kéri a megerősítésedet."],
      ["tip","Ha egy 1871-es bélyeged van, nézd meg nagyítóval a vonalak élességét, és hasonlítsd össze megbízható katalógusábrával – értékes példánynál kérj attesztet."]
    ], src:[["Magyar Posta – 150 éves a magyar bélyeggyártás (2021)","https://www.posta.hu/stamps/stamps/new-stamps/150-years-of-hungarian-stamp-production-2021"],["Czakó–Kántás–Szabó: Adalékok az 1871-es kőnyomtatású postabélyegeinkhez (Bélyegmúzeum, 2024)","https://real.mtak.hu/219879/"]]},
    {id:"belyegmuzeum", cat:"magyar", t:"A budapesti Bélyegmúzeum", lead:"A Hársfa utcai múzeum a világ egyik legjelentősebb bélyeggyűjteményét őrzi.", min:3, body:[
      ["p","A bélyegmúzeum ötlete az 1920-as években fogalmazódott meg a magyar posta vezetőiben, és mintegy tíz évvel később valósult meg. 1940-ben költözött mai helyére, a budapesti Hársfa utca 47. alá."],
      ["p","Az épület belsejét egyedi, Zsolnay-gyárban készült csempék díszítik. A gyűjtemény nemcsak bélyegeket, hanem bélyegvázlatokat, nyomóformákat, bélyegzőket és dokumentumokat is tartalmaz."],
      ["tip","A múzeum jó hely arra, hogy ritka darabokat élőben láss, és összevesd a sajátjaiddal."]
    ], src:[["museum.hu – Bélyegmúzeum","https://www.museum.hu/museum/10/Stamp_Museum/actual?f"],["We Love Budapest – Bélyegmúzeum","https://welovebudapest.com/cikk/2023/2/1/latnivalok-es-kultura-belyegmuzeum-belyegek-kiallitas"]]},
    {id:"mitol-ritka", cat:"ritkasag", t:"Mitől ritka egy bélyeg?", lead:"A kor önmagában nem tesz ritkává egy bélyeget. A példányszám, a hibák és a fennmaradás számít.", min:4, body:[
      ["p","Egy 150 éves bélyeg is lehet olcsó, ha milliószám nyomták. Ritkává a kis példányszám, a rövid forgalmi idő, a nyomdai hibák (tévnyomatok) és a különleges változatok teszik."],
      ["ul",["Tévnyomat: fordított középrész, hiányzó szín, kettős nyomat. Híres példa az 1918-as amerikai „Inverted Jenny”, ahol a repülőgép fejjel lefelé került a bélyegre.","Változat: eltérő fogazat, vízjel, papír vagy színárnyalat.","Bélyegzés: ritka postahely vagy korai dátum.","Egyedi darab: a Brit Guyana 1856-os 1 centes bélyegéből egyetlen példány ismert."]],
      ["p","A ritka változatok gyakran csak apró részletekben különböznek a tömegbélyegtől – ezért fontos a katalógus és a szakértő."]
    ]},
    {id:"katalogusar", cat:"ritkasag", t:"Katalógusár vagy piaci ár?", lead:"A katalógusban szereplő szám ritkán az, amennyit ténylegesen fizetnek egy bélyegért.", min:3, body:[
      ["p","A katalógusár a kiadó által közölt referenciaérték, ami jellemzően kiváló állapotú példányra vonatkozik. A tényleges piaci ár – aukción, kereskedőnél, börzén – a tömegbélyegeknél gyakran ennek töredéke, a keresett ritkaságoknál viszont meg is haladhatja."],
      ["p","Az alkalmazás ezért nem katalógusárat, hanem előzetes AI-becslést ad a reális piaci sávra, és ezt mindenhol jelöli. Élő aukciós adatfolyamhoz jelenleg nincs hozzáférése."],
      ["tip","Ha eladni szeretnél, nézd meg a hasonló tételek tényleges leütési árát magyar aukciókon vagy piactereken."]
    ]},
    {id:"hamisitvany-tipusok", cat:"hamisitvany", t:"A hamisítványok típusai", lead:"Nem minden hamisítvány teljes másolat: sokszor egy valódi bélyeget alakítanak át értékesebbé.", min:4, body:[
      ["ul",["Teljes hamisítvány: az egész bélyeg utánzat, gyakran eltérő papírral és nyomással.","Felülnyomat-hamisítás: valódi bélyegre utólag nyomott, értékesebb felülnyomat.","Hamis bélyegzés: olcsó postatiszta bélyegre ritka bélyegzőt imitálnak.","Javított bélyeg: pótolt fog, kitöltött vékonyodás, újragumizott hátoldal.","Fogazat-manipuláció: fogazott bélyegből vágott „fogazatlant” készítenek."]],
      ["p","A klasszikus és a magas értékű bélyegek a leggyakrabban hamisítottak. Fotóról ezek többsége nem szűrhető ki."],
      ["tip","Értékes bélyegnél a hivatalos bélyegszakértői vizsgálat (attest) az egyetlen megbízható megoldás."]
    ]},
    {id:"otthoni-ellenorzes", cat:"hamisitvany", t:"Otthoni ellenőrzés: fogazatmérő, vízjel, UV", lead:"Néhány egyszerű eszközzel sokat megtudhatsz egy bélyegről – de nem mindent.", min:4, body:[
      ["p","A fogazatmérő megmutatja, hány fog esik 2 centiméterre. Ugyanannak a bélyegnek a különböző fogazatú változatai között nagy lehet az értékkülönbség."],
      ["p","A vízjel a papírba gyártáskor került minta, ellenfényben vagy vízjelkereső folyadékkal láthatóvá tehető. Az UV-lámpa a papír és a festék eltéréseit, utólagos javításokat mutathat meg."],
      ["p","Ezeket az adatokat fotóról nem lehet biztosan megállapítani, ezért az alkalmazás a fogazatot, a vízjelet és a gumizást ellenőrizetlen AI-javaslatként jelzi."],
      ["tip","Vízjelkereső folyadékot csak olyan bélyegen használj, amelynek a festéke nem érzékeny rá – ha bizonytalan vagy, kérdezz szakértőt."]
    ]},
    {id:"tarolas", cat:"kezikonyv", t:"Bélyegek helyes tárolása", lead:"A jó tárolás évtizedekre megőrzi a bélyeg állapotát – és az értékét.", min:3, body:[
      ["ul",["Berakó: gyors, rugalmas tárolás csíkokban, gumizás nélkül.","Falcmentes album: tasakos rögzítés, a postatiszta bélyegeknél ez kíméli a gumizást.","Csipesz: soha ne fogd a bélyeget ujjal – a bőr zsírja és nedvessége károsít.","Környezet: száraz, egyenletes hőmérsékletű, sötét hely; kerüld a pincét és a padlást."]],
      ["p","Régi albumokban a ragasztott bélyegeket ne áztasd le, ha nem vagy biztos a dolgodban: a postatiszta gumizás így elveszhet, és a festék is sérülhet."]
    ]},
    {id:"fotozas", cat:"kezikonyv", t:"Hogyan fotózd a bélyeget az alkalmazáshoz?", lead:"Jó fotóval pontosabb az azonosítás és a becslés.", min:2, body:[
      ["ul",["Fotózz pontosan felülről, hogy a bélyeg ne torzuljon.","Használj szórt nappali fényt, vakut ne.","Fólia vagy berakó alatt világíts kicsit oldalról, hogy ne tükröződjön.","A bélyeg töltse ki a keretet, és a fogazat széle is látsszon.","Albumoldalnál a teljes lap legyen a képen, egyenesen."]],
      ["p","A hátoldal fotója opcionális: ha a bélyeg nincs beragasztva, segít a gumizás és a falcnyom megítélésében."]
    ]}
  ];
  window.BS = window.BS || {}; window.BS.CATS = CATS; window.BS.ARTICLES = ART;
})();
