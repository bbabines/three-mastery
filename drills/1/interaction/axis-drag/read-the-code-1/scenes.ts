// Scenes for the axis-constrained drag page. The README places each one with <div data-scene="name">.
import { ball, buttonGroup, choiceButtons, COLORS, formatNumber, formatVector, line, overlay, pointerDrag, setLine, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

// The pointer's spot on the canvas, as fractions across and down, for a spot in the world.
function screenSpot(point: THREE.Vector3, camera: THREE.Camera) {
  const ndc = point.clone().project(camera);
  return { across: (ndc.x + 1) / 2, down: (1 - ndc.y) / 2 };
}

// The drag plane: through `through`, containing `axis`, and facing the camera as much as it can.
function buildAxisPlane(axis: THREE.Vector3, through: THREE.Vector3, camera: THREE.Camera, plane: THREE.Plane, normal: THREE.Vector3) {
  normal.copy(camera.position).sub(through).projectOnPlane(axis).normalize();
  return plane.setFromNormalAndCoplanarPoint(normal, through);
}

function carriage(color: string) {
  return new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.36, 0.46), new THREE.MeshStandardMaterial({ color }));
}

function rod(from: THREE.Vector3, to: THREE.Vector3) {
  const length = from.distanceTo(to);
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, length, 12), new THREE.MeshStandardMaterial({ color: COLORS.gray }));
  mesh.position.copy(from).add(to).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), to.clone().sub(from).normalize());
  return mesh;
}

export const axisPlane: SceneSetup = (harness) => {
  const { scene, camera, controls, container, onFrame } = harness;
  camera.position.set(0.9, 2.1, 4.1);
  controls.target.set(0, 1, 0);
  controls.update();
  camera.updateMatrixWorld();

  const setups = {
    rail: { axis: new THREE.Vector3(1, 0, 0), start: new THREE.Vector3(-1.2, 0.7, 0), track: rod(new THREE.Vector3(-2.6, 0.7, 0), new THREE.Vector3(2.6, 0.7, 0)) },
    post: { axis: new THREE.Vector3(0, 1, 0), start: new THREE.Vector3(0, 0.5, 0), track: rod(new THREE.Vector3(0, 0.05, 0), new THREE.Vector3(0, 2.6, 0)) },
  };
  let setup = setups.rail;
  scene.add(setups.rail.track, setups.post.track);
  const part = carriage(COLORS.orange);
  scene.add(part);

  // The plane, drawn faintly: turned so one edge runs along the axis and its face points at the camera.
  const planeView = new THREE.Mesh(
    new THREE.PlaneGeometry(4, 4),
    new THREE.MeshBasicMaterial({ color: COLORS.blue, transparent: true, opacity: 0.14, side: THREE.DoubleSide, depthWrite: false }),
  );
  const hitMark = ball(COLORS.yellow, 1, 0.06);
  const onAxis = ball(COLORS.green, 1, 0.06);
  const dropped = line(COLORS.green);
  for (const mark of [hitMark, onAxis]) {
    mark.material.depthTest = false;
    mark.renderOrder = 2;
  }
  dropped.material.depthTest = false;
  dropped.renderOrder = 2;
  scene.add(planeView, hitMark, onAxis, dropped);

  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  const raycaster = new THREE.Raycaster();
  const plane = new THREE.Plane();
  const normal = new THREE.Vector3();
  const grabbed = new THREE.Vector3();
  const start = new THREE.Vector3();
  const hit = new THREE.Vector3();
  const move = new THREE.Vector3();
  const side = new THREE.Vector3();
  const basis = new THREE.Matrix4();
  let along = 0;
  let dragged = false;

  const show = () => {
    const axisName = setup === setups.rail ? '(1, 0, 0)' : '(0, 1, 0)';
    readout.textContent = [
      `axis ${axisName}   normal = toCamera.projectOnPlane(axis) ${formatVector(normal, 2)}`,
      dragged ? `hit ${formatVector(hit, 2)}   move ${formatVector(move, 2)}` : 'Drag the carriage, or use the slider.',
      `along = move.dot(axis) = ${formatNumber(along)}   // the green part is dropped`,
      `part.position = start + axis × along ${formatVector(part.position, 2)}`,
    ].join('\n');
  };

  const reset = () => {
    part.position.copy(setup.start);
    part.updateMatrixWorld(); // the raycast on the press reads matrixWorld, as on the update timing page
    setups.rail.track.visible = setup === setups.rail;
    setups.post.track.visible = setup === setups.post;
    along = 0;
    dragged = false;
    hitMark.visible = onAxis.visible = dropped.visible = false;
  };

  // The plane shown is the one a press would build right now, so it turns as the view orbits.
  onFrame(() => {
    const through = dragged ? grabbed : part.position;
    buildAxisPlane(setup.axis, through, camera, plane, normal);
    side.crossVectors(normal, setup.axis);
    basis.makeBasis(setup.axis, side, normal);
    planeView.quaternion.setFromRotationMatrix(basis);
    planeView.position.copy(through);
    if (!dragged) show();
  });

  pointerDrag(
    harness,
    {
      reset,
      down: (ndc) => {
        raycaster.setFromCamera(ndc, camera);
        const first = raycaster.intersectObject(part)[0];
        if (!first) return false;
        grabbed.copy(first.point);
        start.copy(part.position);
        buildAxisPlane(setup.axis, grabbed, camera, plane, normal);
        return true;
      },
      move: (ndc) => {
        raycaster.setFromCamera(ndc, camera);
        if (!raycaster.ray.intersectPlane(plane, hit)) return;
        dragged = true;
        along = move.subVectors(hit, grabbed).dot(setup.axis);
        part.position.copy(start).addScaledVector(setup.axis, along);
        hitMark.visible = onAxis.visible = dropped.visible = true;
        hitMark.position.copy(hit);
        onAxis.position.copy(grabbed).addScaledVector(setup.axis, along);
        setLine(dropped, onAxis.position, hit);
        show();
      },
    },
    {
      bar,
      text: 'drag',
      path: (t) => {
        const spot = screenSpot(setup.start, camera);
        return { across: spot.across + 0.2 * t, down: spot.down - 0.22 * t };
      },
    },
  );

  const dragSlider = bar.querySelector('input')!;
  choiceButtons(buttonGroup(bar), [
    { html: 'Along a rail: X', select: () => ((setup = setups.rail), reset(), (dragSlider.value = '0')) },
    { html: 'Up a post: Y', select: () => ((setup = setups.post), reset(), (dragSlider.value = '0')) },
  ]);
  bar.append(dragSlider.closest('label')!); // the slider after the buttons
};

export const screenDelta: SceneSetup = (harness) => {
  const { scene, camera, controls, container } = harness;
  const TARGET = new THREE.Vector3(0, 0.7, 0);
  const START = new THREE.Vector3(-0.8, 0.7, 0);
  const AXIS = new THREE.Vector3(1, 0, 0);
  const part = carriage(COLORS.orange);
  part.position.copy(START);
  const front = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.02), new THREE.MeshStandardMaterial({ color: COLORS.white }));
  front.position.set(0.12, 0.05, 0.24); // a mark on its +X end of the +Z face, so left and right read at a glance
  part.add(front);
  scene.add(rod(new THREE.Vector3(-2.6, 0.7, 0), new THREE.Vector3(2.6, 0.7, 0)), part);

  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  const canvas = harness.renderer.domElement;
  const raycaster = new THREE.Raycaster();
  const plane = new THREE.Plane();
  const normal = new THREE.Vector3();
  const grabbed = new THREE.Vector3();
  const hit = new THREE.Vector3();
  const move = new THREE.Vector3();
  const lastNdc = new THREE.Vector2();
  let useRay = false;
  let orbit = 0;
  let pointerPixels = 0; // how far right the pointer has moved since the press, in CSS pixels
  let pointerAt = { across: 0, down: 0 };

  const placeCamera = () => {
    const angle = THREE.MathUtils.degToRad(orbit);
    camera.position.set(TARGET.x + 5 * Math.sin(angle), 2.6, TARGET.z + 5 * Math.cos(angle));
    controls.target.copy(TARGET);
    controls.update();
    camera.updateMatrixWorld();
  };
  placeCamera();

  const show = () => {
    const moved = part.position.x - START.x;
    let result = 'Drag the carriage, or use the slider.';
    if (pointerPixels !== 0) {
      camera.updateMatrixWorld();
      const spot = screenSpot(part.position, camera);
      const gap = (spot.across - pointerAt.across) * canvas.clientWidth;
      const startSpot = screenSpot(START, camera);
      const screenMove = (spot.across - startSpot.across) * canvas.clientWidth;
      result =
        Math.abs(gap) < 8
          ? 'On screen it stays under the pointer.'
          : `On screen it moved ${formatNumber(Math.abs(screenMove), 0)} px ${screenMove < 0 ? 'left, the wrong way' : 'right'}, ${formatNumber(Math.abs(gap), 0)} px from the pointer.`;
    }
    readout.textContent = [
      useRay ? 'along = hit.sub(grabbed).dot(axis); part.position.x = start.x + along' : 'part.position.x += event.movementX * 0.01',
      `pointer moved ${formatNumber(pointerPixels, 0)} px right   carriage moved ${formatNumber(moved)} along X`,
      result,
    ].join('\n');
  };

  const { replay } = pointerDrag(
    harness,
    {
      reset: () => {
        part.position.copy(START);
        part.updateMatrixWorld(); // the raycast on the press reads matrixWorld, as on the update timing page
        pointerPixels = 0;
      },
      down: (ndc) => {
        raycaster.setFromCamera(ndc, camera);
        const first = raycaster.intersectObject(part)[0];
        if (!first) return false;
        grabbed.copy(first.point);
        buildAxisPlane(AXIS, grabbed, camera, plane, normal);
        lastNdc.copy(ndc);
        pointerPixels = 0;
        return true;
      },
      move: (ndc) => {
        const movementX = ((ndc.x - lastNdc.x) / 2) * canvas.clientWidth; // what event.movementX would say
        lastNdc.copy(ndc);
        pointerPixels += movementX;
        pointerAt = { across: (ndc.x + 1) / 2, down: (1 - ndc.y) / 2 };
        if (useRay) {
          raycaster.setFromCamera(ndc, camera);
          if (!raycaster.ray.intersectPlane(plane, hit)) return;
          part.position.x = START.x + move.subVectors(hit, grabbed).dot(AXIS);
        } else {
          part.position.x += movementX * 0.01;
        }
        show();
      },
    },
    {
      bar,
      text: 'drag right',
      path: (t) => {
        const spot = screenSpot(START, camera);
        return { across: spot.across + 0.22 * t, down: spot.down };
      },
    },
  );

  const dragSlider = bar.querySelector('input')!;
  const again = () => {
    const t = Number(dragSlider.value);
    if (t > 0) replay(t);
    else {
      part.position.copy(START);
      pointerPixels = 0;
    }
    show();
  };
  choiceButtons(buttonGroup(bar), [
    { html: '<code>position.x += event.movementX * 0.01</code>', select: () => ((useRay = false), again()) },
    { html: 'Ray, plane, and <code>dot</code>', select: () => ((useRay = true), again()) },
  ]);
  slider(bar, 'orbit', { min: 0, max: 180, step: 15, value: orbit }, (value) => {
    orbit = value;
    placeCamera();
    again();
  });
  bar.append(dragSlider.closest('label')!); // the drag slider last
  show();
};
