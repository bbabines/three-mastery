import { attempt, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { renderCallCount } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, renderer }) => {
  camera.position.set(3, 3, 6);
  controls.target.set(0, 0.5, 0);
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  const testScene = new THREE.Scene();
  const geometry = new THREE.BoxGeometry(0.45, 0.45, 0.45);
  const material = new THREE.MeshBasicMaterial({ color: COLORS.blue });
  const build = (target: THREE.Scene) => {
    const separate = new THREE.Group();
    const instanced = new THREE.InstancedMesh(geometry, material, 6);
    const transform = new THREE.Matrix4();
    for (let i = 0; i < 6; i++) {
      const x = (i - 2.5) * 0.62;
      const part = new THREE.Mesh(geometry, material);
      part.position.set(x, 0.7, 0);
      separate.add(part);
      instanced.setMatrixAt(i, transform.makeTranslation(x, 0.7, 0));
    }
    instanced.instanceMatrix.needsUpdate = true;
    target.add(separate, instanced);
    return { separate, instanced };
  };
  const preview = build(scene);
  const measured = build(testScene);
  const show = (useInstances: boolean) => {
    for (const pair of [preview, measured]) {
      pair.separate.visible = !useInstances;
      pair.instanced.visible = useInstances;
    }
    const result = attempt('renderCallCount', () => renderCallCount(renderer, testScene, camera));
    readout.textContent = result.ok
      ? `${useInstances ? 'one instanced mesh' : 'six separate meshes'}: ${result.value} draw ${result.value === 1 ? 'call' : 'calls'}\nsame six parts and pixel coverage`
      : result.note;
  };
  for (const [label, instances] of [['separate', false], ['instanced', true]] as const) {
    const button = document.createElement('button');
    button.textContent = label;
    button.addEventListener('click', () => show(instances));
    bar.append(button);
  }
  show(false);
};
