// Scenes for the ray–plane page. The README places each one with <div data-scene="name">.
import { ball, COLORS, formatNumber, formatVector, label, line, overlay, pointer, pointerSpot, pointerToNdc, setLine, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const f = (n: number) => formatNumber(n, 2);

export const laserFloor: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0.6, 1.9, 5.6);
  controls.target.set(0, 1, 0);

  // The floor here is the plane itself, drawn as a big blue patch, so the grid is hidden.
  const grid = scene.children.find((child) => child instanceof THREE.GridHelper);
  if (grid) grid.visible = false;
  const patch = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 5).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({ color: COLORS.blue, transparent: true, opacity: 0.18, depthWrite: false }),
  );
  const floorTag = label('floor: an endless plane', COLORS.blue);
  floorTag.position.set(1.2, 0.25, 1.6);

  const laser = pointer(COLORS.red, 0.6);
  const ray = line(COLORS.red);
  const hitMark = ball(COLORS.white, 1, 0.08);
  scene.add(patch, floorTag, laser, ray, hitMark);

  const floor = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const readout = overlay(container, 'readout');
  const sliders = overlay(container, 'controls');
  const values = { tilt: -30, height: 1.5 };
  const start = new THREE.Vector3();
  const direction = new THREE.Vector3();
  const spot = new THREE.Vector3();

  const update = () => {
    const angle = THREE.MathUtils.degToRad(values.tilt);
    start.set(-2.5, values.height, 0);
    direction.set(Math.cos(angle), Math.sin(angle), 0);
    laser.position.copy(start);
    laser.lookAt(start.clone().add(direction));
    const r = new THREE.Ray(start, direction);
    const hit = r.intersectPlane(floor, spot);

    setLine(ray, start, hit ? spot : r.at(8, new THREE.Vector3()));
    hitMark.visible = !!hit;
    if (hit) hitMark.position.copy(spot);
    const parallel = Math.abs(direction.y) < 1e-9;
    const result = hit
      ? r.distanceToPlane(floor) === 0
        ? `→ ${formatVector(spot, 2)}: it starts ${parallel ? 'and stays ' : ''}on the floor, so it hits at its start`
        : `→ ${formatVector(spot, 2)}, ${f(r.distanceToPlane(floor)!)} along the ray`
      : parallel
        ? '→ null: the ray runs parallel to the floor'
        : '→ null: the floor is behind the ray';
    readout.textContent = [
      `laser at height ${values.height}, tilted ${values.tilt}°`,
      'const floor = new Plane(new Vector3(0, 1, 0), 0)',
      'ray.intersectPlane(floor, spot)',
      result,
    ].join('\n');
  };
  slider(sliders, 'tilt', { min: -60, max: 30, step: 5, value: values.tilt }, (value) => {
    values.tilt = value;
    update();
  });
  slider(sliders, 'height', { min: 0, max: 2, step: 0.5, value: values.height }, (value) => {
    values.height = value;
    update();
  });
  update();
};

export const placementGrid: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  // Low enough that the horizon shows near the top of the view.
  camera.position.set(0, 2.1, 5.6);
  controls.target.set(0, 0.7, 0);

  const ghost = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.8, 0.8),
    new THREE.MeshStandardMaterial({ color: COLORS.yellow, transparent: true, opacity: 0.6 }),
  );
  ghost.position.set(0.5, 0.4, 0.5);
  const hitMark = ball(COLORS.white, 1, 0.06);
  scene.add(ghost, hitMark);

  const floor = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const canvas = renderer.domElement;
  const raycaster = new THREE.Raycaster();
  const pointerNdc = new THREE.Vector2();
  const spot = new THREE.Vector3();
  pointerSpot(container, canvas, controlsBar, (event) => pointerToNdc(event, canvas, pointerNdc), { across: 0.62, down: 0.72 });

  // Once a frame from the saved pointer, so the ghost stays right while the camera orbits.
  onFrame(() => {
    raycaster.setFromCamera(pointerNdc, camera);
    const hit = raycaster.ray.intersectPlane(floor, spot);
    hitMark.visible = !!hit;
    if (hit) {
      hitMark.position.copy(spot);
      ghost.position.set(Math.floor(spot.x) + 0.5, 0.4, Math.floor(spot.z) + 0.5);
    }
    readout.textContent = [
      'raycaster.setFromCamera(pointer, camera)',
      'raycaster.ray.intersectPlane(floor, spot)',
      hit ? `→ spot ${formatVector(spot, 2)}` : '→ null: the pointer is above the horizon',
      hit ? `ghost at the middle of its cell ${formatVector(ghost.position)}` : 'the ghost stays where it was',
    ].join('\n');
  });
};
