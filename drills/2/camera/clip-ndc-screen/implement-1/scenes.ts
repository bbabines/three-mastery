import { attempt, COLORS, hideFloorHelpers, overlay, screenTag, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { comparison } from '../../compare';
import { ndcToPixel } from './drill';

export const demo: SceneSetup = ({ scene, container }) => {
  hideFloorHelpers(scene);
  const controlsBar = overlay(container, 'controls');
  const show = comparison(container, 'NDC → CSS label position');
  const yours = screenTag(container, 'your label', COLORS.blue);
  const reference = screenTag(container, 'reference', COLORS.green);
  let ndcY = 0.4;
  const update = () => {
    const width = container.clientWidth, height = container.clientHeight;
    const ndc = new THREE.Vector3(-0.45, ndcY, 0.2);
    const expectedX = (ndc.x + 1) * width / 2, expectedY = (1 - ndc.y) * height / 2;
    const result = attempt('ndcToPixel', () => ndcToPixel(ndc.clone(), width, height));
    reference.style.left = `${expectedX}px`; reference.style.top = `${expectedY}px`;
    yours.style.display = result.ok ? '' : 'none';
    if (result.ok) { yours.style.left = `${result.value.x}px`; yours.style.top = `${result.value.y}px`; }
    show(`NDC y ${ndcY.toFixed(2)}, depth 0.2`,
      result.ok ? `(${result.value.x.toFixed(0)}, ${result.value.y.toFixed(0)}) CSS px · z ${result.value.z.toFixed(1)}` : result.note,
      `(${expectedX.toFixed(0)}, ${expectedY.toFixed(0)}) CSS px · z 0.2`);
  };
  slider(controlsBar, 'ndc y', { min: -0.8, max: 0.8, step: 0.1, value: ndcY }, value => { ndcY = value; update(); });
  update();
};
