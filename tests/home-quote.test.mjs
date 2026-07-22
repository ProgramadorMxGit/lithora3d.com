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
  assert.doesNotMatch(quote, /\s+src="https:\/\/tally\.so\/embed\/ODeE7a/);
  assert.match(quote, /data-tally-src="https:\/\/tally\.so\/embed\/ODeE7a\?[^"\s]*dynamicHeight=1"/);
  assert.match(quote, /title="Formulario de solicitud de cotización de Lithora3D"/);
  assert.match(quote, /src="https:\/\/tally\.so\/widgets\/embed\.js"[^>]*defer/);
  assert.match(quoteStyles, /\.quote-tally-frame\s*\{[^}]*min-height:\s*0;[^}]*background:\s*#0b1728/);
});

test('la columna izquierda queda preparada para reemplazarla por el timelapse', () => {
  assert.match(quote, /data-animation-slot="print-timelapse"/);
  assert.match(quote, /Tu idea toma forma, capa por capa\./);
  assert.doesNotMatch(quote, /Vista del proceso/);
  assert.match(quoteStyles, /grid-template-columns:\s*minmax\(620px,\s*1\.22fr\)\s+minmax\(500px,\s*\.78fr\)/);
  assert.match(quoteStyles, /min-height:\s*clamp\(560px,\s*72vh,\s*720px\)/);
  assert.match(quoteStyles, /\.quote-visual__copy\s*\{[\s\S]*?display:\s*none/);
  assert.match(quoteStyles, /@media \(max-width:\s*880px\)[\s\S]*?\.quote-visual__copy\s*\{\s*display:\s*block/);
  assert.match(quoteStyles, /\.quote-media-slot\s*\{[\s\S]*?border:\s*0;[\s\S]*?background:\s*transparent;[\s\S]*?box-shadow:\s*none/);
  assert.match(quoteStyles, /\.quote-visual\s*\{[\s\S]*?position:\s*sticky/);
  assert.match(quoteStyles, /@media \(max-width:\s*880px\)/);
});
