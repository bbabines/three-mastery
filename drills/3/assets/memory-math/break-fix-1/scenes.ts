import { attempt, COLORS, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { Mesh, MeshStandardMaterial, PlaneGeometry } from 'three';
import { textureBytes } from './drill';

export const textureBudget: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 3, 5);
  controls.target.set(0, 0, 0);
  const swatch = new Mesh(new PlaneGeometry(2.5, 2.5), new MeshStandardMaterial({ color: COLORS.purple, side: 2 }));
  swatch.rotation.x = -Math.PI / 2;
  scene.add(swatch);
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  const update = (size: number) => {
    const result = attempt('textureBytes', () => textureBytes(size, size));
    const base = size * size * 4;
    readout.textContent = result.ok
      ? `${size} × ${size} RGBA\nbase ${(base / 1048576).toFixed(1)} MiB\nyour budget ${(result.value / 1048576).toFixed(1)} MiB`
      : result.note;
  };
  slider(bar, 'size', { min: 512, max: 4096, step: 512, value: 2048 }, update);
  update(2048);
};
