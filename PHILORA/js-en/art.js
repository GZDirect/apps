/* GENERÁLT FÁJL – ne szerkeszd. Forrás: js/art.js, szótár: tools/i18n/en.json, eszköz: tools/i18n/build-en.js */
/* PHILORA saját vektoros illusztrációk (nem forrásképek másolatai). */
(() => {
  const A = {};
  const perfPath = (x, y, w, h, r = 2.2, step = 6.4) => {
    // bélyegforma szabályos félkör-fogazattal, egyetlen path-ként
    let d = `M${x} ${y + r}`;
    const nx = Math.max(2, Math.round(w / step)), ny = Math.max(2, Math.round(h / step)), sx = w / nx, sy = h / ny;
    for (let i = 0; i < nx; i++) { const cx = x + sx * i + sx / 2; d += ` L${cx - r} ${y} A${r} ${r} 0 0 0 ${cx + r} ${y}`; }
    d += ` L${x + w} ${y}`;
    for (let i = 0; i < ny; i++) { const cy = y + sy * i + sy / 2; d += ` L${x + w} ${cy - r} A${r} ${r} 0 0 0 ${x + w} ${cy + r}`; }
    d += ` L${x + w} ${y + h}`;
    for (let i = nx - 1; i >= 0; i--) { const cx = x + sx * i + sx / 2; d += ` L${cx + r} ${y + h} A${r} ${r} 0 0 0 ${cx - r} ${y + h}`; }
    d += ` L${x} ${y + h}`;
    for (let i = ny - 1; i >= 0; i--) { const cy = y + sy * i + sy / 2; d += ` L${x} ${cy + r} A${r} ${r} 0 0 0 ${x} ${cy - r}`; }
    return d + " Z";
  };
  A.perfPath = perfPath;

  /* Kezdőlapi hero: bélyegzőkörök, hullámos érvénytelenítő vonalak, egymásra fektetett bélyegek */
  A.hero = () => `<svg class="hero-art" viewBox="0 0 360 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs><linearGradient id="hg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#C5A46D" stop-opacity=".9"/><stop offset="1" stop-color="#8F6E3A" stop-opacity=".9"/></linearGradient></defs>
    <g fill="none" stroke="#C5A46D" stroke-opacity=".22" stroke-width="1.2">
      <circle cx="300" cy="40" r="34"/><circle cx="300" cy="40" r="27"/>
      <path d="M150 30 q12 -8 24 0 t24 0 t24 0 t24 0 t24 0 t24 0"/><path d="M150 40 q12 -8 24 0 t24 0 t24 0 t24 0 t24 0 t24 0"/><path d="M150 50 q12 -8 24 0 t24 0 t24 0 t24 0 t24 0 t24 0"/>
    </g>
    <text x="300" y="36" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-size="9" fill="#C5A46D" fill-opacity=".45" letter-spacing="1">BUDAPEST</text>
    <text x="300" y="49" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-size="8" fill="#C5A46D" fill-opacity=".45">1871</text>
    <g transform="rotate(-8 250 105)"><path d="${perfPath(212, 70, 62, 74)}" fill="#F5F0E5" fill-opacity=".92"/><rect x="219" y="77" width="48" height="60" fill="none" stroke="#10382F" stroke-opacity=".5"/><circle cx="243" cy="103" r="13" fill="none" stroke="#10382F" stroke-opacity=".45"/><path d="M234 126h18" stroke="#10382F" stroke-opacity=".45"/></g>
    <g transform="rotate(6 318 110)"><path d="${perfPath(286, 78, 58, 68)}" fill="url(#hg1)"/><rect x="293" y="85" width="44" height="54" fill="none" stroke="#10382F" stroke-opacity=".55"/><path d="M302 124 l13 -22 l13 22z" fill="none" stroke="#10382F" stroke-opacity=".55"/></g>
  </svg>`;

  /* Üres gyűjtemény: nyitott album, csipesz, bélyeg */
  A.empty = () => `<svg class="empty-art" viewBox="0 0 240 150" aria-hidden="true">
    <ellipse cx="120" cy="136" rx="92" ry="8" fill="#000" opacity=".12"/>
    <path d="M28 30 L118 22 L118 128 L28 132 Z" fill="#16483B" stroke="#C5A46D" stroke-opacity=".6"/>
    <path d="M122 22 L212 30 L212 132 L122 128 Z" fill="#16483B" stroke="#C5A46D" stroke-opacity=".6"/>
    <g stroke="#0C2D26" stroke-width="7" opacity=".9"><path d="M38 56 L110 51"/><path d="M38 92 L110 88"/><path d="M130 51 L202 56"/><path d="M130 88 L202 92"/></g>
    <path d="${perfPath(48, 36, 22, 26, 1.4, 4.4)}" fill="#F5F0E5"/><rect x="51" y="39" width="16" height="20" fill="#C5A46D" opacity=".55"/>
    <path d="${perfPath(78, 72, 22, 26, 1.4, 4.4)}" fill="#F5F0E5"/><rect x="81" y="75" width="16" height="20" fill="#7F9B8E" opacity=".7"/>
    <path d="${perfPath(150, 36, 22, 26, 1.4, 4.4)}" fill="#F5F0E5" fill-opacity=".25" stroke="#C5A46D" stroke-dasharray="2 2"/>
    <path d="M170 104 L206 84 L210 90 L176 110 Z" fill="#C5A46D"/><path d="M170 104 L160 112" stroke="#C5A46D" stroke-width="2"/>
  </svg>`;

  /* Cikkborítók kategóriánként */
  const COVER = {
    tortenet: ["#10382F", "#C5A46D", (c) => `<path d="${perfPath(120, 30, 80, 96)}" fill="#F5F0E5"/><rect x="130" y="40" width="60" height="76" fill="${c}"/><circle cx="160" cy="72" r="18" fill="#10382F" opacity=".7"/><path d="M146 104h28" stroke="#10382F" stroke-width="2" opacity=".6"/>`],
    allapot: ["#16483B", "#E0C48E", (c) => `<path d="${perfPath(70, 36, 70, 84)}" fill="#F5F0E5"/><rect x="80" y="46" width="50" height="64" fill="#7F9B8E" opacity=".6"/><circle cx="196" cy="74" r="34" fill="none" stroke="${c}" stroke-width="6"/><path d="M220 98 L250 128" stroke="${c}" stroke-width="9" stroke-linecap="round"/>`],
    magyar: ["#10382F", "#C5A46D", (c) => `<path d="${perfPath(110, 26, 100, 104)}" fill="#F5F0E5"/><rect x="122" y="38" width="76" height="80" fill="#10382F" opacity=".12"/><path d="M140 96 q20 -36 40 0" fill="none" stroke="#10382F" stroke-width="3"/><path d="M136 70 l24 -22 l24 22" fill="none" stroke="${c}" stroke-width="3"/><circle cx="160" cy="44" r="5" fill="${c}"/>`],
    ritkasag: ["#242A27", "#C5A46D", (c) => `<path d="${perfPath(118, 30, 84, 98)}" fill="${c}"/><rect x="128" y="40" width="64" height="78" fill="none" stroke="#242A27" stroke-width="1.5"/><path d="M160 54 l7 14 15 2 -11 10 3 15 -14 -7 -14 7 3 -15 -11 -10 15 -2z" fill="#242A27" opacity=".75"/>`],
    hamisitvany: ["#16483B", "#E0C48E", (c) => `<path d="${perfPath(70, 34, 72, 86)}" fill="#F5F0E5"/><path d="${perfPath(178, 34, 72, 86)}" fill="#F5F0E5" opacity=".55"/><path d="M150 70 h20 M150 84 h20" stroke="${c}" stroke-width="3"/><path d="M196 56 l36 46 M232 56 l-36 46" stroke="#8A2B2B" stroke-width="3" opacity=".7"/>`],
    kezikonyv: ["#10382F", "#C5A46D", (c) => `<rect x="80" y="34" width="160" height="92" rx="6" fill="#16483B" stroke="${c}" stroke-opacity=".7"/><g stroke="#0C2D26" stroke-width="8"><path d="M90 62h140M90 98h140"/></g><path d="${perfPath(100, 44, 22, 26, 1.4, 4.4)}" fill="#F5F0E5"/><path d="${perfPath(132, 44, 22, 26, 1.4, 4.4)}" fill="#F5F0E5"/><path d="${perfPath(164, 80, 22, 26, 1.4, 4.4)}" fill="#F5F0E5"/><path d="M200 114 L236 92" stroke="${c}" stroke-width="4" stroke-linecap="round"/>`]
  };
  A.cover = (cat, h = 160) => { const [bg, c, fn] = COVER[cat] || COVER.kezikonyv; return `<svg class="cover-art" viewBox="0 0 320 160" preserveAspectRatio="xMidYMid slice" style="height:${h}px" aria-hidden="true"><rect width="320" height="160" fill="${bg}"/><g fill="none" stroke="${c}" stroke-opacity=".14"><circle cx="40" cy="30" r="44"/><circle cx="40" cy="30" r="34"/><path d="M0 140 q20 -10 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0"/></g>${fn(c)}</svg>`; };

  /* Szkennelési keret: bélyegformájú (egyedi) vagy albumoldal-rács */
  A.frame = (mode) => mode === "page"
    ? `<svg class="vf-frame" viewBox="0 0 300 225" aria-hidden="true"><rect x="18" y="14" width="264" height="197" rx="6" fill="none" stroke="#C5A46D" stroke-width="2" stroke-dasharray="7 5"/>${[0,1,2].map(r => [0,1,2,3].map(c => `<path d="${perfPath(38 + c * 60, 30 + r * 60, 44, 48, 1.4, 4.6)}" fill="#F5F0E5" fill-opacity=".1" stroke="#F5F0E5" stroke-opacity=".35"/>`).join("")).join("")}<g stroke="#C5A46D" stroke-width="4" stroke-linecap="round"><path d="M18 40V14h26M256 14h26v26M282 185v26h-26M44 211H18v-26"/></g></svg>`
    : `<svg class="vf-frame" viewBox="0 0 300 225" aria-hidden="true"><path d="${perfPath(100, 22, 100, 122 + 58, 3, 9.2)}" fill="#F5F0E5" fill-opacity=".08" stroke="#C5A46D" stroke-width="2"/><g stroke="#C5A46D" stroke-width="4" stroke-linecap="round"><path d="M86 34V12h22M192 12h22v22M214 192v22h-22M108 214H86v-22"/></g></svg>`;

  /* Fotózási útmutató ikonjai */
  A.tips = [
    ["Straight from above", `<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="14" y="20" width="20" height="22" fill="none" stroke="currentColor" stroke-width="2"/><path d="M24 4v10M19 9l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2"/></svg>`],
    ["Diffuse light, no flash", `<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="18" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M24 4v4M10 18H6M42 18h-4M14 8l3 3M34 8l-3 3" stroke="currentColor" stroke-width="2"/><rect x="14" y="32" width="20" height="12" fill="none" stroke="currentColor" stroke-width="2"/></svg>`],
    ["Under foil: side light", `<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="16" y="18" width="20" height="24" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 14l28 0" stroke="currentColor" stroke-width="2" stroke-dasharray="3 2"/><path d="M4 30l10-4" stroke="currentColor" stroke-width="2"/><circle cx="4" cy="31" r="2" fill="currentColor"/></svg>`],
    ["Fill the frame", `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 16V8h8M32 8h8v8M40 32v8h-8M16 40H8v-8" fill="none" stroke="currentColor" stroke-width="2"/><rect x="14" y="13" width="20" height="22" fill="currentColor" opacity=".25"/></svg>`]
  ];


  window.BS = window.BS || {}; window.BS.art = A;
})();
