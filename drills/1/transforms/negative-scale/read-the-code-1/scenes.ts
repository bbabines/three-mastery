// Scenes for the negative scale and determinant page. The README places each one with <div data-scene="name">.
import { choiceButtons, COLORS, formatNumber, formatVector, label, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// Swaps two corners of every triangle, the fix the README shows for a baked mirror.
function reverseCorners(geometry: THREE.BufferGeometry) {
  const index = geometry.index!;
  for (let i = 0; i < index.count; i += 3) {
    const b = index.getX(i + 1);
    index.setX(i + 1, index.getX(i + 2));
    index.setX(i + 2, b);
  }
  index.needsUpdate = true;
}

// A corner bracket with three arms of different lengths. No turn can make it match its mirror
// image, the same way no turn makes a right glove into a left one.
function bracketGeometry() {
  const arm = (size: [number, number, number], center: [number, number, number]) =>
    new THREE.BoxGeometry(...size).translate(...center);
  return mergeGeometries([
    arm([1.1, 0.25, 0.25], [0.425, 0, 0]),
    arm([0.25, 0.8, 0.25], [0, 0.275, 0]),
    arm([0.25, 0.25, 0.6], [0, 0, 0.175]),
  ]);
}

export const mirror: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0.6, 2.4, 4.3);
  controls.target.set(0, 0.9, 0);

  // Its own light from the front, so faces pointing the wrong way show up dark.
  const sky = scene.children.find((child): child is THREE.HemisphereLight => child instanceof THREE.HemisphereLight);
  if (sky) sky.intensity = 0.5;
  const sun = new THREE.DirectionalLight(0xffffff, 2.2);
  sun.position.set(2, 4, 5);
  scene.add(sun);

  const shared = bracketGeometry();
  const baked = shared.clone().scale(-1, 1, 1);
  const bakedAndFixed = shared.clone().scale(-1, 1, 1);
  reverseCorners(bakedAndFixed);

  const material = new THREE.MeshStandardMaterial({ color: COLORS.orange });
  const right = new THREE.Mesh(shared, material);
  right.position.set(0.5, 0.6, 0);
  const left = new THREE.Mesh(shared, material);
  left.position.set(-0.5, 0.6, 0);

  const rightTag = label('right-hand part', COLORS.orange);
  rightTag.position.set(1.1, 1.4, 0);
  const leftTag = label('left-hand copy', COLORS.white);
  leftTag.position.set(-1.1, 1.4, 0);
  scene.add(right, left, rightTag, leftTag);

  const readout = overlay(container, 'readout');

  const show = (code: string, geometry: THREE.BufferGeometry, scaleX: number, result: string) => {
    left.geometry = geometry;
    left.scale.set(scaleX, 1, 1);
    left.updateMatrixWorld();
    readout.textContent = [
      code,
      `left.scale                      ${formatVector(left.scale)}`,
      `left.matrixWorld.determinant()  ${formatNumber(left.matrixWorld.determinant())}`,
      result,
    ].join('\n');
  };

  choiceButtons(overlay(container, 'controls'), [
    {
      html: '<code>left.scale.x = -1</code>',
      select: () => show('left.scale.x = -1', shared, -1, 'Negative: three.js swaps which side it hides. Looks right.'),
    },
    {
      html: '<code>geometry.scale(-1, 1, 1)</code>',
      select: () =>
        show('geometry.scale(-1, 1, 1)', baked, 1, 'Positive: nothing for three.js to fix, so the insides show.'),
    },
    {
      html: '<code>geometry.scale(-1, 1, 1)</code> + reverse corners',
      select: () =>
        show(
          'geometry.scale(-1, 1, 1), then reverse every triangle\'s corners',
          bakedAndFixed,
          1,
          'Positive, but the corners were reversed by hand. Looks right.',
        ),
    },
  ]);
};
