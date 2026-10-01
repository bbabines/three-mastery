import { Object3D } from 'three';
export function namedParts(root: Object3D, name: string): Object3D[] {
  const found = root.getObjectByName(name);
  return found ? [found] : [];
}
