# Por qué el rosa sale rayado y el blanco no — llavero de contorno "mia"

Fecha: 2026-08-13 · Pieza: estilo contorno, Pacifico, "mia", base rosa 2.4 mm + letras blancas 1.4 mm
Perfil auditado: el que produce hoy producción (sello `0bbec6e3`, rondas 1-3 incluidas).

## Resumen

El rosa no se raya por cómo está modelado ni por el planchado: se raya **después de estar
terminado**. La base rosa acaba en la capa 12 (z = 2.4) y encima se imprimen 7 capas de letras
blancas. Durante esas 7 capas la boquilla recorre **533 mm de viaje a la altura de capa** —es
decir, a 0.2 mm sobre la meseta rosa recién planchada— **sin ejecutar el salto en Z**, incluido
un único viaje de **152 mm que cruza la pieza entera**. El blanco se salva porque es lo último
que se imprime: nada vuelve a pasar por encima.

La ronda 3 (`reduce_infill_retraction: 0`) sí funcionó —el laminador lo resuelve a
`reduce_infill_retraction_mode = Disabled`, verificado en el volcado del G-code—, pero arregló
sólo **la retracción**, no **la elevación**: con `z_hop_types = "Auto Lift"` heredado de la
plantilla, el salto de 0.4 mm no se ejecuta en todos esos viajes.

## Método

1. Se generó el 3MF real llamando a `buildOutlineTile` + `buildBambu3MF` en la página de
   producción (Chrome DevTools), con el `window.__BAMBU_PROJECT__` que se descarga el cliente.
2. Se laminó con la CLI: `bambu-studio.exe --slice 1 --outputdir OUT mia.3mf` (exit 0, sin avisos).
3. Se parseó `plate_1.gcode`: se reconstruyó la meseta rosa con las trayectorias de
   `Top surface` + `Ironing` de z = 2.4, y se midió cada viaje de las capas blancas contra esa
   máscara, comprobando si la Z real del viaje superaba la Z de la capa.
4. Se repitió con 9 variantes del perfil, reescribiendo `Metadata/project_settings.config`
   dentro del 3MF y volviendo a laminar. Los tiempos de Bambu son deterministas, así que las
   comparaciones son válidas.
5. Los tokens se verificaron contra el volcado de configuración del propio G-code, no contra
   la documentación: es la única forma de saber qué aceptó el laminador de verdad.

## Hallazgo 1 — la boquilla arrastra sobre la meseta (causa dominante)

Medido en el perfil actual, sólo en las capas blancas (z > 2.4):

| Métrica | Valor |
|---|---|
| Viajes que cruzan la meseta rosa | 553 |
| De ésos, **sin salto en Z** | **264** (176 mm de recorrido sobre el rosa) |
| Viaje sin salto más largo | **152.1 mm** |
| Recorrido total sin salto en capas blancas | 533 mm |
| Reparto (Z real − Z de capa) en los viajes | 0.0 mm → 592 viajes · 0.4 mm → 1328 |

592 viajes se ejecutan exactamente a la altura de capa. Con el rosa planchado justo debajo y
`travel_speed = 700 mm/s`, eso es la definición física de un rayón.

**Por qué el blanco no lo sufre:** la cara blanca se plancha en la capa 19 y ahí termina la
impresión. Es la misma asimetría que describe el usuario, y es la prueba de que la causa está
en la secuencia, no en el material ni en la geometría.

## Hallazgo 2 — la torre de purga no purga nada (aportación del usuario, confirmada)

Los colores **nunca comparten capa**: rosa en las capas 1-12, blanco en la 13-19,
`filament_change_times = 1`. Aun así la torre se imprime en las 19 capas, ~200 mm de trazo por
capa, y obliga a dos viajes largos de ida y vuelta por capa entre la pieza y la torre.

Comprobación de que quitarla no contamina el blanco: **la purga real del cambio es idéntica con
y sin torre — 45.8 mm de filamento (~110 mm³)**, porque la A1 la hace en su estación fuera de
cama (bloque `FLUSH_START`/`FLUSH_END` del `change_filament_gcode`). La torre sólo se construía
a sí misma.

| | con torre | sin torre |
|---|---|---|
| Filamento total | 1.90 g | **1.20 g** |
| De eso, desperdicio | 0.83 g | **0.14 g** |
| Purga del cambio | 45.8 mm | 45.8 mm (igual) |
| Tiempo | 983 s | **873 s** |
| Viaje sin salto más largo | 152.1 mm | **7.6 mm** |

El desperdicio era el **77 % del material** de una pieza de 1.07 g.

**Cuidado:** esto sólo vale cuando los colores están estratificados en Z. Con la casilla de
arcoíris y varios nombres, las capas de letras llevan N colores y varios cambios por capa: ahí
la torre sí hace falta. El cambio debe ser condicional.

## Hallazgo 3 — el planchado va al doble de material que el de Bambu (secundario)

Con `ironing_flow 20%` + `ironing_spacing 0.1`, el planchado deposita **7.2 mm³** sobre la
meseta ≈ **0.03 mm de espesor equivalente**. Con los valores propios de Bambu (10 % / 0.15,
los que usa en `support_ironing_*` de la misma plantilla) son 3.5 mm³ ≈ 0.015 mm.

Es **2.1× más material**, y son 45 s de los 133 s que el planchado se come del total. Pero en
términos absolutos son 30 µm sobre una holgura de 200 µm: **contribuye, no es la causa**. Lo
relevante es que deja la meseta blanda y ligeramente proud justo antes de que le pasen 264
viajes por encima.

No lo presento como imprescindible: bajarlo revierte parte de la ronda 2, que atacaba picaduras
reales. La secuencia sensata es arreglar primero el arrastre y sólo tocar el planchado si
quedan marcas.

## Hallazgo 4 — bug en el aviso de pausa del modo "cambio de rollo"

`creador.js:710` calcula la capa del cambio con
`Math.floor(z / state.layerHeight + 1e-6) + 1`.

Con grosores que no son múltiplo de la altura de capa el laminador redondea hacia arriba
(verificado: base 2.5 mm → la cara superior del rosa acaba en z = 2.6, no en 2.4), pero el aviso
sigue diciendo la capa de abajo. El deslizador de grosor va de 1.6 a 5 en pasos de **0.1**, así
que la mitad de los valores caen fuera de la rejilla de 0.2 mm.

Efecto para el cliente sin AMS: cambia el rollo **una capa antes**, y le queda una capa entera
de 0.2 mm de blanco donde debía ir rosa. Encaja con los "puntitos blancos" que ya se habían
reportado en esta misma pieza.

Arreglo: `Math.ceil(z / state.layerHeight - 1e-6) + 1`, y/o cuantizar el deslizador de grosor a
múltiplos de la altura de capa.

## Lo que se descartó, con números

- **Banda de contorno demasiado angosta → gap fill.** Se midió por granulometría morfológica
  (apertura con disco, sobre el rasterizado real de la silueta): sólo el **1.2 %** del área
  rosa visible está en rasgos de menos de 0.84 mm, y el 3.6 % por debajo de 1.26 mm. La banda
  es una cinta continua de 2-3 mm (disco inscrito máximo 3.02 mm). No es el problema.
  *Una primera medición con transformada de distancia daba 41 % — está sesgada a la baja y era
  incorrecta; la granulometría es la métrica buena.*
- **Pillowing por el relleno flojo.** La base de 2.4 mm son 12 capas: 4 macizas abajo, 2 de
  relleno al 10 %, y 6 de techo (la primera es un puente interno). El relleno queda a 1.2 mm
  de la cara vista con 6 capas macizas encima. La ronda 1 ya lo cerró.
- **Grosor fuera de rejilla.** Degrada limpio: el laminador mueve el plano de cambio a la capa
  siguiente, sin capa sliver. Sólo afecta al aviso de pausa (hallazgo 4).
- **Contaminación de color al quitar la torre.** Refutado: la purga es la misma.

## Cambios propuestos

En `generador-llaveros-3d/assets/app/exportadores.js`, `QUALITY_OVERRIDES`. Todos quedan
declarados solos en `different_settings_to_system` por el mecanismo que ya existe.

| Clave | Hoy | Propuesto | Qué arregla |
|---|---|---|---|
| `z_hop_types` | hereda `Auto Lift` | `Normal Lift` | ejecuta el salto de 0.4 en todo viaje que retrae |
| `retraction_minimum_travel` | hereda `1` | `0.2` | los viajes cortos entre trazos también retraen y saltan |
| `enable_prime_tower` | hereda `1` | `0` **si ≤ 2 grupos** | mata la torre y el viaje de 152 mm; −0.69 g y −110 s |
| `ironing_flow` | `20%` | `10%` *(opcional)* | vuelve al material propio de Bambu |
| `ironing_spacing` | `0.1` | `0.15` *(opcional)* | ídem |

Resultado medido del conjunto (variante `H`, con torre fuera y planchado suave):

| | actual | propuesto | cambio |
|---|---|---|---|
| Viajes sin salto sobre el rosa | 264 (176 mm) | 153 (83 mm) | **−53 %** |
| Recorrido total sin salto | 533 mm | 163 mm | **−69 %** |
| Viaje sin salto más largo | 152.1 mm | 5.0 mm | **−97 %** |
| Tiempo | 983 s | 840 s | −15 % |
| Filamento | 1.90 g | 1.20 g | −37 % |

Los 153 viajes que quedan sin salto son casi todos de menos de 0.4 mm dentro del propio trazo
de la letra: inofensivos.

## Aplicado (ronda 4) y medido sobre el build nuevo

Se aplicaron las tres claves de viaje/torre. **El planchado se dejó como estaba**: 30 µm no
justifican revertir la ronda 2 anti-picaduras antes de ver una reimpresión.

Detalle de implementación que importa: `z_hop_types` y `retraction_minimum_travel` son ajustes
de **impresora**, no de proceso. `different_settings_to_system` es un array
`[proceso, un hueco por filamento, impresora]`; declararlas en el hueco 0 las habría dejado sin
declarar en su propio preset y Bambu Studio las revertiría al abrir — exactamente el fallo que
ese bloque ya evitaba para las de proceso. Van en un `PRINTER_OVERRIDES` aparte que se declara
en el último hueco.

`enable_prime_tower: 0` va condicionado a `zSpansAreStratified(soups)`, que mide los tramos Z
reales de cada grupo de color en vez de contar grupos: así el modo arcoíris y el modo lápiz
conservan la torre solos, sin lista de excepciones.

Laminado del 3MF que produce el build `74eb85cb`, sin avisos:

| | ronda 3 | ronda 4 | cambio |
|---|---|---|---|
| Viajes sin salto sobre la meseta | 264 (176 mm) | **156 (86 mm)** | −51 % |
| Peor viaje suelto sin salto | 152.1 mm | **5.0 mm** | −97 % |
| Recorrido total sin salto | 533 mm | **164 mm** | −69 % |
| Tiempo | 983 s | **889 s** | −10 % |
| Filamento | 1.90 g | **1.21 g** | −36 % |
| Desperdicio | 0.83 g | **0.14 g** | −83 % |

Caso arcoíris comprobado aparte: conserva la torre (8 cambios de filamento), como debe.

Los 156 viajes que quedan sin salto son casi todos de menos de 0.4 mm dentro del propio trazo
de la letra: la boquilla no llega a salir al rosa.

## Cómo verificarlo en físico

Una sola placa con cuatro veces el mismo "mia", cambiando una variable cada vez:

1. perfil actual (testigo)
2. sólo `Normal Lift` + `retraction_minimum_travel 0.2`
3. lo anterior + `enable_prime_tower 0`
4. lo anterior + planchado 10 % / 0.15

Si el rayado desaparece entre 1 y 2, la causa está confirmada y el planchado ni se toca.

## Lo que sigue sin saberse

- Si la pieza de la foto es anterior o posterior a la ronda 3 (desplegada el 2026-08-09).
  Si es posterior, este informe explica por qué la ronda 3 no bastó. Si es anterior, conviene
  reimprimir con el perfil de hoy antes de tocar nada más.
- El modo de impresión que usa realmente el usuario para estos llaveros (AMS o pausa). Sólo el
  modo AMS incrusta el perfil afinado: `creador.js:1374` condiciona el proyecto Bambu a
  `printMode === 'multi'`, así que en modo pausa el cliente descarga un 3MF **sin ninguna** de
  las tres rondas de ajuste.
