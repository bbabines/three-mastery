import { Spherical } from 'three';
import { describe, expect, it } from 'vitest';
import { orbitTurn } from './drill';

const wrap = (angle: number) => Math.atan2(Math.sin(angle), Math.cos(angle));

describe('orbitTurn', () => {
  it('keeps the sign of left and right turns', () => {
    const start = new Spherical(3, Math.PI / 2, 0);
    for (const theta of [-0.8, -0.25, 0.25, 0.8]) {
      expect(orbitTurn(start, new Spherical(3, Math.PI / 2, theta))).toBeCloseTo(wrap(theta));
    }
  });

  it('takes the short turn across the -π/π boundary', () => {
    const from = new Spherical(3, Math.PI / 2, Math.PI - 0.2);
    const to = new Spherical(3, Math.PI / 2, -Math.PI + 0.15);
    expect(orbitTurn(from, to)).toBeCloseTo(wrap(to.theta - from.theta));
    expect(orbitTurn(to, from)).toBeCloseTo(wrap(from.theta - to.theta));
  });

  it('does not let radius or polar angle change the azimuth turn', () => {
    const from = new Spherical(2, 0.7, -0.4);
    const to = new Spherical(7, 2, -1.1);
    expect(orbitTurn(from, to)).toBeCloseTo(wrap(to.theta - from.theta));
  });

  it('does not change the input spherical values', () => {
    const from = new Spherical(2, 0.7, -0.4);
    const to = new Spherical(7, 2, -1.1);
    const saved = [from.clone(), to.clone()];
    orbitTurn(from, to);
    expect([from.radius, from.phi, from.theta, to.radius, to.phi, to.theta]).toEqual([
      saved[0].radius, saved[0].phi, saved[0].theta, saved[1].radius, saved[1].phi, saved[1].theta,
    ]);
  });
});
