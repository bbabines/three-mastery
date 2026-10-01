import type { MaskExercise } from '@harness/exercise';
import { slider } from '@harness/lesson';
import type { TslSceneSetup } from '@harness/tsl';
import { compareMasks } from '../shared';
import { mx_noise_float, smoothstep, uniform, uv } from 'three/tsl';
import type * as Drill from './drill';

export const preview: TslSceneSetup = (harness) => {
  const scale = uniform(5);
  const noise = mx_noise_float(uv().mul(scale)).mul(0.5).add(0.5);
  compareMasks(harness, noise, smoothstep(0.42, 0.58, noise), 'Left: smooth noise. Right: the same fixed field turned into a cloud mask.');
  slider(harness.container, 'scale', { min: 2, max: 12, step: 0.5, value: 5 }, (value) => (scale.value = value));
};

export const exercise: MaskExercise<typeof Drill> = {
  fn: 'cloudMask',
  params: [{ name: 'scale', min: 2, max: 12, step: 0.5, value: 5 }, { name: 'cutoff', min: 0.3, max: 0.7, step: 0.02, value: 0.5 }],
  checks: [{ scale: 5, cutoff: 0.5 }, { scale: 2.5, cutoff: 0.42 }, { scale: 9, cutoff: 0.6 }],
  draw: (drill, inputs) => drill.cloudMask(inputs.uv, inputs.params.scale, inputs.params.cutoff),
};
