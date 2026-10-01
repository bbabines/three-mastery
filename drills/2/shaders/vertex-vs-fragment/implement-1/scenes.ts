import { attempt, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { uvGradient } from './drill';
export const preview: SceneSetup = ({scene,camera,controls,container}) => {
 camera.position.set(0,1.2,3); controls.target.set(0,.4,0);
 const fallback = new THREE.MeshBasicMaterial({ color: '#666666' });
 const plane = new THREE.Mesh<THREE.PlaneGeometry, THREE.Material>(new THREE.PlaneGeometry(1.5,1.5), fallback); plane.position.y=.6; scene.add(plane);
 const result = attempt('uvGradient', () => uvGradient());
 const readout = overlay(container,'readout');
 if (result.ok) { plane.material = result.value; readout.textContent='shader returned\nwatch the plane for the effect'; }
 else readout.textContent=result.note;
};
