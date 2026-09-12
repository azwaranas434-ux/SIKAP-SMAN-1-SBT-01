// js/supabase-client.js - Koneksi Supabase via Vercel env (Opsi B)
// Alur: browser fetch /api/config -> server Vercel membacakan
// process.env.SUPABASE_URL & SUPABASE_ANON_KEY -> frontend buat client.
// Fallback: window.ENV_* (testing lokal) -> localStorage.

let cached = null;
let attempted = false;

async function fetchServerConfig() {
  try {
    const r = await fetch("/api/config", { cache: "no-store" });
    if (!r.ok) return null;
    return await r.json();
  } catch (e) { return null; }
}

export async function getSupabase() {
  if (cached) return cached;
  if (attempted) return null;
  attempted = true;

  let url = "";
  let anonKey = "";

  const serverCfg = await fetchServerConfig();
  if (serverCfg) {
    url = serverCfg.url || "";
    anonKey = serverCfg.anonKey || "";
  }
  // Fallback untuk testing lokal (buka via Live Server / file lokal)
  if (!url && window.ENV_SUPABASE_URL) url = window.ENV_SUPABASE_URL;
  if (!anonKey && window.ENV_SUPABASE_ANON_KEY) anonKey = window.ENV_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return null;
  if (typeof window.supabase === "undefined") return null;

  cached = window.supabase.createClient(url, anonKey);
  return cached;
}

// Kompatibilitas: modul lama mengimpor { supabase }
export const supabase = null;
