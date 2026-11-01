# Panduan Undangan Digital

Lima template undangan pernikahan. Satu mesin bersama (`src/engine.js`), lima desain berbeda.

```
undangan/
├── build.mjs              ← menggabungkan semuanya ke dist/
├── src/
│   ├── engine.js          ← logika bersama (jangan diubah per klien)
│   ├── base.css           ← gaya fungsi bersama
│   ├── katalog.html       ← halaman etalase
│   └── templates/
│       ├── 1-sekar-jagad.html   (Adat Jawa)
│       ├── 2-rol-film.html      (Analog / film)
│       ├── 3-surat-kebun.html   (Botanikal, amplop)
│       ├── 4-mihrab.html        (Islami modern)
│       └── 5-rasi.html          (Langit malam)
└── dist/                  ← hasil siap unggah (jangan diedit langsung)
```

## Ruang admin (tanpa coding)

Buka `https://ysisking.github.io/Undangan/admin/` di browser.

1. **Masuk sekali** dengan token GitHub (cara membuatnya tertulis di halaman masuk; izin yang dibutuhkan: *Contents: Read and write* untuk repositori ini saja). Token hanya tersimpan di perangkat Anda.
2. **Pilih undangan** di bagian atas, ubah isi lewat formulir, unggah foto dan lagu. Pratinjau ponsel di kanan ikut berubah.
3. Klik **Simpan**. Link undangan ikut berubah dalam 1–3 menit.
4. **Undangan baru**: isi alamat link (misal `andi-sari`) dan pilih template. Undangan dibuat di `…/Undangan/andi-sari/`.
5. Tab **Link tamu**: tempel daftar nama tamu, lalu salin pesan atau kirim langsung lewat WhatsApp.
6. Tab **Lanjutan**: untuk kolom khusus template yang tidak ada di formulir.

Foto otomatis diperkecil (maks. 1600 px) sebelum diunggah. Lagu maksimal 15 MB.

## Alur kerja per klien (lewat kode)

1. Salin template yang dipilih klien, beri nama sesuai pasangan:
   ```bash
   cp src/templates/3-surat-kebun.html src/templates/adrian-gracia.html
   ```
2. Buka file itu dan ubah blok `window.UNDANGAN` di bagian atas. Semua isi undangan ada di blok ini.
3. Jalankan build:
   ```bash
   node build.mjs
   ```
4. Hasilnya ada di `dist/adrian-gracia/index.html`. Unggah folder itu ke hosting.

## Isi blok `window.UNDANGAN`

| Kolom | Isi |
|---|---|
| `id` | Kode unik, misal `adrian-gracia`. Dipakai untuk menyimpan ucapan. |
| `tanggalUtama` | Tanggal & jam untuk hitung mundur, format `2027-02-20T10:00:00+07:00`. Akhiran `+07:00` = WIB, `+08:00` = WITA, `+09:00` = WIT. |
| `musik.url` | Link file `.mp3`. Kosongkan untuk memakai kotak musik bawaan. `musik.bawaan: false` untuk tanpa musik. |
| `sampul.foto` | Foto utama. |
| `mempelai.urutan` | `'pria-dulu'` atau `'wanita-dulu'`. Menentukan urutan nama di seluruh undangan. |
| `mempelai.pria / wanita` | `panggilan`, `nama` lengkap, `keterangan` (Putra kedua dari…), `ayah`, `ibu`, `instagram`, `foto`. |
| `acara[]` | Satu baris per acara: `nama`, `tanggal` (`2027-02-20`), `mulai`, `selesai` (`10.00`), `zona` (WIB/WITA/WIT), `tempat`, `alamat`, `peta` (link Google Maps), `catatan` (opsional). |
| `kisah[]` | `tahun`, `judul`, `cerita`. Hapus semua isinya (`kisah: []`) untuk menyembunyikan bagian ini. |
| `galeri[]` | Daftar link foto. Boleh juga `{ src: '...', ket: 'Keterangan' }`. Jumlahnya bebas. |
| `video` | Link YouTube atau file `.mp4`. Kosong = bagian video disembunyikan. |
| `hadiah.rekening[]` | `bank`, `nomor`, `atasNama`. Tombol salin otomatis. |
| `hadiah.alamat` | `penerima`, `alamat` untuk kirim kado. Hapus kolom ini bila tidak perlu. |
| `rsvp.endpoint` | Link Google Apps Script (lihat bawah). Kosong = mode contoh, ucapan hanya tersimpan di perangkat tamu. |
| `rsvp.contoh[]` | Ucapan contoh untuk demo. **Kosongkan (`[]`) untuk undangan klien sungguhan.** |
| `penutup` | Teks penutup, salam, nama keluarga. |
| `kredit` | Tulisan kecil di bagian paling bawah, misal nama studio Anda. |

Template 4 (Mihrab) punya kolom tambahan `doa`. Template 2 (Rol Film) memakai `penutup.kredit[]` untuk daftar "kredit film".

Tanggal Hijriah (Mihrab) dan fase bulan (Rasi) dihitung otomatis dari tanggal, tidak perlu diisi.

## Foto, musik, dan video

Cara paling mudah: taruh file di samping `index.html` lalu tulis path relatifnya.

```
dist/adrian-gracia/
├── index.html
├── foto/sampul.jpg
├── foto/1.jpg
└── lagu.mp3
```

```js
sampul: { label: 'Undangan Pernikahan', foto: 'foto/sampul.jpg' },
galeri: ['foto/1.jpg', 'foto/2.jpg', 'foto/3.jpg'],
musik: { url: 'lagu.mp3' },
```

Tips:
- Perkecil foto dulu (lebar 1200–1600 px, JPG kualitas 75–80). Undangan dibuka lewat data seluler.
- Pakai musik yang lisensinya jelas, atau lagu yang dibeli/diberikan klien.
- Browser tidak mengizinkan musik berbunyi sebelum tamu menyentuh layar. Karena itu musik mulai saat tombol "Buka Undangan" ditekan.

## Link untuk tamu

Nama tamu diambil dari link:

```
https://domainanda.com/adrian-gracia/?to=Bapak+Budi+Santoso
https://domainanda.com/adrian-gracia/#Bapak-Budi-Santoso
```

Untuk membuat banyak link sekaligus, buat kolom nama tamu di Google Sheets lalu pakai rumus:
`="https://domainanda.com/adrian-gracia/?to="&ENCODEURL(A2)`

## RSVP & ucapan dengan Google Sheets (gratis)

Tanpa ini, ucapan hanya tersimpan di perangkat masing-masing tamu.

1. Buat Google Sheet baru untuk klien.
2. Menu **Ekstensi → Apps Script**, hapus isinya, tempel kode berikut:

```js
const SHEET = 'Ucapan';

function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName(SHEET) || ss.insertSheet(SHEET);
  if (sh.getLastRow() === 0) sh.appendRow(['waktu', 'nama', 'hadir', 'jumlah', 'ucapan']);
  sh.appendRow([
    d.waktu || new Date().toISOString(),
    String(d.nama || '').slice(0, 60),
    String(d.hadir || ''),
    String(d.jumlah || '1'),
    String(d.ucapan || '').slice(0, 500),
  ]);
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  const sh = SpreadsheetApp.getActive().getSheetByName(SHEET);
  const rows = sh ? sh.getDataRange().getValues().slice(1) : [];
  const data = rows.map((r) => ({ waktu: r[0], nama: r[1], hadir: r[2], jumlah: r[3], ucapan: r[4] }));
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. **Terapkan → Deployment baru → Jenis: Aplikasi web**. "Jalankan sebagai: Saya", "Yang memiliki akses: Siapa saja". Salin URL yang berakhiran `/exec`.
4. Tempel URL itu ke `rsvp.endpoint`, lalu kosongkan `rsvp.contoh`.

Klien bisa melihat rekap kehadiran langsung di Sheet tersebut.

## Hosting

Folder `dist/` adalah situs statis biasa. Pilihan gratis:

- **Netlify Drop** (paling mudah): buka app.netlify.com/drop, seret folder `dist`.
- **Vercel** atau **Cloudflare Pages**: hubungkan ke repositori GitHub, folder output `dist`.
- **GitHub Pages**: unggah isi `dist` ke repositori, aktifkan Pages.

Pasang domain sendiri (misal `namastudio.com`) agar link terlihat profesional: `namastudio.com/adrian-gracia/?to=...`

Judul dan deskripsi pratinjau WhatsApp dibuat otomatis oleh `build.mjs` dari nama pasangan.
