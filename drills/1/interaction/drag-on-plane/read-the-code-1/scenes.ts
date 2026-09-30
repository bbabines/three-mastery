// Scenes for the drag on a plane page. The README places each one with <div data-scene="name">.
import { arrow, ball, choiceButtons, COLORS, formatNumber, formatVector, overlay, pointerDrag, setArrow } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const UP = new THREE.Vector3(0, 1, 0);

// A crate whose origin is the middle of its base, so it sits on the floor at y = 0.
function crate() {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.8, 0.8).translate(0, 0.4, 0),
    new THREE.MeshStandardMaterial({ color: COLORS.orange }),
  );
  const origin = ball(COLORS.white, 1, 0.05); // marks the crate's origin
  origin.material.depthTest = false;
  origin.renderOrder = 1;
  mesh.add(origin);
  return mesh;
}

// The pointer's spot on the canvas, as fractions across and down, for a spot in the world.
function screenSpot(point: THREE.Vector3, camera: THREE.Camera) {
  const ndc = point.clone().project(camera);
  return { across: (ndc.x + 1) / 2, down: (1 - ndc.y) / 2 };
}

export const floorDrag: SceneSetup = (harness) => {
  const { scene, camera, controls, container } = harness;
  camera.position.set(0.4, 3.4, 4.6);
  controls.target.set(0.4, 0.3, -0.4);
  controls.update();
  camera.updateMatrixWorld();

  const START = new THREE.Vector3(-1, 0, 0);
  const GRAB = new THREE.Vector3(0.2, 0.8, 0.25); // the slider's grab: on the top face, measured from the crate's origin
  const box = crate();
  box.position.copy(START);

  // The plane, drawn faintly so you can see it; the real one is only math.
  const planeView = new THREE.Mesh(
    new THREE.PlaneGeometry(7, 7).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({ color: COLORS.blue, transparent: true, opacity: 0.12, side: THREE.DoubleSide, depthWrite: false }),
  );
  planeView.visible = false;
  const hitMark = ball(COLORS.yellow, 1, 0.06);
  hitMark.visible = false;
  const offsetArrow = arrow(COLORS.green);
  offsetArrow.visible = false;
  // Drawn on top, since the offset runs inside the crate, from the grabbed spot down to its origin.
  for (const part of [offsetArrow.line, offsetArrow.cone]) {
    (part.material as THREE.Material).depthTest = false;
    part.renderOrder = 2;
  }
  hitMark.material.depthTest = false;
  hitMark.renderOrder = 2;
  scene.add(box, planeView, hitMark, offsetArrow);

  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  const raycaster = new THREE.Raycaster();
  const plane = new THREE.Plane();
  const hit = new THREE.Vector3();
  const offset = new THREE.Vector3();
  let grabbed = false;

  const show = () => {
    readout.textContent = [
      'plane.setFromNormalAndCoplanarPoint(up, grabbed)   // on the press',
      grabbed ? `raycaster.ray.intersectPlane(plane, hit)   hit ${formatVector(hit, 2)}` : 'raycaster.ray.intersectPlane(plane, hit)   // on each move',
      `crate.position.copy(hit).add(offset)   ${formatVector(box.position, 2)}`,
      grabbed ? `offset ${formatVector(offset, 2)}: from the grabbed spot to the origin` : 'Drag the crate, or use the slider.',
    ].join('\n');
  };

  pointerDrag(
    harness,
    {
      reset: () => {
        box.position.copy(START);
        box.updateMatrixWorld(); // the raycast on the press reads matrixWorld, as on the update timing page
      },
      down: (ndc) => {
        raycaster.setFromCamera(ndc, camera);
        const first = raycaster.intersectObject(box, false)[0];
        if (!first) return false;
        grabbed = true;
        plane.setFromNormalAndCoplanarPoint(UP, first.point);
        offset.copy(box.position).sub(first.point);
        hit.copy(first.point);
        planeView.position.set(first.point.x, first.point.y, first.point.z);
        planeView.visible = hitMark.visible = true;
        hitMark.position.copy(hit);
        setArrow(offsetArrow, hit, offset);
        show();
        return true;
      },
      move: (ndc) => {
        raycaster.setFromCamera(ndc, camera);
        if (!raycaster.ray.intersectPlane(plane, hit)) return;
        box.position.copy(hit).add(offset);
        hitMark.position.copy(hit);
        setArrow(offsetArrow, hit, offset);
        show();
      },
    },
    {
      bar,
      text: 'drag',
      path: (t) => {
        const start = screenSpot(START.clone().add(GRAB), camera);
        return { across: start.across + 0.32 * t, down: start.down + 0.08 * t };
      },
    },
  );
  show();
};

export const grabOffset: SceneSetup = (harness) => {
  const { scene, camera, controls, container } = harness;
  camera.position.set(0.4, 3.4, 4.6);
  controls.target.set(0.4, 0.3, -0.4);
  controls.update();
  camera.updateMatrixWorld();

  const START = new THREE.Vector3(-1, 0, 0);
  const GRAB = new THREE.Vector3(0.35, 0.8, 0.35); // near the crate's front corner, on its top face
  const box = crate();
  box.position.copy(START);
  const ghost = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.8, 0.8).translate(0, 0.4, 0),
    new THREE.MeshBasicMaterial({ color: COLORS.gray, transparent: true, opacity: 0.25, depthWrite: false }),
  );
  ghost.position.copy(START); // where the crate started
  const hitMark = ball(COLORS.yellow, 1, 0.06);
  hitMark.visible = false;
  scene.add(box, ghost, hitMark);

  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  const raycaster = new THREE.Raycaster();
  const floor = new THREE.Plane(UP, 0);
  const hit = new THREE.Vector3();
  const offset = new THREE.Vector3();
  let keepOffset = false;
  let moved = false;

  const show = () => {
    const gap = box.position.distanceTo(hit);
    readout.textContent = [
      keepOffset ? 'crate.position.copy(hit).add(offset)' : 'crate.position.copy(hit)',
      `hit ${formatVector(hit, 2)} on the floor   offset ${formatNumber(offset.length())} long`,
      !moved
        ? 'Grab the crate near a corner and drag.'
        : keepOffset
          ? `The crate keeps its offset: its origin stays ${formatNumber(gap)} from the hit.`
          : 'The crate jumped: its origin went straight to the hit.',
    ].join('\n');
  };

  const { replay } = pointerDrag(
    harness,
    {
      reset: () => {
        box.position.copy(START);
        box.updateMatrixWorld(); // the raycast on the press reads matrixWorld, as on the update timing page
        moved = false;
      },
      down: (ndc) => {
        raycaster.setFromCamera(ndc, camera);
        if (!raycaster.intersectObject(box, false)[0]) return false;
        if (!raycaster.ray.intersectPlane(floor, hit)) return false;
        offset.copy(box.position).sub(hit);
        hitMark.visible = true;
        hitMark.position.copy(hit);
        show();
        return true;
      },
      move: (ndc) => {
        raycaster.setFromCamera(ndc, camera);
        if (!raycaster.ray.intersectPlane(floor, hit)) return;
        if (keepOffset) box.position.copy(hit).add(offset);
        else box.position.copy(hit);
        moved = true;
        hitMark.position.copy(hit);
        show();
      },
    },
    {
      bar,
      text: 'drag',
      path: (t) => {
        const start = screenSpot(START.clone().add(GRAB), camera);
        return { across: start.across + 0.3 * t, down: start.down - 0.04 * t };
      },
    },
  );

  // Switching the code replays the slider's drag, so the two can be compared at the same spot.
  const dragSlider = bar.querySelector('input')!;
  const choose = (keep: boolean) => {
    keepOffset = keep;
    const t = Number(dragSlider.value);
    if (t > 0) replay(t);
    else {
      box.position.copy(START);
      moved = false;
    }
    show();
  };
  choiceButtons(bar, [
    { html: '<code>crate.position.copy(hit)</code>', select: () => choose(false) },
    { html: '<code>.copy(hit).add(offset)</code>', select: () => choose(true) },
  ]);
  bar.append(dragSlider.closest('label')!); // the slider after the buttons
};
