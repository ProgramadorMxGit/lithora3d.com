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

const dosLlaveros = [{color: '#FFCCFD'}, {color: '#FFFFFF'}];
const num = v => parseFloat(String(Array.isArray(v) ? v[0] : v));

/* Bambu diseña su planchado en caudal 10% con paso 0.15 mm sobre líneas de cara
   superior de 0.42 mm. Lo que llega a la superficie por milímetro cuadrado es
   `caudal / paso`, y ese cociente es el que quema el acabado si se pasa. */
const DOSIS_BAMBU = 10 / 0.15;      // 66.7
const LINEA_BAMBU = 0.42;

test('el planchado no deposita más material por área que el de Bambu', () => {
  /* Pasó de verdad, y salió caro: persiguiendo unas picaduras se subió el caudal
     a 20% y se cerró el paso a 0.1, o sea 200 frente a los 66.7 de Bambu, TRES
     VECES el material sobre una cara que la pasada de arriba ya dejaba llena.
     Lo sobrante no cabe: se amontona en lomos y la boquilla lo arrastra.

     Laminando "Debanhy" con el CLI de Bambu eso daba +23.7% de material sobre la
     cara vista y 9.5 min de boquilla a 220 °C sobre unas letras de 1.4 mm. Los
     llaveros salieron ondulados y con grumos. La plancha PULE un techo ya
     cerrado; no lo cierra. Si vuelven las picaduras, el remedio son las capas de
     cierre y el ancho de línea, nunca subir esto. */
  const cfg = JSON.parse(patchProjectSettings(plantilla, dosLlaveros));
  const dosis = num(cfg.ironing_flow) / num(cfg.ironing_spacing);
  assert.ok(dosis <= DOSIS_BAMBU + 1e-9,
    `el planchado deposita ${dosis.toFixed(1)} por área y Bambu deposita ${DOSIS_BAMBU.toFixed(1)}`
    + ` (caudal ${cfg.ironing_flow}, paso ${cfg.ironing_spacing} mm)`);
});

test('el paso del planchado conserva el traslape de Bambu con nuestra línea más ancha', () => {
  /* Nuestra cara superior usa líneas de 0.5 mm, no las de 0.42 de Bambu. Copiar
     su paso de 0.15 mm tal cual apretaría el traslape un 19% de más: más
     pasadas, y en letra cursiva casi todas son cambios de sentido. El paso tiene
     que escalar con la línea. */
  const cfg = JSON.parse(patchProjectSettings(plantilla, dosLlaveros));
  const esperado = 0.15 * num(cfg.top_surface_line_width) / LINEA_BAMBU;
  assert.ok(Math.abs(num(cfg.ironing_spacing) - esperado) < 0.011,
    `con líneas de ${cfg.top_surface_line_width} mm el paso debería rondar ${esperado.toFixed(2)} mm`
    + ` y vale ${cfg.ironing_spacing}`);
});

test('la plancha no se arrastra más lenta que la de Bambu', () => {
  /* Bajarla a 20 mm/s no pulía más: sólo alargaba el horneado. En pasadas de 2.8
     mm de media -el 40% por debajo de 1 mm- la boquilla ni siquiera llega a la
     velocidad pedida, así que lo único que cambia es cuánto rato pasa la pieza
     bajo los 220 °C. */
  const cfg = JSON.parse(patchProjectSettings(plantilla, dosLlaveros));
  assert.ok(num(cfg.ironing_speed) >= 30,
    `la plancha va a ${cfg.ironing_speed} mm/s y Bambu la mueve a 30`);
});
