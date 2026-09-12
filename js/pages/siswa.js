// js/pages/siswa.js
import { state } from '../state.js';
import { esc } from '../utils.js';
import { kelasLabel } from '../helpers.js';
import { renderCrudPage } from '../ui.js';

export const CFG_SISWA = {
  key: "siswa", title: "Data Siswa", icon: "siswa",
  searchFields: ["nama", "nis", "nisn"],
  sort: rows => [...rows].sort((a, b) => a.nama.localeCompare(b.nama)),
  fields: [
    { name: "nama", label: "Nama Lengkap", required: true },
    { name: "nis", label: "NIS", required: true },
    { name: "nisn", label: "NISN" },
    { name: "kelasId", label: "Kelas", type: "select", required: true, options: () => state.kelas.map(k => ({ value: k.id, label: k.nama })) },
    { name: "jenisKelamin", label: "Jenis Kelamin", type: "select", required: true, options: [{ value: "L", label: "Laki-laki" }, { value: "P", label: "Perempuan" }] },
    { name: "tempatLahir", label: "Tempat Lahir" },
    { name: "tanggalLahir", label: "Tanggal Lahir", type: "date" },
    { name: "namaOrtu", label: "Nama Orang Tua / Wali" },
    { name: "noHpOrtu", label: "No. HP Orang Tua / Wali" },
    { name: "alamat", label: "Alamat", type: "textarea" },
    { name: "status", label: "Status", type: "select", default: "Aktif", options: [{ value: "Aktif", label: "Aktif" }, { value: "Pindah", label: "Pindah" }, { value: "Lulus", label: "Lulus" }] },
  ],
  columns: [
    { label: "NIS", field: "nis", mono: true },
    { label: "Nama Siswa", field: "nama", strong: true },
    { label: "Kelas", render: r => kelasLabel(r.kelasId) },
    { label: "JK", render: r => r.jenisKelamin === "L" ? "Laki-laki" : "Perempuan" },
    { label: "Orang Tua/Wali", field: "namaOrtu" },
    { label: "Status", render: r => `<span class="badge ${r.status === 'Aktif' ? 'badge-success' : r.status === 'Pindah' ? 'badge-warn' : 'badge-muted'}">${esc(r.status || 'Aktif')}</span>` },
  ]
};

export function pageSiswa() { return renderCrudPage(CFG_SISWA); }
