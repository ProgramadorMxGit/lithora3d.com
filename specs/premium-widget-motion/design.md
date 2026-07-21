# Diseño — Premium Widget Motion

## 1. Resumen del diseño

- **Iniciativa:** Premium Widget Motion, segunda iteración para Lithora 3D.
- **Objetivo:** convertir los 44 widgets aprobados en un sistema de movimiento con propósito, estados completos y continuidad espacial.
- **Problema:** el refresh anterior es sólido y rápido, pero traduce funciones distintas a reveals, stagger y elevación casi idénticos.
- **Alcance:** únicamente `/precios-impresion-3d/`, `/prototipado-rapido/`, `/materiales-impresion-3d/` y `/ecosistema-soluciones/`.
- **Resultado esperado:** construcción visual precisa: superficie, estructura, contenido y control se activan en ese orden sólo cuando aporta significado.
- **Fuente:** los 68 requisitos de `requirements.md`; este diseño no los reduce ni contradice.
- **Diferencia frente al refresh:** se conserva el motor y se reemplazan presets posicionales por contratos individuales; no se incrementa movimiento por defecto.
- **Contenido:** textos, orden, imágenes, enlaces, CTA, estados de negocio, hash, historial, analítica y WhatsApp permanecen intactos.

## 2. Auditoría visual y de movimiento actual

Inspección con Chrome DevTools en las cuatro rutas de `http://localhost:8000`: un H1 por página, cero overflow, un `IntersectionObserver`, nueve listeners, cero ScrollTriggers y `data-motion-page` correcto. Se verificaron 5/4/4/5 secciones y 7/7/9/9 tarjetas respectivamente.

### Funciona bien y debe conservarse

- WAAPI defensiva, CSS aislado, tokens, inicialización idempotente, `visibilitychange`, `pagehide`, touch/reduced queries y estado `LithoraMotionDebug`.
- Base visible sin JS, scroll nativo, propiedades de compositor, focus visible y cierre con restauración de foco.
- Eventos `lithora:category-change`, `lithora:detail-open` y `lithora:detail-close`; hash, history, contexto y estados honestos del canal.
- Línea base: CLS 0; Lighthouse previo 100 en categorías auditadas; INP observado 83 ms.

### Funciona, pero necesita profundidad

- Hero por jerarquía, observer once, press, hover/focus, líneas decorativas y detalle inline.
- Orbit y mapa comunican conexión, pero no existe una transferencia continua hacia filtro, grid y detalle.
- Fichas de Materiales tienen superficie distinta, aunque su respuesta sigue siendo la de cualquier card.

### Debe reemplazarse

- `sectionItems` por índice y `nth-of-type`; se usarán contratos `data-motion-widget` y `data-motion-part`.
- `revealItems(up|left|right|scale)` como decisión final; queda sólo como fallback editorial C.
- Elevación/escala idéntica para todo artículo; cada A/B tendrá estados propios.

### Debe eliminarse

- Atenuación simultánea de grupos completos, conectores que no representan relación y cualquier ambiente en loop.
- Animación duplicada entre motor y `ecosistema.js`; el script funcional sólo emitirá causa/estado.

### Debe permanecer estático

- H1 en primer paint, texto esencial, cifras/textos, etiquetas “Ejemplo conceptual”, mensajes de error, campos y contenido informativo no interactivo.

## 3. Concepto rector: Ensamble de precisión

**Metáfora:** cada widget se materializa como una pieza diseñada: se establece el plano, se define su estructura, se asienta el contenido y entonces se habilita la acción. Las transiciones muestran unión, selección o expansión; nunca “decoran la espera”.

| Atributo | Regla concreta |
|---|---|
| Ritmo | Pulso firme: preparación 0–80 ms, ensamble 180–460 ms, reposo completo. |
| Peso | Superficies pesadas se mueven 4–10 px; texto 6–14 px; controles 1–2 px. |
| Profundidad | Borde/luz antes que sombra; máximo 4 px de elevación, seis niveles definidos abajo. |
| Dirección | Precios horizontal/medida; Prototipado avance conectado; Materiales capas verticales; Soluciones centro→rama→origen. |
| Respuesta | Feedback inicia ≤100 ms y estabiliza ≤280 ms. |
| Capas | Fondo quieto; superficie primero; estructura después; contenido; control al final. |
| Luz/sombra | Brillo localizado ≤24 % del área; sombra cambia sólo en controles/superficies accionables. |
| Conectores | Sólo entre elementos con relación real; `scaleX/Y`, nunca ancho/alto. |
| Entrada | Finita, una vez, base siempre visible; no más de dos A simultáneos. |
| Salida | Sólo funcional, 140–220 ms, hacia el origen; editorial no sale. |

## 4. Identidad por página

| Página | Metáfora | Ritmo | Permitido | Prohibido | Protagonista | Calma | Sensación final |
|---|---|---|---|---|---|---|---|
| Precios | Regla y plano de decisión | Corto, horizontal, ordenado | líneas de medida, agrupación, borde activo | cifras cambiantes, dashboard, flip | PRI-W05/06 | PRI-W07 | confianza y claridad |
| Prototipado | Ensamble iterativo | causa→validación→resultado | conectores por proximidad, consolidación | progreso falso, engranes, escáner | PRO-W05/06 | espacio previo a PRO-W07 | evolución controlada |
| Materiales | Muestrario por capas | pausado, táctil | luz superficial, borde, capa 4 px | deformar, derretir, física, color falso | MAT-W05 | MAT-W06 | selección informada |
| Soluciones | Red que se expande y vuelve | radial y contextual | núcleo/rama/origen, detalle inline | loop, marketplace, pérdida de origen | SOL-W05/09/13 | SOL-W17/22 | descubrimiento conectado |

El orbit será **completamente finito**: 620 ms máximo, sin pulso posterior. El presupuesto de 35 KB será techo absoluto.

## 5. Tokens de movimiento

### Tiempo y easing

| Token | Valor | Uso |
|---|---:|---|
| `instant` | 70 ms | inicio perceptible |
| `press` | 110 ms | active |
| `hover-focus` | 180 ms | respuesta reversible |
| `state` | 240 ms | selección/confirmación |
| `category` | 280 ms | filtro |
| `close` | 190 ms | retorno |
| `expand` | 340 ms | detalle |
| `editorial` | 420 ms | contenido C |
| `assemble` | 520 ms | widget A |
| `bridge` | 620 ms | relación entre widgets |

Easings: entrada `cubic-bezier(.16,1,.3,1)`; salida `(.4,0,1,1)`; respuesta `(.2,.8,.2,1)`; expansión `(.2,.9,.2,1)`; cierre `(.55,0,1,.45)`; categoría `(.22,.75,.18,1)`; físico `(.18,.75,.25,1)`; editorial `(.25,.8,.25,1)`.

### Distancia, escala, profundidad y stagger

- Texto 6–14 px; superficie 4–10 px; imagen 0–6 px; detalle 8–16 px; capa 2–4 px; móvil máximo 8 px.
- Press `.985`; elevación `1.006–1.012`; imagen máximo `1.015`; nunca escalar texto, mapas completos, formularios ni estados de error.
- Profundidad: Z0 base; Z1 información; Z2 interacción; Z3 selección; Z4 resultado; Z5 detalle. No se usa overlay modal.
- Stagger sólo para 2–6 piezas relacionadas, 35–65 ms; nunca listas largas, texto línea por línea ni todos los nodos de una sección. Móvil 20–35 ms; reduced 0.
- Simultaneidad: desktop 2 A/8 nodos; móvil 1 A/5 nodos; una transición funcional tiene prioridad sobre reveal.

## 6. Anatomía de un widget premium

Un A/B declara: superficie, contenido principal/secundario, control, indicador, decoración, origen, resultado, área activa y variante responsive. Flujo base: **visible → preparación óptica → ensamble → estable → respuesta/selección → transición → retorno**. Loading/error sólo existen donde ya existen. La superficie nunca oculta contenido; el indicador no agrega datos. Touch elimina hover; reduced sustituye traslación/escala/trazado por borde, fondo u opacidad ≤120 ms; fallback muestra estado estable.

## 7. Inventario maestro de 44 widgets

| ID diseño | Página | Nombre / región real | Nivel | Función | Actual / problema | Firma propuesta | Estados | Relación | CV/CT | Pri. | Req. |
|---|---|---|:---:|---|---|---|---|---|---|---|---|
| PRI-W01 | Precios | `.site-header` | C | navegar | feedback común | línea estable | f/a | W03 | B/B | S | G7 |
| PRI-W02 | Precios | breadcrumb hero | C | ubicar | reveal común | marca de origen | e/f | W03 | B/B | C | G3 |
| PRI-W03 | Precios | hero copy/acciones | A | explicar/convertir | hero genérico | plano→mensaje→acción | e/f/a | W04 | M/M | M | PRI1 |
| PRI-W04 | Precios | panel impacto | A | sintetizar | escala/lista | marco medido→filas | e/s | W03/05 | M/B | M | PRI1 |
| PRI-W05 | Precios | 4 factores | A | comparar causas | cards iguales | regla por factor | e/h/f | W04/06 | A/M | M | PRI2 |
| PRI-W06 | Precios | 3 escenarios | A | comparar contexto | igual a factores | columnas asentadas | e/h/f | W05 | M/M | M | PRI3 |
| PRI-W07 | Precios | 2 paneles de datos | B | preparar | listas planas | checklist quieto | e/fw | W08 | B/B | S | PRI4 |
| PRI-W08 | Precios | CTA final | B | convertir | CTA común | superficie→borde→flecha | e/f/a | W07 | M/B | M | PRI4 |
| PRO-W01 | Prototipo | header | C | navegar | común | línea estable | f/a | W03 | B/B | S | G7 |
| PRO-W02 | Prototipo | breadcrumb | C | ubicar | común | marca de origen | e/f | W03 | B/B | C | G3 |
| PRO-W03 | Prototipo | hero copy | A | plantear | genérico | boceto→mensaje→acción | e/f/a | W04 | M/M | M | PRO1 |
| PRO-W04 | Prototipo | panel ayuda | A | casos | lista | marco→puntos conectados | e/s | W03/05 | M/B | M | PRO1 |
| PRO-W05 | Prototipo | 3 beneficios | A | progresión | línea rígida | nodos por proximidad | e/h/f | W06 | A/M | M | PRO2 |
| PRO-W06 | Prototipo | 4 validaciones | A | opciones iterables | cards iguales | capas que convergen | e/h/f | W05/07 | A/M | M | PRO3 |
| PRO-W07 | Prototipo | CTA final | B | cerrar | común | consolidación→acción | e/f/a | W06 | M/B | M | PRO4 |
| MAT-W01 | Materiales | header | C | navegar | común | línea estable | f/a | W03 | B/B | S | G7 |
| MAT-W02 | Materiales | breadcrumb | C | ubicar | común | marca de origen | e/f | W03 | B/B | C | G3 |
| MAT-W03 | Materiales | hero copy | A | plantear selección | genérico | plano→pregunta→acción | e/f/a | W04 | M/M | M | MAT1 |
| MAT-W04 | Materiales | panel preguntas | A | diagnosticar | lista | capas de criterio | e/s | W03/05 | M/B | M | MAT1 |
| MAT-W05 | Materiales | 6 fichas | A | comparar | hover común | muestrario táctil | e/h/f/a | W04/06 | A/M | M | MAT2/3 |
| MAT-W06 | Materiales | 3 criterios | B | sintetizar | otra grid | bandeja convergente | e/h/f | W05/07 | M/B | S | MAT4 |
| MAT-W07 | Materiales | CTA final | B | orientar | común | superficie asistida | e/f/a | W06 | M/B | M | MAT4 |
| SOL-W01 | Soluciones | header/menú | B | navegar | aislado | panel anclado | c/o/f/a | W02 | M/M | M | G7 |
| SOL-W02 | Soluciones | hero copy | A | promesa | lineal | necesidad→acción | e/f/a | W03/05 | M/M | M | SOL1 |
| SOL-W03 | Soluciones | orbit | A | metáfora | capas básicas | núcleo finito→anillos→labels | e/s/r | W02/05 | A/M | M | SOL1 |
| SOL-W04 | Soluciones | heading mapa | C | preparar | heading común | pausa editorial | e | W05 | B/B | S | G3 |
| SOL-W05 | Soluciones | `.ecosystem-map` | A | explicar | reveal básico | red radial ensamblada | e/s | W03/06 | A/A | M | SOL1 |
| SOL-W06 | Soluciones | 4 map-category | B | elegir | subrayado | nodo cargado→transferencia | h/f/a/sel | W05/09 | M/A | M | SOL2 |
| SOL-W07 | Soluciones | explorer heading | C | contextualizar | común | puente quieto | e | W08/09 | B/B | S | G3 |
| SOL-W08 | Soluciones | category navigation | B | filtrar | subrayado | indicador deslizante | f/a/sel/hist | W06/09 | M/A | M | SOL2 |
| SOL-W09 | Soluciones | `#niche-grid` | A | resultado | stagger uniforme | intercambio por capas | l/r/e/err | W08/10 | A/A | M | SOL3 |
| SOL-W10 | Soluciones | niche-card ×9 | B | explorar | card común | foco interno→origen | e/h/f/o | W09/13 | A/M | M | SOL4 |
| SOL-W11 | Soluciones | image+badge | C | evidencia | zoom | marco de carga estático | l/m/err | W10/14 | M/M | M | SOL5 |
| SOL-W12 | Soluciones | aplicaciones | B | seleccionar | texto | ficha marcada→contexto | h/f/a/sel | W13/19 | M/M | M | SOL6 |
| SOL-W13 | Soluciones | niche-detail | A | expandir | apertura vertical | plano desde origen | l/r/e/o/c | W10/14 | A/A | M | SOL4 |
| SOL-W14 | Soluciones | detail-gallery | A | explorar | stagger igual | marcos por lectura | e/l/err | W11/13 | A/M | M | SOL5 |
| SOL-W15 | Soluciones | open/close | B | abrir/volver | común | vector de origen/retorno | f/a/ex | W10/13 | M/M | M | SOL4 |
| SOL-W16 | Soluciones | empty/detail-state | B | recuperar | funcional plano | superficie estable→retry | l/e/err/r | W09/13 | M/A | M | SOL7 |
| SOL-W17 | Soluciones | “No necesitas…” | D | descanso | sección animada | texto quieto | e/s | W18 | B/B | S | DENS2 |
| SOL-W18 | Soluciones | process-list | A | explicar proceso | filas genéricas | riel de ensamble | e/s | W17/20 | A/M | M | SOL1 |
| SOL-W19 | Soluciones | context-summary | C | confirmar origen | cambio abrupto | borde/fondo confirmado | d/u | W12/20 | M/M | M | SOL6 |
| SOL-W20 | Soluciones | quote-form | A | preparar canal | estático | superficie por estado | av/l/err/h/s | W19/21 | A/A | M | SOL7 |
| SOL-W21 | Soluciones | WhatsApp CTA | B | handoff | feedback separado | presión→estado→salida | f/l/err/h | W20 | M/A | M | SOL7 |
| SOL-W22 | Soluciones | footer | D | cierre | neutro | reposo | s/f | W20 | B/B | C | DENS2 |

CV/CT: baja, media, alta. Estados abreviados sólo corresponden a estados reales.

## 8. Fichas individuales — Nivel A (19)

Formato de storyboard: `momento [tiempo] · parte · inicial→final · easing · dependencia · objetivo`.

### A1 — PRI-W03 Hero de Precios
Identificación: hero copy/acciones; comunica variables antes de cotizar; PWM-PRI-001. Estáticos: H1, texto y destinos. Capas: fondo quieto, regla lateral, copy, botones.
Storyboard: M0 0 H1 estable; M1 0–260 regla `scaleY .2→1` entrada; M2 60–420 copy `y 8→0` editorial; M3 180–420 botones `opacity .85→1` respuesta; M4 estable; M5 press `.985→1`.
Estados/interacción: focus antes que hover; touch press; scroll once; resize no reinicia. Responsive: regla horizontal en móvil, sin stagger a 320. Reduced: borde/fondo 100 ms. Rendimiento: 4 nodos, transform/opacity, observer compartido, cleanup global. Premium: H1 primer paint, ≤1 A concurrente móvil, propósito/claridad ≥4.5.

### A2 — PRI-W04 Panel de impacto
Panel real con cuatro filas; PWM-PRI-001. Estáticos: texto. Fondo/superficie/borde/filas.
Storyboard: M0 visible; M1 0–260 borde izquierdo `scaleY .25→1`; M2 80–360 superficie `y 6→0`; M3 140–440 dos pares de filas con 45 ms; M4 quieto. Sin hover. Móvil: un grupo, 3 nodos. Reduced: borde aparece sin trazado. Riesgo: lista excesiva; máximo 4 animaciones.

### A3 — PRI-W05 Matriz de factores
Cuatro factores, PWM-PRI-002. Firma: regla de medición avanza por fila, no card flotante. M0 texto visible; M1 0–180 línea común; M2 80–380 superficies por pares; M3 160–460 marcas de medida; M4 estable; M5 hover/focus activa sólo borde del factor. Desktop 2 pares; móvil secuencia por viewport, no cuatro staggers. Reduced: borde/fondo. 6 nodos máx.; sin escala. Validación: no parece precio/plan.

### A4 — PRI-W06 Escenarios
Tres contextos, PWM-PRI-003. Firma: columnas se asientan sobre línea base. M0 visible; M1 base 0–220; M2 columnas 60–420 `y 8→0` 50 ms; M3 etiquetas 180–420 opacidad; M4 quieto; interacción sólo borde/focus, no selección. Móvil: base vertical retirada. Reduced: fondos alternos 100 ms. 5 nodos.

### A5 — PRO-W03 Hero de Prototipado
PWM-PRO-001. Firma: boceto se define y acción queda disponible. M0 H1 estable; M1 marco 0–260; M2 copy 60–420 `x -8→0`; M3 acciones 180–420; M4 quieto. Panel W04 espera al copy, no al scroll. Móvil vertical; reduced borde/opacidad. 4 nodos; sin falsa máquina.

### A6 — PRO-W04 Panel de ayuda
Cuatro usos, PWM-PRO-001. Firma: puntos se conectan como comprobaciones, no etapas. M1 superficie 0–240; M2 conector 80–300; M3 pares 120–440; estable sin hover. En móvil se elimina conector. Reduced: puntos presentes. 5 nodos; no numeración.

### A7 — PRO-W05 Beneficios conectados
PWM-PRO-002. M0 contenido visible; M1 nodo “Feedback” 0–260; M2 conector sólo cuando ambos vecinos visibles 120–360; M3 “Menor riesgo” 160–420; M4 segundo conector y “Presentación” hasta 520; M5 quieto. Hover/focus ilumina nodo y segmentos adyacentes, no mueve cards. Tablet/móvil sin conector horizontal; reduced borde común. 6 nodos, un observer de grupo.

### A8 — PRO-W06 Validaciones
PWM-PRO-003/004. Firma: cuatro capas convergen, sin orden obligatorio. M1 superficie común 0–200; M2 cuatro cards por pares 80–430; M3 borde central 180–460; M4 estable; focus eleva Z2 sin traslación. Móvil una card a la vez por viewport; reduced fondo/borde. 6 nodos. Semántica no cambia.

### A9 — MAT-W03 Hero de Materiales
PWM-MAT-001. M0 H1 estático; M1 plano de superficie 0–220; M2 copy 60–400; M3 acciones 180–420; W04 entra después. Dirección vertical 6 px; móvil 4 px; reduced fondo. 4 nodos. Debe sentirse selección, no catálogo interactivo.

### A10 — MAT-W04 Panel de preguntas
PWM-MAT-001. Firma: cuatro capas ópticas de criterio, no opciones. M1 borde 0–180; M2 superficie 40–280; M3 preguntas por dos grupos 100–420; M4 quieto. Sin hover/cursor/press. Móvil sin profundidad escalonada; reduced borde. 4 nodos.

### A11 — MAT-W05 Muestrario de seis materiales
PWM-MAT-002/003. M1 bandeja base 0–220; M2 fichas por fila 60–460, máximo 3 simultáneas; M3 luz localizada se asienta; M4 estable; M5 hover/focus borde+luz+`y -3`, escala 1.008; press .985. Texto/color estáticos. Móvil máximo 2 nodos, sin hover; reduced borde/fondo. Un observer, 8 nodos máximos; validar CLS y ausencia de propiedad simulada.

### A12 — SOL-W02 Hero copy
PWM-SOL-001. M0 H1 visible; M1 eyebrow 0–180; M2 texto 40–360; M3 acciones 140–420; M4 nota 220–480; W03 inicia al 120 ms. Touch/focus directo; reduced opacidad ≤100. 5 nodos, LCP intacto.

### A13 — SOL-W03 Orbit
PWM-SOL-001/DENS-004. M1 núcleo 0–240 `opacity .8→1`; M2 anillos 100–420 `scale .985→1`; M3 etiquetas radialmente 180–620, máximo 4; M4 quietud absoluta. Sin interacción/salida. Móvil reduce a núcleo+un anillo; reduced todo estático. 6 nodos; pausa al ocultar; sin loop.

### A14 — SOL-W05 EcosystemMap
PWM-SOL-001. M1 superficie 0–180; M2 núcleo 60–300; M3 ramas `scaleX/Y` 140–440; M4 nodos por pares 220–560; M5 estable. W06 seleccionado conserva Z3. Móvil elimina líneas y usa orden DOM. Reduced estado final. 7 nodos; una observación; no reflow.

### A15 — SOL-W09 NicheGrid
PWM-SOL-002/003. Transición: congela altura visual sin fijar píxeles persistentes; anteriores salen 0–140 `opacity 1→.75` sin traslado; DOM/hidden cambia por lógica; nuevas superficies entran 120–280 con 4 px y máximo 4 cards; estado final libera estilos. Loading/error cancelan transición. Móvil salida instantánea y entrada de 2. Reduced cambio de fondo 100 ms. Un evento por categoría; CLS 0.

### A16 — SOL-W13 NicheDetail
PWM-SOL-004. Origen calculado desde botón. M0 oculto; M1 insertar visible con superficie `scaleY .99→1`, origen exacto 0–220; M2 contenido 80–300; M3 galería delegada a W14; M4 foco permanece en flujo; cierre 0–190 hacia origen, luego `hidden` y foco. Error/loading no ocultan feedback. Móvil origen superior, sin escala; reduced opacidad 100 ms. 6 nodos, cancelación segura.

### A17 — SOL-W14 DetailGallery
PWM-SOL-005. M1 marco común 0–180; M2 figuras por pares 60–340; badges siempre visibles; imágenes cargadas cambian borde/opacidad, no escala de entrada; error sustituye contenido sin animación dramática. Touch sin zoom; reduced borde 100 ms. Máximo 5 nodos; lazy load intacto.

### A18 — SOL-W18 ProcessList
PWM-SOL-001. Tres pasos existentes: M1 riel 0–220; M2 paso 1 60–280; M3 pasos 2/3 por proximidad hasta 480; M4 riel queda estático. No representa progreso de sesión. Móvil sin riel, grupos independientes; reduced borde. 5 nodos.

### A19 — SOL-W20 QuoteForm
PWM-SOL-007. Superficie estable; available cambia borde; loading activa sólo indicador localizado del botón ≤1 s por ciclo, sin loop global; error usa borde+mensaje persistente; handoff confirma superficie/contexto; success sólo backend. Campos nunca se mueven. Touch/teclado iguales; reduced color/borde. 3 nodos, sin observer adicional; medición INP y popup bloqueado.

## 9. Fichas individuales — Nivel B (13)

### B1 PRI-W07 — Paneles de preparación
Listas se agrupan por panel: borde 180 ms, contenido estable; focus-within sólo si llega foco a enlace futuro, hoy sin hover. Touch/reduced estáticos. Máximo 2 nodos. PWM-PRI-004; valida que no compita con CTA.

### B2 PRI-W08 — CTA final
Bloque entra unido 360 ms; hover/focus: borde+luz y flecha 2 px; press .985/110 ms; salida sólo navegación nativa. Touch press, reduced borde. 3 nodos. PWM-PRI-004.

### B3 PRO-W07 — CTA de prototipo
Recibe la consolidación de W06 mediante borde superior, no animación encadenada obligatoria; respuestas como B2 con dirección de flecha. Scroll rápido lo muestra estable. PWM-PRO-004.

### B4 MAT-W06 — Criterios
Tres criterios aparecen como una bandeja que converge: superficie 220 ms, cards por grupo 35 ms; hover/focus sólo si son enlaces (hoy no). Reduced estático; 4 nodos. PWM-MAT-004.

### B5 MAT-W07 — CTA de soporte
Superficie se ilumina desde el borde cercano a W06; hover/focus borde+flecha; press; sin escala del bloque. Touch/reduced equivalentes. PWM-MAT-004.

### B6 SOL-W01 — Header/menú
Desktop sólo indicador focus/active. Móvil: botón press 110 ms; menú abre por opacidad+clip vertical 240 ms, cierra 190 ms y restaura foco; no cambia DOM order. Reduced opacidad 100 ms. PWM-G-007/A11Y-002.

### B7 SOL-W06 — Nodos del mapa
Hover/focus eleva borde a Z2; selected Z3 y conector asociado gana contraste; click inicia transferencia a W09. Touch selecciona al primer toque. Reduced cambio inmediato. Un evento. PWM-SOL-002.

### B8 SOL-W08 — CategoryNavigation
Indicador se desplaza entre cajas por transform 240 ms; texto no se mueve. History reproduce estado sin smooth scroll forzado. Focus halo independiente. Touch 44 px. PWM-SOL-002.

### B9 SOL-W10 — NicheCard
Entrada delegada a grid; hover/focus revela profundidad interna (imagen 1.012, borde, control 2 px), sin mover toda card más de 2 px. Open fija estado y origen. Touch usa selected/open. Reduced borde. PWM-SOL-003/004.

### B10 SOL-W12 — ApplicationList
Cada aplicación responde con borde/fondo 180 ms; selected mantiene marca lateral y actualiza W19; teclado Enter/Espacio, touch un toque. Sin entrada escalonada. PWM-SOL-006.

### B11 SOL-W15 — Open/close
Press inmediato; open emite vector hacia detalle; close invierte vector y restaura foco tras ≤220 ms. Escape equivale a close. Reduced sólo icono/borde. PWM-SOL-004/STATE-005.

### B12 SOL-W16 — Estados alternativos
Loading usa opacidad de indicador localizada; empty/error establecen superficie y mensaje; retry responde y no autocierra. Nada tiembla ni rebota. Reduced igual. PWM-STATE-006/SOL-007.

### B13 SOL-W21 — WhatsApp
Press 110 ms; loading deshabilita y cambia borde; handoff usa confirmación breve de fondo; popup bloqueado conserva error y contexto. No se anima éxito falso. PWM-SOL-007.

## 10. Reglas para Nivel C (10)

PRI/PRO/MAT-W01–02 y SOL-W04/W07/W11/W19 usan sólo reveal editorial de 280–420 ms, máximo 8 px, una vez. Headers no tienen reveal; breadcrumbs y headings permanecen legibles. SOL-W11 sólo anima estado real de imagen; SOL-W19 sólo borde/fondo al actualizar. Máximo dos C junto a un A, nunca stagger interno >2. Reduced: opacidad/borde ≤100 ms. C no puede elevarse, escalar como control ni iniciar una coreografía.

## 11. Zonas Nivel D

- **SOL-W17:** pausa entre exploración y proceso; texto visible, como máximo borde divisor 240 ms. Prohibidos stagger, parallax y movimiento de listas desde esta zona.
- **SOL-W22:** reposo final; sin entrada. Sólo focus de enlaces. Su acabado proviene de alineación, contraste y espacio, no de animación.

## 12. Diseño detallado de Precios

Recorrido: PRI-W03 establece plano; W04 mide variables; W05 relaciona factor/impacto; pausa; W06 asienta escenarios; W07 prepara datos; W08 concentra acción. Etiquetas permanecen fijas; líneas y marcos, no cifras, muestran jerarquía. Cards informativas no simulan selección. CTA usa superficie+borde+flecha; focus ≥ hover; touch press. Prohibidos contadores, flips, carrusel, escalas >1.012 y stagger total.

## 13. Diseño detallado de Prototipado

W03 plantea; W04 enumera usos sin convertirlos en pasos; W05 conecta beneficios sólo por proximidad visible; W06 converge validaciones sin progreso ficticio; W07 reúne el cierre. Conectores se retiran al apilar. No existen imágenes en el HTML actual, por lo que no se diseña movimiento de imagen. Prohibidos engranes, barras, escáner, impresión simulada y loops.

## 14. Diseño detallado de Materiales

W03 abre decisión; W04 forma un diagnóstico no interactivo; W05 presenta muestrario con luz/borde y tactilidad limitada; W06 sintetiza en una bandeja, no otra familia de material; W07 ofrece soporte. El texto de atributos aparece como información estable. No hay tablas ni imágenes actuales: no se inventan. Prohibida física, temperatura, deformación, color falso y rotación 3D.

## 15. Diseño detallado de Soluciones

Cadena: `W03 núcleo → W05 rama → W06/W08 categoría → W09 grid → W10 tarjeta → W13 detalle → W12 aplicación → W19 contexto → W20/W21 WhatsApp`. La selección de mapa/nav produce un único evento; el indicador precede al intercambio de grid. Cards anteriores se desacentúan antes de `hidden`; nuevas entran por grupo. El detalle nace del botón y cierra al mismo origen; foco vuelve tras cierre. Hash/history mandan sobre motion y cancelan transición anterior. Badge conceptual siempre estático y visible. Sin JS, enlaces/hash/contenido siguen disponibles. Ninguna tarjeta adquiere precio, carrito o affordance de compra.

## 16. Scroll choreography por página

| Página/región | A protagonista / soporte | Trigger/orden | Final/repetición | Calma/riesgo | Scroll rápido/regreso |
|---|---|---|---|---|---|
| Precios hero | W03/W04 | paint: plano→copy→panel | ≤520 ms/once | después del hero | final inmediato/no replay |
| Precios factores | W05 | 12 % viewport | ≤460/once | antes W06 | limita pares/no replay |
| Precios escenarios | W06 | viewport | ≤420/once | W07 | sin espera/no replay |
| Precios cierre | W07/W08 | viewport | ≤360/once | cierre | CTA inmediato |
| Prototipo hero | W03/W04 | paint | ≤520/once | separación | final inmediato |
| Prototipo beneficios | W05 | proximidad grupo | ≤520/once | antes W06 | conectores saltables |
| Prototipo validación | W06 | viewport | ≤460/once | antes CTA | aparece por pares |
| Prototipo cierre | W07 | viewport | ≤360/once | cierre | estable |
| Materiales hero | W03/W04 | paint | ≤500/once | separación | final inmediato |
| Materiales fichas | W05 | por fila | ≤460/once | antes W06 | máx. 3 nodos |
| Materiales síntesis | W06 | viewport | ≤360/once | pausa | estable al volver |
| Materiales cierre | W07 | viewport | ≤360/once | cierre | inmediato |
| Soluciones hero/mapa | W02/03→W05 | paint/viewport | ≤620/once | W04 | termina sin loop |
| Soluciones explorer | W09/W10 | categoría/viewport | ≤280/reversible por estado | W07 | cancela anterior |
| Soluciones detalle | W13/W14 | acción | ≤340/reversible | dentro del origen | prioridad funcional |
| Soluciones orientación | W17/W18 | viewport | ≤480/once | W17 | lista final inmediata |
| Soluciones quote | W20/W21 | acción/viewport | estado funcional | W22 | no replay editorial |

No hay hijacking, scrub ni pinning.

## 17. Transiciones entre widgets

| Patrón | Diseño |
|---|---|
| Control→resultado | control Z3 100 ms; resultado cambia 120–280 ms; control conserva estado. |
| Tarjeta→detalle | origen porcentual, `scaleY .99→1`, retorno inverso y foco. |
| Categoría→contenido | indicador se asienta; grid sale 140 ms; cambio DOM; entrada 160 ms. |
| Comparación→selección | borde/luz local, sin reordenar ni ocultar vecinos. |
| Imagen→atributo | imagen no dispara datos; carga sólo confirma marco. |
| Normal→loading/error | superficie estable; indicador localizado o borde+mensaje. |
| Loading→contenido | indicador cesa antes de opacidad 100 ms del contenido. |
| CTA→canal | press→loading→handoff/error; navegación externa no se finge. |

## 18. Capas y efectos visuales

| Recurso | Permitido/límite | Animación/riesgo | Móvil/reduced |
|---|---|---|---|
| Pseudo-elemento/borde | 1–2 por widget, 2 px | transform/opacidad; falsa acción | 1 / estático |
| Gradiente existente | ≤24 % superficie | background-position sólo micro; coste | fijo/fijo |
| Máscara/clip-path | sólo menú/ensamble simple | ≤340 ms; raster | opacidad/opacidad |
| Sombra | Z1–Z4, blur estático ≤28 px | color/opacidad; repaints | menor/fija |
| Brillo/reflejo | uno localizado | transform ≤8 px; neón | retirar/retirar |
| SVG/conector | ≤4 segmentos visibles | scale transform; cruces | simplificar/estático |
| Textura existente | fondo quieto | nunca animada | igual/igual |

Prohibidos blur grande animado, glassmorphism repetido, neón, partículas, fondo continuo, sombra gigante y filtros regionales.

## 19. Hover, focus y touch

Informativos: sin hover. Superficies explorables: hover usa borde+luz+≤3 px; focus añade outline y nunca es menor. Controles: icono 2 px, borde y press .985. Selecciones: marca persistente y ARIA. Touch omite hover, activa press y selección con un toque; objetivos primarios ≥44 px; no cambia tamaño del layout.

## 20. Reduced motion por tipo

Hero: contenido final y borde 100 ms. A: sin traslado/escala/stagger, sólo superficie/borde. B: focus/selected por borde/fondo ≤120 ms. Categoría: indicador salta al destino y grid cambia sin salida. Apertura/cierre: display/opacidad ≤100 ms y foco idéntico. Imagen: carga/error inmediato. CTA: press por fondo, no escala. Loading: texto/estado, sin loop; error persistente. No se usa una única regla para sustituir semántica.

## 21. Arquitectura propuesta

- Mantener CSS + WAAPI, un observer, idempotencia, cleanup, media queries y Visibility API.
- Añadir en futura implementación `data-motion-widget="PRI-W03"` y `data-motion-part="surface|content|control|indicator"`; ningún `nth-of-type` decide conducta.
- `motion-pages.js`: registro declarativo, scheduler con presupuesto, lifecycle y adaptadores `prices/prototype/materials/solutions`.
- `motion-pages.css`: tokens, capas, estados y variantes responsive/reduced, siempre bajo `data-motion-page`.
- Scripts de páginas: las tres landings no requieren script específico.
- `ecosistema.js`: conserva fuente de verdad; sólo emite eventos con origen/estado y acepta cancelación, sin animar dos veces.
- No se justifica módulo ni librería nueva. Un registro interno basta y mantiene el techo.

## 22. Presupuesto de rendimiento

- CSS+JS motion total ≤35 KB sin minificar; cero dependencias/red.
- 1 observer; listeners globales ≤9 actuales. Un listener delegado adicional sólo si reemplaza múltiples listeners, nunca neto >10.
- Simultáneas: 2 A/8 nodos desktop; 1 A/5 móvil; timeline máximo 8 nodos.
- Permitidas: transform, opacity, border/background color; sombra sólo micro. Restringidas: clip-path puntual. Prohibidas animaciones width/height/top/left/margin/padding/filter/blur.
- Cero long tasks >50 ms atribuibles; CLS 0; INP local objetivo ≤200 ms; LCP sin regresión >10 % frente a baseline equivalente.
- Conteos vuelven a cero; observer/listeners estables; heap sin crecimiento tras 20 cambios de categoría/detalle.
- Pausa fuera de viewport y pestaña; cancelación en cambio funcional/pagehide.
- No hay excepciones automáticas: superar 35 KB, un observer o límites requiere ADR técnico previo y reducción equivalente; no se considera bloqueo de diseño.

## 23. Estrategia de validación visual

Por cada A/B: video normal y 0.25× de entrada/estado/interacción/salida; capturas default, focus, touch, reduced y alternativos aplicables; registro de nodos/duración/propiedades. Por página: scroll normal/rápido/ascendente, 1440/1280/768/390/320, 844×390, reflow 200 %, resize/orientación, no-JS. Soluciones añade hash, back/forward, detalle, Escape, imagen fallida, loading/error/retry, popup bloqueado y handoff. Se comparará con `audits/2026-07-20/motion-refresh` usando mismo viewport.

## 24. Matriz premium por widget A/B

| Widgets | Propósito/continuidad | Jerarquía/timing | Respuesta/profundidad | Diferenciación/claridad | A11y/perf/integración/táctil | Evidencia |
|---|---|---|---|---|---|---|
| PRI-W03–06 | ≥4.5/4 | ≥4/4.5 | ≥4/4 | ≥4.5/4.5 | ≥4.5/4.5/4/4 | filmstrip, comparación |
| PRI-W07–08 | ≥4/4 | ≥4/4 | ≥4.5/4 | ≥4/4.5 | ≥4.5/4.5/4/4.5 | focus/touch |
| PRO-W03–06 | ≥4.5/4.5 | ≥4.5/4 | ≥4/4 | ≥4.5/4 | ≥4.5/4.5/4/4 | conectores/video |
| PRO-W07 | ≥4/4 | ≥4/4 | ≥4.5/4 | ≥4/4 | ≥4.5/4.5/4/4.5 | CTA states |
| MAT-W03–05 | ≥4.5/4 | ≥4/4 | ≥4.5/4.5 | ≥4.5/4.5 | ≥4.5/4.5/4/4.5 | styles/CLS |
| MAT-W06–07 | ≥4/4 | ≥4/4 | ≥4.5/4 | ≥4/4 | ≥4.5/4.5/4/4.5 | focus/touch |
| SOL-W02/03/05/09/13/14/18/20 | ≥4.5/4.5 | ≥4.5/4 | ≥4/4 | ≥4.5/4.5 | ≥4.5/4.5/4.5/4 | history/trace/video |
| SOL-W01/06/08/10/12/15/16/21 | ≥4.5/4.5 | ≥4/4.5 | ≥4.5/4 | ≥4/4.5 | ≥4.5/4.5/4.5/4.5 | state matrix |

Son objetivos, no puntuaciones finales. Ningún widget puede aprobar con una dimensión <3.

## 25. Errores y estados alternativos

Imagen fallida: sustitución inmediata, badge “Imagen no disponible”, sin shake. Datos ausentes/categoría vacía: superficie estable y alternativa. Loading: indicador local, `aria-busy`, sin ocultar mensaje. Error/retry: borde+texto persistente; retry press. CTA no disponible/WhatsApp bloqueado: error honesto y contexto intacto. JS/observer fallido: estado final visible. Animación cancelada: `finish/cancel` limpia estilos y aplica estado funcional vigente. Resize durante animación: cancelar decoración, recalcular sólo origen al siguiente evento y conservar selección/foco.

## 26. Trazabilidad de los 68 requisitos

| ID | Página / widget / nivel | Decisión y estado | Animación / reduced motion | Validación / riesgo |
|---|---|---|---|---|
| PWM-G-001 | Todas / A-B | Firma por función | Contrato individual / borde | Video ciego / repetición |
| PWM-G-002 | Cuatro rutas / A | Metáfora propia | Dirección por página / estático | Revisión ciega / homogeneidad |
| PWM-G-003 | Todas / A-C | Causa antes de soporte | Scheduler / sin secuencia | Scroll rápido / espera |
| PWM-G-004 | Superficies / A-C | Z0–Z5 semántico | Borde-luz / borde | Hover audit / acción falsa |
| PWM-G-005 | Soluciones / A-B | Origen y retorno | Transform de origen / opacidad | Video-foco / desorientación |
| PWM-G-006 | Todas / A-D | Quietud final | Cero loops / todo estático | Animations panel / ruido |
| PWM-G-007 | Controles / B-C | Señal multimodal | Borde+posición / borde | Teclado-touch / color-only |
| PWM-G-008 | A-B | Presupuesto por ficha | Límites declarados / sin traslado | Checklist / exceso |
| PWM-PRI-001 | Precios / PRI-W03-04 / A | Hero antes que panel | Plano→copy→marco / borde | Filmstrip-LCP / H1 tardío |
| PWM-PRI-002 | Precios / PRI-W05 / A | Regla por factor | Marcas transform / borde | Revisión / precio falso |
| PWM-PRI-003 | Precios / PRI-W06 / A | Columnas de escenario | Asentamiento / fondo | Comparación / misma firma |
| PWM-PRI-004 | Precios / PRI-W07-08 / A-B | Pausa→CTA | Bloque+flecha / borde | Scroll-focus / competencia |
| PWM-PRO-001 | Prototipo / PRO-W03-04 / A | Boceto→casos | Marco y puntos / borde | Filmstrip / simulación |
| PWM-PRO-002 | Prototipo / PRO-W05 / A | Beneficios conectados | Nodos+segmentos / sin línea | Responsive / proceso falso |
| PWM-PRO-003 | Prototipo / PRO-W06 / A | Opciones convergentes | Pares, no pasos / fondo | Semántica / secuencia falsa |
| PWM-PRO-004 | Prototipo / PRO-W06-07 / A-B | Consolidación→CTA | Borde compartido / borde | Scroll rápido / bloqueo |
| PWM-MAT-001 | Materiales / MAT-W03-04 / A | Preguntas no accionables | Capas ópticas / borde | Cursor-a11y / formulario falso |
| PWM-MAT-002 | Materiales / MAT-W05 / A | Muestrario honesto | Luz+borde / fondo | Contenido / propiedad falsa |
| PWM-MAT-003 | Materiales / MAT-W05 / A | Tactilidad limitada | y≤3, scale≤1.008 / borde | CLS-styles / deformación |
| PWM-MAT-004 | Materiales / MAT-W06-07 / A-B | Síntesis→soporte | Bandeja+CTA / borde | Video / otra grid |
| PWM-SOL-001 | Soluciones / W02-06,18 / A-B | Núcleo→rama | Ensamble finito / estado final | Filmstrip / loop |
| PWM-SOL-002 | Soluciones / W06,08-09 / A-B | Una causa de categoría | Indicador→grid / cambio directo | Event-history / duplicado |
| PWM-SOL-003 | Soluciones / W09-10 / A-B | Intercambio estable | Salida140+entrada160 / directo | Trace-CLS / flash |
| PWM-SOL-004 | Soluciones / W10,13,15 / A-B | Detalle con origen | Expand/cierre inverso / opacidad | Foco-Escape / pérdida origen |
| PWM-SOL-005 | Soluciones / W11,14 / A-C | Galería honesta | Marcos por pares / borde | Error imagen / badge oculto |
| PWM-SOL-006 | Soluciones / W12,19 / B-C | Aplicación→contexto | Marca+borde / inmediato | DOM-URL / contexto perdido |
| PWM-SOL-007 | Soluciones / W16,20-21 / A-B | Canal por estado real | Superficie localizada / borde | Stubs / éxito falso |
| PWM-STATE-001 | Todos / A-D | Base final visible | Mejora progresiva / igual | No-JS / contenido oculto |
| PWM-STATE-002 | Editorial / A-C | Entrada once | Observer compartido / ninguna | Scroll inverso / replay |
| PWM-STATE-003 | Controles / B | Inicio ≤100 ms | 110–280 ms / borde | Trace / latencia |
| PWM-STATE-004 | Filtros-apps / B | Selección persistente | Marca Z3 / borde | ARIA-styles / ambigüedad |
| PWM-STATE-005 | Detalle-menú / A-B | Cierre ≤220 ms | Retorno 190 / opacidad | Timer-foco / demora |
| PWM-STATE-006 | Alternativos / B | Error persistente | Borde+mensaje / igual | Inyección / dramatización |
| PWM-DENS-001 | Viewport / A-B | 2A/8; móvil 1A/5 | Scheduler / sin secuencia | Conteo / saturación |
| PWM-DENS-002 | Todas / D | Pausas explícitas | Divisor mínimo / estático | Timeline / fatiga |
| PWM-DENS-003 | Todas / A-C | Rangos de tokens | 70–620 ms, ≤20 px / 0 px | Source audit / exceso |
| PWM-DENS-004 | Soluciones / SOL-W03 / A | Orbit finito | 620 ms, cero loop / estático | Visibility / ambiente |
| PWM-RSP-001 | Todas / A-D | Matriz 1440–320+zoom | Variante por breakpoint / igual | Capturas / overflow |
| PWM-RSP-002 | Grids-mapa / A | Orden DOM manda | Conectores adaptados / ninguno | Slow video / cruces |
| PWM-RSP-003 | Controles / B | Touch de un toque | Press-selected / borde | Coarse emulation / hover pegado |
| PWM-RSP-004 | Móvil / A-C | Densidad compacta real | Máx.5 nodos / sin secuencia | Conteo / desktop reducido |
| PWM-RSP-005 | Global / A-B | Estado sobre resize | Cancelar decoración / inmediato | Debug / duplicados |
| PWM-A11Y-001 | Todos / A-D | Reduced por tipo | Borde/fondo ≤120 / nativa | Emulación / vestibular |
| PWM-A11Y-002 | Controles / B-C | Focus ≥ hover | Outline+borde / igual | Tab audit / foco perdido |
| PWM-A11Y-003 | Todos / A-D | DOM y nombres estables | Decoración aria-hidden / igual | A11y tree / reorden |
| PWM-A11Y-004 | Estados / A-B | ARIA sincronizado | Anuncio tras causa / igual | SR-event log / duplicado |
| PWM-A11Y-005 | Todos / A-D | Sin destellos/expiry | Quietud / quietud | Manual / dependencia temporal |
| PWM-PERF-001 | Motor / A-C | Compositor primero | Transform-opacity / mínimo | Source-trace / reflow |
| PWM-PERF-002 | Cuatro rutas / A-B | Vitals protegidos | Scheduler / menos nodos | Trace / regresión |
| PWM-PERF-003 | Motor / todos | Un observer, cleanup | Registro común / igual | Debug-heap / fuga |
| PWM-PERF-004 | Assets / global | Techo 35 KB, sin libs | Registro compacto / CSS | File-network / sobrepeso |
| PWM-PERF-005 | Heroes / A | H1 primer paint | Decoración después / estático | LCP-filmstrip / atenuación |
| PWM-COMP-001 | Rutas / todos | Scope por body/widget | CSS aislado / igual | Network / home afectada |
| PWM-COMP-002 | Soluciones / A-B | Contratos intactos | Eventos, no lógica / igual | Suite-browser / regresión |
| PWM-COMP-003 | Cuatro rutas / todos | Contenido inmutable | Sólo capas decorativas / igual | DOM-text diff / scope creep |
| PWM-COMP-004 | Motor / todos | Fallback por API | Aplicar estado final / nativa | Stubs-noJS / bloqueo |
| PWM-VAL-001 | A-B | Evidencia temporal | Normal+0.25× / reduced | Filmstrips / juicio parcial |
| PWM-VAL-002 | A-B | Estados completos | Captura por contrato / reduced | Matriz / huecos |
| PWM-VAL-003 | Cuatro rutas | Antes/después equivalente | Mismo viewport / idem | Scorecard / comparación sesgada |
| PWM-VAL-004 | Global | Auditoría integral | Todos los contextos / no-JS | Informe-suite / omisión |

| PWM-REF-001 | Global / A-C | Adaptación local sin librerías | CSS vars + WAAPI propio / estado final | Source-network / dependencia externa |
| PWM-REF-002 | Materiales W05; Soluciones W10 / A-B | Spotlight localizado | radial-gradient confinado / borde | Fine-focus-touch / luz invasiva |
| PWM-REF-003 | PRI-W08, PRO-W07, MAT-W07, SOL-W21 / B | Reflejo especular corto | pseudo-elemento 160–240 ms / borde | Timer-handoff / loop o retraso |
| PWM-REF-004 | MAT-W05, SOL-W10, SOL-W12 / A-B | Glow sólo en estado causal | borde localizado / outline+borde | ARIA-contraste / color-only |
| PWM-REF-005 | A/C editoriales / A-C | Entrada de contenido adaptada | y/x ≤20 px, once / visible | Observer-noJS / preset repetido |
| PWM-REF-006 | SOL-W01 / B | Menú móvil escalonado | 3–4 ítems, 25–40 ms / inmediato | Touch-Escape-foco / bloqueo |
| PWM-REF-007 | SOL-W11, SOL-W14 / A-C | Glare tenue en imagen conceptual | barrido 180–260 ms / ninguno | Fine-reduced-etiqueta / deslumbramiento |
| PWM-REF-008 | MAT-W05, SOL-W09/10 / A-B | Relación tipo bento sin copiar layout | luz compartida acotada / borde | CLS-DOM / rediseño o magnetismo |

Cobertura explícita: **68 filas, 68 IDs únicos**. Cada fila identifica página/widget/nivel, decisión, estado, animación, reduced motion, validación y riesgo.

## 27. Decisiones y supuestos

### Decisiones confirmadas

WAAPI/CSS, sin librerías; orbit finito; contratos explícitos; 35 KB absoluto; un observer; contenido y contratos intactos.

### Decisiones de diseño propuestas

“Ensamble de precisión”, scheduler de densidad, firmas por página, capas Z0–Z5 y transferencia espacial de Soluciones.

### Decisiones reversibles

Valores de 20–40 ms dentro de rangos, intensidad de sombra, orientación de líneas al cambiar breakpoint y brillo localizado.

### Supuestos

El DOM y los 44 widgets permanecen como fueron auditados; Tailwind CDN de tres landings sigue fuera del alcance; no aparecen nuevos estados comerciales.

### Bloqueadores reales

Ninguno para convertir este diseño en tareas. Una futura modificación de contenido/DOM o un requisito de superar 35 KB exigiría revisar trazabilidad, no bloquear esta especificación.

### 27.1 Adaptación aprobada de referencias React Bits

Las referencias son patrones de interacción, no componentes a importar. Se implementarán con las primitivas existentes, conservando “Ensamble de precisión”, la identidad negro/gris/amarillo y el contenido actual.

| Prioridad | Referencia | Traducción para Lithora | Widgets | Límites obligatorios |
|:---:|---|---|---|---|
| 1 | [Spotlight Card](https://reactbits.dev/components/spotlight-card) | `radial-gradient` tenue controlado por variables `--spot-x/--spot-y`; la luz vive en pseudo-elemento y nunca toca layout. | MAT-W05, SOL-W10 | Opacidad baja; sólo `pointer:fine`; focus equivalente por borde/luz fija; touch y reduced sin seguimiento. |
| 3 | [Specular Button](https://reactbits.dev/components/specular-button) | Reflejo diagonal corto dentro del CTA, disparado una vez por hover/focus/press y cancelable al navegar. | PRI-W08, PRO-W07, MAT-W07, SOL-W21 | 160–240 ms; sin auto-animate; sin canvas; no retrasa click, WhatsApp ni estado loading/error. |
| 4 | [Border Glow](https://reactbits.dev/components/border-glow) | Acento amarillo localizado en el borde como segunda señal de focus/selected. | MAT-W05, SOL-W10, SOL-W12 | No continuo, no neón, no superficies inertes; conservar outline y `aria-selected`/estado funcional. |
| 5 | [Animated Content](https://reactbits.dev/animations/animated-content) | Familia de entradas editoriales propia con dirección determinada por la función y el flujo de cada página. | A/C editoriales | ≤20 px; 240–620 ms; once; sin GSAP/ScrollTrigger; base visible y sin encadenar lectura esencial. |
| 6 | [Staggered Menu](https://reactbits.dev/components/staggered-menu) | Apertura del menú móvil con panel primero y enlaces después en una secuencia compacta. | SOL-W01 | Stagger 25–40 ms, máximo cuatro ítems visibles por lote; cierre ≤220 ms; Escape, focus trap/retorno y touch intactos. |
| 7 | [Glare Hover](https://reactbits.dev/animations/glare-hover) | Barrido luminoso tenue sobre la imagen, no sobre texto ni badge conceptual. | SOL-W11, SOL-W14 | Sólo hover real; una ejecución por entrada; deshabilitado en coarse/reduced; recortado al marco. |
| 8 | [Magic Bento](https://reactbits.dev/components/magic-bento) | Relación óptica entre tarjetas mediante una luz compartida acotada al grupo. | MAT-W05, SOL-W09/10 | No copiar bento, layout, tilt, magnetismo, partículas ni múltiples efectos; CLS 0 y orden DOM intacto. |

#### Composición y precedencia

- Spotlight y Border Glow pueden convivir en la misma tarjeta, pero comparten una única capa decorativa y un único cálculo de puntero.
- Magic Bento no crea una tercera animación: sólo coordina la posición/intensidad de esa capa entre tarjetas hermanas.
- Specular Button es exclusivo de CTA y no se reutiliza en cards, navegación o controles secundarios.
- Glare Hover se limita a imágenes conceptuales y debe mantener visible “Ejemplo conceptual” durante todo el barrido.
- Animated Content conserva las firmas por página; queda prohibido convertir todos los widgets en el mismo reveal.
- Las URL anteriores documentan inspiración y no forman parte de la carga, build o disponibilidad de producción.

## 28. Criterios de aprobación de design.md

- [x] 44 widgets inventariados; 19 fichas A y 13 fichas B individuales.
- [x] Reglas propias para 10 C y 2 D.
- [x] Cuatro identidades y coreografías completas, con zonas de calma.
- [x] Entrada, estado, interacción, salida, touch, focus y reduced definidos.
- [x] Arquitectura sin librerías, selectores explícitos y presupuesto verificable.
- [x] Matriz premium preparada sin declarar resultados.
- [x] 68 requisitos trazados, incluidos `PWM-REF-001–008`.
- [x] Documento convertible directamente a `tasks.md`.
- [x] No se modificó código ni contenido en esta fase.
