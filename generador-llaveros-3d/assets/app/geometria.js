/* Core geometry helpers: font glyph outlines -> THREE.Shape (with holes) -> extruded meshes.
   Written as plain globals (no import/export) so this file can be inlined verbatim
   into the final single-file HTML as a classic <script> tag. Assumes THREE and
   opentype are already loaded as globals. */

/** Flatten an opentype.Path into an array of closed polygons (arrays of [x,y]). */
function pathToPolygons(path, curveSegments) {
  const polygons = [];
  let current = null;
  let cx = 0, cy = 0; // pen position
  let sx = 0, sy = 0; // subpath start

  function pushPoint(x, y) {
    // opentype paths are y-down (canvas-style); flip to y-up for a standard math shape.
    current.push([x, -y]);
  }

  for (const cmd of path.commands) {
    switch (cmd.type) {
      case 'M':
        if (current && current.length > 1) polygons.push(current);
        current = [];
        cx = sx = cmd.x; cy = sy = cmd.y;
        pushPoint(cx, cy);
        break;
      case 'L':
        cx = cmd.x; cy = cmd.y;
        pushPoint(cx, cy);
        break;
      case 'C': {
        const steps = curveSegments;
        for (let i = 1; i <= steps; i++) {
          const t = i / steps;
          const mt = 1 - t;
          const x = mt * mt * mt * cx + 3 * mt * mt * t * cmd.x1 + 3 * mt * t * t * cmd.x2 + t * t * t * cmd.x;
          const y = mt * mt * mt * cy + 3 * mt * mt * t * cmd.y1 + 3 * mt * t * t * cmd.y2 + t * t * t * cmd.y;
          pushPoint(x, y);
        }
        cx = cmd.x; cy = cmd.y;
        break;
      }
      case 'Q': {
        const steps = curveSegments;
        for (let i = 1; i <= steps; i++) {
          const t = i / steps;
          const mt = 1 - t;
          const x = mt * mt * cx + 2 * mt * t * cmd.x1 + t * t * cmd.x;
          const y = mt * mt * cy + 2 * mt * t * cmd.y1 + t * t * cmd.y;
          pushPoint(x, y);
        }
        cx = cmd.x; cy = cmd.y;
        break;
      }
      case 'Z':
        cx = sx; cy = sy;
        if (current && current.length > 1) polygons.push(current);
        current = null;
        break;
    }
  }
  if (current && current.length > 1) polygons.push(current);
  return polygons;
}

function signedArea(poly) {
  let a = 0;
  for (let i = 0; i < poly.length; i++) {
    const [x1, y1] = poly[i];
    const [x2, y2] = poly[(i + 1) % poly.length];
    a += x1 * y2 - x2 * y1;
  }
  return a / 2;
}

function pointInPolygon(pt, poly) {
  let inside = false;
  const [px, py] = pt;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    const intersect = (yi > py) !== (yj > py) &&
      px < (xj - xi) * (py - yi) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Group flattened polygons into THREE.Shape objects with correct holes, using
 * greedy largest-first containment (same idea three.js's own Font class uses
 * for typeface-JSON fonts, applied directly to raw opentype outlines here).
 */
function polygonsToShapes(polygons) {
  const withArea = polygons
    .map(poly => ({poly, area: signedArea(poly)}))
    .filter(p => Math.abs(p.area) > 1e-6)
    .sort((a, b) => Math.abs(b.area) - Math.abs(a.area));

  const outers = []; // {poly, area, holes: []}

  for (const cand of withArea) {
    let parent = null;
    for (const outer of outers) {
      if (Math.sign(outer.area) !== Math.sign(cand.area) && pointInPolygon(cand.poly[0], outer.poly)) {
        if (!parent || Math.abs(outer.area) < Math.abs(parent.area)) parent = outer;
      }
    }
    if (parent) {
      parent.holes.push(cand.poly);
    } else {
      outers.push({poly: cand.poly, area: cand.area, holes: []});
    }
  }

  return outers.map(o => {
    const shape = new THREE.Shape(o.poly.map(([x, y]) => new THREE.Vector2(x, y)));
    shape.holes = o.holes.map(h => new THREE.Path(h.map(([x, y]) => new THREE.Vector2(x, y))));
    return shape;
  });
}

/**
 * Render `text` with an opentype.Font at a given font-unit size, returning
 * THREE.Shape[] (letters as filled shapes with holes) plus the overall
 * bounding box in the same units.
 */
function textToShapes(font, text, fontSize, curveSegments) {
  curveSegments = curveSegments || 6;
  const path = font.getPath(text, 0, 0, fontSize);
  const polygons = pathToPolygons(path, curveSegments);
  const shapes = polygonsToShapes(polygons);

  const bbox = path.getBoundingBox();
  return {
    shapes,
    width: bbox.x2 - bbox.x1,
    height: bbox.y2 - bbox.y1,
    minX: bbox.x1,
    minY: -bbox.y2,
  };
}

function getCapHeight(font) {
  const os2 = font.tables && font.tables.os2;
  if (os2 && os2.sCapHeight) return os2.sCapHeight;
  try {
    const path = font.getPath('H', 0, 0, font.unitsPerEm);
    const bbox = path.getBoundingBox();
    const h = bbox.y2 - bbox.y1;
    if (h > 0) return h;
  } catch (e) { /* fall through */ }
  return font.unitsPerEm * 0.7;
}

/** Rounded rectangle centered at its own local origin is NOT assumed; corners are absolute. */
function roundedRectShape(x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  const shape = new THREE.Shape();
  /* Un radio ~0 hace que quadraticCurveTo emita curvas de longitud nula: getPoints
     devuelve ~10 puntos duplicados por esquina, que earcut convierte en facetas de
     area cero y dejan aristas frontera (malla no estanca). Con radio despreciable
     se traza un rectangulo recto. */
  if (r < 1e-3) {
    shape.moveTo(x, y);
    shape.lineTo(x + width, y);
    shape.lineTo(x + width, y + height);
    shape.lineTo(x, y + height);
    shape.lineTo(x, y);
    return shape;
  }
  shape.moveTo(x + r, y);
  shape.lineTo(x + width - r, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + r);
  shape.lineTo(x + width, y + height - r);
  shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  shape.lineTo(x + r, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
  return shape;
}

/** Explicit N-gon point ring, avoiding absarc's near-duplicate seam point
 * (floating point makes angle 0 and angle 2*PI not bit-identical, which
 * triangulates into a degenerate sliver at the seam). */
function circlePoints(cx, cy, r, segments, clockwise) {
  const pts = [];
  for (let i = 0; i < segments; i++) {
    const a = (clockwise ? -1 : 1) * (i / segments) * Math.PI * 2;
    pts.push(new THREE.Vector2(cx + Math.cos(a) * r, cy + Math.sin(a) * r));
  }
  return pts;
}

/** A flat ring (annulus) shape: solid disc with a concentric circular hole. */
function ringShape(cx, cy, outerR, innerR, segments) {
  segments = segments || 48;
  const shape = new THREE.Shape(circlePoints(cx, cy, outerR, segments, false));
  const hole = new THREE.Path(circlePoints(cx, cy, innerR, segments, true));
  shape.holes.push(hole);
  return shape;
}

/**
 * Build one keychain "tile": a rounded base plate with a keyring loop on the
 * left and raised text on top. Returns an array of {geometry, group} pieces
 * (kept as separate manifold solids on purpose -- slicers fuse overlapping
 * solids at slice time, so no CSG boolean library is needed) plus the tile's
 * total footprint size for layout purposes.
 */
function buildKeychainTile(font, emojiFont, lines, opts) {
  const baseThickness = opts.baseThicknessMM;
  const raisedHeight = opts.textRaisedHeightMM;
  const padding = opts.basePaddingMM;
  const cornerRadius = opts.cornerRadiusMM;
  const loopHoleD = opts.loopHoleDiameterMM;
  const loopRingThickness = opts.loopRingThicknessMM;
  const curveSegments = opts.curveSegments || 6;

  const polys = linesToPolygons(font, emojiFont, lines, opts.letterHeightMM, curveSegments);
  if (!polys.length) {
    const err = new Error('sin texto');
    err.missingChars = polys.missing || [];
    throw err;
  }
  const b = polysBounds(polys);
  const text2 = {
    shapes: polygonsToShapes(polys),
    width: b.width, height: b.height, minX: b.minX, minY: b.minY,
  };

  const plateHeight = text2.height + padding * 2;
  const plateWidth = text2.width + padding * 2;

  const loopOuterR = plateHeight / 2;
  const loopInnerR = Math.max(0.6, loopHoleD / 2);
  const loopOverlap = Math.min(cornerRadius + 1.5, loopOuterR * 0.6);
  const loopCenterX = loopOuterR;
  const loopCenterY = plateHeight / 2;

  const plateX = loopOuterR * 2 - loopOverlap;
  const plateShape = roundedRectShape(plateX, 0, plateWidth, plateHeight, cornerRadius);

  /* El hueco del aro tiene que caber SIEMPRE dentro del radio exterior dejando
     pared. Sin suelo, (loopOuterR - loopRingThickness) baja a 0 con textos bajos
     y se vuelve negativo con placas de menos de 2*loopRingThickness: el hueco se
     generaba con radio mayor que el contorno y el solido salia auto-intersecado.
     Si ni siquiera cabe el agujero minimo, se emite el aro macizo: es preferible
     una pieza valida sin agujero a una malla rota. */
  const MIN_LOOP_HOLE_R = 0.6;
  const MIN_LOOP_WALL = 0.8;
  const maxHoleR = loopOuterR - MIN_LOOP_WALL;
  let loopHoleR = Math.min(loopInnerR, loopOuterR - loopRingThickness);
  if (loopHoleR > maxHoleR) loopHoleR = maxHoleR;
  if (loopHoleR < MIN_LOOP_HOLE_R) loopHoleR = Math.min(MIN_LOOP_HOLE_R, maxHoleR);
  const loopHoleUsable = loopHoleR > 0.05;

  const loop = loopHoleUsable
    ? ringShape(loopCenterX, loopCenterY, loopOuterR, loopHoleR)
    : new THREE.Shape(circlePoints(loopCenterX, loopCenterY, loopOuterR, 48, false));

  const baseGeo = new THREE.ExtrudeGeometry([plateShape, loop], {
    depth: baseThickness, bevelEnabled: false, curveSegments,
  });

  const textOriginX = plateX + padding - text2.minX;
  const textOriginY = (plateHeight - text2.height) / 2 - text2.minY;
  const movedTextShapes = text2.shapes.map(s => translateShape(s, textOriginX, textOriginY));
  // The text only sits ON TOP of the plate (z = baseThickness .. +raisedHeight),
  // never through it, so the back face stays solid base colour (no double-sided
  // letters bleeding through in a multicolour 3MF).
  const textGeo = new THREE.ExtrudeGeometry(movedTextShapes, {
    depth: raisedHeight, bevelEnabled: false, curveSegments,
  });
  textGeo.translate(0, 0, baseThickness);

  const totalWidth = plateX + plateWidth;
  const totalHeight = plateHeight;

  return {
    pieces: [
      {geometry: baseGeo, part: 'base'},
      {geometry: textGeo, part: 'text'},
    ],
    width: totalWidth,
    height: totalHeight,
    /* Diametro real del agujero tras acotarlo, para que la interfaz pueda avisar
       cuando no se respeta el que pidio el usuario. */
    holeDiameter: loopHoleUsable ? loopHoleR * 2 : 0,
    requestedHoleDiameter: loopHoleD,
    missingChars: polys.missing || [],
  };
}

function translateShape(shape, dx, dy) {
  const moved = new THREE.Shape(shape.getPoints().map(p => new THREE.Vector2(p.x + dx, p.y + dy)));
  moved.holes = shape.holes.map(h => new THREE.Path(h.getPoints().map(p => new THREE.Vector2(p.x + dx, p.y + dy))));
  return moved;
}

/**
 * Lay out multiple keychain tiles on a grid with uniform cell sizing so
 * different-length names never overlap. Returns merged geometry pieces with
 * per-tile transforms already baked in (positions), grouped by `part` so the
 * caller can still color base/text differently if desired.
 */
function layoutTiles(tiles, opts) {
  const columns = Math.max(1, opts.columns);
  const gapX = opts.gapXMM;
  const gapY = opts.gapYMM;

  const cellWidth = Math.max(...tiles.map(t => t.width)) + gapX;
  const cellHeight = Math.max(...tiles.map(t => t.height)) + gapY;

  const placed = [];
  const offsets = [];
  tiles.forEach((tile, i) => {
    const col = i % columns;
    const row = Math.floor(i / columns);
    const x = col * cellWidth;
    const y = -row * cellHeight; // rows grow downward on the bed
    offsets.push({x, y});
    for (const piece of tile.pieces) {
      const geo = piece.geometry.clone();
      geo.translate(x, y, 0);
      placed.push({geometry: geo, part: piece.part, tileIndex: i});
    }
  });

  const rows = Math.ceil(tiles.length / columns);
  return {
    pieces: placed,
    offsets,
    bedWidth: columns * cellWidth - gapX,
    bedHeight: rows * cellHeight - gapY,
  };
}

/* ------------------------------------------------------------------ *
 * Outline style: the base follows the silhouette of the letters,
 * dilated outwards, instead of being a rounded plate.
 * ------------------------------------------------------------------ */

// Clipper is integer-only; 1000 units per mm keeps a micron of resolution.
const CLIPPER_SCALE = 1000;

function polysToClipperPaths(polys) {
  return polys.map(p => p.map(([x, y]) => ({
    X: Math.round(x * CLIPPER_SCALE),
    Y: Math.round(y * CLIPPER_SCALE),
  })));
}

function circleClipperPath(cx, cy, r, segments, clockwise) {
  const pts = [];
  for (let i = 0; i < segments; i++) {
    const a = (clockwise ? -1 : 1) * (i / segments) * Math.PI * 2;
    pts.push({
      X: Math.round((cx + Math.cos(a) * r) * CLIPPER_SCALE),
      Y: Math.round((cy + Math.sin(a) * r) * CLIPPER_SCALE),
    });
  }
  return pts;
}

function clipperBoolean(subject, clip, clipType) {
  const c = new ClipperLib.Clipper();
  c.AddPaths(subject, ClipperLib.PolyType.ptSubject, true);
  if (clip && clip.length) c.AddPaths(clip, ClipperLib.PolyType.ptClip, true);
  const tree = new ClipperLib.PolyTree();
  c.Execute(clipType, tree,
    ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
  return tree;
}

function offsetPolygonsOutward(polys, deltaMM) {
  const paths = polysToClipperPaths(polys);
  const co = new ClipperLib.ClipperOffset(2, CLIPPER_SCALE / 400);
  co.AddPaths(paths, ClipperLib.JoinType.jtRound, ClipperLib.EndType.etClosedPolygon);
  const tree = new ClipperLib.PolyTree();
  co.Execute(tree, deltaMM * CLIPPER_SCALE);
  return tree;
}

/** PolyTree -> THREE.Shape[]. Top-level children are separate printed pieces.
 * Collinear and duplicate points are stripped: the cap triangulator (earcut)
 * skips collinear vertices while the extrusion walls keep them, and that
 * mismatch produces T-junction "open edges" in slicers. */
function polyTreeToShapes(tree) {
  const shapes = [];
  const toVecs = node => {
    const c = node.Contour();
    const pts = [];
    for (let i = 0; i < c.length; i++) {
      const prev = c[(i + c.length - 1) % c.length];
      const cur = c[i];
      const next = c[(i + 1) % c.length];
      if (cur.X === prev.X && cur.Y === prev.Y) continue; // duplicate
      const cross = (cur.X - prev.X) * (next.Y - prev.Y) - (cur.Y - prev.Y) * (next.X - prev.X);
      if (cross === 0) continue; // collinear
      pts.push(new THREE.Vector2(cur.X / CLIPPER_SCALE, cur.Y / CLIPPER_SCALE));
    }
    return pts;
  };

  function walkOuter(node) {
    const shape = new THREE.Shape(toVecs(node));
    node.Childs().forEach(holeNode => {
      shape.holes.push(new THREE.Path(toVecs(holeNode)));
      holeNode.Childs().forEach(walkOuter); // island sitting inside a hole
    });
    shapes.push(shape);
  }
  tree.Childs().forEach(walkOuter);
  return {shapes, islands: tree.Childs().length};
}

function shapesBounds(shapes) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  shapes.forEach(s => s.getPoints().forEach(p => {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }));
  return {minX, minY, maxX, maxY};
}

/**
 * Keychain whose plate is the dilated silhouette of the text, with a keyring
 * eyelet fused onto the left. Reports `islands`: anything above 1 means the
 * letters did not merge into a single solid and would print as loose pieces.
 */
function buildOutlineTile(font, emojiFont, lines, opts) {
  const curveSegments = opts.curveSegments || 10;
  const polys = linesToPolygons(font, emojiFont, lines, opts.letterHeightMM, curveSegments);
  if (!polys.length) {
    const err = new Error('sin contornos');
    err.missingChars = polys.missing || [];
    throw err;
  }

  const textShapes = polygonsToShapes(polys);
  const tb = shapesBounds(textShapes);

  // 1. dilate the letters
  let basePaths = ClipperLib.Clipper.PolyTreeToPaths(
    offsetPolygonsOutward(polys, opts.outlineWidthMM));

  // 2. fuse an eyelet on the left, overlapping the first letter so it holds
  const holeR = Math.max(0.6, opts.loopHoleDiameterMM / 2);
  const ringR = holeR + Math.max(opts.loopRingThicknessMM, opts.outlineWidthMM);
  const preferredRingY = (tb.minY + tb.maxY) / 2;
  const outlinedPolys = basePaths.map(path =>
    path.map(pt => [pt.X / CLIPPER_SCALE, pt.Y / CLIPPER_SCALE]));
  const anchor = leftFilledAnchor(outlinedPolys, preferredRingY);
  const ringWall = ringR - holeR;
  const overlap = Math.max(1.0, Math.min(1.8, ringWall * 0.65));
  const ringCx = anchor.x - ringR + overlap;
  const ringCy = anchor.y;
  basePaths = ClipperLib.Clipper.PolyTreeToPaths(clipperBoolean(
    basePaths, [circleClipperPath(ringCx, ringCy, ringR, 56, false)],
    ClipperLib.ClipType.ctUnion));

  // 3. punch the ring hole
  const finalTree = clipperBoolean(
    basePaths, [circleClipperPath(ringCx, ringCy, holeR, 40, false)],
    ClipperLib.ClipType.ctDifference);

  const {shapes: baseShapes, islands} = polyTreeToShapes(finalTree);
  if (!baseShapes.length) throw new Error('contorno vacío');

  // normalise so the tile starts at the origin, like the plate style
  const bb = shapesBounds(baseShapes);
  const dx = -bb.minX, dy = -bb.minY;

  const baseGeo = new THREE.ExtrudeGeometry(
    baseShapes.map(s => translateShape(s, dx, dy)),
    {depth: opts.baseThicknessMM, bevelEnabled: false, curveSegments});
  const textGeo = new THREE.ExtrudeGeometry(
    textShapes.map(s => translateShape(s, dx, dy)),
    {depth: opts.textRaisedHeightMM, bevelEnabled: false, curveSegments});
  // Raised text rests on the plate top; the base stays solid so the back is one colour.
  textGeo.translate(0, 0, opts.baseThicknessMM);

  return {
    pieces: [{geometry: baseGeo, part: 'base'}, {geometry: textGeo, part: 'text'}],
    width: bb.maxX - bb.minX,
    height: bb.maxY - bb.minY,
    islands,
    missingChars: polys.missing || [],
  };
}

/* ------------------------------------------------------------------ *
 * Pencil name: text silhouette built around a longitudinal pencil tunnel.
 *
 * The tunnel is not a round horizontal bridge. Its lower 270 degrees follow
 * the requested circle and its roof uses the two 45-degree tangents to that
 * circle. A round or hexagonal pencil therefore still fits, while every roof
 * line remains printable without support when the name lies flat on the bed.
 * ------------------------------------------------------------------ */

function teardropProfile(radius, centerZ, segments) {
  const pts = [];
  const tangent = radius / Math.sqrt(2);
  pts.push([0, centerZ + Math.SQRT2 * radius]);
  pts.push([-tangent, centerZ + tangent]);
  const arcSteps = Math.max(12, segments || 36);
  for (let i = 0; i <= arcSteps; i++) {
    const a = Math.PI * 0.75 + (Math.PI * 1.5 * i / arcSteps);
    pts.push([Math.cos(a) * radius, centerZ + Math.sin(a) * radius]);
  }
  return pts;
}

function orientedCrossSection(points, clockwise) {
  // ExtrudeGeometry advances on local Z. After rotateY(PI/2), local Z becomes
  // world X and local -X becomes world Z, so [worldY, worldZ] -> [-Z, Y].
  const out = points.map(([y, z]) => new THREE.Vector2(-z, y));
  let area = 0;
  for (let i = 0; i < out.length; i++) {
    const a = out[i], b = out[(i + 1) % out.length];
    area += a.x * b.y - b.x * a.y;
  }
  const isClockwise = area < 0;
  if (isClockwise !== clockwise) out.reverse();
  return out;
}

function buildPencilTube(length, innerRadius, outerRadius, centerZ, curveSegments) {
  const outer = orientedCrossSection(
    teardropProfile(outerRadius, centerZ, Math.max(28, curveSegments * 4)), false);
  const inner = orientedCrossSection(
    teardropProfile(innerRadius, centerZ, Math.max(28, curveSegments * 4)), true);
  const shape = new THREE.Shape(outer);
  shape.holes.push(new THREE.Path(inner));
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: length,
    steps: 1,
    bevelEnabled: false,
    curveSegments,
  });
  geo.rotateY(Math.PI / 2);
  return geo;
}

function buildSolidPencilTube(length, outerRadius, centerZ, curveSegments) {
  const outer = orientedCrossSection(
    teardropProfile(outerRadius, centerZ, Math.max(28, curveSegments * 4)), false);
  const shape = new THREE.Shape(outer);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: length,
    steps: 1,
    bevelEnabled: false,
    curveSegments,
  });
  geo.rotateY(Math.PI / 2);
  return geo;
}

function rectClipperPath(minX, minY, maxX, maxY) {
  return [
    {X: Math.round(minX * CLIPPER_SCALE), Y: Math.round(minY * CLIPPER_SCALE)},
    {X: Math.round(maxX * CLIPPER_SCALE), Y: Math.round(minY * CLIPPER_SCALE)},
    {X: Math.round(maxX * CLIPPER_SCALE), Y: Math.round(maxY * CLIPPER_SCALE)},
    {X: Math.round(minX * CLIPPER_SCALE), Y: Math.round(maxY * CLIPPER_SCALE)},
  ];
}

/** Suma de áreas de paths de Clipper en mm² (los agujeros restan solos). */
function clipperPathsAreaMM2(paths) {
  let area = 0;
  for (const path of paths) area += ClipperLib.Clipper.Area(path);
  return area / (CLIPPER_SCALE * CLIPPER_SCALE);
}

/* Ayudantes PUROS del túnel para lápiz (sin THREE ni Clipper en el cuerpo):
   la suite de Node los prueba directamente vía module.exports. */

/** Resuelve el modo de tapa pedido, aceptando la opción booleana heredada. */
function normalizePencilCapEnd(opts) {
  const v = opts && opts.pencilCapEnd;
  if (v === 'open' || v === 'start' || v === 'end') return v;
  return opts && opts.pencilClosedEnd ? 'start' : 'open';
}

/**
 * Decide dónde va la tapa maciza y cómo se recorta el túnel a su alrededor.
 * Trabaja en el X del tile (ya desplazado por dx). 'start' reproduce el
 * cálculo validado de la tapa junto a la primera letra; 'end' es su espejo
 * exacto junto a la última; 'open' devuelve todo intacto.
 */
function pencilCapPlacement(capMode, tubeStart, tubeEnd, outerR) {
  const tubeLen = tubeEnd - tubeStart;
  const out = {capMode, capX0: null, capX1: null, tubeStart, tubeEnd,
               entryLead: true, exitLead: true, capOverlap: 0.35};
  if ((capMode !== 'start' && capMode !== 'end') || tubeLen <= 0.2) return out;
  const capLen = Math.min(
    Math.max(2.2, outerR * 0.55),
    Math.max(2.2, tubeLen * 0.28));
  if (capMode === 'start') {
    out.capX0 = tubeStart;
    out.capX1 = Math.min(tubeEnd - 1.0, tubeStart + capLen);
    // El tubo se mete unas décimas dentro del macizo para que el laminador
    // fusione ambas zonas sin dejar una pared abierta ni una línea débil.
    out.tubeStart = Math.max(tubeStart, out.capX1 - out.capOverlap);
    out.entryLead = false; // el lado tapado no lleva boca ensanchada
  } else {
    out.capX1 = tubeEnd;
    out.capX0 = Math.max(tubeStart + 1.0, tubeEnd - capLen);
    out.tubeEnd = Math.min(tubeEnd, out.capX0 + out.capOverlap);
    out.exitLead = false;
  }
  return out;
}

/** Área exacta del perfil de lágrima: sector de 270° + cometa del techo a 45°. */
function teardropAreaMM2(radius) {
  return radius * radius * (1 + Math.PI * 0.75);
}

/** Área de un segmento circular de sagita h en un círculo de radio R. */
function circularSegmentAreaMM2(R, h) {
  const s = Math.max(0, Math.min(h, 2 * R));
  return R * R * Math.acos(1 - s / R) - (R - s) * Math.sqrt(Math.max(0, 2 * R * s - s * s));
}

/**
 * Volumen del nombre para lápiz por regiones 2D × altura. Las pieles ya cubren
 * el casquete inferior y la cuña del ápice del anillo, así que ese tramo se
 * descuenta para no contarlo dos veces. Los solapes de diseño de 0.25–0.35 mm
 * se ignoran a propósito: esto alimenta el "≈ X g" del visor (±10 %), no una
 * báscula.
 */
function estimatePencilVolumeMM3(m) {
  const ringArea = teardropAreaMM2(m.outerR) - teardropAreaMM2(m.innerR);
  const skinOverlap = circularSegmentAreaMM2(m.outerR, m.skin) + m.skin * m.skin;
  return m.wingsArea * m.totalZ
    + m.bandArea * 2 * m.skin
    + Math.max(0, ringArea - skinOverlap) * m.tubeLen
    + m.capArea * Math.max(0, m.totalZ - 2 * m.skin)
    + teardropAreaMM2(m.innerR) * (m.plugLen || 0)
    + m.textArea * m.raisedHeight;
}

/**
 * Build an uppercase name threaded lengthwise by a supportless pencil tunnel.
 * The returned base is a set of overlapping closed solids on purpose: Bambu,
 * Cura and PrusaSlicer union them at slice time, just like the existing raised
 * text pieces, while the tunnel remains a real uninterrupted void.
 */
function buildPencilNameTile(font, emojiFont, lines, opts) {
  const curveSegments = opts.curveSegments || 10;
  const polys = linesToPolygons(font, emojiFont, lines, opts.letterHeightMM, curveSegments);
  if (!polys.length) {
    const err = new Error('sin contornos para lápiz');
    err.missingChars = polys.missing || [];
    throw err;
  }

  const textShapes = polygonsToShapes(polys);
  let basePaths = ClipperLib.Clipper.PolyTreeToPaths(
    offsetPolygonsOutward(polys, Math.max(1.2, opts.outlineWidthMM)));
  const baseTree = clipperBoolean(basePaths, null, ClipperLib.ClipType.ctUnion);
  const {shapes: baseShapes, islands} = polyTreeToShapes(baseTree);
  if (!baseShapes.length) throw new Error('contorno para lápiz vacío');
  basePaths = ClipperLib.Clipper.PolyTreeToPaths(baseTree);

  const bb = shapesBounds(baseShapes);
  const dx = -bb.minX, dy = -bb.minY;
  const width = bb.maxX - bb.minX;
  const height = bb.maxY - bb.minY;
  const centerY = (bb.minY + bb.maxY) / 2;

  const holeD = Math.max(7.6, opts.pencilHoleDiameterMM || 8.6);
  const wall = Math.max(1.2, opts.pencilWallMM || 1.4);
  const innerR = holeD / 2;
  const outerR = innerR + wall;
  const centerZ = outerR;
  const totalZ = centerZ + Math.SQRT2 * outerR;
  const skin = Math.min(wall, Math.max(0.9, totalZ * 0.12));
  const capMode = normalizePencilCapEnd(opts);

  // Full back/front skins keep accents and counters attached to the core. They
  // end exactly outside the tunnel envelope, so neither one closes the hole.
  const movedBase = baseShapes.map(s => translateShape(s, dx, dy));
  const backGeo = new THREE.ExtrudeGeometry(movedBase, {
    depth: skin, bevelEnabled: false, curveSegments,
  });
  const frontGeo = new THREE.ExtrudeGeometry(movedBase, {
    depth: skin, bevelEnabled: false, curveSegments,
  });
  frontGeo.translate(0, 0, totalZ - skin);

  // Keep the parts of the letters above and below the tube solid through the
  // whole depth. A small overlap prevents coincident/tangent-only contacts.
  const overlap = 0.25;
  const band = rectClipperPath(
    bb.minX - 2, centerY - outerR + overlap,
    bb.maxX + 2, centerY + outerR - overlap);
  const wingTree = clipperBoolean(basePaths, [band], ClipperLib.ClipType.ctDifference);
  const {shapes: wingShapes} = polyTreeToShapes(wingTree);
  const bandTree = clipperBoolean(basePaths, [band], ClipperLib.ClipType.ctIntersection);
  const {shapes: bandShapes} = polyTreeToShapes(bandTree);
  const pieces = [
    {geometry: backGeo, part: 'base'},
    {geometry: frontGeo, part: 'base'},
  ];
  if (wingShapes.length) {
    const wingGeo = new THREE.ExtrudeGeometry(
      wingShapes.map(s => translateShape(s, dx, dy)),
      {depth: totalZ, bevelEnabled: false, curveSegments});
    pieces.push({geometry: wingGeo, part: 'base'});
  }

  // The tube should only be visible where the silhouette actually crosses the
  // centre band. Using the whole name bounding box made the tunnel stick out
  // beyond narrow end letters (for example the i in Isabel), leaving a long
  // visible cylinder at the sides. Clamp the tunnel to the band intersection.
  let tubeStart = 0;
  let tubeEnd = width;
  if (bandShapes.length) {
    const tubeBB = shapesBounds(bandShapes);
    tubeStart = Math.max(0, tubeBB.minX + dx);
    tubeEnd = Math.min(width, tubeBB.maxX + dx);
  }
  let tubeLen = Math.max(0, tubeEnd - tubeStart);
  // Keep at least one practical opening if the band reduces to a tiny sliver.
  if (tubeLen < Math.max(innerR * 1.2, 2.0)) {
    tubeStart = 0;
    tubeEnd = width;
    tubeLen = width;
  }

  /* Cierre oculto elegible: 'start' maciza el tramo junto a la PRIMERA letra
     (el comportamiento original validado) y 'end' hace lo mismo junto a la
     última, como los toppers clásicos. pencilCapPlacement decide los tramos;
     aquí solo se recorta la silueta y se extruye. */
  let closedCapShapes = [];
  let fallbackPlugLen = 0;
  let capArea = 0;
  const place = pencilCapPlacement(capMode, tubeStart, tubeEnd, outerR);
  if (place.capX0 !== null) {
    const capRect = rectClipperPath(
      place.capX0 - dx - place.capOverlap,
      centerY - outerR - place.capOverlap,
      place.capX1 - dx + place.capOverlap,
      centerY + outerR + place.capOverlap);
    const capTree = clipperBoolean(basePaths, [capRect], ClipperLib.ClipType.ctIntersection);
    closedCapShapes = polyTreeToShapes(capTree).shapes;

    if (closedCapShapes.length) {
      // El tubo se mete unas décimas dentro del macizo para que el laminador
      // fusione ambas zonas sin dejar una pared abierta ni una línea débil.
      tubeStart = place.tubeStart;
      tubeEnd = place.tubeEnd;
      tubeLen = Math.max(0, tubeEnd - tubeStart);
      capArea = clipperPathsAreaMM2(ClipperLib.Clipper.PolyTreeToPaths(capTree));
    } else {
      // Respaldo para siluetas extremadamente finas o fuentes defectuosas.
      fallbackPlugLen = Math.max(1.4, Math.min(2.4, wall + 0.6, tubeLen * 0.2));
    }
  }

  // Boca escalonada de 0.35 mm SOLO en los extremos abiertos: guía el lápiz
  // sin aflojar el diámetro calibrado. El lado tapado (o con tapón) no la
  // lleva; su tramo lo absorbe el núcleo calibrado, que fusiona mejor.
  const lead = Math.min(1.2, tubeLen * 0.12);
  const leadR = Math.min(innerR + 0.35, outerR - 0.8);
  const plugged = fallbackPlugLen > 0;
  const wantEntry = place.entryLead && !(plugged && capMode === 'start');
  const wantExit = place.exitLead && !(plugged && capMode === 'end');
  const nLeads = (wantEntry ? 1 : 0) + (wantExit ? 1 : 0);
  if (tubeLen > lead * nLeads + 1) {
    const coreStart = tubeStart + (wantEntry ? lead : 0);
    const coreEnd = tubeEnd - (wantExit ? lead : 0);
    if (wantEntry) {
      const entryGeo = buildPencilTube(lead, leadR, outerR, centerZ, curveSegments);
      entryGeo.translate(tubeStart, centerY + dy, 0);
      pieces.push({geometry: entryGeo, part: 'base'});
    }
    const coreGeo = buildPencilTube(coreEnd - coreStart, innerR, outerR, centerZ, curveSegments);
    coreGeo.translate(coreStart, centerY + dy, 0);
    pieces.push({geometry: coreGeo, part: 'base'});
    if (wantExit) {
      const exitGeo = buildPencilTube(lead, leadR, outerR, centerZ, curveSegments);
      exitGeo.translate(tubeEnd - lead, centerY + dy, 0);
      pieces.push({geometry: exitGeo, part: 'base'});
    }
  } else if (tubeLen > 0.2) {
    const tubeGeo = buildPencilTube(tubeLen, innerR, outerR, centerZ, curveSegments);
    tubeGeo.translate(tubeStart, centerY + dy, 0);
    pieces.push({geometry: tubeGeo, part: 'base'});
  }

  if (closedCapShapes.length) {
    const capGeo = new THREE.ExtrudeGeometry(
      closedCapShapes.map(s => translateShape(s, dx, dy)),
      {depth: totalZ, bevelEnabled: false, curveSegments});
    pieces.push({geometry: capGeo, part: 'base'});
  } else if (plugged && tubeLen > 0.2) {
    const plugX = capMode === 'end' ? tubeEnd - fallbackPlugLen : tubeStart;
    const endPlugGeo = buildSolidPencilTube(fallbackPlugLen, innerR + 0.35, centerZ, curveSegments);
    endPlugGeo.translate(plugX, centerY + dy, 0);
    pieces.push({geometry: endPlugGeo, part: 'base'});
  }

  // Optional raised face keeps the existing two-colour/AMS workflow. In the
  // one-colour mode it simply fuses into the same STL.
  const textGeo = new THREE.ExtrudeGeometry(
    textShapes.map(s => translateShape(s, dx, dy)),
    {depth: opts.textRaisedHeightMM, bevelEnabled: false, curveSegments});
  textGeo.translate(0, 0, totalZ);
  pieces.push({geometry: textGeo, part: 'text'});

  // Volumen aproximado por regiones 2D × altura, para el "≈ g" del visor.
  const wingsArea = clipperPathsAreaMM2(ClipperLib.Clipper.PolyTreeToPaths(wingTree));
  const bandArea = clipperPathsAreaMM2(ClipperLib.Clipper.PolyTreeToPaths(bandTree));
  const textArea = Math.abs(clipperPathsAreaMM2(polysToClipperPaths(polys)));
  const volumeMM3 = estimatePencilVolumeMM3({
    wingsArea, bandArea, capArea, textArea,
    plugLen: fallbackPlugLen, outerR, innerR, skin, totalZ, tubeLen,
    raisedHeight: opts.textRaisedHeightMM,
  });

  return {
    pieces,
    width,
    height,
    islands,
    holeDiameter: holeD,
    baseThickness: totalZ,
    thickness: totalZ + opts.textRaisedHeightMM,
    missingChars: polys.missing || [],
    volumeMM3,
    // Datos del hueco real para dibujar el lápiz fantasma del visor.
    pencil: {
      axisY: centerY + dy,
      centerZ,
      innerR,
      xStart: tubeStart + (plugged && capMode === 'start' ? fallbackPlugLen : 0),
      xEnd: tubeEnd - (plugged && capMode === 'end' ? fallbackPlugLen : 0),
      capEnd: capMode,
    },
  };
}

/**
 * Testigo de ajuste: tres túneles cortos con el diámetro elegido −0.3 mm,
 * exacto y +0.3 mm sobre una base común. Se imprime en minutos y evita tirar
 * un nombre completo por un lápiz fuera de medida. Las barras en relieve
 * (1 = apretado, 2 = tu ajuste, 3 = holgado) no dependen de la fuente; el
 * rótulo numérico solo se añade si la tipografía trae todos sus glifos.
 * Sin bocas escalonadas: el testigo mide el diámetro calibrado real.
 */
function buildPencilFitTestTile(font, opts) {
  const curveSegments = opts.curveSegments || 10;
  const d = Math.max(7.6, opts.pencilHoleDiameterMM || 8.6);
  const wall = Math.max(1.2, opts.pencilWallMM || 1.4);
  const dList = [d - 0.3, d, d + 0.3];
  const outerRMax = dList[2] / 2 + wall;
  const pitch = 2 * outerRMax + 5;
  const tubeLen = 12;

  const labelX0 = tubeLen + 1.5; // pestaña de marcas a la derecha de los túneles
  const baseX0 = -2, baseX1 = labelX0 + 19;
  const baseY0 = -(outerRMax + 2), baseY1 = 2 * pitch + outerRMax + 2;
  const baseThickness = 1.2;

  const pieces = [];
  const baseShape = roundedRectShape(baseX0, baseY0, baseX1 - baseX0, baseY1 - baseY0, 2);
  const baseGeo = new THREE.ExtrudeGeometry(baseShape, {
    depth: baseThickness, bevelEnabled: false, curveSegments,
  });
  pieces.push({geometry: baseGeo, part: 'base'});

  let maxTotalZ = baseThickness;
  dList.forEach((di, i) => {
    const innerR = di / 2;
    const outerR = innerR + wall;
    const centerZ = outerR;
    maxTotalZ = Math.max(maxTotalZ, centerZ + Math.SQRT2 * outerR);
    const tubeGeo = buildPencilTube(tubeLen, innerR, outerR, centerZ, curveSegments);
    tubeGeo.translate(0, i * pitch, 0);
    pieces.push({geometry: tubeGeo, part: 'base'});

    // Barras 1/2/3 con rectángulos puros: legibles con cualquier fuente.
    for (let b = 0; b <= i; b++) {
      const barShape = roundedRectShape(labelX0 + b * 2.0, i * pitch - 2.0, 1.0, 4.0, 0);
      const barGeo = new THREE.ExtrudeGeometry(barShape, {
        depth: 0.8, bevelEnabled: false, curveSegments,
      });
      barGeo.translate(0, 0, baseThickness);
      pieces.push({geometry: barGeo, part: 'text'});
    }

    // Rótulo numérico opcional; se omite en silencio si faltan glifos.
    if (font) {
      const polys = linesToPolygons(font, null, [{text: di.toFixed(1)}], 4.0, curveSegments);
      if (polys.length && !(polys.missing || []).length) {
        const pb = polysBounds(polys);
        const moved = translatePolys(polys,
          labelX0 + 11.5 - (pb.minX + pb.maxX) / 2,
          i * pitch - (pb.minY + pb.maxY) / 2);
        const labelGeo = new THREE.ExtrudeGeometry(polygonsToShapes(moved), {
          depth: 0.8, bevelEnabled: false, curveSegments,
        });
        labelGeo.translate(0, 0, baseThickness);
        pieces.push({geometry: labelGeo, part: 'text'});
      }
    }
  });

  return {
    pieces,
    width: baseX1 - baseX0,
    height: baseY1 - baseY0,
    islands: 1,
    holeDiameter: d,
    baseThickness: maxTotalZ,
    thickness: maxTotalZ,
    missingChars: [],
  };
}

/* ------------------------------------------------------------------ *
 * Text with emoji fallback + multi-line layout.
 * ------------------------------------------------------------------ */

/**
 * Render text char by char: glyphs missing from the primary font are taken
 * from the fallback (Noto Emoji), so "Ana ⚽🐱" works in any font. Returns
 * flattened polygons in the same y-up space as pathToPolygons.
 */
function textRunToPolygons(font, emojiFont, text, fontSizePx, curveSegments) {
  const polys = [];
  let x = 0;
  /* Los caracteres que la fuente no tiene se sustituian por un espacio en
     silencio: el usuario descargaba "Bego a" y solo lo descubria al imprimir.
     Se siguen omitiendo para no romper la placa, pero quedan registrados para
     que la interfaz pueda avisar antes de descargar. */
  const missing = [];
  for (const ch of Array.from(text)) {
    let f = font;
    let gi = font.charToGlyphIndex(ch);
    if (gi === 0 && emojiFont) {
      const gi2 = emojiFont.charToGlyphIndex(ch);
      if (gi2 > 0) { f = emojiFont; gi = gi2; }
    }
    if (gi === 0) {
      if (ch.trim() && missing.indexOf(ch) === -1) missing.push(ch);
      x += fontSizePx * 0.3; continue; // unknown char -> space
    }
    // emoji glyphs fill most of their em box; primary text is sized via cap
    // height, so scale the fallback to visually match the primary's caps
    const size = f === font
      ? fontSizePx
      : fontSizePx * (getCapHeight(font) / font.unitsPerEm) * 1.15;
    const glyph = f.glyphs.get(gi);
    const path = glyph.getPath(x, 0, size);
    polys.push(...pathToPolygons(path, curveSegments));
    x += glyph.advanceWidth * (size / f.unitsPerEm);
  }
  polys.missing = missing;
  return polys;
}

function polysBounds(polys) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const p of polys) for (const [x, y] of p) {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  return {minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY};
}

function translatePolys(polys, dx, dy) {
  return polys.map(p => p.map(([x, y]) => [x + dx, y + dy]));
}

/**
 * Lay out one or two lines of text (second line smaller, centred underneath),
 * returning polygons centred on the origin.
 */
function linesToPolygons(font, emojiFont, lines, letterHeightMM, curveSegments) {
  const capHeight = getCapHeight(font);
  const all = [];
  const rendered = [];
  const missing = [];
  lines.forEach(line => {
    if (!line.text) return;
    const size = (letterHeightMM * (line.scale || 1) * font.unitsPerEm) / capHeight;
    const polys = textRunToPolygons(font, emojiFont, line.text, size, curveSegments);
    (polys.missing || []).forEach(ch => { if (missing.indexOf(ch) === -1) missing.push(ch); });
    if (polys.length) rendered.push({polys, bounds: polysBounds(polys)});
  });
  if (!rendered.length) { const empty = []; empty.missing = missing; return empty; }
  const gap = letterHeightMM * 0.25;
  const totalH = rendered.reduce((s, r) => s + r.bounds.height, 0) + gap * (rendered.length - 1);
  let yTop = totalH / 2;
  rendered.forEach(r => {
    const dx = -(r.bounds.minX + r.bounds.maxX) / 2;
    const dy = yTop - r.bounds.maxY;
    all.push(...translatePolys(r.polys, dx, dy));
    yTop -= r.bounds.height + gap;
  });
  // Emoji glyphs often contain touching/overlapping contours; a clipper
  // union normalises them so the extrusion has no duplicated edges.
  const out = typeof ClipperLib !== 'undefined' ? clipperNormalizePolys(all) : all;
  out.missing = missing;
  return out;
}

/** Union + clean arbitrary polygons back into well-nested, simple polygons.
 * The final micro-grow (0.01 mm, mitred) turns point-touching contours —
 * common in emoji glyphs and unioned grids — into tiny solid bridges, so the
 * extrusion caps never pinch into non-manifold edges. */
function clipperNormalizePolys(polys) {
  const paths = polysToClipperPaths(polys);
  ClipperLib.Clipper.SimplifyPolygons(paths, ClipperLib.PolyFillType.pftNonZero);
  ClipperLib.Clipper.CleanPolygons(paths, CLIPPER_SCALE * 0.002);
  const co = new ClipperLib.ClipperOffset(2, CLIPPER_SCALE / 400);
  co.AddPaths(paths.filter(p => p.length >= 3),
    ClipperLib.JoinType.jtSquare, ClipperLib.EndType.etClosedPolygon);
  const out = new ClipperLib.Paths();
  co.Execute(out, CLIPPER_SCALE * 0.01);
  return out
    .filter(p => p.length >= 3)
    .map(p => p.map(pt => [pt.X / CLIPPER_SCALE, pt.Y / CLIPPER_SCALE]));
}

/** Topmost filled y at a given x (even-odd over polygons), for anchoring the
 * eyelet on shapes whose top edge dips at the centre (heart cleft, bone bar). */
function topFilledY(polys, x, yMax, yMin) {
  for (let y = yMax; y >= yMin; y -= 0.4) {
    let inside = 0;
    for (const p of polys) if (pointInPolygon([x, y], p)) inside++;
    if (inside % 2 === 1) return y;
  }
  return null;
}

/** Punto lleno más a la izquierda cerca de una altura preferida. A diferencia
 * del mínimo global del bounding box, este punto sí pertenece a material real
 * en la misma zona donde se colocará el aro; es esencial para letras cursivas
 * con remates que sobresalen sólo arriba o abajo. */
function leftFilledAnchor(polys, preferredY) {
  const b = polysBounds(polys);
  const sample = 0.12;
  const atY = y => {
    for (let x = b.minX - sample; x <= b.maxX + sample; x += sample) {
      let inside = 0;
      for (const p of polys) if (pointInPolygon([x, y], p)) inside++;
      if (inside % 2 === 1) return x;
    }
    return null;
  };
  const yStep = 0.24;
  const maxSteps = Math.ceil(b.height / yStep);
  for (let i = 0; i <= maxSteps; i++) {
    const candidates = i === 0
      ? [preferredY]
      : [preferredY + i * yStep, preferredY - i * yStep];
    for (const y of candidates) {
      if (y < b.minY || y > b.maxY) continue;
      const x = atY(y);
      if (x !== null) return {x, y};
    }
  }
  return {x: b.minX, y: Math.max(b.minY, Math.min(b.maxY, preferredY))};
}

/* ------------------------------------------------------------------ *
 * Parametric base shapes (heart, star, bone...). Each returns clipper-ready
 * paths (mm, centred at origin) that the builder unions together.
 * ------------------------------------------------------------------ */

function ptsToClipper(pts) {
  return pts.map(([x, y]) => ({X: Math.round(x * CLIPPER_SCALE), Y: Math.round(y * CLIPPER_SCALE)}));
}

const SHAPES = {
  circle: (w, h) => {
    const pts = [];
    for (let i = 0; i < 72; i++) {
      const a = (i / 72) * Math.PI * 2;
      pts.push([Math.cos(a) * w / 2, Math.sin(a) * h / 2]);
    }
    return [pts];
  },
  heart: (w, h) => {
    // classic parametric heart, normalised to its own bbox then scaled
    const raw = [];
    for (let i = 0; i < 100; i++) {
      const t = (i / 100) * Math.PI * 2;
      raw.push([
        16 * Math.pow(Math.sin(t), 3),
        13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t),
      ]);
    }
    const b = polysBounds([raw]);
    return [raw.map(([x, y]) => [
      (x - (b.minX + b.maxX) / 2) / b.width * w,
      (y - (b.minY + b.maxY) / 2) / b.height * h,
    ])];
  },
  star: (w, h) => {
    const pts = [];
    for (let i = 0; i < 10; i++) {
      const a = Math.PI / 2 + (i / 10) * Math.PI * 2;
      const r = i % 2 === 0 ? 1 : 0.45;
      pts.push([Math.cos(a) * r * w / 2, Math.sin(a) * r * h / 2]);
    }
    return [pts];
  },
  hex: (w, h) => {
    const pts = [];
    for (let i = 0; i < 6; i++) {
      const a = Math.PI / 6 + (i / 6) * Math.PI * 2;
      pts.push([Math.cos(a) * w / 2, Math.sin(a) * h / 2]);
    }
    return [pts];
  },
  cloud: (w, h) => {
    // union of overlapping circles along the width + a fat base ellipse
    const paths = [];
    const circle = (cx, cy, rx, ry) => {
      const pts = [];
      for (let i = 0; i < 48; i++) {
        const a = (i / 48) * Math.PI * 2;
        pts.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
      }
      return pts;
    };
    paths.push(circle(0, -h * 0.18, w * 0.5, h * 0.32));
    paths.push(circle(-w * 0.28, 0, w * 0.22, h * 0.30));
    paths.push(circle(0.02 * w, h * 0.10, w * 0.26, h * 0.38));
    paths.push(circle(w * 0.28, 0, w * 0.20, h * 0.28));
    return paths;
  },
  bone: (w, h) => {
    const paths = [];
    const r = h * 0.25;
    const lobe = (cx, cy) => {
      const pts = [];
      for (let i = 0; i < 40; i++) {
        const a = (i / 40) * Math.PI * 2;
        pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
      }
      return pts;
    };
    const endX = w / 2 - r;
    paths.push(lobe(-endX, h / 2 - r), lobe(-endX, -(h / 2 - r)));
    paths.push(lobe(endX, h / 2 - r), lobe(endX, -(h / 2 - r)));
    // central bar
    const barH = h * 0.52;
    paths.push([[-endX, -barH / 2], [endX, -barH / 2], [endX, barH / 2], [-endX, barH / 2]]);
    return paths;
  },
  tag: (w, h) => {
    // military-style stadium: rectangle with semicircular ends
    const pts = [];
    const r = h / 2;
    const halfW = w / 2 - r;
    for (let i = 0; i <= 24; i++) {
      const a = -Math.PI / 2 + (i / 24) * Math.PI;
      pts.push([halfW + Math.cos(a) * r, Math.sin(a) * r]);
    }
    for (let i = 0; i <= 24; i++) {
      const a = Math.PI / 2 + (i / 24) * Math.PI;
      pts.push([-halfW + Math.cos(a) * r, Math.sin(a) * r]);
    }
    return [pts];
  },
  etiqueta: (w, h) => {
    // luggage tag: rounded rect with one clipped corner
    const r = Math.min(w, h) * 0.15;
    const cut = Math.min(w, h) * 0.38;
    const pts = [];
    const arc = (cx, cy, a0, a1) => {
      for (let i = 0; i <= 8; i++) {
        const a = a0 + (i / 8) * (a1 - a0);
        pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
      }
    };
    pts.push([-w / 2 + cut, h / 2]);
    arc(w / 2 - r, h / 2 - r, Math.PI / 2, 0);
    arc(w / 2 - r, -h / 2 + r, 0, -Math.PI / 2);
    arc(-w / 2 + r, -h / 2 + r, -Math.PI / 2, -Math.PI);
    pts.push([-w / 2, h / 2 - cut]);
    return [pts];
  },
};

/** How much of the shape's bbox is usable for text (per shape tuning). */
const SHAPE_CONTENT = {
  circle: {cx: 0.72, cy: 0.62},
  heart: {cx: 0.62, cy: 0.42},
  star: {cx: 0.52, cy: 0.34},
  hex: {cx: 0.74, cy: 0.62},
  cloud: {cx: 0.62, cy: 0.42},
  bone: {cx: 0.60, cy: 0.42},
  tag: {cx: 0.72, cy: 0.66},
  etiqueta: {cx: 0.72, cy: 0.62},
};

/**
 * Keychain where the text (1-2 lines, emoji ok) sits centred on a parametric
 * shape, with the eyelet fused at the top. Same part contract as the other
 * builders: pieces[] with 'base' and 'text'.
 */
function buildShapeTile(font, emojiFont, lines, shapeKey, opts) {
  const curveSegments = opts.curveSegments || 10;
  const polys = linesToPolygons(font, emojiFont, lines, opts.letterHeightMM, curveSegments);
  if (!polys.length) {
    const err = new Error('sin texto');
    err.missingChars = polys.missing || [];
    throw err;
  }
  const tb = polysBounds(polys);

  const factors = SHAPE_CONTENT[shapeKey] || SHAPE_CONTENT.circle;
  const shapeFn = SHAPES[shapeKey] || SHAPES.circle;
  let shapeW = (tb.width + opts.basePaddingMM) / factors.cx;
  let shapeH = (tb.height + opts.basePaddingMM) / factors.cy;
  // keep recognisable proportions: never squash beyond 2.6:1 of natural
  if (shapeW / shapeH > 2.6) shapeH = shapeW / 2.6;
  if (shapeH / shapeW > 1.6) shapeW = shapeH / 1.6;

  let basePaths = shapeFn(shapeW, shapeH).map(ptsToClipper);
  basePaths = ClipperLib.Clipper.PolyTreeToPaths(
    clipperBoolean(basePaths, null, ClipperLib.ClipType.ctUnion));

  // Eyelet fused at top centre. The anchor height comes from probing the
  // actual filled silhouette at x=0: a heart's cleft or a bone's central bar
  // sit well below the bounding box top, and anchoring to the bbox there
  // would leave the ring floating as a separate island.
  const holeR = Math.max(0.6, opts.loopHoleDiameterMM / 2);
  const ringR = holeR + Math.max(1.6, opts.loopRingThicknessMM);
  const mmPolys = basePaths.map(p => p.map(pt => [pt.X / CLIPPER_SCALE, pt.Y / CLIPPER_SCALE]));
  const topY = topFilledY(mmPolys, 0, shapeH / 2 + 1, -shapeH / 2);
  const ringCy = (topY === null ? shapeH / 2 : topY) + ringR * 0.35;
  basePaths = ClipperLib.Clipper.PolyTreeToPaths(clipperBoolean(
    basePaths, [circleClipperPath(0, ringCy, ringR, 56, false)], ClipperLib.ClipType.ctUnion));
  const finalTree = clipperBoolean(
    basePaths, [circleClipperPath(0, ringCy, holeR, 40, false)], ClipperLib.ClipType.ctDifference);

  const {shapes: baseShapes, islands} = polyTreeToShapes(finalTree);
  const bb = shapesBounds(baseShapes);
  const dx = -bb.minX, dy = -bb.minY;

  const textShapes = polygonsToShapes(polys);
  const baseGeo = new THREE.ExtrudeGeometry(
    baseShapes.map(s => translateShape(s, dx, dy)),
    {depth: opts.baseThicknessMM, bevelEnabled: false, curveSegments});
  const textGeo = new THREE.ExtrudeGeometry(
    textShapes.map(s => translateShape(s, dx, dy)),
    {depth: opts.textRaisedHeightMM, bevelEnabled: false, curveSegments});
  // Raised text rests on the plate top; the base stays solid so the back is one colour.
  textGeo.translate(0, 0, opts.baseThicknessMM);

  return {
    pieces: [{geometry: baseGeo, part: 'base'}, {geometry: textGeo, part: 'text'}],
    width: bb.maxX - bb.minX,
    height: bb.maxY - bb.minY,
    islands,
    missingChars: polys.missing || [],
  };
}

/* ------------------------------------------------------------------ *
 * Double outline: text + inner band + outer plate, three stacked colours.
 * ------------------------------------------------------------------ */

function buildDoubleOutlineTile(font, emojiFont, lines, opts) {
  const curveSegments = opts.curveSegments || 10;
  const polys = linesToPolygons(font, emojiFont, lines, opts.letterHeightMM, curveSegments);
  if (!polys.length) {
    const err = new Error('sin texto');
    err.missingChars = polys.missing || [];
    throw err;
  }
  const tb = polysBounds(polys);

  const w1 = opts.outlineWidthMM;
  const w2 = opts.outlineWidthMM * 0.9 + 0.6;

  const innerPaths = ClipperLib.Clipper.PolyTreeToPaths(offsetPolygonsOutward(polys, w1));
  let outerPaths = ClipperLib.Clipper.PolyTreeToPaths(offsetPolygonsOutward(polys, w1 + w2));

  // eyelet on the outer plate, left side
  const holeR = Math.max(0.6, opts.loopHoleDiameterMM / 2);
  const ringR = holeR + Math.max(opts.loopRingThicknessMM, w2);
  const preferredRingY = (tb.minY + tb.maxY) / 2;
  const outlinedPolys = outerPaths.map(path =>
    path.map(pt => [pt.X / CLIPPER_SCALE, pt.Y / CLIPPER_SCALE]));
  const anchor = leftFilledAnchor(outlinedPolys, preferredRingY);
  const ringWall = ringR - holeR;
  const overlap = Math.max(1.0, Math.min(1.8, ringWall * 0.65));
  const ringCx = anchor.x - ringR + overlap;
  const ringCy = anchor.y;
  outerPaths = ClipperLib.Clipper.PolyTreeToPaths(clipperBoolean(
    outerPaths, [circleClipperPath(ringCx, ringCy, ringR, 56, false)], ClipperLib.ClipType.ctUnion));
  const outerTree = clipperBoolean(
    outerPaths, [circleClipperPath(ringCx, ringCy, holeR, 40, false)], ClipperLib.ClipType.ctDifference);

  const {shapes: outerShapes, islands} = polyTreeToShapes(outerTree);
  const {shapes: innerShapes} = polyTreeToShapes(clipperBoolean(innerPaths, null, ClipperLib.ClipType.ctUnion));
  const textShapes = polygonsToShapes(polys);

  const bb = shapesBounds(outerShapes);
  const dx = -bb.minX, dy = -bb.minY;
  const tBase = opts.baseThicknessMM;
  const tBand = Math.max(0.6, opts.textRaisedHeightMM * 0.75);
  const tText = opts.textRaisedHeightMM;

  const baseGeo = new THREE.ExtrudeGeometry(
    outerShapes.map(s => translateShape(s, dx, dy)),
    {depth: tBase, bevelEnabled: false, curveSegments});
  const bandGeo = new THREE.ExtrudeGeometry(
    innerShapes.map(s => translateShape(s, dx, dy)),
    {depth: tBand, bevelEnabled: false, curveSegments});
  bandGeo.translate(0, 0, tBase);
  const textGeo = new THREE.ExtrudeGeometry(
    textShapes.map(s => translateShape(s, dx, dy)),
    {depth: tText, bevelEnabled: false, curveSegments});
  textGeo.translate(0, 0, tBase + tBand);

  return {
    pieces: [
      {geometry: baseGeo, part: 'base'},
      {geometry: bandGeo, part: 'borde'},
      {geometry: textGeo, part: 'text'},
    ],
    width: bb.maxX - bb.minX,
    height: bb.maxY - bb.minY,
    islands,
    missingChars: polys.missing || [],
  };
}

/* ------------------------------------------------------------------ *
 * QR tile: dark modules raised on a rounded plate with an eyelet.
 * ------------------------------------------------------------------ */

/**
 * Mesh a binary grid as a solid slab, triangulating ON the grid itself:
 * every vertex is a cell corner, caps are two triangles per dark cell and
 * walls appear wherever dark meets light. Generic triangulators (earcut)
 * merge collinear vertices along rectilinear runs, leaving T-junctions
 * against the extrusion walls; on-grid meshing makes that impossible.
 */
function buildGridMesh(matrix, mod, z0, z1) {
  const n = matrix.length;
  const dark = (r, c) => r >= 0 && c >= 0 && r < n && c < n && !!matrix[r][c];
  const verts = [];
  const index = new Map();
  const vid = (x, y, z) => {
    const k = x + ',' + y + ',' + z;
    let i = index.get(k);
    if (i === undefined) { i = verts.length / 3; index.set(k, i); verts.push(x, y, z); }
    return i;
  };
  const tris = [];
  const quad = (a, b, c, d) => { tris.push(a, b, c, a, c, d); };

  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (!dark(r, c)) continue;
      const x0 = c * mod, x1 = (c + 1) * mod;
      const y1 = (n - r) * mod, y0 = (n - r - 1) * mod; // row 0 = top, flip to y-up
      // caps (top CCW seen from above, bottom reversed)
      quad(vid(x0, y0, z1), vid(x1, y0, z1), vid(x1, y1, z1), vid(x0, y1, z1));
      quad(vid(x0, y0, z0), vid(x0, y1, z0), vid(x1, y1, z0), vid(x1, y0, z0));
      // walls where the neighbour is light (outward-facing)
      if (!dark(r + 1, c)) quad(vid(x0, y0, z0), vid(x1, y0, z0), vid(x1, y0, z1), vid(x0, y0, z1)); // south
      if (!dark(r - 1, c)) quad(vid(x1, y1, z0), vid(x0, y1, z0), vid(x0, y1, z1), vid(x1, y1, z1)); // north
      if (!dark(r, c - 1)) quad(vid(x0, y1, z0), vid(x0, y0, z0), vid(x0, y0, z1), vid(x0, y1, z1)); // west
      if (!dark(r, c + 1)) quad(vid(x1, y0, z0), vid(x1, y1, z0), vid(x1, y1, z1), vid(x1, y0, z1)); // east
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(verts), 3));
  geo.setIndex(tris);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Two diagonally-touching dark modules share only a corner: their walls meet
 * along one vertical edge used by four faces — a non-manifold pinch that
 * slicers flag. Subdividing 3x and darkening one ⅓-module bridge cell at each
 * diagonal contact turns every pinch into a normal 3-dark corner. The nub is
 * ~0.4 mm and QR error correction shrugs it off.
 */
function subdivideWithDiagonalBridges(matrix) {
  const n = matrix.length;
  const f = [];
  for (let r = 0; r < 3 * n; r++) {
    f.push([]);
    for (let c = 0; c < 3 * n; c++) f[r].push(!!matrix[Math.floor(r / 3)][Math.floor(c / 3)]);
  }
  const D = (r, c) => r >= 0 && c >= 0 && r < n && c < n && !!matrix[r][c];
  for (let r = 0; r < n - 1; r++) {
    for (let c = 0; c < n - 1; c++) {
      const a = D(r, c), b = D(r, c + 1), d = D(r + 1, c), e = D(r + 1, c + 1);
      if (a && e && !b && !d) f[3 * r + 2][3 * (c + 1)] = true;     // ↘ contact
      else if (b && d && !a && !e) f[3 * r + 2][3 * c + 2] = true;  // ↙ contact
    }
  }
  return f;
}

function buildQRTile(matrix, opts) {
  const curveSegments = opts.curveSegments || 10;
  const n = matrix.length;
  const mod = opts.qrSizeMM / n;

  const margin = Math.max(2.5, mod * 4); // quiet zone
  const plateW = opts.qrSizeMM + margin * 2;
  const plateH = plateW;
  const holeR = Math.max(0.6, opts.loopHoleDiameterMM / 2);
  const ringR = holeR + Math.max(1.6, opts.loopRingThicknessMM);
  const plate = roundedRectShape(0, 0, plateW, plateH, Math.min(3, margin));
  // plate as clipper paths to fuse the eyelet
  const platePts = plate.getPoints(curveSegments).map(p => [p.x, p.y]);
  let paths = ClipperLib.Clipper.PolyTreeToPaths(clipperBoolean(
    [ptsToClipper(platePts)],
    [circleClipperPath(plateW / 2, plateH + ringR * 0.55, ringR, 56, false)],
    ClipperLib.ClipType.ctUnion));
  const baseTree = clipperBoolean(
    paths, [circleClipperPath(plateW / 2, plateH + ringR * 0.55, holeR, 40, false)],
    ClipperLib.ClipType.ctDifference);
  const {shapes: baseShapes} = polyTreeToShapes(baseTree);

  const bb = shapesBounds(baseShapes);
  const dx = -bb.minX, dy = -bb.minY;
  const qdx = dx + margin, qdy = dy + margin;

  const baseGeo = new THREE.ExtrudeGeometry(
    baseShapes.map(s => translateShape(s, dx, dy)),
    {depth: opts.baseThicknessMM, bevelEnabled: false, curveSegments: 4});
  const fine = subdivideWithDiagonalBridges(matrix);
  // QR modules sit on top of the plate (base stays solid), so the back is one colour.
  const qrGeo = buildGridMesh(fine, mod / 3, opts.baseThicknessMM, opts.baseThicknessMM + opts.textRaisedHeightMM);
  qrGeo.translate(qdx, qdy, 0);

  return {
    pieces: [{geometry: baseGeo, part: 'base'}, {geometry: qrGeo, part: 'extra'}],
    width: bb.maxX - bb.minX,
    height: bb.maxY - bb.minY,
    islands: 1,
  };
}

/* ------------------------------------------------------------------ *
 * Image silhouette: threshold grid -> marching-squares contours ->
 * simplify -> keychain via the outline flow.
 * ------------------------------------------------------------------ */

/** Trace boundary loops of a binary grid (marching squares, segment chaining). */
function traceBinaryGrid(grid, w, h) {
  const at = (x, y) => (x >= 0 && y >= 0 && x < w && y < h) ? grid[y * w + x] : 0;
  const segs = new Map(); // "x,y" start -> [endX, endY]
  const addSeg = (x1, y1, x2, y2) => segs.set(x1 + ',' + y1, [x2, y2]);

  // walk cell edges; filled-left convention gives consistently wound loops
  for (let y = 0; y <= h; y++) {
    for (let x = 0; x <= w; x++) {
      const a = at(x, y), left = at(x - 1, y), up = at(x, y - 1);
      if (a !== up) { // horizontal edge between (x,y-1) and (x,y)
        if (a) addSeg(x + 1, y, x, y); else addSeg(x, y, x + 1, y);
      }
      if (a !== left) { // vertical edge
        if (a) addSeg(x, y, x, y + 1); else addSeg(x, y + 1, x, y);
      }
    }
  }

  const loops = [];
  while (segs.size) {
    const [startKey, first] = segs.entries().next().value;
    const [sx, sy] = startKey.split(',').map(Number);
    const loop = [[sx, sy]];
    segs.delete(startKey);
    let [cx, cy] = first;
    let guard = segs.size + 4;
    while ((cx !== sx || cy !== sy) && guard-- > 0) {
      loop.push([cx, cy]);
      const next = segs.get(cx + ',' + cy);
      if (!next) break;
      segs.delete(cx + ',' + cy);
      [cx, cy] = next;
    }
    if (loop.length >= 4) loops.push(loop);
  }
  return loops;
}

/** Ramer-Douglas-Peucker polyline simplification (closed polygons). */
function simplifyPolygon(pts, eps) {
  if (pts.length < 8) return pts;
  const sqEps = eps * eps;
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [i0, i1] = stack.pop();
    const [x0, y0] = pts[i0], [x1, y1] = pts[i1];
    const dx = x1 - x0, dy = y1 - y0;
    const len2 = dx * dx + dy * dy || 1e-12;
    let maxD = -1, maxI = -1;
    for (let i = i0 + 1; i < i1; i++) {
      const t = Math.max(0, Math.min(1, ((pts[i][0] - x0) * dx + (pts[i][1] - y0) * dy) / len2));
      const px = x0 + t * dx - pts[i][0], py = y0 + t * dy - pts[i][1];
      const d = px * px + py * py;
      if (d > maxD) { maxD = d; maxI = i; }
    }
    if (maxD > sqEps) {
      keep[maxI] = 1;
      stack.push([i0, maxI], [maxI, i1]);
    }
  }
  const out = [];
  for (let i = 0; i < pts.length; i++) if (keep[i]) out.push(pts[i]);
  return out;
}

/**
 * Binary grid -> silhouette polygons in mm (y flipped to y-up), keeping only
 * blobs above minAreaRatio of the largest, to drop stray noise pixels.
 */
function gridToPolygons(grid, w, h, targetWidthMM, simplifyPx) {
  const loops = traceBinaryGrid(grid, w, h)
    .map(l => simplifyPolygon(l, simplifyPx))
    .filter(l => l.length >= 3);
  if (!loops.length) return [];
  const scale = targetWidthMM / w;
  const polys = loops.map(l => l.map(([x, y]) => [x * scale, (h - y) * scale]));
  const maxArea = Math.max(...polys.map(p => Math.abs(signedArea(p))));
  return polys.filter(p => Math.abs(signedArea(p)) > maxArea * 0.004);
}

/** Keychain from arbitrary silhouette polygons (image trace). */
function buildSilhouetteTile(polys, opts) {
  const curveSegments = opts.curveSegments || 10;
  const tb = polysBounds(polys);

  let basePaths = ClipperLib.Clipper.PolyTreeToPaths(
    offsetPolygonsOutward(polys, opts.outlineWidthMM));
  const holeR = Math.max(0.6, opts.loopHoleDiameterMM / 2);
  const ringR = holeR + Math.max(1.6, opts.loopRingThicknessMM);
  const ringCy = tb.maxY + opts.outlineWidthMM + ringR * 0.35;
  const ringCx = (tb.minX + tb.maxX) / 2;
  basePaths = ClipperLib.Clipper.PolyTreeToPaths(clipperBoolean(
    basePaths, [circleClipperPath(ringCx, ringCy, ringR, 56, false)], ClipperLib.ClipType.ctUnion));
  const finalTree = clipperBoolean(
    basePaths, [circleClipperPath(ringCx, ringCy, holeR, 40, false)], ClipperLib.ClipType.ctDifference);

  const {shapes: baseShapes, islands} = polyTreeToShapes(finalTree);
  const figureShapes = polygonsToShapes(polys);
  const bb = shapesBounds(baseShapes);
  const dx = -bb.minX, dy = -bb.minY;

  const baseGeo = new THREE.ExtrudeGeometry(
    baseShapes.map(s => translateShape(s, dx, dy)),
    {depth: opts.baseThicknessMM, bevelEnabled: false, curveSegments});
  const figGeo = new THREE.ExtrudeGeometry(
    figureShapes.map(s => translateShape(s, dx, dy)),
    {depth: opts.textRaisedHeightMM, bevelEnabled: false, curveSegments});
  // Raised figure rests on the plate top; the base stays solid so the back is one colour.
  figGeo.translate(0, 0, opts.baseThicknessMM);

  return {
    pieces: [{geometry: baseGeo, part: 'base'}, {geometry: figGeo, part: 'extra'}],
    width: bb.maxX - bb.minX,
    height: bb.maxY - bb.minY,
    islands,
    missingChars: polys.missing || [],
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    pathToPolygons, signedArea, pointInPolygon, polygonsToShapes, textToShapes,
    getCapHeight, roundedRectShape, ringShape, buildKeychainTile, layoutTiles, translateShape,
    buildOutlineTile, offsetPolygonsOutward, polyTreeToShapes, shapesBounds, leftFilledAnchor,
    textRunToPolygons, linesToPolygons, polysBounds, translatePolys,
    SHAPES, SHAPE_CONTENT, buildShapeTile, buildDoubleOutlineTile, buildQRTile, buildGridMesh,
    traceBinaryGrid, simplifyPolygon, gridToPolygons, buildSilhouetteTile, buildPencilNameTile,
    teardropProfile, normalizePencilCapEnd, pencilCapPlacement, teardropAreaMM2,
    circularSegmentAreaMM2, estimatePencilVolumeMM3, buildPencilFitTestTile,
  };
}
