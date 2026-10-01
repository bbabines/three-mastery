import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { enabledPhysicalFeatures, precompileScene } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, onFrame, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const frameSamples: number[] = [];
  const material=new THREE.MeshPhysicalMaterial({color: COLORS.blue}); const mesh=new THREE.Mesh(new THREE.BoxGeometry(),material); scene.add(mesh); const fakeRenderer={compileAsync:(_scene:THREE.Object3D,_camera:THREE.Camera)=>Promise.resolve(scene as THREE.Object3D)} as Pick<THREE.WebGLRenderer,"compileAsync">;
  onFrame((delta, elapsed) => {
    marker.position.x = Math.sin(elapsed * 0.8);
    if (delta > 0 && delta < 0.2) { frameSamples.push(delta * 1000); if (frameSamples.length > 60) frameSamples.shift(); }
    const features=attempt('enabledPhysicalFeatures',()=>enabledPhysicalFeatures(material)); const warm=attempt('precompileScene',()=>precompileScene(fakeRenderer,scene,camera));
    readout.textContent = ([features.ok ? `optional features: ${features.value}` : features.note, warm.ok ? 'shader warm-up queued' : warm.note].join('\n')) + `\nframe: ${frameSamples.length ? (frameSamples.reduce((a,b)=>a+b,0)/frameSamples.length).toFixed(2) : '—'} ms; draws: ${renderer.info.render.calls}`;
  });
};
