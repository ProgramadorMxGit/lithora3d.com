export const ANALYTICS_EVENTS = Object.freeze([
  'ecosystem_section_view', 'ecosystem_category_select', 'ecosystem_niche_open',
  'ecosystem_application_click', 'ecosystem_quote_click', 'ecosystem_quote_start',
  'ecosystem_quote_complete', 'ecosystem_origin_context', 'ecosystem_attachment_use',
]);

const allowedPayload = Object.freeze({
  ecosystem_section_view: ['route', 'referrer', 'device'],
  ecosystem_category_select: ['categoryId', 'categoryName', 'route', 'device'],
  ecosystem_niche_open: ['nicheId', 'nicheName', 'categoryId', 'route', 'device'],
  ecosystem_application_click: ['nicheId', 'categoryId', 'applicationName', 'route'],
  ecosystem_quote_click: ['nicheId', 'nicheName', 'categoryId', 'cta', 'route', 'device'],
  ecosystem_quote_start: ['attemptId', 'nicheId', 'categoryId', 'channel', 'originUrl'],
  ecosystem_quote_complete: ['attemptId', 'nicheId', 'categoryId', 'channel', 'sendStatus'],
  ecosystem_origin_context: ['nicheId', 'nicheName', 'categoryId', 'originUrl'],
  ecosystem_attachment_use: ['attemptId', 'nicheId', 'categoryId', 'action', 'result'],
});

export function createAnalyticsAdapter({ target = globalThis, dataLayer = target?.dataLayer, now = () => new Date().toISOString() } = {}) {
  const emitted = new Set();
  function emit(name, payload = {}, { onceKey } = {}) {
    if (!ANALYTICS_EVENTS.includes(name)) return false;
    const dedupeKey = onceKey ? `${name}:${onceKey}` : null;
    if (dedupeKey && emitted.has(dedupeKey)) return false;
    const clean = {};
    for (const key of allowedPayload[name]) {
      const value = payload[key];
      if (['string', 'number', 'boolean'].includes(typeof value) && String(value).length <= 500) clean[key] = value;
    }
    const detail = Object.freeze({ event: name, dateTime: now(), ...clean });
    try {
      if (typeof target?.dispatchEvent === 'function' && typeof target?.CustomEvent === 'function') target.dispatchEvent(new target.CustomEvent(name, { detail }));
    } catch { /* Analytics must never affect the interface. */ }
    try {
      if (Array.isArray(dataLayer)) dataLayer.push({ ...detail });
    } catch { /* Safe no-op for malformed providers. */ }
    if (dedupeKey) emitted.add(dedupeKey);
    return true;
  }
  return Object.freeze({ emit, events: ANALYTICS_EVENTS });
}
