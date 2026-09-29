// Scenes for the AABB vs OBB page. The README places each one with <div data-scene="name">.
import { COLORS, formatNumber, outline, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { OBB } from 'three/addons/math/OBB.js';

const volume = (box: THREE.Box3) => {
  const size = box.getSize(new THREE.Vector3());
  return size.x * size.y * size.z;
};

export const turnedPlanks: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0.3, 4, 3.2);
  controls.target.set(0, 0.1, -0.1);

  // Two parallel planks, 0.4 apart, turned together by their group.
  const shape = new THREE.BoxGeometry(2.6, 0.2, 0.3);
  shape.computeBoundingBox(); // measured from each plank itself: the start of its OBB
  const group = new THREE.Group();
  group.position.y = 0.35;
  const planks = [-0.35, 0.35].map((z, i) => {
    const plank = new THREE.Mesh(shape, new THREE.MeshStandardMaterial({ color: i === 0 ? COLORS.orange : COLORS.blue }));
    plank.position.z = z;
    // Its OBB, drawn beside it in the group so it turns with it. Not a child of the plank, or
    // setFromObject(plank) would box the outline too.
    const obbLines = outline(new THREE.BoxGeometry(2.64, 0.24, 0.34), COLORS.white);
    obbLines.position.z = z;
    group.add(plank, obbLines);
    return plank;
  });
  const boxes = [new THREE.Box3(), new THREE.Box3()];
  const helpers = boxes.map((box) => new THREE.Box3Helper(box, COLORS.yellow));
  scene.add(group, ...helpers);

  const readout = overlay(container, 'readout');
  const sliders = overlay(container, 'controls');
  const obbs = [new OBB(), new OBB()];
  let turn = 45;

  const update = () => {
    group.rotation.y = THREE.MathUtils.degToRad(turn);
    group.updateMatrixWorld(true);
    planks.forEach((plank, i) => {
      boxes[i].setFromObject(plank);
      obbs[i].fromBox3(shape.boundingBox!).applyMatrix4(plank.matrixWorld);
    });
    const aabbOverlap = boxes[0].intersectsBox(boxes[1]);
    const obbOverlap = obbs[0].intersectsOBB(obbs[1]);
    for (const helper of helpers) (helper.material as THREE.LineBasicMaterial).color.set(aabbOverlap ? COLORS.red : COLORS.yellow);
    readout.textContent = [
      `boxA.intersectsBox(boxB) → ${aabbOverlap}   ${aabbOverlap ? 'the Box3s overlap' : 'the Box3s are apart'}`,
      `obbA.intersectsOBB(obbB) → ${obbOverlap}   ${obbOverlap ? 'the planks touch' : "the planks don't touch"}`,
      `each Box3 is ${formatNumber(volume(boxes[0]) / (2.6 * 0.2 * 0.3), 1)} × the plank's volume`,
    ].join('\n');
  };
  slider(sliders, 'Turn both', { min: 0, max: 90, step: 5, value: turn }, (value) => {
    turn = value;
    update();
  });
  update();
};
