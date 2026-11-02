/* =====================================================================
   Mesin undangan: menggambar undangan dari data (tema + daftar bagian).
   Dipakai halaman tamu (mode lihat) dan editor (mode edit).
   ===================================================================== */
(function () {
  'use strict';
  const U = (window.Undangan = {});
  const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const ZONA_TZ = { WIB: 'Asia/Jakarta', WITA: 'Asia/Makassar', WIT: 'Asia/Jayapura' };
  const pad = (n) => String(n).padStart(2, '0');
  const salinDalam = (o) => JSON.parse(JSON.stringify(o));
  U.salinDalam = salinDalam;

  /* ---------------- huruf ---------------- */
  U.FONT = {
    judul: { 'Bodoni Moda': 'ital,opsz,wght@0,6..96,400;1,6..96,400', 'Cormorant Garamond': 'ital,wght@0,300;0,400;1,400', 'Gilda Display': '', 'Marcellus': '', 'Libre Caslon Text': 'ital@0;1', 'Playfair Display': 'ital@0;1', 'DM Serif Display': 'ital@0;1', 'Cinzel': '', 'Forum': '', 'Italiana': '' },
    tulis: { 'Mrs Saint Delafield': '', 'Pinyon Script': '', 'Italianno': '', 'Parisienne': '', 'Great Vibes': '', 'Allura': '', 'Alex Brush': '', 'Italiana': '', 'Cormorant Garamond': 'ital,wght@0,300;0,400;1,400' },
    isi: { 'Karla': 'wght@300;400;500', 'Jost': 'wght@300;400;500', 'Nunito Sans': 'wght@300;400;600', 'Lato': 'wght@300;400;700', 'Mulish': 'wght@300;400;600', 'Figtree': 'wght@300;400;600', 'Libre Franklin': 'wght@300;400;600', 'Montserrat': 'wght@300;400;500' },
  };
  const CADANGAN = { judul: 'Georgia, serif', tulis: 'cursive', isi: "'Helvetica Neue', Arial, sans-serif" };
  U.muatFont = function (tema) {
    const f = (tema && tema.font) || {};
    ['judul', 'tulis', 'isi'].forEach((peran) => {
      const nama = f[peran]; if (!nama) return;
      const id = 'u-font-' + nama.replace(/\W+/g, '-');
      if (document.getElementById(id)) return;
      const spec = (U.FONT[peran] && U.FONT[peran][nama]) ?? Object.values(U.FONT).map((g) => g[nama]).find((x) => x != null) ?? '';
      const l = document.createElement('link');
      l.id = id; l.rel = 'stylesheet';
      l.href = 'https://fonts.googleapis.com/css2?family=' + encodeURIComponent(nama).replace(/%20/g, '+') + (spec ? ':' + spec : '') + '&display=swap';
      document.head.appendChild(l);
    });
  };

  /* ---------------- template (preset tema) ---------------- */
  U.PRESET = {
    'dusty-rose': { nama: 'Dusty Rose', warna: { latar: '#f3ebe8', kertas: '#f8f3f1', bingkai: '#e4d6d2', garis: '#d8c4c1', aksen: '#86696a', tinta: '#4b3c3c', redup: '#6f5b5b' }, font: { judul: 'Bodoni Moda', tulis: 'Mrs Saint Delafield', isi: 'Karla' }, animasi: 'angkat', gaya: { sampul: 'oval', hero: 'lengkung', mempelai: 'lengkung', ornamen: '', tata: 'mozaik' }, ket: 'Mawar pudar, foto oval dan lengkung, ornamen mawar garis.' },
    'ivory': { nama: 'Ivory Minimal', warna: { latar: '#f5f2ec', kertas: '#fbf9f5', bingkai: '#e3ddd3', garis: '#cfc6ba', aksen: '#7f7264', tinta: '#3a352f', redup: '#6e665d' }, font: { judul: 'Cormorant Garamond', tulis: 'Pinyon Script', isi: 'Jost' }, animasi: 'pudar', gaya: { sampul: 'kotak', hero: 'kotak', mempelai: 'oval', ornamen: '', tata: 'kotak' }, ket: 'Gading dan abu hangat, bingkai kotak, rapi dan lapang.' },
    'sage': { nama: 'Sage Eucalyptus', warna: { latar: '#edefe8', kertas: '#f4f5f0', bingkai: '#d5dbcf', garis: '#c6cdbe', aksen: '#5f6a58', tinta: '#3d4537', redup: '#5c6655' }, font: { judul: 'Gilda Display', tulis: 'Italianno', isi: 'Jost' }, animasi: 'lingkaran', gaya: { sampul: 'lengkung', hero: 'lengkung', mempelai: 'bulat', ornamen: '', tata: 'mozaik' }, ket: 'Hijau sage lembut, foto bulat, kesan taman.' },
    'monokrom': { nama: 'Monokrom Editorial', warna: { latar: '#f8f7f5', kertas: '#ffffff', bingkai: '#d9d8d4', garis: '#d6d5d1', aksen: '#1c1c1c', tinta: '#1c1c1c', redup: '#5e5e5a' }, font: { judul: 'Libre Caslon Text', tulis: 'Italiana', isi: 'Karla' }, animasi: 'angkat', gaya: { sampul: 'kotak', hero: 'kotak', mempelai: 'kotak', ornamen: 'none', tata: 'kotak' }, ket: 'Hitam putih ala majalah, tanpa ornamen.' },
    'pasir': { nama: 'Lengkung Pasir', warna: { latar: '#ece6dd', kertas: '#f3efe9', bingkai: '#ddd4c7', garis: '#c9bdac', aksen: '#62788a', tinta: '#3a4048', redup: '#5c6570' }, font: { judul: 'Marcellus', tulis: 'Pinyon Script', isi: 'Nunito Sans' }, animasi: 'perbesar', gaya: { sampul: 'lengkung', hero: 'lengkung', mempelai: 'lengkung', ornamen: '', tata: 'geser' }, ket: 'Pasir dan biru kabut, bingkai lengkung, galeri geser.' },
    'malam': { nama: 'Langit Malam', warna: { latar: '#0f1428', kertas: '#182039', bingkai: '#232c4d', garis: '#39426a', aksen: '#d6b36a', tinta: '#eee7d4', redup: '#a8afca' }, font: { judul: 'Cormorant Garamond', tulis: 'Parisienne', isi: 'Jost' }, animasi: 'pudar', gaya: { sampul: 'bulat', hero: 'oval', mempelai: 'bulat', ornamen: '', tata: 'geser' }, ket: 'Biru malam dan emas, foto bulat, nuansa elegan.' },
  };
  U.ANIMASI = { angkat: 'Sampul terangkat ke atas', pudar: 'Memudar', lingkaran: 'Lingkaran menutup', perbesar: 'Membesar lalu hilang' };

  /* ---------------- jenis bagian ---------------- */
  U.JENIS = {
    hero: { nama: 'Pembuka & foto utama', baru: () => ({ tipe: 'hero', judul: 'The Wedding of', foto: '', bentuk: 'lengkung' }) },
    kutipan: { nama: 'Kutipan / ayat', baru: () => ({ tipe: 'kutipan', teks: 'Tulis kutipan di sini', sumber: '' }) },
    mempelai: { nama: 'Mempelai', baru: () => ({ tipe: 'mempelai', label: 'Mempelai', teks: '', bentuk: 'lengkung' }) },
    hitung: { nama: 'Hitung mundur', baru: () => ({ tipe: 'hitung', label: 'Menuju hari bahagia' }) },
    acara: { nama: 'Acara', baru: () => ({ tipe: 'acara', label: 'Waktu & tempat', judul: '', daftar: [U.BARU.acara()] }) },
    kisah: { nama: 'Kisah cinta', baru: () => ({ tipe: 'kisah', label: 'Kisah kami', daftar: [U.BARU.kisah()] }) },
    galeri: { nama: 'Galeri foto', baru: () => ({ tipe: 'galeri', label: 'Galeri', judul: 'Potret kami', tata: 'mozaik', foto: [U.BARU.foto(), U.BARU.foto(), U.BARU.foto(), U.BARU.foto()] }) },
    video: { nama: 'Video', baru: () => ({ tipe: 'video', label: 'Video', judul: '', url: '' }) },
    teks: { nama: 'Teks bebas', baru: () => ({ tipe: 'teks', judul: 'Judul', isi: 'Tulis teks di sini' }) },
    gambar: { nama: 'Gambar bebas', baru: () => ({ tipe: 'gambar', src: '', ket: '', bentuk: 'kotak' }) },
    rsvp: { nama: 'RSVP & ucapan', baru: () => ({ tipe: 'rsvp', label: 'RSVP', judul: 'Konfirmasi kehadiran' }) },
    hadiah: { nama: 'Amplop digital', baru: () => ({ tipe: 'hadiah', label: 'Tanda kasih', teks: 'Doa restu Anda adalah hadiah terindah bagi kami.', rekening: [U.BARU.rekening()], alamat: { penerima: '', alamat: '' } }) },
    penutup: { nama: 'Penutup', baru: () => ({ tipe: 'penutup', teks: 'Terima kasih atas doa dan kehadiran Anda.', salam: 'Kami yang berbahagia', keluarga: '' }) },
  };
  U.BARU = {
    acara: () => ({ nama: 'Acara', tanggal: '', mulai: '08.00', selesai: '', zona: 'WIB', tempat: 'Nama tempat', alamat: 'Alamat', peta: '' }),
    kisah: () => ({ tahun: '2026', judul: 'Judul', cerita: 'Cerita singkat' }),
    foto: () => ({ src: '', ket: '' }),
    rekening: () => ({ bank: 'Bank', nomor: '0000000000', atasNama: 'Atas nama' }),
  };

  /* ---------------- contoh isi ---------------- */
  U.contoh = function (preset) {
    const p = U.PRESET[preset] || U.PRESET['dusty-rose'];
    const g = p.gaya || {};
    const D = {
      versi: 1,
      tema: { preset: preset || 'dusty-rose', warna: salinDalam(p.warna), font: salinDalam(p.font), animasi: p.animasi, ornamen: '', latar: '', musik: { url: '' } },
      tamuBawaan: 'Bapak/Ibu/Saudara/i',
      tanggalUtama: '2026-12-12T08:00:00+07:00',
      mempelai: {
        urutan: 'pria-dulu',
        pria: { panggilan: 'Raka', nama: 'Raka Aditya Pratama', keterangan: 'Putra dari', ayah: 'Bpk. Hadi Wibowo', ibu: 'Ibu Sri Lestari', instagram: 'rakaaditya', foto: '' },
        wanita: { panggilan: 'Nadia', nama: 'Nadia Kusumawardani', keterangan: 'Putri dari', ayah: 'Bpk. Bambang Kusumo', ibu: 'Ibu Endang Sulastri', instagram: 'nadiakusuma', foto: '' },
      },
      sampul: { pembuka: 'Bersama keluarga, kami mengundang Anda', label: 'Pernikahan', foto: '', bentuk: 'oval', kepada: 'Kepada Yth.', tombol: 'Buka Undangan', latar: '' },
      bagian: [
        { tipe: 'hero', judul: 'The Wedding of', foto: '', bentuk: 'lengkung' },
        { tipe: 'kutipan', teks: 'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.', sumber: 'QS. Ar-Rum : 21' },
        { tipe: 'mempelai', label: 'Mempelai', teks: 'Dengan memohon rahmat dan ridha Allah SWT, kami bermaksud menyelenggarakan pernikahan putra-putri kami:', bentuk: 'lengkung', garis: true },
        { tipe: 'hitung', label: 'Menuju hari bahagia' },
        { tipe: 'acara', label: 'Waktu & tempat', judul: '', daftar: [
          { nama: 'Akad Nikah', tanggal: '2026-12-12', mulai: '08.00', selesai: '10.00', zona: 'WIB', tempat: 'Rumah Taman Sukasari', alamat: 'Jl. Pakuan No. 8, Bogor', peta: 'https://maps.google.com/?q=Jl.+Pakuan+Bogor' },
          { nama: 'Resepsi', tanggal: '2026-12-12', mulai: '11.00', selesai: '14.00', zona: 'WIB', tempat: 'Rumah Taman Sukasari', alamat: 'Jl. Pakuan No. 8, Bogor', peta: 'https://maps.google.com/?q=Jl.+Pakuan+Bogor' },
        ] },
        { tipe: 'kisah', label: 'Kisah kami', daftar: [
          { tahun: '2019', judul: 'Pertama bertemu', cerita: 'Kami berkenalan di sebuah toko buku kecil di Bogor, berebut buku terakhir di rak yang sama.' },
          { tahun: '2023', judul: 'Lamaran', cerita: 'Di hadapan dua keluarga, Raka meminta restu dengan suara yang sedikit bergetar.' },
          { tahun: '2026', judul: 'Hari bahagia', cerita: 'Kami memilih untuk melangkah bersama, dan ingin Anda menjadi bagian dari hari itu.' },
        ] },
        { tipe: 'galeri', label: 'Galeri', judul: 'Potret kami', tata: 'mozaik', foto: [U.BARU.foto(), U.BARU.foto(), U.BARU.foto(), U.BARU.foto(), U.BARU.foto(), U.BARU.foto()] },
        { tipe: 'rsvp', label: 'RSVP', judul: 'Konfirmasi kehadiran', garis: true },
        { tipe: 'hadiah', label: 'Tanda kasih', teks: 'Doa restu Anda adalah hadiah terindah bagi kami. Bila ingin memberi tanda kasih, dapat melalui:', rekening: [
          { bank: 'BCA', nomor: '0371234567', atasNama: 'Raka Aditya Pratama' },
          { bank: 'Mandiri', nomor: '1370012345678', atasNama: 'Nadia Kusumawardani' },
        ], alamat: { penerima: 'Nadia Kusumawardani', alamat: 'Jl. Pakuan No. 8, Baranangsiang, Bogor 16143' } },
        { tipe: 'penutup', teks: 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.', salam: 'Kami yang berbahagia', keluarga: 'Kel. Bpk. Hadi Wibowo & Kel. Bpk. Bambang Kusumo', garis: true },
      ],
      kredit: 'Undangan digital oleh Studio Anda',
    };
    D.tema.ornamen = g.ornamen || '';
    D.sampul.bentuk = g.sampul || 'oval';
    D.bagian.forEach((b) => {
      if (b.tipe === 'hero') b.bentuk = g.hero || b.bentuk;
      if (b.tipe === 'mempelai') b.bentuk = g.mempelai || b.bentuk;
      if (b.tipe === 'galeri') b.tata = g.tata || b.tata;
    });
    return D;
  };

  /* ---------------- alat bantu ---------------- */
  function ambil(o, p) { return String(p).split('.').reduce((a, k) => (a == null ? undefined : a[k]), o); }
  function pasang(o, p, v) { const k = String(p).split('.'); let a = o; for (let i = 0; i < k.length - 1; i++) { if (a[k[i]] == null || typeof a[k[i]] !== 'object') a[k[i]] = /^\d+$/.test(k[i + 1]) ? [] : {}; a = a[k[i]]; } a[k[k.length - 1]] = v; }
  U.ambil = ambil; U.pasang = pasang;
  function tanggal(v) {
    if (!v) return null;
    const s = String(v); const m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2})[:.](\d{2}))?/.exec(s);
    if (m && !/(Z|[+-]\d{2}:?\d{2})$/.test(s)) return new Date(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0));
    const d = new Date(s); return isNaN(d) ? null : d;
  }
  function tglLokal(v) { // tanggal kalender tanpa geser zona
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(v || ''); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : tanggal(v);
  }
  U.tanggal = tanggal;
  const fmtPanjang = (d) => d ? `${HARI[d.getDay()]}, ${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}` : '';
  function h(tag, at, ...anak) {
    const e = document.createElement(tag);
    if (at) for (const k in at) { const v = at[k]; if (v == null || v === false) continue; if (k === 'class') e.className = v; else if (k === 'text') e.textContent = v; else if (k === 'style' && typeof v === 'object') Object.assign(e.style, v); else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2), v); else e.setAttribute(k, v === true ? '' : v); }
    anak.flat(9).forEach((c) => { if (c == null || c === false) return; e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return e;
  }
  const cssUrl = (u) => `url("${String(u).replace(/["\\\n]/g, encodeURIComponent)}")`;
  function terang(hex) { const m = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex || ''); if (!m) return 0; const c = m.slice(1).map((x) => { const v = parseInt(x, 16) / 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; }

  U.terapkanTema = function (root, tema) {
    tema = tema || {};
    const w = tema.warna || {}, f = tema.font || {};
    for (const k of ['latar', 'kertas', 'bingkai', 'garis', 'aksen', 'tinta', 'redup']) if (w[k]) root.style.setProperty('--u-' + k, w[k]);
    root.style.setProperty('--u-teks-tombol', terang(w.aksen) > 0.4 ? '#1c1c1c' : '#ffffff');
    for (const k of ['judul', 'tulis', 'isi']) if (f[k]) root.style.setProperty('--u-f-' + k, `'${f[k]}', ${CADANGAN[k]}`);
    root.classList.toggle('u-latar-gambar', !!tema.latar);
    if (tema.latar) root.style.setProperty('--u-latar-img', cssUrl(tema.latar)); else root.style.removeProperty('--u-latar-img');
    U.muatFont(tema);
  };

  /* ---------------- ornamen mawar satu garis ---------------- */
  const MAWAR = [
    ['M50 40 c-6 0 -8 -8 -2 -10 c8 -3 14 6 8 12 c-8 8 -22 2 -22 -10 c0 -14 18 -20 28 -12 c10 8 6 26 -8 30 c-14 4 -28 -6 -28 -20', 0],
    ['M22 30 c-4 10 0 22 10 28 M70 30 c6 10 4 24 -6 30', .5], ['M48 62 C46 80 50 100 46 128', .9],
    ['M47 86 c-10 -6 -20 -4 -24 4 c8 4 18 4 24 -4', 1.3], ['M48 104 c8 -8 18 -8 24 -2 c-8 6 -18 8 -24 2', 1.5],
  ];
  function svgMawar() {
    const NS = 'http://www.w3.org/2000/svg';
    const s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '0 0 100 130'); s.setAttribute('aria-hidden', 'true');
    MAWAR.forEach(([d, t]) => { const p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); p.setAttribute('pathLength', '1'); p.style.setProperty('--pd', t + 's'); s.appendChild(p); });
    return s;
  }

  /* =====================================================================
     RENDER
     ===================================================================== */
  U.render = function (root, D, opsi = {}) {
    const edit = !!opsi.edit;
    root.textContent = '';
    root.className = 'u-root' + (edit ? ' u-edit' : '');
    U.terapkanTema(root, D.tema);
    const M = D.mempelai || {};
    const kunciA = M.urutan === 'wanita-dulu' ? 'wanita' : 'pria', kunciB = kunciA === 'pria' ? 'wanita' : 'pria';
    const tamu = opsi.tamu || D.tamuBawaan || 'Bapak/Ibu/Saudara/i';
    const utama = tanggal(D.tanggalUtama);

    function T(tag, path, cls, label) {
      const v = ambil(D, path);
      const e = h(tag, { class: cls || null });
      e.textContent = v == null ? '' : String(v);
      e.dataset.edit = path; e.dataset.ph = label || 'Ketik di sini';
      if (!edit && (v == null || v === '')) e.hidden = true;
      return e;
    }
    function F(path, label, bentuk, cls) {
      const v = ambil(D, path);
      const e = h('div', { class: `u-foto u-bentuk-${bentuk || 'kotak'}${cls ? ' ' + cls : ''}`, 'data-img': path, 'data-label': label || 'Foto' });
      if (v) { e.style.backgroundImage = cssUrl(v); e.dataset.url = v; } else e.dataset.kosong = '';
      return e;
    }
    function orn(cls) {
      const o = (D.tema || {}).ornamen;
      if (o === 'none') return edit ? h('div', { class: 'u-orn ' + cls, 'data-ornamen': '', 'aria-hidden': 'true' }) : null;
      const w = h('div', { class: 'u-orn ' + cls, 'data-rv': '', 'aria-hidden': 'true', 'data-ornamen': '' });
      w.appendChild(o ? h('img', { src: o, alt: '' }) : svgMawar());
      return w;
    }
    const nama = () => [T('span', `mempelai.${kunciA}.panggilan`, null, 'Nama'), ' & ', T('span', `mempelai.${kunciB}.panggilan`, null, 'Nama')];
    function barisTgl() {
      const d = utama;
      return h('div', { class: 'u-tgl', 'data-atur': 'tanggalUtama', 'data-rv': '' },
        h('span', { text: d ? HARI[d.getDay()] : 'Hari' }), h('i'), h('b', { text: d ? String(d.getDate()) : '00' }), h('i'),
        h('span', { text: d ? `${BULAN[d.getMonth()]} ${d.getFullYear()}` : 'Bulan tahun' }));
    }
    const rv = (e) => { e.setAttribute('data-rv', ''); return e; };

    /* ---- sampul ---- */
    const S = D.sampul || (D.sampul = {});
    const sampul = h('section', { class: 'u-sampul', 'data-anim': (D.tema || {}).animasi || 'angkat', 'data-sampul': '', 'aria-label': 'Sampul undangan' });
    if (S.latar) { sampul.style.setProperty('--u-sampul-img', cssUrl(S.latar)); sampul.style.setProperty('--u-sampul-redup', S.redup ?? 0.35); }
    const sFoto = h('div', { class: `u-sampul-foto u-bentuk-${S.bentuk || 'oval'}` }, F('sampul.foto', 'Foto sampul', S.bentuk || 'oval'), orn('u-orn-sampul'));
    sampul.appendChild(h('div', { class: 'u-sampul-dalam' },
      T('p', 'sampul.pembuka', 'u-pembuka', 'Kalimat pembuka'),
      S.sembunyiFoto && !edit ? null : sFoto,
      T('p', 'sampul.label', 'u-kecil u-label', 'Label'),
      h('h1', { class: 'u-tulis' }, nama()),
      barisTgl(),
      h('div', { class: 'u-kepada' }, T('span', 'sampul.kepada', null, 'Kepada Yth.'), h('b', { text: tamu })),
      h('button', { class: 'u-tombol-buka', type: 'button', 'data-buka': '' }, T('span', 'sampul.tombol', null, 'Buka Undangan'))
    ));
    root.appendChild(sampul);

    /* ---- isi ---- */
    const isi = h('main', { class: 'u-isi' });
    root.appendChild(isi);

    /* ---- musik ---- */
    const musik = (D.tema && D.tema.musik) || {};
    if (musik.url) root.appendChild(h('button', { class: 'u-musik', type: 'button', 'data-musik': '', 'aria-label': 'Putar musik', 'aria-pressed': 'false' },
      (() => { const s = svgMawar(); s.querySelectorAll('path')[1].remove(); s.querySelectorAll('path')[3] && s.querySelectorAll('path')[3].remove(); return s; })()));

    /* ---------------- penggambar setiap bagian ---------------- */
    function BAGIAN_orang(k, bentuk) {
      const P = `mempelai.${k}`;
      const ig = ambil(D, P + '.instagram');
      const a = T('a', P + '.instagram', 'u-ig', 'instagram');
      if (ig) { a.href = 'https://instagram.com/' + String(ig).replace(/^@/, ''); a.target = '_blank'; a.rel = 'noopener'; }
      return rv(h('article', { class: 'u-orang' },
        F(P + '.foto', 'Foto', bentuk || 'lengkung'),
        T('h3', P + '.panggilan', null, 'Nama panggilan'),
        T('div', P + '.nama', 'u-nl', 'Nama lengkap'),
        h('p', {}, T('span', P + '.keterangan', null, 'Putra/putri dari'), ' ', T('span', P + '.ayah', null, 'Nama ayah'), ' & ', T('span', P + '.ibu', null, 'Nama ibu')),
        a));
    }
    var BAGIAN = {
      hero(sec, b, p) {
        sec.append(rv(T('p', p + '.judul', 'u-kecil', 'Judul kecil')),
          rv(h('div', { class: `u-bingkai-foto u-bentuk-${b.bentuk || 'lengkung'}` }, F(p + '.foto', 'Foto pasangan', b.bentuk || 'lengkung'))),
          rv(h('h2', { class: 'u-tulis', style: { marginTop: '30px' } }, nama())), barisTgl());
      },
      kutipan(sec, b, p) { sec.append(orn('u-orn-kecil'), rv(T('p', p + '.teks', 'u-kutipan', 'Kutipan')), rv(T('p', p + '.sumber', 'u-kecil', 'Sumber'))); sec.lastChild.style.marginTop = '14px'; },
      mempelai(sec, b, p) {
        sec.append(rv(T('p', p + '.label', 'u-kecil', 'Label')), rv(T('p', p + '.teks', 'u-teks', 'Kalimat pengantar')));
        const g = h('div', { style: { marginTop: '34px' } }, BAGIAN_orang(kunciA, b.bentuk), h('div', { class: 'u-pemisah' }, orn('u-orn-kecil')), BAGIAN_orang(kunciB, b.bentuk));
        sec.append(g);
      },
      hitung(sec, b, p) {
        sec.append(rv(T('p', p + '.label', 'u-kecil', 'Label')), rv(h('div', { class: 'u-hitung', 'data-hitung': '' },
          ['Hari', 'Jam', 'Menit', 'Detik'].map((n, j) => h('div', {}, h('b', { 'data-cd': 'dhms'[j], text: '00' }), h('span', { text: n }))))));
      },
      acara(sec, b, p) {
        sec.append(rv(T('p', p + '.label', 'u-kecil', 'Label')), rv(T('h2', p + '.judul', 'u-judul', 'Judul (opsional)')));
        const list = h('div', { class: 'u-acara-list', 'data-list': p + '.daftar', 'data-jenis': 'acara' });
        (b.daftar || []).forEach((a, j) => {
          const q = `${p}.daftar.${j}`;
          const d = tglLokal(a.tanggal);
          const peta = h('a', { class: 'u-btn u-penuh', text: 'Lihat lokasi' }); if (a.peta) { peta.href = a.peta; peta.target = '_blank'; peta.rel = 'noopener'; } else if (!edit) peta.hidden = true;
          const kal = h('a', { class: 'u-btn', text: 'Simpan tanggal', href: gcal(a), target: '_blank', rel: 'noopener' }); if (!d) kal.hidden = true;
          list.appendChild(rv(h('article', { class: 'u-acara', 'data-item': q },
            T('h3', q + '.nama', null, 'Nama acara'),
            h('p', { class: 'u-tanggal', 'data-atur': q, text: d ? fmtPanjang(d) : (edit ? 'Atur tanggal' : '') }),
            h('div', { class: 'u-waktu' }, h('div', {}, h('small', { text: 'Mulai' }), T('b', q + '.mulai', null, '08.00')), h('i'), h('div', {}, h('small', { text: 'Selesai' }), (() => { const e = T('b', q + '.selesai', null, 'Selesai'); if (!edit && !a.selesai) { e.hidden = false; e.textContent = 'Selesai'; } return e; })())),
            T('p', q + '.zona', 'u-zona', 'WIB'),
            T('p', q + '.tempat', 'u-tempat', 'Nama tempat'),
            T('p', q + '.alamat', 'u-alamat', 'Alamat'),
            h('div', { class: 'u-aksi' }, peta, kal))));
        });
        sec.append(list);
      },
      kisah(sec, b, p) {
        sec.append(orn('u-orn-kecil'), rv(T('p', p + '.label', 'u-kecil', 'Label')));
        sec.lastChild.style.marginTop = '18px';
        const list = h('div', { class: 'u-kisah-list', 'data-list': p + '.daftar', 'data-jenis': 'kisah' });
        (b.daftar || []).forEach((k, j) => { const q = `${p}.daftar.${j}`; list.appendChild(rv(h('article', { class: 'u-kisah', 'data-item': q }, T('small', q + '.tahun', null, 'Tahun'), h('div', {}, T('h4', q + '.judul', null, 'Judul'), T('p', q + '.cerita', null, 'Cerita'))))); });
        sec.append(list);
      },
      galeri(sec, b, p) {
        sec.append(rv(T('p', p + '.label', 'u-kecil', 'Label')), rv(T('h2', p + '.judul', 'u-judul', 'Judul')));
        const g = h('div', { class: 'u-galeri', 'data-tata': b.tata || 'mozaik', 'data-list': p + '.foto', 'data-jenis': 'foto' });
        (b.foto || []).forEach((f, j) => {
          const q = `${p}.foto.${j}`;
          if (!edit && !f.src) return;
          const fig = h('figure', { class: 'u-galeri-item', 'data-item': q, style: { margin: 0 } }, F(q + '.src', 'Foto ' + (j + 1), 'kotak'), T('figcaption', q + '.ket', null, 'Keterangan'));
          const ft = fig.querySelector('.u-foto'); if (f.ket) ft.dataset.caption = f.ket;
          g.appendChild(rv(fig));
        });
        sec.append(g);
      },
      video(sec, b, p) {
        sec.append(rv(T('p', p + '.label', 'u-kecil', 'Label')), rv(T('h2', p + '.judul', 'u-judul', 'Judul (opsional)')));
        const w = h('div', { class: 'u-video', 'data-video': p + '.url' });
        const url = b.url || '';
        const yt = /(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/.exec(url);
        if (!url) w.appendChild(h('div', { class: 'u-video-kosong', text: edit ? 'Ketuk untuk menambah video' : '' }));
        else if (yt && !edit) w.appendChild(h('iframe', { src: `https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0`, title: 'Video', loading: 'lazy', allow: 'encrypted-media; picture-in-picture', allowfullscreen: true }));
        else if (yt) w.appendChild(h('div', { class: 'u-video-kosong', style: { backgroundImage: cssUrl(`https://i.ytimg.com/vi/${yt[1]}/hqdefault.jpg`), backgroundSize: 'cover', color: '#fff' }, text: 'Video YouTube' }));
        else { const v = h('video', { src: url, controls: true, playsinline: true, preload: 'metadata' }); w.appendChild(v); }
        if (!url && !edit) { sec.textContent = ''; return; }
        sec.append(rv(w));
      },
      teks(sec, b, p) { sec.append(rv(T('h2', p + '.judul', 'u-judul', 'Judul')), rv(T('p', p + '.isi', 'u-teks', 'Isi teks'))); },
      gambar(sec, b, p) { sec.append(rv(h('figure', { class: 'u-gambar-bebas', style: { margin: 0 } }, F(p + '.src', 'Gambar', b.bentuk || 'kotak'), T('figcaption', p + '.ket', null, 'Keterangan (opsional)')))); },
      rsvp(sec, b, p) {
        sec.append(rv(T('p', p + '.label', 'u-kecil', 'Label')), rv(T('h2', p + '.judul', 'u-judul', 'Judul')));
        const id = (n) => `u-${n}-${i0++}`;
        const f = h('form', { class: 'u-form', 'data-rsvp': '' },
          h('label', {}, 'Nama', h('input', { type: 'text', name: 'nama', id: id('nama'), maxlength: '60', autocomplete: 'name', placeholder: 'Nama Anda' })),
          h('div', { class: 'u-lbl' }, 'Kehadiran', h('div', { class: 'u-pilih' }, [['ya', 'Hadir'], ['tidak', 'Berhalangan'], ['ragu', 'Belum pasti']].map(([v, l]) => h('label', {}, h('input', { type: 'radio', name: 'hadir', value: v, id: id('h' + v) }), h('span', { text: l }))))),
          h('label', {}, 'Jumlah tamu', h('select', { name: 'jumlah', id: id('jml') }, [1, 2, 3, 4, 5].map((n) => h('option', { text: String(n) })))),
          h('label', {}, 'Ucapan & doa', h('textarea', { name: 'ucapan', id: id('uc'), maxlength: '500', placeholder: 'Tulis doa untuk kedua mempelai' })),
          h('button', { class: 'u-btn u-penuh', type: 'submit', text: 'Kirim' }));
        if (edit) f.querySelectorAll('input,select,textarea,button').forEach((x) => (x.disabled = true));
        sec.append(rv(f), h('div', { class: 'u-statistik' }, h('div', {}, h('b', { 'data-n': 'total', text: '0' }), 'Ucapan'), h('div', {}, h('b', { 'data-n': 'ya', text: '0' }), 'Hadir'), h('div', {}, h('b', { 'data-n': 'tidak', text: '0' }), 'Absen')),
          h('div', { class: 'u-ucapan-list', 'data-ucapan': '' }, h('p', { class: 'u-kosong-teks', text: edit ? 'Ucapan dari tamu akan tampil di sini.' : 'Belum ada ucapan. Jadilah yang pertama.' })));
      },
      hadiah(sec, b, p) {
        sec.append(rv(T('p', p + '.label', 'u-kecil', 'Label')), rv(T('p', p + '.teks', 'u-teks', 'Kalimat pengantar')));
        const list = h('div', { class: 'u-rek-list', 'data-list': p + '.rekening', 'data-jenis': 'rekening' });
        (b.rekening || []).forEach((r, j) => {
          const q = `${p}.rekening.${j}`;
          list.appendChild(rv(h('div', { class: 'u-rek', 'data-item': q },
            h('div', { style: { minWidth: 0 } }, T('div', q + '.bank', 'u-bank', 'Bank'), T('div', q + '.nomor', 'u-no', 'Nomor rekening'), T('div', q + '.atasNama', 'u-an', 'Atas nama')),
            h('button', { class: 'u-btn', type: 'button', 'data-salin': r.nomor || '', 'data-pesan': 'Nomor rekening disalin', text: 'Salin' }))));
        });
        sec.append(list);
        const al = b.alamat || {};
        if (edit || al.alamat) sec.append(rv(h('div', { class: 'u-kado' }, 'Kirim kado ke', T('b', p + '.alamat.penerima', null, 'Nama penerima'), T('span', p + '.alamat.alamat', null, 'Alamat kirim kado'),
          h('div', { class: 'u-aksi' }, h('button', { class: 'u-btn', type: 'button', 'data-salin': al.alamat || '', 'data-pesan': 'Alamat disalin', text: 'Salin alamat' })))));
      },
      penutup(sec, b, p) {
        sec.append(orn('u-orn-besar'), rv(T('p', p + '.teks', 'u-teks', 'Kalimat penutup')), rv(T('p', p + '.salam', 'u-kecil', 'Salam')));
        sec.lastChild.style.marginTop = '30px';
        sec.append(rv(h('h2', { class: 'u-tulis' }, nama())), rv(T('p', p + '.keluarga', 'u-teks', 'Nama keluarga')));
      },
    };
    let i0 = 0;
    (D.bagian || []).forEach((b, i) => {
      if (b.sembunyi && !edit) return;
      const r = BAGIAN[b.tipe]; if (!r) return;
      const p = `bagian.${i}`;
      const sec = h('section', { class: `u-bag u-bag--${b.tipe}${b.garis ? ' u-bag-garis' : ''}${b.sembunyi ? ' u-tersembunyi' : ''}`, 'data-bag': String(i), id: 'bagian-' + i });
      if (b.latar) { sec.style.setProperty('--u-bag-img', cssUrl(b.latar)); sec.style.setProperty('--u-bag-redup', b.redup ?? 0.55); }
      r(sec, b, p, i);
      if (sec.childNodes.length) isi.appendChild(sec);
    });
    if (D.kredit || edit) isi.appendChild(T('div', 'kredit', 'u-kredit', 'Nama studio Anda'));

    if (!edit) hidupkan(root, D, opsi);
    else { const hit = root.querySelectorAll('[data-hitung]'); if (hit.length) hitungMundur(hit, utama); }
    return root;
  };

  function gcal(a) {
    const d = tglLokal(a.tanggal); if (!d) return '#';
    const jam = (s, def) => { const m = /(\d{1,2})[.:](\d{2})/.exec(s || ''); return m ? pad(m[1]) + m[2] + '00' : def; };
    const ymd = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
    const mulai = jam(a.mulai, '080000'); let selesai = jam(a.selesai, '');
    if (!selesai) selesai = pad(Math.min(23, +mulai.slice(0, 2) + 2)) + mulai.slice(2);
    const q = new URLSearchParams({ action: 'TEMPLATE', text: a.nama || 'Pernikahan', dates: `${ymd}T${mulai}/${ymd}T${selesai}`, ctz: ZONA_TZ[(a.zona || 'WIB').toUpperCase()] || 'Asia/Jakarta', location: [a.tempat, a.alamat].filter(Boolean).join(', ') });
    return 'https://calendar.google.com/calendar/render?' + q.toString();
  }

  function hitungMundur(els, target) {
    if (!target) return;
    const tick = () => {
      let s = Math.max(0, Math.floor((target - Date.now()) / 1000));
      const v = { d: Math.floor(s / 86400), h: Math.floor((s %= 86400) / 3600), m: Math.floor((s %= 3600) / 60), s: s % 60 };
      els.forEach((el) => el.querySelectorAll('[data-cd]').forEach((b) => (b.textContent = pad(v[b.dataset.cd]))));
    };
    tick(); clearInterval(hitungMundur.t); hitungMundur.t = setInterval(tick, 1000);
  }

  /* ---------------- perilaku mode lihat ---------------- */
  function toast(root, teks) {
    let t = root.querySelector('.u-toast'); if (!t) { t = h('div', { class: 'u-toast', role: 'status' }); root.appendChild(t); }
    t.textContent = teks; t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => (t.hidden = true), 2400);
  }
  function hidupkan(root, D, opsi) {
    const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.style.overflow = 'hidden';
    const audio = (D.tema && D.tema.musik && D.tema.musik.url) ? new Audio(D.tema.musik.url) : null;
    if (audio) { audio.loop = true; audio.volume = 0.7; }
    const tombolMusik = root.querySelector('[data-musik]');
    const setMusik = (on) => { root.classList.toggle('u-musik-on', on); if (tombolMusik) { tombolMusik.setAttribute('aria-pressed', String(on)); tombolMusik.setAttribute('aria-label', on ? 'Hentikan musik' : 'Putar musik'); } };
    const putar = () => { if (!audio) return; audio.play().then(() => setMusik(true), () => setMusik(false)); };
    const jeda = () => { if (audio) audio.pause(); setMusik(false); };
    if (tombolMusik) tombolMusik.addEventListener('click', () => (audio && !audio.paused ? jeda() : putar()));
    let lanjut = false;
    document.addEventListener('visibilitychange', () => { if (!audio) return; if (document.hidden && !audio.paused) { jeda(); lanjut = true; } else if (!document.hidden && lanjut) { lanjut = false; putar(); } });

    // reveal
    let io = null;
    if (!reduce && 'IntersectionObserver' in window) {
      root.classList.add('u-rv');
      io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('u-in'); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    }
    const sampul = root.querySelector('[data-sampul]');
    sampul.querySelectorAll('[data-rv]').forEach((e) => e.classList.add('u-in'));
    root.querySelector('[data-buka]').addEventListener('click', () => {
      if (root.classList.contains('u-membuka')) return;
      root.classList.add('u-membuka'); putar();
      setTimeout(() => {
        root.classList.add('u-terbuka'); document.documentElement.style.overflow = ''; window.scrollTo(0, 0);
        if (io) root.querySelectorAll('.u-isi [data-rv]').forEach((e) => io.observe(e));
      }, reduce ? 0 : 1000);
    });

    hitungMundur(root.querySelectorAll('[data-hitung]'), tanggal(D.tanggalUtama));

    // salin
    root.addEventListener('click', (e) => {
      const b = e.target.closest('[data-salin]'); if (!b) return;
      const teks = b.dataset.salin, pesan = b.dataset.pesan || 'Disalin';
      const cad = () => { const a = h('textarea', { style: { position: 'fixed', opacity: '0' } }); a.value = teks; document.body.appendChild(a); a.select(); try { document.execCommand('copy'); toast(root, pesan); } catch (x) { toast(root, teks); } a.remove(); };
      if (navigator.clipboard) navigator.clipboard.writeText(teks).then(() => toast(root, pesan), cad); else cad();
    });

    // lightbox
    root.addEventListener('click', (e) => {
      const f = e.target.closest('.u-isi .u-foto[data-url]'); if (!f) return;
      const daftar = [...root.querySelectorAll('.u-isi .u-foto[data-url]')]; let i = daftar.indexOf(f);
      const img = h('img', { alt: '' }), cap = h('figcaption');
      const tampil = () => { img.src = daftar[i].dataset.url; cap.textContent = daftar[i].dataset.caption || `${i + 1} / ${daftar.length}`; };
      const lb = h('div', { class: 'u-lightbox', role: 'dialog', 'aria-label': 'Foto' },
        h('button', { class: 'u-lb-x', type: 'button', 'aria-label': 'Tutup', text: '×', onclick: () => tutup() }),
        h('button', { type: 'button', 'aria-label': 'Sebelumnya', text: '‹', onclick: () => { i = (i - 1 + daftar.length) % daftar.length; tampil(); } }),
        h('figure', {}, img, cap),
        h('button', { type: 'button', 'aria-label': 'Berikutnya', text: '›', onclick: () => { i = (i + 1) % daftar.length; tampil(); } }));
      const kunci = (ev) => { if (ev.key === 'Escape') tutup(); if (ev.key === 'ArrowRight') { i = (i + 1) % daftar.length; tampil(); } if (ev.key === 'ArrowLeft') { i = (i - 1 + daftar.length) % daftar.length; tampil(); } };
      const tutup = () => { lb.remove(); document.removeEventListener('keydown', kunci); };
      lb.addEventListener('click', (ev) => { if (ev.target === lb) tutup(); });
      let sx = 0; lb.addEventListener('touchstart', (ev) => (sx = ev.touches[0].clientX), { passive: true });
      lb.addEventListener('touchend', (ev) => { const dx = ev.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) { i = (i + (dx < 0 ? 1 : -1) + daftar.length) % daftar.length; tampil(); } });
      document.addEventListener('keydown', kunci);
      root.appendChild(lb); tampil();
    });

    // RSVP
    const form = root.querySelector('[data-rsvp]'), list = root.querySelector('[data-ucapan]');
    if (form && list) {
      const store = opsi.store, slug = opsi.slug || 'contoh';
      const kunci = 'ucapan:' + slug; let semua = [];
      const lokal = () => { try { return JSON.parse(localStorage.getItem(kunci) || '[]'); } catch (e) { return []; } };
      const label = { ya: 'Hadir', tidak: 'Berhalangan', ragu: 'Belum pasti' };
      const waktu = (iso) => { const d = new Date(iso); if (isNaN(d)) return ''; const s = (Date.now() - d) / 1000; if (s < 60) return 'baru saja'; if (s < 3600) return Math.floor(s / 60) + ' menit lalu'; if (s < 86400) return Math.floor(s / 3600) + ' jam lalu'; if (s < 2592000) return Math.floor(s / 86400) + ' hari lalu'; return `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`; };
      const gambar = () => {
        list.textContent = '';
        if (!semua.length) list.appendChild(h('p', { class: 'u-kosong-teks', text: 'Belum ada ucapan. Jadilah yang pertama.' }));
        semua.slice(0, 100).forEach((u) => list.appendChild(h('article', { class: 'u-uc' }, h('h4', {}, h('span', { text: u.nama }), h('em', { text: label[u.hadir] || '' })), u.ucapan ? h('p', { text: u.ucapan }) : null, h('time', { text: waktu(u.waktu) }))));
        const n = (k) => root.querySelectorAll(`[data-n="${k}"]`).forEach((e) => (e.textContent = k === 'total' ? semua.length : semua.filter((u) => u.hadir === k).length));
        n('total'); n('ya'); n('tidak');
      };
      (store ? store.ucapanDaftar(slug).catch(() => lokal()) : Promise.resolve(lokal())).then((r) => { semua = r || []; gambar(); });
      const inNama = form.querySelector('[name=nama]');
      if (opsi.tamu) inNama.value = opsi.tamu;
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        const row = { nama: String(fd.get('nama') || '').trim().slice(0, 60), hadir: String(fd.get('hadir') || ''), jumlah: +fd.get('jumlah') || 1, ucapan: String(fd.get('ucapan') || '').trim().slice(0, 500), waktu: new Date().toISOString() };
        if (!row.nama) return toast(root, 'Isi nama Anda dulu');
        if (!row.hadir) return toast(root, 'Pilih konfirmasi kehadiran');
        const btn = form.querySelector('[type=submit]'); btn.disabled = true;
        try {
          if (store) await store.ucapanKirim(slug, row);
          else { try { localStorage.setItem(kunci, JSON.stringify([row].concat(lokal()).slice(0, 100))); } catch (x) {} }
          semua.unshift(row); gambar(); form.reset(); inNama.value = row.nama;
          toast(root, 'Terima kasih, konfirmasi Anda sudah tercatat');
        } catch (x) { toast(root, 'Gagal mengirim. Periksa koneksi lalu coba lagi.'); }
        finally { btn.disabled = false; }
      });
    }
  }
})();
