import { attempt, COLORS, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { Mesh, MeshStandardMaterial, PlaneGeometry } from 'three';
import { textureSize } from './drill';

export const thumbnailBudget: SceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  camera.position.set(0, 3, 5);
  controls.target.set(0, 0.2, 0);
  const tile = new Mesh(new PlaneGeometry(2, 2), new MeshStandardMaterial({ color: COLORS.blue, side: 2 }));
  tile.rotation.x = -Math.PI / 2;
  scene.add(tile);
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  const values = { css: 160 };
  onFrame(() => {
    const result = attempt('textureSize', () => textureSize(values.css, 2, 4096));
    if (!result.ok) { readout.textContent = result.note; return; }
    const mib = (result.value ** 2 * 4 * 4 / 3) / 1048576;
    readout.textContent = `${values.css} CSS pixels at DPR 2\nchosen: ${result.value}² texels\nroughly ${mib.toFixed(1)} MiB with mips`;
  });
  slider(bar, 'thumbnail width', { min: 80, max: 1000, step: 20, value: values.css }, (value) => { values.css = value; });
};
