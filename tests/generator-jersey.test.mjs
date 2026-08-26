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
const {JERSEY, jerseySilhouette, placeTextPolys, polysBounds,
       cajaNombreSolo, escalarCajaNombre, anchoUtil} = sandbox.module.exports;

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
/** Grupos de tinta de una plantilla, sea de una cara o de dos. */
const gruposDe = t => t.tintas || t.caraB;

test('la plantilla declara todo lo que la app necesita para construirla', () => {
  assert.equal(plantillas.version, 1);
  assert.ok(plantillas.plantillas.length >= 1);
  for (const t of plantillas.plantillas) {
    for (const k of ['id', 'nombre', 'anchoRel', 'altoRef', 'colores', 'aro', 'silueta',
      'admiteDorsal']) {
      assert.ok(t[k] !== undefined, `${t.id} no trae ${k}`);
    }
    if (t.dosCaras) {
      for (const k of ['caraA', 'caraB', 'nucleo']) {
        assert.ok(t[k] !== undefined, `${t.id} es de dos caras pero no trae ${k}`);
      }
      // Cada grupo del frente declara su nivel de relieve; sin él subiría todo
      // a la misma altura y la pieza volvería a ser una calcomanía plana.
      for (const g of t.caraA) {
        assert.ok(Number.isInteger(g.n) && g.n >= 0 && g.n <= 3, `${t.id}: nivel raro ${g.n}`);
      }
    } else {
      assert.ok(t.tintas !== undefined, `${t.id} no trae tintas`);
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
    for (const tinta of gruposDe(t).concat(t.caraA || [])) {
      assert.ok(tinta.i >= 0 && tinta.i < n, `${t.id}: tinta ${tinta.i} sin color`);
    }
    if (t.dosCaras) {
      assert.ok(t.nucleo >= 0 && t.nucleo < n, `${t.id}: núcleo sin color`);
    }
    if (!t.admiteDorsal) continue;
    assert.ok(t.dorsal.relleno >= 0 && t.dorsal.relleno < n, `${t.id}: relleno fuera de rango`);
    assert.ok(t.dorsal.contorno >= 0 && t.dorsal.contorno < n, `${t.id}: contorno fuera de rango`);
    assert.notEqual(t.dorsal.relleno, t.dorsal.contorno, `${t.id}: relleno y contorno iguales`);
    assert.ok(gruposDe(t).length <= n);
  }
});

test('una plantilla puede gastar menos tintas de las que declara su paleta', () => {
  /* El dibujo del Santos solo usa dos (verde y blanco) mientras que su dorsal
     tira de una tercera. Cuando el dorsal se fundía con las tintas del dibujo,
     esa tercera no existía en la cara, el hueco ya se había restado del resto y
     la pieza salía AGUJEREADA. El caso tiene que seguir existiendo aquí para
     que nadie lo "simplifique" igualando las dos listas. */
  const conMenos = plantillas.plantillas.filter(
    t => t.admiteDorsal && gruposDe(t).length < t.colores.length);
  assert.ok(conMenos.length >= 1,
    'ninguna plantilla ejercita ya el caso de dorsal con una tinta que el dibujo no usa');
  // Basta con que UNA lo ejercite. Exigirselo a todas ataba el diseno de cada
  // camiseta nueva a esta prueba: el Santos trazado gasta 3 de sus 4 tintas en
  // el dibujo y pinta el dorsal con dos que ya usa, que es lo correcto para esa
  // camiseta, y aun asi la hacia fallar.
  assert.ok(conMenos.some(t => {
    const usadas = new Set(gruposDe(t).map(x => x.i));
    return !usadas.has(t.dorsal.contorno) || !usadas.has(t.dorsal.relleno);
  }), 'ninguna plantilla ejercita ya el caso de dorsal con una tinta que el dibujo no usa');
});

/** ¿Cae el punto dentro del anillo? Ray casting, el de toda la vida. */
function dentroDeAnillo(ring, x, y) {
  let dentro = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) dentro = !dentro;
  }
  return dentro;
}
const dentroDePoly = (poly, x, y) =>
  dentroDeAnillo(poly[0], x, y) && !poly.slice(1).some(h => dentroDeAnillo(h, x, y));
/** ¿Es este color un negro de verdad? No vale la luminancia media: el verde
    oscuro del Santos (#0C5B3F) promedia 55 y colaría por debajo de cualquier
    umbral razonable. Un negro tiene los TRES canales bajos y además apenas
    separados entre sí; ese verde tiene el canal verde en 91. */
const esNegro = hex => {
  const v = hex.replace('#', '');
  const c = [0, 2, 4].map(i => parseInt(v.slice(i, i + 2), 16));
  return Math.max(...c) < 60 && Math.max(...c) - Math.min(...c) < 25;
};

test('cada grupo del relieve declara su ancho, para poder topar la altura', () => {
  /* Un relieve más alto que 1.6 veces su propio ancho es una cuchilla: se apoya
     solo en su huella y se despega de pasarle la mano por encima. El dibujo
     trazado trae detalles de cuatro décimas que al nivel 3 subían 1.8 mm, o sea
     4.5 veces su ancho, y así se publicó. geometria.js topa ahora la altura con
     este número; sin él el tope no se aplica y vuelven las cuchillas. */
  for (const t of plantillas.plantillas) {
    if (!t.caraA) continue;
    for (const g of t.caraA) {
      assert.ok(typeof g.w === 'number' && g.w > 0,
        `${t.id}: un grupo del relieve (tinta ${g.i}, nivel ${g.n}) no declara w`);
      assert.ok(g.w < 12 / t.altoRef, `${t.id}: w=${g.w} no es un ancho plausible`);
    }
  }
});

test('cada camiseta declara el ancho de su detalle más fino', () => {
  /* El deslizador del tamaño deja encoger la pieza hasta 6 mm de letra y el
     dibujo encoge con ella: una franja de 0.45 mm a tamaño de fábrica queda en
     0.22 a la mitad, y eso ya no sale de una boquilla de 0.4. Sin este número
     la app no puede avisar, y la camiseta se imprime con hilos sueltos donde
     debería haber dibujo. Lo mide medir-detalle.py sobre la geometría real. */
  for (const t of plantillas.plantillas) {
    assert.ok(typeof t.detalleMin === 'number' && t.detalleMin > 0,
      `${t.id}: no declara detalleMin`);
    // cota barata: nada puede ser más ancho que la propia camiseta
    assert.ok(t.detalleMin < 12 / t.altoRef,
      `${t.id}: detalleMin ${t.detalleMin} no es un ancho plausible`);
  }
});

test('el filo de todas las camisetas va de negro', () => {
  /* El contorno negro es lo que hace que la pieza se lea como una camiseta y no
     como una mancha de colores. El Santos trazado se publicó una vez con el filo
     en verde oscuro porque su uniforme no traía negro y meterlo pedía un quinto
     filamento; la salida buena es gastar un hueco del AMS en negro, no ahorrárselo. */
  const DENTRO = 0.008;          // ~0.4 mm hacia dentro, en alto de pieza
  for (const t of plantillas.plantillas) {
    const grupos = t.tintas || t.caraA;
    const ring = t.silueta[0][0];
    let vistos = 0;
    for (let i = 0; i < ring.length; i += Math.max(1, Math.floor(ring.length / 40))) {
      const [x1, y1] = ring[i], [x2, y2] = ring[(i + 1) % ring.length];
      const dx = x2 - x1, dy = y2 - y1;
      const n = Math.hypot(dx, dy);
      if (n < 1e-9) continue;
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      // normal hacia dentro: se prueban los dos sentidos y se coge el que cae dentro
      let px = mx - dy / n * DENTRO, py = my + dx / n * DENTRO;
      if (!dentroDePoly(t.silueta[0], px, py)) {
        px = mx + dy / n * DENTRO; py = my - dx / n * DENTRO;
        if (!dentroDePoly(t.silueta[0], px, py)) continue;
      }
      const g = grupos.find(gr => gr.p.some(poly => dentroDePoly(poly, px, py)));
      if (!g) continue;           // justo en una frontera; no cuenta
      vistos++;
      assert.ok(esNegro(t.colores[g.i]),
        `${t.id}: el filo lleva ${t.colores[g.i]} en (${px.toFixed(3)}, ${py.toFixed(3)})`);
    }
    assert.ok(vistos >= 10, `${t.id}: solo se pudieron medir ${vistos} puntos del filo`);
  }
});

test('las tintas teselan la silueta: ni huecos ni colores pisándose', () => {
  // Simplificar cada región por su cuenta las dejaba solapadas unas décimas de
  // micra, y dos colores en la misma capa y el mismo sitio son ambiguos para el
  // laminador.
  for (const t of plantillas.plantillas) {
    const total = areaPartes(t.silueta);
    // En la de dos caras se comprueban las DOS: cada una tesela por su lado, y
    // un hueco en cualquiera es un agujero en la pieza impresa.
    const caras = t.dosCaras ? [t.caraA, t.caraB] : [t.tintas];
    for (const cara of caras) {
      const suma = cara.reduce((s, x) => s + areaPartes(x.p), 0);
      const desvio = Math.abs(suma - total) / total;
      assert.ok(desvio < 0.002,
        `${t.id}: una cara suma ${(suma / total * 100).toFixed(2)} % de la silueta`);
    }
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

test('la de dos caras reparte el relieve del frente en varios niveles', () => {
  // Si todos los grupos acabaran en el mismo nivel la cara de arriba sería una
  // calcomanía plana, que es justo lo que la plantilla viene a evitar.
  const dc = plantillas.plantillas.filter(t => t.dosCaras);
  assert.ok(dc.length >= 1, 'falta la plantilla de dos caras');
  for (const t of dc) {
    const niveles = new Set(t.caraA.map(g => g.n));
    assert.ok(niveles.size >= 3, `${t.id}: solo ${niveles.size} nivel(es) de relieve`);
    assert.ok(niveles.has(0), `${t.id}: falta el nivel de fondo`);
  }
});

test('sin número, el nombre baja al pecho y crece', () => {
  // Antes el número era obligatorio de facto: sin él el nombre se quedaba en su
  // franja de arriba, diminuto, y media camiseta salía vacía.
  const nom = {cy: 0.1896, h: 0.1072, w: 0.3957};
  const num = {cy: 0.0035, h: 0.2408, w: 0.3462};
  const solo = cajaNombreSolo(nom, num);
  assert.ok(solo.h > nom.h * 1.3, 'el nombre solo tiene que crecer');
  assert.ok(solo.w > num.w, 'y disponer de más ancho que el número');
  /* Crece hacia ABAJO, manteniendo su línea superior. Bajarlo al centro lo
     dejaba sobre la transición de los chevrones; crecerlo centrado lo subía al
     cuello, donde la camiseta se estrecha y el contorno se corta contra el
     hombro. El hueco que hay que llenar está debajo. */
  assert.ok(Math.abs((solo.cy + solo.h / 2) - (nom.cy + nom.h / 2)) < 1e-9,
    'el nombre solo conserva su línea superior');
  assert.ok(solo.cy > num.cy, 'y sigue por encima de donde iría el número');
});

test('la franja del nombre sin número también cabe, la deduzca la app o no', () => {
  /* La regla de cajaNombreSolo se dedujo de la silueta del América. En una
     camiseta más alta y con las mangas más bajas —la del Chivas— la franja
     deducida cae justo en la sisa y el nombre se monta sobre las dos mangas,
     así que esa plantilla trae su propia `nombreSoloCaja`. Venga de donde
     venga, tiene que caber y tiene que CRECER: si no crece, quitar el número
     deja media camiseta vacía y un nombre diminuto. */
  const anchoEn = (anillos, y) => Math.max(0, ...anillos.map(r => halfWidthAt(r, y)));
  for (const t of plantillas.plantillas) {
    if (!t.admiteDorsal) continue;
    const solo = t.nombreSoloCaja || cajaNombreSolo(t.nombreCaja, t.numeroCaja);
    assert.ok(solo.h > t.nombreCaja.h, `${t.id}: el nombre solo no crece a lo alto`);
    assert.ok(solo.cy > t.numeroCaja.cy,
      `${t.id}: el nombre solo se ha bajado por debajo de donde iría el número`);
    const anillos = t.silueta.map(p => p[0]);
    for (const y of [solo.cy - solo.h / 2, solo.cy, solo.cy + solo.h / 2]) {
      assert.ok(anchoEn(anillos, y) > 0,
        `${t.id}: la franja del nombre solo se sale de la pieza a y=${y}`);
    }
  }
});

test('el tamaño del nombre escala su caja a lo alto Y a lo ancho', () => {
  const caja = {cy: 0.19, h: 0.107, w: 0.396};
  assert.equal(escalarCajaNombre(caja, 1), caja, 'al 100 % no debe tocar nada');
  const grande = escalarCajaNombre(caja, 1.5);
  assert.ok(Math.abs(grande.h - caja.h * 1.5) < 1e-9);
  /* El ancho escala también: si solo creciera el alto, un nombre largo —que ya
     toca el ancho del pecho— no se movería ni un milímetro por mucho que se
     subiera el deslizador, y parecería roto. */
  assert.ok(Math.abs(grande.w - caja.w * 1.5) < 1e-9, 'el ancho tiene que acompañar');
  assert.equal(grande.cy, caja.cy, 'la franja no se mueve de sitio');
  // Un guardado manipulado no debe reventar la pieza.
  assert.equal(escalarCajaNombre(caja, 0), caja);
});

test('el ancho útil de una franja es el MÍNIMO, no el máximo', () => {
  /* Una camiseta es ancha arriba (mangas) y estrecha abajo (cuerpo). Midiendo
     el máximo, un nombre sin número se salía del cuerpo por abajo y las letras
     de los extremos salían cortadas contra el borde. */
  const camiseta = [[[-20, 10], [20, 10], [20, 0], [6, 0], [6, -20], [-6, -20], [-6, 0], [-20, 0]]];
  assert.ok(Math.abs(anchoUtil(camiseta, 2, 8) - 40) < 0.5, 'arriba mide 40');
  assert.ok(Math.abs(anchoUtil(camiseta, -18, -2) - 12) < 0.5, 'abajo mide 12');
  // Una franja que cruza el escalón se queda con el estrecho, no con el ancho.
  assert.ok(Math.abs(anchoUtil(camiseta, -6, 6) - 12) < 0.5,
    'a caballo del escalón debe ganar el ancho menor');
});

test('el dorsal guarda las proporciones de una playera de verdad', () => {
  /* Medido sobre una foto de dorsal real (A. Cervantes 13, Club América 25/26):
     el número ocupa el 27 % del alto de la camiseta y su centro cae al 43.5 %
     desde el hombro, o sea en la mitad de ARRIBA. La primera versión lo hacía
     un tercio más grande y por debajo del centro, y la pieza parecía un cartel.
     Los márgenes son anchos a propósito: fijan la intención, no un valor. */
  assert.ok(JERSEY.numH > 0.24 && JERSEY.numH < 0.30,
    `el número ocupa ${(JERSEY.numH * 100).toFixed(0)} % del alto; en la real es 27 %`);
  assert.ok(JERSEY.numCY > 0,
    'el número va en la mitad de arriba de la camiseta, como en la real');
  assert.ok(JERSEY.numH > JERSEY.nameH * 2,
    'el número tiene que dominar sobre el nombre');
  assert.ok(JERSEY.nameCY > JERSEY.numCY, 'el nombre va por encima del número');

  for (const t of plantillas.plantillas.filter(x => x.admiteDorsal)) {
    // Sobre la plantilla se mide contra su alto total, que incluye la argolla
    // (~12 % del alto), así que el 27 % de la camiseta cae cerca del 24 % aquí.
    assert.ok(t.numeroCaja.h > 0.21 && t.numeroCaja.h < 0.27,
      `${t.id}: el número ocupa ${(t.numeroCaja.h * 100).toFixed(0)} % del alto de la plantilla`);
    assert.ok(t.numeroCaja.cy > t.numeroCaja.h * -0.5,
      `${t.id}: el número cuelga demasiado bajo`);
    assert.ok(t.nombreCaja.cy - t.nombreCaja.h / 2 >= t.numeroCaja.cy + t.numeroCaja.h / 2,
      `${t.id}: el nombre y el número se pisan`);
  }
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
