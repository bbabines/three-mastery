import * as THREE from 'three';
import type { SceneSetup } from '@harness/scene';
import { watchLab } from '../lab';

export const meshAudit: SceneSetup = harness => watchLab(harness, lab => {
  const meshes: THREE.Mesh[] = [];
  const originals = new Map<THREE.Mesh, THREE.Material | THREE.Material[]>();
  const smooth = new Map<THREE.Material, THREE.Material>();
  const normal = new THREE.MeshNormalMaterial();
  let triangles = 0, missingNormals = 0, missingTangents = 0, mode = 'reference';
  lab.model.traverse(object => {
    if (!(object instanceof THREE.Mesh)) return;
    meshes.push(object); originals.set(object, object.material);
    const geometry = object.geometry;
    triangles += (geometry.index?.count ?? geometry.getAttribute('position').count) / 3;
    if (!geometry.getAttribute('normal')) missingNormals++;
    if (!geometry.getAttribute('tangent')) missingTangents++;
    for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
      if (!smooth.has(material)) smooth.set(material, material.clone());
    }
  });
  const report = () => lab.setReadout(`${mode} · ${meshes.length} meshes / ${Math.round(triangles).toLocaleString()} triangles\nmissing normals ${missingNormals} · tangent attributes absent ${missingTangents}\nnormal view shows mesh orientation, not the leather normal map`);
  const apply = (next: string) => {
    mode = next;
    smooth.forEach(material => {
      if (material instanceof THREE.MeshStandardMaterial) {
        material.flatShading = mode === 'flat'; material.wireframe = mode === 'wireframe'; material.needsUpdate = true;
      }
    });
    meshes.forEach(mesh => {
      const original = originals.get(mesh)!;
      mesh.material = mode === 'mesh normals' ? normal : mode === 'reference' ? original :
        Array.isArray(original) ? original.map(material => smooth.get(material)!) : smooth.get(original)!;
    });
    report();
  };
  lab.addSelect('inspect geometry', {
    reference: () => apply('reference'), flat: () => apply('flat'),
    wireframe: () => apply('wireframe'), 'mesh normals': () => apply('mesh normals'),
  });
  lab.addSlider('reflection rotation', -180, 180, 5, 0, value => {
    harness.scene.environmentRotation.y = THREE.MathUtils.degToRad(value);
  });
  lab.registerEvidence(() => ({ mode, meshes: meshes.length, triangles, missingNormals, missingTangents }));
  lab.onLeave(() => { originals.forEach((material, mesh) => { mesh.material = material; }); smooth.forEach(material => material.dispose()); normal.dispose(); });
  report();
});

export const edgesAndStitches: SceneSetup = harness => watchLab(harness, lab => {
  const shape = new THREE.Shape();
  shape.moveTo(-0.35, -0.35); shape.lineTo(0.35, -0.35);
  shape.lineTo(0.35, 0.35); shape.lineTo(-0.35, 0.35); shape.closePath();
  const sharpGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.45);
  const bevelGeometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.35, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 4, steps: 1,
  });
  bevelGeometry.center();
  const material = new THREE.MeshStandardMaterial({ color: 0xb2b2b2, metalness: 1, roughness: 0.15 });
  const sharp = new THREE.Mesh(sharpGeometry, material), bevel = new THREE.Mesh(bevelGeometry, material);
  sharp.position.set(-1.85, 0.5, 0); bevel.position.set(1.85, 0.5, 0);
  harness.scene.add(sharp, bevel);
  harness.camera.fov = 38; harness.camera.updateProjectionMatrix();
  harness.camera.position.set(5, 3.5, 7); harness.controls.target.set(0, 0.9, 0);
  const stitches: THREE.Mesh[] = [];
  lab.model.traverse(object => {
    if (object instanceof THREE.Mesh && (Array.isArray(object.material) ? object.material : [object.material]).some(m => m.name === 'stitches')) stitches.push(object);
  });
  let stitchVisible = true, grainVisible = true, rotation = 0;
  const report = () => lab.setReadout(`left sharp / right modeled bevel · identical material\nstitches ${stitchVisible ? 'visible' : 'hidden'} (${stitches.length} meshes) · leather grain ${grainVisible ? 'on' : 'off'}\nnormal texture changes shading; compare silhouettes while orbiting`);
  lab.addSelect('modeled stitching', {
    visible: () => { stitchVisible = true; stitches.forEach(mesh => { mesh.visible = true; }); report(); },
    hidden: () => { stitchVisible = false; stitches.forEach(mesh => { mesh.visible = false; }); report(); },
  });
  lab.addSelect('leather grain shading', {
    on: () => { grainVisible = true; lab.strap.normalMap = lab.normalTexture; lab.strap.needsUpdate = true; report(); },
    off: () => { grainVisible = false; lab.strap.normalMap = null; lab.strap.needsUpdate = true; report(); },
  });
  lab.addSlider('reflection rotation', -180, 180, 5, 0, value => {
    rotation = value; harness.scene.environmentRotation.y = THREE.MathUtils.degToRad(value); report();
  });
  lab.registerEvidence(() => ({ stitchVisible, grainVisible, rotation, bevelStudySize: 0.05, physicalDimensionClaim: false }));
  lab.onLeave(() => { harness.scene.remove(sharp, bevel); sharpGeometry.dispose(); bevelGeometry.dispose(); material.dispose(); });
  report();
});
