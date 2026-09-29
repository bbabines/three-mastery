// Scenes for the intersection anatomy page. The README places each one with <div data-scene="name">.
import { arrow, ball, choiceButtons, COLORS, formatNumber, formatVector, label, LABEL_LIFT, line, outline, overlay, pointer, setArrow, setLine, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const solid = (color: string) => new THREE.MeshStandardMaterial({ color });
const f = (n: number) => formatNumber(n, 2);
const uvText = (uv: THREE.Vector2) => `(${f(uv.x)}, ${f(uv.y)})`;

// A board with a canvas for a texture: a light grid to paint dots onto.
function paintableBoard() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const clear = () => {
    ctx.fillStyle = '#e5e7eb';
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = '#9aa0ab';
    for (let i = 0; i <= 256; i += 32) {
      ctx.strokeRect(i, -1, 0, 258);
      ctx.strokeRect(-1, i, 258, 0);
    }
    texture.needsUpdate = true;
  };
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  clear();
  const paint = (uv: THREE.Vector2) => {
    ctx.fillStyle = COLORS.red;
    ctx.beginPath();
    ctx.arc(uv.x * canvas.width, (1 - uv.y) * canvas.height, 6, 0, Math.PI * 2); // canvas y runs down
    ctx.fill();
    texture.needsUpdate = true;
  };
  const board = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.2), new THREE.MeshStandardMaterial({ map: texture }));
  return { board, paint, clear };
}

export const readTheHit: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(2.5, 2.4, 2.2);
  controls.target.set(-0.4, 1, 0.3);

  const { board, paint, clear } = paintableBoard();
  board.position.set(0.3, 1.15, -0.8);
  board.name = 'board';
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.55), solid(COLORS.gray));
  post.position.set(0.3, 0.28, -0.8);

  const scannerAt = new THREE.Vector3(-1.3, 1.5, 2);
  const scanner = pointer(COLORS.red, 0.6);
  scanner.position.copy(scannerAt);
  const scannerTag = label('scanner', COLORS.red);
  scannerTag.position.copy(scannerAt).sub(LABEL_LIFT); // below it, clear of the readout
  const ray = line(COLORS.red);
  const hitMark = ball(COLORS.white, 1, 0.05);
  const worldNormal = arrow(COLORS.green);
  scene.add(board, post, scanner, scannerTag, ray, hitMark, worldNormal);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const raycaster = new THREE.Raycaster();
  const aimAt = new THREE.Vector3();
  const values = { across: 0.2, up: 0.2, turn: -25 };
  const toWorld = new THREE.Matrix3();

  const update = () => {
    board.rotation.y = THREE.MathUtils.degToRad(values.turn);
    board.updateMatrixWorld(); // it may have just turned, and the raycast reads matrixWorld
    aimAt.set(0.3 + values.across, 1.15 + values.up, -0.8);
    scanner.lookAt(aimAt);
    raycaster.set(scannerAt, aimAt.clone().sub(scannerAt).normalize());
    const hit = raycaster.intersectObject(board)[0];

    setLine(ray, scannerAt, hit ? hit.point : raycaster.ray.at(6, new THREE.Vector3()));
    hitMark.visible = worldNormal.visible = !!hit;
    if (!hit) {
      readout.textContent = 'raycaster.intersectObject(board)\n→ [] the ray misses the board';
      return;
    }
    hitMark.position.copy(hit.point);
    paint(hit.uv!);
    toWorld.getNormalMatrix(board.matrixWorld);
    const n = hit.face!.normal.clone().applyNormalMatrix(toWorld);
    setArrow(worldNormal, hit.point, n.clone().multiplyScalar(0.6));

    readout.textContent = [
      `hit.distance ${f(hit.distance)}   hit.point ${formatVector(hit.point, 2)}   in the world`,
      `hit.uv ${uvText(hit.uv!)}   a dot is painted there`,
      `hit.face.normal ${formatVector(hit.face!.normal, 2)}   measured from the board itself`,
      `the same normal in the world ${formatVector(n, 2)}   the green arrow`,
    ].join('\n');
  };

  slider(controlsBar, 'Aim across', { min: -0.8, max: 0.8, step: 0.05, value: values.across }, (value) => {
    values.across = value;
    update();
  });
  slider(controlsBar, 'Aim up', { min: -0.6, max: 0.6, step: 0.05, value: values.up }, (value) => {
    values.up = value;
    update();
  });
  slider(controlsBar, 'Turn board', { min: -45, max: 45, step: 5, value: values.turn }, (value) => {
    values.turn = value;
    update();
  });
  const wipe = document.createElement('button');
  wipe.textContent = 'Clear the dots';
  wipe.addEventListener('click', () => {
    clear();
    update();
  });
  controlsBar.append(wipe);
  update();
};

export const notWhatYouSee: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(2.1, 2.4, 4.3);
  controls.target.set(-0.4, 0.8, -0.1);

  // Just off the line through the middles, so the ray doesn't run along a box's diagonal edge.
  const start = new THREE.Vector3(-2.4, 0.93, 0.06);
  const scanner = pointer(COLORS.red, 0.6);
  scanner.position.copy(start);
  scanner.lookAt(start.clone().add(new THREE.Vector3(1, 0, 0)));

  const frontShape = new THREE.BoxGeometry(0.7, 0.7, 0.7);
  const front = new THREE.Mesh(frontShape, solid(COLORS.blue));
  front.position.set(-1, 0.9, 0);
  front.name = 'the front box';
  const hiddenOutline = outline(frontShape, COLORS.gray);
  hiddenOutline.position.copy(front.position);
  const glassShape = new THREE.BoxGeometry(0.06, 1.4, 1.2);
  const glass = new THREE.Mesh(glassShape, new THREE.MeshStandardMaterial({ color: '#8ab4ff', transparent: true, opacity: 0.3 }));
  glass.position.set(0.4, 0.8, 0);
  const glassEdges = outline(glassShape, '#8ab4ff'); // kept out of the glass, so the raycast doesn't test it
  glassEdges.position.copy(glass.position);
  glass.name = 'the glass pane';
  const crate = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), solid(COLORS.orange));
  crate.position.set(1.8, 0.9, 0);
  crate.name = 'the crate';
  const targets = [front, glass, crate];
  for (const target of targets) target.updateMatrixWorld(); // the raycast comes before any render

  const tags = [
    [front, 'front box', COLORS.blue],
    [glass, 'glass', '#8ab4ff'],
    [crate, 'crate', COLORS.orange],
  ] as const;
  for (const [object, text, color] of tags) {
    const tag = label(text, color);
    tag.position.copy(object.position).add(new THREE.Vector3(0, 0.75, 0));
    scene.add(tag);
  }
  const ray = line(COLORS.red);
  const firstHit = ball(COLORS.white, 1, 0.07);
  scene.add(scanner, front, hiddenOutline, glass, glassEdges, crate, ray, firstHit);

  const readout = overlay(container, 'readout');
  const raycaster = new THREE.Raycaster(start, new THREE.Vector3(1, 0, 0));
  const hits = raycaster.intersectObjects(targets); // the same whether or not the box is hidden
  setLine(ray, start, start.clone().add(new THREE.Vector3(5, 0, 0)));
  firstHit.position.copy(hits[0].point);

  const show = (visible: boolean) => {
    front.visible = visible;
    hiddenOutline.visible = !visible;
    const again = raycaster.intersectObjects(targets);
    readout.textContent = [
      `front.visible = ${visible}`,
      ...again.map((hit, i) => `hits[${i}] ${hit.object.name.padEnd(16)} ${f(hit.distance).padEnd(5)} along the ray`),
    ].join('\n');
  };
  choiceButtons(overlay(container, 'controls'), [
    { html: '<code>front.visible = true</code>', select: () => show(true) },
    { html: '<code>front.visible = false</code>', select: () => show(false) },
  ]);
};
