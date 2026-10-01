import { Object3D, Vector3 } from 'three';
import { attempt, arrow, COLORS, overlay, setArrow } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { markerNormal } from './drill';

export const marker: SceneSetup = ({ scene, container, onFrame }) => {
  const parent = new Object3D();
  parent.scale.set(3, 1, 0.5);
  parent.rotation.y = 0.5;
  const mesh = new Object3D();
  mesh.rotation.z = 0.4;
  parent.add(mesh);
  scene.add(parent);
  const normalArrow = arrow(COLORS.green);
  scene.add(normalArrow);
  const readout = overlay(container, 'readout');
  onFrame(() => {
    const result = attempt('world normal', () => markerNormal(new Vector3(1, 1, 1).normalize(), mesh));
    if (result.ok) setArrow(normalArrow, new Vector3(0, 1, 0), result.value);
    readout.textContent = result.ok ? 'Green: world-space surface normal' : result.note;
  });
};
