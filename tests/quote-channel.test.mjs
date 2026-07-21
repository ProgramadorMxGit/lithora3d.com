import test from 'node:test';
import assert from 'node:assert/strict';
import { buildQuoteContext, buildWhatsAppMessage, buildWhatsAppUrl, createQuoteChannel, QUOTE_STATES, validateQuote } from '../ecosistema-soluciones/quote-channel.js';

test('construye y preserva categoria, nicho, aplicacion, imagen y URL de origen', () => {
  const context = buildQuoteContext({ categoryId: 'negocios', categoryName: 'Negocios', nicheId: 'restaurantes', nicheName: 'Restaurantes', application: 'Porta QR', originUrl: 'http://localhost/ecosistema-soluciones/#negocios', imageType: 'conceptual' });
  assert.deepEqual(context, { categoryId: 'negocios', categoryName: 'Negocios', nicheId: 'restaurantes', nicheName: 'Restaurantes', application: 'Porta QR', originUrl: 'http://localhost/ecosistema-soluciones/#negocios', imageType: 'conceptual' });
});

test('valida campos sin exigir archivo y rechaza adjuntos mayores a 10 MB', () => {
  assert.equal(validateQuote({ name: 'Ana', email: 'ana@example.test', description: 'Necesito orientacion' }).valid, true);
  assert.equal(validateQuote({ name: '', email: 'invalido', description: '' }).valid, false);
  assert.equal(validateQuote({ name: 'Ana', email: 'ana@example.test', description: 'Ayuda', file: { size: 10 * 1024 * 1024 + 1 } }).errors.file, 'too-large');
  assert.equal(validateQuote({ name: '', email: '', description: 'Mensaje editable' }, { requireContact: false }).valid, true);
  assert.equal(validateQuote({ name: '', email: 'invalido', description: 'Mensaje editable' }, { requireContact: false }).valid, false);
});

test('sin endpoint informa unavailable y nunca llama al servidor', async () => {
  let called = false;
  const states = [];
  const channel = createQuoteChannel({ fetchImpl: async () => { called = true; } });
  const result = await channel.submit({}, (state) => states.push(state));
  assert.deepEqual(result, { ok: false, confirmed: false, state: QUOTE_STATES.UNAVAILABLE });
  assert.deepEqual(states, [QUOTE_STATES.UNAVAILABLE]);
  assert.equal(called, false);
});

test('construye el enlace oficial de WhatsApp preservando todo el contexto', () => {
  const context = buildQuoteContext({ categoryId: 'negocios', categoryName: 'Negocios', nicheId: 'pizzerias', nicheName: 'Pizzerías', application: 'Portamenús', originUrl: 'https://lithora3d.com/ecosistema-soluciones/#eventos', imageType: 'conceptual' });
  assert.match(buildWhatsAppMessage(context), /Pizzerías.*Negocios.*Portamenús/);
  const url = new URL(buildWhatsAppUrl('https://wa.me/528331080178', { context, message: 'Mensaje editable' }));
  assert.equal(`${url.origin}${url.pathname}`, 'https://wa.me/528331080178');
  assert.match(url.searchParams.get('text'), /Mensaje editable/);
  for (const value of ['Negocios', 'Pizzerías', 'Portamenús', context.originUrl]) assert.ok(url.searchParams.get('text').includes(value));
});

test('WhatsApp informa handoff, no confirmacion falsa, y conserva la URL abierta', async () => {
  const opened = [];
  const states = [];
  const channel = createQuoteChannel({ channel: 'whatsapp', destination: 'https://wa.me/528331080178', openImpl: (...args) => { opened.push(args); return {}; } });
  assert.equal(channel.available, true);
  const result = await channel.submit({ context: { nicheName: 'Gimnasios', categoryName: 'Diseño y prototipos', application: 'Trofeos', originUrl: 'https://lithora3d.com/ecosistema-soluciones/' } }, (state) => states.push(state));
  assert.equal(result.ok, true);
  assert.equal(result.confirmed, false);
  assert.equal(result.state, QUOTE_STATES.HANDOFF);
  assert.deepEqual(states, [QUOTE_STATES.LOADING, QUOTE_STATES.HANDOFF]);
  assert.equal(opened[0][1], '_blank');
  assert.match(opened[0][0], /^https:\/\/wa\.me\/528331080178\?text=/);
});

test('WhatsApp informa error honesto si el navegador bloquea la ventana', async () => {
  const states = [];
  const channel = createQuoteChannel({ channel: 'whatsapp', destination: 'https://wa.me/528331080178', openImpl: () => null });
  const result = await channel.submit({ context: {} }, (state) => states.push(state));
  assert.equal(result.reason, 'popup-blocked');
  assert.equal(result.confirmed, false);
  assert.deepEqual(states, [QUOTE_STATES.LOADING, QUOTE_STATES.ERROR]);
});

test('expone loading y error ante respuesta negativa o fallo de red', async () => {
  const responseStates = [];
  const responseChannel = createQuoteChannel({ endpoint: '/quote', fetchImpl: async () => ({ ok: false, status: 503, json: async () => ({ accepted: false }) }) });
  assert.equal((await responseChannel.submit({}, (state) => responseStates.push(state))).state, QUOTE_STATES.ERROR);
  assert.deepEqual(responseStates, [QUOTE_STATES.LOADING, QUOTE_STATES.ERROR]);
  const networkStates = [];
  const networkChannel = createQuoteChannel({ endpoint: '/quote', fetchImpl: async () => { throw new Error('offline'); } });
  assert.equal((await networkChannel.submit({}, (state) => networkStates.push(state))).state, QUOTE_STATES.ERROR);
  assert.deepEqual(networkStates, [QUOTE_STATES.LOADING, QUOTE_STATES.ERROR]);
});

test('solo informa success con respuesta real accepted=true', async () => {
  const states = [];
  const channel = createQuoteChannel({ endpoint: '/quote', fetchImpl: async (_url, options) => {
    assert.equal(options.method, 'POST');
    return { ok: true, status: 200, json: async () => ({ accepted: true, reference: 'Q-1' }) };
  } });
  const result = await channel.submit({ context: { nicheId: 'n1' } }, (state) => states.push(state));
  assert.deepEqual(result, { ok: true, confirmed: true, state: QUOTE_STATES.SUCCESS, reference: 'Q-1' });
  assert.deepEqual(states, [QUOTE_STATES.LOADING, QUOTE_STATES.SUCCESS]);
});
