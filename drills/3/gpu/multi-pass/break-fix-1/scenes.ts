import { attempt, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { measureBars } from '../../measure-bars';
import { passCost } from './drill';

export const demo: SceneSetup = (harness) => {
  const result = attempt('passCost', () => passCost(320, 180, 3));
  if (!result.ok) {
    const readout = overlay(harness.container, 'readout');
    readout.textContent = result.note;
    return;
  }
  measureBars(harness, 'three full-screen effect passes plus output conversion', [
      { name: 'fragment candidates', yours: Number(result.value.fullScreenFragments), expected: 172800 },
      { name: 'output required', yours: Number(result.value.needsOutputPass), expected: 1 },
  ]);
};
