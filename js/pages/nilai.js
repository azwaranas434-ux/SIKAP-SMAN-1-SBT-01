// js/pages/nilai.js
import { state, saveModule } from '../state.js';
import { todayISO, esc, icon } from '../utils.js';
import { siswaByKelas, kelasLabel, mapelLabel, findMapel } from '../helpers.js';
import { toast } from '../ui.js';
import { MENU_COLORS } from '../nav.js';

export const JENIS_NILAI = ["Tugas", "Ulangan Harian", "UTS", "UAS"];
let nilaiSel = { kelasId: "", mapelId: "", jenis: "Tugas", tanggal: todayISO() };
let nilaiDraft = {};

export function pageNilai() {
  return `
  <div class="card card-pad" style="margin-bottom:18px;">
    <div class="section-head"><h3>Pilih Kelas, Mapel &amp; Jenis Penilaian</h3></div>
    <div class="field-row" style="grid-template-columns:1fr 1fr 1fr 1fr;">
      <div class="field" style="margin-bottom:0;">
        <label>Kelas</label>
        <select id="nilKelas" onchange="window.onNilaiFilterChange()">
          <option value="">— Pilih Kelas —</option>
          ${state.kelas.map(k => `<option value="${k.id}" ${nilaiSel.kelasId === k.id ? 'selected' : ''}>${esc(k.nama)}</option>`).join("")}
        </select>
      </div>
      <div class="field" style="margin-bottom:0;">
        <label>Mata Pelajaran</label>
        <select id="nilMapel" onchange="window.onNilaiFilterChange()">
          <option value="">— Pilih Mapel —</option>
          ${state.mapel.map(m => `<option value="${m.id}" ${nilaiSel.mapelId === m.id ? 'selected' : ''}>${esc(m.nama)}</option>`).join("")}
        </select>
      </div>
      <div class="field" style="margin-bottom:0;">
        <label>Jenis Penilaian</label>
        <select id="nilJenis" onchange="window.onNilaiFilterChange()">
          ${JENIS_NILAI.map(j => `<option value="${j}" ${nilaiSel.jenis === j ? 'selected' : ''}>${j}</option>`).join("")}
        </select>
      </div>
      <div class="field" style="margin-bottom:0;">
        <label>Tanggal</label>
        <input type="date" id="nilTanggal" value="${esc(nilaiSel.tanggal)}" onchange="window.onNilaiFilterChange()">
      </div>
    </div>
  </div>
  <div id="nilListWrap"></div>
  `;
}

function loadNilaiDraft() {
  nilaiDraft = {};
  const list = siswaByKelas(nilaiSel.kelasId);
  const mapel = findMapel(nilaiSel.mapelId);
  for (const s of list) {
    const existing = state.nilai.find(n => n.tanggal === nilaiSel.tanggal && n.kelasId === nilaiSel.kelasId && n.mapelId === nilaiSel.mapelId && n.jenis === nilaiSel.jenis && n.siswaId === s.id);
    nilaiDraft[s.id] = existing ? existing.nilai : "";
  }
}

function renderNilaiList() {
  const wrap = document.getElementById("nilListWrap");
  if (!wrap) return;
  if (!nilaiSel.kelasId || !nilaiSel.mapelId) {
    wrap.innerHTML = `<div class="card card-pad"><div class="empty-state">${icon('nilai',40)}<div class="et">Pilih kelas dan mata pelajaran</div><div>Daftar siswa akan muncul setelah kelas &amp; mapel dipilih.</div></div></div>`;
    return;
  }
  const list = siswaByKelas(nilaiSel.kelasId);
  const mapel = findMapel(nilaiSel.mapelId);
  const kkm = mapel ? Number(mapel.kkm) || 75 : 75;
  if (!list.length) {
    wrap.innerHTML = `<div class="card card-pad"><div class="empty-state">${icon('users',40)}<div class="et">Belum ada siswa di kelas ini</div></div></div>`;
    return;
  }
  wrap.innerHTML = `
    <div class="card card-pad">
      <div class="section-head">
        <h3>Input Nilai — ${esc(kelasLabel(nilaiSel.kelasId))} · ${esc(mapelLabel(nilaiSel.mapelId))}</h3>
        <span class="badge badge-accent">KKM ${kkm}</span>
      </div>
      <div class="table-wrap"><table>
        <thead><tr><th style="width:36px;">No</th><th>Nama Siswa</th><th style="width:70px;">NIS</th><th style="width:140px;">Nilai</th><th>Keterangan</th></tr></thead>
        <tbody>
        ${list.map((s, i) => {
          const v = nilaiDraft[s.id];
          const below = v !== "" && Number(v) < kkm;
          return `<tr>
            <td class="cell-mono">${i + 1}</td>
            <td class="cell-strong">${esc(s.nama)}</td>
            <td class="cell-mono">${esc(s.nis)}</td>
            <td><input type="number" min="0" max="100" value="${esc(v)}" oninput="window.setNilaiVal('${s.id}', this.value)" style="${below ? 'border-color:var(--danger);' : ''}"></td>
            <td>${v !== "" ? (below ? '<span class="badge badge-danger">Di bawah KKM</span>' : '<span class="badge badge-success">Tuntas</span>') : '<span class="badge badge-muted">Belum diisi</span>'}</td>
          </tr>`;
        }).join("")}
        </tbody>
      </table></div>
      <div style="display:flex;justify-content:flex-end;margin-top:16px;">
        <button class="btn btn-tint" style="background:${MENU_COLORS.nilai};color:#fff;" onclick="window.saveNilai()">${icon('check',14)} Simpan Nilai</button>
      </div>
    </div>
  `;
}

window.setNilaiVal = function(siswaId, val) {
  nilaiDraft[siswaId] = val;
};

window.onNilaiFilterChange = function() {
  nilaiSel.kelasId = document.getElementById("nilKelas").value;
  nilaiSel.mapelId = document.getElementById("nilMapel").value;
  nilaiSel.jenis = document.getElementById("nilJenis").value;
  nilaiSel.tanggal = document.getElementById("nilTanggal").value || todayISO();
  if (nilaiSel.kelasId && nilaiSel.mapelId) loadNilaiDraft();
  renderNilaiList();
};

window.saveNilai = async function() {
  state.nilai = state.nilai.filter(n => !(n.tanggal === nilaiSel.tanggal && n.kelasId === nilaiSel.kelasId && n.mapelId === nilaiSel.mapelId && n.jenis === nilaiSel.jenis));
  for (const siswaId in nilaiDraft) {
    if (nilaiDraft[siswaId] === "" || nilaiDraft[siswaId] === null || nilaiDraft[siswaId] === undefined) continue;
    state.nilai.push({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      tanggal: nilaiSel.tanggal,
      kelasId: nilaiSel.kelasId,
      mapelId: nilaiSel.mapelId,
      jenis: nilaiSel.jenis,
      siswaId,
      nilai: Number(nilaiDraft[siswaId]),
      semester: state.settings.semester,
      tahunAjaran: state.settings.tahunAjaran
    });
  }
  await saveModule("nilai");
  toast("Nilai berhasil disimpan");
};

export function mountNilai() { renderNilaiList(); }
