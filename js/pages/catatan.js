// js/pages/catatan.js
import { state } from '../state.js';
import { todayISO, fmtDate, esc } from '../utils.js';
import { siswaLabel, kelasLabel, findSiswa } from '../helpers.js';
import { renderCrudPage } from '../ui.js';

const JENIS_CATATAN = ["Prestasi", "Pelanggaran", "Konseling", "Lainnya"];

export const CFG_CATATAN = {
  key: "catatan", title: "Catatan Siswa", icon: "catatan",
  searchFields: ["catatan", "guru"],
  sort: rows => [...rows].sort((a, b) => b.tanggal.localeCompare(a.tanggal)),
  wide: true,
  fields: [
    { name: "tanggal", label: "Tanggal", type: "date", required: true, default: todayISO() },
    { name: "siswaId", label: "Siswa", type: "select", required: true, options: () => state.siswa.map(s => ({ value: s.id, label: s.nama + " — " + kelasLabel(s.kelasId) })) },
    { name: "jenis", label: "Jenis Catatan", type: "select", required: true, options: JENIS_CATATAN.map(j => ({ value: j, label: j })) },
    { name: "catatan", label: "Isi Catatan", type: "textarea", required: true, rows: 3 },
    { name: "tindakLanjut", label: "Tindak Lanjut", type: "textarea", rows: 2 },
    { name: "guru", label: "Dicatat Oleh", required: true },
  ],
  columns: [
    { label: "Tanggal", render: r => fmtDate(r.tanggal), mono: true },
    { label: "Siswa", render: r => siswaLabel(r.siswaId), strong: true },
    { label: "Kelas", render: r => { const s = findSiswa(r.siswaId); return s ? kelasLabel(s.kelasId) : '-'; } },
    { label: "Jenis", render: r => `<span class="badge ${r.jenis === 'Pelanggaran' ? 'badge-danger' : r.jenis === 'Prestasi' ? 'badge-success' : 'badge-muted'}">${esc(r.jenis)}</span>` },
    { label: "Isi Catatan", field: "catatan" },
    { label: "Dicatat Oleh", field: "guru" },
  ]
};

export function pageCatatan() { return renderCrudPage(CFG_CATATAN); }
