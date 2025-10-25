// === Mini client REST Supabase (sans CDN) ===
// Lit toujours les valeurs sur window AU MOMENT de l'appel (pas au chargement)
(function (global) {
  function getCfg() {
    const url = global.SUPABASE_URL || '';
    const key = global.SUPABASE_KEY || '';
    if (!url || !key) {
      console.warn('⚠️ Config manquante : SUPABASE_URL / SUPABASE_KEY');
    }
    return {
      BASE: url ? `${url}/rest/v1` : '/rest/v1', // si vide, on verrait /rest/v1 => 405 github.io
      HEADERS: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      }
    };
  }

  async function readBodyOnce(res) {
    const text = await res.text();
    let json = null;
    try { json = JSON.parse(text); } catch {}
    return { text, json };
  }

  // Insert dans la table `reports`
  async function sbInsertReport(payload) {
    const { BASE, HEADERS } = getCfg();
    const res = await fetch(`${BASE}/reports`, {
      method: 'POST',
      headers: { ...HEADERS, Prefer: 'return=representation' },
      body: JSON.stringify(payload),
    });
    const { text, json } = await readBodyOnce(res);
    if (!res.ok) {
      const msg = (json && (json.message || json.error)) || text || 'Erreur inconnue';
      throw new Error(`${res.status} ${res.statusText} – ${msg}`);
    }
    return json ?? text;
  }

  global.sbInsertReport = sbInsertReport;
})(window);
