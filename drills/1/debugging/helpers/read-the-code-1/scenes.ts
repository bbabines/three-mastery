// Scenes for the helpers page. The README places each one with <div data-scene="name">.
import { buttonGroup, choiceButtons, COLORS, formatNumber, overlay, slider, sunlight } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { VertexNormalsHelper } from 'three/addons/helpers/VertexNormalsHelper.js';

// A small pump: a boxy base with a tank on top, turned so its own axes differ from the world's.
function buildPump() {
  const pump = new THREE.Group();
  const base = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.3, 0.7), new THREE.MeshStandardMaterial({ color: COLORS.blue }));
  base.position.y = 0.15;
  const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.7, 20), new THREE.MeshStandardMaterial({ color: COLORS.orange }));
  tank.position.set(0.2, 0.65, 0);
  pump.add(base, tank);
  pump.traverse((object) => (object.castShadow = true));
  pump.position.set(0, 0.02, 0);
  pump.rotation.y = THREE.MathUtils.degToRad(35);
  return { pump, tank };
}

export const helperTour: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  camera.position.set(2.6, 2.6, 3.6);
  controls.target.set(0.3, 0.5, 0);
  renderer.shadowMap.enabled = true;
  // Low and behind the pump, so its shadow falls toward the camera.
  const sun = sunlight(scene, new THREE.Vector3(-3, 3, -1.5), 1.3, 2.5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.near = 1; // a short box instead of the default 500 units deep
  sun.shadow.camera.far = 9;
  const axes = scene.children.find((child) => child instanceof THREE.AxesHelper);
  if (axes) axes.visible = false; // the tour has its own

  // A floor to catch the shadow, just under the grid lines.
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(8, 8).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#3a3f4a' }));
  floor.position.y = -0.01;
  floor.receiveShadow = true;
  const { pump, tank } = buildPump();
  scene.add(floor, pump);
  scene.updateMatrixWorld();

  const pumpAxes = new THREE.AxesHelper(0.8);
  const bounds = new THREE.BoxHelper(pump, COLORS.yellow);
  const shadowView = new THREE.CameraHelper(sun.shadow.camera);
  const hex = (color: string) => new THREE.Color(color).getHex(); // these two helpers' types want a number
  const normals = new VertexNormalsHelper(tank, 0.2, hex(COLORS.green));
  const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -1.2); // the flat y = 1.2, level with the tank's top
  const planeView = new THREE.PlaneHelper(dragPlane, 2.4, hex(COLORS.purple));

  const tour = [
    {
      html: 'AxesHelper',
      helper: pumpAxes,
      parent: pump as THREE.Object3D,
      lines: ['pump.add(new AxesHelper(0.8))', "the pump's own X, Y, Z: turned 35° from the world's"],
    },
    {
      html: 'BoxHelper',
      helper: bounds,
      parent: scene as THREE.Object3D,
      lines: ['scene.add(new BoxHelper(pump))', 'the box around the pump, lined up with the world axes'],
    },
    {
      html: 'CameraHelper on the shadow',
      helper: shadowView,
      parent: scene as THREE.Object3D,
      lines: ['scene.add(new CameraHelper(sun.shadow.camera))', "the sun's shadow box: no shadow outside it"],
    },
    {
      html: 'VertexNormalsHelper',
      helper: normals,
      parent: scene as THREE.Object3D,
      lines: ['scene.add(new VertexNormalsHelper(tank, 0.2))', "a line along each of the tank's vertex normals"],
    },
    {
      html: 'PlaneHelper',
      helper: planeView,
      parent: scene as THREE.Object3D,
      lines: ['scene.add(new PlaneHelper(dragPlane, 2.4))', 'the flat plane y = 1.2 a drag could slide along'],
    },
  ];
  let shown = tour[0];

  let half = 2;
  const setShadowBox = () => {
    const shadowCamera = sun.shadow.camera;
    shadowCamera.left = shadowCamera.bottom = -half;
    shadowCamera.right = shadowCamera.top = half;
    shadowCamera.updateProjectionMatrix();
    shadowView.update();
  };
  setShadowBox();

  const bar = overlay(container, 'controls');
  choiceButtons(
    buttonGroup(bar),
    tour.map((item) => ({
      html: item.html,
      select: () => {
        shown.helper.removeFromParent();
        shown = item;
        item.parent.add(item.helper);
      },
    })),
  );
  slider(bar, 'shadow box', { min: 0.3, max: 2, step: 0.1, value: half }, (value) => {
    half = value;
    setShadowBox();
  });

  const readout = overlay(container, 'readout');
  onFrame(() => {
    readout.textContent = [
      ...shown.lines,
      `sun.shadow.camera: left ${formatNumber(-half, 1)}, right ${formatNumber(half, 1)}, top ${formatNumber(half, 1)}, bottom ${formatNumber(-half, 1)}`,
    ].join('\n');
  });
};
