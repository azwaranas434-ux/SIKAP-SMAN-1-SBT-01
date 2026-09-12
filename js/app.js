// js/app.js - Entry point aplikasi SIKAP
import { state, loadAll, saveModule } from './state.js';
import { DEFAULT_SETTINGS, SEED_DATA, SEED_WALI_KELAS, SEED_MAPEL, SEED_JADWAL_X1, SEED_MAPEL_XII, SEED_JADWAL_XII, SEED_MAPEL_XI, SEED_JADWAL_XI, SEED_JADWAL_X_LAINNYA } from './config.js';
import { toast } from './ui.js';
import { NAV, renderSidebar } from './nav.js';
import { uid } from './utils.js';
import { pageDashboard, mountDashboard } from './pages/dashboard.js';
import { pageKelas } from './pages/kelas.js';
import { pageSiswa } from './pages/siswa.js';
import { pageMapel } from './pages/mapel.js';
import { pageJadwal } from './pages/jadwal.js';
import { pageAbsensi, mountAbsensi } from './pages/absensi.js';
import { pageNilai, mountNilai } from './pages/nilai.js';
import { pageJurnal } from './pages/jurnal.js';
import { pageCatatan } from './pages/catatan.js';
import { pageRekap, mountRekap } from './pages/rekap.js';
import { pagePengaturan } from './pages/pengaturan.js';
import { pagePengembang } from './pages/pengembang.js';

// Logo sekolah (pakai file lokal agar ringan, bukan base64 raksasa)
window.LOGO_DATA_URI = "SAMPUL.png";
window.state = state;
window.currentRoute = "dashboard";
window.sidebarOpen = false;

window.go = function(id) {
  window.currentRoute = id;
  window.sidebarOpen = false;
  renderApp();
  window.scrollTo(0, 0);
};

window.renderApp = function() { render(); };

function render() {
  renderSidebar();
  const nav = NAV.find(n => n.id === window.currentRoute);
  document.getElementById("pageTitle").textContent = nav.label;
  document.getElementById("pageSub").textContent = nav.sub;
  document.getElementById("dateChip").textContent = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  const el = document.getElementById("content");
  switch (window.currentRoute) {
    case "dashboard": el.innerHTML = pageDashboard(); mountDashboard(); break;
    case "kelas": el.innerHTML = pageKelas(); break;
    case "siswa": el.innerHTML = pageSiswa(); break;
    case "mapel": el.innerHTML = pageMapel(); break;
    case "jadwal": el.innerHTML = pageJadwal(); break;
    case "absensi": el.innerHTML = pageAbsensi(); mountAbsensi(); break;
    case "nilai": el.innerHTML = pageNilai(); mountNilai(); break;
    case "jurnal": el.innerHTML = pageJurnal(); break;
    case "catatan": el.innerHTML = pageCatatan(); break;
    case "rekap": el.innerHTML = pageRekap(); mountRekap(); break;
    case "pengaturan": el.innerHTML = pagePengaturan(); break;
    case "pengembang": el.innerHTML = pagePengembang(); break;
  }
}

async function autoImportAllSeeds() {
  let changedKelas = false, changedSiswa = false, changedMapel = false, changedJadwal = false;
  let newKelas = 0, newSiswa = 0, waliUpdated = 0, newMapel = 0, newJadwal = 0;
  const kelasIdSet = new Set(state.kelas.map(k => k.id));
  const siswaIdSet = new Set(state.siswa.map(s => s.id));
  for (const k of SEED_DATA.kelas) { if (!kelasIdSet.has(k.id)) { state.kelas.push({ ...k }); newKelas++; changedKelas = true; } }
  for (const s of SEED_DATA.siswa) { if (!siswaIdSet.has(s.id)) { state.siswa.push({ ...s }); newSiswa++; changedSiswa = true; } }
  for (const kid in SEED_WALI_KELAS) {
    const k = state.kelas.find(x => x.id === kid);
    const w = SEED_WALI_KELAS[kid];
    if (k && (k.waliKelas || "") !== w.nama) { k.waliKelas = w.nama; k.nipWaliKelas = w.nip || ""; waliUpdated++; changedKelas = true; }
  }
  const hasMapel = (id) => state.mapel.some(m => m.id === id);
  for (const m of SEED_MAPEL) { if (!hasMapel(m.id)) { state.mapel.push({ ...m }); newMapel++; changedMapel = true; } }
  {
    const existingKeys = new Set(state.jadwal.filter(j => j.kelasId === "k-x-1").map(j => `${j.hari}|${j.jamMulai}`));
    for (const j of SEED_JADWAL_X1) {
      if (existingKeys.has(`${j.hari}|${j.jamMulai}`)) continue;
      const mapel = state.mapel.find(m => m.kode === j.mapelKode);
      state.jadwal.push({ id: uid(), hari: j.hari, jamMulai: j.jamMulai, jamSelesai: j.jamSelesai, kelasId: "k-x-1", mapelId: mapel ? mapel.id : "", guru: j.guru });
      newJadwal++; changedJadwal = true;
    }
  }
  {
    const ids = new Set(["k-x-2","k-x-3","k-x-4","k-x-5","k-x-6","k-x-7","k-x-8","k-x-9","k-x-10"]);
    const existingKeys = new Set(state.jadwal.filter(j => ids.has(j.kelasId)).map(j => `${j.kelasId}|${j.hari}|${j.jamMulai}`));
    for (const j of SEED_JADWAL_X_LAINNYA) {
      if (existingKeys.has(`${j.kelasId}|${j.hari}|${j.jamMulai}`)) continue;
      state.jadwal.push({ id: uid(), ...j }); newJadwal++; changedJadwal = true;
    }
  }
  for (const m of SEED_MAPEL_XII) { if (!hasMapel(m.id)) { state.mapel.push({ ...m }); newMapel++; changedMapel = true; } }
  {
    const ids = new Set(["k-xii-1","k-xii-2","k-xii-3","k-xii-4","k-xii-5","k-xii-6","k-xii-7"]);
    const existingKeys = new Set(state.jadwal.filter(j => ids.has(j.kelasId)).map(j => `${j.kelasId}|${j.hari}|${j.jamMulai}`));
    for (const j of SEED_JADWAL_XII) {
      if (existingKeys.has(`${j.kelasId}|${j.hari}|${j.jamMulai}`)) continue;
      state.jadwal.push({ id: uid(), ...j }); newJadwal++; changedJadwal = true;
    }
  }
  for (const m of SEED_MAPEL_XI) { if (!hasMapel(m.id)) { state.mapel.push({ ...m }); newMapel++; changedMapel = true; } }
  {
    const ids = new Set(["k-xi-1","k-xi-2","k-xi-3","k-xi-4","k-xi-5","k-xi-6","k-xi-7","k-xi-8"]);
    const existingKeys = new Set(state.jadwal.filter(j => ids.has(j.kelasId)).map(j => `${j.kelasId}|${j.hari}|${j.jamMulai}`));
    for (const j of SEED_JADWAL_XI) {
      if (existingKeys.has(`${j.kelasId}|${j.hari}|${j.jamMulai}`)) continue;
      state.jadwal.push({ id: uid(), ...j }); newJadwal++; changedJadwal = true;
    }
  }
  if (changedKelas) await saveModule("kelas");
  if (changedSiswa) await saveModule("siswa");
  if (changedMapel) await saveModule("mapel");
  if (changedJadwal) await saveModule("jadwal");
  const total = newKelas + newSiswa + waliUpdated + newMapel + newJadwal;
  if (total > 0) toast(`Data referensi dimuat: ${newSiswa} siswa, ${newKelas} kelas, ${newMapel} mapel, ${newJadwal} sesi jadwal`);
}

async function init() {
  document.getElementById("content").innerHTML = `<div class="empty-state" style="padding:100px 0;">Memuat data dari Supabase…</div>`;
  try {
    await loadAll();
    await autoImportAllSeeds();
    render();
  } catch (e) {
    document.getElementById("content").innerHTML = `
      <div class="card card-pad"><div class="empty-state" style="padding:40px 20px;">
        <div class="et">Gagal terhubung ke Supabase</div>
        <div style="max-width:520px;margin:8px auto 0;font-size:13px;">${e.message || e}</div>
        <div class="hint" style="margin-top:12px;">Pastikan tabel <b>app_storage</b> sudah dibuat (jalankan <b>supabase/schema.sql</b>) dan env <b>SUPABASE_URL</b> + <b>SUPABASE_ANON_KEY</b> terisi di Vercel lalu redeploy.</div>
      </div></div>`;
  }
}

document.getElementById("menuToggle").addEventListener("click", () => {
  window.sidebarOpen = !window.sidebarOpen;
  renderSidebar();
});

init();
