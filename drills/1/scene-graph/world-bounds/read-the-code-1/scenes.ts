// Scenes for the world-space bounds page. The README places each one with <div data-scene="name">.
import { choiceButtons, COLORS, fitModel, formatNumber, overlay, slider } from '@harness/lesson';
import { loadModel, MODELS } from '@harness/models';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const hideAxes = (scene: THREE.Scene) => {
  scene.children.find((child) => child instanceof THREE.AxesHelper)!.visible = false; // it would poke through the model
};

const size = new THREE.Vector3();
const sizeOf = (box: THREE.Box3) => {
  box.getSize(size);
  return `${formatNumber(size.x)} wide, ${formatNumber(size.y)} tall, ${formatNumber(size.z)} deep`;
};

export const whichBox: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(2.9, 2.3, 3.1);
  controls.target.set(0, 1.1, 0);
  const readout = overlay(container, 'readout');
  readout.textContent = 'loading rack-parts.glb…';
  const bar = overlay(container, 'controls');
  hideAxes(scene);

  loadModel(MODELS.rackParts).then((gltf) => {
    const rack = gltf.scene;
    const holder = fitModel(rack, 2, new THREE.Vector3(0, 0.05, 0));
    scene.add(holder);
    holder.updateMatrixWorld();
    const tube = rack.getObjectByName('(mat|main)_Tube_90001')!; // a Group of two Meshes
    const tubeMesh = tube.children[1] as THREE.Mesh;
    const pullUpBar = rack.getObjectByName('(export)_fat')!;

    const box = new THREE.Box3();
    const worldBox = new THREE.Box3Helper(box, COLORS.yellow);
    const geometryBox = new THREE.Box3Helper(new THREE.Box3(), COLORS.red); // drawn as if its numbers were in the world
    scene.add(worldBox, geometryBox);

    // Each button starts from the rack as loaded, measures, and shows what it got.
    const measure = (lines: () => string[], showGeometryBox = false) => () => {
      pullUpBar.visible = true;
      geometryBox.visible = showGeometryBox;
      readout.textContent = lines().join('\n');
    };

    choiceButtons(bar, [
      {
        html: 'the rack',
        select: measure(() => {
          box.setFromObject(rack);
          return ['new Box3().setFromObject(rack)', `→ ${sizeOf(box)}`, 'every Mesh in the rack, in the world (yellow)'];
        }),
      },
      {
        html: 'the tube',
        select: measure(() => {
          box.setFromObject(tube);
          return ['new Box3().setFromObject(tube)', `→ ${sizeOf(box)}`, 'the tube Group and its two Meshes, in the world (yellow)'];
        }),
      },
      {
        html: "the tube's <code>geometry.boundingBox</code>",
        select: measure(() => {
          box.setFromObject(tube);
          tubeMesh.geometry.computeBoundingBox();
          geometryBox.box.copy(tubeMesh.geometry.boundingBox!);
          return [
            'tube.children[1].geometry.boundingBox',
            `→ ${sizeOf(geometryBox.box)} (red)`,
            `measured from the Mesh itself, before the tube node's ×${formatNumber(tube.scale.y, 3)} scale`,
          ];
        }, true),
      },
      {
        html: 'the rack, bar hidden',
        select: measure(() => {
          pullUpBar.visible = false;
          box.setFromObject(rack);
          const shown = new THREE.Box3();
          rack.traverseVisible((object) => {
            if ((object as THREE.Mesh).isMesh) shown.expandByObject(object);
          });
          return [
            'pullUpBar.visible = false; new Box3().setFromObject(rack)',
            `→ ${sizeOf(box)}: the hidden bar still counts (yellow)`,
            `visible Meshes only → ${sizeOf(shown)}`,
          ];
        }),
      },
    ]);
  });
};

export const tilt: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3.4, 1.6, 1.3);
  controls.target.set(0, 1, 0);
  const readout = overlay(container, 'readout');
  readout.textContent = 'loading jcups.glb…';
  const bar = overlay(container, 'controls');
  hideAxes(scene);

  loadModel(MODELS.jcups).then((gltf) => {
    // One J-cup from the file, blown up and turned around its own middle.
    const part = gltf.scene.getObjectByName('(export)_jcup')!;
    const holder = fitModel(part, 1.3);
    holder.position.sub(new THREE.Box3().setFromObject(holder).getCenter(new THREE.Vector3()));
    const jcup = new THREE.Group();
    jcup.position.set(0, 1, 0);
    jcup.add(holder);
    scene.add(jcup);

    const loose = new THREE.Box3();
    const tight = new THREE.Box3();
    scene.add(new THREE.Box3Helper(loose, COLORS.yellow), new THREE.Box3Helper(tight, COLORS.green));
    const looseSize = new THREE.Vector3();
    const tightSize = new THREE.Vector3();

    const turn = (degrees: number) => {
      jcup.rotation.x = THREE.MathUtils.degToRad(degrees);
      jcup.updateMatrixWorld();
      loose.setFromObject(jcup).getSize(looseSize);
      tight.setFromObject(jcup, true).getSize(tightSize);
      readout.innerHTML = [
        `jcup.rotation.x = ${formatNumber(jcup.rotation.x)}   // ${degrees}°`,
        `<span style="color:${COLORS.yellow}">new Box3().setFromObject(jcup)      </span>  ${formatNumber(looseSize.y)} tall, ${formatNumber(looseSize.z)} deep`,
        `<span style="color:${COLORS.green}">new Box3().setFromObject(jcup, true)</span>  ${formatNumber(tightSize.y)} tall, ${formatNumber(tightSize.z)} deep`,
      ].join('\n');
    };
    slider(bar, 'Turn the J-cup', { min: 0, max: 90, step: 15, value: 30 }, turn);
    turn(30);
  });
};
