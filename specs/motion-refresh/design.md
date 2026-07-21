# Diseño — Sistema “Ingeniería editorial en movimiento”

## 1. Auditoría del sitio y páginas actuales

| Tipo | Hallazgo |
|---|---|
| Confirmado | Las rutas reales son `/precios-impresion-3d/`, `/prototipado-rapido/`, `/materiales-impresion-3d/` y `/ecosistema-soluciones/`. |
| Confirmado | Las tres primeras son HTML estático con Tailwind CDN y `assets/styles.css`; no cargan JavaScript propio, GSAP ni ScrollTrigger y registran 0 animaciones al cargar. |
| Confirmado | Soluciones carga `ecosistema.css` y el módulo `ecosistema.js`; usa Web Animations para tarjetas y detalle, soporta reduced motion, hash, historial y restauración de foco. |
| Confirmado | `assets/animations.js` contiene GSAP/ScrollTrigger defensivo para la home, pero ninguna de estas rutas lo carga. |
| Confirmado | El CSS compartido ya dispone de duraciones/easings, focus visible y reduced motion global. Ninguna ruta presentó overflow horizontal a 1440 px. |
| Confirmado | LCP inicial local: Precios 302 ms, Prototipado 163 ms, Materiales 194 ms, Soluciones 157 ms; CLS 0.00 en las cuatro. No hubo INP inicial por ausencia de interacción en la traza de carga. |
| Inferido | Cargar GSAP sólo para revelados simples incrementaría peso y acoplaría estas rutas a lógica creada para home. |
| Riesgo | Selectores globales nuevos podrían afectar la home; ocultar contenido por CSS antes de inicializar JS dañaría el fallback; animar muchos nodos individuales podría aumentar trabajo. |
| Riesgo | El detalle y cambio de categoría de Soluciones ya tienen comportamiento propio; una segunda animación simultánea podría duplicar efectos. |
| Recomendación | Crear CSS/JS compartidos, exclusivamente habilitados por `data-motion-page`, con IntersectionObserver agrupado y Web Animations; integrar eventos específicos con Soluciones sin reemplazar su lógica. |

## 2. Concepto rector

**Ingeniería editorial en movimiento:** cada bloque entra como una pieza de un sistema legible; primero se establece el contexto, luego se revelan relaciones y finalmente se confirma la acción. Las líneas y bordes son conectores visuales, no nueva información. La página queda quieta al terminar cada transición.

## 3. Personalidad de movimiento

- **Ritmo:** ordenado, con pausas cortas entre jerarquías y stagger compacto dentro de grupos.
- **Velocidad:** 120–560 ms; ninguna secuencia editorial supera 700 ms por elemento.
- **Peso:** firme; desplazamientos 8–20 px, sin rebote.
- **Elasticidad:** nula en scroll y mínima en active; no usar overshoot.
- **Profundidad:** bordes, sombra moderada y escala 0.99–1.01.
- **Aceleración:** entrada desacelera; salida breve acelera; estados usan easing estándar.
- **Dramatismo:** hero medio; cuerpo bajo; CTA inmediato.
- **Interacción vs scroll:** interacción responde en 100–220 ms; scroll narra una vez en 420–560 ms.
- **Móvil:** distancias y staggers reducidos; conectores secundarios simplificados; sin dependencia de hover.

## 4. Tokens de movimiento

| Token | Valor | Uso |
|---|---:|---|
| `--motion-instant` | 120 ms | active/press y feedback inmediato |
| `--motion-micro` | 180 ms | hover, focus, icono, borde |
| `--motion-state` | 260 ms | cambio de estado y tarjetas |
| `--motion-open` | 320 ms | detalle inline |
| `--motion-reveal` | 480 ms | revelado editorial |
| `--motion-section` | 620 ms | hero/mapa; límite 700 ms |
| `--motion-stagger` | 70 ms | grupo desktop |
| `--motion-stagger-compact` | 45 ms | móvil/touch |
| `--motion-ease-standard` | `cubic-bezier(.2,.8,.2,1)` | estados y revelados |
| `--motion-ease-emphasized` | `cubic-bezier(.16,1,.3,1)` | hero/apertura |
| `--motion-ease-exit` | `cubic-bezier(.4,0,1,1)` | cierres breves |

Distancia normal 12–20 px, máxima 24 px; escala 0.99–1.01; elevación máxima 4 px; opacidad inicial animada 0–1 sólo dentro de WAAPI después de confirmar JS. Sin overshoot. Entrada de menor a mayor claridad; salida sólo en cambios funcionales. Reduced motion usa 1 ms para desplazamientos y hasta 120 ms para color/borde/opacidad.

## 5. Sistema global de revelados

| Jerarquía | Variante | Secuencia |
|---|---|---|
| Hero | `hero` | eyebrow/breadcrumb → H1 → párrafo → CTA → panel visual |
| Encabezado de sección | `heading` | etiqueta → título → texto |
| Imagen/panel | `surface` | opacidad + escala 0.99, sin deformación |
| Tarjetas | `cards` | entrada corta con stagger por fila lógica |
| Listas/filas | `rows` | opacidad + 10 px horizontal o vertical según página |
| Divisor/conector | `line` | `scaleX/scaleY` desde origen lógico |
| Iconos | `icon` | opacidad + 8 px, sin giro |
| CTA | `cta` | opacidad + 10 px; botones permanecen legibles |

No se oculta nada mediante CSS base. El script anima desde keyframes al entrar; si no existe IntersectionObserver, aplica estado final sin animar.

## 6. Scroll choreography

- El hero inicia al cargar: contexto, mensaje, acciones y resumen.
- Cada sección dispara al cruzar aproximadamente 18 % del viewport y sólo una vez.
- Encabezado y contenido principal de una sección entran juntos; los ítems se escalonan.
- Conectores decorativos se revelan después del encabezado y antes de tarjetas relacionadas.
- Scroll rápido fuerza inicio inmediato de lo que entra; no espera a secuencias previas.
- Volver hacia arriba no repite revelados editoriales; hover/focus/active sí son reversibles.
- No hay pinning, parallax, scrub ni control del scroll.
- Al ocultar la pestaña se pausan animaciones activas; al volver se reanudan. En `pagehide` se limpian.

## 7. Microinteracciones globales

| Estado | Diseño |
|---|---|
| Botón default | borde/sombra existentes, transición declarada |
| Hover | -2 px, sombra/borde más definidos; sólo `hover:hover` |
| Focus | outline actual reforzado por halo; sin pérdida de contraste |
| Active | escala 0.985 durante 120 ms |
| Disabled | sin transformación; cursor/opacity existentes |
| Loading/error/success | no se inventan estados; se conservan los existentes y sólo cambia color/borde/opacidad |
| Enlace/breadcrumb/nav | subrayado o indicador que crece con `scaleX`; focus siempre visible |
| Tarjeta | -3 px y escala máxima 1.01; en touch sólo active/focus |
| Imagen | escala interna máxima 1.015 únicamente en hover-capable; error/fallback intacto |
| Icono | 2 px en dirección de acción, sin rotación permanente |
| Acordeón/detalle | panel 12 px + opacidad; cierre 8 px + opacidad; `aria-expanded` manda |
| Formularios/tabs | no existen en tres landings; en filtros de Soluciones se conserva semántica de botones y estado activo |

## 8. Diseño específico de Precios

Identidad: **precisión, comparación y decisión**. Los factores funcionan como matriz visual, los escenarios como columnas comparables y las listas como filas ordenadas. No hay tabla ni precio numérico existente; no se simularán.

| Elemento | Estado inicial animado | Disparador | Animación | Duración/easing | Reduced motion | Objetivo | Riesgo |
|---|---|---|---|---|---|---|---|
| Hero | visible | carga | breadcrumb/H1/texto/CTA desde 14 px | 480 ms, emphasized | opacidad breve | establecer jerarquía | retrasar LCP; se anima tras paint |
| Resumen lateral | visible | carga | escala .99 + filas escalonadas | 420 ms, standard | sin escala | sintetizar factores | exceso simultáneo; inicia tras H1 |
| Encabezados | visible | viewport | 12 px + opacidad | 440 ms | inmediato | separar grupos | repetición; once |
| Factores | visible | viewport | tarjetas izq→der; borde superior `scaleX` | 420 ms + 70 ms | color/borde | comparación | parecer planes; no se marca ganadora |
| Escenarios | visible | viewport | columnas con stagger compacto | 460 ms | opacidad | comparar situaciones | no sugerir precios |
| Listas | visible | viewport | filas 10 px horizontal | 360 ms | inmediato | lectura ordenada | demasiados nodos; agrupar |
| CTA final | visible | viewport/acción | bloque + botones; press .985 | 460/120 ms | borde/color | decisión | movimiento agresivo; límites |

## 9. Diseño específico de Prototipado

Identidad: **evolución, proceso e iteración**. No se añaden etapas: los conectores sólo relacionan tarjetas existentes en cada bloque.

| Elemento | Estado inicial animado | Disparador | Animación | Duración/easing | Reduced motion | Objetivo | Riesgo |
|---|---|---|---|---|---|---|---|
| Hero | visible | carga | contenido asciende 16 px; resumen entra 12 px lateral | 520 ms, emphasized | opacidad | iniciar progresión | confundir lateralidad en móvil; vertical allí |
| Beneficios | visible | viewport | 3 tarjetas secuenciales + conector horizontal | 460 ms + 80 ms | borde estático | mostrar continuidad | inventar proceso; conector `aria-hidden` |
| Validaciones | visible | viewport | 4 tarjetas en orden de lectura; alternancia máxima 8 px | 480 ms + 60 ms | inmediato | comunicar iteración | zigzag excesivo; amplitud contenida |
| Iconos | visible | con tarjeta | 8 px + opacidad | 240 ms | color | reforzar foco | decoración excesiva |
| CTA | visible | viewport/acción | entrada unificada, botón con press | 460/120 ms | color/borde | cierre | bloquear scroll; no ocurre |

## 10. Diseño específico de Materiales

Identidad: **tactilidad, propiedades y selección**. La “tactilidad” sólo usa profundidad visual de la ficha; no simula propiedades físicas.

| Elemento | Estado inicial animado | Disparador | Animación | Duración/easing | Reduced motion | Objetivo | Riesgo |
|---|---|---|---|---|---|---|---|
| Hero | visible | carga | H1/texto vertical; panel escala .99 | 500 ms | opacidad | plantear selección | LCP; contenido no se oculta |
| Preguntas | visible | carga | filas compactas desde 10 px | 320 ms + 45 ms | inmediato | ordenar criterios iniciales | exceso de stagger |
| Materiales | visible | viewport | fichas por fila con y=14 px y escala .99 | 440 ms + 65 ms | borde/opacidad | comparar | falsa propiedad; no se deforma |
| Hover/focus ficha | final | interacción | -3 px, escala 1.008, borde/sombra | 180 ms | borde | tactilidad | touch; sólo focus/active |
| Criterios | visible | viewport | grupo desde 10 px, iconos después | 420 ms | inmediato | consolidar decisión | animar datos; no hay valores |
| CTA | visible | viewport/acción | entrada unificada y press | 460/120 ms | color/borde | consulta | sin riesgo funcional |

## 11. Diseño específico de Soluciones

Identidad: **conexión, descubrimiento y expansión**. Se preservan hash, historial, filtros, no-JS, analítica, imágenes, etiquetas y WhatsApp.

| Elemento | Estado inicial animado | Disparador | Animación | Duración/easing | Reduced motion | Objetivo | Riesgo |
|---|---|---|---|---|---|---|---|
| Hero | visible | carga | texto → núcleo → órbitas/etiquetas | 520–620 ms | opacidad breve | necesidad→ecosistema | movimiento constante; secuencia termina |
| Mapa | visible | viewport | núcleo → conectores `scaleX` → categorías | 560 ms + 55 ms | todo visible | explicar relación | líneas fuera de grid; ocultarlas en móvil |
| Filtros | final | interacción/hash | indicador/borde 180 ms | standard | color/borde | estado claro | duplicar navegación; no se intercepta historial |
| Tarjetas nicho | visible | filtro/viewport | 10 px + opacidad con stagger 55 ms | 320 ms | inmediato | continuidad del grupo | doble animación; se centraliza evento |
| Imagen/etiqueta | visible | hover/focus | imagen 1.015, etiqueta fija | 180 ms | sin escala | explorar sin “comprar” | ocultar conceptual; prohibido |
| Detalle inline | visible al insertar | abrir | desde 12 px + opacidad; origen de transformación según tarjeta | 320 ms | opacidad breve | expansión espacial | foco/hash; lógica existente manda |
| Cierre | abierto | cerrar/Escape | 8 px + opacidad; focus al origen | 200 ms | inmediato | retorno | pérdida de foco; prueba obligatoria |
| Aplicaciones/WhatsApp | visible | abrir/acción | filas 8 px; CTA press | 260/120 ms | inmediato | necesidad→cotización | contexto; adapter intacto |
| Imagen error/carga | estado real | evento imagen | borde/opacidad breve, sin ocultar texto | 180 ms | igual | estado honesto | falso éxito; no ocurre |

## 12. Diferenciación entre páginas

| Página | Metáfora | Dirección dominante | Agrupación |
|---|---|---|---|
| Precios | precisión/comparación | izquierda→derecha | matrices y filas |
| Prototipado | evolución/iteración | secuencia progresiva | conectores de proceso decorativos |
| Materiales | tactilidad/selección | profundidad vertical mínima | fichas por familia visual |
| Soluciones | conexión/expansión | centro→ramas→detalle | núcleo, categorías y nichos |

Comparten tokens, easing, accesibilidad y límites; no comparten exactamente el mismo preset ni la misma dirección.

## 13. Diseño responsive

| Contexto | Se conserva | Se simplifica/elimina |
|---|---|---|
| Escritorio amplio ≥1440 | secuencias completas, conectores y stagger 70 ms | ninguna, dentro de límites |
| Laptop 1024–1439 | revelados y microinteracciones | distancias -20 %, conectores ajustados a filas |
| Tableta 768–1023 | grupos y feedback | stagger 45 ms, conectores horizontales discretos |
| Teléfono 360–767 | orden vertical, opacity/translate corto, focus/active | conectores complejos, hover y alternancia lateral |
| Pantalla pequeña 320–359 | feedback y jerarquía | distancia máxima 8 px, stagger casi nulo |
| Touch | focus/active y aperturas | hover/elevación persistente |
| Landscape móvil | orden de DOM y transiciones breves | adornos que reduzcan altura útil |
| Zoom 200 % | contenido, foco, controles | conectores que puedan cruzar texto; sin overflow |

## 14. Reduced motion

Con `prefers-reduced-motion: reduce`, el contenido aparece inmediatamente; no hay traslaciones, escala, parallax, dibujo lento, secuencias o movimiento constante. Los cambios funcionales conservan feedback de color, borde u opacidad hasta 120 ms. La apertura/cierre de detalle mantiene foco, `aria-expanded` y visibilidad sin desplazamiento. El ajuste se escucha tanto al cargar como si cambia durante la sesión.

## 15. Rendimiento

- Presupuesto adicional propio: CSS + JS sin minificar ≤ 30 KB combinados; cero librerías, fuentes o imágenes nuevas.
- Sólo `transform`, `opacity`, `border-color`, `background-color` y sombra moderada.
- `clip-path` no es necesario; sin blur ni filtros animados.
- Un IntersectionObserver compartido, revelados `once`, un listener por evento de entorno y cero ScrollTriggers nuevos.
- Inicialización idempotente mediante marca de documento.
- Pausa por `visibilitychange`; limpieza por `pagehide`.
- Hero se anima después del primer paint sin estado CSS oculto; dimensiones no cambian y CLS debe conservarse en 0.
- Touch/reduced motion eliminan trabajo decorativo de mayor costo.

## 16. Arquitectura conceptual

- **`assets/motion-pages.css`:** tokens, decoración, estados, hover/focus/active, identidades por `body[data-motion-page]`, responsive y reduced motion.
- **`assets/motion-pages.js`:** inicializador idempotente por ruta, presets, IntersectionObserver agrupado, WAAPI, detección reduced/touch, pausa/limpieza y diagnóstico.
- **HTML de cada ruta:** atributo de ruta, clases/datos semánticos de presentación y carga de los dos assets; texto y enlaces intactos.
- **`ecosistema.js`:** mantiene estado y funcionalidad; emite/consume señales puntuales para cambio de categoría y detalle, evitando una segunda fuente de verdad.
- **CSS específico de Soluciones:** conserva layout y fallback; recibe sólo clases indispensables que no sean globales.
- **GSAP/ScrollTrigger:** permanecen en la home, no se cargan ni modifican para estas rutas.

## 17. Trazabilidad

| Requisito | Página/elemento | Estado/animación | Validación |
|---|---|---|---|
| RMG-001–008 | global | tokens, reveal, ciclo de vida | inspección, no-JS, consola, regresión home |
| RMP-001–003 | Precios | hero, matrices, filas, CTA | capturas, teclado, enlaces, métricas |
| RMR-001–003 | Prototipado | secuencia y conectores | scroll rápido/inverso, responsive |
| RMM-001–003 | Materiales | fichas táctiles y criterios | hover/focus/touch, contenido intacto |
| RMS-001–004 | Soluciones | núcleo, filtros, tarjetas, detalle | hash, back/forward, focus, WhatsApp, estados |
| RMRSP-001–003 | todas | adaptación | 1440/1280/768/390/320, landscape, zoom |
| RMA-001–003 | todas | focus/reduced/touch | teclado, a11y tree, emulación |
| RMPERF-001–004 | todas | compositor/ciclo | traces, CLS/LCP/INP, debug, peso |

## 18. Criterios de aprobación del diseño

El diseño se aprueba si no añade información; define una coreografía distinta para las cuatro rutas; cada efecto tiene propósito y límite; responsive, touch y reduced motion están resueltos; el contenido funciona sin GSAP y sin JS; la arquitectura no afecta SEO ni semántica; y cada decisión se puede convertir directamente en una tarea comprobable.
