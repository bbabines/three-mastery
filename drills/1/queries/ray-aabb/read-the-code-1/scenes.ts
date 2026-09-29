// Scenes for the ray–AABB page. The README places each one with <div data-scene="name">.
import { ball, COLORS, formatVector, label, line, overlay, pointer, setLine, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

export const roomLaser: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(1.4, 3.6, 5.6);
  controls.target.set(-0.3, 0.8, 0);

  // The room: a Box3, its floor just above the grid.
  const room = new THREE.Box3(new THREE.Vector3(-1.8, 0.05, -1.4), new THREE.Vector3(1.8, 2.2, 1.4));
  const walls = new THREE.Box3Helper(room, COLORS.yellow);
  const roomTag = label('room: a Box3', COLORS.yellow);
  roomTag.position.set(2.5, 1.3, 1.4); // beside its front corner, clear of the readout

  const laser = pointer(COLORS.red, 0.5);
  const ray = line(COLORS.red);
  const dot = ball(COLORS.white, 1, 0.08);
  scene.add(walls, roomTag, laser, ray, dot);

  const readout = overlay(container, 'readout');
  const sliders = overlay(container, 'controls');
  const values = { x: 0, turn: 30 };
  const start = new THREE.Vector3();
  const direction = new THREE.Vector3();
  const spot = new THREE.Vector3();

  const update = () => {
    start.set(values.x, 1, 0.2);
    const angle = THREE.MathUtils.degToRad(values.turn);
    direction.set(Math.cos(angle), 0, -Math.sin(angle));
    laser.position.copy(start);
    laser.lookAt(start.clone().add(direction));
    const r = new THREE.Ray(start, direction);
    const where = r.intersectBox(room, spot);
    const inside = room.containsPoint(start);

    setLine(ray, start, where ? spot : r.at(6, new THREE.Vector3()));
    dot.visible = !!where;
    if (where) dot.position.copy(spot);
    readout.textContent = [
      `start ${formatVector(start)}: ${inside ? 'inside the room' : 'outside the room'}`,
      `ray.intersectsBox(room) → ${r.intersectsBox(room)}`,
      `ray.intersectBox(room, spot) → ${
        where ? `${formatVector(spot, 2)}, where it ${inside ? 'goes out' : 'comes in'}` : 'null: the room is behind the start or off to the side'
      }`,
    ].join('\n');
  };
  slider(sliders, 'Move the start', { min: -4, max: 1.5, step: 0.25, value: values.x }, (value) => {
    values.x = value;
    update();
  });
  slider(sliders, 'Turn the laser', { min: -180, max: 180, step: 10, value: values.turn }, (value) => {
    values.turn = value;
    update();
  });
  update();
};
