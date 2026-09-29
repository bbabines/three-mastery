// Scenes for the ray from pointer page. The README places each one with <div data-scene="name">.
import { ball, cameraView, choiceButtons, COLORS, formatNumber, formatVector, label, line, overlay, pointerSpot, pointerToNdc, setLine, showCamera, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const solid = (color: string) => new THREE.MeshStandardMaterial({ color });
const f = (n: number) => formatNumber(n, 2);

export const throughTheView: SceneSetup = (harness) => {
  const { scene, camera, controls, container } = harness;
  // Looking over the camera's shoulder, so the pane in front of it faces this view.
  camera.position.set(2.4, 3.3, 5.6);
  controls.target.set(-0.8, 0.8, -0.2);

  // The camera in the scene, and the screen in front of it: a pane sized to exactly fill its view.
  const eye = new THREE.PerspectiveCamera(40, 1.5, 0.1, 20);
  eye.position.set(-1.6, 1.4, 2.6);
  eye.lookAt(-0.3, 0.8, -1);
  eye.updateMatrixWorld(); // setFromCamera reads it, and it never moves
  showCamera(eye);
  const PANE_DISTANCE = 0.8;
  const paneHeight = 2 * PANE_DISTANCE * Math.tan(THREE.MathUtils.degToRad(eye.fov / 2));
  const paneWidth = paneHeight * eye.aspect;
  const paneShape = new THREE.PlaneGeometry(paneWidth, paneHeight);
  const pane = new THREE.Mesh(
    paneShape,
    new THREE.MeshBasicMaterial({ color: COLORS.white, transparent: true, opacity: 0.12, side: THREE.DoubleSide, depthWrite: false }),
  );
  pane.position.z = -PANE_DISTANCE;
  pane.add(new THREE.LineSegments(new THREE.EdgesGeometry(paneShape), new THREE.LineBasicMaterial({ color: COLORS.white })));
  const dot = ball(COLORS.yellow, 1, 0.04); // the pointer, on the pane
  pane.add(dot);
  eye.add(pane); // children of the camera stay out of its own picture
  const eyeTag = label('camera', COLORS.gray);
  eyeTag.position.set(-1.9, 1.85, 2.9);

  const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), solid(COLORS.blue));
  box.position.set(-0.3, 0.55, -1);
  box.name = 'the blue box';
  const can = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.4, 32), solid(COLORS.yellow));
  can.position.set(1.2, 0.75, -1.8);
  can.name = 'the yellow can';
  const globe = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 16), solid(COLORS.orange));
  globe.position.set(-1.7, 1.6, -1.9);
  globe.name = 'the orange ball';
  const targets = [box, can, globe];
  for (const target of targets) target.updateMatrixWorld(); // the first raycast comes before any render

  const ray = line(COLORS.red);
  const hitMark = ball(COLORS.white, 1, 0.07);
  scene.add(eye, eyeTag, box, can, globe, ray, hitMark);
  cameraView(harness, eye, [ray, eyeTag]);

  const readout = overlay(container, 'readout');
  const sliders = overlay(container, 'controls');
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2(0.1, -0.2);

  const update = () => {
    dot.position.set((pointer.x * paneWidth) / 2, (pointer.y * paneHeight) / 2, 0.005);
    raycaster.setFromCamera(pointer, eye);
    const hit = raycaster.intersectObjects(targets)[0];
    const { origin, direction } = raycaster.ray;
    setLine(ray, origin, hit ? hit.point : origin.clone().addScaledVector(direction, 9));
    hitMark.visible = !!hit;
    if (hit) hitMark.position.copy(hit.point);

    readout.textContent = [
      `pointer (${f(pointer.x)}, ${f(pointer.y)})   NDC, from the sliders`,
      'raycaster.setFromCamera(pointer, eye)',
      `origin ${formatVector(origin)}   direction ${formatVector(direction, 2)}`,
      hit ? `hits[0]: ${hit.object.name}, ${f(hit.distance)} along the ray` : 'no hits: the ray misses everything',
    ].join('\n');
  };
  slider(sliders, 'pointer.x', { min: -1, max: 1, step: 0.05, value: pointer.x }, (value) => {
    pointer.x = value;
    update();
  });
  slider(sliders, 'pointer.y', { min: -1, max: 1, step: 0.05, value: pointer.y }, (value) => {
    pointer.y = value;
    update();
  });
  update();
};

export const canvasRect: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  camera.position.set(0, 3, 3.9);
  controls.target.set(0, 0.1, -0.6);

  const platform = new THREE.Mesh(new THREE.BoxGeometry(6, 0.1, 3), solid('#4b5563'));
  platform.position.set(0, 0.05, -0.5);
  const crates: THREE.Mesh[] = [];
  for (const [i, x] of [-2.2, -1.1, 0, 1.1, 2.2].entries()) {
    const crate = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.7), solid(COLORS.orange));
    crate.position.set(x, 0.45, i % 2 === 0 ? -0.9 : 0);
    crates.push(crate);
  }
  const hitMark = ball(COLORS.white, 1, 0.08);
  scene.add(platform, ...crates, hitMark);
  const targets = [platform, ...crates];
  for (const target of targets) target.updateMatrixWorld(); // the first raycast comes before any render

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const canvas = renderer.domElement;
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const right = new THREE.Vector2(); // what the canvas rect gives, to compare against
  let useRect = true;
  let fire: (() => void) | undefined;
  let lines: string[] = [];

  choiceButtons(controlsBar, [
    {
      html: '<code>getBoundingClientRect()</code>',
      select: () => {
        useRect = true;
        fire?.();
      },
    },
    {
      html: '<code>window.innerWidth</code>',
      select: () => {
        useRect = false;
        fire?.();
      },
    },
  ]);

  const onMove = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    pointerToNdc(event, canvas, right);
    if (useRect) {
      pointer.copy(right);
    } else {
      pointer.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
    }
    lines = [
      useRect ? 'pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1' : 'pointer.x = (event.clientX / window.innerWidth) * 2 - 1',
      `event.clientX ${Math.round(event.clientX)}, clientY ${Math.round(event.clientY)}   canvas rect: left ${Math.round(rect.left)}, top ${Math.round(rect.top)}`,
      `pointer (${f(pointer.x)}, ${f(pointer.y)})${useRect ? '' : `   the rect gives (${f(right.x)}, ${f(right.y)})`}`,
    ];
  };
  fire = pointerSpot(container, canvas, controlsBar, onMove);

  // Raycast once a frame from the saved pointer, so the hit stays right while the camera orbits.
  onFrame(() => {
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(targets)[0];
    hitMark.visible = !!hit;
    if (hit) hitMark.position.copy(hit.point);
    for (const crate of crates) (crate.material as THREE.MeshStandardMaterial).color.set(hit?.object === crate ? COLORS.yellow : COLORS.orange);
    const underRing = pointer.distanceTo(right) < 0.01;
    const result = hit
      ? `→ hits ${hit.object === platform ? 'the platform' : 'a crate'}${underRing ? ', under the ring' : ', away from the ring'}`
      : `→ no hits${underRing ? '' : ': the ray points somewhere else'}`;
    readout.textContent = [...lines, result].join('\n');
  });
};
