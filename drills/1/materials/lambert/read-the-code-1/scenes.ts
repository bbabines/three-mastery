// Scenes for the diffuse (Lambert) page. The README places each one with <div data-scene="name">.
import { arrow, choiceButtons, COLORS, formatNumber, overlay, screenColor, setArrow, slider, sunlight } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const CENTER = new THREE.Vector3(0, 1.1, 0);
const RADIUS = 0.75;

// A ball with a marked spot on its front, and the sun circling it at the ball's height.
function litBall(scene: THREE.Scene) {
  const sun = sunlight(scene, new THREE.Vector3(3, 1.1, 0), 0.05, 3);
  sun.target.position.copy(CENTER);
  scene.add(sun.target);
  const ball: THREE.Mesh = new THREE.Mesh(new THREE.SphereGeometry(RADIUS, 64, 32), new THREE.MeshLambertMaterial({ color: COLORS.white }));
  ball.position.copy(CENTER);
  const normal = new THREE.Vector3(0.45, 0.25, 1).normalize(); // the marked spot faces this way
  const spot = CENTER.clone().addScaledVector(normal, RADIUS);
  const marker = new THREE.Mesh(new THREE.RingGeometry(0.05, 0.07, 24), new THREE.MeshBasicMaterial({ color: COLORS.red }));
  marker.position.copy(spot).addScaledVector(normal, 0.005);
  marker.lookAt(spot.clone().add(normal));
  scene.add(ball, marker);
  return { sun, ball, normal, spot };
}

export const terminator: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0.4, 1.5, 3.1);
  controls.target.copy(CENTER);
  const { sun, ball, normal, spot } = litBall(scene);
  const normalArrow = arrow(COLORS.white);
  const lightArrow = arrow(COLORS.yellow);
  scene.add(normalArrow, lightArrow);

  const bands = new THREE.DataTexture(new Uint8Array([80, 160, 255]), 3, 1, THREE.RedFormat);
  bands.needsUpdate = true;
  const materials = {
    lambert: ball.material as THREE.Material,
    toon: new THREE.MeshToonMaterial({ color: COLORS.white, gradientMap: bands }),
  };

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  let angle = 60;
  let toon = false;
  const toLight = new THREE.Vector3();

  const update = () => {
    const a = THREE.MathUtils.degToRad(angle);
    sun.position.set(Math.sin(a) * 3, 0, Math.cos(a) * 3).add(CENTER); // 0° is straight toward the camera side
    toLight.copy(sun.position).sub(sun.target.position).normalize(); // a directional light: the same everywhere
    ball.material = toon ? materials.toon : materials.lambert;
    setArrow(normalArrow, spot, normal.clone().multiplyScalar(0.6));
    setArrow(lightArrow, spot, toLight.clone().multiplyScalar(0.6));
    const facing = normal.dot(toLight);
    readout.textContent = [
      `ball.material = ${toon ? 'new MeshToonMaterial({ gradientMap: bands })' : 'new MeshLambertMaterial()'}`,
      `at the red ring: dot(normal, toLight) = ${formatNumber(facing)}`,
      `max(…, 0) = ${formatNumber(Math.max(facing, 0))}   ${facing <= 0 ? 'past the terminator: no light' : `${Math.round(facing * 100)}% of facing the light head-on`}`,
    ].join('\n');
  };

  choiceButtons(controlsBar, [
    { html: 'Lambert', select: () => ((toon = false), update()) },
    { html: 'Toon', select: () => ((toon = true), update()) },
  ]);
  slider(controlsBar, 'Light from', { min: -180, max: 180, step: 10, value: angle }, (value) => {
    angle = value;
    update();
  });
};

export const viewer: SceneSetup = (harness) => {
  const { scene, camera, controls, container, onFrame } = harness;
  controls.target.copy(CENTER);
  const { sun, spot } = litBall(scene);
  sun.position.set(2.2, 1.9, 2).add(CENTER);

  const readout = overlay(container, 'readout');
  let orbit = 0;
  let measure = true;

  onFrame(() => {
    if (!measure) return;
    measure = false;
    const seen = screenColor(harness, spot);
    readout.innerHTML = [
      `the camera: ${orbit}° around the ball, then wherever you orbit it`,
      `inside the red ring, on screen: ${seen} <span style="display:inline-block;width:2.2em;height:0.9em;vertical-align:middle;background:${seen}"></span>`,
      'the camera is not in max(dot(normal, toLight), 0)',
    ].join('\n');
  });

  const place = () => {
    const a = THREE.MathUtils.degToRad(orbit);
    camera.position.set(Math.sin(a) * 3.2, 0.5, Math.cos(a) * 3.2).add(CENTER);
    camera.lookAt(CENTER);
    controls.update();
    measure = true;
  };
  slider(overlay(container, 'controls'), 'Camera around', { min: -40, max: 80, step: 10, value: orbit }, (value) => {
    orbit = value;
    place();
  });
  place();
  controls.addEventListener('change', () => (measure = true));
};
