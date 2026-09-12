// js/pages/absensi.js
import { state, saveModule } from '../state.js';
import { todayISO, esc, icon, hexToRgba } from '../utils.js';
import { siswaByKelas, kelasLabel, initials } from '../helpers.js';
import { toast } from '../ui.js';
import { MENU_COLORS } from '../nav.js';

let absSel = { tanggal: todayISO(), kelasId: "", mapelId: "" };
let absDraft = {};

export function pageAbsensi() {
  return `
  <div class="card card-pad" style="margin-bottom:18px;">
    <div class="section-head"><h3>Pilih Kelas &amp; Mata Pelajaran</h3></div>
    <div class="field-row" style="grid-template-columns:1fr 1fr 1fr;">
      <div class="field" style="margin-bottom:0;">
        <label>Tanggal</label>
        <input type="date" id="absTanggal" value="${esc(absSel.tanggal)}" onchange="window.onAbsFilterChange()">
      </div>
      <div class="field" style="margin-bottom:0;">
        <label>Kelas</label>
        <select id="absKelas" onchange="window.onAbsFilterChange()">
          <option value="">— Pilih Kelas —</option>
          ${state.kelas.map(k => `<option value="${k.id}" ${absSel.kelasId === k.id ? 'selected' : ''}>${esc(k.nama)}</option>`).join("")}
        </select>
      </div>
      <div class="field" style="margin-bottom:0;">
        <label>Mata Pelajaran</label>
        <select id="absMapel" onchange="window.onAbsFilterChange()">
          <option value="">— Pilih Mapel —</option>
          ${state.mapel.map(m => `<option value="${m.id}" ${absSel.mapelId === m.id ? 'selected' : ''}>${esc(m.nama)}</option>`).join("")}
        </select>
      </div>
    </div>
  </div>
  <div id="absListWrap"></div>
  `;
}

function loadAbsDraft() {
  absDraft = {};
  const list = siswaByKelas(absSel.kelasId);
  for (const s of list) {
    const existing = state.absensi.find(a => a.tanggal === absSel.tanggal && a.kelasId === absSel.kelasId && a.mapelId === absSel.mapelId && a.siswaId === s.id);
    absDraft[s.id] = { status: existing ? existing.status : "Hadir", keterangan: existing ? existing.keterangan : "" };
  }
}

function renderAbsList() {
  const wrap = document.getElementById("absListWrap");
  if (!wrap) return;
  if (!absSel.kelasId || !absSel.mapelId) {
    wrap.innerHTML = `<div class="card card-pad"><div class="empty-state">${icon('absensi',40)}<div class="et">Pilih kelas dan mata pelajaran</div><div>Data siswa akan muncul setelah kelas &amp; mapel dipilih.</div></div></div>`;
    return;
  }
  const list = siswaByKelas(absSel.kelasId);
  if (!list.length) {
    wrap.innerHTML = `<div class="card card-pad"><div class="empty-state">${icon('users',40)}<div class="et">Belum ada siswa di kelas ini</div></div></div>`;
    return;
  }
  const countBy = st => Object.values(absDraft).filter(d => d.status === st).length;
  wrap.innerHTML = `
    <div class="card card-pad">
      <div class="section-head">
        <h3>Daftar Siswa — ${esc(kelasLabel(absSel.kelasId))}</h3>
        <div class="filter-row">
          <span class="badge badge-success">Hadir: ${countBy('Hadir')}</span>
          <span class="badge badge-warn">Izin: ${countBy('Izin')}</span>
          <span class="badge" style="background:#ECE7F5;color:#7A5FB0;">Sakit: ${countBy('Sakit')}</span>
          <span class="badge badge-danger">Alpa: ${countBy('Alpa')}</span>
        </div>
      </div>
      <div style="display:flex;gap:8px;margin-bottom:12px;">
        <button class="btn btn-sm btn-tint" style="background:${hexToRgba(MENU_COLORS.absensi,0.12)};color:${MENU_COLORS.absensi};border:1px solid ${hexToRgba(MENU_COLORS.absensi,0.3)};" onclick="window.setAllAbs('Hadir')">Tandai Semua Hadir</button>
      </div>
      <div class="att-list">
        ${list.map((s, i) => `
          <div class="att-row">
            <span class="att-num">${i + 1}</span>
            <div class="avatar-init">${initials(s.nama)}</div>
            <div style="flex:1;">
              <div class="att-name">${esc(s.nama)}</div>
              <div class="att-nis">NIS ${esc(s.nis)}</div>
            </div>
            <div class="seg">
              <button class="on-hadir ${absDraft[s.id].status === 'Hadir' ? 'active' : ''}" onclick="window.setAbsStatus('${s.id}','Hadir')">Hadir</button>
              <button class="on-izin ${absDraft[s.id].status === 'Izin' ? 'active' : ''}" onclick="window.setAbsStatus('${s.id}','Izin')">Izin</button>
              <button class="on-sakit ${absDraft[s.id].status === 'Sakit' ? 'active' : ''}" onclick="window.setAbsStatus('${s.id}','Sakit')">Sakit</button>
              <button class="on-alpa ${absDraft[s.id].status === 'Alpa' ? 'active' : ''}" onclick="window.setAbsStatus('${s.id}','Alpa')">Alpa</button>
            </div>
          </div>
        `).join("")}
      </div>
      <div style="display:flex;justify-content:flex-end;margin-top:16px;">
        <button class="btn btn-tint" style="background:${MENU_COLORS.absensi};color:#fff;" onclick="window.saveAbsensi()">${icon('check',14)} Simpan Absensi</button>
      </div>
    </div>
  `;
}

window.setAbsStatus = function(siswaId, status) {
  absDraft[siswaId].status = status;
  renderAbsList();
};

window.setAllAbs = function(status) {
  for (const k in absDraft) absDraft[k].status = status;
  renderAbsList();
};

window.onAbsFilterChange = function() {
  absSel.tanggal = document.getElementById("absTanggal").value || todayISO();
  absSel.kelasId = document.getElementById("absKelas").value;
  absSel.mapelId = document.getElementById("absMapel").value;
  if (absSel.kelasId && absSel.mapelId) loadAbsDraft();
  renderAbsList();
};

window.saveAbsensi = async function() {
  state.absensi = state.absensi.filter(a => !(a.tanggal === absSel.tanggal && a.kelasId === absSel.kelasId && a.mapelId === absSel.mapelId));
  for (const siswaId in absDraft) {
    state.absensi.push({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      tanggal: absSel.tanggal,
      kelasId: absSel.kelasId,
      mapelId: absSel.mapelId,
      siswaId,
      status: absDraft[siswaId].status,
      keterangan: absDraft[siswaId].keterangan || ""
    });
  }
  await saveModule("absensi");
  toast("Absensi berhasil disimpan");
};

export function mountAbsensi() { renderAbsList(); }
