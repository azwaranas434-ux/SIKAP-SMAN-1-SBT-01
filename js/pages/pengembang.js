// js/pages/pengembang.js
import { state } from '../state.js';
import { esc, icon } from '../utils.js';
import { initials } from '../helpers.js';

const LOGO_DATA_URI = window.LOGO_DATA_URI || "";

export const APP_VERSION = "1.0.0";
export const APP_BUILD_INFO = {
  namaAplikasi: "SIKAP — Sistem Informasi Kehadiran & Asesmen Pendidikan",
  teknologi: "HTML, CSS, JavaScript (Single Page App) + Chart.js",
  penyimpanan: "Cloud Storage (tersinkron otomatis, dapat diakses bersama)"
};

export const DEVELOPER_INFO = Object.freeze({
  nama: "AZWAR ANAS, S.Pd, M.Pd",
  instansi: "SMA Negeri 1 Seram Bagian Timur",
  email: "anasazwar72@gmail.com",
  telepon: "0822 3494 3492",
  website: "",
  catatan: "Apabila ada kendala dalam aplikasi ini silahkan hubungi saya.",
  hakCipta: "Hak Cipta Dilindungi © 2026"
});

export function pagePengembang() {
  const p = DEVELOPER_INFO;
  return `
  <div class="grid-2">
    <div class="card card-pad">
      <div class="section-head">
        <h3>Pengembang Aplikasi</h3>
        <span class="badge badge-accent">${icon('check',12)} Data Terkunci</span>
      </div>
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:18px;">
        <div class="avatar-init" style="width:52px;height:52px;font-size:17px;">${initials(p.nama)}</div>
        <div>
          <div class="cell-strong" style="font-size:15px;">${esc(p.nama)}</div>
          <div style="font-size:12.5px;color:var(--muted);">${esc(p.instansi)}</div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;font-size:13.5px;">
        ${p.email ? `<div style="display:flex;align-items:center;gap:9px;color:var(--ink);">${icon('mail',16)} ${esc(p.email)}</div>` : ''}
        ${p.telepon ? `<div style="display:flex;align-items:center;gap:9px;color:var(--ink);">${icon('phone',16)} ${esc(p.telepon)}</div>` : ''}
        ${p.website ? `<div style="display:flex;align-items:center;gap:9px;color:var(--ink);">${icon('globe',16)} ${esc(p.website)}</div>` : ''}
      </div>
      ${p.catatan ? `<div class="divider"></div><div style="font-size:13px;color:var(--muted);font-style:italic;">"${esc(p.catatan)}"</div>` : ''}
      <div class="divider"></div>
      <div style="display:flex;align-items:center;gap:8px;font-size:11.5px;color:var(--muted);">
        ${icon('pengaturan',13)} Informasi ini telah dipatenkan dan dikunci secara permanen di dalam kode aplikasi — tidak dapat diubah, dihapus, maupun disunting melalui menu apa pun.
      </div>
    </div>

    <div>
      <div class="card card-pad" style="margin-bottom:18px;">
        <div class="section-head"><h3>Tentang Aplikasi</h3></div>
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;">
          <div class="seal" style="width:52px;height:52px;"><img src="${LOGO_DATA_URI}" alt="Logo Sekolah"></div>
          <div>
            <div style="font-family:'Poppins',sans-serif;font-weight:700;font-size:14.5px;">${esc(APP_BUILD_INFO.namaAplikasi)}</div>
            <div style="font-size:12px;color:var(--muted);">${esc(state.settings.namaSekolah)}</div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:9px;font-size:13px;">
          <div style="display:flex;justify-content:space-between;"><span style="color:var(--muted);">Versi Aplikasi</span><span class="cell-mono badge badge-accent">${APP_VERSION}</span></div>
          <div style="display:flex;justify-content:space-between;"><span style="color:var(--muted);">Teknologi</span><span style="text-align:right;max-width:60%;">${esc(APP_BUILD_INFO.teknologi)}</span></div>
          <div style="display:flex;justify-content:space-between;"><span style="color:var(--muted);">Penyimpanan Data</span><span style="text-align:right;max-width:60%;">${esc(APP_BUILD_INFO.penyimpanan)}</span></div>
        </div>
      </div>

      <div class="card card-pad" style="text-align:center;background:var(--primary-dark);border-color:var(--primary-dark);">
        <div style="color:rgba(234,243,240,0.7);font-size:11.5px;letter-spacing:.03em;text-transform:uppercase;font-weight:600;">Hak Cipta</div>
        <div style="color:#fff;font-family:'Poppins',sans-serif;font-weight:700;font-size:14px;margin-top:6px;">${esc(p.hakCipta)}</div>
        <div style="color:rgba(234,243,240,0.55);font-size:11.5px;margin-top:4px;">${esc(p.nama)} — ${esc(p.instansi)}</div>
      </div>
    </div>
  </div>
  `;
}
