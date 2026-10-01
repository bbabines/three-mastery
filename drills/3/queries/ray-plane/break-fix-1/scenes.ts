import { ball, choiceButtons, COLORS, line, overlay, setLine } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { planeHit } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(4, 4, 7);
  controls.target.set(0, 0.8, 0);
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.1);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), new THREE.MeshBasicMaterial({ color: COLORS.blue, side: THREE.DoubleSide, transparent: true, opacity: 0.2 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0.1;
  scene.add(floor);
  const path = line(COLORS.white);
  scene.add(path);
  const yourMark = ball(COLORS.red), expectedMark = ball(COLORS.yellow);
  scene.add(yourMark, expectedMark);
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  const show = (down: boolean) => {
    const ray = new THREE.Ray(new THREE.Vector3(-1, 2, 0), new THREE.Vector3(1, down ? -1 : 1, 0).normalize());
    setLine(path, ray.origin, ray.at(4, new THREE.Vector3()));
    const expected = ray.intersectPlane(plane, new THREE.Vector3());
    let got: THREE.Vector3 | null = null;
    let error: unknown;
    try { got = planeHit(ray, plane); } catch (caught) { error = caught; }
    expectedMark.visible = expected !== null;
    if (expected) expectedMark.position.copy(expected);
    yourMark.visible = got !== null;
    if (got) yourMark.position.copy(got);
    readout.textContent = error
      ? `planeHit threw: ${String(error)}`
      : `white: ${down ? 'downward' : 'upward'} ray | blue: plane\nyellow: true hit | red: your hit\nexpected: ${expected ? 'hit' : 'no hit'} | yours: ${got ? 'hit' : 'no hit'}`;
  };
  choiceButtons(bar, [{ html: 'toward plane', select: () => show(true) }, { html: 'away from plane', select: () => show(false) }]);
  show(true);
};
