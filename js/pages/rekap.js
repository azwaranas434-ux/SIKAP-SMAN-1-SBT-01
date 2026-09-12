// js/pages/rekap.js
import { state } from '../state.js';
import { todayISO, esc, fmtDate, icon } from '../utils.js';
import { siswaByKelas, kelasLabel, mapelLabel } from '../helpers.js';
import { MENU_COLORS } from '../nav.js';

const LOGO_DATA_URI = window.LOGO_DATA_URI || "";

let rekapSel = { kelasId: "", dari: "", sampai: "", tab: "absensi", mapelId: "" };

export function pageRekap() {
  if (!rekapSel.dari) {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    rekapSel.dari = d.toISOString().slice(0, 10);
    rekapSel.sampai = todayISO();
  }
  return `
  <div class="card card-pad no-print" style="margin-bottom:18px;">
    <div class="section-head"><h3>Filter Laporan</h3></div>
    <div class="field-row" style="grid-template-columns:1fr 1fr 1fr 1fr;">
      <div class="field" style="margin-bottom:0;">
        <label>Kelas</label>
        <select id="rekKelas" onchange="window.onRekapFilterChange()">
          <option value="">— Pilih Kelas —</option>
          ${state.kelas.map(k => `<option value="${k.id}" ${rekapSel.kelasId === k.id ? 'selected' : ''}>${esc(k.nama)}</option>`).join("")}
        </select>
      </div>
      <div class="field" style="margin-bottom:0;">
        <label style="display:flex;align-items:center;gap:6px;">${icon('mapel',14)} Mata Pelajaran</label>
        <select id="rekMapel" onchange="window.onRekapFilterChange()">
          <option value="">Semua Mata Pelajaran</option>
          ${state.mapel.map(m => `<option value="${m.id}" ${rekapSel.mapelId === m.id ? 'selected' : ''}>${esc(m.nama)}</option>`).join("")}
        </select>
      </div>
      <div class="field" style="margin-bottom:0;">
        <label>Dari Tanggal</label>
        <input type="date" id="rekDari" value="${esc(rekapSel.dari)}" onchange="window.onRekapFilterChange()">
      </div>
      <div class="field" style="margin-bottom:0;">
        <label>Sampai Tanggal</label>
        <input type="date" id="rekSampai" value="${esc(rekapSel.sampai)}" onchange="window.onRekapFilterChange()">
      </div>
    </div>
    <div class="tabs" style="margin-top:14px;margin-bottom:0;">
      <button class="tab-btn ${rekapSel.tab === 'absensi' ? 'active' : ''}" onclick="window.setRekapTab('absensi')">Rekap Absensi</button>
      <button class="tab-btn ${rekapSel.tab === 'nilai' ? 'active' : ''}" onclick="window.setRekapTab('nilai')">Rekap Nilai</button>
      <button class="tab-btn ${rekapSel.tab === 'jurnal' ? 'active' : ''}" onclick="window.setRekapTab('jurnal')">Rekap Jurnal</button>
    </div>
  </div>
  <div id="rekapOutput"></div>
  `;
}

window.setRekapTab = function(tab) {
  rekapSel.tab = tab;
  window.renderApp();
};

window.onRekapFilterChange = function() {
  rekapSel.kelasId = document.getElementById("rekKelas").value;
  rekapSel.mapelId = document.getElementById("rekMapel").value;
  rekapSel.dari = document.getElementById("rekDari").value;
  rekapSel.sampai = document.getElementById("rekSampai").value;
  renderRekapOutput();
};

function printHeaderHtml(judul) {
  return `
  <div class="print-only" style="margin-bottom:18px;text-align:center;border-bottom:2px solid #1D2B29;padding-bottom:12px;">
    <img src="${LOGO_DATA_URI}" alt="Logo Sekolah" style="width:64px;height:64px;object-fit:cover;border-radius:50%;margin-bottom:8px;">
    <div style="font-weight:700;font-size:16px;">${esc(state.settings.namaSekolah)}</div>
    <div style="font-size:12px;">${esc(state.settings.alamat)}</div>
    <div style="font-weight:600;font-size:14px;margin-top:8px;text-decoration:underline;">${esc(judul)}</div>
  </div>`;
}

function renderRekapOutput() {
  const wrap = document.getElementById("rekapOutput");
  if (!wrap) return;
  if (!rekapSel.kelasId) {
    wrap.innerHTML = `<div class="card card-pad"><div class="empty-state">${icon('rekap',40)}<div class="et">Pilih kelas terlebih dahulu</div><div>Pilih kelas dan rentang tanggal untuk menampilkan rekap.</div></div></div>`;
    return;
  }
  const list = siswaByKelas(rekapSel.kelasId);
  const inRange = (t) => t >= rekapSel.dari && t <= rekapSel.sampai;

  if (rekapSel.tab === "absensi") {
    const recs = state.absensi.filter(a => a.kelasId === rekapSel.kelasId && inRange(a.tanggal) && (!rekapSel.mapelId || a.mapelId === rekapSel.mapelId));
    const rows = list.map(s => {
      const rs = recs.filter(r => r.siswaId === s.id);
      const hadir = rs.filter(r => r.status === "Hadir").length;
      const izin = rs.filter(r => r.status === "Izin").length;
      const sakit = rs.filter(r => r.status === "Sakit").length;
      const alpa = rs.filter(r => r.status === "Alpa").length;
      const total = rs.length;
      const persen = total ? Math.round((hadir / total) * 100) : 0;
      return { s, hadir, izin, sakit, alpa, total, persen };
    });
    wrap.innerHTML = `
      <div class="card card-pad">
        ${printHeaderHtml("Rekap Absensi Siswa — " + kelasLabel(rekapSel.kelasId) + (rekapSel.mapelId ? (" — " + mapelLabel(rekapSel.mapelId)) : "") + " (" + fmtDate(rekapSel.dari) + " s/d " + fmtDate(rekapSel.sampai) + ")")}
        <div class="section-head no-print"><h3>Rekap Absensi — ${esc(kelasLabel(rekapSel.kelasId))}</h3>
          <button class="btn btn-tint btn-sm" style="background:${MENU_COLORS.rekap};color:#fff;" onclick="window.print()">${icon('print',14)} Cetak Laporan</button>
        </div>
        <div class="table-wrap"><table>
          <thead><tr><th>No</th><th>NIS</th><th>Nama Siswa</th><th>Hadir</th><th>Izin</th><th>Sakit</th><th>Alpa</th><th>% Kehadiran</th></tr></thead>
          <tbody>
            ${rows.map((r, i) => `<tr>
              <td class="cell-mono">${i + 1}</td>
              <td class="cell-mono">${esc(r.s.nis)}</td>
              <td class="cell-strong">${esc(r.s.nama)}</td>
              <td>${r.hadir}</td><td>${r.izin}</td><td>${r.sakit}</td><td>${r.alpa}</td>
              <td>${r.total ? `<span class="badge ${r.persen >= 90 ? 'badge-success' : r.persen >= 75 ? 'badge-warn' : 'badge-danger'}">${r.persen}%</span>` : '<span class="badge badge-muted">–</span>'}</td>
            </tr>`).join("")}
          </tbody>
        </table></div>
      </div>`;
  } else if (rekapSel.tab === "nilai") {
    const recs = state.nilai.filter(n => n.kelasId === rekapSel.kelasId && inRange(n.tanggal) && (!rekapSel.mapelId || n.mapelId === rekapSel.mapelId));
    const rows = list.map(s => {
      const rs = recs.filter(n => n.siswaId === s.id);
      const avg = rs.length ? (rs.reduce((a, b) => a + Number(b.nilai), 0) / rs.length).toFixed(1) : null;
      return { s, count: rs.length, avg };
    });
    wrap.innerHTML = `
      <div class="card card-pad">
        ${printHeaderHtml("Rekap Nilai Siswa — " + kelasLabel(rekapSel.kelasId) + (rekapSel.mapelId ? (" — " + mapelLabel(rekapSel.mapelId)) : "") + " (" + fmtDate(rekapSel.dari) + " s/d " + fmtDate(rekapSel.sampai) + ")")}
        <div class="section-head no-print"><h3>Rekap Nilai — ${esc(kelasLabel(rekapSel.kelasId))}</h3>
          <button class="btn btn-tint btn-sm" style="background:${MENU_COLORS.rekap};color:#fff;" onclick="window.print()">${icon('print',14)} Cetak Laporan</button>
        </div>
        <div class="table-wrap"><table>
          <thead><tr><th>No</th><th>NIS</th><th>Nama Siswa</th><th>Jumlah Penilaian</th><th>Rata-rata Nilai</th></tr></thead>
          <tbody>
            ${rows.map((r, i) => `<tr>
              <td class="cell-mono">${i + 1}</td>
              <td class="cell-mono">${esc(r.s.nis)}</td>
              <td class="cell-strong">${esc(r.s.nama)}</td>
              <td>${r.count}</td>
              <td>${r.avg !== null ? `<span class="badge ${r.avg >= 75 ? 'badge-success' : 'badge-danger'}">${r.avg}</span>` : '<span class="badge badge-muted">–</span>'}</td>
            </tr>`).join("")}
          </tbody>
        </table></div>
      </div>`;
  } else {
    const recs = state.jurnal.filter(j => j.kelasId === rekapSel.kelasId && inRange(j.tanggal) && (!rekapSel.mapelId || j.mapelId === rekapSel.mapelId)).sort((a, b) => a.tanggal.localeCompare(b.tanggal));
    wrap.innerHTML = `
      <div class="card card-pad">
        ${printHeaderHtml("Rekap Jurnal Mengajar — " + kelasLabel(rekapSel.kelasId) + (rekapSel.mapelId ? (" — " + mapelLabel(rekapSel.mapelId)) : "") + " (" + fmtDate(rekapSel.dari) + " s/d " + fmtDate(rekapSel.sampai) + ")")}
        <div class="section-head no-print"><h3>Rekap Jurnal — ${esc(kelasLabel(rekapSel.kelasId))}</h3>
          <button class="btn btn-tint btn-sm" style="background:${MENU_COLORS.rekap};color:#fff;" onclick="window.print()">${icon('print',14)} Cetak Laporan</button>
        </div>
        ${recs.length ? `<div class="table-wrap"><table>
          <thead><tr><th>Tanggal</th><th>Jam Ke</th><th>Mapel</th><th>Capaian Pembelajaran</th><th>Tujuan Pembelajaran</th><th>Materi</th><th>Guru</th></tr></thead>
          <tbody>${recs.map(j => `<tr><td class="cell-mono">${fmtDate(j.tanggal)}</td><td>${esc(j.jamKe || '-')}</td><td>${esc(mapelLabel(j.mapelId))}</td><td>${esc(j.capaianPembelajaran || '-')}</td><td>${esc(j.tujuanPembelajaran || '-')}</td><td>${esc(j.materi)}</td><td>${esc(j.guru)}</td></tr>`).join("")}</tbody>
        </table></div>` : `<div class="empty-state">${icon('jurnal',40)}<div class="et">Tidak ada jurnal pada periode ini</div></div>`}
      </div>`;
  }
}

export function mountRekap() { renderRekapOutput(); }
