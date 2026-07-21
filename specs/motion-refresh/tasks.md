# Tareas — Motion refresh

## A. Auditoría y seguridad

## TASK-MOTION-001 — Auditar estado, rutas y línea base

- **Estado:** Completada
- **Prioridad:** Must
- **Página:** Global
- **Dependencias:** Ninguna
- **Paralelizable:** No
- **Requerimientos:** RMG-005, RMG-008, RMRSP-001, RMPERF-003
- **Archivos afectados:** `changes.md`, `audits/2026-07-20/motion-refresh/`
- **Objetivo:** disponer de una línea base reproducible sin alterar trabajo existente.

### Pasos

- [x] Leer `changes.md` e inspeccionar el diff actual.
- [x] Confirmar rutas, archivos compartidos, selectores, GSAP y ScrollTrigger.
- [x] Auditar animaciones, reduced motion, riesgos y contenido oculto.
- [x] Guardar capturas iniciales desktop y mobile de las cuatro rutas.
- [x] Registrar LCP, CLS, scripts, animaciones y overflow iniciales.

### Validación

- [x] Validación funcional de carga directa.
- [x] Validación visual inicial.
- [x] Validación responsive inicial.
- [x] Validación inicial de accesibilidad estructural.
- [x] Validación inicial de rendimiento.
- [x] Sin errores de consola relevantes en la inspección inicial.

### Criterio de finalización

Las cuatro rutas, su arquitectura y métricas base están documentadas con evidencia local.

## B. Sistema global de movimiento

## TASK-MOTION-002 — Crear tokens y estilos compartidos aislados

- **Estado:** Completada
- **Prioridad:** Must
- **Página:** Global
- **Dependencias:** TASK-MOTION-001
- **Paralelizable:** No
- **Requerimientos:** RMG-001, RMG-003, RMG-004, RMG-008, RMA-002, RMPERF-001
- **Archivos afectados:** `assets/motion-pages.css`
- **Objetivo:** implementar tokens, microinteracciones, identidades y fallbacks sin afectar la home.

### Pasos

- [x] Definir duraciones, easings, distancias y stagger.
- [x] Aislar reglas bajo `body[data-motion-page]`.
- [x] Crear estados hover, focus y active equivalentes.
- [x] Crear composiciones y conectores decorativos por ruta.
- [x] Implementar responsive, touch y reduced motion.

### Validación

- [x] Validación funcional sin dependencia de CSS externo nuevo.
- [x] Validación visual de las cuatro identidades.
- [x] Validación responsive 1440/1280/768/390/320.
- [x] Validación de focus y reduced motion.
- [x] Validación de propiedades animadas eficientes.
- [x] Sin errores de consola.

### Criterio de finalización

Existe un sistema CSS compartido, acotado y adaptable que no oculta contenido base.

## TASK-MOTION-003 — Crear motor de revelado y ciclo de vida

- **Estado:** Completada
- **Prioridad:** Must
- **Página:** Global
- **Dependencias:** TASK-MOTION-002
- **Paralelizable:** No
- **Requerimientos:** RMG-002, RMG-005, RMG-006, RMG-007, RMRSP-002, RMRSP-003, RMPERF-002, RMPERF-004
- **Archivos afectados:** `assets/motion-pages.js`
- **Objetivo:** inicializar por ruta, animar sólo al viewport y limpiar todos los recursos.

### Pasos

- [x] Implementar inicialización idempotente por `data-motion-page`.
- [x] Implementar presets de hero, heading, cards, rows, line y CTA.
- [x] Agrupar revelados con un IntersectionObserver y ejecución única.
- [x] Detectar reduced motion, touch, resize, orientación y visibilidad.
- [x] Pausar/reanudar y limpiar observer, listeners y animaciones.
- [x] Exponer diagnóstico local sin datos personales.
- [x] Garantizar fallback visible si APIs o script fallan.

### Validación

- [x] Validación funcional con carga, scroll y navegación repetida.
- [x] Validación visual rápida/lenta/inversa.
- [x] Validación responsive y orientación.
- [x] Validación reduced motion y no-JS.
- [x] Validación de listeners, observers, peso y animaciones activas.
- [x] Sin errores de consola.

### Criterio de finalización

Cada ruta activa exactamente una instancia, ejecuta movimiento útil y libera recursos en `pagehide`.

## C. Precios

## TASK-MOTION-004 — Implementar precisión y comparación en Precios

- **Estado:** Completada
- **Prioridad:** Must
- **Página:** Precios
- **Dependencias:** TASK-MOTION-003
- **Paralelizable:** Sí
- **Requerimientos:** RMP-001, RMP-002, RMP-003, RMRSP-001, RMA-001
- **Archivos afectados:** `precios-impresion-3d/index.html`, `assets/motion-pages.css`, `assets/motion-pages.js`
- **Objetivo:** dotar hero, factores, escenarios, listas, etiquetas y CTA de una coreografía precisa sin alterar textos.

### Pasos

- [x] Conectar la ruta al sistema aislado.
- [x] Secuenciar hero y resumen sin bloquear LCP.
- [x] Agrupar tarjetas de factores y escenarios con bordes/conectores.
- [x] Revelar listas como filas comparables.
- [x] Añadir feedback a etiquetas, enlaces y CTA existentes.
- [x] Resolver desktop, laptop, tablet, mobile, small, touch y reduced motion.

### Validación

- [x] Todos los enlaces/CTA conservan su destino.
- [x] Jerarquía visual y textos permanecen intactos.
- [x] Sin overflow, corte o superposición en viewports requeridos.
- [x] Teclado, focus y reduced motion correctos.
- [x] LCP/CLS/INP sin regresión significativa.
- [x] Sin errores de consola.

### Criterio de finalización

Precios comunica comparación y decisión con movimiento sobrio y verificable.

## D. Prototipado

## TASK-MOTION-005 — Implementar progresión en Prototipado

- **Estado:** Completada
- **Prioridad:** Must
- **Página:** Prototipado
- **Dependencias:** TASK-MOTION-003
- **Paralelizable:** Sí
- **Requerimientos:** RMR-001, RMR-002, RMR-003, RMRSP-001, RMA-001
- **Archivos afectados:** `prototipado-rapido/index.html`, `assets/motion-pages.css`, `assets/motion-pages.js`
- **Objetivo:** conectar hero, beneficios, validaciones, iconos, tarjetas y CTA como progresión existente.

### Pasos

- [x] Conectar la ruta al sistema aislado.
- [x] Secuenciar hero y resumen.
- [x] Añadir conector decorativo y orden progresivo a beneficios.
- [x] Diferenciar la iteración de las cuatro validaciones.
- [x] Integrar imágenes/iconos y CTA sin simulaciones técnicas.
- [x] Resolver responsive, touch y reduced motion.

### Validación

- [x] No se agregan etapas ni se altera el flujo.
- [x] Conectores siguen el orden de lectura.
- [x] Sin overflow en todos los viewports.
- [x] Teclado, focus, touch y reduced motion correctos.
- [x] Scroll rápido/inverso fluido y métricas estables.
- [x] Sin errores de consola.

### Criterio de finalización

Prototipado comunica evolución e iteración sin afirmar un proceso nuevo.

## E. Materiales

## TASK-MOTION-006 — Implementar tactilidad honesta en Materiales

- **Estado:** Completada
- **Prioridad:** Must
- **Página:** Materiales
- **Dependencias:** TASK-MOTION-003
- **Paralelizable:** Sí
- **Requerimientos:** RMM-001, RMM-002, RMM-003, RMRSP-001, RMA-003
- **Archivos afectados:** `materiales-impresion-3d/index.html`, `assets/motion-pages.css`, `assets/motion-pages.js`
- **Objetivo:** mejorar selección/comparación de fichas, criterios, estados y CTA sin inventar propiedades.

### Pasos

- [x] Conectar la ruta al sistema aislado.
- [x] Secuenciar hero y preguntas existentes.
- [x] Revelar fichas por fila con profundidad mínima.
- [x] Implementar estados hover/focus/active sin deformación.
- [x] Agrupar criterios y CTA final.
- [x] Resolver responsive, touch y reduced motion.

### Validación

- [x] Materiales y propiedades visibles permanecen idénticos.
- [x] Estados de ficha no sugieren propiedades físicas.
- [x] Sin overflow o deformación.
- [x] Focus, touch y reduced motion correctos.
- [x] LCP/CLS/INP sin regresión significativa.
- [x] Sin errores de consola.

### Criterio de finalización

Materiales se siente explorable y táctil sin falsear información.

## F. Soluciones

## TASK-MOTION-007 — Implementar conexión del ecosistema

- **Estado:** Completada
- **Prioridad:** Must
- **Página:** Soluciones
- **Dependencias:** TASK-MOTION-003
- **Paralelizable:** No
- **Requerimientos:** RMS-001, RMS-002, RMS-004, RMRSP-001
- **Archivos afectados:** `ecosistema-soluciones/index.html`, `ecosistema-soluciones/ecosistema.css`, `ecosistema-soluciones/ecosistema.js`, `assets/motion-pages.css`, `assets/motion-pages.js`
- **Objetivo:** revelar hero, núcleo, ramas, categorías y tarjetas con continuidad sin romper filtros.

### Pasos

- [x] Conectar la ruta al sistema aislado.
- [x] Secuenciar núcleo, órbitas, mapa, ramas y categorías.
- [x] Centralizar animación de tarjetas tras filtro/hash.
- [x] Mantener etiquetas conceptuales e imágenes honestas.
- [x] Mantener CTA/contexto/estados de cotización.
- [x] Resolver responsive, touch y reduced motion.

### Validación

- [x] Cuatro categorías, orden y filtrado conservados.
- [x] Hash, click, back y forward correctos.
- [x] Etiquetas conceptuales y estados de imagen visibles.
- [x] Teclado/touch/reduced motion correctos.
- [x] Métricas y scroll estables.
- [x] Sin errores de consola.

### Criterio de finalización

El ecosistema comunica núcleo y conexiones con filtros funcionales y honestidad conceptual intacta.

## TASK-MOTION-008 — Integrar expansión y retorno del detalle

- **Estado:** Completada
- **Prioridad:** Must
- **Página:** Soluciones
- **Dependencias:** TASK-MOTION-007
- **Paralelizable:** No
- **Requerimientos:** RMS-003, RMS-004, RMA-001, RMPERF-002
- **Archivos afectados:** `ecosistema-soluciones/ecosistema.js`, `ecosistema-soluciones/ecosistema.css`
- **Objetivo:** abrir/cerrar detalle desde su tarjeta, conservar un panel por categoría y restaurar foco.

### Pasos

- [x] Ajustar apertura con origen visual y animación única.
- [x] Ajustar cierre y Escape con retorno visual/foco.
- [x] Mantener aplicaciones, WhatsApp y contexto íntegros.
- [x] Evitar duplicidad de animaciones y eventos.
- [x] Mantener no-JS y reduced motion.

### Validación

- [x] Un detalle abierto por categoría.
- [x] Focus restoration y Escape correctos.
- [x] Contexto categoría/nicho/aplicación/origen conservado.
- [x] Responsive, touch y reduced motion correctos.
- [x] Sin crecimiento de listeners/animaciones.
- [x] Sin errores de consola.

### Criterio de finalización

Detalle y cierre son espacialmente continuos y mantienen contratos funcionales/a11y.

## G. Calidad global

## TASK-MOTION-009 — Crear y ejecutar pruebas automatizadas

- **Estado:** Completada
- **Prioridad:** Must
- **Página:** Global
- **Dependencias:** TASK-MOTION-004, TASK-MOTION-005, TASK-MOTION-006, TASK-MOTION-008
- **Paralelizable:** No
- **Requerimientos:** Todos
- **Archivos afectados:** `tests/`, `package.json`
- **Objetivo:** cubrir contratos de markup, aislamiento, fallbacks, ciclo de vida y comportamiento existente.

### Pasos

- [x] Probar carga del asset sólo en cuatro rutas y aislamiento por atributo.
- [x] Probar contenido visible sin JS y ausencia de estilos ocultos persistentes.
- [x] Probar tokens, reduced motion y propiedades permitidas.
- [x] Probar inicialización única, cleanup y diagnóstico.
- [x] Probar hash, historial, detalle, foco, etiquetas y cotización de Soluciones.
- [x] Ejecutar sintaxis JS y suite completa.

### Validación

- [x] Validación funcional automatizada.
- [x] Validación estructural/visual automatizada.
- [x] Validación responsive por reglas.
- [x] Validación de accesibilidad por contratos.
- [x] Validación de rendimiento por presupuesto/propiedades.
- [x] Suite sin fallos ni errores de consola simulados.

### Criterio de finalización

Todas las pruebas nuevas y existentes pasan y cubren cada comportamiento añadido.

## TASK-MOTION-010 — Validar navegador, evidencia y regresiones

- **Estado:** Completada
- **Prioridad:** Must
- **Página:** Global
- **Dependencias:** TASK-MOTION-009
- **Paralelizable:** No
- **Requerimientos:** Todos
- **Archivos afectados:** `audits/2026-07-20/motion-refresh/`, `specs/motion-refresh/tasks.md`, `changes.md`
- **Objetivo:** demostrar Definition of Done local con Chrome DevTools y documentación exacta.

### Pasos

- [x] Validar desktop, laptop, tablet, mobile, small, touch, landscape y zoom 200 %.
- [x] Validar no-JS, reduced motion, teclado, lector semántico, scroll y resize.
- [x] Validar enlaces, CTA, hash, historial, detalles, foco y navegación entre páginas.
- [x] Revisar overflow, layout, texto, imágenes, simultaneidad y diferenciación.
- [x] Medir LCP, CLS, INP/interacción, consola, long tasks, triggers, listeners, peso y memoria cuando sea posible.
- [x] Ejecutar Lighthouse de accesibilidad, SEO y buenas prácticas.
- [x] Guardar capturas after desktop/mobile y estados hover/focus/reduced/detail.
- [x] Comprobar regresiones en home y actualizar documentación final.

### Validación

- [x] Todas las rutas cumplen funcionalmente.
- [x] Evidencia visual completa y revisada.
- [x] Todos los contextos responsive pasan.
- [x] Accesibilidad y reduced motion pasan.
- [x] Métricas no muestran regresión significativa.
- [x] Consola sin errores relevantes.

### Criterio de finalización

Existe evidencia antes/después, auditorías, métricas y estado documental coherente; no quedan tareas locales ejecutables.
