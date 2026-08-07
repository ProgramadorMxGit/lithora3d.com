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
