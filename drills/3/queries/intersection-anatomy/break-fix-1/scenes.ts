import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { hitNormalWorld } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3,3,5); controls.target.set(0,0.5,0);
  const subject = new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial({color:COLORS.blue}));
  const marker = ball(COLORS.yellow); subject.position.y=0.5; marker.position.x=1.5; marker.position.y=0.5; scene.add(subject,marker);
  const readout=overlay(container,'readout');
  subject.scale.set(3,1,0.5);
  const got=attempt('hitNormalWorld',()=>hitNormalWorld({object:subject,face:{normal:new THREE.Vector3(1,1,1).normalize()}}));
  subject.updateWorldMatrix(true,false);
  const want=new THREE.Vector3(1,1,1).normalize().applyMatrix3(new THREE.Matrix3().getNormalMatrix(subject.matrixWorld)).normalize();
  readout.textContent=got.ok?`your result: ${JSON.stringify(got.value)?.slice(0,100)}\nreference: ${JSON.stringify(want)?.slice(0,100)}`:got.note;
};
