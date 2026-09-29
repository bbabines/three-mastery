// Scenes for the decode, upload, compile page. The README places each one with <div data-scene="name">.
import { afterNextRender, choiceButtons, collectResources, COLORS, fitModel, label, overlay } from '@harness/lesson';
import { loadModel, MODELS } from '@harness/models';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

// What the renderer holds on the GPU right now. renderer.info.programs lists every compiled program.
function gpuState(renderer: THREE.WebGLRenderer) {
  return {
    geometries: renderer.info.memory.geometries,
    textures: renderer.info.memory.textures,
    programs: new Set(renderer.info.programs ?? []),
  };
}
type GpuState = ReturnType<typeof gpuState>;
const newPrograms = (before: GpuState, after: GpuState) => [...after.programs].filter((program) => !before.programs.has(program)).length;
const plural = (n: number, word: string) => `${n} ${n === 1 ? word : word === 'geometry' ? 'geometries' : `${word}s`}`;

// The camera both scenes use for the rack.
function stage({ scene, camera, controls }: Parameters<SceneSetup>[0]) {
  camera.position.set(2.2, 1.5, 3.1);
  controls.target.set(0.25, 1.1, 0);
  scene.children.find((child) => child instanceof THREE.AxesHelper)!.visible = false; // it would poke through the rack
}

export const warmUp: SceneSetup = (harness) => {
  const { scene, camera, container, renderer, onFrame } = harness;
  stage(harness);
  // A base plate under the rack, lit like the rack. Drawing it and the label once now does the
  // renderer's own setup, including what it needs for any lit material, so the counts below are
  // the model's alone.
  const plate = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.06, 1.6), new THREE.MeshStandardMaterial({ color: '#3a3f4a' }));
  plate.position.y = 0.04;
  const waitingTag = label('loaded, not in the scene', COLORS.gray);
  waitingTag.position.set(0, 1, 0);
  scene.add(plate, waitingTag);
  renderer.render(scene, camera);
  const empty = gpuState(renderer);

  const readout = overlay(container, 'readout');
  readout.textContent = 'loading rack-parts.glb…';
  const measureLater = afterNextRender(onFrame);

  loadModel(MODELS.rackParts).then((gltf) => {
    const model = fitModel(gltf.scene, 2, new THREE.Vector3(0, 0.07, 0));
    const { geometries, materials, textures } = collectResources(gltf.scene);
    let attempt = 0;

    // Takes the model out of the scene and frees everything it put on the GPU, keeping the loaded
    // objects, so each button starts from a model that has just loaded.
    const reset = () => {
      scene.remove(model);
      for (const resource of [...geometries, ...materials, ...textures]) resource.dispose();
    };

    const onGpu = () => {
      const now = gpuState(renderer);
      return (
        `GPU:  ${plural(newPrograms(empty, now), 'shader program')}   ` +
        `${now.textures - empty.textures} of ${textures.size} textures   ` +
        `${now.geometries - empty.geometries} of ${geometries.size} geometries`
      );
    };

    const run = async (steps: { compile: boolean; texture: boolean; add: boolean }, code: string, before: string) => {
      const mine = ++attempt;
      reset();
      waitingTag.visible = !steps.add;
      readout.textContent = `ran:  ${code}   ${before}\n…`;
      if (steps.compile) await renderer.compileAsync(model, camera, scene);
      if (mine !== attempt) return;
      if (steps.texture) for (const texture of textures) renderer.initTexture(texture);

      if (!steps.add) {
        const now = gpuState(renderer);
        const still = [
          ...(newPrograms(empty, now) === 0 ? ['compile its shaders'] : []),
          ...(now.textures - empty.textures < textures.size ? [`upload ${plural(textures.size, 'texture')}`] : []),
          `upload ${plural(geometries.size, 'geometry')}`,
        ];
        readout.textContent = [`ran:  ${code}   ${before}`, onGpu(), `left for the first render: ${still.join(', ')}`].join('\n');
        return;
      }

      const start = gpuState(renderer);
      scene.add(model);
      measureLater(() => {
        if (mine !== attempt) return;
        const end = gpuState(renderer);
        const did = [
          ...(newPrograms(start, end) > 0 ? [`compiled ${plural(newPrograms(start, end), 'program')}`] : []),
          ...(end.textures > start.textures ? [`uploaded ${plural(end.textures - start.textures, 'texture')}`] : []),
          `uploaded ${plural(end.geometries - start.geometries, 'geometry')}`,
        ];
        readout.textContent = [`ran:  ${code}   ${before}`, onGpu(), `the first render ${did.join(', ')}`].join('\n');
      });
    };

    const none = { compile: false, texture: false, add: false };
    choiceButtons(overlay(container, 'controls'), [
      { html: 'loadAsync', select: () => run(none, "await loader.loadAsync('rack-parts.glb')", 'and nothing else') },
      {
        html: '+ compileAsync',
        select: () => run({ ...none, compile: true }, 'await renderer.compileAsync(model, camera, scene)', 'after loading'),
      },
      {
        html: '+ initTexture',
        select: () => run({ ...none, compile: true, texture: true }, 'renderer.initTexture(texture)', 'for each, after compileAsync'),
      },
      {
        html: '+ scene.add',
        select: () => run({ compile: true, texture: true, add: true }, 'scene.add(model)', 'after compileAsync and initTexture'),
      },
      { html: 'scene.add, cold', select: () => run({ ...none, add: true }, 'scene.add(model)', 'straight after loading') },
    ]);
  });
};

export const variants: SceneSetup = (harness) => {
  const { scene, camera, container, renderer, onFrame } = harness;
  stage(harness);
  renderer.render(scene, camera); // compiles the grid's own program now, so the counts below are the rack's
  const readout = overlay(container, 'readout');
  readout.textContent = 'loading rack-parts.glb…';
  const measureLater = afterNextRender(onFrame);
  const sun = new THREE.DirectionalLight(0xffffff, 3);
  sun.position.set(2, 4, 3);

  loadModel(MODELS.rackParts).then((gltf) => {
    scene.add(fitModel(gltf.scene, 2, new THREE.Vector3(0, 0.07, 0)));
    const { materials } = collectResources(gltf.scene);
    const meshes: THREE.Mesh[] = [];
    gltf.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) meshes.push(object);
    });
    const loaded = new Map(meshes.map((mesh) => [mesh, mesh.material]));
    const roughness = new Map([...materials].map((material) => [material, (material as THREE.MeshStandardMaterial).roughness]));
    const clearcoat = new THREE.MeshPhysicalMaterial({ color: '#1e3a8a', roughness: 0.4, clearcoat: 1, side: THREE.DoubleSide });
    const seen = new Set<string>();

    const pick = (name: string, code: string, apply: () => void) => () => {
      for (const [mesh, material] of loaded) mesh.material = material;
      for (const [material, value] of roughness) (material as THREE.MeshStandardMaterial).roughness = value;
      scene.remove(sun);
      const before = gpuState(renderer);
      apply();
      const again = seen.has(name);
      seen.add(name);
      readout.textContent = `ran:  ${code}\n…`;
      measureLater(() => {
        const compiled = newPrograms(before, gpuState(renderer));
        readout.textContent = [
          `ran:  ${code}`,
          `the next render compiled ${plural(compiled, 'new shader program')}`,
          compiled > 0
            ? 'the first time this combination was drawn'
            : again
              ? 'drawn before: its programs were already built'
              : 'only numbers changed: the same programs draw it',
        ].join('\n');
      });
    };

    choiceButtons(overlay(container, 'controls'), [
      { html: 'as loaded', select: pick('loaded', '// the materials as loaded', () => {}) },
      {
        html: 'glossy',
        select: pick('glossy', 'for (const m of materials) m.roughness = 0.15', () => {
          for (const material of materials) (material as THREE.MeshStandardMaterial).roughness = 0.15;
        }),
      },
      {
        html: 'clearcoat',
        select: pick('clearcoat', 'for (const mesh of meshes) mesh.material = clearcoat', () => {
          for (const mesh of meshes) mesh.material = clearcoat;
        }),
      },
      { html: 'add a sun', select: pick('sun', 'scene.add(sun)   // a DirectionalLight', () => scene.add(sun)) },
    ]);
  });
};
