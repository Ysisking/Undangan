/* =====================================================================
   Pemuat template desain (klasik).
   - Mode tamu  (?u=slug):  ambil isi undangan dari Supabase.
   - Mode edit  (?edit=1):  ambil isi dari editor (halaman induk).
   - Tanpa keduanya:        tampilkan contoh bawaan template.
   Juga menerapkan "gaya": warna, huruf, latar bagian, urutan & sembunyi bagian.
   ===================================================================== */
(function () {
  'use strict';
  const q = new URLSearchParams(location.search);
  const edit = q.get('edit') === '1';
  const slug = (q.get('u') || '').trim().toLowerCase();
  const html = document.documentElement;
  window.TEMA = window.TEMA || {};
  let gaya = {};

  function pesan(judul, teks) {
    const tampil = () => {
      document.body.innerHTML = '';
      const d = document.createElement('div');
      d.style.cssText = 'min-height:100vh;display:grid;place-content:center;gap:8px;padding:24px;text-align:center;font:15px/1.6 system-ui,sans-serif;color:#4b3c3c;background:#f3ebe8';
      const b = document.createElement('b'); b.textContent = judul; b.style.cssText = 'font:italic 400 26px/1.3 Georgia,serif';
      const s = document.createElement('span'); s.textContent = teks;
      d.append(b, s); document.body.appendChild(d); html.classList.remove('memuat');
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', tampil); else tampil();
  }

  if (edit) {
    const induk = window.parent && window.parent !== window && window.parent.__klasik;
    if (induk) { window.UNDANGAN = JSON.parse(JSON.stringify(induk.isi || {})); gaya = induk.gaya || {}; }
    window.TEMA.tanpaReveal = true;
    window.TEMA.judulDinamis = false;
    if (q.get('buka') === '1') { window.TEMA.langsungBuka = true; window.TEMA.jedaBuka = 0; }
    html.classList.add('mode-edit');
    window.UNDANGAN_TUNGGU = Promise.resolve();
  } else if (slug && slug !== 'contoh') {
    html.classList.add('memuat');
    const st = document.createElement('style'); st.textContent = 'html.memuat body{visibility:hidden}'; document.head.appendChild(st);
    window.UNDANGAN_TUNGGU = (async () => {
      try {
        const u = await window.Simpanan.ambil(slug);
        if (!u || u.terbit === false || !u.data || !u.data.isi) { pesan('Undangan tidak ditemukan', 'Periksa kembali link yang Anda terima.'); return new Promise(() => {}); }
        window.UNDANGAN = u.data.isi; gaya = u.data.gaya || {};
        window.UNDANGAN_STORE = { slug, store: window.Simpanan };
      } catch (e) { pesan('Undangan belum bisa dibuka', 'Periksa koneksi internet Anda, lalu muat ulang halaman.'); return new Promise(() => {}); }
    })();
    document.addEventListener('undangan:siap', () => html.classList.remove('memuat'));
  }

  /* ---------- gaya ---------- */
  const CADANGAN = { judul: 'Georgia, serif', isi: "'Helvetica Neue', Arial, sans-serif", tulis: 'cursive', mono: 'ui-monospace, Menlo, monospace' };
  function muatFont(nilai) {
    const m = /^'([^']+)'/.exec(nilai || ''); if (!m) return;
    const nama = m[1], id = 'f-' + nama.replace(/\W+/g, '-');
    if (document.getElementById(id)) return;
    const l = document.createElement('link'); l.id = id; l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=' + encodeURIComponent(nama).replace(/%20/g, '+') + ':ital,wght@0,400;0,500;1,400&display=swap';
    l.onerror = () => { l.href = 'https://fonts.googleapis.com/css2?family=' + encodeURIComponent(nama).replace(/%20/g, '+') + '&display=swap'; };
    document.head.appendChild(l);
  }
  function daftarBagian() {
    const out = [];
    const sampul = document.querySelector('.sampul');
    if (sampul) { sampul.dataset.kunci = 'sampul'; out.push(sampul); }
    const main = document.querySelector('main');
    if (main) Array.from(main.children).forEach((el, i) => {
      if (el.tagName !== 'SECTION') return;
      if (!el.dataset.kunci) el.dataset.kunci = el.id || 'bagian-' + i;
      out.push(el);
    });
    return out;
  }
  let urutanAsli = null;
  function terapkan(g) {
    g = g || {}; gaya = g;
    // warna & huruf
    Array.from(html.style).filter((k) => k.startsWith('--')).forEach((k) => html.style.removeProperty(k));
    Object.entries(g.vars || {}).forEach(([k, v]) => { html.style.setProperty(k, v); if (k.startsWith('--f-')) muatFont(v); });
    const semua = daftarBagian();
    const main = document.querySelector('main');
    const isi = semua.filter((e) => e.dataset.kunci !== 'sampul');
    if (!urutanAsli) urutanAsli = isi.map((e) => e.dataset.kunci);
    // urutan
    if (main && isi.length) {
      const urut = (g.urutan || []).filter((k) => urutanAsli.includes(k));
      urutanAsli.forEach((k) => { if (!urut.includes(k)) urut.push(k); });
      const akhir = isi[isi.length - 1].nextSibling;
      const peta = Object.fromEntries(isi.map((e) => [e.dataset.kunci, e]));
      urut.forEach((k) => main.insertBefore(peta[k], akhir));
    }
    // sembunyi & latar
    semua.forEach((el) => {
      const k = el.dataset.kunci;
      const sembunyi = (g.sembunyi || []).includes(k);
      if (edit) { el.classList.toggle('disembunyikan', sembunyi); el.hidden = false; } else el.hidden = sembunyi;
      const lt = (g.latar || {})[k];
      if (!el.dataset.latarAsli) el.dataset.latarAsli = el.style.backgroundImage || 'none';
      if (lt && lt.url) {
        const warna = getComputedStyle(el).backgroundColor;
        const m = /rgba?\(([^)]+)\)/.exec(warna); const rgb = m ? m[1].split(',').slice(0, 3).join(',') : '255,255,255';
        const a = lt.redup == null ? 0.55 : lt.redup;
        el.style.backgroundImage = `linear-gradient(rgba(${rgb},${a}), rgba(${rgb},${a})), url("${String(lt.url).replace(/"/g, '%22')}")`;
        el.style.backgroundSize = 'cover'; el.style.backgroundPosition = 'center';
      } else if (el.dataset.latarAsli) {
        el.style.backgroundImage = el.dataset.latarAsli === 'none' ? '' : el.dataset.latarAsli;
      }
    });
  }
  window.terapkanGayaKlasik = terapkan;
  window.daftarBagianKlasik = daftarBagian;
  Promise.resolve(window.UNDANGAN_TUNGGU).then(() => {
    const jalan = () => terapkan(gaya);
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', jalan); else jalan();
  });
})();
