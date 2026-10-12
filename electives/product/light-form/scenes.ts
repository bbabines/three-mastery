import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { watchLab } from '../lab';

// Area lights need their LTC lookup textures with WebGLRenderer.
RectAreaLightUniformsLib.init();

export const shape: SceneSetup = (harness) => watchLab(harness, (lab) => {
  const { scene } = harness;
  lab.setEnvironment('uniform');
  scene.environmentIntensity = 0.06;
  const target = new THREE.Vector3(0, 1.2, 0);
  const key = new THREE.RectAreaLight(0xffffff, 12, 2, 2);
  const fill = new THREE.DirectionalLight(0xffffff, 0.2);
  fill.position.set(0, 2, 4);
  scene.add(key, fill);
  let angle = 60, width = 2, ratio = 0.2, finish = 'reference';
  const original = lab.strap.color.clone();
  const metalness = lab.strap.metalness;
  const update = () => {
    const radians = THREE.MathUtils.degToRad(angle);
    key.position.set(Math.sin(radians) * 4, 2.6, Math.cos(radians) * 4);
    key.lookAt(target);
    key.width = width;
    key.height = width;
    fill.intensity = ratio;
    lab.setReadout(`Area key: ${angle}° around product, ${width.toFixed(1)} × ${width.toFixed(1)} units\nArea intensity 12; directional fill ${ratio.toFixed(2)} (different source types; not a physical ratio)\nStrap: ${finish}; normal scale remains (0.3, −0.3)\nOrbit to inspect grain and case edges. Area lights have no native shadows.`);
  };
  lab.addSlider('Key direction (degrees)', -180, 180, 5, angle, (v) => { angle = v; update(); });
  lab.addSlider('Source width and height', 0.25, 4, 0.25, width, (v) => { width = v; update(); });
  lab.addSlider('Directional fill intensity', 0, 3, 0.05, ratio, (v) => { ratio = v; update(); });
  lab.addSelect('Strap test', {
    'Reference blue leather': () => { finish = 'reference'; lab.strap.color.copy(original); lab.strap.metalness = metalness; update(); },
    'Black dielectric': () => { finish = 'black dielectric'; lab.strap.color.setRGB(0.008, 0.008, 0.008); lab.strap.metalness = 0; update(); },
    'White dielectric': () => { finish = 'white dielectric'; lab.strap.color.setRGB(0.75, 0.75, 0.75); lab.strap.metalness = 0; update(); },
  });
  lab.registerEvidence(() => ({ angle, sourceWidth: width, areaIntensity: key.intensity, directionalFill: ratio, finish }));
  lab.onLeave(() => { scene.remove(key, fill); key.dispose(); fill.dispose(); });
  update();
});

export const falloff: SceneSetup = (harness) => watchLab(harness, (lab) => {
  const { scene } = harness;
  lab.setEnvironment('uniform');
  scene.environmentIntensity = 0.03;
  const point = new THREE.PointLight(0xffffff, 80, 0, 2);
  const spot = new THREE.SpotLight(0xffffff, 80, 0, Math.PI / 4, 0.3, 2);
  spot.target.position.set(0, 1.2, 0);
  scene.add(point, spot, spot.target);
  let distance = 3, compensate = false, cutoff = 0, kind = 'point', beam = 45;
  const update = () => {
    const intensity = 80 * (compensate ? (distance / 3) ** 2 : 1);
    for (const light of [point, spot]) {
      light.position.set(0, 1.2, distance);
      light.intensity = intensity;
      light.distance = cutoff;
    }
    point.visible = kind === 'point'; spot.visible = kind === 'spot';
    spot.angle = THREE.MathUtils.degToRad(beam);
    const window = cutoff > 0 ? Math.max(0, 1 - (distance / cutoff) ** 4) ** 2 : 1;
    lab.setReadout(`${kind}: distance ${distance.toFixed(1)}, intensity ${intensity.toFixed(1)}, decay 2\nAt target: distance multiplier ${(window / distance ** 2).toFixed(4)} (before material and tone mapping)\nCutoff ${cutoff === 0 ? 'disabled' : cutoff}; spot half-angle ${beam}°\nDistance compensation matches the target only, and cannot cancel a cutoff.`);
  };
  lab.addSlider('Distance from target', 2, 8, 0.25, distance, (v) => { distance = v; update(); });
  lab.addSlider('Cutoff (0 = none)', 0, 12, 0.5, cutoff, (v) => { cutoff = v; update(); });
  lab.addSlider('Spot half-angle', 10, 80, 5, beam, (v) => { beam = v; update(); });
  lab.addSelect('Source', { Point: () => { kind = 'point'; update(); }, Spot: () => { kind = 'spot'; update(); } });
  lab.addSelect('Compensation', { 'Fixed intensity': () => { compensate = false; update(); }, 'Preserve target falloff': () => { compensate = true; update(); } });
  lab.registerEvidence(() => ({ kind, distance, cutoff, beam, compensate, intensity: point.intensity }));
  lab.onLeave(() => { scene.remove(point, spot, spot.target); point.dispose(); spot.dispose(); });
  update();
});
