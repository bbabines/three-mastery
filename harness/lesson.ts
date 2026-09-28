// Building blocks for lesson scenes: colors, labels, balls, arrows, lines, sliders, buttons, readouts.
import * as THREE from 'three';

export const COLORS = {
  red: '#ef4444',
  green: '#22c55e',
  blue: '#3b82f6',
  yellow: '#facc15',
  orange: '#f97316',
  purple: '#a855f7',
  gray: '#9aa0ab',
  white: '#e5e7eb',
};

// A text label that always faces the camera and draws on top of everything.
export function label(text: string, color: string) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  const font = '600 44px system-ui, sans-serif';
  context.font = font;
  canvas.width = Math.ceil(context.measureText(text).width) + 16;
  canvas.height = 64;
  context.font = font; // resizing the canvas resets the context
  context.fillStyle = color;
  context.textBaseline = 'middle';
  context.fillText(text, 8, 32);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, depthTest: false }));
  sprite.scale.set((canvas.width / canvas.height) * 0.32, 0.32, 1);
  sprite.renderOrder = 1;
  return sprite;
}

// Add to a position to float a label just above the thing it names.
export const LABEL_LIFT = new THREE.Vector3(0, 0.45, 0);

// A cone whose tip points along +Z, the side `lookAt` turns toward its target. Use it for
// anything that aims: turrets, cameras, spotlights.
export function pointer(color: string, size = 1) {
  return new THREE.Mesh(
    new THREE.ConeGeometry(0.22 * size, 0.8 * size, 24).rotateX(Math.PI / 2),
    new THREE.MeshStandardMaterial({ color }),
  );
}

export function ball(color: string, opacity = 1, radius = 0.16) {
  return new THREE.Mesh(
    new THREE.SphereGeometry(radius),
    new THREE.MeshStandardMaterial({ color, transparent: opacity < 1, opacity }),
  );
}

export function arrow(color: string) {
  return new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 1, color);
}

const direction = new THREE.Vector3();

// Re-aims an arrow to draw `vector` starting at `from`. A vector with no length hides the arrow.
export function setArrow(helper: THREE.ArrowHelper, from: THREE.Vector3, vector: THREE.Vector3) {
  const length = vector.length();
  helper.visible = length > 1e-6;
  if (!helper.visible) return;
  helper.position.copy(from);
  helper.setDirection(direction.copy(vector).divideScalar(length));
  const head = Math.min(0.25, length * 0.4);
  helper.setLength(length, head, head * 0.6);
}

export function line(color: string, opacity = 1) {
  const result = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]),
    new THREE.LineBasicMaterial({ color, transparent: opacity < 1, opacity }),
  );
  result.frustumCulled = false; // its end points move, so its stored bounds go stale
  return result;
}

export function setLine(target: THREE.Line, start: THREE.Vector3, end: THREE.Vector3) {
  target.geometry.setFromPoints([start, end]);
}

export function overlay(container: HTMLElement, className: 'readout' | 'controls') {
  const element = document.createElement('div');
  element.className = className;
  container.append(element);
  return element;
}

interface SliderOptions {
  min: number;
  max: number;
  step: number;
  value: number;
}

export function slider(parent: HTMLElement, text: string, options: SliderOptions, onInput: (value: number) => void) {
  const wrapper = document.createElement('label');
  wrapper.innerHTML = `${text} <input type="range" min="${options.min}" max="${options.max}" step="${options.step}" value="${options.value}">`;
  const input = wrapper.querySelector('input')!;
  input.addEventListener('input', () => onInput(Number(input.value)));
  parent.append(wrapper);
}

// A row of buttons where exactly one is selected. The first starts selected.
export function choiceButtons(parent: HTMLElement, choices: { html: string; select: () => void }[]) {
  const buttons = choices.map((choice) => {
    const button = document.createElement('button');
    button.innerHTML = choice.html;
    button.addEventListener('click', () => {
      for (const other of buttons) other.setAttribute('aria-pressed', String(other === button));
      choice.select();
    });
    parent.append(button);
    return button;
  });
  buttons[0].click();
}

export const formatNumber = (n: number, digits = 2) => String(+n.toFixed(digits));

export const formatVector = (v: THREE.Vector3, digits = 1) =>
  `(${formatNumber(v.x, digits)}, ${formatNumber(v.y, digits)}, ${formatNumber(v.z, digits)})`;
