import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const app = path.join(root, 'generador-llaveros-3d', 'assets', 'app');
const sandbox = {module: {exports: {}}, exports: {}, console};
vm.runInNewContext(fs.readFileSync(path.join(app, 'exportadores.js'), 'utf8'),
  sandbox, {filename: 'exportadores.js'});
const {patchProjectSettings} = sandbox.module.exports;
const plantilla = JSON.parse(fs.readFileSync(path.join(app, 'perfil-bambu.json'), 'utf8'));

/** Los huecos de filamento que declara el archivo, y el tamaño de su matriz. */
function medir(groups) {
  const cfg = JSON.parse(patchProjectSettings(plantilla, groups));
  return {
    huecos: cfg.filament_colour.length,
    matriz: cfg.flush_volumes_matrix.length,
    vector: cfg.flush_volumes_vector.length,
    colores: cfg.filament_colour,
  };
}

test('la matriz de purga siempre cuadra con los filamentos que declara el archivo', () => {
  /* Bambu Studio valida project_settings.config al abrir. Una matriz de purga
     que no sea exactamente n×n para los n huecos de filament_colour deja el
     archivo INCONSISTENTE: el cargador lo rechaza entero y con él se pierden de
     golpe todos los ajustes de calidad —planchado, paredes arachne, contorno
     lento—. La pieza se imprime con los ajustes de fábrica y sale rugosa, sin
     que nada avise.

     Pasó de verdad: la plantilla trae 3 huecos y un llavero de dos colores
     generaba una matriz de 2×2 para 3 filamentos declarados. */
  for (const n of [1, 2, 3, 4, 5]) {
    const groups = Array.from({length: n}, (_, i) => ({color: ['#6BB3FF', '#FFFFFF', '#1E1D1D', '#E2170E', '#F8C701'][i]}));
    const r = medir(groups);
    assert.equal(r.matriz, r.huecos * r.huecos,
      `con ${n} grupo(s): el archivo declara ${r.huecos} filamentos y la matriz trae ${r.matriz} entradas`);
    assert.equal(r.vector, r.huecos * 2, `con ${n} grupo(s): flush_volumes_vector descuadrado`);
  }
});

test('purgar de oscuro a claro cuesta más que al revés', () => {
  /* Tapar negro con blanco necesita mucho más material que blanco con negro.
     Si la matriz fuera simétrica, el color claro arrancaría teñido del anterior
     y el logotipo saldría sucio. */
  const cfg = JSON.parse(patchProjectSettings(plantilla, [{color: '#1E1D1D'}, {color: '#FFFFFF'}]));
  const n = cfg.filament_colour.length;
  const m = cfg.flush_volumes_matrix.map(Number);
  const negroAblanco = m[0 * n + 1];
  const blancoAnegro = m[1 * n + 0];
  assert.ok(negroAblanco > blancoAnegro * 1.5,
    `negro→blanco ${negroAblanco} debería costar bastante más que blanco→negro ${blancoAnegro}`);
  assert.equal(m[0], 0, 'la diagonal no purga: es el mismo filamento');
});
