import type { MaskExercise } from '@harness/exercise';
import { slider } from '@harness/lesson';
import type { TslSceneSetup } from '@harness/tsl';
import { compareMasks } from '../shared';
import { length, max, oneMinus, smoothstep, uniform, uv, vec2 } from 'three/tsl';
import type * as Drill from './drill';

export const preview: TslSceneSetup = (harness) => {
  const gap = uniform(0.12);
  const p = uv().sub(0.5);
  const a = length(p).sub(0.32);
  const b = length(p.sub(vec2(gap, 0))).sub(0.14);
  compareMasks(harness, oneMinus(smoothstep(0, 0.02, a)), oneMinus(smoothstep(0, 0.02, max(a, b.negate()))), 'Left: one circle. Right: subtract the smaller circle to make a hole.');
  slider(harness.container, 'hole offset', { min: -0.15, max: 0.2, step: 0.01, value: 0.12 }, (value) => (gap.value = value));
};

export const exercise: MaskExercise<typeof Drill> = {
  fn: 'cutoutMask',
  params: [{ name: 'gap', min: -0.15, max: 0.2, step: 0.01, value: 0.12 }, { name: 'softness', min: 0.01, max: 0.08, step: 0.005, value: 0.02 }],
  checks: [{ gap: 0.12, softness: 0.02 }, { gap: -0.1, softness: 0.05 }, { gap: 0.2, softness: 0.01 }],
  draw: (drill, inputs) => drill.cutoutMask(inputs.uv, inputs.params.gap, inputs.params.softness),
};
