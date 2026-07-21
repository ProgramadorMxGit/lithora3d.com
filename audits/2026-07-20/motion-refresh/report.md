# Informe de validación — Motion refresh

Fecha: 2026-07-20
Servidor local: `http://127.0.0.1:8000`
Herramienta de navegador: Chrome DevTools MCP.

## Alcance verificado

- `/precios-impresion-3d/`
- `/prototipado-rapido/`
- `/materiales-impresion-3d/`
- `/ecosistema-soluciones/`
- Regresión de `/` y aislamiento de assets.

## Métricas antes y después

| Ruta | LCP antes | LCP después | Diferencia | CLS antes | CLS después |
|---|---:|---:|---:|---:|---:|
| Precios | 302 ms | 215 ms | -87 ms | 0.00 | 0.00 |
| Prototipado | 163 ms | 169 ms | +6 ms | 0.00 | 0.00 |
| Materiales | 194 ms | 174 ms | -20 ms | 0.00 | 0.00 |
| Soluciones | 157 ms | 161 ms | +4 ms | 0.00 | 0.00 |

- No hay datos de campo CrUX para localhost.
- La carga inicial no produjo una medición INP antes ni después porque no contiene interacción.
- Una traza de interacción real registró INP observado de 83 ms y CLS 0.00.
- El primer trace de Soluciones mostró 88 ms de forced reflow en el cálculo de densidad del motor. Se reemplazó la lectura de `innerWidth` por `matchMedia`; el trace final ya no muestra el insight ForcedReflow.
- No se reportaron long tasks atribuibles al motor en los insights finales.

## Lighthouse

| Ruta | Accesibilidad | Buenas prácticas | SEO | Agentic browsing |
|---|---:|---:|---:|---:|
| Precios | 100 | 100 | 100 | 100 |
| Prototipado | 100 | 100 | 100 | 100 |
| Materiales | 100 | 100 | 100 | 100 |
| Soluciones (final) | 100 | 100 | 100 | 100 |

Soluciones obtuvo inicialmente 96 en accesibilidad por el contraste 2.68:1 del enlace directo de WhatsApp. Se corrigió a azul claro y la reauditoría pasó 57/57 checks.

## Responsive y comportamiento

- Matriz ejecutada en 1440×1000, 1280×800, 768×1024 touch, 390×844 mobile/touch, 320×700 mobile/touch y 844×390 landscape/touch.
- Reflow equivalente a 200 % comprobado a 640 px para un viewport lógico de 1280 px.
- Resultado final: 0 px de overflow horizontal, un H1 visible por ruta y ningún nodo fuera del viewport.
- Se corrigió un recorte de 10 px en imágenes de Soluciones a 320 px retirando el `min-height` sólo en pantallas menores de 360 px.
- Scroll rápido, ascendente/descendente y recorrido por secciones concluyen con 0 animaciones retenidas.
- Resize/orientación conservan una instancia, un observer, conteo estable de listeners y 0 ScrollTriggers.

## Accesibilidad e interacción

- Orden semántico confirmado por snapshots del árbol de accesibilidad.
- Tabulación comprobada en las cuatro rutas; todos los controles inspeccionados muestran outline visible.
- Touch comprobado mediante emulación mobile/coarse pointer.
- Reduced motion comprobado antes de inicializar el documento: `reducedMotion=true`, 0 observers, 0 animaciones y cinco secciones visibles.
- No-JS validado por mejora progresiva: el HTML no contiene estados ocultos de motion, el CSS no oculta contenido y la suite comprueba el fallback. Chrome DevTools MCP no expone un interruptor para deshabilitar por completo el motor JS.
- No hay destellos, parallax, pinning, scrub, movimiento permanente ni dependencia de hover.

## Soluciones

- Cuatro categorías, filtrado, hash y back/forward verificados.
- Cambio a Industria mostró exactamente Dentistas, Transporte y Escuelas; volver restauró Negocios/Barberías/Boda; avanzar restauró Industria.
- Detalle de Barberías abierto/cerrado: `aria-expanded` cambia, sólo un detalle queda abierto y el foco vuelve a `aria-controls="detail-barberias"` tras 180 ms.
- Cuatro etiquetas “Ejemplo conceptual” permanecen visibles en la galería abierta.
- Carga directa `?nicho=dentistas#industria` abre Dentistas.
- Al elegir “Llaveros temáticos”, se preservaron categoría Industria, nicho Dentistas, aplicación, URL de origen y mensaje editable en el enlace oficial `wa.me/528331080178`.

## Consola, peso y memoria

- Soluciones: sin mensajes de consola.
- Las otras tres rutas: sin errores; persiste únicamente el warning preexistente del Tailwind CDN, no generado por el refresh.
- Peso propio añadido: 18,952 bytes sin minificar (`motion-pages.css` 10,276 + `motion-pages.js` 8,676), sin dependencias nuevas.
- Heap snapshot final de Soluciones guardado como `solutions.heapsnapshot`.
- Los assets de motion no cargan en home ni en Servicio; home conserva un H1, 0 overflow y consola sin errores nuevos.

## Evidencia

- `before/`: ocho capturas desktop/mobile y cuatro traces iniciales.
- `after/`: capturas desktop/mobile de las cuatro rutas, hover, focus, reduced motion, detalle abierto y Soluciones con imágenes lazy cargadas.
- `after/lighthouse-*`: informes HTML/JSON por ruta y reauditoría corregida de Soluciones.
- `after/*-trace*.json.json.gz`: traces finales de carga e interacción.
- `after/solutions.heapsnapshot`: evidencia de memoria.

## Limitaciones honestas

- Chrome DevTools MCP no aplicó el comando de zoom del navegador dentro de la sesión automatizada; se validó el mismo reflow efectivo a 640 px (equivalente a 1280 px al 200 %), sin overflow ni recortes.
- Chrome DevTools MCP no expone desactivación total de JavaScript; el fallback no-JS se validó mediante fuente, CSS y pruebas automatizadas.
- El warning del Tailwind CDN ya existía en Precios, Prototipado y Materiales. No es un error de motion y retirarlo requeriría cambiar el pipeline CSS fuera de este alcance.
