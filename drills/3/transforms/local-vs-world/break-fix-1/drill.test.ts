import { expectUnchanged, expectVector } from '@harness/check';
import { Object3D, Vector3 } from 'three';
import { describe, it } from 'vitest';
import { lampPosition } from './drill';

function nestedPart() {
  const rack = new Object3D();
  rack.position.set(3, 1, -2);
  rack.rotation.y = 0.6;
  const shelf = new Object3D();
  shelf.position.set(1, 0.5, 0);
  shelf.scale.set(1.5, 1, 0.8);
  const part = new Object3D();
  part.position.set(0.4, 0.2, -0.3);
  rack.add(shelf);
  shelf.add(part);
  return { rack, shelf, part };
}

describe('lampPosition', () => {
  it('puts the lamp at a nested part in world space', () => {
    const { part } = nestedPart();
    expectVector(lampPosition(part), part.getWorldPosition(new Vector3()));
  });

  it('follows a translated and turned rack', () => {
    const { rack, part } = nestedPart();
    rack.position.set(-4, 2, 6);
    rack.rotation.set(0.2, -0.8, 0.3);
    expectVector(lampPosition(part), part.getWorldPosition(new Vector3()));
  });

  it('leaves local position and parent transforms alone', () => {
    const { rack, shelf, part } = nestedPart();
    const [rackPosition, shelfPosition, partPosition] = [rack.position.clone(), shelf.position.clone(), part.position.clone()];
    lampPosition(part);
    expectUnchanged(rack.position, rackPosition, 'rack position');
    expectUnchanged(shelf.position, shelfPosition, 'shelf position');
    expectUnchanged(part.position, partPosition, 'part position');
  });
});
