// Scenes for the world size per pixel page. The README places each one with <div data-scene="name">.
import { choiceButtons, COLORS, formatNumber, label, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const TARGET_PIXELS = 24;
const RADIUS = 0.15; // each hotspot is a ball 0.3 units across at scale 1
const SPOTS = [
  { name: 'near', at: new THREE.Vector3(-1.3, 1, 3) },
  { name: 'middle', at: new THREE.Vector3(0.4, 1.3, -0.5) },
  { name: 'far', at: new THREE.Vector3(2, 1.6, -4.5) },
];

export const hotspots: SceneSetup = ({ scene, camera, controls, container, renderer }) => {
  camera.position.set(-0.5, 2.1, 7);
  controls.target.set(0.2, 1.1, -0.5);

  const post = new THREE.MeshStandardMaterial({ color: COLORS.gray });
  const balls = SPOTS.map(({ name, at }) => {
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, at.y), post);
    stand.position.set(at.x, at.y / 2, at.z);
    const hotspot = new THREE.Mesh(new THREE.SphereGeometry(RADIUS, 24, 12), new THREE.MeshStandardMaterial({ color: COLORS.yellow }));
    hotspot.position.copy(at);
    const tag = label(name, COLORS.gray);
    tag.position.set(at.x + 0.45, 0.25, at.z);
    scene.add(stand, hotspot, tag);
    return hotspot;
  });

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const canvas = renderer.domElement;
  const size = new THREE.Vector2();
  const up = new THREE.Vector3();
  let scaled = false;

  // Runs inside every render, after three.js has refreshed the camera, so the sizes never lag.
  scene.onBeforeRender = () => {
    up.setFromMatrixColumn(camera.matrixWorld, 1); // up the screen, in the world
    const lines = [scaled ? 'hotspot.scale.setScalar(24 * worldPerPixel / 0.3)' : 'hotspot.scale.setScalar(1)'];
    SPOTS.forEach(({ name }, i) => {
      const hotspot = balls[i];
      const depth = -hotspot.position.clone().applyMatrix4(camera.matrixWorldInverse).z;
      const worldPerPixel = camera.getViewSize(depth, size).y / canvas.clientHeight;
      hotspot.scale.setScalar(scaled ? (TARGET_PIXELS * worldPerPixel) / (2 * RADIUS) : 1);
      hotspot.updateMatrixWorld(); // the scene's matrices were refreshed before this ran

      // How tall it really is on screen: project its top and bottom, then turn NDC into pixels.
      const r = RADIUS * hotspot.scale.x;
      const top = hotspot.position.clone().addScaledVector(up, r).project(camera);
      const bottom = hotspot.position.clone().addScaledVector(up, -r).project(camera);
      const pixels = ((top.y - bottom.y) / 2) * canvas.clientHeight;
      lines.push(
        `${name.padEnd(7)} depth ${formatNumber(depth, 1).padEnd(5)} ${formatNumber(worldPerPixel, 4)} per pixel   ${Math.round(pixels)} px tall`,
      );
    });
    readout.textContent = lines.join('\n');
  };

  choiceButtons(controlsBar, [
    {
      html: 'Fixed world size',
      select: () => (scaled = false),
    },
    {
      html: 'Scaled per pixel: 24 px',
      select: () => (scaled = true),
    },
  ]);
};
