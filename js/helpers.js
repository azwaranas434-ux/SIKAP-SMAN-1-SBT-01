// js/helpers.js - Shared lookup helpers used across page modules
import { state } from './state.js';

export function findKelas(id) { return state.kelas.find(k => k.id === id); }
export function findSiswa(id) { return state.siswa.find(s => s.id === id); }
export function findMapel(id) { return state.mapel.find(m => m.id === id); }
export function kelasLabel(id) { const k = findKelas(id); return k ? k.nama : "-"; }
export function siswaLabel(id) { const s = findSiswa(id); return s ? s.nama : "-"; }
export function mapelLabel(id) { const m = findMapel(id); return m ? m.nama : "-"; }
export function siswaByKelas(kelasId) {
  return state.siswa.filter(s => s.kelasId === kelasId && s.status !== "Pindah" && s.status !== "Lulus")
    .sort((a, b) => a.nama.localeCompare(b.nama));
}
export function initials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
}
