// Scenes for the winding order page. The README places each one with <div data-scene="name">.
import { choiceButtons, COLORS, label, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

// Swaps two corners of every triangle, the fix the README shows for an inside-out model.
function reverseWinding(geometry: THREE.BufferGeometry) {
  const index = geometry.index!;
  for (let i = 0; i < index.count; i += 3) {
    const b = index.getX(i + 1);
    index.setX(i + 1, index.getX(i + 2));
    index.setX(i + 2, b);
  }
  index.needsUpdate = true;
  return geometry;
}

const CORNERS = [new THREE.Vector3(-0.8, 0, 0), new THREE.Vector3(0.8, 0, 0), new THREE.Vector3(0, 1.2, 0)];

export const corners: SceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  camera.position.set(0.6, 1.5, 3.2);
  controls.target.set(0, 1.05, 0);

  const holder = new THREE.Group();
  holder.position.y = 0.45; // the bottom edge sits above the floor grid
  const geometry = new THREE.BufferGeometry().setFromPoints(CORNERS);
  const triangle = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: COLORS.blue }));
  const edges = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(CORNERS), new THREE.LineBasicMaterial({ color: COLORS.gray }));
  holder.add(triangle, edges);
  CORNERS.forEach((corner, i) => {
    const tag = label(String(i), COLORS.yellow);
    tag.position.copy(corner).add(new THREE.Vector3(i === 0 ? -0.15 : i === 1 ? 0.15 : 0, i === 2 ? 0.2 : -0.1, 0));
    holder.add(tag);
  });
  scene.add(holder);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  let order = [0, 1, 2];
  const world = CORNERS.map(() => new THREE.Vector3());
  const center = new THREE.Vector3();
  const view = new THREE.Vector3();

  choiceButtons(controlsBar, [
    { html: '<code>setIndex([0, 1, 2])</code>', select: () => geometry.setIndex((order = [0, 1, 2])) },
    { html: '<code>setIndex([0, 2, 1])</code>', select: () => geometry.setIndex((order = [0, 2, 1])) },
  ]);
  slider(controlsBar, 'turn', { min: 0, max: 360, step: 15, value: 0 }, (value) => {
    holder.rotation.y = THREE.MathUtils.degToRad(value);
  });

  // Every frame, since orbiting the camera changes which side it sees.
  onFrame(() => {
    holder.updateMatrixWorld();
    order.forEach((vertex, i) => world[i].copy(CORNERS[vertex]).applyMatrix4(holder.matrixWorld));
    center.copy(world[0]).add(world[1]).add(world[2]).divideScalar(3);
    view.subVectors(center, camera.position); // the direction the camera looks at the triangle
    const front = THREE.Triangle.isFrontFacing(world[0], world[1], world[2], view);
    readout.textContent = [
      `geometry.setIndex([${order.join(', ')}])   material.side = FrontSide`,
      `seen from the camera, ${order.join(' → ')} runs ${front ? 'counter-clockwise' : 'clockwise'}`,
      front ? 'the camera sees its front: drawn' : 'the camera sees its back: skipped',
    ].join('\n');
  });
};

// BoxGeometry's groups run +X, −X, +Y, −Y, +Z, −Z.
const FACE_COLORS = [COLORS.orange, COLORS.purple, COLORS.green, COLORS.red, COLORS.yellow, COLORS.blue];

export const flip: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(1.75, 2.15, 2.65);
  controls.target.set(0, 1.2, 0);

  // Its own light from the upper right; a faint glow keeps every face's color visible.
  const sky = scene.children.find((child): child is THREE.HemisphereLight => child instanceof THREE.HemisphereLight);
  if (sky) sky.intensity = 0.3;
  const sun = new THREE.DirectionalLight(0xffffff, 2.6);
  sun.position.set(3, 5, 4);
  scene.add(sun);

  const original = new THREE.BoxGeometry(1.2, 1.2, 1.2);
  const flipped = original.clone();
  const normal = flipped.attributes.normal;
  for (let i = 0; i < normal.count; i++) normal.setXYZ(i, -normal.getX(i), -normal.getY(i), -normal.getZ(i));
  const reversed = reverseWinding(original.clone());

  const materials = FACE_COLORS.map(
    (color) => new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.18 }),
  );
  const box = new THREE.Mesh<THREE.BufferGeometry, THREE.Material[]>(original, materials);
  box.position.y = 1.1;
  scene.add(box);

  const readout = overlay(container, 'readout');
  const show = (geometry: THREE.BufferGeometry, lines: string[]) => {
    box.geometry = geometry;
    readout.textContent = lines.join('\n');
  };

  choiceButtons(overlay(container, 'controls'), [
    {
      html: '<code>new BoxGeometry()</code>',
      select: () =>
        show(original, [
          'new BoxGeometry(1.2, 1.2, 1.2)',
          'drawn: the near faces, yellow front, green top, orange side',
          'lit from the upper right, as expected',
        ]),
    },
    {
      html: 'flip the normals',
      select: () =>
        show(flipped, [
          'normal.setXYZ(i, -normal.getX(i), -normal.getY(i), -normal.getZ(i))',
          'drawn: the same near faces, since culling ignores normals',
          'lit wrong: the normals point inward, away from the light',
        ]),
    },
    {
      html: 'reverse the winding',
      select: () =>
        show(reversed, [
          'swap two corners of every triangle in geometry.index',
          'drawn: the far faces, from inside: blue back, red bottom, purple side',
          'inside out: the near faces now show their backs and are skipped',
        ]),
    },
  ]);
};
