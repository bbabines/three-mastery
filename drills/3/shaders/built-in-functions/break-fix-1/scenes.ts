import { attempt, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { Mesh, MeshBasicMaterial, PlaneGeometry, ShaderMaterial } from 'three';
import {softRing} from './drill';
export const preview: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 1.2, 3);
  controls.target.set(0, 0.5, 0);
  const plane = new Mesh<PlaneGeometry, MeshBasicMaterial | ShaderMaterial>(
    new PlaneGeometry(1.8, 1.8), new MeshBasicMaterial({ color: '#555555' }),
  );
  plane.position.y = 0.6;
  scene.add(plane);
  const result = attempt('softRing', () => softRing());
  if (result.ok) plane.material = result.value;
  overlay(container, 'readout').textContent = result.ok
    ? 'White ring on black\nInspect both edges for a narrow gray transition.'
    : result.note;
};
