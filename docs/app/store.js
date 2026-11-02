/* =====================================================================
   Penyimpanan: Supabase (login email, database, unggah berkas)
   atau mode demo (localStorage) bila config.js belum diisi.
   ===================================================================== */
(function () {
  'use strict';
  const K = window.KONFIG || {};
  const pakaiSupabase = !!(K.supabaseUrl && K.supabaseKey && window.supabase);
  const cek = ({ data, error }) => { if (error) throw error; return data; };

  function supabaseStore() {
    const sb = window.supabase.createClient(K.supabaseUrl, K.supabaseKey);
    return {
      mode: 'supabase',
      async sesi() { const { data } = await sb.auth.getSession(); return data.session ? { email: data.session.user.email } : null; },
      async masuk(email, sandi) { cek(await sb.auth.signInWithPassword({ email, password: sandi })); },
      async keluar() { await sb.auth.signOut(); },
      async daftar() { return cek(await sb.from('undangan').select('slug,data,terbit,diubah').order('diubah', { ascending: false })); },
      async ambil(slug) { return cek(await sb.from('undangan').select('slug,data,terbit').eq('slug', slug).maybeSingle()); },
      async buat(slug, data) { cek(await sb.from('undangan').insert({ slug, data })); },
      async simpan(slug, data, terbit) { cek(await sb.from('undangan').update({ data, terbit, diubah: new Date().toISOString() }).eq('slug', slug)); },
      async hapus(slug) { cek(await sb.from('undangan').delete().eq('slug', slug)); },
      async unggah(slug, berkas, ekstensi) {
        const jalur = `${slug}/${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}.${ekstensi}`;
        cek(await sb.storage.from('media').upload(jalur, berkas, { contentType: berkas.type || undefined, cacheControl: '31536000', upsert: false }));
        return sb.storage.from('media').getPublicUrl(jalur).data.publicUrl;
      },
      async ucapanDaftar(slug) { return cek(await sb.from('ucapan').select('id,nama,hadir,jumlah,ucapan,waktu').eq('slug', slug).order('waktu', { ascending: false }).limit(300)); },
      async ucapanKirim(slug, r) { cek(await sb.from('ucapan').insert({ slug, nama: r.nama, hadir: r.hadir, jumlah: r.jumlah, ucapan: r.ucapan })); },
      async ucapanHapus(id) { cek(await sb.from('ucapan').delete().eq('id', id)); },
    };
  }

  function demoStore() {
    const KUNCI = 'demo:undangan';
    const baca = () => { try { return JSON.parse(localStorage.getItem(KUNCI) || '{}'); } catch (e) { return {}; } };
    const tulis = (o) => { try { localStorage.setItem(KUNCI, JSON.stringify(o)); } catch (e) { throw new Error('Penyimpanan browser penuh. Mode demo hanya cocok untuk foto kecil; pasang Supabase untuk pemakaian nyata.'); } };
    const bacaDataUrl = (b) => new Promise((ok, gagal) => { const r = new FileReader(); r.onload = () => ok(r.result); r.onerror = gagal; r.readAsDataURL(b); });
    return {
      mode: 'demo',
      async sesi() { return sessionStorage.getItem('demo:masuk') ? { email: 'demo' } : null; },
      async masuk() { sessionStorage.setItem('demo:masuk', '1'); },
      async keluar() { sessionStorage.removeItem('demo:masuk'); },
      async daftar() { const o = baca(); return Object.keys(o).map((slug) => ({ slug, ...o[slug] })).sort((a, b) => (b.diubah || '').localeCompare(a.diubah || '')); },
      async ambil(slug) { const o = baca(); return o[slug] ? { slug, ...o[slug] } : null; },
      async buat(slug, data) { const o = baca(); if (o[slug]) throw new Error('Alamat link itu sudah dipakai.'); o[slug] = { data, terbit: true, diubah: new Date().toISOString() }; tulis(o); },
      async simpan(slug, data, terbit) { const o = baca(); o[slug] = { data, terbit, diubah: new Date().toISOString() }; tulis(o); },
      async hapus(slug) { const o = baca(); delete o[slug]; tulis(o); },
      async unggah(slug, berkas) {
        if (berkas.size > 1.5 * 1024 * 1024) throw new Error('Di mode demo berkas maksimal 1,5 MB. Untuk lagu dan video, tempel link saja atau pasang Supabase.');
        return bacaDataUrl(berkas);
      },
      async ucapanDaftar(slug) { try { return JSON.parse(localStorage.getItem('ucapan:' + slug) || '[]'); } catch (e) { return []; } },
      async ucapanKirim(slug, r) { const a = await this.ucapanDaftar(slug); a.unshift({ id: Date.now(), ...r }); localStorage.setItem('ucapan:' + slug, JSON.stringify(a.slice(0, 100))); },
      async ucapanHapus(id, slug) { const a = (await this.ucapanDaftar(slug)).filter((x) => x.id !== id); localStorage.setItem('ucapan:' + slug, JSON.stringify(a)); },
    };
  }

  function gagalStore() {
    const galat = () => { throw new Error('Tidak bisa terhubung ke server. Periksa koneksi internet, lalu muat ulang halaman.'); };
    return { mode: 'galat', async sesi() { return null; }, masuk: galat, keluar: async () => {}, daftar: galat, ambil: galat, buat: galat, simpan: galat, hapus: galat, unggah: galat, ucapanDaftar: galat, ucapanKirim: galat, ucapanHapus: galat };
  }
  const adaKonfig = !!(K.supabaseUrl && K.supabaseKey);
  window.Simpanan = pakaiSupabase ? supabaseStore() : adaKonfig ? gagalStore() : demoStore();
})();
