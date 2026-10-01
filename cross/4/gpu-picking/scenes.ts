import { Color, LinearSRGBColorSpace, Mesh, MeshBasicMaterial, NoColorSpace, PlaneGeometry, Raycaster, Scene, Vector2, WebGLRenderTarget } from 'three';
import { overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { readPickId } from './drill';

export const compare: SceneSetup = ({ camera, renderer, container }) => {
  const idColor = new Color().setRGB(19 / 255, 31 / 255, 47 / 255, LinearSRGBColorSpace);
  const dense = new Mesh(new PlaneGeometry(10, 10, 708, 708), new MeshBasicMaterial({ color: idColor, toneMapped: false }));
  dense.rotation.x = -Math.PI / 2;
  const pickScene = new Scene();
  pickScene.add(dense);
  const target = new WebGLRenderTarget(32, 32);
  target.texture.colorSpace = NoColorSpace;
  const readout = overlay(container, 'readout');
  readout.textContent = 'About 1,002,528 triangles. Compare one center pick.';
  const controls = overlay(container, 'controls');
  const button = document.createElement('button');
  button.textContent = 'Compare picks';
  controls.append(button);
  button.addEventListener('click', async () => {
    dense.updateMatrixWorld();
    camera.updateMatrixWorld();
    const ray = new Raycaster();
    ray.setFromCamera(new Vector2(0, 0), camera);
    const startCpu = performance.now();
    const hits = ray.intersectObject(dense, false).length;
    const cpu = performance.now() - startCpu;
    const previousTarget = renderer.getRenderTarget();
    const startPass = performance.now();
    try {
      renderer.setRenderTarget(target);
      renderer.render(pickScene, camera);
    } finally {
      renderer.setRenderTarget(previousTarget);
    }
    const passSubmit = performance.now() - startPass;
    const startGpu = performance.now();
    const id = await readPickId(renderer, target, 16, 16);
    readout.textContent = `CPU raycast: ${cpu.toFixed(1)} ms, ${hits} hit(s)\nID pass submission: ${passSubmit.toFixed(1)} ms\nAsync pixel wait: ${(performance.now()-startGpu).toFixed(1)} ms\nID: ${id ?? 'not answered yet'}`;
  });
};
