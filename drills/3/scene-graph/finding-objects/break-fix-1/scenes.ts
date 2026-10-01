import { ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { findSku } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3,3,5); controls.target.set(0,0.5,0);
  const subject = new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial({color:COLORS.blue}));
  const marker = ball(COLORS.yellow); subject.position.y=0.5; marker.position.x=1.5; marker.position.y=0.5; scene.add(subject,marker);
  const readout=overlay(container,'readout');
  subject.name="Imported_1"; subject.userData.sku="A-1";
  try {
    const found=findSku(scene,"A-1");
    readout.textContent=`found SKU A-1: ${found===subject}\nreference: true`;
  } catch(error) { readout.textContent=`findSku threw: ${String(error)}`; }
};
