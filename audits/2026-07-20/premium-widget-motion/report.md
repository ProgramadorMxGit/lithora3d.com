# Informe de validación — Premium Widget Motion

Fecha: 2026-07-20
Estado local: aprobado
Rutas: `/precios-impresion-3d/`, `/prototipado-rapido/`, `/materiales-impresion-3d/`, `/ecosistema-soluciones/`

## Resultado

La fase quedó implementada sobre el sitio existente mediante contratos nominales, CSS y WAAPI propios. No se incorporaron React, React Bits, GSAP, canvas, WebGL, paquetes ni solicitudes de red para motion. La home y las rutas fuera de alcance no cargan el motor.

- 44/44 contratos presentes: 19 A, 13 B, 10 C y 2 D.
- `assets/motion-pages.css` 18,935 bytes + `assets/motion-pages.js` 14,181 bytes = 33,116 bytes (32.34 KB), debajo de 35 KB.
- Un `IntersectionObserver`, diez listeners delegados, cero `ScrollTrigger` y cero animaciones activas después del asentamiento.
- 81/81 pruebas automatizadas; fuente de contenido sincronizada; sintaxis y enlaces estáticos aprobados.
- 20/20 combinaciones responsive sin overflow horizontal: 320, 375, 768, 1024 y 1440 px en las cuatro rutas.
- Lighthouse desktop: 100 accesibilidad / 100 buenas prácticas / 100 SEO / 100 navegación agéntica en las cuatro rutas.
- Trazas locales: LCP Precios 110 ms, Prototipado 115 ms, Materiales 115 ms, Soluciones 393 ms; CLS 0.00 en las cuatro; INP observado en Soluciones 34 ms.

## Correcciones realizadas durante la auditoría

1. Las expectativas heredadas se actualizaron para aceptar los contratos nominales sin dejar de comprobar contenido e imágenes.
2. Las capas Spotlight y especular se colocaron sobre el fondo y debajo del contenido.
3. El CDN runtime de Tailwind se sustituyó por tres hojas estáticas locales; las consolas quedaron limpias.
4. Se eliminó una regla global de `position: relative` que superponía dos pares de targets del mapa; Lighthouse pasó de 96 a 100 en accesibilidad.
5. Las seis fichas de materiales aceptan foco de teclado y muestran outline, borde y Spotlight equivalentes.
6. `pagehide` conserva observer/listeners cuando la página entra a bfcache; volver con historial mantiene observer 1, listeners 10 y `cleaned: false`.

## Evidencia por widget

| Widgets | Nivel | Estado | Evidencia principal |
|---|:---:|---|---|
| PRI-W01, PRI-W02 | C | Aprobados | `prices-desktop.webp`, `prices-mobile.webp`, prueba de H1/contratos |
| PRI-W03, PRI-W04, PRI-W05, PRI-W06 | A | Aprobados | capturas Precios, `prices-performance-final.json.json.gz` |
| PRI-W07, PRI-W08 | B | Aprobados | capturas Precios, focus/touch/Specular automatizado |
| PRO-W01, PRO-W02 | C | Aprobados | `prototype-desktop.webp`, `prototype-mobile.webp` |
| PRO-W03, PRO-W04, PRO-W05, PRO-W06 | A | Aprobados | capturas Prototipado, `prototype-performance-final.json.json.gz` |
| PRO-W07 | B | Aprobado | CTA Specular, teclado/touch y navegación sin retraso |
| MAT-W01, MAT-W02 | C | Aprobados | `materials-desktop.webp`, `materials-mobile.webp` |
| MAT-W03, MAT-W04, MAT-W05 | A | Aprobados | capturas, `materials-performance-final.json.json.gz`, `materials-a11y-snapshot.txt` |
| MAT-W06, MAT-W07 | B | Aprobados | comparación visual, CTA focus/touch y reduced |
| SOL-W01 | B | Aprobado | menú móvil, Escape, trampa/restauración de foco |
| SOL-W02, SOL-W03, SOL-W05, SOL-W09 | A | Aprobados | `solutions-desktop-final.webp`, trace de carga, debug estable |
| SOL-W04, SOL-W07, SOL-W11, SOL-W19 | C | Aprobados | captura/snapshot; contenido y badges permanecen estables |
| SOL-W06, SOL-W08, SOL-W10, SOL-W12 | B | Aprobados | categoría/hash/history, Spotlight, selección y contexto |
| SOL-W13, SOL-W14 | A | Aprobados | detalle único, galería lazy, error de imagen y foco restaurado |
| SOL-W15, SOL-W16 | B | Aprobados | cierre/cancelación y estados error/reintento |
| SOL-W17, SOL-W22 | D | Aprobados en reposo | captura y ausencia de firma activa |
| SOL-W18, SOL-W20 | A | Aprobados | proceso finito y estados validation/loading/error/handoff/success |
| SOL-W21 | B | Aprobado | handoff real a `wa.me/528331080178`, sin confirmar envío falso |

## Referencias adaptadas localmente

| Patrón | Aplicación | Salvaguarda comprobada |
|---|---|---|
| Spotlight Card | MAT-W05, SOL-W10 | Sólo pointer fine; foco equivalente; coarse/reduced sin seguimiento |
| Specular Button | PRI-W08, PRO-W07, MAT-W07, SOL-W21 | 210 ms, una pasada, no retrasa navegación ni WhatsApp |
| Border Glow | MAT-W05, SOL-W10, SOL-W12 | Estado causal más outline/ARIA; no neón continuo |
| Animated Content | A y C editoriales | Observer compartido, `once`, distancia máxima 20 px |
| Staggered Menu | SOL-W01 | Apertura secuencial; cierre corto; Escape y foco restaurado |
| Glare Hover | SOL-W11/SOL-W14 | Sólo imágenes conceptuales y pointer fine; badge siempre visible |
| Magic Bento | MAT-W05, SOL-W09/SOL-W10 | Sólo relación lumínica; DOM/layout intactos, sin tilt o partículas |

## Validaciones funcionales de Soluciones

- Cuatro categorías, nueve nichos publicados, filtro y orden editorial correctos.
- Hash directo, atrás/adelante y bfcache conservan estado y motor.
- Un detalle abierto por categoría; cierre con foco restaurado.
- Selección de aplicación conserva categoría, nicho, aplicación y URL de origen.
- WhatsApp usa `https://wa.me/528331080178`; el estado final es `handoff`, nunca éxito de servidor simulado.
- Imagen normal, lazy y error controlado verificados; el fallo muestra “Imagen no disponible” sin perder el carácter conceptual.
- Evento de categoría emitido por `CustomEvent`, payload sin PII y clic duplicado descartado.

## Evidencia almacenada

- Capturas desktop/mobile de las cuatro rutas: `*-desktop.webp`, `*-mobile.webp`.
- Árboles accesibles: `solutions-a11y-snapshot.txt`, `materials-a11y-snapshot.txt`.
- Lighthouse: directorios `lighthouse-prices`, `lighthouse-prototype`, `lighthouse-materials`, `lighthouse-solutions-final` y `lighthouse-solutions-mobile`.
- Rendimiento: `*-performance-final.json.json.gz`, `solutions-performance.json.json.gz`, `solutions-interaction.json.json.gz`.
- CSS Tailwind capturado mediante Chrome DevTools: `tailwind-*.json`.

## Limitaciones y criterio final

Las métricas son de laboratorio local y no sustituyen datos de campo de usuarios reales. El intento de atajo de teclado para zoom del navegador no cambió el zoom del perfil MCP; se verificaron en su lugar 320–1440 px y `zoom: 200%` sin overflow, además de la semántica accesible. No quedan tareas locales de implementación o validación para esta fase.

Definition of Done local: **alcanzada**.
