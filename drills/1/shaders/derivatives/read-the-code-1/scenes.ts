// Scenes for the derivatives page. The README places each one with <div data-scene="name">.
import { choiceButtons, COLORS, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const VERSIONS = [
  {
    html: '<code>step</code>: a fixed width',
    // The slider reads as hundredths of a unit here: a line reaches that far on each side.
    lines: (width: number) => [
      `float line = 1.0 - step(${(width * 0.01).toFixed(3)}, min(toLine.x, toLine.y));`,
      `lines ${(width * 0.02).toFixed(2)} units wide: fat up close, broken and shimmering far off`,
    ],
    fragment: 'float line = 1.0 - step(uWidth * 0.01, min(toLine.x, toLine.y));',
  },
  {
    html: '<code>fwidth</code>: one pixel',
    lines: (width: number) => [
      `vec2 inPixels = toLine / (fwidth(vWorldPos.xz) * ${width.toFixed(1)});`,
      `lines about ${width} pixels wide at every distance, with soft edges`,
    ],
    fragment: `
      vec2 inPixels = toLine / (fwidth(vWorldPos.xz) * uWidth);
      float line = 1.0 - min(min(inPixels.x, inPixels.y), 1.0);`,
  },
];

const gridMaterial = (fragment: string, uniforms: Record<string, THREE.IUniform>) =>
  new THREE.ShaderMaterial({
    uniforms,
    vertexShader: /* glsl */ `
      varying vec3 vWorldPos;
      void main() {
        vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * viewMatrix * vec4(vWorldPos, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform float uWidth;
      uniform vec3 uFloor;
      uniform vec3 uLine;
      varying vec3 vWorldPos;
      void main() {
        vec2 toLine = abs(fract(vWorldPos.xz - 0.5) - 0.5);
        ${fragment}
        gl_FragColor = vec4(mix(uFloor, uLine, line), 1.0);
        #include <colorspace_fragment>
      }`,
  });

export const grid: SceneSetup = ({ scene, camera, controls, container }) => {
  // Low, looking across the floor toward the horizon, so near and far lines are both in view.
  camera.position.set(0, 1.4, 3.2);
  controls.target.set(0, 0.1, -2.5);
  for (const child of scene.children) {
    if (child instanceof THREE.GridHelper || child instanceof THREE.AxesHelper) child.visible = false;
  }

  const uniforms = {
    uWidth: { value: 1.5 },
    uFloor: { value: new THREE.Color('#1e293b') },
    uLine: { value: new THREE.Color(COLORS.white) },
  };
  const materials = VERSIONS.map((version) => gridMaterial(version.fragment, uniforms));
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 80).rotateX(-Math.PI / 2), materials[0]);
  floor.position.y = 0.05;
  scene.add(floor);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  let current = 0;

  const update = () => {
    floor.material = materials[current];
    readout.textContent = [
      'vec2 toLine = abs(fract(vWorldPos.xz - 0.5) - 0.5);',
      ...VERSIONS[current].lines(uniforms.uWidth.value),
    ].join('\n');
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
  slider(controlsBar, 'width', { min: 0.5, max: 4, step: 0.5, value: uniforms.uWidth.value }, (value) => {
    uniforms.uWidth.value = value;
    update();
  });
};
