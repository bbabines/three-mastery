// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function flipFrontFace(geometry: THREE.BufferGeometry): THREE.BufferGeometry {
  const copy=geometry.clone(); const n=copy.getAttribute('normal'); if(n) for(let i=0;i<n.count;i++) n.setXYZ(i,-n.getX(i),-n.getY(i),-n.getZ(i)); return copy;
}
