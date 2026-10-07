import { buttonGroup, choiceButtons, fitModel, formatNumber, overlay, slider } from '@harness/lesson';
import type { PageTool, SceneSetup } from '@harness/scene';
import { onLeave } from '@harness/teardown';
import * as THREE from 'three';
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import {
  environment,
  environmentImage,
  type EnvironmentName,
  isGem,
  jewelryStage,
  loadSpring,
  METALS,
  MISSING_REFERENCE,
  mirrorStandIn,
} from '../shared';
import { clipAtWhite, lightLikeIJewel, measurePanorama, type PanoramaPixels, type PanoramaStats, prefilter } from './environments';

const FILES: Record<EnvironmentName, string> = { metal: 'env_metal_011', gem: 'env_gem_001' };
const percent = (share: number) => `${formatNumber(100 * share, 1)}%`;

// Measuring a panorama takes a fraction of a second, so the scene and the tool share each result.
const measurements = new WeakMap<PanoramaPixels, PanoramaStats>();
function measureOnce(image: PanoramaPixels) {
  if (!measurements.has(image)) measurements.set(image, measurePanorama(image));
  return measurements.get(image)!;
}

// Calls `ready` once the page's assets have loaded, unless the page was left first. Shows the
// missing-files note in the readout when the reference files aren't on this machine.
function whenLoaded<T>(container: HTMLElement, readout: HTMLElement, load: Promise<T>, ready: (value: T) => void) {
  let left = false;
  onLeave(container, () => {
    left = true;
  });
  readout.textContent = 'Loading…';
  load.then(
    (value) => {
      if (!left) ready(value);
    },
    () => {
      readout.textContent = MISSING_REFERENCE;
    },
  );
}

// Evidence: each lighting file laid out flat, the whole room in one picture, with an exposure
// slider. Lowering the exposure leaves only what's far brighter than white paper.
export const panoramas: SceneSetup = (harness) => {
  const { scene, camera, controls, container, renderer, onFrame } = harness;
  jewelryStage(harness);
  controls.enabled = false; // a flat picture, seen straight on and whole
  controls.target.set(0, 1.2, 0);
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');

  whenLoaded(container, readout, Promise.all([environmentImage('metal'), environmentImage('gem')]), ([metal, gem]) => {
    // A copy for display that shares the pixel data but has its own mipmaps, so the picture doesn't
    // shimmer when it's drawn smaller than the file. The lighting files themselves stay untouched.
    const display = (equirect: THREE.DataTexture) => {
      const { data, width, height } = equirect.image as { data: Uint16Array; width: number; height: number };
      const texture = new THREE.DataTexture(data, width, height, equirect.format as THREE.PixelFormat, equirect.type);
      texture.colorSpace = equirect.colorSpace;
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.needsUpdate = true;
      return texture;
    };
    const pictures = { metal: display(metal), gem: display(gem) };
    const sources = { metal, gem };
    onLeave(container, () => {
      pictures.metal.dispose();
      pictures.gem.dispose();
    });

    const panorama = new THREE.Mesh(new THREE.PlaneGeometry(4, 2), new THREE.MeshBasicMaterial({ map: pictures.metal }));
    panorama.position.y = 1.2;
    scene.add(panorama);
    // Back the camera off until the whole 2:1 picture fits, whatever the canvas's shape.
    const tan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    let fittedAspect = 0;
    onFrame(() => {
      if (camera.aspect === fittedAspect) return;
      fittedAspect = camera.aspect;
      camera.position.set(0, 1.2, 1.06 * Math.max(1 / tan, 2 / (tan * camera.aspect)));
    });

    let which: EnvironmentName = 'metal';
    let stops = 0;
    const update = () => {
      const measured = measureOnce(sources[which].image as unknown as PanoramaPixels);
      panorama.material.map = pictures[which];
      renderer.toneMappingExposure = 2 ** stops;
      readout.innerHTML = [
        `renderer.toneMappingExposure = 2 ** ${stops} (${formatNumber(2 ** stops, 4)})`,
        `${FILES[which]}: median ${formatNumber(measured.median)}, brightest ${formatNumber(measured.max, 1)}`,
        `still brighter than white: ${percent(measured.shareAbove(1 / 2 ** stops))} of it, in ${measured.lightsAbove(1 / 2 ** stops)} separate spots`,
      ].join('<br>');
    };
    choiceButtons(buttonGroup(bar, 'file'), [
      { html: 'metal', select: () => ((which = 'metal'), update()) },
      { html: 'gem', select: () => ((which = 'gem'), update()) },
    ]);
    slider(bar, 'exposure', { min: -10, max: 2, step: 0.5, value: stops }, (value) => {
      stops = value;
      update();
    });
  });
};

// Why it works: Spring lit three ways. Every part without its own envMap reflects
// scene.environment; the gems' material can carry its own envMap, which wins.
export const split: SceneSetup = (harness) => {
  const { scene, camera, controls, container, renderer, onFrame } = harness;
  jewelryStage(harness);
  // From above and in front, like the playground's opening view: the flowers and stones face up.
  camera.position.set(-0.6, 4.55, -1.75);
  controls.target.set(0, 2.45, 0);
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');

  const load = Promise.all([loadSpring(), environment(renderer, 'metal'), environment(renderer, 'gem')]);
  whenLoaded(container, readout, load, ([gltf, metal, gem]) => {
    const model = gltf.scene.clone(true);
    const gemMaterial = mirrorStandIn();
    model.traverse((child) => {
      if (child instanceof THREE.Mesh && isGem(child)) child.material = gemMaterial;
    });
    const holder = fitModel(model, 3);
    scene.add(holder);
    onFrame((delta) => {
      holder.rotation.y += delta * 0.2; // gems flash as they turn
    });

    const choose = (sceneFile: EnvironmentName, gemFile: EnvironmentName | null) => {
      lightLikeIJewel(scene, sceneFile === 'metal' ? metal : gem, [gemMaterial], gemFile === 'gem' ? gem : null);
      const gemsSee = gemFile ?? sceneFile;
      readout.innerHTML = [
        `scene.environment = ${sceneFile}Environment;`,
        gemFile ? `gemMaterial.envMap = ${gemFile}Environment; // wins over the scene's` : 'gemMaterial.envMap = null; // falls back to the scene\'s',
        `metal reflects ${FILES[sceneFile]}, gems reflect ${FILES[gemsSee]}`,
        gemFile
          ? 'iJewel\'s setup: crisp metal, and gems that flash'
          : sceneFile === 'metal'
            ? 'good metal; the gems mirror a bright gray studio: pale, few flashes'
            : 'the gems flash; the metal goes dim and busy',
      ].join('<br>');
    };
    choiceButtons(buttonGroup(bar, 'light with'), [
      { html: 'metal file on all', select: () => choose('metal', null) },
      { html: 'gem file on all', select: () => choose('gem', null) },
      { html: 'each its own', select: () => choose('metal', 'gem') },
    ]);
  });
};

// The code: measures iJewel's two files when the page opens, and any .exr or .hdr file you pick.
export const check: PageTool = (container) => {
  const status = document.createElement('p');
  const table = document.createElement('table');
  table.innerHTML =
    '<thead><tr><th>File</th><th>size</th><th>median</th><th>brightest</th><th>brighter than 1.0</th><th>lights above 8</th><th>tint</th></tr></thead>';
  const body = table.createTBody();
  const scroller = document.createElement('div');
  scroller.style.overflowX = 'auto';
  scroller.append(table);
  const picker = document.createElement('label');
  picker.innerHTML = 'Check your own lighting file: <input type="file" accept=".exr,.hdr">';
  container.append(status, scroller, picker);

  const addRow = (name: string, image: PanoramaPixels) => {
    const stats = measureOnce(image);
    const row = body.insertRow();
    for (const cell of [
      name,
      `${stats.width} × ${stats.height}`,
      formatNumber(stats.median),
      formatNumber(stats.max, 1),
      percent(stats.shareAbove(1)),
      String(stats.lightsAbove(8)),
      stats.tint,
    ]) {
      row.insertCell().textContent = cell; // text, since a picked file's name could hold anything
    }
  };
  status.textContent = 'Measuring iJewel\'s two files…';
  const nextTask = () => new Promise((resolve) => setTimeout(resolve, 50)); // lets the scenes draw in between
  Promise.all([environmentImage('metal'), environmentImage('gem')]).then(
    async ([metal, gem]) => {
      await nextTask();
      addRow(`${FILES.metal} (metal)`, metal.image as unknown as PanoramaPixels);
      await nextTask();
      addRow(`${FILES.gem} (gems)`, gem.image as unknown as PanoramaPixels);
      status.textContent = 'Brightness is measured against white paper, 1.0.';
    },
    () => {
      status.textContent = MISSING_REFERENCE;
    },
  );
  picker.querySelector('input')!.addEventListener('change', async (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    status.textContent = `Measuring ${file.name}…`;
    try {
      const loader = file.name.toLowerCase().endsWith('.hdr') ? new HDRLoader() : new EXRLoader();
      const texture = await loader.loadAsync(url);
      addRow(file.name, texture.image as unknown as PanoramaPixels);
      texture.dispose();
      status.textContent = 'Brightness is measured against white paper, 1.0.';
    } catch (error) {
      status.textContent = `${file.name} didn't load: ${error instanceof Error ? error.message : String(error)}`;
    } finally {
      URL.revokeObjectURL(url);
    }
  });
};

// Why it works: the same two files as HDR, and clipped at 1.0 the way a JPG or PNG would hold them,
// on a polished rose gold band and a mirror stand-in stone.
export const clipped: SceneSetup = (harness) => {
  const { scene, camera, controls, container, renderer, onFrame } = harness;
  jewelryStage(harness);
  camera.position.set(0, 2.1, 4.3);
  controls.target.set(0, 1.3, 0);
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');

  const load = Promise.all([environmentImage('metal'), environmentImage('gem'), loadSpring()]);
  whenLoaded(container, readout, load, ([metalImage, gemImage, gltf]) => {
    const prefilterClipped = (image: THREE.DataTexture) => {
      const copy = clipAtWhite(image);
      const texture = prefilter(renderer, copy);
      copy.dispose(); // the prefiltered version is all the scene needs
      return texture;
    };
    const files = {
      hdr: { metal: prefilter(renderer, metalImage), gem: prefilter(renderer, gemImage), brightest: 284.5 },
      clipped: { metal: prefilterClipped(metalImage), gem: prefilterClipped(gemImage), brightest: 1 },
    };

    const band = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.14, 48, 256), new THREE.MeshStandardMaterial(METALS['rose gold']));
    band.position.set(-1.15, 1.15, 0);

    // Spring's center diamond, centered, scaled to 0.85 across, and stood table-up, as on the pro
    // file page.
    let source: THREE.BufferGeometry | undefined;
    gltf.scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.name === 'Brillant_1') source = child.geometry;
    });
    const geometry = source!.clone().center();
    geometry.computeBoundingSphere();
    const shrink = 0.85 / geometry.boundingSphere!.radius;
    geometry.scale(shrink, shrink, shrink);
    geometry.rotateX(-Math.PI / 2);
    onLeave(container, () => geometry.dispose());
    const gemMaterial = mirrorStandIn();
    const stone = new THREE.Mesh(geometry, gemMaterial);
    stone.position.set(1.2, 1.15, 0);
    stone.rotation.x = 0.8; // table tipped toward the camera
    scene.add(band, stone);

    let file: keyof typeof files = 'hdr';
    let stops = 0;
    let flashes = 0;
    const show = () => {
      readout.innerHTML = [
        file === 'hdr' ? 'new EXRLoader().loadAsync(\'env_gem_001.exr\')' : '// the same room saved as a JPG: nothing above 1.0',
        `brightest light the stone can reflect: ${formatNumber(files[file].brightest, 1)}`,
        `renderer.toneMappingExposure = 2 ** ${stops} (${formatNumber(2 ** stops, 3)})`,
        `stone pixels at full white on screen: ${flashes}`,
      ].join('<br>');
    };
    const update = () => {
      lightLikeIJewel(scene, files[file].metal, [gemMaterial], files[file].gem);
      renderer.toneMappingExposure = 2 ** stops;
      countFlashes();
    };

    // A few times a second, draws the frame and counts the stone's pixels that come out pure white
    // (all three channels 250 or more): its flashes.
    const gl = renderer.getContext();
    const bounds = new THREE.Box3();
    const corner = new THREE.Vector3();
    const size = new THREE.Vector2();
    let sinceCount = 0;
    const countFlashes = () => {
      camera.lookAt(controls.target); // where the orbit controls aim it, even before the first frame
      camera.updateMatrixWorld();
      stone.updateMatrixWorld();
      bounds.setFromObject(stone);
      renderer.getDrawingBufferSize(size);
      let left = Infinity, right = -Infinity, bottom = Infinity, top = -Infinity;
      for (let i = 0; i < 8; i++) {
        corner.set(i & 1 ? bounds.max.x : bounds.min.x, i & 2 ? bounds.max.y : bounds.min.y, i & 4 ? bounds.max.z : bounds.min.z).project(camera);
        left = Math.min(left, corner.x);
        right = Math.max(right, corner.x);
        bottom = Math.min(bottom, corner.y);
        top = Math.max(top, corner.y);
      }
      const x = Math.max(0, Math.floor(((left + 1) / 2) * size.x));
      const y = Math.max(0, Math.floor(((bottom + 1) / 2) * size.y));
      const width = Math.min(size.x, Math.ceil(((right + 1) / 2) * size.x)) - x;
      const height = Math.min(size.y, Math.ceil(((top + 1) / 2) * size.y)) - y;
      if (width <= 0 || height <= 0) return;
      renderer.render(scene, camera); // read the pixels before the browser shows the frame and clears it
      const pixels = new Uint8Array(width * height * 4);
      gl.readPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
      flashes = 0;
      for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i] >= 250 && pixels[i + 1] >= 250 && pixels[i + 2] >= 250) flashes++;
      }
      show();
    };
    onFrame((delta) => {
      band.rotation.y += delta * 0.3;
      stone.rotation.y += delta * 0.3;
      sinceCount += delta;
      if (sinceCount > 0.3) {
        sinceCount = 0;
        countFlashes();
      }
    });
    choiceButtons(buttonGroup(bar, 'file'), [
      { html: 'HDR (.exr)', select: () => ((file = 'hdr'), update()) },
      { html: 'clipped at 1.0, like a JPG', select: () => ((file = 'clipped'), update()) },
    ]);
    slider(bar, 'exposure', { min: -3, max: 1, step: 0.25, value: stops }, (value) => {
      stops = value;
      update();
    });
  });
};
