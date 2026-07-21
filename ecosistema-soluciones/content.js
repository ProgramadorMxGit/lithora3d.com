/**
 * Fuente estatica mantenible del Ecosistema Lithora 3D.
 * Los nueve nichos fueron aprobados para esta fase el 2026-07-20.
 * Las imagenes OpenArt siguen siendo ejemplos conceptuales, nunca proyectos reales.
 */

export const PUBLICATION_STATES = Object.freeze({ PUBLISHED: 'published', PUBLISHED_DEMO: 'published-demo', HIDDEN: 'hidden', DRAFT: 'draft' });

export const WHATSAPP_CHANNEL = Object.freeze({
  type: 'whatsapp',
  phoneDisplay: '+52 833 108 0178',
  destination: 'https://wa.me/528331080178',
});

export const VISUAL_REFERENCE = Object.freeze({
  approvalStatus: 'approved-reference',
  source: 'user-provided references',
  intent: 'Modelos 3D listos para imprimir agrupados por nicho, con estetica publicitaria comercial y lectura inmediata.',
  palette: ['negro', 'gris', 'amarillo'],
  background: 'oscuro elegante',
  usageRule: 'Referencia para activos futuros; conservar Ejemplo conceptual salvo evidencia aprobada de proyecto real.',
});

export const categories = Object.freeze([
  { id: 'negocios', name: 'Negocios', description: 'Haz visible tu marca y mejora tu operacion.', order: 1, status: 'published', anchor: 'negocios' },
  { id: 'industria', name: 'Industria', description: 'Organiza espacios profesionales y puntos de servicio.', order: 2, status: 'published', anchor: 'industria' },
  { id: 'eventos', name: 'Eventos', description: 'Refuerza experiencias de hospitalidad y encuentro.', order: 3, status: 'published', anchor: 'eventos' },
  { id: 'diseno-prototipos', name: 'Diseño y prototipos', description: 'Convierte una identidad en objetos personalizados que puedas evaluar.', order: 4, status: 'published', anchor: 'diseno-prototipos' },
]);

const conceptualApproval = Object.freeze({ status: 'concept-only', owner: 'Responsable comercial de Lithora 3D', approvedAsRealProject: false });
const missingImage = (id) => ({ id, src: null, width: 960, height: 720, alt: '', type: 'missing', label: 'Sin imagen disponible', source: 'none', approval: conceptualApproval, visualReference: VISUAL_REFERENCE });
const conceptualImage = ({ id, src, alt, descriptor, source = 'OpenArt' }) => ({ id, src, width: 960, height: 720, alt, type: 'conceptual', label: 'Ejemplo conceptual', descriptor, source, approval: conceptualApproval, visualReference: VISUAL_REFERENCE });
const baseCta = (label) => ({
  label,
  availability: 'available',
  channel: WHATSAPP_CHANNEL.type,
  destination: WHATSAPP_CHANNEL.destination,
  suggestedMessage: 'Hola, quiero cotizar una solución para [NICHO] en la categoría [CATEGORÍA]. Me interesa algo parecido a [APLICACIÓN].',
});
const niche = (value) => Object.freeze({
  description: value.problem,
  services: [],
  personalizationNotice: 'Estos productos son ejemplos y puntos de partida; cada propuesta puede adaptarse a la identidad y contexto del negocio.',
  publicationStatus: PUBLICATION_STATES.PUBLISHED,
  commercialApproval: 'approved-2026-07-20-user-decision',
  updatedAt: '2026-07-20',
  seo: { indexIndividualPage: false, title: value.name, description: value.benefit },
  ...value,
});

const barberGallery = Object.freeze([
  conceptualImage({ id: 'barber-letrero-clasico', src: '../assets/barber/barber-letrero-clasico.webp', alt: 'Ejemplo conceptual de letrero 3D personalizado para una barbería', descriptor: 'Letrero personalizado', source: 'Referencia conceptual aportada por el usuario' }),
  conceptualImage({ id: 'barber-llavero', src: '../assets/barber/barber-llavero.webp', alt: 'Ejemplo conceptual de llavero 3D con identidad visual para barbería', descriptor: 'Llavero con branding', source: 'Referencia conceptual aportada por el usuario' }),
  conceptualImage({ id: 'barber-figura', src: '../assets/barber/barber-figura.webp', alt: 'Ejemplo conceptual de figura 3D decorativa con temática de barbería', descriptor: 'Figura decorativa temática', source: 'Referencia conceptual aportada por el usuario' }),
  conceptualImage({ id: 'barber-display', src: '../assets/barber/barber-display.webp', alt: 'Ejemplo conceptual de placa o display 3D de marca para una barbería', descriptor: 'Placa o display de marca', source: 'Referencia conceptual aportada por el usuario' }),
]);

const transportGallery = Object.freeze([
  conceptualImage({ id: 'transporte-display-ruta', src: '../assets/transporte/transporte-display-ruta.webp', alt: 'Ejemplo conceptual de display 3D personalizado para una empresa de transporte', descriptor: 'Display de ruta o unidad', source: 'Referencia conceptual aportada por el usuario' }),
  conceptualImage({ id: 'transporte-llavero', src: '../assets/transporte/transporte-llavero.webp', alt: 'Ejemplo conceptual de llavero 3D con identidad visual para transporte', descriptor: 'Llavero con branding', source: 'Referencia conceptual aportada por el usuario' }),
  conceptualImage({ id: 'transporte-figura', src: '../assets/transporte/transporte-figura.webp', alt: 'Ejemplo conceptual de figura 3D de personal para una empresa de transporte', descriptor: 'Figura de operador o personal', source: 'Referencia conceptual aportada por el usuario' }),
  conceptualImage({ id: 'transporte-emblema', src: '../assets/transporte/transporte-emblema.webp', alt: 'Ejemplo conceptual de emblema 3D personalizado para una empresa de logística', descriptor: 'Letrero o emblema de logística', source: 'Referencia conceptual aportada por el usuario' }),
]);

const pizzeriaGallery = Object.freeze([
  conceptualImage({ id: 'pizzeria-llavero', src: '../assets/pizzeria/pizzeria-llavero.webp', alt: 'Ejemplo conceptual de llavero 3D con identidad visual para una pizzería', descriptor: 'Llavero con branding', source: 'Referencia conceptual aportada por el usuario' }),
  conceptualImage({ id: 'pizzeria-letrero', src: '../assets/pizzeria/pizzeria-letrero.webp', alt: 'Ejemplo conceptual de letrero 3D personalizado para una pizzería', descriptor: 'Letrero personalizado', source: 'Referencia conceptual aportada por el usuario' }),
  conceptualImage({ id: 'pizzeria-figura', src: '../assets/pizzeria/pizzeria-figura.webp', alt: 'Ejemplo conceptual de figura 3D decorativa con temática de pizzería', descriptor: 'Figura decorativa temática', source: 'Referencia conceptual aportada por el usuario' }),
  conceptualImage({ id: 'pizzeria-display', src: '../assets/pizzeria/pizzeria-display.webp', alt: 'Ejemplo conceptual de display 3D de marca para una pizzería', descriptor: 'Display de marca', source: 'Referencia conceptual aportada por el usuario' }),
]);

const hamburgueseriaGallery = Object.freeze([
  conceptualImage({ id: 'hamburgueseria-figura', src: '../assets/hamburgueseria/hamburgueseria-figura.webp', alt: 'Ejemplo conceptual de figura 3D de personaje para una hamburguesería', descriptor: 'Figura de personaje o mascota', source: 'Referencia conceptual aportada por el usuario' }),
  conceptualImage({ id: 'hamburgueseria-letrero', src: '../assets/hamburgueseria/hamburgueseria-letrero.webp', alt: 'Ejemplo conceptual de letrero 3D personalizado para una hamburguesería', descriptor: 'Letrero personalizado', source: 'Referencia conceptual aportada por el usuario' }),
  conceptualImage({ id: 'hamburgueseria-llavero', src: '../assets/hamburgueseria/hamburgueseria-llavero.webp', alt: 'Ejemplo conceptual de llavero 3D con identidad visual para hamburguesería', descriptor: 'Llavero con branding', source: 'Referencia conceptual aportada por el usuario' }),
  conceptualImage({ id: 'hamburgueseria-display', src: '../assets/hamburgueseria/hamburgueseria-display.webp', alt: 'Ejemplo conceptual de display 3D de marca para una hamburguesería', descriptor: 'Display o letrero de marca', source: 'Referencia conceptual aportada por el usuario' }),
]);

const dentistaGallery = Object.freeze([
  conceptualImage({ id: 'dentista-llavero', src: '../assets/dentista/dentista-llavero.webp', alt: 'Ejemplo conceptual de llavero 3D temático para una clínica dental', descriptor: 'Llavero temático', source: 'Referencia conceptual aportada por el usuario' }),
  conceptualImage({ id: 'dentista-placa-clinica', src: '../assets/dentista/dentista-placa-clinica.webp', alt: 'Ejemplo conceptual de placa 3D personalizada para una clínica dental', descriptor: 'Placa o señalización', source: 'Referencia conceptual aportada por el usuario' }),
  conceptualImage({ id: 'dentista-figura', src: '../assets/dentista/dentista-figura.webp', alt: 'Ejemplo conceptual de figura 3D decorativa de dentista', descriptor: 'Figura decorativa', source: 'Referencia conceptual aportada por el usuario' }),
  conceptualImage({ id: 'dentista-letrero', src: '../assets/dentista/dentista-letrero.webp', alt: 'Ejemplo conceptual de letrero 3D con identidad visual para una clínica dental', descriptor: 'Branding decorativo para recepción', source: 'Referencia conceptual aportada por el usuario' }),
]);

const hotelGallery = Object.freeze([
  conceptualImage({ id: 'hotel-display-informativo', src: '../assets/hotel/hotel-display-informativo.webp', alt: 'Ejemplo conceptual de display 3D informativo para huéspedes de un hotel', descriptor: 'Display informativo para huéspedes', source: 'Referencia conceptual aportada por el usuario' }),
  conceptualImage({ id: 'hotel-placa-habitacion', src: '../assets/hotel/hotel-placa-habitacion.webp', alt: 'Ejemplo conceptual de placa 3D personalizada con número de habitación', descriptor: 'Placa de habitación', source: 'Referencia conceptual aportada por el usuario' }),
  conceptualImage({ id: 'hotel-organizador-recepcion', src: '../assets/hotel/hotel-organizador-recepcion.webp', alt: 'Ejemplo conceptual de organizador 3D con identidad visual para recepción de hotel', descriptor: 'Organizador para recepción', source: 'Referencia conceptual aportada por el usuario' }),
  conceptualImage({ id: 'hotel-colgante-puerta', src: '../assets/hotel/hotel-colgante-puerta.webp', alt: 'Ejemplo conceptual de señal colgante 3D reversible para una habitación de hotel', descriptor: 'Señal colgante para habitación', source: 'Referencia conceptual aportada por el usuario' }),
]);

const bodaGallery = Object.freeze([
  conceptualImage({ id: 'boda-figura-novios', src: '../assets/boda/boda-figura-novios.webp', alt: 'Ejemplo conceptual de figura 3D personalizada de una pareja de novios', descriptor: 'Figura personalizada de novios', source: 'Referencia conceptual aportada por el usuario' }),
  conceptualImage({ id: 'boda-letrero-bienvenida', src: '../assets/boda/boda-letrero-bienvenida.webp', alt: 'Ejemplo conceptual de letrero 3D de bienvenida para una boda', descriptor: 'Letrero de bienvenida', source: 'Referencia conceptual aportada por el usuario' }),
  conceptualImage({ id: 'boda-adorno-pastel', src: '../assets/boda/boda-adorno-pastel.webp', alt: 'Ejemplo conceptual de adorno 3D personalizado para pastel de boda', descriptor: 'Adorno para pastel', source: 'Referencia conceptual aportada por el usuario' }),
  conceptualImage({ id: 'boda-numero-mesa', src: '../assets/boda/boda-numero-mesa.webp', alt: 'Ejemplo conceptual de número de mesa 3D decorativo para una boda', descriptor: 'Número de mesa decorativo', source: 'Referencia conceptual aportada por el usuario' }),
]);

const escuelaGallery = Object.freeze([
  conceptualImage({ id: 'escuela-identificador-lapiz', src: '../assets/escuela/escuela-identificador-lapiz.webp', alt: 'Ejemplo conceptual de identificador 3D personalizado para lápiz escolar', descriptor: 'Identificador personalizado para lápiz', source: 'Referencia conceptual aportada por el usuario' }),
  conceptualImage({ id: 'escuela-llavero', src: '../assets/escuela/escuela-llavero.webp', alt: 'Ejemplo conceptual de llavero 3D escolar personalizado con nombre', descriptor: 'Llavero escolar con nombre', source: 'Referencia conceptual aportada por el usuario' }),
  conceptualImage({ id: 'escuela-organizador', src: '../assets/escuela/escuela-organizador.webp', alt: 'Ejemplo conceptual de organizador 3D personalizado para útiles escolares', descriptor: 'Organizador para útiles', source: 'Referencia conceptual aportada por el usuario' }),
  conceptualImage({ id: 'escuela-separador', src: '../assets/escuela/escuela-separador.webp', alt: 'Ejemplo conceptual de separador 3D personalizado para cuaderno escolar', descriptor: 'Separador personalizado', source: 'Referencia conceptual aportada por el usuario' }),
]);

const gymGallery = Object.freeze([
  conceptualImage({ id: 'gym-letrero-power', src: '../assets/gym/gym-letrero-power.webp', alt: 'Ejemplo conceptual de letrero 3D decorativo con identidad para un gimnasio', descriptor: 'Letrero o placa con marca del gimnasio', source: 'Referencia conceptual aportada por el usuario' }),
  conceptualImage({ id: 'gym-trofeo-coach', src: '../assets/gym/gym-trofeo-coach.webp', alt: 'Ejemplo conceptual de trofeo 3D personalizado para reconocer a un coach de gimnasio', descriptor: 'Trofeo personalizado', source: 'Referencia conceptual aportada por el usuario' }),
  conceptualImage({ id: 'gym-llavero', src: '../assets/gym/gym-llavero.webp', alt: 'Ejemplo conceptual de llavero 3D personalizado con identidad de gimnasio', descriptor: 'Llavero con branding', source: 'Referencia conceptual aportada por el usuario' }),
  conceptualImage({ id: 'gym-figura-coach', src: '../assets/gym/gym-figura-coach.webp', alt: 'Ejemplo conceptual de figura 3D personalizada de un coach de gimnasio', descriptor: 'Figura de coach o personaje', source: 'Referencia conceptual aportada por el usuario' }),
]);

export const niches = Object.freeze([
  niche({ id: 'barberias', slug: 'barberias', categoryId: 'negocios', order: 1, name: 'Barberías', problem: 'La recepción y cada punto de contacto necesitan comunicar una identidad cuidada y reconocible desde el primer vistazo.', benefit: 'Agrupa piezas personalizadas que ayudan a reforzar la marca y ambientar la barbería.', applications: ['Letreros personalizados', 'Llaveros con branding', 'Figuras decorativas temáticas', 'Placas o displays de marca'], image: barberGallery[0], gallery: barberGallery, cta: baseCta('Cotizar una idea para mi barbería') }),
  niche({ id: 'boda', slug: 'boda', categoryId: 'negocios', order: 2, name: 'Boda', problem: 'Cada detalle visual de una boda debe acompañar la celebración y reflejar la identidad de la pareja.', benefit: 'Personaliza figuras, señalización y elementos decorativos para crear una experiencia coherente y memorable.', applications: ['Figuras personalizadas de novios', 'Letreros de bienvenida', 'Adornos para pastel', 'Números de mesa decorativos'], image: bodaGallery[0], gallery: bodaGallery, cta: baseCta('Cotizar detalles personalizados para mi boda') }),

  niche({ id: 'dentistas', slug: 'dentistas', categoryId: 'industria', order: 1, name: 'Dentistas', problem: 'La recepción y señalización de un consultorio deben orientar con claridad y conservar una imagen profesional.', benefit: 'Crea puntos visuales personalizados para recibir, identificar y ambientar el consultorio.', applications: ['Placas o señalización', 'Llaveros temáticos', 'Figuras decorativas', 'Branding decorativo para recepción'], image: dentistaGallery[0], gallery: dentistaGallery, cta: baseCta('Cotizar una idea para mi consultorio') }),
  niche({ id: 'transporte', slug: 'transporte', categoryId: 'industria', order: 2, name: 'Transporte', problem: 'Las unidades, rutas y puntos de atención necesitan una identidad visible y coherente que facilite el reconocimiento de la empresa.', benefit: 'Convierte la marca y la operación de transporte en piezas personalizadas para exhibición, promoción y reconocimiento.', applications: ['Displays de ruta o unidad', 'Llaveros con branding', 'Figuras de operador o personal', 'Letreros o emblemas de logística'], image: transportGallery[0], gallery: transportGallery, cta: baseCta('Cotizar una idea para mi empresa de transporte') }),
  niche({ id: 'escuelas', slug: 'escuelas', categoryId: 'industria', order: 3, name: 'Escuelas', problem: 'Los útiles y espacios escolares necesitan soluciones claras que ayuden a identificar, organizar y personalizar cada elemento.', benefit: 'Convierte nombres, símbolos y necesidades del aula en accesorios útiles y reconocibles.', applications: ['Identificadores personalizados para lápices', 'Llaveros escolares con nombre', 'Organizadores para útiles', 'Separadores personalizados'], image: escuelaGallery[0], gallery: escuelaGallery, cta: baseCta('Cotizar una idea para mi escuela') }),

  niche({ id: 'hoteles', slug: 'hoteles', categoryId: 'eventos', order: 1, name: 'Hoteles', problem: 'Cada punto de llegada, orientación y entrega de llaves forma parte de la experiencia del huésped.', benefit: 'Integra objetos de recepción y señalización que pueden personalizarse para el espacio.', applications: ['Señalización', 'Llaveros de habitación', 'Figuras decorativas', 'Branding para recepción'], image: hotelGallery[0], gallery: hotelGallery, cta: baseCta('Cotizar una idea para mi hotel') }),
  niche({ id: 'pizzerias', slug: 'pizzerias', categoryId: 'eventos', order: 2, name: 'Pizzerías', problem: 'El mostrador y las mesas necesitan comunicar opciones y marca sin depender de piezas genéricas.', benefit: 'Reúne elementos de menú, decoración y branding adaptables al concepto del negocio.', applications: ['Portamenús o menús de mostrador', 'Llaveros', 'Figuras decorativas', 'Letreros o branding del negocio'], image: pizzeriaGallery[0], gallery: pizzeriaGallery, cta: baseCta('Cotizar una idea para mi pizzería') }),
  niche({ id: 'hamburgueserias', slug: 'hamburgueserias', categoryId: 'eventos', order: 3, name: 'Hamburgueserías', problem: 'Una propuesta de comida con personalidad necesita objetos visuales fáciles de asociar con su marca.', benefit: 'Explora piezas de mostrador y personajes que pueden dar coherencia a la experiencia.', applications: ['Portamenús', 'Llaveros', 'Figuras de personaje o mascota', 'Letreros de marca'], image: hamburgueseriaGallery[0], gallery: hamburgueseriaGallery, cta: baseCta('Cotizar una idea para mi hamburguesería') }),

  niche({ id: 'gimnasios', slug: 'gimnasios', categoryId: 'diseno-prototipos', order: 1, name: 'Gimnasios', problem: 'La comunidad del gimnasio necesita objetos reconocibles que refuercen logros, pertenencia e identidad.', benefit: 'Convierte personajes, reconocimientos y marca en conceptos físicos personalizables.', applications: ['Trofeos', 'Llaveros', 'Figuras de coach o personaje', 'Letreros o placas con marca del gimnasio'], image: gymGallery[0], gallery: gymGallery, cta: baseCta('Cotizar una idea para mi gimnasio') }),

  // Control de regresion: un registro incompleto y oculto nunca debe publicarse.
  niche({ id: 'demo-incompleto-oculto', slug: 'demo-incompleto-oculto', categoryId: 'negocios', order: 99, name: 'Demostración incompleta', problem: '', benefit: '', applications: [], image: missingImage('none'), cta: null, publicationStatus: PUBLICATION_STATES.HIDDEN, commercialApproval: 'not-approved' }),
]);

export function validateNiche(record, knownCategories = categories) {
  const errors = [];
  const requiredText = ['id', 'slug', 'name', 'categoryId', 'description', 'problem', 'benefit', 'updatedAt'];
  requiredText.forEach((field) => { if (!String(record?.[field] || '').trim()) errors.push(`missing:${field}`); });
  if (!knownCategories.some((category) => category.id === record?.categoryId && category.status === 'published')) errors.push('invalid:categoryId');
  if (!Number.isFinite(record?.order)) errors.push('invalid:order');
  if (!Array.isArray(record?.applications) || record.applications.length < 4 || record.applications.length > 7) errors.push('invalid:applications');
  if (!record?.cta?.label || record.cta.availability !== 'available' || record.cta.destination !== WHATSAPP_CHANNEL.destination) errors.push('invalid:cta');
  if (!record?.image || !['real', 'conceptual', 'missing'].includes(record.image.type)) errors.push('invalid:image');
  if (record?.image?.type === 'conceptual' && record.image.label !== 'Ejemplo conceptual') errors.push('invalid:concept-label');
  if (record?.image?.type === 'real' && record.image.approval?.approvedAsRealProject !== true) errors.push('invalid:real-approval');
  if (!['published', 'published-demo', 'hidden', 'draft'].includes(record?.publicationStatus)) errors.push('invalid:publicationStatus');
  if ([PUBLICATION_STATES.PUBLISHED, PUBLICATION_STATES.PUBLISHED_DEMO].includes(record?.publicationStatus) && !String(record.commercialApproval || '').startsWith('approved-')) errors.push('invalid:commercial-approval');
  if (record?.seo?.indexIndividualPage === true && (!String(record.seo.route || '').startsWith('/') || String(record.seo.title || '').length < 10 || String(record.seo.description || '').length < 50)) errors.push('invalid:individual-seo');
  return { valid: errors.length === 0, errors };
}

export function getPublishedNiches(records = niches, knownCategories = categories) {
  const categoryOrder = new Map(knownCategories.map((category) => [category.id, category.order]));
  return records
    .filter((record) => [PUBLICATION_STATES.PUBLISHED, PUBLICATION_STATES.PUBLISHED_DEMO].includes(record.publicationStatus))
    .filter((record) => validateNiche(record, knownCategories).valid)
    .sort((left, right) => (categoryOrder.get(left.categoryId) ?? 999) - (categoryOrder.get(right.categoryId) ?? 999) || left.order - right.order || left.id.localeCompare(right.id));
}

export function updateNiche(records, id, changes, updatedAt = new Date().toISOString().slice(0, 10)) {
  return records.map((record) => record.id === id ? { ...record, ...changes, updatedAt } : record);
}
