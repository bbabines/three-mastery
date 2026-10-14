import * as THREE from 'three';
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { collectResources, drawYourself, fitModel, overlay } from '@harness/lesson';
import { onLeave } from '@harness/teardown';
import type { Harness } from '@harness/scene';
import type { EnvironmentMode, PanelSettings, ProductLab, ReferenceCapture, ReferenceLookParts, ReferenceView, WatchAudit } from './lab';
import { panelPanorama } from './environment';
import { createFinishing } from './finishing';
import { createReferenceGround } from './ground';

export const REFERENCE = '/assets/reference/classic-watch';
const DEFAULT_PANELS: PanelSettings = {count: 4, width: 0.65, softness: 0.7, background: 0.12};
const ORBIT_SAMPLES = 2; // contact-sheet tiles are scaled down 3×, which antialiases them too
// The studio's brightness factor against WebGi's live intensity 1. Likely cause (README): three
// r163, under WebGi, cuts a partly metallic surface's diffuse environment light by its whole
// reflectance, where r186 cuts it only by the non-metal part's, and r163 uses an older formula for
// how much environment a surface reflects. Rebuilding both r163 formulas in the stage's shaders
// moved the dial, case, and floor shadow toward WebGi but left the floor shadow too dark, so a
// single factor measured against both captures is used instead (VALIDATION.md).
const ENVIRONMENT_CALIBRATION = 0.9;
const SHADOW_JITTER =[[0, 0], [-0.5, 0], [-0.375, -0.25], [-0.1875, -0.125], [-0.125, -0.375], [0.0625, -0.0625], [0.125, -0.3125], [0.375, -0.4375], [0.3125, -0.1875], [0.25, 0.0625], [0.4375, 0.25], [0.1875, 0.3125], [0, 0.4375], [-0.0625, 0.1875], [-0.25, 0.375], [-0.4375, 0.5], [-0.3125, 0.125]];

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  // The download consumes this asynchronously; immediate revocation can cancel it.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function halton(index: number, base: number) {
  let result = 0, fraction = 1 / base;
  for (let i = index; i > 0; i = Math.floor(i / base), fraction /= base) result += fraction * (i % base);
  return result;
}

// r186 reads what's behind a transmissive surface with a smoothing (bicubic) filter, at a blurrier
// mip level than the material asks for (it floors roughness at 0.0525 first), so even a perfectly
// smooth crystal blurs the hands under it. WebGi's crystal shows them crisp. While the material's
// own roughness is 0, this reads the sharp image directly; any rougher value keeps r186's filter.
const SHARP_TRANSMISSION = 'vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {';
function sharpenTransmission(material: THREE.MeshStandardMaterial) {
  if (!THREE.ShaderChunk.transmission_pars_fragment.includes(SHARP_TRANSMISSION)) throw new Error('r186 transmission chunk changed: sharpenTransmission needs updating.');
  material.onBeforeCompile = shader => {
    shader.fragmentShader = shader.fragmentShader.replace('#include <transmission_pars_fragment>', THREE.ShaderChunk.transmission_pars_fragment.replace(SHARP_TRANSMISSION,
      // `roughness` inside the function is the floored value; the uniform (declared earlier) is the material's own.
      `float sourceRoughness() { return roughness; }\n${SHARP_TRANSMISSION}\n\t\tif ( sourceRoughness() == 0.0 ) return textureLod( transmissionSamplerMap, fragCoord.xy, 0.0 );`));
  };
  material.customProgramCacheKey = () => 'product-sharp-transmission-v1';
}

// Every mounted experiment owns its assets and GPU resources, including late async arrivals.
export function watchLab(harness: Harness, ready: (lab: ProductLab) => void): void {
  harness.container.style.height = '620px';
  let left = false;
  const owned = new Set<{dispose(): void}>();
  const stops: (() => void)[] = [];
  const own = <T extends {dispose(): void}>(resource: T): T => {
    if (left) resource.dispose();
    else owned.add(resource);
    return resource;
  };
  onLeave(harness.container, () => {
    left = true;
    for (const stop of stops) stop();
    const resources = collectResources(harness.scene);
    for (const collection of [resources.geometries, resources.materials, resources.textures]) {
      for (const item of collection) owned.add(item);
    }
    for (const resource of owned) resource.dispose();
    owned.clear();
  });
  for (const child of [...harness.scene.children]) {
    harness.scene.remove(child);
    if (child instanceof THREE.GridHelper) { own(child.geometry); own(child.material); }
    else if (child instanceof THREE.AxesHelper) { own(child.geometry); for (const material of Array.isArray(child.material) ? child.material : [child.material]) own(material); }
  }
  // The stage draws its own frames (through the finishing chain); the harness's loop then draws
  // an empty scene that changes nothing. `harness.scene` is the scene the stage draws.
  const world = drawYourself(harness);
  harness.scene = world;
  const background = new THREE.Color(0xffffff); // WebGi's white, not tone mapped
  world.background = background;
  harness.renderer.toneMapping = THREE.ACESFilmicToneMapping;
  harness.renderer.toneMappingExposure = 1;
  harness.renderer.info.autoReset = false; // the stage resets it once per drawn frame
  harness.camera.fov = 25;
  harness.camera.position.set(2.2, 3.0, 8.7);
  harness.camera.updateProjectionMatrix();
  harness.controls.target.set(0, 1.5, 0);
  harness.controls.minDistance = 3;
  harness.controls.maxDistance = 16;
  harness.controls.maxPolarAngle = Math.PI / 2;
  harness.controls.update();
  const ui = overlay(harness.container, 'controls');
  const readout = overlay(harness.container, 'readout');
  ui.style.maxHeight = '150px';
  ui.style.overflowY = 'auto';
  readout.style.whiteSpace = 'pre-wrap';
  readout.style.maxWidth = 'calc(100% - 40px)';
  readout.style.maxHeight = '120px';
  readout.style.overflowY = 'auto';
  readout.textContent = 'Loading the local watch, leather normal map, and studio HDR…';
  harness.container.dataset.productState = 'loading';
  const draco = own(new DRACOLoader().setDecoderPath('/node_modules/three/examples/jsm/libs/draco/'));
  const loader = new GLTFLoader().setDRACOLoader(draco);
  const loadWatch = loader.loadAsync(`${REFERENCE}/classic-watch.glb`).then(gltf => {
    const resources = collectResources(gltf.scene);
    for (const collection of [resources.geometries, resources.materials, resources.textures]) {
      for (const resource of collection) own(resource);
    }
    return gltf;
  });
  const loadEnvironment = new EXRLoader().loadAsync(`${REFERENCE}/studio.exr`).then(own);
  const loadNormal = new THREE.TextureLoader().loadAsync(`${REFERENCE}/textures/leather-normal.jpg`).then(own);
  const loadJson = <T>(name: string) => fetch(`${REFERENCE}/${name}`).then(response => {
    if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`);
    return response.json() as Promise<T>;
  });
  Promise.all([loadWatch, loadEnvironment, loadNormal, loadJson<WatchAudit>('audit.json'), loadJson<ReferenceCapture>('reference-capture.json')]).then(([gltf, environment, normalTexture, audit, capture]) => {
    if (left || !harness.container.isConnected) return;
    const {renderer, camera, controls} = harness;
    const model = fitModel(gltf.scene, 3);
    model.updateMatrixWorld(true);
    const materials = new Map<string, THREE.MeshStandardMaterial>();
    let referenceLight: THREE.DirectionalLight | undefined;
    model.traverse(object => {
      if (object instanceof THREE.DirectionalLight && !referenceLight) referenceLight = object;
      else if (object instanceof THREE.Light) object.visible = false;
      if (!(object instanceof THREE.Mesh)) return;
      // WebGi saves each node's shadow flags; the crystal casts none.
      const flags = (object.userData.gltfExtensions ?? object.parent?.userData.gltfExtensions)?.WEBGI_object3d_extras;
      object.castShadow = typeof flags?.castShadow === 'boolean' ? flags.castShadow : true;
      object.receiveShadow = typeof flags?.receiveShadow === 'boolean' ? flags.receiveShadow : true;
      for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
        if (!(material instanceof THREE.MeshStandardMaterial)) continue;
        materials.set(material.name, material);
        const extras = material.userData.gltfExtensions?.WEBGI_material_extras;
        if (Array.isArray(extras?.normalScale)) material.normalScale.fromArray(extras.normalScale);
        if (typeof extras?.depthWrite === 'boolean') material.depthWrite = extras.depthWrite;
      }
    });
    if (!referenceLight) throw new Error('The reference no longer contains its directional light.');
    const strap = materials.get('strap');
    if (!strap) throw new Error('The reference no longer contains the strap material.');
    normalTexture.colorSpace = THREE.NoColorSpace;
    normalTexture.wrapS = normalTexture.wrapT = THREE.RepeatWrapping;
    normalTexture.repeat.set(3, 3);
    normalTexture.flipY = true; // WEBGI resource's stored setting, not a generic glTF rule.
    normalTexture.needsUpdate = true;
    strap.normalMap = normalTexture;
    strap.normalScale.set(0.3, -0.3);
    strap.needsUpdate = true;
    // r186 draws a double-sided transmissive crystal's back faces into its own transmission,
    // which washes the dial to a hazy grey-blue. Front faces alone keep real transmission.
    const glass = materials.get('glass');
    if (glass) { glass.side = THREE.FrontSide; sharpenTransmission(glass); glass.needsUpdate = true; }

    // WebGi world → stage. WebGi keeps the GLB's own coordinates (its saved box matches the GLB's
    // x extent exactly; its y and z are looser, unrotated-node boxes), so fitModel's own transform
    // carries the captured cameras into the stage.
    const fitted = new THREE.Box3().setFromObject(model, true);
    const fromSource = gltf.scene.matrixWorld.clone();
    const scale = new THREE.Vector3().setFromMatrixScale(fromSource).x;
    const toStage = (values: number[]) => new THREE.Vector3().fromArray(values).applyMatrix4(fromSource);

    // The GLB's own key light, with the shadow settings WebGi saved beside it.
    const light = referenceLight;
    const shadowExtras = (light.userData.gltfExtensions ?? light.parent?.userData.gltfExtensions)?.WEBGI_light_extras?.shadow;
    light.castShadow = true;
    light.shadow.mapSize.fromArray(shadowExtras?.mapSize ?? [1024, 1024]);
    light.shadow.bias = shadowExtras?.bias ?? -0.0001;
    light.shadow.normalBias = shadowExtras?.normalBias ?? -0.005;
    light.shadow.radius = shadowExtras?.radius ?? 1.0721160456482883;
    const frustum = (shadowExtras?.camera?.right ?? 5.180307300976213) * scale;
    Object.assign(light.shadow.camera, {left: -frustum, right: frustum, top: frustum, bottom: -frustum, near: (shadowExtras?.camera?.near ?? 0.5) * scale, far: (shadowExtras?.camera?.far ?? 500) * scale});
    light.shadow.camera.updateProjectionMatrix();
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    world.add(model);
    // In the GLB the light is its own top-level node, so turning the product must not turn it.
    world.attach(light);
    own({dispose: () => light.dispose()}); // its shadow map
    const ground = createReferenceGround(scale);
    own(ground);
    ground.mesh.position.y = fitted.min.y;
    world.add(ground.mesh);
    const finishing = createFinishing(renderer, world, camera);
    own(finishing);
    finishing.ao.gtao.updateGtaoMaterial({radius: scale});
    finishing.ao.exclude.add(ground.mesh.material); // WebGi's ground takes no SSAO
    const look: ReferenceLookParts = {light: true, ground: true, finishing: true, studioFollowsCamera: true};

    environment.mapping = THREE.EquirectangularReflectionMapping;
    const pmrem = own(new THREE.PMREMGenerator(renderer));
    const referenceTarget = own(pmrem.fromEquirectangular(environment));
    let activeTarget: THREE.WebGLRenderTarget | undefined;
    let environmentMode: EnvironmentMode = 'reference';
    let panelSettings = {...DEFAULT_PANELS};
    let customDraw: (() => void) | null = null;
    let rendering = true;
    let drawing = false;
    let view: {name: ReferenceView; position: THREE.Vector3; target: THREE.Vector3} | null = null;
    const updates: (() => void)[] = [];

    // Accumulation restarts whenever the view or anything on the page changes.
    const lastView = {matrix: new THREE.Matrix4(), projection: new THREE.Matrix4(), size: ''};
    const restart = () => { finishing.accumulate.samples = 0; };
    const viewChanged = () => {
      const size = renderer.getDrawingBufferSize(new THREE.Vector2());
      const key = `${size.x}:${size.y}`;
      const changed = key !== lastView.size || !lastView.matrix.equals(camera.matrixWorld) || !lastView.projection.equals(camera.projectionMatrix);
      lastView.size = key; lastView.matrix.copy(camera.matrixWorld); lastView.projection.copy(camera.projectionMatrix);
      return changed;
    };
    const debugView = () => {
      // Raw debug materials (normals as colors) must reach the screen unfinished.
      let found = false;
      world.traverseVisible(object => {
        if (!found && object instanceof THREE.Mesh) found = (Array.isArray(object.material) ? object.material : [object.material]).some(m => m instanceof THREE.MeshNormalMaterial);
      });
      return found;
    };
    const savedInfo = {calls: 0, triangles: 0, points: 0, lines: 0};
    // A studio that follows the camera: for this frame's renders the environment turns by the
    // camera's own rotation, on top of the rotation experiments set (which is restored after).
    const studioRotation = new THREE.Euler(), studioMatrix = new THREE.Matrix4(), cameraRotation = new THREE.Matrix4();
    const withStudio = (draw: () => void) => {
      if (!look.studioFollowsCamera) { draw(); return; }
      studioRotation.copy(world.environmentRotation);
      cameraRotation.extractRotation(camera.matrixWorld);
      world.environmentRotation.setFromRotationMatrix(studioMatrix.makeRotationFromEuler(studioRotation).premultiply(cameraRotation));
      try { draw(); } finally { world.environmentRotation.copy(studioRotation); }
    };
    // One frame: a new jittered sample while the view is still converging, otherwise the stored
    // average is finished again (bloom and tone mapping stay live for controls).
    const drawFrame = () => {
      if (customDraw) { customDraw(); return; }
      camera.updateMatrixWorld();
      if (viewChanged()) restart();
      const composited = look.finishing && !debugView();
      ground.setComposited(composited);
      if (!composited) {
        renderer.info.reset();
        world.background = background;
        withStudio(() => {
          if (ground.mesh.visible) ground.update(renderer, world, camera, 0);
          renderer.setRenderTarget(null);
          renderer.clear();
          renderer.render(world, camera);
        });
        harness.container.dataset.productSamples = '1';
        return;
      }
      const size = renderer.getSize(new THREE.Vector2());
      finishing.setSize(size.x, size.y, renderer.getPixelRatio());
      const accumulate = finishing.accumulate;
      const sampling = accumulate.samples < accumulate.maxSamples;
      world.background = null;
      if (sampling) {
        renderer.info.reset();
        const sample = accumulate.samples;
        const buffer = renderer.getDrawingBufferSize(new THREE.Vector2());
        if (sample > 0) camera.setViewOffset(buffer.x, buffer.y, halton(sample, 2) - 0.5, halton(sample, 3) - 0.5, buffer.x, buffer.y);
        const shadowCamera = light.shadow.camera, map = light.shadow.mapSize;
        const [jx, jy] = SHADOW_JITTER[sample % SHADOW_JITTER.length];
        if (sample > 0 && light.visible) shadowCamera.setViewOffset(map.x, map.y, jx, jy, map.x, map.y);
        // Shadow maps once per frame, not once per internal render.
        const autoUpdate = renderer.shadowMap.autoUpdate;
        renderer.shadowMap.autoUpdate = false;
        renderer.shadowMap.needsUpdate = true;
        accumulate.addSample = true;
        try {
          withStudio(() => {
            if (ground.mesh.visible) ground.update(renderer, world, camera, sample);
            finishing.draw(sample === 0);
          });
        } finally {
          renderer.shadowMap.autoUpdate = autoUpdate;
          if (camera.view?.enabled) camera.clearViewOffset();
          if (shadowCamera.view?.enabled) shadowCamera.clearViewOffset();
        }
        finishing.present();
        Object.assign(savedInfo, renderer.info.render);
      } else {
        // Converged: copy the finished still again (anything else drawn on the canvas is replaced)
        // and keep reporting the last full frame's counts.
        finishing.present();
        Object.assign(renderer.info.render, savedInfo);
      }
      harness.container.dataset.productSamples = String(accumulate.samples);
    };
    const prepareViewport = () => {
      // Closed details can retain layout dimensions while suppressing their contents.
      if (!harness.container.checkVisibility()) return false;
      const width = harness.container.clientWidth, height = harness.container.clientHeight;
      if (width <= 0 || height <= 0) return false;
      const size = renderer.getSize(new THREE.Vector2());
      if (size.x !== width || size.y !== height) renderer.setSize(width, height);
      if (camera.aspect !== width / height) {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
      return true;
    };
    let settling = 0;
    const settle = () => {
      settling = 0;
      if (left || rendering || customDraw || !look.finishing || finishing.accumulate.samples >= finishing.accumulate.maxSamples || !prepareViewport()) return;
      drawFrame();
      settling = requestAnimationFrame(settle);
    };
    stops.push(() => cancelAnimationFrame(settling));
    const render = () => {
      if (drawing || !prepareViewport()) return;
      drawing = true;
      const autoRotate = controls.autoRotate;
      const damping = controls.enableDamping;
      try {
        // Manual comparisons freeze automatic motion and consume any pending drag once.
        controls.autoRotate = false;
        controls.enableDamping = false;
        controls.update();
        camera.updateMatrixWorld(true);
        world.updateMatrixWorld(true);
        for (const update of updates) update();
        drawFrame();
      } finally {
        controls.autoRotate = autoRotate;
        controls.enableDamping = damping;
        drawing = false;
      }
      // A paused preview still finishes its still, then stops.
      if (!rendering && !settling) settling = requestAnimationFrame(settle);
    };
    const invalidate = () => { restart(); if (!rendering) render(); };
    // A converged still: what the exports save.
    const still = (samples = finishing.accumulate.maxSamples) => {
      const target = Math.min(samples, finishing.accumulate.maxSamples);
      restart();
      if (!prepareViewport()) return;
      render();
      for (let i = 1; i < target && look.finishing && !customDraw && finishing.accumulate.samples < target; i++) drawFrame();
    };
    const controlChanged = () => {if (!rendering && !drawing) render();};
    controls.addEventListener('change', controlChanged);
    stops.push(() => controls.removeEventListener('change', controlChanged));
    const replace = (target: THREE.WebGLRenderTarget | undefined) => {
      if (activeTarget) { activeTarget.dispose(); owned.delete(activeTarget); }
      activeTarget = target;
      if (target) own(target);
      world.environment = (target ?? referenceTarget).texture;
      restart();
    };
    const setPanels = (settings: PanelSettings) => {
      panelSettings = {...settings};
      const panorama = panelPanorama(settings);
      try { replace(pmrem.fromEquirectangular(panorama)); }
      finally { panorama.dispose(); }
      environmentMode = 'panels';
    };
    const setEnvironment = (mode: EnvironmentMode) => {
      environmentMode = mode;
      if (mode === 'reference') replace(undefined);
      else if (mode === 'room') {
        const room = new RoomEnvironment();
        try { replace(pmrem.fromScene(room)); }
        finally { room.dispose(); }
      } else {
        setPanels(mode === 'uniform' ? {count:0, width:1, softness:1, background:1.28}
          : {...DEFAULT_PANELS, softness: mode === 'hard-panels' ? 0 : DEFAULT_PANELS.softness});
      }
      environmentMode = mode;
    };
    // The live WebGi viewer renders at environment intensity 1 (audit.json's 0.771 is the GLB's
    // older saved setting). The stage uses it × ENVIRONMENT_CALIBRATION; see lab.ts.
    const environmentCalibration = {source: capture.settings.environmentIntensity, factor: ENVIRONMENT_CALIBRATION, calibrated: capture.settings.environmentIntensity * ENVIRONMENT_CALIBRATION};
    world.environmentIntensity = environmentCalibration.calibrated;
    world.environmentRotation.fromArray(capture.settings.environmentRotation as [number, number, number, THREE.EulerOrder]);
    setEnvironment('reference');
    const setReferenceLook = (parts: Partial<ReferenceLookParts>) => {
      Object.assign(look, parts);
      light.visible = look.light;
      ground.mesh.visible = look.ground;
      invalidate();
    };
    const setView = (name: ReferenceView) => {
      const saved = capture.views[name].camera;
      camera.fov = saved.fov;
      camera.position.copy(toStage(saved.position));
      controls.target.copy(toStage(saved.target));
      camera.updateProjectionMatrix();
      controls.update();
      view = {name, position: camera.position.clone(), target: controls.target.clone()};
      invalidate();
    };
    setView('default');
    const evidenceReaders: (() => Record<string, unknown>)[] = [];
    const snapshot = () => ({
      reference: 'classic-watch.glb; local assets, no original file mutation',
      environment: {mode:environmentMode, panels:panelSettings, intensity:world.environmentIntensity, calibration:environmentCalibration, rotation:world.environmentRotation.toArray()},
      camera: {position:camera.position.toArray(), target:controls.target.toArray(), fov:camera.fov, aspect:camera.aspect,
        view: view && view.position.distanceTo(camera.position) < 1e-6 && view.target.distanceTo(controls.target) < 1e-6 ? `source ${view.name}` : 'custom'},
      exposure:renderer.toneMappingExposure, toneMapping:renderer.toneMapping,
      pixelRatio:renderer.getPixelRatio(),
      livePreview:rendering,
      referenceLook: {
        ...look,
        light: {visible: light.visible, intensity: light.intensity, castShadow: light.castShadow, shadow: {mapSize: light.shadow.mapSize.toArray(), radius: light.shadow.radius, bias: light.shadow.bias, normalBias: light.shadow.normalBias, frustumHalfWidth: frustum}},
        ground: {visible: ground.mesh.visible, ...ground.settings, roughness: ground.mesh.material.roughness, metalness: ground.mesh.material.metalness, method: 'blurred under-floor depth as aoMap + key-light shadow map + planar mirror'},
        finishing: {
          enabled: look.finishing, msaaSamples: {firstSample: finishing.multisample, jitteredSamples: 0},
          ao: {enabled: finishing.ao.enabled, intensity: finishing.ao.intensity, applies: 'environment (indirect) light only, inside the product materials'},
          accumulation: {samples: finishing.accumulate.samples, still: finishing.accumulate.maxSamples, clampMax: finishing.accumulate.clampMax},
          bloom: {enabled: finishing.bloom.enabled, strength: finishing.bloom.strength, radius: finishing.bloom.radius, threshold: finishing.bloom.threshold},
          contrast: finishing.output.contrast, saturation: finishing.output.saturation,
        },
      },
      materials:[...materials].map(([name,material])=>({name,roughness:material.roughness,metalness:material.metalness,normalScale:material.normalScale.toArray(),colorLinear:material.color.toArray()})),
      experiments:evidenceReaders.map(read=>read()),
    });
    const addButton = (label: string, action: () => void) => {
      const button = document.createElement('button');
      button.textContent = label;
      button.type = 'button';
      button.addEventListener('click', () => {if (!rendering) render(); action(); invalidate();});
      ui.append(button);
      return button;
    };
    const copyCanvas = () => {
      // Copy while the WebGL drawing buffer is valid; encoding can finish after its discard.
      const source = renderer.domElement;
      const image = document.createElement('canvas');
      image.width = source.width; image.height = source.height;
      image.getContext('2d')!.drawImage(source, 0, 0);
      return image;
    };
    const lab: ProductLab = {
      harness, model, materials, strap, normalTexture, environment, audit, ui, readout,
      referenceLight: light, ground: ground.mesh, groundSettings: ground.settings, finishing,
      setReferenceLook, getReferenceLook: () => ({...look}), setView,
      setEnvironment, setPanels, setReadout: text => {readout.textContent = text;}, addButton,
      environmentCalibration,
      useCalibratedEnvironment: calibrated => { world.environmentIntensity = calibrated ? environmentCalibration.calibrated : environmentCalibration.source; invalidate(); },
      addSlider(label, min, max, step, initial, action) {
        const wrapper = document.createElement('label');
        const caption = document.createElement('span');
        const input = document.createElement('input');
        input.type = 'range'; input.min = String(min); input.max = String(max);
        // Preserve measured source values that are not a multiple of the teaching step.
        const stepPosition = (initial - min) / step;
        input.step = Math.abs(stepPosition - Math.round(stepPosition)) < 1e-6 ? String(step) : 'any';
        input.value = String(initial);
        input.setAttribute('aria-label', label);
        const update = () => { caption.textContent = `${label}: ${input.value} `; action(Number(input.value)); invalidate(); };
        input.addEventListener('input', update);
        wrapper.append(caption, input); ui.append(wrapper); update();
        return input;
      },
      addSelect(label, options) {
        const wrapper = document.createElement('label');
        wrapper.append(document.createTextNode(`${label} `));
        const select = document.createElement('select');
        select.setAttribute('aria-label', label);
        for (const name of Object.keys(options)) { const option = document.createElement('option'); option.textContent = name; select.append(option); }
        select.addEventListener('change',()=>{options[select.value]?.(); invalidate();});
        wrapper.append(select); ui.append(wrapper);
        // No implicit callback: experiments explicitly apply their chosen initial state.
        return select;
      },
      registerEvidence: read => {evidenceReaders.push(read);},
      onLeave: stop => { if (left) stop(); else stops.push(stop); },
      setCaptureRenderer: draw => {customDraw = draw; restart();},
      beforeDraw: update => {updates.push(update);},
      redraw: () => { restart(); render(); },
      still: samples => { still(samples); return copyCanvas(); },
      captureOrbit() {
        const sheet = document.createElement('canvas');
        const cellW = 240, cellH = 230;
        sheet.width = 12 * cellW; sheet.height = 3 * cellH;
        const context = sheet.getContext('2d')!;
        const position = camera.position.clone();
        const target = controls.target.clone();
        const distance = position.distanceTo(target);
        const damping = controls.enableDamping;
        const autoRotate = controls.autoRotate;
        controls.autoRotate = false;
        controls.enableDamping = false;
        controls.update(); // consume a pending drag before setting the exact sweep views
        const elevationRows = [15, 35, 65];
        try {
          for (let row=0; row<3; row++) for (let column=0; column<12; column++) {
            const theta = column * Math.PI / 6;
            const phi = THREE.MathUtils.degToRad(90 - elevationRows[row]);
            camera.position.copy(target).add(new THREE.Vector3().setFromSphericalCoords(distance, phi, theta));
            still(ORBIT_SAMPLES);
            context.fillStyle = '#ffffff'; context.fillRect(column*cellW,row*cellH,cellW,cellH);
            // Fit without distorting the renderer's aspect ratio.
            const source = renderer.domElement;
            const fit = Math.min(cellW/source.width, (cellH-22)/source.height);
            const w=source.width*fit,h=source.height*fit;
            context.drawImage(source,column*cellW+(cellW-w)/2,row*cellH,w,h);
            context.fillStyle='#202228'; context.font='12px system-ui';
            context.fillText(`${column*30}° / elevation ${elevationRows[row]}°`,column*cellW+5,row*cellH+cellH-6);
          }
        } finally {
          camera.position.copy(position); controls.target.copy(target);
          controls.update(); controls.enableDamping = damping;
          render(); controls.autoRotate = autoRotate;
        }
        sheet.toBlob(blob=>{if(blob) download(blob,'watch-orbit-12x3.png');});
        download(new Blob([JSON.stringify({...snapshot(), orbit:{azimuthStepDegrees:30,elevations:elevationRows,distance,samplesPerTile:ORBIT_SAMPLES}},null,2)],{type:'application/json'}),'watch-orbit-settings.json');
      },
    };
    addButton('Save comparison PNG',()=>{
      still();
      copyCanvas().toBlob(blob=>{if(blob) download(blob,'watch-comparison.png');});
    });
    addButton('Save settings JSON',()=>{
      render();
      download(new Blob([JSON.stringify(snapshot(),null,2)],{type:'application/json'}),'watch-settings.json');
    });
    const pause = addButton('Pause live preview',()=>{
      rendering = !rendering;
      harness.setRendering(rendering);
      pause.textContent = rendering ? 'Pause live preview' : 'Resume live preview';
    });
    readout.textContent = 'Local watch ready · reference light, ground and finishing · studio EXR · r186 study rendering';
    ready(lab);
    // Assets and controls alone do not establish a visible frame. Resize before the first
    // draw, then expose readiness only after another animation frame has been submitted.
    render();
    const visibleResize = new ResizeObserver(() => {if (!rendering) render();});
    visibleResize.observe(harness.container);
    stops.push(() => visibleResize.disconnect());
    let frames = 0;
    harness.onFrame(() => {
      if (left || !prepareViewport()) return;
      // After every experiment's own frame callbacks, like the harness's draw it replaces.
      if (rendering && !drawing) drawFrame();
      frames++;
      harness.container.dataset.productFrame = String(frames);
      if (frames >= 2) harness.container.dataset.productState = 'ready';
    });
  }).catch(error => {
    if (left) return;
    harness.container.dataset.productState = 'error';
    readout.textContent = `Reference failed to load: ${error instanceof Error ? error.message : String(error)}. Run node electives/product/tools/fetch-reference.mjs.`;
  });
}
