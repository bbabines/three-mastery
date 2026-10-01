import { attempt, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { BoxGeometry, Mesh, MeshStandardMaterial } from 'three';
import { isMirrored } from './drill';

export const mirrorAudit: SceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const ordinary = new Mesh(new BoxGeometry(), new MeshStandardMaterial({ color: COLORS.blue }));
  const mirrored = new Mesh(new BoxGeometry(), new MeshStandardMaterial({ color: COLORS.orange }));
  ordinary.position.set(-1.2, 0.6, 0); mirrored.position.set(1.2, 0.6, 0);
  ordinary.rotation.y = Math.PI; mirrored.rotation.y = Math.PI;
  mirrored.scale.x = -1;
  scene.add(ordinary, mirrored);
  const readout = overlay(container, 'readout');
  onFrame(() => {
    scene.updateMatrixWorld(true);
    const a = attempt('isMirrored', () => isMirrored(ordinary.matrixWorld.clone()));
    const b = attempt('isMirrored', () => isMirrored(mirrored.matrixWorld.clone()));
    if (!a.ok) { readout.textContent = a.note; return; }
    if (!b.ok) { readout.textContent = b.note; return; }
    readout.textContent = `blue mirrored? ${a.value} (should be false)\norange mirrored? ${b.value} (should be true)`;
  });
};
