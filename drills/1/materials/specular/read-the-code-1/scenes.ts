// Scenes for the specular and half vector page. The README places each one with <div data-scene="name">.
import { arrow, choiceButtons, COLORS, overlay, setArrow, slider, sunlight } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const CENTER = new THREE.Vector3(0, 1.1, 0);
const RADIUS = 0.7;

export const glint: SceneSetup = ({ scene, camera, controls, container }) => {
  controls.target.copy(CENTER);
  const sun = sunlight(scene, new THREE.Vector3(-2, 2.6, 1.5).add(CENTER), 0.3, 2.5);
  sun.target.position.copy(CENTER);
  scene.add(sun.target);

  const material = new THREE.MeshPhongMaterial({ color: '#1e3a8a', shininess: 60, specular: 0x444444 });
  const ball = new THREE.Mesh(new THREE.SphereGeometry(RADIUS, 96, 48), material);
  ball.position.copy(CENTER);
  const toLightArrow = arrow(COLORS.yellow);
  const toViewerArrow = arrow(COLORS.blue);
  const halfArrow = arrow(COLORS.green);
  scene.add(ball, toLightArrow, toViewerArrow, halfArrow);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  let orbit = 0;
  const toLight = new THREE.Vector3();
  const normal = new THREE.Vector3();
  const point = new THREE.Vector3();
  const toViewer = new THREE.Vector3();
  const half = new THREE.Vector3();

  // Finds the highlight: the point on the ball whose normal matches the half vector there. The
  // direction to the viewer depends on the point, so start from a guess and settle in a few steps.
  const findHighlight = () => {
    toLight.copy(sun.position).sub(sun.target.position).normalize(); // a directional light
    normal.copy(camera.position).sub(CENTER).normalize().add(toLight).normalize();
    for (let i = 0; i < 8; i++) {
      point.copy(CENTER).addScaledVector(normal, RADIUS);
      toViewer.copy(camera.position).sub(point).normalize();
      half.copy(toLight).add(toViewer).normalize();
      normal.copy(half);
    }
  };

  const update = () => {
    const a = THREE.MathUtils.degToRad(orbit);
    camera.position.set(Math.sin(a) * 2.4, 0.5, Math.cos(a) * 2.4).add(CENTER);
    controls.update();
    findHighlight();
    setArrow(toLightArrow, point, toLight.clone().multiplyScalar(0.7));
    setArrow(toViewerArrow, point, toViewer.clone().multiplyScalar(0.7));
    setArrow(halfArrow, point, half.clone().multiplyScalar(0.7));
    readout.textContent = [
      `material.shininess = ${material.shininess}`,
      `camera: ${orbit}° around the ball`,
      'halfVector = normalize(toLight + toViewer); the highlight is where the normal matches it',
    ].join('\n');
  };

  choiceButtons(
    controlsBar,
    [60, 10, 300].map((shininess) => ({
      html: `shininess ${shininess}`,
      select: () => {
        material.shininess = shininess;
        update();
      },
    })),
  );
  slider(controlsBar, 'camera around', { min: -80, max: 80, step: 10, value: orbit }, (value) => {
    orbit = value;
    update();
  });
};
