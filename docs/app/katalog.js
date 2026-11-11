/* =====================================================================
   Katalog template: satu daftar yang dipakai etalase dan editor.
   - key      : nama folder di klasik/ atau 'studio-<preset>' untuk template susun bebas
   - kat      : kategori (lihat KATALOG.kategori)
   - demo     : alamat contoh, relatif terhadap akar situs
   - gambar   : gambar pratinjau, relatif terhadap akar situs
   Urutan di sini adalah urutan tampil.
   ===================================================================== */
(function () {
  'use strict';
  const klasik = (key, nama, kat, slogan, ket, fitur) => ({ key, nama, kat, slogan, ket, fitur, jenis: 'desain', demo: `klasik/${key}/`, gambar: `klasik/pratinjau/${key}.jpg` });
  const studio = (preset, nama, kat, slogan, ket) => ({ key: 'studio-' + preset, nama, kat: kat.concat('bebas'), slogan, ket, fitur: ['Bagian bisa ditambah, dihapus, dan diurutkan', 'Bentuk bingkai foto dan ornamen bisa dipilih', 'Warna dan huruf bebas diganti', 'RSVP, ucapan, amplop digital'], jenis: 'bebas', demo: `?u=contoh&t=${preset}`, gambar: `klasik/pratinjau/studio-${preset}.jpg` });

  window.KATALOG = {
    kategori: [
      { id: 'semua', nama: 'Semua' },
      { id: 'adat', nama: 'Adat Nusantara' },
      { id: 'islami', nama: 'Islami' },
      { id: 'elegan', nama: 'Elegan' },
      { id: 'kreatif', nama: 'Kreatif' },
      { id: 'bebas', nama: 'Susun bebas' },
    ],
    template: [
      klasik('11-wayang', 'Pagelaran', ['adat', 'kreatif'], 'Pertunjukan wayang kulit Jawa',
        'Kelir disinari blencong, gunungan dicabut saat undangan dibuka, lalu wayang Arjuna dan Sumbadra tampil di layar.',
        ['Foto wayang kulit asli', 'Weton dihitung otomatis', 'Hitung mundur di bilah saron yang bisa ditabuh', 'Rangkaian upacara adat beserta maknanya', 'Aksara Jawa dan iringan bernuansa gamelan']),
      klasik('7-zamrud', 'Zamrud', ['elegan', 'islami'], 'Hijau zamrud dan emas',
        'Monogram berbingkai laurel, lencana ikon acara, kalender, susunan acara, dan pemutar musik di dok bawah.',
        ['Monogram laurel', 'Kalender dan susunan acara', 'Dress code dengan contoh warna', 'QRIS dan amplop digital', 'Dok navigasi dengan pemutar musik']),
      klasik('10-kabar', 'Kabar Bahagia', ['kreatif'], 'Koran edisi khusus pernikahan',
        'Koran terlipat yang membentang, label pelanggan bernama tamu, ticker hitung mundur, dan rubrik-rubrik koran.',
        ['Sampul koran terlipat', 'Ticker berjalan berisi hitung mundur', 'Kuis seberapa kenal tamu dengan mempelai', 'Surat Pembaca untuk RSVP', 'Iklan Baris untuk amplop digital']),
      klasik('8-lintas', 'Lintas', ['kreatif', 'elegan'], 'Tiket perjalanan menuju pelaminan',
        'Boarding pass yang tersobek saat dibuka, paspor mempelai, tiket acara, rute kisah, dan label bagasi.',
        ['Boarding pass bernama tamu', 'Paspor mempelai', 'Tiket acara dengan barcode', 'Rute kisah cinta', 'Kalender keberangkatan']),
      klasik('9-gonjong', 'Gonjong', ['adat'], 'Adat Minang, marun dan emas',
        'Rumah gadang bergonjong, rangkaian bunga marun, pita nama, dan motif songket emas.',
        ['Rumah gadang bergonjong', 'Rangkaian bunga marun', 'Pita nama mempelai', 'Motif songket emas', 'Dok navigasi dengan musik']),
      klasik('1-sekar-jagad', 'Sekar Jagad', ['adat', 'elegan'], 'Adat Jawa, pintu gebyok',
        'Pintu gebyok terbuka saat undangan dibuka, batik kawung, gunungan, dan sogan cokelat keemasan.',
        ['Pintu gebyok yang terbuka', 'Batik kawung', 'Paribasan Jawa', 'Hitung mundur', 'RSVP dan amplop digital']),
      klasik('4-mihrab', 'Mihrab', ['islami', 'elegan'], 'Lengkung mihrab hijau dan emas',
        'Tamu masuk lewat lengkung mihrab; pola bintang, kaligrafi basmalah, dan tanggal Hijriah.',
        ['Lengkung mihrab sebagai pintu masuk', 'Tanggal Masehi dan Hijriah', 'Ayat dalam huruf Arab', 'Pola bintang delapan', 'RSVP dan amplop digital']),
      klasik('5-rasi', 'Rasi', ['kreatif', 'elegan'], 'Di bawah langit yang sama',
        'Langit malam dengan fase bulan di hari pernikahan, bintang jatuh, dan efek warp saat dibuka.',
        ['Fase bulan sesuai tanggal acara', 'Bintang jatuh saat layar diketuk', 'Efek warp saat dibuka', 'Foto mempelai dalam orbit bintang', 'RSVP dan amplop digital']),
      klasik('3-surat-kebun', 'Surat Kebun', ['elegan'], 'Surat botanikal bersegel lilin',
        'Amplop bersegel lilin dengan cap pos, ranting yang tergambar sendiri, dan daun yang berjatuhan.',
        ['Amplop dan segel lilin', 'Cap pos bertanggal acara', 'Ranting tergambar saat digulir', 'Daun berjatuhan', 'RSVP dan amplop digital']),
      klasik('2-rol-film', 'Rol Film', ['kreatif'], 'Analog, tiket bioskop kuning',
        'Hitung mundur proyektor, tiket bioskop, bingkai film, dan polaroid yang bisa digeser.',
        ['Tiket bioskop bernama tamu', 'Hitung mundur proyektor', 'Bingkai film dan lembar kontak', 'Polaroid yang bisa digeser', 'RSVP dan amplop digital']),
      klasik('6-dusty-rose', 'Dusty Rose', ['elegan'], 'Mawar pudar yang lembut',
        'Sampul terangkat perlahan, mawar satu garis yang tergambar sendiri, dan bingkai foto oval.',
        ['Sampul terangkat', 'Mawar satu garis', 'Bingkai oval dan lengkung', 'Hitung mundur', 'RSVP dan amplop digital']),
      studio('dusty-rose', 'Mawar Lapang', ['elegan'], 'Dusty rose, susun sendiri', 'Mawar pudar, foto oval dan lengkung. Semua bagian bisa disusun ulang.'),
      studio('ivory', 'Ivory Minimal', ['elegan'], 'Gading yang rapi dan lapang', 'Gading dan abu hangat, bingkai kotak, tata letak lapang.'),
      studio('sage', 'Sage Eucalyptus', ['elegan'], 'Hijau sage, kesan taman', 'Hijau sage lembut dengan foto bulat.'),
      studio('monokrom', 'Monokrom Editorial', ['kreatif'], 'Hitam putih ala majalah', 'Hitam putih tanpa ornamen, seperti halaman majalah.'),
      studio('pasir', 'Lengkung Pasir', ['elegan'], 'Pasir dan biru kabut', 'Pasir dan biru kabut, bingkai lengkung, galeri geser.'),
      studio('malam', 'Langit Malam', ['elegan'], 'Biru malam dan emas', 'Biru malam dan emas dengan foto bulat.'),
    ],
  };
  window.KATALOG.cari = (key) => window.KATALOG.template.find((t) => t.key === key) || null;
  window.KATALOG.namaKategori = (id) => (window.KATALOG.kategori.find((k) => k.id === id) || {}).nama || id;
  /* Slug khusus di tabel undangan */
  window.KATALOG.SLUG_PENGATURAN = 'pengaturan-etalase';
})();
