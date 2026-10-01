import { Ray, Vector3 } from 'three';
import { attempt, ball, COLORS, line, overlay, setLine } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { dragFloor } from './drill';

export const floor: SceneSetup = ({ scene, container, onFrame }) => {
  const marker = ball(COLORS.green, 1, 0.2);
  scene.add(marker);
  const grabbed = new Vector3(0.5, 0, 0);
  const handle = ball(COLORS.blue, 1, 0.13);
  handle.position.copy(grabbed);
  scene.add(handle);
  const rayGuide = line(COLORS.orange);
  scene.add(rayGuide);
  const readout = overlay(container, 'readout');
  onFrame((_, elapsed) => {
    const ray = new Ray(new Vector3(3, 5, 4), new Vector3(Math.sin(elapsed) - 1, -3, -2).normalize());
    setLine(rayGuide, ray.origin, ray.at(7, new Vector3()));
    const result = attempt('part origin', () => dragFloor(ray, grabbed, new Vector3(0, 0, 0)));
    if (result.ok) marker.position.copy(result.value);
    readout.textContent = result.ok ? 'Orange: pointer ray. Blue: original grab. Green: part origin.' : `Orange: pointer ray. Blue: original grab. ${result.note}`;
  });
};
