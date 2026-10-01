import { attempt, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { measureBars } from '../../measure-bars';
import { frameWork } from './drill';

export const demo: SceneSetup = (harness) => {
  const result = attempt('frameWork', () => frameWork(80, 700, 450, 3));
  if (!result.ok) {
    const readout = overlay(harness.container, 'readout');
    readout.textContent = result.note;
    return;
  }
  measureBars(harness, 'three passes over layered fragments', [
      { name: 'vertex runs', yours: Number(result.value.vertexRuns), expected: 240 },
      { name: 'fragment runs', yours: Number(result.value.fragmentRuns), expected: 2100 },
      { name: 'visible writes', yours: Number(result.value.pixelsWritten), expected: 750 },
  ]);
};
