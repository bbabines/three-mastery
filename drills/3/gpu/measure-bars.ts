import { COLORS, overlay } from '@harness/lesson';
import type { Harness } from '@harness/scene';
import * as THREE from 'three';
import { frameMeter } from './frame-meter';

// Blue bars come from the learner's function; yellow outlines are the expected work.
export function measureBars(
  harness: Harness,
  title: string,
  values: { name: string; yours: number; expected: number }[],
): void {
  const { scene, camera, controls, container } = harness;
  camera.position.set(4, 3, 7);
  controls.target.set(0, 1, 0);
  const max = Math.max(1, ...values.flatMap(({ yours, expected }) => [yours, expected]));
  const height = (n: number) => Math.max(0.03, n / max * 2.6);
  values.forEach((value, index) => {
    const x = (index - (values.length - 1) / 2) * 1.6;
    const barHeight = height(value.yours);
    const guideHeight = height(value.expected);
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.55, barHeight, 0.55), new THREE.MeshStandardMaterial({ color: COLORS.blue }));
    const guide = new THREE.Mesh(new THREE.BoxGeometry(0.68, guideHeight, 0.68), new THREE.MeshBasicMaterial({ color: COLORS.yellow, wireframe: true }));
    bar.position.set(x, barHeight / 2, 0);
    guide.position.set(x, guideHeight / 2, 0);
    scene.add(bar, guide);
  });
  const readout = overlay(container, 'readout');
  readout.textContent = `${title}\nblue: your count; yellow outline: expected\n${values.map(({ name, yours, expected }) => `${name}: ${yours} / ${expected}`).join(' · ')}`;
  frameMeter(harness, readout);
}
