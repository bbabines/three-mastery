import type { Answer } from '@harness/drill';
import { Vector3 } from 'three';
export function blinnHighlight(normal: Vector3, toLight: Vector3, toView: Vector3, shininess: number): Answer<number> {
 const half = toLight.clone().normalize().add(toView.clone().normalize()).normalize();
 return Math.max(0, normal.clone().normalize().dot(half)) ** shininess;
}
