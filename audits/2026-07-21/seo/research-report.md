# Investigacion SEO — Lithora 3D

Fecha: 2026-07-21

## Alcance y metodo

Investigacion manual en Chrome DevTools sobre la produccion actual y resultados de Google Mexico sin personalizacion (`hl=es`, `gl=mx`, `pws=0`). No se usaron buscadores alternos, APIs de palabras clave ni scraping externo. Las posiciones son una fotografia puntual, no una garantia de posicion futura.

## Diagnostico principal

- El dork `site:lithora3d.com` mostro solamente la portada como resultado visible y Google aun presento un titulo/snippet anterior al despliegue actual.
- La sesion de Google disponible no tiene acceso a la propiedad de dominio `lithora3d.com` en Search Console. Sin esa propiedad no es posible consultar impresiones, consultas reales, cobertura ni solicitar indexacion desde esta sesion.
- La arquitectura indexable actual contiene seis URL validas, canonicas y enlazadas: inicio, servicio, precios, prototipado, materiales y soluciones.
- La portada ya tiene una base tecnica fuerte: canonical, robots, H1 unico, metadatos sociales y JSON-LD de Organization, WebSite, Service y FAQPage.
- La oportunidad no esta en crear cientos de paginas delgadas. Esta en reforzar la utilidad visible de las cinco landings, alinear su contenido con preguntas reales y acelerar el descubrimiento de las URL ya existentes.

## Resultados de busqueda observados

### `impresion 3d Mexico`

SERP mixta entre servicios, marketplaces y venta de impresoras/filamentos. Competencia visible: impresion3d.mx, 3dmarket.mx, Mexico Makers, impresion3dmexico.com.mx, Century 3D y Concepto 3D. La consulta es amplia y ambigua; no debe ser la unica apuesta.

### `servicio de impresion 3d Tampico`

Lithora no aparecio. Google mostro un paquete local y resultados de Facebook, Instagram y un competidor local con contenido muy breve. Es una oportunidad importante, pero no se debe crear una landing local ni datos `LocalBusiness` hasta confirmar publicamente ciudad, direccion o modalidad de cobertura.

### `"servicio de impresion 3d" Mexico`

El primer resultado organico observado (`serviciodeimpresion3d.com.mx`) llevo a una aplicacion de Replit no disponible. Esto deja espacio para una pagina de servicio estable, clara y con mejor evidencia.

### `precio impresion 3d Mexico`

La SERP mezcla calculadoras, precios por minuto, marketplaces y articulos. Preguntas visibles: cuanto se cobra por impresion, cuanto cuesta una pieza y si se cobra por hora. Lithora no debe inventar una tarifa universal; debe responder de forma visible como se calcula, que informacion reduce incertidumbre y por que una cotizacion depende del proyecto.

### `prototipado rapido Mexico`

Predominan proveedores industriales, laboratorios y guias. La pagina actual de Lithora cubre forma, ajuste y funcion, pero necesita preguntas visibles y contexto de proceso para competir como recurso util.

### `materiales impresion 3d PLA PETG TPU Mexico`

Predomina intencion de compra de filamento. Las preguntas visibles comparan PLA, PETG y TPU. Lithora debe diferenciarse con intencion de servicio: elegir material para una pieza, no vender filamento.

### `impresion 3d bajo demanda Mexico`

Los resultados resaltan envio de archivos, materiales, cotizacion, fabricacion localizada y ausencia de inventario. La pagina de servicio ya puede cubrir esta intencion sin crear otra URL que compita con ella.

### `piezas personalizadas impresion 3d Mexico`

Los resultados y la vision general piden tipo de pieza, archivo o referencia, material y codigo postal. La oportunidad es explicar con claridad que Lithora revisa una pieza unica, un archivo o una referencia y enlazar directamente a cotizacion.

### `letreros 3d personalizados para negocios Mexico`

La SERP esta dominada por rotulacion, acrilico, aluminio, PVC y marketplaces. No conviene posicionar Lithora como empresa de anuncios luminosos: las ideas para negocios deben seguir presentandose como ejemplos conceptuales de impresion 3D, sin cambiar el giro.

## Prioridades de implementacion

1. Hacer visibles y coherentes las preguntas que ya se declaran en FAQPage; nunca publicar schema con respuestas que el usuario no pueda leer en la pagina.
2. Reforzar las landings de precios, materiales y prototipado con preguntas observadas en SERP, respuestas propias y enlaces internos contextuales.
3. Unificar entidades JSON-LD mediante IDs estables y agregar el telefono/WhatsApp aprobado como `ContactPoint`, sin inventar direccion ni perfiles sociales.
4. Incorporar `dateModified`, `inLanguage` y un sitemap con `lastmod`; agregar metadatos de imagen para el contenido conceptual elegible.
5. Quitar lenguaje interno como `BOFU` o "busquedas clave" de la experiencia y del HTML de la portada.
6. Verificar Search Console y enviar el sitemap como siguiente accion externa; medir consultas reales antes de crear nuevas paginas.

## Limites y expectativa realista

Ninguna correccion tecnica puede garantizar miles de visitas diarias. Para llegar a ese volumen se necesita demanda comprobada, indexacion, autoridad, contenido sostenido, enlaces/referencias legitimas y medicion durante meses. La meta local de esta fase es dejar una base rastreable, util y medible sin convertir el sitio en otra clase de negocio.

## Evidencia DevTools

- Produccion auditada: `https://lithora3d.com/` y las cinco rutas canonicas internas.
- Dork auditado: `https://www.google.com/search?q=site%3Alithora3d.com&hl=es&gl=mx&pws=0`.
- Search Console auditado: `https://search.google.com/search-console?resource_id=sc-domain:lithora3d.com`.
- Competidores inspeccionados: `https://www.impresion3dtampico.com/` y `https://www.serviciodeimpresion3d.com.mx/`.
- Capturas textuales: `google-site-index.txt` y `search-console-not-verified.txt` en esta misma carpeta.
