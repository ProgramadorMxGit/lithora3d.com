import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), 'utf8');
const home = read('index.html');
const quote = read('cotizar', 'index.html');
const homeStyles = read('assets', 'styles.css');
const quoteStyles = read('assets', 'quote-page.css');
const transition = read('assets', 'quote-transition.js');

test('los dos CTA principales abren la página de cotización con transición', () => {
  const animatedLinks = [...home.matchAll(/<a[^>]+href="\/cotizar\/"[^>]+data-quote-link[^>]*>/g)];
  assert.equal(animatedLinks.length, 2);
  assert.match(home, /src="\/assets\/quote-transition\.js"[^>]*defer/);
  assert.match(transition, /querySelectorAll\('\[data-quote-link\]'\)/);
  assert.match(transition, /window\.location\.assign\(link\.href\)/);
  assert.match(homeStyles, /\.quote-transition-layer\s*\{/);
  assert.match(homeStyles, /prefers-reduced-motion:\s*reduce/);
});

test('la portada deja de duplicar el formulario y todos sus CTA usan la ruta nueva', () => {
  assert.doesNotMatch(home, /href="#cotizar"/);
  assert.doesNotMatch(home, /id="cotizar"/);
  assert.doesNotMatch(home, /tally\.so\/embed\/ODeE7a/);
  assert.doesNotMatch(home, /id="cotizar-form"/);
  assert.ok((home.match(/href="\/cotizar\/"/g) || []).length >= 10);
});

test('la ruta de cotización conserva el formulario real en la columna derecha', () => {
  assert.match(quote, /<link rel="canonical" href="https:\/\/lithora3d\.com\/cotizar\/">/);
  assert.match(quote, /id="formulario-cotizacion"/);
  assert.match(quote, /https:\/\/tally\.so\/embed\/ODeE7a\?[^"\s]*dynamicHeight=1/);
  assert.match(quote, /title="Formulario de solicitud de cotización de Lithora3D"/);
  assert.match(quote, /src="https:\/\/tally\.so\/widgets\/embed\.js"[^>]*defer/);
});

test('la columna izquierda queda preparada para reemplazarla por el timelapse', () => {
  assert.match(quote, /data-animation-slot="print-timelapse"/);
  assert.match(quote, /Espacio listo para el timelapse de impresión/);
  assert.match(quoteStyles, /grid-template-columns:\s*minmax\(0,\s*1\.05fr\)\s+minmax\(520px,\s*\.95fr\)/);
  assert.match(quoteStyles, /\.quote-visual\s*\{[\s\S]*?position:\s*sticky/);
  assert.match(quoteStyles, /@media \(max-width:\s*880px\)/);
});
