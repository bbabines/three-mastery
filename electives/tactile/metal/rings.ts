// The ring bench: four plain polished bands, one per metal, with the same metalness and roughness,
// so every difference on the page comes from the light. Lights: the HDRI (always), and one extra
// light a page can switch on: a key DirectionalLight, a RectAreaLight softbox, or an AmbientLight.
// Units are meters.
import { hideFloorHelpers } from '@harness/lesson';
import type { Harness } from '@harness/scene';
import { onLeave } from '@harness/teardown';
import * as THREE from 'three';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { environmentSwitcher, MISSING_ASSETS, releaseSharedTextures, type KeyStage } from '../bench';
import { RING_METALS, RING_ROUGHNESS } from '../catalog';

// A plain comfort-fit band, US size 7: 17.3 mm inside, 5 mm wide, 1.8 mm thick, domed outside and
// gently rounded inside. Its cross-section is a superellipse (between an oval and a rectangle),
// spun around the ring's axis.
export function bandGeometry() {
  const inner = 0.00865, thickness = 0.0018, width = 0.005;
  const center = inner + thickness / 2;
  const points: THREE.Vector2[] = [];
  const steps = 96;
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * Math.PI * 2 - Math.PI / 2;
    const [c, s] = [Math.cos(angle), Math.sin(angle)];
    const shape = (v: number) => Math.sign(v) * Math.abs(v) ** (2 / 3); // exponent 3: a rounded box
    points.push(new THREE.Vector2(center + (thickness / 2) * shape(c), (width / 2) * shape(s)));
  }
  return new THREE.LatheGeometry(points, 160);
}

export type ExtraLight = 'none' | 'key' | 'softbox' | 'ambient';

export const LIGHT_NOTES: Record<ExtraLight, string> = {
  none: 'the HDRI only:\nevery bit of each ring is a reflection of the room',
  key: 'DirectionalLight: one tiny hot dot per ring, plus a shadow.\nA mirror shows a light at its true size, and this one has none',
  softbox: 'RectAreaLight: a soft panel, reflected as a bright band\nacross each ring, the way jewelry photographers light',
  ambient: 'AmbientLight: no change on the rings.\nPure metal has no diffuse part for it to light',
};

export interface RingBench extends KeyStage {
  rings: THREE.Mesh<THREE.LatheGeometry, THREE.MeshPhysicalMaterial>[];
  softbox: THREE.RectAreaLight;
  ambient: THREE.AmbientLight;
  light: ExtraLight;
  setLight(which: ExtraLight): void;
}

let areaLightsReady = false;

export function createRingBench(harness: Harness, height = 400): RingBench {
  const { scene, renderer, camera, controls, container } = harness;
  container.style.height = `${height}px`;
  releaseSharedTextures(harness);
  hideFloorHelpers(scene);
  const sky = scene.children.find((child) => child instanceof THREE.HemisphereLight);
  if (sky) sky.visible = false;
  scene.background = new THREE.Color(0x2b2e34);
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.shadowMap.enabled = true;
  if (!areaLightsReady) {
    RectAreaLightUniformsLib.init(); // RectAreaLight needs its lookup tables loaded once
    areaLightsReady = true;
  }

  camera.fov = 30;
  camera.near = 0.005;
  camera.far = 5;
  camera.updateProjectionMatrix();
  camera.position.set(0, 0.035, 0.145);
  controls.target.set(0, 0.01, 0);
  controls.minDistance = 0.04;
  controls.maxDistance = 0.6;
  controls.maxPolarAngle = THREE.MathUtils.degToRad(88);

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.MeshStandardMaterial({ color: 0x3a3d44, roughness: 0.9 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Four rings standing on edge in a row, each turned 35° so you see its face and its hole.
  const geometry = bandGeometry();
  const outer = 0.00865 + 0.0018;
  const rings = RING_METALS.map((metal, index) => {
    const material = new THREE.MeshPhysicalMaterial({ metalness: 1, roughness: RING_ROUGHNESS });
    if (typeof metal.color === 'number') material.color.set(metal.color); // sRGB hex
    else material.color.setRGB(...metal.color); // linear, the working color space
    const ring = new THREE.Mesh(geometry, material);
    ring.rotation.x = Math.PI / 2; // the lathe spins around y; this stands the ring on its edge
    ring.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(35));
    ring.position.set((index - 1.5) * 0.025, outer, 0);
    ring.castShadow = ring.receiveShadow = true;
    scene.add(ring);
    return ring;
  });

  const key = new THREE.DirectionalLight(0xffffff, 3);
  key.target.position.set(0, 0.01, 0);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -0.08, right: 0.08, top: 0.08, bottom: -0.08, near: 0.05, far: 2 });
  key.shadow.camera.updateProjectionMatrix();
  key.shadow.normalBias = 0.0003;
  key.shadow.radius = 3;
  scene.add(key, key.target);

  // A strip softbox, 60 × 20 cm, above and in front, facing the rings: the long light jewelry
  // photographers use to lay one bright band along every band.
  const softbox = new THREE.RectAreaLight(0xffffff, 8, 0.6, 0.2);
  softbox.position.set(0, 0.25, 0.12);
  softbox.lookAt(0, 0.01, 0);
  scene.add(softbox);

  const ambient = new THREE.AmbientLight(0xffffff, 1.5);
  scene.add(ambient);

  const listeners: (() => void)[] = [];
  const switchEnvironment = environmentSwitcher(harness);
  onLeave(container, () => geometry.dispose());

  const bench: RingBench = {
    harness,
    rings,
    key,
    softbox,
    ambient,
    light: 'none',
    keyAngles: { around: 0, above: 0 },
    hdriId: null,
    async setHdri(id) {
      bench.hdriId = id;
      if (await switchEnvironment(id)) bench.refresh();
    },
    setKey(around, above) {
      bench.keyAngles = { around, above };
      const a = THREE.MathUtils.degToRad(around);
      const e = THREE.MathUtils.degToRad(above);
      key.position.set(Math.sin(a) * Math.cos(e), Math.sin(e), Math.cos(a) * Math.cos(e)).multiplyScalar(0.5).add(key.target.position);
      bench.refresh();
    },
    setLight(which) {
      bench.light = which;
      key.visible = which === 'key';
      softbox.visible = which === 'softbox';
      ambient.visible = which === 'ambient';
      bench.refresh();
    },
    refresh() {
      for (const listener of listeners) listener();
    },
    onChange(listener) {
      listeners.push(listener);
    },
  };
  bench.setKey(-50, 40);
  bench.setLight('none');
  return bench;
}

// Loads the first HDRI, then calls `ready`, unless the page was left first.
export function whenRingsReady(bench: RingBench, readout: HTMLElement, hdri: string, ready: () => void) {
  let left = false;
  onLeave(bench.harness.container, () => {
    left = true;
  });
  readout.textContent = 'Loading…';
  bench.setHdri(hdri).then(
    () => {
      if (!left) ready();
    },
    () => {
      readout.textContent = MISSING_ASSETS;
    },
  );
}
