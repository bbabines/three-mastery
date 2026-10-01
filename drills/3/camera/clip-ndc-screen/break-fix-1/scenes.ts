import { attempt, COLORS, hideFloorHelpers, overlay, screenTag, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { screenY } from './drill';

export const demo: SceneSetup = ({ scene, container, onFrame }) => {
  hideFloorHelpers(scene);
  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const yours = screenTag(container, 'your label', COLORS.blue);
  const reference = screenTag(container, 'reference', COLORS.green);
  let ndcY = 0.5;
  let lastHeight = 0;

  const update = () => {
    const height = container.clientHeight;
    lastHeight = height;
    const result = attempt('screenY', () => screenY(ndcY, height));
    const expected = (1 - ndcY) * height / 2;
    reference.style.left = `${container.clientWidth * 0.7}px`;
    reference.style.top = `${expected}px`;
    yours.style.left = `${container.clientWidth * 0.3}px`;
    yours.style.display = result.ok ? '' : 'none';
    if (!result.ok) { readout.textContent = result.note; return; }
    yours.style.top = `${result.value}px`;
    readout.textContent = `NDC y ${ndcY.toFixed(2)} · viewport ${height}px tall\nyour CSS y ${result.value.toFixed(0)}px · reference ${expected.toFixed(0)}px`;
  };
  slider(controlsBar, 'ndc y', { min: -0.8, max: 0.8, step: 0.1, value: ndcY }, (value) => { ndcY = value; update(); });
  onFrame(() => { if (container.clientHeight !== lastHeight) update(); });
  update();
};
