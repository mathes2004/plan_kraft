/* Plan Kraft — interactive waterproofing villa. */
const mount = document.getElementById('roof-scene');
if (mount) boot().catch(() => window.dispatchEvent(new CustomEvent('roof:error')));

async function boot() {
  const [T, kit] = await Promise.all([import('./assets/three.module.min.js'), import('./render-kit.js')]);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const compact = window.matchMedia('(max-width: 700px)').matches;
  const studio = kit.createStudioRenderer(T, mount, {
    compact, exposure: 1.01,
    label: 'Interactive 3D home demonstrating roof waterproofing. Drag or use arrow keys to rotate.'
  });
  const {renderer, scene, canvas} = studio;
  const camera = new T.OrthographicCamera(-4, 4, 3.5, -3.5, .1, 50);
  camera.position.set(8, 6.87, 9);
  camera.lookAt(0, 1.67, 0);
  const villa = new T.Group();
  scene.add(villa);
  scene.add(kit.createContactShadow(T, {width: 7.55, depth: 6.32, opacity: .16}));
  const concreteTexture = kit.createSurfaceTexture(T, 'concrete');
  const woodTexture = kit.createSurfaceTexture(T, 'wood');
  const roofTexture = kit.createSurfaceTexture(T, 'roof');

  const material = (color, more = {}) => new T.MeshStandardMaterial({ color, roughness: .8, ...more });
  const cream = material(0xf4f6f7, {bumpMap: concreteTexture, bumpScale: .012});
  const edge = material(0xcdd9e1, {bumpMap: concreteTexture, bumpScale: .012});
  const white = material(0xfbfcfd, {bumpMap: concreteTexture, bumpScale: .009});
  const charcoal = material(0x003754, { roughness: .55 });
  const wood = material(0xad7f4d, {roughness: .66, map: woodTexture, bumpMap: woodTexture, bumpScale: .021});
  const floor = material(0xe6edf2);
  const darkGreen = material(0x004b73);
  const glass = new T.MeshPhysicalMaterial({color: 0x285a76, roughness: .055, metalness: .15, transparent: true, opacity: .43, clearcoat: 1, clearcoatRoughness: .06, envMapIntensity: 1.8, side: T.DoubleSide, depthWrite: false});
  const interior = material(0xdbc3a0);
  const leaf = material(0x407950, { side: T.DoubleSide });
  const leafLight = material(0x6b9355, { side: T.DoubleSide });
  const stone = material(0xdce1e5);
  const roofConcrete = material(0x9eacb5, {roughness: .90, bumpMap: roofTexture, bumpScale: .022});
  const reusableBox = new T.BoxGeometry(1, 1, 1);
  const beveledGeometries = new Map();
  function box(w, h, d, mat, x, y, z, parent = villa, shadows = true) {
    const beveled = shadows && Math.min(w, h, d) > .085;
    let geometry = reusableBox;
    if (beveled) {
      const key = `${w}/${h}/${d}`;
      if (!beveledGeometries.has(key)) beveledGeometries.set(key, kit.createBeveledBox(T, w, h, d, .025));
      geometry = beveledGeometries.get(key);
    }
    const mesh = new T.Mesh(geometry, mat);
    if (!beveled) mesh.scale.set(w, h, d);
    mesh.position.set(x, y, z);
    mesh.castShadow = shadows;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  function cylinder(rTop, rBottom, height, mat, x, y, z, parent = villa, segments = 12) {
    const mesh = new T.Mesh(new T.CylinderGeometry(rTop, rBottom, height, segments), mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  function rod(start, end, radius, mat, parent = villa) {
    const a = new T.Vector3(...start), b = new T.Vector3(...end);
    const delta = b.clone().sub(a);
    const mesh = new T.Mesh(new T.CylinderGeometry(radius, radius, delta.length(), 7), mat);
    mesh.position.copy(a.add(b).multiplyScalar(.5));
    mesh.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), delta.normalize());
    mesh.castShadow = true;
    parent.add(mesh);
    return mesh;
  }
  function roundedPlot(width, depth, thickness, mat, y) {
    const r = .26, x = -width / 2, z = -depth / 2;
    const shape = new T.Shape();
    shape.moveTo(x + r, z);
    shape.lineTo(x + width - r, z);
    shape.quadraticCurveTo(x + width, z, x + width, z + r);
    shape.lineTo(x + width, z + depth - r);
    shape.quadraticCurveTo(x + width, z + depth, x + width - r, z + depth);
    shape.lineTo(x + r, z + depth);
    shape.quadraticCurveTo(x, z + depth, x, z + depth - r);
    shape.lineTo(x, z + r);
    shape.quadraticCurveTo(x, z, x + r, z);
    const geometry = new T.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: .06, bevelThickness: .04, curveSegments: 8 });
    geometry.rotateX(-Math.PI / 2);
    const mesh = new T.Mesh(geometry, mat);
    mesh.position.y = y;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    villa.add(mesh);
  }

  // A floating landscaped parcel, with a warm stone terrace.
  roundedPlot(6.25, 5.05, .23, darkGreen, -.12);
  roundedPlot(6.15, 4.95, .035, floor, .13);
  box(5.05, .07, 4.24, stone, 0, .21, .1);
  box(4.42, .15, 3.55, edge, 0, .32, 0);
  box(4.12, .08, 3.28, interior, 0, .435, 0);
  // Ground-floor structural shell; open glazed facade shows the interior.
  box(4.12, 1.52, .17, cream, 0, 1.18, -1.54);
  box(.16, 1.52, 3.16, cream, -1.98, 1.18, 0);
  box(.16, 1.52, 3.16, cream, 1.98, 1.18, 0);
  box(4.38, .18, 3.77, white, 0, 2.01, .12);
  box(.14, 1.56, .18, cream, -1.94, 1.22, 1.54);
  box(.18, 1.56, .18, cream, .99, 1.22, 1.54);
  box(.18, 1.56, .18, cream, 1.94, 1.22, 1.54);
  // Interior warmth, sofas, and a low coffee table behind the glass.
  box(2.7, .06, 1.02, material(0xe8d8b7), -.50, .49, .30);
  box(1.42, .29, .56, material(0xd3c9ae), -.77, .69, -.65);
  box(1.42, .31, .12, interior, -.77, .90, -.91);
  box(.88, .12, .44, wood, -.75, .68, .36);
  box(.065, .2, .065, charcoal, -.99, .56, .46);
  box(.065, .2, .065, charcoal, -.50, .56, .46);
  box(.58, 1.25, .075, wood, 1.47, 1.08, 1.64);
  box(.025, .20, .06, material(0xd7c27d, { metalness: .6, roughness: .35 }), 1.64, 1.11, 1.71);
  for (let i = 0; i < 7; i++) box(.011, 1.20, .006, material(0x805e39), 1.23 + i * .077, 1.08, 1.685);
  function windowPane(x, y, z, w, h, horizontal = false, parent = villa) {
    const pane = box(w, h, .028, glass, x, y, z, parent, false);
    box(w + .06, .042, .072, charcoal, x, y + h / 2, z + .013, parent);
    box(w + .06, .042, .072, charcoal, x, y - h / 2, z + .013, parent);
    box(.042, h, .072, charcoal, x - w / 2, y, z + .013, parent);
    box(.042, h, .072, charcoal, x + w / 2, y, z + .013, parent);
    box(.035, h, .072, charcoal, x, y, z + .013, parent);
    if (horizontal) box(w, .035, .072, charcoal, x, y + .12, z + .013, parent);
    return pane;
  }
  windowPane(-.48, 1.16, 1.595, 2.78, 1.34);
  const warmGlow = new T.MeshBasicMaterial({color: 0xffd5a0});
  box(2.51, .021, .05, warmGlow, -.47, 1.91, 1.41, villa, false);
  const lowerGlow = new T.PointLight(0xffbf78, .30, 2.7, 2);
  lowerGlow.position.set(-.65, 1.56, .65); villa.add(lowerGlow);
  box(.58, .50, .035, charcoal, -1.02, 1.31, -1.429);
  box(.48, .39, .008, material(0xb6c4b9), -1.02, 1.31, -1.405);
  // Second floor, offset to form a deep, slatted balcony.
  box(4.05, 1.45, .17, cream, 0, 2.83, -1.53);
  box(.16, 1.45, 2.94, cream, -1.98, 2.83, -.09);
  box(.16, 1.45, 2.94, cream, 1.98, 2.83, -.09);
  box(1.20, 1.45, .18, cream, 1.42, 2.83, 1.36);
  box(.13, 1.45, .18, cream, -1.93, 2.83, 1.36);
  box(3.02, .08, 2.55, interior, -.47, 2.12, -.03);
  box(1.40, .28, .75, material(0xe7dfc8), -.65, 2.31, -.49);
  box(1.40, .34, .09, wood, -.65, 2.50, -.92);
  windowPane(-.59, 2.83, 1.397, 2.46, 1.28);
  box(2.26, .021, .045, warmGlow, -.59, 3.52, 1.25, villa, false);
  const upperGlow = new T.PointLight(0xffc584, .25, 2.6, 2);
  upperGlow.position.set(-.6, 3.22, .5); villa.add(upperGlow);
  windowPane(1.40, 2.88, 1.463, .58, .98, true);
  box(4.32, .13, .60, wood, 0, 2.105, 1.63);
  for (let i = 0; i < 22; i++) box(.015, .007, .59, material(0x936c41), -2.05 + i * .193, 2.174, 1.63, villa, false);
  rod([-2.09, 2.70, 1.94], [2.09, 2.70, 1.94], .025, charcoal);
  rod([-2.09, 2.30, 1.94], [2.09, 2.30, 1.94], .016, charcoal);
  for (let i = 0; i < 12; i++) rod([-2.06 + i * .376, 2.17, 1.94], [-2.06 + i * .376, 2.70, 1.94], .019, charcoal);
  rod([-2.09, 2.70, 1.36], [-2.09, 2.70, 1.94], .025, charcoal);
  rod([2.09, 2.70, 1.36], [2.09, 2.70, 1.94], .025, charcoal);
  // Broad concrete roof and crisp parapets.
  box(4.38, .18, 3.47, white, 0, 3.65, -.02);
  box(4.05, .05, 3.13, roofConcrete, 0, 3.761, -.02);
  box(4.38, .22, .13, cream, 0, 3.87, -1.71);
  box(.13, .22, 3.42, cream, -2.125, 3.87, -.02);
  box(.13, .22, 3.42, cream, 2.125, 3.87, -.02);
  box(4.25, .13, .13, cream, 0, 3.825, 1.67);
  // A small projecting frame and side louvres bring the facade to life.
  for (let i = 0; i < 8; i++) box(.09, 1.55, .10, wood, 2.08, 2.82, -.93 + i * .22);
  box(.46, .07, .92, stone, 2.19, .275, 1.35);
  box(.68, .07, .39, stone, 1.54, .275, 2.03);
  box(.68, .07, .39, stone, 1.54, .22, 2.39);

  function shrub(x, y, z, scale = 1, parent = villa) {
    cylinder(.13 * scale, .11 * scale, .21 * scale, stone, x, y + .10 * scale, z, parent);
    for (let i = 0; i < 6; i++) {
      const a = i * Math.PI / 3;
      const blade = new T.Mesh(new T.SphereGeometry(.12, 7, 5), i % 2 ? leaf : leafLight);
      blade.scale.set(.47 * scale, 1.7 * scale, .68 * scale);
      blade.rotation.set(Math.cos(a) * .6, a, Math.sin(a) * .6);
      blade.position.set(x + Math.sin(a) * .065 * scale, y + .31 * scale, z + Math.cos(a) * .065 * scale);
      blade.castShadow = true;
      parent.add(blade);
    }
  }
  shrub(-1.79, 2.18, 1.64, .86);
  shrub(1.78, 2.18, 1.64, .86);
  shrub(-1.78, 3.82, -1.32, .80);
  shrub(1.77, 3.82, -1.32, .80);
  function palm(x, z, height, size = 1) {
    cylinder(.20, .25, .24, stone, x, .33, z);
    rod([x, .42, z], [x + .11, height, z - .06], .061 * size, material(0x9b825c));
    const top = new T.Vector3(x + .11, height, z - .06);
    const crown = new T.Mesh(new T.SphereGeometry(.135 * size, 8, 6), leaf);
    crown.position.copy(top); villa.add(crown);
    for (let k = 0; k < 9; k++) {
      const angle = k * Math.PI * 2 / 9;
      const length = (.62 + (k % 3) * .10) * size;
      const verts = [], inds = [];
      for (let j = 0; j <= 8; j++) {
        const t = j / 8;
        const breadth = Math.sin(t * Math.PI) * .108 * size;
        const reach = t * length;
        const y = Math.sin(t * Math.PI) * .23 * size - t * t * .12 * size;
        verts.push(top.x + Math.cos(angle) * reach - Math.sin(angle) * breadth, top.y + y, top.z + Math.sin(angle) * reach + Math.cos(angle) * breadth);
        verts.push(top.x + Math.cos(angle) * reach + Math.sin(angle) * breadth, top.y + y, top.z + Math.sin(angle) * reach - Math.cos(angle) * breadth);
        if (j < 8) { const n = j * 2; inds.push(n, n + 1, n + 2, n + 1, n + 3, n + 2); }
      }
      const geo = new T.BufferGeometry();
      geo.setAttribute('position', new T.Float32BufferAttribute(verts, 3)); geo.setIndex(inds); geo.computeVertexNormals();
      const frond = new T.Mesh(geo, k % 2 ? leaf : leafLight);
      frond.castShadow = true; villa.add(frond);
    }
  }
  palm(2.65, -.95, 2.68, .96);
  palm(-2.65, -.88, 1.91, .79);
  shrub(-2.61, .23, 1.37, 1.45);
  shrub(2.64, .23, 1.27, 1.25);
  for (let i = 0; i < 5; i++) {
    const hedge = new T.Mesh(new T.SphereGeometry(.25, 10, 7), i % 2 ? leaf : leafLight);
    hedge.scale.set(1.0, .75, .92); hedge.position.set(-1.65 + i * .63, .43, -2.08);
    hedge.castShadow = true; villa.add(hedge);
  }
  for (let i = 0; i < 3; i++) box(.42, .035, .37, white, -.62 + i * .61, .261, 2.13);

  // Waterproof membrane and its layered system.
  const membraneMaterial = new T.MeshPhysicalMaterial({ color: 0xa8c52a, roughness: .19, metalness: .06, bumpMap: kit.createSurfaceTexture(T, 'membrane'), bumpScale: .007, transparent: true, opacity: .86, clearcoat: 1, clearcoatRoughness: .07, envMapIntensity: 1.2, side: T.DoubleSide, depthWrite: false });
  const membrane = box(3.95, .035, 3.03, membraneMaterial, 0, 3.801, -.02, villa, false);
  const foam = box(3.92, .048, 3.0, material(0xf1f6d8), 0, 3.89, -.02, villa, false);
  const bonding = box(3.92, .027, 3.0, material(0xa8c52a), 0, 3.87, -.02, villa, false);
  foam.visible = bonding.visible = false;
  const perimeterPoints = [[-1.98, 0, -1.535], [1.98, 0, -1.535], [1.98, 0, 1.495], [-1.98, 0, 1.495]].map(v => new T.Vector3(...v));
  const membraneEdge = new T.LineLoop(new T.BufferGeometry().setFromPoints(perimeterPoints), new T.LineBasicMaterial({ color: 0xb4ce37, transparent: true, opacity: .95 }));
  membraneEdge.position.y = 3.828; villa.add(membraneEdge);
  const seamMaterial = new T.LineBasicMaterial({ color: 0xe2efad, transparent: true, opacity: .34 });
  const seams = new T.Group();
  for (let i = 0; i < 4; i++) {
    const z = -1.1 + i * .72;
    const line = new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(-1.95, 0, z), new T.Vector3(1.95, 0, z)]), seamMaterial);
    seams.add(line);
  }
  seams.position.y = 3.83; villa.add(seams);
  const cracks = new T.Group(); villa.add(cracks); cracks.visible = false;
  const crackMat = material(0x566069);
  const crackPoints = [[-1.59, -.76], [-.87, -.50], [-.50, -.18], [.18, -.37], [.72, .17], [1.28, .42], [1.67, .88]];
  for (let i = 0; i < crackPoints.length - 1; i++) rod([crackPoints[i][0], 3.794, crackPoints[i][1]], [crackPoints[i + 1][0], 3.794, crackPoints[i + 1][1]], .015, crackMat, cracks);
  rod([-.50, 3.794, -.18], [-.72, 3.794, .36], .01, crackMat, cracks);
  rod([.72, 3.794, .17], [.98, 3.794, -.58], .011, crackMat, cracks);
  rod([-.72, 3.794, .36], [-1.13, 3.794, .76], .01, crackMat, cracks);

  // The solution visibly guides rain across the membrane into a corner drain.
  const waterMaterial = new T.MeshPhysicalMaterial({color: 0x27b7e4, roughness: .03, metalness: .12, transparent: true, opacity: .88, clearcoat: 1, envMapIntensity: 1.9, depthWrite: false});
  const roofFilm = box(3.85, .004, 2.94, new T.MeshPhysicalMaterial({color: 0xb5e7f3, roughness: .025, metalness: .05, transparent: true, opacity: .10, clearcoat: 1, envMapIntensity: 1.8, depthWrite: false}), 0, 3.828, -.02, villa, false);
  const runoff = new T.Group(); villa.add(runoff);
  const drainX = 1.74, drainZ = 1.38;
  box(.23, .055, .19, charcoal, 1.80, 3.82, 1.43);
  for (let i = 0; i < 4; i++) box(.014, .009, .16, edge, 1.724 + i * .05, 3.852, 1.43, villa, false);
  const pipeMaterial = material(0x416574, {metalness: .58, roughness: .27});
  rod([1.88, 3.81, 1.48], [2.23, 3.74, 1.51], .038, pipeMaterial);
  rod([2.23, 3.74, 1.51], [2.23, .48, 1.51], .038, pipeMaterial);
  rod([2.23, .48, 1.51], [2.39, .36, 1.74], .038, pipeMaterial);
  for (const y of [.85, 1.70, 2.64, 3.40]) box(.12, .048, .07, charcoal, 2.195, y, 1.51);
  const runoffCurves = [
    [-1.61, -1.16], [-.75, -1.15], [.30, -1.18], [-1.56, .17]
  ].map(([x, z]) => new T.QuadraticBezierCurve3(
    new T.Vector3(x, 3.849, z), new T.Vector3(x * .20 + .52, 3.846, z * .18 + .35), new T.Vector3(drainX, 3.855, drainZ)
  ));
  const pathMaterial = new T.LineBasicMaterial({color: 0x3ab7d8, transparent: true, opacity: .24, depthWrite: false});
  runoffCurves.forEach(curve => runoff.add(new T.Line(new T.BufferGeometry().setFromPoints(curve.getPoints(30)), pathMaterial)));
  const waterBeadGeometry = new T.SphereGeometry(.031, 8, 6);
  const flowingBeads = Array.from({length: compact ? 12 : 20}, (_, i) => {
    const bead = new T.Mesh(waterBeadGeometry, waterMaterial);
    bead.scale.set(1, .39, 2.1);
    bead.userData.curve = runoffCurves[i % runoffCurves.length];
    bead.userData.phase = i * .173 % 1;
    runoff.add(bead); return bead;
  });
  const drainBeads = Array.from({length: 10}, (_, i) => {
    const bead = new T.Mesh(waterBeadGeometry, waterMaterial);
    bead.scale.set(.85, 1.9, .85);
    bead.position.set(2.277, .5 + i * .32, 1.526);
    bead.userData.phase = i / 10;
    runoff.add(bead); return bead;
  });
  const roofDamage = new T.Group(); villa.add(roofDamage); roofDamage.visible = false;
  const dampPatch = new T.Mesh(new T.CircleGeometry(.55, 32), new T.MeshBasicMaterial({color: 0x2e7090, transparent: true, opacity: .14, depthWrite: false}));
  dampPatch.rotation.x = -Math.PI / 2;
  dampPatch.scale.set(1.55, .80, 1);
  dampPatch.position.set(-.35, 3.797, -.1); roofDamage.add(dampPatch);
  const issueMarkers = [];
  const issueMat = new T.MeshBasicMaterial({color: 0xd67b4f, transparent: true, opacity: .85, depthWrite: false});
  for (const [x, z] of [[-.5, -.18], [.72, .17]]) {
    const marker = new T.Group(); marker.position.set(x, 3.827, z);
    const ring = new T.Mesh(new T.RingGeometry(.084, .109, 24), issueMat);
    ring.rotation.x = -Math.PI / 2; marker.add(ring);
    const center = new T.Mesh(new T.SphereGeometry(.025, 8, 6), issueMat);
    center.position.y = .024; marker.add(center);
    roofDamage.add(marker); issueMarkers.push(marker);
  }
  let waterTime = 0;

  // Rain is a single inexpensive GPU line buffer; splash rings are reused.
  const maxRain = compact ? 165 : 260;
  const rainGeometry = new T.BufferGeometry();
  const rainPositions = new Float32Array(maxRain * 6);
  const drops = Array.from({ length: maxRain }, () => ({ x: (Math.random() - .5) * 6.1, y: 3.8 + Math.random() * 4.0, z: (Math.random() - .5) * 4.8, speed: 3.7 + Math.random() * 2.1 }));
  rainGeometry.setAttribute('position', new T.BufferAttribute(rainPositions, 3));
  const rain = new T.LineSegments(rainGeometry, new T.LineBasicMaterial({ color: 0x30b3df, transparent: true, opacity: .65, depthWrite: false }));
  rain.frustumCulled = false; villa.add(rain);
  const splashMat = new T.MeshBasicMaterial({ color: 0x75d6f1, transparent: true, opacity: .65, depthWrite: false, side: T.DoubleSide });
  const splashGeometry = new T.RingGeometry(.83, 1, 20);
  const splashes = Array.from({ length: compact ? 12 : 20 }, (_, i) => {
    const ring = new T.Mesh(splashGeometry, splashMat.clone());
    ring.rotation.x = -Math.PI / 2;
    ring.position.set((Math.random() - .5) * 3.8, 3.837, (Math.random() - .5) * 2.8);
    ring.scale.setScalar(.06); ring.userData.age = i / 20; villa.add(ring); return ring;
  });
  const leakGeometry = new T.SphereGeometry(.027, 7, 6);
  const leakMaterial = new T.MeshBasicMaterial({ color: 0x36bfea, transparent: true, opacity: .92 });
  const leaks = new T.Group(); villa.add(leaks); leaks.visible = false;
  const leakage = Array.from({ length: 18 }, (_, i) => {
    const droplet = new T.Mesh(leakGeometry, leakMaterial);
    droplet.scale.set(1, 2.6, 1);
    const upper = i < 11;
    droplet.position.set(-1.65 + Math.random() * 2.19, (upper ? 2.20 : .53) + Math.random() * 1.16, upper ? 1.416 : 1.617);
    droplet.userData.upper = upper; droplet.userData.speed = .46 + Math.random() * .35;
    leaks.add(droplet); return droplet;
  });
  // Persistent blue damp traces visible in the unprotected facade.
  const stains = new T.Group(); villa.add(stains); stains.visible = false;
  const stainMat = material(0x4f6f83, { transparent: true, opacity: .34, depthWrite: false });
  box(.14, .32, .009, stainMat, -.87, 3.19, 1.445, stains, false);
  box(.08, .22, .009, stainMat, .22, 3.25, 1.445, stains, false);
  box(.10, .29, .009, stainMat, -.85, 1.68, 1.655, stains, false);

  let protectedRoof = true;
  let raining = true;
  let intensity = 64;
  let layerTarget = 0;
  let layerAmount = 0;
  let onScreen = true;
  let raf = 0;
  let previous = performance.now();
  let drag = null;
  let targetYaw = -.04, targetTilt = 0;
  let viewportAspect = 1;
  function fitCamera() {
    const halfWidth = Math.max(4.13, 3.55 * viewportAspect) * (1 + layerAmount * .19);
    const halfHeight = halfWidth / viewportAspect;
    camera.left = -halfWidth; camera.right = halfWidth; camera.top = halfHeight; camera.bottom = -halfHeight;
    camera.position.y = 6.87 + layerAmount * .24;
    camera.lookAt(0, 1.67 + layerAmount * .24, 0);
    camera.updateProjectionMatrix();
  }
  villa.rotation.y = targetYaw;
  function setState(value) {
    protectedRoof = value;
    cracks.visible = !value;
    leaks.visible = !value && raining && intensity > 0;
    stains.visible = !value;
    roofDamage.visible = !value;
    membrane.visible = membraneEdge.visible = seams.visible = value;
    foam.visible = bonding.visible = value && layerTarget > 0;
    splashMat.color.set(value ? 0x75d6f1 : 0x36bfea);
    splashes.forEach(s => s.material.color.set(value ? 0x75d6f1 : 0x36bfea));
    requestRender();
  }
  function rainFrame(dt) {
    const count = Math.floor(maxRain * intensity / 100);
    if (raining && intensity > 0) waterTime += dt;
    runoff.visible = protectedRoof && raining && intensity > 0 && layerAmount < .08;
    roofFilm.visible = protectedRoof && raining && intensity > 0 && layerAmount < .08;
    flowingBeads.forEach(bead => {
      const t = (waterTime * (.20 + intensity / 240) + bead.userData.phase) % 1;
      const curve = bead.userData.curve;
      bead.position.copy(curve.getPoint(t));
      const tangent = curve.getTangent(t);
      bead.rotation.y = Math.atan2(tangent.x, tangent.z);
    });
    drainBeads.forEach(bead => { bead.position.y = 3.70 - ((waterTime * .52 + bead.userData.phase) % 1) * 3.18; });
    issueMarkers.forEach((marker, i) => { marker.scale.setScalar(1 + Math.sin(waterTime * 2.7 + i) * .10); });
    rain.visible = raining && count > 0;
    rainGeometry.setDrawRange(0, count * 2);
    for (let i = 0; i < maxRain; i++) {
      const d = drops[i];
      if (raining) d.y -= dt * d.speed;
      const hitRoof = Math.abs(d.x) < 2.12 && d.z > -1.7 && d.z < 1.67;
      const groundY = hitRoof ? (protectedRoof ? membrane.position.y + .03 : 3.8) : .24;
      if (d.y < groundY) d.y = 6.4 + Math.random() * 2.0;
      const n = i * 6;
      rainPositions[n] = d.x; rainPositions[n + 1] = d.y; rainPositions[n + 2] = d.z;
      rainPositions[n + 3] = d.x + .035; rainPositions[n + 4] = d.y + .15 + intensity * .0011; rainPositions[n + 5] = d.z - .025;
    }
    rainGeometry.attributes.position.needsUpdate = true;
    splashes.forEach((s, i) => {
      s.visible = raining && intensity > 0 && layerAmount < .10 && i < Math.ceil(intensity / 5);
      s.userData.age += dt * (1.0 + intensity / 90);
      if (s.userData.age > 1) { s.userData.age = 0; s.position.x = (Math.random() - .5) * 3.7; s.position.z = (Math.random() - .5) * 2.7; }
      s.position.y = protectedRoof ? membrane.position.y + .03 : 3.803;
      s.scale.setScalar(.025 + s.userData.age * .13);
      s.material.opacity = .65 * (1 - s.userData.age);
    });
    leakage.forEach(d => {
      if (raining && !protectedRoof) {
        d.position.y -= dt * d.userData.speed * (.4 + intensity / 80);
        if (d.position.y < (d.userData.upper ? 2.20 : .53)) d.position.y = d.userData.upper ? 3.36 : 1.81;
      }
    });
  }
  function frame(now) {
    raf = 0;
    if (!onScreen || document.hidden) return;
    const dt = Math.min((now - previous) / 1000, .05);
    previous = now;
    const smooth = reducedMotion ? 1 : 1 - Math.exp(-dt * 7);
    const rotating = Math.abs(targetYaw - villa.rotation.y) > .0001 || Math.abs(targetTilt - villa.rotation.x) > .0001;
    if (rotating) studio.invalidateShadows();
    villa.rotation.y += (targetYaw - villa.rotation.y) * smooth;
    villa.rotation.x += (targetTilt - villa.rotation.x) * smooth;
    layerAmount += (layerTarget - layerAmount) * smooth;
    fitCamera();
    membrane.position.y = 3.801 + layerAmount * .93;
    membraneEdge.position.y = seams.position.y = membrane.position.y + .027;
    foam.position.y = 3.83 + layerAmount * .53;
    bonding.position.y = 3.82 + layerAmount * .24;
    foam.visible = bonding.visible = protectedRoof && layerAmount > .02;
    rainFrame(reducedMotion ? 0 : dt);
    renderer.render(scene, camera);
    const settling = Math.abs(targetYaw - villa.rotation.y) > .0001 || Math.abs(targetTilt - villa.rotation.x) > .0001 || Math.abs(layerTarget - layerAmount) > .0001;
    if (!reducedMotion && onScreen && !document.hidden && ((raining && intensity > 0) || settling)) raf = requestAnimationFrame(frame);
  }
  function requestRender() {
    if (!raf && onScreen && !document.hidden) { previous = performance.now(); raf = requestAnimationFrame(frame); }
  }
  function resize() {
    const rect = mount.getBoundingClientRect();
    const width = Math.max(rect.width, 1), height = Math.max(rect.height, 1);
    viewportAspect = width / height;
    fitCamera();
    studio.resize(width, height);
    requestRender();
  }
  window.addEventListener('roof:state', e => setState(e.detail?.protected !== false));
  window.addEventListener('roof:rain', e => { raining = e.detail?.running !== false; leaks.visible = !protectedRoof && raining && intensity > 0; requestRender(); });
  window.addEventListener('roof:intensity', e => { intensity = Math.max(0, Math.min(100, Number(e.detail?.value) || 0)); leaks.visible = !protectedRoof && raining && intensity > 0; requestRender(); });
  window.addEventListener('roof:reset', () => { targetYaw = -.04; targetTilt = 0; requestRender(); });
  window.addEventListener('roof:view', e => { layerTarget = e.detail?.view === 'layers' ? 1 : 0; requestRender(); });
  canvas.addEventListener('keydown', e => {
    const step = .09;
    if (e.key === 'ArrowLeft') targetYaw = Math.max(-.62, targetYaw - step);
    else if (e.key === 'ArrowRight') targetYaw = Math.min(.66, targetYaw + step);
    else if (e.key === 'ArrowUp') targetTilt = Math.max(-.13, targetTilt - .04);
    else if (e.key === 'ArrowDown') targetTilt = Math.min(.13, targetTilt + .04);
    else if (e.key === 'Home') {targetYaw = -.04; targetTilt = 0;}
    else return;
    e.preventDefault();
    requestRender();
  });
  canvas.addEventListener('pointerdown', e => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY, yaw: targetYaw, tilt: targetTilt, touch: e.pointerType === 'touch' };
    canvas.style.cursor = 'grabbing';
    if (!drag.touch) canvas.setPointerCapture?.(e.pointerId);
  }, { passive: true });
  canvas.addEventListener('pointermove', e => {
    if (!drag || drag.id !== e.pointerId) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (drag.touch && Math.abs(dy) > Math.abs(dx) + 8) { drag = null; canvas.style.cursor = 'grab'; return; }
    targetYaw = Math.max(-.62, Math.min(.66, drag.yaw + dx * .006));
    if (!drag.touch) targetTilt = Math.max(-.13, Math.min(.13, drag.tilt + dy * .003));
    requestRender();
  }, { passive: true });
  function endDrag() { drag = null; canvas.style.cursor = 'grab'; }
  canvas.addEventListener('pointerup', endDrag, { passive: true });
  canvas.addEventListener('pointercancel', endDrag, { passive: true });
  canvas.addEventListener('pointerleave', e => { if (e.pointerType === 'touch') endDrag(); }, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
    else requestRender();
  });
  const observer = new IntersectionObserver(entries => {
    onScreen = entries[0].isIntersecting;
    if (!onScreen) { cancelAnimationFrame(raf); raf = 0; }
    else requestRender();
  }, { rootMargin: '100px' });
  observer.observe(mount);
  new ResizeObserver(resize).observe(mount);
  mount.appendChild(canvas);
  resize();
  rainFrame(0);
  renderer.render(scene, camera);
  const fallback = mount.querySelector('#scene-fallback');
  if (fallback) fallback.style.display = 'none';
  window.dispatchEvent(new CustomEvent('roof:ready'));
  requestRender();
}
