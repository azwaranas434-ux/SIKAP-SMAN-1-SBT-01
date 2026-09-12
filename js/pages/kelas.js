// js/pages/kelas.js
import { state } from '../state.js';
import { esc } from '../utils.js';
import { siswaByKelas } from '../helpers.js';
import { renderCrudPage } from '../ui.js';

export const CFG_KELAS = {
  key: "kelas", title: "Data Kelas", icon: "kelas",
  searchFields: ["nama", "waliKelas"],
  sort: rows => {
    const tOrder = { X: 0, XI: 1, XII: 2 };
    const parseNum = n => { const m = String(n).match(/(\d+)\s*$/); return m ? parseInt(m[1], 10) : 999; };
    return [...rows].sort((a, b) => (tOrder[a.tingkat] ?? 9) - (tOrder[b.tingkat] ?? 9) || parseNum(a.nama) - parseNum(b.nama) || a.nama.localeCompare(b.nama));
  },
  fields: [
    { name: "nama", label: "Nama Kelas", required: true, placeholder: "contoh: X IPA 1" },
    { name: "tingkat", label: "Tingkat", type: "select", required: true, options: [{ value: "X", label: "X" }, { value: "XI", label: "XI" }, { value: "XII", label: "XII" }] },
    { name: "jurusan", label: "Jurusan / Peminatan", placeholder: "contoh: IPA, IPS, Bahasa" },
    { name: "waliKelas", label: "Wali Kelas", required: true, placeholder: "Nama wali kelas" },
    { name: "nipWaliKelas", label: "NIP Wali Kelas", placeholder: "contoh: 19870511 201504 2 001" },
    { name: "tahunAjaran", label: "Tahun Ajaran", default: state.settings.tahunAjaran },
  ],
  columns: [
    { label: "Nama Kelas", field: "nama", strong: true },
    { label: "Tingkat", field: "tingkat" },
    { label: "Jurusan", field: "jurusan" },
    { label: "Wali Kelas", render: r => `${esc(r.waliKelas || '-')}${r.nipWaliKelas ? `<div class="cell-mono" style="font-size:11px;">NIP. ${esc(r.nipWaliKelas)}</div>` : ''}` },
    { label: "Jml Siswa", render: r => siswaByKelas(r.id).length },
    { label: "Tahun Ajaran", field: "tahunAjaran", mono: true },
  ]
};

export function pageKelas() { return renderCrudPage(CFG_KELAS); }
