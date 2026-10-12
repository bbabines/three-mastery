import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { watchLab, type ProductLab } from '../lab';

function shadowRig(lab: ProductLab) {
  const { scene, renderer } = lab.harness;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  lab.model.traverse((object) => { if (object instanceof THREE.Mesh) { object.castShadow = object.material instanceof THREE.MeshStandardMaterial && object.material.name !== 'glass'; object.receiveShadow = true; } });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), new THREE.MeshStandardMaterial({ color: 0xb8b8b8, roughness: 0.9 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.015;
  floor.receiveShadow = true;
  const sun = new THREE.DirectionalLight(0xffffff, 2.5);
  sun.position.set(-3, 6, 4);
  sun.target.position.set(0, 1, 0);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 14;
  sun.shadow.bias = -0.0001;
  sun.shadow.normalBias = 0.01;
  const frustum = (width: number) => {
    Object.assign(sun.shadow.camera, { left: -width, right: width, top: width, bottom: -width });
    sun.shadow.camera.updateProjectionMatrix();
    sun.shadow.needsUpdate = true;
  };
  frustum(3.5);
  scene.add(floor, sun, sun.target);
  scene.environmentIntensity = 0.5;
  lab.onLeave(() => { scene.remove(floor, sun, sun.target); floor.geometry.dispose(); floor.material.dispose(); sun.dispose(); });
  return { sun, frustum };
}

export const clinic: SceneSetup = (harness) => watchLab(harness, (lab) => {
  const { sun, frustum } = shadowRig(lab);
  const helper = new THREE.CameraHelper(sun.shadow.camera);
  helper.visible = false;
  harness.scene.add(helper);
  let width = 3.5;
  const read = () => { helper.update(); lab.setReadout(`PCF shadow: ${sun.shadow.mapSize.x} × ${sun.shadow.mapSize.y}; frustum width ${(width * 2).toFixed(1)}\nBias ${sun.shadow.bias.toFixed(4)}, normalBias ${sun.shadow.normalBias.toFixed(3)}\nOne directional light → one shadow view; texel width ≈ ${(2 * width / sun.shadow.mapSize.x).toFixed(4)} world units\nInspect strap contact and case self-shadow. The map does not supply bounced light.`); };
  const size = (value: number) => { sun.shadow.map?.dispose(); sun.shadow.map = null; sun.shadow.mapSize.set(value, value); sun.shadow.needsUpdate = true; read(); };
  lab.addSelect('Shadow resolution', { '256': () => size(256), '1024': () => size(1024), '2048': () => size(2048) });
  lab.addSlider('Frustum half-width', 0.5, 8, 0.25, width, (v) => { width = v; frustum(width); read(); });
  lab.addSlider('Depth bias', -0.005, 0.01, 0.0001, sun.shadow.bias, (v) => { sun.shadow.bias = v; read(); });
  lab.addSlider('Normal bias', 0, 0.2, 0.005, sun.shadow.normalBias, (v) => { sun.shadow.normalBias = v; read(); });
  lab.addSelect('Shadow camera', { Hidden: () => { helper.visible = false; }, Visible: () => { helper.visible = true; helper.update(); } });
  lab.addButton('Restore useful settings', () => { width = 3.5; frustum(width); sun.shadow.bias = -0.0001; sun.shadow.normalBias = 0.01; size(1024); });
  lab.registerEvidence(() => ({ resolution: sun.shadow.mapSize.x, frustumWidth: width * 2, bias: sun.shadow.bias, normalBias: sun.shadow.normalBias }));
  lab.onLeave(() => { harness.scene.remove(helper); helper.dispose(); });
  read();
});

export const stale: SceneSetup = (harness) => watchLab(harness, (lab) => {
  const { sun } = shadowRig(lab);
  let frozen = false, move = 0, lift = 0, refreshes = 0;
  const read = () => lab.setReadout(`Shadow map ${frozen ? 'FROZEN' : 'live'}; object offset ${move.toFixed(2)}, lift ${lift.toFixed(2)}\nshadow.autoUpdate = ${sun.shadow.autoUpdate}; manual refreshes ${refreshes}\nMove the watch after freezing: old shadows remain at the captured placement.\nA frozen depth map demonstrates stale shadow data, not a progressive shadow baker.`);
  const refresh = () => { sun.shadow.needsUpdate = true; harness.renderer.render(harness.scene, harness.camera); refreshes++; read(); };
  lab.addSelect('Map updates', {
    Live: () => { frozen = false; sun.shadow.autoUpdate = true; sun.shadow.needsUpdate = true; read(); },
    'Freeze current placement': () => { refresh(); frozen = true; sun.shadow.autoUpdate = false; read(); },
  });
  lab.addSlider('Move watch horizontally', -1.5, 1.5, 0.1, move, (v) => { move = v; lab.model.position.x = v; read(); });
  lab.addSlider('Lift off ground', 0, 1.5, 0.1, lift, (v) => { lift = v; lab.model.position.y = v; read(); });
  lab.addButton('Refresh frozen map', refresh);
  lab.registerEvidence(() => ({ frozen, move, lift, refreshes }));
  read();
});
