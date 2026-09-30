import { answered, expectNumber, expectUnchanged, expectVector } from '@harness/check';
import { Object3D, Quaternion, Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { beamInWorld, hotspotInWorld } from './drill';

const HOTSPOT = new Vector3(0.4, 0.8, 0.3);
const BEAM = new Vector3(0.2, -1, 2); // any length: the answer is length 1
const SLIDE = new Vector3(3, 0, -1.5);

// A turntable that has slid, turned, and grown, with its matrixWorld up to date.
function turntable(at = new Vector3(2, 0.3, -1.5)) {
  const table = new Object3D();
  table.position.copy(at);
  table.rotation.set(0, 0.9, 0);
  table.scale.setScalar(1.5);
  table.updateMatrixWorld();
  return table;
}

describe('hotspotInWorld', () => {
  it('puts the hotspot where localToWorld does', () => {
    const table = turntable();
    expectVector(hotspotInWorld(HOTSPOT.clone(), table.matrixWorld.clone()), table.localToWorld(HOTSPOT.clone()), 'hotspot');
  });

  it('moves with the turntable when it slides', () => {
    const before = answered(hotspotInWorld(HOTSPOT.clone(), turntable().matrixWorld.clone()));
    const after = hotspotInWorld(HOTSPOT.clone(), turntable(new Vector3(2, 0.3, -1.5).add(SLIDE)).matrixWorld.clone());
    expectVector(after, before.clone().add(SLIDE), 'hotspot after the slide');
  });

  it("doesn't change the hotspot or the matrix", () => {
    const table = turntable();
    const hotspot = HOTSPOT.clone();
    const matrix = table.matrixWorld.clone();
    answered(hotspotInWorld(hotspot, matrix));
    expectUnchanged(hotspot, HOTSPOT, 'hotspot');
    expect(matrix.equals(table.matrixWorld), 'matrixWorld was changed').toBe(true);
  });
});

describe('beamInWorld', () => {
  it('turns with the turntable', () => {
    const table = turntable();
    const turn = table.getWorldQuaternion(new Quaternion());
    expectVector(beamInWorld(BEAM.clone(), table.matrixWorld.clone()), BEAM.clone().applyQuaternion(turn).normalize(), 'beam');
  });

  it("ignores the turntable's slide", () => {
    const before = answered(beamInWorld(BEAM.clone(), turntable().matrixWorld.clone()));
    const after = beamInWorld(BEAM.clone(), turntable(new Vector3(2, 0.3, -1.5).add(SLIDE)).matrixWorld.clone());
    expectVector(after, before, 'beam after the slide');
  });

  it('has length 1', () => {
    const beam = answered(beamInWorld(BEAM.clone(), turntable().matrixWorld.clone()));
    expectNumber(beam.length(), 1);
  });

  it("doesn't change the beam", () => {
    const beam = BEAM.clone();
    answered(beamInWorld(beam, turntable().matrixWorld.clone()));
    expectUnchanged(beam, BEAM, 'beam');
  });
});
