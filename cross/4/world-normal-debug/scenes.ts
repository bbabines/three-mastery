import { Mesh, PlaneGeometry } from 'three';
import { attempt, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { worldNormalMaterial } from './drill';

export const normals: SceneSetup = ({ scene, container }) => {
  const result = attempt('world normals', () => worldNormalMaterial());
  if(result.ok) {
    const mesh = new Mesh(new PlaneGeometry(3,3),result.value);
    mesh.scale.set(2,1,0.5);
    mesh.rotation.y = 0.5;
    mesh.position.y=1.5;
    scene.add(mesh);
  }
  const readout = overlay(container,'readout');
  readout.textContent = result.ok ? 'Orbit the camera: raw world-normal color should stay fixed.' : result.note;
};
