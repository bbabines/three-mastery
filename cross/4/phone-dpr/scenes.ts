import { attempt, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { budgetedDpr } from './drill';

export const phone: SceneSetup = ({ renderer, container, onFrame }) => {
  const readout = overlay(container,'readout');
  const controls = overlay(container,'controls');
  let cap = 800000;
  slider(controls,'pixel cap',{min:200000,max:2000000,step:100000,value:cap},value => cap=value);
  onFrame((delta) => {
    const result = attempt('DPR', () => budgetedDpr(container.clientWidth,container.clientHeight,3,cap));
    if(result.ok && Math.abs(renderer.getPixelRatio()-result.value)>0.001) renderer.setPixelRatio(result.value);
    readout.textContent = result.ok ? `DPR: ${result.value.toFixed(2)}\nPhysical pixels: ${renderer.domElement.width*renderer.domElement.height}\nFrame: ${(delta*1000).toFixed(1)} ms` : result.note;
  });
};
