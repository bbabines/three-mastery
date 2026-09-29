// Scenes for the clone semantics page. The README places each one with <div data-scene="name">.
import { buttonGroup, choiceButtons, collectResources, COLORS, fitModel, formatBytes, geometryBytes, label, overlay, slider } from '@harness/lesson';
import { loadModel, MODELS } from '@harness/models';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const hideAxes = (scene: THREE.Scene) => {
  scene.children.find((child) => child instanceof THREE.AxesHelper)!.visible = false; // it would poke through the model
};

const meshesUnder = (object: THREE.Object3D) => {
  const meshes: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>[] = [];
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) meshes.push(child);
  });
  return meshes;
};

export const recolor: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(1.7, 2.1, 3.5);
  controls.target.set(0, 1.25, 0);
  const readout = overlay(container, 'readout');
  readout.textContent = 'loading rack-parts.glb…';
  const bar = overlay(container, 'controls');
  hideAxes(scene);

  loadModel(MODELS.rackParts).then((gltf) => {
    const rack = fitModel(gltf.scene, 1.8, new THREE.Vector3(-0.8, 0.05, 0));
    const copy = rack.clone();
    copy.position.x = 0.8;
    scene.add(rack, copy);
    for (const [object, text] of [
      [rack, 'rack'],
      [copy, 'copy'],
    ] as const) {
      const tag = label(text, COLORS.white);
      tag.position.set(object.position.x, 2.05, 0.2);
      scene.add(tag);
    }

    const SAFETY = '(export)_flipdown_safety_4';
    const rackSafety = meshesUnder(rack.getObjectByName(SAFETY)!);
    const copySafety = meshesUnder(copy.getObjectByName(SAFETY)!);
    const loadedColors = new Map(rackSafety.map((mesh) => [mesh.material, mesh.material.color.clone()]));
    const sharedMaterials = copySafety.map((mesh) => mesh.material);

    // Puts both racks back as loaded: the shared colors, and the copy on the shared materials.
    const reset = () => {
      copySafety.forEach((mesh, i) => {
        if (mesh.material !== sharedMaterials[i]) mesh.material.dispose();
        mesh.material = sharedMaterials[i];
      });
      for (const [material, color] of loadedColors) material.color.copy(color);
    };
    const ORANGE = new THREE.Color(COLORS.orange);
    const shared = () => copySafety.filter((mesh, i) => mesh.material === rackSafety[i].material).length;
    const colorOf = (meshes: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>[]) =>
      meshes.every((mesh) => mesh.material.color.equals(ORANGE)) ? 'orange' : 'as loaded';

    const report = (code: string) => {
      readout.textContent = [
        code,
        `copy's safety:  ${colorOf(copySafety)}`,
        `rack's safety:  ${colorOf(rackSafety)}`,
        `same material as the rack's: ${shared()} of the copy safety's ${copySafety.length} Meshes`,
      ].join('\n');
    };

    choiceButtons(bar, [
      {
        html: '<code>rack.clone()</code>',
        select: () => {
          reset();
          report('const copy = rack.clone()');
        },
      },
      {
        html: 'recolor the copy',
        select: () => {
          reset();
          for (const mesh of copySafety) mesh.material.color.set(COLORS.orange);
          report("copySafety.traverse(… mesh.material.color.set('orange') …)");
        },
      },
      {
        html: 'own materials, then recolor',
        select: () => {
          reset();
          for (const mesh of copySafety) {
            mesh.material = mesh.material.clone();
            mesh.material.color.set(COLORS.orange);
          }
          report("copySafety.traverse(… mesh.material = mesh.material.clone(); ….color.set('orange') …)");
        },
      },
    ]);
  });
};

type How = 'clone' | 'materials' | 'geometry';

const HOW: Record<How, { button: string; code: string }> = {
  clone: { button: '<code>clone()</code>', code: 'copy = jcup.clone()' },
  materials: { button: '+ own materials', code: 'copy = jcup.clone(); each mesh.material = mesh.material.clone()' },
  geometry: { button: '+ own geometry too', code: "copy = jcup.clone(); clone each mesh's material and geometry" },
};

const SPOTS = [-0.7, 0, 0.7].flatMap((z) => [-0.7, 0, 0.7].map((x) => new THREE.Vector3(x, 0.05, z)));

export const copies: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0.4, 2.4, 3.2);
  controls.target.set(0, 0.2, 0);
  const readout = overlay(container, 'readout');
  readout.textContent = 'loading jcups.glb…';
  const bar = overlay(container, 'controls');
  hideAxes(scene);

  loadModel(MODELS.jcups).then((gltf) => {
    const jcup = fitModel(gltf.scene.getObjectByName('(export)_jcup')!, 0.55, SPOTS[0]);
    scene.add(jcup);
    const loadedColors = new Map(meshesUnder(jcup).map((mesh) => [mesh.material, mesh.material.color.clone()]));

    let how: How = 'clone';
    let count = 4;
    let made: THREE.Object3D[] = [];

    const update = () => {
      // Clear out the last set of copies, and dispose whatever they didn't share with the original.
      const original = collectResources(jcup);
      for (const old of made) {
        scene.remove(old);
        for (const mesh of meshesUnder(old)) {
          if (!original.materials.has(mesh.material)) mesh.material.dispose();
          if (!original.geometries.has(mesh.geometry)) mesh.geometry.dispose();
        }
      }
      for (const [material, color] of loadedColors) material.color.copy(color);

      made = [];
      for (let i = 0; i < count; i++) {
        const copy = jcup.clone();
        copy.position.copy(SPOTS[i + 1]);
        for (const mesh of meshesUnder(copy)) {
          if (how !== 'clone') mesh.material = mesh.material.clone();
          if (how === 'geometry') mesh.geometry = mesh.geometry.clone();
        }
        made.push(copy);
        scene.add(copy);
      }
      // One color per J-cup: the original first, then each copy.
      [jcup, ...made].forEach((object, i) => {
        for (const mesh of meshesUnder(object)) mesh.material.color.setHSL(i / (count + 1), 0.7, 0.5);
      });

      const resources = { meshes: 0, geometries: new Set<THREE.BufferGeometry>(), materials: new Set<THREE.Material>() };
      for (const object of [jcup, ...made]) {
        const found = collectResources(object);
        resources.meshes += meshesUnder(object).length;
        for (const geometry of found.geometries) resources.geometries.add(geometry);
        for (const material of found.materials) resources.materials.add(material);
      }
      let bytes = 0;
      for (const geometry of resources.geometries) bytes += geometryBytes(geometry);
      readout.textContent = [
        HOW[how].code,
        `then J-cup i's materials: color.setHSL(i / ${count + 1}, 0.7, 0.5)` + (how === 'clone' ? '   → all show the last color' : ''),
        `the original + ${count} copies: ${resources.meshes} Meshes (a draw call each), ` +
          `${resources.geometries.size} geometries, ${resources.materials.size} materials`,
        `vertex data on the GPU: ${formatBytes(bytes)}`,
      ].join('\n');
    };

    choiceButtons(
      buttonGroup(bar),
      (Object.keys(HOW) as How[]).map((name) => ({
        html: HOW[name].button,
        select: () => {
          how = name;
          update();
        },
      })),
    );
    slider(bar, 'Copies', { min: 0, max: 8, step: 1, value: count }, (value) => {
      count = value;
      update();
    });
  });
};
