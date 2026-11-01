-- =====================================================================
-- Penyiapan Supabase untuk editor undangan.
-- Jalankan sekali: Supabase → SQL Editor → New query → tempel → Run.
-- =====================================================================

-- 1. Tabel undangan: satu baris per undangan (isi disimpan sebagai JSON)
create table if not exists public.undangan (
  slug    text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  data    jsonb not null default '{}'::jsonb,
  terbit  boolean not null default true,
  pemilik uuid not null default auth.uid() references auth.users (id) on delete cascade,
  dibuat  timestamptz not null default now(),
  diubah  timestamptz not null default now()
);
alter table public.undangan enable row level security;
drop policy if exists "tamu membaca undangan terbit" on public.undangan;
create policy "tamu membaca undangan terbit" on public.undangan for select using (terbit or auth.uid() = pemilik);
drop policy if exists "pemilik menambah" on public.undangan;
create policy "pemilik menambah" on public.undangan for insert to authenticated with check (auth.uid() = pemilik);
drop policy if exists "pemilik mengubah" on public.undangan;
create policy "pemilik mengubah" on public.undangan for update to authenticated using (auth.uid() = pemilik) with check (auth.uid() = pemilik);
drop policy if exists "pemilik menghapus" on public.undangan;
create policy "pemilik menghapus" on public.undangan for delete to authenticated using (auth.uid() = pemilik);

-- 2. Tabel ucapan & RSVP dari tamu
create table if not exists public.ucapan (
  id     bigint generated always as identity primary key,
  slug   text not null references public.undangan (slug) on delete cascade on update cascade,
  nama   text not null check (char_length(nama) between 1 and 60),
  hadir  text not null check (hadir in ('ya', 'tidak', 'ragu')),
  jumlah int  not null default 1 check (jumlah between 1 and 10),
  ucapan text not null default '' check (char_length(ucapan) <= 500),
  waktu  timestamptz not null default now()
);
create index if not exists ucapan_slug_waktu on public.ucapan (slug, waktu desc);
alter table public.ucapan enable row level security;
drop policy if exists "semua membaca ucapan" on public.ucapan;
create policy "semua membaca ucapan" on public.ucapan for select using (true);
drop policy if exists "tamu mengirim ucapan" on public.ucapan;
create policy "tamu mengirim ucapan" on public.ucapan for insert with check (
  exists (select 1 from public.undangan u where u.slug = ucapan.slug and u.terbit)
);
drop policy if exists "pemilik menghapus ucapan" on public.ucapan;
create policy "pemilik menghapus ucapan" on public.ucapan for delete to authenticated using (
  exists (select 1 from public.undangan u where u.slug = ucapan.slug and u.pemilik = auth.uid())
);

-- 3. Tempat berkas (foto, lagu, video) yang bisa dibuka publik
insert into storage.buckets (id, name, public, file_size_limit)
values ('media', 'media', true, 52428800)
on conflict (id) do update set public = true, file_size_limit = 52428800;
drop policy if exists "media dibaca publik" on storage.objects;
create policy "media dibaca publik" on storage.objects for select using (bucket_id = 'media');
drop policy if exists "pengguna mengunggah media" on storage.objects;
create policy "pengguna mengunggah media" on storage.objects for insert to authenticated with check (bucket_id = 'media');
drop policy if exists "pengguna menghapus media" on storage.objects;
create policy "pengguna menghapus media" on storage.objects for delete to authenticated using (bucket_id = 'media' and owner = auth.uid());
