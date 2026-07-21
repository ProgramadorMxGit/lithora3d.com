export const QUOTE_STATES = Object.freeze({ IDLE: 'idle', AVAILABLE: 'available', UNAVAILABLE: 'unavailable', LOADING: 'loading', ERROR: 'error', HANDOFF: 'handoff', SUCCESS: 'success' });

export function buildQuoteContext({ categoryId = '', categoryName = '', nicheId = '', nicheName = '', application = '', originUrl = '', imageType = '' } = {}) {
  return { categoryId, categoryName, nicheId, nicheName, application, originUrl, imageType };
}

export function buildWhatsAppMessage(context = {}) {
  const niche = context.nicheName || 'una necesidad personalizada';
  const category = context.categoryName || 'orientación general';
  const application = context.application || 'una aplicación personalizada';
  return `Hola, quiero cotizar una solución para ${niche} en la categoría ${category}. Me interesa algo parecido a ${application}.`;
}

export function buildWhatsAppUrl(destination, { context = {}, message = '' } = {}) {
  const editableMessage = String(message || '').trim() || buildWhatsAppMessage(context);
  const preservedContext = [
    `Categoría: ${context.categoryName || context.categoryId || 'Orientación general'}`,
    `Nicho: ${context.nicheName || context.nicheId || 'General'}`,
    `Aplicación: ${context.application || 'Por definir'}`,
    `Origen: ${context.originUrl || 'No disponible'}`,
  ].join('\n');
  return `${String(destination).replace(/\?+$/, '')}?text=${encodeURIComponent(`${editableMessage}\n\n${preservedContext}`)}`;
}

export function validateQuote(values, { requireContact = true } = {}) {
  const errors = {};
  if (requireContact && !String(values.name || '').trim()) errors.name = 'required';
  if ((requireContact || String(values.email || '').trim()) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(values.email || '').trim())) errors.email = 'invalid';
  if (!String(values.description || '').trim()) errors.description = 'required';
  const file = values.file;
  if (file && file.size > 10 * 1024 * 1024) errors.file = 'too-large';
  return { valid: Object.keys(errors).length === 0, errors };
}

export function createQuoteChannel({ channel = 'http', endpoint = '', destination = '', fetchImpl = globalThis.fetch, openImpl = globalThis.open?.bind(globalThis) } = {}) {
  const whatsapp = channel === 'whatsapp';
  const available = whatsapp ? /^https:\/\/wa\.me\/\d+$/.test(destination) && typeof openImpl === 'function' : Boolean(endpoint && typeof fetchImpl === 'function');
  return Object.freeze({
    type: whatsapp ? 'whatsapp' : 'http',
    destination: whatsapp ? destination : endpoint,
    available,
    async submit(request, onState = () => {}) {
      if (!available) { onState(QUOTE_STATES.UNAVAILABLE); return { ok: false, confirmed: false, state: QUOTE_STATES.UNAVAILABLE }; }
      onState(QUOTE_STATES.LOADING);
      if (whatsapp) {
        try {
          const url = buildWhatsAppUrl(destination, request);
          const opened = openImpl(url, '_blank');
          if (!opened) { onState(QUOTE_STATES.ERROR); return { ok: false, confirmed: false, state: QUOTE_STATES.ERROR, reason: 'popup-blocked', url }; }
          // `noopener` como feature puede devolver null aun cuando la ventana si se abre.
          // Cortar la referencia inmediatamente conserva deteccion honesta de popup bloqueado.
          opened.opener = null;
          onState(QUOTE_STATES.HANDOFF);
          return { ok: true, confirmed: false, state: QUOTE_STATES.HANDOFF, url };
        } catch {
          onState(QUOTE_STATES.ERROR);
          return { ok: false, confirmed: false, state: QUOTE_STATES.ERROR };
        }
      }
      try {
        const response = await fetchImpl(endpoint, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify(request), credentials: 'same-origin' });
        const body = await response.json().catch(() => ({}));
        if (!response.ok || body?.accepted !== true) { onState(QUOTE_STATES.ERROR); return { ok: false, confirmed: false, state: QUOTE_STATES.ERROR, status: response.status }; }
        onState(QUOTE_STATES.SUCCESS);
        return { ok: true, confirmed: true, state: QUOTE_STATES.SUCCESS, reference: String(body.reference || '') };
      } catch {
        onState(QUOTE_STATES.ERROR);
        return { ok: false, confirmed: false, state: QUOTE_STATES.ERROR };
      }
    },
  });
}
