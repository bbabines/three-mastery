import { attempt, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { Mesh, MeshBasicMaterial, PlaneGeometry, ShaderMaterial, Vector3 } from 'three';
import {normalDebug} from './drill';
export const preview: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 1.2, 3);
  controls.target.set(0, 0.5, 0);
  const plane = new Mesh<PlaneGeometry, MeshBasicMaterial | ShaderMaterial>(
    new PlaneGeometry(1.8, 1.4), new MeshBasicMaterial({ color: '#555555' }),
  );
  plane.position.y = 0.6;
  scene.add(plane);
  const result = attempt('normalDebug', () => normalDebug(new Vector3(-1, 0, 0)));
  if (result.ok) plane.material = result.value;
  overlay(container, 'readout').textContent = result.ok
    ? 'Input normal: (-1, 0, 0)\nA useful debug color keeps the negative X direction visible.'
    : result.note;
};
