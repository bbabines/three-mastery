import { attempt, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { measureBars } from '../../measure-bars';
import { depthWork } from './drill';

export const demo: SceneSetup = (harness) => {
  const result = attempt('depthWork', () => depthWork(500, 900, 125));
  if (!result.ok) {
    const readout = overlay(harness.container, 'readout');
    readout.textContent = result.note;
    return;
  }
  measureBars(harness, 'alpha cutout still shades after opaque early rejection', [
      { name: 'candidates', yours: Number(result.value.fragmentCandidates), expected: 1525 },
      { name: 'early reject', yours: Number(result.value.earlyRejected), expected: 900 },
      { name: 'late shade', yours: Number(result.value.lateShaded), expected: 625 },
  ]);
};
