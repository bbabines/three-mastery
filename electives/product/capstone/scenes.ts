import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { watchLab } from '../lab';

export const configurator: SceneSetup = (harness) => watchLab(harness, (lab) => {
  const { renderer } = harness;
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
  let grounded = true;
  // Opens on the reference studio; moving a panel slider (or choosing authored panels) switches.
  let lighting = 'reference';
  let built = false; // sliders report their initial value while being added; that isn't a choice
  // Grounding is the stage's reference ground (contact shadow, key-light shadow, floor reflection)
  // under the reference key light. The crystal casts no shadow, as in the source file.
  const light = lab.referenceLight;
  function panels() { if (!built) return; lighting = 'authored panels'; lightingSelect.value = lighting; lab.setPanels({ count, width, softness, background }); }
  function report() { lab.setReadout(`${leather} · ${interpretation}\n${finish} · ${lighting === 'authored panels' ? `authored panels ${count} / width ${width.toFixed(2)} / softness ${softness.toFixed(2)}` : `${lighting} studio (a panel slider switches to authored panels)`}\nReference ground ${grounded ? 'on' : 'off'} · export every finish.`); }
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
  const lightingSelect = lab.addSelect('lighting', { reference: () => { lighting = 'reference'; lab.setEnvironment('reference'); report(); }, 'authored panels': () => { panels(); report(); }, 'uniform diagnostic': () => { lighting = 'uniform diagnostic'; lab.setEnvironment('uniform'); report(); } });
  lab.addSlider('panel count', 1, 8, 1, count, (v) => { count = v; panels(); report(); });
  lab.addSlider('panel width', 0.1, 0.9, 0.05, width, (v) => { width = v; panels(); report(); });
  lab.addSlider('panel softness', 0, 1, 0.1, softness, (v) => { softness = v; panels(); report(); });
  lab.addSlider('studio background', 0.02, 0.5, 0.02, background, (v) => { background = v; panels(); report(); });
  lab.addSelect('grounding', { 'reference ground': () => { grounded = true; lab.setReferenceLook({ ground: true }); report(); }, off: () => { grounded = false; lab.setReferenceLook({ ground: false }); report(); } });
  lab.addSelect('reference camera', { 'source default view': () => lab.setView('default'), 'source front view': () => lab.setView('front') });
  lab.addSelect('quality', { 'DPR 1.5': () => renderer.setPixelRatio(1.5), 'DPR 1': () => renderer.setPixelRatio(1), 'DPR 2': () => renderer.setPixelRatio(2) });
  renderer.setPixelRatio(1.5);
  lab.addButton('capture configuration orbit', () => lab.captureOrbit());
  lab.registerEvidence(() => ({ leather, interpretation, finish, lighting, panels: { count, width, softness, background }, grounding: { enabled: grounded, method: 'stage reference ground: blurred under-floor depth as aoMap, key-light PCF shadow, planar floor reflection', keyLight: { name: light.name, intensity: light.intensity, shadowMapSize: light.shadow.mapSize.toArray(), shadowRadius: light.shadow.radius } }, delivery: { phoneTestPerformed: false, note: 'Record target-device evidence separately.' } }));
  built = true;
  report();
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
