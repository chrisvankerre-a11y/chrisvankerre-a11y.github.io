// === Mini client REST Supabase (sans CDN) ===
// Utilise les variables déjà présentes dans la page HTML : SUPABASE_URL et SUPABASE_KEY
(function (global) {
  const SB_URL = typeof global.SUPABASE_URL !== 'undefined' ? global.SUPABASE_URL : '';
  const SB_KEY = typeof global.SUPABASE_KEY !== 'undefined' ? global.SUPABASE_KEY : '';

  if (!SB_URL || !SB_KEY) {
    console.warn('⚠️ Configuration Supabase manquante : SUPABASE_URL ou SUPABASE_KEY non définis dans la page.');
  }

  const BASE = `${SB_URL}/rest/v1`;
  const SB_HEADERS = {
    apikey: SB_KEY,
    Authorization: `Bearer ${SB_KEY}`,
    'Content-Type': 'application/json',
  };

  // Insert dans la table `reports`
  async function sbInsertReport(payload) {
    const res = await fetch(`${BASE}/reports`, {
      method: 'POST',
      headers: { ...SB_HEADERS, Prefer: 'return=representation' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      let err;
      try { err = await res.json(); } catch { err = { message: await res.text() }; }
      throw new Error(err.message || 'Insertion échouée');
    }
    return res.json();
  }

  // Expose les fonctions au global
  global.sbInsertReport = sbInsertReport;
})(window);
