// Scenes for the shader and material cost page. The README places each one with <div data-scene="name">.
import { choiceButtons, COLORS, hideFloorHelpers, overlay, roomEnvironment, sunlight } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

// The features a compiled fragment shader was built with, read from its #define lines. (The
// renderer keeps each material's program in its properties, an internal list.)
const FEATURES: [string, string][] = [
  ['#define PHYSICAL', 'physical extras: IOR, specular'],
  ['#define USE_CLEARCOAT', 'clearcoat'],
  ['#define USE_SHEEN', 'sheen'],
  ['#define USE_TRANSMISSION', 'transmission'],
];

function compiledFeatures(renderer: THREE.WebGLRenderer, material: THREE.Material) {
  const program = (renderer.properties.get(material) as { currentProgram?: { program: WebGLProgram } }).currentProgram;
  if (!program) return undefined;
  const gl = renderer.getContext();
  const fragment = gl.getAttachedShaders(program.program)?.find((shader) => gl.getShaderParameter(shader, gl.SHADER_TYPE) === gl.FRAGMENT_SHADER);
  const lines = new Set((fragment ? gl.getShaderSource(fragment) ?? '' : '').split('\n').map((line) => line.trim()));
  return FEATURES.filter(([define]) => lines.has(define)).map(([, name]) => name);
}

export const materials: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  camera.position.set(0.3, 1.5, 3.6);
  controls.target.set(0, 0.9, 0);
  hideFloorHelpers(scene);
  sunlight(scene, new THREE.Vector3(2, 4, 3), 0.5, 2);
  scene.environment = roomEnvironment(renderer);

  // Solid things behind and under the sphere, for glass to show through.
  const floor = new THREE.Mesh(new THREE.BoxGeometry(4, 0.1, 2.4), new THREE.MeshStandardMaterial({ color: '#3a3f4a' }));
  floor.position.y = -0.05;
  scene.add(floor);
  [COLORS.red, COLORS.green, COLORS.yellow].forEach((color, i) => {
    const block = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.4, 0.3), new THREE.MeshStandardMaterial({ color }));
    block.position.set(-0.7 + i * 0.7, 0.7, -0.9);
    scene.add(block);
  });

  const color = COLORS.blue;
  const options: [string, THREE.Material][] = [
    ['new MeshBasicMaterial({ color })', new THREE.MeshBasicMaterial({ color })],
    ['new MeshLambertMaterial({ color })', new THREE.MeshLambertMaterial({ color })],
    ['new MeshStandardMaterial({ color, roughness: 0.3 })', new THREE.MeshStandardMaterial({ color, roughness: 0.3 })],
    ['new MeshPhysicalMaterial({ color, roughness: 0.3 })', new THREE.MeshPhysicalMaterial({ color, roughness: 0.3 })],
    ['new MeshPhysicalMaterial({ color, roughness: 0.3, clearcoat: 1 })', new THREE.MeshPhysicalMaterial({ color, roughness: 0.3, clearcoat: 1 })],
    ['new MeshPhysicalMaterial({ roughness: 0.05, transmission: 1, thickness: 0.8 })', new THREE.MeshPhysicalMaterial({ roughness: 0.05, transmission: 1, thickness: 0.8 })],
  ];
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.55, 64, 32), options[2][1]);
  sphere.position.set(0, 0.62, 0.2);
  scene.add(sphere);

  let chosen = 0;
  choiceButtons(
    overlay(container, 'controls'),
    ['Basic', 'Lambert', 'Standard', 'Physical', '+ clearcoat', '+ transmission'].map((html, i) => ({
      html,
      select: () => {
        chosen = i;
        sphere.material = options[i][1];
      },
    })),
  );

  const readout = overlay(container, 'readout');
  // Runs before each render, so the counts and the program are the last frame's.
  onFrame(() => {
    const [code, material] = options[chosen];
    const features = compiledFeatures(renderer, material);
    const lit = !(material instanceof THREE.MeshBasicMaterial);
    const { calls } = renderer.info.render;
    readout.textContent = [
      code,
      `compiled in: ${features === undefined ? '…' : features.length ? features.join(', ') : lit ? 'no extras' : 'no lighting at all'}`,
      `renderer.info.render.calls ${calls}${chosen === 5 ? ': the 4 solid objects twice, once for the glass' : ''}`,
      lit ? 'lit by a sun, the sky light, and the environment' : 'ignores every light',
    ].join('\n');
  });
};
