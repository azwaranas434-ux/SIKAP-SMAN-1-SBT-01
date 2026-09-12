// js/state.js - State management dan storage layer
import { MODULE_KEYS, DEFAULT_SETTINGS } from './config.js';
import { getSupabase } from './supabase-client.js';

export const state = {
  settings: {...DEFAULT_SETTINGS},
  kelas: [], siswa: [], mapel: [], jadwal: [], absensi: [], nilai: [], jurnal: [], catatan: []
};

let route = "dashboard";
let sidebarOpen = false;
export { route, sidebarOpen };
export function setRoute(r) { route = r; }
export function setSidebarOpen(v) { sidebarOpen = v; }

// Storage layer - Supabase SAJA (tanpa localStorage).
// Semua baca/tulis wajib ke tabel app_storage via /api/config.
async function cloudClient() {
  const sb = await getSupabase();
  if (!sb) throw new Error("Supabase belum terkonfigurasi. Isi SUPABASE_URL & SUPABASE_ANON_KEY di Vercel Environment Variables, lalu redeploy.");
  return sb;
}

export async function storageGet(key) {
  const sb = await cloudClient();
  const { data, error } = await sb.from('app_storage').select('value').eq('key', key).single();
  if (error || !data) return null;
  return JSON.parse(data.value);
}

export async function storageSet(key, value) {
  const sb = await cloudClient();
  const { error } = await sb.from('app_storage').upsert({ key, value: JSON.stringify(value) });
  if (error) throw new Error("Gagal menyimpan ke Supabase: " + error.message);
  return true;
}

export async function loadAll() {
  const s = await storageGet("app:settings");
  state.settings = s ? {...DEFAULT_SETTINGS, ...s} : {...DEFAULT_SETTINGS};
  for (const k of MODULE_KEYS) {
    const d = await storageGet("app:" + k);
    state[k] = Array.isArray(d) ? d : [];
  }
}

export async function saveModule(k) {
  if (k === "settings") return storageSet("app:settings", state.settings);
  return storageSet("app:" + k, state[k]);
}
