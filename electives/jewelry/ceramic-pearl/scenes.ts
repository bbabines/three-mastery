import { buttonGroup, choiceButtons, COLORS, fitModel, formatNumber, label, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { onLeave } from '@harness/teardown';
import * as THREE from 'three';
import type { GLTF } from 'three/addons/loaders/GLTFLoader.js';
import { environment, isGem, jewelryStage, loadSpring, MISSING_REFERENCE, mirrorStandIn } from '../shared';
import { CERAMICS, ceramicMaterial, PEARL, pearlMaterial } from './materials';

const count = (n: number) => n.toLocaleString('en-US');
const trianglesOf = (geometry: THREE.BufferGeometry) => (geometry.index ?? geometry.getAttribute('position')).count / 3;

// Calls `ready` once the page's assets have loaded, unless the page was left first. Shows the
// missing-files note in the readout when the reference files aren't on this machine.
function whenLoaded<T>(container: HTMLElement, readout: HTMLElement, load: Promise<T>, ready: (value: T) => void) {
  let left = false;
  onLeave(container, () => {
    left = true;
  });
  readout.textContent = 'Loading…';
  load.then(
    (value) => {
      if (!left) ready(value);
    },
    () => {
      readout.textContent = MISSING_REFERENCE;
    },
  );
}

// Copies of some of Spring's meshes, each placed where it sits in the whole ring, in one group.
// The copies share the loaded geometry; `material` replaces the file's when given.
function springParts(gltf: GLTF, names: string[], material?: THREE.Material) {
  gltf.scene.updateMatrixWorld(true);
  const group = new THREE.Group();
  gltf.scene.traverse((child) => {
    if (!(child instanceof THREE.Mesh) || !names.includes(child.name)) return;
    const copy = new THREE.Mesh(child.geometry, material ?? child.material);
    copy.matrixAutoUpdate = false;
    copy.matrix.copy(child.matrixWorld);
    group.add(copy);
  });
  return group;
}

// Every texture a material uses, by the name of the slot it's in (map, normalMap, bumpMap, …).
const textureSlots = (material: THREE.Material) =>
  Object.entries(material).filter(([, value]) => value instanceof THREE.Texture).map(([slot]) => slot);

const hex = (color: THREE.Color) => `#${color.getHexString()}`;

// Evidence: Spring as three.js loads it, one kind of part at a time, with each material's
// settings read from the loaded file.
export const reference: SceneSetup = (harness) => {
  const { scene, camera, controls, container, renderer } = harness;
  jewelryStage(harness);
  camera.position.set(-0.6, 4.6, -2.4);
  controls.target.set(0, 2.1, 0);
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');

  whenLoaded(container, readout, Promise.all([loadSpring(), environment(renderer, 'metal')]), ([gltf, env]) => {
    scene.environment = env;
    const model = gltf.scene.clone(true);
    const kinds: Record<string, THREE.Mesh[]> = { ceramic: [], band: [], pearls: [], rest: [] };
    const gemMaterial = mirrorStandIn();
    model.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      if (isGem(child)) child.material = gemMaterial; // the gem shader has its own unit
      const name = (child.material as THREE.Material).name;
      kinds[name === 'Ceramic' ? 'ceramic' : name === 'Metal 03' ? 'band' : name === 'Pearl' ? 'pearls' : 'rest'].push(child);
    });
    let lights = 0;
    model.traverse((child) => {
      if (child instanceof THREE.Light) lights++;
    });
    scene.add(fitModel(model, 3));
    const all = Object.values(kinds).flat();

    const show = (kind: string) => {
      const meshes = kind === 'everything' ? all : kinds[kind];
      for (const mesh of all) mesh.visible = meshes.includes(mesh);
      if (kind === 'everything') {
        readout.innerHTML = [
          `the ring: ${all.length} parts, lit only by scene.environment`,
          `lights in the file: ${lights || 'none'}`,
        ].join('<br>');
        return;
      }
      const material = meshes[0].material as THREE.MeshPhysicalMaterial;
      const film = material.userData.gltfExtensions?.WEBGI_materials_thin_film_layer;
      const triangles = count(trianglesOf(meshes[0].geometry));
      readout.innerHTML = [
        `"${material.name}", a ${material.type}: color ${hex(material.color)}`,
        `metalness ${formatNumber(material.metalness, 3)}, roughness ${formatNumber(material.roughness)}, texture maps: ${textureSlots(material).join(', ') || 'none'}`,
        meshes.length > 1 ? `parts: ${meshes.length}, ${triangles} triangles each` : `parts: 1, ${triangles} triangles`,
        film
          ? `iJewel's thin film: in userData, filmFactor ${formatNumber(film.filmFactor, 3)}; three.js's iridescence: ${material.iridescence}`
          : '',
      ].filter(Boolean).join('<br>');
    };
    choiceButtons(buttonGroup(bar, 'show'), [
      { html: 'ceramic', select: () => show('ceramic') },
      { html: 'red band', select: () => show('band') },
      { html: 'pearls', select: () => show('pearls') },
      { html: 'everything', select: () => show('everything') },
    ]);
  });
};

// Spring's biggest flower: five petals, one shape.
const FLOWER = ['Box001', 'Box003', 'Box004', 'Box005', 'Box006'];

// Why it works: the flower's ceramic, with roughness and the light source to change.
export const glaze: SceneSetup = (harness) => {
  const { scene, camera, controls, container, renderer, onFrame } = harness;
  jewelryStage(harness);
  camera.position.set(0, 2.6, 2.6); // until the flower loads; then it's framed on the flower
  controls.target.set(0, 1, 0);
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');

  whenLoaded(container, readout, Promise.all([loadSpring(), environment(renderer, 'metal')]), ([gltf, env]) => {
    // MeshPhysicalMaterial, so the same material can also take a clearcoat.
    const material = new THREE.MeshPhysicalMaterial({ color: CERAMICS.rosa, metalness: 0, roughness: 0, side: THREE.DoubleSide });
    const flower = fitModel(springParts(gltf, FLOWER, material), 1.8, new THREE.Vector3(0, 0.4, 0));
    scene.add(flower);
    // Aim at the flower's middle, from above and in front, with room under it for the controls.
    const middle = new THREE.Box3().setFromObject(flower, true).getCenter(new THREE.Vector3());
    controls.target.copy(middle).y -= 0.25;
    camera.position.copy(middle).add(new THREE.Vector3(0, 2.2, 2.6));
    const lamp = new THREE.PointLight(0xffffff, 40);
    lamp.position.set(1.6, 3, 1.8);
    scene.add(lamp);
    onFrame((delta) => {
      flower.rotation.y += delta * 0.25;
    });

    let room = true;
    const update = () => {
      scene.environment = room ? env : null;
      lamp.visible = !room;
      const rough = material.roughness;
      const coat = material.clearcoat > 0;
      readout.innerHTML = [
        `material.roughness = ${formatNumber(rough)}; material.clearcoat = ${coat ? 1 : 0}`,
        room ? 'lit by: scene.environment, iJewel\'s metal room' : 'lit by: one PointLight, no environment',
        !room
          ? 'one lamp: a small highlight on each curve, and nothing else to reflect'
          : coat && rough >= 0.3
            ? 'a soft body under a clear coat: the glaze is back'
            : rough < 0.15
              ? 'glazed: the room\'s panels and lights, sharp'
              : rough < 0.4
                ? 'satin: the reflections blur'
                : 'plastic: the reflections smear into a soft sheen',
      ].join('<br>');
    };
    slider(bar, 'roughness', { min: 0, max: 1, step: 0.05, value: 0 }, (value) => {
      material.roughness = value;
      update();
    });
    choiceButtons(buttonGroup(bar, 'lit by'), [
      { html: 'the room', select: () => ((room = true), update()) },
      { html: 'one lamp', select: () => ((room = false), update()) },
    ]);
    // Crossing zero recompiles the shader; MeshPhysicalMaterial bumps its version itself.
    choiceButtons(buttonGroup(bar, 'clearcoat'), [
      { html: 'off', select: () => ((material.clearcoat = 0), update()) },
      { html: 'on', select: () => ((material.clearcoat = 1), update()) },
    ]);
  });
};

// Why it works: how much a glazed surface reflects depends on the angle you see it at.
// Schlick's approximation, which three.js's shaders use: 4% head-on for glaze, rising to 100% at the edge.
const fresnel = (cos: number) => 0.04 + 0.96 * Math.pow(1 - cos, 5);

export const edges: SceneSetup = (harness) => {
  const { scene, camera, controls, container, renderer, onFrame } = harness;
  jewelryStage(harness);
  camera.position.set(0, 1.2, 4.2);
  controls.target.set(0, 1.1, 0);
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');

  whenLoaded(container, readout, environment(renderer, 'metal'), (env) => {
    scene.environment = env;
    // Spring's dark red ceramic, so the pale reflection stands out against the body.
    const material = ceramicMaterial(CERAMICS.red);
    const tile = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.3, 0.05), material);
    tile.position.set(-0.85, 1.1, 0);
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.6, 96, 48), material);
    ball.position.set(0.9, 1.1, 0);
    scene.add(tile, ball);
    for (const [text, x] of [['tile', -0.85], ['ball', 0.9]] as const) {
      const tag = label(text, COLORS.white);
      (tag.material as THREE.SpriteMaterial).toneMapped = false;
      tag.position.set(x, 0.2, 0);
      scene.add(tag);
    }

    const normal = new THREE.Vector3();
    const toCamera = new THREE.Vector3();
    let shown = '';
    onFrame(() => {
      // The tile's front faces +Z, measured from the tile itself; turn that into the world.
      normal.set(0, 0, 1).applyQuaternion(tile.quaternion);
      toCamera.subVectors(camera.position, tile.position).normalize();
      const cos = Math.abs(normal.dot(toCamera));
      const angle = Math.round(THREE.MathUtils.radToDeg(Math.acos(Math.min(cos, 1))));
      const lines = [
        `the tile, seen ${angle}° from head-on`,
        `Fresnel: it reflects about ${Math.round(fresnel(cos) * 100)}% of the room (4% head-on)`,
        angle < 60 ? 'mostly its own red, with a faint reflection' : angle < 78 ? 'the reflection is taking over' : "nearly a mirror: the ball's rim does the same",
      ].join('<br>');
      if (lines !== shown) readout.innerHTML = shown = lines;
    });
    slider(bar, 'tilt', { min: 0, max: 88, step: 1, value: 0 }, (value) => {
      tile.rotation.x = -THREE.MathUtils.degToRad(value);
    });
  });
};

// Why it works: Spring's pearl shape twice, as three.js loads it and with a thin film added.
export const pearl: SceneSetup = (harness) => {
  const { scene, camera, controls, container, renderer } = harness;
  jewelryStage(harness);
  camera.position.set(0, 1.05, 3.6);
  controls.target.set(0, 0.85, 0); // below the pearls, to leave room for the two rows of controls
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');

  whenLoaded(container, readout, Promise.all([loadSpring(), environment(renderer, 'metal')]), ([gltf, env]) => {
    scene.environment = env;
    let source: THREE.BufferGeometry | undefined;
    gltf.scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.name === 'GeoSphere002') source = child.geometry;
    });
    // Center a copy and give it a radius of 0.5, so the two pearls fill the frame.
    const shape = source!.clone().center();
    shape.computeBoundingSphere();
    const size = 0.5 / shape.boundingSphere!.radius;
    shape.scale(size, size, size);
    shape.computeBoundingSphere();

    const plain = new THREE.MeshPhysicalMaterial({ ...PEARL, side: THREE.DoubleSide });
    const film = pearlMaterial(0.6);
    const paint = new THREE.MeshStandardMaterial({ color: 0xf4efe6, metalness: 0, roughness: 0.5 });
    const left = new THREE.Mesh(shape, plain);
    left.position.set(-0.65, 1.05, 0);
    const right = new THREE.Mesh<THREE.BufferGeometry, THREE.Material>(shape, film);
    right.position.set(0.65, 1.05, 0);
    scene.add(left, right);
    const place = (text: string, color: string, x: number) => {
      const tag = label(text, color);
      (tag.material as THREE.SpriteMaterial).toneMapped = false;
      tag.position.set(x, 0.4, 0);
      scene.add(tag);
      return tag;
    };
    place('as loaded', COLORS.white, -0.65);
    const filmTag = place('with a film', COLORS.green, 0.65);
    const paintTag = place('white paint', COLORS.orange, 0.65);

    let painted = false;
    const update = () => {
      right.material = painted ? paint : film;
      filmTag.visible = !painted;
      paintTag.visible = painted;
      const strength = film.iridescence;
      readout.innerHTML = painted
        ? [
            "new MeshStandardMaterial({ color: '#f4efe6', roughness: 0.5 })",
            'white paint: a dull, matte ball with no sheen',
          ].join('<br>')
        : [
            `material.iridescence = ${formatNumber(strength)}`,
            `iridescenceThicknessRange: [100, ${film.iridescenceThicknessRange[1]}] (nanometers)`,
            strength === 0
              ? 'no film: polished copper, like the pearl on the left'
              : strength < 0.35
                ? 'faint: a hint of color at the rim'
                : strength <= 0.75
                  ? 'a soft rainbow sheen that moves as you orbit'
                  : 'too strong: hot pink and green, an oil slick',
          ].join('<br>');
    };
    slider(bar, 'iridescence', { min: 0, max: 1, step: 0.05, value: 0.6 }, (value) => {
      film.iridescence = value; // crossing zero recompiles; three.js handles it
      update();
    });
    slider(bar, 'film thickness', { min: 100, max: 1000, step: 20, value: 400 }, (value) => {
      film.iridescenceThicknessRange = [100, value];
      update();
    });
    choiceButtons(buttonGroup(bar, 'right'), [
      { html: 'pearl with a film', select: () => ((painted = false), update()) },
      { html: 'white paint', select: () => ((painted = true), update()) },
    ]);
  });
};
