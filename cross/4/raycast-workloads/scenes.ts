import { Mesh, MeshBasicMaterial, Object3D, PlaneGeometry, Raycaster, Vector3 } from 'three';
import { attempt, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { measureRaycasts } from './drill';

export const workloads: SceneSetup = ({ scene, container }) => {
  const hierarchy = new Object3D();
  let node = hierarchy;
  for (let i = 0; i < 150; i++) { const next = new Object3D(); node.add(next); node = next; }
  node.add(new Mesh(new PlaneGeometry(4,4), new MeshBasicMaterial()));
  scene.add(hierarchy);
  const dense = new Mesh(new PlaneGeometry(4,4,400,400), new MeshBasicMaterial());
  dense.updateMatrixWorld(true); // query-only mesh: don't render hundreds of thousands of triangles every frame
  scene.updateMatrixWorld(true);
  const ray = new Raycaster(new Vector3(0,0,5), new Vector3(0,0,-1));
  const readout = overlay(container, 'readout');
  readout.textContent = 'Measure both workloads.';
  const controls = overlay(container, 'controls');
  const button = document.createElement('button');
  button.textContent = 'Measure';
  controls.append(button);
  button.addEventListener('click', () => {
    const result = attempt('raycast cost', () => measureRaycasts(ray,hierarchy,dense,3));
    readout.textContent = result.ok ? `Tree: ${result.value.hierarchyMs.toFixed(1)} ms, ${result.value.hierarchyHits} hits\nDense: ${result.value.denseMs.toFixed(1)} ms, ${result.value.denseHits} hits` : result.note;
  });
};
