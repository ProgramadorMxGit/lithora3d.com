import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = fs.readFileSync(
  path.join(root, 'generador-llaveros-3d', 'assets', 'app', 'exportadores.js'),
  'utf8',
);
const sandbox = {module: {exports: {}}, exports: {}};
vm.runInNewContext(source, sandbox, {filename: 'exportadores.js'});
const {colourChangeLayer} = sandbox.module.exports;

test('con el grosor en la rejilla, el cambio cae donde dice el grosor', () => {
  // 2.4 / 0.2 da 11.999999999999998 en coma flotante: sin el epsilon esto
  // pediría 13 capas de base y mandaría el cambio a 2.60.
  const r = colourChangeLayer(2.4, 0.2);
  assert.equal(r.baseLayers, 12);
  assert.equal(Number(r.z.toFixed(2)), 2.4);
  assert.equal(r.firstTopLayer, 13);
  assert.equal(r.aligned, true);
});

test('fuera de la rejilla el cambio SUBE a la siguiente frontera de capa', () => {
  // Medido laminando con la CLI de Bambu Studio: con base 2.5 y capas de 0.2,
  // la cara superior del color de abajo se imprime en z=2.60, no en 2.40. El
  // cálculo con floor devolvía la capa 13 y dejaba una capa entera del color
  // de arriba sobre la base.
  const r = colourChangeLayer(2.5, 0.2);
  assert.equal(r.baseLayers, 13);
  assert.equal(Number(r.z.toFixed(2)), 2.6);
  assert.equal(r.firstTopLayer, 14);
  assert.equal(r.aligned, false);
});

test('el deslizador de grosor va en pasos de 0.1: ningún valor se queda corto', () => {
  // El aviso nunca debe mandar a cambiar el rollo por debajo del grosor pedido:
  // eso mete color de arriba dentro de la base.
  for (const lh of [0.08, 0.12, 0.2]) {
    for (let g = 1.6; g <= 5.0001; g += 0.1) {
      const z = Number(g.toFixed(1));
      const r = colourChangeLayer(z, lh);
      assert.ok(r.z >= z - 1e-6, `grosor ${z} con capas de ${lh}: el cambio caería en ${r.z}`);
      assert.ok(r.z < z + lh, `grosor ${z} con capas de ${lh}: el cambio se pasa más de una capa (${r.z})`);
      assert.equal(r.firstTopLayer, r.baseLayers + 1);
    }
  }
});

test('alturas de capa que dividen exacto quedan alineadas', () => {
  assert.equal(colourChangeLayer(2.4, 0.12).aligned, true);   // 20 capas justas
  assert.equal(colourChangeLayer(2.4, 0.08).aligned, true);   // 30 capas justas
  assert.equal(colourChangeLayer(2.5, 0.12).aligned, false);  // 20.83 -> 21 capas
});

test('entradas inválidas no rompen el aviso', () => {
  for (const [z, lh] of [[0, 0.2], [-1, 0.2], [2.4, 0], [NaN, 0.2], [2.4, NaN]]) {
    const r = colourChangeLayer(z, lh);
    assert.equal(r.firstTopLayer, 1);
    assert.equal(r.z, 0);
  }
});
