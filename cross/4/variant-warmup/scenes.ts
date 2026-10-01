import { BoxGeometry, DataTexture, Mesh, MeshStandardMaterial } from 'three';
import { attempt, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { warmVariants } from './drill';

export const warm: SceneSetup = ({ scene, camera, renderer, container }) => {
  const map = new DataTexture(new Uint8Array([50,100,230,255]),1,1);
  map.needsUpdate = true;
  const variants = [
    new MeshStandardMaterial({color:0x22c55e}),
    new MeshStandardMaterial({map}),
    new MeshStandardMaterial({color:0xf97316,transparent:true,opacity:0.8}),
  ];
  const mesh = new Mesh(new BoxGeometry(1,1,1),variants[0]);
  mesh.position.y = 1;
  scene.add(mesh);
  const readout = overlay(container,'readout');
  readout.textContent = 'Warm the variants, then compare switches.';
  const controls = overlay(container,'controls');
  const button = document.createElement('button');
  button.textContent = 'Warm and switch';
  controls.append(button);
  button.addEventListener('click', () => {
    const result = attempt('warm-up', () => warmVariants(renderer,scene,camera,mesh,variants));
    if(!result.ok) { readout.textContent=result.note; return; }
    const times: number[] = [];
    for(let i=0;i<2;i++) { const start=performance.now(); mesh.material=variants[1]; renderer.render(scene,camera); times.push(performance.now()-start); mesh.material=variants[0]; }
    readout.textContent = `First: ${times[0].toFixed(2)} ms\nLater: ${times[1].toFixed(2)} ms\nTextures: ${renderer.info.memory.textures}`;
  });
};
