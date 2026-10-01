import { attempt, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { outlineWork } from './drill';

export const outline: SceneSetup = ({ container }) => {
  let selected = 5, dpr = 1;
  const readout = overlay(container,'readout');
  const controls = overlay(container,'controls');
  slider(controls,'selected draws',{min:1,max:100,step:1,value:selected},v => {selected=v; update();});
  slider(controls,'DPR',{min:1,max:3,step:0.5,value:dpr},v => {dpr=v; update();});
  function update() {
    const result = attempt('outline work', () => outlineWork(selected,container.clientWidth,container.clientHeight,dpr));
    readout.textContent = result.ok ? `Stencil: ${result.value.stencilCalls} extra calls\nPost: ${result.value.postCalls} extra calls\nPost: ${result.value.postPixels.toFixed(0)} pixels` : result.note;
  }
  update();
};
