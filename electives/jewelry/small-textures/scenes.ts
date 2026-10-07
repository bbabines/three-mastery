import { buttonGroup, choiceButtons, formatBytes, formatNumber, overlay, slider } from '@harness/lesson';
import type { Harness, SceneSetup } from '@harness/scene';
import { onLeave } from '@harness/teardown';
import * as THREE from 'three';
import { environment, jewelryStage, loadSpring, MISSING_REFERENCE } from '../shared';
import { loadWoodTextures, triplanarMaterial, WOOD } from './triplanar';

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

// Spring's wood band (Tube005), cloned with its place in the ring baked in: the size it is in the
// ring (about 2.2 units across) and none of the mesh's own uneven scale, then centered.
async function woodBand() {
  const gltf = await loadSpring();
  let source: THREE.Mesh | undefined;
  gltf.scene.traverse((child) => {
    if (child instanceof THREE.Mesh && child.name === 'Tube005') source = child;
  });
  source!.updateWorldMatrix(true, false);
  return source!.geometry.clone().applyMatrix4(source!.matrixWorld).center();
}

const BAND_WIDTH = 2.23; // the band across, in units, as it sits in Spring

// Everything a wood scene needs, loaded together.
function loadWood(harness: Harness) {
  return Promise.all([woodBand(), loadWoodTextures(), environment(harness.renderer, 'metal')]);
}

// The stage for a wood scene: the band standing on its edge, at the height of the camera target.
function standBand(harness: Harness, geometry: THREE.BufferGeometry, material: THREE.Material) {
  const band = new THREE.Mesh(geometry, material);
  band.position.y = 1.2;
  harness.scene.add(band);
  return band;
}

const wood = (textures: { map: THREE.Texture; roughnessMap: THREE.Texture }) =>
  triplanarMaterial({ ...textures, ...WOOD, side: THREE.DoubleSide });

// How unevenly the band's UVs spread the texture: texture area per surface area for each triangle,
// the 95th percentile against the 5th, plus triangles squashed to no texture at all.
function uvSpread(geometry: THREE.BufferGeometry) {
  const position = geometry.getAttribute('position');
  const uv = geometry.getAttribute('uv');
  const index = geometry.index!;
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  const ratios: number[] = [];
  let empty = 0;
  for (let i = 0; i < index.count; i += 3) {
    const [ia, ib, ic] = [index.getX(i), index.getX(i + 1), index.getX(i + 2)];
    const surface = new THREE.Triangle(a.fromBufferAttribute(position, ia), b.fromBufferAttribute(position, ib), c.fromBufferAttribute(position, ic)).getArea();
    a.set(uv.getX(ia), uv.getY(ia), 0);
    b.set(uv.getX(ib), uv.getY(ib), 0);
    c.set(uv.getX(ic), uv.getY(ic), 0);
    const texture = new THREE.Triangle(a, b, c).getArea();
    if (texture < 1e-12) empty++;
    else if (surface > 0) ratios.push(texture / surface);
  }
  ratios.sort((x, y) => x - y);
  const at = (q: number) => ratios[Math.floor(q * (ratios.length - 1))];
  return { spread: at(0.95) / at(0.05), empty };
}

// Evidence and Why it works: the band with its own UVs, then projected from three sides.
export const band: SceneSetup = (harness) => {
  const { camera, controls, container } = harness;
  jewelryStage(harness);
  camera.position.set(2.6, 2.1, 2.6);
  controls.target.set(0, 1.25, 0);
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');

  whenLoaded(container, readout, loadWood(harness), ([geometry, textures, env]) => {
    harness.scene.environment = env;
    const uvMapped = new THREE.MeshStandardMaterial({ ...textures, color: WOOD.color, roughness: WOOD.roughness, metalness: WOOD.metalness, side: THREE.DoubleSide });
    const projected = wood(textures);
    const projectors = triplanarMaterial({ debug: 'projectors', roughness: 0.6, side: THREE.DoubleSide });
    const mesh = standBand(harness, geometry, uvMapped);
    const { spread, empty } = uvSpread(geometry);

    let mode: 'uv' | 'triplanar' | 'projectors' = 'triplanar';
    const show = () => {
      const { scale, blend } = projected.userData.triplanar;
      projectors.userData.triplanar.blend.value = blend.value;
      const angle = THREE.MathUtils.degToRad(30); // a surface turned 30° away from one projector
      const near = Math.cos(angle) ** blend.value;
      const share = Math.round((100 * near) / (near + Math.sin(angle) ** blend.value));
      const verdict =
        blend.value <= 2 ? 'soft: the pictures smear on every curve'
        : blend.value >= 24 ? 'hard: a seam where projectors hand over'
        : 'one picture mostly, mixed at the turns';
      if (mode === 'uv') {
        mesh.material = uvMapped;
        readout.innerHTML = [
          "material.map = woodMap; // read once, at the band's own UVs",
          `one tile over the whole band, unevenly: some triangles get ${Math.round(spread)}× the texture of others`,
          `and ${empty} triangles are squashed to no texture at all`,
        ].join('<br>');
        return;
      }
      mesh.material = mode === 'triplanar' ? projected : projectors;
      readout.innerHTML = [
        `triplanarMaterial({ map, roughnessMap, scale: ${formatNumber(scale.value)}, blend: ${blend.value} })`,
        mode === 'projectors'
          ? 'red: from the side · green: from above · blue: from the front'
          : `${formatNumber(scale.value * BAND_WIDTH, 1)} tiles across the ring; each map read 3 times, not once`,
        `30° off a projector's axis: ${share}% from it, ${verdict}`,
      ].join('<br>');
    };
    choiceButtons(buttonGroup(bar), [
      { html: 'triplanar', select: () => ((mode = 'triplanar'), show()) },
      { html: 'UV-mapped', select: () => ((mode = 'uv'), show()) },
      { html: 'projectors', select: () => ((mode = 'projectors'), show()) },
    ]);
    slider(bar, 'scale', { min: 0.25, max: 4, step: 0.05, value: WOOD.scale }, (value) => {
      projected.userData.triplanar.scale.value = value;
      projectors.userData.triplanar.scale.value = value;
      show();
    });
    slider(bar, 'blend', { min: 1, max: 40, step: 1, value: WOOD.blend }, (value) => {
      projected.userData.triplanar.blend.value = value;
      show();
    });
  });
};

// Why it works: the same band with each map in the right color space, then one of them wrong.
export const colorSpaces: SceneSetup = (harness) => {
  const { camera, controls, container } = harness;
  jewelryStage(harness);
  camera.position.set(2.6, 2.1, 2.6);
  controls.target.set(0, 1.25, 0);
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');

  whenLoaded(container, readout, loadWood(harness), ([geometry, textures, env]) => {
    harness.scene.environment = env;
    standBand(harness, geometry, wood(textures));
    const { map, roughnessMap } = textures;

    // A texture's color space is applied when it's uploaded, so changing it needs needsUpdate.
    const set = (mapSpace: THREE.ColorSpace, roughnessSpace: THREE.ColorSpace, lines: string[]) => {
      if (map.colorSpace !== mapSpace) {
        map.colorSpace = mapSpace;
        map.needsUpdate = true;
      }
      if (roughnessMap.colorSpace !== roughnessSpace) {
        roughnessMap.colorSpace = roughnessSpace;
        roughnessMap.needsUpdate = true;
      }
      readout.innerHTML = lines.join('<br>');
    };
    choiceButtons(buttonGroup(bar), [
      {
        html: 'correct',
        select: () =>
          set(THREE.SRGBColorSpace, THREE.NoColorSpace, [
            'map.colorSpace = THREE.SRGBColorSpace; // roughnessMap left at NoColorSpace',
            'roughness 0.297 × the gray: 0.13 on dark grain, 0.22 on pale wood',
          ]),
      },
      {
        html: 'color map left linear',
        select: () =>
          set(THREE.NoColorSpace, THREE.NoColorSpace, [
            'map.colorSpace = THREE.NoColorSpace; map.needsUpdate = true;',
            "the file's sRGB numbers used as light: every color too bright, pale and washed out",
          ]),
      },
      {
        html: 'roughness map marked sRGB',
        select: () =>
          set(THREE.SRGBColorSpace, THREE.SRGBColorSpace, [
            'roughnessMap.colorSpace = THREE.SRGBColorSpace; roughnessMap.needsUpdate = true;',
            'decoded as if it were color: roughness 0.05 to 0.14, so too glossy everywhere',
          ]),
      },
    ]);
  });
};

// Why it works: the roughness map on and off, close up, plus your own image.
const FLAT_ROUGHNESS = 0.18; // the roughness map's middle value times 0.297: only the variation goes

export const grain: SceneSetup = (harness) => {
  const { camera, controls, container } = harness;
  jewelryStage(harness);
  camera.position.set(1.8, 1.7, 1.8);
  controls.target.set(0, 1.1, 0);
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');

  whenLoaded(container, readout, loadWood(harness), ([geometry, textures, env]) => {
    harness.scene.environment = env;
    const material = wood(textures);
    standBand(harness, geometry, material);

    let maps = textures;
    let roughness: number | null = null; // null: the map is on
    let source = 'the wood';
    const apply = () => {
      material.map = maps.map;
      // Adding or removing a map changes which shader three.js builds, so it needs needsUpdate.
      material.roughnessMap = roughness === null ? maps.roughnessMap : null;
      material.roughness = roughness ?? WOOD.roughness;
      material.needsUpdate = true;
      readout.innerHTML = (
        roughness === null
          ? [
              `material.roughnessMap = roughnessMap; // ${source}`,
              maps === textures ? 'roughness 0.297 × the gray: the dark grain is a little glossier' : 'roughness 0.297 × its green channel: darker spots are glossier',
            ]
          : [
              `material.roughnessMap = null; material.roughness = ${roughness}; material.needsUpdate = true;`,
              roughness === WOOD.roughness
                ? 'the map deleted: every spot at 0.297, so the whole band is duller'
                : 'one gloss everywhere, at the map\'s average: only inside highlights does it change',
            ]
      ).join('<br>');
    };
    choiceButtons(buttonGroup(bar), [
      { html: 'roughness map on', select: () => ((roughness = null), apply()) },
      { html: 'off, 0.297', select: () => ((roughness = WOOD.roughness), apply()) },
      { html: 'off, 0.18', select: () => ((roughness = FLAT_ROUGHNESS), apply()) },
    ]);

    // Your own seamless image: one download, two Textures. The color one is marked sRGB; the other
    // stays at NoColorSpace, and the roughness code reads its green channel as the gray copy.
    const picker = document.createElement('label');
    picker.innerHTML = 'your own image <input type="file" accept="image/*">';
    bar.append(picker);
    picker.querySelector('input')!.addEventListener('change', async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      try {
        const map = await new THREE.TextureLoader().loadAsync(url);
        map.colorSpace = THREE.SRGBColorSpace;
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        const roughnessMap = map.clone(); // shares the image, so no second download
        roughnessMap.colorSpace = THREE.NoColorSpace;
        maps.map.dispose();
        maps.roughnessMap.dispose();
        maps = { map, roughnessMap };
        source = `the green channel of ${file.name}`;
        apply();
      } finally {
        URL.revokeObjectURL(url);
      }
    });
  });
};

// Why it works: texel density. Spring's units read as centimeters (a ring 2.2 cm across with a
// 5.6 mm band, a real ring's size), so the texture's density and the screen's are both pixels per cm.
const SIZES = [1024, 512, 256, 128, 64, 32, 16];

// The same tile stored smaller, each halved from the one before, the way mipmaps are made.
function shrunk(texture: THREE.Texture) {
  const copies = new Map<number, THREE.Texture>([[SIZES[0], texture]]);
  let source = texture.image as CanvasImageSource; // an <img>, from TextureLoader
  for (const size of SIZES.slice(1)) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const context = canvas.getContext('2d')!;
    context.imageSmoothingQuality = 'high';
    context.drawImage(source, 0, 0, size, size);
    const copy = new THREE.CanvasTexture(canvas);
    copy.colorSpace = texture.colorSpace;
    copy.wrapS = copy.wrapT = THREE.RepeatWrapping;
    copy.flipY = texture.flipY;
    copies.set(size, copy);
    source = canvas;
  }
  return copies;
}

export const density: SceneSetup = (harness) => {
  const { camera, controls, container, renderer, onFrame } = harness;
  jewelryStage(harness);
  camera.position.set(2.6, 2.1, 2.6);
  controls.target.set(0, 1.25, 0);
  controls.minDistance = 0.5;
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');

  whenLoaded(container, readout, loadWood(harness), ([geometry, textures, env]) => {
    harness.scene.environment = env;
    const maps = shrunk(textures.map);
    const roughnessMaps = shrunk(textures.roughnessMap);
    const material = wood(textures);
    const colored = triplanarMaterial({ debug: 'density', side: THREE.DoubleSide });
    const mesh = standBand(harness, geometry, material);

    let size = SIZES[0];
    let covers = 1; // cm of ring one tile covers
    let view: 'wood' | 'texels' | 'colored' = 'wood';
    const update = () => {
      material.map = maps.get(size)!;
      material.roughnessMap = roughnessMaps.get(size)!;
      for (const uniforms of [material.userData.triplanar, colored.userData.triplanar]) uniforms.scale.value = 1 / covers;
      colored.userData.triplanar.texels.value = size;
      // Nearest skips the smoothing between texels, so each one shows as a square. A filter applies
      // when the texture is uploaded, so changing it needs needsUpdate.
      const filter = view === 'texels' ? THREE.NearestFilter : THREE.LinearFilter;
      for (const texture of [...maps.values(), ...roughnessMaps.values()]) {
        if (texture.magFilter === filter) continue;
        texture.magFilter = filter;
        texture.needsUpdate = true;
      }
      mesh.material = view === 'colored' ? colored : material;
    };

    // What the screen shows right now: its height in device pixels over the centimeters it spans at
    // the ring's middle. Nearer parts of the ring get more; the colored view shows every spot.
    let shown = '';
    onFrame(() => {
      const distance = camera.position.distanceTo(controls.target);
      const visible = 2 * distance * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const screen = renderer.domElement.height / visible;
      const texture = size / covers;
      const ratio = texture / screen;
      const verdict =
        ratio < 1 ? `texture below the screen: each texel spread over ${formatNumber(1 / ratio, 1)} screen pixels, so blurry`
        : ratio < 2 ? 'about one texel per screen pixel: as sharp as this screen shows, nothing wasted'
        : `texture above the screen: the GPU reads about the ${size / 2 ** Math.floor(Math.log2(ratio))}² copy; the rest is never seen`;
      const html = [
        `texel density: ${formatNumber(texture, 1)} px/cm (a ${size}² tile covering ${formatNumber(covers)} cm)`,
        `screen right now: ${Math.round(screen)} px/cm at the ring's middle; zoom to change it`,
        verdict,
        `GPU memory: ${formatBytes((size * size * 4 * 4) / 3)} per map, mipmaps included`,
      ].join('<br>');
      if (html !== shown) readout.innerHTML = shown = html;
    });

    choiceButtons(
      buttonGroup(bar, 'file'),
      SIZES.map((s) => ({ html: `${s}²`, select: () => ((size = s), update()) })),
    );
    slider(bar, 'tile covers (cm)', { min: 0.25, max: 4, step: 0.25, value: covers }, (value) => {
      covers = value;
      update();
    });
    choiceButtons(buttonGroup(bar, 'view'), [
      { html: 'wood', select: () => ((view = 'wood'), update()) },
      { html: 'texels', select: () => ((view = 'texels'), update()) },
      { html: 'sharp enough?', select: () => ((view = 'colored'), update()) },
    ]);
  });
};
