import { BoxGeometry, Mesh, MeshBasicMaterial, Raycaster, Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { hitsNow } from './drill';
describe('hitsNow', () => {
  it('hits the position the box moved to this tick', () => {
    const box = new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial());
    box.updateMatrixWorld(true); box.position.set(3, 0, 0);
    const ray = new Raycaster(new Vector3(3, 0, 5), new Vector3(0, 0, -1));
    expect(hitsNow(ray, box)).toBe(true);
    const oldPositionRay = new Raycaster(new Vector3(0, 0, 5), new Vector3(0, 0, -1));
    expect(hitsNow(oldPositionRay, box)).toBe(false);
  });
});
