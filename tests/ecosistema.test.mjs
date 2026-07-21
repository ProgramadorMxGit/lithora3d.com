import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const routePath = path.join(root, 'ecosistema-soluciones', 'index.html');
const homePath = path.join(root, 'index.html');
const scriptPath = path.join(root, 'ecosistema-soluciones', 'ecosistema.js');
const analyticsPath = path.join(root, 'ecosistema-soluciones', 'analytics.js');
const contentPath = path.join(root, 'ecosistema-soluciones', 'content.js');

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

test('la ruta del ecosistema existe y tiene metadata indexable', () => {
  const html = read(routePath);
  assert.match(html, /<title>[^<]+<\/title>/);
  assert.match(html, /name="description"/);
  assert.match(html, /rel="canonical"/);
  assert.equal((html.match(/<h1\b/gi) || []).length, 1);
  assert.match(html, /property="og:title"/);
});

test('la pagina presenta las cuatro categorias confirmadas', () => {
  const html = read(routePath);
  for (const category of ['Negocios', 'Industria', 'Eventos', 'Diseño y prototipos']) {
    assert.match(html, new RegExp(`data-category="[^"]+"[^>]*>[\\s\\S]*?${category}`));
  }
});

test('cada nicho publicado contiene entre cuatro y siete aplicaciones', () => {
  const html = read(routePath);
  const cards = [...html.matchAll(/<article[^>]*data-niche-card[^>]*>[\s\S]*?<\/article>/g)];
  assert.ok(cards.length >= 4);
  for (const card of cards) {
    const preview = card[0].match(/class="application-preview"[^>]*>[\s\S]*?<\/ul>/)?.[0] || '';
    const applications = preview.match(/data-application/g) || [];
    assert.ok(applications.length >= 4 && applications.length <= 7);
    assert.match(card[0], /data-image-type="(conceptual|real|missing)"/);
    assert.match(card[0], /data-quote-context=/);
  }
});

test('la pagina comunica personalizacion y orientacion sin archivo 3D', () => {
  const html = read(routePath);
  assert.match(html, /No necesitas un archivo 3D/i);
  assert.match(html, /soluciones personalizadas/i);
  assert.match(html, /puntos de partida/i);
});

test('el script expone los eventos de analitica definidos', () => {
  const script = `${read(scriptPath)}\n${read(analyticsPath)}`;
  for (const eventName of [
    'ecosystem_section_view',
    'ecosystem_category_select',
    'ecosystem_niche_open',
    'ecosystem_application_click',
    'ecosystem_quote_click',
    'ecosystem_quote_start',
    'ecosystem_quote_complete',
    'ecosystem_origin_context',
    'ecosystem_attachment_use',
  ]) {
    assert.match(script, new RegExp(eventName));
  }
});

test('la ruta usa recursos visuales locales y mantiene el menu movil cerrado', () => {
  const html = read(routePath);
  assert.match(html, /assets\/hotel\/hotel-display-informativo\.webp/);
  assert.doesNotMatch(html, /cdn\.openart\.ai/);
  assert.doesNotMatch(html, /cdn\.tailwindcss\.com/);
  assert.match(html, /id="mobile-menu"[^>]*\shidden/);
});

test('el detalle de Barberías publica sus cuatro ejemplos conceptuales optimizados', () => {
  const html = read(routePath);
  const detail = html.match(/id="detail-barberias"[\s\S]*?<div class="detail-inner">/)?.[0] || '';
  for (const asset of ['barber-letrero-clasico', 'barber-llavero', 'barber-figura', 'barber-display']) {
    assert.match(detail, new RegExp(`assets/barber/${asset}\\.webp`));
  }
  assert.equal((detail.match(/<span>Ejemplo conceptual<\/span>/g) || []).length, 4);
  assert.match(detail, /class="detail-gallery"/);
});

test('Transporte ocupa el lugar de Ferreterías con cuatro ejemplos conceptuales', () => {
  const html = read(routePath);
  assert.doesNotMatch(html, /data-niche="ferreterias"/);
  const detail = html.match(/id="detail-transporte"[\s\S]*?<div class="detail-inner">/)?.[0] || '';
  for (const asset of ['transporte-display-ruta', 'transporte-llavero', 'transporte-figura', 'transporte-emblema']) {
    assert.match(detail, new RegExp(`assets/transporte/${asset}\\.webp`));
  }
  assert.equal((detail.match(/<span>Ejemplo conceptual<\/span>/g) || []).length, 4);
});

test('Papelerías se elimina y Pizzerías publica el llavero principal y su galería', () => {
  const html = read(routePath);
  assert.doesNotMatch(html, /data-niche="papelerias"/);
  const card = html.match(/<article[^>]*data-niche="pizzerias"[\s\S]*?<\/article>/)?.[0] || '';
  assert.match(card, /class="niche-image-wrap"[^>]*><img src="\.\.\/assets\/pizzeria\/pizzeria-llavero\.webp"/);
  const detail = card.match(/id="detail-pizzerias"[\s\S]*?<div class="detail-inner">/)?.[0] || '';
  for (const asset of ['pizzeria-llavero', 'pizzeria-letrero', 'pizzeria-figura', 'pizzeria-display']) {
    assert.match(detail, new RegExp(`assets/pizzeria/${asset}\\.webp`));
  }
});

test('Hamburgueserías publica la figura principal y sus cuatro ejemplos', () => {
  const html = read(routePath);
  const card = html.match(/<article[^>]*data-niche="hamburgueserias"[\s\S]*?<\/article>/)?.[0] || '';
  assert.match(card, /class="niche-image-wrap"[^>]*><img src="\.\.\/assets\/hamburgueseria\/hamburgueseria-figura\.webp"/);
  const detail = card.match(/id="detail-hamburgueserias"[\s\S]*?<div class="detail-inner">/)?.[0] || '';
  for (const asset of ['hamburgueseria-figura', 'hamburgueseria-letrero', 'hamburgueseria-llavero', 'hamburgueseria-display']) {
    assert.match(detail, new RegExp(`assets/hamburgueseria/${asset}\\.webp`));
  }
});

test('Dentistas publica el llavero principal y sus cuatro ejemplos', () => {
  const html = read(routePath);
  const card = html.match(/<article[^>]*data-niche="dentistas"[\s\S]*?<\/article>/)?.[0] || '';
  assert.match(card, /class="niche-image-wrap"[^>]*><img src="\.\.\/assets\/dentista\/dentista-llavero\.webp"/);
  const detail = card.match(/id="detail-dentistas"[\s\S]*?<div class="detail-inner">/)?.[0] || '';
  for (const asset of ['dentista-llavero', 'dentista-placa-clinica', 'dentista-figura', 'dentista-letrero']) {
    assert.match(detail, new RegExp(`assets/dentista/${asset}\\.webp`));
  }
  assert.equal((detail.match(/<span>Ejemplo conceptual<\/span>/g) || []).length, 4);
});

test('Hoteles publica el display informativo principal y sus cuatro ejemplos', () => {
  const html = read(routePath);
  const card = html.match(/<article[^>]*data-niche="hoteles"[\s\S]*?<\/article>/)?.[0] || '';
  assert.match(card, /class="niche-image-wrap"[^>]*><img src="\.\.\/assets\/hotel\/hotel-display-informativo\.webp"/);
  const detail = card.match(/id="detail-hoteles"[\s\S]*?<div class="detail-inner">/)?.[0] || '';
  for (const asset of ['hotel-display-informativo', 'hotel-placa-habitacion', 'hotel-organizador-recepcion', 'hotel-colgante-puerta']) {
    assert.match(detail, new RegExp(`assets/hotel/${asset}\\.webp`));
  }
  assert.equal((detail.match(/<span>Ejemplo conceptual<\/span>/g) || []).length, 4);
});

test('Boda reemplaza Joyerías y publica la figura de novios principal', () => {
  const html = read(routePath);
  assert.doesNotMatch(html, /data-niche="joyerias"/);
  const card = html.match(/<article[^>]*data-niche="boda"[\s\S]*?<\/article>/)?.[0] || '';
  assert.match(card, /class="niche-image-wrap"[^>]*><img src="\.\.\/assets\/boda\/boda-figura-novios\.webp"/);
  const detail = card.match(/id="detail-boda"[\s\S]*?<div class="detail-inner">/)?.[0] || '';
  for (const asset of ['boda-figura-novios', 'boda-letrero-bienvenida', 'boda-adorno-pastel', 'boda-numero-mesa']) {
    assert.match(detail, new RegExp(`assets/boda/${asset}\\.webp`));
  }
  assert.equal((detail.match(/<span>Ejemplo conceptual<\/span>/g) || []).length, 4);
});

test('Escuelas reemplaza Farmacias y publica el identificador para lápiz principal', () => {
  const html = read(routePath);
  assert.doesNotMatch(html, /data-niche="farmacias"/);
  const card = html.match(/<article[^>]*data-niche="escuelas"[\s\S]*?<\/article>/)?.[0] || '';
  assert.match(card, /class="niche-image-wrap"[^>]*><img src="\.\.\/assets\/escuela\/escuela-identificador-lapiz\.webp"/);
  const detail = card.match(/id="detail-escuelas"[\s\S]*?<div class="detail-inner">/)?.[0] || '';
  for (const asset of ['escuela-identificador-lapiz', 'escuela-llavero', 'escuela-organizador', 'escuela-separador']) {
    assert.match(detail, new RegExp(`assets/escuela/${asset}\\.webp`));
  }
  assert.equal((detail.match(/<span>Ejemplo conceptual<\/span>/g) || []).length, 4);
});

test('Gimnasios publica el letrero Power Gym principal y sus cuatro ejemplos', () => {
  const html = read(routePath);
  const card = html.match(/<article[^>]*data-niche="gimnasios"[\s\S]*?<\/article>/)?.[0] || '';
  assert.match(card, /class="niche-image-wrap"[^>]*><img src="\.\.\/assets\/gym\/gym-letrero-power\.webp"/);
  const detail = card.match(/id="detail-gimnasios"[\s\S]*?<div class="detail-inner">/)?.[0] || '';
  for (const asset of ['gym-letrero-power', 'gym-trofeo-coach', 'gym-llavero', 'gym-figura-coach']) {
    assert.match(detail, new RegExp(`assets/gym/${asset}\\.webp`));
  }
  assert.equal((detail.match(/<span>Ejemplo conceptual<\/span>/g) || []).length, 4);
});

test('los controles de categoria conservan enlaces nativos y el script separa sus selectores', () => {
  const html = read(routePath);
  const script = read(scriptPath);
  assert.doesNotMatch(html, /map-category[^>]*role="listitem"/);
  assert.match(script, /querySelectorAll\('\[data-category-control\]'\)/);
  assert.match(script, /history\.pushState/);
  assert.match(script, /addEventListener\('popstate'/);
});

test('la interfaz conecta contratos locales y conserva origen sin simular envio', () => {
  const html = read(routePath);
  const script = read(scriptPath);
  assert.match(html, /data-quote-channel="whatsapp"/);
  assert.match(html, /data-quote-destination="https:\/\/wa\.me\/528331080178"/);
  assert.match(html, /id="quote-origin"/);
  assert.match(html, /m[aá]ximo 10 MB/i);
  assert.match(html, /type="module" src="ecosistema\.js"/);
  assert.match(script, /createQuoteChannel/);
  assert.match(script, /result\.state === QUOTE_STATES\.HANDOFF/);
  assert.match(script, /result\.confirmed === true/);
  assert.match(script, /whatsappDirect\.href = buildWhatsAppUrl/);
  assert.match(html, /href="https:\/\/wa\.me\/528331080178"/);
});

test('la fuente estatica refleja las tarjetas indexables actuales', () => {
  const html = read(routePath);
  const content = read(contentPath);
  const ids = [...html.matchAll(/data-niche="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(ids.length, 9);
  ids.forEach((id) => assert.match(content, new RegExp(`id: '${id}'`)));
});

test('la home muestra y enlaza directamente los nueve nichos aprobados', () => {
  const html = read(homePath);
  const cards = [...html.matchAll(/class="home-niche-card"[^>]+data-home-niche="([^"]+)"/g)];
  assert.equal(cards.length, 9);
  assert.ok(!cards.some(([, id]) => id === 'farmacias'));
  assert.ok(!cards.some(([, id]) => id === 'papelerias'));
  assert.ok(!cards.some(([, id]) => id === 'joyerias'));
  assert.match(html, /data-home-niche="boda">[\s\S]*?assets\/boda\/boda-figura-novios\.webp/);
  assert.match(html, /data-home-niche="escuelas">[\s\S]*?assets\/escuela\/escuela-identificador-lapiz\.webp/);
  assert.match(html, /data-home-niche="gimnasios">[\s\S]*?assets\/gym\/gym-letrero-power\.webp/);
  assert.match(html, /data-home-niche="pizzerias">[\s\S]*?assets\/pizzeria\/pizzeria-llavero\.webp/);
  for (const [, id] of cards) assert.match(html, new RegExp(`/ecosistema-soluciones/\\?nicho=${id}#[^"]+`));
  assert.match(html, /¿Qué quieres crear para tu negocio\?/);
  assert.match(html, /Ejemplo conceptual/);
});

test('un enlace de nicho desde la home abre su categoria y detalle', () => {
  const script = read(scriptPath);
  assert.match(script, /new URLSearchParams\(location\.search\)\.get\('nicho'\)/);
  assert.match(script, /requestedCard\?\.dataset\.category/);
  assert.match(script, /openDetail\(requestedCard\)/);
});

test('la home integra Ideas impresas con imagen responsive y cotizacion real', () => {
  const html = read(homePath);
  const section = html.match(/<section id="ideas-impresas"[\s\S]*?<\/section>/)?.[0] || '';
  assert.match(section, /id="idea-showcase-title"/);
  assert.match(section, /assets\/lading\/seccion-idea-480\.webp 480w/);
  assert.match(section, /assets\/lading\/seccion-idea-768\.webp 768w/);
  assert.match(section, /assets\/lading\/seccion-idea\.webp 960w/);
  assert.match(section, /width="960" height="431"/);
  assert.match(section, /Ejemplo conceptual/);
  assert.match(section, /https:\/\/wa\.me\/528331080178\?text=/);
  for (const file of ['seccion-idea-480.webp', 'seccion-idea-768.webp', 'seccion-idea.webp']) {
    assert.ok(fs.existsSync(path.join(root, 'assets', 'lading', file)), `${file} debe existir`);
  }
});

test('la portada retira del recorrido visible los bloques internos o redundantes', () => {
  const html = read(homePath);
  assert.match(html, /<section[^>]+hidden aria-hidden="true">[\s\S]*?GUÍAS DEL SERVICIO/);
  for (const id of ['materiales', 'aplicaciones', 'casos-exito']) {
    assert.match(html, new RegExp(`<section id="${id}"[^>]+hidden aria-hidden="true"`));
  }
  assert.doesNotMatch(html, /href="#(?:materiales|aplicaciones|casos-exito)"/);
  assert.doesNotMatch(html, /atacar búsquedas BOFU|En SEO comercial no basta/i);
});
