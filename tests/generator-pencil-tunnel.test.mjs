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
const {
  teardropProfile, roundProfile, pencilBodyTopZ, teardropAreaMM2, circularSegmentAreaMM2,
  normalizePencilCapEnd, normalizePencilTunnelStyle, pencilCapPlacement, capCoverageLimitX,
  estimatePencilVolumeMM3, signedArea,
} = sandbox.module.exports;

test('el perfil de lágrima es simétrico y sus extremos son los teóricos', () => {
  const prof = teardropProfile(5, 7, 48);
  // Cada punto [y, z] debe tener su espejo [-y, z]: el techo a 45° y el arco
  // de 270° son simétricos respecto al eje vertical del túnel.
  for (const [y, z] of prof) {
    const mirrored = prof.some(([my, mz]) => Math.abs(my + y) < 1e-9 && Math.abs(mz - z) < 1e-9);
    assert.ok(mirrored, `el punto [${y}, ${z}] no tiene espejo`);
  }
  const zs = prof.map(p => p[1]);
  assert.ok(Math.abs(Math.min(...zs) - 2) < 1e-9, 'el fondo debe quedar en centerZ - r');
  assert.ok(Math.abs(Math.max(...zs) - (7 + 5 * Math.SQRT2)) < 1e-9, 'el ápice debe quedar en centerZ + √2·r');
  assert.equal(prof[0][0], 0, 'el primer punto es el ápice del techo');
});

test('el área analítica de la lágrima coincide con el shoelace del perfil', () => {
  // El polígono es inscrito (subestima levemente el arco); con 96 pasos la
  // diferencia debe ser despreciable frente al 1 + 3π/4 analítico.
  const byShoelace = Math.abs(signedArea(teardropProfile(5, 0, 96)));
  const analytic = teardropAreaMM2(5);
  const relError = Math.abs(byShoelace - analytic) / analytic;
  assert.ok(relError < 0.006, `error relativo ${relError} demasiado alto`);
});

test('la migración de la casilla booleana heredada honra su etiqueta: "tapar el FINAL"', () => {
  // La casilla vieja decía "Tapar el final del túnel" aunque el código de
  // entonces macizara el arranque; el usuario definió que tapado = donde
  // TERMINA el nombre, así que true migra a 'end'.
  assert.equal(normalizePencilCapEnd({pencilClosedEnd: true}), 'end');
  assert.equal(normalizePencilCapEnd({pencilClosedEnd: false}), 'open');
  assert.equal(normalizePencilCapEnd({pencilCapEnd: 'start'}), 'start');
  assert.equal(normalizePencilCapEnd({pencilCapEnd: 'banana'}), 'open');
  assert.equal(normalizePencilCapEnd({}), 'open');
});

test('la forma del hueco se normaliza y el círculo rebaja la altura del cuerpo', () => {
  assert.equal(normalizePencilTunnelStyle({pencilTunnelStyle: 'round'}), 'round');
  assert.equal(normalizePencilTunnelStyle({pencilTunnelStyle: 'otra'}), 'teardrop');
  assert.equal(normalizePencilTunnelStyle({}), 'teardrop');
  // Con outerR 5.7: lágrima llega a centerZ + √2·r; el círculo solo a centerZ + r.
  assert.ok(Math.abs(pencilBodyTopZ('teardrop', 5.7, 5.7) - 5.7 * (1 + Math.SQRT2)) < 1e-9);
  assert.ok(Math.abs(pencilBodyTopZ('round', 5.7, 5.7) - 11.4) < 1e-9);
});

test('el perfil redondo es un círculo cerrado del radio pedido', () => {
  const prof = roundProfile(4.3, 5.7, 48);
  for (const [y, z] of prof) {
    const r = Math.hypot(y, z - 5.7);
    assert.ok(Math.abs(r - 4.3) < 1e-9, `radio inesperado: ${r}`);
  }
  const area = Math.abs(signedArea(prof));
  const relError = Math.abs(area - Math.PI * 4.3 * 4.3) / (Math.PI * 4.3 * 4.3);
  assert.ok(relError < 0.01, `área del círculo fuera de tolerancia: ${relError}`);
});

test("la tapa en 'end' es el espejo de 'start': recorta tubeEnd y apaga su boca", () => {
  const place = pencilCapPlacement('end', 0, 40, 5.7);
  // capLen = max(2.2, 5.7·0.55) = 3.135 → la tapa ocupa el tramo final.
  assert.equal(place.capX1, 40);
  assert.ok(Math.abs(place.capX0 - 36.865) < 1e-9, `capX0 inesperado: ${place.capX0}`);
  assert.ok(Math.abs(place.tubeEnd - 37.215) < 1e-9, `tubeEnd inesperado: ${place.tubeEnd}`);
  assert.equal(place.tubeStart, 0, 'el arranque del túnel no debe moverse');
  assert.equal(place.exitLead, false, 'el lado tapado no lleva boca ensanchada');
  assert.equal(place.entryLead, true, 'el lado abierto conserva su boca');

  // 'open' debe devolver el contrato intacto: es la garantía de que la
  // geometría sin tapa queda idéntica a la validada antes de este cambio.
  const open = pencilCapPlacement('open', 0, 40, 5.7);
  assert.equal(open.capX0, null);
  assert.equal(open.tubeStart, 0);
  assert.equal(open.tubeEnd, 40);
  assert.equal(open.entryLead, true);
  assert.equal(open.exitLead, true);
});

test('con un túnel muy corto la tapa en cualquier extremo deja al menos 1.35 mm de túnel', () => {
  const end = pencilCapPlacement('end', 0, 3, 5.7);
  assert.equal(end.capX0, 1.0);
  assert.ok(Math.abs(end.tubeEnd - 1.35) < 1e-9, `tubeEnd inesperado: ${end.tubeEnd}`);
  const start = pencilCapPlacement('start', 0, 3, 5.7);
  assert.equal(start.capX1, 2.0);
  assert.ok(Math.abs(start.tubeStart - 1.65) < 1e-9, `tubeStart inesperado: ${start.tubeStart}`);
  assert.ok(start.tubeEnd - start.tubeStart >= 1.35 - 1e-9);
});

test('la cobertura de la tapa detecta dónde la silueta vuelve a envolver el tubo', () => {
  // Silueta sintética: rectángulo alto (x 0..30, y ±10) que se estrecha en
  // triángulo hasta la punta (x 40, y 0), como la última letra de un nombre.
  const silueta = [[0, -10], [30, -10], [40, 0], [30, 10], [0, 10]];
  // Tubo de outerR 5.7 centrado en y=0: queda envuelto cuando la media
  // altura del triángulo supera 5.8 → x ≤ 34.2.
  const covered = capCoverageLimitX([silueta], 0, 5.8, 40, 20, 0.4);
  assert.ok(covered !== null, 'debería encontrar cobertura');
  assert.ok(covered <= 34.21 && covered >= 33.4, `cobertura inesperada: ${covered}`);
  // En la punta misma nunca hay cobertura: el rango corto devuelve null.
  assert.equal(capCoverageLimitX([silueta], 0, 5.8, 40, 36, 0.4), null);
  // Un agujero (paridad par) anula la cobertura aunque el contorno la dé.
  const agujero = [[24, -6], [28, -6], [28, 6], [24, 6]];
  const conAgujero = capCoverageLimitX([silueta, agujero], 0, 5.8, 40, 20, 0.4);
  assert.ok(conAgujero === null || conAgujero < 24 || conAgujero > 28.1,
    `la cobertura cayó dentro del agujero: ${conAgujero}`);
});

test('el volumen estimado de un caso sintético cae en el rango esperado en gramos', () => {
  const outerR = 5.7, innerR = 4.3, skin = 1.4, tubeLen = 55;
  const totalZ = outerR * (1 + Math.SQRT2);
  const V = estimatePencilVolumeMM3({
    wingsArea: 180, bandArea: 420, capArea: 0, textArea: 200,
    plugLen: 0, outerR, innerR, skin, totalZ, tubeLen, raisedHeight: 1.4,
  });
  // Esperanza recalculada con las mismas cerradas: el test protege el ensamble
  // de la fórmula (términos y correcciones), no las funciones de área en sí.
  const ring = teardropAreaMM2(outerR) - teardropAreaMM2(innerR);
  const overlap = circularSegmentAreaMM2(outerR, skin) + skin * skin;
  const expected = 180 * totalZ + 420 * 2 * skin + (ring - overlap) * tubeLen + 200 * 1.4;
  assert.ok(Math.abs(V - expected) / expected < 0.01, `V=${V} esperado≈${expected}`);
  const grams = V * 1.24 / 1000;
  assert.ok(grams > 7.2 && grams < 7.7, `gramos fuera de rango: ${grams}`);
});
