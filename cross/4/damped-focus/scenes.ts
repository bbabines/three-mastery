import { BoxGeometry, Mesh, MeshBasicMaterial, Object3D, Vector3 } from 'three';
import { attempt, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { focusStep } from './drill';

export const focus: SceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  const group = new Object3D();
  group.position.set(2,0,0);
  group.add(new Mesh(new BoxGeometry(1,1,1), new MeshBasicMaterial({color:0x22c55e})));
  scene.add(group);
  const readout = overlay(container,'readout');
  onFrame((delta) => {
    const result = attempt('focus', () => focusStep(camera,controls.target,group,delta));
    if (result.ok) { camera.position.copy(result.value.position); controls.target.copy(result.value.target); }
    readout.textContent = result.ok ? 'Camera and target ease toward green part' : result.note;
  });
};
