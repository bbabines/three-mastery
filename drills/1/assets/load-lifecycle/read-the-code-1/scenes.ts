// Scenes for the load lifecycle page. The README places each one with <div data-scene="name">.
import { choiceButtons, collectResources, COLORS, fitModel, outline, overlay } from '@harness/lesson';
import { gltfLoader, MODELS } from '@harness/models';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const MISSING = '/assets/models/missing.glb'; // no such file
const bytes = (n: number) => n.toLocaleString('en-US');

export const lifecycle: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  camera.position.set(2.6, 1.8, 4.1);
  controls.target.set(0.3, 1.25, 0);
  scene.children.find((child) => child instanceof THREE.AxesHelper)!.visible = false; // it would poke through the rack

  // A progress bar in front of where the model appears. The fill grows from its left end.
  const BAR_WIDTH = 2;
  const barFrame = outline(new THREE.BoxGeometry(BAR_WIDTH, 0.1, 0.1), COLORS.gray);
  barFrame.position.set(0, 0.12, -1.2);
  // A lit material like the model's, so the renderer's own setup for lit materials is done before any load.
  const fill = new THREE.Mesh(
    new THREE.BoxGeometry(BAR_WIDTH, 0.1, 0.1).translate(BAR_WIDTH / 2, 0, 0),
    new THREE.MeshStandardMaterial({ color: COLORS.green }),
  );
  fill.position.set(-BAR_WIDTH / 2, 0.12, -1.2);
  fill.scale.x = 0.001;
  scene.add(barFrame, fill);
  renderer.render(scene, camera); // puts the scene's own grid and bar on the GPU, so the counts below are the model's alone

  const readout = overlay(container, 'readout');
  const lines: string[] = [];
  const show = () => (readout.textContent = lines.join('\n'));

  let model: THREE.Object3D | undefined;
  let attempt = 0; // a newer click makes older loads' callbacks do nothing
  let framesUntilCount = -1; // counts down to the frame after the first render that drew the model
  let before = { geometries: 0, textures: 0, programs: 0 };
  const gpu = () => ({
    geometries: renderer.info.memory.geometries,
    textures: renderer.info.memory.textures,
    programs: renderer.info.programs?.length ?? 0,
  });

  const load = (url: string, name: string) => {
    const mine = ++attempt;
    if (model) {
      // Free the last copy on the GPU too, so the next first render has everything to do again.
      scene.remove(model);
      const { geometries, materials, textures } = collectResources(model);
      for (const resource of [...geometries, ...materials, ...textures]) resource.dispose();
      model = undefined;
    }
    framesUntilCount = -1;
    fill.scale.x = 0.001;
    let reports = 0;
    lines.length = 0;
    lines.push(`const gltf = await loader.loadAsync('${name}', onProgress)`, 'progress   waiting for the first bytes…');
    show();

    gltfLoader()
      .loadAsync(url, (event) => {
        if (mine !== attempt) return;
        reports++;
        const share = event.lengthComputable ? event.loaded / event.total : 0;
        fill.scale.x = Math.max(share, 0.001);
        lines[1] = `progress   ${bytes(event.loaded)} of ${bytes(event.total)} bytes (${Math.round(share * 100)}%), ${reports} report${reports === 1 ? '' : 's'}`;
        show();
      })
      .then(
        (gltf) => {
          if (mine !== attempt) return;
          let meshes = 0;
          gltf.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) meshes++;
          });
          before = gpu();
          lines.push(`done       ${meshes} meshes built, nothing on the GPU yet`);
          model = fitModel(gltf.scene, 2, new THREE.Vector3(0, 0.05, 0));
          scene.add(model);
          framesUntilCount = 2; // this frame renders it; the next one can count what that render did
          show();
        },
        (error: Error) => {
          if (mine !== attempt) return;
          lines.push(`failed     ${error.name}: ${error.message}`);
          if (error instanceof SyntaxError) lines.push('           the dev server sent back index.html for the missing file');
          show();
        },
      );
  };

  onFrame(() => {
    if (framesUntilCount < 0 || --framesUntilCount > 0) return;
    framesUntilCount = -1;
    const after = gpu();
    lines.push(
      `drawn      the first render sent ${after.geometries - before.geometries} geometries and ${after.textures - before.textures} textures to the GPU`,
      `           and compiled ${after.programs - before.programs} shader programs`,
    );
    show();
  });

  choiceButtons(overlay(container, 'controls'), [
    { html: "<code>loadAsync('rack-parts.glb')</code>", select: () => load(MODELS.rackParts, 'rack-parts.glb') },
    { html: "<code>loadAsync('missing.glb')</code>", select: () => load(MISSING, 'missing.glb') },
  ]);
};
