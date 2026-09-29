// Scenes for the overdraw reduction page. The README places each one with <div data-scene="name">.
import { buttonGroup, choiceButtons, COLORS, hideFloorHelpers, overlay, sunlight } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const LAYERS = 8;
const OPACITY = 0.07;

export const layers: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  camera.position.set(0.4, 1.3, 4);
  controls.target.set(0, 1.1, -0.5);
  hideFloorHelpers(scene);
  sunlight(scene, new THREE.Vector3(2, 4, 3), 0.6, 2.4);

  // In the overdraw view, every fragment drawn adds this much light, set in sRGB, the numbers that
  // reach the canvas and add up there.
  const step = new THREE.Color().setRGB(0.065, 0.036, 0.016, THREE.SRGBColorSpace);
  const countSolid = new THREE.MeshBasicMaterial({ color: step, blending: THREE.AdditiveBlending });
  const countLayer = new THREE.MeshBasicMaterial({ color: step, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false });
  const countOverlay = new THREE.MeshBasicMaterial({ color: step, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, depthTest: false });

  // A convex product, so a ray through it meets one front face, as the depth test keeps one fragment.
  const product = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 0.7, 8, 32), new THREE.MeshStandardMaterial({ color: COLORS.orange, roughness: 0.4 }));
  product.position.set(0, 1.1, -0.5);
  product.rotation.z = Math.PI / 2;

  // Eight thin fog layers in front of the product, or one layer whose opacity adds them up.
  const fogGeometry = new THREE.PlaneGeometry(7, 4.5);
  const fogColor = new THREE.Color('#8b93a1');
  const thin = new THREE.MeshBasicMaterial({ color: fogColor, transparent: true, opacity: OPACITY, depthWrite: false });
  const thick = new THREE.MeshBasicMaterial({ color: fogColor, transparent: true, opacity: 1 - (1 - OPACITY) ** LAYERS, depthWrite: false });
  const eight = Array.from({ length: LAYERS }, (_, i) => {
    const layer = new THREE.Mesh(fogGeometry, thin);
    layer.position.set(0, 1.1, 1.6 - i * 0.2);
    return layer;
  });
  const one = new THREE.Mesh(fogGeometry, thick);
  one.position.set(0, 1.1, 0.9);

  // A full-screen flash riding in front of the camera, faded out to nothing.
  const flash = new THREE.Mesh(
    new THREE.PlaneGeometry(0.6, 0.3),
    new THREE.MeshBasicMaterial({ color: 'white', transparent: true, opacity: 0, depthTest: false, depthWrite: false }),
  );
  flash.position.z = -0.2;
  flash.renderOrder = 10;
  camera.add(flash);
  scene.add(camera, product, ...eight, one);

  const normalMaterials = new Map<THREE.Mesh, THREE.Material>([
    [product, product.material],
    [one, thick],
    [flash, flash.material],
    ...eight.map((layer) => [layer, thin] as [THREE.Mesh, THREE.Material]),
  ]);
  const state = { oneLayer: false, flashHidden: false, overdrawView: false };
  const apply = () => {
    for (const layer of eight) layer.visible = !state.oneLayer;
    one.visible = state.oneLayer;
    flash.visible = !state.flashHidden;
    for (const [mesh, material] of normalMaterials) {
      mesh.material = state.overdrawView ? (mesh === product ? countSolid : mesh === flash ? countOverlay : countLayer) : material;
    }
  };

  const bar = overlay(container, 'controls');
  choiceButtons(buttonGroup(bar, 'Fog:'), [
    { html: `${LAYERS} layers at ${OPACITY}`, select: () => ((state.oneLayer = false), apply()) },
    { html: `1 layer at ${thick.opacity.toFixed(2)}`, select: () => ((state.oneLayer = true), apply()) },
  ]);
  choiceButtons(buttonGroup(bar, 'Flash:'), [
    { html: '<code>opacity = 0</code>', select: () => ((state.flashHidden = false), apply()) },
    { html: '<code>visible = false</code>', select: () => ((state.flashHidden = true), apply()) },
  ]);
  choiceButtons(buttonGroup(bar, 'View:'), [
    { html: 'normal', select: () => ((state.overdrawView = false), apply()) },
    { html: 'overdraw', select: () => ((state.overdrawView = true), apply()) },
  ]);

  const raycaster = new THREE.Raycaster();
  const center = new THREE.Vector2(0, 0);
  const hits: THREE.Intersection[] = [];
  const readout = overlay(container, 'readout');
  // Runs before each render, so the draw calls are the last frame's.
  onFrame(() => {
    // A ray through the middle of the view meets every layer drawn at the center pixel. The raycaster
    // doesn't skip hidden objects, so only visible ones are tested.
    raycaster.setFromCamera(center, camera);
    hits.length = 0;
    raycaster.intersectObjects([product, one, flash, ...eight].filter((mesh) => mesh.visible), false, hits);
    const fog = hits.filter((hit) => hit.object === one || (eight as THREE.Object3D[]).includes(hit.object)).length;
    const others = [flash, product].filter((mesh) => hits.some((hit) => hit.object === mesh));
    const parts = [`${fog} fog`, ...others.map((mesh) => (mesh === flash ? 'the flash' : 'the product'))];
    readout.textContent = [
      `${state.oneLayer ? `1 fog layer at opacity ${thick.opacity.toFixed(2)}` : `${LAYERS} fog layers at opacity ${OPACITY}`} · ${state.flashHidden ? 'flash.visible = false' : 'flash.material.opacity = 0'}`,
      `fragments shaded at the center pixel: ${fog + others.length} (${parts.join(', ')})`,
      `renderer.info.render.calls ${renderer.info.render.calls}`,
      state.overdrawView ? 'overdraw view: every fragment drawn adds a little light' : 'normal view: the picture looks the same either way',
    ].join('\n');
  });
};
