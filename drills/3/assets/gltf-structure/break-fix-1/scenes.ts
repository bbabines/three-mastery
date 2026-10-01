import { attempt, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { BoxGeometry, Group, Mesh, MeshStandardMaterial } from 'three';
import { primitiveMeshes } from './drill';

export const primitives: SceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.4, 0);
  const part = new Group();
  const branch = new Group();
  const left = new Mesh(new BoxGeometry(0.8, 0.8, 0.8), new MeshStandardMaterial({ color: COLORS.red }));
  const right = new Mesh(new BoxGeometry(0.8, 0.8, 0.8), new MeshStandardMaterial({ color: COLORS.blue }));
  left.position.set(-0.7, 0.6, 0);
  right.position.set(0.7, 0.6, 0);
  branch.add(right); part.add(left, branch); scene.add(part);
  const readout = overlay(container, 'readout');
  onFrame(() => {
    const result = attempt('primitiveMeshes', () => primitiveMeshes(part));
    readout.textContent = result.ok
      ? `visible primitives: 2\naudit found: ${result.value.length}\n${result.value.length === 2 ? 'both materials counted' : 'blue material missing'}`
      : result.note;
  });
};
