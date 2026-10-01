// World-space ray helper: diagnose the parent-space mistake.
import { ArrowHelper, Object3D, Vector3 } from 'three';

export function worldArrow(parent: Object3D, origin: Vector3, direction: Vector3): ArrowHelper {
  const helper = new ArrowHelper(direction.clone().normalize(), origin.clone(), direction.length(), 0x3b82f6);
  parent.add(helper);
  return helper;
}
