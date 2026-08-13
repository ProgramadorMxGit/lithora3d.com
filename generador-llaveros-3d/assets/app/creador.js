(function () {
  'use strict';

  // ---------- constants ----------
  const NAME_COLORS = ['#e63946', '#2a9d8f', '#e9a200', '#7b2cbf', '#0077b6', '#d81e5b', '#3a9d23', '#e05d00'];

  const COLOR_PRESETS = [
    {n: 'Clásico', b: '#f5f5f5', t: '#2b2b2b'},
    {n: 'Fuego', b: '#2b2b2b', t: '#ff6b35'},
    {n: 'Chicle', b: '#ffd6e8', t: '#e5006d'},
    {n: 'Océano', b: '#cde7f0', t: '#12557d'},
    {n: 'Bosque', b: '#f1faee', t: '#1b7f5e'},
    {n: 'Neón', b: '#1a1a1a', t: '#39ff14'},
    {n: 'Oro', b: '#1a1a1a', t: '#e6b325'},
    {n: 'Lavanda', b: '#ede4f7', t: '#6b2fbf'},
  ];

  const state = {
    productType: 'keychain',
    names: ['Dafne', 'Hugo'],
    fontKey: null,
    letterHeight: 12,
    textBold: 0,         // negrita sintética en mm por lado; engorda trazos de fuentes script
    fixedHeight: false,  // force every keychain to a target Y height (mm)
    targetHeight: 25,    // the general target Y height when fixedHeight is on
    nameHeights: [],     // per-name Y override (mm), parallel to names; blank = use general
    baseThickness: 2.4,
    raisedHeight: 1.4,
    padding: 4,
    corner: 4,
    holeD: 4.5,
    ringThickness: 2.5,
    pencilHoleD: 8.1,   // esquinas del lápiz escolar hexagonal ≈8.1; impreso queda ≈7.9 = roce firme
                        // (7.7 probado en físico: demasiado apretado; 8.6: flojo)
    pencilWall: 1.4,
    pencilCapEnd: 'end',    // 'end' (tope donde termina el nombre, como el clásico) | 'start' | 'open'
    pencilTunnelStyle: 'round', // 'round' (hueco redondo, como el clásico) | 'teardrop' (techo 45° sin soportes)
    showPencilGhost: true,  // lápiz de ejemplo en el visor; nunca se exporta
    columns: 2,
    gap: 6,
    curveSegments: 10,
    style: 'plate',
    outlineWidth: 2,
    bordeColor: '#8ecae6',
    baseColor: '#f5f5f5',
    textColor: '#2b2b2b',
    rainbow: false,
    nameColors: [], // per-name colour, parallel to `names`; filled from NAME_COLORS

    printMode: 'swap',
    layerHeight: 0.2,
    printer: 'a1',
  };

  /* Copia congelada de los valores de fábrica, para "Empezar de nuevo". */
  const DEFAULT_STATE = JSON.parse(JSON.stringify(state));
  const MAX_NAMES = 24;
  const MAX_FILAMENT_SLOTS = 16;   // tope de Bambu Studio; la asignación de extrusor cicla ahí

  /** Área útil de cama por impresora, en mm. Se compara contra la huella real
   *  de la placa para avisar ANTES de descargar, no en el laminador. */
  const PRINTERS = [
    {id: 'a1',      label: 'Bambu A1 / P1S / X1C',   w: 256, h: 256},
    {id: 'a1mini',  label: 'Bambu A1 mini',          w: 180, h: 180},
    {id: 'prusa',   label: 'Prusa MK4 / MK3',        w: 250, h: 210},
    {id: 'ender',   label: 'Creality Ender 3',       w: 220, h: 220},
    {id: 'grande',  label: 'Grande (300 × 300)',     w: 300, h: 300},
    {id: 'none',    label: 'No avisarme del tamaño', w: 0,   h: 0},
  ];

  const fonts = {};
  // Sin fuente de emoji: los constructores de geometría la aceptan como null y
  // cualquier emoji tecleado a mano se ignora (se trata como un espacio).
  const emojiFont = null;
  let lastLayoutPieces = [];
  let lastBaseZ = state.baseThickness;
  let lastValidNames = [];
  // tileIndex -> index into state.names/state.nameColors (skips empty rows)
  let lastValidOrig = [];

  const $ = id => document.getElementById(id);
  const nameRowsEl = $('name-rows');
  const fontGridEl = $('font-grid');
  const emptyHint = $('empty-hint');
  const hud = $('hud');

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
  }

  // ---------- fonts ----------
  function base64ToArrayBuffer(b64) {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes.buffer;
  }

  /** Cabecera real de un archivo de fuente: 0x00010000 (TrueType), "true"/"ttcf"
   *  (TrueType/coleccion) u "OTTO" (CFF). La extension no prueba nada. */
  function looksLikeFont(arrayBuffer) {
    if (!arrayBuffer || arrayBuffer.byteLength < 4) return false;
    const b = new Uint8Array(arrayBuffer, 0, 4);
    const tag = String.fromCharCode(b[0], b[1], b[2], b[3]);
    if (tag === 'OTTO' || tag === 'true' || tag === 'ttcf') return true;
    return b[0] === 0x00 && b[1] === 0x01 && b[2] === 0x00 && b[3] === 0x00;
  }

  let fontCounter = 0;
  async function registerFont(label, arrayBuffer, isCustom) {
    const key = 'f' + (fontCounter++);
    const cssName = 'kcfont_' + key;
    let face = null;
    try {
      /* Antes se hacia document.fonts.add() ANTES de opentype.parse, asi que una
         fuente que cargaba como CSS pero no se podia parsear quedaba registrada
         para siempre sin tarjeta. Ahora se parsea primero y solo se registra si
         las dos cosas funcionan. */
      const otFont = opentype.parse(arrayBuffer);
      face = new FontFace(cssName, arrayBuffer);
      await face.load();
      document.fonts.add(face);
      fonts[key] = {label, cssName, otFont, isCustom: !!isCustom};
      addFontCard(key);
      if (!state.fontKey) selectFont(key);
      return key;
    } catch (e) {
      console.warn('No se pudo cargar la fuente', label, e);
      if (face) { try { document.fonts.delete(face); } catch (_) {} }
      return null;
    }
  }

  /* Las tarjetas eran <div> sin rol ni tabindex: las tipografias no se podian
     elegir con teclado ni las anunciaba un lector de pantalla, y era el unico
     control sin ruta alternativa. Ahora son un radiogroup navegable con flechas
     (un solo tab stop, que es el patron esperado). */
  function addFontCard(key) {
    const f = fonts[key];
    const card = document.createElement('div');
    card.className = 'font-card';
    card.dataset.key = key;
    card.setAttribute('role', 'radio');
    card.setAttribute('aria-checked', 'false');
    card.setAttribute('aria-label', f.label);
    card.tabIndex = -1;
    card.style.fontFamily = '"' + f.cssName + '", sans-serif';
    card.innerHTML = '<span aria-hidden="true">Abc</span><small>' + escapeHtml(f.label) + '</small>' + (f.isCustom ? '<span class="badge">TUYA</span>' : '');
    card.addEventListener('click', () => selectFont(key));
    card.addEventListener('keydown', ev => {
      if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); selectFont(key); return; }
      const dir = ev.key === 'ArrowRight' || ev.key === 'ArrowDown' ? 1
        : ev.key === 'ArrowLeft' || ev.key === 'ArrowUp' ? -1 : 0;
      if (!dir) return;
      ev.preventDefault();
      const cards = [...fontGridEl.children];
      const next = cards[(cards.indexOf(card) + dir + cards.length) % cards.length];
      if (next) { selectFont(next.dataset.key); next.focus(); }
    });
    fontGridEl.appendChild(card);
  }

  /** Solo marca visualmente la tarjeta, sin tocar el estado ni reconstruir:
   *  lo usa la restauración, que ya trae el estado puesto. */
  function selectFontCard(key) {
    [...fontGridEl.children].forEach(c => {
      const on = c.dataset.key === key;
      c.classList.toggle('selected', on);
      c.setAttribute('aria-checked', on ? 'true' : 'false');
      // Un unico tab stop: el elegido. Las flechas mueven dentro del grupo.
      c.tabIndex = on ? 0 : -1;
    });
    if (!fontGridEl.querySelector('[tabindex="0"]') && fontGridEl.firstElementChild) {
      fontGridEl.firstElementChild.tabIndex = 0;
    }
  }

  /* Version web: las 15 tipografias pesan 3.4 MB juntas. Cargarlas todas al abrir
     hacia inviable la pagina en movil. Ahora al inicio solo se descargan micro
     subconjuntos woff2 con las letras "Abc" (28 KB las quince) para pintar las
     tarjetas, y el TTF completo de una tipografia se pide solo cuando se elige.
     La primera se precarga para que el modelo aparezca sin esperar. */
  const RUTA_FUENTES = 'assets/fuentes/';
  const cargasEnCurso = {};

  async function asegurarFuenteCompleta(key) {
    const f = fonts[key];
    if (!f || f.otFont) return f && f.otFont ? f : null;
    if (cargasEnCurso[key]) return cargasEnCurso[key];
    cargasEnCurso[key] = (async () => {
      try {
        const resp = await fetch(RUTA_FUENTES + f.archivo, {mode: 'cors'});
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        const buf = await resp.arrayBuffer();
        if (!looksLikeFont(buf)) throw new Error('archivo no es una fuente');
        f.otFont = opentype.parse(buf);
        // Se sustituye la miniatura por la fuente completa para que la vista
        // previa de la tarjeta deje de estar limitada a "Abc".
        try {
          const face = new FontFace(f.cssName, buf);
          await face.load();
          document.fonts.add(face);
        } catch (_) {}
        return f;
      } catch (e) {
        console.warn('No se pudo cargar la tipografía', f.label, e);
        return null;
      } finally {
        delete cargasEnCurso[key];
      }
    })();
    return cargasEnCurso[key];
  }

  async function selectFont(key) {
    selectFontCard(key);
    const listo = await asegurarFuenteCompleta(key);
    if (!listo) {
      const box = $('text-warn');
      if (box) {
        box.hidden = false;
        box.innerHTML = '⚠️ No se pudo cargar esa tipografía. Revisa tu conexión y vuelve a intentarlo.';
      }
      if (state.fontKey) selectFontCard(state.fontKey);
      return;
    }
    state.fontKey = key;
    scheduleRebuild();
  }

  async function loadBuiltinFonts() {
    const resp = await fetch(RUTA_FUENTES + 'fuentes.json', {mode: 'cors'});
    const lista = await resp.json();
    lista.forEach(meta => {
      const key = 'f' + (fontCounter++);
      const cssName = 'kcfont_' + key;
      // La miniatura entra por CSS puro: no hace falta parsear nada para pintarla.
      const css = '@font-face{font-family:"' + cssName + '";src:url("' +
        RUTA_FUENTES + meta.miniatura + '") format("woff2");font-display:swap}';
      const st = document.createElement('style');
      st.textContent = css;
      document.head.appendChild(st);
      fonts[key] = {label: meta.nombre, cssName, otFont: null, archivo: meta.archivo, isCustom: false};
      addFontCard(key);
    });
    const primera = Object.keys(fonts)[0];
    if (primera) {
      state.fontKey = primera;
      selectFontCard(primera);
      await asegurarFuenteCompleta(primera);
    }
  }

  let lastNameInput = null;

  /* Antes cualquier fallo aqui era mudo: soltar un .ttf corrupto no producia
     ninguna respuesta visible. Ahora se valida tamaño y cabecera, y todo error
     se reporta en el mismo aviso que usan los problemas de texto. */
  const MAX_FONT_BYTES = 20 * 1024 * 1024;
  async function handleFontFiles(files) {
    const problemas = [];
    for (const file of files) {
      try {
        if (file.size > MAX_FONT_BYTES) {
          problemas.push(file.name + ' (demasiado grande, máx. 20 MB)');
          continue;
        }
        const buf = await file.arrayBuffer();
        if (!looksLikeFont(buf)) {
          problemas.push(file.name + ' (no parece un archivo de fuente)');
          continue;
        }
        const key = await registerFont(file.name.replace(/\.(ttf|otf)$/i, ''), buf, true);
        if (key) selectFont(key);
        else problemas.push(file.name + ' (no se pudo leer)');
      } catch (err) {
        console.error(err);
        problemas.push(file.name + ' (no se pudo abrir)');
      }
    }
    if (problemas.length) {
      const box = $('text-warn');
      if (box) {
        box.hidden = false;
        box.innerHTML = '⚠️ No se pudo usar: <b>' + problemas.map(escapeHtml).join('</b>, <b>') + '</b>';
      }
    }
  }

  // A <button> that forwards to a hidden input, rather than a <label> wrapping
  // it: the label version was announced as plain text by assistive tech and
  // gave no keyboard focus.
  $('font-open').addEventListener('click', () => $('upload-font-input').click());
  $('upload-font-input').addEventListener('change', async e => {
    await handleFontFiles(e.target.files);
    e.target.value = '';
  });

  // ---------- names ----------
  function nameColor(i) {
    if (!state.nameColors[i]) state.nameColors[i] = NAME_COLORS[i % NAME_COLORS.length];
    return state.nameColors[i];
  }

  function renderNameRows() {
    nameRowsEl.innerHTML = '';
    state.names.forEach((name, i) => {
      const row = document.createElement('div');
      row.className = 'name-row';
      /* La fila se construye con createElement/setAttribute en vez de concatenar
         HTML: targetHeight y nameColors salian crudos dentro de atributos y, como
         venian de localStorage (origen opaco y compartido en file://), un guardado
         manipulado podia inyectar atributos. Ademas cada campo lleva ahora nombre
         accesible propio: antes solo tenian placeholder o title. */
      const main = document.createElement('div');
      main.className = 'name-main';

      const pickEl = document.createElement('input');
      pickEl.type = 'color';
      pickEl.className = 'swatch-pick';
      pickEl.title = 'Color de este nombre';
      pickEl.setAttribute('aria-label', 'Color del nombre ' + (i + 1));
      pickEl.value = nameColor(i);
      main.appendChild(pickEl);

      const textEl = document.createElement('input');
      textEl.type = 'text';
      textEl.maxLength = 20;
      textEl.dataset.nameIndex = String(i);
      textEl.placeholder = 'Escribe un nombre';
      textEl.setAttribute('aria-label', 'Nombre ' + (i + 1));
      textEl.value = name;
      main.appendChild(textEl);

      if (state.fixedHeight && state.productType !== 'pencil') {
        const wrap = document.createElement('label');
        wrap.className = 'name-h-wrap';
        wrap.title = 'Alto de este llavero en mm (vacío = usa el alto general)';
        const hEl = document.createElement('input');
        hEl.type = 'number';
        hEl.className = 'name-h';
        hEl.min = '8'; hEl.max = '120'; hEl.step = '0.5';
        hEl.placeholder = String(state.targetHeight);
        hEl.setAttribute('aria-label', 'Alto en milímetros del nombre ' + (i + 1));
        hEl.value = state.nameHeights[i] > 0 ? String(state.nameHeights[i]) : '';
        wrap.appendChild(hEl);
        wrap.appendChild(document.createTextNode('mm'));
        main.appendChild(wrap);
      }

      const delEl = document.createElement('button');
      delEl.className = 'icon-btn';
      delEl.type = 'button';
      delEl.title = 'Borrar';
      delEl.setAttribute('aria-label', 'Borrar el nombre ' + (i + 1));
      delEl.textContent = '✕';
      delEl.disabled = state.names.length <= 1;
      main.appendChild(delEl);

      row.appendChild(main);
      const input = row.querySelector('input[type=text]');
      input.addEventListener('input', () => { state.names[i] = input.value; scheduleRebuild(); });
      input.addEventListener('focus', () => { lastNameInput = input; });
      const hInput = row.querySelector('.name-h');
      if (hInput) hInput.addEventListener('input', () => {
        const v = parseFloat(hInput.value);
        state.nameHeights[i] = (v > 0) ? v : null;
        scheduleRebuild();
      });
      const pick = row.querySelector('.swatch-pick');
      pick.addEventListener('input', () => {
        state.nameColors[i] = pick.value;
        // choosing a colour for one name IS opting into per-name colours
        if (!state.rainbow) {
          state.rainbow = true;
          $('in-rainbow').checked = true;
          updatePrintInfo();
        }
        syncColorInputs();
        applyColours();
      });
      row.querySelector('button').addEventListener('click', () => {
        if (state.names.length <= 1) return;
        state.names.splice(i, 1);
        state.nameColors.splice(i, 1);
        state.nameHeights.splice(i, 1);
        renderNameRows();
        scheduleRebuild();
      });
      nameRowsEl.appendChild(row);
    });
    paintNameSwatches();
  }

  function paintNameSwatches() {
    nameRowsEl.querySelectorAll('.swatch-pick').forEach((el, i) => {
      el.value = state.rainbow ? nameColor(i) : state.textColor;
      el.classList.toggle('muted', !state.rainbow);
    });
  }

  $('btn-add-name').addEventListener('click', () => {
    if (state.names.length >= MAX_NAMES) { updateNameCapHint(); return; }
    state.names.push('');
    renderNameRows();
    updateNameCapHint();
    // Solo los campos de texto: querySelectorAll('input') incluia el selector de
    // color y la casilla de mm, asi que con "Fijar alto (Y)" activo el foco caia
    // en los milimetros en vez de en el nombre nuevo.
    const inputs = nameRowsEl.querySelectorAll('input[type="text"]');
    if (inputs.length) inputs[inputs.length - 1].focus();
  });

  // ---------- product type: keyring or pencil name ----------
  const productListEl = $('product-list');
  productListEl.querySelectorAll('.product-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      state.productType = btn.dataset.product;
      syncProductUI();
      scheduleRebuild();
    });
  });

  $('pencil-fit-list').querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      state.pencilHoleD = parseFloat(btn.dataset.pencilD);
      $('in-pencilHoleD').value = state.pencilHoleD;
      $('val-pencilHoleD').textContent = state.pencilHoleD.toFixed(1) + ' mm';
      syncPencilPresets();
      scheduleRebuild();
    });
  });

  function syncPencilPresets() {
    $('pencil-fit-list').querySelectorAll('button').forEach(btn => {
      const on = Math.abs(parseFloat(btn.dataset.pencilD) - state.pencilHoleD) < 0.01;
      btn.classList.toggle('selected', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  // ---------- pencil tunnel cap: open / capped at name start / at name end ----
  const pencilCapListEl = $('pencil-cap-list');
  if (pencilCapListEl) {
    pencilCapListEl.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        state.pencilCapEnd = btn.dataset.cap;
        syncPencilCapUI();
        scheduleRebuild();
      });
    });
  }

  // ---------- pencil tunnel shape: round like the classic / 45° roof ----------
  const pencilTunnelListEl = $('pencil-tunnel-list');
  if (pencilTunnelListEl) {
    pencilTunnelListEl.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        state.pencilTunnelStyle = btn.dataset.tunnel;
        syncPencilCapUI();
        scheduleRebuild();
      });
    });
  }

  function syncPencilCapUI() {
    if (pencilCapListEl) {
      pencilCapListEl.querySelectorAll('button').forEach(btn => {
        const on = btn.dataset.cap === state.pencilCapEnd;
        btn.classList.toggle('selected', on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }
    if (pencilTunnelListEl) {
      pencilTunnelListEl.querySelectorAll('button').forEach(btn => {
        const on = btn.dataset.tunnel === state.pencilTunnelStyle;
        btn.classList.toggle('selected', on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }
    const ghostChk = $('in-showPencilGhost');
    if (ghostChk) ghostChk.checked = state.showPencilGhost;
  }

  /** El clásico esconde el túnel DENTRO de las letras. Si las letras son más
   *  bajas que el túnel con su pared, el tubo se asoma entre ellas: avisamos y
   *  sugerimos el tamaño que lo esconde, en vez de dejar que el usuario
   *  descubra la diferencia comparando contra una pieza comprada. */
  function updatePencilHint() {
    const box = $('pencil-size-hint');
    if (!box) return;
    const envelope = state.pencilHoleD + 2 * state.pencilWall;
    const show = state.productType === 'pencil' && state.letterHeight < envelope + 0.6;
    box.hidden = !show;
    if (show) {
      const sugerida = Math.round(envelope * 1.3);
      box.innerHTML = '🔍 Con letras de <b>' + state.letterHeight.toFixed(0) + ' mm</b> el túnel (' +
        envelope.toFixed(1) + ' mm con su pared) se asoma entre las letras. ' +
        'Sube el <b>tamaño de las letras a ' + sugerida + ' mm o más</b> para esconderlo dentro del nombre, como en los clásicos.';
    }
  }

  function syncProductUI() {
    const pencil = state.productType === 'pencil';
    if (!pencil) lastBaseZ = state.baseThickness;
    productListEl.querySelectorAll('.product-opt').forEach(btn => {
      const on = btn.dataset.product === state.productType;
      btn.classList.toggle('selected', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    $('pencil-settings').hidden = !pencil;
    $('pencil-style-note').hidden = !pencil;
    $('style-list').style.display = pencil ? 'none' : 'grid';
    $('fixed-height-row').style.display = pencil ? 'none' : 'flex';
    $('fixed-h-note').hidden = pencil || !state.fixedHeight;
    $('base-thickness-row').style.display = pencil ? 'none' : 'block';
    $('keyring-hole-row').style.display = pencil ? 'none' : 'block';
    $('btn-add-name').textContent = pencil ? '+ Añadir otro nombre para lápiz' : '+ Añadir nombre';
    renderNameRows();
    syncPencilPresets();
    syncPencilCapUI();
    syncStyleUI();
    updatePrintInfo();
    updatePencilHint();
    updateFitTestButton();
    updateWhatsAppCta();
  }

  // ---------- style ----------
  const styleListEl = $('style-list');
  styleListEl.querySelectorAll('.style-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      state.style = btn.dataset.style;
      syncStyleUI();
      scheduleRebuild();
    });
  });

  function syncStyleUI() {
    const pencil = state.productType === 'pencil';
    styleListEl.querySelectorAll('.style-opt').forEach(b =>
      b.classList.toggle('selected', b.dataset.style === state.style));
    const needsOutline = pencil || state.style === 'outline' || state.style === 'double';
    $('outline-width-row').style.display = needsOutline ? 'block' : 'none';
    if (!needsOutline) $('islands-warn').hidden = true;
    $('borde-pick').hidden = pencil || state.style !== 'double';
  }

  /** Anything above one island means the dilated letters never merged, so the
   * "keychain" would come off the bed as separate loose letters. */
  function updateIslandsWarning(maxIslands) {
    const box = $('islands-warn');
    const applies = state.productType === 'pencil' || state.style === 'outline' || state.style === 'double';
    if (!applies || maxIslands <= 1) { box.hidden = true; return; }
    box.hidden = false;
    box.innerHTML =
      '⚠️ Con este borde las letras <b>no se tocan</b>: saldrían ' + maxIslands +
      ' piezas sueltas en vez de una pieza completa.' +
      '<br><small>Sube el <b>grosor del borde</b> hasta que desaparezca este aviso, ' +
      'o elige una letra más redonda y pegada (Pacifico, Caveat, Permanent Marker).</small>';
  }

  /** Avisa de las filas que no pudieron construirse y de los caracteres que la
   *  tipografia elegida no tiene. Antes ambos casos eran mudos: el usuario
   *  descargaba "Bego a" y solo lo descubria al imprimir. */
  function updateTextWarning(failedNames, missingChars) {
    const box = $('text-warn');
    if (!box) return;
    if ((!failedNames || !failedNames.length) && (!missingChars || !missingChars.length)) {
      box.hidden = true;
      box.textContent = '';
      return;
    }
    const parts = [];
    if (failedNames && failedNames.length) {
      const noun = state.productType === 'pencil' ? 'el nombre para lápiz' : 'el llavero';
      parts.push('⚠️ No se pudo crear ' + noun + ' de: <b>' + failedNames.map(escapeHtml).join('</b>, <b>') +
        '</b>. El resto sí se generó.');
    }
    if (missingChars && missingChars.length) {
      parts.push('⚠️ Esta tipografía no tiene estos caracteres: <b>' +
        missingChars.map(escapeHtml).join(' ') + '</b>. Se omiten en la pieza impresa.' +
        '<br><small>Elige otra letra o quítalos del nombre.</small>');
    }
    box.hidden = false;
    box.innerHTML = parts.join('<br>');
  }

  // ---------- colours ----------
  const presetsEl = $('color-presets');
  COLOR_PRESETS.forEach(p => {
    const b = document.createElement('button');
    b.className = 'preset';
    b.type = 'button';
    b.title = p.n;
    // La muestra enseña la combinación real de filamentos, así que su contraste
    // es información, no un defecto: se marca decorativa y el nombre accesible
    // del botón lo aporta la etiqueta de debajo.
    b.innerHTML =
      '<span class="preset-chip" aria-hidden="true" style="background:' + p.b + '">' +
      '<span class="preset-letter" style="color:' + p.t + '">Aa</span></span>' +
      '<small>' + escapeHtml(p.n) + '</small>';
    b.addEventListener('click', () => {
      state.baseColor = p.b;
      state.textColor = p.t;
      state.rainbow = false;
      $('in-rainbow').checked = false;
      syncColorInputs();
      applyColours();
      scheduleRebuild();
    });
    presetsEl.appendChild(b);
  });

  function syncColorInputs() {
    $('in-baseColor').value = state.baseColor;
    $('in-textColor').value = state.textColor;
    [...presetsEl.children].forEach((el, i) => {
      const p = COLOR_PRESETS[i];
      el.classList.toggle('selected', !state.rainbow && p.b === state.baseColor && p.t === state.textColor);
    });
  }

  $('in-baseColor').addEventListener('input', e => {
    state.baseColor = e.target.value;
    syncColorInputs(); applyColours();
  });
  $('in-bordeColor').addEventListener('input', e => {
    state.bordeColor = e.target.value;
    applyColours();
  });
  $('in-textColor').addEventListener('input', e => {
    state.textColor = e.target.value;
    state.rainbow = false;
    $('in-rainbow').checked = false;
    syncColorInputs(); applyColours(); paintNameSwatches();
  });
  $('in-rainbow').addEventListener('change', e => {
    state.rainbow = e.target.checked;
    syncColorInputs(); applyColours(); paintNameSwatches(); updatePrintInfo();
  });

  // ---------- arrastrar y soltar una tipografia ----------
  /* Sigue siendo la salida de emergencia cuando el dialogo del sistema se abre
     detras de la ventana o tarda en aparecer, que desde fuera parece que el
     boton no hace nada. */
  const dropOverlay = document.createElement('div');
  dropOverlay.id = 'drop-overlay';
  dropOverlay.innerHTML = '<div>\u{1F4C2} Suelta aqu\u00ed tu tipograf\u00eda<small>.ttf \u00b7 .otf</small></div>';
  document.body.appendChild(dropOverlay);

  let dragDepth = 0;
  const hasFiles = e => e.dataTransfer && Array.from(e.dataTransfer.types || []).includes('Files');

  window.addEventListener('dragenter', e => {
    if (!hasFiles(e)) return;
    e.preventDefault();
    if (++dragDepth === 1) dropOverlay.classList.add('active');
  });
  window.addEventListener('dragover', e => { if (hasFiles(e)) e.preventDefault(); });
  window.addEventListener('dragleave', e => {
    if (!hasFiles(e)) return;
    if (--dragDepth <= 0) { dragDepth = 0; dropOverlay.classList.remove('active'); }
  });
  window.addEventListener('drop', async e => {
    if (!hasFiles(e)) return;
    e.preventDefault();
    dragDepth = 0;
    dropOverlay.classList.remove('active');
    const tipografias = Array.from(e.dataTransfer.files).filter(f => /\.(ttf|otf)$/i.test(f.name));
    if (tipografias.length) await handleFontFiles(tipografias);
  });

  // ---------- print mode ----------
  const modeListEl = $('mode-list');
  modeListEl.querySelectorAll('.mode-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      state.printMode = btn.dataset.mode;
      syncModeUI();
    });
  });
  $('in-layerHeight').addEventListener('change', e => {
    state.layerHeight = parseFloat(e.target.value);
    updatePrintInfo();
  });

  function syncModeUI() {
    modeListEl.querySelectorAll('.mode-opt').forEach(b =>
      b.classList.toggle('selected', b.dataset.mode === state.printMode));
    $('swap-extra').style.display = state.printMode === 'swap' ? 'block' : 'none';
    $('btn-zip').hidden = state.printMode !== 'multi';
    $('btn-3mf').textContent = state.printMode === 'multi' ? '⬇️ 3MF multicolor' : '⬇️ Descargar 3MF';
    updatePrintInfo();
  }

  function updatePrintInfo() {
    const box = $('print-info');
    const z = lastBaseZ;
    // El perfil calibrado viaja en el 3MF en LOS TRES modos, no solo en multi:
    // antes la nota solo salia en multicolor y parecia que los otros no lo usaban.
    const pencilNote = state.productType === 'pencil'
      ? '<br><small><b>Perfil de calidad para lápiz:</b> 0.16 mm, tres paredes, relleno ligero al 10 % con techo reforzado de 6 capas (sin hoyuelos), túnel sin soportes y superficies superiores planchadas.</small>'
      : '';
    if (state.printMode === 'simple') {
      box.className = 'info-box';
      box.innerHTML = 'Se imprime tal cual, de un color. Los colores de arriba solo sirven para verlo en pantalla.' + pencilNote;
    } else if (state.printMode === 'swap') {
      /* El laminador sólo corta en frontera de capa: con un grosor que no es
         múltiplo de la altura de capa, el cambio SUBE a la siguiente frontera.
         Antes esto se calculaba con floor y el aviso mandaba a cambiar el rollo
         una capa antes, dejando una capa entera del color de arriba sobre la
         base. Ver colourChangeLayer en exportadores.js. */
      const cambio = colourChangeLayer(z, state.layerHeight);
      const desalineado = !cambio.aligned
        ? '<br><small>⚠️ Tu grosor es <b>' + z.toFixed(2) + ' mm</b>, pero el laminador sólo corta en frontera de capa y sube el cambio a ' +
          cambio.z.toFixed(2) + ' mm. Para que coincidan exacto, usa un grosor múltiplo de ' + state.layerHeight.toFixed(2) + ' mm.</small>'
        : '';
      box.className = 'info-box highlight';
      box.innerHTML =
        'Pon el <b>cambio de color a ' + cambio.z.toFixed(2) + ' mm</b> de altura: ' +
        'la <b>capa ' + cambio.firstTopLayer + '</b> es la primera del color de arriba, con capas de ' +
        state.layerHeight.toFixed(2) + ' mm.<br>' +
        '<small>La altura en mm es lo exacto. El número de capa supone que la primera mide igual que las demás; si tu laminador usa una primera capa más gruesa, guíate por los milímetros.</small>' +
        desalineado +
        (state.rainbow ? '<br><small>⚠️ Con un color por nombre no puedes usar este modo: solo hay una pausa para todos. Usa multicolor.</small>' : '') +
        pencilNote;
    } else {
      const n = lastLayoutPieces.length
        ? buildGroups().length
        : (state.rainbow ? lastValidNames.length + 1 : 2);
      box.className = 'info-box highlight';
      /* Los extrusores se asignan con (i % 16) + 1: pasando de 16 piezas dos
         colores distintos caen en la misma ranura sin avisar. Y en la practica el
         limite util es mucho menor (una A1 con AMS Lite tiene 4). */
      const aviso = n > MAX_FILAMENT_SLOTS
        ? '<br><small>⚠️ Son <b>' + n + ' colores</b> y Bambu admite ' + MAX_FILAMENT_SLOTS +
          ' ranuras: a partir de la ' + MAX_FILAMENT_SLOTS + ' se repiten y dos nombres saldrían del mismo color. ' +
          'Quita nombres o desactiva “un color distinto para cada nombre”.</small>'
        : (n > 4
          ? '<br><small>Son ' + n + ' colores. Una A1 con AMS Lite tiene 4 ranuras: comprueba que tu equipo admita tantos filamentos.</small>'
          : '');
      box.innerHTML =
        'El 3MF sale como <b>proyecto de Bambu Studio</b> con <b>' + n + ' piezas</b>, cada una ya asignada a un filamento (1, 2, 3…): solo eliges qué color va en cada ranura.<br>' +
        '<small>Todo va como un único objeto, así que el texto no se puede desalinear de la base. Para otros laminadores (Cura, Prusa), usa el ZIP: trae un STL por color.</small>' +
        aviso + pencilNote;
    }
  }

  // ---------- volver al valor de fábrica, control por control ----------
  /* La flechita ↺ estilo Bambu: aparece junto al control SOLO cuando su valor
     difiere del de fábrica, y al tocarla regresa ese control (no todo). El
     botón se inyecta por JS para no tocar el marcado del portable. */
  const resetIcons = [];
  function addResetIcon(anchorEl, keys) {
    if (!anchorEl) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'reset-def';
    btn.textContent = '↺';
    btn.title = 'Volver al valor original';
    btn.setAttribute('aria-label', 'Volver al valor original de este control');
    btn.addEventListener('click', ev => {
      // Dentro de un <label>, el clic también activaría el control envuelto.
      ev.preventDefault();
      ev.stopPropagation();
      keys.forEach(k => {
        state[k] = Array.isArray(DEFAULT_STATE[k]) ? DEFAULT_STATE[k].slice() : DEFAULT_STATE[k];
      });
      refreshAllControls();
      applyColours();
      syncResetIcons();
      scheduleRebuild();
    });
    const val = anchorEl.querySelector('.val');
    if (val) anchorEl.insertBefore(btn, val);
    else anchorEl.appendChild(btn);
    resetIcons.push({btn, keys});
  }
  function syncResetIcons() {
    resetIcons.forEach(({btn, keys}) => {
      const changed = keys.some(k => JSON.stringify(state[k]) !== JSON.stringify(DEFAULT_STATE[k]));
      btn.classList.toggle('show', changed);
    });
  }

  // Controles que no pasan por bindSlider (los deslizadores se registran solos):
  if (pencilCapListEl) addResetIcon(pencilCapListEl.previousElementSibling, ['pencilCapEnd']);
  if (pencilTunnelListEl) addResetIcon(pencilTunnelListEl.previousElementSibling, ['pencilTunnelStyle']);
  addResetIcon($('in-rainbow').closest('label'), ['rainbow']);
  addResetIcon($('in-fixedHeight').closest('label'), ['fixedHeight', 'targetHeight']);
  if ($('in-showPencilGhost')) addResetIcon($('in-showPencilGhost').closest('label'), ['showPencilGhost']);
  addResetIcon($('in-baseColor').closest('label'), ['baseColor']);
  addResetIcon($('in-textColor').closest('label'), ['textColor']);
  addResetIcon($('in-bordeColor').closest('label'), ['bordeColor']);
  addResetIcon($('btn-col-minus').parentElement.previousElementSibling, ['columns']);

  // ---------- sliders ----------
  function bindSlider(inputId, valId, key, fmt, after) {
    const input = $(inputId);
    input.value = state[key];
    $(valId).textContent = fmt(state[key]);
    addResetIcon(input.previousElementSibling, [key]);
    input.addEventListener('input', () => {
      state[key] = parseFloat(input.value);
      $(valId).textContent = fmt(state[key]);
      if (after) after();
      scheduleRebuild();
    });
  }
  bindSlider('in-letterHeight', 'val-letterHeight', 'letterHeight', v => v.toFixed(1) + ' mm', updatePencilHint);
  bindSlider('in-textBold', 'val-textBold', 'textBold', v => (v > 0 ? '+' : '') + v.toFixed(1) + ' mm');
  bindSlider('in-baseThickness', 'val-baseThickness', 'baseThickness', v => v.toFixed(1) + ' mm', updatePrintInfo);
  bindSlider('in-raisedHeight', 'val-raisedHeight', 'raisedHeight', v => v.toFixed(1) + ' mm');
  bindSlider('in-padding', 'val-padding', 'padding', v => v.toFixed(1) + ' mm');
  bindSlider('in-corner', 'val-corner', 'corner', v => v.toFixed(1) + ' mm');
  bindSlider('in-holeD', 'val-holeD', 'holeD', v => v.toFixed(1) + ' mm');
  bindSlider('in-pencilHoleD', 'val-pencilHoleD', 'pencilHoleD', v => v.toFixed(1) + ' mm',
    () => { syncPencilPresets(); updatePencilHint(); });
  bindSlider('in-pencilWall', 'val-pencilWall', 'pencilWall', v => v.toFixed(1) + ' mm', updatePencilHint);
  const ghostChk = $('in-showPencilGhost');
  if (ghostChk) {
    ghostChk.addEventListener('change', () => {
      state.showPencilGhost = ghostChk.checked;
      scheduleRebuild();
    });
  }
  bindSlider('in-gap', 'val-gap', 'gap', v => v.toFixed(0) + ' mm');
  bindSlider('in-outlineWidth', 'val-outlineWidth', 'outlineWidth', v => v.toFixed(1) + ' mm');

  // ---------- fixed keychain height (Y) ----------
  const fixedHeightChk = $('in-fixedHeight');
  const targetHeightInput = $('in-targetHeight');
  function syncFixedHeightUI() {
    fixedHeightChk.checked = state.fixedHeight;
    targetHeightInput.value = state.targetHeight;
    targetHeightInput.disabled = !state.fixedHeight;
    $('fixed-h-note').hidden = state.productType === 'pencil' || !state.fixedHeight;
  }
  fixedHeightChk.addEventListener('change', () => {
    state.fixedHeight = fixedHeightChk.checked;
    syncFixedHeightUI();
    renderNameRows();   // show/hide the per-name height boxes
    scheduleRebuild();
  });
  targetHeightInput.addEventListener('input', () => {
    const v = parseFloat(targetHeightInput.value);
    if (v > 0) { state.targetHeight = v; renderNameRows(); scheduleRebuild(); }
  });
  syncFixedHeightUI();

  $('val-columns').textContent = state.columns;
  $('btn-col-minus').addEventListener('click', () => {
    state.columns = Math.max(1, state.columns - 1);
    $('val-columns').textContent = state.columns;
    scheduleRebuild();
  });
  $('btn-col-plus').addEventListener('click', () => {
    state.columns = Math.min(6, state.columns + 1);
    $('val-columns').textContent = state.columns;
    scheduleRebuild();
  });

  // ---------- three.js ----------
  const canvasHolder = $('canvas-holder');
  const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
  renderer.setClearAlpha(0);
  canvasHolder.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 5000);
  // Bright, studio-like setup so on-screen colours read close to the picked
  // hex values (slicer-style flat look), instead of the muddy default.
  scene.add(new THREE.AmbientLight(0xffffff, 1.1));
  const hemi = new THREE.HemisphereLight(0xffffff, 0xd8d8e0, 0.55);
  scene.add(hemi);
  const dir1 = new THREE.DirectionalLight(0xffffff, 1.25);
  dir1.position.set(60, 120, 140);
  scene.add(dir1);
  const dir2 = new THREE.DirectionalLight(0xffffff, 0.45);
  dir2.position.set(-80, -40, 60);
  scene.add(dir2);

  const group = new THREE.Group();
  scene.add(group);

  const baseMaterial = new THREE.MeshStandardMaterial({roughness: 0.55, metalness: 0});
  const bordeMaterial = new THREE.MeshStandardMaterial({roughness: 0.5, metalness: 0});
  const textMaterialSolid = new THREE.MeshStandardMaterial({roughness: 0.4, metalness: 0});
  // one material per name index, coloured on demand from state.nameColors
  const nameMaterials = [];
  function nameMaterialFor(i) {
    if (!nameMaterials[i]) {
      nameMaterials[i] = new THREE.MeshStandardMaterial({roughness: 0.4, metalness: 0});
    }
    nameMaterials[i].color.set(nameColor(i));
    return nameMaterials[i];
  }

  function applyColours() {
    // Los colores no reconstruyen geometría, así que no pasan por
    // scheduleRebuild: sus flechitas de reset se refrescan aquí.
    syncResetIcons();
    baseMaterial.color.set(state.baseColor);
    bordeMaterial.color.set(state.bordeColor);
    textMaterialSolid.color.set(state.textColor);
    group.traverse(m => {
      if (!m.isMesh) return;
      if (m.userData.part === 'borde') m.material = bordeMaterial;
      if (m.userData.part === 'text') {
        m.material = state.rainbow
          ? nameMaterialFor(lastValidOrig[m.userData.tileIndex] ?? m.userData.tileIndex)
          : textMaterialSolid;
      }
    });
  }

  /* Lápiz de ejemplo del modo lápiz. Materiales compartidos, nunca disposed.
     depthTest activo: el tramo que va dentro del túnel queda oculto por la
     pieza, como un lápiz real; solo se ve lo que asoma por los extremos.
     (La primera versión usaba rayos-X con depthTest:false y el lápiz se
     dibujaba ENCIMA de la pieza desde cualquier ángulo: confundía en vez de
     explicar.) */
  const ghostBodyMaterial = new THREE.MeshStandardMaterial({
    color: 0xf6b73c, transparent: true, opacity: 0.6, depthWrite: false, roughness: 0.6, metalness: 0});
  const ghostWoodMaterial = new THREE.MeshStandardMaterial({
    color: 0xe9d0a8, transparent: true, opacity: 0.6, depthWrite: false, roughness: 0.6, metalness: 0});
  const ghostLeadMaterial = new THREE.MeshStandardMaterial({
    color: 0x3c3c3c, transparent: true, opacity: 0.7, depthWrite: false, roughness: 0.6, metalness: 0});

  /** Un lápiz hexagonal semitransparente atravesando el túnel de cada pieza:
   *  entra por el lado abierto y su punta se detiene en la tapa si la hay.
   *  userData.part 'ghost' lo excluye de exports y colores; owned:true deja
   *  que el propio rebuild libere sus geometrías en la siguiente pasada. */
  function addGhostPencils(tiles, offsets) {
    if (!state.showPencilGhost) return;
    tiles.forEach((tile, i) => {
      const info = tile.pencil;
      if (!info || !offsets[i]) return;
      const r = Math.max(1.6, info.innerR - 0.15);
      const tipLen = 4, coneLen = 14;
      // dirSign: sentido hacia el que apunta la MINA (−X salvo tapa al final).
      const dirSign = info.capEnd === 'end' ? 1 : -1;
      const tipX = info.capEnd === 'start' ? info.xStart + 0.6
        : info.capEnd === 'end' ? info.xEnd - 0.6
        : info.xStart - 8;
      // Con varias columnas el mango sobresale menos para no pisar al vecino.
      const protrude = state.columns > 1 ? 14 : 22;
      const backX = dirSign === -1 ? info.xEnd + protrude : info.xStart - protrude;
      const leadEnd = tipX - dirSign * tipLen;
      const woodEnd = leadEnd - dirSign * coneLen;
      const bodyLen = Math.abs(backX - woodEnd);
      if (bodyLen < 1) return;
      const y = offsets[i].y + info.axisY;
      const z = info.centerZ;
      const rot = dirSign === -1 ? Math.PI / 2 : -Math.PI / 2; // eje Y -> eje X

      const mk = (geo, material, cx) => {
        geo.rotateZ(rot);
        const mesh = new THREE.Mesh(geo, material);
        mesh.position.set(offsets[i].x + cx, y, z);
        mesh.renderOrder = 10;
        mesh.userData = {part: 'ghost', tileIndex: i, owned: true};
        group.add(mesh);
      };
      mk(new THREE.ConeGeometry(1.1, tipLen, 12), ghostLeadMaterial, tipX - dirSign * tipLen / 2);
      mk(new THREE.CylinderGeometry(1.1, r, coneLen, 6, 1, false, Math.PI / 6), ghostWoodMaterial,
        leadEnd - dirSign * coneLen / 2);
      mk(new THREE.CylinderGeometry(r, r, bodyLen, 6, 1, false, Math.PI / 6), ghostBodyMaterial,
        (woodEnd + backX) / 2);
    });
  }

  const orbit = {theta: Math.PI * 0.28, phi: Math.PI * 0.34, radius: 200, target: new THREE.Vector3()};
  let dragging = false, lastX = 0, lastY = 0;
  const dom = renderer.domElement;
  dom.addEventListener('pointerdown', e => {
    dragging = true; lastX = e.clientX; lastY = e.clientY;
    dom.setPointerCapture(e.pointerId);
  });
  dom.addEventListener('pointerup', () => { dragging = false; });
  dom.addEventListener('pointermove', e => {
    if (!dragging) return;
    orbit.theta -= (e.clientX - lastX) * 0.01;
    orbit.phi = Math.min(Math.PI - 0.05, Math.max(0.05, orbit.phi - (e.clientY - lastY) * 0.01));
    lastX = e.clientX; lastY = e.clientY;
    updateCamera();
  });
  dom.addEventListener('wheel', e => {
    e.preventDefault();
    orbit.radius = Math.max(20, Math.min(3000, orbit.radius * Math.pow(1.0015, e.deltaY)));
    updateCamera();
  }, {passive: false});

  function updateCamera() {
    const {theta, phi, radius, target} = orbit;
    camera.position.set(
      target.x + radius * Math.sin(phi) * Math.sin(theta),
      target.y + radius * Math.cos(phi),
      target.z + radius * Math.sin(phi) * Math.cos(theta));
    camera.lookAt(target);
  }

  function resizeRenderer() {
    const w = canvasHolder.clientWidth, h = canvasHolder.clientHeight;
    renderer.setSize(w, h, false);
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    camera.aspect = w / Math.max(1, h);
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resizeRenderer).observe(canvasHolder);
  resizeRenderer();

  (function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  })();

  // ---------- rebuild ----------
  let rebuildTimer = null;
  function scheduleRebuild() {
    // Todos los controles desembocan aquí: es el punto único donde refrescar
    // las flechitas de "volver al valor original".
    syncResetIcons();
    clearTimeout(rebuildTimer);
    rebuildTimer = setTimeout(rebuild, 200);
  }

  /* Construir la geometría de un llavero cuesta decenas de ms; con 24 nombres
     seguidos el hilo principal se quedaba bloqueado más de un segundo y la
     ventana parecía colgada. Cedemos el hilo entre piezas para que el navegador
     pueda repintar, y numeramos cada pasada para abortar la anterior si el
     usuario sigue escribiendo. */
  let rebuildRun = 0;
  const yieldToBrowser = () => new Promise(r => setTimeout(r, 0));

  const busyEl = $('busy');
  const busyTextEl = $('busy-text');
  let busyTimer = null;
  function showBusy(text) {
    busyTextEl.textContent = text;
    // El retardo se programa UNA vez por reconstrucción: si se reiniciara en
    // cada pieza nunca vencería y el indicador no llegaría a aparecer nunca.
    if (!busyEl.hidden || busyTimer) return;
    busyTimer = setTimeout(() => { busyEl.hidden = false; busyTimer = null; }, 220);
  }
  function hideBusy() {
    clearTimeout(busyTimer);
    busyTimer = null;
    busyEl.hidden = true;
  }

  /** Avisa cuando la placa no cabe en la cama elegida. No bloquea la descarga:
   *  el archivo puede seguir siendo útil (imprimir por tandas, otra máquina). */
  function updateBedWarning(widthMM, heightMM) {
    const box = $('bed-warn');
    const p = PRINTERS.find(x => x.id === state.printer);
    if (!p || !p.w || !(widthMM > 0)) { box.hidden = true; return; }
    const cabeDerecha = widthMM <= p.w && heightMM <= p.h;
    // Antes solo se probaba la orientacion tal cual: en una cama no cuadrada
    // (Prusa 250x210) una placa de 200x240 se marcaba como que no cabe, cuando
    // cabe perfectamente girandola 90 grados en el laminador.
    const cabeGirada = heightMM <= p.w && widthMM <= p.h;
    if (cabeDerecha) { box.hidden = true; return; }
    box.hidden = false;
    if (cabeGirada) {
      box.innerHTML =
        '↻ La placa mide <b>' + widthMM.toFixed(0) + '×' + heightMM.toFixed(0) +
        ' mm</b> y tu <b>' + escapeHtml(p.label) + '</b> admite ' + p.w + '×' + p.h + ' mm: ' +
        'cabe, pero <b>girándola 90°</b> en el laminador.' +
        '<small>En Bambu Studio o Cura, rota la placa 90° sobre la cama antes de imprimir.</small>';
      return;
    }
    box.innerHTML =
      '⚠️ No cabe en tu <b>' + escapeHtml(p.label) + '</b>: la placa mide <b>' +
      widthMM.toFixed(0) + '×' + heightMM.toFixed(0) + ' mm</b> y la cama admite ' +
      p.w + '×' + p.h + ' mm.' +
      '<small>Quita algún nombre, baja el <b>tamaño de las letras</b> o cambia el número de <b>columnas</b> para que quede más compacta.</small>';
  }

  function currentOpts() {
    return {
      letterHeightMM: state.letterHeight,
      textBoldMM: state.textBold,
      baseThicknessMM: state.baseThickness,
      textRaisedHeightMM: state.raisedHeight,
      basePaddingMM: state.padding,
      cornerRadiusMM: state.corner,
      loopHoleDiameterMM: state.holeD,
      loopRingThicknessMM: state.ringThickness,
      pencilHoleDiameterMM: state.pencilHoleD,
      pencilWallMM: state.pencilWall,
      pencilCapEnd: state.pencilCapEnd,
      pencilTunnelStyle: state.pencilTunnelStyle,
      curveSegments: state.curveSegments,
      outlineWidthMM: state.outlineWidth,
    };
  }

  // The target Y height (mm) for the keychain of name row `orig`: its own
  // override if set, else the general one, or null when fixed height is off.
  function targetHeightFor(orig) {
    if (!state.fixedHeight) return null;
    const per = parseFloat(state.nameHeights[orig]);
    return (per > 0) ? per : state.targetHeight;
  }

  // Scale a built tile in X/Y (never Z, so thickness stays as set) until its
  // footprint is exactly `target` mm tall. Keeps proportions, so letters and
  // the eyelet grow together and nothing is distorted.
  function applyTargetHeight(tile, orig) {
    if (state.productType === 'pencil') return;
    const target = targetHeightFor(orig);
    if (!(target > 0) || !(tile.height > 0)) return;
    const f = target / tile.height;
    if (Math.abs(f - 1) < 1e-6) return;
    tile.pieces.forEach(p => p.geometry.scale(f, f, 1));
    tile.width *= f;
    tile.height = target;
  }

  async function rebuild() {
    const run = ++rebuildRun;
    const cancelled = () => run !== rebuildRun;

    // Only dispose geometry this function created. Imported models own their
    // source geometry and must survive rebuilds; we clone them each time.
    group.children.forEach(m => { if (m.userData.owned && m.geometry) m.geometry.dispose(); });
    group.clear();
    lastLayoutPieces = [];
    let pencilLayout = null; // {tiles, offsets} solo en modo lápiz, para fantasma y gramos

    const validEntries = state.names
      .map((n, i) => ({name: n.trim(), orig: i}))
      .filter(e => e.name);
    const validNames = validEntries.map(e => e.name);
    lastValidNames = validNames;
    lastValidOrig = validEntries.map(e => e.orig);
    const font = state.fontKey && fonts[state.fontKey] ? fonts[state.fontKey].otFont : null;

    let bedH = 0;
    let plateLabel = '';

    if (validNames.length && font) {
      const tiles = [];
      /* Antes un solo nombre problematico tiraba la placa entera: el try envolvia
         todo el bucle. Ahora cada fila se aisla, las validas se conservan y se
         informa exactamente cual falla y que caracteres faltan. */
      const builtEntries = [];
      const failedNames = [];
      const missingChars = [];
      const addMissing = list => (list || []).forEach(ch => {
        if (missingChars.indexOf(ch) === -1) missingChars.push(ch);
      });

      for (let i = 0; i < validEntries.length; i++) {
        const e = validEntries[i];
        const lines = [{text: state.productType === 'pencil' ? e.name.toLocaleUpperCase('es-MX') : e.name}];
        let tile;
        try {
          if (state.productType === 'pencil') tile = buildPencilNameTile(font, emojiFont, lines, currentOpts());
          else if (state.style === 'outline') tile = buildOutlineTile(font, emojiFont, lines, currentOpts());
          else if (state.style === 'double') tile = buildDoubleOutlineTile(font, emojiFont, lines, currentOpts());
          else tile = buildKeychainTile(font, emojiFont, lines, currentOpts());
          applyTargetHeight(tile, e.orig);
        } catch (err) {
          console.error(err);
          failedNames.push(e.name);
          addMissing(err.missingChars);
          continue;
        }
        addMissing(tile.missingChars);
        tiles.push(tile);
        builtEntries.push(e);
        // A partir de 3 nombres respiramos entre piezas y damos progreso.
        if (validEntries.length > 2) {
          showBusy('Creando llavero ' + (i + 1) + ' de ' + validEntries.length + '…');
          await yieldToBrowser();
          if (cancelled()) return;   // el usuario siguió escribiendo: esta pasada sobra
        }
      }

      updateTextWarning(failedNames, missingChars);

      if (!tiles.length) {
        hideBusy();
        hud.textContent = 'No se pudo generar el modelo con ese texto.';
        setDownloadEnabled(false);
        updateIslandsWarning(1);
        updateBedWarning(0, 0);
        if (emptyHint) emptyHint.style.display = '';
        return;
      }

      // Las listas de nombres deben reflejar solo las piezas realmente creadas,
      // porque de ellas salen los nombres de archivo y los grupos de color.
      lastValidNames = builtEntries.map(e => e.name);
      lastValidOrig = builtEntries.map(e => e.orig);
      lastBaseZ = state.productType === 'pencil'
        ? Math.max(...tiles.map(t => t.baseThickness || state.baseThickness))
        : state.baseThickness;

      updateIslandsWarning(Math.max(1, ...tiles.map(t => t.islands || 1)));
      const layout = layoutTiles(tiles, {columns: state.columns, gapXMM: state.gap, gapYMM: state.gap * 1.3});
      layout.pieces.forEach(piece => {
        const mesh = new THREE.Mesh(piece.geometry, baseMaterial);
        mesh.userData = {part: piece.part, tileIndex: piece.tileIndex, owned: true};
        group.add(mesh);
        lastLayoutPieces.push(piece);
      });
      bedH = layout.bedHeight;
      if (state.productType === 'pencil') pencilLayout = {tiles, offsets: layout.offsets};
      // Sin medidas aquí: la huella de verdad se mide al final sobre la escena
      // completa, y así el HUD y el aviso de cama no dan dos cifras distintas.
      // El recuento debe ser el de piezas realmente construidas, no el de nombres
      // escritos: con una fila descartada el HUD anunciaba una pieza de mas.
      plateLabel = tiles.length + (state.productType === 'pencil'
        ? ' nombre' + (tiles.length > 1 ? 's' : '') + ' para lápiz'
        : ' llavero' + (tiles.length > 1 ? 's' : ''));
    }

    if (!lastLayoutPieces.length) {
      hideBusy();
      emptyHint.style.display = 'flex';
      hud.textContent = '';
      setDownloadEnabled(false);
      updateBedWarning(0, 0);
      updatePrintInfo();
      updateWhatsAppCta();
      return;
    }
    emptyHint.style.display = 'none';
    applyColours();

    // Measure from a neutral position: setFromObject includes group.position,
    // so leaving last rebuild's offset in place would compound it every time.
    group.position.set(0, 0, 0);
    const box = new THREE.Box3().setFromObject(group);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    group.position.set(-center.x, -center.y, 0);

    // Frame the content: fit the larger of width/height into the vertical FOV,
    // accounting for the viewport aspect so wide plates are not cropped.
    orbit.target.set(0, 0, size.z / 2);
    const vFov = THREE.MathUtils.degToRad(camera.fov);
    const fitH = (size.y / 2) / Math.tan(vFov / 2);
    const fitW = (size.x / 2) / Math.tan(vFov / 2) / Math.max(0.35, camera.aspect);
    orbit.radius = Math.max(50, Math.max(fitH, fitW) * 1.55 + size.z * 2);
    updateCamera();

    // El fantasma entra DESPUÉS de medir y encuadrar: no altera Box3 ni HUD
    // (no se imprime), pero hereda el recentrado del grupo.
    if (pencilLayout) addGhostPencils(pencilLayout.tiles, pencilLayout.offsets);

    let hudText = plateLabel +
      ' · ' + size.x.toFixed(0) + '×' + size.y.toFixed(0) + ' mm';
    if (pencilLayout) {
      // Densidad del perfil real si ya cargó; PLA genérico si no.
      const dens = parseFloat(((window.__BAMBU_PROJECT__ || {}).filament_density || [])[0]) || 1.24;
      const grams = pencilLayout.tiles.reduce((s, t) => s + (t.volumeMM3 || 0), 0) / 1000 * dens;
      if (grams > 0) hudText += ' · ≈ ' + grams.toFixed(1) + ' g';
    }
    hud.textContent = hudText;
    setDownloadEnabled(true);
    updateBedWarning(size.x, size.y);
    updatePrintInfo();
    updateWhatsAppCta();
    hideBusy();
  }

  function setDownloadEnabled(on) {
    $('btn-stl').disabled = !on;
    $('btn-3mf').disabled = !on;
    $('btn-zip').disabled = !on;
    updateFitTestButton();
  }

  /** La prueba de ajuste no depende de que haya nombres escritos: solo de
   *  estar en modo lápiz y de no haber otra exportación en curso. */
  function updateFitTestButton() {
    const fit = $('btn-fit-test');
    if (!fit) return;
    fit.disabled = exporting || state.productType !== 'pencil';
  }

  /** El CTA de WhatsApp lleva puesto el diseño actual: producto, nombres y
   *  medida del túnel. El href estático del HTML queda como respaldo. */
  function updateWhatsAppCta() {
    const a = $('btn-whatsapp');
    if (!a) return;
    const n = lastValidNames.length;
    const names = lastValidNames.slice(0, 6).join(', ') + (n > 6 ? '…' : '');
    let msg;
    if (state.productType === 'pencil') {
      msg = 'Hola, diseñé ' + (n || 'unos') + ' nombre' + (n === 1 ? '' : 's') + ' para lápiz' +
        (n ? ' (' + names + ')' : '') + ' con túnel de ' + state.pencilHoleD.toFixed(1) +
        ' mm en el generador de Lithora 3D y quiero cotizar la impresión.';
    } else {
      msg = 'Hola, diseñé ' + (n || 'unos') + ' llavero' + (n === 1 ? '' : 's') +
        (n ? ' (' + names + ')' : '') + ' en el Creador de Llaveros y quiero cotizar la impresión.';
    }
    a.href = 'https://wa.me/528331080178?text=' + encodeURIComponent(msg);
  }

  /** Split the built pieces into one printable group per colour. */
  function buildGroups() {
    const basePieces = lastLayoutPieces.filter(p => p.part === 'base');
    const textPieces = lastLayoutPieces.filter(p => p.part === 'text');
    const groups = [];

    if (basePieces.length) {
      groups.push({label: 'fondo', color: state.baseColor, geometries: basePieces.map(p => p.geometry)});
    }
    if (textPieces.length) {
      if (state.rainbow) {
        textPieces.forEach(p => groups.push({
          label: 'texto-' + (lastValidNames[p.tileIndex] || ('n' + p.tileIndex)),
          color: nameColor(lastValidOrig[p.tileIndex] ?? p.tileIndex),
          geometries: [p.geometry],
        }));
      } else {
        groups.push({label: 'texto', color: state.textColor, geometries: textPieces.map(p => p.geometry)});
      }
    }
    const bordePieces = lastLayoutPieces.filter(p => p.part === 'borde');
    if (bordePieces.length) {
      groups.push({label: 'borde', color: state.bordeColor, geometries: bordePieces.map(p => p.geometry)});
    }
    return groups;
  }

  // ---------- downloads ----------
  /* Nombre base del archivo. Cuando la placa lleva UN solo nombre, el archivo
     sale llamado como ese nombre: descargando de uno en uno, "mia.3mf" es lo
     que se busca luego en la carpeta de descargas, no seis "llaveros (3).3mf".
     Con varios nombres se mantiene el genérico porque ninguno manda. El lápiz
     conserva su sufijo para que el mismo nombre en los dos productos no colisione. */
  function downloadBaseName() {
    const solo = lastValidNames.length === 1 ? safeFileName(lastValidNames[0]) : '';
    if (state.productType === 'pencil') return solo ? solo + '-lapiz' : 'nombres-para-lapiz';
    return solo || 'llaveros';
  }

  function downloadBlob(bytes, filename, mime) {
    const blob = new Blob([bytes], {type: mime});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  /* Los exportadores corren en el hilo principal: con 24 nombres son varios
     segundos de congelacion. Sin bloqueo, un doble clic lanzaba dos exportaciones
     completas y dos descargas. Se reutiliza el mismo showBusy/setDownloadEnabled
     que ya protege la reconstruccion. */
  let exporting = false;
  async function runExport(label, produce, requirePieces = true) {
    if (exporting || (requirePieces && !lastLayoutPieces.length)) return;
    exporting = true;
    setDownloadEnabled(false);
    showBusy(label);
    await yieldToBrowser();          // deja pintar el indicador antes de bloquear
    try {
      const out = produce();
      downloadBlob(out.bytes, out.filename, out.mime);
    } catch (err) {
      console.error(err);
      hud.textContent = 'No se pudo preparar el archivo para descargar.';
    } finally {
      hideBusy();
      exporting = false;
      setDownloadEnabled(!!lastLayoutPieces.length);
    }
  }

  $('btn-stl').addEventListener('click', () => runExport('Preparando STL…', () => ({
    bytes: buildBinarySTL(lastLayoutPieces.map(p => p.geometry)),
    filename: downloadBaseName() + '.stl', mime: 'model/stl',
  })));
  $('btn-3mf').addEventListener('click', () => runExport('Preparando 3MF…', () => {
    // Multicolour and every pencil-name export use Bambu Studio's project
    // flavour so the calibrated process arrives with the geometry. In simple
    // and manual-change pencil modes all shells are deliberately merged into
    // one filament slot; in AMS mode the normal colour grouping is preserved.
    const regularGroups = buildGroups();
    const pencilGroups = state.printMode === 'multi' ? regularGroups : [{
      label: 'Nombre para lapiz',
      color: state.baseColor,
      geometries: lastLayoutPieces.map(p => p.geometry),
    }];
    const useBambuProject = state.printMode === 'multi' || state.productType === 'pencil';
    return {
      bytes: useBambuProject
        ? buildBambu3MF(state.productType === 'pencil' ? pencilGroups : regularGroups,
          window.__BAMBU_PROJECT__, {productType: state.productType})
        : build3MF(regularGroups),
      filename: downloadBaseName() + '.3mf',
      mime: 'model/3mf',
    };
  }));
  $('btn-zip').addEventListener('click', () => runExport('Preparando ZIP…', () => ({
    bytes: buildSTLZip(buildGroups()),
    filename: downloadBaseName() + '-por-colores.zip', mime: 'application/zip',
  })));
  const fitTestBtn = $('btn-fit-test');
  if (fitTestBtn) {
    fitTestBtn.addEventListener('click', () => runExport('Preparando prueba de ajuste…', () => {
      // Testigo independiente del modelo principal: no toca lastLayoutPieces.
      const font = state.fontKey && fonts[state.fontKey] ? fonts[state.fontKey].otFont : null;
      const tile = buildPencilFitTestTile(font, currentOpts());
      return {
        bytes: buildBambu3MF([{
          label: 'Prueba de ajuste lapiz',
          color: state.baseColor,
          geometries: tile.pieces.map(p => p.geometry),
        }], window.__BAMBU_PROJECT__, {productType: 'pencil'}),
        filename: 'prueba-de-ajuste-lapiz.3mf',
        mime: 'model/3mf',
      };
    }, false));
  }

  // ---------- impresora ----------
  const printerSel = $('in-printer');
  PRINTERS.forEach(p => {
    const o = document.createElement('option');
    o.value = p.id;
    o.textContent = p.w ? p.label + ' · ' + p.w + '×' + p.h + ' mm' : p.label;
    printerSel.appendChild(o);
  });
  printerSel.addEventListener('change', () => {
    state.printer = printerSel.value;
    scheduleRebuild();
  });

  // ---------- guardar, restaurar y deshacer ----------
  /* Todo lo que se puede describir con texto se guarda. Quedan fuera las
     imágenes trazadas, los modelos .stl/.3mf y las tipografías subidas: son
     binarios grandes que no caben en localStorage, así que al volver se avisa
     de que hay que abrirlos otra vez. */
  const SAVE_KEY = 'lithora.llaveros.v1';
  const SAVED_KEYS = [
    'productType', 'names', 'nameHeights', 'nameColors', 'fontKey', 'letterHeight', 'textBold', 'fixedHeight',
    'targetHeight', 'baseThickness', 'raisedHeight', 'padding', 'corner', 'holeD',
    'pencilHoleD', 'pencilWall', 'pencilCapEnd', 'pencilTunnelStyle', 'showPencilGhost',
    'columns', 'gap', 'style', 'outlineWidth', 'bordeColor', 'baseColor',
    'textColor', 'rainbow', 'printMode', 'layerHeight', 'printer',
  ];

  function snapshot() {
    const s = {};
    SAVED_KEYS.forEach(k => { s[k] = Array.isArray(state[k]) ? state[k].slice() : state[k]; });
    // Compat hacia atrás: una versión anterior del HTML leerá este guardado
    // buscando la casilla booleana de la tapa.
    s.pencilClosedEnd = state.pencilCapEnd !== 'open';
    return {state: s};
  }

  /* Un valor guardado con el tipo equivocado (otra version del HTML, un guardado
     truncado o editado a mano) hacia que refreshAllControls lanzara con el estado
     ya medio mutado, y el manejador del arranque volvia a llamarlo sobre ese mismo
     estado corrupto: segunda excepcion, ya fuera del try, y la app arrancaba vacia
     sin ningun mensaje. Ahora cada clave se valida contra el tipo del valor por
     defecto y lo que no encaje se descarta. */
  function sanitizeSnapshotState(raw) {
    const clean = {};
    if (!raw || typeof raw !== 'object') return clean;
    SAVED_KEYS.forEach(k => {
      const v = raw[k];
      if (v === undefined || v === null) return;
      const ref = DEFAULT_STATE[k];
      if (Array.isArray(ref)) {
        if (!Array.isArray(v)) return;
        clean[k] = v.filter(x => typeof x === 'string' || typeof x === 'number' || x === null);
        return;
      }
      if (typeof ref === 'number') {
        const n = Number(v);
        if (!isFinite(n)) return;
        clean[k] = n;
        return;
      }
      if (typeof ref === 'boolean') { clean[k] = !!v; return; }
      if (typeof ref === 'string' || ref === null) {
        if (typeof v !== 'string') return;
        clean[k] = v;
        return;
      }
      clean[k] = v;
    });
    if (Array.isArray(clean.names)) {
      clean.names = clean.names
        .map(n => (typeof n === 'string' ? n.slice(0, 20) : ''))
        .slice(0, MAX_NAMES);          // el tope no se aplicaba al restaurar
      if (!clean.names.length) delete clean.names;
    }
    return clean;
  }

  function applySnapshot(snap) {
    if (!snap || !snap.state) return;
    // Migración de guardados viejos: la tapa era una casilla booleana que
    // decía "Tapar el FINAL del túnel" — se honra esa etiqueta (→ 'end').
    // Se hace ANTES de sanear porque el saneador descartaría el boolean.
    if (snap.state.pencilCapEnd === undefined && typeof snap.state.pencilClosedEnd === 'boolean') {
      snap.state.pencilCapEnd = snap.state.pencilClosedEnd ? 'end' : 'open';
    }
    const safe = sanitizeSnapshotState(snap.state);
    SAVED_KEYS.forEach(k => {
      if (safe[k] === undefined) return;
      state[k] = Array.isArray(safe[k]) ? safe[k].slice() : safe[k];
    });
    // Una tipografía subida por el usuario no sobrevive al cierre; si la que
    // estaba elegida ya no existe, se cae a la primera disponible.
    if (!state.fontKey || !fonts[state.fontKey]) state.fontKey = Object.keys(fonts)[0] || null;
    // Una impresora que ya no existe apagaba el aviso de cama en silencio.
    if (!PRINTERS.some(p => p.id === state.printer)) state.printer = DEFAULT_STATE.printer;
    if (!['keychain', 'pencil'].includes(state.productType)) state.productType = DEFAULT_STATE.productType;
    if (!['open', 'start', 'end'].includes(state.pencilCapEnd)) state.pencilCapEnd = DEFAULT_STATE.pencilCapEnd;
    if (!['round', 'teardrop'].includes(state.pencilTunnelStyle)) state.pencilTunnelStyle = DEFAULT_STATE.pencilTunnelStyle;

    refreshAllControls();
  }

  /** Vuelca `state` en todos los controles de la interfaz de una vez. */
  function refreshAllControls() {
    [['in-letterHeight', 'letterHeight', 1], ['in-textBold', 'textBold', 1], ['in-baseThickness', 'baseThickness', 1],
     ['in-raisedHeight', 'raisedHeight', 1], ['in-padding', 'padding', 1],
     ['in-corner', 'corner', 1], ['in-holeD', 'holeD', 1],
     ['in-pencilHoleD', 'pencilHoleD', 1], ['in-pencilWall', 'pencilWall', 1], ['in-gap', 'gap', 0],
     ['in-outlineWidth', 'outlineWidth', 1]].forEach(([id, key, dec]) => {
      $(id).value = state[key];
      const val = $('val-' + key.replace(/^in-/, ''));
      if (val) val.textContent = state[key].toFixed(dec) + ' mm';
    });
    $('val-columns').textContent = state.columns;
    $('in-rainbow').checked = state.rainbow;
    syncPencilCapUI();
    $('in-layerHeight').value = String(state.layerHeight);
    $('in-bordeColor').value = state.bordeColor;
    printerSel.value = state.printer;
    syncFixedHeightUI();
    if (state.fontKey) selectFontCard(state.fontKey);
    renderNameRows();
    syncColorInputs();
    syncProductUI();
    syncStyleUI();
    syncModeUI();
    updateNameCapHint();
    syncResetIcons();
  }

  const saveStateEl = $('save-state');
  let saveFlashTimer = null;
  function flashSaved(text) {
    saveStateEl.textContent = text;
    saveStateEl.classList.add('show');
    clearTimeout(saveFlashTimer);
    saveFlashTimer = setTimeout(() => saveStateEl.classList.remove('show'), 1400);
  }

  /* Antes un fallo de guardado solo parpadeaba "Sin guardar" 1,4 s y desaparecia:
     en localStorage seguia la instantanea ANTERIOR, asi que al recargar el usuario
     recuperaba una version vieja creyendo que estaba guardada. Ahora el aviso es
     persistente hasta que un guardado vuelva a funcionar. */
  let saveFailed = false;
  function showSaveError(show) {
    const box = $('save-error');
    if (!box) return;
    box.hidden = !show;
    if (show) {
      box.innerHTML = '⚠️ <b>No se está guardando tu trabajo.</b> El navegador no admite más datos guardados. ' +
        '<small>Descarga lo que tengas ahora. Al recargar la página volverías a una versión anterior.</small>';
    }
  }

  function persist() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(snapshot()));
      flashSaved('Guardado');
      if (saveFailed) { saveFailed = false; showSaveError(false); }
    } catch (e) {
      console.warn('no se pudo guardar', e);
      flashSaved('Sin guardar');
      saveFailed = true;
      showSaveError(true);
    }
  }

  // Pila de deshacer: en vez de instrumentar cada control, comparamos el estado
  // con la última versión confirmada tras un respiro; así arrastrar un deslizador
  // deja una sola entrada y no cincuenta.
  const undoStack = [];
  let committed = null;
  let commitTimer = null;

  function updateUndoButton() { $('btn-undo').disabled = undoStack.length === 0; }

  function commit() {
    const now = JSON.stringify(snapshot());
    if (now === committed) return;
    if (committed !== null) {
      undoStack.push(committed);
      if (undoStack.length > 40) undoStack.shift();
      updateUndoButton();
    }
    committed = now;
    persist();
  }
  function scheduleCommit() {
    clearTimeout(commitTimer);
    commitTimer = setTimeout(commit, 500);
  }

  // Un único punto de escucha en fase de captura recoge cualquier cambio del
  // panel sin tener que tocar los manejadores que ya existían.
  ['input', 'change', 'click'].forEach(ev =>
    document.addEventListener(ev, e => {
      if (e.target.closest && e.target.closest('.panel-toolbar')) return;
      scheduleCommit();
    }, true));

  $('btn-undo').addEventListener('click', () => {
    const prev = undoStack.pop();
    if (!prev) return;
    clearTimeout(commitTimer);
    applySnapshot(JSON.parse(prev));
    committed = prev;
    persist();
    updateUndoButton();
    applyColours();
    scheduleRebuild();
    flashSaved('Deshecho');
  });

  /* El guardado va con un respiro de 500 ms: cerrar la pestaña dentro de esa
     ventana perdia el ultimo cambio. Se fuerza el guardado antes de salir. */
  window.addEventListener('beforeunload', () => {
    try {
      clearTimeout(commitTimer);
      if (JSON.stringify(snapshot()) !== committed) persist();
    } catch (_) {}
  });

  $('btn-reset').addEventListener('click', () => {
    if (!window.confirm('¿Borrar todo y empezar de cero?\n\nSe perderán los nombres, colores y ajustes actuales.')) return;
    undoStack.push(JSON.stringify(snapshot()));
    if (undoStack.length > 40) undoStack.shift();   // este camino se saltaba el tope
    updateUndoButton();
    applySnapshot({state: {...DEFAULT_STATE}});
    committed = JSON.stringify(snapshot());
    persist();
    applyColours();
    scheduleRebuild();
    flashSaved('Reiniciado');
  });

  function updateNameCapHint() {
    const box = $('name-cap');
    const lleno = state.names.length >= MAX_NAMES;
    box.hidden = !lleno;
    if (lleno) box.innerHTML = 'Has llegado al máximo de <b>' + MAX_NAMES +
      ' nombres</b> por placa. Borra alguno para añadir otro, o descarga esta tanda y empieza otra.';
  }

  // ---------- vista en pantallas pequeñas ----------
  const mainEl = document.querySelector('main');
  mainEl.classList.add('view-panel');
  document.querySelectorAll('.mtab').forEach(tab => {
    tab.addEventListener('click', () => {
      const vista = tab.dataset.view;
      mainEl.classList.toggle('view-panel', vista === 'panel');
      mainEl.classList.toggle('view-viewer', vista === 'viewer');
      document.querySelectorAll('.mtab').forEach(t =>
        t.classList.toggle('selected', t === tab));
      if (vista === 'viewer') requestAnimationFrame(resizeRenderer);
    });
  });

  // ---------- init ----------
  renderNameRows();
  syncColorInputs();
  syncProductUI();
  syncStyleUI();
  syncModeUI();
  $('in-layerHeight').value = String(state.layerHeight);
  printerSel.value = state.printer;
  updateCamera();
  /* Todo el arranque colgaba de esta promesa sin .catch(): si la carga de fuentes
     fallaba, no se restauraba nada, no se reconstruia nada y no se mostraba ningun
     error — la app parecia cargada pero vacia, y el primer cambio sobrescribia el
     guardado del usuario con el estado por defecto. Ahora el arranque se ejecuta
     siempre, con o sin fuentes. */
  function arrancar() {
    let restaurado = false;
    try {
      const crudo = localStorage.getItem(SAVE_KEY);
      if (crudo) { applySnapshot(JSON.parse(crudo)); restaurado = true; }
    } catch (e) {
      console.warn('no se pudo restaurar', e);
      restaurado = false;
    }
    if (!restaurado) {
      /* Si la restauracion dejo el estado a medias, se vuelve al estado por
         defecto antes de volver a tocar la interfaz: repetir refreshAllControls
         sobre un estado corrupto era la segunda excepcion que abortaba el init. */
      try {
        refreshAllControls();
      } catch (e) {
        console.error('estado guardado inservible, se arranca limpio', e);
        applySnapshot({state: {...DEFAULT_STATE}});
        try { localStorage.removeItem(SAVE_KEY); } catch (_) {}
        flashSaved('Se reinició');
      }
    }
    committed = JSON.stringify(snapshot());
    updateUndoButton();
    if (restaurado) flashSaved('Restaurado');
    /* La tipografia restaurada puede no ser la precargada: hay que traer su TTF
       antes de construir, o la primera pasada saldria sin texto. */
    const pendiente = state.fontKey && fonts[state.fontKey] && !fonts[state.fontKey].otFont
      ? asegurarFuenteCompleta(state.fontKey)
      : Promise.resolve();
    pendiente.then(() => scheduleRebuild());
  }

  loadBuiltinFonts()
    .catch(e => { console.error('no se pudieron cargar las tipografías', e); })
    .then(arrancar);
})();
