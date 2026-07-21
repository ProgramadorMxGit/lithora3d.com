import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const routes = new Map([
  ['precios-impresion-3d', 'prices'],
  ['prototipado-rapido', 'prototype'],
  ['materiales-impresion-3d', 'materials'],
  ['ecosistema-soluciones', 'solutions']
]);
const read = (...segments) => fs.readFileSync(path.join(root, ...segments), 'utf8');

test('el refresh se carga solamente en las cuatro rutas aprobadas', () => {
  for (const [route, page] of routes) {
    const html = read(route, 'index.html');
    assert.match(html, new RegExp(`data-motion-page="${page}"`));
    assert.match(html, /href="\.\.\/assets\/motion-pages\.css"/);
    assert.match(html, /src="\.\.\/assets\/motion-pages\.js" defer/);
  }
  assert.doesNotMatch(read('index.html'), /motion-pages\.(?:css|js)|data-motion-page/);
  assert.doesNotMatch(read('servicio-impresion-3d', 'index.html'), /motion-pages\.(?:css|js)|data-motion-page/);
});

test('el sistema comparte tokens pero diferencia las cuatro identidades', () => {
  const css = read('assets', 'motion-pages.css');
  for (const token of ['--motion-instant', '--motion-press', '--motion-hover', '--motion-state', '--motion-close', '--motion-expand', '--motion-editorial', '--motion-assemble', '--motion-bridge']) {
    assert.match(css, new RegExp(token));
  }
  for (const page of routes.values()) assert.match(css, new RegExp(`data-motion-page="${page}"`));
  assert.match(css, /Prices: measurement rules/);
  assert.match(css, /Prototype: connected progression/);
  assert.match(css, /Materials: Spotlight Card/);
  assert.match(css, /Solutions: finite network/);
});

test('el contenido permanece visible sin JavaScript y reduced motion elimina desplazamientos', () => {
  const css = read('assets', 'motion-pages.css');
  assert.doesNotMatch(css, /\.motion-enhanced[^\{]*\{[^}]*opacity\s*:\s*0/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /transform: none !important/);
  assert.match(css, /animation-duration: \.001ms !important/);
});

test('el motor es idempotente, agrupado y limpia recursos', () => {
  const js = read('assets', 'motion-pages.js');
  assert.match(js, /dataset\.lithoraMotionReady === 'true'/);
  assert.match(js, /new IntersectionObserver/);
  assert.equal((js.match(/new IntersectionObserver/g) || []).length, 1);
  assert.match(js, /observer\?\.disconnect\(\)/);
  assert.match(js, /activeAnimations\.forEach\(\(animation\) => animation\.cancel\(\)\)/);
  assert.match(js, /listeners\.splice\(0\)\.forEach/);
  assert.match(js, /visibilitychange/);
  assert.match(js, /orientationchange/);
  assert.match(js, /window\.LithoraMotionDebug/);
  assert.match(js, /scrollTriggers: 0/);
});

test('las animaciones usan propiedades de compositor y respetan límites', () => {
  const sources = `${read('assets', 'motion-pages.css')}\n${read('assets', 'motion-pages.js')}`;
  assert.doesNotMatch(sources, /(?:animate|transition)[^;\n]*(?:\bwidth\b|\bheight\b|\btop\b|\bleft\b|margin|padding)/i);
  assert.doesNotMatch(sources, /filter:\s*blur|backdrop-filter|scrollTo\s*\(/i);
  assert.doesNotMatch(sources, /scale\((?:1\.[1-9]|[2-9])/);
  assert.doesNotMatch(sources, /translate(?:3d|X|Y)?\([^)]*(?:4[1-9]|[5-9]\d|\d{3,})px/i);
});

test('Soluciones conserva contratos y centraliza eventos de motion', () => {
  const js = read('ecosistema-soluciones', 'ecosistema.js');
  assert.match(js, /lithora:category-change/);
  assert.match(js, /lithora:detail-open/);
  assert.match(js, /lithora:detail-close/);
  assert.match(js, /history\.pushState/);
  assert.match(js, /addEventListener\('popstate'/);
  assert.match(js, /button\.focus\(\{ preventScroll: true \}\)/);
  assert.doesNotMatch(js, /visible && changed && !reducedMotion[^\n]*card\.animate/);
  assert.doesNotMatch(js, /detail\.animate\(\[\{ opacity: 0, transform: 'translateY\(-8px\)'/);
});

test('el peso propio permanece dentro del presupuesto sin dependencias nuevas', () => {
  const css = fs.statSync(path.join(root, 'assets', 'motion-pages.css')).size;
  const js = fs.statSync(path.join(root, 'assets', 'motion-pages.js')).size;
  assert.ok(css + js <= 35 * 1024, `peso propio ${(css + js) / 1024} KB`);
  const source = read('assets', 'motion-pages.js');
  assert.doesNotMatch(source, /\bgsap\b|ScrollTrigger|import\s|https?:\/\//);
});
