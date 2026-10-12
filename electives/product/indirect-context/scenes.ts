import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { watchLab } from '../lab';

RectAreaLightUniformsLib.init();

// Synthetic UV fields teach the data flow. They are not a bake of this watch.
function field(kind: 'ao' | 'light') {
  const size = 64, data = new Float32Array(size * size * 4);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const value = kind === 'ao' ? 0.2 + 0.8 * Math.abs((x / (size - 1)) * 2 - 1) : 0.05 + 0.65 * y / (size - 1);
    data.set(kind === 'ao' ? [value, value, value, 1] : [value, value * 0.7, value * 0.4, 1], (y * size + x) * 4);
  }
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.FloatType);
  texture.colorSpace = THREE.NoColorSpace;
  texture.channel = 0;
  texture.needsUpdate = true;
  return texture;
}

export const contributions: SceneSetup = (harness) => watchLab(harness, (lab) => {
  const { scene } = harness;
  // Every contribution is switched by hand: no reference key light or ground, and no screen-space
  // AO from the finishing chain (it would darken direct light too). The studio stays put in the world.
  lab.setReferenceLook({ light: false, ground: false, finishing: false, studioFollowsCamera: false });
  lab.setEnvironment('uniform');
  const direct = new THREE.DirectionalLight(0xffffff, 2);
  direct.position.set(-4, 3, 3);
  const fill = new THREE.DirectionalLight(0xffc08a, 0);
  fill.position.set(3, 1.5, -2);
  const probe = new THREE.LightProbe();
  probe.sh.coefficients[0].set(0.7, 0.5, 0.3);
  probe.intensity = 0;
  scene.add(direct, fill, probe);
  const ao = field('ao'), light = field('light');
  let mode = 'direct only';
  // Leather is a dielectric in this diagnostic; reference metallic blending is shown in unit 3.
  lab.strap.metalness = 0;
  const choose = (which: string) => {
    mode = which;
    scene.environmentIntensity = which === 'direct + environment' || which === 'AO removes indirect light' ? 0.7 : 0;
    fill.intensity = which === 'authored warm fill' ? 0.9 : 0;
    probe.intensity = which === 'authored diffuse probe' ? 1 : 0;
    lab.strap.aoMap = which === 'AO removes indirect light' || which === 'AO without indirect light' ? ao : null;
    lab.strap.lightMap = which === 'synthetic UV lightmap' ? light : null;
    lab.strap.aoMapIntensity = 1;
    lab.strap.lightMapIntensity = 1;
    lab.strap.needsUpdate = true;
    lab.setReadout(`${mode}; direct light stays on\nFill: ${fill.intensity}; diffuse probe: ${probe.intensity}; environment: ${scene.environmentIntensity}\nSynthetic AO subtracts indirect response; synthetic lightmap adds diffuse irradiance.\nNeither texture is baked from the watch. Probe coefficients are authored, not measured GI.`);
  };
  lab.addSelect('Contribution', Object.fromEntries(['direct only', 'authored warm fill', 'authored diffuse probe', 'AO without indirect light', 'direct + environment', 'AO removes indirect light', 'synthetic UV lightmap'].map((name) => [name, () => choose(name)])));
  lab.addSlider('Move watch (maps stay in UVs)', -1.5, 1.5, 0.1, 0, (v) => { lab.model.position.x = v; });
  lab.registerEvidence(() => ({ mode, syntheticTextures: true, probeAuthored: true, watchX: lab.model.position.x, strapMetalness: lab.strap.metalness }));
  lab.onLeave(() => { scene.remove(direct, fill, probe); direct.dispose(); fill.dispose(); probe.dispose(); ao.dispose(); light.dispose(); });
  choose(mode);
});

export const context: SceneSetup = (harness) => watchLab(harness, (lab) => {
  const { scene } = harness;
  // A room with its own sources: every bright region must trace to one of them, so the reference
  // key light, ground, and finishing chain are off and the studio stays put in the world.
  lab.setReferenceLook({ light: false, ground: false, finishing: false, studioFollowsCamera: false });
  scene.environmentIntensity = 0.35;
  const window = new THREE.RectAreaLight(0xe4efff, 5, 3, 4);
  window.position.set(-4, 3, 1); window.lookAt(0, 1.2, 0);
  const practical = new THREE.PointLight(0xffb36a, 12, 0, 2);
  practical.position.set(2, 2, -1);
  const bounce = new THREE.DirectionalLight(0xffd6b3, 0);
  bounce.position.set(3, 1, 0);
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(9, 6), new THREE.MeshStandardMaterial({ color: 0xad6244, roughness: 1, side: THREE.DoubleSide }));
  wall.position.set(0, 2, -3);
  scene.add(window, practical, bounce, wall);
  let setup = 'daylight', approximation = false, fog = false, wallShown = true;
  for (const material of lab.materials.values()) { material.fog = true; material.needsUpdate = true; }
  const update = () => {
    window.intensity = setup === 'daylight' ? 5 : 0;
    practical.intensity = setup === 'night practical' ? 28 : 2;
    bounce.intensity = approximation ? 0.7 : 0;
    wall.visible = wallShown;
    scene.fog = fog ? new THREE.Fog(0xe1d6cc, 4, 14) : null;
    lab.setReadout(`${setup}; colored wall ${wallShown ? 'visible' : 'hidden'}; authored bounce fill ${approximation ? 'on' : 'off'}\nThe wall receives light but supplies no computed bounce or environment reflection.\nFog ${fog ? 'on: distance 4–14' : 'off'}: atmospheric attenuation, not volumetric beams\nReference environment remains fixed. Rotate and explain every bright region by its source.`);
  };
  lab.addSelect('Motivated setup', { Daylight: () => { setup = 'daylight'; update(); }, 'Night practical': () => { setup = 'night practical'; update(); } });
  lab.addSelect('Bounce approximation', { Off: () => { approximation = false; update(); }, 'Authored warm fill': () => { approximation = true; update(); } });
  lab.addSelect('Colored wall', { Visible: () => { wallShown = true; update(); }, Hidden: () => { wallShown = false; update(); } });
  lab.addSelect('Atmosphere', { Clear: () => { fog = false; update(); }, Fog: () => { fog = true; update(); } });
  lab.registerEvidence(() => ({ setup, approximation, wallShown, fog, computedBounce: false }));
  lab.onLeave(() => { scene.fog = null; scene.remove(window, practical, bounce, wall); wall.geometry.dispose(); wall.material.dispose(); window.dispose(); practical.dispose(); bounce.dispose(); });
  update();
});
