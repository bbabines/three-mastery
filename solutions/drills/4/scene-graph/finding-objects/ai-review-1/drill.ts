import { Object3D } from 'three';
export function namedParts(root: Object3D, name: string): Object3D[] {
  const found: Object3D[] = [];
  root.traverse((part) => { if (part.name === name) found.push(part); });
  return found;
}
