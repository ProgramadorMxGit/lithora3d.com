import test from 'node:test';
import assert from 'node:assert/strict';
import { categories, niches, getPublishedNiches, updateNiche, validateNiche, PUBLICATION_STATES, VISUAL_REFERENCE, WHATSAPP_CHANNEL } from '../ecosistema-soluciones/content.js';

const approved = new Map([
  ['Barberías', ['Letreros personalizados', 'Llaveros con branding', 'Figuras decorativas temáticas', 'Placas o displays de marca']],
  ['Gimnasios', ['Trofeos', 'Llaveros', 'Figuras de coach o personaje', 'Letreros o placas con marca del gimnasio']],
  ['Dentistas', ['Placas o señalización', 'Llaveros temáticos', 'Figuras decorativas', 'Branding decorativo para recepción']],
  ['Transporte', ['Displays de ruta o unidad', 'Llaveros con branding', 'Figuras de operador o personal', 'Letreros o emblemas de logística']],
  ['Boda', ['Figuras personalizadas de novios', 'Letreros de bienvenida', 'Adornos para pastel', 'Números de mesa decorativos']],
  ['Hoteles', ['Señalización', 'Llaveros de habitación', 'Figuras decorativas', 'Branding para recepción']],
  ['Pizzerías', ['Portamenús o menús de mostrador', 'Llaveros', 'Figuras decorativas', 'Letreros o branding del negocio']],
  ['Hamburgueserías', ['Portamenús', 'Llaveros', 'Figuras de personaje o mascota', 'Letreros de marca']],
  ['Escuelas', ['Identificadores personalizados para lápices', 'Llaveros escolares con nombre', 'Organizadores para útiles', 'Separadores personalizados']],
]);

test('el contenido define cuatro categorias estables y ordenadas', () => {
  assert.deepEqual(categories.map(({ id }) => id), ['negocios', 'industria', 'eventos', 'diseno-prototipos']);
  assert.deepEqual(categories.map(({ order }) => order), [1, 2, 3, 4]);
});

test('solo publica nichos completos permitidos y conserva el orden configurable', () => {
  const published = getPublishedNiches();
  assert.equal(published.length, 9);
  assert.ok(!published.some(({ id }) => id === 'demo-incompleto-oculto'));
  for (const record of published) {
    assert.equal(validateNiche(record).valid, true, `${record.id} debe ser valido`);
    assert.ok(record.applications.length >= 4 && record.applications.length <= 7);
  }
  const reordered = getPublishedNiches(updateNiche(niches, 'boda', { order: 0 }, '2026-07-21'));
  assert.equal(reordered.filter(({ categoryId }) => categoryId === 'negocios')[0].id, 'boda');
  assert.equal(reordered.find(({ id }) => id === 'boda').updatedAt, '2026-07-21');
});

test('publica exactamente los nueve nichos y productos aprobados', () => {
  const published = getPublishedNiches();
  assert.deepEqual(new Set(published.map(({ name }) => name)), new Set(approved.keys()));
  for (const record of published) {
    assert.deepEqual(record.applications, approved.get(record.name));
    assert.equal(record.commercialApproval, 'approved-2026-07-20-user-decision');
    assert.equal(record.cta.channel, 'whatsapp');
    assert.equal(record.cta.destination, WHATSAPP_CHANNEL.destination);
  }
});

test('Barberías usa las cuatro referencias conceptuales aportadas por el usuario', () => {
  const barberias = getPublishedNiches().find(({ id }) => id === 'barberias');
  assert.equal(barberias.gallery.length, 4);
  assert.equal(barberias.image, barberias.gallery[0]);
  assert.deepEqual(barberias.gallery.map(({ descriptor }) => descriptor), [
    'Letrero personalizado',
    'Llavero con branding',
    'Figura decorativa temática',
    'Placa o display de marca',
  ]);
  for (const image of barberias.gallery) {
    assert.equal(image.type, 'conceptual');
    assert.equal(image.label, 'Ejemplo conceptual');
    assert.equal(image.source, 'Referencia conceptual aportada por el usuario');
    assert.equal(image.approval.approvedAsRealProject, false);
  }
});

test('Transporte reemplaza Ferreterías y usa sus cuatro referencias conceptuales', () => {
  const published = getPublishedNiches();
  const transporte = published.find(({ id }) => id === 'transporte');
  assert.ok(!published.some(({ id }) => id === 'ferreterias'));
  assert.equal(transporte.categoryId, 'industria');
  assert.equal(transporte.order, 2);
  assert.equal(transporte.gallery.length, 4);
  assert.equal(transporte.image, transporte.gallery[0]);
  assert.deepEqual(transporte.gallery.map(({ descriptor }) => descriptor), [
    'Display de ruta o unidad',
    'Llavero con branding',
    'Figura de operador o personal',
    'Letrero o emblema de logística',
  ]);
  assert.ok(transporte.gallery.every(({ type, label, approval }) => type === 'conceptual' && label === 'Ejemplo conceptual' && approval.approvedAsRealProject === false));
});

test('elimina Papelerías y Pizzerías usa el llavero como imagen principal', () => {
  const published = getPublishedNiches();
  const pizzerias = published.find(({ id }) => id === 'pizzerias');
  assert.ok(!published.some(({ id }) => id === 'papelerias'));
  assert.equal(pizzerias.gallery.length, 4);
  assert.equal(pizzerias.image.id, 'pizzeria-llavero');
  assert.equal(pizzerias.image, pizzerias.gallery[0]);
  assert.deepEqual(pizzerias.gallery.map(({ descriptor }) => descriptor), [
    'Llavero con branding',
    'Letrero personalizado',
    'Figura decorativa temática',
    'Display de marca',
  ]);
  assert.ok(pizzerias.gallery.every(({ type, label, approval }) => type === 'conceptual' && label === 'Ejemplo conceptual' && approval.approvedAsRealProject === false));
});

test('Hamburgueserías usa la figura tres como imagen principal', () => {
  const hamburgueserias = getPublishedNiches().find(({ id }) => id === 'hamburgueserias');
  assert.equal(hamburgueserias.gallery.length, 4);
  assert.equal(hamburgueserias.image.id, 'hamburgueseria-figura');
  assert.equal(hamburgueserias.image, hamburgueserias.gallery[0]);
  assert.deepEqual(hamburgueserias.gallery.map(({ descriptor }) => descriptor), [
    'Figura de personaje o mascota',
    'Letrero personalizado',
    'Llavero con branding',
    'Display o letrero de marca',
  ]);
  assert.ok(hamburgueserias.gallery.every(({ type, label, approval }) => type === 'conceptual' && label === 'Ejemplo conceptual' && approval.approvedAsRealProject === false));
});

test('Dentistas usa el llavero como imagen principal y conserva cuatro ejemplos conceptuales', () => {
  const dentistas = getPublishedNiches().find(({ id }) => id === 'dentistas');
  assert.equal(dentistas.gallery.length, 4);
  assert.equal(dentistas.image.id, 'dentista-llavero');
  assert.equal(dentistas.image, dentistas.gallery[0]);
  assert.deepEqual(dentistas.gallery.map(({ descriptor }) => descriptor), [
    'Llavero temático',
    'Placa o señalización',
    'Figura decorativa',
    'Branding decorativo para recepción',
  ]);
  assert.ok(dentistas.gallery.every(({ type, label, approval }) => type === 'conceptual' && label === 'Ejemplo conceptual' && approval.approvedAsRealProject === false));
});

test('Hoteles usa el display informativo tres como imagen principal', () => {
  const hoteles = getPublishedNiches().find(({ id }) => id === 'hoteles');
  assert.equal(hoteles.gallery.length, 4);
  assert.equal(hoteles.image.id, 'hotel-display-informativo');
  assert.equal(hoteles.image, hoteles.gallery[0]);
  assert.deepEqual(hoteles.gallery.map(({ descriptor }) => descriptor), [
    'Display informativo para huéspedes',
    'Placa de habitación',
    'Organizador para recepción',
    'Señal colgante para habitación',
  ]);
  assert.ok(hoteles.gallery.every(({ type, label, approval }) => type === 'conceptual' && label === 'Ejemplo conceptual' && approval.approvedAsRealProject === false));
});

test('Boda reemplaza Joyerías y usa la figura de novios como imagen principal', () => {
  const published = getPublishedNiches();
  const boda = published.find(({ id }) => id === 'boda');
  assert.ok(!published.some(({ id }) => id === 'joyerias'));
  assert.equal(boda.categoryId, 'negocios');
  assert.equal(boda.order, 2);
  assert.equal(boda.gallery.length, 4);
  assert.equal(boda.image.id, 'boda-figura-novios');
  assert.equal(boda.image, boda.gallery[0]);
  assert.deepEqual(boda.gallery.map(({ descriptor }) => descriptor), [
    'Figura personalizada de novios',
    'Letrero de bienvenida',
    'Adorno para pastel',
    'Número de mesa decorativo',
  ]);
  assert.ok(boda.gallery.every(({ type, label, approval }) => type === 'conceptual' && label === 'Ejemplo conceptual' && approval.approvedAsRealProject === false));
});

test('Escuelas reemplaza Farmacias y publica el identificador para lápiz como imagen principal', () => {
  const published = getPublishedNiches();
  const escuelas = published.find(({ id }) => id === 'escuelas');
  assert.ok(!published.some(({ id }) => id === 'farmacias'));
  assert.equal(escuelas.categoryId, 'industria');
  assert.equal(escuelas.order, 3);
  assert.equal(escuelas.gallery.length, 4);
  assert.equal(escuelas.image.id, 'escuela-identificador-lapiz');
  assert.equal(escuelas.image, escuelas.gallery[0]);
  assert.deepEqual(escuelas.gallery.map(({ descriptor }) => descriptor), [
    'Identificador personalizado para lápiz',
    'Llavero escolar con nombre',
    'Organizador para útiles',
    'Separador personalizado',
  ]);
  assert.ok(escuelas.gallery.every(({ type, label, approval }) => type === 'conceptual' && label === 'Ejemplo conceptual' && approval.approvedAsRealProject === false));
});

test('Gimnasios usa el letrero Power Gym cuatro como imagen principal', () => {
  const gimnasios = getPublishedNiches().find(({ id }) => id === 'gimnasios');
  assert.equal(gimnasios.gallery.length, 4);
  assert.equal(gimnasios.image.id, 'gym-letrero-power');
  assert.equal(gimnasios.image, gimnasios.gallery[0]);
  assert.deepEqual(gimnasios.gallery.map(({ descriptor }) => descriptor), [
    'Letrero o placa con marca del gimnasio',
    'Trofeo personalizado',
    'Llavero con branding',
    'Figura de coach o personaje',
  ]);
  assert.ok(gimnasios.gallery.every(({ type, label, approval }) => type === 'conceptual' && label === 'Ejemplo conceptual' && approval.approvedAsRealProject === false));
});

test('ocultar, publicar y agregar contenido son operaciones de datos aisladas', () => {
  const hidden = updateNiche(niches, 'pizzerias', { publicationStatus: PUBLICATION_STATES.HIDDEN });
  assert.ok(!getPublishedNiches(hidden).some(({ id }) => id === 'pizzerias'));
  const draft = { ...niches[0], id: 'nuevo-nicho', slug: 'nuevo-nicho', order: 3, publicationStatus: PUBLICATION_STATES.PUBLISHED_DEMO };
  assert.ok(getPublishedNiches([...niches, draft]).some(({ id }) => id === 'nuevo-nicho'));
});

test('impide publicacion invalida, concepto sin etiqueta y proyecto real no aprobado', () => {
  const base = niches[0];
  const conceptual = niches.find(({ image }) => image.type === 'conceptual');
  assert.equal(validateNiche({ ...base, applications: [] }).valid, false);
  assert.match(validateNiche({ ...conceptual, image: { ...conceptual.image, label: '' } }).errors.join(','), /concept-label/);
  assert.match(validateNiche({ ...base, image: { ...base.image, type: 'real', approval: { approvedAsRealProject: false } } }).errors.join(','), /real-approval/);
  assert.match(validateNiche({ ...base, seo: { ...base.seo, indexIndividualPage: true } }).errors.join(','), /individual-seo/);
});

test('todos los recursos OpenArt siguen identificados como conceptos y demostracion', () => {
  for (const record of niches.filter(({ image }) => image.source === 'OpenArt')) {
    assert.equal(record.image.type, 'conceptual');
    assert.equal(record.image.label, 'Ejemplo conceptual');
    assert.equal(record.image.approval.approvedAsRealProject, false);
    assert.equal(record.commercialApproval, 'approved-2026-07-20-user-decision');
  }
});

test('registra la referencia visual aprobada sin convertir conceptos en proyectos reales', () => {
  assert.equal(VISUAL_REFERENCE.approvalStatus, 'approved-reference');
  assert.deepEqual(VISUAL_REFERENCE.palette, ['negro', 'gris', 'amarillo']);
  assert.match(VISUAL_REFERENCE.background, /oscuro/i);
  assert.ok(niches.filter(({ image }) => image.type === 'conceptual').every(({ image }) => image.approval.approvedAsRealProject === false));
});
