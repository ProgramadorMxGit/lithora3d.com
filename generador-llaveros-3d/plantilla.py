"""Compone generador-llaveros-3d/index.html a partir del marcado de la app.

El cuerpo de la aplicacion se mantiene identico al de la version portable; aqui
solo se le pone alrededor la cabecera SEO, el contenido indexable y el JSON-LD.
Regenerar con:  python plantilla.py
"""
import re, io, os, json

AQUI = os.path.dirname(os.path.abspath(__file__))

# Fuente unica de verdad: el marcado sale siempre del archivo portable, para que
# las dos versiones no se separen. Si cambias la app, vuelve a ejecutar esto.
PORTABLE = os.path.join(
    AQUI, '..', '..', 'Creador de Llaveros - Portable', 'Creador de Llaveros.html')
if not os.path.exists(PORTABLE):
    raise SystemExit('No se encuentra el archivo portable en: ' + os.path.abspath(PORTABLE))
_src = open(PORTABLE, encoding='utf-8').read()
_m = re.search(r'<body>(.*?)<script>', _src, re.S)
if not _m:
    raise SystemExit('No se pudo aislar el cuerpo de la app en el portable')
CUERPO = _m.group(1).strip()

# La versión web ofrece un segundo producto que no existe en el portable. Se
# incorpora durante la composición para que regenerar index.html nunca borre
# los controles del túnel longitudinal para lápiz.
PRODUCTO_LAPIZ = '''      <section class="card product-card">
        <h2>🧩 ¿Qué quieres crear?</h2>
        <div class="product-list" id="product-list" role="group" aria-label="Tipo de pieza">
          <button type="button" class="product-opt" data-product="keychain" aria-pressed="true">
            <span class="product-emoji" aria-hidden="true">🔑</span>
            <span><b>Llavero</b><small>Con argolla para aro metálico</small></span>
          </button>
          <button type="button" class="product-opt" data-product="pencil" aria-pressed="false">
            <span class="product-emoji" aria-hidden="true">✏️</span>
            <span><b>Nombre para lápiz</b><small>Agujero longitudinal, sin argolla</small></span>
          </button>
        </div>
        <div id="pencil-settings" hidden>
          <p class="pencil-group-label">¿Qué lápiz es?</p>
          <div class="pencil-fit-list" id="pencil-fit-list" role="group" aria-label="Ajuste para lápiz">
            <button type="button" data-pencil-d="8.1"><b>Escolar al punto</b><small>8.1 mm · recomendado</small></button>
            <button type="button" data-pencil-d="7.7"><b>Muy firme</b><small>7.7 mm</small></button>
            <button type="button" data-pencil-d="10.6"><b>Jumbo grueso</b><small>10.6 mm</small></button>
          </div>
          <div class="slider-row">
            <label>Diámetro interior <span class="val" id="val-pencilHoleD"></span></label>
            <input type="range" id="in-pencilHoleD" min="7.6" max="11.2" step="0.1" aria-label="Diámetro interior del túnel para lápiz en milímetros">
          </div>
          <div class="slider-row">
            <label>Pared alrededor del lápiz <span class="val" id="val-pencilWall"></span></label>
            <input type="range" id="in-pencilWall" min="1.2" max="2.2" step="0.1" aria-label="Pared estructural alrededor del lápiz en milímetros">
          </div>
          <div class="info-box warn" id="pencil-size-hint" role="alert" hidden></div>
          <p class="pencil-group-label">¿Abierto o con tope?</p>
          <div class="pencil-fit-list" id="pencil-cap-list" role="group" aria-label="Extremo tapado del túnel">
            <button type="button" data-cap="end" aria-pressed="true"><b>Tope al final</b><small>Donde termina el nombre · como los clásicos</small></button>
            <button type="button" data-cap="open" aria-pressed="false"><b>Abierto</b><small>Asoma por los dos lados</small></button>
            <button type="button" data-cap="start" aria-pressed="false"><b>Tope al inicio</b><small>Junto a la primera letra</small></button>
          </div>
          <p class="pencil-group-label">¿Cómo es el hueco?</p>
          <div class="pencil-fit-list" id="pencil-tunnel-list" role="group" aria-label="Forma del túnel">
            <button type="button" data-tunnel="round" aria-pressed="true"><b>Redondo</b><small>Como los clásicos</small></button>
            <button type="button" data-tunnel="teardrop" aria-pressed="false"><b>Techo 45°</b><small>Extra firme, sin soportes</small></button>
          </div>
          <label class="check-row" style="margin-top:2px;margin-bottom:13px">
            <input type="checkbox" id="in-showPencilGhost" checked>
            <span>Mostrar un lápiz de referencia en la vista 3D (no se imprime)</span>
          </label>
          <button type="button" class="fit-test-btn" id="btn-fit-test">🎯 Imprimir prueba de ajuste<small>3 medidas en una pieza chiquita: pruebas tu lápiz real antes de imprimir todo</small></button>
          <div class="info-box pencil-spec">
            El lápiz de la vista 3D te enseña por dónde entra y dónde se detiene.
            <small>El hueco <b>redondo</b> es el de los toppers clásicos: se imprime acostado y el techo del túnel sale con pequeños puentes que quedan ocultos. El <b>techo 45°</b> evita hasta esos puentes, por si tu impresora los sufre. La boca es 0.35 mm más amplia para guiar el lápiz. ¿Dudas con la medida? Imprime la <b>prueba de ajuste</b>: tres túneles cortos (apretado, exacto y holgado) con sus marcas, y te quedas con el que entre mejor.</small>
          </div>
        </div>
      </section>

'''
MARCA_NOMBRES = '      <section class="card">\n        <h2>✏️ Nombres</h2>'
assert CUERPO.count(MARCA_NOMBRES) == 1, 'no se encontró la tarjeta Nombres del portable'
CUERPO = CUERPO.replace(MARCA_NOMBRES, PRODUCTO_LAPIZ + MARCA_NOMBRES)
CUERPO = CUERPO.replace(
    '      <section class="card">\n        <h2>✨ Estilo</h2>',
    '      <section class="card" id="style-card">\n'
    '        <h2>✨ Estilo</h2>\n'
    '        <div class="info-box" id="pencil-style-note" hidden>\n'
    '          Se usa un contorno reforzado y mayúsculas para mantener unido cualquier nombre alrededor del túnel.\n'
    '        </div>', 1)
CUERPO = CUERPO.replace(
    '<div class="slider-row fixed-h-row">',
    '<div class="slider-row fixed-h-row" id="fixed-height-row">', 1)
# Negrita sintética: control exclusivo de la web (el portable no lo tiene),
# insertado justo después del deslizador de tamaño de letra.
MARCA_TAMANO = ('<input type="range" id="in-letterHeight" min="6" max="30" step="0.5"'
                ' aria-label="Tamaño de las letras en milímetros">\n        </div>')
assert CUERPO.count(MARCA_TAMANO) == 1, 'no se encontró el deslizador de tamaño de letra'
CUERPO = CUERPO.replace(MARCA_TAMANO, MARCA_TAMANO + '''
        <div class="slider-row">
          <label for="in-textBold">Letra más gordita <span class="val" id="val-textBold"></span></label>
          <input type="range" id="in-textBold" min="0" max="0.8" step="0.1" aria-label="Engrosar el trazo de las letras en milímetros">
        </div>''', 1)
CUERPO = CUERPO.replace(
    '<div class="slider-row">\n          <label>Grosor del llavero ',
    '<div class="slider-row" id="base-thickness-row">\n          <label>Grosor del llavero ', 1)
CUERPO = CUERPO.replace(
    '<div class="slider-row">\n            <label>Agujero del aro ',
    '<div class="slider-row" id="keyring-hole-row">\n            <label>Agujero del aro ', 1)

# El logo iba embebido en base64 (19 KB x2). En web se reutiliza el del sitio.
CUERPO = re.sub(r'src="data:image/png;base64,[^"]+"', 'src="/assets/logo.png"', CUERPO)
# La cabecera de la app duplicaba el H1 de la pagina. Dos H1 es justo el defecto
# que arrastra el competidor principal; aqui se degrada a texto de marca.
CUERPO, n_h1 = re.subn(r'<h1>\s*Creador de Llaveros\s*<span class="grad">3D</span>\s*</h1>',
                       '<h1>Generador de llaveros 3D <span class="grad">con nombre</span></h1>',
                       CUERPO)
assert n_h1 == 1, f'se esperaba 1 H1 de la app, se encontraron {n_h1}'
CUERPO = CUERPO.replace(
    '<p>Escribe un nombre, elige colores y descárgalo listo para imprimir</p>',
    '<p>Gratis, sin registro y sin límite de descargas · STL y 3MF multicolor</p>')
# En el sitio propio, "hecho por Lithora 3D" apuntando a la home es ruido:
# se convierte en la salida comercial util.
CUERPO = CUERPO.replace(
    '<a class="brand-link" href="https://lithora3d.com" target="_blank" rel="noopener">',
    '<a class="brand-link" href="/cotizar/">')
CUERPO = CUERPO.replace(
    '<span class="hide-sm">hecho por</span>&nbsp;<b>Lithora 3D</b> ↗',
    '<span class="hide-sm">¿Sin impresora?</span>&nbsp;<b>Te lo imprimimos</b> →')

FAQ = [
 ("¿Es realmente gratis?",
  "Sí. Puedes generar y descargar todos los llaveros que quieras, sin registro, sin cuenta y sin límite de descargas. No hay versión de pago ni marca de agua."),
 ("¿Funciona con ñ, tildes y diéresis?",
  "Sí. Nombres como Muñoz, Ximena o José Ángel se generan correctamente. Si eliges una tipografía que no incluye algún carácter, la herramienta te avisa antes de descargar en vez de omitirlo en silencio."),
 ("¿En qué formato se descarga?",
  "En STL, que abre cualquier laminador, y en 3MF. El 3MF sale como proyecto de Bambu Studio con las piezas ya separadas y asignadas a un filamento, para imprimir a dos colores sin configurar nada."),
 ("¿Necesito una impresora 3D?",
  "Para imprimirlo tú, sí. Si no tienes, nosotros lo imprimimos: somos un servicio real de impresión 3D en Tampico, Ciudad Madero y Altamira, con envíos al resto de México."),
 ("¿Puedo imprimir a dos colores sin AMS?",
  "Sí. Elige el modo de cambio de rollo y la herramienta te dice la altura exacta en milímetros a la que debes programar la pausa para cambiar de filamento."),
 ("¿Qué material conviene para un llavero?",
  "El PLA es suficiente para uso normal y es el más económico. Si el llavero va a quedarse dentro de un coche al sol o aguantar golpes, el PETG resiste mejor el calor y la fatiga."),
 ("¿Qué grosor aguanta sin romperse?",
  "El grosor por defecto es un punto de partida razonable para un llavero de mochila. Puedes subirlo con el control de grosor si el llavero va a recibir tirones fuertes."),
 ("¿Puedo hacer la letra más gruesa?",
  "Sí. El control «Letra más gordita» engorda el trazo en décimas de milímetro, ideal para tipografías cursivas o delgadas que imprimen flaquitas. Con +0.3 o +0.4 mm la mayoría de las letras script quedan llenitas; si te pasas, los huecos internos de letras como la e se cierran (lo ves al instante en la vista 3D)."),
 ("¿Puedo usar mi propia tipografía?",
  "Sí. Arrastra un archivo .ttf o .otf a la ventana y se añade a la lista. El archivo no se sube a ningún servidor: se procesa en tu propio navegador."),
 ("¿Puedo hacer varios nombres a la vez?",
  "Sí, y es lo más útil para un grupo escolar, una boda o un equipo. Añade un nombre por fila y la herramienta los acomoda en una sola placa lista para imprimir de una pasada."),
 ("¿También hace nombres para lápices?",
  "Sí. Elige «Nombre para lápiz» y el nombre se genera atravesado por un túnel a la medida del lápiz, sin argolla. El túnel se imprime acostado y sin soportes, y puedes dejarlo abierto o con tope en el extremo que prefieras. En la vista 3D aparece un lápiz de referencia que muestra por dónde entra."),
 ("¿Qué diámetro de túnel elijo para el lápiz?",
  "El ajuste Escolar de 8.1 mm entra firme en el lápiz de escuela tradicional: sus esquinas hexagonales miden unos 8.1 mm y los agujeros impresos salen unas décimas más chicos que el modelo. Hay presets muy firme (7.7 mm) y jumbo (10.6 mm), y el diámetro se afina en décimas. Si no estás seguro, imprime la prueba de ajuste: una pieza pequeña con tres medidas (apretada, exacta y holgada) para probar tu lápiz real antes de imprimir todos los nombres."),
 ("¿Puedo venderlos?",
  "Los archivos que generas son tuyos. Ten en cuenta que la tipografía que elijas tiene su propia licencia: las incluidas aquí son de uso libre, pero si subes una tuya debes revisar sus condiciones."),
 ("¿Se guardan mis datos?",
  "No. Todo ocurre dentro de tu navegador y nada se envía a ningún servidor. Tu trabajo se guarda solo en tu propio equipo para que no lo pierdas al cerrar la pestaña."),
 ("¿Cuánto cuesta imprimir un llavero?",
  "Depende del tamaño, el material, el acabado y la cantidad. Puedes revisar qué factores entran en una cotización o pedirnos una propuesta concreta para tu proyecto."),
]

PASOS = [
 ("Escribe los nombres", "Uno por fila, para llavero o para nombre de lápiz. Puedes añadir tantos como necesites para hacerlos todos de una sola impresión."),
 ("Elige estilo, letra y colores", "Placa, contorno o doble contorno, con dieciséis tipografías incluidas o la tuya propia."),
 ("Descarga el archivo", "STL para cualquier laminador, o 3MF listo para Bambu Studio con los colores ya asignados."),
]

def faq_html():
    return '\n'.join(
        '        <details class="faq-item">\n'
        '          <summary>{}</summary>\n'
        '          <p>{}</p>\n'
        '        </details>'.format(p, r) for p, r in FAQ)

def pasos_html():
    return '\n'.join(
        '          <li>\n            <h3>{}</h3>\n            <p>{}</p>\n          </li>'.format(t, d)
        for t, d in PASOS)

URL = 'https://lithora3d.com/generador-llaveros-3d/'

jsonld = {
 "@context": "https://schema.org",
 "@graph": [
  {"@type": "BreadcrumbList", "itemListElement": [
     {"@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://lithora3d.com/"},
     {"@type": "ListItem", "position": 2, "name": "Generador de llaveros 3D", "item": URL}]},
  {"@type": "SoftwareApplication",
   "@id": URL + "#app",
   "name": "Generador de llaveros 3D con nombre",
   "url": URL,
   "applicationCategory": "DesignApplication",
   "applicationSubCategory": "Generador de modelos para impresion 3D",
   "operatingSystem": "Cualquier navegador moderno (Chrome, Edge, Firefox, Safari)",
   "inLanguage": "es-MX",
   "description": "Herramienta web gratuita para crear llaveros 3D con nombres y nombres para lapiz, y descargarlos en STL o en 3MF multicolor listo para Bambu Studio. Sin registro y sin limite de descargas.",
   "featureList": ["Exportacion a STL", "Exportacion a 3MF multicolor para Bambu Studio",
                   "Quince tipografias incluidas", "Carga de tipografias propias en TTF u OTF",
                   "Varios nombres en una sola placa", "Aviso si la placa no cabe en la cama de impresion",
                   # Se retiro "Funciona sin conexion una vez cargada": no hay service
                   # worker ni manifest en el repo, asi que era una promesa sin respaldo.
                   "Compatible con enes, tildes y dieresis",
                   "Nombres para lapiz con tunel sin soportes y tope opcional",
                   "Prueba de ajuste imprimible para el diametro del lapiz"],
   "offers": {"@type": "Offer", "price": "0", "priceCurrency": "MXN",
              "availability": "https://schema.org/InStock"},
   "publisher": {"@id": "https://lithora3d.com/#organization"}},
  {"@type": "HowTo",
   "name": "Como crear un llavero 3D con nombre",
   "inLanguage": "es-MX",
   "totalTime": "PT2M",
   "tool": [{"@type": "HowToTool", "name": "Navegador web"}],
   "step": [{"@type": "HowToStep", "position": i + 1, "name": t, "text": d, "url": URL + "#como-funciona"}
            for i, (t, d) in enumerate(PASOS)]},
  {"@type": "FAQPage",
   "@id": URL + "#faq",
   "mainEntity": [{"@type": "Question", "name": p,
                   "acceptedAnswer": {"@type": "Answer", "text": r}} for p, r in FAQ]},
 ]}

PAGINA = '''<!DOCTYPE html>
<html lang="es-MX">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Generador de llaveros 3D y nombres para l&aacute;piz: gratis en STL y 3MF | Lithora 3D</title>
<meta name="description" content="Crea llaveros 3D con nombre y nombres para l&aacute;piz, y desc&aacute;rgalos gratis en STL o 3MF multicolor para Bambu Studio. Sin registro y sin l&iacute;mite de descargas. Funciona con &ntilde; y tildes.">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">
<meta name="theme-color" content="#0F172A">
<link rel="canonical" href="{url}">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/png" sizes="48x48" href="/assets/favicon-48.png">
<link rel="icon" type="image/png" sizes="96x96" href="/assets/favicon-96.png">
<link rel="icon" type="image/png" sizes="192x192" href="/assets/favicon-192.png">
<link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png">
<meta property="og:locale" content="es_MX">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Lithora 3D">
<meta property="og:title" content="Generador de llaveros 3D y nombres para l&aacute;piz: gratis en STL y 3MF">
<meta property="og:description" content="Escribe los nombres, elige llavero o nombre para l&aacute;piz y desc&aacute;rgalo listo para imprimir. Gratis, sin registro y sin l&iacute;mite de descargas.">
<meta property="og:url" content="{url}">
<meta property="og:image" content="https://lithora3d.com/assets/og-card.jpg">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Generador de llaveros 3D de Lithora 3D">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Generador de llaveros 3D y nombres para l&aacute;piz: gratis en STL y 3MF">
<meta name="twitter:description" content="Crea llaveros con nombre y desc&aacute;rgalos en STL o 3MF multicolor. Sin registro.">
<meta name="twitter:image" content="https://lithora3d.com/assets/og-card.jpg">
<link rel="preload" href="/assets/fonts/inter-latin-400.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/fonts/inter-latin-700.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/assets/fonts/inter.css">
<link rel="stylesheet" href="assets/app/estilos.css">
<link rel="stylesheet" href="assets/app/pagina.css">
<link rel="preload" as="fetch" href="assets/fuentes/fuentes.json" crossorigin="anonymous">
<link rel="preload" as="fetch" href="assets/fuentes/poppins-bold.ttf" crossorigin="anonymous">
<script type="application/ld+json">
{jsonld}
</script>
</head>
<body>
<nav class="miga" aria-label="Ruta de navegaci&oacute;n">
  <a href="/">Inicio</a> <span aria-hidden="true">/</span> <span>Generador de llaveros 3D</span>
</nav>



{cuerpo}

<div class="contenido">
  <section id="como-funciona">
    <h2>C&oacute;mo funciona</h2>
    <ol class="pasos">
{pasos}
    </ol>
    <p>Todo ocurre dentro de tu navegador. No se sube ning&uacute;n archivo a ning&uacute;n servidor y la herramienta
    sigue funcionando aunque pierdas la conexi&oacute;n despu&eacute;s de cargarla.</p>
  </section>

  <section id="diferencias">
    <h2>Qu&eacute; lo hace distinto</h2>
    <h3>Exporta 3MF multicolor, no solo STL</h3>
    <p>La mayor&iacute;a de generadores de llaveros solo entregan STL, que es un archivo de una sola pieza: al abrirlo
    en el laminador tienes que separar el texto de la base a mano para poder darles colores distintos. Aqu&iacute; el
    3MF sale como proyecto de Bambu Studio con la base y el texto ya separados y cada uno asignado a un filamento.
    Abres el archivo, eliges qu&eacute; color va en cada ranura y ya est&aacute;.</p>
    <h3>Sin muro de pago</h3>
    <p>No hay l&iacute;mite de descargas ni cuenta que crear. Puedes generar treinta llaveros para un grupo escolar
    y descargarlos las veces que necesites.</p>
    <h3>Pensado para nombres en espa&ntilde;ol</h3>
    <p>Los nombres con &ntilde;, tildes y di&eacute;resis se generan correctamente. Y si eliges una tipograf&iacute;a
    que no trae alg&uacute;n car&aacute;cter, la herramienta te lo dice antes de que descargues, en lugar de quitarlo
    en silencio y que lo descubras cuando la pieza ya est&aacute; impresa.</p>
    <h3>Te avisa si no cabe</h3>
    <p>Eliges tu impresora y, si la placa se pasa del tama&ntilde;o de la cama, aparece un aviso con el motivo y qu&eacute;
    puedes ajustar. Si cabe girando la placa noventa grados, tambi&eacute;n te lo dice.</p>
  </section>

  <section id="usos">
    <h2>Para qu&eacute; se usa</h2>
    <p>El caso m&aacute;s com&uacute;n no es un llavero suelto, sino un lote con varios nombres:</p>
    <ul class="lista-usos">
      <li><strong>Escuela.</strong> Identificadores para mochilas, loncheras y l&aacute;pices de un grupo completo, o recuerdos de fin de curso.</li>
      <li><strong>Bodas y XV a&ntilde;os.</strong> Recuerdos para invitados con el nombre de cada uno, que adem&aacute;s sirven de se&ntilde;alizaci&oacute;n de mesa.</li>
      <li><strong>Equipos y uniformes.</strong> Llaveros con el nombre de cada integrante de un equipo deportivo o de una plantilla de trabajo.</li>
      <li><strong>Negocios.</strong> Llaveros con la marca para entregar con cada venta o en una feria.</li>
      <li><strong>Mascotas.</strong> Placas con el nombre del animal y un tel&eacute;fono de contacto.</li>
      <li><strong>Regalos.</strong> Un detalle personalizado que se fabrica en minutos.</li>
    </ul>
  </section>

  <section id="imprimir">
    <h2>C&oacute;mo imprimirlo bien</h2>
    <h3>Material</h3>
    <p>El PLA cumple de sobra para un llavero de uso normal y es el m&aacute;s econ&oacute;mico. Si la pieza va a
    quedarse dentro de un coche al sol o a recibir tirones fuertes, el PETG aguanta mejor el calor y la fatiga.
    Puedes comparar las opciones en la <a href="/materiales-impresion-3d/">gu&iacute;a de materiales</a>.</p>
    <h3>Dos colores con AMS</h3>
    <p>Elige el modo multicolor y descarga el 3MF. &Aacute;brelo en Bambu Studio con <em>Archivo &rarr; Abrir proyecto</em>,
    no con <em>Importar</em>, para que se aplique el perfil que trae el archivo.</p>
    <h3>Dos colores sin AMS</h3>
    <p>Si tu impresora es de un solo extrusor, elige el modo de cambio de rollo. La herramienta calcula y te muestra
    la altura exacta en mil&iacute;metros a la que programar la pausa: por debajo de esa altura imprime la base y por
    encima, las letras.</p>
    <h3>Qu&eacute; define el costo</h3>
    <p>El precio de imprimir un llavero depende del tama&ntilde;o de la pieza, del material, del acabado y sobre todo de
    la cantidad: un lote de treinta sale muy distinto a una pieza suelta porque se imprimen de una sola pasada.
    Puedes ver <a href="/precios-impresion-3d/">qu&eacute; entra en una cotizaci&oacute;n</a> o pedirnos una propuesta concreta.</p>
  </section>

  <section id="faq">
    <h2>Preguntas frecuentes</h2>
{faq}
  </section>

  <section id="servicio" class="bloque-servicio">
    <h2>&iquest;No tienes impresora 3D?</h2>
    <p>Lithora 3D es un servicio real de impresi&oacute;n 3D. Genera aqu&iacute; tu archivo y nos lo mandas, o
    cu&eacute;ntanos qu&eacute; necesitas y lo resolvemos nosotros: atendemos entregas en Tampico, Ciudad Madero y
    Altamira, y enviamos proyectos al resto de M&eacute;xico.</p>
    <p class="acciones-servicio">
      <a class="boton-primario" href="/cotizar/">Pedir una cotizaci&oacute;n</a>
      <a class="boton-secundario" href="/servicio-impresion-3d/">Ver el servicio completo</a>
    </p>
  </section>
</div>

<footer class="pie">
  <p><a href="/">Lithora 3D</a> &middot; Impresi&oacute;n 3D en Tampico, Ciudad Madero y Altamira</p>
  <p class="pie-version">Generador versi&oacute;n {ver} &middot; si este c&oacute;digo no coincide con el m&aacute;s reciente, recarga con Ctrl+Shift+R</p>
  <p class="pie-enlaces">
    <a href="/servicio-impresion-3d/">Servicio</a>
    <a href="/prototipado-rapido/">Prototipado</a>
    <a href="/precios-impresion-3d/">Precios</a>
    <a href="/materiales-impresion-3d/">Materiales</a>
    <a href="/cotizar/">Cotizar</a>
  </p>
</footer>

<script src="assets/vendor/three.js"></script>
<script src="assets/vendor/opentype.js"></script>
<script src="assets/vendor/fflate.js"></script>
<script src="assets/vendor/clipper.js"></script>
<script src="assets/app/geometria.js"></script>
<script src="assets/app/exportadores.js"></script>
<script>
/* El perfil de Bambu se carga aparte para no bloquear el primer pintado. */
window.__BAMBU_PROJECT__ = null;
fetch('assets/app/perfil-bambu.json').then(r => r.json()).then(p => { window.__BAMBU_PROJECT__ = p; });
</script>
<script src="assets/app/creador.js" defer></script>
</body>
</html>
'''

# Sustitucion literal, no .format(): el cuerpo de la app trae CSS y JS con
# llaves que .format() interpretaria como campos.
salida = PAGINA
for marca, valor in (
    ('{url}', URL),
    ('{jsonld}', json.dumps(jsonld, ensure_ascii=False, indent=2)),
    ('{pasos}', pasos_html()),
    ('{faq}', faq_html()),
    ('{cuerpo}', CUERPO),
):
    salida = salida.replace(marca, valor)

# Versionado de recursos: el hash del contenido real de la app viaja en la URL
# (?v=...). Asi, tras un despliegue, una recarga normal SIEMPRE trae el JS y el
# perfil que corresponden a este HTML; sin esto, un navegador podia quedarse
# con exportadores.js viejo y generar 3MF con el perfil anterior sin avisar.
#
# Se normalizan los finales de linea antes de hashear. Con core.autocrlf el
# checkout de Windows deja CRLF y el del CI en Linux deja LF: hasheando los
# bytes crudos, el mismo commit producia un ?v= distinto en cada maquina y la
# prueba del candado (tests/static-audit.test.mjs) fallaba en CI aunque el
# contenido fuera identico. El hash es del CONTENIDO, no del checkout.
#
# fuentes.json entra en el hash: enumera las tipografias incluidas y la app la
# pide en tiempo de ejecucion, asi que al anadir una fuente el ?v= debe cambiar
# para que un navegador con cache vieja no se quede sin ella. camisetas.json
# entra por lo mismo: la app la pide bajo demanda al elegir el producto.
import hashlib
_hash = hashlib.md5()
for _rec in ('assets/app/estilos.css', 'assets/app/pagina.css',
             'assets/app/geometria.js', 'assets/app/exportadores.js',
             'assets/app/creador.js', 'assets/app/perfil-bambu.json',
             'assets/fuentes/fuentes.json', 'assets/plantillas/camisetas.json'):
    _datos = open(os.path.join(AQUI, _rec.replace('/', os.sep)), 'rb').read()
    _hash.update(_datos.replace(b'\r\n', b'\n'))
VER = _hash.hexdigest()[:8]
for _rec in ('assets/app/estilos.css', 'assets/app/pagina.css',
             'assets/vendor/three.js', 'assets/vendor/opentype.js',
             'assets/vendor/fflate.js', 'assets/vendor/clipper.js',
             'assets/app/geometria.js', 'assets/app/exportadores.js',
             'assets/app/creador.js', 'assets/app/perfil-bambu.json',
             # Las dos precargas de tipografia tambien: creador.js pide estos
             # recursos con el ?v= de la app, asi que sin versionar aqui el
             # navegador descargaba cada uno DOS veces (la precarga sin version
             # y luego el fetch versionado) y la precarga no servia de nada.
             'assets/fuentes/fuentes.json', 'assets/fuentes/poppins-bold.ttf'):
    assert salida.count('"' + _rec + '"') + salida.count("'" + _rec + "'") == 1, _rec
    salida = salida.replace('"' + _rec + '"', '"' + _rec + '?v=' + VER + '"')
    salida = salida.replace("'" + _rec + "'", "'" + _rec + '?v=' + VER + "'")

# Sello visible al pie: el usuario puede comprobar de un vistazo qué build
# tiene cargado la pestaña, sin abrir DevTools ni adivinar cachés.
assert salida.count('{ver}') == 1
salida = salida.replace('{ver}', VER)

open(os.path.join(AQUI, 'index.html'), 'w', encoding='utf-8', newline='\n').write(salida)

palabras = len(re.sub(r'<[^>]+>', ' ', re.search(r'<div class="contenido">.*?</div>\s*<footer', salida, re.S).group(0)).split())
print('index.html generado:', round(len(salida.encode('utf-8')) / 1024, 1), 'KB')
print('palabras de contenido indexable (sin la app):', palabras)
print('preguntas en FAQ:', len(FAQ))
