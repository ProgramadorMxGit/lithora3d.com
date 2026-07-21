# Requerimientos: Ecosistema de soluciones por nicho para Lithora 3D

**Estado:** Borrador para aprobacion
**Fase:** Requerimientos
**Alcance del documento:** Define el comportamiento, contenido y criterios de validacion de la funcionalidad. No define diseno visual, arquitectura tecnica, componentes, codigo ni tareas de implementacion.

## 1. Introduccion

### Nombre de la funcionalidad

Ecosistema de soluciones por nicho para Lithora 3D.

### Proposito

Presentar las capacidades de diseno, modelado, prototipado, adaptacion e impresion 3D de Lithora como soluciones aplicables a negocios, industria, eventos y proyectos de diseno, en lugar de presentarlas unicamente como la impresion de archivos proporcionados por el cliente.

### Problema que resuelve

Una persona que no conoce las posibilidades de la impresion 3D puede no identificar como esta tecnologia resuelve necesidades de su actividad. La funcionalidad debe convertir capacidades generales de Lithora en aplicaciones concretas por nicho, para que el visitante reconozca oportunidades relevantes y pueda iniciar una solicitud de cotizacion.

### Alcance del MVP

El MVP incluye una seccion publica e indexable que presenta las cuatro categorias confirmadas, sus nichos publicados, aplicaciones concretas por nicho, informacion de personalizacion y una accion de cotizacion con contexto de origen.

El MVP no requiere comercio electronico, precios automaticos, configuradores 3D, cuentas de usuario ni paginas individuales para todos los nichos.

### Resultado esperado para el usuario

El visitante debe poder identificar una categoria o nicho relacionado con su actividad, comprender aplicaciones concretas y saber que puede solicitar una solucion personalizada aun si no cuenta con un archivo 3D.

### Resultado esperado para Lithora 3D

Lithora debe recibir solicitudes de cotizacion con el contexto del nicho que genero el interes, y contar con una estructura de contenido que permita publicar, actualizar y ampliar nichos sin cambiar el proposito de la seccion.

## 2. Definiciones

| Termino | Definicion |
|---|---|
| Categoria | Agrupacion principal de nichos. Para esta funcionalidad las categorias confirmadas son Negocios, Industria, Eventos y Diseno y prototipos. |
| Nicho | Contexto de actividad o necesidad especifica dentro de una categoria, por ejemplo restaurantes y cafeterias, talleres mecanicos o arquitectura. |
| Aplicacion | Ejemplo concreto de una pieza, elemento, prototipo o solucion que puede ser relevante para un nicho. No implica disponibilidad permanente ni precio fijo. |
| Tarjeta de nicho | Unidad de contenido que resume un nicho y permite al visitante reconocer su necesidad, revisar aplicaciones y continuar hacia informacion ampliada o cotizacion. |
| Solucion personalizada | Resultado que puede requerir diseno, modelado, adaptacion, prototipado, fabricacion o impresion 3D segun la necesidad del cliente. |
| CTA | Llamado a la accion que permite al visitante continuar hacia una accion concreta, como ampliar un nicho o solicitar una cotizacion. |
| Proyecto real | Caso, pieza, fotografia o evidencia validada internamente como trabajo realizado por Lithora 3D. |
| Imagen conceptual | Recurso visual que ilustra una posibilidad o ejemplo de aplicacion y que no representa necesariamente un proyecto realizado por Lithora 3D. |
| Contexto de origen | Datos del nicho y categoria desde los que un cliente potencial inicia una solicitud de cotizacion. |

## 3. Actores

| Actor | Interaccion directa | Necesidad que debe cubrir la funcionalidad |
|---|---|---|
| Visitante | Explora categorias, nichos y aplicaciones. | Reconocer rapidamente si existen soluciones relevantes para su actividad. |
| Cliente potencial | Consulta un nicho y comienza una solicitud de cotizacion. | Explicar su necesidad y conservar el contexto de la solucion que le intereso. |
| Administrador o responsable del contenido | Gestiona categorias, nichos, imagenes, CTAs y metadatos. | Mantener contenido valido, actualizado, publicable y escalable. |

## 4. Requerimientos funcionales

### RF-001 - Introduccion del ecosistema

- **Prioridad:** Must
- **Requerimiento:** El sistema debe mostrar una introduccion que explique que Lithora 3D ofrece soluciones de diseno, modelado, prototipado, adaptacion e impresion 3D para diferentes necesidades.
- **Justificacion:** Establece que la seccion no se limita a recibir archivos para imprimir.
- **Criterios de aceptacion:**
  - **Given** que un visitante abre la seccion, **When** consulta el contenido introductorio, **Then** encuentra una explicacion de las capacidades y del enfoque de soluciones personalizadas.

### RF-002 - Categorias principales

- **Prioridad:** Must
- **Requerimiento:** El sistema debe mostrar las categorias Negocios, Industria, Eventos y Diseno y prototipos.
- **Justificacion:** Estas categorias constituyen la estructura conceptual confirmada de la funcionalidad.
- **Criterios de aceptacion:**
  - **Given** que la seccion contiene contenido publicado, **When** un visitante visualiza la navegacion de categorias, **Then** puede identificar las cuatro categorias principales.

### RF-003 - Nichos por categoria

- **Prioridad:** Must
- **Requerimiento:** El sistema debe mostrar los nichos publicados dentro de la categoria a la que estan asignados.
- **Justificacion:** Permite que el visitante navegue desde un contexto amplio hacia una actividad o necesidad mas especifica.
- **Criterios de aceptacion:**
  - **Given** que existen nichos publicados en una categoria, **When** el visitante selecciona o consulta esa categoria, **Then** el sistema muestra exclusivamente los nichos publicados asignados a ella.

### RF-004 - Aplicaciones concretas

- **Prioridad:** Must
- **Requerimiento:** El sistema debe mostrar las aplicaciones concretas definidas para cada nicho publicado.
- **Justificacion:** Las aplicaciones permiten que el visitante visualice oportunidades reales de uso.
- **Criterios de aceptacion:**
  - **Given** que un nicho esta publicado, **When** el visitante consulta su informacion, **Then** visualiza entre cuatro y siete aplicaciones asociadas al nicho.

### RF-005 - Beneficio principal

- **Prioridad:** Must
- **Requerimiento:** El sistema debe mostrar el beneficio principal de cada nicho publicado en lenguaje comprensible para personas no tecnicas.
- **Justificacion:** El visitante debe entender el valor de la solucion antes de evaluar detalles tecnicos.
- **Criterios de aceptacion:**
  - **Given** que un nicho esta publicado, **When** el visitante consulta la tarjeta o detalle del nicho, **Then** encuentra un beneficio principal vinculado con su problema u oportunidad.

### RF-006 - Archivo 3D no obligatorio

- **Prioridad:** Must
- **Requerimiento:** El sistema debe comunicar que el visitante puede solicitar orientacion aunque no tenga un archivo 3D.
- **Justificacion:** Evita excluir a clientes potenciales que solo cuentan con una necesidad, referencia, idea o pieza existente.
- **Criterios de aceptacion:**
  - **Given** que un visitante revisa la seccion o inicia una cotizacion, **When** busca los requisitos para solicitar ayuda, **Then** encuentra una indicacion explicita de que un archivo 3D no es obligatorio.

### RF-007 - Personalizacion de ejemplos

- **Prioridad:** Must
- **Requerimiento:** El sistema debe comunicar que las aplicaciones mostradas son puntos de partida para soluciones personalizadas.
- **Justificacion:** Evita que la seccion se interprete como un catalogo cerrado.
- **Criterios de aceptacion:**
  - **Given** que un visitante consulta un nicho, **When** revisa sus aplicaciones, **Then** encuentra una indicacion de que pueden adaptarse a la necesidad, marca o contexto del cliente.

### RF-008 - Identificacion del tipo de imagen

- **Prioridad:** Must
- **Requerimiento:** El sistema debe identificar si la imagen asociada a un nicho representa un proyecto real o una imagen conceptual.
- **Justificacion:** Evita atribuir a Lithora trabajos que no han sido realizados por la empresa.
- **Criterios de aceptacion:**
  - **Given** que un nicho muestra una imagen, **When** el visitante consulta la imagen o su contexto, **Then** puede identificar si se trata de un proyecto real o de una imagen conceptual.

### RF-009 - Informacion ampliada de nicho

- **Prioridad:** Must
- **Requerimiento:** El sistema debe permitir al visitante abrir informacion ampliada de un nicho publicado.
- **Justificacion:** La vista resumida debe poder conducir a contenido suficiente para evaluar la relevancia del nicho.
- **Criterios de aceptacion:**
  - **Given** que el visitante visualiza una tarjeta de nicho, **When** activa la accion de ampliar, **Then** accede a la descripcion, problema u oportunidad, aplicaciones, beneficio, servicios relacionados y CTA del nicho.

### RF-010 - Inicio de cotizacion desde un nicho

- **Prioridad:** Must
- **Requerimiento:** El sistema debe permitir iniciar una solicitud de cotizacion desde la informacion de cada nicho publicado.
- **Justificacion:** Convierte el interes por una aplicacion concreta en una accion comercial directa.
- **Criterios de aceptacion:**
  - **Given** que un nicho esta publicado, **When** el visitante activa su CTA de cotizacion, **Then** el sistema lo dirige al canal de solicitud configurado para esa accion.

### RF-011 - Conservacion del contexto de origen

- **Prioridad:** Must
- **Requerimiento:** El sistema debe conservar la categoria y el nicho de origen al iniciar una solicitud de cotizacion desde un nicho.
- **Justificacion:** Permite que Lithora entienda que genero el interes sin requerir que el cliente repita esa informacion.
- **Criterios de aceptacion:**
  - **Given** que un cliente potencial inicia una solicitud desde un nicho, **When** llega al canal de cotizacion, **Then** el contexto de categoria y nicho queda disponible para el proceso de solicitud.

### RF-012 - Regreso a la vista general

- **Prioridad:** Should
- **Requerimiento:** El sistema debe permitir al visitante regresar desde la informacion ampliada de un nicho hacia la vista general de categorias y nichos.
- **Justificacion:** Mantiene la exploracion sin obligar al visitante a reiniciar la navegacion.
- **Criterios de aceptacion:**
  - **Given** que el visitante consulta informacion ampliada de un nicho, **When** activa la accion de regreso, **Then** vuelve a la vista general de la seccion sin perder el acceso a las categorias.

### RF-013 - Estructura extensible de nichos

- **Prioridad:** Must
- **Requerimiento:** El sistema debe permitir agregar un nuevo nicho a una categoria existente sin alterar la estructura general de las categorias.
- **Justificacion:** La seccion debe crecer conforme Lithora valide nuevas oportunidades comerciales.
- **Criterios de aceptacion:**
  - **Given** que existe una categoria, **When** el administrador agrega un nicho valido a esa categoria, **Then** el nuevo nicho puede mostrarse sin requerir cambios en las demas categorias.

### RF-014 - Publicacion de nichos

- **Prioridad:** Must
- **Requerimiento:** El sistema debe permitir publicar y ocultar un nicho de forma independiente.
- **Justificacion:** Lithora debe poder controlar que contenido esta disponible para visitantes.
- **Criterios de aceptacion:**
  - **Given** que un nicho existe, **When** el administrador cambia su estado de publicacion, **Then** el nicho aparece o deja de aparecer para visitantes de acuerdo con el estado seleccionado.

### RF-015 - Reordenamiento de nichos

- **Prioridad:** Should
- **Requerimiento:** El sistema debe permitir definir el orden de presentacion de los nichos dentro de cada categoria.
- **Justificacion:** Permite priorizar nichos con mayor relevancia comercial o estacional.
- **Criterios de aceptacion:**
  - **Given** que una categoria tiene dos o mas nichos, **When** el administrador cambia su orden, **Then** los visitantes visualizan los nichos conforme al orden configurado.

### RF-016 - Estado alternativo sin imagen

- **Prioridad:** Must
- **Requerimiento:** El sistema debe mostrar un estado alternativo cuando un nicho publicado no cuente con imagen.
- **Justificacion:** La ausencia de un recurso visual no debe romper la comprension ni la navegacion del nicho.
- **Criterios de aceptacion:**
  - **Given** que un nicho publicado no tiene imagen, **When** el visitante lo consulta, **Then** el sistema muestra una representacion alternativa que conserva el nombre, contenido y CTA del nicho.

### RF-017 - Registro de interacciones principales

- **Prioridad:** Must
- **Requerimiento:** El sistema debe registrar las interacciones principales definidas en la seccion de analitica de este documento.
- **Justificacion:** Lithora necesita medir que categorias, nichos y acciones generan interes y solicitudes.
- **Criterios de aceptacion:**
  - **Given** que un visitante realiza una interaccion medible, **When** la interaccion se completa, **Then** el sistema registra el evento con los datos minimos definidos para ese evento.

## 5. Requerimientos de contenido

| ID | Prioridad | Requerimiento |
|---|---|---|
| RC-001 | Must | El sistema debe exigir un nombre para cada nicho publicado. |
| RC-002 | Must | El sistema debe exigir la asignacion de una categoria para cada nicho publicado. |
| RC-003 | Must | El sistema debe exigir una descripcion corta que explique el contexto del nicho publicado. |
| RC-004 | Must | El sistema debe exigir un problema u oportunidad especifica para cada nicho publicado. |
| RC-005 | Must | El sistema debe exigir entre cuatro y siete aplicaciones concretas para cada nicho publicado. |
| RC-006 | Must | El sistema debe exigir un beneficio principal comprensible para cada nicho publicado. |
| RC-007 | Must | El sistema debe mostrar los servicios de Lithora relacionados con cada nicho publicado cuando estos hayan sido definidos y validados. |
| RC-008 | Must | El sistema debe asociar una imagen o el estado alternativo sin imagen a cada nicho publicado. |
| RC-009 | Must | El sistema debe asociar el tipo proyecto real o imagen conceptual a cada imagen de nicho. |
| RC-010 | Must | El sistema debe exigir texto alternativo para cada imagen informativa de nicho. |
| RC-011 | Must | El sistema debe exigir un CTA de cotizacion para cada nicho publicado. |
| RC-012 | Should | El sistema debe conservar un valor de orden para cada nicho dentro de su categoria. |
| RC-013 | Must | El sistema debe conservar un estado de publicacion para cada nicho. |
| RC-014 | Must | El sistema debe redactar aplicaciones, beneficios y CTAs en lenguaje comprensible, sin terminos tecnicos sin explicacion. |
| RC-015 | Must | El sistema debe prohibir contenido que invente clientes, resultados, precios o casos de exito. |
| RC-016 | Must | El sistema debe evitar presentar las aplicaciones como productos disponibles permanentemente. |
| RC-017 | Must | El sistema debe prohibir promesas de materiales, tiempos o capacidades que no hayan sido validadas por Lithora. |
| RC-018 | Must | El sistema debe prohibir descripciones genericas que puedan aplicarse indistintamente a cualquier empresa o actividad. |
| RC-019 | Must | El sistema debe presentar primero el problema u oportunidad y el beneficio del visitante antes de describir el proceso tecnico relacionado. |

## 6. Requerimientos de experiencia de usuario

| ID | Prioridad | Requerimiento verificable |
|---|---|---|
| RX-001 | Must | El sistema debe permitir que el visitante identifique, al entrar a la seccion, que el contenido presenta soluciones por nicho y no solo servicios generales. |
| RX-002 | Must | El sistema debe permitir al visitante localizar las cuatro categorias principales sin recorrer contenido de nichos no relacionado. |
| RX-003 | Must | El sistema debe presentar el nombre, problema u oportunidad y beneficio de un nicho antes de exigir una accion de ampliacion. |
| RX-004 | Must | El sistema debe mantener legible el contenido de cada nicho sin requerir conocimientos previos de impresion 3D. |
| RX-005 | Must | El sistema debe mostrar el CTA de cotizacion asociado a un nicho en la informacion visible o ampliada de ese nicho. |
| RX-006 | Must | El sistema debe permitir realizar acciones de categoria, ampliacion y cotizacion sin depender de hover. |
| RX-007 | Should | El sistema debe proporcionar una respuesta perceptible despues de que el visitante seleccione una categoria, abra un nicho o active una accion disponible. |
| RX-008 | Must | El sistema debe mantener el contexto del nicho visible o disponible durante la transicion hacia la cotizacion. |
| RX-009 | Must | El sistema debe comunicar que las aplicaciones son ejemplos personalizables y no un inventario de compra directa. |

## 7. Requerimientos responsive

| ID | Prioridad | Requerimiento verificable |
|---|---|---|
| RR-001 | Must | El sistema debe permitir consultar categorias, nichos, aplicaciones y CTAs en escritorio sin requerir desplazamiento horizontal. |
| RR-002 | Must | El sistema debe permitir consultar categorias, nichos, aplicaciones y CTAs en tableta sin requerir desplazamiento horizontal. |
| RR-003 | Must | El sistema debe permitir consultar categorias, nichos, aplicaciones y CTAs en telefono sin requerir desplazamiento horizontal. |
| RR-004 | Must | El sistema debe permitir activar las tarjetas y CTAs de nicho mediante interaccion tactil. |
| RR-005 | Must | El sistema debe adaptar textos e imagenes al espacio disponible sin ocultar el nombre, aplicaciones, beneficio o CTA de un nicho publicado. |
| RR-006 | Must | El sistema debe mantener accesible la accion de cotizacion de un nicho en pantallas pequenas. |

## 8. Requerimientos de accesibilidad

| ID | Prioridad | Requerimiento verificable |
|---|---|---|
| RA-001 | Must | El sistema debe permitir navegar todas las acciones interactivas mediante teclado. |
| RA-002 | Must | El sistema debe mostrar un foco visible en el elemento interactivo que recibe navegacion por teclado. |
| RA-003 | Must | El sistema debe usar una jerarquia semantica de encabezados que identifique seccion, categoria, nicho y contenido ampliado. |
| RA-004 | Must | El sistema debe proporcionar texto alternativo para cada imagen informativa y omitir del lector de pantalla las imagenes decorativas. |
| RA-005 | Must | El sistema debe mantener contraste suficiente entre texto, controles y sus fondos. |
| RA-006 | Must | El sistema debe asignar nombres descriptivos a botones y enlaces, incluidos los CTAs de cotizacion. |
| RA-007 | Must | El sistema debe comunicar estados, tipo de imagen y acciones sin depender unicamente del color. |
| RA-008 | Should | El sistema debe respetar la preferencia de reduccion de movimiento cuando existan transiciones o animaciones. |
| RA-009 | Must | El sistema debe ofrecer areas tactiles utilizables para tarjetas y CTAs interactivos. |

## 9. Requerimientos SEO

| ID | Prioridad | Requerimiento verificable |
|---|---|---|
| RS-001 | Must | El sistema debe publicar la seccion en una ruta indexable. |
| RS-002 | Must | El sistema debe proporcionar un titulo SEO unico para la seccion. |
| RS-003 | Must | El sistema debe proporcionar una meta descripcion unica para la seccion. |
| RS-004 | Must | El sistema debe incluir un unico H1 que describa el proposito de la seccion. |
| RS-005 | Must | El sistema debe organizar los encabezados posteriores al H1 de forma jerarquica. |
| RS-006 | Must | El sistema debe publicar contenido propio de Lithora y evitar duplicar textos de otros sitios o entre nichos. |
| RS-007 | Must | El sistema debe incluir enlaces internos desde la seccion hacia contenido relevante de Lithora y desde contenido relevante hacia la seccion. |
| RS-008 | Must | El sistema debe integrar la ruta publicada en el sitemap del sitio. |
| RS-009 | Should | El sistema debe proporcionar metadatos sociales propios para la seccion publicada. |
| RS-010 | Must | El sistema debe permitir preparar una URL, titulo SEO y meta descripcion propios para un nicho cuando ese nicho tenga una pagina individual aprobada. |
| RS-011 | Must | El sistema debe prohibir publicar una pagina individual de nicho si no cuenta con contenido unico y suficiente para explicar el nicho, sus aplicaciones y su CTA. |

## 10. Requerimientos de analitica

| ID | Evento | Disparador | Datos minimos registrados |
|---|---|---|---|
| RM-001 | `ecosystem_section_view` | El visitante visualiza la seccion. | Fecha y hora, ruta, origen o referencia disponible, tipo de dispositivo. |
| RM-002 | `ecosystem_category_select` | El visitante selecciona o abre una categoria. | Identificador y nombre de categoria, ruta, tipo de dispositivo. |
| RM-003 | `ecosystem_niche_open` | El visitante abre informacion ampliada de un nicho. | Identificador y nombre de nicho, categoria, ruta, tipo de dispositivo. |
| RM-004 | `ecosystem_application_click` | El visitante activa una aplicacion interactiva de un nicho. | Identificador y nombre de nicho, categoria, nombre de aplicacion, ruta. |
| RM-005 | `ecosystem_quote_click` | El visitante activa el CTA de cotizacion desde un nicho. | Identificador y nombre de nicho, categoria, CTA activado, ruta, tipo de dispositivo. |
| RM-006 | `ecosystem_quote_start` | El visitante inicia el proceso de solicitud de cotizacion. | Identificador y nombre de nicho, categoria, canal de cotizacion, ruta de origen. |
| RM-007 | `ecosystem_quote_complete` | El visitante completa una solicitud de cotizacion originada en la seccion. | Identificador y nombre de nicho, categoria, canal de cotizacion, estado de envio. |
| RM-008 | `ecosystem_origin_context` | El sistema transfiere el contexto hacia cotizacion. | Identificador y nombre de nicho, categoria, ruta de origen. |
| RM-009 | `ecosystem_attachment_use` | El visitante adjunta o intenta adjuntar un archivo en la solicitud, cuando esa capacidad este disponible. | Identificador y nombre de nicho, categoria, tipo de accion, resultado de la accion. |

## 11. Requerimientos de administracion

| ID | Prioridad | Requerimiento verificable |
|---|---|---|
| RAD-001 | Must | El sistema debe permitir al administrador crear un nicho. |
| RAD-002 | Must | El sistema debe permitir al administrador editar el contenido de un nicho existente. |
| RAD-003 | Must | El sistema debe permitir al administrador publicar un nicho valido. |
| RAD-004 | Must | El sistema debe permitir al administrador ocultar un nicho publicado. |
| RAD-005 | Should | El sistema debe permitir al administrador reordenar nichos dentro de una categoria. |
| RAD-006 | Must | El sistema debe permitir al administrador asignar un nicho a una categoria principal. |
| RAD-007 | Must | El sistema debe permitir al administrador marcar una imagen como proyecto real o imagen conceptual. |
| RAD-008 | Should | El sistema debe permitir al administrador editar titulo SEO y meta descripcion cuando corresponda a una ruta publicada. |
| RAD-009 | Must | El sistema debe permitir al administrador cambiar el CTA asociado a un nicho. |
| RAD-010 | Must | El sistema debe conservar y mostrar la fecha de la ultima actualizacion de cada nicho al administrador. |

## 12. Reglas de negocio

| ID | Regla |
|---|---|
| RN-001 | Un nicho no puede publicarse sin nombre, categoria, descripcion corta, problema u oportunidad, entre cuatro y siete aplicaciones, beneficio principal y CTA. |
| RN-002 | Un nicho no puede publicarse con una imagen conceptual sin que esta se identifique como imagen conceptual. |
| RN-003 | Una imagen o caso no puede marcarse como proyecto real sin validacion interna de Lithora. |
| RN-004 | Una solicitud de cotizacion iniciada desde un nicho debe conservar la categoria y nicho de origen. |
| RN-005 | La ausencia de precio no debe impedir que un visitante inicie una solicitud de cotizacion. |
| RN-006 | La ausencia de un archivo 3D no debe impedir que un visitante solicite orientacion. |
| RN-007 | Un nicho especializado no puede publicarse sin confirmar que Lithora puede atenderlo con sus capacidades vigentes. |
| RN-008 | Las aplicaciones mostradas son ejemplos y no representan disponibilidad permanente, inventario, precio fijo ni compromiso de fabricacion sin evaluacion previa. |

## 13. Fuera del alcance del MVP

Los siguientes elementos quedan fuera del alcance inicial de esta funcionalidad:

- Comercio electronico.
- Pagos en linea.
- Carrito de compras.
- Precios automaticos.
- Configurador 3D.
- Cotizacion automatica avanzada.
- Comparador de nichos.
- Favoritos.
- Cuentas de usuario.
- Paginas individuales para todos los nichos.
- Recomendaciones automaticas mediante inteligencia artificial.
- Integraciones tecnicas todavia no confirmadas.

## 14. Matriz de trazabilidad

| Objetivo | Requerimientos asociados | Actor beneficiado | Resultado verificable |
|---|---|---|---|
| Posicionar a Lithora como ecosistema de soluciones | RF-001, RF-005, RF-006, RF-007, RC-019, RX-001, RX-009 | Visitante, cliente potencial | El visitante encuentra capacidades, beneficio y personalizacion sin asumir que solo puede enviar un archivo. |
| Facilitar el descubrimiento de aplicaciones por actividad | RF-002, RF-003, RF-004, RF-009, RC-001 a RC-007, RX-002 a RX-004 | Visitante | El visitante localiza una categoria, abre un nicho y consulta aplicaciones concretas. |
| Convertir interes en solicitud de cotizacion | RF-010, RF-011, RX-005, RX-008, RM-005 a RM-008, RN-004 a RN-006 | Cliente potencial, Lithora 3D | Una solicitud iniciada desde un nicho conserva su categoria y nicho de origen. |
| Mantener contenido confiable | RF-008, RF-016, RC-009 a RC-018, RN-001 a RN-003, RN-007 a RN-008 | Visitante, administrador | Las imagenes y ejemplos tienen tipo identificable y no se publican afirmaciones no validadas. |
| Permitir crecimiento administrable | RF-013 a RF-015, RC-012 a RC-013, RAD-001 a RAD-010 | Administrador o responsable del contenido | El responsable puede crear, editar, clasificar, publicar, ocultar y reordenar nichos. |
| Lograr descubrimiento organico de contenido | RS-001 a RS-011 | Visitante, Lithora 3D | La seccion publicada cuenta con ruta indexable, metadata, enlaces internos y sitemap. |
| Medir interes y conversion | RF-017, RM-001 a RM-009 | Administrador o responsable del contenido, Lithora 3D | Las interacciones principales quedan registradas con categoria y nicho cuando corresponda. |

## 15. Preguntas abiertas

Las siguientes decisiones bloquean el cierre de `design.md` porque determinan acciones, contenido disponible o comportamiento de la experiencia:

1. Cual sera el canal final de cotizacion para las solicitudes originadas en esta seccion?
2. Que datos debera solicitar obligatoriamente el canal de cotizacion?
3. Cuales seran los nichos exactos del MVP y cuantos se publicaran inicialmente?
4. Que nichos cuentan actualmente con capacidad validada para ser publicados?
5. Existen proyectos reales, fotografias o casos validados disponibles para cada nicho del MVP?
6. Cuando no exista una imagen real, que recurso conceptual aprobado podra utilizarse?
7. La informacion ampliada de un nicho se consultara dentro de la misma seccion o en una ruta propia durante el MVP?
8. Cual es el sistema actual con el que esta construida la web y como se administra hoy su contenido?
9. Que herramienta de analitica esta disponible para registrar los eventos definidos?
