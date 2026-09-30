// Scenes for the types and precision page. The README places each one with <div data-scene="name">.
import { choiceButtons, COLORS, formatNumber, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const OPEN_FOR = [
  { seconds: 0, text: 'just opened' },
  { seconds: 3600, text: '1 hour' },
  { seconds: 86400, text: '1 day' },
  { seconds: 864000, text: '10 days' },
  { seconds: 8640000, text: '100 days' },
];
const SPEED = 3; // the shader uses sin(uTime * 3.0), which repeats every 2π / 3 seconds
const PERIOD = (2 * Math.PI) / SPEED;

// The gap between a 32-bit float near `value` and the next one up.
const float32Gap = (value: number) => (value < 1 ? 2 ** -24 : 2 ** (Math.floor(Math.log2(value)) - 23));

export const clock: SceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  camera.position.set(0, 2.9, 3.3);
  controls.target.set(0, 1.15, 0);

  const uniforms = { uTime: { value: 0 }, uColor: { value: new THREE.Color(COLORS.orange) } };
  const ball = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 32, 16),
    new THREE.ShaderMaterial({
      uniforms,
      vertexShader: /* glsl */ `
        uniform float uTime;
        varying vec3 vNormal;
        void main() {
          vec3 around = vec3(cos(uTime * 3.0), 0.0, sin(uTime * 3.0)) * 1.3;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position + around, 1.0);
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        varying vec3 vNormal;
        void main() {
          gl_FragColor = vec4(uColor * (0.35 + 0.65 * normalize(vNormal).z), 1.0);
          #include <colorspace_fragment>
        }`,
    }),
  );
  ball.position.set(0, 1, 0);
  ball.frustumCulled = false; // the shader moves it away from where three.js thinks it is
  scene.add(ball);

  // The ball's path, just so the jumps are easy to see against it.
  const path = new THREE.Mesh(
    new THREE.TorusGeometry(1.3, 0.012, 8, 128).rotateX(Math.PI / 2),
    new THREE.MeshBasicMaterial({ color: COLORS.gray }),
  );
  path.position.set(0, 1, 0);
  scene.add(path);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  let openFor = 3;
  let wrapped = false;

  onFrame((_, elapsed) => {
    const time = OPEN_FOR[openFor].seconds + elapsed;
    uniforms.uTime.value = wrapped ? time % PERIOD : time;
    const onGpu = Math.fround(uniforms.uTime.value); // what the 32-bit uniform actually holds
    const gap = float32Gap(Math.abs(uniforms.uTime.value));
    readout.textContent = [
      wrapped ? 'uTime.value = elapsed % (2 * Math.PI / 3);' : 'uTime.value = elapsed;',
      `page open: ${OPEN_FOR[openFor].text}     elapsed = ${formatNumber(time, 3)} s`,
      `the GPU gets ${formatNumber(onGpu, 4)}, in steps of ${gap < 0.001 ? 'under 0.001' : formatNumber(gap, 4)} s`,
      gap > 1 / 60 ? 'bigger than a frame: the ball jumps instead of gliding' : 'far smaller than a frame: the ball glides',
    ].join('\n');
  });

  choiceButtons(controlsBar, [
    { html: '<code>uTime.value = elapsed</code>', select: () => (wrapped = false) },
    { html: '<code>uTime.value = elapsed % period</code>', select: () => (wrapped = true) },
  ]);
  slider(controlsBar, 'page open for', { min: 0, max: OPEN_FOR.length - 1, step: 1, value: openFor }, (value) => {
    openFor = value;
  });
};
