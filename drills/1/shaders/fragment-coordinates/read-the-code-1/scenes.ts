// Scenes for the fragment coordinates page. The README places each one with <div data-scene="name">.
import { choiceButtons, COLORS, overlay, slider, sunlight } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const RATIOS = [1, 1.5, 2];

export const screen: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  camera.position.set(2.2, 2.4, 4.2);
  controls.target.set(0, 1.2, 0);
  scene.background = new THREE.Color('#475569'); // lighter than usual, so the vignette shows
  sunlight(scene, new THREE.Vector3(3, 5, 4), 0.6, 2.2);

  const part = new THREE.Mesh(new THREE.TorusKnotGeometry(0.55, 0.2, 160, 24), new THREE.MeshStandardMaterial({ color: COLORS.orange }));
  part.position.set(0, 1.2, 0);
  scene.add(part);

  // A rectangle covering the whole view, the way a post-processing pass draws: its corners go
  // straight to clip space, so it ignores the camera.
  const uniforms = { uResolution: { value: new THREE.Vector2(1, 1) }, uMark: { value: new THREE.Color(COLORS.yellow) } };
  const screenQuad = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      vertexShader: /* glsl */ `
        void main() {
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }`,
      fragmentShader: /* glsl */ `
        uniform vec2 uResolution;
        uniform vec3 uMark;
        void main() {
          vec2 screenUv = gl_FragCoord.xy / uResolution;
          float dark = smoothstep(0.3, 0.75, distance(screenUv, vec2(0.5)));
          // a ring where the shader thinks the middle is, and a line at gl_FragCoord.x = 400
          float ring = 1.0 - smoothstep(1.0, 2.5, abs(distance(gl_FragCoord.xy, uResolution * 0.5) - 16.0));
          float mark = 1.0 - step(1.5, abs(gl_FragCoord.x - 400.0));
          vec4 color = vec4(0.0, 0.0, 0.0, dark * 0.9);
          color = mix(color, vec4(uMark, 1.0), max(ring, mark));
          gl_FragColor = color;
          #include <colorspace_fragment>
        }`,
    }),
  );
  screenQuad.frustumCulled = false; // its corners ignore the camera, so three.js can't tell whether it's in view
  screenQuad.renderOrder = 10; // over everything else
  scene.add(screenQuad);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  let useDeviceSize = true;
  let ratio = 2;
  renderer.setPixelRatio(ratio);
  const cssSize = new THREE.Vector2();
  const deviceSize = new THREE.Vector2();

  onFrame(() => {
    renderer.getSize(cssSize);
    renderer.getDrawingBufferSize(deviceSize);
    uniforms.uResolution.value.copy(useDeviceSize ? deviceSize : cssSize);
    const hides = ratio === 1 && !useDeviceSize;
    readout.textContent = [
      `renderer.setPixelRatio(${ratio})`,
      `canvas: ${cssSize.x} × ${cssSize.y} CSS pixels, ${deviceSize.x} × ${deviceSize.y} device pixels`,
      useDeviceSize
        ? `uResolution = getDrawingBufferSize()   (${deviceSize.x}, ${deviceSize.y}): the vignette is centered`
        : `uResolution = getSize()   (${cssSize.x}, ${cssSize.y}): ${hides ? 'the same numbers at ratio 1, so the bug hides' : 'too small, so the vignette slides down-left'}`,
      `the line at gl_FragCoord.x = 400.0 is ${Math.round(400 / ratio)} CSS pixels from the left`,
    ].join('\n');
  });

  choiceButtons(controlsBar, [
    {
      html: '<code>getDrawingBufferSize()</code>',
      select: () => {
        useDeviceSize = true;
      },
    },
    {
      html: '<code>getSize()</code>',
      select: () => {
        useDeviceSize = false;
      },
    },
  ]);
  slider(controlsBar, 'Pixel ratio', { min: 0, max: RATIOS.length - 1, step: 1, value: RATIOS.indexOf(ratio) }, (value) => {
    ratio = RATIOS[value];
    renderer.setPixelRatio(ratio);
  });
};
