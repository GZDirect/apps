/* GENERÁLT FÁJL – ne szerkeszd. Forrás: js/articles.js, szótár: tools/i18n/en.json, eszköz: tools/i18n/build-en.js */
/* PHILORA Tudástár – cikkek. Tényállítások forrásai a cikkek végén; ahol nincs forrás, általános filatéliai ismeret. */
(() => {
  const CATS = [
    {k:"tortenet", l:"History of stamps"},
    {k:"allapot", l:"Condition and quality"},
    {k:"magyar", l:"Hungarian philately"},
    {k:"ritkasag", l:"Rarities and values"},
    {k:"hamisitvany", l:"Spotting forgeries"},
    {k:"kezikonyv", l:"Collector’s handbook"}
  ];
  const ART = [
    {id:"penny-black", cat:"tortenet", t:"The first stamp: the Penny Black", lead:"In 1840 a simple idea in Great Britain changed letter-writing: postage is paid in advance, by the sender.", min:4, body:[
      ["p","Before stamps, postage was usually paid by the recipient, and the charge depended on distance. Rowland Hill’s reform brought two things: a uniform, weight-based rate across the country, and prepaid postage proven by a small piece of paper stuck on the letter."],
      ["p","The first such stamp was the black one-penny Penny Black showing Queen Victoria’s profile, valid from May 1840. British stamps still don’t show the country’s name – a tradition of the world’s first stamp-issuing country."],
      ["h","Why does it still matter?"],
      ["p","The Penny Black is not rare: it was printed in large numbers, so plain copies in good condition are available. Its value depends on the margins (early British stamps were imperforate and cut with scissors), the cancellation and the combination of corner letters."],
      ["tip","On an imperforate stamp, clear margins on all four sides are one of the most important measures of value."]
    ]},
    {id:"magyar-kezdetek", cat:"tortenet", t:"Stamps in Hungary 1850–1871", lead:"From Austrian stamps to the first domestically produced issue: how Hungarian stamp history began.", min:5, body:[
      ["p","In Hungary the Austrian postal administration issued stamps on 1 June 1850. These Austrian kreuzer stamps, inscribed “imperial and royal”, are part of Hungarian collections too, since they were used here."],
      ["p","After the Compromise of 1867 the Hungarian postal administration became independent, and the first Hungarian stamp issue appeared that same year. The painter Mór Than had already designed a stamp in 1848, but after the War of Independence it was never issued."],
      ["p","The first postage stamps produced in Hungary went into use on 1 May 1871: a lithographed set of six values, followed gradually from mid-June by engraved versions of the same design."],
      ["tip","Telling the 1871 lithographed and engraved versions apart takes expertise – for a valuable copy, ask an expert."]
    ], src:[["Magyar Posta – 150 years of Hungarian stamp production (2021)","https://www.posta.hu/stamps/stamps/new-stamps/150-years-of-hungarian-stamp-production-2021"],["MEK – the motif history of Hungarian stamps (1 June 1850) [in Hungarian]","https://www.mek.oszk.hu/21100/21177/21177.pdf"],["Józsefné Sipos: The first Hungarian stamp issue of 1867 (MEK) [in Hungarian]","https://www.mek.oszk.hu/18300/18336/18336.pdf"],["Hungarian Museum of Trade and Tourism – pocket calendar, 1974","https://bu.hu.museum-digital.org/pdf/object/682256.pdf?lang=en"]]},
    {id:"allapot-alapok", cat:"allapot", t:"Mint, hinged, used – what do they mean?", lead:"A stamp’s condition matters at least as much to its value as its rarity.", min:4, body:[
      ["p","Mint never hinged (**) means the original gum is intact and the stamp was never mounted in an album with a hinge. A hinged (*) stamp shows a hinge mark or hinge remnant on the back. Used (⊙) means postally used."],
      ["p","The price gap between hinged and mint varies a lot by period: on modern stamps a hinge mark lowers the value considerably, while on classic (19th-century) stamps the difference can be smaller, because few copies with original gum survive anyway."],
      ["h","What can a photo tell?"],
      ["p","Gum and hinge marks are only visible on the back. For stamps stuck in an album or under foil, the app therefore estimates cautiously and flags that the gum cannot be checked."],
      ["tip","A “regummed” stamp is not mint – detecting this is a job for an expert."]
    ]},
    {id:"centrirozas", cat:"allapot", t:"Centring, perforation, quality grades", lead:"What makes a copy “fine”? The position of the design, intact teeth and fresh colour are what count.", min:4, body:[
      ["p","Centring shows how well the design sits in the middle of the perforated paper. If the margins are equal on all sides, the copy is excellent; if the perforations cut into the design, the value drops considerably."],
      ["p","Missing, short or blunt teeth reduce the value, as do faded or spotted colours. A thin (damage to the back of the paper) is often visible only against the light."],
      ["h","The app’s scale"],
      ["p","The app uses the English abbreviations common internationally (Superb, XF, VF, F, VG) and adds a score from 1 to 10. This is the app’s own indicative scale, not an official grading system."]
    ]},
    {id:"kőnyomat-réznyomat", cat:"magyar", t:"The 1871 issue: lithograph and engraving", lead:"The first year of Hungarian stamp production brought two printing methods – and questions that still intrigue collectors.", min:3, body:[
      ["p","In spring 1871 domestic stamp production began with lithography and soon switched to engraving. The two versions share the same design, so telling them apart depends on the character of the print and small details."],
      ["p","The lithographed versions are generally more valuable. Since the difference is hard to see in a photo, in such cases the app offers several possible matches and asks you to confirm."],
      ["tip","If you have an 1871 stamp, check the sharpness of the lines with a magnifier and compare it with a reliable catalogue illustration – for a valuable copy, get a certificate."]
    ], src:[["Magyar Posta – 150 years of Hungarian stamp production (2021)","https://www.posta.hu/stamps/stamps/new-stamps/150-years-of-hungarian-stamp-production-2021"],["Czakó–Kántás–Szabó: Notes on our 1871 lithographed postage stamps (Stamp Museum, 2024) [in Hungarian]","https://real.mtak.hu/219879/"]]},
    {id:"belyegmuzeum", cat:"magyar", t:"The Stamp Museum in Budapest", lead:"The museum in Hársfa Street holds one of the world’s most important stamp collections.", min:3, body:[
      ["p","The idea of a stamp museum arose among the leaders of the Hungarian post in the 1920s and was realised about ten years later. In 1940 it moved to its current home at Hársfa utca 47, Budapest."],
      ["p","The interior is decorated with unique tiles made by the Zsolnay factory. The collection includes not only stamps but also stamp designs, printing plates, cancelling devices and documents."],
      ["tip","The museum is a good place to see rare items in person and compare them with your own."]
    ], src:[["museum.hu – Stamp Museum","https://www.museum.hu/museum/10/Stamp_Museum/actual?f"],["We Love Budapest – Stamp Museum [in Hungarian]","https://welovebudapest.com/cikk/2023/2/1/latnivalok-es-kultura-belyegmuzeum-belyegek-kiallitas"]]},
    {id:"mitol-ritka", cat:"ritkasag", t:"What makes a stamp rare?", lead:"Age alone does not make a stamp rare. Print run, errors and survival are what count.", min:4, body:[
      ["p","A 150-year-old stamp can be cheap if millions were printed. Small print runs, short periods of use, printing errors and special varieties are what make stamps rare."],
      ["ul",["Error: inverted centre, missing colour, double print. A famous example is the 1918 US “Inverted Jenny”, with the aeroplane printed upside down.","Variety: different perforation, watermark, paper or shade.","Cancellation: a rare post office or an early date.","Unique item: only one copy of the 1856 British Guiana one-cent stamp is known."]],
      ["p","Rare varieties often differ from the common stamp only in small details – which is why a catalogue and an expert matter."]
    ]},
    {id:"katalogusar", cat:"ritkasag", t:"Catalogue price or market price?", lead:"The figure in the catalogue is rarely what a stamp actually sells for.", min:3, body:[
      ["p","The catalogue price is a reference value published by the catalogue’s publisher, usually for a copy in excellent condition. The actual market price – at auction, from a dealer or at a stamp fair – is often a fraction of it for common stamps, but can exceed it for sought-after rarities."],
      ["p","So the app gives not a catalogue price but a preliminary AI estimate of the realistic market range, and labels it as such everywhere. It currently has no access to a live auction data feed."],
      ["tip","If you want to sell, check the actual hammer prices of similar lots at auctions or on marketplaces."]
    ]},
    {id:"hamisitvany-tipusok", cat:"hamisitvany", t:"Types of forgery", lead:"Not every forgery is a complete copy: often a genuine stamp is altered to look more valuable.", min:4, body:[
      ["ul",["Complete forgery: the whole stamp is an imitation, often with different paper and printing.","Forged overprint: a more valuable overprint added later to a genuine stamp.","Forged cancellation: a rare postmark imitated on a cheap mint stamp.","Repaired stamp: added teeth, filled thin, regummed back.","Perforation tampering: a perforated stamp is trimmed into a fake “imperforate”."]],
      ["p","Classic and high-value stamps are forged most often. Most of these cannot be detected from a photo."],
      ["tip","For a valuable stamp, an official expertising certificate is the only reliable answer."]
    ]},
    {id:"otthoni-ellenorzes", cat:"hamisitvany", t:"Checking at home: perforation gauge, watermark, UV", lead:"A few simple tools tell you a lot about a stamp – but not everything.", min:4, body:[
      ["p","A perforation gauge shows how many teeth fall within 2 centimetres. Varieties of the same stamp with different perforations can differ greatly in value."],
      ["p","A watermark is a pattern put into the paper when it is made; it can be seen against the light or with watermark fluid. A UV lamp can reveal differences in paper and ink, and later repairs."],
      ["p","These details cannot be determined reliably from a photo, so the app shows perforation, watermark and gum as unverified AI suggestions."],
      ["tip","Only use watermark fluid on stamps whose inks are not sensitive to it – if in doubt, ask an expert."]
    ]},
    {id:"tarolas", cat:"kezikonyv", t:"Storing stamps properly", lead:"Good storage keeps a stamp’s condition – and its value – for decades.", min:3, body:[
      ["ul",["Stockbook: quick, flexible storage in strips, without hinges.","Hingeless album: mounts in pockets, which protects the gum of mint stamps.","Tongs: never handle stamps with your fingers – skin oil and moisture cause damage.","Environment: a dry, dark place with a steady temperature; avoid cellars and attics."]],
      ["p","Don’t soak stamps off old album pages unless you are sure of what you’re doing: mint gum can be lost and the ink can be damaged."]
    ]},
    {id:"fotozas", cat:"kezikonyv", t:"How to photograph a stamp for the app", lead:"A good photo gives a more accurate identification and estimate.", min:2, body:[
      ["ul",["Shoot straight from above so the stamp isn’t distorted.","Use diffuse daylight, not the flash.","Under foil or in a stockbook, light it slightly from the side to avoid glare.","Let the stamp fill the frame, with the perforation edges visible.","For an album page, get the whole page in the photo, straight on."]],
      ["p","A photo of the back is optional: if the stamp isn’t stuck down, it helps judge the gum and hinge marks."]
    ]}
  ];
  window.BS = window.BS || {}; window.BS.CATS = CATS; window.BS.ARTICLES = ART;
})();
