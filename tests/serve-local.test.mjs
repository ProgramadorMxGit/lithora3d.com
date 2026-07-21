import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createLocalServer, resolveRequest } from '../scripts/serve-local.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('resuelve la raiz y las rutas de carpeta al index correcto', () => {
  assert.equal(resolveRequest('/'), path.join(root, 'index.html'));
  assert.equal(resolveRequest('/precios-impresion-3d/'), path.join(root, 'precios-impresion-3d', 'index.html'));
  assert.equal(resolveRequest('/assets/styles.css'), path.join(root, 'assets', 'styles.css'));
});

test('rechaza archivos ausentes y recorridos fuera de la raiz', () => {
  assert.equal(resolveRequest('/no-existe/'), null);
  assert.equal(resolveRequest('/..%2F..%2FWindows/win.ini'), null);
});

test('crea un servidor HTTP local sin iniciarlo al importar', () => {
  const server = createLocalServer();
  assert.equal(server.listening, false);
  server.close();
});
