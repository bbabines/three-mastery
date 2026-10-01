import { attempt, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { measureSubmission } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  camera.position.set(9, 8, 13);
  controls.target.set(0, 0, 0);
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  const low = new THREE.SphereGeometry(0.3, 8, 6);
  const high = new THREE.SphereGeometry(0.3, 32, 24);
  const basic = new THREE.MeshBasicMaterial({ color: 0x3b82f6 });
  const shaded = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.35 });
  const singles: THREE.Mesh[] = [];
  const instanced: THREE.InstancedMesh<THREE.BufferGeometry, THREE.Material> = new THREE.InstancedMesh(low, basic, 144);
  const matrix = new THREE.Matrix4();
  for (let i = 0; i < 144; i++) {
    const x = (i % 12 - 5.5) * 0.7;
    const z = (Math.floor(i / 12) - 5.5) * 0.7;
    const mesh = new THREE.Mesh(low, basic);
    mesh.position.set(x, 0.35, z);
    scene.add(mesh);
    singles.push(mesh);
    instanced.setMatrixAt(i, matrix.makeTranslation(x, 0.35, z));
  }
  instanced.visible = false;
  scene.add(instanced);

  let useInstances = false;
  let expensiveMaterial = false;
  let highVertices = false;
  let highDpr = false;
  let skipRender = false;
  const originalRender = renderer.render.bind(renderer);
  renderer.render = ((s: THREE.Scene, c: THREE.Camera) => {
    if (!skipRender) originalRender(s, c);
  }) as typeof renderer.render;

  const button = (label: string, action: () => void) => {
    const node = document.createElement('button');
    node.textContent = label;
    node.addEventListener('click', action);
    bar.append(node);
  };
  button('Resolution: 1× / 2×', () => {
    highDpr = !highDpr;
    renderer.setPixelRatio(highDpr ? 2 : 1);
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
  button('Material: basic / shaded', () => {
    expensiveMaterial = !expensiveMaterial;
    const material = expensiveMaterial ? shaded : basic;
    singles.forEach((mesh) => { mesh.material = material; });
    instanced.material = material;
  });
  button('Draws: 144 / 1', () => {
    useInstances = !useInstances;
    singles.forEach((mesh) => { mesh.visible = !useInstances; });
    instanced.visible = useInstances;
  });
  button('Vertices: low / high', () => {
    highVertices = !highVertices;
    const geometry = highVertices ? high : low;
    singles.forEach((mesh) => { mesh.geometry = geometry; });
    instanced.geometry = geometry;
  });
  button('Skip render: off / on', () => { skipRender = !skipRender; });

  const result = attempt('measureSubmission', () => {
    let tick = 0;
    return measureSubmission(
      { render: () => {}, info: { render: { calls: 144 } } },
      new THREE.Scene(), new THREE.Camera(), () => [10, 14][tick++],
    );
  });
  let previous = performance.now();
  let elapsed = 0;
  let frames = 0;
  onFrame(() => {
    const now = performance.now();
    elapsed += now - previous;
    previous = now;
    if (++frames < 30) return;
    const measured = result.ok ? JSON.stringify(result.value) : result.note;
    readout.textContent = `your timing label: ${measured}\nreference: {"cpuMs":4,"gpuMs":null,"drawCalls":144}\nframe interval: ${(elapsed / frames).toFixed(1)} ms\ndraw calls: ${skipRender ? 'skipped' : renderer.info.render.calls}\ntriangles: ${skipRender ? 'skipped' : renderer.info.render.triangles}`;
    elapsed = 0;
    frames = 0;
  });
};
