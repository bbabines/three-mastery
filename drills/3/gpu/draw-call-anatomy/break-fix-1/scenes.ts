import { attempt, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { measureBars } from '../../measure-bars';
import { drawSubmissions } from './drill';

export const demo: SceneSetup = (harness) => {
  const result = attempt('drawSubmissions', () => drawSubmissions([{ groups: 3, visible: true }, { groups: 1, visible: true }, { groups: 5, visible: false }], 2));
  if (!result.ok) {
    const readout = overlay(harness.container, 'readout');
    readout.textContent = result.note;
    return;
  }
  measureBars(harness, 'four visible material groups across main and two shadow passes', [
      { name: 'submissions', yours: Number(result.value), expected: 12 },
  ]);
};
