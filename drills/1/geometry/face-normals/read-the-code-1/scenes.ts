// Scenes for the face normals page. The README places each one with <div data-scene="name">.
import { arrow, choiceButtons, COLORS, formatVector, label, line, overlay, pointer, setArrow, setLine, slider, sunlight } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

// A triangle lying flat with its front facing up, so the arrows sticking out of it stand up.
const CORNERS = [new THREE.Vector3(-1.1, 0, 0.6), new THREE.Vector3(1.1, 0, 0.6), new THREE.Vector3(0, 0, -0.9)];
const X_AXIS = new THREE.Vector3(1, 0, 0);
const Z_AXIS = new THREE.Vector3(0, 0, 1);

export const faceVsVertex: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0.9, 2.4, 2.7);
  controls.target.set(0, 0.75, -0.2);
  sunlight(scene, new THREE.Vector3(-4, 2.5, 1), 0.25); // low from the left, so leaning normals change the shading

  const holder = new THREE.Group();
  holder.position.y = 0.5;
  scene.add(holder);

  const geometry = new THREE.BufferGeometry().setFromPoints(CORNERS);
  geometry.setIndex([0, 1, 2]);
  const normal = new THREE.BufferAttribute(new Float32Array(9), 3);
  geometry.setAttribute('normal', normal);
  const material = new THREE.MeshStandardMaterial({ color: COLORS.blue });
  holder.add(new THREE.Mesh(geometry, material));

  const center = CORNERS[0].clone().add(CORNERS[1]).add(CORNERS[2]).divideScalar(3);
  const face = new THREE.Vector3();
  THREE.Triangle.getNormal(CORNERS[0], CORNERS[1], CORNERS[2], face);
  const faceArrow = arrow(COLORS.green);
  setArrow(faceArrow, center, face.clone().multiplyScalar(0.9));
  const faceTag = label('face normal', COLORS.green);
  faceTag.position.copy(center).addScaledVector(face, 0.9).add(new THREE.Vector3(-0.45, 0.15, 0));
  const averageArrow = arrow(COLORS.orange);
  const averageTag = label('average', COLORS.orange);
  const vertexArrows = CORNERS.map(() => arrow(COLORS.white));
  holder.add(faceArrow, faceTag, averageArrow, averageTag, ...vertexArrows);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  let bend = 0;
  const bent = CORNERS.map(() => new THREE.Vector3());
  const average = new THREE.Vector3();

  const update = () => {
    // Bend the stored vertex normals, as smoothing or a hand edit would. The corners don't move.
    const angle = THREE.MathUtils.degToRad(bend);
    bent[0].set(0, 1, 0).applyAxisAngle(Z_AXIS, angle); // leans left
    bent[1].set(0, 1, 0).applyAxisAngle(Z_AXIS, -angle * 0.3); // leans a little right
    bent[2].set(0, 1, 0).applyAxisAngle(X_AXIS, -angle * 0.8); // leans back
    bent.forEach((n, i) => {
      normal.setXYZ(i, n.x, n.y, n.z);
      setArrow(vertexArrows[i], CORNERS[i], n.clone().multiplyScalar(0.6));
    });
    normal.needsUpdate = true;

    average.copy(bent[0]).add(bent[1]).add(bent[2]).normalize();
    const start = center.clone().add(new THREE.Vector3(0.35, 0, 0)); // beside the face normal, not on it
    setArrow(averageArrow, start, average.clone().multiplyScalar(0.9));
    averageTag.position.copy(start).addScaledVector(average, 0.9).add(new THREE.Vector3(0.3, 0.12, 0));
    averageArrow.visible = averageTag.visible = bend > 0;

    readout.textContent = [
      `Triangle.getNormal(a, b, c, n)    ${formatVector(face, 2)}   never moves`,
      `average of the 3 vertex normals   ${formatVector(average, 2)}`,
      material.flatShading
        ? 'material.flatShading = true: lighting ignores the vertex normals'
        : 'material.flatShading = false: lighting reads the vertex normals',
    ].join('\n');
  };

  choiceButtons(controlsBar, [
    {
      html: '<code>flatShading: false</code>',
      select: () => {
        material.flatShading = false;
        material.needsUpdate = true;
        update();
      },
    },
    {
      html: '<code>flatShading: true</code>',
      select: () => {
        material.flatShading = true;
        material.needsUpdate = true;
        update();
      },
    },
  ]);
  slider(controlsBar, 'bend vertex normals', { min: 0, max: 60, step: 5, value: bend }, (value) => {
    bend = value;
    update();
  });
};

const SCANNER = new THREE.Vector3(-2.3, 0.9, 1.4);

export const decal: SceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  camera.position.set(-0.6, 1.8, 3.5);
  controls.target.set(-0.7, 1.3, 0.4);
  sunlight(scene, new THREE.Vector3(2, 4, 3), 0.6);

  // A faceted rock: IcosahedronGeometry has no shared vertices, so every face is flat.
  const rock = new THREE.Mesh(new THREE.IcosahedronGeometry(0.85, 0), new THREE.MeshStandardMaterial({ color: COLORS.gray, flatShading: true }));
  rock.position.set(0, 1.2, 0);
  rock.rotation.x = 0.4;
  scene.add(rock);

  const raycaster = new THREE.Raycaster(SCANNER, rock.position.clone().sub(SCANNER).normalize());
  const scanner = pointer(COLORS.red, 0.6);
  scanner.position.copy(SCANNER);
  scanner.lookAt(rock.position);
  const scannerTag = label('scanner', COLORS.red);
  scannerTag.position.copy(SCANNER).add(new THREE.Vector3(0, 0.35, 0));
  const beam = line(COLORS.red);

  const sticker = new THREE.Mesh(
    new THREE.PlaneGeometry(0.4, 0.4),
    new THREE.MeshBasicMaterial({ color: COLORS.yellow, side: THREE.DoubleSide }),
  );
  const normalArrow = arrow(COLORS.green);
  scene.add(scanner, scannerTag, beam, sticker, normalArrow);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const choices = [
    { html: '<code>hit.face.normal</code> as is', code: 'n = hit.face.normal.clone()' },
    {
      html: '<code>getNormalMatrix(rock.matrixWorld)</code>',
      code: 'n = hit.face.normal.clone()\n  .applyNormalMatrix(new Matrix3().getNormalMatrix(rock.matrixWorld))',
    },
    { html: '<code>rock.normalMatrix</code>', code: 'n = hit.face.normal.clone().applyNormalMatrix(rock.normalMatrix)' },
  ];
  let choice = 0;
  choiceButtons(
    controlsBar,
    choices.map((item, i) => ({ html: item.html, select: () => (choice = i) })),
  );
  slider(controlsBar, 'turn rock', { min: 0, max: 360, step: 15, value: 30 }, (value) => {
    rock.rotation.y = THREE.MathUtils.degToRad(value);
  });
  rock.rotation.y = THREE.MathUtils.degToRad(30);

  const n = new THREE.Vector3();
  const world = new THREE.Vector3();
  const normalMatrix = new THREE.Matrix3();

  onFrame(() => {
    rock.updateMatrixWorld(); // the slider may have just turned it
    const hit = raycaster.intersectObject(rock)[0];
    if (!hit?.face) return;
    setLine(beam, SCANNER, hit.point);

    normalMatrix.getNormalMatrix(rock.matrixWorld);
    world.copy(hit.face.normal).applyNormalMatrix(normalMatrix);
    n.copy(hit.face.normal);
    if (choice === 1) n.copy(world);
    if (choice === 2) n.applyNormalMatrix(rock.normalMatrix); // as the last render left it, for this camera

    sticker.position.copy(hit.point).addScaledVector(n, 0.01);
    sticker.lookAt(hit.point.clone().add(n));
    setArrow(normalArrow, hit.point, n.clone().multiplyScalar(0.7));
    const flush = n.angleTo(world) < THREE.MathUtils.degToRad(1);
    normalArrow.setColor(flush ? COLORS.green : COLORS.red);

    const space = choice === 1 ? 'in the world' : choice === 2 ? 'camera space: orbit and watch it change' : 'measured from the rock itself';
    readout.textContent = [
      choices[choice].code,
      `n  ${formatVector(n, 2).padEnd(20)} ${space}`,
      `decal.lookAt(hit.point.clone().add(n)): ${flush ? 'flush with the face' : 'tilted, not flush'}`,
    ].join('\n');
  });
};
