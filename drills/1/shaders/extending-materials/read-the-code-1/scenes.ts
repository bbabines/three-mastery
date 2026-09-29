// Scenes for the extending materials page. The README places each one with <div data-scene="name">.
import { choiceButtons, COLORS, overlay, roomEnvironment, slider, sunlight } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

export const patch: SceneSetup = ({ scene, camera, controls, container, renderer }) => {
  // Aimed a little below the part, so it sits between the readout and the two rows of controls.
  camera.position.set(2.5, 2.3, 4.1);
  controls.target.set(0, 1.2, 0);
  sunlight(scene, new THREE.Vector3(3, 5, 4), 0.3, 2.5);
  scene.environment = roomEnvironment(renderer);

  const glow = { value: 0.5 };
  const glowColor = { value: new THREE.Color(COLORS.orange) };

  const plain = new THREE.MeshStandardMaterial({ color: COLORS.gray, metalness: 0.6, roughness: 0.35 });
  const patched = plain.clone();
  patched.onBeforeCompile = (shader) => {
    shader.uniforms.uGlow = glow;
    shader.uniforms.uGlowColor = glowColor;
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform float uGlow;\nuniform vec3 uGlowColor;')
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += uGlowColor * uGlow;');
  };
  const handWritten = new THREE.ShaderMaterial({
    uniforms: { uGlow: glow, uGlowColor: glowColor, uBase: { value: new THREE.Color(COLORS.gray) } },
    vertexShader: /* glsl */ `
      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform float uGlow;
      uniform vec3 uGlowColor;
      uniform vec3 uBase;
      void main() {
        gl_FragColor = vec4(mix(uBase, uGlowColor, uGlow), 1.0);
        #include <colorspace_fragment>
      }`,
  });

  const part = new THREE.Mesh<THREE.BufferGeometry, THREE.Material>(new THREE.TorusKnotGeometry(0.62, 0.22, 200, 32), plain);
  part.position.set(0, 1.3, 0);
  scene.add(part);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  let current = 0;

  const update = () => {
    const amount = glow.value.toFixed(1);
    part.material = [plain, patched, handWritten][current];
    readout.textContent = [
      [
        'new MeshStandardMaterial({ metalness: 0.6, roughness: 0.35 })',
        'lit by the sun and the room: shading and reflections',
        'no glow: nothing reads uGlow yet',
      ],
      [
        'material.onBeforeCompile, after #include <emissivemap_fragment>:',
        `totalEmissiveRadiance += uGlowColor * uGlow;   uGlow = ${amount}`,
        'still lit and reflective, with the glow added on top',
      ],
      [
        'new ShaderMaterial({ vertexShader, fragmentShader })',
        `gl_FragColor = vec4(mix(uBase, uGlowColor, uGlow), 1.0);   uGlow = ${amount}`,
        'no lighting unless you write it: one flat color',
      ],
    ][current].join('\n');
  };

  choiceButtons(
    controlsBar,
    ['<code>MeshStandardMaterial</code>', '<code>+ onBeforeCompile</code>', '<code>ShaderMaterial</code>'].map((html, i) => ({
      html,
      select: () => {
        current = i;
        update();
      },
    })),
  );
  slider(controlsBar, 'uGlow', { min: 0, max: 1, step: 0.1, value: glow.value }, (value) => {
    glow.value = value;
    update();
  });
};
