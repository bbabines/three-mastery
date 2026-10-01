import { attempt, COLORS, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { BoxGeometry, Mesh, MeshStandardMaterial, Vector2 } from 'three';
import { applyPixelBudget } from './drill';

export const phoneBudget: SceneSetup = ({ scene, renderer, camera, controls, container, onFrame }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const mesh = new Mesh(new BoxGeometry(), new MeshStandardMaterial({ color: COLORS.green }));
  mesh.position.y = 0.6;
  scene.add(mesh);
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  const values = { dpr: 3 };
  onFrame(() => {
    const result = attempt('applyPixelBudget', () => applyPixelBudget({ setPixelRatio: (value) => { if (renderer.getPixelRatio() !== value) renderer.setPixelRatio(value); } }, values.dpr));
    if (!result.ok) { readout.textContent = result.note; return; }
    const size = renderer.getDrawingBufferSize(new Vector2());
    readout.textContent = `device DPR: ${values.dpr}\nchosen DPR: ${result.value}\nbuffer pixels: ${(size.x * size.y).toLocaleString()}`;
  });
  slider(bar, 'device DPR', { min: 1, max: 3.5, step: 0.25, value: values.dpr }, (value) => { values.dpr = value; });
};
