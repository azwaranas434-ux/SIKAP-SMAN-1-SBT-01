-- SIKAP SMAN 1 SBT - Skema Supabase
-- Jalankan di Supabase Dashboard > SQL Editor

-- Penyimpanan generik (pengganti localStorage, 1 baris per modul)
create table if not exists app_storage (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);
alter table app_storage enable row level security;
drop policy if exists "public read-write" on app_storage;
create policy "public read-write" on app_storage for all using (true) with check (true);

-- Tabel relasional (opsional, untuk query langsung di masa depan)
create table if not exists kelas (
  id text primary key, nama text not null, tingkat text,
  jurusan text default '', wali_kelas text default '',
  nip_wali_kelas text default '', tahun_ajaran text default '2026/2027'
);
create table if not exists siswa (
  id text primary key, nis text default '', nisn text default '',
  nama text not null, kelas_id text references kelas(id),
  jenis_kelamin text, tempat_lahir text default '', tanggal_lahir date,
  nama_ortu text default '', no_hp_ortu text default '',
  alamat text default '', status text default 'Aktif'
);
create table if not exists mapel (
  id text primary key, kode text not null, nama text not null,
  kkm int default 75, guru_pengampu text default ''
);
create table if not exists jadwal (
  id text primary key, hari text not null,
  jam_mulai text, jam_selesai text,
  kelas_id text references kelas(id), mapel_id text references mapel(id),
  guru text default ''
);
create table if not exists absensi (
  id text primary key, tanggal date not null,
  kelas_id text, mapel_id text, siswa_id text,
  status text default 'Hadir', keterangan text default ''
);
create table if not exists nilai (
  id text primary key, tanggal date not null,
  kelas_id text, mapel_id text, siswa_id text,
  jenis text default 'Tugas', nilai numeric,
  semester text default 'Ganjil', tahun_ajaran text default '2026/2027'
);
create table if not exists jurnal (
  id text primary key, tanggal date not null,
  kelas_id text, mapel_id text, jam_ke text default '',
  guru text default '', capaian_pembelajaran text default '',
  tujuan_pembelajaran text default '', materi text default '',
  kegiatan text default '', catatan text default ''
);
create table if not exists catatan (
  id text primary key, tanggal date not null, siswa_id text,
  jenis text default 'Lainnya', catatan text default '',
  tindak_lanjut text default '', guru text default ''
);
