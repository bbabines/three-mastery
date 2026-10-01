import type { MaskExercise } from '@harness/exercise';
import { slider } from '@harness/lesson';
import type { TslSceneSetup } from '@harness/tsl';
import { compareMasks } from '../shared';
import { mx_worley_noise_float_2d, oneMinus, smoothstep, uniform, uv } from 'three/tsl';
import type * as Drill from './drill';

export const preview: TslSceneSetup = (harness) => {
  const cells = uniform(6);
  const distance = mx_worley_noise_float_2d(uv().mul(cells));
  compareMasks(harness, distance, oneMinus(smoothstep(0.25, 0.35, distance)), 'Left: distance to the nearest feature point. Right: close regions kept as a mask.');
  slider(harness.container, 'cells', { min: 2, max: 12, step: 1, value: 6 }, (value) => (cells.value = value));
};

export const exercise: MaskExercise<typeof Drill> = {
  fn: 'cellMask',
  params: [{ name: 'cells', min: 2, max: 12, step: 1, value: 6 }, { name: 'edge', min: 0.2, max: 0.55, step: 0.01, value: 0.3 }],
  checks: [{ cells: 6, edge: 0.3 }, { cells: 3, edge: 0.22 }, { cells: 9, edge: 0.45 }],
  draw: (drill, inputs) => drill.cellMask(inputs.uv, inputs.params.cells, inputs.params.edge),
};
