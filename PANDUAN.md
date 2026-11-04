# Panduan Undangan Digital

## Alamat penting

| Untuk | Link |
|---|---|
| Editor (Anda) | `https://ysisking.github.io/Undangan/editor/` |
| Undangan tamu | `https://ysisking.github.io/Undangan/?u=NAMA-LINK&to=Nama+Tamu` |
| Contoh template | `https://ysisking.github.io/Undangan/?u=contoh&t=sage` (`dusty-rose`, `ivory`, `sage`, `monokrom`, `pasir`, `malam`) |

## Dua jenis template

- **Template desain** (Sekar Jagad, Rol Film, Surat Kebun, Mihrab, Rasi, Dusty Rose): animasi pembuka dan tata letak khas. Di editor bisa diubah: semua tulisan, foto, video, musik, warna, huruf, gambar latar tiap bagian, urutan bagian, sembunyikan bagian, serta tambah/hapus acara, cerita, foto galeri, dan rekening (tombol *+ Tambah* di undangan).
- **Template susun bebas**: bagian bisa ditambah dan disusun sesuka hati, termasuk ornamen dan bentuk bingkai foto.

Contoh template desain: `https://ysisking.github.io/Undangan/klasik/1-sekar-jagad/` (ganti nama foldernya).

## Template induk, Template saya, dan Mode desain

- **Edit template**: mengubah template bawaan menjadi versi Anda. Undangan baru dari template itu langsung memakai versi Anda. Tombol **Kembalikan ke asli** membuang perubahan.
- **Duplikat**: membuat salinan template di bagian **Template saya** untuk diubah sesuka hati (bisa diedit, dipakai, diduplikat lagi, atau dihapus).
- **Mode desain** (template desain): klik tombol *Mode desain*, ketuk elemen apa pun di undangan, lalu **seret** untuk memindah. Di tab **Elemen** atur skala, ukuran huruf, lebar, jarak atas/bawah, perataan, warna, atau **hapus elemen**. Elemen yang dihapus bisa ditampilkan lagi dari daftar di tab yang sama.
- **Tambah bagian baru** (tab Bagian): teks, gambar, video, kutipan, atau jarak kosong. Bagian tambahan bisa dihapus.
- **Hapus**: undangan dan template punya tombol Hapus di halaman utama; isi daftar (acara, foto, rekening, dsb.) punya tombol Hapus saat kursor diarahkan ke butirnya.

## Cara mengedit

Semua diedit langsung di atas undangan, seperti di Canva:

- **Tulisan**: ketuk lalu ketik.
- **Foto & gambar**: ketuk foto, pilih *Unggah dari perangkat* atau tempel link. Bentuk bingkai (oval, lengkung, kotak, bulat) bisa diganti di sana.
- **Video**: ketuk kotak video, tempel link YouTube atau unggah MP4.
- **Bagian**: ketuk sebuah bagian untuk memunculkan tombol *naik, turun, latar, sembunyikan, duplikat, hapus*. Tombol *+ Tambah bagian* muncul di antara bagian.
- **Daftar** (acara, kisah, galeri, rekening): tombol *+ Tambah* di bawah daftar; arahkan ke butir untuk *naik, turun, duplikat, hapus*.
- **Tanggal & lokasi**: ketuk tanggal di undangan.
- **Panel kiri**:
  - *Tema*: template, warna, huruf, ornamen (bawaan, tanpa, atau gambar PNG sendiri), latar halaman, animasi pembuka, musik.
  - *Bagian*: urutan semua bagian.
  - *Undangan*: link, terbitkan/sembunyikan, tanggal utama, link tamu + pesan WhatsApp, daftar ucapan & RSVP.
- Perubahan **tersimpan otomatis**. *Urungkan* (Ctrl+Z) dan *Ulangi* tersedia.

## Mode demo vs. mode sungguhan

Selama `docs/app/config.js` masih kosong, editor berjalan dalam **mode demo**: hasil edit hanya tersimpan di browser yang dipakai, dan link undangan hanya bisa dibuka di perangkat itu. Untuk dipakai dengan klien, hubungkan Supabase (gratis):

### Menghubungkan Supabase (sekali saja, ±10 menit)

1. Daftar di **https://supabase.com** → *New project*. Isi nama (misal `undangan`), buat kata sandi database, pilih region **Southeast Asia (Singapore)**.
2. Setelah proyek siap, buka **SQL Editor → New query**, tempel seluruh isi file `supabase/setup.sql`, klik **Run**.
3. Buka **Authentication → Users → Add user → Create new user**. Isi email dan kata sandi Anda, centang *Auto Confirm User*. Ini akun untuk masuk ke editor.
4. Buka **Authentication → Sign In / Providers** (atau *Settings*), matikan **Allow new users to sign up** supaya orang lain tidak bisa mendaftar.
5. Buka **Project Settings → API** (atau *Data API*). Salin **Project URL** dan kunci **anon public** / **publishable**.
6. Kirim kedua nilai itu ke Claude, atau isi sendiri di `docs/app/config.js`:
   ```js
   window.KONFIG = {
     supabaseUrl: 'https://xxxx.supabase.co',
     supabaseKey: 'eyJ...',
   };
   ```

Kunci *anon/publishable* memang dirancang untuk ditaruh di website. Keamanan dijaga oleh aturan di `setup.sql`: tamu hanya bisa membaca undangan yang diterbitkan dan mengirim ucapan; hanya akun Anda yang bisa mengubah undangan dan mengunggah berkas.

Kuota gratis Supabase: database 500 MB dan penyimpanan berkas 1 GB, cukup untuk puluhan undangan. Proyek gratis dijeda bila tidak dipakai 7 hari; buka dashboard Supabase untuk mengaktifkannya lagi.

## Struktur berkas

```
docs/                 ← situs (GitHub Pages)
├── index.html        ← halaman undangan untuk tamu
├── editor/           ← editor
└── app/
    ├── undangan.js   ← mesin undangan: bagian, template, animasi
    ├── undangan.css  ← tampilan
    ├── store.js      ← penyimpanan (Supabase / demo)
    └── config.js     ← kunci Supabase
supabase/setup.sql    ← penyiapan database
src/, build.mjs       ← template statis versi lama (tidak dipakai editor)
```
