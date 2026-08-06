/* STL + 3MF exporters. Plain globals (THREE, fflate already loaded), no imports,
   meant to be inlined verbatim into the final single-file HTML.

   A "group" is one printable colour: {label, color, geometries}. */

/** Merge a list of THREE.BufferGeometry into one flat Float32Array of triangle
 * vertices (9 floats per triangle: v1xyz,v2xyz,v3xyz), converting indexed
 * geometries to a plain triangle soup first. */
function mergeToTriangleSoup(geometries) {
  let totalTris = 0;
  const nonIndexed = geometries.map(g => {
    const ni = g.index ? g.toNonIndexed() : g;
    totalTris += ni.attributes.position.count / 3;
    return ni;
  });
  const out = new Float32Array(totalTris * 9);
  let o = 0;
  for (const g of nonIndexed) {
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      out[o++] = pos.getX(i);
      out[o++] = pos.getY(i);
      out[o++] = pos.getZ(i);
    }
  }
  return out;
}

function faceNormal(ax, ay, az, bx, by, bz, cx, cy, cz) {
  const ux = bx - ax, uy = by - ay, uz = bz - az;
  const vx = cx - ax, vy = cy - ay, vz = cz - az;
  const nx = uy * vz - uz * vy;
  const ny = uz * vx - ux * vz;
  const nz = ux * vy - uy * vx;
  const len = Math.hypot(nx, ny, nz) || 1;
  return [nx / len, ny / len, nz / len];
}

/** Build a binary STL file (universal slicer format) from a list of geometries.
 * STL has no vertex table by design, so it is always a triangle soup; slicers
 * weld it on import. */
function buildBinarySTL(geometries) {
  const soup = mergeToTriangleSoup(geometries);
  const triCount = soup.length / 9;
  const buffer = new ArrayBuffer(84 + triCount * 50);
  const view = new DataView(buffer);
  const header = 'Creador de Llaveros - archivo generado localmente';
  for (let i = 0; i < 80; i++) view.setUint8(i, i < header.length ? header.charCodeAt(i) : 0);
  view.setUint32(80, triCount, true);

  let o = 84;
  for (let t = 0; t < triCount; t++) {
    const b = t * 9;
    const ax = soup[b], ay = soup[b + 1], az = soup[b + 2];
    const bx = soup[b + 3], by = soup[b + 4], bz = soup[b + 5];
    const cx = soup[b + 6], cy = soup[b + 7], cz = soup[b + 8];
    const n = faceNormal(ax, ay, az, bx, by, bz, cx, cy, cz);
    view.setFloat32(o, n[0], true); o += 4;
    view.setFloat32(o, n[1], true); o += 4;
    view.setFloat32(o, n[2], true); o += 4;
    const vs = [ax, ay, az, bx, by, bz, cx, cy, cz];
    for (let k = 0; k < 9; k++) { view.setFloat32(o, vs[k], true); o += 4; }
    view.setUint16(o, 0, true); o += 2;
  }
  return new Uint8Array(buffer);
}

function escapeXmlAttr(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;'}[c]));
}

/** #rrggbb -> #RRGGBBFF as required by the 3MF displaycolor attribute. */
function toDisplayColor(hex) {
  let h = String(hex || '#cccccc').replace('#', '').trim();
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  if (h.length === 6) h += 'FF';
  return '#' + h.toUpperCase();
}

// 0.1 micron is far below printer resolution; trimming precision here both
// shrinks the file and gives welding a stable key to match on.
const round4 = n => Math.round(n * 10000) / 10000;

/**
 * Convert geometries into an indexed 3MF <mesh>, welding coincident vertices.
 *
 * This welding step is not cosmetic. Emitting three fresh vertices per triangle
 * produces a mesh where no two faces share an index, so slicers report every
 * single edge as an "open edge" and offer to repair the model. Sharing indices
 * makes the solid genuinely closed in the eyes of a slicer.
 */
function geometriesToIndexedMesh(geometries) {
  const soup = mergeToTriangleSoup(geometries);
  const triCount = soup.length / 9;

  const vertsXml = [];
  const trisXml = [];
  const index = new Map();
  let nextIndex = 0;
  let degenerate = 0;

  for (let t = 0; t < triCount; t++) {
    const tri = [];
    for (let k = 0; k < 3; k++) {
      const b = t * 9 + k * 3;
      const x = round4(soup[b]), y = round4(soup[b + 1]), z = round4(soup[b + 2]);
      const key = x + ',' + y + ',' + z;
      let vi = index.get(key);
      if (vi === undefined) {
        vi = nextIndex++;
        index.set(key, vi);
        vertsXml.push('<vertex x="' + x + '" y="' + y + '" z="' + z + '"/>');
      }
      tri.push(vi);
    }
    // After welding, a triangle whose corners collapsed onto each other has zero
    // area and only adds a spurious edge; drop it.
    if (tri[0] === tri[1] || tri[1] === tri[2] || tri[0] === tri[2]) { degenerate++; continue; }
    trisXml.push('<triangle v1="' + tri[0] + '" v2="' + tri[1] + '" v3="' + tri[2] + '"/>');
  }

  return {
    verticesXml: vertsXml.join(''),
    trianglesXml: trisXml.join(''),
    vertexCount: nextIndex,
    triangleCount: trisXml.length,
    degenerate,
  };
}

/**
 * Build a 3MF package.
 *
 * Structure: one <object> per colour, then a single container object that
 * references them as <components>, and one build item pointing at the
 * container. Slicers show that as ONE object made of several parts, so the
 * plate moves as a unit (the text can never drift off its base) while each
 * part still carries its own material and can be assigned a filament.
 */
function build3MF(groups) {
  const basesXml = groups.map(g =>
    '<base name="' + escapeXmlAttr(g.label) + '" displaycolor="' + toDisplayColor(g.color) + '"/>').join('');

  const FIRST_ID = 2;
  const objectsXml = [];
  const componentsXml = [];
  const stats = [];

  groups.forEach((group, gi) => {
    const mesh = geometriesToIndexedMesh(group.geometries);
    stats.push(mesh);
    const id = FIRST_ID + gi;
    objectsXml.push(
      '    <object id="' + id + '" type="model" name="' + escapeXmlAttr(group.label) + '" pid="1" pindex="' + gi + '">\n' +
      '      <mesh>\n' +
      '        <vertices>' + mesh.verticesXml + '</vertices>\n' +
      '        <triangles>' + mesh.trianglesXml + '</triangles>\n' +
      '      </mesh>\n' +
      '    </object>');
    componentsXml.push('<component objectid="' + id + '"/>');
  });

  const containerId = FIRST_ID + groups.length;

  /* layoutTiles coloca las filas 2+ en Y negativa. Sin transform, el <item> dejaba
     mas de media placa en coordenadas negativas y el laminador la mostraba fuera
     de la cama. Se traslada el conjunto para que su esquina minima quede en el
     origen, igual de intencionado que el centrado que ya hace buildBambu3MF. */
  let minX = Infinity, minY = Infinity, minZ = Infinity;
  groups.forEach(g => g.geometries.forEach(geo => {
    const pos = geo.getAttribute('position');
    for (let i = 0; i < pos.count; i++) {
      if (pos.getX(i) < minX) minX = pos.getX(i);
      if (pos.getY(i) < minY) minY = pos.getY(i);
      if (pos.getZ(i) < minZ) minZ = pos.getZ(i);
    }
  }));
  if (!isFinite(minX)) { minX = 0; minY = 0; minZ = 0; }
  const originShift = round4(-minX) + ' ' + round4(-minY) + ' ' + round4(-minZ);

  const modelXml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<model unit="millimeter" xml:lang="en-US" xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02">\n' +
    '  <resources>\n' +
    '    <basematerials id="1">' + basesXml + '</basematerials>\n' +
    objectsXml.join('\n') + '\n' +
    '    <object id="' + containerId + '" type="model" name="Llaveros">\n' +
    '      <components>' + componentsXml.join('') + '</components>\n' +
    '    </object>\n' +
    '  </resources>\n' +
    '  <build>\n' +
    '    <item objectid="' + containerId + '" transform="1 0 0 0 1 0 0 0 1 ' + originShift + '"/>\n' +
    '  </build>\n' +
    '</model>\n';

  const contentTypesXml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">\n' +
    '  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>\n' +
    '  <Default Extension="model" ContentType="application/vnd.ms-package.3dmanufacturing-3dmodel+xml"/>\n' +
    '</Types>\n';

  const relsXml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">\n' +
    '  <Relationship Id="rel0" Target="/3D/3dmodel.model" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel"/>\n' +
    '</Relationships>\n';

  const bytes = fflate.zipSync({
    '[Content_Types].xml': fflate.strToU8(contentTypesXml),
    '_rels/.rels': fflate.strToU8(relsXml),
    '3D/3dmodel.model': fflate.strToU8(modelXml),
  }, {level: 6});
  bytes.__stats = stats;
  return bytes;
}

/* ------------------------------------------------------------------ *
 * Bambu Studio project flavour.
 *
 * Bambu Studio IGNORES the core-spec <basematerials>/pindex mechanism, so a
 * standards-only 3MF opens there as one plain object in a single colour. In
 * Bambu's own project format the filament assignment lives in a separate part,
 * Metadata/model_settings.config: one <part> per solid, each carrying
 * <metadata key="extruder" value="N"/>. Geometry goes in a production-extension
 * sub-file (3D/Objects/object_1.model) referenced from the root by p:path —
 * the same layout Bambu itself writes (verified against a real Bambu export).
 * ------------------------------------------------------------------ */

/** #rrggbb -> #RRGGBB (6-digit, the form Bambu's filament_colour uses). */
function toHex6(hex) {
  let h = String(hex || '#cccccc').replace('#', '').trim();
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  return '#' + h.slice(0, 6).toUpperCase();
}

/**
 * Patch a Bambu project_settings.config template so each filament slot carries
 * the colour of its group. The template is a full settings dump from a real
 * Bambu export; per-filament values live in top-level arrays all sharing the
 * same length, so when more slots are needed than the template has, every
 * such array is extended by repeating its last entry.
 */
/**
 * Quality tuning forced onto the exported Bambu profile so every downloaded
 * 3MF is already dialled in for the best flat-top finish at the 0.20mm Standard
 * layer height — the user prints straight away, no slicer tweaking. Values are
 * researched against the Bambu wiki, the BambuStudio PrintConfig.cpp source
 * (exact enum tokens + defaults) and community best practice for flat, small,
 * two-colour raised-text keychains on an A1 (0.4 nozzle, PLA, textured PEI).
 * Enum tokens are the serialized values BambuStudio expects, NOT UI labels.
 */
const QUALITY_OVERRIDES = {
  // ---- Ironing: the single biggest win for the flat top (base was "no ironing") ----
  ironing_type: 'top',          // iron every top face: base plane AND letter tops (enum: no ironing|top|topmost|solid)
  ironing_flow: '12%',          // was 10% — fills the gaps between iron lines without over-extruding into blobs
  ironing_spacing: '0.1',       // was 0.15 — passes overlap below nozzle width, re-ironing the same area = glossier

  // ---- Top surface: cleaner, no infill telegraphing through the show face ----
  top_surface_pattern: 'monotonic',  // was monotonicline — propagates monotonic order to sub-layers (BambuStudio #1953)
  top_one_wall_type: 'not apply',    // was 'all top' — keep 2 walls on thin letter tops so they stay solid (no pinholes)

  // ---- Walls / thin script strokes ----
  wall_generator: 'arachne',    // was classic — variable-width beads render thin script strokes classic would drop
  min_bead_width: '65%',        // was 85% — let thin strokes print near their true width instead of being fattened
  precise_outer_wall: '1',      // was 0 — exact one-nozzle outer wall = sharper letters + more consistent layers

  // ---- Speed: crisp curved letters (the A1 whips small loops at 200 mm/s) ----
  outer_wall_speed: '80',       // was 200 — slow the visible outer walls so curves stay clean and round

  // ---- Seam: hide the scar the user can see on the curved letters ----
  seam_slope_type: 'external',  // was none — smart scarf (conditional stays on) ramps the seam on long smooth outlines

  // ---- Structure: sturdier keyring loop + firmer base under the ironed top ----
  sparse_infill_density: '25%', // was 15%
};

/**
 * Pencil-name process: start from Bambu's installed
 * `0.16mm High Quality @BBL A1` process and add only the structural settings
 * that this horizontal, support-free tunnel needs. The official preset uses
 * 60 mm/s outer walls, 150 mm/s inner walls, 4k/2k acceleration and gyroid.
 * The bridge/overhang limits below protect the two 45-degree roof facets and
 * three walls give the pencil tunnel useful wear resistance.
 *
 * Calibration reference (hole compensation and chamfer sensitivity):
 * https://wiki.bambulab.com/en/software/bambu-studio/xy-hole-contour-compensation
 */
const PENCIL_QUALITY_OVERRIDES = {
  layer_height: '0.16',
  initial_layer_print_height: '0.2',
  default_acceleration: '4000',
  outer_wall_acceleration: '2000',
  outer_wall_speed: '60',
  inner_wall_speed: '150',
  internal_solid_infill_speed: '200',
  sparse_infill_pattern: 'gyroid',
  sparse_infill_speed: '200',
  top_surface_speed: '150',
  gap_infill_speed: '250',
  bridge_speed: '25',
  wall_loops: '3',
  top_shell_layers: '6',
  bottom_shell_layers: '5',
  enable_support: '0',
  overhang_2_4_speed: '35',
  overhang_3_4_speed: '25',
  overhang_4_4_speed: '15',
};

/** Set cfg[key] to `val`, preserving the template's shape: per-extruder arrays
 * stay arrays (every slot gets the value), scalars stay scalar strings. */
function setCfgValue(cfg, key, val) {
  const cur = cfg[key];
  if (Array.isArray(cur)) cfg[key] = cur.length ? cur.map(() => String(val)) : [String(val)];
  else cfg[key] = String(val);
}

function patchProjectSettings(template, groups, options = {}) {
  const cfg = JSON.parse(JSON.stringify(template));
  const origN = Array.isArray(cfg.filament_colour) ? cfg.filament_colour.length : 0;
  if (!origN) return null;
  const n = groups.length;

  if (n > origN) {
    for (const [k, v] of Object.entries(cfg)) {
      if (Array.isArray(v) && v.length === origN) {
        while (v.length < n) v.push(v[v.length - 1]);
      }
    }
  }
  groups.forEach((g, i) => { cfg.filament_colour[i] = toHex6(g.color); });

  const pencilMode = options.productType === 'pencil';
  const overrides = pencilMode
    ? {...QUALITY_OVERRIDES, ...PENCIL_QUALITY_OVERRIDES}
    : QUALITY_OVERRIDES;

  // Name the official preset that actually underpins the embedded values.
  if (pencilMode) cfg.print_settings_id = '0.16mm High Quality @BBL A1';

  // Force the finish-quality tuning last, so it always wins over the template.
  for (const [k, v] of Object.entries(overrides)) setCfgValue(cfg, k, v);

  // Declare those overrides as "modified vs the system preset". WITHOUT this,
  // Bambu Studio's loader (update_non_diff_values_to_base_config in Preset.cpp)
  // resets every key that differs from the named system preset
  // "0.20mm Standard @BBL A1" back to the system default and then re-selects the
  // clean preset — so the embedded tuning was silently dropped on open (ironing
  // off, classic walls) even though it was present in the file. Every override is
  // a print/process key, so all go in slot 0 (semicolon-separated); the filament
  // and printer slots stay empty. Array length (num_filaments + 2) and slot layout
  // mirror what a real Bambu "modified system preset" project export writes.
  const changedKeys = Object.keys(overrides).join(';');
  const numFil = cfg.filament_colour.length;
  cfg.different_settings_to_system = [changedKeys].concat(new Array(numFil + 1).fill(''));

  return JSON.stringify(cfg);
}

function buildBambu3MF(groups, projectTemplate, options = {}) {
  const PROD_NS = 'http://schemas.microsoft.com/3dmanufacturing/production/2015/06';

  // deterministic pseudo-UUIDs (no randomness needed, only uniqueness in-file)
  const uuid = n => '0001' + String(n).padStart(4, '0') +
    '-0000-4000-8000-' + String(n).padStart(12, '0');

  // ---- geometry: weld each group, then centre everything on a COMMON origin
  const meshes = groups.map(g => geometriesToIndexedMesh(g.geometries));

  // combined bounding box straight from the emitted vertex XML would be
  // wasteful; recompute from the raw soups instead
  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
  const soups = groups.map(g => mergeToTriangleSoup(g.geometries));
  for (const soup of soups) {
    for (let i = 0; i < soup.length; i += 3) {
      if (soup[i] < minX) minX = soup[i];
      if (soup[i] > maxX) maxX = soup[i];
      if (soup[i + 1] < minY) minY = soup[i + 1];
      if (soup[i + 1] > maxY) maxY = soup[i + 1];
      if (soup[i + 2] < minZ) minZ = soup[i + 2];
      if (soup[i + 2] > maxZ) maxZ = soup[i + 2];
    }
  }
  const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2, cz = (minZ + maxZ) / 2;
  const zHalf = (maxZ - minZ) / 2;

  // ---- sub-model file: one object per colour, vertices centred like Bambu's
  const objectsXml = [];
  const faceCounts = [];
  groups.forEach((group, gi) => {
    const soup = soups[gi];
    const triCount = soup.length / 9;
    const verts = [];
    const tris = [];
    const index = new Map();
    let next = 0, skipped = 0;
    for (let t = 0; t < triCount; t++) {
      const tri = [];
      for (let k = 0; k < 3; k++) {
        const b = t * 9 + k * 3;
        const x = round4(soup[b] - cx), y = round4(soup[b + 1] - cy), z = round4(soup[b + 2] - cz);
        const key = x + ',' + y + ',' + z;
        let vi = index.get(key);
        if (vi === undefined) {
          vi = next++;
          index.set(key, vi);
          verts.push('<vertex x="' + x + '" y="' + y + '" z="' + z + '"/>');
        }
        tri.push(vi);
      }
      if (tri[0] === tri[1] || tri[1] === tri[2] || tri[0] === tri[2]) { skipped++; continue; }
      tris.push('<triangle v1="' + tri[0] + '" v2="' + tri[1] + '" v3="' + tri[2] + '"/>');
    }
    faceCounts.push(tris.length);
    objectsXml.push(
      '  <object id="' + (gi + 1) + '" p:UUID="' + uuid(gi + 1) + '" type="model">\n' +
      '   <mesh>\n' +
      '    <vertices>' + verts.join('') + '</vertices>\n' +
      '    <triangles>' + tris.join('') + '</triangles>\n' +
      '   </mesh>\n' +
      '  </object>');
  });

  const containerId = groups.length + 1;
  const header =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<model unit="millimeter" xml:lang="en-US"' +
    ' xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02"' +
    ' xmlns:BambuStudio="http://schemas.bambulab.com/package/2021"' +
    ' xmlns:p="' + PROD_NS + '" requiredextensions="p">\n' +
    ' <metadata name="BambuStudio:3mfVersion">1</metadata>\n';

  const subModelXml = header +
    ' <resources>\n' + objectsXml.join('\n') + '\n </resources>\n' +
    ' <build/>\n</model>\n';

  const componentsXml = groups.map((g, gi) =>
    '    <component p:path="/3D/Objects/object_1.model" objectid="' + (gi + 1) +
    '" p:UUID="' + uuid(100 + gi) + '" transform="1 0 0 0 1 0 0 0 1 0 0 0"/>').join('\n');

  // Bambu Studio's loader gates project_settings on this metadata: only files
  // announcing a BambuStudio Application are treated as full BBL projects
  // (otherwise it imports geometry + object config but skips the presets).
  const rootXml = header +
    // Keep this at a released version accepted by the current stable loader.
    // Advertising a future/beta version makes Bambu Studio reject the whole
    // project with return_code -24 before it even inspects the geometry.
    ' <metadata name="Application">BambuStudio-02.07.01.62</metadata>\n' +
    ' <resources>\n' +
    '  <object id="' + containerId + '" p:UUID="' + uuid(containerId) + '" type="model">\n' +
    '   <components>\n' + componentsXml + '\n   </components>\n' +
    '  </object>\n' +
    ' </resources>\n' +
    ' <build p:UUID="' + uuid(900) + '">\n' +
    '  <item objectid="' + containerId + '" p:UUID="' + uuid(901) +
    '" transform="1 0 0 0 1 0 0 0 1 128 128 ' + round4(zHalf) + '" printable="1"/>\n' +
    ' </build>\n</model>\n';

  // ---- model_settings.config: this is the part Bambu actually reads for
  // filament assignment. Extruders are 1-based; Bambu supports up to 16.
  const partsXml = groups.map((g, gi) =>
    '    <part id="' + (gi + 1) + '" subtype="normal_part">\n' +
    '      <metadata key="name" value="' + escapeXmlAttr(g.label) + '"/>\n' +
    '      <metadata key="extruder" value="' + ((gi % 16) + 1) + '"/>\n' +
    '      <metadata key="matrix" value="1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 1"/>\n' +
    '      <mesh_stat face_count="' + faceCounts[gi] +
    '" edges_fixed="0" degenerate_facets="0" facets_removed="0" facets_reversed="0" backwards_edges="0"/>\n' +
    '    </part>').join('\n');

  const objectName = options.productType === 'pencil' ? 'Nombres para lapiz' : 'Llaveros';
  const modelSettings =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<config>\n' +
    '  <object id="' + containerId + '">\n' +
    '    <metadata key="name" value="' + objectName + '"/>\n' +
    '    <metadata key="extruder" value="1"/>\n' +
    '    <metadata face_count="' + faceCounts.reduce((a, b) => a + b, 0) + '"/>\n' +
    partsXml + '\n' +
    '  </object>\n' +
    '  <plate>\n' +
    '    <metadata key="plater_id" value="1"/>\n' +
    '    <metadata key="plater_name" value="Plate 1"/>\n' +
    '    <metadata key="locked" value="false"/>\n' +
    '    <model_instance>\n' +
    '      <metadata key="object_id" value="' + containerId + '"/>\n' +
    '      <metadata key="instance_id" value="0"/>\n' +
    '      <metadata key="identify_id" value="463"/>\n' +
    '    </model_instance>\n' +
    '  </plate>\n' +
    '  <assemble>\n' +
    '   <assemble_item object_id="' + containerId + '" instance_id="0"' +
    ' transform="1 0 0 0 1 0 0 0 1 128 128 ' + round4(zHalf) + '" offset="0 0 0" />\n' +
    '  </assemble>\n' +
    '</config>\n';

  const contentTypesXml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">\n' +
    ' <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>\n' +
    ' <Default Extension="model" ContentType="application/vnd.ms-package.3dmanufacturing-3dmodel+xml"/>\n' +
    '</Types>\n';

  const relsXml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">\n' +
    ' <Relationship Target="/3D/3dmodel.model" Id="rel-1" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel"/>\n' +
    '</Relationships>\n';

  const subRelsXml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">\n' +
    ' <Relationship Target="/3D/Objects/object_1.model" Id="rel-1" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel"/>\n' +
    '</Relationships>\n';

  const pkg = {
    '[Content_Types].xml': fflate.strToU8(contentTypesXml),
    '_rels/.rels': fflate.strToU8(relsXml),
    '3D/3dmodel.model': fflate.strToU8(rootXml),
    '3D/_rels/3dmodel.model.rels': fflate.strToU8(subRelsXml),
    '3D/Objects/object_1.model': fflate.strToU8(subModelXml),
    'Metadata/model_settings.config': fflate.strToU8(modelSettings),
  };
  if (projectTemplate) {
    const patched = patchProjectSettings(projectTemplate, groups, options);
    if (patched) pkg['Metadata/project_settings.config'] = fflate.strToU8(patched);
  }
  return fflate.zipSync(pkg, {level: 6});
}

function safeFileName(s) {
  return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '_').replace(/^_+|_+$/g, '') || 'pieza';
}

/** One STL per colour, bundled in a zip. All parts share the same origin, so
 * loading them together in a slicer keeps them aligned. */
function buildSTLZip(groups) {
  const files = {};
  groups.forEach((g, i) => {
    const name = String(i + 1).padStart(2, '0') + '-' + safeFileName(g.label) + '.stl';
    files[name] = buildBinarySTL(g.geometries);
  });
  const readme =
    'Cada archivo STL es un color distinto.\r\n' +
    'Todos comparten el mismo origen: si los cargas juntos en el laminador,\r\n' +
    'quedan alineados solos. No los muevas por separado.\r\n\r\n' +
    groups.map((g, i) =>
      String(i + 1).padStart(2, '0') + '-' + safeFileName(g.label) + '.stl  ->  ' + g.color).join('\r\n') + '\r\n';
  files['LEEME.txt'] = fflate.strToU8(readme);
  return fflate.zipSync(files, {level: 6});
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    mergeToTriangleSoup, faceNormal, buildBinarySTL, build3MF, buildSTLZip,
    toDisplayColor, safeFileName, geometriesToIndexedMesh, buildBambu3MF,
    toHex6, patchProjectSettings,
  };
}
