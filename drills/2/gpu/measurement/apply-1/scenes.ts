import { attempt, COLORS, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { frameSaving } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, onFrame, renderer }) => {
  camera.position.set(0, 0, 6);
  controls.target.set(0, 0, 0);
  for (let i = 0; i < 8; i++) {
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(5, 5),
      new THREE.MeshBasicMaterial({ color: i % 2 ? COLORS.blue : COLORS.yellow, transparent: true, opacity: 0.12, depthWrite: false }),
    );
    plane.position.z = i * 0.04;
    scene.add(plane);
  }

  const bar = overlay(container, 'controls');
  const readout = overlay(container, 'readout');
  const samples = new Map<number, number[]>([[1, []], [2, []]]);
  let dpr = 2;
  renderer.setPixelRatio(dpr);
  slider(bar, 'DPR', { min: 1, max: 2, step: 1, value: dpr }, (value) => {
    dpr = value;
    renderer.setPixelRatio(dpr);
  });

  const average = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;
  onFrame((delta) => {
    // The frame callback precedes the harness render, so renderer.info is from the previous frame.
    if (delta > 0 && delta < 0.2) {
      const values = samples.get(dpr)!;
      values.push(delta * 1000);
      if (values.length > 60) values.shift();
    }
    const current = samples.get(dpr)!;
    const baseline = samples.get(2)!;
    const changed = samples.get(1)!;
    const comparison = baseline.length >= 30 && changed.length >= 30
      ? attempt('frameSaving', () => frameSaving(average(baseline), average(changed)))
      : null;
    const readiness = comparison ? null : attempt('frameSaving', () => frameSaving(0, 0));
    readout.textContent = [
      `DPR ${dpr}: ${current.length ? average(current).toFixed(2) : '—'} ms/frame (${current.length} samples)`,
      `draw calls: ${renderer.info.render.calls}`,
      comparison ? (comparison.ok ? `1× saved ${comparison.value.ms.toFixed(2)} ms (${comparison.value.percent.toFixed(0)}%)` : comparison.note) : readiness?.ok ? 'Sample 2×, then 1×, for a comparison.' : readiness?.note,
    ].join('\n');
  });
};
