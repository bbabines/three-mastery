import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { watchLab } from '../lab';

export const directions: SceneSetup = (harness) => watchLab(harness, (lab) => {
  const { camera, controls, scene } = harness;
  const original = lab.model.quaternion.clone();
  const studioRotation = scene.environmentRotation.y;
  let mode = 'camera';
  let turn = 0;
  let elevation = 25;
  const radius = camera.position.distanceTo(controls.target);
  function apply() {
    const angle = THREE.MathUtils.degToRad(turn);
    const polar = THREE.MathUtils.degToRad(90 - elevation);
    lab.model.quaternion.copy(original);
    scene.environmentRotation.y = studioRotation;
    camera.position.setFromSphericalCoords(radius, polar, mode === 'camera' ? angle : 0).add(controls.target);
    if (mode === 'product') lab.model.rotateY(angle);
    if (mode === 'environment') scene.environmentRotation.y = studioRotation + angle;
    controls.update();
    lab.setReadout(`changing ${mode}: ${turn}°\nelevation ${elevation}° · fixed exposure and materials\nCompare case highlights and leather grain.`);
  }
  lab.addSelect('rotate', { camera: () => { mode = 'camera'; apply(); }, product: () => { mode = 'product'; apply(); }, environment: () => { mode = 'environment'; apply(); } });
  lab.addSlider('turn', 0, 360, 15, turn, (v) => { turn = v; apply(); });
  lab.addSlider('elevation', 5, 75, 5, elevation, (v) => { elevation = v; apply(); });
  lab.addSelect('lighting', { reference: () => lab.setEnvironment('reference'), 'graduated panels': () => lab.setEnvironment('panels'), uniform: () => lab.setEnvironment('uniform') });
  lab.registerEvidence(() => ({ mode, turn, elevation, productQuaternion: lab.model.quaternion.toArray(), environmentRotation: scene.environmentRotation.toArray() }));
  apply();
});

export const matrix: SceneSetup = (harness) => watchLab(harness, (lab) => {
  const { camera, controls } = harness;
  const metal = lab.materials.get('metal');
  const color = metal?.color.clone();
  const roughness = metal?.roughness ?? 0.048;
  const strapColor = lab.strap.color.clone();
  let finish = 'source silver';
  let zoom = 1;
  let count = 4;
  let width = 0.35;
  const radius = camera.position.distanceTo(controls.target);
  controls.minDistance = radius * 0.75;
  controls.maxDistance = radius * 1.4;
  function panels() { lab.setPanels({ count, width, softness: 0.6, background: 0.16 }); }
  function report() { lab.setReadout(`finish: ${finish} · view distance ×${zoom.toFixed(2)}\npanels ${count} · width ${width.toFixed(2)}\nExport each finish at both zoom limits; inspect every tile.`); }
  lab.addSelect('finish', {
    'source silver': () => { finish = 'source silver'; if (metal && color) { metal.color.copy(color); metal.roughness = roughness; } lab.strap.color.copy(strapColor); report(); },
    'warm metal / chestnut': () => { finish = 'warm metal / chestnut'; metal?.color.setHex(0xc9a965); if (metal) metal.roughness = 0.15; lab.strap.color.setHex(0x693b25); report(); },
    'satin / black': () => { finish = 'satin / black'; metal?.color.setHex(0xb7b7b7); if (metal) metal.roughness = 0.32; lab.strap.color.setHex(0x151515); report(); },
  });
  lab.addSlider('view distance', 0.75, 1.4, 0.05, zoom, (v) => { zoom = v; camera.position.sub(controls.target).setLength(radius * zoom).add(controls.target); controls.update(); report(); });
  lab.addSlider('panel count', 1, 8, 1, count, (v) => { count = v; panels(); report(); });
  lab.addSlider('panel width', 0.1, 0.8, 0.05, width, (v) => { width = v; panels(); report(); });
  lab.addButton('capture finish orbit', () => lab.captureOrbit());
  lab.registerEvidence(() => ({ finish, zoom, panels: { count, width, softness: 0.6, background: 0.16 }, testedElevations: [15, 35, 65], note: 'Orbit sheet is evidence to inspect, not an automatic realism score.' }));
  panels(); report();
});
