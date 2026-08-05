# Auditoría y optimización SEO — Lithora 3D

Fecha: 2026-08-05 · Rama: `seo/auditoria-optimizacion` (3 commits, sin publicar)

## 1. Resumen ejecutivo

Estado actual: el sitio es técnicamente sólido (Lighthouse 100/100/100 en A11y/Best Practices/SEO, LCP 797 ms y CLS 0.02 bajo Slow 4G + CPU 4x, las 7 URLs indexadas, sitemap correcto, canonicals y redirecciones bien configuradas). El problema no es técnico: es un dominio de ~2 semanas en el índice, con 0 enlaces externos y una huella de solo 7 consultas visibles.

Lectura correcta de los datos preliminares: la "posición media 45.7" es un promedio engañoso. Segmentado por país: **México = posición 9.2, CTR 10.8%, los 4 clics**; España = 68 de las 107 impresiones a posición 65 (consultas informativas de "prototipado rápido" sin valor comercial). En su mercado real, el sitio ya rankea top-10 en las pocas consultas donde aparece.

Causas raíz (por impacto):
1. **Autoridad nula**: 0 backlinks conocidos por Google; dominio nuevo. Bloquea cualquier consulta nacional competida.
2. **Ausencia del ecosistema local de Google**: sin Perfil de Empresa de Google; el pack local de "impresion 3d tampico" lo ocupan competidores más débiles (páginas de Facebook). Lithora ya es #4 orgánico con solo la portada.
3. **Desalineación de intención en /prototipado-rapido/**: la SERP de "prototipado rapido" es informativa (Formlabs, Miro, Figma, Wikipedia, UNAM); una landing de servicio a posición 62 no puede ganarla. Corregido: reorientada a "servicio de prototipado rápido en México".
4. **Huella de consultas mínima**: 7 páginas, titles genéricos sin geo/intención en las landings internas. Corregido parcialmente.
5. **Previews sociales rotos**: og:image en SVG (WhatsApp/Facebook no lo renderizan) en el canal principal de conversión. Corregido.

## 2. Inventario técnico

- Stack: HTML estático + Tailwind precompilado, sin framework ni build de producción.
- Hosting: GitHub Pages (repo `ProgramadorMxGit/lithora3d.com`, rama main, gzip, cache 600 s). DNS: Cloudflare (Namecheap registrador).
- Renderizado: 100% estático — todo el contenido visible en el HTML inicial (óptimo para rastreo).
- Analítica: dataLayer preparado pero **sin proveedor conectado** (sin GA4/GTM). Sin medición de conversiones.
- Formulario de cotización → handoff a WhatsApp (+52 833 108 0178) vía Tally/quote-channel.
- Tests: suite propia de 89 pruebas (`npm run validate`), incluye auditoría estática SEO.

## 3. Hallazgos (tabla)

| ID | Problema | Evidencia | Severidad | Estado |
|----|----------|-----------|-----------|--------|
| H1 | og:image SVG no soportado por WhatsApp/FB | Todas las páginas usaban og-card.svg | P1 | ✅ Corregido (JPEG 48 KB + dimensiones) |
| H2 | /cotizar/ sin og:image | head de cotizar/index.html | P1 | ✅ Corregido |
| H3 | Fondo hero 1.36 MB PNG precargado | fondo_web.png, preload fetchpriority=high | P2 | ✅ Corregido (WebP 35 KB, −97%) |
| H4 | Title/H1 de prototipado apuntan a consulta informativa inganable | GSC: pos 62.1, 43 imp, 0 clics; SERP dominada por guías | P1 | ✅ Corregido (intención transaccional + México) |
| H5 | Landing prototipado corta, sin proceso/archivos/tiempos/costo | Comparación con SERP y PAA | P1 | ✅ Corregido (+1 sección alcance, +3 FAQs visibles y en schema) |
| H6 | Titles internos sin geo/intención | servicio, precios, materiales | P1 | ✅ Corregido |
| H7 | Sin Perfil de Empresa de Google | Pack local de "impresion 3d tampico" sin Lithora | P0 comercial | ⚠️ Requiere al propietario (verificación) |
| H8 | 0 enlaces externos | GSC informe Enlaces | P1 | ⚠️ Requiere acción externa continua |
| H9 | Analítica sin conectar (sin GA4) | OPERATIONS.md, dataLayer no-op | P1 | ⚠️ Decisión de privacidad del propietario |
| H10 | Informe de indexación GSC decía 5 URLs sin indexar | Informe del 23/7 desactualizado; inspección en vivo: todas indexadas | — | ✅ Sin acción (validación ya iniciada 4/8) |
| H11 | subtítulo del og-card.svg desbordaba el lienzo | Render 1200×630 | P3 | ✅ Corregido |

## 4. Search Console (propiedad https://lithora3d.com/, cuenta yon.dev.official@gmail.com)

- Datos desde 20/7/2026 (~2 semanas). 4 clics, 107 impresiones, CTR 3.7%, pos. media 45.7.
- Por país: México 4 clics/37 imp/pos 9.2/CTR 10.8% · España 0/68/pos 65.5 · EUA 0/2.
- Por consulta: prototipado rapido 43 imp pos 62.1 · prototipado rápido 15 imp pos 63.7 · prototipado rápido de hardware y software 9 imp pos 86 · prototipo rapido 3 imp pos 49.3 · **impresion 3d tampico 2 imp pos 6.5** · prototipos rápidos 1 · métodos de prototipado rápido 1.
- Por página: home 4 clics/35 imp/**pos 6.0**/CTR 11.4% · /prototipado-rapido/ 0/72/pos 65 · /servicio-impresion-3d/ 0/7/**pos 4.3** · /precios-impresion-3d/ 0/4/pos 7 · /materiales-impresion-3d/ 0/1/pos 4.
- Indexación: 7/7 páginas indexadas (verificado con Inspección de URLs en vivo; el informe agregado del 23/7 estaba obsoleto). Sitemap enviado 27/7, última lectura 3/8, estado Correcto. Breadcrumbs: 5 válidos. HTTPS: correcto. Core Web Vitals: sin datos (tráfico insuficiente).
- Enlaces externos: **0**. Enlaces internos reconocidos: 9.
- No hay canibalización: cada consulta activa una sola URL coherente.

## 5. SERP y competidores

- "prototipado rapido" (MX): intención informativa. Top: ESDESIGN, Miro, Formlabs, Weerg, Wikipedia, UNAM, Figma, Markforged. PAA: qué significa, metodología, tipos. → No perseguir con landing de servicio; capturar variantes "servicio de…" y long-tail con FAQ.
- "impresion 3d tampico": pack local (Impresiones 3D, Servicios Digitales Salem, Impublic 3D) + orgánico: FB de Impresion 3D Tampico, impresion3dtampico.com, Instagram, **Lithora #4**. Competencia web débil (el líder es una página de Facebook). → Con GBP + señales locales, el top-3 local es alcanzable a corto plazo.
- "servicio de impresion 3d mexico": dominan impresion3d.mx, serviciodeimpresion3d.com.mx, concepto3d.mx, century3d, MercadoLibre. Lithora ausente (autoridad). → Objetivo de mediano plazo.

## 6. Mapa de palabras clave (clústeres)

| Clúster | Principal | Página | Prioridad |
|---------|-----------|--------|-----------|
| Local Tampico/Madero/Altamira | impresión 3d tampico (+cerca de mí, madero, altamira) | Home (+GBP) | **P0** |
| Servicio nacional | servicio de impresión 3d méxico, impresión 3d bajo pedido | /servicio-impresion-3d/ | P1 |
| Prototipado transaccional | servicio de prototipado rápido, prototipos impresos en 3d méxico | /prototipado-rapido/ | P1 |
| Precio | cuánto cuesta imprimir en 3d, cotizar impresión 3d | /precios-impresion-3d/ | P1 |
| Materiales (servicio, no venta) | qué material elegir para una pieza 3d | /materiales-impresion-3d/ | P2 |
| Personalizados/negocios | figuras/llaveros/letreros personalizados 3d | /ecosistema-soluciones/ | P2 |

## 7. Cambios implementados (rama seo/auditoria-optimizacion)

1. `319016c` fix(seo): og:image JPEG 1200×630 (48 KB) + width/height/type/alt en las 7 páginas; og:image nuevo en /cotizar/; texto del SVG corregido.
2. `630d2fc` fix(performance): fondo hero WebP 35 KB (antes 1.36 MB PNG), preload y cache-buster actualizados.
3. `be65611` feat(content): landing prototipado reorientada a intención transaccional (title/H1/desc "Servicio de prototipado rápido… en México"), nueva sección de alcance honesto (FDM, PLA/PETG; referencia clara cuando el proyecto exige SLS/mecanizado), 3 FAQs nuevas visibles y espejadas en FAQPage JSON-LD, enlaces contextuales a servicio/materiales/precios; titles con intención en servicio/precios/materiales; sitemap lastmod 2026-08-05; test estático actualizado.

Validación: `npm run validate` 89/89 ✅ · JSON-LD de las 7 páginas parsea ✅ · Lighthouse móvil (prototipado, después): 100/100/100 ✅ · consola y red sin errores en local ✅ · hero visualmente idéntico con WebP ✅.

## 8. Antes / después (técnico)

| Métrica | Antes | Después |
|---------|-------|---------|
| Preview WhatsApp/FB | Rota (SVG) | Funcional (JPEG 48 KB) |
| Peso fondo hero | 1,362 KB | 35 KB |
| Title prototipado | "Prototipado rápido \| Lithora 3D" | "Servicio de prototipado rápido con impresión 3D en México \| Lithora 3D" |
| FAQs visibles prototipado | 3 | 6 (+schema) |
| Lighthouse (A11y/BP/SEO) | 100/100/100 | 100/100/100 (sin regresión) |
| Tests | 89/89 | 89/89 |

Las métricas de búsqueda (impresiones, clics, posiciones) solo podrán compararse en 2–8 semanas tras el despliegue.

## 9. Plan 30/60/90

**0–7 días (propietario + despliegue):**
- Merge de `seo/auditoria-optimizacion` a `main` y push (despliega GitHub Pages).
- Crear **Perfil de Empresa de Google** (categoría "Servicio de impresión 3D"; área de servicio Tampico/Madero/Altamira; enlace a /cotizar/; fotos reales de piezas). Es la acción individual de mayor impacto comercial.
- Conectar GA4 (el dataLayer ya emite 9 eventos) — decisión de privacidad pendiente del propietario.
- En GSC: tras el deploy, "Solicitar indexación" de las 4 páginas modificadas (prototipado, servicio, precios, materiales).

**2–8 semanas:**
- Primeros enlaces legítimos: directorios mexicanos relevantes, perfil en comunidades maker, proveedores locales, 1–2 clientes que acepten mencionar el trabajo.
- Publicar 2 recursos enlazables honestos: "Cómo preparar un STL para cotizar" y "Cuánto cuesta imprimir en 3D en México (factores reales)" apoyando /precios/.
- Fotos reales de trabajos en home y ecosistema (sustituir progresivamente conceptos IA por evidencia).
- Pedir reseñas auténticas en GBP a los primeros clientes.

**2–6 meses:**
- Medir consultas nuevas en GSC y decidir con datos si se separan landings (p. ej. /impresion-3d-para-empresas/) — no crear páginas sin demanda comprobada.
- Consolidar top-3 local y top-10 en "servicio de prototipado rápido" variantes.
- Casos de estudio documentados con clientes reales.

## 10. Backlog priorizado

- P0: merge+deploy · GBP · solicitar indexación post-deploy.
- P1: GA4 · primeros backlinks · reseñas GBP · fotos reales.
- P2: guía STL · artículo de costos · imágenes responsive (srcset) del hero · og:image específico por página.
- P3: video de cotización más ligero (17 MB mp4) · LocalBusiness schema cuando exista dirección/área pública confirmada.

## 11. Reporte honesto

- Se corrigió todo lo que era seguro y no requería decisiones comerciales: previews sociales, rendimiento del hero, intención/contenido de prototipado, titles, sitemap.
- **Desplegado a producción el 2026-08-05 con autorización del propietario** (merge `6e932f7` a main, GitHub Pages workflow verificado, activos y títulos nuevos confirmados en vivo). Indexación re-solicitada en GSC para /, /prototipado-rapido/, /servicio-impresion-3d/, /precios-impresion-3d/ y /materiales-impresion-3d/ ("Se ha solicitado la indexación" confirmado en las cinco).
- No se creó el Perfil de Empresa de Google (requiere verificación del propietario) ni se conectó analítica (decisión de privacidad).
- No se crearon páginas nuevas: con 2 semanas de datos no hay evidencia de demanda que las justifique; sería contenido delgado.
- Los resultados de posicionamiento no pueden garantizarse; la probabilidad de top-3 local es alta por la debilidad competitiva observada, la nacional requiere meses y autoridad.
- Acceso GSC usado: propiedad URL-prefix en la cuenta yon.dev.official@gmail.com (la cuenta lithora3d@gmail.com no tiene la propiedad verificada — conviene añadirla como propietaria y crear la propiedad de dominio sc-domain para datos completos).
