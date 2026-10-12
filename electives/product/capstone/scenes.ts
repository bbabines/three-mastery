import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { watchLab } from '../lab';

export const configurator: SceneSetup = (harness) => watchLab(harness, (lab) => {
  const { renderer, scene } = harness;
  const caseMaterials = ['metal', 'metal_cover'].map(name => lab.materials.get(name)).filter((m): m is THREE.MeshStandardMaterial => !!m);
  const sourceCase = caseMaterials.map(material => ({ material, color: material.color.clone(), roughness: material.roughness, metalness: material.metalness }));
  const sourceStrap = { color: lab.strap.color.clone(), metalness: lab.strap.metalness, roughness: lab.strap.roughness };
  let leather = 'source navy';
  let interpretation = 'source artist settings';
  let finish = 'source case';
  let count = 4;
  let width = 0.45;
  let softness = 0.7;
  let background = 0.12;
  let shadowEnabled = true;
  let lighting = 'authored panels';
  const floorGeometry = new THREE.PlaneGeometry(8, 8);
  const floorMaterial = new THREE.ShadowMaterial({ color: 0x171a20, opacity: 0.18 });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2; floor.position.y = 0.015; floor.receiveShadow = true;
  const light = new THREE.DirectionalLight(0xffffff, 0.55);
  light.position.set(4, 8, 5); light.target.position.set(0, 1, 0); light.castShadow = true;
  light.shadow.mapSize.set(1024, 1024);
  light.shadow.camera.left = light.shadow.camera.bottom = -3;
  light.shadow.camera.right = light.shadow.camera.top = 3;
  light.shadow.camera.near = 0.1; light.shadow.camera.far = 20;
  light.shadow.bias = -0.00015; light.shadow.normalBias = 0.015;
  scene.add(floor, light, light.target);
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap;
  // Ordinary shadow maps do not model transmission through the crystal.
  lab.model.traverse(object => {
    if (!(object instanceof THREE.Mesh)) return;
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    if (materials.some(material => material.name === 'glass')) object.castShadow = false;
  });
  lab.onLeave(() => light.shadow.dispose());
  function panels() { lighting = 'authored panels'; lightingSelect.value = lighting; lab.setPanels({ count, width, softness, background }); }
  function report() { lab.setReadout(`${leather} · ${interpretation}\n${finish} · ${lighting} · panels ${count} / width ${width.toFixed(2)}\nGround shadow ${shadowEnabled ? 'on' : 'off'} · softness ${softness.toFixed(2)} · export every finish.`); }
  lab.addSelect('leather color', {
    'source navy': () => { leather = 'source navy'; lab.strap.color.copy(sourceStrap.color); report(); },
    chestnut: () => { leather = 'chestnut'; lab.strap.color.setHex(0x693b25); report(); },
    black: () => { leather = 'black'; lab.strap.color.setHex(0x151515); report(); },
  });
  lab.addSelect('strap interpretation', {
    'source artist settings': () => { interpretation = 'source artist settings'; lab.strap.metalness = sourceStrap.metalness; lab.strap.roughness = sourceStrap.roughness; report(); },
    'dielectric leather': () => { interpretation = 'dielectric leather'; lab.strap.metalness = 0; lab.strap.roughness = sourceStrap.roughness; report(); },
  });
  lab.addSelect('case finish', {
    'source case': () => { finish = 'source case'; for (const entry of sourceCase) { entry.material.color.copy(entry.color); entry.material.roughness = entry.roughness; entry.material.metalness = entry.metalness; } report(); },
    'polished silver': () => { finish = 'polished silver'; for (const material of caseMaterials) { material.color.setHex(0xb8b8b8); material.roughness = 0.08; material.metalness = 1; } report(); },
    'satin gold': () => { finish = 'satin gold'; for (const material of caseMaterials) { material.color.setHex(0xc5a462); material.roughness = 0.3; material.metalness = 1; } report(); },
  });
  const lightingSelect = lab.addSelect('lighting', { 'authored panels': () => { panels(); report(); }, reference: () => { lighting = 'reference'; lab.setEnvironment('reference'); report(); }, 'uniform diagnostic': () => { lighting = 'uniform diagnostic'; lab.setEnvironment('uniform'); report(); } });
  lab.addSlider('panel count', 1, 8, 1, count, (v) => { count = v; panels(); report(); });
  lab.addSlider('panel width', 0.1, 0.9, 0.05, width, (v) => { width = v; panels(); report(); });
  lab.addSlider('panel softness', 0, 1, 0.1, softness, (v) => { softness = v; panels(); report(); });
  lab.addSlider('studio background', 0.02, 0.5, 0.02, background, (v) => { background = v; panels(); report(); });
  lab.addSelect('grounding', { 'restrained proxy': () => { shadowEnabled = true; floor.visible = light.castShadow = true; light.shadow.needsUpdate = true; report(); }, off: () => { shadowEnabled = false; floor.visible = light.castShadow = false; report(); } });
  lab.addSelect('quality', { 'DPR 1.5': () => renderer.setPixelRatio(1.5), 'DPR 1': () => renderer.setPixelRatio(1), 'DPR 2': () => renderer.setPixelRatio(2) });
  renderer.setPixelRatio(1.5);
  lab.addButton('capture configuration orbit', () => lab.captureOrbit());
  lab.registerEvidence(() => ({ leather, interpretation, finish, lighting, panels: { count, width, softness, background }, shadow: { enabled: shadowEnabled, method: 'single directional shadow-map proxy, not WebGi ground reconstruction', opacity: floorMaterial.opacity, mapSize: light.shadow.mapSize.toArray(), lightIntensity: light.intensity }, delivery: { phoneTestPerformed: false, note: 'Record target-device evidence separately.' } }));
  panels(); report();
});

export const diagnosis: SceneSetup = (harness) => watchLab(harness, (lab) => {
  let environment = 'uniform';
  let map = false;
  let exposure = 2.4;
  function report() { lab.setReadout(`environment ${environment} · leather normal ${map ? 'on' : 'off'}\nexposure ${exposure.toFixed(1)} · strap metalness ${lab.strap.metalness.toFixed(3)}\nRepair one cause at a time; keep the comparisons as evidence.`); }
  function normal(enabled: boolean) { map = enabled; lab.strap.normalMap = enabled ? lab.normalTexture : null; lab.strap.needsUpdate = true; report(); }
  lab.setEnvironment('uniform'); normal(false); harness.renderer.toneMappingExposure = exposure;
  lab.addButton('restore reference studio', () => { environment = 'reference'; lab.setEnvironment('reference'); report(); });
  lab.addButton('restore leather normal', () => normal(true));
  lab.addButton('restore exposure 1', () => { exposure = 1; harness.renderer.toneMappingExposure = exposure; report(); });
  lab.addSelect('strap interpretation', { 'source artist settings': () => { lab.strap.metalness = 0.3256803474869249; report(); }, 'dielectric leather': () => { lab.strap.metalness = 0; report(); } });
  lab.addButton('break the setup again', () => { environment = 'uniform'; lab.setEnvironment('uniform'); normal(false); exposure = 2.4; harness.renderer.toneMappingExposure = exposure; report(); });
  lab.registerEvidence(() => ({ environment, normalMapEnabled: map, exposure, strapMetalness: lab.strap.metalness, exercise: 'isolate missing directional reflections, missing microgeometry shading, and excessive exposure' }));
  report();
});
