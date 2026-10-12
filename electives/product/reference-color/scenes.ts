import * as THREE from 'three';
import type { SceneSetup } from '@harness/scene';
import { watchLab } from '../lab';

export const calibration: SceneSetup = harness => watchLab(harness, lab => {
  const { renderer, scene } = harness;
  // Only the tone-mapping curve and output conversion may stand between a patch and the screen:
  // the finishing chain's contrast, AO, and bloom (the 8 patch would glow) are off.
  lab.setReferenceLook({ finishing: false });
  const patches: THREE.Mesh[] = [];
  // Display patches bypass illumination but still pass through tone mapping and output conversion.
  [0.18, 1, 8].forEach((linear, i) => {
    const material = new THREE.MeshBasicMaterial({ color: new THREE.Color().setRGB(linear, linear, linear) });
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.06), material);
    mesh.position.set(-1.35, 1 + i * 0.5, 0.5);
    scene.add(mesh); patches.push(mesh);
  });
  let curve = 'ACES', exposure = 1;
  const report = () => lab.setReadout(`curve ${curve} · exposure ${exposure.toFixed(2)}${curve === 'None' ? ' (ignored with NoToneMapping)' : ''}\npatches bottom → top: 0.18 / 1 / 8 linear · unlit\noutput sRGB · change one control, inspect dial and metal`);
  lab.addSelect('tone mapping', {
    ACES: () => { curve = 'ACES'; renderer.toneMapping = THREE.ACESFilmicToneMapping; report(); },
    Neutral: () => { curve = 'Neutral'; renderer.toneMapping = THREE.NeutralToneMapping; report(); },
    AgX: () => { curve = 'AgX'; renderer.toneMapping = THREE.AgXToneMapping; report(); },
    None: () => { curve = 'None'; renderer.toneMapping = THREE.NoToneMapping; report(); },
  });
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  lab.addSlider('exposure', 0.2, 3, 0.05, 1, value => {
    exposure = value; renderer.toneMappingExposure = value; report();
  });
  lab.addButton('reference exposure', () => { exposure = 1; renderer.toneMappingExposure = 1; report(); });
  lab.registerEvidence(() => ({ curve, exposure, patches: [0.18, 1, 8], output: 'sRGB' }));
  lab.onLeave(() => patches.forEach(mesh => { scene.remove(mesh); mesh.geometry.dispose(); (mesh.material as THREE.Material).dispose(); }));
  report();
});

export const colorRepair: SceneSetup = harness => watchLab(harness, lab => {
  const metal = lab.materials.get('metal')!;
  const reference = metal.color.clone();
  const texture = lab.normalTexture.clone();
  texture.needsUpdate = true;
  lab.strap.normalMap = texture;
  let colorMode = 'file linear', textureMode = 'normal data';
  const report = () => lab.setReadout(`metal ${colorMode} · linear ${metal.color.r.toFixed(3)}\nleather ${textureMode} · exposure fixed 1\nstudy size 3 units · physical dimensions unverified`);
  harness.renderer.toneMappingExposure = 1;
  lab.addSelect('metal color interpretation', {
    'file linear': () => { colorMode = 'file linear'; metal.color.copy(reference); report(); },
    'linear mistaken for sRGB': () => {
      colorMode = 'linear mistaken for sRGB';
      metal.color.setRGB(reference.r, reference.g, reference.b, THREE.SRGBColorSpace); report();
    },
    'picker sRGB mistaken for linear': () => {
      colorMode = 'picker sRGB mistaken for linear';
      const picker = reference.clone().convertLinearToSRGB();
      metal.color.setRGB(picker.r, picker.g, picker.b); report();
    },
  });
  lab.addSelect('normal texture interpretation', {
    'normal data': () => { textureMode = 'normal data'; texture.colorSpace = THREE.NoColorSpace; texture.needsUpdate = true; report(); },
    'wrong sRGB': () => { textureMode = 'wrong sRGB'; texture.colorSpace = THREE.SRGBColorSpace; texture.needsUpdate = true; report(); },
  });
  lab.registerEvidence(() => ({ colorMode, textureMode, metalLinear: metal.color.toArray(), physicalUnitsKnown: false }));
  lab.onLeave(() => { lab.strap.normalMap = lab.normalTexture; texture.dispose(); });
  report();
});
