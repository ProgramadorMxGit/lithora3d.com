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
const {JERSEY, jerseySilhouette, placeTextPolys, polysBounds} = sandbox.module.exports;

/** Medio ancho de la silueta a la altura `y`, cruzando sus aristas. */
function halfWidthAt(pts, y) {
  let max = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % pts.length];
    if ((y1 - y) * (y2 - y) > 0) continue;      // la arista no cruza esa altura
    if (y1 === y2) continue;
    const x = x1 + (x2 - x1) * (y - y1) / (y2 - y1);
    max = Math.max(max, Math.abs(x));
  }
  return max;
}

const W = 40, H = W * JERSEY.aspect;
const shirt = jerseySilhouette(W, H);

test('la silueta ocupa exactamente el ancho y el alto pedidos', () => {
  const b = polysBounds([shirt]);
  assert.ok(Math.abs(b.width - W) < 1e-9, `ancho ${b.width}`);
  assert.ok(Math.abs(b.height - H) < 1e-9, `alto ${b.height}`);
});

test('lo más ancho es la manga, no el bajo: si no, la pieza parece una campana', () => {
  // El primer intento tenía la sisa por debajo del filo de la manga y el cuerpo
  // muy acampanado: el bajo salía más ancho que los hombros y la silueta se
  // leía como un vestido, no como una camiseta.
  const enManga = halfWidthAt(shirt, H * (JERSEY.sleeveTopY + JERSEY.sleeveBotY) / 2);
  const enBajo = halfWidthAt(shirt, -H * 0.45);
  assert.ok(enManga > enBajo * 1.4,
    `la manga (${enManga.toFixed(1)}) debe destacar sobre el bajo (${enBajo.toFixed(1)})`);
});

test('la sisa deja una muesca clara entre la manga y el cuerpo', () => {
  const manga = halfWidthAt(shirt, H * JERSEY.sleeveBotY + H * 0.01);
  const pecho = halfWidthAt(shirt, H * JERSEY.armpitY - H * 0.01);
  assert.ok(manga - pecho > W * 0.15,
    `salto en la sisa de solo ${(manga - pecho).toFixed(1)} mm sobre ${W} mm de ancho`);
});

test('el nombre y el número caben en el pecho con su contorno incluido', () => {
  // El borde del número llegaba a tocar la sisa y se recortaba contra la manga:
  // las franjas tienen que caber CON el contorno, no solo el texto.
  const casos = [
    {cy: JERSEY.nameCY, w: JERSEY.nameW, cap: JERSEY.nameH, k: JERSEY.nameOutline, que: 'nombre'},
    {cy: JERSEY.numCY, w: JERSEY.numW, cap: JERSEY.numH, k: JERSEY.numOutline, que: 'número'},
  ];
  for (const c of casos) {
    const contorno = Math.max(JERSEY.minOutline, H * c.cap * c.k);
    const medio = (W * c.w) / 2 + contorno;
    // Se mide en el borde superior e inferior de la franja, no solo en su
    // centro: el pecho se estrecha hacia arriba y el texto es alto.
    for (const y of [H * c.cy - H * c.cap / 2, H * c.cy, H * c.cy + H * c.cap / 2]) {
      const disponible = halfWidthAt(shirt, y);
      assert.ok(medio <= disponible,
        `el ${c.que} pide ${medio.toFixed(1)} mm y a y=${y.toFixed(1)} solo hay ${disponible.toFixed(1)}`);
    }
  }
});

test('el texto solo se encoge para caber, nunca se estira', () => {
  const corto = [[[-2, 0], [2, 0], [2, 1], [-2, 1]]];
  const igual = placeTextPolys(corto, 5, 4);
  assert.ok(Math.abs(polysBounds(igual).width - 4) < 1e-9, 'no debe crecer al ancho de la franja');
  assert.ok(Math.abs((polysBounds(igual).minY + polysBounds(igual).maxY) / 2 - 5) < 1e-9);

  const largo = [[[-10, 0], [10, 0], [10, 1], [-10, 1]]];
  const encogido = placeTextPolys(largo, 0, 8);
  assert.ok(Math.abs(polysBounds(encogido).width - 8) < 1e-9, 'debe encogerse hasta la franja');
});

/* ---------------------------------------------------------------- *
 * Plantillas trazadas (assets/plantillas/camisetas.json)
 * ---------------------------------------------------------------- */

const plantillas = JSON.parse(fs.readFileSync(
  path.join(root, 'generador-llaveros-3d', 'assets', 'plantillas', 'camisetas.json'), 'utf8'));

const areaAnillo = ring => Math.abs(ring.reduce((s, [x, y], i) => {
  const [nx, ny] = ring[(i + 1) % ring.length];
  return s + x * ny - nx * y;
}, 0)) / 2;
const areaPoly = poly => areaAnillo(poly[0]) - poly.slice(1).reduce((s, h) => s + areaAnillo(h), 0);
const areaPartes = partes => partes.reduce((s, p) => s + areaPoly(p), 0);

test('la plantilla declara todo lo que la app necesita para construirla', () => {
  assert.equal(plantillas.version, 1);
  assert.ok(plantillas.plantillas.length >= 1);
  for (const t of plantillas.plantillas) {
    for (const k of ['id', 'nombre', 'anchoRel', 'altoRef', 'colores', 'aro', 'silueta',
      'tintas', 'admiteDorsal']) {
      assert.ok(t[k] !== undefined, `${t.id} no trae ${k}`);
    }
    assert.ok(t.aro.r > 0 && t.altoRef > 0, `${t.id}: aro o alto de referencia sin medida`);
    // Solo las que llevan dorsal declaran franjas: el frente del América no
    // tiene dónde ponerlo sin tapar el escudo.
    if (t.admiteDorsal) {
      for (const k of ['nombreCaja', 'numeroCaja', 'dorsal']) {
        assert.ok(t[k] !== undefined, `${t.id} admite dorsal pero no trae ${k}`);
      }
    }
    // La silueta se guarda SIN el agujero: el diámetro lo pone el usuario y la
    // pieza se escala, así que un agujero fijo saldría minúsculo o rompería el aro.
    for (const poly of t.silueta) {
      assert.equal(poly.length, 1, `${t.id}: la silueta no debe traer agujeros`);
    }
  }
});

test('el dorsal reutiliza tintas de la propia camiseta, no colores nuevos', () => {
  // Con 4 tintas + relleno + contorno propios la pieza pedía 6 filamentos y el
  // AMS Lite del A1 solo tiene 4.
  for (const t of plantillas.plantillas) {
    const n = t.colores.length;
    for (const tinta of t.tintas) {
      assert.ok(tinta.i >= 0 && tinta.i < n, `${t.id}: tinta ${tinta.i} sin color`);
    }
    if (!t.admiteDorsal) continue;
    assert.ok(t.dorsal.relleno >= 0 && t.dorsal.relleno < n, `${t.id}: relleno fuera de rango`);
    assert.ok(t.dorsal.contorno >= 0 && t.dorsal.contorno < n, `${t.id}: contorno fuera de rango`);
    assert.notEqual(t.dorsal.relleno, t.dorsal.contorno, `${t.id}: relleno y contorno iguales`);
    assert.ok(t.tintas.length <= n);
  }
});

test('las tintas teselan la silueta: ni huecos ni colores pisándose', () => {
  // Simplificar cada región por su cuenta las dejaba solapadas unas décimas de
  // micra, y dos colores en la misma capa y el mismo sitio son ambiguos para el
  // laminador.
  for (const t of plantillas.plantillas) {
    const total = areaPartes(t.silueta);
    const tintas = t.tintas.reduce((s, x) => s + areaPartes(x.p), 0);
    const desvio = Math.abs(tintas - total) / total;
    assert.ok(desvio < 0.002,
      `${t.id}: las tintas suman ${(tintas / total * 100).toFixed(2)} % de la silueta`);
  }
});

test('las franjas del dorsal caben dentro de la camiseta de la plantilla', () => {
  for (const t of plantillas.plantillas) {
    if (!t.admiteDorsal) continue;
    const anillos = t.silueta.map(p => p[0]);
    const anchoEn = y => Math.max(0, ...anillos.map(r => halfWidthAt(r, y)));
    for (const [que, caja] of [['nombre', t.nombreCaja], ['número', t.numeroCaja]]) {
      for (const y of [caja.cy - caja.h / 2, caja.cy, caja.cy + caja.h / 2]) {
        assert.ok(caja.w / 2 <= anchoEn(y),
          `${t.id}: el ${que} pide ${caja.w / 2} y a y=${y} solo hay ${anchoEn(y)}`);
      }
    }
  }
});

test('las dos caras del mismo llavero salen a la misma escala', () => {
  // El frente no lleva número, así que su tamaño no puede salir de una caja de
  // dorsal: las dos plantillas guardan el mismo alto de número de referencia
  // para que impresas en pareja midan lo mismo.
  const caras = plantillas.plantillas.filter(t => t.id.startsWith('america-'));
  assert.ok(caras.length >= 2, 'faltan las dos caras');
  const alto = 12;
  const alturas = caras.map(t => alto / t.altoRef);
  const anchos = caras.map((t, i) => alturas[i] * t.anchoRel);
  assert.ok(Math.max(...anchos) - Math.min(...anchos) < 0.5,
    `los anchos se separan: ${anchos.map(v => v.toFixed(1))}`);
});

test('la caja del número manda sobre el tamaño de la camiseta', () => {
  // El alto de letra que pide la interfaz es el del número: si esta relación se
  // rompe, la camiseta deja de crecer con el control y el aviso de nombre
  // pequeño se vuelve inalcanzable.
  const alto = 12;
  const h = alto / JERSEY.numH;
  assert.ok(Math.abs(h * JERSEY.numH - alto) < 1e-9);
  assert.ok(h > alto, 'la camiseta siempre es más alta que su número');
});
