import { attempt, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { measureBars } from '../../measure-bars';
import { headroomMs } from './drill';

export const demo: SceneSetup = (harness) => {
  const result = attempt('headroomMs', () => headroomMs(9, 11, 60));
  if (!result.ok) {
    const readout = overlay(harness.container, 'readout');
    readout.textContent = result.note;
    return;
  }
  measureBars(harness, 'CPU and GPU overlap; the 11 ms side sets frame time', [
      { name: 'headroom ms', yours: Number(result.value), expected: 1000 / 60 - 11 },
  ]);
};
