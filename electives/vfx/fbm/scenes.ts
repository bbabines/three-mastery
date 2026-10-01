import type { MaskExercise } from '@harness/exercise';
import { slider } from '@harness/lesson';
import type { TslSceneSetup } from '@harness/tsl';
import { compareMasks } from '../shared';
import { mx_noise_float, uniform, uv } from 'three/tsl';
import type * as Drill from './drill';

export const preview: TslSceneSetup = (harness) => {
  const scale = uniform(4);
  const p = uv().mul(scale);
  const coarse = mx_noise_float(p);
  const layered = coarse.add(mx_noise_float(p.mul(2)).mul(0.5)).add(mx_noise_float(p.mul(4)).mul(0.25)).div(1.75);
  compareMasks(harness, coarse.mul(0.5).add(0.5), layered.mul(0.5).add(0.5), 'Left: one broad octave. Right: three octaves, with smaller detail and falling weights.');
  slider(harness.container, 'scale', { min: 2, max: 9, step: 0.5, value: 4 }, (value) => (scale.value = value));
};

export const exercise: MaskExercise<typeof Drill> = {
  fn: 'layeredMask',
  params: [{ name: 'scale', min: 2, max: 9, step: 0.5, value: 4 }, { name: 'cutoff', min: 0.3, max: 0.7, step: 0.02, value: 0.5 }],
  checks: [{ scale: 4, cutoff: 0.5 }, { scale: 2.5, cutoff: 0.45 }, { scale: 7, cutoff: 0.58 }],
  draw: (drill, inputs) => drill.layeredMask(inputs.uv, inputs.params.scale, inputs.params.cutoff),
};
