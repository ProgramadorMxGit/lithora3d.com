# Informe y propuesta — Nombres para lápiz configurables

Fecha: 2026-08-07
Referencia analizada: `PenCustomDisney_A1_Tapa_Final_Altura_Blanca_Original.3mf` (nombre ISABEL)
Estado: informe y propuesta. **No se modificó código.**

---

## 1. Procedencia del archivo de referencia

El 3MF **no salió del generador web de Lithora**. Sus metadatos lo identifican:

| Campo | Valor |
|---|---|
| `MakerLab` | `Parametric Model Maker` (generador paramétrico de Bambu Lab / MakerWorld) |
| `MakerLabFileId` | `178606723794198730` |
| `DesignModelId` | `FDI_2965122` |
| `source_file` | `Parametric_Model_Maker.obj` |
| `Application` | `BambuStudio-02.07.01.57` |
| Fecha de creación | 2026-08-07 |

Sobre esa base hubo un post-proceso propio: el paquete incluye `Metadata/optimization_report.json`, que **no es un archivo estándar de Bambu Studio**. Describe una tapa reconstruida con parámetros explícitos (segmentos, anillos, solapamiento radial, volumen). El script que lo generó no está en el repositorio — no aparece en `tools/`, `scripts/` ni en los `.tmp_*`.

Conclusión: es un modelo de MakerWorld retocado por herramienta externa, tomado como **referencia de destino**, no como salida propia.

---

## 2. Geometría medida

Medida directamente sobre los 7.304 vértices y 14.604 triángulos de la malla, no leída de los metadatos.

### Volumen general
| Medida | Valor |
|---|---|
| Dimensiones | 41,78 × 21,80 × 11,90 mm |
| Cuerpo | z −6,00 → 3,40 (**9,40 mm**) |
| Relieve de letras | 2,50 mm exactos |
| Cima de las letras | plano único en z = 5,90 (letras de tapa plana, sin bisel) |
| Triángulos | 14.604, malla **única y estanca** |

### Túnel del lápiz
| Medida | Valor |
|---|---|
| Forma | círculo perfecto (dispersión de radio 0,005 mm) |
| Diámetro | **7,57 mm** |
| Centro | y = −1,00 · z = −0,30 (descentrado hacia abajo y a un lado) |
| Pared inferior | 1,92 mm |
| Pared superior | **≈ 0,00 mm** — el techo del túnel roza la cara superior del cuerpo |

El dato de la pared superior es el hallazgo importante: en la referencia **las letras del relieve son el techo del túnel**. Es una decisión agresiva que ahorra altura, pero deja el puente del agujero apoyado solo en el relieve. Ver §5.

### Tapa del extremo
| Medida | Valor |
|---|---|
| Lado | final del nombre (X positivo) |
| Espesor | 1,00 mm mínimo → 3,30 mm máximo |
| Construcción | 144 segmentos × 14 anillos radiales |
| Solapamiento radial | 0,08 mm |
| Volumen | 108,76 mm³ |

Espesor variable de 1,0 a 3,3 mm sobre 14 anillos: es una **cúpula**, no un tapón plano.

### Color
Dos filamentos, `#C364B1` (magenta) y `#FFFFFF` (blanco), aplicados con **`paint_color` por triángulo** (11.493 triángulos al filamento 1, 3.111 al 2) sobre un objeto único. No hay objetos separados por color.

### Perfil de impresión
`0.20mm Pen Ligero Equilibrado @BBL A1` — Bambu Lab A1, boquilla 0,4, PLA, capa 0,20, muros arachne × 2, relleno 6 % lightning, **sin soportes**, **sin torre de purga**, muro exterior 110 mm/s, superficie superior 90 mm/s.

---

## 3. Contraste contra el generador web actual

| Aspecto | Referencia | `buildPencilNameTile` hoy |
|---|---|---|
| Perfil del túnel | círculo puro | **lágrima**: 270° de círculo + dos tangentes a 45° |
| Soportes | depende del puente del laminador | **garantizado sin soportes** por construcción |
| Diámetro | 7,57 mm fijo | 7,8–11,2 mm, 3 presets (8,6 / 8,3 / 10,6) |
| Pared | asimétrica (1,92 abajo, 0 arriba) | uniforme, `centerZ = outerR`, altura derivada |
| Entrada | única | **escalón de 0,35 mm en ambos extremos** para insertar sin forzar |
| Tapa | cúpula de 144×14 en el **final** | prisma macizo en el **arranque** + tapón de respaldo |
| Malla | 1 sólido estanco, pintado | N sólidos superpuestos, unión delegada al laminador |
| Color | `paint_color` por triángulo | un objeto por color dentro de un contenedor |
| Contorno | offset redondeado generoso | `outlineWidth` 0,6–6 mm |
| Relieve | 2,5 mm | `raisedHeight` 0,4–3 mm |

**Donde tu generador ya gana:** el túnel de lágrima, el escalón de entrada, el rango de diámetros y el recorte del túnel a la banda real de la silueta (el comentario del código menciona explícitamente el caso de la `i` de Isabel).

**Donde pierde:** el acabado de la tapa, la asimetría de paredes, la malla única y el aspecto redondeado del contorno.

---

## 4. Propuesta

Ordenada por relación valor/esfuerzo. Nada de esto está implementado.

### Bloque A — Paridad con la referencia

| # | Mejora | Detalle |
|---|---|---|
| A1 | **Tapa en cúpula** | Sustituir el prisma macizo por un domo de espesor variable (1,0 → 3,3 mm). Acabado muy superior y menos plástico. |
| A2 | **Elegir el extremo tapado** | Hoy el código tapa deliberadamente el **arranque**; la referencia tapa el **final**. Opciones: sin tapa · inicio · final · ambos. |
| A3 | **Paredes asimétricas** | Separar pared inferior de superior. Permite bajar la altura total sin adelgazar la base de apoyo. |
| A4 | **Presets de relieve** | 2,5 mm es el valor de la referencia; hoy el rango llega a 3 mm pero arranca en 1,4 mm por defecto. |
| A5 | **Malla única estanca + `paint_color`** | Dejar de depender de que el laminador una sólidos superpuestos. Un solo objeto pintado por triángulo es más robusto y más limpio en Bambu Studio. Es el cambio de mayor calado técnico. |
| A6 | **Contorno redondeado** | Unión redondeada del offset con radio configurable, para el aspecto "inflado" de la referencia. |

### Bloque B — Configurabilidad nueva (más allá de la referencia)

| # | Mejora | Detalle |
|---|---|---|
| B1 | **Presets por lápiz real** | En vez de milímetros: Mirado / BIC / Norma / jumbo escolar / triangular / plumas. Cada uno con su holgura ya calculada. |
| B2 | **Testigo de ajuste** | Botón que genera una pieza de prueba de 10 mm con tres diámetros escalonados. Se imprime en 4 minutos y evita tirar el nombre completo. |
| B3 | **Tope de profundidad** | Que el lápiz entre solo hasta cierto punto, con tope interno en lugar de tapa exterior. |
| B4 | **Doble contorno en modo lápiz** | Hoy `borde-pick` se oculta cuando el producto es lápiz. Con tres filamentos daría el look de la referencia y más. |
| B5 | **Emoji o icono al final** | La fuente de emoji ya está cargada y `linesToPolygons` ya la acepta. |
| B6 | **Negrita sintética** | Engrosar el trazo de las letras para nombres largos o fuentes finas. |
| B7 | **Segunda línea** | Apellido o "3º B" bajo el nombre. |
| B8 | **Perfil alineado con la referencia** | Añadir el equivalente a `0.20mm Pen Ligero Equilibrado` (6 % lightning, sin torre de purga, 110/90) como opción rápida frente al perfil de 0,16 mm actual. |

### Bloque C — UX para que lo entienda un niño (prioridad declarada)

| # | Mejora | Detalle |
|---|---|---|
| C1 | **Lápiz en la vista 3D** | Dibujar un lápiz insertado en el modelo dentro del visor. Es la mejora que más explica sin una sola palabra. |
| C2 | **Elegir por foto, no por milímetro** | Fotografías de lápices reales en lugar de "8,6 mm". El número queda como detalle avanzado. |
| C3 | **Calibrador en pantalla** | "Pon tu lápiz encima de la pantalla" con una regla escalada a la resolución del dispositivo. |
| C4 | **Semáforo en vez de advertencias** | Verde/ámbar/rojo con una frase, en lugar de textos técnicos sobre islas y caracteres faltantes. |
| C5 | **Asistente de 3 pasos** | Nombre → lápiz → color, y el resto plegado en "Ajustes avanzados". |
| C6 | **Comparación antes/después** | Mostrar el efecto de cada slider con una miniatura, no solo con el número. |

### Bloque D — Negocio

| # | Mejora | Detalle |
|---|---|---|
| D1 | **Estimación de gramos, tiempo y precio** | Con la geometría ya calculada es aritmética directa. |
| D2 | **Botón "que me lo impriman"** | Enlace a WhatsApp reutilizando `quote-channel.js`, con el nombre y los ajustes en el mensaje. Encaja con el precio de $80 y el piso de $35 ya definidos. |
| D3 | **Placa multi-nombre** | Ya existen `columns` y `gap`; falta el caso "30 nombres de un salón" con lista pegada desde un texto. |

---

## 5. Riesgos y cosas que NO conviene copiar

1. **La pared superior de 0 mm.** En la referencia el techo del túnel coincide con la cara superior del cuerpo. Funciona porque el relieve de 2,5 mm queda encima, pero deja la pieza dependiendo de que las letras cubran el puente. Donde no hay letra, hay agujero abierto. **El túnel de lágrima actual es mejor ingeniería**; conviene mantenerlo como opción por defecto y ofrecer el círculo puro solo como alternativa consciente.

2. **El agujero circular sin lágrima** obliga al laminador a hacer un puente de 7,57 mm. Sale aceptable en una A1, pero no es garantía.

3. **Propiedad intelectual.** El archivo lleva `DesignModelId FDI_2965122`, viene de MakerWorld y su nombre incluye una marca ajena. Sirve como referencia de aspecto y de medidas; **no conviene redistribuir la malla ni publicar derivados directos**. Todo lo propuesto arriba se puede construir desde cero con la geometría que ya tiene el repositorio.

4. **`plantilla.py` y el archivo portable.** Cualquier cambio en la app tiene que pasar por el portable en `../../Creador de Llaveros - Portable/`, porque `python plantilla.py` reconstruye `index.html` desde ahí. Si se edita solo la versión web, la siguiente regeneración lo borra. Los controles del lápiz ya viven como constante inyectada (`PRODUCTO_LAPIZ`) precisamente por esto: **cada control nuevo del lápiz hay que añadirlo también a esa constante.**

---

## 6. Orden sugerido

1. **A2 + A1** — tapa en cúpula y elección de extremo. Máximo impacto visual, riesgo bajo, contenido en `buildPencilNameTile`.
2. **C1** — el lápiz en la vista 3D. Es la mejora de comprensión más grande por línea de código.
3. **B1 + B2** — presets por lápiz real y testigo de ajuste. Elimina la causa número uno de piezas fallidas.
4. **A3 + A6** — paredes asimétricas y contorno redondeado. Cierra la paridad estética.
5. **A5** — malla única con `paint_color`. El más profundo; conviene hacerlo cuando lo demás esté estable.
6. **C5 + D2** — asistente y salida comercial.
