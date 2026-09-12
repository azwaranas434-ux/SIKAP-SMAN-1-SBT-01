// js/pages/mapel.js
import { renderCrudPage } from '../ui.js';

export const CFG_MAPEL = {
  key: "mapel", title: "Mata Pelajaran", icon: "mapel",
  searchFields: ["nama", "kode", "guruPengampu"],
  sort: rows => [...rows].sort((a, b) => a.nama.localeCompare(b.nama)),
  fields: [
    { name: "kode", label: "Kode Mapel", required: true, placeholder: "contoh: MTK-01" },
    { name: "nama", label: "Nama Mata Pelajaran", required: true },
    { name: "kkm", label: "KKM", type: "number", default: 75 },
    { name: "guruPengampu", label: "Guru Pengampu" },
  ],
  columns: [
    { label: "Kode", field: "kode", mono: true },
    { label: "Nama Mapel", field: "nama", strong: true },
    { label: "KKM", field: "kkm" },
    { label: "Guru Pengampu", field: "guruPengampu" },
  ]
};

export function pageMapel() { return renderCrudPage(CFG_MAPEL); }
