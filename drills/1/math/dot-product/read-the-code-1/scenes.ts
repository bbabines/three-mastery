// Scenes for the dot product page. The README places each one with <div data-scene="name">.
import { arrow, ball, COLORS, formatNumber, label, overlay, setArrow, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

function describeAgreement(dot: number) {
  if (dot > 0.99) return 'same way';
  if (dot > 0.01) return 'partly the same way';
  if (dot >= -0.01) return 'right angles';
  if (dot > -0.99) return 'partly opposite';
  return 'opposite';
}

// A text meter from −1 to 1 with a dot at the value.
function meter(value: number) {
  const slots = 20;
  const position = Math.round(((value + 1) / 2) * slots);
  return `−1 ${'─'.repeat(position)}●${'─'.repeat(slots - position)} 1`;
}

export const agree: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0.6, 2.2, 2.4);
  controls.target.set(0, 0, -0.2);

  const origin = new THREE.Vector3();
  const a = new THREE.Vector3(1, 0, 0);
  const b = new THREE.Vector3();

  const aArrow = arrow(COLORS.blue);
  setArrow(aArrow, origin, a);
  const aTag = label('a', COLORS.blue);
  aTag.position.set(1.15, 0.1, 0);
  const bArrow = arrow(COLORS.yellow);
  const bTag = label('b', COLORS.yellow);
  scene.add(aArrow, aTag, bArrow, bTag);

  const readout = overlay(container, 'readout');
  const sliders = overlay(container, 'controls');

  const update = (degrees: number) => {
    const radians = THREE.MathUtils.degToRad(degrees);
    b.set(Math.cos(radians), 0, -Math.sin(radians));
    setArrow(bArrow, origin, b);
    bTag.position.copy(b).multiplyScalar(1.15).setY(0.1);

    const dot = a.dot(b);
    readout.textContent = [
      `a.dot(b)  ${formatNumber(dot)}   ${describeAgreement(dot)}`,
      meter(dot),
      `angle between: ${Math.min(degrees, 360 - degrees)}°   (both have length 1)`,
    ].join('\n');
  };
  slider(sliders, 'turn b', { min: 0, max: 360, step: 5, value: 45 }, update);
  update(45);
};

export const lighting: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 2, 4.5);
  controls.target.set(0, 1, 0);

  const center = new THREE.Vector3(0, 1, 0);
  const toLight = new THREE.Vector3();

  const material = new THREE.ShaderMaterial({
    uniforms: { toLight: { value: toLight } },
    vertexShader: /* glsl */ `
      varying vec3 vNormal;
      void main() {
        // The sphere is never rotated or scaled, so its normals already face their world
        // directions. The normal matrix page covers turning normals for moved objects.
        vNormal = normal;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 toLight;
      varying vec3 vNormal;
      void main() {
        float light = max(dot(normalize(vNormal), toLight), 0.0);
        gl_FragColor = vec4(vec3(1.0, 0.85, 0.6) * light, 1.0);
        #include <colorspace_fragment>
      }`,
  });
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 32), material);
  sphere.position.copy(center);

  const sun = ball(COLORS.yellow, 1, 0.12);
  const sunArrow = arrow(COLORS.yellow);
  const sunTag = label('light', COLORS.yellow);
  scene.add(sphere, sun, sunArrow, sunTag);

  const readout = overlay(container, 'readout');
  readout.textContent = [
    'float light = max(dot(normal, toLight), 0.0);',
    '',
    'facing the light: 1   side-on: 0   facing away: 0 (clamped)',
  ].join('\n');

  const update = (degrees: number) => {
    const radians = THREE.MathUtils.degToRad(degrees);
    toLight.set(Math.cos(radians), 0.6, Math.sin(radians)).normalize();
    sun.position.copy(center).addScaledVector(toLight, 2.3);
    sunTag.position.copy(sun.position).add(new THREE.Vector3(0, 0.35, 0));
    setArrow(sunArrow, center.clone().addScaledVector(toLight, 1.05), toLight.clone().multiplyScalar(1.05));
  };
  // Starts side-on so the edge between lit and unlit is easy to see.
  slider(overlay(container, 'controls'), 'move the light', { min: 0, max: 360, step: 5, value: 15 }, update);
  update(15);
};
