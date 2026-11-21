/* GENERÁLT FÁJL – ne szerkeszd. Forrás: js/icons.js, szótár: tools/i18n/en.json, eszköz: tools/i18n/build-en.js */
/* PHILORA ikonkészlet – saját, egységes vonalas ikonok (24×24, 1.8 vonalvastagság).
   Használat: HTML-ben <svg class="ic"><use href="#i-camera"/></svg>, JS-ben BS.ic("camera"). */
(() => {
  const P = {
    layers: '<path d="M12 3.5 21 8l-9 4.5L3 8z"/><path d="m3 12 9 4.5 9-4.5"/><path d="m3 16 9 4.5 9-4.5"/>',
    camera: '<path d="M3 8.5h3.2L8 6h8l1.8 2.5H21V19H3z"/><circle cx="12" cy="13.2" r="3.6"/>',
    album: '<rect x="3.5" y="3.5" width="17" height="17" rx="2"/><rect x="6.5" y="6.5" width="4.5" height="4.5"/><rect x="13" y="6.5" width="4.5" height="4.5"/><rect x="6.5" y="13" width="4.5" height="4.5"/><rect x="13" y="13" width="4.5" height="4.5"/>',
    home: '<path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5.5h4V20"/>',
    grid: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.2"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.2"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.2"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.2"/>',
    chart: '<path d="M4 19.5h16"/><path d="m5 15 4.5-4.5 3.5 3 6-6.5"/><path d="M15 7h4v4"/>',
    book: '<path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5z"/><path d="M5 19.5A1.5 1.5 0 0 0 6.5 21H19"/><path d="M9 7.5h6"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7"/><circle cx="12" cy="12" r="6.6"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
    check: '<path d="m4.5 12.5 4.5 4.5L19.5 7"/>',
    alert: '<path d="M12 3.5 21.5 20h-19z"/><path d="M12 10v4.5"/><circle cx="12" cy="17.3" r=".6" fill="currentColor"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5"/><circle cx="12" cy="7.8" r=".6" fill="currentColor"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    search: '<circle cx="10.8" cy="10.8" r="6.5"/><path d="m20 20-4.4-4.4"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 5.5H4.5v1.5A3 3 0 0 0 8 10M16 5.5h3.5v1.5A3 3 0 0 1 16 10"/><path d="M12 13v3.5M8.5 20h7M9.5 16.5h5V20h-5z"/>',
    refresh: '<path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3"/><path d="M19.5 4.5v4.5H15"/>',
    download: '<path d="M12 4v11"/><path d="m7.5 10.5 4.5 4.5 4.5-4.5"/><path d="M4.5 19.5h15"/>',
    upload: '<path d="M12 15V4"/><path d="m7.5 8.5 4.5-4.5 4.5 4.5"/><path d="M4.5 19.5h15"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
    trash: '<path d="M4.5 7h15"/><path d="M9.5 7V4.5h5V7"/><path d="M6.5 7l1 13h9l1-13"/>',
    more: '<circle cx="5.5" cy="12" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/><circle cx="18.5" cy="12" r="1.3" fill="currentColor"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
    moon: '<path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/>',
    stamp: '<path d="M5 3.5h14v17H5z" stroke-dasharray="2 1.6"/><rect x="8" y="7" width="8" height="7.5" rx=".8"/><path d="M8.5 17.5h7"/>',
    chevron: '<path d="m9 5.5 6.5 6.5L9 18.5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    star: '<path d="m12 3.8 2.5 5.2 5.7.8-4.1 4 1 5.6L12 16.7l-5.1 2.7 1-5.6-4.1-4 5.7-.8z"/>',
    filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
    image: '<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="m4 18 5.5-5 4 3.5 2.5-2 4.5 3.5"/>',
    list: '<path d="M8.5 6.5h12M8.5 12h12M8.5 17.5h12"/><circle cx="4.5" cy="6.5" r=".9" fill="currentColor"/><circle cx="4.5" cy="12" r=".9" fill="currentColor"/><circle cx="4.5" cy="17.5" r=".9" fill="currentColor"/>',
    heart: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8"/>',
    back: '<path d="M15 5.5 8.5 12l6.5 6.5"/>',
    zoom: '<circle cx="10.8" cy="10.8" r="6.5"/><path d="m20 20-4.4-4.4M10.8 8v5.6M8 10.8h5.6"/>',
    flip: '<path d="M4 8h13.5l-3-3M20 16H6.5l3 3"/>',
    bookmark: '<path d="M6.5 3.5h11V21l-5.5-4-5.5 4z"/>',
    sort: '<path d="M7 4v16M3.5 16.5 7 20l3.5-3.5M17 20V4M13.5 7.5 17 4l3.5 3.5"/>',
    globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.6 2.5 3.8 5.3 3.8 8.5s-1.2 6-3.8 8.5c-2.6-2.5-3.8-5.3-3.8-8.5s1.2-6 3.8-8.5z"/>',
    crop: '<path d="M6.5 3v14.5H21"/><path d="M3 6.5h14.5V21"/>',
    sparkle: '<path d="M12 4v4M12 16v4M4 12h4M16 12h4M6.5 6.5l2.3 2.3M15.2 15.2l2.3 2.3M6.5 17.5l2.3-2.3M15.2 8.8l2.3-2.3"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    magnifier: '<circle cx="10.5" cy="10.5" r="6"/><path d="m15 15 5.5 5.5"/><path d="M8 9a3 3 0 0 1 2.5-1.5"/>',
    shield: '<path d="M12 3.5 19 6v5.5c0 4.4-3 7.8-7 9-4-1.2-7-4.6-7-9V6z"/><path d="m9 12 2 2 4-4"/>',
    crown: '<path d="M4 17.5h16L18.5 8 14 12 12 6.5 10 12 5.5 8z"/><path d="M4.5 20.5h15"/>'
  
  };
  const sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true">${
    Object.entries(P).map(([k, v]) => `<symbol id="i-${k}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${v}</symbol>`).join("")}</svg>`;
  const inject = () => document.body.insertAdjacentHTML("afterbegin", sprite);
  if (document.body) inject(); else document.addEventListener("DOMContentLoaded", inject);
  window.BS = window.BS || {};
  window.BS.ICONS = Object.keys(P);
  window.BS.ic = (name, size = 20, cls = "") => `<svg class="ic ${cls}" width="${size}" height="${size}" aria-hidden="true" focusable="false"><use href="#i-${name}"/></svg>`;
})();
