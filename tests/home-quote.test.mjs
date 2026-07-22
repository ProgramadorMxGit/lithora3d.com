import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'assets', 'styles.css'), 'utf8');

test('la portada integra el formulario de cotización publicado', () => {
  assert.match(home, /https:\/\/tally\.so\/embed\/ODeE7a\?[^"\s]*dynamicHeight=1/);
  assert.match(home, /src="https:\/\/tally\.so\/widgets\/embed\.js"[^>]*defer/);
  assert.match(home, /title="Formulario de solicitud de cotización de Lithora3D"/);
  assert.match(home, /href="https:\/\/tally\.so\/r\/ODeE7a"/);
});

test('la portada comunica fecha y foto opcionales con el límite correcto', () => {
  assert.match(home, /Fecha aproximada requerida \(opcional\)/);
  assert.match(home, /Foto de referencia \(opcional, máximo 10 MB\)/);
});

test('se retiró el formulario local que bloqueaba el envío real', () => {
  assert.doesNotMatch(home, /id="cotizar-form"/);
  assert.doesNotMatch(home, /wire to real endpoint/i);
  assert.match(styles, /\.tally-quote-frame\s*\{/);
  assert.match(styles, /min-height:\s*1160px/);
});
