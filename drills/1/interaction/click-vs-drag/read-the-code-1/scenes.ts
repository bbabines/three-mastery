// Scenes for the click vs drag page. The README places each one with <div data-scene="name">.
import { buttonGroup, choiceButtons, COLORS, formatNumber, label, LABEL_LIFT, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

type Rule = 'click' | 'same' | 'distance';
const THRESHOLD = 5; // CSS pixels

export const threshold: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  camera.position.set(0, 2.6, 4.4);
  controls.target.set(0, 0.5, 0);

  // Three parts to select. The crate sits at the orbit's target, so an orbit keeps it in the middle.
  const parts: THREE.Mesh[] = [];
  const add = (name: string, geometry: THREE.BufferGeometry, color: string, x: number, z: number) => {
    const part = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color }));
    geometry.computeBoundingBox();
    part.position.set(x, -geometry.boundingBox!.min.y + 0.01, z);
    part.name = name;
    const tag = label(name, color);
    tag.position.set(x, geometry.boundingBox!.max.y - geometry.boundingBox!.min.y, z).add(LABEL_LIFT);
    scene.add(part, tag);
    parts.push(part);
  };
  add('crate', new THREE.BoxGeometry(0.9, 0.9, 0.9), COLORS.orange, 0, 0);
  add('bin', new THREE.BoxGeometry(0.6, 0.5, 0.6), COLORS.blue, -1.9, -0.6);
  add('drum', new THREE.CylinderGeometry(0.3, 0.3, 0.8, 32), COLORS.green, 1.9, -0.6);

  let selected: THREE.Mesh | null = null;
  const select = (part: THREE.Mesh | null) => {
    selected = part;
    for (const each of parts) (each.material as THREE.MeshStandardMaterial).emissive.set(each === part ? 0x555555 : 0x000000);
  };

  const canvas = renderer.domElement;
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const partAt = (clientX: number, clientY: number) => {
    const rect = canvas.getBoundingClientRect();
    ndc.set(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    return (raycaster.intersectObjects(parts)[0]?.object as THREE.Mesh | undefined) ?? null;
  };

  let rule: Rule = 'click';
  const lines = { rule: '', what: 'Press "Orbit and come back", or orbit or click yourself.', result: '' };
  const ruleCode: Record<Rule, string> = {
    click: "canvas.addEventListener('click', (e) => select(partUnder(e)))",
    same: 'on pointerup: if (partUnder(e) === pressed) select(pressed)',
    distance: `on pointerup: if (farthest < ${THRESHOLD}) select(partUnder(e))   // CSS px`,
  };

  // One press, some movement, one release, from a real pointer or the replay. Each rule decides.
  const press = { x: 0, y: 0, part: null as THREE.Mesh | null, farthest: 0 };
  const begin = (x: number, y: number) => {
    press.x = x;
    press.y = y;
    press.part = partAt(x, y);
    press.farthest = 0;
  };
  const moveTo = (x: number, y: number) => {
    press.farthest = Math.max(press.farthest, Math.hypot(x - press.x, y - press.y));
  };
  const end = (x: number, y: number) => {
    const released = partAt(x, y);
    const clicked =
      rule === 'click' ? true : rule === 'same' ? released !== null && released === press.part : press.farthest < THRESHOLD;
    const moved = `moved up to ${formatNumber(press.farthest, 0)} px`;
    lines.what = `pressed on: ${press.part?.name ?? 'nothing'}   ${moved}   released on: ${released?.name ?? 'nothing'}`;
    if (clicked) {
      select(released);
      lines.result = released ? `A click: selected the ${released.name}.` : 'A click on empty space: cleared the selection.';
    } else {
      lines.result = 'A drag: nothing selected.';
    }
  };

  let down = false;
  canvas.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    down = true;
    begin(event.clientX, event.clientY);
  });
  canvas.addEventListener('pointermove', (event) => {
    if (down) moveTo(event.clientX, event.clientY);
  });
  canvas.addEventListener('pointerup', (event) => {
    if (!down || event.button !== 0) return;
    down = false;
    if (rule !== 'click') end(event.clientX, event.clientY);
  });
  // The first rule uses the browser's own click event, which arrives after pointerup.
  canvas.addEventListener('click', (event) => {
    if (rule === 'click') end(event.clientX, event.clientY);
  });

  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');

  // The replay: press over the crate, drag right and back as an orbit would, release where it began.
  const ring = document.createElement('div');
  ring.style.cssText =
    'position: absolute; width: 14px; height: 14px; margin: -9px 0 0 -9px; border: 2px solid #e5e7eb; ' +
    'border-radius: 50%; pointer-events: none;';
  ring.hidden = true;
  container.append(ring);
  let distance = 40;
  const replay = { on: false, t: 0, offset: 0, startX: 0, startY: 0 };
  const crateSpot = new THREE.Vector3();
  const startReplay = () => {
    const rect = canvas.getBoundingClientRect();
    camera.updateMatrixWorld();
    parts[0].getWorldPosition(crateSpot).project(camera);
    replay.startX = rect.left + ((crateSpot.x + 1) / 2) * rect.width;
    replay.startY = rect.top + ((1 - crateSpot.y) / 2) * rect.height;
    replay.on = true;
    replay.t = 0;
    replay.offset = 0;
    ring.hidden = false;
    controls.enableDamping = false; // so the view turns in step with the replayed pointer
    begin(replay.startX, replay.startY);
    lines.result = '';
  };
  const timer = new THREE.Timer(); // its own, so the replay runs even while the page is in a hidden tab
  onFrame(() => {
    const delta = timer.update().getDelta();
    if (replay.on) {
      replay.t = Math.min(1, replay.t + delta / 0.9);
      const offset = distance * Math.sin(Math.PI * replay.t); // out and back
      // What OrbitControls does with a sideways drag: turn by a full circle per canvas height.
      controls.rotateLeft((2 * Math.PI * (offset - replay.offset)) / canvas.clientHeight);
      replay.offset = offset;
      const rect = canvas.getBoundingClientRect();
      ring.style.left = `${replay.startX - rect.left + offset}px`;
      ring.style.top = `${replay.startY - rect.top}px`;
      moveTo(replay.startX + offset, replay.startY);
      if (replay.t === 1) {
        replay.on = false;
        ring.hidden = true;
        controls.enableDamping = true;
        end(replay.startX, replay.startY);
      }
    }
    readout.textContent = [ruleCode[rule], lines.what, lines.result].join('\n');
  });

  choiceButtons(buttonGroup(bar), [
    { html: '<code>click</code> event', select: () => ((rule = 'click'), select(null)) },
    { html: 'Same part on press and release', select: () => ((rule = 'same'), select(null)) },
    { html: `Moved under ${THRESHOLD} px`, select: () => ((rule = 'distance'), select(null)) },
  ]);
  const go = document.createElement('button');
  go.textContent = 'Orbit and come back';
  go.addEventListener('click', startReplay);
  bar.append(go);
  slider(bar, 'how far (px)', { min: 0, max: 60, step: 5, value: distance }, (value) => (distance = value));
};
