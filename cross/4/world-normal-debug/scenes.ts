import { DoubleSide, Mesh, MeshNormalMaterial, PlaneGeometry } from 'three';
import { attempt, label, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { worldNormalMaterial } from './drill';

export const normals: SceneSetup = ({ scene, container }) => {
  const geometry = new PlaneGeometry(2.2, 2.2).rotateX(0.35).rotateY(0.25);
  const place = (mesh: Mesh, x: number) => {
    mesh.scale.set(1.5, 0.7, 0.4);
    mesh.rotation.y = 0.45;
    mesh.position.set(x, 1.5, 0);
    scene.add(mesh);
  };
  place(new Mesh(geometry, new MeshNormalMaterial({ side: DoubleSide })), -1.7);
  const referenceLabel = label('view', '#e5e7eb');
  referenceLabel.position.set(-1.7, 3, 0);
  scene.add(referenceLabel);
  const result = attempt('world normals', () => worldNormalMaterial());
  if(result.ok) {
    place(new Mesh(geometry, result.value), 1.7);
    const answerLabel = label('world', '#e5e7eb');
    answerLabel.position.set(1.7, 3, 0);
    scene.add(answerLabel);
  }
  const readout = overlay(container,'readout');
  readout.textContent = result.ok
    ? 'Orbit: left view-normal colors move with the camera; right world-normal colors stay fixed.'
    : `Left: view-normal reference. ${result.note}`;
};
