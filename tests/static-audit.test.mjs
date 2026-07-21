import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const htmlFiles = fs.readdirSync(root, { recursive: true })
  .filter((name) => name.endsWith('index.html') && !name.startsWith('audits'))
  .map((name) => path.join(root, name));
const read = (file) => fs.readFileSync(file, 'utf8');

function localTarget(fromFile, href) {
  const clean = href.split('#')[0].split('?')[0];
  if (!clean || /^(https?:|mailto:|tel:|javascript:)/i.test(clean)) return null;
  if (clean.startsWith('/')) return path.join(root, clean.replace(/^\/+/, ''), clean.endsWith('/') ? 'index.html' : '');
  const resolved = path.resolve(path.dirname(fromFile), clean);
  return clean.endsWith('/') ? path.join(resolved, 'index.html') : resolved;
}

test('todas las paginas locales tienen metadata, canonical y un H1', () => {
  for (const file of htmlFiles) {
    const html = read(file);
    assert.match(html, /<meta\s+charset=/i, file);
    assert.match(html, /<meta\s+name="viewport"/i, file);
    assert.match(html, /<title>[^<]{10,}<\/title>/i, file);
    assert.match(html, /<meta\s+name="description"\s+content="[^"]{50,}"/i, file);
    assert.match(html, /<link\s+rel="canonical"\s+href="https:\/\/lithora3d\.com\/[^"]*"/i, file);
    assert.equal((html.match(/<h1\b/gi) || []).length, 1, file);
  }
});

test('enlaces internos y fragmentos apuntan a destinos existentes', () => {
  for (const file of htmlFiles) {
    const html = read(file);
    for (const [, href] of html.matchAll(/href="([^"]+)"/gi)) {
      const target = localTarget(file, href);
      if (target) assert.ok(fs.existsSync(target), `${path.relative(root, file)} -> ${href}`);
      if (href.startsWith('#') && href.length > 1) assert.match(html, new RegExp(`id=["']${href.slice(1)}["']`), `${path.relative(root, file)} -> ${href}`);
    }
  }
});

test('sitemap contiene cada ruta indexable y robots lo declara', () => {
  const sitemap = read(path.join(root, 'sitemap.xml'));
  const robots = read(path.join(root, 'robots.txt'));
  for (const file of htmlFiles) {
    const relative = path.relative(root, path.dirname(file)).replaceAll('\\', '/');
    const url = relative === '' ? 'https://lithora3d.com/' : `https://lithora3d.com/${relative}/`;
    assert.ok(sitemap.includes(`<loc>${url}</loc>`), url);
  }
  assert.match(robots, /Sitemap:\s*https:\/\/lithora3d\.com\/sitemap\.xml/i);
  assert.equal((sitemap.match(/<lastmod>2026-07-21<\/lastmod>/g) || []).length, htmlFiles.length);
  assert.match(sitemap, /xmlns:image="http:\/\/www\.google\.com\/schemas\/sitemap-image\/1\.1"/);
  assert.match(sitemap, /<image:caption>Ejemplos conceptuales/);
});

test('SEO estructurado usa datos aprobados y coincide con contenido visible', () => {
  const home = read(path.join(root, 'index.html'));
  assert.match(home, /"@type": "ContactPoint"/);
  assert.match(home, /"telephone": "\+52-833-108-0178"/);
  assert.doesNotMatch(home, />BOFU</i);
  assert.doesNotMatch(home, /captar b[uú]squedas|Landing enfocada/i);

  const prices = read(path.join(root, 'precios-impresion-3d', 'index.html'));
  assert.match(prices, /"name": "Cuanto cuesta hacer una impresion 3D\?"/);
  assert.match(prices, /&iquest;Cu&aacute;nto cuesta hacer una impresi&oacute;n 3D\?/);
  assert.match(prices, /&iquest;La impresi&oacute;n 3D se cobra por hora o por pieza\?/);

  const materials = read(path.join(root, 'materiales-impresion-3d', 'index.html'));
  assert.match(materials, /"name": "Que material es mejor, PLA o PETG\?"/);
  assert.match(materials, /&iquest;Qu&eacute; material es mejor, PLA o PETG\?/);

  const prototype = read(path.join(root, 'prototipado-rapido', 'index.html'));
  assert.match(prototype, /"@type": "FAQPage"/);
  assert.match(prototype, /&iquest;Qu&eacute; es un prototipo r&aacute;pido\?/);

  const ecosystem = read(path.join(root, 'ecosistema-soluciones', 'index.html'));
  assert.match(ecosystem, /"@type":"ItemList"/);
  assert.match(ecosystem, /"numberOfItems":9/);
});

test('Open Graph, JSON-LD y SEO del ecosistema son validos', () => {
  const html = read(path.join(root, 'ecosistema-soluciones', 'index.html'));
  for (const property of ['og:title', 'og:description', 'og:url', 'og:image']) assert.match(html, new RegExp(`property="${property}"`));
  const jsonLdBlocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  assert.ok(jsonLdBlocks.length > 0);
  jsonLdBlocks.forEach(([, source]) => assert.doesNotThrow(() => JSON.parse(source)));
  assert.doesNotMatch(html, /noindex/i);
});

test('imagenes de entrega son WebP locales, pequenas, lazy y con dimensiones reales', () => {
  const html = read(path.join(root, 'ecosistema-soluciones', 'index.html'));
  for (const match of html.matchAll(/<img\s+src="\.\.\/assets\/([^"]+\.webp)"\s+srcset="([^"]+)"\s+sizes="([^"]+)"\s+alt="([^"]+)"\s+width="(\d+)"\s+height="(\d+)"\s+loading="lazy"/g)) {
    const [, name, srcset, sizes, alt, width, height] = match;
    const file = path.join(root, 'assets', name);
    assert.ok(fs.existsSync(file), name);
    assert.ok(fs.statSync(file).size < 250 * 1024, `${name} < 250 KB`);
    assert.ok(alt.length > 20);
    assert.match(srcset, /-480\.webp 480w/);
    assert.match(srcset, /-768\.webp 768w/);
    assert.match(sizes, /\d+vw/);
    for (const variant of srcset.split(',').map((item) => item.trim().split(' ')[0])) {
      const variantFile = path.join(root, 'ecosistema-soluciones', variant);
      assert.ok(fs.existsSync(variantFile), variant);
      assert.ok(fs.statSync(variantFile).size < 180 * 1024, variant);
    }
    assert.equal(Number(width), 960);
    assert.equal(Number(height), 720);
  }
  assert.equal((html.match(/<img\s+src="\.\.\/assets\/[^\"]+\.webp"/g) || []).length, 45);
  assert.doesNotMatch(html, /cdn\.openart\.ai/);
});

function luminance(hex) {
  const channels = hex.match(/[a-f\d]{2}/gi).map((value) => parseInt(value, 16) / 255).map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}
const contrast = (a, b) => (Math.max(luminance(a), luminance(b)) + 0.05) / (Math.min(luminance(a), luminance(b)) + 0.05);

test('pares cromaticos principales superan contraste WCAG AA', () => {
  assert.ok(contrast('0f172a', 'f8fafc') >= 4.5, 'texto principal');
  assert.ok(contrast('53657c', 'f8fafc') >= 4.5, 'texto secundario');
  assert.ok(contrast('0369a1', 'ffffff') >= 4.5, 'CTA azul');
  assert.ok(contrast('ffffff', '0f172a') >= 4.5, 'CTA oscuro');
  assert.ok(contrast('cbd5e1', '172236') >= 4.5, 'formulario oscuro');
});

test('no hay ids duplicados y los campos tienen etiqueta', () => {
  const html = read(path.join(root, 'ecosistema-soluciones', 'index.html'));
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const [, id] of html.matchAll(/<(?:input|textarea)[^>]+id="([^"]+)"[^>]*>/g)) {
    if (id.startsWith('quote-') && ['quote-category', 'quote-niche', 'quote-application', 'quote-origin'].includes(id)) continue;
    assert.match(html, new RegExp(`<label[^>]+for="${id}"`), id);
  }
});

test('el hero recupera visibilidad si la animacion externa se interrumpe', () => {
  const animations = read(path.join(root, 'assets', 'animations.js'));
  assert.match(animations, /setTimeout\(ensureHeroVisible, 2000\)/);
  assert.match(animations, /removeProperty\('opacity'\)/);
});
