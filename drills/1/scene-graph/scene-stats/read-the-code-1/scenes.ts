// Scenes for the scene statistics page. The README places each one with <div data-scene="name">.
import { buttonGroup, choiceButtons, fitModel, overlay, slider } from '@harness/lesson';
import { loadModel, MODELS } from '@harness/models';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const BOLT_SCALE = 2.2;
const BOLT_SPACING = 0.17;

// The page's counting code, run on everything under `roots`.
function countUnder(roots: THREE.Object3D[]) {
  let meshes = 0;
  let triangles = 0;
  const geometries = new Set<string>();
  const materials = new Set<string>();
  const textures = new Set<string>();
  for (const root of roots) {
    root.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      meshes += 1;
      const { index, attributes } = object.geometry;
      triangles += (index ? index.count : attributes.position.count) / 3;
      geometries.add(object.geometry.uuid);
      for (const material of [object.material].flat() as THREE.Material[]) {
        materials.add(material.uuid);
        for (const value of Object.values(material)) if (value instanceof THREE.Texture) textures.add(value.uuid);
      }
    });
  }
  return { meshes, triangles, geometries: geometries.size, materials: materials.size, textures: textures.size };
}

export const audit: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  camera.position.set(0.6, 2.1, 5.0);
  controls.target.set(0.4, 1.15, 0);
  const readout = overlay(container, 'readout');
  readout.textContent = 'loading rack-parts.glb and jcups.glb…';
  const bar = overlay(container, 'controls');
  // The grid and axes are drawn too, so they'd add draw calls the counts don't show.
  for (const child of scene.children) if (child instanceof THREE.GridHelper || child instanceof THREE.AxesHelper) child.visible = false;

  Promise.all([loadModel(MODELS.rackParts), loadModel(MODELS.jcups)]).then(([rackFile, jcupsFile]) => {
    const models = {
      rack: fitModel(rackFile.scene, 2, new THREE.Vector3(-0.6, 0.05, 0)),
      'J-cups': fitModel(jcupsFile.scene, 2.2, new THREE.Vector3(-0.6, 0.05, 0)),
    };
    let shown: keyof typeof models = 'rack';

    // Up to 100 extra bolts, every one a new Mesh sharing the rack's own bolt geometry and material.
    const bolt = rackFile.scene.getObjectByName('(mat|hardware)_Solid036001') as THREE.Mesh;
    bolt.geometry.computeBoundingBox();
    const standHeight = 0.05 - bolt.geometry.boundingBox!.min.z * BOLT_SCALE; // standing up, its lowest point on y = 0.05
    const spare: THREE.Mesh[] = [];
    for (let i = 0; i < 100; i++) {
      const copy = new THREE.Mesh(bolt.geometry, bolt.material);
      copy.rotation.x = -Math.PI / 2;
      copy.scale.setScalar(BOLT_SCALE);
      copy.position.set(0.3 + (i % 10) * BOLT_SPACING, standHeight, -0.77 + Math.floor(i / 10) * BOLT_SPACING);
      spare.push(copy);
    }
    const bolts = new THREE.Group();
    scene.add(bolts);

    let extra = 0;
    let counts = countUnder([]);
    const show = () => {
      readout.textContent = [
        `the ${shown} + ${extra} extra bolts, each new Mesh(boltGeometry, boltMaterial)`,
        `meshes ${counts.meshes}   triangles ${counts.triangles.toLocaleString('en-US')}`,
        `unique by uuid: geometries ${counts.geometries}   materials ${counts.materials}   textures ${counts.textures}`,
        `renderer.info.render.calls   ${renderer.info.render.calls}`,
      ].join('\n');
    };
    const update = () => {
      scene.remove(models.rack, models['J-cups']);
      scene.add(models[shown]);
      bolts.clear();
      if (extra > 0) bolts.add(...spare.slice(0, extra)); // add() with nothing to add logs an error
      counts = countUnder([models[shown], bolts]); // counted once per change, not every frame
      show();
    };
    // The draw calls come from the last render, so the readout refreshes every frame.
    onFrame(show);

    choiceButtons(
      buttonGroup(bar),
      (['rack', 'J-cups'] as const).map((name) => ({
        html: `the ${name}`,
        select: () => {
          shown = name;
          update();
        },
      })),
    );
    slider(bar, 'Extra bolts', { min: 0, max: 100, step: 10, value: 0 }, (value) => {
      extra = value;
      update();
    });
  });
};
