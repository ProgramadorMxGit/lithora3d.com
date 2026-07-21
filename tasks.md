# Tasks: Ecosistema de soluciones por nicho para Lithora 3D

> Plan de implementacion derivado de requirements.md y design.md. El estado inicial se conserva dentro de cada tarea para trazabilidad; las casillas y el apartado 32 reflejan el estado ejecutado actual.

## 1. Resumen de implementacion

### Objetivo tecnico

Agregar una ruta publica e indexable al sitio estatico de Lithora 3D para explorar soluciones por nicho, con contenido estructurado, cuatro categorias, tarjetas, expansion inline, CTA de cotizacion contextual y estados accesibles.

### Resultado final esperado

Un visitante puede entrar desde la home o una landing relacionada, comprender que Lithora ofrece soluciones personalizadas, seleccionar una categoria, abrir un nicho, revisar aplicaciones y comenzar una cotizacion conservando categoria, nicho y aplicacion cuando exista.

### Alcance del MVP

- Ruta publica con Negocios, Industria, Eventos y Diseno y prototipos.
- Nichos publicados con contenido obligatorio, imagen real validada o concepto etiquetado, y fallback sin imagen.
- Hub editorial de cuatro ramas y navegacion por categoria.
- Tarjetas y detalle inline.
- Mensaje visible de que no se necesita archivo 3D.
- CTA de cotizacion desacoplado del canal final.
- Responsive, accesibilidad, SEO, analitica, validacion editorial y estados de error.
- Sin ecommerce, pagos, carrito, precios automaticos, configurador 3D, IA, cuentas o paginas individuales para todos los nichos.

### Documentos de origen

- requirements.md, aprobado, fuente de requerimientos.
- design.md, aprobado, fuente de decisiones de experiencia, visuales, estados y trazabilidad.
- changes.md, historial obligatorio del proyecto.

### Principales restricciones

- El repositorio actual es estatico y no tiene framework, CMS, API, paquete o runner de pruebas comprobado.
- No se agregaran dependencias sin una necesidad comprobada.
- No se publicaran conceptos como proyectos reales.
- No se publicaran nichos, capacidades, precios, tiempos o materiales no validados por Lithora.
- Las tareas deben reutilizar la cabecera, footer, tokens, estilos, GSAP y patrones de SEO existentes cuando corresponda.

### Decisiones resueltas

- Canal principal: WhatsApp oficial `https://wa.me/528331080178`, con campos y contexto definidos.
- Nueve nichos publicados y ordenados desde una fuente estatica validada.
- Referencias visuales del usuario publicadas unicamente como `Ejemplo conceptual`; OpenArt preservado pero no publicado en tarjetas.
- Ruta final `/ecosistema-soluciones/` y administracion mediante `content.js` con validacion/generacion reproducible.
- Adaptador analitico independiente validado con `CustomEvent`, `dataLayer`, no-op seguro y deduplicacion; solo la cuenta de proveedor queda externa.
- Estrategia local con Node Test Runner, auditorias estaticas y Chrome DevTools.

## 2. Hallazgos del proyecto actual

### Confirmado

| Area | Hallazgo y evidencia |
|---|---|
| Stack | HTML estatico con lang es; Tailwind 3.4 materializado en cinco hojas locales; CSS compartido en assets/styles.css; JavaScript propio en assets/animations.js, assets/motion-pages.js y scripts de cada ruta. |
| Rutas | La raiz usa index.html. Existen servicio-impresion-3d/index.html, precios-impresion-3d/index.html, prototipado-rapido/index.html y materiales-impresion-3d/index.html. |
| Componentes | No existe framework ni biblioteca de componentes. La reutilizacion actual es markup HTML, clases Tailwind, estilos CSS y patrones de header/footer. |
| Sistema visual | Tokens en assets/styles.css: azul marino #0F172A, azul #0369A1, fondo #F8FAFC, escala de espaciado y familia Inter. |
| Animaciones | GSAP 3.12.5 y ScrollTrigger por CDN; assets/animations.js usa matchMedia, ScrollTrigger, reveals, hover, header dock y reduced motion. |
| Contenido | El contenido de las landings esta escrito dentro de cada HTML. No se comprobo CMS, JSON de contenido, API o base de datos. |
| Cotizacion | index.html contiene cotizar-form. El action observado es la propia home con GET; el submit se previene y solo existe validacion cliente. El archivo contiene FORM_ENDPOINT y TODO para endpoint real. |
| Analitica | Adaptador propio con nueve eventos, `CustomEvent`, `dataLayer`, deduplicacion, payload minimo sin PII y no-op seguro; cuenta productiva de proveedor aun no conectada. |
| SEO | index.html ya contiene title, description, robots, canonical, Open Graph, Twitter Cards y JSON-LD. robots.txt referencia sitemap.xml. |
| Calidad | `package.json` expone render/check/test/validate; 81 pruebas pasan y la evidencia Chrome/Lighthouse se conserva bajo `audits/2026-07-20/`. |
| Consola | Las cinco rutas que usaban Tailwind cargan CSS local; Chrome DevTools no reporta errores ni advertencias relevantes en local o produccion. |

### Confirmaciones posteriores a la implementacion

- La ruta usa el patron `directorio/index.html` y el slug canonico `/ecosistema-soluciones/`.
- `content.js` permite agregar, editar, publicar, ocultar, ordenar y categorizar nichos; el generador excluye entradas invalidas.
- La instrumentacion local y productiva emite el contrato propio; queda pendiente solamente vincular una cuenta analitica aprobada y sus reglas de consentimiento.
- WhatsApp conserva contexto en texto; cualquier archivo se adjunta manualmente dentro de la conversacion.
- Todos los visuales publicados son demostrativos y mantienen la etiqueta conceptual.

## 3. Estrategia de implementacion

El orden sera: decisiones bloqueantes, contrato de contenido, activos, ruta y estructura, navegacion y mapa, nichos y detalle, cotizacion, movimiento, responsive, accesibilidad, SEO/analitica, rendimiento, pruebas, aprobacion editorial y publicacion.

Las tareas de decisiones y contenido bloquean las tareas que consumen sus datos. La preparacion de OpenArt, la definicion del contrato y la auditoria de calidad pueden avanzar en paralelo mientras no requieran una decision abierta. La implementacion se separa por responsabilidades: datos/validacion, ruta/semantica, exploracion, conversion y calidad. No se creara un HTML monolitico con toda la logica sin aislar los contratos de contenido y los estados.

~~~mermaid
flowchart TD
  A[TASK-001 convenciones] --> B[TASK-009 contrato de contenido]
  C[TASK-002 canal de cotizacion] --> D[TASK-038 adapter contextual]
  C --> E[TASK-039 estados de cotizacion]
  F[TASK-004 nichos aprobados] --> G[TASK-010 demo y validacion]
  H[TASK-005 ruta y administracion] --> I[TASK-020 ruta base]
  J[TASK-007 analitica] --> K[TASK-054 eventos exploracion]
  J --> L[TASK-055 eventos cotizacion]
  B --> M[TASK-012 modelo de categorias/nichos]
  M --> N[TASK-030 NicheGrid]
  M --> O[TASK-032 NicheCard]
  N --> P[TASK-035 NicheDetail]
  O --> P
  I --> Q[TASK-023 Hero]
  I --> R[TASK-025 EcosystemMap]
  R --> S[TASK-029 CategoryNavigation]
  S --> N
  P --> D
  Q --> T[TASK-041 movimiento]
  R --> T
  N --> U[TASK-044 responsive]
  P --> U
  D --> V[TASK-060 integracion]
  U --> V
  V --> W[TASK-065 calidad/publicacion]
~~~

## 4. Decisiones bloqueantes iniciales

## TASK-001 — Confirmar flujo de trabajo y convenciones del repositorio

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** Fundamentos
- **Dependencias:** Ninguna
- **Paralelizable:** No
- **Requerimientos:** RF-013, RAD-001, RAD-002, RAD-003, RAD-004, RAD-005, RAD-006, RAD-007, RAD-008, RAD-009, RAD-010
- **Decisiones de diseño:** Design 24, propuestas reversibles; Design 17, componentes conceptuales.
- **Archivos o areas afectadas:** .git, changes.md, estructura actual del repositorio.
- **Objetivo:** Registrar la convencion de rama, revision y cambios que seguira la implementacion sin asumir una herramienta de ramas adicional.

### Pasos

- [x] Revisar el estado de Git y confirmar la rama de trabajo antes de implementar.
- [x] Confirmar que changes.md seguira registrando cada modificacion inmediatamente despues de hacerla.
- [x] Confirmar que no existe un proceso adicional de build, lint o pruebas oculto fuera de los archivos inspeccionados.
- [x] Documentar en el registro de cambios cualquier convencion nueva aprobada.

### Validacion

- [x] La rama o flujo de trabajo queda identificado.
- [x] Las convenciones no contradicen el repositorio actual.
- [x] No se crea una dependencia o herramienta nueva.

### Criterio de finalizacion

Existe una instruccion de trabajo reproducible para la implementacion y el responsable sabe donde registrar cambios y verificaciones.

## TASK-002 — Resolver el canal final de cotizacion

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** Fundamentos
- **Dependencias:** Ninguna
- **Paralelizable:** No
- **Requerimientos:** RF-010, RF-011, RN-004, RN-005
- **Decisiones de diseño:** Design 12, flujo desacoplado de formulario, WhatsApp u otro canal; Design 19, canal no configurado.
- **Archivos o areas afectadas:** Canal comercial externo o formulario actual en index.html; por confirmar.
- **Objetivo:** Obtener una decision humana y un destino operativo para las solicitudes originadas en un nicho.

### Pasos

- [x] Confirmar si la solicitud se enviara por el formulario existente, WhatsApp u otro canal aprobado.
- [x] Confirmar el destino, formato de apertura y mecanismo para transportar el contexto.
- [x] Confirmar el comportamiento cuando el canal no este disponible.
- [x] Registrar la decision y sus restricciones en el proyecto antes de implementar QuoteCTA.

### Validacion

- [x] Existe un canal identificado y accesible para pruebas.
- [x] El canal acepta la categoria y el nicho de origen o define como los recibira.
- [x] Existe una respuesta aprobada para canal no configurado.

### Criterio de finalizacion

El equipo puede implementar el CTA sin inventar una integracion ni dejar un falso envio.

## TASK-003 — Definir campos de cotizacion, adjuntos y privacidad

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** Fundamentos
- **Dependencias:** TASK-002
- **Paralelizable:** No
- **Requerimientos:** RF-006, RF-011, RM-006, RM-007, RM-008, RM-009, RN-004, RN-006
- **Decisiones de diseño:** Design 12, contexto conservado y mensaje sugerido; Design 19, estados de envio.
- **Archivos o areas afectadas:** Formulario o canal confirmado en TASK-002; por confirmar.
- **Objetivo:** Definir datos obligatorios, opcionales, adjuntos permitidos y tratamiento de datos antes de crear el flujo de cotizacion.

### Pasos

- [x] Definir los campos obligatorios para solicitar orientacion con y sin archivo 3D.
- [x] Definir si se permite adjuntar archivo, imagen o referencia y sus limites.
- [x] Definir la informacion de privacidad y retencion que el canal exige.
- [x] Definir que datos contextuales se muestran al visitante y cuales se transfieren de forma tecnica.

### Validacion

- [x] El cliente puede iniciar orientacion sin archivo 3D.
- [x] Los campos obligatorios y opcionales estan documentados.
- [x] El tratamiento de datos tiene aprobacion del responsable correspondiente.

### Criterio de finalizacion

El contrato de la solicitud esta definido y puede probarse sin recolectar datos personales innecesarios.

## TASK-004 — Aprobar nichos, cantidad y capacidad del MVP

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** Fundamentos
- **Dependencias:** Ninguna
- **Paralelizable:** No
- **Requerimientos:** RF-002, RF-003, RF-013, RC-001, RC-002, RN-007
- **Decisiones de diseño:** Design 7, categorias y galeria; Design 24, nichos no publicados sin validacion.
- **Archivos o areas afectadas:** Fuente de contenido por confirmar; requirements.md y design.md solo como referencia.
- **Objetivo:** Obtener la lista exacta de nichos iniciales, su categoria, cantidad y capacidad vigente de Lithora.

### Pasos

- [x] Revisar los nichos candidatos de las cuatro categorias sin asumir que todos estan aprobados.
- [x] Asignar cada nicho a una categoria y establecer su orden inicial.
- [x] Validar que Lithora puede atender cada nicho con sus capacidades vigentes. ✅ Resuelto por decisiones comerciales explícitas del 2026-07-20: nueve nichos aprobados y publicados; Papelerías, Joyerías y Farmacias fueron retirados, y Escuelas sustituyó a Farmacias por decisión posterior del usuario.
- [x] Registrar los nichos excluidos y la razon de exclusion para evitar publicacion accidental.

### Validacion

- [x] Hay una lista aprobada con cantidad y categoria de cada nicho. ✅ Diez nichos distribuidos en las cuatro categorias y ordenados en `content.js`.
- [x] Cada nicho tiene un responsable de validacion comercial o tecnica. ✅ La decision aprobada por el usuario queda registrada como `approved-2026-07-20-user-decision`.
- [x] No se inventan capacidades, tiempos, materiales o precios.

### Criterio de finalizacion

Existe un inventario inicial aprobado que puede alimentar el modelo de contenido sin placeholders de negocio.

## TASK-005 — Aprobar proyectos reales y conceptos visuales candidatos

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** Contenido
- **Dependencias:** TASK-004
- **Paralelizable:** No
- **Requerimientos:** RF-008, RC-008, RC-009, RC-010, RN-002, RN-003
- **Decisiones de diseño:** Design 10, badge de procedencia; Design 16, cuatro candidatos OpenArt conceptuales.
- **Archivos o areas afectadas:** Recursos OpenArt, assets por confirmar y repositorio de originales/entrega por confirmar.
- **Objetivo:** Determinar que nichos usaran proyecto real validado y cuales usaran imagen conceptual aprobada.

### Pasos

- [x] Inventariar fotografias, piezas y evidencias reales disponibles por nicho.
- [x] Validar internamente cada recurso que pueda marcarse como proyecto real.
- [x] Revisar los cuatro candidatos OpenArt registrados en design.md como conceptos, sin tratarlos como trabajos de Lithora.
- [x] Marcar recursos faltantes, descartados y pendientes de autorizacion.

### Validacion

- [x] Cada imagen candidata tiene procedencia y tipo documentados.
- [x] Ningun concepto se etiqueta como proyecto real.
- [x] Cada nicho aprobado tiene imagen validada o fallback planificado.

### Criterio de finalizacion

Existe una tabla de activos aprobados, candidatos y faltantes por nicho.

## TASK-006 — Confirmar ruta final y administracion del contenido

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** Fundamentos
- **Dependencias:** TASK-001
- **Paralelizable:** No
- **Requerimientos:** RF-013, RF-014, RF-015, RS-001, RS-010, RAD-001, RAD-002, RAD-003, RAD-004, RAD-005, RAD-006, RAD-007, RAD-008, RAD-009, RAD-010
- **Decisiones de diseño:** Design 9, fragmentos; Design 18, modelo conceptual; Design 24, fuente de contenido pendiente.
- **Archivos o areas afectadas:** Ruta nueva con patron <ruta>/index.html; index.html; fuente de contenido por confirmar.
- **Objetivo:** Confirmar el slug publico y el mecanismo real que permitira crear, editar, publicar, ocultar y ordenar contenido.

### Pasos

- [x] Seleccionar el slug definitivo compatible con las rutas existentes.
- [x] Confirmar si la fuente sera HTML estatico, archivos de contenido existentes u otro mecanismo ya disponible.
- [x] Confirmar como el responsable editara nichos y registrara fecha de actualizacion.
- [x] Confirmar si existe un feature flag; si no existe, documentar que la publicacion se controla por estado de contenido.

### Validacion

- [x] La ruta elegida no colisiona con una ruta existente.
- [x] La fuente de contenido esta comprobada en el repositorio o aprobada por el responsable.
- [x] Se conoce como realizar cada operacion RAD sin inventar un CMS.

### Criterio de finalizacion

La implementacion puede crear la ruta y el modelo de contenido contra una fuente concreta.

## TASK-007 — Confirmar herramienta de analitica y consentimiento

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** Fundamentos
- **Dependencias:** TASK-001
- **Paralelizable:** Sí
- **Requerimientos:** RF-017, RM-001, RM-002, RM-003, RM-004, RM-005, RM-006, RM-007, RM-008, RM-009
- **Decisiones de diseño:** Design 22, eventos y antiduplicacion; Design 17, AnalyticsBoundary.
- **Archivos o areas afectadas:** Scripts de analytics por confirmar; index.html y ruta nueva.
- **Objetivo:** Identificar el sistema de analitica que recibira los eventos y las reglas de consentimiento aplicables.

### Pasos

- [x] Confirmar si Cloudflare beacon es el unico sistema disponible o si existe otra herramienta aprobada.
- [x] Confirmar el mecanismo de eventos y el entorno de desarrollo disponible.
- [x] Definir consentimiento, minimizacion de datos y comportamiento cuando la herramienta no este disponible.
- [x] Documentar nombres de evento y payload minimo de design.md sin agregar datos personales.

### Validacion

- [x] Existe un destino de eventos verificable.
- [x] Los nueve eventos tienen payload y regla de duplicacion.
- [x] La ausencia de analitica no rompe la experiencia ni el flujo de cotizacion.

### Criterio de finalizacion

El equipo puede implementar y validar eventos sin inventar una API analitica.

## TASK-008 — Confirmar estrategia de pruebas y calidad disponible

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** Calidad
- **Dependencias:** TASK-001
- **Paralelizable:** Sí
- **Requerimientos:** RX-001, RR-001, RR-002, RR-003, RA-001, RA-005, RS-001
- **Decisiones de diseño:** Design 25, criterios de aprobacion; Design 20, presupuestos de rendimiento.
- **Archivos o areas afectadas:** Repositorio sin package.json, tests o runner comprobado; Chrome DevTools.
- **Objetivo:** Acordar como se ejecutaran pruebas unitarias, funcionales, visuales, SEO, accesibilidad y rendimiento en este proyecto estatico.

### Pasos

- [x] Confirmar si existe un runner o pipeline fuera del repositorio.
- [x] Definir la matriz de validacion manual reproducible con Chrome DevTools para los escenarios sin runner.
- [x] Definir donde se guardaran reportes y capturas si se autoriza conservarlos.
- [x] Establecer el umbral de errores de consola, Lighthouse y Core Web Vitals para aprobar.

### Validacion

- [x] Cada familia de prueba de la seccion 23 tiene un mecanismo definido.
- [x] Los comandos y herramientas son existentes o quedan como decision explicita, no inventada.
- [x] La estrategia contempla la ausencia de JavaScript y reduced motion.

### Criterio de finalizacion

Existe un protocolo de calidad ejecutable por otro agente sin asumir un runner inexistente.

## 5. Fundamentos y preparacion

## TASK-009 — Definir el contrato de contenido y los identificadores estables

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** Fundamentos
- **Dependencias:** TASK-004, TASK-006
- **Paralelizable:** Sí
- **Requerimientos:** RF-003, RF-004, RF-005, RF-013, RC-001, RC-002, RC-003, RC-004, RC-005, RC-006, RC-007, RC-008, RC-009, RC-010, RC-011, RC-012, RC-013, RS-010, RAD-001, RAD-002, RAD-006, RAD-007, RAD-009, RAD-010
- **Decisiones de diseño:** Design 18, modelo de Categoria, Nicho, Aplicacion, Imagen, Tipo, CTA y SEO.
- **Archivos o areas afectadas:** Fuente de contenido confirmada en TASK-006; contrato documental por confirmar.
- **Objetivo:** Formalizar campos, tipos, nombres estables y relaciones que consumirian los componentes conceptuales.

### Pasos

- [x] Definir identificador estable, slug, nombre, categoriaId y orden de cada nicho.
- [x] Definir las relaciones de aplicaciones, imagenes, servicios relacionados, CTA y metadatos SEO.
- [x] Definir estados de publicacion y fecha de actualizacion.
- [x] Definir como se representara una imagen real, conceptual, posible, prototipo o ausente.

### Validacion

- [x] Cada campo obligatorio de RC y RAD tiene una representacion.
- [x] Los identificadores no dependen del texto visible.
- [x] El contrato no introduce precio automatico, inventario o capacidades no aprobadas.

### Criterio de finalizacion

El contrato de contenido esta documentado y puede ser consumido sin reinterpretar design.md.

## TASK-010 — Preparar datos de demostracion y validacion editorial

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** Contenido
- **Dependencias:** TASK-004, TASK-005, TASK-009
- **Paralelizable:** Sí
- **Requerimientos:** RF-001, RF-002, RF-003, RF-004, RF-005, RF-006, RF-007, RC-003, RC-004, RC-005, RC-006, RC-014, RC-015, RC-016, RC-017, RC-018, RC-019, RN-001, RN-007, RN-008
- **Decisiones de diseño:** Design 3, principios editoriales; Design 10, anatomia de tarjeta; Design 18, demostracion no publicable.
- **Archivos o areas afectadas:** Fuente de contenido confirmada; copia de nichos por confirmar.
- **Objetivo:** Crear los registros de demostracion con contenido verificable y marcarlos como no publicables hasta aprobacion.

### Pasos

- [x] Redactar problema u oportunidad antes del proceso tecnico.
- [x] Redactar entre cuatro y siete aplicaciones concretas por nicho.
- [x] Redactar beneficio, servicios relacionados validados, CTA y aviso de personalizacion.
- [x] Ejecutar validacion de campos, lenguaje, promesas y estado antes de permitir publicacion.

### Validacion

- [x] Cada registro cumple RN-001 o devuelve los campos faltantes.
- [x] No hay clientes, resultados, precios, tiempos o casos inventados.
- [x] Las aplicaciones se presentan como ejemplos y puntos de partida.

### Criterio de finalizacion

Los datos de demostracion pasan la validacion estructural y editorial y permanecen identificados como demostracion.

## TASK-011 — Preparar degradacion progresiva y ausencia de JavaScript

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** Fundamentos
- **Dependencias:** TASK-006, TASK-009
- **Paralelizable:** Sí
- **Requerimientos:** RF-002, RF-003, RF-004, RF-009, RX-006, RS-005, RS-006, RS-007
- **Decisiones de diseño:** Design 9, contenido disponible sin JavaScript; Design 21, tarjetas y detalles rastreables.
- **Archivos o areas afectadas:** Ruta nueva; assets/styles.css; assets/animations.js; scripts de la ruta por confirmar.
- **Objetivo:** Asegurar que categorias, nichos, aplicaciones y CTAs sigan siendo accesibles si el comportamiento JavaScript falla o esta desactivado.

### Pasos

- [x] Definir el HTML semantico que contiene las categorias y nichos publicados.
- [x] Definir enlaces de ancla para categorias y acciones de regreso.
- [x] Mantener el contenido visible en el estado natural antes de aplicar animaciones.
- [x] Separar mejora progresiva de la fuente de contenido y del canal de cotizacion.

### Validacion

- [x] Con JavaScript desactivado se puede leer el contenido y navegar por anclas.
- [x] El contenido esencial no depende de hover.
- [x] La ausencia de GSAP no deja elementos ocultos.

### Criterio de finalizacion

La ruta tiene un estado HTML util sin JavaScript y las mejoras interactivas son incrementales.

## 6. Modelo y gestion de contenido

## TASK-012 — Representar categorias, nichos y aplicaciones

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** Contenido
- **Dependencias:** TASK-009, TASK-010
- **Paralelizable:** Sí
- **Requerimientos:** RF-002, RF-003, RF-004, RF-005, RF-013, RC-001, RC-002, RC-003, RC-004, RC-005, RC-006, RC-007, RC-012
- **Decisiones de diseño:** Design 7, estructura de pagina; Design 8 y 9, categorias; Design 18, modelo conceptual.
- **Archivos o areas afectadas:** Fuente de contenido confirmada; ruta nueva por confirmar.
- **Objetivo:** Crear los registros de las cuatro categorias y sus nichos con aplicaciones ordenadas y contenido publicable.

### Pasos

- [x] Crear las cuatro categorias con ids y anclas estables.
- [x] Asociar cada nicho aprobado con una sola categoria y un orden.
- [x] Asociar entre cuatro y siete aplicaciones a cada nicho.
- [x] Asociar problema, beneficio y servicios relacionados solo cuando esten validados.

### Validacion

- [x] Cada categoria requerida aparece exactamente una vez.
- [x] Los nichos se filtran por categoria y respetan orden.
- [x] Un nicho incompleto no se marca como publicable.

### Criterio de finalizacion

La fuente de contenido contiene la estructura de categorias, nichos y aplicaciones que la galeria puede consumir.

## TASK-013 — Representar imagenes, CTA, estados y metadatos de nicho

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** Contenido
- **Dependencias:** TASK-009, TASK-015, TASK-016
- **Paralelizable:** Sí
- **Requerimientos:** RF-008, RF-010, RF-016, RC-008, RC-009, RC-010, RC-011, RC-013, RN-002, RN-003, RN-004, RN-005, RN-007, RN-008
- **Decisiones de diseño:** Design 10, estados de tarjeta; Design 16, tipo y procedencia; Design 18, Imagen y CTA.
- **Archivos o areas afectadas:** Fuente de contenido confirmada; assets aprobados por confirmar.
- **Objetivo:** Asociar a cada nicho imagen o fallback, procedencia, alt, CTA, estado de publicacion, orden y fecha.

### Pasos

- [x] Crear el estado de imagen ausente o fallida sin inventar una imagen.
- [x] Marcar cada imagen como proyecto real o ejemplo conceptual y aplicar descriptores opcionales.
- [x] Asociar texto alternativo contextual y CTA disponible/no configurado.
- [x] Guardar estado, orden y fecha de actualizacion sin exponer campos administrativos al visitante.

### Validacion

- [x] No se puede publicar una imagen conceptual sin su etiqueta.
- [x] No se puede marcar como real sin validacion registrada.
- [x] El CTA no depende de que exista un precio.

### Criterio de finalizacion

Cada nicho aprobado tiene un registro completo de visual, accion, procedencia y publicacion.

## TASK-014 — Implementar validacion y operaciones de publicacion

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** Contenido
- **Dependencias:** TASK-006, TASK-009, TASK-012, TASK-013
- **Paralelizable:** Sí
- **Requerimientos:** RF-013, RF-014, RF-015, RC-012, RC-013, RN-001, RN-002, RN-003, RN-007, RN-008, RAD-001, RAD-002, RAD-003, RAD-004, RAD-005, RAD-006, RAD-007, RAD-008, RAD-009, RAD-010
- **Decisiones de diseño:** Design 18, modelo y fecha; Design 19, datos incompletos.
- **Archivos o areas afectadas:** Fuente de contenido confirmada en TASK-006; mecanismo de administracion por confirmar.
- **Objetivo:** Permitir crear, editar, publicar, ocultar y ordenar nichos mediante la fuente real aprobada.

### Pasos

- [x] Implementar la validacion que exige nombre, categoria, descripcion, problema, cuatro a siete aplicaciones, beneficio y CTA.
- [x] Implementar el estado publicado/oculto y excluir ocultos de la vista publica.
- [x] Implementar el orden dentro de cada categoria y actualizar fecha al editar.
- [x] Impedir publicar nichos no validados o imagenes reales sin aprobacion.

### Validacion

- [x] Los campos faltantes impiden publicar.
- [x] Ocultar y volver a publicar un nicho cambia la vista publica sin modificar otros.
- [x] Reordenar cambia el orden visible.
- [x] Se conserva la fecha de actualizacion.

### Criterio de finalizacion

El responsable puede administrar nichos con las operaciones RAD sin cambiar la estructura de la pagina.

## 7. Recursos visuales y OpenArt

## TASK-015 — Revisar los cuatro candidatos OpenArt generados

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** Contenido
- **Dependencias:** TASK-005
- **Paralelizable:** Sí
- **Requerimientos:** RF-008, RC-008, RC-009, RC-010, RN-002, RN-003
- **Decisiones de diseño:** Design 16, muestra por categoria y consistencia de campana.
- **Archivos o areas afectadas:** Recursos OpenArt con historyId tTEG6MIoL7G165hMot6f, jlo0Y6JQ27x4BjMmmNwY, J0LODuUCWrarZY57AsUn y zSMRPYuYVIv7COn64l3X.
- **Objetivo:** Evaluar visualmente restaurante, taller, evento y maqueta como candidatos conceptuales, no como activos aprobados.

### Pasos

- [x] Recuperar las cuatro imagenes mediante los recursos registrados en OpenArt.
- [x] Revisar consistencia de iluminacion, encuadre, escala, material, ausencia de logos, texto y QR funcional.
- [x] Verificar que cada escena explique un uso reconocible y que el objeto sea plausible de imprimir.
- [x] Clasificar cada recurso como aprobado, descartado o pendiente de ajuste.

### Validacion

- [x] Existe una decision por cada recurso.
- [x] Ningun candidato se marca como proyecto real.
- [x] Las imagenes descartadas no entran al contenido publicado.

### Criterio de finalizacion

Los cuatro candidatos tienen una evaluacion humana documentada y un destino claro.

## TASK-016 — Registrar procedencia, permisos y etiquetas visuales

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** Contenido
- **Dependencias:** TASK-015
- **Paralelizable:** Sí
- **Requerimientos:** RF-008, RC-009, RC-010, RC-015, RN-002, RN-003, RN-008
- **Decisiones de diseño:** Design 10, ImageTypeBadge; Design 16, conceptos siempre identificados.
- **Archivos o areas afectadas:** Registro de activos y metadatos de imagen por confirmar.
- **Objetivo:** Registrar autor, procedencia, permisos, tipo de imagen y texto alternativo de cada recurso candidato.

### Pasos

- [x] Registrar historyId, resource id, URL de origen y fecha de generacion de cada concepto.
- [x] Registrar autorizaciones o restricciones de cada fotografia real.
- [x] Generar texto alternativo contextual sin afirmar que el concepto fue fabricado por Lithora.
- [x] Asociar la etiqueta externa Ejemplo conceptual o Proyecto real segun la aprobacion.

### Validacion

- [x] Cada recurso tiene procedencia y permiso o una marca de uso pendiente.
- [x] El alt no contiene promesas ni atribuciones falsas.
- [x] La etiqueta no depende exclusivamente del color.

### Criterio de finalizacion

Los metadatos de procedencia y etiquetado son suficientes para evitar publicaciones ambiguas.

## TASK-017 — Separar originales y versiones de entrega

- **Estado inicial:** Pendiente
- **Prioridad:** Should
- **Fase:** Contenido
- **Dependencias:** TASK-015, TASK-016
- **Paralelizable:** Sí
- **Requerimientos:** RC-008, RC-009, RC-010, RR-005, RS-006
- **Decisiones de diseño:** Design 16, originales y entrega optimizada; Design 20, presupuestos.
- **Archivos o areas afectadas:** Directorios de assets por confirmar; no crear ubicaciones hasta aprobar el convenio.
- **Objetivo:** Guardar originales de OpenArt separados de las variantes que serviran al sitio.

### Pasos

- [x] Confirmar la ubicacion de originales y de archivos de entrega.
- [x] Conservar la referencia OpenArt y el registro de procedencia junto al original.
- [x] Evitar que originales pesados se enlacen directamente desde la pagina.
- [x] Registrar que los conceptos siguen pendientes de aprobacion de contenido.

### Validacion

- [x] Original y entrega pueden distinguirse sin ambiguedad.
- [x] La pagina no depende de un recurso temporal externo.
- [x] No se pierde la procedencia del activo.

### Criterio de finalizacion

Los activos aprobados tienen una ubicacion de trabajo y una version de entrega identificables.

## TASK-018 — Optimizar imagenes y generar variantes responsive

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** Contenido
- **Dependencias:** TASK-015, TASK-016, TASK-017
- **Paralelizable:** Sí
- **Requerimientos:** RF-016, RC-008, RC-010, RR-005, RA-004, RS-006
- **Decisiones de diseño:** Design 10, ratio 4:3; Design 16, contextual y render; Design 20, objetivos de peso.
- **Archivos o areas afectadas:** Assets aprobados y referencias en la ruta nueva.
- **Objetivo:** Preparar formatos, dimensiones y alt para entregar imagenes sin bloquear la carga ni causar CLS.

### Pasos

- [x] Exportar variantes responsive de la imagen contextual con ratio estable.
- [x] Optimizar la variante inicial con objetivo preferente menor a 250 KB y secundarias menor a 180 KB.
- [x] Eliminar metadatos innecesarios sin eliminar la informacion de procedencia almacenada fuera del archivo.
- [x] Verificar que cada variante conserva el objeto y el entorno relevantes.

### Validacion

- [x] Las imagenes tienen dimensiones declaradas y no provocan salto de layout.
- [x] Cada imagen tiene alt y tipo en el modelo.
- [x] El peso final se registra y cumple el objetivo acordado o tiene justificacion.

### Criterio de finalizacion

Las imagenes aprobadas estan optimizadas, etiquetadas y listas para ser referenciadas por la ruta.

## TASK-019 — Generar solo recursos visuales faltantes aprobados

- **Estado inicial:** Pendiente
- **Prioridad:** Could
- **Fase:** Contenido
- **Dependencias:** TASK-004, TASK-005, TASK-015, TASK-016
- **Paralelizable:** Sí
- **Requerimientos:** RF-008, RC-008, RC-009, RC-010, RN-002, RN-003
- **Decisiones de diseño:** Design 16, prompts de punto de venta, industria, producto y educacion.
- **Archivos o areas afectadas:** OpenArt MCP y assets aprobados por confirmar.
- **Objetivo:** Completar unicamente los nichos aprobados sin recurso suficiente, usando el prompt maestro y sin generar decenas de imagenes.

### Pasos

- [x] Comparar faltantes contra la lista de nichos aprobada en TASK-004. ? No aplica localmente: no hay un faltante comercialmente aprobado; se conservaron fallbacks accesibles y no se generaron activos innecesarios.
- [x] Ajustar el prompt maestro solo si la evaluacion de TASK-015 demuestra inconsistencia. ? No aplica localmente: no hay un faltante comercialmente aprobado; se conservaron fallbacks accesibles y no se generaron activos innecesarios.
- [x] Generar una muestra controlada por faltante y registrar historyId, recurso y procedencia. ? No aplica localmente: no hay un faltante comercialmente aprobado; se conservaron fallbacks accesibles y no se generaron activos innecesarios.
- [x] Pasar cada recurso por TASK-016 y TASK-018 antes de usarlo. ? No aplica localmente: no hay un faltante comercialmente aprobado; se conservaron fallbacks accesibles y no se generaron activos innecesarios.

### Validacion

- [x] No se generan recursos para nichos no aprobados. ? No aplica localmente: no hay un faltante comercialmente aprobado; se conservaron fallbacks accesibles y no se generaron activos innecesarios.
- [x] No contiene logos, texto, QR funcional, marcas o geometria imposible. ? No aplica localmente: no hay un faltante comercialmente aprobado; se conservaron fallbacks accesibles y no se generaron activos innecesarios.
- [x] Cada recurso nuevo queda etiquetado como conceptual hasta validacion. ? No aplica localmente: no hay un faltante comercialmente aprobado; se conservaron fallbacks accesibles y no se generaron activos innecesarios.

### Criterio de finalizacion

Los faltantes aprobados tienen un candidato revisado y no se generan activos fuera del alcance.

## 8. Ruta y estructura principal

## TASK-020 — Crear la ruta indexable y su esqueleto semantico

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** UI
- **Dependencias:** TASK-005, TASK-006, TASK-009, TASK-011
- **Paralelizable:** Sí
- **Requerimientos:** RF-001, RF-002, RS-001, RS-004, RS-005, RA-003
- **Decisiones de diseño:** Design 6 y 7, secciones en orden; Design 21, ruta indexable y headings.
- **Archivos o areas afectadas:** Nueva ruta con <ruta>/index.html; assets/styles.css; assets/animations.js si la pagina usa el sistema compartido.
- **Objetivo:** Crear la pagina base con landmarks, un H1, secciones principales y contenido inicial en el estado natural.

### Pasos

- [x] Crear el archivo de ruta siguiendo el patron comprobado de directorio/index.html, usando el slug aprobado en TASK-006.
- [x] Integrar header y footer existentes sin duplicar una identidad visual ajena.
- [x] Crear main, nav, secciones y regiones con headings jerarquicos.
- [x] Dejar el contenido visible antes de cualquier mejora de movimiento.

### Validacion

- [x] La URL directa carga la pagina.
- [x] Existe un solo H1 y los headings posteriores son jerarquicos.
- [x] La pagina no muestra nichos no aprobados.
- [x] La consola no muestra errores relacionados.

### Criterio de finalizacion

La ruta existe, carga directamente y ofrece una estructura semantica lista para recibir los bloques funcionales.

## TASK-021 — Implementar metadata basica y enlaces internos de la ruta

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** SEO
- **Dependencias:** TASK-006, TASK-020, TASK-063
- **Paralelizable:** Sí
- **Requerimientos:** RS-001, RS-002, RS-003, RS-006, RS-007, RS-009
- **Decisiones de diseño:** Design 21, metadata, breadcrumb y enlaces contextuales.
- **Archivos o areas afectadas:** <ruta>/index.html; index.html; servicio-impresion-3d/index.html; precios-impresion-3d/index.html; prototipado-rapido/index.html; materiales-impresion-3d/index.html; assets/og-card.svg.
- **Objetivo:** Publicar title, description, canonical, metadatos sociales y enlaces internos unicos para la nueva seccion.

### Pasos

- [x] Redactar y aprobar title y meta description propios de la ruta.
- [x] Definir canonical absoluto de la ruta y social metadata solo cuando el copy y recurso esten aprobados.
- [x] Enlazar desde la home y landings relacionadas mediante enlaces contextuales reales.
- [x] Añadir breadcrumb cuando corresponda a la ruta aprobada.

### Validacion

- [x] La ruta tiene title, description, canonical y H1 unicos.
- [x] Los enlaces internos apuntan a destinos existentes.
- [x] No se duplica metadata entre paginas.

### Criterio de finalizacion

La nueva ruta tiene metadata y enlazado interno revisados, sin depender de una pagina individual de nicho.

## TASK-022 — Integrar sitemap, robots y estados de ruta

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** Publicacion
- **Dependencias:** TASK-006, TASK-020, TASK-021
- **Paralelizable:** Sí
- **Requerimientos:** RS-001, RS-008, RS-011, RX-007
- **Decisiones de diseño:** Design 19, errores y estados; Design 21, sitemap y paginas delgadas.
- **Archivos o areas afectadas:** sitemap.xml; robots.txt; <ruta>/index.html.
- **Objetivo:** Hacer descubrible la ruta y definir carga, error y ausencia de contenido sin indexar paginas insuficientes.

### Pasos

- [x] Añadir la URL final al sitemap con formato consistente con las rutas existentes.
- [x] Confirmar que robots.txt no bloquea la ruta y conserva la referencia al sitemap.
- [x] Implementar estado de carga, error de datos y categoria sin nichos.
- [x] Evitar crear o enlazar paginas individuales de nicho sin contenido unico suficiente.

### Validacion

- [x] Sitemap contiene la URL canonica final.
- [x] robots.txt permite el rastreo previsto.
- [x] Error y vacio no rompen la navegacion.
- [x] No se genera una pagina delgada de nicho.

### Criterio de finalizacion

La ruta es rastreable y sus estados alternativos no crean señales SEO incorrectas.

## 9. Hero editorial

## TASK-023 — Implementar el contenido y semantica de EcosystemHero

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** UI
- **Dependencias:** TASK-010, TASK-020
- **Paralelizable:** Sí
- **Requerimientos:** RF-001, RF-006, RF-007, RX-001, RX-003, RX-004, RS-004, RA-003, RA-006
- **Decisiones de diseño:** Design 3, principios; Design 7, Hero editorial; Design 17, EcosystemHero.
- **Archivos o areas afectadas:** <ruta>/index.html; assets/styles.css.
- **Objetivo:** Presentar el ecosistema, capacidades, personalizacion y CTA para explorar sin convertir el hero en una vitrina de productos.

### Pasos

- [x] Escribir etiqueta, H1 unico, propuesta de valor y descripcion en lenguaje no tecnico.
- [x] Incluir que las aplicaciones son puntos de partida y que no se necesita archivo 3D.
- [x] Añadir CTA con destino al mapa y nombre descriptivo.
- [x] Integrar tratamiento de imagen o decoracion solo si el recurso fue aprobado.

### Validacion

- [x] La primera vista comunica soluciones por nicho.
- [x] H1, CTA y mensaje sin archivo son legibles en escritorio y telefono.
- [x] El copy no presenta aplicaciones como inventario ni hace promesas no validadas.

### Criterio de finalizacion

El hero permite entender el proposito y comenzar la exploracion sin conocimiento previo de impresion 3D.

## TASK-024 — Adaptar Hero a responsive, movimiento reducido y analitica

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** UI
- **Dependencias:** TASK-023, TASK-041, TASK-054
- **Paralelizable:** Sí
- **Requerimientos:** RX-001, RX-007, RR-001, RR-002, RR-003, RR-005, RA-008, RM-001
- **Decisiones de diseño:** Design 13, entrada inicial; Design 14, rangos; Design 22, vista de seccion.
- **Archivos o areas afectadas:** <ruta>/index.html; assets/styles.css; assets/animations.js; AnalyticsBoundary por confirmar.
- **Objetivo:** Hacer que el hero conserve jerarquia, accesibilidad y medicion en todos los rangos.

### Pasos

- [x] Ajustar texto, imagen y CTA para escritorio, tableta, telefono y pantalla pequena.
- [x] Activar el evento de vista cuando la seccion este visible, no por cada re-render.
- [x] Aplicar entrada de opacity/transform solo con movimiento permitido.
- [x] Mantener el estado final visible si GSAP falla o reduced motion esta activo.

### Validacion

- [x] Hero no genera overflow horizontal.
- [x] El evento se registra una sola vez por carga.
- [x] Reduced motion muestra el contenido sin animacion larga.

### Criterio de finalizacion

El hero es funcional, medible y legible sin depender de GSAP ni de hover.

## 10. Mapa del ecosistema

## TASK-025 — Construir la estructura semantica de EcosystemMap

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** UI
- **Dependencias:** TASK-009, TASK-020
- **Paralelizable:** Sí
- **Requerimientos:** RF-002, RX-002, RX-006, RA-001, RA-002, RA-003, RA-007
- **Decisiones de diseño:** Design 8, hub editorial de cuatro ramas; Design 17, EcosystemMap.
- **Archivos o areas afectadas:** <ruta>/index.html; assets/styles.css.
- **Objetivo:** Representar a Lithora como nucleo y mostrar las cuatro categorias con controles accesibles.

### Pasos

- [x] Renderizar el nucleo con copy de entender, disenar, validar y fabricar.
- [x] Renderizar Negocios, Industria, Eventos y Diseno y prototipos con descripcion de beneficio.
- [x] Asociar cada rama con su destino de categoria y nombre accesible.
- [x] Definir estados visuales active, focus y reduced sin depender del color.

### Validacion

- [x] Las cuatro categorias son identificables en la vista inicial.
- [x] Cada control tiene nombre accesible y destino.
- [x] La estructura sigue siendo legible sin conectores graficos.

### Criterio de finalizacion

El mapa tiene una estructura semantica navegable y representa las decisiones de design.md.

## TASK-026 — Implementar variante radial de escritorio y conectores

- **Estado inicial:** Pendiente
- **Prioridad:** Should
- **Fase:** UI
- **Dependencias:** TASK-025
- **Paralelizable:** Sí
- **Requerimientos:** RF-002, RX-007, RR-001, RA-007
- **Decisiones de diseño:** Design 8, hub radial editorial; Design 13, conexiones con movimiento limitado.
- **Archivos o areas afectadas:** assets/styles.css; <ruta>/index.html.
- **Objetivo:** Dar al hub una lectura radial en escritorio sin volver los conectores requisito de comprension.

### Pasos

- [x] Colocar visualmente el nucleo y las cuatro ramas dentro del contenedor existente.
- [x] Crear conectores estaticos o animables sin texto incrustado en imagen.
- [x] Limitar la composicion al ancho seguro del contenedor.
- [x] Mantener los controles como elementos interactivos independientes.

### Validacion

- [x] El mapa no provoca overflow en escritorio amplio o laptop.
- [x] El nucleo y las categorias conservan contraste y jerarquia.
- [x] Al retirar los conectores, la navegacion sigue funcionando.

### Criterio de finalizacion

La variante de escritorio comunica el ecosistema sin convertir la decoracion en una dependencia funcional.

## TASK-027 — Implementar variante vertical movil y fallback sin JavaScript

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** UI
- **Dependencias:** TASK-025, TASK-011
- **Paralelizable:** Sí
- **Requerimientos:** RR-003, RR-004, RR-005, RR-006, RA-001, RA-002, RA-007
- **Decisiones de diseño:** Design 8, espina editorial movil; Design 9 y 21, fallback con anclas.
- **Archivos o areas afectadas:** assets/styles.css; <ruta>/index.html; assets/animations.js si se requiere mejora.
- **Objetivo:** Adaptar el mapa a una secuencia vertical utilizable tactilmente y sin JavaScript.

### Pasos

- [x] Convertir las ramas en botones/enlaces apilados a ancho reducido.
- [x] Evitar una fila horizontal con desplazamiento obligatorio.
- [x] Conservar anclas y contenido agrupado cuando JavaScript esta desactivado.
- [x] Ajustar orden de foco y areas tactiles.

### Validacion

- [x] Se prueba en telefono y pantalla pequena sin overflow.
- [x] Cada categoria puede activarse por toque y teclado.
- [x] Con JavaScript desactivado siguen visibles las categorias y destinos.

### Criterio de finalizacion

La variante movil conserva la funcion del mapa sin reducirlo a un grafico ilegible.

## TASK-028 — Implementar activacion, anclas, anuncio y analitica del mapa

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** Integracion
- **Dependencias:** TASK-025, TASK-027, TASK-007
- **Paralelizable:** Sí
- **Requerimientos:** RF-002, RF-003, RF-017, RX-006, RX-007, RR-004, RA-001, RA-002, RA-007, RM-002
- **Decisiones de diseño:** Design 8, activacion por click/toque/teclado; Design 9, sincronizacion; Design 22, category_select.
- **Archivos o areas afectadas:** <ruta>/index.html; JavaScript de la ruta o assets/animations.js por confirmar.
- **Objetivo:** Conectar cada rama con la categoria, anunciar el cambio y registrar la seleccion una sola vez.

### Pasos

- [x] Implementar activacion por mouse, toque, Enter y Espacio.
- [x] Actualizar la categoria activa, el destino de ancla y la posicion de lectura.
- [x] Anunciar el nombre de categoria activa en una region de estado.
- [x] Disparar ecosystem_category_select sin duplicar eventos por re-render.

### Validacion

- [x] La accion funciona con puntero, teclado y tacto.
- [x] El foco y la categoria activa son perceptibles sin color exclusivo.
- [x] El evento contiene id/nombre, ruta y dispositivo.

### Criterio de finalizacion

Una rama conduce a la categoria correcta, comunica el cambio y registra la interaccion.

## 11. Navegacion de categorias

## TASK-029 — Sincronizar CategoryNavigation con mapa, anclas e historial

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** Integracion
- **Dependencias:** TASK-028, TASK-012
- **Paralelizable:** Sí
- **Requerimientos:** RF-002, RF-003, RF-015, RX-002, RX-006, RX-007, RR-001, RR-002, RR-003, RA-001, RA-002, RA-007, RM-002
- **Decisiones de diseño:** Design 9, categoria activa, fragmentos compartibles, atras/adelante cuando aplique; Design 17, CategoryNavigation.
- **Archivos o areas afectadas:** <ruta>/index.html; JavaScript de la ruta por confirmar; assets/styles.css.
- **Objetivo:** Proporcionar una segunda navegacion de categorias sincronizada con el mapa y utilizable en movil.

### Pasos

- [x] Renderizar las cuatro categorias y conteo solo si fue aprobado.
- [x] Sincronizar categoria activa entre mapa y navegacion.
- [x] Leer el fragmento inicial y actualizarlo solo con una accion compartible aprobada.
- [x] Definir comportamiento de atras/adelante sin perder contenido ni foco.
- [x] Mostrar mensaje de categoria sin nichos y otras rutas disponibles.

### Validacion

- [x] Una categoria seleccionada en cualquier control actualiza el otro.
- [x] Fragmentos directos abren la categoria correcta o caen a una categoria valida.
- [x] No existe scroll horizontal obligatorio en movil.
- [x] El evento de categoria no se duplica.

### Criterio de finalizacion

El visitante puede llegar a cualquier categoria por control, ancla o URL compartible y conserva contexto.

## 12. Galeria de nichos

## TASK-030 — Implementar NicheGrid filtrado, publicado y ordenado

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** UI
- **Dependencias:** TASK-012, TASK-014, TASK-029
- **Paralelizable:** Sí
- **Requerimientos:** RF-003, RF-013, RF-014, RF-015, RC-012, RC-013, RX-002
- **Decisiones de diseño:** Design 7, galeria; Design 17, NicheGrid.
- **Archivos o areas afectadas:** <ruta>/index.html; fuente de contenido confirmada; JavaScript de la ruta por confirmar.
- **Objetivo:** Mostrar exclusivamente nichos publicados de la categoria activa en el orden configurado.

### Pasos

- [x] Filtrar por categoriaId.
- [x] Excluir estados ocultos, incompletos o no aprobados.
- [x] Ordenar por el valor de orden y usar una regla estable para empates.
- [x] Renderizar encabezado de region y conteo solo si esta aprobado.

### Validacion

- [x] Un nicho de otra categoria no aparece.
- [x] Un nicho oculto no aparece en HTML visible ni conteo publico.
- [x] Cambiar orden en la fuente cambia el orden visible.

### Criterio de finalizacion

NicheGrid consume el modelo real y presenta solo contenido publicable de la categoria activa.

## TASK-031 — Implementar estados de NicheGrid y reflujo responsive

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** UI
- **Dependencias:** TASK-030, TASK-044, TASK-045
- **Paralelizable:** Sí
- **Requerimientos:** RF-016, RX-003, RX-004, RX-007, RR-001, RR-002, RR-003, RR-005, RA-003, RA-007
- **Decisiones de diseño:** Design 10, estados; Design 14, reflujo por contenido; Design 19, categoria vacia, carga y error.
- **Archivos o areas afectadas:** <ruta>/index.html; assets/styles.css.
- **Objetivo:** Resolver carga, vacio, error y reflujo sin saltos ni perdida de contenido.

### Pasos

- [x] Crear estado de carga con proporciones finales.
- [x] Crear estado de categoria sin nichos con rutas alternativas validas.
- [x] Crear estado de error de datos con reintento y regreso.
- [x] Reservar espacio para tarjetas e imagenes antes de cargar recursos.

### Validacion

- [x] Los estados se anuncian y no parecen contenido real.
- [x] Nombre, problema, beneficio y CTA no se ocultan por el reflujo.
- [x] No hay overflow horizontal ni layout shift evitable.

### Criterio de finalizacion

La galeria tiene estados previsibles y conserva navegacion, accesibilidad y contexto.

## 13. Tarjeta de nicho

## TASK-032 — Implementar estructura semantica y contenido de NicheCard

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** UI
- **Dependencias:** TASK-009, TASK-010, TASK-030
- **Paralelizable:** Sí
- **Requerimientos:** RF-004, RF-005, RF-007, RC-001, RC-002, RC-003, RC-004, RC-005, RC-006, RC-007, RC-011, RC-014, RC-016, RC-018, RC-019, RX-003, RX-004, RX-005, RX-009
- **Decisiones de diseño:** Design 3, prioridad de problema/beneficio; Design 10, anatomia; Design 17, NicheCard.
- **Archivos o areas afectadas:** <ruta>/index.html; assets/styles.css.
- **Objetivo:** Crear una tarjeta que permita reconocer un nicho antes de exigir ampliar o cotizar.

### Pasos

- [x] Renderizar categoria, nombre, descripcion corta, problema y beneficio.
- [x] Mostrar aplicaciones destacadas sin presentarlas como inventario.
- [x] Mostrar mensaje de personalizacion y CTA de ampliacion.
- [x] Mantener la informacion esencial en el estado natural sin hover.

### Validacion

- [x] El problema y beneficio aparecen antes del CTA.
- [x] La tarjeta usa lenguaje comprensible y especifico.
- [x] La tarjeta no muestra precios, disponibilidad permanente o clientes inventados.

### Criterio de finalizacion

Cada tarjeta publicada comunica contexto, oportunidad, beneficio, aplicaciones y siguiente accion.

## TASK-033 — Implementar NicheImage, badge y fallback de imagen

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** UI
- **Dependencias:** TASK-013, TASK-018, TASK-032
- **Paralelizable:** Sí
- **Requerimientos:** RF-008, RF-016, RC-008, RC-009, RC-010, RX-004, RR-005, RA-004, RA-007, RN-002, RN-003
- **Decisiones de diseño:** Design 10, estados visuales; Design 16, etiqueta externa; Design 17, NicheImage, ImageTypeBadge y EmptyImageState.
- **Archivos o areas afectadas:** <ruta>/index.html; assets/styles.css; assets de entrega.
- **Objetivo:** Mostrar imagen contextual o fallback con ratio estable, alt y tipo de imagen.

### Pasos

- [x] Renderizar la imagen con dimensiones y ratio reservado.
- [x] Renderizar badge textual Proyecto real o Ejemplo conceptual fuera de la imagen.
- [x] Manejar carga, ausencia y error sin eliminar nombre, contenido o CTA.
- [x] Omitir del lector de pantalla cualquier decoracion sin informacion.

### Validacion

- [x] Un concepto se identifica en la tarjeta y detalle.
- [x] Un recurso fallido conserva el contenido.
- [x] El alt describe el uso sin atribuir un proyecto no validado.

### Criterio de finalizacion

La procedencia y disponibilidad visual se comunican correctamente en todos los estados.

## TASK-034 — Implementar estados interactivos y medicion de NicheCard

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** Integracion
- **Dependencias:** TASK-032, TASK-033, TASK-007
- **Paralelizable:** Sí
- **Requerimientos:** RF-009, RF-017, RX-006, RX-007, RR-004, RR-006, RA-001, RA-002, RA-006, RA-009, RM-003
- **Decisiones de diseño:** Design 10, default/hover/focus/active/loading/reduced; Design 22, niche_open.
- **Archivos o areas afectadas:** <ruta>/index.html; JavaScript de la ruta por confirmar; assets/styles.css.
- **Objetivo:** Hacer que la tarjeta abra el detalle por puntero, teclado y tacto, registrando la apertura.

### Pasos

- [x] Asociar CTA de ampliacion con un detalle identificable.
- [x] Implementar focus visible, active y feedback perceptible sin hover.
- [x] Desactivar hover dependiente en tacto y reduced motion.
- [x] Registrar ecosystem_niche_open cuando el detalle se abra, evitando duplicados.

### Validacion

- [x] Enter, Espacio, click y toque abren el mismo detalle.
- [x] La tarjeta tiene area tactil util y nombre accesible.
- [x] El evento incluye nicho, categoria, ruta y dispositivo una vez por apertura.

### Criterio de finalizacion

La tarjeta es accionable en todos los dispositivos y abre un detalle medible sin depender de efectos visuales.

## 14. Detalle ampliado de nicho

## TASK-035 — Implementar expansion inline de NicheDetail

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** UI
- **Dependencias:** TASK-030, TASK-032, TASK-034
- **Paralelizable:** Sí
- **Requerimientos:** RF-004, RF-005, RF-007, RF-009, RF-012, RC-005, RC-007, RC-014, RC-016, RC-019, RX-003, RX-005, RX-008, RX-009
- **Decisiones de diseño:** Design 11, expansion inline anclada; Design 17, NicheDetail, ApplicationList y avisos.
- **Archivos o areas afectadas:** <ruta>/index.html; assets/styles.css; JavaScript de la ruta por confirmar.
- **Objetivo:** Mostrar debajo de la tarjeta un detalle completo con problema, beneficio, aplicaciones, servicios, personalizacion y CTA.

### Pasos

- [x] Abrir el detalle dentro del flujo de la categoria sin modal ni drawer.
- [x] Mostrar las cuatro a siete aplicaciones completas.
- [x] Mostrar servicios relacionados solo cuando esten validados.
- [x] Incluir nota de concepto, aviso de personalizacion y CTA de cotizacion.

### Validacion

- [x] Solo un detalle permanece abierto por categoria.
- [x] El contenido completo se puede leer sin conocimiento tecnico.
- [x] El detalle no presenta un producto comprable ni precios fijos.

### Criterio de finalizacion

El visitante puede evaluar un nicho y decidir cotizar sin salir de la vista general.

## TASK-036 — Implementar cierre, foco, posicion, estados y contexto compartible

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** Integracion
- **Dependencias:** TASK-035, TASK-029
- **Paralelizable:** Sí
- **Requerimientos:** RF-012, RF-017, RX-006, RX-007, RX-008, RR-002, RR-003, RA-001, RA-002, RA-003, RA-008, RM-003, RS-007
- **Decisiones de diseño:** Design 11, cierre y retorno; Design 9, fragmentos si son aprobados; Design 19, carga/error.
- **Archivos o areas afectadas:** <ruta>/index.html; JavaScript de la ruta por confirmar; assets/styles.css.
- **Objetivo:** Hacer reversible la expansion y robusta frente a carga, error, reduced motion y navegacion.

### Pasos

- [x] Implementar cierre que restaure foco al control de origen.
- [x] Conservar categoria, posicion y fragmento solo si la estrategia de TASK-029 fue aprobada.
- [x] Implementar carga y error de detalle con reintento y regreso.
- [x] Aplicar apertura/cierre reducido sin transiciones largas.

### Validacion

- [x] Volver devuelve a la vista de categoria sin reiniciar la pagina.
- [x] El foco no se pierde al abrir o cerrar.
- [x] Error de detalle no bloquea otras categorias.

### Criterio de finalizacion

El detalle inline es reversible, accesible, compartible cuando corresponda y tolerante a fallos.

## 15. Proceso y orientacion sin archivo 3D

## TASK-037 — Implementar proceso breve y NoFileRequiredCallout

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** Contenido
- **Dependencias:** TASK-010, TASK-020
- **Paralelizable:** Sí
- **Requerimientos:** RF-001, RF-006, RF-007, RC-014, RC-019, RX-001, RX-004, RX-009, RR-005, RA-003, RA-006, RN-006, RN-008
- **Decisiones de diseño:** Design 7, proceso y orientacion; Design 15, callout sin archivo; Design 17, PersonalizationNotice y NoFileRequiredCallout.
- **Archivos o areas afectadas:** <ruta>/index.html; assets/styles.css.
- **Objetivo:** Explicar necesidad, diseno/adaptacion, validacion y fabricacion, y eliminar la barrera del archivo 3D.

### Pasos

- [x] Redactar pasos en lenguaje no tecnico y con el problema antes del proceso.
- [x] Mostrar de forma visible No necesitas un archivo 3D para empezar.
- [x] Indicar que una idea, referencia, pieza existente o descripcion pueden servir para orientar, solo si Lithora lo valida.
- [x] Añadir CTA secundario unicamente cuando TASK-002 confirme canal disponible.

### Validacion

- [x] El mensaje aparece antes del CTA final.
- [x] El visitante no necesita archivo para solicitar orientacion.
- [x] No se prometen formatos, tiempos o capacidades no aprobados.

### Criterio de finalizacion

La pagina explica como empezar y hace explicita la orientacion sin archivo sin crear requisitos nuevos.

## 16. Flujo de cotizacion

## TASK-038 — Implementar QuoteCTA desacoplado y transferencia de contexto

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** Integracion
- **Dependencias:** TASK-002, TASK-003, TASK-035
- **Paralelizable:** Sí
- **Requerimientos:** RF-006, RF-007, RF-010, RF-011, RF-017, RX-005, RX-008, RM-005, RM-006, RM-008, RN-004, RN-005, RN-006
- **Decisiones de diseño:** Design 12, adapter desacoplado, resumen y mensaje sugerido; Design 17, QuoteCTA.
- **Archivos o areas afectadas:** <ruta>/index.html; formulario o canal confirmado en TASK-002; JavaScript de la ruta por confirmar.
- **Objetivo:** Iniciar cotizacion con categoria, nicho, aplicacion opcional, ruta, referencia y mensaje sugerido sin acoplar el componente a una integracion no confirmada.

### Pasos

- [x] Construir el contexto con ids y nombres de categoria/nicho.
- [x] Añadir aplicacion seleccionada, referencia visual y tipo de imagen cuando existan.
- [x] Mostrar un resumen editable y el mensaje sugerido aprobado.
- [x] Transferir contexto al canal confirmado y disparar quote_click, quote_start y origin_context en sus momentos definidos.

### Validacion

- [x] La solicitud conserva categoria y nicho de origen.
- [x] La ausencia de archivo o precio no impide continuar.
- [x] El CTA se puede activar por teclado y tacto.
- [x] Los eventos no duplican el inicio.

### Criterio de finalizacion

Una solicitud iniciada desde cualquier nicho llega al canal aprobado con contexto suficiente y sin inventar una integracion.

## TASK-039 — Implementar estados de cotizacion, errores y confirmacion

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** Integracion
- **Dependencias:** TASK-038
- **Paralelizable:** Sí
- **Requerimientos:** RF-010, RF-011, RF-012, RX-005, RX-007, RX-008, RR-006, RA-006, RA-007, RM-005, RM-006, RM-007, RM-008, RN-004, RN-005
- **Decisiones de diseño:** Design 12, estados disponible/no configurado/iniciando/error/exito; Design 19, error de envio y confirmacion.
- **Archivos o areas afectadas:** Canal confirmado y <ruta>/index.html; JavaScript de la ruta por confirmar.
- **Objetivo:** Resolver la solicitud completa sin falso exito, doble envio o perdida de contexto.

### Pasos

- [x] Mostrar estado disponible y prevenir doble activacion durante inicio.
- [x] Mostrar causa textual cuando el canal no esta configurado.
- [x] Conservar contexto y contenido al fallar y permitir reintento.
- [x] Mostrar confirmacion con categoria y nicho despues de una respuesta positiva.

### Validacion

- [x] El canal no configurado no parece funcional.
- [x] Error y reintento conservan el contexto.
- [x] Solo una respuesta positiva dispara quote_complete.
- [x] El regreso devuelve a detalle o categoria.

### Criterio de finalizacion

El flujo tiene estados verificables y no reporta solicitud enviada sin confirmacion del canal.

## TASK-040 — Integrar adjuntos y privacidad solo si el canal los admite

- **Estado inicial:** Pendiente
- **Prioridad:** Should
- **Fase:** Integracion
- **Dependencias:** TASK-003, TASK-038, TASK-039
- **Paralelizable:** Sí
- **Requerimientos:** RF-006, RF-011, RM-009, RN-004, RN-006
- **Decisiones de diseño:** Design 12, referencia/archivo opcional; Design 22, attachment_use; fuera de alcance de integraciones no confirmadas.
- **Archivos o areas afectadas:** Canal confirmado; formulario actual solo si TASK-002 lo selecciona.
- **Objetivo:** Permitir adjuntos sin convertirlos en requisito y sin almacenar datos fuera del canal aprobado.

### Pasos

- [x] Confirmar soporte, tipos, tamano y destino de adjuntos.
- [x] Mostrar estado opcional y mensaje de que no es necesario adjuntar.
- [x] Registrar intento y resultado de adjunto sin guardar el archivo en analitica.
- [x] Documentar privacidad, rechazo y error de carga.

### Validacion

- [x] La cotizacion funciona sin adjunto.
- [x] Los limites del canal se comunican antes de cargar.
- [x] No se registran archivos ni datos personales innecesarios en eventos.

### Criterio de finalizacion

Los adjuntos solo estan disponibles si el canal aprobado los soporta y no bloquean orientacion.

## 17. Animaciones y microinteracciones

## TASK-041 — Integrar tokens y punto de entrada de movimiento existente

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** UI
- **Dependencias:** TASK-020, TASK-025, TASK-030
- **Paralelizable:** Sí
- **Requerimientos:** RX-007, RA-008
- **Decisiones de diseño:** Design 13, duraciones; Design 2, GSAP existente; Design 5, tokens actuales.
- **Archivos o areas afectadas:** assets/styles.css; assets/animations.js; <ruta>/index.html.
- **Objetivo:** Integrar la nueva ruta con los tokens y matchMedia existentes sin agregar otra biblioteca de movimiento.

### Pasos

- [x] Reutilizar variables motion-duration y easing existentes cuando coincidan con design.md.
- [x] Crear selectores o inicializacion especificos de la ruta sin tocar animaciones de la home de forma accidental.
- [x] Mantener fallback visible si GSAP o ScrollTrigger no cargan.
- [x] Evitar listeners duplicados al cambiar de viewport.

### Validacion

- [x] La home conserva su comportamiento actual.
- [x] La nueva ruta carga con y sin GSAP.
- [x] No se agregan dependencias de animacion.

### Criterio de finalizacion

El sistema de movimiento de la nueva ruta reutiliza el existente y tiene fallback operativo.

## TASK-042 — Implementar transiciones de mapa, categorias, tarjetas y detalle

- **Estado inicial:** Pendiente
- **Prioridad:** Should
- **Fase:** UI
- **Dependencias:** TASK-041, TASK-028, TASK-034, TASK-036
- **Paralelizable:** Sí
- **Requerimientos:** RX-007, RA-008, RR-004
- **Decisiones de diseño:** Design 13, duraciones 100-520 ms; propiedades opacity y transform; Design 10, estados.
- **Archivos o areas afectadas:** assets/animations.js; assets/styles.css; <ruta>/index.html.
- **Objetivo:** Implementar feedback de interaccion con movimiento limitado y sin animar dimensiones de layout.

### Pasos

- [x] Animar activacion del mapa y conectores entre 180 y 300 ms.
- [x] Animar cambio de categoria entre 180 y 240 ms con opacity y desplazamiento corto.
- [x] Animar entrada/salida del detalle entre 240 y 320 ms sin scroll hijacking.
- [x] Aplicar hover/focus/press de tarjeta y CTA entre 100 y 180 ms sin depender de hover.

### Validacion

- [x] Las duraciones coinciden con design.md.
- [x] Solo se animan propiedades de compositor y estilos de estado permitidos.
- [x] El contenido sigue visible si una animacion se interrumpe.

### Criterio de finalizacion

Las transiciones confirman acciones y no afectan lectura, teclado o estabilidad de layout.

## TASK-043 — Implementar reduced motion, limpieza y rendimiento de timelines

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** Calidad
- **Dependencias:** TASK-041, TASK-042
- **Paralelizable:** Sí
- **Requerimientos:** RX-006, RX-007, RR-003, RA-008
- **Decisiones de diseño:** Design 13, alternativa reducida; Design 14, simplificacion movil; Design 20, evitar carga pesada.
- **Archivos o areas afectadas:** assets/animations.js; assets/styles.css.
- **Objetivo:** Garantizar movimiento reducido, listeners limpios y ausencia de efectos costosos en movil.

### Pasos

- [x] Desactivar entrada, hover, parallax y conexiones animadas con prefers-reduced-motion reduce.
- [x] Desactivar parallax y reacciones de puntero en movil/tactil.
- [x] Limpiar timelines, observers y listeners al cambiar contexto o desmontar comportamiento.
- [x] Liberar will-change y evitar animaciones de width, height, margin o padding.

### Validacion

- [x] Reduced motion presenta el estado final de inmediato.
- [x] No hay parallax en telefono.
- [x] No se acumulan listeners al redimensionar.
- [x] La traza no muestra layout thrashing causado por la nueva ruta.

### Criterio de finalizacion

El movimiento respeta preferencias, no crea fugas y cumple el objetivo de rendimiento definido.

## 18. Responsive

## TASK-044 — Validar escritorio amplio y laptop

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** Calidad
- **Dependencias:** TASK-020, TASK-026, TASK-029, TASK-031, TASK-035
- **Paralelizable:** Sí
- **Requerimientos:** RR-001, RR-005, RR-006, RX-004, RA-005
- **Decisiones de diseño:** Design 14, escritorio amplio y laptop; Design 5, contenedor editorial.
- **Archivos o areas afectadas:** <ruta>/index.html; assets/styles.css; assets/animations.js.
- **Objetivo:** Verificar jerarquia, hub radial, tarjetas, detalle y CTA en escritorio sin scroll horizontal.

### Pasos

- [x] Probar el ancho de escritorio amplio acordado por TASK-008.
- [x] Probar laptop y revisar que el mapa no pierda etiquetas.
- [x] Revisar contenido largo, tarjeta sin imagen y detalle abierto.
- [x] Capturar evidencia solo si el proceso de calidad lo autoriza.

### Validacion

- [x] No existe overflow horizontal.
- [x] Problema, beneficio, aplicaciones y CTA siguen visibles.
- [x] La cabecera no cubre anclas ni detalle.

### Criterio de finalizacion

Escritorio amplio y laptop cumplen la jerarquia y navegacion del diseño.

## TASK-045 — Validar tableta, telefono y pantalla pequena

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** Calidad
- **Dependencias:** TASK-027, TASK-031, TASK-035, TASK-043
- **Paralelizable:** Sí
- **Requerimientos:** RR-002, RR-003, RR-004, RR-005, RR-006, RA-009, RX-004, RX-005
- **Decisiones de diseño:** Design 14, tableta, telefono y pantalla pequena.
- **Archivos o areas afectadas:** <ruta>/index.html; assets/styles.css; assets/animations.js.
- **Objetivo:** Validar mapa vertical, navegacion, tarjetas, detalle, imagenes y CTA en dispositivos pequenos.

### Pasos

- [x] Probar tableta en orientacion vertical y horizontal.
- [x] Probar telefono de 390x844 o equivalente y una pantalla pequena adicional acordada.
- [x] Revisar que controles tactiles, texto, badges y CTA no se recorten.
- [x] Ajustar solo reglas derivadas de design.md y registrar cualquier desviacion.

### Validacion

- [x] No existe scroll horizontal obligatorio.
- [x] La accion de cotizacion permanece accesible.
- [x] El mapa no se reduce a un grafico ilegible.
- [x] No hay contenido esencial oculto por el layout.

### Criterio de finalizacion

Tableta, telefono y pantalla pequena cumplen RR-002 a RR-006 y conservan conversion.

## TASK-046 — Validar orientacion, zoom y overflow

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** Calidad
- **Dependencias:** TASK-044, TASK-045
- **Paralelizable:** Sí
- **Requerimientos:** RR-001, RR-002, RR-003, RR-005, RA-005, RA-009
- **Decisiones de diseño:** Design 14, simplificacion por prioridad; Design 15, areas y contraste.
- **Archivos o areas afectadas:** <ruta>/index.html; assets/styles.css.
- **Objetivo:** Detectar fallos de lectura, foco, corte de contenido u overflow al cambiar orientacion o zoom.

### Pasos

- [x] Probar zoom del navegador y texto aumentado sin perder CTA.
- [x] Probar orientacion horizontal en tableta y telefono.
- [x] Medir scrollWidth contra viewport y revisar elementos fuera del contenedor.
- [x] Revisar error, vacio y sin imagen en cada condicion.

### Validacion

- [x] No hay desplazamiento horizontal obligatorio.
- [x] El contenido se refluye sin superponer controles.
- [x] El CTA y el detalle siguen alcanzables con zoom.

### Criterio de finalizacion

La ruta es usable bajo orientacion y zoom sin violar la jerarquia ni el acceso a acciones.

## 19. Accesibilidad

## TASK-047 — Implementar landmarks, skip link y jerarquia semantica

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** Accesibilidad
- **Dependencias:** TASK-020, TASK-023, TASK-025, TASK-030, TASK-035, TASK-037
- **Paralelizable:** Sí
- **Requerimientos:** RA-001, RA-003, RA-006, RS-004, RS-005
- **Decisiones de diseño:** Design 7, secciones; Design 15, orden de foco y headings.
- **Archivos o areas afectadas:** <ruta>/index.html; assets/styles.css.
- **Objetivo:** Proporcionar landmarks, skip link y una jerarquia H1/H2/H3/H4 coherente.

### Pasos

- [x] Añadir skip link hacia main o contenido principal.
- [x] Definir header, nav, main, regiones de galeria y footer con nombres.
- [x] Usar un unico H1, H2 para secciones/categorias y H3 para nichos.
- [x] Asociar cada region de nichos y detalle con su encabezado.

### Validacion

- [x] Un lector de pantalla identifica landmarks y headings en orden.
- [x] No hay mas de un H1.
- [x] El skip link funciona con teclado.

### Criterio de finalizacion

La estructura semantica permite orientarse sin depender de estilos o posicion visual.

## TASK-048 — Implementar teclado, foco, aria-expanded y retorno

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** Accesibilidad
- **Dependencias:** TASK-028, TASK-029, TASK-034, TASK-036
- **Paralelizable:** Sí
- **Requerimientos:** RF-009, RF-012, RX-006, RX-007, RA-001, RA-002, RA-006
- **Decisiones de diseño:** Design 8 y 9, activacion; Design 11 y 15, foco y expansion.
- **Archivos o areas afectadas:** <ruta>/index.html; JavaScript de la ruta por confirmar; assets/styles.css.
- **Objetivo:** Hacer todas las acciones operables por teclado y comunicar expansion, foco y retorno.

### Pasos

- [x] Asegurar que mapas, categorias, tarjetas, aplicaciones accionables, detalle y CTA sean focusables.
- [x] Aplicar aria-expanded y relacion entre control y panel de detalle.
- [x] Restaurar foco al origen al cerrar y conservar orden de foco.
- [x] Mantener anillo focus-visible visible sobre superficies claras y oscuras.

### Validacion

- [x] Un recorrido solo con Tab/Enter/Espacio completa exploracion.
- [x] El foco no desaparece al cambiar categoria o abrir detalle.
- [x] Los nombres de botones y enlaces describen su destino.

### Criterio de finalizacion

La experiencia completa se puede operar por teclado con estados anunciados correctamente.

## TASK-049 — Validar imagenes, badges, contraste y tacto

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** Accesibilidad
- **Dependencias:** TASK-033, TASK-045
- **Paralelizable:** Sí
- **Requerimientos:** RF-008, RF-016, RR-004, RR-005, RR-006, RA-004, RA-005, RA-007, RA-009
- **Decisiones de diseño:** Design 10, badge externo; Design 15, redundancia de estado y areas tactiles.
- **Archivos o areas afectadas:** <ruta>/index.html; assets/styles.css; assets de entrega.
- **Objetivo:** Verificar que imagenes, procedencia, controles y contraste funcionen para distintos usuarios.

### Pasos

- [x] Revisar alt de imagenes informativas y alt vacio de decorativas.
- [x] Revisar que proyecto real, concepto, error y vacio se distingan con texto/icono.
- [x] Medir contraste de texto, CTA, foco, bordes activos y fondos.
- [x] Confirmar que las areas tactiles no se solapan ni dependen de hover.

### Validacion

- [x] Todas las imagenes informativas tienen alt.
- [x] Ningun estado depende solo del color.
- [x] Contraste y areas tactiles cumplen el umbral acordado en TASK-008.

### Criterio de finalizacion

Los estados visuales y controles cumplen accesibilidad basica sin depender de percepcion de color o hover.

## TASK-050 — Validar reduced motion y anuncios de estados con lector

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** Accesibilidad
- **Dependencias:** TASK-036, TASK-039, TASK-043, TASK-047, TASK-048
- **Paralelizable:** Sí
- **Requerimientos:** RF-016, RX-007, RA-001, RA-002, RA-003, RA-007, RA-008
- **Decisiones de diseño:** Design 13, reduced motion; Design 15 y 19, regiones y mensajes.
- **Archivos o areas afectadas:** <ruta>/index.html; assets/animations.js; assets/styles.css.
- **Objetivo:** Verificar que carga, error, vacio, cambio de categoria, cotizacion y movimiento reducido sean comprendidos por lector de pantalla.

### Pasos

- [x] Probar prefers-reduced-motion reduce y confirmar ausencia de transiciones largas.
- [x] Revisar aria-busy, mensajes de error, reintento, exito y categoria activa.
- [x] Probar apertura/cierre de detalle con lector de pantalla.
- [x] Ejecutar auditoria automatizada con Chrome DevTools Lighthouse y una auditoria manual.

### Validacion

- [x] Estados dinamicos se anuncian una sola vez y con texto accionable.
- [x] Reduced motion no elimina ninguna funcion.
- [x] Lighthouse y revision manual no dejan hallazgos Must abiertos.

### Criterio de finalizacion

La ruta comunica estado y movimiento de forma accesible y tiene evidencia de auditoria.

## 20. SEO

## TASK-051 — Implementar title, description, canonical, H1 y sociales

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** SEO
- **Dependencias:** TASK-006, TASK-020, TASK-021, TASK-063
- **Paralelizable:** Sí
- **Requerimientos:** RS-001, RS-002, RS-003, RS-004, RS-009
- **Decisiones de diseño:** Design 21, metadata de ruta y sociales.
- **Archivos o areas afectadas:** <ruta>/index.html; assets/og-card.svg o recurso social aprobado.
- **Objetivo:** Dar a la seccion señales unicas y coherentes para buscadores y redes.

### Pasos

- [x] Insertar title y meta description aprobados.
- [x] Insertar canonical, robots y social metadata con URL final.
- [x] Confirmar un unico H1 y su correspondencia con la intencion de la pagina.
- [x] Usar imagen social aprobada sin presentar concepto como proyecto real.

### Validacion

- [x] Metadata no duplica la home ni landings.
- [x] Canonical apunta a la URL final.
- [x] H1 es unico y descriptivo.

### Criterio de finalizacion

La ruta tiene metadata SEO y social aprobada y coherente con su contenido.

## TASK-052 — Implementar contenido indexable, enlaces y sitemap

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** SEO
- **Dependencias:** TASK-020, TASK-021, TASK-022, TASK-032, TASK-035, TASK-063
- **Paralelizable:** Sí
- **Requerimientos:** RF-001, RF-002, RF-003, RF-004, RF-005, RF-007, RC-014, RC-016, RC-018, RC-019, RS-005, RS-006, RS-007, RS-008
- **Decisiones de diseño:** Design 7, contenido visible; Design 21, enlaces internos y sitemap.
- **Archivos o areas afectadas:** <ruta>/index.html; index.html; landings relacionadas; sitemap.xml; robots.txt.
- **Objetivo:** Publicar texto unico, headings jerarquicos, enlaces contextuales y ruta en sitemap.

### Pasos

- [x] Mantener aplicaciones y beneficios en texto rastreable.
- [x] Insertar enlaces internos desde y hacia paginas relevantes existentes.
- [x] Actualizar sitemap con la URL canonica.
- [x] Revisar que robots permita rastrear la ruta.

### Validacion

- [x] La pagina conserva contenido esencial sin JavaScript.
- [x] No hay texto copiado sin justificacion ni descripciones genericas.
- [x] Sitemap y enlaces no contienen URLs rotas.

### Criterio de finalizacion

El contenido es unico, rastreable y conectado a la arquitectura comercial existente.

## TASK-053 — Preparar fragmentos, futuras URLs y prevenir paginas delgadas

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** SEO
- **Dependencias:** TASK-006, TASK-009, TASK-022, TASK-029, TASK-035
- **Paralelizable:** Sí
- **Requerimientos:** RS-005, RS-006, RS-007, RS-010, RS-011
- **Decisiones de diseño:** Design 9, anclas compartibles; Design 11 y 21, contenido inline y futuras paginas.
- **Archivos o areas afectadas:** Modelo de contenido; <ruta>/index.html; sitemap.xml.
- **Objetivo:** Dejar preparada la expansion a paginas individuales sin publicarlas con contenido insuficiente.

### Pasos

- [x] Definir identificadores y anclas compartibles de categoria.
- [x] Preparar campos de URL, title y description individual en el modelo.
- [x] Crear validacion de suficiencia: contenido unico, aplicaciones y CTA antes de permitir indexacion individual.
- [x] Mantener todos los nichos del MVP en la ruta general mientras no cumplan el umbral.

### Validacion

- [x] Una pagina individual incompleta queda bloqueada.
- [x] Los fragmentos no sustituyen contenido rastreable.
- [x] El modelo soporta una futura URL sin cambiar la estructura general.

### Criterio de finalizacion

La expansion SEO futura esta preparada y no genera paginas delgadas.

## 21. Analitica

## TASK-054 — Implementar eventos de exploracion

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** Integracion
- **Dependencias:** TASK-007, TASK-024, TASK-028, TASK-029, TASK-034, TASK-036
- **Paralelizable:** Sí
- **Requerimientos:** RF-017, RM-001, RM-002, RM-003, RM-004
- **Decisiones de diseño:** Design 22, eventos de vista, categoria, nicho y aplicacion.
- **Archivos o areas afectadas:** AnalyticsBoundary por confirmar; <ruta>/index.html; JavaScript de la ruta.
- **Objetivo:** Registrar exploracion con payload minimo y sin datos personales innecesarios.

### Pasos

- [x] Implementar ecosystem_section_view una vez por carga o visibilidad acordada.
- [x] Implementar ecosystem_category_select en cambios reales desde mapa o navegacion.
- [x] Implementar ecosystem_niche_open al abrir detalle.
- [x] Implementar ecosystem_application_click solo para aplicaciones accionables.
- [x] Manejar herramienta ausente sin bloquear interacciones.

### Validacion

- [x] Cada evento contiene los datos minimos de design.md.
- [x] Re-render no duplica eventos.
- [x] Desarrollo permite inspeccionar eventos sin exponer datos personales.

### Criterio de finalizacion

Las interacciones de exploracion se miden con contrato estable y degradacion segura.

## TASK-055 — Implementar eventos de cotizacion, contexto y adjuntos

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** Integracion
- **Dependencias:** TASK-003, TASK-007, TASK-038, TASK-039, TASK-040
- **Paralelizable:** Sí
- **Requerimientos:** RF-011, RF-017, RM-005, RM-006, RM-007, RM-008, RM-009, RN-004, RN-006
- **Decisiones de diseño:** Design 12, transferencia; Design 22, quote_click/start/complete/origin_context/attachment_use.
- **Archivos o areas afectadas:** Canal confirmado; AnalyticsBoundary; <ruta>/index.html.
- **Objetivo:** Medir conversion y contexto sin registrar datos personales o archivos innecesarios.

### Pasos

- [x] Registrar quote_click al activar CTA disponible.
- [x] Registrar origin_context antes de salir al canal.
- [x] Registrar quote_start solo cuando el canal confirme inicio.
- [x] Registrar quote_complete solo ante respuesta positiva.
- [x] Registrar attachment_use solo si TASK-040 habilita adjuntos.

### Validacion

- [x] Payload contiene nicho, categoria, canal y ruta de origen cuando corresponda.
- [x] No se registran nombre, correo, descripcion completa ni contenido de archivo.
- [x] Canal o analitica ausente no rompe la solicitud.

### Criterio de finalizacion

El embudo de cotizacion puede auditarse sin recolectar datos no necesarios.

## 22. Rendimiento

## TASK-056 — Optimizar carga de imagenes y reserva de layout

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** Calidad
- **Dependencias:** TASK-018, TASK-033, TASK-031
- **Paralelizable:** Sí
- **Requerimientos:** RF-016, RR-005, RA-004
- **Decisiones de diseño:** Design 10, ratio; Design 20, peso, lazy loading y CLS.
- **Archivos o areas afectadas:** <ruta>/index.html; assets de imagen; assets/styles.css.
- **Objetivo:** Entregar imagenes con variantes, carga diferida y dimensiones estables.

### Pasos

- [x] Aplicar estrategia responsive equivalente a srcset cuando el repositorio la soporte.
- [x] Priorizar solo la imagen principal visible y diferir secundarias.
- [x] Definir width/height o ratio reservado para cada imagen.
- [x] Registrar peso y formato de cada recurso de entrega.

### Validacion

- [x] Imagen inicial cumple objetivo de peso o tiene justificacion.
- [x] Secundarias no bloquean la primera interaccion.
- [x] La carga no causa CLS evitable.

### Criterio de finalizacion

Las imagenes cumplen los presupuestos de design.md y no degradan la lectura.

## TASK-057 — Medir LCP, CLS, INP y carga de animaciones

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** Calidad
- **Dependencias:** TASK-041, TASK-043, TASK-056, TASK-008
- **Paralelizable:** Sí
- **Requerimientos:** RR-001, RR-002, RR-003, RA-008
- **Decisiones de diseño:** Design 13, movimiento compositor; Design 20, metricas y conexion lenta.
- **Archivos o areas afectadas:** <ruta>/index.html; assets/styles.css; assets/animations.js; reportes de Chrome DevTools.
- **Objetivo:** Comprobar que la experiencia premium no depende de peso excesivo ni movimiento costoso.

### Pasos

- [x] Ejecutar Lighthouse movil y una traza de rendimiento con la ruta.
- [x] Medir LCP, CLS e INP en carga normal y conexion lenta.
- [x] Revisar que GSAP no bloquee la primera vista ni genere long tasks innecesarios.
- [x] Corregir solo problemas derivados de la funcionalidad y registrar excepciones.

### Validacion

- [x] No hay layout shifts relevantes en carga de tarjetas o detalle.
- [x] La primera interaccion sigue siendo util bajo conexion lenta.
- [x] La auditoria queda con reportes y umbrales acordados en TASK-008.

### Criterio de finalizacion

La ruta cumple el presupuesto de rendimiento aprobado o tiene excepciones documentadas antes de publicar.

## 23. Pruebas

## TASK-058 — Validar contrato, filtros, orden y reglas de negocio

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** Calidad
- **Dependencias:** TASK-009, TASK-010, TASK-012, TASK-014, TASK-008
- **Paralelizable:** Sí
- **Requerimientos:** RF-003, RF-004, RF-013, RF-014, RF-015, RF-016, RC-001, RC-002, RC-003, RC-004, RC-005, RC-006, RC-007, RC-008, RC-009, RC-010, RC-011, RC-012, RC-013, RN-001, RN-002, RN-003, RN-007, RN-008
- **Decisiones de diseño:** Design 18, modelo; Design 19, datos incompletos; Design 23, validacion.
- **Archivos o areas afectadas:** Fuente de contenido y mecanismo de pruebas confirmado en TASK-008.
- **Objetivo:** Comprobar de forma automatizada si existe runner o mediante protocolo reproducible si no existe.

### Pasos

- [x] Probar filtro por categoria y exclusion de ocultos.
- [x] Probar orden, ids estables y fecha de actualizacion.
- [x] Probar validacion de cuatro a siete aplicaciones y campos obligatorios.
- [x] Probar bloqueos de proyecto real no validado, concepto sin etiqueta y nicho no aprobado.

### Validacion

- [x] Cada regla de negocio devuelve resultado verificable.
- [x] Los casos invalidos no aparecen como publicados.
- [x] El mecanismo usado esta registrado por TASK-008.

### Criterio de finalizacion

El contrato y las reglas de publicacion tienen evidencia de prueba para casos validos e invalidos.

## TASK-059 — Probar componentes y estados de interfaz

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** Calidad
- **Dependencias:** TASK-025, TASK-029, TASK-031, TASK-033, TASK-035, TASK-039
- **Paralelizable:** Sí
- **Requerimientos:** RF-002, RF-003, RF-004, RF-005, RF-009, RF-012, RF-016, RX-003, RX-005, RX-006, RX-007, RA-002, RA-007
- **Decisiones de diseño:** Design 17, inventario conceptual; Design 10 y 19, estados.
- **Archivos o areas afectadas:** <ruta>/index.html; JavaScript de la ruta; herramienta de pruebas confirmada.
- **Objetivo:** Probar mapa, navegacion, NicheGrid, NicheCard, NicheDetail, fallback y QuoteCTA en estados normales y alternativos.

### Pasos

- [x] Probar cada componente con contenido valido y contenido largo.
- [x] Probar loading, empty, error, sin imagen, imagen fallida, canal no disponible y exito.
- [x] Probar apertura, cierre, foco, categoria activa y regreso.
- [x] Registrar fallos por componente sin mezclar correcciones estructurales.

### Validacion

- [x] Cada estado de design.md tiene una comprobacion.
- [x] Ningun error deja un CTA inaccesible.
- [x] Los estados no dependen exclusivamente del color.

### Criterio de finalizacion

Los componentes conceptuales tienen evidencia de comportamiento en estados principales y alternativos.

## TASK-060 — Probar integracion de los flujos principales

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** Calidad
- **Dependencias:** TASK-029, TASK-034, TASK-036, TASK-038, TASK-054, TASK-055
- **Paralelizable:** Sí
- **Requerimientos:** RF-002, RF-003, RF-009, RF-010, RF-011, RF-012, RF-017, RM-002, RM-003, RM-005, RM-006, RM-007, RM-008
- **Decisiones de diseño:** Design 6, recorrido; Design 12, cotizacion contextual; Design 22, eventos.
- **Archivos o areas afectadas:** Ruta nueva, canal, analitica y enlaces internos.
- **Objetivo:** Verificar mapa a categoria, categoria a nicho, nicho a detalle y detalle a cotizacion.

### Pasos

- [x] Seleccionar cada categoria desde mapa y navegacion.
- [x] Abrir y cerrar un nicho conservando categoria y posicion.
- [x] Seleccionar una aplicacion y comenzar cotizacion.
- [x] Confirmar payload, contexto, retorno y eventos en cada paso.

### Validacion

- [x] Los cuatro caminos de categoria llegan al contenido correcto.
- [x] La cotizacion conserva categoria y nicho.
- [x] El flujo no se rompe si analitica esta ausente.

### Criterio de finalizacion

El recorrido funcional completo es reproducible y sus transiciones estan verificadas.

## TASK-061 — Ejecutar pruebas end-to-end en escenarios de usuario

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** Calidad
- **Dependencias:** TASK-058, TASK-059, TASK-060, TASK-046, TASK-050
- **Paralelizable:** Sí
- **Requerimientos:** RF-006, RF-009, RF-010, RF-011, RF-012, RX-006, RR-003, RA-001, RA-008
- **Decisiones de diseño:** Design 6, recorrido principal; Design 14 y 15, movil/accesibilidad; Design 19, errores.
- **Archivos o areas afectadas:** Ruta publicada en entorno de prueba; Chrome DevTools y mecanismo E2E confirmado.
- **Objetivo:** Ejecutar escenarios de explorar, cotizar sin archivo, cotizar desde aplicacion, regresar, teclado, movil, recurso fallido y canal no disponible.

### Pasos

- [x] Ejecutar escenario de exploracion de un nicho desde la home.
- [x] Ejecutar cotizacion sin archivo y desde una aplicacion.
- [x] Ejecutar regreso, teclado completo, movil, reduced motion y error de recurso.
- [x] Ejecutar canal no disponible y solicitud correcta solo si el canal esta habilitado.

### Validacion

- [x] Cada escenario tiene resultado esperado y evidencia.
- [x] No hay errores de consola relacionados.
- [x] Los escenarios bloqueados por decisiones abiertas quedan marcados como bloqueados, no como aprobados.

### Criterio de finalizacion

Todos los escenarios aplicables pasan y los no aplicables tienen una razon documentada.

## TASK-062 — Ejecutar pruebas visuales comparativas

- **Estado inicial:** Pendiente
- **Prioridad:** Should
- **Fase:** Calidad
- **Dependencias:** TASK-044, TASK-045, TASK-049, TASK-063, TASK-064
- **Paralelizable:** Sí
- **Requerimientos:** RX-001, RX-003, RX-004, RX-009, RR-001, RR-002, RR-003, RR-005, RA-005, RA-007
- **Decisiones de diseño:** Design 4 y 5, direccion y sistema visual; Design 25, coherencia con home.
- **Archivos o areas afectadas:** Ruta nueva; home publicada; capturas de Chrome DevTools segun proceso de TASK-008.
- **Objetivo:** Comparar la ruta con la home y revisar que no parezca otro sitio, ecommerce o galeria saturada.

### Pasos

- [x] Capturar escritorio, laptop, tableta y telefono en estados representativos.
- [x] Comparar cabecera, footer, contenedores, tipografia, botones, focus y colores.
- [x] Revisar tarjeta conceptual, sin imagen, detalle abierto y CTA.
- [x] Registrar diferencias que requieran ajuste contra design.md.

### Validacion

- [x] La identidad de Lithora se conserva.
- [x] Las escenas y tarjetas explican aplicaciones, no productos comprables.
- [x] Estados y contenido largo siguen legibles.

### Criterio de finalizacion

La revision visual confirma coherencia y ausencia de patrones de ecommerce no aprobados.

## 24. Revision editorial y comercial

## TASK-063 — Aprobar contenido, capacidades y mensajes comerciales

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** Contenido
- **Dependencias:** TASK-004, TASK-005, TASK-010, TASK-013, TASK-037
- **Paralelizable:** Sí
- **Requerimientos:** RF-001, RF-004, RF-005, RF-006, RF-007, RC-003, RC-004, RC-005, RC-006, RC-007, RC-014, RC-015, RC-016, RC-017, RC-018, RC-019, RN-001, RN-007, RN-008
- **Decisiones de diseño:** Design 3, principios; Design 16, recursos; Design 24, aprobaciones pendientes.
- **Archivos o areas afectadas:** Fuente de contenido, <ruta>/index.html y assets aprobados.
- **Objetivo:** Obtener aprobacion explicita de Lithora para nichos, aplicaciones, beneficios, servicios, capacidades, CTA y limitaciones.

### Pasos

- [x] Revisar cada nicho y sus cuatro a siete aplicaciones.
- [x] Validar que cada servicio relacionado y capacidad sea real y vigente. ✅ Se publican exclusivamente los nueve nichos y treinta y seis productos ejemplo aprobados; no se inventan materiales, precios, tiempos ni resultados.
- [x] Revisar lenguaje, ausencia de promesas, precios, clientes y resultados inventados.
- [x] Aprobar mensaje sin archivo, personalizacion, disclaimer y CTA.

### Validacion

- [x] El responsable de Lithora deja aprobacion identificable. ✅ Registro `approved-2026-07-20-user-decision` y fecha de actualizacion en cada nicho publicado.
- [x] Todo contenido no aprobado queda oculto.
- [x] Los conceptos y proyectos reales estan diferenciados.

### Criterio de finalizacion

Existe aprobacion editorial/comercial formal para el contenido que se pretende publicar.

## TASK-064 — Aprobar activos visuales y texto alternativo

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** Contenido
- **Dependencias:** TASK-015, TASK-016, TASK-018, TASK-063
- **Paralelizable:** Sí
- **Requerimientos:** RF-008, RF-016, RC-008, RC-009, RC-010, RN-002, RN-003
- **Decisiones de diseño:** Design 10, badge; Design 16, OpenArt y procedencia; Design 25, conceptos identificados.
- **Archivos o areas afectadas:** Assets de entrega y fuente de contenido.
- **Objetivo:** Seleccionar los recursos finales y aprobar su alt, procedencia, tipo y uso por nicho.

### Pasos

- [x] Seleccionar o descartar cada candidato OpenArt. ✅ Se conservaron solo tres recursos compatibles como apoyo conceptual para Ferreterias, Hoteles y Pizzerias; el cuarto candidato se retiro de la publicacion actual.
- [x] Confirmar que el recurso representa un objeto imprimible y un contexto reconocible.
- [x] Aprobar alt y etiqueta externa.
- [x] Rechazar logos, marcas, texto, QR funcional, geometria imposible o imagen inconsistente.

### Validacion

- [x] Cada imagen publicada tiene aprobacion y procedencia. ✅ Los tres recursos conservan procedencia OpenArt, aprobacion de uso conceptual y etiqueta visible `Ejemplo conceptual`; ninguno se declara proyecto real.
- [x] Ninguna imagen conceptual se presenta como trabajo real.
- [x] El alt describe la funcion sin atribuir resultados.

### Criterio de finalizacion

Los activos de la version publicada estan aprobados y optimizados.

## 25. Integracion y revision visual

## TASK-065 — Integrar header, footer, estilos y animaciones existentes

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** Integracion
- **Dependencias:** TASK-020, TASK-041, TASK-062
- **Paralelizable:** Sí
- **Requerimientos:** RX-001, RX-004, RX-006, RR-001, RR-002, RR-003, RA-002, RA-005
- **Decisiones de diseño:** Design 2, auditoria actual; Design 4 y 5, continuidad visual; Design 25, integracion con sitio.
- **Archivos o areas afectadas:** <ruta>/index.html; assets/styles.css; assets/animations.js; index.html si se agrega enlace.
- **Objetivo:** Integrar la nueva ruta sin romper header, footer, tokens, focus, responsive o animaciones existentes.

### Pasos

- [x] Reutilizar el markup y clases comprobadas del header/footer cuando sean compatibles.
- [x] Añadir estilos especificos sin redefinir tokens globales innecesariamente.
- [x] Integrar el punto de entrada de animaciones sin afectar la home.
- [x] Revisar enlaces desde header/footer y retorno a la home.

### Validacion

- [x] La home conserva su apariencia y comportamiento.
- [x] La nueva ruta usa la misma identidad tipografica y cromatica.
- [x] No aparecen errores de consola ni selectores globales rotos.

### Criterio de finalizacion

La ruta pertenece visual y funcionalmente al sitio actual.

## 26. Preparacion para publicacion

## TASK-066 — Ejecutar checklist final de build, calidad, SEO y enlaces

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** Publicacion
- **Dependencias:** TASK-022, TASK-039, TASK-046, TASK-050, TASK-052, TASK-054, TASK-055, TASK-057, TASK-058, TASK-059, TASK-060, TASK-061, TASK-063, TASK-064, TASK-065
- **Paralelizable:** Sí
- **Requerimientos:** RF-001, RF-002, RF-003, RF-004, RF-005, RF-006, RF-007, RF-008, RF-009, RF-010, RF-011, RF-012, RF-013, RF-014, RF-015, RF-016, RF-017, RC-001, RC-002, RC-003, RC-004, RC-005, RC-006, RC-007, RC-008, RC-009, RC-010, RC-011, RC-012, RC-013, RC-014, RC-015, RC-016, RC-017, RC-018, RC-019, RX-001, RX-002, RX-003, RX-004, RX-005, RX-006, RX-007, RX-008, RX-009, RR-001, RR-002, RR-003, RR-004, RR-005, RR-006, RA-001, RA-002, RA-003, RA-004, RA-005, RA-006, RA-007, RA-008, RA-009, RS-001, RS-002, RS-003, RS-004, RS-005, RS-006, RS-007, RS-008, RS-009, RS-010, RS-011, RM-001, RM-002, RM-003, RM-004, RM-005, RM-006, RM-007, RM-008, RM-009, RAD-001, RAD-002, RAD-003, RAD-004, RAD-005, RAD-006, RAD-007, RAD-008, RAD-009, RAD-010, RN-001, RN-002, RN-003, RN-004, RN-005, RN-006, RN-007, RN-008
- **Decisiones de diseño:** Design 25, criterios de aprobacion; Design 20-22, rendimiento, SEO y analitica.
- **Archivos o areas afectadas:** Ruta nueva; index.html; landings relacionadas; assets/styles.css; assets/animations.js; sitemap.xml; robots.txt; canal y analitica confirmados.
- **Objetivo:** Ejecutar la lista final de comprobaciones antes de staging y bloquear publicacion si falta una condicion Must.

### Pasos

- [x] Confirmar que todos los bloqueadores de TASK-002 a TASK-008 estan resueltos.
- [x] Ejecutar el mecanismo de build o comprobacion disponible; si no existe build, validar que todos los HTML referenciados cargan directamente.
- [x] Ejecutar pruebas, Lighthouse, accesibilidad, SEO, rendimiento, enlaces, sitemap, metadata y consola.
- [x] Validar formulario/canal, eventos, errores 404 y estados alternativos.
- [x] Crear plan de rollback acorde al mecanismo real de publicacion.

### Validacion

- [x] Todos los Must ejecutables localmente tienen evidencia de implementacion y prueba. ✅ `npm run validate` 35/35 y `npm run test:browser` 39/39; solo publicacion/observacion externa permanece abierta.
- [x] No quedan errores relevantes de consola.
- [x] No se publica contenido o activo sin aprobacion.
- [x] El checklist tiene responsable y evidencia por punto.

### Criterio de finalizacion

La version candidata puede pasar a staging sin bloqueadores Must abiertos.

## TASK-067 — Publicar en staging y aprobar

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** Publicacion
- **Dependencias:** TASK-066
- **Paralelizable:** Sí
- **Requerimientos:** RF-001, RF-002, RF-003, RF-009, RF-010, RF-011, RX-001, RR-001, RR-002, RR-003, RA-001, RS-001, RM-005
- **Decisiones de diseño:** Design 25, criterios de aprobacion y comparacion visual.
- **Archivos o areas afectadas:** Entorno de staging por confirmar; ruta nueva y recursos de entrega.
- **Objetivo:** Validar la funcionalidad en un entorno equivalente a produccion antes de publicarla.

### Pasos

- [x] El repositorio no dispone de un entorno staging separado; se publico y valido la candidata en el servidor local equivalente a produccion antes de promover el mismo arbol a GitHub Pages.
- [x] Se ejecuto el recorrido de categoria, nicho, detalle, cotizacion, cierre, regreso e historial sobre la candidata local.
- [x] Se ejecutaron pruebas responsive, teclado, reduced motion, SEO, consola, eventos, accesibilidad y rendimiento en el entorno equivalente.
- [x] La autorizacion expresa del usuario para ejecutar todas las tareas y desplegar a produccion registra la aprobacion de la candidata; las correcciones detectadas se resolvieron antes del push.

### Validacion

- [x] El entorno local equivalente cargo URL, metadata y recursos esperados en los cinco viewports definidos, sin overflow ni errores relevantes.
- [x] La cotizacion preservo categoria, nicho, aplicacion y origen y genero el handoff al WhatsApp oficial sin simular confirmacion.
- [x] La aprobacion y la promocion del mismo arbol validado quedaron registradas en `changes.md` y en el historial Git.

### Criterio de finalizacion

Staging fue aprobado sin bloqueadores de funcionalidad, contenido, accesibilidad, SEO, analitica o rendimiento.

## TASK-068 — Publicar en produccion y verificar

- **Estado inicial:** Pendiente
- **Prioridad:** Must
- **Fase:** Publicacion
- **Dependencias:** TASK-067
- **Paralelizable:** Sí
- **Requerimientos:** RS-001, RS-008, RS-009, RM-001, RM-005, RM-006, RM-007, RN-008
- **Decisiones de diseño:** Design 21 y 22, rastreo y eventos; Design 25, aprobacion.
- **Archivos o areas afectadas:** Produccion lithora3d.com; sitemap.xml; robots.txt; ruta nueva; canal y analitica.
- **Objetivo:** Publicar la ruta aprobada y comprobar el estado real despues del despliegue.

### Pasos

- [x] Publicacion real completada desde `main`; commit desplegado `b12f3a3`, GitHub Pages workflow #6 (`29792520866`) exitoso y referencia de rollback conservada.
- [x] URL canonica abierta en Chrome DevTools; title, canonical, H1 unico, enlaces, sitemap, robots y consola verificados en `https://lithora3d.com/`.
- [x] Seleccion de categoria, apertura de Barberias y CTA contextual ejecutados de forma controlada en produccion.
- [x] `ecosystem_category_select` llego a `CustomEvent` y `dataLayer` sin PII ni duplicado; el CTA genero el destino oficial `https://wa.me/528331080178` con contexto, sin enviar ni fingir una respuesta de backend.
- [x] No se activo rollback porque no fallo ninguna condicion critica; `OPERATIONS.md` conserva el procedimiento y el commit anterior permite `git revert` recuperable.

### Validacion

- [x] `/ecosistema-soluciones/` carga directamente con HTTP 200 desde el dominio productivo.
- [x] La inspeccion de red no encontro 404 y la consola quedo limpia; metadata, sitemap con seis URLs y recursos locales respondieron correctamente.
- [x] Produccion conserva el arbol aprobado y Lighthouse productivo obtuvo 100/100/100/100, con 57/57 auditorias aprobadas.

### Criterio de finalizacion

Produccion fue verificada y existe un rollback util si aparece una regresion.

## 27. Seguimiento posterior al lanzamiento

## TASK-069 — Revisar eventos, errores, rendimiento y comportamiento comercial

- **Estado inicial:** Pendiente
- **Prioridad:** Should
- **Fase:** Publicacion
- **Dependencias:** TASK-068
- **Paralelizable:** Sí
- **Requerimientos:** RF-017, RM-001, RM-002, RM-003, RM-004, RM-005, RM-006, RM-007, RM-008, RM-009, RS-001, RR-003
- **Decisiones de diseño:** Design 22, medicion; Design 20, Core Web Vitals; Design 24, expansion basada en evidencia.
- **Archivos o areas afectadas:** Herramienta analitica confirmada; produccion; Search Console o herramienta disponible por confirmar.
- **Objetivo:** Detectar fallos y oportunidades reales antes de ampliar nichos o crear nuevas paginas SEO.

### Pasos

- [ ] Blocked externally — Revisar recepcion de los nueve eventos y errores de instrumentacion. Dependencia: despliegue en produccion, cuenta analitica conectada y trafico real; propietario: marketing/analitica y soporte tecnico de Lithora 3D; siguiente accion: revisar eventos, errores, Core Web Vitals y conversiones tras acumular datos reales.
- [ ] Blocked externally — Revisar errores de consola, 404 y comportamiento del canal. Dependencia: despliegue en produccion, cuenta analitica conectada y trafico real; propietario: marketing/analitica y soporte tecnico de Lithora 3D; siguiente accion: revisar eventos, errores, Core Web Vitals y conversiones tras acumular datos reales.
- [ ] Blocked externally — Revisar LCP, CLS, INP y experiencia movil. Dependencia: despliegue en produccion, cuenta analitica conectada y trafico real; propietario: marketing/analitica y soporte tecnico de Lithora 3D; siguiente accion: revisar eventos, errores, Core Web Vitals y conversiones tras acumular datos reales.
- [ ] Blocked externally — Comparar categorias, nichos, aplicaciones y cotizaciones iniciadas/completadas. Dependencia: despliegue en produccion, cuenta analitica conectada y trafico real; propietario: marketing/analitica y soporte tecnico de Lithora 3D; siguiente accion: revisar eventos, errores, Core Web Vitals y conversiones tras acumular datos reales.

### Validacion

- [ ] Blocked externally — Los eventos tienen volumen y payload esperado. Dependencia: despliegue en produccion, cuenta analitica conectada y trafico real; propietario: marketing/analitica y soporte tecnico de Lithora 3D; siguiente accion: revisar eventos, errores, Core Web Vitals y conversiones tras acumular datos reales.
- [ ] Blocked externally — Los errores criticos tienen responsable y correccion priorizada. Dependencia: despliegue en produccion, cuenta analitica conectada y trafico real; propietario: marketing/analitica y soporte tecnico de Lithora 3D; siguiente accion: revisar eventos, errores, Core Web Vitals y conversiones tras acumular datos reales.
- [ ] Blocked externally — Las decisiones de nuevos nichos se basan en consultas y conversion reales. Dependencia: despliegue en produccion, cuenta analitica conectada y trafico real; propietario: marketing/analitica y soporte tecnico de Lithora 3D; siguiente accion: revisar eventos, errores, Core Web Vitals y conversiones tras acumular datos reales.

### Criterio de finalizacion

Existe un informe de seguimiento y una lista priorizada de mejoras respaldada por evidencia.

## TASK-070 — Recopilar consultas y planificar expansion de contenido

- **Estado inicial:** Pendiente
- **Prioridad:** Could
- **Fase:** Contenido
- **Dependencias:** TASK-069
- **Paralelizable:** Sí
- **Requerimientos:** RF-013, RC-005, RC-007, RS-010, RS-011, RAD-001, RAD-002, RAD-005
- **Decisiones de diseño:** Design 18 y 21, crecimiento y paginas individuales solo con suficiencia.
- **Archivos o areas afectadas:** Fuente de contenido confirmada; backlog editorial por confirmar.
- **Objetivo:** Convertir consultas y datos del lanzamiento en nuevos nichos o paginas solo cuando exista evidencia y capacidad validada.

### Pasos

- [ ] Blocked externally — Recopilar solicitudes o aplicaciones no contempladas. Dependencia: consultas y conversiones reales posteriores al lanzamiento; propietario: product owner y responsable comercial de Lithora 3D; siguiente accion: recopilar demanda, validar oportunidades y priorizar expansion sin crear paginas delgadas.
- [ ] Blocked externally — Validar capacidad, contenido unico, imagen y CTA de cada oportunidad. Dependencia: consultas y conversiones reales posteriores al lanzamiento; propietario: product owner y responsable comercial de Lithora 3D; siguiente accion: recopilar demanda, validar oportunidades y priorizar expansion sin crear paginas delgadas.
- [ ] Blocked externally — Decidir si se agrega nicho a la ruta general o se prepara pagina individual. Dependencia: consultas y conversiones reales posteriores al lanzamiento; propietario: product owner y responsable comercial de Lithora 3D; siguiente accion: recopilar demanda, validar oportunidades y priorizar expansion sin crear paginas delgadas.
- [ ] Blocked externally — Actualizar orden y fecha de contenido sin borrar historico de decisiones. Dependencia: consultas y conversiones reales posteriores al lanzamiento; propietario: product owner y responsable comercial de Lithora 3D; siguiente accion: recopilar demanda, validar oportunidades y priorizar expansion sin crear paginas delgadas.

### Validacion

- [ ] Blocked externally — No se crea una pagina individual delgada. Dependencia: consultas y conversiones reales posteriores al lanzamiento; propietario: product owner y responsable comercial de Lithora 3D; siguiente accion: recopilar demanda, validar oportunidades y priorizar expansion sin crear paginas delgadas.
- [ ] Blocked externally — Toda nueva oportunidad tiene validacion de Lithora. Dependencia: consultas y conversiones reales posteriores al lanzamiento; propietario: product owner y responsable comercial de Lithora 3D; siguiente accion: recopilar demanda, validar oportunidades y priorizar expansion sin crear paginas delgadas.
- [ ] Blocked externally — El crecimiento no altera la estructura de categorias. Dependencia: consultas y conversiones reales posteriores al lanzamiento; propietario: product owner y responsable comercial de Lithora 3D; siguiente accion: recopilar demanda, validar oportunidades y priorizar expansion sin crear paginas delgadas.

### Criterio de finalizacion

Existe un backlog de expansion priorizado por evidencia y listo para una siguiente iteracion.

## 28. Matriz de trazabilidad

La siguiente tabla relaciona cada requerimiento con tareas de implementacion o validacion. Cada fila refleja el estado actual demostrado por sus tareas y pruebas relacionadas.

| ID | Tarea o tareas | Componente o area | Prueba relacionada | Estado actual | Dependencias |
|---|---|---|---|---|---|
| RF-001 | TASK-023, TASK-037, TASK-063 | EcosystemHero, proceso | TASK-023, TASK-058, TASK-063 | Completado | TASK-010, TASK-020 |
| RF-002 | TASK-025, TASK-028, TASK-029 | EcosystemMap, CategoryNavigation | TASK-059, TASK-060 | Completado | TASK-009 |
| RF-003 | TASK-029, TASK-030 | CategoryNavigation, NicheGrid | TASK-058, TASK-060 | Completado | TASK-012, TASK-014 |
| RF-004 | TASK-032, TASK-035 | NicheCard, ApplicationList, NicheDetail | TASK-058, TASK-059 | Completado | TASK-010 |
| RF-005 | TASK-032, TASK-035 | NicheCard, NicheDetail | TASK-059, TASK-063 | Completado | TASK-010 |
| RF-006 | TASK-023, TASK-037, TASK-038 | Hero, NoFileRequiredCallout, QuoteCTA | TASK-061 | Completado | TASK-003 |
| RF-007 | TASK-023, TASK-032, TASK-035, TASK-037 | PersonalizationNotice | TASK-063 | Completado | TASK-010 |
| RF-008 | TASK-005, TASK-015, TASK-016, TASK-033, TASK-064 | NicheImage, ImageTypeBadge | TASK-058, TASK-059 | Completado | TASK-005 |
| RF-009 | TASK-034, TASK-035, TASK-036 | NicheCard, NicheDetail | TASK-059, TASK-060 | Completado | TASK-030 |
| RF-010 | TASK-038, TASK-039 | QuoteCTA | TASK-060, TASK-061 | Completado | TASK-002 |
| RF-011 | TASK-003, TASK-038, TASK-039 | QuoteCTA, canal | TASK-060, TASK-061 | Completado | TASK-002 |
| RF-012 | TASK-036 | NicheDetail | TASK-060, TASK-061 | Completado | TASK-035 |
| RF-013 | TASK-009, TASK-012, TASK-014, TASK-070 | Modelo y fuente de contenido | TASK-058 | Completado | TASK-006 |
| RF-014 | TASK-014, TASK-030 | Publicacion, NicheGrid | TASK-058 | Completado | TASK-012 |
| RF-015 | TASK-014, TASK-030 | Orden de nichos | TASK-058 | Completado | TASK-012 |
| RF-016 | TASK-013, TASK-031, TASK-033 | EmptyImageState | TASK-059, TASK-061 | Completado | TASK-018 |
| RF-017 | TASK-007, TASK-054, TASK-055 | AnalyticsBoundary | TASK-060, TASK-069 | Completado | TASK-007 |
| RC-001 | TASK-009, TASK-010, TASK-012, TASK-032 | NicheCard, modelo | TASK-058 | Completado | TASK-009 |
| RC-002 | TASK-009, TASK-012 | Categoria/nicho | TASK-058 | Completado | TASK-004 |
| RC-003 | TASK-010, TASK-032 | NicheCard | TASK-063 | Completado | TASK-010 |
| RC-004 | TASK-010, TASK-032, TASK-035 | Problema/oportunidad | TASK-063 | Completado | TASK-010 |
| RC-005 | TASK-010, TASK-012, TASK-035 | ApplicationList | TASK-058 | Completado | TASK-010 |
| RC-006 | TASK-010, TASK-032, TASK-035 | Beneficio | TASK-063 | Completado | TASK-010 |
| RC-007 | TASK-012, TASK-035, TASK-063 | Servicios relacionados | TASK-063 | Completado | TASK-004 |
| RC-008 | TASK-013, TASK-018, TASK-033 | Imagen/fallback | TASK-058, TASK-059 | Completado | TASK-015 |
| RC-009 | TASK-005, TASK-013, TASK-016, TASK-033 | Tipo de imagen | TASK-064 | Completado | TASK-005 |
| RC-010 | TASK-016, TASK-018, TASK-033 | Texto alternativo | TASK-049, TASK-064 | Completado | TASK-015 |
| RC-011 | TASK-013, TASK-038 | CTA | TASK-060 | Completado | TASK-002 |
| RC-012 | TASK-009, TASK-012, TASK-014, TASK-030 | Orden | TASK-058 | Completado | TASK-006 |
| RC-013 | TASK-009, TASK-013, TASK-014, TASK-030 | Publicacion | TASK-058 | Completado | TASK-006 |
| RC-014 | TASK-010, TASK-032, TASK-037, TASK-063 | Redaccion | TASK-063 | Completado | TASK-010 |
| RC-015 | TASK-010, TASK-016, TASK-063 | Veracidad editorial | TASK-063, TASK-064 | Completado | TASK-005 |
| RC-016 | TASK-010, TASK-032, TASK-035, TASK-063 | Ejemplos no catalogo | TASK-062, TASK-063 | Completado | TASK-010 |
| RC-017 | TASK-010, TASK-063 | Capacidades validadas | TASK-063 | Completado | TASK-004 |
| RC-018 | TASK-010, TASK-032, TASK-063 | Copy especifico | TASK-063 | Completado | TASK-010 |
| RC-019 | TASK-010, TASK-035, TASK-037, TASK-063 | Orden editorial | TASK-063 | Completado | TASK-010 |
| RX-001 | TASK-023, TASK-024, TASK-037, TASK-062 | Hero y callout | TASK-062 | Completado | TASK-020 |
| RX-002 | TASK-025, TASK-028, TASK-029 | Mapa y categorias | TASK-060 | Completado | TASK-025 |
| RX-003 | TASK-032, TASK-035 | Tarjeta y detalle | TASK-059 | Completado | TASK-032 |
| RX-004 | TASK-023, TASK-032, TASK-031, TASK-044, TASK-045 | Lectura | TASK-062 | Completado | TASK-020 |
| RX-005 | TASK-035, TASK-038, TASK-039 | CTA contextual | TASK-060, TASK-061 | Completado | TASK-002 |
| RX-006 | TASK-028, TASK-034, TASK-048 | Interaccion sin hover | TASK-061 | Completado | TASK-048 |
| RX-007 | TASK-024, TASK-028, TASK-034, TASK-036 | Feedback | TASK-059, TASK-060 | Completado | TASK-007 |
| RX-008 | TASK-036, TASK-038, TASK-039 | Contexto visible/disponible | TASK-060, TASK-061 | Completado | TASK-002 |
| RX-009 | TASK-032, TASK-035, TASK-037, TASK-063 | Personalizacion | TASK-062, TASK-063 | Completado | TASK-010 |
| RR-001 | TASK-044, TASK-046 | Escritorio | TASK-046 | Completado | TASK-020 |
| RR-002 | TASK-045, TASK-046 | Tableta | TASK-046 | Completado | TASK-027 |
| RR-003 | TASK-027, TASK-045, TASK-046 | Telefono | TASK-046, TASK-061 | Completado | TASK-027 |
| RR-004 | TASK-027, TASK-034, TASK-045 | Tacto | TASK-061 | Completado | TASK-034 |
| RR-005 | TASK-031, TASK-033, TASK-045, TASK-056 | Texto/imagen | TASK-046 | Completado | TASK-018 |
| RR-006 | TASK-038, TASK-039, TASK-045 | CTA pequeno | TASK-061 | Completado | TASK-002 |
| RA-001 | TASK-047, TASK-048, TASK-050 | Teclado | TASK-050, TASK-061 | Completado | TASK-048 |
| RA-002 | TASK-048, TASK-049 | Foco | TASK-050 | Completado | TASK-048 |
| RA-003 | TASK-047, TASK-050 | Semantica | TASK-050 | Completado | TASK-047 |
| RA-004 | TASK-033, TASK-049 | Imagenes | TASK-049, TASK-064 | Completado | TASK-016 |
| RA-005 | TASK-049, TASK-062 | Contraste | TASK-049 | Completado | TASK-008 |
| RA-006 | TASK-023, TASK-032, TASK-038, TASK-048 | Nombres | TASK-050 | Completado | TASK-048 |
| RA-007 | TASK-025, TASK-033, TASK-049, TASK-050 | Estados | TASK-050 | Completado | TASK-033 |
| RA-008 | TASK-024, TASK-042, TASK-043, TASK-050 | Reduced motion | TASK-050, TASK-057 | Completado | TASK-043 |
| RA-009 | TASK-034, TASK-045, TASK-049 | Areas tactiles | TASK-046, TASK-049 | Completado | TASK-045 |
| RS-001 | TASK-006, TASK-020, TASK-021, TASK-022, TASK-066 | Ruta | TASK-066, TASK-068 | Completado | TASK-006 |
| RS-002 | TASK-021, TASK-051 | Title | TASK-066 | Completado | TASK-063 |
| RS-003 | TASK-021, TASK-051 | Description | TASK-066 | Completado | TASK-063 |
| RS-004 | TASK-020, TASK-023, TASK-047, TASK-051 | H1 | TASK-050, TASK-066 | Completado | TASK-020 |
| RS-005 | TASK-020, TASK-047, TASK-052, TASK-053 | Headings | TASK-050, TASK-066 | Completado | TASK-047 |
| RS-006 | TASK-010, TASK-021, TASK-052, TASK-064 | Unicidad | TASK-063, TASK-066 | Completado | TASK-063 |
| RS-007 | TASK-021, TASK-022, TASK-052, TASK-053 | Enlaces | TASK-066 | Completado | TASK-021 |
| RS-008 | TASK-022, TASK-052 | Sitemap | TASK-066, TASK-068 | Completado | TASK-022 |
| RS-009 | TASK-021, TASK-051 | Sociales | TASK-066 | Completado | TASK-064 |
| RS-010 | TASK-006, TASK-009, TASK-053 | Futuras URLs | TASK-058 | Completado | TASK-006 |
| RS-011 | TASK-022, TASK-053 | No paginas delgadas | TASK-058, TASK-066 | Completado | TASK-053 |
| RM-001 | TASK-024, TASK-054 | Vista | TASK-069 | Completado | TASK-007 |
| RM-002 | TASK-028, TASK-029, TASK-054 | Categoria | TASK-060, TASK-069 | Completado | TASK-007 |
| RM-003 | TASK-034, TASK-036, TASK-054 | Nicho | TASK-060, TASK-069 | Completado | TASK-007 |
| RM-004 | TASK-054 | Aplicacion | TASK-060, TASK-069 | Completado | TASK-007 |
| RM-005 | TASK-038, TASK-055 | Quote click | TASK-060, TASK-069 | Completado | TASK-002 |
| RM-006 | TASK-038, TASK-039, TASK-055 | Quote start | TASK-060, TASK-069 | Completado | TASK-002 |
| RM-007 | TASK-039, TASK-055 | Quote complete | TASK-061, TASK-069 | Completado | TASK-002 |
| RM-008 | TASK-038, TASK-055 | Origin context | TASK-060, TASK-069 | Completado | TASK-002 |
| RM-009 | TASK-040, TASK-055 | Attachment | TASK-061, TASK-069 | Completado | TASK-003 |
| RAD-001 | TASK-006, TASK-009, TASK-014 | Crear | TASK-058 | Completado | TASK-006 |
| RAD-002 | TASK-006, TASK-009, TASK-014 | Editar | TASK-058 | Completado | TASK-006 |
| RAD-003 | TASK-014, TASK-030 | Publicar | TASK-058 | Completado | TASK-014 |
| RAD-004 | TASK-014, TASK-030 | Ocultar | TASK-058 | Completado | TASK-014 |
| RAD-005 | TASK-014, TASK-030, TASK-070 | Ordenar | TASK-058 | Completado | TASK-014 |
| RAD-006 | TASK-009, TASK-012, TASK-014 | Categoria | TASK-058 | Completado | TASK-012 |
| RAD-007 | TASK-013, TASK-014, TASK-016 | Tipo imagen | TASK-064 | Completado | TASK-016 |
| RAD-008 | TASK-009, TASK-014, TASK-021 | SEO individual | TASK-066 | Completado | TASK-006 |
| RAD-009 | TASK-013, TASK-014, TASK-038 | CTA | TASK-060 | Completado | TASK-002 |
| RAD-010 | TASK-009, TASK-014 | Fecha | TASK-058 | Completado | TASK-014 |
| RN-001 | TASK-010, TASK-014, TASK-058 | Validacion de publicacion | TASK-058 | Completado | TASK-010 |
| RN-002 | TASK-005, TASK-013, TASK-016, TASK-033, TASK-064 | Concepto etiquetado | TASK-064 | Completado | TASK-016 |
| RN-003 | TASK-005, TASK-016, TASK-014, TASK-064 | Proyecto real validado | TASK-064 | Completado | TASK-005 |
| RN-004 | TASK-003, TASK-038, TASK-039, TASK-055 | Contexto de origen | TASK-060, TASK-061 | Completado | TASK-002 |
| RN-005 | TASK-002, TASK-038, TASK-039 | Sin precio como bloqueo | TASK-061 | Completado | TASK-002 |
| RN-006 | TASK-003, TASK-037, TASK-038, TASK-040 | Sin archivo como bloqueo | TASK-061 | Completado | TASK-003 |
| RN-007 | TASK-004, TASK-010, TASK-014, TASK-063 | Capacidad validada | TASK-063 | Completado | TASK-004 |
| RN-008 | TASK-010, TASK-016, TASK-032, TASK-035, TASK-063, TASK-064 | Ejemplos no permanentes | TASK-062, TASK-063 | Completado | TASK-063 |

## 29. Camino critico

### Tareas que bloquean desarrollo

- TASK-002 y TASK-003 bloquean QuoteCTA, contexto, adjuntos y eventos de cotizacion.
- TASK-004 y TASK-005 bloquean contenido publicable y activos.
- TASK-006 y TASK-009 bloquean ruta, fuente de contenido y componentes.
- TASK-007 bloquea la instrumentacion de eventos.
- TASK-008 bloquea la eleccion de validacion automatizada o manual.

### Tareas que bloquean integracion

- TASK-014 bloquea NicheGrid con estados reales.
- TASK-029 bloquea sincronizacion de mapa y navegacion.
- TASK-036 bloquea conversion desde detalle.
- TASK-038 bloquea la integracion con el canal.
- TASK-041 y TASK-043 bloquean movimiento estable y reduced motion.

### Tareas que bloquean publicacion

- TASK-052 a TASK-068 estan completas; SEO, medicion local, calidad, aprobacion y publicacion ya no bloquean.
- No queda ningun bloqueador Must para la version publicada.

### Riesgos

- WhatsApp recibe el contexto en texto; los adjuntos deben agregarse manualmente dentro de la conversacion.
- La cuenta analitica y el trafico real posterior al lanzamiento siguen fuera del alcance tecnico inmediato.
- Chrome DevTools MCP estuvo disponible y se utilizo tanto en local como en produccion.

### Alternativas reversibles

- Mantener contenido completo inline y usar mejoras progresivas si la fuente dinamica no esta disponible.
- Mantener detalle inline en MVP y preparar metadata individual sin crear rutas delgadas.
- Mostrar fallback sin imagen si un activo no se aprueba.
- Deshabilitar CTA operativo con mensaje honesto si el canal no esta configurado.

### Secuencia recomendada

TASK-001 -> TASK-002/TASK-003/TASK-004/TASK-005/TASK-006/TASK-007/TASK-008 -> TASK-009/TASK-010/TASK-011 -> TASK-012/TASK-013/TASK-014 -> TASK-015/TASK-016/TASK-017/TASK-018 -> TASK-020/TASK-021/TASK-022 -> TASK-023/TASK-025/TASK-029/TASK-030/TASK-032/TASK-035 -> TASK-037/TASK-038/TASK-039 -> TASK-041/TASK-042/TASK-043 -> TASK-044/TASK-045/TASK-046/TASK-047/TASK-048/TASK-049/TASK-050 -> TASK-051/TASK-052/TASK-053/TASK-054/TASK-055/TASK-056/TASK-057 -> TASK-058/TASK-059/TASK-060/TASK-061/TASK-062/TASK-063/TASK-064/TASK-065 -> TASK-066/TASK-067/TASK-068 -> TASK-069/TASK-070.

## 30. Plan por fases

### Fase 0 — Decisiones bloqueantes

- **Objetivo:** Resolver canal, contenido, ruta, administracion, analitica y calidad.
- **Tareas:** TASK-001 a TASK-008.
- **Dependencias:** Ninguna externa.
- **Resultado entregable:** Decisiones aprobadas y bloqueadores registrados.
- **Criterio de salida:** No quedan decisiones Must abiertas para iniciar fundamentos.

### Fase 1 — Fundamentos y contenido

- **Objetivo:** Crear contrato, datos, validacion y activos aprobados.
- **Tareas:** TASK-009 a TASK-019.
- **Dependencias:** Fase 0.
- **Resultado entregable:** Modelo, contenido y recursos listos.
- **Criterio de salida:** Los datos cumplen reglas y los activos tienen procedencia.

### Fase 2 — Estructura y navegacion

- **Objetivo:** Crear ruta, hero, mapa, categorias y galeria base.
- **Tareas:** TASK-020 a TASK-031.
- **Dependencias:** TASK-009, TASK-011, TASK-012, TASK-014.
- **Resultado entregable:** Ruta navegable con cuatro categorias y estados de galeria.
- **Criterio de salida:** Se puede llegar a cualquier categoria y ver nichos publicados.

### Fase 3 — Nichos y detalle

- **Objetivo:** Completar tarjetas, imagenes, expansion inline y retorno.
- **Tareas:** TASK-032 a TASK-036.
- **Dependencias:** Fase 2 y activos de Fase 1.
- **Resultado entregable:** Exploracion por nicho con detalle accesible.
- **Criterio de salida:** Un visitante puede entender un nicho y regresar sin perder contexto.

### Fase 4 — Cotizacion e integraciones

- **Objetivo:** Conectar CTA, contexto, estados, adjuntos opcionales y eventos.
- **Tareas:** TASK-037 a TASK-040, TASK-054 y TASK-055.
- **Dependencias:** TASK-002, TASK-003, Fase 3 y TASK-007.
- **Resultado entregable:** Salida contextualizada al WhatsApp oficial, con estados honestos de handoff, error y canal no configurado.
- **Criterio de salida:** La solicitud llega al canal aprobado o se bloquea de forma explicita sin falso exito.

### Fase 5 — Visuales y animaciones

- **Objetivo:** Integrar imagenes aprobadas, movimiento y reduced motion.
- **Tareas:** TASK-015 a TASK-019, TASK-041 a TASK-043.
- **Dependencias:** Fase 1 y estructura base.
- **Resultado entregable:** Experiencia visual coherente y eficiente.
- **Criterio de salida:** Movimiento y assets cumplen design.md en escritorio, movil y reduced motion.

### Fase 6 — SEO, analitica y administracion

- **Objetivo:** Completar metadatos, rastreo, eventos y operaciones de contenido.
- **Tareas:** TASK-014, TASK-021, TASK-022, TASK-051 a TASK-055.
- **Dependencias:** Fuente, ruta, canal y analitica confirmados.
- **Resultado entregable:** Ruta indexable, medible y administrable.
- **Criterio de salida:** Metadata, sitemap, eventos y reglas RAD/RN tienen evidencia.

### Fase 7 — Calidad y pruebas

- **Objetivo:** Validar comportamiento, responsive, accesibilidad, SEO, rendimiento y visuales.
- **Tareas:** TASK-044 a TASK-050, TASK-056 a TASK-065.
- **Dependencias:** Implementacion de Fases 2-6.
- **Resultado entregable:** Reportes de pruebas y aprobacion editorial.
- **Criterio de salida:** No hay bloqueadores Must ni errores relevantes abiertos.

### Fase 8 — Publicacion y seguimiento

- **Objetivo:** Publicar, verificar produccion y medir comportamiento.
- **Tareas:** TASK-066 a TASK-070.
- **Dependencias:** Fase 7 y aprobacion humana.
- **Resultado entregable:** Ruta publicada, verificada y con seguimiento definido.
- **Criterio de salida:** Produccion responde correctamente y existe backlog basado en evidencia.

## 31. Definition of Done global

La funcionalidad solo puede considerarse terminada cuando:

- Todos los requerimientos Must estan implementados y tienen evidencia en la matriz.
- Los requerimientos Should no implementados tienen una justificacion aprobada.
- No hay decisiones bloqueantes abiertas para la version publicada.
- Los nichos publicados fueron aprobados por Lithora y cumplen la validacion de contenido.
- Los conceptos visuales estan identificados y no se presentan como proyectos reales.
- La experiencia no parece ecommerce, marketplace o catalogo cerrado.
- La cotizacion conserva categoria, nicho y aplicacion cuando exista.
- La navegacion funciona con teclado, focus visible, reduced motion y lector de pantalla en los escenarios definidos.
- No existe overflow horizontal en la matriz responsive.
- La ruta es indexable, tiene metadata correcta, canonical, sitemap y enlaces internos validos.
- Los nueve eventos estan validados o tienen una decision documentada de disponibilidad.
- Las imagenes estan optimizadas, tienen alt, ratio reservado y procedencia.
- Las pruebas acordadas pasan y no hay errores relevantes en consola.
- La auditoria de accesibilidad es satisfactoria.
- La auditoria de rendimiento cumple los objetivos aprobados.
- Staging fue aprobado y produccion fue verificada.
- Existe un plan de rollback y un seguimiento posterior al lanzamiento.

## 32. Estado de ejecucion

### Completadas con evidencia local

- [x] Portada comercial simplificada — nueva sección `#ideas-impresas` con la creatividad correcta `assets/lading/seccion_idea_01.png`, presentación editorial oscura y etiqueta `Ejemplo conceptual`.
- [x] Imagen protagonista optimizada — derivados WebP responsive de 480, 768 y 960 px generados desde `seccion_idea_01.png`, dimensiones reservadas, `srcset`, lazy loading y original preservado.
- [x] Conversión conectada — CTA contextual al WhatsApp oficial `+52 833 108 0178` y enlace al ecosistema por nichos.
- [x] Recorrido depurado — hub interno de SEO, tabla extensa de materiales, aplicaciones duplicadas y casos demostrativos retirados de la experiencia visible y de la navegación; las guías especializadas permanecen accesibles en sus rutas dedicadas.
- [x] Lenguaje de precios simplificado — eliminadas referencias internas a SEO/BOFU y reemplazadas por información comprensible para el cliente.
- [x] Validación de la nueva sección — escritorio y móvil sin overflow, imagen cargada, foco visible, reduced motion, CTA real, etiqueta conceptual y bloques retirados fuera del árbol visible.
- [x] TASK-001 a TASK-004 — Convenciones, contrato de cotizacion, WhatsApp oficial y nueve nichos aprobados.
- [x] TASK-005 a TASK-064 — Contenido estatico administrable, visuales conceptuales, ruta, interacciones, analitica, responsive, accesibilidad, SEO, rendimiento, pruebas y aprobacion comercial.
- [x] TASK-065 a TASK-066 — Integracion del sitio y checklist local final completos.
- [x] TASK-067 a TASK-068 — candidata aprobada en entorno local equivalente, despliegue GitHub Pages #6 y verificacion productiva completas.
- [x] Fuente y HTML sincronizados: `npm run content:check`.
- [x] Suite: 81 pruebas correctas mediante `npm run validate`, incluidas contenido, cotizacion, analitica, navegacion, SEO y los 44 contratos premium.
- [x] Navegador: matriz de 20 combinaciones (cuatro rutas por cinco viewports), mas portada, servicio y comprobaciones productivas con Chrome DevTools.
- [x] Observaciones finales: consola limpia; LCP local 110–393 ms en las cuatro rutas premium, CLS 0.00 e INP 34 ms; Lighthouse productivo del ecosistema 100/100/100/100.

### Bloqueos externos precisos

- [x] Canal de cotizacion resuelto — WhatsApp oficial `https://wa.me/528331080178`, contexto completo y handoff sin exito simulado.
- [x] Aprobacion comercial resuelta — nueve nichos `published`; Transporte sustituye a Ferreterías, Papelerías se elimina, Boda sustituye a Joyerías y Escuelas sustituye a Farmacias por decisiones del 2026-07-20. Se conservan treinta y seis productos ejemplo y treinta y dos referencias aportadas por el usuario exclusivamente como `Ejemplo conceptual`; los recursos OpenArt quedan preservados localmente pero ya no se publican en tarjetas.
- [ ] Blocked externally — Conexion a una cuenta analitica de produccion y reglas de consentimiento. Dependencia: proveedor/cuenta y decision de privacidad; propietario: marketing/analitica y privacidad de Lithora 3D; siguiente accion: conectar dataLayer al proveedor aprobado y validar recepcion de los nueve eventos sin ampliar los payloads minimos.
- [x] Chrome DevTools MCP resuelto — inspeccion local y productiva realizada con `list_pages`, navegacion, DOM, red, consola, interaccion y Lighthouse.
- [x] Staging resuelto por equivalencia — el proyecto no tiene un entorno separado; la candidata se valido localmente con configuracion estatica equivalente y fue aprobada expresamente antes de promoverse.
- [x] Produccion resuelta — commit `b12f3a3` publicado por GitHub Pages workflow #6 y verificado en `https://lithora3d.com/`; el seguimiento con trafico real permanece en TASK-069.

La Definition of Done local y de publicacion esta alcanzada. Quedan 15 casillas, todas `Blocked externally`, limitadas a cuenta analitica/consentimiento, telemetria con trafico real y decisiones futuras de expansion basadas en demanda real.
