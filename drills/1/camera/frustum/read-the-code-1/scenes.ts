// Scenes for the frustum page. The README places each one with <div data-scene="name">.
import { cameraView, COLORS, label, overlay, showCamera, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const BOX_SPOTS = [
  [0, -0.2],
  [1.2, -2],
  [1.2, 2],
  [-1, -2.9],
  [-1, 2.9],
  [3.3, 0.4], // past the far plane when the camera looks straight at it
  [-2.2, -3.8],
];

export const culling: SceneSetup = (harness) => {
  const { scene, camera, controls, container } = harness;
  camera.position.set(-3.4, 7.4, 7.6);
  controls.target.set(0.2, 0.8, 0);

  const eye = new THREE.PerspectiveCamera(45, 1.5, 0.5, 6);
  eye.position.set(-3.5, 1.2, 0);
  const helper = showCamera(eye);
  scene.add(eye, helper);

  const drawn = new THREE.MeshStandardMaterial({ color: COLORS.blue });
  const skipped = new THREE.MeshStandardMaterial({ color: COLORS.gray, transparent: true, opacity: 0.35 });
  const boxes = BOX_SPOTS.map(([x, z]) => {
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), drawn);
    box.position.set(x, 0.3, z);
    scene.add(box);
    return box;
  });

  // A long plank just above the top of the view: never in the picture, but its bounding sphere,
  // drawn as the faint wire ball, reaches down into the frustum.
  const plank = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 4), new THREE.MeshStandardMaterial({ color: COLORS.orange }));
  plank.position.set(-0.5, 2.8, 0);
  plank.geometry.computeBoundingSphere();
  const radius = plank.geometry.boundingSphere!.radius;
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 16, 8),
    new THREE.MeshBasicMaterial({ color: COLORS.orange, wireframe: true, transparent: true, opacity: 0.12 }),
  );
  sphere.position.copy(plank.position);
  const plankTag = label('plank', COLORS.orange);
  plankTag.position.copy(plank.position).add(new THREE.Vector3(0, 0.35, 2));
  scene.add(plank, sphere, plankTag);

  const readout = overlay(container, 'readout');
  const sliders = overlay(container, 'controls');
  const frustum = new THREE.Frustum();
  const viewProjection = new THREE.Matrix4();
  let turn = 0;

  const update = () => {
    eye.rotation.y = THREE.MathUtils.degToRad(-90 - turn); // −90° faces +X
    eye.updateMatrixWorld(); // the frustum is built from the camera's saved matrices
    frustum.setFromProjectionMatrix(viewProjection.multiplyMatrices(eye.projectionMatrix, eye.matrixWorldInverse));

    let count = 0;
    for (const box of boxes) {
      box.updateMatrixWorld();
      const inView = frustum.intersectsObject(box);
      box.material = inView ? drawn : skipped;
      if (inView) count += 1;
    }
    plank.updateMatrixWorld();
    const plankDrawn = frustum.intersectsObject(plank);
    readout.innerHTML = [
      'frustum.intersectsObject(mesh)',
      `<span style="color:${COLORS.blue}">■</span> ${count} of ${boxes.length} boxes drawn`,
      `<span style="color:${COLORS.orange}">■</span> plank: ${plankDrawn ? 'drawn, every triangle, though none show' : 'skipped'}`,
    ].join('\n');
  };
  slider(sliders, 'turn camera', { min: -60, max: 60, step: 10, value: turn }, (value) => {
    turn = value;
    update();
  });
  update();
  cameraView(harness, eye, [helper, sphere, plankTag]);
};
