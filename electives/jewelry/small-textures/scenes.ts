import { buttonGroup, choiceButtons, formatNumber, overlay, slider } from '@harness/lesson';
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

// The stage for a wood scene: the band standing on its edge, seen from in front and a little above.
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
  camera.position.set(2.3, 1.9, 2.3);
  controls.target.set(0, 1.1, 0);
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');

  whenLoaded(container, readout, loadWood(harness), ([geometry, textures, env]) => {
    harness.scene.environment = env;
    const uvMapped = new THREE.MeshStandardMaterial({ ...textures, color: WOOD.color, roughness: WOOD.roughness, metalness: WOOD.metalness, side: THREE.DoubleSide });
    const projected = wood(textures);
    const projectors = triplanarMaterial({ debug: true, roughness: 0.6, side: THREE.DoubleSide });
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
  camera.position.set(2.3, 1.9, 2.3);
  controls.target.set(0, 1.1, 0);
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
            'decoded as if it were color: roughness 0.05 to 0.14, glossy like wet varnish',
          ]),
      },
    ]);
  });
};

// Why it works: the roughness map on and off, on a slowly turning band, plus your own image.
const FLAT_ROUGHNESS = 0.18; // the roughness map's middle value times 0.297, so only the variation goes

export const grain: SceneSetup = (harness) => {
  const { camera, controls, container, onFrame } = harness;
  jewelryStage(harness);
  camera.position.set(1.5, 1.5, 1.5);
  controls.target.set(0, 1, 0);
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');

  whenLoaded(container, readout, loadWood(harness), ([geometry, textures, env]) => {
    harness.scene.environment = env;
    const material = wood(textures);
    const mesh = standBand(harness, geometry, material);
    onFrame((delta) => {
      mesh.rotation.y += delta * 0.25;
    });

    let maps = textures;
    let mapOn = true;
    let source = 'the wood';
    const apply = () => {
      material.map = maps.map;
      // Adding or removing a map changes which shader three.js builds, so it needs needsUpdate.
      material.roughnessMap = mapOn ? maps.roughnessMap : null;
      material.roughness = mapOn ? WOOD.roughness : FLAT_ROUGHNESS;
      material.needsUpdate = true;
      readout.innerHTML = (
        mapOn
          ? [
              `material.roughnessMap = roughnessMap; // ${source}`,
              'darker grain is glossier, so reflections break along the grain',
            ]
          : [
              `material.roughnessMap = null; material.roughness = ${FLAT_ROUGHNESS}; material.needsUpdate = true;`,
              'one gloss everywhere: the same average, but the grain looks printed on',
            ]
      ).join('<br>');
    };
    choiceButtons(buttonGroup(bar), [
      { html: 'roughness map on', select: () => ((mapOn = true), apply()) },
      { html: 'off', select: () => ((mapOn = false), apply()) },
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
