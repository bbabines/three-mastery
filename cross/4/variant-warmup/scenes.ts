import { BoxGeometry, DataTexture, Mesh, MeshStandardMaterial } from 'three';
import { attempt, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { warmVariants } from './drill';

export const warm: SceneSetup = ({ scene, camera, renderer, container }) => {
  const coldMap = new DataTexture(new Uint8Array([50,100,230,255]),1,1);
  const warmMap = new DataTexture(new Uint8Array([230,100,50,255]),1,1);
  coldMap.needsUpdate = true;
  warmMap.needsUpdate = true;
  const variants = [
    new MeshStandardMaterial({color:0x22c55e}),
    new MeshStandardMaterial({map:coldMap}),
    new MeshStandardMaterial({map:warmMap}),
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
    button.disabled = true;
    const coldStart = performance.now();
    mesh.material = variants[1];
    renderer.render(scene,camera);
    const coldMs = performance.now() - coldStart;
    mesh.material = variants[0];
    const result = attempt('warm-up', () => warmVariants(renderer,scene,camera,mesh,variants));
    if(!result.ok) { readout.textContent=result.note; return; }
    const times: number[] = [];
    for(let i=0;i<2;i++) { const start=performance.now(); mesh.material=variants[2]; renderer.render(scene,camera); times.push(performance.now()-start); mesh.material=variants[0]; }
    readout.textContent = `Cold first: ${coldMs.toFixed(2)} ms\nWarmed first: ${times[0].toFixed(2)} ms\nWarmed later: ${times[1].toFixed(2)} ms\nTextures: ${renderer.info.memory.textures}`;
  });
};
