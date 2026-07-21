import test from 'node:test';
import assert from 'node:assert/strict';
import { ANALYTICS_EVENTS, createAnalyticsAdapter } from '../ecosistema-soluciones/analytics.js';

class LocalCustomEvent { constructor(type, init) { this.type = type; this.detail = init.detail; } }

test('expone exactamente los nueve eventos definidos en design.md', () => {
  assert.deepEqual(ANALYTICS_EVENTS, [
    'ecosystem_section_view', 'ecosystem_category_select', 'ecosystem_niche_open',
    'ecosystem_application_click', 'ecosystem_quote_click', 'ecosystem_quote_start',
    'ecosystem_quote_complete', 'ecosystem_origin_context', 'ecosystem_attachment_use',
  ]);
});

test('envia a CustomEvent y dataLayer con payload minimo sin PII', () => {
  const dispatched = [];
  const dataLayer = [];
  const target = { CustomEvent: LocalCustomEvent, dataLayer, dispatchEvent: (event) => dispatched.push(event) };
  const adapter = createAnalyticsAdapter({ target, dataLayer, now: () => '2026-07-20T00:00:00.000Z' });
  assert.equal(adapter.emit('ecosystem_quote_start', { attemptId: 'a1', nicheId: 'n1', categoryId: 'c1', channel: 'test', originUrl: '/ruta', email: 'no@guardar.test', description: 'dato personal' }, { onceKey: 'a1' }), true);
  assert.equal(dispatched.length, 1);
  assert.equal(dataLayer.length, 1);
  assert.equal(dispatched[0].type, 'ecosystem_quote_start');
  assert.equal(dataLayer[0].event, 'ecosystem_quote_start');
  assert.equal('email' in dataLayer[0], false);
  assert.equal('description' in dataLayer[0], false);
});

test('previene duplicados y usa no-op seguro sin proveedor', () => {
  const adapter = createAnalyticsAdapter({ target: {} });
  assert.doesNotThrow(() => adapter.emit('ecosystem_section_view', { route: '/' }, { onceKey: 'load' }));
  assert.equal(adapter.emit('ecosystem_section_view', { route: '/' }, { onceKey: 'load' }), false);
  assert.equal(adapter.emit('evento_inventado', {}), false);
});

test('un proveedor defectuoso nunca rompe la experiencia', () => {
  const target = { CustomEvent: LocalCustomEvent, dispatchEvent() { throw new Error('provider down'); } };
  const malformedLayer = new Proxy([], { get() { throw new Error('provider down'); } });
  const adapter = createAnalyticsAdapter({ target, dataLayer: malformedLayer });
  assert.doesNotThrow(() => adapter.emit('ecosystem_niche_open', { nicheId: 'n1' }));
});
