// Scenes for the hover and selection state page. The README places each one with <div data-scene="name">.
import { buttonGroup, choiceButtons, COLORS, label, LABEL_LIFT, overlay, pointerSpot } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

type Part = THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>;

const HOVERED = new THREE.Color(0x3a3a3a);
const SELECTED = new THREE.Color(0x1d4ed8);
const BLACK = new THREE.Color(0x000000);

export const states: SceneSetup = ({ scene, camera, controls, container, renderer }) => {
  camera.position.set(0, 2.3, 3.9);
  controls.target.set(0, 0.35, 0);
  controls.update();
  camera.updateMatrixWorld();

  // Three plain gray parts, so the hover and selection looks stand out.
  const parts: Part[] = [];
  const add = (name: string, geometry: THREE.BufferGeometry, x: number) => {
    geometry.computeBoundingBox();
    const box = geometry.boundingBox!;
    const part: Part = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: '#8a8f99' }));
    part.position.set(x, -box.min.y + 0.01, 0);
    part.name = name;
    part.userData.baseEmissive = part.material.emissive.clone(); // saved before any highlight
    const tag = label(name, COLORS.white);
    tag.position.set(x, box.max.y - box.min.y, 0).add(LABEL_LIFT);
    scene.add(part, tag);
    parts.push(part);
  };
  add('bin', new THREE.BoxGeometry(0.7, 0.6, 0.7), -1.7);
  add('crate', new THREE.BoxGeometry(0.9, 0.9, 0.9), 0);
  add('drum', new THREE.CylinderGeometry(0.35, 0.35, 0.9, 32), 1.7);

  // Two versions of the same app. "One flag" keeps a single `active` part for hover and selection.
  let twoStates = false;
  let active: Part | null = null; // one flag
  let hovered: Part | null = null; // two states
  const selected = new Set<Part>();

  const paint = (part: Part, color: THREE.Color) => part.material.emissive.copy(color);
  const refresh = (part: Part) => paint(part, selected.has(part) ? SELECTED : part === hovered ? HOVERED : part.userData.baseEmissive);

  const onHover = (part: Part | null) => {
    if (twoStates) {
      const left = hovered;
      hovered = part;
      if (left) refresh(left);
      if (part) refresh(part);
    } else if (part !== active) {
      if (active) paint(active, BLACK); // ending the hover
      active = part;
      if (part) paint(part, HOVERED);
    }
  };
  const onClick = (part: Part | null) => {
    if (twoStates) {
      const before = [...selected];
      selected.clear();
      if (part) selected.add(part);
      for (const each of before) refresh(each);
      if (part) refresh(part);
    } else if (part) {
      paint(part, SELECTED);
      active = part;
    }
  };

  const canvas = renderer.domElement;
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let under: Part | null = null;
  const pick = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    ndc.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    return (raycaster.intersectObjects(parts)[0]?.object as Part | undefined) ?? null;
  };

  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  const lookOf = (part: Part) => {
    const emissive = part.material.emissive;
    return emissive.equals(SELECTED) ? 'selected' : emissive.equals(HOVERED) ? 'hovered' : 'normal';
  };
  const show = () => {
    const state = twoStates
      ? `hovered: ${hovered?.name ?? 'nothing'}   selected: ${[...selected].map((part) => part.name).join(', ') || 'nothing'}`
      : `active: ${active?.name ?? 'nothing'}`;
    readout.textContent = [
      twoStates ? 'let hovered = null; const selected = new Set();' : 'let active = null;   // one flag for hover and selection',
      `under the pointer: ${under?.name ?? 'nothing'}   ${state}`,
      `looks:  ${parts.map((part) => `${part.name} ${lookOf(part)}`).join('   ')}`,
    ].join('\n');
  };

  // A real click, told from an orbit by how far the pointer moved, as on the click vs drag page.
  const pressAt = new THREE.Vector2();
  const releaseAt = new THREE.Vector2();
  canvas.addEventListener('pointerdown', (event) => pressAt.set(event.clientX, event.clientY));
  canvas.addEventListener('pointerup', (event) => {
    if (event.button !== 0 || releaseAt.set(event.clientX, event.clientY).distanceTo(pressAt) > 5) return;
    onClick(pick(event));
    show();
  });

  const reset = (useTwoStates: boolean) => {
    twoStates = useTwoStates;
    active = hovered = null;
    selected.clear();
    for (const part of parts) paint(part, part.userData.baseEmissive);
    onHover(under);
    show();
  };
  choiceButtons(buttonGroup(bar), [
    { html: 'One flag', select: () => reset(false) },
    { html: 'Two states', select: () => reset(true) },
  ]);
  const clickButton = document.createElement('button');
  clickButton.textContent = 'Click at the pointer';
  clickButton.addEventListener('click', () => {
    onClick(under);
    show();
  });
  bar.append(clickButton);

  pointerSpot(
    container,
    canvas,
    bar,
    (event) => {
      under = pick(event);
      onHover(under);
      show();
    },
    { across: 0.75, down: 0.3 },
  );
};
