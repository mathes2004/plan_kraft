/* Shared, lightweight studio rendering for Plan Kraft's architectural scenes. */
const surfaceTextures = new Map();

export function createStudioRenderer(T, mount, options = {}) {
  const compact = options.compact ?? window.matchMedia('(max-width: 700px)').matches;
  const renderer = new T.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, compact ? 1.5 : 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = options.exposure ?? 1.02;
  const canvas = renderer.domElement;
  canvas.style.cssText = 'width:100%;height:100%;display:block;touch-action:pan-y;cursor:grab;';
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', options.label || 'Interactive architectural model. Drag to explore.');
  canvas.setAttribute('tabindex', '0');
  const scene = new T.Scene();
  scene.add(new T.HemisphereLight(0xf0f7ff, 0x43596e, 1.22));
  const keyLight = new T.DirectionalLight(0xfff9ed, 2.80);
  keyLight.position.set(-3.5, 8, 6);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(compact ? 1024 : 2048, compact ? 1024 : 2048);
  Object.assign(keyLight.shadow.camera, { left: -6, right: 6, top: 7, bottom: -6, near: .5, far: 25 });
  keyLight.shadow.camera.updateProjectionMatrix();
  keyLight.shadow.normalBias = .022;
  keyLight.shadow.bias = -.00015;
  keyLight.shadow.radius = 4;
  scene.add(keyLight);
  const fill = new T.DirectionalLight(0xc2e2ff, .65);
  fill.position.set(5, 4, -5);
  scene.add(fill);
  const rim = new T.DirectionalLight(0xe5eeff, .35);
  rim.position.set(-2, 5, -6);
  scene.add(rim);

  // A tiny procedural studio panorama gives glass and wet surfaces real reflections.
  const width = 128, height = 64;
  const pixels = new Uint8Array(width * height * 4);
  for (let y = 0; y < height; y++) {
    const v = y / (height - 1);
    for (let x = 0; x < width; x++) {
      const u = x / width;
      const sky = Math.pow(Math.max(0, 1 - v), .55);
      const softbox = Math.exp(-Math.pow((u - .22) / .055, 4) - Math.pow((v - .33) / .20, 4));
      const sidebox = Math.exp(-Math.pow((u - .73) / .095, 4) - Math.pow((v - .37) / .24, 4)) * .60;
      const light = Math.min(1, softbox + sidebox);
      const n = (y * width + x) * 4;
      pixels[n] = Math.min(255, 31 + sky * 122 + light * 105);
      pixels[n + 1] = Math.min(255, 50 + sky * 116 + light * 95);
      pixels[n + 2] = Math.min(255, 70 + sky * 109 + light * 76);
      pixels[n + 3] = 255;
    }
  }
  const panorama = new T.DataTexture(pixels, width, height, T.RGBAFormat);
  panorama.mapping = T.EquirectangularReflectionMapping;
  panorama.colorSpace = T.SRGBColorSpace;
  panorama.needsUpdate = true;
  const pmrem = new T.PMREMGenerator(renderer);
  const environment = pmrem.fromEquirectangular(panorama);
  scene.environment = environment.texture;
  scene.environmentIntensity = .63;
  panorama.dispose();
  pmrem.dispose();

  function resize(w, h) {
    const rect = mount?.getBoundingClientRect();
    renderer.setSize(Math.max(1, w ?? rect?.width ?? 1), Math.max(1, h ?? rect?.height ?? 1), false);
  }
  function invalidateShadows() { renderer.shadowMap.needsUpdate = true; }
  function dispose() { environment.dispose(); renderer.dispose(); canvas.remove(); }
  return { renderer, scene, canvas, keyLight, resize, invalidateShadows, dispose };
}

export function createBeveledBox(T, width, height, depth, radius = .03) {
  const b = Math.max(.0005, Math.min(radius, width * .24, height * .24, depth * .24));
  const x = width / 2 - b, y = height / 2 - b;
  const shape = new T.Shape();
  shape.moveTo(-x, -y); shape.lineTo(x, -y); shape.lineTo(x, y); shape.lineTo(-x, y); shape.closePath();
  const geometry = new T.ExtrudeGeometry(shape, { depth: Math.max(.001, depth - b * 2), steps: 1, bevelEnabled: true, bevelSize: b, bevelThickness: b, bevelSegments: 3, curveSegments: 3 });
  geometry.center();
  return geometry;
}

export function createSurfaceTexture(T, kind = 'concrete') {
  if (surfaceTextures.has(kind)) return surfaceTextures.get(kind);
  const size = 128, pixels = new Uint8Array(size * size * 4);
  const noise = (x, y) => { const v = Math.sin(x * 127.1 + y * 311.7 + 23.41) * 43758.5453; return v - Math.floor(v); };
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const n = (y * size + x) * 4;
      const grain = noise(x, y);
      let value = 222 + grain * 24;
      if (kind === 'wood') value = 199 + grain * 13 + Math.sin(x * .55 + Math.sin(y * .07) * 1.8) * 17 + Math.sin(x * 1.9) * 7;
      if (kind === 'roof') value = 195 + grain * 40 + Math.sin(x * .19) * Math.cos(y * .14) * 8;
      if (kind === 'membrane') value = 236 + grain * 18;
      pixels[n] = pixels[n + 1] = pixels[n + 2] = Math.round(value);
      pixels[n + 3] = 255;
    }
  }
  const texture = new T.DataTexture(pixels, size, size, T.RGBAFormat);
  texture.wrapS = texture.wrapT = T.RepeatWrapping;
  texture.magFilter = T.LinearFilter;
  texture.minFilter = T.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  surfaceTextures.set(kind, texture);
  return texture;
}

export function createContactShadow(T, options = {}) {
  const size = 64, pixels = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (x / (size - 1) - .5) * 2, dy = (y / (size - 1) - .5) * 2;
      const distance = Math.pow(Math.pow(Math.abs(dx), 8) + Math.pow(Math.abs(dy), 8), 1 / 8);
      const alpha = Math.exp(-Math.pow(Math.max(0, distance - .58), 2) * 17) * Math.max(0, 1 - Math.pow(distance, 4));
      const n = (y * size + x) * 4;
      pixels[n] = pixels[n + 1] = pixels[n + 2] = 255;
      pixels[n + 3] = Math.round(alpha * 255);
    }
  }
  const texture = new T.DataTexture(pixels, size, size, T.RGBAFormat);
  texture.magFilter = texture.minFilter = T.LinearFilter;
  texture.needsUpdate = true;
  const mesh = new T.Mesh(new T.PlaneGeometry(options.width ?? 7, options.depth ?? 6), new T.MeshBasicMaterial({ color: 0x16384d, map: texture, transparent: true, opacity: options.opacity ?? .19, depthWrite: false, toneMapped: false }));
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = -.27;
  mesh.renderOrder = -1;
  return mesh;
}
