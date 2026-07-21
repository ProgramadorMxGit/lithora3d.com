import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const auditRoot = path.join(root, 'audits', '2026-07-20', 'premium-widget-motion');
const pages = ['prices', 'prototype', 'materials'];

for (const page of pages) {
  const captured = path.join(auditRoot, `tailwind-${page}.json`);
  const target = path.join(root, 'assets', `tailwind-${page}.css`);
  const css = JSON.parse(fs.readFileSync(captured, 'utf8'));
  if (!css.startsWith('/* ! tailwindcss v3.4.0')) throw new Error(`Captura Tailwind inválida: ${page}`);
  fs.writeFileSync(target, `${css}\n`, 'utf8');
  console.log(`${page}: ${Buffer.byteLength(css)} bytes`);
}
