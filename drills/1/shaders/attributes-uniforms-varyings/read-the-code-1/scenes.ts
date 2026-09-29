// Scenes for the attributes, uniforms, varyings page. The README places each one with <div data-scene="name">.
import { ball, choiceButtons, COLORS, formatNumber, formatVector, label, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const vertexShaderFor = (interpolation: string) => /* glsl */ `
  attribute vec3 color; // declared here, since the material doesn't set vertexColors
  ${interpolation}varying vec3 vColor;
  void main() {
    vColor = color;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`;

const fragmentShaderFor = (interpolation: string) => /* glsl */ `
  ${interpolation}varying vec3 vColor;
  void main() {
    gl_FragColor = vec4(vColor, 1.0);
    #include <colorspace_fragment>
  }`;

export const blend: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 1.85, 4.5);
  controls.target.set(0, 1.95, 0);

  const corners = [new THREE.Vector3(-1.5, 0.75, 0), new THREE.Vector3(1.5, 0.75, 0), new THREE.Vector3(0, 2.85, 0)];
  const cornerColors = [new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1)];
  const geometry = new THREE.BufferGeometry().setFromPoints(corners);
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(cornerColors.flatMap((c) => c.toArray()), 3));

  const smooth = new THREE.ShaderMaterial({ vertexShader: vertexShaderFor(''), fragmentShader: fragmentShaderFor('') });
  const flat = new THREE.ShaderMaterial({ vertexShader: vertexShaderFor('flat '), fragmentShader: fragmentShaderFor('flat ') });
  const triangle = new THREE.Mesh(geometry, smooth);
  scene.add(triangle);

  const tags: [string, string, THREE.Vector3][] = [
    // Beside the bottom corners, not under them, where the controls bar would cover them.
    ['red (1, 0, 0)', COLORS.red, new THREE.Vector3(-2.5, 0.8, 0)],
    ['green (0, 1, 0)', COLORS.green, new THREE.Vector3(2.6, 0.8, 0)],
    ['blue (0, 0, 1)', COLORS.blue, new THREE.Vector3(1.05, 2.85, 0)],
  ];
  for (const [text, color, at] of tags) {
    const tag = label(text, color);
    tag.position.copy(at);
    scene.add(tag);
  }

  const dot = ball(COLORS.white, 1, 0.07);
  scene.add(dot);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const values = { across: 0.3, up: 0.2 };
  let isFlat = false;
  const blended = new THREE.Vector3();

  const update = () => {
    // The dot: across from the red corner to the green one, then up toward the blue one.
    const bottom = corners[0].clone().lerp(corners[1], values.across);
    dot.position.copy(bottom).lerp(corners[2], values.up);
    THREE.Triangle.getInterpolation(dot.position, corners[0], corners[1], corners[2], cornerColors[0], cornerColors[1], cornerColors[2], blended);
    dot.position.z = 0.04; // just in front of the triangle
    triangle.material = isFlat ? flat : smooth;
    readout.textContent = isFlat
      ? [
          'flat varying vec3 vColor;    vColor = color;',
          'vColor at the dot   (0, 0, 1), wherever the dot is',
          "no blending: one corner's value (here the blue one's), unchanged",
        ].join('\n')
      : [
          'varying vec3 vColor;         vColor = color;',
          `vColor at the dot   ${formatVector(blended, 2)}`,
          'a blend of all three corners: the nearer one counts more',
        ].join('\n');
  };

  choiceButtons(controlsBar, [
    {
      html: '<code>varying</code>',
      select: () => {
        isFlat = false;
        update();
      },
    },
    {
      html: '<code>flat varying</code>',
      select: () => {
        isFlat = true;
        update();
      },
    },
  ]);
  slider(controlsBar, 'Red to green', { min: 0, max: 1, step: 0.05, value: values.across }, (value) => {
    values.across = value;
    update();
  });
  slider(controlsBar, 'Toward blue', { min: 0, max: 1, step: 0.05, value: values.up }, (value) => {
    values.up = value;
    update();
  });
};

export const clock: SceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  camera.position.set(0, 2.2, 4.6);
  controls.target.set(0, 1.55, 0);

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uSpeed: { value: 0.5 },
      uTint: { value: new THREE.Color(COLORS.orange) },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform float uSpeed;
      uniform vec3 uTint;
      varying vec2 vUv;
      void main() {
        float band = step(0.5, fract(vUv.y * 5.0 - uTime * uSpeed));
        gl_FragColor = vec4(mix(uTint * 0.2, uTint, band), 1.0);
        #include <colorspace_fragment>
      }`,
  });
  const beacon = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 2.2, 48), material);
  beacon.position.set(0, 1.3, 0);
  scene.add(beacon);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  let copyBug = false;
  let time = 0;

  onFrame((_, elapsed) => {
    if (copyBug) time = elapsed;
    else material.uniforms.uTime.value = elapsed;
    const uniformValue = formatNumber(material.uniforms.uTime.value, 1);
    readout.textContent = copyBug
      ? [
          'time = elapsed;    // uniforms: { uTime: { value: time } }',
          `time                            ${formatNumber(time, 1)}`,
          `material.uniforms.uTime.value   ${uniformValue}   the copy made at the start`,
          'the rings are frozen: the shader never sees the new time',
        ].join('\n')
      : [
          'material.uniforms.uTime.value = elapsed;',
          `elapsed                         ${formatNumber(elapsed, 1)}`,
          `material.uniforms.uTime.value   ${uniformValue}`,
          'the rings scroll: three.js uploads the new value each frame',
        ].join('\n');
  });

  choiceButtons(controlsBar, [
    {
      html: '<code>material.uniforms.uTime.value = elapsed</code>',
      select: () => {
        copyBug = false;
      },
    },
    {
      html: '<code>time = elapsed</code>',
      select: () => {
        copyBug = true;
        material.uniforms.uTime.value = 0; // the number { value: time } copied when the material was made
      },
    },
  ]);
  slider(controlsBar, 'uSpeed', { min: 0, max: 1.5, step: 0.1, value: material.uniforms.uSpeed.value }, (value) => {
    material.uniforms.uSpeed.value = value;
  });
};
