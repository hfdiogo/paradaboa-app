import { API_BASE_URL } from './config';

// Retry com backoff + timeout (para Render Free “acordar”)
async function fetchWithRetry(path, { method='GET', headers={}, body } = {}, {
  retries = 2,
  backoff = 2000,        // 2s, depois 4s
  timeoutMs = 70000      // 70s (primeira resposta pode demorar)
} = {}) {
  const url = `${API_BASE_URL}${path}`;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', ...headers },
      body,
      signal: ctrl.signal
    });
    clearTimeout(t);
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status} ${text}`);
    }
    const text = await res.text();
    try { return JSON.parse(text); } catch { return text; }
  } catch (e) {
    if (retries <= 0) throw e;
    await new Promise(r => setTimeout(r, backoff));
    return fetchWithRetry(path, { method, headers, body }, { retries: retries - 1, backoff: backoff * 2, timeoutMs });
  }
}

export const Api = {
  ping: () => fetchWithRetry('/health', {}, { retries: 1, backoff: 1500, timeoutMs: 70000 }),
  listMeals: ({ mode } = {}) => fetchWithRetry(`/meals?${mode ? `mode=${mode}` : ''}`),
  getMeal: (id) => fetchWithRetry(`/meals/${id}`),
  createMeal: (payload) => fetchWithRetry('/meals', { method: 'POST', body: JSON.stringify(payload) }),
  createReservation: (payload) => fetchWithRetry('/reservations', { method: 'POST', body: JSON.stringify(payload) }),
  createPix: (reservation_id) => fetchWithRetry('/payments/pix', { method: 'POST', body: JSON.stringify({ reservation_id }) }),
};
