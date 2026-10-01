import { attempt, COLORS, hideFloorHelpers, overlay, screenTag, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { comparison } from '../../compare';
import { pixelToNdc } from './drill';

export const demo: SceneSetup = ({ scene, container }) => {
  hideFloorHelpers(scene);
  const controlsBar = overlay(container, 'controls');
  const show = comparison(container, 'Pointer: CSS pixels → NDC');
  const dot = screenTag(container, 'pointer', COLORS.yellow);
  let y = 150;
  const update = () => {
    const width = container.clientWidth, height = container.clientHeight;
    const x = width * 0.3;
    dot.style.left = `${x}px`; dot.style.top = `${y}px`;
    const expectedX = 2 * x / width - 1, expectedY = 1 - 2 * y / height;
    const result = attempt('pixelToNdc', () => pixelToNdc(x, y, width, height));
    show(`pointer (${x.toFixed(0)}, ${y.toFixed(0)}) CSS px`,
      result.ok ? `NDC (${result.value.x.toFixed(2)}, ${result.value.y.toFixed(2)})` : result.note,
      `NDC (${expectedX.toFixed(2)}, ${expectedY.toFixed(2)}, 0)`);
  };
  slider(controlsBar, 'pointer y', { min: 50, max: 280, step: 5, value: y }, value => { y = value; update(); });
  update();
};
