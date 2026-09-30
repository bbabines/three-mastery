// Scenes for the built-in matrices and spaces page. The README places each one with <div data-scene="name">.
import { choiceButtons, COLORS, formatNumber, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const HEIGHTS = [
  {
    html: '<code>position.y</code>',
    line: 'vHeight = position.y;',
    note: 'measured from the object itself: the lines ride along with it',
  },
  {
    html: '<code>modelMatrix</code>',
    line: 'vHeight = (modelMatrix * vec4(position, 1.0)).y;',
    note: 'the world: the lines stay level, like a water line',
  },
  {
    html: '<code>modelViewMatrix</code>',
    line: 'vHeight = (modelViewMatrix * vec4(position, 1.0)).y;',
    note: 'measured from the camera: the lines change as you orbit',
  },
];

// Contour lines every quarter unit of vHeight, on a surface shaded so its shape reads.
const heightMaterial = (line: string) =>
  new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(COLORS.blue) } },
    vertexShader: /* glsl */ `
      varying float vHeight;
      varying vec3 vViewNormal;
      void main() {
        ${line}
        vViewNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      varying float vHeight;
      varying vec3 vViewNormal;
      void main() {
        float shade = 0.4 + 0.6 * abs(normalize(vViewNormal).z);
        float lines = step(0.84, fract(vHeight * 4.0));
        gl_FragColor = vec4(mix(uColor * shade, vec3(1.0), lines), 1.0);
        #include <colorspace_fragment>
      }`,
  });

export const heights: SceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  camera.position.set(2.7, 2.35, 3.6);
  controls.target.set(0, 1.45, 0);

  const materials = HEIGHTS.map((space) => heightMaterial(space.line));
  const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 2.2, 48, 16), materials[0]);
  scene.add(cylinder);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const values = { tilt: 25, lift: 1.4 };
  let current = 0;
  const topCenter = new THREE.Vector3(0, 1.1, 0); // measured from the cylinder itself
  const world = new THREE.Vector3();
  const fromCamera = new THREE.Vector3();

  const update = () => {
    cylinder.rotation.z = THREE.MathUtils.degToRad(values.tilt);
    cylinder.position.y = values.lift;
    cylinder.material = materials[current];
  };

  onFrame(() => {
    cylinder.updateMatrixWorld();
    camera.updateMatrixWorld(); // also refreshes matrixWorldInverse, the view matrix
    world.copy(topCenter).applyMatrix4(cylinder.matrixWorld);
    fromCamera.copy(world).applyMatrix4(camera.matrixWorldInverse);
    readout.textContent = [
      HEIGHTS[current].line,
      HEIGHTS[current].note,
      `height of the top's center:  object ${formatNumber(topCenter.y)}   world ${formatNumber(world.y)}   camera ${formatNumber(fromCamera.y)}`,
    ].join('\n');
  });

  choiceButtons(
    controlsBar,
    HEIGHTS.map((space, i) => ({
      html: space.html,
      select: () => {
        current = i;
        update();
      },
    })),
  );
  slider(controlsBar, 'tilt', { min: -50, max: 50, step: 5, value: values.tilt }, (value) => {
    values.tilt = value;
    update();
  });
  slider(controlsBar, 'lift', { min: 1.3, max: 2, step: 0.1, value: values.lift }, (value) => {
    values.lift = value;
    update();
  });
};

const RIMS = [
  {
    html: '<code>normalMatrix</code>, <code>n.z</code>',
    normal: 'vNormal = normalize(normalMatrix * normal);',
    rim: 'float rim = 1.0 - abs(n.z);',
    lines: [
      'vNormal = normalize(normalMatrix * normal);   measured from the camera',
      'float rim = 1.0 - abs(n.z);                    you look along -Z here',
      'right: the glow hugs the outline from any angle',
    ],
  },
  {
    html: '<code>modelMatrix</code>, <code>n.z</code>',
    normal: 'vNormal = normalize(mat3(modelMatrix) * normal);',
    rim: 'float rim = 1.0 - abs(n.z);',
    lines: [
      'vNormal = normalize(mat3(modelMatrix) * normal);   the world',
      "float rim = 1.0 - abs(n.z);    the world's Z, not the way you look",
      'wrong: the glow is stuck to the ball, off the outline',
    ],
  },
  {
    html: '<code>modelMatrix</code>, <code>cameraPosition</code>',
    normal: 'vNormal = normalize(mat3(modelMatrix) * normal);',
    rim: 'float rim = 1.0 - abs(dot(n, normalize(cameraPosition - vWorldPos)));',
    lines: [
      'vNormal = normalize(mat3(modelMatrix) * normal);   the world',
      'float rim = 1.0 - abs(dot(n, normalize(cameraPosition - vWorldPos)));',
      'right: both in the world, so the glow hugs the outline',
    ],
  },
];

const rimMaterial = (normalLine: string, rimLine: string) =>
  new THREE.ShaderMaterial({
    uniforms: {
      uBase: { value: new THREE.Color('#1e293b') },
      uGlow: { value: new THREE.Color(COLORS.orange) },
    },
    vertexShader: /* glsl */ `
      varying vec3 vNormal;
      varying vec3 vWorldPos;
      void main() {
        ${normalLine}
        vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uBase;
      uniform vec3 uGlow;
      varying vec3 vNormal;
      varying vec3 vWorldPos;
      void main() {
        vec3 n = normalize(vNormal);
        ${rimLine}
        gl_FragColor = vec4(mix(uBase, uGlow, pow(rim, 2.5)), 1.0);
        #include <colorspace_fragment>
      }`,
  });

export const rim: SceneSetup = ({ scene, camera, controls, container }) => {
  // From the side, so a glow stuck to the world's Z would cross the middle of the ball.
  camera.position.set(4.6, 2.4, 1.3);
  controls.target.set(0, 1.5, 0);

  const materials = RIMS.map((version) => rimMaterial(version.normal, version.rim));
  const ball = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 32), materials[0]);
  ball.position.set(0, 1.35, 0);
  scene.add(ball);

  const readout = overlay(container, 'readout');
  choiceButtons(
    overlay(container, 'controls'),
    RIMS.map((version, i) => ({
      html: version.html,
      select: () => {
        ball.material = materials[i];
        readout.textContent = version.lines.join('\n');
      },
    })),
  );
};
