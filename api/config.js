// api/config.js - Vercel Serverless Function
// Membacakan env vars server ke browser agar key tidak tersimpan di repo.
// Isi di Vercel Dashboard > Settings > Environment Variables:
//   SUPABASE_URL dan SUPABASE_ANON_KEY
export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({
    url: process.env.SUPABASE_URL || "",
    anonKey: process.env.SUPABASE_ANON_KEY || ""
  });
}
