// js/pages/jadwal.js
import { state } from '../state.js';
import { esc } from '../utils.js';
import { kelasLabel, mapelLabel } from '../helpers.js';
import { renderCrudPage } from '../ui.js';

export const HARI_LIST = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export function sortedKelasList() {
  const tOrder = { X: 0, XI: 1, XII: 2 };
  const parseNum = n => { const m = String(n).match(/(\d+)\s*$/); return m ? parseInt(m[1], 10) : 999; };
  return [...state.kelas].sort((a, b) => (tOrder[a.tingkat] ?? 9) - (tOrder[b.tingkat] ?? 9) || parseNum(a.nama) - parseNum(b.nama) || a.nama.localeCompare(b.nama));
}

let jadwalFilter = { hari: "", kelasId: "" };

window.setJadwalFilterHari = function(h) {
  jadwalFilter.hari = h;
  document.getElementById("content").innerHTML = renderCrudPage(CFG_JADWAL);
};

window.setJadwalFilterKelas = function(k) {
  jadwalFilter.kelasId = k;
  document.getElementById("content").innerHTML = renderCrudPage(CFG_JADWAL);
};

export const CFG_JADWAL = {
  key: "jadwal", title: "Jadwal Mengajar", icon: "jadwal",
  searchFields: ["guru"],
  sort: rows => [...rows].sort((a, b) => HARI_LIST.indexOf(a.hari) - HARI_LIST.indexOf(b.hari) || (a.jamMulai || "").localeCompare(b.jamMulai || "")),
  applyExtraFilter: rows => rows.filter(r => (!jadwalFilter.hari || r.hari === jadwalFilter.hari) && (!jadwalFilter.kelasId || r.kelasId === jadwalFilter.kelasId)),
  extraFilterHtml: () => `
    <div style="margin-bottom:16px;display:flex;flex-direction:column;gap:10px;">
      <div>
        <div class="hint" style="margin:0 0 6px;font-weight:600;color:var(--ink);">Hari</div>
        <div class="pill-nav">
          <button class="${jadwalFilter.hari === '' ? 'active' : ''}" onclick="window.setJadwalFilterHari('')">Semua Hari</button>
          ${HARI_LIST.map(h => `<button class="${jadwalFilter.hari === h ? 'active' : ''}" onclick="window.setJadwalFilterHari('${h}')">${h}</button>`).join("")}
        </div>
      </div>
      <div>
        <div class="hint" style="margin:0 0 6px;font-weight:600;color:var(--ink);">Kelas</div>
        <div class="pill-nav">
          <button class="${jadwalFilter.kelasId === '' ? 'active' : ''}" onclick="window.setJadwalFilterKelas('')">Semua Kelas</button>
          ${sortedKelasList().map(k => `<button class="${jadwalFilter.kelasId === k.id ? 'active' : ''}" onclick="window.setJadwalFilterKelas('${k.id}')">${esc(k.nama)}</button>`).join("")}
        </div>
      </div>
    </div>
  `,
  fields: [
    { name: "hari", label: "Hari", type: "select", required: true, options: HARI_LIST.map(h => ({ value: h, label: h })) },
    { name: "jamMulai", label: "Jam Mulai", type: "time", required: true },
    { name: "jamSelesai", label: "Jam Selesai", type: "time", required: true },
    { name: "kelasId", label: "Kelas", type: "select", required: true, options: () => state.kelas.map(k => ({ value: k.id, label: k.nama })) },
    { name: "mapelId", label: "Mata Pelajaran", type: "select", required: true, options: () => state.mapel.map(m => ({ value: m.id, label: m.nama })) },
    { name: "guru", label: "Nama Guru", required: true },
  ],
  columns: [
    { label: "Hari", field: "hari", strong: true },
    { label: "Jam", render: r => `${r.jamMulai || '-'} – ${r.jamSelesai || '-'}`, mono: true },
    { label: "Kelas", render: r => kelasLabel(r.kelasId) },
    { label: "Mata Pelajaran", render: r => mapelLabel(r.mapelId) },
    { label: "Guru", field: "guru" },
  ]
};

export function pageJadwal() { return renderCrudPage(CFG_JADWAL); }
