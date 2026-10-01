import type { MaskExercise } from '@harness/exercise';
import { slider } from '@harness/lesson';
import type { TslSceneSetup } from '@harness/tsl';
import { compareMasks } from '../shared';
import { length, mx_noise_float, oneMinus, smoothstep, uniform, uv, vec2 } from 'three/tsl';
import type * as Drill from './drill';

export const preview: TslSceneSetup = (harness) => {
  const amount = uniform(0.08);
  const p = uv().sub(0.5);
  const n = vec2(mx_noise_float(uv().mul(4)), mx_noise_float(uv().mul(4).add(vec2(17, 31))));
  const circle = oneMinus(smoothstep(0, 0.03, length(p).sub(0.28)));
  const warped = oneMinus(smoothstep(0, 0.03, length(p.add(n.mul(amount))).sub(0.28)));
  compareMasks(harness, circle, warped, 'Left: a circle. Right: the same circle sampled at noise-shifted coordinates.');
  slider(harness.container, 'warp', { min: 0, max: 0.2, step: 0.01, value: 0.08 }, (value) => (amount.value = value));
};

export const exercise: MaskExercise<typeof Drill> = {
  fn: 'warpedCircle',
  params: [{ name: 'amount', min: 0, max: 0.2, step: 0.01, value: 0.08 }],
  checks: [{ amount: 0.03 }, { amount: 0.1 }, { amount: 0.18 }],
  draw: (drill, inputs) => drill.warpedCircle(inputs.uv, inputs.params.amount),
};
