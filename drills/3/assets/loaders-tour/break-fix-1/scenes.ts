import { attempt, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { BoxGeometry, Mesh, MeshStandardMaterial } from 'three';
import { configureCompressed } from './drill';

export const decoders: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const product = new Mesh(new BoxGeometry(), new MeshStandardMaterial({ color: COLORS.green }));
  product.position.y = 0.6;
  scene.add(product);
  const configured: string[] = [];
  const loader = {
    setDRACOLoader: () => { configured.push('Draco'); },
    setMeshoptDecoder: () => { configured.push('Meshopt'); },
  };
  const result = attempt('configureCompressed', () => configureCompressed(loader, {}, {}));
  overlay(container, 'readout').textContent = result.ok
    ? `Draco product: ${configured.includes('Draco') ? 'loads' : 'fails'}\nMeshopt product: ${configured.includes('Meshopt') ? 'loads' : 'fails'}`
    : result.note;
};
