# Requerimientos — Premium Widget Motion

## 1. Introducción

- **Iniciativa:** Premium Widget Motion — segunda iteración de movimiento para Lithora 3D.
- **Propósito:** elevar la calidad percibida de cada widget mediante estados, continuidad espacial, profundidad y ritmo propios, sin rediseñar, reescribir ni ampliar la oferta.
- **Páginas incluidas:** `/precios-impresion-3d/`, `/prototipado-rapido/`, `/materiales-impresion-3d/` y `/ecosistema-soluciones/`.
- **Punto de partida confirmado:** la primera iteración es funcional, aislada, accesible y rápida; usa tokens compartidos, Web Animations, un `IntersectionObserver`, fallbacks sin JS/reduced motion y eventos específicos de Soluciones.
- **Problema a resolver:** el movimiento actual depende demasiado de reveal vertical/lateral, opacidad, stagger y hover homogéneos. El resultado es correcto pero genérico: varios widgets se comportan como el mismo tipo de tarjeta y no expresan su función, estado o relación.
- **Resultado esperado:** un sistema premium reconocible por precisión y significado, no por cantidad de efectos; cada página conserva identidad propia y cada widget importante tiene un contrato completo de entrada, estado, interacción, salida y adaptación.
- **Restricción absoluta de esta fase:** este documento define requisitos. No autoriza implementación, cambios de contenido, nuevas secciones, nuevas imágenes, nuevas rutas ni cambios de conversión.

## 2. Definiciones operativas

| Término | Definición verificable |
|---|---|
| Widget | Unidad visual o interactiva con función, límites y estados propios; puede ser un bloque compuesto o un patrón repetido. |
| Sección | Región semántica de página que agrupa uno o más widgets; no equivale automáticamente a un widget. |
| Widget principal | Pieza que explica, compara, orienta o convierte y cuya comprensión afecta el objetivo de la página. |
| Widget secundario | Pieza que habilita, confirma o amplía al principal sin dominar la composición. |
| Entrada | Transición finita desde el estado visible base hasta el estado estable; nunca requisito para acceder al contenido. |
| Estado | Representación inequívoca de disponibilidad, selección, foco, carga, éxito, error, apertura o cierre. |
| Microinteracción | Respuesta breve y reversible a hover, focus, active, selección o confirmación. |
| Transición | Cambio entre dos estados funcionales; debe conservar causalidad, foco y contexto. |
| Coreografía | Orden temporal y espacial entre piezas relacionadas, sin imponer una línea de tiempo al scroll. |
| Continuidad espacial | Relación perceptible entre control de origen y resultado, apertura, filtro o retorno. |
| Jerarquía temporal | Prioridad expresada mediante orden y duración: causa antes que consecuencia; contenido principal antes que soporte. |
| Profundidad | Separación por elevación, luz, borde, escala o capas; nunca debe falsear interactividad. |
| Premium | Sensación de intención, precisión, estabilidad y detalle; no significa más movimiento ni mayor duración. |
| Decorativo | Movimiento sin información ni cambio de estado; debe ser prescindible. |
| Funcional | Movimiento que explica relación, estado, origen, selección, progreso o resultado. |
| Ambiental | Movimiento de baja prioridad que establece atmósfera y termina o queda casi imperceptible. |
| Reduced motion | Variante sin desplazamientos, escalas, secuencias o trazados amplios; conserva estados y feedback. |
| No-JS | Experiencia con todo el contenido, enlaces y formularios legibles y utilizables sin mejora dinámica. |
| Touch | Contexto sin hover persistente; usa focus, active, selección y respuesta directa. |
| Compartido | Regla o token común a las cuatro rutas. |
| Específico | Comportamiento justificado por función y metáfora de una página o widget. |
| Motion budget | Límite explícito de simultaneidad, duración, distancia, propiedades, listeners y peso. |
| Complejidad visual | Número de capas, señales y relaciones perceptibles que compiten en pantalla. |
| Complejidad técnica | Número de estados, dependencias, cálculos, observers, listeners y caminos de recuperación. |

## 3. Diagnóstico de la iteración anterior

### Confirmado

- Las cuatro rutas cargan directamente, tienen un H1, cero overflow horizontal en el viewport inspeccionado y una instancia de `LithoraMotionDebug`.
- El motor actual usa un observer, nueve listeners, cero ScrollTriggers y se mantiene por debajo de 30 KB sin dependencias nuevas.
- Lighthouse final previo fue 100/100/100/100 en accesibilidad, buenas prácticas, SEO y agentic browsing; CLS fue 0 y la interacción observada registró INP de 83 ms.
- Soluciones conserva categorías, hash, historial, foco, etiquetas conceptuales, estados de imagen, contexto y handoff real a WhatsApp.
- La inspección se realizó con Chrome DevTools en `http://localhost:8000/precios-impresion-3d/`, `prototipado-rapido/`, `materiales-impresion-3d/` y `ecosistema-soluciones/`.

### Problemas observados

- `revealItems` reduce múltiples funciones a cuatro variantes (`up`, `left`, `right`, `scale`) con duraciones y stagger casi idénticos.
- Los selectores por sección agrupan artículos, listas y enlaces por posición, no por contrato de widget; esto limita estados y dirección semántica.
- Precios, Prototipado y Materiales comparten casi la misma silueta: hero bipartito, matrices de tarjetas y CTA oscuro.
- Las barras, conectores y gradientes añaden acabado, pero rara vez cambian según selección, lectura o interacción.
- Las capturas durante carga muestran grupos completos atenuados a la vez; la jerarquía temporal puede competir con legibilidad inmediata.
- La profundidad actual es casi siempre elevación de 3 px, escala 1.008 y línea superior; no distingue control, dato, superficie ni resultado.
- Soluciones tiene estados reales, pero el mapa, el filtro, la tarjeta, el detalle, la galería y la cotización no forman aún una cadena espacial continua.
- No existe una matriz de calidad premium ni un criterio mensurable por widget para impedir que la segunda iteración vuelva a ser un conjunto de reveals.

### Debe preservarse

- Contenido, orden semántico, navegación, destinos, analítica, cotización, imágenes y etiquetas actuales.
- Mejora progresiva, scroll nativo, idempotencia, limpieza, aislamiento por `data-motion-page` y ausencia de dependencias externas.
- Reduced motion, touch, teclado, restauración de foco, hash/back/forward y un detalle abierto por categoría.
- Métricas y evidencia de la primera iteración como línea base.

### Debe revisarse en diseño

- Selectores por posición (`nth-of-type`) frente a contratos explícitos por widget.
- Cantidad de animaciones simultáneas al cargar y al entrar grupos densos.
- Necesidad real de movimiento ambiental en hero/orbit y de conectores persistentes.
- Diferenciación entre tarjetas informativas, opciones, controles y resultados.
- Coreografía de apertura/cierre de detalle y continuidad filtro → grid → detalle → WhatsApp.

## 4. Objetivos mensurables de experiencia

1. El 100 % de los widgets A y B deberá tener estados documentados; ningún estado funcional dependerá sólo de hover o color.
2. Cada página deberá obtener al menos 4.0/5 en la matriz premium y ninguna dimensión podrá quedar por debajo de 3.
3. Al menos el 75 % de los widgets A deberá usar una lógica de movimiento específica de su función, no el preset genérico de tarjetas.
4. En una misma ventana no deberán competir más de dos widgets A ni más de ocho elementos animados simultáneamente.
5. Todo feedback de interacción deberá comenzar en ≤100 ms y estabilizarse en ≤280 ms; apertura funcional en ≤360 ms.
6. Ningún contenido esencial deberá permanecer con opacidad menor a 1 más de 700 ms desde que es visible en viewport.
7. La dirección y el orden deberán permitir explicar oralmente causa → cambio → resultado para filtros, detalles y cotización.
8. La segunda iteración deberá conservar CLS 0, ausencia de overflow y no introducir long tasks >50 ms atribuibles al motion.
9. En reduced motion, touch, teclado y no-JS deberá mantenerse el 100 % de la función y comprensión.
10. Una revisión comparativa deberá distinguir correctamente las cuatro páginas por su lenguaje de motion sin leer el título.

## 5. Principios obligatorios y comprobación posterior

| # | Principio | Comprobación en diseño/validación |
|---:|---|---|
| 1 | La función determina el movimiento. | Cada widget A/B declara propósito y estado; se rechaza todo efecto sin relación. |
| 2 | Premium significa precisión, no espectáculo. | Amplitud, duración y simultaneidad respetan presupuesto. |
| 3 | La causa precede al resultado. | Captura o traza confirma control → transición → contenido. |
| 4 | Una página, una metáfora dominante. | Revisión ciega distingue precisión, iteración, selección y conexión. |
| 5 | Un widget, una firma reconocible. | Inventario enlaza cada A/B con comportamiento específico o justificación compartida. |
| 6 | El contenido existe antes del efecto. | Prueba no-JS y captura del primer estado legible. |
| 7 | El estado estable es quieto. | `document.getAnimations()` llega a cero salvo ambiente aprobado. |
| 8 | La profundidad expresa jerarquía. | Auditoría verifica que elevación no sugiera acción inexistente. |
| 9 | El ritmo crea pausas. | Matriz de densidad reserva zonas D y evita cascadas continuas. |
| 10 | El foco tiene igual o mayor claridad que hover. | Recorrido completo con teclado y contraste de focus. |
| 11 | Touch no hereda coreografía de mouse. | Emulación coarse pointer sin hover persistente ni objetivos menores de 44 px. |
| 12 | Reduced motion conserva significado. | Comparación de estados normal/reduced con paridad funcional. |
| 13 | La continuidad nunca altera historial ni foco. | Pruebas de hash, back/forward, Escape y retorno. |
| 14 | El rendimiento es parte del acabado. | Traces, LCP/CLS/INP, long tasks y presupuesto de assets. |
| 15 | Toda decisión debe poder aprobarse con evidencia. | Cada requisito enlaza a validación visual, funcional o técnica. |

## 6. Inventario real de widgets

Niveles: **A** protagonista, **B** interactivo/decisivo, **C** soporte, **D** zona de descanso. Se inventarían widgets si se separaran cada tarjeta repetida como sistema distinto; por ello las matrices y tarjetas repetidas se registran como patrones reales, indicando sus instancias.

| ID | Página | Widget real / selector o descripción | Función | Nivel | Problema actual | Objetivo de motion | Estados/interacciones requeridos | Riesgo | Prioridad |
|---|---|---|---|:---:|---|---|---|---|---|
| PRI-W01 | Precios | `.site-header` | Navegación y cotización | C | Feedback compartido | Orientación estable | default/focus/active | Distracción | Should |
| PRI-W02 | Precios | Breadcrumb del hero | Contexto | C | Reveal indiferenciado | Confirmar ubicación | entry/focus | Exceso | Could |
| PRI-W03 | Precios | Hero copy + `.btn-primary/.btn-secondary` | Explicar y convertir | A | Secuencia genérica | Ritmo de decisión | entry/focus/active | LCP | Must |
| PRI-W04 | Precios | Panel “Lo que más impacta…” | Síntesis | A | Escala + filas genéricas | Ensamble medido de factores | entry/stable | Sobrecarga | Must |
| PRI-W05 | Precios | Matriz de cuatro factores | Comparación causal | A | Cuatro cards iguales | Relación variable → impacto | entry/hover/focus | Parecer planes | Must |
| PRI-W06 | Precios | Tres escenarios | Comparación situacional | A | Mismo reveal de factores | Cambio de escenario legible | entry/hover/focus | Falsa selección | Must |
| PRI-W07 | Precios | Dos paneles “Para cotizar mejor” | Preparación de datos | B | Listas planas | Checklist progresivo sobrio | entry/focus-within | Demasiados nodos | Should |
| PRI-W08 | Precios | CTA final oscuro | Conversión | B | Entrada estándar | Cierre inequívoco | entry/focus/active | Competir con hero | Must |
| PRO-W01 | Prototipado | `.site-header` | Navegación | C | Genérico | Estabilidad | default/focus/active | Distracción | Should |
| PRO-W02 | Prototipado | Breadcrumb | Contexto | C | Genérico | Confirmar ubicación | entry/focus | Exceso | Could |
| PRO-W03 | Prototipado | Hero copy + acciones | Plantear validación | A | Igual a otras rutas | Inicio de iteración | entry/focus/active | LCP | Must |
| PRO-W04 | Prototipado | Panel “Este tipo…” | Casos de ayuda | A | Lista estática | Preparación de prueba | entry/stable | Confundir proceso | Must |
| PRO-W05 | Prototipado | Tres beneficios conectados | Progresión | A | Línea decorativa rígida | Flujo temprano → riesgo → presentación | entry/hover/focus | Inventar pasos | Must |
| PRO-W06 | Prototipado | Matriz de cuatro validaciones | Cobertura de pruebas | A | Cards equivalentes | Iteración y consolidación | entry/hover/focus | Zigzag | Must |
| PRO-W07 | Prototipado | CTA final | Conversión | B | Cierre compartido | Confirmar siguiente iteración | entry/focus/active | Redundancia | Must |
| MAT-W01 | Materiales | `.site-header` | Navegación | C | Genérico | Estabilidad | default/focus/active | Distracción | Should |
| MAT-W02 | Materiales | Breadcrumb | Contexto | C | Genérico | Confirmar ubicación | entry/focus | Exceso | Could |
| MAT-W03 | Materiales | Hero copy + acciones | Plantear selección | A | Igual a otras rutas | Abrir decisión | entry/focus/active | LCP | Must |
| MAT-W04 | Materiales | Panel de cuatro preguntas | Criterios iniciales | A | Lista estándar | Diagnóstico guiado | entry/stable | Parecer formulario | Must |
| MAT-W05 | Matriz de seis materiales | Comparación | A | Sólo gradiente/borde | Tactilidad y diferenciación honesta | entry/hover/focus/active | Falsear propiedades | Must |
| MAT-W06 | Tres criterios de decisión | Síntesis | B | Igual a cards | Convergencia de decisión | entry/hover/focus | Repetición | Should |
| MAT-W07 | CTA final | Orientación | B | Cierre compartido | Salida asistida | entry/focus/active | Redundancia | Must |
| SOL-W01 | Soluciones | Header desktop + menú móvil | Navegación | B | Estados poco integrados | Apertura/retorno claros | closed/open/focus/active | Foco móvil | Must |
| SOL-W02 | Soluciones | `.hero-copy-block` | Promesa y acceso | A | Reveal lineal | Necesidad → exploración | entry/focus/active | LCP | Must |
| SOL-W03 | Soluciones | `.hero-orbit` | Metáfora de ecosistema | A | Capas aparecen pero no explican relación | Núcleo → órbitas → contextos | entry/stable/reduced | Ambiente constante | Must |
| SOL-W04 | Soluciones | `.section-heading.compact-heading` | Introducir mapa | C | Heading estándar | Pausa y preparación | entry | Repetición | Should |
| SOL-W05 | Soluciones | `.ecosystem-map` | Explicar cuatro caminos | A | Reveal de nodos básico | Expansión radial causal | entry/stable | Complejidad | Must |
| SOL-W06 | Soluciones | `.map-category` ×4 | Elegir categoría | B | Indicador compartido | Nodo fuente de filtro | hover/focus/active/selected | Romper hash | Must |
| SOL-W07 | Soluciones | `.explorer-heading` | Contexto comercial | C | Entrada genérica | Transición mapa → ejemplos | entry | Densidad | Should |
| SOL-W08 | Soluciones | `.category-navigation` | Filtrar | B | Subrayado común | Indicador que viaja al estado elegido | focus/active/selected/history | Doble evento | Must |
| SOL-W09 | Soluciones | `#niche-grid` | Resultado filtrado | A | Stagger uniforme | Reorganización legible | loading/ready/empty/error | Flash/CLS | Must |
| SOL-W10 | Soluciones | `.niche-card` patrón ×9 | Resumir nicho | B | Hover de card genérico | Exploración con jerarquía interna | entry/hover/focus/open | Parecer ecommerce | Must |
| SOL-W11 | Soluciones | `.niche-image-wrap` + badge | Evidencia conceptual | C | Zoom mínimo | Mantener honestidad y carga | loading/loaded/missing/error | Ocultar etiqueta | Must |
| SOL-W12 | Soluciones | `[data-application]` | Seleccionar aplicación | B | Selección casi sólo textual | Elección inequívoca | hover/focus/active/selected | Color-only | Must |
| SOL-W13 | Soluciones | `.niche-detail` | Expandir contexto | A | Apertura vertical genérica | Crecer desde tarjeta origen | loading/ready/error/open/closing | Foco/hash | Must |
| SOL-W14 | Soluciones | `.detail-gallery` | Explorar ejemplos | A | Figuras reveladas igual | Secuencia editorial sin carrusel falso | entry/loaded/error | Demasiadas animaciones | Must |
| SOL-W15 | Soluciones | `.niche-open/.detail-close` | Abrir y retornar | B | Feedback compartido | Causalidad y retorno | focus/active/expanded/collapsed | Pérdida de foco | Must |
| SOL-W16 | Soluciones | `.niche-empty/.detail-state` | Recuperación | B | Estados funcionales sin firma | Estado honesto y recuperable | loading/empty/error/retry | Falso éxito | Must |
| SOL-W17 | Soluciones | Texto “No necesitas…” | Descanso/orientación | D | Compite como otra sección animada | Pausa editorial | entry/stable | Exceso | Should |
| SOL-W18 | Soluciones | `.process-list` | Explicar tres pasos existentes | A | Filas genéricas | Ensamble progresivo | entry/stable | Inventar pasos | Must |
| SOL-W19 | Soluciones | `.context-summary` | Confirmar origen | C | Cambio abrupto | Transferencia visible de contexto | default/updated | Exponer PII | Must |
| SOL-W20 | Soluciones | `.quote-form` | Preparar cotización | A | Formulario estático | Estados de preparación/handoff | available/loading/error/handoff/success | Falso envío | Must |
| SOL-W21 | Soluciones | Submit + WhatsApp directo | Salida real | B | Feedback separado | Continuidad al canal | focus/loading/error/handoff | Popup bloqueado | Must |
| SOL-W22 | Soluciones | `.ecosystem-footer` | Cierre y honestidad | D | Sin pausa propia | Reposo final | stable/focus | Ruido | Could |

**Totales:** 44 widgets: **A 19**, **B 13**, **C 10**, **D 2**.

## 7. Requerimientos globales premium

| ID / nombre | Pri. | Scope | El sistema debe… | Razón | Aceptación Given/When/Then | Validación |
|---|:---:|---|---|---|---|---|
| PWM-G-001 Diferenciación funcional | Must | A/B | asignar movimiento según función, no sólo tipo de elemento. | Evitar presets repetidos. | Dado dos widgets con funciones distintas, cuando se comparan, entonces difieren en causa, ritmo o estado. | Matriz + video comparativo. |
| PWM-G-002 Firma por página | Must | 4 rutas | expresar precisión, iteración, selección y conexión respectivamente. | Crear identidad. | Dada una captura animada sin título, cuando se revisa, entonces la metáfora puede identificarse. | Revisión ciega. |
| PWM-G-003 Jerarquía temporal | Must | Global | ordenar causa, contenido principal, soporte y CTA sin espera impuesta. | Mejor comprensión. | Dado scroll rápido, cuando entra una sección, entonces lo esencial no espera una secuencia anterior. | Slow-motion + scroll rápido. |
| PWM-G-004 Profundidad semántica | Must | Superficies | usar profundidad sólo para jerarquía o acción real. | Evitar falsa interactividad. | Dado un bloque no accionable, cuando se apunta, entonces no imita una tarjeta clicable. | Hover/focus audit. |
| PWM-G-005 Continuidad espacial | Must | Transiciones | conservar origen perceptible entre control y resultado. | Reducir desorientación. | Dado filtro o detalle, cuando cambia, entonces el resultado se relaciona con el control y el foco. | Video + foco. |
| PWM-G-006 Quietud final | Must | Global | finalizar movimiento funcional y limitar ambiente aprobado. | Calidad y concentración. | Dada una página estable, cuando pasan 2 s, entonces no hay animaciones activas no autorizadas. | DevTools animations. |
| PWM-G-007 Feedback multimodal | Must | Controles | combinar al menos dos señales compatibles con contraste. | Acceso universal. | Dado hover/focus/selected, cuando cambia el estado, entonces no depende sólo del color. | Teclado/touch/contraste. |
| PWM-G-008 Presupuesto por widget | Must | A/B | declarar duración, distancia, simultaneidad y fallback antes de implementar. | Control técnico. | Dado un widget aprobado, cuando se revisa su especificación, entonces tiene presupuesto completo. | Checklist de diseño. |

## 8. Requerimientos de Precios

| ID / nombre | Pri. | Scope | El sistema debe… | Razón | Aceptación Given/When/Then | Validación |
|---|:---:|---|---|---|---|---|
| PWM-PRI-001 Ensamble del hero | Must | PRI-W03/04 | construir primero la pregunta de costo y después el panel de factores, sin atenuar el H1. | Decisión clara. | Dada la carga, cuando inicia motion, entonces H1 es legible y el panel se ensambla después. | Filmstrip/LCP. |
| PWM-PRI-002 Variables medibles | Must | PRI-W05 | relacionar cada factor con una señal de medición no numérica ni cambiante. | Expresar precisión sin precio falso. | Dada la matriz, cuando entra, entonces cada factor se distingue sin sugerir plan o ganador. | Revisión visual. |
| PWM-PRI-003 Escenarios comparables | Must | PRI-W06 | diferenciar escenarios de factores mediante una coreografía de comparación. | Evitar repetición. | Dados ambos grupos, cuando se recorren, entonces no comparten exactamente firma, dirección y timing. | Video lado a lado. |
| PWM-PRI-004 Preparación y cierre | Must | PRI-W07/08 | convertir listas en preparación tranquila y reservar el énfasis final al CTA. | Ritmo de decisión. | Dado el final, cuando se llega, entonces listas no compiten y CTA responde ≤100 ms. | Scroll + interacción. |

## 9. Requerimientos de Prototipado

| ID / nombre | Pri. | Scope | El sistema debe… | Razón | Aceptación Given/When/Then | Validación |
|---|:---:|---|---|---|---|---|
| PWM-PRO-001 Inicio de iteración | Must | PRO-W03/04 | expresar planteamiento → tipo de validación sin inventar estado de máquina. | Metáfora honesta. | Dado el hero, cuando carga, entonces el panel responde al planteamiento y termina quieto. | Filmstrip. |
| PWM-PRO-002 Progresión de beneficios | Must | PRO-W05 | conectar los tres beneficios en orden de lectura y desactivar conectores cuando cambie el layout. | Continuidad real. | Dado desktop o móvil, cuando entra el grupo, entonces el conector nunca cruza texto ni altera orden. | Responsive video. |
| PWM-PRO-003 Ciclo de validaciones | Must | PRO-W06 | presentar cuatro validaciones como opciones iterables, no pasos obligatorios. | Evitar afirmación falsa. | Dada la matriz, cuando se anima, entonces no numera ni implica secuencia requerida. | Revisión semántica. |
| PWM-PRO-004 Aprendizaje a CTA | Should | PRO-W06/07 | consolidar visualmente el grupo antes del CTA sin bloquear scroll. | Cierre coherente. | Dado scroll rápido, cuando aparece CTA, entonces está legible de inmediato. | Scroll test. |

## 10. Requerimientos de Materiales

| ID / nombre | Pri. | Scope | El sistema debe… | Razón | Aceptación Given/When/Then | Validación |
|---|:---:|---|---|---|---|---|
| PWM-MAT-001 Diagnóstico inicial | Must | MAT-W03/04 | relacionar las preguntas con la decisión de material sin simular formulario. | Orientar honestamente. | Dado el hero, cuando entra el panel, entonces ninguna pregunta parece seleccionable si no lo es. | Cursor/semántica. |
| PWM-MAT-002 Fichas diferenciables | Must | MAT-W05 | dar a las seis fichas identidad táctil consistente sin codificar propiedades no publicadas. | Facilitar comparación. | Dadas seis fichas, cuando se exploran, entonces el feedback no implica resistencia, calor o flexibilidad adicionales. | Revisión de contenido. |
| PWM-MAT-003 Tactilidad limitada | Must | MAT-W05 | mantener escala 0.98–1.02, elevación ≤4 px y respuesta equivalente en focus. | Evitar deformación. | Dado hover/focus/active, cuando ocurre, entonces no hay layout shift ni diferencia de acceso. | Computed styles/CLS. |
| PWM-MAT-004 Convergencia | Should | MAT-W06/07 | cambiar de exploración de fichas a síntesis de criterios y soporte. | Evitar otra cuadrícula idéntica. | Dados los dos grupos, cuando se comparan, entonces criterios se perciben como síntesis, no materiales. | Video comparativo. |

## 11. Requerimientos de Soluciones

| ID / nombre | Pri. | Scope | El sistema debe… | Razón | Aceptación Given/When/Then | Validación |
|---|:---:|---|---|---|---|---|
| PWM-SOL-001 Núcleo y caminos | Must | SOL-W02–06 | secuenciar necesidad → núcleo → conexiones → categorías y terminar estático. | Explicar ecosistema. | Dada la carga/entrada del mapa, cuando termina, entonces la relación central es legible sin loop. | Filmstrip/animations. |
| PWM-SOL-002 Categoría causal | Must | SOL-W06/08/09 | conectar control elegido, hash y grid resultante con una única transición. | Evitar doble feedback. | Dado click/back/forward, cuando cambia categoría, entonces hay un evento y un resultado correcto. | Event counter/history. |
| PWM-SOL-003 Grid estable | Must | SOL-W09/10 | cambiar resultados sin flash, superposición, salto ni reanimación duplicada. | Calidad funcional. | Dado filtro repetido, cuando cambia, entonces CLS=0 y cada card anima máximo una vez por cambio. | Trace/debug. |
| PWM-SOL-004 Apertura con origen | Must | SOL-W10/13/15 | expandir detalle desde su tarjeta y cerrar hacia el mismo origen restaurando foco. | Continuidad espacial. | Dado un detalle, cuando abre/cierra/Escape, entonces origen y foco se conservan. | Video + activeElement. |
| PWM-SOL-005 Galería honesta | Must | SOL-W11/14 | mantener etiqueta conceptual visible y distinguir carga, ausencia y error sin ocultar texto. | Honestidad comercial. | Dado cualquier estado de imagen, cuando ocurre, entonces etiqueta/estado es legible y no declara proyecto real. | Fallo de imagen simulado. |
| PWM-SOL-006 Aplicación a contexto | Must | SOL-W12/19 | trasladar selección de aplicación a resumen, mensaje y URL de origen con feedback visible. | Confirmar contexto. | Dada una aplicación, cuando se selecciona, entonces categoría, nicho, aplicación y origen coinciden. | DOM + URL WhatsApp. |
| PWM-SOL-007 Cotización honesta | Must | SOL-W20/21 | diferenciar available, loading, error, handoff y success; success sólo con confirmación real. | No simular envío. | Dado popup bloqueado o handoff, cuando responde el canal, entonces el estado exacto se muestra y los datos permanecen. | Stubs del canal. |

## 12. Estados de entrada, interacción y salida

| ID / nombre | Pri. | Scope | El sistema debe… | Razón | Aceptación Given/When/Then | Validación |
|---|:---:|---|---|---|---|---|
| PWM-STATE-001 Base visible | Must | Todos | mantener contenido en estado final antes de inicializar mejora. | No-JS. | Dado script ausente, cuando carga, entonces nada queda oculto. | JS disabled/source. |
| PWM-STATE-002 Entrada finita | Must | A/C | ejecutar como máximo una entrada editorial por visita de viewport salvo cambio funcional. | Evitar repetición. | Dado scroll inverso, cuando vuelve, entonces no repite reveals. | Observer/debug. |
| PWM-STATE-003 Interacción inmediata | Must | B | iniciar feedback ≤100 ms y completarlo ≤280 ms. | Respuesta premium. | Dado pointer/teclado, cuando activa, entonces feedback cumple límites. | Performance recording. |
| PWM-STATE-004 Selección persistente | Must | Filtros/apps | conservar selected/current hasta una nueva causa explícita. | Estado inequívoco. | Dada selección, cuando termina motion, entonces el estado sigue visible y semántico. | ARIA/styles. |
| PWM-STATE-005 Salida breve | Must | Detalle/menú | limitar salida a ≤220 ms y no retrasar cambio de foco más de lo necesario. | Retorno ágil. | Dado cerrar/Escape, cuando ocurre, entonces foco retorna al terminar o antes de 250 ms. | Timer + activeElement. |
| PWM-STATE-006 Recuperación honesta | Must | Error/empty | mantener mensaje, reintento y alternativa sin autocierre. | Control del usuario. | Dado error, cuando aparece, entonces persiste hasta acción y no muestra éxito. | Error injection. |

## 13. Densidad y presupuesto de movimiento

| ID / nombre | Pri. | Scope | El sistema debe… | Razón | Aceptación Given/When/Then | Validación |
|---|:---:|---|---|---|---|---|
| PWM-DENS-001 Simultaneidad | Must | Viewport | limitar a 2 widgets A y 8 elementos animados simultáneos. | Evitar ruido. | Dado scroll rápido, cuando convergen grupos, entonces no exceden límites. | `getAnimations()` muestreado. |
| PWM-DENS-002 Pausas | Must | Secciones | dejar una zona estable entre coreografías densas y usar D como descanso. | Ritmo premium. | Dado recorrido completo, cuando termina un A, entonces existe pausa perceptible antes del siguiente A. | Timeline review. |
| PWM-DENS-003 Duración/distancia | Must | Global | usar entradas 240–620 ms, distancia ≤20 px y microinteracción 100–280 ms salvo excepción documentada. | Consistencia. | Dada inspección de keyframes, cuando se mide, entonces cumple presupuesto. | CSS/WAAPI audit. |
| PWM-DENS-004 Ambiente | Must | Hero/orbit | permitir máximo un comportamiento ambiental, sin afectar contenido, y detenerlo en reduced/hidden. | Control de atención. | Dado ambiente aprobado, cuando pestaña se oculta o reduce motion, entonces cesa. | visibility/reduced. |

## 14. Responsive y touch

| ID / nombre | Pri. | Scope | El sistema debe… | Razón | Aceptación Given/When/Then | Validación |
|---|:---:|---|---|---|---|---|
| PWM-RSP-001 Matriz de viewport | Must | Todos | funcionar a 1440, 1280, 768, 390, 320, landscape y reflow 200 %. | Cobertura real. | Dado cada contexto, cuando se recorre, entonces no hay overflow, corte o solapamiento. | Capturas/medición. |
| PWM-RSP-002 Orden DOM | Must | Grids/mapa | seguir orden DOM al cambiar columnas. | Lectura consistente. | Dado cambio de layout, cuando anima, entonces no cruza visualmente sobre otro elemento. | Slow-motion responsive. |
| PWM-RSP-003 Touch específico | Must | B | eliminar hover persistente y usar active/focus/selected con objetivos ≥44 px cuando sean controles primarios. | Operación móvil. | Dado pointer coarse, cuando interactúa, entonces no queda elevación pegada. | Emulación touch. |
| PWM-RSP-004 Densidad compacta | Must | ≤767 px | reducir distancia, stagger, conectores y simultaneidad, no sólo escalar desktop. | Fluidez. | Dado móvil, cuando carga, entonces máximo 1 A y 5 elementos animados simultáneos. | Animation count. |
| PWM-RSP-005 Reconfiguración | Must | Global | conservar estado ante resize/orientación sin listeners u observers duplicados. | Robustez. | Dado detalle/filtro activo, cuando rota, entonces estado y una sola instancia permanecen. | Debug counters. |

## 15. Accesibilidad

| ID / nombre | Pri. | Scope | El sistema debe… | Razón | Aceptación Given/When/Then | Validación |
|---|:---:|---|---|---|---|---|
| PWM-A11Y-001 Reduced motion completo | Must | Todos | suprimir traslación, escala, trazado, stagger y ambiente, conservando estado por color/borde/opacidad ≤120 ms. | Seguridad vestibular. | Dada preferencia reduce, cuando usa toda la página, entonces función y estado son equivalentes. | Emulación + video. |
| PWM-A11Y-002 Foco robusto | Must | Controles | mantener foco visible, no cubierto y con contraste suficiente durante y después de transiciones. | Teclado. | Dada tabulación, cuando cambia estado, entonces foco nunca desaparece. | Tab audit. |
| PWM-A11Y-003 Semántica estable | Must | Todos | no reordenar DOM, alterar nombres accesibles ni anunciar decoración. | Lectores de pantalla. | Dada comparación de árbol, cuando motion está activo, entonces semántica funcional coincide. | A11y snapshot. |
| PWM-A11Y-004 Estados anunciables | Must | Filtros/detalle/form | sincronizar ARIA/live regions con el estado real, sin anuncios duplicados. | Comprensión no visual. | Dado cambio funcional, cuando ocurre, entonces se anuncia una vez y después del cambio causal. | Screen reader/event log. |
| PWM-A11Y-005 Sin destellos ni dependencia temporal | Must | Global | evitar flashes, parallax amplio y tareas que expiren antes de lectura. | Seguridad/control. | Dado uso lento, cuando se detiene, entonces ninguna información desaparece por tiempo. | Manual + CSS audit. |

## 16. Rendimiento

| ID / nombre | Pri. | Scope | El sistema debe… | Razón | Aceptación Given/When/Then | Validación |
|---|:---:|---|---|---|---|---|
| PWM-PERF-001 Compositor | Must | Motion | animar principalmente transform/opacity y no layout, blur o filtros continuos. | Fluidez. | Dado código final, cuando se audita, entonces no hay propiedades de layout animadas. | Source + trace. |
| PWM-PERF-002 Vitals | Must | 4 rutas | conservar CLS 0, no crear long tasks >50 ms y mantener interacción observada ≤200 ms local. | Acabado medible. | Dada comparación con baseline, cuando se traza, entonces no hay regresión significativa atribuible. | DevTools trace. |
| PWM-PERF-003 Observación acotada | Must | Motor | conservar un observer compartido o justificar alternativa menor; limpiar recursos. | Evitar crecimiento. | Dado navegación/resize, cuando se inspecciona, entonces conteos son estables. | Debug/heap. |
| PWM-PERF-004 Peso/dependencias | Must | Assets | mantener CSS+JS propio total ≤35 KB sin nuevas librerías ni red. | Presupuesto. | Dado build local, cuando se pesan assets, entonces cumple límite. | File sizes/network. |
| PWM-PERF-005 LCP prioritario | Must | Heroes | no atenuar ni retrasar H1/LCP; iniciar mejora tras contenido visible. | Primera impresión. | Dado filmstrip, cuando carga, entonces H1 es legible en primer paint. | Trace/screenshot. |

## 17. Compatibilidad y preservación

| ID / nombre | Pri. | Scope | El sistema debe… | Razón | Aceptación Given/When/Then | Validación |
|---|:---:|---|---|---|---|---|
| PWM-COMP-001 Alcance aislado | Must | Assets | afectar sólo las cuatro rutas y no home/Servicio. | Evitar regresión. | Dadas rutas fuera de alcance, cuando cargan, entonces no reciben assets ni selectores nuevos. | Network/source. |
| PWM-COMP-002 Contratos de Soluciones | Must | Soluciones | preservar categorías, orden, publicación, hash, historial, detalle único, foco, imágenes, analítica y WhatsApp. | No romper función. | Dada suite actual, cuando corre, entonces permanece verde. | Tests + navegador. |
| PWM-COMP-003 Contenido inmutable | Must | 4 rutas | no añadir, eliminar, reordenar ni reescribir contenido, enlaces o CTA. | Alcance motion. | Dado diff semántico, cuando se compara, entonces contenido coincide. | DOM/text diff. |
| PWM-COMP-004 Fallback/API | Must | Motor | degradar a estado final si WAAPI, IntersectionObserver o JS no están disponibles. | Compatibilidad. | Dada API ausente, cuando carga, entonces todo sigue visible y usable sin error. | Stubs/no-JS. |

### 17.1 Referencias premium aprobadas para esta fase

React Bits se usa únicamente como **referencia de comportamiento**. La implementación debe ser propia, aislada y compatible con la arquitectura CSS/WAAPI existente: no se instalará React Bits, React, GSAP ni otra dependencia, no se copiará el diseño completo de los demos y ningún efecto podrá sustituir contenido, semántica o estados funcionales.

| ID / nombre | Pri. | Scope | El sistema debe… | Razón | Aceptación Given/When/Then | Validación |
|---|:---:|---|---|---|---|---|
| PWM-REF-001 Adaptación local | Must | Global | traducir las referencias aprobadas a primitivas propias dentro del presupuesto y los tokens existentes. | Conservar arquitectura y rendimiento. | Dado el build final, cuando se inspeccionan assets y red, entonces no existe código o dependencia remota de React Bits. | Source, network y tamaños. |
| PWM-REF-002 Spotlight Card | Must | MAT-W05, SOL-W10 | aplicar luz localizada muy sutil según puntero sólo en tarjetas de materiales y nichos, con equivalencia visible en focus. | Añadir tactilidad y profundidad semántica. | Dado pointer fine o teclado, cuando se explora una tarjeta, entonces la luz queda confinada a la superficie, no oculta texto y desaparece sin estado pegado. | Hover/focus/touch/reduced. |
| PWM-REF-003 Specular Button | Must | PRI-W08, PRO-W07, MAT-W07, SOL-W21 | ejecutar un reflejo corto en CTA de cotización y WhatsApp tras hover, focus o activación, sin bucle. | Refinar conversión sin distraer. | Dado un CTA, cuando recibe interacción, entonces el reflejo concluye dentro del presupuesto y no retrasa navegación ni handoff. | Timer, teclado, touch y popup stub. |
| PWM-REF-004 Border Glow | Must | MAT-W05, SOL-W10, SOL-W12 | reservar un brillo de borde localizado para material, nicho o aplicación interactiva/seleccionada. | Reforzar estado sin depender sólo del color. | Dado un estado focus o selected, cuando cambia, entonces borde y señal semántica coinciden y el brillo no aparece en superficies inertes. | Styles, ARIA y contraste. |
| PWM-REF-005 Animated Content | Must | Widgets A/C editoriales | adaptar entradas por desplazamiento a distancias ≤20 px, una sola reproducción y contenido visible antes de inicializar. | Dar ritmo sin repetir el preset original. | Dado scroll rápido, inverso o JS ausente, cuando se recorre la página, entonces no hay esperas, replays ni contenido oculto. | Observer, no-JS y filmstrip. |
| PWM-REF-006 Staggered Menu | Must | SOL-W01 | usar una secuencia corta como inspiración para el menú móvil, manteniendo control inmediato, Escape y restauración de foco. | Mejorar jerarquía del menú sin bloquear navegación. | Dado menú móvil, cuando abre o cierra con touch/teclado, entonces los elementos terminan en orden, la salida dura ≤220 ms y el foco es correcto. | Video, timers y activeElement. |
| PWM-REF-007 Glare Hover | Should | SOL-W11, SOL-W14 | permitir reflejo tenue sobre imágenes conceptuales únicamente con pointer fine y hover real. | Mejorar acabado de las referencias visuales. | Dada una imagen conceptual, cuando existe hover real, entonces el reflejo no tapa la etiqueta; en touch/reduced permanece estática. | Emulación de medios y contraste. |
| PWM-REF-008 Magic Bento | Should | MAT-W05, SOL-W09/10 | tomar sólo iluminación localizada y relación visual entre tarjetas, sin copiar layout, magnetismo ni efectos múltiples. | Reforzar pertenencia al grupo sin rediseñar contenido. | Dado un grid estable, cuando se explora, entonces conserva layout/orden/CLS 0 y sólo responde la superficie pertinente. | DOM diff, CLS y captura. |

## 18. Validación visual

| ID / nombre | Pri. | Scope | El sistema debe… | Razón | Aceptación Given/When/Then | Validación |
|---|:---:|---|---|---|---|---|
| PWM-VAL-001 Evidencia temporal | Must | A/B | producir filmstrips o video a velocidad normal y 0.25× para entrada, interacción y salida. | Evaluar timing real. | Dado cada A/B, cuando se revisa, entonces causa y final son visibles. | Evidencia por página. |
| PWM-VAL-002 Estados completos | Must | A/B | capturar default, hover, focus, active, selected, loading, error y reduced cuando apliquen. | Evitar huecos. | Dado inventario, cuando se audita, entonces cada estado requerido tiene evidencia. | Matriz de capturas. |
| PWM-VAL-003 Comparación anterior | Must | 4 rutas | comparar contra evidencia de `motion-refresh` con mismo viewport y scroll. | Demostrar mejora. | Dado antes/después, cuando se puntúa, entonces mejora ≥1 punto en diferenciación o profundidad sin degradar acceso. | Scorecard. |
| PWM-VAL-004 Revisión integral | Must | Global | verificar consola, overflow, textos, enlaces, zoom, touch, teclado, reduced, no-JS, traces y suite. | Definition of Done. | Dado candidato final, cuando termina auditoría, entonces no queda fallo Must ni error relevante. | Informe final. |

## 19. Matriz de puntuación premium

Cada dimensión se puntúa de 1 a 5. Los valores 2 y 4 representan progreso intermedio entre las anclas.

| Dimensión | 1 — insuficiente | 3 — correcto | 5 — premium |
|---|---|---|---|
| Intención funcional | Efecto decorativo intercambiable | Apoya la función principal | Hace evidente causa, estado y resultado |
| Diferenciación de página | Misma firma en todas | Algunas variaciones | Metáfora reconocible sin título |
| Firma de widget | Reveal genérico | Variación apropiada | Comportamiento propio, claro y coherente |
| Jerarquía temporal | Todo compite | Orden legible | Ritmo preciso con pausas y prioridades |
| Continuidad espacial | Saltos/desorientación | Origen entendible | Transformación causal y retorno exacto |
| Profundidad | Plano o falsa acción | Capas moderadas | Profundidad semántica y consistente |
| Estados | Faltan o son ambiguos | Estados básicos | Contrato completo y recuperable |
| Microinteracción | Lenta/color-only | Respuesta adecuada | Inmediata, multimodal y refinada |
| Responsive/touch | Desktop reducido | Adaptación funcional | Coreografía específica y natural |
| Accesibilidad | Motion bloquea | Cumple mínimos | Paridad total y foco ejemplar |
| Rendimiento | Jank/regresión | Sin regresión | Costo imperceptible y medido |
| Coherencia visual | Efectos aislados | Sistema consistente | Unidad con variedad controlada |

**Regla de aprobación:** promedio global ≥4.0; cada página ≥4.0; intención funcional, accesibilidad y rendimiento ≥4.5; ninguna dimensión <3; cero incumplimientos Must. El evaluador debe justificar cada puntuación con evidencia identificable.

## 20. Fuera del alcance

- Implementar CSS, JavaScript, HTML o animaciones en esta fase.
- Crear `design.md`, `tasks.md`, prototipos de código o librerías.
- Agregar, quitar, reordenar o reescribir secciones, nichos, productos, precios, textos, CTA o formularios.
- Crear imágenes, video, sonido, WebGL, cursores personalizados o modelos 3D.
- Cambiar analítica, WhatsApp, contenido estático, SEO, rutas o deployment.
- Scroll hijacking, pinning largo, autoplay, loops notorios, física elástica o gamificación.
- Convertir bloques informativos en controles sin un cambio funcional aprobado.

## 21. Riesgos

| Riesgo | Probabilidad | Impacto | Prevención requerida | Validación posterior |
|---|:---:|:---:|---|---|
| Repetir reveals con nombres nuevos | Alta | Alto | Firma y objetivo por widget A/B | Revisión ciega + PWM-G-001 |
| Sobrecargar páginas simples | Alta | Alto | Presupuesto de densidad y zonas D | Conteo simultáneo |
| Ocultar contenido durante carga | Media | Alto | Base visible y LCP prioritario | Filmstrip/no-JS |
| Romper hash, foco o back/forward | Media | Alto | Fuente de verdad funcional única | Navegación real |
| Doble animación en Soluciones | Alta | Alto | Un evento causal por cambio | Event/debug counters |
| Falsa interactividad/properties | Media | Alto | Profundidad semántica | Cursor/teclado/revisión |
| Jank por medición de layout | Media | Alto | Sin lecturas/escrituras intercaladas | Forced reflow trace |
| Movimiento vestibular | Baja | Alto | Reduced motion completo | Emulación dinámica |
| Touch con hover pegado | Media | Medio | Variante coarse pointer | Dispositivo emulado |
| Conectores que cruzan contenido | Media | Medio | Retirarlos al cambiar layout | 320–1440 + zoom |
| Scope creep visual/comercial | Media | Alto | Diff de contenido y alcance | Revisión de Git/DOM |
| Evaluación subjetiva | Alta | Medio | Matriz 1–5 con evidencia | Dos revisiones independientes |

## 22. Trazabilidad

| Objetivo | Página | Widgets | Nivel | Requerimientos cubiertos | Estados | Validación principal |
|---|---|---|:---:|---|---|---|
| Diferenciación, profundidad y calidad | Todas | Todos | A–D | PWM-G-001–008 | entrada/estable/interacción | Scorecard, video, presupuesto |
| Precisión y decisión | Precios | PRI-W03–08 | A/B | PWM-PRI-001–004 | entrada/focus/active | Filmstrip, scroll, comparación |
| Iteración y validación | Prototipado | PRO-W03–07 | A/B | PWM-PRO-001–004 | entrada/estable/focus | Responsive video, semántica |
| Selección y tactilidad | Materiales | MAT-W03–07 | A/B | PWM-MAT-001–004 | entrada/hover/focus/active | Styles, CLS, revisión honesta |
| Conexión y conversión | Soluciones | SOL-W01–22 | A–D | PWM-SOL-001–007 | filtro/detalle/imagen/form | History, foco, canal, error |
| Contrato temporal | Todas | A/B/C | A–C | PWM-STATE-001–006 | base/entrada/selección/salida/error | Timers, no-JS, ARIA |
| Ritmo y presupuesto | Todas | A/D | A/D | PWM-DENS-001–004 | simultáneo/pausa/ambiente | `getAnimations`, timeline |
| Adaptación | Todas | Todos | A–D | PWM-RSP-001–005 | desktop/touch/rotación/zoom | Matriz responsive |
| Acceso universal | Todas | Todos | A–D | PWM-A11Y-001–005 | reduced/focus/anuncio | A11y tree, teclado, emulación |
| Calidad técnica | Todas | Motor/heroes | A/C | PWM-PERF-001–005 | carga/scroll/cleanup | Traces, peso, heap |
| No regresión | Todas | Contratos existentes | A–D | PWM-COMP-001–004 | API/no-JS/history | Suite, source/network |
| Evidencia y aprobación | Todas | Todos | A–D | PWM-VAL-001–004 | todos los aplicables | Capturas, auditoría, informe |
| Referencias premium aprobadas | Todas | CTA, cards, imágenes, menú y entradas | A–C | PWM-REF-001–008 | hover/focus/active/selected/entry | Source, emulación, timers y evidencia visual |

La tabla cubre los **68 requerimientos** sin rangos solapados ni IDs huérfanos.

## 23. Criterios de aprobación de requisitos

Este documento queda aprobado para entrar a diseño cuando:

1. Las cuatro rutas, los 44 widgets y sus niveles A/B/C/D sean confirmados contra el DOM actual.
2. Los 68 requisitos sean aceptados, priorizados y trazables, sin contradicción con la primera iteración.
3. Se confirme que el objetivo es profundizar estados y relaciones, no aumentar la cantidad de movimiento.
4. Se acepte el presupuesto: máximo 2 widgets A/8 elementos simultáneos en desktop y 1 A/5 elementos en móvil.
5. Se acepte la matriz premium y su umbral de aprobación.
6. Diseño determine firmas concretas por widget, tratamiento del ambiente del orbit y selectores explícitos sin cambiar contenido.
7. Se mantengan como puertas de salida: no-JS, reduced motion, touch, teclado, historial/foco, CLS 0, sin long tasks, sin dependencias y suite actual verde.
8. Toda excepción a duración, distancia, simultaneidad o alcance quede documentada antes de implementación.
9. Las siete referencias aprobadas de React Bits se implementen como adaptaciones propias, sin librerías, código remoto ni copia integral de sus demos.

### Decisiones y bloqueos para la fase de diseño

- Decidir si el orbit del hero de Soluciones queda completamente finito o conserva un único ambiente casi imperceptible dentro de PWM-DENS-004.
- Definir firmas visuales concretas para los 19 widgets A y contratos de estado para los 13 widgets B.
- Elegir atributos/clases explícitos por widget que sustituyan selectores por posición sin alterar el contenido.
- Definir el método de revisión ciega y los dos evaluadores de la matriz premium.
- Confirmar si el límite de 35 KB se considera techo absoluto o si cualquier excepción requiere aprobación técnica explícita.
