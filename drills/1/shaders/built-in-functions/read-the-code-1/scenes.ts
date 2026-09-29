// Scenes for the built-in functions page. The README places each one with <div data-scene="name">.
import { choiceButtons, COLORS, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const STEPS = [
  {
    html: '<code>fract</code>',
    expression: 'f',
    note: 'a ramp from 0 to 1 that starts over: dark to light, again and again',
  },
  {
    html: '<code>step</code>',
    expression: 'step(0.5, f)',
    note: 'a hard cut: 0 below 0.5, 1 from 0.5 up',
  },
  {
    html: '<code>smoothstep</code>',
    expression: 'smoothstep(0.4, 0.6, f)',
    note: 'a soft cut: 0 below 0.4, 1 above 0.6, fading between',
  },
];

const stripeMaterial = (expression: string, uniforms: Record<string, THREE.IUniform>) =>
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
      uniform float uCount;
      uniform vec3 uDark;
      uniform vec3 uLight;
      varying vec2 vUv;
      void main() {
        float f = fract(vUv.x * uCount);
        float s = ${expression};
        gl_FragColor = vec4(mix(uDark, uLight, s), 1.0);
        #include <colorspace_fragment>
      }`,
  });

export const stripes: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 1.45, 4.3);
  controls.target.set(0, 1.35, 0);

  const uniforms = {
    uCount: { value: 8 },
    uDark: { value: new THREE.Color('#1e293b') },
    uLight: { value: new THREE.Color(COLORS.yellow) },
  };
  const materials = STEPS.map((version) => stripeMaterial(version.expression, uniforms));
  const panel = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 1.6), materials[0]);
  panel.position.set(0, 1.25, 0);
  scene.add(panel);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  let current = 0;
  let turn = 0;

  const update = () => {
    panel.material = materials[current];
    panel.rotation.y = THREE.MathUtils.degToRad(turn);
    readout.textContent = [
      `float f = fract(vUv.x * ${uniforms.uCount.value.toFixed(1)});   0 to 1, ${uniforms.uCount.value} times across`,
      `float s = ${STEPS[current].expression};`,
      STEPS[current].note,
    ].join('\n');
  };

  choiceButtons(
    controlsBar,
    STEPS.map((version, i) => ({
      html: version.html,
      select: () => {
        current = i;
        update();
      },
    })),
  );
  slider(controlsBar, 'Repeats', { min: 2, max: 30, step: 1, value: uniforms.uCount.value }, (value) => {
    uniforms.uCount.value = value;
    update();
  });
  slider(controlsBar, 'Turn away', { min: 0, max: 85, step: 5, value: turn }, (value) => {
    turn = value;
    update();
  });
};

export const rings: SceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  camera.position.set(0, 4.6, 5.4);
  controls.target.set(0, 0.2, 0.2);

  const uniforms = {
    uTime: { value: 0 },
    uCenter: { value: new THREE.Vector2(0, 0) },
    uInner: { value: 1 },
    uOuter: { value: 2.5 },
    uFloor: { value: new THREE.Color('#1e293b') },
    uGlow: { value: new THREE.Color(COLORS.orange) },
  };
  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(3.4, 128).rotateX(-Math.PI / 2),
    new THREE.ShaderMaterial({
      uniforms,
      vertexShader: /* glsl */ `
        varying vec3 vWorldPos;
        void main() {
          vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * viewMatrix * vec4(vWorldPos, 1.0);
        }`,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform vec2 uCenter;
        uniform float uInner;
        uniform float uOuter;
        uniform vec3 uFloor;
        uniform vec3 uGlow;
        varying vec3 vWorldPos;
        void main() {
          float d = distance(vWorldPos.xz, uCenter);
          float rings = step(0.5, fract(d * 2.0 - uTime));
          float mask = 1.0 - smoothstep(uInner, uOuter, d);
          gl_FragColor = vec4(mix(uFloor, uGlow, rings * mask), 1.0);
          #include <colorspace_fragment>
        }`,
    }),
  );
  floor.position.y = 0.05; // just above the grid
  scene.add(floor);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const values = { inner: 1, outer: 2.5 };

  const update = () => {
    // smoothstep needs its first edge below its second, so the outer edge stays past the inner one.
    uniforms.uInner.value = values.inner;
    uniforms.uOuter.value = Math.max(values.outer, values.inner + 0.1);
    // Written the way GLSL needs them, with a decimal point: 1.0, not 1.
    const inner = uniforms.uInner.value.toFixed(1);
    const outer = uniforms.uOuter.value.toFixed(1);
    readout.textContent = [
      'float rings = step(0.5, fract(d * 2.0 - uTime));   rings moving outward',
      `float mask = 1.0 - smoothstep(${inner}, ${outer}, d);  1 inside ${inner}, 0 past ${outer}`,
      'mix(uFloor, uGlow, rings * mask)                  rings, faded by the mask',
    ].join('\n');
  };
  onFrame((_, elapsed) => {
    uniforms.uTime.value = elapsed * 0.5;
  });

  slider(controlsBar, 'Fade starts (uInner)', { min: 0, max: 3, step: 0.1, value: values.inner }, (value) => {
    values.inner = value;
    update();
  });
  slider(controlsBar, 'Fade ends (uOuter)', { min: 0.2, max: 3.4, step: 0.1, value: values.outer }, (value) => {
    values.outer = value;
    update();
  });
  update();
};
