/* =====================================================================
   MESIN UNDANGAN — dipakai bersama oleh semua template.
   Tidak perlu diubah per klien. Yang diubah hanya blok window.UNDANGAN
   di bagian atas file template.
   ===================================================================== */
(function () {
  'use strict';

  const D = window.UNDANGAN || {};
  const T = window.TEMA || {};
  const html = document.documentElement;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const pad = (n) => String(n).padStart(2, '0');
  const reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli',
    'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const ZONA = { WIB: 'Asia/Jakarta', WITA: 'Asia/Makassar', WIT: 'Asia/Jayapura' };

  /* ---------- data turunan ---------- */
  const M = D.mempelai || {};
  const pria = M.pria || {}, wanita = M.wanita || {};
  const A = M.urutan === 'wanita-dulu' ? wanita : pria;
  const B = A === pria ? wanita : pria;
  D.galeri = (D.galeri || []).map((g) => (typeof g === 'string' ? { src: g } : g));
  D.$ = {
    a: A, b: B,
    pasangan: [A.panggilan, B.panggilan].filter(Boolean).join(' & '),
    inisialA: (A.panggilan || '').charAt(0).toUpperCase(),
    inisialB: (B.panggilan || '').charAt(0).toUpperCase(),
    tamu: bacaTamu(),
    tahun: tanggal(D.tanggalUtama) ? tanggal(D.tanggalUtama).getFullYear() : '',
  };

  function bacaTamu() {
    let t = '';
    try { t = new URLSearchParams(location.search).get('to') || ''; } catch (e) { /* abaikan */ }
    if (!t && location.hash.length > 1) {
      try { t = decodeURIComponent(location.hash.slice(1)); } catch (e) { t = location.hash.slice(1); }
      t = t.replace(/[-_+]+/g, ' ');
    }
    t = t.trim().slice(0, 80);
    return t || D.tamuBawaan || 'Bapak/Ibu/Saudara/i';
  }

  function tanggal(v) {
    if (!v) return null;
    if (v instanceof Date) return v;
    const s = String(v);
    const m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2})[:.](\d{2}))?/.exec(s);
    if (m && !/(Z|[+-]\d{2}:?\d{2})$/.test(s)) {
      return new Date(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0));
    }
    const d = new Date(s);
    return isNaN(d) ? null : d;
  }

  /* ---------- filter tampilan:  data-k="acara.0.tanggal|panjang" ---------- */
  const FD = {
    hari: (d) => HARI[d.getDay()],
    tgl: (d) => pad(d.getDate()),
    tgl1: (d) => d.getDate(),
    bulan: (d) => BULAN[d.getMonth()],
    bln: (d) => pad(d.getMonth() + 1),
    tahun: (d) => d.getFullYear(),
    thn: (d) => String(d.getFullYear()).slice(2),
    panjang: (d) => `${HARI[d.getDay()]}, ${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`,
    sedang: (d) => `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`,
    titik: (d) => `${pad(d.getDate())} . ${pad(d.getMonth() + 1)} . ${d.getFullYear()}`,
    stempel: (d) => `'${String(d.getFullYear()).slice(2)}  ${pad(d.getMonth() + 1)}  ${pad(d.getDate())}`,
    hijriah: (d) => {
      try {
        return new Intl.DateTimeFormat('id-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' })
          .format(d).replace(/\s?(H|AH|SH)$/, '') + ' H';
      } catch (e) { return ''; }
    },
  };
  const FS = {
    upper: (s) => String(s).toUpperCase(),
    ig: (s) => '@' + String(s).replace(/^@/, ''),
    igurl: (s) => 'https://instagram.com/' + String(s).replace(/^@/, ''),
    inisial: (s) => String(s).trim().charAt(0).toUpperCase(),
    angka: (s) => String(s).replace(/(\d{4})(?=\d)/g, '$1 '),
    nomor: (s, i) => pad(i + 1),
  };

  function ambil(obj, path) {
    if (path === '.' || path === '') return obj;
    return path.replace(/^\./, '').split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
  }

  function nilai(expr, scope, i) {
    const parts = expr.split('|').map((s) => s.trim());
    const p = parts.shift();
    let v;
    if (p === '$i') v = i;
    else if (p === '$n') v = pad((i || 0) + 1);
    else v = p.startsWith('.') ? ambil(scope, p) : ambil(D, p);
    for (const f of parts) {
      if (v == null || v === '') break;
      if (FD[f]) { const d = tanggal(v); v = d ? FD[f](d) : v; }
      else if (FS[f]) v = FS[f](v, i);
    }
    return v;
  }

  const kosong = (v) => v == null || v === '' || v === false || (Array.isArray(v) && !v.length);

  /* ---------- binding ---------- */
  function ikat(root, scope, i) {
    $$('[data-k]', root).forEach((el) => {
      const v = nilai(el.dataset.k, scope, i);
      if (!kosong(v)) el.textContent = v;
      else if (!el.hasAttribute('data-keep')) el.textContent = '';
    });
    $$('[data-src]', root).forEach((el) => {
      const v = nilai(el.dataset.src, scope, i);
      if (kosong(v)) { el.setAttribute('data-empty', ''); return; }
      el.removeAttribute('data-empty');
      el.dataset.url = v;
      if (el.tagName === 'IMG') el.src = v;
      else el.style.backgroundImage = `url("${String(v).replace(/"/g, '%22')}")`;
    });
    $$('[data-href]', root).forEach((el) => {
      const v = nilai(el.dataset.href, scope, i);
      if (kosong(v)) el.hidden = true;
      else { el.href = v; el.target = '_blank'; el.rel = 'noopener'; }
    });
    $$('[data-if]', root).forEach((el) => { if (kosong(nilai(el.dataset.if, scope, i))) el.hidden = true; });
    $$('[data-if-not]', root).forEach((el) => { if (!kosong(nilai(el.dataset.ifNot, scope, i))) el.hidden = true; });
    $$('[data-copy]', root).forEach((el) => { el.dataset.copyV = nilai(el.dataset.copy, scope, i) || ''; });
    $$('[data-attr]', root).forEach((el) => {
      el.dataset.attr.split(';').forEach((pair) => {
        const k = pair.indexOf('=');
        if (k < 1) return;
        const v = nilai(pair.slice(k + 1), scope, i);
        if (!kosong(v)) el.setAttribute(pair.slice(0, k).trim(), v);
      });
    });
    $$('[data-gcal]', root).forEach((el) => { el.href = gcal(scope); el.target = '_blank'; el.rel = 'noopener'; });

    $$('[data-each]', root).forEach((el) => {
      const arr = nilai(el.dataset.each, scope, i) || [];
      const tpl = el.querySelector(':scope > template');
      if (!tpl || !Array.isArray(arr)) return;
      arr.forEach((item, j) => {
        const frag = tpl.content.cloneNode(true);
        Array.from(frag.children).forEach((c) => { c.style.setProperty('--i', j); c.dataset.index = j; });
        ikat(frag, item, j);
        el.appendChild(frag);
      });
      el.style.setProperty('--n', arr.length);
      el.dataset.n = arr.length;
    });
  }

  function gcal(a) {
    const d = tanggal(a.tanggal);
    if (!d) return '#';
    const jam = (s, def) => {
      const m = /(\d{1,2})[.:](\d{2})/.exec(s || '');
      return m ? pad(m[1]) + m[2] + '00' : def;
    };
    const ymd = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
    const mulai = jam(a.mulai, '080000');
    let selesai = jam(a.selesai, '');
    if (!selesai) selesai = pad(Math.min(23, +mulai.slice(0, 2) + 2)) + mulai.slice(2);
    const p = new URLSearchParams({
      action: 'TEMPLATE',
      text: `${a.nama || 'Pernikahan'} ${D.$.pasangan}`,
      dates: `${ymd}T${mulai}/${ymd}T${selesai}`,
      ctz: ZONA[(a.zona || 'WIB').toUpperCase()] || 'Asia/Jakarta',
      location: [a.tempat, a.alamat].filter(Boolean).join(', '),
      details: `Undangan pernikahan ${D.$.pasangan}`,
    });
    return 'https://calendar.google.com/calendar/render?' + p.toString();
  }

  /* ---------- toast ---------- */
  let toastEl, toastT;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'u-toast';
      toastEl.setAttribute('role', 'status');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove('show'), 2400);
  }

  /* ---------- salin ---------- */
  function salin(text, pesan) {
    const ok = () => toast(pesan || 'Disalin');
    const cadangan = () => {
      const ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;opacity:0;left:-9999px';
      document.body.appendChild(ta); ta.select();
      let berhasil = false;
      try { berhasil = document.execCommand('copy'); } catch (e) { /* abaikan */ }
      ta.remove();
      toast(berhasil ? (pesan || 'Disalin') : 'Salin manual: ' + text);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, cadangan);
    else cadangan();
  }

  /* ---------- musik ---------- */
  const Musik = {
    on: false, audio: null, ctx: null, timer: null,
    async mulai() {
      const url = D.musik && D.musik.url;
      if (url) {
        if (!this.audio) { this.audio = new Audio(url); this.audio.loop = true; this.audio.volume = 0.7; }
        try { await this.audio.play(); } catch (e) { return this.ui(false); }
      } else if (!(D.musik && D.musik.bawaan === false)) {
        this.kotakMusik();
      } else return;
      this.ui(true);
    },
    jeda() {
      if (this.audio) this.audio.pause();
      if (this.ctx) this.ctx.suspend();
      this.ui(false);
    },
    alih() { this.on ? this.jeda() : this.mulai(); },
    ui(on) {
      this.on = on;
      html.classList.toggle('musik-on', on);
      $$('[data-musik]').forEach((b) => {
        b.setAttribute('aria-pressed', String(on));
        b.setAttribute('aria-label', on ? 'Hentikan musik' : 'Putar musik');
      });
    },
    /* Kotak musik sederhana (dibangkitkan, tanpa file). Dipakai bila musik.url kosong. */
    kotakMusik() {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (this.ctx) { this.ctx.resume(); return; }
      const ctx = (this.ctx = new AC());
      const master = ctx.createGain(); master.gain.value = 0;
      master.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 2);
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3800;
      const delay = ctx.createDelay(); delay.delayTime.value = 0.42;
      const fb = ctx.createGain(); fb.gain.value = 0.33;
      const wet = ctx.createGain(); wet.gain.value = 0.35;
      delay.connect(fb); fb.connect(delay); delay.connect(wet);
      wet.connect(lp); master.connect(lp); lp.connect(ctx.destination);
      const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
      const nada = (m, t, v) => {
        [[1, 1, 2.4], [4.1, 0.12, 0.5]].forEach(([mult, g, dur]) => {
          const o = ctx.createOscillator(), e = ctx.createGain();
          o.type = 'sine'; o.frequency.value = hz(m) * mult;
          e.gain.setValueAtTime(0, t);
          e.gain.linearRampToValueAtTime(v * g, t + 0.006);
          e.gain.exponentialRampToValueAtTime(0.0001, t + dur);
          o.connect(e); e.connect(master); e.connect(delay);
          o.start(t); o.stop(t + dur + 0.05);
        });
      };
      // progresi lembut: I – vi – IV – V  (atau dari TEMA.akor)
      const akor = T.akor || [[60, 64, 67], [57, 60, 64], [53, 57, 60], [55, 59, 62]];
      const pola = [0, 1, 2, 4, 3, 2, 1, 2];
      let langkah = 0, t0 = ctx.currentTime + 0.1;
      const ketukan = T.tempo || 0.3;
      const jadwal = () => {
        while (t0 < ctx.currentTime + 0.25) {
          const c = akor[Math.floor(langkah / pola.length) % akor.length];
          const nadaAkor = [c[0] - 12, c[0], c[1], c[2], c[0] + 12];
          const n = nadaAkor[pola[langkah % pola.length]];
          nada(n + 12, t0, langkah % pola.length === 0 ? 0.55 : 0.32);
          if (langkah % pola.length === 4 && Math.random() < 0.6) nada(c[1 + (langkah % 2)] + 24, t0 + ketukan / 2, 0.18);
          langkah++; t0 += ketukan;
        }
      };
      this.timer = setInterval(jadwal, 60);
      jadwal();
    },
  };

  /* ---------- buka undangan ---------- */
  let terbuka = false;
  function buka() {
    if (terbuka) return;
    terbuka = true;
    html.classList.add('is-opening');
    document.dispatchEvent(new CustomEvent('undangan:membuka'));
    if (!(D.musik && D.musik.otomatis === false)) Musik.mulai();
    const jeda = reduceMotion ? 0 : (T.jedaBuka == null ? 900 : T.jedaBuka);
    setTimeout(mulaiReveal, jeda * (T.revealAwal == null ? .6 : T.revealAwal));
    setTimeout(() => {
      html.classList.remove('locked');
      html.classList.add('is-open');
      window.scrollTo(0, 0);
      document.dispatchEvent(new CustomEvent('undangan:terbuka'));
      mulaiReveal();
    }, jeda);
  }

  /* ---------- hitung mundur ---------- */
  function hitungMundur() {
    $$('[data-countdown]').forEach((el) => {
      const target = tanggal(nilai(el.dataset.countdown || 'tanggalUtama', D));
      if (!target) return;
      const isi = (k, v) => $$(`[data-cd="${k}"]`, el).forEach((x) => (x.textContent = v));
      const tick = () => {
        let s = Math.max(0, Math.floor((target - Date.now()) / 1000));
        if (s === 0) el.classList.add('selesai');
        isi('d', pad(Math.floor(s / 86400))); s %= 86400;
        isi('h', pad(Math.floor(s / 3600))); s %= 3600;
        isi('m', pad(Math.floor(s / 60)));
        isi('s', pad(s % 60));
      };
      tick(); setInterval(tick, 1000);
    });
  }

  /* ---------- reveal saat scroll ---------- */
  let io;
  function siapkanReveal() {
    if (reduceMotion || !('IntersectionObserver' in window)) return;
    html.classList.add('rv');
    io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  }
  function mulaiReveal() {
    if (!io) return;
    $$('[data-reveal]:not(.in)').forEach((el) => io.observe(el));
  }

  /* ---------- galeri / lightbox ---------- */
  function galeri() {
    const items = () => $$('[data-zoom]').filter((el) => el.dataset.url);
    let lb, img, cap, idx = 0, daftar = [];
    const tampil = (i) => {
      idx = (i + daftar.length) % daftar.length;
      const el = daftar[idx];
      img.src = el.dataset.url;
      cap.textContent = el.dataset.caption || `${idx + 1} / ${daftar.length}`;
    };
    const tutup = () => { lb.classList.remove('show'); setTimeout(() => (lb.hidden = true), 300); };
    document.addEventListener('click', (e) => {
      const el = e.target.closest('[data-zoom]');
      if (!el || !el.dataset.url) return;
      daftar = items();
      if (!lb) {
        lb = document.createElement('div');
        lb.className = 'u-lightbox'; lb.hidden = true;
        lb.innerHTML = '<button class="u-lb-x" aria-label="Tutup">&times;</button>' +
          '<button class="u-lb-prev" aria-label="Sebelumnya">&#8249;</button>' +
          '<figure><img alt=""><figcaption></figcaption></figure>' +
          '<button class="u-lb-next" aria-label="Berikutnya">&#8250;</button>';
        document.body.appendChild(lb);
        img = $('img', lb); cap = $('figcaption', lb);
        $('.u-lb-x', lb).onclick = tutup;
        $('.u-lb-prev', lb).onclick = () => tampil(idx - 1);
        $('.u-lb-next', lb).onclick = () => tampil(idx + 1);
        lb.addEventListener('click', (ev) => { if (ev.target === lb) tutup(); });
        let sx = 0;
        lb.addEventListener('touchstart', (ev) => (sx = ev.touches[0].clientX), { passive: true });
        lb.addEventListener('touchend', (ev) => {
          const dx = ev.changedTouches[0].clientX - sx;
          if (Math.abs(dx) > 40) tampil(idx + (dx < 0 ? 1 : -1));
        });
        document.addEventListener('keydown', (ev) => {
          if (lb.hidden) return;
          if (ev.key === 'Escape') tutup();
          if (ev.key === 'ArrowRight') tampil(idx + 1);
          if (ev.key === 'ArrowLeft') tampil(idx - 1);
        });
      }
      lb.hidden = false;
      requestAnimationFrame(() => lb.classList.add('show'));
      tampil(daftar.indexOf(el));
    });
  }

  /* ---------- video ---------- */
  function video() {
    $$('[data-video]').forEach((el) => {
      const url = nilai(el.dataset.video || 'video', D);
      if (kosong(url)) return;
      const yt = /(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/.exec(url);
      if (yt) {
        el.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0" title="Video" loading="lazy" allow="encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
      } else {
        const v = document.createElement('video');
        v.src = url; v.controls = true; v.playsInline = true; v.preload = 'metadata';
        v.addEventListener('play', () => Musik.on && Musik.jeda());
        el.appendChild(v);
      }
    });
  }

  /* ---------- RSVP & ucapan ---------- */
  function rsvp() {
    const form = $('[data-rsvp]');
    const list = $('[data-wishes]');
    const cfg = D.rsvp || {};
    const kunci = 'undangan:' + (D.id || D.$.pasangan) + ':ucapan';
    let semua = [];
    const label = { ya: 'Hadir', tidak: 'Berhalangan', ragu: 'Masih ragu' };
    const waktu = (iso) => {
      const d = new Date(iso);
      if (isNaN(d)) return '';
      const s = (Date.now() - d) / 1000;
      if (s < 60) return 'baru saja';
      if (s < 3600) return Math.floor(s / 60) + ' menit lalu';
      if (s < 86400) return Math.floor(s / 3600) + ' jam lalu';
      if (s < 86400 * 30) return Math.floor(s / 86400) + ' hari lalu';
      return `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
    };
    const render = () => {
      if (!list) return;
      const tpl = list.querySelector(':scope > template');
      $$(':scope > :not(template)', list).forEach((n) => n.remove());
      semua.slice(0, 60).forEach((u, j) => {
        const frag = tpl.content.cloneNode(true);
        ikat(frag, { ...u, hadirLabel: label[u.hadir] || '', waktuLabel: waktu(u.waktu), inisial: (u.nama || '?').charAt(0).toUpperCase() }, j);
        Array.from(frag.children).forEach((c) => c.classList.add('hadir-' + (u.hadir || 'x')));
        list.appendChild(frag);
      });
      const hit = (h) => semua.filter((u) => u.hadir === h).length;
      $$('[data-rsvp-total]').forEach((el) => (el.textContent = semua.length));
      $$('[data-rsvp-hadir]').forEach((el) => (el.textContent = hit('ya')));
      $$('[data-rsvp-tidak]').forEach((el) => (el.textContent = hit('tidak')));
    };
    const lokal = () => { try { return JSON.parse(localStorage.getItem(kunci) || '[]'); } catch (e) { return []; } };
    const muat = () => {
      if (cfg.endpoint) {
        fetch(cfg.endpoint + (cfg.endpoint.includes('?') ? '&' : '?') + 'aksi=daftar')
          .then((r) => r.json())
          .then((rows) => { semua = (Array.isArray(rows) ? rows : rows.data || []).reverse(); render(); })
          .catch(() => { semua = lokal(); render(); });
      } else {
        semua = lokal().concat((cfg.contoh || []).map((u) => ({ ...u, contoh: true })));
        render();
      }
    };
    muat();
    if (!form) return;
    const namaInput = form.querySelector('[name="nama"]');
    if (namaInput && D.$.tamu && !/^Bapak\/Ibu/.test(D.$.tamu)) namaInput.value = D.$.tamu;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const data = {
        nama: String(fd.get('nama') || '').trim().slice(0, 60),
        hadir: String(fd.get('hadir') || ''),
        jumlah: String(fd.get('jumlah') || '1'),
        ucapan: String(fd.get('ucapan') || '').trim().slice(0, 500),
        waktu: new Date().toISOString(),
      };
      if (!data.nama) { toast('Isi nama Anda dulu'); return; }
      if (!data.hadir) { toast('Pilih konfirmasi kehadiran'); return; }
      const btn = form.querySelector('[type="submit"]');
      if (btn) btn.disabled = true;
      const selesai = () => {
        semua.unshift(data);
        if (!cfg.endpoint) {
          try { localStorage.setItem(kunci, JSON.stringify([data].concat(lokal()).slice(0, 100))); } catch (er) { /* abaikan */ }
        }
        render();
        form.reset();
        if (namaInput) namaInput.value = data.nama;
        if (btn) btn.disabled = false;
        toast(cfg.pesanTerkirim || 'Terima kasih, konfirmasi Anda sudah tercatat');
        document.dispatchEvent(new CustomEvent('undangan:rsvp', { detail: data }));
      };
      if (cfg.endpoint) {
        fetch(cfg.endpoint, { method: 'POST', mode: 'no-cors', body: JSON.stringify(data), headers: { 'Content-Type': 'text/plain;charset=utf-8' } })
          .then(selesai)
          .catch(() => { if (btn) btn.disabled = false; toast('Gagal mengirim. Periksa koneksi lalu coba lagi.'); });
      } else selesai();
    });
  }

  /* ---------- tombol umum ---------- */
  function tombol() {
    document.addEventListener('click', (e) => {
      const c = e.target.closest('[data-copy]');
      if (c) { salin(c.dataset.copyV || '', c.dataset.copyMsg); return; }
      const m = e.target.closest('[data-musik]');
      if (m) { Musik.alih(); return; }
      const g = e.target.closest('[data-goto]');
      if (g) {
        const t = document.getElementById(g.dataset.goto);
        if (t) t.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        return;
      }
      if (e.target.closest('[data-open]')) buka();
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && Musik.on) { Musik.jeda(); Musik.lanjutNanti = true; }
      else if (!document.hidden && Musik.lanjutNanti) { Musik.lanjutNanti = false; Musik.mulai(); }
    });
  }

  /* ---------- jalankan ---------- */
  function init() {
    html.classList.add('locked', 'js');
    if (D.$.pasangan && T.judulDinamis !== false) document.title = (T.awalanJudul || 'Undangan Pernikahan ') + D.$.pasangan;
    ikat(document.body, D, 0);
    siapkanReveal();
    hitungMundur();
    galeri();
    video();
    rsvp();
    tombol();
    if (T.langsungBuka) buka();
    window.Undangan = { D, Musik, toast, salin, tanggal, nilai, buka, ikat };
    document.dispatchEvent(new CustomEvent('undangan:siap'));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
