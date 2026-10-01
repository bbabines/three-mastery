import { DoubleSide, Mesh, MeshBasicMaterial, Object3D, PlaneGeometry, Quaternion, Vector3 } from 'three';
import { attempt, arrow, COLORS, outline, overlay, setArrow } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { markerNormal } from './drill';

export const marker: SceneSetup = ({ scene, container, onFrame }) => {
  const parent = new Object3D();
  parent.scale.set(2.3, 1, 0.5);
  parent.rotation.y = 0.5;
  parent.position.y = 1.5;
  const localNormal = new Vector3(1, 1, 1).normalize();
  const geometry = new PlaneGeometry(2, 2);
  geometry.applyQuaternion(new Quaternion().setFromUnitVectors(new Vector3(0, 0, 1), localNormal));
  const mesh = new Mesh(geometry, new MeshBasicMaterial({ color: 0x3b82f6, side: DoubleSide, transparent: true, opacity: 0.55 }));
  mesh.add(outline(geometry, COLORS.blue));
  mesh.rotation.z = 0.4;
  parent.add(mesh);
  scene.add(parent);
  const normalArrow = arrow(COLORS.green);
  normalArrow.visible = false;
  scene.add(normalArrow);
  const readout = overlay(container, 'readout');
  onFrame(() => {
    const result = attempt('world normal', () => markerNormal(localNormal.clone(), mesh));
    if (result.ok) setArrow(normalArrow, mesh.getWorldPosition(new Vector3()), result.value);
    else normalArrow.visible = false;
    readout.textContent = result.ok ? 'Blue: stretched face. Green: world-space surface normal.' : `Blue: stretched face. ${result.note}`;
  });
};
