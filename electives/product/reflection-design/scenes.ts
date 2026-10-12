import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { measurePanorama, type PanoramaPixels } from '../../jewelry/two-environments/environments';
import { watchLab } from '../lab';

export const studio: SceneSetup = (harness) => watchLab(harness, (lab) => {
  const stats = measurePanorama(lab.environment.image as unknown as PanoramaPixels);
  const metal = lab.materials.get('metal')!;
  const originalRoughness = metal.roughness;
  let mode = 'reference', softness = 0.65, width = 0.8, background = 0.15, count = 4, rotation = 0;
  const panels = () => lab.setPanels({ count, width, softness, background });
  const read = () => lab.setReadout(`${mode}; metal roughness ${metal.roughness.toFixed(3)}; room rotation ${rotation}°\nSource EXR ${stats.width} × ${stats.height}: median ${stats.median.toFixed(3)}, p99 ${stats.p99.toFixed(2)}, max ${stats.max.toFixed(2)}\nSource pixels > 1: ${(100 * stats.shareAbove(1)).toFixed(1)}%; these are pixel counts, not solid-angle-weighted energy\nPanels: ${count}, half-width ${width.toFixed(2)} radians, softness ${softness.toFixed(2)}, dark region ${background.toFixed(2)}`);
  const update = () => { if (mode === 'authored panels') panels(); harness.scene.environmentRotation.y = THREE.MathUtils.degToRad(rotation); read(); };
  lab.addSelect('Environment', {
    'Watch source HDR': () => { mode = 'reference'; lab.setEnvironment('reference'); update(); },
    'Uniform studio': () => { mode = 'uniform'; lab.setEnvironment('uniform'); update(); },
    'Authored panels': () => { mode = 'authored panels'; panels(); update(); },
    'Room environment': () => { mode = 'room'; lab.setEnvironment('room'); update(); },
  });
  lab.addSlider('Panel softness', 0, 1, 0.05, softness, (v) => { softness = v; update(); });
  lab.addSlider('Panel angular half-width', 0.2, 1.5, 0.05, width, (v) => { width = v; update(); });
  lab.addSlider('Dark-region brightness', 0.05, 0.8, 0.05, background, (v) => { background = v; update(); });
  lab.addSlider('Panel count', 1, 8, 1, count, (v) => { count = v; update(); });
  lab.addSlider('Metal roughness', 0.02, 0.6, 0.01, originalRoughness, (v) => { metal.roughness = v; read(); });
  lab.addSlider('Environment rotation (degrees)', -180, 180, 5, rotation, (v) => { rotation = v; update(); });
  lab.addButton('Restore polished case', () => { metal.roughness = originalRoughness; read(); });
  lab.addButton('Capture full orbit sheet', () => lab.captureOrbit());
  lab.registerEvidence(() => ({ mode, count, angularHalfWidthRadians: width, softness, background, rotation, caseRoughness: metal.roughness, sourceStats: { median: stats.median, p99: stats.p99, max: stats.max } }));
  read();
});

export const directions: SceneSetup = (harness) => watchLab(harness, (lab) => {
  const { scene, camera, renderer, onFrame } = harness;
  const raycaster = new THREE.Raycaster();
  const worldPoint = new THREE.Vector3(0, 1.2, 0);
  const worldNormal = new THREE.Vector3(0, 0, 1);
  const towardCamera = new THREE.Vector3();
  const reflected = new THREE.Vector3();
  const normalMatrix = new THREE.Matrix3();
  const normalArrow = new THREE.ArrowHelper(worldNormal, worldPoint, 0.65, 0x64d89c);
  const cameraArrow = new THREE.ArrowHelper(worldNormal, worldPoint, 0.8, 0x68baff);
  const reflectionArrow = new THREE.ArrowHelper(worldNormal, worldPoint, 1.15, 0xffbc55);
  for (const arrow of [normalArrow, cameraArrow, reflectionArrow]) scene.add(arrow);
  let selected = false, part = 'Click a case surface';
  const pick = (event: MouseEvent) => {
    const bounds = renderer.domElement.getBoundingClientRect();
    const point = new THREE.Vector2((event.clientX - bounds.left) / bounds.width * 2 - 1, 1 - (event.clientY - bounds.top) / bounds.height * 2);
    lab.model.updateMatrixWorld(true);
    camera.updateMatrixWorld(true);
    raycaster.setFromCamera(point, camera);
    const hit = raycaster.intersectObject(lab.model, true).find((value) => value.face && value.object instanceof THREE.Mesh);
    if (!hit?.face) return;
    worldPoint.copy(hit.point);
    normalMatrix.getNormalMatrix(hit.object.matrixWorld);
    worldNormal.copy(hit.face.normal).applyMatrix3(normalMatrix).normalize();
    selected = true; part = hit.object.name || 'watch mesh';
    lab.redraw();
  };
  renderer.domElement.addEventListener('click', pick);
  const updateDirections = () => {
    towardCamera.subVectors(camera.position, worldPoint).normalize();
    reflected.copy(towardCamera).negate().reflect(worldNormal).normalize();
    for (const arrow of [normalArrow, cameraArrow, reflectionArrow]) arrow.position.copy(worldPoint);
    normalArrow.setDirection(worldNormal); cameraArrow.setDirection(towardCamera); reflectionArrow.setDirection(reflected);
    const format = (v: THREE.Vector3) => v.toArray().map((x) => x.toFixed(2)).join(', ');
    lab.setReadout(`${selected ? part : 'Click a watch surface, then orbit'}\nGreen: triangle normal; blue: toward camera; amber: sampled environment direction\nReflection world direction (${format(reflected)})\nGeometric mirror demonstration: smooth vertex normals and the normal map can change the rendered direction.`);
  };
  onFrame(updateDirections);
  lab.beforeDraw(updateDirections);
  lab.addButton('Reference studio', () => lab.setEnvironment('reference'));
  lab.addButton('Four soft panels', () => lab.setPanels({ count: 4, width: 0.8, softness: 0.65, background: 0.15 }));
  lab.registerEvidence(() => ({ part, selected, worldPoint: worldPoint.toArray(), geometricNormal: worldNormal.toArray(), environmentDirection: reflected.toArray() }));
  lab.onLeave(() => { renderer.domElement.removeEventListener('click', pick); for (const arrow of [normalArrow, cameraArrow, reflectionArrow]) { scene.remove(arrow); arrow.dispose(); } });
});
