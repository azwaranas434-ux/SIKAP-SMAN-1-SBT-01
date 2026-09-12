// js/pages/pengaturan.js
import { state, saveModule } from '../state.js';
import { esc, icon, uid } from '../utils.js';
import { toast, confirmDelete } from '../ui.js';
import { MENU_COLORS } from '../nav.js';
import {
  SEED_DATA, SEED_WALI_KELAS, SEED_MAPEL, SEED_JADWAL_X1,
  SEED_MAPEL_XII, SEED_JADWAL_XII, SEED_MAPEL_XI, SEED_JADWAL_XI,
  SEED_JADWAL_X_LAINNYA, DEFAULT_SETTINGS, MODULE_KEYS
} from '../config.js';

function seedImportStatus() {
  const kelasIds = new Set(state.kelas.map(k => k.id));
  const siswaIds = new Set(state.siswa.map(s => s.id));
  const kelasNew = SEED_DATA.kelas.filter(k => !kelasIds.has(k.id)).length;
  const siswaNew = SEED_DATA.siswa.filter(s => !siswaIds.has(s.id)).length;
  return { kelasNew, siswaNew, done: kelasNew === 0 && siswaNew === 0 };
}

function waliKelasImportStatus() {
  let pending = 0;
  for (const kid in SEED_WALI_KELAS) {
    const k = state.kelas.find(x => x.id === kid);
    const w = SEED_WALI_KELAS[kid];
    if (k && (k.waliKelas || "") !== w.nama) { pending++; }
  }
  return { pending, done: pending === 0 };
}

function jadwalX1ImportStatus() {
  const mapelKodes = new Set(state.mapel.map(m => m.kode));
  const mapelNew = SEED_MAPEL.filter(m => !mapelKodes.has(m.kode)).length;
  const existingKeys = new Set(state.jadwal.filter(j => j.kelasId === "k-x-1").map(j => `${j.hari}|${j.jamMulai}`));
  const jadwalNew = SEED_JADWAL_X1.filter(j => !existingKeys.has(`${j.hari}|${j.jamMulai}`)).length;
  return { mapelNew, jadwalNew, done: mapelNew === 0 && jadwalNew === 0 };
}

function jadwalXLainnyaImportStatus() {
  const xKelasIds = new Set(["k-x-2", "k-x-3", "k-x-4", "k-x-5", "k-x-6", "k-x-7", "k-x-8", "k-x-9", "k-x-10"]);
  const existingKeys = new Set(state.jadwal.filter(j => xKelasIds.has(j.kelasId)).map(j => `${j.kelasId}|${j.hari}|${j.jamMulai}`));
  const jadwalNew = SEED_JADWAL_X_LAINNYA.filter(j => !existingKeys.has(`${j.kelasId}|${j.hari}|${j.jamMulai}`)).length;
  return { jadwalNew, done: jadwalNew === 0 };
}

function jadwalXIIImportStatus() {
  const mapelIds = new Set(state.mapel.map(m => m.id));
  const mapelNew = SEED_MAPEL_XII.filter(m => !mapelIds.has(m.id)).length;
  const xiiKelasIds = new Set(["k-xii-1", "k-xii-2", "k-xii-3", "k-xii-4", "k-xii-5", "k-xii-6", "k-xii-7"]);
  const existingKeys = new Set(state.jadwal.filter(j => xiiKelasIds.has(j.kelasId)).map(j => `${j.kelasId}|${j.hari}|${j.jamMulai}`));
  const jadwalNew = SEED_JADWAL_XII.filter(j => !existingKeys.has(`${j.kelasId}|${j.hari}|${j.jamMulai}`)).length;
  return { mapelNew, jadwalNew, done: mapelNew === 0 && jadwalNew === 0 };
}

function jadwalXIImportStatus() {
  const mapelIds = new Set(state.mapel.map(m => m.id));
  const mapelNew = SEED_MAPEL_XI.filter(m => !mapelIds.has(m.id)).length;
  const xiKelasIds = new Set(["k-xi-1", "k-xi-2", "k-xi-3", "k-xi-4", "k-xi-5", "k-xi-6", "k-xi-7", "k-xi-8"]);
  const existingKeys = new Set(state.jadwal.filter(j => xiKelasIds.has(j.kelasId)).map(j => `${j.kelasId}|${j.hari}|${j.jamMulai}`));
  const jadwalNew = SEED_JADWAL_XI.filter(j => !existingKeys.has(`${j.kelasId}|${j.hari}|${j.jamMulai}`)).length;
  return { mapelNew, jadwalNew, done: mapelNew === 0 && jadwalNew === 0 };
}

export function pagePengaturan() {
  const s = state.settings;
  const seedStatus = seedImportStatus();
  const waliStatus = waliKelasImportStatus();
  const jadwalStatus = jadwalX1ImportStatus();
  const jadwalXLainnyaStatus = jadwalXLainnyaImportStatus();
  const jadwalXIIStatus = jadwalXIIImportStatus();
  const jadwalXIStatus = jadwalXIImportStatus();
  return `
  <div class="grid-2">
    <div class="card card-pad">
      <div class="section-head"><h3>Profil Sekolah</h3></div>
      <div class="field">
        <label>Nama Sekolah</label>
        <input id="setNama" value="${esc(s.namaSekolah)}">
      </div>
      <div class="field">
        <label>NPSN</label>
        <input id="setNpsn" value="${esc(s.npsn)}">
      </div>
      <div class="field">
        <label>Alamat Sekolah</label>
        <textarea id="setAlamat" rows="2">${esc(s.alamat)}</textarea>
      </div>
      <div class="field">
        <label>Kepala Sekolah</label>
        <input id="setKepsek" value="${esc(s.kepalaSekolah)}">
      </div>
      <div class="field-row">
        <div class="field">
          <label>Tahun Ajaran</label>
          <input id="setTahun" value="${esc(s.tahunAjaran)}" placeholder="2026/2027">
        </div>
        <div class="field">
          <label>Semester</label>
          <select id="setSemester">
            <option value="Ganjil" ${s.semester === 'Ganjil' ? 'selected' : ''}>Ganjil</option>
            <option value="Genap" ${s.semester === 'Genap' ? 'selected' : ''}>Genap</option>
          </select>
        </div>
      </div>
      <button class="btn btn-primary" onclick="window.saveSettings()">${icon('check',14)} Simpan Pengaturan</button>
    </div>

    <div>
    <div class="card card-pad" style="margin-bottom:18px;">
      <div class="section-head"><h3>Impor Data Peserta Didik</h3>${seedStatus.done ? '<span class="badge badge-success">Sudah Terimpor</span>' : '<span class="badge badge-warn">Belum Lengkap</span>'}</div>
      <p style="font-size:12.5px;color:var(--muted);margin-top:0;">Data kelas &amp; siswa hasil unduhan Dapodik (Daftar Peserta Didik SMA Negeri 1 Seram Bagian Timur) sudah disiapkan di dalam aplikasi ini: <strong>${SEED_DATA.kelas.length} kelas</strong> dan <strong>${SEED_DATA.siswa.length} siswa</strong>. Klik tombol di bawah untuk memasukkannya ke Data Kelas &amp; Data Siswa. Data yang sudah ada tidak akan diduplikasi.</p>
      <button class="btn btn-tint" style="background:${MENU_COLORS.siswa};color:#fff;" ${seedStatus.done ? 'disabled' : ''} onclick="window.importSeedData()">
        ${icon('upload',14)} ${seedStatus.done ? 'Data Sudah Diimpor' : `Impor Sekarang (${seedStatus.kelasNew} kelas, ${seedStatus.siswaNew} siswa)`}
      </button>
    </div>

    <div class="card card-pad" style="margin-bottom:18px;">
      <div class="section-head"><h3>Impor Data Wali Kelas</h3>${waliStatus.done ? '<span class="badge badge-success">Sudah Sesuai</span>' : '<span class="badge badge-warn">Belum Lengkap</span>'}</div>
      <p style="font-size:12.5px;color:var(--muted);margin-top:0;">Data wali kelas sesuai <strong>Lampiran III — Pembagian Tugas Tambahan Guru Sebagai Wali Kelas T.P. 2025/2026</strong> untuk <strong>${Object.keys(SEED_WALI_KELAS).length} kelas</strong> (nama &amp; NIP) sudah disiapkan. Klik tombol di bawah untuk menerapkannya ke Data Kelas.</p>
      <button class="btn btn-tint" style="background:${MENU_COLORS.kelas};color:#fff;" ${waliStatus.done ? 'disabled' : ''} onclick="window.importWaliKelas()">
        ${icon('upload',14)} ${waliStatus.done ? 'Data Sudah Sesuai' : `Terapkan Wali Kelas (${waliStatus.pending} kelas)`}
      </button>
    </div>

    <div class="card card-pad" style="margin-bottom:18px;">
      <div class="section-head"><h3>Impor Jadwal Mengajar (Kelas X-2 s/d X-10)</h3>${jadwalXLainnyaStatus.done ? '<span class="badge badge-success">Sudah Terimpor</span>' : '<span class="badge badge-warn">Belum Lengkap</span>'}</div>
      <p style="font-size:12.5px;color:var(--muted);margin-top:0;">Jadwal pelajaran semester genap T.P. 2025/2026 untuk <strong>9 kelas (X-2 s/d X-10)</strong> — Senin–Jumat, ${SEED_JADWAL_X_LAINNYA.length} sesi mengajar — sudah disiapkan (kelas X 1 sudah diimpor sebelumnya). Klik tombol di bawah untuk memasukkannya.</p>
      <button class="btn btn-tint" style="background:${MENU_COLORS.jadwal};color:#fff;" ${jadwalXLainnyaStatus.done ? 'disabled' : ''} onclick="window.importJadwalXLainnya()">
        ${icon('upload',14)} ${jadwalXLainnyaStatus.done ? 'Data Sudah Diimpor' : `Impor Sekarang (${jadwalXLainnyaStatus.jadwalNew} sesi)`}
      </button>
    </div>

    <div class="card card-pad" style="margin-bottom:18px;">
      <div class="section-head"><h3>Impor Jadwal Mengajar (Kelas X 1)</h3>${jadwalStatus.done ? '<span class="badge badge-success">Sudah Terimpor</span>' : '<span class="badge badge-warn">Belum Lengkap</span>'}</div>
      <p style="font-size:12.5px;color:var(--muted);margin-top:0;">Jadwal pelajaran semester genap T.P. 2025/2026 untuk kelas <strong>X 1</strong> (Senin–Jumat, ${SEED_JADWAL_X1.length} sesi mengajar) beserta ${SEED_MAPEL.length} mata pelajaran sudah disiapkan. Klik tombol di bawah untuk memasukkannya ke Mata Pelajaran &amp; Jadwal Mengajar.</p>
      <button class="btn btn-tint" style="background:${MENU_COLORS.jadwal};color:#fff;" ${jadwalStatus.done ? 'disabled' : ''} onclick="window.importJadwalX1()">
        ${icon('upload',14)} ${jadwalStatus.done ? 'Data Sudah Diimpor' : `Impor Sekarang (${jadwalStatus.mapelNew} mapel, ${jadwalStatus.jadwalNew} sesi)`}
      </button>
    </div>

    <div class="card card-pad" style="margin-bottom:18px;">
      <div class="section-head"><h3>Impor Jadwal Mengajar (Kelas XI)</h3>${jadwalXIStatus.done ? '<span class="badge badge-success">Sudah Terimpor</span>' : '<span class="badge badge-warn">Belum Lengkap</span>'}</div>
      <p style="font-size:12.5px;color:var(--muted);margin-top:0;">Jadwal pelajaran semester genap T.P. 2025/2026 untuk <strong>8 kelas (XI-1 s/d XI-8)</strong> — Senin–Jumat, ${SEED_JADWAL_XI.length} sesi mengajar — beserta ${SEED_MAPEL_XI.length} mata pelajaran baru sudah disiapkan. Klik tombol di bawah untuk memasukkannya.</p>
      <button class="btn btn-tint" style="background:${MENU_COLORS.jadwal};color:#fff;" ${jadwalXIStatus.done ? 'disabled' : ''} onclick="window.importJadwalXI()">
        ${icon('upload',14)} ${jadwalXIStatus.done ? 'Data Sudah Diimpor' : `Impor Sekarang (${jadwalXIStatus.mapelNew} mapel, ${jadwalXIStatus.jadwalNew} sesi)`}
      </button>
    </div>

    <div class="card card-pad" style="margin-bottom:18px;">
      <div class="section-head"><h3>Impor Jadwal Mengajar (Kelas XII)</h3>${jadwalXIIStatus.done ? '<span class="badge badge-success">Sudah Terimpor</span>' : '<span class="badge badge-warn">Belum Lengkap</span>'}</div>
      <p style="font-size:12.5px;color:var(--muted);margin-top:0;">Jadwal pelajaran semester genap T.P. 2026/2027 untuk <strong>7 kelas (XII-1 s/d XII-7)</strong> — Senin–Jumat, ${SEED_JADWAL_XII.length} sesi mengajar — beserta ${SEED_MAPEL_XII.length} mata pelajaran pilihan baru sudah disiapkan. Klik tombol di bawah untuk memasukkannya.</p>
      <button class="btn btn-tint" style="background:${MENU_COLORS.jadwal};color:#fff;" ${jadwalXIIStatus.done ? 'disabled' : ''} onclick="window.importJadwalXII()">
        ${icon('upload',14)} ${jadwalXIIStatus.done ? 'Data Sudah Diimpor' : `Impor Sekarang (${jadwalXIIStatus.mapelNew} mapel, ${jadwalXIIStatus.jadwalNew} sesi)`}
      </button>
    </div>

    <div class="card card-pad">
      <div class="section-head"><h3>Manajemen Data</h3></div>
      <p style="font-size:12.5px;color:var(--muted);margin-top:0;">Data aplikasi ini tersimpan bersama (shared) sehingga dapat diakses oleh semua guru dan wali kelas yang membuka aplikasi ini. Gunakan fitur di bawah untuk mencadangkan atau memulihkan data.</p>
      <div style="display:flex;flex-direction:column;gap:10px;">
        <button class="btn btn-outline" onclick="window.exportBackup()">${icon('download',14)} Unduh Cadangan Data (JSON)</button>
        <label class="btn btn-outline" style="cursor:pointer;text-align:center;">
          ${icon('upload',14)} Impor Cadangan Data
          <input type="file" accept="application/json" style="display:none;" onchange="window.importBackup(this.files[0])">
        </label>
        <div class="divider"></div>
        <div style="font-size:12.5px;color:var(--muted);">Ringkasan data saat ini:</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          <span class="badge badge-muted">${state.kelas.length} Kelas</span>
          <span class="badge badge-muted">${state.siswa.length} Siswa</span>
          <span class="badge badge-muted">${state.mapel.length} Mapel</span>
          <span class="badge badge-muted">${state.jadwal.length} Jadwal</span>
          <span class="badge badge-muted">${state.absensi.length} Rekaman Absensi</span>
          <span class="badge badge-muted">${state.nilai.length} Rekaman Nilai</span>
          <span class="badge badge-muted">${state.jurnal.length} Jurnal</span>
          <span class="badge badge-muted">${state.catatan.length} Catatan</span>
        </div>
        <div class="divider"></div>
        <button class="btn btn-danger-ghost" onclick="window.resetAllData()">${icon('trash',14)} Hapus Semua Data</button>
      </div>
    </div>
    </div>
  </div>
  `;
}

window.saveSettings = async function() {
  state.settings.namaSekolah = document.getElementById("setNama").value || DEFAULT_SETTINGS.namaSekolah;
  state.settings.npsn = document.getElementById("setNpsn").value;
  state.settings.alamat = document.getElementById("setAlamat").value;
  state.settings.kepalaSekolah = document.getElementById("setKepsek").value;
  state.settings.tahunAjaran = document.getElementById("setTahun").value;
  state.settings.semester = document.getElementById("setSemester").value;
  await saveModule("settings");
  toast("Pengaturan berhasil disimpan");
  window.renderApp();
};

window.importSeedData = async function() {
  const st = seedImportStatus();
  if (st.done) { toast("Data siswa & kelas sudah lengkap terimpor"); return; }
  confirmDelete(`Impor ${st.kelasNew} kelas dan ${st.siswaNew} siswa dari data Dapodik yang diunggah? Data yang sudah ada tidak akan diduplikasi.`, async () => {
    const kelasIds = new Set(state.kelas.map(k => k.id));
    const siswaIds = new Set(state.siswa.map(s => s.id));
    for (const k of SEED_DATA.kelas) { if (!kelasIds.has(k.id)) state.kelas.push({ ...k }); }
    for (const s of SEED_DATA.siswa) { if (!siswaIds.has(s.id)) state.siswa.push({ ...s }); }
    await saveModule("kelas");
    await saveModule("siswa");
    toast(`Berhasil impor ${st.kelasNew} kelas & ${st.siswaNew} siswa`);
    window.renderApp();
  });
};

window.importWaliKelas = async function() {
  const st = waliKelasImportStatus();
  if (st.done) { toast("Data wali kelas sudah sesuai & lengkap"); return; }
  confirmDelete(`Terapkan data wali kelas untuk ${st.pending} kelas sesuai SK Pembagian Tugas Guru T.P. 2025/2026? Wali kelas yang sudah tercatat akan diperbarui.`, async () => {
    let updated = 0;
    for (const kid in SEED_WALI_KELAS) {
      const k = state.kelas.find(x => x.id === kid);
      const w = SEED_WALI_KELAS[kid];
      if (k) {
        k.waliKelas = w.nama;
        k.nipWaliKelas = w.nip || "";
        updated++;
      }
    }
    await saveModule("kelas");
    toast(`Berhasil memperbarui wali kelas untuk ${updated} kelas`);
    window.renderApp();
  });
};

window.importJadwalXLainnya = async function() {
  const st = jadwalXLainnyaImportStatus();
  if (st.done) { toast("Jadwal mengajar kelas X-2 s/d X-10 sudah lengkap terimpor"); return; }
  confirmDelete(`Impor ${st.jadwalNew} jadwal mengajar untuk kelas X-2 s/d X-10 sesuai jadwal yang diunggah?`, async () => {
    const xKelasIds = new Set(["k-x-2", "k-x-3", "k-x-4", "k-x-5", "k-x-6", "k-x-7", "k-x-8", "k-x-9", "k-x-10"]);
    const existingKeys = new Set(state.jadwal.filter(j => xKelasIds.has(j.kelasId)).map(j => `${j.kelasId}|${j.hari}|${j.jamMulai}`));
    let added = 0;
    for (const j of SEED_JADWAL_X_LAINNYA) {
      const key = `${j.kelasId}|${j.hari}|${j.jamMulai}`;
      if (existingKeys.has(key)) continue;
      state.jadwal.push({ id: uid(), hari: j.hari, jamMulai: j.jamMulai, jamSelesai: j.jamSelesai, kelasId: j.kelasId, mapelId: j.mapelId, guru: j.guru });
      added++;
    }
    await saveModule("jadwal");
    toast(`Berhasil impor jadwal mengajar kelas X-2 s/d X-10 (${added} sesi)`);
    window.renderApp();
  });
};

window.importJadwalX1 = async function() {
  const st = jadwalX1ImportStatus();
  if (st.done) { toast("Jadwal mengajar kelas X 1 sudah lengkap terimpor"); return; }
  confirmDelete(`Impor ${st.mapelNew} mata pelajaran baru dan ${st.jadwalNew} jadwal mengajar untuk kelas X 1 sesuai jadwal yang diunggah?`, async () => {
    const mapelKodes = new Set(state.mapel.map(m => m.kode));
    for (const m of SEED_MAPEL) { if (!mapelKodes.has(m.kode)) state.mapel.push({ ...m }); }
    await saveModule("mapel");

    const existingKeys = new Set(state.jadwal.filter(j => j.kelasId === "k-x-1").map(j => `${j.hari}|${j.jamMulai}`));
    let added = 0;
    for (const j of SEED_JADWAL_X1) {
      const key = `${j.hari}|${j.jamMulai}`;
      if (existingKeys.has(key)) continue;
      const mapel = state.mapel.find(m => m.kode === j.mapelKode);
      state.jadwal.push({
        id: uid(),
        hari: j.hari,
        jamMulai: j.jamMulai,
        jamSelesai: j.jamSelesai,
        kelasId: "k-x-1",
        mapelId: mapel ? mapel.id : "",
        guru: j.guru
      });
      added++;
    }
    await saveModule("jadwal");
    toast(`Berhasil impor jadwal mengajar kelas X 1 (${added} sesi)`);
    window.renderApp();
  });
};

window.importJadwalXI = async function() {
  const st = jadwalXIImportStatus();
  if (st.done) { toast("Jadwal mengajar kelas XI sudah lengkap terimpor"); return; }
  confirmDelete(`Impor ${st.mapelNew} mata pelajaran baru dan ${st.jadwalNew} jadwal mengajar untuk kelas XI-1 s/d XI-8 sesuai jadwal yang diunggah?`, async () => {
    const mapelIds = new Set(state.mapel.map(m => m.id));
    for (const m of SEED_MAPEL_XI) { if (!mapelIds.has(m.id)) state.mapel.push({ ...m }); }
    await saveModule("mapel");

    const xiKelasIds = new Set(["k-xi-1", "k-xi-2", "k-xi-3", "k-xi-4", "k-xi-5", "k-xi-6", "k-xi-7", "k-xi-8"]);
    const existingKeys = new Set(state.jadwal.filter(j => xiKelasIds.has(j.kelasId)).map(j => `${j.kelasId}|${j.hari}|${j.jamMulai}`));
    let added = 0;
    for (const j of SEED_JADWAL_XI) {
      const key = `${j.kelasId}|${j.hari}|${j.jamMulai}`;
      if (existingKeys.has(key)) continue;
      state.jadwal.push({ id: uid(), hari: j.hari, jamMulai: j.jamMulai, jamSelesai: j.jamSelesai, kelasId: j.kelasId, mapelId: j.mapelId, guru: j.guru });
      added++;
    }
    await saveModule("jadwal");
    toast(`Berhasil impor jadwal mengajar kelas XI (${added} sesi)`);
    window.renderApp();
  });
};

window.importJadwalXII = async function() {
  const st = jadwalXIIImportStatus();
  if (st.done) { toast("Jadwal mengajar kelas XII sudah lengkap terimpor"); return; }
  confirmDelete(`Impor ${st.mapelNew} mata pelajaran baru dan ${st.jadwalNew} jadwal mengajar untuk kelas XII-1 s/d XII-7 sesuai jadwal yang diunggah?`, async () => {
    const mapelIds = new Set(state.mapel.map(m => m.id));
    for (const m of SEED_MAPEL_XII) { if (!mapelIds.has(m.id)) state.mapel.push({ ...m }); }
    await saveModule("mapel");

    const xiiKelasIds = new Set(["k-xii-1", "k-xii-2", "k-xii-3", "k-xii-4", "k-xii-5", "k-xii-6", "k-xii-7"]);
    const existingKeys = new Set(state.jadwal.filter(j => xiiKelasIds.has(j.kelasId)).map(j => `${j.kelasId}|${j.hari}|${j.jamMulai}`));
    let added = 0;
    for (const j of SEED_JADWAL_XII) {
      const key = `${j.kelasId}|${j.hari}|${j.jamMulai}`;
      if (existingKeys.has(key)) continue;
      state.jadwal.push({ id: uid(), hari: j.hari, jamMulai: j.jamMulai, jamSelesai: j.jamSelesai, kelasId: j.kelasId, mapelId: j.mapelId, guru: j.guru });
      added++;
    }
    await saveModule("jadwal");
    toast(`Berhasil impor jadwal mengajar kelas XII (${added} sesi)`);
    window.renderApp();
  });
};

window.exportBackup = function() {
  const backup = { settings: state.settings };
  for (const k of MODULE_KEYS) backup[k] = state[k];
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `backup-siakad-sman1-sbt-${todayISO()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  toast("Cadangan data diunduh");
};

window.importBackup = function(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const data = JSON.parse(e.target.result);
      confirmDelete("Mengimpor cadangan akan menimpa seluruh data saat ini. Lanjutkan?", async () => {
        if (data.settings) state.settings = { ...DEFAULT_SETTINGS, ...data.settings };
        for (const k of MODULE_KEYS) {
          state[k] = Array.isArray(data[k]) ? data[k] : [];
        }
        await saveModule("settings");
        for (const k of MODULE_KEYS) await saveModule(k);
        toast("Data berhasil dipulihkan dari cadangan");
        window.renderApp();
      });
    } catch (err) {
      toast("File cadangan tidak valid", true);
    }
  };
  reader.readAsText(file);
};

window.resetAllData = function() {
  confirmDelete("Semua data (kelas, siswa, absensi, nilai, jurnal, catatan) akan dihapus permanen. Lanjutkan?", async () => {
    for (const k of MODULE_KEYS) {
      state[k] = [];
      await saveModule(k);
    }
    toast("Seluruh data telah dihapus");
    window.renderApp();
  });
};
