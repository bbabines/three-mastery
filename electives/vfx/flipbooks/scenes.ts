import { overlay, slider } from '@harness/lesson';
import type { TslSceneSetup } from '@harness/tsl';
import * as THREE from 'three/webgpu';

export const preview: TslSceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 1.4, 3.8); controls.target.set(0, 1.4, 0);
  for (const child of scene.children) if (child instanceof THREE.AxesHelper) child.visible = false;
  const tiles: THREE.Mesh[] = [];
  for (let index = 0; index < 8; index++) {
    const column = index % 4, row = Math.floor(index / 4);
    const material = new THREE.MeshBasicNodeMaterial({ color: 0x2e4054 });
    const tile = new THREE.Mesh(new THREE.PlaneGeometry(0.47, 0.47), material);
    tile.position.set((column - 1.5) * 0.52, 1.14 + row * 0.52, 0);
    scene.add(tile); tiles.push(tile);
  }
  const readout = overlay(container, 'readout');
  const select = (frame: number) => {
    tiles.forEach((tile, index) => (tile.material as THREE.MeshBasicNodeMaterial).color.setHex(index === frame ? 0xffbd59 : 0x2e4054));
    readout.textContent = `4 columns × 2 rows · frame ${frame} = column ${frame % 4}, row ${Math.floor(frame / 4)} from the bottom`;
  };
  slider(container, 'frame', { min: 0, max: 7, step: 1, value: 0 }, select);
  select(0);
};
