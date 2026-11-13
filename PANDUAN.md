# Panduan Undangan Digital

## Alamat penting

| Untuk | Link |
|---|---|
| Etalase (untuk calon pemesan) | `https://ysisking.github.io/Undangan/` |
| Editor / ruang kerja (Anda) | `https://ysisking.github.io/Undangan/editor/` |
| Undangan tamu | `https://ysisking.github.io/Undangan/?u=ALAMAT-LINK&to=Nama+Tamu` |
| Satu desain di etalase | `https://ysisking.github.io/Undangan/etalase/#7-zamrud` (ganti kodenya) |

## Merek

Logo usaha induk dan logo anakan **Undangan** (amplop dengan pita oranye bersimpul) ada di `docs/app/merek/`, lengkap dengan versi latar gelap, ikon aplikasi, favicon, dan aturan keluarga logo (`README.md`). Logo Undangan tampil di etalase, editor, dan sebagai ikon tab undangan tamu; logo induk tampil di kaki etalase dan halaman masuk.

## Etalase

Halaman publik berisi semua desain. Calon pemesan bisa menyaring per kategori, mencari, membuka **demo langsung di bingkai ponsel**, dan mencoba dengan nama tamunya sendiri. Pasang link etalase di lynk.id atau bio Instagram.

Atur lewat **Ruang kerja → tab Etalase**:

- **Nama studio** dan **kalimat pembuka**.
- **Nomor WhatsApp**: bila diisi, muncul tombol *Pesan desain ini* dan *Tanya lewat WhatsApp*.
- **Teks pesan WhatsApp**: `{nama}` dan `{link}` diganti otomatis.
- **Sembunyikan / tampilkan desain**: menu ⋯ pada kartu template.
- Versi Anda dari sebuah template tampil di etalase setelah dibuka untuk umum lewat menu ⋯ → *Bagikan*.

Bila Anda sedang masuk, setiap desain di etalase punya tombol **Pakai di editor**.

## Ruang kerja

Setelah masuk, ada empat tab:

- **Undangan**: semua undangan klien. *Edit*, *Bagikan*, dan menu ⋯ (*Lihat sebagai tamu*, *Duplikat*, *Hapus*).
- **Template**: 17 template bawaan, bisa disaring per kategori. Klik **Pakai** sekali, undangan langsung dibuat dan terbuka di editor. Klik gambarnya untuk pratinjau.
- **Template saya**: template hasil duplikat yang sudah Anda ubah.
- **Etalase**: pengaturan halaman publik.

**Alamat link** undangan baru dibuat otomatis (mis. `zamrud-k3f9`). Ganti di panel kiri → tab **Undangan** → *Alamat link*, sebelum link dibagikan ke tamu. Setelah diganti, link lama tidak berlaku.

**Foto contoh**: setiap template sudah berisi foto stok bebas pakai supaya tampil utuh. Ketuk foto untuk menggantinya dengan foto mempelai.

**Draf**: undangan yang belum diterbitkan tetap bisa Anda lihat lewat *Lihat sebagai tamu* selama Anda masuk; orang lain tidak bisa membukanya.

## Dua jenis template

- **Desain bertema** (Pagelaran, Zamrud, Kabar Bahagia, Lintas, Gonjong, Sekar Jagad, Mihrab, Rasi, Surat Kebun, Rol Film, Dusty Rose): animasi pembuka dan tata letak khas. Di editor bisa diubah: semua tulisan, foto, video, musik, warna, huruf, gambar latar tiap bagian, urutan bagian, sembunyikan bagian, serta tambah/hapus acara, cerita, foto galeri, dan rekening.
- **Susun bebas** (Mawar Lapang, Ivory Minimal, Sage Eucalyptus, Monokrom Editorial, Lengkung Pasir, Langit Malam): bagian bisa ditambah dan disusun sesuka hati, termasuk ornamen dan bentuk bingkai foto.

## Template induk, Template saya, dan Mode desain

Semua ada di menu ⋯ pada kartu template:

- **Edit template**: mengubah template bawaan menjadi versi Anda. Undangan baru dari template itu langsung memakai versi Anda. **Kembalikan ke asli** membuang perubahan.
- **Duplikat ke Template saya**: membuat salinan untuk diubah sesuka hati (bisa diedit, dipakai, diduplikat lagi, atau dihapus).
- **Mode desain** (desain bertema): klik tombol *Mode desain* di editor, ketuk elemen apa pun, lalu **seret** untuk memindah. Di tab **Elemen** atur skala, ukuran huruf, lebar, jarak, perataan, warna, atau **hapus elemen**. Elemen yang dihapus bisa ditampilkan lagi dari daftar di tab yang sama.
- **Tambah bagian baru** (tab Bagian): teks, gambar, video, kutipan, atau jarak kosong.

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
  - *Undangan*: alamat link, terbitkan/sembunyikan, tanggal utama, link tamu + pesan WhatsApp, daftar ucapan & RSVP.
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
docs/                   ← situs (GitHub Pages)
├── index.html          ← halaman undangan untuk tamu (tanpa ?u= diarahkan ke etalase)
├── etalase/            ← etalase publik
├── editor/             ← ruang kerja dan editor
├── app/
│   ├── katalog.js      ← daftar template: nama, kategori, keterangan (dipakai etalase & editor)
│   ├── undangan.js     ← mesin template susun bebas
│   ├── undangan.css
│   ├── store.js        ← penyimpanan (Supabase / demo)
│   └── config.js       ← kunci Supabase
└── klasik/
    ├── <template>/     ← halaman tiap desain bertema (hasil build)
    ├── pratinjau/      ← gambar kartu template
    ├── aset/           ← foto contoh dan foto wayang (sumber & lisensi: KREDIT.md)
    └── muat.js
src/templates/          ← sumber desain bertema; jalankan `node build.mjs` setelah mengubahnya
supabase/setup.sql      ← penyiapan database
```
