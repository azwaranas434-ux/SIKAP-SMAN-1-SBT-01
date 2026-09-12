// js/pages/dashboard.js
import { state } from '../state.js';
import { todayISO, esc, fmtDate, icon } from '../utils.js';
import { siswaLabel, kelasLabel, mapelLabel } from '../helpers.js';

let attendanceChart = null;

export function pageDashboard() {
  const totalKelas = state.kelas.length;
  const totalSiswa = state.siswa.filter(s => s.status !== "Pindah" && s.status !== "Lulus").length;
  const totalMapel = state.mapel.length;
  const today = todayISO();
  const absensiHariIni = state.absensi.filter(a => a.tanggal === today);
  const hadirHariIni = absensiHariIni.filter(a => a.status === "Hadir").length;
  const persenHadir = absensiHariIni.length ? Math.round((hadirHariIni / absensiHariIni.length) * 100) : null;

  const jurnalTerbaru = [...state.jurnal].sort((a, b) => b.tanggal.localeCompare(a.tanggal)).slice(0, 5);
  const catatanTerbaru = [...state.catatan].sort((a, b) => b.tanggal.localeCompare(a.tanggal)).slice(0, 4);

  return `
  <div class="stat-grid">
    <div class="stat-card">
      <div class="stat-icon" style="background:var(--accent-soft-2);color:var(--accent);">${icon('kelas',17)}</div>
      <div class="stat-label">Total Kelas</div>
      <div class="stat-value">${totalKelas}</div>
      <div class="stat-foot">Rombongan belajar aktif</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon" style="background:var(--success-soft);color:var(--success);">${icon('users',17)}</div>
      <div class="stat-label">Total Siswa</div>
      <div class="stat-value">${totalSiswa}</div>
      <div class="stat-foot">Siswa aktif terdaftar</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon" style="background:var(--warn-soft);color:var(--warn);">${icon('mapel',17)}</div>
      <div class="stat-label">Mata Pelajaran</div>
      <div class="stat-value">${totalMapel}</div>
      <div class="stat-foot">Terdaftar di kurikulum</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon" style="background:${persenHadir === null ? 'var(--surface-2)' : 'var(--success-soft)'};color:${persenHadir === null ? 'var(--muted)' : 'var(--success)'};">${icon('absensi',17)}</div>
      <div class="stat-label">Kehadiran Hari Ini</div>
      <div class="stat-value">${persenHadir === null ? '—' : persenHadir + '%'}</div>
      <div class="stat-foot">${absensiHariIni.length ? hadirHariIni + ' dari ' + absensiHariIni.length + ' tercatat hadir' : 'Belum ada absensi hari ini'}</div>
    </div>
  </div>

  <div class="grid-2">
    <div class="card card-pad">
      <div class="section-head"><h3>Tren Kehadiran 7 Hari Terakhir</h3></div>
      <canvas id="attChart" height="230"></canvas>
    </div>
    <div class="card card-pad">
      <div class="section-head"><h3>Catatan Siswa Terbaru</h3><span class="badge badge-accent">${state.catatan.length} total</span></div>
      ${catatanTerbaru.length ? catatanTerbaru.map(c => `
        <div class="note-card">
          <div style="display:flex;justify-content:space-between;gap:8px;">
            <strong style="font-size:13px;">${esc(siswaLabel(c.siswaId))}</strong>
            <span class="badge ${c.jenis === 'Pelanggaran' ? 'badge-danger' : c.jenis === 'Prestasi' ? 'badge-success' : 'badge-muted'}">${esc(c.jenis)}</span>
          </div>
          <div style="font-size:12.5px;color:var(--ink);margin-top:5px;">${esc(c.catatan)}</div>
          <div class="note-meta">${fmtDate(c.tanggal)}</div>
        </div>
      `).join("") : `<div class="empty-state" style="padding:24px 0;">Belum ada catatan siswa</div>`}
    </div>
  </div>

  <div class="card card-pad" style="margin-top:18px;">
    <div class="section-head"><h3>Jurnal Mengajar Terbaru</h3><button class="btn btn-sm btn-outline" onclick="window.go('jurnal')">Lihat semua ${icon('chevRight',13)}</button></div>
    ${jurnalTerbaru.length ? `
    <div class="table-wrap"><table>
      <thead><tr><th>Tanggal</th><th>Kelas</th><th>Mapel</th><th>Materi</th><th>Guru</th></tr></thead>
      <tbody>
        ${jurnalTerbaru.map(j => `
          <tr>
            <td class="cell-mono">${fmtDate(j.tanggal)}</td>
            <td>${esc(kelasLabel(j.kelasId))}</td>
            <td>${esc(mapelLabel(j.mapelId))}</td>
            <td>${esc(j.materi)}</td>
            <td>${esc(j.guru)}</td>
          </tr>`).join("")}
      </tbody>
    </table></div>` : `<div class="empty-state">${icon('jurnal',40)}<div class="et">Belum ada jurnal mengajar</div><div>Mulai catat kegiatan pembelajaran harian Anda.</div></div>`}
  </div>
  `;
}

export function mountDashboard() {
  const ctx = document.getElementById("attChart");
  if (!ctx || typeof Chart === "undefined") return;
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  const data = days.map(d => {
    const recs = state.absensi.filter(a => a.tanggal === d);
    if (!recs.length) return null;
    return Math.round((recs.filter(r => r.status === "Hadir").length / recs.length) * 100);
  });
  if (attendanceChart) attendanceChart.destroy();
  attendanceChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: days.map(d => new Date(d + "T00:00:00").toLocaleDateString('id-ID', { weekday: 'short' })),
      datasets: [{
        label: '% Hadir',
        data,
        backgroundColor: '#C97A2B',
        borderRadius: 6,
        maxBarThickness: 36
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { min: 0, max: 100, ticks: { callback: v => v + '%' }, grid: { color: '#EFEBDF' } }, x: { grid: { display: false } } }
    }
  });
}
