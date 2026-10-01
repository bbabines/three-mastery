import { BoxGeometry, Matrix4, Mesh, MeshBasicMaterial } from 'three';
import { attempt, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { bakeMirror } from './drill';

export const mirror: SceneSetup = ({ scene, container }) => {
  const source = new BoxGeometry(1,1,1);
  const result = attempt('baked variant', () => bakeMirror(source,new Matrix4().makeScale(-1,1,1)));
  if(result.ok) { const mesh = new Mesh(result.value,new MeshBasicMaterial({color:0x22c55e})); mesh.position.y=1; scene.add(mesh); }
  const readout = overlay(container,'readout');
  readout.textContent = result.ok ? 'Green: mirrored variant with outward faces' : result.note;
};
