// Reference repair for drills/3/geometry/winding-order/break-fix-1.
import * as THREE from 'three';

export function flipFrontFace(geometry: THREE.BufferGeometry): THREE.BufferGeometry {
  const copy = geometry.clone();
  const positions = copy.getAttribute('position');
  if (!copy.index) copy.setIndex(Array.from({ length: positions.count }, (_, i) => i));
  const index = copy.index!;
  for (let i = 0; i < index.count; i += 3) {
    const second = index.getX(i + 1);
    index.setX(i + 1, index.getX(i + 2));
    index.setX(i + 2, second);
  }
  index.needsUpdate = true;
  const normals = copy.getAttribute('normal');
  if (normals) {
    for (let i = 0; i < normals.count; i++) {
      normals.setXYZ(i, -normals.getX(i), -normals.getY(i), -normals.getZ(i));
    }
    normals.needsUpdate = true;
  }
  return copy;
}
