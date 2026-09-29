// Scenes for the debug output page. The README places each one with <div data-scene="name">.
// The debug shaders here leave out #include <colorspace_fragment> on purpose, the way
// MeshNormalMaterial does, so the colors on screen are the values themselves.
import { choiceButtons, COLORS, formatVector, label, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const worldNormalVertex = /* glsl */ `
  varying vec3 vWorldNormal;
  void main() {
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`;

const NORMAL_VIEWS = [
  {
    html: '<code>MeshNormalMaterial</code>',
    material: () => new THREE.MeshNormalMaterial(),
    lines: ['mesh.material = new MeshNormalMaterial();', 'normals measured from the camera: orbit, and the colors change'],
  },
  {
    html: 'world normals',
    material: () =>
      new THREE.ShaderMaterial({
        vertexShader: worldNormalVertex,
        fragmentShader: /* glsl */ `
          varying vec3 vWorldNormal;
          void main() {
            gl_FragColor = vec4(normalize(vWorldNormal) * 0.5 + 0.5, 1.0);
          }`,
      }),
    lines: ['gl_FragColor = vec4(normalize(vWorldNormal) * 0.5 + 0.5, 1.0);', 'world normals: the colors stay as you orbit, and change as it turns'],
  },
  {
    html: 'no <code>* 0.5 + 0.5</code>',
    material: () =>
      new THREE.ShaderMaterial({
        vertexShader: worldNormalVertex,
        fragmentShader: /* glsl */ `
          varying vec3 vWorldNormal;
          void main() {
            gl_FragColor = vec4(normalize(vWorldNormal), 1.0);
          }`,
      }),
    lines: ['gl_FragColor = vec4(normalize(vWorldNormal), 1.0);', 'not remapped: negative parts clip to 0, so faces toward -X, -Y, -Z go dark'],
  },
];

export const normals: SceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  camera.position.set(2.1, 2.1, 2.8);
  controls.target.set(0, 1.15, 0);

  const materials = NORMAL_VIEWS.map((view) => view.material());
  const assembly = new THREE.Group();
  assembly.position.set(0, 1.1, 0);
  const box = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.7, 0.9), materials[0]);
  box.position.set(-0.65, 0, 0);
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.45, 48, 24), materials[0]);
  sphere.position.set(0.55, 0, 0.1);
  const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 1.1, 32), materials[0]);
  cylinder.position.set(0.1, 0.2, -0.75);
  assembly.add(box, sphere, cylinder);
  scene.add(assembly);
  const parts = [box, sphere, cylinder];

  const sideTag = label('+X side', COLORS.white);
  sideTag.position.set(0.62, 0.5, 0); // over the box's +X side, measured from the box
  box.add(sideTag);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  let current = 0;
  const worldNormal = new THREE.Vector3();
  const shown = new THREE.Vector3();

  onFrame(() => {
    assembly.updateMatrixWorld();
    camera.updateMatrixWorld(); // also refreshes matrixWorldInverse, the view matrix
    // The +X side's normal, measured from the box, in the space each view shows.
    worldNormal.set(1, 0, 0).transformDirection(box.matrixWorld);
    shown.copy(worldNormal);
    if (current === 0) shown.transformDirection(camera.matrixWorldInverse);
    if (current === 2) shown.clampScalar(0, 1);
    else shown.multiplyScalar(0.5).addScalar(0.5);
    readout.textContent = [
      ...NORMAL_VIEWS[current].lines,
      `the +X side's color: ${formatVector(shown, 2)}`,
    ].join('\n');
  });

  choiceButtons(
    controlsBar,
    NORMAL_VIEWS.map((view, i) => ({
      html: view.html,
      select: () => {
        current = i;
        for (const part of parts) part.material = materials[i];
      },
    })),
  );
  slider(controlsBar, 'Turn the part', { min: -90, max: 90, step: 15, value: 0 }, (value) => {
    assembly.rotation.y = THREE.MathUtils.degToRad(value);
  });
};

const NEAR = 2;
const FAR = 10;

const VIEWS = [
  {
    html: 'UVs',
    color: 'vUv, 0.0',
    note: 'red across, green up: a hard jump in color is a seam',
  },
  {
    html: 'UV checker',
    color: 'vec3(mod(floor(vUv.x * 16.0) + floor(vUv.y * 8.0), 2.0))',
    note: 'even squares where the UVs are even; stretched or pinched ones where they are not',
  },
  {
    html: '<code>gl_FragCoord.z</code>',
    color: 'vec3(gl_FragCoord.z)',
    note: 'almost white everywhere: depth is squeezed toward 1',
  },
  {
    html: 'view depth',
    color: 'vec3((vViewZ - uNear) / (uFar - uNear))',
    note: `black at ${NEAR}, white at ${FAR}: how far in front of the camera, spread evenly`,
  },
];

const viewMaterial = (color: string) =>
  new THREE.ShaderMaterial({
    uniforms: { uNear: { value: NEAR }, uFar: { value: FAR } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      varying float vViewZ;
      void main() {
        vUv = uv;
        vec4 viewPos = modelViewMatrix * vec4(position, 1.0);
        vViewZ = -viewPos.z; // how far in front of the camera
        gl_Position = projectionMatrix * viewPos;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uNear;
      uniform float uFar;
      varying vec2 vUv;
      varying float vViewZ;
      void main() {
        gl_FragColor = vec4(${color}, 1.0);
      }`,
  });

export const views: SceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  camera.position.set(0.3, 1.9, 4.2);
  controls.target.set(0.1, 0.95, -1.1);
  for (const child of scene.children) {
    if (child instanceof THREE.GridHelper || child instanceof THREE.AxesHelper) child.visible = false;
  }

  const materials = VIEWS.map((view) => viewMaterial(view.color));
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.55, 48, 24), materials[0]);
  sphere.position.set(-1.3, 1, 1);
  const box = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 0.9), materials[0]);
  box.position.set(0, 1, -1);
  box.rotation.y = Math.PI / 5;
  const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(0.5, 0.17, 160, 24), materials[0]);
  knot.position.set(1.5, 1.1, -3.2);
  const shapes = [sphere, box, knot];
  scene.add(...shapes);

  const readout = overlay(container, 'readout');
  let current = 0;
  const spot = new THREE.Vector3();

  onFrame(() => {
    camera.updateMatrixWorld();
    let values = '';
    if (current === 2 || current === 3) {
      // Each shape's center, worked out the same way the shader does it.
      values = shapes
        .map((shape, i) => {
          const name = ['sphere', 'box', 'knot'][i];
          if (current === 2) return `${name} ${(spot.copy(shape.position).project(camera).z * 0.5 + 0.5).toFixed(3)}`;
          const ahead = -spot.copy(shape.position).applyMatrix4(camera.matrixWorldInverse).z;
          return `${name} ${((ahead - NEAR) / (FAR - NEAR)).toFixed(2)}`;
        })
        .join('   ');
    }
    readout.textContent = [
      `gl_FragColor = vec4(${VIEWS[current].color}, 1.0);`,
      VIEWS[current].note,
      ...(values ? [`at the centers:  ${values}`] : []),
    ].join('\n');
  });

  choiceButtons(
    overlay(container, 'controls'),
    VIEWS.map((view, i) => ({
      html: view.html,
      select: () => {
        current = i;
        for (const shape of shapes) shape.material = materials[i];
      },
    })),
  );
};
