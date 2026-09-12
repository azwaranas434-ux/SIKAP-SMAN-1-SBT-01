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

// Storage layer - Supabase (via /api/config) + localStorage fallback
async function cloudClient() {
  try { return await getSupabase(); }
  catch (e) { return null; }
}

function localGet(key) {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : null; }
  catch(e) { return null; }
}
function localSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch(e) { return false; }
}

export async function storageGet(key) {
  const sb = await cloudClient();
  if (sb) {
    try {
      const { data, error } = await sb.from('app_storage').select('value').eq('key', key).single();
      if (!error && data) return JSON.parse(data.value);
    } catch(e) {}
  }
  return localGet(key);
}

export async function storageSet(key, value) {
  const sb = await cloudClient();
  if (sb) {
    try {
      const { error } = await sb.from('app_storage').upsert({ key, value: JSON.stringify(value) });
      if (!error) return true;
    } catch(e) {}
  }
  return localSet(key, value);
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
