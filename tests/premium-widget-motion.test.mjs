import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (...segments) => fs.readFileSync(path.join(root, ...segments), 'utf8');
const css = read('assets', 'motion-pages.css');
const engine = read('assets', 'motion-pages.js');
const solutions = read('ecosistema-soluciones', 'ecosistema.js');
const pages = {
  prices: read('precios-impresion-3d', 'index.html'),
  prototype: read('prototipado-rapido', 'index.html'),
  materials: read('materiales-impresion-3d', 'index.html'),
  solutions: read('ecosistema-soluciones', 'index.html')
};

const expected = [
  ...Array.from({ length: 8 }, (_, index) => `PRI-W${String(index + 1).padStart(2, '0')}`),
  ...Array.from({ length: 7 }, (_, index) => `PRO-W${String(index + 1).padStart(2, '0')}`),
  ...Array.from({ length: 7 }, (_, index) => `MAT-W${String(index + 1).padStart(2, '0')}`),
  ...Array.from({ length: 22 }, (_, index) => `SOL-W${String(index + 1).padStart(2, '0')}`)
];

const contractIds = () => [...new Set(Object.values(pages).flatMap((html) =>
  [...html.matchAll(/data-motion-widget="([A-Z]+-W\d{2})"/g)].map((match) => match[1])
))].sort();

test('los 44 widgets nominales están presentes y no aparece ningún contrato fuera de catálogo', () => {
  assert.deepEqual(contractIds(), [...expected].sort());
  assert.equal(contractIds().length, 44);
  for (const id of expected) assert.match(engine, new RegExp(`['"]${id}['"]`), `${id} no está registrado`);
});

test('el generador conserva los contratos de cada fragmento dinámico de Soluciones', () => {
  const renderer = read('scripts', 'render-ecosystem.mjs');
  for (const id of ['SOL-W10', 'SOL-W11', 'SOL-W12', 'SOL-W13', 'SOL-W14', 'SOL-W15']) {
    assert.match(renderer, new RegExp(id));
  }
  assert.match(renderer, /renderApplications\(record\.applications, 'application-list', record\.applications\.length, 'SOL-W12'\)/);
});

test('el registro mantiene la distribución aprobada 19 A, 13 B, 10 C y 2 D', () => {
  const level = (name) => {
    const body = engine.match(new RegExp(`${name}: new Set\\(\\[([^\\]]*)\\]\\)`))?.[1] || '';
    return [...body.matchAll(/[A-Z]+-W\d{2}/g)].map((match) => match[0]);
  };
  assert.equal(level('A').length, 19);
  assert.equal(level('B').length, 13);
  assert.equal(level('C').length, 10);
  assert.equal(level('D').length, 2);
  assert.deepEqual([...new Set(['A', 'B', 'C', 'D'].flatMap(level))].sort(), [...expected].sort());
});

test('usa un observer compartido, diez listeners como máximo y lifecycle cancelable', () => {
  assert.equal((engine.match(/new IntersectionObserver/g) || []).length, 1);
  assert.ok((engine.match(/^  listen\(/gm) || []).length <= 10);
  for (const event of ['visibilitychange', 'resize', 'orientationchange', 'pagehide']) assert.match(engine, new RegExp(event));
  assert.match(engine, /if \(event\.persisted\)/);
  assert.match(engine, /listen\(window, 'pagehide', handlePageHide\)/);
  assert.match(engine, /observer\?\.disconnect\(\)/);
  assert.match(engine, /activeAnimations\.forEach\(\(animation\) => animation\.cancel\(\)\)/);
  assert.match(engine, /listeners\.splice\(0\)\.forEach/);
  assert.match(engine, /dataset\.lithoraMotionReady === 'true'/);
});

test('limita cada timeline a ocho nodos desktop y cinco en compacto', () => {
  assert.match(engine, /compact\(\) \? 5 : 8/);
  assert.match(engine, /\.slice\(0, maxNodes\(\)\)/);
  assert.match(engine, /Math\.min\(options\.distance \|\| 14, 20\)/);
  assert.match(engine, /Math\.min\(options\.stagger \|\| 45, 65\)/);
  assert.doesNotMatch(`${css}\n${engine}`, /infinite|requestAnimationFrame\([^)]*requestAnimationFrame/i);
});

test('Spotlight, Border Glow y relación Bento comparten una capa localizada y guards de puntero', () => {
  assert.match(css, /Spotlight Card \+ restrained Border Glow \+ shared group relation/);
  assert.match(css, /radial-gradient\(180px circle at var\(--spot-x\) var\(--spot-y\)/);
  assert.match(css, /@media \(hover: hover\) and \(pointer: fine\)/);
  assert.match(css, /:focus-within\)::after/);
  assert.match(css, /aria-current="true"/);
  assert.match(engine, /data-motion-signature="tactile-swatch"/);
  assert.match(engine, /data-motion-signature="spotlight-origin"/);
  assert.doesNotMatch(`${css}\n${engine}`, /perspective\(|magnet|particle|canvas|WebGL/i);
  const materialCards = pages.materials.match(/<article class="feature-card[^>]*tabindex="0"/g) || [];
  assert.equal(materialCards.length, 6);
});

test('los contratos decorativos no sobrescriben el posicionamiento funcional del mapa', () => {
  const globalContractRule = css.match(/body\[data-motion-page\] \[data-motion-widget\] \{([^}]*)\}/)?.[1] || '';
  assert.doesNotMatch(globalContractRule, /position\s*:/);
  assert.match(read('ecosistema-soluciones', 'ecosistema.css'), /\.map-category-list \{ position: absolute;/);
});

test('Specular Button y Glare Hover son finitos y permanecen en superficies aprobadas', () => {
  assert.match(css, /Specular Button: local, finite and exclusive to approved conversion surfaces/);
  assert.match(css, /lithora-glare/);
  for (const [page, id] of [['prices', 'PRI-W08'], ['prototype', 'PRO-W07'], ['materials', 'MAT-W07'], ['solutions', 'SOL-W21']]) {
    assert.match(pages[page], new RegExp(`data-motion-widget="${id}"[^>]*data-motion-signature="specular-cta"`));
  }
  assert.match(pages.solutions, /data-image-type="conceptual"/);
  assert.doesNotMatch(css, /animation[^;{]*infinite/i);
  assert.equal((pages.solutions.match(/Ejemplo conceptual/g) || []).length > 0, true);
});

test('reduced motion, touch y ausencia de JS preservan contenido y estado final', () => {
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /@media \(max-width: 767px\), \(pointer: coarse\)/);
  assert.match(css, /animation-duration: \.001ms !important/);
  assert.match(css, /animation-iteration-count: 1 !important/);
  assert.match(css, /transform: none !important/);
  assert.doesNotMatch(css, /\.motion-enhanced[^\{]*\{[^}]*opacity\s*:\s*0/);
  assert.match(engine, /!\('IntersectionObserver' in window\)/);
  assert.match(engine, /typeof element\?\.animate === 'function'/);
});

test('ningún H1 se convierte en nodo animado y todos siguen siendo únicos', () => {
  for (const [page, html] of Object.entries(pages)) {
    assert.equal((html.match(/<h1\b/g) || []).length, 1, `${page} debe tener un H1`);
    assert.doesNotMatch(html, /<h1[^>]*data-motion-widget/);
  }
  assert.doesNotMatch(engine, /querySelectorAll\([^)]*h1/);
});

test('menú, detalle, contexto y estados de cotización usan el controlador único', () => {
  for (const method of ['openMenu', 'closeMenu', 'closeDetail', 'updateContext', 'updateFormState']) {
    assert.match(engine, new RegExp(`${method}\\(`));
    assert.match(solutions, new RegExp(`LithoraMotionController(?:\\?\\.|\\.)${method}`));
  }
  assert.match(solutions, /event\.key === 'Escape'/);
  assert.match(solutions, /event\.key !== 'Tab'/);
  assert.match(solutions, /button\.focus\(\{ preventScroll: true \}\)/);
  assert.match(solutions, /menuButton\.focus\(\{ preventScroll: true \}\)/);
  assert.doesNotMatch(solutions, /detail\.animate\(/);
});

test('la integración no incorpora dependencias, CDN, React Bits, GSAP, canvas ni WebGL', () => {
  const sources = `${engine}\n${Object.values(pages).join('\n')}`;
  assert.doesNotMatch(engine, /\bimport\s|https?:\/\//);
  assert.doesNotMatch(sources, /\bReact\b|reactbits|\bgsap\b|\bScrollTrigger\b|<canvas|WebGL/i);
  assert.doesNotMatch(sources, /cdn\.tailwindcss\.com/);
  for (const [page, stylesheet] of [['prices', 'tailwind-prices.css'], ['prototype', 'tailwind-prototype.css'], ['materials', 'tailwind-materials.css']]) {
    assert.match(pages[page], new RegExp(`href="\\.\\.\\/assets\\/${stylesheet.replace('.', '\\.')}"`));
    assert.ok(fs.statSync(path.join(root, 'assets', stylesheet)).size > 8000);
  }
  const packageJson = JSON.parse(read('package.json'));
  assert.equal(packageJson.dependencies, undefined);
  assert.equal(packageJson.devDependencies, undefined);
});

test('el paquete premium queda dentro de 35 KB sin minificar', () => {
  const bytes = fs.statSync(path.join(root, 'assets', 'motion-pages.css')).size
    + fs.statSync(path.join(root, 'assets', 'motion-pages.js')).size;
  assert.ok(bytes <= 35 * 1024, `${bytes} bytes exceden 35 KB`);
});
