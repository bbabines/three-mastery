import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { instanceHardware } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, onFrame, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const frameSamples: number[] = [];
  const geometry=new THREE.BoxGeometry(0.2,0.2,0.2), material=new THREE.MeshStandardMaterial({color: COLORS.blue}); const placements=[-1,0,1].map(x=>new THREE.Matrix4().makeTranslation(x,1,0)); let displayed: THREE.InstancedMesh | null=null;
  onFrame((delta, elapsed) => {
    marker.position.x = Math.sin(elapsed * 0.8);
    if (delta > 0 && delta < 0.2) { frameSamples.push(delta * 1000); if (frameSamples.length > 60) frameSamples.shift(); }
    const result=attempt('instanceHardware',()=>displayed ?? instanceHardware(geometry,material,placements)); if(result.ok && !displayed){scene.add(result.value);displayed=result.value;}
    readout.textContent = (result.ok ? `instances in one draw: ${result.value.count}` : result.note) + `\nframe: ${frameSamples.length ? (frameSamples.reduce((a,b)=>a+b,0)/frameSamples.length).toFixed(2) : '—'} ms; draws: ${renderer.info.render.calls}`;
  });
};
