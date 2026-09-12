// js/pages/jurnal.js
import { todayISO, fmtDate } from '../utils.js';
import { kelasLabel, mapelLabel } from '../helpers.js';
import { state } from '../state.js';
import { renderCrudPage } from '../ui.js';

export const CFG_JURNAL = {
  key: "jurnal", title: "Jurnal Mengajar", icon: "jurnal",
  searchFields: ["materi", "guru"],
  sort: rows => [...rows].sort((a, b) => b.tanggal.localeCompare(a.tanggal)),
  wide: true,
  fields: [
    { name: "tanggal", label: "Tanggal", type: "date", required: true, default: todayISO() },
    { name: "kelasId", label: "Kelas", type: "select", required: true, options: () => state.kelas.map(k => ({ value: k.id, label: k.nama })) },
    { name: "mapelId", label: "Mata Pelajaran", type: "select", required: true, options: () => state.mapel.map(m => ({ value: m.id, label: m.nama })) },
    { name: "jamKe", label: "Jam Ke-", placeholder: "contoh: 3-4" },
    { name: "guru", label: "Nama Guru", required: true },
    { name: "capaianPembelajaran", label: "Capaian Pembelajaran (CP)", type: "textarea", rows: 2, placeholder: "Capaian pembelajaran (CP) sesuai kurikulum untuk pertemuan ini" },
    { name: "tujuanPembelajaran", label: "Tujuan Pembelajaran (TP)", type: "textarea", rows: 2, placeholder: "Tujuan pembelajaran (TP) yang ingin dicapai pada pertemuan ini" },
    { name: "materi", label: "Materi Pembelajaran", required: true },
    { name: "kegiatan", label: "Kegiatan Pembelajaran", type: "textarea", rows: 3 },
    { name: "catatan", label: "Catatan Tambahan", type: "textarea", rows: 2 },
  ],
  columns: [
    { label: "Tanggal", render: r => fmtDate(r.tanggal), mono: true },
    { label: "Kelas", render: r => kelasLabel(r.kelasId) },
    { label: "Mapel", render: r => mapelLabel(r.mapelId) },
    { label: "Jam Ke", field: "jamKe" },
    { label: "Capaian Pembelajaran", field: "capaianPembelajaran" },
    { label: "Tujuan Pembelajaran", field: "tujuanPembelajaran" },
    { label: "Materi", field: "materi", strong: true },
    { label: "Guru", field: "guru" },
  ]
};

export function pageJurnal() { return renderCrudPage(CFG_JURNAL); }
