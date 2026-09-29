// Scenes for the normal matrix page. The README places each one with <div data-scene="name">.
import { arrow, ball, choiceButtons, COLORS, formatNumber, formatVector, label, line, overlay, setArrow, setLine, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const NORMAL_LENGTH = 0.45;
const SAMPLES = 24;

export const stretch: SceneSetup = ({ scene, camera, controls, container }) => {
  // Aimed above the ball, so the ball sits low in the frame, clear of the readout.
  camera.position.set(0, 2.3, 5.2);
  controls.target.set(0, 1.75, 0);

  const RADIUS = 0.8;
  const shape = new THREE.Mesh(new THREE.SphereGeometry(RADIUS, 64, 32), new THREE.MeshStandardMaterial({ color: COLORS.blue }));
  shape.position.set(0, 1.5, 0);
  scene.add(shape);

  // Normals around the ball's outline as the camera sees it: the ring facing the camera, where z = 0.
  const samples = Array.from({ length: SAMPLES }, (_, i) => {
    const angle = (i / SAMPLES) * Math.PI * 2;
    const normal = new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0); // measured from the ball itself
    const wrongLine = line(COLORS.red);
    const rightLine = line(COLORS.green);
    scene.add(wrongLine, rightLine);
    return { normal, point: normal.clone().multiplyScalar(RADIUS), wrongLine, rightLine };
  });

  const readout = overlay(container, 'readout');
  const sliders = overlay(container, 'controls');
  const values = { stretch: 2, size: 1 };
  const normalMatrix = new THREE.Matrix3();
  const start = new THREE.Vector3();
  const wrong = new THREE.Vector3();
  const right = new THREE.Vector3();

  const update = () => {
    shape.scale.set(values.stretch * values.size, values.size, values.size);
    shape.updateMatrixWorld();
    normalMatrix.getNormalMatrix(shape.matrixWorld);

    let worst = 0;
    for (const sample of samples) {
      start.copy(sample.point).applyMatrix4(shape.matrixWorld);
      wrong.copy(sample.normal).transformDirection(shape.matrixWorld);
      right.copy(sample.normal).applyNormalMatrix(normalMatrix);
      worst = Math.max(worst, THREE.MathUtils.radToDeg(wrong.angleTo(right)));
      setLine(sample.wrongLine, start, start.clone().addScaledVector(wrong, NORMAL_LENGTH));
      setLine(sample.rightLine, start, start.clone().addScaledVector(right, NORMAL_LENGTH));
    }

    const tilt = worst < 0.5 ? 'straight out too' : `up to ${formatNumber(worst, 0)}° off`;
    readout.innerHTML = [
      `ball.scale  ${formatVector(shape.scale, 2)}`,
      `<span style="color:${COLORS.red}">red    n.transformDirection(ball.matrixWorld)   ${tilt}</span>`,
      `<span style="color:${COLORS.green}">green  n.applyNormalMatrix(normalMatrix)        straight out</span>`,
    ].join('\n');
  };
  slider(sliders, 'Stretch wide', { min: 0.5, max: 2.5, step: 0.1, value: values.stretch }, (value) => {
    values.stretch = value;
    update();
  });
  slider(sliders, 'Grow evenly', { min: 0.6, max: 1.2, step: 0.1, value: values.size }, (value) => {
    values.size = value;
    update();
  });
  update();
};

const WRONG_LINE = 'vNormal = normalize(mat3(modelViewMatrix) * normal);';
const RIGHT_LINE = 'vNormal = normalize(normalMatrix * normal);';

export const light: SceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  camera.position.set(0, 3.4, 4.6);
  controls.target.set(0, 1.6, 0);

  // From the upper right, away from the readout in the top-left corner.
  const toLightWorld = new THREE.Vector3(0.9, 1, 0.4).normalize();
  const toLightCamera = new THREE.Vector3(); // the shader works in camera space, so the light must too
  const uniforms = {
    useNormalMatrix: { value: 0 },
    toLight: { value: toLightCamera },
  };
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: /* glsl */ `
      uniform float useNormalMatrix;
      varying vec3 vNormal;
      void main() {
        vec3 wrong = mat3(modelViewMatrix) * normal;
        vec3 right = normalMatrix * normal;
        vNormal = normalize(mix(wrong, right, useNormalMatrix));
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 toLight;
      varying vec3 vNormal;
      void main() {
        float light = max(dot(normalize(vNormal), toLight), 0.0);
        gl_FragColor = vec4(vec3(1.0, 0.85, 0.6) * (0.06 + 0.94 * light), 1.0);
        #include <colorspace_fragment>
      }`,
  });
  const shape = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 48), material);
  shape.position.set(0, 1.6, 0);

  const center = shape.position;
  const sun = ball(COLORS.yellow, 1, 0.12);
  sun.position.copy(center).addScaledVector(toLightWorld, 2);
  const sunArrow = arrow(COLORS.yellow);
  setArrow(sunArrow, sun.position, toLightWorld.clone().multiplyScalar(-0.9));
  const sunTag = label('light', COLORS.yellow);
  sunTag.position.copy(sun.position).add(new THREE.Vector3(0, 0.3, 0));

  // A dot on the top's gentle slope, where the two lines disagree most clearly.
  const polar = THREE.MathUtils.degToRad(45);
  const around = THREE.MathUtils.degToRad(-20);
  const dotNormal = new THREE.Vector3(Math.sin(polar) * Math.sin(around), Math.cos(polar), Math.sin(polar) * Math.cos(around));
  const dot = ball(COLORS.purple, 1, 0.05);
  scene.add(shape, sun, sunArrow, sunTag, dot);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  let height = 0.4;
  const normalMatrix = new THREE.Matrix3();
  const n = new THREE.Vector3();

  const update = () => {
    shape.scale.set(1.5, height, 1.5);
    shape.updateMatrixWorld();
    dot.position.copy(dotNormal).applyMatrix4(shape.matrixWorld);

    // What the shader works out, for the dot. Brightness doesn't depend on the space, as long
    // as the normal and the light are in the same one, so the world works here.
    const useRight = uniforms.useNormalMatrix.value === 1;
    if (useRight) n.copy(dotNormal).applyNormalMatrix(normalMatrix.getNormalMatrix(shape.matrixWorld));
    else n.copy(dotNormal).transformDirection(shape.matrixWorld);
    const brightness = Math.max(n.dot(toLightWorld), 0);

    const evenScale = Math.abs(height - 1.5) < 1e-6;
    readout.innerHTML = [
      useRight ? RIGHT_LINE : WRONG_LINE,
      `mesh.scale  ${formatVector(shape.scale, 2).padEnd(18)}<span style="color:${COLORS.purple}">●</span> light at the dot  ${formatNumber(brightness)}`,
      evenScale
        ? 'A plain ball: both lines give the same picture.'
        : useRight
          ? 'Straight-out normals: the flat top is evenly lit.'
          : 'Tilted normals: the flat top is shaded like a ball.',
    ].join('\n');
  };

  onFrame(() => {
    camera.updateMatrixWorld(); // also refreshes matrixWorldInverse, the world-to-camera matrix
    toLightCamera.copy(toLightWorld).transformDirection(camera.matrixWorldInverse);
  });

  choiceButtons(controlsBar, [
    {
      html: `<code>mat3(modelViewMatrix) * normal</code>`,
      select: () => {
        uniforms.useNormalMatrix.value = 0;
        update();
      },
    },
    {
      html: `<code>normalMatrix * normal</code>`,
      select: () => {
        uniforms.useNormalMatrix.value = 1;
        update();
      },
    },
  ]);
  slider(controlsBar, 'Height', { min: 0.3, max: 1.5, step: 0.1, value: height }, (value) => {
    height = value;
    update();
  });
};
