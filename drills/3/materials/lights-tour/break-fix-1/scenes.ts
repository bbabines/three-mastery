import { attempt, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { ceilingPanel } from './drill';
export const preview: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(2.3, 2.8, 3.5);
  controls.target.set(0, 1, 0);
  for (const child of [...scene.children]) if (child instanceof THREE.HemisphereLight) scene.remove(child);
  const table = new THREE.Mesh<THREE.PlaneGeometry, THREE.Material>(
    new THREE.PlaneGeometry(2.5, 1.8), new THREE.MeshStandardMaterial({ color: '#553923' }),
  );
  table.rotation.x = -Math.PI / 2;
  table.position.y = 0.2;
  scene.add(table);
  const panel = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({ color: '#e8efff', side: THREE.DoubleSide }),
  );
  panel.rotation.x = -Math.PI / 2;
  panel.position.y = 2;
  scene.add(panel);
  const result = attempt('ceilingPanel', () => ceilingPanel(1.5, 1.5));
  if (result.ok) { table.material = result.value.surface; scene.add(result.value.light); }
  overlay(container, 'readout').textContent = result.ok
    ? `Ceiling panel: visible\nTable surface: ${result.value.surface.type}\nThe tabletop should receive its area light.`
    : result.note;
};
