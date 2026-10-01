import { expect } from 'vitest';
import { BoxGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene } from 'three';
import type { Blocker } from './drill';

type Diagnose = (scene: Scene, camera: PerspectiveCamera, mesh: Mesh) => Blocker;

export function checkTriage(diagnose: Diagnose): void {
  const scene = new Scene();
  const camera = new PerspectiveCamera();
  const missing = new Mesh(new BoxGeometry(), new MeshBasicMaterial({ color: 0x000000 }));
  expect(diagnose(scene, camera, missing), 'a material cannot explain a node absent from the scene').toBe('scene');
}
