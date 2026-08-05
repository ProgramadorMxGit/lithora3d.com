# SEO del generador de llaveros 3D

Fecha: 2026-08-05 · URL publicada: https://lithora3d.com/generador-llaveros-3d/

## El punto de partida

La herramienta existía solo como archivo local de 6 MB. No estaba en internet, así que no podía posicionar para nada. Antes de optimizar nada había que resolver dónde y cómo publicarla.

## Investigación de la SERP (Google México, `hl=es-419&gl=mx&pws=0`)

Consultas verificadas una por una:

| Consulta | Qué domina | Lectura |
|---|---|---|
| generador de llaveros 3d | MakerWorld, text3dmaker, Cults3D, Creality Cloud, vive3d.cl | Casi todo son **modelos para descargar**, no herramientas web |
| crear llavero personalizado con nombre 3d online | MakerWorld, text3dmaker, Tinkercad, Reddit | Mismo patrón |
| diseñar llaveros online gratis | CapCut, Atomm (corte láser), Pacdora (packaging), MakerWorld, text3dmaker | **SERP débil**: varios resultados ni siquiera son generadores 3D |
| llaveros personalizados con nombre impresión 3d | MercadoLibre, MakerWorld, Cults3D, Amazon, grafiklab | Comercial, pero Google **mezcla marketplaces y generadores** |

Búsquedas relacionadas que devuelve Google (datos reales, no estimaciones): *Llaveros 3D personalizados · Llaveros con nombres personalizados · Llaveros en 3D para imprimir · Llaveros para imprimir en 3D gratis · Diseñar llaveros online gratis · Precio llaveros personalizados 3D · Crear llaveros 3D online · Diseñar llavero 3D · Diseñar llaveros para imprimir en 3D*.

## El competidor a batir

`text3dmaker.com/keychain-name-generator?lang=es` aparece en el top 2 de varias consultas. Su fuerza no es el texto (526 palabras) sino el **marcado**: JSON-LD con SoftwareApplication + Offer + FAQPage + HowTo, más un clúster de ~14 herramientas hermanas enlazadas entre sí.

Sus debilidades, todas verificadas:

- **Solo exporta STL.** No tiene 3MF ni multicolor, aunque su propio texto menciona dos colores.
- **Cobra €4.99 tras dos descargas.**
- Español de España traducido, no mexicano.
- Idiomas por parámetro `?lang=`, más débil que subcarpeta, y además se canibaliza con una segunda página española (`/llaveros-3d.php`) sin canonical ni schema.
- Dos H1 en la misma página.
- Cero fotos de piezas reales.
- Es una utilidad anónima: no hay servicio detrás.

## Qué se construyó

**URL:** `/generador-llaveros-3d/` — subcarpeta del dominio existente, para que herede autoridad y para que los enlaces que gane el generador beneficien al sitio entero (que hoy tiene 0 backlinks).

**Arquitectura de peso.** El archivo portable eran 5,916 KB, de los cuales **77% eran las 15 tipografías en base64**. La versión web:

- Separa cada tipografía a un `.ttf` propio, cargado **solo al elegirla**.
- Genera micro-subconjuntos woff2 con las letras "Abc" para las miniaturas del selector: **28 KB las quince juntas**, en lugar de 3,515 KB.
- Precarga solo la tipografía por defecto (Poppins Bold).

Resultado medido en producción, con la compresión real de GitHub Pages:

| | Peso |
|---|---|
| Versión portable (un solo archivo) | 5,916 KB |
| Versión web, carga inicial comprimida | **483 KB** |
| Reducción | **92%** |

**Una sola fuente de verdad.** `plantilla.py` regenera `index.html` leyendo el marcado directamente del archivo portable, así que las dos versiones no pueden divergir. Para actualizar: editar el portable y ejecutar `python plantilla.py`.

**Contenido indexable:** 1,080 palabras y 12 preguntas frecuentes visibles, cubriendo las 6 del competidor más las que ninguno responde (ñ y tildes, dos colores sin AMS, PLA contra PETG, si se pueden vender, qué pasa si no tienes impresora).

**JSON-LD:** BreadcrumbList + SoftwareApplication con Offer a precio 0 + HowTo de 3 pasos + FAQPage con las 12 preguntas. **Sin AggregateRating**: no hay reseñas reales que citar y inventarlas sería exactamente lo que las reglas del proyecto prohíben.

**Diferenciadores en el title y la descripción**, que son justo lo que el competidor no puede igualar: 3MF multicolor y descargas ilimitadas sin registro.

**Enlaces internos:** menú Recursos de la portada y navegación de servicio, precios y prototipado. Añadida al sitemap.

## Validación

- Lighthouse móvil: **100 accesibilidad · 100 buenas prácticas · 100 SEO · 100 navegación agéntica**.
- Suite del proyecto: 89/89.
- STL exportado desde la versión web: 7,060 triángulos, **malla estanca**, tamaño de archivo exacto.
- Comportamiento idéntico al portable (misma placa de 152×25 mm con los mismos nombres).
- Carga bajo demanda comprobada: Montserrat (728 KB) solo se descarga al seleccionarla.
- Indexación solicitada en Search Console.

Tres defectos de accesibilidad que salieron a la luz se corrigieron **también en el archivo portable**: un `role="tablist"` inválido, el "Abc" decorativo contando como nombre visible de la tarjeta, y enlaces con contraste de 2.6:1.

## Qué esperar, con honestidad

La página es nueva y el dominio sigue sin backlinks. Lo que sí es cierto y verificable: la demanda existe, el terreno en español es débil, y el producto es objetivamente mejor que el del líder actual en los dos ejes que más importan al usuario (formato y precio).

Plazo realista: primeras impresiones en semanas, posiciones útiles en dos a cuatro meses. Y esta página, a diferencia de las landings de servicio, sí puede atraer enlaces por sí sola, que es lo que le falta al dominio entero.

## Siguientes pasos recomendados

1. **Fotos reales** de llaveros impresos con nombre visible. Los cuatro competidores usan renders; es la señal de confianza más rápida y da imágenes indexables.
2. **Clúster de herramientas**, que es la jugada que hace rankear a text3dmaker: el mismo motor con landings propias para placa de mascota, identificador escolar, topper de pastel y letrero de puerta. Cada una con su H1 y su FAQ.
3. **Difundir donde vive el público maker**: comunidades de impresión 3D, MakerWorld, Printables. Es el camino natural a los primeros backlinks legítimos.
4. **Medir** en Search Console a las 4 semanas: qué consultas nuevas aparecen y si la página capta impresiones propias.
