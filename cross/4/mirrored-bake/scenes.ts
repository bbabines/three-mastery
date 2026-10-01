import { BoxGeometry, Matrix4, Mesh, MeshBasicMaterial } from 'three';
import { attempt, label, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { bakeMirror } from './drill';

export const mirror: SceneSetup = ({ scene, container }) => {
  const source = new BoxGeometry(1,1,1);
  const original = new Mesh(source, new MeshBasicMaterial({ color: 0x3b82f6 }));
  original.position.set(-1.3, 1, 0);
  scene.add(original);
  const sourceLabel = label('source', '#e5e7eb');
  sourceLabel.position.set(-1.3, 2, 0);
  scene.add(sourceLabel);
  const result = attempt('baked variant', () => bakeMirror(source,new Matrix4().makeScale(-1,1,1)));
  if(result.ok) {
    const mesh = new Mesh(result.value,new MeshBasicMaterial({color:0x22c55e}));
    mesh.position.set(1.3,1,0);
    scene.add(mesh);
    const variantLabel = label('baked', '#e5e7eb');
    variantLabel.position.set(1.3, 2, 0);
    scene.add(variantLabel);
  }
  const readout = overlay(container,'readout');
  readout.textContent = result.ok ? 'Blue: source. Green: mirrored variant with outward faces.' : `Blue: source. ${result.note}`;
};
