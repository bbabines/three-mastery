// Scenes for the bounds primitives page. The README places each one with <div data-scene="name">.
import { arrow, ball, COLORS, formatNumber, label, overlay, setArrow, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const f = (n: number) => formatNumber(n, 2);

export const zones: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0.3, 4.4, 5.6);
  controls.target.set(0, 0.2, -0.2);

  // A box zone and a ball zone, just above the floor grid.
  const doorway = new THREE.Box3(new THREE.Vector3(-2.6, 0.05, -1.7), new THREE.Vector3(-0.8, 1.2, -0.2));
  const doorwayLines = new THREE.Box3Helper(doorway, COLORS.green);
  const doorwayTag = label('doorway: a Box3', COLORS.green);
  doorwayTag.position.set(-1.7, 1.5, -1);

  const bubble = new THREE.Sphere(new THREE.Vector3(1.5, 0.3, -0.9), 0.9);
  const bubbleLines = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.SphereGeometry(bubble.radius, 16, 8)),
    new THREE.LineBasicMaterial({ color: COLORS.blue, transparent: true, opacity: 0.5 }),
  );
  bubbleLines.position.copy(bubble.center);
  const bubbleTag = label('bubble: a Sphere', COLORS.blue);
  bubbleTag.position.set(1.5, 1.5, -0.9);

  // The fence: the plane z = 1, facing +Z, drawn as a see-through panel with its normal.
  const fence = new THREE.Plane().setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 1));
  const panel = new THREE.Mesh(
    new THREE.PlaneGeometry(6, 1),
    new THREE.MeshBasicMaterial({ color: COLORS.orange, transparent: true, opacity: 0.2, side: THREE.DoubleSide, depthWrite: false }),
  );
  panel.position.set(0, 0.55, 1);
  const normal = arrow(COLORS.orange);
  setArrow(normal, new THREE.Vector3(2.4, 0.55, 1), new THREE.Vector3(0, 0, 0.8));
  const fenceTag = label('fence: a Plane', COLORS.orange);
  fenceTag.position.set(-2.2, 1.3, 1);

  const player = ball(COLORS.yellow, 1, 0.18);
  scene.add(doorwayLines, doorwayTag, bubbleLines, bubbleTag, panel, normal, fenceTag, player);

  const readout = overlay(container, 'readout');
  const sliders = overlay(container, 'controls');
  const at = { x: 0.8, z: -0.8 };

  const update = () => {
    player.position.set(at.x, 0.3, at.z);
    const inDoorway = doorway.containsPoint(player.position);
    const inBubble = bubble.containsPoint(player.position);
    const side = fence.distanceToPoint(player.position);
    (doorwayLines.material as THREE.LineBasicMaterial).color.set(inDoorway ? COLORS.white : COLORS.green);
    (bubbleLines.material as THREE.LineBasicMaterial).color.set(inBubble ? COLORS.white : COLORS.blue);
    readout.textContent = [
      `doorway.containsPoint(player.position) → ${inDoorway}`,
      `bubble.containsPoint(player.position) → ${inBubble}   bubble.distanceToPoint → ${f(bubble.distanceToPoint(player.position))}`,
      `fence.distanceToPoint(player.position) → ${f(side)}   ${
        side > 0 ? 'in front: the side its normal points to' : side < 0 ? 'behind: the other side' : 'on the plane'
      }`,
    ].join('\n');
  };
  slider(sliders, 'Walk x', { min: -3, max: 3, step: 0.1, value: at.x }, (value) => {
    at.x = value;
    update();
  });
  slider(sliders, 'Walk z', { min: -2, max: 2, step: 0.1, value: at.z }, (value) => {
    at.z = value;
    update();
  });
  update();
};
