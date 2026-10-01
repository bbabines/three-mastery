import { attempt, COLORS, overlay } from '@harness/lesson';
import { frameMeter } from '../../frame-meter';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { maskedTarget } from './drill';

export const demo: SceneSetup = (harness) => {
  const { scene, camera, controls, container, renderer } = harness;
  camera.position.set(0, 1, 4);
  controls.target.set(0, 0.8, 0);
  const target = new THREE.WebGLRenderTarget(128, 128);
  const writer = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false });
  const result = attempt('maskedTarget', () => maskedTarget(target, writer, 4, 3));
  const pass = new THREE.Scene();
  pass.background = new THREE.Color(0x2c3440);
  const circle = new THREE.Mesh(new THREE.CircleGeometry(0.72, 48), writer);
  circle.position.z = 0.1;
  const fill = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.MeshBasicMaterial({
    color: COLORS.blue, stencilWrite: true, stencilFunc: THREE.EqualStencilFunc, stencilRef: 3,
  }));
  pass.add(circle, fill);
  const passCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  passCamera.position.z = 2;
  renderer.setRenderTarget(target);
  renderer.render(pass, passCamera);
  renderer.setRenderTarget(null);
  const preview = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.MeshBasicMaterial({ map: target.texture }));
  preview.position.y = 1;
  const expected = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(new THREE.Path().absarc(0, 0, 0.72, 0, Math.PI * 2, false).getPoints(48).map(p => new THREE.Vector3(p.x, p.y + 1, 0.01))),
    new THREE.LineBasicMaterial({ color: COLORS.yellow }),
  );
  scene.add(preview, expected);
  const readout = overlay(container, 'readout');
  readout.textContent = result.ok
    ? `blue mask should fill the yellow circle only\ntarget: ${target.samples} samples, stencil ${target.stencilBuffer}\nwriter ref ${writer.stencilRef}`
    : result.note;
  frameMeter(harness, readout);
};
