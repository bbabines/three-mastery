// Scenes for the branching and discard page. The README places each one with <div data-scene="name">.
import { ball, choiceButtons, COLORS, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const VERSIONS = [
  {
    html: '<code>discard</code>',
    line: 'if (hole > 0.5) discard;',
    lines: ['real holes: those fragments write no color and no depth', 'the ball behind shows through'],
  },
  {
    html: '<code>alpha = 0.0</code>',
    line: 'if (hole > 0.5) gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);',
    lines: ["black dots: the material isn't transparent, so alpha is ignored", 'the ball behind stays hidden'],
  },
];

const panelMaterial = (line: string, uniforms: Record<string, THREE.IUniform>) =>
  new THREE.ShaderMaterial({
    uniforms,
    side: THREE.DoubleSide,
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform float uHoleSize;
      uniform vec3 uColor;
      varying vec2 vUv;
      void main() {
        vec2 cell = fract(vUv * vec2(12.0, 8.0)) - 0.5; // 12 × 8 cells, each measured from its middle
        float hole = step(length(cell), uHoleSize);    // 1 inside a hole
        gl_FragColor = vec4(uColor, 1.0);
        ${line}
        #include <colorspace_fragment>
      }`,
  });

export const cutout: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(1.1, 1.65, 2.8);
  controls.target.set(0, 1.3, -0.4);

  const uniforms = { uHoleSize: { value: 0.3 }, uColor: { value: new THREE.Color('#64748b') } };
  const materials = VERSIONS.map((version) => panelMaterial(version.line, uniforms));
  const panel = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.6), materials[0]);
  panel.position.set(0, 1.25, 0);
  scene.add(panel);

  const behind = ball(COLORS.orange, 1, 0.45);
  behind.position.set(0.2, 1.2, -1.1);
  scene.add(behind);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  let current = 0;

  const update = () => {
    panel.material = materials[current];
    readout.textContent = [VERSIONS[current].line, ...VERSIONS[current].lines].join('\n');
  };

  choiceButtons(
    controlsBar,
    VERSIONS.map((version, i) => ({
      html: version.html,
      select: () => {
        current = i;
        update();
      },
    })),
  );
  slider(controlsBar, 'Hole size', { min: 0.1, max: 0.45, step: 0.05, value: uniforms.uHoleSize.value }, (value) => {
    uniforms.uHoleSize.value = value;
  });
};
