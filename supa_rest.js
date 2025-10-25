// === Mini client REST Supabase (sans CDN) ===
console.log("URL détectée :", window.SUPABASE_URL);
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

  // Lecture du corps UNE SEULE FOIS puis parsing JSON si possible
  async function readBodyOnce(res) {
    const text = await res.text(); // une seule lecture
    let json = null;
    try { json = JSON.parse(text); } catch { /* pas du JSON */ }
    return { text, json };
  }

  // Insert dans la table `reports`
  async function sbInsertReport(payload) {
    const url = `${BASE}/reports`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { ...SB_HEADERS, Prefer: 'return=representation' },
      body: JSON.stringify(payload),
    });

    const { text, json } = await readBodyOnce(res);

    if (!res.ok) {
      const msg = (json && (json.message || json.error)) || text || 'Erreur inconnue';
      throw new Error(`${res.status} ${res.statusText} – ${msg}`);
    }
    return json ?? text;
  }

  // Expose la fonction au global
  global.sbInsertReport = sbInsertReport;
})(window);
