import { BoxGeometry, DataTexture, Mesh, MeshStandardMaterial, Texture } from 'three';
import { attempt, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { swapFinish } from './drill';

export const swaps: SceneSetup = ({ scene, camera, renderer, container }) => {
  const texture = (green: boolean) => {
    const map = new DataTexture(new Uint8Array(green ? [40,190,90,255] : [50,100,230,255]),1,1);
    map.needsUpdate = true;
    return map;
  };
  const firstMap = texture(true);
  const mesh = new Mesh(new BoxGeometry(1,1,1),new MeshStandardMaterial({map:firstMap}));
  mesh.position.y=1;
  scene.add(mesh);
  const ownedMaterials = new Set<MeshStandardMaterial>([mesh.material]);
  const ownedTextures = new Set<Texture>([firstMap]);
  let disposed = 0;
  firstMap.addEventListener('dispose', () => disposed++);
  const readout = overlay(container,'readout');
  readout.textContent = 'Render once, then swap 20 finishes.';
  const controls = overlay(container,'controls');
  const button = document.createElement('button');
  button.textContent='Swap 20';
  controls.append(button);
  button.addEventListener('click', () => {
    renderer.render(scene,camera); // upload the starting map before measuring
    const before=renderer.info.memory.textures;
    for(let i=0;i<20;i++) {
      const map = texture(i%2===0);
      map.addEventListener('dispose', () => disposed++);
      ownedTextures.add(map);
      const next = new MeshStandardMaterial({map});
      ownedMaterials.add(next);
      const result=attempt('swap',() => swapFinish(mesh,next,ownedMaterials,ownedTextures));
      if(!result.ok) {readout.textContent=result.note;return;}
      renderer.render(scene,camera);
    }
    readout.textContent=`Texture count before: ${before}\nAfter 20 swaps: ${renderer.info.memory.textures}\nOld maps disposed: ${disposed} (one active map remains)`;
  });
};
