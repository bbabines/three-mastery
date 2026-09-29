// Scenes for the vertex vs fragment page. The README places each one with <div data-scene="name">.
import { choiceButtons, COLORS, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const SEGMENTS = [1, 2, 3, 4, 6, 8, 16, 32, 64];

export const flag: SceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  // Aimed above the flag, so it sits low in the frame, clear of the readout.
  camera.position.set(2.2, 2.6, 4.4);
  controls.target.set(0.2, 1.6, 0);

  const uniforms = {
    uTime: { value: 0 },
    uStripeA: { value: new THREE.Color(COLORS.orange) },
    uStripeB: { value: new THREE.Color(COLORS.white) },
  };
  const material = new THREE.ShaderMaterial({
    uniforms,
    side: THREE.DoubleSide,
    vertexShader: /* glsl */ `
      uniform float uTime;
      varying vec2 vUv;
      varying float vLift;
      void main() {
        vec3 p = position;
        p.z += sin(p.x * 3.0 + uTime * 2.0) * 0.25;
        vUv = uv;
        vLift = p.z / 0.25; // -1 in a dip, 1 on a crest
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uStripeA;
      uniform vec3 uStripeB;
      varying vec2 vUv;
      varying float vLift;
      void main() {
        vec3 color = mix(uStripeA, uStripeB, step(0.5, fract(vUv.y * 6.0)));
        color *= 0.5 + 0.5 * (vLift * 0.5 + 0.5); // darker in the dips, so the folds show
        gl_FragColor = vec4(color, 1.0);
        #include <colorspace_fragment>
      }`,
  });
  const cloth = new THREE.Mesh(new THREE.PlaneGeometry(3, 2, 8, 1), material);
  cloth.position.set(0, 1.2, 0);
  scene.add(cloth);

  const readout = overlay(container, 'readout');
  const sliders = overlay(container, 'controls');
  let segments = 8;
  const update = () => {
    cloth.geometry.dispose();
    cloth.geometry = new THREE.PlaneGeometry(3, 2, segments, 1);
  };
  slider(sliders, 'Detail', { min: 0, max: SEGMENTS.length - 1, step: 1, value: SEGMENTS.indexOf(segments) }, (value) => {
    segments = SEGMENTS[value];
    update();
  });

  onFrame((_, elapsed) => {
    uniforms.uTime.value = elapsed;
    const vertices = cloth.geometry.attributes.position.count;
    readout.textContent = [
      `new PlaneGeometry(3, 2, ${segments}, 1)   ${vertices} vertices`,
      `vertex shader:    p.z += sin(p.x * 3.0 + uTime * 2.0) * 0.25;`,
      `                  runs ${vertices} times, once per vertex`,
      `fragment shader:  stripes, at every pixel the flag covers`,
    ].join('\n');
  });
};

const MAX_PANES = 7;

export const overdraw: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(1.7, 1.85, 1.9);
  controls.target.set(0, 1.3, -1);

  const helpers = scene.children.filter((child) => child instanceof THREE.GridHelper || child instanceof THREE.AxesHelper);
  const background = scene.background;

  // The normal view: see-through glass.
  const glass = new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(COLORS.blue) } },
    transparent: true,
    vertexShader: /* glsl */ `
      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      void main() {
        gl_FragColor = vec4(uColor, 0.3);
        #include <colorspace_fragment>
      }`,
  });
  // The run-count view: every fragment adds the same small amount of light. It leaves out the
  // colorspace line on purpose, so each run adds exactly the same step to the screen.
  const counter = new THREE.ShaderMaterial({
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    depthWrite: false,
    vertexShader: glass.vertexShader,
    fragmentShader: /* glsl */ `
      void main() {
        gl_FragColor = vec4(0.14, 0.09, 0.03, 1.0);
      }`,
  });

  // One behind another, seen from the side, so each layer shows as a step.
  const paneGeometry = new THREE.PlaneGeometry(1.6, 1.6);
  const panes = Array.from({ length: MAX_PANES }, (_, i) => {
    const pane = new THREE.Mesh(paneGeometry, glass);
    pane.position.set(0, 1.35, -i * 0.32);
    scene.add(pane);
    return pane;
  });

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  let count = 5;
  let counting = false;

  const update = () => {
    panes.forEach((pane, i) => {
      pane.visible = i < count;
      pane.material = counting ? counter : glass;
    });
    for (const helper of helpers) helper.visible = !counting;
    scene.background = counting ? new THREE.Color(0x000000) : background;
    readout.textContent = [
      `${count} see-through panes, drawn back to front`,
      counting
        ? 'run-count view: each fragment adds one step of light'
        : 'normal view: the screen keeps one color per pixel',
      `where all ${count} overlap: the fragment shader ran ${count} ${count === 1 ? 'time' : 'times'} per pixel`,
    ].join('\n');
  };

  choiceButtons(controlsBar, [
    {
      html: 'Normal view',
      select: () => {
        counting = false;
        update();
      },
    },
    {
      html: 'Run-count view',
      select: () => {
        counting = true;
        update();
      },
    },
  ]);
  slider(controlsBar, 'Panes', { min: 1, max: MAX_PANES, step: 1, value: count }, (value) => {
    count = value;
    update();
  });
};
