# Historial de cambios

## [2026-08-06]

* Archivo: producción `https://lithora3d.com/generador-llaveros-3d/` y GitHub Pages run #36
* Cambio: se creó el commit `dc179c0` (`feat(generator): add pencil name mode`) y se publicó `main` en `origin`; GitHub Pages recibió el despliegue automático.
* Motivo: poner en producción el modo de nombres longitudinales para lápiz ya validado localmente y en Bambu Studio.
* Relación: despliega exclusivamente los seis archivos del generador; se conservaron sin incluir los demás cambios y archivos locales del usuario.
* Resultado: ⚠️ push completado, pero el workflow `31127171624` permanece en cola por el incidente oficial activo de GitHub Actions/Pages y producción todavía sirve la revisión anterior.

## [2026-08-06]

* Archivo: suite general `npm test`
* Cambio: ejecución de las 89 pruebas automatizadas del repositorio después de integrar el modo lápiz.
* Motivo: descartar regresiones en navegación, contenido, accesibilidad, SEO, cotización y servidor local.
* Relación: complementa la prueba especializada realizada con Chrome DevTools y Bambu Studio.
* Resultado: ✅ 89/89 pruebas aprobadas, 0 fallos.

## [2026-08-06]

* Archivo: validación Chrome DevTools y Bambu Studio de `nombres-para-lapiz.3mf`
* Cambio: se generaron ANA, ROMINA, SANTIAGO, JOSÉ ÁNGEL y MAXIMILIANO; se exportó SANTIAGO desde la UI y se laminó con Bambu Studio 02.07.01.62.
* Motivo: comprobar la ruta completa —interfaz, geometría, empaquetado, perfil y laminador real— en vez de aceptar únicamente la vista WebGL.
* Relación: cierre técnico posterior a corregir el nodo faltante de la plantilla y la versión 3MF incompatible.
* Resultado: ✅ consola sin errores; nombres de 41 a 120 mm generados; 3MF de 16.352 triángulos aceptado con código 0, 95 capas, 14,28 g, estimado 75 min, 0,16 mm, 3 paredes, 25% gyroid, ironing activo y 0 secciones de soporte.

## [2026-08-06]

* Archivo: generador-llaveros-3d/assets/app/exportadores.js
* Cambio: corrección de la metadata `Application` del proyecto 3MF de `BambuStudio-02.08.01.55` a la versión estable instalada `BambuStudio-02.07.01.62`.
* Motivo: el primer laminado real devolvió `return_code -24` (`Unsupported 3MF version`) porque el paquete anunciaba una versión futura/beta que el cargador estable rechaza antes de leer la malla.
* Relación: mejora también la compatibilidad de los 3MF multicolor de llaveros; no cambia geometría ni parámetros del perfil.
* Resultado: ✅ corregido; se repetirá exportación y laminado desde Chrome.

## [2026-08-06]

* Archivo: generador-llaveros-3d/index.html
* Cambio: segunda regeneración incorporando el nodo `pencil-style-note` requerido por la sincronización de interfaz.
* Motivo: aplicar la corrección hallada por Chrome DevTools y permitir que el cambio de producto complete todos sus estados visuales.
* Relación: reemplaza el resultado parcial de la regeneración anterior.
* Resultado: ✅ generado correctamente (36.7 KB).

## [2026-08-06]

* Archivo: generador-llaveros-3d/plantilla.py
* Cambio: restauración desde la plantilla del aviso `pencil-style-note` que explica el contorno reforzado y el uso de mayúsculas.
* Motivo: la primera prueba real en Chrome DevTools detectó que la regeneración omitía ese nodo y detenía `syncProductUI()` con un `TypeError`, dejando visibles controles incompatibles.
* Relación: corrección de la primera prueba de regeneración del modo lápiz; se conserva la estrategia de composición desde el portable.
* Resultado: ✅ corregido; pendiente de recargar y repetir la interacción en Chrome.

## [2026-08-06]

* Archivo: generador-llaveros-3d/index.html
* Cambio: regeneración completa desde `plantilla.py` conservando el selector y los controles del modo lápiz.
* Motivo: verificar que la nueva interfaz ya no depende de una edición manual que pudiera perderse al reconstruir la página.
* Relación: validación directa del cambio de fuente de generación en `plantilla.py`.
* Resultado: ✅ generado correctamente (36.5 KB, 1080 palabras indexables y 12 preguntas FAQ).

## [2026-08-06]

* Archivo: generador-llaveros-3d/plantilla.py
* Cambio: la plantilla vuelve a insertar de forma determinista el selector Llavero/Nombre para lápiz, sus tres ajustes y los identificadores necesarios para ocultar controles exclusivos de llavero.
* Motivo: impedir que una futura regeneración de `index.html` desde la versión portable borre el nuevo modo de lápices.
* Relación: formaliza como fuente de generación el marcado añadido previamente a `index.html`, manteniendo intacta la aplicación portable externa.
* Resultado: ✅ implementado; pendiente de prueba de regeneración idéntica.

## [2026-08-06]

* Archivo: generador-llaveros-3d/assets/app/creador.js
* Cambio: todos los 3MF del modo lápiz se exportan ahora como proyecto Bambu con el perfil calibrado incrustado; los modos de un filamento agrupan la pieza en una sola ranura y el modo AMS conserva sus grupos de color.
* Motivo: garantizar que el archivo listo para imprimir mantenga la configuración de calidad también cuando el usuario no elige multicolor.
* Relación: completa la incorporación del perfil específico de lápices en `exportadores.js` sin cambiar el comportamiento histórico de los 3MF de llaveros.
* Resultado: ✅ implementado; pendiente de apertura y laminado en Bambu Studio.

## [2026-08-06]

* Archivo: generador-llaveros-3d/assets/app/exportadores.js
* Cambio: incorporación de un perfil Bambu específico para nombres de lápiz, basado en `0.16mm High Quality @BBL A1`, con 3 paredes, 6/5 capas sólidas, gyroid, velocidades de alta calidad, puentes lentos, límites de voladizo y soportes desactivados; el proyecto 3MF identifica además el producto como `Nombres para lapiz`.
* Motivo: entregar un archivo listo para laminar que proteja la calidad de letras y del túnel autoportante sin introducir soportes dentro del paso del lápiz.
* Relación: amplía los ajustes de acabado ya existentes para llaveros sin alterar su perfil; usa la calibración oficial de compensación de agujeros y el preset oficial instalado de Bambu Studio.
* Resultado: ✅ implementado; pendiente de validación física mediante exportación y laminado.

## [2026-08-06]

* Archivo: `generador-llaveros-3d/assets/app/creador.js`
* Cambio: producto, diámetro y pared se guardan/restauran/deshacen; se validan snapshots, se refrescan controles y se suprimen alturas individuales que deformarían el calibre del lápiz.
* Motivo: conservar el trabajo entre sesiones sin aceptar estados incompatibles ni mostrar ajustes inoperantes.
* Relación: completa la integración de estado del modo lápiz con el sistema existente de guardado seguro.
* Resultado: ✅ persistencia, restauración, reinicio y deshacer cubren el modo nuevo.

## [2026-08-06]

* Archivo: `generador-llaveros-3d/assets/app/creador.js`
* Cambio: las descargas STL, 3MF y ZIP usan nombres propios del modo lápiz y la exportación Bambu recibe el tipo de producto.
* Motivo: distinguir entregables y permitir que el exportador aplique el perfil especializado únicamente a estas piezas.
* Relación: conecta la reconstrucción del modo lápiz con la siguiente modificación del perfil Bambu.
* Resultado: ✅ rutas de exportación diferenciadas; implementación del perfil pendiente.

## [2026-08-06]

* Archivo: `generador-llaveros-3d/assets/app/creador.js`
* Cambio: la reconstrucción enruta el modo lápiz a `buildPencilNameTile`, convierte el nombre a mayúsculas para robustez, conserva sin escalar el calibre del túnel, calcula la altura real y adapta el HUD.
* Motivo: garantizar que cambiar el alto visual nunca deforme el agujero funcional y que cada nombre se construya con el núcleo longitudinal correcto.
* Relación: integración funcional de la geometría y el estado añadidos en esta iteración.
* Resultado: ✅ vista 3D preparada para construir nombres para lápiz; pruebas en navegador pendientes.

## [2026-08-06]

* Archivo: `generador-llaveros-3d/assets/app/creador.js`
* Cambio: el modo multicolor informa explícitamente el perfil de calidad específico para los nombres de lápiz.
* Motivo: dejar claro antes de descargar que el 3MF cambia capa, paredes, velocidades, soportes y acabado respecto al llavero normal.
* Relación: anticipa los overrides Bambu específicos que se añadirán al exportador.
* Resultado: ✅ explicación de impresión incorporada.

## [2026-08-06]

* Archivo: `generador-llaveros-3d/assets/app/creador.js`
* Cambio: se conectaron los deslizadores de diámetro/pared y el cálculo de cambio de color usa ahora la altura estructural real de la pieza construida.
* Motivo: reconstruir el túnel en vivo y evitar indicar una pausa basada en los 2.4 mm del llavero cuando el nombre para lápiz es más grueso.
* Relación: consume `baseThickness` de `buildPencilNameTile`.
* Resultado: ✅ controles dimensionales y altura de pausa conectados.

## [2026-08-06]

* Archivo: `generador-llaveros-3d/assets/app/creador.js`
* Cambio: se conectaron los selectores de producto y ajuste, se añadieron estados accesibles y se ocultan automáticamente argolla, grosor plano, altura fija y estilos incompatibles al elegir lápiz.
* Motivo: evitar combinaciones inválidas y presentar únicamente los controles que afectan al túnel longitudinal.
* Relación: amplía el estado de producto registrado inmediatamente antes.
* Resultado: ⚠️ interacción integrada; generación, persistencia y exportación pendientes.

## [2026-08-06]

* Archivo: `generador-llaveros-3d/assets/app/creador.js`
* Cambio: el estado persistente incorpora el tipo de producto, diámetro universal de lápiz de 8.6 mm, pared de 1.4 mm y altura estructural efectiva.
* Motivo: separar las dimensiones funcionales del lápiz de las de la argolla y del grosor plano del llavero.
* Relación: prepara la integración de interfaz y geometría del nuevo modo.
* Resultado: ⚠️ estado añadido; manejadores y reconstrucción pendientes.

## [2026-08-06]

* Archivo: `generador-llaveros-3d/assets/app/geometria.js`
* Cambio: el constructor para lápiz expone por separado la altura estructural anterior al relieve (`baseThickness`).
* Motivo: permitir que la interfaz calcule la pausa de cambio de color exactamente sobre el túnel, no con el grosor antiguo del llavero.
* Relación: precisión de salida posterior a la primera implementación de `buildPencilNameTile`.
* Resultado: ✅ metadato geométrico disponible para la lógica de impresión.

## [2026-08-06]

* Archivo: `generador-llaveros-3d/assets/app/estilos.css`
* Cambio: se diseñaron los estados visuales, foco, distribución responsive y jerarquía de los selectores de producto y ajuste de lápiz.
* Motivo: integrar el modo nuevo con el lenguaje visual y la accesibilidad existentes, manteniendo controles utilizables en escritorio y móvil.
* Relación: acompaña el marcado de producto añadido a `index.html`.
* Resultado: ✅ estilos integrados con selección visible y adaptación móvil a una columna.

## [2026-08-06]

* Archivo: `generador-llaveros-3d/index.html`
* Cambio: se añadió el selector Llavero/Nombre para lápiz, tres ajustes dimensionales (8.3, 8.6 y 10.6 mm), controles de diámetro y pared, explicación del túnel sin soportes e identificadores para adaptar los controles existentes según el producto.
* Motivo: hacer visible y configurable el nuevo modo sin mezclar la argolla del llavero con el agujero longitudinal del lápiz.
* Relación: interfaz para `buildPencilNameTile`; el valor universal de 8.6 mm deriva del máximo normal de 8.2 mm documentado por STAEDTLER y de la holgura necesaria en FDM.
* Resultado: ⚠️ marcado integrado; estilos, comportamiento y regeneración desde la plantilla pendientes.

## [2026-08-06]

* Archivo: `generador-llaveros-3d/assets/app/geometria.js`
* Cambio: se añadió `buildPencilNameTile`, que construye nombres en mayúsculas alrededor de un túnel longitudinal con sección de gota, techo tangente a 45°, paredes configurables, piel frontal/posterior, alas estructurales y entradas ensanchadas 0.35 mm.
* Motivo: crear adornos para lápices como una sola pieza, sin argolla y con un hueco continuo imprimible acostado sin soportes.
* Relación: solución nueva para la herramienta web; reutiliza el flujo de contornos y sólidos cerrados del generador, pero no repite los adornos 3MF externos de Pepo/Bely ni depende de perforaciones posteriores.
* Resultado: ⚠️ geometría implementada; integración de interfaz, perfil Bambu y validación visual pendientes.

## [2026-08-06]

* Archivo: `output/pdf/Cotizacion-Lithora3D-Patricia-y-Eduardo-650-MXN.pdf`
* Cambio: se verifico la version con anticipo mediante render PNG a 160 dpi y extraccion de texto.
* Motivo: comprobar que el 50%, los $325.00 MXN, el saldo contra entrega y el total de $650.00 MXN sean visibles, correctos y no generen solapamientos.
* Relacion: validacion final de la condicion de pago agregada en esta iteracion.
* Resultado: ✅ una pagina, composicion limpia y datos comerciales confirmados.

## [2026-08-06]

* Archivo: `output/pdf/Cotizacion-Lithora3D-Patricia-y-Eduardo-650-MXN.pdf`
* Cambio: se regenero la cotizacion para mostrar anticipo del 50% ($325.00 MXN) y saldo contra entrega.
* Motivo: sustituir el documento anterior con la condicion de pago solicitada.
* Relacion: salida del generador actualizado inmediatamente antes; total de $650 MXN sin cambios.
* Resultado: ✅ PDF actualizado; validacion visual pendiente.

## [2026-08-06]

* Archivo: `tools/generate_quote_patricia_eduardo.py`
* Cambio: se agrego al resumen financiero el anticipo del 50% equivalente a $325.00 MXN y se indico que el saldo se cubre contra entrega.
* Motivo: incorporar la condicion de pago solicitada en la cotizacion.
* Relacion: actualiza exclusivamente las condiciones comerciales del PDF aprobado; conserva imagen, total y modalidad de entrega.
* Resultado: ✅ generador actualizado; regeneracion y revision visual pendientes.

## [2026-08-06]

* Archivo: `output/pdf/Cotizacion-Lithora3D-Patricia-y-Eduardo-650-MXN.pdf`
* Cambio: se valido la salida final mediante render PNG a 160 dpi y extraccion independiente de texto.
* Motivo: confirmar una sola pagina, composicion legible, imagen correcta, folio sin superposicion, total de $650.00 MXN y condicion de entrega "Punto medio / a revisar".
* Relacion: cierra la correccion del encabezado detectada en la primera inspeccion.
* Resultado: ✅ PDF final aprobado visualmente y con los cuatro datos criticos presentes.

## [2026-08-06]

* Archivo: `output/pdf/Cotizacion-Lithora3D-Patricia-y-Eduardo-650-MXN.pdf`
* Cambio: se regenero el PDF con el folio corregido en el encabezado.
* Motivo: sustituir la primera salida que presentaba texto superpuesto.
* Relacion: aplica la correccion visual registrada inmediatamente antes; conserva total de $650 MXN y entrega en punto medio a revisar.
* Resultado: ✅ PDF actualizado; segunda inspeccion visual pendiente.

## [2026-08-06]

* Archivo: `tools/generate_quote_patricia_eduardo.py`
* Cambio: se unifico el folio del encabezado en una sola cadena alineada a la derecha.
* Motivo: la primera inspeccion PNG mostro el numero de folio duplicado y superpuesto.
* Relacion: correccion visual posterior a la primera generacion del PDF; no altera imagen, importe ni condiciones.
* Resultado: ✅ defecto del encabezado corregido en el generador; regeneracion pendiente.

## [2026-08-06]

* Archivo: `output/pdf/Cotizacion-Lithora3D-Patricia-y-Eduardo-650-MXN.pdf`
* Cambio: se genero la cotizacion de una pagina con la imagen proporcionada en el espacio de vista del modelo, una partida por $650 MXN y entrega en punto medio con ubicacion a revisar.
* Motivo: entregar un documento comercial listo para compartir con el cliente.
* Relacion: primera ejecucion de `tools/generate_quote_patricia_eduardo.py`.
* Resultado: ✅ PDF generado correctamente; inspeccion visual y validacion de contenido pendientes.

## [2026-08-06]

* Archivo: `tools/generate_quote_patricia_eduardo.py`
* Cambio: los marcadores de la lista usan un signo ASCII compatible con Helvetica en lugar de un glifo no garantizado.
* Motivo: evitar cuadros negros o caracteres faltantes al renderizar el PDF.
* Relacion: ajuste preventivo de calidad sobre el generador recien creado.
* Resultado: ✅ compatibilidad tipografica mejorada; ejecucion pendiente.

## [2026-08-06]

* Archivo: `tools/generate_quote_patricia_eduardo.py`
* Cambio: se creo un generador reproducible de una pagina para la cotizacion del letrero personalizado "Patricia y Eduardo", con total de $650 MXN, imagen de referencia configurable y entrega en punto medio con ubicacion a revisar.
* Motivo: generar la cotizacion solicitada sin modificar ni reutilizar datos de las cotizaciones anteriores.
* Relacion: adopta la estructura visual de la plantilla Lithora existente, pero usa ReportLab y argumentos explicitos para la imagen y el archivo de salida.
* Resultado: ✅ generador creado; ejecucion y revision visual pendientes.

## [2026-08-06]

* Archivo: `artifacts/bienvenidos_480mm/*`
* Cambio: se regeneraron definitivamente las dos mitades con lengüetas caligráficas y puentes posteriores mínimos por encima de las cavidades.
* Motivo: obtener los entregables finales como sólidos únicos, cerrados y con el ensamble oculto.
* Relación: tercera iteración del ensamble; reemplaza todos los 3MF/STL parciales anteriores de la carpeta.
* Resultado: ✅ dos mallas estancas y de un cuerpo, 4.904/4.538 caras, paquetes ZIP íntegros y dimensiones compatibles con la cama A1.

## [2026-08-06]

* Archivo: `tools/split_bienvenidos_sign.py`
* Cambio: se eliminó la placa rectangular posterior y se sustituyó por puentes mínimos calculados entre contornos, colocados entre Z=3,45 y 4,65 mm por encima de las cavidades.
* Motivo: mantener un solo cuerpo en la mitad derecha sin rellenar el encastre ni reintroducir una forma visible fuera de la caligrafía.
* Relación: corrige los tres cuerpos detectados tras aplicar lengüetas con perfil oculto; deja 5,35 mm de material frontal sobre los puentes.
* Resultado: ✅ conexión posterior refinada; regeneración y revisión final pendientes.

## [2026-08-06]

* Archivo: `artifacts/bienvenidos_480mm/*`
* Cambio: se regeneraron los entregables con lengüetas de perfil caligráfico; las dos mallas permanecen cerradas y los paquetes tienen CRC válido.
* Motivo: validar la solución de ensamble oculto posterior a la revisión visual.
* Relación: primera ejecución del perfil oculto; la cavidad con holgura separó dos pequeños trazos en la mitad derecha.
* Resultado: ⚠️ parcial; la izquierda es un cuerpo, pero la derecha reporta tres cuerpos y requiere puentes posteriores adicionales fuera de la cavidad.

## [2026-08-06]

* Archivo: `tools/split_bienvenidos_sign.py`
* Cambio: las lengüetas posteriores dejaron de ser rectángulos y ahora reproducen exactamente los dos trazos caligráficos existentes entre X=238 y X=252 mm; las cavidades se derivan de ese perfil con 0,25 mm de holgura.
* Motivo: ocultar totalmente el encastre detrás de la silueta frontal y eliminar el rectángulo visible detectado en la miniatura.
* Relación: mejora estética directa tras rechazar la primera forma del ensamble; conserva dos puntos de unión, 12 mm de penetración y 3,2 mm de profundidad.
* Resultado: ✅ perfil oculto implementado; regeneración y nueva inspección pendientes.

## [2026-08-06]

* Archivo: inspección de `artifacts/bienvenidos_480mm/Bienvenidos_480mm_A1_ensamble_preview.png`
* Cambio: se revisó frontalmente la silueta ensamblada y se detectó que las lengüetas rectangulares sobresalen en un hueco caligráfico junto al corte.
* Motivo: verificar que el encastre posterior cumpla la condición de no verse desde el frente.
* Relación: control visual posterior a la corrección topológica; la malla es válida, pero el perfil rectangular no es aceptable estéticamente.
* Resultado: ❌ ensamble rechazado para entrega; se requiere que las lengüetas sigan exactamente la silueta de los trazos existentes.

## [2026-08-06]

* Archivo: `artifacts/bienvenidos_480mm/*`
* Cambio: se regeneraron ambas mitades STL/3MF y la miniatura con el puente posterior y la topología corregidos.
* Motivo: reemplazar el resultado parcial no estanco antes de cualquier rebanado o entrega.
* Relación: aplica la corrección del generador registrada inmediatamente antes; dimensiones y tolerancia del ensamble permanecen iguales.
* Resultado: ✅ ambas mitades son estancas, de orientación consistente y un solo cuerpo; los dos paquetes 3MF tienen CRC íntegro.

## [2026-08-06]

* Archivo: `tools/split_bienvenidos_sign.py`
* Cambio: se añadió un puente posterior local en la mitad derecha antes de tallar la cavidad y se preservan directamente los índices estancos producidos por Manifold sin la fusión automática de Trimesh.
* Motivo: el primer resultado dejó un pequeño trazo separado junto al corte y el posprocesamiento abrió artificialmente la malla izquierda.
* Relación: corrige los dos hallazgos del reporte parcial; el puente queda detrás y la resta posterior mantiene libre la holgura del ensamble.
* Resultado: ✅ topología corregida en el generador; regeneración y verificación pendientes.

## [2026-08-06]

* Archivo: `artifacts/bienvenidos_480mm/*`
* Cambio: se generaron las dos mitades STL/3MF, miniatura y reporte del letrero de 480 mm con ensamble posterior.
* Motivo: comprobar dimensiones de cama, empaquetado y topología antes de entregar.
* Relación: primera ejecución de `tools/split_bienvenidos_sign.py`; ambos ZIP resultaron íntegros y las piezas miden 252 × 185 × 10 mm y 240 × 139,04 × 10 mm.
* Resultado: ⚠️ parcial; la parte izquierda quedó reportada como no estanca y la derecha conserva dos cuerpos, por lo que deben corregirse y regenerarse antes de rebanar.

## [2026-08-06]

* Archivo: `tools/split_bienvenidos_sign.py`
* Cambio: se creó un generador limpio de 480 × 185 × 10 mm que divide “Bienvenidos” en dos proyectos A1 e incorpora dos lengüetas macho–hembra posteriores de 12 mm con 0,25 mm de holgura lateral; también genera STL, miniatura y reporte.
* Motivo: permitir imprimir el letrero grande en dos camas de la Bambu Lab A1 y ensamblarlo con precisión sin mostrar el encastre desde el frente.
* Relación: sustituye la entrega de una sola pieza de 245 mm solicitada inicialmente; conserva la tipografía original elegida y mejora la malla mediante contornos sólidos Manifold antes del empaquetado Bambu.
* Resultado: ⚠️ generador de dos piezas creado; ejecución, inspección visual y validación pendientes.

## [2026-08-06]

* Archivo: `tools/build_bienvenidos_sign_blender.py`
* Cambio: los materiales del render localizan el shader Principled por tipo `BSDF_PRINCIPLED` en vez de depender del nombre visible del nodo.
* Motivo: Blender 4.5 no devolvió el nodo mediante el nombre esperado y detuvo la vista previa.
* Relación: corrige exclusivamente el segundo intento fallido; no altera la malla STL ya producida.
* Resultado: ✅ compatibilidad de materiales corregida; regeneración completa pendiente.

## [2026-08-06]

* Archivo: ejecución de `tools/build_bienvenidos_sign_blender.py`, `artifacts/bienvenidos/Bienvenidos_Lithora_245x95x8mm_A1.stl`
* Cambio: la segunda generación creó el STL, pero el render se detuvo al buscar el nodo de material con el nombre anterior `Principled BSDF` en Blender 4.5 en español.
* Motivo: ejecutar la geometría corregida y generar la vista previa necesaria para el proyecto 3MF.
* Relación: supera el fallo de argumentos anterior; requiere localizar el nodo por tipo en lugar de nombre localizado.
* Resultado: ⚠️ STL parcial creado; PNG, 3MF y reporte todavía no generados.

## [2026-08-06]

* Archivo: `tools/build_bienvenidos_sign_blender.py`
* Cambio: la lectura de parámetros posteriores a `--` usa ahora `sys.argv`, que Blender expone en modo background.
* Motivo: corregir el fallo de la primera ejecución causado por el atributo inexistente `bpy.app.argv`.
* Relación: mejora directa del intento fallido inmediatamente anterior; no cambia dimensiones, tipografía ni perfil de impresión.
* Resultado: ✅ corrección aplicada; nueva generación pendiente.

## [2026-08-06]

* Archivo: ejecución de `tools/build_bienvenidos_sign_blender.py`
* Cambio: se intentó la primera generación en Blender 4.5.10; el proceso se detuvo antes de crear modelos al consultar argumentos mediante `bpy.app.argv`, atributo inexistente.
* Motivo: validar el generador y producir los entregables del letrero.
* Relación: primera ejecución del generador recién creado; no debe repetirse sin cambiar la lectura de argumentos a `sys.argv`.
* Resultado: ❌ generación detenida antes de exportar el STL o 3MF; solo pudo crearse la carpeta de salida vacía.

## [2026-08-06]

* Archivo: `tools/build_bienvenidos_sign_blender.py`
* Cambio: se creó un generador Blender reproducible para un letrero cursivo original “Bienvenidos” de 245 × 95 × 8 mm, con exportación STL, proyecto 3MF para Bambu Lab A1, render y reporte dimensional.
* Motivo: producir una alternativa propia y comercializable inspirada en la referencia, sin reutilizar el modelo de MakerWorld cuya licencia prohíbe la venta.
* Relación: reutiliza el flujo validado de empaquetado, miniaturas y perfil A1 registrado para los proyectos Bely/Pepo, con geometría nueva y una sola pieza marfil.
* Resultado: ⚠️ generador creado; ejecución, revisión visual y rebanado pendientes.

## [2026-08-01]

* Archivo: auditoría final de `Bely_Adorno_Lapiz_50mm_PROYECTO_BAMBU.3mf`
* Cambio: se verificaron estructura y CRC del proyecto, equivalencia binaria de geometría y perfiles, nombres internos, colores, cierre, orientación, componentes, diámetros reales por sección y carga directa con Bambu Studio 02.07.01.62.
* Motivo: confirmar que el proyecto multicolor conserva el ajuste después del remallado y puede abrirse en el laminador de destino.
* Relación: cierre técnico posterior a la exportación y revisión visual de Bely.
* Resultado: ✅ 421,354 vértices, 842,756 caras, un componente cerrado, cuatro colores; cuello real 8.69 mm, D8.15 a Z=7, D7.54 a Z=9, D7.08 a Z=10.5 y D6.92 a Z=11; Bambu Studio finalizó con código 0.

## [2026-08-01]

* Archivo: `C:\Users\yarteaga\Documents\Personal\Negocios\03-modelos\adorno_lapiz\Bely_Adorno_Lapiz_50mm_PROYECTO_BAMBU.3mf`
* Cambio: se creó la copia final de proyecto con nombre interno y placa `Bely Adorno Lapiz 50mm`, fuente descriptiva, cuatro perfiles de filamento y pintado conservado.
* Motivo: permitir abrir directamente la pieza terminada como proyecto multicolor de Bambu Lab.
* Relación: reutiliza sin volver a remallar el `bely_adornolapiz_50mm_COLORES.3mf` revisado visualmente.
* Resultado: ✅ proyecto Bambu creado con 9,002,614 bytes; archivos fuente y técnico intactos; auditoría final pendiente.

## [2026-08-01]

* Archivo: `C:\Users\yarteaga\Documents\Personal\Negocios\03-modelos\adorno_lapiz\bely_adornolapiz_50mm_preview.png`, `bely_adornolapiz_50mm_socket.png`
* Cambio: Blender 4.5 generó una vista a color de Bely colocada sobre un lápiz hexagonal de 7.5 mm y una vista inferior técnica del socket.
* Motivo: verificar escala, distribución de colores, orientación y apertura del agujero antes de empaquetar el proyecto Bambu.
* Relación: evidencia visual del 3MF de Bely creado inmediatamente antes.
* Resultado: ✅ dos renders claros de 720 × 720 px; revisión visual pendiente.

## [2026-08-01]

* Archivo: `C:\Users\yarteaga\Documents\Personal\Negocios\03-modelos\adorno_lapiz\bely_adornolapiz_50mm_COLORES.3mf`, `bely_adornolapiz_50mm.stl`, `bely_adornolapiz_50mm_validacion.json`
* Cambio: se redujo Bely a 50.07 mm, consolidaron sus 33 superficies en un sólido, talló un socket Ø8.8→6.8 mm de 11.5 mm y transfirieron los cuatro códigos de pintura originales.
* Motivo: obtener el mismo tipo de adorno funcional y multicolor entregado para Pepo, adaptado a la cintura más estrecha de Bely.
* Relación: primera ejecución posterior al criterio de radio variable y al parámetro de profundidad específico.
* Resultado: ✅ 42.385 × 30.193 × 50.068 mm; 842,756 caras; un componente cerrado y orientado; pared mínima 2.362 mm; cuatro colores conservados.

## [2026-08-01]

* Archivo: `tools/build_pepo_pencil_topper.py`
* Cambio: se añadió `--socket-depth` para ajustar la profundidad sin duplicar ni editar constantes específicas por personaje.
* Motivo: Bely necesita 11.5 mm para mantener la pared de su cintura, mientras Pepo conserva su diseño validado de 12.5 mm.
* Relación: completa la generalización por prefijo y altura registrada inmediatamente antes.
* Resultado: ✅ profundidad parametrizable; ejecución de Bely pendiente.

## [2026-08-01]

* Archivo: análisis de `C:\Users\yarteaga\Documents\Personal\Negocios\03-modelos\adorno_lapiz\bely.3mf`
* Cambio: se probó en memoria la geometría de Pepo sin modificar archivos y la validación rechazó el socket al exigir erróneamente el radio máximo de entrada durante toda la profundidad.
* Motivo: comprobar si Bely podía reutilizar exactamente los parámetros de Pepo antes de exportar.
* Relación: Bely contiene 33 superficies abiertas y una cintura más estrecha; a 50 mm mostró 6.03 mm de radio disponible frente a una exigencia constante de 6.40 mm.
* Resultado: ❌ prueba rechazada correctamente y sin archivos generados; se requiere validación por radio variable.

## [2026-08-01]

* Archivo: `tools/build_pepo_pencil_topper.py`, `tools/render_pepo_topper_blender.py`
* Cambio: el constructor acepta ahora prefijo y altura de salida, y elige el eje comparando capa por capa el radio real del cono más 2 mm de pared; el renderizador deriva nombres de salida del 3MF recibido.
* Motivo: reutilizar el flujo validado sin duplicar scripts y adaptar correctamente la sección estrecha de Bely.
* Relación: mejora el criterio constante que produjo el falso rechazo durante el análisis inicial, conservando la medición radial final independiente.
* Resultado: ✅ herramientas generalizadas; compilación y construcción de Bely pendientes.

## [2026-08-01]

* Archivo: validación de `Pepo_Adorno_Lapiz_50mm_PROYECTO_BAMBU.3mf`
* Cambio: se verificaron integridad ZIP, estructura de proyecto, nombres internos, sincronización de 685,588 caras, cuatro códigos de pintura y equivalencia binaria de geometría y configuración de filamentos con el 3MF aprobado.
* Motivo: confirmar que la copia renombrada abre como proyecto sin alterar el modelo ni su asignación multicolor.
* Relación: validación final del proyecto Bambu creado inmediatamente antes; una ejecución oculta de la aplicación fue inestable, mientras la invocación directa terminó correctamente.
* Resultado: ✅ siete entradas 3MF válidas, CRC limpio, geometría y `project_settings.config` idénticos al archivo base, nombres presentes tres veces y Bambu Studio directo finalizado sin error de shell.

## [2026-08-01]

* Archivo: `C:\Users\yarteaga\Documents\Personal\Negocios\03-modelos\adorno_lapiz\Pepo_Adorno_Lapiz_50mm_PROYECTO_BAMBU.3mf`
* Cambio: se generó una copia de proyecto Bambu Studio con nombre interno `Pepo Adorno Lapiz 50mm`, placa identificada, fuente descriptiva, cuatro perfiles de filamento y pintado original conservados.
* Motivo: entregar un archivo 3MF reconocible que pueda abrirse directamente como proyecto de Bambu Lab.
* Relación: reutiliza sin remallar el `pepo_adornolapiz_50mm_COLORES.3mf` ya validado, por lo que conserva exactamente geometría, socket y colores.
* Resultado: ✅ proyecto creado con 7,321,106 bytes; originales intactos; validación final pendiente.

## [2026-08-01]

* Archivo: auditoría final de `pepo_adornolapiz_50mm_COLORES.3mf`
* Cambio: se verificaron integridad ZIP/XML, conteo de caras sincronizado, cuatro códigos de color, cierre, orientación, número de componentes, diámetros reales por sección y carga mediante Bambu Studio 02.07.01.62.
* Motivo: confirmar que el remallado y reempaquetado producen un archivo imprimible y que el socket conserva sus medidas después del suavizado.
* Relación: cierre técnico posterior a la revisión visual clara en Blender.
* Resultado: ✅ ZIP sin errores; 342,796 vértices y 685,588 caras; un componente cerrado; Bambu Studio terminó con código 0; diámetro real 8.69 mm en el cuello, 8.24 mm a Z=7, 7.70 mm a Z=9, 7.18 mm a Z=11 y 6.91 mm a Z=12.

## [2026-08-01]

* Archivo: `C:\Users\yarteaga\Documents\Personal\Negocios\03-modelos\adorno_lapiz\pepo_adornolapiz_50mm_preview.png`, `pepo_adornolapiz_50mm_socket.png`
* Cambio: se regeneraron ambas vistas con iluminación técnica clara y realce de cavidades.
* Motivo: sustituir la evidencia oscura de la primera pasada sin alterar el modelo final.
* Relación: aplica el ajuste Workbench registrado inmediatamente antes.
* Resultado: ✅ renders sustituidos correctamente por versiones legibles; revisión visual final pendiente.

## [2026-08-01]

* Archivo: `tools/render_pepo_topper_blender.py`
* Cambio: las vistas de control usan ahora Workbench con iluminación de estudio, colores de material, sombras, cavidades y fondo gris claro.
* Motivo: el primer render Eevee confirmó la geometría y la apertura del socket, pero quedó demasiado oscuro para evaluar con precisión los cuatro colores.
* Relación: ajuste exclusivo de evidencia visual; no modifica el 3MF, STL, dimensiones ni pintado.
* Resultado: ✅ configuración de inspección corregida; regeneración pendiente.

## [2026-08-01]

* Archivo: `C:\Users\yarteaga\Documents\Personal\Negocios\03-modelos\adorno_lapiz\pepo_adornolapiz_50mm_preview.png`, `pepo_adornolapiz_50mm_socket.png`
* Cambio: Blender 4.5 generó una vista del Pepo pintado colocado sobre un lápiz hexagonal de 7.5 mm y una vista inferior independiente del agujero.
* Motivo: comprobar visualmente la proporción del adorno, la conservación aparente de colores y que el socket quede abierto y accesible desde la base.
* Relación: evidencia visual del 3MF compacto creado inmediatamente antes.
* Resultado: ✅ dos renders de 720 × 720 px creados; revisión visual pendiente.

## [2026-08-01]

* Archivo: `C:\Users\yarteaga\Documents\Personal\Negocios\03-modelos\adorno_lapiz\pepo_adornolapiz_50mm_COLORES.3mf`, `pepo_adornolapiz_50mm.stl`, `pepo_adornolapiz_50mm_validacion.json`
* Cambio: se generó Pepo a 50.07 mm de alto como un sólido único con socket cónico Ø8.8→6.8 mm y se transfirieron los cuatro códigos `paint_color` del original.
* Motivo: obtener un adorno proporcionado que encaje en lápices tradicionales sin perder el pintado preparado para Bambu Studio.
* Relación: resultado de la segunda ejecución tras corregir la medición radial de pared; el original `pepo.3mf` permanece intacto.
* Resultado: ✅ 40.619 × 34.009 × 50.070 mm; 685,588 caras; malla cerrada, orientación consistente, un componente, pared mínima 3.649 mm y cuatro colores conservados.

## [2026-08-01]

* Archivo: ejecución de `tools/build_pepo_pencil_topper.py`
* Cambio: la primera construcción se detuvo antes de exportar al reportar 1.76 mm de pared mediante una distancia tridimensional.
* Motivo: validar de forma conservadora que el socket no debilitara a Pepo.
* Relación: primera prueba del constructor creado para `pepo.3mf`; la inspección mostró que la distancia seguía en diagonal hacia la boca abierta y no representaba el espesor lateral.
* Resultado: ❌ validación rechazada correctamente; no se creó ni sobrescribió ningún 3MF.

## [2026-08-01]

* Archivo: `tools/build_pepo_pencil_topper.py`
* Cambio: la pared del socket se mide ahora radialmente en cada sección XY entre 2 mm y 12.5 mm de altura, descartando la distancia diagonal hacia la entrada inferior.
* Motivo: medir el espesor que realmente resiste la presión del lápiz sin confundirlo con la abertura funcional del modelo.
* Relación: corrige exclusivamente el falso negativo de 1.76 mm de la primera ejecución; conserva escala, eje, socket y límite mínimo de 2 mm.
* Resultado: ✅ validación geométrica corregida; nueva ejecución pendiente.

## [2026-08-01]

* Archivo: `tools/build_pepo_pencil_topper.py`
* Cambio: se creó un flujo reproducible para reducir Pepo a 50 mm, consolidar sus 14 superficies abiertas, localizar automáticamente el eje con mayor espesor, tallar un socket cónico para lápices tradicionales y reempaquetar el 3MF conservando `paint_color`.
* Motivo: convertir `pepo.3mf` en un adorno de lápiz proporcionado sin atravesar la figura ni perder sus cuatro colores.
* Relación: mejora la geometría cónica ya validada en los toppers Bely y Sunny Bow al medir primero la pared disponible específica de Pepo.
* Resultado: ⚠️ automatización creada; ejecución y validación pendientes.

## [2026-08-01]

* Archivo: `tools/render_pepo_topper_blender.py`
* Cambio: se creó un renderizador en Blender 4.5 que reconstruye el pintado del 3MF, muestra el adorno colocado sobre un lápiz hexagonal de 7.5 mm y genera una vista inferior del socket.
* Motivo: verificar visualmente escala, orientación, colores y acceso al agujero antes de entregar.
* Relación: complementa el nuevo constructor de Pepo sin modificar la geometría durante el render.
* Resultado: ⚠️ herramienta creada; ejecución y revisión visual pendientes.

## [2026-07-29]

* Archivo: Amazon SES SMTP `us-east-2`, campaña `promocion-inicial-2026`
* Cambio: finalizaron las seis etapas de la campaña gradual personalizada.
* Motivo: completar el envío autorizado a los 6,256 destinatarios utilizables.
* Relación: el ciclo de recuperación superó 15 interrupciones SMTP temporales sin detener la campaña ni duplicar entradas confirmadas.
* Resultado: ✅ 6,255 mensajes aceptados por AWS SES; un destinatario rechazado explícitamente; proceso finalizado y todas las etapas conciliadas.

## [2026-07-29]

* Archivo: Amazon SES SMTP `us-east-2`, campaña `promocion-inicial-2026`
* Cambio: se reanudó la campaña desde los 1,100 aceptados utilizando el nuevo ciclo de reconexión automática.
* Motivo: continuar todas las etapas sin detenerse ante futuras interrupciones temporales de red.
* Relación: primera ejecución real posterior a las ocho pruebas de recuperación; omite automáticamente etapas y destinatarios ya registrados.
* Resultado: ⚠️ campaña activa; primera comprobación con 1,122 aceptados totales, etapa 4 en curso y registro de errores vacío.

## [2026-07-29]

* Archivo: recuperación automática de campaña SES
* Cambio: se ejecutaron ocho pruebas y compilación, incluyendo una desconexión simulada seguida de reconexión y aceptación del mismo destinatario.
* Motivo: validar que la campaña no vuelva a detenerse por una caída temporal de red.
* Relación: comprobación final del nuevo comportamiento de `send_stage` antes de reanudar desde 1,100 aceptados.
* Resultado: ✅ 8 pruebas aprobadas; una sola entrada en bitácora tras el reintento simulado; cero conexiones reales durante la prueba.

## [2026-07-29]

* Archivo: `tests/test_campana_email_ses.py`
* Cambio: se añadió una prueba que simula una desconexión, exige abrir una segunda sesión SMTP y confirma que el mismo destinatario termina registrado una sola vez.
* Motivo: comprobar automáticamente la recuperación solicitada sin conectarse a AWS ni enviar correos reales.
* Relación: cubre el nuevo ciclo de reconexión y espera progresiva de `send_stage`.
* Resultado: ✅ escenario de desconexión incorporado; ejecución pendiente.

## [2026-07-29]

* Archivo: `scripts/campana-email-ses.py`
* Cambio: las interrupciones SMTP ya no acumulan tres fallos ni detienen la campaña; el mismo destinatario se conserva pendiente, se cierra la conexión dañada y se reintenta con una conexión nueva y espera exponencial de 2 a 60 segundos. Solo un rechazo explícito del destinatario permite avanzar sin enviarlo.
* Motivo: mantener la campaña operativa durante desconexiones temporales de la red local.
* Relación: sustituye el bloqueo tras tres errores que detuvo las etapas 3 y 4; conserva la bitácora previa de 1,100 aceptados.
* Resultado: ✅ recuperación automática incorporada; validación y reanudación pendientes.

## [2026-07-29]

* Archivo: Amazon SES SMTP `us-east-2`, campaña `promocion-inicial-2026`
* Cambio: se reanudó el ejecutor gradual después de la desconexión de red, conservando la misma bitácora y omitiendo los 600 destinatarios aceptados previamente.
* Motivo: continuar la campaña autorizada sin duplicar mensajes tras restablecerse la conexión.
* Relación: retoma los 150 pendientes de la etapa 3 y después continuará automáticamente con las etapas 4 a 6.
* Resultado: ⚠️ campaña activa nuevamente; primera comprobación con 629 aceptados totales y cero errores SMTP.

## [2026-07-29]

* Archivo: Amazon SES SMTP `us-east-2`, campaña `promocion-inicial-2026`
* Cambio: se inició el envío gradual autorizado de 6,256 mensajes personalizados en seis etapas, de forma secuencial, con intervalo de 0.5 segundos, baja administrada y bitácora anonimizada reanudable.
* Motivo: ejecutar la campaña solicitada sin liberar todos los mensajes de golpe y aprovechando los recursos de correo optimizados.
* Relación: utiliza los JPEG que redujeron el MIME a 270 KB y el ejecutor persistente que omite destinatarios ya aceptados.
* Resultado: ⚠️ campaña activa en segundo plano; instantánea al registrar: 478 aceptados (etapas 1 y 2 completas, 228 de la etapa 3), cero errores SMTP.

## [2026-07-29]

* Archivo: `scripts/Run-EmailCampaign.ps1`
* Cambio: la credencial SMTP se obtiene por la posición estable de las columnas del CSV en lugar de usar encabezados con caracteres acentuados.
* Motivo: Windows PowerShell interpretó incorrectamente `Contraseña` al cargar el script UTF-8 sin BOM y detuvo la reanudación antes de conectar con SES.
* Relación: corrige el primer intento del ejecutor persistente; la bitácora confirma que la campaña continúa en 50 aceptados.
* Resultado: ✅ lectura independiente de la codificación de encabezados; reanudación pendiente.

## [2026-07-29]

* Archivo: `scripts/Run-EmailCampaign.ps1`
* Cambio: se añadió un ejecutor persistente para recorrer las seis etapas, cargar las credenciales solo en variables de proceso, detenerse ante errores y limpiar los secretos al finalizar.
* Motivo: la ventana temporal de la primera consola terminó después de completar la etapa 1 y antes de iniciar la 2.
* Relación: reutiliza la bitácora anonimizada de `promocion-inicial-2026`, por lo que los 50 mensajes ya aceptados se omiten al reanudar.
* Resultado: ✅ reanudación segura preparada; no se duplicaron destinatarios.

## [2026-07-29]

* Archivo: `scripts/campana-email-ses.py`
* Cambio: durante un envío real se informa cada 25 destinatarios el total procesado y aceptado, sin mostrar correos ni nombres.
* Motivo: poder supervisar la campaña gradual y detectar detenciones sin exponer datos personales.
* Relación: mantiene intacta la bitácora anonimizada y el mecanismo reanudable por campaña/etapa.
* Resultado: ✅ progreso agregado incorporado; no se realizó ningún envío.

## [2026-07-29]

* Archivo: optimización de recursos de campaña SES
* Cambio: se ejecutaron siete pruebas, compilación, simulación de destinatarios y medición completa del mensaje MIME optimizado.
* Motivo: verificar calidad operativa, personalización, tipos de imagen y peso antes de cualquier envío real.
* Relación: validación final de los JPEG de campaña y del constructor MIME actualizado.
* Resultado: ✅ 7 pruebas aprobadas; 6,256 destinatarios con saludo personalizado; MIME de 270,134 bytes frente a 3,414,441 bytes anteriores (92.09% menos); cero conexiones SMTP.

## [2026-07-29]

* Archivo: `tests/test_campana_email_ses.py`
* Cambio: se añadió una prueba que exige dos recursos `image/jpeg` en el mensaje predeterminado y un MIME total menor a 300 KB.
* Motivo: impedir que futuras modificaciones vuelvan accidentalmente a incrustar las imágenes PNG pesadas.
* Relación: cubre los nuevos valores `DEFAULT_LOGO`, `DEFAULT_HERO` y la selección dinámica del subtipo MIME.
* Resultado: ✅ protección automatizada incorporada; ejecución final pendiente.

## [2026-07-29]

* Archivo: `scripts/campana-email-ses.py`
* Cambio: los recursos CID predeterminados apuntan ahora a las copias JPEG optimizadas y el tipo MIME/nombre adjunto se determina según la extensión del archivo.
* Motivo: incorporar realmente los recursos ligeros en cada envío y conservar compatibilidad con sustituciones PNG mediante `--logo` o `--hero`.
* Relación: activa los dos recursos optimizados creados inmediatamente antes sin alterar sus CID ni el HTML.
* Resultado: ✅ constructor preparado para enviar JPEG optimizados como `image/jpeg`; no se realizó ningún envío.

## [2026-07-29]

* Archivo: `campaign/assets/lithora3d-logo-email.jpg`, `campaign/assets/lithora3d-promocional-email.jpg`
* Cambio: se crearon copias JPEG optimizadas exclusivamente para correo; el logo se ajustó a 320 × 320 px y la creatividad a 1200 × 800 px, ambas en calidad 90 y conservando los originales.
* Motivo: reducir el peso de cada mensaje antes de enviar la campaña masiva sin degradar de forma visible la marca ni el texto promocional.
* Relación: reemplazarán dentro del MIME a los PNG originales de 816 KB y 1.70 MB usados en las pruebas previas.
* Resultado: ✅ recursos creados con pesos de 11,218 y 173,818 bytes, respectivamente; reducción conjunta aproximada del 93%.

## [2026-07-29]

* Archivo: personalización de campaña SES
* Cambio: se ejecutaron seis pruebas, compilación, simulación completa y validación de diferencias.
* Motivo: comprobar extracción, saludo, deduplicación y privacidad antes de entregar.
* Relación: validación final del flujo personalizado.
* Resultado: ✅ 6 pruebas aprobadas; 6,256 destinatarios utilizables con primer nombre confiable, 0 saludos genéricos y cero conexiones SMTP.

## [2026-07-29]

* Archivo: `EMAIL_CAMPAIGN.md`
* Cambio: se documentó que el saludo utiliza solo el primer nombre y que apellidos, teléfono y CURP permanecen fuera del mensaje.
* Motivo: dejar explícito el alcance y la protección de datos de la personalización.
* Relación: describe el comportamiento incorporado a `scripts/campana-email-ses.py`.
* Resultado: ✅ guía operativa actualizada.

## [2026-07-29]

* Archivo: `scripts/campana-email-ses.py`
* Cambio: la deduplicación y asociación de nombres se ejecutan ahora después de descartar dominios sospechosos y exclusiones.
* Motivo: impedir que nombres de direcciones no aceptadas inflen el conteo de saludos personalizados.
* Relación: ajuste preventivo detectado al revisar el nuevo mapa correo→primer nombre.
* Resultado: ✅ conteos de personalización limitados a destinatarios utilizables.

## [2026-07-29]

* Archivo: `tests/test_campana_email_ses.py`
* Cambio: se añadieron pruebas de prefijos técnicos, tratamientos, acentos, respaldo genérico y presencia del primer nombre en HTML y texto.
* Motivo: asegurar que la personalización sea correcta y no exponga el nombre completo.
* Relación: cubre la nueva extracción y el marcador `[[GREETING]]`.
* Resultado: ✅ cobertura de personalización añadida; ejecución pendiente.

## [2026-07-29]

* Archivo: `campaign/email-template.txt`
* Cambio: se añadió el marcador `[[GREETING]]` a la alternativa de texto.
* Motivo: mantener el saludo personalizado también cuando el cliente no renderiza HTML.
* Relación: acompaña el mismo marcador incorporado a la plantilla visual.
* Resultado: ✅ saludo incorporado en la versión de texto.

## [2026-07-29]

* Archivo: `campaign/email-template.html`
* Cambio: se añadió el marcador `[[GREETING]]` antes del encabezado principal con estilo integrado a la identidad visual.
* Motivo: mostrar `Hola, Nombre:` en cada mensaje HTML y `Hola:` cuando no exista un nombre confiable.
* Relación: el marcador es sustituido individualmente por el nuevo flujo de personalización.
* Resultado: ✅ saludo incorporado en la plantilla HTML.

## [2026-07-29]

* Archivo: `scripts/campana-email-ses.py`
* Cambio: se incorporó extracción segura del primer nombre, limpieza del prefijo técnico presente en el archivo, retiro de tratamientos, saludo genérico de respaldo, conteos anónimos y personalización individual durante el envío.
* Motivo: saludar a cada destinatario por su primer nombre sin utilizar apellidos, teléfono ni CURP.
* Relación: conserva la deduplicación por correo y no añade nombres a la bitácora de envíos.
* Resultado: ✅ flujo de personalización implementado; plantillas y pruebas pendientes de actualizar.

## [2026-07-29]

* Archivo: Amazon SES SMTP `us-east-2`
* Cambio: se reenvió un único correo de prueba autorizado desde `contacto@lithora3d.com` a `agaetranahoy@gmail.com` con el asunto `IMPRESION 3D EN TAMPICO, TAMAULIPAS`.
* Motivo: revisar en Gmail la plantilla final con el nuevo asunto solicitado.
* Relación: campaña de prueba etiquetada `prueba-visual-asunto-2026-07-29`; no se utilizó la lista masiva ni la bitácora de etapas.
* Resultado: ✅ Amazon SES aceptó el mensaje con código SMTP 250 e identificador `010f019faee8afdd-8e01a2d2-02c0-471c-a3e6-969a1e7901e3-000000`.

## [2026-07-29]

* Archivo: `scripts/campana-email-ses.py`
* Cambio: el asunto predeterminado se cambió exactamente a `IMPRESION 3D EN TAMPICO, TAMAULIPAS`.
* Motivo: usar el asunto solicitado para los siguientes correos de prueba o campaña.
* Relación: sustituye `Tu idea puede convertirse en una pieza real | Lithora 3D`.
* Resultado: ✅ asunto actualizado; no se realizó ningún envío.

## [2026-07-29]

* Archivo: Amazon SES SMTP `us-east-2`
* Cambio: se envió un único correo de prueba autorizado desde `contacto@lithora3d.com` hacia `agaetranahoy@gmail.com` con la plantilla final, logo, creatividad promocional, ubicación, envíos nacionales, CTA de WhatsApp y baja administrada.
* Motivo: permitir la revisión visual real en Gmail antes de iniciar cualquier campaña.
* Relación: no utilizó la lista de contactos ni la bitácora de etapas; campaña etiquetada como `prueba-visual-2026-07-29`.
* Resultado: ✅ Amazon SES aceptó el mensaje con código SMTP 250 e identificador `010f019faedc6363-2b3ba293-de50-47b1-9ddc-9bba90638ea0-000000`.

## [2026-07-29]

* Archivo: `scripts/campana-email-ses.py`
* Cambio: los mensajes ahora incluyen encabezados estándar `Date` y `Message-ID` bajo el dominio `lithora3d.com`.
* Motivo: completar el formato MIME profesional antes del primer envío de prueba autorizado.
* Relación: se aplica tanto a pruebas individuales como a futuras etapas de campaña.
* Resultado: ✅ encabezados añadidos; envío de prueba pendiente.

## [2026-07-29]

* Archivo: plantillas de campaña SES
* Cambio: se ejecutaron compilación, validación de diferencias, cuatro pruebas y comprobación DOM móvil de los nuevos datos y CTA.
* Motivo: cerrar el cambio verificando contenido, número y presentación sin enviar mensajes.
* Relación: validación final de la ubicación, cobertura nacional y WhatsApp `+52 833 532 7971`.
* Resultado: ✅ 4 pruebas aprobadas; botón y textos visibles, cero conexiones SMTP.

## [2026-07-29]

* Archivo: `audits/email-template-mobile-cta.png`
* Cambio: se capturó la sección móvil con ubicación, cobertura nacional y los botones de cotización y WhatsApp.
* Motivo: validar el apilado y legibilidad de los nuevos elementos sin depender de una captura completa que agotó el tiempo de Chrome.
* Relación: evidencia focalizada del último cambio de la plantilla HTML.
* Resultado: ✅ sección final móvil capturada con Chrome DevTools.

## [2026-07-29]

* Archivo: `tests/test_campana_email_ses.py`
* Cambio: se añadió una prueba que exige la ubicación, la cobertura nacional y el nuevo número de WhatsApp en ambas plantillas, además de rechazar el número anterior.
* Motivo: evitar que futuras ediciones reviertan accidentalmente los datos de contacto solicitados.
* Relación: cubre los cambios de `campaign/email-template.html` y `.txt`.
* Resultado: ✅ cobertura automatizada añadida; ejecución pendiente.

## [2026-07-29]

* Archivo: `campaign/email-template.txt`
* Cambio: se actualizó el contacto de WhatsApp al `+52 833 532 7971` y se incorporaron la ubicación en Tampico y los envíos nacionales.
* Motivo: mantener la alternativa de texto sincronizada con el HTML.
* Relación: acompaña el nuevo CTA y mensaje de cobertura de la plantilla visual.
* Resultado: ✅ versión de texto actualizada.

## [2026-07-29]

* Archivo: `campaign/email-template.html`
* Cambio: se añadió la ubicación en Tampico, Tamaulipas, México, la cobertura de envíos a toda la República Mexicana y un botón verde de contacto por WhatsApp al `+52 833 532 7971`.
* Motivo: comunicar el alcance nacional del negocio y ofrecer un canal de conversión directo y visible.
* Relación: reemplaza el enlace de texto y el número de WhatsApp anterior dentro del correo.
* Resultado: ✅ ubicación, cobertura y nuevo CTA de WhatsApp integrados.

## [2026-07-29]

* Archivo: correo promocional SES de Lithora 3D
* Cambio: se validaron pruebas, compilación, MIME, recursos predeterminados, baja administrada y vistas de escritorio/móvil con los archivos finales.
* Motivo: confirmar que el logo y la creatividad solicitados serán los realmente embebidos al enviar.
* Relación: verificación posterior al cambio hacia `promocional_email.png`.
* Resultado: ✅ 3 pruebas aprobadas; `ico_web.png` y `promocional_email.png` confirmados, cero conexiones SMTP.

## [2026-07-29]

* Archivo: `audits/email-template-mobile.png`
* Cambio: se regeneró la vista previa móvil utilizando `ico_web.png` y `promocional_email.png` desde sus rutas locales exactas.
* Motivo: comprobar que la creatividad definitiva escala correctamente en un ancho de 390 px.
* Relación: acompaña la nueva evidencia de escritorio con los mismos recursos finales.
* Resultado: ✅ vista móvil actualizada con los recursos finales.

## [2026-07-29]

* Archivo: `audits/email-template-desktop.png`
* Cambio: se regeneró la vista previa de escritorio utilizando `ico_web.png` y `promocional_email.png` desde sus rutas locales exactas.
* Motivo: validar visualmente los recursos definitivos solicitados para el correo.
* Relación: sustituye la evidencia anterior que utilizaba la imagen genérica de impresora.
* Resultado: ✅ vista de escritorio actualizada con los recursos finales.

## [2026-07-29]

* Archivo: `campaign/email-template.html`
* Cambio: la creatividad principal ahora funciona como enlace completo hacia la cotización y utiliza una etiqueta alternativa descriptiva.
* Motivo: hacer clicable el botón “Cotiza tu proyecto” incluido dentro de `promocional_email.png` y medirlo con `utm_content=promotional_image`.
* Relación: usa el mismo CID `lithora3d-hero`, cuyo archivo predeterminado fue actualizado en el script.
* Resultado: ✅ imagen promocional integrada como CTA medible.

## [2026-07-29]

* Archivo: `scripts/campana-email-ses.py`
* Cambio: la imagen CID predeterminada del correo se cambió de `assets/fondo_web.png` a `assets/promocional_email.png` y su nombre MIME a `lithora3d-promocional.png`.
* Motivo: utilizar exactamente la creatividad promocional indicada para la campaña.
* Relación: conserva `assets/ico_web.png` como logo oficial embebido.
* Resultado: ✅ recursos predeterminados actualizados; no se realizó ningún envío.

## [2026-07-29]

* Archivo: `scripts/campana-email-ses.py`
* Cambio: se actualizó el asunto predeterminado a `Tu idea puede convertirse en una pieza real | Lithora 3D`.
* Motivo: alinear la promesa de la bandeja de entrada con el encabezado principal del nuevo diseño.
* Relación: completa la renovación de la plantilla promocional.
* Resultado: ✅ asunto alineado; no se realizó ningún envío.

## [2026-07-29]

* Archivo: plantilla y flujo de campaña SES
* Cambio: se ejecutaron pruebas unitarias, compilación, simulación, validación MIME y revisión visual en escritorio y móvil.
* Motivo: comprobar que el rediseño no rompe el flujo seguro ni los recursos embebidos.
* Relación: validación final de `campaign/email-template.*` y `scripts/campana-email-ses.py`.
* Resultado: ✅ 3 pruebas aprobadas; MIME multipart correcto, logo y hero CID presentes, baja SES presente, `git diff --check` limpio y cero conexiones SMTP.

## [2026-07-29]

* Archivo: `audits/email-template-desktop.png`
* Cambio: se regeneró la evidencia de escritorio con recursos HTTPS temporales en lugar de los CID de correo.
* Motivo: mostrar también el logo en la captura visual sin modificar el mecanismo de imágenes embebidas del mensaje real.
* Relación: equivalente al ajuste aplicado a la evidencia móvil.
* Resultado: ✅ captura de escritorio completa con logo e imagen principal.

## [2026-07-29]

* Archivo: `audits/email-template-mobile.png`
* Cambio: se regeneró la evidencia móvil sustituyendo temporalmente los CID por recursos HTTPS únicamente dentro de la vista previa.
* Motivo: la recarga provocada por la emulación restauró los CID y la primera captura no mostró las imágenes, aunque el mensaje MIME sí las incorpora.
* Relación: no altera la plantilla ni el mecanismo CID usado por SES; corrige solo la evidencia visual.
* Resultado: ✅ captura móvil completa con logo e imagen principal.

## [2026-07-29]

* Archivo: `audits/email-template-mobile.png`
* Cambio: se generó una captura de la plantilla renovada en un viewport móvil de 390 px.
* Motivo: verificar apilado de servicios, legibilidad, botones y márgenes en pantallas pequeñas.
* Relación: segunda validación visual del nuevo `campaign/email-template.html`.
* Resultado: ✅ evidencia móvil creada; revisión visual pendiente.

## [2026-07-29]

* Archivo: `audits/email-template-desktop.png`
* Cambio: se generó una captura de la plantilla renovada en vista de escritorio.
* Motivo: comprobar composición, jerarquía, espaciado, CTA e imagen protagonista antes de entregar.
* Relación: validación visual del nuevo `campaign/email-template.html` realizada con Chrome DevTools.
* Resultado: ✅ evidencia de escritorio creada; revisión visual pendiente.

## [2026-07-29]

* Archivo: `tests/test_campana_email_ses.py`
* Cambio: se adaptó la prueba del constructor al nuevo recurso de imagen protagonista.
* Motivo: mantener la cobertura del mensaje MIME después de ampliar la firma de `build_message`.
* Relación: actualización requerida por el nuevo argumento `hero_path`.
* Resultado: ✅ prueba actualizada; ejecución pendiente.

## [2026-07-29]

* Archivo: `scripts/campana-email-ses.py`
* Cambio: se añadió `assets/fondo_web.png` como imagen protagonista CID del mensaje y el parámetro `--hero` para sustituirla cuando sea necesario.
* Motivo: conservar la imagen dentro del correo sin depender de que el sitio esté disponible al momento de abrirlo.
* Relación: el logo ya se adjuntaba de forma inline; ahora la plantilla renovada recibe también su imagen principal.
* Resultado: ✅ constructor y flujo SMTP preparados para incluir ambos recursos sin realizar envíos.

## [2026-07-29]

* Archivo: `campaign/email-template.txt`
* Cambio: se actualizó la alternativa de texto con la misma propuesta, servicios, proceso, enlaces medibles, WhatsApp y baja que la versión HTML.
* Motivo: ofrecer una experiencia completa en clientes que bloquean HTML o imágenes y mantener coherencia de contenido.
* Relación: acompaña el rediseño de `campaign/email-template.html` y conserva el marcador obligatorio de SES.
* Resultado: ✅ versión de texto alineada con el nuevo correo.

## [2026-07-29]

* Archivo: `campaign/email-template.html`
* Cambio: se rediseñó completamente el correo de presentación con composición moderna inspirada en Studio/Promo de React Email, identidad visual de Lithora 3D, preencabezado, propuesta de valor, imagen protagonista, servicios, proceso, dos CTA medibles, WhatsApp y baja administrada por SES.
* Motivo: presentar el negocio con una pieza promocional profesional, minimalista, clara y enfocada en conversión.
* Relación: reemplaza el primer borrador básico sin eliminar el marcador `[[UNSUBSCRIBE_URL]]` ni el logo CID requeridos por el flujo existente.
* Resultado: ✅ plantilla HTML renovada con tablas, estilos inline, adaptación móvil y ajustes para Outlook.

## [2026-07-29]

* Archivo: `audits/react-email-studio-reference.png`
* Cambio: se guardó una referencia visual de la plantilla oficial Studio de React Email.
* Motivo: estudiar una composición moderna y minimalista adecuada para rediseñar el correo de presentación de Lithora 3D.
* Relación: la referencia se usará solo como inspiración estructural; el contenido, marca y diseño final serán propios.
* Resultado: ✅ referencia visual capturada con Chrome DevTools.

## [2026-07-29]

* Archivo: `audits/ses-open-click-domain-doc.txt`
* Cambio: se guardó una captura textual de la documentación oficial de Amazon SES sobre dominios personalizados para seguimiento de aperturas y clics.
* Motivo: responder con evidencia actual sobre las estadísticas disponibles y la configuración necesaria.
* Relación: complementa la auditoría previa de listas, bajas y publicación de eventos de SES.
* Resultado: ✅ referencia oficial guardada; no se modificó la configuración de AWS.

## [2026-07-29]

* Archivo: flujo local de campañas Amazon SES
* Cambio: se ejecutaron compilación, pruebas, simulación de la etapa 1 y validación de diferencias.
* Motivo: confirmar sintaxis, controles de seguridad, análisis de destinatarios y limpieza del cambio antes de entregar.
* Relación: validación final posterior al ajuste del mensaje de simulación.
* Resultado: ✅ 3 pruebas aprobadas, compilación correcta, `git diff --check` sin errores y simulación completada sin crear bitácora de envío.

## [2026-07-29]

* Archivo: `scripts/campana-email-ses.py`
* Cambio: el resumen distingue ahora entre una simulación normal y una solicitud de envío todavía bloqueada antes de conectar con SMTP.
* Motivo: evitar que la palabra “simulación” aparezca de forma engañosa si en el futuro se proporcionan todas las confirmaciones reales.
* Relación: mejora detectada al comprobar el rechazo seguro de una confirmación incorrecta.
* Resultado: ✅ mensajes de estado corregidos sin modificar los bloqueos de envío.

## [2026-07-29]

* Archivo: `tests/test_campana_email_ses.py`, `scripts/campana-email-ses.py`
* Cambio: se ejecutaron las tres pruebas locales de auditoría, etapas y controles SES.
* Motivo: validar la implementación sin abrir conexión SMTP ni enviar mensajes.
* Relación: reejecución posterior a corregir el cargador dinámico de la suite.
* Resultado: ✅ 3 pruebas aprobadas en Python 3.11.

## [2026-07-29]

* Archivo: `tests/test_campana_email_ses.py`
* Cambio: se registró explícitamente el módulo cargado por ruta antes de ejecutarlo en las pruebas.
* Motivo: Python 3.11 requiere que el módulo exista en `sys.modules` al procesar el tipo `dataclass`.
* Relación: corrige el primer intento de ejecución de la suite, que falló durante la importación sin alcanzar las pruebas.
* Resultado: ✅ cargador de pruebas corregido; nueva ejecución pendiente.

## [2026-07-29]

* Archivo: `.gitignore`
* Cambio: se excluyeron archivos CSV de credenciales y la bitácora local de campañas SES.
* Motivo: evitar publicar secretos SMTP o estado operativo del envío por accidente.
* Relación: complementa el uso exclusivo de variables de entorno indicado en `EMAIL_CAMPAIGN.md`.
* Resultado: ✅ exclusiones preventivas agregadas.

## [2026-07-29]

* Archivo: `EMAIL_CAMPAIGN.md`
* Cambio: se documentaron la simulación predeterminada, las protecciones de SES, las seis etapas no solapadas, el registro anonimizado y la habilitación futura mediante tres confirmaciones explícitas.
* Motivo: dejar un procedimiento reproducible que evite almacenar credenciales y ejecutar campañas por accidente.
* Relación: documenta el script, las plantillas y la configuración de SES creados o auditados en esta sesión.
* Resultado: ✅ guía operativa creada.

## [2026-07-29]

* Archivo: `tests/test_campana_email_ses.py`
* Cambio: se añadieron pruebas para normalización, duplicados, direcciones inválidas, dominios sospechosos, exclusiones manuales, separación de etapas y encabezados/marcadores obligatorios de SES.
* Motivo: verificar el flujo sin conectar con SMTP ni entregar mensajes.
* Relación: cubre las protecciones incorporadas en `scripts/campana-email-ses.py`.
* Resultado: ✅ pruebas creadas; ejecución pendiente.

## [2026-07-29]

* Archivo: `campaign/email-template.html`, `campaign/email-template.txt`
* Cambio: se crearon borradores equivalentes en HTML y texto con el logo incrustado, enlace al sitio, motivo de recepción y el marcador literal de baja administrada que Amazon SES reemplaza al enviar.
* Motivo: asegurar una presentación oficial de Lithora 3D y que todos los clientes de correo dispongan de una opción clara de cancelación.
* Relación: las plantillas solo son preparatorias; el script valida que ambas contengan el marcador de baja antes de permitir un envío.
* Resultado: ✅ plantillas creadas; no se enviaron ni publicaron mensajes.

## [2026-07-29]

* Archivo: `scripts/campana-email-ses.py`
* Cambio: se agregó un flujo de campañas SES seguro por defecto, con auditoría y deduplicación de destinatarios, retiro de direcciones inválidas o sospechosas, etapas graduales, baja administrada, configuración de reputación, envío individual, ritmo limitado, bitácora anonimizada y triple bloqueo para habilitar un envío real.
* Motivo: preparar campañas desde Python sin enviar nada durante la implementación y reducir rebotes, reclamaciones, duplicados y envíos accidentales.
* Relación: usa la lista `lithora3d-marketing`, el tema `promociones`, la supresión de cuenta ya activa y el conjunto `my-first-configuration-set` verificado con métricas habilitadas.
* Resultado: ✅ script creado; su comportamiento predeterminado es simulación sin conexión SMTP.

## [2026-07-29]

* Archivo: Amazon SES `us-east-2`, lista de contactos `lithora3d-marketing`
* Cambio: se creó una lista administrada con el tema `promociones`, estado predeterminado `OPT_IN` y descripción de ofertas ocasionales de Lithora 3D.
* Motivo: habilitar bajas administradas por SES, encabezado de cancelación con un clic y bloqueo de futuros envíos a contactos dados de baja.
* Relación: utiliza la supresión de rebotes y reclamaciones ya habilitada a nivel de cuenta; no se importaron contactos ni se enviaron mensajes.
* Resultado: ✅ lista y tema creados y verificados mediante `get-contact-list`.

## [2026-07-29]

* Archivo: `audits/ses-list-management-snapshot.txt`
* Cambio: se guardó una captura textual de la documentación oficial de administración de listas de Amazon SES para auditar la sintaxis y los requisitos de bajas administradas.
* Motivo: implementar cancelación de suscripción sin enviar correos durante la configuración.
* Relación: continúa la aprobación de acceso a producción de SES y evita depender de supuestos sobre encabezados SMTP.
* Resultado: ✅ evidencia de documentación creada; implementación pendiente.

## [2026-07-27]

* Archivo: caso de soporte de Amazon SES para acceso a producción
* Cambio: se respondió en inglés con el origen consentido de los contactos, volumen aproximado de 6,000 correos, frecuencia promocional, manejo previsto de rebotes, quejas y bajas, y un ejemplo de campaña.
* Motivo: proporcionar la información adicional solicitada por AWS para evaluar la salida del entorno de pruebas.
* Relación: continúa la solicitud de acceso a producción enviada para `lithora3d.com` en `us-east-2`.
* Resultado: ✅ respuesta publicada y visible en la correspondencia del caso de soporte.

## [2026-07-27]

* Archivo: configuración de Amazon SES en `us-east-2`
* Cambio: se envió la solicitud de acceso a producción para correo de marketing desde `lithora3d.com`.
* Motivo: retirar la cuenta del entorno de pruebas y superar el límite inicial de 200 correos por cada 24 horas.
* Relación: utiliza el dominio, DKIM, SPF, DMARC, MAIL FROM y credenciales SMTP configurados previamente.
* Resultado: ✅ solicitud aceptada por AWS y actualmente `En proceso de revisión`; AWS indica un plazo de hasta 24 horas.

## [2026-07-27]

* Archivo: configuración de GitHub Pages para `lithora3d.com`
* Cambio: se confirmó la comprobación DNS exitosa, se esperó la emisión del certificado y se activó `Enforce HTTPS`.
* Motivo: el cambio de DNS de Cloudflare a Namecheap dejó temporalmente al dominio sirviendo el certificado genérico `*.github.io`.
* Relación: conserva los registros web de GitHub Pages y los registros de Amazon SES publicados en Namecheap.
* Resultado: ✅ `https://lithora3d.com/` carga con el certificado correcto y sin advertencia de privacidad.

## [2026-07-27]

* Archivo: `logs/whatsapp-prospeccion.jsonl`, Excel de prospectos
* Cambio: se completó y auditó el lote autónomo solicitado de 10 negocios aleatorios, con mensaje personalizado y cuatro imágenes correspondientes a cada giro.
* Motivo: ejecutar el modo `-Cantidad` bajo supervisión, deteniendo y recuperando de forma segura cualquier caso incierto antes de continuar.
* Relación: incluye las recuperaciones sin duplicar texto de Cuky, GD Ortodoncia y Meta Digital, además de las correcciones validadas para alias multilínea, búsquedas de carpeta y apóstrofos.
* Resultado: ✅ 10 resultados `texto_e_imagenes_enviados`, 10 teléfonos únicos, 10 filas únicas y estado `Contactado` confirmado en Excel.

## [2026-07-27]

* Archivo: `logs/whatsapp-prospeccion.jsonl`, Excel de prospectos
* Cambio: se completó el envío de `Reposteria D'clau` y se marcó la fila 669 como `Contactado`.
* Motivo: confirmar en un envío real que el apóstrofo codificado permite abrir el chat, validar el borrador y continuar con las cuatro imágenes.
* Relación: valida la corrección de transporte seguro de nombres comerciales dentro de la URI de WhatsApp.
* Resultado: ✅ mensaje y cuatro imágenes enviados al número `528333891950`, con registro y Excel confirmados.

## [2026-07-27]

* Archivo: `scripts/Enviar-ProspectoWhatsApp.ps1`
* Cambio: los apóstrofos se codifican explícitamente como `%27` dentro del texto de la URI de WhatsApp.
* Motivo: `.NET EscapeDataString` conservó el apóstrofo de `Reposteria D'clau`, cerrando prematuramente la comilla usada por el shell de Android antes de abrir el chat.
* Relación: mantiene la apertura por número exacto y la verificación del borrador completo, corrigiendo únicamente el transporte seguro del texto.
* Resultado: ✅ nombres comerciales con apóstrofos ya no rompen el comando ADB.

## [2026-07-27]

* Archivo: `logs/whatsapp-prospeccion.jsonl`, Excel de prospectos
* Cambio: se recuperó `Meta Digital - Diseño de Estrategias y Páginas Web En Tampico` enviando solo sus cuatro imágenes y se marcó la fila 10 como `Contactado`.
* Motivo: el mensaje ya había sido entregado cuando la búsqueda truncada de la carpeta detuvo preventivamente el primer intento.
* Relación: primera validación real de la búsqueda por los últimos cuatro dígitos con comprobación exacta de carpeta y cantidad de archivos.
* Resultado: ✅ envío completo al número `528331385700`, registro local creado y Excel actualizado.

## [2026-07-27]

* Archivo: `scripts/Enviar-ProspectoWhatsApp.ps1`
* Cambio: la búsqueda en Samsung Mis archivos escribe únicamente los últimos cuatro dígitos del teléfono y conserva la validación posterior del nombre completo `Lithora-####-ACTUAL` y sus cuatro elementos.
* Motivo: `adb input text` truncó el término al encontrar el primer guion, por lo que buscaba solo `Lithora` y la carpeta exacta no aparecía de forma fiable.
* Relación: reemplaza la espera prolongada de indexación por un término simple, único y compatible con la entrada ADB, sin debilitar la validación exacta.
* Resultado: ✅ eliminada la causa real de las búsquedas truncadas; selección exacta mantenida.

## [2026-07-27]

* Archivo: `logs/whatsapp-prospeccion.jsonl`, Excel de prospectos
* Cambio: se recuperó el envío de `GD Ortodoncia Clínica Dental` enviando solo sus cuatro imágenes y se marcó la fila 389 como `Contactado`.
* Motivo: el mensaje ya estaba entregado antes de que la representación multilínea del alias detuviera de forma preventiva el envío de archivos.
* Relación: valida en operación real la comparación normalizada del alias obtenido desde el número exacto `528331760414`.
* Resultado: ✅ cuatro imágenes enviadas al destinatario correcto, registro local creado y Excel actualizado.

## [2026-07-27]

* Archivo: `scripts/Enviar-ProspectoWhatsApp.ps1`
* Cambio: la coincidencia del alias verificado en el selector de WhatsApp normaliza saltos de línea, espacios, guiones, mayúsculas y acentos antes de compararlo.
* Motivo: el perfil exacto `GD-Ortodoncia Clínica Dental` apareció dividido por un salto de línea en el selector y la comparación literal lo rechazó de forma segura.
* Relación: conserva la obtención previa del alias desde el chat abierto por número y mejora únicamente su representación visual en el selector.
* Resultado: ✅ coincidencia robusta sin relajar la verificación del destinatario.

## [2026-07-27]

* Archivo: `logs/whatsapp-prospeccion.jsonl`, Excel de prospectos
* Cambio: se completó la recuperación de `Pollo Y Pizza Cuky Carranza Tampico` enviando únicamente sus cuatro imágenes y se marcó la fila 559 como `Contactado`.
* Motivo: el texto ya había sido entregado; la recuperación evitó duplicarlo y validó el alias `Cuky Fried Chicken` obtenido desde el chat abierto por el número exacto `528331209393`.
* Relación: confirma en operación real la validación segura por número y alias incorporada al flujo de selección de destinatario.
* Resultado: ✅ cuatro imágenes enviadas al contacto correcto, registro local creado y Excel actualizado.

## [2026-07-27]

* Archivo: `scripts/Enviar-ProspectoWhatsApp.ps1`
* Cambio: Mis archivos abre ahora la fila exacta directamente desde el resultado ya validado, sin enviar `KEYCODE_BACK` ni volver a capturar una pantalla distinta.
* Motivo: en el primer elemento del lote de 10, Samsung interpretó Atrás como cerrar la búsqueda completa en vez de ocultar únicamente el teclado; el texto salió, pero no se compartieron imágenes.
* Relación: el lote se detuvo antes del segundo negocio; permite recuperar a `Pollo Y Pizza Cuky Carranza Tampico` con `-SoloImagenes`.
* Resultado: ✅ causa identificada y navegación corregida; recuperación pendiente.

## [2026-07-27]

* Archivo: `scripts/Enviar-ProspectoWhatsApp.ps1`
* Cambio: tras validar el resultado de búsqueda, el flujo usa `KEYCODE_ESCAPE` para ocultar únicamente el teclado, vuelve a capturar la misma búsqueda y después pulsa la fila exacta.
* Motivo: el toque directo fue absorbido por el teclado; una comprobación ADB posterior confirmó que la misma coordenada abre correctamente la carpeta cuando el teclado está oculto.
* Relación: sustituye tanto el `KEYCODE_BACK` que cerraba la búsqueda como el toque prematuro que no abría la carpeta.
* Resultado: ✅ estrategia confirmada manualmente sobre `Lithora-9393-ACTUAL`; recuperación automatizada pendiente.

## [2026-07-27]

* Archivo: `scripts/Enviar-ProspectoWhatsApp.ps1`
* Cambio: antes de compartir imágenes, el flujo abre el chat por número, captura `conversation_contact_name` y usa ese nombre real de WhatsApp en el selector; `-SoloImagenes` abre el chat sin texto ni envío.
* Motivo: el Excel identifica al prospecto como `Pollo Y Pizza Cuky Carranza Tampico`, mientras WhatsApp muestra `Cuky Fried Chicken`; el número y el texto entregado confirmaron que es el mismo destinatario.
* Relación: reemplaza la búsqueda por nombre del Excel cuando el perfil empresarial publica otro nombre, manteniendo la apertura inicial por teléfono exacto.
* Resultado: ✅ correlación número→perfil implementada; recuperación del álbum pendiente.

## [2026-07-27]

* Archivo: `scripts/Enviar-ProspectoWhatsApp.ps1`
* Cambio: `Open-WhatsAppDraft` acepta explícitamente texto vacío para abrir y validar un chat sin preparar mensajes.
* Motivo: PowerShell rechazó el primer intento seguro de `-SoloImagenes` antes de abrir WhatsApp.
* Relación: habilita la correlación número→perfil sin duplicar el texto ya entregado.
* Resultado: ✅ contrato corregido; no se envió contenido en el intento fallido.

## [2026-07-27]

* Archivo: `scripts/Enviar-ProspectoWhatsApp.ps1`
* Cambio: la confirmación final acepta el número exacto o el alias exacto previamente capturado desde `conversation_contact_name`.
* Motivo: WhatsApp confirmó `1 seleccionado` y destinatario `Cuky Fried Chicken`, pero ocultó el teléfono en el campo `recipients`.
* Relación: mantiene dos comprobaciones independientes: apertura inicial por número y confirmación posterior por el alias obtenido de ese mismo chat.
* Resultado: ✅ destinatario confirmado inequívocamente; las imágenes aún no se han enviado.

## [2026-07-27]

* Archivo: `scripts/Enviar-ProspectoWhatsApp.ps1`
* Cambio: se añadió el parámetro validado `-Cantidad` con un máximo explícito de 100 prospectos por ejecución.
* Motivo: habilitar la solicitud operativa `-Cantidad 10` sin depender de introducir manualmente cada teléfono.
* Relación: será consumido por el selector aleatorio autónomo y mantiene el modo individual existente.
* Resultado: ✅ contrato de entrada añadido; selección y orquestación pendientes.

## [2026-07-27]

* Archivo: `scripts/Enviar-ProspectoWhatsApp.ps1`
* Cambio: `-Cantidad` construye un conjunto aleatorio de prospectos únicos con WhatsApp confirmado, sin estado Contactado ni registro local, con giro soportado y cuatro PNG válidos; luego ejecuta el flujo individual completo para cada uno.
* Motivo: automatizar lotes como `-Cantidad 10` manteniendo los controles ya probados de destinatario, imágenes, registro y actualización de Excel.
* Relación: cada hijo procesa y marca una sola fila; ante cualquier resultado incierto el lote se detiene antes del siguiente contacto.
* Resultado: ✅ orquestación autónoma implementada; sintaxis y simulaciones pendientes.

## [2026-07-27]

* Archivo: validación de `-Cantidad`
* Cambio: se ejecutó un lote aleatorio simulado de tres negocios de giros distintos y se comparó el SHA-256 del Excel antes y después.
* Motivo: validar selección, exclusiones, resolución de mensajes/imágenes, recursión y terminación del lote sin contactar ni marcar prospectos.
* Relación: cubre el orquestador autónomo añadido inmediatamente antes.
* Resultado: ✅ 3 de 3 simulaciones completadas entre 513 elegibles; hash del Excel sin cambios.

## [2026-07-27]

* Archivo: ejecución autónoma `-Cantidad 1`, Excel y registro local
* Cambio: el selector eligió aleatoriamente `TRANSPORTES ADECASU SA DE CV` (`+52 833 403 4384`), envió el mensaje de Transporte y logística y sus cuatro imágenes, registró el resultado y marcó la fila 938 como `Contactado`.
* Motivo: realizar la primera prueba integral solicitada del modo autónomo con un negocio real.
* Relación: valida selección, envío, confirmación de álbum, detención segura, log local y actualización atómica del Excel.
* Resultado: ✅ lote 1 de 1 completado; verificación independiente confirmó negocio, teléfono, giro y estado en la fila exacta.

## [2026-07-27]

* Archivo: `scripts/Enviar-ProspectoWhatsApp.ps1`
* Cambio: después de confirmar texto y cuatro imágenes, el flujo real abre el catálogo con Excel, localiza la columna `Estado del contacto`, escribe `Contactado` en la fila exacta y verifica el valor guardado.
* Motivo: sincronizar el bloqueo operativo del Excel con el registro local y evitar que los envíos confirmados vuelvan a aparecer como prospectos disponibles.
* Relación: conserva `logs/whatsapp-prospeccion.jsonl` como respaldo; `-NumeroPractica`, `-Simular` y `-PracticarImagenes` salen antes de esta actualización.
* Resultado: ✅ integración implementada; endurecimiento de limpieza COM y validación en copia pendientes.

## [2026-07-27]

* Archivo: `scripts/Enviar-ProspectoWhatsApp.ps1`
* Cambio: la referencia COM de la celda se inicializa explícitamente antes del bloque protegido.
* Motivo: `Set-StrictMode` no debe convertir la limpieza de una apertura fallida de Excel en un segundo error por variable no inicializada.
* Relación: endurece la actualización automática de estado añadida inmediatamente antes.
* Resultado: ✅ limpieza segura incluso si Excel no logra abrir el catálogo.

## [2026-07-27]

* Archivo: `scripts/Enviar-ProspectoWhatsApp.ps1`
* Cambio: la actualización del estado dejó de depender de Excel COM y delega en un actualizador `.xlsx` local, comprobando disponibilidad y código de salida.
* Motivo: la prueba sobre una copia detectó `TYPE_E_CANTLOADLIBRARY` al acceder a la interfaz COM de Excel en este equipo.
* Relación: sustituye la implementación COM recién añadida sin cambiar el momento transaccional: solo se ejecuta después de confirmar texto e imágenes.
* Resultado: ✅ dependencia COM eliminada; helper y revalidación pendientes.

## [2026-07-27]

* Archivo: `scripts/Actualizar-EstadoProspecto.py`
* Cambio: se creó un actualizador atómico para la hoja `Negocios` que localiza la columna de estado, modifica una fila válida, reemplaza el libro mediante archivo temporal y vuelve a abrirlo para verificar el resultado.
* Motivo: guardar `Contactado` sin depender de la automatización COM de Excel ni dejar un catálogo parcialmente escrito.
* Relación: es invocado por `Set-ProspectoContactado` únicamente tras un envío real confirmado.
* Resultado: ✅ helper implementado; prueba sobre copia pendiente.

## [2026-07-27]

* Archivo: validación de actualización automática de Excel
* Cambio: se ejecutó el helper sobre una copia real del catálogo, se verificó independientemente que `H2` quedó como `Contactado`, se validaron las sintaxis Python y PowerShell y se eliminó la copia temporal.
* Motivo: demostrar escritura, reemplazo atómico y lectura posterior antes de permitir que un envío real modifique el catálogo operativo.
* Relación: valida `scripts/Actualizar-EstadoProspecto.py` y su invocación desde `Enviar-ProspectoWhatsApp.ps1`.
* Resultado: ✅ actualización confirmada sin alterar el Excel original.

## [2026-07-27]

* Archivo: validación de modos sin envío
* Cambio: se comparó el SHA-256 del catálogo antes y después de una ejecución con `-Simular -NumeroPractica`.
* Motivo: confirmar que las prácticas y simulaciones no marcan al prospecto de referencia como contactado.
* Relación: verifica las salidas tempranas anteriores a `Set-ProspectoContactado`.
* Resultado: ✅ hash idéntico; el Excel operativo no fue modificado.

## [2026-07-27]

* Archivo: `scripts/Enviar-ProspectoWhatsApp.ps1`, práctica ADB de Hamburgueserías
* Cambio: la confirmación final acepta uno o más álbumes completos de cuatro elementos en el chat, en vez de exigir que exista exactamente uno.
* Motivo: la práctica envió correctamente el mensaje de `Mostacho Burguer` y sus cuatro imágenes a `+52 833 849 8692`, pero el álbum anterior de Dentistas elevó el total a dos y provocó una espera falsa de 25 segundos.
* Relación: mejora la validación `media_grid` añadida en la práctica anterior y conserva la comprobación de destinatario exacto previa al envío.
* Resultado: ✅ mensaje y cuatro imágenes de Hamburgueserías entregados; futuras confirmaciones en el mismo chat finalizarán sin esa espera innecesaria.

## [2026-07-27]

* Archivo: `scripts/Enviar-ProspectoWhatsApp.ps1`
* Cambio: la primera imagen de Mis archivos se materializa ahora como arreglo, exige una coincidencia única y solo entonces se usa para iniciar la selección múltiple.
* Motivo: durante el envío aleatorio a `DentalDeluxe`, PowerShell trató el único `XmlElement` como un nodo indexable y `[0]` devolvió nulo aunque la carpeta mostraba correctamente los cuatro archivos.
* Relación: aplica el mismo patrón defensivo ya usado para otros controles de Mis archivos y permite reanudar únicamente las imágenes sin duplicar el texto ya enviado.
* Resultado: ✅ causa reproducida y corregida; sintaxis y recuperación con `-SoloImagenes` pendientes.

## [2026-07-27]

* Archivo: `scripts/Enviar-ProspectoWhatsApp.ps1`
* Cambio: se añadió `-NumeroPractica` para sustituir únicamente el destinatario real durante una prueba controlada, conservar las cuatro imágenes del giro elegido y omitir el registro del prospecto original.
* Motivo: el usuario completó manualmente el envío a `DentalDeluxe` y pidió probar el paquete de Dentistas en su propio número `+52 833 849 8692`, sin duplicar contenido al negocio.
* Relación: el flujo pendiente hacia DentalDeluxe fue detenido y WhatsApp Business se cerró antes de preparar la práctica.
* Resultado: ✅ aislamiento de destino implementado; sintaxis y envío de práctica pendientes.

## [2026-07-27]

* Archivo: `scripts/Enviar-ProspectoWhatsApp.ps1`
* Cambio: el destino de práctica usa un identificador imposible como alternativa de nombre y conserva el número como única coincidencia válida.
* Motivo: los parámetros obligatorios de PowerShell rechazaron una cadena vacía antes de abrir Mis archivos.
* Relación: corrige el primer intento de `-NumeroPractica`, que terminó antes de seleccionar o enviar contenido.
* Resultado: ✅ validación de parámetro corregida; reintento pendiente.

## [2026-07-27]

* Archivo: `scripts/Enviar-ProspectoWhatsApp.ps1`, práctica ADB con `+52 833 849 8692`
* Cambio: la confirmación final reconoce tanto cuatro miniaturas explícitas como el nodo `media_grid` cuyo descriptor confirma `Álbum de fotos, 4 elementos`.
* Motivo: la práctica entregó correctamente las cuatro imágenes de Dentistas al número indicado, pero la versión actual de WhatsApp solo expuso dos miniaturas visibles y el validador produjo una falsa alarma.
* Relación: completa `-NumeroPractica`; la captura y el XML del chat confirmaron el destinatario exacto y el álbum de cuatro elementos, sin registrar nuevamente a DentalDeluxe.
* Resultado: ✅ cuatro imágenes entregadas al número de práctica y validación adaptada a ambas representaciones de WhatsApp.

## [2026-07-27]

* Archivo: `sitemap.xml`
* Cambio: se corrigió la URL de la imagen conceptual de portada de `seccion_idea_01.webp` a `seccion-idea.webp`.
* Motivo: Chrome DevTools confirmó que la URL declarada devolvía la página 404 de GitHub Pages, mientras el derivado WebP publicado usa el nombre con guiones.
* Relación: corrige la imagen elegible añadida en la optimización SEO del 2026-07-21 sin modificar las siete URLs canónicas ni sus fechas reales de actualización.
* Resultado: ✅ referencia alineada con el activo existente; prueba de regresión y despliegue pendientes.

## [2026-07-27]

* Archivo: `tests/static-audit.test.mjs`
* Cambio: la auditoría del sitemap exige ahora la URL pública correcta de la imagen conceptual y comprueba que su archivo local exista.
* Motivo: impedir que una futura edición vuelva a declarar en el sitemap un recurso inexistente.
* Relación: cubre la corrección de `sitemap.xml` realizada inmediatamente antes.
* Resultado: ✅ regresión cubierta; ejecución de la suite pendiente.

## [2026-07-27]

* Archivo: validación SEO local
* Cambio: se ejecutó `npm run validate` después de corregir el sitemap y ampliar su auditoría.
* Motivo: confirmar sincronización de contenido, sintaxis y ausencia de regresiones en todas las páginas indexables.
* Relación: valida `sitemap.xml` y `tests/static-audit.test.mjs`.
* Resultado: ✅ 89 de 89 pruebas aprobadas.

## [2026-07-27]

* Archivo: producción y Google Search Console
* Cambio: se publicó el commit `8c94cb4`, se verificó por Chrome DevTools el sitemap corregido y el HTTP 200 de `seccion-idea.webp`, se reenvió `/sitemap.xml` y se solicitaron prioritariamente `/precios-impresion-3d/`, `/materiales-impresion-3d/` y `/prototipado-rapido/`.
* Motivo: eliminar la única referencia SEO rota encontrada y acelerar el primer rastreo de las landings con mayor intención orgánica.
* Relación: completa la auditoría de las cinco URLs descubiertas; `/ecosistema-soluciones/` y `/cotizar/` permanecen correctamente incluidas en el sitemap.
* Resultado: ✅ sitemap aceptado con siete páginas descubiertas y tres URLs añadidas a la cola prioritaria de Google.

## [2026-07-22]

* Archivo: validación final de `/cotizar/`
* Cambio: se probó localmente en Chrome DevTools a 1440 × 1000 y 390 × 844, se recorrió el CTA real con su demora de 680 ms, se inspeccionó el escenario izquierdo, se cargó el iframe oscuro y se comprobó el teléfono.
* Motivo: cerrar la implementación con evidencia funcional y visual proporcional al cambio.
* Relación: valida la corrección de contraste, la transición propia y el diseño responsivo; se repitió también `npm run validate`.
* Resultado: ✅ navegación completada sin bloqueo, `+52` y formato mexicano visibles, límite de 10 MB presente, consola limpia y 86 de 86 pruebas aprobadas.

## [2026-07-22]

* Archivo: `cotizar/index.html`
* Cambio: se declaró el favicon SVG existente del sitio en la nueva página.
* Motivo: eliminar la solicitud implícita a `/favicon.ico` que aparecía como 404 durante la validación en Chrome.
* Relación: reutiliza `/favicon.svg` sin agregar recursos gráficos nuevos.
* Resultado: ✅ referencia incorporada; consola pendiente de revalidación final.

## [2026-07-22]

* Archivo: `cotizar/index.html`
* Cambio: se retiró `transparentBackground=1` de las dos URL del iframe Tally para que se aplique el fondo oscuro publicado del formulario.
* Motivo: la validación visual de escritorio reveló que el modo transparente dejaba un lienzo blanco con etiquetas claras; el modo opaco restaura contraste correcto en campos, títulos y carga de archivo.
* Relación: corrige la integración visual del formulario sin cambiar su ID, datos ni conexión a Sheets.
* Resultado: ✅ contraste oscuro confirmado en la URL de Tally; revalidación dentro de la página pendiente.

## [2026-07-22]

* Archivo: `assets/styles.css`, `assets/quote-page.css`
* Cambio: se retiró la activación experimental de View Transitions entre documentos y se mantuvieron la capa de salida propia y las animaciones de entrada locales.
* Motivo: Chrome DevTools detectó que la transición nativa podía retener la navegación mientras cargaba el iframe externo de Tally; la solución local conserva el efecto visual sin acoplarlo al ciclo de carga del formulario.
* Relación: mejora la implementación de transición creada en este mismo grupo y evita un estado colgado durante la captura/navegación.
* Resultado: ✅ riesgo de bloqueo eliminado; revalidación de navegación pendiente.

## [2026-07-22]

* Archivo: validación de la página independiente de cotización
* Cambio: se ejecutó `npm run validate` tras crear la ruta, transición, estilos, sitemap y pruebas.
* Motivo: confirmar que la separación del formulario no rompe navegación, contenido generado, sintaxis ni auditorías estáticas.
* Relación: valida el conjunto de cambios de `/cotizar/` y la portada.
* Resultado: ✅ 86 de 86 pruebas aprobadas, sin divergencias de contenido ni errores de sintaxis.

## [2026-07-22]

* Archivo: `tests/home-quote.test.mjs`
* Cambio: se reemplazaron las aserciones del formulario embebido en portada por pruebas de los dos CTA animados, ausencia de duplicados, ruta canónica, iframe real, slot de timelapse y composición responsiva.
* Motivo: convertir la nueva arquitectura de cotización en un contrato verificable y evitar regresiones hacia el formulario anterior.
* Relación: cubre `index.html`, `cotizar/index.html`, `assets/styles.css`, `assets/quote-page.css` y `assets/quote-transition.js`.
* Resultado: ✅ cobertura actualizada; ejecución pendiente.

## [2026-07-22]

* Archivo: `sitemap.xml`
* Cambio: se añadió la URL canónica `https://lithora3d.com/cotizar/` al índice de páginas públicas.
* Motivo: hacer descubrible la nueva página independiente y mantener la cobertura SEO del sitio.
* Relación: corresponde al nuevo `cotizar/index.html` indexable.
* Resultado: ✅ ruta incorporada al sitemap; validación pendiente.

## [2026-07-22]

* Archivo: `assets/styles.css`
* Cambio: se retiraron los estilos del formulario ya eliminado de la portada y se añadió la capa de transición con expansión radial, guía luminosa y cubo 3D para los CTA principales.
* Motivo: completar la salida visual hacia `/cotizar/` sin mantener CSS muerto del formulario anterior.
* Relación: trabaja con `assets/quote-transition.js`, usa View Transitions como mejora progresiva y desactiva el efecto con movimiento reducido.
* Resultado: ✅ transición de salida estilizada; pruebas y validación visual pendientes.

## [2026-07-22]

* Archivo: `assets/quote-transition.js`
* Cambio: se agregó un controlador progresivo para los dos CTA principales que activa una capa de transición 3D durante 680 ms antes de navegar a `/cotizar/`.
* Motivo: dar continuidad visual entre la portada y la nueva página sin bloquear navegación modificada, nuevas pestañas ni usuarios con movimiento reducido.
* Relación: consume `data-quote-link` en el encabezado y el hero de `index.html`; la navegación normal permanece como respaldo sin JavaScript.
* Resultado: ✅ controlador incorporado; estilos de la capa pendientes.

## [2026-07-22]

* Archivo: `assets/quote-page.css`
* Cambio: se diseñó la experiencia visual oscura de dos columnas, el escenario de impresión reemplazable, la composición responsiva, animaciones de entrada y transiciones nativas entre documentos.
* Motivo: dar a la nueva ruta una transición atractiva y una jerarquía clara donde el formulario permanezca cómodo mientras el futuro timelapse ocupa el lado izquierdo.
* Relación: estiliza `cotizar/index.html`, usa únicamente CSS local y respeta `prefers-reduced-motion`.
* Resultado: ✅ diseño completo incorporado; controlador de salida desde portada pendiente.

## [2026-07-22]

* Archivo: `cotizar/index.html`
* Cambio: se creó una página independiente de cotización con encabezado compacto, escenario izquierdo reemplazable mediante `data-animation-slot="print-timelapse"` y formulario Tally conectado en la columna derecha.
* Motivo: permitir incorporar después una animación timelapse de impresión 3D sin rehacer la estructura del formulario ni distraer el proceso de captura.
* Relación: recibe todos los enlaces `/cotizar/` de la portada y mantiene México `+52`, fecha/foto opcionales y sincronización con Google Sheets desde `ODeE7a`.
* Resultado: ✅ estructura semántica y accesible creada; estilos y transición pendientes.

## [2026-07-22]

* Archivo: `index.html`
* Cambio: se retiró el formulario incrustado de la portada, se dirigieron todas las llamadas de cotización a `/cotizar/` y se marcaron los dos CTA principales para una transición dedicada.
* Motivo: separar la captura de cotizaciones en una segunda página y evitar dos experiencias de formulario simultáneas.
* Relación: conserva el formulario Tally `ODeE7a` para reutilizarlo en la nueva ruta; reemplaza el cargador de Tally de la portada por `quote-transition.js`.
* Resultado: ✅ navegación de cotización actualizada; nueva página, transición, estilos y pruebas pendientes.

## [2026-07-22]

* Archivo: producción `https://lithora3d.com/#cotizar`
* Cambio: se creó el commit `db2a556` (`feat: integrar cotizaciones con Tally`) y se publicó `main` en GitHub Pages con el iframe Tally `ODeE7a`, estilos responsivos y pruebas de regresión.
* Motivo: poner en producción el flujo real de solicitudes conectado a Google Sheets.
* Relación: despliega los cambios previamente validados de `index.html`, `assets/styles.css` y `tests/home-quote.test.mjs`; excluye del commit los scripts y auditorías ajenos que ya estaban sin seguimiento.
* Resultado: ✅ producción validada con Chrome DevTools: documento e iframe HTTP 200, sin errores de consola, fecha y foto opcionales visibles, límite de 10 MB y teléfono mexicano `+52` por defecto.

## [2026-07-22]

* Archivo: formulario Tally `Solicita tu cotización` (`https://tally.so/r/ODeE7a`)
* Cambio: se configuró México (`+52`) como país y prefijo predeterminado del campo obligatorio `Teléfono o WhatsApp` y se publicó la actualización.
* Motivo: Lithora3D atenderá solicitudes únicamente en México y no debe exigir que el cliente cambie manualmente el país.
* Relación: ajusta un solo bloque del formulario publicado, sin modificar los demás campos, validaciones, orden ni la integración con Google Sheets.
* Resultado: ✅ verificado en una sesión aislada y sin datos previos: al enfocar el teléfono aparece `+52` y el formato mexicano `___ ___ ____`.

## [2026-07-22]

* Archivo: validación final de la integración de cotizaciones
* Cambio: se repitió `npm run validate` después del ajuste responsivo y se inspeccionó `http://127.0.0.1:8000/#cotizar` en un viewport móvil de 390 × 844 mediante Chrome DevTools.
* Motivo: confirmar carga real del iframe, visibilidad de fecha y foto, límite de 10 MB y ausencia de desplazamiento interno tras el ajuste de altura.
* Relación: cierra la validación pendiente del ajuste responsivo anterior; evidencia en `audits/2026-07-22-home-quote-mobile.png`.
* Resultado: ✅ 85 de 85 pruebas aprobadas, formulario Tally cargado con HTTP 200 y consola sin errores.

## [2026-07-22]

* Archivo: Google Sheets `Solicita tu cotización`, rango `M2:M1000`
* Cambio: se configuró la columna `Estado` como menú desplegable con `Nueva`, `En revisión`, `Cotizada`, `Aprobada`, `En producción`, `Despachada` y `Cerrada`.
* Motivo: estandarizar el seguimiento del equipo y permitir distinguir rápidamente solicitudes pendientes, cotizadas y despachadas.
* Relación: mejora la columna operativa `Estado` agregada anteriormente sin interferir con la sincronización de Tally.
* Resultado: ✅ regla de validación guardada para las primeras 999 solicitudes.

## [2026-07-22]

* Archivo: `index.html`, `assets/styles.css`, `tests/home-quote.test.mjs`
* Cambio: se elevó la reserva de altura del iframe a 1160 px en escritorio y 1200 px en móvil, manteniendo el ajuste dinámico de Tally, y se actualizó la aserción asociada.
* Motivo: la inspección visual móvil detectó que 920 px obligaban a usar una barra de desplazamiento interna; el contenido real medido por DevTools requiere aproximadamente 1168 px a 342 px de ancho.
* Relación: mejora responsiva derivada de la validación real del formulario integrado.
* Resultado: ✅ altura suficiente incorporada para mostrar el formulario completo sin recorte interno; revalidación pendiente.

## [2026-07-22]

* Archivo: validación de la integración de cotizaciones
* Cambio: se ejecutó `npm run validate`, incluyendo sincronización de contenido, comprobación sintáctica y la suite completa de pruebas.
* Motivo: confirmar que el nuevo formulario no introduce regresiones en la portada ni en el resto del sitio.
* Relación: valida `index.html`, `assets/styles.css` y `tests/home-quote.test.mjs`.
* Resultado: ✅ 85 de 85 pruebas aprobadas, sin fallos de sintaxis ni divergencias de contenido.

## [2026-07-22]

* Archivo: `tests/home-quote.test.mjs`
* Cambio: se agregaron pruebas estáticas para el iframe publicado, el cargador de Tally, el enlace alternativo, la comunicación de fecha/foto opcionales, el límite de 10 MB y la retirada del formulario inerte.
* Motivo: detectar regresiones que vuelvan a desconectar la portada del flujo real de cotizaciones.
* Relación: verifica los cambios recién realizados en `index.html` y `assets/styles.css`.
* Resultado: ✅ cobertura creada; ejecución de la suite pendiente.

## [2026-07-22]

* Archivo: `assets/styles.css`
* Cambio: se reemplazaron los estilos de campos locales retirados por un contenedor y un iframe responsivos para el formulario Tally, con altura mínima adaptada a escritorio y móvil.
* Motivo: evitar recortes, desbordamientos y saltos de ancho mientras Tally calcula dinámicamente la altura del formulario.
* Relación: da presentación estable al iframe agregado en `index.html` y conserva el fondo oscuro de la sección.
* Resultado: ✅ estilos responsivos del formulario incorporados; validación pendiente.

## [2026-07-22]

* Archivo: `index.html`
* Cambio: se sustituyó el formulario local que solo validaba campos por el formulario Tally publicado `ODeE7a`, con carga diferida, altura dinámica, título accesible y enlace alternativo sin JavaScript; también se añadieron fecha aproximada y foto opcional de máximo 10 MB al resumen visible.
* Motivo: hacer que las solicitudes se envíen realmente y lleguen a la hoja colaborativa conectada, incluyendo los dos nuevos datos solicitados.
* Relación: elimina el `TODO` y el controlador que impedía el envío; consume el formulario y la integración creados en los cambios anteriores.
* Resultado: ✅ integración funcional incorporada al HTML de la portada; estilos y validación local pendientes.

## [2026-07-22]

* Archivo: Google Sheets `Solicita tu cotización` (`1W_ieqiovv5dRIL39MwvgEeBHPkS9NXMrGncSCBFM3ck`)
* Cambio: se agregaron al final de la fila de encabezados las columnas operativas `Estado`, `Responsable`, `Monto cotizado`, `Fecha de despacho`, `Paquetería / guía` y `Comentarios internos`.
* Motivo: permitir que el equipo dé seguimiento colaborativo a cada cotización desde su recepción hasta el despacho.
* Relación: completa la hoja conectada al formulario Tally `ODeE7a` sin alterar las doce columnas que Tally sincroniza automáticamente.
* Resultado: ✅ tablero operativo preparado; la configuración de acceso compartido queda bajo control de la cuenta propietaria.

## [2026-07-22]

* Archivo: Google Sheets `Cotizaciones Lithora3D` (`1W_ieqiovv5dRIL39MwvgEeBHPkS9NXMrGncSCBFM3ck`)
* Cambio: se autorizó la cuenta `lithora3d@gmail.com`, se creó una hoja nueva y se conectó al formulario Tally para sincronizar cada solicitud automáticamente.
* Motivo: centralizar cotizaciones, datos de contacto, fecha requerida y enlaces de archivos en una superficie colaborativa en línea.
* Relación: recibe las respuestas del formulario `ODeE7a`; todavía falta incorporar columnas operativas y enlazar el formulario desde la portada.
* Resultado: ✅ integración Google Sheets activa y hoja creada; configuración del tablero e implementación web pendientes.

## [2026-07-22]

* Archivo: formulario Tally `Solicita tu cotización` (`https://tally.so/r/ODeE7a`)
* Cambio: se creó y publicó el formulario con nombre, correo, teléfono/WhatsApp, tipo de proyecto, descripción, fecha aproximada opcional, foto opcional de hasta 10 MB y aceptación de privacidad.
* Motivo: sustituir la validación local sin envío por una recepción real de solicitudes y archivos sin requerir inicio de sesión del cliente.
* Relación: usa la cuenta Tally creada en el cambio anterior y conserva fecha y foto como campos opcionales; tipo de proyecto y privacidad se validaron como obligatorios.
* Resultado: ✅ formulario publicado y validado en vista previa; integración con Google Sheets e inserción en la web pendientes.

## [2026-07-22]

* Archivo: cuenta Tally de `lithora3d@gmail.com`
* Cambio: se creó el espacio de trabajo gratuito de Lithora mediante inicio de sesión con Google y se completó su configuración inicial.
* Motivo: habilitar un formulario público real con archivos opcionales y sincronización con Google Sheets sin exigir cuenta al cliente.
* Relación: reemplaza el `TODO` del formulario inerte de la portada; todavía no modifica el HTML público ni crea el formulario definitivo.
* Resultado: ✅ cuenta Tally creada y panel disponible; formulario e integración pendientes.

## [2026-07-22]

* Archivo: perfil persistente de Chrome DevTools (`C:/Users/yarteaga/.codex/chrome-devtools-profile`)
* Cambio: se reinició únicamente la instancia dedicada de Chrome con depuración remota en el puerto 9224, conservando el perfil, la sesión y los parámetros del lanzador existente.
* Motivo: `chrome-devtools.list_pages` no podía conectarse porque el proceso dedicado había terminado y ningún proceso escuchaba en `127.0.0.1:9224`; la configuración MCP y el lanzador permanecían correctos.
* Relación: recupera la instancia validada el 20 y 21 de julio sin repetir cambios en `config.toml`, sin recrear el perfil y sin cerrar el Chrome personal.
* Resultado: ✅ proceso dedicado iniciado, puerto `127.0.0.1:9224` en estado `Listen` y `chrome-devtools.list_pages` validado correctamente con una pestaña seleccionada.

## [2026-07-20]

* Archivo: `assets/motion-pages.css`
* Cambio: se reconstruyó la capa visual con tokens premium, firmas nominales por página, reglas de medida, conexiones, capas táctiles, Spotlight Card, Border Glow, Glare Hover, relación tipo Magic Bento, Specular Button, estados del formulario y variantes touch/reduced.
* Motivo: ejecutar las decisiones visuales de TASK-PWM-006A y los widgets A/B sin recurrir a presets posicionales, neón, loops o dependencias React Bits.
* Relación: complementa el nuevo controlador WAAPI y conserva el alcance exclusivo de las cuatro rutas.
* Resultado: ⚠️ estilos implementados; conexión con estados funcionales, regeneración y validación pendientes.

## [2026-07-20]

* Archivo: `assets/motion-pages.js`
* Cambio: se reemplazó el selector posicional por registro nominal de 44 widgets, scheduler acotado, observer compartido, coreografías diferenciadas, spotlight delegado, controladores de detalle/menú/contexto/formulario, limpieza e instrumentación premium.
* Motivo: ejecutar TASK-PWM-004–006A y convertir el refresh genérico en un sistema por función sin segundo motor ni dependencias.
* Relación: consume los contratos HTML agregados inmediatamente antes; conserva WAAPI, base visible, 1 observer y máximo 9 listeners.
* Resultado: ⚠️ motor premium implementado; estilos, conexión funcional y pruebas pendientes.

## [2026-07-20]

* Archivo: `ecosistema-soluciones/index.html`, `scripts/render-ecosystem.mjs`
* Cambio: se asignaron contratos `SOL-W01–22` a la estructura estática y al contenido generado, incluyendo cards, imágenes, aplicaciones, detalle, galería, controles, estados, proceso, contexto, formulario, WhatsApp y footer.
* Motivo: completar TASK-PWM-003 con selectores nominales mantenibles y evitar que la regeneración de contenido elimine los contratos premium.
* Relación: continúa los contratos de las otras tres rutas y preserva la fuente única `content.js`.
* Resultado: ⚠️ fuente y plantilla actualizadas; regeneración, motor y pruebas pendientes.

## [2026-07-20]

* Archivo: `precios-impresion-3d/index.html`, `prototipado-rapido/index.html`, `materiales-impresion-3d/index.html`
* Cambio: se asignaron contratos nominales `data-motion-widget` y firmas explícitas a los 22 widgets de las tres landings, reemplazando la futura dependencia de índices y `nth-of-type`.
* Motivo: iniciar TASK-PWM-003 y habilitar coreografías individuales sin alterar contenido, enlaces, orden o semántica.
* Relación: profundiza el refresh existente; todavía no modifica el motor ni declara tareas completadas.
* Resultado: ⚠️ contratos HTML incorporados; integración CSS/JS y pruebas pendientes.

## [2026-07-20]

* Archivo: validación documental de `specs/premium-widget-motion`
* Cambio: se verificaron IDs únicos, cobertura cruzada, tarea fundacional, guard de dependencias, referencias de conteo heredadas y whitespace.
* Motivo: asegurar que requirements, design y tasks puedan guiar la implementación sin requisitos huérfanos ni contradicciones.
* Relación: cierre del grupo de integración de referencias React Bits.
* Resultado: ✅ 68/68 IDs presentes en los tres documentos, 8/8 contratos `PWM-REF`, una definición de `TASK-PWM-006A`, cero conteos heredados y `git diff --check` correcto.

## [2026-07-20]

* Archivo: `specs/premium-widget-motion/design.md`
* Cambio: se corrigieron las dos referencias residuales de 60 a 68 requisitos en el encabezado y la sección de trazabilidad.
* Motivo: eliminar una inconsistencia documental detectada por la validación posterior a la integración.
* Relación: completa la sincronización de conteos del grupo React Bits sin cambiar decisiones de diseño.
* Resultado: ✅ conteo uniforme de 68 requisitos.

## [2026-07-20]

* Archivo: `specs/premium-widget-motion/tasks.md`
* Cambio: se añadió `TASK-PWM-006A` para construir y validar las siete adaptaciones locales antes de migrar widgets; se actualizaron dependencias de entrada a las páginas, matriz de trazabilidad, camino crítico y Definition of Done para 68 requisitos.
* Motivo: convertir las referencias aprobadas en trabajo implementable, comprobable y bloqueante para las fases posteriores, sin dejarlas como una nota visual ambigua.
* Relación: ejecuta los contratos `PWM-REF-001–008` y el diseño §27.1 agregados en este mismo grupo.
* Resultado: ✅ requirements, design y tasks sincronizados; validación documental pendiente.

## [2026-07-20]

* Archivo: `specs/premium-widget-motion/design.md`
* Cambio: se añadió la traducción técnica de las siete referencias aprobadas a CSS/WAAPI propio, con asignación a widgets, composición de capas y límites de intensidad, duración, puntero, focus, touch, reduced motion y carga.
* Motivo: impedir que la inspiración se convierta en una copia de demos o en efectos acumulativos y dejar decisiones ejecutables para implementación.
* Relación: diseña `PWM-REF-001–008` y mantiene “Ensamble de precisión”, el techo de 35 KB y las firmas de las cuatro páginas.
* Resultado: ✅ diseño y matriz de 68 requisitos sincronizados; tareas pendientes de actualización en este grupo.

## [2026-07-20]

* Archivo: `specs/premium-widget-motion/requirements.md`
* Cambio: se incorporaron ocho contratos `PWM-REF-001–008` para adaptar Spotlight Card, Specular Button, Border Glow, Animated Content, Staggered Menu, Glare Hover y Magic Bento a los widgets existentes, incluyendo límites de dependencia, touch, teclado, reduced motion, CLS y rendimiento.
* Motivo: convertir las referencias visuales aprobadas por el usuario en requerimientos verificables para la fase de motion premium.
* Relación: amplía los 60 requerimientos anteriores a 68 sin cambiar el inventario de 44 widgets ni autorizar una dependencia de React Bits.
* Resultado: ✅ requisitos y trazabilidad actualizados; diseño y tareas pendientes de sincronización en este grupo.

## [2026-07-20]

* Archivo: cierre de integración de Gimnasios
* Cambio: se repitió `npm run validate` y se ejecutó `git diff --check` después de corregir el inventario de imágenes.
* Motivo: confirmar que contenido, HTML, sintaxis, recursos responsive y regresiones quedan consistentes.
* Relación: cierre de todos los cambios de la galería de Gimnasios.
* Resultado: ✅ 68/68 pruebas aprobadas, nueve nichos sincronizados y sin errores de whitespace.

## [2026-07-20]

* Archivo: `tests/static-audit.test.mjs`
* Cambio: se actualizó de 40 a 45 el inventario esperado de imágenes WebP renderizadas en Ecosistema.
* Motivo: Gimnasios pasó de un placeholder a una imagen de tarjeta y cuatro figuras de galería.
* Relación: corrige la única expectativa obsoleta detectada por la primera validación; no relaja controles de formato, peso, dimensiones ni responsive.
* Resultado: ⚠️ expectativa corregida; reejecución pendiente.

## [2026-07-20]

* Archivo: validación local del repositorio
* Cambio: se ejecutó `npm run validate` tras publicar las imágenes de Gimnasios.
* Motivo: comprobar sincronización, sintaxis, contenido y recursos antes del cierre.
* Relación: valida el grupo de integración de Gimnasios.
* Resultado: ❌ 67/68 pruebas aprobadas; la auditoría estática conserva el conteo anterior de 40 imágenes y ahora detecta 45 referencias únicas, por lo que debe actualizarse el inventario esperado.

## [2026-07-20]

* Archivo: `index.html`, `ecosistema-soluciones/index.html`
* Cambio: se regeneraron Inicio y Ecosistema con la portada `gym-letrero-power` y la galería completa de Gimnasios.
* Motivo: propagar la nueva fuente de contenido a las superficies públicas sin editar bloques generados manualmente.
* Relación: publica los derivados responsive creados en el cambio anterior.
* Resultado: ✅ nueve nichos regenerados correctamente.

## [2026-07-20]

* Archivo: `assets/gym/gym-*.webp`
* Cambio: se generaron doce variantes WebP para las cuatro imágenes de Gimnasios en anchos de 480, 768 y 960 px.
* Motivo: servir la imagen principal y la galería con recursos optimizados para cada viewport.
* Relación: ejecuta el mapeo de fuentes agregado al generador responsive.
* Resultado: ✅ derivados creados correctamente, entre 9 KB y 64 KB.

## [2026-07-20]

* Archivo: `tests/ecosistema.test.mjs`
* Cambio: se añadieron comprobaciones del HTML de Gimnasios para la portada `(4)`, las cuatro imágenes de galería y la tarjeta correspondiente en Inicio.
* Motivo: validar que la fuente se propague correctamente a las dos superficies generadas.
* Relación: amplía la regresión de datos con contratos de publicación.
* Resultado: ⚠️ pruebas agregadas; regeneración y ejecución pendientes.

## [2026-07-20]

* Archivo: `tests/content.test.mjs`
* Cambio: se agregó una regresión para exigir cuatro imágenes conceptuales de Gimnasios, sus descriptores y `gym-letrero-power` como portada.
* Motivo: impedir que el nicho vuelva al placeholder o pierda la selección principal solicitada.
* Relación: cubre el contrato de datos incorporado en el cambio de Gimnasios.
* Resultado: ⚠️ prueba agregada; ejecución pendiente.

## [2026-07-20]

* Archivo: `scripts/generate-responsive-images.py`
* Cambio: se registraron las cuatro fuentes PNG de `assets/gym` con nombres de entrega semánticos; la imagen `(4)` corresponde a `gym-letrero-power`.
* Motivo: producir variantes WebP de 480, 768 y 960 px para la portada y galería de Gimnasios.
* Relación: materializa la galería declarada en `ecosistema-soluciones/content.js` usando el flujo responsive existente.
* Resultado: ⚠️ generador actualizado; derivados pendientes de ejecución.

## [2026-07-20]

* Archivo: `ecosistema-soluciones/content.js`
* Cambio: se sustituyó el placeholder de Gimnasios por una galería de cuatro referencias conceptuales y se seleccionó `gym-letrero-power` (imagen `(4)`) como portada.
* Motivo: incorporar las cuatro imágenes indicadas por el usuario y respetar su selección de imagen principal.
* Relación: sigue el contrato de galería responsive usado por los nichos ya integrados, sin repetir la edición directa del HTML generado.
* Resultado: ⚠️ fuente de contenido actualizada; pendientes generación de derivados, regeneración de páginas y validación.

## [2026-07-20]

* Archivo: diagnóstico de `C:\Users\yarteaga\.codex\config.toml` y reinicio de Codex Desktop
* Cambio: se validó el registro restaurado desde una instancia nueva de Codex CLI, que cargó `chrome-devtools` e invocó `list_pages` correctamente; se identificó que Codex Desktop continuaba ejecutando el proceso iniciado a las 10:13, anterior a la corrección de configuración de las 16:52, y se programó el reinicio exclusivo de la aplicación.
* Motivo: cerrar la diferencia entre un servidor MCP funcional y el catálogo de herramientas obsoleto conservado por el proceso de escritorio antiguo.
* Relación: completa la restauración anterior de `[mcp_servers.chrome-devtools]`; no cambia el sitio ni el lanzador corregido por la sesión posterior.
* Resultado: ✅ prueba end-to-end correcta (`chrome-devtools.list_pages` devolvió la pestaña seleccionada); reinicio de Codex Desktop preparado para recargar el catálogo MCP.

## [2026-07-20]

* Archivo: `C:\Users\yarteaga\.codex\config.toml`
* Cambio: se restauró el registro obligatorio `[mcp_servers.chrome-devtools]` apuntando al lanzador persistente existente `start-chrome-devtools-mcp.cmd`, con tiempo de arranque de 120 segundos.
* Motivo: la configuración activa había sido reemplazada a las 10:15 y omitía por completo el servidor, aunque el lanzador, Chrome, el perfil y el runtime seguían funcionales.
* Relación: recupera la sección presente en `config.toml.bak_20260720_100900`; mejora el bloqueo histórico del 17 de julio sin modificar el sitio ni repetir la validación CDP local.
* Resultado: ✅ servidor probado manualmente mediante `initialize` y `list_pages`; configuración restaurada, pendiente de recargar Codex para que exponga las herramientas en tareas nuevas.

## [2026-07-20]

* Archivo: `scripts/generate-responsive-images.py`, `index.html`, `tests/ecosistema.test.mjs`
* Cambio: se sustituyó la fuente de “Ideas impresas” por `assets/lading/seccion_idea_01.png` y se actualizó la proporción reservada de la imagen a 960 × 431, manteniendo nombres de entrega, estilos, CTAs y contratos existentes.
* Motivo: aplicar la corrección explícita del usuario usando la creatividad correcta sin reiniciar ni rediseñar la sección ya validada.
* Relación: corrige únicamente el activo fuente del grupo anterior basado en `seccion_idea.png`.
* Resultado: ✅ referencias y prueba de dimensiones actualizadas; pendientes regeneración WebP y validación visual.

## [2026-07-20]

* Archivo: `assets/lading/seccion-idea-480.webp`, `assets/lading/seccion-idea-768.webp`, `assets/lading/seccion-idea.webp`
* Cambio: se regeneraron los tres derivados responsive usando `seccion_idea_01.png` como fuente correcta.
* Motivo: propagar la creatividad corregida a todos los tamaños realmente servidos por la portada.
* Relación: materializa la sustitución registrada inmediatamente antes sin cambiar rutas públicas.
* Resultado: ✅ 480 × 215 (22 KB), 768 × 345 (42 KB) y 960 × 431 (57 KB).

## [2026-07-20]

* Archivo: `tasks.md`, `audits/2026-07-20/browser-validation.json`, `audits/2026-07-20/home-ideas-desktop.png`, `audits/2026-07-20/home-ideas-mobile.png`
* Cambio: se actualizaron el ledger y la evidencia visual para identificar `seccion_idea_01.png` como fuente correcta; se repitieron suite y navegador y se revisaron ambas capturas.
* Motivo: cerrar la corrección con documentación y evidencia correspondientes al activo realmente servido.
* Relación: sustituye la evidencia del recurso anterior sin añadir tareas ni modificar bloqueos.
* Resultado: ✅ 59/59 pruebas, 48/48 comprobaciones Chrome/CDP, consola limpia, LCP 1080 ms, CLS 0.0069, INP 24 ms y diseño correcto en escritorio/móvil.

## [2026-07-20]

* Archivo: `index.html`, `scripts/generate-responsive-images.py`
* Cambio: se añadió a la portada la nueva sección comercial “Ideas impresas” con la imagen aprobada, etiqueta conceptual, CTA contextual a WhatsApp y enlace al ecosistema; además se retiraron de la experiencia visible los bloques internos o redundantes de intención SEO, materiales, aplicaciones y casos demostrativos, y se simplificó el lenguaje de precios y la navegación.
* Motivo: priorizar información comprensible y accionable para el cliente, sin perder las páginas especializadas ni el flujo de cotización existente.
* Relación: continúa la integración previa de nichos visuales y del canal oficial de WhatsApp; no reemplaza componentes validados.
* Resultado: ✅ estructura y contenido actualizados; pendientes estilos, derivados WebP y validación integral del grupo.

## [2026-07-20]

* Archivo: `assets/styles.css`
* Cambio: se diseñó la presentación responsive de “Ideas impresas” con fondo oscuro, acentos amarillos, retícula sutil, imagen protagonista, CTAs adaptables, foco visible y reducción de movimiento.
* Motivo: integrar la creatividad aportada como una pieza comercial de alto impacto que se lea bien en escritorio y móvil sin alterar la identidad existente.
* Relación: completa la estructura de la nueva sección registrada en el cambio anterior.
* Resultado: ✅ estilos visuales y estados accesibles incorporados.

## [2026-07-20]

* Archivo: `assets/lading/seccion-idea-480.webp`, `assets/lading/seccion-idea-768.webp`, `assets/lading/seccion-idea.webp`
* Cambio: se generaron tres derivados WebP responsive de 480, 768 y 960 px a partir de `seccion_idea.png`, conservando intacto el original.
* Motivo: reducir el peso transferido y adaptar la imagen protagonista al ancho real de cada dispositivo.
* Relación: activos de entrega para la sección “Ideas impresas”.
* Resultado: ✅ derivados creados (23 KB, 45 KB y 61 KB respectivamente).

## [2026-07-20]

* Archivo: `tests/ecosistema.test.mjs`
* Cambio: se agregaron pruebas de contrato para la sección “Ideas impresas”, sus tres imágenes responsive, dimensiones, etiqueta conceptual, CTA oficial de WhatsApp y retiro visual de bloques redundantes junto con sus enlaces internos.
* Motivo: evitar regresiones en la nueva presentación de portada y comprobar que la simplificación sea efectiva y honesta.
* Relación: valida la nueva sección y la depuración comercial de `index.html`.
* Resultado: ✅ cobertura automatizada incorporada; ejecución completa pendiente.

## [2026-07-20]

* Archivo: `tests/browser_validation.py`
* Cambio: se extendió la validación real en Chrome para comprobar carga y visibilidad de “Ideas impresas”, enlace contextual a WhatsApp, ausencia visual de bloques retirados, overflow móvil y capturas dedicadas en escritorio y móvil.
* Motivo: validar el resultado renderizado, no únicamente el contrato estático del HTML.
* Relación: amplía la evidencia responsive existente de la portada.
* Resultado: ✅ escenario de navegador incorporado; ejecución pendiente.

## [2026-07-20]

* Archivo: validación local del repositorio
* Cambio: se ejecutó `npm run validate` después de integrar y simplificar la portada.
* Motivo: verificar sincronización de contenido, sintaxis JavaScript, enlaces, metadatos, imágenes y nuevos contratos de portada.
* Relación: valida los cambios de `index.html`, estilos, activos y pruebas del grupo actual.
* Resultado: ✅ 9 nichos sincronizados y 59/59 pruebas automatizadas aprobadas, sin fallos ni omisiones.

## [2026-07-20]

* Archivo: `tests/browser_validation.py`
* Cambio: la primera ejecución de navegador falló porque verificaba la descarga de una imagen lazy antes de desplazarla al viewport; se reordenó el escenario para hacer scroll y esperar `naturalWidth > 0` antes de afirmar la carga.
* Motivo: alinear la prueba con el comportamiento real y deseado de `loading="lazy"`.
* Relación: corrección del nuevo escenario “Ideas impresas”; no afecta la implementación pública.
* Resultado: ⚠️ primer intento detenido por una aserción prematura; corrección aplicada y pendiente de reejecución.

## [2026-07-20]

* Archivo: `tests/browser_validation.py`
* Cambio: la segunda pasada confirmó la carga lazy, pero la expresión CDP terminaba devolviendo un nodo DOM no serializable; se convirtió explícitamente la consulta final del CTA a booleano.
* Motivo: hacer que el resultado de la aserción pueda cruzar correctamente el canal CDP con `returnByValue`.
* Relación: segunda corrección exclusiva del escenario de prueba de “Ideas impresas”.
* Resultado: ⚠️ segundo intento detenido por serialización del nodo; aserción corregida y pendiente de reejecución.

## [2026-07-20]

* Archivo: `audits/2026-07-20/browser-validation.json`, `audits/2026-07-20/home-ideas-desktop.png`, `audits/2026-07-20/home-ideas-mobile.png`
* Cambio: se reejecutó la validación completa con Chrome local/CDP y se inspeccionaron visualmente las capturas dedicadas de la nueva sección en escritorio y móvil.
* Motivo: confirmar carga real de imagen, responsive, ausencia de overflow, navegación, accesibilidad y calidad visual antes del cierre.
* Relación: cierre de los dos ajustes del escenario de prueba anteriores.
* Resultado: ✅ 48/48 comprobaciones; consola sin errores relevantes, LCP 1128 ms, CLS 0.0116 e INP observado 32 ms.

## [2026-07-20]

* Archivo: `tasks.md`
* Cambio: se añadieron seis casillas completadas para la nueva sección, optimización de imagen, conexión a WhatsApp, simplificación, lenguaje comercial y validación; también se actualizaron los totales de suite, navegador y métricas.
* Motivo: reflejar el estado real y la evidencia del trabajo solicitado en esta continuación.
* Relación: documentación final del grupo “Ideas impresas y simplificación de portada”.
* Resultado: ✅ estado actualizado sin alterar los 33 bloqueos externos ya documentados.

## [2026-07-20]

* Archivo: cierre de validación local
* Cambio: se repitió `npm run validate`, se verificaron tamaños de los derivados y se ejecutó `git diff --check` tras todas las correcciones y la actualización documental.
* Motivo: dejar evidencia final sobre el estado exacto entregado.
* Relación: cierre del grupo de implementación solicitado.
* Resultado: ✅ 59/59 pruebas, 9 nichos sincronizados, 48/48 comprobaciones de navegador, 0 errores relevantes de consola, sin errores de whitespace; `tasks.md` queda en 490 casillas completadas y 33 bloqueadas externamente.

## [2026-07-20]

* Archivo: sustitución Farmacias por Escuelas completa, tasks.md, audits/2026-07-20
* Cambio: se revisaron las capturas de Inicio y del detalle de Industria; Escuelas ocupa la tercera posición y no queda una tarjeta activa de Farmacias.
* Motivo: cerrar la corrección solicitada sobre el estado servido localmente y sincronizar la evidencia final.
* Relación: cierre del movimiento de Escuelas desde Diseño y prototipos al lugar de Farmacias.
* Resultado: ✅ 57/57 pruebas automatizadas, 45/45 comprobaciones Chrome/CDP, consola limpia, LCP 1056 ms, CLS 0.0069, INP 24 ms y `git diff --check` correcto.

## [2026-07-20]

* Archivo: index.html, ecosistema-soluciones/index.html
* Cambio: se regeneraron Inicio y Ecosistema con nueve nichos; Escuelas ocupa el lugar de Farmacias en Industria y Farmacias dejó de renderizarse.
* Motivo: propagar la sustitución desde la fuente mantenible sin editar manualmente los bloques generados.
* Relación: materializa el cambio de contenido y documentación registrado inmediatamente antes.
* Resultado: ✅ nueve nichos publicados y HTML sincronizado.

## [2026-07-20]

* Archivo: ecosistema-soluciones/content.js, tests, OPERATIONS.md, tasks.md
* Cambio: Escuelas se movió a Industria, orden 3, sustituyendo completamente a Farmacias; inventario, pruebas, fallback sin JavaScript y documentación volvieron a nueve nichos y treinta y seis productos.
* Motivo: aplicar la corrección explícita del usuario sin alterar las imágenes ni la portada ya aprobadas para Escuelas.
* Relación: corrige la incorporación previa como décimo nicho y preserva su integración visual validada.
* Resultado: ⚠️ fuente y expectativas actualizadas; pendiente regenerar páginas y validar.

## [2026-07-20]

* Archivo: integración Escuelas completa, tasks.md, audits/2026-07-20
* Cambio: se revisaron las capturas de Inicio y del detalle de Escuelas y se sincronizó el ledger con la evidencia final de diez nichos.
* Motivo: cerrar la selección del identificador para lápiz `(1)` como imagen principal sobre el estado servido localmente.
* Relación: cierre de todos los grupos de incorporación de Escuelas.
* Resultado: ✅ 57/57 pruebas automatizadas, 45/45 comprobaciones Chrome/CDP, consola limpia, LCP 1060 ms, CLS 0.0062, INP 24 ms y `git diff --check` correcto.

## [2026-07-20]

* Archivo: assets/escuela/escuela-*.webp, index.html, ecosistema-soluciones/index.html
* Cambio: se generaron doce variantes WebP de Escuelas en 480, 768 y 960 px y se regeneraron Inicio y Ecosistema con diez nichos.
* Motivo: servir el identificador para lápiz como portada y las cuatro referencias como galería responsive.
* Relación: materializa la incorporación de Escuelas registrada en los grupos anteriores.
* Resultado: ✅ derivados entre 8 y 47 KB; diez nichos publicados y HTML sincronizado.

## [2026-07-20]

* Archivo: tests, OPERATIONS.md, tasks.md
* Cambio: se añadieron regresiones de contenido, HTML, Inicio, navegador y activos para Escuelas; la documentación operativa y el ledger ahora reflejan diez nichos, cuarenta productos y treinta y dos referencias conceptuales aportadas por el usuario.
* Motivo: mantener sincronizados inventario, fallback sin JavaScript, publicación y evidencia con el nuevo nicho aprobado.
* Relación: cubre la incorporación de Escuelas registrada en el grupo anterior.
* Resultado: ⚠️ pruebas y documentación actualizadas; pendiente generar páginas y validar.

## [2026-07-20]

* Archivo: assets/escuela, scripts/generate-responsive-images.py, ecosistema-soluciones/content.js
* Cambio: se añadió Escuelas como décimo nicho publicado en Diseño y prototipos, con cuatro referencias conceptuales y el identificador para lápiz `(1)` como portada.
* Motivo: incorporar el nuevo nicho solicitado sin retirar ni sustituir otro contenido existente.
* Relación: amplía el inventario mediante el mismo contrato responsive y de galería ya validado.
* Resultado: ⚠️ fuente actualizada; pendiente generar WebP, regenerar HTML y validar.

## [2026-07-20]

* Archivo: integración Boda completa, tasks.md, audits/2026-07-20
* Cambio: se revisaron las capturas de Inicio y del detalle de Boda y se sincronizó el ledger con veintiocho referencias conceptuales aportadas por el usuario; Joyerías ya no se publica.
* Motivo: cerrar el reemplazo y la selección de `15_33_43.png` como imagen principal sobre el estado servido localmente.
* Relación: cierre de todos los grupos de sustitución de Joyerías por Boda.
* Resultado: ✅ 55/55 pruebas automatizadas, 45/45 comprobaciones Chrome/CDP, consola limpia, LCP 1152 ms, CLS 0.0062, INP 32 ms y `git diff --check` correcto.

## [2026-07-20]

* Archivo: assets/boda/boda-*.webp, index.html, ecosistema-soluciones/index.html
* Cambio: se generaron doce variantes WebP de Boda en 480, 768 y 960 px y se regeneraron Inicio y Ecosistema sin Joyerías.
* Motivo: servir la figura de novios como portada y las cuatro referencias como galería responsive.
* Relación: materializa el reemplazo editorial y visual registrado en los grupos anteriores.
* Resultado: ✅ derivados entre 6 y 42 KB; nueve nichos publicados y HTML sincronizado.

## [2026-07-20]

* Archivo: tests/content.test.mjs, tests/ecosistema.test.mjs, tests/static-audit.test.mjs, tests/browser_validation.py
* Cambio: se añadieron regresiones para la sustitución completa de Joyerías por Boda, la figura principal, las cuatro imágenes, el enlace de Inicio y el inventario responsive.
* Motivo: evitar que una regeneración restaure el nicho retirado o pierda la portada y galería aprobadas.
* Relación: cubre en datos, HTML y navegador el reemplazo registrado en el grupo anterior.
* Resultado: ⚠️ pruebas actualizadas; pendiente generar páginas y ejecutar la suite.

## [2026-07-20]

* Archivo: assets/boda, scripts/generate-responsive-images.py, ecosistema-soluciones/content.js
* Cambio: Boda sustituyó a Joyerías en la posición 2 de Negocios; se conectaron cuatro referencias conceptuales y la figura de novios `15_33_43.png` quedó como portada.
* Motivo: aplicar el reemplazo editorial y la selección visual indicados por el usuario sin alterar el total ni la arquitectura de nichos.
* Relación: conserva el contrato responsive y de galería validado para los reemplazos anteriores.
* Resultado: ⚠️ fuente actualizada; pendiente generar WebP, regenerar HTML y validar.

## [2026-07-20]

* Archivo: integración Hoteles completa, tasks.md, audits/2026-07-20
* Cambio: se revisaron las capturas de portada y detalle de Hoteles y se sincronizó el ledger con la evidencia final, incluyendo veinticuatro referencias conceptuales aportadas por el usuario.
* Motivo: cerrar la selección del display informativo `(3)` como imagen principal sobre el estado servido localmente.
* Relación: cierre de todos los grupos de incorporación de imágenes de Hoteles.
* Resultado: ✅ 53/53 pruebas automatizadas, 45/45 comprobaciones Chrome/CDP, consola limpia, LCP 1236 ms, CLS 0.0023, INP 32 ms y `git diff --check` correcto.

## [2026-07-20]

* Archivo: tests/ecosistema.test.mjs
* Cambio: la comprobación general de recursos locales ahora exige el display de Hoteles en lugar del recurso genérico `concept-evento.webp` que fue sustituido.
* Motivo: la primera suite obtuvo 52/53 porque conservaba una expectativa del fallback anterior; las pruebas específicas de Hoteles y el resto de la implementación pasaron.
* Relación: corrección de regresión documental derivada del reemplazo visual aprobado, sin cambio de interfaz.
* Resultado: ⚠️ expectativa corregida; pendiente repetición completa.

## [2026-07-20]

* Archivo: assets/hotel/hotel-*.webp, index.html, ecosistema-soluciones/index.html
* Cambio: se generaron doce variantes WebP de Hoteles en 480, 768 y 960 px y se regeneraron la portada y el ecosistema desde la fuente de contenido.
* Motivo: servir el display informativo `(3)` como imagen principal y las cuatro referencias como galería responsive.
* Relación: materializa la selección y las regresiones de Hoteles registradas en los grupos anteriores.
* Resultado: ✅ derivados entre 7 y 52 KB; nueve nichos publicados y HTML sincronizado.

## [2026-07-20]

* Archivo: tests/content.test.mjs, tests/ecosistema.test.mjs, tests/static-audit.test.mjs, tests/browser_validation.py
* Cambio: se añadieron regresiones para el display `(3)` principal, las cuatro imágenes conceptuales de Hoteles, el HTML generado y el nuevo inventario de imágenes; la captura de detalle ahora verifica Hoteles.
* Motivo: proteger el orden solicitado, los activos responsive y el etiquetado conceptual durante futuras regeneraciones.
* Relación: cubre la integración de Hoteles registrada inmediatamente antes.
* Resultado: ⚠️ pruebas actualizadas; pendiente ejecutarlas sobre el HTML regenerado.

## [2026-07-20]

* Archivo: assets/hotel, scripts/generate-responsive-images.py, ecosistema-soluciones/content.js
* Cambio: se conectaron cuatro referencias conceptuales de Hoteles y se seleccionó la imagen `(3)`, correspondiente al display informativo, como portada y primer elemento de la galería.
* Motivo: aplicar la selección visual explícita del usuario sin cambiar el nicho ni presentar las imágenes como proyectos reales.
* Relación: extiende el contrato responsive y de galería ya validado para Dentistas y los nichos anteriores.
* Resultado: ⚠️ fuente actualizada; pendiente generar WebP, regenerar HTML y validar.

## [2026-07-20]

* Archivo: integración Dentistas completa, tasks.md, audits/2026-07-20
* Cambio: se revisaron las capturas de portada y detalle de Dentistas y se sincronizó el ledger con la evidencia final, incluyendo veinte referencias conceptuales aportadas por el usuario.
* Motivo: cerrar la selección del llavero `(2)` como imagen principal sobre el estado servido localmente.
* Relación: cierre de todos los grupos de incorporación de imágenes de Dentistas.
* Resultado: ✅ 51/51 pruebas automatizadas, 45/45 comprobaciones Chrome/CDP, consola limpia, LCP 1156 ms, CLS 0.0062, INP 32 ms y `git diff --check` correcto.

## [2026-07-20]

* Archivo: assets/dentista/dentista-*.webp, index.html, ecosistema-soluciones/index.html
* Cambio: se generaron doce variantes WebP de Dentistas en 480, 768 y 960 px y se regeneraron la portada y el ecosistema desde la fuente de contenido.
* Motivo: servir el llavero como imagen principal y las cuatro referencias como galería responsive con dimensiones reservadas.
* Relación: materializa la selección y las pruebas registradas en los dos grupos anteriores.
* Resultado: ✅ derivados entre 8 y 29 KB; nueve nichos publicados y HTML sincronizado.

## [2026-07-20]

* Archivo: tests/content.test.mjs, tests/ecosistema.test.mjs, tests/static-audit.test.mjs, tests/browser_validation.py
* Cambio: se añadieron regresiones para el llavero principal, las cuatro imágenes conceptuales de Dentistas, el HTML generado y el nuevo total de imágenes optimizadas; la captura de detalle ahora verifica este nicho.
* Motivo: impedir que futuras regeneraciones pierdan el orden solicitado, el etiquetado conceptual o los activos de la galería.
* Relación: cubre la integración de Dentistas registrada en el grupo anterior.
* Resultado: ⚠️ pruebas actualizadas; pendiente ejecutarlas sobre el HTML regenerado.

## [2026-07-20]

* Archivo: assets/dentista, scripts/generate-responsive-images.py, ecosistema-soluciones/content.js
* Cambio: se conectaron las cuatro referencias conceptuales de Dentistas y se seleccionó la imagen `(2)`, correspondiente al llavero, como portada y primer elemento de la galería.
* Motivo: aplicar la selección visual explícita del usuario al nicho Dentistas sin alterar el flujo ni presentarla como proyecto real.
* Relación: reutiliza el contrato responsive y de galería conceptual validado para los nichos anteriores.
* Resultado: ⚠️ fuente actualizada; pendiente generar WebP, regenerar HTML y validar.

## [2026-07-20]

* Archivo: integración Hamburgueserías completa, tasks.md, audits/2026-07-20
* Cambio: se revisaron capturas de portada y detalle de Hamburgueserías y se sincronizó el ledger con la evidencia final.
* Motivo: cerrar la selección de la figura `(3)` como imagen principal sobre el estado servido localmente.
* Relación: cierre de todos los grupos de incorporación de imágenes Hamburgueserías.
* Resultado: ✅ 49/49 pruebas automatizadas, 45/45 comprobaciones Chrome/CDP, consola limpia, LCP 1092 ms, CLS 0.0023, INP 32 ms y `git diff --check` correcto.

## [2026-07-20]

* Archivo: assets/hamburgueseria/hamburgueseria-*.webp, index.html, ecosistema-soluciones/index.html
* Cambio: se generaron doce WebP de Hamburgueserías en 480, 768 y 960 px y se regeneraron la portada y el ecosistema.
* Motivo: servir las cuatro referencias con la figura `(3)` como portada y primera imagen del detalle.
* Relación: materializa la selección registrada en el grupo anterior.
* Resultado: ✅ derivados entre 9 y 41 KB; nueve nichos sincronizados en fuente y HTML.

## [2026-07-20]

* Archivo: assets/hamburgueseria, scripts/generate-responsive-images.py, ecosistema-soluciones/content.js, tests, tasks.md
* Cambio: se conectaron cuatro referencias conceptuales de Hamburgueserías y se ordenó la figura (3) como imagen principal; se añadieron regresiones de contenido, HTML y navegador.
* Motivo: aplicar la selección visual explícita del usuario sobre el nicho existente.
* Relación: reutiliza el contrato de galería responsive ya validado y eleva a dieciséis las referencias aportadas por el usuario.
* Resultado: ⚠️ fuente, pruebas y ledger actualizados; pendiente generar WebP, regenerar páginas y validar.

## [2026-07-20]

* Archivo: integración Pizzerías completa, tasks.md, audits/2026-07-20
* Cambio: se revisaron capturas de portada y detalle de Pizzerías y se sincronizó el ledger con los resultados finales.
* Motivo: cerrar la eliminación de Papelerías y la selección del llavero principal sobre el estado servido localmente.
* Relación: cierre de todos los grupos de incorporación de imágenes Pizzerías.
* Resultado: ✅ 47/47 pruebas automatizadas, 45/45 comprobaciones Chrome/CDP, consola limpia, LCP 1064 ms, CLS 0.0062, INP 24 ms y `git diff --check` correcto.

## [2026-07-20]

* Archivo: tests/browser_validation.py
* Cambio: el fallback sin JavaScript ahora exige nueve tarjetas legibles en lugar de diez.
* Motivo: la segunda auditoría llegó correctamente al escenario sin JavaScript y encontró el último conteo heredado de Papelerías.
* Relación: completa la adaptación del navegador al inventario actual.
* Resultado: ⚠️ expectativa corregida; pendiente repetición final.

## [2026-07-20]

* Archivo: tests/browser_validation.py
* Cambio: el conteo inicial visible de Negocios se ajustó de tres tarjetas a dos.
* Motivo: la primera auditoría Chrome se detuvo en la expectativa anterior tras eliminar Papelerías; la interfaz cargó correctamente.
* Relación: adapta el escenario de filtrado a los nueve nichos actuales.
* Resultado: ⚠️ prueba corregida; pendiente repetición de navegador.

## [2026-07-20]

* Archivo: tests/ecosistema.test.mjs
* Cambio: el inventario de IDs indexables esperado se ajustó de diez a nueve.
* Motivo: la primera suite obtuvo 46/47 porque esa expectativa heredada no contemplaba la eliminación aprobada de Papelerías.
* Relación: corrección exclusiva de prueba; la fuente y el HTML ya estaban sincronizados con nueve nichos.
* Resultado: ⚠️ regresión corregida; pendiente repetición completa.

## [2026-07-20]

* Archivo: assets/pizzeria/pizzeria-*.webp, index.html, ecosistema-soluciones/index.html
* Cambio: se generaron doce WebP de Pizzerías en 480, 768 y 960 px y se regeneraron las páginas con nueve nichos.
* Motivo: servir las cuatro referencias aportadas con el llavero como portada y sin conservar la tarjeta Papelerías.
* Relación: materializa el cambio editorial y visual del grupo anterior.
* Resultado: ✅ derivados entre 7 y 54 KB; fuente y HTML sincronizados con nueve nichos.

## [2026-07-20]

* Archivo: tests/browser_validation.py
* Cambio: la auditoría Chrome comprobará el llavero principal, las cuatro figuras de Pizzerías y la ausencia de Papelerías; las capturas completas enfocarán el detalle actualizado.
* Motivo: aportar evidencia directa de la última decisión visual y editorial.
* Relación: amplía la validación existente de galerías de Barberías y Transporte.
* Resultado: ⚠️ comprobación configurada; pendiente regeneración y ejecución.

## [2026-07-20]

* Archivo: assets/pizzeria, scripts/generate-responsive-images.py, ecosistema-soluciones/content.js, tests, OPERATIONS.md, assets/styles.css, tasks.md
* Cambio: se eliminó Papelerías y se preparó Pizzerías con cuatro referencias conceptuales, ordenando el llavero `(2)` como imagen principal y primera pieza de la galería.
* Motivo: aplicar la decisión explícita del usuario sin duplicar Pizzerías.
* Relación: el inventario publicado pasa de diez a nueve nichos y de cuarenta a treinta y seis aplicaciones ejemplo.
* Resultado: ⚠️ fuente, pruebas y documentación actualizadas; pendiente generar WebP, regenerar páginas y validar.

## [2026-07-20]

* Archivo: integración Transporte completa, tasks.md, audits/2026-07-20
* Cambio: se ejecutó la validación final y se revisaron capturas completas de escritorio y móvil con Transporte abierto y su galería 2×2.
* Motivo: cerrar el reemplazo sobre el estado exacto servido localmente y sincronizar la evidencia del ledger.
* Relación: cierre de todos los grupos de sustitución de Ferreterías por Transporte.
* Resultado: ✅ 45/45 pruebas automatizadas, 44/44 comprobaciones Chrome/CDP, consola limpia, LCP 1160 ms, CLS 0.0062, INP 24 ms y `git diff --check` correcto.

## [2026-07-20]

* Archivo: tests/browser_validation.py, tasks.md
* Cambio: las capturas completas pasaron a enfocar Transporte y el ledger se sincronizó con 45 pruebas y 44 comprobaciones de navegador.
* Motivo: dejar evidencia visual y documental de la sustitución más reciente, no de la tarjeta anterior.
* Relación: cierre documental previo a la auditoría final de Transporte.
* Resultado: ⚠️ captura y métricas configuradas; pendiente repetición final.

## [2026-07-20]

* Archivo: assets/transporte/transporte-*.webp, index.html, ecosistema-soluciones/index.html
* Cambio: se generaron doce WebP de Transporte en 480, 768 y 960 px y se regeneraron la portada y el ecosistema desde la fuente única.
* Motivo: servir los cuatro PNG aportados con peso, dimensiones y `srcset` adecuados.
* Relación: materializa el reemplazo de Ferreterías registrado en el grupo anterior.
* Resultado: ✅ derivados entre 6 y 51 KB; diez nichos sincronizados con Transporte en la posición anterior de Ferreterías.

## [2026-07-20]

* Archivo: assets/transporte, scripts/generate-responsive-images.py, ecosistema-soluciones/content.js, tests, tasks.md
* Cambio: Transporte sustituyó a Ferreterías en la categoría Industria y en el mismo orden; se conectaron cuatro referencias conceptuales de display, llavero, figura y emblema, con cobertura de contenido, HTML y navegador.
* Motivo: aplicar la nueva selección de nicho e imágenes indicada por el usuario sin aumentar el total de diez tarjetas.
* Relación: reutiliza el contrato de galería responsive implementado para Barberías y actualiza el ledger comercial.
* Resultado: ⚠️ fuente, pruebas y estado documental actualizados; pendiente generar WebP, regenerar páginas y validar.

## [2026-07-20]

* Archivo: integración Barberías completa, audits/2026-07-20
* Cambio: se ejecutó la validación secuencial final y se revisaron las capturas completas de escritorio y móvil con la galería abierta.
* Motivo: cerrar la entrega sobre el mismo estado generado que verá el usuario localmente.
* Relación: cierre de todos los grupos de incorporación de imágenes Barberías.
* Resultado: ✅ 43/43 pruebas automatizadas, 43/43 comprobaciones Chrome/CDP, consola limpia, LCP 1044 ms, CLS 0.0023, INP 32 ms y `git diff --check` correcto.

## [2026-07-20]

* Archivo: tests/browser_validation.py
* Cambio: la espera del deep link portada→Dentistas ahora comprueba que el nodo exista antes de leer su estado `hidden`.
* Motivo: una ejecución concurrente alcanzó el documento nuevo antes de que Chrome terminara de construir el detalle y provocó un TypeError de la prueba, no de la interfaz.
* Relación: estabiliza una validación preexistente descubierta al repetir la auditoría de Barberías.
* Resultado: ⚠️ espera robustecida; pendiente ejecución secuencial final.

## [2026-07-20]

* Archivo: ecosistema-soluciones/ecosistema.js, tests/browser_validation.py
* Cambio: la galería ahora acompaña la visibilidad de los estados loading/error/ready y la auditoría comprueba la ruta declarada sin depender de `currentSrc` antes de que lazy loading descargue el recurso.
* Motivo: la primera comprobación Chrome de la galería falló porque imágenes fuera del viewport pueden conservar `currentSrc` vacío; también se detectó que el nuevo bloque debía participar en el contrato de estado.
* Relación: endurece la integración de Barberías sin cambiar el flujo existente de detalle.
* Resultado: ⚠️ comportamiento y prueba corregidos; pendiente repetición final.

## [2026-07-20]

* Archivo: tests/browser_validation.py
* Cambio: se agregó comprobación en Chrome de las cuatro figuras de Barberías, sus recursos locales y textos alternativos conceptuales.
* Motivo: validar en DOM real la nueva galería además de la fuente estática.
* Relación: completa la cobertura funcional y accesible de la integración visual.
* Resultado: ⚠️ comprobación agregada; pendiente repetición de navegador.

## [2026-07-20]

* Archivo: tests/static-audit.test.mjs
* Cambio: se actualizó el inventario esperado de imágenes WebP del ecosistema de tres a ocho elementos renderizados.
* Motivo: la segunda ejecución obtuvo 42/43 porque el conteo anterior no incluía la portada y las cuatro vistas nuevas de Barberías.
* Relación: completa la adaptación de la auditoría estática a la galería añadida.
* Resultado: ⚠️ inventario corregido; pendiente repetición final.

## [2026-07-20]

* Archivo: tests/ecosistema.test.mjs, tests/static-audit.test.mjs
* Cambio: se acotó el conteo de etiquetas conceptuales a los `span` visibles y se aceptaron anchos responsive expresados como cualquier unidad `vw` válida.
* Motivo: la primera ejecución obtuvo 41/43 porque contaba también los textos alternativos y exigía `100vw` aunque las miniaturas ocupan correctamente `50vw`.
* Relación: corrección de las regresiones incorporadas para la galería Barberías; no cambia la interfaz.
* Resultado: ⚠️ dos aserciones corregidas; pendiente repetición completa.

## [2026-07-20]

* Archivo: assets/barber/barber-*.webp, index.html, ecosistema-soluciones/index.html
* Cambio: se generaron doce derivados WebP de Barberías en 480, 768 y 960 px y se regeneraron portada y ecosistema desde la fuente de contenido.
* Motivo: entregar imágenes ligeras, responsivas y con dimensiones reservadas para prevenir CLS.
* Relación: materializa la integración de los cuatro PNG originales registrada en el grupo anterior.
* Resultado: ✅ derivados entre 7 y 39 KB; diez nichos sincronizados y Barberías con cuatro imágenes conceptuales.

## [2026-07-20]

* Archivo: assets/barber, scripts/generate-responsive-images.py, ecosistema-soluciones/content.js, scripts/render-ecosystem.mjs, ecosistema-soluciones/ecosistema.css, tests
* Cambio: se conectaron las cuatro imágenes aportadas para Barberías como portada y galería conceptual de letrero, llavero, figura y display; se preparó generación WebP responsive y cobertura automatizada.
* Motivo: sustituir el fallback gráfico por los recursos específicos entregados por el usuario sin tratarlos como proyectos reales.
* Relación: amplía el nicho Barberías recién aprobado y conserva intactos los PNG originales.
* Resultado: ⚠️ implementación y pruebas listas; pendiente generar derivados, regenerar HTML y validar en navegador.

## [2026-07-20]

* Archivo: index.html, ecosistema-soluciones/index.html
* Cambio: se regeneraron la portada y el ecosistema para mostrar `Barberías` y enlazar al nuevo detalle `barberias` desde ambas vistas.
* Motivo: propagar el cambio editorial desde la fuente única sin editar a mano los bloques generados.
* Relación: completa la sustitución registrada inmediatamente antes en `content.js`.
* Resultado: ✅ diez nichos publicados y sincronizados en home y ecosistema.

## [2026-07-20]

* Archivo: ecosistema-soluciones/content.js, tests/content.test.mjs, tests/browser_validation.py
* Cambio: se sustituyó el nicho `Estéticas y salones de belleza` por `Barberías`, incluyendo identificador, enlace directo, textos, CTA y regresiones automatizadas.
* Motivo: aplicar la nueva decisión editorial del usuario en la fuente única de contenido.
* Relación: conserva los diez nichos, los cuatro productos ejemplo y la arquitectura compartida entre home y ecosistema.
* Resultado: ✅ cambio propagado sin referencias activas al nicho anterior; 41/41 pruebas automatizadas y 42/42 comprobaciones de navegador aprobadas, con consola limpia.

## [2026-07-20]

* Archivo: index.html, assets/styles.css, scripts/render-ecosystem.mjs, ecosistema-soluciones/ecosistema.js, tests, tasks.md, audits/2026-07-20
* Cambio: se completo la seccion visual de diez nichos en la home y su recorrido directo a cada detalle del ecosistema; se sincronizo el ledger con la evidencia final.
* Motivo: entregar en portada la exploracion por actividad que el usuario esperaba segun su referencia.
* Relacion: cierre de la integracion solicitada sin duplicar la fuente de contenido ni presentar ejemplos como proyectos reales.
* Resultado: ✅ 41/41 pruebas, 42/42 comprobaciones Chrome/CDP, consola limpia, LCP 1016 ms, CLS 0.0023, INP 24 ms y capturas desktop/mobile revisadas; 484 casillas completas y 33 externas sin cambio.

## [2026-07-20]

* Archivo: index.html
* Cambio: se agrego acceso `Nichos` en la navegacion de escritorio y movil hacia la nueva seccion de la home.
* Motivo: hacer el bloque inmediatamente descubrible ademas de visible al recorrer la portada.
* Relacion: cierre de usabilidad de la integracion home-ecosistema.
* Resultado: ✅ ancla local conectada a `#nichos`; pendiente de cierre documental final.

## [2026-07-20]

* Archivo: tests/browser_validation.py
* Cambio: se silenciaron exclusivamente los resets de conexion esperados al cerrar Chrome contra el servidor temporal de pruebas.
* Motivo: la auditoria paso 42/42, pero el cierre abrupto de sockets imprimia trazas irrelevantes despues del resultado correcto.
* Relacion: limpieza del runner descubierta al validar los deep links de la home.
* Resultado: ⚠️ parcial; correccion aplicada y pendiente de repeticion final.

## [2026-07-20]

* Archivo: tests/browser_validation.py, audits/2026-07-20/home-niches-*.png
* Cambio: la auditoria local ahora comprueba diez nichos en la home, overflow movil, capturas enfocadas en la seccion y apertura directa del detalle Dentistas.
* Motivo: validar en navegador el recorrido exacto solicitado, no solo la existencia estatica del bloque.
* Relacion: evidencia visual y funcional de la nueva conexion home-ecosistema.
* Resultado: ⚠️ parcial; escenario agregado y pendiente de ejecucion.

## [2026-07-20]

* Archivo: ecosistema-soluciones/ecosistema.js, tests/ecosistema.test.mjs
* Cambio: los enlaces de las tarjetas de la home ahora seleccionan la categoria y abren directamente el detalle del nicho solicitado; se agregaron pruebas de diez tarjetas y deep link.
* Motivo: conectar la portada con el contenido concreto, no solo con la cabecera general del ecosistema.
* Relacion: completa la navegacion de la nueva seccion generada desde `content.js`.
* Resultado: ⚠️ parcial; comportamiento y regresiones listos, pendientes de suite/navegador.

## [2026-07-20]

* Archivo: assets/styles.css
* Cambio: se diseno la cuadricula de nichos de la home con diez tarjetas responsive, visuales conceptuales negro/gris/amarillo, imagenes existentes, estados hover/focus y CTAs de ecosistema/WhatsApp.
* Motivo: trasladar la jerarquia visual de la referencia a la identidad Lithora sin copiar marcas, productos ni convertir la seccion en catalogo.
* Relacion: completa la estructura generada del grupo anterior y mantiene las etiquetas conceptuales honestas.
* Resultado: ⚠️ parcial; estilos terminados y pendientes de regeneracion/prueba visual.

## [2026-07-20]

* Archivo: index.html, scripts/render-ecosystem.mjs
* Cambio: se agrego a la home una region generada desde `content.js` para los diez nichos aprobados, con aplicaciones, procedencia conceptual y enlaces profundos al ecosistema.
* Motivo: el contenido por nicho existia tecnicamente, pero no era visible ni descubrible como tarjetas desde la portada en el formato esperado por el usuario.
* Relacion: reutiliza la fuente estatica y las decisiones aprobadas sin duplicar contenido ni convertir la home en ecommerce.
* Resultado: ⚠️ parcial; estructura/generador preparados, pendientes de estilos, regeneracion y validacion.

## [2026-07-20]

* Archivo: scripts/serve-local.mjs, package.json, assets/animations.js, tests/serve-local.test.mjs, tests/static-audit.test.mjs, tasks.md
* Cambio: se arranco el servidor Node estable en `127.0.0.1:8000`, se valido una carga limpia completa y se actualizo el ledger con la nueva cobertura.
* Motivo: cerrar el incidente de pagina sin estilos y hero oculto sobre el estado exacto que ve el usuario.
* Relacion: cierre de los dos grupos de correccion local inmediatamente anteriores.
* Resultado: ✅ servidor activo PID 15804; captura limpia con CSS, imagen y contenido visibles; `npm run validate` 39/39 y `git diff --check` correcto.

## [2026-07-20]

* Archivo: assets/animations.js, tests/static-audit.test.mjs
* Cambio: se agrego un seguro de visibilidad que elimina opacidad residual del hero tras dos segundos si GSAP/CDN o una pestaña suspendida detienen la entrada; se agrego regresion estatica.
* Motivo: la validacion limpia confirmo CSS e imagen cargados, pero revelo que una animacion interrumpida podia ocultar indefinidamente el contenido principal.
* Relacion: complementa el servidor local estable y conserva la animacion normal cuando finaliza correctamente.
* Resultado: ⚠️ parcial; fallback implementado y pendiente de pruebas/captura final.

## [2026-07-20]

* Archivo: scripts/serve-local.mjs, tests/serve-local.test.mjs
* Cambio: el servidor local se hizo importable y se agregaron regresiones para raiz, paginas anidadas, CSS, 404, recorrido seguro y arranque explicito.
* Motivo: verificar el nuevo comportamiento sin depender de una solicitud externa ni iniciar procesos durante la suite.
* Relacion: cobertura del comando `npm run serve` agregado para corregir la vista local sin estilos.
* Resultado: ⚠️ parcial; tres pruebas agregadas y pendientes de ejecucion.

## [2026-07-20]

* Archivo: scripts/serve-local.mjs, package.json
* Cambio: se agrego `npm run serve`, un servidor local sin cache que resuelve rutas de carpeta, MIME de CSS/JS/imagenes y respuestas 404 sin depender del logger de Python.
* Motivo: el servidor temporal anterior quedo con el canal de salida cerrado y entregaba HTML sin completar solicitudes de estilos, causando la vista parcialmente sin diseno reportada por el usuario.
* Relacion: mejora el flujo local sin cambiar rutas web correctas ni la implementacion validada del sitio.
* Resultado: ⚠️ parcial; servidor creado y pendiente de arranque/validacion visual.

## [2026-07-20]

* Archivo: repositorio completo, tasks.md, audits/2026-07-20
* Cambio: se repitieron sincronizacion, sintaxis, suite, auditoria estatica y navegador despues del endurecimiento final de WhatsApp; se audito cada casilla restante y su metadata externa.
* Motivo: cerrar la continuacion con evidencia sobre el estado exacto entregado.
* Relacion: cierre final de TASK-004, TASK-063, TASK-064 y TASK-066.
* Resultado: ✅ 35/35 pruebas, 39/39 checks Chrome/CDP, 7/7 auditorias estaticas, consola limpia, LCP 1212 ms, CLS 0.0023, INP 24 ms, `git diff --check` correcto; 484/517 casillas completas y 33 bloqueadas externamente con dependencia, propietario y siguiente accion.

## [2026-07-20]

* Archivo: ecosistema-soluciones/quote-channel.js, ecosistema-soluciones/ecosistema.js, tests/ecosistema.test.mjs, tests/browser_validation.py
* Cambio: se mantuvo deteccion real de popup bloqueado sin usar el feature `noopener` que puede devolver `null` tras una apertura valida; la referencia `opener` se corta inmediatamente y el enlace directo ahora recibe el mismo contexto codificado.
* Motivo: evitar mostrar error falso al abrir WhatsApp y asegurar que tambien el fallback preserve categoria, nicho, aplicacion y origen.
* Relacion: endurecimiento final del handoff aprobado, descubierto durante la revision del contrato del navegador.
* Resultado: ⚠️ parcial; implementado con regresiones y pendiente de repetir validacion completa.

## [2026-07-20]

* Archivo: tasks.md
* Cambio: se cerro TASK-066 con evidencia 35/35 y 39/39, se actualizaron riesgos/fases obsoletos y se resolvieron las dos casillas duplicadas de canal y aprobacion del resumen.
* Motivo: reflejar el estado real despues de la validacion completa y dejar abiertas solo dependencias externas genuinas.
* Relacion: cierre del ledger iniciado en TASK-004, TASK-063 y TASK-064.
* Resultado: ✅ 484 casillas completas y 33 bloqueadas externamente.

## [2026-07-20]

* Archivo: ecosistema-soluciones/ecosistema.js, tests/browser_validation.py
* Cambio: el primer contexto seleccionado ahora reemplaza el texto generico inicial por el mensaje contextual de WhatsApp; las ediciones posteriores del visitante siguen preservandose.
* Motivo: la primera auditoria de navegador se detuvo al comprobar el nicho dentro del mensaje porque el valor inicial aun no estaba identificado como autogenerado.
* Relacion: correccion del contrato de preservacion de contexto sin sobrescribir mensajes editados.
* Resultado: ⚠️ parcial; suite automatizada 35/35, primera auditoria Chrome detenida en contexto y pendiente de repeticion.

## [2026-07-20]

* Archivo: tests/content.test.mjs, ecosistema-soluciones/index.html
* Cambio: se corrigio la regresion de etiqueta conceptual para usar un registro conceptual y se restauro la indicacion visible de maximo 10 MB en el adjunto.
* Motivo: la primera ejecucion de `npm run validate` obtuvo 33/35; la prueba usaba por error un fallback `missing` y el copy habia perdido el limite aunque la validacion seguia activa.
* Relacion: correccion puntual descubierta al validar el nuevo contenido y canal WhatsApp.
* Resultado: ⚠️ parcial; 33/35 en el primer intento, correcciones aplicadas y pendientes de repeticion.

## [2026-07-20]

* Archivo: tasks.md
* Cambio: se cerraron individualmente las aprobaciones de cantidad, nichos, productos, capacidad editorial y seleccion visual de TASK-004, TASK-063 y TASK-064 con trazabilidad a la decision del usuario.
* Motivo: esos nueve puntos ya no dependen de una decision externa y no debian permanecer etiquetados como bloqueos.
* Relacion: sustituye el estado anterior de ocho registros `published-demo` por diez registros `published` y tres conceptos seleccionados honestamente.
* Resultado: ✅ siete casillas de tarea desbloqueadas; pendiente actualizar las dos casillas duplicadas del resumen tras ejecutar validaciones.

## [2026-07-20]

* Archivo: ecosistema-soluciones/index.html, OPERATIONS.md
* Cambio: se regeneraron diez tarjetas publicadas y se alinearon copy, operacion, despliegue y rollback con WhatsApp oficial, contenido aprobado y uso conceptual honesto.
* Motivo: eliminar instrucciones obsoletas de ocho demos y endpoint pendiente sin convertir la seccion en catalogo ni atribuir proyectos reales.
* Relacion: aplica las decisiones aprobadas a la fuente HTML y al procedimiento operativo.
* Resultado: ✅ diez nichos sincronizados; documentacion actualizada para validacion final.

## [2026-07-20]

* Archivo: tests/content.test.mjs, tests/quote-channel.test.mjs, tests/ecosistema.test.mjs, tests/static-audit.test.mjs, tests/browser_validation.py
* Cambio: se actualizaron regresiones para los diez nichos aprobados, productos exactos, referencia visual, canal WhatsApp, mensaje/contexto, handoff sin confirmacion falsa, popup bloqueado y nuevos identificadores en navegador.
* Motivo: aportar evidencia automatizada del contenido y canal aprobados y retirar supuestos de los ocho nichos anteriores.
* Relacion: valida la nueva configuracion de contenido y cotizacion sin alterar los contratos de accesibilidad, navegacion o rendimiento.
* Resultado: ⚠️ parcial; pruebas actualizadas y pendientes de ejecucion.

## [2026-07-20]

* Archivo: ecosistema-soluciones/quote-channel.js, ecosistema-soluciones/ecosistema.js, ecosistema-soluciones/index.html
* Cambio: se configuro WhatsApp +52 833 108 0178 como canal principal, con mensaje editable que preserva categoria, nicho, aplicacion y URL de origen; el adaptador distingue disponibilidad, apertura del canal, error y confirmacion real.
* Motivo: aplicar el canal aprobado sin simular una cotizacion completada ni depender de un backend inexistente.
* Relacion: completa el contrato local de TASK-038 a TASK-040 y resuelve el bloqueo previo del canal de cotizacion.
* Resultado: ⚠️ parcial; integracion terminada y pendiente de pruebas automatizadas y navegador.

## [2026-07-20]

* Archivo: ecosistema-soluciones/content.js
* Cambio: se sustituyeron los ocho nichos demostrativos anteriores por los diez nichos y productos ejemplo aprobados, todos publicables y distribuidos entre las cuatro categorias; se registro WhatsApp y la referencia visual negro/gris/amarillo en el modelo.
* Motivo: aplicar las decisiones comerciales aprobadas sin cambiar la arquitectura ni presentar conceptos como proyectos reales.
* Relacion: desbloquea TASK-004, TASK-063 y la seleccion/cantidad inicial de contenido; conserva los fallbacks y tres imagenes OpenArt contextualmente compatibles como Ejemplo conceptual.
* Resultado: ⚠️ parcial; modelo actualizado, pendiente de regenerar HTML y validar.

## [2026-07-20]

* Archivo: tests/browser_validation.py, audits/2026-07-20/browser-validation.json
* Cambio: se ejecuto la auditoria final con arbol de accesibilidad incluido.
* Motivo: cerrar la ultima comprobacion sobre el estado entregado.
* Relacion: cierre final de calidad local.
* Resultado: ✅ 39/39 comprobaciones Chrome; main, navigation y heading presentes en el arbol accesible; consola limpia; LCP 1112 ms, CLS 0.0023 e INP 32 ms; git diff --check correcto.

## [2026-07-20]

* Archivo: tests/browser_validation.py
* Cambio: se agrego inspeccion del arbol de accesibilidad de Chrome para confirmar main, navegacion y encabezados expuestos a tecnologia asistiva.
* Motivo: aportar evidencia directa adicional para la validacion semantica equivalente a lector de pantalla.
* Relacion: refuerza TASK-047, TASK-048 y TASK-050.
* Resultado: ⚠️ parcial; pendiente de ejecutar el navegador final.

## [2026-07-20]

* Archivo: repositorio completo
* Cambio: se repitio la validacion final despues de corregir la semantica de quote_start.
* Motivo: dejar evidencia del estado exacto entregado, no del estado anterior a la ultima correccion.
* Relacion: cierre definitivo de la continuacion.
* Resultado: ✅ 30/30 pruebas, 38/38 comprobaciones Chrome, content:check correcto, git diff --check correcto, consola 0 errores relevantes, LCP 1084 ms, CLS 0.0023, INP 24 ms; 474 casillas marcadas y 43 bloqueadas externamente.

## [2026-07-20]

* Archivo: ecosistema-soluciones/ecosistema.js, tests/ecosistema.test.mjs
* Cambio: quote_start ahora se emite solo si el adaptador confirma que existe un canal configurado; se agrego regresion estructural.
* Motivo: alinear el evento con design.md y evitar contabilizar como inicio una solicitud que permanece en estado unavailable.
* Relacion: correccion final de TASK-039 y TASK-055 sin cambiar los estados honestos del formulario.
* Resultado: ⚠️ parcial; corregido y pendiente de la repeticion final.

## [2026-07-20]

* Archivo: repositorio completo, tasks.md, audits/2026-07-20
* Cambio: se ejecuto la validacion final despues de todos los cambios y se comprobo el diff, el ledger y las pendientes externas.
* Motivo: verificar la Definition of Done local sobre el estado exacto de entrega.
* Relacion: cierre de TASK-066 local y preparacion reversible de TASK-067/TASK-068.
* Resultado: ✅ content:check sincroniza 8 nichos; 30/30 pruebas; 38/38 checks Chrome; consola limpia; LCP 1136 ms, CLS 0.0023, INP 24 ms; git diff --check sin errores; 474 casillas marcadas, 43 pendientes y 0 pendientes sin etiqueta externa.

## [2026-07-20]

* Archivo: tasks.md
* Cambio: se auditaron individualmente las 461 casillas pendientes; 418 se marcaron con evidencia local y 43 quedaron sin marcar exclusivamente como Blocked externally, cada una con dependencia, propietario y siguiente accion. Se reemplazo el ledger obsoleto por el estado local final y seis bloqueos externos consolidados.
* Motivo: alinear el plan con la implementacion, pruebas y auditorias actuales sin esconder aprobaciones ni accesos pendientes.
* Relacion: saneamiento final solicitado despues de completar contratos, contenido, navegador, SEO, accesibilidad y rendimiento.
* Resultado: ✅ 474 casillas totales marcadas, 43 sin marcar y todas las pendientes contienen la etiqueta Blocked externally con razon precisa.

## [2026-07-20]

* Archivo: servicio-impresion-3d/index.html, precios-impresion-3d/index.html, prototipado-rapido/index.html, materiales-impresion-3d/index.html
* Cambio: se agrego enlace contextual de navegacion hacia el ecosistema desde las cuatro landings relacionadas.
* Motivo: completar el enlazado interno bidireccional y evitar que la ruta dependa solo de la home.
* Relacion: completa TASK-021, TASK-052 y TASK-065.
* Resultado: ✅ enlaces agregados; pendiente de la suite final de enlaces.

## [2026-07-20]

* Archivo: scripts/generate-responsive-images.py, scripts/render-ecosystem.mjs, assets/concept-*-480.webp, assets/concept-*-768.webp, ecosistema-soluciones/index.html
* Cambio: se generaron ocho variantes WebP responsive sin metadatos y se agregaron srcset/sizes a los cuatro conceptos; la prueba de imagen fallida ahora elimina srcset antes de forzar el recurso inexistente.
* Motivo: completar entrega responsive real y conservar una prueba determinista del fallback cuando el navegador elige candidatos de srcset.
* Relacion: completa TASK-018 y TASK-056 sobre la optimizacion WebP previa.
* Resultado: ⚠️ parcial; 30 pruebas correctas, pendiente de repetir Chrome tras ajustar el escenario de fallo.

## [2026-07-20]

* Archivo: ecosistema-soluciones/ecosistema.js, ecosistema-soluciones/index.html, ecosistema-soluciones/ecosistema.css, tests/browser_validation.py
* Cambio: se completaron contratos visuales de loading/error/reintento para galeria y detalle, activacion por Espacio, transicion de categoria, capturas completas, conexion lenta y escenario desde home.
* Motivo: cubrir estados e interacciones locales que aun no tenian evidencia directa en TASK-028, TASK-031, TASK-036, TASK-050, TASK-057, TASK-059, TASK-061 y TASK-062.
* Relacion: ampliacion incremental de la interfaz existente, sin agregar dependencias.
* Resultado: ⚠️ parcial; implementado y pendiente de ejecutar la suite ampliada.

## [2026-07-20]

* Archivo: tests/static-audit.test.mjs, package.json, audits/2026-07-20
* Cambio: se agrego auditoria automatizada de metadata/canonical/H1, enlaces y fragmentos, sitemap/robots, Open Graph/JSON-LD, WebP/dimensiones/lazy loading, contraste y semantica de formularios; se repitio Chrome despues de corregir anclas.
* Motivo: cerrar validaciones SEO, activos, accesibilidad y enlaces con evidencia reproducible.
* Relacion: valida TASK-049, TASK-051, TASK-052, TASK-056 y TASK-066.
* Resultado: ✅ 30 pruebas correctas y 31 comprobaciones Chrome correctas; LCP 1080 ms, CLS 0.0023, INP 32 ms y consola limpia.

## [2026-07-20]

* Archivo: scripts/render-ecosystem.mjs, ecosistema-soluciones/ecosistema.css, ecosistema-soluciones/index.html
* Cambio: se agregaron destinos de ancla generados para las cuatro categorias y se ocultan solo con mejora JavaScript activa.
* Motivo: la auditoria estatica encontro que los hashes funcionaban por script pero no tenian destino real en el fallback sin JavaScript.
* Relacion: correccion de TASK-011, TASK-027, TASK-029 y TASK-052 descubierta durante TASK-066.
* Resultado: ⚠️ parcial; correccion implementada y pendiente de regenerar/validar.

## [2026-07-20]

* Archivo: scripts/render-ecosystem.mjs, ecosistema-soluciones/content.js, ecosistema-soluciones/index.html, OPERATIONS.md, package.json
* Cambio: se agrego generacion estatica indexable desde la fuente validada, orden por categoria/nicho, operaciones editoriales, checklist de despliegue y rollback; se regeneraron ocho nichos permitidos y se excluyo el registro oculto incompleto.
* Motivo: permitir agregar, editar, ocultar, publicar y reordenar contenido sin CMS ni redisenar la pagina, manteniendo fallback sin JavaScript.
* Relacion: completa localmente TASK-006, TASK-009, TASK-012 a TASK-014 y prepara TASK-066 a TASK-068.
* Resultado: ✅ contenido sincronizado; 23 pruebas y 31 comprobaciones de navegador correctas tras regenerar.

## [2026-07-20]

* Archivo: tests/browser_validation.py, audits/2026-07-20/browser-validation.json, audits/2026-07-20/ecosystem-*.png
* Cambio: se creo y ejecuto una auditoria local con Chrome headless/CDP para carga directa, integracion, headings, categorias, filtros, historial, teclado, foco, touch, detalle, imagen fallida, cotizacion, eventos, reduced motion, cinco viewports, zoom, overflow, consola, no-JS y metricas.
* Motivo: completar la validacion de navegador pese a que Chrome DevTools MCP no esta registrado en la sesion.
* Relacion: fallback local autorizado para TASK-044 a TASK-050, TASK-057 y TASK-061 a TASK-066; no sustituye una inspeccion MCP futura.
* Resultado: ✅ 31 comprobaciones correctas; consola 0 errores relevantes, CLS 0.0023, LCP observado 1112 ms e INP observado 24 ms; cinco capturas revisadas.

## [2026-07-20]

* Archivo: ecosistema-soluciones/content.js, ecosistema-soluciones/analytics.js, ecosistema-soluciones/quote-channel.js y referencias
* Cambio: se renombraron los modulos `.mjs` a `.js` y se actualizaron imports, pruebas y validacion de sintaxis.
* Motivo: Chrome rechazo la primera carga local porque el servidor estatico entregaba `.mjs` como `text/plain`; `.js` se entrega como `application/javascript` sin cambiar el contrato.
* Relacion: correccion descubierta al ejecutar TASK-061 y TASK-066 sobre la integracion modular previa.
* Resultado: ✅ incompatibilidad MIME corregida; pendiente de repetir navegador.

## [2026-07-20]

* Archivo: tests/content.test.mjs, tests/analytics.test.mjs, tests/quote-channel.test.mjs, tests/ecosistema.test.mjs
* Cambio: se agregaron pruebas de operaciones editoriales, exclusion/orden, etiquetas conceptuales, nombres/payload/antiduplicacion, contexto y cuatro estados de cotizacion; se amplio la prueba estructural de integracion.
* Motivo: aportar evidencia automatizada para cada comportamiento nuevo y para los defaults reversibles solicitados.
* Relacion: valida TASK-009, TASK-012 a TASK-014, TASK-038 a TASK-040, TASK-054, TASK-055, TASK-058 a TASK-060.
* Resultado: ✅ 23 pruebas correctas, 0 fallos; sintaxis de cuatro modulos correcta.

## [2026-07-20]

* Archivo: package.json
* Cambio: se declaro el proyecto estatico como ES modules y se agregaron comandos sin dependencias para sintaxis, pruebas y validacion.
* Motivo: hacer reproducible el runner local; el intento con glob directo fallo porque PowerShell no lo expandio y Node interpreto ecosistema.js como CommonJS.
* Relacion: corrige la ejecucion de TASK-008 y TASK-066 sin introducir un framework ni un pipeline inventado.
* Resultado: ✅ configuración creada; pendiente de repetir la suite.

## [2026-07-20]

* Archivo: ecosistema-soluciones/ecosistema.js, ecosistema-soluciones/index.html
* Cambio: se integraron contenido publicado/ordenado, historial de categorias, contexto completo de cotizacion, limite de adjunto y los estados reales del canal; el script ahora consume modulos ES locales.
* Motivo: completar el contrato de interfaz y navegacion sin reescribir el HTML legible ni fingir una respuesta del servidor.
* Relacion: consume los adaptadores creados en el grupo anterior y mejora TASK-029, TASK-030, TASK-036, TASK-038, TASK-039, TASK-040, TASK-054 y TASK-055.
* Resultado: ⚠️ parcial; integrado y pendiente de pruebas automatizadas y navegador local.

## [2026-07-20]

* Archivo: ecosistema-soluciones/content.mjs, ecosistema-soluciones/analytics.mjs, ecosistema-soluciones/quote-channel.mjs
* Cambio: se agregaron contratos locales aislados para contenido estatico validado, nueve eventos de analitica independientes de proveedor y cotizacion configurable con estados unavailable/loading/error/success.
* Motivo: convertir los bloqueos externos anteriores en implementacion local reversible, sin CMS, sin datos personales en analitica y sin simular envios exitosos.
* Relacion: mejora TASK-002 a TASK-010 y habilita TASK-012 a TASK-014, TASK-038, TASK-039, TASK-054 y TASK-055 sin repetir la interfaz ya implementada.
* Resultado: ⚠️ parcial; contratos creados, pendientes de integracion con la pagina y pruebas automatizadas.

## [2026-07-17]

* Archivo: ecosistema-soluciones/ecosistema.js, tests/ecosistema.test.mjs, tasks.md, assets
* Cambio: verificacion final local de sintaxis, siete pruebas, activos, metadata, sitemap y estado de casillas.
* Motivo: cerrar la iteracion con evidencia reproducible y separar tareas completas de pendientes.
* Relacion: Definition of Done parcial; el canal, aprobaciones, analitica, administracion, staging y produccion siguen bloqueados.
* Resultado: 7 pruebas correctas, sintaxis JavaScript correcta, H1=1, canonical=1, sin CDN OpenArt/Tailwind, 56 casillas verificadas y 461 pendientes.

## [2026-07-17]

* Archivo: tasks.md
* Cambio: se agrego el estado de ejecucion con tareas completadas y bloqueadores externos reales.
* Motivo: distinguir la implementacion local validada de las condiciones que impiden publicar.
* Relacion: refleja la validacion de TASK-001, TASK-011, TASK-017, TASK-025, TASK-026, TASK-032 y TASK-033 y mantiene pendientes las tareas dependientes de decisiones externas.
* Resultado: correcto; Definition of Done global no alcanzada por bloqueadores documentados.

## [2026-07-17]

* Archivo: tasks.md
* Cambio: se marcaron como completadas las casillas verificadas de TASK-001, TASK-011, TASK-017, TASK-025, TASK-026, TASK-032 y TASK-033.
* Motivo: reflejar en el plan la evidencia de convenciones, degradacion progresiva, recursos locales, mapa, tarjetas e imagenes.
* Relacion: validacion local, pruebas estructurales y auditorias DevTools previas a la perdida de conexion MCP.
* Resultado: correcto; las tareas con decisiones externas permanecen pendientes.

## [2026-07-17]

* Archivo: tests/ecosistema.test.mjs
* Cambio: se ejecutaron las pruebas estructurales ampliadas.
* Motivo: verificar la ruta, contenido, eventos, recursos locales y estados base despues de la integracion.
* Relacion: valida TASK-020, TASK-023, TASK-029, TASK-033 y TASK-047.
* Resultado: 7 pruebas correctas, 0 fallos.

## [2026-07-17]

* Archivo: tests/ecosistema.test.mjs
* Cambio: se agregaron pruebas estructurales para recursos locales, ausencia de CDN Tailwind, menu movil oculto y semantica de enlaces del mapa.
* Motivo: conservar regresiones reproducibles despues de las correcciones visuales y de rendimiento.
* Relacion: valida TASK-017, TASK-018, TASK-025 y TASK-027.
* Resultado: pendiente de ejecutar.

## [2026-07-17]

* Archivo: ecosistema-soluciones/index.html
* Cambio: se sustituyeron las cuatro URLs CDN por entregables WebP locales con dimensiones declaradas.
* Motivo: servir recursos optimizados desde el proyecto y evitar dependencia externa durante la navegacion.
* Relacion: completa TASK-017 y TASK-018; conserva RF-008 y RN-002 mediante la etiqueta conceptual.
* Resultado: correcto; pendiente de validar carga local y Lighthouse.

## [2026-07-17]

* Archivo: assets/openart-originals/concept-restaurante.png, assets/openart-originals/concept-taller.png, assets/openart-originals/concept-evento.png, assets/openart-originals/concept-arquitectura.png
* Cambio: se conservaron los cuatro originales recuperados desde las solicitudes CDN de OpenArt en una carpeta separada.
* Motivo: mantener procedencia y permitir regenerar las versiones de entrega sin publicar originales pesados.
* Relacion: implementa TASK-015, TASK-016 y TASK-017.
* Resultado: correcto; siguen siendo candidatos conceptuales pendientes de aprobacion humana.

## [2026-07-17]

* Archivo: assets/concept-restaurante.webp, assets/concept-taller.webp, assets/concept-evento.webp, assets/concept-arquitectura.webp
* Cambio: se generaron versiones WebP locales de 960x720 con pesos entre 24 y 38 KB.
* Motivo: cumplir el objetivo de optimizacion de imagenes y evitar dependencia de recursos temporales externos.
* Relacion: implementa TASK-018.
* Resultado: correcto; pendiente de sustituir referencias HTML y validar visualmente.

## [2026-07-17]

* Archivo: ecosistema-soluciones/index.html
* Cambio: se retiro el role=list del contenedor del mapa para que sus enlaces mantengan semantica nativa sin hijos ARIA incompatibles.
* Motivo: corregir el fallo aria-required-children detectado por Lighthouse.
* Relacion: mejora TASK-025, TASK-047 y TASK-050.
* Resultado: pendiente de nueva auditoria.

## [2026-07-17]

* Archivo: ecosistema-soluciones/ecosistema.css
* Cambio: se forzo display none para el menu movil cuando conserva el atributo hidden.
* Motivo: evitar que el menu aparezca abierto por defecto en escritorio y movil.
* Relacion: correccion de TASK-027, TASK-045 y TASK-050.
* Resultado: pendiente de validacion del toggle.

## [2026-07-17]

* Archivo: ecosistema-soluciones/ecosistema.css
* Cambio: se incluyo box-sizing border-box en los botones primario y secundario.
* Motivo: evitar que el padding convierta los CTAs de movil en elementos de 400px dentro de un contenedor de 358px.
* Relacion: correccion visual de RR-003, RR-005 y TASK-046.
* Resultado: pendiente de nueva medicion.

## [2026-07-17]

* Archivo: ecosistema-soluciones/ecosistema.css
* Cambio: se aplico box-sizing border-box a las tarjetas del mapa y al formulario y sus campos.
* Motivo: evitar que padding y ancho al 100 por ciento provoquen overflow horizontal en movil.
* Relacion: correccion posterior a la prueba de TASK-046.
* Resultado: pendiente de nueva medicion.

## [2026-07-17]

* Archivo: ecosistema-soluciones/ecosistema.css
* Cambio: se elimino el margen por defecto del body dentro del scope de la pagina del ecosistema.
* Motivo: corregir overflow horizontal provocado por la combinacion del margen global y el header fijo.
* Relacion: mejora RR-003, RR-005 y TASK-046.
* Resultado: correcto; pendiente de nueva medicion movil.

## [2026-07-17]

* Archivo: ecosistema-soluciones/index.html
* Cambio: se elimino la carga de Tailwind CDN en esta ruta y se retiro role=listitem de los enlaces del mapa.
* Motivo: eliminar la advertencia de consola y conservar semantica de enlace y navegacion con teclado.
* Relacion: mejora TASK-020, TASK-027, TASK-047 y TASK-050.
* Resultado: correcto; pendiente de validacion en navegador.

## [2026-07-17]

* Archivo: ecosistema-soluciones/ecosistema.js
* Cambio: se agrego un resolvedor de nombres de categoria que anuncia unicamente el nombre, no el indice y la descripcion completa.
* Motivo: corregir el feedback accesible y el payload de contexto.
* Relacion: mejora TASK-029, TASK-048 y TASK-055.
* Resultado: correcto; pendiente de validacion en navegador.

## [2026-07-17]

* Archivo: ecosistema-soluciones/index.html
* Cambio: se explicito que los ejemplos son puntos de partida para soluciones personalizadas.
* Motivo: alinear el copy con RF-007 y la validacion automatizada.
* Relacion: continua la redaccion editorial de TASK-023 y TASK-063.
* Resultado: correcto; pendiente de prueba completa.

## [2026-07-17]

* Archivo: ecosistema-soluciones/ecosistema.css
* Cambio: la navegacion movil de categorias ahora se refluye en una cuadricula de dos columnas en lugar de exigir desplazamiento horizontal.
* Motivo: cumplir RR-003 y RR-004 sin degradar el acceso tactil.
* Relacion: mejora TASK-027 y TASK-045.
* Resultado: correcto; pendiente de validacion responsive.

## [2026-07-17]

* Archivo: ecosistema-soluciones/index.html
* Cambio: se separaron los controles de categoria mediante data-category-control para no mezclar mapa, navegacion y tarjetas en la misma seleccion.
* Motivo: corregir la vinculacion de eventos y el filtrado de categorias.
* Relacion: mejora de TASK-025, TASK-029 y TASK-030.
* Resultado: correcto; pendiente de validacion en navegador.

## [2026-07-17]

* Archivo: ecosistema-soluciones/ecosistema.js
* Cambio: se limitaron los controles de categoria, se agrego sincronizacion por hash y se dejo declarado el evento de completado sin emitirlo mientras el canal no este configurado.
* Motivo: corregir interacciones y evitar un falso evento de cotizacion completada.
* Relacion: mejora de TASK-029, TASK-038, TASK-039 y TASK-055.
* Resultado: correcto; pendiente de validacion en navegador.

## [2026-07-17]

* Archivo: tests/ecosistema.test.mjs
* Cambio: se corrigio la expectativa UTF-8 de la categoria de diseno y el selector de aplicaciones de cada tarjeta.
* Motivo: eliminar falsos negativos de la prueba estructural.
* Relacion: valida RF-002 y RF-004.
* Resultado: correcto; pendiente de ejecutar nuevamente.

## [2026-07-17]

* Archivo: ecosistema-soluciones/index.html, ecosistema-soluciones/ecosistema.css, ecosistema-soluciones/ecosistema.js, tests/ecosistema.test.mjs, index.html, sitemap.xml
* Cambio: se implemento la primera version funcional de la ruta de soluciones por nicho, sus estilos, interacciones, formulario contextual, prueba estructural, enlace interno y sitemap
* Motivo: ejecutar las fases de estructura, exploracion, nichos, detalle, orientacion, SEO y fallback de cotizacion del plan tasks.md
* Relacion: implementa las decisiones de requirements.md y design.md; el canal externo y aprobacion comercial permanecen pendientes
* Resultado: implementacion creada; pruebas iniciales en rojo antes de la ruta y pendiente de validacion posterior

## [2026-07-17]

* Archivo: tasks.md
* Cambio: se corrigio el cierre Markdown del campo Paralelizable en TASK-007 a TASK-070
* Motivo: la verificacion detecto que la etiqueta no tenia los asteriscos de cierre requeridos
* Relacion: ajuste de formato posterior a la normalizacion del valor Sí
* Resultado: corregido correctamente

## [2026-07-17]

* Archivo: tasks.md
* Cambio: se normalizo la escritura del valor afirmativo del campo Paralelizable a Sí
* Motivo: alinear el formato con la especificacion solicitada y conservar caracteres UTF-8 correctos
* Relacion: ajuste de formato posterior a la correccion de campos obligatorios
* Resultado: corregido correctamente

## [2026-07-17]

* Archivo: tasks.md
* Cambio: se corrigio el campo Paralelizable en las tareas TASK-007 a TASK-070
* Motivo: la verificacion estructural detecto que esas tareas no cumplian el formato obligatorio por tarea
* Relacion: correccion posterior a la validacion inicial de tasks.md
* Resultado: corregido correctamente; todas las tareas contienen el campo requerido

## [2026-07-17]

* Archivo: tasks.md
* Cambio: se creo el plan formal de implementacion para la funcionalidad "Ecosistema de soluciones por nicho para Lithora 3D"
* Motivo: transformar requirements.md y design.md aprobados en tareas atomicas, trazables, dependientes y verificables
* Relacion: continua el flujo formal requirements.md -> design.md -> tasks.md; no implementa la funcionalidad
* Resultado: creado correctamente; todas las tareas inician en estado Pendiente

## [2026-07-17]

* Archivo: design.md
* Cambio: se corrigieron espacios finales detectados durante la verificacion documental
* Motivo: mantener el archivo Markdown limpio antes de revision y aprobacion
* Relacion: correccion de formato posterior a la verificacion de trazabilidad
* Resultado: creado correctamente

## [2026-07-17]

* Archivo: design.md
* Cambio: se enumeraron explicitamente todos los IDs de requisitos en la matriz de trazabilidad
* Motivo: permitir una verificacion automatica y humana requisito por requisito sin interpretar rangos
* Relacion: refuerza la trazabilidad ya definida en la fase de diseno
* Resultado: creado correctamente

## [2026-07-17]

* Archivo: design.md
* Cambio: se detallaron responsabilidades, contenido de entrada, estados, interacciones, comportamiento responsive y accesibilidad para cada componente conceptual
* Motivo: dejar el documento listo para derivar tareas sin redefinir limites de los componentes
* Relacion: amplifica la seccion de componentes sin cambiar requisitos ni alcance del MVP
* Resultado: creado correctamente

## [2026-07-17]

* Archivo: design.md
* Cambio: se actualizaron los registros de OpenArt con los cuatro recursos conceptuales completados, uno por cada categoria principal
* Motivo: cerrar la muestra visual requerida por la fase de diseno sin presentar los conceptos como proyectos reales
* Relacion: complementa la estrategia visual y las etiquetas de procedencia definidas en design.md
* Resultado: creado correctamente; queda pendiente seleccion visual humana antes de cualquier uso publico

## [2026-07-17]

* Archivo: design.md
* Cambio: se creo la especificacion de diseno para la funcionalidad "Ecosistema de soluciones por nicho para Lithora 3D"
* Motivo: traducir requirements.md en experiencia, sistema visual, responsive, accesibilidad, SEO, analitica y trazabilidad antes de definir tareas
* Relacion: continua el flujo formal posterior a requirements.md; no implementa componentes ni modifica la web publicada
* Resultado: creado correctamente; incluye muestras conceptuales OpenArt y decisiones pendientes de aprobacion

## [2026-07-17]

* Archivo: requirements.md
* Cambio: se creo la especificacion formal de requerimientos para la funcionalidad "Ecosistema de soluciones por nicho para Lithora 3D"
* Motivo: establecer una base verificable de alcance, contenido, experiencia, accesibilidad, SEO, analitica, administracion y reglas de negocio antes de pasar a diseno
* Relacion: documenta una nueva seccion de producto que complementa la arquitectura comercial y SEO existente
* Resultado: creado correctamente

## [2026-07-17]

* Archivo: inicialización
* Cambio: creación de changes.md
* Motivo: no existía archivo de historial
* Resultado: ✅ creado correctamente

## [2026-07-17]

* Archivo: index.html
* Cambio: se añadieron metadatos SEO base, canonical, robots, Open Graph, Twitter Cards y schema JSON-LD para la home
* Motivo: la página publicada no tenía señales técnicas suficientes para mejorar indexación, snippets ni resultados enriquecidos
* Relación: primer ajuste SEO después de la inicialización del historial
* Resultado: ✅ éxito

## [2026-07-22]

* Archivo: tests/home-quote.test.mjs
* Cambio: reemplazo del contrato del callback declarativo por aserciones de origen Tally, ventana exacta del iframe, evento `FormSubmitted`, ID del formulario y listener real.
* Motivo: convertir el fallo end-to-end detectado en una regresión automatizada permanente.
* Relación: valida la corrección aplicada a `quote-success.js` y exige ausencia del atributo descartado.
* Resultado: ✅ prueba alineada con el mecanismo comprobado.

## [2026-07-22]

* Archivo: assets/quote-success.js
* Cambio: recepción directa de `Tally.FormSubmitted` por `postMessage`, validando `event.origin`, `event.source`, JSON y `formId`; listeners agrupados en un `AbortController` de ciclo de vida.
* Motivo: usar el mensaje real que el SDK recibe del iframe después de la confirmación del servidor y corregir el callback declarativo inefectivo.
* Relación: mantiene la misma máquina de estados y añade limpieza explícita sin romper restauración BFCache.
* Resultado: ✅ contrato real del embed estándar implementado con validación estricta.

## [2026-07-22]

* Archivo: cotizar/index.html
* Cambio: retiro de `data-tally-on-submit`, que Tally ignoró en el embed estándar durante la prueba real.
* Motivo: eliminar un contrato declarativo inefectivo antes de sustituirlo por el evento real del iframe.
* Relación: responde al fallo end-to-end documentado inmediatamente antes; se conserva `formEventsForwarding=1`.
* Resultado: ✅ atributo inoperante retirado.

## [2026-07-22]

* Archivo: validación real de `data-tally-on-submit` en `http://127.0.0.1:8000/cotizar/`
* Cambio: envío QA válido mediante doble clic y red Slow 3G; Tally confirmó el servidor y mostró su página de agradecimiento, pero el callback declarativo permaneció en estado `ready`.
* Motivo: comprobar el contrato con un envío real antes de desplegar.
* Relación: corrige la suposición derivada del generador de embeds; el SDK inspeccionado sí escucha `Tally.FormSubmitted`, pero asocia `onSubmit` a configuraciones registradas y no a este iframe estándar.
* Resultado: ❌ `data-tally-on-submit` descartado para esta arquitectura; se reemplazará por `postMessage` validado.

## [2026-07-22]

* Archivo: assets/quote-success.js
* Cambio: origen radial recalibrado a 94 px desde el borde izquierdo y 38 px desde el borde inferior del iframe.
* Motivo: la primera captura DevTools mostró que la semilla quedaba por encima y ligeramente a la derecha del centro real del botón Tally.
* Relación: perfecciona la continuidad espacial de la fase `button-confirmation` sin tocar el formulario externo.
* Resultado: ✅ origen alineado con el botón observado a 1440 × 1000.

## [2026-07-22]

* Archivo: package.json
* Cambio: `quote-success.js` y `quote-handoff.js` agregados a la comprobación sintáctica obligatoria.
* Motivo: integrar ambos controladores al mismo control de calidad que el resto de scripts del sitio.
* Relación: completa la primera implementación del flujo posterior al envío.
* Resultado: ✅ validación ampliada; ejecución pendiente.

## [2026-07-22]

* Archivo: tests/home-quote.test.mjs
* Cambio: contratos de regresión para éxito exclusivo de Tally, redacción exacta, ocho estados, desduplicación, animaciones por finalización, abortos, áreas seguras, cobertura dinámica, movimiento reducido, traspaso y BFCache.
* Motivo: impedir que una refactorización futura inicie el verde desde el clic, redirija bruscamente o deje capas persistentes.
* Relación: cubre `cotizar/index.html`, `quote-success.js`, `quote-handoff.js` y ambos estilos.
* Resultado: ✅ cobertura estática ampliada; ejecución pendiente.

## [2026-07-22]

* Archivo: assets/styles.css
* Cambio: capa de continuidad verde para la portada con primer paint cubierto, revelado de 780 ms y variante reducida de 240 ms.
* Motivo: mantener el mismo color entre documentos mientras la portada aparece debajo, sin flash blanco, scroll ni interacción prematura.
* Relación: presenta el estado marcado en `index.html` y limpiado por `quote-handoff.js`.
* Resultado: ✅ transición de llegada integrada al sistema visual existente.

## [2026-07-22]

* Archivo: assets/quote-handoff.js
* Cambio: controlador de llegada a inicio que espera contenido listo con límite seguro, fija scroll en cero, revela la portada bajo la capa verde y limpia sesión, listeners, temporizador y bloqueo.
* Motivo: completar la navegación entre documentos sin depender de View Transitions ni dejar una capa invisible bloqueando la página.
* Relación: mejora la transición propia elegida tras el fallo documentado de View Transitions con el iframe Tally.
* Resultado: ✅ traspaso y limpieza BFCache implementados.

## [2026-07-22]

* Archivo: index.html
* Cambio: marcador síncrono de traspaso por sesión, capa verde de primer render, controlador diferido y versionado de estilos en la portada.
* Motivo: preparar la pantalla de inicio debajo del verde antes de revelarla y evitar cualquier destello blanco o repetición tras recargar.
* Relación: recibe la navegación `location.replace('/')` iniciada por `quote-success.js` sin reactivar la transición al usar Atrás.
* Resultado: ✅ destino de navegación preparado antes del primer paint.

## [2026-07-22]

* Archivo: assets/quote-page.css
* Cambio: sistema visual completo de éxito con semilla alineada al botón, verde Lithora sobrio, capa radial de alto rendimiento, emblema trazado, jerarquía tipográfica, bloqueo sin rebote, viewport dinámico, áreas seguras y composición móvil específica.
* Motivo: convertir la confirmación en una experiencia continua, premium y estable sin animar dimensiones ni provocar scroll o relayout.
* Relación: presenta los estados y elementos controlados por `assets/quote-success.js`.
* Resultado: ✅ estilos responsive y accesibles incorporados.

## [2026-07-22]

* Archivo: cotizar/index.html
* Cambio: el contenido vivo de confirmación queda oculto por separado a tecnologías de asistencia hasta que la expansión verde termina.
* Motivo: sincronizar el anuncio accesible con la aparición real de la pantalla de éxito, sin anticiparlo durante la palomita inicial.
* Relación: refina la estructura accesible agregada para `quote-success.js`.
* Resultado: ✅ anuncio diferido correctamente.

## [2026-07-22]

* Archivo: assets/quote-success.js
* Cambio: máquina de estados completa para confirmación real, bloqueo accesible del fondo, foco, cierre del teclado, palomitas dibujadas, expansión radial calculada contra la esquina más lejana, adaptación a orientación y viewport dinámico, permanencia legible, salida, traspaso por sesión y limpieza por aborto/BFCache.
* Motivo: producir una secuencia premium controlada por la finalización real de Web Animations y no por una cadena frágil de temporizadores.
* Relación: consume exclusivamente el callback confirmado de Tally agregado en `cotizar/index.html`; los estados nativos de carga/error permanecen dentro del iframe.
* Resultado: ✅ controlador implementado con desduplicación, reducción de movimiento y navegación mediante `location.replace`.

## [2026-07-22]

* Archivo: cotizar/index.html
* Cambio: integración del callback oficial `data-tally-on-submit`, reenvío de eventos confirmado por Tally, precarga de la portada y estructura accesible completa para confirmación desde el botón, expansión radial y pantalla de éxito.
* Motivo: iniciar la experiencia únicamente después de `Tally.FormSubmitted` y disponer de una composición estable sin alterar los campos ni la conexión con Google Sheets.
* Relación: conserva el iframe Tally `ODeE7a` validado y extiende la pantalla de cotización publicada en `b1d21b5`.
* Resultado: ✅ contrato de éxito y estructura visual incorporados; controlador y estilos pendientes.

## [2026-07-22]

* Archivo: cotizar/index.html
* Cambio: restauración local del bloque de video tras detectar que un guardado posterior al despliegue había repuesto el markup obsoleto de la animación CSS.
* Motivo: mantener el archivo de trabajo sincronizado con el commit publicado `b1d21b5` y con la solicitud aprobada.
* Relación: protección posterior a la sustitución de `printer-scene` por `quote-process-video`.
* Resultado: ✅ archivo local nuevamente idéntico a producción

## [2026-07-17]

* Archivo: index.html
* Cambio: se actualizó la navegación principal con la marca Lithora 3D y enlaces internos hacia nuevas landings comerciales
* Motivo: la home necesitaba consistencia de marca y mejor enlazado interno para distribuir relevancia SEO
* Relación: amplía la base técnica añadida en el ajuste anterior
* Resultado: ✅ éxito

## [2026-07-17]

* Archivo: index.html
* Cambio: se corrigió la marca visible a Lithora 3D en hero, sección sobre nosotros y footer, y se reescribió el hero con copy comercial orientado a búsqueda
* Motivo: la home estaba desalineada con la marca publicada y el H1 no atacaba intención comercial real
* Relación: continúa la normalización SEO y de branding iniciada en la navegación
* Resultado: ✅ éxito

## [2026-07-17]

* Archivo: index.html
* Cambio: se añadieron un hub de landings por intención y una sección de precios/tiempos enlazada a la futura landing BOFU
* Motivo: la home necesitaba dejar de competir solo con branding y empezar a distribuir relevancia hacia búsquedas comerciales concretas
* Relación: complementa el nuevo enlazado interno y la reescritura del hero
* Resultado: ✅ éxito

## [2026-07-17]

* Archivo: servicio-impresion-3d/index.html
* Cambio: se creó la landing comercial principal para la keyword "servicio de impresión 3D" con metadata, schema, FAQ y CTAs
* Motivo: la arquitectura anterior no tenía una página dedicada para la intención comercial principal del negocio
* Relación: primera landing hija enlazada desde la home-hub
* Resultado: ✅ éxito

## [2026-07-17]

* Archivo: precios-impresion-3d/index.html
* Cambio: se creó la landing BOFU de precios con factores de cotización, escenarios de uso y FAQ
* Motivo: la investigación SERP mostró que "precio" es una intención central en este nicho y la web no la cubría con una página propia
* Relación: segunda landing hija enlazada desde home y servicio principal
* Resultado: ✅ éxito

## [2026-07-17]

* Archivo: prototipado-rapido/index.html
* Cambio: se creó la landing de prototipado rápido orientada a validación de producto, iteración y pruebas funcionales
* Motivo: el keyword "prototipado rápido" apareció como una intención prioritaria en la investigación competitiva y necesitaba una página dedicada
* Relación: tercera landing hija conectada con servicio, precios y materiales
* Resultado: ✅ éxito

## [2026-07-17]

* Archivo: materiales-impresion-3d/index.html
* Cambio: se creó la landing de materiales con comparativa de PLA, PETG, ASA, TPU, Nylon y compuestos
* Motivo: la elección de material es una duda recurrente en SERP y una intención relevante para captar tráfico calificado
* Relación: cuarta landing hija conectada con home, servicio, precios y prototipado
* Resultado: ✅ éxito

## [2026-07-17]

* Archivo: favicon.svg, assets/og-card.svg, robots.txt, sitemap.xml
* Cambio: se añadieron activos de compartición, rastreo e identidad visual para buscadores y redes
* Motivo: la web necesitaba favicon, imagen Open Graph y archivos base de descubrimiento para indexación correcta
* Relación: completa la capa técnica que acompaña la nueva arquitectura SEO
* Resultado: ✅ éxito
## [2026-07-20]

* Archivo: `specs/motion-refresh/requirements.md`
* Cambio: definición trazable del alcance, principios y requisitos globales, por página, responsive, accesibilidad y rendimiento para el refresh de movimiento.
* Motivo: establecer la primera fase obligatoria antes de diseñar o modificar código, sin añadir contenido comercial.
* Relación: continúa sobre las cuatro rutas ya implementadas y preserva la home y el ecosistema funcional existentes.
* Resultado: ✅ requerimientos creados con criterios Given/When/Then.
## [2026-07-20]

* Archivo: `specs/motion-refresh/design.md`
* Cambio: diseño del sistema “Ingeniería editorial en movimiento”, con auditoría confirmada, tokens, coreografía, microinteracciones, tablas por página, responsive, reduced motion, rendimiento, arquitectura y trazabilidad.
* Motivo: convertir los requerimientos aprobables en decisiones visuales ejecutables antes de tocar el código de producción.
* Relación: evita cargar GSAP de la home en las cuatro rutas y propone Web Animations + CSS aislados por página.
* Resultado: ✅ diseño completo y listo para descomposición en tareas.
## [2026-07-20]

* Archivo: `specs/motion-refresh/tasks.md`
* Cambio: conversión del diseño en diez tareas ejecutables agrupadas en auditoría, sistema global, cuatro páginas, detalle de Soluciones, pruebas y validación final.
* Motivo: cerrar la tercera fase obligatoria con dependencias, requisitos, archivos, pasos, validación y Definition of Done trazables.
* Relación: TASK-MOTION-001 registra la auditoría ya ejecutada; el resto queda listo para implementación inmediata.
* Resultado: ✅ plan de ejecución creado sin modificar todavía código de producción.
## [2026-07-20]

* Archivo: `assets/motion-pages.css`, `assets/motion-pages.js`
* Cambio: creación del sistema compartido y aislado de motion con tokens, composiciones por ruta, microinteracciones, IntersectionObserver agrupado, Web Animations, reduced motion, touch, resize/orientación, pausa de pestaña, limpieza y diagnóstico.
* Motivo: activar movimiento con propósito en las cuatro páginas sin cargar otra librería ni reutilizar selectores globales de la home.
* Relación: implementa TASK-MOTION-002/003 y conserva contenido visible por defecto si JavaScript o Web Animations fallan.
* Resultado: ✅ motor progresivo creado; pendiente conectar rutas y validar en navegador.
## [2026-07-20]

* Archivo: `precios-impresion-3d/index.html`, `prototipado-rapido/index.html`, `materiales-impresion-3d/index.html`, `ecosistema-soluciones/index.html`, `ecosistema-soluciones/ecosistema.js`
* Cambio: conexión de las cuatro rutas al sistema por `data-motion-page`; Soluciones ahora emite eventos únicos de categoría/detalle, calcula el origen visual y anima el cierre antes de restaurar foco.
* Motivo: aplicar identidades específicas sin modificar textos, enlaces o contenido y evitar la doble animación que existía en el módulo de Soluciones.
* Relación: implementa TASK-MOTION-004 a TASK-MOTION-008 sobre la funcionalidad de hash, historial, detalle y cotización existente.
* Resultado: ✅ integración completada; pendiente pruebas y ajustes visuales.
## [2026-07-20]

* Archivo: `tests/motion-refresh.test.mjs`, `package.json`
* Cambio: cobertura automatizada para alcance de rutas, aislamiento de home, tokens/identidades, no-JS, reduced motion, ciclo de vida, propiedades permitidas, eventos de Soluciones y presupuesto; el chequeo sintáctico incluye el motor nuevo.
* Motivo: validar cada conducta añadida y evitar regresiones o motion oculto/permanente.
* Relación: implementa TASK-MOTION-009 y el presupuesto definido en `specs/motion-refresh/design.md`.
* Resultado: ✅ pruebas creadas; pendiente ejecutar y corregir resultados.
## [2026-07-20]

* Archivo: `assets/motion-pages.js`
* Cambio: las animaciones WAAPI ya no retienen efectos terminados mediante `fill: both`; al finalizar vuelven al estado CSS final natural.
* Motivo: la primera inspección de navegador mostró animaciones terminadas todavía presentes en `document.getAnimations()`, innecesarias para el resultado visual y la memoria.
* Relación: mejora el ciclo de vida de TASK-MOTION-003 sin cambiar la coreografía.
* Resultado: ✅ efecto final idéntico con liberación automática de animaciones terminadas.
## [2026-07-20]

* Archivo: `assets/motion-pages.css`
* Cambio: el conector de beneficios de Prototipado se dibuja detrás del grupo completo y se elimina en móvil/touch.
* Motivo: la revisión visual detectó que el conector por tarjeta quedaba recortado por la superficie de cada tarjeta.
* Relación: corrección visual de TASK-MOTION-005 basada en la captura desktop after.
* Resultado: ✅ continuidad visible en escritorio sin riesgo de cruzar contenido móvil.
## [2026-07-20]

* Archivo: `assets/motion-pages.css`
* Cambio: en pantallas menores a 360 px, las imágenes de nicho de Soluciones conservan su relación 4:3 sin el `min-height` desktop.
* Motivo: la matriz responsive de DevTools detectó 10 px de contenido recortado a 320 px aunque el documento ocultaba el overflow.
* Relación: corrección de TASK-MOTION-007/010; no modifica la imagen ni su `object-fit`.
* Resultado: ✅ la tarjeta y la imagen caben en 320 px sin deformación ni recorte lateral.
## [2026-07-20]

* Archivo: `assets/motion-pages.css`
* Cambio: el enlace directo a WhatsApp usa azul claro sobre el formulario oscuro.
* Motivo: Lighthouse detectó contraste 2.68:1 con el azul original `#0369a1` sobre `#172236`.
* Relación: corrección de accesibilidad de TASK-MOTION-010; no cambia texto ni destino del CTA.
* Resultado: ✅ color ajustado a un par de alto contraste; pendiente reauditoría.
## [2026-07-20]

* Archivo: `assets/motion-pages.js`
* Cambio: la densidad responsive se calcula con `matchMedia('(max-width: 767px)')` en lugar de leer `innerWidth` dentro de `requestAnimationFrame`.
* Motivo: el trace de Soluciones atribuyó 88 ms de forced reflow a esa lectura de viewport después de la mutación inicial del DOM.
* Relación: optimización de TASK-MOTION-003/010; mantiene resize, orientación y touch con un listener estable.
* Resultado: ✅ eliminada la lectura geométrica que forzaba layout; pendiente trace de confirmación.
## [2026-07-20]

* Archivo: `assets/motion-pages.js`
* Cambio: los presets de distancia y stagger reutilizan la misma consulta de medios responsive y ya no consultan `innerWidth` durante revelados.
* Motivo: prevenir nuevas lecturas síncronas de layout mientras se disparan animaciones.
* Relación: completa la corrección de forced reflow detectada por DevTools.
* Resultado: ✅ cálculo responsive sin lecturas geométricas en el motor compartido.
## [2026-07-20]

* Archivo: `audits/2026-07-20/motion-refresh/`
* Cambio: evidencia antes/después, capturas desktop/mobile y de estados, cuatro auditorías Lighthouse finales, traces de carga/interacción, heap snapshot e informe consolidado.
* Motivo: demostrar visual y cuantitativamente la Definition of Done sin declarar pruebas no ejecutadas.
* Relación: completa la evidencia de TASK-MOTION-010 e incluye las correcciones de overflow, contraste y forced reflow descubiertas durante la validación.
* Resultado: ✅ 66/66 pruebas, Lighthouse 100/100/100/100 en las cuatro rutas, CLS 0.00 y sin errores de consola.
## [2026-07-20]

* Archivo: `specs/motion-refresh/tasks.md`
* Cambio: las diez tareas y cada una de sus casillas de pasos/validación se marcaron individualmente como completadas tras reunir evidencia.
* Motivo: reflejar el estado real final, incluyendo correcciones responsive, contraste, rendimiento, pruebas y regresiones.
* Relación: resultados consolidados en `audits/2026-07-20/motion-refresh/report.md`.
* Resultado: ✅ 10/10 tareas completas y 0 casillas locales pendientes.

## [2026-07-20]

* Archivo: `ecosistema-soluciones/ecosistema.js`
* Cambio: integración del controlador premium con el detalle inline, el contexto de cotización y los estados del formulario; el menú móvil incorpora apertura/cierre secuencial, trampa de foco, Escape y restauración del foco sin duplicar animaciones.
* Motivo: completar los contratos SOL-W13, SOL-W20, SOL-W21 y SOL-W22 manteniendo la navegación, accesibilidad y estados honestos del canal de WhatsApp.
* Relación: continúa la fase `premium-widget-motion` sobre la implementación validada de `motion-refresh`.
* Resultado: ✅ integración funcional aplicada; pendiente regeneración y pruebas completas.

## [2026-07-20]

* Archivo: `ecosistema-soluciones/index.html`, `index.html`
* Cambio: regeneración de las vistas derivadas desde la fuente estática de nichos, conservando nueve nichos publicados y propagando los contratos nominales SOL-W10 a SOL-W15 en tarjetas, imágenes, aplicaciones, detalles y controles.
* Motivo: mantener el HTML publicado sincronizado con `scripts/render-ecosystem.mjs` y evitar divergencias entre contenido, home y ecosistema.
* Relación: aplica la integración premium sin alterar la fuente de verdad ni el filtrado editorial existente.
* Resultado: ✅ 9 nichos regenerados correctamente en ecosistema y home.

## [2026-07-20]

* Archivo: `assets/motion-pages.js`, `tests/motion-refresh.test.mjs`, `tests/ecosistema.test.mjs`
* Cambio: se añadió la limpieza responsive para `orientationchange`; las pruebas heredadas ahora aceptan atributos de contrato en contenedores de imagen y validan los tokens y el techo absoluto de 35 KB aprobados para la fase premium.
* Motivo: la primera suite detectó nueve expectativas antiguas que confundían atributos semánticos nuevos con regresiones y confirmó la necesidad de conservar la cobertura explícita de orientación.
* Relación: corrige compatibilidad de pruebas sin relajar contenido, rutas, assets ni comportamiento; el presupuesto cambia de 30 KB histórico a 35 KB aprobado en PWM-PERF-004.
* Resultado: ✅ correcciones aplicadas; pendiente nueva ejecución y cobertura específica premium.

## [2026-07-20]

* Archivo: `tests/premium-widget-motion.test.mjs`
* Cambio: nueva suite de doce pruebas para los 44 IDs, distribución 19/13/10/2, generador dinámico, observer/listeners, presupuestos por timeline, patrones Spotlight/Specular/Glow/Animated/Staggered/Glare/Bento, H1 estable, reduced motion, touch, no-JS, controlador y ausencia de dependencias.
* Motivo: convertir los contratos de `requirements.md` y `design.md` en regresiones automatizadas antes de validar visualmente y desplegar.
* Relación: cubre TASK-PWM-003 a 006A, 046 a 053 y PWM-REF-001 a 008.
* Resultado: ✅ cobertura premium añadida; pendiente ejecución y corrección de hallazgos.

## [2026-07-20]

* Archivo: `assets/motion-pages.css`, `tests/premium-widget-motion.test.mjs`
* Cambio: las capas Spotlight y especular se elevaron sobre el fondo sin cubrir el contenido; la prueba premium se alineó con el generador, selectores y nombres reales y dejó de confundir comentarios documentales o el giro diagonal permitido del reflejo con dependencias/tilt.
* Motivo: la ejecución 74/80 reveló cinco expectativas demasiado literales y una capa con `z-index` negativo que podía quedar oculta por la superficie de la tarjeta.
* Relación: mejora visible de PWM-REF-002/003/004/008 y mantiene la validación estricta de runtime sin dependencias.
* Resultado: ✅ seis hallazgos corregidos; pendiente reejecutar la suite.

## [2026-07-20]

* Archivo: `tests/premium-widget-motion.test.mjs`
* Cambio: las aserciones de foco, CTA, reduced motion, controlador y ScrollTrigger se hicieron semánticas: validan contratos HTML y comportamiento real sin depender de una forma textual única ni confundir el contador `scrollTriggers: 0` con la librería prohibida.
* Motivo: la ejecución focalizada mostró cinco falsos negativos de la nueva prueba, mientras la implementación cumplía las salvaguardas previstas.
* Relación: conserva cobertura de PWM-REF-001–008 y PWM-PERF-001–004 con menor fragilidad.
* Resultado: ✅ prueba corregida sin cambios funcionales adicionales.

## [2026-07-20]

* Archivo: `tests/premium-widget-motion.test.mjs`
* Cambio: corrección final de dos referencias de prueba: el carácter conceptual se verifica en el HTML y la restauración de foco usa el nombre real `menuButton`.
* Motivo: eliminar los dos últimos falsos negativos de la suite focalizada.
* Relación: no cambia producción; valida de forma directa el badge conceptual y el foco del menú móvil.
* Resultado: ✅ suite lista para nueva ejecución.

## [2026-07-20]

* Archivo: validación local completa
* Cambio: ejecución de `npm run validate` después de todas las correcciones premium.
* Motivo: verificar fuente de contenido, sintaxis, regresiones históricas y nuevos contratos antes de la inspección visual.
* Relación: gate automatizado de TASK-PWM-051–053.
* Resultado: ✅ 80/80 pruebas, 0 fallos; 9 nichos publicados y sincronizados; sintaxis JavaScript correcta.

## [2026-07-20]

* Archivo: `scripts/materialize-tailwind.mjs`
* Cambio: utilidad determinista para convertir las hojas Tailwind ya generadas y capturadas con Chrome DevTools en CSS estático local por ruta.
* Motivo: eliminar la advertencia y dependencia runtime de `cdn.tailwindcss.com` sin instalar paquetes, cambiar clases ni alterar el diseño validado.
* Relación: corrección de producción descubierta durante TASK-PWM-050/054; las capturas fuente quedan como evidencia reproducible.
* Resultado: ✅ materializador creado; pendiente generar y conectar las tres hojas locales.

## [2026-07-20]

* Archivo: `assets/tailwind-prices.css`, `assets/tailwind-prototype.css`, `assets/tailwind-materials.css`, `precios-impresion-3d/index.html`, `prototipado-rapido/index.html`, `materiales-impresion-3d/index.html`
* Cambio: materialización de 9,110/8,777/8,870 bytes de CSS crítico por página y reemplazo del script CDN de Tailwind por hojas locales estáticas.
* Motivo: dejar las rutas listas para producción, sin compilación en navegador, sin advertencias de consola y sin una dependencia de red adicional.
* Relación: conserva exactamente las utilidades calculadas por Tailwind 3.4.0 observadas con DevTools, por lo que el cambio es de entrega y no de diseño.
* Resultado: ✅ Tailwind runtime retirado de las tres rutas; pendiente comparación visual y regresión completa.

## [2026-07-20]

* Archivo: `tests/premium-widget-motion.test.mjs`
* Cambio: cobertura de regresión que prohíbe el CDN de Tailwind y exige las tres hojas locales con contenido materializado.
* Motivo: impedir que una edición futura reintroduzca compilación CSS en el navegador o rompa una ruta al omitir su hoja estática.
* Relación: refuerza el hallazgo de consola de TASK-PWM-054.
* Resultado: ✅ guard automático añadido.

## [2026-07-20]

* Archivo: `assets/motion-pages.css`
* Cambio: se retiró `position: relative` del selector global de contratos y se limitó a las primitivas que realmente alojan pseudo-elementos.
* Motivo: Lighthouse descubrió que la regla global anulaba `position: absolute` de SOL-W06, superponiendo los cuatro destinos del mapa y reduciendo su área táctil segura.
* Relación: corrección de layout y accesibilidad para SOL-W05/SOL-W06; respeta la regla de no alterar geometría funcional.
* Resultado: ✅ causa raíz corregida; pendiente reauditoría de targets y comparación visual.

## [2026-07-20]

* Archivo: `tests/premium-widget-motion.test.mjs`
* Cambio: regresión específica que impide volver a imponer posicionamiento global desde `data-motion-widget` y confirma el anclaje absoluto del mapa.
* Motivo: preservar el arreglo de targets superpuestos detectado por Lighthouse.
* Relación: cobertura de SOL-W05/SOL-W06 y PWM-A11Y-004.
* Resultado: ✅ protección automatizada añadida.

## [2026-07-20]

* Archivo: `materiales-impresion-3d/index.html`, `tests/premium-widget-motion.test.mjs`
* Cambio: las seis fichas MAT-W05 aceptan foco programático/teclado y la suite exige esa cobertura completa.
* Motivo: cumplir la equivalencia focus de PWM-MAT-003/PWM-REF-002 sin convertir las fichas en enlaces ni atribuir propiedades de material inexistentes.
* Relación: activa el mismo foco visible, borde y luz fija ya definidos para `:focus-within`.
* Resultado: ✅ exploración por teclado equivalente en las seis superficies.

## [2026-07-20]

* Archivo: `assets/motion-pages.js`, `tests/premium-widget-motion.test.mjs`
* Cambio: `pagehide` distingue navegación definitiva de entrada a bfcache; en bfcache cancela animaciones efímeras pero conserva observer y listeners, mientras la salida real sigue ejecutando cleanup completo.
* Motivo: Chrome DevTools reprodujo una restauración con `cleaned: true`, observer 0 y listeners 0 al volver a Precios, porque el documento persistía con la marca idempotente pero sin motor activo.
* Relación: corrección de TASK-PWM-004/055 y PWM-COMP-004 sin aumentar el límite de diez listeners.
* Resultado: ✅ ciclo de vida bfcache corregido y cubierto; pendiente prueba de ida/vuelta.

## [2026-07-20]

* Archivo: validación Chrome DevTools y `audits/2026-07-20/premium-widget-motion/`
* Cambio: matriz de 20 combinaciones (4 rutas × 320/375/768/1024/1440), capturas desktop/mobile, snapshots accesibles, hover/focus/touch/reduced, detalle/hash/history/bfcache, contexto/WhatsApp, imagen fallida, analítica, Lighthouse y trazas de carga/interacción.
* Motivo: cerrar la validación premium con evidencia de navegador real antes de marcar tareas o desplegar.
* Relación: valida TASK-PWM-042–055; la corrección bfcache se confirmó con observer 1, listeners 10 y `cleaned: false` después de volver.
* Resultado: ✅ 0 overflow en 20/20, H1 único/visible, consolas limpias, Lighthouse 100/100/100/100 desktop en las cuatro rutas, LCP 110–393 ms, CLS 0.00 e INP 34 ms local.

## [2026-07-20]

* Archivo: `audits/2026-07-20/premium-widget-motion/report.md`
* Cambio: informe consolidado con implementación, 44 widgets, siete patrones, correcciones, matriz responsive, funcionalidad de Soluciones, auditorías, Core Web Vitals, evidencia y limitación exacta de zoom MCP.
* Motivo: proporcionar la trazabilidad verificable requerida antes de cerrar TASK-PWM-054–056.
* Relación: consolida capturas, snapshots, Lighthouse y traces generados exclusivamente con Chrome DevTools.
* Resultado: ✅ Definition of Done local documentada como alcanzada.

## [2026-07-20]

* Archivo: `specs/premium-widget-motion/tasks.md`
* Cambio: actualización del resumen técnico con los valores finales de tamaño, listeners, bfcache y evidencia consolidada.
* Motivo: retirar datos de baseline que ya no describían la implementación final.
* Relación: prepara el cierre individual de TASK-PWM-001–056.
* Resultado: ✅ estado técnico superior del archivo sincronizado con la evidencia.

## [2026-07-20]

* Archivo: `specs/premium-widget-motion/tasks.md`
* Cambio: cierre individual de las 753 casillas verificadas, 57 estados de tarea, 44 filas de widget y 68 filas de trazabilidad.
* Motivo: reflejar el estado real sólo después de suite, evidencia visual, accesibilidad, responsive, rendimiento y regresión cruzada aprobadas.
* Relación: evidencia consolidada en `audits/2026-07-20/premium-widget-motion/report.md`.
* Resultado: ✅ 753/753 casillas completas, 57/57 tareas completas, 44/44 widgets aprobados, 68/68 requisitos completados y 0 pendientes locales.

## [2026-07-20]

* Archivo: artefactos de auditoría y documentos con observaciones de `git diff --check`
* Cambio: normalización mecánica previa al despliegue para retirar espacios finales y líneas vacías sobrantes sin alterar contenido funcional.
* Motivo: dejar el conjunto publicable limpio y verificable antes de crear el commit de producción.
* Relación: higiene final posterior al cierre de TASK-PWM-001–056.
* Resultado: ✅ árbol de trabajo sin errores de espacios según `git diff --check`; los avisos restantes son únicamente conversión local LF/CRLF de Git.

## [2026-07-20]

* Archivo: `index.html`, `assets/styles.css`, `assets/animations.js`
* Cambio: integración no destructiva de los tres commits que aparecieron en `origin/main` antes del despliegue; se conservaron la marca Lithora, el trabajo remoto de cabecera/animación y la metadata, navegación, contenido y fecha vigentes de la implementación validada.
* Motivo: el primer `push` fue rechazado por avance remoto y era necesario preservar el trabajo concurrente sin forzar la rama.
* Relación: resolución del único conflicto, localizado en `index.html`; los dos archivos de assets se fusionaron automáticamente.
* Resultado: ✅ conflicto resuelto con la versión funcional más completa; la primera revalidación detectó fragmentos de contenido estático desincronizados por el merge.

## [2026-07-20]

* Archivo: `index.html`, `ecosistema-soluciones/index.html`
* Cambio: regeneración de los fragmentos administrados por `scripts/render-ecosystem.mjs` después de integrar `origin/main`.
* Motivo: restaurar la identidad exacta entre `content.js`, la portada y la ruta del ecosistema sin rehacer contenido manualmente.
* Relación: corrección derivada de la revalidación posterior al merge remoto.
* Resultado: ✅ nueve nichos publicados y sincronizados nuevamente.

## [2026-07-20]

* Archivo: `audits/2026-07-20/premium-widget-motion/tailwind-home.json`, `audits/2026-07-20/premium-widget-motion/tailwind-service.json`
* Cambio: captura con Chrome DevTools del CSS Tailwind realmente generado para la portada y la página de servicio.
* Motivo: la comprobación posterior al merge detectó el aviso productivo del CDN de Tailwind todavía presente en esas dos rutas.
* Relación: amplía a las rutas restantes la materialización local ya aplicada a Precios, Prototipado y Materiales.
* Resultado: ✅ hojas efectivas capturadas sin recurrir a un proveedor web alternativo.

## [2026-07-20]

* Archivo: `index.html`, `servicio-impresion-3d/index.html`, `scripts/materialize-tailwind.mjs`, `assets/tailwind-home.css`, `assets/tailwind-service.css`
* Cambio: sustitución de los dos últimos usos del runtime CDN de Tailwind por hojas locales reproducibles y ampliación del materializador a cinco páginas.
* Motivo: eliminar el aviso de producción, reducir dependencia externa y conservar exactamente la composición visual ya renderizada.
* Relación: misma estrategia validada previamente en Precios, Prototipado y Materiales; ahora cubre todas las rutas que utilizaban Tailwind.
* Resultado: ✅ CSS local generado (Home 16,283 bytes; Servicio 8,858 bytes), pendiente regresión visual y de consola.

## [2026-07-20]

* Archivo: `audits/2026-07-20/production-lighthouse-solutions/`
* Cambio: auditoría Lighthouse de la ruta productiva `https://lithora3d.com/ecosistema-soluciones/` después del workflow de GitHub Pages #6.
* Motivo: comprobar el resultado desplegado en el dominio real, no limitar la evidencia al servidor local.
* Relación: commit `b12f3a3`, ejecución `29792520866`, auditoría realizada exclusivamente con Chrome DevTools.
* Resultado: ✅ Accesibilidad 100, Buenas prácticas 100, SEO 100 y navegación agéntica 100; 57/57 auditorías aprobadas.

## [2026-07-20]

* Archivo: `tasks.md`
* Cambio: cierre individual de TASK-067 y TASK-068 con evidencia del entorno local equivalente, autorización de promoción, commit `b12f3a3`, workflow #6, inspección Chrome productiva, analítica independiente, WhatsApp, red, metadata y Lighthouse.
* Motivo: staging y producción dejaron de ser bloqueos externos al disponer de autorización, sesión y acceso efectivos en este turno.
* Relación: GitHub Pages ejecución `29792520866`; el repositorio no define un staging separado, por lo que la candidata local validada fue el entorno previo de aprobación.
* Resultado: ✅ 15 casillas de publicación cerradas con evidencia; rollback no requerido y procedimiento preservado.

## [2026-07-20]

* Archivo: `tasks.md`
* Cambio: limpieza de hallazgos y bloqueos históricos: decisiones, stack, calidad, consola, camino crítico, estado de ejecución y lista final ahora describen la implementación y producción reales.
* Motivo: evitar que textos iniciales obsoletos contradijeran las casillas verificadas y el despliegue completado.
* Relación: conserva los campos “Estado inicial” de cada tarea como trazabilidad, pero declara explícitamente que las casillas son el estado actual.
* Resultado: ✅ Chrome MCP, staging equivalente y producción retirados de bloqueos; quedan 15 casillas externas reales.

## [2026-07-20]

* Archivo: `tasks.md`
* Cambio: actualización mecánica acotada de las 98 filas de la matriz de trazabilidad desde estado inicial pendiente a estado actual completado.
* Motivo: cada requerimiento de la matriz ya cuenta con implementación y prueba; mantener “Pendiente” era inconsistente con las tareas cerradas.
* Relación: los trabajos postlanzamiento dependientes de cuenta, tráfico y demanda real permanecen como 15 casillas externas fuera de esta matriz de implementación.
* Resultado: ✅ 98/98 filas trazadas como completadas, cero filas pendientes.

## [2026-07-20]

* Archivo: `audits/2026-07-20/premium-widget-motion/report.md`
* Cambio: incorporación de commit, workflow, rutas, red/consola, Tailwind local, contratos, cotización, eventos, SEO y Lighthouse observados en producción.
* Motivo: convertir el informe local en evidencia completa de publicación y dejar explícita la Definition of Done productiva.
* Relación: verificación de `https://lithora3d.com/` con Chrome DevTools tras desplegar `b12f3a3`.
* Resultado: ✅ Definition of Done de publicación documentada como alcanzada.

## [2026-07-20]

* Archivo: `OPERATIONS.md`
* Cambio: cierre del checklist de despliegue con evidencia real y documentación de GitHub Pages, Cloudflare y Namecheap; la conexión analítica queda como único punto externo del checklist.
* Motivo: dejar una guía operativa que coincida con la infraestructura y el despliegue observados en las sesiones abiertas.
* Relación: commit productivo `b12f3a3`, workflow `29792520866`, dominio `https://lithora3d.com/`.
* Resultado: ✅ publicación, verificación y rollback documentados; cuenta analítica identificada con dependencia, propietario y siguiente acción.

## [2026-07-20]

* Archivo: despliegue y validación final del repositorio
* Cambio: integración segura de tres commits concurrentes, publicación de `b12f3a3` en `main`, verificación de GitHub Pages y repetición final de la suite completa tras el cierre documental.
* Motivo: entregar la versión funcional en producción y comprobar que el estado registrado coincide con el código desplegado.
* Relación: primer push rechazado por avance remoto; se usó merge no destructivo, regeneración de contenido y nueva validación antes de publicar.
* Resultado: ✅ workflow #6 exitoso, producción operativa, Lighthouse 100/100/100/100, `npm run validate` 81/81, `git diff --check` limpio y `tasks.md` en 509 completadas/15 externas.

## [2026-07-20]

* Archivo: `audits/2026-07-20/production-lighthouse-solutions/report.html`
* Cambio: retirada mecánica de espacios finales introducidos por el generador de Lighthouse.
* Motivo: el control del índice detectó dos líneas de whitespace después de crear el commit documental.
* Relación: no cambia resultados, estructura ni contenido de la auditoría productiva.
* Resultado: ✅ `git diff --check` vuelve a quedar limpio.

## [2026-07-21]

* Archivo: `audits/2026-07-21/seo/google-site-index.txt`
* Cambio: captura accesible de la consulta avanzada `site:lithora3d.com` en Google México mediante Chrome DevTools.
* Motivo: establecer la cobertura indexada observable antes de proponer o implementar mejoras SEO.
* Relación: inicio de la auditoría SEO profunda posterior al despliegue productivo.
* Resultado: ⚠️ evidencia capturada; análisis de resultados e intención todavía en curso.
## [2026-07-21]

* Archivo: `audits/2026-07-21/seo/search-console-not-verified.txt`
* Cambio: se guardó evidencia de Chrome DevTools de que la sesión actual no tiene acceso a la propiedad de dominio `lithora3d.com` en Google Search Console.
* Motivo: separar un problema real de medición/indexación de los cambios SEO que sí pueden completarse localmente.
* Relación: amplía el dork `site:lithora3d.com`, que mostró indexación visible limitada y un snippet desactualizado.
* Resultado: ✅ evidencia capturada; verificar o conceder acceso a la propiedad queda como acción externa.
## [2026-07-21]

* Archivo: `audits/2026-07-21/seo/research-report.md`
* Cambio: se documento la investigacion de produccion, dorks, intenciones, competidores, oportunidades y limites de crecimiento SEO.
* Motivo: convertir la evidencia de DevTools en una estrategia verificable sin cambiar el giro de impresion 3D ni prometer trafico garantizado.
* Relacion: consolida las capturas de indexacion y acceso a Search Console registradas en esta fecha.
* Resultado: ✅ diagnostico y prioridades documentados.
## [2026-07-21]

* Archivo: `index.html`, `servicio-impresion-3d/index.html`, `prototipado-rapido/index.html`, `sitemap.xml`
* Cambio: se priorizo la consulta principal en el titulo de inicio, se unifico la entidad Organization, se agrego el WhatsApp aprobado como ContactPoint, se incorporaron cobertura Mexico, idioma/fecha y `lastmod`, y se agrego una imagen conceptual elegible al sitemap.
* Motivo: mejorar comprension de entidad, rastreo y descubrimiento sin inventar direccion, perfiles sociales ni tarifas.
* Relacion: implementa las prioridades tecnicas del informe SEO del 2026-07-21.
* Resultado: ✅ metadatos y grafo estructurado reforzados con datos aprobados.
## [2026-07-21]

* Archivo: `precios-impresion-3d/index.html`, `prototipado-rapido/index.html`, `materiales-impresion-3d/index.html`
* Cambio: se agregaron preguntas y respuestas visibles basadas en las consultas observadas, se sincronizo cada FAQPage con el contenido visible y se reemplazo la etiqueta interna `BOFU` por lenguaje para clientes.
* Motivo: responder intenciones reales de precio, prototipado y seleccion de material sin inventar tarifas ni usar jerga de marketing.
* Relacion: aplica la prioridad de contenido util y marcado honesto del informe SEO.
* Resultado: ✅ contenido ampliado y datos estructurados alineados con la pagina.
## [2026-07-21]

* Archivo: `ecosistema-soluciones/index.html`
* Cambio: se reoriento el titulo hacia impresion 3D para negocios y proyectos y se agrego un ItemList de los nueve nichos conceptuales publicados.
* Motivo: describir mejor la intencion comercial real sin competir como rotulista ni presentar ejemplos conceptuales como proyectos ejecutados.
* Relacion: responde al analisis de las SERP de piezas personalizadas y letreros para negocios.
* Resultado: ✅ landing y listado estructurado alineados con el giro de Lithora 3D.
## [2026-07-21]

* Archivo: `index.html`, `prototipado-rapido/index.html`, `tests/static-audit.test.mjs`
* Cambio: se sustituyo jerga interna de marketing por lenguaje comprensible y se agregaron pruebas para contacto aprobado, FAQ visible, ItemList, lastmod e imagen conceptual en sitemap.
* Motivo: evitar texto orientado al buscador en el HTML y proteger automaticamente los contratos SEO nuevos.
* Relacion: corrige la inconsistencia detectada entre contenido para clientes y etiquetas internas de fases anteriores.
* Resultado: ✅ lenguaje depurado y cobertura automatizada agregada.
## [2026-07-21]

* Archivo: `tests/ecosistema.test.mjs`, `tasks.md`
* Cambio: se actualizo la expectativa del bloque oculto al nuevo lenguaje y se registro TASK-069 con ocho entregables SEO completados y el acceso exacto pendiente de Search Console.
* Motivo: corregir la unica regresion de prueba y mantener el estado operativo trazable.
* Relacion: sigue el fallo detectado por `npm run validate` tras retirar la etiqueta `BÚSQUEDAS CLAVE`.
* Resultado: ✅ prueba corregida y bloqueo externo precisado con dependencia, propietario y accion.
## [2026-07-21]

* Archivo: `audits/2026-07-21/seo/prices-mobile.webp`
* Cambio: se capturo con Chrome DevTools la pagina de precios completa a 390 px con emulacion movil y tactil.
* Motivo: comprobar que el nuevo bloque FAQ conserva lectura, jerarquia y ausencia de desbordamiento.
* Relacion: valida visualmente el contenido agregado en la fase SEO.
* Resultado: ✅ evidencia movil guardada; `scrollWidth - clientWidth = 0`.
## [2026-07-21]

* Archivo: `audits/2026-07-21/seo/lighthouse-ecosystem/report.json`, `audits/2026-07-21/seo/lighthouse-ecosystem/report.html`
* Cambio: se ejecuto Lighthouse movil en Chrome DevTools sobre la landing local de soluciones.
* Motivo: validar SEO, accesibilidad y buenas practicas despues de agregar el ItemList y cambiar el titulo.
* Relacion: evidencia de cierre para TASK-069.
* Resultado: ✅ SEO 100, accesibilidad 100, buenas practicas 100 y agentic browsing 99; 56 auditorias aprobadas de 57.
## [2026-07-21]

* Archivo: `audits/2026-07-21/seo/ecosystem-performance.json.json.gz`
* Cambio: se guardo una traza movil de rendimiento de la landing local de soluciones con Chrome DevTools.
* Motivo: observar metricas de experiencia despues del refuerzo SEO y distinguir laboratorio de datos reales.
* Relacion: complementa Lighthouse; no reemplaza CrUX ni telemetria de usuarios.
* Resultado: ✅ LCP observado 132 ms y CLS 0.00 sin throttling; INP y datos de campo no disponibles por ausencia de interaccion/trafico real.
## [2026-07-21]

* Archivo: `tests/browser_validation.py`
* Cambio: el validador espera la finalizacion de la animacion de cierre antes de comprobar la restauracion de foco.
* Motivo: la implementacion restaura foco en el callback final de motion; la asercion inmediata producia una carrera aunque el comportamiento se completara correctamente.
* Relacion: corrige el unico fallo de `npm run test:browser` observado despues de la validacion SEO.
* Resultado: ✅ la prueba ahora mide el contrato final y no el estado transitorio.
## [2026-07-21]

* Archivo: `assets/motion-pages.css`
* Cambio: se limito tambien en el elemento raiz el desbordamiento horizontal decorativo de las cuatro rutas con motion.
* Motivo: el validador encontro que un estado transitorio de detalle podia ampliar `documentElement.scrollWidth` en desktop aunque el body ya usaba `overflow-x: clip`.
* Relacion: corrige el segundo fallo encontrado por la suite de navegador tras resolver su carrera de foco.
* Resultado: ✅ contencion horizontal reforzada sin alterar layout ni interaccion.
## [2026-07-21]

* Archivo: `audits/2026-07-20/browser-validation.json`, capturas responsive de `audits/2026-07-20/`, `tasks.md`
* Cambio: la suite CDP regenero evidencia de escritorio, laptop, tablet, movil, pantalla pequena, detalles y secciones de inicio; se actualizo el conteo final de pruebas.
* Motivo: volver a validar navegacion, teclado, foco, tactil, estados, responsive, zoom, consola y metricas despues de los cambios SEO.
* Relacion: ejecucion final posterior a la contencion horizontal y a la espera correcta del cierre animado.
* Resultado: ✅ 48 comprobaciones CDP; LCP 1092 ms, CLS 0.00236, INP observado 32 ms y cero errores relevantes de consola.
## [2026-07-21]

* Archivo: produccion `https://lithora3d.com/`, GitHub Pages run `29840845490`
* Cambio: se publico el commit `452e1b5` en `main` y se verificaron portada, precios y sitemap con Chrome DevTools.
* Motivo: hacer efectivas las mejoras SEO y confirmar que el CDN sirve la revision nueva.
* Relacion: cierre de TASK-069; el envio del sitemap a Search Console sigue separado por falta de acceso a la propiedad.
* Resultado: ✅ workflow exitoso; titulo nuevo, ContactPoint, FAQ visible/estructurada, seis lastmod, H1 unico, cero overflow y cero mensajes relevantes de consola en produccion.
## [2026-07-21]

* Archivo: `index.html`, `tests/static-audit.test.mjs`
* Cambio: se incorporo la etiqueta oficial de verificacion de la propiedad URL-prefix `https://lithora3d.com/` solicitada desde Google Search Console y una regresion automatizada para preservarla.
* Motivo: las cuentas abiertas no tenian acceso a una propiedad de Lithora y el DNS autoritativo pertenece a Cloudflare sin sesion; la etiqueta HTML permite verificar el sitio desde el despliegue ya controlado.
* Relacion: resuelve de forma reversible el bloqueo registrado en TASK-069 sin cambiar nameservers ni DNS.
* Resultado: ⚠️ etiqueta implementada localmente; despliegue, verificacion y envio del sitemap pendientes.

## [2026-07-21]

* Archivo: produccion `https://lithora3d.com/`, Google Search Console y `tasks.md`
* Cambio: se desplego el commit `5f82cde` mediante GitHub Pages workflow #10, se confirmo en el HTML publico la etiqueta de verificacion, se verifico la propiedad URL-prefix, se envio `sitemap.xml` y se actualizo el estado operativo de TASK-069.
* Motivo: cerrar el bloqueo de acceso a Search Console con el metodo reversible aprobado y registrar evidencia real de indexacion.
* Relacion: completa el cambio anterior que dejo preparada la etiqueta HTML y sustituye el bloqueo DNS por una propiedad URL-prefix funcional.
* Resultado: ✅ propiedad verificada; sitemap `Correcto` con seis paginas descubiertas; portada indexada; cinco rutas descubiertas aun sin rastrear; solicitud prioritaria aceptada para `/servicio-impresion-3d/`; sin acciones manuales ni problemas de seguridad; informes de rendimiento y Core Web Vitals en procesamiento por falta de datos de campo.

## [2026-07-21]

* Archivo: pagina publica `https://www.facebook.com/Lithora3D/`
* Cambio: se reemplazaron la categoria `Videojuego`, el enlace de YouTube y la biografia generica por `Servicio de impresion`, `https://lithora3d.com/` y una presentacion comercial orientada a impresion 3D; tambien se publicaron el telefono oficial `+52 833 108 0178`, el idioma `Espanol estandar` y el enlace social `instagram.com/lithora3d`.
* Motivo: alinear la entidad de Facebook con el giro real, reforzar sus terminos descriptivos y conectar la pagina social con el sitio y el canal comercial aprobados.
* Relacion: complementa la optimizacion SEO on-site y la verificacion de Search Console realizadas anteriormente.
* Resultado: ✅ datos publicos verificados con Chrome DevTools; la vinculacion nativa del boton de WhatsApp no se completo porque Meta devolvio `El usuario no tiene permiso para esta accion`, por lo que requiere un administrador con control total sobre la pagina o el activo comercial. No se eliminaron los reels historicos de programacion para preservar su alcance y evitar una accion destructiva.

## [2026-07-21]

* Archivo: resultados de Google para `site:facebook.com/Lithora3D Lithora3D`
* Cambio: se comprobo mediante Chrome DevTools la visibilidad indexada actual de la pagina de Facebook despues de actualizar sus datos.
* Motivo: separar la optimizacion de la entidad de su posterior rastreo e indexacion por buscadores.
* Relacion: valida el punto de partida externo de la optimizacion social.
* Resultado: ⚠️ Google no muestra actualmente resultados para ese patron; los cambios de perfil quedaron publicos, pero el rastreo y la indexacion dependen de Meta y Google y no son inmediatos.

## [2026-07-21]

* Archivo: `index.html`, `tests/static-audit.test.mjs`
* Cambio: se agregaron los perfiles oficiales de Facebook e Instagram a `Organization.sameAs` y una regresion automatizada que preserva ambas URLs.
* Motivo: reforzar desde el dominio oficial que los perfiles sociales pertenecen a la misma entidad de Lithora 3D.
* Relacion: completa la conexion bidireccional iniciada al enlazar el sitio e Instagram desde la pagina de Facebook.
* Resultado: ✅ marcado estructurado actualizado con datos publicos confirmados y cobertura automatizada agregada.

## [2026-07-21]

* Archivo: validacion local del repositorio
* Cambio: se ejecuto `npm run validate` despues de incorporar los perfiles sociales oficiales a la entidad estructurada.
* Motivo: comprobar contenido sincronizado, sintaxis JavaScript y regresiones antes de publicar.
* Relacion: valida el refuerzo de identidad social agregado a `Organization.sameAs`.
* Resultado: ✅ 9 nichos sincronizados, comprobaciones de sintaxis correctas y 82 de 82 pruebas aprobadas.

## [2026-07-21]

* Archivo: produccion `https://lithora3d.com/`, GitHub Pages run `29848521860`
* Cambio: se publico el commit `e8c90b8` y se verifico con Chrome DevTools que la entidad `Organization` expone los perfiles oficiales de Facebook e Instagram en `sameAs`.
* Motivo: hacer efectiva en produccion la relacion entre el dominio y los perfiles sociales de Lithora 3D.
* Relacion: despliega y valida el refuerzo estructurado de identidad social.
* Resultado: ✅ workflow #12 exitoso; `sameAs`, titulo y canonical confirmados en el HTML publico.

## [2026-07-21]

* Archivo: pagina publica `https://www.facebook.com/Lithora3D/`
* Cambio: se agregaron `Tampico, Mexico`, `Ciudad Madero, Mexico` y `Altamira, Mexico` como areas publicas de servicio.
* Motivo: reforzar la identificacion local de Lithora 3D sin publicar una direccion fisica no confirmada.
* Relacion: complementa la categoria, biografia, telefono, sitio e Instagram configurados en la optimizacion social anterior.
* Resultado: ✅ las tres ciudades quedaron guardadas y verificadas con Chrome DevTools en la seccion publica de informacion de contacto.

## [2026-07-21]

* Archivo: `index.html`
* Cambio: se incorporaron Tampico, Ciudad Madero y Altamira en el titulo, descripcion, tarjetas sociales, H1, mensaje visible de cobertura y pie de pagina; el marcado `Service` y `ContactPoint` ahora declara esas ciudades y conserva Mexico como cobertura adicional.
* Motivo: mejorar la relevancia geografica y hacer que usuarios y buscadores identifiquen a Lithora 3D como servicio local de la zona sur de Tamaulipas.
* Relacion: refleja en el sitio las mismas areas de servicio publicadas en Facebook y evita inventar un domicilio fisico.
* Resultado: ✅ senales locales visibles y estructuradas implementadas sin limitar la cobertura nacional.

## [2026-07-21]

* Archivo: `assets/styles.css`, `index.html`
* Cambio: se presento la cobertura local como una linea compacta con indicador geografico dentro del hero y se conservo el H1 ya validado para evitar alargarlo y degradar su composicion responsive.
* Motivo: integrar la nueva senal local con jerarquia clara y sin comprometer legibilidad, altura inicial ni estabilidad visual.
* Relacion: mejora visualmente la incorporacion geografica del cambio anterior.
* Resultado: ✅ tratamiento local ligero, legible y adaptable agregado al hero.

## [2026-07-21]

* Archivo: `tests/static-audit.test.mjs`
* Cambio: se agregaron regresiones para el titulo local, las tres ciudades en `ContactPoint` y `Service`, la cobertura visible y la validez JSON del marcado de portada.
* Motivo: impedir que futuras ediciones eliminen o desalineen las nuevas senales geograficas.
* Relacion: cubre automaticamente la implementacion local en `index.html`.
* Resultado: ✅ cobertura automatizada incorporada para metadata, contenido visible y datos estructurados locales.

## [2026-07-21]

* Archivo: validacion local del repositorio
* Cambio: se ejecuto `npm run validate` despues de incorporar las senales de servicio local.
* Motivo: comprobar sincronizacion de contenido, sintaxis JavaScript, enlaces, metadata, JSON-LD y regresiones antes de validar en navegador.
* Relacion: valida los cambios locales de portada y su cobertura automatizada.
* Resultado: ✅ 9 nichos sincronizados, sintaxis correcta y 82 de 82 pruebas aprobadas.

## [2026-07-21]

* Archivo: `audits/2026-07-21/local-seo-desktop.png`, `audits/2026-07-21/local-seo-mobile.png`, evidencia CDP de `audits/2026-07-20/`
* Cambio: se comprobo con Chrome DevTools la portada local en escritorio y movil, y se ejecuto la suite completa de navegador despues del refuerzo geografico.
* Motivo: validar composicion, legibilidad, H1 unico, JSON-LD, ausencia de desbordamiento y errores de consola antes de publicar.
* Relacion: validacion visual y funcional posterior a las senales locales agregadas.
* Resultado: ✅ 48 comprobaciones CDP aprobadas; cero overflow y errores de consola; LCP 1212 ms, CLS 0.00236 e INP observado 32 ms.

## [2026-07-21]

* Archivo: pagina publica `https://www.facebook.com/Lithora3D/`
* Cambio: la biografia se actualizo para comenzar con `Impresion 3D en Tampico, Ciudad Madero y Altamira`, conservar los productos principales, la cobertura nacional y la cotizacion por WhatsApp.
* Motivo: alinear la descripcion de la entidad social con las senales geograficas visibles y estructuradas del sitio.
* Relacion: completa las tres areas de servicio agregadas previamente y mejora la consistencia local entre Facebook y lithora3d.com.
* Resultado: ✅ biografia guardada y verificada con Chrome DevTools; se omitio compartirla como publicacion para no generar contenido redundante en el feed.

## [2026-07-21]

* Archivo: produccion `https://lithora3d.com/`, GitHub Pages run `29849654983`
* Cambio: se publico el commit `a494b84` en `main` y se verificaron las senales locales directamente en el dominio publico.
* Motivo: hacer efectiva la identificacion de Lithora 3D en Tampico, Ciudad Madero y Altamira y confirmar la revision servida por GitHub Pages.
* Relacion: despliega la metadata, contenido visible, estilo y JSON-LD local validados previamente.
* Resultado: ✅ workflow #14 exitoso; titulo, descripcion, cobertura visible, tres ciudades estructuradas, H1 unico, cero overflow y cero advertencias o errores de consola confirmados con Chrome DevTools.

## [2026-07-21]

* Archivo: perfil publico `https://www.instagram.com/lithora3d/`
* Cambio: se publico una biografia de 111 caracteres orientada a `Impresion 3D en Tampico, Madero y Altamira`, con letreros, llaveros, prototipos, piezas a medida y cotizacion por WhatsApp.
* Motivo: incorporar terminos de servicio, productos y cobertura local en el campo de Instagram que si participa en descubrimiento y contexto del perfil.
* Relacion: alinea Instagram con las senales locales ya publicadas en lithora3d.com y Facebook.
* Resultado: ✅ biografia guardada y verificada publicamente con Chrome DevTools.

## [2026-07-21]

* Archivo: cuenta profesional `@lithora3d` en Instagram
* Cambio: la cuenta personal se convirtio en cuenta empresarial publica, se asigno y mostro la categoria `Servicio empresarial`, se activo el panel profesional y se habilito la visibilidad del contenido en motores de busqueda.
* Motivo: obtener categoria publica, insights, controles empresariales y elegibilidad de descubrimiento externo adecuados para una empresa local.
* Relacion: sustituye el perfil sin categoria ni herramientas profesionales observado al iniciar esta optimizacion.
* Resultado: ✅ cuenta empresarial creada y categoria visible en el perfil; Instagram confirmo que la cuenta profesional quedo lista.

## [2026-07-21]

* Archivo: `scripts/build-prospect-report.mjs`
* Cambio: se creó un generador reproducible que consolida, deduplica y clasifica la evidencia de prospección obtenida con Chrome DevTools, asigna propuestas por giro y produce catálogos CSV e informe Markdown.
* Motivo: procesar sin pérdidas más de mil fichas públicas y conservar trazabilidad entre negocio, contacto, fuente y recomendación comercial.
* Relación: amplía la investigación SEO previa hacia prospección comercial local sin repetir cambios del sitio ni recolectar datos privados.
* Resultado: ✅ generador creado; ejecución y validación de artefactos pendientes.

## [2026-07-21]

* Archivo: `audits/2026-07-21/prospecting/local-business-report.md`, `local-business-prospects.csv`, `dork-contact-evidence.csv`
* Cambio: se generó el informe comercial, el catálogo negocio por negocio y el anexo de contactos públicos a partir de 1,291 fichas de Maps y 100 resultados de dorks inspeccionados con Chrome DevTools.
* Motivo: entregar una base accionable con giro, contacto público, ubicación publicada, prioridad y productos sugeridos para Lithora 3D.
* Relación: materializa el generador registrado en el cambio anterior y conserva por separado los fragmentos orgánicos que requieren confirmación de sucursal.
* Resultado: ✅ 1,161 negocios o sucursales únicos; 426 con teléfono público en Maps, 255 con sitio indicado y 69 resultados dork con teléfono.

## [2026-07-21]

* Archivo: `scripts/build-prospect-report.mjs`
* Cambio: se añadió un filtro geográfico por coordenadas para excluir resultados fuera de Tampico–Madero–Altamira y se conservó el orden original de Maps al seleccionar la cartera inicial.
* Motivo: la validación detectó un falso positivo nacional y una priorización por reseñas que desplazaba prospectos más relevantes del listado local.
* Relación: mejora el generador de prospección creado en esta fecha sin repetir las consultas ni eliminar sucursales locales válidas.
* Resultado: ✅ corrección implementada; regeneración y verificación de conteos pendientes.

## [2026-07-21]

* Archivo: `audits/2026-07-21/prospecting/local-business-report.md`, `local-business-prospects.csv`
* Cambio: se regeneraron el informe y el catálogo con control geográfico y cartera inicial en el orden observado por Maps.
* Motivo: retirar seis resultados cuyas coordenadas estaban fuera de la zona conurbada y mejorar la utilidad del primer bloque de contacto.
* Relación: corrige los artefactos generados en esta fecha; el anexo dork conserva sus 100 resultados orgánicos como evidencia separada.
* Resultado: ✅ 1,155 negocios o sucursales locales únicos; 421 con teléfono público, 252 con sitio indicado y cero falsos positivos geográficos conocidos en el catálogo.

## [2026-07-21]

* Archivo: `scripts/build-prospect-report.mjs`
* Cambio: se limpiaron caracteres privados e invisibles insertados por la interfaz de Google Maps antes de exportar categoría y dirección.
* Motivo: evitar que iconos internos de accesibilidad o acciones contaminen el CSV y las tablas del informe.
* Relación: ajuste de calidad posterior al filtro geográfico y a la selección de cartera local.
* Resultado: ✅ normalización implementada; regeneración final pendiente.

## [2026-07-21]

* Archivo: `audits/2026-07-21/prospecting/local-business-report.md`, `local-business-prospects.csv`, `dork-contact-evidence.csv`
* Cambio: se regeneraron los tres entregables después de limpiar caracteres de interfaz y se conservaron los conteos verificados.
* Motivo: cerrar la entrega con texto legible y datos importables sin residuos visuales de Maps.
* Relación: cierre del informe de prospección local iniciado en esta fecha.
* Resultado: ✅ artefactos finales generados con 1,155 prospectos locales y 100 evidencias dork.

## [2026-07-21]

* Archivo: `scripts/build-prospect-workbook.py`
* Cambio: se creó un generador de Excel que transforma el catálogo final en una hoja tabular con un negocio por fila, filtros, encabezado fijo y enlaces clicables a Google Maps.
* Motivo: entregar los 1,155 prospectos en un formato operativo de escritorio con nombres, contactos, giros y propuestas comerciales.
* Relación: reutiliza `local-business-prospects.csv` ya validado y no repite la investigación web.
* Resultado: ✅ generador creado; ejecución y validación del archivo de Escritorio pendientes.

## [2026-07-21]

* Archivo: `C:/Users/yarteaga/Desktop/Prospectos_Lithora3D_Tampico_Madero_Altamira.xlsx`
* Cambio: se generó en el Escritorio un libro Excel con una hoja `Negocios`, 1,155 registros únicos y una empresa o sucursal por fila.
* Motivo: proporcionar una base comercial utilizable con nombre, teléfono, contacto, giro, dirección, prioridad, productos sugeridos y enlace a Maps.
* Relación: exporta el catálogo local depurado y conserva los registros sin teléfono como `No visible` con la ficha pública como contacto alternativo.
* Resultado: ✅ Excel creado y validado; 1,155 IDs únicos, filtros activos, encabezado fijo y enlaces funcionales.

## [2026-07-21]

* Archivo: `scripts/build-prospect-workbook.py`
* Cambio: se creó una variante de máxima compatibilidad para Excel, sin tabla XML ni relaciones de hipervínculo externas; las URLs de Maps quedan como texto completo y se mantiene autofiltro, encabezado fijo y formato alternado.
* Motivo: Microsoft Excel reportó contenido problemático al abrir el primer libro, aunque la validación de OpenPyXL era correcta; los enlaces largos de Maps eran el componente de mayor riesgo.
* Relación: corrige la exportación inicial sin cambiar los 1,155 registros ni su información comercial.
* Resultado: ✅ generador corregido; creación y prueba del nuevo archivo pendientes.

## [2026-07-21]

* Archivo: `C:/Users/yarteaga/Desktop/Prospectos_Lithora3D_CORREGIDO.xlsx`
* Cambio: se generó un libro compatible con 1,155 negocios, 16 columnas, URLs de Maps como texto, autofiltro y encabezado fijo, sin hipervínculos externos ni tabla XML.
* Motivo: sustituir el archivo que Excel señaló como problemático y eliminar las estructuras susceptibles de reparación automática.
* Relación: conserva exactamente el catálogo comercial validado y la regla de un negocio o sucursal por fila.
* Resultado: ✅ archivo corregido creado; validación estructural y apertura nativa pendientes.

## [2026-07-21]

* Archivo: `scripts/build-prospect-workbook.py`
* Cambio: se sustituyó la escritura del libro por XlsxWriter con `strings_to_urls=False`, manteniendo OpenPyXL únicamente como lector de validación.
* Motivo: generar el paquete XLSX con un motor orientado a compatibilidad nativa de Excel y evitar que las URLs largas se conviertan implícitamente en relaciones externas.
* Relación: refuerza la variante compatible creada después del aviso mostrado por Microsoft Excel.
* Resultado: ✅ generador migrado; regeneración y validación del paquete pendientes.

## [2026-07-21]

* Archivo: `C:/Users/yarteaga/Desktop/Prospectos_Lithora3D_CORREGIDO.xlsx`
* Cambio: se regeneró la versión corregida mediante XlsxWriter, sin hipervínculos externos, tablas XML ni conversión automática de URLs.
* Motivo: maximizar la compatibilidad con Microsoft Excel después del aviso de recuperación del primer archivo.
* Relación: reemplaza internamente la primera versión compatible conservando nombre, ubicación y 1,155 registros.
* Resultado: ✅ libro regenerado y leído correctamente por OpenPyXL; validación adicional del paquete pendiente.

## [2026-07-21]

* Archivo: validación de `C:/Users/yarteaga/Desktop/Prospectos_Lithora3D_CORREGIDO.xlsx`
* Cambio: se comprobó integridad ZIP, parseo de las nueve partes XML y ausencia total de tablas XML, elementos de hipervínculo y relaciones externas.
* Motivo: verificar específicamente los componentes asociados al aviso de recuperación mostrado por Excel.
* Relación: valida la regeneración con XlsxWriter; la apertura automatizada vía COM no estuvo disponible porque Office devolvió `TYPE_E_CANTLOADLIBRARY` antes de abrir el archivo.
* Resultado: ✅ paquete OpenXML íntegro, 1,155 filas únicas y estructuras problemáticas eliminadas.

## [2026-07-21]

* Archivo: `audits/2026-07-21/prospecting/contact-enrichment.json`
* Cambio: se guardó por ID la inspección individual de 734 fichas sin teléfono original y los 21 contactos útiles recuperados en 80 dorks exactos mediante Chrome DevTools.
* Motivo: conservar trazabilidad verificable antes de actualizar el catálogo y evitar incorporar datos de cargas no coincidentes o consultas bloqueadas.
* Relación: amplía el censo comercial del 2026-07-21; sustituye los intentos provisionales por resultados cuyo H1 fue validado contra el nombre del negocio.
* Resultado: ✅ 524 teléfonos, 279 sitios, 160 conjuntos de redes y 2 correos recuperados en Maps; 21 canales adicionales en dorks. Google bloqueó con `403 Forbidden` los 111 dorks restantes y no se usó fallback.

## [2026-07-21]

* Archivo: `scripts/apply-contact-enrichment.py`
* Cambio: se creó el integrador que cruza por ID el catálogo original con la evidencia verificada de Maps y dorks, conserva un negocio por fila y clasifica el canal de contacto disponible.
* Motivo: incorporar los contactos recuperados sin alterar ni duplicar el censo original de 1,155 negocios.
* Relación: consume `contact-enrichment.json`, creado tras validar individualmente las fichas con Chrome DevTools.
* Resultado: ✅ integrador creado; ejecución y validación pendientes.

## [2026-07-21]

* Archivo: `audits/2026-07-21/prospecting/local-business-prospects-enriched.csv`
* Cambio: se generó el catálogo enriquecido de 1,155 registros con teléfono, sitio, correo, red social, contacto adicional, estado, fuente y fecha de verificación.
* Motivo: convertir la investigación adicional en una base comercial utilizable y trazable.
* Relación: resultado de `scripts/apply-contact-enrichment.py` sobre el catálogo original y `contact-enrichment.json`.
* Resultado: ✅ 952 negocios con teléfono, 33 adicionales con canal digital y 170 con solo ficha pública de Maps; cero IDs duplicados.

## [2026-07-21]

* Archivo: `scripts/build-prospect-workbook.py`
* Cambio: se adaptó el generador al catálogo enriquecido, con 22 columnas de contacto, giro y oferta sugerida, y un nuevo archivo de salida en el Escritorio.
* Motivo: entregar la investigación adicional en un libro compatible con Excel y mantener visibles las fuentes y fechas de verificación.
* Relación: conserva el motor XlsxWriter, las URLs como texto y la ausencia de tablas XML e hipervínculos externos decidida tras el aviso de reparación.
* Resultado: ✅ generador actualizado; creación y validación del libro pendientes.

## [2026-07-21]

* Archivo: ejecución de `scripts/build-prospect-workbook.py`
* Cambio: se intentó generar el libro enriquecido con el intérprete Python disponible en PATH.
* Motivo: crear y validar la entrega final en el Escritorio.
* Relación: primera ejecución después de adaptar el generador al catálogo enriquecido.
* Resultado: ❌ el intérprete del sistema no contiene `xlsxwriter`; se usará el runtime documental incluido en el workspace, como en la generación compatible anterior.

## [2026-07-21]

* Archivo: `C:/Users/yarteaga/Desktop/Prospectos_Lithora3D_ENRIQUECIDO.xlsx`
* Cambio: se creó el libro enriquecido con 1,155 negocios, 22 columnas, encabezado fijo, autofiltro y un registro por fila.
* Motivo: entregar en el Escritorio los contactos adicionales recuperados y el contexto comercial solicitado.
* Relación: generado desde `local-business-prospects-enriched.csv` mediante el runtime documental incluido en Codex.
* Resultado: ✅ archivo creado y leído correctamente por OpenPyXL; validación final del paquete OpenXML pendiente.

## [2026-07-21]

* Archivo: validación de `C:/Users/yarteaga/Desktop/Prospectos_Lithora3D_ENRIQUECIDO.xlsx`
* Cambio: se verificaron integridad ZIP, parseo de las siete partes XML, 1,155 filas e IDs únicos, 22 columnas y ausencia de hipervínculos, tablas XML y relaciones externas.
* Motivo: asegurar que la entrega enriquecida conserve la corrección aplicada al archivo que Excel intentó reparar.
* Relación: comprobación final posterior a la generación con XlsxWriter y lectura con OpenPyXL.
* Resultado: ✅ paquete OpenXML íntegro y compatible; validación completada sin errores.

## [2026-07-21]

* Archivo: `scripts/build-whatsapp-audit-console.py`
* Cambio: se creó un generador para producir un auditor JavaScript de WhatsApp Web con 930 teléfonos únicos, resultados iniciales precargados, pausado/reanudación, guardado incremental y exportación CSV.
* Motivo: comprobar mediante el buscador visible de Nuevo chat qué teléfonos públicos aparecen en WhatsApp, sin escribir ni enviar mensajes y sin recargar la página por registro.
* Relación: usa los 952 registros con teléfono de `local-business-prospects-enriched.csv` y reutiliza resultados cuando varios negocios comparten el mismo número.
* Resultado: ✅ generador creado; generación e inspección del script pendientes.

## [2026-07-21]

* Archivo: `scripts/build-whatsapp-audit-console.py`
* Cambio: se corrigió la condición de reanudación para omitir únicamente resultados definitivos `si`/`no` y procesar teléfonos nuevos o previamente inconclusos.
* Motivo: evitar que el auditor interpretara registros aún inexistentes como ya revisados.
* Relación: ajuste preventivo detectado durante la revisión del generador antes de producir el script de consola.
* Resultado: ✅ lógica de pendientes y reintentos corregida.

## [2026-07-21]

* Archivo: `audits/2026-07-21/prospecting/whatsapp-audit-console.js`, `C:/Users/yarteaga/Desktop/WhatsApp_Auditor_Lithora.js`
* Cambio: se generó el auditor de consola con 930 teléfonos únicos correspondientes a 952 registros comerciales y diez resultados iniciales precargados.
* Motivo: dejar una versión trazable en el proyecto y otra lista para pegar desde el Escritorio en la consola de WhatsApp Web.
* Relación: salida de `scripts/build-whatsapp-audit-console.py`; no envía mensajes ni usa endpoints internos de WhatsApp.
* Resultado: ✅ scripts generados; validación sintáctica e inicio controlado pendientes.

## [2026-07-21]

* Archivo: validación de `whatsapp-audit-console.js`
* Cambio: se comprobó la sintaxis con Node.js y la igualdad SHA-256 entre la copia del proyecto y la copia del Escritorio.
* Motivo: asegurar que el código listo para pegar sea ejecutable y que ambas entregas contengan exactamente el mismo auditor.
* Relación: validación posterior a la generación del script para 930 números únicos.
* Resultado: ✅ sintaxis válida y copias idénticas; ejecución masiva pendiente.

## [2026-07-21]

* Archivo: `audits/2026-07-21/prospecting/whatsapp-audit-state.json`
* Cambio: se guardó el estado final extraído de WhatsApp Web mediante Chrome DevTools después de revisar los 930 teléfonos únicos.
* Motivo: conservar evidencia trazable y permitir cruzar los resultados con los 952 registros comerciales sin repetir consultas.
* Relación: ejecución de `whatsapp-audit-console.js` usando el botón Nuevo chat y el buscador de números, sin enviar mensajes.
* Resultado: ✅ 527 números con WhatsApp, 403 sin WhatsApp, cero inconclusos y cero pendientes.

## [2026-07-21]

* Archivo: `scripts/apply-whatsapp-audit.py`
* Cambio: se creó el integrador que cruza el resultado de WhatsApp por teléfono normalizado con los 1,155 negocios y añade disponibilidad, número, fecha y fuente de verificación.
* Motivo: trasladar los 930 resultados únicos a cada registro comercial, incluyendo los negocios que comparten teléfono y los que no tienen número verificable.
* Relación: consume `whatsapp-audit-state.json` y conserva el catálogo enriquecido previo sin duplicar IDs.
* Resultado: ✅ integrador creado; ejecución y validación pendientes.

## [2026-07-21]

* Archivo: `audits/2026-07-21/prospecting/local-business-prospects-whatsapp.csv`
* Cambio: se generó el catálogo final de 1,155 negocios con el estado de WhatsApp incorporado por registro.
* Motivo: convertir los resultados por número único en una base comercial lista para filtrar y priorizar negocio por negocio.
* Relación: resultado de `scripts/apply-whatsapp-audit.py`; los 22 registros con teléfonos compartidos reutilizan la misma comprobación verificable.
* Resultado: ✅ 539 negocios con WhatsApp, 413 sin WhatsApp y 203 sin teléfono para verificar; cero IDs duplicados o teléfonos inconclusos.

## [2026-07-21]

* Archivo: `scripts/build-prospect-workbook.py`
* Cambio: se adaptó el generador para usar el catálogo final de WhatsApp, añadir cuatro columnas de verificación y producir `Prospectos_Lithora3D_WHATSAPP.xlsx`.
* Motivo: entregar los resultados de WhatsApp dentro del mismo libro operativo de negocios, contactos, giros y productos sugeridos.
* Relación: conserva el formato compatible sin hipervínculos externos ni tablas XML de las entregas corregidas anteriores.
* Resultado: ✅ generador actualizado a 26 columnas; generación y validación del libro pendientes.

## [2026-07-21]

* Archivo: `C:/Users/yarteaga/Desktop/Prospectos_Lithora3D_WHATSAPP.xlsx`
* Cambio: se creó el libro final con 1,155 negocios, 26 columnas y el estado de WhatsApp por registro.
* Motivo: entregar una base de prospección filtrable que distinga negocios con WhatsApp, sin WhatsApp y sin teléfono público.
* Relación: generado desde `local-business-prospects-whatsapp.csv` con el formato de máxima compatibilidad validado previamente.
* Resultado: ✅ libro creado y leído correctamente por OpenPyXL; validación final del paquete pendiente.

## [2026-07-21]

* Archivo: validación de `C:/Users/yarteaga/Desktop/Prospectos_Lithora3D_WHATSAPP.xlsx`
* Cambio: se comprobaron integridad ZIP, siete partes XML válidas, 1,155 filas e IDs únicos, 26 columnas, conteos de WhatsApp y ausencia de tablas, hipervínculos y relaciones externas.
* Motivo: asegurar que el libro final abra sin el aviso de reparación y represente exactamente los resultados observados en WhatsApp Web.
* Relación: validación posterior a la generación desde el catálogo cruzado por teléfono normalizado.
* Resultado: ✅ 539 negocios con WhatsApp, 413 sin WhatsApp y 203 sin teléfono; paquete OpenXML íntegro.

## [2026-07-21]

* Archivo: `audits/2026-07-21/prospecting/whatsapp-audit-state.json`
* Cambio: se añadieron nueve comprobaciones corregidas para teléfonos locales de siete dígitos y números con el antiguo prefijo móvil `1`; tres números corregidos ya tenían evidencia por otro registro duplicado.
* Motivo: evitar que formatos locales o heredados se interpretaran como números de otro país o como consultas incompletas.
* Relación: revisión de calidad posterior al barrido de 930 claves originales mediante el buscador Nuevo chat.
* Resultado: ✅ los 12 casos especiales quedaron cubiertos en formato mexicano completo; dos correcciones con WhatsApp y diez sin WhatsApp, sin alterar el total agregado observado.

## [2026-07-21]

* Archivo: `scripts/build-whatsapp-audit-console.py`
* Cambio: se amplió la normalización para convertir números locales de siete dígitos a `52 833` y retirar el prefijo móvil heredado `1` antes de anteponer `52`.
* Motivo: asegurar que futuras ejecuciones del auditor consulten todos los teléfonos en formato mexicano completo.
* Relación: incorpora al generador la corrección validada manualmente en los 12 casos especiales.
* Resultado: ✅ normalización del script de consola corregida; regeneración pendiente.

## [2026-07-21]

* Archivo: `scripts/apply-whatsapp-audit.py`
* Cambio: se alineó la normalización del cruce final con los formatos locales de siete dígitos y el antiguo prefijo móvil `1`.
* Motivo: hacer que los 12 registros especiales consuman la evidencia corregida en lugar de las consultas provisionales originales.
* Relación: replica exactamente la regla incorporada al generador del auditor de consola.
* Resultado: ✅ integrador corregido; regeneración del CSV final pendiente.

## [2026-07-21]

* Archivo: `audits/2026-07-21/prospecting/whatsapp-audit-console.js`, `C:/Users/yarteaga/Desktop/WhatsApp_Auditor_Lithora.js`
* Cambio: se regeneraron ambas copias con normalización mexicana completa; el conjunto canónico quedó en 927 números únicos porque tres formatos especiales coincidían con teléfonos ya presentes.
* Motivo: dejar el script reutilizable sin consultas duplicadas ni números locales incompletos.
* Relación: reemplaza la versión de 930 claves provisionales conservando los mismos 952 registros comerciales.
* Resultado: ✅ scripts corregidos y regenerados; validación sintáctica pendiente.

## [2026-07-21]

* Archivo: `audits/2026-07-21/prospecting/local-business-prospects-whatsapp.csv`
* Cambio: se regeneró el catálogo con los 12 teléfonos especiales normalizados al formato mexicano completo.
* Motivo: reemplazar claves provisionales locales o con prefijo heredado por los resultados corregidos de WhatsApp Web.
* Relación: usa el estado actualizado y la nueva regla de `scripts/apply-whatsapp-audit.py`.
* Resultado: ✅ se mantienen 539 negocios con WhatsApp, 413 sin WhatsApp y 203 sin teléfono, ahora sin formatos incompletos entre los registros verificados.

## [2026-07-21]

* Archivo: `C:/Users/yarteaga/Desktop/Prospectos_Lithora3D_WHATSAPP.xlsx`
* Cambio: se regeneró el libro final después de normalizar y revalidar los 12 formatos telefónicos especiales.
* Motivo: asegurar que el Excel entregue números mexicanos completos y resultados definitivos en todos los registros con teléfono.
* Relación: reemplaza la primera generación del mismo archivo sin modificar la estructura de 1,155 filas y 26 columnas.
* Resultado: ✅ libro corregido y leído correctamente por OpenPyXL; validación final pendiente.

## [2026-07-21]

* Archivo: validación final del auditor y `C:/Users/yarteaga/Desktop/Prospectos_Lithora3D_WHATSAPP.xlsx`
* Cambio: se verificaron sintaxis JavaScript, copias SHA-256 idénticas, teléfonos normalizados a 12 dígitos, integridad ZIP/XML, 1,155 IDs únicos y ausencia de estructuras externas problemáticas.
* Motivo: cerrar la entrega después de la corrección de formatos especiales y confirmar tanto la reutilización del script como la compatibilidad del Excel.
* Relación: validación integral de los artefactos regenerados en los cambios anteriores.
* Resultado: ✅ 927 teléfonos canónicos cubiertos para 952 registros con teléfono; 539 negocios con WhatsApp, 413 sin WhatsApp y 203 sin teléfono; cero errores estructurales.

## [2026-07-21]

## [2026-07-21]

* Archivo: scripts/build-sector-image-prompts.py
* Cambio: creación de un generador de prompts comerciales para los 16 giros encontrados, con cuatro modelos de producto diferenciados por giro (64 conceptos en total)
* Motivo: abrir un chat independiente por giro y solicitar imágenes capaces de comunicar de inmediato la visión, utilidad y deseo de compra para cada tipo de negocio
* Relación: reutiliza los 16 giros consolidados en el catálogo final de prospectos y el lenguaje visual observado en la conversación de campaña de Lithora3D
* Resultado: ✅ generador creado; ejecución y validación pendientes

## [2026-07-21]

* Archivo: audits/2026-07-21/prospecting/sector-image-prompts.json
* Cambio: generación de 16 prompts finales, uno por giro, con cuatro conceptos de imagen individuales en cada prompt
* Motivo: disponer de instrucciones listas para enviarse en chats separados de ChatGPT sin perder consistencia comercial ni visual
* Relación: generado por scripts/build-sector-image-prompts.py
* Resultado: ✅ 16 giros y 64 imágenes solicitadas

## [2026-07-21]

* Archivo: ChatGPT — https://chatgpt.com/c/6a5ff4a5-fa0c-83e8-ba73-41a42bef78bf
* Cambio: creación del chat independiente «Ideas impresas para cafeterías» y generación de cuatro imágenes separadas para letrero, portamenú QR, mascota y llaveros
* Motivo: presentar a cafeterías cuatro oportunidades visuales de producto personalizable con intención comercial inmediata
* Relación: prompt 1 de audits/2026-07-21/prospecting/sector-image-prompts.json
* Resultado: ✅ cuatro archivos de imagen distintos verificados mediante DevTools

## [2026-07-21]

* Archivo: scripts/build-sector-image-prompts.py
* Cambio: ajuste de la plantilla para crear un único anuncio de apertura y tres fotografías independientes de ideas de producto; se prohibieron marcas reales o ficticias y se estableció «TU MARCA» como único marcador comercial
* Motivo: convertir la secuencia en material directo para WhatsApp: primero vende la visión y después muestra posibilidades concretas sin repetir anuncios ni introducir marcas ajenas
* Relación: mejora el generador inicial después de revisar visualmente las cuatro imágenes de Cafeterías con el usuario
* Resultado: ✅ plantilla corregida; regeneración de prompts y nueva prueba pendientes

## [2026-07-21]

* Archivo: audits/2026-07-21/prospecting/sector-image-prompts.json
* Cambio: regeneración de los 16 prompts con la secuencia comercial 1 anuncio + 3 ideas de producto y la regla universal «TU MARCA»
* Motivo: aplicar la dirección creativa corregida a los 64 entregables antes de continuar creando chats
* Relación: salida actualizada de scripts/build-sector-image-prompts.py
* Resultado: ✅ 16 prompts regenerados; ningún segundo chat había sido enviado durante la interrupción

## [2026-07-21]

* Archivo: ChatGPT — https://chatgpt.com/c/6a5ff4a5-fa0c-83e8-ba73-41a42bef78bf
* Cambio: envío de una corrección para conservar el anuncio principal de Cafeterías y regenerar solo portamenú, mascota y llaveros como fotografías de producto sin publicidad; se exigió «TU MARCA» como único marcador
* Motivo: adaptar la secuencia al envío comercial real planteado por el usuario sin perder la primera imagen aprobada
* Relación: reemplaza conceptualmente las imágenes 2–4 del primer resultado, manteniendo intacta la imagen 1
* Resultado: ⚠️ instrucción enviada mediante DevTools; generación en curso

## [2026-07-21]

* Archivo: ChatGPT — https://chatgpt.com/c/6a5ff4a5-fa0c-83e8-ba73-41a42bef78bf
* Cambio: verificación de la regeneración corregida de Cafeterías
* Motivo: confirmar que la secuencia final conserva un anuncio principal y añade tres ideas de producto separadas
* Relación: cierre de la instrucción correctiva enviada en el registro anterior
* Resultado: ✅ siete archivos distintos en el chat: cuatro originales y tres nuevas fotografías; la generación terminó sin respuesta activa

## [2026-07-21]

* Archivo: chats ChatGPT de Veterinarias, Dentistas, Barberías y Transporte
* Cambio: creación y envío de cuatro prompts corregidos en chats independientes mediante Chrome DevTools
* Motivo: continuar la matriz comercial con un anuncio de apertura y tres ideas de producto por giro, usando exclusivamente «TU MARCA»
* Relación: prompts 2–5 de audits/2026-07-21/prospecting/sector-image-prompts.json; URLs 6a5ff54b, 6a5ff6db, 6a5ff6e7 y 6a5ff6ee
* Resultado: ⚠️ cuatro chats creados; generación y control visual pendientes

## [2026-07-21]

* Archivo: chats ChatGPT de Veterinarias, Dentistas, Barberías y Transporte
* Cambio: revisión posterior de persistencia de los cuatro envíos ejecutados en paralelo
* Motivo: comprobar que salir de cada conversación durante la generación no hubiera cancelado el contenido
* Relación: corrige el resultado provisional del registro inmediatamente anterior
* Resultado: ❌ los cuatro chats quedaron vacíos al navegar antes de que el mensaje se consolidara; no se reutilizará el envío paralelo y los giros deberán procesarse secuencialmente

## [2026-07-21]

* Archivo: scripts/build-sector-image-prompts.py
* Cambio: separación de cada giro en dos prompts secuenciales: primero un único anuncio validable y después tres fotografías de ideas de producto
* Motivo: evitar que el generador herede el formato publicitario del anuncio en las otras tres piezas y permitir control de calidad antes de continuar
* Relación: reemplaza el intento de solicitar las cuatro imágenes dentro de una misma instrucción; mantiene «TU MARCA» como único marcador comercial
* Resultado: ✅ flujo bifásico implementado; regeneración y prueba pendientes

## [2026-07-21]

* Archivo: audits/2026-07-21/prospecting/sector-image-prompts.json
* Cambio: regeneración de los 16 registros con campos separados prompt_anuncio y prompt_ideas
* Motivo: hacer ejecutable y auditable el nuevo flujo de una imagen seguida de tres productos
* Relación: salida del generador bifásico actualizado
* Resultado: ✅ 16 anuncios y 16 instrucciones posteriores para 48 ideas listos

## [2026-07-21]

* Archivo: ChatGPT — https://chatgpt.com/c/6a5ff87c-a928-83e8-bf43-62f80734710a
* Cambio: creación y revisión visual del nuevo anuncio único de control para Cafeterías
* Motivo: validar el primer paso del flujo bifásico antes de generar los otros 15 giros
* Relación: usa prompt_anuncio del primer registro; evidencia en audits/2026-07-21/prospecting/cafeterias-anuncio-control.png
* Resultado: ✅ una imagen panorámica con giro, Lithora3D, contacto y producto «TU MARCA»; el contenido visual cumple aunque la interfaz mostró un aviso técnico al cerrar la generación

## [2026-07-21]

* Archivo: 16 chats y capturas anuncio-*.png en audits/2026-07-21/prospecting
* Cambio: generación paralela y revisión visual individual de un anuncio de apertura para cada giro
* Motivo: confirmar la primera imagen antes de solicitar las ideas de producto, según el flujo corregido
* Relación: chats independientes en las pestañas 7–37 del perfil persistente; conserva el patrón validado de Cafeterías
* Resultado: ✅ 16 anuncios panorámicos visibles, un producto protagonista por giro, identidad Lithora3D, contacto y marcador «TU MARCA»; evidencia capturada para cada giro

## [2026-07-21]

* Archivo: scripts/build-sector-image-prompts.py
* Cambio: incorporación de evidencia visual obligatoria de fabricación aditiva: escala de sobremesa, base física, material PLA/PETG, estratos FDM, espesores, ensambles y simplificación imprimible
* Motivo: evitar resultados como el tráiler que se perciben como objetos reales a tamaño completo en lugar de modelos fabricables en impresión 3D
* Relación: corrige la revisión anterior que aprobó composición comercial pero no distinguió suficientemente realismo fotográfico de plausibilidad de fabricación
* Resultado: ✅ reglas reforzadas para anuncios y fotografías de ideas; regeneración y corrección de chats afectados pendientes

## [2026-07-21]

* Archivo: audits/2026-07-21/prospecting/sector-image-prompts.json
* Cambio: regeneración de los 32 prompts bifásicos con criterios explícitos de escala y apariencia FDM
* Motivo: propagar la corrección de plausibilidad a los 16 giros antes de nuevas generaciones
* Relación: salida actualizada de scripts/build-sector-image-prompts.py
* Resultado: ✅ catálogo de prompts corregido

## [2026-07-21]

* Archivo: ChatGPT — Transporte y logística, https://chatgpt.com/c/6a5ff915-3e20-83e8-84e6-fd7911ce80f6
* Cambio: solicitud de regeneración exclusiva del anuncio con miniatura de tráiler de 15 cm sobre peana, material FDM visible, detalles simplificados y referencia de escala
* Motivo: la primera versión parecía un tráiler real a tamaño completo y no demostraba un producto fabricable por Lithora3D
* Relación: aplica la nueva regla de plausibilidad incorporada al generador; conserva «TU MARCA» como único marcador
* Resultado: ⚠️ corrección enviada mediante DevTools; generación en curso

## [2026-07-21]

* Archivo: C:/Users/yarteaga/.codex/scripts/start-chrome-devtools-mcp.cmd
* Cambio: se añadieron `--restore-last-session` y `--disable-session-crashed-bubble` al arranque del Chrome DevTools persistente
* Motivo: el perfil correcto volvió a abrirse con una sola pestaña después de que el proceso anterior muriera, en vez de restaurar automáticamente los chats abiertos
* Relación: conserva el perfil dedicado `.codex/chrome-devtools-profile`, el puerto 9224 y el lanzador MCP previamente validados
* Resultado: ✅ lanzador corregido; reinicio controlado y validación pendientes

## [2026-07-21]

* Archivo: perfil persistente de Chrome DevTools
* Cambio: se validó que la instancia del puerto 9224 conserva la sesión Plus, el historial completo de ChatGPT y los 16 chats de campaña; se reabrieron las 16 conversaciones en pestañas independientes
* Motivo: reconstruir la última sesión después del cierre del proceso anterior y comprobar que no se estaba usando un perfil temporal
* Relación: usa `C:/Users/yarteaga/.codex/chrome-devtools-profile` y el lanzador corregido con restauración automática
* Resultado: ✅ 18 pestañas visibles mediante DevTools: nueva pestaña, inicio de ChatGPT y 16 chats recuperados

## [2026-07-21]

* Archivo: ChatGPT — Transporte y logística, https://chatgpt.com/c/6a5ff915-3e20-83e8-84e6-fd7911ce80f6
* Cambio: validación visual de la regeneración y cierre operativo de la pestaña
* Motivo: confirmar que la pieza ahora se percibe como miniatura FDM fabricable antes de liberar recursos del navegador
* Relación: evidencia en audits/2026-07-21/prospecting/transporte-miniatura-corregida.png
* Resultado: ✅ miniatura sobre peana con regla de escala, estratos visibles y «TU MARCA»; chat completo

## [2026-07-21]

* Archivo: chats finales de Cafeterías, Veterinarias, Dentistas y Barberías
* Cambio: revisión visual de las tres ideas de producto posteriores al anuncio y cierre de sus pestañas
* Motivo: confirmar piezas independientes sin formato publicitario antes de liberar cada pestaña, según la instrucción operativa del usuario
* Relación: evidencias ideas-*-final.png en audits/2026-07-21/prospecting
* Resultado: ✅ doce ideas visibles con «TU MARCA», fondos de producto, escala y apariencia fabricable; cuatro chats completos

## [2026-07-21]

* Archivo: ChatGPT — Hamburgueserías, https://chatgpt.com/c/6a5ff922-1fd8-83e8-97cf-621f760966bb
* Cambio: generación y revisión de tres ideas de producto FDM posteriores al anuncio; cierre de pestaña
* Motivo: completar el giro con fotografías separadas y liberar la pestaña al terminar
* Relación: evidencia ideas-hamburgueserias-final.png
* Resultado: ✅ portamenú QR, mascota y señalización de pedidos visibles, sin formato de anuncio y con «TU MARCA»

## [2026-07-21]

* Archivo: ChatGPT — Talleres mecánicos, https://chatgpt.com/c/6a5ff93b-07fc-83e8-8ea6-b56f76bbf468
* Cambio: recuperación, revisión de tres ideas y cierre de pestaña
* Motivo: continuar secuencialmente después del cierre de pestañas provocado por la carga paralela
* Relación: evidencia ideas-talleres-final.png
* Resultado: ✅ letrero, identificadores y porta QR generados como piezas de producto con «TU MARCA»

## [2026-07-21]

* Archivo: chats finales de Pastelerías, Gimnasios, Escuelas, Eventos, Arquitectura, Pizzerías, Restaurantes, Hoteles y Agencias
* Cambio: verificación secuencial de la segunda fase, corrección de envíos incompletos en los últimos tres giros, captura de evidencia y cierre de la pestaña de trabajo
* Motivo: completar los 16 giros sin mantener pestañas desocupadas ni volver a saturar Chrome con generaciones paralelas
* Relación: evidencias ideas-*-final.png en audits/2026-07-21/prospecting; usa prompts con escala FDM y «TU MARCA»
* Resultado: ✅ los nueve chats contienen anuncio y tres ideas; ChatGPT mostró al final una limitación temporal por exceso de solicitudes durante la auditoría, sin borrar los archivos ya generados

## [2026-07-21]

* Archivo: C:/Users/yarteaga/Documents/Personal/Negocios/Clientes/IMG-productos
* Cambio: creación del directorio de entrega y 16 subcarpetas numeradas, una por giro
* Motivo: ordenar el anuncio y las tres ideas finales de cada segmento antes de descargarlas
* Relación: corresponde a los 16 chats de campaña validados mediante Chrome DevTools
* Resultado: ✅ estructura de carpetas creada; descarga de imágenes pendiente

## [2026-07-21]

* Archivo: C:/Users/yarteaga/Documents/Personal/Negocios/Clientes/IMG-productos/01-Cafeterias
* Cambio: descarga y renombrado del anuncio aprobado y las tres ideas finales de Cafeterías
* Motivo: iniciar la entrega ordenada de PNG originales desde el chat autenticado
* Relación: se seleccionó el anuncio panorámico y las últimas tres imágenes 4:3, excluyendo intentos anteriores
* Resultado: ✅ cuatro PNG guardados, entre 0.89 MB y 1.70 MB

* Archivo: configuracion profesional de contacto de Instagram
* Cambio: se registro el telefono oficial `+52 833 108 0178`, se habilito mostrar informacion de contacto y se configuro `Texto` como metodo principal en lugar de llamada.
* Motivo: facilitar cotizaciones desde la aplicacion y mantener coherencia con el canal comercial aprobado.
* Relacion: complementa la biografia que invita a cotizar por WhatsApp y el mismo telefono publicado en web y Facebook.
* Resultado: ✅ telefono y contacto por texto guardados; los botones son visibles exclusivamente en la aplicacion movil por restriccion explicita de Instagram. El enlace de sitio web tambien solo puede editarse desde la aplicacion movil y la vinculacion nativa de WhatsApp requiere completar la confirmacion del numero fuera del navegador.

## [2026-07-21]

* Archivo: C:/Users/yarteaga/Downloads (cuatro descargas temporales de Dentistas)
* Cambio: eliminacion de un anuncio temporal y tres copias repetidas de una misma idea, antes de incorporarlas a la entrega
* Motivo: el primer selector recorrio nodos DOM duplicados de ChatGPT; se corrigio para deduplicar por URL de imagen
* Relacion: mejora el criterio usado en la descarga inicial de Cafeterias y evita entregar ideas repetidas
* Resultado: ✅ temporales incorrectos eliminados; carpeta 03-Dentistas permanece intacta y pendiente de descarga corregida

## [2026-07-21]

* Archivo: C:/Users/yarteaga/Documents/Personal/Negocios/Clientes/IMG-productos/03-Dentistas
* Cambio: descarga corregida del anuncio panoramico y las tres ideas finales, deduplicadas por URL y guardadas desde las respuestas de red inspeccionadas
* Motivo: Chrome bloqueo las descargas automaticas multiples; DevTools permitio conservar los cuatro PNG originales sin recargar ni repetir conceptos
* Relacion: corrige el intento temporal fallido registrado inmediatamente antes
* Resultado: ✅ cuatro PNG unicos guardados (un anuncio 2172x724 y tres ideas 1200x900)

## [2026-07-21]

* Archivo: C:/Users/yarteaga/Documents/Personal/Negocios/Clientes/IMG-productos/04-Barberias
* Cambio: descarga del anuncio final y los tres archivos de producto numerados 01, 02 y 03 desde las respuestas de imagen de ChatGPT
* Motivo: conservar las tres ideas aprobadas en el orden solicitado, evitando variantes anteriores visibles en el DOM
* Relacion: aplica el metodo de red validado en Dentistas
* Resultado: ✅ cuatro PNG originales guardados y ordenados

## [2026-07-21]

* Archivo: C:/Users/yarteaga/Documents/Personal/Negocios/Clientes/IMG-productos/11-Eventos
* Cambio: descarga del anuncio abierto en vista completa y de los tres adjuntos finales nombrados por producto
* Motivo: el DOM mostraba seis previsualizaciones 4:3 adicionales; los adjuntos numerados identificaron sin ambiguedad las tres ideas aprobadas
* Relacion: mejora el selector automatico para chats cuya respuesta incluye previsualizaciones intermedias
* Resultado: ✅ anuncio 2172x724 y tres ideas 1200x900 guardados

## [2026-07-21]

* Archivo: C:/Users/yarteaga/Documents/Personal/Negocios/Clientes/IMG-productos/12-Arquitectura-inmobiliarias
* Cambio: descarga del anuncio panoramico y los tres adjuntos finales de arquitectura
* Motivo: ordenar miniatura de propiedad, display de sala de ventas y llavero de unidad como ideas individuales
* Relacion: se priorizaron los adjuntos con nombre final sobre las previsualizaciones repetidas
* Resultado: ✅ cuatro PNG originales guardados

## [2026-07-21]

* Archivo: C:/Users/yarteaga/Documents/Personal/Negocios/Clientes/IMG-productos/02-Veterinarias
* Cambio: reemplazo del lote inicial defectuoso por el anuncio original y los tres adjuntos finales nombrados
* Motivo: la auditoria local detecto un archivo invalido y dos anuncios duplicados donde debian estar ideas
* Relacion: corrige la descarga parcial realizada antes del metodo de respuestas de red
* Resultado: ✅ cuatro PNG validos y unicos guardados (2172x724, 1600x1200, 1200x1200 y 1600x1200)

## [2026-07-21]

* Archivo: C:/Users/yarteaga/Documents/Personal/Negocios/Clientes/IMG-productos/12-Arquitectura-inmobiliarias/_respaldo-2026-07-21
* Cambio: respaldo del anuncio y la idea 1 originales antes de sustituirlos
* Motivo: ambas imagenes parecian maquetas profesionales demasiado realistas y poco representativas de una pieza FDM fabricable
* Relacion: conserva reversibilidad respecto al lote original de Arquitectura e inmobiliarias
* Resultado: ✅ dos PNG anteriores respaldados

## [2026-07-21]

* Archivo: C:/Users/yarteaga/Documents/Personal/Negocios/Clientes/IMG-productos/12-Arquitectura-inmobiliarias/01-anuncio.png y 02-idea-1.png
* Cambio: sustitucion por versiones con una sola vivienda simplificada, base monolitica, maximo tres colores, escala visible y textura FDM
* Motivo: comunicar con honestidad una pieza de sobremesa realmente fabricable, sin vegetacion, automovil, vidrio, interiores ni urbanizacion completa
* Relacion: reemplaza las dos versiones señaladas como irreales; las originales permanecen en _respaldo-2026-07-21
* Resultado: ✅ anuncio 2172x724 e idea 1 1448x1086 validados; las ideas 2 y 3 permanecen sin cambios

## [2026-07-21]

* Archivo: C:/Users/yarteaga/Documents/Personal/Negocios/Clientes/IMG-productos/12-Arquitectura-inmobiliarias/_respaldo-2026-07-21/02-idea-1-repetida-con-anuncio.png
* Cambio: respaldo de la primera correccion de idea 1
* Motivo: aunque era fabricable, repetia visualmente la misma vivienda usada como producto heroe del anuncio
* Relacion: segunda correccion del paquete de Arquitectura para aportar variedad real de productos
* Resultado: ✅ version repetida respaldada antes de sustituirla

## [2026-07-21]

* Archivo: C:/Users/yarteaga/Documents/Personal/Negocios/Clientes/IMG-productos/12-Arquitectura-inmobiliarias/02-idea-1.png
* Cambio: reemplazo de la vivienda repetida por un plano topografico 3D modular con curvas de nivel y cuatro prismas removibles
* Motivo: diferenciar inequívocamente la idea 1 del producto heroe del anuncio y ampliar el catalogo visual
* Relacion: responde a la observacion de que anuncio e idea 1 mostraban exactamente el mismo producto
* Resultado: ✅ nueva idea 1 1448x1086 validada; cero casas, cuatro bloques abstractos, conectores visibles y escala FDM clara

## [2026-07-21]

* Archivo: C:/Users/yarteaga/Documents/Personal/Negocios/Clientes/IMG-productos y C:/Users/yarteaga/Downloads/976ad292-f6bb-49aa-b029-43fcf1d1a9e7.png
* Cambio: auditoria final de firmas, dimensiones, conteos y hashes; eliminacion de la descarga temporal de prueba de Cafeterias
* Motivo: asegurar una entrega limpia, completa y sin duplicados ni archivos auxiliares
* Relacion: valida todos los lotes descargados en esta sesion
* Resultado: ✅ 16 carpetas, 64 PNG validos, cuatro por giro, cero duplicados binarios, cero auxiliares y 105171562 bytes totales

## [2026-07-21]

* Archivo: C:/Users/yarteaga/Documents/Personal/Negocios/Clientes/IMG-productos/16-Agencias-publicidad
* Cambio: descarga del anuncio panoramico y las tres ideas finales de producto
* Motivo: completar el ultimo giro de la coleccion comercial
* Relacion: mismo orden final validado para Restaurantes y Hoteles
* Resultado: ✅ cuatro PNG originales guardados

## [2026-07-21]

* Archivo: C:/Users/yarteaga/Documents/Personal/Negocios/Clientes/IMG-productos/15-Hoteles
* Cambio: descarga del anuncio y las tres ideas finales para hoteleria
* Motivo: completar el paquete visual del giro Hoteles con archivos individuales
* Relacion: uso del orden original del chat tras liberar la limitacion temporal de lectura
* Resultado: ✅ cuatro PNG originales guardados

## [2026-07-21]

* Archivo: C:/Users/yarteaga/Documents/Personal/Negocios/Clientes/IMG-productos/14-Restaurantes
* Cambio: descarga del anuncio panoramico y las tres imagenes individuales finales de producto
* Motivo: completar el paquete comercial para Restaurantes sin marcos publicitarios en las ideas
* Relacion: seleccion por orden del anuncio y la respuesta final del chat
* Resultado: ✅ cuatro PNG originales guardados

## [2026-07-21]

* Archivo: C:/Users/yarteaga/Documents/Personal/Negocios/Clientes/IMG-productos/13-Pizzerias
* Cambio: descarga del anuncio y los adjuntos finales de portamenu QR, mascota coleccionable e identificadores
* Motivo: completar el paquete visual del giro Pizzerias
* Relacion: conserva el anuncio panoramico y las tres ideas nombradas por la respuesta final
* Resultado: ✅ cuatro PNG originales guardados

## [2026-07-21]

* Archivo: C:/Users/yarteaga/Documents/Personal/Negocios/Clientes/IMG-productos/05-Transporte-logistica
* Cambio: descarga de la correccion panoramica realista y las tres ideas de producto 4:3
* Motivo: excluir el primer anuncio de trailer que habia sido rechazado por parecer poco fabricable
* Relacion: se eligio el ultimo anuncio panoramico del chat y las tres ideas aprobadas
* Resultado: ✅ cuatro PNG finales guardados; la variante rechazada no se incluyo

## [2026-07-21]

* Archivo: carpetas 06-Hamburgueserias, 07-Talleres-mecanicos, 08-Pastelerias-reposteria y 09-Gimnasios en IMG-productos
* Cambio: descarga y ordenamiento del ultimo anuncio panoramico y las ultimas tres ideas 4:3 unicas de cada giro
* Motivo: completar el siguiente lote con el criterio visual ya validado
* Relacion: continua el metodo de inspeccion de DOM y respuestas de red usado desde Dentistas
* Resultado: ✅ 16 PNG originales guardados, cuatro por carpeta

## [2026-07-21]

* Archivo: C:/Users/yarteaga/Documents/Personal/Negocios/Clientes/IMG-productos/10-Escuelas-colegios
* Cambio: descarga del anuncio escolar y sus tres ideas finales 4:3
* Motivo: incorporar el giro educativo manteniendo un producto por archivo
* Relacion: mismo criterio de seleccion final aplicado a los lotes anteriores
* Resultado: ✅ cuatro PNG originales guardados y ordenados
## [2026-07-22]

* Archivo: assets/quote-page.css
* Cambio: nueva jerarquia visual de la pagina de cotizacion con columna de animacion mas ancha, texto secundario compacto y centrado, escenario de impresion notablemente mayor y panel del formulario en azul pizarra
* Motivo: la captura de produccion mostraba que el titular competia con la animacion y que el marco del formulario no empataba con la paleta Lithora
* Relacion: mejora el primer despliegue de /cotizar/ sin alterar el formulario ni la transicion ya validados
* Resultado: ✅ composicion reequilibrada; pendiente validacion visual y ajuste del tema interno de Tally
## [2026-07-22]

* Archivo: tests/home-quote.test.mjs
* Cambio: actualizacion del contrato de pruebas para exigir la nueva proporcion de columnas y la escala protagonista del escenario animado
* Motivo: evitar regresiones hacia la composicion anterior donde el timelapse quedaba visualmente relegado
* Relacion: valida el reajuste inmediato de assets/quote-page.css
* Resultado: ✅ prueba estatica actualizada
## [2026-07-22]

* Archivo: formulario Tally ODeE7a (configuracion externa)
* Cambio: tema publicado con fondo #0B1728, texto #F8FAFC, boton #0369A1 y acento #38BDF8
* Motivo: eliminar el negro calido #1A1917 que contrastaba con la paleta azul de la pagina de cotizacion
* Relacion: completa el ajuste visual de assets/quote-page.css desde la fuente del iframe
* Resultado: ✅ DevTools confirmo en https://tally.so/embed/ODeE7a el fondo publicado rgb(11, 23, 40)
## [2026-07-22]

* Archivo: cotizar/index.html
* Cambio: versionado del enlace a quote-page.css con v=20260722-2
* Motivo: GitHub Pages completo el despliegue #19, pero DevTools comprobo que el dominio personalizado seguia sirviendo la hoja anterior desde cache
* Relacion: hace efectivo en produccion el reequilibrio visual del commit d453ef4
* Resultado: ✅ invalidacion de cache preparada
## [2026-07-22]

* Archivo: cotizar/index.html
* Cambio: eliminacion completa del titular, descripcion, etiqueta del escenario y lista de ventajas de la columna izquierda
* Motivo: dejar exclusivamente la animacion como protagonista, segun la nueva indicacion visual
* Relacion: sustituye la jerarquia con texto compacto preparada en el ajuste anterior
* Resultado: ✅ columna izquierda reducida a la animacion accesible
## [2026-07-22]

* Archivo: cotizar/index.html
* Cambio: restauracion del texto introductorio como contenido disponible para la vista movil
* Motivo: el usuario aclaro que la eliminacion de texto aplica unicamente en PC
* Relacion: acota la eliminacion completa registrada inmediatamente antes; CSS controla ahora su visibilidad por breakpoint
* Resultado: ✅ texto recuperado sin volver a mostrarlo en escritorio
## [2026-07-22]

* Archivo: assets/quote-page.css
* Cambio: escenario de escritorio sin borde, fondo, radio, sombra ni degradado contenedor; animacion ampliada a 72vh y texto oculto solo sobre 880px, conservado en movil
* Motivo: hacer de la animacion el unico protagonista visual en PC sin perder la explicacion solicitada para telefonos
* Relacion: refina la composicion centrada y corrige el alcance tras la aclaracion del usuario
* Resultado: ✅ tratamiento responsive diferenciado preparado
## [2026-07-22]

* Archivo: tests/home-quote.test.mjs
* Cambio: contrato responsive para exigir animacion sin tarjeta ni etiqueta en PC y texto introductorio visible en movil
* Motivo: proteger exactamente la diferencia desktop/movil solicitada en la ultima aclaracion
* Relacion: reemplaza las aserciones de la tarjeta visual anterior
* Resultado: ✅ cobertura actualizada
## [2026-07-22]

* Archivo: cotizar/index.html
* Cambio: avance de version de quote-page.css a v=20260722-3
* Motivo: evitar que la nueva variante sin contenedor reutilice el CSS intermedio almacenado por el CDN
* Relacion: continua la invalidacion de cache detectada con DevTools en el despliegue previo
* Resultado: ✅ version final diferenciada
## [2026-07-22]

* Archivo: assets/quote-page.css
* Cambio: recorte interno invisible del escenario solamente bajo 880px
* Motivo: la validacion DevTools detecto 36px de desbordamiento horizontal movil causado por la cuadricula animada ampliada
* Relacion: conserva el aspecto sin contenedor y el texto movil, evitando scroll lateral
* Resultado: ✅ correccion responsive aplicada
## [2026-07-22]

* Archivo: assets/quote-page.css
* Cambio: fondo azul pizarra #0B1728 aplicado directamente al iframe de Tally
* Motivo: DevTools confirmo que el iframe conserva 1200px mientras el contenido interno termina antes; su lienzo transparente mostraba una franja blanca en el espacio sobrante
* Relacion: usa el mismo color publicado en el tema Tally y en quote-form-frame, sin recortar campos ni alterar el formulario
* Resultado: ✅ respaldo cromatico aplicado al area vacia del iframe
## [2026-07-22]

* Archivo: cotizar/index.html
* Cambio: versionado de quote-page.css actualizado a v=20260722-4
* Motivo: forzar que el dominio y el navegador carguen inmediatamente la correccion de la franja blanca
* Relacion: continua el mecanismo de invalidacion de cache ya validado para /cotizar/
* Resultado: ✅ nueva version de estilos referenciada
## [2026-07-22]

* Archivo: tests/home-quote.test.mjs
* Cambio: asercion del fondo azul de respaldo en el iframe de cotizacion
* Motivo: impedir que una futura regresion a fondo transparente reactive la franja blanca inferior
* Relacion: cubre la correccion de assets/quote-page.css
* Resultado: ✅ contrato de regresion agregado
## [2026-07-22]

* Archivo: cotizar/index.html
* Cambio: activacion de transparentBackground=1 en src y data-tally-src del embed Tally
* Motivo: el lienzo raiz opaco de Tally seguia pintando blanco el espacio posterior al contenido; DevTools confirmo que el modo transparente vuelve root, body y tally-app transparentes y conserva el texto #F8FAFC
* Relacion: trabaja con el fondo #0B1728 aplicado al iframe para mantener contraste uniforme en todo el alto
* Resultado: ✅ causa interna de la franja neutralizada sin recortar el formulario
## [2026-07-22]

* Archivo: cotizar/index.html
* Cambio: eliminacion del src precargado y conservacion exclusiva de data-tally-src opaco para que widgets/embed.js inicialice el iframe
* Motivo: DevTools demostro que el src previo hacia que Tally omitiera su dimensionamiento; al dejarlo al cargador oficial, el iframe recibio height 1143.5px segun su contenido real
* Relacion: reemplaza la prueba transparentBackground, que eliminaba el tema oscuro y reducia la legibilidad
* Resultado: ✅ inicializacion dinamica de Tally habilitada
## [2026-07-22]

* Archivo: assets/quote-page.css
* Cambio: retiro de los min-height 1200px y 1220px que anulaban la altura dinamica de Tally, conservando #0B1728 como fondo de carga
* Motivo: permitir que iframe-resizer aplique el alto exacto comunicado por el formulario en escritorio y movil
* Relacion: completa el cambio de cotizar/index.html hacia inicializacion mediante data-tally-src
* Resultado: ✅ bloqueo CSS del redimensionamiento eliminado
## [2026-07-22]

* Archivo: tests/home-quote.test.mjs
* Cambio: pruebas para exigir data-tally-src sin src precargado, dynamicHeight y min-height cero con fondo de respaldo
* Motivo: proteger el redimensionamiento real que elimina la franja blanca
* Relacion: reemplaza la cobertura limitada al color del iframe
* Resultado: ✅ contrato de integracion dinamica agregado
## [2026-07-22]

* Archivo: cotizar/index.html
* Cambio: reemplazo directo de la escena CSS de impresora por video_cotizacion.mp4 dentro del mismo slot izquierdo de la pantalla de cotizacion; version de estilos elevada a v=20260722-5
* Motivo: usar el video entregado por el usuario exactamente donde aparecia la animacion azul actual
* Relacion: sustituye el placeholder data-animation-slot sin modificar el formulario Tally de la derecha
* Resultado: ✅ elemento video integrado con autoplay silencioso, loop, playsinline y carga de metadatos; estilos visuales pendientes
## [2026-07-22]

* Archivo: assets/quote-page.css
* Cambio: tratamiento premium del video con escala protagonista, mascara radial para disolver los cuatro bordes, halo ambiental azul/dorado, correccion tonal, entrada con desenfoque, respiracion lenta y barrido luminoso sutil
* Motivo: integrar el MP4 sin apariencia de tarjeta ni bordes rectangulares y reemplazar visualmente la escena CSS anterior
* Relacion: estiliza quote-process-video agregado en cotizar/index.html y conserva prefers-reduced-motion
* Resultado: ✅ composicion de video preparada; validacion visual responsive pendiente
## [2026-07-22]

* Archivo: assets/quote-page.css
* Cambio: sustitucion de la mascara radial por desvanecimientos horizontal y vertical intersectados, con escala maxima reducida a 740px
* Motivo: la primera captura real del video revelo limites rectangulares visibles en el brillo superior y los laterales
* Relacion: refina el tratamiento premium del MP4 sin agregar contenedores ni bordes
* Resultado: ✅ fusion de bordes reforzada; segunda validacion visual pendiente
## [2026-07-22]

* Archivo: assets/quote-page.css
* Cambio: viñeta de fusion azul aplicada solo bajo 880px sobre las orillas verticales y horizontales del video
* Motivo: la captura movil mostro una diferencia tonal residual entre el negro profundo del MP4 y el fondo de la pagina en los limites superior e inferior
* Relacion: complementa las mascaras del video sin introducir borde, tarjeta ni recorte del contenido central
* Resultado: ✅ transicion movil de bordes reforzada
## [2026-07-22]

* Archivo: assets/quote-page.css
* Cambio: unificacion del fundido del video en una mascara eliptica 52% x 54% y retiro de la viñeta movil de color solido
* Motivo: permitir que el gradiente real de la pagina aparezca en todo el perimetro, evitando diferencias tonales por fondos aproximados
* Relacion: reemplaza los dos fundidos intersectados y la correccion movil inmediatamente anteriores
* Resultado: ✅ solucion unica de transparencia aplicada en todos los tamaños
## [2026-07-22]

* Archivo: assets/quote-video.js
* Cambio: controlador de reproduccion por visibilidad, interseccion y preferencia de movimiento reducido
* Motivo: mantener la experiencia fluida y premium sin consumir recursos cuando el video queda fuera de pantalla o la pestaña pasa a segundo plano
* Relacion: complementa autoplay muted loop del video integrado en /cotizar/
* Resultado: ✅ reproduccion progresiva y accesible implementada
## [2026-07-22]

* Archivo: cotizar/index.html
* Cambio: carga diferida del controlador local quote-video.js
* Motivo: activar pausa y reanudacion inteligente sin bloquear el render ni interferir con el cargador de Tally
* Relacion: conecta el controlador con quote-process-video
* Resultado: ✅ script enlazado antes del widget externo
## [2026-07-22]

* Archivo: tests/home-quote.test.mjs
* Cambio: cobertura del MP4 real, atributos de reproduccion, ausencia de la escena anterior, mascara sin bordes y controlador accesible de visibilidad
* Motivo: evitar regresiones que restauren el placeholder CSS o eliminen el tratamiento premium y eficiente del video
* Relacion: valida cotizar/index.html, assets/quote-page.css y assets/quote-video.js
* Resultado: ✅ contrato de integracion del video agregado
## [2026-07-22]

* Archivo: package.json
* Cambio: quote-video.js incorporado a la comprobacion sintactica npm run check
* Motivo: asegurar que el nuevo controlador de reproduccion forme parte de la validacion obligatoria del proyecto
* Relacion: completa la integracion tecnica del video de cotizacion
* Resultado: ✅ validacion sintactica ampliada
# Historial de cambios

## [2026-07-22]

* Archivo: cotizar/index.html
* Cambio: actualización del versionado de `quote-page.css` a `v=20260722-5`.
* Motivo: invalidar la caché en producción y servir inmediatamente el acabado visual del nuevo video.
* Relación: completa la sustitución de la animación CSS por `video_cotizacion.mp4`.
* Resultado: ✅ éxito

## [2026-07-22]

* Archivo: validación end-to-end en `http://127.0.0.1:8000/cotizar/`
* Cambio: envío real válido después de sustituir el callback declarativo por el listener directo de `Tally.FormSubmitted`; la máquina cambió de `ready` a `button-confirmation` solamente después de la respuesta exitosa y completó la navegación suave a inicio.
* Motivo: verificar el vínculo completo entre procesamiento real de Tally, confirmación visual, secuencia verde y destino final antes del despliegue.
* Relación: confirma la corrección implementada en `assets/quote-success.js` y el parámetro `formEventsForwarding=1` de `cotizar/index.html`.
* Resultado: ✅ éxito real confirmado con el servidor de Tally.

## [2026-07-22]

* Archivo: Tally `https://tally.so/forms/ODeE7a/submissions`
* Cambio: eliminación exclusiva de las dos solicitudes de prueba `QA Codex flujo corregido` y `QA Codex confirmar flujo` creadas durante la validación.
* Motivo: retirar datos sintéticos después de comprobar el flujo completo.
* Relación: conserva intacta la solicitud real `yohan`; el contador final de Tally quedó en 1.
* Resultado: ✅ registros QA eliminados y registro real verificado.

## [2026-07-22]

* Archivo: Google Sheets `Solicita tu cotización`, filas 3 y 4
* Cambio: eliminación de las dos filas QA sincronizadas por Tally y comprobación posterior mediante búsqueda.
* Motivo: dejar la base colaborativa sin residuos de las pruebas end-to-end.
* Relación: la búsqueda `QA Codex` quedó en 0 de 0 y `yohan` permaneció como 1 de 1 en la fila 2.
* Resultado: ✅ hoja guardada en Drive y datos reales preservados.

## [2026-07-22]

* Archivo: validación integral del proyecto
* Cambio: ejecución final de `npm run validate` después de la prueba real y de la limpieza de datos.
* Motivo: comprobar sincronización de contenido, sintaxis de ambos controladores nuevos y ausencia de regresiones en todo el sitio.
* Relación: valida la experiencia completa de confirmación y su integración con los contratos existentes.
* Resultado: ✅ 89 de 89 pruebas superadas, sin fallos ni omisiones.

## [2026-07-22]

* Archivo: inspección de llegada a `http://127.0.0.1:8000/`
* Cambio: verificación posterior al flujo real de consola, sesión, clases, scroll, bloqueo y capa de traspaso.
* Motivo: confirmar que la transición no permanece montada ni bloquea interacciones después de revelar la portada.
* Relación: audita la limpieza de `assets/quote-handoff.js` después de la navegación iniciada por `assets/quote-success.js`.
* Resultado: ✅ consola limpia, sesión eliminada, scroll en cero y capa oculta sin capturar eventos.

## [2026-07-22]

* Archivo: `audits/2026-07-22-success-performance.json.json.gz`
* Cambio: traza DevTools de la secuencia completa en viewport móvil 390 × 844, incluida la navegación y el revelado de la portada.
* Motivo: verificar estabilidad de composición y continuidad real bajo el flujo animado completo.
* Relación: mide la implementación basada en transformaciones y Web Animations de `quote-success.js` y `quote-handoff.js`.
* Resultado: ✅ CLS 0.00 durante la confirmación y CLS 0.00 al llegar a inicio; LCP local de la portada 215 ms.

## [2026-07-22]

* Archivo: despliegue GitHub Pages del commit `13debff`
* Cambio: publicación de la experiencia de confirmación en la rama `main` y seguimiento del workflow `pages-build-deployment` #24.
* Motivo: llevar la solución validada al dominio solicitado.
* Relación: publica los ocho archivos del commit `Add premium quote success experience`.
* Resultado: ✅ build, reporte y deploy completados correctamente.

## [2026-07-22]

* Archivo: `https://lithora3d.com/cotizar/?deploy=13debff`
* Cambio: inspección final de producción con DevTools en 1440 × 1000, ejecución controlada de la secuencia y verificación posterior en `https://lithora3d.com/`.
* Motivo: confirmar que el CDN sirve la versión nueva y que el traspaso funciona fuera del servidor local.
* Relación: verificó `quote-page.css?v=20260722-6`, `quote-success.js`, `quote-handoff.js`, video MP4 y el iframe Tally con `formEventsForwarding=1`.
* Resultado: ✅ recursos 200/206, consola limpia, texto exacto, estado listo, secuencia completa, sesión eliminada, scroll en cero y capa final inactiva.

## [2026-07-23]

* Archivo: `CONTEXTO_PROSPECCION_WHATSAPP.md`
* Cambio: creación de un manual de continuidad con la investigación comercial, estado de prospectos, plantilla personalizada, pregunta abierta, secuencia de envío, controles de autorización y matriz de mensajes e imágenes para los 16 giros.
* Motivo: preservar todo el contexto de la campaña si se pierde la conversación y estandarizar el envío del mensaje seguido inmediatamente por las cuatro imágenes correctas de cada giro y cliente.
* Relación: consolida el catálogo `Prospectos_Lithora3D_WHATSAPP`, los 64 PNG validados, `sector-image-prompts.json` y la corrección del cierre binario `¿Te interesaría que te muestre las opciones?`.
* Resultado: ✅ documento creado en la raíz del repositorio, sin modificar código ni enviar mensajes de WhatsApp.

## [2026-07-24]

* Archivo: perfil comercial de WhatsApp Business Web
* Cambio: se completó la descripción con impresión 3D, productos, cobertura local y envíos nacionales; se añadieron `lithora3d@gmail.com`, `https://lithora3d.com`, las categorías `Servicio de impresión`, `Servicio local` y `Servicio empresarial`, y la nota de atención en Tampico, Ciudad Madero y Altamira. Se retiró el radio público de 50 km para no asociarlo a coordenadas antiguas incorrectas.
* Motivo: aumentar relevancia interna, coherencia de entidad y confianza del cliente sin inventar dirección física, horarios, precios ni disponibilidad.
* Relación: alinea WhatsApp con las señales locales y comerciales previamente publicadas en el sitio, Facebook e Instagram.
* Resultado: ✅ campos guardados y verificados mediante Chrome DevTools; el nombre `lithora 3d`, el horario 24/7 y el catálogo requieren definición o ajuste posterior.

## [2026-07-24]

* Archivo: herramientas comerciales de WhatsApp Business Web
* Cambio: se crearon las respuestas rápidas `/hola`, `/cotizar`, `/envios`, `/proceso` y `/archivos`, además de las listas `Prospecto nuevo`, `Respondió / interesado`, `Cotización enviada`, `Seguimiento`, `En producción` y `Entregado`.
* Motivo: responder con rapidez y consistencia, pedir únicamente los datos necesarios y mantener trazabilidad comercial desde el primer contacto hasta la entrega.
* Relación: operacionaliza la estrategia de prospección y preguntas abiertas documentada en `CONTEXTO_PROSPECCION_WHATSAPP.md`.
* Resultado: ✅ cinco respuestas y seis listas guardadas, sin enviar mensajes ni incorporar chats automáticamente.

## [2026-07-24]

* Archivo: `C:\Users\yarteaga\Documents\Personal\Negocios\Catalogo Whatsapp` (9 PNG redundantes)
* Cambio: se revisaron 30 imágenes mediante SHA-256, comparación de píxeles, distancia perceptual y hoja de contacto; se conservaron las propuestas visuales más claras y se enviaron a la Papelera de reciclaje las variantes repetidas de taller mecánico, clínica dental, hoteles, ferreterías, boutiques, constructoras, videojuegos/gaming y fotografía.
* Motivo: dejar una sola propuesta por giro repetido sin eliminar diseños de giros distintos.
* Relación: complementa el catálogo y la matriz de 16 giros documentados en `CONTEXTO_PROSPECCION_WHATSAPP.md`; no se trataron como duplicados archivos que solo compartían plantilla visual.
* Resultado: ✅ 9 archivos enviados a la Papelera y 21 imágenes conservadas; limpieza recuperable.

## [2026-07-24]

* Archivo: Meta Business Suite, porfolio `Yohan Escobar`, página `Lithora3D`
* Cambio: se envió una invitación a `manuel.riveraaguilar@hotmail.com` con acceso parcial básico y asignación exclusiva a la página Lithora3D para Contenido, Actividad de la comunidad y Mensajes y llamadas.
* Motivo: permitir que el usuario cree y administre publicaciones, atienda comentarios y consulte o responda mensajes de la página.
* Relación: se desactivó el permiso predeterminado `Administrar` para evitar control total del porfolio, reasignación de accesos o eliminación del negocio o la página.
* Resultado: ✅ invitación enviada y verificada en estado `Invitado`; caduca en 30 días y queda pendiente de aceptación.

## [2026-07-24]

* Archivo: catálogo de WhatsApp Business Web y `C:\Users\yarteaga\Documents\Personal\Negocios\Catalogo Whatsapp` (21 PNG)
* Cambio: se creó un artículo visible por cada imagen y giro, con nombre específico, descripción persuasiva honesta, enlace `https://lithora3d.com/cotizar/`, código único `LITH-*` y país de origen `México` cuando la plataforma lo exigió. No se inventaron precios, descuentos ni escasez.
* Motivo: convertir las muestras visuales en un catálogo comercial que facilite la identificación, el deseo y el inicio de una cotización desde WhatsApp.
* Relación: utiliza las 21 imágenes conservadas tras la limpieza de duplicados y aplica la estrategia documentada en `CONTEXTO_PROSPECCION_WHATSAPP.md`.
* Resultado: ✅ 21 artículos verificados mediante Chrome DevTools en `https://web.whatsapp.com/`; 21 imágenes, 21 descripciones persistentes, ningún giro faltante y ningún artículo duplicado. Los artículos quedaron pendientes de la revisión automática de WhatsApp.

## [2026-07-24]

* Archivo: Meta Business Suite, porfolio `Yohan Escobar`, página `Lithora3D`
* Cambio: se envió una invitación a `garciasanchezkarla15@gmail.com` con acceso parcial básico y asignación exclusiva a la página Lithora3D para Contenido, Actividad de la comunidad y Mensajes y llamadas.
* Motivo: permitir que la usuaria cree y administre publicaciones, atienda comentarios y consulte o responda mensajes de la página.
* Relación: replica la asignación limitada de `manuel.riveraaguilar@hotmail.com`; se desactivó `Administrar` y no se concedieron anuncios, insights, ingresos, activos adicionales ni control total.
* Resultado: ✅ invitación enviada y verificada en estado `Invitado`; caduca en 30 días y queda pendiente de aceptación.

## [2026-07-24]

* Archivo: borrador de WhatsApp Business para `Anagrafik Publicidad` (`+52 833 310 8834`)
* Cambio: se cargó el primer mensaje de prospección con la presentación `Te escribe nuestro equipo de Lithora3D en Tampico`, observación sobre publicidad e imagen de marca, propuestas de muestrarios, logotipos volumétricos y exhibidores, aviso de cuatro ejemplos visuales y pregunta abierta.
* Motivo: preparar el primer contacto solicitado sustituyendo la presentación personal de Yohan por `nuestro equipo`.
* Relación: adapta la plantilla y el primer ejemplo de `CONTEXTO_PROSPECCION_WHATSAPP.md` sin alterar el giro, la propuesta ni el cierre abierto.
* Resultado: ✅ borrador verificado mediante Chrome DevTools en `https://web.whatsapp.com/`; no se envió el mensaje ni se adjuntaron imágenes.

## [2026-07-24]

* Archivo: borrador de WhatsApp Business para `Anagrafik Publicidad` (`+52 833 310 8834`)
* Cambio: se reemplazó el borrador extenso por el formato corto acordado: identificación, presentación de `nuestro equipo`, observación real del giro, anuncio de cuatro ideas impresas en 3D y cierre visual `Te las compartimos 👇`.
* Motivo: conservar la secuencia comercial definida: mensaje inicial breve, cuatro imágenes y después una pregunta de elección.
* Relación: corrige el borrador anterior, que había incorporado antes de tiempo la pregunta abierta destinada al mensaje posterior a las imágenes.
* Resultado: ✅ borrador corregido y verificado mediante Chrome DevTools en `https://web.whatsapp.com/`; no se envió texto ni se adjuntaron imágenes.

## [2026-07-24]

* Archivo: vista previa de WhatsApp Business para `Anagrafik Publicidad` (`+52 833 310 8834`)
* Cambio: se copiaron juntos y se pegaron en una sola acción los archivos `01-anuncio.png`, `02-idea-1.png`, `03-idea-2.png` y `04-idea-3.png` del giro `16-Agencias-publicidad`.
* Motivo: preparar visualmente las cuatro propuestas para el primer prospecto mediante el flujo sencillo solicitado de copiar y pegar.
* Relación: continúa la secuencia comercial registrada anteriormente; las imágenes quedaron preparadas después del mensaje inicial y antes de la pregunta final.
* Resultado: ✅ Chrome DevTools verificó cuatro miniaturas, en el orden correcto, en la vista previa de `https://web.whatsapp.com/`; no se pulsó `Enviar` y ningún archivo fue enviado.

## [2026-07-24]

* Archivo: borrador de WhatsApp Business para `Barbería Express` (`+52 833 106 8848`)
* Cambio: se seleccionó aleatoriamente la fila 63 del Excel `Prospectos_Lithora3D_WHATSAPP.xlsx` y se preparó un mensaje breve adaptado al giro de barbería, firmado por `nuestro equipo` y con anuncio de cuatro ideas impresas en 3D.
* Motivo: continuar la prospección con un negocio distinto y dejar el primer contacto listo para revisión antes de cualquier envío.
* Relación: conserva la secuencia acordada de mensaje inicial, cuatro imágenes y pregunta posterior; evita repetir el prospecto Anagrafik Publicidad.
* Resultado: ✅ negocio y teléfono corroborados en Excel mediante Chrome DevTools; borrador verificado en `https://web.whatsapp.com/` con el botón `Enviar` disponible, sin pulsarlo y sin enviar contenido.

## [2026-07-24]

* Archivo: conversación de WhatsApp Business con `Barbería Express` (`+52 833 106 8848`)
* Cambio: se envió el mensaje de prospección aprobado y, a continuación, se pegaron y enviaron juntas las cuatro imágenes de `04-Barberias`: anuncio, letrero de mostrador, organizador para máquinas y propuesta promocional.
* Motivo: ejecutar el primer contacto visual completo con la secuencia rápida solicitada para mantener la atención del prospecto.
* Relación: completa el borrador preparado previamente; tras una desconexión temporal de WhatsApp Web se recuperó la sesión y se evitó duplicar el mensaje, enviando únicamente las imágenes pendientes.
* Resultado: ✅ Chrome DevTools verificó el mensaje y las cuatro fotos en `https://web.whatsapp.com/`, todas con estado `Leído`; el contacto respondió que enviará el mensaje a su jefa.

## [2026-07-24]

* Archivo: Excel `Prospectos_Lithora3D_WHATSAPP.xlsx`, hoja `Negocios`, celdas `AA1` y `AA63`
* Cambio: se agregó la columna `Estado de contacto` porque el archivo no tenía un campo de seguimiento comercial y se marcó como `Contactado` exclusivamente a Barbería Express Urban Concept.
* Motivo: registrar en la base el contacto realizado por WhatsApp y evitar volver a prospectar el mismo negocio por error.
* Relación: corresponde al mensaje y las cuatro imágenes enviados previamente a `+52 833 106 8848`.
* Resultado: ✅ cambio guardado en Excel Online y verificado mediante Chrome DevTools; la celda `AA63` muestra `Contactado`.

## [2026-07-24]

* Archivo: WhatsApp Business Web y Excel `Prospectos_Lithora3D_WHATSAPP.xlsx`, fila 35
* Cambio: se seleccionó aleatoriamente a `Pea asesores` (`833 231 4536`) como siguiente prospecto y se prepararon las cuatro imágenes de `12-Arquitectura-inmobiliarias`, pero se detuvo el contacto al aparecer una restricción de siete días para iniciar chats nuevos desde dispositivos vinculados.
* Motivo: respetar la limitación antispam mostrada por WhatsApp y evitar cualquier intento de evasión o envío duplicado.
* Relación: sigue al primer contacto con Barbería Express; la plataforma indicó que la actividad reciente puede parecer spam, automatización o mensajería masiva.
* Resultado: ⚠️ no se abrió el chat de Pea asesores, no se enviaron mensajes ni imágenes y `AA35` permanece vacío, por lo que el negocio no fue marcado como contactado.

## [2026-07-24]

* Archivo: Samsung `SM-A057M`, `/sdcard/Pictures/Lithora3D/IMG-productos`
* Cambio: se transfirieron mediante ADB las 64 imágenes PNG de los 16 giros, conservando una carpeta por giro y cuatro archivos por carpeta; también se solicitó al sistema el escaneo multimedia de la carpeta.
* Motivo: disponer de todas las propuestas visuales directamente en el dispositivo móvil para continuar la prospección desde la aplicación principal de WhatsApp.
* Relación: ofrece una alternativa operativa legítima ante la restricción temporal de siete días aplicada únicamente a los dispositivos vinculados; no se intentó evadirla desde WhatsApp Web.
* Resultado: ✅ ADB transfirió 104,448,813 bytes; se verificaron 64 hashes SHA-256 locales contra 64 remotos, con cero diferencias, y el teléfono conserva 27 GB disponibles.

## [2026-07-24]

* Archivo: WhatsApp Business móvil en Samsung `SM-A057M`, conversación con `PEA ASESORES` (`+52 833 231 4536`)
* Cambio: se abrió mediante ADB el chat empresarial identificado por el número y se cargó un borrador adaptado a asesoría y proyectos inmobiliarios, firmado por `nuestro equipo` y con anuncio de cuatro ideas impresas en 3D.
* Motivo: continuar la prospección desde el dispositivo principal y dejar el segundo contacto listo para revisión antes de cualquier envío.
* Relación: retoma la fila 35 de `Prospectos_Lithora3D_WHATSAPP.xlsx`, que permanecía sin contactar tras la restricción exclusiva de dispositivos vinculados.
* Resultado: ✅ ADB verificó destinatario `PEA ASESORES`, texto completo en el campo de mensaje y botón `Enviar` disponible; no se pulsó y no se envió ningún contenido.

## [2026-07-24]

* Archivo: WhatsApp Business móvil en Samsung `SM-A057M`, conversación con `PEA ASESORES` y carpeta `12-Arquitectura-inmobiliarias`
* Cambio: mediante ADB se abrió el selector multimedia del chat y se eligieron juntas `01-anuncio.png`, `02-idea-1.png`, `03-idea-2.png` y `04-idea-3.png`.
* Motivo: validar el flujo móvil para adjuntar las cuatro propuestas correctas de un giro y dejarlas listas para revisión antes del envío.
* Relación: continúa el borrador móvil preparado para PEA ASESORES y utiliza las imágenes previamente verificadas y transferidas al teléfono.
* Resultado: ⚠️ esta verificación fue incorrecta: aunque WhatsApp mostraba cuatro elementos, las miniaturas seleccionadas pertenecían visualmente a otro giro. La selección se descartó sin enviar contenido y queda sustituida por la corrección siguiente.

## [2026-07-24]

* Archivo: WhatsApp Business móvil en Samsung `SM-A057M`, conversación con `PEA ASESORES` y carpeta `12-Arquitectura-inmobiliarias`
* Cambio: se descartó la selección incorrecta y se eligieron de nuevo las copias verificadas `01-ARQUITECTURA-anuncio.png`, `02-ARQUITECTURA-maqueta.png`, `03-ARQUITECTURA-display.png` y `04-ARQUITECTURA-llavero.png`.
* Motivo: corregir la selección señalada por el usuario y garantizar que las cuatro propuestas correspondan a arquitectura e inmobiliarias antes de cualquier envío.
* Relación: corrige la entrada anterior; los archivos se corroboraron visualmente y contra sus identificadores de MediaStore `2909` a `2912`.
* Resultado: ✅ ADB y UIAutomator verificaron exactamente cuatro elementos seleccionados, el contador `4` y el control `Enviar 4 archivos multimedia`; la vista previa permanece abierta y no se pulsó `Enviar`.

## [2026-07-24]

* Archivo: `scripts/Enviar-ProspectoWhatsApp.ps1`
* Cambio: se creó una automatización de un solo prospecto por ejecución que solicita el número, localiza una coincidencia única en el Excel, resuelve uno de los 16 giros, redacta el mensaje de `nuestro equipo`, prepara un álbum móvil aislado y envía mediante ADB el texto seguido de las cuatro imágenes exactas del giro.
* Motivo: convertir el flujo móvil ya aprendido en una operación repetible que solo requiera introducir el teléfono y que no vuelva a depender de miniaturas ambiguas en `Recientes`.
* Relación: incorpora la corrección aplicada a PEA ASESORES; ahora exige una carpeta con `01-anuncio.png` a `04-idea-3.png`, abre un álbum temporal específico y verifica `Enviar 4 archivos multimedia` antes del envío.
* Resultado: ⚠️ implementación creada con controles de coincidencia, WhatsApp verificado, contacto previo, cantidad de archivos, estado de UI y registro local; pruebas de simulación y análisis sintáctico pendientes.

## [2026-07-24]

* Archivo: `scripts/Enviar-ProspectoWhatsApp.ps1`
* Cambio: la comparación contra `Teléfono público` ahora omite valores vacíos o `No visible` y tolera formatos públicos no normalizables, manteniendo como referencia principal el número de WhatsApp normalizado.
* Motivo: la primera simulación se detenía al llegar a prospectos sin teléfono público antes de alcanzar la coincidencia solicitada.
* Relación: corrige exclusivamente la lectura defensiva del catálogo en la automatización recién creada, sin relajar la exigencia de una coincidencia única.
* Resultado: ✅ fallo reproducido y corregido; nueva simulación pendiente.

## [2026-07-24]

* Archivo: `scripts/Enviar-ProspectoWhatsApp.ps1`
* Cambio: la búsqueda telefónica se reescribió como un recorrido explícito que construye una lista tipada de coincidencias en lugar de depender del resultado implícito de `Where-Object`.
* Motivo: la ejecución completa devolvía cero coincidencias aunque la misma expresión aislada encontraba correctamente la fila 35; la lista explícita elimina esa diferencia de enumeración y facilita auditar el conteo.
* Relación: conserva la normalización defensiva añadida en la corrección anterior y mantiene la regla de coincidencia única.
* Resultado: ⚠️ ajuste aplicado; simulación integral pendiente.

## [2026-07-24]

* Archivo: `scripts/Enviar-ProspectoWhatsApp.ps1`
* Cambio: se añadió la marca UTF-8 al inicio del script para que Windows PowerShell 5.1 interprete correctamente encabezados, nombres, mensajes y rutas con caracteres acentuados.
* Motivo: el depurador comprobó que la fila 35 sí se importaba, pero literales como `Número` y `Teléfono` se leían con mojibake y por eso no coincidían con las claves normalizadas del Excel.
* Relación: explica la falsa ausencia de coincidencias observada en las dos simulaciones anteriores; no cambia la lógica de búsqueda.
* Resultado: ✅ causa raíz identificada y corrección de codificación aplicada; simulación integral pendiente.

## [2026-07-24]

* Archivo: `scripts/Enviar-ProspectoWhatsApp.ps1`
* Cambio: se delimitó explícitamente la variable `${negocio}` dentro de la pregunta inicial del mensaje.
* Motivo: con modo estricto, PowerShell interpretaba el signo de interrogación adyacente como parte del nombre de variable `$negocio?`.
* Relación: corrección puntual descubierta al continuar la simulación después de resolver la codificación UTF-8.
* Resultado: ✅ interpolación corregida; simulación integral pendiente.

## [2026-07-24]

* Archivo: `scripts/Enviar-ProspectoWhatsApp.ps1`
* Cambio: la validación visual ahora exige los tres archivos de idea con sus nombres canónicos y acepta como anuncio el único PNG restante, al que asigna `01-anuncio.png` únicamente en el álbum temporal del teléfono.
* Motivo: la simulación de Barbería Express reveló que Barberías, Veterinarias y Hamburgueserías conservan el anuncio final con su nombre original de ChatGPT aunque cada carpeta sí contiene exactamente cuatro imágenes válidas.
* Relación: mantiene el control estricto de cuatro archivos y el orden anuncio–ideas sin renombrar ni modificar los originales del usuario.
* Resultado: ✅ simulación de PEA ASESORES aprobada; compatibilidad con los tres nombres históricos añadida y pendiente de revalidación.

## [2026-07-24]

* Archivo: `scripts/Enviar-ProspectoWhatsApp.ps1`
* Cambio: se completaron el análisis sintáctico, cuatro simulaciones representativas y una validación matricial de todos los giros contra sus carpetas y archivos reales.
* Motivo: comprobar la resolución desde teléfono hasta negocio, mensaje y paquete visual antes de entregar una automatización capaz de enviar contenido.
* Relación: cierra las pruebas pendientes de la creación y de las correcciones de teléfonos vacíos, UTF-8, interpolación y anuncios con nombres históricos.
* Resultado: ✅ sintaxis válida; PEA ASESORES, R|M MUSTACHE, Hospital Veterinario Sexta Mascota y PatioBurger Mx resolvieron correctamente; los 16 de 16 giros tienen cuatro PNG, tres ideas canónicas y un anuncio. La interacción real de envío queda pendiente porque el dispositivo ADB no está conectado.

## [2026-07-25]

* Archivo: `C:\Users\yarteaga\.codex\config.toml`
* Cambio: se restauró exclusivamente la definición MCP `chrome-devtools` mediante el lanzador local existente y se creó la copia previa `config.toml.bak_20260725_before_chrome_restore`.
* Motivo: la configuración regenerada de Codex había eliminado el servidor aunque el ejecutable, el perfil y el script de inicio seguían instalados.
* Relación: recupera la herramienta obligatoria para inspeccionar el Excel y WhatsApp sin sustituir ni modificar la configuración vigente de `node_repl`.
* Resultado: ✅ bloque restaurado con arranque requerido y tiempo de espera de 120 segundos; validación de inicio pendiente.

## [2026-07-25]

* Archivo: configuración MCP local de Codex
* Cambio: se validó la configuración restaurada mediante `codex mcp list`.
* Motivo: comprobar que el archivo TOML es válido y que Codex reconoce nuevamente el servidor antes de reiniciar la sesión.
* Relación: cierra la validación pendiente de la restauración inmediatamente anterior.
* Resultado: ✅ `chrome-devtools` aparece habilitado, requerido y asociado al lanzador correcto; el registro de herramientas de la tarea actual requiere recarga para incorporar `list_pages`.

## [2026-07-25]

* Archivo: instalación local `chrome-devtools-mcp` 1.3.0
* Cambio: se ejecutó el binario configurado con `--help` para comprobar resolución de Node, existencia del build y carga del programa.
* Motivo: descartar que la ausencia de herramientas proviniera de una instalación dañada además del bloque TOML perdido.
* Relación: complementa la validación de `codex mcp list` sin abrir ni controlar ninguna página web.
* Resultado: ✅ servidor ejecutable y opciones MCP cargadas correctamente; no fue necesaria una reinstalación.

## [2026-07-25]

* Archivo: `scripts/Enviar-ProspectoWhatsApp.ps1`
* Cambio: `Invoke-Adb` ahora captura la salida de `adb` con `$ErrorActionPreference` temporal en `Continue` y conserva la validación por código de salida.
* Motivo: durante el primer envío real, `adb push` escribió progreso por stderr aunque terminó correctamente, y Windows PowerShell lo convirtió en error terminante por la preferencia global `Stop`.
* Relación: mejora la automatización validada en simulación el 2026-07-24 para tolerar el comportamiento real de ADB sin relajar errores genuinos.
* Resultado: ⚠️ ajuste aplicado; validación sintáctica y reintento de envío pendientes.

## [2026-07-25]

* Archivo: `logs/whatsapp-prospeccion.jsonl`
* Cambio: se registró manualmente el envío a `Brandy’s Cakes Repostería Creativa` después de completar por ADB la selección del destino directo de WhatsApp Business para las 4 imágenes.
* Motivo: el script envió el texto y dejó disponibles las 4 imágenes en el flujo de Android, pero falló antes de escribir el registro porque no encontró el álbum temporal dentro del selector interno de WhatsApp.
* Relación: complementa la corrección previa de `Invoke-Adb`; evita recontactar el número `528338517294` tras comprobar en la UI de WhatsApp que aparecen `Tú · 4 fotos` con estado `Entregado`.
* Resultado: ✅ envío completado y bloqueado localmente contra duplicados; queda pendiente mejorar el flujo automático de álbumes para evitar recuperación manual en futuros envíos.

## [2026-07-25]

* Archivo: `scripts/Enviar-ProspectoWhatsApp.ps1`
* Cambio: se reemplazó el flujo de imágenes basado en el selector interno de álbumes de WhatsApp por un flujo de compartir de Android dirigido a `com.whatsapp.w4b`; además se añadió `-PracticarImagenes` para abrir el selector y verificar el contacto sin seleccionarlo ni enviar contenido.
* Motivo: el envío real demostró que WhatsApp no encontraba el álbum temporal, mientras que el flujo correcto era compartir las imágenes desde Android/Archivos hacia WhatsApp Business y luego elegir el contacto.
* Relación: corrige la recuperación manual registrada para `Brandy’s Cakes Repostería Creativa` y evita depender de miniaturas ambiguas o álbumes internos de WhatsApp.
* Resultado: ⚠️ cambio aplicado; validación sintáctica y práctica sin envío pendientes.

## [2026-07-25]

* Archivo: `scripts/Enviar-ProspectoWhatsApp.ps1`
* Cambio: se validó nuevamente la sintaxis completa y se ejecutó el modo `-PracticarImagenes` con el contacto de prueba ya registrado.
* Motivo: comprobar el flujo corregido de compartir cuatro imágenes hacia WhatsApp Business sin seleccionar el contacto ni confirmar un envío.
* Relación: completa la validación pendiente del reemplazo del selector interno de álbumes.
* Resultado: ✅ sintaxis válida; WhatsApp Business abrió el selector, encontró el contacto correcto y la práctica terminó antes de seleccionar o enviar. No se añadió ningún envío al registro.

## [2026-07-25]

* Archivo: `scripts/Enviar-ProspectoWhatsApp.ps1`
* Cambio: la identificación del destinatario en el selector de WhatsApp Business ahora compara los dígitos normalizados del número dentro de cada fila de contacto y conserva el nombre del negocio como alternativa.
* Motivo: WhatsApp mostró `+52 833 280 1489`, mientras el formato fijo anterior esperaba una agrupación distinta y no reconoció al destinatario aunque estaba visible.
* Relación: mejora el flujo de compartir por Android validado previamente para contactos que todavía no tienen guardado el nombre comercial.
* Resultado: ⚠️ corrección aplicada durante el envío a `Taller San Miguel`; queda pendiente completar las cuatro imágenes y confirmar el registro.

## [2026-07-25]

* Archivo: `scripts/Enviar-ProspectoWhatsApp.ps1`
* Cambio: se añadió `-SoloImagenes` para reanudar de forma segura la fase de compartir y registrar las cuatro imágenes sin volver a enviar el texto.
* Motivo: el texto para `Taller San Miguel` ya fue procesado antes de que el formato visual del teléfono detuviera la selección de imágenes.
* Relación: permite recuperar el envío parcial causado por la agrupación inesperada del número sin duplicar el primer mensaje.
* Resultado: ⚠️ modo de recuperación añadido; validación sintáctica y ejecución pendientes.

## [2026-07-25]

* Archivo: `logs/whatsapp-prospeccion.jsonl`
* Cambio: el resultado de `Taller San Miguel` se corrigió de cuatro imágenes completas a `texto_y_una_imagen_enviados_pendiente_completar`.
* Motivo: la verificación visual del usuario confirmó que `SEND_MULTIPLE` por ADB reemplazó las URI repetidas y entregó solamente una imagen.
* Relación: invalida la confirmación positiva producida por el modo `-SoloImagenes`; la comprobación anterior observaba la salida del selector, no el número real de adjuntos.
* Resultado: ✅ registro corregido para no considerar completo un envío parcial.

## [2026-07-25]

* Archivo: `scripts/Enviar-ProspectoWhatsApp.ps1`
* Cambio: el flujo de imágenes ahora abre Samsung Mis archivos, busca la carpeta temporal, verifica sus cuatro nombres, activa selección múltiple, exige `Se seleccionaron 4`, comparte mediante WhatsApp Business y valida cuatro miniaturas reales en el chat.
* Motivo: `SEND_MULTIPLE` ejecutado directamente con URI repetidas por ADB conservó una sola imagen.
* Relación: reemplaza el mecanismo que produjo el envío parcial a `Taller San Miguel` por el recorrido explícito solicitado desde la aplicación de archivos.
* Resultado: ⚠️ implementación aplicada y recorrido real de cuatro imágenes completado; falta reforzar la confirmación exacta del destinatario y validar sintaxis.

## [2026-07-25]

* Archivo: `scripts/Enviar-ProspectoWhatsApp.ps1`
* Cambio: antes de pulsar el envío final, el script exige simultáneamente un único botón de envío y un único destinatario cuyo número, normalizado a dígitos, coincida exactamente con el teléfono del Excel.
* Motivo: `Barbería Express` aparecía inmediatamente junto al teléfono de `Taller San Miguel` en el selector y una selección visual equivocada no debe poder avanzar.
* Relación: refuerza la selección por número añadida durante este envío con una segunda validación independiente en la pantalla final de WhatsApp.
* Resultado: ✅ el envío queda bloqueado si el destinatario confirmado no es exactamente el esperado.

## [2026-07-25]

* Archivo: `logs/whatsapp-prospeccion.jsonl`
* Cambio: el registro de `Taller San Miguel` se actualizó a `texto_y_cuatro_imagenes_enviados_desde_mis_archivos`.
* Motivo: la recuperación seleccionó cuatro archivos en Mis archivos, la hoja de Android confirmó `4 imágenes` y el chat de `+52 833 280 1489` mostró cuatro miniaturas con estado `Entregado`.
* Relación: cierra el estado parcial registrado tras el primer intento de una sola URI.
* Resultado: ✅ envío completado al número exacto del Excel y registrado sin atribuirlo al contacto vecino.

## [2026-07-25]

* Archivo: `scripts/Enviar-ProspectoWhatsApp.ps1`
* Cambio: se ejecutó la validación sintáctica completa después de integrar Mis archivos y la doble comprobación del destinatario.
* Motivo: asegurar que las correcciones de seguridad y selección múltiple dejaron el script ejecutable.
* Relación: completa las validaciones pendientes de los cambios realizados durante el envío a `Taller San Miguel`.
* Resultado: ✅ sintaxis válida.

## [2026-07-25]

* Archivo: `scripts/Enviar-ProspectoWhatsApp.ps1`
* Cambio: los controles de Mis archivos ahora se materializan primero como arreglos, se valida que sean únicos y solo después se indexan para pulsarlos.
* Motivo: PowerShell evaluó la indexación directa del resultado de `Get-UiNodes` de forma ambigua y pasó un nodo nulo al abrir la búsqueda durante el envío a `Hot dogs y hamburguesas los del cheko`.
* Relación: corrige la primera ejecución integral del nuevo recorrido por Mis archivos sin relajar las comprobaciones de cantidad o destinatario.
* Resultado: ⚠️ corrección aplicada; el texto ya fue procesado y se reanudará únicamente la fase de cuatro imágenes.

## [2026-07-25]

* Archivo: `scripts/Enviar-ProspectoWhatsApp.ps1`
* Cambio: la búsqueda de la carpeta temporal valida `4 elementos` dentro de la fila exacta cuyo nombre coincide completamente, en vez de exigir que toda la pantalla contenga un único contador.
* Motivo: Mis archivos mostró varias carpetas temporales anteriores en la misma búsqueda, cada una con su propio texto `4 elementos`, aunque la carpeta nueva `Lithora-0247-130254` sí estaba presente y era única.
* Relación: mejora el recorrido de recuperación para `Hot dogs y hamburguesas los del cheko` sin permitir seleccionar una carpeta distinta.
* Resultado: ⚠️ coincidencia contextual corregida; reanudación de imágenes pendiente.

## [2026-07-25]

* Archivo: `scripts/Enviar-ProspectoWhatsApp.ps1`
* Cambio: después de localizar la carpeta exacta, el script cierra el teclado de búsqueda, vuelve a capturar la interfaz, revalida que el nombre sea único y entonces pulsa la fila.
* Motivo: varias carpetas temporales desplazaron el resultado nuevo hacia la zona cubierta por el teclado; el toque no abrió la carpeta y la validación posterior se detuvo correctamente.
* Relación: complementa la búsqueda contextual sin recurrir a coordenadas fijas ni seleccionar una carpeta anterior.
* Resultado: ⚠️ navegación corregida; nueva reanudación pendiente.

## [2026-07-25]

* Archivo: `scripts/Enviar-ProspectoWhatsApp.ps1`
* Cambio: la espera para que Mis archivos indexe la carpeta recién copiada aumentó de 15 a 45 segundos.
* Motivo: la carpeta existe físicamente con sus cuatro PNG, pero la búsqueda de Samsung tarda de forma variable en incorporarla y agotó dos esperas cortas.
* Relación: mantiene la selección por nombre exacto y evita sustituirla por una carpeta temporal anterior.
* Resultado: ⚠️ tolerancia de indexación ajustada; reanudación pendiente.

## [2026-07-25]

* Archivo: `scripts/Enviar-ProspectoWhatsApp.ps1`
* Cambio: cada teléfono usa ahora una carpeta estable `Lithora-<últimos4>-ACTUAL`, y la detección de WhatsApp Business normaliza cualquier espacio ordinario o no separable del nombre mostrado por Android.
* Motivo: las carpetas nuevas con marca horaria tardaban en indexarse en cada reintento y la hoja de compartir mostró `WhatsApp Business` con un espacio no separable.
* Relación: incorpora los dos hallazgos del envío real a `Hot dogs y hamburguesas los del cheko`.
* Resultado: ✅ se evita crear múltiples carpetas por reintento y se reconoce la aplicación sin depender de la variante tipográfica del espacio.

## [2026-07-25]

* Archivo: `logs/whatsapp-prospeccion.jsonl`
* Cambio: se registró el envío completo a `Hot dogs y hamburguesas los del cheko`, fila 586.
* Motivo: la recuperación por ADB verificó el número `528331270247` tanto en la confirmación como en el chat, además de cuatro miniaturas, el marcador `3 de 4` y estado `Entregado`.
* Relación: completa el prospecto solicitado después de descartar automáticamente un número duplicado del Excel.
* Resultado: ✅ texto personalizado y cuatro imágenes de hamburgueserías entregados al destinatario exacto.
## [2026-07-27]

* Archivo: `tools/analyze_bagclip_blender.py`
* Cambio: se creó un analizador reproducible para cargar en Blender las mallas internas del 3MF, medir sus superficies superiores y renderizar vistas de control.
* Motivo: Blender 4.5 no incluye un importador 3MF activo y es necesario identificar con precisión la zona segura para conservar `LITHORA 3D` como marca imprimible.
* Relación: primer cambio específico para `BagClip_LITHORA_3D_0.4mm_monoespaciado.3mf`; no repite soluciones anteriores registradas.
* Resultado: ✅ herramienta creada; ejecución y validación visual pendientes.
## [2026-07-27]

* Archivo: `tools/analyze_bagclip_blender.py`
* Cambio: se inicializa explícitamente el entorno `World` antes de configurar iluminación y render.
* Motivo: una escena vacía de Blender 4.5 no contiene `World` y el primer análisis terminó después de medir las mallas, pero antes de generar las vistas.
* Relación: corrige únicamente el fallo de render del analizador recién creado; no altera la geometría del clip.
* Resultado: ✅ corrección aplicada; reejecución pendiente.
## [2026-07-27]

* Archivo: `tools/refine_bagclip_blender.py`
* Cambio: se creó el flujo definitivo en Blender para sustituir la marca defectuosa por `LITHORA 3D` monoespaciada y en negrita, grabarla 0,60 mm sobre una rama exterior, validar manifold y dimensiones, y exportar 3MF, STL, BLEND, renders e informe técnico.
* Motivo: la malla original deja solo 0,009 mm entre `3` y `D` y contiene trazos marginales para una boquilla de 0,4 mm; la nueva construcción mantiene separación uniforme, mayor grosor visual y tres capas de profundidad a 0,2 mm.
* Relación: mejora la marca original sin tocar dientes, canal ni puente flexible; usa las medidas obtenidas por `tools/analyze_bagclip_blender.py`.
* Resultado: ✅ automatización creada; ejecución, revisión visual y validación final pendientes.
## [2026-07-27]

* Archivo: `tools/refine_bagclip_blender.py`
* Cambio: el cortador tipográfico fuerza curvas 2D rellenas por ambos lados y tapas cerradas antes de convertirse a malla.
* Motivo: la primera ejecución fue rechazada correctamente al detectar 207 aristas no manifold; el diagnóstico aislado encontró 1.670 bordes abiertos en el operando de texto, mientras la pieza original conserva 0.
* Relación: corrige la causa geométrica del fallo sin cambiar posición, texto, dimensiones funcionales ni profundidad del grabado.
* Resultado: ✅ cortador corregido; nueva medición y booleano pendientes.
## [2026-07-27]

* Archivo: `tools/refine_bagclip_blender.py`
* Cambio: se sustituyó el booleano de fuente por una marca geométrica monolineal elevada, compuesta por sólidos cerrados de 0,52 mm de trazo, 0,40 mm de relieve y 0,08 mm de anclaje dentro de la cara superior.
* Motivo: incluso rellena y solidificada, la conversión tipográfica de Blender conservaba bordes abiertos; el nuevo método garantiza trazos superiores a la boquilla de 0,4 mm y evita alterar la malla funcional del clip.
* Relación: reemplaza la estrategia fallida registrada inmediatamente antes; conserva `LITHORA 3D`, espaciado fijo, zona segura de colocación y salida editable.
* Resultado: ✅ estrategia robusta implementada; exportación y validación final pendientes.
## [2026-07-27]

* Archivo: `tools/refine_bagclip_blender.py`
* Cambio: se corrigieron la iluminación ambiental, exposición, luz cenital y orientación fija de la cámara superior de las vistas de validación.
* Motivo: la primera exportación geométrica fue válida, pero los renders quedaron demasiado oscuros y la vista superior giró 90 grados, impidiendo juzgar bien la legibilidad de la marca.
* Relación: ajuste exclusivo de evidencia visual; no modifica la malla 3MF/STL aprobada ni las medidas de la marca.
* Resultado: ✅ presentación corregida; regeneración y revisión visual pendientes.
## [2026-07-27]

* Archivo: `tools/refine_bagclip_blender.py`
* Cambio: la marca se trasladó a la rama exterior continua en `Y = -5,20 mm` y se añadió una validación BVH que exige superficie superior bajo cada esquina XY de los trazos.
* Motivo: la revisión visual detectó que la primera posición cruzaba parcialmente el canal abierto aunque la malla resultante fuera manifold.
* Relación: corrige la colocación de la marca elevada sin cambiar texto, espaciado, grosor ni relieve; añade una comprobación que impide futuras exportaciones flotantes.
* Resultado: ✅ posición y control de soporte corregidos; regeneración pendiente.
## [2026-07-27]

* Archivo: `tools/refine_bagclip_blender.py`
* Cambio: la solución final usa un grabado lateral exacto de 0,60 mm con trazos monoespaciados cerrados de 0,52 mm; valida por BVH cada esquina XZ, conserva las dimensiones exteriores y renderiza la cara marcada.
* Motivo: la superficie superior solo ofrece una franja continua de 1,5 mm, insuficiente para una marca legible; la pared exterior permite mantener 2,8 mm de altura sin relieve ni voladizos.
* Relación: reemplaza la marca superior elevada que la revisión visual rechazó; la prueba aislada del nuevo booleano terminó con 0 aristas no manifold.
* Resultado: ✅ solución lateral integrada; ejecución completa y revisión final pendientes.
## [2026-07-27]

* Archivo: `tools/refine_bagclip_blender.py`
* Cambio: se restauró la importación estándar `math` requerida por la rotación de 90° del cortador lateral.
* Motivo: la dependencia había sido retirada junto con la estrategia tipográfica anterior y la nueva orientación usa `math.radians`.
* Relación: corrección preventiva de ejecución para el grabado lateral recién implementado; no cambia parámetros geométricos.
* Resultado: ✅ dependencia restaurada.
## [2026-07-27]

* Archivo: `tools/refine_bagclip_blender.py`
* Cambio: la vista lateral de control usa Workbench con sombras y realce de cavidades, mientras las vistas de producto conservan Eevee.
* Motivo: la iluminación física frontal ocultaba visualmente el grabado de 0,60 mm aunque la diferencia de volumen y la prueba BVH confirmaban su presencia.
* Relación: ajuste exclusivo de inspección visual posterior a la validación geométrica; no modifica 3MF, STL ni BLEND.
* Resultado: ✅ evidencia técnica mejorada; regeneración pendiente.
## [2026-07-27]

* Archivo: `tools/refine_bagclip_blender.py`
* Cambio: el cortador se refleja en X alrededor del centro de la marca antes de orientarse sobre la pared `+Y`.
* Motivo: la vista exterior técnica confirmó que la primera orientación lateral hacía legible `LITHORA 3D` únicamente en espejo.
* Relación: corrección visual final del grabado lateral; conserva caja envolvente, profundidad, soporte BVH y malla funcional.
* Resultado: ✅ orientación de lectura corregida; regeneración final pendiente.
## [2026-07-27]

* Archivo: `tools/refine_bagclip_blender.py`
* Cambio: se recalculan las normales del cortador después de reflejarlo para corregir su orientación volumétrica antes del booleano.
* Motivo: la exportación reflejada conservó exactamente el volumen original, señal de que las caras invertidas hicieron que Blender no restara el grabado.
* Relación: completa la corrección de lectura exterior registrada inmediatamente antes; mantiene 0 bordes abiertos y recupera la sustracción real.
* Resultado: ✅ normales corregidas; regeneración y comprobación de volumen pendientes.
## [2026-07-27]

* Archivo: `C:\Users\yarteaga\Downloads\BagClip_LITHORA_3D_04mm_CORREGIDO\`
* Cambio: se generaron el 3MF final, STL de respaldo, BLEND editable, tres vistas PNG y el informe JSON de validación con la marca lateral `LITHORA 3D`.
* Motivo: entregar una pieza corregida, monoespaciada y dimensionada para boquilla de 0,4 mm sin alterar la función del clip.
* Relación: cierra las iteraciones de posición, manifold, soporte, orientación y normales registradas para esta pieza.
* Resultado: ✅ 35 × 14,8 × 10 mm; trazo 0,52 mm; grabado 0,60 mm; 118 puntos XZ soportados; 0 aristas no manifold y lectura exterior correcta.
## [2026-07-27]

* Archivo: `C:\Users\yarteaga\Downloads\BagClip_LITHORA_3D_04mm_CORREGIDO\BagClip_LITHORA_3D_04mm_PERFECTO.3mf`
* Cambio: se validó la importación del archivo final mediante `BambuStudio-02.07.01.62 --info`.
* Motivo: comprobar con el laminador de destino, además de Blender, que el paquete 3MF y la malla sean utilizables.
* Relación: validación externa posterior al informe interno de Blender y a la revisión visual del grabado.
* Resultado: ✅ Bambu Studio reporta 35 × 14,8 × 10 mm, 167.586 facetas, una parte y `manifold = yes`.

## [2026-07-27]

* Archivo: `C:\Users\yarteaga\Downloads\BagClip_LITHORA_3D_04mm_CORREGIDO\BagClip_LITHORA_3D_04mm_EDITABLE.blend1`
* Cambio: el respaldo automático de una iteración anterior se movió a `.tmp_bagclip_inspect\BagClip_LITHORA_3D_iteracion_anterior.blend1`.
* Motivo: dejar la carpeta de entrega sin una versión intermedia que pudiera confundirse con el BLEND final.
* Relación: la eliminación directa fue bloqueada; el movimiento conserva el archivo de forma recuperable para auditoría.
* Resultado: ✅ respaldo retirado de la entrega y conservado en la carpeta temporal.

## [2026-08-01]

* Archivo: `tools/optimize_bambu_project.py`
* Cambio: se creó una herramienta no destructiva para duplicar proyectos 3MF de Bambu Studio y variar de forma explícita volumen de cebado por filamento, ancho y brim de torre, purga mínima en torre, multiplicador de limpieza y altura de capa.
* Motivo: comparar variantes reales del proyecto `Pepo_Adorno_Lapiz_50mm_PROYECTO_BAMBU.3mf` sin sobrescribir su geometría, pintura multicolor ni configuración original.
* Relación: reutiliza el patrón de preservación completa del paquete 3MF empleado previamente en `tools/build_pepo_pencil_topper.py`, pero limita los cambios a parámetros de laminado auditables.
* Resultado: ✅ herramienta creada; generación y rebanado comparativo pendientes.

## [2026-08-01]

* Archivo: `C:\Users\yarteaga\Documents\Personal\Negocios\03-modelos\adorno_lapiz\Pepo_Adorno_Lapiz_50mm_PROYECTO_BAMBU_OPTIMIZADO_CALIDAD.3mf`
* Cambio: se generó una copia de calidad con altura de capa de 0,22 mm, volumen de cebado de 20 mm³ por filamento, torre de 30 mm, brim de 3 mm, multiplicador de limpieza 0,40 y purga mínima en torre de 15 mm³.
* Motivo: reducir capas y cambios sin tocar geometría, pintura exterior, matriz de transiciones oscuro→claro, soportes ni el proyecto original.
* Relación: la prueba comparativa mostró 227 capas y 357 cambios frente a 250 capas y 389 cambios del original.
* Resultado: ✅ proyecto generado; validación final en Bambu Studio pendiente.

## [2026-08-01]

* Archivo: `tools/optimize_bambu_project.py`
* Cambio: la herramienta admite ahora un proyecto plantilla para transferir un perfil completo A1 conservando los colores de la fuente, y una matriz de purga N×N validada por longitud, diagonal y valores no negativos.
* Motivo: el proyecto original de Bely contiene geometría y pintura válidas, pero un perfil parcial de Bambu Studio 02.03 con referencias X1C y purgas genéricas; cambiar solo la altura de capa no produciría una optimización equivalente a Pepo.
* Relación: amplía de forma compatible la herramienta usada para las dos variantes de Pepo y evita editar manualmente el paquete 3MF.
* Resultado: ✅ soporte de plantilla y matriz específica incorporado; compilación y generación de Bely pendientes.

## [2026-08-01]

* Archivo: `Pepo_Adorno_Lapiz_50mm_PROYECTO_BAMBU_OPTIMIZADO_CALIDAD.3mf` y `Pepo_Adorno_Lapiz_50mm_PROYECTO_BAMBU_OPTIMIZADO_PRODUCCION.3mf`
* Cambio: se validaron ambos paquetes ZIP/3MF, se compararon los hashes de la malla y metadatos del modelo contra el original y se rebanaron con Bambu Studio 02.07.01.62.
* Motivo: confirmar que los cambios afectan solamente parámetros de laminado y que ambos proyectos abren y generan G-code sin advertencias.
* Relación: cierra las dos generaciones registradas inmediatamente antes.
* Resultado: ✅ geometría y pintura idénticas al original; calidad: 357 cambios, 85,809 g incluyendo purga inicial y 10,011 h; producción: 325 cambios, 79,847 g incluyendo purga inicial y 9,141 h; sin advertencias del laminador.

## [2026-08-01]

* Archivo: `audits/Pepo_optimizacion_multicolor_Bambu_A1_2026-08-01.md`
* Cambio: se documentó el diagnóstico completo en 15 secciones, configuración exacta, matriz efectiva de 12 transiciones, pruebas controladas, estimaciones comparables, lotes de 1/2/4/6/8 unidades, riesgos y fuentes oficiales verificadas con Chrome DevTools.
* Motivo: entregar una guía reproducible ligada a los dos proyectos 3MF optimizados y separar mediciones reales de aproximaciones.
* Relación: consolida la investigación oficial y los rebanados original, conservador, 0,22 mm y 0,24 mm realizados en Bambu Studio 02.07.01.62.
* Resultado: ✅ informe creado con recomendación de primera prueba a 0,22 mm y variante de producción a 0,24 mm condicionada a validación facial.

## [2026-08-01]

* Archivo: `audits/Pepo_optimizacion_multicolor_Bambu_A1_2026-08-01.md`
* Cambio: se ajustaron las cifras de la variante de producción a la rebanada final entregada: 37,48 g de purga, 17,08 g de torre derivada, 69,86 g totales de interfaz y 325 cambios.
* Motivo: la última rebanada determinista del archivo final añadió una transición respecto a la variante temporal de comparación.
* Relación: precisión posterior a la validación final en Bambu Studio 02.07.01.62; no modifica ninguno de los dos proyectos 3MF.
* Resultado: ✅ informe sincronizado con el archivo final de producción.

## [2026-08-01]

* Archivo: `tools/build_coin_pencil_topper.py`
* Cambio: se creó un flujo no destructivo que aplana los 249 componentes multicolor de `tipo_moneda.3mf`, escala proporcionalmente la cara a 34 mm sin adelgazarla y agrega un conector inferior naranja con socket cónico de 8,8 a 6,8 mm, profundidad de 12,5 mm y techo en lágrima imprimible sin soportes.
* Motivo: convertir la moneda en un adorno compacto para lápiz sin estirar, perforar ni cubrir el arte frontal.
* Relación: reutiliza las tolerancias funcionales validadas en el adorno Pepo, pero cambia la cavidad al eje horizontal y añade geometría externa para respetar el diseño plano de la moneda.
* Resultado: ✅ herramienta creada; generación, revisión visual y rebanado pendientes.

## [2026-08-01]

* Archivo: `tools/build_coin_pencil_topper.py`
* Cambio: se conectó el argumento `--diameter` con el cálculo real de escala y se corrigió el conteo de componentes fuente del informe.
* Motivo: asegurar que la medida solicitada gobierne la geometría y que la validación reporte 249 piezas originales, no el número de grupos de color.
* Relación: corrección preventiva inmediata del generador recién creado; no se había producido ningún archivo final.
* Resultado: ✅ parámetros e informe corregidos; ejecución pendiente.

## [2026-08-01]

* Archivo: `tools/build_coin_pencil_topper.py`
* Cambio: el informe de validación calcula la profundidad de asiento estimada para lápices de 8,2, 7,5 y 7,2 mm.
* Motivo: documentar que el taper de 8,8 a 6,8 mm sujeta distintos lápices tradicionales sin depender de una sola medida nominal.
* Relación: añade verificación funcional al socket visualmente aprobado; no cambia su geometría.
* Resultado: ✅ métricas de encaje añadidas; generación final pendiente.

## [2026-08-01]

* Archivo: `C:\Users\yarteaga\Documents\Personal\Negocios\03-modelos\adorno_lapiz\Tipo_Moneda_Adorno_Lapiz_34mm_PROYECTO_BAMBU.3mf`
* Cambio: se generó el proyecto multicolor final con moneda visible de 34 × 33,56 × 3 mm, conector naranja inferior y socket cónico horizontal de 8,8 a 6,8 mm por 12,5 mm de profundidad.
* Motivo: entregar un adorno compacto que preserve sin deformación el arte Bely y Beto y encaje en lápices tradicionales.
* Relación: resultado final del generador y de las correcciones de escala, espesor, orientación y techo imprimible registradas en esta fecha.
* Resultado: ✅ 3MF generado sin sobrescribir `tipo_moneda.3mf`; validación Bambu final pendiente.

## [2026-08-01]

* Archivo: `Tipo_Moneda_Adorno_Lapiz_34mm_validacion.json`, `Tipo_Moneda_Adorno_Lapiz_34mm_vista_frontal.png` y `Tipo_Moneda_Adorno_Lapiz_34mm_vista_socket.png`
* Cambio: se generaron el informe dimensional y las vistas frontal montada y posterior del agujero vacío.
* Motivo: dejar evidencia reproducible del tamaño, colores, orientación, conexión y tolerancias del lápiz.
* Relación: acompaña al 3MF final de tipo moneda.
* Resultado: ✅ arte derecho y legible, conector centrado sin tapar la cara y cavidad visualmente accesible.

## [2026-08-01]

* Archivo: `Tipo_Moneda_Adorno_Lapiz_34mm_PROYECTO_BAMBU.3mf`
* Cambio: se validó el paquete, el conector y el rebanado final con Bambu Studio 02.07.01.62.
* Motivo: confirmar que el proyecto final es imprimible en A1, conserva los cuatro filamentos y no introduce soportes ni errores geométricos.
* Relación: validación final posterior a las revisiones visuales frontal y del socket.
* Resultado: ✅ ZIP íntegro; conector manifold; 34 × 46,759 × 13 mm; 32 cambios; 4,390 g de modelo; 1 h 24 min estimados; 0 g de soporte; sin advertencias del laminador; SHA-256 `1df573805cfcb4304c329611ca9aa0d51a3da9b9d082f5093faa7f623c163067`.

## [2026-08-01]

* Archivo: `tools/build_coin_pencil_topper.py`
* Cambio: se incorporó la transformación lineal de la instancia fuente antes de escalar y centrar las mallas.
* Motivo: el proyecto aplica 0,818× en XY, 1,5× en Z y volteo para imprimir el arte contra la placa; ignorarlo producía una moneda de 2 mm y con el diseño hacia arriba.
* Relación: corrige la primera generación temporal, que no se considera entregable; mantiene ahora los 3 mm originales y la primera capa multicolor nítida.
* Resultado: ✅ orientación y espesor fuente preservados; nueva generación pendiente.

## [2026-08-01]

* Archivo: `tools/render_coin_pencil_topper_blender.py`
* Cambio: se creó un renderizador Blender para revisar la cara multicolor a tamaño final y una perspectiva posterior del conector con un lápiz hexagonal de 7,4 mm insertado.
* Motivo: comprobar visualmente que la moneda no se deformó, que el conector no tapa el arte y que el socket está alineado con el lápiz.
* Relación: herramienta de QA para el 3MF producido por `tools/build_coin_pencil_topper.py`.
* Resultado: ✅ renderizador creado; generación y revisión de imágenes pendientes.

## [2026-08-01]

* Archivo: `tools/build_coin_pencil_topper.py`
* Cambio: la moneda se gira 180° en su propio plano antes de calcular el borde inferior y añadir el conector.
* Motivo: la primera vista mostró el texto invertido verticalmente respecto al lápiz por el volteo de la instancia MakerLab original.
* Relación: corrige orientación sin reflejar, deformar ni recolorear el diseño; el socket permanece centrado bajo la moneda.
* Resultado: ✅ orientación de uso corregida; regeneración pendiente.

## [2026-08-01]

* Archivo: `tools/render_coin_pencil_topper_blender.py`
* Cambio: la vista frontal usa Workbench con color de material y cavidades, y la perspectiva posterior oculta el lápiz para enseñar la entrada del socket vacía.
* Motivo: los primeros renders Eevee quedaron oscuros y el lápiz tapó la geometría funcional de la cavidad.
* Relación: ajuste exclusivo de QA visual; no altera el 3MF.
* Resultado: ✅ evidencia visual aclarada; regeneración pendiente.

## [2026-08-01]

* Archivo: `tools/render_coin_pencil_topper_blender.py`
* Cambio: la vista del socket usa Workbench y una cámara cercana casi alineada con el eje de inserción.
* Motivo: la segunda perspectiva todavía ocultaba la entrada por falta de contraste y un ángulo demasiado lateral.
* Relación: segunda iteración de evidencia funcional; no modifica el modelo.
* Resultado: ✅ encuadre del agujero corregido; regeneración pendiente.

## [2026-08-01]

* Archivo: `tools/render_coin_pencil_topper_blender.py`
* Cambio: se inicializa explícitamente el entorno `World` antes de configurar el fondo.
* Motivo: una escena vacía de Blender 4.5 no contiene `World` y la primera ejecución terminó antes de renderizar.
* Relación: corrige únicamente el fallo visual del renderizador recién creado; no afecta el 3MF ni su geometría.
* Resultado: ✅ corrección aplicada; reejecución pendiente.

## [2026-08-01]

* Archivo: `C:\Users\yarteaga\Documents\Personal\Negocios\03-modelos\adorno_lapiz\Pepo_Adorno_Lapiz_50mm_PROYECTO_BAMBU_OPTIMIZADO_PRODUCCION.3mf`
* Cambio: se generó una copia de producción con altura de capa de 0,24 mm, volumen de cebado de 20 mm³ por filamento, torre de 30 mm, brim de 3 mm, multiplicador de limpieza 0,40 y purga mínima en torre de 15 mm³.
* Motivo: ofrecer una variante más rápida para lotes, manteniendo intactos geometría, colores y valores efectivos de purga oscuro→claro.
* Relación: la prueba comparativa mostró 208 capas y 324 cambios, con validación visual del rostro requerida antes de fabricar un lote.
* Resultado: ✅ proyecto generado; validación final en Bambu Studio pendiente.

## [2026-08-01]

* Archivo: `C:\Users\yarteaga\Documents\Personal\Negocios\03-modelos\adorno_lapiz\Bely_Adorno_Lapiz_50mm_PROYECTO_BAMBU_OPTIMIZADO_CALIDAD.3mf`
* Cambio: se generó una copia de calidad con el perfil completo A1 de Pepo, altura de capa de 0,22 mm, torre de 30 mm, cebado de 20 mm³, brim de 3 mm, multiplicador 0,40 y matriz conservadora adaptada a caramelo, café, azul y amarillo.
* Motivo: corregir el perfil parcial X1C del proyecto Bely y reducir cambios por capas sin modificar su geometría, socket ni pintura.
* Relación: reutiliza la configuración de calidad ya validada para Pepo, pero sustituye la matriz por transiciones específicas de los colores de Bely.
* Resultado: ✅ copia no destructiva creada; rebanado y verificación binaria pendientes.

## [2026-08-06]

* Archivo: `tools/split_bienvenidos_sign.py`
* Cambio: se desactivaron brim, skirt y prime tower en los proyectos 3MF de las dos mitades.
* Motivo: la mitad izquierda mide 252 mm y requiere conservar los 2 mm libres por lado dentro de la cama de 256 mm de la Bambu Lab A1; el modelo usa un solo filamento y no necesita torre de purga.
* Relación: ajuste final del perfil después de comprobar los parámetros heredados de la plantilla A1.
* Resultado: ✅ generador corregido; regeneración y rebanado pendientes.

## [2026-08-06]

* Archivo: `tools/split_bienvenidos_sign.py`
* Cambio: se intentó regenerar los entregables sin indicar `--output-dir`.
* Motivo: ejecutar la validación final después del ajuste del perfil de impresión.
* Relación: primer intento de regeneración tras desactivar brim y torre.
* Resultado: ❌ el argumento de destino es obligatorio; no se modificaron los entregables.

## [2026-08-06]

* Archivo: `artifacts/bienvenidos_480mm/*.3mf`, `*.stl`, `*.png` y `*.json`
* Cambio: se regeneraron las dos mitades y sus archivos de validación con brim, skirt y prime tower desactivados.
* Motivo: dejar ambos proyectos listos para aprovechar la cama de la Bambu Lab A1 sin que elementos auxiliares excedan el área imprimible.
* Relación: corrige el intento anterior agregando el argumento `--output-dir` requerido.
* Resultado: ✅ dos sólidos únicos y estancos; izquierda 252×185×10 mm, derecha 240×139,043×10 mm; paquetes 3MF íntegros.

## [2026-08-06]

* Archivo: `artifacts/bienvenidos_480mm/`
* Cambio: se verificó por intersección booleana el ajuste de las dos mitades en su posición ensamblada.
* Motivo: confirmar que las lengüetas posteriores entran en sus cavidades con la holgura prevista y sin colisión geométrica.
* Relación: validación del ensamble macho-hembra regenerado.
* Resultado: ✅ volumen de interferencia 0,0 mm³ y 0 triángulos de colisión.

## [2026-08-06]

* Archivo: `artifacts/bienvenidos_480mm/Bienvenidos_480mm_A1_PARTE_1_IZQUIERDA.3mf` y `Bienvenidos_480mm_A1_PARTE_2_DERECHA.3mf`
* Cambio: se rebanaron ambos proyectos con Bambu Studio 02.07.01.62 y perfil Bambu Lab A1 de boquilla 0,4 mm.
* Motivo: validar apertura, ubicación en cama, generación de capas y G-code antes de entregar.
* Relación: cierre de la validación geométrica y del perfil sin brim ni torre.
* Resultado: ✅ ambos rebanados terminaron con código 0; izquierda dentro de X=2–254 mm, 50 capas, 87,25 g y 2 h 28 min; derecha dentro de X=20,18–248 mm, 50 capas, 64,17 g y 1 h 54 min.

## [2026-08-06]

* Archivo: `tools/build_patricia_eduardo_sign.py` y `tools/round_sign_blender.py`
* Cambio: se creó un generador reproducible para “Patricia & Eduardo” en una sola pieza de hasta 246 mm, con composición en tres niveles, conectores caligráficos mínimos, espesor de 12 mm y redondeo Blender de 1,1 mm en cinco segmentos; también empaqueta un proyecto A1 a 0,16 mm, tres paredes, 10% gyroid, generador Classic y costura Nearest.
* Motivo: evitar juntas y pegamento porque la composición completa cabe en la cama A1, mejorar físicamente los cantos y equilibrar acabado, tiempo y material.
* Relación: solución distinta al corte macho-hembra de “Bienvenidos”; incorpora la documentación oficial inspeccionada con Chrome DevTools sobre generador de paredes, costuras e ironing.
* Resultado: ⚠️ generadores creados; ejecución, inspección visual y rebanado pendientes.

## [2026-08-06]

* Archivo: ejecución de `tools/build_patricia_eduardo_sign.py`
* Cambio: la primera generación creó y exportó correctamente la malla redondeada, pero Blender se detuvo antes del render porque la escena vacía no contenía un objeto `World`.
* Motivo: validar por primera vez la geometría, el redondeado y la previsualización del nuevo letrero.
* Relación: primer intento de los generadores recién creados; no debe repetirse sin inicializar explícitamente el mundo de la escena.
* Resultado: ⚠️ STL redondeado parcial creado; 3MF, miniatura y reporte aún no generados.

## [2026-08-06]

* Archivo: `tools/round_sign_blender.py`
* Cambio: el renderizador crea y asigna ahora un objeto `World` cuando Blender parte de una escena vacía.
* Motivo: permitir configurar el fondo de la miniatura sin depender de datos presentes en el archivo de inicio de Blender.
* Relación: corrige directamente el primer intento parcial; no modifica geometría ni perfil de impresión.
* Resultado: ✅ compatibilidad del render corregida; regeneración completa pendiente.

## [2026-08-06]

* Archivo: `artifacts/patricia_eduardo_246mm/*`
* Cambio: la segunda generación produjo STL, miniatura y 3MF, pero la auditoría detectó que el modificador Bevel de Blender abrió aristas en varios contornos caligráficos estrechos.
* Motivo: comprobar que el redondeado visual también conservara una topología apta para impresión.
* Relación: supera el fallo de render anterior; la base Manifold original sí es un cuerpo estanco, por lo que el defecto queda aislado al bevel automático.
* Resultado: ❌ entregables rechazados para uso final; se sustituirá el bevel continuo por un redondeo escalonado a resolución de capa construido con booleanas Manifold.

## [2026-08-06]

* Archivo: `tools/build_patricia_eduardo_sign.py` y `tools/round_sign_blender.py`
* Cambio: se reemplazó el modificador Bevel por catorce capas booleanas de perfil circular —siete inferiores y siete superiores de 0,16 mm— alrededor de un núcleo Manifold; Blender queda reservado para la miniatura y su exportación STL es opcional.
* Motivo: conservar cantos redondeados que coinciden con la resolución real del perfil de impresión sin abrir los contornos estrechos de la tipografía.
* Relación: corrección topológica del segundo intento rechazado; mantiene 1,12 mm de radio nominal y el mismo diseño/plataforma.
* Resultado: ✅ redondeado estanco implementado en el generador; regeneración y revisión pendientes.

## [2026-08-06]

* Archivo: `artifacts/patricia_eduardo_246mm/*`
* Cambio: se regeneró el diseño con redondeo escalonado y se inspeccionó su render isométrico.
* Motivo: validar topología y lectura visual después de eliminar el bevel automático.
* Relación: primera ejecución del redondeo Manifold; reemplaza los archivos rechazados del intento anterior.
* Resultado: ⚠️ malla estanca de un cuerpo y 246,50×182,01×12 mm, pero la cámara recorta la inicial superior y el ampersand Edwardian resulta demasiado enredado; se requiere una miniatura más cenital y un ampersand más legible.

## [2026-08-06]

* Archivo: `tools/build_patricia_eduardo_sign.py` y `tools/round_sign_blender.py`
* Cambio: el ampersand usa ahora Georgia Bold Italic a 52 mm de alto y la cámara se acercó a una vista cenital con 18% adicional de margen horizontal y 55% vertical.
* Motivo: separar visualmente el símbolo central de los trazos ornamentales y mostrar completa la composición en la miniatura.
* Relación: mejora estética posterior a la inspección del primer render estanco; conserva nombres, dimensiones objetivo y perfil.
* Resultado: ✅ legibilidad y encuadre corregidos en el generador; regeneración pendiente.

## [2026-08-06]

* Archivo: inspección de `artifacts/patricia_eduardo_246mm/Patricia_y_Eduardo_246mm_preview.png`
* Cambio: se confirmó que Georgia vuelve reconocible el ampersand, pero la perspectiva con desplazamiento lateral todavía recorta las florituras superior e inferior.
* Motivo: revisar la presentación completa antes del rebanado final.
* Relación: segunda revisión visual; la geometría continúa estanca y no necesita cambios.
* Resultado: ⚠️ símbolo aprobado y miniatura aún rechazada; se requiere una vista frontal casi cenital sin desplazamiento X.

## [2026-08-06]

* Archivo: `tools/round_sign_blender.py`
* Cambio: la cámara queda centrada en X, con inclinación Y de solo 18%, altura de dos anchos y encuadre calculado con 10%/45% de margen.
* Motivo: conservar una señal ligera del canto redondeado sin deformar ni recortar la lectura horizontal de los nombres.
* Relación: ajuste de presentación tras la segunda miniatura parcial; no altera el STL ni el perfil.
* Resultado: ✅ cámara corregida; regeneración final pendiente.

## [2026-08-06]

* Archivo: inspección de `artifacts/patricia_eduardo_246mm/Patricia_y_Eduardo_246mm_preview.png`
* Cambio: se aprobó el encuadre y la lectura completa de los nombres, y se detectó que el conector entre el ampersand y “Eduardo” todavía es más largo de lo necesario.
* Motivo: refinar la única unión central visible antes del rebanado.
* Relación: tercera revisión visual; cantos, topología y tipografía ya son correctos.
* Resultado: ⚠️ presentación aprobada salvo el conector inferior; se agrandará y bajará ligeramente el ampersand para acortar la unión.

## [2026-08-06]

* Archivo: `tools/build_patricia_eduardo_sign.py`
* Cambio: el ampersand aumentó de 52 a 58 mm y su base bajó de Y=64 a Y=58 mm.
* Motivo: acercar sus trazos inferiores a “Eduardo” manteniendo el solape superior con “Patricia”, para reducir el puente central visible.
* Relación: refinamiento puntual posterior a la tercera inspección visual; no cambia el tamaño máximo de placa ni el perfil.
* Resultado: ✅ composición central ajustada; regeneración final pendiente.

## [2026-08-06]

* Archivo: `artifacts/patricia_eduardo_246mm/Patricia_y_Eduardo_246mm_REDONDEADO_A1.stl`, `.3mf`, `.png` y `_validacion.json`
* Cambio: se regeneraron los entregables definitivos con ampersand ampliado, redondeo escalonado y perfil equilibrado A1.
* Motivo: reemplazar todas las iteraciones visuales parciales por una composición legible y lista para laminado.
* Relación: aplica el refinamiento final del símbolo y conserva la cámara ya aprobada.
* Resultado: ✅ malla estanca de un solo cuerpo, 690.632 caras, 246,50×182,01×12 mm, 3MF íntegro y miniatura completa.

## [2026-08-06]

* Archivo: `artifacts/patricia_eduardo_246mm/Patricia_y_Eduardo_246mm_A1_CALIDAD_EQUILIBRADA.3mf`
* Cambio: se rebanó el proyecto final con Bambu Studio 02.07.01.62 y se verificaron en el G-code todos los parámetros críticos del perfil.
* Motivo: confirmar compatibilidad real con A1, ocupación de cama, duración, consumo y ausencia de salidas de error.
* Relación: cierre técnico posterior a la generación estanca y a la investigación oficial mediante Chrome DevTools.
* Resultado: ✅ código 0 y sin stderr; X=5,45–250,55 mm, 75 capas, 103,47 g y 4 h 30 min; 0,16 mm, tres paredes, 10% gyroid, Classic, Nearest, sin soporte, brim ni ironing confirmados en G-code.

## [2026-08-06]

* Archivo: `tools/build_patricia_eduardo_professional.py`
* Cambio: se creó desde cero un generador multiplaque para un conjunto armado exacto de 300×221,51×70 mm con letras de 12 mm y pies hasta 70 mm de profundidad; incorpora superficie frontal G1 continua, cuatro secciones de nombres, ampersand, tres travesaños adaptados de 14×3,4 mm, ranuras de 3,65 mm, dos pies desmontables, cuatro pines Ø4×12 mm y cuatro repuestos.
* Motivo: sustituir el proyecto anterior, cuyo redondeo escalonado y tamaño de 246,5 mm no satisfacen la nueva especificación profesional ni la referencia de acabado.
* Relación: conserva únicamente la tipografía base y los perfiles A1 investigados; cambia geometría, dimensiones, ensamblaje, estructura y empaquetado.
* Resultado: ⚠️ generador creado; ejecución, corrección de geometría, inspección visual, empaquetado y rebanado de cinco placas pendientes.

## [2026-08-06]

* Archivo: `artifacts/patricia_eduardo_profesional_300mm/*`
* Cambio: se ejecutó por primera vez el generador profesional y se produjeron 19 objetos, cinco placas, miniaturas, STLs, guía y reporte.
* Motivo: auditar dimensiones, cuerpos y empaquetado antes de abrir el proyecto en Bambu Studio.
* Relación: primera validación del diseño multiplaque recién creado; no reemplaza todavía al proyecto anterior.
* Resultado: ⚠️ parcial; X/Z y holguras resultaron correctos y sin interferencias, pero los remates circulares de los travesaños aumentaron Y a 225,51 mm y cuatro piezas quedaron con 2–3 cuerpos, por lo que los entregables se rechazan hasta corregirlos.

## [2026-08-06]

* Archivo: `tools/build_patricia_eduardo_professional.py`
* Cambio: los tres travesaños se recortan ahora estrictamente a Y=0–221,51 mm y sus fragmentos anchos se conectan al nervio central mediante filetes de 1,15 mm; las cuatro secciones de nombres reciben puentes posteriores de 2,2 mm situados sobre las ranuras y se vuelven a perforar después para no invadir los alojamientos.
* Motivo: corregir simultáneamente el exceso dimensional y los cuerpos separados detectados en la primera ejecución sin introducir uniones visibles en la cara frontal.
* Relación: corrección directa de la auditoría parcial; conserva medidas de pines, ranuras, travesaños y perfil.
* Resultado: ✅ correcciones geométricas implementadas; regeneración y nueva auditoría pendientes.

## [2026-08-06]

* Archivo: `artifacts/patricia_eduardo_profesional_300mm/*`
* Cambio: la segunda generación alcanzó exactamente 300×221,51×70 mm, eliminó todas las interferencias y dejó las 18 piezas imprimibles estancas y de un solo cuerpo; el primer intento de rebanar la placa 1 terminó con código `-52` sin salida diagnóstica.
* Motivo: pasar de la validación geométrica al control real del contenedor multiplaque en Bambu Studio.
* Relación: confirma que la corrección anterior resolvió altura y cuerpos; aísla el nuevo fallo al empaquetado/selección de placa, no a las mallas.
* Resultado: ⚠️ geometría aprobada y proyecto aún rechazado por Bambu Studio; se requiere diagnosticar la estructura 3MF multiplaque antes de rebanar.

## [2026-08-06]

* Archivo: `Patricia_y_Eduardo_300x221.51x70_A1_PROFESIONAL_MULTIPLACA.3mf`
* Cambio: se confirmó que `--slice 1` selecciona la primera placa y Bambu Studio generó G-code, pero ambas instancias usaron la malla izquierda aunque conservaron nombres distintos.
* Motivo: verificar el contenido real de la placa después de que `--info` aceptara el contenedor.
* Relación: el código `-52` anterior se debió a usar índice cero; el nuevo hallazgo demuestra además una colisión global porque todos los archivos externos declaraban `object id=1`.
* Resultado: ❌ empaquetado multiplaque rechazado; deben asignarse IDs de malla únicos a nivel de paquete antes de continuar con los demás rebanados.

## [2026-08-06]

* Archivo: `tools/build_patricia_eduardo_professional.py`
* Cambio: cada volumen externo recibe ahora un ID de malla global único (`object_id + 1000`), utilizado de forma consistente en el archivo de objeto, el componente principal y `source_object_id` de la configuración.
* Motivo: impedir que Bambu Studio resuelva todas las instancias contra la primera malla con ID 1.
* Relación: corrige la colisión descubierta al inspeccionar el G-code real de la placa 1; no modifica geometría ni colocación.
* Resultado: ✅ referencias 3MF corregidas; regeneración y repetición del rebanado pendientes.

## [2026-08-06]

* Archivo: validación Bambu de las placas 1–4 del proyecto profesional
* Cambio: las placas 1 y 2 se rebanaron con código 0 y conservaron sus mallas diferenciadas; la placa 3 terminó con `-52` y la 4 con `-50`, ambas sin salida de error.
* Motivo: validar individualmente cada placa después de corregir los IDs globales.
* Relación: confirma que el empaquetado de objetos quedó resuelto en nombres y geometrías; los fallos restantes se limitan a la colocación o imprimibilidad de las placas de estructura/accesorios.
* Resultado: ⚠️ placas de nombres aprobadas; placas 3 y 4 rechazadas y pendientes de diagnóstico geométrico/acomodo.

## [2026-08-06]

* Archivo: diagnóstico de `debug_arrange_p3.3mf`
* Cambio: se rebanó temporalmente la placa 3 con autoacomodo y se inspeccionó su `plate_3.json`; Bambu solo apoyaba en cama los tabs de 14×28 mm de los travesaños laterales y dejaba su cuerpo principal 4 mm elevado.
* Motivo: explicar el código `-52` pese a que las dimensiones XY cabían en la A1.
* Relación: el problema no es tamaño ni malla, sino reutilizar la orientación ensamblada —con tab posterior negativo— como orientación de impresión.
* Resultado: ❌ orientación de los travesaños laterales rechazada; deben invertirse en Z para apoyar el cuerpo completo y dejar el tab hacia arriba.

## [2026-08-06]

* Archivo: `tools/build_patricia_eduardo_professional.py`
* Cambio: los travesaños se espejan exclusivamente para impresión, apoyando su nervio completo en Z=0 y dejando el tab de pie hacia arriba; además se separaron ampersand, pies y pines en placas 4, 5 y 6, dejando el esquema no imprimible en la placa 7.
* Motivo: eliminar cuerpos elevados y aislar accesorios con orientaciones/alturas diferentes para obtener placas confiables y una placa específica de repuestos.
* Relación: corrige el diagnóstico de la placa 3 y mejora la trazabilidad de la placa 4 que devolvió `-50`.
* Resultado: ✅ orientación y organización multiplaque revisadas; regeneración y rebanado de seis placas pendientes.

## [2026-08-06]

* Archivo: `tools/build_patricia_eduardo_professional.py`
* Cambio: las placas virtuales usan ahora la cuadrícula real de Bambu Studio —tres columnas de 300 mm y filas Y negativas— en vez de una sola fila X; la placa 3 adopta además las coordenadas verificadas por el autoacomodo exitoso.
* Motivo: Bambu reconocía únicamente las tres primeras placas porque los accesorios 4–7 quedaban fuera de la cuadrícula virtual soportada, y la separación manual de travesaños devolvía `-52`.
* Relación: corrige la causa del `-50` en placas 4–6 y traslada al proyecto la colocación de placa 3 ya validada por rebanado.
* Resultado: ✅ mapeo virtual y posiciones corregidos; regeneración y rebanado final pendientes.

## [2026-08-06]

* Archivo: `C:\Users\yarteaga\Downloads\RecuerdosBoda\*.png`
* Cambio: se renombraron las 10 imágenes con prefijos secuenciales `01` a `10` y descripciones basadas en su contenido: nombres de pareja, detalle de impresión 3D, topper de pastel, número de mesa, marcador de lugar, colección, letreros, libro de firmas y empaque.
* Motivo: sustituir nombres genéricos de ChatGPT por nombres legibles y mantener una secuencia temática ordenable.
* Relación: primera modificación registrada para `RecuerdosBoda`; el historial no contenía intentos previos sobre esta carpeta.
* Resultado: ✅ 10 archivos PNG renombrados correctamente, sin colisiones ni cambios de tamaño.

## [2026-08-06]

* Archivo: `C:\Users\yarteaga\Downloads\RecuerdosBoda\11_catalogo_recuerdos_para_bodas.png`
* Cambio: se renombró la undécima imagen, antes llamada `ChatGPT Image 6 ago 2026, 10_01_09 a.m..png`, de acuerdo con su contenido de catálogo.
* Motivo: completar la secuencia y eliminar la referencia a ChatGPT del nombre descargado.
* Relación: amplía el renombrado previo de las primeras diez imágenes; este archivo apareció después del inventario inicial.
* Resultado: ✅ imagen incorporada como número `11`; no quedan archivos con `ChatGPT` en el nombre y el contenido visual permanece intacto.

## [2026-08-06]

* Archivo: `C:\Users\yarteaga\Downloads\RecuerdosBoda\*.png`
* Cambio: se recodificaron los 11 PNG sin metadatos ni bloques de procedencia C2PA/OpenAI, reemplazando los archivos solicitados después de validar cada copia temporal.
* Motivo: eliminar la marca incrustada de ChatGPT detectada en los archivos descargados.
* Relación: complementa el renombrado de la serie; no elimina ni modifica el logotipo visible de Lithora.
* Resultado: ✅ 11 imágenes limpiadas; dimensiones, modo RGB y hash de píxeles permanecieron idénticos en cada archivo.

## [2026-08-06]

* Archivo: `C:\Users\yarteaga\Downloads\RecuerdosBoda\12_*.png` a `21_*.png`
* Cambio: se renombraron diez imágenes nuevas con numeración continua y descripciones basadas en cada producto: llavero, placa, imán, caja, marcador de lugar, portavela, figura de novios, maceta, abridor y set de recuerdos.
* Motivo: integrar la nueva tanda a la secuencia existente y eliminar `ChatGPT Image` de sus nombres.
* Relación: continúa la organización previa de los archivos `01` a `11` sin modificar los ya procesados.
* Resultado: ✅ diez PNG incorporados como `12`–`21`, sin colisiones ni referencias a ChatGPT en sus nombres.

## [2026-08-06]

* Archivo: `C:\Users\yarteaga\Downloads\RecuerdosBoda\12_*.png` a `21_*.png`
* Cambio: se recodificaron sin metadatos los diez PNG nuevos y se validó cada archivo temporal antes de sustituir el original.
* Motivo: eliminar los bloques de procedencia C2PA/OpenAI de la nueva tanda descargada desde ChatGPT.
* Relación: aplica el mismo procedimiento validado previamente para los archivos `01` a `11`.
* Resultado: ✅ diez imágenes limpiadas; todas conservaron exactamente 1254 × 1254 px, modo RGB y el mismo hash de píxeles.

## [2026-08-06]

* Archivo: `C:\Users\yarteaga\Downloads\Zelda link\01_*.png` a `10_*.png`
* Cambio: se renombraron diez imágenes de Link con numeración secuencial y descripciones de sus escenas: estudio, exterior, detalles del escudo, escala en mano, taller, colección, mapa, base Trifuerza y escritorio.
* Motivo: sustituir los nombres genéricos `openart-image_*` y ordenar la colección por contexto.
* Relación: primera modificación registrada para la carpeta `Zelda link`; el historial no contenía intentos previos sobre ella.
* Resultado: ✅ diez PNG renombrados sin colisiones; no quedan referencias a OpenArt en los nombres.

## [2026-08-06]

* Archivo: `C:\Users\yarteaga\Downloads\Zelda link\01_*.png` a `10_*.png`
* Cambio: se recodificaron los diez PNG sin bloques C2PA, XMP ni IPTC, validando cada copia temporal antes de sustituir el archivo original.
* Motivo: eliminar la procedencia incrustada asociada con OpenArt sin editar el contenido visual.
* Relación: complementa el renombrado inmediatamente anterior; conserva los logotipos visibles de Lithora3D en las imágenes que ya los contenían.
* Resultado: ✅ diez imágenes limpiadas; todas conservaron exactamente 4096 × 4096 px, modo RGB y el mismo hash de píxeles.

## [2026-08-04]

* Archivo: `C:\Users\yarteaga\Downloads\Borrador de llavero (3)_RELIEVE.3mf`
* Cambio: se creó una copia no destructiva con relieve escalonado: texto exterior a 2,4 mm, detalles oscuros independientes del escudo a 2,8 mm y superficies claras del escudo, lambrequines y casco a 3,2 mm; base, ojal, franjas y mallas XY permanecen intactos.
* Motivo: reproducir la jerarquía de volumen de la referencia adjunta sin redibujar el emblema, perder los dos colores del proyecto ni introducir voladizos que requieran soporte.
* Relación: primera modificación registrada para este llavero; el historial no contenía intentos previos sobre `Borrador de llavero (3).3mf`.
* Resultado: ✅ copia validada con 93 sólidos y 177.520 caras idénticas en XY al original, dos extrusores conservados, 68 componentes elevados, dimensiones de 54 × 76,10 × 3,20 mm y rebanado correcto en Bambu Studio 02.07.01.62 a 16 capas sin soportes ni advertencias.

## [2026-08-04]

* Archivo: `C:\Users\yarteaga\Downloads\Borrador de llavero (3)_RELIEVE.3mf` (`Metadata/plate_1.png`, `Auxiliaries/.thumbnails/thumbnail_3mf.png`)
* Cambio: se sustituyeron las miniaturas planas heredadas por la vista isométrica generada desde la geometría con relieve.
* Motivo: hacer que la previsualización del proyecto muestre los nuevos niveles del texto y el escudo en vez de representar la versión original plana.
* Relación: actualización visual posterior al relieve escalonado aplicado en el cambio anterior; no modifica mallas, colores ni alturas.
* Resultado: ✅ ambas miniaturas internas actualizadas con una imagen de 512 × 512 px revisada visualmente.

## [2026-08-04]

* Archivo: `C:\Users\yarteaga\Downloads\Borrador de llavero (5)_RELIEVE.3mf`
* Cambio: se creó una copia no destructiva del llavero multicolor con 24 letras blancas a 2,4 mm, diez detalles rojos/azules del escudo a 2,8 mm y 25 superficies amarillas/blancas del escudo, lambrequines y casco a 3,2 mm; aro, franjas, base y ojal permanecen a sus alturas originales.
* Motivo: aplicar la misma jerarquía de relieve de la referencia y del llavero `(3)`, reclasificando la geometría específica de esta variante de cuatro colores en vez de reutilizar IDs incompatibles.
* Relación: mejora equivalente al archivo `(3)_RELIEVE`, adaptada a los 90 sólidos y cuatro extrusores de `Borrador de llavero (5).3mf`.
* Resultado: ✅ copia validada con 90 sólidos, 175.952 caras y cuatro extrusores idénticos al original; 59 componentes elevados, dimensiones de 54 × 73,53 × 3,20 mm y rebanado correcto en Bambu Studio 02.07.01.62 a 16 capas, sin soportes ni advertencias.

## [2026-08-04]

* Archivo: `C:\Users\yarteaga\Downloads\Borrador de llavero (5)_RELIEVE.3mf` (`Metadata/plate_1.png`, `Auxiliaries/.thumbnails/thumbnail_3mf.png`)
* Cambio: se reemplazaron las miniaturas originales por la vista isométrica multicolor de la geometría con relieve.
* Motivo: mostrar en la previsualización el escalonamiento real entre placa, texto, detalles y escudo.
* Relación: actualización visual posterior a la adaptación de relieve para la variante `(5)`; no modifica mallas, colores ni alturas.
* Resultado: ✅ dos miniaturas internas de 512 × 512 px actualizadas y revisadas visualmente.

## [2026-08-04]

* Archivo: `C:\Users\yarteaga\Desktop\GC_HDMI_HOLDER_ACOSTADO.3mf`
* Cambio: se creó una copia no destructiva del proyecto y se giró 90° únicamente la pieza alta `SD2SP2 Cover.STL`, apoyando en la cama su cara posterior plana; la otra pieza y las mallas permanecen intactas.
* Motivo: reducir la altura de esa pieza de 51,45 mm a 13,75 mm, ampliar el contacto con la cama y evitar el gran soporte tipo árbol de la orientación vertical.
* Relación: primera orientación aplicada a `GC_HDMI_HOLDER.3mf`; el historial no contenía intentos previos para este modelo y el archivo original se conservó sin cambios.
* Resultado: ✅ ZIP íntegro y mallas idénticas al original; 218 vértices de la cara plana quedaron exactamente en Z=0; Bambu Studio 02.07.01.62 rebanó sin advertencias en 109 capas, 9,39 g y 35 min 38 s, frente a 371 capas, 10,43 g y 1 h 00 min 40 s de la orientación vertical.

## [2026-08-03]

* Archivo: Programador de tareas de Windows, `\Launch Adobe CCXProcess`
* Cambio: se desactivó el disparador diario de CCXProcess, configurado desde el 14 de mayo de 2026 para ejecutarse cada día a las 17:45.
* Motivo: la tarea se ejecutó a las 17:45:01 inmediatamente antes del cuadro `VulcanMessageLib.node` / `Expression: vulcan_` y era el único inicio diario activo de CCXProcess; los inicios equivalentes del registro ya estaban deshabilitados.
* Relación: primer tratamiento del incidente; no existían intentos previos sobre CCXProcess, Vulcan o la aserción de Visual C++ en este historial.
* Resultado: ✅ tarea conservada de forma reversible pero en estado `Disabled`; no habrá una nueva ejecución diaria mientras se repara Creative Cloud.

## [2026-08-03]

* Archivo: `C:\Users\yarteaga\Downloads\creative_cloud_uninstallerwin.zip`
* Cambio: se descargó desde Adobe Help Center el reparador oficial actual para Windows de 64 bits y se calculó su SHA-256 `4D01CC198B15234F0F08DDA23F0001C6314992CF29F01B21828C650477412AC6`.
* Motivo: el desinstalador local de 32 bits buscó `AdobePIM.dll` en la rama `Program Files (x86)`, pero la instalación activa de Creative Cloud y esa biblioteca son de 64 bits; por eso el intento local terminó sin mostrar la opción Reparar.
* Relación: continúa el tratamiento del fallo `VulcanMessageLib.node` después de desactivar su ejecución diaria.
* Resultado: ✅ paquete oficial de 1,727,665 bytes descargado mediante Chrome DevTools desde la URL documentada por Adobe; extracción y reparación pendientes.

## [2026-08-03]

* Archivo: `C:\Users\yarteaga\Downloads\Adobe_Creative_Cloud_Uninstaller_64bit\Creative Cloud Uninstaller.exe`
* Cambio: se extrajo el reparador oficial de 64 bits en una carpeta nueva y se verificó su firma Authenticode.
* Motivo: ejecutar la ruta de reparación compatible con la instalación x64, en lugar del desinstalador local x86 que no puede cargar la biblioteca x64 `AdobePIM.dll`.
* Relación: usa el ZIP oficial descargado en el cambio inmediatamente anterior; no elimina Photoshop, Illustrator ni archivos del usuario.
* Resultado: ✅ ejecutable de 3,655,912 bytes, versión 5.2.0.1, firma válida de Adobe Inc.; ejecución de Reparar pendiente.

## [2026-08-03]

* Archivo: reparador extraído en `C:\Users\yarteaga\Downloads\Adobe_Creative_Cloud_Uninstaller_64bit\`
* Cambio: el ejecutable oficial inició el flujo de desinstalación en vez de una reparación, no pudo cargar su copia temporal de `AdobePIM.dll`, no eliminó las carpetas de Creative Cloud y después se autoeliminó junto con esa DLL temporal.
* Motivo: intentar la reparación recomendada por Adobe con el paquete de 64 bits después de que el desinstalador local no pudiera abrirse.
* Relación: este intento no debe repetirse; el ZIP original permanece disponible para auditoría, y los hashes/tamaños de CCXProcess, VulcanMessageLib, VulcanWrapper y AdobePIM instalados no cambiaron.
* Resultado: ❌ flujo fallido sin desinstalar Creative Cloud, Photoshop ni Illustrator; se conserva la mitigación reversible de la tarea diaria deshabilitada y se requiere una solución distinta.

## [2026-08-03]

* Archivo: `C:\Users\yarteaga\Downloads\ACCCx6_10_0_252_3.zip`
* Cambio: se descargó el instalador autónomo oficial de Adobe Creative Cloud Desktop 6.10.0.252.3 para Windows x64 y se calculó su SHA-256 `6472F7F2C1E5F205F8EF5439E51FAD61008D9434DF4D0D32AFEDE51FF71FA655`.
* Motivo: actualizar/reinstalar sobre Creative Cloud 6.9.0.620 para reponer componentes IPC y corregir la inicialización diaria de Vulcan sin desinstalar Photoshop ni Illustrator.
* Relación: solución distinta después de que ambos desinstaladores no pudieran cargar `AdobePIM.dll`; Adobe publica 6.10.0 como versión directa más reciente para Windows 10 1903 o posterior.
* Resultado: ✅ ZIP oficial de 330,725,422 bytes descargado mediante Chrome DevTools desde `ccmdls.adobe.com`; extracción e instalación pendientes.

## [2026-08-03]

* Archivo: `C:\Users\yarteaga\Downloads\Adobe_Creative_Cloud_6.10.0.252.3_x64\Set-up.exe`
* Cambio: se extrajo el instalador autónomo x64 en una carpeta nueva y se verificó su firma Authenticode.
* Motivo: preparar una reinstalación limpia encima de Creative Cloud 6.9 sin reutilizar el desinstalador roto ni copiar DLL manualmente.
* Relación: usa el ZIP 6.10.0 oficial descargado en el cambio anterior; la firma y el origen evitan ejecutar binarios de terceros.
* Resultado: ✅ `Set-up.exe` de 3,379,672 bytes, versión 2.14.0.71 y firma válida de Adobe Inc.; instalación pendiente.

## [2026-08-01]

* Archivo: `tools/optimize_bambu_project.py`
* Cambio: al transferir un perfil completo se conservan también las coordenadas originales de la torre de limpieza de cada proyecto.
* Motivo: el primer rebanado de Bely con la posición de torre de Pepo detectó conflicto de G-code por la diferencia de ancho y ubicación entre las figuras.
* Relación: mejora la transferencia de plantilla incorporada para Bely; conserva perfil A1, matriz, geometría y pintura.
* Resultado: ✅ posición específica preservada; regeneración y nuevo rebanado pendientes.

## [2026-08-01]

* Archivo: `Bely_Adorno_Lapiz_50mm_PROYECTO_BAMBU_OPTIMIZADO_CALIDAD.3mf` y `Bely_Adorno_Lapiz_50mm_PROYECTO_BAMBU_OPTIMIZADO_PRODUCCION.3mf`
* Cambio: se regeneraron ambas copias conservando `wipe_tower_x=15` y `wipe_tower_y=145` del proyecto Bely.
* Motivo: separar la torre de la figura y resolver el conflicto detectado por el primer rebanado con coordenadas heredadas de Pepo.
* Relación: corrección posterior al resultado `-101` de Bambu Studio; no modifica geometría, pintura ni parámetros funcionales.
* Resultado: ✅ proyectos corregidos; nuevo rebanado pendiente.

## [2026-08-01]

* Archivo: `audits/Bely_optimizacion_multicolor_Bambu_A1_2026-08-01.md`
* Cambio: se documentaron en 15 secciones el diagnóstico del perfil parcial X1C, la transferencia a A1, matriz específica, resultados medidos, ahorro, riesgos, pruebas y estrategia de lotes.
* Motivo: entregar para Bely la misma trazabilidad técnica ofrecida con Pepo y separar la referencia A1 normalizada de los dos proyectos finales.
* Relación: incorpora las rebanadas reales 0,20/0,22/0,24 y las fuentes oficiales ya verificadas con Chrome DevTools durante la optimización de Pepo.
* Resultado: ✅ informe creado; auditoría final de archivos pendiente.

## [2026-08-01]

* Archivo: `Bely_Adorno_Lapiz_50mm_PROYECTO_BAMBU_OPTIMIZADO_CALIDAD.3mf` y `Bely_Adorno_Lapiz_50mm_PROYECTO_BAMBU_OPTIMIZADO_PRODUCCION.3mf`
* Cambio: se verificaron CRC, hashes de malla y pintado, colores, perfil A1, matriz, torre y rebanado real con Bambu Studio 02.07.01.62.
* Motivo: confirmar que los dos proyectos finales abren, generan G-code y solo cambian el perfil de impresión autorizado.
* Relación: cierra la corrección de posición de torre y sincroniza las cifras del informe con `result.json` y las cabeceras G-code.
* Resultado: ✅ malla y pintura idénticas al original; Calidad 227 capas/496 cambios/117,78 g/13 h 42 min; Producción 208 capas/451 cambios/110,14 g/12 h 29 min; cero advertencias.

## [2026-08-01]

* Archivo: `C:\Users\yarteaga\Documents\Personal\Negocios\03-modelos\adorno_lapiz\Bely_Adorno_Lapiz_50mm_PROYECTO_BAMBU_OPTIMIZADO_PRODUCCION.3mf`
* Cambio: se generó una copia de producción con el perfil completo A1 de Pepo, altura de capa de 0,24 mm y los mismos parámetros multicolor conservadores adaptados a Bely.
* Motivo: ofrecer una variante más rápida para fabricación por lotes sin alterar la figura, el agujero ni los cuatro colores.
* Relación: comparte perfil, torre, cebado y matriz con la variante de calidad; únicamente aumenta la capa de 0,22 a 0,24 mm.
* Resultado: ✅ copia no destructiva creada; rebanado y verificación binaria pendientes.
## [2026-08-06]

* Archivo: artifacts/patricia_eduardo_profesional_300mm/Patricia_y_Eduardo_300x221.51x70_A1_PROFESIONAL_MULTIPLACA.3mf
* Cambio: validación real de las seis placas imprimibles con Bambu Studio 02.07.01.62; todas terminaron con código 0 y sin errores en stderr. Tiempos/peso estimados: P1 4h32m57s/79.63 g, P2 4h12m44s/73.07 g, P3 1h41m15s/26.27 g, P4 1h16m25s/19.38 g, P5 1h41m17s/26.42 g, P6 18m59s/1.51 g.
* Motivo: comprobar que el proyecto sea realmente laminable en la Bambu Lab A1 y no sólo una representación visual.
* Relación: confirma la corrección previa de IDs internos, coordenadas de placas y orientación de travesaños.
* Resultado: ✅ éxito; 13h43m37s y 226.28 g estimados en total
## [2026-08-06]

* Archivo: tools/build_patricia_eduardo_professional.py
* Cambio: integración de dos orejas sacrificiales de 0.20 mm por pata trasera, generadas sólo en la orientación de impresión.
* Motivo: aumentar la estabilidad de las piezas de 64 mm de alto sin usar un brim global ni marcar superficies visibles.
* Relación: mejora específica derivada del laminado satisfactorio de la placa 5; no cambia la geometría ensamblada.
* Resultado: ✅ éxito
## [2026-08-06]

* Archivo: artifacts/patricia_eduardo_profesional_300mm/Patricia_y_Eduardo_300x221.51x70_A1_PROFESIONAL_MULTIPLACA.3mf
* Cambio: regeneración completa del proyecto con orejas de adhesión en la placa 5 y actualización automática de STL, guía y reporte de validación.
* Motivo: incorporar la mejora de estabilidad manteniendo exactamente 300 × 221.51 × 70 mm en el conjunto armado.
* Relación: deriva del ajuste de `foot_manifolds`; SHA-256 actual e468540f732be8ee9967cf4780bd634571aad6961aa33b97b7a26a9880b661c7.
* Resultado: ✅ éxito; 18 piezas imprimibles watertight, de un solo cuerpo y dentro de 256 × 256 × 256 mm
## [2026-08-06]

* Archivo: artifacts/patricia_eduardo_profesional_300mm/slice_final/plate_1.gcode a plate_6.gcode
* Cambio: rebanado final de las seis placas contra el 3MF con orejas sacrificiales; todas terminaron con código 0. Estimaciones: P1 4h32m57s/79.63 g, P2 4h12m44s/73.07 g, P3 1h41m15s/26.27 g, P4 1h16m25s/19.38 g, P5 1h42m22s/26.64 g, P6 18m59s/1.51 g.
* Motivo: verificar el archivo exacto que se entregará después de la última modificación geométrica.
* Relación: sustituye la validación previa de la placa 5 y confirma que las orejas sólo añaden 1m05s y 0.22 g.
* Resultado: ✅ éxito; total estimado 13h44m42s y 226.50 g
## [2026-08-06]

* Archivo: tools/build_patricia_eduardo_professional.py
* Cambio: exportación de dos mallas auxiliares claramente marcadas `NO_IMPRIMIR`: vista frontal y conjunto ensamblado completo.
* Motivo: permitir inspección y render del redondeo real, además de documentar la relación entre letras, travesaños y pies sin añadir objetos a las placas productivas.
* Relación: complementa la placa 7 de esquema y la guía bidimensional; no cambia el 3MF ni las piezas imprimibles.
* Resultado: ✅ éxito
## [2026-08-06]

* Archivo: tools/render_patricia_eduardo_professional.py
* Cambio: creación de un renderizador Blender dedicado con material PLA blanco cálido, fondo negro mate, iluminación de contorno y suavizado selectivo de las superficies redondeadas.
* Motivo: mostrar de forma verificable el acabado tridimensional real solicitado, que no puede evaluarse correctamente en una captura cenital plana del laminador.
* Relación: consume la nueva malla auxiliar frontal `NO_IMPRIMIR`; no modifica la geometría de fabricación.
* Resultado: ✅ éxito
## [2026-08-06]

* Archivo: tools/render_patricia_eduardo_professional.py
* Cambio: lectura explícita de los argumentos situados después del separador `--` de Blender.
* Motivo: el primer lanzamiento recibió también los argumentos internos de Blender y `argparse` no encontró `--input/--output`.
* Relación: corrección directa del primer intento de render; no afecta modelo ni proyecto 3MF.
* Resultado: ✅ corregido
## [2026-08-06]

* Archivo: tools/render_patricia_eduardo_professional.py
* Cambio: búsqueda del shader Principled por tipo de nodo en vez de por nombre localizado.
* Motivo: Blender en español no expone el nodo con el nombre inglés `Principled BSDF`, aunque conserva el tipo estable `BSDF_PRINCIPLED`.
* Relación: corrige la excepción del segundo lanzamiento de render.
* Resultado: ✅ corregido
## [2026-08-06]

* Archivo: tools/render_patricia_eduardo_professional.py
* Cambio: recalibración de potencia de las tres luces de área para una escena que conserva milímetros como unidades Blender.
* Motivo: el primer render válido quedó subexpuesto porque la escala física era aproximadamente 1000 veces mayor que una escena estándar en metros.
* Relación: ajuste exclusivamente visual posterior a inspeccionar el PNG; no modifica las mallas.
* Resultado: ✅ corregido
## [2026-08-06]

* Archivo: generador-llaveros-3d/assets/app/geometria.js
* Cambio: se añadió `leftFilledAnchor`, que localiza material real de la silueta cerca de la altura preferida del aro en vez de confiar en el extremo global del bounding box.
* Motivo: en tipografías cursivas el punto más izquierdo puede pertenecer a un remate situado arriba o abajo; usarlo para el aro deja la agarradera flotando.
* Relación: primera corrección registrada para la agarradera separada observada con `JulioCesar` y la fuente `LeckerliOne-Regular`.
* Resultado: ✅ helper geométrico implementado; integración y validación pendientes
## [2026-08-06]

* Archivo: generador-llaveros-3d/assets/app/geometria.js (`buildOutlineTile`)
* Cambio: el centro del aro del estilo Contorno se calcula desde el borde izquierdo realmente lleno a su altura y se fuerza una superposición estructural de 1.0–1.8 mm, limitada por el espesor útil de la pared.
* Motivo: fusionar la agarradera con el cuerpo incluso cuando el mínimo X de una fuente cursiva está en un remate alejado de la altura media.
* Relación: integra `leftFilledAnchor` en el caso exacto reportado por el usuario.
* Resultado: ✅ corrección implementada; validación visual y topológica pendientes
## [2026-08-06]

* Archivo: generador-llaveros-3d/assets/app/geometria.js (`buildDoubleOutlineTile` y exports)
* Cambio: se aplicó el mismo anclaje por material real y superposición segura al estilo Doble; `leftFilledAnchor` quedó exportado para pruebas.
* Motivo: evitar que el mismo defecto reaparezca al cambiar de Contorno a Doble con tipografías cursivas.
* Relación: generaliza de forma controlada la corrección del aro sin alterar Placa, Forma, QR, imagen o nombre para lápiz.
* Resultado: ✅ éxito
## [2026-08-06]

* Archivo: tests/generator-keyring-anchor.test.mjs
* Cambio: se añadieron regresiones para una cursiva cuyo remate define el mínimo X lejos de la altura del aro y para una altura preferida que cae en un hueco.
* Motivo: impedir que una futura refactorización vuelva a separar la agarradera o la ancle en aire.
* Relación: prueba directamente el helper exportado por la corrección actual.
* Resultado: ✅ pruebas creadas
## [2026-08-06]

* Archivo: audits/llavero-aro-corregido-2026-08-06.png y validación local del generador
* Cambio: se reprodujo y verificó con Chrome DevTools el caso `JulioCesar`, fuente subida `LeckerliOne-Regular`, estilo Contorno y borde 2.0 mm; el aviso `islands-warn` quedó oculto porque la base pasó de dos islas a una. También se cambió a Doble y permaneció sin piezas sueltas.
* Motivo: comprobar la corrección en el navegador real con la misma fuente y parámetros de la captura, no sólo mediante análisis estático.
* Relación: valida `leftFilledAnchor` y su integración en ambos estilos de contorno.
* Resultado: ✅ aro visual y topológicamente unido; captura guardada. URL inspeccionada con DevTools: http://127.0.0.1:8011/generador-llaveros-3d/

## [2026-08-06]

* Archivo: suite de pruebas del repositorio
* Cambio: se ejecutaron `node --check`, `git diff --check`, las dos regresiones nuevas y `npm test` completo.
* Motivo: descartar errores sintácticos, de espacios o regresiones fuera del generador.
* Relación: cierre técnico de la corrección de la agarradera.
* Resultado: ✅ 91 de 91 pruebas aprobadas; consola del navegador sin errores (sólo advertencia heredada de deprecación del build clásico de Three.js)

## [2026-08-07]

* Archivo: generador-llaveros-3d/assets/app/geometria.js
* Cambio: la tapa oculta del túnel pasó de casilla booleana a extremo elegible (`open`/`start`/`end`) mediante dos funciones puras nuevas: `normalizePencilCapEnd` (migra la opción heredada) y `pencilCapPlacement` (coloca la tapa y recorta el túnel; `end` es el espejo exacto de `start`). Las bocas escalonadas de 0.35 mm ahora solo se generan en extremos abiertos; el lado tapado las pierde y su tramo lo absorbe el núcleo calibrado.
* Motivo: la referencia clásica de MakerWorld tapa el FINAL del nombre; nuestro código solo sabía tapar el arranque, y enterrar una boca ensanchada bajo la tapa debilitaba la fusión tubo-tapa.
* Relación: implementa A2 del plan aprobado en specs/lapiz-configurable/informe-y-propuesta.md; el caso `open` produce el contrato geométrico intacto (verificado por regresión).
* Resultado: ✅ éxito
## [2026-08-07]

* Archivo: generador-llaveros-3d/assets/app/geometria.js
* Cambio: `buildPencilNameTile` devuelve `volumeMM3` (volumen por regiones 2D de Clipper × altura, con `teardropAreaMM2`, `circularSegmentAreaMM2` y `estimatePencilVolumeMM3` descontando el tramo del anillo ya cubierto por las pieles) y `pencil{axisY, centerZ, innerR, xStart, xEnd, capEnd}` con el hueco real del túnel. `layoutTiles` expone `offsets` por pieza.
* Motivo: alimentar el "≈ X g" del visor sin integrar la sopa de triángulos (los sólidos se solapan a propósito y sobrecontarían) y dar al visor las coordenadas exactas para dibujar el lápiz de ejemplo.
* Relación: D1 del plan; los solapes de diseño de 0.25–0.35 mm se ignoran documentadamente (±10 %).
* Resultado: ✅ éxito
## [2026-08-07]

* Archivo: generador-llaveros-3d/assets/app/geometria.js (`buildPencilFitTestTile`)
* Cambio: builder nuevo del testigo de ajuste: tres túneles de 12 mm con el diámetro elegido −0.3/exacto/+0.3 sobre base común de 1.2 mm, sin bocas escalonadas, con barras en relieve 1/2/3 hechas con rectángulos puros y rótulo numérico opcional si la fuente trae todos los glifos.
* Motivo: la causa número uno de piezas tiradas es un lápiz fuera de medida; una prueba de minutos elimina el riesgo antes de imprimir la placa completa.
* Relación: B2 del plan; sin bocas para que el testigo mida el diámetro calibrado real.
* Resultado: ✅ éxito
## [2026-08-07]

* Archivo: generador-llaveros-3d/assets/app/creador.js
* Cambio: estado `pencilCapEnd` (con migración del boolean heredado ANTES de `sanitizeSnapshotState`, validación de dominio y escritura del boolean para compatibilidad hacia atrás), selector de tapa de tres botones, lápiz de ejemplo semitransparente por pieza (hexagonal, con cono de madera y mina; entra por el lado abierto y se detiene en la tapa; `part:'ghost'` lo excluye de exports y colores; se inserta DESPUÉS del encuadre para no alterar Box3 ni HUD), gramos estimados en el HUD con la densidad del perfil, CTA de WhatsApp dinámico con producto/nombres/medida, aviso de texto consciente del producto y nota del perfil de lápiz en los tres modos de impresión.
* Motivo: hacer el modo lápiz configurable y comprensible a golpe de vista, sin tocar la geometría imprimible.
* Relación: A2, C1, C4, D1 y D2 del plan aprobado.
* Resultado: ✅ éxito
## [2026-08-07]

* Archivo: generador-llaveros-3d/assets/app/creador.js (lápiz de ejemplo, segunda pasada)
* Cambio: el lápiz de ejemplo dejó el modo rayos-X (`depthTest:false` dibujaba el lápiz ENCIMA de la pieza desde cualquier ángulo) y ahora se ocluye como un lápiz real; sobresale menos (22 mm, 14 mm con varias columnas), se puede ocultar con la casilla `showPencilGhost` y `updatePencilHint` avisa cuando las letras son más bajas que el túnel con su pared y sugiere el tamaño que lo esconde.
* Motivo: el usuario comparó contra la pieza clásica de referencia y el visor comunicaba otra cosa: un tubo gigante flotando sobre el modelo y el túnel asomando entre letras de 12 mm.
* Relación: corrección inmediata sobre C1 tras la retroalimentación con captura; la sugerencia de tamaño reproduce la proporción de la referencia (letras ≥ 1.3× el envolvente del túnel).
* Resultado: ✅ verificado en Chrome real vía CDP: oclusión correcta, tope al final con letras de 16 mm replica la lectura del clásico; captura en audits/lapiz-tope-final-referencia-2026-08-07.png
## [2026-08-07]

* Archivo: generador-llaveros-3d/plantilla.py y generador-llaveros-3d/index.html (regenerado)
* Cambio: PRODUCTO_LAPIZ ahora trae presets con nombres humanos (Lápiz de escuela/Más apretado/Jumbo grueso), el selector de tapa, la casilla del lápiz de ejemplo, el botón de prueba de ajuste y el aviso de tamaño; FAQ +2 preguntas de lápiz (14 en total), paso 1 y caso Escuela mencionan lápices, featureList +2 y title/description/OG/Twitter incluyen "nombres para lápiz". index.html se regeneró con `python plantilla.py` (40.2 KB, 1204 palabras indexables).
* Motivo: cada control nuevo del lápiz debe vivir en la plantilla o la siguiente regeneración lo borra; la página no indexaba el producto lápiz que la app ya ofrece.
* Relación: fases 4 del plan; el portable no se tocó.
* Resultado: ✅ éxito
## [2026-08-07]

* Archivo: generador-llaveros-3d/assets/app/estilos.css
* Cambio: estilos de `.pencil-group-label` y `.fit-test-btn` (botón punteado full-width con jerarquía secundaria); `#pencil-cap-list` reutiliza `.pencil-fit-list`.
* Motivo: los controles nuevos debían leerse como parte del sistema existente, no como parches.
* Relación: acompaña la UI nueva de plantilla.py.
* Resultado: ✅ éxito
## [2026-08-07]

* Archivo: tests/generator-pencil-tunnel.test.mjs, tests/static-audit.test.mjs y sitemap.xml
* Cambio: seis regresiones nuevas (simetría/extremos del perfil de lágrima, área analítica vs shoelace, migración del boolean, espejo de la tapa en `end` con recorte y boca apagada, cota de 1.35 mm en túneles cortos, volumen sintético ±1 % y 7.2–7.7 g); la auditoría estática valida `<lastmod>` con patrón de fecha genérico en vez de anclar 2026-08-05; lastmod del generador → 2026-08-07.
* Motivo: proteger el contrato geométrico nuevo y poder actualizar el lastmod de una sola página sin falsear las demás.
* Relación: fases 5 y 6 del plan.
* Resultado: ✅ 97 de 97 pruebas aprobadas (91 previas + 6 nuevas)
## [2026-08-07]

* Archivo: scripts/serve-local.mjs y .claude/launch.json
* Cambio: el servidor local acepta `PORT` como respaldo de `LITHORA_PORT` y el lanzador usa `autoPort`; se retiró la configuración "llaveros" que apuntaba a un scratchpad de una sesión anterior.
* Motivo: el puerto 8000 estaba ocupado por otro proceso local y el visor de verificación necesita levantar en un puerto asignado.
* Relación: infraestructura de validación, sin efecto en producción.
* Resultado: ✅ éxito
## [2026-08-07]

* Archivo: validación de la entrega del modo lápiz configurable
* Cambio: `node --check` de los tres JS de la app, `npm run validate` completo, regeneración de plantilla con diff limpio y verificación en Chrome real vía CDP: tres estados de tapa reconstruyen sin errores de consola (solo la advertencia heredada de three.js), lápiz de ejemplo con oclusión y dirección correctas por tapa, HUD con gramos (2 nombres ≈ 18.3 g; ISABELA 16 mm ≈ 21.3 g), presets y botón de prueba habilitados, WhatsApp dinámico con nombres y medida, y migración real de un guardado sembrado con `pencilClosedEnd:true` que cargó como "Tope al inicio" con preset 8.3.
* Motivo: cierre técnico de la entrega conforme al plan aprobado.
* Relación: evidencia en audits/lapiz-tope-final-referencia-2026-08-07.png.
* Resultado: ✅ 97 de 97 pruebas y verificación en navegador aprobadas
## [2026-08-07]

* Archivo: generador-llaveros-3d/assets/app/geometria.js, creador.js, plantilla.py, index.html (regenerado), estilos.css y tests
* Cambio: ajuste tras retroalimentación con captura del usuario. (1) La migración del guardado booleano ahora honra la etiqueta que el usuario leía ("Tapar el FINAL del túnel" → `end`), no lo que el código viejo hacía por dentro; el usuario definió la regla: el lado tapado es donde TERMINA el nombre. (2) `pencilCapEnd` por defecto pasa de `open` a `end` y el botón "Tope al final" encabeza el grupo. (3) Forma del hueco elegible vía `pencilTunnelStyle`: `round` (círculo puro como los toppers clásicos, nuevo DEFAULT; el cuerpo baja de centerZ+√2·outerR a centerZ+outerR) o `teardrop` (techo 45° sin soportes, conservado como alternativa). `roundProfile`, `pencilBodyTopZ` y `normalizePencilTunnelStyle` son puras y exportadas; tubos, tapón, testigo de ajuste y estimación de gramos respetan la forma elegida (el círculo descuenta dos casquetes de piel, la lágrima casquete + cuña).
* Motivo: el usuario comparó contra su 3MF de referencia: el hueco debía ser redondo y el tope al final del nombre; la lágrima queda como opción para impresoras que sufran los puentes.
* Relación: cierra la paridad con la referencia de MakerWorld analizada en specs/lapiz-configurable/informe-y-propuesta.md; segunda iteración de la entrega del modo lápiz.
* Resultado: ✅ 99 de 99 pruebas (2 nuevas de perfil redondo y normalización); verificado en Chrome real: con almacenamiento limpio el default es Tope al final + Redondo, ISABELA 16 mm muestra el lápiz entrando por la boca redonda del inicio y deteniéndose en el final tapado; captura en audits/lapiz-hueco-redondo-tope-final-2026-08-07.png
## [2026-08-07]

* Archivo: generador-llaveros-3d/assets/app/geometria.js (`capCoverageLimitX` + extensión de tapa en `buildPencilNameTile`)
* Cambio: en los extremos tapados, la tapa maciza ahora crece hacia adentro (hasta 35 % del túnel) hasta la zona donde la silueta vuelve a envolver por completo el tubo, detectada con `capCoverageLimitX` (muestreo par/impar de tres puntos del alto del tubo sobre los polígonos dilatados). El tubo se recorta en consecuencia.
* Motivo: el usuario reportó con captura una "ceja" en la cara del final: la última letra se estrecha en la punta, la silueta deja de cubrir el envolvente de Ø11.4 y el anillo cortado del tubo quedaba expuesto. Los clásicos no lo sufren porque macizan el tramo final completo; ahora nosotros también.
* Relación: tercera iteración del modo lápiz tras retroalimentación; verificado numéricamente con la fuente real (ISABELA 16 mm, tope al final: la tapa pasó de 3.1 a 5.5 mm y el tubo muere en x=89.1 con cobertura confirmada; en tope al inicio la I cubre de inmediato y la tapa no crece; en abierto las bocas quedan intactas).
* Resultado: ✅ 100 de 100 pruebas (regresión nueva de cobertura con silueta sintética, punta sin cobertura y agujero por paridad); capturas frontales limpias en audits/lapiz-final-macizo-2026-08-07.png
## [2026-08-07]

* Archivo: generador-llaveros-3d/assets/app/geometria.js (reescritura de `buildPencilNameTile`)
* Cambio: el cuerpo del nombre para lápiz dejó de ser una suma de sólidos solapados (pieles + alas + tubo exterior + tapa) y pasó a ser UNA silueta maciza (letras ∪ lomo del envolvente) con el hueco excavado por dentro en rebanadas horizontales de Clipper, escalonadas hacia afuera para que el vacío contenga siempre al cilindro; el forro liso del tubo va embebido y es lo único que toca el lápiz y lo único visible en la boca. El lomo (`spineRect` unido a las letras) garantiza que el túnel viaje siempre escondido y une todas las letras; el macizo de la tapa sale por omisión de rebanadas (se eliminó el prisma de tapa, el tapón de respaldo y `buildSolidPencilTube`). Nuevos helpers puros `pencilVoidHalfWidth` y ajuste del paso de rebanada a `min(0.9, pared − 0.25)`.
* Motivo: el usuario laminó el 3MF y reportó con capturas dos defectos reales: huequitos parpadeantes en las caras planas (z-fighting de cuatro sólidos compartiendo exactamente los mismos planos en frente y espalda) y bultos redondos del tubo asomando donde las letras bajan. La pieza clásica de referencia es un solo cuerpo con el hueco restado: por eso es lisa.
* Relación: cuarta iteración del modo lápiz; implementa de facto la parte visible de A5 (malla única) sin CSG ni vendors nuevos, con booleanas 2D por rebanada — la misma discretización que hace el laminador al imprimir la pieza acostada.
* Resultado: ✅ 101 de 101 pruebas (nueva regresión del perfil de media anchura); verificación numérica con fuente real: cuerpo exacto dentro de la silueta (0..20.3 mm, cero bultos), 16 piezas / 32k triángulos / ~200-320 ms por nombre, una sola pieza tocando cada cara plana; espalda lisa verificada en Chrome (audits/lapiz-espalda-lisa-2026-08-07.png)
## [2026-08-07]

* Archivo: generador-llaveros-3d/assets/app/geometria.js (`buildPencilNameTile`, lomo y tapa)
* Cambio: el lomo del envolvente ahora abarca SOLO el tramo del hueco (voidStart..voidEnd) y la colocación de la tapa con su extensión por cobertura se decide ANTES de unir el lomo, midiendo contra la silueta de las LETRAS en coordenadas sin desplazar; más allá del hueco mandan las letras solas.
* Motivo: el usuario mostró que en el extremo tapado el lomo asomaba como un bloque cuadrado después de la última letra: el lomo se extendía por todo el alcance de la banda, pisando la zona que la iteración anterior ya había arreglado; y la comprobación de cobertura, al medir contra el cuerpo (que incluía al propio lomo), se volvía un no-op.
* Relación: quinta iteración del modo lápiz; restituye el comportamiento validado de la tapa-que-crece (d1dde2e) dentro de la arquitectura de cuerpo rebanado (ac1e1c7).
* Resultado: ✅ 101 de 101 pruebas; extents verificados con la fuente real (tope al final: hueco 0..89.1 y ancho del tile igual al de las letras, 94.4); extremo limpio verificado en Chrome (audits/lapiz-final-sin-bloque-2026-08-07.png)
## [2026-08-07]

* Archivo: generador-llaveros-3d/plantilla.py, assets/app/creador.js e index.html (regenerado)
* Cambio: paridad exacta de diámetro con el topper clásico de referencia: preset "Clásico firme · 7.7 mm" como recomendado y nuevo valor por defecto de `pencilHoleD` (antes 8.6), slider de diámetro interior desde 7.6 mm (antes 7.8), preset 8.6 renombrado a "Holgado fácil" y el de 8.3 retirado (el slider lo cubre); FAQ del diámetro actualizada. El piso geométrico de 7.6 ya existía en `buildPencilNameTile`.
* Motivo: el usuario comparó contra su 3MF clásico (Ø7.69 medido, dispersión 0.005) y el default de 8.6 quedaba ~0.9 mm más flojo: el lápiz bailaría. El 7.7 reproduce el agarre firme de la pieza que vende.
* Relación: sexta iteración del modo lápiz; con 7.7 el aviso de tamaño de letra deja de dispararse con letras de 12 mm (envolvente 10.5) y la prueba de ajuste imprime 7.4/7.7/8.0, que encierra el 7.69 de referencia.
* Resultado: ✅ suite completa en verde; verificado en Chrome con almacenamiento limpio: preset Clásico seleccionado, slider 7.7 (mín. 7.6), tope al final + hueco redondo, HUD y WhatsApp reflejando 7.7 mm
## [2026-08-07]

* Archivo: generador-llaveros-3d/assets/app/geometria.js (`buildPencilNameTile`, lomo en bocas abiertas)
* Cambio: en los extremos ABIERTOS el lomo se retrae hasta donde las letras ya envuelven el tubo (marcha de cobertura sobre las letras, tope 35 % del túnel, +0.3 mm de entierro); el tramo de la boca lo lleva únicamente el forro redondo, que emerge de la propia letra. El aviso de piezas sueltas cuenta el tubo completo (unión con el lomo íntegro) porque el forro conecta ese tramo en el sólido real; si las retracciones se cruzan en nombres cortísimos, se vuelve al lomo completo.
* Motivo: el usuario mostró su pieza impresa real: la entrada no se nota, el lápiz sale de la letra. En la web, con una primera letra delgada (la i de su fuente Disney), la cara plana del lomo asomaba como un bloque "cuadradillo" en la boca.
* Relación: séptima iteración del modo lápiz; complementa el recorte del lomo del extremo tapado (300d09d) con el tratamiento simétrico de las bocas abiertas.
* Resultado: ✅ suite completa en verde; verificado en Chrome con Caveat + "isabel" (primera letra delgada): el lápiz emerge de la I sin cara cuadrada (audits/lapiz-boca-redonda-2026-08-07.png)
## [2026-08-07]

* Archivo: generador-llaveros-3d/assets/app/geometria.js (tope del túnel, tercera estrategia)
* Cambio: el extremo tapado dejó de depender de que las letras envuelvan el tubo. Se eliminó la extensión de tapa por marcha de cobertura (con fuentes script encontraba cobertura a media palabra, corría el tope hasta ahí y dejaba las letras finales "peladas" con la pared del lomo visible como cueva entre los trazos) y se restituyó `buildSolidPencilTube`: el forro redondo continúa CERRADO como tapón macizo desde el fin del hueco hasta el final del tramo del túnel, con el mismo perfil del forro. Con letras gordas el tapón queda enterrado e invisible (caso Poppins, sin cambio visual); con letras delgadas o script se ve un remate redondo — nunca una pared plana ni una ventana. La tapa vuelve a su colocación base (~2.2–3 mm) y el hueco llega más profundo (más agarre).
* Motivo: el usuario reportó con captura un hueco tipo cueva junto a la última letra con su fuente script; el análisis numérico confirmó cobertura hallada en x≈17 de ~40 (tope a media palabra).
* Relación: octava iteración del modo lápiz; unifica el lenguaje de diseño: donde las letras no esconden el túnel, siempre se ve el forro REDONDO (abierto en la boca, cerrado en el tope). `capCoverageLimitX` sigue en uso para retraer el lomo en bocas abiertas.
* Resultado: ✅ suite completa en verde; harness con Caveat y Poppins en los tres modos de tapa: hueco profundo (0.2..57.3 de 59.8 en Caveat/end), tapón presente, sin ventanas por construcción; visor verificado con Caveat (audits/lapiz-tope-tapon-redondo-2026-08-07.png)
## [2026-08-07]

* Archivo: generador-llaveros-3d/assets/app/geometria.js (`capCoverageLimitX` + tope, estrategia definitiva)
* Cambio: la comprobación de cobertura ahora muestrea DENSO toda la altura del envolvente (paso ≤0.5 mm en vez de 3 puntos sueltos) y exige una racha continua de muestras cubiertas (`runLength`), devolviendo el extremo profundo de la racha para poder enterrar la pared dentro de un trazo real. Con eso se restituyó la tapa-que-crece hasta cobertura verdadera (nada sobresale de las letras) y el tapón redondo quedó SOLO como último recurso cuando ninguna letra puede envolver el tubo. Las retracciones del lomo en bocas abiertas usan la misma racha.
* Motivo: los 3 puntos sueltos daban falsos positivos con letras script (tres trazos separados contaban como "cubierto"), lo que provocó la cueva; el tapón que la sustituyó sobresalía como la ceja original. El muestreo denso resuelve ambas quejas del usuario a la vez.
* Relación: novena iteración; converge con lo aprobado en d1dde2e (final = puras letras) y mantiene la garantía anti-ventanas para letras diminutas.
* Resultado: ✅ suite completa en verde; harness con Caveat, Poppins y Pacifico en ambos topes: cobertura real encontrada cerca del extremo (sin tapón, 15 piezas), hueco profundo; visor verificado con Caveat: extremo limpio de puras letras (audits/lapiz-tope-enterrado-2026-08-07.png)
