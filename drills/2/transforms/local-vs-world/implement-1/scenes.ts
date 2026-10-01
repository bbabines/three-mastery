import { attempt, ball, COLORS, line, overlay, setLine, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { Group, Object3D, Vector3 } from 'three';
import { nearestBin, worldGap } from './drill';

export const aisle: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(6, 6, 8);
  controls.target.set(0, 0.8, 0);
  const cart = new Group();
  const rackA = new Group();
  const rackB = new Group();
  const robot = new Object3D();
  const bins = [new Object3D(), new Object3D()];
  const dots = bins.map(() => ball(COLORS.blue));
  const robotDot = ball(COLORS.orange);
  const ring = ball(COLORS.white, 0.45, 0.28);
  const reach = line(COLORS.yellow);
  robot.position.set(0, 1, 0);
  bins[0].position.set(0, 1, 0);
  bins[1].position.set(1, 1, 0);
  rackA.position.set(-2.5, 0, 0);
  rackB.position.set(2.5, 0, -1);
  cart.add(robot, robotDot);
  rackA.add(bins[0], dots[0]);
  rackB.add(bins[1], dots[1]);
  scene.add(cart, rackA, rackB, ring, reach);
  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const update = () => {
    const picked = attempt('nearestBin', () => nearestBin(robot, bins));
    const gap = attempt('worldGap', () => worldGap(robot, bins[0]));
    const world = bins.map((bin) => bin.getWorldPosition(new Vector3()));
    const robotWorld = robot.getWorldPosition(new Vector3());
    const expected = world.map((position) => position.distanceTo(robotWorld));
    const closest = expected.indexOf(Math.min(...expected));
    ring.position.copy(world[closest]);
    ring.visible = true;
    reach.visible = picked.ok && picked.value >= 0 && picked.value < bins.length;
    if (picked.ok && reach.visible) setLine(reach, robotWorld, world[picked.value]);
    readout.textContent = [picked.ok ? `nearestBin: ${picked.value} ${picked.value === closest ? '✓' : '✗'}` : picked.note,
      gap.ok ? `gap to first bin: ${gap.value.toFixed(2)}` : gap.note].join('\n');
  };
  slider(controlsBar, 'cart', { min: -4, max: 4, step: 0.1, value: 0 }, (x) => { cart.position.x = x; update(); });
  slider(controlsBar, 'rack turn', { min: -90, max: 90, step: 5, value: 0 }, (degrees) => { rackB.rotation.y = degrees * Math.PI / 180; update(); });
  update();
};
