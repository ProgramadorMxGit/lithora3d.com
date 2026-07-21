# Requerimientos — Motion refresh de páginas comerciales

## 1. Introducción

- **Iniciativa:** Precisión en movimiento para Lithora 3D.
- **Propósito:** mejorar jerarquía, continuidad, feedback y ritmo visual sin alterar la oferta comercial.
- **Problema actual:** Precios, Prototipado y Materiales no tienen movimiento; Soluciones sólo anima cambios puntuales y no comunica visualmente su ecosistema.
- **Páginas incluidas:** `/precios-impresion-3d/`, `/prototipado-rapido/`, `/materiales-impresion-3d/` y `/ecosistema-soluciones/`.
- **Páginas excluidas:** home y cualquier otra ruta, salvo comprobación de regresiones por archivos compartidos.
- **Alcance:** composición, jerarquía, decoraciones no informativas, revelados, transiciones, microinteracciones, responsive, accesibilidad y rendimiento.
- **Restricción:** no agregar ni modificar información comercial, secciones, productos, servicios, precios, formularios, claims, enlaces o CTA.
- **Resultado esperado:** cuatro experiencias relacionadas por un sistema común, pero con identidades de movimiento diferenciadas y contenido íntegro con o sin JavaScript.

## 2. Objetivos de experiencia

1. Reducir la percepción estática mediante progresión visual discreta.
2. Guiar el desplazamiento sin controlar ni ralentizar el scroll.
3. Hacer perceptibles relaciones ya presentes entre bloques, listas, tarjetas y detalles.
4. Mejorar la jerarquía sin cambiar contenido ni orden semántico.
5. Dar feedback inmediato a enlaces, botones, tarjetas y controles existentes.
6. Diferenciar Precios, Prototipado, Materiales y Soluciones conservando una voz común.
7. Mantener lectura, interacción y navegación completas en touch, teclado, reduced motion y sin JavaScript.

## 3. Principios obligatorios de movimiento

- Movimiento con propósito y continuidad espacial.
- Contenido visible antes que animación; la mejora es progresiva.
- Jerarquía por ritmo, no por espectáculo.
- Feedback inmediato, reversible y equivalente entre hover y focus.
- Rendimiento primero; no bloquear LCP ni provocar CLS.
- No depender del hover ni ocultar información esencial.
- Respetar `prefers-reduced-motion` sin perder feedback de estado.
- No usar movimiento constante, scroll hijacking, pinning largo ni animaciones numéricas engañosas.

## 4. Requerimientos globales

### RMG-001 — Sistema común de movimiento

- **Prioridad:** Must
- **Enunciado:** El sistema debe definir duraciones, distancias, staggers y easings comunes, aislados a las cuatro rutas.
- **Justificación:** evita inconsistencias y regresiones en páginas fuera del alcance.
- **Aceptación:** **Given** cualquiera de las cuatro páginas, **When** se inspeccionan sus estilos, **Then** usa los mismos tokens base y ninguna regla de motion afecta a la home.

### RMG-002 — Revelado jerárquico y seguro

- **Prioridad:** Must
- **Enunciado:** El sistema debe revelar encabezados, texto, listas, tarjetas, iconos, divisores y CTA según jerarquía, sin ocultarlos en el estado base.
- **Justificación:** el contenido debe sobrevivir a fallos de JavaScript.
- **Aceptación:** **Given** JavaScript deshabilitado o un error de inicialización, **When** carga la página, **Then** todo el contenido permanece visible y usable; **Given** JavaScript disponible, **When** un grupo entra al viewport, **Then** se anima una sola vez con una variante apropiada.

### RMG-003 — Feedback interactivo

- **Prioridad:** Must
- **Enunciado:** El sistema debe proporcionar feedback perceptible a botones, enlaces, navegación, breadcrumbs, tarjetas, imágenes, iconos y detalles existentes.
- **Justificación:** toda acción debe responder sin depender sólo del color.
- **Aceptación:** **Given** mouse, teclado o touch, **When** un control recibe hover, focus o active, **Then** responde en menos de 280 ms sin desplazar layout y focus es igual o más visible que hover.

### RMG-004 — Acceso universal al movimiento

- **Prioridad:** Must
- **Enunciado:** El sistema debe soportar teclado, touch, lectores de pantalla y `prefers-reduced-motion`.
- **Justificación:** el movimiento no puede excluir ni incomodar.
- **Aceptación:** **Given** navegación por teclado, touch o reduced motion, **When** se usa cualquier interacción, **Then** el contenido y feedback permanecen completos, sin movimiento amplio, hover obligatorio ni pérdida de foco.

### RMG-005 — Fallback de dependencias

- **Prioridad:** Must
- **Enunciado:** El sistema debe funcionar sin GSAP y conservar el contenido si el JavaScript propio no carga.
- **Justificación:** ninguna librería debe ser requisito para leer o convertir.
- **Aceptación:** **Given** GSAP ausente o JavaScript bloqueado, **When** carga una ruta, **Then** no hay elementos permanentemente ocultos, errores críticos ni CTA inutilizables.

### RMG-006 — Scroll nativo

- **Prioridad:** Must
- **Enunciado:** El sistema debe conservar scroll nativo, sin hijacking, scrub agresivo o esperas impuestas.
- **Justificación:** protege control, accesibilidad e INP.
- **Aceptación:** **Given** scroll lento, rápido o inverso, **When** el visitante recorre la página, **Then** puede detenerse y navegar libremente y ningún contenido crítico depende de la velocidad.

### RMG-007 — Ciclo de vida controlado

- **Prioridad:** Must
- **Enunciado:** El sistema debe evitar inicializaciones y listeners duplicados, detener trabajo fuera de contexto y limpiar observers, listeners y animaciones al abandonar la página.
- **Justificación:** previene degradación tras resize, orientación y navegación.
- **Aceptación:** **Given** múltiples resize, cambios de orientación o visibilidad, **When** se inspecciona el estado de depuración, **Then** existe una sola inicialización y no crece el conteo de listeners u observers.

### RMG-008 — Identidad preservada

- **Prioridad:** Must
- **Enunciado:** El sistema debe usar la identidad, contenido, componentes, enlaces y CTA existentes.
- **Justificación:** la intervención es visual y de interacción, no comercial.
- **Aceptación:** **Given** comparación de DOM y textos antes/después, **When** se auditan las cuatro rutas, **Then** no aparecen nuevos textos comerciales, rutas, formularios ni CTA.

## 5. Requerimientos para Precios

### RMP-001 — Precisión y lectura

- **Prioridad:** Must
- **Enunciado:** El sistema debe presentar hero, factores, escenarios, información y CTA en una progresión precisa, manteniendo todos los datos legibles desde el inicio.
- **Justificación:** el movimiento debe facilitar decisión y comparación.
- **Aceptación:** **Given** la página de Precios, **When** se recorre, **Then** encabezados preceden a sus grupos, las tarjetas aparecen de izquierda a derecha y ninguna cifra o afirmación se anima como valor cambiante.

### RMP-002 — Comparación por grupos

- **Prioridad:** Must
- **Enunciado:** El sistema debe relacionar tarjetas, listas, etiquetas y bordes existentes por grupos lógicos.
- **Justificación:** la página no contiene una tabla de precios; su comparación real ocurre entre factores y escenarios.
- **Aceptación:** **Given** un grupo de tarjetas o listas, **When** entra al viewport, **Then** sus miembros usan stagger breve y los bordes/divisores refuerzan la agrupación sin alterar contenido.

### RMP-003 — CTA inequívoco

- **Prioridad:** Must
- **Enunciado:** El sistema debe destacar los CTA existentes con feedback sobrio sin sugerir precio variable ni acción diferente.
- **Justificación:** la salida comercial debe ser clara y honesta.
- **Aceptación:** **Given** un CTA, **When** recibe focus, hover o active, **Then** responde de inmediato, conserva destino y no desplaza elementos vecinos.

## 6. Requerimientos para Prototipado

### RMR-001 — Progresión existente

- **Prioridad:** Must
- **Enunciado:** El sistema debe comunicar evolución conectando únicamente los beneficios y validaciones ya descritos.
- **Justificación:** la continuidad visual no debe inventar un proceso.
- **Aceptación:** **Given** las tarjetas existentes, **When** se recorren, **Then** se revelan secuencialmente y los conectores son decorativos, no se anuncian como nuevas etapas.

### RMR-002 — Iteración contenida

- **Prioridad:** Must
- **Enunciado:** El sistema debe diferenciar el bloque de beneficios del bloque de validación mediante ritmo y dirección, no mediante simulaciones técnicas.
- **Justificación:** comunica cambio de foco sin engranajes, escaneo o procesos falsos.
- **Aceptación:** **Given** ambos bloques, **When** entran al viewport, **Then** beneficios avanzan como secuencia y validaciones se consolidan como conjunto, sin movimiento permanente.

### RMR-003 — Continuidad hasta CTA

- **Prioridad:** Should
- **Enunciado:** El sistema debe conducir visualmente desde el hero hasta el CTA final conservando el scroll libre.
- **Justificación:** refuerza el recorrido problema–validación ya escrito.
- **Aceptación:** **Given** scroll rápido o lento, **When** se alcanza el cierre, **Then** el CTA aparece sin espera y la secuencia previa no bloquea su lectura.

## 7. Requerimientos para Materiales

### RMM-001 — Selección y comparación

- **Prioridad:** Must
- **Enunciado:** El sistema debe diferenciar las fichas de materiales existentes y facilitar su comparación sin agregar ni transformar propiedades.
- **Justificación:** el usuario debe distinguir opciones sin recibir datos inventados.
- **Aceptación:** **Given** las seis fichas, **When** aparecen o reciben foco, **Then** usan profundidad y borde moderados, conservan texto y color reales y no simulan resistencia, temperatura o flexibilidad.

### RMM-002 — Tactilidad honesta

- **Prioridad:** Must
- **Enunciado:** El sistema debe aportar tactilidad mediante microelevación, luz y continuidad, no mediante deformación.
- **Justificación:** una respuesta física sutil mejora exploración sin falsear atributos.
- **Aceptación:** **Given** mouse, teclado o touch, **When** una ficha se activa, **Then** su escala queda entre 0.98 y 1.03, el desplazamiento no supera 4 px y no cambia datos ni contenido.

### RMM-003 — Criterios y CTA

- **Prioridad:** Should
- **Enunciado:** El sistema debe agrupar los tres criterios existentes y llevar la atención al CTA final sin animar valores inexistentes.
- **Justificación:** sostiene el paso de exploración a consulta.
- **Aceptación:** **Given** criterios y cierre, **When** entran al viewport, **Then** aparecen por grupo y el CTA conserva su destino y legibilidad inmediata.

## 8. Requerimientos para Soluciones

### RMS-001 — Ecosistema conectado

- **Prioridad:** Must
- **Enunciado:** El sistema debe presentar primero el núcleo, después conexiones y finalmente categorías existentes.
- **Justificación:** hace comprensible el mapa sin añadir información.
- **Aceptación:** **Given** hero y mapa, **When** cargan o entran al viewport, **Then** el núcleo antecede a líneas y nodos, y todo queda estático tras la breve secuencia.

### RMS-002 — Cambio continuo de categoría

- **Prioridad:** Must
- **Enunciado:** El sistema debe animar filtrado, hash y tarjetas de nicho sin romper historial, scroll ni contenido.
- **Justificación:** el cambio debe sentirse conectado a su control de origen.
- **Aceptación:** **Given** una categoría o hash válido, **When** se selecciona o se navega atrás/adelante, **Then** se actualiza el grupo correcto con stagger breve, una sola vez por cambio y sin duplicar eventos.

### RMS-003 — Detalle con origen y retorno

- **Prioridad:** Must
- **Enunciado:** El sistema debe abrir el detalle inline desde la tarjeta seleccionada y devolver foco y atención a esa tarjeta al cerrar.
- **Justificación:** conserva continuidad espacial y accesibilidad.
- **Aceptación:** **Given** una tarjeta, **When** abre y cierra su detalle, **Then** el panel aparece junto a su origen, sólo hay un detalle por categoría, el foco vuelve al control y historial/hash siguen correctos.

### RMS-004 — Honestidad conceptual y cotización

- **Prioridad:** Must
- **Enunciado:** El sistema debe mantener visibles “Ejemplo conceptual”, estados de imagen, contexto de cotización y CTA de WhatsApp durante todas las transiciones.
- **Justificación:** evita apariencia de marketplace o proyecto real.
- **Aceptación:** **Given** una tarjeta o detalle, **When** se anima, **Then** la etiqueta conceptual nunca se oculta, los errores de imagen permanecen entendibles y la cotización conserva categoría, nicho, aplicación y URL.

## 9. Requerimientos responsive

### RMRSP-001 — Cobertura de viewports

- **Prioridad:** Must
- **Enunciado:** El sistema debe funcionar en escritorio amplio, laptop, tableta, móvil, pantalla pequeña, horizontal y zoom 200 % sin desbordamiento horizontal.
- **Justificación:** la composición debe adaptarse sin pérdida.
- **Aceptación:** **Given** 1440, 1280, 768, 390, 320 px, landscape y 200 % de zoom, **When** se recorre cada ruta, **Then** no hay texto cortado, superposición ni overflow horizontal.

### RMRSP-002 — Simplificación adaptativa

- **Prioridad:** Must
- **Enunciado:** El sistema debe reducir distancias y stagger, retirar conectores decorativos complejos y evitar efectos costosos en móvil/touch.
- **Justificación:** protege fluidez y claridad.
- **Aceptación:** **Given** viewport menor a 768 px o puntero coarse, **When** inicializa el motion, **Then** usa recorridos menores, no depende de hover y mantiene contenido inmediato.

### RMRSP-003 — Reconfiguración estable

- **Prioridad:** Must
- **Enunciado:** El sistema debe tolerar resize y cambio de orientación sin reinicialización duplicada ni pérdida de estado.
- **Justificación:** los dispositivos cambian de contexto durante uso.
- **Aceptación:** **Given** una página ya animada, **When** cambia tamaño u orientación, **Then** conserva contenido, interacción y una sola instancia del sistema.

## 10. Requerimientos de accesibilidad

### RMA-001 — Teclado, foco y semántica

- **Prioridad:** Must
- **Enunciado:** El sistema debe preservar orden semántico, navegación por teclado y foco visible; en Soluciones debe restaurar foco al origen.
- **Justificación:** la coreografía visual no puede alterar lectura ni operación.
- **Aceptación:** **Given** uso exclusivo de teclado o lector de pantalla, **When** se navega y activa controles, **Then** el orden es lógico, el foco es visible y los estados expandido/cerrado se anuncian con atributos existentes.

### RMA-002 — Movimiento seguro

- **Prioridad:** Must
- **Enunciado:** El sistema debe evitar destellos, parallax, movimiento constante y desplazamientos amplios, y ofrecer reduced motion completo.
- **Justificación:** reduce riesgo vestibular y distracción.
- **Aceptación:** **Given** `prefers-reduced-motion: reduce`, **When** carga cualquier ruta, **Then** no hay traslación, escala, conectores dibujados ni secuencias prolongadas; sólo feedback breve de color, borde u opacidad.

### RMA-003 — Feedback multimodal y touch

- **Prioridad:** Must
- **Enunciado:** El sistema debe expresar estados con más de una señal y conservar áreas táctiles apropiadas.
- **Justificación:** color y hover por sí solos no son universales.
- **Aceptación:** **Given** contraste alto, touch o deficiencia de percepción cromática, **When** interactúa con un control, **Then** borde, foco, posición o icono complementan el color y el objetivo táctil conserva al menos 44 px cuando ya es control principal.

## 11. Requerimientos de rendimiento

### RMPERF-001 — Propiedades eficientes

- **Prioridad:** Must
- **Enunciado:** El sistema debe animar principalmente `transform` y `opacity`, limitar `clip-path` y evitar `width`, `height`, `top`, `left`, blur y reflow animado.
- **Justificación:** mantiene el compositor y el scroll fluidos.
- **Aceptación:** **Given** inspección de CSS y JS, **When** se revisan keyframes/transiciones, **Then** no existen animaciones de layout ni filtros continuos.

### RMPERF-002 — Trabajo acotado al viewport

- **Prioridad:** Must
- **Enunciado:** El sistema debe agrupar observación, ejecutar revelados una sola vez y evitar timelines o triggers innecesarios fuera del viewport.
- **Justificación:** limita CPU, memoria y batería.
- **Aceptación:** **Given** una página completa, **When** se desplaza hasta el final y vuelve, **Then** no se crean observers/listeners adicionales y no hay animaciones constantes.

### RMPERF-003 — Web Vitals protegidos

- **Prioridad:** Must
- **Enunciado:** El sistema debe mantener LCP, CLS e INP estables y no añadir librerías externas.
- **Justificación:** el acabado visual no justifica degradación medible.
- **Aceptación:** **Given** auditoría antes/después local equivalente, **When** se comparan resultados, **Then** CLS permanece 0 o sin regresión, no aparece long task atribuible al motion, INP/interacción sigue responsivo y LCP no empeora significativamente.

### RMPERF-004 — Estado observable y limpieza

- **Prioridad:** Should
- **Enunciado:** El sistema debe exponer un estado local de diagnóstico sin datos personales para validar inicialización, reduced motion, observers, listeners y animaciones activas.
- **Justificación:** facilita comprobar duplicados y ciclo de vida.
- **Aceptación:** **Given** DevTools, **When** se consulta el estado de diagnóstico, **Then** informa una sola instancia, conteos estables y cero ScrollTriggers añadidos.

## 12. Fuera del alcance

- Agregar contenido comercial, servicios, materiales, precios, paquetes, promociones o capacidades.
- Crear páginas, configuradores, formularios, rutas o nuevos flujos comerciales.
- Cambiar servicios, precios, CTA, enlaces, analítica o destinos.
- Video autoplay, sonido, cursores personalizados o animaciones permanentes.
- Scroll hijacking, pinning largo, WebGL pesado o efectos 3D que dificulten lectura.
- Rediseñar la home u otras rutas.

## 13. Criterios de aceptación globales

La iniciativa queda aprobada cuando: las cuatro rutas reales están intervenidas; no cambia el contenido comercial; cada ruta tiene identidad propia; comparten tokens; el contenido funciona sin JavaScript y con reduced motion; teclado, touch, hash, historial, detalles, foco y CTA siguen operativos; no hay overflow ni errores relevantes; LCP/CLS/INP no muestran regresión significativa; existen pruebas, capturas y métricas antes/después; y `tasks.md`/`changes.md` reflejan evidencia real.
