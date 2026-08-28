import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = fs.readFileSync(
  path.join(root, 'generador-llaveros-3d', 'assets', 'app', 'geometria.js'),
  'utf8',
);
const sandbox = {module: {exports: {}}, exports: {}};
vm.runInNewContext(source, sandbox, {filename: 'geometria.js'});
const {leftFilledAnchor} = sandbox.module.exports;

test('el aro se ancla al material presente a su altura, no al remate global de una cursiva', () => {
  // Un remate aislado sobresale hasta X=0 sólo en la zona baja. El cuerpo
  // principal que cruza la altura del aro comienza en X=10.
  const flourish = [[0, 0], [2, 0], [2, 2], [0, 2]];
  const body = [[10, 0], [30, 0], [30, 10], [10, 10]];

  const anchor = leftFilledAnchor([flourish, body], 5);

  assert.ok(anchor.x >= 9.9 && anchor.x <= 10.2, `anclaje X inesperado: ${anchor.x}`);
  assert.equal(anchor.y, 5);
});

test('el anclaje busca la altura llena más cercana si la preferida cae en un hueco', () => {
  const lowerStroke = [[4, 0], [12, 0], [12, 2], [4, 2]];
  const upperStroke = [[7, 8], [15, 8], [15, 10], [7, 10]];

  const anchor = leftFilledAnchor([lowerStroke, upperStroke], 5);

  assert.ok(anchor.y < 2.1 || anchor.y > 7.9, `el anclaje quedó en aire: ${anchor.y}`);
  assert.ok(anchor.x >= 3.9);
});

test('con dos renglones el aro se queda en el que se le pide, no en el más largo', () => {
  /* Con salto de línea el aro cuelga del PRIMER renglón, arriba, como en un
     llavero de verdad. Antes se apuntaba al centro vertical del bloque entero y
     caía en el hueco entre los dos, montándose sobre las letras de abajo.
     El renglón de abajo suele ser el más largo -«Barbosa» empieza más a la
     izquierda que «Adriel»-, así que el anclaje no puede irse al material más a
     la izquierda: tiene que respetar la altura que se le pide. */
  const arriba = [[10, 20], [40, 20], [40, 30], [10, 30]];   // renglón corto
  const abajo = [[0, 0], [50, 0], [50, 10], [0, 10]];        // renglón largo
  const a = leftFilledAnchor([arriba, abajo], 25);           // centro del de arriba
  assert.ok(a.y >= 20 && a.y <= 30, `el aro se fue a y=${a.y}, fuera del renglón de arriba`);
  // atY muestrea cada 0.12 mm, así que devuelve el primer punto lleno, no el borde exacto.
  assert.ok(Math.abs(a.x - 10) < 0.25,
    `el aro se ancló en x=${a.x}: se fue al renglón largo en vez de al que se le pidió`);

  // y si se le pide el de abajo, va al de abajo
  const b = leftFilledAnchor([arriba, abajo], 5);
  assert.ok(b.y >= 0 && b.y <= 10, `el aro se fue a y=${b.y}`);
  assert.ok(Math.abs(b.x) < 0.25, `el aro se ancló en x=${b.x}`);
});
