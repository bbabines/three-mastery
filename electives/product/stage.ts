import * as THREE from 'three';
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { collectResources, fitModel, overlay } from '@harness/lesson';
import { onLeave } from '@harness/teardown';
import type { Harness } from '@harness/scene';
import type { EnvironmentMode, PanelSettings, ProductLab, WatchAudit } from './lab';
import { panelPanorama } from './environment';

export const REFERENCE = '/assets/reference/classic-watch';
const DEFAULT_PANELS: PanelSettings = {count: 4, width: 0.65, softness: 0.7, background: 0.12};

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  // The download consumes this asynchronously; immediate revocation can cancel it.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
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
  harness.scene.background = new THREE.Color(0xf4f4f4);
  harness.renderer.toneMapping = THREE.ACESFilmicToneMapping;
  harness.renderer.toneMappingExposure = 1;
  harness.camera.fov = 25;
  harness.camera.position.set(2.2, 3.0, 8.7);
  harness.camera.updateProjectionMatrix();
  harness.controls.target.set(0, 1.5, 0);
  harness.controls.minDistance = 3;
  harness.controls.maxDistance = 12;
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
  const loadAudit = fetch(`${REFERENCE}/audit.json`).then(response => {
    if (!response.ok) throw new Error(`Reference audit: HTTP ${response.status}`);
    return response.json() as Promise<WatchAudit>;
  });
  Promise.all([loadWatch, loadEnvironment, loadNormal, loadAudit]).then(([gltf, environment, normalTexture, audit]) => {
    if (left || !harness.container.isConnected) return;
    const model = fitModel(gltf.scene, 3);
    const materials = new Map<string, THREE.MeshStandardMaterial>();
    model.traverse(object => {
      // The imported directional light belongs to the reference's ground setup. Study labs
      // explicitly introduce their own direct lights; no hidden fill contaminates comparisons.
      if (object instanceof THREE.Light) object.visible = false;
      if (!(object instanceof THREE.Mesh)) return;
      object.castShadow = object.receiveShadow = true;
      for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
        if (!(material instanceof THREE.MeshStandardMaterial)) continue;
        materials.set(material.name, material);
        const extras = material.userData.gltfExtensions?.WEBGI_material_extras;
        if (Array.isArray(extras?.normalScale)) material.normalScale.fromArray(extras.normalScale);
        if (typeof extras?.depthWrite === 'boolean') material.depthWrite = extras.depthWrite;
      }
    });
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
    harness.scene.add(model);
    environment.mapping = THREE.EquirectangularReflectionMapping;
    const pmrem = own(new THREE.PMREMGenerator(harness.renderer));
    const referenceTarget = own(pmrem.fromEquirectangular(environment));
    let activeTarget: THREE.WebGLRenderTarget | undefined;
    let environmentMode: EnvironmentMode = 'reference';
    let panelSettings = {...DEFAULT_PANELS};
    let customDraw: (() => void) | null = null;
    let rendering = true;
    let drawing = false;
    const updates: (() => void)[] = [];
    const prepareViewport = () => {
      // Closed details can retain layout dimensions while suppressing their contents.
      if (!harness.container.checkVisibility()) return false;
      const width = harness.container.clientWidth, height = harness.container.clientHeight;
      if (width <= 0 || height <= 0) return false;
      const size = harness.renderer.getSize(new THREE.Vector2());
      if (size.x !== width || size.y !== height) harness.renderer.setSize(width, height);
      if (harness.camera.aspect !== width / height) {
        harness.camera.aspect = width / height;
        harness.camera.updateProjectionMatrix();
      }
      return true;
    };
    const render = () => {
      if (drawing || !prepareViewport()) return;
      drawing = true;
      const autoRotate = harness.controls.autoRotate;
      const damping = harness.controls.enableDamping;
      try {
        // Manual comparisons freeze automatic motion and consume any pending drag once.
        harness.controls.autoRotate = false;
        harness.controls.enableDamping = false;
        harness.controls.update();
        harness.camera.updateMatrixWorld(true);
        harness.scene.updateMatrixWorld(true);
        for (const update of updates) update();
        if (customDraw) customDraw();
        else harness.renderer.render(harness.scene, harness.camera);
      } finally {
        harness.controls.autoRotate = autoRotate;
        harness.controls.enableDamping = damping;
        drawing = false;
      }
    };
    const controlChanged = () => {if (!rendering && !drawing) render();};
    harness.controls.addEventListener('change', controlChanged);
    stops.push(() => harness.controls.removeEventListener('change', controlChanged));
    const replace = (target: THREE.WebGLRenderTarget | undefined) => {
      if (activeTarget) { activeTarget.dispose(); owned.delete(activeTarget); }
      activeTarget = target;
      if (target) own(target);
      harness.scene.environment = (target ?? referenceTarget).texture;
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
    harness.scene.environmentIntensity = audit.scene.envMapIntensity;
    harness.scene.environmentRotation.y = 3.9472152126557813;
    setEnvironment('reference');
    const evidenceReaders: (() => Record<string, unknown>)[] = [];
    const snapshot = () => ({
      reference: 'classic-watch.glb; local assets, no original file mutation',
      environment: {mode:environmentMode, panels:panelSettings, intensity:harness.scene.environmentIntensity, rotation:harness.scene.environmentRotation.toArray()},
      camera: {position:harness.camera.position.toArray(), target:harness.controls.target.toArray(), fov:harness.camera.fov, aspect:harness.camera.aspect},
      exposure:harness.renderer.toneMappingExposure, toneMapping:harness.renderer.toneMapping,
      pixelRatio:harness.renderer.getPixelRatio(),
      livePreview:rendering,
      materials:[...materials].map(([name,material])=>({name,roughness:material.roughness,metalness:material.metalness,normalScale:material.normalScale.toArray(),colorLinear:material.color.toArray()})),
      experiments:evidenceReaders.map(read=>read()),
    });
    const addButton = (label: string, action: () => void) => {
      const button = document.createElement('button');
      button.textContent = label;
      button.type = 'button';
      button.addEventListener('click', () => {if (!rendering) render(); action(); if (!rendering) render();});
      ui.append(button);
      return button;
    };
    const lab: ProductLab = {
      harness, model, materials, strap, normalTexture, environment, audit, ui, readout,
      setEnvironment, setPanels, setReadout: text => {readout.textContent = text;}, addButton,
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
        const update = () => { caption.textContent = `${label}: ${input.value} `; action(Number(input.value)); if (!rendering) render(); };
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
        select.addEventListener('change',()=>{options[select.value]?.(); if (!rendering) render();});
        wrapper.append(select); ui.append(wrapper);
        // No implicit callback: experiments explicitly apply their chosen initial state.
        return select;
      },
      registerEvidence: read => {evidenceReaders.push(read);},
      onLeave: stop => { if (left) stop(); else stops.push(stop); },
      setCaptureRenderer: draw => {customDraw = draw;},
      beforeDraw: update => {updates.push(update);},
      redraw: render,
      captureOrbit() {
        const sheet = document.createElement('canvas');
        const cellW = 240, cellH = 230;
        sheet.width = 12 * cellW; sheet.height = 3 * cellH;
        const context = sheet.getContext('2d')!;
        const position = harness.camera.position.clone();
        const target = harness.controls.target.clone();
        const distance = position.distanceTo(target);
        const damping = harness.controls.enableDamping;
        const autoRotate = harness.controls.autoRotate;
        harness.controls.autoRotate = false;
        harness.controls.enableDamping = false;
        harness.controls.update(); // consume a pending drag before setting the exact sweep views
        const elevationRows = [15, 35, 65];
        try {
          for (let row=0; row<3; row++) for (let column=0; column<12; column++) {
            const theta = column * Math.PI / 6;
            const phi = THREE.MathUtils.degToRad(90 - elevationRows[row]);
            harness.camera.position.copy(target).add(new THREE.Vector3().setFromSphericalCoords(distance, phi, theta));
            render();
            context.fillStyle = '#ffffff'; context.fillRect(column*cellW,row*cellH,cellW,cellH);
            // Fit without distorting the renderer's aspect ratio.
            const source = harness.renderer.domElement;
            const scale = Math.min(cellW/source.width, (cellH-22)/source.height);
            const w=source.width*scale,h=source.height*scale;
            context.drawImage(source,column*cellW+(cellW-w)/2,row*cellH,w,h);
            context.fillStyle='#202228'; context.font='12px system-ui';
            context.fillText(`${column*30}° / elevation ${elevationRows[row]}°`,column*cellW+5,row*cellH+cellH-6);
          }
        } finally {
          harness.camera.position.copy(position); harness.controls.target.copy(target);
          harness.controls.update(); harness.controls.enableDamping = damping;
          render(); harness.controls.autoRotate = autoRotate;
        }
        sheet.toBlob(blob=>{if(blob) download(blob,'watch-orbit-12x3.png');});
        download(new Blob([JSON.stringify({...snapshot(), orbit:{azimuthStepDegrees:30,elevations:elevationRows,distance}},null,2)],{type:'application/json'}),'watch-orbit-settings.json');
      },
    };
    addButton('Save comparison PNG',()=>{
      render();
      // Copy while the WebGL drawing buffer is valid; encoding can finish after its discard.
      const source = harness.renderer.domElement;
      const image = document.createElement('canvas');
      image.width = source.width; image.height = source.height;
      image.getContext('2d')!.drawImage(source, 0, 0);
      image.toBlob(blob=>{if(blob) download(blob,'watch-comparison.png');});
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
    readout.textContent = 'Local watch ready · leather map restored · studio EXR · r186 study rendering';
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
