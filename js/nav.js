// js/nav.js - Navigation, sidebar
import { esc, icon, hexToRgba } from './utils.js';
import { state, route, sidebarOpen, setSidebarOpen } from './state.js';

export const MENU_COLORS = {
  dashboard: "#2563EB", kelas: "#16A34A", siswa: "#F59E0B", mapel: "#7C3AED",
  jadwal: "#DB2777", absensi: "#0D9488", nilai: "#E11D48", jurnal: "#0284C7",
  catatan: "#9333EA", rekap: "#EA580C", pengaturan: "#64748B", pengembang: "#DC2626"
};

export const NAV = [
  {id:"dashboard", label:"Dashboard", icon:"dashboard", sub:"Ringkasan aktivitas sekolah"},
  {id:"kelas", label:"Data Kelas", icon:"kelas", sub:"Kelola rombongan belajar"},
  {id:"siswa", label:"Data Siswa", icon:"siswa", sub:"Kelola data induk siswa"},
  {id:"mapel", label:"Mata Pelajaran", icon:"mapel", sub:"Kelola daftar mata pelajaran"},
  {id:"jadwal", label:"Jadwal Mengajar", icon:"jadwal", sub:"Susun jadwal mengajar mingguan"},
  {id:"absensi", label:"Absensi Siswa", icon:"absensi", sub:"Catat kehadiran siswa per kelas"},
  {id:"nilai", label:"Nilai Siswa", icon:"nilai", sub:"Input dan kelola nilai siswa"},
  {id:"jurnal", label:"Jurnal Mengajar", icon:"jurnal", sub:"Catat kegiatan pembelajaran harian"},
  {id:"catatan", label:"Catatan Siswa", icon:"catatan", sub:"Catatan prestasi & pembinaan siswa"},
  {id:"rekap", label:"Rekap & Cetak Laporan", icon:"rekap", sub:"Rekapitulasi dan cetak laporan"},
  {id:"pengaturan", label:"Pengaturan", icon:"pengaturan", sub:"Profil sekolah & preferensi aplikasi"},
  {id:"pengembang", label:"Pengembang", icon:"code", sub:"Informasi pengembang & tentang aplikasi"},
];
NAV.forEach(n => { n.color = MENU_COLORS[n.id] || "#C97A2B"; });

export function renderSidebar() {
  const sb = document.getElementById("sidebar");
  const currentRoute = window.currentRoute || "dashboard";
  const currentSidebarOpen = window.sidebarOpen || false;
  sb.className = "sidebar" + (currentSidebarOpen ? " open" : "");
  sb.innerHTML = `
    <div class="brand">
      <div class="seal"><img src="${window.LOGO_DATA_URI}" alt="Logo Sekolah"></div>
      <div class="brand-text">
        <div class="school-name">SMAN 1 SERAM<br>BAGIAN TIMUR</div>
        <div class="school-sub">SIKAP</div>
      </div>
    </div>
    <nav class="nav-ledger">
      ${NAV.map((n, i) => `
        <div class="nav-item ${currentRoute === n.id ? 'active' : ''}" style="${currentRoute === n.id ? `background:${hexToRgba(n.color, 0.16)};` : ''}" onclick="window.go('${n.id}')">
          <span class="idx" style="${currentRoute === n.id ? `color:${n.color};` : ''}">${String(i + 1).padStart(2, '0')}</span>
          <span class="nav-ico-wrap" style="display:flex;color:${n.color};${currentRoute === n.id ? '' : 'opacity:.8;'}">${icon(n.icon, 17)}</span>
          <span>${n.label}</span>
          ${currentRoute === n.id ? `<span style="position:absolute;left:-4px;top:50%;transform:translateY(-50%);width:3px;height:60%;background:${n.color};border-radius:2px;"></span>` : ''}
        </div>
        ${n.id === 'dashboard' || n.id === 'catatan' ? '<div class="nav-divider"></div>' : ''}
      `).join("")}
    </nav>
    <div class="sidebar-foot">
      Tahun Ajaran ${esc(state.settings.tahunAjaran)} · Semester ${esc(state.settings.semester)}
    </div>
  `;
}
