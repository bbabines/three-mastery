import { BoxGeometry, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import { attempt, label, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { labelState } from './drill';

export const labels: SceneSetup = ({ scene, camera, container, onFrame }) => {
  const blocker = new Mesh(new BoxGeometry(1,1,1),new MeshBasicMaterial({color:0x445577}));
  scene.add(blocker);
  const point = new Vector3(0, 0, 0);
  const tag = label('part', '#e5e7eb');
  tag.position.copy(point);
  tag.visible = false;
  scene.add(tag);
  const aspect = tag.scale.x / tag.scale.y;
  const readout = overlay(container,'readout');
  onFrame((_,elapsed) => {
    blocker.position.x = Math.sin(elapsed);
    const result = attempt('label', () => labelState(point,camera,container.clientWidth,container.clientHeight,24,[blocker]));
    tag.visible = result.ok && result.value.visible;
    if (result.ok) tag.scale.set(aspect * result.value.worldHeight, result.value.worldHeight, 1);
    readout.textContent = result.ok ? `Label: ${result.value.visible ? 'visible' : 'hidden'}\nWorld height for 24 px: ${result.value.worldHeight.toFixed(2)}` : result.note;
  });
};
