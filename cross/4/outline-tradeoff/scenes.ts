import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three';
import { attempt, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { outlineWork } from './drill';

export const outline: SceneSetup = ({ scene, container }) => {
  let selected = 5, dpr = 1;
  const samples = Array.from({ length: 12 }, (_, index) => {
    const mesh = new Mesh(new BoxGeometry(0.55, 0.55, 0.55), new MeshBasicMaterial({ color: 0x3b82f6, wireframe: true }));
    mesh.position.set((index % 4 - 1.5) * 1.1, 0.7 + Math.floor(index / 4) * 0.7, 0);
    scene.add(mesh);
    return mesh;
  });
  const readout = overlay(container,'readout');
  const controls = overlay(container,'controls');
  slider(controls,'selected draws',{min:1,max:100,step:1,value:selected},v => {selected=v; update();});
  slider(controls,'DPR',{min:1,max:3,step:0.5,value:dpr},v => {dpr=v; update();});
  function update() {
    samples.forEach((mesh, index) => { mesh.visible = index < selected; });
    const result = attempt('outline work', () => outlineWork(selected,container.clientWidth,container.clientHeight,dpr));
    const sampleNote = `Showing ${Math.min(selected, samples.length)} of ${selected} selected draws.`;
    readout.textContent = result.ok ? `${sampleNote}\nStencil: ${result.value.stencilCalls} extra calls\nPost: ${result.value.postCalls} extra calls\nPost: ${result.value.postPixels.toFixed(0)} pixels` : `${sampleNote} ${result.note}`;
  }
  update();
};
