import type { MaskExercise } from '@harness/exercise';
import type { TslSceneSetup } from '@harness/tsl';
import { compareMasks } from '../shared';
import { abs, fract, oneMinus, smoothstep, uniform, uv } from 'three/tsl';
import type { Node } from 'three/webgpu';
import type * as Drill from './drill';

export const preview: TslSceneSetup = (harness) => {
  const elapsed = uniform(0);
  const stripe = (phase: Node<'float'>) => oneMinus(smoothstep(0.2, 0.3, abs(phase.sub(0.5))));
  const staticBands = stripe(fract(uv().x.mul(4)));
  const movingBands = stripe(fract(uv().x.mul(4).add(fract(elapsed.mul(0.15)))));
  compareMasks(harness, staticBands, movingBands, 'Left: fixed UV bands. Right: wrapped time shifts the phase without changing the mesh.');
  harness.onFrame((_delta, time) => { elapsed.value = time; });
};

export const exercise: MaskExercise<typeof Drill> = {
  fn: 'flowBands',
  params: [{ name: 'speed', min: 0.05, max: 0.4, step: 0.01, value: 0.15 }],
  checks: [{ speed: 0.08 }, { speed: 0.15 }, { speed: 0.36 }],
  time: 3.5,
  draw: (drill, inputs) => drill.flowBands(inputs.uv, inputs.time, inputs.params.speed),
};
