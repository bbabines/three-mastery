import { BoxGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene } from 'three';
import { describe, expect, it } from 'vitest';
import { firstBlocker } from './drill';

describe('firstBlocker', () => {
  it('checks membership and camera before an appearance problem', () => {
    const scene = new Scene();
    const camera = new PerspectiveCamera(50, 1, 0.1, 20);
    camera.position.set(0, 0, 5); camera.lookAt(0, 0, 0);
    const mesh = new Mesh(new BoxGeometry(), new MeshBasicMaterial({ color: 0x000000 }));
    expect(firstBlocker(scene, camera, mesh)).toBe('scene');
    scene.add(mesh); mesh.position.x = 100;
    expect(firstBlocker(scene, camera, mesh)).toBe('camera');
    mesh.position.x = 0;
    expect(firstBlocker(scene, camera, mesh)).toBe('material');
    mesh.material.color.set(0xffffff);
    expect(firstBlocker(scene, camera, mesh)).toBe('none');
  });
});
