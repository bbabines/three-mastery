import { attempt, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { BoxGeometry, Mesh, MeshStandardMaterial, Texture } from 'three';
import { loadSwatches } from './drill';

export const swatches: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  for (const [index, color] of [COLORS.blue, COLORS.red, COLORS.blue].entries()) {
    const mesh = new Mesh(new BoxGeometry(0.6, 0.6, 0.6), new MeshStandardMaterial({ color }));
    mesh.position.set(index - 1, 0.5, 0);
    scene.add(mesh);
  }
  const readout = overlay(container, 'readout');
  let calls = 0;
  const result = attempt('loadSwatches', () => loadSwatches(['blue.ktx2', 'red.ktx2', 'blue.ktx2'], {
    loadAsync: async () => { calls += 1; return new Texture(); },
  }));
  if (!result.ok) { readout.textContent = result.note; return; }
  void result.value.then((textures) => {
    readout.textContent = `swatches: 3\ntranscodes: ${calls}\nblue shares texture: ${textures[0] === textures[2]}`;
  });
};
