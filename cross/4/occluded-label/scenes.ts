import { BoxGeometry, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import { attempt, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { labelState } from './drill';

export const labels: SceneSetup = ({ scene, camera, container, onFrame }) => {
  const blocker = new Mesh(new BoxGeometry(1,1,1),new MeshBasicMaterial({color:0x445577}));
  scene.add(blocker);
  const readout = overlay(container,'readout');
  onFrame((_,elapsed) => {
    blocker.position.x = Math.sin(elapsed);
    const result = attempt('label', () => labelState(new Vector3(0,0,0),camera,container.clientWidth,container.clientHeight,24,[blocker]));
    readout.textContent = result.ok ? `Label: ${result.value.visible ? 'visible' : 'hidden'}\nWorld height for 24 px: ${result.value.worldHeight.toFixed(2)}` : result.note;
  });
};
