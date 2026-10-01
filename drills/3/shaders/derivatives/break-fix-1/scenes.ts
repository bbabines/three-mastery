import { attempt, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { Mesh, MeshBasicMaterial, PlaneGeometry, ShaderMaterial } from 'three';
import { gridShader } from './drill';

export const preview: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 1.2, 3);
  controls.target.set(0, 0.5, 0);
  const plane = new Mesh<PlaneGeometry, MeshBasicMaterial | ShaderMaterial>(
    new PlaneGeometry(1.8, 1.8), new MeshBasicMaterial({ color: '#555555' }),
  );
  plane.position.y = 0.6;
  scene.add(plane);
  const result = attempt('gridShader', () => gridShader());
  if (result.ok) plane.material = result.value;
  const readout = overlay(container, 'readout');
  const update = (scale: number) => {
    plane.scale.setScalar(scale);
    readout.textContent = result.ok
      ? `Grid size: ${Math.round(scale * 100)}%\nShrink it and check whether the thin lines remain visible.`
      : result.note;
  };
  slider(overlay(container, 'controls'), 'grid size', { min: 0.35, max: 1, step: 0.05, value: 1 }, update);
  update(1);
};
