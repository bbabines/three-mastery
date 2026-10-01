import type { Harness } from '@harness/scene';

// A frame interval is a useful before/after number, but it includes browser scheduling.
// It is deliberately not labelled as GPU execution time.
export function frameMeter({ renderer, onFrame }: Harness, readout: HTMLElement): void {
  const explanation = readout.textContent ?? '';
  let previous = performance.now();
  let sum = 0;
  let count = 0;
  onFrame(() => {
    const now = performance.now();
    sum += now - previous;
    previous = now;
    if (++count < 30) return;
    readout.textContent = `${readout.dataset.base ?? explanation}\nframe interval: ${(sum / count).toFixed(1)} ms\ndraw calls: ${renderer.info.render.calls}\ntriangles: ${renderer.info.render.triangles}`;
    count = 0;
    sum = 0;
  });
}
