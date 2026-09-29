// Scenes for the InstancedMesh page. The README places each one with <div data-scene="name">.
import { choiceButtons, COLORS, formatNumber, label, line, overlay, pointer, setLine, slider, sunlight } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const COLUMNS = 6;
const ROWS = 3;
const PULLED = 4; // the bin the slider pulls out: bottom row, fifth from the left

const spot = (i: number) => new THREE.Vector3(-1.25 + 0.5 * (i % COLUMNS), 0.4 + 0.5 * Math.floor(i / COLUMNS), 0);

export const pull: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(4.6, 2.8, 4.0);
  controls.target.set(0.6, 0.8, 1.1);
  sunlight(scene, new THREE.Vector3(3, 5, 4), 0.6, 2.2);

  // Shelves under each row, as plain meshes, so the bins have somewhere to sit.
  const shelfMaterial = new THREE.MeshStandardMaterial({ color: COLORS.gray });
  for (let r = 0; r < ROWS; r++) {
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.04, 0.5), shelfMaterial);
    shelf.position.set(0, 0.23 + 0.5 * r, 0);
    scene.add(shelf);
  }

  const count = COLUMNS * ROWS;
  const bins = new THREE.InstancedMesh(new THREE.BoxGeometry(0.36, 0.3, 0.36), new THREE.MeshStandardMaterial({ color: 0xffffff }), count);
  const matrix = new THREE.Matrix4();
  const base = new THREE.Color(COLORS.blue);
  const found = new THREE.Color(COLORS.yellow);
  for (let i = 0; i < count; i++) {
    bins.setMatrixAt(i, matrix.makeTranslation(spot(i)));
    bins.setColorAt(i, base); // before the first render, so the shader is built with colors from the start
  }
  bins.computeBoundingSphere();
  const home = bins.boundingSphere!.clone(); // the sphere as it was worked out, with every bin at home
  scene.add(bins);

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 24, 12),
    new THREE.MeshBasicMaterial({ color: COLORS.white, wireframe: true, transparent: true, opacity: 0.12 }),
  );
  scene.add(sphere);

  const scanner = pointer(COLORS.red, 0.6);
  const scannerTag = label('scanner', COLORS.red);
  const beam = line(COLORS.red);
  scene.add(scanner, scannerTag, beam);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const raycaster = new THREE.Raycaster();
  let mode = 0;
  let pulled = 0; // starts at home, so the first render sends the rack as built
  let drawnZ = 0; // where the GPU's copy has bin 4, as last sent

  const code = [
    'bins.setMatrixAt(4, m)',
    'bins.setMatrixAt(4, m); bins.instanceMatrix.needsUpdate = true',
    'bins.setMatrixAt(4, m); bins.instanceMatrix.needsUpdate = true\nbins.computeBoundingSphere()',
  ];

  const update = () => {
    const target = spot(PULLED).add(new THREE.Vector3(0, 0, pulled));
    bins.setMatrixAt(PULLED, matrix.makeTranslation(target));
    if (mode >= 1) {
      bins.instanceMatrix.needsUpdate = true;
      drawnZ = pulled;
    }
    if (mode >= 2) bins.computeBoundingSphere();
    else bins.boundingSphere!.copy(home); // never recomputed, so it's still the one from the start

    sphere.position.copy(bins.boundingSphere!.center);
    sphere.scale.setScalar(bins.boundingSphere!.radius);

    // The scanner sits above and to the right of bin 4's new spot, aimed straight at it.
    const from = target.clone().add(new THREE.Vector3(1.2, 1.1, -0.6));
    scanner.position.copy(from);
    scanner.lookAt(target);
    scannerTag.position.copy(from).add(new THREE.Vector3(0, 0.35, 0));
    raycaster.set(from, target.clone().sub(from).normalize());
    bins.updateMatrixWorld();
    const hit = raycaster.intersectObject(bins)[0];
    setLine(beam, from, hit ? hit.point : from.clone().addScaledVector(raycaster.ray.direction, 3.5));

    for (let i = 0; i < count; i++) bins.setColorAt(i, hit?.instanceId === i ? found : base);
    bins.instanceColor!.needsUpdate = true;

    const outside = target.distanceTo(bins.boundingSphere!.center) > bins.boundingSphere!.radius;
    readout.textContent = [
      code[mode],
      `bin 4 in the matrix array: z ${formatNumber(pulled)}   on screen: z ${formatNumber(drawnZ)}${mode === 0 && pulled !== drawnZ ? ', not sent' : ''}`,
      hit
        ? `scanner hits instanceId ${hit.instanceId}: bins.setColorAt(${hit.instanceId}, yellow)`
        : `scanner: no hit${outside ? ', since bin 4 is outside the bounding sphere' : ''}`,
      `${count} bins, one draw call`,
    ].join('\n');
  };

  choiceButtons(
    controlsBar,
    ['<code>setMatrixAt</code> only', '+ <code>needsUpdate</code>', '+ <code>computeBoundingSphere()</code>'].map((html, i) => ({
      html,
      select: () => {
        mode = i;
        update();
      },
    })),
  );
  slider(controlsBar, 'Pull bin 4 out', { min: 0, max: 2.6, step: 0.2, value: pulled }, (value) => {
    pulled = value;
    update();
  });
};
