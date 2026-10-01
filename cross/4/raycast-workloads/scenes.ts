import { Mesh, MeshBasicMaterial, Object3D, PlaneGeometry, Raycaster, Vector3 } from 'three';
import { attempt, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { measureRaycasts } from './drill';

export const workloads: SceneSetup = ({ scene, container }) => {
  const hierarchy = new Object3D();
  const leaf = new Mesh(new PlaneGeometry(4,4), new MeshBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.65 }));
  let depth = 150, segments = 400;
  const rebuildTree = () => {
    hierarchy.clear();
    let node = hierarchy;
    for (let i = 0; i < depth; i++) { const next = new Object3D(); node.add(next); node = next; }
    node.add(leaf);
    hierarchy.updateMatrixWorld(true);
  };
  rebuildTree();
  scene.add(hierarchy);
  const dense = new Mesh(new PlaneGeometry(4,4,segments,segments), new MeshBasicMaterial());
  dense.updateMatrixWorld(true); // query-only mesh: don't render hundreds of thousands of triangles every frame
  scene.updateMatrixWorld(true);
  const ray = new Raycaster(new Vector3(0,0,5), new Vector3(0,0,-1));
  const readout = overlay(container, 'readout');
  const prompt = () => `Blue: leaf under ${depth} nodes. Dense mesh: ${segments*segments*2} triangles (query-only). Press Measure.`;
  readout.textContent = prompt();
  const controls = overlay(container, 'controls');
  slider(controls, 'tree depth', {min: 10, max: 250, step: 20, value: depth}, (value) => {
    depth = value;
    rebuildTree();
    readout.textContent = prompt();
  });
  slider(controls, 'dense segments', {min: 40, max: 400, step: 40, value: segments}, (value) => {
    segments = value;
    dense.geometry.dispose();
    dense.geometry = new PlaneGeometry(4,4,segments,segments);
    dense.updateMatrixWorld(true);
    readout.textContent = prompt();
  });
  const button = document.createElement('button');
  button.textContent = 'Measure';
  controls.append(button);
  button.addEventListener('click', () => {
    const result = attempt('raycast cost', () => measureRaycasts(ray,hierarchy,dense,3));
    readout.textContent = result.ok ? `Tree (${depth} nodes): ${result.value.hierarchyMs.toFixed(1)} ms, ${result.value.hierarchyHits} hits\nDense (${segments*segments*2} triangles): ${result.value.denseMs.toFixed(1)} ms, ${result.value.denseHits} hits` : result.note;
  });
};
